import {useEffect,useRef,useState} from 'react';
import {practiceMissions,type PracticeId} from '../data/film-it-yourself';
import {formatPracticeSheet} from '../data/practice-sheet';
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
  const planTextRef=useRef<HTMLTextAreaElement>(null);
  const [showSheet,setShowSheet]=useState(false);
  const [myObservation,setMyObservation]=useState('');
  const [copyStatus,setCopyStatus]=useState('');
  // Only an explicit lesson handoff scrolls and focuses the expanded workshop.
  // Ordinary Home visits preserve the compact, closed state.
  useEffect(()=>{
    if(!incoming)return;
    // App's route-change focus lands on the Home hero in the first frame.
    // Let that finish before focusing the lesson-selected exercise.
    let focusFrame=0;
    const routeFrame=requestAnimationFrame(()=>{
      focusFrame=requestAnimationFrame(()=>{
        const heading=headlineRef.current;
        if(!heading)return;
        heading.tabIndex=-1;
        heading.scrollIntoView({block:'start',behavior:'auto'});
        heading.focus({preventScroll:true});
      });
    });
    return ()=>{cancelAnimationFrame(routeFrame);cancelAnimationFrame(focusFrame);};
  },[incoming]);
  const [tried,setTried]=useState<readonly boolean[]>([false,false,false]);
  const mission=practiceMissions.find(item=>item.id===selected)??practiceMissions[0];
  const count=tried.filter(Boolean).length;
  function select(id:PracticeId){
    setSelected(id);
    setTried([false,false,false]);
    setShowSheet(false);
    setMyObservation('');
    setCopyStatus('');
  }
  async function copySheet(){
    const text=formatPracticeSheet(mission,myObservation);
    try{
      if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      setCopyStatus('Plan copied. Paste it into Notes or a message to keep it.');
    }catch{
      setCopyStatus('Automatic copying is unavailable. Select the plan text below and copy it manually.');
      planTextRef.current?.focus();
      planTextRef.current?.select();
    }
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
        <section className="practice-pocket" data-practice-pocket aria-label="Pocket filming plan">
          <div className="practice-pocket-heading">
            <div><span className="practice-overline">TAKE IT WITH YOU</span>
              <h4>Pocket shoot plan.</h4>
              <p>Keep all three shooting steps handy while using your phone camera.</p>
            </div>
            <button type="button" data-practice-pocket-toggle
              aria-expanded={showSheet} aria-controls="practice-pocket-workspace"
              onClick={()=>{setShowSheet(open=>!open);setCopyStatus('');}}>
              {showSheet?'Hide plan':'Prepare my plan'}
            </button>
          </div>
          {showSheet?<div id="practice-pocket-workspace" className="practice-pocket-workspace">
            <label htmlFor="practice-observation">What did you notice? · Optional</label>
            <textarea id="practice-observation" data-practice-observation maxLength={240}
              rows={3} value={myObservation}
              onChange={event=>{setMyObservation(event.target.value);setCopyStatus('');}}
              placeholder="Example: I understood the action earlier when the detail came first."/>
            <p className="practice-pocket-privacy">Your note stays only in this open session. Changing exercises or leaving the page clears it. Copy the plan to keep it.</p>
            <button type="button" className="practice-pocket-copy" data-practice-pocket-copy
              onClick={copySheet}>Copy the full shot plan</button>
            <p data-practice-pocket-status role="status" aria-live="polite" className="practice-pocket-status">{copyStatus}</p>
            <label htmlFor="practice-plan-text">Full plan · Can be selected and copied manually</label>
            <textarea id="practice-plan-text" ref={planTextRef} className="practice-pocket-text"
              data-practice-plan-text readOnly rows={12} value={formatPracticeSheet(mission,myObservation)}
              onFocus={event=>event.currentTarget.select()}/>
          </div>:null}
        </section>
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
