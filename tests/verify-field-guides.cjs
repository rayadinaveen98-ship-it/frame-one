/* v0.13A15: 14 grounded visual-first field guides cover the final curriculum routes. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),
 ts=require('typescript'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
const files=['src/data/visual-field-guide.ts','src/components/FieldGuideArtwork.tsx',
 'src/components/VisualFieldGuide.tsx','src/components/LessonView.tsx'];
for(const file of files){
 const tree=ts.createSourceFile(file,read(file),ts.ScriptTarget.Latest,true,
  file.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 assert.equal(tree.parseDiagnostics.length,0,file+' must parse');
}
const mod={exports:{}};
vm.runInNewContext(ts.transpileModule(read(files[0]),{compilerOptions:{
 module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022
}}).outputText,{module:mod,exports:mod.exports});
const {fieldLessons,fieldLessonForId}=mod.exports;
const curriculum=JSON.parse(read('src/data/curriculum.v08b.json'));
const expected=['why','history','genres','india','sound','crew','craft24',
 'teams','pipeline','making','shotlist','shootscene','editminute','review'];
assert.deepEqual(Object.keys(fieldLessons),expected);
assert.equal(expected.length,14);
const all=new Set(curriculum.lessons.map(lesson=>lesson.id));
for(const [id,lesson] of Object.entries(fieldLessons)){
 assert(all.has(id),'Every new guide belongs to an existing published lesson');
 assert.equal(fieldLessonForId(id),lesson);
 assert.equal(lesson.id,id);
 assert.equal(lesson.beats.length,3);
 assert(new Set(lesson.beats.map(item=>item.tag)).size===3,id+' has 3 distinct stages');
 assert(lesson.setup.length>45&&lesson.question.length>18);
 for(const beat of lesson.beats){
  assert(beat.title.length>11&&beat.observation.length>45,id+' has an intelligible step');
 }
 assert(lesson.discovery.length>45&&lesson.reason.length>75);
 assert(lesson.takeaway.length>25&&lesson.phoneTask.length>57);
 assert(['frame','cut','story','sound'].includes(lesson.lab));
 assert(lesson.labLabel.length>18&&lesson.qualification.length>48);
}
assert.equal(fieldLessonForId('__proto__'),null);
assert.equal(fieldLessonForId('lighting'),null);
assert.match(fieldLessons.history.reason,/not the undisputed first/);
assert.match(fieldLessons.india.reason,/Shree Pundalik/);
assert.match(fieldLessons.craft24.reason,/not present an unverified official list/);
assert.match(fieldLessons.sound.qualification,/not audio recordings/);
const artwork=read(files[1]),player=read(files[2]),lesson=read(files[3]),
 css=read('src/components/field-guide.css'),browser=read('scripts/browser-smoke.cjs');
for(const id of expected){
 assert(artwork.includes("id==='"+id+"'"),'An original diagram mode exists for '+id);
}
for(const name of ['Ribbon','Strip','Note','Person','Camera','Phone','Cup']){
 assert(artwork.includes('function '+name+'('),name+' visual symbol is authored locally');
}
for(const snippet of ['data-visual-field={field.id}','data-field-step={step}',
 'data-field-choice={i}','data-field-next','data-field-discovery',
 'data-field-explain','data-field-lab={field.lab}',
 'aria-current={i===step','aria-expanded={explain}',"openLab(field.lab)",
 'setExplain(false)']){
 assert(player.includes(snippet),'Field guide supports a real interactive behavior: '+snippet);
}
assert(lesson.includes('<VisualFieldGuide key={lesson.id} lessonId={lesson.id}/>'));
assert(lesson.includes('className="fg-deeper" data-field-deeper'));
assert(lesson.includes("lesson.sections.map"),'Original curriculum remains');
assert(lesson.includes('completeLesson(lesson.id)'));
assert(lesson.includes('savePractice(lesson.id'));
assert(lesson.includes('quiz===null')&&lesson.includes('showTelugu'));
assert(css.includes('@media(max-width:350px)')&&css.includes('prefers-reduced-motion'));
assert(browser.includes('data-visual-field'),'Full app Chromium test checks field guides');
for(const file of files.slice(0,3)){
 assert(!read(file).includes('localStorage'),'New teaching visuals do not change persisted data');
 assert(!read(file).includes('fetch('),'Works offline');
 assert(!read(file).includes('getUserMedia'),'Does not silently open camera');
}
console.log('PASS: all fourteen final lessons have authored visual guides, accurate disclaimers, real controls, offline operation and original progress.');
