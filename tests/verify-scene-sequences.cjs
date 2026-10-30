/* v0.13A13: verify real progressive scene content, accessibility and saved-state compatibility. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),
 ts=require('typescript'),vm=require('node:vm');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const paths=['src/data/scene-sequences.ts','src/components/SceneSequence.tsx','src/components/LessonView.tsx'];
for(const p of paths){
 const tree=ts.createSourceFile(p,read(p),ts.ScriptTarget.Latest,true,p.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 assert.equal(tree.parseDiagnostics.length,0,'Parse '+p);
}
const mod={exports:{}};
vm.runInNewContext(ts.transpileModule(read(paths[0]),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module:mod,exports:mod.exports});
const {sceneSequences,sceneSequenceForLesson}=mod.exports;
const curriculum=JSON.parse(read('src/data/curriculum.v08b.json'));
const real=new Set(curriculum.lessons.map(l=>l.id));
assert.deepEqual(Object.keys(sceneSequences),['units','showdonttell','continuity']);
for(const [id,story] of Object.entries(sceneSequences)){
 assert(real.has(id),'The authored journey must be a real existing lesson');
 assert.equal(sceneSequenceForLesson(id),story);
 assert.equal(story.id,id);
 assert.equal(story.beats.length,3);
 assert.equal(new Set(story.beats.map(b=>b.heading)).size,3);
 for(const beat of story.beats){
  assert(beat.heading.length>6&&beat.caption.length>15&&beat.focus.length>45);
 }
 assert(story.question.length>19&&story.setup.length>50);
 assert(story.discovery.length>40&&story.why.length>95);
 assert(story.takeaway.length>35&&story.challenge.length>70);
 assert(['cut','story','continuity'].includes(story.lab));
}
assert.equal(sceneSequenceForLesson('__proto__'),null);
assert.equal(sceneSequenceForLesson('shot'),null,'A/B pilots stay independent');
assert.match(sceneSequences.continuity.beats[0].caption,/left/);
assert.match(sceneSequences.continuity.beats[2].caption,/right/);
assert.match(sceneSequences.showdonttell.why,/not an absolute/);
assert.match(sceneSequences.units.why,/not actual moving footage/);
const component=read(paths[1]),lesson=read(paths[2]),css=read('src/components/scene-sequences.css');
for(const x of ['data-scene-sequence={sequence.id}','data-sequence-stage={beat}',
 'data-sequence-beat={i}','data-sequence-next','data-sequence-finale','data-sequence-discover',
 'data-sequence-lab={sequence.lab}','aria-current={beat===i','aria-expanded={revealed}',
 'role="region"','onClick={()=>openLab(sequence.lab)}']){
 assert(component.includes(x),'Real sequence behavior: '+x);
}
for(const art of ['UnitsArt','StoryArt','ContinuityArt'])assert(component.includes('<'+art+' beat={beat}/>'));
assert(component.includes('sceneSequenceForLesson(lessonId)'));
assert(component.includes('setRevealed(false)'), 'Switching beats hides old explanations');
assert(lesson.includes('<SceneSequence key={lesson.id} lessonId={lesson.id}/>'));
assert(lesson.includes('className="sq-deeper" data-sequence-deeper'));
assert(lesson.includes('lesson.sections.map'),'Original deeper reading must be preserved');
assert(lesson.includes('{board?<Storyboard'),'Original frame/shot/scene artwork preserved in disclosure');
for(const key of ['completeLesson(lesson.id)','savePractice(lesson.id','showTelugu','quiz===null']){
 assert(lesson.includes(key),'Old quiz, notes, progress and Telugu helper must remain: '+key);
}
assert(!component.includes('localStorage')&&!component.includes('fetch(')&&!component.includes('getUserMedia'));
assert(!read(paths[0]).includes('localStorage'));
assert(css.includes('@media(max-width:350px)')&&css.includes('prefers-reduced-motion'));
assert(read('scripts/browser-smoke.cjs').includes('data-scene-sequence="continuity"'),
 'Real browser must test the new sequence UI');
console.log('PASS: three progressive visual lesson journeys, protected original content and offline state');
