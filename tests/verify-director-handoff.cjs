/* The transient Director -> Make Lab transfer must preserve all 16 choices,
 * never auto-save, never change backup format, and never invent within-six-second cuts. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const options={compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}};
function load(file,requireModule=()=>{throw Error('Unexpected import')}){
 const mod={exports:{}};
 vm.runInNewContext(ts.transpileModule(read(file),options).outputText,{module:mod,exports:mod.exports,require:requireModule});
 return mod.exports;
}
const original=load('src/components/labs/story-data.ts');
const handoff=load('src/state/director-handoff.ts',(p)=>{
 assert.equal(p,'../components/labs/story-data');
 return original;
});
const {stageDirectorHandoff,peekDirectorHandoff,clearDirectorHandoff,previewDirectorStoryboard}=handoff;
assert.equal(peekDirectorHandoff(),null);
const variants=new Set();
for(const frame of ['wide','close'])for(const light of ['warm','cold'])
for(const sound of ['room','pulse'])for(const edit of ['hold','reveal']){
 const p={frame,light,sound,edit};
 const story=previewDirectorStoryboard(p);
 assert.equal(story.question,'mystery');
 assert.equal(story.shots.length,3);
 assert.equal(story.notes.length,3);
 assert.equal(story.shots[0],frame);
 assert.equal(story.shots[1],edit==='reveal'?'close':frame);
 for(const note of story.notes)assert(note.length>0&&note.length<=240);
 assert.match(story.notes[0],frame==='wide'?/Wide room/:/Close reaction/);
 assert.match(story.notes[0],light==='warm'?/Warm lamp/:/Cool window/);
 assert.match(story.notes[0],sound==='room'?/Rain and fan; no score/:/Low repeating musical pulse/);
 assert.match(story.notes[0],edit==='hold'?/0–6s, one unbroken shot/:/0–4s, first shot/);
 if(edit==='hold'){
  assert.match(story.notes[1],/AFTER 6s \(optional next beat, not a cut in the hold\)/);
 }else{
  assert.match(story.notes[1],/4–6s, phone insert/);
  assert.match(story.notes[1],/Typing/);
 }
 assert.match(story.notes[2],/FUTURE BEAT \(not within the six seconds\)/);
 variants.add(story.notes.join(' ~ '));
 stageDirectorHandoff(p);
 const preview=peekDirectorHandoff();
 assert.equal(preview.frame,frame);
 preview.frame='wide'; // mutate caller copy, not the staged state
 assert.equal(peekDirectorHandoff().frame,frame);
 clearDirectorHandoff();
 assert.equal(peekDirectorHandoff(),null);
}
assert.equal(variants.size,16);
assert.throws(()=>stageDirectorHandoff({frame:'incorrect',light:'warm',sound:'room',edit:'hold'}),/Invalid director choices/);
const source=read('src/state/director-handoff.ts'),make=read('src/components/labs/MakeLab.tsx'),direct=read('src/components/DirectTheMoment.tsx'),browser=read('scripts/browser-smoke.cjs');
assert(!source.includes('localStorage')&&!source.includes('sessionStorage')&&!source.includes('fetch('),'no new storage or network side effects');
assert(source.includes('safeStory('),'use existing bounded legacy storyboard schema');
assert(make.includes('peekDirectorHandoff')&&make.includes('previewDirectorStoryboard'));
assert(make.includes('data-director-handoff')&&make.includes('data-director-keep')&&make.includes('data-director-confirm'));
assert(make.includes('JSON.stringify(latest)!==JSON.stringify(savedAtOffer)'),'reject overwriting changed source');
assert(make.includes('onRestore=()=>{clearDirectorHandoff()'),'restore invalidates any pending handoff');
assert(make.includes('saveStoryboard(directorPreview)'),'only explicit accepted preview is persisted');
assert(make.includes('data-director-export-existing'),'protect custom storyboard via export');
assert(direct.includes('stageDirectorHandoff(plan);openLab(\'story\')'),'pass sketch only to actual Make Lab route');
assert(browser.includes('data-director-confirm')&&browser.includes('data-director-keep'),'browser QA tests both accept and decline');
console.log('PASS: 16 director sketches safely map into 3 existing beats; pending state is ephemeral, and Make Lab requires explicit approval.');
