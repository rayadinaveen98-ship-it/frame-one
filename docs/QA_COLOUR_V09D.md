# Frame One v0.9D — Colour Lab migration review

**Date:** 27 October 2026  
**Status:** React Colour Lab implemented and committed; final real-browser CI result to be verified.

## Scope completed

- Second of seven Creative Labs moved to independent React rendering: `src/components/labs/ColourLab.tsx`.
- Retains original bus-stop artwork as a locally bundled, reused vector scene (`CinemaScene.tsx`). No commercial media or remote art dependency. The static illustration is locally authored and contains no learner-supplied HTML.
- Neutral, warm orange and cool blue choices; controlled overlay-strength slider; side-by-side before/after view; same educational caveat that this is not real colour grading or camera physics.
- Accessible labelled range slider and `aria-pressed` choices, focus indicators and reduced-motion transition alternative.
- React owns modes and slider state across lab tab changes; the legacy runtime yields its DOM for both Colour and Continuity. Other five labs remain legacy-owned.
- No changes to `frameone-progress-v01`, `frameone-practice-v07` or `frameone-scene-v07`, or to saved backup format.

## Verification gates

- Existing migration/continuity tests now assert exclusive React ownership of both migrated labs.
- Added sixth Node source contract `tests/verify-react-colour.cjs`, included in `npm test`.
- Compiled Chromium smoke now verifies original SVG scene count, mode labels and selection state, strength changes from keyboard interaction, overlay alpha, native React route round-trips, and screenshots with no horizontal overflow at 390px and 320px.
- Initial runs exposed tab-navigation transitions and a too-early opacity assertion; browser tests were tightened to select visible tabs and wait for CSS transitions. These are diagnostic observations, not successful QA claims.
- **Acceptance requires a verified green GitHub Actions real-browser run on the post-fix commit**, plus review of desktop/mobile Colour screenshots.

## Follow-up

Once accepted, mark v0.9D as **2/7 labs migrated** and move to Frame Lab; continue to preserve the five legacy modules until each replacement passes. Independent film education, Telugu, real-device/screen-reader/audio, HTTPS PWA and native packaging gates remain pending.
