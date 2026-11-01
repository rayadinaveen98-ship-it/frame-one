import { useState } from 'react';
import type { CutDurations, CutOrder, CutShot } from './CutLab';
import './cut-brief.css';

/** v0.15A4: a story-first edit exercise with no saved state or new timers.
 * Samples only control the existing three-shot Cut Lab. The analysis describes
 * possible viewer attention, never a guaranteed emotional outcome or score.
 */
type Intent = 'orient' | 'question' | 'character';
type EditPreset = { order: CutOrder; durations: CutDurations };
type EditBrief = {
  id: Intent;
  title: string;
  situation: string;
  question: string;
  example: EditPreset;
  firstShotNotes: Record<CutShot, string>;
};
const shots: Record<CutShot, string> = { place: 'Place', detail: 'Clock', person: 'Person' };
const briefs: EditBrief[] = [
  {
    id: 'orient', title: 'Help us find the place',
    situation: 'A person is waiting for a bus. The audience has never seen this location.',
    question: 'What should viewers understand first before they start guessing why the person is here?',
    example: { order: ['place','person','detail'], durations: [4,2,2] },
    firstShotNotes: {
      place: 'Opening with the location offers the audience immediate geography. A longer hold may make it easier to scan the space.',
      detail: 'Opening on the clock introduces time before place. That can be engaging, but viewers have to learn the geography later.',
      person: 'Opening on the person creates an early human focus. The location may become a second piece of information.'
    }
  },
  {
    id: 'question', title: 'Make time feel important',
    situation: 'The bus has not arrived. The audience suspects someone might be late.',
    question: 'How could your order make the clock feel like a question rather than just background?',
    example: { order: ['detail','person','place'], durations: [4,2,1] },
    firstShotNotes: {
      place: 'A location-first edit gives context before the clock becomes a clue. The time question may emerge later.',
      detail: 'A clock-first edit presents a potential clue before its context. The following shot can change how we interpret it.',
      person: 'A person-first edit asks viewers to notice someone before explaining the time pressure.'
    }
  },
  {
    id: 'character', title: 'Begin with the character',
    situation: 'Our story is about someone making a difficult decision at a bus stop.',
    question: 'How could the edit invite us to watch the person before revealing the surroundings?',
    example: { order: ['person','detail','place'], durations: [4,2,2] },
    firstShotNotes: {
      place: 'An establishing shot gives us the world first. The character becomes a focus as the cut moves closer.',
      detail: 'A clock-first approach starts with an object. The person enters the story after we consider the time.',
      person: 'Beginning with the person foregrounds character. A real performance would give viewers more to interpret than this drawing can.'
    }
  }
];

type Props = {
  order: CutOrder;
  durations: CutDurations;
  onApply: (preset: EditPreset) => void;
};

export function CutBrief({ order, durations, onApply }: Props) {
  const [active, setActive] = useState<Intent>('orient');
  const [review, setReview] = useState(false);
  const current = briefs.find(item => item.id === active) ?? briefs[0];
  const total = durations.reduce((sum, n) => sum + n, 0);
  const openingSeconds = durations[0];
  const openingTiming = openingSeconds >= 4
    ? 'The opening shot stays long enough to invite a slower look.'
    : openingSeconds === 1
      ? 'The opening is a quick glimpse. A viewer may register less detail before the next cut.'
      : 'The opening gives a moderate look before the second piece of information.';
  const finalNote = order[2] === 'person'
    ? 'Finishing on the person may leave us considering their possible response.'
    : order[2] === 'detail'
      ? 'Finishing on the clock leaves an object or time question as the last image.'
      : 'Finishing on the place returns us to the wider situation.';
  return <section className="cut-brief" aria-label="Optional editing story workshop">
    <details>
      <summary>
        <span className="cut-brief-summary">
          <span className="eyebrow">OPTIONAL · EDITOR'S EXERCISE</span>
          <strong>Change what the audience knows</strong>
          <small>Three story intentions. Rearrange the real timeline, then examine your cut.</small>
        </span>
        <span aria-hidden="true" className="cut-brief-chevron">⌄</span>
      </summary>
      <div className="cut-brief-body">
        <div className="cut-brief-choices" role="group" aria-label="Choose an editing intention">
          {briefs.map(brief => <button type="button" key={brief.id} data-cut-brief={brief.id}
            aria-pressed={active === brief.id} onClick={event => {
              event.stopPropagation(); setActive(brief.id); setReview(false);
            }}>{brief.title}</button>)}
        </div>
        <p className="cut-brief-scene"><strong>THE SCENE</strong> {current.situation}</p>
        <p className="cut-brief-question">{current.question}</p>
        <p className="cut-brief-hint">Move shots and change their durations in the editor above. Your current edit stays yours until you choose a suggested starting setup.</p>
        <div className="cut-brief-actions">
          <button type="button" className="btn-secondary" data-cut-preset onClick={event => {
            event.stopPropagation();
            onApply({ order: [...current.example.order] as CutOrder, durations: [...current.example.durations] as CutDurations });
            setReview(false);
          }}>Try a starting edit</button>
          <button type="button" className="btn-secondary cut-brief-review" data-cut-review
            onClick={event => { event.stopPropagation(); setReview(true); }}>Discuss my cut</button>
        </div>
        {review ? <div className="cut-brief-feedback" data-cut-feedback role="status" aria-live="polite">
          <strong>EDITOR'S NOTES · {total} SECONDS</strong>
          <p>{current.firstShotNotes[order[0]]}</p>
          <p>{openingTiming} {finalNote}</p>
          <div className="cut-brief-comparison" aria-label="Editing order comparison">
            <div><small>STARTING EDIT</small><span>Place 2s · Clock 2s · Person 2s</span></div>
            <div><small>YOUR EDIT</small><span>{order.map((id,index) => shots[id] + ' ' + durations[index] + 's').join(' · ')}</span></div>
          </div>
          <small>These are possibilities, not guaranteed audience emotions. The preview uses timed drawings, not performances or recorded footage.</small>
        </div> : null}
      </div>
    </details>
  </section>;
}
