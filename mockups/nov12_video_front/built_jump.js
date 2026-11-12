// As built (step 84): the first page video playing for real, with Jump to open, and after a jump.
const {chromium} = require('playwright'), path = require('path');
(async () => { const b = await chromium.launch(), p = await b.newPage({viewport: {width: 1280, height: 900}, deviceScaleFactor: 2}); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '../../site/index.html')); await p.waitForSelector('#vid-card');
  await p.click('#vid-watch'); await p.waitForFunction(() => { const v = document.querySelector('#vid-box video'); return v && v.readyState >= 2; }, null, {timeout: 60000}); await p.waitForTimeout(1500);
  await p.evaluate(() => document.querySelector('#vid-box video').pause()); await p.click('.jump .jbtn'); await p.waitForTimeout(400);
  await p.screenshot({path: path.join(__dirname, 'built_jump_open.png')});
  await p.click('.jump .jrow[data-name="Commerce"]'); await p.waitForTimeout(2500); await p.evaluate(() => document.querySelector('#vid-box video').pause()); await p.mouse.move(600, 400); await p.waitForTimeout(600);
  console.log(JSON.stringify(await p.evaluate(() => { const v = document.querySelector('#vid-box video'); return {t: Math.round(v.currentTime), on: document.querySelector('.jrow.on').dataset.name, next: document.querySelector('.nxt b').textContent, small: document.querySelector('.jump').classList.contains('small'), w: Math.round(v.getBoundingClientRect().width), h: Math.round(v.getBoundingClientRect().height)}; })), errs);
  await p.screenshot({path: path.join(__dirname, 'built_jump_commerce.png')});
  await b.close(); })().catch(e => { console.error(e); process.exit(1); });
