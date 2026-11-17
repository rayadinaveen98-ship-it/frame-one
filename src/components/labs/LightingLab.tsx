import type { Dispatch, MouseEvent, SetStateAction } from 'react';
import type { LabName } from '../../legacy/bridge';
import { LightingScene, lightingOptions, type LightingMode } from './LightingScene';
import { LightingBrief } from './LightingBrief';
import './option-b-lighting-lab.css';

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
  return <div className="page react-lighting-lab lighting-v2" data-v2-lighting-screen="true">
    <div className="page-intro cinematic-heading lighting-v2-intro">
      <div className="lighting-v2-kicker">
        <span className="eyebrow">THE FILMMAKER'S LIGHT STUDIO</span>
        <span className="lighting-v2-course-tag">✦ REAL LIGHTING LAB</span>
      </div>
      <div className="lighting-v2-hero">
        <div><h1>Shape the light.</h1>
          <p>The same face, three directions. Discover what light reveals—and what it leaves in shadow.</p>
        </div>
        <svg className="lighting-v2-lamp-art" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M38 11h26l14 24-12 17H34L23 35Z" fill="#f8d796" stroke="#398f78" strokeWidth="4" strokeLinejoin="round"/>
          <circle cx="51" cy="35" r="13" fill="#fff2c8"/>
          <path d="M51 4v-3M24 13l-9-8M79 12l10-8M11 36H2m95 0h-9M23 60l-9 9M78 60l10 9"
            stroke="#4eaa8a" strokeWidth="4" strokeLinecap="round"/>
          <rect x="45" y="51" width="13" height="23" rx="5" fill="#315e68"/>
          <path d="M51 74v18M31 92h40" stroke="#315e68" strokeWidth="7" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="lighting-v2-live-status" aria-label="Current illustrative lighting settings">
        <span className="lighting-v2-status-dot" aria-hidden="true"></span>
        <strong>{selected.label}</strong>
        <span className="lighting-v2-live-facts">{power}% brightness <span aria-hidden="true">·</span> {softness}% soft edge</span>
      </div>
    </div>
    <div className="lighting-v2-direction-note">
      <span className="lighting-v2-direction-icon" aria-hidden="true">☼</span>
      <p><strong>OBSERVE FIRST</strong> — Change the light direction and compare the shadows in the original illustrated face.</p>
    </div>
    <div className="lab-shell cinematic-lab-shell" data-v2-lighting-workshop>
      <div className="lab-preview" data-v2-lighting-stage>
        <div className="lighting-v2-stage-head"><div><span className="eyebrow">YOUR LIVE LIGHT STUDY</span>
          <strong>Move the light, watch the face</strong></div><span>ORIGINAL VECTOR · 16:9</span></div>
        <div id="lightVisual"><LightingScene mode={mode} brightness={power} softness={softness}/></div>
        <div className="lab-hint">Original vector illustration · The sliders illustrate principles, not real-world light physics. Shadow softness is clearest with side light.</div>
      </div>
      <div className="lab-panel film-controls" data-v2-lighting-controls>
        <div className="eyebrow">STEP 01 · SCULPT THE MOMENT</div>
        <h3>Direct the viewer's eye.</h3>
        <p>Select a light direction, then change the brightness and the edge of the illustrated shadow.</p>
        <div className="lighting-v2-section-label"><span className="eyebrow">LIGHT DIRECTION</span><span>THREE ORIGINAL STUDIES</span></div>
        <div className="lab-choices" role="group" aria-label="Illustrated light direction">
          {(Object.entries(lightingOptions) as [LightingMode,typeof selected][]).map(([id,choice])=>
            <button type="button" className="lab-choice" key={id} data-light={id}
              aria-pressed={mode===id} onClick={event=>choose(event,id)}>
              <strong>{choice.label}</strong><span>{choice.sub}</span>
            </button>)}
        </div>
        <div className="lighting-v2-section-label"><span className="eyebrow">LIGHT INTENSITY</span><span>20–100%</span></div>
        <div className="studio-slider">
          <label htmlFor="lightPower">Illustrated brightness <output id="lightPowerValue">{power}%</output></label>
          <input type="range" id="lightPower" min="20" max="100" step="5" value={power}
            aria-label="Illustrated light brightness"
            onChange={event=>{event.stopPropagation();setPower(clamp(event.currentTarget.value,20,100,90));}}
            onInput={event=>{event.stopPropagation();setPower(clamp(event.currentTarget.value,20,100,90));}}/>
          <div className="slider-ends"><span>Dimmer</span><span>Brighter</span></div>
        </div>
        <div className="lighting-v2-section-label"><span className="eyebrow">SHADOW EDGE</span><span>BEST WITH SIDE LIGHT</span></div>
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
    <LightingBrief mode={mode} power={power} softness={softness}
      onPreset={(direction, brightness, edge) => {
        setMode(direction); setPower(brightness); setSoftness(edge);
      }} />
    <div className="light-practice">
      <strong>TRY IT IN THE REAL WORLD</strong>
      <p>Photograph a still object with a safely positioned household lamp in front, beside and behind it. Keep the camera and object in place. Note how shadows and visible details change. Avoid overheating lights and never look directly at bright bulbs.</p>
      <button className="btn-secondary" type="button" data-lesson="lighting">Read the lighting lesson →</button>
    </div>
    <div className="lighting-v2-other-tools">
      <span className="eyebrow">TAKE YOUR NEXT CREATIVE STEP</span>
      <p>The seven working Frame One labs remain available. Switching crafts keeps their original React state.</p>
      <div className="lab-tabs" role="group" aria-label="Choose a creative experiment">
        {tabs.map(tab=><button className="lab-tab" key={tab.id} type="button"
          data-lab={tab.id} aria-pressed={tab.id==='light'}>{tab.label}</button>)}
      </div>
    </div>
  </div>;
}
