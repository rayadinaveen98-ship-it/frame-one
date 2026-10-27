import type { Dispatch, SetStateAction, MouseEvent } from 'react';
import type { LabName } from '../../legacy/bridge';

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
  return <div className="page react-continuity-lab">
    <div className="page-intro">
      <div className="eyebrow">CREATIVE LAB · 07 · CONTINUITY</div>
      <h1>Something moved between shots.</h1>
      <p>Compare two simplified views of the same fictional desk. Imagine no one touches the objects between the two shots.</p>
    </div>
    <div className="lab-tabs" role="group" aria-label="Choose a creative experiment">
      {tabs.map(tab => <button className="lab-tab" type="button" key={tab.id}
        data-lab={tab.id} aria-pressed={tab.id === 'continuity'}>{tab.text}</button>)}
    </div>
    <div className="continuity-shell">
      <div className="continuity-grid">
        <IllustratedDesk title="SHOT A · BEFORE THE CUT" moved={false}/>
        <IllustratedDesk title="SHOT B · AFTER THE CUT" moved={changed}/>
      </div>
      <div className="continuity-controls">
        <h3>Test the prop positions</h3>
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
  </div>;
}
