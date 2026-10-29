# Frame One v0.13A1 — Reaction shots and editorial rhythm

## Learner-facing change

Extend the existing original, offline "The Wait" scene in The Director's Eye
from **three to five interactive studies**. This is not a cloned movie,
external video, generated soundtrack or fake playable movie.

- **Why does a reaction matter?** Compare a wide shot that prioritizes a
  glowing phone with a genuine illustrated close shot of the person's face
  and eyes as they look away. Explain the difference between knowing an
  event occurred and seeing how a character responds.
- **How long should we stay?** Compare a **single 0–6 second hold** with a
  static, accurate three-shot **0–2s / 2–4s / 4–6s** plan (face, phone, face).
  Distinguish duration and cut frequency. The storyboard is labeled an
  **EDIT PLAN — NOT PLAYBACK**, so learners do not confuse it with a video.

Both modules have original alternate explanatory text, accessible live
descriptions, keyboard-operable A/B controls and working links to the
existing **Acting + Frame Lab** and **Rhythm + Cut Lab** lessons and labs.
The three previous sound, light and reveal/edit studies remain unchanged.
Selections are ephemeral React state and don't add user data or migrations.

## Regression acceptance

- 5 authored cases point to real existing lessons/labs.
- Real browser test visually verifies the closeup eyes appear in reaction
  mode and that the rhythm strip switches from one to three durations.
- Browser tests verify 390px and 320px screens fit without horizontal
  overflow and retain all seven existing interactive labs.
- Run web, browser, native Android build, real Android Back/offline, backup
  restore, historical source upgrade and same-cert in-place upgrade checks.
- Do not automatically release a new APK: public preview v0.12A2 still has
  a temporary signer and public publication is intentionally blocked.

## Release boundary

This is source code; it is **not yet** an installable update for existing
testers. The long-lived QA key, two persistent-signed APKs and physical-phone
upgrade test are still pending.

## Verified PR acceptance — 29 October 2026

[PR #32](https://github.com/rayadinaveen98-ship-it/frame-one/pull/32) merged into
`main` as [`0823460b`](https://github.com/rayadinaveen98-ship-it/frame-one/commit/0823460b40cfbc24ec1d8822171193fe52920e87).
All five **exact final PR-head** checks on
`ea4bfa6559ad8f95b9474551103557621de61663` passed:

- [Web regression, TypeScript and production build — 40838855952](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40838855952): SUCCESS.
- [Real browser desktop, 390px and 320px interaction QA — 40838855957](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40838855957): SUCCESS.
- [Native Android debug build — 40838855943](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40838855943): SUCCESS.
- [Same-signer Android package upgrade and saved-data retention — 40838856028](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40838856028): SUCCESS.
- [Historical-to-current Android source upgrade and saved-data retention — 40838855989](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40838855989): SUCCESS.

Browser QA confirms the appearance of the enlarged reaction close-up and
the **1-vs-3 real static timing strips**. These test results confirm source
quality and the covered emulator paths, **not production-signed/public APK
upgrade continuity or physical-phone compatibility**.

The independent merged-`main` verification for commit `0823460b` was
still running when the PR was merged and is tracked independently.
