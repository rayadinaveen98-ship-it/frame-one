# Frame One 2.0 — Phase 2D: Real Cut Lab in Option B

**Review status:** stacked draft after Lighting Lab #84. Work is in the *original React Cut Lab*, not a static replica of the six-mission Option B demo.

## Real timeline, not simulated functionality

- The live three-shot original illustrated scene remains the primary hero. It uses the same `CutIllustration` with location, clock/detail and character shots.
- The three functional timeline clips retain selection, left/right reordering, active shot and their individual durations. **Durations move with their shots**, rather than staying incorrectly attached to timeline positions.
- The existing 1–5 second slider updates exactly the selected shot. Existing Play / Stop / Reset and previous/next buttons remain.
- Playback is an illustrated, timed storyboard, *not* a recorder, MP4 video player or real footage editor. The original cancellable `setTimeout` is unchanged: it stops on manual changes, sequence reorder, duration changes and React unmount, and stops at the final frame.
- The optional existing three-scene editing exercise can apply a real preset (order + durations) and show analysis derived from the learner's actual live timeline. No new progress keys.
- The connected Editing lesson, original explanatory text and seven working lab tabs all remain. Lab navigation now sits beneath the active editing practice.

## Visual lock

- Original Option B `#f7fbf9` canvas, `#1c3442` ink, `#55b97b` mint. White film-stage and inspector panels, rounded original storyboard frames, clear green active clips and tactile buttons.
- Scene first in both actual document order and visible layout; editing timeline is immediately after the picture.
- Desktop: original scene/timeline beside controls. 390px and 320px: one-column layout, readable three-clip strip with original Move Earlier / Move Later buttons and no horizontal clipping.
- All visible controls must have actual React state changes. The screenshot art is not a different image from the working editor.
- Reduced motion and keyboard focus preserved; existing strict prototype pixel parity stays untouched.

## QA requirements

1. Source verification protects original three shots, timers, cleanup, reorder+duration lockstep, 1–5s slider, scenario presets, routing, lesson link and honest content.
2. Playwright verifies the actual real editor at desktop and 390px/320px: scene-first stage, mode/order status, shot move, clip selection, duration keyboard control, preview timer cancellation, manual stop, presets, old course navigation and original backup contract. Screenshots `32-real-option-b-cut-desktop.png`, `33-real-option-b-cut-390px.png`, `33-real-option-b-cut-320px.png`.
3. Inspect screenshots, touch targets, disabled controls and overflowing clip names; never relax old tests to hide UI damage.
4. Web, Android debug APK, native emulator, same-signer upgrade, historical data migration, DocumentsUI backup/restore all mandatory before approving the stacked draft. Permanent production signing and real-device checks are separate requirements.

## Next

Sound (actual audio, cleanup and visual soundscape), Colour (actual look and strength controls) and Continuity (true matching exercise) remain to receive their own production Option B redesign.
