# Frame One v0.11A4 — cinema act spotlight

## Scope

This is a presentation and navigation refinement to the six existing offline three-act collections. It introduces a three-act filmstrip and one featured-act stage, showing the next real experience in the act. The visitor can preview any act before entering that act. Within the lesson reader, the boundary before a new act has a short editorial intermission grounded in the already-authored story data.

This release **does not** add new lessons, filmed footage, accounts, persistence keys, progress records, external media or new network dependencies. The seven Creative Labs remain unscored. All 33 original lessons, seven Labs, backup schema and Android history navigation stay authoritative.

## Acceptance checklist

- Three accessible act tabs with one `aria-pressed=true` at a time on each series.
- Changing the selected act updates the featured poster, title, observation cue and the real destination.
- Entering an act opens its next uncompleted lesson if available, otherwise its first item.
- When the collection reopens after lesson completion, the featured act defaults to the one containing the next unfinished lesson; manually previewing another act does not alter saved learning progress.
- At an act boundary, the lesson reader previews the actual upcoming act; ordinary syllabus navigation stays unchanged.
- Studio/Labs clearly say “Try this act” and have no fake progressbar.
- No content fetch or added local/session storage; all artwork and text work offline.
- Android 320px, 390px, desktop, physical-phone and screen-reader behavior need validation.

## Automated verification

The existing `verify-film-series.cjs` source contract has extra assertions for actual act selection, truthful next-destination choice and boundary-only intermissions. `browser-smoke.cjs` now exercises an alternate act, verifies its real lesson destination, previews the next act from the last lesson of the current act, and checks 320px/390px presentation. A passing browser run is **not** a substitute for physical phone UX or specialist content review.

## Release decision — accepted for Android debug preview (28 October 2026)

The exact pull-request head `9938a32b38fe0a16e0442e575f206745f0ece2fb` passed **all five pre-merge checks**:

| Gate | Verified run |
|---|---|
| Web / source / production build | [40673453427](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40673453427) — SUCCESS |
| Chromium desktop/390px/320px journeys | [40673453424](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40673453424) — SUCCESS |
| Android APK assembly | [40673453436](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40673453436) — SUCCESS |
| Installed Android emulator: Back and offline learning state | [40673453483](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40673453483) — SUCCESS |
| Android DocumentsUI backup restore | [40673453448](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40673453448) — SUCCESS |

[PR #20](https://github.com/rayadinaveen98-ship-it/frame-one/pull/20) merged to `main` at `b31033bca83f452d3b1891489c09f4f029ca5a58`. The independent main web build [40674672760](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40674672760), compiled browser [40674672824](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40674672824) and Android debug [40674672795](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40674672795) passed. Publisher [40674962336](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40674962336) passed; release metadata confirms the public `FrameOne-android-debug.apk` was built from `b31033bc`.

A repeat of Android DocumentsUI backup [40674672798](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40674672798) and emulator Back/offline [40674672734](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40674672734) on `main` were still in progress when this receipt was written; pre-merge copies of these checks succeeded.

**Known blocker for smooth device upgrades:** the public APK build reported `Persistent QA signer: NO` and certificate SHA-256 `1c2571585f4ceafce6d89eb41cbdc49130fd8b6326a01dbccd060134a3efdf1d`. It is not safe to promise in-place upgrade compatibility; export an independent backup before uninstalling any older debug build. Human Android device testing, a stable signing certificate, real accessibility/audio and specialist filmmaker/Telugu review remain open. This is not a store-ready release.
