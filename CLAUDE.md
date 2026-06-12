# PROJECT NULLFRAME (SYS.V4) — Nothing-inspired telemetry dashboard

React + Vite + TypeScript + Motion. Single-page bento dashboard in the Nothing
design language. Deploys to Vercel with this folder as the project root.

## Commands
- `npm run dev` / `npm run build` / `npm run preview` (build typechecks first)

## Architecture
- `src/system/telemetry.ts` — singleton bus. ONE rAF loop for the whole app:
  measures fps, smooths pointer velocity, runs canvas draw callbacks, publishes
  an immutable snapshot at 2 Hz to React via `useSyncExternalStore`. Fully
  pauses on `document.hidden`. Never add a per-widget rAF or interval if the
  bus can drive it.
- Widgets read `useTelemetry()`; canvases register via `bus.draw()` and must
  skip work when offscreen (IntersectionObserver lives in the component).
- Real data where the browser exposes it (heap, battery, connection, fps,
  input); seeded fakes otherwise (`src/system/fake.ts`). Cards are tagged
  LIVE or SIM accordingly.
- GitHub-themed widgets are intentionally fake (@nullframe). No network calls.

## Design DNA (Nothing)
- Palette tokens live in `styles.css` only — never hardcode grays elsewhere.
- Doto (weight 400) = dot-matrix hero numerals. Space Mono = UPPERCASE meta,
  11px, letter-spacing .08em. Space Grotesk = human text + big metric numerals.
- Brand red `#D71921` appears exactly once: the REC dot on the seismograph.
- Segments and toggles have sharp corners; cards are 16px radius; no glows,
  no gradients on surfaces.
- Motion: things slam in and settle (back-ease/springs). Only heartbeat-type
  elements loop. Everything respects prefers-reduced-motion and the MOTION
  toggle (`motionOff` in context).

## Performance budget (phones must stay cool)
- Canvas: DPR capped at 2, redraws capped at ~30 fps, skipped when offscreen
  or tab hidden.
- React re-renders at snapshot cadence (2 Hz); keep widget trees small.
- Every effect cleans up: listeners, observers, timers, animation controls.

## Conventions
- Comments only for non-obvious constraints. No narration, no banners.
- One widget per file in `src/components/widgets/`.
