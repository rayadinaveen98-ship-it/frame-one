import { useEffect, useMemo, useState } from 'react';
import curriculum from '../data/curriculum.v08b.json';
import storyboards from '../data/storyboards.json';
import type { Lesson } from '../data/schema';
import { completeLesson, navigate, openLab, type LabName } from '../legacy/bridge';
import {seriesById,seriesLessonPosition} from '../data/cinema-series';
import {practiceById} from '../data/film-it-yourself';
import {practiceForLesson,stagePracticeHandoff} from '../state/practice-handoff';
import {visualPilotForLesson} from '../data/visual-lessons';
import {VisualLessonPilot} from './VisualLessonPilot';
import {sceneSequenceForLesson} from '../data/scene-sequences';
import {SceneSequence} from './SceneSequence';
import {fieldLessonForId} from '../data/visual-field-guide';
import {VisualFieldGuide} from './VisualFieldGuide';
import {LessonCompass,jumpToLessonStage} from './LessonCompass';
import { readPractice, readTelugu, safeProgress, savePractice, saveTelugu } from '../state/learning';
import './lesson-react.css';

type Choice = { prompt: string; opts: [label: string, explanation: string][] };
type Board = { title: string; items: [shape: 'place' | 'person' | 'detail', label: string, description: string][] };
const lessons = curriculum.lessons as unknown as Lesson[];
const allIds = lessons.map(lesson => lesson.id);
const notes = curriculum.teluguNotes as Record<string, string>;
const choices = curriculum.choices as unknown as Record<string, Choice | undefined>;
const boards = storyboards as unknown as Record<string, Board | undefined>;

const labLinks: Record<string, {lab: LabName; label: string} | {page: 'crafts'; label: string}> = {
  units: {lab:'cut',label:'See three shots form a scene'},
  shot: {lab:'frame',label:'Compare different shot sizes'},
  composition: {lab:'frame',label:'Compare different crops'},
  movement: {lab:'frame',label:'Explore framing (not camera movement)'},
  lenses: {lab:'frame',label:'Explore cropping (not lens physics)'},
  sound: {lab:'sound',label:'Experiment with original sound sketches'},
  ambience: {lab:'sound',label:'Listen to background ambience'},
  music: {lab:'sound',label:'Compare original sound sketches'},
  camera: {lab:'light',label:'Explore a lighting illustration'},
  lighting: {lab:'light',label:'Experiment with lighting'},
  editing: {lab:'cut',label:'Edit three storyboard shots'},
  rhythm: {lab:'cut',label:'Explore editing rhythm'},
  story: {lab:'story',label:'Plan a small original scene'},
  script: {lab:'story',label:'Plan your first scene'},
  making: {lab:'story',label:'Plan your first scene'},
  genres: {lab:'story',label:'Try a new story prompt'},
  character: {lab:'story',label:'Plan a character decision'},
  dialogue: {lab:'story',label:'Plan a scene without dialogue'},
  shotlist: {lab:'story',label:'Build a shot plan'},
  showdonttell: {lab:'story',label:'Create a three-shot action'},
  colour: {lab:'colour',label:'Experiment with colour'},
  continuity: {lab:'continuity',label:'Find a continuity change'},
  craft24: {page:'crafts',label:'Meet the film roles'},
  teams: {page:'crafts',label:'Explore the crew collaboration map'},
  pipeline: {page:'crafts',label:'Explore the production stages'},
  shootscene: {lab:'story',label:'Plan a small shoot'},
  editminute: {lab:'cut',label:'Try a three-shot edit'},
  review: {lab:'story',label:'Review your planned scene'},
};

function Storyboard({ board }: { board: Board }) {
  const [step, setStep] = useState(0);
  const item = board.items[step];
  const drawing = window.frameOneLegacy?.illustration(item[0]) ?? '';
  return <section className="scene-beats" aria-label="Interactive illustrated scene study">
    <span className="eyebrow">THREE ORIGINAL STORYBOARD SKETCHES</span>
    <h3>{board.title}</h3>
    <div className="scene-beat-buttons">
      {board.items.map((beat, i) => <button type="button" key={i} aria-pressed={step===i} onClick={() => setStep(i)}>
        {String(i+1).padStart(2,'0')} · {beat[1]}
      </button>)}
    </div>
    <div className="scene-beat-stage" key={step}>
      {drawing ? <div className="react-board-art" aria-hidden="true" dangerouslySetInnerHTML={{__html:drawing}} /> : null}
      <p role="status"><strong>{item[1]}.</strong> {item[2]}</p>
    </div>
    <small>These are storyboard drawings, not recorded film clips.</small>
  </section>;
}

/** Only plain lesson data becomes text nodes; no editorial content is interpreted as HTML. */
export function LessonView({ lessonId, journeyId }: { lessonId: string; journeyId?: string }) {
  const index = lessons.findIndex(l => l.id===lessonId);
  const lesson = lessons[index] ?? lessons[0];
  const decision = choices[lesson.id];
  const board = boards[lesson.id];
  const [selected, setSelected] = useState<number | null>(null);
  const [quiz, setQuiz] = useState<number | null>(null);
  const [showTelugu, setShowTelugu] = useState(readTelugu);
  const [practice, setPractice] = useState(() => readPractice(lesson.id));
  const [saveStatus, setSaveStatus] = useState('');
  // Notes are tiny and private. Persist each edit synchronously so browser
  // back, Android app switching, or an unexpected WebView reload cannot
  // silently discard a learner's idea before they press Save.
  function persistPractice(next: string): boolean {
    const stored = window.frameOneLegacy?.savePractice(lesson.id,next) ?? savePractice(lesson.id,next);
    setSaveStatus(stored ? 'Saved automatically on this device.' : 'Could not save here. Copy your note before leaving.');
    return stored;
  }
  const completed = useMemo(() => safeProgress(allIds).has(lesson.id), [lesson.id]);
  const [quizStatus, setQuizStatus] = useState('');
  useEffect(() => {
    // Every route changes the component key, which resets quiz/choice/note UI.
    document.title = `${lesson.title} · Frame One`;
    return () => { document.title = 'Frame One · Learn filmmaking'; };
  }, [lesson.title]);
  const seriesPosition=journeyId?seriesLessonPosition(journeyId,lesson.id):null;
  const series=seriesPosition&&journeyId?seriesById(journeyId):null;
  const activeAct=series&&seriesPosition?series.acts[seriesPosition.actIndex]:null;
  // Give readers a small act break only at a real series boundary.
  const followingPosition=seriesPosition?.next&&journeyId
    ?seriesLessonPosition(journeyId,seriesPosition.next):null;
  const intermission=series&&followingPosition&&followingPosition.actIndex!==seriesPosition?.actIndex
    ?series.acts[followingPosition.actIndex]:null;
  // All film-scene labels derive from existing editorial acts and real lessons.
  // This is presentation only: no new tracking state or completion shortcuts.
  const nextScene=seriesPosition?.next?lessons.find(item=>item.id===seriesPosition.next):null;
  const activeActNumber=seriesPosition?seriesPosition.actIndex+1:null;
  const nextActNumber=followingPosition?followingPosition.actIndex+1:null;
  const link = labLinks[lesson.id];
  const linkedPractice=practiceForLesson(lesson.id);
  const visualPilot=visualPilotForLesson(lesson.id);
  const sceneSequence=sceneSequenceForLesson(lesson.id);
  const fieldGuide=fieldLessonForId(lesson.id);
  const correct = quiz === lesson.answer;
  function finishLesson(){
    if(seriesPosition&&journeyId){
      completeLesson(lesson.id,seriesPosition.next?
        {nextLessonId:seriesPosition.next}:{returnCollectionId:journeyId});
    }else{
      // Keep the untouched Learn syllabus completion path.
      completeLesson(lesson.id);
    }
  }
  return <div className="page lesson-view react-lesson">
    {series&&seriesPosition&&journeyId?<section className="series-lesson-context" aria-label="Your cinema series" data-series-lesson={journeyId}>
      <div className="series-scene-heading">
        <div className="series-lesson-copy">
          <span className="cinema-overline">PART {seriesPosition.index+1} OF {seriesPosition.count} · ACT {String(activeActNumber).padStart(2,'0')} / 03</span>
          <span className="series-collection-name">{seriesPosition.shelf.heading}</span>
          <strong>{activeAct?.title}</strong>
        </div>
        <button type="button" onClick={()=>navigate('collection',journeyId)}
          aria-label={'Return to collection: '+seriesPosition.shelf.heading}>View journey <span aria-hidden="true">↗</span></button>
      </div>
      <div className="series-scene-progress" role="progressbar"
        aria-label="Current scene in film journey" aria-valuemin={0}
        aria-valuemax={seriesPosition.count} aria-valuenow={seriesPosition.index+1}>
        <span style={{width:((seriesPosition.index+1)/seriesPosition.count*100)+'%'}}/>
      </div>
    </section>:null}
    {!seriesPosition?<div className="lesson-navline">
      <button className="back-btn" type="button" onClick={()=>navigate('learn')}>← All lessons</button>
      <span>Lesson {lesson.num} / {lessons.length}</span>
    </div>:null}
    <div className="lesson-top">
      <div className="eyebrow">{seriesPosition?'SCENE '+String(seriesPosition.index+1).padStart(2,'0')+' · '+lesson.minutes+' MIN READ':'LESSON '+lesson.num+' · '+lesson.unit.toUpperCase()+' · '+lesson.minutes+' MIN READ'}</div>
      <h1>{lesson.title}</h1><p>{lesson.subtitle}</p>
    </div>
    <LessonCompass/>
    <section id="lesson-stage-explore" className="lesson-stage-explore" tabIndex={-1}
      data-lesson-stage="explore" aria-label="Explore the filmmaking scene">
      {visualPilot?<VisualLessonPilot key={lesson.id} lessonId={lesson.id}/>:null}
      {sceneSequence?<SceneSequence key={lesson.id} lessonId={lesson.id}/>:null}
      {fieldGuide?<VisualFieldGuide key={lesson.id} lessonId={lesson.id}/>:null}
    </section>
    <article className="lesson-body">
      {decision ? <section className="decision-activity" id="lesson-stage-decide" tabIndex={-1}
        data-lesson-stage="decide" aria-label="Interactive filmmaking decision">
        <div className="activity-heading"><span className="eyebrow">✦ YOU'RE THE FILMMAKER</span><span className="activity-count">ONE QUESTION · MULTIPLE POSSIBILITIES</span></div>
        <div className="activity-stage"><span className="activity-projector" aria-hidden="true">◉</span><h3>{decision.prompt}</h3><p>Creative choices do not always have one right answer. Try both.</p></div>
        <div className="activity-options">{decision.opts.map((opt,i)=><button type="button" className="activity-option" key={i} aria-pressed={selected===i} onClick={()=>setSelected(i)}><span className="activity-letter">{String.fromCharCode(65+i)}</span><strong>{opt[0]}</strong><span aria-hidden="true">↗</span></button>)}</div>
        {selected!==null ? <div className="activity-feedback" role="status"><span>YOUR CHOICE · {decision.opts[selected][0]}</span><p>{decision.opts[selected][1]}</p><small>Switch choices to compare what each one might emphasize.</small></div>:null}
      </section>:null}
      {!visualPilot&&!sceneSequence&&!fieldGuide?<div className="reading-note">EXPLORE · COMPARE · PRACTISE · CHECK YOUR LEARNING</div>:null}
      <button className="language-toggle" type="button" aria-pressed={showTelugu} onClick={()=>{const enabled=!showTelugu;setShowTelugu(enabled);saveTelugu(enabled);window.frameOneLegacy?.setTelugu(enabled);}}>{showTelugu?'Hide Telugu explanation':'తెలుగులో సులభంగా చెప్పు'} <span aria-hidden="true">⇄</span></button>
      {showTelugu ? <aside className="telugu-note" lang="te"><strong>చిన్న వివరణ · Telugu quick explanation</strong><p>{notes[lesson.id]}</p><small>ఇది సంక్షిప్త సారాంశం మాత్రమే. పూర్తి పాఠం ఇంగ్లీష్‌లో ఉంది.</small></aside>:null}
      {fieldGuide?<details className="fg-deeper" data-field-deeper>
        <summary>Explore the complete filmmaking lesson</summary>
        <div className="fg-deeper-content">
          {lesson.sections.map(([heading,explanation],i)=><section className="lesson-section" key={i}><h3>{heading}</h3><p>{explanation}</p></section>)}
          {board?<Storyboard key={lesson.id} board={board}/>:null}
        </div>
      </details>:null}
      {sceneSequence?<details className="sq-deeper" data-sequence-deeper>
        <summary>Explore the complete lesson and extra storyboard</summary>
        <div className="sq-deeper-content">
          {lesson.sections.map(([heading,explanation],i)=><section className="lesson-section" key={i}><h3>{heading}</h3><p>{explanation}</p></section>)}
          {board?<Storyboard key={lesson.id} board={board}/>:null}
        </div>
      </details>:null}
      {visualPilot?<details className="vl-deeper" data-visual-deeper>
        <summary>Explore the craft in more detail</summary>
        <div className="vl-deeper-content">
          {lesson.sections.map(([heading,explanation],i)=><section className="lesson-section" key={i}><h3>{heading}</h3><p>{explanation}</p></section>)}
        </div>
      </details>:!sceneSequence&&!fieldGuide?lesson.sections.map(([heading, explanation],i)=><section className="lesson-section" key={i}><h3>{heading}</h3><p>{explanation}</p></section>):null}
      {!sceneSequence&&!fieldGuide&&board ? <Storyboard key={lesson.id} board={board}/>:null}
      <aside className="key-idea"><strong>THE BIG IDEA</strong><p>{String(lesson.idea)}</p></aside>
      <aside className="exercise"><strong>✦ TRY THIS YOURSELF</strong><p>{String(lesson.try)}</p>
        <div className="lesson-craft-actions">
          {link ? <button className="btn-secondary lab-deep-link" type="button"
            onClick={()=>('lab' in link ? openLab(link.lab) : navigate('crafts'))}>{link.label} →</button>:null}
          {linkedPractice?<button className="btn-secondary lesson-practice-link" type="button"
            data-lesson-practice={linkedPractice}
            onClick={()=>{stagePracticeHandoff(linkedPractice);navigate('home');}}>
            Film it yourself · {practiceById(linkedPractice).title} →
          </button>:null}
        </div>
        {linkedPractice?<small className="lesson-practice-description">Opens a three-step phone-filming exercise. Your lesson progress stays unchanged.</small>:null}
      </aside>
      <section className="practice-notes">
        <label htmlFor="lessonPractice">My own filmmaking idea · optional</label>
        <textarea id="lessonPractice" maxLength={240} value={practice} onChange={e=>{const next=e.target.value;setPractice(next);persistPractice(next);}} placeholder="Write one simple example from your life or a film you imagine..." />
        <button className="btn-secondary" type="button" onClick={()=>setSaveStatus(persistPractice(practice)?'Saved on this device.':'Could not save here. Copy your note before leaving.')}>Save idea on this device</button>
        <span className="note-status" role="status">{saveStatus}</span>
        <p className="story-help">Private in this browser’s local storage. No account or cloud upload. Completing the lesson does not require notes.</p>
      </section>
      <section className="quiz" id="lesson-stage-check" tabIndex={-1}
        data-lesson-stage="check" aria-label="Knowledge check">
        <span className="eyebrow-secondary">CHECK WHAT YOU UNDERSTOOD</span><h3>{lesson.q}</h3>
        <div className="quiz-options">{lesson.opts.map((option,i)=><button className={`quiz-option ${quiz!==null&&i===lesson.answer?'right':''} ${quiz===i&&i!==lesson.answer?'wrong':''}`} type="button" key={i} disabled={quiz!==null} onClick={()=>{setQuiz(i);setQuizStatus('');}}>{String.fromCharCode(65+i)}. {option}</button>)}</div>
        <div className={`quiz-feedback ${quiz!==null&&!correct?'error':''}`} role="status" aria-live="polite">{quiz===null?quizStatus:<>{correct?'✓ Exactly. ':'Not quite. '}{lesson.feedback}</>}</div>
        <div className="lesson-actions">
          {quiz!==null&&!correct?<button className="btn-secondary" type="button"
            data-lesson-revisit onClick={()=>jumpToLessonStage('explore')}>Review the visual scene ↗</button>:null}
          {quiz!==null&&!correct?<button className="btn-secondary" type="button" onClick={()=>{setQuiz(null);setQuizStatus('Choose another answer.');}}>Try again</button>:null}
          <button className="cta" type="button" disabled={!correct} onClick={finishLesson}>{completed?'✓ Completed — continue':'Mark lesson complete'} →</button>
        </div>
      </section>
      {series&&seriesPosition&&journeyId?<section className="series-scene-outro" aria-label="Continue your film journey"
        data-scene-transition={intermission?'act':nextScene?'scene':'finale'}>
        <div className="series-scene-reflection">
          <span className="cinema-overline">AFTER THIS SCENE · ACT {String(activeActNumber).padStart(2,'0')}</span>
          <p>{activeAct?.reflection}</p>
        </div>
        {intermission&&followingPosition?<div className="series-intermission" aria-label="Coming up in your cinema series">
          <span className="cinema-overline">THE NEXT ACT · {String(nextActNumber).padStart(2,'0')} OF 03</span>
          <h3>{intermission.title}</h3>
          <p>{intermission.cue}</p>
        </div>:null}
        <div className="series-up-next">
          <span className="cinema-overline">{nextScene?'YOUR NEXT SCENE':'THE FINAL FRAME'}</span>
          <h3>{nextScene?nextScene.title:series.closing}</h3>
          {nextScene?<p>{nextScene.subtitle}</p>:<p>Your completed lessons stay in your journey. Explore the next collection whenever you wish.</p>}
        </div>
        <nav className="lesson-pagination series-scene-pagination" aria-label="Lesson navigation">
          <button className="btn-secondary" type="button" disabled={!seriesPosition.prev}
            onClick={()=>{if(seriesPosition.prev)navigate('lesson',seriesPosition.prev)}}>← Previous in series</button>
          <button className="btn-secondary" type="button"
            onClick={()=>seriesPosition.next?navigate('lesson',seriesPosition.next):navigate('collection',journeyId)}>
            {seriesPosition.next?'Next in series →':'Return to collection →'}
          </button>
        </nav>
      </section>:<nav className="lesson-pagination" aria-label="Lesson navigation">
        <button className="btn-secondary" type="button" disabled={index<=0} onClick={()=>navigate('lesson',lessons[index-1].id)}>← Previous lesson</button>
        <button className="btn-secondary" type="button" disabled={index>=lessons.length-1} onClick={()=>navigate('lesson',lessons[index+1].id)}>Next lesson →</button>
      </nav>}
    </article>
  </div>;
}
