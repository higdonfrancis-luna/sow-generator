// One picture for Adam: where a ready-made play's name shows today (Build canvas and the SOW steps), and whether
// the statement of work itself carries it. Nothing in the tool changes. Run: node play_name_where.js <output png>
const R = require('path').resolve(__dirname, '..', '..', '..', '..');
const OUT = require('path').resolve(process.argv[2]);
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = R + '/site';
const T = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml' };
const srv = http.createServer((q, s) => {
  let u = decodeURIComponent(q.url.split('?')[0].split('#')[0]);
  if (u.endsWith('/')) u += 'index.html';
  const f = path.join(SITE, u);
  if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end(); }
  s.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'text/plain' });
  fs.createReadStream(f).pipe(s);
});
const NAME = 'Brand Visibility + Customer Journey Analytics';
(async () => {
  await new Promise(r => srv.listen(0, r));
  const base = 'http://localhost:' + srv.address().port + '/';
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 760 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto(base);
  await p.waitForTimeout(500);
  await p.click('#picker [data-play="cja"]');
  await p.waitForTimeout(800);
  await p.addStyleTag({ content: '#playname{outline:3px solid #EB1000;outline-offset:4px;border-radius:8px}' });
  const one = (await p.screenshot()).toString('base64');
  await p.click('.tabs button[data-tab="scope"]');
  await p.waitForTimeout(1200);
  const title = await p.evaluate(() => (document.getElementById('play-title') || {}).textContent);
  await p.addStyleTag({ content: '#play-title{outline:3px solid #EB1000;outline-offset:6px;border-radius:8px}' });
  await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  const two = (await p.screenshot()).toString('base64');
  // the statement of work itself: does its text carry the play's name as a title?
  await p.evaluate(() => { location.hash = '#document'; });
  await p.waitForTimeout(1500);
  const doc = await p.evaluate(n => {
    const el = document.querySelector('#doc, #document, .doc, .sow-doc, [id*="preview"]') || document.body;
    const t = el.innerText;
    return { hasName: t.includes(n), where: el.id || el.className, h: [...document.querySelectorAll('h1,h2')].filter(x => x.offsetParent).slice(0, 8).map(x => x.textContent.trim().slice(0, 90)) };
  }, NAME);
  console.log('SOW steps heading:', JSON.stringify(title), '| document view:', JSON.stringify(doc));
  const c2 = await b.newContext({ viewport: { width: 2000, height: 760 }, deviceScaleFactor: 2 });
  const q = await c2.newPage();
  await q.setContent(`<body style="margin:0;padding:28px;background:#fff;font-family:system-ui,sans-serif;color:#1c1c1c">
  <h1 style="font-size:26px;margin:0 0 6px">Where a play's name shows today</h1>
  <p style="font-size:16px;margin:0 0 20px;color:#4a4a4a">Two places, both marked in red. It is a label for the partner, at the top of the screen.</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:26px">
    <div><h2 style="font-size:18px;margin:0 0 8px">1. Top of the Build canvas</h2><img src="data:image/png;base64,${one}" style="width:100%;border:1px solid #cfcfcf;border-radius:8px"></div>
    <div><h2 style="font-size:18px;margin:0 0 8px">2. Top of the SOW steps (Scope, Services, SOW)</h2><img src="data:image/png;base64,${two}" style="width:100%;border:1px solid #cfcfcf;border-radius:8px"></div>
  </div></body>`);
  await q.waitForTimeout(400);
  const h = await q.evaluate(() => document.body.scrollHeight);
  await q.screenshot({ path: OUT, clip: { x: 0, y: 0, width: 2000, height: h } });
  await b.close(); srv.close();
  console.log('wrote', OUT);
})().catch(e => { console.error(e); process.exit(1); });
