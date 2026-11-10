// Mockup only (Nov 10 2026, Adam: "we should yeah do these and then start wave to"). Draws the seven wave 2 products
// (GenStudio and creative) on a scratch copy of the canvas built with the wave 2 research (never the repo's tool) and lays
// the pictures out on one page, for his yes before anything is built.
//   node sow/mockups/nov10_wave2/wave2_mock.js <folder holding the scratch canvas index.html and catalog.json>
// as built (step 64): node sow/mockups/nov10_wave2/wave2_mock.js sow/canvas built   writes as_built_wave2.png from the real canvas
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const DIR = path.resolve(process.argv[2]), OUT = __dirname, FONTS = path.join(__dirname, '..', '..', '..', 'video', 'fonts');
const BUILT = process.argv[3] === 'built';
const CAT = JSON.parse(fs.readFileSync(path.join(DIR, 'catalog.json'), 'utf8'));
const SIX = ['express', 'creativecloud', 'frameio', 'planning', 'fireflycp', 'fireflycm', 'brandintel'];
const server = http.createServer((req, res) => { let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (u.endsWith('/')) u += 'index.html';
  const f = path.join(DIR, u); if (!f.startsWith(DIR) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); fs.createReadStream(f).pipe(res); });
const b64 = f => fs.readFileSync(f).toString('base64'), esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
(async () => {
  await new Promise(r => server.listen(0, r)); const BASE = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch();
  const open = async ids => { const ctx = await b.newContext({viewport: {width: 1500, height: 1000}, deviceScaleFactor: 2}); const p = await ctx.newPage();
    await p.goto(BASE); await p.waitForTimeout(500); await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400);
    for (const id of ids) { if (await p.isHidden('#add-menu')) await p.click('#add-btn');
      await p.$eval(`#add-menu [data-add="${id}"]`, e => { const d = e.closest('details'); if (d) d.open = true; });   // step 63: a product can sit under a closed heading
      await p.click(`#add-menu [data-add="${id}"]`); await p.waitForTimeout(300); }
    await p.keyboard.press('Escape'); await p.mouse.click(40, 938); await p.waitForTimeout(300);
    if (await p.isVisible('#card')) await p.click('#card [data-close]');
    await p.fill('#rate', '175'); await p.waitForTimeout(300); return p; };
  const whole = async p => { await p.evaluate(() => { const c = document.getElementById('card'); c.style.maxHeight = 'none'; c.style.overflow = 'visible'; c.style.top = '0px'; c.style.position = 'absolute';
    for (const d of c.querySelectorAll('details')) d.open = true; document.body.style.minHeight = '6000px'; }); await p.setViewportSize({width: 1500, height: 4200}); await p.waitForTimeout(300);
    // a card caught before it has painted comes out as an empty box (a few kilobytes): take it again until it has its text
    let shot = await (await p.$('#card')).screenshot();
    for (let i = 0; i < 5 && shot.length < 60000; i++) { await p.waitForTimeout(700); shot = await (await p.$('#card')).screenshot(); }
    if (shot.length < 60000) throw new Error('a card came out empty');
    const s = shot.toString('base64'); await p.setViewportSize({width: 1500, height: 1000}); return s; };
  const shots = {};
  for (const id of SIX) { const p = await open([id]); await p.click(`.node[data-p="${id}"]`); await p.waitForTimeout(500);
    if (!(await p.isVisible('#card')) || !(await p.$$('#card .ln')).length) { await p.click(`.node[data-p="${id}"]`); await p.waitForTimeout(600); }
    if (!(await p.$$('#card .ln')).length) throw new Error('no card for ' + id);
    shots[id] = await whole(p); await p.context().close(); }
  let p = await open(['fireflycp', 'aemassets', 'workfront', 'frameio']);
  shots.canvas = (await p.screenshot({clip: {x: 0, y: 0, width: 1500, height: 1000}})).toString('base64');
  await p.click('.ib[data-c="frameio-workfront"]'); await p.waitForTimeout(400); shots.conn = await whole(p); await p.context().close();
  // every connection one of the six takes part in, from the scratch catalog
  const P = Object.fromEntries(CAT.products.map(x => [x.id, x])), KIND = {native: 'Native integration', platform: 'Shared platform', extension: 'Supported extension', partner: 'Partner workflow'};
  const rows = CAT.connections.filter(c => SIX.includes(c.a) || SIX.includes(c.b)).map(c => { const six = SIX.includes(c.a) ? c.a : c.b, other = six === c.a ? c.b : c.a;
    return {six, pair: P[six].name + ' + ' + P[other].name, kind: KIND[c.kind] || c.kind, label: c.label, start: c.lines.map(l => CAT.lines[l].name), more: c.more.map(l => CAT.lines[l].name)}; })
    .sort((x, y) => SIX.indexOf(x.six) - SIX.indexOf(y.six) || x.pair.localeCompare(y.pair));
  const table = rows.map(r => `<tr><td class="pr"><b>${esc(r.pair)}</b></td><td class="kd">${esc(r.kind)}</td><td>${esc(r.label)}</td><td>${r.start.map(esc).join('<br>')}${r.more.length ? (r.start.length ? '<br>' : '') + r.more.map(n => esc(n) + ' <span class="opt">optional</span>').join('<br>') : ''}</td></tr>`).join('');
  const font = w => `@font-face{font-family:"Source Sans 3";font-weight:${w};src:url(data:font/woff2;base64,${b64(path.join(FONTS, `source-sans-3-latin-${w}-normal.woff2`))}) format("woff2")}`;
  const card = (n, id) => `<div><h2><span class="pill">${n}</span>${esc(P[id].name)}</h2><div class="frame"><img src="data:image/png;base64,${shots[id]}"></div></div>`;
  const nServices = SIX.reduce((n, id) => n + P[id].lines.length + P[id].more.length, 0), nConn = rows.reduce((n, r) => n + r.start.length + r.more.length, 0);
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${font(400)}${font(600)}${font(700)}
body{margin:0;font-family:"Source Sans 3",sans-serif;color:#1C1C1C;background:#fff}.bar{height:10px;background:#EB1000}main{padding:40px 54px 54px}
.k{font-size:17px;font-weight:700;letter-spacing:2.4px;color:#B30B00;text-transform:uppercase}h1{font-size:44px;margin:8px 0 6px}p.sub{font-size:23px;margin:0 0 30px;max-width:2000px}
.row{display:grid;grid-template-columns:repeat(4,1fr);gap:36px 40px;align-items:start;margin-bottom:44px}.pill{display:inline-block;background:#1C1C1C;color:#fff;font-weight:700;font-size:16px;letter-spacing:1.6px;border-radius:999px;padding:4px 14px;margin-right:12px;vertical-align:3px}
h2{font-size:26px;margin:0 0 12px}h3{font-size:32px;margin:0 0 14px}img{width:100%;display:block}.frame{border:2px solid #1C1C1C;border-radius:16px;padding:12px;background:#F4F4F4}
.two{display:grid;grid-template-columns:2fr 1fr;gap:40px;align-items:start;margin-bottom:44px}
table{border-collapse:collapse;width:100%;font-size:20px;line-height:27px}th{text-align:left;font-size:15px;letter-spacing:1.6px;text-transform:uppercase;padding:10px 14px;border-bottom:2px solid #1C1C1C}
td{padding:10px 14px;border-bottom:1px solid #D5D5D5;vertical-align:top}.pr{width:440px}.kd{width:210px;font-weight:600}.opt{font-size:14px;font-weight:700;border:1.5px solid #1C1C1C;border-radius:999px;padding:0 8px;margin-left:4px;white-space:nowrap}
</style></head><body><div class="bar"></div><main>
<div class="k">${BUILT ? 'As built, Nov 10 2026: step 64' : "Proposal for Adam's yes, Nov 10 2026: nothing built"}</div><h1>Wave 2: GenStudio and creative, seven products</h1>
<p class="sub">${BUILT ? 'Screens from the built tool: ' : 'Real cards, drawn on a scratch copy of the tool with the wave 2 research: '}${nServices} product services and ${nConn} connection services across ${rows.length} connections. Every service links to its Adobe page, and every quote was found on Adobe's pages on Nov 10. The numbers are hours at Typical size.</p>
<div class="row">${SIX.map((id, i) => card(i + 1, id)).join('')}</div>
<div class="two"><div><h2><span class="pill">8</span>On the canvas: Firefly Creative Production with AEM Assets, Workfront and Frame.io</h2><div class="frame"><img src="data:image/png;base64,${shots.canvas}"></div></div>
<div><h2><span class="pill">9</span>A connection card: Frame.io + Workfront</h2><div class="frame"><img src="data:image/png;base64,${shots.conn}"></div></div></div>
<h3>The ${rows.length} connections the seven bring</h3>
<table><thead><tr><th>Connection</th><th>Kind</th><th>What the card says</th><th>Services</th></tr></thead><tbody>${table}</tbody></table>
</main></body></html>`;
  if (/[–—]/.test(html.replace(/data:[^"')]+/g, ''))) throw new Error('a dash in the page');
  fs.writeFileSync(path.join(OUT, BUILT ? 'as_built_wave2.html' : 'wave2_cards_mock.html'), html);
  const q = await (await b.newContext({viewport: {width: 3200, height: 1200}, deviceScaleFactor: 1})).newPage();
  await q.setContent(html); await q.waitForTimeout(800); await q.screenshot({path: path.join(OUT, BUILT ? 'as_built_wave2.png' : 'wave2_cards.png'), fullPage: true});
  console.log('written', await q.evaluate(() => document.documentElement.scrollHeight));
  await b.close(); server.close();
})().catch(e => { console.error(e); process.exit(1); });
