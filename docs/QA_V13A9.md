# Frame One v0.13A9 — From a lesson to a real phone exercise

## What changed

The v0.13A7 Film It Yourself workshop was originally discoverable only near
the end of Home. A learner finishing a lesson on shot sizes, lighting,
dialogue/sound or cutting had to return to Home and manually pick the correct
hands-on exercise.

v0.13A9 adds a small **Film it yourself** action directly inside the
lesson's existing "Try this yourself" section. Fifteen real authored lessons
link to one of the **four existing exercises**:

| Exercise | Related lessons |
|---|---|
| One action. Three shots. | units, shot, composition, shotlist, making, shootscene |
| One subject. Two moods. | lighting, colour |
| Tell it without dialogue. | sound, ambience, dialogue, showdonttell |
| One action. Two rhythms. | editing, rhythm, editminute |

The link uses the existing legacy navigation to return to Home, selects the
specific relevant mission, expands only that workshop and focuses its
heading. Checkboxes start unchecked. The user sees **From your lesson**,
three shootable steps and real links back to the relevant creative lab and
lesson. Standard Home visits still show a compact collapsed workshop.

No new video permission, recording, file upload, tracking, HTTP calls or
account is introduced. The pending handoff is a validated **single-use
in-memory value**, consumed when the destination mounts. It is not included
in lesson completion, practice-note keys, storyboard, backups or search
history. Refreshing or leaving Home does not create false completion.

## Automated acceptance

- Source verification checks the mapping against actual curriculum IDs, all
  four mission IDs, inherited-object key rejection, invalid values,
  one-time consumption and latest explicit navigation winning.
- Browser QA opens Lighting from the Home offline search, follows the new
  lesson exercise action, confirms that Home selects the lighting mission,
  auto-expands and focuses it, and confirms no step is falsely complete.
  Navigating away and returning verifies the exercise no longer auto-opens.
- Real browser phone-width tests at **320px and 390px** use the Rhythm
  lesson, follow its actual practice CTA, verify correct selection and
  measure horizontal overflow. Screenshots accompany those browser runs.
- Standard 33-lesson, seven-Lab, personal gallery, backup/restore and
  Android CI gates remain part of the existing workflows.

## Release status and limitations

This is source functionality only. As previously documented, the public
Android APK remains **v0.12A2**, with a temporary test signing identity;
the permanent signer and physical-device upgrade acceptance have not been
completed. No public APK has been replaced. The exercise does not film
or grade real footage; the student uses their own phone camera.
