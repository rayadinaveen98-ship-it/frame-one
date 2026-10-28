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

## Release decision

Keep the release APK unchanged until the branch web build, production Chromium suite, Android APK, Android emulator history/offline suite and Android full-system backup restore suite pass. After merge, confirm the public APK publisher targets the merged commit. Physical-device and editorial checks remain separate gates.
