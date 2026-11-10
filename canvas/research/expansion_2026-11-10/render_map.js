// Renders the expansion map page to a PNG. Run from the repo root after build_map.py:
//   node sow/canvas/research/expansion_2026-11-10/render_map.js
const {chromium} = require('playwright');
const path = require('path');
const DIR = path.join(__dirname, '..', '..', '..', 'mockups', 'nov10_expansion');
(async () => {
  const b = await chromium.launch(), p = await (await b.newContext({viewport: {width: 1760, height: 1000}, deviceScaleFactor: 2})).newPage();
  await p.goto('file://' + path.join(DIR, 'expansion_map.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  await p.screenshot({path: path.join(DIR, 'expansion_map.png'), fullPage: true});
  console.log('expansion_map.png', await p.evaluate(() => document.documentElement.scrollWidth + ' x ' + document.documentElement.scrollHeight));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
