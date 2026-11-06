# Frame One 2.0 — Phase 2C: Real Lighting Lab in Option B

**Status:** stacked draft after Frame Lab PR #83. This is the working React Lighting Lab, not the Option B demo lighting sketch, and it has zero new storage keys or remote assets.

## Design and working interaction

The new page puts the same original vector portrait first, inside the approved paper/mint/ink interface. A concise live settings summary reads the actual React direction, intensity and shadow-edge state. The direction controls remain Front, Side and Back; the 20–100% illustrated-brightness slider and 0–100% drawn-shadow softness slider retain the original bounds, input handling and feedback. Both draw the real existing SVG, including its original mode-dependent shadow/blur properties and scoped gradient IDs.

The control panel follows the original scene and is organized into three clear stages: **light direction**, **intensity**, and **shadow edge**. The existing `LightingBrief` (three optional story situations with presets, changing real values and reviewing actual state) stays available beneath the main study. The practical household-lamp safety note and Lighting lesson deep link remain intact, and all seven original working lab routes appear at the end rather than before the exercise.

The diagram is expressly an *illustrated shadow/brightness concept*, not calibrated light physics, cinema exposure or an optical simulation. The user should never be told one position produces one inevitable emotion.

## Visual quality

- Same Option B canvas `#f7fbf9`, dark ink `#1c3442`, mint `#55b97b` and original vector art.
- Desktop: the illustrated scene and concise inspector align at their top edges; the portrait is not stretched to the panel height.
- 390px/320px: live picture spans the available width, controls stack below it, three directions remain legible and tap-accessible.
- Scoped `.react-lighting-lab.lighting-v2` CSS; the locked six-mission approved design, Make Lab and Frame Lab styles remain unchanged.
- Visible focus indicators, accessible labels, and motion reduction for users who request it.

## Acceptance

1. `tests/verify-v2-lighting-option-b.cjs` requires the real source illustration, original three modes, functional sliders, dynamic summary, source-derived teaching notes, active story briefs, existing route and storage owner.
2. Full desktop/390px/320px browser tests verify scene-first order, mode status, SVG shadow/opacity changes, brightness Home/End, softness Home/End, presets and optional live story-feedback. Screenshot names `30-real-option-b-lighting-desktop.png`, `31-real-option-b-lighting-390px.png`, `31-real-option-b-lighting-320px.png`.
3. Earlier 27 approved pilot pixel-comparison states are unmodified. Inspect all new screenshots at full size, including long button labels, readable status and stage prominence. No test tolerance relaxation.
4. Real Android emulator, historical migration, same-signer continuity, APK compilation and complete native DocumentsUI backup/restore must all pass. A green debug APK is not production signing or store approval.

## Next

After lighting QA, the real Cut Lab is next: storyboard-first editing with three selectable/reorderable timed shots, authentic preview/stop/cleanup, live practice presets and responsive Option B scene panels. Sound, Colour and Continuity follow. No editor is complete until its original actions pass on real browser and Android.
