# Frame One v0.15A5 — Story-first Sound Lab

## Experience
The existing three synthesized sound settings become a practical storytelling exercise, without additional music tracks or a large Home card. Learners may open **Tell the same moment with sound** and choose among an everyday wait, an anticipated reunion and the last bus. A selectable starting setup modifies the existing sound and ambience controls. Learners must still press the original Play button to hear anything. They may discuss trade-offs after listening or even when audio is unavailable.

## Behavioral invariants
- AudioContext creation stays inside original Play handler, never on scenario selection, panel opening, or preset application.
- Applying a preset explicitly stops current synthesis before changing mode/ambience; all active oscillators, buffers, contexts and timers still close on stop, change or unmount.
- Feedback is neutral and derived from actual sound mode and ambience, not a fake result or listening-quality measurement.
- Component state is ephemeral: zero new persistent storage, permissions, downloads, APIs, saved progress changes, project changes or backup format changes.
- Original 33 lesson IDs, seven Creative Labs and prior navigation remain intact.

## Verification
Run source protections, browser playback/context lifecycle, 320px/390px mobile overflow, original lessons/backup/restore flows, production build and Android emulator/upgrade checks before merge. Test explicit default no-music behavior, preset on stopped playback, and stopping active synthesized audio without autoplay. Public APK remains older preview; temporary test signer is not permanent upgrade signing.
