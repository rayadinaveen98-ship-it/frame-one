/* Direct the Moment: deterministic four-decision story and offline UI regression. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data='src/data/direct-the-moment.ts',component='src/components/DirectTheMoment.tsx',
  home='src/components/CinemaLibraryHome.tsx',css='src/components/direct-the-moment.css';
for(const file of [data,component,home]){
  const node=ts.createSourceFile(file,read(file),ts.ScriptTarget.Latest,true,
    file.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
  assert.equal(node.parseDiagnostics.length,0,file+' has an invalid TypeScript syntax tree');
}
const mod={exports:{}};
vm.runInNewContext(ts.transpileModule(read(data),{compilerOptions:{
  module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022
}}).outputText,{module:mod,exports:mod.exports});
const {makeDirectorTreatment,directionGroups,quietTake,uneasyTake}=mod.exports;
assert.equal(directionGroups.length,4);
assert.deepEqual(JSON.parse(JSON.stringify(directionGroups.map(x=>x.id))),['frame','light','sound','edit']);
assert.deepEqual(JSON.parse(JSON.stringify(quietTake)),{frame:'wide',light:'warm',sound:'room',edit:'hold'});
assert.deepEqual(JSON.parse(JSON.stringify(uneasyTake)),{frame:'close',light:'cold',sound:'pulse',edit:'reveal'});
const outputs=new Set();
for(const frame of ['wide','close'])for(const light of ['warm','cold'])
for(const sound of ['room','pulse'])for(const edit of ['hold','reveal']){
  const plan={frame,light,sound,edit},a=makeDirectorTreatment(plan);
  assert(a.firstShot&&a.framingWhy&&a.lightWhy&&a.soundWhy&&a.editWhy&&a.possibleReading);
  assert(a.firstShot.includes(edit==='hold'?'0–6s':'0–4s'));
  assert.equal(Boolean(a.secondShot),edit==='reveal');
  if(edit==='reveal')assert(a.secondShot.includes('4–6s')&&a.secondShot.includes('Typing'));
  assert(a.soundDirection.includes('described, not played'));
  assert.equal(a.firstShot.includes('Cool window light'),light==='cold');
  assert.equal(a.firstShot.includes('Wide view'),frame==='wide');
  outputs.add([a.firstShot,a.secondShot,a.soundDirection].join('|'));
}
assert.equal(outputs.size,16,'all sixteen possible takes must have distinct meaningful treatments');
const view=read(component),homeSrc=read(home),styles=read(css),browser=read('scripts/browser-smoke.cjs');
assert(homeSrc.includes("import {DirectTheMoment} from './DirectTheMoment'"));
assert(homeSrc.includes('<DirectTheMoment/>'));
assert(view.includes('aria-expanded={expanded}')&&view.includes('aria-controls="direct-moment-workspace"'));
assert(view.includes("setPlan(p=>({...p,frame:'close'}))"));
assert(view.includes("setPlan(p=>({...p,light:'cold'}))"));
assert(view.includes("setPlan(p=>({...p,sound:'pulse'}))"));
assert(view.includes("setPlan(p=>({...p,edit:'reveal'}))"));
assert(view.includes('data-direct-preview-light={plan.light}'));
assert(view.includes('data-direct-preview-frame={plan.frame}'));
assert(view.includes('data-direct-preview-sound={plan.sound}'));
assert(view.includes('data-direct-preview-edit={plan.edit}'));
assert(view.includes('aria-pressed={plan.frame')&&view.includes('aria-pressed={plan.light'));
assert(view.includes('aria-pressed={plan.sound')&&view.includes('aria-pressed={plan.edit'));
assert(view.includes("onClick={()=>openLab('story')}"),'Make Lab must be working and its data independent');
assert(view.includes("onClick={()=>openLab('sound')}"),'Sound Lab must be a real playback option');
assert(view.includes('not automatically transferred'),'do not promise an integration with Make Lab that does not exist');
assert(!view.includes('localStorage')&&!view.includes('fetch('),'workshop must not mutate learner progress or require internet');
assert(styles.includes("data-direct-preview-frame='close'")&&styles.includes("data-direct-preview-light='cold'"));
assert(styles.includes('@media(max-width:600px)')&&styles.includes('@media(max-width:350px)'));
assert(browser.includes('data-direct-preview'),'real-browser tests must exercise rendered workshop');
assert(browser.includes('data-direct-make-lab'),'real-browser tests must check working Make Lab route');
console.log('PASS: Direct the Moment 16 combinations, 4 independent decisions, real illustrated modes, accessible offline workshop and Make Lab handoff disclaimer.');
