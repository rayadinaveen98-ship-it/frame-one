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
