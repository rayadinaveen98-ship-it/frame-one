# Frame One 2.0 — Phase 2E: Real Sound Lab in Option B

**Review status:** stacked after Cut Lab PR #85, draft only, not production-signed.

## What is redesigned

The *actual* React `SoundLab` gets the approved paper/mint/ink Option B treatment: a short light-green cinematic header, real status strip, prominent original bus-stop illustration, live generated waveform, working controls, optional story exercise, and the same real seven-lab routes beneath the practice.

The live choice/status strip **reads existing React state** for Sound Mode (No music / Warm / Tension), quiet ambience on/off, and actual playback state. It never claims to record, import, play a copyrighted song, use a licensed film score, or access the microphone. The label and progress correspond to original locally synthesized sound generated in response to an explicit Play button.

## Non-negotiable audio behavior (unchanged)

- Original `createSoundSession`, Web Audio oscillator and buffer generation, 5s timer and resume-from-user-gesture remain untouched.
- The mode and ambience selectors call `stop()` before changing the active scene; no audio continues behind the new state.
- The Web Audio session closes its oscillators/noise sources and `AudioContext` on Stop, automatic completion, source change, or component unmount.
- **No music + ambience off** opens no Web Audio session, and tells the learner there is no sound.
- Unsupported Web Audio shows honest feedback, not simulated/pretended music.
- The three existing optional `SoundBrief` scenarios apply real mode+ambience settings and show context-dependent feedback only on request. They never create sound without an explicit Play.
- Full 33-lesson progress, old lab routes, saved storyboards and backup v1 stay unchanged.

## Visual quality and tests

- Approved Option B palette `#f7fbf9`, `#1c3442` and `#55b97b`. Original SVG cinema frame and sound-wave elements, no stock or network asset.
- Desktop: actual image/wave beside one concise control panel. 390px and 320px: stacked interface with legible three sound choices and a large meaningful illustration.
- New scoped CSS `.react-sound-lab.sound-v2`; no modifications to six-mission approved prototype art or 27-state pixel QA.
- `tests/verify-v2-sound-option-b.cjs` statically requires unchanged Web Audio disposal behavior and new authentic UI selectors.
- Full browser QA checks actual audio creation, silent state, changing modes, completed / cancelled playback, closed AudioContexts, original scene, three briefs, mobile no-overflow and screenshots `34-real-option-b-sound-desktop.png`, `35-real-option-b-sound-390px.png`, `35-real-option-b-sound-320px.png`.
- Android emulator, history migration, same-signer continuity and full DocumentsUI backup/restore all mandatory. The debug APK alone is not evidence of production signing.

## Cross-lab navigation fix

The default Frame Lab now has a compact real Make/Cut/Sound shortcut row before its lengthy learning exercise, while the full seven-lab navigation remains below. This protects native-device Make Lab/backup flows without a distracting top-level seven-tab bar.

## Remaining work

Redesign the real Colour Lab and Continuity Lab, finish full course+labs flow acceptance, and only then plan production signing and physical device testing.
