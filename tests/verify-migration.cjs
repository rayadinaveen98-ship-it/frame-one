const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(root,'src/legacy/runtime.js'),'utf8');
const standalone=fs.readFileSync(path.join(root,'preview/index.html'),'utf8');
const data=JSON.parse(fs.readFileSync(path.join(root,'src/data/curriculum.v08b.json'),'utf8'));
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
assert.strictEqual(data.lessons.length,33);assert.strictEqual(data.chapters.length,6);
assert.strictEqual(data.glossary.length,47);assert.strictEqual(data.crafts.length,9);
assert.strictEqual(new Set(data.lessons.map(x=>x.id)).size,33);
for(const l of data.lessons){
 assert(l.title && l.sections?.length===3 && l.opts?.length===3);
 assert(Number.isInteger(l.answer)&&l.answer>=0&&l.answer<3,`valid answer: ${l.id}`);
 assert(data.teluguNotes[l.id], `short Telugu helper: ${l.id}`);
}
for(const lab of ['frame','sound','cut','light','story','colour','continuity']) assert(js.includes(`data-lab="${lab}"`)||js.includes(`data-lab="${lab}`)||js.includes(`lab:'${lab}'`)||js.includes(`lab==='${lab}'`),`lab: ${lab}`);
for(const key of ['frameone-progress-v01','frameone-scene-v07','frameone-practice-v07']) assert(js.includes(key),key);
for(const file of ['src/App.tsx','src/main.tsx','src/legacy/legacy.css','public/sw.js','capacitor.config.ts','preview/app.js','preview/app.css','preview/manifest.webmanifest']) assert(fs.existsSync(path.join(root,file)),file);
assert(standalone.includes('<link rel="stylesheet" href="./app.css">'));
assert(standalone.includes('<script src="./app.js" defer></script>'));
assert(!standalone.includes('<script>'), 'external scripts separated');
assert.strictEqual(pkg.dependencies.react.slice(0,3),'^19');
const memory={'frameone-progress-v01':JSON.stringify(['why','shot'])};const events={};const routes=[];
const els={content:{innerHTML:''},progressCircle:{style:{setProperty(){}}},progressLabel:{textContent:''}};
const doc={getElementById:k=>els[k]||null,querySelectorAll:()=>[],querySelector:()=>({scrollIntoView(){}}),addEventListener:(n,fn)=>events[n]=fn,body:{appendChild(){}},createElement:()=>({click(){},remove(){}})};
const ctx={document:doc,localStorage:{getItem:k=>memory[k]||null,setItem:(k,v)=>memory[k]=v},window:{addEventListener(){},dispatchEvent(event){if(event.type==='frameone:route')routes.push(event.detail)},scrollTo(){}},CustomEvent:class {constructor(type,options){this.type=type;this.detail=options.detail;}},navigator:{},history:{replaceState(){},pushState(){}},location:{hash:'',protocol:'file:'},confirm:()=>true,console,Set,Blob,Date,clearTimeout,setTimeout,URL:{createObjectURL(){return'blob:test'},revokeObjectURL(){}}};
vm.runInNewContext(js.replace(/export\s*\{\s*\};?\s*$/, ''),ctx,{timeout:5000});
assert.strictEqual(els.progressLabel.textContent,'2/33 lessons');
function click(dataset){events.click({target:{closest(){return {dataset,id:''}}}});return els.content.innerHTML;}
assert.strictEqual(click({page:'learn'}),'', 'React owns chapter explorer markup');assert.strictEqual(routes.at(-1).page,'learn');
click({lesson:'why'});assert.strictEqual(els.content.innerHTML,'', 'React owns lesson markup');assert.strictEqual(routes.at(-1).page,'lesson');assert.strictEqual(routes.at(-1).lesson,'why');assert(ctx.window.frameOneLegacy, 'React bridge exposed');
assert.strictEqual(typeof ctx.window.frameOneLegacy.exportBackup,'function');
assert.strictEqual(typeof ctx.window.frameOneLegacy.importBackup,'function');
assert(ctx.window.frameOneLegacy.savePractice('why','a real React note'));
assert.strictEqual(JSON.parse(memory['frameone-practice-v07']).why,'a real React note');
ctx.window.frameOneLegacy.setTelugu(true);
assert.strictEqual(memory['frameone-telugu-helper-v03'],'yes');
click({lesson:'history'});
ctx.window.frameOneLegacy.completeLesson('history');
assert.strictEqual(els.progressLabel.textContent,'3/33 lessons');
assert.strictEqual(routes.at(-1).lesson,'units');
click({page:'lab'});assert.strictEqual(click({lab:'story'}),'', 'React owns Make Lab; legacy leaves content empty');assert.strictEqual(routes.at(-1).lab,'story');assert.strictEqual(click({lab:'cut'}),'', 'React owns Cut Lab; legacy leaves content empty');assert.strictEqual(routes.at(-1).lab,'cut');assert.strictEqual(click({lab:'light'}),'', 'React owns Lighting Lab; legacy leaves content empty');assert.strictEqual(routes.at(-1).lab,'light');assert.strictEqual(click({lab:'frame'}),'', 'React owns Frame Lab; legacy leaves content empty');assert.strictEqual(routes.at(-1).lab,'frame');assert.strictEqual(click({lab:'colour'}),'', 'React owns Colour Lab; legacy leaves content empty');assert.strictEqual(routes.at(-1).lab,'colour');
assert.strictEqual(click({lab:'sound'}),'', 'React owns Sound Lab; legacy leaves content empty');assert.strictEqual(routes.at(-1).lab,'sound');
assert.strictEqual(click({lab:'continuity'}),'', 'React owns Continuity Lab; legacy leaves content empty');
assert.strictEqual(routes.at(-1).lab,'continuity', 'legacy route supplies selected lab to React');
assert.strictEqual(click({lab:'story'}),'', 'Make is React-owned on every visit');
const draft=ctx.window.frameOneLegacy.getStoryboard();
assert.strictEqual(draft.question,'mystery');
draft.question='reunion';draft.notes[1]='Keep the clue for the middle.';
assert(ctx.window.frameOneLegacy.saveStoryboard(draft),'original engine accepts typed storyboard');
assert.strictEqual(JSON.parse(memory['frameone-scene-v07']).notes[1],'Keep the clue for the middle.');
assert.strictEqual(ctx.window.frameOneLegacy.getStoryboard().question,'reunion');
assert.strictEqual(typeof ctx.window.frameOneLegacy.exportShotList,'function');

// An interrupted backup restore must not strand partially replaced learning
// progress/notes while continuing to show the previous in-memory storyboard.
const oldData={...memory};
const oldStory=ctx.window.frameOneLegacy.getStoryboard();
const oldSetItem=ctx.localStorage.setItem;
let simulatedFailure=true;
ctx.localStorage.setItem=(key,value)=>{
  if(key==='frameone-scene-v07'&&simulatedFailure){simulatedFailure=false;throw Error('Simulated WebView storage failure');}
  return oldSetItem(key,value);
};
const replacement={
  format:'frameone-learning-backup',version:1,
  completed:['why'],notes:{why:'Incoming restored note'},
  scene:{question:'mystery',shots:['wide','medium','close'],notes:['First','Second','Third']}
};
assert.throws(()=>ctx.window.frameOneLegacy.importBackup(replacement),/could not be saved/i);
ctx.localStorage.setItem=oldSetItem;
assert.deepStrictEqual(memory,oldData,'interrupted restore should roll back previous stored values');
assert.strictEqual(JSON.stringify(ctx.window.frameOneLegacy.getStoryboard()),JSON.stringify(oldStory),'interrupted restore must not change in-memory storyboard');
console.log('PASS: React migration source contract, 33 lesson records, 7 lab routes, preserved storage identifiers, and interrupted backup rollback.');
