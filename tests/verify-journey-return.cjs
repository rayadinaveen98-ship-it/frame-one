/* v0.11A5: derived film re-entry must never fake recency or Lab completion. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function compiled(file,imports={}){
  const module={exports:{}};
  const src=ts.transpileModule(read(file),{compilerOptions:{
    module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022
  }}).outputText;
  vm.runInNewContext(src,{module,exports:module.exports,require:name=>{
    if(!(name in imports))throw Error('Unexpected import '+name);
    return imports[name];
  }});
  return module.exports;
}
const library=compiled('src/data/cinema-library.ts');
const series=compiled('src/data/cinema-series.ts',{'./cinema-library':library});
const resumes=compiled('src/data/journey-progress.ts',{
  './cinema-library':library,'./cinema-series':series
});
const allIds=JSON.parse(read('src/data/curriculum.v08b.json')).lessons.map(l=>l.id);
assert.equal(resumes.startedFilmJourneys(new Set()).length,0,
  'A fresh learner has not started anything');
assert.equal(resumes.startedFilmJourneys(new Set(['fake','unknown'])).length,0,
  'Unknown progress IDs are not journeys');
let journeys=resumes.startedFilmJourneys(new Set(['why']));
assert.equal(journeys.length,1);
assert.equal(journeys[0].id,'beginnings');
assert.equal(journeys[0].completed,1);
assert.equal(journeys[0].total,5);
assert.equal(journeys[0].nextEntry.id,'history');
assert.equal(journeys[0].actIndex,0);
journeys=resumes.startedFilmJourneys(new Set(['why','history']));
assert.equal(journeys[0].nextEntry.id,'units');
assert.equal(journeys[0].actIndex,1,
  'A completed act resumes at the next real act');
journeys=resumes.startedFilmJourneys(new Set(['why','history','units','genres']));
assert.equal(journeys[0].actIndex,2);
assert.equal(journeys[0].nextEntry.id,'india');
const begun=new Set(['why','shot','camera']);
journeys=resumes.startedFilmJourneys(begun);
assert.equal(journeys.length,2);
assert.equal(journeys[0].id,'visual','Most completed unfinished journey is shown first');
assert.equal(journeys[1].id,'beginnings');
journeys=resumes.startedFilmJourneys(new Set(['why','history','units','genres','india','shot']));
assert.equal(journeys[0].id,'visual','Unfinished collections before completed ones');
assert.equal(journeys[1].id,'beginnings');
assert.equal(journeys[1].allDone,true);
assert.equal(journeys[1].completed,5);
assert.equal(journeys[1].nextEntry.id,'why','Finished journey reopens its beginning');
const completedAll=resumes.startedFilmJourneys(new Set(allIds));
assert.equal(completedAll.length,5,'Studio remains unscored; five lesson collections exist');
assert(completedAll.every(x=>x.allDone));
assert(!completedAll.some(x=>x.id==='studio'));
const home=read('src/components/CinemaLibraryHome.tsx');
const css=read('src/components/cinema-library.css');
assert(home.includes('startedFilmJourneys(completed)'));
assert(home.includes('data-journey-resume={journey.id}'));
assert(home.includes('onClick={()=>openCollection(journey.id)}'));
assert(home.includes('<JourneyResumeRail completed={completed}/>'));
assert(!home.includes('localStorage.setItem'),'No competing store for journey recency');
assert(css.includes('.cinema-journey-return-card:focus-visible'));
assert(css.includes('@media(max-width:350px)'));
for(const p of ['src/data/journey-progress.ts','src/components/CinemaLibraryHome.tsx']){
 const node=ts.createSourceFile(p,read(p),ts.ScriptTarget.Latest,true,
    p.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 assert.equal(node.parseDiagnostics.length,0,p+' parses');
}
console.log('PASS: truthful re-entry for 5 film journeys, correct act boundaries, original progress only and no fake Lab activity.');
