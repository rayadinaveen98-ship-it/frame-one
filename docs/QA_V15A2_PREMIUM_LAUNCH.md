# Frame One v0.15A2 — The First Frame (premium offline opening)

## Creative direction

Keep the existing original F1 mark and the **exact four-second** cold-launch
length, but move from a flat glow/title to a deliberately staged cinema ident:
1. Almost black; one narrow projector-light slit travels across a dark gate.
2. Soft iris and halo expand while the **existing vector paths** draw into place.
3. FRAME ONE types into view with warm, quiet registration marks.
4. THE ART OF FILM rests in the finished frame, then dissolves into the already
   rendered Home. No loud flashes, video, image download or audio.

No additional branding or external package. CSS and the same SVG code are used
in the existing React overlay, not a blocking WebView navigation screen.

## Accessibility and real-device behavior

- Labelled **Skip intro** button on cold launches, at least 44px tall.
- Decorative stage is `aria-hidden`; Skip remains accessible to keyboard and
  screen reader, with a visible focus outline.
- Overlay and stage use `pointer-events:none`; only Skip receives taps.
  The actual Home/Android native Back remains responsive.
- System `prefers-reduced-motion:reduce` suppresses the whole ident.
- Brief background transitions, photo picker and notifications do not replay it;
  after 45s away only the existing short 1.2s return card may appear.
- Portrait phones as narrow as 320px and full-width tablets are supported,
  with safe-area-aware Skip positioning.

## QA

- Existing cinematic brand/icon contract and offline web/native tests remain.
- Extended source assertions verify line drawing, Skip accessibility, vector
  brand continuity, no new network-based media and no motion trap.
- Real browser smoke verifies the exact 4000ms cold sequence, visible logo and
  Home handoff, and separately taps Skip on a 390px browser before checking Home.
- Android emulator, backup and same-signer upgrade regression gates are kept.

No lesson, Lab, film project, notes, gallery, progress or backup state changes.
This is not an update-safe public APK; permanent QA signer and real-phone
acceptance remain separate release prerequisites.
