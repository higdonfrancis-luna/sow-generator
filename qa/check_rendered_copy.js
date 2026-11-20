// Rendered-copy check for the partner SOW generator (Nov 8 2026). Drives the built site in a browser the way a partner
// would and scans everything it shows or downloads for release-status labels and feature-release dates: the Build canvas
// (every play, every product card and connection card, the add menus, the problem picker and its refine chips), the SOW
// tool (every play, every service turned on, every size, the readiness notes, the SOW preview, the printed SOW and the
// services CSV), and the canvas-to-SOW hand-off for every play. The data checks in check_product_copy.py read the files;
// this one reads the pages, so text the code assembles at run time is covered too.
// Run from the repo root after python3 sow/build_site.py:
//   node sow/qa/check_rendered_copy.js [--dump file]
const {chromium} = require('playwright');
const {downloadWord, downloadWorkbook} = require('../rfp_prototype/review_2026-11-09/harness.js');
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const SITE = path.join(__dirname, '..', 'site');
const DUMP = process.argv.includes('--dump') ? process.argv[process.argv.indexOf('--dump') + 1] : '';
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 600) + ']')); if (!c) fails++; };

// release-status labels, forecasts and meta talk about release labels: none of these may reach a partner or a client
const FORBIDDEN = /\bbeta\b|early access|early adopter|limited availability|limited release|coming soon|not yet available|not available yet|\bdon't yet\b|\bdo not yet\b|\bnot yet support|\b(?:is|are|was|were) planned\b|planned for a future|future release|roadmap for|on adobe's roadmap|rolling out in|rolls out in|staged beta rollout|differ on its rollout|release label|no label\b|carries no (?:published )?(?:availability )?(?:status|label)|status is not stated|not generally available|has rolled out|until adobe marks|once adobe documents|technical preview|public preview|private preview|\bpre-?release\b/i;
// a date or dated version next to a release word is a feature-release date (this is also what catches "generally available since <date>");
// a client date (document date, start date, timeline) has no release word beside it
const DATE = /(?:January|February|March|April|May|June|July|August|September|October|November|December)(?:\s+\d{1,2},?)?\s+20\d\d|\bQ[1-4]\s+20\d\d\b|\b20\d\d\.\d{1,2}(?:\.\d+)?\b|\bv?20\d\d\.\d+\b/g;
const RELEASE_WORDS = /releas|availab|launch|introduc|roll(?:ed|s|ing)? out|rollout|\bGA\b|beta|preview|trial|notes|version|from|since|as of|starting|effective/i;
// lifecycle words that are neither beta nor a date; reported, not failed, so Adam can decide
const WATCH = /\blegacy\b|maintenance mode|co-innovation|limited number of customers|not currently (?:offered|available)|current scope/gi;
// Nov 8 (Adam: "number three"): the lifecycle labels the Client never reads (the SOW, the CSV, and since step 53 the RFP Builder's drafted responses)
const CLIENT = /not currently (?:offered|available)|not offered to health care|sensitive-data organizations|health care, finance|health care and finance|maintenance mode|co-innovation|limited number of customers|current scope|Legacy offer route|as Legacy/gi;
// Nov 17 (Adam: "2, yes"): Adobe's own note on the industries Coworker is not offered to, word for word, is on the partner's
// Workfront + Coworker card (the end of its how text) and on no other view; the Client never reads it
const ADOBE_NOTE = 'Adobe\'s Workfront help says: "CX Enterprise Coworker is not currently available to organizations in health care, finance, or some other industries with sensitive data. AI Assistant is available to these organizations."';
// Nov 19 (Adam approved the Workfront version picker): the day a client bought Workfront is a client date, not a release date
const BOUGHT = /Bought (?:before|after) March 12, 2026/g;
const WF_CARD = /^canvas [^:]+: connection card workfront-cw(?: \(expanded\))?$|^canvas template: connection workfront-cw$/;

const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  if (u.endsWith('/')) u += 'index.html';
  const f = path.join(SITE, u);
  if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, {'Content-Type': f.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/plain'}); fs.createReadStream(f).pipe(res);
});

const strip = html => html.replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ');
const seen = [];          // [where, text]
const add = (where, text) => { if (text && text.trim()) seen.push([where, text.replace(/\s+/g, ' ').trim()]); };
// everything a person can read on the page right now: visible text, plus titles, labels and placeholders
const HARVEST = `(() => { document.querySelectorAll('details').forEach(d => d.open = true);
  const parts = [document.body.innerText];
  document.querySelectorAll('[title],[aria-label],[placeholder]').forEach(e => { for (const a of ['title','aria-label','placeholder']) if (e.getAttribute(a)) parts.push(e.getAttribute(a)); });
  return parts.join('\\n'); })()`;

(async () => {
  await new Promise(r => server.listen(0, r));
  const BASE = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch(), errs = [];
  const fresh = async () => { const ctx = await b.newContext({viewport: {width: 1600, height: 1000}, acceptDownloads: true}); const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR_/.test(m.text())) errs.push(m.text()); }); return p; };
  const harvest = async (p, where) => add(where, await p.evaluate(HARVEST));
  // the pages remember the last play in browser storage, so a clean visit clears it first and shows the picker again
  const open = async (p, url) => { await p.goto(url); try { await p.evaluate(() => localStorage.clear()); } catch (_) {} await p.goto(url); await p.waitForTimeout(300); };
  const download = async (p, sel) => { const [d] = await Promise.all([p.waitForEvent('download'), p.click(sel)]); return fs.readFileSync(await d.path(), 'utf8'); };

  // ---------- the Build canvas
  let p = await fresh();
  await open(p, BASE); await p.waitForTimeout(100);
  await harvest(p, 'canvas: picker');
  const plays = await p.evaluate(() => CAT.plays.map(pl => ({id: pl.id, custom: !!pl.custom, products: pl.products, outside: pl.outside || []})));
  const customProducts = await p.evaluate(() => (CAT.plays.find(pl => pl.custom) || {products: []}).products);
  let cards = 0, conns = 0;
  for (const pl of plays) {
    await open(p, BASE);
    await p.click(`#picker [data-play="${pl.id}"]`); await p.waitForTimeout(400);
    if (pl.custom) { for (const id of customProducts) { await p.evaluate(id => addProduct(id), id); } await p.waitForTimeout(300); }
    for (const id of pl.outside) { await p.evaluate(id => addOutside(id), id); }
    await p.waitForTimeout(300);
    await harvest(p, `canvas ${pl.id}: page`);
    await p.evaluate(() => openAdd(true)); await harvest(p, `canvas ${pl.id}: add menu`); await p.evaluate(() => openAdd(false));
    await p.evaluate(() => { if (typeof openOut === 'function' && document.getElementById('out-btn')) openOut(true); }); await harvest(p, `canvas ${pl.id}: outside menu`); await p.evaluate(() => { if (typeof openOut === 'function') openOut(false); });
    const onCanvas = await p.evaluate(() => CAT.products.filter(q => has(q.id)).map(q => q.id));
    for (const id of onCanvas) {
      await p.evaluate(id => { pinned = true; showCard('p', id); }, id); await p.waitForTimeout(60);
      add(`canvas ${pl.id}: product card ${id}`, await p.evaluate(() => { document.querySelectorAll('#card details').forEach(d => d.open = true); return document.getElementById('card').innerText + '\n' + [...document.querySelectorAll('#card [title],#card [aria-label]')].map(e => e.getAttribute('title') || e.getAttribute('aria-label')).join('\n'); }));
      cards++;
      // the "more" services of a product are behind a disclosure; open them too
      await p.evaluate(() => document.querySelectorAll('#card [data-more],#card .more,#card summary').forEach(e => { try { e.click(); } catch (_) {} }));
      await p.waitForTimeout(40);
      add(`canvas ${pl.id}: product card ${id} (expanded)`, await p.evaluate(() => document.getElementById('card').innerText));
      await p.evaluate(() => hideCard(true));
    }
    const shown = await p.evaluate(() => conns().map(c => c.id));
    for (const id of shown) {
      await p.evaluate(id => { pinned = true; showCard('c', id); }, id); await p.waitForTimeout(60);
      add(`canvas ${pl.id}: connection card ${id}`, await p.evaluate(() => { document.querySelectorAll('#card details').forEach(d => d.open = true); return document.getElementById('card').innerText + '\n' + [...document.querySelectorAll('#card [title],#card [aria-label]')].map(e => e.getAttribute('title') || e.getAttribute('aria-label')).join('\n'); }));
      conns++;
      await p.evaluate(() => document.querySelectorAll('#card [data-more],#card .more,#card summary').forEach(e => { try { e.click(); } catch (_) {} }));
      await p.waitForTimeout(40);
      add(`canvas ${pl.id}: connection card ${id} (expanded)`, await p.evaluate(() => document.getElementById('card').innerText));
      await p.evaluate(() => hideCard(true));
    }
  }
  ok(cards > 0 && conns > 0, `canvas: read ${plays.length} plays, ${cards} product cards and ${conns} connection cards`);
  // every card the page can build, whatever play is on: the templates, not just the clicks above
  await open(p, BASE); await p.click(`#picker [data-play="${plays.find(pl => pl.custom)?.id || plays[0].id}"]`); await p.waitForTimeout(300);
  const everyCard = await p.evaluate(() => { const out = []; for (const q of CAT.products) out.push(['product ' + q.id, q.outside ? outCardHTML(q.id) : cardHTML('p', q.id)]); for (const c of CAT.connections) out.push(['connection ' + c.id, cardHTML('c', c.id)]); return out; });
  for (const [k, h] of everyCard) add(`canvas template: ${k}`, strip(h));
  ok(everyCard.length > 0, `canvas: rendered every card template (${everyCard.length})`);

  // ---------- the problem picker: every problem, every refine chip and every alternative setup
  await open(p, BASE);
  const nProbs = await p.evaluate(() => PROBS.length);
  const answerNow = () => p.evaluate(() => { clearTimeout(bpT); bp.view = 'answer'; bpRender(); });
  const ask = async i => { await p.evaluate(i => bpAsk(PROBS[i].chip, i), i); await answerNow(); await p.waitForTimeout(40); };
  let refines = 0;
  for (let i = 0; i < nProbs; i++) {
    await ask(i); await harvest(p, `problem ${i}: answer`);
    const chips = await p.$$eval('#bp [data-bpr]', e => e.map(x => x.dataset.bpr));
    for (const r of chips) {
      await ask(i);
      const el = await p.$(`#bp [data-bpr="${r}"]`); if (!el) continue;
      await el.click(); await answerNow(); await p.waitForTimeout(40); refines++;
      await harvest(p, `problem ${i}: refine ${r}`);
      if (await p.$('#bp [data-bpa="another"]')) { await p.click('#bp [data-bpa="another"]'); await answerNow(); await p.waitForTimeout(40); await harvest(p, `problem ${i}: refine ${r}, another setup`); }
    }
    await ask(i);
    if (await p.$('#bp [data-bpa="another"]')) { await p.click('#bp [data-bpa="another"]'); await answerNow(); await p.waitForTimeout(40); await harvest(p, `problem ${i}: another setup`); }
  }
  await open(p, BASE);
  if (await p.$('#bp [data-bpa="all"]')) { await p.click('#bp [data-bpa="all"]'); await p.waitForTimeout(200); await harvest(p, 'problem picker: all problems'); }
  ok(nProbs > 0, `problem picker: read ${nProbs} problems and ${refines} refine chips`);
  await p.context().close();

  // ---------- the SOW tool, every play from its own templates
  const SOW = BASE + 'sow/index.html';
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rendered-copy-'));
  const everything = async (p, label) => {
    await p.evaluate(() => go('scope')); await p.waitForTimeout(150); await harvest(p, `${label}: scope`);
    await p.evaluate(() => go('services')); await p.waitForTimeout(200); await harvest(p, `${label}: services`);
    // the library: read it, then add every service it offers
    await p.click('#add-service'); await p.waitForTimeout(200); await harvest(p, `${label}: service library`);
    for (let guard = 0; guard < 300; guard++) {
      const btn = await p.$('#available-services [data-add]'); if (!btn) break;
      await btn.click(); await p.waitForTimeout(40);
      if (await p.isHidden('#service-modal')) { await p.click('#add-service'); await p.waitForTimeout(120); }
    }
    await p.keyboard.press('Escape'); await p.waitForTimeout(100);
    for (const size of ['small', 'large', 'typical']) {
      await p.click(`#size-switch button[data-size="${size}"]`); await p.waitForTimeout(150);
      await harvest(p, `${label}: services, all on, ${size}`);
    }
    await p.evaluate(() => go('document')); await p.waitForTimeout(300);
    await harvest(p, `${label}: statement of work (draft, parties missing)`);
    // name the parties and a schedule, so the SOW is issued and the downloads are the real ones
    await p.evaluate(() => { state.customer = state.customer || 'Acme Co'; state.partner = state.partner || 'Partner Co'; state.timeline = state.timeline || 'Weeks 1 to 4: setup and baseline; monthly reviews from week 5.'; state.rate = state.rate || 150; save(); go('document'); });
    await p.waitForTimeout(300);
    await harvest(p, `${label}: statement of work`);
    // Nov 13: the HTML "Download SOW" button was removed; "Print / Save PDF" (#print-sow) is now the SOW's only export.
    // Read exactly what that button sends to the printer (window.print is stubbed so no dialog opens).
    await p.evaluate(() => { window.__printedSow = null; window.print = () => { window.__printedSow = document.getElementById('sow-preview').innerHTML; }; });
    await p.click('#print-sow');
    add(`${label}: printed SOW`, strip(await p.evaluate(() => window.__printedSow || '')));
    add(`${label}: services CSV`, await download(p, '#export-csv'));
  };
  p = await fresh();
  await open(p, SOW);
  const toolPlays = await p.evaluate(() => Object.keys(PLAYS));
  for (const play of toolPlays.filter(x => x !== 'custom')) {
    await open(p, SOW);
    await p.evaluate(pl => { state.play = pl; go('scope'); }, play);
    await everything(p, `sow ${play}`);
  }
  ok(toolPlays.length >= 6, `sow tool: read ${toolPlays.length - 1} plays with every service on at every size, the SOW preview, the printed SOW and the services CSV`);
  await p.context().close();

  // ---------- the hand-off from the canvas to the SOW tool, every play, with every outside system added
  let handoffs = 0;
  for (const pl of plays) {
    p = await fresh();
    await open(p, BASE);
    await p.click(`#picker [data-play="${pl.id}"]`); await p.waitForTimeout(300);
    if (pl.custom) { for (const id of customProducts) await p.evaluate(id => addProduct(id), id); }
    for (const id of pl.outside) await p.evaluate(id => addOutside(id), id);
    await p.waitForTimeout(300);
    await p.fill('#rate', '150'); await p.waitForTimeout(100);
    await p.click('#save'); await p.waitForURL('**/sow/index.html#scope'); await p.waitForTimeout(400);
    await everything(p, `hand-off ${pl.id}`);
    handoffs++;
    await p.context().close();
  }
  ok(handoffs === plays.length, `hand-off: ${handoffs} plays carried from the canvas into the SOW tool, with every service on`);

  // ---------- the RFP Builder prototype (step 53, Nov 10 2026): every drafted response for the four made-up RFPs, the
  // client's copy of the response and the partner's checklist, read as a partner would after python3 sow/build_site.py
  const RFP = path.join(__dirname, '..', 'site', 'sow'), RFPFIX = path.join(__dirname, 'rfp_fixtures');
  const rfpClient = [];
  if (fs.existsSync(path.join(RFP, 'index.html'))) {
    const server2 = http.createServer((req, res) => {
      let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
      if (u.endsWith('/')) u += 'index.html';
      const f = path.join(RFP, u);
      if (!f.startsWith(RFP) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
      res.writeHead(200, {'Content-Type': f.endsWith('.html') ? 'text/html; charset=utf-8' : f.endsWith('.mjs') || f.endsWith('.js') ? 'text/javascript' : 'text/plain'}); fs.createReadStream(f).pipe(res);
    });
    await new Promise(r => server2.listen(0, r));
    const RBASE = `http://localhost:${server2.address().port}/`;
    // what the client must never read in a drafted response: partner words, and the lifecycle labels the SOW keeps off the client too
    const RFP_PARTNER = /\bthe Client\b(?! ID| Secret)|\bClient's|\byour client\b|\bthe partner\b|\bpartner-|\bA our\b|\ba our\b/g;
    let answers = 0;
    p = await fresh();
    for (const f of ['bank_rfp.xlsx', 'retail_rfi.docx', 'mfg_rfp.pdf', 'bank_rfp.txt']) {
      await p.goto(RBASE + 'index.html#rfp'); await p.waitForTimeout(300);
      await p.setInputFiles('#rfp-file', path.join(RFPFIX, f));
      await p.waitForFunction(() => /found|no questions/.test(document.getElementById('rfp-status').textContent), null, {timeout: 60000}).catch(() => {});
      await p.waitForTimeout(200);
      const n = await p.evaluate(() => RFPBuilder.state.questions.length);
      for (let i = 0; i < n; i++) {
        const kind = await p.evaluate(i => RFPBuilder.state.questions[i].kind, i);
        if (kind !== 'adobe') continue;
        await p.evaluate(i => document.querySelector(`#rfp-questions li[data-i="${i}"]`).click(), i); await p.waitForTimeout(80);
        add(`rfp ${f}: answer ${i}`, await p.evaluate(() => document.getElementById('rfp-answer').innerText));
        // the response to the client, without the partner's note
        const resp = await p.evaluate(() => { const b = document.getElementById('rfp-body'); return b ? b.innerText : ''; });
        let m; const re = new RegExp(RFP_PARTNER.source, 'g'); while ((m = re.exec(resp))) rfpClient.push([`rfp ${f}: answer ${i}`, m[0], resp.slice(Math.max(0, m.index - 80), m.index + m[0].length + 80)]);
        const cre = new RegExp(CLIENT.source, 'gi'); while ((m = cre.exec(resp))) rfpClient.push([`rfp ${f}: answer ${i}`, m[0], resp.slice(Math.max(0, m.index - 80), m.index + m[0].length + 80)]);
        answers++;
      }
      // Round 6 replaced the HTML response and checklist with the complete Word proposal and partner workbook.
      const word = await downloadWord({page:p,eval:(fn,arg)=>p.evaluate(fn,arg)});
      const doc = word.blocks.flatMap(block=>block.rows?block.rows.flat():[block.text]).join('\n');
      add(`rfp ${f}: downloaded response`, doc);
      let m; const re = new RegExp(RFP_PARTNER.source, 'g'); while ((m = re.exec(doc))) rfpClient.push([`rfp ${f}: downloaded response`, m[0], doc.slice(Math.max(0, m.index - 80), m.index + m[0].length + 80)]);
      const cre = new RegExp(CLIENT.source, 'gi'); while ((m = cre.exec(doc))) rfpClient.push([`rfp ${f}: downloaded response`, m[0], doc.slice(Math.max(0, m.index - 80), m.index + m[0].length + 80)]);
      const checklist = await downloadWorkbook(p,'rfp-download-checklist');
      add(`rfp ${f}: checklist`,Object.values(checklist.sheets).flat(2).join('\n'));
    }
    ok(answers > 20, `rfp builder: read ${answers} drafted answers, four downloaded responses and four checklists`);
    await p.context().close(); server2.close();
  } else console.log('   note: the SOW site is not built with the RFP Builder (python3 sow/build_site.py), so its drafted responses were not read');

  // ---------- the scan
  if (DUMP) fs.writeFileSync(DUMP, seen.map(([w, t]) => '### ' + w + '\n' + t).join('\n\n'));
  const hits = [], dates = [], watch = new Map();
  for (const [where, text] of seen) {
    let m; const re = new RegExp(FORBIDDEN.source, 'gi');
    while ((m = re.exec(text))) hits.push([where, m[0], text.slice(Math.max(0, m.index - 90), m.index + m[0].length + 90)]);
    const dre = new RegExp(DATE.source, 'g'), dtext = text.replace(BOUGHT, 'Bought');
    while ((m = dre.exec(dtext))) { const before = dtext.slice(Math.max(0, m.index - 80), m.index); if (RELEASE_WORDS.test(before)) dates.push([where, m[0], dtext.slice(Math.max(0, m.index - 100), m.index + m[0].length + 40)]); }
    const wre = new RegExp(WATCH.source, 'gi'), wtext = WF_CARD.test(where) ? text.replace(ADOBE_NOTE, '') : text;
    while ((m = wre.exec(wtext))) { const k = m[0].toLowerCase(); if (!watch.has(k)) watch.set(k, [0, where, wtext.slice(Math.max(0, m.index - 80), m.index + m[0].length + 80)]); watch.get(k)[0]++; }
  }
  // Nov 8 (Adam: "number three"): what the Client reads (the SOW preview, the printed SOW, the CSV) carries no lifecycle
  // label, while the partner's canvas cards keep Adobe's eligibility note on Coworker. Step 86 (Nov 12) took the note off the cards;
  // Nov 17 put Adobe's own words back on the Workfront + Coworker card only
  const clientHits = [];
  let partnerNote = 0, wfNote = 0;
  for (const [where, text] of seen) {
    if (/statement of work|printed SOW|services CSV/.test(where)) { let m; const re = new RegExp(CLIENT.source, 'gi'); while ((m = re.exec(text))) clientHits.push([where, m[0], text.slice(Math.max(0, m.index - 90), m.index + m[0].length + 90)]); }
    if (/^canvas /.test(where)) {
      const own = WF_CARD.test(where);
      if (own && text.includes(ADOBE_NOTE)) wfNote++;
      if (/health care(?:,| and) finance|not (?:currently )?(?:offered|available) to (?:organizations in )?health care|industries with sensitive data|confirm eligibility/i.test(own ? text.replace(ADOBE_NOTE, '') : text)) partnerNote++;
    }
  }
  // voice (Nov 8): the canvas speaks to the partner, the printed SOW and the CSV to the Client
  const canvasClient = [], docPartner = [];
  for (const [where, text] of seen) {
    if (/^canvas /.test(where)) { let m; const re = /\bthe Client\b(?! ID)|\bClient's|\bThe Client\b/g; while ((m = re.exec(text))) canvasClient.push([where, m[0], text.slice(Math.max(0, m.index - 80), m.index + m[0].length + 80)]); }
    if (/printed SOW|services CSV/.test(where)) { let m; const re = /\byour client\b/gi; while ((m = re.exec(text))) docPartner.push([where, m[0], text.slice(Math.max(0, m.index - 80), m.index + m[0].length + 80)]); }
  }
  const uniq = rows => { const s = new Set(); return rows.filter(r => { const k = r[1].toLowerCase() + '|' + r[2]; if (s.has(k)) return false; s.add(k); return true; }); };
  const h = uniq(hits), d = uniq(dates);
  ok(h.length === 0, `no release-status label, forecast or release-label talk anywhere a partner or client can read (${seen.length} views read)`, h.length + ' found');
  for (const [where, word, ctx] of h.slice(0, 40)) console.log(`   ❌ ${where} <${word}> ...${ctx}...`);
  ok(d.length === 0, 'no date or dated version next to a release word (client dates stay)', d.length + ' found');
  const ch = uniq(clientHits);
  ok(ch.length === 0, 'the SOW preview, the printed SOW and the CSV carry no lifecycle label (Legacy, maintenance mode, co-innovation, a limited number of customers, the Coworker industry note)', ch.length + ' found');
  for (const [where, word, ctx] of ch.slice(0, 20)) console.log(`   ❌ ${where} <${word}> ...${ctx}...`);
  const cc = uniq(canvasClient), dp = uniq(docPartner);
  ok(cc.length === 0, 'the canvas never speaks in the Client\'s voice ("the Client" belongs to the SOW)', cc.length + ' found');
  for (const [where, word, ctx] of cc.slice(0, 20)) console.log(`   ❌ ${where} <${word}> ...${ctx}...`);
  ok(dp.length === 0, 'the printed SOW and the CSV never say "your client"', dp.length + ' found');
  for (const [where, word, ctx] of dp.slice(0, 20)) console.log(`   ❌ ${where} <${word}> ...${ctx}...`);
  ok(partnerNote === 0 && wfNote > 0, `step 86 and Nov 17: only the Workfront + Coworker connection card carries Adobe's note that Coworker is not offered to health care or finance, in Adobe's words (${wfNote} views of it), and no card tells the partner to confirm eligibility (${partnerNote} views elsewhere)`);
  const rc = uniq(rfpClient);
  ok(rc.length === 0, 'the RFP Builder\'s drafted responses and the downloaded response carry no partner or Client word and no lifecycle label (step 53)', rc.length + ' found');
  for (const [where, word, ctx] of rc.slice(0, 20)) console.log(`   ❌ ${where} <${word}> ...${ctx}...`);
  for (const [where, word, ctx] of d.slice(0, 40)) console.log(`   ❌ ${where} <${word}> ...${ctx}...`);
  if (watch.size) { console.log('   note: lifecycle wording left for Adam to decide (not failures):'); for (const [k, [n, where, ctx]] of watch) console.log(`   · "${k}" x${n}, e.g. ${where}: ...${ctx}...`); }
  ok(errs.length === 0, 'no script errors while driving both pages', errs.join(' | '));
  await b.close(); server.close();
  console.log(fails ? `${fails} RENDERED COPY CHECK(S) FAILED` : 'ALL RENDERED COPY CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
