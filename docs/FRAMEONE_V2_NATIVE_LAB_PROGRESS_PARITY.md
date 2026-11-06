# Frame One 2.0 — Native React Creative Lab & Progress

## Approved quality standard

This phase ports **the actual interactive Option B reference** into React, not a conceptual AI image. We retain the original `public/option-b-v1.html`, both original vector art files, the same isolated stylesheet and the reversible **Reference / React preview** switch. The test suite compares real rendered pixels before release.

### Ported screens

- **Creative Lab:** Frame, Light, Sound; the same live SVG stage, honest scene crop 1.0×–2.2×, rule-of-thirds overlay, colour treatment variations, written sound-environment choices, and active visual feedback. Sound is conceptual only; no fake audio button. The colour overlay is not physically accurate lighting simulation.
- **Progress:** Chapter 1 mission-completion ring, actual six-mission list and navigation, points, Lab idea counter and a deliberate demo-reset confirmation. Finishing an existing mission awards 20 demo points at most once; a Lab save awards 5 demo points and increments the idea counter.
- **Native navigation:** All five prototype surfaces now run in React: Home, Journey, four-step Lesson, Creative Lab and Progress. No low-fidelity fallback is needed for those five screens.
- **Reference:** Remains in the app as an immutable visual and functional comparison. Demo changes refresh that reference only, with its separate `frameone-option-b-prototype-v1` storage key.
- **Existing product:** The original Frame One 33 lessons, 7 real Creative Labs, notes, storyboards, progress, backups and Android package are untouched. These three Option B lab modes remain **pilot concepts**, not replacements for the seven production Labs yet.

## Source-locking rules

- `OptionBReactLab.tsx` uses the approved `OptionBReactScene` exported from the same stage as native missions, with the exact image asset.
- `OptionBReactScreens.tsx` owns live pilot points, finished mission IDs and saved ideas. Only the prototype storage key is writable; reset is explicitly confirmed.
- Lab crop strength is shared with native missions, matching the reference's single crop state across both.
- No asset substitution and no global CSS overriding the approved prototype inside the Shadow DOM.

## Visual QA gates

Browser QA screenshots at **desktop, 390px and 320px** compare:

1. Frame wide
2. Frame guides on
3. Frame tight crop
4. Warm lighting treatment
5. Cool lighting treatment
6. Contrast treatment
7. Traffic sound environment
8. Birdsound environment
9. Progress with a completed mission and saved Lab idea

Each pair is compared with the **same 8% maximum significant-pixel-difference gate** (threshold channel difference 28/255). Native interactions must also pass: navigation, save +5 once per click, correct counts, progress → mission, dismiss reset, confirm reset, and byte-identical production storage before and after. The previous Home/Journey/24 mission comparisons remain mandatory.

**Never lower the pixel gate to force acceptance.** Diagnose any failed screenshot visually. Do not merge this phase until all seven repo workflows (web, browser, APK, emulator, historical migration, same-signer upgrade, backup/restore) pass, screenshots are inspected, and the PR is review-ready.

## Subsequent development

The next phase is converting pilot missions into the real 33-lesson learning journey, ensuring robust source-grounded instructional writing, factual and practical filmmaking exercises, accessible real-device interactions, offline performance, and non-destructive migration. Production signing and Play Store launch remain separate owner-controlled release gates.
