/* Real Chapter 6 browser acceptance: five canonical filmmaking lessons.
 * Runs in an isolated Playwright storage context, never on someone's device.
 */
const assert=require('node:assert/strict');
const {screenshotPhone}=require('./option-b-pixel-parity.cjs');
const curriculum=require('../src/data/curriculum.v08b.json');
const ids=curriculum.chapters[5].ids;
async function verifyRealChapterSix(page,reference,shots,label){
 const native=page.locator('[data-v2-native-react]');
 const keys=['frameone-progress-v01','frameone-practice-v07','frameone-scene-v07'];
 const original=await page.evaluate(all=>Object.fromEntries(all.map(k=>[k,localStorage.getItem(k)])),keys);
 const before=JSON.parse(original['frameone-progress-v01']||'[]');
 const demo=await page.evaluate(()=>localStorage.getItem('frameone-option-b-prototype-v1'));
 await page.locator('[data-option-b-compare="react"]').click();
 await native.locator('[data-v2-native-nav="home"]').click();
 await native.locator('[data-v2-open-foundations]').click();
 await native.locator('[data-v2-story-open]').click();
 await native.locator('[data-v2-visual-open]').click();
 await native.locator('[data-v2-sound-open]').click();
 await native.locator('[data-v2-people-open]').click();
 await native.locator('[data-v2-firstfilm-open]').click();
 const journey=native.locator('[data-v2-firstfilm-screen="journey"]');
 await journey.waitFor();
 assert.equal(await journey.locator('[data-v2-firstfilm-node]').count(),5);
 await screenshotPhone(native.locator('.phone'),'real-firstfilm-journey-'+label+'.png',shots);
 const selected=label==='desktop'?ids:['making','shootscene','review'];
 for(const id of selected){
  const lesson=curriculum.lessons.find(l=>l.id===id);
  assert(lesson,'Missing original lesson '+id);
  await journey.locator('[data-v2-firstfilm-node="'+id+'"]').click();
  const mission=native.locator('[data-v2-foundation-screen="mission"]');
  await mission.waitFor();
  assert.equal(await mission.getAttribute('data-v2-foundation-id'),id);
  assert.equal(await mission.locator('.mission-meta h2').textContent(),lesson.title);
  assert.match(await mission.locator('.eyebrow').first().textContent(),/REAL CHAPTER 06/);
  await screenshotPhone(native.locator('.phone'),'real-firstfilm-observe-'+id+'-'+label+'.png',shots);
  await mission.locator('.foundation-deep-dive summary').click();
  assert.equal(await mission.locator('.foundation-deep-dive section').count(),lesson.sections.length);
  await mission.locator('.foundation-deep-dive summary').click();
  await mission.locator('[data-v2-foundation-next]').click();
  assert.equal(await mission.locator('[data-v2-foundation-next]').isDisabled(),true,
    'A real creative choice is required to advance');
  await mission.locator('[data-v2-foundation-choice="1"]').click();
  await mission.locator('[data-v2-foundation-next]').click();
  assert.equal(await mission.getAttribute('data-v2-foundation-step'),'2');
  const visual=mission.locator('[data-v2-firstfilm-experiment="'+id+'"]');
  assert.equal(await visual.count(),1,'Custom first-film study missing '+id);
  for(let state=0;state<3;state++){
   await mission.locator('[data-v2-foundation-explore="'+state+'"]').click();
   assert.equal(await visual.getAttribute('data-v2-firstfilm-selection'),String(state),
     'Visual studio must respond to each concept switch');
   if(id==='shotlist')assert.equal(await visual.locator('.first-film-shot').count(),3);
   if(id==='shootscene')assert.equal(await visual.locator('.first-film-checkline').count(),3);
   if(id==='editminute')assert.equal(await visual.locator('.first-film-edit-frame').count(),3);
   if(id==='review')assert.equal(await visual.locator('.first-film-review-progress>div').count(),3);
  }
  assert.equal(await mission.locator('.foundation-knowledge-check h3').textContent(),lesson.q);
  await screenshotPhone(native.locator('.phone'),'real-firstfilm-study-'+id+'-'+label+'.png',shots);
  assert.equal(await mission.locator('[data-v2-foundation-next]').isDisabled(),true,
    'Unanswered factual quiz cannot complete a real lesson');
  const wrong=lesson.answer===0?1:0;
  await mission.locator('[data-v2-foundation-quiz="'+wrong+'"]').click();
  assert.equal(await mission.locator('[data-v2-foundation-next]').isDisabled(),true,
    'An incorrect factual answer cannot complete a real lesson');
  await mission.locator('[data-v2-foundation-quiz="'+lesson.answer+'"]').click();
  await mission.locator('[data-v2-foundation-next]').click();
  assert.equal(await mission.getAttribute('data-v2-foundation-step'),'3');
  if(id==='making'){
   await mission.locator('[data-v2-foundation-note]').fill('One room, one letter, a single discovery and a visible choice.');
   await mission.locator('[data-v2-foundation-save-note]').click();
   assert.match(await mission.locator('.foundation-save-status').textContent(),
    /existing Frame One practice notes and backup/);
  }
  await mission.locator('[data-v2-foundation-next]').click();
  await native.locator('[data-v2-foundation-complete]').waitFor();
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('frameone-progress-v01')||'[]'));
  assert(stored.includes(id),'Real original lesson completion missing '+id);
  for(const old of before)assert(stored.includes(old),'Prior progress lost '+old);
  await native.locator('[data-v2-foundation-complete] button.btn-primary').click();
  await journey.waitFor();
  assert.match(await journey.locator('[data-v2-firstfilm-node="'+id+'"]').getAttribute('aria-label'),/completed/);
 }
 if(label==='desktop'){
  await journey.locator('[data-v2-firstfilm-course-finished]').waitFor();
  assert.match(await journey.locator('[data-v2-firstfilm-course-finished]').textContent(),
   /do not claim you've recorded or finished one/,
   'Completing lessons must not pretend an actual film was shot');
 }
 const backup=await page.evaluate(()=>JSON.parse(window.frameOneLegacy.getBackupJSON()));
 assert.equal(backup.format,'frameone-learning-backup');
 assert.equal(backup.version,1,'Never silently change portable backup format');
 for(const id of selected)assert(backup.completed.includes(id),'Original backup missing new lesson '+id);
 for(const old of before)assert(backup.completed.includes(old),'Old completion absent in backup '+old);
 assert.equal(backup.notes.making,'One room, one letter, a single discovery and a visible choice.');
 const after=await page.evaluate(all=>Object.fromEntries(all.map(k=>[k,localStorage.getItem(k)])),keys);
 assert.equal(after['frameone-scene-v07'],original['frameone-scene-v07'],
   'Last-chapter lesson may not rewrite earlier film projects');
 assert.equal(await page.evaluate(()=>localStorage.getItem('frameone-option-b-prototype-v1')),demo,
   'Real learning must not award credits in separate six-mission prototype');
 assert.equal(await page.evaluate(()=>window.frameOneLegacy.completeGuidedFoundation('fake-last-lesson')),false);
 await native.locator('[data-v2-firstfilm-back]').click();
 await native.locator('[data-v2-people-screen="journey"]').waitFor();
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
 return {validated:selected.length,preserved:before.length};
}
module.exports={verifyRealChapterSix};
