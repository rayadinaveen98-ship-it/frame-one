import { useEffect, useState } from 'react';
import { LessonView } from './components/LessonView';
import { LearnView } from './components/LearnView';
import type { LegacyRoute } from './legacy/bridge';
import type { CSSProperties } from 'react';
import './legacy/legacy.css';

// v0.9 migration bridge: React owns the persistent application shell.
// The v0.8B learning runtime owns only the lesson/lab content region during
// this first migration. This makes zero curriculum rewrites necessary.
type Destination = 'home' | 'learn' | 'lab' | 'crafts';
const nav: { id: Destination; title: string; glyph: string }[] = [
  { id: 'home', title: 'Home', glyph: '⌂' },
  { id: 'learn', title: 'Learn Cinema', glyph: '▤' },
  { id: 'lab', title: 'Creative Lab', glyph: '◎' },
  { id: 'crafts', title: 'Meet Film Roles', glyph: '♧' },
];

function Navigation({ mobile = false }: { mobile?: boolean }) {
  return mobile ? (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {nav.map(item => (
        <button type="button" key={item.id} data-page={item.id}>
          <span aria-hidden="true">{item.glyph}</span><span>{item.id === 'crafts' ? 'Roles' : item.id === 'learn' ? 'Learn' : item.id === 'lab' ? 'Lab' : 'Home'}</span>
        </button>
      ))}
    </nav>
  ) : (
    <div className="nav-menu">
      <div className="nav-label">Explore</div>
      {nav.map(item => (
        <button className="nav-btn" type="button" key={item.id} data-page={item.id}>
          <span aria-hidden="true" className="nav-symbol">{item.glyph}</span>{item.title}
        </button>
      ))}
    </div>
  );
}

function ProgressTopbar() {
  return <header className="topbar">
    <div className="welcome">A little film school, in your pocket.</div>
    <div className="top-right">
      <div className="progress-pill">
        <span className="progress-circle" id="progressCircle" style={{'--angle':'0%'} as CSSProperties} />
        <span id="progressLabel">0/33 lessons</span>
      </div>
      <div className="avatar" aria-hidden="true">F1</div>
    </div>
  </header>;
}

export default function App() {
  const [bootError, setBootError] = useState<string | null>(null);
  const [route, setRoute] = useState<LegacyRoute>({page:'home',lesson:null});
  useEffect(() => {
    const onRoute = (event: Event) => {
      const custom = event as CustomEvent<LegacyRoute>;
      if (custom.detail?.page) setRoute(custom.detail);
    };
    window.addEventListener('frameone:route',onRoute);
    // Run after React mounts all DOM targets. The legacy engine never edits
    // a React-owned node; it owns #content for non-lesson views only.
    import('./legacy/runtime.js').catch(() => setBootError('Learning content could not load. Please refresh the page.'));
    return () => window.removeEventListener('frameone:route',onRoute);
  }, []);

  return <div className="app">
    <aside className="sidebar" aria-label="Main navigation">
      <a className="logo" href="#home" id="brand" aria-label="Frame One home">
        <span className="logo-mark" aria-hidden="true">▧</span>
        <span className="logo-type">FRAME ONE<span>THE ART OF FILM</span></span>
      </a>
      <Navigation />
      <div className="sidebar-bottom">
        <div className="side-note"><strong>Learn at your pace.</strong>No account. No pressure. Just cinema.</div>
        <button className="ghost-reset" id="resetProgress" type="button">Reset learning progress</button>
      </div>
    </aside>
    <main className="main" id="main-content">
      <ProgressTopbar />
      {bootError ? <p role="alert">{bootError}</p> : null}
      <div id="content" aria-live="off" hidden={route.page==='lesson'||route.page==='learn'} />
      {route.page==='learn' ? <LearnView /> : null}
      {route.page==='lesson' && route.lesson ? <LessonView key={route.lesson} lessonId={route.lesson} /> : null}
      <footer className="footer"><span>FRAME ONE · React lessons + chapters v0.9B</span><span>Made for curious minds <span className="heart">♥</span></span></footer>
    </main>
    <Navigation mobile />
  </div>;
}
