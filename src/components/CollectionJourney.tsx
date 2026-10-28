import curriculum from '../data/curriculum.v08b.json';
import type {Lesson} from '../data/schema';
import {cinemaShelves,type CinemaEntry} from '../data/cinema-library';
import {seriesById,actAtIndex,type FilmAct} from '../data/cinema-series';
import {navigate,openLab} from '../legacy/bridge';
import {safeProgress} from '../state/learning';
import {CinemaArtwork} from './CinemaArtwork';
import './collection-journey.css';

const lessons=curriculum.lessons as unknown as Lesson[];
const byId=new Map(lessons.map(item=>[item.id,item]));
const allIds=lessons.map(item=>item.id);

function enter(entry:CinemaEntry):void{
  if(entry.kind==='lesson')navigate('lesson',entry.id);
  if(entry.kind==='lab')openLab(entry.id);
  if(entry.kind==='roles')navigate('crafts');
}
function detail(entry:CinemaEntry){
  const lesson=entry.kind==='lesson'?byId.get(entry.id):undefined;
  const title=lesson?.title??(entry.kind==='lesson'?'':entry.title);
  const subtitle=lesson?.subtitle??(entry.kind==='lesson'?'':entry.subtitle);
  const label=entry.kind==='lesson'?'LESSON':entry.kind==='lab'?'INTERACTIVE LAB':'FILM ROLES';
  return {title,subtitle,label,minutes:lesson?.minutes};
}
function JourneyEntry({entry,index,finished,isNext}:{
  entry:CinemaEntry;index:number;finished:boolean;isNext:boolean
}){
  const info=detail(entry);
  return <button type="button"
    className={'collection-entry'+(finished?' is-completed':'')+(isNext?' is-next':'')}
    key={entry.kind+':'+entry.id} data-collection-entry={entry.kind+':'+entry.id}
    onClick={()=>enter(entry)}>
    <span className="collection-entry-number">{String(index+1).padStart(2,'0')}</span>
    <span className="collection-entry-art"><CinemaArtwork art={entry.art} artId={entry.id}/></span>
    <span className="collection-entry-copy">
      <span className="cinema-overline">{info.label}{info.minutes?' · '+info.minutes+' MIN':''}</span>
      <strong>{info.title}</strong>
      <span className="collection-entry-description">{info.subtitle}</span>
      {finished?<span className="collection-complete">✓ Lesson completed</span>:
        isNext?<span className="collection-next-label">UP NEXT</span>:null}
    </span>
    <span className="collection-entry-arrow" aria-hidden="true">↗</span>
  </button>;
}

function SeriesAct({act,actIndex,entries,startIndex,completed,next}:{
  act:FilmAct;actIndex:number;entries:readonly CinemaEntry[];
  startIndex:number;completed:ReadonlySet<string>;next:CinemaEntry;
}){
  const actLessons=entries.filter(entry=>entry.kind==='lesson');
  const done=actLessons.filter(entry=>completed.has(entry.id)).length;
  const hasTracked=actLessons.length>0;
  return <section className="collection-act" data-collection-act={actIndex+1}
    aria-labelledby={'collectionAct'+actIndex}>
    <div className="collection-act-intro">
      <span className="collection-act-index" aria-hidden="true">{String(actIndex+1).padStart(2,'0')}</span>
      <div className="collection-act-story">
        <span className="cinema-overline">ACT {String(actIndex+1).padStart(2,'0')} OF 03</span>
        <h3 id={'collectionAct'+actIndex}>{act.title}</h3>
        <p>{act.cue}</p>
      </div>
      <span className="collection-act-state">{hasTracked?done+'/'+actLessons.length+' LESSONS':'EXPLORE'}</span>
    </div>
    <div className="collection-entries">
      {entries.map((entry,i)=><JourneyEntry key={entry.kind+':'+entry.id}
        entry={entry} index={startIndex+i}
        finished={entry.kind==='lesson'&&completed.has(entry.id)}
        isNext={next.kind===entry.kind&&next.id===entry.id}/>)}
    </div>
    <p className="collection-act-reflection"><span>AFTER THE ACT</span> {act.reflection}</p>
  </section>;
}

/** Guided editorial series: existing progress and lessons only; no new storage. */
export function CollectionJourney({collectionId}:{collectionId:string}){
  const shelf=cinemaShelves.find(item=>item.id===collectionId);
  const series=seriesById(collectionId);
  const completed=safeProgress(allIds);
  if(!shelf||!series)return <div className="page collection-view">
    <h1>Collection unavailable</h1>
    <button className="collection-back" type="button" onClick={()=>navigate('home')}>Return to cinema library</button>
  </div>;
  const lessonEntries=shelf.entries.filter((entry):entry is Extract<CinemaEntry,{kind:'lesson'}>=>entry.kind==='lesson');
  const lessonDone=lessonEntries.filter(entry=>completed.has(entry.id)).length;
  const allDone=lessonEntries.length>0 && lessonDone===lessonEntries.length;
  const percent=lessonEntries.length?Math.round(100*lessonDone/lessonEntries.length):null;
  const totalTime=lessonEntries.reduce((sum,entry)=>sum+(byId.get(entry.id)?.minutes??0),0);
  const hasActivities=shelf.entries.some(entry=>entry.kind!=='lesson');
  const next=lessonEntries.find(entry=>!completed.has(entry.id))??shelf.entries[0];
  const primary=next?detail(next):null;
  const nextIndex=shelf.entries.findIndex(entry=>entry.kind===next.kind&&entry.id===next.id);
  let actOffset=0;
  return <div className="page collection-view" data-collection-view={shelf.id}>
    <button className="collection-back" type="button" onClick={()=>window.frameOneLegacy?.goBack()}>
      <span aria-hidden="true">←</span> Cinema Library
    </button>
    <section className="collection-feature" aria-labelledby="collectionTitle">
      <div className="collection-feature-copy">
        <span className="cinema-overline">FRAME ONE ORIGINAL SERIES · {String(cinemaShelves.indexOf(shelf)+1).padStart(2,'0')}</span>
        <h1 id="collectionTitle">{shelf.heading}</h1>
        <p>{shelf.introduction}</p>
        <div className="collection-summary">
          <span>{shelf.entries.length} experiences</span>
          {totalTime>0?<span>{totalTime} min of lessons</span>:null}
          {lessonEntries.length>0?<span>{lessonDone}/{lessonEntries.length} lessons complete</span>:<span>Hands-on · progress not tracked</span>}
        </div>
        {primary?<button className="collection-primary" type="button" onClick={()=>enter(next)}>
          {allDone?'Revisit the journey':lessonEntries.length===0?'Try the first experiment':lessonDone>0?'Continue this journey':'Begin this journey'}
          <span aria-hidden="true">→</span>
        </button>:null}
      </div>
      <div className="collection-feature-art">
        <CinemaArtwork art={shelf.entries[0].art} artId={shelf.id}/>
      </div>
    </section>
    <section className="collection-invitation" aria-label="A note before this journey">
      <span className="cinema-overline">BEFORE THE FIRST FRAME</span>
      <p>{series.invitation}</p>
    </section>
    {percent!==null?<section className="collection-progress" aria-label="Collection learning progress">
      <div className="collection-progress-line">
        <span>{allDone?'You completed these lessons':'YOUR PROGRESS'}</span>
        <strong>{percent}%</strong>
      </div>
      <div className="collection-progress-track" role="progressbar"
        aria-label="Lessons completed in this collection" aria-valuemin={0}
        aria-valuemax={lessonEntries.length} aria-valuenow={lessonDone}>
        <span style={{width:percent+'%'}}/>
      </div>
      <p>{hasActivities?'Only finished lessons count. Experiments and roles are for exploration, not scores.':'Lesson completion stays in sync with your existing learning progress.'}</p>
    </section>:<div className="collection-no-progress">An open creative studio. Experiments are for discovery, not scores.</div>}
    <section className="collection-chapters" aria-label={'Explore '+shelf.heading}>
      <div className="collection-list-intro">
        <div>
          <span className="cinema-overline">THREE ACTS · ONE JOURNEY</span>
          <h2>Watch how the ideas connect.</h2>
        </div>
        <span>{shelf.entries.length} parts</span>
      </div>
      {series.acts.map((act,index)=>{
        const from=actOffset;actOffset+=act.count;
        const items=shelf.entries.slice(from,actOffset);
        return <SeriesAct key={index} act={act} actIndex={index}
          entries={items} startIndex={from} completed={completed} next={next}/>;
      })}
    </section>
    <section className="collection-finale" aria-label="After the last act">
      <span className="cinema-overline">THE FINAL FRAME</span>
      <p>{series.closing}</p>
    </section>
    <section className="collection-end">
      <span className="cinema-overline">EXPLORE BEYOND THIS COLLECTION</span>
      <h2>Every frame leads somewhere.</h2>
      <button type="button" onClick={()=>navigate('home')}>Browse other collections <span aria-hidden="true">→</span></button>
      <button type="button" onClick={()=>navigate('learn')}>Full learning syllabus <span aria-hidden="true">→</span></button>
    </section>
  </div>;
}
