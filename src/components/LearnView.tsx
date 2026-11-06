import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import curriculum from '../data/curriculum.v08b.json';
import type { Lesson } from '../data/schema';
import { navigate } from '../legacy/bridge';
import { isAndroidBackupAvailable, shareAndroidLearningBackup } from '../native-backup';
import { consumeLearningBackupRequest } from '../state/backup-navigation';
import { safeProgress } from '../state/learning';
import { LearningJourney } from './LearningJourney';
import './learn-react.css';

type Chapter = { name: string; strap: string; ids: string[]; later: string[] };
type Term = { term: string; te: string; meaning: string };
const lessons = curriculum.lessons as unknown as Lesson[];
const chapters = curriculum.chapters as Chapter[];
const glossary = curriculum.glossary as Term[];
const ids = lessons.map(l => l.id);
const byId = new Map(lessons.map(l => [l.id, l]));
const filters = ['All', ...new Set(lessons.map(l => l.unit))];

function LessonRow({lesson, completed}: {lesson: Lesson;completed: boolean}) {
  return <button className="list-card react-lesson-card" type="button" onClick={()=>navigate('lesson',lesson.id)}>
    <span className="list-icon" aria-hidden="true">{completed?'✓':'▣'}</span>
    <span className="list-info"><span className="eyebrow-secondary">{completed?'✓ COMPLETE · ':''}LESSON {lesson.num} · {lesson.minutes} MIN</span><h3>{lesson.title}</h3><p>{lesson.subtitle}</p></span>
    <span className="tail" aria-hidden="true">↗</span>
  </button>;
}

function LearningBackup({onRestored}: {onRestored:()=>void}) {
  const [message,setMessage] = useState('');
  const [nativeSharing,setNativeSharing] = useState(false);
  const [backupText,setBackupText] = useState('');
  const [restoreText,setRestoreText] = useState('');
  const [inspectionStatus,setInspectionStatus] = useState('');
  const fileRef=useRef<HTMLInputElement>(null);
  const inspectionFileRef=useRef<HTMLInputElement>(null);
  const panelRef=useRef<HTMLDetailsElement>(null);
  useEffect(()=>{
    if(!consumeLearningBackupRequest())return;
    const panel=panelRef.current;
    if(!panel)return;
    panel.open=true;
    // After React mounts the actual screen, make the existing backup
    // actions visible and accessible by keyboard/TalkBack.
    const frame=requestAnimationFrame(()=>{
      panel.scrollIntoView({block:'start',behavior:'auto'});
      panel.querySelector<HTMLElement>('summary')?.focus({preventScroll:true});
    });
    return ()=>cancelAnimationFrame(frame);
  },[]);

  // The same legacy validation powers both inspection and real import.
  // Inspection never writes, changes completion or reveals private text.
  const inspectJSON = (raw:string) => {
    if(raw.length > 2_000_000) throw new Error('Backup is larger than 2 MB.');
    const payload:unknown=JSON.parse(raw);
    const bridge=window.frameOneLegacy;
    if(!bridge) throw new Error('Learning engine is not ready yet.');
    return {payload,summary:bridge.inspectBackup(payload)};
  };
  const describeBackup = (summary:{completedLessons:number;practiceNotes:number;storyboardShots:number;storyboardProjects:number}) =>
    `${summary.completedLessons} completed lessons, ${summary.practiceNotes} saved lesson notes and ${summary.storyboardShots} storyboard shots across ${summary.storyboardProjects} film ${summary.storyboardProjects===1?'project':'projects'}`;
  // Inspect before asking permission to overwrite; never treat inspection as restoration.
  const restoreJSON = (raw:string): boolean => {
    try {
      const {payload,summary}=inspectJSON(raw);
      if (!window.confirm('Restore this backup? It contains '+describeBackup(summary)+
        '. This will replace the learning progress, practice notes and ALL film projects currently saved on this device.')) {
        setMessage('Restore cancelled. Your current learning data is unchanged.');
        return false;
      }
      window.frameOneLegacy?.importBackup(payload);
      setMessage('Learning backup restored in this browser.');
      setInspectionStatus('');
      onRestored();
      return true;
    } catch(err) {
      setMessage(`Could not restore: ${err instanceof Error ? err.message : 'Invalid backup'}`);
      return false;
    }
  };
  const onInspectionFile=async(e:ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0];
    e.target.value='';
    if(!file)return;
    try {
      if(file.size>2_000_000)throw new Error('Backup is larger than 2 MB.');
      const {summary}=inspectJSON(await file.text());
      setInspectionStatus('Checked: '+describeBackup(summary)+
        '. Nothing was restored. Keep the file somewhere outside Frame One.');
    }catch(err){
      setInspectionStatus('Backup check failed: '+
        (err instanceof Error?err.message:'Unreadable backup')+
        '. Your saved work was not changed.');
    }
  };
  const inspectPastedBackup=()=>{
    try {
      const {summary}=inspectJSON(restoreText);
      setInspectionStatus('Checked pasted backup: '+describeBackup(summary)+
        '. Nothing was restored.');
    }catch(err){
      setInspectionStatus('Backup check failed: '+
        (err instanceof Error?err.message:'Unreadable backup')+
        '. Your saved work was not changed.');
    }
  };
  const onFile = async (e:ChangeEvent<HTMLInputElement>) => {
    const file=e.target.files?.[0];
    e.target.value='';
    if(!file) return;
    try {
      if(file.size>2_000_000) throw new Error('Backup is larger than 2 MB.');
      restoreJSON(await file.text());
    } catch(err) {
      setMessage(`Could not restore: ${err instanceof Error ? err.message : 'Invalid backup'}`);
    }
  };
  const shareNativeBackup=async () => {
    if(nativeSharing)return;
    setNativeSharing(true);
    setMessage('Preparing your private Android backup file...');
    try {
      if(!window.frameOneLegacy)throw new Error('Learning engine is not ready yet.');
      await shareAndroidLearningBackup(window.frameOneLegacy.getBackupJSON());
      setMessage('Share chooser finished. Check that the JSON file was saved outside Frame One before uninstalling or changing devices.');
    } catch(err) {
      setMessage(`Could not share backup: ${err instanceof Error ? err.message : 'Android share unavailable'}. Use the text copy/paste option below.`);
    } finally { setNativeSharing(false); }
  };
  const showAndCopyBackup=async () => {
    try {
      const bridge=window.frameOneLegacy;
      if(!bridge) throw new Error('Learning engine is not ready yet.');
      const json=bridge.getBackupJSON();
      setBackupText(json);
      if(navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(json);
          setMessage('Backup copied. Save it privately before replacing your device or app.');
          return;
        } catch { /* Some Android WebViews deny clipboard permission. */ }
      }
      setMessage('Backup shown below. Select all, copy it and save it privately.');
    } catch {
      setMessage('Backup text is unavailable. Please try again from the Learn screen.');
    }
  };
  return <details id="learningBackupPanel" ref={panelRef} className="backup-panel">
    <summary>Keep a copy of your learning <span>Save / restore locally</span></summary>
    <p>A different browser or app address can have separate saved data. Export your progress and storyboard before switching devices or versions.</p>
    {isAndroidBackupAvailable()?<p className="backup-upgrade-warning"><strong>Before replacing a Frame One test APK:</strong> Android may reject installing a newer test build over your existing app because signing certificates can differ. Save your JSON to Downloads, Drive, or another location outside Frame One, verify it exists, and only then consider uninstalling the old app. An Android share sheet alone does not mean the file was saved.</p>:null}
    {isAndroidBackupAvailable() ? <p>The Android save/share chooser opens a temporary JSON backup. Choose an external destination and verify the file is there. A file left inside this app may disappear on uninstall.</p> : null}
    <div className="backup-actions">
      {isAndroidBackupAvailable()
        ? <button className="btn-secondary" type="button" disabled={nativeSharing} onClick={()=>void shareNativeBackup()}>
            {nativeSharing?'Preparing Android backup...':'Save / share backup JSON'}
          </button>
        : <button className="btn-secondary" type="button" onClick={()=>{ try{if(!window.frameOneLegacy) throw new Error('Learning engine not ready');window.frameOneLegacy.exportBackup();setMessage('Backup download prepared.');}catch{setMessage('Backup download is unavailable here.');}}}>Download learning backup</button>}
      <button className="btn-secondary" type="button" data-inspect-backup-file
        onClick={()=>inspectionFileRef.current?.click()}>Check a backup JSON file</button>
      <button className="btn-secondary" type="button" onClick={()=>fileRef.current?.click()}>Restore a backup JSON file</button>
      <input ref={inspectionFileRef} className="sr-only" type="file"
        accept=".json,application/json" onChange={e=>void onInspectionFile(e)}
        aria-label="Choose a Frame One backup to check without restoring" />
      <input ref={fileRef} className="sr-only" type="file" accept=".json,application/json" onChange={onFile} aria-label="Choose a Frame One backup JSON" />
    </div>
    <details className="backup-text-fallback">
      <summary>Download not working? Copy or paste a backup</summary>
      <p>Use this alternative if Android does not save a JSON download. Your backup contains private practice ideas and storyboard notes; don't post it publicly.</p>
      <button className="btn-secondary" type="button" onClick={()=>void showAndCopyBackup()}>Show and copy backup text</button>
      {backupText ? <div className="backup-text-field">
        <label htmlFor="backupCopyText">Your complete learning backup · select all if copying was blocked</label>
        <textarea id="backupCopyText" value={backupText} readOnly rows={5} onFocus={e=>e.currentTarget.select()} />
      </div> : null}
      <div className="backup-text-field">
        <label htmlFor="backupPasteText">Restore a backup from pasted JSON</label>
        <textarea id="backupPasteText" value={restoreText} onChange={e=>setRestoreText(e.target.value)} maxLength={2_000_000} rows={5} placeholder="Paste a Frame One learning backup JSON here..." />
        <button className="btn-secondary" type="button" data-inspect-backup-text
          disabled={!restoreText.trim()} onClick={inspectPastedBackup}>Check pasted backup</button>
        <button className="btn-secondary" type="button" disabled={!restoreText.trim()} onClick={()=>{if(restoreJSON(restoreText))setRestoreText('');}}>Restore pasted backup</button>
      </div>
    </details>
    <p className="backup-inspection-status" role="status" data-backup-inspection>{inspectionStatus}</p>
    <p className="backup-status" role="status">{message}</p>
    <small>Includes private practice notes and storyboard. Restoring replaces currently saved work. No upload or online account is involved.</small>
  </details>;
}

// One concise promise and practical outcome per existing curriculum chapter.
// These are presentation-only descriptions; lesson IDs and progress stay unchanged.
const chapterFocus = [
  {promise:'Understand what cinema is and how it began.',practice:'Spot the difference between a frame, a shot and a scene.'},
  {promise:'Turn an everyday moment into a human story.',practice:'Build a character, an obstacle and a filmable choice.'},
  {promise:'Use framing, light and movement with intention.',practice:'Choose a shot that guides the audience\'s attention.'},
  {promise:'Feel how sound and cuts change a moment.',practice:'Compare timing, ambience and music in a scene.'},
  {promise:'See how the people on a film set work together.',practice:'Connect a creative decision to the team who makes it.'},
  {promise:'Take one small film from idea to finished scene.',practice:'Plan, shoot, edit and reflect on your own work.'},
] as const;

export function LearnView() {
  const [filter,setFilter] = useState('All');
  const [query,setQuery] = useState('');
  const [glossaryQuery,setGlossaryQuery] = useState('');
  const [revision,setRevision] = useState(0);
  // Open only the chapter containing the next unfinished lesson.
  // No new progress data or stored UI settings.
  const [expandedChapters,setExpandedChapters] = useState<Set<number>>(()=>{
    const progress=safeProgress(ids);
    const upcoming=lessons.find(lesson=>!progress.has(lesson.id));
    const chapter=chapters.findIndex(item=>item.ids.includes(upcoming?.id??lessons[0].id));
    return new Set([Math.max(0,chapter)]);
  });
  const pendingChapterFocus=useRef<number|null>(null);
  useEffect(()=>{
    const targetIndex=pendingChapterFocus.current;
    if(targetIndex===null || query.trim()!=='' || filter!=='All')return;
    const heading=document.getElementById('reactChapter'+targetIndex);
    if(!heading)return;
    pendingChapterFocus.current=null;
    heading.tabIndex=-1;
    heading.focus({preventScroll:true});
    heading.scrollIntoView({block:'start',behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  },[expandedChapters,query,filter]);
  const jumpToChapter=(chapter:number)=>{
    pendingChapterFocus.current=chapter;
    setQuery('');
    setFilter('All');
    setExpandedChapters(new Set([chapter]));
  };
  const completed = safeProgress(ids);
  const next=lessons.find(l=>!completed.has(l.id))??lessons[0];
  const filtered = useMemo(()=>lessons.filter(l=>(filter==='All'||l.unit===filter) && `${l.title} ${l.subtitle} ${l.unit}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())),[filter,query]);
  const matchedGlossary = useMemo(()=>glossary.filter(t=>`${t.term} ${t.te} ${t.meaning}`.toLocaleLowerCase().includes(glossaryQuery.trim().toLocaleLowerCase())),[glossaryQuery]);
  const searched = query.trim()!==''||filter!=='All';
  return <div className="page react-learn-view" data-revision={revision} data-clear-chapters>
    <header className="learn-clear-intro">
      <span className="eyebrow-secondary">YOUR LEARNING JOURNEY</span>
      <h1>Learn cinema, one choice at a time.</h1>
      <p>Six chapters. Thirty-three short lessons. Start anywhere.</p>
      <button type="button" className="classic-mobile-next" data-classic-mobile-next
        onClick={()=>navigate('lesson',next.id)}>
        Continue learning <span aria-hidden="true">→</span>
      </button>
    </header>
    <LearningJourney chapters={chapters} completed={completed} totalLessons={lessons.length}
      nextLesson={next} onNext={()=>navigate('lesson',next.id)}
      activeChapter={[...expandedChapters][0]??0} onChapterSelect={jumpToChapter}/>
    {/* The Classic first-lesson CTA must be reachable ABOVE the Android bottom
        navigation. Keep the legacy prototype reference below genuine learning
        and retain its exact data-option-b-open QA entry. */}
    <section className="option-b-entry" aria-label="Try the new Frame One 2.0 design">
      <div className="option-b-entry-art" aria-hidden="true">
        <span className="option-b-entry-orbit">✦</span>
        <span className="option-b-entry-camera">▣</span>
      </div>
      <div className="option-b-entry-copy">
        <span className="eyebrow-secondary">NEW · FRAME ONE 2.0 DESIGN PILOT</span>
        <h2>Learn by making it.</h2>
        <p>Explore the approved interactive journey: illustrated chapters, creative choices and hands-on experiments. Your existing course and notes stay untouched.</p>
        <button type="button" className="option-b-entry-action" data-option-b-open
          onClick={()=>window.dispatchEvent(new Event('frameone:option-b-open'))}>
          Explore the new journey <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
    <div className="learn-chapter-heading">
      <div><span className="eyebrow-secondary">THE COURSE</span><h2>Explore six chapters</h2></div>
      <span className="learn-chapter-total">{chapters.length} chapters · {lessons.length} lessons</span>
    </div>
    <details className="learn-tools" open={searched||undefined}>
      <summary>Find a lesson <span>Search and filters</span></summary>
      <div className="search-row"><label className="sr-only" htmlFor="reactLessonSearch">Search lessons</label><input className="learn-search" id="reactLessonSearch" type="search" placeholder="Search frames, dialogue, sound..." value={query} onChange={e=>setQuery(e.target.value)} /><small>{filtered.length} of {lessons.length} lessons</small></div>
      <div className="filter-row" aria-label="Filter lessons by chapter topic">{filters.map(c=><button type="button" className="filter-chip" key={c} aria-pressed={filter===c} onClick={()=>setFilter(c)}>{c}</button>)}</div>
    </details>
    {searched ? <div className="list-grid learn-search-results" aria-live="polite">{filtered.length ? filtered.map(l=><LessonRow key={l.id} lesson={l} completed={completed.has(l.id)}/>) : <p className="empty">No matching lessons. Try a different term or choose All.</p>}</div>
    : <div className="chapter-list" data-chapter-library>{chapters.map((c,i)=>{
      const count=c.ids.filter(id=>completed.has(id)).length;
      const open=expandedChapters.has(i);
      const focus=chapterFocus[i];
      return <section key={c.name} className={'chapter-panel'+(open?' is-active':'')} aria-labelledby={`reactChapter${i}`} data-chapter-index={i}>
        <button className="chapter-mobile-toggle" type="button"
          aria-label={`${open?'Close':'Open'} chapter ${i+1}: ${c.name.replace(/^\d+\s*[·.\-]\s*/, '')}, ${count} of ${c.ids.length} lessons complete`}
          aria-expanded={open} aria-controls={`chapterLessons${i}`}
          onClick={()=>setExpandedChapters(previous=>new Set(previous.has(i)?[]:[i]))}>
          <span className="chapter-number" aria-hidden="true">{String(i+1).padStart(2,'0')}</span>
          <span className="chapter-identity">
            <span className="eyebrow-secondary">CHAPTER {String(i+1).padStart(2,'0')} · {c.ids.length} LESSONS</span>
            <h2 id={`reactChapter${i}`}>{c.name.replace(/^\d+\s*[·.\-]\s*/, '')}</h2>
            <span className="chapter-purpose">{focus.promise}</span>
          </span>
          <span className="chapter-action" aria-hidden="true">
            <span className="chapter-count">{count}/{c.ids.length}</span>
            <span className="chapter-chevron">{open?'−':'+'}</span>
          </span>
        </button>
        <div className="chapter-meter" role="progressbar" aria-label={`Chapter ${i+1} lessons finished`} aria-valuenow={count} aria-valuemin={0} aria-valuemax={c.ids.length}>
          <div style={{width:`${Math.round(count/c.ids.length*100)}%`}}/>
        </div>
        <div id={`chapterLessons${i}`} className={`chapter-body ${open?'is-expanded':''}`} aria-hidden={!open}>
          <p className="chapter-practice"><span>YOU'LL TRY</span>{focus.practice}</p>
          <div className="chapter-lessons">{c.ids.map(id=>byId.get(id)).filter((l):l is Lesson=>Boolean(l)).map(l=><LessonRow key={l.id} lesson={l} completed={completed.has(l.id)}/>)}</div>
        </div>
      </section>;
    })}</div>}
    <div className="learn-resources-label">Your learning resources</div>
    <LearningBackup onRestored={()=>setRevision(n=>n+1)}/>
    <details className="glossary-block"><summary>Film words, explained simply <span>{glossary.length} terms · English + తెలుగు</span></summary>
      <div className="glossary-search"><label className="sr-only" htmlFor="reactGlossarySearch">Search glossary</label><input className="learn-search" id="reactGlossarySearch" type="search" value={glossaryQuery} onChange={e=>setGlossaryQuery(e.target.value)} placeholder="Find a film word..." /></div>
      <div className="glossary-grid" aria-live="polite">{matchedGlossary.length ? matchedGlossary.map(g=><div className="glossary-entry" key={g.term}><div><strong>{g.term}</strong><span lang="te">{g.te}</span></div><p>{g.meaning}</p></div>) : <p className="empty">No matching film words.</p>}</div>
    </details>
  </div>;
}
