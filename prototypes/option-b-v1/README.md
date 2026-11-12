# Frame One · Option B Interactive Pilot

This is a **working HTML/CSS/JavaScript prototype** of Frame One's selected Option B visual learning journey. It is **not** the current React production app or an Android APK. It can open directly as one self-contained HTML file, including two original embedded vector illustrations; no network or paid service required.

## Screens with real behavior

- **Home**: next unfinished mission, actual six-mission pilot completion, chapter CTA.
- **Journey**: original illustrated mountain map, six clickable missions with state-dependent completion and next-mission highlights.
- **Lesson**: four steps — Observe, Decide, Experiment, Make — with scenario-specific choices and feedback, adjustable illustration crop and practice checklist. Each of the six pilot missions has separate text/decisions but shares one scene art asset intentionally.
- **Create**: interactive Frame, Light and Sound conceptual tabs; crop range, guide overlays, colour treatments, choice-dependent feedback, local idea-saving.
- **Progress**: honest completed-mission count, demo points, ideas saved and reset with confirmation.

## Run

Open `index.html` directly in a modern desktop or mobile browser; the entire art is inlined. It uses one isolated browser storage key: `frameone-option-b-prototype-v1`. No existing Frame One learner data is touched. Browser privacy policies may restrict persistence for local HTML files; the active session remains interactive.

## Verified

Real Chromium Playwright checks at **320 × 720, 390 × 844 and 430 × 932** covered navigation, scene choices, adjustable crop, checklist, mission completion and replay, Create tabs, idea saving, Progress, and absence of horizontal page overflow. Source HTML was loaded using `set_content` because the test sandbox blocked `file://` and localhost navigation. Storage serialization was verified through an isolated browser storage shim, not a real native-file reload.

## Design gate

This is a rendered, user-reviewable visual-direction candidate. Do not merge it as a replacement for the main app. Keep the production 33 lessons, 7 React Labs, backups, progress IDs, and Android upgrade migration untouched until a separate component port and real-device QA are complete. See DESIGN_LOCK.md.
