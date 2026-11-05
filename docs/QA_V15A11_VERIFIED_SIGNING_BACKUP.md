# Frame One v0.15A11 — verify Android QA signing backup before provisioning

## Why

The Android QA helper previously required the owner to acknowledge that an encrypted backup had been made, but did not compare the backup with the original keystore. A wrong or corrupted copy could therefore be mistaken for a recoverable signing identity.

This change adds a **read-only backup verification mode** and requires the same verified backup at secret-provisioning time. It does **not** create a real private key, install a GitHub secret, build a public APK or authorize release.

## Trusted Windows machine procedure

1. Run the reviewed `scripts/setup-frameone-qa-signing.ps1` script without arguments to inspect local prerequisites.
2. If no Frame One QA key exists, run `-CreateKey` **once**. Never overwrite or rotate an existing QA signing identity.
3. Copy the generated keystore to a **separately protected encrypted** backup location outside the Git repository. Verify you can access this encrypted storage independently. The script cannot prove that a drive or archive is encrypted or that recovery will work after the original device is lost.
4. Set `$backup` to the real path of the copied `.keystore` file, for example:

   ```powershell
   $backup = 'D:\EncryptedBackups\frameone-qa-debug.keystore' # replace with your existing protected copy
   .\scripts\setup-frameone-qa-signing.ps1 -VerifyBackup -BackupPath $backup
   ```

5. Only if the comparison succeeds and the owner has **actually** confirmed encryption and separate recovery, run:

   ```powershell
   .\scripts\setup-frameone-qa-signing.ps1 -ProvisionSecret -BackupConfirmed -BackupPath $backup
   ```

If using the portable one-file helper from Downloads, remove the `scripts\` prefix. Never paste a keystore or its base64 into ChatGPT, an issue, Git or a shared file.

## Verification behavior

- Rejects missing backup paths, missing files, empty copies, the original key path reused as its own backup, and copies within the Git checkout.
- SHA-256 comparison uses local file bytes and never prints the file hashes, key bytes or base64 encoding.
- Rejects changed, corrupted and mismatched copies. The owner must independently verify backup encryption and separate recoverability.
- The `-VerifyBackup` action is read-only and does **not** access GitHub.
- The `-ProvisionSecret` action also repeats the backup byte comparison before contacting GitHub. It still requires `-BackupConfirmed` and authenticated GitHub CLI. Existing script behavior never creates and provisions a key in the same invocation.
- The Windows Actions regression runner uses **ephemeral test-only keys** outside the Git checkout and never provisions or uploads an Actions secret.

## Release boundary

Persistent QA signing must be verified through a real main-branch APK build receipt. Two **different main-source** builds with the same stable signing identity must pass cross-run Android emulator upgrade QA, followed by a real phone test for data retention, external backup/restore, Back navigation and offline restart. The human owner must explicitly approve publication. This change is **source + safety automation only**; the public temporary-signed v0.12A2 APK is not replaced.
