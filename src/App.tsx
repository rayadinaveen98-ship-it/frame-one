import { useEffect, useRef, useState } from 'react';
import { LessonView } from './components/LessonView';
import { LearnView } from './components/LearnView';
import { ContinuityLab, type ContinuityMode } from './components/labs/ContinuityLab';
import { ColourLab, type ColourMode } from './components/labs/ColourLab';
import { FrameLab, type FrameMode } from './components/labs/FrameLab';
import { LightingLab } from './components/labs/LightingLab';
import { CutLab, type CutOrder, type CutDurations } from './components/labs/CutLab';
import { MakeLab } from './components/labs/MakeLab';
import { SoundLab } from './components/labs/SoundLab';
import type { SoundMode } from './components/labs/sound-audio';
import type { LightingMode } from './components/labs/LightingScene';
import type { LegacyRoute, LabName } from './legacy/bridge';
import type { CSSProperties } from 'react';
import './legacy/legacy.css';
import './components/labs/react-labs.css';
import './native-safe-area.css';
import './pwa-update.css';

// v0.9 migration bridge: React owns the persistent application shell.
// The v0.8B learning runtime owns only the lesson/lab content region during
// this first migration. This makes zero curriculum rewrites necessary.
type Destination = 'home' | 'learn' | 'lab' | 'crafts';
type AppRoute = LegacyRoute & {lab?: LabName};
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

function ProgressTopbar({page}: {page: Destination | 'lesson'}) {
  return <header className="topbar">
    <div className="topbar-leading">
      {page!=='home' ? <button className="mobile-back" type="button" aria-label="Back within Frame One" onClick={()=>window.frameOneLegacy?.goBack()}>
        <span aria-hidden="true">←</span> Back
      </button> : null}
      <div className="welcome">A little film school, in your pocket.</div>
    </div>
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
  const [updateReady, setUpdateReady] = useState(false);
  const [route, setRoute] = useState<AppRoute>({page:'home',lesson:null});
  const [continuityMode, setContinuityMode] = useState<ContinuityMode>('match');
  const [colourMode,setColourMode] = useState<ColourMode>('neutral');
  const [colourStrength,setColourStrength] = useState(65);
  const [frameMode,setFrameMode] = useState<FrameMode>('wide');
  const [frameZoom,setFrameZoom] = useState(1);
  const [frameGuides,setFrameGuides] = useState(true);
  const [frameCompare,setFrameCompare] = useState(false);
  const [lightingMode,setLightingMode] = useState<LightingMode>('front');
  const [lightPower,setLightPower] = useState(90);
  const [lightSoft,setLightSoft] = useState(35);
  const [cutOrder,setCutOrder] = useState<CutOrder>(['place','detail','person']);
  const [cutDurations,setCutDurations] = useState<CutDurations>([2,2,2]);
  const [cutStep,setCutStep] = useState(0);
  const [soundMode,setSoundMode] = useState<SoundMode>('silence');
  const [soundAmbience,setSoundAmbience] = useState(true);
  const previousRoute = useRef('home:');
  useEffect(() => {
    const ready = () => setUpdateReady(true);
    window.addEventListener('frameone:pwa-update-ready', ready);
    return () => window.removeEventListener('frameone:pwa-update-ready', ready);
  }, []);
  // On SPA navigation, return keyboard/screen-reader focus to the page heading.
  // Skip the initial home mount to avoid stealing focus when booting.
  useEffect(() => {
    const key = route.page + ':' + (route.lesson ?? route.lab ?? '');
    if (previousRoute.current === key) return;
    previousRoute.current = key;
    const frame = requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>('#main-content .page h1');
      if (!heading) return;
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [route.page, route.lesson, route.lab]);
  useEffect(() => {
    const onRoute = (event: Event) => {
      const custom = event as CustomEvent<LegacyRoute>;
      if (!custom.detail?.page) return;
      // Legacy engine explicitly provides the selected lab in its route event.
      // It leaves #content empty when either React-owned lab owns the screen.
      const lab = custom.detail.page === 'lab' ? custom.detail.lab : undefined;
      setRoute({ ...custom.detail, lab });
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
      <ProgressTopbar page={route.page} />
      {updateReady ? <div className="pwa-update-notice" role="status">
        <span><strong>New version available.</strong> Finish what you're doing, then refresh to see the latest changes.</span>
        <button type="button" onClick={() => window.location.reload()}>Refresh now</button>
      </div> : null}
      {bootError ? <p role="alert">{bootError}</p> : null}
      <div id="content" aria-live="off" hidden={route.page==='lesson'||route.page==='learn'||(route.page==='lab'&&(route.lab==='continuity'||route.lab==='colour'||route.lab==='frame'||route.lab==='light'||route.lab==='cut'||route.lab==='story'||route.lab==='sound'))} />
      {route.page==='lab' && route.lab==='continuity' ? <ContinuityLab mode={continuityMode} setMode={setContinuityMode} /> : null}
      {route.page==='lab' && route.lab==='colour' ? <ColourLab mode={colourMode} setMode={setColourMode} strength={colourStrength} setStrength={setColourStrength} /> : null}
      {route.page==='lab' && route.lab==='frame' ? <FrameLab mode={frameMode} setMode={setFrameMode} zoom={frameZoom} setZoom={setFrameZoom} guides={frameGuides} setGuides={setFrameGuides} compare={frameCompare} setCompare={setFrameCompare} /> : null}
      {route.page==='lab' && route.lab==='light' ? <LightingLab mode={lightingMode} setMode={setLightingMode} power={lightPower} setPower={setLightPower} softness={lightSoft} setSoftness={setLightSoft} /> : null}
      {route.page==='lab' && route.lab==='cut' ? <CutLab order={cutOrder} setOrder={setCutOrder} durations={cutDurations} setDurations={setCutDurations} step={cutStep} setStep={setCutStep} /> : null}
      {route.page==='lab' && route.lab==='story' ? <MakeLab /> : null}
      {route.page==='lab' && route.lab==='sound' ? <SoundLab mode={soundMode} setMode={setSoundMode} ambience={soundAmbience} setAmbience={setSoundAmbience} /> : null}
      {route.page==='learn' ? <LearnView /> : null}
      {route.page==='lesson' && route.lesson ? <LessonView key={route.lesson} lessonId={route.lesson} /> : null}
      <footer className="footer"><span>FRAME ONE · React lessons + chapters + 7 Creative Labs v0.9D</span><span>Made for curious minds <span className="heart">♥</span></span></footer>
    </main>
    <Navigation mobile />
  </div>;
}
