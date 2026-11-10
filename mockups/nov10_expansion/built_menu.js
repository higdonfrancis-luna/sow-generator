// As built (step 63, Nov 10 2026): three screens of the grouped Add product menu, taken from the built site.
//   node sow/mockups/nov10_expansion/built_menu.js     writes built_first_product.png, built_find.png, built_on_canvas.png
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, '..', '..', 'site');
const server = http.createServer((req, res) => { let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (u.endsWith('/')) u += 'index.html';
  const f = path.join(SITE, u); if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); fs.createReadStream(f).pipe(res); });
(async () => {
  await new Promise(r => server.listen(0, r)); const BASE = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch();
  const fresh = async () => { const p = await (await b.newContext({viewport: {width: 1500, height: 1000}, deviceScaleFactor: 2})).newPage();
    await p.goto(BASE); await p.waitForTimeout(500); await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400); return p; };
  const menu = async p => { if (await p.isHidden('#add-menu')) await p.click('#add-btn'); await p.waitForTimeout(300); };
  const shot = (p, name) => p.screenshot({path: path.join(__dirname, name), clip: {x: 0, y: 0, width: 1500, height: 1000}});
  let p = await fresh(); await menu(p); await shot(p, 'built_first_product.png');
  await p.fill('#add-find', 'journey'); await p.waitForTimeout(300); await shot(p, 'built_find.png'); await p.context().close();
  p = await fresh();
  for (const id of ['bv', 'cja']) { await menu(p); await p.fill('#add-find', id === 'bv' ? 'brand vis' : 'customer journey'); await p.waitForTimeout(200); await p.click(`#add-menu [data-add="${id}"]`); await p.waitForTimeout(400); }
  await p.keyboard.press('Escape'); await p.waitForTimeout(200); if (await p.isVisible('#card')) await p.click('#card [data-close]');
  await menu(p); await shot(p, 'built_on_canvas.png');
  await b.close(); server.close(); console.log('written');
})().catch(e => { console.error(e); process.exit(1); });
