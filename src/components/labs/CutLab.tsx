import { useEffect, useState, type CSSProperties, type Dispatch, type MouseEvent, type SetStateAction } from 'react';
import type { LabName } from '../../legacy/bridge';
import { CutBrief } from './CutBrief';
import './option-b-cut-lab.css';

/** Cut Lab v0.9D — timed illustrations, not actual film footage.
 * Playback owns one cancellable timer that is cleaned up on unmount and
 * on every change of shot, duration, order or playback status.
 */
export type CutShot = 'place'|'detail'|'person';
export type CutOrder = [CutShot,CutShot,CutShot];
export type CutDurations = [number,number,number];

export const cutShots:Record<CutShot,{title:string;why:string;label:string;prompt:string;css:string}>={
  place:{title:'Wide shot · The place',why:'We see the waiting person and the bus stop together.',label:'SHOW THE SETTING',prompt:'Where is this happening?',css:'place'},
  detail:{title:'Close-up · The clock',why:'We notice the clock. Its time reading might make us wonder how long the person has waited.',label:'SHOW A DETAIL',prompt:'What might the person be waiting for?',css:'detail'},
  person:{title:'Closer shot · The person',why:'The person becomes more prominent. In a filmed performance, a closer view could also help us notice expressions.',label:'SHOW THE PERSON',prompt:'What might you want to see in a real performance?',css:'person'}
};
const openings:Record<CutShot,string>={
  place:'Beginning with the place can establish where the action happens.',
  detail:'Beginning with the clock can raise a question about time.',
  person:'Beginning with the person can make us wonder about their situation.'
};
const tabs:{id:LabName;label:string}[]=[
  {id:'frame',label:'▣ Frame'},{id:'sound',label:'♫ Sound'},{id:'cut',label:'✂ Cut'},
  {id:'light',label:'☼ Light'},{id:'story',label:'✎ Make'},
  {id:'colour',label:'◐ Colour'},{id:'continuity',label:'↔ Match'}
];

export function CutIllustration({shot}:{shot:CutShot}){
  return <div className={`cut-illustration ${shot}`} role="img"
    aria-label={`Simple original drawing for ${cutShots[shot].title}`}>
    <div className="cut-sun"/><div className="cut-stop"><span>BUS</span></div>
    <div className="cut-platform"/>
    <div className="cut-person"><div className="cut-head"/><div className="cut-body"/></div>
    <div className="cut-watch"><div className="cut-hand"/></div>
    <div className="cut-frame-label">{cutShots[shot].label}</div>
  </div>;
}
type Props={
  order:CutOrder;setOrder:Dispatch<SetStateAction<CutOrder>>;
  durations:CutDurations;setDurations:Dispatch<SetStateAction<CutDurations>>;
  step:number;setStep:Dispatch<SetStateAction<number>>;
};
export function CutLab({order,setOrder,durations,setDurations,step,setStep}:Props){
  const [playing,setPlaying]=useState(false);
  const shot=cutShots[order[step]];
  const total=durations.reduce((sum,n)=>sum+n,0);

  // No global timers or legacy animation engine; every callback is tied to
  // current React state. React cleans this up on unmount (route changes).
  useEffect(()=>{
    if(!playing)return;
    const current=step;
    const timer=window.setTimeout(()=>{
      if(current>=2){setPlaying(false);return;}
      setStep(current+1);
    },durations[current]*1000);
    return ()=>window.clearTimeout(timer);
  },[playing,step,durations,setStep]);

  function select(next:number){setPlaying(false);setStep(Math.min(2,Math.max(0,next)));}
  function stopDelegation(event:MouseEvent<HTMLButtonElement>){event.stopPropagation();}
  function move(event:MouseEvent<HTMLButtonElement>,index:number,delta:-1|1){
    stopDelegation(event);setPlaying(false);
    const other=index+delta;if(other<0||other>2)return;
    setOrder(old=>{const next=[...old] as CutOrder;[next[index],next[other]]=[next[other],next[index]];return next;});
    setDurations(old=>{const next=[...old] as CutDurations;[next[index],next[other]]=[next[other],next[index]];return next;});
    setStep(other);
  }
  function changeDuration(raw:string){
    setPlaying(false);
    const number=Number(raw);const duration=Number.isFinite(number)?Math.max(1,Math.min(5,Math.round(number))):2;
    setDurations(old=>{const next=[...old] as CutDurations;next[step]=duration;return next;});
  }
  function reset(event:MouseEvent<HTMLButtonElement>){
    stopDelegation(event);setPlaying(false);
    setOrder(['place','detail','person']);setDurations([2,2,2]);setStep(0);
  }
  function togglePlay(event:MouseEvent<HTMLButtonElement>){
    stopDelegation(event);
    if(playing){setPlaying(false);return;}
    setStep(0);setPlaying(true);
  }
  return <div className="page react-cut-lab cut-v2" data-v2-cut-screen="true">
    <div className="page-intro cut-v2-intro">
      <div className="cut-v2-kicker"><span className="eyebrow">YOUR CINEMATIC EDITING STUDIO</span>
        <span className="cut-v2-course-tag">✦ REAL CUT LAB</span></div>
      <div className="cut-v2-hero"><div>
        <h1>You're editing the scene.</h1>
        <p>Three shots, one moment. Change the order and pacing to tell a different story.</p>
      </div>
      <svg className="cut-v2-clapper" viewBox="0 0 100 90" aria-hidden="true">
        <rect x="9" y="34" width="82" height="48" rx="10" fill="#24485a"/>
        <rect x="8" y="12" width="78" height="20" rx="5" fill="#397a7c" transform="rotate(-9 8 12)"/>
        <path d="M24 13l11 17M48 8l11 18M72 4l11 17" stroke="#ffd38c" strokeWidth="7"/>
        <path d="M43 46l22 12-22 12Z" fill="#a4edca"/>
      </svg></div>
      <div className="cut-v2-live-status"><span className="cut-v2-status-dot" aria-hidden="true"></span>
        <strong>{cutShots[order[step]].title}</strong>
        <span>{total}s timeline · shot {step+1}/3 · {playing?'Playing now':'Ready to preview'}</span>
      </div>
    </div>
    <div className="cut-v2-intro-note"><span aria-hidden="true">✂</span>
      <p><strong>WATCH THE ORDER</strong> — Your original three drawings become a sequence. Dragging footage is not required: use the move buttons and hear how the timing *might* feel.</p>
    </div>
    <div className="cut-shell" data-v2-cut-workshop>
      <div className="cut-preview" data-v2-cut-stage>
        <div className="cut-v2-stage-head"><div><span className="eyebrow">YOUR LIVE EDIT</span>
          <strong>Watch the story change</strong></div><span>ORIGINAL STORYBOARD · 3 SHOTS</span></div>
        <div className="cinema-window">
          <div className="cinema-window-head"><span className="on-air-dot"/> SCENE 01 · YOUR CUT <span>{total}s TOTAL</span></div>
          <CutIllustration shot={order[step]}/>
        </div>
        <div className="cut-controls">
          <button type="button" className="btn-secondary" data-cut-prev disabled={step===0}
            onClick={event=>{stopDelegation(event);select(step-1);}}>← Previous</button>
          <span aria-live="polite">Shot {step+1} of 3 {playing?' · Playing...':''}</span>
          <button type="button" className="btn-secondary" data-cut-next disabled={step===2}
            onClick={event=>{stopDelegation(event);select(step+1);}}>Next →</button>
        </div>
        <div className="cut-v2-timeline-head"><div><span className="eyebrow">THE THREE SHOT TIMELINE</span><strong>Rearrange the story</strong></div><span>MOVE SHOTS LEFT OR RIGHT</span></div>
        <div className="editor-timeline" aria-label="Editable storyboard timeline">
          {order.map((id,index)=><div key={id} className={`timeline-clip ${playing&&index===step?'clip-playing':''}`}
            style={{'--weight':durations[index],'--clip-time':`${durations[index]}s`} as CSSProperties}
            aria-current={index===step}>
            <button type="button" className="clip-select" data-cut-step={index}
              onClick={event=>{stopDelegation(event);select(index);}}>
              <span>SHOT 0{index+1} · {durations[index]}s</span><strong>{cutShots[id].title.split(' · ')[1]}</strong>
            </button>
            <span className="clip-playhead" aria-hidden="true"/>
            <div className="clip-actions">
              <button type="button" data-move={`${index}:left`} disabled={index===0}
                aria-label={`Move shot ${index+1} earlier`} onClick={event=>move(event,index,-1)}>←</button>
              <button type="button" data-move={`${index}:right`} disabled={index===2}
                aria-label={`Move shot ${index+1} later`} onClick={event=>move(event,index,1)}>→</button>
            </div>
          </div>)}
        </div>
        <div className="editor-control-bar">
          <button type="button" className="cta" data-cut-play={playing?'stop':'play'} onClick={togglePlay}>
            {playing?'■ Stop preview':'▶ Play this edit'}
          </button>
          <button type="button" className="btn-secondary" data-cut-reset onClick={reset}>↺ Reset edit</button>
          <span>No video footage · Timed storyboard preview</span>
        </div>
      </div>
      <div className="cut-explain" data-v2-cut-controls>
        <span className="eyebrow">STEP 01 · EDITING DECISIONS</span>
        <h3>{shot.title}</h3><p>{shot.why}</p>
        <div className="result-box"><strong>WHAT THE FIRST SHOT MAY DO</strong><p>{openings[order[0]]}</p></div>
        <div className="cut-v2-duration-head"><span className="eyebrow">SHOT RHYTHM</span><span>1–5 SECONDS</span></div>
        <div className="duration-control">
          <label htmlFor="shotDuration">Hold selected shot: <strong>{durations[step]} seconds</strong></label>
          <input type="range" min="1" max="5" step="1" value={durations[step]} id="shotDuration"
            aria-label="Selected shot duration"
            onChange={event=>{event.stopPropagation();changeDuration(event.currentTarget.value);}}
            onInput={event=>{event.stopPropagation();changeDuration(event.currentTarget.value);}}/>
          <div className="duration-ruler"><span>1s · Quick glimpse</span><span>5s · Longer look</span></div>
        </div>
        <div className="editor-help"><strong>Try this:</strong> Move the clock to the first position. Then increase its duration. Compare the two versions. How much time does the viewer have to notice it?</div>
      </div>
    </div>
    <CutBrief order={order} durations={durations} onApply={preset => {
      setPlaying(false);
      setOrder(preset.order);
      setDurations(preset.durations);
      setStep(0);
    }} />
    <div className="cut-learning">
      <strong>What you just explored</strong>
      <p>A cut changes between shots. Shot <b>order</b> changes when viewers receive information. Shot <b>duration</b> changes how long they can look. Neither guarantees a particular emotion.</p>
      <button className="btn-secondary" type="button" data-lesson="editing">Read: Why do filmmakers cut? →</button>
    </div>
    <p className="demo-disclaimer">Original storyboard drawings; this is a teaching model of shot order and timing, not a fully featured video editor.</p>
    <div className="cut-v2-other-tools"><span className="eyebrow">NEXT · EXPLORE THE OTHER CRAFTS</span>
      <p>Every tab opens its original working Frame One lab, not a simulated copy.</p>
      <div className="lab-tabs" role="group" aria-label="Choose a creative experiment">
        {tabs.map(tab=><button className="lab-tab" type="button" key={tab.id}
          data-lab={tab.id} aria-pressed={tab.id==='cut'}>{tab.label}</button>)}
      </div>
    </div>
  </div>;
}
