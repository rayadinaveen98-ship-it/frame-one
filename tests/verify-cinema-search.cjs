/* Real offline quick-search must index every authored cinema destination safely. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const curriculum=JSON.parse(read('src/data/curriculum.v08b.json'));

function transpile(file,requireFn){
  const code=read(file);
  const tree=ts.createSourceFile(file,code,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
  assert.equal(tree.parseDiagnostics.length,0,file+' has invalid syntax');
  const mod={exports:{}};
  vm.runInNewContext(ts.transpileModule(code,{compilerOptions:{
    target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true
  }}).outputText,{exports:mod.exports,module:mod,require:requireFn});
  return mod.exports;
}
const library=transpile('src/data/cinema-library.ts',()=>{throw Error('No runtime imports expected')});
const engine=transpile('src/data/cinema-search.ts',name=>{
  if(name==='./curriculum.v08b.json')return curriculum;
  if(name==='./cinema-library')return library;
  throw Error('Unexpected search dependency: '+name);
});
const {cinemaSearchIndex,searchCinemaLibrary}=engine;
const entries=library.cinemaShelves.flatMap(shelf=>shelf.entries);
assert.equal(cinemaSearchIndex.length,41,'Every 33 lessons, 7 labs and roles destination is searchable');
assert(entries.length<cinemaSearchIndex.length,
  'Search must include lessons outside the six curated Home shelves');
for(const entry of entries){
  assert(cinemaSearchIndex.some(item=>item.entry.kind===entry.kind&&item.entry.id===entry.id),
    'Every curated shelf item must be searchable');
}
const keys=cinemaSearchIndex.map(item=>item.entry.kind+':'+item.entry.id);
assert.equal(new Set(keys).size,41,'Results must never duplicate destinations');
assert.equal(keys.filter(key=>key.startsWith('lesson:')).length,33);
assert.equal(keys.filter(key=>key.startsWith('lab:')).length,7);
assert(keys.includes('roles:crafts'));
const validLessonIds=new Set(curriculum.lessons.map(item=>item.id));
for(const item of cinemaSearchIndex){
  assert(item.title.length>0&&item.subtitle.length>0&&item.category.length>0);
  if(item.entry.kind==='lesson')assert(validLessonIds.has(item.entry.id));
}
assert.equal(searchCinemaLibrary('  ').total,0);
assert.equal(searchCinemaLibrary('').results.length,0);
assert.equal(searchCinemaLibrary('notarealfilmmakingterm').total,0);
assert.equal(searchCinemaLibrary('lighting').results[0].entry.id,'lighting','Exact lesson title ranked first');
assert.deepEqual(JSON.parse(JSON.stringify(searchCinemaLibrary('EDITING'))),
  JSON.parse(JSON.stringify(searchCinemaLibrary('editing'))),
  'Search must ignore case without forcing an incorrect result order');
assert(searchCinemaLibrary('editing').results.some(item=>item.entry.id==='editing'),
  'Editing lessons must remain discoverable even when their titles use different words');
assert.equal(searchCinemaLibrary('  Film     roles ').results[0].entry.kind,'roles');
assert(searchCinemaLibrary('cinematography').results.some(item=>item.entry.id==='camera'));
assert(searchCinemaLibrary('silence').results.some(item=>item.entry.id==='ambience'));
assert(searchCinemaLibrary('director').results.some(item=>item.entry.id==='crew'));
assert(searchCinemaLibrary('frame shot').results.some(item=>item.entry.id==='units'));
const broad=searchCinemaLibrary('film');
assert(broad.total>8,'Common terms must have a bounded result list');
assert.equal(broad.results.length,8);
assert.equal(searchCinemaLibrary('film',3).results.length,3);
assert.equal(searchCinemaLibrary('film',0).results.length,0);
assert.equal(searchCinemaLibrary('film',200).results.length,broad.total);
assert.deepEqual(
  JSON.parse(JSON.stringify(searchCinemaLibrary('lighting'))),
  JSON.parse(JSON.stringify(searchCinemaLibrary(' lighting  '))),
  'Whitespace differences do not change ranking'
);
const component=read('src/components/CinemaQuickFind.tsx');
const home=read('src/components/CinemaLibraryHome.tsx');
const css=read('src/components/cinema-search.css');
const browser=read('scripts/browser-smoke.cjs');
for(const file of ['src/components/CinemaQuickFind.tsx','src/components/CinemaLibraryHome.tsx']){
  const tree=ts.createSourceFile(file,read(file),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  assert.equal(tree.parseDiagnostics.length,0,file+' parse');
}
assert(home.includes('<CinemaQuickFind completed={completed}/>'));
assert(component.includes('type="search"')&&component.includes('role="search"'));
assert(component.includes('onKeyDown={keys}')&&component.includes("event.key==='Escape'"));
assert(component.includes('aria-live="polite"')&&component.includes('aria-pressed')===false);
assert(component.includes('openLab(item.entry.id)')&&component.includes("navigate('crafts')"));
assert(component.includes("navigate('lesson',item.entry.id)"));
assert(component.includes('data-cinema-search-result'));
assert(!component.includes('localStorage')&&!component.includes('fetch(')&&!component.includes('sessionStorage'));
assert(!read('src/data/cinema-search.ts').includes('fetch('));
assert(css.includes('@media(max-width:350px)'));
assert(browser.includes('data-cinema-quick-find'),'Browser checks must exercise the rendered search');
console.log('PASS: 41 real offline search destinations, ranking, aliases, bounded results, keyboard/route contracts, no new storage.');
