/* Screen-by-screen, pixel-by-pixel comparison of the approved Lab and
 * Progress reference with their real native React ports. All interactions
 * happen in the browser against the actual built Frame One application. */
const assert=require('node:assert/strict');
const {screenshotPhone,comparePixels}=require('./option-b-pixel-parity.cjs');

async function verifyStudioParity(page,reference,shots,label){
  const native=page.locator('[data-v2-native-react]');
  const switchTo=async mode=>page.locator('[data-option-b-compare="'+mode+'"]').click();
  const capture=async (which,name)=>{
    if(which==='approved')await reference.locator('#viewport').evaluate(el=>{el.scrollTop=0;});
    else await native.locator('#viewport').evaluate(el=>{el.scrollTop=0;});
    return screenshotPhone(which==='approved'?reference.locator('.phone'):native.locator('.phone'),
      'native-vs-approved-'+name+'-'+label+'-'+(which==='approved'?'reference':'react')+'.png',shots);
  };
  const compare=async(name,refAction,nativeAction)=>{
    await switchTo('approved');
    if(refAction)await refAction();
    const ref=await capture('approved',name);
    await switchTo('react');
    if(nativeAction)await nativeAction();
    const react=await capture('react',name);
    const result=await comparePixels(page,ref,react,'native-vs-approved-'+name+'-'+label);
    console.log('VISUAL PARITY: Native '+name+' '+label,result);
  };
  // The same prototype key is the ONLY data scope of these creative exercises.
  const productionBefore=await page.evaluate(()=>{
    const keys=['frameone-progress-v01','frameone-practice-v07','frameone-scene-v07'];
    return keys.map(key=>[key,localStorage.getItem(key)]);
  });

  await switchTo('approved');
  await reference.locator('.navbar [data-screen="lab"]').click();
  await switchTo('react');
  await native.locator('[data-v2-native-nav="lab"]').click();
  await compare('lab-frame-wide',async()=>{
    await reference.locator('[data-lab="frame"]').click();
    await reference.locator('[data-mode="0"]').click();
  },async()=>{
    await native.locator('[data-v2-native-lab="frame"]').click();
    await native.locator('[data-v2-native-mode="0"]').click();
  });
  await compare('lab-frame-guides',()=>reference.locator('[data-guides]').click(),
    ()=>native.locator('[data-v2-native-guides]').click());
  await compare('lab-frame-tight',async()=>{
    await reference.locator('#labZoom').focus();
    await reference.locator('#labZoom').press('End');
    assert.equal(await reference.locator('#labZoom').inputValue(),'2.2');
  },async()=>{
    await native.locator('[data-v2-native-lab-zoom]').focus();
    await native.locator('[data-v2-native-lab-zoom]').press('End');
    assert.equal(await native.locator('[data-v2-native-lab-zoom]').inputValue(),'2.2');
  });
  await compare('lab-light-warm',()=>reference.locator('[data-lab="light"]').click(),
    ()=>native.locator('[data-v2-native-lab="light"]').click());
  await compare('lab-light-cool',()=>reference.locator('[data-mode="1"]').click(),
    ()=>native.locator('[data-v2-native-mode="1"]').click());
  await compare('lab-light-contrast',()=>reference.locator('[data-mode="2"]').click(),
    ()=>native.locator('[data-v2-native-mode="2"]').click());
  await compare('lab-sound-traffic',()=>reference.locator('[data-lab="sound"]').click(),
    ()=>native.locator('[data-v2-native-lab="sound"]').click());
  await compare('lab-sound-birds',()=>reference.locator('[data-mode="2"]').click(),
    ()=>native.locator('[data-v2-native-mode="2"]').click());

  // Save ONLY in React; the Reference frame reloads from the shared demo key.
  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('frameone-option-b-prototype-v1')||'{}'));
  await native.locator('[data-v2-native-save-shot]').click();
  const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('frameone-option-b-prototype-v1')||'{}'));
  assert.equal(after.shots,(Number(before.shots)||0)+1,'One native save is exactly one demo Lab idea');
  assert.equal(after.points,(Number(before.points)||0)+5,'Native Lab awards exactly five demo points');
  await page.waitForTimeout(2350); // the approved toast intentionally lasts 2.3s
  await compare('progress-filled',async()=>{
    await reference.locator('.home-hero').waitFor();
    await reference.locator('.navbar [data-screen="progress"]').click();
  },async()=>{
    await native.locator('[data-v2-native-nav="progress"]').click();
    assert.equal(await native.locator('.stats .stat').count(),3);
    assert.equal((await native.locator('.stat strong').allTextContents()).join(','),
      [String(after.finished.length),String(after.points),String(after.shots)].join(','));
  });

  // The Progress mission list is actionable, not a static screenshot.
  await native.locator('[data-v2-native-progress-mission="frame"]').click();
  await native.locator('[data-v2-native-screen="mission"]').waitFor();
  assert.equal(await native.locator('[data-v2-native-mission-id]').getAttribute('data-v2-native-mission-id'),'frame');
  await native.locator('[data-v2-native-nav="progress"]').click();
  await native.locator('[data-v2-native-screen="progress"]').waitFor();

  // A rejected confirmation must not clear the demo; an accepted confirmation
  // must reset only the prototype key and keep every real learning key intact.
  page.once('dialog',d=>d.dismiss());
  await native.locator('[data-v2-native-reset]').click();
  assert.equal((await page.evaluate(()=>JSON.parse(localStorage.getItem('frameone-option-b-prototype-v1')||'{}'))).points,after.points);
  page.once('dialog',d=>d.accept());
  await native.locator('[data-v2-native-reset]').click();
  await native.locator('[data-v2-native-screen="home"]').waitFor();
  const reset=await page.evaluate(()=>JSON.parse(localStorage.getItem('frameone-option-b-prototype-v1')||'{}'));
  assert.deepEqual(reset.finished,[],'Reset only clears six demonstration missions');
  assert.equal(reset.points,0);
  assert.equal(reset.shots,0);
  const productionAfter=await page.evaluate(()=>{
    const keys=['frameone-progress-v01','frameone-practice-v07','frameone-scene-v07'];
    return keys.map(key=>[key,localStorage.getItem(key)]);
  });
  assert.deepEqual(productionAfter,productionBefore,'Real Frame One notes, lessons and storyboards remain byte-identical after demo reset');
  await switchTo('approved');
  await reference.locator('.home-hero').waitFor();
  return {comparedScreens:9,labIdeasSaved:after.shots,resetVerified:true};
}
module.exports={verifyStudioParity};
