# Frame One 2.0 — Production Make Lab Redesign (Phase 2A)

**Review candidate.** This branch is stacked onto the seven-production-lab bridge (#81). It redesigns the **actual working React Make Lab** and retains every original production control; it is not a redesigned copy of the approved Option B demonstration.

## What changed

- **Scene first:** the original live storyboard illustration now precedes the project-management library in both visual layout **and document order**.
- **Cinematic header:** an original clapperboard SVG, succinct scene-direction copy, a live active-project name and a direct, keyboard-accessible **Manage projects** action.
- **Original frame remains real:** the existing `StoryboardArt` is reused unmodified, and the actual story-question, wide/medium/close framing, shot steps, notes and saving still call the original bridge.
- **Better hierarchy:** story concept, active shot, three storyboard beats, framing controls, note entry and save/export are visually divided into white Option B panels with mint highlights rather than the old dark-heavy interface.
- **Project library moved beneath editing, not removed:** up to 20 local projects retain Create, Switch, Rename, Delete, cancel/confirm deletion, persistent notes, and local export guidance. The current project strip and button make the library easy to reach.
- **Director Handoff kept before editing:** pending imported Director choices and Keep / Export existing / Save separately / Explicitly replace actions remain in place and preserve change detection against current saved work.
- Existing cross-lab tabs remain available beneath Make, and the next-learning links remain.

## Design lock

- Only the live `MakeLab` gets `make-v2` and the new stylesheet `option-b-make-lab.css`.
- Colours and shapes follow the approved Option B system: canvas #f7fbf9, ink #1c3442, green #55b97b, bright white panels, rounded shapes, readable text.
- Original bus-stop art is not redrawn or replaced; its live wide/medium/close crop remains the actual tool and supports the existing story state.
- Layout checked at desktop, 390px and 320px. Small screens must not horizontally overflow; three-step cards must remain tappable, and save/export and project confirmation controls must remain legible.
- Prefer original art + real feedback. No decorative inert controls, generic template cards, copied footage, music or fake playback.

## Data and safety

- `window.frameOneLegacy` remains the authoritative save/export, multiple-project and backup owner. There is **no new localStorage key**, cloud dependency or billing API.
- The original 33 lesson progress records, notes, storyboards and `frameone-learning-backup` version 1 remain unchanged.
- The original Director Handoff race/change detection and explicit replacement safeguards remain.
- The Manage projects action scrolls/focuses its existing heading; it does **not** create, delete or mutate any project.

## QA gates

1. `tests/verify-v2-make-option-b.cjs` asserts scene-first order, real active-project display, all original production selectors and bridge operations, Director Handoff safety and responsive Option B styling.
2. The established 2,000+ line Playwright smoke walks the actual production editor, three-shots and notes, Save, Export, Create, Switch, Rename, Delete cancel/confirm, JSON backup and restore, and a Director Handoff. The additional tests verify the new scene-first DOM order, active project strip and accessible Manage projects action on desktop and phones.
3. Desktop, 390px, 320px screenshots must be manually reviewed and original reference pixel-parity tests left unchanged.
4. Android debug APK, native emulator, historical migration, same-signer upgrade and real DocumentsUI backup/restore are still mandatory for approval.
5. This is a single-editor design phase. The remaining six production editors retain their current visual language until separately implemented and tested.

## Next work

Close Make Lab's full QA and screenshots, then redesign Frame, Lighting, Cut, Sound, Colour and Continuity one by one without removing their live functions. Only after all seven editors meet fidelity and QA may we consider promoting the entire redesigned experience to the default app navigation.
