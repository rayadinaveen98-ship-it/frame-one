import {useState} from 'react';
import {fieldLessonForId} from '../data/visual-field-guide';
import {FieldArtwork} from './FieldGuideArtwork';
import {openLab} from '../legacy/bridge';
import './field-guide.css';

/** A three-stage visual field guide, never a fake film or an auto-completion.
 * Keyboard-accessible choice labels and explanations remain available.
 */
export function VisualFieldGuide({lessonId}:{lessonId:string}){
 const field=fieldLessonForId(lessonId);
 const [step,setStep]=useState<0|1|2>(0);
 const [explain,setExplain]=useState(false);
 if(!field)return null;
 const active=field.beats[step];
 function select(next:0|1|2){setStep(next);setExplain(false);}
 return <section className="fg-guide" data-visual-field={field.id}
   aria-labelledby={'fg-heading-'+field.id}>
   <header className="fg-intro">
     <span className="fg-overline">{field.eyebrow}</span>
     <h2 id={'fg-heading-'+field.id}>{field.question}</h2>
     <p>{field.setup}</p>
   </header>
   <figure className="fg-stage" data-field-step={step}>
     <FieldArtwork id={field.id} phase={step}/>
     <figcaption><span>ORIGINAL FILM NOTEBOOK / THREE-STAGE STUDY</span><span>{step+1} / 3</span></figcaption>
   </figure>
   <nav aria-label="Three visual discoveries" className="fg-tabs">
     {field.beats.map((beat,i)=><button type="button" key={beat.tag}
       data-field-choice={i} aria-current={i===step?'step':undefined}
       onClick={()=>select(i as 0|1|2)}>
       <span>0{i+1} / {beat.tag}</span>
       <strong>{beat.title}</strong>
     </button>)}
   </nav>
   <section className="fg-notice" aria-live="polite">
     <span className="fg-overline">LOOK CLOSER · {active.tag}</span>
     <h3 data-field-caption>{active.title}</h3>
     <p data-field-observation>{active.observation}</p>
     <div className="fg-controls">
       <button type="button" data-field-previous disabled={step===0}
         onClick={()=>select((step-1) as 0|1|2)}>← Previous</button>
       <button type="button" data-field-next onClick={()=>select((step===2?0:step+1) as 0|1|2)}>
         {step===2?'Replay the study ↺':'Discover the next view →'}
       </button>
     </div>
     {step===2?<div className="fg-discovery" data-field-discovery>
       <button type="button" data-field-explain aria-expanded={explain}
         aria-controls={'fg-why-'+field.id} onClick={()=>setExplain(v=>!v)}>
         {explain?'Hide the filmmaking insight':'What did we learn?'}
         <span aria-hidden="true">{explain?'−':'+'}</span>
       </button>
       {explain?<div className="fg-insight" id={'fg-why-'+field.id} role="region" aria-label="What this teaches">
         <strong>{field.discovery}</strong>
         <p>{field.reason}</p>
       </div>:null}
     </div>:null}
   </section>
   <footer className="fg-finish">
     <div><span>THE POINT TO REMEMBER</span><strong>{field.takeaway}</strong></div>
     <div><span>TRY THIS OUTSIDE THE APP</span><p>{field.phoneTask}</p>
       <button type="button" data-field-lab={field.lab}
         onClick={()=>openLab(field.lab)}>{field.labLabel} →</button>
     </div>
     <small>{field.qualification} The normal lesson quiz remains the only way to complete the lesson.</small>
   </footer>
 </section>;
}
