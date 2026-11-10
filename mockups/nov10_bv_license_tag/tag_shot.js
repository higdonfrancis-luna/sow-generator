// The Search data + Brand Visibility card, for the before and after of step 60 (the "Needs a Brand Visibility license" tag removed).
//   node sow/mockups/nov10_bv_license_tag/tag_shot.js <site folder> <out.png>
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const DIR = path.resolve(process.argv[2]), OUT = process.argv[3];
const server = http.createServer((req, res) => { let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (u.endsWith('/')) u += 'index.html';
  const f = path.join(DIR, u); if (!f.startsWith(DIR) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); fs.createReadStream(f).pipe(res); });
(async () => {
  await new Promise(r => server.listen(0, r));
  const b = await chromium.launch(), p = await (await b.newContext({viewport: {width: 1500, height: 1700}, deviceScaleFactor: 2})).newPage();
  await p.goto(`http://localhost:${server.address().port}/`); await p.waitForTimeout(500); await p.click('#picker [data-play="abv"]'); await p.waitForTimeout(400);
  await p.click('#out-btn'); await p.waitForTimeout(200); await p.click('#out-menu [data-out="search"]'); await p.waitForTimeout(400);
  if (await p.isVisible('#card')) await p.click('#card [data-close]');
  await p.click('.ib[data-c="search-bv"]'); await p.waitForTimeout(400);
  await p.evaluate(() => { const c = document.getElementById('card'); c.style.maxHeight = 'none'; c.style.overflow = 'visible'; });
  await (await p.$('#card')).screenshot({path: OUT}); await b.close(); server.close();
})();
