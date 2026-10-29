# Frame One v0.13A2 — Direct the Moment

## Goal

Make The Director's Eye more than five isolated A/B lessons. A learner now
directs **one original six-second scene** by combining four independently
chosen filmmaking decisions: **framing, light, sound direction, and editing**.

## Learner experience

On Home, an intentionally **collapsed** card invites the learner to "Direct
this scene". Nothing large is forced into the original cinematic home hero
or the six learning shelves until the learner asks to open the workshop.

The original fictional premise: a person waits in a dark room beside a phone
whose message is unreadable. A series of four A/B decisions affect one
coherent short-scene treatment:

1. **Framing:** wide shot versus a visible closer facial reaction shot.
2. **Lighting:** warm practical lamp versus cold window lighting; the
   illustration's background illumination and facial shadows really change.
3. **Sound:** room-only rain/fan cue versus a described musical pulse. This
   is explicitly a **written soundtrack cue** and NOT audio playback. The
   existing Sound Lab is linked for actual user-triggered sound experiments.
4. **Editing:** one held **0–6s** shot, or a first **0–4s** shot followed by
   a **4–6s** phone insert with "Typing..." visible. The preview and timeline
   update together. It is explicitly a static shot plan, NOT a played video.

The generator shows a first-shot description, optionally a second phone
insert, a sound cue, and separate explanations of how the four choices may
interact to guide viewer attention. It offers quiet/uneasy **starting
directions**, but learners may change any choice independently. All
2×2×2×2 = **16 combinations** generate distinct real treatments.

The learner can open the *existing* functional Make Lab or Sound Lab through
the working app navigation. The UI clearly states that these scratch
decisions are NOT automatically sent to Make Lab or saved as a storyboard.

## Safety and compatibility

The workshop is entirely local and offline. It does not write any new
localStorage keys, touch quizzes, lesson progress, storyboards, existing
Android backup data or permissions, and does not download external assets.
The original visual is constructed from CSS; there is no copied footage,
fabricated cinematic playback, automatic audio or outside image licensing.

Open/close has an accessible expanded state; each decision is a real button
with aria-pressed state. The preview includes a description for screen
readers. There are responsive arrangements at tablet and 600px/350px phone
widths, focus outlines and reduced-motion handling.

## Required acceptance

- All 16 treatments validated with pure deterministic tests.
- Run npm regression tests, TypeScript build and production offline bundle.
- Real Chromium desktop and 390px/320px checks verify the collapsed surface,
  actual frame zoom/lighting difference, written audio cue, edit insert,
  presets, actual Make Lab routing and no horizontal overflow.
- GitHub Android debug build and same-source/historical upgrade tests prove
  no regressions in native packaging and tested learner-data retention.
- Screenshots from CI can be reviewed separately; automated passes cannot
  establish final artistic visual quality by themselves.

## Not a new public APK

Until the private permanent QA signing identity, independent APK update
acceptance and physical-device test are complete, this is source
development only. The last public Android preview is v0.12A2 with a
temporary signing certificate; automatic publication remains deliberately
blocked for existing learner-data safety.
