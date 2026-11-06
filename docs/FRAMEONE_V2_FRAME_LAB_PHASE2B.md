# Frame One 2.0 — Phase 2B: Real Frame Lab Option B Redesign

**Review status:** stacked draft after Make Lab #82. This is the real working React `FrameLab`, not an approved-prototype-only rendering. The original six-mission reference design and artwork remain pixel-locked.

## Implemented

- **Scene-first visual hierarchy:** the same genuine, animated 640×360 original bus-stop SVG is the main stage, ahead of its controls in both DOM and visual order. Header, status strip and stage are built in the Option B paper/mint/ink visual language.
- **Working crop choices remain:** Wide, Medium and Close are buttons mapped to real `FrameMode` and `zoom` state. The actual 1.00–3.00× range input changes the illustrated SVG `viewBox`. Neither the labels nor the scene respond with fake effects.
- **Live picture overlays:** the original guides toggle, and comparison shows two meaningfully differently cropped real copies of the original SVG (current crop vs opposite extreme: wide reference for a 3× close-up, otherwise a 3× tight reference). At 390px/320px those two images stack rather than shrink into unreadable thumbnails.
- **Context-sensitive interpretation remains:** factual caution explicitly says cropping a drawing isn't a simulated camera move or optical lens. The original story-first `FramingIntention` details retains three scene prompts, applies presets to **real crop state**, and gives readable interpretation only after the learner asks to discuss it.
- **Other labs remain:** all seven original `data-lab` routes and linked filmmaking lesson remain present; tool links are in a small closing section after the active framing exercise rather than dominating the first screen.
- **Responsive and accessible:** 44–46px controls, clear focus outlines, live status using text, reduced-motion handling, clean 320px layout, and no horizontal clipping. Side-by-side comparison is intentionally vertically stacked on phones.

## No functionality sacrificed

| Existing contract | Retained mechanism |
| --- | --- |
| Wide / Medium / Close | `choose()` updates mode and real zoom |
| Fine crop slider | `update()` clamps 1..3, synchronizes current `FrameMode` |
| Original illustration | `CinemaScene` with the original locally bundled SVG and real `viewBox` crop |
| Guides | `setGuides()` toggles the original overlay |
| Compare crops | `setCompare()` shows actual current + 3× reference images |
| Story intentions | `FramingIntention` applies real mode/zoom/guides; discusses the actual selection |
| Sound Lab and shot lesson | The original typed lab/lesson route controls |
| Existing 33 lessons + 7 labs | No new persistence key, second bridge or demo-state mutation |

## Acceptance gates

1. `tests/verify-v2-frame-option-b.cjs` protects original crop/guide/compare state, SVG source, educational accuracy and Option B visual selectors; all earlier tests run unchanged.
2. Browser acceptance runs on desktop, 390px and 320px. Checks live mode selection, actual SVG `viewBox` difference, slider Home/End, guide toggle, two real picture panes, return to single crop, source story-intention presets, review feedback and lab navigation.
3. Manual screenshot review: inspect new `28-real-option-b-frame-desktop.png`, `29-real-option-b-frame-390px.png`, and `29-real-option-b-frame-320px.png`, including labels, scene prominence and focus order. Original approved 27-state pixel-parity tolerances may not be relaxed.
4. Android debug build, offline native navigation and notes, historical migration, same-signer upgrading, full DocumentsUI backup/restore must all pass. No production signing or Play Store readiness can be inferred from a debug build.

## Next phases

Lighting, Cut, Sound, Colour and Continuity still have their original working features but not the complete Option B visual redesign. Each will be migrated separately and accepted at the same source/real-browser/native Android quality bar.
