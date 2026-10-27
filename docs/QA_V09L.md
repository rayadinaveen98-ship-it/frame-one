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
