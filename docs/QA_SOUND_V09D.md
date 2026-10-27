# Frame One v0.9D — React Sound Lab QA

**Date:** 27 October 2026  
**Status:** Seventh Creative Lab implemented and committed; final full CI run and responsive screenshot acceptance tracked below.

## Implementation

- React-owned `SoundLab.tsx` reuses the original Frame One authored bus-stop vector and existing animated sound-wave/ripple/progress treatment.
- Three teaching modes preserved: **No music** (with optional generated ambience), **Gentle tones**, **Uneasy tones**. The ambience switch remains independent of melody; no music without ambience correctly reports that no generated sound is selected.
- Local `sound-audio.ts` schedules exactly the original five-second synthesized sound sketches using native Web Audio oscillators and an optional filtered noise buffer. It never fetches recorded audio, requires no backend or account, and never autoplays.
- A genuine user Play click opens AudioContext and starts/resumes the sound. Selecting another mode, toggling ambience, pressing Stop or leaving Sound stops scheduled sources, cancels the playback timer and closes the context. Component unmount also performs idempotent cleanup.
- React App retains the Sound mode and ambience choice when the learner switches labs; playback deliberately does **not** survive navigation.
- The legacy runtime now renders no sound-lab markup and skips the React sound input selector, eliminating duplicate UI and old event interference. All seven labs have independent React components.
- Original learner data keys and v0.7 storyboard backup/restore schema unchanged.

## Verification

- Eleventh source regression suite `tests/verify-react-sound.cjs` checks mode labels, original locally generated audio, explicit user gesture, context/source/timer cleanup, no remote audio, navigation and storage keys.
- Production Chromium QA counts AudioContexts constructed and closed, verifies no generated sound with both music and ambience off, mode changes stopping audio, explicit Stop, unmount cleanup, state on return, and 320/390px responsive layouts.
- The existing thirty-three lesson quiz completion sweep, six other migrated labs, backup and offline journeys must remain green.
- A passing browser run is **not** proof that a real user heard correct audio volume or timbre. Manual listening through laptop/headphones, Safari/iPhone and Android WebView, accessibility and reduced-motion audit remain required.

## Release status

v0.9D is architecturally **7/7 labs implemented**. Mark **7/7 automatically accepted** only after the latest complete GitHub Actions run and screenshot review, not on earlier source commits. This does **not** mean web/Android/iOS public release is ready.

**After v0.9D:** validate PWA update/restore compatibility, deploy HTTPS web preview, produce Android debug APK and test devices; iOS requires a macOS/Xcode build. Independently review filmmaking accuracy, Telugu explanations, screen reader interaction and Web Audio on real devices.
