# Frame One v0.11A6 — backup-first Android update protection

## Changes

- Android Home shows a compact **Back up** control, even if the learner has created storyboard/notes without completing a lesson.
- Tapping it opens the existing Learn backup panel, scrolls to it and focuses the summary; no extra account, permission, storage schema or backend is added.
- The native share tool still writes and verifies the original v1 JSON, but the app explicitly warns that showing a share chooser is not a successful external save. Users must save and verify the file before uninstalling an older debug APK.
- GitHub's public APK publisher rejects a source commit that is behind or divergent from the current release commit, so delayed workflow results cannot roll back the latest download.
- The publisher validates signing receipt metadata, compares the previous published certificate to the candidate certificate and puts a concrete signer/mismatch warning **in the main release notes**. It never reads or exposes private signing keys.

## Acceptance and tests

- `tests/verify-backup-first-release.cjs`: one-shot navigation, no persistence, Android-only Home shortcut, accessible and focused backup panel, and publisher safety invariants.
- Existing `tests/verify-native-backup.cjs`: correct v1 payload, native cache file verified, content-private external URI and failure boundaries.
- `scripts/android-emulator-backup.py`: real Android Home → Back up → open backup panel → share JSON → save external bytes → clear app → restore via Android DocumentsUI. Actual UI, not a synthetic JS injection.
- Existing full Chromium desktop/320px/390px browser, React lesson and offline persistence checks.
- Build test APK, emulator native Back/offline and full document-picker backup restore.

## Remaining hard gate

This update improves safety messaging but **does not provision a permanent signing identity**. Current publicly released APKs are debug-signed with temporary keys and are not guaranteed upgrade-safe. The one-time encrypted keystore and GitHub secret must be configured securely by an authorized repository maintainer, and a two-version *physical-device* upgrade test must pass before claiming seamless APK updates.

## Release decision

Keep the previous public APK until exact-commit tests succeed, the PR is merged and the public publisher verifies the merged Android artifact and new release notes. Verify that the new release's source and certificate fingerprint match the built APK receipt.
