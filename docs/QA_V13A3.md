# Frame One v0.13A3 — safe Director's Desk → Make Lab storyboard handoff

## User experience

The existing `Direct the Moment` experiment creates 16 combinations of
framing, light, imagined sound and edit decisions for one original six-second
night-room scene. This milestone makes those decisions genuinely useful in
the app's **existing editable, local, backed-up Make Lab**.

**No existing storyboard is modified by navigation.** Clicking "Review in
Make Lab" stages a validated copy of the four choices in *module memory*,
then opens the actual Make Lab route. A preview appears above the original
three-shot editor, showing **all three mapped beat notes and framings**.
The learner may:

- **Keep my existing storyboard:** discard the offer; no data is written.
- **Export existing shot list:** preserve their current custom work using
  the existing text export (the original JSON learning backup remains
  available separately).
- **Replace existing storyboard — I understand:** only this explicit button
  writes the reviewed choices using the existing legacy v0.7 storyboard
  saver. If storage fails, the original loaded storyboard is restored.
  Edits and exports after saving use the same existing Make Lab interface.

If no custom board exists, the save button uses gentler wording. Existing
custom work is clearly warned about. A concurrent storyboard modification
or JSON backup restore invalidates the previous review: it must be
reconsidered before applying. Staged choices are cleared on navigation away,
explicit dismissal or backup restore. No background save or navigation
side effect is permitted.

## Honest six-second mapping into a three-beat board

Make Lab currently has exactly **three story beats**, not a variable number
of timed clips, and its stable JSON backup schema contains exactly
`question`, three `shots` and three <=240-character `notes` fields.

- The first beat retains 0–6s (hold) or 0–4s (reveal), chosen frame,
  warm/cold light and the written sound direction.
- The second beat is a **4–6s close-up phone insert** if the learner
  selected reveal, or an explicitly **optional action AFTER six seconds**
  for the held take. No fictional cuts within the hold are invented.
- The third beat is explicitly marked **FUTURE BEAT: not part of the
  original six seconds**, for the learner to write the next action.

The night-room lighting and sound live in written notes. Make Lab still
renders its original *generic bus-stop vector framing reference*, which
is not a faithful image of the imported night scene. The handoff screen
explains that visual limitation rather than pretending those illustrations
depict the imported location or produce playable sound.

## Storage and safety

The handoff does **not add any persistent storage keys** or change the
existing `frameone-scene-v07` JSON, backup version or API. It never
automatically merges or replaces a user's only saved storyboard.

One important limitation remains: **Make Lab has one saved storyboard
slot**, not separate independent filmmaking projects. The user must
explicitly agree to replace it; exporting an existing shot list is available
before replacement. Future multi-project storage would require an intentional
versioned migration and backup/restore compatibility plan.

The legacy saver has been hardened to roll back its in-memory scene when
localStorage writes fail. Backup restores clear a pending import rather than
later replacing freshly restored work.

## Required acceptance

- Deterministic unit checks of all 16 mapping combinations, scene duration,
  240-character note caps, and ephemeral isolation.
- Browser checks of the unchanged stored bytes on open and dismiss, export
  before replacement, explicit confirm, resulting editable text and the
  unchanged JSON backup's `scene` object.
- Desktop and 390px/320px mobile browser checks (including visible
  original scene preview, editable note and no phone-width overflow).
- Existing native Android APK, offline/Back, JSON backup/restore,
  same-signer upgrade and old-code→new-code upgrade tests all green.

## Release boundary

This is a source-code milestone, **not a safe new public APK**.
The last published download is still the temporarily debug-signed v0.12A2.
A permanent private QA signing key, genuine two-run signed APK update and
physical-Android-phone acceptance remain outstanding.

## Verified and merged — 29 October 2026

[PR #34](https://github.com/rayadinaveen98-ship-it/frame-one/pull/34) merged to main as [`4b5c438f`](https://github.com/rayadinaveen98-ship-it/frame-one/commit/4b5c438f2a227e715bb9a19d643d77cacf7da3e5). All seven **exact final PR-head** checks (`951dfd9dfa7709b352a94fdd33ee62a7ae9229ab`) passed:

- [Web tests, 16 mappings, TypeScript and production build — 40854067373](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40854067373) — PASS.
- [Real desktop/mobile browser QA — 40854067239](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40854067239) — PASS. Logs explicitly confirm unchanged stored storyboard bytes on entry/decline/export, explicit replace, editable imported notes, and the original JSON backup serialization, plus 390px and 320px lab navigation.
- [Native Android debug APK build — 40854067237](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40854067237) — PASS.
- [Android native Back and offline-note retention — 40854067164](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40854067164) — PASS.
- [Actual Android DocumentsUI JSON backup/restore — 40854067194](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40854067194) — PASS.
- [Same-signer Android upgrade/data retention — 40854067150](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40854067150) — PASS.
- [Historical-source Android upgrade/data retention — 40854067168](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40854067168) — PASS.

The independent merged-main checks are a separate set and were still running when this note was written. Automated interaction passes are not a human artistic screenshot review or physical-phone/Play Store update test.

The public APK remains **v0.12A2**, source `7c5156467200443137f877aeb82fe31c7e196c05`, 4,666,865 bytes, **TEMPORARY DEBUG KEY**. No newer APK was released. Persistent QA signing and the real separate-build update gate are outstanding.
