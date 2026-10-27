import type { Dispatch, MouseEvent, SetStateAction } from 'react';
import type { LabName } from '../../legacy/bridge';
import { CinemaScene } from './CinemaScene';

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
  return <div className="page react-colour-lab">
    <div className="page-intro">
      <div className="eyebrow">CREATIVE LAB · 06 · COLOUR STUDY</div>
      <h1>One picture. Three colour looks.</h1>
      <p>Change the coloured overlay on an original drawing. Notice how it can change attention and atmosphere without changing the story.</p>
    </div>
    <div className="lab-tabs" role="group" aria-label="Choose a creative experiment">
      {tabs.map(tab=><button className="lab-tab" type="button" key={tab.id} data-lab={tab.id}
        aria-pressed={tab.id === 'colour'}>{tab.text}</button>)}
    </div>
    <div className="colour-shell">
      <div className="colour-compare">
        <div><span className="eyebrow">ORIGINAL PICTURE</span><CinemaScene variant="original" /></div>
        <div><span className="eyebrow">YOUR VERSION · {selected.label.toUpperCase()}</span>
          <div className="colour-picture">
            <CinemaScene variant="graded"/>
            <div className="colour-grade" aria-hidden="true" style={{background:selected.swatch,opacity}} />
          </div>
        </div>
      </div>
      <div className="colour-panel">
        <h3>Choose a colour look</h3>
        <div className="colour-choices" role="group" aria-label="Choose colour overlay">
          {(Object.entries(colourModes) as [ColourMode,typeof selected][]).map(([id,m])=>
            <button className="lab-choice" type="button" key={id} data-colour={id}
              aria-pressed={id===mode} onClick={event=>choose(event,id)}>
              <span className="colour-dot" style={{background:m.swatch}} aria-hidden="true"/>
              <strong>{m.label}</strong>
            </button>)}
        </div>
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
  </div>;
}
