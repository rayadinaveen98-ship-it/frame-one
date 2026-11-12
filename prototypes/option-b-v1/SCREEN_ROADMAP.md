# Frame One — Every-screen redesign inventory

**Do not redesign everything in a single giant PR.** The working Option B pilot is our interaction-system experiment. It has no permission to replace the current 33 lessons / seven React Labs until actual rendered quality and data migration are approved.

| Surface | Planned product change | Gate |
|---|---|---|
| Welcome / first-run | Fast, beautiful scene-based welcome, set optional preference, no onboarding overload | Skip control, offline behavior and reduced motion |
| App shell / navigation | Locked wordmark, primary navigation, state restoration, back, tab transitions | Phone widths, Android Back, TalkBack |
| Home | One active goal; next mission and immediate resume; useful personalized cards | Empty, in-progress, complete |
| Chapter Journey | Original reusable art, accessible winding path and task state, no artificial lock-in | All chapters, repeat, scroll restoration |
| Chapter detail | Chapter purpose, five or six actionable missions, relevant craft | Mapped to actual stable lesson IDs |
| Lesson / mission | Observe → Decide → Experiment → Make → Reflect components | Factual feedback vs creative feedback; all input types |
| Lesson quiz | Clear knowledge check, non-punitive feedback and retry | Accurate completion/quiz scoring |
| Visual examples | Consistent live scene; actual scene responds to learner choice | No image-only illusion of interaction |
| Frame Lab | Crop/shot sizes, subject placement, comparison | Correct camera/crop limitations |
| Sound Lab | Actual original playable sound, ambience/mix controls, speaker-safe gain | Audio rendering, mute, accessibility |
| Cut Lab | Honest shot order and timing previews, timeline editing | Playback timers; no data loss |
| Lighting Lab | Original coherent lighting example with direction and intensity | Accurately explained light approximations |
| Make / Storyboard Lab | Proper shot plan, scene notes, multiple projects, readable visual workspace | Existing legacy projects and backup preserved |
| Colour Lab | Palette intent, strength, reference and comparison | Distinguish tint from professional grading |
| Continuity Lab | Discover and fix purposeful scene mismatches | Clear before/after and expert note |
| Film Series / Collections | Story-driven multi-lesson learning arcs | Keep access to all existing routes |
| Explore / Library / Search | Find a concept by question, craft, glossary or lesson | No dead-end categories |
| Crew / Crafts | Department roles with collaborative interactive scenes | Realistic responsibilities |
| Glossary | Visual definitions, pronunciation if available, linked lessons | Technical accuracy |
| Practice gallery | Save notes, simple shot plans, optional user media later | Explicit permissions and export |
| Learner progress | Actual chapter mastery, completion and real practice milestones | Never fabricate streak/skill scores |
| Projects | Make Lab projects and planned short films | Names, restore, edits, no overwrite |
| Settings & accessibility | Offline preferences, reminders only if implemented, reduced motion and font scale | Keyboard/TalkBack; locale needs |
| Backup / restore | First-class safe data export/import, independent confirmation | Real Android DocumentsUI; 2-project restore |
| Error / loading / offline states | Clear explanations, retry paths, no opaque spinners | Airplane mode, corrupted backup, unavailable storage |

## Phased sequence

**Pilot 01 (built):** Home, Chapter Path, one reusable Mission system, Frame/Light/Sound concept tabs and Progress. Six demo activities; original vector art; no production modifications.

**Pilot 02:** Upgrade actual art production pipeline; approve master scene, character and 3D/2.5D style; improve real playable sound and meaningful visual camera, continuity and editing activities. This is the **visual fidelity gate** before scaling.

**Implementation 01:** Port app shell, navigation and Chapter 1 into production React behind an explicit feature flag, preserving saved data and Android backup.

**Implementation 02:** Convert the seven Labs into the shared scene and feedback system without deleting their functionality, and author original evidence-backed lesson content.

**Implementation 03:** Convert the remaining chapters, discovery, crew, projects, glossary, progress, onboarding and settings; run consistent screenshot/mobile/accessibility QA.

**Release QA:** Same-signer update, data recovery, real-phone media/performance verification, production signing and permission review. No Play Store release on pilot readiness alone.

## Creative owner sign-off

For each screen: compare the actual implementation, the locked tokens, and one-screen narrative purpose; validate the user action; inspect in a real browser; reject inconsistent artwork, decorative controls, filler paragraphs, unnecessary text or a lab that cannot be manipulated. Never substitute a mockup screenshot for a functional QA result.
