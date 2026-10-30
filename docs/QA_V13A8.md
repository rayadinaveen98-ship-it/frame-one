# Frame One v0.13A8 — Offline Cinema Quick Find

## Purpose

Make Frame One's existing **33 lessons, seven Creative Labs and Film Roles**
more discoverable from the cinematic Home without forcing beginners to scroll
all six collections or visit the full syllabus first.

## Implemented

- A compact **Find a film craft** field directly under the Cinema Library
  introduction; no results are mounted until the learner starts typing.
- An actual precomputed in-app index over every existing published library
  entry. The results include genuine titles, lesson summaries and study time,
  and completed lesson indicators derived only from the existing progress key.
- Instant, case-insensitive term matching across titles, summaries and
  categories, with carefully curated filmmaking aliases such as **silence →
  ambience/sound**, **cinematography → camera** and **director → film crew**.
  Exact lesson titles rank ahead of generic mentions.
- At most eight visible results on Home, with a correct result count; the
  main Learn syllabus remains available for full browsing.
- Enter opens the first ranked lesson/lab, Escape clears the search,
  an explicit Clear button erases the query, and each result is a real
  keyboard-operable, accessible destination.
- No online search API, account, activity tracking, local/session storage,
  new data schema, new permissions or changed quiz/backup keys. Search resets
  upon leaving Home.

## Acceptance

The new source regression validates all 41 unique actual destinations,
full-index coverage, exact-title ranking, aliases, stable whitespace/case
behavior, bounded results, empty states, offline-only execution and valid
lesson/lab routes.

Browser QA covers keyboard Enter and Escape, Clear, not-found feedback,
real Lighting lesson navigation, real Lighting Creative Lab navigation,
search reset after returning Home, and live 320/390px search rendering with
horizontal-overflow assertions and screenshots. Existing lesson, practice,
gallery, backup, storyboard and navigation suites remain required.

## Honest release boundary

This is a **source feature**, not a public APK. The downloadable Android
preview remains v0.12A2 until permanent QA signing and real-device update
safety are verified. GitHub PR build artifacts may be temporary signed and
are NOT proof of upgrade compatibility. A source merge does not replace
or silently modify the public app.
