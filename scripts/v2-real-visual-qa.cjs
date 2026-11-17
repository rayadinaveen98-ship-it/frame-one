/* Playwright acceptance: seven real Chapter 3 lessons, mobile and desktop.
 * Does not touch user data; runs inside isolated browser profile.
 */
const assert=require('node:assert/strict');
const {screenshotPhone}=require('./option-b-pixel-parity.cjs');
const curriculum=require('../src/data/curriculum.v08b.json');
const ids=curriculum.chapters[2].ids;
async function verifyRealChapterThree(page,reference,shots,label){
  const native=page.locator('[data-v2-native-react]');
  const keys=['frameone-progress-v01','frameone-practice-v07','frameone-scene-v07'];
  const initial=await page.evaluate(names=>Object.fromEntries(names.map(k=>[k,localStorage.getItem(k)])),keys);
  const previousProgress=JSON.parse(initial['frameone-progress-v01']||'[]');
  const demoBefore=await page.evaluate(()=>localStorage.getItem('frameone-option-b-prototype-v1'));
  await page.locator('[data-option-b-compare="react"]').click();
  await native.locator('[data-v2-native-nav="home"]').click();
  await native.locator('[data-v2-open-foundations]').click();
  await native.locator('[data-v2-story-open]').click();
  await native.locator('[data-v2-visual-open]').click();
  const journey=native.locator('[data-v2-visual-screen="journey"]');
  await journey.waitFor();
  assert.equal(await journey.locator('[data-v2-visual-node]').count(),7,
    'Visual-language map must expose all seven canonical lesson IDs');
  await screenshotPhone(native.locator('.phone'),'real-visual-journey-'+label+'.png',shots);
  const selectedIds=label==='desktop'?ids:['shot','lighting','lenses','colour'];
  for(const id of selectedIds){
    const lesson=curriculum.lessons.find(l=>l.id===id);
    assert(lesson,'Expected visual curriculum lesson '+id);
    await journey.locator('[data-v2-visual-node="'+id+'"]').click();
    const mission=native.locator('[data-v2-foundation-screen="mission"]');
    await mission.waitFor();
    assert.equal(await mission.getAttribute('data-v2-foundation-id'),id);
    assert.equal(await mission.locator('.mission-meta h2').textContent(),lesson.title);
    assert.match(await mission.locator('.eyebrow').first().textContent(),/REAL CHAPTER 03/);
    await screenshotPhone(native.locator('.phone'),'real-visual-observe-'+id+'-'+label+'.png',shots);
    await mission.locator('[data-v2-foundation-next]').click();
    assert.equal(await mission.locator('[data-v2-foundation-next]').isDisabled(),true);
    await mission.locator('[data-v2-foundation-choice="1"]').click();
    await mission.locator('[data-v2-foundation-next]').click();
    assert.equal(await mission.getAttribute('data-v2-foundation-step'),'2');
    assert.equal(await mission.locator('[data-v2-visual-experiment="'+id+'"]').count(),1);
    assert.equal(await mission.locator('[data-v2-visual-selection="0"]').count(),1);
    for(let i=0;i<3;i++){
      await mission.locator('[data-v2-foundation-explore="'+i+'"]').click();
      assert.equal(await mission.locator('[data-v2-visual-selection="'+i+'"]').count(),1);
      if(id==='lenses'&&i<2){
        assert.equal(await mission.locator('.visual-experiment .scene-card').count(),1,
          'The first two lens states show a visibly labelled crop, not a fabricated perspective change');
      }
    }
    if(['camera','lighting','movement','lenses'].includes(id)){
      assert.equal(await mission.locator('.visual-diagram svg').count(),1,
        'Camera physics should be a conceptual rig diagram, not a false photo render');
    }else{
      assert.equal(await mission.locator('.visual-experiment .scene-card').count(),1,
        'Framing, crop and colour study should use approved Option B artwork');
    }
    assert.equal(await mission.locator('.foundation-knowledge-check h3').textContent(),lesson.q);
    await screenshotPhone(native.locator('.phone'),'real-visual-study-'+id+'-'+label+'.png',shots);
    assert.equal(await mission.locator('[data-v2-foundation-next]').isDisabled(),true);
    const incorrect=lesson.answer===0?1:0;
    await mission.locator('[data-v2-foundation-quiz="'+incorrect+'"]').click();
    assert.equal(await mission.locator('[data-v2-foundation-next]').isDisabled(),true);
    await mission.locator('[data-v2-foundation-quiz="'+lesson.answer+'"]').click();
    await mission.locator('[data-v2-foundation-next]').click();
    assert.equal(await mission.getAttribute('data-v2-foundation-step'),'3');
    if(id==='shot'){
      await mission.locator('[data-v2-foundation-note]').fill('I compared the same street in three crops.');
      await mission.locator('[data-v2-foundation-save-note]').click();
      assert.match(await mission.locator('.foundation-save-status').textContent(),/existing Frame One practice notes and backup/);
    }
    await mission.locator('[data-v2-foundation-next]').click();
    await native.locator('[data-v2-foundation-complete]').waitFor();
    const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('frameone-progress-v01')||'[]'));
    assert(stored.includes(id),'Original progress missing '+id);
    for(const previous of previousProgress)assert(stored.includes(previous),'Original completion lost '+previous);
    await native.locator('[data-v2-foundation-complete] button.btn-primary').click();
    await journey.waitFor();
    assert.match(await journey.locator('[data-v2-visual-node="'+id+'"]').getAttribute('aria-label'),/completed/);
  }
  const backup=await page.evaluate(()=>JSON.parse(window.frameOneLegacy.getBackupJSON()));
  assert.equal(backup.format,'frameone-learning-backup');
  assert.equal(backup.version,1,'Keep backwards-compatible backup schema');
  for(const id of selectedIds)assert(backup.completed.includes(id),'New lesson absent from legacy backup: '+id);
  for(const id of previousProgress)assert(backup.completed.includes(id),'Previous completion lost: '+id);
  assert.equal(backup.notes.shot,'I compared the same street in three crops.');
  const after=await page.evaluate(names=>Object.fromEntries(names.map(k=>[k,localStorage.getItem(k)])),keys);
  assert.equal(after['frameone-scene-v07'],initial['frameone-scene-v07'],
    'Visual lessons cannot overwrite original storyboard');
  assert.equal(await page.evaluate(()=>localStorage.getItem('frameone-option-b-prototype-v1')),demoBefore,
    'Real Chapter 3 cannot award fake demo points');
  assert.equal(await page.evaluate(()=>window.frameOneLegacy.completeGuidedFoundation('made-up-visual')),false);
  await native.locator('[data-v2-visual-back]').click();
  await native.locator('[data-v2-story-screen="journey"]').waitFor();
  await native.locator('[data-v2-story-back]').click();
  await native.locator('[data-v2-foundation-screen="journey"]').waitFor();
  await native.locator('[data-v2-foundation-back]').click();
  await native.locator('[data-v2-native-screen="home"]').waitFor();
  await page.locator('[data-option-b-compare="approved"]').click();
  await reference.locator('.home-hero').waitFor();
  return {validated: selectedIds.length,oldProgressPreserved:previousProgress.length};
}
module.exports={verifyRealChapterThree};
