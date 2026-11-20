// Step 46 checks (Nov 4 2026): the client sweep. The statement of work calls the party the Client, the canvas speaks to
// the partner about "your client", and a saved engagement still in the earlier wording takes the new wording while text
// a partner edited stays theirs. Run from the repo root after python3 sow/canvas/build.py and python3 sow/build_site.py:
//   node sow/test_step46.js
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, 'site');
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 500) + ']')); if (!c) fails++; };
const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  if (u.endsWith('/')) u += 'index.html';
  const f = path.join(SITE, u);
  if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, {'Content-Type': f.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/plain'}); fs.createReadStream(f).pipe(res);
});
// "the customer" where it means the company the partner serves (a customer ID, a client's own customers and Adobe's product names stay)
const PARTY = /\b(the|The) customer\b(?! (ID|journey|profile|does))|\bcustomer's\b|\bCustomer reviewers\b/;
(async () => {
  await new Promise(r => server.listen(0, r));
  const BASE = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch(), errs = [];
  const fresh = async () => { const p = await (await b.newContext({viewport: {width: 1600, height: 1000}})).newPage();
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); return p; };
  const toSow = async (p, play) => { await p.goto(BASE); await p.waitForTimeout(400); await p.click(`#picker [data-play="${play}"]`); await p.waitForTimeout(500); await p.fill('#rate', '150');
    await p.click('#save'); await p.waitForURL('**/sow/index.html#scope'); await p.waitForTimeout(500); };
  const docText = async p => { await p.click('[data-step="document"]'); await p.waitForTimeout(400); return p.$eval('#sow-preview', e => e.textContent); };

  // 1. every play's statement of work names the Client, never "the customer"
  for (const play of ['cja', 'commerce', 'aem', 'fsi', 'abv', 'coworker']) {
    const p = await fresh(); await toSow(p, play); const t = await docText(p);
    const scope = await p.evaluate(() => document.getElementById('scope-panel').textContent + document.getElementById('services-panel').textContent);
    ok(!PARTY.test(t) && /the Client/.test(t) && !PARTY.test(scope), `${play}: the statement of work and the Scope and Services steps say the Client, never the customer`, (t.match(/.{60}customer.{60}/) || scope.match(/.{60}customer.{60}/) || [''])[0]);
    await p.context().close();
  }

  // 2. the labels: Client and partner, Client name, the CSV's Client column
  { const p = await fresh(); await toSow(p, 'cja');
    const lab = await p.evaluate(() => ({h: [...document.querySelectorAll('#scope-panel h3')].map(h => h.textContent), field: document.querySelector('[data-meta="customer"]').closest('label').textContent.trim(), ph: document.querySelector('[data-meta="customer"]').placeholder}));
    ok(lab.h.includes('Client and partner') && lab.field === 'Client' && lab.ph === 'Client organization', 'the Scope step asks for the Client (Client and partner, Client, Client organization)', JSON.stringify(lab));
    await p.fill('[data-meta="customer"]', 'Acme Bank'); await p.waitForTimeout(200);
    ok((await docText(p)).includes('Acme Bank'), 'the client\'s name still fills the SOW (the saved field keeps its name)');
    await p.context().close(); }

  // 3. a saved engagement still in the earlier wording takes the new wording; text a partner edited stays theirs
  { const p = await fresh(); await toSow(p, 'cja'); await p.click('[data-step="services"]'); await p.waitForTimeout(300);
    const r = await p.evaluate(() => { const e = state.estimates.cja, now = e.L02.scope, old = (((PRIOR47.L02 || {}).scope || [])[0] || now).split('the Client').join('the customer');
      const known = (PRIOR46.L02 || {}).scope || [];
      e.L02.scope = old; e.C01.assumptions = 'The customer and the partner agreed this on the kickoff call.'; e.C01.scopeChanged = true; save(); return {now, old, inPrior: known.includes(old)}; });
    await p.reload(); await p.waitForTimeout(700);
    const after = await p.evaluate(() => ({l02: state.estimates.cja.L02.scope, c01: state.estimates.cja.C01.assumptions}));
    ok(r.inPrior && r.old !== r.now && after.l02 === r.now, 'a saved service still in the earlier wording ("the customer") takes the new wording ("the Client") on the next load', JSON.stringify({inPrior: r.inPrior, after: after.l02.slice(0, 120)}));
    ok(after.c01 === 'The customer and the partner agreed this on the kickoff call.', 'text a partner wrote themselves stays exactly as they wrote it', after.c01);
    await p.context().close(); }

  // 4. a saved FSI engagement on the play's earlier objective takes the new one
  { const p = await fresh(); await toSow(p, 'fsi');
    const old = 'Improve AI discovery of the agreed banking, insurance or financial-services offering, align Brand Concierge answers with customer-approved sources and disclosures, and support a measured handoff to the customer-designated team.';
    await p.evaluate(o => { state.briefs.fsi.objective = o; save(); }, old); await p.reload(); await p.waitForTimeout(700);
    const obj = await p.evaluate(() => state.briefs.fsi.objective);
    ok(obj.includes('Client-approved sources') && obj.includes('the Client-designated team'), 'a saved FSI engagement on the earlier objective takes the new one', obj);
    const resp = await p.evaluate(() => { state.responsibilities = state.responsibilities.replace(/^Client:/, 'Customer:'); save(); return state.responsibilities.slice(0, 9); });
    await p.reload(); await p.waitForTimeout(700);
    const r2 = await p.evaluate(() => state.responsibilities);
    ok(resp === 'Customer:' && r2.startsWith('Client: provide approved source material'), 'and one on the earlier default responsibilities ("Customer: provide ...") takes the new default', r2.slice(0, 60));
    await p.context().close(); }

  // 5. the canvas speaks to the partner about your client; a canvas service reaches the SOW as the Client
  { const p = await fresh(); await p.goto(BASE); await p.waitForTimeout(400); await p.click('#picker [data-play="abv"]'); await p.waitForTimeout(500);
    await p.click('.ib[data-c="cdn-bv"]'); await p.waitForTimeout(400);
    const card = await p.$eval('#card', e => e.textContent);
    ok(!PARTY.test(card) && /your client/i.test(card), 'the CDN card says your client (step 45 flagged it)', (card.match(/.{50}customer.{50}/) || [''])[0]);
    await p.click('#card [data-close]'); await p.waitForTimeout(200);
    await p.dblclick('.node[data-p="cdn"]'); await p.waitForTimeout(400);
    const oc = await p.$eval('#card', e => e.textContent);
    ok(!PARTY.test(oc) && oc.includes('A system your client runs outside Adobe') && oc.includes('lightning bolt'), 'the outside system card says your client and points to the lightning bolt', oc.slice(0, 200));
    await p.context().close(); }
  { const p = await fresh(); await p.goto(BASE); await p.waitForTimeout(400); await p.click('#picker [data-play="cja"]'); await p.waitForTimeout(500); await p.fill('#rate', '150');
    // Nov 18 2026: BI tools start on the CJA canvas, as every system the play offers does
    await p.click('#save'); await p.waitForURL('**/sow/index.html#scope'); await p.waitForTimeout(500);
    const c = await p.evaluate(() => { const x = state.canvas.find(l => l.id === 'CANVAS-BI2'); return x ? {name: x.name, a: x.assumptions} : null; });
    ok(c && c.name === "Executive dashboards in the Client's BI tool" && /Assumes the Client has CJA Select or higher\./.test(c.a) && !/your client|upsell/i.test(c.name + c.a),
      'a canvas service reaches the SOW steps saying the Client, with the package it needs as an assumption and no upsell note', JSON.stringify(c));
    await p.context().close(); }

  // 6. the built pages: no "the customer" left where it means the client, outside the earlier-wording records
  { const sow = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8').replace(/const (PRIOR\w*|PREVIOUS_SCOPES)=.*?;\n/gs, '').replace(/if\(p==='fsi'&&b\.objective==='[^']*'\)/g, '');
    const cat = JSON.parse(sow.match(/<script>const CATALOG=(\[.*?\]);<\/script>/s)[1]);
    const strip = o => JSON.stringify(o, (k, v) => ['source', 'source2', 'sourceTitle', 'sourceTitle2'].includes(k) ? undefined : v);
    const left = (strip(cat).match(/.{40}\b(the|The) customer\b(?! ID).{40}/g) || []);
    ok(!left.length, 'the SOW catalog says the Client everywhere it means the client', left.join(' | ')); }

  ok(!errs.length, 'no script errors', errs.join(' | '));
  await b.close(); server.close();
  console.log(fails ? `${fails} STEP 46 CHECK(S) FAILED` : 'ALL STEP 46 CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})();
