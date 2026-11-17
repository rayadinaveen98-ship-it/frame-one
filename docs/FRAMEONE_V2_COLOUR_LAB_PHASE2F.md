# Frame One 2.0 — Phase 2F: Production Colour Lab, Option B

**Status:** stacked draft after real Sound Lab PR #86. This modifies the *real* React Colour Lab, not the decorative Option B demo; no second persistence layer.

## Working studio

- Original **before/after** bus-stop illustration is preserved with real two SVG renderings. The untreated left image always remains unchanged; the right uses the original tint overlay and the existing 42% maximum opacity math.
- The existing Neutral/Warm/Cool modes, colour swatches, 0–100% strength slider, accessible mode buttons and true `aria-pressed` state remain. Neutral applies **zero** tinted overlay even if the slider value is above zero.
- The live top strip reflects the actual selected React `mode`, current `strength`, and illustrative opacity. It does **not** claim a calibrated colour grade or automatic emotion detection.
- The original three optional `ColourStoryBriefs` remain real: sunrise, unexpected reunion and unanswered wait; applying each scenario updates the actual mode and strength. Discussion feedback depends on the real current mode/strength and never writes fake scores.
- The connected colour lesson and seven working labs remain accessible. A compact Make/Frame/Match row offers real phone-friendly navigation near the top; the full working lab list remains below.

## Visual quality contract

- Locked palette: canvas `#f7fbf9`, ink `#1c3442`, original green `#55b97b`. One original palette icon, rounded white editorial panels, generous photo comparisons, minimal explanatory text.
- Desktop: a large vertical **before/after** scene column and single true inspector. Tablet: two images side by side. Phone 390px / 320px: original scene then graded scene, stacked vertically, each readable 16:9 with zero horizontal clipping.
- Every control must affect actual React state; do not use video media, unlicensed material, false playback or generic illustration placeholders.
- Scoped `.react-colour-lab.colour-v2` CSS only. Six-mission approved Option B and the original 27-state parity suite remain unmodified.
- Focus-visible states, 44px touch controls, reduced-motion support and a visible contrast between active options.

## QA

1. `tests/verify-v2-colour-option-b.cjs` guards original SVG owner, Neutral=0, max opacity=42%, slider precision, three modes, real story briefs, shortcuts, routes and styling.
2. Browser tests at desktop, 390px and 320px validate stage-first layout, both original SVGs, mode and slider state, actual computed opacity, all three story briefs, before/after visual prominence, no horizontal clipping, old course integrity and storage owner.
3. Review artifact screenshots `36-real-option-b-colour-desktop.png`, `37-real-option-b-colour-390px.png`, `37-real-option-b-colour-320px.png` at full-size. Visual approval cannot be inferred from tests alone.
4. Android emulator, same-signer data continuity, historical migration, full native DocumentsUI backup/restore and successful APK compilation mandatory.
5. Still **not** production-signed; release readiness remains a separate gate.

## Next

Last production studio: **Continuity/Match Lab**. Then comprehensive seven-lab and 33-lesson integration, default navigation design migration, production signature and physical-device tests.
