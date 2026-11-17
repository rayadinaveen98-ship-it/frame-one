# Frame One 2.0 — Chapter 4: Sound and editing

**Status:** code review candidate only. This branch stacks onto `feature/frameone-v2-chapter3-visual-language` and is not a direct production release.

## Canonical six-lesson scope

The 33-lesson curriculum in `src/data/curriculum.v08b.json` remains the sole educational source of lesson titles, substantive explanations, knowledge checks and practical tasks. Chapter 4 includes the original IDs and content:

| ID | Existing lesson | New original interaction |
| --- | --- | --- |
| `sound` | Sound changes everything | Select a conceptual sound layer (world, event, score) |
| `editing` | Why do filmmakers cut? | Reorder three original storyboard stills and compare information order |
| `ambience` | Dialogue and the world of sound | Layer speech, effects and environmental noise as written sound-plans |
| `music` | How music changes a scene | See original diagrams of diegetic radio, audience-only score and no score |
| `continuity` | Make separate shots feel connected | Compare matching cup position, unexplained jump and explained movement |
| `rhythm` | How editing creates rhythm | Compare original 1–1–1, 5–1–1 and 1–1–5 second three-shot timing diagrams |

All six modules use the established **Observe → Decide → Explore → Make** format. Creative decisions are not graded for subjective taste; the original factual multiple-choice knowledge check must be correct before completion. The original practical task and optional note remain available.

## Honesty and copyright

- The experiments are static original SVG/CSS and first-party storyboard art. They do not play, record, generate or imply recorded sound, music or film footage.
- Waveform-shaped icons are decorative conceptual sound-layer indicators, **not captured audio**.
- Diagrams explain information, shot order and timing relationships, not predicted emotions or a rendered timeline.
- No commercial songs or film clips are bundled or streamed.
- Users can record their own sounds or film real scenes using other tools outside Frame One.

## Permanent source and data safeguards

- Exactly 33 legacy lesson IDs, six chapters, seven real creative labs, notes and storyboard projects remain.
- Reuses `frameone-progress-v01` and backup owner `persist()` for completed lesson IDs.
- Optional learning notes use the existing legacy `savePractice`, not a new localStorage key.
- The `frameone-learning-backup` JSON schema remains v1 for export/import; all previously completed lessons survive Chapter 4.
- The six original Option B *demo* missions still use their separate storage. No demo points are awarded for real lessons.
- New CSS is scoped as `sound-*` to keep approved original screens pixel-locked.

## Acceptance criteria

1. Green web/TypeScript and source tests including `tests/verify-v2-sound-chapter.cjs`.
2. Desktop + 390px + 320px browser journeys. All six lessons tested on desktop, three representative lessons each phone size. Correct navigation, three reactive concepts, wrong-answer lockout, saved note, old progress and unchanged backup schema verified.
3. Existing actual-browser pixel comparison of all original Option B screens must remain below the original **8% significant-pixel-difference threshold**, never widened just to pass.
4. Android debug APK, emulator, old-app migration, same-signer upgrade and Android DocumentsUI backup/restore all must pass; transient emulator launcher failures are still blockers until independently diagnosed.
5. Manual screenshot review for mobile clipping, tap target size, wording, colour contrast, factual precision and creative art fidelity.

## Remaining work

Chapters 5–6 (nine original lessons) plus full production migration of seven real Creative Labs into Option B, permanent user-controlled Android signing, physical-device acceptance, editorial/licensing review and Play Store setup. This feature is not signed for production.
