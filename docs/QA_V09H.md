# Frame One v0.9H — safe in-app Back navigation

**Engineering test build** · 27 October 2026

## Problem addressed

On a phone, the bottom tabs allow broad navigation but do not offer a consistent Back control. Browser history may contain a website that opened Frame One; using `history.length` as the sole check risks leaving the app rather than returning to the learner's chapters.

## Changes

- Add an accessible 44px-high **Back** button in the mobile top bar on every non-Home page, including lessons and Creative Labs. Desktop sidebar and normal page designs remain untouched.
- The original legacy route bridge owns navigation and now stores `frameOneRoute` / `frameOneDepth` markers in each Frame One history entry. It preserves markers when the browser generates a `popstate`, instead of counting external pages or guessed routes.
- The in-app Back button calls `frameOneLegacy.goBack()`. When a prior in-app route exists, it uses `history.back()`. When the app was opened directly on a lesson/lab without such history, it falls back to **Learn** (lesson) or **Home** (other non-Home pages).
- Existing lesson/lab IDs, the seven React labs, progress/notes/storyboard storage keys and v1 backup schema are untouched.
- The browser/synthetic-history tests exercise Home → Learn → Lesson → Back → Learn → Back → Home, deep-linked lessons/labs and touch target sizing at 320/390px.

## Important limits

This change adds an **in-app Back control**, not an Android-native hardware/gesture back listener. Capacitor's official `@capacitor/app` plugin can intercept Android hardware Back, but that plugin is not currently included in Frame One. Do **not** claim hardware/gesture Back is fixed or device-tested until its native integration and physical Android checks pass.

The app remains a **debug APK** with potentially inconsistent CI signing; do not uninstall a previous debug build without exporting and checking learning backups.

## Acceptance

- `npm test`: including `tests/verify-route-history.cjs`
- `npm run build`: TypeScript + Vite + offline assets
- Full compiled Playwright desktop/mobile smoke incl in-app Back, notes, 33 lessons, seven labs, offline and backups
- GitHub Android debug APK packaging and stable release automation after merge
- Physical Android gesture Back, edge-to-edge insets and update-signature continuity remain unverified release gates

## Verified feature branch acceptance

- [PR #4](https://github.com/rayadinaveen98-ship-it/frame-one/pull/4) squash-merged to `main` at `ef8d4bc3e141f274307cac929510ab4173411209`.
- [Web regression/TypeScript build 40482346820](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40482346820) — **SUCCESS**.
- [Full Chromium desktop/mobile QA 40482346779](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40482346779) — **SUCCESS**; includes in-app Back and mobile touch-target validation.
- [Android debug APK 40482347169](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40482347169) — **SUCCESS**.
- These are pre-merge/PR checks. The independent main-branch checks and stable release update are tracked separately.

**Hardware/gesture Back remains pending; this is only a visible in-app Back UI with verified browser navigation.**
