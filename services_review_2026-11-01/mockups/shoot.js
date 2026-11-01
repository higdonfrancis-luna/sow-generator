// PNGs of the proposal boards: node sow/services_review_2026-11-01/mockups/shoot.js
const {chromium} = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  for (const [f, w] of [['services_by_play', 1600], ['seo_ai_owners', 1500]]) {
    const p = await (await b.newContext({viewport: {width: w, height: 200}})).newPage();
    await p.goto('file://' + path.join(__dirname, f + '.html')); await p.waitForTimeout(500);
    await p.screenshot({path: path.join(__dirname, f + '.png'), fullPage: true});
  }
  await b.close(); console.log('shots done');
})();
