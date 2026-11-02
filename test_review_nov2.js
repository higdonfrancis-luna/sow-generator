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
  const cont = async p => { await p.click('#save'); await p.waitForURL('**/sow/#scope'); await p.waitForTimeout(400); };
  const services = async p => { await p.click('[data-step="services"]'); await p.waitForTimeout(300); };
  const build = async p => { await p.click('.steps [data-build]'); await p.waitForURL(BASE); await p.waitForTimeout(450); };
  const addLib = async (p, id) => { await p.click('#add-service'); await p.waitForTimeout(150); await p.click(`#available-services [data-add="${id}"]`); await p.waitForTimeout(150); await p.click('#close-modal'); await p.waitForTimeout(150); };
  const download = async (p, click) => { const [d] = await Promise.all([p.waitForEvent('download'), click()]); return fs.readFileSync(await d.path(), 'utf8'); };
  const csvOf = async p => download(p, async () => { if (!(await p.$eval('.top-actions details.more', d => d.open))) await p.click('.top-actions details.more summary'); await p.click('#export-csv'); });
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
    const csv = parseCsv(await download(p, async () => { await p.evaluate(() => { const r = state.estimates.coworker.CW01; r.hoursWhy = 'Two workflow briefs were contracted in the earlier version.'; r.scope = r.scope.split('\nImported quantity')[0] + ' Two teams, each with two workflows.'; save(); }); await p.click('.top-actions details.more summary'); await p.click('#export-csv'); }));
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
    await a.click('#save'); await a.waitForURL('**/sow/#scope'); await a.waitForTimeout(400); await a.click('.steps [data-build]'); await a.waitForURL(BASE); await a.waitForTimeout(400);
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
    await a.click('#save'); await a.waitForURL('**/sow/#scope'); await a.waitForTimeout(400); await a.fill('[data-meta="customer"]', 'Acme Corp'); await a.waitForTimeout(150);
    await a.click('.steps [data-build]'); await a.waitForURL(BASE); await a.waitForTimeout(400);
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
    // each visible line: does the name take the full row, do the hours sit under it, or beside it (the desktop row)
    const layout = p => p.$$eval('#card .ln', ls => ls.filter(l => l.getClientRects().length).map(l => { const r = l.getBoundingClientRect(), n = l.querySelector('.nm').getBoundingClientRect(), h = l.querySelector('.hr').getBoundingClientRect(), a = l.querySelector('.tg,.addb'), x = a ? a.getBoundingClientRect() : null;
      return {id: l.dataset.l, full: n.width >= r.width - 2, under: h.top >= n.bottom - 1, side: h.left >= n.right - 1, inside: !x || (x.right <= r.right + 1 && x.left >= r.left - 1)}; }));
    const open = async (p, id) => { await p.evaluate(i => document.querySelector(`.node[data-p="${i}"]`).click(), id); await p.waitForTimeout(400); };
    const ctx = await b.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true}); const m = await ctx.newPage(); m.on('pageerror', e => errs.push(e.message));
    await pick(m, 'aem', 150); await cont(m);
    await m.fill('[data-cover="promptCount"]', '2000'); await m.press('[data-cover="promptCount"]', 'Tab'); await m.waitForTimeout(200);
    await services(m); await m.fill('.service-card[data-line="O02"] [data-line-field="hours"]', '72'); await m.press('.service-card[data-line="O02"] [data-line-field="hours"]', 'Tab'); await m.waitForTimeout(200);
    await build(m); await open(m, 'bv');
    const L = await layout(m);
    ok(L.length >= 4 && L.every(x => x.full && x.under && x.inside), 'S25: on a 390-pixel phone each line\'s name and note take the full row, with hours, fee and X beneath', JSON.stringify(L));
    const notes = await m.$$eval('#card .ln .svc', e => e.map(x => [x.textContent, Math.round(x.getBoundingClientRect().height)]));
    ok(notes.length >= 2 && notes.some(n => n[0].includes('prompt count')) && notes.some(n => n[0].includes('Services step')) && notes.every(n => n[1] <= 21), 'S25: "Set by the prompt count on the Scope step" and "Set on the Services step" each fit one line on the phone', JSON.stringify(notes));
    ok(await m.evaluate(() => document.documentElement.scrollWidth) <= 390, 'S25: Build with a card open fits a 390-pixel phone without scrolling sideways');
    await m.click('#card .ln[data-l="O01"] .tg'); await m.waitForTimeout(250);
    const off = await m.$eval('#card .ln[data-l="O01"]', l => l.classList.contains('off'));
    await m.click('#card .ln[data-l="O01"] .tg'); await m.waitForTimeout(250);
    ok(off && !(await m.$eval('#card .ln[data-l="O01"]', l => l.classList.contains('off'))), 'S25: on the phone the X beneath a line removes that line, and its check adds it back');
    await ctx.close();
    // Create your own play: a line waiting for a product keeps its Add button beneath its name, inside the card
    const c = await b.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true}); const q = await c.newPage(); q.on('pageerror', e => errs.push(e.message));
    await q.goto(BASE); await q.waitForTimeout(300); await q.click('#picker [data-play="custom"]'); await q.waitForTimeout(400);
    // Target and CJA: the connection's CJA audiences for Target wait for Real-Time CDP or Journey Optimizer (two Add buttons)
    for (const id of ['target', 'cja']) { if (await q.isHidden('#add-menu')) await q.click('#add-btn');
      if (await q.$(`#add-menu details.nocon [data-add="${id}"]`) && !(await q.$eval('#add-menu details.nocon', d => d.open))) await q.click('#add-menu details.nocon summary');
      await q.click(`#add-menu [data-add="${id}"]`); await q.waitForTimeout(300); }
    await q.fill('#rate', '150'); await q.waitForTimeout(100);
    await q.evaluate(() => document.querySelector('.ib[data-c="target-cja"]').click()); await q.waitForTimeout(400);
    for (const d of await q.$$('#card details:not([open]) > summary')) await d.click();
    const locks = await q.$$eval('#card .ln.lock', ls => ls.filter(l => l.getClientRects().length).length);
    const lockRows = await q.$$eval('#card .ln.lock', ls => ls.filter(l => l.getClientRects().length).map(l => { const r = l.getBoundingClientRect(), n = l.querySelector('.nm').getBoundingClientRect(), a = l.querySelector('.addb'), x = a ? a.getBoundingClientRect() : null; return {id: l.dataset.l, full: n.width >= r.width - 2, below: !!x && x.top >= n.bottom - 1, inside: !!x && x.right <= r.right + 1}; }));
    ok(locks > 0 && lockRows.every(x => x.full && x.below && x.inside), 'S25: on Create your own play, a line waiting for a product shows its name across the row and its Add button beneath, inside the card', JSON.stringify(lockRows));
    await c.close();
    // desktop and the edge of the breakpoint: name, hours, fee and X stay on one row, as before
    for (const w of [1600, 601]) {
      const d = await fresh(); await d.setViewportSize({width: w, height: 950}); await pick(d, 'aem', 150); await open(d, 'bv');
      const D = await layout(d);
      ok(D.length >= 4 && D.every(x => x.side && !x.full), `S25: at ${w} pixels each line keeps name, hours, fee and X on one row (unchanged)`, JSON.stringify(D));
      await d.context().close();
    }
  });

  ok(!errs.length, 'no script errors', errs.join(' | '));
  await b.close(); server.close();
  console.log(fails ? `${fails} NOV 2 REVIEW CHECKS FAILED` : 'ALL NOV 2 REVIEW CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
