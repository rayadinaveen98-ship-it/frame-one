import {useState} from 'react';
import {completeGuidedFoundation,saveGuidedPracticeNote} from '../legacy/bridge';
import {readPractice} from '../state/learning';
import {foundationById} from '../data/foundations-guided';
import {STORYTELLING_IDS,storytellingById} from '../data/storytelling-guided';
import {VISUAL_IDS,visualLanguageById} from '../data/visual-language-guided';
import {OptionBVisualExperiment} from './OptionBVisualExperiment';
import {SOUND_EDIT_IDS,soundEditingById} from '../data/sound-edit-guided';
import {OptionBSoundEditExperiment} from './OptionBSoundEditExperiment';
import {PEOPLE_IDS,peopleById} from '../data/people-guided';
import {OptionBPeopleExperiment} from './OptionBPeopleExperiment';
import {OptionBReactScene} from './OptionBReactMission';

type ViewMode='wide'|'medium'|'close';
const VIEWS:Record<ViewMode,number>={wide:1,medium:1.35,close:1.85};
function NextIcon(){
 return <svg className="node-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"
 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M5 12h14m-6-6 6 6-6 6"/>
 </svg>;
}
/** Production-learning vertical slice: zero extra lesson IDs or backup keys. */
export function OptionBFoundationMission({lessonId,onBack,onComplete,onStepChange}:{
 lessonId:string;onBack:()=>void;onComplete:(id:string)=>void;onStepChange:()=>void;
}){
 const data=foundationById(lessonId)??storytellingById(lessonId)??visualLanguageById(lessonId)??soundEditingById(lessonId)??peopleById(lessonId);
 const [step,setStep]=useState(0);
 const [chosen,setChosen]=useState<number|null>(null);
 const [explore,setExplore]=useState(0);
 const [quiz,setQuiz]=useState<number|null>(null);
 const [note,setNote]=useState(()=>readPractice(lessonId));
 const [saveMessage,setSaveMessage]=useState('');
 const [recorded,setRecorded]=useState(false);
 const [finished,setFinished]=useState(false);
 const [error,setError]=useState('');
 if(!data)return <div className="screen"><div className="feedback" role="alert">This lesson is not in the guided curriculum.</div>
   <button className="btn btn-secondary" onClick={onBack}>Back to the chapter</button></div>;
 const {lesson}=data;
 const correct=quiz===lesson.answer;
 const next=()=>{
   if(step===1&&chosen===null)return;
   if(step===2&&!correct)return;
   if(step===3){
      // The bridge only accepts the twenty-eight original lessons currently enabled.
      // A marked completion uses exactly frameone-progress-v01, the old backup.
      if(!correct){setError('Finish the knowledge check before completing this lesson.');return;}
      const ok=completeGuidedFoundation(lessonId);
      if(!ok){setError('The learning engine is not ready. Your work has not been marked complete.');return;}
      setFinished(true);
      setRecorded(true);
      setError('');
      onComplete(lessonId);
   }else{setStep(s=>Math.min(3,s+1));onStepChange();}
 };
 const selected=chosen===null?null:data.choices[chosen];
 const stageLabels=['OBSERVE','DECIDE','EXPLORE','MAKE'];
 const stageTitles=['Watch the moment.','You are the director.','Find what really matters.','Try it in real life.'];
 const caption=step===0?data.observe
   :step===1?data.prompt:step===2?data.explorerLabel:lesson.try;
 const practiceSave=()=>{
   if(saveGuidedPracticeNote(lessonId,note))setSaveMessage('Saved in your existing Frame One practice notes and backup.');
   else setSaveMessage('This device could not save the note. Copy your answer before leaving.');
 };
 return <div className="screen" data-v2-foundation-screen="mission"
   data-v2-foundation-id={lessonId} data-v2-foundation-step={finished?'complete':String(step)}>
   <div className="mission-top">
     <button type="button" className="back" onClick={onBack} aria-label="Back to the real chapter">‹</button>
     <div className="mission-meta">
       <span className="eyebrow">REAL CHAPTER {data.chapterId===0?'01 · FOUNDATIONS':data.chapterId===1?'02 · STORYTELLING':data.chapterId===2?'03 · VISUAL LANGUAGE':data.chapterId===3?'04 · SOUND & EDITING':'05 · FILM PEOPLE'}</span>
       <h2>{lesson.title}</h2>
     </div>
     <span className="head-pill">{data.chapterId===0?lesson.num:String((data.chapterId===1?STORYTELLING_IDS:data.chapterId===2?VISUAL_IDS:data.chapterId===3?SOUND_EDIT_IDS:PEOPLE_IDS).indexOf(lessonId)+1).padStart(2,'0')} / {data.chapterId===0?'05':data.chapterId===2?'07':data.chapterId===4?'04':'06'}</span>
   </div>
   <div className="lesson-step-track" aria-label={'Learning stage '+(step+1)+' of 4'}>
     {[0,1,2,3].map(i=><span key={i} className={i<=step?'filled':''}/>)}
   </div>
   {finished
     ? <div className="celebrate" data-v2-foundation-complete>
         <span className="trophy">🎬</span>
         <span className="eyebrow">REAL LESSON COMPLETED</span>
         <h1>You've learned a filmmaking idea.</h1>
         <p>“{lesson.title}” is now marked complete in your original Frame One curriculum and backup.</p>
         <div className="reward-number">01 real lesson</div>
         <button type="button" className="btn btn-primary btn-wide" onClick={onBack}>
           Back to the chapter <NextIcon/>
         </button>
       </div>
     : <div className="mission-content">
         <div className="lesson-prompt">
           <span className="lesson-step-label">STEP {step+1} OF 4 · {stageLabels[step]}</span>
           <h1>{stageTitles[step]}</h1>
           <p>{caption}</p>
         </div>
         {step===0&&<>
           <OptionBReactScene mode="wide" value={1}/>
           <div className="observe-card">
             <span className="eyebrow">NOTICE THIS</span>
             <p>{data.notice}</p>
           </div>
           <details className="foundation-deep-dive">
             <summary>Explore the concept <span aria-hidden="true">⌄</span></summary>
             <div>
               {lesson.sections.map(([heading,paragraph])=><section key={heading}>
                 <h3>{heading}</h3><p>{paragraph}</p>
               </section>)}
             </div>
           </details>
         </>}
         {step===1&&<>
           <OptionBReactScene mode={selected?.view??'medium'}
             value={selected?VIEWS[selected.view]:1.2}
             kind={selected?.filter??'neutral'}/>
           <div className="choice-grid" role="group" aria-label="Choose a creative direction">
             {data.choices.map((choice,i)=><button key={choice.label}
               type="button" data-v2-foundation-choice={i} aria-pressed={chosen===i}
               className={'choice-option'+(chosen===i?' selected':'')}
               onClick={()=>setChosen(i)}>
               <span className="choice-ring">{chosen===i?'✓':''}</span>
               <strong>{choice.label}</strong><small>{choice.view.toUpperCase()}</small>
             </button>)}
           </div>
           {selected&&<div className="feedback">
             <h3>✦ Director's note</h3><p>{selected.note}</p>
           </div>}
           <p className="note-honest">Creative choices have trade-offs; there is no automatic right camera choice.</p>
         </>}
         {step===2&&<>
           {data.chapterId===4
             ? <OptionBPeopleExperiment lessonId={lessonId} selected={explore}/>
             : data.chapterId===3
               ? <OptionBSoundEditExperiment lessonId={lessonId} selected={explore}/>
               : data.chapterId===2
               ? <OptionBVisualExperiment lessonId={lessonId} selected={explore}/>
               : <OptionBReactScene mode="concept" value={[1,1.35,1.85][explore]}/>}
           <div className="foundation-concept-switch" role="group" aria-label={data.explorerLabel}>
             {data.explorer.map((item,i)=><button key={item.label} type="button"
               data-v2-foundation-explore={i} aria-pressed={explore===i}
               className={'foundation-concept-tab'+(explore===i?' selected':'')}
               onClick={()=>setExplore(i)}>{item.label}</button>)}
           </div>
           <div className="feedback is-warm" aria-live="polite">
             <h3>{data.explorer[explore].heading}</h3><p>{data.explorer[explore].detail}</p>
           </div>
           <section className="foundation-knowledge-check" aria-label="Knowledge check">
             <span className="eyebrow">CHECK YOUR UNDERSTANDING</span>
             <h3>{lesson.q}</h3>
             <div className="choice-grid" role="group" aria-label="Select your answer">
               {lesson.opts.map((answer,i)=><button key={i} type="button"
                 className={'choice-option'+(quiz===i?' selected':'')}
                 data-v2-foundation-quiz={i} aria-pressed={quiz===i}
                 onClick={()=>setQuiz(i)}>
                 <span className="choice-ring">{quiz===i?'✓':''}</span>
                 <strong>{answer}</strong>
               </button>)}
             </div>
             {quiz!==null&&<div className={'feedback'+(correct?'':' is-warm')}
               data-v2-foundation-quiz-status={correct?'correct':'retry'} role="status">
               <h3>{correct?'✓ You understood it':'Not quite—try another answer'}</h3>
               <p>{correct?lesson.feedback:lesson.idea}</p>
             </div>}
           </section>
         </>}
         {step===3&&<>
           <OptionBReactScene mode="practise" value={1.3}/>
           <section className="practice-card">
             <span className="eyebrow">REAL-WORLD FILM CHALLENGE</span>
             <h3>Make it your own.</h3>
             <p>{lesson.try}</p>
             <label className="foundation-note-label" htmlFor="foundationReflection">
               Your observation (optional)
             </label>
             <textarea id="foundationReflection" data-v2-foundation-note
               maxLength={240} value={note} rows={3}
               onChange={e=>{setNote(e.target.value.slice(0,240));setSaveMessage('');}}
               placeholder="What did you notice or try?"/>
             <button type="button" className="btn btn-secondary"
               data-v2-foundation-save-note onClick={practiceSave}>
               Save in my Frame One notes
             </button>
             {saveMessage&&<p role="status" className="foundation-save-status">{saveMessage}</p>}
           </section>
           <p className="note-honest">We don't record your camera, upload footage or judge creativity. The knowledge check above is what unlocks verified lesson completion.</p>
         </>}
         {error&&<div className="feedback is-warm" role="alert">{error}</div>}
         <div className="lesson-bottom">
           <button type="button" className="btn btn-primary btn-wide" data-v2-foundation-next
             disabled={(step===1&&chosen===null)||(step===2&&!correct)}
             onClick={next}>
             {step===3?'Mark real lesson complete':step===2?'Take this into the real world':'Continue learning'} <NextIcon/>
           </button>
           {step>0&&<div style={{marginTop:12}}>
             <button type="button" className="btn btn-secondary btn-wide"
               data-v2-foundation-previous onClick={()=>{setStep(s=>Math.max(0,s-1));onStepChange();}}>
               ← Previous stage
             </button>
           </div>}
         </div>
       </div>}
 </div>;
}
