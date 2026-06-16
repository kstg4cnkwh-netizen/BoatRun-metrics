# BoatRun — User Guide

Two companion web apps that run as PWAs. The **Metrics app** records sessions live on the water from a phone mounted in the boat. The **Analyser app** is used on a desktop or tablet after the session to review data, compare curves, and track progress over time.

-----

## Contents

1. [Getting Started](#1-getting-started)
1. [Metrics App — Setup](#2-metrics-app--setup)
1. [Metrics App — Screens](#3-metrics-app--screens)
1. [Layouts and Tiles](#4-layouts-and-tiles)
1. [Workouts](#5-workouts)
1. [Recording a Session](#6-recording-a-session)
1. [Analyser App — Overview](#7-analyser-app--overview)
1. [Analyser App — Chart and Navigation](#8-analyser-app--chart-and-navigation)
1. [Analyser App — Curve Analysis](#9-analyser-app--curve-analysis)
1. [Analyser App — Map, HR, and Export](#10-analyser-app--map-hr-and-export)
1. [Workout Benchmark Comparison](#11-workout-benchmark-comparison)
1. [Metrics Reference](#12-metrics-reference)
1. [Arc Setup (Scull / Sweep)](#13-arc-setup-scull--sweep)
1. [HR Zones](#14-hr-zones)
1. [Google Drive Sync](#15-google-drive-sync)
1. [Troubleshooting](#troubleshooting)

-----

## 1. Getting Started

**Requirements**

- iPhone mounted in the scull, phone flat (within ~15° of level)
- iOS Safari — open the app URL, then Add to Home Screen to install as a PWA
- Allow Motion and Location permissions when prompted on first launch
- Internet connection for first load and Drive sync — not required on the water once installed

**Two apps, one URL each**

|App                       |Purpose                           |Use on           |
|--------------------------|----------------------------------|-----------------|
|Metrics (`index.html`)    |Live recording on the water       |Phone in scull   |
|Analyser (`analyser.html`)|Post-session review and comparison|Desktop or tablet|

Sessions recorded in Metrics are saved to local storage on the phone and optionally synced to Google Drive. The Analyser reads those Drive files or accepts exported `.json` or `.csv` session files.

-----

## 2. Metrics App — Setup

### First launch

On first open you will see a permission screen. Tap **Allow Motion** and **Allow Location**. Both are needed — motion drives stroke detection, GPS drives pace and distance.

If permissions are denied, go to iOS Settings → Safari → Location and Motion & Orientation Access and set them to Allow.

### Calibration

Before your first session, and whenever you change mounting position, run calibration:

1. Place the phone in the mount in the scull
1. Keep the boat still (resting, not moving)
1. Tap **Calibrate** — the app measures 8 seconds of background noise
1. A jerk threshold and acceleration threshold are calculated from the noise floor and saved automatically
1. The status pill turns green when calibration is done and axis is locked

You do not need to recalibrate every session — calibration persists. Recalibrate if:

- You change which way the phone faces
- Stroke detection seems sluggish or triggering on false catches
- You switch to a different boat

### Mounting

- Mount the phone flat in the boat, screen up, at the stern-most position in the foot stretcher area or rigger area where it will not move
- Closer to the rigger is better — more stroke motion signal
- The long axis of the phone should roughly align with the boat’s long axis
- The phone is mounted **facing the back of the boat** (inverted relative to the direction of travel) — the app accounts for this automatically
- The app auto-detects which sensor axis (X, Y, or Z) has the strongest stroke signal — the axis pill in the corner shows which axis is in use and goes green once locked

-----

## 3. Metrics App — Screens

The app has four main areas, accessed via the tab bar at the bottom (portrait) or right side (landscape):

### 🚣 LIVE

The main display during a session. Shows a tile grid with your chosen metrics updating in real time. Tap any tile to see a brief explanation of that metric.

The stroke detection state shows in the top bar:

- **WAIT** — not rowing, waiting for signal
- **AX:X** (orange) — axis detected, not yet locked
- **AX:X** (green) — axis locked, stroke detection active
- GPS accuracy pill shows signal quality — orange above 8 m, red above 25 m (pace is suppressed when red)

### 📈 CURVE

Shows the IMU acceleration curve catch-to-catch. The last stroke (blue) and 5-stroke rolling average (orange) are overlaid. The vertical dashed line divides drive (left) from recovery (right). The fill shading is green above zero and red below, making the drive and deceleration phases immediately visible.

Four tiles below the curve are configurable — tap any tile to cycle through available metrics.

The curve is the most direct visualisation of stroke mechanics. A clean front-loaded stroke shows a sharp positive peak early in the drive followed by smooth deceleration. A late-loaded or soft stroke will show a broad, delayed peak.

### 🏁 INTERVALS

When a workout is loaded, this tab shows the interval sequence with progress through each step, lap splits, and metrics per completed interval.

### 🏠 HOME

Five sub-panels accessed via the tabs at the top:

- **LOG** — list of all saved sessions; tap any session to see the full summary, lap table, and workout interval breakdown
- **LAYOUTS** — create and select display profiles (which metrics show on the tile grid)
- **WORKOUTS** — build and manage workout programs
- **HR ZONES** — configure heart rate zones for zone-coloured HR display
- **SETTINGS** — outboard length, boat class, distance units, Cox mode, and other configuration

-----

## 4. Layouts and Tiles

### Layout profiles

A layout profile defines:

- How many tiles appear (grid size)
- Which metric each tile shows
- Separate configurations for portrait and landscape orientation

**Built-in profiles**

|Profile  |Portrait     |Landscape    |Best for                        |
|---------|-------------|-------------|--------------------------------|
|Race     |2×4 (8 tiles)|3×3 (9 tiles)|Racing — all key metrics visible|
|Training |2×3 (6 tiles)|3×2 (6 tiles)|General training                |
|Intervals|2×2 (4 tiles)|2×2 (4 tiles)|Structured workouts             |
|Easy     |2×2 (4 tiles)|2×2 (4 tiles)|Low-distraction paddling        |
|Focus    |1×2 (2 tiles)|2×1 (2 tiles)|Drilling a single metric        |

**Creating a profile**

1. Go to HOME → LAYOUTS
1. Tap **+ NEW PROFILE**
1. Enter a name and choose the grid size for portrait and landscape
1. Tap a tile in the preview to assign a metric to it
1. Tap **Save**

Tap any profile name to activate it immediately.

### Assignable metrics

|Key          |Metric                  |Colour|
|-------------|------------------------|------|
|`pace`       |Pace /500m              |🔴     |
|`rate`       |Stroke rate spm         |🟢     |
|`dps`        |Distance per stroke     |🔴     |
|`catch`      |Catch slope (avg / peak)|🔵     |
|`impulse`    |Drive impulse           |🔵     |
|`runloss`    |Run loss                |🔴     |
|`rdi`        |Stroke ratio            |🟢     |
|`laptime`    |Current lap elapsed time|—     |
|`lapdist`    |Current lap distance    |—     |
|`lastlaptime`|Last lap time           |—     |
|`lastlapdist`|Last lap distance       |—     |
|`lastlappace`|Last lap pace           |—     |
|`totaltime`  |Session elapsed time    |—     |
|`totaldist`  |Session total distance  |—     |
|`tod`        |Time of day             |—     |
|`workout`    |Workout step countdown  |—     |
|`empty`      |Blank tile              |—     |

### Curve tab tiles

The four tiles on the CURVE tab are independently configurable. Tap any tile to cycle through the 10 available options:

- Stroke rate
- Catch slope
- Dist/stroke
- Impulse
- Run loss
- Char %
- Pace
- Stroke ratio
- Check Δ
- Arc (Scull) / Arc (Sweep) — label reads the current boat class from settings

-----

## 5. Workouts

### What workouts do

A workout is a structured sequence of steps — warmup, work intervals, rest periods, cooldown. When a workout is loaded:

- The INTERVALS tab shows what’s coming and counts down each step
- The **workout** tile (if assigned) shows the current step type and time remaining
- At the end of each step, metrics are captured for that interval (pace, rate, catch, impulse, char, ratio, run loss, arc, consistency, catch duration, and the averaged IMU curve)
- All interval data is saved with the session and is available for benchmark comparison in the Analyser

### Loading a workout

1. Go to HOME → WORKOUTS
1. Tap the workout you want
1. It loads immediately — the INTERVALS tab becomes active
1. Start your session normally — the workout tracks automatically

### Built-in workouts

|Workout                  |Structure                                |Use for                                       |
|-------------------------|-----------------------------------------|----------------------------------------------|
|**Race 1000m**           |Warmup → 1000m piece → Cooldown          |Race simulation — starts when you begin rowing|
|**Race 2000m**           |Warmup → 2000m piece → Cooldown          |2k time trial                                 |
|**Baseline: Rate Ladder**|Warmup → 4 × (2min / 90s rest) → Cooldown|Fitness and technique baseline testing        |

### Baseline: Rate Ladder

This is the primary repeatable test for tracking fitness and technique over a training block.

**Protocol**

|Rep|Target rate|Work |Rest  |
|---|-----------|-----|------|
|1  |18 spm     |2 min|90 sec|
|2  |20 spm     |2 min|90 sec|
|3  |22 spm     |2 min|90 sec|
|4  |24 spm     |2 min|—     |

Each 2-minute piece is a separate work interval. The app counts down automatically and signals the rest period. Your job is to hold the target rate for each rep — use the rate tile as a guide. Do the test on the same stretch of water in the same direction each time to make pace comparisons valid.

**What to compare across sessions**

Use the Workout Benchmark in the Analyser (see section 11):

- 🟢 Rate, char, ratio, arc — compare these freely across any conditions
- 🔵 Catch slope, impulse, consistency — compare within same boat
- 🔴 Pace, DPS, run loss — only meaningful if conditions and direction are matched

A technique improvement will show in catch slope, impulse, and the shape of the IMU curve across sessions. A fitness improvement at the same rate will show as improved pace (if conditions allow).

### Building a custom workout

1. HOME → WORKOUTS → **+ NEW WORKOUT**
1. Enter a name
1. Add steps using the buttons:

- **Warmup** — ends when you tap Lap
- **Work** — set duration (time in seconds or distance in metres)
- **Rest** — set duration
- **Cooldown** — ends when you tap Lap

1. To create a repeat group: select two or more adjacent steps by tapping their checkboxes, then tap **Group as Repeats** and enter the repeat count
1. Tap **Save**

**Step modes**

- **Time** — counts down a fixed number of seconds
- **Distance** — counts down metres (GPS-dependent)
- **Open** — runs until you tap the Lap button

**Start when rowing** — on distance-based work steps, tick this to hold the countdown until you actually start moving. Useful for a rolling start where you want the piece to begin the moment the boat is moving.

-----

## 6. Recording a Session

### Starting

1. Launch the Metrics app
1. Optionally load a workout from HOME → WORKOUTS
1. Tap **Start** in the control column
1. Begin rowing — stroke detection activates within the first few strokes

The session timer begins when you tap Start. If no workout is loaded, the session records freely until you tap Finish.

### Laps

Tap the **Lap** button to record a lap split at any point. If a workout is loaded, the Lap button advances through workout steps (warmup/cooldown end on Lap; work and rest steps advance automatically on time or distance).

Each lap records:

- Distance and time for that lap
- Average pace, rate, catch, DPS, impulse, run loss, arc, check delta

### Pausing

Tap **Stop** to pause. Tap **Resume** to continue. The session timer pauses; stroke detection resumes as soon as you start rowing again.

### Finishing

Tap **Finish Session**. The session is saved immediately to local storage and queued for Drive upload if you are signed in.

If the app crashes or the page is closed mid-session, the autosave (taken every 30 seconds) is recovered automatically on next open.

### Reviewing a session on the device

HOME → LOG → tap the session. You will see:

- Summary stats (distance, time, pace, rate, catch, stroke count)
- Workout interval breakdown table if a workout was used
- Lap splits table

-----

## 7. Analyser App — Overview

The Analyser is a desktop-first tool for detailed post-session analysis. Open it in a browser on a laptop or tablet.

### Loading a session

**From file:** Drag and drop a `.json` session file onto the drop zone, or click **Browse** and select the file. `.csv` debug exports are also accepted.

**From Google Drive:** Click **Drive**, sign in if prompted, and pick a session from the list. Sessions are stored in a private app folder in your Drive — not visible in the regular Drive interface.

Once a session loads, the drop zone is replaced by the full analysis view.

### Summary cards

A row of summary cards appears at the top of the session view, showing:

- Total distance (GPS)
- Total time
- Stroke count
- Average pace
- Average stroke rate
- Average catch slope (Catch Avg) and peak catch slope (Catch Peak)
- Average DPS
- Average impulse
- Average run loss
- Average oar arc
- Average HR and max HR (if HR data is present)

Each card is colour-coded to match the metric’s category (red = condition-dependent, blue = boat-dependent, green = condition-independent).

### Interface controls

**Theme:** Click **Light Mode / Dark Mode** in the top bar to toggle between dark (default) and light themes. The route map always renders in dark mode.

**Units bar:** Appears when a session is loaded. Controls:

- **Pace:** /500m, /1km, km/h, /mi, mph — changes the pace display throughout the session view
- **Distance:** km or mi — affects total distance and DPS display
- **Oar Arc:** degrees or metres — changes the oar arc display unit

All units apply immediately across charts, cards, tables, and tooltips.

-----

## 8. Analyser App — Chart and Navigation

### Main chart

The main chart shows all stroke metrics plotted over the course of the session. Each metric is a separate series of dots, colour-coded:

|Series     |Colour    |Description                    |
|-----------|----------|-------------------------------|
|Pace       |Green     |Boat speed                     |
|Rate       |Yellow    |Stroke rate in spm             |
|Catch Slope|Blue      |Catch sharpness                |
|DPS        |Red       |Distance per stroke            |
|Impulse    |Orange    |Drive impulse                  |
|Run Loss   |Pink      |Recovery velocity drop         |
|Char %     |Purple    |Drive characteristic position  |
|Ratio      |Blue      |Stroke ratio (recovery ÷ drive)|
|Oar Arc    |Teal      |Oar arc in degrees or metres   |
|Check Delta|Steel blue|Speed swing within a stroke    |
|Catch Dur  |Lavender  |Catch duration in ms           |

**Toggling series:** Click any label in the legend to hide or show that series. Clicking a dimmed label restores it.

**X-axis options:** Use the selector to switch between stroke number, distance (km/mi), and elapsed time (minutes).

**EMA smoothing:** Apply exponential moving average smoothing to reduce noise. Options: 3, 5, 10, 15, 20, or 30 strokes. Affects the visible line only — underlying data is unchanged.

**Zoom buttons:** Use + / − to zoom the X-axis, or scroll / two-finger swipe over the chart.

### Overview strip

The narrow strip below the main chart shows the entire session compressed into a miniature view. Drag the highlighted window to pan to a different part of the session. Drag the edges of the window to zoom in on a region.

### Tooltip

Hover (or tap on touch) over the chart to see a tooltip showing all metric values for the nearest stroke, including stroke number, pace, rate, catch slope, DPS, impulse, run loss, char %, ratio, oar arc, check delta, and catch duration.

### Lap markers

Lap boundaries appear as vertical dashed lines on the main chart. These align with the laps recorded during the session.

### Laps table

The laps table (left column of the lower section) lists each lap with:

- Lap number
- Distance
- Time
- Pace
- Stroke rate
- Avg HR and max HR (if HR data present)

Click any lap row to highlight those strokes in the chart and automatically pan the overview window to that lap.

### Stroke data table

The full stroke-by-stroke table (right column of the lower section) lists every detected stroke with all recorded metrics. Click any column header to sort. The table syncs with chart selections — selecting a range on the chart highlights the corresponding rows.

### Selecting a range

1. Click and drag on the main chart to highlight a range of strokes — the selection turns blue
1. A bar appears above the chart showing the number of strokes selected and the average metrics for that range
1. Click **Pin Curve** to save this selection as a named curve group for comparison (see section 9)
1. Click **Clear** to remove the selection

-----

## 9. Analyser App — Curve Analysis

### What curve groups are

When you pin a selection, the Analyser averages all the raw IMU catch-to-catch curves from those strokes into a single representative curve for that group. You can pin multiple groups — different laps, rate ranges, early vs late in a piece — and compare them side by side.

### Pinning a group

1. Drag a selection on the chart
1. Click **Pin Curve** — the group is added with an auto-generated label (e.g. “S45–S78”) and assigned a colour
1. The selection bar shows a chip for each pinned group

Chips appear at the top of the curve section. Click a chip to re-focus the chart on that group’s strokes. Each group can be dragged or resized on the chart by dragging its chip or its edges.

Click **Clear All** to remove all pinned groups.

### Curve canvas

Each pinned group produces an averaged catch-to-catch acceleration curve drawn in its assigned colour. All curves are overlaid on the same canvas, time-normalised so the drive and recovery phases align. A vertical dashed line marks the drive/recovery boundary.

The fill shading is green above zero and red below, showing the drive impulse (positive acceleration) and the recovery deceleration clearly. The curve shape directly reflects stroke mechanics — peak position, sharpness, and symmetry are all visible.

### Curve stats table

Below the curve canvas, a stats table shows one column per pinned group:

|Metric         |Description                              |
|---------------|-----------------------------------------|
|Sampled strokes|Number of strokes averaged into the curve|
|Stroke rate    |Average spm for this group               |
|Speed          |Average pace for this group              |
|Check Delta    |Average speed swing within a stroke      |
|Char %         |Average drive characteristic position    |
|Catch Slope    |Average catch sharpness (m/s³)           |
|Catch Duration |Average time from body stop to drive     |

### Using curve comparison

Compare curves to see:

- Whether stroke shape is consistent between laps
- How stroke shape changes at different rates
- How catch timing and drive commitment have changed across a training block (when using workout benchmark — see section 11)

A well-loaded front-end stroke shows a tall, sharp peak early in the drive, dropping smoothly through to the finish. A soft or late-loaded stroke shows a lower, broader peak shifted right. A rushed recovery compresses the time axis on the right side.

-----

## 10. Analyser App — Map, HR, and Export

### Route map

If the session contains GPS data, a **Route Map** panel appears in the lower section (left of the stroke data table). The full GPS track is drawn as a line. When curve groups are pinned, each group’s GPS segment is drawn in the group’s colour over the base track, making it easy to see where in the course each curve group was recorded.

The map uses Leaflet.js with CartoDB dark tiles and always renders in dark mode regardless of the app theme.

### Heart rate chart

If a compatible HR monitor was connected during the session, an HR chart appears below the main stroke chart.

- The HR trace is plotted as a line over time
- Zone bands are drawn as coloured horizontal strips using the zone boundaries configured in Metrics (HOME → HR ZONES)
- Average and max HR are shown in the panel label

The HR chart shares the time axis with the main chart. HR data is also included in the summary cards and TCX export.

### TCX export

Click **⬇ Export TCX** (visible once a session is loaded) to download a `.tcx` file compatible with Garmin Connect and Strava.

The TCX file contains:

- Trackpoints with GPS coordinates, timestamp, and HR (if present)
- Lap splits with distance, time, pace, average HR, and max HR
- Activity type: Rowing

This is the primary method for uploading sessions to Strava. Garmin Connect can also import TCX files directly.

-----

## 11. Workout Benchmark Comparison

When you load a session that was recorded using a named workout, a **Workout Benchmark** section appears below the main chart.

### Reading the benchmark

The benchmark shows one table per work interval (Rep 1, Rep 2, etc.) with all recorded metrics for that interval:

|Metric   |Colour|What changing it means                         |
|---------|------|-----------------------------------------------|
|Pace     |🔴     |Faster = better fitness (conditions permitting)|
|Rate spm |🟢     |Should match target for each rep               |
|Catch    |🔵     |Higher = sharper, more aggressive entry        |
|Impulse  |🔵     |Higher = more force into the boat              |
|Char %   |🟢     |Lower = more front-loaded drive                |
|Ratio    |🟢     |Higher = longer recovery, more glide time      |
|Run loss |🔴     |Lower = boat is gliding better                 |
|Arc °    |🟢     |Should be consistent rep to rep                |
|DPS      |🔴     |Higher = more distance per stroke              |
|Consist. |🔵     |Lower = more repeatable catches                |
|Catch Dur|🔵     |Lower = quicker, more direct catch connection  |

Below each rep’s metric table is an **IMU curve canvas** showing the averaged catch-to-catch acceleration profile for that interval.

### Comparing across sessions

Click **Compare via Drive ▾** to load all Drive sessions and find those recorded with the same workout. The app checks every Drive session — progress shows in the button. Matching sessions are added as columns to the table, newest first.

The current session is highlighted in green (●). Each session gets a colour strip in the legend.

IMU curves are overlaid in the canvas below each rep — all sessions in their assigned colours, current session drawn thicker. This makes it immediately visible if stroke shape has changed between sessions.

### Tips for valid comparisons

- Rate is the only reliable cross-session comparison metric in any conditions — if your rate was genuinely the same, technique metrics (catch, impulse, char, ratio, arc, catch duration) are valid to compare
- Pace comparison is only meaningful if you rowed the same section of water in the same direction on both occasions — tide and current shift pace significantly
- The curve shape is condition-independent: if your drive profile has changed, you will see it in the overlaid curves even if pace numbers are incomparable

-----

## 12. Metrics Reference

Metrics are colour-coded by what influences them:

- 🟢 **Green** — condition and boat independent. Valid to compare across any session, any conditions, any boat of the same class
- 🔵 **Blue** — boat dependent. Heavier boats produce lower readings for the same force. Compare within the same boat only
- 🔴 **Red** — condition dependent. GPS-derived. Tide, current, and wind all affect the reading. Only compare sessions in matched conditions

-----

### 🔴 Pace /500m

How long it takes to travel 500m at current speed. Lower is faster.

Smoothed GPS speed over a sliding 12-second window, expressed as mm:ss per 500m. Only shown when GPS accuracy is better than 25m.

**Use:** Set targets for interval pieces (hold 2:05 for this rep). Compare lap to lap within a session. Do not use to compare sessions on different days or water unless conditions are matched.

-----

### 🔴 Moving Pace

Same as Pace but averages only while the boat is actually moving (GPS speed above threshold). Gives a more honest representation of average speed for sessions with stops.

**Use:** Primary pace reference for interval training. Compare moving pace vs average pace — a large gap means significant time was spent stationary between pieces.

-----

### 🔴 Distance Per Stroke (DPS)

How far the boat travels per complete stroke cycle, in metres. GPS-derived.

**Use:** At the same pace, higher DPS means you are achieving it at a lower rating — more efficient. A drop in DPS mid-session at steady rate often signals fatigue. During rate ladders, DPS should stay high even as rate rises; if it drops sharply it means you are spinning without adding efficiency.

Typical values: 7–11m for a single scull depending on rate and conditions.

-----

### 🟢 Stroke Rate (spm)

Strokes per minute. Primary: median interval between detected catches over last 7 strokes. Backed up by autocorrelation of the motion signal when the catch detector is stale.

**Use:** The control variable for structured training. Use rate tiles to hold target rates during pieces. Max rate (session peak) shows the highest sustained rate — useful for assessing race start or sprint capacity.

-----

### 🟢 Stroke Ratio

`recovery time ÷ drive time`, displayed as 1 : X.

A ratio of 1:2 means the recovery takes twice as long as the drive — the textbook target for sculling. Below 1:1.8 indicates a rushed recovery.

**Use:** One of the clearest indicators of a hurried stroke pattern. If ratio drops as rate increases, the rower is handling the higher cadence by shortening the recovery rather than quickening the drive. Target: hold above 1:2 at all training rates.

-----

### 🟢 Stroke Characteristic (Char %)

Where in the drive phase the peak acceleration occurs. 0% = at catch entry, 100% = at finish.

- 30–45% is front-loaded — typical of a powerful, well-timed drive
- 50–60% is mid-drive — acceptable
- Above 65% is back-loaded — often indicates a soft catch or late blade engagement

**Use:** Consistent char % is as important as the number itself. Rising char through a session indicates the catch is deteriorating under fatigue. Use alongside catch slope: high slope + low char = clean, aggressive front-end loading.

-----

### 🟢 Arc — Scull / Sweep (degrees)

The arc the oar sweeps through the water during the drive, in degrees. Derived from GPS distance during the drive phase and your configured oar geometry. A blade slip allowance (~10%) is applied. See section 13 for setup.

**Use:** Consistent arc across strokes indicates full, repeatable drive length. A sudden drop mid-session signals a shortened or missed stroke. Low and variable arc together is a warning: the rower is not committing to the full drive.

Typical values: 85–110° depending on rigging and boat class.

-----

### 🔵 Catch Slope (Catch / Peak)

The sharpness of the acceleration spike at the catch, measured as the rate of change of acceleration (m/s³). Higher = more aggressive, faster loading onto the blade.

Two values are shown: rolling 8-stroke average (Catch) and session maximum (Peak).

**Use:** Rising catch slope as rate increases is a good sign — the rower is adapting rather than softening the catch. Falling catch slope at higher rates means the catch is being sacrificed for cadence. Compare catch avg vs catch peak: a large gap means the rower can produce a clean catch but cannot sustain it.

Note: affected by boat mass. Only compare within the same boat class.

-----

### 🔵 Catch Consistency

Standard deviation of recent catch slope values. Lower = more repeatable catches.

**Use:** A rower with high catch slope but poor consistency is unpredictable. Target consistency below 20% (ideally below 10% for experienced scullers). Consistency worsening late in a session is an early fatigue indicator — usually appears before pace deteriorates.

-----

### 🔵 Catch Duration (ms)

Time from the deceleration spike at body stop and blade entry until drive force builds and the boat accelerates. Measured in milliseconds.

**Use:** Shorter catch duration means a quicker, more direct connection between blade entry and load. A long catch duration indicates a pause, slack, or hesitation at the catch — the blade is in the water but not yet loaded. Compare catch duration against catch slope: high slope but long duration suggests an aggressive entry that isn’t immediately converting to drive force.

-----

### 🔵 Drive Impulse

Total positive acceleration delivered to the hull during the drive phase. Integral of the accelerometer signal across the drive. Higher = more sustained push per stroke.

Boat-class note: a single scull has far less mass than a crew boat, so impulse values are not comparable across boat classes.

**Use:** The condition-independent measure of how hard the boat was pushed. Impulse rising at constant pace means increasing effort for the same result — headwind or fatigue. Impulse falling at improving pace means increasing efficiency. Track impulse at fixed rates across a season to monitor power development.

-----

### 🔴 Run Loss

How much the boat slows down during the recovery phase, expressed as a velocity drop (m/s) and percentage of peak speed.

IMU-derived: the app integrates accelerometer data across a 2-second window after the drive ends and measures the velocity drop.

- Below 15% is good for sculling
- Above 25% usually indicates something actively disrupting the run — checking, poor balance, rough water
- Run loss % is self-normalising: 15% means the same thing at 1:45 pace and 2:10 pace

**Use:** Read alongside impulse. High impulse + high run loss means the boat is being pushed hard but the energy is being wasted in deceleration — often means the rating is too low for the force being applied, or the rower is coming forward too aggressively. Low impulse + low run loss = efficient, consistent drive.

-----

### 🔵 Check Delta (m/s)

The total speed swing within a single stroke cycle — maximum velocity minus minimum velocity from catch to catch. Lower = smoother, more continuous boat run.

IMU-derived from integrated accelerometer velocity.

**Use:** A high check delta means the boat is accelerating and decelerating sharply within each stroke. This wastes energy overcoming inertia. Check delta should decrease as efficiency improves. It tends to be higher in single sculls than crew boats. Compare check delta against run loss — they often move together, but a high check delta with low run loss suggests a powerful but jerky drive rather than a disrupted recovery.

-----

## 13. Arc Setup (Scull / Sweep)

Arc is calculated from GPS drive distance and your oar geometry. Set the correct values in HOME → SETTINGS.

### Outboard length

The outboard is the distance from the pin (swivel/gate) to the tip of the blade. This is the lever arm used in the arc calculation.

**Typical values:**

|Setup                  |Outboard     |
|-----------------------|-------------|
|Single scull (sculling)|1.88 – 1.92 m|
|Sweep (bow-side / 8+)  |2.54 – 2.62 m|
|Sweep (stroke-side)    |2.54 – 2.62 m|

Measure your actual outboard for best accuracy. Stroke-to-stroke consistency matters more than absolute accuracy — a slightly wrong outboard shifts all values by the same factor.

### Boat class

Set boat class to **Scull** or **Sweep** in settings. This affects:

- The default outboard length
- The arc geometry (sculling uses two oars; the calculation uses the single-oar outboard in both cases, so only set the outboard for one side)

### What the formula does

```
θ = 2 × arcsin(drive_distance / (2 × outboard_length))
```

A 10% blade slip fraction is subtracted from the drive distance before calculation to account for the portion of the arc where the blade is not fully locked — at catch entry and finish extraction.

-----

## 14. HR Zones

Heart rate zones are configured in HOME → HR ZONES. Four zone models are available:

|Model        |Based on                          |Best for                                 |
|-------------|----------------------------------|-----------------------------------------|
|Friel/Coggan |Lactate threshold HR (LTHR)       |Trained athletes with a field test result|
|Karvonen     |Heart rate reserve (max − resting)|Accounts for fitness via resting HR      |
|% Max HR     |Percentage of max HR              |Simple, widely used                      |
|Age-predicted|220 − age                         |No data needed; least accurate           |

Set your Max HR, LTHR, Resting HR, and Age. The app computes zone boundaries and displays them as coloured band overlays in the HR chart in the Analyser.

**Current zones (Friel model defaults)**

|Zone|Range        |Effort          |
|----|-------------|----------------|
|Z1  |90 – 106 bpm |Recovery        |
|Z2  |107 – 124 bpm|Aerobic base    |
|Z3  |125 – 142 bpm|Tempo           |
|Z4  |143 – 160 bpm|Threshold       |
|Z5  |> 160 bpm    |VO2 max / sprint|

HR data is recorded when a compatible HR monitor is connected during the session. It appears as a line chart in the Analyser with zone bands behind it.

-----

## 15. Google Drive Sync

Sessions sync automatically to a private app folder in your Google Drive. They are not visible in the regular Drive interface.

### Signing in

Tap the **☁ Drive** button in the Metrics top bar or Analyser top bar. A sign-in popup opens. Once signed in, the button shows your account status.

### How sync works

- Sessions are uploaded automatically when a session ends, provided you are signed in and have a connection
- If upload fails (no signal on the water), sessions are queued and retry automatically the next time the app is opened while connected
- The session list in HOME → LOG shows a **synced** badge for sessions confirmed on Drive

### Loading sessions in the Analyser

1. Open the Analyser
1. Click **Drive**
1. Sign in if prompted
1. Select a session from the list

Sessions are listed by date. The list shows distance and duration for each session.

### Benchmark comparison via Drive

The Workout Benchmark (see section 11) also uses Drive. When you click **Compare via Drive**, the Analyser fetches every session on Drive, identifies those recorded with the same workout, and loads their interval data for comparison. This checks sessions one at a time — a large Drive library may take 20–30 seconds to scan. Progress is shown in the button.

-----

## Troubleshooting

**Stroke detection not triggering**

- Run calibration with the phone in the mount and the boat still
- Check the axis pill — if it stays orange for more than a minute, the stroke signal is too weak on all axes
- Ensure the phone is mounted firmly and not vibrating independently of the boat

**Pace showing — or dropping out mid-session**

- GPS accuracy must be better than 25m. The accuracy pill shows current signal quality.
- Under bridges or near tall buildings, GPS can drop out temporarily. Pace resumes when accuracy recovers.
- In tidal water, pace will show the over-ground speed including current — this is expected.

**Session not saving**

- A failed save shows a warning toast. The session is autosaved every 30 seconds to a recovery slot.
- On next open, if a recovery session is found, you are prompted to restore it.

**Drive sync failing**

- Check you are signed into Drive (☁ button)
- Sessions in the pending queue retry automatically on reconnect
- If a session repeatedly fails to upload, export it as a JSON file from the session detail view as a backup

**Axis not locking**

- The axis pill turns green after ~4 strokes are detected with consistent signal
- If it stays orange, try rowing with more deliberate catch movements for the first few strokes to help the detector find the signal

**Session loads in Analyser but chart is empty**

- Check the metric legend — all series may be toggled off. Click any legend label to restore it.
- Zoom out using the − button or drag the overview window edges to show the full session

**TCX export not appearing on Strava**

- Ensure the TCX file downloaded completely before uploading
- On Strava, use Manual Upload → select the `.tcx` file → set activity type to Rowing
- GPS data must be present in the session — sessions recorded without location permission will not produce a valid TCX track