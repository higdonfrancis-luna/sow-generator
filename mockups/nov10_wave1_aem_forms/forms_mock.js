// Mockup only (Nov 10 2026, Adam: "show me the services list and a card mockup before building anything"). Draws AEM Forms
// on a scratch copy of the canvas built with the wave 1 research (never the repo's tool) and lays the pictures out on one page.
//   node sow/mockups/nov10_wave1_aem_forms/forms_mock.js <folder holding the scratch canvas index.html>
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const DIR = process.argv[2], OUT = __dirname, FONTS = path.join(__dirname, '..', '..', '..', 'video', 'fonts');
const server = http.createServer((req, res) => { let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (u.endsWith('/')) u += 'index.html';
  const f = path.join(DIR, u); if (!f.startsWith(DIR) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); fs.createReadStream(f).pipe(res); });
const b64 = f => fs.readFileSync(f).toString('base64');
(async () => {
  await new Promise(r => server.listen(0, r)); const BASE = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch(); const ctx = await b.newContext({viewport: {width: 1500, height: 1000}, deviceScaleFactor: 2}); const p = await ctx.newPage();
  await p.goto(BASE); await p.waitForTimeout(500); await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400);
  const addP = async id => { if (await p.isHidden('#add-menu')) await p.click('#add-btn');
    if (await p.$(`#add-menu details.nocon [data-add="${id}"]`) && !(await p.$eval('#add-menu details.nocon', d => d.open))) await p.click('#add-menu details.nocon summary');
    await p.click(`#add-menu [data-add="${id}"]`); await p.waitForTimeout(300); };
  for (const id of ['aemforms', 'aemsites', 'workfront', 'cw']) await addP(id);
  await p.keyboard.press('Escape'); await p.mouse.click(40, 938); await p.waitForTimeout(300);
  if (await p.isVisible('#card')) await p.click('#card [data-close]');
  await p.fill('#rate', '175'); await p.waitForTimeout(300);
  const shots = {};
  shots.canvas = (await p.screenshot({clip: {x: 0, y: 0, width: 1500, height: 1000}})).toString('base64');
  const whole = async () => { await p.evaluate(() => { const c = document.getElementById('card'); c.style.maxHeight = 'none'; c.style.overflow = 'visible'; c.style.top = '0px'; c.style.position = 'absolute';
    for (const d of c.querySelectorAll('details')) d.open = true; document.body.style.minHeight = '6000px'; }); await p.setViewportSize({width: 1500, height: 4200}); await p.waitForTimeout(300);
    const s = (await (await p.$('#card')).screenshot()).toString('base64'); await p.setViewportSize({width: 1500, height: 1000}); return s; };
  await p.click('.node[data-p="aemforms"]'); await p.waitForTimeout(400); shots.product = await whole();
  await p.click('#card [data-close]'); await p.waitForTimeout(200);
  await p.click('.ib[data-c="aemforms-aemsites"]'); await p.waitForTimeout(400); shots.conn = await whole();
  const font = w => `@font-face{font-family:"Source Sans 3";font-weight:${w};src:url(data:font/woff2;base64,${b64(path.join(FONTS, `source-sans-3-latin-${w}-normal.woff2`))}) format("woff2")}`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${font(400)}${font(600)}${font(700)}
body{margin:0;font-family:"Source Sans 3",sans-serif;color:#1C1C1C;background:#fff}.bar{height:10px;background:#EB1000}main{padding:40px 54px 54px}
.k{font-size:17px;font-weight:700;letter-spacing:2.4px;color:#B30B00;text-transform:uppercase}h1{font-size:44px;margin:8px 0 6px}p.sub{font-size:23px;margin:0 0 30px}
.row{display:grid;grid-template-columns:660px 660px 1fr;gap:40px;align-items:start}.pill{display:inline-block;background:#1C1C1C;color:#fff;font-weight:700;font-size:16px;letter-spacing:1.6px;border-radius:999px;padding:4px 14px;margin-right:12px;vertical-align:3px}
h2{font-size:26px;margin:0 0 12px}img{width:100%;display:block}.frame{border:2px solid #1C1C1C;border-radius:16px;padding:12px;background:#F4F4F4}
ul{font-size:22px;line-height:32px;padding-left:26px;margin:10px 0 0}h3{font-size:25px;margin:26px 0 0}
</style></head><body><div class="bar"></div><main>
<div class="k">Proposal for Adam's yes, Nov 10 2026: nothing built</div><h1>Wave 1: AEM Forms on the canvas</h1>
<p class="sub">Real cards, drawn on a scratch copy of the tool with the new research. Every service links to its Adobe page. The numbers are hours at Typical size.</p>
<div class="row"><div><h2><span class="pill">1</span>The AEM Forms card: 8 starting services, 9 more</h2><div class="frame"><img src="data:image/png;base64,${shots.product}"></div></div>
<div><h2><span class="pill">2</span>A connection card: AEM Forms + AEM Sites</h2><div class="frame"><img src="data:image/png;base64,${shots.conn}"></div>
<h3>What it means</h3><ul><li>AEM Forms joins the Create your own play picker and the RFI Builder. The six plays on the front page stay as they are.</li>
<li>17 product services and 15 connection services, each backed by a quote checked on Adobe's page (107 quotes, all found).</li>
<li>It connects to six products already in the tool: AEM Sites, Edge Delivery Services, Real-Time CDP, Marketo Engage, Workfront and Coworker.</li>
<li>Document generation (the legacy replacement in the Washington State RFP) is four optional services tagged with the add-on they need.</li>
<li>No Brand Visibility connection: Adobe documents none.</li></ul></div>
<div><h2><span class="pill">3</span>On the canvas with AEM Sites, Workfront and Coworker</h2><div class="frame"><img src="data:image/png;base64,${shots.canvas}"></div></div></div>
</main></body></html>`;
  fs.writeFileSync(path.join(OUT, 'aem_forms_cards_mock.html'), html);
  const q = await (await b.newContext({viewport: {width: 2600, height: 1200}, deviceScaleFactor: 1})).newPage();
  await q.setContent(html); await q.waitForTimeout(600); await q.screenshot({path: path.join(OUT, 'aem_forms_cards.png'), fullPage: true});
  await b.close(); server.close(); console.log('written');
})();
