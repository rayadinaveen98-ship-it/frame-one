# Frame One v0.12A5 — guarded Android QA release versioning

## Goal

Keep the existing downloadable v0.12A2 preview unchanged while long-lived QA
signing is missing. Prevent a new, temporary-signed build from overwriting it;
prevent versionCode rollback or reuse once persistent QA signing exists.

## Implemented release policy

1. Android-debug GitHub Actions assigns an Android versionCode of 100000 plus
   the workflow run number to the generated Capacitor Gradle project. A rerun
   of that same workflow run uses the same code; a newly dispatched run gets a
   higher code. Unexpected Gradle syntax or package ID fails closed.
2. The built APK's real package identity and versionCode are read using Android
   aapt and the versionCode is appended to the public certificate receipt.
3. The release publisher blocks temporary-to-temporary signing updates when
   an older public APK already exists. Thus missing QA signing secrets do NOT
   silently rotate the public certificate.
4. The known one-time migration from temporary preview to a first permanent
   signer is allowed with an explicit backup/uninstall/install/restore warning.
5. Once the first permanent signer is published, its certificate must remain
   identical. Future publication also requires a strictly increasing versionCode.
6. The existing v0.12A2 signing receipt predates versionCode recording. The
   version policy allows only the known temporary-to-first-permanent transition
   from that legacy receipt. Thereafter missing, duplicate, malformed, equal,
   or decreasing versionCodes are rejected.

No QA keystore, password, signed public APK or user data is committed.
The repository owner must provision the preexisting GitHub Actions secret
FRAMEONE_QA_DEBUG_KEYSTORE_B64 privately; that step remains outstanding.

## Boundaries

This is CI/release infrastructure, not a new app feature or downloadable APK.
Normal CI can still build a temporary-signed test APK, but its automatic public
publication is intentionally blocked when it would rotate the current preview.

Same signer and increasing versionCode are necessary, not sufficient, for safe
updates. A dedicated long-lived QA signing identity, two separate published
builds, a physical-phone in-place upgrade retaining real notes, progress and
storyboards, real export/restore, accessibility and Play Store signing remain
separate release gates.

Before telling testers to reinstall, always require an external, verified
learning-data backup. Do not interpret passing emulator tests as evidence that
the existing temporary-signed public APK can be upgraded in place.

## Acceptance

Require exact PR-head source regression tests, Android package build with a
verified versionCode and package ID, and public-release signing freeze tests.
After merging, independently verify the public download still points to the
v0.12A2 source commit until a persistent QA signer has been provisioned.


## Verified on 29 October 2026

- [PR #29](https://github.com/rayadinaveen98-ship-it/frame-one/pull/29) merged into main as `31e90dfd96e48aa9931f6a8064c9a1e9fd765568`.
- Exact PR-head [web 40828641437](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40828641437), [Chromium 40828641440](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40828641440) and [Android build 40828641450](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40828641450) **all PASSED**. The PR APK receipt confirmed actual versionCode 100098 and temporary signing.
- Independent merged-main [web 40828958938](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40828958938), [Chromium 40828958967](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40828958967) and [Android build 40828958949](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40828958949) **all PASSED**.
- The main-branch [public publisher run 40829271166](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40829271166) **intentionally refused publication**, returning the checked release-policy message: "BLOCKED: public preview remains frozen while using temporary signing." The **publishing job reports failure by design**; no new APK was published.
- Independent GitHub release metadata verified that the public preview STILL targets the prior v0.12A2 source commit `7c5156467200443137f877aeb82fe31c7e196c05`, and the APK remained 4,666,865 bytes. It is still temporarily signed.
- **Release readiness remains blocked** until the owner provisions and privately backs up the long-lived QA debug keystore; a separate-build and physical-phone update/restore test remains outstanding.
