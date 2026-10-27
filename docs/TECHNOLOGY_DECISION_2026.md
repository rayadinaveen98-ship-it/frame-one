# Frame One — Web, Android & iOS Technical Decision

**Date:** 26 October 2026  
**Status:** Recommended architecture, **not yet migrated or built as native apps**.

## Recommendation

**React 19 + TypeScript + Vite + Capacitor 8**, sharing one app UI and core educational logic across a hosted web app/PWA and packaged Android/iOS apps.

Why this is the best initial choice for *Frame One*, rather than best for every app:
- Today's prototype already uses HTML, CSS, SVG and Web Audio. Keeping web technologies avoids rebuilding 33 lessons, seven labs and original illustrations in a new rendering framework.
- Interactive labs are primarily scene diagrams, SVG, touch controls, short animations, browser audio and timelines—not a 3D game that requires a fully native real-time renderer.
- The product is offline-first and privacy-first; a server and accounts are unnecessary for the first public beta.
- Vite supplies modern development builds; React and TypeScript allow testable components and type-safe curriculum content. Capacitor adds native shells and access to platform plugins when necessary.

### Verified docs (2026)

- React latest major: https://react.dev/versions (React 19.3 as of Oct 2026)
- Vite: https://vite.dev/guide/
- Capacitor 8: https://capacitorjs.com/docs
- Capacitor add to web app: https://capacitorjs.com/docs/getting-started
- Capacitor Android: https://capacitorjs.com/docs/android (API 24+ on the v8 page)
- Capacitor iOS: https://capacitorjs.com/docs/ios (iOS 15+, Xcode 26+ per current docs)
- Motion for React: https://motion.dev/docs/react-svg-animation
- Web offline data: https://web.dev/learn/pwa/offline-data
- Apple's minimum functionality: https://developer.apple.com/app-store/review/guidelines/ (section 4.2)

## Alternative comparison

| Candidate | Benefits | Main downside for Frame One | Decision |
|---|---|---|---|
| React + TypeScript + Vite + Capacitor | Reuse browser labs; one component/code system; fast web iteration; Android/iOS app shells | Mobile is based on WebView, so device-specific testing and optimizations remain essential | **First choice** |
| Expo / React Native + React Native Web | Excellent mobile-native ecosystem, Expo builds and routing | Existing HTML/CSS/SVG lab UI needs substantial translation or bridging | Worth revisiting if native-first needs dominate |
| Flutter | Highly consistent graphic rendering and mature native rendering engine | Dart rewrite of existing browser interactions; web experience differs from conventional web DOM, requiring additional testing | Not justified for this content-first first release |
| PWA alone | Simplest deployment, no store fees, installable on many devices | Installation and platform behaviour vary; no guaranteed full store-native experience | **Deliver first**, as one output of the recommended stack |
| Separate native Android + iOS apps | Maximum platform-level flexibility | Three independently maintained implementations including web; too expensive for the current scope | Avoid |

The recommendation is based on project constraints, not a benchmark proving React/Capacitor always runs animations faster. If later labs require advanced real-time 3D or low-latency media processing, benchmark native modules, canvas, WebGL, React Native and/or Flutter before deciding.

## Precise production stack

| Layer | Choice | Why |
|---|---|---|
| Application | React 19 + TypeScript | Modular screen and lesson components, type-safe data |
| Build | Vite | Small modern production bundles and fast hot reload |
| Navigation | React Router (or similarly tested router) | Real browser history, deep links and mobile navigation |
| Styling | CSS variables + modular CSS; accessible controls | Flexible cinematic layout without over-relying on heavy UI libraries |
| Motion | Native CSS/Web Animations + Motion for React for SVG interactions | GPU-friendly animation, reduced-motion support |
| Graphic labs | Existing SVG first; Canvas/WebGL **only after profiling** | Good sharp rendering across screen sizes; preserve accuracy disclaimers |
| Sound labs | Web Audio API with opt-in playback; native plugin only if required | Already used in the prototype; check iOS interruptions |
| Learning content | Versioned typed content records; locales in separate files | Accuracy checks, future Telugu translation and content updates |
| Storage | IndexedDB for structured offline data; Cache Storage for offline media | More appropriate than increasingly complex localStorage blobs |
| Offline | Service worker/PWA and bundled native assets | Lessons available without always being online |
| Mobile packaging | Capacitor 8 Android/iOS shells | Access to device file share/storage, haptics, safe areas if needed |
| Testing | Vitest, Playwright browsers, Android emulator/real device, iPhone device/TestFlight | Real interaction, screen-size and accessibility QA |
| Deployment | Any reliable static HTTPS host + versioned releases | No backend or cloud required for beta |
| Backend | **None in v1** | Avoid cost, account friction, and privacy complexity |

## Architecture and file plan

```text
frame-one/
  apps/
    web/                    React + Vite application
    android/                Capacitor-generated Android project
    ios/                    Capacitor-generated iOS project
  packages/
    curriculum/             33+ typed English lessons, quiz keys, Telugu locales
    learning-core/          Progress, history, shot plans, backup migrations
    cinematic-labs/        Frame, Sound, Cut, Light, Make, Colour, Continuity
    design-system/         Accessible common UI, typography, colours, motion
  tests/
    curriculum/             Lesson schema, terminology and quiz accuracy
    e2e/                    Browser, touch and navigation tests
  docs/
    content-sources/        Source links and educator review status
    releases/               Migration guides and release checks
```

**Important:** This is the *target repository layout*, not a claim the project was migrated. The current v0.8B remains one local HTML app for user testing.

## Migration process, in strict order

1. **Freeze and back up v0.8B:** Keep source ZIP, list 33 legacy lesson IDs and the three storage keys. Write a golden quiz/backup regression suite.
2. **Extract data without rewriting content:** Move lesson bodies, options, local summaries and glossary into structured JSON/TS files. Add validators and citations to source notes. Preserve existing identifiers.
3. **Create React shell:** Build home, chapters, lesson, lab, crew and Make screens as components. Match features before polishing visuals. Introduce typed routes.
4. **Port labs incrementally:** Frame -> Sound -> Cut -> Light -> Make -> Colour -> Continuity. Test touch, keyboard, audio and animations on real devices at each step.
5. **Protect existing user data:** Read `frameone-progress-v01`, `frameone-practice-v07` and `frameone-scene-v07` once under the same origin. Import old JSON backups; migrate to IndexedDB transactionally. Export remains supported.
6. **Add PWA/offline support and deploy HTTPS web beta:** Verify updates, cached assets, offline lessons, privacy and graceful errors.
7. **Add Capacitor Android:** Generate the native project, test modern and older Android devices, WebView playback, file export/import, display safe areas, hardware back and reduced motion. Build a signed Android test APK/AAB when toolchain and signing are available.
8. **Add Capacitor iOS:** Requires a working macOS/Xcode setup for native builds (or configured Mac-based CI). Test Safari/WKWebView audio, safe areas, keyboard, files and storage; then TestFlight/App Store readiness.
9. **Final compliance/quality checks:** Apple Guideline 4.2 warns against merely repackaging a website. Ensure meaningful offline educational content, device-friendly UX, responsive interactive labs, local projects, optional native sharing and tested functionality. Review licensing, privacy policies and accessibility.

## Costs and practical limitations

- Open-source web framework, Vite and Capacitor do not require per-use licence fees, but hosting, optional services, testing devices, Apple developer membership and store account fees may cost money.
- **Windows is enough for web and Android development.** A native iOS archive normally needs Xcode on macOS or an approved Mac-based build service. Do not promise an iOS IPA from Windows without that infrastructure.
- Capacitor packages web app code into a native WebView; mobile UX/performance quality must be tested, especially animation, file dialogs and audio. Not a magic native optimization.
- Existing `file://` prototypes are **not** the production architecture; different downloaded files may have separate storage. Use a stable HTTPS origin plus migration, not reliance on file URLs.
- Offline images/audio can increase app package size. Use original compressed assets and lazy-loading; test under poor connectivity.
- Keep English fully accurate; Telugu summaries have not undergone native-speaker educational review, and should not be labelled full translations.

## Technology decision gate

**Proceed with this stack** if our interactive labs meet usability/performance thresholds on inexpensive Android phones and Safari/iPhones, offline backup/import works, and educators find the content useful. Revisit the rendering layer only if actual device benchmarks prove it inadequate.