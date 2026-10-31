const fs=require('fs'),path=require('path'),assert=require('assert'),vm=require('vm');
const ts=require('typescript');
const root=path.join(__dirname,'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'src/data/curriculum.v08b.json'),'utf8'));
const tsx=fs.readFileSync(path.join(root,'src/components/LearnView.tsx'),'utf8');
const app=fs.readFileSync(path.join(root,'src/App.tsx'),'utf8');
const runtime=fs.readFileSync(path.join(root,'src/legacy/runtime.js'),'utf8');
const types=fs.readFileSync(path.join(root,'src/legacy/bridge.ts'),'utf8');
assert.strictEqual(data.chapters.length,6);
assert.strictEqual(data.glossary.length,47);
assert.strictEqual(data.chapters.reduce((n,c)=>n+c.ids.length,0),33);
for(const id of data.chapters.flatMap(x=>x.ids))assert(data.lessons.some(l=>l.id===id),'known lesson ID: '+id);
for(const f of ['src/App.tsx','src/components/LessonView.tsx','src/components/LearnView.tsx','src/legacy/bridge.ts']){
 const code=fs.readFileSync(path.join(root,f),'utf8');
 const parsed=ts.createSourceFile(f,code,ts.ScriptTarget.Latest,true,f.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 assert.strictEqual(parsed.parseDiagnostics.length,0,`TS source parse: ${f}`);
 const transpiled=ts.transpileModule(code,{fileName:f,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext}});
 assert.strictEqual((transpiled.diagnostics||[]).filter(x=>x.category===ts.DiagnosticCategory.Error).length,0,`TS source transpile: ${f}`);
}
for(const needle of ['setFilter','setQuery','setGlossaryQuery','safeProgress','chapters.map','filter===','glossary.filter','aria-valuenow','LearningBackup','importBackup','exportBackup','getBackupJSON','backupPasteText','backupCopyText','Restore pasted backup'])assert(tsx.includes(needle),'React chapter feature: '+needle);
assert(tsx.includes("window.confirm('Restore this backup?"),'restoring local learning data requires explicit consent');
assert(tsx.includes("if(!window.frameOneLegacy) throw new Error('Learning engine not ready')"),'backup download must not claim success when engine is unavailable');
assert(app.includes("heading.focus({ preventScroll: true })"), 'page navigation must restore accessible focus');
assert(tsx.includes('chapter-mobile-toggle') && tsx.includes('aria-expanded={expandedChapters.has(i)}'), 'mobile chapter disclosure is accessible');
assert(tsx.includes('previous.has(i)?[]:[i]'), 'only one chapter expands on narrow screens');
assert(app.includes("route.page==='learn' ? <LearnView />"));
assert(app.includes("route.page==='lesson'||route.page==='learn'"));
assert(runtime.includes("state.page==='learn'?'':"),'legacy does not own React chapter DOM');
for(const needle of ['exportBackup:()=>downloadBackup()','importBackup:(payload)=>{restoreBackup(payload);window.dispatchEvent(new Event(\'frameone:story-restored\'));render()}'])assert(runtime.includes(needle),'legacy backed export or validated import');
assert(types.includes('importBackup: (data: unknown) => void'));
// Exercise backup import through exact legacy validation including rejecting malformed input.
const memory={};const ev={};const view={innerHTML:''},count={textContent:''};
const elem={content:view,progressCircle:{style:{setProperty(){}}},progressLabel:count};
const c={document:{getElementById:k=>elem[k]||null,querySelectorAll:()=>[],querySelector:()=>null,addEventListener:(n,fn)=>ev[n]=fn,body:{appendChild(){}},createElement:()=>({click(){},remove(){}})},
 localStorage:{getItem:k=>memory[k]??null,setItem:(k,v)=>{memory[k]=v}},window:{addEventListener(){},dispatchEvent(){},scrollTo(){}},navigator:{},
 location:{hash:'',protocol:'file:'},history:{pushState(){},replaceState(){}},confirm:()=>true,Event:class{constructor(t){this.type=t;}},CustomEvent:class{constructor(t,d){this.type=t;this.detail=d.detail}},
 Blob,URL:{createObjectURL:()=> 'blob:x',revokeObjectURL(){}},Date,JSON,Object,Set,setTimeout,clearTimeout,console};
vm.runInNewContext(runtime.replace(/export\s*\{\s*\};?\s*$/,''),c,{timeout:7000});
const bridge=c.window.frameOneLegacy;
assert(bridge);
assert.strictEqual(typeof bridge.getBackupJSON,'function','bridge provides portable backup JSON');
const exported = JSON.parse(bridge.getBackupJSON());
assert.strictEqual(exported.format,'frameone-learning-backup');
assert.strictEqual(exported.version,1);
assert(Array.isArray(exported.completed) && typeof exported.notes==='object' && exported.scene,'text backup contains original schema and learner story');
const valid={format:'frameone-learning-backup',version:1,completed:['why','history','unknown'],notes:{why:'A scene of my own'},scene:{question:'mystery',shots:['wide','medium','close'],notes:['one','two','three']}};
// Account for original scene question IDs rather than presuming a named ID.
const script=fs.readFileSync(path.join(root,'src/legacy/runtime.js'),'utf8');
const sceneKeys=[...script.matchAll(/\{id:'([^']+)',question:/g)].map(m=>m[1]);
if(sceneKeys.length)valid.scene.question=sceneKeys[0];
const storedBefore=JSON.stringify(memory);
assert.strictEqual(typeof bridge.inspectBackup,'function','Read-only backup inspection must exist');
const inspection=bridge.inspectBackup(valid);
assert.strictEqual(inspection.completedLessons,2,'Only unique known lessons count');
assert.strictEqual(inspection.practiceNotes,1,'Only valid lesson notes count');
assert.strictEqual(inspection.storyboardShots,3,'Three storyboard slots retained');
assert.strictEqual(JSON.stringify(memory),storedBefore,'Inspecting a valid backup never writes to storage');
assert(!JSON.stringify(inspection).includes('A scene of my own'),'Private note content is never exposed in preview');
assert.throws(()=>bridge.inspectBackup({format:'frameone-learning-backup',version:1,completed:[],notes:{},scene:null}),/Scene in backup is invalid/);
assert.strictEqual(JSON.stringify(memory),storedBefore,'Inspecting an invalid backup never writes to storage');
assert.throws(()=>bridge.importBackup({format:'frameone-learning-backup',version:1,completed:[],notes:{},scene:null}),/Scene in backup is invalid/);
assert.strictEqual(JSON.stringify(memory),storedBefore,'failed import leaves data alone');
try {bridge.importBackup(valid)} catch(e){ if(/Scene in backup is invalid/.test(e.message)){ // extract allowable IDs via source declared story choices
 const match=script.match(/const sceneQuestions\s*=\s*\{([\s\S]*?)\}\s*;/);
 if(match){const m=match[1].match(/(\w+)\s*:\s*\{/);if(m) valid.scene.question=m[1];}
 bridge.importBackup(valid);
 }else throw e; }
assert.strictEqual(JSON.parse(memory['frameone-progress-v01']).length,2);
assert.strictEqual(JSON.parse(memory['frameone-practice-v07']).why,'A scene of my own');
assert.strictEqual(JSON.parse(memory['frameone-scene-v07']).shots[1],'medium');
assert.strictEqual(count.textContent,'2/33 lessons');
console.log('PASS: six React chapter paths, 33 filtered lesson records, 47 bilingual terms, TSX parse, progress and validated backup import bridge.');
