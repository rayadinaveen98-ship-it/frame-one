import type { Dispatch, SetStateAction, MouseEvent } from 'react';
import type { LabName } from '../../legacy/bridge';
import './option-b-continuity-lab.css';

/** v0.9D: first Creative Lab to be genuinely React-owned.
 * The six remaining labs still use the original, battle-tested HTML runtime.
 * This is a fixed-view illustrated prop-continuity study, not camera physics.
 */
export type ContinuityMode = 'match' | 'changed';
type Props = {
  mode: ContinuityMode;
  setMode: Dispatch<SetStateAction<ContinuityMode>>;
};

const tabs: { id: LabName; text: string }[] = [
  { id: 'frame', text: '▣ Frame' },
  { id: 'sound', text: '♫ Sound' },
  { id: 'cut', text: '✂ Cut' },
  { id: 'light', text: '☼ Light' },
  { id: 'story', text: '✎ Make' },
  { id: 'colour', text: '◐ Colour' },
  { id: 'continuity', text: '↔ Match' },
];

function IllustratedDesk({ title, moved }: { title: string; moved: boolean }) {
  return <div className="continuity-shot">
    <span className="eyebrow">{title}</span>
    <div className="continuity-desk" role="img"
      aria-label={`Top-view illustrated desk with a letter in the middle and a cup on the ${moved?'right':'left'}`}>
      <div className="continuity-letter" aria-hidden="true"><span /><span /><span /></div>
      <div className={`continuity-cup ${moved?'moved':''}`} aria-hidden="true"><span /></div>
      <div className="continuity-pencil" aria-hidden="true" />
    </div>
  </div>;
}

export function ContinuityLab({ mode, setMode }: Props) {
  const changed = mode === 'changed';
  const choose = (event: MouseEvent<HTMLButtonElement>, next: ContinuityMode) => {
    // Prevent the legacy document-level click handler from mutating the
    // React-owned Continuity Lab. The actual choice is typed React state.
    event.stopPropagation();
    setMode(next);
  };
  return <div className="page react-continuity-lab continuity-v2" data-v2-continuity-screen="true">
    <div className="page-intro continuity-v2-intro">
      <div className="continuity-v2-kicker"><span className="eyebrow">YOUR FILM CONTINUITY STUDIO</span>
        <span className="continuity-v2-course-tag">✦ REAL MATCH LAB</span></div>
      <div className="continuity-v2-hero"><div>
        <h1>Something moved between shots.</h1>
        <p>Two illustrations. One prop. Compare the positions before and after the cut.</p>
      </div>
      <svg className="continuity-v2-art" viewBox="0 0 98 98" aria-hidden="true">
        <rect x="6" y="13" width="37" height="48" rx="9" fill="#fdfaf0" stroke="#378d7c" strokeWidth="3"/>
        <rect x="56" y="13" width="37" height="48" rx="9" fill="#fdfaf0" stroke="#378d7c" strokeWidth="3"/>
        <path d="M22 31h13M72 31h13" stroke="#a8bdad" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="20" cy="44" r="9" fill="#f5cf8d" stroke="#caa36e" strokeWidth="3"/>
        <circle cx="79" cy="44" r="9" fill="#f5cf8d" stroke="#caa36e" strokeWidth="3"/>
        <path d="M40 76h18m-8-8 9 8-9 8" stroke="#289478" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg></div>
      <div className="continuity-v2-live-status" aria-label="Current real continuity comparison">
        <span className="continuity-v2-status-dot" aria-hidden="true"></span>
        <strong>{changed?'Prop position changed':'Prop positions match'}</strong>
        <span>{changed?'Shot B shows the cup on the other side':'Same cup position in both shots'}</span>
      </div>
    </div>
    <div className="continuity-v2-quick-jump" role="group" aria-label="Quick switch to working film labs">
      <span className="eyebrow">QUICK STUDIO SWITCH</span>
      <div><button type="button" data-lab="story">✎ Make</button>
        <button type="button" data-lab="colour">◐ Colour</button>
        <button type="button" data-lab="frame">▣ Frame</button></div>
    </div>
    <div className="continuity-v2-observe"><span aria-hidden="true">↔</span>
      <p><strong>SPOT THE CHANGE</strong> — Compare Shot A and Shot B. The viewpoint is fixed; only the cup moves.</p>
    </div>
    <div className="continuity-shell" data-v2-continuity-workshop>
      <div className="continuity-grid" data-v2-continuity-stage>
        <IllustratedDesk title="SHOT A · BEFORE THE CUT" moved={false}/>
        <IllustratedDesk title="SHOT B · AFTER THE CUT" moved={changed}/>
      </div>
      <div className="continuity-controls" data-v2-continuity-controls>
        <div className="eyebrow">STEP 01 · MATCH BETWEEN CUTS</div>
        <h3>Test the prop positions</h3>
        <p className="continuity-v2-control-intro">Imagine one uninterrupted moment: no one touches the letter or cup. Which version is consistent?</p>
        <div className="continuity-v2-control-label"><span className="eyebrow">YOUR MATCHING CHOICE</span><span>TAP TO COMPARE</span></div>
        <div className="lab-choices">
          <button type="button" className="lab-choice" data-continuity="match"
            aria-pressed={!changed} onClick={event=>choose(event,'match')}>
            <strong>Keep cup on the left</strong><span>Same position in both images</span>
          </button>
          <button type="button" className="lab-choice" data-continuity="changed"
            aria-pressed={changed} onClick={event=>choose(event,'changed')}>
            <strong>Move cup to the right</strong><span>The object shifts without a shown reason</span>
          </button>
        </div>
        <div className="result-box" role="status" aria-live="polite">
          <strong>WHAT DO YOU NOTICE?</strong>
          <p>{changed
            ? 'The cup suddenly changes sides even though we did not see it move. If the story means to show continuous time, this may be a continuity mismatch.'
            : 'The cup stays in the same place in these two illustrations. That makes the location easier to follow. Real continuity also involves movement, sound, direction and time.'}</p>
        </div>
        <p className="studio-fact">This teaching example holds the viewpoint fixed. Different camera angles can change left/right positions in the image even when a real prop has not moved. A deliberate jump may also be a storytelling choice.</p>
        <button className="btn-secondary" type="button" data-lesson="continuity">Read the continuity lesson →</button>
      </div>
    </div>
    <div className="continuity-v2-other-tools"><span className="eyebrow">EXPLORE ANOTHER REAL CRAFT</span>
      <p>Return to the seven original working Creative Labs at any time.</p>
      <div className="lab-tabs" role="group" aria-label="Choose a creative experiment">
        {tabs.map(tab => <button className="lab-tab" type="button" key={tab.id}
          data-lab={tab.id} aria-pressed={tab.id === 'continuity'}>{tab.text}</button>)}
      </div>
    </div>
  </div>;
}
