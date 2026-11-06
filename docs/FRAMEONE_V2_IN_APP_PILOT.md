# Frame One 2.0 — Option B in-app integration pilot

## Product decision

The owner approved the working Option B illustrated and interactive experience on 6 November 2026, after testing the independently hosted HTML preview. **This phase integrates exactly the same source into the actual Frame One web/Capacitor build** as an opt-in experience reachable from Learn.

This phase is **not yet** the final React migration or a replacement for 33 lessons / seven Creative Labs. To avoid another illustration-to-code fidelity gap, it uses the exact approved HTML/CSS/vector illustrations in `public/option-b-v1.html` while the next phase ports reusable components into React. The first visual-review gate is exact rendered parity. No regenerated art, new network dependencies or paid assets.

## User-facing flow

1. Open **Learn** in the existing app.
2. Select **Explore the new journey** on the dedicated Option B card.
3. The existing React/legacy shell stays mounted but becomes inert and hidden from assistive tech. The true tested Option B experience opens above it with one clear **Back to Frame One** exit.
4. Inside the pilot, learners can visit Home, Journey, Lesson (Observe → Decide → Experiment → Make), three prototype Lab controls and Progress. Six demonstration missions and their scores are entirely separate from real Frame One.
5. Press **Back to Frame One**, Escape on desktop, or Android's physical/system Back to exit. On a nested input, Android Back first attempts to dismiss the keyboard.
6. Existing six chapters, 33 lessons, seven real Labs, all saved practice and Make Lab projects remain unchanged.

## Architecture and data

- **Canonical visual source**: `public/option-b-v1.html` copied unchanged from the approved `prototypes/option-b-v1/index.html`. All 2D SVG artwork and styling render exactly as reviewed.
- **React integration**: `OptionBExperience.tsx` layered as fixed overlay in the existing `App` shell. `App` is never unmounted or reinitialized. The Learn entry dispatches a narrowly scoped `frameone:option-b-open` event, and Android Back dispatches `frameone:option-b-close`.
- **Persistence**: the pilot writes **only** `frameone-option-b-prototype-v1` localStorage, which isn't included in the classic JSON backup or lesson-progress computations. The original backup and save keys are not changed.
- **No user data migration yet.** The pilot's six sample missions do not map to real 33-lesson completions. All rewards and Lab saves are labelled demo progress.
- **Offline**: the post-build service worker precaches the pilot HTML. On offline HTML navigation, cached exact request takes priority before legacy index fallback. Capacitor's bundled assets include the file.
- **Trust**: app-owned HTML served from the same app origin; it has no external scripts, downloads, forms, account sign-in, payments, sensors, permissions or remote images.

## QA acceptance gates

- Source contracts confirm precise approved document, five functioning screens, no old storage-key references, React overlay and Back listeners, offline inclusion.
- Real compiled browser at desktop and mobile 320/390px opens pilot, chooses a real storytelling decision, changes crop, completes a demo mission, switches Labs, verifies demo progress, exits and verifies original app's 33 lessons and old completion count remain unchanged.
- Screenshot: desktop and 320/390px actual integrated browser capture must reproduce the reviewed Option B artwork; inspect screenshots, not just status.
- Full offline build, Android debug APK, native emulator, backup/restore, cross-version retention and same-signer QA must pass before accepting the integration as Android-stable.
- Do not publish public APK without long-lived key, tested independent build update, device backup/restore and owner approval.

## Next production milestone (not hidden inside this PR)

Implement reusable **native React** Option B components: SceneStage and art assets, AppShell, ChapterPath, MissionStep, DirectorFeedback, LabControls, SkillProgress. Map Chapter 1 to the real existing curriculum with original independently verified learning content, preserve lesson IDs and backup semantics, and compare final 320/390/430px screenshots against this fixed visual reference. Remove the in-app HTML pilot once the React implementation reaches parity, not earlier.
