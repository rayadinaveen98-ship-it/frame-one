/* End-to-end browser acceptance for Frame One's real six-lesson Storytelling chapter.
 * Runs only in the Chapter 1 isolated testing context, never in user storage.
 */
const assert=require('node:assert/strict');
const {screenshotPhone}=require('./option-b-pixel-parity.cjs');
const curriculum=require('../src/data/curriculum.v08b.json');
const ids=curriculum.chapters[1].ids;

async function verifyRealChapterTwo(page,reference,shots,label){
 const native=page.locator('[data-v2-native-react]');
 const keys=['frameone-progress-v01','frameone-practice-v07','frameone-scene-v07'];
 const before=await page.evaluate(ks=>Object.fromEntries(ks.map(k=>[k,localStorage.getItem(k)])),keys);
 const oldDone=JSON.parse(before['frameone-progress-v01']||'[]');
 const prototypeBefore=await page.evaluate(()=>localStorage.getItem('frameone-option-b-prototype-v1'));
 await page.locator('[data-option-b-compare="react"]').click();
 await native.locator('[data-v2-native-nav="home"]').click();
 await native.locator('[data-v2-open-foundations]').click();
 await native.locator('[data-v2-foundation-screen="journey"]').waitFor();
 await native.locator('[data-v2-story-open]').click();
 const journey=native.locator('[data-v2-story-screen="journey"]');
 await journey.waitFor();
 assert.equal(await journey.locator('[data-v2-story-node]').count(),6);
 await screenshotPhone(native.locator('.phone'),'real-storytelling-journey-'+label+'.png',shots);
 const runIds=label==='desktop'?ids:['story','showdonttell'];
 for(const id of runIds){
   const lesson=curriculum.lessons.find(l=>l.id===id);
   assert(lesson,'Real Chapter 2 lesson missing '+id);
   await journey.locator('[data-v2-story-node="'+id+'"]').click();
   const mission=native.locator('[data-v2-foundation-screen="mission"]');
   await mission.waitFor();
   assert.equal(await mission.getAttribute('data-v2-foundation-id'),id);
   assert.equal(await mission.locator('.mission-meta h2').textContent(),lesson.title);
   assert.match(await mission.locator('.eyebrow').first().textContent(),/REAL CHAPTER 02/);
   await screenshotPhone(native.locator('.phone'),'real-story-observe-'+id+'-'+label+'.png',shots);
   await mission.locator('.foundation-deep-dive summary').click();
   assert.equal(await mission.locator('.foundation-deep-dive section').count(),lesson.sections.length);
   await mission.locator('.foundation-deep-dive summary').click();
   await mission.locator('[data-v2-foundation-next]').click();
   assert.equal(await mission.locator('[data-v2-foundation-next]').isDisabled(),true);
   await mission.locator('[data-v2-foundation-choice="1"]').click();
   await mission.locator('[data-v2-foundation-next]').click();
   await mission.locator('[data-v2-foundation-explore="2"]').click();
   assert.equal(await mission.locator('.foundation-knowledge-check h3').textContent(),lesson.q);
   assert.equal(await mission.locator('[data-v2-foundation-next]').isDisabled(),true);
   const wrong=lesson.answer===0?1:0;
   await mission.locator('[data-v2-foundation-quiz="'+wrong+'"]').click();
   assert.equal(await mission.locator('[data-v2-foundation-quiz-status]').getAttribute('data-v2-foundation-quiz-status'),'retry');
   assert.equal(await mission.locator('[data-v2-foundation-next]').isDisabled(),true);
   await mission.locator('[data-v2-foundation-quiz="'+lesson.answer+'"]').click();
   await mission.locator('[data-v2-foundation-next]').click();
   assert.equal(await mission.getAttribute('data-v2-foundation-step'),'3');
   if(id==='story'){
     await mission.locator('[data-v2-foundation-note]').fill('The letter matters because the character wants to repair a friendship.');
     await mission.locator('[data-v2-foundation-save-note]').click();
     assert.match(await mission.locator('.foundation-save-status').textContent(),/existing Frame One practice notes and backup/);
   }
   await mission.locator('[data-v2-foundation-next]').click();
   await native.locator('[data-v2-foundation-complete]').waitFor();
   const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('frameone-progress-v01')||'[]'));
   assert(stored.includes(id),'Original progress record missing Storytelling lesson '+id);
   for(const existing of oldDone)assert(stored.includes(existing),'Chapter 2 must preserve Chapter 1 completion '+existing);
   await native.locator('[data-v2-foundation-complete] button.btn-primary').click();
   await journey.waitFor();
   assert.match(await journey.locator('[data-v2-story-node="'+id+'"]').getAttribute('aria-label'),/completed/);
 }
 const backup=await page.evaluate(()=>JSON.parse(window.frameOneLegacy.getBackupJSON()));
 assert.equal(backup.version,1,'Keep original portable backup version');
 for(const id of runIds)assert(backup.completed.includes(id),'New story completion missing from backup '+id);
 for(const id of oldDone)assert(backup.completed.includes(id),'Old completion missing from backup '+id);
 assert.equal(backup.notes.story,'The letter matters because the character wants to repair a friendship.');
 const after=await page.evaluate(ks=>Object.fromEntries(ks.map(k=>[k,localStorage.getItem(k)])),keys);
 assert.equal(after['frameone-scene-v07'],before['frameone-scene-v07'],'Story lessons cannot alter existing storyboard');
 assert.equal(await page.evaluate(()=>localStorage.getItem('frameone-option-b-prototype-v1')),prototypeBefore,
   'Real guided lessons cannot earn prototype points');
 assert.equal(await page.evaluate(()=>window.frameOneLegacy.completeGuidedFoundation('invented-story-id')),false);
 await native.locator('[data-v2-story-back]').click();
 await native.locator('[data-v2-foundation-screen="journey"]').waitFor();
 await native.locator('[data-v2-foundation-back]').click();
 await native.locator('[data-v2-native-screen="home"]').waitFor();
 await page.locator('[data-option-b-compare="approved"]').click();
 await reference.locator('.home-hero').waitFor();
 return {validatedLessons:runIds.length,oldCompletionsPreserved:oldDone.length};
}
module.exports={verifyRealChapterTwo};
