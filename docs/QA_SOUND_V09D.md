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

## Verified first full browser acceptance — 27 October 2026

- [GitHub Actions 40464897808](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40464897808) **SUCCESS**, commit `4b826e51738ada432dc8874b86cdb0ac8b68dba9`. The eleven source suites, production TypeScript/Vite build, 33/33 lessons, seven labs, backup/offline and audio opt-in/stop/change/unmount tests all passed.
- Screenshot artifact `12715852873` was downloaded and inspected: `19-react-sound-desktop.png`, `20-react-sound-320px.png`, `20-react-sound-390px.png`. Sound choices, waveform, ambience controls, illustration and mobile layout render without evident horizontal overflow.
- Visual review exposed inherited Frame Lab HUD labels overlapping the sound illustration. **Polish committed** to hide those labels only inside `.react-sound-lab`; desktop/mobile Chromium assertions now enforce it. The final polished commit requires a fresh green run and screenshot before visual acceptance can be considered closed.
- **All seven React lab implementations passed automated behavioral checks on the first green run.** Real-device audible output, Safari/mobile background behavior, keyboard/screen reader, expert filmmaking and Telugu review remain open.
