// Step 45 checks (Nov 4 2026): the outside systems checked live, AEM Assets on the AEM play, the CDN on from the start,
// the Recommended and Needs [package] tags, and the canvas and the SOW steps agreeing on every total. Run from the repo
// root after python3 sow/canvas/build.py and python3 sow/build_site.py:
//   node sow/test_step45.js
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
(async () => {
  await new Promise(r => server.listen(0, r));
  const BASE = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch(), errs = [];
  const fresh = async () => { const p = await (await b.newContext({viewport: {width: 1600, height: 1000}})).newPage();
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); return p; };
  const canvasTotal = async p => (await p.textContent('#t-big')).trim();
  const toolTotal = async p => (await p.$$eval('.total-card strong', e => e.map(x => x.textContent.trim())))[2];
  const pick = async (p, play) => { await p.goto(BASE); await p.waitForTimeout(400); await p.click(`#picker [data-play="${play}"]`); await p.waitForTimeout(500); await p.fill('#rate', '150'); await p.waitForTimeout(200); };
  // a canvas set up directly (the play, its products and outside systems), then reloaded
  const setup = async (p, s) => { await p.goto(BASE); await p.evaluate(s => localStorage.setItem('abv-sow-build-v1', JSON.stringify({v: 2, rate: 150, ...s})), s); await p.reload(); await p.waitForTimeout(700); };
  const toServices = async p => { await p.click('#save'); await p.waitForURL('**/sow/index.html#scope'); await p.waitForTimeout(500); await p.click('[data-step="services"]'); await p.waitForTimeout(400); };
  const back = async p => { await p.click('.steps [data-build]'); await p.waitForURL(u => !/\/sow\//.test(String(u))); await p.waitForTimeout(600); };
  const boxes = async p => p.$$eval('.node', ns => ns.map(n => n.dataset.p).sort().join(','));

  // 1. every Brand Visibility play starts with the CDN and CDN log forwarding, and Services totals the same
  for (const play of ['cja', 'commerce', 'aem', 'fsi', 'abv']) {
    const p = await fresh(); await pick(p, play);
    const st = await p.evaluate(() => ({out: st.out, ox1: counted('OX1'), ox2: counted('OX2'), rec: !!document.querySelector('.node[data-p="cdn"] .rec')}));
    const t0 = await canvasTotal(p); await toServices(p); const t1 = await toolTotal(p);
    const lines = await p.$$eval('.service-card', e => e.map(x => x.dataset.line));
    ok(JSON.stringify(st.out) === '["cdn"]' && st.ox1 && !st.ox2 && st.rec && t0 === t1 && lines.some(l => /OX1$/.test(l)),
      `${play}: the CDN starts on, tagged Recommended, with CDN log forwarding on (the log export optional), and Services totals the same (${t0})`, JSON.stringify({st, t0, t1}));
    await p.context().close();
  }

  // 2. taking the CDN off takes CDN log forwarding off on both pages
  { const p = await fresh(); await pick(p, 'abv'); const t0 = await canvasTotal(p);
    await p.click('.node[data-p="cdn"]'); await p.waitForTimeout(400); await p.click('#card [data-rmout="cdn"]'); await p.waitForTimeout(400);
    const t1 = await canvasTotal(p); await toServices(p); const t2 = await toolTotal(p);
    ok(t0 === '$212,400' && t1 === '$210,000' && t2 === t1, 'Brand Visibility on its own: the CDN off takes its $2,400 off, on the canvas and on Services', JSON.stringify({t0, t1, t2}));
    await back(p); ok((await boxes(p)) === 'bv', 'and back on Build the CDN stays off');
    await p.context().close(); }

  // 3. the AEM play: Add outside system, Recommended on Search data. Step 96 (Adam, Nov 14): a built play offers outside systems only, so
  // AEM Assets is no longer offered; a saved draft that already has it keeps it, with its services and Remove from canvas
  { const p = await fresh(); await pick(p, 'aem');
    ok((await p.textContent('#out-btn')).trim() === 'Add outside system', 'the AEM play\'s button says Add outside system');
    await p.click('#out-btn'); await p.waitForTimeout(250);
    const m = await p.evaluate(() => ({k: document.querySelector('#out-menu .hd .k').textContent, sub: document.querySelector('#out-menu .hd p').textContent, g: [...document.querySelectorAll('#out-menu .g')].map(x => x.textContent),
      items: [...document.querySelectorAll('#out-menu [data-out]')].map(x => x.dataset.out), rec: [...document.querySelectorAll('#out-menu [data-out] .rec')].map(x => x.closest('[data-out]').dataset.out)}));
    ok(m.k === 'Add an outside system' && /your client/.test(m.sub) && !/customer|Adobe products/.test(m.sub) && m.g.join('|') === 'Connects to this play' && m.items.join() === 'search,csrc,chatgpt,claude' && m.rec.join() === 'search',
      'its menu: your client\'s systems only (Search data tagged Recommended, Authoring documents, and since Nov 18 ChatGPT and Claude for Edge Delivery Services, with no tag), and no Adobe product', JSON.stringify(m));
    await p.evaluate(() => addOutside('aemassets')); await p.waitForTimeout(300);
    ok(!(await p.$('.node[data-p="aemassets"]')), 'AEM Assets cannot be added to the AEM play');
    await p.click('#out-menu [data-out="csrc"]'); await p.waitForTimeout(400);
    // The reviewed canvas (19b0363, Page authoring): on a quote started in this build, Authoring documents brings its setup (CS1) and
    // offers the Sites Optimizer write-back (CS2) on its card instead of including it, because document setup does not show that
    // the client owns Sites Optimizer Ultimate. One click adds it, at its $1,200
    { const n0 = await canvasTotal(p); await p.click('.ib[data-c="csrc-so"]'); await p.waitForTimeout(400);
      const row = () => p.evaluate(() => { const r = document.querySelector('#card .ln[data-l="CS2"]'); return {docs: document.querySelector('.node[data-p="csrc"]').classList.contains('out'), cs1: counted('CS1'), cs2: counted('CS2'),
        off: r.classList.contains('off'), fee: r.querySelector('.fee').textContent, btn: r.querySelector('.tg').getAttribute('aria-label'), tier: r.querySelector('.tier').textContent}; });
      const r0 = await row(); await p.click('#card .ln[data-l="CS2"] .tg'); await p.waitForTimeout(400); const r1 = await row(), n1 = await canvasTotal(p);
      await p.click('#card [data-close]'); await p.waitForTimeout(200);
      // and the draft this build saved of that canvas reloads the same: Authoring documents an outside system, connected, both services on
      await p.reload(); await p.waitForTimeout(700);
      const r2 = await p.evaluate(() => ({docs: document.querySelector('.node[data-p="csrc"]').classList.contains('out'), edges: [...document.querySelectorAll('path.edge')].map(e => e.dataset.c).sort().join(','), cs1: counted('CS1'), cs2: counted('CS2')})), n2 = await canvasTotal(p);
      ok(n0 === '$489,600' && r0.docs && r0.cs1 && !r0.cs2 && r0.off && r0.fee === 'Not selected' && r0.btn === 'Add Sites Optimizer write-back to SharePoint or Google Drive' && r0.tier === 'Needs Sites Optimizer Ultimate'
        && n1 === '$490,800' && r1.cs1 && r1.cs2 && !r1.off && r1.fee === '$1,200' && r1.btn === 'Remove Sites Optimizer write-back to SharePoint or Google Drive'
        && n2 === '$490,800' && r2.docs && r2.edges === 'bv-eds,cdn-bv,csrc-eds,csrc-so,so-eds' && r2.cs1 && r2.cs2,
        'on a new quote Authoring documents brings its setup ($489,600) and offers the write-back, tagged Needs Sites Optimizer Ultimate, to add ($490,800 with it); a reload keeps both', JSON.stringify({n0, n1, n2, r2, r0, r1})); }
    // a saved draft from before step 96 with AEM Assets on its canvas, as the build before the Page authoring choice stored it (no
    // Page authoring answer): it reopens with Authoring documents' two services on, at the $555,600 it was saved with
    await p.evaluate(() => { localStorage.clear(); localStorage.setItem('abv-sow-build-v1', JSON.stringify({play: 'aem', on: [], out: ['cdn', 'csrc', 'aemassets'], ls: {}, keep: {}, rate: 150, size: 'typical', months: 12, v: 2, eff: null, fresh: true, cur: 'USD', def: null})); });
    await p.reload(); await p.waitForTimeout(700);
    const look = await p.evaluate(() => ({assets: !document.querySelector('.node[data-p="aemassets"]').classList.contains('out'), docs: document.querySelector('.node[data-p="csrc"]').classList.contains('out'),
      edges: [...document.querySelectorAll('path.edge')].map(e => e.dataset.c).sort().join(','), axd05: counted('AXD05'), cs1: counted('CS1'), cs2: counted('CS2')}));
    ok(look.assets && look.docs && look.edges === 'aemassets-eds,bv-eds,cdn-bv,csrc-eds,csrc-so,so-eds' && look.axd05 && look.cs1 && look.cs2,
      'a saved draft\'s AEM Assets draws as an Adobe product and Authoring documents as an outside system, each connected with its services on', JSON.stringify(look));
    await p.click('.ib[data-c="csrc-so"]'); await p.waitForTimeout(400);
    const card = await p.evaluate(() => ({tier: document.querySelector('#card .tierp') && document.querySelector('#card .tierp').textContent, row: document.querySelector('#card .ln[data-l="CS2"] .tier') && document.querySelector('#card .ln[data-l="CS2"] .tier').textContent}));
    ok(card.tier === "Needs Sites Optimizer UltimateCheck what your client owns. If they don't have it, it's an upsell for Adobe." && card.row === 'Needs Sites Optimizer Ultimate',
      'the write-back card and its service say Needs Sites Optimizer Ultimate, with the check and the upsell', JSON.stringify(card));
    await p.click('#card [data-close]'); await p.waitForTimeout(200);
    await p.click('.node[data-p="aemassets"]'); await p.waitForTimeout(400);
    ok(!!(await p.$('#card [data-rmout="aemassets"]')), 'the saved AEM Assets\' card has Remove from canvas');
    await p.click('#card [data-close]'); await p.waitForTimeout(200);
    const t0 = await canvasTotal(p); await toServices(p); const t1 = await toolTotal(p);
    const lines = await p.$$eval('.service-card', e => e.map(x => x.dataset.line));
    ok(t0 === '$555,600' && t0 === t1 && ['AXD05', 'CS1', 'CS2'].every(l => lines.some(x => x.endsWith(l))), `AEM Assets and Authoring documents reach Services with their services, at the total the draft was saved with (${t0})`, JSON.stringify({t0, t1}));
    const pre = await p.evaluate(() => (state.canvas.find(c => c.id === 'CANVAS-CS2') || {}).assumptions || '');
    ok(pre.includes('Assumes the Client has Sites Optimizer Ultimate.') && !/upsell|your client/.test(pre), 'the package it needs rides along to the SOW steps as an assumption the SOW can print (step 46: no upsell note, "the Client")', pre);
    await back(p);
    ok((await boxes(p)) === 'aemassets,bv,cdn,csrc,eds,so' && await canvasTotal(p) === t0, 'and back on Build both are still there, at the same total', await boxes(p));
    await p.reload(); await p.waitForTimeout(700);
    ok((await boxes(p)) === 'aemassets,bv,cdn,csrc,eds,so', 'a reload keeps AEM Assets on the canvas', await boxes(p));
    await p.click('.node[data-p="aemassets"]'); await p.waitForTimeout(400); await p.click('#card [data-rmout="aemassets"]'); await p.waitForTimeout(400);
    ok((await boxes(p)) === 'bv,cdn,csrc,eds,so' && !(await p.evaluate(() => [...prods(), ...conns()].some(o => all(o).includes('AXD05')))) && await canvasTotal(p) !== t0, 'Remove from canvas takes AEM Assets and its services off the canvas and the total');
    await p.click('#out-btn'); await p.waitForTimeout(250);
    ok(!(await p.$('#out-menu [data-out="aemassets"]')), 'and once removed, it is not offered again');
    await p.context().close(); }

  // 4. the CJA play: Ad platforms and BI tools, with their tags and the totals on both pages
  { const p = await fresh(); await pick(p, 'cja');
    ok((await p.textContent('#out-btn')).trim() === 'Add outside system', 'plays without an Adobe add-on keep Add outside system');
    for (const id of ['ads', 'bi', 'search']) { await p.click('#out-btn'); await p.waitForTimeout(200); await p.click(`#out-menu [data-out="${id}"]`); await p.waitForTimeout(350); }
    await p.click('.ib[data-c="cja-bi"]'); await p.waitForTimeout(400);
    const bi = await p.evaluate(() => document.querySelector('#card .tierp').textContent);
    ok(bi.startsWith('Needs CJA Select or higher for the BI extension (Report Builder comes with every CJA package)'), 'the BI tools card scopes CJA Select to the BI extension', bi);
    await p.click('#card [data-close]'); await p.waitForTimeout(200);
    await p.click('.ib[data-c="ads-cja"]'); await p.waitForTimeout(400);
    const ad = await p.evaluate(() => ({t: document.getElementById('card').textContent, tag: document.querySelector('#card .ln[data-l="AD2"] .tier').textContent}));
    ok(ad.tag === 'Needs CJA Select or higher' && ad.t.includes('Sending CJA audiences back out to ad platforms needs Real-Time CDP'), 'the ad platforms card: the join needs CJA Select, and audiences out need Real-Time CDP', ad.t.slice(0, 300));
    await p.click('#card [data-close]'); await p.waitForTimeout(200);
    const t0 = await canvasTotal(p); await toServices(p); const t1 = await toolTotal(p);
    ok(t0 === '$243,600' && t1 === t0, 'CJA with the CDN, ad platforms, BI tools and search data: $243,600 on both pages ($222,000 + $9,600 + $10,800 + $1,200)', JSON.stringify({t0, t1}));
    await back(p); ok((await boxes(p)) === 'ads,bi,bv,cdn,cja,search', 'back on Build every system is still there', await boxes(p));
    await p.context().close(); }

  // 5. Create your own play: a warehouse or a CRM beside Real-Time CDP, Journey Optimizer, Marketo or Target (no CJA) adds
  //    no CJA service on the SOW steps (the review's finding); the totals agree on both pages
  for (const [on, out] of [[['rtcdp'], ['dwh']], [['ajo'], ['dwh']], [['marketo'], ['crm']], [['target'], ['crm']], [['rtcdp', 'ajo', 'marketo', 'target'], ['crm', 'dwh', 'ads']], [['cja', 'bv'], ['dwh', 'crm', 'cdn', 'cstore']], [['rtcdp'], ['cdn']]]) {
    const p = await fresh(); await setup(p, {play: 'custom', on, out});
    const t0 = await canvasTotal(p); await toServices(p); const t1 = await toolTotal(p);
    const lines = await p.$$eval('.service-card', e => e.map(x => x.dataset.line).filter(l => /OX\d$/.test(l)));
    const want = on.includes('cja') ? out.filter(x => x !== 'cdn').length : 0;
    ok(t0 === t1 && lines.length === want + (on.includes('bv') && out.includes('cdn') ? 1 : 0), `your own play with ${on.join(', ')} and ${out.join(', ')}: ${t0} on both pages`, JSON.stringify({t0, t1, lines}));
    await p.context().close();
  }

  // 6. the problem box starts a Brand Visibility answer with the CDN, as a picked play does
  { const p = await fresh(); await p.goto(BASE); await p.waitForTimeout(400);
    const s = await p.evaluate(() => { const q = PROBS.find(x => PLAYS[x.play] && (PLAYS[x.play].ostart || []).length); return q ? bpBase(q).out : null; });
    ok(Array.isArray(s) && s.includes('cdn'), 'a problem answer on a Brand Visibility play starts with the CDN', JSON.stringify(s));
    await p.context().close(); }

  // 7. no "the customer" in what step 45 wrote, and no dashes
  { const cat = JSON.parse(fs.readFileSync(path.join(__dirname, 'canvas', 'catalog.json'), 'utf8')), ids = ['ads', 'bi', 'search', 'csrc', 'cms'];
    const NEWC = ['ads-cja', 'ads-rtcdp', 'cja-bi', 'search-bv', 'search-so', 'csrc-eds', 'csrc-so', 'cms-bc', 'crm-marketo', 'crm-target', 'dwh-rtcdp', 'dwh-ajo'];
    const text = JSON.stringify([cat.products.filter(p => ids.includes(p.id) || p.rec), cat.connections.filter(c => NEWC.includes(c.id)), NEWC.flatMap(id => cat.connections.find(c => c.id === id).lines.map(l => cat.lines[l]))]);
    ok(!/\bthe customer\b(?! ID| Attributes| Journey)|\bcustomer's\b/i.test(text) && !/[–—]/.test(text) && cat.connections.filter(c => NEWC.includes(c.id)).length === 12,
      'the twelve new connections, their services and the five systems say your client, never the customer (a customer ID and Adobe product names stay), with no dashes', (text.match(/.{40}customer.{40}/i) || [''])[0]); }

  ok(!errs.length, 'no script errors', errs.join(' | '));
  await b.close(); server.close();
  console.log(fails ? `${fails} STEP 45 CHECK(S) FAILED` : 'ALL STEP 45 CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})();
