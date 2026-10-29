# Frame One v0.14 — multiple Make Lab film projects

## What the learner gets

Make Lab now offers a **film-project library** with up to **20 individual, local
three-beat storyboards**, each with its own title and editable scene. Learners
can create a named storyboard, switch between projects, rename a project,
or delete a project only after a clear second-step confirmation. The last
remaining project cannot be deleted. Active project and selected content
are reflected in the original Make Lab editor.

The Director's Desk now offers **Save as new project** on the safe review
screen. Existing **Keep**, **Export existing shot list** and explicit
**Replace active storyboard** actions are retained. No navigation alone
overwrites or saves anything.

## Compatibility / migration

The original `frameone-scene-v07` remains the exact three-beat active
storyboard mirror used by old app code, the original shot-list exporter,
and learning-backup JSON field `scene`.

New bounded project collection: `frameone-story-projects-v1`, shape:
`{version:1, activeId:string, projects:[{id,name,scene}]}`. Each stored
scene uses the original `question`, three `shots`, three <=240-character
`notes` fields. Maximum 20 projects and maximum 60 title characters.

- **Existing user with only a v0.7 scene**: a virtual single library entry
  is loaded, preserving its original scene. No automatic destructive
  overwrite occurs on mount. First project save or creation persists both
  scene and library.
- **Existing project collection**: active `frameone-scene-v07` mirror takes
  precedence over the active project entry, so an earlier APK that edited
  the original scene doesn't lose that edit when the newer app opens.
- **Project writes**: both storage keys are snapshotted, written in order,
  and rolled back on errors. A partially failed write never announces
  success. Browser localStorage has no real multi-key transaction guarantee
  under power loss, but try/catch rollback handles synchronous errors.
- **Unreadable/malformed project collection**: fails closed; source key
  isn't overwritten by a new blank collection. User sees an error and
  should keep existing app data.
- **Project deletion**: always requires an additional explicit confirmation.
  Deleting an active project selects a surviving one; deleting the last
  one is blocked.

## Backup and restore

The existing **Frame One learning backup format v1** is retained:
`format`, `version:1`, `completed`, `notes` and `scene` remain. The
optional `projects` field now contains the full project collection,
including active selection. The original Android verified file
share/restore flow remains unchanged and continues to accept format v1.

Restoration validates the entire project collection before writing any
key and writes progress, practice notes, active scene, and project
collection with snapshots and rollback on synchronous storage errors.
The active project scene in the restored collection is reconciled to the
backup's canonical `scene` for old code compatibility.

**Important limitations:** Old version-1 backups created *before* this
release contain only one active scene; restoring one replaces the current
project collection with that one historical scene. Export and verify a
current backup before restoring an old one. Opening a new backup in an
older APK may silently discard the optional `projects` field when that
older APK re-exports; do not downgrade without separate verified backups.

Projects remain local to each browser/device, not cloud-synced, and are
**three-shot storyboards**, not independently shot movies or full projects
with multimedia uploads. A verified external JSON backup is still needed
before uninstalling an APK or clearing app data. This does not imply
the public APK has been updated.

## Verification

- New contract test checks project library limits, schema, legacy mirror
  and four-key backup restore paths.
- Real browser: migrate old v1 data, create, edit, switch back, return to
  second project, rename, cancel deletion, confirm deletion, restore full
  multi-project v1 JSON, reject invalid collection with *zero changes*
  and restore old v1 single-scene JSON.
- Real 390px/320px Make Lab: multiple project controls fit on screen.
- Existing React Make Lab, director-review, offline, lesson progress,
  all seven labs and native Android upgrade/backup checks must pass.

## APK release boundary

This is a source milestone until existing Android permanent QA signing,
independent actual signer upgrade acceptance and physical device
verification are complete. Latest public APK is temporarily signed v0.12A2
and is not replaced automatically.
