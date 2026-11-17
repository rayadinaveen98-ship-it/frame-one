# Frame One 2.0 — Chapter 6: Make your first film

**Development status:** Stacked draft PR, not merged, not a production-signed APK. This work completes the *real guided lesson implementation* for all 33 canonical lessons, but **does not complete the migration of all seven Creative Labs** into Option B.

## Five original lessons

Chapter 6 uses the exact `making`, `shotlist`, `shootscene`, `editminute` and `review` IDs in `src/data/curriculum.v08b.json`. Original course teaching text, factual quiz, correct answer, practical tasks and feedback remain single-source.

| Original lesson | Four-stage lesson extension | New original Explore art |
| --- | --- | --- |
| From idea to first film (`making`) | Choose a small finishable narrative | Three-beat first-film scope planner, original illustrated character and letter |
| Plan shots before you shoot (`shotlist`) | Compare possible recordable setups | Three illustrated shot cards showing place, discovery, response |
| Shoot a small scene with a phone (`shootscene`) | Prioritise permission, audio and usable action | Three-stage safety/capture/review checklist over original storyboard art |
| Edit a short story from your shots (`editminute`) | Compare information order and timing | Three different storyboard shot sequences and illustrative timing bars |
| Watch, learn and improve (`review`) | Turn a vague opinion into actionable revision | Fictional viewer-feedback cards, diagnosis, one-change revision diagram |

These are **conceptual offline teaching tools**; none pretends to record people, capture audio, import video, export a shot list or deliver a finished film. They do not use copyrighted footage or songs.

## User journey

The existing Chapter 5 path now has a final Chapter 6 entry. All five new missions use **Observe → Decide → Explore → Make**, including the *original syllabus's graded factual knowledge check*; a correct answer is required to mark completion. Every node can be entered and revisited. A final note appears after all five Chapter 6 lessons are done, expressly distinguishing course completion from actual filming. The next useful real-world action is a small film shot on the user's device, aided by Frame One's existing Make Lab.

## Long-term compatibility

- The **33 original lesson IDs**, six chapters, seven real Creative Labs, notes, storyboards and projects remain available.
- No new real progress storage key; completion uses legacy `frameone-progress-v01` through `completeGuidedFoundation` and the existing v1 backup schema.
- Optional practice notes still use `savePractice`, retaining the pre-existing 240-character cap and backup/restore model.
- The six-mission Option B *demo* stays isolated and accrues no points from real course missions.
- New CSS remains scoped to `.first-film-*` and leaves pixel-locked pilot screens and approved artwork unchanged.

## Acceptance gates

1. `tests/verify-v2-first-film-chapter.cjs` checks the full 33-lesson ID set, original quiz, source-of-truth, extra art, completion and storage invariants. Earlier chapter source tests must pass unchanged in scope.
2. `scripts/v2-real-first-film-qa.cjs` walks **all five Chapter 6 lessons on desktop**, plus three representative lessons each on 390px and 320px. It checks three visual states, source quiz, wrong-answer lock, note persistence, full backup, unchanged prior progress and storyboard, separate demo state and backward navigation.
3. Original 27 pixel-parity reference states retain the existing strict significant-pixel threshold. Inspect new phone screenshots manually for composition, legibility, tap reach, missing art and truncation.
4. Android debug build, actual emulator, historical migration, same-signer upgrade and Android DocumentsUI full backup/restore must pass. A test failure for an unreachable control remains a blocker until positively resolved; don't infer success solely from web tests.
5. Permanent signing identity/key custody, real-device physical QA, accessibility, store editorial/licensing and Play Store enrollment remain separate release gates.

## Next work after this PR

- Bring all **seven existing production Creative Labs** into the Option B visual journey without replacing, dropping or duplicating their real capabilities.
- Connect practical tasks from Chapter 6 to the actual existing Make/Cut/Frame/Sound labs with tested navigation and unchanged project backup.
- Finish permanent release signing, document real-device acceptance, and package a validated install artifact before claiming the app is Play Store-ready.
