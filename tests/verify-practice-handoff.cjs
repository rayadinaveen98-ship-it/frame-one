/* v0.13A9: real lesson-to-film-practice navigation and zero-persistence contract. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const curriculum=JSON.parse(read('src/data/curriculum.v08b.json'));
const source='src/state/practice-handoff.ts';
const compiled=ts.transpileModule(read(source),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const moduleValue={exports:{}};
vm.runInNewContext(compiled,{module:moduleValue,exports:moduleValue.exports});
const {lessonPracticeMatches,practiceForLesson,stagePracticeHandoff,takePracticeHandoff}=moduleValue.exports;
const missions=['three-shots','light','silence','rhythm'];
const lessons=new Set(curriculum.lessons.map(lesson=>lesson.id));
assert.equal(Object.keys(lessonPracticeMatches).length,15);
assert.deepEqual(new Set(Object.values(lessonPracticeMatches)),new Set(missions));
for(const [id,mission] of Object.entries(lessonPracticeMatches)){
  assert(lessons.has(id),'All matched lessons exist: '+id);
  assert(missions.includes(mission),'Mission matches a real exercise: '+mission);
  assert.equal(practiceForLesson(id),mission);
}
assert.equal(practiceForLesson('why'),null,'Not every lesson needs a filming task');
assert.equal(practiceForLesson('__proto__'),null,'Inherited JS keys cannot become lesson routes');
assert.equal(takePracticeHandoff(),null);
stagePracticeHandoff('light');
assert.equal(takePracticeHandoff(),'light','An intentional handoff must be consumed once');
assert.equal(takePracticeHandoff(),null,'A second Home visit cannot reopen old practice');
stagePracticeHandoff('three-shots');
stagePracticeHandoff('silence');
assert.equal(takePracticeHandoff(),'silence','Most recent explicit navigation wins');
assert.throws(()=>stagePracticeHandoff('invented-practice'),/Unknown filmmaking practice/);
assert.equal(takePracticeHandoff(),null,'Bad values never get staged');

const view=read('src/components/FilmItYourself.tsx');
const lesson=read('src/components/LessonView.tsx');
const styles=read('src/components/lesson-react.css');
const practiceCss=read('src/components/film-it-yourself.css');
const browser=read('scripts/browser-smoke.cjs');
for(const file of [source,'src/components/FilmItYourself.tsx','src/components/LessonView.tsx']){
  const tree=ts.createSourceFile(file,read(file),ts.ScriptTarget.Latest,true,file.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
  assert.equal(tree.parseDiagnostics.length,0,'Bad TypeScript syntax: '+file);
}
assert(lesson.includes('practiceForLesson(lesson.id)'));
assert(lesson.includes('data-lesson-practice={linkedPractice}'));
assert(lesson.includes("stagePracticeHandoff(linkedPractice);navigate('home')"));
assert(view.includes('useState<PracticeId|null>(takePracticeHandoff)'));
assert(view.includes('useState(Boolean(incoming))'),'Only incoming lesson expands practice automatically');
assert(view.includes("incoming??'three-shots'"),'Matching mission is preselected');
assert(view.includes('heading.scrollIntoView(')&&view.includes('heading.focus('));
assert(view.includes('data-practice-arrival'),'Only lesson handoffs show arrival feedback');
assert(!read(source).includes('localStorage')&&!read(source).includes('sessionStorage')&&!read(source).includes('fetch('));
assert(styles.includes('@media(max-width:500px)'));
assert(practiceCss.includes('.practice-arrival'));
assert(browser.includes('data-lesson-practice="light"'),'Real-browser handoff coverage required');
console.log('PASS: fifteen real lessons link to all four offline practice missions; one-shot routing, focus and no saved state.');
