import {useState} from 'react';
import {sceneSequenceForLesson,type SequenceId} from '../data/scene-sequences';
import {openLab} from '../legacy/bridge';
import './scene-sequences.css';

type Beat=0|1|2;
function Marks(){return <g fill="none" stroke="#f2d5b8" strokeOpacity=".72" strokeWidth="2">
  <path d="M19 43V22H42M598 22H621V43M19 307V330H42M598 330H621V307"/>
</g>;}
function Cup({x=0,y=0,scale=1}:{x?:number;y?:number;scale?:number}){
 return <g transform={`translate(${x} ${y}) scale(${scale})`}>
  <path d="M-24 -31H26L20 18H-19Z" fill="#c99f7d" stroke="#e6c2a1" strokeWidth="3"/>
  <ellipse cy="-31" rx="25" ry="8" fill="#685348" stroke="#f1c9a8" strokeWidth="3"/>
  <path d="M25 -21Q52 -19 40 6Q33 15 21 9" fill="none" stroke="#cfa78a" strokeWidth="9"/>
 </g>;}
function Hand({x=0,y=0}:{x?:number;y?:number}){
 return <g transform={`translate(${x} ${y})`}>
  <path d="M-130 30Q-62 8 0 0L36 -9" fill="none" stroke="#d3aa8d" strokeWidth="31" strokeLinecap="round"/>
  <path d="M-5 -5L44 -24" fill="none" stroke="#dfb79a" strokeWidth="12" strokeLinecap="round"/>
 </g>;}
function Table({side='left'}:{side?:'left'|'right'}){
 return <g>
  <rect width="640" height="350" fill="#2b3945"/>
  <rect x="37" y="29" width="167" height="167" rx="5" fill="#455e69" stroke="#a2aeb0" strokeWidth="5"/>
  <path d="M119 31V194M39 113H202" stroke="#b6bbba" strokeWidth="4"/>
  <path d="M0 254H640V350H0Z" fill="#202a33"/>
  <path d="M0 255H640" stroke="#ba9e85" strokeOpacity=".6" strokeWidth="4"/>
  <rect x="230" y="197" width="352" height="24" rx="4" fill="#937f72"/>
  <path d="M263 219V299M551 219V299" stroke="#927b6b" strokeWidth="11"/>
  <Cup x={side==='left'?311:497} y={191} scale={1.15}/>
 </g>;}
function UnitsArt({beat}:{beat:Beat}){
 const width=beat===0?410:beat===1?174:175;
 const parts=beat===0?1:3;
 return <svg viewBox="0 0 640 350" className="sq-art" data-sequence-art="units" aria-hidden="true">
  <rect width="640" height="350" fill="#18232d"/>
  {Array.from({length:parts},(_,i)=>{
   const x=beat===0?115:24+i*206;
   const y=beat===0?58:93;
   const w=width,h=beat===0?222:165;
   const isDetail=beat===2&&i===1;
   const isOutcome=beat===2&&i===2;
   return <g key={i}>
    <rect x={x} y={y} width={w} height={h} rx="6" fill={isDetail?'#51443f':'#354652'} stroke="#b99b83" strokeWidth="3"/>
    <path d={`M${x+12} ${y+h*.77}H${x+w-12}`} stroke="#be9c80" strokeWidth="4"/>
    {!isDetail?<>
      <rect x={x+w*.12} y={y+h*.14} width={w*.19} height={h*.38} fill="#617b83" stroke="#9daeb1" strokeWidth="3"/>
      <Cup x={x+w*.7} y={y+h*.68} scale={beat===0?1.14:.7}/>
      <Hand x={x+w*(isOutcome?.81:beat===1?.49: .57)} y={y+h*.63}/>
    </>:<>
      <Cup x={x+w*.63} y={y+h*.72} scale={1.5}/>
      <Hand x={x+w*.34} y={y+h*.48}/>
    </>}
    {beat!==0?<text x={x+w/2} y={y+h+26} fill="#d2b396" textAnchor="middle" fontFamily="monospace" fontSize="13">
      {beat===1?'FRAME '+String(i+1).padStart(2,'0'):['WIDE','INSERT','RESULT'][i]}</text>:null}
   </g>;
  })}
  {beat===1?<><path d="M44 299H596" stroke="#e7b388" strokeWidth="6"/><text x="320" y="335" textAnchor="middle" fontFamily="monospace" fontSize="13" fill="#dcc3a6">THREE FRAMES / ONE UNINTERRUPTED SHOT</text></>:null}
  {beat===0?<text x="320" y="315" textAnchor="middle" fontFamily="monospace" fontSize="14" fill="#dac2a7">ONE STILL IMAGE AT A SINGLE INSTANT</text>:null}
  {beat===2?<text x="320" y="335" textAnchor="middle" fontFamily="monospace" fontSize="13" fill="#dac2a7">THREE SHOTS / ONE STORY SCENE</text>:null}
  <Marks/>
 </svg>;
}
function StoryArt({beat}:{beat:Beat}){
 return <svg viewBox="0 0 640 350" className="sq-art" data-sequence-art="showdonttell" aria-hidden="true">
  <rect width="640" height="350" fill="#222b35"/>
  <rect x="33" y="23" width="164" height="199" fill="#495e66" stroke="#adadac" strokeWidth="5"/>
  <path d="M115 24V221" stroke="#a8b9b9" strokeWidth="4"/>
  <path d="M0 285H640V350H0Z" fill="#24272f"/>
  <ellipse cx="326" cy="274" rx="256" ry="64" fill="#775d50" stroke="#ae8d76" strokeWidth="6"/>
  <Cup x={226} y={241} scale={1.4}/>
  {beat<2?<Cup x={425} y={241} scale={1.4}/>:<g>
    <rect x="409" y="200" width="117" height="38" fill="#4c5b5c" stroke="#b8a18b" strokeWidth="3"/>
    <Cup x={465} y={203} scale={.56}/>
   </g>}
  {beat===1?<Hand x={433} y={206}/>:null}
  {beat===2?<Hand x={500} y={183}/>:null}
  <g fill="#e2c5a7" fontFamily="monospace" fontSize="13"><text x="31" y="326">{['TWO CUPS','A SMALL PAUSE','ONE CUP IS SET ASIDE'][beat]}</text></g>
  <Marks/>
 </svg>;
}
function ContinuityArt({beat}:{beat:Beat}){
 const right=beat===2;
 return <svg viewBox="0 0 640 350" className="sq-art" data-sequence-art="continuity" aria-hidden="true">
   <Table side={right?'right':'left'}/>
   {beat===1?<Hand x={299} y={161}/>:null}
   <path d="M263 235V267M548 235V267" stroke="#e2be9b" strokeOpacity=".48" strokeDasharray="4 5"/>
   <text x="28" y="327" fill="#e5c5a5" fontFamily="monospace" fontSize="14">{right?'SHOT 03 / RIGHT':beat===1?'SHOT 02 / LEFT':'SHOT 01 / LEFT'}</text>
   <Marks/>
 </svg>;
}
function Stage({id,beat}:{id:SequenceId;beat:Beat}){
 return <figure className="sq-stage" data-sequence-stage={beat}>
  {id==='units'?<UnitsArt beat={beat}/>:id==='showdonttell'?<StoryArt beat={beat}/>:<ContinuityArt beat={beat}/>}
  <figcaption><span>ORIGINAL STORYBOARD · NOT VIDEO</span><span>BEAT {beat+1} / 3</span></figcaption>
 </figure>;
}
/** A separate, progressive teaching format: show a scene one beat at a time.
 * Story completion and saved progress remain controlled by the existing quiz.
 */
export function SceneSequence({lessonId}:{lessonId:string}){
 const sequence=sceneSequenceForLesson(lessonId);
 const [beat,setBeat]=useState<Beat>(0);
 const [revealed,setRevealed]=useState(false);
 if(!sequence)return null;
 const current=sequence.beats[beat];
 function go(next:Beat){setBeat(next);setRevealed(false);}
 return <section className="sq-sequence" data-scene-sequence={sequence.id} aria-labelledby={'sq-heading-'+sequence.id}>
  <header className="sq-hero">
   <span className="sq-overline">{sequence.eyebrow}</span>
   <h2 id={'sq-heading-'+sequence.id}>{sequence.question}</h2>
   <p>{sequence.setup}</p>
  </header>
  <Stage id={sequence.id} beat={beat}/>
  <nav className="sq-steps" aria-label="Explore the three storyboard beats">
   {sequence.beats.map((item,i)=><button type="button" key={item.heading}
     data-sequence-beat={i} aria-current={beat===i?'step':undefined}
     onClick={()=>go(i as Beat)}>
     <span>0{i+1}</span><strong>{item.heading}</strong>
    </button>)}
  </nav>
  <div className="sq-interpret">
    <span className="sq-overline">NOTICE THIS · SHOT 0{beat+1}</span>
    <h3 data-sequence-caption>{current.caption}</h3>
    <p data-sequence-focus>{current.focus}</p>
    <div className="sq-actions">
     <button type="button" data-sequence-back disabled={beat===0} onClick={()=>go((beat-1) as Beat)}>← Previous</button>
     <button type="button" data-sequence-next onClick={()=>beat===2?go(0):go((beat+1) as Beat)}>{beat===2?'Replay the scene ↺':'Reveal next shot →'}</button>
    </div>
    {beat===2?<div className="sq-finale" data-sequence-finale>
     <span className="sq-overline">THE STORY HAS REACHED ITS END</span>
     <button data-sequence-discover type="button" aria-expanded={revealed}
       aria-controls={'sq-discovery-'+sequence.id}
       onClick={()=>setRevealed(value=>!value)}>
       {revealed?'Hide the filmmaker insight':'What did these three shots teach us?'} <span aria-hidden="true">{revealed?'−':'+'}</span>
     </button>
     {revealed?<div className="sq-reveal" id={'sq-discovery-'+sequence.id} role="region" aria-label="Storyboard discovery">
       <strong>{sequence.discovery}</strong><p>{sequence.why}</p>
      </div>:null}
    </div>:null}
  </div>
  <footer className="sq-footer">
    <div><span>THE IDEA TO KEEP</span><strong>{sequence.takeaway}</strong></div>
    <div><span>TRY IT WITH YOUR PHONE</span><p>{sequence.challenge}</p>
      <button type="button" data-sequence-lab={sequence.lab} onClick={()=>openLab(sequence.lab)}>{sequence.labTitle} →</button>
    </div>
    <small>These are original storyboard illustrations, not filmed scenes, recorded audio or automatic progress. Your existing lesson quiz still determines completion.</small>
  </footer>
 </section>;
}
