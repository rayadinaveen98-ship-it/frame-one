/* Browser end-to-end acceptance for Chapter 5 real film people and crafts.
 * Uses isolated context, canonical quizzes and original progress/backup.
 */
const assert=require('node:assert/strict');
const {screenshotPhone}=require('./option-b-pixel-parity.cjs');
const curriculum=require('../src/data/curriculum.v08b.json');
const ids=curriculum.chapters[4].ids;
async function verifyRealChapterFive(page,reference,shots,label){
 const native=page.locator('[data-v2-native-react]');
 const keys=['frameone-progress-v01','frameone-practice-v07','frameone-scene-v07'];
 const before=await page.evaluate(list=>Object.fromEntries(list.map(k=>[k,localStorage.getItem(k)])),keys);
 const completedBefore=JSON.parse(before['frameone-progress-v01']||'[]');
 const demoBefore=await page.evaluate(()=>localStorage.getItem('frameone-option-b-prototype-v1'));
 await page.locator('[data-option-b-compare="react"]').click();
 await native.locator('[data-v2-native-nav="home"]').click();
 await native.locator('[data-v2-open-foundations]').click();
 await native.locator('[data-v2-story-open]').click();
 await native.locator('[data-v2-visual-open]').click();
 await native.locator('[data-v2-sound-open]').click();
 await native.locator('[data-v2-people-open]').click();
 const journey=native.locator('[data-v2-people-screen="journey"]');
 await journey.waitFor();
 assert.equal(await journey.locator('[data-v2-people-node]').count(),4);
 await screenshotPhone(native.locator('.phone'),'real-people-journey-'+label+'.png',shots);
 const chosen=label==='desktop'?ids:['crew','teams'];
 for(const id of chosen){
   const lesson=curriculum.lessons.find(item=>item.id===id);
   assert(lesson,'Missing original collaboration lesson '+id);
   await journey.locator('[data-v2-people-node="'+id+'"]').click();
   const mission=native.locator('[data-v2-foundation-screen="mission"]');
   await mission.waitFor();
   assert.equal(await mission.getAttribute('data-v2-foundation-id'),id);
   assert.match(await mission.locator('.eyebrow').first().textContent(),/REAL CHAPTER 05/);
   assert.equal(await mission.locator('.mission-meta h2').textContent(),lesson.title);
   await screenshotPhone(native.locator('.phone'),'real-people-observe-'+id+'-'+label+'.png',shots);
   await mission.locator('.foundation-deep-dive summary').click();
   assert.equal(await mission.locator('.foundation-deep-dive section').count(),lesson.sections.length);
   await mission.locator('.foundation-deep-dive summary').click();
   await mission.locator('[data-v2-foundation-next]').click();
   assert.equal(await mission.locator('[data-v2-foundation-next]').isDisabled(),true);
   await mission.locator('[data-v2-foundation-choice="1"]').click();
   await mission.locator('[data-v2-foundation-next]').click();
   assert.equal(await mission.getAttribute('data-v2-foundation-step'),'2');
   const art=mission.locator('[data-v2-people-experiment="'+id+'"]');
   assert.equal(await art.count(),1);
   for(let index=0;index<3;index++){
     await mission.locator('[data-v2-foundation-explore="'+index+'"]').click();
     assert.equal(await art.getAttribute('data-v2-people-selection'),String(index));
     if(['crew','craft24'].includes(id))
       assert.equal(await art.locator('.people-team-group').count(),3);
     if(id==='teams')assert.equal(await art.locator('.people-scene-decision').count(),3);
     if(id==='pipeline')assert.equal(await art.locator('.people-process-step').count(),5);
   }
   assert.equal(await mission.locator('.foundation-knowledge-check h3').textContent(),lesson.q);
   await screenshotPhone(native.locator('.phone'),'real-people-study-'+id+'-'+label+'.png',shots);
   assert.equal(await mission.locator('[data-v2-foundation-next]').isDisabled(),true);
   await mission.locator('[data-v2-foundation-quiz="'+(lesson.answer===0?1:0)+'"]').click();
   assert.equal(await mission.locator('[data-v2-foundation-next]').isDisabled(),true,
     'Wrong factual answer must never complete a lesson');
   await mission.locator('[data-v2-foundation-quiz="'+lesson.answer+'"]').click();
   await mission.locator('[data-v2-foundation-next]').click();
   assert.equal(await mission.getAttribute('data-v2-foundation-step'),'3');
   if(id==='crew'){
     await mission.locator('[data-v2-foundation-note]').fill('The camera, art and sound teams must collaborate on this dinner table.');
     await mission.locator('[data-v2-foundation-save-note]').click();
     assert.match(await mission.locator('.foundation-save-status').textContent(),
       /existing Frame One practice notes and backup/);
   }
   await mission.locator('[data-v2-foundation-next]').click();
   await native.locator('[data-v2-foundation-complete]').waitFor();
   const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('frameone-progress-v01')||'[]'));
   assert(stored.includes(id),'Real Chapter 5 completion missing '+id);
   for(const old of completedBefore)assert(stored.includes(old),'Original progress lost '+old);
   await native.locator('[data-v2-foundation-complete] button.btn-primary').click();
   await journey.waitFor();
   assert.match(await journey.locator('[data-v2-people-node="'+id+'"]').getAttribute('aria-label'),/completed/);
 }
 const backup=await page.evaluate(()=>JSON.parse(window.frameOneLegacy.getBackupJSON()));
 assert.equal(backup.format,'frameone-learning-backup');
 assert.equal(backup.version,1);
 for(const id of chosen)assert(backup.completed.includes(id),'Missing crew lesson backup '+id);
 for(const old of completedBefore)assert(backup.completed.includes(old),'Lost earlier lesson in backup '+old);
 assert.equal(backup.notes.crew,'The camera, art and sound teams must collaborate on this dinner table.');
 const after=await page.evaluate(list=>Object.fromEntries(list.map(k=>[k,localStorage.getItem(k)])),keys);
 assert.equal(after['frameone-scene-v07'],before['frameone-scene-v07'],
   'A collaboration exercise must not change any original storyboard');
 assert.equal(await page.evaluate(()=>localStorage.getItem('frameone-option-b-prototype-v1')),
   demoBefore,'Real Chapter 5 may not award separate demo points');
 assert.equal(await page.evaluate(()=>window.frameOneLegacy.completeGuidedFoundation('unknown-crew')),false);
 await native.locator('[data-v2-people-back]').click();
 await native.locator('[data-v2-sound-screen="journey"]').waitFor();
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
 return {validated:chosen.length,priorCompletionsPreserved:completedBefore.length};
}
module.exports={verifyRealChapterFive};
