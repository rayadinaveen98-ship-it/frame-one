# Frame One v0.9M — native Android backup/share and external-file restore acceptance

**Engineering milestone:** 27 October 2026. Implementation intentionally preserves **frameone-learning-backup v1**, `frameone-progress-v01`, `frameone-practice-v07`, and `frameone-scene-v07`.

## Root problem

The original browser's `Blob` object-URL download works in desktop Chrome but may not result in any saved file inside a Capacitor Android WebView. The app's button said "Backup download prepared" without knowing whether a destination file had actually been saved, leaving users potentially believing their data was protected.

## Implementation

- Lock official `@capacitor/filesystem@8.1.5` and `@capacitor/share@8.0.3` dependencies and let `npx cap sync android` register their native plugins.
- On Android, **Learn → Keep a copy of your learning → Save / share backup JSON** prepares the unchanged, validated original v1 JSON using the existing `getBackupJSON()` bridge, writes `frame-one-learning-backup.json` to Android's **private cache**, reads it back to verify exact contents, and invokes Android's save/share chooser with the native file URI. No new storage keys, network uploads or broad storage permissions.
- **The cache is not a durable backup.** It may be deleted or wiped when the app is uninstalled. The UI explicitly tells learners to choose an external Files, Drive or other storage destination and verify the JSON is saved there before replacing their APK.
- Desktop/web retains the existing **Download learning backup** button. Android and web both retain the existing **Restore a backup JSON file** picker and the manual JSON copy/paste fallback.
- Any restore still parses and schema-validates the existing v1 payload and requires explicit overwrite confirmation; rollback is best effort because WebView localStorage isn't transactional.
- Private JSON is never logged, transmitted to Frame One services or written to public app directories automatically.

## Automated acceptance

- `tests/verify-native-backup.cjs` tests Android-only scope, byte-for-byte correct v1 data, native Cache placement, readback, FileProvider share URI and safe format/size/error guards.
- Web verification, Chromium desktop/mobile, native Gradle build and plugin discovery must all pass after integration.
- `scripts/android-emulator-backup.py` exercises actual user-created notes, completed lesson and Make Lab storyboard on Android. It taps **Save / share backup JSON**, extracts the *actual plugin-written cache file* in a disposable debug emulator (via `adb run-as`), checks all saved fields, copies those same bytes to Downloads as the simulated external destination, clears the entire app's private data, uses Android's actual file picker to restore, consents to overwrite, and checks the completed lesson and Make scene returned. **This is not an injected or fabricated backup.**
- Screenshots and accessibility hierarchies are collected for any failure. If Android Test Device has no working SAF document picker or compatible share destinations, report that explicitly and keep the gate open. Do not claim the user's external saving action itself was performed by CI.

## Why there are now two emulator types

The original `aosp_atd` Automated Test Device is intentionally stripped of system applications. Its Android WebView installed and **wrote a real v1 JSON backup** containing a completed lesson, private practice note and authored Make Lab storyboard. An external host copy of that exact file survived `pm clear` as intended. But when the native Android file-restore button was tapped, the captured UI hierarchy remained inside Frame One: the ATD did not expose a DocumentsUI Downloads destination. Do not claim native file picker restore failed in the app or passed in the test; the headless system is not a representative phone.

We have split the acceptance:

- **Lightweight ATD native acceptance** (`android-emulator-qa.yml`): verifies the installed Android app, lesson/storyboard/private-note preservation, bytes of the exact Capacitor Filesystem cache backup and Back navigation. Runs `FRAMEONE_BACKUP_EXPORT_ONLY=1`.
- **Full AOSP Android 35 acceptance** (`android-backup-picker-qa.yml`): runs the whole export → copy original bytes externally → `pm clear` → Android DocumentsUI picker → restore → verify progress/storyboard flow, with a complete Android image rather than the stripped ATD. The test logs available `OPEN_DOCUMENT` / `GET_CONTENT` resolvers and captures picker screenshots/hierarchy for a precise diagnosis if the chooser is unavailable.

The *share/save destination itself* is not simulated by a real user in CI; the test copies only the original plugin-exported bytes to the public Download directory, rather than inventing a payload. Real phone acceptance must confirm which external destination apps receive shared JSON files, and whether the user can find that file afterward.

## Full Android test isolation correction

An initial full AOSP run failed before it reached the backup file picker because the previously used practice-note restart test could select an offscreen virtual lesson node after WebView preserved its scroll position. An attempted scroll reset did not reliably solve that unrelated UIAutomator dependency.

The full-system restore job now runs `android-emulator-backup.py` **as an independent test**. It clears its disposable app at the start and creates the lesson practice note, completed lesson and authored Make storyboard through Android's actual screens. It then obtains the actual Capacitor-generated JSON, preserves those bytes externally, clears app data and tests DocumentsUI restore. This avoids confusing a prior script's navigation failure with a backup defect.

Only report complete export + import recovery when the full-system GitHub job passes. A passed lightweight `aosp_atd` export test does **not** establish document-picker recovery.

## Corrected Android emulator root-cause analysis and Back safety

A captured full-emulator screenshot from run [40511507458](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40511507458) shows that the test **never opened the lesson**: it had tapped an off-screen virtual accessibility node and then typed the alleged practice note into the **Learn search field**. That made the exported backup correctly omit a lesson practice note, despite the test misleadingly printing that it had opened a lesson.

The native navigation handler also now defensively blurs any focused INPUT/TEXTAREA/SELECT/contenteditable element before following a Back event. The handler has source-level regression tests, but the screenshot **does not prove** that Android's Back handler caused the original test failure. Treat the native safeguard as a separate precaution pending device validation, not as the demonstrated root cause.

The correct test fix (commit `c25e6783`) is to tap the visible, exact **Continue learning →** button and assert that the **My own filmmaking idea** lesson-only field is present *before typing*. The lesson should then be saved normally, including a user-facing Save action, and the actual exported JSON must contain that practice marker along with completed progress and Make Lab scene. Only passing real Android evidence establishes restoration.

## Verified real Android backup recovery (27 October 2026)

- [Full Android API 35 system test 40513125604](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40513125604) — **SUCCESS** on branch commit `a69343c5`. It generated real learner practice and storyboard data, wrote the original v1 JSON via native Filesystem, inspected the cache file's exact data, preserved those actual bytes into external Downloads via ADB, **cleared all app-private data**, reopened Frame One, selected Downloads and the JSON through Android's DocumentsUI, approved the restore prompt, and verified original completed lesson and storyboard values returned. The test ended with `FRAME ONE ANDROID BACKUP EXPORT RESTORE: PASS`.
- [Independent full Android run 40512859855](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40512859855) also **SUCCESS** on prior branch commit `c25e6783`.
- The [web build 40513125902](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40513125902), [Chromium UI suite 40513125600](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40513125600) and [Android packaging 40513125595](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40513125595) all **SUCCESS** on `a69343c5`.
- The lighter [Android ATD 40513125805](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40513125805) was **FAILURE**, *not* a failed backup restore: the automated Make Lab Decision selector was offscreen and returned virtual `[0,0][0,0]` bounds. QA now scrolls to the top before selecting Decision. Re-run required before merging.
- **Distinction:** automated CI used ADB to preserve the exact native-exported bytes into Downloads. It did not prove that a person can choose Google Drive, Files, or an external share destination on a physical phone. That is a separate release/device gate.

## Remaining release gates

- Physical phone Share sheet + Save to Files/Drive, Android DocumentsUI import from Downloads/Drive, TalkBack/focus management, offline sharing, storage and permissions across Android OEM versions.
- Persistent signing key, two successive same-signer builds and in-place upgrades preserving data.
- Verified real Cloudflare Worker HTTPS site, iOS, privacy/distribution review.

This version is an app-code upgrade (unlike QA-only v0.9J/K/L) and must pass GitHub production-web, real Chromium, native plugin linkage, Android emulator and public APK release gates before it is described as a downloadable **v0.9M**.

## Final pre-merge acceptance and published Android preview

- [Full Android API35 restore 40521036808](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40521036808) — **SUCCESS** on final PR revision `a00a6762`. The UIAutomator log demonstrates a real saved lesson practice note, first completed lesson, Make Lab Decision/Close-up storyboard, native Filesystem export, preservation of exact exported bytes in external Downloads, **complete app data clear**, Android DocumentsUI Downloads selection, JSON-file selection, explicit `OK` confirmation and restored progress/storyboard. It finishes `FRAME ONE ANDROID BACKUP EXPORT RESTORE: PASS`.
- [Native lightweight Android emulator 40521036608](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40521036608) — **SUCCESS**: practice note offline persistence, completed lesson and storyboard after restart, verified native export and system Back/Home minimize all pass.
- [Web 40521036189](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40521036189), [full Chromium QA 40521036181](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40521036181), [Android debug build 40521036091](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40521036091) — all **SUCCESS**.
- [PR #9](https://github.com/rayadinaveen98-ship-it/frame-one/pull/9) merged as `1f07b26fb3d1ada09265c8e3689f5277d90cd7f4`.
- Independent merged-main [web 40533677457](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40533677457), [Chromium 40533677679](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40533677679), [Android APK 40533677449](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40533677449) and [APK publishing 40534067096](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40534067096) are **SUCCESS**.
- [Public debug test APK](https://github.com/rayadinaveen98-ship-it/frame-one/releases/tag/android-preview-latest) now includes v0.9M, size **4,525,951 bytes**, along with `SHA256SUMS.txt` and `android-qa-signature.txt`.
- **Warning:** main Android packaging reports `Persistent QA signer: NO`; this CI runner used an ephemeral debug keystore, so users must export and verify a backup *before* testing an update over an existing installation. Do not claim update-in-place is safe.
- Independent post-merge full and lightweight emulator reruns are still to be recorded separately. The full CI external-save step uses ADB to preserve app-produced bytes; it does not establish that a person saved the file using the Android chooser on a physical phone.

## Independent main Android restore confirmation

[Full-system Android API35 job 40533677486](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40533677486) — **SUCCESS** on merged `main` revision `1f07b26f`. The native log explicitly confirms `PASS: native Filesystem wrote exact learner practice/progress/storyboard backup bytes`, `PASS: Android system file picker imported backup after user confirmation`, `PASS: exported JSON restored completed lesson and Make Lab story after total app data clear`, and finally `FRAME ONE ANDROID BACKUP EXPORT RESTORE: PASS`.

This independently verifies the full Android *restoration* acceptance after merge. The test still uses an ADB copy of the actual exported bytes as the simulated external save step; real-device share destination acceptance and stable signed in-place updates remain pending.

## Independent main lightweight-emulator acceptance — PASS

[Main Android API35 native suite 40533677695](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40533677695) — **SUCCESS** on the merged implementation. The actual log confirms offline practice-note recovery, completed first lesson and Make storyboard after offline restart, native Filesystem backup JSON export, Android system Back from lessons/labs and Home minimize while the app process stays alive. It ends with `FRAME ONE ANDROID EMULATOR SMOKE: PASS`.

Together with [main full Android system restore 40533677486](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40533677486) **SUCCESS**, the complete merged-main native acceptance is now passed. Physical Android share-destination acceptance, permanent signing identity, app-store release and verified Cloudflare live deployment remain pending.
