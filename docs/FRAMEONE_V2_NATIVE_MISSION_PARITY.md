# Frame One 2.0 — Native React Mission / Visual-Parity Gate

## Status

**Owner-approved reference:** `public/option-b-v1.html`. User expressly requires every new real screen to **match or exceed the quality of the approved interactive Option B prototype**, not beautiful image-gen artwork followed by a degraded implementation.

This milestone ports the exact Chapter 1 **Observe → Decide → Experiment → Make** mission and completion screen to native React. Existing native React Home and Journey remain pixel-locked to the same reference; the approved full five-screen HTML reference stays available from the **Reference / React preview** switch. No new art was generated or swapped in.

## Exact interaction implementation

- Six familiar sample missions; all original context, choices and nuanced feedback, including the film-language caveats.
- Observe: approved illustration and visual storytelling explanation.
- Decide: three choices, live visual change, selected state and director's feedback; cannot continue without a choice.
- Experiment: live crop from 1.0× to 2.2×, reference framing guides, honest crop feedback and lens/optics disclaimer.
- Make: short practical wide/medium/close three-shot assignment and optional self-reported completion checklist.
- Complete: existing celebratory completion UI and **one-time** +20 demo points; revisiting a mission never inflates them.
- Back, Previous, Return to Journey and Try Another Version are real controls. Navigating to any of the six nodes opens native React, not a low-detail interim replacement.
- The original React/Lab interface and its backup remain untouched. Option B completion is stored **only** in the `frameone-option-b-prototype-v1` demo key. That JSON merge retains any previously saved prototype Lab/shot counts.
- After completion, only the approved reference iframe is reloaded to pick up the updated demo progress. Classic lesson progress, notes, Make Lab projects and JSON backup are not altered.

## Non-negotiable visual acceptance

The web verification suite runs the *actual built Vite app in a browser*. For desktop, 390px and 320px it screenshots the same approved phone view and native React phone view. A pixel comparator rejects dimension differences and any pair with greater than **8%** of pixels showing a colour-channel difference greater than 28/255 (the same threshold used to approve Home and Journey). Screenshot pairs are uploaded to GitHub Actions for human inspection.

Compare all stages: **Observe, Decide (unselected and selected), Experiment (original crop and tight crop), Make (unselected and checked), Mission Complete.** Test crop changes, three choices, note visibility, previous navigation, replay, one-time rewards, 33-lesson isolation and full Android flows.

The design should also be reviewed manually for illustration consistency, text clipping, responsive touch targets, accessibility, offline behavior and real Android installation. A green number is never sufficient for an obviously degraded design.

## Explicit exclusions

This is a design-pilot curriculum of six missions, not a migration of the production 33 lessons. The scene is the **same original two-dimensional vector illustration** and live crop is not a physical camera move. The microphone/camera is not accessed. Voice, real recorded film scenes and physical lighting simulation are not present; do not misrepresent them.

This PR must remain **unmerged** while source, browser/pixel, Android emulator, backup/restore, migration and same-signer QA results are incomplete or failing. New APKs are debug-signed and are **not** stable public or in-place releases until persistent signing is set up and a physical-phone acceptance is performed.

## Following milestone

Native Creative Lab and Progress, then the real Chapter 1 learning syllabus and lesson-content review, then full six-chapter parity. Reuse the exact approved illustrations, CSS and educational wording; replace the reference only after every screen reaches the same quality.
