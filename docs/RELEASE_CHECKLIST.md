# Release checklist

- [x] Latest v0.9B React source tree committed and confirmed on main.
- [x] `package-lock.json` committed; CI workflows now install from it with `npm ci` (a clean latest-run confirmation is still pending).
- [x] Prior GitHub Actions `npm test` and `npm run build` green ([successful web build](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40440890519)); current lockfile-based run should be checked separately.
- [ ] All 33 lesson journeys and 7 labs visually tested on built app (v0.9C automated browser workflow committed; passing run and screenshot review pending).
- [ ] Audio Play/Stop, keyboard/screen reader, accessible motion alternatives pass.
- [ ] Offline reload and cache upgrades work on HTTPS PWA.
- [ ] Backups restore across origins/browser profiles and mobile WebViews.
- [ ] Expert English and Telugu content validation complete.
- [ ] Android package ID confirmed, debug APK installed/tested on device.
- [ ] iOS Xcode build, signing and iPhone tests complete.
- [ ] Privacy policy, legal rights, store listings, testing and launch approval.
