const DriveSync = (() => {
  const CLIENT_ID   = '729480414852-kko8e7bi3r38tcg2rf6iiupptagoegpc.apps.googleusercontent.com';
  const SCOPE       = 'https://www.googleapis.com/auth/drive.file';
  const FOLDER_NAME = 'ScullMetrics';
  const API         = 'https://www.googleapis.com/';

  let tokenClient    = null;
  let accessToken    = null;
  let tokenExpiry    = 0;
  let folderId       = null;
  let pendingResolve = null;
  let pendingReject  = null;
  let initPromise    = null;   // ← singleton guard

  // ── Init (singleton) ────────────────────────────────────────────────────
  function init() {
    if (initPromise) return initPromise;   // already running or done
    initPromise = new Promise((resolve, reject) => {
      function setup() {
        if (!window.google?.accounts?.oauth2?.initTokenClient) {
          initPromise = null;              // allow retry
          reject(new Error('GIS not ready'));
          return;
        }
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPE,
          callback: (resp) => {
            if (resp.error || !resp.access_token) {
              const err = new Error(resp.error_description || resp.error || 'Auth failed');
              if (pendingReject) { pendingReject(err); pendingReject = null; pendingResolve = null; }
              _updateUI(false);
              return;
            }
            accessToken = resp.access_token;
            tokenExpiry = Date.now() + (resp.expires_in - 60) * 1000;
            ensureFolder().catch(() => {});
            if (pendingResolve) { pendingResolve(accessToken); pendingResolve = null; pendingReject = null; }
            _updateUI(true);
          },
          error_callback: (err) => {
            if (pendingReject) { pendingReject(new Error(err.type || 'popup_closed')); pendingReject = null; pendingResolve = null; }
          }
        });
        const hint = localStorage.getItem('_drive_hint');
        if (hint) tokenClient.login_hint = hint;
        _updateUI(false);
        resolve();
      }

      if (window.google?.accounts?.oauth2?.initTokenClient) {
        setup();
      } else {
        // Check if script already in DOM (avoid double-append)
        if (!document.querySelector('script[src*="accounts.google.com/gsi"]')) {
          const s = document.createElement('script');
          s.src = 'https://accounts.google.com/gsi/client';
          s.onload  = () => setTimeout(setup, 0);   // let GIS finish its own init
          s.onerror = () => { initPromise = null; reject(new Error('GIS failed to load')); };
          document.head.appendChild(s);
        } else {
          // Script tag exists but not loaded yet — poll
          const t = setInterval(() => {
            if (window.google?.accounts?.oauth2?.initTokenClient) {
              clearInterval(t);
              setup();
            }
          }, 50);
        }
      }
    });
    return initPromise;
  }

  // ── Auth ────────────────────────────────────────────────────────────────
  async function signIn() {
    await init();
    return new Promise((resolve, reject) => {
      if (isSignedIn()) { resolve(accessToken); return; }
      pendingResolve = resolve;
      pendingReject  = reject;
      tokenClient.requestAccessToken({ prompt: 'select_account' });
    });
  }

  function signOut() {
    if (accessToken) google.accounts.oauth2.revoke(accessToken, () => {});
    accessToken = null; tokenExpiry = 0; folderId = null;
    localStorage.removeItem('_drive_hint');
    _updateUI(false);
    toast('Drive unlinked');
  }

  function isSignedIn() {
    return !!accessToken && Date.now() < tokenExpiry;
  }

  // ── Drive REST helpers ──────────────────────────────────────────────────
  async function _ensureToken() {
    await init();
    if (!isSignedIn()) await signIn();
    if (!accessToken) throw new Error('Not authenticated');
  }

  async function _req(method, path, { params, jsonBody } = {}) {
    await _ensureToken();
    let url = API + path;
    if (params) url += '?' + new URLSearchParams(params);
    const opts = { method, headers: { Authorization: 'Bearer ' + accessToken } };
    if (jsonBody !== undefined) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(jsonBody);
    }
    const r = await fetch(url, opts);
    if (r.status === 401) { accessToken = null; throw new Error('Token expired — please re-link Drive'); }
    if (!r.ok) { const msg = await r.text().catch(() => r.status); throw new Error(`Drive API ${r.status}: ${msg}`); }
    const ct = r.headers.get('content-type') || '';
    return ct.includes('json') ? r.json() : r.text();
  }

  async function _multipart(method, path, meta, content) {
    await _ensureToken();
    const boundary = 'scull_' + Math.random().toString(36).slice(2);
    const body = [
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}`,
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${content}`,
      `--${boundary}--`
    ].join('\r\n');
    const r = await fetch(`${API}upload/drive/v3/files${path}?uploadType=multipart`, {
      method,
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': `multipart/related; boundary=${boundary}` },
      body
    });
    if (!r.ok) { const msg = await r.text().catch(() => r.status); throw new Error(`Drive upload ${r.status}: ${msg}`); }
    return r.json();
  }

  // ── Folder ──────────────────────────────────────────────────────────────
  async function ensureFolder() {
    if (folderId) return folderId;
    const res = await _req('GET', 'drive/v3/files', {
      params: {
        q: `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id)', spaces: 'drive'
      }
    });
    if (res.files?.length) { folderId = res.files[0].id; return folderId; }
    const created = await _req('POST', 'drive/v3/files', {
      jsonBody: { name: FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' }
    });
    folderId = created.id;
    return folderId;
  }

  // ── Upload ──────────────────────────────────────────────────────────────
  function _filename(session) {
    const d = new Date(session.startTime);
    const p = n => String(n).padStart(2, '0');
    return `RowSess_${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}.json`;
  }

  async function upload(session) {
    await _ensureToken();
    const folder  = await ensureFolder();
    const name    = _filename(session);
    const content = JSON.stringify(session);
    const found   = await _req('GET', 'drive/v3/files', {
      params: { q: `name='${name}' and '${folder}' in parents and trashed=false`, fields: 'files(id)', spaces: 'drive' }
    });
    if (found.files?.length) {
      const r = await fetch(`${API}upload/drive/v3/files/${found.files[0].id}?uploadType=media`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: content
      });
      if (!r.ok) throw new Error(`Drive update ${r.status}`);
    } else {
      await _multipart('POST', '', { name, parents: [folder] }, content);
    }
  }

  // ── List / fetch ────────────────────────────────────────────────────────
  async function list() {
    await _ensureToken();
    const folder = await ensureFolder();
    const res = await _req('GET', 'drive/v3/files', {
      params: {
        q: `'${folder}' in parents and name contains 'RowSess_' and trashed=false`,
        fields: 'files(id,name,modifiedTime)', orderBy: 'modifiedTime desc', pageSize: '200'
      }
    });
    return res.files || [];
  }

  async function fetchSession(fileId) {
    const raw = await _req('GET', `drive/v3/files/${fileId}`, { params: { alt: 'media' } });
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  }

  // ── UI ──────────────────────────────────────────────────────────────────
  function _updateUI(signedIn) {
    const btn = document.getElementById('drive-btn');
    const dot = document.getElementById('drive-dot');
    if (btn) btn.textContent = signedIn ? '⊟ Drive' : '⊞ Drive';
    if (dot) dot.style.display = signedIn ? 'inline-block' : 'none';
  }

  return { init, signIn, signOut, isSignedIn, upload, list, fetchSession, ensureFolder };
})();
