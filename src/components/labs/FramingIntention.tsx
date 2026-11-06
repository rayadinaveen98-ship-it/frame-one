import { useState } from 'react';
import type { FrameMode } from './FrameLab';
import './framing-intention.css';

/** A small story-first exercise that controls the real, existing crop preview.
 * It does not simulate a moving camera, an optical lens or acting. */
type BriefId = 'arrival' | 'conversation' | 'reaction';
type FrameBrief = {
  id: BriefId;
  title: string;
  situation: string;
  question: string;
  starter: { mode: FrameMode; zoom: number; guides: boolean };
  interpretations: Record<FrameMode, string>;
};

const briefs: FrameBrief[] = [
  {
    id: 'arrival',
    title: 'A new location',
    situation: 'A character arrives somewhere unfamiliar. The audience has not yet seen the place.',
    question: 'How much of the setting does the opening need to reveal?',
    starter: { mode: 'wide', zoom: 1, guides: true },
    interpretations: {
      wide: 'The surroundings remain visible, so the viewer can begin to understand where the character is. You still need staging or another shot to show what matters.',
      medium: 'The person receives more attention and some spatial context remains. You can establish a place through other clues, too.',
      close: 'Most of the setting is excluded. A close view might delay revealing the location, but it cannot establish the place on its own.'
    }
  },
  {
    id: 'conversation',
    title: 'A difficult conversation',
    situation: 'Two friends talk. One changes their mind, but does not say so yet.',
    question: 'How could shot size help us notice gesture without losing all context?',
    starter: { mode: 'medium', zoom: 2, guides: false },
    interpretations: {
      wide: 'A wide shot can show how characters occupy the shared space, though subtle gestures may be harder to notice.',
      medium: 'A medium shot can balance body language and surroundings. The real scene would need actors, blocking and an actual second character.',
      close: 'A close view can focus attention on fine reactions. In a real film, the performance and what precedes the shot determine what that reaction means.'
    }
  },
  {
    id: 'reaction',
    title: 'A silent reaction',
    situation: 'Someone hears unexpected news. They say nothing, and we need to notice a small reaction.',
    question: 'Which frame makes fine facial detail easier to see?',
    starter: { mode: 'close', zoom: 3, guides: false },
    interpretations: {
      wide: 'A wide view leaves room for environmental response or body movement. Very small expressions may be difficult to read.',
      medium: 'A medium frame can carry both posture and some expression; it may be enough depending on performance and screen size.',
      close: 'A tighter frame can make a subtle expression more visible. Cropping this still drawing cannot create an actual filmed performance.'
    }
  }
];

type Props = {
  mode: FrameMode;
  zoom: number;
  guides: boolean;
  onApply: (mode: FrameMode, zoom: number, guides: boolean) => void;
};

export function FramingIntention({ mode, zoom, guides, onApply }: Props) {
  const [active, setActive] = useState<BriefId>('arrival');
  const [reviewed, setReviewed] = useState(false);
  const brief = briefs.find(item => item.id === active) ?? briefs[0];
  const currentCrop = Math.max(1, Math.min(3, zoom));
  const cropNote = currentCrop < 1.5
    ? 'The present crop is wide: most of the original illustrated setting remains visible.'
    : currentCrop < 2.5
      ? 'The present crop is in the middle: some surroundings are excluded while the subject appears larger.'
      : 'The present crop is tight: the illustration excludes much of the setting. This does not move the camera or change perspective.';
  return <section className="framing-intention" aria-label="Optional story framing workshop">
    <details>
      <summary>
        <span className="framing-intention-summary">
          <span className="eyebrow">OPTIONAL · THREE SCENE INTENTIONS</span>
          <strong>Choose a frame for the story</strong>
          <small>Start with a dramatic question, adjust the crop, then consider what viewers can see.</small>
        </span>
        <span className="framing-intention-chevron" aria-hidden="true">⌄</span>
      </summary>
      <div className="framing-intention-body">
        <div className="framing-intention-options" role="group" aria-label="Choose a framing situation">
          {briefs.map(item => <button type="button" key={item.id}
            data-framing-intention={item.id} aria-pressed={active === item.id}
            onClick={event => { event.stopPropagation(); setActive(item.id); setReviewed(false); }}>
            {item.title}
          </button>)}
        </div>
        <p className="framing-intention-scene"><strong>SCENE</strong> {brief.situation}</p>
        <p className="framing-intention-question">{brief.question}</p>
        <div className="framing-intention-actions">
          <button type="button" className="btn-secondary" data-framing-starter
            onClick={event => { event.stopPropagation(); onApply(brief.starter.mode, brief.starter.zoom, brief.starter.guides); setReviewed(false); }}>
            Try a starting frame
          </button>
          <button type="button" className="btn-secondary" data-framing-discuss
            onClick={event => { event.stopPropagation(); setReviewed(true); }}>
            Discuss my framing
          </button>
        </div>
        {reviewed ? <div className="framing-intention-feedback" data-framing-feedback role="status" aria-live="polite">
          <strong>DIRECTOR'S NOTES · {mode.toUpperCase()} SHOT · {currentCrop.toFixed(1)}×</strong>
          <p>{brief.interpretations[mode]}</p>
          <p>{cropNote}</p>
          <small>Framing guides are {guides ? 'visible as an aid' : 'hidden for a cleaner preview'}. This is a crop of an original illustration, not a camera, optical or acting simulator.</small>
        </div> : null}
        <p className="framing-intention-practice"><strong>Try it on your phone:</strong> Make wide, medium and close shots of an object or consenting friend. Keep a consistent story intention, then compare what each real camera position reveals. Moving the camera is different from cropping the same picture.</p>
      </div>
    </details>
  </section>;
}
