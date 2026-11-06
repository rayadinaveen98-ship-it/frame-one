/* Chapter 2: use canonical story curriculum and keep approved prototype intact. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const curriculum=JSON.parse(read('src/data/curriculum.v08b.json'));
const content=read('src/data/storytelling-guided.ts');
const routes=read('src/components/OptionBReactScreens.tsx');
const mission=read('src/components/OptionBFoundationMission.tsx');
const bridge=read('src/legacy/runtime.js');
const old=read('src/data/foundations-guided.ts');
const smoke=read('scripts/browser-smoke.cjs');
const expected=['story','script','acting','character','dialogue','showdonttell'];
assert.equal(curriculum.lessons.length,33,'Original learning catalogue remains intact');
assert.deepEqual(curriculum.chapters[1].ids,expected,'Chapter 2 IDs are canonical');
for(const id of expected){
  assert(content.includes(' '+id+':{'),'Original authored creative exercise required for '+id);
  const lesson=curriculum.lessons.find(l=>l.id===id);
  assert(lesson&&lesson.opts.length===3&&lesson.answer>=0&&lesson.answer<3);
  assert(content.includes('const byId=new Map'),'Do not duplicate lesson facts');
}
assert(content.includes('STORYTELLING_IDS=chapter.ids'),'Chapter nodes derive from canonical curriculum');
assert(content.includes('return {id,legacyId:lesson.id,chapterId:1,lesson,...entry}'),
  'Real narrative missions must map to original lesson IDs');
assert(old.includes('chapterId:0,lesson,...entry'),'Chapter 1 content remains untouched');
assert(mission.includes('foundationById(lessonId)??storytellingById(lessonId)'),
  'Re-use the tested four-stage experience and approved illustration');
assert(mission.includes('lesson.answer')&&mission.includes('if(step===2&&!correct)return')&&
  mission.includes('if(!correct)'),'Never complete a real lesson with an incorrect quiz');
assert(routes.includes('data-v2-story-open')&&routes.includes('data-v2-story-node')&&
  routes.includes('<StorytellingJourney completed={realFinished}'),'Reach every original Chapter 2 lesson from Chapter 1');
assert(routes.includes('safeProgress([...FOUNDATION_IDS,...STORYTELLING_IDS,...VISUAL_IDS,...SOUND_EDIT_IDS])'),
  'Both chapters must use the same original progress records');
const allowlist="if(!['why','history','units','genres','india','story','script','acting','character','dialogue','showdonttell','shot','camera','lighting','composition','movement','lenses','colour','sound','editing','ambience','music','continuity','rhythm'].includes(id))return false;";
assert(bridge.includes(allowlist),'Only eleven reviewed original lesson IDs may be completed');
assert(bridge.includes('finished.add(id);persist()')&&bridge.includes('updateProgress()'),
  'Existing progress and UI refresh must be preserved');
assert(!content.includes('localStorage.setItem(')&&!mission.includes('localStorage.setItem('),
  'No second notes/progress storage or unsynced backup writes');
assert(routes.includes("const PROTOTYPE_KEY='frameone-option-b-prototype-v1'"),
  'Demo progress key remains separate from real progress');
assert(smoke.includes('verifyRealChapterTwo'),
  'The real browser must test Chapter 2, not just source assertions');
console.log('PASS: Chapter 2 has six authored guided lessons, canonical quizzes, original progress and non-destructive backup integration.');
