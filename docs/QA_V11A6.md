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


## Verified release receipt — 28 October 2026

v0.11A6 was merged from [PR #22](https://github.com/rayadinaveen98-ship-it/frame-one/pull/22) as source `a81e66cb9524c3806c6c18da11f1c282d6c384f4`. All **five exact-head pre-merge checks** passed at `24aaa8b55aad244547182ea971f619f3067d2dc8`:

| Gate | Passing run |
|---|---|
| Web / curriculum / TypeScript | [40707070867](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40707070867) |
| Browser / desktop / mobile | [40707070923](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40707070923) |
| Android debug APK | [40707071008](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40707071008) |
| Native Back/offline learner persistence | [40707070876](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40707070876) |
| Full Android DocumentsUI external JSON backup restore | [40707070920](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40707070920) |

Independent main [web 40708748315](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40708748315), [browser 40708744699](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40708744699) and [Android APK 40708745818](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40708745818) passed. [Public publisher 40709280101](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40709280101) passed; the public [APK release](https://github.com/rayadinaveen98-ship-it/frame-one/releases/tag/android-preview-latest) identifies `a81e66cb` and exposes a certificate mismatch warning in the primary release notes.

**The main-branch repeated native emulator [40708744714](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40708744714) and backup [40708744958](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40708744958) runs were still in progress when this record was written; the exact-code PR checks passed.**

**Confirmed signing status: TEMPORARY.** The new certificate SHA-256 is `7bf4a1fb60b88307042cb3236fe34957caa9d761485ec1797d0a3b1a32b411c5`. It differs from the previously published certificate, and an in-place update from that prior preview APK will be rejected by Android. Preserve an externally verified backup before uninstalling. See [secure signing handoff](ANDROID_QA_SIGNING.md). Physical-device and TalkBack/manual usability acceptance are not complete.


## v0.11A7 QA remediation — fully verified on main

The v0.11A6 `main` repeat DocumentsUI test [40708744958](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40708744958) failed before any export, while trying to tap a Home backup shortcut from a page state inside a collection. The native emulator error was `Cannot find enabled visible Android control 'Back up'`. The failed screenshot showed collection content. This was a navigation dependency in the combined test, **not evidence of corrupted or missing backup bytes**.

[PR #23](https://github.com/rayadinaveen98-ship-it/frame-one/pull/23) made the native test deterministic by separately verifying a fresh Android Home shortcut before authored content is created, and then verifying the full independent export/share/clear-system-data/DocumentsUI restore flow with real in-app user actions. It changed **only** `scripts/android-emulator-backup.py`, not the APK, storage implementation, user progress, or signing key.

- Exact PR head `8d24e09e018d8f3a5e74b6ae36475009a0cbb1e3` passed [web 40713744051](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40713744051), [browser 40713744422](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40713744422), [Android Back/offline 40713743879](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40713743879) and [full AOSP backup/restore 40713744107](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40713744107).
- Squash merged to main as `61b7e0b885a350cae7a5fb73e33d6368264180fd`.
- **Repeat main-branch gates passed:** [web 40715481872](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40715481872), [native Android Back/offline 40715481928](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40715481928), [full Android DocumentsUI 40715481868](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40715481868).
- The full Android log proves: `PASS: fresh Android Home backup shortcut opens actual learning backup tools`, `PASS: Android system file picker imported backup after user confirmation`, `PASS: exported JSON restored completed lesson and Make Lab story after total app data clear`, `FRAME ONE ANDROID BACKUP EXPORT RESTORE: PASS`.

**Resolved:** this specific automated QA blocker. **Still unresolved:** one-time provisioning of a durable QA debug keystore (GitHub Actions secret `FRAMEONE_QA_DEBUG_KEYSTORE_B64`) and a same-signer, two-version *physical phone* upgrade test. The public v0.11A6 Android test APK remains temporary signed and may need uninstall-and-restore. No new APK was warranted by this test-only change.
