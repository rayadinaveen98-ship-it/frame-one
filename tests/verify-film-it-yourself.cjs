/* Practical beginner filmmaking exercise contract — 4 real phone-only plans. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),
  ts=require('typescript'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const dataPath='src/data/film-it-yourself.ts',viewPath='src/components/FilmItYourself.tsx',
  homePath='src/components/CinemaLibraryHome.tsx',cssPath='src/components/film-it-yourself.css';
for(const file of [dataPath,viewPath,homePath]){
  const node=ts.createSourceFile(file,read(file),ts.ScriptTarget.Latest,true,
    file.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
  assert.equal(node.parseDiagnostics.length,0,'Invalid source: '+file);
}
const moduleObj={exports:{}};
vm.runInNewContext(ts.transpileModule(read(dataPath),{compilerOptions:{
  module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022
}}).outputText,{module:moduleObj,exports:moduleObj.exports});
const {practiceMissions,practiceById}=moduleObj.exports;
const curriculum=JSON.parse(read('src/data/curriculum.v08b.json'));
const lessonIds=new Set(curriculum.lessons.map(lesson=>lesson.id));
assert.equal(practiceMissions.length,4,'Exactly four real practice plans');
assert.equal(new Set(practiceMissions.map(item=>item.id)).size,4,'Every exercise is distinct');
for(const item of practiceMissions){
  assert(item.title.length>=10&&item.tagline.length>=20,'Meaningful mission title and goal');
  assert(item.steps.length===3,'Three achievable stages');
  assert(lessonIds.has(item.lessonId),'Related lesson must exist: '+item.lessonId);
  assert(['frame','sound','light','cut','story','colour','continuity'].includes(item.lab),
    'Related creative lab must exist: '+item.lab);
  assert(practiceById(item.id)===item);
  assert(item.observation.length>=45,'Reflection must explain what a beginner should notice');
  const labels=new Set();
  for(const step of item.steps){
    assert(step.title&&step.instruction.length>=65&&step.purpose.length>=25,
      'Shooting directions and craft purpose must be usable');
    assert(!labels.has(step.title),'Each stage is distinct');labels.add(step.title);
  }
}
const source=read(viewPath),home=read(homePath),styles=read(css),qa=read('scripts/browser-smoke.cjs');
assert(home.includes("import {FilmItYourself} from './FilmItYourself'"));
assert(home.includes('<FilmItYourself/>'),'Home mounts practice once');
assert(source.includes('aria-expanded={expanded}')&&source.includes('aria-controls="practice-studio-workspace"'));
assert(source.includes("useState(false)")&&source.includes('setTried([false,false,false])'));
assert(source.includes("aria-pressed={tried[index]}"),'Checkmarks are announced to assistive tech');
assert(source.includes('mission.steps.map'),'All three shots render actual instructions');
assert(source.includes("openLab(mission.lab)"),'Studio uses real React creative labs');
assert(source.includes("navigate('lesson',mission.lessonId)"),'Studio uses existing lesson route');
assert(source.includes('Session only, not saved'),'No fake durable progress claim');
assert(source.includes('does not record or upload video'),'Does not promise camera/hosting features');
assert(!source.includes('localStorage')&&!source.includes('fetch(')&&!source.includes('getUserMedia'),
  'No competing persistence, upload, or hidden camera access');
assert(styles.includes('@media(max-width:350px)')&&styles.includes('@media(max-width:450px)'),
  '320px and small mobile layout included');
assert(styles.includes('prefers-reduced-motion'));
assert(qa.includes('data-film-it-yourself'),'Real-browser smoke must exercise practice');
console.log('PASS: four complete beginner filmmaking missions, real lesson/lab routes, session-only access and 320px layout.');
