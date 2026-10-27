# Frame One v0.9D — React Cut Lab QA

**Date:** 27 October 2026  
**Status:** Implemented and committed; passing current production browser QA and screenshot review still required.

## What changed

- `src/components/labs/CutLab.tsx` replaces the previous editing exercise with a React-owned screen.
- Retains **three locally drawn storyboard shots** (place, clock/detail, person), the same lesson explanations, move-left/right timeline controls, select previous/next, 1–5 second duration slider, playback, reset and link to the editing lesson. This is a **timed storyboard**, not moving footage or a finished video editor.
- The original order and per-shot holds begin `[place, detail, person]`, `[2,2,2]`. Moving a clip also moves its duration. React stores editing choices in App while swapping labs.
- Playback uses **one React effect-owned cancellable timer**. Stopping, selecting, reordering or editing a hold cancels playback. Unmounting Cut Lab clears the pending timer automatically. This prevents React/legacy playback timer conflicts.
- Old document click/input handlers cannot alter React-owned Cut controls; legacy renderer yields an empty content container for the React Cut route. Other two labs (Make and Sound) remain owned by the original engine.
- Existing learning storage keys and backup schema preserved: `frameone-progress-v01`, `frameone-practice-v07`, `frameone-scene-v07`.

## Tests committed

- Ninth `npm test` regression suite `tests/verify-react-cut.cjs`; previous migrated labs' compatibility checks also updated.
- Full Chromium browser smoke now asserts: one React-owned page, preserved illustration and three clips; slider duration follows a moved shot; changed opening changes explanation; user stop and automatic three-shot completion; navigating away cancels playback and reopening starts stopped.
- Screenshots and horizontal overflow checks added at desktop, 390px and 320px with compact timeline CSS and accessible keyboard focus.
- Initial CI [40460458046](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40460458046) **failed before a browser run** because a Lighting source-test assertion hadn't been updated for the expanded delegated-input filter. That stale assertion has been corrected. **A green full run on the later commit is still needed before accepting Cut Lab.**

## Outstanding release gates

1. Green GitHub Actions browser run with 33 lessons, all seven labs, export/cancelled restore and offline reload.
2. Inspect desktop/390px/320px Cut screenshots; fix cramped timeline controls or overflow before sign-off.
3. Real Android/iOS devices, audio, screen-reader, factual/Telugu review and actual hosted PWA remain separately unverified.

**Migration after this implementation:** 5/7 written in React (Continuity, Colour, Frame, Lighting, Cut); **2/7 legacy remain** (Make, Sound). Do not label 5/7 *accepted* until Cut's QA passes.
