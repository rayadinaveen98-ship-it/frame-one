# Frame One 2.0 — Option B: working visual baseline

**Status: candidate for creative approval. NOT merged into the Android app.**

This directory contains a complete working, responsive, offline HTML prototype of the proposed **playful filmmaking journey**. Open `index.html` in any modern browser. It intentionally uses no packages, CDN fonts, account or server; the visual source is the same code that renders the real interactive screens.

## Functional screens

| Screen | Real interactions |
|---|---|
| Home | Continue next unfinished mission, navigate to journey/lab |
| Journey | Select any of the first chapter's six story missions, revisit completed missions |
| Lesson | Observe → Decide → Experiment → Make; unique story questions, choices with nuanced feedback, live crop, self-reported filming exercise, mission completion |
| Creative Lab | Frame crop presets and live zoom, framing guides, light palette comparisons, sound environment discussion, save demo idea |
| Progress | Derived mission completion and demo points, saved ideas, navigation to missions, explicit demo reset |

Learners can freely navigate the path; it does not pretend creative decisions have universally correct answers. The camera crop is not a lens/camera move simulator; the illustration palette is not physically accurate relighting; the sound exercise is a conceptual explanation and **does not play audio**.

## Visual foundation

Warm cinematic storybook 2D art using consistent illustrated world and subject. These actual illustrations are embedded in the standalone HTML; they are not promises of later art assets. The design system candidate and acceptance/porting rules are recorded in [design spec](../../docs/FRAMEONE_V2_OPTION_B_DESIGN_CANDIDATE.md).

## Safe evaluation

- Standalone prototype data key: `frameone-option-b-prototype-v1`; **no access to the existing Frame One localStorage keys**, accounts or backup.
- No changes to current React app routes, six chapters, 33 lessons, seven Labs, Make Lab storyboards or Android package.
- Test viewport widths 320px, 390px and 430px in Chrome/Edge; no horizontal page overflow.
- Test Home → Journey → mission steps → completion → Progress → Creative Lab → save idea → Progress; verify all buttons and controls are keyboard-focusable.
- Demo progress should persist when the browser permits local-file storage; storage restrictions vary for downloaded HTML pages. Test persistence manually on physical target devices.
- Real Android WebView, native Back, TalkBack, contrast and update/backup QA are **not** validated by this standalone HTML.

## Production migration sequence

1. Approve or revise the **rendered** version of the five screens and design tokens. Do not approve based on image-generation concepts.
2. Extract reusable React components and maintain a pixel-equivalent 320/390/430px screenshot baseline.
3. Build the first six-mission chapter as real curriculum; source and fact-check every learning claim; author original lesson art/audio with licence records.
4. Preserve historical lesson IDs, saved progress, notes, Make Lab data and backup/restore contracts using non-destructive migration adapters.
5. Extend to all screens only once the first interactive chapter satisfies the learning, performance and visual quality gates.
6. Keep public APK publishing and persistent QA/release signing as separate release-blocking steps.

**Do not merge this prototype directly over the current app.** It is a reviewable design and interaction proof.
