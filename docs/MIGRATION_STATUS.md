# Frame One v0.9B — React chapter explorer and glossary migration

Date: 27 October 2026. **Source milestone only; not a released or compiled React app.**

## What changed since v0.9A

- `src/components/LearnView.tsx`: React now owns the six-chapter explorer, all 33 lesson cards, search, topic filters, completed-progress meters and 47-term bilingual glossary with search.
- `src/components/LessonView.tsx`: keeps the prior 33 React lesson/quiz/practice views and original storyboard illustrations.
- Seven interactive labs, home page, film-role map, backup validation/download mechanics and the artwork engine remain in the original legacy module.
- Existing backup **UI** is now React-owned. The download/import actions call the original validated backup functions through typed `LegacyBridge` methods. Original format/version and storage keys unchanged.
- React lessons and chapters never render arbitrary curriculum text with `innerHTML`; original instructional illustration SVG is the sole retained trusted HTML adapter.
- A postbuild `generate-offline.cjs` script generates a production service worker precaching real compiled JS/CSS and local artwork (instead of caching only the app shell). This script was tested on mock build output, but the real Vite build is not available here.
- Lesson route changes still use the existing hash/history navigation. Reset from sidebar uses the legacy progress engine.
- The source ZIP includes the earlier **functional static preview** unchanged as a fallback; it is not the migrated React interface.

## Tests and unresolved issues

- Node test suites verify 33 lessons, six chapters, seven lab routes, original storage keys, 47 glossary records, search/filter and backup bridge contracts; TypeScript source parses and transpiles with available system TypeScript.
- `npm run build` / Vite bundling and full `tsc --noEmit` remain **blocked** because registry.npmjs.org is unreachable and required packages are not installed.
- Real React browser rendering, device screenshots, native SDK builds, full offline behavior, and external subject-matter review **not yet tested**.
- No APK, IPA, repo push, web URL or deployed release has been generated.
- A user changing origin/device must export backup from old app then import via the chapter page; browser local storage is origin-scoped.

## CI handoff

A GitHub Actions web-only workflow is included under `.github/workflows/web-check.yml` for a future dedicated repository. It is **not run**, and there is no GitHub push as of the original report. It installs dependencies, checks source-level tests, typechecks and builds the web app, then uploads `dist/`. A lockfile and a real passing run are required before treating it as release CI.

## Next

1. In a network-connected Node.js development or CI environment, run `npm ci` once a lockfile has been generated or `npm install` initially; run `npm test`, `npm run build`, then visual QA using the built `dist/`.
2. Fix any integration/type issues found by the actual build, test storage import/export, Play and Stop of all lab audio, and verify real offline reload.
3. Migrate the seven labs as independent React modules after preserving the exact behavior, then work toward a fully native-shell test.\n## Update — 27 October 2026\n\nThe project was imported into GitHub, two portable test-import fixes and a TypeScript legacy declaration fix were committed, and [web verification run 40440890519](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40440890519) passed. A compiled web artifact `frame-one-web-dist` was uploaded. Previous notes in this document refer to the environment before GitHub Actions and no longer describe the build status. Full visual QA, hosting and native builds are still pending.\n