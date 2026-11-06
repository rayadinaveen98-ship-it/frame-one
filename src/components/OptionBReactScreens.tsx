import {createPortal} from 'react-dom';
import {useEffect,useRef,useState} from 'react';
import approvedStyles from './option-b-react-design.css?raw';
import {OptionBReactMission} from './OptionBReactMission';
import {OptionBReactLab} from './OptionBReactLab';
import {FOUNDATIONS,FOUNDATION_IDS} from '../data/foundations-guided';
import {STORYTELLING,STORYTELLING_IDS} from '../data/storytelling-guided';
import {VISUAL_LANGUAGE,VISUAL_IDS} from '../data/visual-language-guided';
import {SOUND_EDITING,SOUND_EDIT_IDS} from '../data/sound-edit-guided';
import {PEOPLE_BEHIND_FILM,PEOPLE_IDS} from '../data/people-guided';
import {FIRST_FILM,FIRST_FILM_IDS} from '../data/first-film-guided';
import {safeProgress} from '../state/learning';
import {OptionBFoundationMission} from './OptionBFoundationMission';
import {OptionBRealLabs} from './OptionBRealLabs';
import type {LabName} from '../legacy/bridge';

/** The same six story prompts and node identities in the approved Option B prototype. */
type MissionIcon='eye'|'frame'|'clapper'|'sun'|'sound'|'film';
type IconName=MissionIcon|'home'|'map'|'lab'|'progress'|'check'|'arrow';
type PilotMission={id:string;title:string;short:string;type:MissionIcon;desc:string};
const MISSIONS:readonly PilotMission[]=[
  {id:'see',title:'See the story',short:'See the story',type:'eye',desc:'Learn what a single image can reveal.'},
  {id:'frame',title:'Choose the frame',short:'Choose a frame',type:'frame',desc:'Change a shot to change what we see.'},
  {id:'story',title:'Find the turning point',short:'Direct the moment',type:'clapper',desc:'Give one simple moment a story purpose.'},
  {id:'light',title:'Shape the light',short:'Light the scene',type:'sun',desc:'See how direction and colour shift the frame.'},
  {id:'sound',title:'Hear the unseen',short:'Hear the place',type:'sound',desc:'Use imagined ambience to extend the frame.'},
  {id:'project',title:'Make your scene',short:'Your first scene',type:'film',desc:'Plan and compare a small moment.'}
];
const PROTOTYPE_KEY='frameone-option-b-prototype-v1';
type SavedDemo={finished:string[];points:number;shots:number};
function saveCompletedMission(id:string):SavedDemo{
  const prior=readDemo();
  if(prior.finished.includes(id))return prior;
  const next={...prior,finished:[...prior.finished,id],points:prior.points+20};
  try{
    const raw=JSON.parse(localStorage.getItem(PROTOTYPE_KEY)||'{}') as Record<string,unknown>;
    localStorage.setItem(PROTOTYPE_KEY,JSON.stringify({...raw,...next}));
  }catch{/* Demo still completes within this session if private storage is denied. */}
  return next;
}
function saveLabIdea():SavedDemo{
  const prior=readDemo();
  const next={...prior,points:prior.points+5,shots:prior.shots+1};
  try{
    const raw=JSON.parse(localStorage.getItem(PROTOTYPE_KEY)||'{}') as Record<string,unknown>;
    localStorage.setItem(PROTOTYPE_KEY,JSON.stringify({...raw,...next}));
  }catch{/* A restricted browser still shows this session's demo count. */}
  return next;
}
function resetDemo():SavedDemo{
  const next:SavedDemo={finished:[],points:0,shots:0};
  try{localStorage.setItem(PROTOTYPE_KEY,JSON.stringify(next))}
  catch{/* Local storage unavailable, but no real user data is touched. */}
  return next;
}
function readDemo():SavedDemo{
  try{
    const raw=JSON.parse(localStorage.getItem(PROTOTYPE_KEY)||'{}') as Record<string,unknown>;
    const finished=Array.isArray(raw.finished)
      ? raw.finished.filter((id:unknown):id is string=>typeof id==='string'&&MISSIONS.some(m=>m.id===id))
      : [];
    return {finished,points:Math.max(0,Number(raw.points)||0),shots:Math.max(0,Number(raw.shots)||0)};
  }catch{return {finished:[],points:0,shots:0};}
}

function Icon({name,className='glyph'}:{name:IconName;className?:string}){
  const parts:Record<IconName,React.ReactNode>={
    home:<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>,
    map:<><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16"/></>,
    lab:<path d="M9 3h6M10 3v6l-6 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-9V3M7 16h10"/>,
    progress:<path d="M4 21V12m6 9V7m6 14V3m6 18H2"/>,
    eye:<><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
    frame:<path d="M3 8V3h5M16 3h5v5M3 16v5h5M16 21h5v-5M8 8h8v8H8z"/>,
    clapper:<path d="M3 10h18v11H3zM3 7l17-4 2 5-18 4zM7 6l3 4M14 5l3 4"/>,
    sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2m-17-7 2 2m10 10 2 2M19 5l-2 2M7 17l-2 2"/></>,
    sound:<path d="M3 9v6h4l5 4V5L7 9Zm13-2q5 5 0 10m2-14q9 9 0 18"/>,
    film:<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16m10-16v16M3 9h4m-4 6h4m10-6h4m-4 6h4"/></>,
    check:<path d="m5 12 5 5L20 7"/>,
    arrow:<path d="M5 12h14m-6-6 6 6-6 6"/>
  };
  return <svg className={className} aria-hidden="true" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{parts[name]}</svg>;
}
const ART_WORLD='./option-b-assets/world.svg';
const ART_SCENE='./option-b-assets/scene.svg';

function FloatingCamera(){
  return <div className="floating-scene" aria-hidden="true">
    <svg viewBox="0 0 150 150">
      <ellipse cx="78" cy="127" rx="57" ry="12" fill="#1d79666c"/>
      <path d="M64 68L45 134M78 65L85 134M89 70L125 133" stroke="#39566d" strokeWidth="9" strokeLinecap="round"/>
      <rect x="39" y="34" width="75" height="52" rx="13" fill="#2a5568" stroke="#d5f4da" strokeWidth="5"/>
      <circle cx="75" cy="60" r="22" fill="#17394d" stroke="#a3e6dd" strokeWidth="5"/>
      <circle cx="75" cy="60" r="10" fill="#5cb8b7"/>
      <rect x="107" y="46" width="33" height="22" rx="6" fill="#31566b"/>
      <circle cx="55" cy="28" r="15" fill="#e6b66f"/>
      <path d="M43 28V11L57 9L69 23Z" fill="#f6d57b"/>
      <path d="M42 26h29" stroke="#705548" strokeWidth="4"/>
    </svg>
  </div>;
}
function HomeScreen({finished,onMission,onScreen,onStartReal}:{ 
  finished:string[];onMission:(id:string)=>void;onScreen:(screen:'journey'|'lab')=>void;
  onStartReal:()=>void;
}){
  const next=MISSIONS.find(m=>!finished.includes(m.id))||MISSIONS[0];
  const done=finished.length;
  return <div className="screen" data-v2-native-screen="home">
    <div className="home-hero">
      <img className="hero-world" src={ART_WORLD} alt=""/>
      <div className="home-hero-copy">
        <span className="chip">✦ YOUR FILMMAKING ADVENTURE</span>
        <h1>Every great film starts somewhere.</h1>
        <p>Learn to see, shoot and tell stories—one small mission at a time.</p>
      </div>
      <FloatingCamera/>
    </div>
    <div className="home-body">
      <section className="continue-card" aria-labelledby="native-continue-title">
        <div className="continue-header">
          <span className="eyebrow">{done===6?'ALL MISSIONS COMPLETE':'PICK UP YOUR CAMERA'}</span>
          <span className="mission-badge">ACT 01 · MISSION {String(MISSIONS.indexOf(next)+1).padStart(2,'0')}</span>
        </div>
        <h2 id="native-continue-title">{done===6?'Your story continues.':next.title}</h2>
        <p>{done===6?'Revisit any mission or direct another version in the Lab.':next.desc+' Your first film is made one choice at a time.'}</p>
        <div className="track" aria-label={done+' of 6 missions complete'}><span style={{width:(done/6*100)+'%'}}/></div>
        <div className="progress-caption"><span>{done} of 6 missions finished</span><b>{Math.round(done/6*100)}% complete</b></div>
        <button type="button" className="btn btn-primary btn-wide" data-v2-native-next onClick={()=>onMission(next.id)}>
          {done===6?'Revisit the journey':'Start this mission'} <Icon name="arrow" className="node-icon"/>
        </button>
      </section>
      <div className="section-heading">
        <div><span className="eyebrow">YOUR CREATIVE WORLD</span><h2>Where to next?</h2></div>
        <button type="button" className="link-button" onClick={()=>onScreen('journey')}>Explore path →</button>
      </div>
      <div className="home-cards">
        <button type="button" className="home-mini" onClick={()=>onScreen('journey')}>
          <span className="mini-illustration"><img src={ART_WORLD} alt=""/></span>
          <span className="mini-copy"><strong>The journey ↗</strong><small>Six creative missions</small></span>
        </button>
        <button type="button" className="home-mini" onClick={()=>onScreen('lab')}>
          <span className="mini-illustration"><img src={ART_SCENE} alt=""/></span>
          <span className="mini-copy"><strong>Director's Lab ↗</strong><small>Experiment with a frame</small></span>
        </button>
      </div>
      <section className="foundation-launch" aria-label="Learn the real first chapter">
        <span className="eyebrow">YOUR ACTUAL FILMMAKING COURSE</span>
        <h2>Discover cinema, for real.</h2>
        <p>Five guided missions from the existing Frame One syllabus. Your original lesson progress and notes are recognised.</p>
        <button type="button" className="btn btn-primary btn-wide"
          data-v2-open-foundations onClick={onStartReal}>
          Start real Chapter 1 <Icon name="arrow" className="node-icon"/>
        </button>
      </section>
    </div>
  </div>;
}
const NODE_COORDS:[[number,number],[number,number],[number,number],[number,number],[number,number],[number,number]]=
  [[39,12],[70,26],[31,42],[72,57],[34,73],[69,88]];
function JourneyScreen({finished,onMission}:{finished:string[];onMission:(id:string)=>void}){
  const upcoming=MISSIONS.find(m=>!finished.includes(m.id))?.id||MISSIONS[0].id;
  return <div className="screen" data-v2-native-screen="journey">
    <div className="journey-intro">
      <span className="eyebrow">THE PATH TO YOUR FIRST FILM</span>
      <h1>The language of cinema</h1>
      <p>Each stop teaches a decision real filmmakers make. Explore freely, then put it into practice.</p>
      <div className="journey-summary"><span className="chapter-badge">✦ CHAPTER 01 · FOUNDATIONS</span><span className="journey-progress-inline">{finished.length}/6 missions</span></div>
    </div>
    <div className="land-map">
      <img src={ART_WORLD} alt="A winding path through an illustrated valley"/>
      <div className="chapter-pillar">CHAPTER 01 · THE JOURNEY</div>
      {MISSIONS.map((m,i)=>{
        const isDone=finished.includes(m.id),isActive=m.id===upcoming;
        return <button key={m.id} type="button"
          className={'journey-node '+(isDone?'complete':isActive?'active':'future')}
          data-v2-native-mission={m.id}
          style={{left:NODE_COORDS[i][0]+'%',top:NODE_COORDS[i][1]+'%'}}
          aria-label={m.title+', '+(isDone?'completed':isActive?'next mission':'available to explore')}
          onClick={()=>onMission(m.id)}>
          <span className="node-button">
            <Icon name={isDone?'check':m.type} className="node-icon"/>
            <span className="node-number">{i+1}</span>
          </span>
          <span className="node-label">{m.short}</span>
        </button>;
      })}
      <div className="map-footer"><span className="map-icon">🎞️</span><span>Tap any mission to explore. Completed stops stay open for practice.</span></div>
    </div>
  </div>;
}
const FOUNDATION_NODE_POSITIONS:[[number,number],[number,number],[number,number],[number,number],[number,number]]=
 [[39,13],[70,30],[31,48],[72,66],[34,83]];
function FoundationJourney({completed,onMission,onExit,onNext}:{
  completed:Set<string>;onMission:(id:string)=>void;onExit:()=>void;onNext:()=>void;
}){
  const next=FOUNDATIONS.find(m=>!completed.has(m.id))?.id??FOUNDATIONS[0].id;
  return <div className="screen" data-v2-foundation-screen="journey">
    <div className="journey-intro">
      <button type="button" className="foundation-return" data-v2-foundation-back onClick={onExit}>← Back to design prototype</button>
      <span className="eyebrow">THE REAL FRAME ONE CURRICULUM</span>
      <h1>Discover cinema.</h1>
      <p>Five short missions from Chapter 1. Learn a concept, make a creative choice and pass a knowledge check.</p>
      <div className="journey-summary">
        <span className="chapter-badge">✦ CHAPTER 01 · FOUNDATIONS</span>
        <span className="journey-progress-inline">{FOUNDATIONS.filter(m=>completed.has(m.id)).length}/5 real lessons</span>
      </div>
    </div>
    <div className="land-map">
      <img src={ART_WORLD} alt="Illustrated winding journey through a green valley"/>
      <div className="chapter-pillar">REAL CHAPTER 01 · DISCOVER CINEMA</div>
      {FOUNDATIONS.map((mission,i)=>{
        const done=completed.has(mission.id),active=mission.id===next;
        const icons:MissionIcon[]=['eye','film','frame','clapper','sun'];
        return <button type="button" key={mission.id}
          className={'journey-node '+(done?'complete':active?'active':'future')}
          data-v2-foundation-node={mission.id}
          style={{left:FOUNDATION_NODE_POSITIONS[i][0]+'%',top:FOUNDATION_NODE_POSITIONS[i][1]+'%'}}
          aria-label={mission.lesson.title+', '+(done?'completed':'ready to explore')}
          onClick={()=>onMission(mission.id)}>
          <span className="node-button">
            <Icon name={done?'check':icons[i]} className="node-icon"/>
            <span className="node-number">{i+1}</span>
          </span>
          <span className="node-label">{mission.lesson.title}</span>
        </button>;
      })}
      <div className="map-footer"><span className="map-icon" aria-hidden="true">🎞️</span><span>All lessons remain accessible. Existing completions are recognised.</span></div>
    </div>
    <section className="foundation-launch" aria-label="Continue to real Chapter 2">
      <span className="eyebrow">NEXT · CHAPTER 02</span>
      <h2>Tell a human story.</h2>
      <p>Six more real lessons: story, script, acting, character, dialogue and visual storytelling. Your Chapter 1 progress stays intact.</p>
      <button type="button" className="btn btn-primary btn-wide" data-v2-story-open onClick={onNext}>
        Explore real Chapter 2 <Icon name="arrow" className="node-icon"/>
      </button>
    </section>
  </div>;
}
function StorytellingJourney({completed,onMission,onExit,onNext}:{
  completed:Set<string>;onMission:(id:string)=>void;onExit:()=>void;onNext:()=>void;
}){
  const next=STORYTELLING.find(m=>!completed.has(m.id))?.id??STORYTELLING[0].id;
  const icons:MissionIcon[]=['eye','clapper','film','frame','sound','eye'];
  const nodeLabels=['Story emotion','Screenplay','Performance','Character choices','Dialogue & subtext','Show the feeling'];
  return <div className="screen" data-v2-story-screen="journey">
    <div className="journey-intro">
      <button type="button" className="foundation-return" data-v2-story-back onClick={onExit}>← Back to Chapter 1</button>
      <span className="eyebrow">THE REAL FRAME ONE CURRICULUM</span>
      <h1>Tell a human story.</h1>
      <p>Six connected missions around one tiny café story. Observe a moment, choose a creative direction, learn the principle and try it yourself.</p>
      <div className="journey-summary"><span className="chapter-badge">✦ CHAPTER 02 · STORYTELLING</span>
        <span className="journey-progress-inline">{STORYTELLING.filter(m=>completed.has(m.id)).length}/6 real lessons</span>
      </div>
    </div>
    <div className="land-map">
      <img src={ART_WORLD} alt="Illustrated winding path through the Frame One learning world"/>
      <div className="chapter-pillar">REAL CHAPTER 02 · TELL A HUMAN STORY</div>
      {STORYTELLING.map((mission,i)=>{
        const done=completed.has(mission.id),active=mission.id===next;
        return <button type="button" key={mission.id}
          className={'journey-node '+(done?'complete':active?'active':'future')}
          data-v2-story-node={mission.id}
          style={{left:NODE_COORDS[i][0]+'%',top:NODE_COORDS[i][1]+'%'}}
          aria-label={mission.lesson.title+', '+(done?'completed':'ready to explore')}
          onClick={()=>onMission(mission.id)}>
          <span className="node-button"><Icon name={done?'check':icons[i]} className="node-icon"/>
            <span className="node-number">{i+1}</span></span>
          <span className="node-label">{nodeLabels[i]}</span>
        </button>;
      })}
      <div className="map-footer"><span className="map-icon" aria-hidden="true">🎞️</span>
        <span>Six story decisions, one original scene. Your course records and notes are preserved.</span>
      </div>
    </div>
    <section className="foundation-launch" aria-label="Continue to real Chapter 3">
      <span className="eyebrow">NEXT · CHAPTER 03</span>
      <h2>Learn visual language.</h2>
      <p>Seven real visual experiments covering shots, camera, light, composition, movement, lenses and colour.</p>
      <button type="button" className="btn btn-primary btn-wide" data-v2-visual-open onClick={onNext}>
        Explore real Chapter 3 <Icon name="arrow" className="node-icon"/>
      </button>
    </section>
  </div>;
}
const VISUAL_NODE_POSITIONS:[number,number][]=[
  [39,10],[70,23],[31,36],[71,49],[34,62],[69,75],[36,88]
];
function VisualJourney({completed,onMission,onExit,onNext}:{
  completed:Set<string>;onMission:(id:string)=>void;onExit:()=>void;onNext:()=>void;
}){
  const next=VISUAL_LANGUAGE.find(m=>!completed.has(m.id))?.id??VISUAL_LANGUAGE[0].id;
  const icons:MissionIcon[]=['frame','eye','sun','frame','film','eye','sun'];
  const nodeLabels=['Choose a shot','Camera position','Shape the light','Composition','Camera movement','Lenses & space','Colour & meaning'];
  return <div className="screen" data-v2-visual-screen="journey">
    <div className="journey-intro">
      <button type="button" className="foundation-return" data-v2-visual-back onClick={onExit}>← Back to Chapter 2</button>
      <span className="eyebrow">THE REAL FRAME ONE CURRICULUM</span>
      <h1>Learn visual language.</h1>
      <p>Seven short filmmaking missions. Make meaningful choices about framing, camera, light, composition, movement, lenses and colour.</p>
      <div className="journey-summary">
        <span className="chapter-badge">✦ CHAPTER 03 · VISUAL LANGUAGE</span>
        <span className="journey-progress-inline">{VISUAL_LANGUAGE.filter(m=>completed.has(m.id)).length}/7 real lessons</span>
      </div>
    </div>
    <div className="land-map" data-v2-visual-map>
      <img src={ART_WORLD} alt="Illustrated winding journey through the Frame One filmmaking world"/>
      <div className="chapter-pillar">REAL CHAPTER 03 · VISUAL LANGUAGE</div>
      {VISUAL_LANGUAGE.map((mission,i)=>{
        const done=completed.has(mission.id),active=mission.id===next;
        return <button key={mission.id} type="button"
          className={'journey-node '+(done?'complete':active?'active':'future')}
          data-v2-visual-node={mission.id}
          style={{left:VISUAL_NODE_POSITIONS[i][0]+'%',top:VISUAL_NODE_POSITIONS[i][1]+'%'}}
          aria-label={mission.lesson.title+', '+(done?'completed':'ready to explore')}
          onClick={()=>onMission(mission.id)}>
          <span className="node-button">
            <Icon name={done?'check':icons[i]} className="node-icon"/>
            <span className="node-number">{i+1}</span>
          </span>
          <span className="node-label">{nodeLabels[i]}</span>
        </button>;
      })}
      <div className="map-footer"><span className="map-icon" aria-hidden="true">🎞️</span>
        <span>Practice with original illustrations, then try filming with your phone.</span>
      </div>
    </div>
    <section className="foundation-launch" aria-label="Continue to real Chapter 4">
      <span className="eyebrow">NEXT · CHAPTER 04</span>
      <h2>Sound and editing.</h2>
      <p>Six interactive sound and editing lessons: soundtrack, shot order, ambience, music, continuity and rhythm.</p>
      <button type="button" className="btn btn-primary btn-wide" data-v2-sound-open onClick={onNext}>
        Explore real Chapter 4 <Icon name="arrow" className="node-icon"/>
      </button>
    </section>
  </div>;
}
function SoundEditingJourney({completed,onMission,onExit,onNext}:{
  completed:Set<string>;onMission:(id:string)=>void;onExit:()=>void;onNext:()=>void;
}){
  const next=SOUND_EDITING.find(m=>!completed.has(m.id))?.id??SOUND_EDITING[0].id;
  const icons:MissionIcon[]=['sound','clapper','sound','film','frame','clapper'];
  const nodeLabels=['Sound changes','The power of a cut','The sound world','Music & meaning','Continuity','Editing rhythm'];
  return <div className="screen" data-v2-sound-screen="journey">
    <div className="journey-intro">
      <button type="button" className="foundation-return" data-v2-sound-back onClick={onExit}>← Back to Chapter 3</button>
      <span className="eyebrow">THE REAL FRAME ONE CURRICULUM</span>
      <h1>Sound and editing.</h1>
      <p>See how sound layers and shot sequences change what an audience notices. Explore original visual studies, then try editing your own work.</p>
      <div className="journey-summary">
        <span className="chapter-badge">✦ CHAPTER 04 · SOUND & EDITING</span>
        <span className="journey-progress-inline">{SOUND_EDITING.filter(m=>completed.has(m.id)).length}/6 real lessons</span>
      </div>
    </div>
    <div className="land-map" data-v2-sound-map>
      <img src={ART_WORLD} alt="Illustrated winding journey through the Frame One learning world"/>
      <div className="chapter-pillar">REAL CHAPTER 04 · SOUND & EDITING</div>
      {SOUND_EDITING.map((mission,i)=>{
        const done=completed.has(mission.id),active=mission.id===next;
        return <button key={mission.id} type="button"
          className={'journey-node '+(done?'complete':active?'active':'future')}
          data-v2-sound-node={mission.id}
          style={{left:NODE_COORDS[i][0]+'%',top:NODE_COORDS[i][1]+'%'}}
          aria-label={mission.lesson.title+', '+(done?'completed':'ready to explore')}
          onClick={()=>onMission(mission.id)}>
          <span className="node-button">
            <Icon name={done?'check':icons[i]} className="node-icon"/>
            <span className="node-number">{i+1}</span>
          </span>
          <span className="node-label">{nodeLabels[i]}</span>
        </button>;
      })}
      <div className="map-footer"><span className="map-icon" aria-hidden="true">🎞️</span>
        <span>Real lessons, original diagrams and practical challenges. No copyrighted audio playback.</span>
      </div>
    </div>
    <section className="foundation-launch" aria-label="Continue to real Chapter 5">
      <span className="eyebrow">NEXT · CHAPTER 05</span>
      <h2>People behind a film.</h2>
      <p>Four guided lessons about film crews, Telugu industry crafts, how departments collaborate, and production stages.</p>
      <button type="button" className="btn btn-primary btn-wide" data-v2-people-open onClick={onNext}>
        Explore real Chapter 5 <Icon name="arrow" className="node-icon"/>
      </button>
    </section>
  </div>;
}
const PEOPLE_NODE_POSITIONS:[number,number][]=[
  [35,14],[70,38],[30,61],[69,84]
];
function PeopleJourney({completed,onMission,onExit,onNext}:{
  completed:Set<string>;onMission:(id:string)=>void;onExit:()=>void;onNext:()=>void;
}){
  const next=PEOPLE_BEHIND_FILM.find(m=>!completed.has(m.id))?.id??PEOPLE_BEHIND_FILM[0].id;
  const icons:MissionIcon[]=['film','clapper','frame','eye'];
  const nodeLabels=['Meet the crew','Telugu 24 crafts','Departments in action','Film workflow'];
  return <div className="screen" data-v2-people-screen="journey">
    <div className="journey-intro">
      <button type="button" className="foundation-return" data-v2-people-back onClick={onExit}>← Back to Chapter 4</button>
      <span className="eyebrow">THE REAL FRAME ONE CURRICULUM</span>
      <h1>People behind a film.</h1>
      <p>Every scene involves choices made by people. Meet the collaborators, understand the Telugu industry term “24 crafts”, and follow a film from idea to audience.</p>
      <div className="journey-summary">
        <span className="chapter-badge">✦ CHAPTER 05 · FILM PEOPLE</span>
        <span className="journey-progress-inline">{PEOPLE_BEHIND_FILM.filter(m=>completed.has(m.id)).length}/4 real lessons</span>
      </div>
    </div>
    <div className="land-map" data-v2-people-map>
      <img src={ART_WORLD} alt="Illustrated winding path through the Frame One creative journey"/>
      <div className="chapter-pillar">REAL CHAPTER 05 · FILM PEOPLE</div>
      {PEOPLE_BEHIND_FILM.map((mission,i)=>{
        const done=completed.has(mission.id),active=mission.id===next;
        return <button type="button" key={mission.id}
          data-v2-people-node={mission.id}
          className={'journey-node '+(done?'complete':active?'active':'future')}
          style={{left:PEOPLE_NODE_POSITIONS[i][0]+'%',top:PEOPLE_NODE_POSITIONS[i][1]+'%'}}
          aria-label={mission.lesson.title+', '+(done?'completed':'ready to explore')}
          onClick={()=>onMission(mission.id)}>
          <span className="node-button">
            <Icon name={done?'check':icons[i]} className="node-icon"/>
            <span className="node-number">{i+1}</span>
          </span>
          <span className="node-label">{nodeLabels[i]}</span>
        </button>;
      })}
      <div className="map-footer"><span className="map-icon" aria-hidden="true">🎞️</span>
        <span>Four original exercises; one reminder that filmmaking is collaborative.</span>
      </div>
    </div>
    <section className="foundation-launch" aria-label="Continue to real Chapter 6">
      <span className="eyebrow">FINAL CHAPTER · 06</span>
      <h2>Make your first film.</h2>
      <p>Five practical missions: keep a film small, plan useful shots, record safely, edit for clarity and learn from feedback.</p>
      <button type="button" className="btn btn-primary btn-wide" data-v2-firstfilm-open onClick={onNext}>
        Explore real Chapter 6 <Icon name="arrow" className="node-icon"/>
      </button>
    </section>
  </div>;
}
const FIRST_FILM_NODE_POSITIONS:[number,number][]=[
  [36,12],[70,30],[32,49],[70,68],[37,86]
];
function FirstFilmJourney({completed,onMission,onExit,onLabs}:{
  completed:Set<string>;onMission:(id:string)=>void;onExit:()=>void;onLabs:()=>void;
}){
  const next=FIRST_FILM.find(m=>!completed.has(m.id))?.id??FIRST_FILM[0].id;
  const icons:MissionIcon[]=['clapper','frame','film','clapper','eye'];
  const nodeLabels=['Choose a film','Plan the shots','Record a scene','Build a first cut','Review & improve'];
  const finished=FIRST_FILM.filter(m=>completed.has(m.id)).length;
  const total=completed.size;
  return <div className="screen" data-v2-firstfilm-screen="journey">
    <div className="journey-intro">
      <button type="button" className="foundation-return" data-v2-firstfilm-back onClick={onExit}>← Back to Chapter 5</button>
      <span className="eyebrow">THE REAL FRAME ONE CURRICULUM</span>
      <h1>Make your first film.</h1>
      <p>Turn what you've learned into one small, finishable idea. Plan, film safely, edit and improve—using your own phone and the tools available to you.</p>
      <div className="journey-summary">
        <span className="chapter-badge">✦ CHAPTER 06 · FIRST FILM</span>
        <span className="journey-progress-inline">{finished}/5 real lessons</span>
      </div>
    </div>
    <div className="land-map" data-v2-firstfilm-map>
      <img src={ART_WORLD} alt="Original illustrated filmmaker journey with winding stepping-stones"/>
      <div className="chapter-pillar">REAL CHAPTER 06 · MAKE YOUR FIRST FILM</div>
      {FIRST_FILM.map((mission,i)=>{
        const done=completed.has(mission.id),active=mission.id===next;
        return <button type="button" key={mission.id}
          className={'journey-node '+(done?'complete':active?'active':'future')}
          data-v2-firstfilm-node={mission.id}
          style={{left:FIRST_FILM_NODE_POSITIONS[i][0]+'%',top:FIRST_FILM_NODE_POSITIONS[i][1]+'%'}}
          aria-label={mission.lesson.title+', '+(done?'completed':'ready to explore')}
          onClick={()=>onMission(mission.id)}>
          <span className="node-button">
            <Icon name={done?'check':icons[i]} className="node-icon"/>
            <span className="node-number">{i+1}</span>
          </span>
          <span className="node-label">{nodeLabels[i]}</span>
        </button>;
      })}
      <div className="map-footer"><span className="map-icon" aria-hidden="true">🎬</span>
        <span>Finish these lessons, then use your own phone to create a real first film.</span>
      </div>
    </div>
    {finished===5&&<section className="foundation-launch" data-v2-firstfilm-course-finished>
      <span className="eyebrow">CHAPTER 06 COMPLETED</span>
      <h2>You're ready to put the lessons to work.</h2>
      <p>You've completed {total} of 33 real Frame One lessons. These exercises prepare you to make a film; they do not claim you've recorded or finished one.</p>
      <p>Choose a small scene, create a shot plan in Make Lab, record safely on your phone, and review the result.</p>
      <button type="button" className="btn btn-primary btn-wide" data-v2-firstfilm-open-labs onClick={onLabs}>Open your seven working Creative Labs</button>
    </section>}
  </div>;
}
function ProgressScreen({saved,onMission,onReset}:{
  saved:SavedDemo;onMission:(id:string)=>void;onReset:()=>void;
}){
  const done=saved.finished.length,percent=Math.round(done/6*100);
  return <div className="screen" data-v2-native-screen="progress">
    <div className="progress-top">
      <span className="eyebrow">YOUR GROWING FILMMAKER SKILLS</span>
      <h1>Look how far you've come.</h1>
      <p>Each experiment helps you recognise a decision you can make on a real shoot.</p>
    </div>
    <section className="progress-card">
      <div className="meter-circle" style={{'--done-angle':(percent*3.6)+'deg'} as React.CSSProperties}
        aria-label={percent+' percent of Chapter One completed'}>
        <div className="inside"><strong>{percent}%</strong><span>CHAPTER ONE</span></div>
      </div>
      <div className="stats">
        <div className="stat"><strong>{done}</strong><span>Missions</span></div>
        <div className="stat"><strong>{saved.points}</strong><span>Points</span></div>
        <div className="stat"><strong>{saved.shots}</strong><span>Lab ideas</span></div>
      </div>
    </section>
    <div className="progress-list">
      <h2>What you've explored</h2>
      {MISSIONS.map(m=><button key={m.id} type="button" className="skill-item"
        data-v2-native-progress-mission={m.id} onClick={()=>onMission(m.id)}>
        <span className="skill-icon"><Icon name={m.type} className="node-icon"/></span>
        <div><strong>{m.title}</strong>
          <small>{saved.finished.includes(m.id)?'Explored · revisit anytime':'Ready to explore'}</small>
        </div>
        <span className="check">{saved.finished.includes(m.id)?'✓':'›'}</span>
      </button>)}
    </div>
    <div className="reset-area">
      <p className="micro">This design prototype stores only demo progress on your device. It does not access Frame One’s existing learning records.</p>
      <button type="button" data-v2-native-reset onClick={onReset}>Reset prototype progress</button>
    </div>
  </div>;
}

const NAV_ITEMS=[['home','Home','home'],['journey','Journey','map'],['lab','Create','lab'],['progress','Progress','progress']] as const;
function ReactScreenShell({onOpenReference,onActive,onNativeComplete,onOpenProductionLab,resumeChapter}:{
  onOpenReference:(screen:string,missionId?:string)=>void;
  onActive:boolean;onNativeComplete:()=>void;
  onOpenProductionLab:(lab:LabName,chapterIndex:number)=>void;
  resumeChapter:number|null;
}){
  // Return from a real production lab to the chapter the learner left.
  // A normal prototype launch still starts on its original Home screen.
  const [screen,setScreen]=useState<'home'|'journey'|'mission'|'lab'|'progress'>(resumeChapter===null?'home':'journey');
  const [realChapter,setRealChapter]=useState(resumeChapter!==null);
  const [realChapterIndex,setRealChapterIndex]=useState<0|1|2|3|4|5>(
    resumeChapter===null?0:Math.max(0,Math.min(5,Math.trunc(resumeChapter))) as 0|1|2|3|4|5);
  const [realLessonId,setRealLessonId]=useState(FOUNDATION_IDS[0]);
  const [realAttempt,setRealAttempt]=useState(0);
  const [realFinished,setRealFinished]=useState<Set<string>>(()=>safeProgress([...FOUNDATION_IDS,...STORYTELLING_IDS,...VISUAL_IDS,...SOUND_EDIT_IDS,...PEOPLE_IDS,...FIRST_FILM_IDS]));
  const refreshReal=()=>setRealFinished(safeProgress([...FOUNDATION_IDS,...STORYTELLING_IDS,...VISUAL_IDS,...SOUND_EDIT_IDS,...PEOPLE_IDS,...FIRST_FILM_IDS]));
  const startReal=()=>{
    refreshReal();
    setRealChapter(true);
    setRealChapterIndex(0);
    setScreen('journey');
    if(viewport.current)viewport.current.scrollTop=0;
  };
  const exitReal=()=>{
    setRealChapter(false);
    setScreen('home');
    if(viewport.current)viewport.current.scrollTop=0;
  };
  const startRealMission=(id:string)=>{
    setRealLessonId(id);
    setRealAttempt(n=>n+1);
    setScreen('mission');
    if(viewport.current)viewport.current.scrollTop=0;
  };
  const [zoom,setZoom]=useState(1.3);
  const [notice,setNotice]=useState('');
  useEffect(()=>{
    if(!notice)return;
    const timer=window.setTimeout(()=>setNotice(''),2300);
    return ()=>window.clearTimeout(timer);
  },[notice]);
  const [missionId,setMissionId]=useState('see');
  const [missionAttempt,setMissionAttempt]=useState(0);
  const startMission=(id:string)=>{
    setMissionId(id);
    setMissionAttempt(n=>n+1);
    setScreen('mission');
    if(viewport.current)viewport.current.scrollTop=0;
  };
  const backToJourney=()=>{
    setScreen('journey');
    if(viewport.current)viewport.current.scrollTop=0;
  };
  const completeMission=(id:string)=>{
    setSaved(saveCompletedMission(id));
    onNativeComplete();
  };
  const [saved,setSaved]=useState<SavedDemo>(()=>readDemo());
  const saveIdea=()=>{
    setSaved(saveLabIdea());
    onNativeComplete();
    setNotice('Saved to your prototype practice log · +5 pts');
  };
  const clearProgress=()=>{
    if(!window.confirm('Reset only the Option B prototype progress? Your existing Frame One app data will not be touched.'))return;
    setSaved(resetDemo());
    onNativeComplete();
    setScreen('home');
    setNotice('Prototype progress cleared');
    if(viewport.current)viewport.current.scrollTop=0;
  };
  const viewport=useRef<HTMLElement>(null);
  useEffect(()=>{if(onActive){setSaved(readDemo());refreshReal();}},[onActive]);
  const openScreen=(target:'journey'|'lab')=>{
    setSaved(readDemo());
    setScreen(target);
    if(viewport.current)viewport.current.scrollTop=0;
  };
  const changeScreen=(target:string)=>{
    if(target==='home'||target==='journey'||target==='lab'||target==='progress'){
      setSaved(readDemo());refreshReal();setScreen(target);
      if(viewport.current)viewport.current.scrollTop=0;
    }else onOpenReference(target);
  };
  return <div className="site" data-v2-native-react data-v2-real-course={realChapter?'true':undefined}>
    <aside className="pitch" aria-label="Prototype design brief">
      <div className="tiny">FRAME ONE · DESIGN LAB / 01</div>
      <h1>Learn cinema.<br/><span>By making it.</span></h1>
      <p>Option B, built as an actual interactive product prototype. Real screens, original vector art, real state and no borrowed UI assets.</p>
      <div className="pitch-divider"/>
      <div className="pitch-list">
        <div><b>01</b> Wonder-filled learning journey</div>
        <div><b>02</b> Observe → decide → explore → film</div>
        <div><b>03</b> One shared scene and art system</div>
        <div><b>04</b> Offline, keyboard-friendly prototype</div>
        <div><b>05</b> Working progress, lab and shot saving</div>
      </div>
      <div className="build-tag">DESIGN SYSTEM CANDIDATE · OPTION B / V1</div>
    </aside>
    <div className="phone" aria-label="Frame One native React visual parity preview">
      <header className="topbar">
        <div className="wordmark">
          <span className="brand-symbol" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
              <path d="M3 10h18v11H3zM3 7l17-4 2 5-18 4zM6 6l3 4M12 5l3 4M18 4l3 4"/>
              <path d="M11 13l5 3-5 3z" fill="currentColor" stroke="none"/>
            </svg>
          </span>Frame One
        </div>
        <div className="head-actions">
          <span className="head-pill" aria-label={realChapter?'Real Chapter '+(realChapterIndex+1)+' progress':'Creative demo credits'}>
            <span className="coin">✦</span><span>{realChapter?(realChapterIndex===0?FOUNDATION_IDS:realChapterIndex===1?STORYTELLING_IDS:realChapterIndex===2?VISUAL_IDS:realChapterIndex===3?SOUND_EDIT_IDS:realChapterIndex===4?PEOPLE_IDS:FIRST_FILM_IDS).filter(id=>realFinished.has(id)).length+'/'+(realChapterIndex===0||realChapterIndex===5?'5':realChapterIndex===2?'7':realChapterIndex===4?'4':'6'):saved.points}</span> {realChapter?'lessons':'pts'}
          </span>
          <button type="button" className="avatar" aria-label="View my progress" onClick={()=>changeScreen('progress')}>🎬</button>
        </div>
      </header>
      <main id="viewport" ref={viewport} tabIndex={-1} aria-live="off">
        {realChapter
          ? screen==='lab'
            ? <OptionBRealLabs onOpen={lab=>onOpenProductionLab(lab,realChapterIndex)}
                onBack={()=>{setScreen('journey');if(viewport.current)viewport.current.scrollTop=0;}}/>
            : screen==='mission'
            ? <OptionBFoundationMission key={realLessonId+'-'+realAttempt}
                lessonId={realLessonId}
                onBack={()=>{refreshReal();setScreen('journey');if(viewport.current)viewport.current.scrollTop=0;}}
                onComplete={()=>{refreshReal();}}
                onStepChange={()=>{if(viewport.current)viewport.current.scrollTop=0;}}/>
            : realChapterIndex===0
              ? <FoundationJourney completed={realFinished} onMission={startRealMission} onExit={exitReal}
                  onNext={()=>{setRealChapterIndex(1);setScreen('journey');if(viewport.current)viewport.current.scrollTop=0;}}/>
              : realChapterIndex===1
                ? <StorytellingJourney completed={realFinished} onMission={startRealMission}
                    onExit={()=>{setRealChapterIndex(0);setScreen('journey');if(viewport.current)viewport.current.scrollTop=0;}}
                    onNext={()=>{setRealChapterIndex(2);setScreen('journey');if(viewport.current)viewport.current.scrollTop=0;}}/>
                : realChapterIndex===2
                  ? <VisualJourney completed={realFinished} onMission={startRealMission}
                      onExit={()=>{setRealChapterIndex(1);setScreen('journey');if(viewport.current)viewport.current.scrollTop=0;}}
                      onNext={()=>{setRealChapterIndex(3);setScreen('journey');if(viewport.current)viewport.current.scrollTop=0;}}/>
                  : realChapterIndex===3
                    ? <SoundEditingJourney completed={realFinished} onMission={startRealMission}
                        onExit={()=>{setRealChapterIndex(2);setScreen('journey');if(viewport.current)viewport.current.scrollTop=0;}}
                        onNext={()=>{setRealChapterIndex(4);setScreen('journey');if(viewport.current)viewport.current.scrollTop=0;}}/>
                    : realChapterIndex===4
                      ? <PeopleJourney completed={realFinished} onMission={startRealMission}
                          onExit={()=>{setRealChapterIndex(3);setScreen('journey');if(viewport.current)viewport.current.scrollTop=0;}}
                          onNext={()=>{setRealChapterIndex(5);setScreen('journey');if(viewport.current)viewport.current.scrollTop=0;}}/>
                      : <FirstFilmJourney completed={realFinished} onMission={startRealMission}
                          onExit={()=>{setRealChapterIndex(4);setScreen('journey');if(viewport.current)viewport.current.scrollTop=0;}}
                          onLabs={()=>{setScreen('lab');if(viewport.current)viewport.current.scrollTop=0;}}/>
          : screen==='home'
            ? <HomeScreen finished={saved.finished} onMission={startMission} onScreen={openScreen} onStartReal={startReal}/>
            : screen==='journey'
              ? <JourneyScreen finished={saved.finished} onMission={startMission}/>
              : screen==='mission'
                ? <OptionBReactMission key={missionId+'-'+missionAttempt}
                    missionId={missionId} onBack={backToJourney}
                    onRestart={()=>startMission(missionId)} onComplete={completeMission}
                    onStepChange={()=>{if(viewport.current)viewport.current.scrollTop=0;}}
                    zoom={zoom} onZoomChange={setZoom}/>
                : screen==='lab'
                  ? <OptionBReactLab zoom={zoom} onZoomChange={setZoom} onSave={saveIdea}/>
                  : <ProgressScreen saved={saved} onMission={startMission} onReset={clearProgress}/>}
      </main>
      <nav className="navbar" aria-label="Primary navigation">
        {NAV_ITEMS.map(([id,label,icon])=><button type="button" key={id}
          className={'nav-item'+(realChapter? ((screen==='lab'?'lab':'journey')===id?' is-active':'') : ((screen==='mission'?'journey':screen)===id?' is-active':''))}
          aria-current={(realChapter?(screen==='lab'?'lab':'journey')===id:(screen==='mission'?'journey':screen)===id)?'page':undefined}
          data-v2-native-nav={id}
          onClick={()=>realChapter? (id==='journey'||id==='lab' ? (setScreen(id),viewport.current?.scrollTo(0,0)):exitReal()) : changeScreen(id)}>
          <Icon name={icon}/><span>{label}</span>
        </button>)}
      </nav>
      <div className={'toast'+(notice?' visible':'')} role="status" aria-live="polite">{notice}</div>
    </div>
  </div>;
}

/** Shadow DOM contains exact approved CSS without leaking styles into the old app. */
export function OptionBReactScreens({onOpenReference,active,onNativeComplete,onOpenProductionLab,resumeChapter}:{
  onOpenReference:(screen:string,missionId?:string)=>void;
  active:boolean;onNativeComplete:()=>void;
  onOpenProductionLab:(lab:LabName,chapterIndex:number)=>void;
  resumeChapter:number|null;
}){
  const slot=useRef<HTMLDivElement>(null);
  const [shadow,setShadow]=useState<ShadowRoot|null>(null);
  useEffect(()=>{
    const host=slot.current;
    if(!host)return;
    const root=host.shadowRoot||host.attachShadow({mode:'open'});
    setShadow(root);
  },[]);
  return <div className="frameone-option-b-native-slot" data-v2-react-slot
    ref={slot} aria-label="Native React port of all five approved Frame One Option B screens">
    {shadow?createPortal(<><style>{approvedStyles}</style><ReactScreenShell onOpenReference={onOpenReference} onActive={active} onNativeComplete={onNativeComplete} onOpenProductionLab={onOpenProductionLab} resumeChapter={resumeChapter}/></>,shadow):null}
  </div>;
}
