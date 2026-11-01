# Frame One v0.15A1 — Learn Cinema: six quiet chapters

## What changed

The Learn page now has a smaller intro, a compact course compass and six
plain-language chapter cards. The cards display the chapter title, lesson count,
actual completed count, a concrete learning goal and a thin progress line.
Only the next relevant chapter opens by default. Selecting another opens just
that chapter on desktop **and** mobile; chapters stay navigable by keyboard.

Every chapter includes one concrete practice outcome above its original lesson
rows. All original 33 lessons, 6 chapter mappings, quizzes, visual-first scenes,
Telugu helpers, 7 labs, original project library, notes, 47 glossary terms and
backup/export/import functions remain exactly the same.

Search and existing six topic filters are preserved inside a compact
**Find a lesson** disclosure. Restore and read-only backup inspection remain in
Learn beneath the course, clearly labelled as learning resources; never moved
to Home or removed.

## Design principles

- First viewport should explain the course and show a genuine next lesson.
- One open chapter at a time; never render 33 fully visible lesson cards.
- Minimal type hierarchy, muted warm highlights, no oversized gradient tiles.
- Lesson list still includes titles, duration, short subtitles, completion.
- Works without web requests or new local storage keys.
- Responsive breakpoints at 760px and 350px, keyboard focus restored when
  selecting via the six-chapter progress shortcuts.
- Reduced-motion preference respected for automatic chapter focus scrolling.

## Regression and release boundaries

- Existing 33-lesson / six-chapter and backup contract tests remain.
- New `verify-clear-chapters.cjs` verifies chapter goals, progressive disclosure,
  protected progress/backups, responsive CSS and no lost navigation affordance.
- Real browser QA now checks that exactly one chapter is open even on desktop,
  navigation closes the previously open chapter and search starts tucked away.
- Android lesson completion and native backup checks must remain green before
  merge. No new public APK is published by this phase.

This phase is about navigation and visual hierarchy. Additional craft lessons,
new Labs and premium launch animation are separate planned milestones.
