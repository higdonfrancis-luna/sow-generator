// Before and after pictures of the two things the canvas now shows (step 17): the note under the total about services
// added on the Services step, and why a line differs on its card. "Before" is the site at a given commit (default
// 1fbeec6, the reviewed bundle); "after" is sow/site/. Run from the repo root after build_site.py:
//   NODE_PATH=/opt/node-tools/node_modules node sow/review_2026-11-02/mockups/shoot.js [commit]
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os'), {execSync} = require('child_process');
const OUT = __dirname, COMMIT = process.argv[2] || '1fbeec6';
const before = fs.mkdtempSync(path.join(os.tmpdir(), 'before-')); fs.mkdirSync(path.join(before, 'sow'));
for (const f of ['index.html', 'sow/index.html']) fs.writeFileSync(path.join(before, f), execSync(`git show ${COMMIT}:sow/site/${f}`, {maxBuffer: 1 << 26}));
const serve = dir => new Promise(r => { const s = http.createServer((req, res) => { let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (u.endsWith('/')) u += 'index.html';
  const f = path.join(dir, u); if (!fs.existsSync(f)) { res.writeHead(404); res.end(); return; } res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); fs.createReadStream(f).pipe(res); }); s.listen(0, () => r(s)); });
(async () => {
  const b = await chromium.launch(), shots = {};
  for (const [name, dir] of [['before', before], ['after', path.resolve('sow/site')]]) {
    const s = await serve(dir), BASE = `http://localhost:${s.address().port}/`;
    const ctx = await b.newContext({viewport: {width: 1500, height: 900}, deviceScaleFactor: 2}), p = await ctx.newPage();
    await p.goto(BASE); await p.waitForTimeout(400); await p.click('#picker [data-play="abv"]'); await p.waitForTimeout(500); await p.fill('#rate', '150');
    await p.click('#save'); await p.waitForURL('**/sow/#scope'); await p.waitForTimeout(400);
    await p.fill('[data-cover="promptCount"]', '100'); await p.waitForTimeout(150);
    await p.click('[data-step="services"]'); await p.waitForTimeout(300);
    for (const id of ['L03', 'X01']) { await p.click('#add-service'); await p.waitForTimeout(150); await p.click(`#available-services [data-add="${id}"]`); await p.waitForTimeout(150); await p.click('#close-modal'); await p.waitForTimeout(150); }
    await p.selectOption('.service-card[data-line="O02"] [data-line-field="band"]', 'small'); await p.waitForTimeout(150);
    shots[name + 'Sow'] = (await p.$$eval('.total-card strong', e => e.map(x => x.textContent.trim())))[2];
    await p.click('.steps [data-build]'); await p.waitForURL(BASE); await p.waitForTimeout(600);
    shots[name + 'Total'] = (await (await p.$('.total')).screenshot()).toString('base64');
    await p.click('.node[data-p="bv"]'); await p.waitForTimeout(500);
    shots[name + 'Card'] = (await (await p.$('#card')).screenshot()).toString('base64');
    await ctx.close(); s.close();
  }
  const img = k => `<img src="data:image/png;base64,${shots[k]}">`;
  const board = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;background:#fff;font:16px/1.4 'Source Sans 3',Arial,sans-serif;color:#1c1c1c;padding:28px 32px}
    h1{font-size:24px;margin:0 0 6px}p.k{margin:0 0 22px;font-size:16px}h2{font-size:18px;margin:26px 0 10px;color:#EB1000}
    .row{display:flex;gap:28px;align-items:flex-start}.col{flex:1}.col b{display:block;margin-bottom:8px;font-size:16px}
    img{width:100%;border:1px solid #d9d9d9;border-radius:6px}.cards img{width:auto;max-width:100%;height:520px;object-fit:cover;object-position:top}
  </style></head><body>
  <h1>Build canvas: one total with the Services step (step 17, November 2)</h1>
  <p class="k">Brand Visibility on its own at $150 an hour: 100 prompts on Scope; on Services the deployment pilot and executive alignment added and the content line set to Small. The Services step shows ${shots.afterSow}.</p>
  <h2>The total</h2><div class="row"><div class="col"><b>Before: ${'$'}210,000 on Build, ${shots.beforeSow} on Services</b>${img('beforeTotal')}</div><div class="col"><b>After: the same total, and it says what it includes</b>${img('afterTotal')}</div></div>
  <h2>The Brand Visibility card</h2><div class="row cards"><div class="col"><b>Before: the delivery size's hours</b>${img('beforeCard')}</div><div class="col"><b>After: each line's own hours, and why</b>${img('afterCard')}</div></div>
  </body></html>`;
  const ctx = await b.newContext({viewport: {width: 1500, height: 900}, deviceScaleFactor: 1}), p = await ctx.newPage();
  await p.setContent(board); await p.waitForTimeout(300);
  await p.screenshot({path: path.join(OUT, 'canvas_one_total_before_after.png'), fullPage: true});
  await b.close(); fs.rmSync(before, {recursive: true}); console.log('wrote canvas_one_total_before_after.png', shots.beforeSow, shots.afterSow);
})();
