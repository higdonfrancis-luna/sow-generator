// Render chosen moments of the animation to PNG for review.
//   node preview.js <out dir> <t1> [t2 ...]        (TL=timeline_cja etc. for a one-product clip)
const path = require('path');
const { chromium } = require('playwright');
const [outDir, ...times] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const tl = process.env.TL || 'timeline';
  // a translated timeline (i18n/build_lang.py) names its own page; the English ones use anim/animate.html
  const own = JSON.parse(require('fs').readFileSync(path.resolve(__dirname, `${tl}.json`), 'utf8')).page;
  await page.goto('file://' + path.resolve(__dirname, '..', own || 'anim/animate.html') + '?tl=' + tl);
  const info = await page.evaluate(() => window.READY);
  console.log('ready', JSON.stringify(info));
  for (const t of times) {
    await page.evaluate(x => window.render(x), +t);
    const f = path.join(outDir, `t${(+t).toFixed(2).padStart(7, '0')}.png`);
    await page.screenshot({ path: f });
    console.log(f);
  }
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
})();
