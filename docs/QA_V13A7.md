# Frame One v0.13A7 — Film It Yourself (source milestone)

## Intent

Unblock meaningful learning improvements while permanent Android QA signing is
still an **unperformed external step**. This milestone adds an actual beginner
activity on Home, not another developer setting or release-gate page.

## The experience

The new **Film it yourself** card lives after the existing six cinema shelves,
collapsed by default so the Home screen remains cinematic and uncluttered.
Opening it reveals four fully offline beginner exercises:

1. **One action. Three shots.** Wide setting → closer detail → visible result.
   Practice story clarity and sequencing; connect to Make Lab and the shot lesson.
2. **One subject. Two moods.** Keep subject and frame consistent, vary window
   lighting direction. Compare what changed without claiming guaranteed emotions.
3. **Tell it without dialogue.** Film a tiny question through simple objects
   and actions; compare natural room sound against muted playback.
4. **One action. Two rhythms.** Keep a continuous original take; compare it
   against a separately trimmed copy to hear/see what duration changes.

Each has three concrete beginner instructions, the filmmaking reason behind
each step, a reflection question, and buttons to open an **already working**
React Creative Lab and curriculum lesson. The optional "I tried it" controls
show in-session progress without fabricating a graded result, a watched video,
or permanent progress. Changing exercises resets checkmarks.

No camera permission, video recording, network call, external footage,
subscription, new persistence keys, background monitoring or altered
`frameone-progress-v01` / `frameone-scene-v07` is introduced. Checkmarks
are expressly not saved. Home, lessons, seven labs, personal frames, private
backup/restore and director-to-Make handoff remain as they were.

## Acceptance

- Four missions have distinct purposes, three actionable steps and validated
  real lesson and creative-lab links.
- Practice component is collapsed on first visit and uses keyboard/screen
  reader friendly accessible buttons, live feedback and `aria-pressed`.
- Real browser test opens/changes an exercise, checks reset, finishes three
  steps and verifies a working Lighting Lab route.
- Browser screenshots and no-overflow checks cover desktop plus 390px and
  320px phone layouts.
- Existing 33 lessons, seven labs, backup/restore, progress, gallery and
  offline QA continue to pass in GitHub Actions.

## Limitations and release truth

These are short **filming instructions**, not a functioning in-app camera,
AI editor, film footage player or an assessment of the user's recordings.
No professional filmmaking review or formal Telugu translation signoff was
performed in this milestone.

A PR's green web and browser tests establish **source QA only**. The existing
public v0.12A2 APK remains the earlier temporary-signed package, and a new
public Android APK must NOT be published without the separate persistent
signing, real-phone and backup/update safety gates.
