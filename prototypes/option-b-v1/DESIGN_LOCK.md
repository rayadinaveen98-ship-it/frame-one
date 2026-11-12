# Frame One — Option B / Working Design System Candidate v1

**Status: candidate, not yet approved for production.** Source of truth is the browser-rendered code in `index.html`, not an AI presentation mockup. Reviews and future QA compare actual 320px, 390px and 430px rendered screens.

## Product direction

A colourful, premium and storybook-like filmmaking journey inspired by the *learning clarity and progressive disclosure* of Duolingo, not a clone. Learners OBSERVE a scene, DECIDE how to tell it, EXPERIMENT with real controls, and MAKE a practical short assignment. Explain honest creative trade-offs rather than scoring taste as right/wrong.

## Design tokens (implemented in CSS)

- Ink `#1c3442`, secondary text `#536977`, canvas `#f7fbf9`, white `#ffffff`.
- Evergreen `#1e8b82`, action green `#55b97b`, leaf dark `#208958`.
- Sky `#d9f1fc`, peach `#ffac84`, active-node yellow `#ffd36f`, violet `#8877c6`.
- Rounded system typography, 800–950 headings, max about -0.055em heading tracking, body line-height ~1.5–1.7.
- Cards 19–23px radius; actions 12–16px radius; tactile 4–6px shadow ledges and restrained cool elevation.
- Green primary action/completion, yellow NEXT mission, white completed navigation; no uncontrolled new accent palette.
- Original stylized 2D vector environment (journey) and subject (lesson/Lab) reused consistently; no pretend 3D or camera/lighting physics.
- Fixed bottom navigation: Home, Journey, Create, Progress; one dominant primary action; no dense onboarding banners.
- Touch targets ~44px+ when practical, accessible buttons/labels, keyboard focus ring, `prefers-reduced-motion`.

## Interaction & architecture lock for React migration

- Required components: app shell, chapter-path, scene stage, mission-step, choice/feedback, Lab controls, skill progress.
- No new page may be implemented using unrelated AI concept art. Actual assets and components must be visible in the running app and version-controlled.
- Allow replays and free exploration; don't lock learners out of topics or imply an artistic decision has a guaranteed emotion.
- Shared scene art is an instructional illustration, not lens optics, relighting or recorded footage. The Sound tab is conceptual until original playable sound is implemented and verified.
- This pilot has **six activities only**. Production Frame One currently has 33 lessons and 7 Labs, and their content/data must not be silently replaced by these demos.
- Store progress in a versioned compatible schema; preserve Make Lab storyboards, completed lessons, notes, backup/restore, native Back and offline behavior.
- Implement one complete high-quality React learning chapter first, pass actual-browser screenshots + emulator/backup/upgrade QA, then port remaining lessons.
- Signing and release approval are separate gates. **This prototype must not be published as an Android app or replace the public APK.**

## Visual QA acceptance

1. Phone-size screenshot review 320/390/430 and accessible focus/motion test.
2. Viewport overflow and scrolling verified.
3. Primary actions perform meaningful changes, and no inert decoration masquerades as a control.
4. Visual elements are reusable rather than one-off art-style changes.
5. Later artwork must meet this approved rendered baseline and pass side-by-side inspection; seek owner approval before final lock.
