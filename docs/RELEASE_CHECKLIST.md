# Frame One release readiness checklist — 27 October 2026

This page separates *automated test evidence* from *real-person/device acceptance*. v0.9F is an engineering test build, not a public store release.

## Source and continuous integration

- [x] React lessons, six chapters, 47 film terms, all seven React Creative Labs committed.
- [x] Locked npm dependencies and reproducible TypeScript/Vite production build: [web run 40478349107](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40478349107).
- [x] Automated Chromium desktop/phone smoke, all 33 lessons, seven labs, audio lifecycle, backups, offline and autosaved ideas: [browser run 40478349333](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40478349333).
- [x] Backup import storage-error rollback source regression; versioned storage keys unchanged.
- [x] Android debug APK produced on main: [run 40478349105](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40478349105).
- [x] Automatic publish of successful Android build to a stable [public prerelease APK URL](https://github.com/rayadinaveen98-ship-it/frame-one/releases/tag/android-preview-latest): [run 40478579858](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40478579858).

## Browser and cloud acceptance

- [ ] Confirm exact Cloudflare production Worker URL and latest deployed commit from the connected account.
- [ ] Test production HTTPS PWA install, offline reopen and non-disruptive refresh after subsequent deployment.
- [ ] Test backup export and restore across separate actual browser origins/profiles, not just simulation.
- [ ] Manual keyboard-only, screen-reader and reduced-motion review on desktop and mobile.
- [ ] Human review of responsive visuals, touch hit targets and layout on an actual small-screen device.

## Native acceptance

- [ ] Confirm final Android application ID, status/navigation bars, icon/splash, update path and permissions.
- [ ] Install latest debug APK on representative Android phones; test notes, progress, storyboards, sound output, offline and backup export/import.
- [ ] Test native system Back, keyboard obstruction and tablet landscape layouts.
- [ ] Generate/test iOS Xcode build and verify Safari/iPhone audio, storage, controls and safe areas.
- [ ] Configure safe signing/keystores and verify release-signed builds before any app store submission.

## Content, privacy and launch

- [ ] Independent filmmaking and Telugu-language editorial signoff.
- [ ] Privacy policy, IP/artwork rights, app listing assets and clear local-data-loss disclosures.
- [ ] A small beginner-user pilot demonstrating lesson comprehension and first-scene creation.
- [ ] Product-owner go/no-go approval for public launch.
