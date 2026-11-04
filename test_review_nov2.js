// ChatGPT's last review of the bundle (Nov 2 2026, sow/review_2026-11-02/): each finding reproduced on the built site
// (sow/site/), through the real pages, saved drafts and downloaded files. Run from the repo root after
// python3 sow/build_site.py:
//   node sow/test_review_nov2.js
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const SITE = path.join(__dirname, 'site');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'nov2-'));
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 400) + ']')); if (!c) fails++; };
const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  if (u.endsWith('/')) u += 'index.html';
  const f = path.join(SITE, u);
  if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, {'Content-Type': f.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/plain'}); fs.createReadStream(f).pipe(res);
});
const TERMS = 'Time and materials, invoiced monthly in arrears; five business days to review each deliverable; customer dependencies due within ten business days; pause and restart on two weeks notice; changes by written change order under the master services agreement.';
(async () => {
  await new Promise(r => server.listen(0, r));
  const BASE = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch(), errs = [];
  const fresh = async () => { const ctx = await b.newContext({viewport: {width: 1600, height: 950}, acceptDownloads: true}); const p = await ctx.newPage();
    // script errors only: a font or other resource the network can't reach is not a script error (ChatGPT ran this offline)
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR_/.test(m.text())) errs.push(m.text()); }); return p; };
  const canvasTotal = async p => (await p.textContent('#t-big')).trim();
  const toolTotal = async p => (await p.$$eval('.total-card strong', e => e.map(x => x.textContent.trim())))[2];
  const pick = async (p, play, rate) => { await p.goto(BASE); await p.waitForTimeout(300); await p.click(`#picker [data-play="${play}"]`); await p.waitForTimeout(400);
    if (rate !== undefined) { await p.fill('#rate', String(rate)); await p.waitForTimeout(100); } };
  const cont = async p => { await p.click('#save'); await p.waitForURL('**/sow/index.html#scope'); await p.waitForTimeout(400); };
  const services = async p => { await p.click('[data-step="services"]'); await p.waitForTimeout(300); };
  const build = async p => { await p.click('.steps [data-build]'); await p.waitForURL(u => !/\/sow\//.test(String(u))); await p.waitForTimeout(450); };
  const addLib = async (p, id) => { await p.click('#add-service'); await p.waitForTimeout(150); await p.click(`#available-services [data-add="${id}"]`); await p.waitForTimeout(150); await p.click('#close-modal'); await p.waitForTimeout(150); };
  const download = async (p, click) => { const [d] = await Promise.all([p.waitForEvent('download'), click()]); return fs.readFileSync(await d.path(), 'utf8'); };
  // Services CSV sits beside Download SOW on the Statement of work step (step 31); come back to where the test was
  const csvOf = async p => { const back = await p.evaluate(() => step); await p.click('[data-step="document"]'); await p.waitForTimeout(200);
    const t = await download(p, () => p.click('#export-csv')); await p.click(`[data-step="${back}"]`); await p.waitForTimeout(200); return t; };
  // Download SOW sits on the Statement of work step; come back to where the test was
  const htmlOf = async p => { const back = await p.evaluate(() => step); await p.click('[data-step="document"]'); await p.waitForTimeout(200);
    const t = await download(p, () => p.click('#download-sow')); await p.click(`[data-step="${back}"]`); await p.waitForTimeout(200); return t; };
  const draftOf = async p => download(p, () => p.click('#save-draft'));
  const openDraft = async (p, json, name) => { const f = path.join(TMP, name); fs.writeFileSync(f, typeof json === 'string' ? json : JSON.stringify(json)); await p.setInputFiles('#draft-file', f); await p.waitForTimeout(500); };
  const parseCsv = t => { const rows = []; let row = [], cell = '', q = false; t = t.replace(/^﻿/, '');
    for (let i = 0; i < t.length; i++) { const c = t[i];
      if (q) { if (c === '"' && t[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
      else if (c === '"') q = true; else if (c === ',') { row.push(cell); cell = ''; } else if (c === '\r') {} else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; } else cell += c; }
    row.push(cell); rows.push(row); return rows; };
  const canvasState = async p => p.evaluate(() => JSON.parse(localStorage.getItem('abv-sow-build-v1') || 'null'));
  // a section that throws reports it and the run goes on to the next one
  const sec = async fn => { try { await fn(); } catch (e) { ok(false, 'section stopped: ' + e.message.split('\n')[0]); for (const c of b.contexts()) await c.close().catch(() => {}); } };

  // ---------- B03: a rate cleared on the canvas stays cleared; a line's own rate survives ----------
  await sec(async () => {
    const p = await fresh(); await pick(p, 'cja', 150); await cont(p);
    ok(await p.evaluate(() => state.rate) === 150, 'B03 setup: the canvas rate reaches the SOW steps');
    await services(p); await p.fill('.service-card[data-line="C01"] [data-line-field="rate"]', '240'); await p.waitForTimeout(150);
    await build(p); await p.fill('#rate', ''); await p.waitForTimeout(150); await cont(p);
    ok(await p.evaluate(() => state.rate) === '' && await p.evaluate(() => totals().totalFee) === null, 'B03: a rate cleared on the canvas stays cleared on the SOW steps (no fee shown)', await p.evaluate(() => state.rate));
    ok(await p.evaluate(() => state.estimates.cja.C01.rate) === 240, 'B03: a line\'s own rate survives clearing the global rate');
    await build(p);
    ok(await p.inputValue('#rate') === '' && await canvasTotal(p) === '$ ___', 'B03: back on Build the rate is still blank', await p.inputValue('#rate'));
    await p.fill('#rate', '120'); await p.waitForTimeout(100); await cont(p);
    ok(await p.evaluate(() => state.rate) === 120, 'B03: blank to a new rate carries through');
    await p.context().close();
  });

  // ---------- B02: services added on Services that the canvas doesn't show survive Build ----------
  await sec(async () => {
    const p = await fresh(); await pick(p, 'abv', 150); await cont(p); await services(p);
    await addLib(p, 'L03'); await addLib(p, 'X01');
    await p.click('.service-card[data-line="L03"] .scope-editor summary');
    const sc = await p.inputValue('.service-card[data-line="L03"] [data-line-field="scope"]');
    await p.fill('.service-card[data-line="L03"] [data-line-field="scope"]', sc + ' Pilot on the Help Center pages only.'); await p.waitForTimeout(150);
    const t1 = await toolTotal(p);
    await build(p);
    ok(await canvasTotal(p) === t1, `B02/B04: the canvas total includes the services added on Services (${t1})`, await canvasTotal(p));
    ok((await p.textContent('#t-note')).includes('2 services added on the Services step'), 'B02: the canvas says two services added on the Services step are in its total', await p.textContent('#t-note'));
    await cont(p); await services(p);
    const on = await p.evaluate(() => ['L03', 'X01'].map(id => state.estimates.abv[id].on));
    ok(on.every(Boolean) && (await p.evaluate(() => state.estimates.abv.L03.scope)).endsWith('Help Center pages only.') && await toolTotal(p) === t1,
      'B02: L03 and X01 stay selected after a trip through Build, with the scope edit', JSON.stringify(on));
    await p.reload(); await p.waitForTimeout(500); await services(p);
    ok(await p.evaluate(() => state.estimates.abv.L03.on && state.estimates.abv.X01.on), 'B02: and after a reload');
    const d = await draftOf(p);
    const p2 = await fresh(); await p2.goto(BASE + 'sow/'); await p2.waitForTimeout(400); await openDraft(p2, d, 'b02.json');
    ok(await p2.evaluate(() => state.play === 'abv' && state.estimates.abv.L03.on && state.estimates.abv.X01.on), 'B02: and through Save draft and Open draft');
    await p2.context().close();
    await services(p); await p.click('.service-card[data-line="X01"] .remove-line'); await p.waitForTimeout(150);
    await build(p); await cont(p);
    ok(await p.evaluate(() => !state.estimates.abv.X01.on && state.estimates.abv.L03.on), 'B02: an explicit removal on Services persists through Build');
    // picking the play again on the canvas starts its services over
    await build(p); await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300);
    await p.click('#picker [data-play="abv"]'); await p.waitForTimeout(400);
    ok(!(await p.textContent('#t-note')).includes('added on the Services step'), 'B02: after Change play, the picked play starts without the Services-only additions');
    await cont(p);
    ok(await p.evaluate(() => !state.estimates.abv.L03.on), 'B02: and the SOW steps drop them too (the play was picked again)');
    await p.context().close();
    for (const play of ['cja', 'commerce', 'aem', 'fsi', 'coworker']) {
      const q = await fresh(); await pick(q, play, 150); await cont(q); await services(q); await addLib(q, 'X01');
      const t = await toolTotal(q); await build(q); const ct = await canvasTotal(q); await cont(q);
      ok(await q.evaluate(p => state.estimates[p].X01.on, play) && ct === t, `B02: ${play}: executive alignment added on Services survives Build, and the canvas shows the same total (${t})`, ct);
      await q.context().close();
    }
  });

  // ---------- B04: the canvas total uses each line's own band, hours, rate and cadence ----------
  await sec(async () => {
    const p = await fresh(); await pick(p, 'abv', 150); await cont(p);
    await p.fill('[data-cover="promptCount"]', '100'); await p.waitForTimeout(200); await services(p);
    const t1 = await toolTotal(p);
    ok(t1 === '$175,200', 'B04 setup: 100 prompts put the prompt services at Small on Services ($175,200)', t1);
    await build(p);
    ok(await canvasTotal(p) === t1, 'B04: Build shows the same $175,200', await canvasTotal(p));
    await cont(p); await services(p);
    await p.selectOption('.service-card[data-line="O02"] [data-line-field="band"]', 'small'); await p.waitForTimeout(150);
    await p.fill('.service-card[data-line="O02"] [data-line-field="rate"]', '175'); await p.waitForTimeout(150);
    await p.selectOption('.service-card[data-line="O02"] [data-line-field="cadence"]', 'one-time'); await p.waitForTimeout(150);
    await p.fill('.service-card[data-line="L01"] [data-line-field="hours"]', '99'); await p.waitForTimeout(150);
    const t2 = await toolTotal(p);
    await build(p);
    ok(await canvasTotal(p) === t2, `B04: a line's own band, rate, cadence and typed hours reach the canvas total (${t2})`, await canvasTotal(p));
    const notes = await p.evaluate(() => ['O02', 'L01', 'L02', 'O01'].map(setNote));
    ok(JSON.stringify(notes) === JSON.stringify(['Set on the Services step', 'Set on the Services step', 'Set by the prompt count on the Scope step', 'Set by the prompt count on the Scope step']), 'B04: a line set on Services says so on its card, and a prompt service says the prompt count set it', JSON.stringify(notes));
    await p.click('#size [data-size="large"]'); await p.waitForTimeout(200);
    const t3 = await canvasTotal(p);
    await cont(p); await services(p);
    ok(await toolTotal(p) === t3, `B04: after Large on the canvas, both show the same total (${t3})`, await toolTotal(p));
    const kept = await p.evaluate(() => { const o = state.estimates.abv.O02; return [o.band, o.rate, o.cadence, state.estimates.abv.L01.hours, brief().coverage.promptCount]; });
    ok(JSON.stringify(kept) === JSON.stringify(['small', 175, 'one-time', 99, '100']), 'B04: returning keeps every edit', JSON.stringify(kept));
    await p.context().close();
  });

  // ---------- B05: a band picked on the card updates acceptance too, in the preview, HTML and CSV ----------
  await sec(async () => {
    const p = await fresh(); await pick(p, 'coworker', 150); await cont(p);
    await p.evaluate(t => { state.terms = t; save(); }, TERMS); await services(p);
    for (const [band, yes, no] of [['large', 'all four workflows', 'both workflows'], ['small', 'approves the workflow,', 'both workflows']]) {
      await p.selectOption('.service-card[data-line="CW01"] [data-line-field="band"]', band); await p.waitForTimeout(200);
      const acc = await p.evaluate(() => state.estimates.coworker.CW01.acceptance);
      const csv = await csvOf(p), htm = await htmlOf(p);
      ok(acc.includes(yes) && !acc.includes(no) && csv.includes(yes) && !csv.includes(no) && htm.includes(yes) && !htm.includes(no),
        `B05: CW01 ${band}: the acceptance follows the band in the card, the CSV and the downloaded SOW ("${yes}")`, acc);
      await p.reload(); await p.waitForTimeout(500); await services(p);
      ok((await p.evaluate(() => state.estimates.coworker.CW01.acceptance)) === acc, `B05: CW01 ${band}: the same after a reload`);
    }
    // a partner's own acceptance text stays; the untouched scope still follows the band
    await p.click('.service-card[data-line="CW01"] .scope-editor summary');
    await p.fill('.service-card[data-line="CW01"] [data-line-field="acceptance"]', 'Sponsor signs off the one workflow brief in writing.'); await p.waitForTimeout(150);
    await p.selectOption('.service-card[data-line="CW01"] [data-line-field="band"]', 'large'); await p.waitForTimeout(200);
    const r = await p.evaluate(() => state.estimates.coworker.CW01);
    ok(r.acceptance === 'Sponsor signs off the one workflow brief in writing.' && r.scope.includes('four bounded'), 'B05: an edited text is kept, and the unedited ones follow the band', r.scope.slice(0, 60));
    await p.context().close();
  });

  // ---------- B06: Large Brand Concierge sets up two handoff routes everywhere ----------
  await sec(async () => {
    const p = await fresh(); await pick(p, 'fsi', 150); await cont(p);
    await p.evaluate(t => { state.terms = t; const c = brief().coverage; c.fsiReview = 'Approved sources: rate sheet and product pages, reviewed by Compliance.'; c.fsiHandoff = 'Live chat to the deposits team; booked appointments.'; c.fsiOwner = 'Digital banking lead'; save(); }, TERMS);
    await services(p);
    await p.selectOption('.service-card[data-line="F02"] [data-line-field="band"]', 'large'); await p.waitForTimeout(200);
    const f = await p.evaluate(() => state.estimates.fsi.F02), htm = await htmlOf(p);
    ok(f.scope.includes('two handoff routes, each agreed separately') && f.deliverable.includes('both handoff routes') && f.acceptance.includes('both handoff routes') && !f.scope.includes('routed to one customer-designated team'),
      'B06: F02 Large: scope, deliverable and acceptance all say two handoff routes', f.scope.slice(0, 120));
    ok(htm.includes('two handoff routes, each agreed separately') && !htm.includes('routed to one customer-designated team'), 'B06: and so does the downloaded SOW');
    for (const band of ['small', 'typical']) {
      await p.selectOption('.service-card[data-line="F02"] [data-line-field="band"]', band); await p.waitForTimeout(150);
      const g = await p.evaluate(() => state.estimates.fsi.F02);
      ok(g.scope.includes('routed to one customer-designated team') && !g.acceptance.includes('both handoff'), `B06: F02 ${band}: one handoff route throughout`);
    }
    const cw = await p.evaluate(() => { const s = CATALOG.find(x => x.id === 'CW07'); return ['small', 'typical', 'large'].map(b => [lineText(s, 'coworker', b, 'scope'), lineText(s, 'coworker', b, 'acceptance')]); });
    ok(cw[0][0].includes('no connections') && !cw[0][1].includes('connections') && cw[2][0].includes('two plugins') && cw[2][1].includes('each plugin'), 'B06: the plugin package says what Small and Large package');
    await p.context().close();
  });

  // ---------- B07: drafts from versions 2 and 3 keep a quantity's hours and wait for a review ----------
  await sec(async () => {
    const p = await fresh(); await p.goto(BASE + 'sow/'); await p.waitForTimeout(400);
    const scope = await p.evaluate(() => CATALOG.find(x => x.id === 'CW01').scope);
    const v3 = qty => ({version: 3, play: 'coworker', currency: 'GBP', months: 12, rate: '', terms: TERMS, briefs: {}, estimates: {coworker: {CW01: {on: true, hours: 20, qty, rate: 199.99, cadence: 'one-time', hoursEdited: false, scope}}}});
    await openDraft(p, v3(2), 'v3q2.json');
    const r2 = await p.evaluate(() => { const r = state.estimates.coworker.CW01, l = selectedLines().find(x => x.id === 'CW01'); return {h: r.hours, e: r.hoursEdited, s: r.scope, fee: l.fee, issues: issues().join(' | ')}; });
    ok(r2.h === 40 && r2.e === true && r2.s.includes('Imported quantity: 2') && r2.fee === 7999.6, 'B07: quantity 2: 40 hours kept as the partner\'s, the note kept, the fee £7,999.60', JSON.stringify(r2));
    ok(r2.issues.includes('opened from an earlier draft with a quantity') && r2.issues.includes('Give the reason'), 'B07: the SOW waits for the combined deliverable and the reason for the hours', r2.issues);
    await services(p);
    const csv = parseCsv(await download(p, async () => { await p.evaluate(() => { const r = state.estimates.coworker.CW01; r.hoursWhy = 'Two workflow briefs were contracted in the earlier version.'; r.scope = r.scope.split('\nImported quantity')[0] + ' Two teams, each with two workflows.'; save(); }); await p.click('[data-step="document"]'); await p.waitForTimeout(200); await p.click('#export-csv'); }));
    const cw = csv.find(r => r[2] === 'Coworker workflow discovery');
    ok(cw && cw[4] === '40' && cw[7] === '7999.6', 'B07: the CSV carries the 40 hours and the fee', JSON.stringify(cw && cw.slice(2, 10)));
    await openDraft(p, v3(1), 'v3q1.json');
    const r1 = await p.evaluate(() => { const r = state.estimates.coworker.CW01; return [r.hours, r.hoursEdited, r.scope.includes('Imported quantity')]; });
    ok(JSON.stringify(r1) === '[20,false,false]', 'B07: quantity 1: unchanged, no note', JSON.stringify(r1));
    await openDraft(p, v3(0), 'v3q0.json');
    const r0 = await p.evaluate(() => { const r = state.estimates.coworker.CW01; return [r.hours, r.hoursEdited, r.scope.includes('Imported quantity: 0')]; });
    ok(JSON.stringify(r0) === '[0,true,true]', 'B07: quantity 0: zero hours kept, with the note', JSON.stringify(r0));
    // the same rule when the browser holds a version 3 state
    await p.evaluate(d => { localStorage.setItem('partner-sow-studio-v6', JSON.stringify(d)); }, v3(2)); await p.reload(); await p.waitForTimeout(500);
    ok(await p.evaluate(() => state.estimates.coworker.CW01.hours === 40 && state.estimates.coworker.CW01.hoursEdited), 'B07: a version 3 state in the browser keeps the 40 hours too');
    await p.context().close();
  });

  // ---------- D01: a draft's retired technical SEO line beside Sites Optimizer's monthly fixes ----------
  await sec(async () => {
    const p = await fresh(); await p.goto(BASE + 'sow/'); await p.waitForTimeout(400);
    const old = await p.evaluate(() => O03_RETIRED.scope);
    await openDraft(p, {version: 4, v14: true, play: 'aem', rate: 150, currency: 'USD', months: 12, terms: TERMS, briefs: {}, estimates: {aem: {O03: {on: true, hours: 56, rate: '', cadence: 'monthly', scope: old}}}}, 'd01.json');
    const i1 = await p.evaluate(() => issues().filter(x => x.includes('Technical SEO')).join(' | '));
    ok(i1.includes('overlaps with Monthly SEO fixes with Sites Optimizer'), 'D01: the kept line beside SO2 must say how it differs, or go, before the SOW is issued', i1);
    await services(p);
    ok((await p.textContent('.service-card[data-line="CUSTOM-O03-aem"] .service-flag')).includes('Overlaps with Monthly SEO fixes'), 'D01: its card says it overlaps');
    await p.click('.service-card[data-line="CUSTOM-O03-aem"] .scope-editor summary');
    await p.fill('.service-card[data-line="CUSTOM-O03-aem"] [data-line-field="scope"]', old + ' Only the separate store microsite at shop.example.com, which Sites Optimizer does not cover.'); await p.waitForTimeout(150);
    ok(!(await p.evaluate(() => issues().some(x => x.includes('Technical SEO')))), 'D01: a distinct scope clears it');
    const d = await draftOf(p);
    ok(JSON.parse(d).custom.find(c => c.id === 'CUSTOM-O03-aem').retiredFrom === 'O03', 'D01: the saved draft remembers where the line came from');
    await openDraft(p, d, 'd01b.json');
    ok(!(await p.evaluate(() => issues().some(x => x.includes('Technical SEO')))) && await p.evaluate(() => state.estimates.aem['CUSTOM-O03-aem'].on && state.estimates.aem.SO2.on), 'D01: reopened, both lines and the resolved review are kept');
    await p.context().close();
  });

  // ---------- money in cents: the CSV matches the SOW to the cent ----------
  await sec(async () => {
    const p = await fresh(); await pick(p, 'coworker', 150); await cont(p);
    await p.evaluate(t => { state.terms = t; state.currency = 'GBP'; save(); }, TERMS); await services(p);
    await p.fill('#service-rate', '199.99'); await p.waitForTimeout(100);
    await p.fill('.service-card[data-line="CW01"] [data-line-field="hours"]', '20.5'); await p.waitForTimeout(100);
    await p.fill('.service-card[data-line="CW06"] [data-line-field="hours"]', '31.7'); await p.waitForTimeout(100);
    await p.evaluate(() => { const r = state.estimates.coworker; r.CW01.hoursWhy = 'Half a day more for a second sponsor.'; r.CW06.hoursWhy = 'Monthly office hours run slightly longer.'; save(); });
    const rows = parseCsv(await csvOf(p)), head = rows[0], lines = rows.slice(1).filter(r => r.length === head.length && r[2] && !r[2].startsWith('Illustrative total')), tot = rows.find(r => r[2] && r[2].startsWith('Illustrative total'));
    const money = v => v === '' || /^\d+(\.\d{1,2})?$/.test(v);
    ok(lines.length > 0 && lines.every(r => money(r[7]) && money(r[9])) && money(tot[9]), 'cents: every fee in the CSV is in cents (no 49175.104999...)', JSON.stringify(lines.map(r => r[9])));
    const sum = Math.round(lines.reduce((a, r) => a + Number(r[9] || 0), 0) * 100) / 100, shown = await toolTotal(p);
    ok(Number(tot[9]) === sum && shown === '£' + sum.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}), `cents: the CSV total is the sum of its lines and matches the SOW (${shown})`, `${tot[9]} / ${sum} / ${shown}`);
    await build(p);
    ok(await canvasTotal(p) === shown, `cents: Build shows the same total, in pounds (${shown})`, await canvasTotal(p));
    await p.context().close();
  });

  // ---------- B01: opening a draft brings its play and choices to the canvas ----------
  await sec(async () => {
    const a = await fresh(); await pick(a, 'cja', 150); await cont(a);
    await a.fill('[data-meta="customer"]', 'Acme Corp'); await a.evaluate(() => { state.months = 6; save(); }); await services(a);
    await a.click('.service-card[data-line="C06"] .remove-line'); await a.waitForTimeout(150); await addLib(a, 'X01');
    const cjaDraft = await draftOf(a), cjaTotal = await toolTotal(a); await a.context().close();
    // into an AEM session
    const p = await fresh(); await pick(p, 'aem', 150); await cont(p);
    await openDraft(p, cjaDraft, 'cja.json');
    ok(await p.evaluate(() => state.play) === 'cja', 'B01 setup: the opened draft shows CJA');
    await build(p);
    const cs = await canvasState(p);
    ok(cs.play === 'cja' && (await p.textContent('#play-label')).includes('Customer Journey Analytics') && await canvasTotal(p) === cjaTotal, `B01: Build shows the draft's play and total (${cjaTotal}), not the earlier AEM canvas`, `${cs.play} ${await canvasTotal(p)}`);
    await cont(p); await services(p);
    const s1 = await p.evaluate(() => ({play: state.play, customer: state.customer, months: state.months, c06: state.estimates.cja.C06.on, x01: state.estimates.cja.X01.on}));
    ok(JSON.stringify(s1) === JSON.stringify({play: 'cja', customer: 'Acme Corp', months: 6, c06: false, x01: true}) && await toolTotal(p) === cjaTotal, 'B01: through Build and back the draft keeps its play, customer, term and choices', JSON.stringify(s1));
    await p.context().close();
    // into an empty browser
    const e = await fresh(); await e.goto(BASE + 'sow/'); await e.waitForTimeout(400);
    await openDraft(e, cjaDraft, 'cja2.json'); await build(e);
    ok((await canvasState(e)).play === 'cja' && await canvasTotal(e) === cjaTotal, 'B01: in an empty browser, Build shows the draft\'s play and total');
    await cont(e);
    ok(await e.evaluate(() => state.play === 'cja' && state.customer === 'Acme Corp' && !state.estimates.cja.C06.on && state.estimates.cja.X01.on), 'B01: and the round trip keeps the draft');
    await e.context().close();
    // two Create your own play drafts with different products
    const mk = async (ids, name) => { const q = await fresh(); await q.goto(BASE); await q.waitForTimeout(300); await q.click('#picker [data-play="custom"]'); await q.waitForTimeout(400);
      for (const id of ids) { if (await q.isHidden('#add-menu')) await q.click('#add-btn');
        if (await q.$(`#add-menu details.nocon [data-add="${id}"]`) && !(await q.$eval('#add-menu details.nocon', d => d.open))) await q.click('#add-menu details.nocon summary');
        await q.click(`#add-menu [data-add="${id}"]`); await q.waitForTimeout(250); }
      await q.fill('#rate', '150'); await q.mouse.click(40, 938); await q.waitForTimeout(200); await cont(q); await services(q);
      const d = await draftOf(q), t = await toolTotal(q); await q.context().close(); return {d, t, name}; };
    const one = await mk(['bv', 'cja'], 'one'), two = await mk(['commerce', 'eds'], 'two');
    const c = await fresh(); await c.goto(BASE + 'sow/'); await c.waitForTimeout(400);
    for (const x of [one, two]) {
      await openDraft(c, x.d, x.name + '.json'); await build(c);
      const on = (await canvasState(c)).on.slice().sort().join(',');
      ok(on === JSON.parse(x.d).customProducts.slice().sort().join(',') && await canvasTotal(c) === x.t, `B01: Create your own play draft "${x.name}": Build shows its products (${on}) and total (${x.t})`, `${on} ${await canvasTotal(c)}`);
      await cont(c); await services(c);
      ok(await toolTotal(c) === x.t, `B01: draft "${x.name}": the round trip keeps its services`, await toolTotal(c));
    }
    // an older custom draft that saved only the product names
    const named = JSON.parse(two.d); delete named.customProducts;
    await openDraft(c, named, 'named.json'); await build(c);
    ok((await canvasState(c)).on.slice().sort().join(',') === 'commerce,eds' || (await c.evaluate(() => st.on.slice().sort().join(','))) === 'commerce,eds', 'B01: an older draft with only product names gets its products back by name', JSON.stringify(await c.evaluate(() => st.on)));
    await c.context().close();
  });

  // ---------- wording (C01, C02, C03, L03, F02) in the downloaded SOW ----------
  await sec(async () => {
    const p = await fresh(); await pick(p, 'aem', 150); await cont(p);
    await p.evaluate(t => { state.terms = t; save(); }, TERMS); await services(p);
    await addLib(p, 'L03');
    const aem = await htmlOf(p);
    ok(aem.includes('Core Web Vitals fixes are prepared as code patches') && aem.includes('reviews, tests, merges and releases') && aem.includes('downloaded patch') && aem.includes('broken-backlink redirects through Dispatcher') && aem.includes('Operational Telemetry') && aem.includes('at least 1,000 page views') && !aem.includes('Adobe documents no direct publishing link') && !aem.includes('are Early Access features'),
      'C01/C03: the AEM SOW names the content and code routes, the developer, Early Access and the 1,000 page views, and no longer rules out a Brand Visibility to AEM route');
    ok(aem.includes('check that each selected page sends a Last-Modified header') && aem.includes('Using the agreed Optimize at Edge route') && aem.includes('set up self-serve in Brand Visibility'), 'L03: the pilot checks Last-Modified as work in its scope and deploys on the agreed edge route (self-serve on Adobe\'s managed Fastly CDN)');
    await p.context().close();
    const q = await fresh(); await pick(q, 'cja', 150); await cont(q);
    await q.evaluate(t => { state.terms = t; save(); }, TERMS); await services(q);
    const cja = await htmlOf(q);
    ok(cja.includes('Audience Publishing') && cja.includes('Manage Profiles') && cja.includes('Person ID') && cja.includes('is activated there after the audience is published') && !cja.includes('or another supported destination'),
      'C02: the CJA SOW requires Real-Time Customer Profile, the permissions and the Person ID');
    const f = await q.evaluate(() => { const s = CATALOG.find(x => x.id === 'F02'); return [s.source, s.source2, s.assumptions]; });
    ok(f[0].includes('pre-go-live') && f[1].includes('sales-handoff') && f[2].includes("don't need Marketo Engage"), 'F02: cites the pre-go-live checklist and the live chat and meeting booking page; plain chat and meetings need no Marketo Engage');
    await q.context().close();
    const r = await fresh(); await pick(r, 'fsi', 150); await cont(r); await services(r);
    const refs = await r.textContent('.service-card[data-line="F02"] .service-source');
    ok(refs.includes('pre-go-live checklist and rollout plan; Experience League: Brand Concierge live chat and meeting booking') && (await r.$$('.service-card[data-line="F02"] .service-source a')).length === 2, 'F02: its card shows both references, each with its own title', refs);
    await r.context().close();
  });

  // ---------- step 1b: Commerce's deployment pilot is an add-on; FSI's question mapping only for a live and healthy concierge ----------
  await sec(async () => {
    const p = await fresh(); await pick(p, 'commerce', 150);
    ok(await canvasTotal(p) === '$222,000' && !(await p.evaluate(() => lineOn('L03'))), 'step 1b: Commerce starts without the deployment pilot on the canvas ($222,000)', await canvasTotal(p));
    await cont(p); await services(p);
    ok(await toolTotal(p) === '$222,000' && !(await p.evaluate(() => state.estimates.commerce.L03.on)) && await p.isVisible('#service-extensions [data-add="L03"]'), 'step 1b: and on Services, with the pilot one click away under the optional services');
    await p.click('#service-extensions [data-add="L03"]'); await p.waitForTimeout(200);
    const t = await toolTotal(p); await build(p);
    ok(await canvasTotal(p) === t && await p.evaluate(() => lineOn('L03')), `step 1b: added on Services, the pilot is on the canvas too (${t})`);
    await p.context().close();
    const q = await fresh(); await pick(q, 'fsi', 150);
    ok(await canvasTotal(q) === '$300,000' && !(await q.evaluate(() => lineOn('C04'))), 'step 1b: FSI starts without the separate question mapping ($300,000)', await canvasTotal(q));
    await cont(q); await services(q);
    const n = await q.evaluate(() => ({c04: state.estimates.fsi.C04.on, f02: state.estimates.fsi.F02.on, scope: state.estimates.fsi.F02.scope}));
    ok(await toolTotal(q) === '$300,000' && !n.c04 && n.f02 && n.scope.includes('priority discovery questions from the Brand Visibility program'), 'step 1b: a new concierge\'s build tests the Brand Visibility questions', JSON.stringify(n).slice(0, 200));
    for (const [answer, f02, c04] of [['healthy', false, true], ['remediate', true, false], ['new', true, false]]) {
      await q.click('[data-step="scope"]'); await q.selectOption('[data-meta="fsiState"]', answer); await q.waitForTimeout(150); await services(q);
      const r = await q.evaluate(() => [state.estimates.fsi.F02.on, state.estimates.fsi.C04.on]), t2 = await toolTotal(q);
      await build(q);
      ok(JSON.stringify(r) === JSON.stringify([f02, c04]) && await q.evaluate(() => [lineOn('F02'), lineOn('C04')]).then(x => JSON.stringify(x)) === JSON.stringify([f02, c04]) && await canvasTotal(q) === t2,
        `step 1b: Brand Concierge ${answer}: the build ${f02 ? 'on' : 'off'}, the question mapping ${c04 ? 'on' : 'off'}, on Services and the canvas (${t2})`, JSON.stringify(r));
      await cont(q); await services(q);
    }
    await addLib(q, 'C04');
    ok((await q.evaluate(() => issues().join(' | '))).includes('overlaps with Implement Brand Concierge'), 'step 1b: with a new concierge, adding the question mapping asks how it differs from the build');
    await q.context().close();
  });

  // ---------- drafts saved with the earlier wording follow the new wording, not marked as edited ----------
  await sec(async () => {
    const p = await fresh(); await p.goto(BASE + 'sow/'); await p.waitForTimeout(400);
    const cases = await p.evaluate(() => { const out = [];
      for (const src of [PRIOR17, PRIOR18]) for (const id of Object.keys(src)) for (const key of Object.keys(src[id])) for (const t of src[id][key]) {
        const c = CATALOG.find(x => x.id === id); const play = c.plays.includes('aem') ? 'aem' : c.plays[0]; out.push({id, key, play, t}); }
      return out; });
    let bad = [];
    for (const c of cases) {
      const d = {version: 4, v14: true, play: c.play, rate: 150, currency: 'USD', months: 12, briefs: {}, estimates: {[c.play]: {[c.id]: {on: true, hours: 0, rate: '', cadence: 'one-time', [c.key]: c.t}}}};
      d.estimates[c.play][c.id].hours = await p.evaluate(id => CATALOG.find(x => x.id === id).base, c.id);
      await openDraft(p, d, 'prior.json');
      const r = await p.evaluate(([play, id, key]) => { const s = CATALOG.find(x => x.id === id), r = state.estimates[play][id]; return {same: r[key] === lineText(s, play, r.band, key), edited: r.scopeChanged}; }, [c.play, c.id, c.key]);
      if (!r.same || r.edited) bad.push(c.id + '.' + c.key);
    }
    ok(cases.length >= 15 && !bad.length, `drafts with the step 16 or 17 wording follow the new wording, not marked as edited (${cases.length} texts)`, bad.join(', '));
    await p.context().close();
  });

  // ---------- a second review tried to break the round trip (step 20) ----------
  const addProd = async (p, id) => { if (await p.isHidden('#add-menu')) await p.click('#add-btn');
    if (await p.$(`#add-menu details.nocon [data-add="${id}"]`) && !(await p.$eval('#add-menu details.nocon', d => d.open))) await p.click('#add-menu details.nocon summary');
    await p.click(`#add-menu [data-add="${id}"]`); await p.waitForTimeout(300); };
  const closeMenu = async p => { if (!(await p.isHidden('#add-menu'))) { await p.mouse.click(40, 938); await p.waitForTimeout(200); } };
  await sec(async () => {
    // 1. a line that waits for a product on the canvas isn't offered on Services, and keeps its choice while it waits
    const p = await fresh(); await p.goto(BASE); await p.waitForTimeout(300); await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400);
    for (const id of ['target', 'cja']) await addProd(p, id);
    await closeMenu(p); await p.fill('#rate', '150'); await p.waitForTimeout(100); await cont(p); await services(p);
    await p.click('#add-service'); await p.waitForTimeout(150);
    ok(!(await p.$('#available-services [data-add="CANVAS-TC04"]')) && !(await p.evaluate(() => entries().some(s => s.id === 'CANVAS-TC04'))), 'R1: a line the canvas shows as waiting for Real-Time CDP or Journey Optimizer is not offered on Services');
    await p.click('#close-modal'); await p.waitForTimeout(100);
    await build(p); await addProd(p, 'rtcdp'); await closeMenu(p);
    const withRt = await canvasTotal(p); await cont(p); await services(p);
    ok(await p.evaluate(() => state.estimates.custom['CANVAS-TC04'].on) && await toolTotal(p) === withRt, `R1: with Real-Time CDP added, the line is in, on both pages (${withRt})`, await toolTotal(p));
    await build(p); await p.click('.node[data-p="rtcdp"]'); await p.waitForTimeout(300); await p.click('#card [data-rm="rtcdp"]'); await p.waitForTimeout(300);
    const without = await canvasTotal(p); await cont(p); await services(p);
    ok(await toolTotal(p) === without, `R1: without Real-Time CDP both pages leave the waiting line out (${without})`, await toolTotal(p));
    await build(p); await addProd(p, 'rtcdp'); await closeMenu(p);
    ok(await canvasTotal(p) === withRt, `R1: Real-Time CDP back after a trip: the line is back as it was (${withRt})`, await canvasTotal(p));
    await cont(p); await services(p);
    ok(await toolTotal(p) === withRt && await p.evaluate(() => state.estimates.custom['CANVAS-TC04'].on), 'R1: and Services agrees');
    await p.context().close();
  });
  await sec(async () => {
    // 2. picking the play again clears the partner's own services too, on both pages
    const p = await fresh(); await pick(p, 'cja', 150); await cont(p); await services(p);
    await p.click('[data-own="Launch"]'); await p.waitForTimeout(150);
    await p.fill('[data-own-form] [name="own-name"]', 'Kickoff workshop'); await p.fill('[data-own-form] [name="own-hours"]', '20'); await p.fill('[data-own-form] [name="own-scope"]', 'One half-day kickoff with the customer team.');
    await p.click('[data-own-form] button.primary'); await p.waitForTimeout(200); await addLib(p, 'X01');
    const t1 = await toolTotal(p); await build(p);
    ok(await canvasTotal(p) === t1, `R2 setup: the own service and X01 are in the canvas total (${t1})`, await canvasTotal(p));
    await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300); await p.click('#picker [data-play="cja"]'); await p.waitForTimeout(400);
    const t2 = await canvasTotal(p); await cont(p); await services(p);
    const own = await p.evaluate(() => state.custom.filter(c => c.plays.includes('cja')).map(c => state.estimates.cja[c.id].on));
    ok(await toolTotal(p) === t2 && t2 === '$219,600' && own.length === 1 && own[0] === false, `R2: picking CJA again: both pages at ${t2}, the own service off (still under Add service)`, `${await toolTotal(p)} ${JSON.stringify(own)}`);
    await p.context().close();
  });
  await sec(async () => {
    // 3. Start over on the canvas resets the term
    const p = await fresh(); await pick(p, 'cja', 150); await cont(p);
    await p.fill('[data-meta="months"]', '6'); await p.waitForTimeout(150); await build(p);
    await p.click('#start-over'); await p.click('#confirm-yes'); await p.waitForTimeout(300); await p.click('#picker [data-play="cja"]'); await p.waitForTimeout(400);
    if (!(await p.inputValue('#rate'))) { await p.fill('#rate', '150'); await p.waitForTimeout(100); }
    const t = await canvasTotal(p), k = (await p.textContent('#t-k')).trim();
    await cont(p); await services(p);
    ok(k.includes('12-month term') && t === '$219,600' && await toolTotal(p) === t, `R3: after Start over the term is 12 months on both pages (${t})`, `${k} ${t} ${await toolTotal(p)}`);
    await p.context().close();
  });
  await sec(async () => {
    // 4 and 5. the FSI answer and its services stay in step
    const p = await fresh(); await pick(p, 'fsi', 150); await cont(p);
    await p.selectOption('[data-meta="fsiState"]', 'healthy'); await p.waitForTimeout(150); await build(p);
    await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300); await p.click('#picker [data-play="fsi"]'); await p.waitForTimeout(400);
    const c = await p.evaluate(() => [lineOn('F02'), lineOn('C04')]), t = await canvasTotal(p);
    await cont(p); await services(p);
    const s1 = await p.evaluate(() => [state.fsiState, state.estimates.fsi.F02.on, state.estimates.fsi.C04.on]);
    ok(JSON.stringify(c) === '[false,true]' && JSON.stringify(s1) === '["healthy",false,true]' && await toolTotal(p) === t, `R4: picking FSI again with Live and healthy: the build off and the question mapping on, on both pages (${t})`, `${JSON.stringify(c)} ${JSON.stringify(s1)} ${await toolTotal(p)}`);
    await p.click('[data-step="scope"]'); await p.selectOption('[data-meta="fsiState"]', 'remediate'); await p.waitForTimeout(150); await services(p);
    await p.click('.service-card[data-line="F02"] .remove-line'); await p.waitForTimeout(150);
    ok((await p.evaluate(() => issues().join(' | '))).includes('live but needs fixes, and Implement Brand Concierge is off'), 'R5: Live but needs fixes without Implement Brand Concierge is caught before the SOW is issued');
    await p.context().close();
  });
  await sec(async () => {
    // 6. the browser Back button keeps canvas edits
    const p = await fresh(); await pick(p, 'cja', 150); await cont(p); await build(p);
    await p.click('#size [data-size="large"]'); await p.waitForTimeout(150); await p.fill('#rate', '200'); await p.waitForTimeout(150);
    await p.click('.node[data-p="cja"]'); await p.waitForTimeout(300); await p.click('#card [data-t="C06"]'); await p.waitForTimeout(150); await p.click('#card [data-close]');
    const t = await canvasTotal(p);
    await p.goBack(); await p.waitForTimeout(600); await services(p);
    const s1 = await p.evaluate(() => [state.size, state.rate, state.estimates.cja.C06.on]);
    ok(JSON.stringify(s1) === '["large",200,false]' && await toolTotal(p) === t, `R6: Back from the canvas: the SOW steps have the canvas's size, rate and choices (${t})`, `${JSON.stringify(s1)} ${await toolTotal(p)}`);
    await build(p);
    ok(await canvasTotal(p) === t, 'R6: and Build still shows them', await canvasTotal(p));
    await cont(p); await services(p); await addLib(p, 'X01'); await build(p);
    await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300); await p.click('#picker [data-play="cja"]'); await p.waitForTimeout(400);
    const t2 = await canvasTotal(p);
    await p.goBack(); await p.waitForTimeout(600); await services(p);
    const s2 = await toolTotal(p); await build(p);
    ok(s2 === t2 && await canvasTotal(p) === t2, `R6: Change play, the same play again, then Back: both pages agree (${t2})`, `${s2} ${await canvasTotal(p)}`);
    await p.context().close();
  });
  await sec(async () => {
    // 7. a rate of 0 is no rate on both pages; 8. Build from an empty browser shows the picker; 10. typed hours keep two decimals
    const p = await fresh(); await pick(p, 'abv', 150); await cont(p); await services(p);
    await p.fill('#service-rate', '0'); await p.waitForTimeout(150);
    const blankTool = await toolTotal(p); await build(p);
    ok(await p.evaluate(() => st.rate) === 0 && blankTool.includes('___') && await canvasTotal(p) === '$ ___', 'R7: a rate of 0 leaves both pages asking for a rate', `${blankTool} ${await canvasTotal(p)}`);
    await p.context().close();
    const e = await fresh(); await e.goto(BASE + 'sow/'); await e.waitForTimeout(400); await build(e);
    ok(await e.isVisible('#picker') && (await canvasState(e) || {}).play == null, 'R8: Build from the SOW steps in an empty browser shows the play picker');
    await e.context().close();
    const q = await fresh(); await pick(q, 'coworker', 100); await cont(q);
    await q.evaluate(t => { state.terms = t; save(); }, TERMS); await services(q);
    await q.fill('.service-card[data-line="CW01"] [data-line-field="hours"]', '10.555'); await q.waitForTimeout(150);
    await q.evaluate(() => { state.estimates.coworker.CW01.hoursWhy = 'One extra short session with the sponsor.'; save(); });
    const h = await q.evaluate(() => state.estimates.coworker.CW01.hours), htm = await htmlOf(q);
    ok(h === 10.56 && htm.includes('10.56') && htm.includes('$1,056') && !htm.includes('$1,055.50'), 'R10: typed hours keep two decimals, so the fee table multiplies out (10.56 h at $100 is $1,056)', `${h}`);
    await q.context().close();
  });

  // ---------- the last verification pass (step 21) ----------
  const pickCustom = async (p, ids, rate = 150) => { await p.goto(BASE); await p.waitForTimeout(300); await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400);
    for (const id of ids) await addProd(p, id); await closeMenu(p); if (rate !== null) { await p.fill('#rate', String(rate)); await p.waitForTimeout(100); } };
  const removeProd = async (p, id) => { await p.click(`.node[data-p="${id}"]`); await p.waitForTimeout(300); await p.click(`#card [data-rm="${id}"]`); await p.waitForTimeout(300); };
  await sec(async () => {
    // a product taken off and added back keeps the Services edits on its lines
    const p = await fresh(); await pickCustom(p, ['bv', 'cja']); await cont(p); await services(p);
    await p.fill('.service-card[data-line="CANVAS-L01"] [data-line-field="hours"]', '99'); await p.waitForTimeout(150);
    await p.evaluate(() => { state.estimates.custom['CANVAS-L01'].hoursWhy = 'Two brands share one prompt plan.'; save(); });
    await p.fill('.service-card[data-line="CANVAS-C06"] [data-line-field="rate"]', '210'); await p.waitForTimeout(150);
    const t = await toolTotal(p); await build(p); await removeProd(p, 'bv'); await cont(p); await services(p);
    ok(!(await p.evaluate(() => entries().some(s => s.id === 'CANVAS-L01'))), 'S21: with Brand Visibility off the canvas, its lines leave Services');
    await build(p); await addProd(p, 'bv'); await closeMenu(p);
    const ct = await canvasTotal(p); await cont(p); await services(p);
    const r = await p.evaluate(() => [state.estimates.custom['CANVAS-L01'].hours, state.estimates.custom['CANVAS-L01'].hoursWhy, state.estimates.custom['CANVAS-C06'].rate]);
    ok(JSON.stringify(r) === JSON.stringify([99, 'Two brands share one prompt plan.', 210]) && ct === t && await toolTotal(p) === t, `S21: added back after a trip, its lines keep their hours, reason and the connection's rate (${t})`, `${JSON.stringify(r)} ${ct} ${await toolTotal(p)}`);
    // picking Create your own play again with no products, then Back: a clean start
    await p.click('[data-own="Launch"]'); await p.waitForTimeout(150);
    await p.fill('[data-own-form] [name="own-name"]', 'Kickoff workshop'); await p.fill('[data-own-form] [name="own-hours"]', '12.25'); await p.fill('[data-own-form] [name="own-scope"]', 'One half-day kickoff with the customer team.');
    await p.click('[data-own-form] button.primary'); await p.waitForTimeout(200);
    ok(await p.evaluate(() => state.custom.some(c => c.name === 'Kickoff workshop' && c.base === 12.25)), "S21: the partner's own service takes hours like 12.25");
    await p.click('.service-card[data-line="CANVAS-L02"] .remove-line'); await p.waitForTimeout(150);
    await build(p); await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300); await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400); await closeMenu(p);
    await p.goBack(); await p.waitForTimeout(700);
    const back = await p.evaluate(() => ({lines: entries().filter(s => row(s).on).length, own: state.custom.filter(c => c.plays.includes('custom')).map(c => state.estimates.custom[c.id].on)}));
    ok(back.lines === 0 && back.own.every(x => x === false), 'S21: Create your own play picked again, then Back: the SOW steps start over too', JSON.stringify(back));
    await p.goForward(); await p.waitForTimeout(700);
    if (await p.isVisible('#picker')) { await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400); }
    for (const id of ['bv', 'cja']) await addProd(p, id); await closeMenu(p);
    const t2 = await canvasTotal(p); await cont(p); await services(p);
    ok(t2 === '$219,600' && await toolTotal(p) === t2 && await p.evaluate(() => state.estimates.custom['CANVAS-L02'].on), `S21: and the products added again start fresh on both pages (${t2})`, `${t2} ${await toolTotal(p)}`);
    await p.context().close();
  });
  await sec(async () => {
    // the generic Coworker Skills are replaced whatever the order products are added in
    const p = await fresh(); await pickCustom(p, ['cw']); await cont(p); await build(p);
    await addProd(p, 'cja'); await closeMenu(p);
    const t = await canvasTotal(p); await cont(p); await services(p);
    ok(t === '$88,200' && await toolTotal(p) === t && !(await p.evaluate(() => issues().some(x => x.includes('overlaps with Coworker Skills')))), `S21: Coworker, a trip, then CJA: the generic Skills are replaced, as when both are added at once (${t})`, `${t} ${await toolTotal(p)}`);
    await p.context().close();
    // Create your own play with Brand Visibility and Brand Concierge starts without the overlapping pair, and in neutral names
    const q = await fresh(); await pickCustom(q, ['bv', 'bc']);
    const names = await q.evaluate(() => [lineOn('C04'), lineName('C04'), lineName('FSI01')]);
    ok(JSON.stringify(names) === JSON.stringify([false, 'Discovery-to-answer workflow', 'Answer and source review']), 'S21: on your own play the question mapping starts off, and lines read without financial-services wording', JSON.stringify(names));
    await cont(q); await q.evaluate(t => { state.terms = t; save(); }, TERMS);
    ok(!(await q.evaluate(() => issues().some(x => x.includes('overlaps')))), 'S21: and the SOW steps raise no overlap the partner did not create');
    await q.context().close();
  });
  await sec(async () => {
    // old drafts keep their own hours; rates keep two decimals; remediation advice; no services and no rate
    const p = await fresh(); await p.goto(BASE + 'sow/'); await p.waitForTimeout(400);
    await openDraft(p, {version: 3, play: 'coworker', rate: 133.333, terms: TERMS, estimates: {coworker: {CW01: {on: true, hours: 20, qty: 2}, CW02: {on: true, hours: 30, qty: 1}, CW05: {on: true, hours: 36}}}}, 'v3own.json');
    const r = await p.evaluate(() => { const e = state.estimates.coworker; return [e.CW02.hours, e.CW02.hoursEdited, e.CW05.hours, e.CW05.hoursEdited, state.rate, issues().filter(x => x.includes('Give the reason')).length]; });
    ok(JSON.stringify(r) === JSON.stringify([30, true, 36, true, 133.33, 3]), 'S21: an old draft keeps hours that match no band (30 and 36) as the partner\'s, asks for reasons, and keeps the rate to the cent', JSON.stringify(r));
    await p.evaluate(() => { state.play = 'fsi'; state.fsiState = 'remediate'; save(); });
    ok(!(await p.evaluate(() => issues().join(' ').includes('or remove it'))), 'S21: Live but needs fixes no longer suggests removing the build');
    await p.evaluate(() => { state.play = 'abv'; state.rate = ''; for (const s of entries()) row(s).on = false; go('services'); });
    ok((await toolTotal(p)).includes('___'), 'S21: no services and no rate: the total asks for a rate, as Build does', await toolTotal(p));
    await p.context().close();
  });
  await sec(async () => {
    // Start over on the canvas, then Back: the rate and size stay; the step stays in the address; a clock set back
    const p = await fresh(); await pick(p, 'cja', 175); await p.click('#size [data-size="large"]'); await p.waitForTimeout(150); await cont(p); await services(p);
    await build(p); await p.click('#start-over'); await p.click('#confirm-yes'); await p.waitForTimeout(300);
    await p.goBack(); await p.waitForTimeout(700);
    const sw = await p.evaluate(() => [state.rate, state.size, step]);
    await p.goForward(); await p.waitForTimeout(600);
    const cv = await p.evaluate(() => [st.rate, st.size]);
    ok(JSON.stringify(sw) === JSON.stringify([175, 'large', 'services']) && JSON.stringify(cv) === JSON.stringify([175, 'large']), 'S21: after Start over on the canvas, Back and Forward keep the rate and size, and Back returns to the Services step', `${JSON.stringify(sw)} ${JSON.stringify(cv)}`);
    await p.click('#picker [data-play="cja"]'); await p.waitForTimeout(400); await cont(p);
    await p.evaluate(() => { state.handoffAt = Date.now() + 1e10; save(); });
    await build(p); await p.click('#size [data-size="small"]'); await p.waitForTimeout(150); await cont(p);
    ok(await p.evaluate(() => state.size) === 'small', 'S21: a hand-over is applied even when the clock went back');
    await p.context().close();
  });
  await sec(async () => {
    // an engagement started on the SOW steps in an empty browser keeps its rate and size through Build
    const p = await fresh(); await p.goto(BASE + 'sow/#services'); await p.waitForTimeout(400);
    await p.fill('#service-rate', '160'); await p.waitForTimeout(100); await p.click('#size-switch [data-size="large"]'); await p.waitForTimeout(150);
    await build(p);
    const cv = await p.evaluate(() => [st.rate, st.size, !!st.play]);
    await p.click('#picker [data-play="cja"]'); await p.waitForTimeout(400); const t = await canvasTotal(p); await cont(p); await services(p);
    ok(JSON.stringify(cv) === '[160,"large",false]' && await p.evaluate(() => state.rate === 160 && state.size === 'large') && await toolTotal(p) === t, `S21: started on the SOW steps in an empty browser: Build shows the picker with the rate and size, and the trip keeps them (${t})`, `${JSON.stringify(cv)} ${await toolTotal(p)} ${t}`);
    await p.context().close();
  });
  await sec(async () => {
    // two tabs: a tab that comes back into view after the other changed the tool reloads first
    const ctx = await b.newContext({viewport: {width: 1600, height: 950}}); const a = await ctx.newPage(); const s2 = await ctx.newPage();
    a.on('pageerror', e => errs.push(e.message)); s2.on('pageerror', e => errs.push(e.message));
    await a.goto(BASE); await a.waitForTimeout(300); await a.click('#picker [data-play="cja"]'); await a.waitForTimeout(400); await a.fill('#rate', '150'); await a.waitForTimeout(150);
    await a.click('#save'); await a.waitForURL('**/sow/index.html#scope'); await a.waitForTimeout(400); await a.click('.steps [data-build]'); await a.waitForURL(u => !/\/sow\//.test(String(u))); await a.waitForTimeout(400);
    await s2.goto(BASE + 'sow/#services'); await s2.waitForTimeout(500);
    await a.bringToFront(); await Promise.all([a.waitForNavigation({timeout: 2500}).catch(() => null), a.evaluate(() => window.dispatchEvent(new Event('focus'))).catch(() => null)]); await a.waitForTimeout(400);
    await a.click('.node[data-p="cja"]'); await a.waitForTimeout(300); await a.click('#card [data-t="C06"]'); await a.waitForTimeout(150);
    const t = await canvasTotal(a);
    await s2.bringToFront(); await Promise.all([s2.waitForNavigation({timeout: 5000}).catch(() => null), s2.evaluate(() => window.dispatchEvent(new Event('focus'))).catch(() => null)]); await s2.waitForTimeout(600);
    await s2.fill('[data-meta="customer"]', 'Acme Corp').catch(async () => { await s2.click('[data-step="scope"]'); await s2.fill('[data-meta="customer"]', 'Acme Corp'); });
    await s2.waitForTimeout(200); await s2.click('[data-step="services"]'); await s2.waitForTimeout(300);
    ok(await toolTotal(s2) === t && !(await s2.evaluate(() => state.estimates.cja.C06.on)), `S21: two tabs: the SOW tab picks up the canvas tab's change when it comes back into view (${t})`, await toolTotal(s2));
    await a.bringToFront(); await Promise.all([a.waitForNavigation({timeout: 2500}).catch(() => null), a.evaluate(() => window.dispatchEvent(new Event('focus'))).catch(() => null)]); await a.waitForTimeout(600);
    ok(await canvasTotal(a) === t && !(await a.evaluate(() => lineOn('C06'))), 'S21: and the canvas tab keeps it, with nothing written back over it');
    await ctx.close();
  });

  // ---------- the focused verification of step 21 (step 22) ----------
  await sec(async () => {
    // Change play then the same play: every line starts over, edits included (fixed play and your own play)
    const p = await fresh(); await pick(p, 'cja', 150); await cont(p); await services(p);
    await p.fill('.service-card[data-line="C06"] [data-line-field="hours"]', '99'); await p.waitForTimeout(100);
    await p.evaluate(() => { state.estimates.cja.C06.hoursWhy = 'Ten audiences across two brands.'; save(); });
    await p.fill('.service-card[data-line="L01"] [data-line-field="rate"]', '210'); await p.waitForTimeout(100);
    await p.click('.service-card[data-line="C01"] .scope-editor summary');
    const sc = await p.inputValue('.service-card[data-line="C01"] [data-line-field="scope"]');
    await p.fill('.service-card[data-line="C01"] [data-line-field="scope"]', sc + ' Includes the second domain.'); await p.waitForTimeout(100);
    await build(p); await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300); await p.click('#picker [data-play="cja"]'); await p.waitForTimeout(400);
    const ct = await canvasTotal(p); await cont(p); await services(p);
    const r = await p.evaluate(() => { const e = state.estimates.cja, c = CATALOG.find(x => x.id === 'C01'); return [e.C06.hours, e.C06.hoursWhy, e.L01.rate, e.C01.scope === lineText(c, 'cja', e.C01.band, 'scope')]; });
    ok(ct === '$219,600' && await toolTotal(p) === ct && JSON.stringify(r) === JSON.stringify([48, '', '', true]), `S22: CJA picked again: hours, reasons, line rates and texts start over on both pages (${ct})`, `${ct} ${await toolTotal(p)} ${JSON.stringify(r)}`);
    await p.context().close();
    const q = await fresh(); await pickCustom(q, ['bv', 'cja']); await cont(q); await services(q);
    await q.fill('.service-card[data-line="CANVAS-L01"] [data-line-field="hours"]', '99'); await q.waitForTimeout(100);
    await build(q); await q.click('#change-play'); await q.click('#confirm-yes'); await q.waitForTimeout(300); await q.click('#picker [data-play="custom"]'); await q.waitForTimeout(400);
    for (const id of ['bv', 'cja']) await addProd(q, id); await closeMenu(q);
    const ct2 = await canvasTotal(q); await cont(q); await services(q);
    ok(ct2 === '$219,600' && await toolTotal(q) === ct2 && await q.evaluate(() => state.estimates.custom['CANVAS-L01'].hours) === 64, `S22: your own play picked again with the same products, without Back: a clean start too (${ct2})`, `${ct2} ${await toolTotal(q)}`);
    await q.context().close();
  });
  await sec(async () => {
    // an edit to Excluded work alone is kept through a reload and a trip
    const p = await fresh(); await pick(p, 'cja', 150); await cont(p); await p.evaluate(t => { state.terms = t; save(); }, TERMS); await services(p);
    await p.click('.service-card[data-line="C06"] .scope-editor summary');
    const ex = await p.inputValue('.service-card[data-line="C06"] [data-line-field="exclusions"]');
    await p.fill('.service-card[data-line="C06"] [data-line-field="exclusions"]', ex + ' Paid media audiences are excluded.'); await p.waitForTimeout(100);
    await p.reload(); await p.waitForTimeout(500); await build(p); await cont(p); await services(p);
    const csv = await csvOf(p);
    ok((await p.evaluate(() => state.estimates.cja.C06.exclusions)).endsWith('Paid media audiences are excluded.') && csv.includes('Paid media audiences are excluded.'), 'S22: an edit to Excluded work alone survives a reload and a trip, into the CSV');
    await p.context().close();
  });
  await sec(async () => {
    // the generic Coworker Skills kept beside the CJA Skills stay kept while CJA is off the canvas
    const p = await fresh(); await pickCustom(p, ['cw', 'cja']);
    await p.click('.node[data-p="cw"]'); await p.waitForTimeout(300); await p.click('#card [data-keep="CW03"]'); await p.waitForTimeout(150); await p.click('#card [data-close]');
    const kept = await canvasTotal(p); await cont(p); await build(p); await removeProd(p, 'cja'); await cont(p); await build(p);
    await addProd(p, 'cja'); await closeMenu(p);
    const back = await canvasTotal(p); await cont(p); await services(p);
    ok(kept === '$96,600' && back === kept && await toolTotal(p) === kept && await p.evaluate(() => state.estimates.custom['CANVAS-CW03'].on), `S22: kept generic Skills stay kept while CJA is away and back (${kept})`, `${kept} ${back} ${await toolTotal(p)}`);
    await p.context().close();
  });
  await sec(async () => {
    // old drafts without hours flags keep hours that equal another band; ?play= applies once; messages
    const p = await fresh(); await p.goto(BASE + 'sow/'); await p.waitForTimeout(400);
    await openDraft(p, {version: 3, play: 'coworker', rate: 150, terms: TERMS, estimates: {coworker: {CW02: {on: true, hours: 16, qty: 1}, CW05: {on: true, hours: 40}}}}, 'v3band.json');
    const r = await p.evaluate(() => { const e = state.estimates.coworker; return [e.CW02.hours, e.CW02.band, e.CW05.hours, e.CW05.band]; });
    ok(JSON.stringify(r) === JSON.stringify([16, 'small', 40, 'large']), 'S22: an old draft keeps hours that equal another band, as that band', JSON.stringify(r));
    await openDraft(p, {version: 4, v14: true, play: 'custom', rate: 150, currency: 'USD', months: 12, briefs: {}, customProducts: [], customNames: [], estimates: {custom: {}}}, 'empty.json');
    ok((await p.textContent('#toast')).includes('Draft opened with no products on the canvas'), 'S22: a draft with no products on the canvas opens with a message that fits');
    await services(p);
    ok((await p.textContent('#service-lines')).includes('Add products on the Build canvas'), 'S22: the empty Services step on your own play points to Build');
    await p.goto(BASE + 'sow/?play=fsi#scope'); await p.waitForTimeout(500);
    ok(await p.evaluate(() => location.search === '' && location.hash === '#scope' && state.play === 'fsi'), 'S22: a ?play= link applies its play once and leaves the address');
    ok(await p.evaluate(() => { reloading = true; const before = localStorage.getItem(KEY); state.customer = 'Should not be saved'; save(); const after = localStorage.getItem(KEY); reloading = false; return before === after; }), 'S22: a page reloading to catch up saves nothing more');
    await p.context().close();
  });
  await sec(async () => {
    // two tabs: switching with no change reloads neither; Start over in one is seen in the other
    const ctx = await b.newContext({viewport: {width: 1600, height: 950}}); const a = await ctx.newPage(); const s2 = await ctx.newPage();
    a.on('pageerror', e => errs.push(e.message)); s2.on('pageerror', e => errs.push(e.message));
    let loadsA = 0, loadsB = 0; a.on('load', () => loadsA++); s2.on('load', () => loadsB++);
    await a.goto(BASE); await a.waitForTimeout(300); await a.click('#picker [data-play="cja"]'); await a.waitForTimeout(400); await a.fill('#rate', '150'); await a.waitForTimeout(150);
    await a.click('#save'); await a.waitForURL('**/sow/index.html#scope'); await a.waitForTimeout(400); await a.fill('[data-meta="customer"]', 'Acme Corp'); await a.waitForTimeout(150);
    await a.click('.steps [data-build]'); await a.waitForURL(u => !/\/sow\//.test(String(u))); await a.waitForTimeout(400);
    await s2.goto(BASE + 'sow/#services'); await s2.waitForTimeout(500);
    const focus = async pg => { await pg.bringToFront(); await Promise.all([pg.waitForNavigation({timeout: 1500}).catch(() => null), pg.evaluate(() => { window.dispatchEvent(new Event('focus')); }).catch(() => null)]); await pg.waitForTimeout(300); };
    await focus(a); await focus(s2);
    const a0 = loadsA, b0 = loadsB;
    await s2.click('[data-own="Launch"]'); await s2.waitForTimeout(150); await s2.fill('[data-own-form] [name="own-name"]', 'Half typed');
    for (let i = 0; i < 3; i++) { await focus(a); await focus(s2); }
    ok(loadsA === a0 && loadsB === b0 && await s2.inputValue('[data-own-form] [name="own-name"]') === 'Half typed', 'S22: switching between a canvas tab and a SOW tab with no change reloads neither, so half-typed input stays', `${loadsA - a0} ${loadsB - b0}`);
    await focus(a); await a.click('#start-over'); await a.click('#confirm-yes'); await a.waitForTimeout(300);
    await focus(s2);
    ok(await s2.inputValue('[data-meta="customer"]').catch(async () => { await s2.click('[data-step="scope"]'); return s2.inputValue('[data-meta="customer"]'); }) === '' && await s2.evaluate(() => localStorage.getItem(KEY) === null || !JSON.parse(localStorage.getItem(KEY)).customer), 'S22: Start over on the canvas tab is seen by the SOW tab, which writes nothing back');
    await ctx.close();
  });

  // ---------- the last verification (step 23) ----------
  await sec(async () => {
    // a play picked again keeps the prompt count's bands; Start over then the same play reaches the SOW steps
    const p = await fresh(); await pick(p, 'abv', 150); await cont(p);
    await p.fill('[data-cover="promptCount"]', '100'); await p.waitForTimeout(200);
    await build(p); await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300); await p.click('#picker [data-play="abv"]'); await p.waitForTimeout(400);
    const ct = await canvasTotal(p); await cont(p); await services(p);
    ok(ct === '$175,200' && await toolTotal(p) === ct, `S23: a play picked again keeps the prompt count's bands, on both pages (${ct})`, `${ct} ${await toolTotal(p)}`);
    await build(p); await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300); await p.click('#picker [data-play="fsi"]'); await p.waitForTimeout(400);
    await p.click('#start-over'); await p.click('#confirm-yes'); await p.waitForTimeout(300); await p.click('#picker [data-play="fsi"]'); await p.waitForTimeout(400);
    const t2 = await canvasTotal(p);
    await p.goto(BASE + 'sow/#services'); await p.waitForTimeout(500);
    ok(await p.evaluate(() => state.play) === 'fsi' && await toolTotal(p) === t2, `S23: Start over, then the same play again, reaches the SOW steps (${t2})`, `${await p.evaluate(() => state.play)} ${await toolTotal(p)}`);
    await p.context().close();
  });
  await sec(async () => {
    // a deleted context phrase stays deleted; on your own play Brand Visibility going and coming rewords only unedited texts
    const p = await fresh(); await pick(p, 'aem', 150); await cont(p); await services(p);
    const BV = await p.evaluate(() => CATALOG.find(x => x.id === 'SO2').neutral.bv.scope[0][0]);
    await p.click('.service-card[data-line="SO2"] .scope-editor summary');
    const sc = await p.inputValue('.service-card[data-line="SO2"] [data-line-field="scope"]');
    await p.fill('.service-card[data-line="SO2"] [data-line-field="scope"]', sc.replace(BV, '')); await p.waitForTimeout(100);
    await p.selectOption('.service-card[data-line="SO2"] [data-line-field="band"]', 'large'); await p.waitForTimeout(200);
    await p.reload(); await p.waitForTimeout(500);
    ok(!(await p.evaluate(b => state.estimates.aem.SO2.scope.includes(b), BV)), 'S23: a deleted context phrase stays deleted through a band change and a reload');
    await p.context().close();
    const q = await fresh(); await pickCustom(q, ['bv', 'cja']); await cont(q); await services(q);
    await q.evaluate(() => { const r = state.estimates.custom['CANVAS-C06']; r.acceptance = 'Sponsor approves the audiences in writing.'; r.scopeChanged = true; save(); });
    await build(q); await removeProd(q, 'bv'); await cont(q); await services(q);
    const read = () => q.evaluate(() => { const s = catalog().find(x => x.id === 'CANVAS-C06'), r = state.estimates.custom['CANVAS-C06']; return [r.scope === lineText(s, 'custom', r.band, 'scope'), r.scope.includes('AI-referred'), r.acceptance]; });
    const off = await read();
    await build(q); await addProd(q, 'bv'); await closeMenu(q); await cont(q); await services(q);
    const on = await read();
    ok(JSON.stringify(off) === JSON.stringify([true, false, 'Sponsor approves the audiences in writing.']) && JSON.stringify(on) === JSON.stringify([true, true, 'Sponsor approves the audiences in writing.']), 'S23: on your own play, Brand Visibility going and coming rewords the unedited texts and keeps the edited one', `${JSON.stringify(off)} ${JSON.stringify(on)}`);
    await q.context().close();
  });
  await sec(async () => {
    // a page catching up takes no key
    const p = await fresh(); await pick(p, 'cja', 150); await cont(p);
    const before = JSON.stringify(await canvasState(p));
    await p.evaluate(() => { reloading = true; });
    await p.focus('.steps [data-build]'); await p.keyboard.press('Enter'); await p.waitForTimeout(400);
    ok(p.url().includes('/sow/') && JSON.stringify(await canvasState(p)) === before, 'S23: a page catching up takes no key: Enter on Build does nothing');
    await p.context().close();
  });

  // ---------- ChatGPT's second pass (step 24) ----------
  await sec(async () => {
    const O03 = {scope: 'Implement agreed crawl, rendering, metadata, schema, redirect or performance improvements within the selected engineering hours.', deliverable: 'Implemented fixes with technical validation, release record and rollback instructions.', acceptance: 'Each selected issue meets its agreed technical test and the representative regression checks pass.', assumptions: 'A confirmed backlog, existing codebase and authorized release process are available. Scope is capped at the agreed hours; work varies by CMS and technical complexity.', exclusions: 'Replatforming, large migrations, complex new functionality and work already performed by automation or another selected service.'};
    const p = await fresh(); await p.goto(BASE + 'sow/'); await p.waitForTimeout(400);
    // F1: a one-time retired line stays one-time; a version 3 quantity multiplies once and asks for review; a line rate stays
    await openDraft(p, {version: 4, v14: true, play: 'aem', rate: 150, currency: 'USD', months: 12, terms: TERMS, estimates: {aem: {SO2: {on: false}, O03: {on: true, hours: 56, qty: 1, rate: '', cadence: 'one-time', ...O03}}}}, 'o03-one.json');
    const one = await p.evaluate(() => { const r = state.estimates.aem['CUSTOM-O03-aem'], l = selectedLines().find(x => x.id === 'CUSTOM-O03-aem'); return [r.cadence, r.hours, l.fee, l.cadence]; });
    await services(p); const csv = parseCsv(await csvOf(p)).find(r => r[2] === 'Technical SEO and AI-search improvements');
    ok(JSON.stringify(one) === JSON.stringify(['one-time', 56, 8400, 'one-time']) && csv && csv[3] === 'one-time' && csv[9] === '8400', 'S24/F1: a one-time retired line stays one-time ($8,400 once, not $100,800 over the term), in the CSV too', `${JSON.stringify(one)} ${JSON.stringify(csv && csv.slice(2, 10))}`);
    await openDraft(p, {version: 3, v14: true, play: 'aem', rate: 150, currency: 'USD', months: 12, terms: TERMS, estimates: {aem: {SO2: {on: false}, O03: {on: true, hours: 56, qty: 2, rate: 175, cadence: 'monthly', ...O03}}}}, 'o03-qty2.json');
    const two = await p.evaluate(() => { const r = state.estimates.aem['CUSTOM-O03-aem']; return [r.cadence, r.hours, r.rate, r.scope.includes('Imported quantity: 2'), issues().some(x => x.includes('opened from an earlier draft with a quantity'))]; });
    ok(JSON.stringify(two) === JSON.stringify(['monthly', 112, 175, true, true]), 'S24/F1: a version 3 quantity of 2 on the retired line keeps 112 hours and its rate, with the review note', JSON.stringify(two));
    await openDraft(p, {version: 4, v14: true, play: 'aem', rate: 150, currency: 'USD', months: 12, terms: TERMS, estimates: {aem: {O03: {on: true, hours: 56, rate: '', cadence: 'monthly', ...O03}}}}, 'o03-so2.json');
    ok((await p.evaluate(() => issues().join(' | '))).includes('overlaps with Monthly SEO fixes with Sites Optimizer'), 'S24/F1: beside Sites Optimizer\'s monthly fixes, the overlap review still applies');
    // F4: A03's exclusion follows the band's hypercare period; an older untouched exclusion follows the new wording
    const a03 = await p.evaluate(() => { const s = CATALOG.find(x => x.id === 'A03'); return ['small', 'typical', 'large'].map(b => [lineText(s, 'aem', b, 'scope'), lineText(s, 'aem', b, 'exclusions')]); });
    ok(a03.every(([sc, ex]) => !/two weeks/.test(ex) && ex.includes('hypercare period stated in Included work')) && a03[2][0].includes('four weeks'), 'S24/F4: A03\'s exclusion no longer contradicts one or four weeks of hypercare');
    await openDraft(p, {version: 4, v14: true, play: 'aem', rate: 150, currency: 'USD', months: 12, terms: TERMS, estimates: {aem: {A03: {on: true, hours: 120, rate: '', cadence: 'one-time', hoursEdited: false, exclusions: 'New features, content changes after launch, and support beyond the two weeks of hypercare.'}}}}, 'a03-old.json');
    ok(await p.evaluate(() => { const r = state.estimates.aem.A03; return r.exclusions.includes('hypercare period stated in Included work') && !r.scopeChanged; }), 'S24/F4: a draft with the older A03 exclusion follows the new wording, not marked as edited');
    // smaller: a rate that rounds to zero is no rate; SO1, SO2 and L03 carry their second references
    await services(p); await p.fill('#service-rate', '0.004'); await p.waitForTimeout(100);
    ok(await p.evaluate(() => state.rate) === '', 'S24: a rate that rounds to zero (0.004) is no rate');
    const refs = await p.evaluate(() => ['SO1', 'SO2', 'L03'].map(id => CATALOG.find(x => x.id === id).source2 || ''));
    ok(refs[0].includes('preparing-code-patches') && refs[1].includes('preparing-code-patches') && refs[2].includes('optimize-at-edge/overview'), 'S24: SO1 and SO2 cite the code-patch page, L03 the Optimize at Edge overview');
    await p.context().close();
  });
  await sec(async () => {
    // F1 acceptance matrix: quantities 0, 1, 2; one-time and monthly; with and without a line rate; versions 3 and 4; SO2 on and off; then Save and Open
    const O03 = {scope: 'Implement agreed crawl, rendering, metadata, schema, redirect or performance improvements within the selected engineering hours.', deliverable: 'Implemented fixes with technical validation, release record and rollback instructions.', acceptance: 'Each selected issue meets its agreed technical test and the representative regression checks pass.', assumptions: 'A confirmed backlog, existing codebase and authorized release process are available. Scope is capped at the agreed hours; work varies by CMS and technical complexity.', exclusions: 'Replatforming, large migrations, complex new functionality and work already performed by automation or another selected service.'};
    const p = await fresh(); await p.goto(BASE + 'sow/'); await p.waitForTimeout(400);
    const bad = []; let n = 0;
    for (const version of [3, 4]) for (const qty of version === 3 ? [0, 1, 2] : [1]) for (const cadence of ['one-time', 'monthly']) for (const rate of ['', 210]) for (const so2 of [true, false]) {
      const d = {version, v14: true, play: 'aem', rate: 150, currency: 'USD', months: 12, terms: TERMS, estimates: {aem: {SO2: {on: so2}, O03: {on: true, hours: 56, qty, rate, cadence, hoursWhy: 'Agreed backlog from the audit.', ...O03}}}};
      await openDraft(p, d, 'm.json');
      const want = {hours: 56 * (version === 3 ? qty : 1), cadence, rate: rate === '' ? '' : 210, note: version === 3 && qty !== 1, overlap: so2};
      const read = () => p.evaluate(() => { const r = state.estimates.aem['CUSTOM-O03-aem'], l = selectedLines().find(x => x.id === 'CUSTOM-O03-aem'), is = issues().join(' | ');
        return {hours: r.hours, cadence: r.cadence, rate: r.rate, note: r.scope.includes('Imported quantity'), overlap: is.includes('overlaps with Monthly SEO fixes'), fee: l ? l.fee : null, why: r.hoursWhy}; });
      const got = await read(), fee = Math.round(want.hours * (rate === '' ? 150 : 210) * 100) / 100;
      const okNow = got.hours === want.hours && got.cadence === want.cadence && got.rate === want.rate && got.note === want.note && got.overlap === want.overlap && got.fee === fee && got.why === 'Agreed backlog from the audit.';
      const saved = await p.evaluate(() => JSON.stringify(state)); await openDraft(p, saved, 'm2.json'); const again = await read();
      n++; if (!okNow || JSON.stringify(again) !== JSON.stringify(got)) bad.push(JSON.stringify({version, qty, cadence, rate, so2, got, again}));
    }
    ok(!bad.length && n === 32, `S24/F1: the retired line keeps hours, cadence, rate, reason, quantity note and overlap review in all ${n} combinations, and through Save and Open`, bad.slice(0, 2).join(' || '));
    await p.context().close();
  });
  await sec(async () => {
    // F3: Change play rebuilds own services from their definitions; re-adding brings back the service as written
    const p = await fresh(); await pick(p, 'cja', 150); await cont(p); await services(p);
    await p.click('[data-own="Launch"]'); await p.waitForTimeout(150);
    await p.fill('[data-own-form] [name="own-name"]', 'Kickoff workshop'); await p.fill('[data-own-form] [name="own-hours"]', '20'); await p.fill('[data-own-form] [name="own-scope"]', 'One workshop and an outcome document.');
    await p.click('[data-own-form] button.primary'); await p.waitForTimeout(200);
    const id = await p.evaluate(() => state.custom.find(c => c.name === 'Kickoff workshop').id);
    await p.evaluate(i => { const r = state.estimates.cja[i]; r.hours = 99; r.rate = 250; r.cadence = 'monthly'; r.scope = 'Nine workshops.'; r.scopeChanged = true; save(); }, id);
    await build(p); await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300); await p.click('#picker [data-play="cja"]'); await p.waitForTimeout(400);
    await cont(p); await services(p); await addLib(p, id);
    const r = await p.evaluate(i => { const r = state.estimates.cja[i]; return [r.on, r.hours, r.rate, r.cadence, r.scope]; }, id);
    ok(JSON.stringify(r) === JSON.stringify([true, 20, '', 'one-time', 'One workshop and an outcome document.']) && await toolTotal(p) === '$222,600', 'S24/F3: after Change play, re-adding an own service brings it back as written (20 hours once, $222,600), not the old 99 hours a month', `${JSON.stringify(r)} ${await toolTotal(p)}`);
    await p.context().close();
  });
  await sec(async () => {
    // F2: Start over on the canvas also clears an engagement held under the older storage key
    const p = await fresh(); await p.goto(BASE); await p.waitForTimeout(300);
    await p.evaluate(t => localStorage.setItem('partner-services-focused-v2', JSON.stringify({version: 3, play: 'cja', customer: 'Old Customer Co', partner: 'Old Partner LLC', months: 9, terms: t, estimates: {}})), TERMS);
    await p.reload(); await p.waitForTimeout(400);
    await p.click('#picker [data-play="cja"]'); await p.waitForTimeout(400); await p.fill('#rate', '150'); await p.waitForTimeout(100);
    await p.click('#start-over'); await p.click('#confirm-yes'); await p.waitForTimeout(300);
    await p.click('#picker [data-play="abv"]'); await p.waitForTimeout(400); await cont(p);
    const r = await p.evaluate(() => [state.customer, state.partner, state.months, state.rate, state.terms]);
    ok(r[0] === '' && r[1] === '' && r[2] === 12 && r[3] === 150 && r[4] === '', 'S24/F2: after Start over, no older engagement comes back (no old customer, partner, terms or term); the rate stays', JSON.stringify(r));
    await p.context().close();
    // F5: the Services step fits a phone
    // with a wide fallback font, as when web fonts can't load (ChatGPT measured 424 pixels on the old build)
    const ctx = await b.newContext({viewport: {width: 390, height: 844}}); const m = await ctx.newPage(); await m.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await m.goto(BASE + 'sow/?play=abv#services'); await m.waitForTimeout(500); await m.addStyleTag({content: '*{font-family:"DejaVu Sans",Verdana,sans-serif!important}'}); await m.waitForTimeout(200);
    const w = await m.evaluate(() => document.documentElement.scrollWidth);
    ok(w <= 390, 'S24/F5: the Services step fits a 390-pixel phone without scrolling sideways', String(w));
    await ctx.close();
  });

  // ---------- step 25: on phones, a Build card gives each service's name and note a full row ----------
  await sec(async () => {
    // each visible line: its grid tracks, where the name, hours and X (or Add buttons) sit, and the hours' alignment
    const layout = p => p.$$eval('#card .ln', ls => ls.filter(l => l.checkVisibility()).map(l => { const r = l.getBoundingClientRect(), n = l.querySelector('.nm').getBoundingClientRect(), hr = l.querySelector('.hr'), h = hr.getBoundingClientRect(), a = l.querySelector('.tg,.addb'), x = a ? a.getBoundingClientRect() : null;
      return {id: l.dataset.l, kind: l.classList.contains('lock') ? 'lock' : l.classList.contains('rp') ? 'rp' : 'ln', tracks: getComputedStyle(l).gridTemplateColumns.split(' ').length, full: n.width >= r.width - 2, under: h.top >= n.bottom - 1, side: h.left >= n.right - 1,
        right: getComputedStyle(hr).textAlign === 'right', xrow: !x || (x.top < h.bottom && x.bottom > h.top), inside: !x || (x.right <= r.right + 1 && x.left >= r.left - 1)}; }));
    const phoneRows = L => L.length > 0 && L.every(x => x.full && x.under && !x.right && x.inside);
    // for each X fully on screen: do points 3 pixels outside it, on all four sides, still reach it
    const nearX = async p => { await p.evaluate(() => document.getElementById('card').scrollIntoView({block: 'start'})); await p.waitForTimeout(150);
      return p.$$eval('#card .ln .tg', ts => ts.filter(t => t.checkVisibility()).map(t => { const r = t.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const pts = [[r.left - 3, cy], [r.right + 3, cy], [cx, r.top - 3], [cx, r.bottom + 3]].filter(([x, y]) => x >= 0 && y >= 0 && x < innerWidth && y < innerHeight);
        return pts.length === 4 ? pts.every(([x, y]) => document.elementFromPoint(x, y)?.closest('.tg') === t) : null; }).filter(x => x !== null)); };
    const deskRows = L => L.length > 0 && L.every(x => !x.full && x.side && x.right && x.xrow && x.tracks === 4);
    const open = async (p, id) => { await p.evaluate(i => document.querySelector(`.node[data-p="${i}"]`).click(), id); await p.waitForTimeout(400); };
    const conn = async (p, id) => { await p.evaluate(i => document.querySelector(`.ib[data-c="${i}"]`).click(), id); await p.waitForTimeout(400); };
    const more = async p => { for (const d of await p.$$('#card details:not([open]) > summary')) await d.click(); await p.waitForTimeout(150); };
    const fits = (p, w) => p.evaluate(w => document.documentElement.scrollWidth <= w && document.getElementById('card').scrollWidth <= document.getElementById('card').clientWidth, w);
    const phone = async w => { const ctx = await b.newContext({viewport: {width: w, height: 844}, isMobile: true, hasTouch: true}); const m = await ctx.newPage(); m.on('pageerror', e => errs.push(e.message)); return m; };
    const window_ = async w => { const p = await fresh(); await p.setViewportSize({width: w, height: 950}); return p; };
    const custom = async (p, ids) => { await p.goto(BASE); await p.waitForTimeout(300); await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400);
      for (const id of ids) { if (await p.isHidden('#add-menu')) await p.click('#add-btn');
        if (await p.$(`#add-menu details.nocon [data-add="${id}"]`) && !(await p.$eval('#add-menu details.nocon', d => d.open))) await p.click('#add-menu details.nocon summary');
        await p.click(`#add-menu [data-add="${id}"]`); await p.waitForTimeout(300); }
      await p.fill('#rate', '150'); await p.waitForTimeout(100); };
    // a 390-pixel phone: AEM with both notes, More services open
    const m = await phone(390);
    await pick(m, 'aem', 150); await cont(m);
    await m.fill('[data-cover="promptCount"]', '2000'); await m.press('[data-cover="promptCount"]', 'Tab'); await m.waitForTimeout(200);
    await services(m); await m.fill('.service-card[data-line="O02"] [data-line-field="hours"]', '72'); await m.press('.service-card[data-line="O02"] [data-line-field="hours"]', 'Tab'); await m.waitForTimeout(200);
    await build(m); await open(m, 'bv'); await more(m);
    const L = await layout(m);
    ok(L.length >= 8 && phoneRows(L), 'S25: on a 390-pixel phone each line\'s name and note take the full row, with hours, fee and X beneath (More services open too)', JSON.stringify(L));
    const notes = await m.$$eval('#card .ln .svc', e => e.map(x => [x.textContent, Math.round(x.getBoundingClientRect().height)]));
    ok(notes.length >= 2 && notes.some(n => n[0].includes('prompt count')) && notes.some(n => n[0].includes('Services step')) && notes.every(n => n[1] <= 21), 'S25: "Set by the prompt count on the Scope step" and "Set on the Services step" each fit one line on the phone', JSON.stringify(notes));
    ok(await fits(m, 390), 'S25: on the 390-pixel phone neither the page nor the open card scrolls sideways');
    await m.click('#card .ln[data-l="O01"] .tg'); await m.waitForTimeout(250);
    const off = await m.$eval('#card .ln[data-l="O01"]', l => l.classList.contains('off'));
    await m.click('#card .ln[data-l="O01"] .tg'); await m.waitForTimeout(250);
    ok(off && !(await m.$eval('#card .ln[data-l="O01"]', l => l.classList.contains('off'))), 'S25: on the phone the X beneath a line removes that line, and its check adds it back');
    const NX = await nearX(m);
    ok(NX.length >= 3 && NX.every(Boolean), 'S25: on the phone each X also takes taps 3 pixels around it, so a near miss removes the line rather than opening the link above it', JSON.stringify(NX));
    await m.context().close();
    // a 320-pixel phone, where the step 24 card scrolled sideways
    const s = await phone(320); await pick(s, 'aem', 150); await open(s, 'bv'); await more(s);
    const S = await layout(s);
    ok(phoneRows(S) && await fits(s, 320), 'S25: on a 320-pixel phone every line takes the phone rows and the card does not scroll sideways', JSON.stringify(S));
    await s.context().close();
    // Create your own play on a phone: lines waiting for a product (two and three Add buttons) and the replaced generic Skills
    const kinds = {};
    for (const [ids, how, id, kind] of [[['target', 'cja'], conn, 'target-cja', 'lock'], [['commerce', 'eds'], conn, 'commerce-eds', 'lock'], [['cw', 'cja'], open, 'cw', 'rp']]) {
      const q = await phone(390); await custom(q, ids); await how(q, id); await more(q);
      kinds[id] = (await layout(q)).filter(x => x.kind === kind); await q.context().close(); }
    ok(kinds['target-cja'].length && kinds['commerce-eds'].length && phoneRows(kinds['target-cja']) && phoneRows(kinds['commerce-eds']), 'S25: on a phone, a line waiting for a product (two or three Add buttons) shows its name across the row and its Add buttons beneath, inside the card', JSON.stringify(kinds));
    ok(kinds.cw.length && phoneRows(kinds.cw), 'S25: on a phone, the generic Skills replaced by specialized ones take the phone rows too', JSON.stringify(kinds.cw));
    // desktop and the edge of the breakpoint: the desktop rows exactly as before (four tracks, hours right-aligned beside the name, the X on the same row); waiting lines are step 26
    for (const w of [1600, 601]) {
      const d = await window_(w); await pick(d, 'aem', 150); await open(d, 'bv'); await more(d); const D = await layout(d), DX = await nearX(d); await d.context().close();
      ok(D.length >= 8 && deskRows(D), `S25: at ${w} pixels every line keeps its desktop row (unchanged)`, JSON.stringify(D));
      ok(DX.length >= 3 && DX.every(x => x === false), `S25: at ${w} pixels the X keeps its own tap area (unchanged)`, JSON.stringify(DX));
    }
    // 600 pixels and narrower get the phone rows
    const z = await window_(600); await pick(z, 'aem', 150); await open(z, 'bv'); const Z = await layout(z); await z.context().close();
    ok(phoneRows(Z), 'S25: a 600-pixel window gets the phone rows (the breakpoint is 600 and narrower)', JSON.stringify(Z));
  });

  // ---------- step 26: a line waiting for a product stacks on desktop; on a touch screen a tap opens and pins a card ----------
  await sec(async () => {
    const customPlay = async (p, ids) => { await p.goto(BASE); await p.waitForTimeout(300); await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400);
      for (const id of ids) { if (await p.isHidden('#add-menu')) await p.click('#add-btn');
        if (await p.$(`#add-menu details.nocon [data-add="${id}"]`) && !(await p.$eval('#add-menu details.nocon', d => d.open))) await p.click('#add-menu details.nocon summary');
        await p.click(`#add-menu [data-add="${id}"]`); await p.waitForTimeout(300); }
      if (!(await p.isHidden('#add-menu'))) await p.click('#add-btn');
      await p.fill('#rate', '150'); await p.waitForTimeout(100); };
    const waiting = p => p.$$eval('#card .ln.lock', ls => ls.filter(l => l.checkVisibility()).map(l => { const r = l.getBoundingClientRect(), n = l.querySelector('.nm').getBoundingClientRect(), a = l.querySelector('.addb').getBoundingClientRect();
      return {id: l.dataset.l, full: n.width >= r.width - 2, below: a.top >= n.bottom - 1, inside: a.right <= r.right + 1 && a.left >= r.left - 1, hoursLeft: getComputedStyle(l.querySelector('.hr')).textAlign === 'left', height: Math.round(r.height)}; }));
    // 1. desktop: the three waiting lines (two and three Add buttons, one inside More services) read across the card
    for (const w of [1600, 601]) {
      const rows = [];
      for (const [ids, cid] of [[['target', 'cja'], 'target-cja'], [['commerce', 'eds'], 'commerce-eds'], [['commerce', 'aemsites'], 'commerce-aemsites']]) {
        const p = await fresh(); await p.setViewportSize({width: w, height: 950}); await customPlay(p, ids);
        await p.evaluate(i => document.querySelector(`.ib[data-c="${i}"]`).click(), cid); await p.waitForTimeout(400);
        for (const d of await p.$$('#card details:not([open]) > summary')) await d.click(); await p.waitForTimeout(150);
        rows.push(...await waiting(p)); await p.context().close(); }
      ok(rows.length >= 3 && rows.every(x => x.full && x.below && x.inside && x.hoursLeft && x.height <= 140), `S26: at ${w} pixels a line waiting for a product shows its name and note across the card, with its hours and Add buttons beneath (no thin column)`, JSON.stringify(rows));
    }
    // 2. a phone: one tap anywhere on a product opens and pins its card, and the same tap acts on nothing inside the card
    const ctx = await b.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true}); const popups = [];
    const m = await ctx.newPage(); m.on('pageerror', e => errs.push(e.message)); const bad = []; let taps = 0;
    ctx.on('page', pg => { if (pg === m) return; popups.push(pg.url()); pg.close().catch(() => {}); });
    for (const play of ['aem', 'cja', 'abv']) {
      await m.goto(BASE); await m.waitForTimeout(300); await m.evaluate(() => localStorage.clear()); await m.reload(); await m.waitForTimeout(400);
      await m.tap(`#picker [data-play="${play}"]`); await m.waitForTimeout(500);
      for (const id of await m.$$eval('.node[data-p]', ns => ns.map(n => n.dataset.p)))
        for (const [fx, fy] of [[0.15, 0.3], [0.5, 0.5], [0.85, 0.3], [0.85, 0.7], [0.97, 0.5]]) {
          await m.evaluate(i => { hideCard(true); document.querySelector(`.node[data-p="${i}"]`).scrollIntoView({block: 'center'}); }, id); await m.waitForTimeout(150);
          const bx = await (await m.$(`.node[data-p="${id}"]`)).boundingBox(), before = await m.evaluate(() => JSON.stringify(st.ls)), pn = popups.length;
          await m.touchscreen.tap(bx.x + bx.width * fx, bx.y + bx.height * fy); await m.waitForTimeout(500); taps++;
          const after = await m.evaluate(() => ({ls: JSON.stringify(st.ls), open: !document.getElementById('card').hidden, pinned}));
          if (after.ls !== before || !after.open || !after.pinned || popups.length !== pn) bad.push({play, id, fx, fy, ...after, links: popups.length - pn});
        }
    }
    ok(taps >= 30 && !bad.length, `S26: on a phone one tap anywhere on a product (${taps} taps) opens and pins its card and changes nothing on it: no line removed, no link opened, the card stays open`, JSON.stringify(bad.slice(0, 6)));
    await ctx.close();
    // 3. desktop: a mouse still opens a card on hover and closes it on leaving
    const d = await fresh(); await pick(d, 'cja', 150); await d.hover('.node[data-p="cja"]'); await d.waitForTimeout(300);
    const shown = await d.evaluate(() => !document.getElementById('card').hidden && !pinned);
    await d.mouse.move(5, 5); await d.waitForTimeout(600);
    const gone = await d.evaluate(() => document.getElementById('card').hidden);
    ok(shown && gone, 'S26: on desktop a mouse still opens a card on hover and closes it on leaving (unchanged)', JSON.stringify({shown, gone}));
    await d.context().close();
  });

  // ---------- step 27: outside systems (a CDN on every Brand Visibility play; a data warehouse, cloud storage and a CRM on CJA) ----------
  await sec(async () => {
    const num = s => Number(String(s).replace(/[^0-9.]/g, ''));
    const menuIds = async p => { if (await p.isHidden('#out-menu')) await p.click('#out-btn'); await p.waitForTimeout(150);
      const ids = await p.$$eval('#out-menu [data-out]', bs => bs.map(x => x.dataset.out)); await p.keyboard.press('Escape'); await p.waitForTimeout(100); return ids; };
    const addOut = async (p, id) => { if (await p.isHidden('#out-menu')) await p.click('#out-btn'); await p.waitForTimeout(150);
      await p.click(`#out-menu [data-out="${id}"]`); await p.waitForTimeout(450); await p.mouse.move(3, 3); await p.waitForTimeout(350); };
    const outs = p => p.$$eval('.node.out', ns => ns.map(n => n.dataset.p).sort().join(','));
    const openCard = async (p, sel) => { await p.evaluate(s => document.querySelector(s).click(), sel); await p.waitForTimeout(400);
      for (const d of await p.$$('#card details:not([open]) > summary')) await d.click(); await p.waitForTimeout(150); };
    const shut = async p => { await p.evaluate(() => hideCard(true)); await p.waitForTimeout(150); };
    // lines of different connections that cross each other (lines meeting at a shared box don't count)
    const crossings = p => p.evaluate(() => { const es = [...document.querySelectorAll('path.edge')].map(e => { const n = e.getTotalLength(), pts = [];
        for (let i = 0; i <= 40; i++) { const q = e.getPointAtLength(n * i / 40); pts.push([q.x, q.y]); } return {c: e.dataset.c, ends: [e.dataset.s, e.dataset.e], pts}; });
      const o = (a, b, c) => Math.sign((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));
      const X = (a, b, c, d) => o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0, out = [];
      for (let i = 0; i < es.length; i++) for (let j = i + 1; j < es.length; j++) { const A = es[i], B = es[j]; if (A.ends.some(x => B.ends.includes(x))) continue;
        let hit = false; for (let k = 0; k < 40 && !hit; k++) for (let l = 0; l < 40 && !hit; l++) hit = X(A.pts[k], A.pts[k + 1], B.pts[l], B.pts[l + 1]);
        if (hit) out.push(A.c + ' x ' + B.c); }
      return out; });
    const layout = p => p.evaluate(() => { const ns = [...document.querySelectorAll('.node')].map(n => ({id: n.dataset.p, r: n.getBoundingClientRect()})), cv = document.getElementById('canvas').getBoundingClientRect(), bad = [];
      for (let i = 0; i < ns.length; i++) for (let j = i + 1; j < ns.length; j++) { const a = ns[i].r, c = ns[j].r; if (a.left < c.right - 1 && c.left < a.right - 1 && a.top < c.bottom - 1 && c.top < a.bottom - 1) bad.push('overlap ' + ns[i].id + '/' + ns[j].id); }
      for (const n of ns) if (n.r.left < cv.left - 1 || n.r.right > cv.right + 1 || n.r.top < cv.top - 1 || n.r.bottom > cv.bottom + 1) bad.push('off the canvas ' + n.id);
      for (const e of document.querySelectorAll('.ib')) { const a = e.getBoundingClientRect(); for (const n of ns) { const c = n.r; if (a.left < c.right && c.left < a.right && a.top < c.bottom && c.top < a.bottom) bad.push('i on a box ' + e.dataset.c + '@' + n.id); } }
      if (document.documentElement.scrollWidth > document.documentElement.clientWidth) bad.push('sideways scroll');
      return bad; });

    // 1. the menu on every Brand Visibility play; none on Coworker or Create your own play; nothing on when a play starts
    const want = {cja: 'cdn,dwh,cstore,crm', commerce: 'cdn', aem: 'cdn', fsi: 'cdn', abv: 'cdn'}, seen = {};
    for (const play of Object.keys(want)) { const p = await fresh(); await pick(p, play, 150);
      seen[play] = {btn: await p.isVisible('#out-btn'), menu: (await menuIds(p)).join(','), boxes: await outs(p), stored: (await canvasState(p)).out}; await p.context().close(); }
    ok(Object.entries(want).every(([k, v]) => seen[k].btn && seen[k].menu === v && seen[k].boxes === '' && Array.isArray(seen[k].stored) && !seen[k].stored.length),
      'S27: every Brand Visibility play has Add outside system; its menu lists the systems that connect to the play (a CDN on all five; a data warehouse, cloud storage and a CRM on CJA too), and none is on when the play starts', JSON.stringify(seen));
    const nob = {};
    for (const play of ['coworker', 'custom']) { const p = await fresh(); await pick(p, play); nob[play] = await p.isVisible('#out-btn'); await p.context().close(); }
    ok(!nob.coworker && !nob.custom, 'S27: Coworker and Create your own play have no Add outside system button', JSON.stringify(nob));

    // 2. CJA at $150, Typical: the menu, the boxes, the icons and the totals
    const p = await fresh(); await pick(p, 'cja', 150); await p.mouse.move(3, 3); await p.waitForTimeout(200);
    await p.click('#out-btn'); await p.waitForTimeout(150);
    const items = await p.$$eval('#out-menu [data-out]', bs => bs.map(x => ({id: x.dataset.out, name: x.querySelector('.nm').textContent, to: x.querySelector('.ctag').textContent, sys: x.querySelector('.sys').textContent, icon: !!x.querySelector('.nm svg')})));
    const exp = {cdn: ['CDN', 'Brand Visibility', 'Akamai, Cloudflare, Amazon CloudFront, Fastly, Imperva'], dwh: ['Data warehouse', 'CJA', 'Snowflake, Google BigQuery or Azure Databricks, through Data Mirror'],
      cstore: ['Cloud storage', 'CJA', 'Amazon S3, Azure Blob Storage'], crm: ['CRM', 'CJA', 'Salesforce, Microsoft Dynamics 365']};
    ok(items.length === 4 && items.every(x => x.name === exp[x.id][0] && x.to === 'Connects to ' + exp[x.id][1] && x.sys.startsWith(exp[x.id][2]) && x.icon) && (await p.textContent('#out-menu .hd')).includes('Each connects through a route Adobe documents'),
      'S27: each menu item gives the system, its icon, the product it connects to and the systems Adobe documents for that route', JSON.stringify(items));
    await p.keyboard.press('Escape'); await p.waitForTimeout(100);
    ok(await p.isHidden('#out-menu') && await p.getAttribute('#out-btn', 'aria-expanded') === 'false', 'S27: Escape closes the menu');
    const t0 = await canvasTotal(p), steps = [];
    for (const id of ['dwh', 'cstore', 'crm', 'cdn']) { await addOut(p, id); steps.push(await canvasTotal(p)); }
    ok(t0 === '$219,600' && JSON.stringify(steps) === JSON.stringify(['$228,000', '$234,000', '$240,000', '$240,000']),
      'S27: CJA at $150, Typical is $219,600 with no outside system (unchanged); warehouse tables into CJA add $8,400, cloud storage files $6,000, CRM data $6,000, and the CDN $0 (its two services start off)', JSON.stringify([t0, ...steps]));
    ok((await menuIds(p)).length === 0 && (await p.textContent('#out-menu')).includes('Every outside system for this play is on your canvas'), 'S27: with all four on, the menu says every outside system for the play is on the canvas');
    const SHAPE = {cdn: 'circle+path+path', dwh: 'ellipse+path+path', cstore: 'path', crm: 'rect+circle+path+path'};
    const look = await p.$$eval('.node.out', ns => ns.map(n => { const cs = getComputedStyle(n), bf = getComputedStyle(n, '::before'), svg = n.querySelector('svg');
      return {id: n.dataset.p, dashed: cs.borderLeftStyle === 'dashed' && cs.borderBottomStyle === 'dashed', bar: cs.borderTopStyle === 'solid' && parseFloat(cs.borderTopWidth) >= 6 && cs.borderTopColor === cs.color,
        tag: bf.content, tagSolid: bf.opacity === '1' && bf.color === cs.color, shape: svg ? [...svg.children].map(c => c.tagName).join('+') : '', line: !!svg && svg.getAttribute('fill') === 'none' && svg.getAttribute('stroke') === 'currentColor',
        label: n.getAttribute('aria-label')}; }));
    ok(look.length === 4 && look.every(x => x.dashed && x.bar && x.tag === '"OUTSIDE ADOBE"' && x.tagSolid && x.shape === SHAPE[x.id] && x.line && x.label.includes('outside Adobe')),
      'S27: each outside system is a dashed box with a dark top bar, a solid OUTSIDE ADOBE tag and its line icon (a globe for the CDN, a database cylinder for the data warehouse, a cloud for cloud storage, a contact card for the CRM)', JSON.stringify(look));
    const ec = await p.$$eval('path.edge', es => Object.fromEntries(es.map(e => [e.dataset.c, e.getAttribute('class')])));
    ok(ec['cdn-bv'] === 'edge' && ['dwh-cja', 'cstore-cja', 'crm-cja'].every(c => ec[c] === 'edge pf') && (await p.$$('.ib')).length === 5,
      'S27: the CDN line draws solid (native log forwarding) and the warehouse, cloud storage and CRM lines dotted (through Experience Platform), each with its i', JSON.stringify(ec));

    // 3. the cards
    await openCard(p, '.node[data-p="dwh"]');
    const oc = await p.evaluate(() => ({text: document.getElementById('card').textContent, rm: !!document.querySelector('#card [data-rmout="dwh"]'), icon: !!document.querySelector('#card h4 svg ellipse')}));
    ok(oc.text.includes('Outside system') && oc.text.includes('Snowflake, Google BigQuery or Azure Databricks, through Data Mirror') && oc.text.includes('It connects to Customer Journey Analytics') && oc.rm && oc.icon,
      'S27: a box\'s card says it is an outside system, the systems Adobe documents and what it connects to, with its icon and Remove from canvas', oc.text);
    await shut(p);
    await openCard(p, '.ib[data-c="dwh-cja"]');
    const dc = await p.evaluate(() => ({kind: document.querySelector('#card .kind').textContent, text: document.getElementById('card').textContent, lines: [...document.querySelectorAll('#card .ln')].map(l => l.dataset.l).join(','), src: [...document.querySelectorAll('#card a')].map(a => a.href).join(' ')}));
    ok(dc.kind.startsWith('Outside system') && dc.text.includes('Availability: Needs CJA Select, Prime or Ultimate (Data Mirror is not in CJA Foundation)') && dc.text.includes('Before it works') && dc.text.includes('change tracking turned on for each table') && dc.text.includes('How it connects') && dc.lines === 'OX3' && dc.src.includes('cja-data-mirror/relational'),
      'S27: the i on the warehouse line says Outside system, the license it needs, what the customer does first, how it connects, its service and the Experience League page', dc.text.slice(0, 400));
    await shut(p);
    await openCard(p, '.ib[data-c="cdn-bv"]');
    const cc = await p.evaluate(() => ({kind: document.querySelector('#card .kind').textContent, text: document.getElementById('card').textContent, on: ['OX1', 'OX2'].map(l => counted(l))}));
    ok(cc.kind.startsWith('Outside system') && !cc.text.includes('Availability') && cc.text.includes('Agentic Traffic dashboard') && JSON.stringify(cc.on) === '[false,false]',
      'S27: the i on the CDN line names no license, says the Agentic Traffic dashboard needs the logs, and starts with both its services off', JSON.stringify({kind: cc.kind, on: cc.on}));

    // 4. CJA data preparation beside the source services: both count, and each source line shows the overlap (step 30)
    await p.click('#card [data-t="OX1"]'); await p.waitForTimeout(300); await shut(p);
    const t1 = await canvasTotal(p);
    await openCard(p, '.node[data-p="cja"]'); await p.click('#card [data-t="CJ01"]'); await p.waitForTimeout(300); await shut(p);
    const t2 = await canvasTotal(p);
    const ovl = {};
    for (const [c, l] of [['dwh-cja', 'OX3'], ['cstore-cja', 'OX4'], ['crm-cja', 'OX5']]) { await openCard(p, `.ib[data-c="${c}"]`);
      ovl[l] = await p.$eval(`#card .ln[data-l="${l}"]`, x => !x.classList.contains('rp') && !x.classList.contains('off') && !x.querySelector('[data-keep]') && x.textContent.includes('Overlaps with CJA data preparation in Experience Platform, which is on. The SOW asks how they differ.'));
      await shut(p); }
    ok(num(t1) - num('$240,000') === 2400 && num(t2) === num(t1) + 12000 && ovl.OX3 && ovl.OX4 && ovl.OX5,
      `S27: with CJA data preparation in Experience Platform on, every service still counts (${t1} + $12,000 = ${t2}; the partner's CDN setup added $2,400), and each CJA source line says it overlaps with data preparation and the SOW asks how they differ (step 30)`, JSON.stringify({t1, t2, ovl}));

    // 5. the hand-over, the Services step, the SOW document
    const ct = await canvasTotal(p); await cont(p); await services(p);
    const sw = await p.evaluate(() => ({out: ((state.outside || {}).cja || []).slice().sort().join(','), on: ['OX1', 'OX2', 'OX3', 'OX4', 'OX5', 'CJ01'].map(i => { const r = state.estimates.cja[i] || state.estimates.cja['CANVAS-' + i]; return i + ':' + !!(r && r.on); }).join(' ')}));
    const tt = await toolTotal(p);
    ok(sw.out === 'cdn,crm,cstore,dwh' && sw.on === 'OX1:true OX2:false OX3:true OX4:true OX5:true CJ01:true' && tt === ct, `S27: Save and continue hands the four outside systems and their services to the Services step, and the totals match (${ct})`, JSON.stringify(sw) + ' ' + tt);
    // each source service beside data preparation must say how it differs before the SOW is issued (step 30)
    const ov = await p.evaluate(() => issues().filter(x => x.includes('overlaps with')));
    ok(ov.length === 3 && ['Warehouse tables into CJA', 'Cloud storage files into CJA', 'CRM data into CJA'].every(n => ov.some(x => x.startsWith(n + ' overlaps with CJA data preparation in Experience Platform. Charge both only for distinct work'))),
      'S27: each source service beside CJA data preparation must say how it differs, or go, before the SOW is issued (step 30)', JSON.stringify(ov));
    await p.evaluate(t => { for (const [i, w] of [['OX3', 'the order and returns tables'], ['OX4', 'the store and returns file feeds'], ['OX5', 'the account and opportunity objects']]) { const r = state.estimates.cja[i];
      r.scope = 'Source setup and checks for ' + w + ', which the data preparation service does not include.'; r.scopeChanged = true; } state.terms = t; save(); }, TERMS);
    ok(!(await p.evaluate(() => issues().some(x => x.includes('overlaps with')))), 'S27: once their scopes say how they differ, the overlap review clears', JSON.stringify(await p.evaluate(() => issues())));
    // data preparation came from the canvas research as a service concept: write it up so the SOW can be issued
    await p.evaluate(() => { const r = state.estimates.cja['CANVAS-CJ01']; r.scope += ' 2 schemas and 4 datasets for web and AI-referred traffic.'; r.deliverable = 'Schemas, datasets and ingestion for the two agreed sources.';
      r.acceptance = 'All 4 datasets ingest daily for 7 days with no failed runs.'; r.assumptions = (r.assumptions || '') + ' The customer confirmed the sandbox and the two sources on the kickoff call.'; save(); });
    ok(!(await p.evaluate(() => issues().length)), 'S27: and with data preparation written up, the SOW can be issued', JSON.stringify(await p.evaluate(() => issues())));
    const doc = (await htmlOf(p)).replace(/<[^>]+>/g, ' ').replace(/&#39;|&#039;|&#x27;|&rsquo;/g, '\'').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
    const deps = ['CDN log forwarding is the customer\'s IT team\'s change: the partner creates the log job in the CDN console with the team\'s access and change approval. It gates',
      'Data warehouse: the customer\'s data team gives the access the source needs (for Google BigQuery, a dataset for temporary tables; for Azure Databricks, a SAS token in the cluster\'s Spark configuration), allows Adobe\'s IP addresses where the warehouse needs it and turns on change tracking for each table. Data Mirror needs CJA Select, Prime or Ultimate',
      'Cloud storage: the customer gives access to the agreed storage location', 'CRM: the customer\'s CRM administrator gives an API user'];
    ok(deps.every(d => doc.includes(d)) && ['Warehouse tables into CJA', 'Cloud storage files into CJA', 'CRM data into CJA', 'CDN log forwarding, set up by the partner', 'CJA data preparation in Experience Platform'].every(n => doc.includes(n)),
      'S27: the SOW lists every service, CJA data preparation and the three source services included, and its Dependencies and risks give the customer\'s part for each outside system and who does what for CDN log forwarding', deps.filter(d => !doc.includes(d)).join(' | '));
    await build(p);
    const back = {boxes: await outs(p), total: await canvasTotal(p)};
    await openCard(p, '.ib[data-c="cstore-cja"]'); back.overlap = await p.$eval('#card .ln[data-l="OX4"]', x => !x.classList.contains('rp') && x.textContent.includes('Overlaps with CJA data preparation')); await shut(p);
    back.counted = await p.evaluate(() => ['OX3', 'OX4', 'OX5'].every(l => counted(l)));
    ok(back.boxes === 'cdn,crm,cstore,dwh' && back.total === ct && back.overlap && back.counted, 'S27: back on Build the four outside systems and their services are as they were, with the same total and the overlap still shown', JSON.stringify(back));

    // 6. drafts
    await cont(p); await services(p); const draft = await draftOf(p), dt = await toolTotal(p); const dj = JSON.parse(draft); await p.context().close();
    const e = await fresh(); await e.goto(BASE + 'sow/'); await e.waitForTimeout(400); await openDraft(e, draft, 's27.json'); await build(e);
    const ed = {boxes: await outs(e), total: await canvasTotal(e)}; await cont(e); await services(e); ed.tool = await toolTotal(e);
    ok(Object.keys(dj.outside || {}).join() === 'cja' && dj.outside.cja.slice().sort().join(',') === 'cdn,crm,cstore,dwh' && ed.boxes === 'cdn,crm,cstore,dwh' && ed.total === dt && ed.tool === dt,
      `S27: a saved draft keeps the outside systems; opened in an empty browser, Build shows them with the same total (${dt})`, JSON.stringify({saved: dj.outside, ed}));
    const none = JSON.parse(draft); delete none.outside;
    await openDraft(e, none, 's27_none.json'); await build(e);
    const nd = {boxes: await outs(e), total: await canvasTotal(e)}; await cont(e); await services(e); nd.tool = await toolTotal(e);
    ok(nd.boxes === '' && num(nd.total) === num(dt) - 2400 - 8400 - 6000 - 6000 && nd.tool === nd.total, 'S27: a draft without outside systems (as drafts were saved before) opens with none on the canvas, and services on outside systems are not counted, on Build or Services', JSON.stringify(nd));
    const odd = JSON.parse(draft); odd.outside = {cja: ['dwh', 'mainframe', 7], commerce: ['dwh'], aem: 'cdn'};
    await openDraft(e, odd, 's27_odd.json'); await build(e);
    const od = {boxes: await outs(e), saved: await e.evaluate(() => JSON.stringify(st.out))};
    ok(od.boxes === 'dwh', 'S27: a hand-edited draft keeps only the outside systems a play offers (a data warehouse on CJA; nothing unknown, nothing on another play)', JSON.stringify(od));
    await e.context().close();

    // 7. Add service offers an outside system's services only while that system is on the canvas
    const L = await fresh(); await pick(L, 'cja', 150); await cont(L); await services(L);
    await L.click('#add-service'); await L.waitForTimeout(200);
    const lib = await L.$$eval('#available-services [data-add]', bs => bs.map(x => x.dataset.add)); await L.click('#close-modal'); await L.waitForTimeout(150);
    await build(L); await addOut(L, 'dwh'); const lt = await canvasTotal(L); await cont(L); await services(L);
    const rt = {canvas: lt, card: !!(await L.$('.service-card[data-line="OX3"]')), tool: await toolTotal(L)};
    ok(rt.canvas === '$228,000' && rt.card && rt.tool === rt.canvas, 'S27: after a trip to the Services step and back, adding the data warehouse still brings its service on, on Build and Services ($228,000)', JSON.stringify(rt));
    await L.click('.service-card[data-line="OX3"] .remove-line'); await L.waitForTimeout(150);
    await L.click('#add-service'); await L.waitForTimeout(200);
    const lib2 = await L.$$eval('#available-services [data-add]', bs => bs.map(x => x.dataset.add)); await L.click('#close-modal'); await L.waitForTimeout(150);
    ok(lib.length > 0 && !lib.some(id => /^OX/.test(id)) && lib2.includes('OX3') && !lib2.some(id => /^OX[1245]$/.test(id)),
      'S27: Add service offers none of the five outside-system services until their system is on the canvas, then only that system\'s', JSON.stringify({before: lib.filter(id => /^OX/.test(id)), after: lib2.filter(id => /^OX/.test(id))}));
    await L.context().close();

    // 8. Change play, Start over and Remove from canvas clear them
    const c = await fresh(); await pick(c, 'cja', 150); await addOut(c, 'dwh'); await addOut(c, 'cdn');
    const ch = {};
    await c.click('#change-play'); await c.waitForTimeout(150); await c.click('#confirm-yes'); await c.waitForTimeout(300);
    await c.click('#picker [data-play="abv"]'); await c.waitForTimeout(400); ch.abv = await outs(c);
    await c.click('#change-play'); await c.waitForTimeout(150); await c.click('#confirm-yes'); await c.waitForTimeout(300);
    await c.click('#picker [data-play="cja"]'); await c.waitForTimeout(400); ch.cja = await outs(c); ch.total = await canvasTotal(c);
    await addOut(c, 'crm'); await c.click('#start-over'); await c.waitForTimeout(150); await c.click('#confirm-yes'); await c.waitForTimeout(300);
    ch.over = await c.evaluate(() => st.out.length);
    await c.click('#picker [data-play="cja"]'); await c.waitForTimeout(400); ch.after = await outs(c);
    ok(ch.abv === '' && ch.cja === '' && ch.total === '$219,600' && ch.over === 0 && ch.after === '', 'S27: Change play and Start over clear the outside systems', JSON.stringify(ch));
    await c.context().close();
    const r = await fresh(); await pick(r, 'abv', 150); const r0 = await canvasTotal(r); await addOut(r, 'cdn');
    await openCard(r, '.ib[data-c="cdn-bv"]'); await r.click('#card [data-t="OX1"]'); await r.waitForTimeout(300); await shut(r);
    const r1 = await canvasTotal(r);
    await openCard(r, '.node[data-p="cdn"]'); await r.click('#card [data-rmout="cdn"]'); await r.waitForTimeout(400);
    const rr = {r0, r1, boxes: await outs(r), r2: await canvasTotal(r), card: await r.isHidden('#card'), menu: (await menuIds(r)).join(',')};
    ok(num(r1) - num(r0) === 2400 && rr.boxes === '' && rr.r2 === r0 && rr.card && rr.menu === 'cdn', 'S27: Remove from canvas takes the CDN off with its services, the total goes back, and the CDN is back in the menu', JSON.stringify(rr));
    await r.context().close();

    // 9. every play with all its outside systems on: no box on another, no i on a box, no crossing lines, all on screen
    const lay = {};
    for (const w of [1600, 1024, 768, 390]) for (const play of Object.keys(want)) {
      const q = await fresh(); await q.setViewportSize({width: w, height: 900}); await pick(q, play, 150);
      for (const id of want[play].split(',')) await addOut(q, id);
      await q.keyboard.press('Escape'); await q.mouse.move(2, 2); await q.waitForTimeout(500);
      const bad = [...await layout(q), ...(await crossings(q)).map(x => 'crossing ' + x)];
      if (bad.length) lay[play + '@' + w] = bad;
      await q.context().close(); }
    ok(!Object.keys(lay).length, 'S27: on every Brand Visibility play with all its outside systems on, at 1600, 1024, 768 and 390 pixels, no box sits on another, no i on a box, no two lines cross and nothing scrolls sideways', JSON.stringify(lay));

    // 10. the menu stays on screen at every width
    const fit = [];
    for (const w of [1600, 1280, 1024, 900, 768, 601, 390, 320]) { const q = await fresh(); await q.setViewportSize({width: w, height: 900}); await pick(q, 'cja'); await q.click('#out-btn'); await q.waitForTimeout(200);
      fit.push({w, ...await q.evaluate(() => { const m = document.getElementById('out-menu').getBoundingClientRect(); return {l: Math.round(m.left), r: Math.round(m.right), vw: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth}; })});
      await q.context().close(); }
    ok(fit.every(f => f.l >= 15 && f.r <= f.vw - 15 && f.sw <= f.vw), 'S27: at every width from 1600 to 320 pixels the Add outside system menu stays on screen, with no sideways scroll', JSON.stringify(fit));

    // 11. a phone: tap to add, tap a box to open and pin its card
    const ctx = await b.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true}); const m = await ctx.newPage(); m.on('pageerror', x => errs.push(x.message));
    await m.goto(BASE); await m.waitForTimeout(300); await m.evaluate(() => localStorage.clear()); await m.reload(); await m.waitForTimeout(400);
    await m.tap('#picker [data-play="cja"]'); await m.waitForTimeout(500); await m.tap('#out-btn'); await m.waitForTimeout(200);
    await m.tap('#out-menu [data-out="dwh"]'); await m.waitForTimeout(600);
    await m.evaluate(() => document.querySelector('.node[data-p="dwh"]').scrollIntoView({block: 'center'})); await m.waitForTimeout(200);
    const bx = await (await m.$('.node[data-p="dwh"]')).boundingBox(); await m.touchscreen.tap(bx.x + bx.width / 2, bx.y + bx.height / 2); await m.waitForTimeout(500);
    const ph = await m.evaluate(() => ({boxes: [...document.querySelectorAll('.node.out')].map(n => n.dataset.p).join(','), open: !document.getElementById('card').hidden, pinned, text: document.getElementById('card').textContent.includes('Outside system'), sw: document.documentElement.scrollWidth}));
    ok(ph.boxes === 'dwh' && ph.open && ph.pinned && ph.text && ph.sw <= 390, 'S27: on a phone a tap adds an outside system, and a tap on its box opens and pins its card, with no sideways scroll', JSON.stringify(ph));
    await ctx.close();
  });

  // ---------- step 28: what an independent verification of step 27 confirmed ----------
  await sec(async () => {
    const num = s => Number(String(s).replace(/[^0-9.]/g, ''));
    const addOut = async (p, id, tap) => { if (await p.isHidden('#out-menu')) await (tap ? p.tap('#out-btn') : p.click('#out-btn')); await p.waitForTimeout(150);
      await (tap ? p.tap(`#out-menu [data-out="${id}"]`) : p.click(`#out-menu [data-out="${id}"]`)); await p.waitForTimeout(450); if (!tap) { await p.mouse.move(3, 3); await p.waitForTimeout(300); } };
    const scale = p => p.evaluate(() => { const m = getComputedStyle(document.getElementById('stage')).transform.match(/matrix\(([^,]+)/); return m ? Math.round(parseFloat(m[1]) * 1000) / 1000 : 1; });
    const phone = async (w, h) => { const c = await b.newContext({viewport: {width: w, height: h}, isMobile: true, hasTouch: true}); const p = await c.newPage(); p.on('pageerror', x => errs.push(x.message)); return p; };

    // 1. a phone keeps the play's scale with every outside system on (no extra column)
    const sc = [];
    for (const [w, h] of [[390, 844], [320, 568]]) for (const [play, ids] of [['cja', ['dwh', 'cstore', 'crm', 'cdn']], ['aem', ['cdn']]]) {
      const p = await phone(w, h); await p.goto(BASE); await p.waitForTimeout(300); await p.tap(`#picker [data-play="${play}"]`); await p.waitForTimeout(500);
      const s0 = await scale(p); for (const id of ids) await addOut(p, id, true); await p.waitForTimeout(300); sc.push({w, play, s0, s1: await scale(p)}); await p.context().close(); }
    ok(sc.every(x => x.s1 === x.s0), 'S28: on a 390 and a 320 pixel phone, CJA with all four outside systems and AEM with its CDN keep the scale they start with (before, the canvas shrank to names of about 6 pixels)', JSON.stringify(sc));

    // 2. Use starting scope keeps the starting services of the outside systems on the canvas
    { const p = await fresh(); await pick(p, 'cja', 150); for (const id of ['dwh', 'cstore', 'crm']) await addOut(p, id);
      const t0 = await canvasTotal(p); await cont(p); await services(p); await p.click('#starting-scope'); await p.waitForTimeout(300);
      const t1 = await toolTotal(p), on = await p.evaluate(() => ['OX3', 'OX4', 'OX5'].map(i => state.estimates.cja[i].on).join()); await build(p);
      const t2 = await canvasTotal(p), removed = await p.evaluate(() => ['OX3', 'OX4', 'OX5'].filter(i => st.ls[i] === false));
      ok(t0 === '$240,000' && t1 === t0 && t2 === t0 && on === 'true,true,true' && !removed.length, 'S28: Use starting scope keeps the warehouse, cloud storage and CRM services on while their boxes are on the canvas ($240,000 on Services and Build)', JSON.stringify({t0, t1, t2, on, removed}));
      await p.context().close(); }

    // 3. a system removed and added again comes back the same after a trip or a draft
    for (const removeLine of [true, false]) {
      const p = await fresh(); await pick(p, 'cja', 150); await addOut(p, 'dwh'); await cont(p); await services(p);
      if (removeLine) { await p.click('.service-card[data-line="OX3"] .remove-line'); await p.waitForTimeout(200); }
      await build(p); await p.evaluate(() => document.querySelector('.node[data-p="dwh"]').click()); await p.waitForTimeout(300); await p.click('#card [data-rmout="dwh"]'); await p.waitForTimeout(300);
      await cont(p); await services(p); const draft = await draftOf(p);
      await build(p); await addOut(p, 'dwh'); const A = await canvasTotal(p);
      const q = await fresh(); await q.goto(BASE + 'sow/'); await q.waitForTimeout(400); await openDraft(q, draft, `s28_${removeLine}.json`); await build(q); await addOut(q, 'dwh'); const B = await canvasTotal(q);
      const want = removeLine ? '$219,600' : '$228,000';
      ok(A === want && B === want, `S28: the warehouse taken off the canvas and added again comes back the same after a trip to Services or in a draft opened elsewhere (${removeLine ? 'its service removed by the partner stays out' : 'its service comes back on'}: ${want})`, JSON.stringify({A, B}));
      await p.context().close(); await q.context().close(); }

    // 4. the keyboard: focus back on the button after Escape, adding and removing; the menu closes when the focus leaves it
    { const p = await fresh(); await p.setViewportSize({width: 1440, height: 900}); await pick(p, 'cja', 150); await p.mouse.move(3, 3);
      await p.focus('#out-btn'); await p.keyboard.press('Enter'); await p.waitForTimeout(150); await p.keyboard.press('Tab'); await p.keyboard.press('Escape'); await p.waitForTimeout(100);
      const esc = await p.evaluate(() => document.activeElement.id);
      await p.keyboard.press('Enter'); await p.waitForTimeout(150); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Enter'); await p.waitForTimeout(400);
      const add = await p.evaluate(() => ({focus: document.activeElement.id, out: st.out.join()}));
      await p.keyboard.press('Enter'); await p.waitForTimeout(150); for (let i = 0; i < 5; i++) await p.keyboard.press('Tab'); await p.waitForTimeout(150);
      const away = await p.evaluate(() => ({hidden: document.getElementById('out-menu').hidden, expanded: document.getElementById('out-btn').getAttribute('aria-expanded')}));
      await p.focus('#out-btn'); await p.keyboard.press('Enter'); await p.waitForTimeout(150); await p.keyboard.down('Shift'); await p.keyboard.press('Tab'); await p.keyboard.up('Shift'); await p.waitForTimeout(150);
      const back = await p.evaluate(() => document.getElementById('out-menu').hidden);
      await p.evaluate(() => document.querySelector('.node[data-p="dwh"]').focus()); await p.keyboard.press('Enter'); await p.waitForTimeout(300); await p.focus('#card [data-rmout="dwh"]'); await p.keyboard.press('Enter'); await p.waitForTimeout(400);
      const rm = await p.evaluate(() => ({focus: document.activeElement.id, out: st.out.join()}));
      ok(esc === 'out-btn' && add.focus === 'out-btn' && add.out === 'dwh' && away.hidden && away.expanded === 'false' && back && rm.focus === 'out-btn' && rm.out === '',
        'S28: from the keyboard, Escape, adding a system and Remove from canvas put the focus back on Add outside system, and the menu closes when the focus leaves it either way', JSON.stringify({esc, add, away, back, rm}));
      // 5. with the menu open, hovering a box opens no card under it; a click closes the menu and pins the card
      await p.click('#out-btn'); await p.waitForTimeout(150); const bx = await (await p.$('.node[data-p="cja"]')).boundingBox();
      await p.mouse.move(bx.x + bx.width - 20, bx.y + bx.height - 10); await p.waitForTimeout(500);
      const hov = await p.evaluate(() => ({card: !document.getElementById('card').hidden, menu: !document.getElementById('out-menu').hidden}));
      await p.mouse.click(bx.x + bx.width - 20, bx.y + bx.height - 10); await p.waitForTimeout(400);
      const clk = await p.evaluate(() => ({card: !document.getElementById('card').hidden, menu: !document.getElementById('out-menu').hidden, pinned}));
      ok(!hov.card && hov.menu && clk.card && !clk.menu && clk.pinned, 'S28: while the menu is open, hovering a box opens no card under it, and a click on the box closes the menu and pins its card', JSON.stringify({hov, clk}));
      await p.evaluate(() => hideCard(true));
      // 6. the badge follows the line's style; 7. the note sits in the header
      for (const id of ['dwh', 'cstore', 'crm', 'cdn']) await addOut(p, id);
      const badge = {};
      for (const c of ['dwh-cja', 'cstore-cja', 'crm-cja', 'cdn-bv']) { await p.evaluate(i => document.querySelector(`.ib[data-c="${i}"]`).click(), c); await p.waitForTimeout(300);
        badge[c] = await p.$eval('#card .kind b', e => getComputedStyle(e).borderTopStyle); await p.evaluate(() => hideCard(true)); await p.waitForTimeout(100); }
      ok(badge['dwh-cja'] === 'dotted' && badge['cstore-cja'] === 'dotted' && badge['crm-cja'] === 'dotted' && badge['cdn-bv'] === 'solid', 'S28: the Outside system badge on a connection card follows its line: dotted for the warehouse, cloud storage and CRM, solid for the CDN', JSON.stringify(badge));
      await p.click('#out-btn'); await p.waitForTimeout(150);
      const note = await p.$eval('#out-menu', m => { const q = m.querySelector('.hd p'); return {text: q.textContent, indent: Math.round(q.getBoundingClientRect().left - m.getBoundingClientRect().left), none: !!m.querySelector('p.none')}; });
      ok(note.text === 'Every outside system for this play is on your canvas.' && note.indent >= 18 && !note.none, 'S28: with every outside system on, the menu\'s note sits in its header, indented like the rest', JSON.stringify(note));
      await p.context().close(); }

    // 8. a 320-pixel phone keeps each name on one line; 9. a phone held sideways shows items and scrolls to the rest
    { const p = await phone(320, 568); await p.goto(BASE); await p.waitForTimeout(300); await p.tap('#picker [data-play="cja"]'); await p.waitForTimeout(500); await p.tap('#out-btn'); await p.waitForTimeout(250);
      const names = await p.$$eval('#out-menu .it2', its => its.map(i => { const n = i.querySelector('.nm'), sv = n.querySelector('svg').getBoundingClientRect(), t = n.getBoundingClientRect(); return {id: i.dataset.out, h: Math.round(t.height), iconBeside: Math.abs((sv.top + sv.bottom) / 2 - (t.top + t.bottom) / 2) < 6, right: Math.round(i.getBoundingClientRect().right)}; }));
      ok(names.length === 4 && names.every(x => x.h <= 24 && x.iconBeside && x.right <= 320) && await p.evaluate(() => document.documentElement.scrollWidth) <= 320, 'S28: on a 320-pixel phone each outside system\'s name stays on one line beside its icon, inside the screen', JSON.stringify(names));
      await p.context().close(); }
    const side = [];
    for (const [w, h] of [[844, 390], [667, 375], [568, 320]]) { const p = await phone(w, h); await p.goto(BASE); await p.waitForTimeout(300); await p.tap('#picker [data-play="cja"]'); await p.waitForTimeout(500); await p.tap('#out-btn'); await p.waitForTimeout(250);
      side.push({w, ...await p.evaluate(() => { const m = document.getElementById('out-menu'), r = m.getBoundingClientRect(); const full = [...m.querySelectorAll('[data-out]')].filter(i => { const q = i.getBoundingClientRect(); return q.top >= r.top - 1 && q.bottom <= r.bottom + 1; }).length;
        return {full, reach: r.bottom + scrollY <= document.documentElement.scrollHeight, sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth}; })}); await p.context().close(); }
    ok(side.every(x => x.full >= 1 && x.reach && x.sw <= x.vw), 'S28: on a phone held sideways the menu shows its first items in full, and the page scrolls to the rest', JSON.stringify(side));

    // 10. the wording, checked against Adobe's pages
    { const p = await fresh(); await p.goto(BASE + 'sow/'); await p.waitForTimeout(400);
      const w = await p.evaluate(() => { const C = id => CATALOG.find(c => c.id === id), all = ['OX1', 'OX2', 'OX3', 'OX4', 'OX5'].map(C);
        return {noCovers: all.every(c => !/it covers (this work|adding)/.test(c.assumptions)), only: ['OX3', 'OX4', 'OX5'].every(i => C(i).assumptions.includes('this service covers only the work that service does not')),
          dm: !C('OX3').assumptions.includes('or separately licensed warehouse connectors') && C('OX3').assumptions.includes('Data Mirror is not in CJA Foundation') && C('OX3').assumptions.includes('a dataset for temporary tables') && C('OX3').assumptions.includes("a SAS token in the cluster's Spark configuration") && C('OX3').basis.endsWith('through Data Mirror.'),
          tracking: C('OX3').scope.includes("confirm with the customer's data team that change tracking is on for each table") && C('OX3').exclusions.includes('(the customer turns on change tracking)'),
          xdm: C('OX4').assumptions.includes('delimited files, or JSON or Parquet files already in XDM format'), foundation: C('OX5').assumptions.includes('CJA Foundation allows one event dataset per connection'),
          aws: C('OX3').assumptions.includes('On Experience Platform running on AWS') && C('OX4').assumptions.includes('On Experience Platform running on AWS') && C('OX5').assumptions.includes('On Experience Platform running on AWS'),
          onboarded: C('OX1').assumptions.includes('already onboarded in Brand Visibility') && C('OX2').assumptions.includes('already onboarded in Brand Visibility'),
          basis: C('OX2').basis === 'Up to three domains from one CDN without an Adobe guide, or from one log store.' && C('OX2').bands.typical.qty === 'Up to 3 domains from one source',
          pd: ['OX4', 'OX5'].every(i => C(i).source2 === 'https://helpx.adobe.com/legal/product-descriptions/customer-journey-analytics.html'),
          connection: ['OX3', 'OX4', 'OX5'].every(i => C(i).scope.includes('the one Connections, data views and stitching sets up'))}; });
      ok(Object.values(w).every(Boolean), 'S28: the outside services\' wording follows Adobe\'s pages (Data Mirror only, what BigQuery and Databricks need, who turns on change tracking, XDM files, the Foundation limit, AWS, onboarded domains, the log export\'s basis, the product description as the license source) and no charged service says another covers it', JSON.stringify(w));
      // 11. one owner for CDN log forwarding
      const deps = await p.evaluate(() => [['L02', 'OX1'], ['L02', 'OX2'], ['L02', 'OX1', 'OX2'], ['L02'], ['OX2']].map(ids => (dependencyList(ids.map(id => ({id}))).find(x => x.includes('CDN log forwarding')) || '').split('. It gates')[0]));
      ok(deps[0] === "CDN log forwarding is the customer's IT team's change: the partner creates the log job in the CDN console with the team's access and change approval"
        && deps[1] === "CDN log forwarding comes through a log export the partner builds in Adobe's file format and the customer's team runs"
        && deps[2] === "CDN log forwarding is the customer's IT team's change: the partner creates the log job in the CDN console with the team's access and change approval, and builds a log export in Adobe's file format that the customer's team runs"
        && deps[3] === "CDN log forwarding is set up by the customer's IT team" && deps[4] === deps[1],
        'S28: Dependencies and risks give CDN log forwarding one owner, the customer\'s IT team, and say what the partner does with the CDN setup, the log export or both', JSON.stringify(deps));
      await p.context().close(); }
  });

  // ---------- step 29: what a focused verification of step 28 confirmed ----------
  await sec(async () => {
    const addOut = async (p, id) => { if (await p.isHidden('#out-menu')) await p.click('#out-btn'); await p.waitForTimeout(150);
      await p.click(`#out-menu [data-out="${id}"]`); await p.waitForTimeout(450); await p.mouse.move(3, 3); await p.waitForTimeout(300); };
    const removeOut = async (p, id) => { await p.evaluate(i => document.querySelector(`.node[data-p="${i}"]`).click(), id); await p.waitForTimeout(300); await p.click(`#card [data-rmout="${id}"]`); await p.waitForTimeout(350); };
    const toggle = async (p, conn, line) => { await p.evaluate(c => document.querySelector(`.ib[data-c="${c}"]`).click(), conn); await p.waitForTimeout(350);
      for (const d of await p.$$('#card details:not([open]) > summary')) await d.click(); await p.click(`#card [data-t="${line}"]`); await p.waitForTimeout(300); await p.evaluate(() => hideCard(true)); await p.waitForTimeout(150); };

    // 1. a choice made on the canvas for an outside system's service survives its removal on every path
    const cases = [['cja', 'dwh', 'dwh-cja', 'OX3', '$219,600'], ['abv', 'cdn', 'cdn-bv', 'OX1', '$212,400'], ['commerce', 'cdn', 'cdn-bv', 'OX2', '$228,000']];
    const got = {};
    for (const [play, sys, conn, line, want] of cases) for (const path of ['none', 'trip', 'back', 'draft']) {
      const p = await fresh(); await pick(p, play, 150); await addOut(p, sys); await toggle(p, conn, line); await removeOut(p, sys);
      let q = p;
      if (path === 'trip') { await cont(p); await services(p); await build(p); }
      if (path === 'back') { await cont(p); await p.goBack(); await p.waitForURL(u => !/\/sow\//.test(String(u))); await p.waitForTimeout(500); }
      if (path === 'draft') { await cont(p); await services(p); const d = await draftOf(p); q = await fresh(); await q.goto(BASE + 'sow/'); await q.waitForTimeout(400); await openDraft(q, d, `s29_${play}.json`); await build(q); }
      await addOut(q, sys); got[`${play}/${path}`] = await canvasTotal(q) === want ? 'ok' : await canvasTotal(q);
      await cont(q); await services(q); if (await toolTotal(q) !== want) got[`${play}/${path}`] += ' services ' + await toolTotal(q);
      await p.context().close(); if (q !== p) await q.context().close(); }
    ok(Object.values(got).every(v => v === 'ok'), 'S29: a service taken out or added on the canvas keeps that choice when its outside system is removed and added again, with no trip, after a trip to Services, after the Back button and in a draft opened elsewhere (CJA $219,600, Brand Visibility $212,400, Commerce $228,000, on Build and Services)', JSON.stringify(got));

    // 2. Use starting scope also resets the services of an outside system off the canvas
    { const p = await fresh(); await pick(p, 'cja', 150); await addOut(p, 'dwh'); await cont(p); await services(p);
      await p.click('.service-card[data-line="OX3"] .remove-line'); await p.waitForTimeout(200); await build(p); await removeOut(p, 'dwh');
      await cont(p); await services(p); await p.click('#starting-scope'); await p.waitForTimeout(300); await build(p); await addOut(p, 'dwh');
      const t = {canvas: await canvasTotal(p)}; await cont(p); await services(p); t.services = await toolTotal(p);
      ok(t.canvas === '$228,000' && t.services === '$228,000', 'S29: after Use starting scope, a system added again starts with its starting services even if it was off the canvas when the button was pressed ($228,000)', JSON.stringify(t));
      await p.context().close(); }

    // 3. Safari and Firefox on a Mac (a pressed button takes no focus): one click on the button still closes the menu
    const MAC = `(() => { const mf = el => { if (!(el instanceof Element)) return false; const t = el.tagName; if (t === 'BUTTON' || t === 'SUMMARY') return false;
        if (t === 'INPUT') return !['button', 'submit', 'reset', 'checkbox', 'radio', 'image', 'file', 'color', 'range'].includes((el.type || 'text').toLowerCase());
        if (t === 'TEXTAREA' || t === 'SELECT') return true; if (el.isContentEditable) return true; return el.hasAttribute('tabindex'); };
      document.addEventListener('mousedown', e => { if (e.button !== 0) return; let el = e.target instanceof Element ? e.target : e.target.parentElement; while (el && !mf(el)) el = el.parentElement;
        e.preventDefault(); if (el) { if (document.activeElement !== el) el.focus({preventScroll: true}); } else if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur(); }, true); })();`;
    { const c = await b.newContext({viewport: {width: 1440, height: 900}}); await c.addInitScript(MAC); const p = await c.newPage(); p.on('pageerror', x => errs.push(x.message));
      await p.goto(BASE); await p.waitForTimeout(300); await p.click('#picker [data-play="cja"]'); await p.waitForTimeout(400); await p.mouse.move(3, 3);
      const r = {};
      await p.click('#out-btn'); await p.waitForTimeout(150); await p.click('#out-menu .hd p'); await p.waitForTimeout(150); r.headerKeeps = await p.isVisible('#out-menu');
      await p.click('#out-btn'); await p.waitForTimeout(250); r.oneClickCloses = await p.isHidden('#out-menu') && await p.getAttribute('#out-btn', 'aria-expanded') === 'false';
      await p.focus('#out-btn'); await p.keyboard.press('Enter'); await p.waitForTimeout(150); await p.click('#out-btn'); await p.waitForTimeout(250); r.afterKeyboard = await p.isHidden('#out-menu');
      await p.click('#out-btn'); await p.waitForTimeout(150); await p.click('#out-menu [data-out="crm"]'); await p.waitForTimeout(450); r.itemAdds = await p.evaluate(() => st.out.join()) === 'crm';
      await p.click('#out-btn'); await p.waitForTimeout(150); await p.mouse.click(700, 860); await p.waitForTimeout(250); r.outsideCloses = await p.isHidden('#out-menu');
      ok(Object.values(r).every(Boolean), 'S29: with a Mac\'s click focus (Safari, Firefox), a click on the menu\'s text keeps it open, one click on Add outside system closes it (also after opening it from the keyboard), an item still adds its system and a click elsewhere closes it', JSON.stringify(r));
      await c.close(); }
  });

  // ---------- step 30: counted once becomes the overlap review (Adam: "ok" to option A) ----------
  await sec(async () => {
    const addOut = async (p, id) => { if (await p.isHidden('#out-menu')) await p.click('#out-btn'); await p.waitForTimeout(150);
      await p.click(`#out-menu [data-out="${id}"]`); await p.waitForTimeout(450); await p.mouse.move(3, 3); await p.waitForTimeout(300); };
    const card = async (p, sel) => { await p.evaluate(s => document.querySelector(s).click(), sel); await p.waitForTimeout(350); for (const d of await p.$$('#card details:not([open]) > summary')) await d.click(); await p.waitForTimeout(150); };
    const close = async p => { await p.evaluate(() => hideCard(true)); await p.waitForTimeout(150); };
    // 1. turning CJA data preparation on never lowers the total, whether from the canvas or from Services
    const a = await fresh(); await pick(a, 'cja', 150); for (const id of ['dwh', 'cstore', 'crm']) await addOut(a, id);
    const a0 = await canvasTotal(a); await card(a, '.node[data-p="cja"]'); await a.click('#card [data-t="CJ01"]'); await a.waitForTimeout(300); await close(a);
    const a1 = await canvasTotal(a); await cont(a); await services(a); const a2 = await toolTotal(a);
    const q = await fresh(); await pick(q, 'cja', 150); for (const id of ['dwh', 'cstore', 'crm']) await addOut(q, id); await cont(q); await services(q);
    await addLib(q, 'CANVAS-CJ01'); const q1 = await toolTotal(q); await build(q); const q2 = await canvasTotal(q);
    await card(q, '.ib[data-c="crm-cja"]'); const note = await q.$eval('#card .ln[data-l="OX5"]', x => x.textContent.includes('Overlaps with CJA data preparation in Experience Platform, which is on.')); await close(q);
    ok(a0 === '$240,000' && a1 === '$252,000' && a2 === a1 && q1 === a1 && q2 === a1 && note, 'S30: with the warehouse, cloud storage and CRM on, turning CJA data preparation on adds its $12,000 ($240,000 to $252,000) whether it is turned on from the canvas or from Services, and the canvas shows the overlap (before, the canvas dropped to $231,600)', JSON.stringify({a0, a1, a2, q1, q2, note}));
    await q.context().close();
    // 2. turned on on the canvas, then taken out on Services: the source services stay on, on both screens, and the note goes
    await a.click('.service-card[data-line="CANVAS-CJ01"] .remove-line'); await a.waitForTimeout(200); const r1 = await toolTotal(a); await build(a); const r2 = await canvasTotal(a);
    await card(a, '.ib[data-c="dwh-cja"]'); const row = await a.$eval('#card .ln[data-l="OX3"]', x => ({off: x.classList.contains('off'), note: x.textContent.includes('Overlaps with')})); await close(a);
    ok(r1 === '$240,000' && r2 === r1 && !row.off && !row.note, 'S30: CJA data preparation turned on on the canvas and taken out on Services leaves the three source services on, on Services and Build ($240,000), and the overlap note goes (before, they stayed off at $219,600)', JSON.stringify({r1, r2, row}));
    await a.context().close();
    // 3. nothing says it is covered any more; the generic Coworker Skills keep their own replaced behavior
    const html = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8'), sowHtml = fs.readFileSync(path.join(SITE, 'sow', 'index.html'), 'utf8');
    ok(!html.includes('Covered by ') && !html.includes('COVER') && !sowHtml.includes('COVER') && !sowHtml.includes('it covers this work') && html.includes('Replaced by the specialized Skills on this canvas. Check to keep it for distinct Skills.'),
      'S30: the covering is gone from both pages (no covered lines, no COVER rule), and the generic Coworker Skills still show as replaced by specialized ones');
  });

  // ---------- step 31: Download template is gone; Services CSV sits beside Download SOW (Adam: "ok") ----------
  await sec(async () => {
    const p = await fresh(); await pick(p, 'cja', 150); await cont(p);
    const top = await p.$$eval('header .top-actions button', b => b.map(x => x.textContent.trim()));
    await p.click('[data-step="document"]'); await p.waitForTimeout(250);
    const doc = await p.$$eval('.document-actions .top-actions button', b => b.map(x => x.textContent.trim()));
    const gone = await p.evaluate(() => !document.getElementById('download-tool') && !document.querySelector('details.more') && typeof CLEAN_HTML === 'undefined' && !document.documentElement.outerHTML.includes('Download template'));
    ok(JSON.stringify(top) === JSON.stringify(['Save draft', 'Open draft', 'Start over']) && JSON.stringify(doc) === JSON.stringify(['Edit services', 'Services CSV', 'Download SOW', 'Print / PDF']) && gone,
      'S31: the top bar keeps Save draft, Open draft and Start over; the Statement of work step has Edit services, Services CSV, Download SOW and Print / PDF; Download template and the More menu are gone', JSON.stringify({top, doc, gone}));
    await p.evaluate(t => { state.terms = t; save(); }, TERMS); await p.click('[data-step="scope"]'); await p.waitForTimeout(150); await p.click('[data-step="document"]'); await p.waitForTimeout(250);
    const csv = parseCsv(await download(p, () => p.click('#export-csv'))), page = await download(p, () => p.click('#download-sow'));
    const row = csv.find(r => r.join(' ').includes('Illustrative total'));
    ok(csv.length > 6 && !!row && page.includes('<!doctype html>') && page.includes('Brand Visibility'), 'S31: from the Statement of work step, Services CSV and Download SOW both download the finished SOW (a spreadsheet, and a page anyone can open, email or print)', JSON.stringify({rows: csv.length, total: row && row.slice(-3)}));
    await p.context().close();
    const m = await (await b.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true})).newPage(); m.on('pageerror', x => errs.push(x.message));
    await m.goto(BASE); await m.waitForTimeout(300); await m.tap('#picker [data-play="cja"]'); await m.waitForTimeout(500); await m.tap('#save'); await m.waitForURL('**/sow/index.html#scope'); await m.waitForTimeout(400);
    await m.tap('[data-step="document"]'); await m.waitForTimeout(300);
    const fit = await m.evaluate(() => ({sw: document.documentElement.scrollWidth, right: Math.max(...[...document.querySelectorAll('.document-actions .top-actions button, header .top-actions button')].map(x => x.getBoundingClientRect().right))}));
    ok(fit.sw <= 390 && fit.right <= 390, 'S31: on a 390-pixel phone the Statement of work buttons and the top bar fit the screen', JSON.stringify(fit));
    await m.context().close();
  });

  // ---------- step 32: the three longest assumptions in short paragraphs (Adam: "OK, I like your suggestion") ----------
  await sec(async () => {
    const p = await fresh(); await pick(p, 'aem', 150); await cont(p);
    const w = await p.evaluate(() => ['SO1', 'SO2', 'F02'].map(id => { const t = CATALOG.find(c => c.id === id).assumptions; return {id, paras: t.split('\n\n').length, same: t.replace(/\n\n/g, ' ') === PRIOR32[id].assumptions[0]}; }));
    ok(w.map(x => x.paras).join() === '6,6,5' && w.every(x => x.same), 'S32: the assumptions of Sites Optimizer setup, Monthly SEO fixes and Implement Brand Concierge are in 6, 6 and 5 short paragraphs, with exactly the same words', JSON.stringify(w));
    await services(p);
    const box = await p.$eval('.service-card[data-line="SO1"] textarea[data-line-field="assumptions"]', t => t.value);
    await p.evaluate(t => { state.terms = t; save(); }, TERMS); await p.click('[data-step="document"]'); await p.waitForTimeout(300);
    const prev = await p.evaluate(() => { const el = [...document.querySelectorAll('#sow-preview .sow-preline')].find(x => x.textContent.startsWith('The customer has licensed Sites Optimizer')); return el ? {ws: getComputedStyle(el).whiteSpace, breaks: (el.textContent.match(/\n\n/g) || []).length} : null; });
    const page = await htmlOf(p), rows = parseCsv(await csvOf(p)), head = rows[0], so1 = rows.find(r => r[2] === 'Sites Optimizer setup');
    const col = head.indexOf('Assumptions');
    ok(box.includes('sites.\n\nHow a fix is deployed') && !!prev && prev.ws === 'pre-line' && prev.breaks === 5 && page.includes('production site. Hours scale with the number of sites.\n\nHow a fix') && !!so1 && col > 0 && so1[col].split('\n\n').length === 6,
      'S32: the breaks show in the edit box on the Services step, the SOW preview (one paragraph each), the downloaded SOW and the CSV', JSON.stringify({prev, col, csvParas: so1 && so1[col].split('\n\n').length}));
    // a draft holding the single-block wording, unedited, takes the paragraphs; an edited one keeps the partner's words
    const d = JSON.parse(await draftOf(p)), old = await p.evaluate(() => [PRIOR32.SO1.assumptions[0], PRIOR32.SO2.assumptions[0]]);
    d.estimates.aem.SO1.assumptions = old[0]; d.estimates.aem.SO1.scopeChanged = false; d.estimates.aem.SO2.assumptions = old[1] + ' Fixes are logged in the customer\'s tracker.';
    await openDraft(p, d, 's32.json');
    const got = await p.evaluate(() => { const a = state.estimates.aem.SO1, b = state.estimates.aem.SO2; return {so1: a.assumptions.split('\n\n').length, so1Edited: a.scopeChanged, so2Kept: b.assumptions.endsWith("Fixes are logged in the customer's tracker.") && !b.assumptions.includes('\n\n'), so2Edited: b.scopeChanged}; });
    ok(got.so1 === 6 && !got.so1Edited && got.so2Kept && got.so2Edited, 'S32: a saved draft with the earlier single-block wording takes the paragraphs and is not marked edited; one the partner edited keeps the partner\'s words', JSON.stringify(got));
    // Create your own play without Brand Visibility reads neutrally and keeps its paragraphs
    const n = await p.evaluate(() => { const was = CUSTOM_BV; CUSTOM_BV = false; const t = lineText(CATALOG.find(c => c.id === 'SO1'), 'custom', 'typical', 'assumptions'); CUSTOM_BV = was; return t; });
    ok(n.split('\n\n').length === 6 && !n.includes('Brand Visibility connects') && n.split('\n\n')[5].startsWith("Access for Adobe's scanner is requested here"), 'S32: without Brand Visibility the neutral wording keeps its paragraphs (the Brand Visibility sentence drops out of the last one)', n.split('\n\n')[5]);
    await p.context().close();
  });

  // ---------- step 33: what a verification of steps 30 to 32 confirmed ----------
  await sec(async () => {
    // 1. Create your own play: canvas copies saved with older wording take the current wording, unflagged, on every path
    const a = await fresh(); await a.goto(BASE); await a.waitForTimeout(300); await a.click('#picker [data-play="custom"]'); await a.waitForTimeout(400);
    for (const id of ['bv', 'eds', 'so', 'bc']) { await a.evaluate(i => addProduct(i), id); await a.waitForTimeout(250); }
    await a.keyboard.press('Escape'); await a.fill('#rate', '150'); await a.mouse.click(40, 938); await a.waitForTimeout(200); await cont(a); await services(a);
    const d = JSON.parse(await draftOf(a)), old = await a.evaluate(() => ({so1: PRIOR32.SO1.assumptions[0], so2: PRIOR32.SO2.assumptions[0], f02: PRIOR32.F02.assumptions[0], so1Scope: PRIOR19.SO1.scope[0]})); const t0 = await toolTotal(a); await a.context().close();
    const copy = id => d.canvas.find(c => c.id === id);
    copy('CANVAS-SO1').assumptions = old.so1; copy('CANVAS-SO1').scope = old.so1Scope; copy('CANVAS-SO2').assumptions = old.so2; copy('CANVAS-F02').assumptions = old.f02;
    const est = d.estimates.custom; est['CANVAS-SO1'].assumptions = old.so1; est['CANVAS-SO1'].scope = old.so1Scope; est['CANVAS-F02'].assumptions = old.f02; est['CANVAS-SO2'].assumptions = old.so2 + ' Fixes are logged in the customer\'s tracker.';
    for (const id of ['CANVAS-SO1', 'CANVAS-SO2', 'CANVAS-F02']) est[id].scopeChanged = false;
    const e = await fresh(); await e.goto(BASE + 'sow/'); await e.waitForTimeout(400); await openDraft(e, d, 's33_custom.json');
    const look = () => e.evaluate(() => { const r = state.estimates.custom, C = id => CATALOG.find(c => c.id === id);
      return {so1: r['CANVAS-SO1'].assumptions.split('\n\n').length, so1Scope: r['CANVAS-SO1'].scope === lineText(C('SO1'), 'custom', r['CANVAS-SO1'].band, 'scope'), f02: r['CANVAS-F02'].assumptions.split('\n\n').length,
        so2Kept: r['CANVAS-SO2'].assumptions.endsWith("Fixes are logged in the customer's tracker."), flags: ['CANVAS-SO1', 'CANVAS-SO2', 'CANVAS-F02'].map(i => i + ':' + r[i].scopeChanged).join(' ')}; });
    const g1 = await look(); await build(e); await cont(e); await services(e); await e.reload(); await e.waitForTimeout(600); const g2 = await look(); const t1 = await toolTotal(e);
    const good = g => g.so1 === 6 && g.so1Scope && g.f02 === 5 && g.so2Kept && g.flags === 'CANVAS-SO1:false CANVAS-SO2:true CANVAS-F02:false';
    ok(good(g1) && good(g2) && t1 === t0, `S33: on Create your own play, services saved with older wording take today's wording (the paragraphs too) and stay unflagged after a trip to Build and a reload; a line the partner edited keeps the partner's words (${t1})`, JSON.stringify({g1, g2, t0, t1}));
    await e.context().close();
    // 2. the AEM play's printed SOW keeps its footer with the Approval section
    const p = await fresh(); await pick(p, 'aem', 150); await cont(p); await p.evaluate(t => { state.terms = t; save(); }, TERMS); await p.click('[data-step="document"]'); await p.waitForTimeout(400);
    await p.emulateMedia({media: 'print'}); const pdf = path.join(TMP, 's33_aem.pdf'); await p.pdf({path: pdf, preferCSSPageSize: true, printBackground: true}); await p.emulateMedia({media: 'screen'});
    const {execFileSync} = require('child_process'); const pages = Number(/Pages:\s+(\d+)/.exec(execFileSync('pdfinfo', [pdf]).toString())[1]);
    const last = execFileSync('pdftotext', ['-f', String(pages), '-l', String(pages), pdf, '-']).toString().replace(/\s+/g, ' ').trim();
    ok(last.includes('Approval') && last.includes('Draft for review') && last.length > 120, `S33: the AEM play's printed SOW ends with the Approval section and the footer together (page ${pages} of ${pages}), never the footer alone`, last.slice(0, 160));
    await p.context().close();
    // 3. the four Statement of work buttons: one row, or two even rows on phones; Print / PDF never alone
    const rows = [];
    for (const w of [1440, 950, 800, 600, 450, 390, 320]) { const q = await fresh(); await q.setViewportSize({width: w, height: 900}); await pick(q, 'cja', 150); await cont(q); await q.click('[data-step="document"]'); await q.waitForTimeout(300);
      rows.push({w, rows: await q.$$eval('.document-actions .top-actions button', bs => { const m = new Map(); for (const b of bs) { const t = Math.round(b.getBoundingClientRect().top); m.set(t, (m.get(t) || 0) + 1); } return [...m.values()].join('+'); })}); await q.context().close(); }
    ok(rows.every(r => r.rows === '4' || r.rows === '2+2') && rows.filter(r => r.w <= 450).every(r => r.rows === '2+2') && rows.filter(r => r.w >= 600).every(r => r.rows === '4'), 'S33: the four Statement of work buttons sit in one row, or in two even rows on phones, at 1440 to 320 pixels (Print / PDF never alone)', JSON.stringify(rows));
  });

  // ---------- step 34: what a verification of step 33 confirmed, mostly work saved on the live site (step 13) carried into this version ----------
  await sec(async () => {
    // 1. the front page opened first: a browser from the live site keeps its rate and the services chosen on the SOW steps
    const p = await fresh(); await pick(p, 'fsi', 150); await cont(p); await services(p); await addLib(p, 'CANVAS-C05'); await addLib(p, 'C04');
    const t0 = await toolTotal(p);
    // the live site saved its canvas like this: no version mark, its $150 default, none of the SOW steps' choices
    await p.evaluate(() => localStorage.setItem('abv-sow-build-v1', JSON.stringify({play: 'fsi', on: [], ls: {}, rate: 150, size: 'typical'})));
    try { await p.goto(BASE); } catch (e) {} await p.waitForTimeout(1500); await p.waitForSelector('#rate');
    const front = {url: [BASE, BASE + 'index.html'].includes(p.url()), rate: await p.inputValue('#rate'), total: await canvasTotal(p)};
    await cont(p); const after = await p.evaluate(() => ({rate: state.rate, C04: state.estimates.fsi.C04.on, C05: !!(state.estimates.fsi['CANVAS-C05'] && state.estimates.fsi['CANVAS-C05'].on)})); const t1 = await toolTotal(p);
    ok(front.url && front.rate === '150' && front.total === t0 && after.rate === 150 && after.C04 && after.C05 && t1 === t0, `S34: a browser from the live site that opens the front page first keeps its rate and the services chosen on the SOW steps (${t0})`, JSON.stringify({front, after, t0, t1}));
    await p.context().close();
    // 2. a research line saved with the live site's wording takes today's wording after a trip to Build, and stays unflagged
    const a = await fresh(); await a.goto(BASE); await a.waitForTimeout(300); await a.click('#picker [data-play="custom"]'); await a.waitForTimeout(400);
    for (const id of ['bv', 'eds', 'bc']) { await a.evaluate(i => addProduct(i), id); await a.waitForTimeout(250); }
    await a.keyboard.press('Escape'); await a.fill('#rate', '150'); await a.mouse.click(40, 938); await a.waitForTimeout(200); await cont(a);
    const d = JSON.parse(await draftOf(a)); await a.context().close();
    const OLD = 'Add a Brand Concierge block to the site code, place it on the agreed pages and navigation, and set the surface rules for where the concierge appears.';
    const live = {scope: OLD, deliverable: OLD, acceptance: 'Customer confirms the agreed deliverable meets the documented scope.', assumptions: 'Customer and partner agree access, inputs and review responsibilities.', exclusions: 'Work outside the described scope.'};
    Object.assign(d.canvas.find(c => c.id === 'CANVAS-XA11'), live, {source: 'https://experienceleague.adobe.com/en/docs/platform-learn/tutorial-one-adobe/agents/agents4/ex2', sourceTitle: 'Experience League: Implement Brand Concierge on your website (One Adobe tutorial)'});
    Object.assign(d.estimates.custom['CANVAS-XA11'], live, {scopeChanged: false});
    const e = await fresh(); await e.goto(BASE + 'sow/'); await e.waitForTimeout(400); await openDraft(e, d, 's34_concept.json');
    const g0 = await e.evaluate(() => ({on: state.estimates.custom['CANVAS-XA11'].on, scope: state.estimates.custom['CANVAS-XA11'].scope}));
    await build(e); await cont(e); await services(e); await e.reload(); await e.waitForTimeout(600);
    const g = await e.evaluate(() => { const r = state.estimates.custom['CANVAS-XA11'], s = catalog().find(c => c.id === 'CANVAS-XA11' && c.plays.includes('custom')), h = document.querySelector('.service-card[data-line="CANVAS-XA11"] .review-hint');
      return {current: TEXT_KEYS.every(k => r[k] === lineText(s, 'custom', r.band, k)), newScope: !r.scope.startsWith('Add a Brand Concierge block'), flagged: r.scopeChanged, hint: !!h && !h.hidden}; });
    ok(g0.on && g0.scope === OLD && g.current && g.newScope && !g.flagged && !g.hint, 'S34: a research line saved with the live site\'s wording takes today\'s wording after a trip to Build and stays unflagged after a reload', JSON.stringify({g0, g}));
    await e.context().close();
    // 3. two plays in one browser that take the same canvas line: each keeps its own copy, choice and rate, after a reload and in a draft
    const q = await fresh(); await pick(q, 'cja', 150); await cont(q); await build(q);
    await q.click('#change-play'); await q.waitForTimeout(200); await q.click('#confirm-yes'); await q.waitForTimeout(300); await q.click('#picker [data-play="aem"]'); await q.waitForTimeout(400); await cont(q); await services(q);
    await addLib(q, 'CANVAS-C05'); const rf = '.service-card[data-line="CANVAS-C05"] [data-line-field="rate"]'; await q.fill(rf, '222'); await q.dispatchEvent(rf, 'change'); await q.waitForTimeout(250);
    const u0 = await toolTotal(q); await q.reload(); await q.waitForTimeout(600);
    const aemC05 = () => { const r = state.estimates.aem['CANVAS-C05']; return r ? {on: r.on, rate: r.rate} : null; };
    const k1 = await q.evaluate(aemC05), u1 = await toolTotal(q), dd = JSON.parse(await draftOf(q)); await q.context().close();
    const w = await fresh(); await w.goto(BASE + 'sow/'); await w.waitForTimeout(400); await openDraft(w, dd, 's34_two_plays.json');
    const k2 = await w.evaluate(aemC05), u2 = await toolTotal(w); await w.context().close();
    ok(!!k1 && k1.on && k1.rate === 222 && u1 === u0 && !!k2 && k2.on && k2.rate === 222 && u2 === u0, `S34: two plays that take the same canvas line each keep their own copy, its choice and its rate, after a reload and in a draft (${u0})`, JSON.stringify({k1, k2, u0, u1, u2}));
    // 4. Create your own play with the retired Technical SEO and AI-search improvements on (the live site's canvas copy): the partner's own service, in both totals
    const o = await fresh(); await o.goto(BASE); await o.waitForTimeout(300); await o.click('#picker [data-play="custom"]'); await o.waitForTimeout(400);
    for (const id of ['bv', 'eds']) { await o.evaluate(i => addProduct(i), id); await o.waitForTimeout(250); }
    await o.keyboard.press('Escape'); await o.fill('#rate', '150'); await o.mouse.click(40, 938); await o.waitForTimeout(200); await cont(o);
    const od = JSON.parse(await draftOf(o)), O3 = await o.evaluate(() => O03_RETIRED); await o.context().close();
    const MY = 'Fix the 12 agreed crawl and schema issues on the main site (partner edit).';
    od.canvas.push({id: 'CANVAS-O03', name: O3.name, stage: 'Optimize', low: 24, base: O3.base, high: 96, unit: 'monthly', plays: ['custom'], scope: O3.scope, deliverable: O3.deliverable, acceptance: O3.acceptance, assumptions: O3.assumptions, exclusions: O3.exclusions, basis: 'Service chosen on the Build canvas.', source: 'https://experienceleague.adobe.com/en/docs/llm-optimizer/using/home', sourceTitle: 'Experience League: Brand Visibility'});
    od.estimates.custom['CANVAS-O03'] = {on: true, band: 'typical', bandSet: false, hours: O3.base, hoursEdited: false, hoursWhy: '', rate: '', cadence: 'monthly', scope: MY, deliverable: O3.deliverable, acceptance: O3.acceptance, assumptions: O3.assumptions, exclusions: O3.exclusions, scopeChanged: true};
    const v = await fresh(); await v.goto(BASE + 'sow/'); await v.waitForTimeout(400); await openDraft(v, od, 's34_o03.json');
    await build(v); const cv = await canvasTotal(v); await cont(v);
    const sel = await v.evaluate(m => selectedLines().filter(s => state.estimates.custom[s.id] && state.estimates.custom[s.id].scope === m).map(s => s.id), MY), sv = await toolTotal(v);
    ok(sel.length === 1 && /^CUSTOM-O03/.test(sel[0]) && sv === cv, `S34: on Create your own play the retired Technical SEO and AI-search improvements becomes the partner's own service with its edit, and Build and the SOW steps show the same total (${sv})`, JSON.stringify({sel, cv, sv}));
    await v.context().close();
    // 5. canvas copies keep a second reference (Sites Optimizer setup on Create your own play)
    const r2 = await fresh(); await r2.goto(BASE); await r2.waitForTimeout(300); await r2.click('#picker [data-play="custom"]'); await r2.waitForTimeout(400);
    for (const id of ['bv', 'so', 'eds']) { await r2.evaluate(i => addProduct(i), id); await r2.waitForTimeout(250); }
    await r2.keyboard.press('Escape'); await r2.mouse.click(40, 938); await r2.waitForTimeout(200); await cont(r2); await services(r2);
    const links = await r2.$$eval('.service-card[data-line="CANVAS-SO1"] .service-source a', as => as.map(x => x.textContent));
    ok(links.length === 2 && links[1].includes('code patches'), 'S34: on Create your own play, Sites Optimizer setup cites both its references, as on the AEM play', JSON.stringify(links));
    await r2.context().close();
    // 6. the FSI Scope note follows the discovery-to-answer workflow's own choice
    const f = await fresh(); await pick(f, 'fsi', 150); await cont(f); await services(f); await addLib(f, 'C04'); await f.click('[data-step="scope"]'); await f.waitForTimeout(300);
    const note = await f.textContent('#fsi-note');
    ok(note.includes('discovery-to-answer workflow is on') && !note.includes('workflow is off'), 'S34: on the FSI play the Scope step\'s note says the discovery-to-answer workflow is on once it is added', note);
    await f.context().close();
    // 7. the four Statement of work buttons with a 17-pixel scrollbar, with the fallback font (Google Fonts blocked) and with large text on phones
    const b2 = await chromium.launch({ignoreDefaultArgs: ['--hide-scrollbars']});
    const layout = async (w, o2 = {}) => { const ctx = await (o2.scrollbar ? b2 : b).newContext({viewport: {width: w, height: 900}}); const x = await ctx.newPage(); x.on('pageerror', er => errs.push(er.message));
      if (o2.nofont) await x.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
      if (o2.scrollbar) await x.addInitScript(() => document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = '::-webkit-scrollbar{width:17px;height:17px}::-webkit-scrollbar-thumb{background:#999}'; document.head.appendChild(s); }));
      await pick(x, 'cja', 150); await cont(x); await x.click('[data-step="document"]'); await x.waitForTimeout(300);
      if (o2.text) { await x.evaluate(s => { const all = [...document.querySelectorAll('body *')], px = all.map(el => parseFloat(getComputedStyle(el).fontSize)); all.forEach((el, i) => { el.style.fontSize = (px[i] * s) + 'px'; }); }, o2.text); await x.waitForTimeout(200); }
      const m = await x.$$eval('.document-actions .top-actions button', bs => { const t = new Map(); let right = 0, left = 1e9; for (const bt of bs) { const c = bt.getBoundingClientRect(), k = Math.round(c.top); t.set(k, (t.get(k) || 0) + 1); right = Math.max(right, c.right); left = Math.min(left, c.left); }
        return {rows: [...t.values()].join('+'), right: Math.round(right), left: Math.round(left), vw: innerWidth, bar: innerWidth - document.documentElement.clientWidth}; });
      await ctx.close(); return {w, ...o2, ...m}; };
    const lay = [await layout(1008, {scrollbar: true}), await layout(1040, {nofont: true}), await layout(524, {nofont: true}), await layout(320, {text: 2}), await layout(360, {text: 1.75}), await layout(412, {text: 2})];
    await b2.close();
    const even = lay.filter(r => !r.text), big = lay.filter(r => r.text);
    ok(lay[0].bar >= 15 && even.every(r => r.rows === '4' || r.rows === '2+2') && big.every(r => r.left >= 0 && r.right <= r.vw), 'S34: the four Statement of work buttons stay in one row or two even rows with a scrollbar and with the fallback font, and stay on screen with large text on phones', JSON.stringify(lay));
  });

  // ---------- step 35: what a verification of step 34 confirmed (the one-time catch-up for browsers from the live site) ----------
  await sec(async () => {
    // the live site (step 13) saved its canvas as {play, on, ls, rate, size}: no version mark, $150 and Typical by default
    const live = (p, c) => p.evaluate(v => localStorage.setItem('abv-sow-build-v1', JSON.stringify(v)), {on: [], ls: {}, rate: 150, size: 'typical', ...c});
    const goFront = async p => { try { await p.goto(BASE); } catch (e) {} await p.waitForTimeout(1500); await p.waitForSelector('#rate'); };
    // a live-site engagement whose canvas the live site saved with its own later values (a line off, Large, $210); step 35 merged them, step 36 lets the saved engagement win (S36)
    const made = await fresh(); await pick(made, 'cja', 150); await cont(made);
    await live(made, {play: 'cja', ls: {O02: false}, rate: 210, size: 'large'}); const S = await made.context().storageState(); await made.context().close();
    // 2. an interrupted catch-up runs again on the next load, and a live-site tab still open after the deploy is caught up too
    const q = await fresh(); await pick(q, 'cja', 150); await cont(q); await services(q); await q.fill('#service-rate', '175'); await q.dispatchEvent('#service-rate', 'change'); await q.waitForTimeout(250); await addLib(q, 'CANVAS-C05');
    const t175 = await toolTotal(q); await live(q, {play: 'cja'});
    const trip = u => u.search.includes('sync=build'); await q.route(trip, r => r.abort()); try { await q.goto(BASE); } catch (e) {} await q.waitForTimeout(1200); await q.unroute(trip);
    await goFront(q); const r1 = {rate: await q.inputValue('#rate'), total: await canvasTotal(q)};
    await live(q, {play: 'cja', rate: 180}); await goFront(q); const r2 = {rate: await q.inputValue('#rate'), total: await canvasTotal(q)};
    await cont(q); const r3 = await q.evaluate(() => ({rate: state.rate, C05: !!(state.estimates.cja['CANVAS-C05'] && state.estimates.cja['CANVAS-C05'].on)})); await q.context().close();
    ok(r1.rate === '175' && r1.total === t175 && r2.rate === '175' && r2.total === t175 && r3.rate === 175 && r3.C05, `S35: a catch-up cut off by a dropped connection runs again on the next load (rate $175 and the added line kept, ${t175}), and a live-site tab that saves after the deploy is caught up again to the engagement (step 36: the saved engagement wins)`, JSON.stringify({t175, r1, r2, r3}));
    // 3. nothing paints during the trip: neither the picker nor the SOW steps' empty form (a slow connection)
    const ctx = await b.newContext({viewport: {width: 1600, height: 950}, storageState: S});
    await ctx.addInitScript(() => { try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') { try { const k = 'fcp ' + location.pathname + location.search; sessionStorage.setItem(k, String((Number(sessionStorage.getItem(k)) || 0) + 1)); } catch (x) {} } }).observe({type: 'paint', buffered: true}); } catch (x) {} });
    const v = await ctx.newPage(); v.on('pageerror', e => errs.push(e.message)); const cdp = await ctx.newCDPSession(v);
    await cdp.send('Network.emulateNetworkConditions', {offline: false, latency: 400, downloadThroughput: 200000, uploadThroughput: 93750});
    try { await v.goto(BASE); } catch (e) {}
    for (let i = 0; i < 120; i++) { const done = await v.evaluate(() => /^\/(index\.html)?$/.test(location.pathname) && window.READY === true && !window.CATCHUP && getComputedStyle(document.documentElement).visibility === 'visible' && (JSON.parse(localStorage.getItem('abv-sow-build-v1') || '{}').v === 2)).catch(() => false); if (done) break; await v.waitForTimeout(250); }
    await v.waitForTimeout(800);
    const paints = await v.evaluate(() => Object.fromEntries(Object.keys(sessionStorage).filter(k => k.startsWith('fcp ')).map(k => [k.slice(4), sessionStorage.getItem(k)]))); await ctx.close();
    const keys = Object.keys(paints);
    ok(!keys.some(k => k.startsWith('/sow/')) && !paints['/'] && keys.some(k => /^\/(index\.html)?\?synced=/.test(k)), 'S35: on a slow connection the catch-up paints nothing until the canvas is back with the engagement (no picker, no empty SOW form)', JSON.stringify(paints));
    // 4. the old size-reset notice no longer contradicts a size the partner then picks on the canvas
    const z = await fresh(); await pick(z, 'cja', 150); await cont(z);
    await z.evaluate(() => { const s = JSON.parse(localStorage.getItem(KEY)); delete s.v14; s.size = 'large'; s.sizeManual = false; localStorage.setItem(KEY, JSON.stringify(s)); }); await live(z, {play: 'cja'});
    await goFront(z); await z.click('#size [data-size="small"]'); await z.waitForTimeout(200); await z.click('#save'); await z.waitForURL('**/sow/index.html#scope'); await z.waitForTimeout(250);
    const toastText = await z.evaluate(() => { const t = document.getElementById('toast'); return t ? t.textContent : ''; }), zSize = await z.evaluate(() => state.size); await z.context().close();
    ok(zSize === 'small' && !/size reset to Typical/.test(toastText), 'S35: after the catch-up, a size picked on the canvas is not followed by a notice that the size was reset to Typical', JSON.stringify({zSize, toastText}));
    // 5. the FSI note says when Implement Brand Concierge doesn't match the Brand Concierge answer
    const f = await fresh(); await pick(f, 'fsi', 150); await cont(f); await services(f); await f.click('.service-card[data-line="F02"] .remove-line'); await f.waitForTimeout(250);
    await f.click('[data-step="scope"]'); await f.waitForTimeout(250); const n1 = await f.textContent('#fsi-note');
    await f.selectOption('[data-meta="fsiState"]', 'healthy'); await f.waitForTimeout(250); await services(f); await addLib(f, 'F02'); await f.click('[data-step="scope"]'); await f.waitForTimeout(250); const n2 = await f.textContent('#fsi-note'); await f.context().close();
    ok(n1.includes('Implement Brand Concierge is off') && !n1.includes('(Implement Brand Concierge is on)') && n2.includes('Implement Brand Concierge is on, but'), 'S35: the FSI Scope note says when Implement Brand Concierge is off for a concierge not yet live, or on for a healthy one', JSON.stringify({n1, n2}));
    // 6. a 17-pixel scrollbar and the fallback font together: one row of four, never Print / PDF alone
    const b3 = await chromium.launch({ignoreDefaultArgs: ['--hide-scrollbars']}); const sc = await b3.newContext({viewport: {width: 1108, height: 900}}); const x = await sc.newPage(); x.on('pageerror', e => errs.push(e.message));
    await x.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort()); await x.addInitScript(() => document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = '::-webkit-scrollbar{width:17px;height:17px}::-webkit-scrollbar-thumb{background:#999}'; document.head.appendChild(s); }));
    await pick(x, 'cja', 150); await cont(x); await x.click('[data-step="document"]'); await x.waitForTimeout(300);
    const rowsAt = await x.$$eval('.document-actions .top-actions button', bs => { const m = new Map(); for (const bt of bs) { const t = Math.round(bt.getBoundingClientRect().top); m.set(t, (m.get(t) || 0) + 1); } return [...m.values()].join('+'); }); await b3.close();
    ok(rowsAt === '4', 'S35: with a 17-pixel scrollbar and the fallback font together, the four Statement of work buttons sit in one row at 1108 pixels', rowsAt);
    // 7. sow/?sync=build opened later, with the canvas already current, shows the SOW steps
    const w = await fresh(); await pick(w, 'cja', 150); await cont(w); try { await w.goto(BASE + 'sow/?sync=build'); } catch (e) {} await w.waitForTimeout(1200);
    const where = {path: new URL(w.url()).pathname, visible: await w.evaluate(() => getComputedStyle(document.documentElement).visibility === 'visible'), steps: !!(await w.$('#scope-panel'))}; await w.context().close();
    ok(where.path === '/sow/' && where.visible && where.steps, 'S35: an address like sow/?sync=build opened later, once the canvas is current, just shows the SOW steps', JSON.stringify(where));
  });

  // ---------- step 36: what a focused verification of step 35 confirmed (its merge undid saved work; the trip's edges) ----------
  await sec(async () => {
    const live = (p, c) => p.evaluate(v => localStorage.setItem('abv-sow-build-v1', JSON.stringify(v)), {on: [], ls: {}, rate: 150, size: 'typical', ...c});
    const goFront = async (p, url = BASE) => { try { await p.goto(url); } catch (e) {} await p.waitForTimeout(1500); await p.waitForSelector('#rate'); };
    const canvasBack = async (p, ms) => { const end = Date.now() + ms; while (Date.now() < end) { const done = await Promise.race([p.evaluate(() => /^\/(index\.html)?$/.test(location.pathname) && window.READY === true && !window.CATCHUP && getComputedStyle(document.documentElement).visibility === 'visible' && (JSON.parse(localStorage.getItem('abv-sow-build-v1') || '{}').v === 2)).catch(() => false), new Promise(r => setTimeout(() => r(false), 2000))]); if (done) return true; await p.waitForTimeout(250); } return false; };
    const ctxOf = async S => { const c = await b.newContext({viewport: {width: 1600, height: 950}, storageState: S}); const p = await c.newPage(); p.on('pageerror', e => errs.push(e.message)); return p; };
    const sowNow = p => p.evaluate(() => ({customer: state.customer, rate: state.rate, size: state.size, O02: state.estimates.cja.O02 ? state.estimates.cja.O02.on : null}));
    // 1. the saved engagement wins over an older canvas, whichever page opens first: later Services work, another customer's engagement, another play
    const a = await fresh(); await pick(a, 'cja', 150); await cont(a); await services(a); await a.fill('#service-rate', '190'); await a.dispatchEvent('#service-rate', 'change'); await a.click('#size-switch [data-size="small"]'); await a.waitForTimeout(250);
    await live(a, {play: 'cja', ls: {O02: false}, rate: 175, size: 'large'}); const SA = await a.context().storageState(); await a.context().close();
    const a1 = await ctxOf(SA); await goFront(a1); const f1 = {O02: await a1.evaluate(() => lineOn('O02')), size: await a1.evaluate(() => st.size), rate: await a1.inputValue('#rate')}; await cont(a1); const f2 = await sowNow(a1); await a1.context().close();
    const bb = await fresh(); await pick(bb, 'cja', 150); await cont(bb); await services(bb); await bb.fill('#service-rate', '160'); await bb.dispatchEvent('#service-rate', 'change'); await bb.click('#size-switch [data-size="small"]'); await bb.waitForTimeout(250);
    await bb.evaluate(() => { state.customer = 'Customer B Insurance'; save(); }); await live(bb, {play: 'cja', ls: {O02: false}, rate: 175, size: 'large'}); const SB = await bb.context().storageState();
    await live(bb, {play: 'commerce', ls: {L03: false}, rate: 210, size: 'large'}); const SC = await bb.context().storageState(); await bb.context().close();
    const b1 = await ctxOf(SB); await b1.goto(BASE + 'sow/'); await b1.waitForTimeout(600); const g1 = await sowNow(b1); await b1.context().close();
    const c1 = await ctxOf(SC); await c1.goto(BASE + 'sow/'); await c1.waitForTimeout(600); const h1 = await sowNow(c1); await c1.context().close();
    ok(f1.O02 && f1.size === 'small' && f1.rate === '190' && f2.O02 && f2.size === 'small' && f2.rate === 190 && g1.customer === 'Customer B Insurance' && g1.rate === 160 && g1.size === 'small' && g1.O02 && h1.rate === 160 && h1.size === 'small',
      'S36: the saved engagement wins over an older canvas from the live site, whichever page opens first: later Services work ($190, Small, a line back on), another customer\'s engagement and another play\'s canvas are never mixed in', JSON.stringify({f1, f2, g1, h1}));
    // the live-site engagement for the trip checks: CJA, $175 typed on Services, a line added there
    const m = await fresh(); await pick(m, 'cja', 150); await cont(m); await services(m); await m.fill('#service-rate', '175'); await m.dispatchEvent('#service-rate', 'change'); await m.waitForTimeout(250); await addLib(m, 'CANVAS-C05');
    const t175 = await toolTotal(m); await live(m, {play: 'cja'}); const SM = await m.context().storageState(); await m.context().close();
    // 2. Stop pressed on the way back: within 30 seconds the page loads again as working SOW steps
    const s1 = await ctxOf(SM); let held = false; const back = u => /^\/(index\.html)?$/.test(u.pathname) && /synced=/.test(u.search);
    await s1.route(back, () => { held = true; }); const cdp = await s1.context().newCDPSession(s1);
    try { await s1.goto(BASE, {waitUntil: 'commit'}); } catch (e) {} for (let i = 0; i < 40 && !held; i++) await s1.waitForTimeout(250); await s1.waitForTimeout(300); await cdp.send('Page.stopLoading'); await s1.unroute(back);
    await s1.waitForTimeout(33000); const alive = {held, path: new URL(s1.url()).pathname, visible: await s1.evaluate(() => getComputedStyle(document.documentElement).visibility === 'visible').catch(() => false)};
    await s1.click('[data-step="services"]', {timeout: 3000}).catch(() => {}); alive.step = await s1.evaluate(() => step).catch(() => '?'); alive.rate = await s1.evaluate(() => state.rate).catch(() => '?'); await s1.context().close();
    ok(alive.held && /^\/sow\/(index\.html)?$/.test(alive.path) && alive.visible && alive.step === 'services' && alive.rate === 175, 'S36: Stop pressed while the catch-up returns to the canvas: the page loads again as SOW steps that work, with the engagement kept', JSON.stringify(alive));
    // 3. a first byte slower than 20 seconds: the catch-up still finishes (the reload of a stopped trip runs once per tab)
    const s2 = await ctxOf(SM); let trips = 0; const slow = u => u.search.includes('sync=build');
    await s2.route(slow, async r => { trips++; await new Promise(res => setTimeout(res, 21000)); await r.continue().catch(() => {}); });
    try { await s2.goto(BASE); } catch (e) {} const done = await canvasBack(s2, 75000); const slowRate = done ? await s2.inputValue('#rate') : null; await s2.context().close();
    ok(done && trips <= 2 && slowRate === '175', `S36: with a first byte slower than 20 seconds the catch-up still finishes (${trips} trips), the engagement's rate kept`, JSON.stringify({done, trips, slowRate}));
    // 4. an address like /?synced=1 from the browser's history doesn't skip a catch-up the canvas still needs
    const s3 = await ctxOf(SM); await goFront(s3, BASE + '?synced=1'); const r3 = {rate: await s3.inputValue('#rate'), total: await canvasTotal(s3)}; await s3.context().close();
    ok(r3.rate === '175' && r3.total === t175, `S36: an old /?synced=1 address still runs the catch-up when the canvas needs it (${t175})`, JSON.stringify(r3));
    // 5. two tabs: a trip whose canvas the other tab already caught up still goes back to the canvas
    const s4 = await fresh(); await pick(s4, 'cja', 150); await cont(s4); try { await s4.goto(BASE + 'sow/?sync=build&t=' + Date.now()); } catch (e) {} const back4 = await canvasBack(s4, 8000); const p4 = new URL(s4.url()).pathname; await s4.context().close();
    ok(back4 && /^\/(index\.html)?$/.test(p4), 'S36: two tabs opening the front page together both end on the canvas (a trip whose canvas the other tab caught up still goes back)', JSON.stringify({back4, p4}));
    // 6. a browser that only used the live canvas (no engagement saved) keeps the rate typed there, whichever page opens first
    const o = await fresh(); await o.goto(BASE); await o.waitForTimeout(300); await live(o, {play: 'cja', ls: {O02: false}, rate: 210, size: 'large'}); const SO = await o.context().storageState(); await o.context().close();
    const o1 = await ctxOf(SO); await goFront(o1); const k1 = {rate: await o1.inputValue('#rate'), size: await o1.evaluate(() => st.size), O02: await o1.evaluate(() => lineOn('O02'))}; await o1.context().close();
    const o2 = await ctxOf(SO); await o2.goto(BASE + 'sow/'); await o2.waitForTimeout(600); const k2 = await o2.evaluate(() => ({rate: state.rate, size: state.size})); await o2.context().close();
    ok(k1.rate === '210' && k1.size === 'large' && !k1.O02 && k2.rate === 210 && k2.size === 'large', 'S36: a browser that only used the live canvas keeps the rate typed there ($210, not the old $150 default), whichever page opens first', JSON.stringify({k1, k2}));
  });

  // ---------- step 37: the Services CSV's total row follows the screens when every service is one-time ----------
  await sec(async () => {
    const totalRow = async (play, oneOnly) => { const p = await fresh(); await pick(p, play, 150); await cont(p); await p.evaluate(([t, o]) => { state.terms = t; if (o) for (const r of Object.values(state.estimates[state.play])) if (r.cadence === 'monthly') r.on = false; save(); render(); }, [TERMS, oneOnly]); const rows = parseCsv(await csvOf(p)); await p.context().close(); return rows.filter(r => r.length > 3).pop(); };
    const one = await totalRow('cja', true), mixed = await totalRow('cja', false);
    ok(one[2] === 'Illustrative total: one-time services only' && one[8] === '' && /implementation \+ 12-month term/.test(mixed[2]) && mixed[8] === '12', 'S37: the Services CSV total row says one-time services only (no months) when every service is one-time, and keeps the 12-month term otherwise', JSON.stringify({one: one.slice(2, 10), mixed: mixed.slice(2, 10)}));
  });

  // ---------- step 38: the CDN question on the AEM play, and one owner for each CDN task ----------
  await sec(async () => {
    const p = await fresh(); await pick(p, 'aem', 150); await cont(p);
    const deps = async () => { await p.click('[data-step="document"]'); await p.waitForTimeout(300); const t = await p.evaluate(() => { const s = [...document.querySelectorAll('#sow-preview li')].map(x => x.textContent); return s.join(' | '); }); await p.click('[data-step="scope"]'); await p.waitForTimeout(200); return t; };
    const shown = await p.isVisible('#cdn-context'), def = await p.inputValue('[data-meta="cdnRoute"]'), d0 = await deps();
    await p.selectOption('[data-meta="cdnRoute"]', 'own'); await p.waitForTimeout(200); const nOwn = await p.textContent('#cdn-note'), dOwn = await deps();
    await p.selectOption('[data-meta="cdnRoute"]', 'managed'); await p.waitForTimeout(200); const nMan = await p.textContent('#cdn-note'), dMan = await deps(), total = await toolTotal(p);
    await p.reload(); await p.waitForTimeout(500); const kept = await p.evaluate(() => state.cdnRoute); await p.context().close();
    const q = await fresh(); await pick(q, 'cja', 150); await cont(q); const cjaShown = await q.isVisible('#cdn-context'); await q.click('[data-step="document"]'); await q.waitForTimeout(300);
    const dCja = await q.evaluate(() => [...document.querySelectorAll('#sow-preview li')].map(x => x.textContent).join(' | ')); await q.context().close();
    ok(shown && def === 'unknown' && /Until discovery confirms/.test(d0) && /CDN team/.test(nOwn) && /^Customer CDN\./m.test(dOwn.split(' | ').find(x => x.startsWith('Customer CDN')) || '') && !/CDN log forwarding is set up by/.test(dOwn)
       && /one switch/.test(nMan) && /Adobe's managed CDN serves the site/.test(dMan) && kept === 'managed' && total === '$484,800' && !cjaShown && /CDN log forwarding is set up by the customer's IT team/.test(dCja),
      'S38: the AEM play asks which CDN serves the site; its note and the SOW\'s dependencies follow the answer (customer CDN until confirmed), the answer is saved, the starting total is unchanged, and other plays are unchanged', JSON.stringify({shown, def, kept, total, cjaShown, d0: d0.slice(0, 200), dMan: dMan.slice(0, 160)}));
    const w = await fresh(); await pick(w, 'cja', 150); await cont(w);
    const txt = await w.evaluate(() => { const C = id => CATALOG.find(c => c.id === id); return {l02: C('L02').scope, ox1: C('OX1').acceptance, ox1s: C('OX1').scope, a01: C('A01').assumptions, old: PRIOR38.L02.scope[0]}; });
    const d = JSON.parse(await draftOf(w)); d.estimates.cja.L02.scope = txt.old; d.estimates.cja.L02.scopeChanged = false; await openDraft(w, d, 's38.json');
    const r = await w.evaluate(() => ({scope: state.estimates.cja.L02.scope, flagged: state.estimates.cja.L02.scopeChanged})); await w.context().close();
    ok(/register CDN log forwarding in Brand Visibility/.test(txt.l02) && /job is active/.test(txt.ox1) && !/CDN Configuration page/.test(txt.ox1s) && /AdobeEdgeOptimize\/1\.0/.test(txt.a01) && r.scope === txt.l02 && !r.flagged,
      'S38: one owner per CDN task: Brand Visibility setup registers log forwarding and confirms the logs; the partner\'s log service is only the CDN job; the Edge Delivery build turns on routing and allows Adobe\'s edge user agent; earlier wording takes the new wording unflagged', JSON.stringify(r));
  });

  // ---------- step 39: links name the page file, so a host that serves exact file names only (Adobe Proto) works; Continue ----------
  await sec(async () => {
    // a server like Proto's: a folder address is "object not found", only exact files are served, under a prefix
    const proto = http.createServer((req, res) => { const u = decodeURIComponent(req.url.split('?')[0].split('#')[0]); const m = /^\/abc123\/v1\/(.+)$/.exec(u); const f = m && path.join(SITE, m[1]);
      if (!f || !f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404, {'Content-Type': 'application/json'}); res.end(JSON.stringify({error: 'object not found: abc123/v1' + (m ? '/' + m[1] : u)})); return; }
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); fs.createReadStream(f).pipe(res); });
    await new Promise(r => proto.listen(0, r)); const PB = `http://localhost:${proto.address().port}/abc123/v1/`;
    const p = await fresh(); await p.goto(PB + 'index.html'); await p.waitForTimeout(400); await p.click('#picker [data-play="cja"]'); await p.waitForTimeout(400); await p.fill('#rate', '200');
    const label = (await p.textContent('#save')).trim(); await p.click('#save'); await p.waitForTimeout(900);
    const sow = {url: p.url().replace(PB, ''), steps: await p.isVisible('#scope-panel').catch(() => false), rate: await p.evaluate(() => typeof state !== 'undefined' ? state.rate : null).catch(() => null)};
    await p.click('.steps [data-build]').catch(() => {}); await p.waitForTimeout(900);
    const back = {url: p.url().replace(PB, ''), canvas: await p.isVisible('#rate').catch(() => false), rate: await p.inputValue('#rate').catch(() => null)};
    await p.context().close(); proto.close();
    ok(/^Continue/.test(label) && /^sow\/index\.html#scope$/.test(sow.url) && sow.steps && sow.rate === 200 && /^index\.html/.test(back.url) && back.canvas && back.rate === '200',
      'S39: on a host that serves exact file names only (as Adobe Proto does), Continue opens the SOW steps and Build comes back to the canvas, with the rate kept', JSON.stringify({label, sow, back}));
  });

  ok(!errs.length, 'no script errors', errs.join(' | '));
  await b.close(); server.close();
  console.log(fails ? `${fails} NOV 2 REVIEW CHECKS FAILED` : 'ALL NOV 2 REVIEW CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
