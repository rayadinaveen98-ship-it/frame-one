import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import curriculum from '../data/curriculum.v08b.json';
import type { Lesson } from '../data/schema';
import { navigate } from '../legacy/bridge';
import { safeProgress } from '../state/learning';
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
  const fileRef=useRef<HTMLInputElement>(null);
  const onFile = async (e:ChangeEvent<HTMLInputElement>) => {
    const file=e.target.files?.[0];
    e.target.value='';
    if(!file) return;
    try {
      if(file.size>2_000_000) throw new Error('Backup is larger than 2 MB.');
      const json:unknown=JSON.parse(await file.text());
      const bridge=window.frameOneLegacy;
      if(!bridge) throw new Error('Learning engine is not ready yet.');
      if (!window.confirm('Restore this backup? It will replace the learning progress, practice notes and storyboard currently saved in this browser.')) {
        setMessage('Restore cancelled. Your current learning data is unchanged.');
        return;
      }
      bridge.importBackup(json); // strict original v0.8B validation
      setMessage('Learning backup restored in this browser.');
      onRestored();
    } catch(err) {
      setMessage(`Could not restore: ${err instanceof Error ? err.message : 'Invalid backup'}`);
    }
  };
  return <details className="backup-panel">
    <summary>Keep a copy of your learning <span>Save / restore locally</span></summary>
    <p>A different browser or app address can have separate saved data. Export your progress and storyboard before switching devices or versions.</p>
    <div className="backup-actions">
      <button className="btn-secondary" type="button" onClick={()=>{ try{if(!window.frameOneLegacy) throw new Error('Learning engine not ready');window.frameOneLegacy.exportBackup();setMessage('Backup download prepared.');}catch{setMessage('Backup download is unavailable here.');}}}>Download learning backup</button>
      <button className="btn-secondary" type="button" onClick={()=>fileRef.current?.click()}>Restore a backup JSON file</button>
      <input ref={fileRef} className="sr-only" type="file" accept=".json,application/json" onChange={onFile} aria-label="Choose a Frame One backup JSON" />
    </div>
    <p className="backup-status" role="status">{message}</p>
    <small>Includes private practice notes and storyboard. Restoring replaces currently saved work. No upload or online account is involved.</small>
  </details>;
}

export function LearnView() {
  const [filter,setFilter] = useState('All');
  const [query,setQuery] = useState('');
  const [glossaryQuery,setGlossaryQuery] = useState('');
  const [revision,setRevision] = useState(0);
  // Keep the course approachable on narrow screens: open only one chapter at a time.
  const [expandedChapters,setExpandedChapters] = useState<Set<number>>(()=>new Set([0]));
  // Read on render: completed lessons are stored in the same original progress key.
  const completed = safeProgress(ids);
  const completedCount=completed.size;
  const percent=Math.round(completedCount/lessons.length*100);
  const next=lessons.find(l=>!completed.has(l.id))??lessons[0];
  const filtered = useMemo(()=>lessons.filter(l=>(filter==='All'||l.unit===filter) && `${l.title} ${l.subtitle} ${l.unit}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())),[filter,query]);
  const matchedGlossary = useMemo(()=>glossary.filter(t=>`${t.term} ${t.te} ${t.meaning}`.toLocaleLowerCase().includes(glossaryQuery.trim().toLocaleLowerCase())),[glossaryQuery]);
  const searched = query.trim()!==''||filter!=='All';
  return <div className="page react-learn-view" data-revision={revision}>
    <div className="page-intro"><div className="eyebrow">YOUR LEARNING JOURNEY</div><h1>Every great film starts with curiosity.</h1><p>33 beginner lessons in six chapters. Explore in any order, or follow a simple path.</p></div>
    <div className="journey-summary" aria-label={`${completedCount} of ${lessons.length} lessons finished`}>
      <div><small>YOUR LEARNING PROGRESS</small><strong>{completedCount} <span>/ {lessons.length} lessons</span></strong></div>
      <div className="journey-meter" role="progressbar" aria-label="Completed lessons" aria-valuenow={completedCount} aria-valuemin={0} aria-valuemax={lessons.length}><div style={{width:`${percent}%`}} /></div>
      <button className="cta" type="button" onClick={()=>navigate('lesson',next.id)}>{completedCount===lessons.length?'Revisit first lesson':'Continue learning'} →</button>
    </div>
    <div className="search-row"><label className="sr-only" htmlFor="reactLessonSearch">Search lessons</label><input className="learn-search" id="reactLessonSearch" type="search" placeholder="Search: frames, sound, dialogue..." value={query} onChange={e=>setQuery(e.target.value)} /><small>{filtered.length} of {lessons.length} lessons</small></div>
    <div className="filter-row" aria-label="Filter lessons by chapter topic">{filters.map(c=><button type="button" className="filter-chip" key={c} aria-pressed={filter===c} onClick={()=>setFilter(c)}>{c}</button>)}</div>
    {searched ? <div className="list-grid" aria-live="polite">{filtered.length ? filtered.map(l=><LessonRow key={l.id} lesson={l} completed={completed.has(l.id)}/>) : <p className="empty">No matching lessons. Try another word or choose All.</p>}</div>
    : <div className="chapter-list">{chapters.map((c,i)=>{
      const count=c.ids.filter(id=>completed.has(id)).length;
      return <section key={c.name} className="chapter-panel" aria-labelledby={`reactChapter${i}`}>
        <div className="chapter-head"><div className="chapter-number">{String(i+1).padStart(2,'0')}</div><div><span className="eyebrow-secondary">CHAPTER {i+1} · {count}/{c.ids.length} COMPLETE</span><h2 id={`reactChapter${i}`}>{c.name.replace(/^\d+\s*[·.\-]\s*/, '')}</h2><p>{c.strap}</p></div><div className="chapter-meter" role="progressbar" aria-label={`Chapter ${i+1} lessons finished`} aria-valuenow={count} aria-valuemin={0} aria-valuemax={c.ids.length}><div style={{width:`${Math.round(count/c.ids.length*100)}%`}} /></div></div>
        <button className="chapter-mobile-toggle" type="button" aria-expanded={expandedChapters.has(i)} aria-controls={`chapterLessons${i}`} onClick={()=>setExpandedChapters(previous=>new Set(previous.has(i)?[]:[i]))}>
          <span>{expandedChapters.has(i)?'Hide lessons':`Explore ${c.ids.length} lessons`}</span>
          <span aria-hidden="true">{expandedChapters.has(i)?'−':'+'}</span>
        </button>
        <div id={`chapterLessons${i}`} className={`chapter-body ${expandedChapters.has(i)?'is-expanded':''}`}>
          <div className="chapter-lessons">{c.ids.map(id=>byId.get(id)).filter((l):l is Lesson=>Boolean(l)).map(l=><LessonRow key={l.id} lesson={l} completed={completed.has(l.id)}/>)}</div>
          {c.later.length ? <details className="coming-chapters"><summary>Future topics · {c.later.length}</summary><div>{c.later.map(x=><span key={x}>{x}</span>)}</div></details> : <div className="chapter-finished">✓ All lessons in this chapter are available</div>}
        </div>
      </section>;
    })}</div>}
    <LearningBackup onRestored={()=>setRevision(n=>n+1)}/>
    <details className="glossary-block"><summary>Film words, explained simply <span>{glossary.length} terms · English + తెలుగు</span></summary>
      <div className="glossary-search"><label className="sr-only" htmlFor="reactGlossarySearch">Search glossary</label><input className="learn-search" id="reactGlossarySearch" type="search" value={glossaryQuery} onChange={e=>setGlossaryQuery(e.target.value)} placeholder="Find a film word..." /></div>
      <div className="glossary-grid" aria-live="polite">{matchedGlossary.length ? matchedGlossary.map(g=><div className="glossary-entry" key={g.term}><div><strong>{g.term}</strong><span lang="te">{g.te}</span></div><p>{g.meaning}</p></div>) : <p className="empty">No matching film words.</p>}</div>
    </details>
  </div>;
}
