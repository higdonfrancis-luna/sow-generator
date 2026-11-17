// Pictures of the Propensity to buy tab inside the brief.
// Run: node pics.js <folder with the brief plus propensity-method.html> <output folder>
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(process.argv[2]), out = process.argv[3];
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.csv': 'text/csv' };
const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(root, p);
  if (!f.startsWith(root) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': mime[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(r);
});
(async () => {
  await new Promise(r => srv.listen(0, r));
  const base = 'http://127.0.0.1:' + srv.address().port;
  const b = await chromium.launch();
  const errs = [];
  async function shot(name, sel, w, h) {
    const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    const p = await c.newPage();
    p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    p.on('pageerror', e => errs.push(name + ': ' + e.message));
    await p.goto(base + '/propensity-method.html', { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    if (sel) {
      await p.evaluate(s => {
        const hd = document.querySelector('.masthead').getBoundingClientRect().bottom;
        const e = document.querySelector(s);
        const y = e.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: Math.max(0, y - hd - 28), behavior: 'instant' });
      }, sel);
      await p.waitForTimeout(300);
    }
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    await p.screenshot({ path: out + '/' + name + '.png' });
    console.log(name, 'sideways scroll:', overflow);
    await c.close();
  }
  await shot('m1_top', null, 1440, 1060);
  await shot('m2_in_short', '#short', 1440, 640);
  await shot('m3_logic', '#logic', 1440, 1010);
  await shot('m4_example', '#example', 1440, 1500);
  await shot('m5_meaning', '#meaning', 1440, 980);
  await shot('m6_proof', '#proof', 1440, 1160);
  await shot('m7_data', '#data', 1440, 720);
  await shot('m8_status', '#status', 1440, 940);
  await shot('m9_phone_top', null, 390, 844);
  await shot('m10_phone_example', '#example-target', 390, 844);
  await shot('m11_list_picture', '#example-list', 1440, 1200);
  await shot('m12_tablet_top', null, 1024, 768);
  console.log('errors', errs);
  await b.close();
  srv.close();
})().catch(e => { console.error(e); process.exit(1); });
