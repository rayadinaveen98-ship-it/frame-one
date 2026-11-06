# Frame One 2.0 — Chapter 1 curriculum bridge and source register

**Status:** Implementation candidate, not an automatic release. The six approved Option B *demo* missions remain unchanged and pixel-locked to the prototype. The new guided **real Chapter 1** is an opt-in educational path within React preview.

## Canonical course structure

The existing `src/data/curriculum.v08b.json` remains the only factual source of lesson titles, IDs, objectives, knowledge-check prompts, correct answer indices, practical tasks and beginner explanations.

Chapter 1 — **01 · Discover cinema** — has exactly **five** lessons:

| Real ID | Canonical lesson | Original new interaction |
|---|---|---|
| `why` | Why do we watch films? | Choose what to reveal first; explore picture, time and sound |
| `history` | How did cinema begin? | Compare individual viewing, projected screenings and still pictures; explore milestone sequence |
| `units` | Frame, shot, scene | Explore one continuous shot versus cuts; choose between frame, shot and scene |
| `genres` | What kinds of films exist? | Change the imagined storytelling tone; learn why genre isn't a colour filter |
| `india` | How did cinema grow in India? | Curate 1896, 1912 and 1913 milestones while discussing historical disputes |

The original 33 IDs and six chapter structure are **not renumbered**. The new page does **not** award dummy points for real lessons.

## Evidence and copyright register

Only historical facts and general filmmaking principles are researched from the following trustworthy sources. **No images, book diagrams, footage or publisher prose have been copied into the application.** New choices, scene prompts, feedback and text are author-written. An offline canonical lesson is included without an online source call; sources are for editors, accuracy and traceability.

| Scope | Sources | Key caution |
|---|---|---|
| Cinema emerged from multiple inventors and exhibition styles | British Film Institute, [early cinema origins](https://www.bfi.org.uk/sight-and-sound/features/origins-cinema-early-inventors-pioneers); UK [National Science and Media Museum](https://blog.scienceandmediamuseum.org.uk/the-lumiere-brothers-pioneers-of-cinema-and-colour-photography/) | 28 Dec 1895 Lumière Paris exhibition is a celebrated landmark, **not** the first paid public projection ever |
| Bombay screenings and contested early Indian films | Government of India, Publications Division, [Yojana August 1995](https://www.publicationsdivision.nic.in/journals/Journalarchives/Yojana/Yojana-English/1995/August/Yojana_1995_August_1611045932.pdf); Government of Maharashtra, [Film City cinema timeline](https://filmcitymumbai.org/Filmcity/filmcity_history) | Distinguish 1896 film screenings, Torne's `Shree Pundalik` (1912) and Phalke's `Raja Harishchandra` (1913). Do not claim one uncontested "first". |
| Frame vs shot vs scene; genre, documentary and audience response | Canonical Frame One curriculum first-party educational text; BFI film-education background | Filmmaking choices have context and trade-offs; graded checks should test factual understanding, not taste |

All historical years above have been checked against the linked sources. Dates and historical classification remain subject to editorial review before a public curriculum launch.

## Four-stage learning contract (per real lesson)

1. **Observe:** One original familiar scene with a short concept insight; longer curriculum exposition is available but collapsed by default.
2. **Decide:** Three contextual creative choices with nuanced trade-offs, not artificial right/wrong film decisions.
3. **Explore:** Three interactive concept selectors that reveal real principles, followed by the **canonical curriculum knowledge check**. Wrong or unanswered questions block progression; a correct answer unlocks practice.
4. **Make:** A real-world filming/observation prompt from the original curriculum. Optional notes save through the existing backup-aware legacy bridge. Completion is marked **only after factual mastery**.

## Data and migration guarantees

- Existing real progress key: `frameone-progress-v01`.
- Existing practice notes key: `frameone-practice-v07`.
- Existing storyboard key: `frameone-scene-v07`.
- Existing backup contract: `{format:'frameone-learning-backup',version:1,completed,notes,scene,projects}`.
- The typed `completeGuidedFoundation(id)` adapter only accepts the five original Chapter 1 IDs. It uses the legacy in-memory `finished` set and `persist()`, updates the existing header and does not redirect the old course.
- `saveGuidedPracticeNote` delegates to legacy `savePractice` so a note appears in **immediate** backup exports. Direct localStorage-only writes would leave the old runtime's backup copy stale.
- The existing six Option B demo missions and `frameone-option-b-prototype-v1` key remain independent. Demo reset must never erase real course progress.

## Visual acceptance gates

The original Option B five screens are left untouched. The **real** Chapter 1 is a distinct opt-in mode accessed from the bottom of the React Home screen. It reuses the exact approved SVG world and scene illustrations, layout classes and palette, with narrowly scoped extension classes. Any new real-mode screen is judged by actual browser screenshots at desktop, 390px and 320px—not AI posters.

The standard 8% significant-pixel-difference test remains mandatory for **all preapproved prototype screens**, which must continue to match the original HTML reference. New content screens also require screenshot review for visual continuity, clarity, mobile clipping, spacing and accessibility.

## Release blockers

This is a limited first-five-lesson curriculum integration. The remaining 28 real lessons and seven production Labs have not been ported to this interactive journey. It is not a substitute for proper Android signing, device testing, licensing review or a public release process.

**Do not merge** this PR until the web, pixel/browser, Android APK, native emulator, real-source migration, same-signer continuity and JSON backup/restore tests all pass.
