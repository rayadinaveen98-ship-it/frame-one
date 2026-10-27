import type { Dispatch, MouseEvent, SetStateAction } from 'react';
import type { LabName } from '../../legacy/bridge';
import { CinemaScene } from './CinemaScene';

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
  return <div className="page react-frame-lab">
    <div className="page-intro cinematic-heading">
      <div className="eyebrow">DIRECTOR'S STUDIO / EXPERIMENT 01</div>
      <h1>One moment. Many frames.</h1>
      <p>Explore one original drawing with different crops. Watch what becomes prominent and what disappears.</p>
    </div>
    <div className="lab-tabs" role="group" aria-label="Choose a creative experiment">
      {tabs.map(tab=><button className="lab-tab" type="button" key={tab.id}
        data-lab={tab.id} aria-pressed={tab.id==='frame'}>{tab.label}</button>)}
    </div>
    <div className="lab-shell cinematic-lab-shell">
      <div className="lab-preview cinematic-preview">
        {compare?<div className="frame-comparison">
          <div><span className="compare-tag">YOUR CROP · {Number(bounded.toFixed(2))}×</span>
            <CinemaScene variant="frame" zoom={bounded} guides={guides} shotLabel={selected.label}/></div>
          <div><span className="compare-tag">REFERENCE · TIGHT CROP</span>
            <CinemaScene variant="reference" zoom={3} guides={guides} shotLabel="Close-up"/></div>
        </div>:<CinemaScene variant="frame" zoom={bounded} guides={guides} shotLabel={selected.label}/>}
        <div className="lab-hint">Animated original storyboard · On-screen cropping, not lens simulation</div>
      </div>
      <div className="lab-panel film-controls">
        <div className="eyebrow">FRAMING DESK · 01</div>
        <h3>How close should we look?</h3>
        <p>The person waits at a bus stop. Choose a preset or gradually crop tighter. Which part of the scene grabs your attention?</p>
        <div className="lab-choices" role="group" aria-label="Select framing crop">
          {(Object.entries(frameOptions) as [FrameMode,typeof selected][]).map(([key,option])=>
            <button className="lab-choice" type="button" key={key} data-frame={key}
              aria-pressed={mode===key} onClick={event=>choose(event,key)}>
              <strong>{option.label}</strong><span>{option.sub}</span>
            </button>)}
        </div>
        <div className="studio-slider">
          <label htmlFor="frameZoom">Interactive crop <output id="frameZoomValue">{bounded.toFixed(1)}×</output></label>
          <input id="frameZoom" type="range" min="1" max="3" step="0.05" value={bounded}
            aria-label="Crop the existing illustration tighter"
            onChange={event=>{event.stopPropagation();update(event.currentTarget.value);}}
            onInput={event=>{event.stopPropagation();update(event.currentTarget.value);}}/>
          <div className="slider-ends"><span>See more surroundings</span><span>See less surroundings</span></div>
        </div>
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
        <button className="btn-secondary" type="button" data-lesson="framing">Read the framing lesson →</button>
      </div>
    </div>
  </div>;
}
