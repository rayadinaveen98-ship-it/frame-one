import type { Dispatch, MouseEvent, SetStateAction } from 'react';
import type { LabName } from '../../legacy/bridge';
import { CinemaScene } from './CinemaScene';
import { FramingIntention } from './FramingIntention';
import './option-b-frame-lab.css';

/** Native React framing exercise. Cropping a fixed SVG is not a physical
 * camera move, a lens change or a claim about perspective. */
export type FrameMode = 'wide'|'medium'|'close';
export const frameOptions: Record<FrameMode,{label:'Wide shot'|'Medium shot'|'Close-up';sub:string;description:string;zoom:number}> = {
  wide:{label:'Wide shot',sub:'See more of the surroundings',description:'The person looks smaller and we see more of the place around them. Depending on the story, this might suggest loneliness, freedom or the size of the location.',zoom:1},
  medium:{label:'Medium shot',sub:'Notice gestures and some surroundings',description:'The person takes up more of the picture. We can notice gestures while still seeing some of the space around them. Medium shots are common in conversations.',zoom:2},
  close:{label:'Close-up',sub:'Notice the face and small reactions',description:'The face takes up more of the picture, so small expressions become easier to notice. A close-up can feel warm, funny or tense depending on the scene.',zoom:3}
};
type Props = {
  mode:FrameMode;
  setMode:Dispatch<SetStateAction<FrameMode>>;
  zoom:number;
  setZoom:Dispatch<SetStateAction<number>>;
  guides:boolean;
  setGuides:Dispatch<SetStateAction<boolean>>;
  compare:boolean;
  setCompare:Dispatch<SetStateAction<boolean>>;
};
const tabs: {id:LabName; label:string}[] = [
  {id:'frame',label:'▣ Frame'},{id:'sound',label:'♫ Sound'},
  {id:'cut',label:'✂ Cut'},{id:'light',label:'☼ Light'},
  {id:'story',label:'✎ Make'},{id:'colour',label:'◐ Colour'},
  {id:'continuity',label:'↔ Match'}
];
const frameForZoom = (value:number):FrameMode => value<1.5?'wide':value<2.5?'medium':'close';

export function FrameLab({mode,setMode,zoom,setZoom,guides,setGuides,compare,setCompare}:Props) {
  const bounded = Math.max(1,Math.min(3,zoom));
  const selected = frameOptions[mode];
  // Comparing a 3× crop with another 3× crop teaches nothing. Show the
  // opposite extreme instead so the two *real* SVG viewBoxes differ.
  const referenceZoom=bounded>=2.5?1:3;
  const referenceLabel=referenceZoom===1?'Wide shot':'Close-up';
  function choose(event:MouseEvent<HTMLButtonElement>,next:FrameMode) {
    event.stopPropagation(); // the legacy click handler must never re-render React-owned content
    setMode(next);
    setZoom(frameOptions[next].zoom);
  }
  function update(value:string){
    const parsed = Number(value);
    const next = Number.isFinite(parsed)?Math.max(1,Math.min(3,parsed)):1;
    setZoom(next);
    setMode(frameForZoom(next));
  }
  return <div className="page react-frame-lab frame-v2" data-v2-frame-screen="true">
    <div className="page-intro cinematic-heading frame-v2-intro">
      <div className="frame-v2-kicker"><span className="eyebrow">YOUR VISUAL LANGUAGE STUDIO</span><span className="frame-v2-course-tag">✦ REAL FRAME LAB</span></div>
      <div className="frame-v2-hero">
        <div>
          <h1>One moment. Many frames.</h1>
          <p>One original scene. Three ways to look. Choose what the viewer notices first.</p>
        </div>
        <svg aria-hidden="true" className="frame-v2-art" viewBox="0 0 100 96">
          <rect x="9" y="17" width="83" height="63" rx="12" fill="#e8f9ef" stroke="#2e9780" strokeWidth="4"/>
          <path d="M36 17v63m28-63v63M9 38h83M9 59h83" stroke="#83ccb0" strokeWidth="2"/>
          <path d="M26 66l17-18 13 11 21-23 5 7v27H20Z" fill="#b1e8cf"/>
          <circle cx="65" cy="36" r="8" fill="#f6ca83"/>
          <path d="M77 10h13M90 10v13M15 85H3M3 85V73" stroke="#329580" strokeWidth="4" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="frame-v2-live-status" aria-label="Live framing controls status">
        <span className="frame-v2-status-dot" aria-hidden="true"></span>
        <span className="frame-v2-status-text"><strong>{selected.label}</strong><small>{bounded.toFixed(1)}× illustration crop</small></span>
        <span className="frame-v2-status-pills"><span>{guides?'Guides on':'Guides off'}</span><span>{compare?'Two frames':'Single frame'}</span></span>
      </div>
    </div>
    <div className="frame-v2-focus-note"><span className="frame-v2-focus-icon" aria-hidden="true">◉</span><p><strong>LOOK FIRST</strong> — Change the frame size below and notice which visual details disappear.</p></div>
    <div className="lab-shell cinematic-lab-shell" data-v2-frame-workshop>
      <div className="lab-preview cinematic-preview" data-v2-frame-stage>
        <div className="frame-v2-stage-head"><div><span className="eyebrow">YOUR LIVE FRAME</span><strong>{compare?'Compare your crop':'See the scene change'}</strong></div><span>16:9 · ORIGINAL ART</span></div>
        {compare?<div className="frame-comparison">
          <div><span className="compare-tag">YOUR CROP · {Number(bounded.toFixed(2))}×</span>
            <CinemaScene variant="frame" zoom={bounded} guides={guides} shotLabel={selected.label}/></div>
          <div><span className="compare-tag">{referenceZoom===1?'REFERENCE · WIDE CROP':'REFERENCE · TIGHT CROP'}</span>
            <CinemaScene variant="reference" zoom={referenceZoom} guides={guides} shotLabel={referenceLabel}/></div>
        </div>:<CinemaScene variant="frame" zoom={bounded} guides={guides} shotLabel={selected.label}/>}
        <div className="lab-hint">Original illustrated bus-stop scene · A digital crop, not a physical camera move or lens simulation.</div>
      </div>
      <div className="lab-panel film-controls" data-v2-frame-controls>
        <div className="eyebrow">STEP 01 · FRAME THE MOMENT</div>
        <h3>How close should we look?</h3>
        <p>The person waits at a bus stop. Choose a framing preset or crop gently tighter. Which details do we gain—and lose?</p>
        <div className="frame-v2-control-label"><span className="eyebrow">SHOT SIZE</span><span>THREE WAYS TO SEE</span></div>
        <div className="lab-choices" role="group" aria-label="Select framing crop">
          {(Object.entries(frameOptions) as [FrameMode,typeof selected][]).map(([key,option])=>
            <button className="lab-choice" type="button" key={key} data-frame={key}
              aria-pressed={mode===key} onClick={event=>choose(event,key)}>
              <strong>{option.label}</strong><span>{option.sub}</span>
            </button>)}
        </div>
        <div className="frame-v2-control-label"><span className="eyebrow">FINE-TUNE THE CROP</span><span>1.0–3.0×</span></div>
        <div className="studio-slider">
          <label htmlFor="frameZoom">Interactive crop <output id="frameZoomValue">{bounded.toFixed(1)}×</output></label>
          <input id="frameZoom" type="range" min="1" max="3" step="0.05" value={bounded}
            aria-label="Crop the existing illustration tighter"
            onChange={event=>{event.stopPropagation();update(event.currentTarget.value);}}
            onInput={event=>{event.stopPropagation();update(event.currentTarget.value);}}/>
          <div className="slider-ends"><span>See more surroundings</span><span>See less surroundings</span></div>
        </div>
        <div className="frame-v2-control-label"><span className="eyebrow">OVERLAYS & COMPARISON</span><span>OPTIONAL</span></div>
        <div className="lab-tool-row">
          <button className="btn-secondary" type="button" data-guides aria-pressed={guides}
            onClick={event=>{event.stopPropagation();setGuides(value=>!value);}}>
            {guides?'✓ Framing guides':'Show framing guides'}
          </button>
          <button className="btn-secondary" type="button" data-compare aria-pressed={compare}
            onClick={event=>{event.stopPropagation();setCompare(value=>!value);}}>
            {compare?'Hide comparison':'Compare crops'}
          </button>
        </div>
        <div className="result-box" aria-live="polite">
          <strong>ONE POSSIBLE INTERPRETATION</strong><p>{selected.description}</p>
        </div>
        <p className="studio-fact">This changes the crop of an existing picture. A camera move or a different lens could produce different perspective and background effects.</p>
        <div className="studio-next"><span>KEEP EXPLORING</span>
          <button className="btn-secondary" type="button" data-lab="sound">02 · Try changing the sound →</button>
          <button className="btn-secondary" type="button" data-lesson="shot">Read the connected lesson →</button>
        </div>
      </div>
    </div>
    <FramingIntention mode={mode} zoom={bounded} guides={guides}
      onApply={(nextMode,nextZoom,nextGuides)=>{
        setMode(nextMode);
        setZoom(nextZoom);
        setGuides(nextGuides);
        setCompare(false);
      }} />
    <div className="frame-v2-other-tools">
      <span className="eyebrow">WHEN YOU'RE READY · CONTINUE CREATING</span>
      <p>Every option opens its original working lab. Your Frame Lab settings stay in the existing React session.</p>
      <div className="lab-tabs" role="group" aria-label="Choose a creative experiment">
        {tabs.map(tab=><button className="lab-tab" type="button" key={tab.id}
          data-lab={tab.id} aria-pressed={tab.id==='frame'}>{tab.label}</button>)}
      </div>
    </div>
  </div>;
}
