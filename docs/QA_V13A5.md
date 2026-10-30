# Frame One v0.13A5 — Safe physical Android upgrade QA

**State:** source implementation and mock-device regression tests. No real
Android phone has been tested by this milestone. The public test APK is still
v0.12A2 with a temporary signing certificate; it **cannot** serve as the
older APK in a same-signer two-build test after changing to a new permanent
QA certificate.

## What this adds

`scripts/android-phone-upgrade-qa.py` is a locally run, no-third-party-
dependency Python CLI for the **two separate main-branch APK artifacts** used
by [the independent Android emulator workflow](QA_V13A4.md). It first invokes
the project's shared APK/receipt verifier, so the tool checks the **real
package IDs, persisted signing certificate, verified receipt fingerprints,
increasing versionCodes and different offline web bundles** before using adb.

Its four phases:

- `preflight`: checks both compiled APKs and signing receipts; does not
  connect to a phone or install anything.
- `install-old`: only when a physical connected phone/profile has *no
  existing Frame One app*, explicitly approved with
  `--approve-install --confirm-empty-test-profile`. Calls `adb install -t`
  **without** `-r`; refuses to replace an existing app.
- `upgrade-new`: requires the *exact older test versionCode* already
  installed, plus `--approve-install --backup-verified
  --learning-data-created`. Calls `adb install -r -t` — never uninstall or
  clear. If the installed version differs or Android rejects the signature,
  it stops rather than deleting anything.
- `verify-new`: checks the installed package/versionCode using adb, without
  writing to the phone. This is **not** proof of retained notes or storyboard.

The CLI requires a single authorized physical phone (or explicit
`--serial`) and rejects an Android emulator detected by
`ro.kernel.qemu=1`. None of its actions export, read, photograph, upload or
erase the learner's private data. It never creates signing material.

## Prerequisites

1. Set up the private long-lived QA debug signer on GitHub as documented in
   [ANDROID_QA_SIGNING.md](ANDROID_QA_SIGNING.md), **without posting or
   committing the keystore**.
2. Generate two separate successful main Android debug CI runs on different
   ordered source commits, signed with that **same** permanent QA key.
   Download each run's `frame-one-android-debug-apk` artifact and unzip
   into two folders, named `old` and `new`. Each folder must contain
   `app-debug.apk` and `android-qa-signature.txt`.
3. Install Python 3 and Android SDK build-tools (for `aapt`,
   `apksigner`) plus Android Platform Tools (`adb`). For Windows,
   use full paths to `aapt.exe`, `apksigner.bat` and `adb.exe`.
4. Use a **dedicated test Android phone or empty test profile**. Never test
   first installation by wiping your normal Frame One installation.
   USB debugging must be authorized on the test device.

## PowerShell examples (Windows)

Run these from the cloned `frame-one` repository root. Adjust the SDK path,
APK folders and Android SDK version to the machine.

```powershell
$Sdk = "$env:LOCALAPPDATA\Android\Sdk"
$Tools = @(
  "--old-dir", ".\qa\upgrade\old",
  "--new-dir", ".\qa\upgrade\new",
  "--aapt", "$Sdk\build-tools\36.0.0\aapt.exe",
  "--apksigner", "$Sdk\build-tools\36.0.0\apksigner.bat",
  "--adb", "$Sdk\platform-tools\adb.exe"
)
python scripts/android-phone-upgrade-qa.py --phase preflight @Tools

# On a fresh dedicated test phone/profile ONLY:
python scripts/android-phone-upgrade-qa.py --phase install-old @Tools --approve-install --confirm-empty-test-profile

# First open the old app; save a quiz, note and storyboard; verify
# an EXTERNAL JSON backup independently. Then, only when true:
python scripts/android-phone-upgrade-qa.py --phase upgrade-new @Tools --approve-install --backup-verified --learning-data-created

# Read-only version check after the in-place Android update:
python scripts/android-phone-upgrade-qa.py --phase verify-new @Tools
```

If more than one phone is attached, add `--serial SERIAL` to those commands.
Do **not** set acknowledgement flags until their real-world conditions hold.
The tool never performs a backup for you.

## Manual pass/fail after CLI approval

The human tester must still open Frame One and verify the old saved lesson,
quiz completion, authored note and three-shot storyboard after upgrading.
Then force-close and reopen **offline**, confirm native Back behavior and all
seven lab controls, play Sound Lab on the actual device speaker/headphones,
export a new JSON backup and restore into a separate fresh test profile.
Check portrait/landscape, safe areas, TalkBack and Android DocumentsUI.

Document real device model/Android version, old/new GitHub Actions run IDs,
signing fingerprint (public certificate hash only), date, pass/fail and
screenshots **without personal learner content**. Do not mark
`physical_phone_verified` or `backup_restore_verified` in the
[manual release publisher](QA_V13A4.md) until all relevant human tests pass.

**Important boundary:** The old published temporary-key v0.12A2 cannot be
upgraded in place with a new permanent-key APK. Protect existing users via
external backup and the documented one-time migration; do **not** use this
script to uninstall an existing installation.

## Automated tests and limitations

`python3 tests/test_android_phone_upgrade.py` stubs adb and the already
tested shared APK verifier. It checks explicit install consent, required
backup confirmation, pre-existing app protection, wrong version rejection,
no uninstall/clear, device selection, emulator rejection, and read-only
preflight/verification. Existing independent APK receipt/manifest tests
continue to test the actual shared verifier separately.

Automated mock tests are **not** physical-phone acceptance, successful real
APK provisioning, or an app-store release.
