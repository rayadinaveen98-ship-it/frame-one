# Frame One v0.12A1 — Cinematic Act Focus QA

Checkpoint: 28 October 2026. [PR #25](https://github.com/rayadinaveen98-ship-it/frame-one/pull/25) merged into main as `05aafda5781bc6d8aeeb38fca42d51fa3800177c`.

## User-facing change

The film-collection page retains its existing default full three-act browsing and original authored content. Its featured chapter offers **Explore this act, scene by scene**. Choosing it scrolls to the chapter sequence and switches to an **ephemeral one-act focus mode**. Previous/Next traverse the actual editorial acts; the first previous and final next controls disable correctly. **Show all three acts** restores every chapter, including the full finale and browse-beyond controls. The finale appears in focus only at the last act.

This does not write any new local state, alter learner lesson completion, move Labs into scored progress, change backup schema, fetch external imagery or change Android signing. It keeps the original 33 lessons, seven Labs and six curated journeys.

## Verified exact-commit PR CI

The final PR head `87144b1ed37e358dc8dcff6873509880339371c7` passed:

| Check | Run |
|---|---|
| Web source + TypeScript + offline build | [40724023154](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40724023154) |
| Desktop and responsive Chromium QA | [40724023170](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40724023170) |
| Real Android debug APK compile | [40724023189](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40724023189) |
| Android emulator Back/offline persistence | [40724023119](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40724023119) |
| Full Android DocumentsUI JSON export/restore | [40724023088](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40724023088) |

Chromium saved actual Act Focus captures at **320px and 390px** (`v12a1-focused-act-three-320.png` and `v12a1-focused-act-three-390.png`) in the browser QA workflow artifact. Desktop tests exercised mode toggling, real lesson counts and all three act stepper boundaries. Mobile tests entered focused Act III, verified exact lesson count, then returned to all acts.

## Native QA root-cause correction

A first full backup test on an earlier PR commit could not find **Continue learning** on Learn after visiting the Android backup panel. Its captured screenshot showed the Learn page retained at the footer; the accessibility helper searched downwards for a top-of-page action. [That earlier failed run](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40722855917) occurred **before** backup export. The shared emulator helper now resets the Learn screen to the top before this step. All five checks subsequently passed at the *latest* PR head above.

## Remaining before app-store release

Physical-device accessibility and two-version upgrade acceptance remain pending. The current preview is temporarily debug signed; a permanent QA keystore GitHub secret has not been provisioned. Replacing a differently signed APK may require reinstalling; export and verify a backup before removal. Production signing/Play Store readiness are separate milestones.

## Merged-main verification

Independent main-branch checks started after merge. Confirm their final conclusions before calling the refreshed public APK verified.
