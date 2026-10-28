import {useRef} from 'react';
import curriculum from '../data/curriculum.v08b.json';
import {cinemaShelves,type CinemaEntry,type CinemaShelf} from '../data/cinema-library';
import type {Lesson} from '../data/schema';
import {navigate,openLab} from '../legacy/bridge';
import {safeProgress} from '../state/learning';
import {CinemaArtwork} from './CinemaArtwork';
import './cinema-library.css';

const lessons=curriculum.lessons as unknown as Lesson[];
const byId=new Map(lessons.map(lesson=>[lesson.id,lesson]));
const lessonIds=lessons.map(lesson=>lesson.id);

function openEntry(entry:CinemaEntry){
  switch(entry.kind){
    case 'lesson': navigate('lesson',entry.id);break;
    case 'lab': openLab(entry.id);break;
    case 'roles': navigate('crafts');break;
  }
}
function CinemaTile({entry,completed}:{entry:CinemaEntry;completed:ReadonlySet<string>}){
  const lesson=entry.kind==='lesson'?byId.get(entry.id):undefined;
  if(entry.kind==='lesson'&&!lesson)return null;
  const title=lesson?.title??(entry.kind==='lesson'?'':entry.title);
  const category=entry.kind==='lesson'?'LESSON':entry.kind==='lab'?'INTERACTIVE LAB':'FILM ROLES';
  const duration=lesson?lesson.minutes+' MIN':'';
  const isDone=entry.kind==='lesson'&&completed.has(entry.id);
  return <button type="button" className="cinema-tile"
    data-cinema-entry={entry.kind+':'+entry.id}
    aria-label={title+(isDone?', completed':'')+', '+category.toLowerCase()}
    onClick={()=>openEntry(entry)}>
    <span className="cinema-tile-art">
      <CinemaArtwork art={entry.art}/>
      {isDone?<span className="cinema-tile-check" aria-hidden="true">✓</span>:null}
    </span>
    <span className="cinema-tile-type">{category}{duration?' · '+duration:''}</span>
    <span className="cinema-tile-name">{title}</span>
    <span className="cinema-tile-action">{isDone?'Revisit':'Explore'} <span aria-hidden="true">↗</span></span>
  </button>;
}
function CinemaShelfRow({shelf,completed}:{shelf:CinemaShelf;completed:ReadonlySet<string>}){
  const scrollRef=useRef<HTMLDivElement>(null);
  function scroll(direction:number){
    const rail=scrollRef.current;
    if(!rail)return;
    rail.scrollBy({left:direction*Math.max(160,rail.clientWidth*.78),
      behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  return <section className="cinema-shelf" aria-labelledby={'cinema-heading-'+shelf.id}
    data-cinema-shelf={shelf.id}>
    <header className="cinema-shelf-header">
      <div className="cinema-shelf-title">
        <h2 id={'cinema-heading-'+shelf.id}>{shelf.heading}</h2>
        <p>{shelf.introduction}</p>
      </div>
      <div className="cinema-rail-controls" aria-label={'Scroll '+shelf.heading}>
        <button type="button" aria-label={'Previous in '+shelf.heading}
          onClick={()=>scroll(-1)}>←</button>
        <button type="button" aria-label={'Next in '+shelf.heading}
          onClick={()=>scroll(1)}>→</button>
      </div>
    </header>
    <div className="cinema-rail" ref={scrollRef} role="group"
      aria-label={shelf.heading+' titles'} tabIndex={0}>
      {shelf.entries.map(entry=><CinemaTile key={entry.kind+':'+entry.id}
        entry={entry} completed={completed}/>)}
    </div>
  </section>;
}

/** First v0.11 discovery layer: fast native-scroll shelves, no remote images.
 * Original legacy hero, private photo wall, full Learn syllabus and 7 Labs remain.
 */
export function CinemaLibraryHome(){
  const completed=safeProgress(lessonIds);
  const next=lessons.find(lesson=>!completed.has(lesson.id))??lessons[0];
  return <div className="cinema-discovery" aria-label="Explore the cinema library">
    {completed.size>0?<section className="cinema-continue" aria-label="Continue your learning">
      <div className="cinema-continue-copy">
        <span className="cinema-overline">CONTINUE YOUR JOURNEY · {completed.size}/{lessons.length}</span>
        <h2>{completed.size===lessons.length?'Revisit the beginning':next.title}</h2>
        <p>{next.subtitle}</p>
      </div>
      <button className="cinema-continue-button" type="button"
        data-cinema-continue={next.id}
        onClick={()=>navigate('lesson',next.id)}>
        {completed.size===lessons.length?'Revisit lesson':'Continue learning'} <span aria-hidden="true">→</span>
      </button>
    </section>:null}
    <div className="cinema-library-intro">
      <span className="cinema-overline">THE CINEMA LIBRARY</span>
      <h2>Follow your curiosity.</h2>
      <p>Short lessons, visual ideas and hands-on experiments—choose where to begin.</p>
    </div>
    {cinemaShelves.map(shelf=><CinemaShelfRow key={shelf.id} shelf={shelf} completed={completed}/>)}
    <section className="cinema-explore-more" aria-label="Explore more learning">
      <div>
        <span className="cinema-overline">KEEP DISCOVERING</span>
        <h2>There is more to the story.</h2>
        <p>Explore the full course in order, or meet the people who bring a film to life.</p>
      </div>
      <div className="cinema-more-actions">
        <button type="button" onClick={()=>navigate('learn')}>All 33 lessons <span aria-hidden="true">→</span></button>
        <button type="button" onClick={()=>navigate('crafts')}>Meet film roles <span aria-hidden="true">→</span></button>
      </div>
    </section>
  </div>;
}
