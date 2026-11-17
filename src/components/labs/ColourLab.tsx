import type { Dispatch, MouseEvent, SetStateAction } from 'react';
import type { LabName } from '../../legacy/bridge';
import { CinemaScene } from './CinemaScene';
import { ColourStoryBriefs } from './ColourStoryBriefs';
import './option-b-colour-lab.css';

/** v0.9D second native-React Creative Lab, preserving the v0.8B visual
 * experiment. A tint overlay is NOT colour grading or a lens simulation.
 * The five remaining labs stay in the legacy runtime until migrated.
 */
export type ColourMode = 'neutral' | 'warm' | 'cool';
export const colourModes: Record<ColourMode,{label:string; swatch:string; desc:string}> = {
  neutral: {label:'Neutral illustration',swatch:'#a8a7ad',desc:'This is the original drawing without a coloured overlay. Watch the colours and the bright background.'},
  warm: {label:'Warm overlay',swatch:'#d98d4c',desc:'A warm orange overlay changes the colour balance of this original illustration. That could help suggest a warm environment, but it does not automatically make the scene happy.'},
  cool: {label:'Cool overlay',swatch:'#4386bb',desc:'A blue overlay changes the colours you notice. Some viewers may read it differently, but blue is not a universal signal for sadness.'}
};
type Props = {
  mode: ColourMode;
  setMode: Dispatch<SetStateAction<ColourMode>>;
  strength: number;
  setStrength: Dispatch<SetStateAction<number>>;
};
const tabs: {id:LabName; text:string}[] = [
  {id:'frame',text:'▣ Frame'}, {id:'sound',text:'♫ Sound'},
  {id:'cut',text:'✂ Cut'}, {id:'light',text:'☼ Light'},
  {id:'story',text:'✎ Make'}, {id:'colour',text:'◐ Colour'},
  {id:'continuity',text:'↔ Match'}
];
export function ColourLab({mode,setMode,strength,setStrength}:Props) {
  const selected = colourModes[mode];
  // Neutral deliberately has zero overlay, whatever slider level is set.
  const opacity = mode === 'neutral' ? 0 : Math.max(0,Math.min(100,strength))/100*.42;
  function choose(event:MouseEvent<HTMLButtonElement>, next:ColourMode) {
    event.stopPropagation(); // legacy delegated handler must not mutate React-owned state
    setMode(next);
  }
  const updateStrength = (value:string) => setStrength(Math.max(0,Math.min(100,Number(value)||0)));
  return <div className="page react-colour-lab colour-v2" data-v2-colour-screen="true">
    <div className="page-intro colour-v2-intro">
      <div className="colour-v2-kicker"><span className="eyebrow">THE FILMMAKER'S COLOUR STUDIO</span>
        <span className="colour-v2-course-tag">✦ LIVE COLOUR LAB</span></div>
      <div className="colour-v2-hero"><div><h1>One picture. Three colour looks.</h1>
        <p>Change one original illustration and discover how colour can influence what we notice.</p></div>
        <svg className="colour-v2-palette-art" viewBox="0 0 100 96" aria-hidden="true">
          <path d="M16 48C16 23 36 9 61 12c21 2 35 19 31 40-3 16-16 19-30 18-12-1-17 7-14 17-26 2-44-16-32-39Z" fill="#ffffff" stroke="#2e9580" strokeWidth="4"/>
          <circle cx="42" cy="29" r="9" fill="#facb87"/><circle cx="66" cy="31" r="9" fill="#77c6a5"/>
          <circle cx="80" cy="52" r="9" fill="#87b6dd"/><circle cx="32" cy="57" r="9" fill="#e9a17e"/>
          <circle cx="54" cy="52" r="7" fill="#fff2d0" stroke="#a9d7bb" strokeWidth="2"/>
        </svg>
      </div>
      <div className="colour-v2-live-status" aria-label="Current live colour overlay selection">
        <span className="colour-v2-status-dot" aria-hidden="true"></span>
        <strong>{selected.label}</strong>
        <span>{mode==='neutral'?'Original colours · no tint':strength+'% slider · '+Math.round(opacity*100)+'% max visual overlay alpha'}</span>
      </div>
    </div>
    <div className="colour-v2-quick-jump" role="group" aria-label="Quick switch to other working film labs">
      <span className="eyebrow">QUICK STUDIO SWITCH</span>
      <div><button type="button" data-lab="story">✎ Make</button>
        <button type="button" data-lab="frame">▣ Frame</button>
        <button type="button" data-lab="continuity">↔ Match</button></div>
    </div>
    <div className="colour-v2-observe"><span aria-hidden="true">◐</span><p><strong>COMPARE THE IMAGES</strong> — The left image never changes. The right shows your live overlay.</p></div>
    <div className="colour-shell" data-v2-colour-workshop>
      <div className="colour-compare" data-v2-colour-stage>
        <div><span className="eyebrow">ORIGINAL PICTURE</span><CinemaScene variant="original" /></div>
        <div><span className="eyebrow">YOUR VERSION · {selected.label.toUpperCase()}</span>
          <div className="colour-picture">
            <CinemaScene variant="graded"/>
            <div className="colour-grade" aria-hidden="true" style={{background:selected.swatch,opacity}} />
          </div>
        </div>
      </div>
      <div className="colour-panel" data-v2-colour-controls>
        <div className="eyebrow">STEP 01 · CHOOSE YOUR LOOK</div>
        <h3>Choose a colour look</h3>
        <p className="colour-v2-control-intro">Neutral, warm and cool use the same original drawing. These are illustration overlays, not film colour grades.</p>
        <div className="colour-v2-control-label"><span className="eyebrow">THREE LOOKS</span><span>CHOOSE ONE</span></div>
        <div className="colour-choices" role="group" aria-label="Choose colour overlay">
          {(Object.entries(colourModes) as [ColourMode,typeof selected][]).map(([id,m])=>
            <button className="lab-choice" type="button" key={id} data-colour={id}
              aria-pressed={id===mode} onClick={event=>choose(event,id)}>
              <span className="colour-dot" style={{background:m.swatch}} aria-hidden="true"/>
              <strong>{m.label}</strong>
            </button>)}
        </div>
        <div className="colour-v2-control-label"><span className="eyebrow">FINE-TUNE THE LOOK</span><span>0–100%</span></div>
        <label htmlFor="colourStrength">Overlay strength <output id="colourStrengthValue">{strength}%</output></label>
        <input id="colourStrength" type="range" min="0" max="100" step="5" value={strength}
          aria-label="Illustration colour overlay strength"
          onChange={event=>{event.stopPropagation();updateStrength(event.currentTarget.value);}}
          onInput={event=>{event.stopPropagation();updateStrength(event.currentTarget.value);}}/>
        <div className="result-box" aria-live="polite">
          <strong>WHAT CHANGED?</strong><p>{selected.desc}</p>
        </div>
        <p className="studio-fact">Teaching illustration only: a coloured overlay is not colour grading, a camera colour transform, or a colour-accurate reference. Screen settings and perception also affect what people see.</p>
        <button className="btn-secondary" type="button" data-lesson="colour">Read the colour lesson →</button>
      </div>
    </div>
    <ColourStoryBriefs mode={mode} strength={strength}
      onApply={(nextMode,nextStrength) => {
        setMode(nextMode);
        setStrength(nextStrength);
      }} />
    <div className="colour-v2-other-tools">
      <span className="eyebrow">YOUR NEXT FILMMAKING CRAFT</span>
      <p>These seven links open the actual working studios with their original controls.</p>
      <div className="lab-tabs" role="group" aria-label="Choose a creative experiment">
        {tabs.map(tab=><button className="lab-tab" type="button" key={tab.id} data-lab={tab.id}
          aria-pressed={tab.id === 'colour'}>{tab.text}</button>)}
      </div>
    </div>
  </div>;
}
