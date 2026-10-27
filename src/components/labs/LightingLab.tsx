import type { Dispatch, MouseEvent, SetStateAction } from 'react';
import type { LabName } from '../../legacy/bridge';
import { LightingScene, lightingOptions, type LightingMode } from './LightingScene';

/** v0.9D fourth React Creative Lab. A drawn brightness/shadow study,
 * not physical light falloff, camera exposure or a calibrated reference.
 */
type Props = {
  mode:LightingMode; setMode:Dispatch<SetStateAction<LightingMode>>;
  power:number; setPower:Dispatch<SetStateAction<number>>;
  softness:number; setSoftness:Dispatch<SetStateAction<number>>;
};
const tabs:{id:LabName;label:string}[]=[
  {id:'frame',label:'▣ Frame'},{id:'sound',label:'♫ Sound'},{id:'cut',label:'✂ Cut'},
  {id:'light',label:'☼ Light'},{id:'story',label:'✎ Make'},
  {id:'colour',label:'◐ Colour'},{id:'continuity',label:'↔ Match'}
];
const clamp=(raw:string,min:number,max:number,fallback:number)=>{
  const n=Number(raw);
  return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback;
};
export function LightingLab({mode,setMode,power,setPower,softness,setSoftness}:Props){
  const selected=lightingOptions[mode];
  function choose(event:MouseEvent<HTMLButtonElement>,value:LightingMode){
    event.stopPropagation(); // let React handle the change, not the old click listener
    setMode(value);
  }
  return <div className="page react-lighting-lab">
    <div className="page-intro cinematic-heading">
      <div className="eyebrow">DIRECTOR'S STUDIO / EXPERIMENT 04</div>
      <h1>Shape the light.</h1>
      <p>Move a simplified key light and change its strength and shadow edge. The expression stays the same.</p>
    </div>
    <div className="lab-tabs" role="group" aria-label="Choose a creative experiment">
      {tabs.map(tab=><button className="lab-tab" key={tab.id} type="button"
        data-lab={tab.id} aria-pressed={tab.id==='light'}>{tab.label}</button>)}
    </div>
    <div className="lab-shell cinematic-lab-shell">
      <div className="lab-preview">
        <div id="lightVisual"><LightingScene mode={mode} brightness={power} softness={softness}/></div>
        <div className="lab-hint">Original vector illustration · The sliders illustrate principles, not real-world light physics. Shadow softness is clearest with side light.</div>
      </div>
      <div className="lab-panel film-controls">
        <div className="eyebrow">LIGHTING DESK · 04</div>
        <h3>Direct the viewer's eye.</h3>
        <p>Select the light direction, then experiment with its level and the hardness of a drawn shadow edge.</p>
        <div className="lab-choices" role="group" aria-label="Illustrated light direction">
          {(Object.entries(lightingOptions) as [LightingMode,typeof selected][]).map(([id,choice])=>
            <button type="button" className="lab-choice" key={id} data-light={id}
              aria-pressed={mode===id} onClick={event=>choose(event,id)}>
              <strong>{choice.label}</strong><span>{choice.sub}</span>
            </button>)}
        </div>
        <div className="studio-slider">
          <label htmlFor="lightPower">Illustrated brightness <output id="lightPowerValue">{power}%</output></label>
          <input type="range" id="lightPower" min="20" max="100" step="5" value={power}
            aria-label="Illustrated light brightness"
            onChange={event=>{event.stopPropagation();setPower(clamp(event.currentTarget.value,20,100,90));}}
            onInput={event=>{event.stopPropagation();setPower(clamp(event.currentTarget.value,20,100,90));}}/>
          <div className="slider-ends"><span>Dimmer</span><span>Brighter</span></div>
        </div>
        <div className="studio-slider">
          <label htmlFor="lightSoft">Shadow edge (side light) <output id="lightSoftValue">{softness}% soft</output></label>
          <input type="range" id="lightSoft" min="0" max="100" step="5" value={softness}
            aria-label="Illustrated shadow edge softness"
            onChange={event=>{event.stopPropagation();setSoftness(clamp(event.currentTarget.value,0,100,35));}}
            onInput={event=>{event.stopPropagation();setSoftness(clamp(event.currentTarget.value,0,100,35));}}/>
          <div className="slider-ends"><span>Sharper</span><span>Softer</span></div>
        </div>
        <div className="result-box" role="status" aria-live="polite">
          <strong>NOTICE THIS</strong><p>{selected.description}</p>
        </div>
        <div className="light-question"><strong>DIRECTOR'S QUESTION</strong><p>{selected.question}</p></div>
      </div>
    </div>
    <div className="light-practice">
      <strong>TRY IT IN THE REAL WORLD</strong>
      <p>Photograph a still object with a safely positioned household lamp in front, beside and behind it. Keep the camera and object in place. Note how shadows and visible details change. Avoid overheating lights and never look directly at bright bulbs.</p>
      <button className="btn-secondary" type="button" data-lesson="lighting">Read the lighting lesson →</button>
    </div>
  </div>;
}
