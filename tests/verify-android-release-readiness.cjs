/* v0.15A9: read-only release report cannot accidentally grant APK approval. */
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const assert=require('node:assert/strict'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'frameone-release-status-'));
const tool=path.join(root,'scripts/android-release-readiness.py');
const workflow=fs.readFileSync(path.join(root,'.github/workflows/android-release-readiness.yml'),'utf8');
const sha='a'.repeat(40),cert='b'.repeat(64);
const run={id:12345678,name:'Frame One Android debug APK',head_sha:sha,
 head_branch:'main',event:'push',status:'completed',conclusion:'success',
 repository:{full_name:'rayadinaveen98-ship-it/frame-one'}};
const release={tag_name:'android-preview-latest',target_commitish:'c'.repeat(40)};
function receipt(persistent=false){
 return 'Signer #1 certificate SHA-256 digest: '+cert+'\n'
  +'Persistent QA signer: '+(persistent
    ?'YES (managed by GitHub Secret)'
    :'NO (temporary runner signer; not upgrade-safe)')
  +'\nAndroid versionCode: 123456\n';
}
function exercise(meta,rcpt,pub){
 fs.writeFileSync(path.join(tmp,'run.json'),JSON.stringify(meta));
 fs.writeFileSync(path.join(tmp,'receipt.txt'),rcpt);
 fs.writeFileSync(path.join(tmp,'public.json'),JSON.stringify(pub));
 const result=cp.spawnSync('python3',[tool,
   '--run-json',path.join(tmp,'run.json'),
   '--receipt',path.join(tmp,'receipt.txt'),
   '--public-release-json',path.join(tmp,'public.json'),
   '--output',path.join(tmp,'status.md')],{encoding:'utf8'});
 return {...result,markdown:result.status===0?fs.readFileSync(path.join(tmp,'status.md'),'utf8'):''};
}
try{
 let x=exercise(run,receipt(),release);
 assert.equal(x.status,0,'Temporary certificate receipt may be reported without publication');
 assert.match(x.markdown,/BLOCKED — temporary Android debug signer/);
 assert.match(x.markdown,/not configured for this build/);
 assert.match(x.markdown,/NOT PUBLIC-RELEASE APPROVED/);
 assert.match(x.markdown,/different source commit/);
 assert(!x.markdown.includes('Private key:'));
 x=exercise(run,receipt(true),release);
 assert.equal(x.status,0,'Genuine persistent signing receipt can be reported');
 assert.match(x.markdown,/CONFIRMED persistent QA certificate/);
 assert.match(x.markdown,/Independent cross-run upgrade proof/);
 assert.match(x.markdown,/NOT PUBLIC-RELEASE APPROVED/,'Persistent signing alone never grants public approval');
 x=exercise(run,receipt(true),{...release,target_commitish:sha});
 assert.equal(x.status,0);
 assert.match(x.markdown,/same source commit/);
 for(const [label,metadata,signing,publicRelease] of [
  ['untrusted PR run',{...run,event:'pull_request'},receipt(true),release],
  ['wrong branch',{...run,head_branch:'feature/test'},receipt(true),release],
  ['failed build',{...run,conclusion:'failure'},receipt(true),release],
  ['wrong repo',{...run,repository:{full_name:'anyone/another'}},receipt(true),release],
  ['missing signer',run,'Signer #1 certificate SHA-256 digest: '+cert+'\nAndroid versionCode: 123456\n',release],
  ['duplicate signer',run,receipt(true)+'Persistent QA signer: YES (managed by GitHub Secret)\n',release],
  ['bad version',run,receipt(true).replace('123456','999'),release],
  ['bad cert',run,receipt(true).replace(cert,'abc'),release],
  ['wrong public tag',run,receipt(true),{...release,tag_name:'not-preview'}]
 ]){
  const got=exercise(metadata,signing,publicRelease);
  assert.notEqual(got.status,0,'Must fail closed for '+label);
 }
 assert.match(workflow,/permissions:\s*\n  contents: read\s*\n  actions: read/,'Read-only permissions');
 assert.match(workflow,/head_repository.full_name == github.repository/,'Do not trust fork events');
 assert.match(workflow,/head_branch == 'main'/,'Only trusted main builds');
 assert.match(workflow,/actions\/upload-artifact@v4/,'Share only non-secret readiness report');
 assert(!workflow.includes('gh release upload')&&!workflow.includes('gh release create'),'Never publish an APK');
 assert(!workflow.includes('secrets.FRAMEONE_QA_DEBUG_KEYSTORE_B64'),'Never read private signing key');
 console.log('PASS: release-readiness signer parsing, public provenance, all failure cases, read-only workflow and no automatic approvals.');
}finally{fs.rmSync(tmp,{recursive:true,force:true});}
