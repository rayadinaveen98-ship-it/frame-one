const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const ts=require('typescript');
const file=path.resolve(__dirname,'../src/native-backup.ts');
const result=ts.transpileModule(fs.readFileSync(file,'utf8'),{
 fileName:file,reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}
});
assert.equal(result.diagnostics?.filter(x=>x.category===ts.DiagnosticCategory.Error).length||0,0);

function setup(platform='android',readMismatch=false){
 const writes=[],reads=[],shares=[];const module={exports:{}};
 const mem=new Map();
 const imports={
  '@capacitor/core':{Capacitor:{isNativePlatform:()=>platform!=='web',getPlatform:()=>platform}},
  '@capacitor/filesystem':{
   Directory:{Cache:'CACHE'},Encoding:{UTF8:'utf8'},
   Filesystem:{
    async writeFile(options){writes.push(options);mem.set(options.path,options.data);return {uri:'file:///data/user/0/frameone/cache/'+options.path}},
    async readFile(options){reads.push(options);return {data:readMismatch?'different content':mem.get(options.path)}}
   }
  },
  '@capacitor/share':{Share:{async share(options){shares.push(options);return {}}}}
 };
 vm.runInNewContext(result.outputText,{
  module,exports:module.exports,TextEncoder,
  require:name=>{assert(name in imports,'Unexpected dependency '+name);return imports[name]},
  console
 },{timeout:5000,filename:file});
 return {...module.exports,writes,reads,shares};
}
const json=JSON.stringify({format:'frameone-learning-backup',version:1,completed:['why'],notes:{why:'My practice'},scene:{question:'mystery',shots:['wide','medium','close'],notes:['A','B','C']}});
(async()=>{
 const native=setup();
 assert.equal(native.isAndroidBackupAvailable(),true);
 await native.shareAndroidLearningBackup(json);
 assert.equal(native.writes.length,1);
 assert.equal(native.reads.length,1);
 assert.equal(native.shares.length,1);
 assert.equal(native.writes[0].directory,'CACHE');
 assert.equal(native.writes[0].encoding,'utf8');
 assert.equal(native.writes[0].path,'frame-one-learning-backup.json');
 assert.equal(native.writes[0].data,json,'Use exact validated v1 data; never modify notes or progress');
 assert.equal(native.shares[0].files[0],'file:///data/user/0/frameone/cache/frame-one-learning-backup.json');
 assert.equal(native.shares[0].files.length,1);
 assert(!JSON.stringify(native.shares[0]).includes('My practice'),'Share external file URI not plaintext private notes');
 const web=setup('web');
 assert.equal(web.isAndroidBackupAvailable(),false);
 await assert.rejects(web.shareAndroidLearningBackup(json),/not available/);
 assert.equal(web.writes.length,0);
 const ios=setup('ios');
 await assert.rejects(ios.shareAndroidLearningBackup(json),/not available/);
 const broken=setup();
 await assert.rejects(broken.shareAndroidLearningBackup('{}'),/Unexpected Frame One backup format/);
 assert.equal(broken.writes.length,0);
 const mismatch=setup('android',true);
 await assert.rejects(mismatch.shareAndroidLearningBackup(json),/could not verify/);
 assert.equal(mismatch.shares.length,0,'Do not share corrupt data');
 const huge=setup();
 await assert.rejects(huge.shareAndroidLearningBackup(json+' '.repeat(2_000_000)),/too large/);
 assert.equal(huge.writes.length,0);
 console.log('PASS: Android-only verified private backup file, original v1 JSON, external share URI and safe failure boundaries.');
})().catch(e=>{console.error(e);process.exitCode=1});
