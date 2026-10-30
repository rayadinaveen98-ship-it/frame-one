/** v0.13A17 — Quiet in-lesson navigation, not a completion tracker.
 * The learner's real progress and quiz status remain owned by the old engine.
 */
const stages=[
  {id:'explore',number:'01',label:'Explore',description:'Illustrated scene'},
  {id:'decide',number:'02',label:'Decide',description:'Your filmmaking choice'},
  {id:'check',number:'03',label:'Check',description:'Knowledge check'}
] as const;

export function jumpToLessonStage(stage:string):void{
  if(!stages.some(item=>item.id===stage))return;
  const target=document.getElementById('lesson-stage-'+stage);
  if(!target)return;
  const prefersReduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({behavior:prefersReduced?'auto':'smooth',block:'start'});
  target.focus({preventScroll:true});
}

/** Exactly one row. No state, storage keys, sticky banner or false progress. */
export function LessonCompass(){
  return <nav className="lesson-compass" data-lesson-compass aria-label="Jump within this lesson">
    <span className="lesson-compass-caption">YOUR LESSON PATH</span>
    <div className="lesson-compass-actions">
      {stages.map(step=><button key={step.id} type="button" data-lesson-jump={step.id}
        aria-label={'Jump to '+step.label.toLowerCase()+': '+step.description}
        onClick={()=>jumpToLessonStage(step.id)}>
        <span className="lesson-compass-number">{step.number}</span>
        <span className="lesson-compass-label">{step.label}</span>
      </button>)}
    </div>
  </nav>;
}
