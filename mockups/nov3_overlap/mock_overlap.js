// Mockup for Adam: "counted once" as built (step 27) next to the proposed overlap review, on the CJA play at $150 an
// hour, Typical, with a data warehouse, cloud storage and a CRM, and CJA data preparation in Experience Platform on.
// "Today" is the built site (sow/site/); "Proposed" is a scratch copy with the covering switched off and the canvas
// note the proposal would add drawn in. Nothing in the repo changes. Run from the repo root:
//   NODE_PATH=/opt/node-tools/node_modules node sow/mockups/nov3_overlap/mock_overlap.js
const {chromium} = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const OUT = __dirname, SRC = path.join(__dirname, '..', '..', 'site'), TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'overlap-'));
const PROP = path.join(TMP, 'proposed');
fs.cpSync(SRC, PROP, {recursive: true});
let t = fs.readFileSync(path.join(PROP, 'index.html'), 'utf8');
const COVER = "(!!COVER[l]&&!st.keep[l]&&!!LN[COVER[l]]&&has('cja')&&counted(COVER[l]))";
if (t.split(COVER).length !== 2) throw new Error('the covering clause was not found once');
t = t.replace(COVER, 'false'); fs.writeFileSync(path.join(PROP, 'index.html'), t);
const NOTE = 'Overlaps with CJA data preparation, which is on. The SOW asks how they differ.';
const serve = dir => http.createServer((req, res) => { let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (u.endsWith('/')) u += 'index.html'; const f = path.join(dir, u);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; } res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); fs.createReadStream(f).pipe(res); });
const TERMS = 'Time and materials, invoiced monthly in arrears; five business days to review each deliverable; customer dependencies due within ten business days; pause and restart on two weeks notice; changes by written change order under the master services agreement.';
(async () => {
  const b = await chromium.launch(), rep = {};
  for (const [name, dir] of [['today', SRC], ['proposed', PROP]]) {
    const srv = serve(dir); await new Promise(r => srv.listen(0, r)); const BASE = `http://localhost:${srv.address().port}/`;
    const p = await (await b.newContext({viewport: {width: 1440, height: 900}, deviceScaleFactor: 2})).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(BASE); await p.waitForTimeout(300); await p.click('#picker [data-play="cja"]'); await p.waitForTimeout(400); await p.fill('#rate', '150'); await p.evaluate(() => document.activeElement.blur());
    for (const id of ['dwh', 'cstore', 'crm']) { await p.click('#out-btn'); await p.waitForTimeout(150); await p.click(`#out-menu [data-out="${id}"]`); await p.waitForTimeout(450); }
    await p.mouse.move(3, 3); await p.waitForTimeout(300); rep[name + '_before'] = (await p.textContent('#t-big')).trim();
    await p.evaluate(() => document.querySelector('.node[data-p="cja"]').click()); await p.waitForTimeout(400);
    for (const d of await p.$$('#card details:not([open]) > summary')) await d.click(); await p.click('#card [data-t="CJ01"]'); await p.waitForTimeout(300); await p.evaluate(() => hideCard(true));
    await p.mouse.move(3, 3); await p.waitForTimeout(300); rep[name + '_after'] = (await p.textContent('#t-big')).trim();
    const tb = await (await p.$('.total')).boundingBox(); await p.screenshot({path: path.join(OUT, `${name}_total.png`), clip: {x: tb.x - 12, y: tb.y - 12, width: tb.width + 24, height: tb.height + 24}});
    await p.setViewportSize({width: 1440, height: 2200}); await p.addStyleTag({content: '#card{max-height:none!important}'});
    await p.evaluate(() => document.querySelector('.ib[data-c="dwh-cja"]').click()); await p.waitForTimeout(500);
    for (const d of await p.$$('#card details:not([open]) > summary')) await d.click(); await p.waitForTimeout(200);
    if (name === 'proposed') await p.evaluate(n => { const nm = document.querySelector('#card .ln[data-l="OX3"] .nm'); const s = document.createElement('span'); s.className = 'rep'; s.textContent = n; nm.appendChild(s); }, NOTE);
    const sec = await p.evaluateHandle(() => { const h = [...document.querySelectorAll('#card .sec')].find(x => /Services on this connection/i.test(x.textContent)); return h; });
    const cb = await (await p.$('#card')).boundingBox(), sb = await sec.boundingBox();
    await p.screenshot({path: path.join(OUT, `${name}_card.png`), clip: {x: cb.x, y: sb.y - 14, width: cb.width, height: cb.y + cb.height - sb.y + 14}});
    await p.evaluate(() => hideCard(true)); await p.setViewportSize({width: 1440, height: 900});
    await p.click('#save'); await p.waitForURL('**/sow/#scope'); await p.waitForTimeout(400);
    await p.evaluate(t => { state.terms = t; const r = state.estimates.cja['CANVAS-CJ01']; r.scope += ' 2 schemas and 4 datasets for web and app data.'; r.deliverable = 'Schemas, datasets and ingestion for the two agreed channels.';
      r.acceptance = 'All 4 datasets ingest daily for 7 days with no failed runs.'; r.assumptions = (r.assumptions || '') + ' The customer confirmed the sandbox and both channels at kickoff.'; save(); }, TERMS);
    await p.click('[data-step="document"]'); await p.waitForTimeout(400);
    rep[name + '_sow'] = (await p.$$eval('.total-card strong', e => e.map(x => x.textContent.trim())))[2];
    rep[name + '_issues'] = await p.evaluate(() => issues());
    const rb = await p.$('#readiness'); if (rb && await rb.isVisible()) await rb.screenshot({path: path.join(OUT, `${name}_readiness.png`)});
    rep[name + '_errors'] = errs; await p.context().close(); srv.close();
  }
  fs.writeFileSync(path.join(OUT, 'numbers.json'), JSON.stringify(rep, null, 1) + '\n'); console.log(JSON.stringify(rep, null, 1)); await b.close();
})();
