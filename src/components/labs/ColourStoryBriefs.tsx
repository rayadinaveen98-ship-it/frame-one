import { useState } from 'react';
import type { ColourMode } from './ColourLab';
import './colour-story-briefs.css';

/** Optional, session-only directing exercise.
 * Reuses the existing illustration and real lab controls; no fake scoring,
 * altered lesson progress, network traffic or extra storage.
 */
type BriefId = 'morning' | 'reunion' | 'last-bus';
type Brief = {
  id: BriefId;
  title: string;
  scene: string;
  question: string;
  starter: { mode: ColourMode; strength: number };
  notes: Record<ColourMode, string>;
};

const briefs: Brief[] = [
  {
    id: 'morning',
    title: 'The first bus',
    scene: 'The character arrives at a bus stop just after sunrise. We have not learned how they feel.',
    question: 'How could colour help describe the time of day while leaving the performance open?',
    starter: { mode: 'warm', strength: 45 },
    notes: {
      neutral: 'The untreated drawing keeps the existing illustrated light. Time of day could also come from the sky, shadows and sound.',
      warm: 'A warmer overlay can suggest an early sunlit atmosphere. A real location would also need motivated warm light and consistent whites.',
      cool: 'A cooler overlay could suggest shade or a still-cold morning. Check whether that fits the imagined light source.'
    }
  },
  {
    id: 'reunion',
    title: 'An unexpected meeting',
    scene: 'Someone the character knows steps into frame after a long absence. Their reaction is ambiguous.',
    question: 'Should colour signal a feeling, or let the reaction and cut carry the moment?',
    starter: { mode: 'neutral', strength: 0 },
    notes: {
      neutral: 'Keeping the original palette lets acting, framing and the cut reveal the relationship. Neutral is an active creative decision.',
      warm: 'A warm overlay may suggest familiarity, but an awkward reunion could also happen in warm light. Do not assume a fixed emotion.',
      cool: 'A cooler image may make the setting seem less inviting to some viewers, but the performance and story can reverse that reading.'
    }
  },
  {
    id: 'last-bus',
    title: 'The unanswered wait',
    scene: 'It is getting late. The bus has not arrived and the character looks down the road.',
    question: 'How could a modest colour change support the atmosphere without revealing what happens next?',
    starter: { mode: 'cool', strength: 60 },
    notes: {
      neutral: 'The image can stay neutral and let street lighting, negative space and pacing hold the uncertainty.',
      warm: 'Warm streetlight could make the scene feel grounded in a real location, even if the situation is uneasy.',
      cool: 'A cooler tint may suggest dusk or shade, but it is not evidence that the situation is sad or dangerous.'
    }
  }
];

type Props = {
  mode: ColourMode;
  strength: number;
  onApply: (mode: ColourMode, strength: number) => void;
};

export function ColourStoryBriefs({ mode, strength, onApply }: Props) {
  const [active, setActive] = useState<BriefId>('morning');
  const [reviewed, setReviewed] = useState(false);
  const brief = briefs.find(item => item.id === active) ?? briefs[0];

  const strengthNote = mode === 'neutral'
    ? 'Neutral mode applies no colour overlay, even if the strength slider is above zero.'
    : strength === 0
      ? 'The selected tint is at zero strength, so the image looks unchanged.'
      : strength <= 35
        ? 'This is a subtle illustrated tint. Compare it against the original image above.'
        : strength <= 70
          ? 'This is a moderate illustrated tint. Watch the sky, clothing and skin tones together.'
          : 'This is a strong illustrated tint. Check whether it makes details less believable or colours harder to distinguish.';

  return <section className="colour-story-briefs" aria-label="Optional colour direction workshop">
    <details>
      <summary>
        <span className="colour-brief-summary">
          <span className="eyebrow">OPTIONAL · 3 STORY SCENES</span>
          <strong>Direct the colour of a scene</strong>
          <small>Start with the story, choose a look, then see what your decision actually changes.</small>
        </span>
        <span className="colour-brief-chevron" aria-hidden="true">⌄</span>
      </summary>
      <div className="colour-brief-body">
        <div className="colour-brief-options" role="group" aria-label="Choose a scene to colour">
          {briefs.map(item => <button type="button" key={item.id}
            data-colour-brief={item.id} aria-pressed={active === item.id}
            onClick={event => { event.stopPropagation(); setActive(item.id); setReviewed(false); }}>
            {item.title}
          </button>)}
        </div>
        <p className="colour-brief-scene"><strong>SCENE</strong> {brief.scene}</p>
        <p className="colour-brief-question">{brief.question}</p>
        <p className="colour-brief-instruction">Use Neutral, Warm or Cool and the strength slider above. Try contrasting looks before discussing the choice. There is no automatic 'correct' mood.</p>
        <div className="colour-brief-actions">
          <button type="button" className="btn-secondary" data-colour-brief-starter
            onClick={event => { event.stopPropagation(); onApply(brief.starter.mode, brief.starter.strength); setReviewed(false); }}>
            Try one starting look
          </button>
          <button type="button" className="btn-secondary" data-colour-brief-review
            onClick={event => { event.stopPropagation(); setReviewed(true); }}>
            Discuss my colour choice
          </button>
        </div>
        {reviewed ? <div className="colour-brief-feedback" data-colour-brief-feedback role="status" aria-live="polite">
          <strong>DIRECTOR'S NOTES · {mode.toUpperCase()} LOOK</strong>
          <p>{brief.notes[mode]}</p>
          <p>{strengthNote}</p>
          <small>These are creative interpretations of a simplified overlay, not a technical colour-grade simulation or an emotion detector.</small>
        </div> : null}
        <div className="colour-brief-prompt">
          <span aria-hidden="true">◐</span>
          <p><strong>Try it with your phone:</strong> Make two short shots of the same object in different naturally lit places, then compare which parts of the setting, light and colour communicate your intended time of day. Do not judge the mood from colour alone.</p>
        </div>
      </div>
    </details>
  </section>;
}
