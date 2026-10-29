# Frame One v0.12A4 — real-source Android migration acceptance

## Why this exists

v0.12A3 established that two APKs built from the SAME source with a common
certificate can update in place without losing tested local work. It did NOT
exercise a real change of source code. v0.12A4 closes that narrower gap.

## Two genuinely different app versions

- **Old app**: pinned v0.11A4 source commit
  `b31033bca83f452d3b1891489c09f4f029ca5a58`.
- **New app**: exact pull-request head or merged `main` commit, not a
  floating GitHub APK release.
- Both compile their own Vite/CSS/JS and Capacitor Android application. CI
  refuses to test if the source commits or compiled index pages are identical.
- APK 1 uses Android versionCode 1, APK 2 uses versionCode 2. They share a
  single **ephemeral test signing key created inside the disposable job**.
  This does not configure our permanent release signer.
- Package ID must remain `com.frameone.learncinema` and both APK signatures
  must have identical SHA-256 certificate fingerprints.

## Emulator acceptance

On Android API 35, install old APK 1, then through actual Android controls:

1. Complete the first lesson quiz and verify counted learning progress.
2. Make a scene with the Decision prompt, Close-up framing and a typed shot note.
3. Force-stop, launch offline and verify progress, storyboard and note.
4. Install the newly compiled APK 2 using `adb install -r -t` with NO
   uninstall and NO clearing of app data.
5. Confirm installed versionCode 2 and the same saved data.
6. Force-stop again, launch offline and verify the same data another time.

The [cross-version Android workflow](../.github/workflows/android-cross-version-qa.yml)
uses the existing real-UI [upgrade test](../scripts/android-emulator-upgrade.py).
It never writes learning data into WebView storage directly and never uploads
private signing keys or either test APK. Optional screenshot/hierarchy
artifacts do not determine app test success.

## Limits

This provides a **specific historical-to-current app-code migration test**,
not a universal migration guarantee for all prior APKs, lessons or devices.
It does not prove in-place upgrades of the *public* debug releases, because
their certificates currently change between GitHub builds. It cannot test
actual physical-phone file export, TalkBack, audio output or production
Play Store updates.

**Required next**: provision the separate, persistent QA debug signing secret
privately, verify certificate continuity across separate CI builds and test
an install-without-uninstall upgrade on a physical Android phone. Do not
change or upload the public APK merely to exercise this test.

## Status

Implementation is staged; require passing exact-commit GitHub Actions tests
and a merged-main confirmation before marking this acceptance complete.
