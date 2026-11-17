# Frame One 2.0 — Real Creative Labs integration: Phase 1

**Draft review candidate.** This stacked branch begins after all 33 canonical guided lessons are implemented and verified. This phase connects the **real** seven existing production Creative Labs to the approved Option B learning journey. It is **not** yet the full visual redesign of every production editor.

## What changed

The real course's **Lab** tab now opens an Option B-styled studio directory with seven functional links, including a prominent Make Lab card and six concise illustrated cards:

| Studio card | Existing typed lab ID | Existing production capability (not reimplemented) |
| --- | --- | --- |
| Make a scene | `story` | Shot and storyboard plans, multiple saved scene projects and exports |
| Frame | `frame` | Crop, shot size and framing guide tools |
| Lighting | `light` | Direction, power and shadow softness controls |
| Cut | `cut` | Timed storyboard sequence and reorder controls |
| Sound | `sound` | Real Sound Lab, not the simple Option B demo sound sketch |
| Colour | `colour` | Live colour concept controls |
| Continuity | `continuity` | Real continuity matching experiment |

Cards use new **original vector artwork**, no remote assets, and the established mint/ink/round paper design vocabulary. Each press calls the existing typed `LegacyBridge.openLab(id)`, causing the real React `App` to render the exact pre-existing editor; it does **not** launch a fake copy. Users can return to the exact real chapter they came from using the visible return strip above the working lab. Chapter 6's final completion state links to this directory.

## Important limitations and next visual phase

This is the **safe integration** step: the entry directory is visually Option B, but **the seven underlying production lab screens still retain their current React visual language**. A later phase must restyle each of the seven editor screens within an explicit locked design spec, compare screenshots, and retain every working control and original project editor. Never claim this phase alone gives pixel-perfect Option B style to the full app.

## Data integrity

- `App.tsx` remains the owner of actual lab component state, and the legacy bridge remains the owner of persistent practice/storyboard data.
- The return chapter is temporary React component state, **not** a new user-data storage key or backup format.
- Original 33 completions, note arrays, lab progress, multi-scene project library, backup version 1 and seven lab IDs remain unchanged.
- Prototype lab sketch stays untouched; no new demo points are granted by opening production tools.
- No additional paid service, API, downloaded assets, external songs or video clips.

## QA gates

1. Source test: `tests/verify-v2-real-labs-bridge.cjs` confirms all original typed lab IDs, real route, no duplicate data writes, old course back navigation, scoped art and accessible return control.
2. Browser tests: `scripts/v2-real-labs-qa.cjs` launches all seven actual React labs from Chapter 3 on desktop; launches Make, Cut and Continuity on 390px and 320px. The test verifies original active lab tabs, real Make project bridge, the return strip and return to Chapter 3. Full original JSON backup and demo state must be unchanged by pure navigation.
3. Original Option B pixel-parity tests remain untouched. **Do not increase tolerance** to silence a regression; inspect new screens at desktop, 390px and 320px for text, icon contrast and overflow.
4. Existing Android build, emulator, historical migration, same-signer upgrade and DocumentsUI full-backup/restore all remain release blockers until green.
5. Correct production signing, physical device testing, UX/accessibility audit and store publication remain required separately.

## Future phases

1. Create a canonical **lab design spec** for the seven screens from their *actual* controls and state, not decorative mockups.
2. Incrementally redesign each production Lab screen to Option B visual fidelity while preserving all functions, export, note and import flows.
3. Deep-link practical Chapter 6 tasks directly to the appropriate working Make/Frame/Cut/Sound workshop. Those flows need isolated preservation tests.
4. Finally move the complete redesigned course from a supervised overlay into the installed app's default navigation only after parity and migration acceptance.
