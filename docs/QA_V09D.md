# Frame One v0.9D — React Creative Lab migration status

**Updated:** 27 October 2026  
**Scope:** Replace seven legacy labs incrementally, preserving the existing learner experience.

## First migrated lab: Continuity

Implemented in `src/components/labs/ContinuityLab.tsx`. React owns the desk drawing, compare/mismatch state, explanations and the continuity-lesson link. The previous visual CSS is reused. App holds the Continuity choice across tab navigation.

The old runtime emits the selected lab explicitly in each route event and leaves its own content container empty for the React-owned Continuity Lab. **The remaining six labs stay legacy-owned and operational**, rather than being rewritten together.

### Regression coverage

- New fifth Node suite `tests/verify-react-continuity.cjs` checks routing, accessibility labels/state, shared styles and original progress/storyboard keys.
- Compiled Chromium QA `scripts/browser-smoke.cjs` checks React DOM ownership, changed/matched illustration, legacy-to-React tab switching and state preservation.
- Existing 33-lesson completion, six other labs, mobile breakpoints, backup and offline QA checks remain.
- Browser workflow now watches `tests/**`, so test-only changes trigger QA.

### Observed and corrected during integration

1. Old browser assertion looked for React lab headings inside the legacy container; updated to the actual visible page.
2. Hidden duplicate lab tabs were found; corrected by making the legacy runtime emit an empty content container for React Continuity.
3. An old legacy Node test expected Continuity HTML; changed to enforce React-only ownership.
4. Browser test interaction overlapped React unmount with legacy tab rendering; changed to wait for the React component to detach before interacting with legacy controls.

**Acceptance requirement:** A green GitHub Actions browser QA run against the latest updated component/bridge/tests. Intermediate failed runs are retained as diagnostic history. Manual phone, screen reader and art accuracy review remain separately required.

## Next

After a green Continuity run and screenshot review, migrate **Colour Lab** with the same single-owner contract. No APK or iOS build should be produced until web rendering and offline behavior meet the agreed quality gates.

## Verified automated acceptance

- [GitHub run 40449195578](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40449195578) **SUCCESS** for the final React lab ownership integration and browser test after waiting for React component unmount during navigation.
- Passed all five Node migration tests, TypeScript/Vite build, desktop & mobile Chromium smoke, all 33 lesson completions, six legacy labs, React Continuity match/mismatch actions, backup cancellation and offline reload.
- [Screenshot artifact 12709795745](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40449195578) downloaded. Manually inspected the Continuity desktop screenshot: correct matching pair, seven-tab navigation, existing visual style, readable explanation and no duplicate legacy interface.
- Follow-up **mobile React Continuity** screenshots/assertions added in browser smoke at 390px/320px and committed, with passing run and visual inspection to be recorded separately.

**Automated acceptance for first migrated lab achieved.** Manual device, sound output, screen reader, expert content and native builds are separate uncompleted release gates.
