# Frame One v0.9L — Native learner progress and storyboard recovery

**Started:** 27 October 2026 · Engineering-only Android acceptance, not a user APK.

## Purpose

Prior v0.9K emulator testing proved practice-note persistence after force-stop and offline reopening. This new QA scenario targets the other two private learning records that matter most to new filmmakers: **completed lessons** and **their three-shot story plan**.

## Exact Android test contract

- Build the unchanged application source as an Android API 35 AOSP Test Device APK, install it, and launch it through the normal Android launcher.
- Go to Learn and use the **first lesson** with its real quiz. Answer the correct question, press **Mark lesson complete**, and verify progress updates to **1/33 lessons**.
- Open Lab → Make, select story question **Decision**, select **Close-up** framing for shot one, write a distinctive first-shot note in Android's WebView textarea, and press **Save scene**. Verify selected controls and the saved note.
- Force-stop Frame One, enable Android airplane mode and disable Wi-Fi, relaunch the native app, and verify the lesson count is still one, then reopen Make and find the same story question, framing and written note.
- The test uses UIAutomator XML and ADB touch/input. It does not inject data directly into WebView localStorage or fetch private learning data from any remote server.
- The existing v0.9K private practice note and v0.9J native Back regression must still pass. Screenshots/UI hierarchies are uploaded even if Android rejects a control or loses data.
- **Do not claim success until the exact GitHub Actions source, Chromium and emulator acceptance runs are green.**

## Still outside scope

Native file-picker backup recovery and complete JSON export/import, multiple builds with the same stable signing certificate and in-place upgrades, physical Android audio/gesture/keyboard QA, real Cloudflare Worker deployment, and iOS.

**There is no new v0.9L APK unless an actual app bug necessitates a source fix.** If a test-only script is wrong, correct its selectors without changing learner logic.

## Verified feature-branch acceptance (27 October 2026)

- [Web/source/TypeScript checks 40498806952](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40498806952) — **SUCCESS**.
- [Compiled desktop/mobile Chromium QA 40498806967](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40498806967) — **SUCCESS**.
- [Actual Android API 35 emulator QA 40498806973](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40498806973) — **SUCCESS**. Verified real practice notes, quiz completion, **1/33 progress**, Make Lab **Decision**, **Close-up**, authored first-shot note, force-stop, airplane mode and *the same progress/story note after cold relaunch*. The existing native Back/Home minimize smoke also finished **PASS**.
- [PR #8](https://github.com/rayadinaveen98-ship-it/frame-one/pull/8) squash-merged to `main` at `28b5cf2642f0dbea8d86a2210f1a2f7c89cb1e67`.

## Test investigation notes

The first Android test selected Decision correctly but Android's UIAutomator represented story-choice ToggleButtons with `checked=false` even while their selected story changed; QA now checks the actual displayed story question. The HUD displays `STORYBOARD · SHOT 01 · CLOSE` in separate accessibility TextViews, so the test requires the exact rendered `CLOSE` value instead of an impossible single text label.

With the Android keyboard shown, the WebView's visible height shrinks and Save scene is below the keyboard. QA dismisses the input method through native Back, confirms the Make Lab remains open, then taps **Save scene**. These are test harness and Android accessibility discoveries, not application data migrations.

**Limit:** This establishes on-device-emulator practice/progress/storyboard persistence after a force-stop while offline, not backup export/import across devices or an in-place APK version upgrade. Native physical phones and Cloudflare live site remain unaccepted.
