# Frame One v0.16A2 — Motivate every frame

## Why this change

The existing Frame Lab already teaches wide, medium and close crops with a single original SVG illustration, a crop slider, framing guides and a comparison view. It was technically interactive, but the learner did not always have a story reason to choose a shot size.

This phase adds a **small optional framing-direction workshop below the existing illustration**, not a new screen or heavy Home card. Three scene situations introduce a question first:

- **A new location:** what does the audience need to see of an unfamiliar place? Starting crop: wide 1× with guides.
- **A difficult conversation:** where might gesture be readable without losing all context? Starting crop: medium 2× with guides hidden.
- **A silent reaction:** which view might reveal subtle facial information? Starting crop: close 3× with guides hidden.

Each starter drives the **existing React crop, mode, and guide controls** and closes comparison to show one readable frame. A second explicit action discusses the learner's actual current mode and zoom; there is no score or universal emotion claim. The learner can adjust the regular lab controls and see the discussion update without copying or saving any new data.

The exercise ends with a real-phone shooting challenge, carefully distinguishing **cropping a static image** from moving an actual camera or changing perspective. This is an original illustration, not a realistic optics or acting simulator.

## Design choices

- Closed by default, integrated in the Frame Lab below the original visual stage.
- Reuses existing colours, compact typography and section language; no additional Home banners or onboarding text.
- Three accessible scene choices with pressed states, explicit starter and discussion buttons, and polite on-demand feedback.
- Fits desktop and stacked 320px/390px layouts. Motion is reduced when user preferences request it.
- All data lives in React's existing session UI state. No changes to the 33 lessons, seven Labs, local notes, storyboards, learning progress, backup JSON, app ID, or native permissions.
- No third-party art, streaming media, network requests or paid services.

## Verification requirements

The new source test runs within `npm test`. Compiled-browser QA should establish:

1. Workshop is collapsed on first entry.
2. All three prompts are reachable via real controls, and scene changes clear stale discussions.
3. Each starter updates the actual SVG crop, mode, zoom and guides in the existing Frame Lab.
4. A new starter closes comparison mode, so only the selected illustration is visible.
5. Real browser at 320px and 390px fits the stacked options without horizontal overflow; desktop and phone screenshots are captured.

PR acceptance requires green web source/TypeScript, compiled browser, Android debug APK, native Android backup/restore and offline checks, same-signer upgrade, and historical-source migration tests. A green source PR does not authorize production APK publication.

## Release boundary

Public preview v0.12A2 is signed with an old temporary debug identity. Persistent private QA signing, independent two-build upgrade verification, real-phone backup/recovery and the owner's manual approval are still required for a public update. Do not replace the public preview with a temporary-signed artifact.

## Native backup acceptance — Make Lab viewport RCA (5 Nov 2026)

The initial PR run failed at the Android `Decision` button while creating the original Make Lab storyboard before exporting the external JSON backup. The failure screenshot and UIAutomator XML showed the button **present, enabled and clickable** at `[522,1909][726,2033]`; the fixed mobile navigation began at `y=2028`. The old automation refused it because the button's *full* bounds extended below its conservative `2028 - 55` safe limit. This was a **test automation false negative** (not evidence of lost data or a broken button), but backup success is **not claimed** until the updated real-device emulator workflow actually passes.

The shared native control helper now clips candidate button bounds to the unobstructed viewport and taps the center of at least 45 visible vertical pixels. A target wholly under the tab bar, a tiny visible sliver, and an empty `[0,0]` virtual node are still blocked. A Python regression reproduces the exact public screenshot coordinates and verifies safe clicking above the nav bar. The Android backup workflow runs this regression before its real device/emulator backup test. No application, learner or storage schema is changed by the test-helper fix.
