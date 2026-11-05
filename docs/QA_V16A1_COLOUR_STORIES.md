# Frame One v0.16A1 — Colour as a story decision

## Experience

The existing Colour Lab already compares original bus-stop artwork against a neutral/warm/cool illustration overlay, with a strength slider and a reminder that a tint overlay is not actual film grading.

This milestone adds a **closed-by-default**, optional `Direct the colour of a scene` exercise under that original lab. It makes three concrete story briefs available:

1. **The first bus** — suggest a morning time of day without defining a character's feelings.
2. **An unexpected meeting** — examine when a neutral palette serves an ambiguous performance.
3. **The unanswered wait** — examine whether cool dusk tones or motivated warm street light better serve a late bus scene.

Each brief poses a filmmaking question, supplies **one clearly labeled starting look**, controls the same existing Colour Lab mode and intensity, and offers an optional on-demand director's explanation for all three colour choices. The explanation responds to the actual current overlay and slider position rather than awarding a fake score or inventing an emotion. A short real-phone exercise encourages comparing naturally lit settings.

## Design/technical guarantees

- The new disclosure is collapsed by default, below the primary SVG comparison. No Home card, large new lesson text or additional onboarding step.
- Three scene choices are accessible buttons with `aria-pressed`, a labelled disclosure summary and an on-demand `role=status` discussion.
- The same two already bundled, original vector drawings update when the brief's starter controls are applied. Neutral and zero-strength have technically accurate descriptions.
- Selecting a different story or reapplying a preset dismisses outdated feedback.
- All new state stays within the current tab/session. Existing 33 lessons, seven Labs, local progress and practice notes, Make Lab projects and JSON backup are unaffected.
- No camera/storage permission, photo upload, network request, third-party image, account, sound autoplay, service or payment.
- The visual exercise is explicitly **not** a calibrated grading suite, white-balance simulation, filmed scene or guaranteed emotional effect.

## QA gates

- Register source contracts in `npm test` and check full TypeScript/Vite production build.
- Actual Playwright desktop: verify collapsed-by-default behavior; select all three story briefs, apply each starter to live illustration controls, discuss actual mode and strength, and verify previous feedback resets when story changes.
- Actual Playwright 320px/390px: open optional brief, choose the final scene, apply the cool starting look, discuss it, and verify no horizontal overflow. Save QA screenshots.
- Android debug build, native persistence/backup test and same-signer upgrade tests should pass before calling this Android-accepted.
- Signing remains an independent release blocker. No public APK can be replaced until persistent QA signing, separate-build Android update, physical-phone backup/restore and explicit owner release approval are verified.

## Scope boundary

This milestone is a **learner-experience improvement**, not a new downloadable public APK. The currently published v0.12A2 preview still uses temporary signing, so it must not be silently replaced by a debug build with another certificate.
