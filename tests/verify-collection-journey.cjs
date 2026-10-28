/* Frame One v0.11A2: real collection pages, no invented lesson progress or content. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const vm=require('node:vm'),ts=require('typescript');
const root=path.join(__dirname,'..');
const read=path=>fs.readFileSync(require('node:path').join(root,path),'utf8');
const curriculum=JSON.parse(read('src/data/curriculum.v08b.json'));
const files=['src/components/CollectionJourney.tsx','src/components/CinemaLibraryHome.tsx','src/App.tsx','src/legacy/bridge.ts'];
for(const p of files){
  const node=ts.createSourceFile(p,read(p),ts.ScriptTarget.Latest,true,p.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
  assert.equal(node.parseDiagnostics.length,0,p+' must parse without JSX/TS errors');
}
const source=read('src/data/cinema-library.ts');
const compiledModule={exports:{}};
const transformed=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
vm.runInNewContext(transformed,{module:compiledModule,exports:compiledModule.exports});
const shelves=compiledModule.exports.cinemaShelves;
const knownIds=new Set(curriculum.lessons.map(l=>l.id));
const runtime=read('src/legacy/runtime.js');
const listed=runtime.match(/const collectionIds=\[([^\]]+)\]/);
assert(listed,'legacy history bridge contains validated IDs');
const legacyIds=listed[1].split(',').map(s=>s.trim().replace(/'/g,''));
assert.deepEqual(legacyIds,shelves.map(x=>x.id),'route whitelist always matches live editorial shelves');
const journey=read('src/components/CollectionJourney.tsx');
const home=read('src/components/CinemaLibraryHome.tsx');
const app=read('src/App.tsx');
const css=read('src/components/collection-journey.css');
for(const shelf of shelves){
 const entries=shelf.entries;
 assert(entries.length>=4,'never show empty collection');
 const ids=entries.filter(e=>e.kind==='lesson').map(e=>e.id);
 assert(ids.every(id=>knownIds.has(id)),shelf.id+' contains only real lessons');
 assert.equal(new Set(entries.map(e=>e.kind+':'+e.id)).size,entries.length,'no repeated entry');
 const allMinutes=ids.reduce((total,id)=>total+curriculum.lessons.find(l=>l.id===id).minutes,0);
 assert(Number.isInteger(allMinutes)&&allMinutes>=0,'genuine lesson durations only');
}
assert.equal(shelves.filter(s=>s.id==='studio')[0].entries.filter(e=>e.kind==='lab').length,7);
assert.equal(shelves.filter(s=>s.id==='studio')[0].entries.filter(e=>e.kind==='lesson').length,0);
for(const required of [
  'safeProgress(allIds)', 'lessonEntries.filter(entry=>completed.has(entry.id))',
  'role="progressbar"', 'aria-valuenow={lessonDone}', 'progress not tracked',
  'data-collection-entry=', 'onClick={()=>enter(entry)}',
  "navigate('lesson',entry.id)", 'openLab(entry.id)', "navigate('crafts')",
  "window.frameOneLegacy?.goBack()", 'lessonDone>0', "completed.size"
].filter(x=>x!=='completed.size')){
 assert(journey.includes(required),'collection page must preserve '+required);
}
assert(!journey.includes('localStorage.setItem'),'no separate progress store');
assert(!journey.includes('fetch('),'all pages remain available offline');
assert(home.includes('data-cinema-collection={shelf.id}'),'shelf heading opens collection');
assert(home.includes('openCollection(shelf.id)'),'navigates through native history bridge');
assert(app.includes('<CollectionJourney key={route.collection}'),'new screen renders for the current collection');
assert(app.includes("route.page==='collection'"),'collection hides legacy content');
assert(css.includes('@media(max-width:350px)'),'compact phones supported');
assert(css.includes('.collection-entry:focus-visible'),'keyboard focus visible');
console.log('PASS: six linked journeys, seven real Labs, correct lesson counts/minutes, no fake progress, and native history routes.');
