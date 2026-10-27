# Frame One v0.9D — React Lighting Lab QA

**Checkpoint:** 27 October 2026  
**Status:** Implemented on `main`; independent complete Chromium acceptance run not yet verified.

## Implemented
- Native `LightingLab.tsx` with React-owned front / side / back light direction, illustrated brightness (20–100%) and side-shadow edge softness (0–100%).
- `LightingScene.tsx` reuses the actual original authored v0.8B vector drawing and instructional text. All dynamic values are bounded; fixed preset labels and calculated SVG are local-only, with scoped gradient/filter IDs to avoid collisions.
- Original experimental caveats and safe real-world exercise are unchanged: this illustration **does not simulate physically accurate light**, and household lamps must be positioned safely.
- Tab navigation and connected Lighting lesson retained. React keeps user choices during lab switching. Legacy engine leaves the Lighting DOM empty and ignores React-owned slider events, protecting from old handlers.
- CSS retains the visual language and adds phone-safe artwork dimensions, focus outlines, and a compact desktop preview.

## Automated verification added
- Eighth source regression test `tests/verify-react-lighting.cjs` included in `npm test`, with previous three React lab suites updated for the new exclusive ownership boundary.
- Compiled Chromium checks: three directions, drawn side shadow, actual SVG brightness overlay at 20%/100%, shadow blur at 0%/100%, relevant explanations, page navigation, original learning storage keys and desktop screenshot.
- 390px and 320px capture of the native React Lighting screen, changed shadow setting and horizontal-overflow diagnostic.
- Existing 33/33 lesson sweep, other six labs, backup integrity and offline web reload still run.

## Acceptance conditions
- A confirmed **green** full GitHub browser QA run on the completed Lighting source and tests (not an earlier Frame/Colour build).
- Inspect new desktop/390px/320px Lighting screenshots, and fix layout or visual defects where found.
- Real devices (including iPhone/Safari/Android WebView), actual audio output, screen readers, educator/Telugu review and native packages remain *separate* pending release gates.

**React lab migration after implementation:** 4/7 written (Continuity, Colour, Frame, Lighting); 3/7 legacy (Cut, Make, Sound). Do not claim Lighting's automated acceptance until its latest run is verified.
