# Frame One v0.15A3 — Director's Lighting Briefs

## Intent
Turn an existing live Lighting Lab into a story-first learning exercise without adding a large new Home tile or more textbook paragraphs.

## Interaction
- The optional **Direct a scene with light** disclosure stays closed by default.
- Three genuinely different scene briefs: reading a small expression, withholding intent, and separating a silhouette against darkness.
- Learners choose a brief, use the existing Front / Side / Back lighting and brightness/softness controls, then select **Discuss my lighting**.
- Live notes discuss trade-offs for the chosen direction, dim/bright illustration and side-shadow softness. There is deliberately no right/wrong score.
- **Explore one starting setup** applies a suggested configuration to the existing SVG, rather than inventing a second fake preview. Learners can still override it immediately.
- New prompts state clearly that the vector exercise is illustrative, not a calibrated lighting simulation or a promise of real-world exposure.

## Boundaries and safety
- No new permissions, dependencies, API requests, videos, audio or persistent storage.
- Existing 33 lessons, 7 labs, Make Lab projects, progress keys, gallery and backup schema are unchanged.
- Maintain current household-light safety guidance and original Lighting lesson link.
- Reduced motion requires no new transitions; keyboard navigation, button labels, 44px touch targets, and 320/390px responsiveness matter.

## Acceptance
- Source tests verify scenario coverage, panel disclosure, controlled presets, unscored feedback, retained legacy lamp controls and data safeguards.
- Browser QA should open the panel, select a prompt, confirm its feedback reflects actual React lighting controls, apply a preset, check the changed SVG and verify 320/390px overflow.
- Production build, all existing 33 lesson/7 Lab flows, Android native build and backup/upgrade regression should pass before merging.
- This is source development, not a new publicly update-safe APK. Permanent signing and real-device upgrade/backup checks remain release blockers.
