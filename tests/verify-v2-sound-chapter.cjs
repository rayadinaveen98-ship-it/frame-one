/* Real Chapter 4 acceptance: canonical sources, meaningful interactions,
 * existing backup owner and isolation of the approved Option B prototype.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const curriculum=JSON.parse(read('src/data/curriculum.v08b.json'));
const data=read('src/data/sound-edit-guided.ts');
const studio=read('src/components/OptionBSoundEditExperiment.tsx');
const mission=read('src/components/OptionBFoundationMission.tsx');
const screens=read('src/components/OptionBReactScreens.tsx');
const runtime=read('src/legacy/runtime.js');
const browser=read('scripts/browser-smoke.cjs');
const css=read('src/components/option-b-react-design.css');
const ids=['sound','editing','ambience','music','continuity','rhythm'];
assert.equal(curriculum.lessons.length,33);
assert.equal(curriculum.chapters.length,6);
assert.deepEqual(curriculum.chapters[3].ids,ids,'Chapter 4 must use canonical IDs');
for(const id of ids){
 const l=curriculum.lessons.find(x=>x.id===id);
 assert(l,'Original lesson missing '+id);
 assert.equal(l.opts.length,3);
 assert(l.answer>=0&&l.answer<3);
 assert(data.includes(' '+id+':{'),'Each real sound lesson needs an authored creative story '+id);
 assert(studio.includes("'"+id+"'"),'Original visual experiment missing '+id);
}
assert(data.includes('SOUND_EDIT_IDS=chapter.ids')&&
 data.includes('return {id,legacyId:lesson.id,chapterId:3,lesson,...entry}'),
 'Guide must use the original curriculum, not invent separate lesson IDs');
assert(data.includes('const byId=new Map'),
 'Canonical question, correct answer and teaching text must remain single-source');
assert(mission.includes('soundEditingById(lessonId)')&&
 mission.includes('<OptionBSoundEditExperiment lessonId={lessonId} selected={explore}/>'),
 'Guided four-stage lesson must include the six original conceptual experiments');
assert(mission.includes('lesson.q')&&mission.includes('lesson.answer')&&
 mission.includes('if(step===2&&!correct)return')&&mission.includes('if(!correct)'),
 'A real completion requires a correct canonical quiz');
assert(screens.includes('data-v2-sound-open')&&screens.includes('data-v2-sound-node')&&
 screens.includes('<SoundEditingJourney completed={realFinished}'),
 'Chapter 4 accessible by visual journey and has own 6 real mission nodes');
assert(screens.includes('safeProgress([...FOUNDATION_IDS,...STORYTELLING_IDS,...VISUAL_IDS,...SOUND_EDIT_IDS,...PEOPLE_IDS,...FIRST_FILM_IDS])'),
 'Chapters 1–4 must read original completed IDs together');
const allowed="if(!['why','history','units','genres','india','story','script','acting','character','dialogue','showdonttell','shot','camera','lighting','composition','movement','lenses','colour','sound','editing','ambience','music','continuity','rhythm','crew','craft24','teams','pipeline','making','shotlist','shootscene','editminute','review'].includes(id))return false;";
assert(runtime.includes(allowed),'Only canonical guided lesson IDs can be completed');
assert(runtime.includes('finished.add(id);persist()')&&runtime.includes('savePractice:(id,note)=>'),
 'Completion and notes must update the original backup-aware legacy engine');
assert(studio.includes('SceneSequence')&&studio.includes('SoundLayers')&&
 studio.includes('MusicSource')&&studio.includes('ContinuityFrames')&&
 studio.includes('RhythmBars'),'Chapter 4 needs distinct diagram experiences, not six identical cards');
assert(studio.includes('NO RECORDED AUDIO')&&
 !studio.includes('new Audio(')&&!studio.includes('AudioContext'),
 'Never suggest playing audio while providing only graphics');
assert(!data.includes('localStorage.setItem(')&&!studio.includes('localStorage.setItem('),
 'Do not add parallel user-progress or notes storage');
assert(screens.includes('data-v2-real-course')&&css.includes('.site[data-v2-real-course="true"] .wordmark'),
 'Only real course gains the narrow-screen brand alignment fix');
assert(css.includes('.sound-experiment')&&css.includes('.sound-shot-sequence'),
 'Use scoped approved design-system styles');
assert(browser.includes('verifyRealChapterFour'),
 'Desktop and phone acceptance must exercise real Chapter 4 routes');
console.log('PASS: original 24 guided lessons, six sound/edit experiments, canonical quiz, real backup and visual isolation.');
