import {OptionBReactScene} from './OptionBReactMission';

type SoundTopic='sound'|'editing'|'ambience'|'music'|'continuity'|'rhythm';
type LessonDisplay={labels:[string,string,string];context:string};
const DISPLAY:Record<SoundTopic,LessonDisplay>={
 sound:{labels:['The wider world','One specific event','Music or no music'],context:'Sound can reveal information beyond the frame. These are sound-story notes, not actual audio.'},
 editing:{labels:['Establish → Reveal','Question → Context','Reaction → Reveal'],context:'Change which illustrated shot appears first. This is a storyboard, not a video player.'},
 ambience:{labels:['Dialogue','Effects','Environment'],context:'Sound design has layers. No sound is played or recorded by these illustrations.'},
 music:{labels:['Music in the scene','Audience-only score','No music'],context:'Diegetic and non-diegetic music are about where sound exists in the story.'},
 continuity:{labels:['Match','Unexpected jump','Show the action'],context:'These are two drawn views of a prop, not real film footage.'},
 rhythm:{labels:['1 · 1 · 1 seconds','5 · 1 · 1 seconds','1 · 1 · 5 seconds'],context:'Duration ratios are illustrated, not played. Meaning depends on action, sound and context.'}
};
const SHOT_NAMES=['PLACE','PERSON','PHONE'] as const;
const SHOT_DESCRIPTIONS=['Place','Person','Message'];
const EDIT_ORDER:[[number,number,number],[number,number,number],[number,number,number]]=[
 [0,1,2],[2,1,0],[1,0,2]
];
function SceneSequence({selected}:{selected:number}){
 return <div className="sound-shot-sequence" aria-label={'Storyboard showing '+EDIT_ORDER[selected].map(n=>SHOT_DESCRIPTIONS[n]).join(' then ')}>
   {EDIT_ORDER[selected].map((id,i)=><div className="sound-shot" key={i}>
     <div className={'sound-shot-illustration sound-shot-'+id}>
       <img src="./option-b-assets/scene.svg" alt="" aria-hidden="true"/>
       <span className="sound-shot-count">{String(i+1).padStart(2,'0')}</span>
     </div>
     <strong>{SHOT_NAMES[id]}</strong>
   </div>)}
 </div>;
}
function SoundLayers({selected,ambience=false}:{selected:number;ambience?:boolean}){
 const names=ambience?['Speech','Foley / events','World / atmosphere']:['Outside the frame','A nearby event','Optional score'];
 const descriptions=ambience?
  ['Clear words','Footsteps, door, phone','Traffic, wind, room tone']:
  ['A place beyond the camera','A small event changes attention','Music can suggest, not command'];
 return <div className="sound-layer-stack" role="img" aria-label={'Conceptual sound layers: '+names[selected]+' selected'}>
   {names.map((name,i)=><div className={'sound-layer'+(selected===i?' active':'')} key={name}>
     <span className="sound-layer-token">{i===0?'◉':i===1?'✦':'◎'}</span>
     <div><strong>{name}</strong><small>{descriptions[i]}</small></div>
     <span className="sound-layer-bars" aria-hidden="true">
       {Array.from({length:8},(_,j)=><i key={j} style={{height:(8+((j*7+i*9)%22))+'px'}}/>)}
     </span>
   </div>)}
   <div className="sound-layer-note">Conceptual mix layers · no sound playback</div>
 </div>;
}
function MusicSource({selected}:{selected:number}){
 return <div className="sound-source-stage" role="img" aria-label={selected===0?
  'Diegetic music: the story character hears a radio':selected===1?
  'Non-diegetic music: only the audience hears a score':'A scene with location sounds but no music'}>
  <svg viewBox="0 0 320 202" aria-hidden="true">
    <defs>
     <linearGradient id="sound-scene-wall" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#e6f7e9"/><stop offset="1" stopColor="#c2e6da"/></linearGradient>
    </defs>
    <rect width="320" height="202" rx="18" fill="url(#sound-scene-wall)"/>
    <path d="M0 142H320" stroke="#9ecabd" strokeWidth="3"/>
    <path d="M22 34H140M22 50H103" stroke="#a6d8c9" strokeWidth="6" strokeLinecap="round"/>
    <path d="M161 100q0-37 32-37t32 37" fill="none" stroke="#32576b" strokeWidth="11" strokeLinecap="round"/>
    <circle cx="194" cy="91" r="26" fill="#e8b875" stroke="#956a47" strokeWidth="2"/>
    <circle cx="184" cy="89" r="2.6" fill="#3e464b"/><circle cx="201" cy="89" r="2.6" fill="#3e464b"/>
    <path d="M186 105q8 4 15-2" fill="none" stroke="#aa784f" strokeWidth="2"/>
    <path d="M166 129Q195 109 221 129L242 182H145Z" fill="#34667b"/>
    <path d="M123 182H261" stroke="#7ca69b" strokeWidth="5" strokeLinecap="round"/>
    <g opacity={selected===0?1:.27}>
      <rect x="38" y="112" width="83" height="53" rx="9" fill="#f7d48c" stroke="#bd9360" strokeWidth="3"/>
      <circle cx="60" cy="138" r="13" fill="#355b70"/><circle cx="60" cy="138" r="7" fill="#9ac8c1"/>
      <path d="M83 127h25m-25 9h25m-25 9h19" stroke="#aa7548" strokeWidth="3" strokeLinecap="round"/>
      <path d="M81 111l26-22" stroke="#715a56" strokeWidth="3"/>
    </g>
    {selected===0&&<path d="M121 136Q142 110 149 119M126 145Q148 123 157 131" stroke="#279c83" strokeWidth="4" fill="none" strokeLinecap="round"/>}
    {selected===1&&<>
      <path d="M247 34h-15v29m15-20h17v24" stroke="#178b74" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <circle cx="230" cy="66" r="8" fill="#30b08d"/><circle cx="262" cy="67" r="8" fill="#30b08d"/>
      <rect x="218" y="17" width="85" height="65" rx="14" fill="none" stroke="#2b957d" strokeWidth="2" strokeDasharray="6 4"/>
      <text x="260" y="94" fontSize="9" fill="#2c7b70" fontWeight="800" textAnchor="middle">AUDIENCE</text>
    </>}
    {selected===2&&<>
      <path d="M253 43l7-8m-7 21 7 7" stroke="#658e80" strokeWidth="3"/>
      <text x="247" y="85" fontSize="11" fontWeight="800" fill="#537b74" textAnchor="middle">NO SCORE</text>
    </>}
    <rect x="12" y="9" width="128" height="27" rx="13" fill="#ffffffcc"/>
    <text x="76" y="27" fontSize="10" textAnchor="middle" fontWeight="850" fill="#287d71">STORY WORLD</text>
  </svg>
  <div className="sound-source-caption">{selected===0?'RADIO · THE CHARACTER CAN HEAR IT':
   selected===1?'SCORE · FOR THE AUDIENCE':'LOCATION SOUND · MUSIC ABSENT'}</div>
 </div>;
}
function ContinuityFrames({selected}:{selected:number}){
 const cupSecond=selected===1?91:233;
 return <div className="sound-continuity" role="img" aria-label={selected===0?
   'Two drawings keep the cup in the same place':selected===1?
   'The cup suddenly changes sides with no shown action':'The cup moves between the views, with an action arrow'}>
  <svg viewBox="0 0 324 179" aria-hidden="true">
   <rect x="3" y="4" width="153" height="170" rx="14" fill="#e4f7ee" stroke="#afd8c8" strokeWidth="2"/>
   <rect x="167" y="4" width="154" height="170" rx="14" fill="#e4f7ee" stroke="#afd8c8" strokeWidth="2"/>
   {[0,164].map((dx,i)=><g key={i} transform={'translate('+dx+' 0)'}>
     <rect x="17" y="104" width="129" height="11" rx="5" fill="#ac8062"/>
     <path d="M30 115v35m101-35v35" stroke="#906d58" strokeWidth="8" strokeLinecap="round"/>
     <circle cx="69" cy="77" r="24" fill="#f3c083" stroke="#b48561" strokeWidth="2"/>
     <path d="M52 68Q68 43 86 68" fill="#33576c"/>
     <path d="M52 112q19-29 35 0" stroke="#33576c" strokeWidth="15" strokeLinecap="round"/>
     <rect x={i===0?89:selected===1?18:69} y="92" width="19" height="16" rx="3" fill="#fff0bb" stroke="#c69457" strokeWidth="2"/>
     <path d={'M'+(i===0?108:selected===1?37:88)+' 95q11-2 9 7t-9 2'} fill="none" stroke="#c69457" strokeWidth="3"/>
     <text x="23" y="22" fontSize="10" fontWeight="850" fill="#407f71">SHOT {i+1}</text>
   </g>)}
   {selected===2&&<path d="M259 70q25-16 40 6" stroke="#278d76" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="5 4"/>}
   <rect x="141" y="74" width="41" height="30" rx="13" fill="#fff" stroke="#aad3c4"/>
   <text x="162" y="94" textAnchor="middle" fontSize="14" fontWeight="800" fill="#2b907b">{selected===1?'!':selected===2?'→':'✓'}</text>
  </svg>
  <p>{selected===0?'Position is consistent across the cut.':
    selected===1?'An unexplained prop jump may confuse the viewer.':
    'A visible movement makes the changed placement understandable.'}</p>
 </div>;
}
function RhythmBars({selected}:{selected:number}){
 const values=selected===0?[1,1,1]:selected===1?[5,1,1]:[1,1,5];
 const longest=Math.max(...values);
 const titles=['PLACE','MESSAGE','REACTION'];
 return <div className="sound-rhythm" aria-label={'Shot timing plan '+values.join(', ')+' seconds'}>
   <div className="sound-rhythm-title"><span>SHOT</span><span>ILLUSTRATIVE DURATION</span></div>
   {values.map((value,i)=><div className="sound-rhythm-row" key={i}>
     <strong>{titles[i]}</strong>
     <span className="sound-rhythm-track"><span style={{width:(value/longest*100)+'%'}}/></span>
     <b>{value}s</b>
   </div>)}
   <div className="sound-rhythm-total">Total sequence: {values.reduce((a,b)=>a+b,0)} seconds · no playback</div>
 </div>;
}
export function OptionBSoundEditExperiment({lessonId,selected}:{lessonId:string;selected:number}){
 if(!Object.prototype.hasOwnProperty.call(DISPLAY,lessonId))return null;
 const topic=lessonId as SoundTopic;
 const {labels,context}=DISPLAY[topic];
 return <section className="sound-experiment" data-v2-sound-experiment={topic}
   data-v2-sound-selection={selected} aria-label="Interactive sound and editing study">
   <div className="sound-experiment-head">
     <span className="eyebrow">YOUR CINEMA STUDIO</span>
     <strong>{labels[selected]}</strong>
   </div>
   {topic==='editing'?<SceneSequence selected={selected}/>
     :topic==='continuity'?<ContinuityFrames selected={selected}/>
     :topic==='rhythm'?<RhythmBars selected={selected}/>
     :topic==='music'?<MusicSource selected={selected}/>
     :topic==='ambience'?<SoundLayers selected={selected} ambience/>
     :<SoundLayers selected={selected}/>}
   <div className="sound-experiment-footnote">{context}</div>
   <span className="sound-experiment-id">ORIGINAL OFFLINE ILLUSTRATION · NO RECORDED AUDIO</span>
 </section>;
}
