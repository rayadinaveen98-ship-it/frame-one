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

## Real-browser defect identified and corrected

GitHub run [40450839303](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40450839303) recorded: `{"inline":"0","computed":"0","mode":"true","strength":"100%"}`. The React mode was correctly selected and the slider displayed 100%, **but the old document-level `input` handler overwrote the new overlay opacity with its legacy neutral-state zero**. This was a genuine bug, not an animation-only race.

**Source fix:** React Colour input/onChange handlers stop propagation. The old engine's global input delegate explicitly ignores controls under `.react-colour-lab` or `.react-continuity-lab`. The sixth source regression now checks that both protections remain in place. This avoids hidden cross-framework ownership collisions as later labs migrate.

**Acceptance:** Re-run the entire GitHub browser suite after commit `09a63faf99ef55580b51490c883805481b2fca1d` and inspect the resulting coloured preview screenshots. Do not mark the second lab complete solely on source-level checks.
