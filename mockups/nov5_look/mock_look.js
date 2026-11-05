// Mockup (Nov 5 2026, Adam: "source sans 3 font and rounded boxes instead of boxes made up of right angles"): the site
// as it is (before) and with the change injected at runtime (after): Source Sans 3 loaded on the SOW steps too (they
// asked for it but never loaded it, so most screens showed Arial), and rounder corners on boxes, cards, buttons, fields
// and tags. Nothing built.   node sow/mockups/nov5_look/mock_look.js <site dir>
const {chromium} = require('playwright'), path = require('path'), fs = require('fs'), http = require('http');
const SITE = process.argv[2], OUT = __dirname, FONTS = path.join(__dirname, '..', '..', '..', 'video', 'fonts');
const b64 = w => fs.readFileSync(path.join(FONTS, `source-sans-3-latin-${w}-normal.woff2`)).toString('base64');
const FACE = [400, 600, 700].map(w => `@font-face{font-family:'Source Sans 3';font-weight:${w};font-display:block;src:url(data:font/woff2;base64,${b64(w)}) format('woff2')}`).join('');
function round() {
  for (const e of document.querySelectorAll('body *')) {
    if (e.closest('svg')) continue;
    const cs = getComputedStyle(e), r = e.getBoundingClientRect(), rad = parseFloat(cs.borderTopLeftRadius) || 0;
    const boxed = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderLeftWidth) > 0 || (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent');
    if (!boxed || rad >= 40 || cs.borderRadius.includes('%') || r.width < 6 || e === document.body) continue;
    const tag = e.tagName;
    if (r.height <= 30 && r.width < 320 && tag !== 'INPUT') e.style.borderRadius = '999px';            // tags and chips: pills
    else if (r.width > 120 && r.height > 60) e.style.borderRadius = '18px';                                  // boxes and cards (play cards too)
    else e.style.borderRadius = '12px';                                                                       // buttons, fields, small boxes
  }
}
(async () => {
  const srv = http.createServer((q, s) => { let u = decodeURIComponent(q.url.split('?')[0].split('#')[0]); if (u.endsWith('/')) u += 'index.html'; const f = path.join(SITE, u);
    if (!fs.existsSync(f)) { s.writeHead(404); s.end(); return; } s.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); fs.createReadStream(f).pipe(s); });
  await new Promise(r => srv.listen(0, r)); const BASE = `http://localhost:${srv.address().port}/`;
  const b = await chromium.launch();
  for (const after of [false, true]) {
    const tag = after ? 'after' : 'before';
    const ctx = await b.newContext({viewport: {width: 1440, height: 900}, deviceScaleFactor: 2}); const p = await ctx.newPage();
    const look = async () => { if (!after) return; await p.addStyleTag({content: FACE}); await p.evaluate(() => document.fonts.ready); await p.evaluate(`(${round})()`); await p.waitForTimeout(300); };
    await p.goto(BASE); await p.waitForTimeout(500); await look(); await p.screenshot({path: path.join(OUT, `look_${tag}_1_picker.png`)});
    await p.click('#picker [data-play="cja"]'); await p.waitForTimeout(600); await p.fill('#rate', '150'); await p.waitForTimeout(200);
    await p.click('.ib[data-c="cdn-bv"]'); await p.waitForTimeout(500); await look(); await p.screenshot({path: path.join(OUT, `look_${tag}_2_canvas.png`)});
    await p.click('#card [data-close]'); await p.click('#save'); await p.waitForURL('**/sow/index.html#scope'); await p.waitForTimeout(600); await look();
    await p.screenshot({path: path.join(OUT, `look_${tag}_3_scope.png`)});
    await p.click('[data-step="services"]'); await p.waitForTimeout(500); await look(); await p.screenshot({path: path.join(OUT, `look_${tag}_4_services.png`)});
    await ctx.close();
  }
  await b.close(); srv.close();
})();
