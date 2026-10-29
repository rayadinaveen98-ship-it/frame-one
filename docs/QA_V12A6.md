# Frame One v0.12A6 — Independent Android builds upgrade gate

## Goal

v0.12A3 and v0.12A4 proved that a same-job Android upgrade can preserve
learning data, including an old-code-to-new-code migration. Both APKs in
those tests had a single throwaway signing key. That does not establish
that APKs made in separate GitHub Actions runs have the same certificate.

This milestone introduces a MANUAL, read-only Android emulator workflow:
.github/workflows/android-cross-run-upgrade-qa.yml

## Requirements and checks

Provide two successful, independently built main-branch run IDs of the
existing Frame One Android debug APK workflow. The jobs must have different
source commits in the right ancestor order. The workflow downloads the
original named Android APK artifacts and their public signing receipts.

The Python verification script (scripts/verify-android-cross-run-apks.py)
requires both receipt files to claim a persistent QA signer, confirms
matching certificate SHA-256 fingerprints and strictly increasing Android
versionCodes, and compares those values against actual signatures and
manifests using Android SDK tools.

It also requires the unchanged Frame One Android app ID, bundled offline
index.html and different compiled app entrypoints. No APK is rebuilt or
re-signed in this cross-run acceptance workflow.

On the Android emulator it then installs the old APK, completes a real quiz,
saves a Make storyboard with a note and framing, restarts offline, installs
the newer APK without uninstalling, verifies data, and restarts offline again.
It reads real versionCodes from the validated receipts instead of assuming
versionCode 1 and 2.

The workflow uploads optional QA screenshots and UI hierarchies ONLY; it
never uploads downloaded APKs or private signing material, and does not
publish or mutate the public GitHub release.

## Outstanding external prerequisites

The private GitHub Actions QA secret, FRAMEONE_QA_DEBUG_KEYSTORE_B64, is
not known to be provisioned and the currently public v0.12A2 preview uses
a temporary signing certificate. Provision and back up a dedicated private
QA key securely outside the chat and repository. Then generate two
independent successful main-branch Android debug APK runs with that same
stable key and run this opt-in workflow using the two run IDs.

DO NOT interpret ordinary web checks or mocked verifier unit tests as a
passing real separate-build upgrade. This feature stays unverified until
the independently signed APKs exist and the Android emulator passes.
Actual physical phone upgrade, native back, local backup export/restore,
accessibility and Play Store signing remain separate release gates.
