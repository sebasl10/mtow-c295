# MTOW C-295 — Maximum Takeoff Weight Calculator

A mobile/web application for pilots of the **Colombian Air Force (FAC)** that calculates the **MTOW (Maximum Takeoff Weight)** of the **CASA C-295** aircraft based on real aerodrome conditions and meteorology.

Built with **React Native + Expo**, runs on iOS, Android, and web browser.

---

## What it does

Given a Colombian aerodrome, temperature, pressure altitude, and available runway, the app determines:

- The **runway-limited MTOW** (CFL) and **climb gradient-limited MTOW** (CG)
- The **final operational MTOW** (minimum of the two)
- The **limiting factor** (RUNWAY / GRADIENT / RUNWAY & GRADIENT / NONE)
- The **operational status** (GREEN / AMBER / RED) with a visual indicator
- The **required runway** and **effective runway** (including wet runway penalty)

Three takeoff modes are supported:

| Mode | Description |
|------|-------------|
| **Normal** | Flaps 10° · V2 = 1.23 Vsr · FAR-25 |
| **Short Field** | Flaps T/O 10° · V2 = 1.05 Vsr · FAR-25 |
| **CAPS 2017** | FAC technical chart · No interpolation · V1/VR/V2 speeds |

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Expo](https://expo.dev) ~54 + React Native 0.81 |
| Language | TypeScript 5.9 |
| UI | React Native core + `react-native-safe-area-context` |
| Bottom sheet | `@gorhom/bottom-sheet` (aerodrome selector) |
| Animations | `react-native-reanimated` ~4 |
| Web | `react-native-web` + Metro bundler |
| Deploy | Vercel (static export in `dist/`) |

---

## Architecture

```
mtow-c295/
├── App.tsx                  # Root component: global state, mode routing logic
├── index.ts                 # Entry point (Expo registerRootComponent)
│
├── src/
│   ├── components/
│   │   ├── AerodromeSelector.tsx  # Bottom sheet with Colombian aerodrome search
│   │   ├── CapsCascadePicker.tsx  # Cascade picker: ICAO → runway → CAPS operation
│   │   ├── ModeSelector.tsx       # Tabs: Normal / Short Field / CAPS
│   │   ├── NumericInput.tsx       # Reusable numeric input with label and hint
│   │   ├── WetRunwayToggle.tsx    # Dry/wet runway toggle
│   │   ├── ResultCard.tsx         # Result card for Normal/Short Field modes
│   │   ├── CapsResultCard.tsx     # Result card for CAPS mode (V1/VR/V2 + MTOW)
│   │   └── theme.ts               # Centralized color palette
│   │
│   ├── engine/
│   │   ├── mtow.ts          # Main calculation engine (Normal and Short Field)
│   │   └── capsLookup.ts    # Direct lookup in the CAPS 2017 table
│   │
│   └── data/
│       ├── airports.ts      # ~90 Colombian aerodromes (ICAO, elevation, runway in ft)
│       ├── performanceTable.ts  # FAR-25 performance table (MTOW, req. runway, gradient)
│       ├── cgTable.ts       # CG table (gradient / MTOW by OAT and altitude)
│       └── capsData.ts      # CAPS 2017 technical chart (lookup by aerodrome/temp/wind)
│
└── assets/                  # Icons and splash screen
```

---

## Calculation engine (`src/engine/mtow.ts`)

The calculation follows the takeoff performance procedure from the C-295 technical documentation:

1. **Altitude interpolation** — Finds the two nearest pressure altitude levels in `performanceTable` and performs linear interpolation.
2. **OAT interpolation** — Within each altitude level, interpolates required runway and minimum gradient by temperature.
3. **Table MTOW** (`mtowTabla`) — Maximum weight per performance under ISA conditions.
4. **Wet runway penalty** — +800 ft (Normal) / +500 ft (Short Field) added to the required runway.
5. **Runway-limited MTOW** (`mtowCfl`) — If the runway deficit exceeds the threshold, weight is reduced in 200 kg steps per 80 ft of deficit.
6. **Gradient-limited MTOW** (`mtowGradiente`) — Bilinear interpolation in the CG table (OAT × altitude).
7. **Final MTOW** = `min(mtowCfl, mtowGradiente)`.

### CAPS 2017 mode (`src/engine/capsLookup.ts`)

Performs a direct lookup (no interpolation) in the CAPS 2017 technical chart, indexed by `refCode|temp|wind`. Returns MTOW, limiting factor, and V1/VR/V2 speeds.

---

## Installation and running

```bash
# Clone the repository
git clone <repo-url>
cd mtow-c295

# Install dependencies
npm install

# Start in development mode
npm start          # Expo DevTools (scan QR with Expo Go)
npm run ios        # iOS Simulator
npm run android    # Android Emulator
npm run web        # Browser (http://localhost:8081)
```

---

## Web build / deploy

```bash
# Generate static build in dist/
npx expo export --platform web

# The dist/ directory is configured for Vercel (dist/.vercel/project.json)
```
