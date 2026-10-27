/* Capacitor App native Back integration: compiled TypeScript with platform
 * stubs, run in CI without a physical device. */
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
const file=path.join(root,'src/android-back.ts');
const source=fs.readFileSync(file,'utf8');
const compiled=ts.transpileModule(source,{fileName:file,reportDiagnostics:true,compilerOptions:{
  target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS
}});
assert.equal(compiled.diagnostics?.filter(d=>d.category===ts.DiagnosticCategory.Error).length||0,0);

function mock(platform,hash){
  let cb=null;
  let minimized=0, navigated=0, subscribed=0;
  const m={exports:{}};
  let blurred=0;
  const document={activeElement:null};
  const focus=(tagName='TEXTAREA')=>{document.activeElement={tagName,isContentEditable:false,blur(){blurred++;document.activeElement=null;}};};
  const win={location:{hash},frameOneLegacy:{goBack(){navigated++}}};
  const app={
    addListener:async (name,callback)=>{
      assert.equal(name,'backButton');subscribed++;cb=callback;
      return {remove:async()=>{}};
    },
    minimizeApp:async()=>{minimized++;}
  };
  const modules={
    '@capacitor/core':{Capacitor:{isNativePlatform:()=>platform!=='web',getPlatform:()=>platform}},
    '@capacitor/app':{App:app}
  };
  vm.runInNewContext(compiled.outputText,{module:m,exports:m.exports,require:name=>{
    assert(Object.hasOwn(modules,name),'No unexpected dependency '+name);return modules[name];
  },window:win,document,console},{filename:file,timeout:5000});
  return {register:m.exports.registerAndroidBack,back:()=>{assert(cb,'listener was not installed');cb();},focus,
    stats:()=>({minimized,navigated,subscribed,blurred}),window:win};
}
(async()=>{
  for(const platform of ['web','ios']){
    const t=mock(platform,'#lesson/why');
    await t.register();
    assert.equal(t.stats().subscribed,0,platform+' must not intercept browser/iOS Back');
  }
  const d=mock('android','#lesson/why');
  await d.register();
  assert.equal(d.stats().subscribed,1,'register official Capacitor plugin on Android');
  d.focus('TEXTAREA');
  d.back();
  assert.equal(d.stats().blurred,1,'Back blurs Android focused textarea to close IME');
  assert.equal(d.stats().navigated,0,'closing Android keyboard must not navigate away from an unsaved lesson');
  d.back();
  assert.equal(d.stats().navigated,1,'second Back delegates to validated learning history');
  assert.equal(d.stats().minimized,0,'lesson Back must not minimize app');
  d.window.location.hash='#lab';
  d.focus('INPUT');
  d.back();
  assert.equal(d.stats().navigated,1,'Back in an editing field must not leave a lab');
  d.back();
  assert.equal(d.stats().navigated,2,'lab Back delegates to existing learning history');
  d.window.location.hash='#home';
  d.back();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(d.stats().navigated,2,'Home Back must not navigate to external page');
  assert.equal(d.stats().minimized,1,'Home Back minimizes instead of terminating activity');
  console.log('PASS: Android Back first blurs active editors, then navigates safely; Home minimizes.');
})().catch(e=>{console.error(e);process.exitCode=1});
