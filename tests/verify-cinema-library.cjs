/* Offline Cinema Library contract: real curriculum and working feature routes only. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),vm=require('node:vm');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const c=JSON.parse(read('src/data/curriculum.v08b.json'));
const source=read('src/data/cinema-library.ts');
const home=read('src/components/CinemaLibraryHome.tsx');
const artwork=read('src/components/CinemaArtwork.tsx');
const style=read('src/components/cinema-library.css');
const app=read('src/App.tsx');
for(const p of ['src/data/cinema-library.ts','src/components/CinemaArtwork.tsx','src/components/CinemaLibraryHome.tsx']){
 const code=read(p),node=ts.createSourceFile(p,code,ts.ScriptTarget.Latest,true,p.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 assert.equal(node.parseDiagnostics.length,0,p+' must be syntactically valid');
}
const converted=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const moduleValue={exports:{}};
vm.runInNewContext(converted,{module:moduleValue,exports:moduleValue.exports});
const shelves=moduleValue.exports.cinemaShelves;
assert.equal(shelves.length,6,'six curated shelves have substantial content');
const entries=shelves.flatMap(s=>s.entries);
assert(entries.length>=32,'catalog is not three repeated demo cards');
const ids=new Set(c.lessons.map(x=>x.id));
const seen=new Set();
for(const shelf of shelves){
 assert(shelf.id&&shelf.heading&&shelf.introduction,'shelf has editorial metadata');
 assert(shelf.entries.length>=4,'no empty shelf or single demo poster');
 for(const entry of shelf.entries){
  const key=entry.kind+':'+entry.id;
  assert(!seen.has(key),'Home never repeats identical items: '+key);seen.add(key);
  if(entry.kind==='lesson')assert(ids.has(entry.id),'only real completed lessons: '+entry.id);
  if(entry.kind==='lab')assert(['frame','sound','light','cut','story','colour','continuity'].includes(entry.id),'only real Labs');
  if(entry.kind==='roles')assert.equal(entry.id,'crafts');
  assert(['projector','story','frame','light','sound','cut','studio','crew'].includes(entry.art),'all covers have real art');
 }
}
assert.equal(entries.filter(x=>x.kind==='lab').length,7);
assert(entries.some(x=>x.kind==='roles'));
assert.equal(c.lessons.length,33);
assert(home.includes('safeProgress(lessonIds)'),'continue lesson derives from original saved progress');
assert(home.includes("navigate('lesson',entry.id)"),'lesson tile navigates to original route');
assert(home.includes('openLab(entry.id)'),'lab tile opens real experiment');
assert(home.includes("navigate('crafts')"),'roles tile opens original Film Roles');
assert(home.includes('scrollBy('),'shelves have real previous/next scrolling');
assert(home.includes('role="group"'),'horizontal rails are accessible');
assert(home.includes('data-cinema-entry'),'browser tests can exercise actual posters');
assert(home.includes("completed.size>0"),'continue card only appears when user has progress');
assert(app.includes('<CinemaLibraryHome />'),'React Home mounts real discovery shelves');
assert(app.includes('<PersonalFrames />'),'private image slideshow remains independent');
assert(app.includes('cinema-library-active'),'legacy duplicate home cards hidden only on Home');
assert(style.includes('.cinema-library-active #content > .page > .card-grid'),'do not show old duplicate lesson cards');
assert(style.includes('overflow-x:auto'),'shelves swipe horizontally without network');
assert(style.includes('scroll-snap-type:x proximity'),'shelves land on readable card boundaries');
assert(style.includes('@media(max-width:350px)'),'supports compact phones');
assert(artwork.includes("art==='projector'")&&artwork.includes("art==='light'")&&artwork.includes("art==='crew'"),'original authored cover motifs');
assert(!home.includes('fetch(')&&!source.includes('fetch('),'discovery is 100% offline');
assert(!home.includes('localStorage.setItem'),'no competing progress storage or migrations');
assert(!source.includes('coming soon'),'all published Home posters open real lessons or labs');
console.log('PASS: 6 real curated collections, 33 source lessons, 7 working labs, Role route, offline art, and native-scroll shelves.');
