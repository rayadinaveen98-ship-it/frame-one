/* Browser acceptance for the exact four-stage Option B lesson.
 * Captures real reference HTML, then native React at the SAME device viewport,
 * mission, step, selected option, zoom and checkbox state. Pixel failures are
 * hard CI failures: no approval from AI concept screenshots.
 */
const assert=require('node:assert/strict');
const {screenshotPhone,comparePixels}=require('./option-b-pixel-parity.cjs');

async function verifyMissionParity(page,reference,shots,label){
  const referenceViews={};
  const stageNames=['observe','decide-empty','decide-selected','experiment','experiment-zoom','make','make-checked'];
  const shotReference=async name=>{
    await reference.locator('#viewport').evaluate(el=>{el.scrollTop=0;});
    referenceViews[name]=await screenshotPhone(reference.locator('.phone'),
      'native-vs-approved-mission-'+name+'-'+label+'-reference.png',shots);
  };
  const shotNative=async name=>{
    const native=page.locator('[data-v2-native-react]');
    await native.locator('#viewport').evaluate(el=>{el.scrollTop=0;});
    const img=await screenshotPhone(native.locator('.phone'),
      'native-vs-approved-mission-'+name+'-'+label+'-react.png',shots);
    const result=await comparePixels(page,referenceViews[name],img,
      'native-vs-approved-mission-'+name+'-'+label);
    console.log('VISUAL PARITY: Native mission '+name+' '+label,result);
  };

  // The approved reference, still running in the app, is the pixel oracle.
  // The caller has both implementations on the Chapter 1 journey screen.
  await page.locator('[data-option-b-compare="approved"]').click();
  await reference.locator('.journey-node').first().click();
  await reference.locator('.mission-top').waitFor();
  await shotReference('observe');
  await reference.locator('[data-next-step]').click();
  await shotReference('decide-empty');
  assert.equal(await reference.locator('[data-next-step]').isDisabled(),true);
  await reference.locator('[data-choice="1"]').click();
  await shotReference('decide-selected');
  await reference.locator('[data-next-step]').click();
  await shotReference('experiment');
  await reference.locator('#missionZoom').focus();
  await reference.locator('#missionZoom').press('End');
  assert.equal(await reference.locator('#missionZoom').inputValue(),'2.2');
  await shotReference('experiment-zoom');
  await reference.locator('[data-next-step]').click();
  await shotReference('make');
  await reference.locator('[data-practice="0"]').click();
  await shotReference('make-checked');

  await page.locator('[data-option-b-compare="react"]').click();
  const native=page.locator('[data-v2-native-react]');
  await page.locator('[data-v2-native-mission="see"]').click();
  await native.locator('[data-v2-native-screen="mission"]').waitFor();
  assert.equal(await native.locator('[data-v2-native-mission-step]').getAttribute('data-v2-native-mission-step'),'0');
  await shotNative('observe');
  await native.locator('[data-v2-native-next-step]').click();
  await shotNative('decide-empty');
  assert.equal(await native.locator('[data-v2-native-next-step]').isDisabled(),true,
    'Creative decision must be made before proceeding');
  await native.locator('[data-v2-native-choice="1"]').click();
  assert.equal(await native.locator('[data-v2-native-choice="1"]').getAttribute('aria-pressed'),'true');
  await shotNative('decide-selected');
  await native.locator('[data-v2-native-next-step]').click();
  await shotNative('experiment');
  await native.locator('[data-v2-native-zoom]').focus();
  await native.locator('[data-v2-native-zoom]').press('End');
  assert.equal(await native.locator('[data-v2-native-zoom]').inputValue(),'2.2');
  await shotNative('experiment-zoom');
  await native.locator('[data-v2-native-next-step]').click();
  await shotNative('make');
  await native.locator('[data-v2-native-practice="0"]').click();
  assert.equal(await native.locator('[data-v2-native-practice="0"]').isChecked(),true);
  await shotNative('make-checked');

  // Completing a native mission updates *only* the demo key; an iframe reload
  // synchronizes the separate, untouched approved reference.
  const before=await page.evaluate(()=>{
    try{return JSON.parse(localStorage.getItem('frameone-option-b-prototype-v1')||'{}')}
    catch{return {}}
  });
  await native.locator('[data-v2-native-next-step]').click();
  await native.locator('.celebrate h1').waitFor();
  const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('frameone-option-b-prototype-v1')||'{}'));
  assert.ok(after.finished.includes('see'),'Native completion persists only to prototype storage');
  assert.equal(after.points,(Number(before.points)||0)+(before.finished?.includes('see')?0:20),
    'React grants 20 points at most once');
  const nativeComplete=await screenshotPhone(native.locator('.phone'),
    'native-vs-approved-mission-complete-'+label+'-react.png',shots);
  await page.locator('[data-option-b-compare="approved"]').click();
  await reference.locator('.home-hero').waitFor();
  await reference.locator('.navbar [data-screen="journey"]').click();
  await reference.locator('.journey-node').first().click();
  await reference.locator('[data-next-step]').click();
  await reference.locator('[data-choice="1"]').click();
  await reference.locator('[data-next-step]').click();
  await reference.locator('[data-next-step]').click();
  await reference.locator('[data-next-step]').click();
  await reference.locator('.celebrate h1').waitFor();
  const approvedComplete=await screenshotPhone(reference.locator('.phone'),
    'native-vs-approved-mission-complete-'+label+'-reference.png',shots);
  const completeResult=await comparePixels(page,approvedComplete,nativeComplete,
    'native-vs-approved-mission-complete-'+label);
  console.log('VISUAL PARITY: Native mission completion '+label,completeResult);

  // A second playthrough must not create imaginary points.
  await page.locator('[data-option-b-compare="react"]').click();
  await native.locator('.celebrate button.btn-secondary').click();
  await native.locator('[data-v2-native-mission-step="0"]').waitFor();
  await native.locator('[data-v2-native-next-step]').click();
  await native.locator('[data-v2-native-choice="0"]').click();
  await native.locator('[data-v2-native-next-step]').click();
  await native.locator('[data-v2-native-next-step]').click();
  await native.locator('[data-v2-native-next-step]').click();
  await native.locator('.celebrate h1').waitFor();
  const repeated=await page.evaluate(()=>JSON.parse(localStorage.getItem('frameone-option-b-prototype-v1')||'{}'));
  assert.equal(repeated.points,after.points,'Revisiting a mission must never inflate rewards');
  await page.locator('[data-option-b-compare="approved"]').click();
  return {checkedScreens:stageNames.length+1,points:repeated.points};
}
module.exports={verifyMissionParity};
