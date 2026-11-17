# Frame One 2.0 — Seven Real Creative Labs: Integrated System QA

**Status:** Review candidate, stacked after Continuity #88. This branch is strictly acceptance coverage, not a new user-facing screen or a second implementation.

## Scope

The Option B-guided experience contains 33 canonical lessons, all linked to the seven **actual working React production studios**:

| Lab | Verified live original functionality |
| --- | --- |
| Make | Three-shot original storyboard, notes, local project library, create, rename, switch, delete with confirmation, save/export, Director Handoff, version-1 backup |
| Frame | True original bus-stop SVG crop, 1–3× slider, optional guides and meaningful opposing wide/tight comparison |
| Lighting | Original live SVG face and front/side/back modes, bounded brightness/softness sliders, three story presets |
| Cut | Three real storyboard clips, shot selection, left/right reorder with per-shot duration ownership, timed preview, stop/cleanup, story presets |
| Sound | Local synthesized Web Audio from explicit Play, silent no-music mode, ambience, stop and closure on unmount/selection, optional three story briefs |
| Colour | Original before/after SVGs, neutral mode with zero tint, original capped 42% overlay, 0–100% slider and three scene-based presets |
| Continuity | Original two CSS-drawn desks, cup shifts in Shot B only, real match/mismatch React state and honest camera-angle caveat |

## Automated acceptance

- New `tests/verify-v2-seven-labs-system.cjs` asserts real seven-lab typed IDs, original React routing, isolated Option B CSS for each, scene-first production art, 320px breakpoints, reduced motion, original data owner, original course/studio integration and per-lab screenshot coverage.
- Existing `scripts/browser-smoke.cjs` tests the entire 33-lesson course and every original working lab across desktop, 390px and 320px, including real interactions, state changes, visual layout and route switches. It also compares the approved prototype's 27 locked states.
- Android compile, real emulator, historical migration, same-signer upgrade and full DocumentsUI backup/export/restore must pass at this integrated commit.
- No test tolerance relaxation is permitted; all failing tests must be evaluated as possible product regressions before any test-only updates.
- No newly invented application data keys, remote assets, paid APIs, counterfeit gameplay, fake music or claims of full recorded video editing.

## Manual visual acceptance

Review the actual rendered screenshots of all seven labs at desktop/390px/320px before any release. The visual baseline is the approved Option B prototype rather than a freshly generated picture. Check clipped controls, missing image height, contrast, focus, crowded text, fake states and persistent project export semantics.

## Important non-completion items

**Passing this branch does not by itself make the app production-ready.** The redesigned guided experience is still a supervised Option B view; promoting it to the default installed-app navigation, production signing key setup, physical-device accessibility testing and Play Store publication still require explicit follow-on implementation and QA. Stacked branches/PRs must be integrated in the correct order with no lost migration commits.
