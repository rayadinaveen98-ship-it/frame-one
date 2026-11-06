# Frame One 2.0 — Native React parity milestone 1/3

## Nonnegotiable approved-design contract

**Owner decision:** the actual interactive Option B prototype, not its AI illustration previews, is the required visual benchmark for all future Frame One screens. Never substitute generic cards, icons, stock artwork, or low-detail AI pictures for its visual system simply because implementation is difficult.

**This milestone ports exactly two approved screens: Home + Journey.** They use real native React components, original SVG assets, and a Shadow DOM stylesheet that is a strict automated copy of the approved design's CSS (the only CSS adaptations are root scoping and viewport container height). Every mission in the native journey opens the existing approved mission experience until we can port it at equal quality.

### Source proof

- Approved reference remains `public/option-b-v1.html` (never rewritten).
- `public/option-b-assets/world.svg` and `scene.svg` have **exact decoded-byte parity** with the two base64 SVG art assets in that reference. Automated checks compare raw bytes, not names.
- `src/components/option-b-react-design.css` contains the same prototype CSS, changing only `:root` to isolated `:host` and dimensions from iframe viewport units to same-size parent container units. Automated test verifies the exact resulting CSS string.
- `OptionBReactScreens.tsx` renders Home and Journey as native React elements with the same visible DOM structure and labels as the approved original.
- Shadow DOM prevents the classic Frame One CSS from silently degrading the approved artwork, type or dimensions.
- A **Reference / React preview** switch at the top of the in-app pilot keeps both implementations live and reversible. Switching back is immediate, without losing original learner progress.

### Real visual acceptance

Browser CI captures **native-vs-approved-** PNG pairs from the exact `.phone` component at:

- 320px Android-like narrow viewport;
- 390px standard phone;
- desktop.

For both Home and Journey, a screenshot pixel comparator checks equal width/height and ensures no more than **8%** of rendered pixels have a per-colour-channel difference above 28 units (on an 8-bit scale). Both views use the same Chrome/Chromium instance, viewport, fonts and animation-disabled setting. This is intentionally stricter than comparing HTML class names or inspecting a static mockup. If this fails, the PR should **not** merge; diagnose and fix rendering.

**Limits:** The metric does not replace a creative review. Human review must still check legibility, visual hierarchy and interaction behaviour on a physical Android phone. Browser QA also verifies native journey nodes open the *real* existing approved mission UI, and returning to classic Frame One preserves its data.

### Native architecture

- The Native React port lives inside the existing opt-in 2.0 overlay; it does not replace the established six chapters or 33 lessons.
- Native Home/Journey **read** the Option B demo key `frameone-option-b-prototype-v1` but never write it. The original mission engine remains the only writer of that demo data.
- The original 33-lesson `frameone-progress-v01`, practice notes, native backup schema and seven Labs remain unchanged.
- Clicking Create/Progress or a mission transparently switches to the approved reference screen. No intentionally lower-quality substitute is shown.
- Main Android app shell and native Back handling remain preserved.

### Next milestones, gated on parity

1. Native React Mission screen (Observe → Decide → Experiment → Make) using the same scene SVG and CSS, with real choice-based feedback and meaningful practical film exercise. Compare **each** step at 320/390/desktop against the approved prototype.
2. Native React Creative Lab and Progress with the same art and controls; maintain separate demo data until future real-curriculum mapping is reviewed.
3. Move the whole approved UI to native React only when every screen has passed screenshot parity, accessibility, functionality and data-preservation acceptance. Then connect the actual six chapters/33 lessons using non-destructive migration and source-based original learning content.

**Play Store release is separately blocked by persistent production-signing plan and owner/device testing.**
