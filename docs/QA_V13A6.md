# Frame One v0.13A6 — private Android QA signing on Windows

## Purpose and release boundary

The Android debug build now supports a long-lived QA signing identity, but
the owner must create it **privately**. A script added at
`scripts/setup-frameone-qa-signing.ps1` makes that one-time step repeatable
on a trusted Windows PC. It **does not** make a Play Store signing key;
does not install an APK; and **cannot** approve or trigger publication.
Since v0.13A4, public APK publication is manual-only and requires actual
separate-build upgrade QA, physical-phone acceptance and backup confirmation.

## What this script does

- Without switches: **read-only** inspection of installed tools, key
  existence and private location. It does not connect to GitHub.
- `-CreateKey`: uses JDK `keytool` to generate one dedicated **test-only**
  Java keystore with alias `androiddebugkey` and conventional Android debug
  passwords. Its default location is under Windows `%LOCALAPPDATA%\FrameOne\QA`,
  **outside the repository**. Refuses to overwrite an existing key.
- `-ProvisionSecret -BackupConfirmed`: checks the already existing debug
  key, verifies `gh` authentication and uploads only its base64 bytes
  over GitHub CLI **standard input** into the encrypted repository Actions
  secret `FRAMEONE_QA_DEBUG_KEYSTORE_B64`. No byte string is printed,
  copied into the source tree, stored as a GitHub artifact or put on the
  command line. The script has no mode to retrieve a GitHub secret.
- It refuses to create and provision in the same invocation: first make
  and verify a separate encrypted copy of the keystore. Do not use the
  `-BackupConfirmed` flag until that external backup actually exists.

## One-time owner steps (Windows PowerShell)

**Prerequisites:** a trusted Windows laptop/PC, JDK 21 (or a compatible JDK)
with `keytool.exe` on PATH, GitHub CLI (`gh.exe`) installed, and access to
the `rayadinaveen98-ship-it/frame-one` repository. If GitHub CLI is not
authenticated, run `gh auth login` locally. None of these steps need a
paid API. Use your own account and never paste credentials into chat.

From the **cloned repository root**:

```powershell
# 1. Read-only inspection, safe to repeat:
.\scripts\setup-frameone-qa-signing.ps1

# 2. Create a brand-new dedicated QA key locally:
.\scripts\setup-frameone-qa-signing.ps1 -CreateKey

# 3. STOP: privately back up and verify this local file outside the repo:
# $env:LOCALAPPDATA\FrameOne\QA\frameone-qa-debug.keystore
# Keep an encrypted offline copy. Never commit, email or share it.

# 4. Only after verifying the encrypted backup, provision the GitHub secret:
.\scripts\setup-frameone-qa-signing.ps1 -ProvisionSecret -BackupConfirmed
```

If Windows script execution is blocked by local policy, open a trusted
PowerShell window and check `Get-ExecutionPolicy -List` rather than
permanently weakening system-wide execution policy.

## Acceptance after provisioning

1. Manually run [Frame One Android debug APK](../.github/workflows/android-debug.yml)
   on `main` and inspect the **build artifact receipt**, not the public
   download. It must say `Persistent QA signer: YES (managed by GitHub Secret)`.
2. Keep that key unchanged. Generate a second independently built APK
   from a later descendant source commit using the same signer (versionCode
   higher, different compiled app content). Do not simply rerun the same
   source expecting it to count as independent upgrade acceptance.
3. Pass the [independent two-build Android upgrade workflow](../.github/workflows/android-cross-run-upgrade-qa.yml).
4. Follow [v0.13A5 physical-phone QA](QA_V13A5.md) using a **dedicated
   fresh test profile**. Confirm actual quiz, progress, note, storyboard,
   offline reopen, Android Back, sound, and **external backup restore**.
5. Only after that, deliberately approve the
   [manual public APK publisher](../.github/workflows/publish-android-preview.yml).

**Existing APK warning:** the published v0.12A2 uses a different temporary
debug certificate. The first stable-key APK cannot upgrade over it. Export
and verify an external learner backup before any uninstall/reinstall.

## Tests and constraints

The Windows-only GitHub Actions check parses the script, runs safe read-only
inspection, verifies permission refusal, creates a **temporary local test key**
in the ephemeral runner outside Git, validates its alias, refuses key
overwrite and deletes the test directory. The check NEVER calls the
`-ProvisionSecret` action with a backup confirmation or uploads a key.

No production key or live GitHub secret is generated or accessed by these
tests. Until the owner completes the procedure, persistent signing is
**not proven** and the public APK must remain unchanged.
