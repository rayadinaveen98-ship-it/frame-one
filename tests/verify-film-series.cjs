/* Curated three-act film series: original content, honest progress, safe routes. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const c=JSON.parse(read('src/data/curriculum.v08b.json'));
const exportsOf=(p,req={})=>{
  const moduleValue={exports:{}};
  const out=ts.transpileModule(read(p),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
  vm.runInNewContext(out,{module:moduleValue,exports:moduleValue.exports,require:(name)=>{
    if(name==='./cinema-library')return req;
    throw Error('unplanned import: '+name);
  }});
  return moduleValue.exports;
};
const library=exportsOf('src/data/cinema-library.ts');
const series=exportsOf('src/data/cinema-series.ts',library);
const list=library.cinemaShelves;
assert.equal(list.length,6);
assert.equal(series.filmSeries.length,6);
const allIds=new Set(c.lessons.map(x=>x.id));
for(const shelf of list){
  const journey=series.seriesById(shelf.id);
  assert(journey,'Every published collection has editorial chapters');
  assert.equal(journey.acts.length,3);
  assert(journey.invitation.length>=45&&journey.closing.length>=45);
  assert.equal(journey.acts.reduce((sum,act)=>sum+act.count,0),shelf.entries.length);
  assert.equal(new Set(journey.acts.map(act=>act.title)).size,3);
  for(const act of journey.acts){
    assert(act.title.length>10&&act.cue.length>24&&act.reflection.length>28);
    assert(act.count>0);
  }
  for(let i=0;i<shelf.entries.length;i++){
    const idx=series.actAtIndex(journey,i);
    assert(idx>=0&&idx<3);
    if(i>0)assert(idx>=series.actAtIndex(journey,i-1),'acts must be sequential');
  }
  const lessons=shelf.entries.filter(e=>e.kind==='lesson');
  for(let i=0;i<lessons.length;i++){
    const entry=lessons[i];assert(allIds.has(entry.id));
    const pos=series.seriesLessonPosition(shelf.id,entry.id);
    assert(pos);
    assert.equal(pos.index,i);
    assert.equal(pos.count,lessons.length);
    assert.equal(pos.prev,i>0?lessons[i-1].id:null);
    assert.equal(pos.next,i<lessons.length-1?lessons[i+1].id:null);
  }
}
assert.equal(series.seriesLessonPosition('studio','why'),null);
assert.equal(series.seriesLessonPosition('not-a-series','shot'),null);
for(const p of ['src/components/CollectionJourney.tsx','src/components/LessonView.tsx','src/components/CinemaArtwork.tsx']){
  const node=ts.createSourceFile(p,read(p),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  assert.equal(node.parseDiagnostics.length,0,p+' syntax');
}
const view=read('src/components/CollectionJourney.tsx');
const lesson=read('src/components/LessonView.tsx');
const runtime=read('src/legacy/runtime.js');
const art=read('src/components/CinemaArtwork.tsx');
const app=read('src/App.tsx');
for(const s of ['data-collection-act','series.acts.map','collection-act-reflection','collection-finale',
                 'collection-next-label','safeProgress(allIds)','progress not tracked']){
 assert(view.includes(s),'series layout exposes '+s);
}
// v0.11A4 previews a real act, then enters its real first unfinished scene.
for(const required of ['data-act-select={index+1}','aria-pressed={featuredIndex===index}',
  'data-featured-act={featuredIndex+1}','data-spotlight-start','onClick={()=>enter(featuredNext)}',
  'const [previewAct,setPreviewAct]=useState<number|null>(null)',
  'const upcomingAct=actAtIndex(series,pendingIndex>=0?pendingIndex:0)',
  "featuredEntries.find(entry=>entry.kind==='lesson'&&!completed.has(entry.id))",
  "const featuredTotal=featuredEntries.filter(entry=>entry.kind==='lesson').length"]){
  assert(view.includes(required),'real act selector contract: '+required);
}
assert(lesson.includes('data-series-lesson={journeyId}'));
assert(lesson.includes("seriesPosition.next?")&&lesson.includes("{nextLessonId:seriesPosition.next}:{returnCollectionId:journeyId}"));
assert(lesson.includes('Previous in series')&&lesson.includes('Next in series'));
assert(lesson.includes('series-intermission')&&lesson.includes('followingPosition.actIndex!==seriesPosition?.actIndex'),
  'Intermission occurs only when the next lesson actually crosses an act');
assert(lesson.includes('Next lesson →'),'non-series syllabus controls unchanged');
// v0.12A2: the scene-to-scene reading experience is true to the existing
// lesson/act editorial model; standalone syllabus lessons stay unchanged.
for(const contract of [
  'className="series-scene-heading"',
  'className="series-scene-progress" role="progressbar"',
  'aria-label="Current scene in film journey"',
  'data-scene-transition={intermission?',
  'className="series-scene-outro"',
  'className="series-scene-reflection"',
  'className="series-up-next"',
  'nextScene?nextScene.title:series.closing',
  "nextScene=seriesPosition?.next?lessons.find(item=>item.id===seriesPosition.next):null",
  "activeAct?.reflection",
  "className=\"lesson-pagination series-scene-pagination\"",
  "seriesPosition.next?'Next in series →':'Return to collection →'",
  'navigate(\'learn\')'
]) assert(lesson.includes(contract),'Scene continuity contract: '+contract);
const sceneCss=read('src/components/lesson-react.css');
for(const css of ['.series-scene-outro','.series-scene-progress','.series-scene-pagination','@media(max-width:350px)','prefers-reduced-motion']){
  assert(sceneCss.includes(css),'Accessible, narrow-friendly lesson transition styling: '+css);
}
assert(!lesson.includes('localStorage.setItem'),'Scene continuity does not add tracking keys');
assert(lesson.includes('completeLesson(lesson.id,seriesPosition.next?'),
  'Actual completion still delegates to the existing progress engine');
assert(runtime.includes('frameOneJourney:state.page===\'lesson\'?state.journey:null'),'history context persists');
assert(runtime.includes("continuation?.returnCollectionId===state.journey"),'return-to-series completion restricted to current context');
assert(runtime.includes('finished.add(id);persist()'),'original progress key remains sole source');
assert(app.includes('journeyId={route.journey}'),'React receives exact legacy series route');
assert(art.includes('artId=art'),'cover variants are deterministic across refreshes');
assert(art.includes('cinema-poster-signature'),'poster variants have original decorative signatures');
// v0.12A1 adds optional one-act cinema focus without changing progress or routes.
for(const required of [
  'const [focusAct,setFocusAct]=useState(false)',
  'const chaptersRef=useRef<HTMLElement>(null)',
  'data-act-focus-entry',
  'data-collection-focus-toggle',
  "data-collection-view-mode={focusAct?'focus':'all'}",
  'data-focus-previous',
  'data-focus-next',
  'if(focusAct&&index!==featuredIndex)return null',
  'setPreviewAct(index)',
  'setFocusAct(true)',
  'disabled={featuredIndex===0}',
  'disabled={featuredIndex===series.acts.length-1}'
])assert(view.includes(required),'cinematic act focus contract missing: '+required);
const collectionCss=read('src/components/collection-journey.css');
assert(collectionCss.includes('@media(max-width:350px)'),'focus controls fit smallest supported Android width');
assert(collectionCss.includes('prefers-reduced-motion:reduce'),'focus animation honors reduced motion');
assert(!view.includes('localStorage.setItem')&&!lesson.includes('sessionStorage.setItem'),'no new content-progress store');
assert(view.includes(":'Try this act'")&&view.includes("'EXPLORE THIS ACT'"),'studio previews remain unscored');
assert(!view.includes('fetch(')&&!art.includes('fetch('),'all series content and art bundled offline');
console.log('PASS: six original three-act film series, native history-aware lesson progression, offline posters and legacy progress compatibility.');
