# Frame One 2.0 — Chapter 5: People behind a film

**Status:** review candidate. Stacked on Chapter 4 (#78), not merged into main or considered a Play Store release.

## Four real guided missions

The 33 original lesson IDs in `src/data/curriculum.v08b.json` remain canonical, with unchanged factual questions, correct answers, explanations and practical tasks.

| Original ID | Lesson | Creative workshop |
| --- | --- | --- |
| `crew` | Who actually makes a film? | Original three-area collaboration web: story/acting, camera/art and sound/editing |
| `craft24` | What are the Indian 24 crafts? | Example preparation, on-set and post-production work areas without inventing a definitive union classification |
| `teams` | How departments plan one scene | An original dinner-table illustration that changes emphasis across writing/performance, props/camera and sound/editing |
| `pipeline` | From first idea to finished film | Responsive five-stage development → preparation → photography → post → distribution flow, with grouped stage selection |

Each real lesson includes the existing four interactive stages: **Observe → Decide → Explore → Make**, retains its canonical factual knowledge check, and offers optional notes through the old learning engine. Director-style creative options have trade-offs; subjective taste is never mistaken for a graded answer.

## Educational honesty

“24 crafts” is a Telugu film industry term associated with workers and federation/association arrangements; it is not a worldwide law that every film has exactly 24 jobs. We show *example* film work areas rather than claim an authoritative roster of all association names.

The diagrams are original stylized illustrations rather than real captured footage or a map of an actual production's staffing. Department boundaries can overlap and a small shoot may combine jobs. Production phases can overlap and are not guaranteed to be linear.

## Preservation

- The six original chapters, 33 legacy lesson IDs, seven production labs and storyboards remain intact.
- Real guided completion of the 28 original IDs in Chapters 1–5 uses the same `frameone-progress-v01` collection, never a new key.
- Optional notes continue through the existing backup-aware `savePractice`; exported `frameone-learning-backup` schema remains v1.
- Approved Option B demo remains a separate six-mission state, and completing real lessons grants no fake demo points.
- Original pixel-parity benchmark screens and assets are not modified; new styles are scoped to `.people-*`.

## QA requirements

1. Static source checks assert original IDs/knowledge checks, no invented craft list, real route and note/progress owner.
2. Desktop browser navigates all four lessons; mobile 390px and 320px each navigate two representative lessons, including wrong-answer lockout, three interactive studio states, practical completion, notes, old progress and backup.
3. All original 27 pilot pixel-parity states retain their exact approval tolerance and require screenshot review. New screens require manual visual review for long headings, legibility, touch targets and contrast.
4. Android build, real emulator install/offline/back, same-signer upgrade, historical data migration, and full Android DocumentsUI backup/restore remain required.
5. Permanent signing, actual physical device acceptance and Play Store readiness cannot be inferred from a green debug build.

## Remaining

Five original Chapter 6 lessons, real integration of the seven existing Creative Labs into the new Option B experience, durable Android release signing, physical-device QA and editorial/licensing review. Do not prematurely merge this stacked draft PR or claim a signed production APK.
