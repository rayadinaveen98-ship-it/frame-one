# Technical architecture & decisions

**Choice:** React 19 + TypeScript + Vite web-first, Capacitor 8 for Android/iOS. This reuses existing HTML/SVG visual experiments and WebAudio and avoids a costly full rewrite. Alternatives reviewed: Expo/React Native, Flutter and PWA-only.

The planned v0.9B source tree consists of React lesson reader, chapter explorer/search/glossary, local learning state, structured lesson JSON, plus a legacy JavaScript bridge for seven labs, crew map, home and backup. The static earlier preview is archived in this repository, but full v0.9B React source is still in an external local ZIP pending import. **No successful npm build has been verified.**

Persisted browser keys: `frameone-progress-v01`, `frameone-practice-v07`, `frameone-scene-v07`. An exported JSON backup is needed to move origins. The initial Capacitor bundle ID `com.frameone.learncinema` is provisional.

Native release requires Android Studio / Gradle; iOS requires macOS and Xcode. Mobile WebView, user-triggered audio, offline assets, safe areas, back navigation and file backup must be tested in real native shells.
