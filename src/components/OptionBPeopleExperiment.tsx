/** Original, diagrammatic studio for four real Chapter 5 guided lessons.
 * Visual grouping is illustrative, never a verified union roster or diagram
 * of a particular production's staffing.
 */
type PeopleTopic='crew'|'craft24'|'teams'|'pipeline';
type RoleGroup={label:string;roles:readonly string[];caption:string};
const DEPARTMENTS:readonly RoleGroup[]=[
 {label:'Story & performance',roles:['Writer','Director','Actors'],caption:'Clarify the story, decisions and lived moment'},
 {label:'Making the image',roles:['Art & props','Camera & light','Costume & makeup'],caption:'Create the place and record action'},
 {label:'Sound & final cut',roles:['Sound','Editor','Post-production'],caption:'Shape what is heard, shown and when'}
];
const CRAFT_GROUPS:readonly RoleGroup[]=[
 {label:'Prepare',roles:['Sets & props','Costume & makeup','Transport & support'],caption:'Example work areas before and during filming'},
 {label:'Capture',roles:['Camera','Lighting','Sound on location'],caption:'Example on-set technical responsibilities'},
 {label:'Finish',roles:['Editing','Sound post','Colour finishing'],caption:'Example work after principal photography'}
];
const STAGES=[
 {name:'Develop',copy:'Shape the story and decide why it matters'},
 {name:'Prepare',copy:'Plan cast, location, shots, safety and equipment'},
 {name:'Shoot',copy:'Record images, performances and useful location sound'},
 {name:'Finish',copy:'Edit picture, sound and colour; export carefully'},
 {name:'Share',copy:'Choose where and how audiences can watch'}
];
const GROUP_DESCRIPTIONS={
 crew:'Teams collaborate across the scene. On smaller films, a person may cover several jobs.',
 craft24:'Illustrative work areas only. “24 crafts” is not the same as a universal set of exactly 24 job titles.',
 teams:'A scene becomes legible through connected decisions, not one department working alone.',
 pipeline:'Five overlapping filmmaking stages. This is an educational roadmap, not a compulsory production order.'
} satisfies Record<PeopleTopic,string>;

function ProcessFlow({selected}:{selected:number}){
 const active=selected===0?[0,1]:selected===1?[2]:[3,4];
 return <div className="people-process" role="img"
   aria-label={'Five filmmaking stages with '+active.map(i=>STAGES[i].name).join(' and ')+' highlighted'}>
   {STAGES.map((stage,i)=><div key={stage.name}
      className={'people-process-step'+(active.includes(i)?' selected':'')}>
     <span className="people-step-n">{String(i+1).padStart(2,'0')}</span>
     <div><strong>{stage.name}</strong><small>{stage.copy}</small></div>
     {i<STAGES.length-1&&<span aria-hidden="true" className="people-process-link">↓</span>}
   </div>)}
 </div>;
}

function TeamWeb({topic,selected}:{topic:'crew'|'craft24';selected:number}){
 const groups=topic==='crew'?DEPARTMENTS:CRAFT_GROUPS;
 return <div className="people-team-web" role="img"
   aria-label={'Illustrated departments: '+groups[selected].roles.join(', ')+' highlighted'}>
   <div className="people-team-center">
     <span>✦</span><strong>{topic==='crew'?'ONE FILM SCENE':'MANY WORK AREAS'}</strong>
     <small>{topic==='crew'?'Collaborative production':'Telugu industry context'}</small>
   </div>
   <div className="people-team-groups">
     {groups.map((group,i)=><div key={group.label} className={'people-team-group'+(selected===i?' selected':'')}>
       <span className="people-group-number">0{i+1}</span>
       <strong>{group.label}</strong>
       <div>{group.roles.map(role=><span key={role} className="people-role">{role}</span>)}</div>
     </div>)}
   </div>
   <p className="people-selected-explain">{groups[selected].caption}</p>
 </div>;
}

function SceneTeams({selected}:{selected:number}){
 const highlight=selected===0?'ACT':selected===1?'SPACE':'EDIT';
 return <div className="people-scene-art" role="img"
   aria-label={'Original dinner-table scene collaboration illustration. '+highlight+' area emphasized'}>
   <svg viewBox="0 0 320 205" aria-hidden="true">
     <defs>
      <linearGradient id="people-room" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#e8f9f1"/><stop offset="1" stopColor="#d7eee5"/>
      </linearGradient>
     </defs>
     <rect width="320" height="205" rx="17" fill="url(#people-room)"/>
     <path d="M0 166H320" stroke="#a0cbbb" strokeWidth="3"/>
     <rect x="32" y="38" width="66" height="79" rx="5" fill="#b7e4df" stroke="#87bfb4" strokeWidth="4"/>
     <path d="M64 41v73M36 77h58" stroke="#87bfb4" strokeWidth="3"/>
     <circle cx="269" cy="51" r="16" fill="#ffe4a3" opacity={selected===1?1:.55}/>
     <path d="M269 66l-40 52" stroke="#f4c97b" strokeWidth="10" opacity={selected===1?.68:.17}/>
     <ellipse cx="176" cy="142" rx="98" ry="30" fill="#a47959" stroke="#8b654e" strokeWidth="3"/>
     <path d="M119 143v36m113-36v36" stroke="#8b654e" strokeWidth="9" strokeLinecap="round"/>
     <g opacity={selected===1?1:.58}>
       <path d="M208 132q17-4 29 0l-5 16h-19Z" fill="#f8f0d8" stroke="#b39876" strokeWidth="2"/>
       <path d="M209 136h27" stroke="#bea78b" strokeWidth="2"/>
       <rect x="124" y="127" width="25" height="16" rx="4" fill="#fff7e4" stroke="#aa9280" strokeWidth="2"/>
       <path d="M149 130q12-4 11 6t-11 2" fill="none" stroke="#aa9280" strokeWidth="2.5"/>
     </g>
     <g opacity={selected===0?1:.72}>
       <circle cx="87" cy="116" r="20" fill="#efb97b" stroke="#a4774f" strokeWidth="2.5"/>
       <path d="M70 105q18-26 34 4l-5-19-19-4Z" fill="#355a68"/>
       <circle cx="81" cy="116" r="2.2" fill="#514c47"/><circle cx="94" cy="116" r="2.2" fill="#514c47"/>
       <path d="M81 129q7-4 13 0" fill="none" stroke="#9b735c" strokeWidth="2"/>
       <path d="M66 151q20-27 41 0l8 43H59Z" fill="#457b89"/>
     </g>
     {selected===2&&<>
       <rect x="192" y="13" width="110" height="32" rx="10" fill="#fff" stroke="#8bcbb5" strokeWidth="2"/>
       <text x="247" y="26" fontSize="10" fontWeight="800" fill="#286a66" textAnchor="middle">SOUND → CUT</text>
       <path d="M211 33h13m5 0h25m5 0h11" stroke="#62a993" strokeWidth="3" strokeLinecap="round"/>
     </>}
     <rect x="13" y="12" width="126" height="27" rx="13" fill="#ffffffdf"/>
     <text x="76" y="29" fontSize="10" fontWeight="850" textAnchor="middle" fill="#298372">
       {selected===0?'STORY & ACTING':selected===1?'SET & CAMERA':'SOUND & EDIT'}
     </text>
   </svg>
   <div className="people-scene-decisions">
     {[
      ['Story','What does the child expect to find?'],
      ['Stage','How does the empty place become visible?'],
      ['Edit','When do we understand the absence?']
     ].map(([name,desc],i)=><div key={name} className={'people-scene-decision'+(selected===i?' selected':'')}>
       <strong>{name}</strong><span>{desc}</span>
     </div>)}
   </div>
 </div>;
}
const LABELS:Record<PeopleTopic,readonly [string,string,string]>={
 crew:['Story team','Image team','Sound & post'],
 craft24:['Prepare work','Capture work','Finish work'],
 teams:['Story & actor','Art & camera','Sound & cut'],
 pipeline:['Develop & prepare','Production','Finish & distribute']
};
export function OptionBPeopleExperiment({lessonId,selected}:{lessonId:string;selected:number}){
 if(!Object.prototype.hasOwnProperty.call(LABELS,lessonId))return null;
 const topic=lessonId as PeopleTopic;
 return <section className="people-experiment" data-v2-people-experiment={topic} data-v2-people-selection={selected}
   aria-label="Interactive filmmaking collaboration study">
   <div className="people-experiment-head">
     <span className="eyebrow">THE PRODUCTION WORKSHOP</span>
     <strong>{LABELS[topic][selected]}</strong>
   </div>
   {topic==='teams'?<SceneTeams selected={selected}/>
     :topic==='pipeline'?<ProcessFlow selected={selected}/>
     :<TeamWeb topic={topic} selected={selected}/>}
   <p className="people-experiment-caption">{GROUP_DESCRIPTIONS[topic]}</p>
   <span className="people-experiment-notice">ORIGINAL CONCEPTUAL ILLUSTRATION · NOT AN OFFICIAL CREW ROSTER</span>
 </section>;
}
