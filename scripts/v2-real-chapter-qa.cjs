/* Integration acceptance for five REAL canonical Frame One Foundation lessons.
 * Unlike the demo, these exercises mark the original 33-lesson progress
 * only AFTER the original knowledge quiz is answered correctly.
 */
const assert=require('node:assert/strict');
const {screenshotPhone}=require('./option-b-pixel-parity.cjs');
const curriculum=require('../src/data/curriculum.v08b.json');
const ids=curriculum.chapters[0].ids;
async function verifyRealChapterOne(page,reference,shots,label){
  const native=page.locator('[data-v2-native-react]');
  const originalKeys=['frameone-progress-v01','frameone-practice-v07','frameone-scene-v07'];
  await page.locator('[data-option-b-compare="react"]').click();
  await native.locator('[data-v2-native-nav="home"]').click();
  await native.locator('[data-v2-open-foundations]').click();
  await native.locator('[data-v2-foundation-screen="journey"]').waitFor();
  assert.equal(await native.locator('[data-v2-foundation-node]').count(),5,
    'Real Chapter 1 journey has exactly five canonical missions, not six demo nodes');
  const before=await page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),originalKeys);
  const pilotBefore=await page.evaluate(()=>localStorage.getItem('frameone-option-b-prototype-v1'));
  await screenshotPhone(native.locator('.phone'),'real-foundations-journey-'+label+'.png',shots);
  const runIds=label==='desktop'?ids:['why','india'];
  for(const [index,id] of runIds.entries()){
    const lesson=curriculum.lessons.find(l=>l.id===id);
    assert(lesson,'Missing canonical lesson '+id);
    await native.locator('[data-v2-foundation-node="'+id+'"]').click();
    const mission=native.locator('[data-v2-foundation-screen="mission"]');
    await mission.waitFor();
    assert.equal(await mission.getAttribute('data-v2-foundation-id'),id);
    assert.equal(await mission.locator('.mission-meta h2').textContent(),lesson.title);
    await screenshotPhone(native.locator('.phone'),'real-foundations-observe-'+id+'-'+label+'.png',shots);

    // The concept is expandable; no long prose is forced ahead of the task.
    await mission.locator('.foundation-deep-dive summary').click();
    assert.equal(await mission.locator('.foundation-deep-dive section').count(),lesson.sections.length);
    await mission.locator('.foundation-deep-dive summary').click();
    await mission.locator('[data-v2-foundation-next]').click();
    assert.equal(await mission.getAttribute('data-v2-foundation-step'),'1');
    assert.equal(await mission.locator('[data-v2-foundation-next]').isDisabled(),true,
      'Creative decision must be made to continue');
    await mission.locator('[data-v2-foundation-choice="1"]').click();
    assert.equal(await mission.locator('[data-v2-foundation-choice="1"]').getAttribute('aria-pressed'),'true');
    await mission.locator('.feedback h3').waitFor();
    await mission.locator('[data-v2-foundation-next]').click();
    assert.equal(await mission.getAttribute('data-v2-foundation-step'),'2');
    await mission.locator('[data-v2-foundation-explore="2"]').click();
    assert.equal(await mission.locator('[data-v2-foundation-explore="2"]').getAttribute('aria-pressed'),'true');
    assert.equal(await mission.locator('.foundation-knowledge-check h3').textContent(),lesson.q);
    await screenshotPhone(native.locator('.phone'),'real-foundations-knowledge-'+id+'-'+label+'.png',shots);
    assert.equal(await mission.locator('[data-v2-foundation-next]').isDisabled(),true,
      'Knowledge check should block unchecked progression');
    const wrong=lesson.answer===0?1:0;
    await mission.locator('[data-v2-foundation-quiz="'+wrong+'"]').click();
    assert.equal(await mission.locator('[data-v2-foundation-quiz-status]').getAttribute('data-v2-foundation-quiz-status'),'retry');
    assert.equal(await mission.locator('[data-v2-foundation-next]').isDisabled(),true,
      'Wrong factual knowledge cannot silently earn course completion');
    await mission.locator('[data-v2-foundation-quiz="'+lesson.answer+'"]').click();
    assert.equal(await mission.locator('[data-v2-foundation-quiz-status]').getAttribute('data-v2-foundation-quiz-status'),'correct');
    await mission.locator('[data-v2-foundation-next]').click();
    assert.equal(await mission.getAttribute('data-v2-foundation-step'),'3');
    if(id==='why'){
      await mission.locator('[data-v2-foundation-note]').fill('Real Chapter 1 practice: I noticed the story in the character\'s reaction.');
      await mission.locator('[data-v2-foundation-save-note]').click();
      assert.match(await mission.locator('.foundation-save-status').textContent(),/existing Frame One practice notes and backup/i);
    }
    const prior=await page.evaluate(()=>JSON.parse(localStorage.getItem('frameone-progress-v01')||'[]'));
    await mission.locator('[data-v2-foundation-next]').click();
    await native.locator('[data-v2-foundation-complete]').waitFor();
    const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('frameone-progress-v01')||'[]'));
    assert(after.includes(id),'Guided completion must mark canonical legacy progress '+id);
    for(const prevId of prior)assert(after.includes(prevId),'Completion must preserve old progress '+prevId);
    await screenshotPhone(native.locator('.phone'),'real-foundations-complete-'+id+'-'+label+'.png',shots);
    await native.locator('[data-v2-foundation-complete] button.btn-primary').click();
    await native.locator('[data-v2-foundation-screen="journey"]').waitFor();
    assert.match(await native.locator('[data-v2-foundation-node="'+id+'"]').getAttribute('aria-label'),/completed/);
  }
  const backup=await page.evaluate(()=>JSON.parse(window.frameOneLegacy.getBackupJSON()));
  assert.equal(backup.format,'frameone-learning-backup');
  assert.equal(backup.version,1,'No incompatible new backup version introduced');
  for(const id of runIds)assert(backup.completed.includes(id),'Real completion must immediately appear in backup: '+id);
  assert.equal(backup.notes.why,"Real Chapter 1 practice: I noticed the story in the character's reaction.",
    'Practice note must exist in live legacy backup owner, not just localStorage');
  const after=await page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),originalKeys);
  assert.equal(after['frameone-scene-v07'],before['frameone-scene-v07'],
    'Original storyboard storage must not be modified by guided lessons');
  assert.deepEqual(await page.evaluate(()=>localStorage.getItem('frameone-option-b-prototype-v1')),pilotBefore,
    'Finishing real lessons must never add imaginary demo points or modify pilot missions');

  // Existing invalid IDs never get marked complete, even through the adapter.
  assert.equal(await page.evaluate(()=>window.frameOneLegacy.completeGuidedFoundation('not-a-real-id')),false);
  await native.locator('[data-v2-foundation-back]').click();
  await native.locator('[data-v2-native-screen="home"]').waitFor();
  await page.locator('[data-option-b-compare="approved"]').click();
  await reference.locator('.home-hero').waitFor();
  return {validatedLessons:runIds.length,backupContains:backup.completed.length};
}
module.exports={verifyRealChapterOne};
