# Frame One 2.0 — Phase 2G: Real Continuity / Match Lab

**Status:** stacked draft after Colour Lab PR #87. This is the actual React editor. No fake artwork, removed mode, extra storage or downloaded assets.

## Retained functional study

Two copies of the original illustrated desk are still **real HTML/CSS drawings**: Shot A always holds the cup on the left, while Shot B uses current React `ContinuityMode` to put it on the same side or move it across the table. The letter and pencil remain fixed. All existing accessibility labels accurately announce cup location.

The two actual production buttons, **Keep cup on the left** and **Move cup to the right**, remain wired to current mode, `aria-pressed` and the original review statement. The live status line now reads genuine match/mismatch state, not independent demo flags. The educational caveat about differing camera angles and intentionally discontinuous edits remains—this is a fixed viewpoint demonstration, not all continuity physics or an error detector.

All original seven working lab routes and the linked Continuity lesson remain. A compact Make / Colour / Frame row is offered near the top for native Android phone navigation.

## Visual lock

- Option B canvas `#f7fbf9`, ink `#1c3442`, green `#55b97b`, original illustration shapes, editorial headings and white rounded panels.
- Desktop: two full-size 16:9 desk art frames presented before the actual controls, each with a readable SHOT A / SHOT B label.
- 390px/320px: the two illustrations stack, with touch-accessible choices and no horizontal clip or compressed cartoon.
- Original CSS cup-position transition survives. Reduced motion and accessible focus are respected.
- Scoped stylesheet `option-b-continuity-lab.css`; no modification of the locked six-mission prototype or relaxation of its 27-state visual comparison.

## Acceptance

1. `tests/verify-v2-continuity-option-b.cjs` requires original real React state, both illustrated desks, prop movement, camera-angle caveat, original route and lesson, responsive and scoped styling.
2. Browser acceptance desktop, 390px and 320px checks stage-first layout, both real desk images, selected prop state, actual cup DOM position, return to the original Frame Lab, persistent session choice, no horizontal clipping and visual screenshots `38-real-option-b-continuity-desktop.png`, `39-real-option-b-continuity-390px.png`, `39-real-option-b-continuity-320px.png`.
3. Verify original 33 lessons and other six production labs with existing smoke tests, and compare screenshots to approved Option B art direction.
4. APK compilation, Android emulator, historical migration, same-signer upgrade, full DocumentsUI backup/restore must be green. Production signing, physical device and Play Store review remain separate.

## Next integration stage

All seven working Creative Labs now have dedicated Option B visual layers, but they are **stacked draft branches**, not released. Complete integrated QA, baseline visual review on real device, default course navigation and packaging only after the entire stack is verified.
