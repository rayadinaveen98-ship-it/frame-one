# Frame One 2.0 — Chapter 3: Learn visual language

**Review candidate.** This branch is stacked on `feature/frameone-v2-chapter2-guided-story` and must not be merged into `main` until that chapter is accepted. It does not change existing prototype screens or their visual parity thresholds.

## What is implemented

Seven syllabus-backed guided missions using the unchanged IDs from `src/data/curriculum.v08b.json`:

| Legacy lesson ID | Concept | Original new interactive feature |
| --- | --- | --- |
| `shot` | Useful framing | Change wide, medium and tight **crop**, not camera perspective |
| `camera` | Camera placement | Original top-down camera block diagram: position, direction and height as **concepts** |
| `lighting` | Real light principles | Original source-position diagram, with size and intensity explanations; **no false relighting** |
| `composition` | Organising attention | Thirds-guide overlay and optional negative-space crop |
| `movement` | Pan vs tracking | Original movement-path diagram distinguishing rotation from physical travel |
| `lenses` | Field of view vs perspective | Explicitly labelled illustration crops, **not optical lens simulation** |
| `colour` | Visual emphasis | Three simplified treatments explicitly labelled illustrative, not a calibrated colour grade |

Each experience preserves the original 4 stages, canonical factual quiz, source-of-truth teaching content, try-it-yourself exercise and optional practice note. A correct knowledge check is required before a real course completion.

## Art and UX constraints

- Keeps the approved Option B illustration and responsive styles intact.
- Adds one namespaced `visual-experiment` art panel to real Chapter 3 only. Original diagrams are coded vector artwork, not borrowed imagery.
- The seven-node winding path inherits original journey styling and includes explicit navigation to/from Chapter 2.
- Controls explain limits of simulations. In particular, **camera position changes perspective**, while cropping and narrowing a field of view at the same position do not.
- All new screens require screenshots and manual review at desktop, 390px and 320px. Never weaken existing 8% prototype pixel-parity threshold for approval.

## Persistence contract

- All 33 original IDs and 6 chapters remain untouched.
- Real Chapter 3 completion adds only the seven canonical IDs to the existing `frameone-progress-v01` set through legacy `persist()`; no new tracking key.
- Notes use legacy `savePractice` and appear immediately in original `frameone-learning-backup` format v1.
- Neither the prototype demo progress nor original 7 Labs, storyboards and historical user state may change.

## Validation

- `tests/verify-v2-visual-chapter.cjs` guards IDs, chapters, responsive new artwork, canonical quiz, correctly scoped progress and no extra storage.
- `scripts/v2-real-visual-qa.cjs` clicks every real Chapter 3 lesson on desktop, and four representative lessons on each phone size. Checks creative choice, three concept states, accurate control type, wrong-answer lockout, actual completion, original backups, notes, and reverse navigation.
- All established web, browser pixel, Android APK, real emulator, backup/restore, same-signer, historical migration and offline checks remain required.

## Remaining

Remaining 15 canonical lessons (Chapters 4–6); production design integration for the 7 original Creative Labs; permanent signing custody; accessibility and real-device verification; full licensing/editorial QA; final Play Store deployment. This branch does **not** represent an installable Play Store release.
