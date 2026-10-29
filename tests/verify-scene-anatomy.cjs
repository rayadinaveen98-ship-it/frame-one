/* Frame One Scene Anatomy: editorial data, live React choices, and zero extra storage. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const dataPath='src/data/scene-anatomy.ts';
const componentPath='src/components/SceneAnatomy.tsx';
const homePath='src/components/CinemaLibraryHome.tsx';
const cssPath='src/components/scene-anatomy.css';
for(const p of [dataPath,componentPath,homePath]){
 const node=ts.createSourceFile(p,read(p),ts.ScriptTarget.Latest,true,p.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 assert.equal(node.parseDiagnostics.length,0,p+' must parse without syntax errors');
}
const moduleValue={exports:{}};
vm.runInNewContext(ts.transpileModule(read(dataPath),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module:moduleValue,exports:moduleValue.exports});
const studies=moduleValue.exports.sceneAnatomyStudies;
const curriculum=JSON.parse(read('src/data/curriculum.v08b.json'));
const lessonIds=new Set(curriculum.lessons.map(x=>x.id));
assert.equal(studies.length,5,'five original comparative filmmaking decisions');
assert.deepEqual(Array.from(studies,x=>x.id),['sound','light','edit','reaction','rhythm']);
for(const study of studies){
 assert(lessonIds.has(study.lesson),'each studio case points at a real lesson: '+study.id);
 assert(['sound','light','cut','frame'].includes(study.lab),'each studio case routes to a working lab');
 assert(study.tab&&study.title&&study.question&&study.observation&&study.sceneCue,'case has actual explanatory content');
 assert(study.choices.length===2,'each study has exactly two meaningful authored decisions');
 assert.deepEqual(Array.from(study.choices,x=>x.id),['a','b']);
 assert.notEqual(study.choices[0].direction,study.choices[1].direction,'choices must change the director\'s direction');
 assert.notEqual(study.choices[0].reading,study.choices[1].reading,'the comparison must explain what changes');
 for(const choice of study.choices)assert(choice.label&&choice.direction&&choice.reading&&choice.alt,'accessible and educational option');
}
const scene=read(componentPath),home=read(homePath),style=read(cssPath),browser=read('scripts/browser-smoke.cjs');
assert(home.includes("import {SceneAnatomy} from './SceneAnatomy'"));
assert(home.includes('<SceneAnatomy/>'));
assert(scene.includes('useState<AnatomyVariant>'),'choices are truly interactive, not inert copy');
assert(scene.includes('setSelected(index);setVariant(\'a\')'),'switching scene topic resets to meaningful baseline');
assert(scene.includes('setVariant(item.id)'),'two takes change the scene state');
assert(scene.includes('data-scene-choice={variant}')&&scene.includes('data-scene-study={study.id}'),'changing decision changes displayed CSS scene');
assert(scene.includes('aria-pressed={selected===index}')&&scene.includes('aria-pressed={variant===item.id}'),'keyboard/button state is accessible');
assert(scene.includes('role="img" aria-label={choice.alt}'),'illustration has an accessible description');
assert(scene.includes("onClick={()=>navigate('lesson',study.lesson)}"),'craft link goes to a real lesson');
assert(scene.includes("onClick={()=>openLab(study.lab)}"),'next action opens actual interactive lab');
assert(!scene.includes('localStorage')&&!scene.includes('fetch('),'no new saved keys or remote dependencies');
assert(!read(dataPath).includes('http://')&&!read(dataPath).includes('https://'),'all authored scene studies are offline');
assert(read(dataPath).includes('DESCRIBED, NOT PLAYED'),'the screenplay cue is not misrepresented as audible sound');
for(const marker of ['.scene-anatomy-stage','.scene-anatomy-choices','@media(max-width:760px)','@media(max-width:360px)','[data-scene-study=\'light\']','[data-scene-study=\'edit\']','[data-scene-study=\'reaction\']','[data-scene-study=\'rhythm\']'])
 assert(style.includes(marker),'responsive scene mode missing '+marker);
assert(browser.includes('data-anatomy-study'),'browser QA must press scene study controls');
assert(browser.includes('data-anatomy-option'),'browser QA must compare takes');
assert(scene.includes('scene-anatomy-rhythm-plan')&&scene.includes('scene-anatomy-eye'),'both new studies have actual illustrated visual changes');
assert(style.includes('scene-anatomy-rhythm-clip')&&style.includes('scene-anatomy-eye-left'),'both contrasts are authored, not just copy changes');
console.log('PASS: 5 original offline filmmaking studies, reaction close-up, honest edit-duration strip, accessible A/B choices and real labs.');
