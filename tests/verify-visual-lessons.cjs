/* Visual lesson pilot regression: authorship, truthfulness, routes and no storage. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),vm=require('node:vm');
const root=path.join(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,name),'utf8');
const curriculum=JSON.parse(read('src/data/curriculum.v08b.json'));
const source='src/data/visual-lessons.ts',component='src/components/VisualLessonPilot.tsx';
for(const file of [source,component,'src/components/LessonView.tsx']){
 const tree=ts.createSourceFile(file,read(file),ts.ScriptTarget.Latest,true,
  file.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 assert.equal(tree.parseDiagnostics.length,0,file+' must parse');
}
const moduleValue={exports:{}};
vm.runInNewContext(ts.transpileModule(read(source),{compilerOptions:{
 module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022
}}).outputText,{module:moduleValue,exports:moduleValue.exports});
const {visualPilots,visualPilotForLesson}=moduleValue.exports;
assert.deepEqual(Object.keys(visualPilots),['lighting','rhythm','ambience','shot','composition','colour']);
const ids=new Set(curriculum.lessons.map(item=>item.id));
for(const [id,pilot] of Object.entries(visualPilots)){
 assert(ids.has(id),'Pilots use real curriculum routes');
 assert.equal(visualPilotForLesson(id),pilot);
 assert.equal(pilot.id,id);
 assert.equal(pilot.takes.length,2);
 assert(pilot.question.length>20&&pilot.hook.length>10);
 assert(pilot.takes[0].label!==pilot.takes[1].label);
 assert(pilot.takes.every(take=>take.cue&&take.focus&&take.description.length>60));
 assert(pilot.discovery.length>30&&pilot.reason.length>50);
 assert.equal(pilot.notice.length,3);
 assert(pilot.takeaway.length>25&&pilot.prompt.length>50);
 assert(['light','cut','sound','frame','colour'].includes(pilot.lab));
 assert(pilot.labLabel.length>10&&pilot.footnote.length>45);
}
assert.equal(visualPilotForLesson('why'),null);
assert.equal(visualPilotForLesson('__proto__'),null,'Inherited prototype must not be a pilot');
assert.equal(visualPilots.rhythm.takes[0].cue.includes('6 seconds'),true);
assert.equal(visualPilots.rhythm.takes[1].cue.includes('2s'),true);
assert(visualPilots.ambience.footnote.includes('not audio playback'));
assert(visualPilots.lighting.footnote.includes('not photographed footage'));
const nextFrames='src/components/VisualFramesNext.tsx';
const nextTree=ts.createSourceFile(nextFrames,read(nextFrames),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
assert.equal(nextTree.parseDiagnostics.length,0,'Additional visual frames parse');
const newArt=read(nextFrames);
for(const part of ['ShotSizeFrames','CompositionFrames','ColourFrames']){
 assert(newArt.includes('export function '+part),'New visual lesson has its own actual artwork: '+part);
}
assert(newArt.includes('const close=take===1'),'Shot size changes the visible crop');
assert(newArt.includes('const off=take===1'),'Composition alters the figure placement');
assert(newArt.includes('const accent=take===1'),'Colour controls a single visual accent');
const view=read(component),lesson=read('src/components/LessonView.tsx');
const css=read('src/components/visual-lessons.css'),browser=read('scripts/browser-smoke.cjs');
assert(view.includes("data-visual-option={index===0?'a':'b'}"));
assert(view.includes('data-visual-take={take}'));
assert(view.includes('role="group"')&&view.includes('aria-pressed={take===index}'));
assert(view.includes('data-visual-reveal')&&view.includes('aria-expanded={revealed}'));
assert(view.includes('data-visual-focus')&&view.includes('data-visual-description'));
assert(view.includes("take===0?['Indoor room tone','No background score']"));
assert(view.includes('<SoundFrame/>'),'Sound scene is locked independent of selected sound direction');
for(const part of ['ShotSizeFrames','CompositionFrames','ColourFrames']){
 assert(view.includes('<'+part+' take={take}/>'),'Shared lesson renderer mounts '+part);
}
assert(view.includes("openLab(pilot.lab)"),'Real related working Labs');
assert(lesson.includes('<VisualLessonPilot key={lesson.id} lessonId={lesson.id}/>'));
assert(lesson.includes('<details className="vl-deeper" data-visual-deeper>'));
assert(lesson.includes('lesson.sections.map'),'Existing lesson text must remain accessible');
for(const key of ['completeLesson(lesson.id)','savePractice(lesson.id','quiz===null','showTelugu']){
 assert(lesson.includes(key),'Existing progress and accessible lesson controls are preserved: '+key);
}
assert(!view.includes('fetch(')&&!view.includes('localStorage')&&!view.includes('getUserMedia'));
assert(!read(source).includes('fetch(')&&!read(source).includes('localStorage'));
assert(css.includes('@media(max-width:350px)'));
assert(css.includes('prefers-reduced-motion'));
assert(browser.includes('[data-visual-lesson="lighting"]'),'Real-browser checks must exercise stage');
console.log('PASS: six illustrated visual-first lessons, A/B stages, honest sound directions, accessible discovery, existing quiz/notes and no storage changes.');
