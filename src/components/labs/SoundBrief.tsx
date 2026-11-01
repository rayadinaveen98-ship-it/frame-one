import {useState} from 'react';
import type {SoundMode} from './sound-audio';
import './sound-brief.css';

/** Story-first listening exercise. Reuses existing sounds and opt-in Play;
 * deliberately does not generate audio, keep progress or award a score. */
type BriefId='ordinary'|'hope'|'uncertain';
type Brief={
  id:BriefId;
  name:string;
  scene:string;
  question:string;
  starter:{mode:SoundMode;ambience:boolean};
  listeningNotes:Record<SoundMode,string>;
};
const briefs:Brief[]=[
  {
    id:'ordinary',name:'An everyday wait',
    scene:'A person sits quietly at a bus stop. Nothing else has been revealed.',
    question:'What sounds would let the location feel present without instructing us how to feel?',
    starter:{mode:'silence',ambience:true},
    listeningNotes:{
      silence:'No added music leaves the illustration open to interpretation. Real-world dialogue, traffic or footsteps could still carry the scene.',
      warm:'Gentle tones can make the waiting feel more settled than the picture alone implies. Ask whether that direction serves the story.',
      tension:'Uneasy tones introduce uncertainty that the static illustration does not prove. You may be suggesting a new question to the audience.'
    }
  },
  {
    id:'hope',name:'Waiting for someone',
    scene:'The person is expecting a friend they have not seen for years.',
    question:'How much should the soundtrack suggest anticipation before we see the meeting?',
    starter:{mode:'warm',ambience:true},
    listeningNotes:{
      silence:'Without music, a future greeting or actor performance could carry the reunion. The absence of a score need not mean a lack of feeling.',
      warm:'These gentle notes might suggest warmth or expectation. In a real film, performance, context and harmony would matter too.',
      tension:'Uneasy notes could make the reunion feel uncertain. That contrast might serve a complicated relationship, but it changes the implied question.'
    }
  },
  {
    id:'uncertain',name:'The last bus',
    scene:'It is late. The character may have missed the last bus, but we do not yet know.',
    question:'How could sound raise a question without turning uncertainty into a guaranteed emotion?',
    starter:{mode:'tension',ambience:false},
    listeningNotes:{
      silence:'With no music, the edit and imagined environmental sounds can carry the unanswered question. A quiet soundtrack can still be active storytelling.',
      warm:'Gentle tones may soften the uncertainty or suggest reassurance. That is a possible alternative rather than a wrong answer.',
      tension:'Uneasy tones may make the wait feel less secure. This is only one reading, not evidence that anything dangerous has happened.'
    }
  }
];

type Props={
  mode:SoundMode;
  ambience:boolean;
  onApply:(mode:SoundMode,ambience:boolean)=>void;
};

export function SoundBrief({mode,ambience,onApply}:Props){
  const [active,setActive]=useState<BriefId>('ordinary');
  const [reviewed,setReviewed]=useState(false);
  const brief=briefs.find(item=>item.id===active)??briefs[0];
  const ambienceNote=ambience
    ? 'Quiet synthesized ambience is on. It adds a background layer; listen for whether it supports the imagined location or competes with the tones.'
    : 'Synthesized ambience is off. The sketch can sound more exposed; a real location could still have ambient sounds.';
  return <section className="sound-brief" aria-label="Optional story sound workshop">
    <details>
      <summary>
        <span className="sound-brief-summary">
          <span className="eyebrow">OPTIONAL · SOUND STORY EXERCISE</span>
          <strong>Tell the same moment with sound</strong>
          <small>Choose a story intention, listen to the sound desk above, and discuss your decision.</small>
        </span>
        <span className="sound-brief-chevron" aria-hidden="true">⌄</span>
      </summary>
      <div className="sound-brief-body">
        <div className="sound-brief-choices" role="group" aria-label="Choose a sound story brief">
          {briefs.map(item=><button type="button" key={item.id} data-sound-brief={item.id}
            aria-pressed={active===item.id} onClick={event=>{event.stopPropagation();setActive(item.id);setReviewed(false);}}>
            {item.name}</button>)}
        </div>
        <p className="sound-brief-scene"><strong>SCENE</strong> {brief.scene}</p>
        <p className="sound-brief-question">{brief.question}</p>
        <p className="sound-brief-instruction">Select No music, Gentle tones or Uneasy tones above, toggle ambience, then press Play. Sound never starts automatically.</p>
        <div className="sound-brief-actions">
          <button type="button" className="btn-secondary" data-sound-preset
            onClick={event=>{event.stopPropagation();onApply(brief.starter.mode,brief.starter.ambience);setReviewed(false);}}>
            Try a starting sound setup
          </button>
          <button type="button" className="btn-secondary sound-brief-review" data-sound-review
            onClick={event=>{event.stopPropagation();setReviewed(true);}}>
            Discuss my sound
          </button>
        </div>
        {reviewed?<div className="sound-brief-feedback" data-sound-feedback role="status" aria-live="polite">
          <strong>DIRECTOR'S NOTES · {mode==='silence'?'NO MUSIC':mode==='warm'?'GENTLE TONES':'UNEASY TONES'}</strong>
          <p>{brief.listeningNotes[mode]}</p>
          <p>{ambienceNote}</p>
          <small>This is a short synthesized sound sketch. It does not model actual location sound or guarantee an audience emotion.</small>
        </div>:null}
      </div>
    </details>
  </section>;
}
