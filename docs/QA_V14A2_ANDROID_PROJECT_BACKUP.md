# Frame One v0.14A2 — Native two-project backup and restore acceptance

## Why

v0.14A1 added up to 20 independent Make Lab three-shot film projects.
The existing full-system Android file-picker test still created and
restored just one storyboard. A single-scene backup test could pass even
if the optional multi-project `projects` collection was dropped.

## New end-to-end Android evidence

With a fresh disposable Android installation and no synthetic storage:
1. Complete the first lesson, write a real practice note, and use Make Lab
   to save a custom Decision/Close-up shot in **My first scene**.
2. Use actual Android WebView inputs to **create a second storyboard**.
3. Export the real app-produced v1 JSON via Capacitor Filesystem/Share.
4. Verify the exported bytes contain two unique project IDs, the first
   original authored shot, a separate default second scene, and a matching
   canonical active-scene mirror.
5. Preserve the verbatim JSON under external Downloads via ADB (CI's
   simulated user save), wipe all app-private data, and use Android
   DocumentsUI to inspect the file **without restoring**. The UI must
   report **2 film projects** and leave completion at 0/33.
6. Independently choose the same file for real restore and consent to
   overwrite; verify progress and both project names. Reopen the original
   storyboard and verify the authored note/framing survived.

The lightweight native acceptance that only checks export uses this
same two-project setup. Separate browser tests still cover project
rename, deletion, legacy backups and malformed project collections.

## Scope and release boundary

Changes are to native test automation, its navigation contract and docs.
No app code, public release, backup schema, signing identity, curriculum,
learner data or permissions changed. The QA script interacts with a
disposable emulator; ADB-to-Downloads is **not** a physical-device
share-sheet save proof. Persistent signing, independent real-device
upgrade and real-phone external backup acceptance remain release gates.

The public APK remains temporarily signed v0.12A2 until those gates pass.
