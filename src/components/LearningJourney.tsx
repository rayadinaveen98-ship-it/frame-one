import type {CSSProperties} from 'react';
import type {Lesson} from '../data/schema';

type Chapter = {name:string;strap:string;ids:string[]};
type JourneyProps = {
  chapters: readonly Chapter[];
  completed: ReadonlySet<string>;
  totalLessons:number;
  nextLesson:Lesson;
  onNext:()=>void;
  onChapterSelect:(index:number)=>void;
  activeChapter:number;
};
function cleanChapterName(name:string){
  return name.replace(/^\d+\s*[·.\-]\s*/, '');
}

/** One truthful view of progress: every fraction derives from the existing 33 lesson IDs. */
export function LearningJourney({chapters,completed,totalLessons,nextLesson,onNext,onChapterSelect,activeChapter}:JourneyProps){
  const done=completed.size;
  const allComplete=done===totalLessons;
  const percentage=Math.round(done/totalLessons*100);
  const nextIndex=chapters.findIndex(chapter=>chapter.ids.includes(nextLesson.id));
  const nextChapter=nextIndex>=0?nextIndex+1:1;
  return <section className="journey-dashboard" aria-label="Your learning progress">
    <div className="journey-progress-panel">
      <div className="journey-heading-row">
        <span className="eyebrow-secondary">YOUR CINEMA JOURNEY</span>
        <span className="journey-percent" aria-label={percentage+' percent complete'}>{percentage}%</span>
      </div>
      <div className="journey-count">
        <strong>{done}</strong>
        <span>of {totalLessons} lessons<br/>completed</span>
      </div>
      <div className="journey-meter" role="progressbar" aria-label="Completed lessons"
        aria-valuenow={done} aria-valuemin={0} aria-valuemax={totalLessons}>
        <div style={{width:percentage+'%'}}/>
      </div>
      <div className="journey-chapter-label">
        <span>THE SIX CHAPTERS</span>
        <span>{chapters.filter(chapter=>chapter.ids.every(id=>completed.has(id))).length} of {chapters.length} finished</span>
      </div>
      <div className="journey-chapter-segments" role="group" aria-label="Select a film chapter">
        {chapters.map((chapter,index)=>{
          const count=chapter.ids.filter(id=>completed.has(id)).length;
          const share=Math.round(count/chapter.ids.length*100);
          return <button key={chapter.name} type="button"
            className={'journey-chapter-segment'+(index===activeChapter?' is-current':'')}
            aria-label={'View chapter '+(index+1)+': '+cleanChapterName(chapter.name)+', '+count+' of '+chapter.ids.length+' lessons finished'}
            aria-pressed={index===activeChapter}
            title={cleanChapterName(chapter.name)+' · '+count+'/'+chapter.ids.length}
            onClick={()=>onChapterSelect(index)}
            style={{'--chapter-fill':share+'%'} as CSSProperties}>
            <span className="journey-segment-track" aria-hidden="true"/>
            <span className="journey-segment-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span>
          </button>;
        })}
      </div>
      <p className="journey-caption">Choose a chapter to explore its lessons.</p>
    </div>
    <div className="journey-next-panel">
      <div className="journey-next-topline">
        <span className="eyebrow-secondary">{allComplete?'PATH COMPLETE':'PICK UP WHERE YOU LEFT OFF'}</span>
        <span className="journey-next-chapter">CHAPTER {String(nextChapter).padStart(2,'0')}</span>
      </div>
      <span className="journey-next-index">{allComplete?'Revisit your first lesson':'LESSON '+nextLesson.num+' · '+nextLesson.minutes+' MIN'}</span>
      <h2 className="journey-next-title">{allComplete?'Your cinema journey continues.':nextLesson.title}</h2>
      <p className="journey-next-description">{allComplete?'All 33 beginner lessons are complete. Revisit a favourite lesson or explore a creative lab.':nextLesson.subtitle}</p>
      <button className="cta journey-next-cta" type="button" onClick={onNext}>
        {allComplete?'Revisit first lesson':'Continue learning'} →
      </button>
    </div>
  </section>;
}
