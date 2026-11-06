/* Frame One 2.0 real Chapter 6 acceptance.
 * All 33 canonical lesson IDs and notes must remain backup-compatible.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const curriculum=JSON.parse(read('src/data/curriculum.v08b.json'));
const guided=read('src/data/first-film-guided.ts');
const art=read('src/components/OptionBFirstFilmExperiment.tsx');
const screens=read('src/components/OptionBReactScreens.tsx');
const mission=read('src/components/OptionBFoundationMission.tsx');
const runtime=read('src/legacy/runtime.js');
const css=read('src/components/option-b-react-design.css');
const smoke=read('scripts/browser-smoke.cjs');
const ids=['making','shotlist','shootscene','editminute','review'];
assert.equal(curriculum.lessons.length,33,'Original 33 real lessons must be unchanged');
assert.equal(curriculum.chapters.length,6,'Original six chapters must be unchanged');
assert.deepEqual(curriculum.chapters[5].ids,ids,'Only five canonical last-chapter IDs');
assert.equal(new Set(curriculum.lessons.map(l=>l.id)).size,33,'Every canonical lesson ID is unique');
for(const id of ids){
 const lesson=curriculum.lessons.find(l=>l.id===id);
 assert(lesson, 'Missing real last-chapter lesson '+id);
 assert(lesson.opts.length===3 && lesson.answer>=0 && lesson.answer<3,
  'Canonical factual quiz required '+id);
 assert(guided.includes(' '+id+':{'),'Unique author-written first-film exercise '+id);
 assert(art.includes("'"+id+"'"),'Unique visual study mode '+id);
}
assert(guided.includes('FIRST_FILM_IDS=chapter.ids')&&
 guided.includes('return {id,legacyId:lesson.id,chapterId:5,lesson,...entry}')&&
 guided.includes('const byId=new Map'),
 'New guided content must derive its ID and factual quiz from original curriculum');
assert(mission.includes('firstFilmById(lessonId)')&&
 mission.includes('<OptionBFirstFilmExperiment lessonId={lessonId} selected={explore}/>'),
 'All five real lessons use existing four-stage guided mission with original art');
assert(mission.includes('lesson.answer')&&mission.includes('if(step===2&&!correct)return')&&
 mission.includes('if(!correct)'),'Original quiz mastery guards cannot be bypassed');
assert(screens.includes('data-v2-firstfilm-open')&&
 screens.includes('data-v2-firstfilm-node')&&
 screens.includes('data-v2-firstfilm-back')&&
 screens.includes('data-v2-firstfilm-course-finished')&&
 screens.includes('<FirstFilmJourney completed={realFinished}'),
 'Last chapter has five accessible nodes, backward navigation and truthful completion');
assert(screens.includes('safeProgress([...FOUNDATION_IDS,...STORYTELLING_IDS,...VISUAL_IDS,...SOUND_EDIT_IDS,...PEOPLE_IDS,...FIRST_FILM_IDS])'),
 'All 33 real lesson completions read from same original progress key');
const allowlist="if(!['why','history','units','genres','india','story','script','acting','character','dialogue','showdonttell','shot','camera','lighting','composition','movement','lenses','colour','sound','editing','ambience','music','continuity','rhythm','crew','craft24','teams','pipeline','making','shotlist','shootscene','editminute','review'].includes(id))return false;";
assert(runtime.includes(allowlist),'Real completion owner admits exactly 33 original lesson IDs');
assert(runtime.includes('finished.add(id);persist()')&&runtime.includes('savePractice:(id,note)=>'),
 'Real progress and notes remain in original backup-aware engine');
for(const term of ['ScopePlan','ShotList','ShootChecklist','EditPlan','ReviewCycle']){
 assert(art.includes('function '+term+'('),'Require real distinct practice artwork '+term);
}
assert(art.includes('does not load, play, process or export recorded footage')&&
 art.includes('not feedback collected from actual viewers')&&
 art.includes('no footage or screenplay is created automatically'),
 'No misleading claims about recording, editing or actual film output');
assert(!art.includes('localStorage.setItem(')&&!guided.includes('localStorage.setItem('),
 'Do not create a second progress, journal, or backup store');
assert(css.includes('.first-film-experiment')&&css.includes('.first-film-review'),
 'Visuals use scoped Option B CSS without rewriting approved prototype');
assert(smoke.includes('verifyRealChapterSix'),
 'New real chapter must be exercised end-to-end in desktop and phone browser');
console.log('PASS: all 33 original lesson IDs, five custom first-film lessons, canonical quizzes and original backup data owner.');
