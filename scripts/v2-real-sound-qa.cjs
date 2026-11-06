/* Browser integration: six real Chapter 4 Sound and Editing lessons.
 * Runs in a fresh browser context; never alters the user's stored curriculum.
 */
const assert=require('node:assert/strict');
const {screenshotPhone}=require('./option-b-pixel-parity.cjs');
const curriculum=require('../src/data/curriculum.v08b.json');
const ids=curriculum.chapters[3].ids;

async function verifyRealChapterFour(page,reference,shots,label){
 const native=page.locator('[data-v2-native-react]');
 const keys=['frameone-progress-v01','frameone-practice-v07','frameone-scene-v07'];
 const before=await page.evaluate(names=>Object.fromEntries(names.map(k=>[k,localStorage.getItem(k)])),keys);
 const doneBefore=JSON.parse(before['frameone-progress-v01']||'[]');
 const demoBefore=await page.evaluate(()=>localStorage.getItem('frameone-option-b-prototype-v1'));
 await page.locator('[data-option-b-compare="react"]').click();
 await native.locator('[data-v2-native-nav="home"]').click();
 await native.locator('[data-v2-open-foundations]').click();
 await native.locator('[data-v2-story-open]').click();
 await native.locator('[data-v2-visual-open]').click();
 await native.locator('[data-v2-sound-open]').click();
 const journey=native.locator('[data-v2-sound-screen="journey"]');
 await journey.waitFor();
 if(label==='320px'){
   const nowrap=await native.locator('.site .wordmark').evaluate(node=>getComputedStyle(node).whiteSpace);
   assert.equal(nowrap,'nowrap','Real course wordmark must stay on one line on a narrow phone');
 }
 assert.equal(await journey.locator('[data-v2-sound-node]').count(),6,
    'Real Chapter 4 must expose exactly the six original curriculum lessons');
 await screenshotPhone(native.locator('.phone'),'real-sound-journey-'+label+'.png',shots);
 const runIds=label==='desktop'?ids:['sound','editing','continuity'];
 for(const id of runIds){
   const lesson=curriculum.lessons.find(l=>l.id===id);
   assert(lesson,'Original sound/edit curriculum lesson missing '+id);
   await journey.locator('[data-v2-sound-node="'+id+'"]').click();
   const mission=native.locator('[data-v2-foundation-screen="mission"]');
   await mission.waitFor();
   assert.equal(await mission.getAttribute('data-v2-foundation-id'),id);
   assert.match(await mission.locator('.eyebrow').first().textContent(),/REAL CHAPTER 04/);
   assert.equal(await mission.locator('.mission-meta h2').textContent(),lesson.title);
   await screenshotPhone(native.locator('.phone'),'real-sound-observe-'+id+'-'+label+'.png',shots);
   await mission.locator('.foundation-deep-dive summary').click();
   assert.equal(await mission.locator('.foundation-deep-dive section').count(),lesson.sections.length);
   await mission.locator('.foundation-deep-dive summary').click();
   await mission.locator('[data-v2-foundation-next]').click();
   assert.equal(await mission.locator('[data-v2-foundation-next]').isDisabled(),true);
   await mission.locator('[data-v2-foundation-choice="1"]').click();
   await mission.locator('[data-v2-foundation-next]').click();
   assert.equal(await mission.getAttribute('data-v2-foundation-step'),'2');
   const viz=mission.locator('[data-v2-sound-experiment="'+id+'"]');
   assert.equal(await viz.count(),1);
   for(let k=0;k<3;k++){
     await mission.locator('[data-v2-foundation-explore="'+k+'"]').click();
     assert.equal(await viz.getAttribute('data-v2-sound-selection'),String(k),
       'Concept switch must visibly change the real study');
     if(id==='editing')assert.equal(await viz.locator('.sound-shot').count(),3,
       'Editing should show all three storyboard shots');
     if(id==='continuity')assert.equal(await viz.locator('.sound-continuity svg').count(),1);
     if(id==='rhythm')assert.equal(await viz.locator('.sound-rhythm-row').count(),3);
   }
   assert.equal(await mission.locator('.foundation-knowledge-check h3').textContent(),lesson.q);
   await screenshotPhone(native.locator('.phone'),'real-sound-study-'+id+'-'+label+'.png',shots);
   assert.equal(await mission.locator('[data-v2-foundation-next]').isDisabled(),true);
   await mission.locator('[data-v2-foundation-quiz="'+(lesson.answer===0?1:0)+'"]').click();
   assert.equal(await mission.locator('[data-v2-foundation-next]').isDisabled(),true,
     'Wrong quiz answer must never mark lesson complete');
   await mission.locator('[data-v2-foundation-quiz="'+lesson.answer+'"]').click();
   await mission.locator('[data-v2-foundation-next]').click();
   assert.equal(await mission.getAttribute('data-v2-foundation-step'),'3');
   if(id==='sound'){
     await mission.locator('[data-v2-foundation-note]').fill('My scene uses traffic ambience to suggest the busy street.');
     await mission.locator('[data-v2-foundation-save-note]').click();
     assert.match(await mission.locator('.foundation-save-status').textContent(),
       /existing Frame One practice notes and backup/);
   }
   await mission.locator('[data-v2-foundation-next]').click();
   await native.locator('[data-v2-foundation-complete]').waitFor();
   const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('frameone-progress-v01')||'[]'));
   assert(stored.includes(id),'Real Chapter 4 completion missing '+id);
   for(const prev of doneBefore)assert(stored.includes(prev),
     'Chapter 4 must not overwrite earlier learning '+prev);
   await native.locator('[data-v2-foundation-complete] button.btn-primary').click();
   await journey.waitFor();
   assert.match(await journey.locator('[data-v2-sound-node="'+id+'"]').getAttribute('aria-label'),/completed/);
 }
 const backup=await page.evaluate(()=>JSON.parse(window.frameOneLegacy.getBackupJSON()));
 assert.equal(backup.format,'frameone-learning-backup');
 assert.equal(backup.version,1);
 for(const id of runIds)assert(backup.completed.includes(id),
   'New sound/edit completion must immediately appear in backup: '+id);
 for(const id of doneBefore)assert(backup.completed.includes(id),
   'Previously completed lesson missing after Chapter 4: '+id);
 assert.equal(backup.notes.sound,'My scene uses traffic ambience to suggest the busy street.');
 const after=await page.evaluate(names=>Object.fromEntries(names.map(k=>[k,localStorage.getItem(k)])),keys);
 assert.equal(after['frameone-scene-v07'],before['frameone-scene-v07'],
   'Sound/editing guided lessons must not modify storyboards');
 assert.equal(await page.evaluate(()=>localStorage.getItem('frameone-option-b-prototype-v1')),demoBefore,
   'Finishing real lesson cannot award imaginary prototype points');
 assert.equal(await page.evaluate(()=>window.frameOneLegacy.completeGuidedFoundation('fake-sound-id')),false);
 await native.locator('[data-v2-sound-back]').click();
 await native.locator('[data-v2-visual-screen="journey"]').waitFor();
 await native.locator('[data-v2-visual-back]').click();
 await native.locator('[data-v2-story-screen="journey"]').waitFor();
 await native.locator('[data-v2-story-back]').click();
 await native.locator('[data-v2-foundation-screen="journey"]').waitFor();
 await native.locator('[data-v2-foundation-back]').click();
 await native.locator('[data-v2-native-screen="home"]').waitFor();
 await page.locator('[data-option-b-compare="approved"]').click();
 await reference.locator('.home-hero').waitFor();
 return {validated:runIds.length,oldProgressPreserved:doneBefore.length};
}
module.exports={verifyRealChapterFour};
