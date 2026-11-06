import type {CSSProperties} from 'react';
import {useState} from 'react';

/** Exactly the six educational decisions in the approved, still-shipping Option B reference. */
type MissionCopy={
  id:string;title:string;unit:string;context:string;choices:[string,string,string];
  notes:[string,string,string];
};
export const APPROVED_MISSIONS:readonly MissionCopy[]=[
  {id:'see',title:'See the story',unit:'The language of film',
    context:'A person checks a message outside a quiet café. Decide where to lead attention.',
    choices:['The whole place','The character','The phone detail'],
    notes:['A wide view reveals where the action happens. The phone itself may remain small.',
      'A medium view helps us notice posture and some of the surrounding world.',
      'A close view directs attention to a detail, but can hide the location.']},
  {id:'frame',title:'Choose the frame',unit:'The language of film',
    context:'The character has just read surprising news. You want the viewer to notice a subtle expression.',
    choices:['Wide shot','Medium shot','Close-up'],
    notes:['The whole setting stays visible, but fine facial details are less prominent.',
      'The character fills more of the image while some context remains.',
      'The face becomes more visible. Expression depends on performance, not on framing alone.']},
  {id:'story',title:'Find the turning point',unit:'The language of film',
    context:'Before reading the text, the character looks around for somebody who has not arrived.',
    choices:['Show the empty street','Show the waiting person','Show the phone first'],
    notes:['Showing the surroundings may establish absence before we understand whose absence matters.',
      'Starting with the person establishes an observer; the missing visitor is still a question.',
      'A phone close-up may create a mystery first, delaying the physical situation.']},
  {id:'light',title:'Shape the light',unit:'The language of film',
    context:'The story takes place near sunset. Choose a starting light treatment to explore.',
    choices:['Cool overcast','Warm afternoon','High contrast'],
    notes:['A cool treatment might suggest shade or another time of day. The script and real lighting still matter.',
      'Warm colour can support the late-afternoon idea, although a colour overlay alone does not recreate sunlight.',
      'Higher contrast shapes the graphic but cannot physically change where the light falls.']},
  {id:'sound',title:'Hear the unseen',unit:'The language of film',
    context:'The character stands alone, but the world outside the frame could be active.',
    choices:['Quiet room tone','Distant traffic','Distant birds'],
    notes:['A quieter layer can leave more space for nearby actions. It does not establish a busy street.',
      'Traffic ambience can imply movement and activity beyond the visible street.',
      'Birdsong may suggest an outdoor environment but not necessarily a busy road.']},
  {id:'project',title:'Make your scene',unit:'The language of film',
    context:'Your simple sequence: establish the place, observe the character and reveal the message.',
    choices:['Place → person → detail','Detail → person → place','Person → detail → place'],
    notes:['This sequence builds context before narrowing attention. A useful starting plan, not the only valid edit.',
      'This sequence begins with a question and then reveals the larger setting.',
      'This sequence starts with character and develops toward the surrounding context.']}
];

const TITLES=['A scene is a question.','What would you choose?','What changes when you look closer?','Take the idea into the real world.'];
const LABELS=['LOOK','DECIDE','EXPERIMENT','MAKE'];
const BUTTONS=['Let’s make a choice','See what it changes','Try the mini challenge','Complete this mission'];
const PRACTICES=[
  'Record one wide shot to show the setting.',
  'Record a medium view to establish the action.',
  'Record a close-up to reveal a small detail.'
];
const ART_SCENE='./option-b-assets/scene.svg';

export function cropFeedback(zoom:number){
  return zoom<1.3
    ? 'More of the world stays in view. Use this space to show location and relationships.'
    : zoom<1.8
      ? 'A balanced crop guides attention toward the character while retaining some context.'
      : 'The tighter frame makes the character and phone larger. The setting becomes less clear.';
}
function sceneZoom(m:MissionCopy,index:number){
  if(m.id==='light')return 1.15;
  if(m.id==='sound')return 1.25;
  if(m.id==='project')return [1,1.25,1.6][index];
  return [1,1.35,1.85][index];
}
function sceneKind(m:MissionCopy,index:number){
  return m.id==='light'?(['cool','warm','contrast'] as const)[index]:'neutral';
}
function choiceMode(m:MissionCopy,index:number){
  if(m.id==='light')return ['Cool','Warm','Contrast'][index];
  if(m.id==='sound')return ['Quiet','Traffic','Birds'][index];
  return ['Wide','Medium','Close'][index];
}
function choiceSubtitle(m:MissionCopy,index:number){
  if(m.id==='light')return ['Cool','Warm','Bold'][index];
  if(m.id==='sound')return ['Quiet','City','Nature'][index];
  return ['Wide','Medium','Close'][index];
}
function ArrowIcon(){
  return <svg className="node-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14m-6-6 6 6-6 6"/>
  </svg>;
}
export function OptionBReactScene({mode='medium',value=1.3,kind='neutral',guides=false,lab=false}:{
  mode?:string;value?:number;kind?:string;guides?:boolean;lab?:boolean;
}){
  const filter=kind==='warm'?'sepia(.05) saturate(1.05)'
    :kind==='cool'?'hue-rotate(20deg) saturate(.84) brightness(.99)'
    :kind==='contrast'?'contrast(1.25) brightness(.89)':'none';
  const vars={
    '--scene-zoom':value,
    '--scene-filter':filter,
    '--guides':guides?'1':'0'
  } as CSSProperties;
  return <div className={'scene-card'+(lab?' lab-scene':'')} style={vars}>
    <img src={ART_SCENE} alt="A filmmaker checking a phone on a village street"/>
    <span className="scene-hud">{lab?'LIVE STORYBOARD':mode.toUpperCase()+' · ORIGINAL ILLUSTRATION'}</span>
    <span className="frame-grid" aria-hidden="true"/>
    <span className="corners" aria-hidden="true"/>
  </div>;
}

const Scene=OptionBReactScene;

function MissionTop({mission,index,step,onBack}:{
  mission:MissionCopy;index:number;step:number;onBack:()=>void;
}){
  return <>
    <div className="mission-top">
      <button className="back" type="button" onClick={onBack} aria-label="Back to journey">‹</button>
      <div className="mission-meta">
        <span className="eyebrow">CHAPTER 01 · {mission.unit.toUpperCase()}</span>
        <h2>{mission.title}</h2>
      </div>
      <span className="head-pill">{index+1} / 6</span>
    </div>
    <div className="lesson-step-track" aria-label={'Lesson step '+(step+1)+' of 4'}>
      {[0,1,2,3].map(n=><span key={n} className={n<=step?'filled':''}/>)}
    </div>
  </>;
}

/**
 * Native React version of the approved Observe → Decide → Experiment → Make
 * lesson. This is still a six-mission design pilot, not the 33-lesson course.
 */
export function OptionBReactMission({missionId,onBack,onRestart,onComplete,onStepChange,zoom,onZoomChange}:{
  missionId:string;onBack:()=>void;onRestart:()=>void;onComplete:(id:string)=>void;onStepChange:()=>void;
  zoom:number;onZoomChange:(value:number)=>void;
}){
  const missionIndex=Math.max(0,APPROVED_MISSIONS.findIndex(m=>m.id===missionId));
  const m=APPROVED_MISSIONS[missionIndex];
  const [step,setStep]=useState(0);
  const [selected,setSelected]=useState<number|null>(null);
  const [guides]=useState(false);
  const [practice,setPractice]=useState([false,false,false]);
  const [complete,setComplete]=useState(false);

  const moveNext=()=>{
    if(step===1&&selected===null)return;
    if(step===3){
      onComplete(m.id);
      setComplete(true);
    }else setStep(i=>Math.min(3,i+1));
    onStepChange();
  };
  return <div className="screen" data-v2-native-screen="mission" data-v2-native-mission-id={m.id}
    data-v2-native-mission-step={complete?'complete':String(step)}>
    <MissionTop mission={m} index={missionIndex} step={step} onBack={onBack}/>
    {complete
      ? <div className="celebrate">
          <span className="trophy">🏆</span>
          <span className="eyebrow">MISSION COMPLETE</span>
          <h1>You made a filmmaker's choice.</h1>
          <p>There isn't always one correct creative answer. You explored what the framing can reveal, and finished the challenge.</p>
          <div className="reward-number">+20 creative points</div>
          <button type="button" className="btn btn-primary btn-wide" onClick={onBack}>
            Back to the journey <ArrowIcon/>
          </button>
          <div style={{height:12}}/>
          <button type="button" className="btn btn-secondary btn-wide" onClick={onRestart}>Try another version</button>
        </div>
      : <div className="mission-content">
        <div className="lesson-prompt">
          <span className="lesson-step-label">STEP {step+1} OF 4 · {LABELS[step]}</span>
          <h1>{TITLES[step]}</h1>
          <p>{step===0
            ? 'Notice the person, the street and the phone. We are looking at one illustration, not actual footage.'
            :step===1?m.context
              :step===2?'Change the view. Compare what stays visible and what the frame removes.'
                :'Use your own phone for a tiny filmmaking experiment.'}</p>
        </div>
        {step===0&&<>
          <Scene mode="wide" value={1}/>
          <div className="observe-card"><span className="eyebrow">LOOK CLOSER</span>
            <p>The street, character and phone are all in the scene. A filmmaker can guide attention by choosing what the frame includes and what it leaves out.</p>
          </div>
        </>}
        {step===1&&<>
          <Scene mode={selected===null?'medium':choiceMode(m,selected)}
            value={selected===null?1.2:sceneZoom(m,selected)}
            kind={selected===null?'neutral':sceneKind(m,selected)}/>
          <div className="choice-grid" role="group" aria-label="Choose a storytelling approach">
            {m.choices.map((c,i)=><button key={i} type="button"
              className={'choice-option '+(selected===i?'selected':'')}
              aria-pressed={selected===i} data-v2-native-choice={i}
              onClick={()=>setSelected(i)}>
              <span className="choice-ring">{selected===i?'✓':''}</span>
              <strong>{c}</strong><small>{choiceSubtitle(m,i)}</small>
            </button>)}
          </div>
          {selected!==null&&<div className="feedback">
            <h3>✦ Director's note</h3><p>{m.notes[selected]}</p>
          </div>}
        </>}
        {step===2&&<>
          <Scene mode="compare" value={zoom} kind={m.id==='light'?'warm':'neutral'} guides={guides}/>
          <div className="scene-range">
            <label htmlFor="nativeMissionZoom"><span>Adjust the crop</span><b id="nativeMissionZoomLabel">{zoom.toFixed(1)}×</b></label>
            <input type="range" min="1" max="2.2" step="0.1" value={zoom}
              id="nativeMissionZoom" data-v2-native-zoom aria-label="Adjust framing crop"
              onChange={e=>onZoomChange(Math.min(2.2,Math.max(1,Number(e.target.value)||1)))}/>
            <div className="range-labels"><span>More environment</span><span>More detail</span></div>
          </div>
          <div className="feedback is-warm"><h3>🧭 Filmmaker's eye</h3><p id="nativeCropInsight">{cropFeedback(zoom)}</p></div>
          <p className="note-honest">This crop changes what is visible. It does not simulate camera movement, lenses, real lighting or acting.</p>
        </>}
        {step===3&&<>
          <Scene mode="practise" value={1.3}/>
          <div className="practice-card">
            <span className="eyebrow">YOUR MINI FILM CHALLENGE</span>
            <h3>Make a three-shot moment</h3>
            <p>Use an everyday object or a willing friend. Shoot safely, then compare what each shot reveals.</p>
            {PRACTICES.map((item,i)=><label className="practice-row" key={i}>
              <input type="checkbox" data-v2-native-practice={i}
                checked={practice[i]} onChange={e=>setPractice(current=>current.map((v,n)=>n===i?e.target.checked:v))}/>
              <span>{item}</span>
            </label>)}
          </div>
          <p className="note-honest">The checkboxes are your own report. The prototype does not record video or access your camera.</p>
        </>}
        <div className="lesson-bottom">
          <button type="button" className="btn btn-primary btn-wide" data-v2-native-next-step
            disabled={step===1&&selected===null} onClick={moveNext}>
            {BUTTONS[step]} <ArrowIcon/>
          </button>
          <div style={{height:12}}/>
          {step>0&&<button type="button" className="btn btn-secondary btn-wide" data-v2-native-previous-step onClick={()=>{setStep(v=>Math.max(0,v-1));onStepChange();}}>← Previous step</button>}
        </div>
      </div>}
  </div>;
}
