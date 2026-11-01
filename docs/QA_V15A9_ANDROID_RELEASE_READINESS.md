# Frame One v0.15A9 — read-only Android release readiness

## What this milestone solves
The public Frame One Android preview and the newest source build are not necessarily the same APK. Passing build checks does not prove Android will accept an in-place upgrade: certificate identity, versionCode, app ID and existing learner data matter.

The repo already has a manual publisher, cross-build emulator acceptance and Windows keystore setup. This milestone adds an automatic, read-only status report after a successful trusted main-branch Android debug build. It never removes the existing publisher's physical-phone, independent two-build upgrade and approval gates.

## Generated report
GitHub Actions: **Frame One Android release readiness report**. It reads the successful main APK build's public signing receipt, its run metadata, and the public floating-preview release metadata. Before saving its report it discards the downloaded APK.

It distinguishes:
- Exact successful main build, source SHA, Android versionCode and public signer certificate fingerprint.
- Temporary signing versus persistent QA signing; missing, duplicated or malformed receipts are rejected.
- Whether the current public preview was built from the same source commit (not equivalent to signing/update compatibility).
- Independent separately built APK upgrade, physical-phone backup/restore, and product-owner approval: **always shown as not verified by this status report**, even when the signer is persistent.

Output: GitHub Actions Job summary and a 30-day artifact named frame-one-android-release-readiness. The report publishes no APK or key.

## How to view
1. Open [GitHub Actions](https://github.com/rayadinaveen98-ship-it/frame-one/actions) and find **Frame One Android release readiness report** after a successful main-branch Android debug build. Read its Job summary.
2. Or select Run workflow and enter a successful main-branch Frame One Android debug APK run ID.
3. A temporary signer is **not an update-safe APK** for any older version signed with a different certificate.

## Actual blocker: owner must provision a private key
The current publicly published APK remains the older v0.12A2 temporary-key preview. The persistent QA debug identity is separate from Play Store production signing.

The secure one-time process is documented at [Android QA signing](ANDROID_QA_SIGNING.md) and [Windows setup](QA_V13A6.md):

- Keep the key outside the Git repository; maintain a verified encrypted backup.
- First inspect using the existing read-only Windows helper. Only then opt in to create a dedicated local QA identity.
- Privately provision the existing FRAMEONE_QA_DEBUG_KEYSTORE_B64 GitHub Actions Secret with the approved helper. Never paste the secret or keystore into chat.
- Build two separate successful main APKs using that same persistent signer and increasing versionCodes; pass the independent cross-run upgrade emulator.
- Export a backup from existing temporary-key installations, verify external restore on a real Android phone, then perform safe migration.
- Explicitly approve public QA preview publication only after all gates.

## Scope and limits
No changes to lessons, seven Labs, Home, progress, saved storyboards, backup format, Android application ID or signer configuration. Regression cases cover both signer modes, valid source provenance, malformed or duplicate receipts, and blocked false approvals.

**Passing this report is not permission to publish.**
