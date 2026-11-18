// One picture for Adam: where the "Coworker evidence" page sits in his Partner growth brief (the business-case website).
// Left: the brief's first page with the new menu entry marked. Right: the page that entry opens.
// Run: node where_it_lives.js <folder with the brief and the two added pages> <output png>
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.resolve(process.argv[2]), OUT = path.resolve(process.argv[3]);
const T = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml', '.csv': 'text/csv' };
const srv = http.createServer((q, s) => {
  let u = decodeURIComponent(q.url.split('?')[0].split('#')[0]);
  if (u.endsWith('/')) u += 'index.html';
  const f = path.join(SITE, u);
  if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end(); }
  s.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'text/plain' });
  fs.createReadStream(f).pipe(s);
});
const MARK = `
a[href$="coworker-evidence.html"]{outline:3px solid #EB1000!important;outline-offset:3px;border-radius:6px;position:relative}
.wil-tag{position:fixed;z-index:99999;background:#EB1000;color:#fff;font:700 15px/1.3 system-ui,sans-serif;padding:8px 12px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.25);max-width:250px}
`;
(async () => {
  await new Promise(r => srv.listen(0, r));
  const base = 'http://localhost:' + srv.address().port + '/';
  const b = await chromium.launch();
  async function grab(url, tag) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 2 });
    const p = await ctx.newPage();
    await p.goto(base + url);
    await p.waitForTimeout(900);
    await p.addStyleTag({ content: MARK });
    await p.evaluate(t => {
      const a = document.querySelector('a[href$="coworker-evidence.html"]');
      if (!a) return;
      a.scrollIntoView({ block: 'center' });
      window.scrollTo({ top: 0, behavior: 'instant' });
      const r = a.getBoundingClientRect(), d = document.createElement('div');
      d.className = 'wil-tag'; d.textContent = t;
      d.style.left = Math.round(r.right + 16) + 'px'; d.style.top = Math.round(r.top - 6) + 'px';
      document.body.appendChild(d);
    }, tag);
    await p.waitForTimeout(200);
    const buf = await p.screenshot();
    await ctx.close();
    return buf.toString('base64');
  }
  const one = await grab('index.html', 'New menu entry: Coworker evidence');
  const two = await grab('coworker-evidence.html', 'You are here');
  const ctx = await b.newContext({ viewport: { width: 2000, height: 900 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.setContent(`<body style="margin:0;padding:28px;background:#fff;font-family:system-ui,sans-serif;color:#1c1c1c">
  <h1 style="font-size:26px;margin:0 0 6px">Where the Coworker evidence page lives</h1>
  <p style="font-size:16px;margin:0 0 20px;color:#4a4a4a">It is one page inside your Partner growth brief (the business-case website). Nothing about it is in the SOW tool.</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:26px">
    <div><h2 style="font-size:18px;margin:0 0 8px">1. Your brief, first page. The menu has one new entry.</h2><img src="data:image/png;base64,${one}" style="width:100%;border:1px solid #cfcfcf;border-radius:8px"></div>
    <div><h2 style="font-size:18px;margin:0 0 8px">2. Click it and this page opens: every Coworker service with its Adobe source.</h2><img src="data:image/png;base64,${two}" style="width:100%;border:1px solid #cfcfcf;border-radius:8px"></div>
  </div></body>`);
  await p.waitForTimeout(400);
  await (await p.$('body')).screenshot({ path: OUT });
  await b.close(); srv.close();
  console.log('wrote', OUT);
})().catch(e => { console.error(e); process.exit(1); });
