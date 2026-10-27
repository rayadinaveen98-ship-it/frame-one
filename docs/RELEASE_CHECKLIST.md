# Frame One release readiness checklist — 27 October 2026

This page separates *automated test evidence* from *real-person/device acceptance*. v0.9M is the latest public **debug test APK**; v0.9J–L were emulator QA-only checkpoints. This is not a store release.

## Source and continuous integration

- [x] React lessons, six chapters, 47 film terms, all seven React Creative Labs committed.
- [x] Locked npm dependencies and reproducible TypeScript/Vite production build: [web run 40478349107](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40478349107).
- [x] Automated Chromium desktop/phone smoke, all 33 lessons, seven labs, audio lifecycle, backups, offline and autosaved ideas: [browser run 40478349333](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40478349333).
- [x] Backup import storage-error rollback source regression; versioned storage keys unchanged.
- [x] Same-schema learning backup copy/paste fallback for Android, with consented restore and Chromium acceptance: [v0.9G browser run 40480555273](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40480555273).
- [x] Historical v0.9G Android debug APK produced on main: [run 40480555401](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40480555401).
- [x] Automatic publish of latest successful Android build to a stable [public prerelease APK URL](https://github.com/rayadinaveen98-ship-it/frame-one/releases/tag/android-preview-latest): [run 40480801867](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40480801867).

- [x] App-local route history and visible mobile Back control validated at 320/390px: [v0.9H Chromium 40482599661](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40482599661).
- [x] v0.9H Android debug packaging and public prerelease: [build 40482599668](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40482599668), [publisher 40482775098](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40482775098).

- [x] Android-only native system Back handler is compiled and auto-linked through the official Capacitor App plugin, verified by [main Android build 40486968418](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40486968418).\n- [x] Native Back mock regression runs in npm tests; [full compiled Chromium run 40486968447](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40486968447) passed.\n- [x] Public GitHub debug APK has visible signing-certificate receipt (persistent QA signer is NOT provisioned): [release publisher 40487176493](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40487176493).\n\n- [x] **Actual Android WebView note persistence across force-stop and airplane-mode cold launch**, with independent [PASS 40494188012](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40494188012), [PASS 40494209385](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40494209385), and [final PASS 40494253148](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40494253148). [v0.9K QA report](QA_V09K.md).
- [x] **Android API 35 emulator system Back flow** (actual native Capacitor APK; Home → Learn → Lesson → Back; Lab → Back; Home minimize): independent [PASS run 40490569350](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40490569350) and [PASS run 40491292091](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40491292091). [Full report](QA_V09J.md).

- [x] Android API 35 offline recovery now covers first quiz **completion (1/33)** and a saved Make Lab **Decision + Close-up + written first shot**, preserved across force-stop and airplane-mode relaunch. [Android v0.9L run 40498806973](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40498806973) **SUCCESS**; [report](QA_V09L.md).
- [x] v0.9M **real Android backup JSON export → app data clear → Android DocumentsUI file selection → restore** with completed lesson, note and storyboard recovered: [full API35 run 40521036808](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40521036808) **SUCCESS**. The test copied the exact app-exported JSON to Downloads through ADB as the external save simulation, not a real share destination choice. [Detailed QA](QA_V09M.md).
- [x] v0.9M native Filesystem and Share plugins packaged; [main Android APK build 40533677449](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40533677449) and [public debug release 40534067096](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40534067096) **SUCCESS**.
- [ ] **Preview release provenance:** the `android-preview-latest` Git tag and GitHub release `target_commitish` must equal the commit reported by the downloadable APK release notes. After v0.9M publishing, assets/notes referenced `1f07b26` but the floating Git tag and release target still pointed to older `be10983` (v0.9F). Publishing-workflow correction is in progress; only a successful future publish and API verification can close this checkbox.
- [ ] **Physical phone** external save/share chooser and JSON import verification; the emulator's ADB copy is not evidence that a person saved a backup to Files/Drive.
- [ ] **Stable QA signing**: persistent secret-managed keystore, two successive same-certificate builds and Android in-place upgrade retention; current public debug APK reports `Persistent QA signer: NO`.

## Browser and cloud acceptance

- [ ] Confirm exact Cloudflare production Worker URL and latest deployed commit from the connected account.
- [ ] Test production HTTPS PWA install, offline reopen and non-disruptive refresh after subsequent deployment.
- [ ] Test backup export and restore across separate actual browser origins/profiles, not just simulation.
- [ ] Manual keyboard-only, screen-reader and reduced-motion review on desktop and mobile.
- [ ] Human review of responsive visuals, touch hit targets and layout on an actual small-screen device.

## Native acceptance

- [ ] Confirm final Android application ID, status/navigation bars, icon/splash, update path and permissions.
- [ ] Install latest debug APK on representative Android phones; test notes, progress, storyboards, sound output, offline and backup export/import.
- [ ] **Physical Android** system/gesture Back, keyboard obstruction, tablet landscape, audio and file handling (emulator KEYCODE_BACK accepted, but phone validation remains).
- [ ] Generate/test iOS Xcode build and verify Safari/iPhone audio, storage, controls and safe areas.
- [ ] Configure safe signing/keystores and verify release-signed builds before any app store submission.

## Content, privacy and launch

- [ ] Independent filmmaking and Telugu-language editorial signoff.
- [ ] Privacy policy, IP/artwork rights, app listing assets and clear local-data-loss disclosures.
- [ ] A small beginner-user pilot demonstrating lesson comprehension and first-scene creation.
- [ ] Product-owner go/no-go approval for public launch.
