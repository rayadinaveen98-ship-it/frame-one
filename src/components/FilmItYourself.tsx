import {useEffect,useRef,useState} from 'react';
import {practiceMissions,type PracticeId} from '../data/film-it-yourself';
import {navigate,openLab} from '../legacy/bridge';
import {takePracticeHandoff} from '../state/practice-handoff';
import './film-it-yourself.css';

/** Small, self-contained practice desk; no camera access, new storage keys,
 * upload, fabricated video results or permanent completion claims.
 */
export function FilmItYourself(){
  const [incoming]=useState<PracticeId|null>(takePracticeHandoff);
  const [expanded,setExpanded]=useState(Boolean(incoming));
  const [selected,setSelected]=useState<PracticeId>(incoming??'three-shots');
  const headlineRef=useRef<HTMLHeadingElement>(null);
  // Only an explicit lesson handoff scrolls and focuses the expanded workshop.
  // Ordinary Home visits preserve the compact, closed state.
  useEffect(()=>{
    if(!incoming)return;
    const frame=requestAnimationFrame(()=>{
      const heading=headlineRef.current;
      if(!heading)return;
      heading.tabIndex=-1;
      heading.scrollIntoView({block:'start',behavior:'auto'});
      heading.focus({preventScroll:true});
    });
    return ()=>cancelAnimationFrame(frame);
  },[incoming]);
  const [tried,setTried]=useState<readonly boolean[]>([false,false,false]);
  const mission=practiceMissions.find(item=>item.id===selected)??practiceMissions[0];
  const count=tried.filter(Boolean).length;
  function select(id:PracticeId){
    setSelected(id);
    setTried([false,false,false]);
  }
  function toggle(index:number){
    setTried(old=>old.map((value,position)=>position===index?!value:value));
  }
  return <section className="practice-studio" data-film-it-yourself
    aria-labelledby="practice-studio-title">
    <header className="practice-studio-header">
      <div>
        <span className="practice-overline">THE PRACTICE DESK · PHONE-FRIENDLY</span>
        <h2 ref={headlineRef} id="practice-studio-title">Film it yourself.</h2>
        <p>Four small exercises you can try with a phone and everyday objects. Learn by comparing what changes.</p>
      </div>
      <button type="button" className="practice-open" data-practice-toggle
        aria-expanded={expanded} aria-controls="practice-studio-workspace"
        onClick={()=>setExpanded(old=>!old)}>
        {expanded?'Close practice':'Choose an exercise'}
        <span aria-hidden="true">{expanded?'↑':'→'}</span>
      </button>
    </header>
    {expanded?<div className="practice-workspace" id="practice-studio-workspace">
      {incoming?<p className="practice-arrival" role="status" data-practice-arrival>From your lesson · Try this exercise with your phone, then compare what you noticed.</p>:null}
      <div className="practice-choices" role="group" aria-label="Choose a filmmaking exercise">
        {practiceMissions.map(item=><button type="button"
          key={item.id} data-practice-choice={item.id}
          aria-pressed={selected===item.id} onClick={()=>select(item.id)}>
          {item.title}
        </button>)}
      </div>
      <div className="practice-plan" data-practice-plan={mission.id}>
        <div className="practice-plan-intro">
          <span className="practice-overline">{mission.time} · NO EXTRA GEAR</span>
          <h3>{mission.title}</h3>
          <p>{mission.tagline}</p>
        </div>
        <div className="practice-step-list" aria-label="Three practical shooting steps">
          {mission.steps.map((step,index)=><div className="practice-step" key={index}
            data-practice-step={index} data-practice-done={tried[index]?'true':'false'}>
            <span className="practice-step-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span>
            <div className="practice-step-content">
              <h4>{step.title}</h4>
              <p>{step.instruction}</p>
              <small>{step.purpose}</small>
            </div>
            <button type="button" className="practice-step-check" data-practice-check={index}
              aria-pressed={tried[index]} aria-label={(tried[index]?'Mark not tried: ':'Mark tried: ')+step.title}
              onClick={()=>toggle(index)}>
              {tried[index]?'✓ Tried':'I tried it'}
            </button>
          </div>)}
        </div>
        <div className="practice-reflection">
          <span className="practice-overline">WATCH AND THINK</span>
          <p>{mission.observation}</p>
        </div>
        <footer className="practice-studio-footer">
          <p role="status" data-practice-status>
            {count===3?'All three steps marked tried in this session. Your footage stays on your phone.':count+' of 3 steps marked tried · Session only, not saved.'}
          </p>
          <div className="practice-studio-links">
            <button type="button" data-practice-open-lab={mission.lab}
              onClick={()=>openLab(mission.lab)}>Try the related Creative Lab <span aria-hidden="true">→</span></button>
            <button type="button" data-practice-open-lesson={mission.lessonId}
              onClick={()=>navigate('lesson',mission.lessonId)}>Read the related lesson <span aria-hidden="true">↗</span></button>
          </div>
          <p className="practice-studio-note">This app gives you instructions; it does not record or upload video. Only film in a safe space with permission. Checkmarks reset when you leave or change an exercise.</p>
        </footer>
      </div>
    </div>:null}
  </section>;
}
