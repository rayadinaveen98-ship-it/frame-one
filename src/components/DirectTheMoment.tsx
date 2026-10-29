import {useState} from 'react';
import {
  directionGroups,makeDirectorTreatment,quietTake,uneasyTake,
  type DirectorPlan
} from '../data/direct-the-moment';
import {openLab} from '../legacy/bridge';
import './direct-the-moment.css';

/** A compact original scene workshop; no video playback or invented data persistence. */
export function DirectTheMoment(){
  const [expanded,setExpanded]=useState(false);
  const [plan,setPlan]=useState<DirectorPlan>({...quietTake});
  const treatment=makeDirectorTreatment(plan);
  return <section className="direct-moment" data-direct-moment aria-labelledby="direct-moment-title">
    <header className="direct-moment-header">
      <div>
        <span className="direct-moment-eyebrow">THE DIRECTOR'S DESK · ORIGINAL SHORT SCENE</span>
        <h2 id="direct-moment-title">Now, direct the moment.</h2>
        <p>You have six seconds, one actor and an unreadable message. Make four choices—then see what those choices mean together.</p>
      </div>
      <button type="button" className="direct-moment-open" data-direct-toggle
        aria-expanded={expanded} aria-controls="direct-moment-workspace"
        onClick={()=>setExpanded(was=>!was)}>
        {expanded?'Close the workshop':'Direct this scene'} <span aria-hidden="true">{expanded?'↑':'→'}</span>
      </button>
    </header>
    {expanded?<div id="direct-moment-workspace" className="direct-moment-workspace">
      <div className="direct-moment-presets" role="group" aria-label="Starting directions">
        <span>Try a direction or make your own:</span>
        <button type="button" data-direct-preset="quiet" onClick={()=>setPlan({...quietTake})}>Quiet observation</button>
        <button type="button" data-direct-preset="uneasy" onClick={()=>setPlan({...uneasyTake})}>Uneasy anticipation</button>
      </div>
      <div className="direct-moment-decision-grid">
        <fieldset className="direct-moment-group" data-direct-group="frame">
          <legend>{directionGroups[0].label}<span>{directionGroups[0].prompt}</span></legend>
          <div className="direct-moment-pair">
            <button type="button" data-direct-frame="wide" aria-pressed={plan.frame==='wide'} onClick={()=>setPlan(p=>({...p,frame:'wide'}))}>Observe from afar</button>
            <button type="button" data-direct-frame="close" aria-pressed={plan.frame==='close'} onClick={()=>setPlan(p=>({...p,frame:'close'}))}>Stay with the face</button>
          </div>
        </fieldset>
        <fieldset className="direct-moment-group" data-direct-group="light">
          <legend>{directionGroups[1].label}<span>{directionGroups[1].prompt}</span></legend>
          <div className="direct-moment-pair">
            <button type="button" data-direct-light="warm" aria-pressed={plan.light==='warm'} onClick={()=>setPlan(p=>({...p,light:'warm'}))}>Warm practical lamp</button>
            <button type="button" data-direct-light="cold" aria-pressed={plan.light==='cold'} onClick={()=>setPlan(p=>({...p,light:'cold'}))}>Cold window light</button>
          </div>
        </fieldset>
        <fieldset className="direct-moment-group" data-direct-group="sound">
          <legend>{directionGroups[2].label}<span>{directionGroups[2].prompt}</span></legend>
          <div className="direct-moment-pair">
            <button type="button" data-direct-sound="room" aria-pressed={plan.sound==='room'} onClick={()=>setPlan(p=>({...p,sound:'room'}))}>Just the room</button>
            <button type="button" data-direct-sound="pulse" aria-pressed={plan.sound==='pulse'} onClick={()=>setPlan(p=>({...p,sound:'pulse'}))}>An imagined pulse</button>
          </div>
        </fieldset>
        <fieldset className="direct-moment-group" data-direct-group="edit">
          <legend>{directionGroups[3].label}<span>{directionGroups[3].prompt}</span></legend>
          <div className="direct-moment-pair">
            <button type="button" data-direct-edit="hold" aria-pressed={plan.edit==='hold'} onClick={()=>setPlan(p=>({...p,edit:'hold'}))}>Hold for 6 seconds</button>
            <button type="button" data-direct-edit="reveal" aria-pressed={plan.edit==='reveal'} onClick={()=>setPlan(p=>({...p,edit:'reveal'}))}>Cut after 4 seconds</button>
          </div>
        </fieldset>
      </div>
      <div className="direct-moment-result" data-direct-preview
        data-direct-preview-frame={plan.frame} data-direct-preview-light={plan.light}
        data-direct-preview-sound={plan.sound} data-direct-preview-edit={plan.edit}>
        <div className="direct-moment-visual">
          <div className="direct-moment-stage" role="img" aria-label={treatment.shotDescription}>
            <span className="direct-moment-back-wall" aria-hidden="true"/>
            <span className="direct-moment-window" aria-hidden="true"/>
            <span className="direct-moment-lamp" aria-hidden="true"/>
            <span className="direct-moment-person" aria-hidden="true">
              <span className="direct-moment-head"><span className="direct-moment-face-eye"/></span>
              <span className="direct-moment-shoulders"/>
            </span>
            <span className="direct-moment-table" aria-hidden="true"/>
            <span className="direct-moment-device" aria-hidden="true"/>
            <span className="direct-moment-stage-tag">SHOT 01 · {plan.frame==='wide'?'WIDE':'CLOSE'}</span>
          </div>
          <div className="direct-moment-strip" aria-label={plan.edit==='hold'?'One uninterrupted six-second shot':'A four-second shot followed by a two-second insert'}>
            <div className="direct-moment-strip-main">
              <strong>{plan.frame==='wide'?'WIDE':'REACTION'}</strong><span>0–{plan.edit==='hold'?'6':'4'}s</span>
            </div>
            {plan.edit==='reveal'?<div className="direct-moment-strip-insert" data-direct-insert><strong>PHONE INSERT</strong><span>4–6s</span></div>:null}
          </div>
          {plan.edit==='reveal'?<div className="direct-moment-second-shot">
            <div className="direct-moment-insert-art" role="img" aria-label="Second shot is an illustrated phone close-up showing Typing…">
              <span>Typing…</span>
            </div>
            <span>SHOT 02 · INSERT · 2 SECONDS</span>
          </div>:null}
          <p className="direct-moment-sound-cue" data-direct-sound-cue>{treatment.soundDirection}</p>
          <p className="direct-moment-no-play">STATIC SHOT PLAN · NOT PLAYABLE VIDEO</p>
        </div>
        <div className="direct-moment-reading">
          <span className="direct-moment-eyebrow">YOUR DIRECTOR'S TREATMENT</span>
          <h3>Here is the story you chose to tell.</h3>
          <ol className="direct-moment-shot-list" aria-label="Planned shot sequence" aria-live="polite">
            <li data-direct-first-shot>{treatment.firstShot}</li>
            {treatment.secondShot?<li data-direct-second-shot>{treatment.secondShot}</li>:null}
          </ol>
          <h4>Why the choices interact</h4>
          <p>{treatment.framingWhy} {treatment.lightWhy}</p>
          <p>{treatment.soundWhy} {treatment.editWhy}</p>
          <p className="direct-moment-insight" data-direct-reading>{treatment.possibleReading} Another viewer may read it differently.</p>
        </div>
      </div>
      <footer className="direct-moment-footer">
        <p><strong>Filmmaker's challenge:</strong> Change only one decision. Does the image offer new information, or does it change the expectation you bring to that information?</p>
        <div className="direct-moment-links">
          <button type="button" data-direct-make-lab onClick={()=>openLab('story')}>Open Make Lab <span aria-hidden="true">→</span></button>
          <button type="button" data-direct-sound-lab onClick={()=>openLab('sound')}>Experiment with real sound <span aria-hidden="true">↗</span></button>
        </div>
        <p className="direct-moment-disclaimer">This experiment is a temporary sketch. Make Lab is a separate saved storyboard tool; these selections are not automatically transferred.</p>
      </footer>
    </div>:null}
  </section>;
}
