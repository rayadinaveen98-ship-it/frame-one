# Frame One v0.14A3 — two-project APK upgrade continuity

## Rationale

The Android multi-project backup and restore path has passed with true
DocumentsUI. The same-certificate upgrade test formerly verified only
the original single storyboard. A multi-project app could update and
retain its first storyboard while silently losing other project data.

## New disposable emulator acceptance

Only the **same-source v0.14+** workflow uses the opt-in
`FRAMEONE_UPGRADE_PROJECTS=1`. Its historical v0.11-to-current workflow
does not enable this because v0.11 had no project library.

1. Fresh-install old APK versionCode 1 using one throwaway job-local signer.
2. Answer a real lesson quiz and write a custom Decision / Close-up shot;
   force-stop and reopen with airplane mode enabled to verify old data.
3. Create a **second named film project** with actual Android UI input.
4. Install same-signer newer versionCode 2 with `adb install -r`,
   **never uninstalling** the old APK or clearing its data.
5. Through Android's real WebView, confirm the second project still exists,
   switch to the first and verify its original authored shot and framing,
   then switch back to the second and finally to the first.
6. Reopen the upgraded app **offline** and repeat the two-project
   switch and original-shot verification. Record evidence screenshots.

No production keystore, personal account, private note export, file picker,
or user device is accessed. This is a **same-source, separate versionCode**
test; the independent historical-source migration workflow still verifies
old lesson and single-scene data. Neither test substitutes for two
independently built permanently signed APKs tested on a physical phone.

## Changes / release boundary

The only changes are Android QA automation, its CI trigger/opt-in and source
guard. No app UI, saved data format, permissions, learner materials or public
APK are modified. Public preview v0.12A2 remains temporarily signed;
owner-provisioned persistent QA signing and actual phone validation remain
necessary for safe new preview publication.
