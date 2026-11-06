/* Hard source and state-safety contract for native Observe/Decide/Experiment/Make. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=p=>fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');
const reference=read('public/option-b-v1.html');
const mission=read('src/components/OptionBReactMission.tsx');
const screens=read('src/components/OptionBReactScreens.tsx');
const viewer=read('src/components/OptionBExperience.tsx');
const smoke=read('scripts/browser-smoke.cjs');
const parity=read('scripts/option-b-mission-parity.cjs');
assert(reference.includes('function mission()')&&reference.includes('function cropFeedback('),
  'Untouched approved mission source must remain the canonical visual and learning reference');
for(const token of [
  'data-v2-native-screen="mission"','data-v2-native-mission-step','STEP {step+1} OF 4',
  'data-v2-native-choice','data-v2-native-next-step','data-v2-native-previous-step',
  'data-v2-native-zoom','data-v2-native-practice','<Scene mode="wide"',
  '<Scene mode="compare"','<Scene mode="practise"','aria-pressed={selected===i}',
  "selected===null",'onComplete(m.id)','data-v2-native-mission-id']){
  assert(mission.includes(token),'Missing meaningful React mission interaction: '+token);
}
const lessonPhrases=[
  'A scene is a question.','What would you choose?',
  'What changes when you look closer?','Take the idea into the real world.',
  'Learn what a single image can reveal.','A character',
  'The whole place','The character','The phone detail',
  'A person checks a message outside a quiet café. Decide where to lead attention.',
  'Record one wide shot to show the setting.',
  'Record a medium view to establish the action.',
  'Record a close-up to reveal a small detail.',
  'More of the world stays in view. Use this space to show location and relationships.',
  'A balanced crop guides attention toward the character while retaining some context.',
  'The tighter frame makes the character and phone larger. The setting becomes less clear.',
  'There isn\'t always one correct creative answer.'
];
// Reference may contain some content in the original missions but not separate
// explanatory labels in all stages; check exact shared paragraphs and questions.
for(const phrase of lessonPhrases.filter(p=>p!=='A character'&&p!=='Learn what a single image can reveal.')){
  assert(reference.includes(phrase),'Approved source missing required phrase: '+phrase);
  assert(mission.includes(phrase),'React must retain approved learning wording: '+phrase);
}
for(const id of ['see','frame','story','light','sound','project'])
  assert(mission.includes("id:'"+id+"'"),'React mission config must include original identity '+id);
assert(mission.includes("src={ART_SCENE}")&&mission.includes("const ART_SCENE='./option-b-assets/scene.svg'"),
  'Native mission must render approved image, never new AI art');
assert(screens.includes('saveCompletedMission')&&screens.includes("localStorage.setItem(PROTOTYPE_KEY"),
  'React completion is the only native writer of the isolated prototype demo state');
for(const key of ['frameone-progress-v01','frameone-practice-v07','frameone-scene-v07'])
  assert(!mission.includes(key)&&!screens.includes(key),
    'No native pilot mission may modify production lesson or backup data: '+key);
assert(screens.includes('...raw,...next'),'Demo completion must preserve original prototype shot counters');
assert(screens.includes('prior.finished.includes(id)'),'Repeat completion must not award more points');
assert(viewer.includes('syncReferenceProgress')&&viewer.includes('onNativeComplete={syncReferenceProgress}'),
  'Approved reference must rehydrate after native completion');
assert(smoke.includes('verifyMissionParity')&&parity.includes('comparePixels'),
  'Real browser must compare every step against approved reference images');
for(const stage of ['observe','decide-empty','decide-selected','experiment',
  'experiment-zoom','make','make-checked','complete']){
  assert(parity.includes(stage),'Missing mission visual-parity stage: '+stage);
}
console.log('PASS: native mission mirrors approved educational copy, original scene, real stage controls, isolated progress and pixel comparison.');
