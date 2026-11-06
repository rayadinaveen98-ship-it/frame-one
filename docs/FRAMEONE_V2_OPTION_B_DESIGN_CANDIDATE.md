# Frame One 2.0 / Option B — IMPLEMENTED design-system candidate v1

**Decision:** Option B is the chosen exploration direction. This is a working candidate, not a permanently locked production visual system. Final approval must be made from **actual interactive browser screens**, not an AI-generated image.

## Product principle
A filmmaker learns by **seeing → choosing → experimenting → making**. Each lesson starts with a scene and a simple question. We use concise explanations only after the learner sees or attempts something. We value real skill-building over arbitrary points or daily-streak pressure.

## Art direction
**Cinematic storybook:** warm, polished 2D illustration with controlled pastel environments, crisp silhouettes, purposeful scene details, subtle shadows and natural outdoor colours. A coherent original illustrated world is reused across mission and Lab; avoid unrelated fantasy/photorealistic/AI-generated imagery dropped into individual screens.

Implemented assets are original authored SVG embedded into the actual interactive HTML. The illustration is static 2D. We must not promise 3D camera physics, a playable sound engine, recorded footage or generated video from a crop/overlay demonstration.

### Palette — design tokens, not suggestions
| Role | Hex |
|---|---|
| Primary ink | `#1c3442` |
| Secondary copy | `#536977` |
| Off-white canvas | `#f7fbf9` |
| Journey sky | `#d9f1fc` |
| Deep evergreen | `#1e8b82` |
| Primary interaction green | `#55b97b` |
| Warm peach accent | `#ffac84` |
| Next-mission yellow | `#ffd36f` |
| Optional purple | `#8877c6` |
| Surface separator | `#dbe9e7` |

Use colour semantically. **Green** = action, checked/success. **Yellow** = next learning milestone. **Teal** = core navigation identity. Avoid ad hoc colour tokens unless design review approves.

### Type, components and interactions
- Local system rounded sans (no required CDN font); bold clear headlines, compact legible body copy.
- Titles use intentionally tight tracking (around -0.055em) and clear 1.1–1.2 line height; body around 1.5–1.7.
- Cards: radius ~19–23px, restrained cool shadows. Controls: ~12–16px and tactile coloured 4–6px bottom ledges.
- One unmistakable primary CTA per screen. Fixed bottom navigation: Home / Journey / Create / Progress.
- Buttons use real semantic HTML controls, selected-state ARIA, visible keyboard focus, accessible feedback. Reduced-motion preferences respected.
- Avoid decorative graphs or achievements implying assessments we did not perform. Completion points are a pilot reward for self-reported practice only.

## The first five source-backed screens
1. **Home:** illustration-led intro, next actionable mission, truthfully calculated pilot progress, shortcuts to journey/creative exercises.
2. **Journey:** original illustrated route with six clickable mission stops; next, past and future distinguishable. No artificial prerequisites preventing exploration.
3. **Lesson:** four states—Observe, Decide, Experiment, Make. Each state explains the learner's particular current choice. Do not label artistic judgments as objectively correct. Make step asks for a real short filming attempt.
4. **Creative Lab:** three tabs. Frame changes crop and visual guides; Light compares tinted graphic palettes (not illumination physics); Sound offers conceptual sound-setting discussion (no fake play button). Each save adds an explicit prototype idea count.
5. **Progress:** mission count, points and lab ideas derived from real pilot state; ability to revisit any lesson; confirmed reset impacts prototype only.

## Long-term screen inventory (not yet implemented)
After design acceptance, redesign all production surfaces on the same system: Welcome/Onboarding; Home; Six-Chapter Journey; Lesson and exercises; Chapters and alternate library view; Seven Creative Labs (Frame, Sound, Cut, Lighting, Make, Colour, Continuity); Craft/Roles; Projects and storyboards; Gallery; Search/Glossary; Progress; Practice plans; Collections/Series; Settings; Backup/Restore; Android system dialogs/alerts; Empty/Error/Offline states. No screens should silently retain an unrelated old visual language when the 2.0 migration is declared complete.

## Quality gates before claiming a locked design
- Compare the real UI at **320/390/430px** to the accepted baseline screenshot, checking layout, type, colours and same illustration assets.
- Confirm no viewport horizontal scroll, no unreadable overlay text, no hidden buttons under the fixed bottom bar, no fake controls, and no irreversible reset without confirmation.
- Keyboard navigation, talkback/voiceover, contrast, and touch target checks. Use `prefers-reduced-motion`.
- Exercise complete Home → Lesson → Journey → Lab → Progress navigation and state transitions.
- Verify offline function and browser/device persistence; prove Android's Back, screen-size handling and save/restore separately when React porting begins.
- Preserve 33 lesson IDs, local notes, storyboards, back-ups, and seven production Labs. Use verified migration and native Android test flows.
- Source every factual lesson claim; keep source/version/license references. Build original exercises inspired by lawful research, not text or images copied from books.
- Never declare visual parity merely from a concept image. The approved rendered screens and committed source are the contract.

## Explicit out-of-scope / limits
This prototype is **not** the shipping app, production backend or an APK. It currently contains six first-chapter pilot missions; other 27 production lessons and most production screens have not been rebuilt. Sound is text-based; no audio generated. It does not solve private Android signing or Play Store approval. Prototype data never auto-migrates to production data.

**Next design gate:** owner review of the working five screens; record decisions as a versioned change to this spec, then build the first production-quality mission in React on a safe feature branch.
