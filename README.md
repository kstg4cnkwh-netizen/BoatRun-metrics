# 🚣 Scull Metrics v3

![Platform](https://img.shields.io/badge/platform-PWA%20%7C%20iOS%20Safari-blue)
![Sensors](https://img.shields.io/badge/sensors-IMU%20%2B%20GPS-green)
![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-private-lightgrey)

A real-time rowing performance tracking system using device motion + GPS fusion to detect strokes, compute biomechanics metrics, and generate post-session analytics.

-----

## ✨ Key Features

### 🚀 Real-Time Tracking

- Stroke rate (SPM) via hybrid autocorrelation + interval detection
- Distance per stroke (DPS)
- Catch slope (jerk peak detection)
- Stroke character (drive timing distribution)
- Run loss (% speed decay per stroke cycle)
- Drive impulse estimation
- Effective oar arc

### 🧠 Intelligent Stroke Detection

- Multi-axis IMU auto-selection
- Adaptive jerk threshold calibration
- Finite State Machine: IDLE → CATCH → DRIVE → RECOVERY
- Automatic axis switching (x/y/z)
- Drift-resistant stroke segmentation

### 🌍 GPS + Motion Fusion

- Haversine-based distance tracking
- EMA-smoothed GPS speed
- Pace calculation (/500m)
- Velocity window analysis for run-loss

### 📊 Post-Session Analytics

- Stroke-by-stroke breakdown
- Autosave + recovery system
- Curve reconstruction (catch-to-catch acceleration)
- Session history storage

### ☁️ Cloud Sync

- Google Drive upload integration
- Offline queue + retry sync
- Session sync tracking

-----

## 🧩 System Architecture

IMU → Axis Selection → Jerk Detection → FSM → Stroke Segmentation → GPS Fusion → Metrics → Storage/Sync

-----

## ⚙️ Calibration

startCalibration()

Outputs:

- Noise floor
- Jerk threshold
- Acceleration threshold

-----

## 🌊 Metrics

Metrics are colour-coded by what influences them:

- 🟢 Green — condition and boat independent (valid across all boats and water states)
- 🔵 Blue — boat dependent (mass affects the reading; compare within the same boat class)
- 🔴 Red — condition dependent (current, tide, and wind affect the reading)

-----

### 🔴 Pace

```
pace = (500 / gps_speed_m_s) seconds

Smoothed over a short distance-time window (~3-12s)
```

What it measures: how long it takes to travel 500m at current speed, expressed as mm:ss.

In plain terms:

- The headline speed number. Lower is faster.
- Because it comes from GPS, it includes any effect of current or tide — a tailwind or flowing river will show a faster pace for the same effort
- Not reliable for comparing sessions on different water bodies or directions unless conditions are identical

Practical use:

- Use as a target during structured sessions (e.g. hold 2:05 for 4 x 500m)
- Compare lap-to-lap within a session where conditions are stable
- Do not use to compare technique across sessions on different days or water states — use rate and impulse instead

-----

### 🔴 Moving Pace

```
Only counted while GPS speed > threshold (i.e. boat is actually moving)
```

What it measures: average pace excluding any stationary time (e.g. waiting at the start, resting between pieces).

In plain terms:

- More honest than raw average pace for sessions with rest intervals
- A rower who stops completely between pieces will see a meaningfully different moving vs average pace
- Still condition-dependent like all GPS-derived metrics

Practical use:

- Use as the primary pace reference for interval sessions
- Compare with average pace — a big gap means significant time was spent stationary

-----

### 🔴 Distance Per Stroke (DPS)

```
dps = gps_distance_delta / stroke_count

Valid when stroke interval is stable (0.8-8s) and GPS movement is clean (>0.5m, <25m per stroke)
```

What it measures: how far the boat travels per complete stroke cycle.

In plain terms:

- A direct measure of boat efficiency per stroke
- Higher DPS means more distance is being extracted from each pull
- At the same pace, a rower with higher DPS is working at a lower rate, which is generally more efficient
- Conditions affect this directly — a headwind reduces DPS for the same effort

Practical use:

- Use DPS alongside rate: if DPS drops as rate increases, the rower is spinning without adding efficiency
- A drop in DPS mid-session at steady rate often signals fatigue — the stroke is shortening
- Classic target for technique drills: slow rating pieces should show high DPS; if they don’t, the blade work is poor
- Example: DPS of 8.5m at rate 22 is better than 7.8m at rate 22 — the extra 0.7m per stroke adds up to 70m per 100 strokes

-----

### 🟢 Stroke Rate (SPM)

```
Primary: median interval between detected catches
Backup: autocorrelation of motion signal
Blended and smoothed across recent strokes
```

What it measures: strokes per minute.

In plain terms:

- The cadence of rowing. Higher rate means more strokes per minute.
- Rate alone tells you nothing about quality — a rate 28 piece with poor technique is slower than a clean rate 22
- Max rate (shown in session summary) indicates the highest rate sustained, useful for sprint or race-pace assessment

Practical use:

- Use rate as a control variable in training: set a target rate and assess what happens to impulse, DPS, and run loss
- Rate 18-20 is typical for steady-state aerobic work; 24-28 for race-pace; 30+ for sprint efforts
- A rower who cannot hold technique above rate 26 has a clear ceiling to work on
- Compare max rate to average rate — a big gap may indicate a poor start or a short sprint at the end

-----

### 🟢 Oar Angle

```
theta = 2 x arcsin(D / 2L)

Where:
* D = GPS distance travelled during the drive phase
* L = oar length (inboard + outboard, set in config)
* A slip fraction (~10%) accounts for blade movement at catch and finish that does not propel the boat
```

What it measures: the arc the oar sweeps through the water during the drive phase, in degrees.

In plain terms:

- A full, clean stroke should produce a consistent angle around 90-110 degrees depending on rigging
- Because this is derived from boat movement rather than a sensor on the oar, it reflects the effective arc — the part where the blade was actually doing work
- Consistency across strokes matters more than the absolute number

Practical use:

- A sudden drop in oar angle mid-session signals a missed catch, early extraction, or the rower rushing through the drive — often a fatigue indicator
- Low and variable oar angle together is a red flag: the rower is not committing to the full stroke
- Use during technique drills to confirm the rower is getting the full arc — a drill that produces shorter arc than normal paddling is losing the finish
- Oar angle is boat-mass and condition independent, so it can be compared across sessions and conditions

-----

### 🟢 Stroke Characteristic

```
rawChar = (peakOffset / driveDur) * 100
```

What it measures: where during the drive phase the peak acceleration (peak force) occurs, expressed as a percentage from catch (0%) to finish (100%).

In plain terms:

- 30-40% means the boat is being accelerated hardest in the early drive — this is typical of a powerful, front-loaded style
- 50-60% means peak force is in the middle of the drive — common and acceptable
- Above 70% means the rower is loading late, often a sign of a weak catch or the blade slipping before engagement
- The number should be consistent stroke to stroke — high variability means the stroke pattern is not repeatable

Practical use:

- Use to distinguish rowing styles: scullers naturally tend later than sweep rowers
- If characteristic creeps towards 70%+ as a session progresses, the catch is deteriorating under fatigue
- A coach targeting front-end loading can use this to track whether drills are having the desired effect
- Characteristic and catch slope together tell a complete story: high slope + early characteristic = powerful, clean entry; low slope + late characteristic = soft, missed catch

-----

### 🟢 Stroke Ratio

```
ratio = recovery_time / drive_time

Displayed as 1 : X.XX
```

What it measures: for every second of drive, how many seconds are spent on the recovery.

In plain terms:

- A ratio of 1:2 means the recovery is twice as long as the drive — the textbook target for sculling
- 1:1.5 means a rushed recovery — not enough time to set up properly for the next catch
- 1:2.5+ is very slow, common at low ratings and not necessarily a problem

Practical use:

- Rushing the recovery (ratio below 1:1.8) is one of the most common technique faults and usually shows up here before a coach spots it visually
- Use during rate ladders: if ratio drops sharply as rate increases, the rower is handling the increase by rushing recovery, not by increasing stroke speed
- A rower with a consistently short ratio under pressure will develop a check in the boat — the quick return catches the hull while it still has run
- Target: hold ratio above 1:2 at all training rates up to race pace

-----

### 🔵 Catch Slope (Catch Avg / Catch Peak)

```
catchSlope = abs(catchPeakJerk)   (m/s^3)

Smoothed over recent strokes (~8 stroke rolling average)
Session peak = highest single value recorded
```

What it measures: how sharply and forcefully the rower loads onto the water at the catch — the rate of change of acceleration at entry.

In plain terms:

- Higher = more aggressive, faster load onto the blade
- Lower = softer, more gradual connection — the blade slips before the rower commits
- Very high values can indicate slamming rather than a clean catch — aggression without control
- The catch peak (session high) shows the best single catch the rower produced; catch avg shows what they sustain

Practical use:

- Use catch avg as the primary consistency indicator: a rower with high avg and low variability has a reliable entry
- Catch peak vs catch avg gap: a rower who spikes high occasionally but averages low is inconsistent — they know how to catch cleanly but cannot reproduce it
- Catch slope is affected by boat mass (heavier boat = lower reading for same force), so only compare within the same boat class
- Rising catch slope as rate increases is good — the rower is adapting. Falling catch slope at higher rates means the catch is being sacrificed for cadence

-----

### 🔵 Catch Consistency

```
consistency = rolling coefficient of variation of catchSlope values
```

What it measures: how repeatable the catch is across strokes — low values mean the catch is the same every stroke.

In plain terms:

- Consistency is the standard deviation of recent catch slopes expressed relative to the average
- A rower with high catch avg but poor consistency is unpredictable — some strokes are great, others miss
- A beginner will naturally have poor consistency; an experienced sculler should be well below 20%

Practical use:

- Use consistency as a drill quality check: if consistency worsens during a technical drill, the rower is not ingraining the pattern
- A rower who is consistent at rate 20 but inconsistent at rate 26 has found their technique ceiling
- Monitor consistency through a session: deteriorating consistency late in a long piece is an early fatigue signal, before pace falls

-----

### 🔵 Impulse

```
impulse = sum(acceleration x dt) over drive phase

impulse += samples[i].v * dt
```

What it measures: total acceleration delivered to the boat hull during the drive phase — a proxy for how hard the boat was pushed each stroke.

In plain terms:

- Impulse measures how big a shove the boat received each stroke. A high number means a strong, connected drive.
- Think of it like a shove vs a tap: the same total effort can produce very different impulse depending on how quickly and forcefully it is applied
- A higher impulse per stroke means a bigger speed-up during the drive

Boat-class note:

- Impulse depends on boat mass. A single scull accelerates far more than an eight for the same oar force, so impulse readings will be much higher in a single. Only compare within the same boat class.

Rate vs impulse trade-off:

- Two rowers can achieve the same average pace with very different combinations
- Example A — Rate 24, impulse 0.8: moderate strokes at moderate cadence
- Example B — Rate 18, impulse 1.1: fewer but harder strokes, longer glide between them
- Both may show the same pace, but Example B will show higher run loss because the larger velocity spike costs disproportionately more energy to drag (drag scales with velocity squared)
- Elite crews find the rate where impulse x rate is maximised with the least velocity fluctuation — this is why run loss and impulse should always be read together

Practical use:

- Use impulse to track whether a rower is applying more power to the boat over a training block, independent of conditions
- Impulse rising while pace holds steady = the rower is working harder for the same result — a sign of fatigue, poor run, or headwind
- Impulse falling while pace improves = the rower is getting more efficient — less force needed for the same speed
- Compare impulse at fixed rates across sessions: impulse at rate 20 should rise as a rower gets stronger through a season

-----

### 🔴 Run Loss

```
runLossPct = (dv / v0) * 100         (primary display)
runLossMps = dv                       (secondary display, m/s)

Where:
* dv = velocity drop measured by IMU integration across the recovery phase
* v0 = GPS speed at the end of the drive phase
```

What it measures: how much the boat slows down between strokes, expressed as a percentage of peak speed per stroke. Also shown as the raw velocity drop in m/s.

In plain terms:

- A low run loss means the boat glides well through the recovery — energy put in during the drive is not being wasted
- A high run loss means the boat is stopping and starting, which costs more energy to drag (going briefly faster is disproportionately expensive)
- Run loss % is self-normalising across speeds: 15% means the same thing at 1:45 pace and 2:10 pace
- The m/s figure gives the absolute velocity drop, useful for understanding how dramatically speed is fluctuating

Practical use:

- Low rating with high impulse + high run loss: the rower is pushing the boat hard but losing it all in the glide — a cue to raise rating or improve recovery posture
- High rating with low impulse + low run loss: the boat is being driven consistently with minimal fluctuation — efficient
- Run loss rising during a session without a rate change is a sign the rower is beginning to check the boat on the return — a fatigue or balance indicator
- Target: below 15% is good for sculling; above 25% usually means something is actively disrupting the run (washing out, heavy check, very rough water)
- Combining impulse and run loss gives a complete picture of whether power is being converted into forward motion or lost to the recovery

-----

## 📱 Requirements

- iOS Safari recommended
- Motion + Location permissions
- Stable device mounting
- Mounted flat (<15 degrees of level)
- Portrait or landscape orientation

-----

## 🚀 Pipeline

handleMotion → runFSM → onStrokeFinish → metrics → UI + sync

-----

## 📄 License

Private / internal use
