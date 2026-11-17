/**
 * Chapter 6 visual exercises. They are original, interactive learning diagrams,
 * not an actual camera, media importer, video editor or audience-testing tool.
 * The factual checkpoint and real practice saving remain with the guided engine.
 */
type Topic='making'|'shotlist'|'shootscene'|'editminute'|'review';
const labels:Record<Topic,[string,string,string]>={
 making:['One place · one choice','One person · one discovery','One gesture · one reaction'],
 shotlist:['Location / context','Recordable action','Useful reaction'],
 shootscene:['Permission & safety','Capture & check','Review & continuity'],
 editminute:['Place → discovery','Discovery → place','Reaction → reveal'],
 review:['Ask what landed','Locate confusion','Change one thing']
};
const notes:Record<Topic,string>={
 making:'Original scope planner · no footage or screenplay is created automatically.',
 shotlist:'Sample shot setups, not a compulsory three-shot rule or an exported shooting schedule.',
 shootscene:'Illustrative checklist. Frame One cannot verify your location safety, consent, image or sound.',
 editminute:'Storyboard comparison only. It does not load, play, process or export recorded footage.',
 review:'Fictional examples of review comments; not feedback collected from actual viewers.'
};
function FilmMoment({selected=0}:{selected?:number}){
 return <div className="first-film-art" role="img"
   aria-label="Original illustration of a character studying a letter in a small room">
   <svg viewBox="0 0 330 188" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
     <defs><linearGradient id="first-film-wall" x1="0" y1="0" x2="1" y2="1">
       <stop stopColor="#e5f8ed"/><stop offset="1" stopColor="#cce8e3"/>
     </linearGradient></defs>
     <rect width="330" height="188" rx="17" fill="url(#first-film-wall)"/>
     <rect x="27" y="28" width="74" height="85" rx="7" fill="#c3e9e5" stroke="#97c8bb" strokeWidth="4"/>
     <path d="M64 30v82M29 70h69" stroke="#93c7b7" strokeWidth="4"/>
     <path d="M0 149h330" stroke="#a8cec3" strokeWidth="4"/>
     <path d="M234 133h71m-61 0v38m50-38v38" stroke="#9d7a61" strokeWidth="8" strokeLinecap="round"/>
     <rect x="232" y="115" width="78" height="18" rx="8" fill="#ba8f6e"/>
     <path d="M122 171q5-55 47-59 40 3 52 59" fill="#376b7a"/>
     <circle cx="170" cy="92" r="31" fill="#f2bd7f" stroke="#b28053" strokeWidth="3"/>
     <path d="M139 82q6-39 35-32 27 1 28 34l-10-17-36-1Z" fill="#365c6d"/>
     <circle cx="160" cy="92" r="2.5" fill="#4c4c4c"/><circle cx="183" cy="92" r="2.5" fill="#4c4c4c"/>
     <path d="M164 107q7 4 13 0" stroke="#956e54" strokeWidth="2" fill="none" strokeLinecap="round"/>
     <path d="M209 134l30 7" stroke="#f2bd7f" strokeWidth="12" strokeLinecap="round"/>
     <g transform={selected===2?'translate(-7 -7) rotate(7 234 140)':'translate(0 0)'}>
       <rect x="224" y="134" width="44" height="29" rx="4" fill="#fff8df" stroke="#cb9e66" strokeWidth="2.5"/>
       <path d="M226 137l20 12 20-12" fill="none" stroke="#d9b077" strokeWidth="2"/>
     </g>
     <rect x="12" y="10" width="118" height="27" rx="13" fill="#ffffffd9"/>
     <text x="71" y="28" textAnchor="middle" fontSize="9.5" fill="#2f8175" fontWeight="850">
       ORIGINAL SCENE 01
     </text>
     <circle cx="288" cy="37" r="20" fill={selected===1?'#ffd18b':'#b8e4d1'} opacity=".8"/>
     <text x="288" y="41" fontSize="10" textAnchor="middle" fontWeight="850" fill="#447c73">
       {selected===0?'A':selected===1?'B':'C'}
     </text>
   </svg>
 </div>;
}
function ScopePlan({selected}:{selected:number}){
 const scenarios=[
  {title:'One place · one decision',beats:['WANTS TO REPLY','MESSAGE ARRIVES','CHOICE IS MADE'],props:'1 setting · 1 performer · 1 turning point'},
  {title:'One person · one discovery',beats:['NOTICES AN OBJECT','RECOGNISES A CLUE','ACTS DIFFERENTLY'],props:'1 setting · 1 actor · 1 discovered detail'},
  {title:'One gesture · one reaction',beats:['ONE SMALL ACTION','A CONSEQUENCE','A VISIBLE RESPONSE'],props:'A tiny scene can have a complete arc'}
 ];
 return <div className="first-film-workshop-panel">
   <FilmMoment selected={selected}/>
   <div className="first-film-three-beats">
     {scenarios[selected].beats.map((beat,i)=><div className="first-film-beat" key={beat}>
       <span>{String(i+1).padStart(2,'0')}</span><strong>{beat}</strong>
     </div>)}
   </div>
   <p className="first-film-plan-note"><strong>{scenarios[selected].title}.</strong> {scenarios[selected].props}.</p>
 </div>;
}
function ShotList({selected}:{selected:number}){
 const shots=[
  {number:'01',name:'PLACE',type:'Wide / medium',action:'Where does the character begin?',aria:'An illustrated wide shot of the place'},
  {number:'02',name:'DISCOVERY',type:'Medium / detail',action:'What changes in the action?',aria:'An illustrated view of the discovered message'},
  {number:'03',name:'RESPONSE',type:'Closer view',action:'What does the character decide?',aria:'An illustrated character reaction'}
 ];
 return <div className="first-film-shots" role="img" aria-label={'Three sample shot cards; '+shots[selected].name+' is selected'}>
   {shots.map((shot,i)=><div className={'first-film-shot'+(selected===i?' selected':'')} key={shot.number}>
     <div className={'first-film-shot-visual first-film-shot-visual-'+i}>
       <FilmMoment selected={i}/>
       <span>{shot.number}</span>
     </div>
     <div className="first-film-shot-info">
       <strong>{shot.name}</strong><small>{shot.type}</small>
       <p>{shot.action}</p>
     </div>
   </div>)}
 </div>;
}
function ShootChecklist({selected}:{selected:number}){
 const groups=[
  {title:'PREPARE',status:'ASK BEFORE YOU SHOOT',steps:['Location permission and performer consent','Spot hazards and unsafe camera positions','Agree on the action and any boundaries']},
  {title:'RECORD',status:'MAKE A TEST TAKE',steps:['Place the phone for visible, steady action','Test speech and unwanted background noise','Watch and listen to the actual recording']},
  {title:'REVIEW',status:'CHECK BEFORE LEAVING',steps:['Does the key action happen on camera?','Is the speech or event sound usable?','Do props and action connect across setups?']}
 ];
 const active=groups[selected];
 return <div className="first-film-check" role="group" aria-label={'Practical phone shoot checklist: '+active.title}>
   <div className="first-film-check-header"><span>PHONE FILMMAKING</span><strong>{active.title}</strong></div>
   <FilmMoment selected={selected}/>
   <div className="first-film-check-status">{active.status}</div>
   {active.steps.map((item,i)=><div key={item} className="first-film-checkline">
     <span className="first-film-check-circle">{String(i+1).padStart(2,'0')}</span><p>{item}</p>
   </div>)}
   <p className="first-film-honesty">Review this checklist yourself. Nothing has been automatically recorded or checked.</p>
 </div>;
}
const SEQUENCES:[[number,number,number],[number,number,number],[number,number,number]]=[
 [0,1,2],[1,0,2],[2,1,0]
];
function EditPlan({selected}:{selected:number}){
 const names=['PLACE','MESSAGE','RESPONSE'];
 const durations=selected===0?[3,2,4]:selected===1?[1,3,3]:[2,2,5];
 return <div className="first-film-edit" role="img" aria-label={'Illustrative shot sequence: '+SEQUENCES[selected].map(i=>names[i]).join(' then ')}>
   <div className="first-film-edit-strip">
     {SEQUENCES[selected].map((id,i)=><div className="first-film-edit-frame" key={i}>
       <span>SHOT 0{i+1}</span><div className="first-film-edit-art"><FilmMoment selected={id}/></div>
       <strong>{names[id]}</strong>
       <small>{durations[i]}s hold</small>
     </div>)}
   </div>
   <div className="first-film-edit-timing">
    {durations.map((value,i)=><span key={i} style={{flex:value}}>{value}s</span>)}
   </div>
   <p>Conceptual timeline · {durations.reduce((a,b)=>a+b,0)}s total · no video playback</p>
 </div>;
}
function ReviewCycle({selected}:{selected:number}){
 const stages=[
  {title:'ASK A QUESTION',quote:'“What did you think happened?”',next:'Listen without explaining the intended plot first.'},
  {title:'FIND THE MOMENT',quote:'“The letter was hard to read at 00:12.”',next:'A specific shot or timestamp can reveal what needs attention.'},
  {title:'REVISE ONE CHOICE',quote:'“The important line is clearer now.”',next:'Make one targeted cut, audio adjustment or new shot, then compare.'}
 ];
 const stage=stages[selected];
 return <div className="first-film-review" role="group" aria-label={'Conceptual first cut feedback step '+(selected+1)}>
   <div className="first-film-review-progress">
     {stages.map((st,i)=><div className={i===selected?'selected':''} key={st.title}>
       <b>{i+1}</b><span>{st.title}</span>
     </div>)}
   </div>
   <div className="first-film-review-card">
     <span className="first-film-review-tag">ILLUSTRATIVE VIEWER NOTE</span>
     <strong>{stage.quote}</strong>
     <p>{stage.next}</p>
   </div>
   <div className="first-film-review-loop">LISTEN <span>→</span> IDENTIFY <span>→</span> REVISE</div>
   <p className="first-film-honesty">Examples are fictional. No real audience feedback was measured or collected.</p>
 </div>;
}
export function OptionBFirstFilmExperiment({lessonId,selected}:{lessonId:string;selected:number}){
 if(!Object.prototype.hasOwnProperty.call(labels,lessonId))return null;
 const topic=lessonId as Topic;
 return <section className="first-film-experiment"
   data-v2-firstfilm-experiment={topic} data-v2-firstfilm-selection={selected}
   aria-label="Interactive make-your-first-film studio">
   <div className="first-film-experiment-head">
     <span className="eyebrow">YOUR FIRST FILM STUDIO</span><strong>{labels[topic][selected]}</strong>
   </div>
   {topic==='making'?<ScopePlan selected={selected}/>
    :topic==='shotlist'?<ShotList selected={selected}/>
    :topic==='shootscene'?<ShootChecklist selected={selected}/>
    :topic==='editminute'?<EditPlan selected={selected}/>
    :<ReviewCycle selected={selected}/>}
   <p className="first-film-experiment-caption">{notes[topic]}</p>
   <span className="first-film-experiment-notice">ORIGINAL STORYBOARD &amp; LEARNING DIAGRAM · OFFLINE</span>
 </section>;
}
