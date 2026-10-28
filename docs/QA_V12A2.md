# Frame One v0.12A2 — seamless film scene continuity

Date: 28 October 2026. [PR #26](https://github.com/rayadinaveen98-ship-it/frame-one/pull/26) merged as `7c5156467200443137f877aeb82fe31c7e196c05`.

## User experience

- A learner entering a lesson from a curated collection sees a restrained **scene header** with the actual film journey, current act, **Part N of M**, and an accessible position bar. The duplicate collection Back row is removed, retaining one **View journey** action.
- Beneath the existing quiz, one unified **After this scene** panel gives the actual current-act reflection and the next authored lesson's title and subtitle. At a genuine act boundary it previews the **next editorial act**. For the final lesson it displays the original series closing and a **Return to collection** action, not an imaginary next lesson.
- The collection's **Cinema Library** Back action now returns explicitly Home after finishing a journey, preventing a loop through visited lesson history. Ordinary Android/desktop Back navigation through lessons remains separately tested.
- Normal Learn syllabus lessons retain their original layout, quiz, notes and lesson pagination.
- Offline creative Labs, all 33 lessons, six collections, original progress keys, private notes and JSON backup formats are unchanged. There is no artificial act-completion score or new stored reader state.

## Five exact-commit PR gates

The final PR head `45ac87abecfe19972ce6141aa7aa4673f9c2e7cf` passed all of the following:

| Gate | Passing GitHub Actions run |
|---|---|
| Web regression, TypeScript and offline bundle | [40729586319](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40729586319) |
| Real Chromium desktop and mobile, 320px/390px | [40729585477](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40729585477) |
| Real Android debug APK build | [40729585301](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40729585301) |
| Android emulator Back/offline persistence | [40729585596](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40729585596) |
| Full Android DocumentsUI export/clear/restore | [40729585669](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40729585669) |

Desktop browser assertions verified **ordinary next scene**, real boundary between Acts I and II, real final lesson (no false Act IV), and return-to-Home. Mobile captures `v12a2-scene-bridge-320.png` and `v12a2-scene-bridge-390.png` are in [browser QA artifacts](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40729585477). The screenshots were inspected for header typography, one-stage outro, narrow control layout and genuine scene names.

## Problems caught during verification

An initial browser run failed because returning from the final lesson added a collection page atop history, so its old history-based Back action could lead into a prior lesson instead of Home. The actual collection Back action now explicitly routes to Home; source and browser regressions cover the corrected behavior. An earlier old collection source test expected a `goBack()` implementation; its assertion was updated to require the new direct Home action. All five gates passed on the **final** head after those fixes.

## Open release issues

This is an Android **preview**, not app-store ready. Durable QA debug signing `FRAMEONE_QA_DEBUG_KEYSTORE_B64` has not been securely provisioned; the last public preview was temporarily signed. A new temporarily signed APK can have a different certificate, so a device may require an externally verified local-backup / uninstall / reinstall / restore sequence. A same-certificate, two-version physical-phone upgrade test, manual TalkBack and production release signing remain pending.

## Independent main-branch verification and release

The independent main build of merged source `7c5156467200443137f877aeb82fe31c7e196c05` passed:

- [Web verification 40731071455](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40731071455)
- [Real desktop/mobile Chromium 40731071587](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40731071587)
- [Actual Android debug APK build 40731071443](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40731071443)
- [Public Android APK publisher 40731396092](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40731396092)

The public [`android-preview-latest` release](https://github.com/rayadinaveen98-ship-it/frame-one/releases/tag/android-preview-latest) metadata and exact source commit were verified. The refreshed APK is 4,666,865 bytes, source `7c515646`. Certificate SHA-256: `669aaccf68142c0db7b90b3ff1407a39db40c7131717dc5533a195214e278ea8`. The certificate **differs from the previous public test APK**, and the release notes explicitly warn an in-place upgrade from that older APK will be rejected.

The two independent merged-main emulator runs are [native Back/offline 40731071683](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40731071683) and [full Android DocumentsUI restore 40731071496](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40731071496). They were **in progress when this report was updated**; both corresponding checks passed on the exact PR head. Their final conclusions must be verified before claiming the repeat native checks passed.
