# Frame One 2.0 — real Chapter 2: Tell a human story

**State:** review candidate, not a store-ready release. Continuation of the approved Option B learning flow. No replacement of the six demo missions, old course screens or existing seven labs.

## Canonical scope

The 33 original Frame One lessons remain sourced from `src/data/curriculum.v08b.json`. Chapter 2 contains exactly six original IDs, in syllabus order:

| ID | Existing lesson | Guided narrative decision |
| --- | --- | --- |
| `story` | How stories create emotion | Wants, obstacles, stakes |
| `script` | From idea to screenplay | Filmable action vs internal feeling |
| `acting` | How performance tells a story | Action, framing, beats |
| `character` | Characters, wants and obstacles | Want, obstacle, choice |
| `dialogue` | Dialogue: more than words | Spoken meaning and implied subtext |
| `showdonttell` | Show a feeling through action | Visual action vs spoken explanation |

**One illustrated scene, six distinct lessons.** The original Option B café/character visual is intentionally used as a continuing filmmaking exercise. It is not stock footage, a reconstruction, generated actor performance or an accurate lighting simulation. The camera/colour treatments are conceptual tools, and the decision notes explicitly describe trade-offs.

## Interaction and progress

Each real mission uses the same four steps as Chapter 1:
1. **Observe:** notice a short, authored story moment; original detailed curriculum can be expanded.
2. **Decide:** choose one of three possible dramatic/filmmaking emphases and get an explanatory director's note.
3. **Explore:** reveal three original concept guides, then complete the existing curriculum's **graded factual knowledge check**. Unanswered/wrong answers cannot advance.
4. **Make:** take the original offline practical challenge; optional written reflection goes through the existing legacy note/backup owner. Correct factual mastery is required before course completion.

No fake 20-point demo rewards are given for completing real lessons. Correct completion is written to `frameone-progress-v01`, practice to `frameone-practice-v07` through `savePractice` and exported under the original `frameone-learning-backup` v1 format. Storyboard projects and demo data remain untouched. Only the original eleven Chapter 1–2 IDs are admitted by the guided completion bridge.

## Visual acceptance

The preapproved Home/Journey/Mission/Lab/Progress demo screens must retain their pixel-parity contract unchanged. Real Chapter 1 adds a Chapter 2 CTA below its own winding map. Chapter 2 uses the same illustration, symbols, typography, responsive layout and mission system, with a six-node journey and a clear route back.

Desktop and narrow-device visual screenshots are mandatory; new screens must be examined for legibility, clipping, navigation, touch reach and contrast. A scripted smoke pass is not a substitute for a human visual review.

## Quality gates

- Original 33 lesson identifiers, 6 chapters, 7 labs and data/backup keys unchanged.
- Chapter 1 guided lessons and source-parity checks remain green.
- New `tests/verify-v2-story-chapter.cjs` verifies source IDs, authored mission content, canonical quizzes and non-destructive bridge.
- `scripts/v2-real-story-qa.cjs` exercises every Chapter 2 lesson on desktop and two representative lessons each at 390px/320px, checks the wrong-answer block, written practice persistence, old completions and original JSON backup.
- Existing web, browser, Android/debug APK, native emulator, historical migration, same-signer, backup/restore, offline and accessibility checks remain release gates.

## Still pending

22 remaining canonical lessons (Chapters 3–6), production integration of seven existing labs into Option B, permanent Android signing/key custody, physical-device accessibility/behaviour and store-facing content/licensing review. No signed production APK is claimed by this change.
