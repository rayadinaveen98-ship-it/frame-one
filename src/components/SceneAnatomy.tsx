import {useState} from 'react';
import {sceneAnatomyStudies,type AnatomyVariant} from '../data/scene-anatomy';
import {navigate,openLab} from '../legacy/bridge';
import './scene-anatomy.css';

/** One authored fictional situation; the learner changes exactly one craft decision.
 * This is a screenplay/shot illustration, not a movie clip or fake audio player.
 */
export function SceneAnatomy(){
  const [selected,setSelected]=useState(0);
  const [variant,setVariant]=useState<AnatomyVariant>('a');
  const study=sceneAnatomyStudies[selected]??sceneAnatomyStudies[0];
  const choice=study.choices.find(item=>item.id===variant)??study.choices[0];

  return <section className="scene-anatomy" aria-labelledby="scene-anatomy-title"
    data-scene-anatomy>
    <div className="scene-anatomy-head">
      <div>
        <span className="scene-anatomy-overline">THE DIRECTOR'S EYE · INTERACTIVE SCENE STUDY</span>
        <h2 id="scene-anatomy-title">One moment. Five filmmaking choices.</h2>
        <p>Explore an original scene. Change one filmmaking choice and notice how the story feels different.</p>
      </div>
      <span className="scene-anatomy-episode">SCENE 001 <span>•</span> THE WAIT</span>
    </div>
    <div className="scene-anatomy-select" role="group" aria-label="Choose a filmmaking craft">
      {sceneAnatomyStudies.map((item,index)=><button type="button" key={item.id}
        data-anatomy-study={item.id} aria-pressed={selected===index}
        className={selected===index?'is-selected':''}
        onClick={()=>{setSelected(index);setVariant('a');}}>
        {item.tab}
      </button>)}
    </div>
    <div className="scene-anatomy-body" data-scene-study={study.id} data-scene-choice={variant}>
      <div className="scene-anatomy-stage-wrap">
        <div className="scene-anatomy-stage" role="img" aria-label={choice.alt}>
          <span className="scene-anatomy-film-frame" aria-hidden="true"/>
          <span className="scene-anatomy-window" aria-hidden="true"/>
          <span className="scene-anatomy-window-glow" aria-hidden="true"/>
          <span className="scene-anatomy-light-pool" aria-hidden="true"/>
          <span className="scene-anatomy-figure" aria-hidden="true">
            <span className="scene-anatomy-figure-head"><span className="scene-anatomy-eye scene-anatomy-eye-left"/><span className="scene-anatomy-eye scene-anatomy-eye-right"/></span>
            <span className="scene-anatomy-figure-body"/>
          </span>
          <span className="scene-anatomy-chair" aria-hidden="true"/>
          <span className="scene-anatomy-table" aria-hidden="true"/>
          <span className="scene-anatomy-phone" aria-hidden="true"><span>Typing…</span></span>
          <span className="scene-anatomy-rhythm-plan" aria-hidden="true">
            {variant==='a'?<span className="scene-anatomy-rhythm-clip scene-anatomy-rhythm-hold">ONE UNBROKEN SHOT <b>0–6s</b></span>:<>
              <span className="scene-anatomy-rhythm-clip">FACE <b>0–2s</b></span>
              <span className="scene-anatomy-rhythm-clip">PHONE <b>2–4s</b></span>
              <span className="scene-anatomy-rhythm-clip">FACE <b>4–6s</b></span>
            </>}
          </span>
          <span className="scene-anatomy-film-grain" aria-hidden="true"/>
          <span className="scene-anatomy-shot-label" aria-hidden="true">{study.id==='edit'&&variant==='b'?'SHOT 02 / INSERT':study.id==='reaction'&&variant==='b'?'SHOT 02 / REACTION':study.id==='rhythm'?'EDIT PLAN / 6 SECONDS':'SHOT 01 / WIDE'}</span>
        </div>
        <div className="scene-anatomy-cue">
          <span>{study.sceneCue}</span>
          <p aria-live="polite" aria-atomic="true">{choice.direction}</p>
        </div>
      </div>
      <div className="scene-anatomy-analysis">
        <span className="scene-anatomy-overline">UNDERSTAND THE CHOICE</span>
        <h3>{study.title}</h3>
        <p className="scene-anatomy-question">{study.question}</p>
        <div className="scene-anatomy-choices" role="group" aria-label="Compare two director's choices">
          {study.choices.map(item=><button type="button" key={item.id}
            data-anatomy-option={item.id} aria-pressed={variant===item.id}
            onClick={()=>setVariant(item.id)} className={variant===item.id?'is-selected':''}>
            <span>TAKE {item.id.toUpperCase()}</span>
            <strong>{item.label}</strong>
          </button>)}
        </div>
        <div className="scene-anatomy-reading" aria-live="polite" aria-atomic="true">
          <span className="scene-anatomy-overline">WHAT CHANGED?</span>
          <p>{choice.reading}</p>
        </div>
      </div>
    </div>
    <div className="scene-anatomy-bottom">
      <p><strong>Director's note.</strong> {study.observation}</p>
      <div className="scene-anatomy-actions">
        <button type="button" data-anatomy-lesson={study.lesson}
          onClick={()=>navigate('lesson',study.lesson)}>Understand the craft <span aria-hidden="true">→</span></button>
        <button type="button" data-anatomy-lab={study.lab}
          onClick={()=>openLab(study.lab)}>Try the real lab <span aria-hidden="true">↗</span></button>
      </div>
    </div>
  </section>;
}
