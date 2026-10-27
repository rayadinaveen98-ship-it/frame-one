# Frame One v0.9D — React Frame Lab migration report

**Date:** 27 October 2026  
**Status:** Third Creative Lab implemented and automated acceptance passed; latest desktop-only layout refinement requires independent CI verification.

## Work implemented

- `src/components/labs/FrameLab.tsx`: Original Frame Lab now React-owned with three educational crop presets (wide/medium/close), controlled slider from 1.0× to 3.0×, toggleable guides, two-image crop comparison, interpretations and the original Sound/shot-lesson links.
- `src/components/labs/CinemaScene.tsx`: Extended the **same original locally authored SVG** already used in Colour Lab; safely derives SVG viewBox from a clamped crop value, reuses the original film illustration, scopes gradient IDs to each scene instance and updates its label. This is **on-screen cropping, not lens physics or camera movement**.
- The legacy runtime now yields exclusive markup ownership and skips delegated input handling for **Frame, Continuity and Colour**, protecting native React state.
- React App keeps Frame preset, slider, guide and comparison state across lab navigation. Existing lesson progress, saved notes, storyboards, backup format and all remaining legacy labs are unchanged.
- Original styling retained with additional visible keyboard focus and responsive comparison constraints. Screenshot review identified crowded small-image overlay labels and large empty desktop preview space; the follow-up CSS hides redundant badges, aligns preview to the top and stacks phone comparison images.

## Automated checks

- Seventh Node regression suite `tests/verify-react-frame.cjs` added to `npm test`.
- Chromium smoke tests Frame route ownership, full original SVG, preset selection, keyboard crop, SVG viewBox, guide overlays, toggled comparison, state retained during route changes and 320/390px mobile screenshots.
- **Initial green production-build/browser run:** [GitHub Actions 40452193907](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40452193907) successfully ran full 33-lesson sweep, all seven Creative Labs and backup/offline checks after Frame migration; screenshot artifact `12709914707`.
- **Follow-up visual QA check added:** 320/390px comparison must stack vertically, hide cramped HUD labels and avoid overflow. Verify a new green CI run at or after source commit `1c0bcc9f09bbfee2304d3df0b179d39112f7a061` before declaring that refinement accepted.

## Release boundaries

This is **3 of 7 labs implemented** with initial automation green. Do not conflate CI with manual real-device usability, screen-reader testing, educational accuracy review or production HTTPS/PWA testing. Android/iOS packages have not yet been built.

## Verified real-browser acceptance

- [GitHub Actions 40452193907](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40452193907) **SUCCESS**: all 33 lesson completions, seven labs, React Frame presets, SVG viewBox, keyboard slider, comparison, guides, offline reload and backup tests.
- [GitHub Actions 40452506346](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40452506346) **SUCCESS**: added explicit 320px/390px comparison stacking and non-crowded HUD assertions.
- Inspected images from [run 40452464003](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40452464003): desktop artwork sharp and correct; 320px stacked crop comparison with no visible overflow, unlike the earlier cramped two-column screenshots.
- **Final desktop-only layout polish:** commit `013e14978dcae52f5ae74231aa3cd71be5eca0ef` removes the oversized bordered empty preview panel and keeps the original illustration available while scrolling. This final CSS adjustment should be verified by its own browser run and screenshot.
- Automated first-pass acceptance is successful; real Android/iOS/assistive-technology tests and filmmaking educator review are independent release gates.
