# Frame One 2.0 — Seven Production Labs: **Visual Quality Lock**

**Status: design implementation contract, not a claim that seven editor screens have already been redesigned.**

The Phase 1 portal routes into the actual existing React editors. This contract governs Phase 2 so the result matches the approved **Option B** interactive prototype in production, not just in concept images.

## Non-negotiable visual source

- Primary reference: the approved original `public/option-b-v1.html` and its pixel comparison against the React port.
- Retain original vector illustrations and artwork style; no mismatched stock photos, AI placeholder imagery or generic dashboard widgets.
- Reuse Option B tokens: canvas `#f7fbf9`, ink `#1c3442`, teal `#1e8b82`, mint `#55b97b`, sun `#ffd36f`, line `#dbe9e7`, rounded hero panels and accessible dark text.
- Typography hierarchy: short precise eyebrow, strong cinematic title, one useful line of context, then **actual** interactive stage. Secondary explanations only on demand.
- Preview first, controls second. Make the central illustration large enough to read on a 320px phone.
- No static decorative toggles. A visible action must have a real, immediately testable effect on live React state or persisted project data.
- Design at desktop, 390px and **320px**, with touch targets generally at least 44px, focus indicators, contrast and reduced-motion support. Large content must fit without horizontal scrolling.
- Changes must not modify the original pilot reference or weaken the existing 27-state parity tests.

## Live editor inventory — what a visual redesign **must preserve**

| Original React component | Existing functional contract | Art and interaction direction |
| --- | --- | --- |
| `FrameLab.tsx` | Shot-size modes, zoom slider, thirds guides, side-by-side comparison, framing brief | A cinematic scene as the hero; reveal crop and guides as simple tactile controls. Comparison remains clearly two different states, stacked on phone. |
| `LightingLab.tsx` | Front/side/back direction, power and softness sliders, scene-brief preset; real SVG light treatment | Original scene as live lighting canvas; source-direction selector beneath it; brightness/softness in compact expandable controls. Avoid pretending colour filters simulate actual physical lighting. |
| `CutLab.tsx` | Three individually selectable shots; reorder; duration follows shot; playback/stop; timer cleanup; preset brief; reset | Storyboard-first edit desk, three prominent mini-frames with reorder controls, a timeline and truthful **timed illustrated** preview. Do not claim it edits or exports recorded video. |
| `SoundLab.tsx` | Scene/stage controls, real audio playback controls, atmosphere mode, quiet/mix options, proper playback cleanup | Soundscape scene with **actual** play/stop, distinct ambience states and readable volume/mix status; audio should remain usable and accessible. Never replace playback with merely decorative waveform bars. |
| `ColourLab.tsx` | Neutral/warm/cool look modes, strength slider, scene briefs | One true live scene illustration, clearly different but believable looks, strength control, optional brief. Keep colour descriptions context-dependent. |
| `ContinuityLab.tsx` | Compare prop-placement modes and related lesson link | Two large original matching frames, a clear prop position overlay and a short question. Do not teach a mismatched pair as a successful match. |
| `MakeLab.tsx` | **Multiple storyboard projects** with create, switch, rename, delete/confirm; three-shot editor, question and framing choices, save; export shot list; Director Handoff preview/keep/export/replace/new project | Highest-priority editor. Scene board visually dominant, then three shot cards; project library is a compact revealable drawer, **not** removed. Every destructive action retains an explicit confirm step. Exports and Director Handoff stay fully operational. |

These are original **production** features, not Option B demo counters.

## Six reusable UI components

1. **CinematicLabHeader** — title, tiny craft tag, one sentence only and a real return-to-journey control; no duplicate navigation bars.
2. **SceneStage** — the *same true source artwork* as used by the working editor, with visual changes wired to real state.
3. **CraftModes** — compact segmented 2–4 option selector; each choice changes the real editor or information.
4. **ControlDrawer** — reveal extra sliders, project/scene settings, details or studio briefs only when needed, preserving keyboard and screen reader support.
5. **DirectorFeedback** — 1–3 relevant lines, derived from selected settings, describing likely tradeoffs without asserting one emotional result.
6. **CommitFooter** — real save, export, playback or next-action control; show success **only after** original owner confirms it.

All must use original React lab state and the old data/backup adapter; avoid building a second state model that drifts from the editor.

## Implementation order and acceptance for each lab

1. **Make** — project persistence/exports are the greatest risk. Lock Create → Edit → Save → Switch → Restore and Director Handoff first.
2. **Frame** — live art, crop, zoom and paired comparison.
3. **Lighting** — source/direction plus power/softness controls and original SVG.
4. **Cut** — duration ownership and cancellable preview timer.
5. **Sound** — live audio and cleanup across navigation, not fake sound bars.
6. **Colour** — original filters, strength and context-dependent intentions.
7. **Continuity** — true prop continuity study and accessible compare.

For every editor: capture before/after at desktop/390/320; use source test assertions for all controls and dynamic browser tests for real input, exported/canonical data, lab switching, and **return to the same lesson/chapter**. No feature can be removed to make a screenshot more attractive.

## Strict release gate

A lab is **not complete** merely because it looks like a mockup. Its actual actions, original user data and import/export obligations must work in the same redesigned production UI. A green browser screenshot without real save/restore QA is insufficient. Existing 33 lessons, seven labs, backups, accessibility and release signing all stay required.
