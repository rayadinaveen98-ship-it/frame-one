# Frame One v0.13 — Scene Anatomy / The Director's Eye

## A filmmaking question, not another content catalogue

Frame One now has six curated library shelves, 33 foundational lessons and
seven interactive creative labs. This introduces a compact home-based
micro-study that asks not simply **what happens in a scene**, but **why a
director's choice changes what we notice**.

An original fictional situation, "The Wait", shows a person waiting near an
unanswered phone at night. Three short investigations each present two
contrasting creative decisions:

1. **Sound — just the room / a rising pulse.** The picture remains exactly
   the same. Sound notes are *described in text, not played*. The contrast
   explains how ambience and scoring can affect anticipation without claiming
   every viewer will feel the same emotion. The active Sound Lab can synthesize
   real sound from the learner's gesture.
2. **Light — warm lamp / cold window.** An original CSS night interior and
   figure really changes its lighting on selection: pool, face illumination,
   contrast and background. The explanation separates where the eye goes from
   what that lighting may suggest.
3. **Editing — stay on the face / reveal the phone.** The first take withholds
   message detail while the second displays an actual closeup phone insert,
   shifting the question the audience is asking.

Each comparison offers a concise consequence and a thoughtful director's note,
then goes to an **existing working lesson** or an **existing functional Lab**.
Choices are temporary React state: **no new localStorage keys, progress changes,
remote requests, external clips, copyrighted film footage or downloads**.

## Experience details

- Responsive cinematic miniature with original vector-like CSS illustration,
  mobile-width typography and 44px-ish touch targets.
- Three numbered craft controls and two selectable takes, with clear pressed
  states, accessible descriptions and live textual explanation changes.
- Respect for reduced motion; no forced autoplay, sound effects or timers.
- Sits in the Home Cinema Library discovery area, before curated lesson rails,
  without replacing the existing hero, personal photos, journey resume rail,
  seven Labs, backup shortcut or course pages.
- Focus returns to real app routes through the existing legacy bridge.

## Verification

- Run npm test, npm run build and desktop + 390px/320px browser smoke checks.
- Browser must confirm A/B sound descriptions, actual cold/warm CSS relighting,
  the editing insert becoming visible, working navigation to Cut Lab and a
  non-overflowing narrow layout.
- Inspect screenshots produced by browser QA for visual quality where
  accessible. Do not claim an Android release has been published until the
  separate persistent-QA-signing and cross-run update gates are completed.

## Release boundary

This is **v0.13 application source only**, not yet a new downloadable Android
preview. The existing public APK remains v0.12A2, signed with a temporary key,
and the v0.12A5 public publication freeze must remain active.
