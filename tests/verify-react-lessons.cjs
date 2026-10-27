const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
const root=path.join(__dirname,'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'src/data/curriculum.v08b.json')));
const board=JSON.parse(fs.readFileSync(path.join(root,'src/data/storyboards.json')));
for (const [pathRel,kind] of [
 ['src/App.tsx',ts.ScriptKind.TSX],['src/components/LessonView.tsx',ts.ScriptKind.TSX],
 ['src/state/learning.ts',ts.ScriptKind.TS],['src/legacy/bridge.ts',ts.ScriptKind.TS],
 ['src/data/schema.ts',ts.ScriptKind.TS]
]){
 const full=path.join(root,pathRel),input=fs.readFileSync(full,'utf8');
 const src=ts.createSourceFile(full,input,ts.ScriptTarget.ES2022,true,kind);
 assert.strictEqual(src.parseDiagnostics.length,0,`TypeScript parsing: ${pathRel}`);
 const compiled=ts.transpileModule(input,{fileName:full,reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext}});
 assert.strictEqual((compiled.diagnostics||[]).filter(x=>x.category===ts.DiagnosticCategory.Error).length,0,`transpilation: ${pathRel}`);
}
assert.strictEqual(Object.keys(data.choices).length,33,'all lessons have a creative decision');
assert.strictEqual(Object.keys(data.teluguNotes).length,33,'all lessons have a Telugu helper');
assert.strictEqual(Object.keys(board).length,10,'ten preserved illustrated mini scenes');
for(const [id,scene] of Object.entries(board)){
 assert(data.lessons.some(l=>l.id===id),`valid scene link ${id}`);
 assert.strictEqual(scene.items.length,3,`three beats ${id}`);
 for(const item of scene.items)assert(['place','person','detail'].includes(item[0]),`known original art: ${id}`);
}
const view=fs.readFileSync(path.join(root,'src/components/LessonView.tsx'),'utf8');
for(const str of ['readPractice','savePractice','showTelugu','quiz===null','completeLesson(lesson.id)','aria-pressed','Storyboard','aria-live'])assert(view.includes(str),`React lesson feature: ${str}`);
// Test shared key behaviour on real JSON data through transpiled storage helpers.
const storePath=path.join(root,'src/state/learning.ts');
const js=ts.transpileModule(fs.readFileSync(storePath,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const m={exports:{}},mem={'frameone-progress-v01':JSON.stringify(['why','not-a-lesson'])};
vm.runInNewContext(js,{exports:m.exports,module:m,localStorage:{getItem:k=>mem[k]??null,setItem:(k,v)=>{mem[k]=v}},Object,JSON,Set});
const store=m.exports;
const valid=data.lessons.map(l=>l.id);
assert.deepStrictEqual([...store.safeProgress(valid)],['why']);
assert.strictEqual(store.readPractice('why'),'');
assert(store.savePractice('why','my first shot'));
assert.strictEqual(store.readPractice('why'),'my first shot');
assert.strictEqual(store.savePractice('shot','x'.repeat(500)),true);
assert.strictEqual(store.readPractice('shot').length,240);
store.saveTelugu(true);assert(store.readTelugu());
mem['frameone-practice-v07']='{bad json';assert.strictEqual(store.readPractice('why'),'');
assert.strictEqual(store.savePractice('why','recovered note'),true);
console.log('PASS: React TSX syntax; 33 choice + Telugu content mappings; 10 three-beat storyboards; progress and notes key compatibility; malformed storage recovery.');
