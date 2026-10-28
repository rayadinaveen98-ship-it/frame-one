/* Frame One browser/PWA/Android WebView safe Back route contract.
 * No real device needed; this tests the exact legacy history bridge.
 */
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const assert=require('node:assert/strict');
const code=fs.readFileSync(path.join(__dirname,'../src/legacy/runtime.js'),'utf8').replace(/export\s*\{\s*\};?\s*$/,'');
function boot(initialHash=''){
  const listeners={},events=[],data={};
  const location={hash:initialHash,protocol:'file:'};
  const stack=[{hash:initialHash,state:null}];
  let index=0;
  const history={
    get state(){return stack[index].state;},
    pushState(state,_title,hash){
      stack.splice(index+1);stack.push({hash,state});index++;
      location.hash=hash;
    },
    replaceState(state,_title,hash){stack[index]={state,hash};location.hash=hash;},
    back(){if(index>0){index--;location.hash=stack[index].hash;listeners.popstate?.();}}
  };
  const contentEl={innerHTML:''};
  const nodes={
    content:contentEl,
    progressLabel:{textContent:''},
    progressCircle:{style:{setProperty(){}}}
  };
  const document={
    getElementById:key=>nodes[key]??null,
    querySelectorAll:()=>[],
    querySelector:()=>null,
    addEventListener:(event,handler)=>listeners['document:'+event]=handler,
    createElement:()=>({click(){},remove(){}}),
    body:{appendChild(){}}
  };
  const storage={
    getItem:key=>data[key]??null,
    setItem:(key,value)=>{data[key]=value;},
    removeItem:key=>{delete data[key];}
  };
  const window={
    addEventListener:(event,handler)=>{listeners[event]=handler;},
    dispatchEvent:event=>{events.push(event);},
    scrollTo(){}
  };
  const ctx={
    document,localStorage:storage,window,history,location,
    CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}},
    Event:class{constructor(type){this.type=type;}},
    navigator:{},Date,Set,Blob,URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}},
    setTimeout,clearTimeout,console,confirm:()=>true
  };
  vm.runInNewContext(code,ctx,{timeout:6000});
  return {bridge:window.frameOneLegacy,history,location,stack,events,storage,now:()=>index};
}

const app=boot();
assert.equal(app.location.hash,'#home','cold launch lands on home');
assert.equal(app.history.state.frameOneDepth,0,'cold launch does not invent prior in-app history');
app.bridge.goBack();
assert.equal(app.now(),0,'back on home does not exit into a prior browser entry');
app.bridge.navigate('learn');
assert.equal(app.history.state.frameOneDepth,1);
app.bridge.navigate('lesson','why');
assert.equal(app.location.hash,'#lesson/why');
assert.equal(app.history.state.frameOneDepth,2);
app.bridge.goBack();
assert.equal(app.location.hash,'#learn','Back returns to actual prior chapter screen');
assert.equal(app.history.state.frameOneDepth,1,'popped route keeps its history marker');
app.bridge.goBack();
assert.equal(app.location.hash,'#home','Back returns home');
assert.equal(app.history.state.frameOneDepth,0);
app.bridge.goBack();
assert.equal(app.now(),0,'root Back remains inside app');
app.bridge.openLab('sound');
assert.equal(app.location.hash,'#lab','opening a lab records a navigable route');
app.bridge.goBack();
assert.equal(app.location.hash,'#home','Back leaves the lab for the previous screen');

// Collection visits are ordinary, owned Frame One history entries—not modals.
app.bridge.openCollection('visual');
assert.equal(app.location.hash,'#collection/visual','real collection deep link');
assert.equal(app.events.at(-1).detail.collection,'visual','React receives exact selected collection');
assert.equal(app.history.state.frameOneDepth,1,'collection adds one navigation depth');
app.bridge.navigate('lesson','shot');
assert.equal(app.location.hash,'#lesson/shot');
app.bridge.goBack();
assert.equal(app.location.hash,'#collection/visual','Android Back returns from lesson to collection');
assert.equal(app.events.at(-1).detail.collection,'visual');
app.bridge.goBack();
assert.equal(app.location.hash,'#home','Back from collection returns Home');
app.bridge.openCollection('missing-collection');
assert.equal(app.location.hash,'#home','unknown collection never becomes a route');

const collectionDirect=boot('#collection/studio');
assert.equal(collectionDirect.location.hash,'#collection/studio','cold deep link opens real Lab collection');
assert.equal(collectionDirect.events.at(-1).detail.collection,'studio');
collectionDirect.bridge.goBack();
assert.equal(collectionDirect.location.hash,'#home','direct collection Back never exits app');
const unknownCollection=boot('#collection/invented');
assert.equal(unknownCollection.location.hash,'#home','invalid deep links fail safely');

// Collection-originating lessons retain series context across genuine history entries.
app.bridge.openCollection('visual');
app.bridge.navigate('lesson','shot');
assert.equal(app.location.hash,'#lesson/shot');
assert.equal(app.history.state.frameOneJourney,'visual');
assert.equal(app.events.at(-1).detail.journey,'visual');
app.bridge.completeLesson('shot',{nextLessonId:'lighting'});
assert.equal(app.location.hash,'#lesson/lighting','series completion chooses its own valid next lesson');
assert.equal(app.history.state.frameOneJourney,'visual','next part keeps series context');
assert.equal(JSON.parse(app.storage.getItem('frameone-progress-v01')).includes('shot'),true);
app.bridge.goBack();
assert.equal(app.location.hash,'#lesson/shot');
assert.equal(app.history.state.frameOneJourney,'visual','Back restores prior series context');
app.bridge.goBack();
assert.equal(app.location.hash,'#collection/visual','Back returns to real collection');
app.bridge.navigate('lesson','colour');
app.bridge.completeLesson('colour',{returnCollectionId:'visual'});
assert.equal(app.location.hash,'#collection/visual','completing final part returns to collection');
assert.equal(JSON.parse(app.storage.getItem('frameone-progress-v01')).includes('colour'),true);
app.bridge.navigate('home');
app.bridge.navigate('lesson','why');
assert.equal(app.history.state.frameOneJourney,null,'ordinary lessons do not inherit stale collection context');
app.bridge.completeLesson('why');
assert.equal(app.location.hash,'#lesson/history','ordinary syllabus completion keeps original next lesson behavior');
// Deep-linked users must never need an external browser entry to navigate Back.
const direct=boot('#lesson/why');
assert.equal(direct.location.hash,'#lesson/why');
assert.equal(direct.history.state.frameOneDepth,0);
direct.bridge.goBack();
assert.equal(direct.location.hash,'#learn','direct lesson link falls back to chapters');
assert.equal(direct.history.state.frameOneDepth,1);
const lab=boot('#lab');lab.bridge.goBack();
assert.equal(lab.location.hash,'#home','direct lab link falls back home');
console.log('PASS: Frame One route markers, lesson/lab Back, cold-start home and direct-link fallback without external navigation.');
