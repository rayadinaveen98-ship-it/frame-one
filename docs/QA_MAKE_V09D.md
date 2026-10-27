# Frame One v0.9D — React Make Lab migration QA

**Date:** 27 October 2026  
**Status:** React storyboard editor implemented and committed. Full production Chromium QA is still pending acceptance.

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
- **Do not mark 6/7 accepted until the latest GitHub browser run is green and desktop/mobile screenshots are inspected.**

## Remaining phases

Next: Sound Lab, with audio permission/user gesture, AudioContext cleanup, handling navigation, offline use and real-device listening tests. HTTPS web hosting, Android APK, iOS build, screen reader, external film/Telugu pedagogy review and release QA remain open.
