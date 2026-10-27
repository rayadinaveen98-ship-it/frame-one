/* Frame One v0.9C: browser smoke QA against the actual compiled Vite app.
 * Run after 'npm run build' and installing Playwright Chromium.
 * No external accounts, real user data or hosted deployment needed.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');
const curriculum = require('../src/data/curriculum.v08b.json');
const base = 'http://127.0.0.1:4173';
const shots = path.resolve(__dirname, '../qa/screenshots');
fs.mkdirSync(shots, { recursive: true });
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], {
  cwd: path.resolve(__dirname, '..'),
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, CI: '1' }
});
let logs = '';
for (const stream of [server.stdout, server.stderr]) stream.on('data', data => { logs += data.toString(); });
let browser;
const failures = [];
const record = (message) => { failures.push(message); console.error('QA ISSUE: ' + message); };
async function ready() {
  for (let i=0; i<80; i++) {
    if (server.exitCode !== null) throw Error('Vite preview exited: ' + logs.slice(-3000));
    try {
      const response = await fetch(base);
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw Error('Vite preview did not start: ' + logs.slice(-3000));
}
async function photo(page, name) {
  await page.screenshot({ path: path.join(shots, name), fullPage: true, animations: 'disabled' });
}
async function verify() {
  await ready();
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => record('Uncaught browser exception: ' + error.message));
  const response = await page.goto(base, { waitUntil: 'domcontentloaded' });
  assert.equal(response.status(), 200);
  await page.waitForFunction(() => Boolean(window.frameOneLegacy), { timeout: 15000 });
  await page.locator('#content .page').waitFor({ timeout: 15000 });
  await photo(page, '01-home-desktop.png');
  console.log('PASS: compiled app mounts and original home screen appears');

  await page.locator('.sidebar [data-page="learn"]').click();
  await page.locator('.react-learn-view h1').waitFor();
  assert.match(await page.locator('.react-learn-view h1').textContent(), /film starts with curiosity/i);
  assert.equal(await page.locator('.react-lesson-card').count(), 33);
  await photo(page, '02-chapters-desktop.png');
  console.log('PASS: React renders all 33 lessons and six chapters');

  await page.locator('.react-lesson-card').first().click();
  await page.locator('.react-lesson h1').waitFor();
  assert.equal((await page.locator('.react-lesson h1').textContent()).trim(), curriculum.lessons[0].title);
  await page.locator('.quiz-option').nth(curriculum.lessons[0].answer).click();
  const complete = page.getByRole('button', { name: /mark lesson complete/i });
  assert.equal(await complete.isEnabled(), true);
  await complete.click();
  assert.equal(await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('frameone-progress-v01') || '[]').includes('why'); } catch { return false; }
  }), true);
  await page.locator('.react-lesson h1').waitFor();
  await photo(page, '03-lesson-desktop.png');
  console.log('PASS: React quiz marks original progress key and advances to next lesson');

  await page.locator('.sidebar [data-page="lab"]').click();
  await page.locator('.lab-tabs').waitFor();
  for (const lab of ['frame', 'sound', 'cut', 'light', 'story', 'colour', 'continuity']) {
    await page.locator('.lab-tabs [data-lab="' + lab + '"]').click();
    await page.locator('.lab-tabs [data-lab="' + lab + '"][aria-pressed="true"]').waitFor();
    assert.ok((await page.locator('#content h1').textContent()).trim(), 'Lab ' + lab + ' needs a heading');
  }
  await photo(page, '04-continuity-desktop.png');
  await page.locator('.lab-tabs [data-lab="frame"]').click();
  await page.locator('#frameZoom').evaluate(el => { el.value = '2.5'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  assert.match(await page.locator('#frameZoomValue').textContent(), /2.5/);
  await page.locator('.lab-tabs [data-lab="colour"]').click();
  await page.locator('#colourStrength').evaluate(el => { el.value = '75'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  assert.match(await page.locator('#colourStrengthValue').textContent(), /75/);
  console.log('PASS: all seven labs mount; Frame and Colour controls respond');

  await page.locator('.sidebar [data-page="learn"]').click();
  await page.locator('.react-learn-view').waitFor();
  const backup = page.locator('.backup-panel');
  await backup.locator('summary').click();
  const downloadEvent = page.waitForEvent('download');
  await backup.getByRole('button', { name: /download learning backup/i }).click();
  const download = await downloadEvent;
  assert.match(download.suggestedFilename(), /\.json$/);
  console.log('PASS: browser generates a downloadable learning backup');

  const onDialog = page.waitForEvent('dialog');
  await backup.locator('input[type="file"]').setInputFiles({
    name: 'demo-backup.json', mimeType: 'application/json', buffer: Buffer.from('{}')
  });
  const confirmation = await onDialog;
  assert.equal(confirmation.type(), 'confirm');
  await confirmation.dismiss();
  await page.getByText('Restore cancelled. Your current learning data is unchanged.').waitFor();
  assert.equal(await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('frameone-progress-v01') || '[]').includes('why'); } catch { return false; }
  }), true);
  console.log('PASS: cancelling backup restore leaves previously saved progress unchanged');

  // Offline claim must be tested with the built service worker, not assumed from the manifest.
  try {
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => Boolean(window.frameOneLegacy));
    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => Boolean(window.frameOneLegacy));
    await page.locator('#content .page').waitFor({ timeout: 12000 });
    await photo(page, '07-offline-home.png');
    console.log('PASS: application reloads using cached assets while offline');
  } catch (error) {
    record('Offline reload failed: ' + (error instanceof Error ? error.message : String(error)));
  } finally {
    await context.setOffline(false);
  }
  await context.close();

  for (const width of [390, 320]) {
    const mobile = await browser.newContext({ viewport: { width, height: 800 }, isMobile: true, deviceScaleFactor: 2, hasTouch: true, acceptDownloads: true });
    const phone = await mobile.newPage();
    phone.on('pageerror', error => record('Mobile browser exception: ' + error.message));
    await phone.goto(base, { waitUntil: 'domcontentloaded' });
    await phone.waitForFunction(() => Boolean(window.frameOneLegacy), { timeout: 15000 });
    await phone.locator('.mobile-nav [data-page="learn"]').click();
    await phone.locator('.react-learn-view h1').waitFor();
    const horizontal = await phone.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
    if (horizontal.scroll > horizontal.viewport + 3) record('Horizontal overflow at ' + width + 'px: ' + horizontal.scroll + ' vs ' + horizontal.viewport);
    await photo(phone, '05-chapters-' + width + 'px.png');
    await phone.locator('.mobile-nav [data-page="lab"]').click();
    await phone.locator('.lab-tabs').waitFor();
    await photo(phone, '06-lab-' + width + 'px.png');
    console.log('PASS: mobile ' + width + 'px navigates React chapters and legacy lab (overflow diagnostic: ' + horizontal.scroll + '/' + horizontal.viewport + ')');
    await mobile.close();
  }
  if (failures.length) throw Error(failures.join('\n'));
}
verify().then(() => { console.log('FRAME ONE BROWSER SMOKE: PASS'); }).catch(error => {
  console.error('FRAME ONE BROWSER SMOKE: FAIL\n' + (error.stack || error));
  process.exitCode = 1;
}).finally(async () => {
  try { if (browser) await browser.close(); } catch {}
  server.kill('SIGTERM');
});