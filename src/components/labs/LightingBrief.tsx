import { useState } from 'react';
import type { LightingMode } from './LightingScene';

/** Short, optional creative prompts: there is no universally correct lighting
 * recipe. The notes respond to real lab controls, not a fabricated score.
 * All state is session-only and never touches learner progress or backups. */
type BriefId = 'reaction' | 'secrecy' | 'separation';
type LightingBriefData = {
  id: BriefId;
  title: string;
  direction: string;
  question: string;
  example: { mode: LightingMode; power: number; softness: number };
  outcomes: Record<LightingMode, string>;
};

const briefs: LightingBriefData[] = [
  {
    id: 'reaction', title: 'Catch a tiny reaction', direction: 'A character hears news but says nothing.',
    question: 'How could your light let us notice a small change in their expression?',
    example: { mode: 'front', power: 85, softness: 55 },
    outcomes: {
      front: 'Front light keeps more facial detail visible in this illustration. That can help a small reaction register; consider where shadows still give the face shape.',
      side: 'Side light adds shape and can make a reaction feel less straightforward. Check that the important eye and mouth details remain readable.',
      back: 'Back light draws the outline, but this study loses much of the expression on the front of the face. Add some front fill on a real set if the reaction needs to read.'
    }
  },
  {
    id: 'secrecy', title: 'Keep an intention unclear', direction: 'Someone waits at a doorway. We do not know what they will do.',
    question: 'What can you reveal, and what might you keep in shadow?',
    example: { mode: 'side', power: 65, softness: 20 },
    outcomes: {
      front: 'Front light reveals the face quite openly here. Mystery can still come from framing and performance, but the lighting itself conceals less.',
      side: 'Side light lets you balance visible detail against shadow. This can suggest uncertainty without removing every clue from the actor’s expression.',
      back: 'Back light emphasizes the figure more than the face. It may withhold useful details, but too little facial information can also weaken a performance.'
    }
  },
  {
    id: 'separation', title: 'Separate a figure from darkness', direction: 'A person stands against a dark street at night.',
    question: 'How could the viewer find their outline without brightening everything?',
    example: { mode: 'back', power: 75, softness: 35 },
    outcomes: {
      front: 'Front light shows the person, but it does not create the same rim around the silhouette. Think about how background contrast affects separation.',
      side: 'Side light gives the figure dimensional shape. One edge may stand out, though this is different from a clear back-lit rim.',
      back: 'Back light draws a rim around the figure in the illustration. On location, carefully place the source out of frame and check for lens flare.'
    }
  }
];

type Props = {
  mode: LightingMode;
  power: number;
  softness: number;
  onPreset: (mode: LightingMode, power: number, softness: number) => void;
};

export function LightingBrief({ mode, power, softness, onPreset }: Props) {
  const [active, setActive] = useState<BriefId>('reaction');
  const [reviewed, setReviewed] = useState(false);
  const brief = briefs.find(item => item.id === active) ?? briefs[0];
  const levelNote = power <= 40
    ? 'You chose a dim illustration. Check real exposure and visible expression when you try this with a camera.'
    : power >= 85
      ? 'You chose a bright illustration. More visibility does not automatically create the mood; notice contrast and background too.'
      : 'You chose a middle brightness. Explore whether the subject stays readable as the surrounding scene changes.';
  const edgeNote = mode !== 'side'
    ? 'The shadow-edge slider mainly changes the side-light drawing; it is not a physical light-softness simulator.'
    : softness <= 30
      ? 'The illustrated side shadow has a sharper edge. In practice, source size and distance change softness.'
      : softness >= 70
        ? 'The illustrated side shadow has a softer edge. Compare it with a harder source before deciding on the mood.'
        : 'The side shadow is between hard and soft in this drawing. Try both extremes to see what shifts.';

  return <section className="lighting-brief" aria-labelledby="lighting-brief-title">
    <details>
      <summary><span className="lighting-brief-summary"><span className="eyebrow">OPTIONAL · 3 SCENE BRIEFS</span>
        <strong id="lighting-brief-title">Direct a scene with light</strong>
        <small>Choose a story moment, shape the light above, then examine your decision.</small>
      </span><span aria-hidden="true" className="lighting-brief-chevron">⌄</span></summary>
      <div className="lighting-brief-body">
        <div className="lighting-brief-picks" role="group" aria-label="Choose a lighting scene brief">
          {briefs.map(item => <button key={item.id} type="button" data-light-brief={item.id}
            aria-pressed={active === item.id}
            onClick={event => { event.stopPropagation(); setActive(item.id); setReviewed(false); }}>
            {item.title}
          </button>)}
        </div>
        <p className="lighting-brief-scene"><strong>SCENE</strong> {brief.direction}</p>
        <p className="lighting-brief-question">{brief.question}</p>
        <p className="lighting-brief-instruction">Use the Front / Side / Back controls and the two sliders above. There is no single correct answer.</p>
        <div className="lighting-brief-actions">
          <button type="button" className="btn-secondary" data-light-preset
            onClick={event => { event.stopPropagation(); onPreset(brief.example.mode, brief.example.power, brief.example.softness); setReviewed(false); }}>
            Explore one starting setup
          </button>
          <button type="button" className="btn-secondary lighting-brief-review" data-light-review
            onClick={event => { event.stopPropagation(); setReviewed(true); }}>
            Discuss my lighting
          </button>
        </div>
        {reviewed ? <div className="lighting-brief-feedback" data-light-feedback role="status" aria-live="polite">
          <strong>DIRECTOR'S NOTES · {mode.toUpperCase()} LIGHT</strong>
          <p>{brief.outcomes[mode]}</p>
          <p>{levelNote}</p>
          <p>{edgeNote}</p>
          <small>Change a lighting control to compare another approach; these notes will follow your choices.</small>
        </div> : null}
      </div>
    </details>
  </section>;
}
