# 🚣 Scull Metrics v3

![Platform](https://img.shields.io/badge/platform-PWA%20%7C%20iOS%20Safari-blue)
![Sensors](https://img.shields.io/badge/sensors-IMU%20%2B%20GPS-green)
![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-private-lightgrey)

A real-time rowing performance tracking system using device motion + GPS fusion to detect strokes, compute biomechanics metrics, and generate post-session analytics.

---


## ✨ Key Features

### 🚀 Real-Time Tracking
- Stroke rate (SPM) via hybrid autocorrelation + interval detection
- Distance per stroke (DPS)
- Catch slope (jerk peak detection)
- Stroke character (drive timing distribution)
- Run loss (% speed decay per stroke cycle)
- Drive impulse estimation
- RDI (Recovery vs Drive balance)

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

---

## 🧩 System Architecture

IMU → Axis Selection → Jerk Detection → FSM → Stroke Segmentation → GPS Fusion → Metrics → Storage/Sync

---

## ⚙️ Calibration

startCalibration()

Outputs:
- Noise floor
- Jerk threshold
- Acceleration threshold

---

## 🌊 Metrics

- Pace

    * Uses recent GPS velocity (m/s)
    * Converted using:
        pace = (500 / speed) seconds
    * Smoothed over a short distance-time window (~3–12s accumulation)

- Stroke Rate (SPM)

    * Detects stroke “catch points” using motion jerk + acceleration thresholds
    * Primary method: median interval between detected catches
    * Backup method: autocorrelation of motion signal for robustness
    * Blended and smoothed across recent strokes

    
- Catch Slope - A measure of how sharp and forceful the entry into the drive phase is.
 
    catchSlope = abs(catchPeakJerk)
    * Slope = rate of change of acceleration (m/s³)
    * Smoothed over recent strokes (rolling average of last ~8 strokes)

    Interpretation:
    * Higher = more aggressive / faster load on the water
    * Lower = softer, more gradual connection
    * Very high values may indicate “slam” rather than clean catch

    What it represents:
    * Boat connection quality at entry
    * How efficiently force is transferred into the drive

- dps = distance_delta / strokes

    * Only valid when:
        * Stroke interval is stable (0.8–8s)
        * GPS movement is clean (>0.5m, <25m per stroke)
    * Smoothed across last ~8 valid strokes

- Impulse - Impulse is an approximation of total “work output” during the drive phase, based on acceleration over time.
    
    Impulse = Σ (acceleration × Δtime)
    impulse += samples[i].v * dt;

    Where:
    * v = filtered IMU acceleration (axis-selected)
    * dt = time difference between samples

    Interpretation:
    * Higher impulse → stronger drive phase / more force applied
    * Lower impulse → lighter or less connected drive
    * Useful for comparing stroke power independent of stroke rate

- RunLoss % = (vmax - vmin) / vmax * 100
 
    * runLossPct → percentage loss
    * runLossMs → absolute speed drop (m/s)
    * runEfficiency = vmin / vmax

    Interpretation:
    * Low run loss (0–10%) → strong run, good hull glide
    * Moderate (10–25%) → normal rowing conditions
    * High (>25%) → poor run / checky boat / inefficient connection

    Calculation:
    * Computed over a sliding velocity window aligned to stroke interval
    * Uses EMA-filtered GPS speed (not raw GPS)

- RDI = (recovery_time - drive_time) / (recovery_time + drive_time)

    Range:
    * -1.0 → drive-dominant stroke
    * 0.0 → balanced stroke
    * +1.0 → recovery-dominant stroke

    Interpretation:
    * Negative → you are spending more time and/or intensity in the drive (more aggressive rowing)
    * Positive → slower recovery, potentially over-compressing or losing rhythm
    * Near 0 → rhythmically balanced stroke ratio

    Calculation:
    * Smoothed across last ~10 strokes
    * Derived from GPS + stroke FSM timing

- Stroke Characteristic

    * A measure of where peak force/acceleration occurs during the drive phase, expressed as a percentage of the stroke.
    * rawChar = (peakOffset / driveDur) * 100
    * When the boat accelerated hardest in the stroke



---

## 📱 Requirements

- iOS Safari recommended
- Motion + Location permissions
- Stable device mounting 
- Mounted flat (<15 degrees of level)
- Portrait or landscape orientation

---

## 🚀 Pipeline

handleMotion → runFSM → onStrokeFinish → metrics → UI + sync

---

## 📄 License

Private / internal use
