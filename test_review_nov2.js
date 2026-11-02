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
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); return p; };
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
    ok(f.scope.includes('two separately agreed, supported handoff routes') && f.deliverable.includes('both handoff routes') && f.acceptance.includes('both handoff routes') && !f.scope.includes('one supported handoff'),
      'B06: F02 Large: scope, deliverable and acceptance all say two handoff routes', f.scope.slice(0, 120));
    ok(htm.includes('two separately agreed, supported handoff routes') && !htm.includes('set up one supported handoff'), 'B06: and so does the downloaded SOW');
    for (const band of ['small', 'typical']) {
      await p.selectOption('.service-card[data-line="F02"] [data-line-field="band"]', band); await p.waitForTimeout(150);
      const g = await p.evaluate(() => state.estimates.fsi.F02);
      ok(g.scope.includes('one supported handoff') && !g.acceptance.includes('both handoff'), `B06: F02 ${band}: one handoff route throughout`);
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
    ok(aem.includes('Core Web Vitals fixes are prepared as code patches') && aem.includes('reviews, tests, merges and releases') && aem.includes('Early Access') && aem.includes('at least 1,000 page views') && !aem.includes('Adobe documents no direct publishing link'),
      'C01/C03: the AEM SOW names the content and code routes, the developer, Early Access and the 1,000 page views, and no longer rules out a Brand Visibility to AEM route');
    ok(aem.includes('Last-Modified') && aem.includes('Using the agreed Optimize at Edge route'), 'L03: the pilot checks Last-Modified and deploys on the agreed edge route');
    await p.context().close();
    const q = await fresh(); await pick(q, 'cja', 150); await cont(q);
    await q.evaluate(t => { state.terms = t; save(); }, TERMS); await services(q);
    const cja = await htmlOf(q);
    ok(cja.includes('Audience Publishing') && cja.includes('Manage Profiles') && cja.includes('Person ID') && cja.includes('does not replace publishing to Real-Time Customer Profile') && !cja.includes('or another supported destination'),
      'C02: the CJA SOW requires Real-Time Customer Profile, the permissions and the Person ID');
    const f = await q.evaluate(() => { const s = CATALOG.find(x => x.id === 'F02'); return [s.source, s.source2, s.assumptions]; });
    ok(f[0].includes('pre-go-live') && f[1].includes('sales-handoff') && f[2].includes("don't need Marketo Engage"), 'F02: cites the pre-go-live checklist and the live chat and meeting booking page; plain chat and meetings need no Marketo Engage');
    await q.context().close();
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

  ok(!errs.length, 'no script errors', errs.join(' | '));
  await b.close(); server.close();
  console.log(fails ? `${fails} NOV 2 REVIEW CHECKS FAILED` : 'ALL NOV 2 REVIEW CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
