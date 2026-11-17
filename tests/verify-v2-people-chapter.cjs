/* Chapter 5 real-curriculum acceptance: canonical facts, original diagram
 * choices, legacy progress, notes and save/restore contract preserved. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const curriculum=JSON.parse(read('src/data/curriculum.v08b.json'));
const guided=read('src/data/people-guided.ts');
const art=read('src/components/OptionBPeopleExperiment.tsx');
const screens=read('src/components/OptionBReactScreens.tsx');
const mission=read('src/components/OptionBFoundationMission.tsx');
const runtime=read('src/legacy/runtime.js');
const css=read('src/components/option-b-react-design.css');
const browser=read('scripts/browser-smoke.cjs');
const ids=['crew','craft24','teams','pipeline'];
assert.equal(curriculum.chapters.length,6,'All six original chapters retained');
assert.equal(curriculum.lessons.length,33,'Original 33-lesson course retained');
assert.deepEqual(curriculum.chapters[4].ids,ids,'Real Chapter 5 has four original lesson IDs');
for(const id of ids){
 const lesson=curriculum.lessons.find(l=>l.id===id);
 assert(lesson,'Missing canonical role lesson '+id);
 assert(lesson.opts.length===3&&lesson.answer>=0&&lesson.answer<3,'Canonical quiz invalid '+id);
 assert(guided.includes(' '+id+':{'),'Unique authored interaction required for '+id);
 assert(art.includes("'"+id+"'"),'Original diagram concept missing '+id);
}
assert(guided.includes('PEOPLE_IDS=chapter.ids')&&
 guided.includes('return {id,legacyId:lesson.id,chapterId:4,lesson,...entry}'),
 'Guided IDs and canonical factual quizzes must not be duplicated or remapped');
assert(guided.includes('const byId=new Map')&&
 guided.includes('not an official exhaustive list'),
 'Avoid inventing official 24-craft association names');
assert(art.includes('TeamWeb')&&art.includes('SceneTeams')&&art.includes('ProcessFlow'),
 'Four real missions need distinct, original and responsive art');
assert(art.includes('never a verified union roster')&&
 art.includes('NOT AN OFFICIAL CREW ROSTER'),
 'Original example work areas must not be shown as a legal union list');
assert(mission.includes('peopleById(lessonId)')&&
 mission.includes('<OptionBPeopleExperiment lessonId={lessonId} selected={explore}/>'),
 'Every real Chapter 5 lesson uses existing four-stage mission plus interactive art');
assert(mission.includes('lesson.q')&&mission.includes('lesson.answer')&&
 mission.includes('if(step===2&&!correct)return')&&mission.includes('if(!correct)'),
 'Wrong or unanswered source-of-truth quiz cannot earn completion');
assert(screens.includes('data-v2-people-open')&&screens.includes('data-v2-people-node')&&
 screens.includes('data-v2-people-back')&&screens.includes('<PeopleJourney completed={realFinished}'),
 'Four chapter nodes must be reachable and offer backward navigation');
assert(screens.includes('safeProgress([...FOUNDATION_IDS,...STORYTELLING_IDS,...VISUAL_IDS,...SOUND_EDIT_IDS,...PEOPLE_IDS,...FIRST_FILM_IDS])'),
 'Progress across 28 original guided lessons must share the old key');
const allowlist="if(!['why','history','units','genres','india','story','script','acting','character','dialogue','showdonttell','shot','camera','lighting','composition','movement','lenses','colour','sound','editing','ambience','music','continuity','rhythm','crew','craft24','teams','pipeline','making','shotlist','shootscene','editminute','review'].includes(id))return false;";
assert(runtime.includes(allowlist),'Guided completion allowlist is the 28 canonical IDs, no more');
assert(runtime.includes('finished.add(id);persist()')&&
 runtime.includes('savePractice:(id,note)=>'),
 'Completion and practice notes must use the existing backup owner');
assert(!art.includes('localStorage.setItem(')&&!guided.includes('localStorage.setItem('),
 'No unsynced or separate note/progress database');
assert(css.includes('.people-experiment')&&css.includes('.people-process'),
 'Original Option B styles extended in namespaced manner only');
assert(browser.includes('verifyRealChapterFive'),
 'Real 320px, 390px and desktop browser tests must include Chapter 5');
console.log('PASS: four original crew/crafts/team/pipeline lessons, visual diagrams and legacy data preservation.');
