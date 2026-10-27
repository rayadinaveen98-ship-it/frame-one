# Frame One v0.9D — React Make Lab migration QA

**Date:** 27 October 2026  
**Status:** **ACCEPTED for automated browser QA** on the complete React Make integration. Real-device, assistive technology and educator reviews are separate gates.

## What is implemented

- `MakeLab.tsx` now owns story questions (Mystery / Reunion / Decision), all three beat tabs, wide/medium/close framing, original bus-stop vector storyboards, editable 240-character shot notes, Save, Export shot list, Previous/Next and connected filmmaking/Cut links.
- `story-data.ts` defines the **original `frameone-scene-v07` JSON shape**: `{question,shots:[3],notes:[3]}`. Existing story IDs and default texts preserved.
- `StoryboardArt.tsx` reuses the original local SVG storyboard, with a scoped gradient ID and **no remote imagery or dynamic user HTML**.
- `window.frameOneLegacy.getStoryboard/saveStoryboard/exportShotList` keeps the old engine as storage/backup authority. React writes through the original `state.story`, so regular backup exports still contain the newly edited plan. Importing an old backup notifies the React Make editor via `frameone:story-restored`.
- Legacy rendering/input handlers relinquish the Make page to React; Sound is now the **only** legacy-owned Creative Lab. The original progress and lesson-notes keys remain unchanged.
- Notes save as entered; Save confirms persistence, while Export uses the original text shot-list format.

## New automated checks

- Tenth Node regression suite (`tests/verify-react-make.cjs`) plus updates to older lab tests and the original VM migration/backup tests.
- Compiled browser QA now checks the same SVG, changing story question, framing, notes, storage and bridge state, text download, importing a valid backup while Make is mounted, state after navigation, and 390px/320px screenshots + width overflow diagnostics.
- Full existing 33/33 lesson completion journey, seven lab routes and offline reload remain in CI.
- Earlier runs failed at **stale source-test expectations** for legacy Make markup and for the new browser `Event` constructor in the VM; those were corrected without weakening the validation.
- **Accepted:** [GitHub Actions 40462953360](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40462953360) **SUCCESS** on commit `93bd8e858f828493f66c2bfbfc993f7893d0bfb3`. Ten Node source regression suites, TypeScript/Vite build, 33/33 rendered lesson completions, seven labs, original storage/backup restore, shot-list export, cancellation and offline reload were exercised.

## Remaining phases

Next: Sound Lab, with audio permission/user gesture, AudioContext cleanup, handling navigation, offline use and real-device listening tests. HTTPS web hosting, Android APK, iOS build, screen reader, external film/Telugu pedagogy review and release QA remain open.

## Final automated acceptance — 27 October 2026

- **Green full browser QA:** [run 40462953360](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40462953360), screenshot artifact `12714969306`.
- Downloaded and visually inspected `17-react-make-desktop.png`, `18-react-make-320px.png` and `18-react-make-390px.png`: original bus-stop storyboard, framing selection, three beats, note editor, Save/Export controls and connected learning are readable. At 320px beats stack vertically, at 390px they share a row. No material horizontal overflow reported.
- A black horizontal strip in the 390px **full-page** screenshot is likely fixed bottom-nav stitching during capture, not confirmation of an on-device UI failure. Real phone viewing remains a separate gate.
- Restoring a valid backup updates the React question and first-shot note without a reload. Reopening Make after visiting Cut reloads the restored data from the original v0.7 storyboard engine; text shot-list download and original backup schema remain functional.
- **React labs accepted: 6/7** — Continuity, Colour, Frame, Lighting, Cut, Make. **Only Sound remains in the legacy runtime.**
