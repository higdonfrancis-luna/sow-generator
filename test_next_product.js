// Next best product (Nov 18 2026). Adam: "My boss wants to know with the ready-made plays [the] next best product opportunities, same thing
// with building your own play ... so both places", and on the play's name: "I guess it would keep its name if they add other products".
// A ready-made play holds added products and keeps its name; the goal is asked once for each canvas; the Add product list is ranked for it,
// with a number worked out from the summary counts in canvas/next_product_counts.json exactly as its own lines print it.
// Run from the repo root after python3 canvas/build.py and python3 build_site.py:
//   node test_next_product.js
// The checks that need known numbers swap the page's table for a FIXTURE OF MADE-UP SAMPLE NUMBERS (sampleTable below, the method page's
// own sample). No count from customer data is written in this file; the real table is checked by redoing the method here in its own lines.
const path = require('path'), fs = require('fs'), os = require('os');
const {execFileSync} = require('child_process');
const {chromium} = require('playwright');
const ROOT = __dirname, ORIGIN = 'https://next-product.test/';
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 600) + ']')); if (!c) fails++; };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const PAGE = read('site/index.html'), REAL = JSON.parse(read('canvas/next_product_counts.json'));
const CAT = JSON.parse(read('canvas/catalog.json')), PROBLEMS = JSON.parse(read('canvas/problems.json')).problems;
const OUTSIDE = new Set(CAT.products.filter(p => p.outside).map(p => p.id)), ADOBE = CAT.products.filter(p => !p.outside).map(p => p.id);
const NAME = Object.fromEntries(CAT.products.map(p => [p.id, p.name])), PLAY = Object.fromEntries(CAT.plays.map(p => [p.id, p]));
const READY = ['cja', 'commerce', 'aem', 'fsi', 'abv', 'coworker'];
const FITS = ['Solves the goal', 'Builds on the goal', 'Connects to the goal', 'Not tied to this goal'];
const DEF = 'The goal sets the order. The number is the share of similar customers who also own the product. It is a guide, not a forecast. ';

// ---- SAMPLE NUMBERS, made up for these checks: 3,000 pretend customers, numbered 0 to 2,999, each product owned by the spans listed.
// They give the method page's sample: Customer Journey Analytics 673; Target 1,001, and 305 of the 673; Coworker 120 and 40; Brand Visibility 95
// and 25 (so Brand Visibility + Customer Journey Analytics is not a set); Adobe Analytics + Customer Journey Analytics 539, with Target 256 and
// Brand Visibility 19; AEM Sites 352, Journey Optimizer 210 and Adobe Commerce 81 of the 673.
const SAMPLE_OWNS = {cja: [[0, 673]], aa: [[0, 539], [1400, 1800]], target: [[0, 256], [539, 588], [673, 1369]], bv: [[256, 275], [600, 606], [2100, 2170]],
  cw: [[300, 340], [2000, 2080]], aemsites: [[100, 452], [1000, 1548]], ajo: [[400, 610], [1300, 1490]], commerce: [[550, 631], [2200, 2819]]};
function sampleTable(minNumber, round = 1) {
  const who = {}; for (const [id, spans] of Object.entries(SAMPLE_OWNS)) { who[id] = new Set(); for (const [a, b] of spans) for (let i = a; i < b; i++) who[id].add(i); }
  const all = new Set(Array.from({length: 3000}, (x, i) => i)), ids = Object.keys(who).sort(), both = (s, id) => new Set([...s].filter(i => who[id].has(i)));
  const products = ids.filter(id => who[id].size >= 30), numbered = products.filter(id => who[id].size >= minNumber), sets = {};
  const grow = (key, members, from) => { sets[key] = [members.size, ...numbered.map(id => both(members, id).size)].map(v => v - v % round);
    products.forEach((id, i) => { if (i < from) return; const next = both(members, id); if (next.size >= 30) grow(key ? key + '+' + id : id, next, i + 1); }); };
  grow('', all, 0);
  return {v: 1, round, min_group: 30, pretend: 10, min_number: minNumber, products, numbered, few: ids.filter(id => who[id].size > 0 && who[id].size < 30), sets};
}
const FIX_A = sampleTable(90), FIX_B = sampleTable(150), FIX_B10 = sampleTable(150, 10);

// ---- the method, redone here in its own few lines (the brief's page, steps 3 to 5): the group that counts, and a product's number in whole
// ten-thousandths, a half rounded up
const dataId = id => id === 'eds' ? 'aemsites' : id;
function redo(T, canvas, goalId) {
  const g = PROBLEMS.find(q => q.id === goalId), own = new Set([...g.products, ...g.refine.flatMap(r => r.add)].filter(id => !OUTSIDE.has(id)).map(dataId));
  const ids = [...new Set(canvas.filter(id => !OUTSIDE.has(id)).map(dataId))], known = ids.filter(id => T.products.includes(id) || T.few.includes(id));
  const size = id => T.products.includes(id) ? T.sets[id][0] : -1, key = a => [...a].sort().join('+');
  const kept = known.slice().sort((a, b) => (own.has(a) ? 1 : 0) - (own.has(b) ? 1 : 0) || size(a) - size(b) || (a < b ? -1 : 1)), aside = [];
  while (!T.sets[key(kept)]) aside.push(kept.shift());
  const group = T.sets[key(kept)][0];
  return {kept, aside, left: ids.filter(id => !known.includes(id)), n: group, rough: aside.length > 0 || (kept.length > 0 && group < T.min_number),
    number(x) { const c = T.numbered.indexOf(dataId(x)); if (c < 0) return null; let t = null, row;
      for (let i = kept.length; i >= 0; i--) { row = T.sets[key(kept.slice(i))]; t = t === null ? Math.floor(row[c + 1] * 10000 / row[0] + 0.5) : Math.floor((row[c + 1] * 10000 + T.pretend * t) / (row[0] + T.pretend) + 0.5); }
      return {t, k: row[c + 1], n: row[0]}; }};
}
const shownAs = t => { const h = Math.floor((t + 50) / 100); return h === 0 ? 'under .01' : h === 100 ? '1.00' : '.' + String(h).padStart(2, '0'); };
const num = v => v.toLocaleString('en-US');
// a printed line of arithmetic, redone: "1,001 ÷ 3,000 = 0.3337" and "(305 + 10 × 0.3337) ÷ (673 + 10) = 0.4514"
function redoLine(line) { const v = s => Number(s.replace(/,/g, ''));
  let m = line.match(/\(([\d,]+) \+ (\d+) × (\d\.\d{4})\) ÷ \(([\d,]+) \+ (\d+)\) = (\d\.\d{4})$/);
  if (m) return m[2] === m[5] && Math.floor((v(m[1]) * 10000 + v(m[2]) * Math.round(v(m[3]) * 10000)) / (v(m[4]) + v(m[5])) + 0.5) === Math.round(v(m[6]) * 10000);
  m = line.match(/: .* ([\d,]+) ÷ ([\d,]+) = (\d\.\d{4})$/);
  return !!m && Math.floor(v(m[1]) * 10000 / v(m[2]) + 0.5) === Math.round(v(m[3]) * 10000); }

(async () => {
  const b = await chromium.launch(), errs = [], tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'next-product-'));
  // the built site on a made-up address, so Build and the SOW steps share one browser storage; opts.table swaps the page's table for a fixture
  const context = async (opts = {}) => { const ctx = await b.newContext({viewport: {width: opts.w || 1440, height: opts.h || 900}, acceptDownloads: true});
    await ctx.route(ORIGIN + '**', async r => { let u = decodeURIComponent(new URL(r.request().url()).pathname); if (u.endsWith('/')) u += 'index.html';
      if (u === '/index.html' && opts.table) return r.fulfill({contentType: 'text/html; charset=utf-8', body: PAGE.replace(/const NEXT=\{[^;]*\};/, () => 'const NEXT=' + JSON.stringify(opts.table) + ';')});
      const f = path.join(ROOT, 'site', u); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return r.fulfill({status: 404, body: ''}); await r.fulfill({path: f}); });
    return ctx; };
  const page = async ctx => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); });
    await p.goto(ORIGIN + 'index.html'); await p.waitForFunction('window.READY===true'); return p; };
  const open = async opts => page(await context(opts));
  const pick = async (p, play, rate = '200') => { await p.click(`#picker [data-play="${play}"]`); await p.waitForTimeout(400); if (rate) { await p.fill('#rate', rate); await p.waitForTimeout(150); } };
  const menu = async p => { if (await p.isHidden('#add-menu')) { await p.click('#add-btn'); await p.waitForTimeout(250); } };
  const shut = async p => { await p.keyboard.press('Escape'); await p.waitForTimeout(100); };
  // the goal, picked in the menu (its chip is under See all when it is neither the play's own nor a common problem)
  const goal = async (p, id) => { await menu(p); if (await p.$('#add-menu [data-goal-ask]')) { await p.click('#add-menu [data-goal-ask]'); await p.waitForTimeout(150); }
    if (!(await p.$(`#add-menu [data-goal="${id}"]`))) { await p.click('#add-menu [data-goal-all="1"]'); await p.waitForTimeout(150); }
    await p.click(`#add-menu [data-goal="${id}"]`); await p.waitForTimeout(250); };
  const ownGoal = play => PROBLEMS.find(q => q.play === play).id;
  const add = async (p, id) => { await menu(p); await p.evaluate(id => document.querySelector(`#add-menu [data-add="${id}"]`).click(), id); await p.waitForTimeout(350); };
  const toSow = async (p, tab = 'services') => { await Promise.all([p.waitForURL(/\/sow\/index\.html/), p.click(`.tabs [data-tab="${tab}"]`)]); await p.waitForTimeout(800); };
  const toBuild = async p => { await Promise.all([p.waitForURL(u => !/\/sow\//.test(String(u))), p.click('.steps [data-build]')]); await p.waitForFunction('window.READY===true'); await p.waitForTimeout(400); };
  const canvas = p => p.evaluate(() => ({play: st.play, on: st.on.slice(), goal: st.goal || '', label: document.getElementById('play-label').textContent, boxes: prods().map(q => q.id), at: displayProducts().map(q => q.id + ':' + pos(q.id).join()).join(' '),
    lines: [...prods(), ...conns()].flatMap(o => all(o)).filter(counted).sort().join(), n: totals().n + totals().x, extra: totals().x, total: totals().yr, out: !document.getElementById('outwrap').hidden}));
  const handover = p => p.evaluate(() => { publish(true); const h = JSON.parse(localStorage.getItem(HANDOFF)); delete h.at; return h; });
  const sow = p => p.evaluate(() => ({play: state.play, label: document.getElementById('play-title').textContent, title: docTitle(), objective: brief().objective === PLAYS[state.play].objective, added: state.added || null, goal: state.goal || '',
    on: selectedLines().map(l => l.id).sort().join(), n: selectedLines().length, total: totals().totalFee}));
  // what the open menu shows: the rows in order, each with its heading or fold, and the products held back
  const list = p => p.evaluate(() => { const m = document.getElementById('add-menu'), rows = [], held = [], folds = []; let head = '';
    const row = (x, fold) => { const a = x.querySelector('.rk-add'), nm = x.querySelector('.rk-nm'); rows.push({id: a.dataset.add || 'eds', rank: Number(x.querySelector('.rk-n').textContent), name: nm.firstChild.textContent, next: !!x.querySelector('.rk-next'),
      num: (x.querySelector('.rk-num') || {}).textContent || '', none: (x.querySelector('.rk-none') || {}).textContent || '', why: x.querySelector('.rk-why').textContent, cnt: x.querySelector('.rk-cnt').textContent, head: fold ? '' : head, fold: fold || '',
      adds: [...x.querySelectorAll('[data-add]')].map(q => q.dataset.add).join(), calc: [...x.querySelectorAll('.rk-calc p')].map(q => q.textContent)}); };
    for (const x of (document.getElementById('add-list') || {children: []}).children) {
      if (x.matches('.g')) head = x.textContent; else if (x.matches('.rk-row')) row(x);
      else if (x.matches('details.mgrp')) { const nm = x.querySelector('summary span').textContent; folds.push({name: nm, count: x.querySelector('.cnt').textContent, open: x.open, rows: x.querySelectorAll('.rk-row').length}); x.querySelectorAll('.rk-row').forEach(y => row(y, nm)); }
      else if (x.matches('.it2')) held.push({id: x.dataset.add, head, tag: (x.querySelector('.ctag') || {}).textContent || '', to: (x.querySelector('.to') || {}).textContent || ''}); }
    const txt = s => (m.querySelector(s) || {}).textContent || '';
    return {view: addView(), k: txt('.k'), top: txt('.hd p'), goal: txt('.rk-goal span'), def: txt('.rk-def'), rows, held, folds, role: m.getAttribute('role'), label: m.getAttribute('aria-label') || '', wide: m.classList.contains('rk'), text: m.innerText,
      heads: [...m.querySelectorAll('#add-list > .g')].map(x => x.textContent), strip: txt('.rk-strip'), allb: txt('.rk-allb')}; });
  const tierOf = r => r.fold === FITS[3] ? 3 : r.fold ? 2 : FITS.indexOf(r.head);
  const checker = table => { const f = path.join(tmp, 'table.json'); fs.writeFileSync(f, JSON.stringify(table));
    try { execFileSync('python3', ['-c', "import json,sys\nsys.path.insert(0,'canvas')\nfrom next_product_check import check, adobe_ids_of\ncheck(json.load(open(sys.argv[1])), adobe_ids_of(json.load(open('canvas/catalog.json'))))", f], {cwd: ROOT, stdio: 'pipe'}); return ''; } catch (e) { return String(e.stderr || e.message).trim().split('\n').pop(); } };

  // ============ 1. a play nobody added to is as it was ============
  const TITLES = {cja: 'Services for Brand Visibility and Customer Journey Analytics', commerce: 'Services for Brand Visibility and Adobe Commerce', aem: 'Services for Brand Visibility, Sites Optimizer and AEM Sites with Edge Delivery Services',
    fsi: 'Services for Brand Visibility and Brand Concierge', abv: 'Services for Brand Visibility', coworker: 'Services for Adobe CX Enterprise Coworker'};
  const untouched = {};
  for (const play of READY) {
    const ctx = await context(), p = await page(ctx); await pick(p, play);
    const c = await canvas(p), h = await handover(p), record = await p.evaluate(() => localStorage.getItem(KEY));
    const own = PLAY[play].products.every(id => same(c.at.split(' ').find(x => x.startsWith(id + ':')), id + ':' + PLAY[play].pos[id].join()));
    ok(!c.on.length && !c.goal && own && !('added' in h) && !('addedNames' in h) && !('goal' in h) && !/"goal"|"added"/.test(record),
      `1. ${PLAY[play].label}, as picked: nothing added, no goal, each box at the play's own place, and the hand-over and the saved canvas name no added product and no goal`, JSON.stringify({on: c.on, goal: c.goal, at: c.at, keys: Object.keys(h)}));
    await toSow(p); const s = await sow(p), engagement = await p.evaluate(() => localStorage.getItem(KEY));
    ok(s.title === TITLES[play] && s.objective && s.added === null && !s.goal && s.n === c.n && s.total === c.total && !/"goal"|"added"/.test(engagement),
      `1. ${PLAY[play].label}: the statement of work is titled "${TITLES[play]}", Services shows the canvas's services and total, and the saved engagement holds no added product and no goal`, JSON.stringify(s).slice(0, 300) + ' canvas ' + c.n + ' ' + c.total);
    untouched[play] = {c, s, record, engagement, handoff: await p.evaluate(() => localStorage.getItem('abv-sow-handoff'))};
    // the canvas record the Services step writes back: a service that waits for an outside system is no longer marked on there (nothing reads the mark for it)
    const mark = await p.evaluate(() => { const e = JSON.parse(localStorage.getItem('abv-sow-build-v1')).eff.plays[state.play], on = Object.keys(e).filter(k => e[k].o), ticked = selectedLines().map(l => baseId(l));
      const waiting = state.canvas.filter(x => x.locked && x.plays.includes(state.play)).map(x => baseId(x)), est = state.estimates[state.play];
      return {on: on.length, missing: ticked.filter(id => !on.includes(id)), waiting: waiting.length, waitingOn: waiting.filter(id => on.includes(id)), other: on.filter(id => !ticked.includes(id) && !(est[id] && est[id].on && !outsideOk(catalog().find(x => x.id === id))))}; });
    ok(mark.on > 0 && !mark.missing.length && !mark.waitingOn.length && !mark.other.length && mark.waiting === (play === 'commerce' ? 9 : 0),   // Nov 18 2026: every system a play offers starts on its canvas, so none waits; Nov 19 2026: on the Commerce play the nine services Cloud Service leaves out (Live Search setup, B2B setup, monthly maintenance, on-premises hosting and the five for the move to Cloud Service) wait, unmarked
      `1. ${PLAY[play].label}: the saved canvas marks as on every service the Services step shows ticked, and beyond those only the play's own services that are on for an outside system off the canvas; no waiting service is marked`, JSON.stringify(mark));
    await ctx.close();
  }
  { // a saved canvas written by hand that lists the play's own product as added (no button can produce it): the play's own product is not an added one
    const ctx = await context(), p0 = await ctx.newPage(); await p0.goto(ORIGIN + 'robots.txt'); await p0.evaluate(() => localStorage.setItem('abv-sow-build-v1', JSON.stringify({play: 'cja', on: ['bv', 'target'], v: 2}))); await p0.close();
    const p = await page(ctx), c = await canvas(p), h = await handover(p);
    ok(same(c.on, ['target']) && same(c.boxes.slice().sort(), ['bv', 'cja', 'target']) && same(h.added, ['target']) && same(h.addedNames, ['Target']),
      '1. a saved canvas that lists Brand Visibility as added to Brand Visibility + Customer Journey Analytics opens with Target as the only added product, on the canvas and in the hand-over', JSON.stringify({on: c.on, boxes: c.boxes, added: h.added, names: h.addedNames}));
    await ctx.close(); }
  { // a canvas record and an engagement as saved before this change (no goal, nothing added: the shapes above), written into a clean browser by hand
    const u = untouched.cja, ctx = await context(), p0 = await ctx.newPage(); await p0.goto(ORIGIN + 'robots.txt');
    await p0.evaluate(([c, e, h]) => { localStorage.setItem('abv-sow-build-v1', c); localStorage.setItem('partner-sow-studio-v6', e); localStorage.setItem('abv-sow-handoff', h); }, [u.record, u.engagement, u.handoff]); await p0.close();
    const p = await page(ctx), c = await canvas(p), h = await handover(p); await toSow(p); const s = await sow(p);
    ok(same([c.boxes, c.at, c.lines, c.n, c.total, c.on, c.goal], [u.c.boxes, u.c.at, u.c.lines, u.c.n, u.c.total, [], '']) && !('added' in h) && !('goal' in h) && same([s.on, s.total, s.title], [u.s.on, u.s.total, u.s.title]),
      '1. a canvas and an engagement saved before this change open with the same boxes, places, services, total and hand-over', JSON.stringify({c, s}).slice(0, 400));
    await ctx.close();
    // and a canvas record written by hand in the oldest shape still in use: a play, a service taken out, nothing else new
    const ctx2 = await context(), q0 = await ctx2.newPage(); await q0.goto(ORIGIN + 'robots.txt');
    const want = {...untouched.abv.c, boxes: ['bv', 'cdn'], at: 'bv:0,0 cdn:0,1', lines: untouched.abv.c.lines.split(',').filter(l => l !== 'SD1').join()}, off = want.lines.split(',')[0];   // Nov 18 2026: saved with the CDN only, before Search data started on the canvas too
    await q0.evaluate(off => localStorage.setItem('abv-sow-build-v1', JSON.stringify({combinedDefaultsVersion: 1, selectionVersion: 1, play: 'abv', on: [], out: ['cdn'], ls: {[off]: false}, keep: {}, rate: 200, size: 'typical', months: 12, v: 2, eff: null, fresh: false, cur: 'USD', def: null})), off); await q0.close();
    const q = await page(ctx2), c2 = await canvas(q);
    ok(c2.play === 'abv' && same(c2.boxes, want.boxes) && c2.at === want.at && !c2.on.length && !c2.goal && c2.lines === want.lines.split(',').filter(l => l !== off).join(), '1. a hand-written canvas record from before this change opens the Adobe Brand Visibility play as saved, with its one service still taken out', JSON.stringify(c2).slice(0, 300));
    await ctx2.close();
  }

  // ============ 2. a product added to a ready-made play: the play keeps its name ============
  const CASES = [['cja', ['target'], 'Services for Brand Visibility, Customer Journey Analytics and Target'], ['coworker', ['bv', 'cja'], 'Services for Adobe CX Enterprise Coworker, Brand Visibility and Customer Journey Analytics'],
    ['aem', ['target'], 'Services for Brand Visibility, Sites Optimizer, AEM Sites with Edge Delivery Services and Target'], ['abv', ['eds'], 'Services for Brand Visibility and AEM Sites with Edge Delivery Services']];
  for (const [play, ids, title] of CASES) {
    const ctx = await context(), p = await page(ctx); await pick(p, play); const label = PLAY[play].label;
    await goal(p, ownGoal(play)); for (const id of ids) await add(p, id); await shut(p);
    const c = await canvas(p), h = await handover(p), edges = await p.evaluate(ids => conns().filter(x => ids.includes(x.a) || ids.includes(x.b)).length, ids);
    const svc = await p.evaluate(ids => ids.every(id => all(P[id]).some(counted) || conns().some(x => (x.a === id || x.b === id) && all(x).some(counted))), ids);
    const rm = await p.evaluate(([own, ids]) => ({own: own.map(id => /data-rm=|data-remove-sites/.test(cardHTML('p', id))), added: ids.map(id => /data-rm=|data-remove-sites/.test(cardHTML('p', id)))}), [PLAY[play].products, ids]);
    ok(c.play === play && c.label === label && same(c.on, ids) && ids.every(id => c.boxes.includes(id)) && edges > 0 && svc && same(h.added, ids) && same(h.addedNames, ids.map(id => NAME[id])),
      `2. ${label} plus ${ids.map(id => NAME[id]).join(' and ')}: the label "Play" still reads "${label}", the added product is on the canvas with its lines and services, and the hand-over names it`, JSON.stringify({label: c.label, on: c.on, boxes: c.boxes, edges, svc, added: h.added, names: h.addedNames}));
    ok(rm.own.every(x => !x) && rm.added.every(Boolean), `2. ${label}: the play's own products have no Remove button and the added one has`, JSON.stringify(rm));
    // Nov 18 2026 (Adam: "a play should always offer them if there's a product on its canvas that connects to them"): the known limit is gone
    if (play === 'coworker') { const offer = await p.evaluate(() => outsideOffer());
      ok(c.out && offer.includes('cdn') && !c.boxes.includes('cdn'), '2. Adobe Coworker with Brand Visibility added shows "Add outside system", which offers the CDN; the CDN is on the canvas only once it is added', JSON.stringify({out: c.out, offer, boxes: c.boxes})); }
    await toSow(p); const s = await sow(p);
    ok(s.play === play && s.label === label && s.title === title && s.objective && s.n === c.n && s.total === c.total && same(s.added[play].products, ids),
      `2. ${label}: the SOW steps keep the play's name and objective, Services shows the canvas's ${c.n} services and total, and the statement of work is titled "${title}"`, JSON.stringify(s).slice(0, 400) + ' canvas ' + c.n + ' ' + c.total);
    await ctx.close();
  }

  // ============ 3. Remove takes it back ============
  const press = (p, sel) => p.evaluate(s => document.querySelector(s).click(), sel);
  const node = async (p, id) => { await p.evaluate(id => { pinned = true; showCard('p', id); }, id); await p.waitForTimeout(250); };
  { // Coworker on Brand Visibility + Customer Journey Analytics
    const ctx = await context(), p = await page(ctx); await pick(p, 'cja'); const c0 = await canvas(p); await toSow(p); const s0 = await sow(p); await toBuild(p);
    await goal(p, ownGoal('cja')); await add(p, 'cw'); await shut(p); const c1 = await canvas(p); await toSow(p); const s1 = await sow(p); await toBuild(p);
    await node(p, 'cw'); await press(p, '#card [data-rm="cw"]'); await p.waitForTimeout(400); const c2 = await canvas(p);
    ok(c1.n > c0.n && s1.n === c1.n && same([c2.boxes, c2.at, c2.lines, c2.n, c2.total, c2.on, c2.extra], [c0.boxes, c0.at, c0.lines, c0.n, c0.total, [], 0]),
      '3. Coworker added to Brand Visibility + Customer Journey Analytics, seen on Services, then removed: Build is at once back to the play\'s starting boxes, places, services and total', JSON.stringify({c0: [c0.n, c0.total], c1: [c1.n, c1.total], c2: [c2.n, c2.total, c2.extra, c2.at]}));
    await toSow(p); const s2 = await sow(p);
    ok(same([s2.on, s2.total, s2.added, s2.title], [s0.on, s0.total, null, s0.title]), '3. and Services then shows the starting services and total, with no Coworker service and the play\'s own title', JSON.stringify({s0: [s0.n, s0.total], s2: [s2.n, s2.total, s2.added, s2.title]}));
    await ctx.close();
  }
  for (const play of ['abv', 'cja']) for (const how of ['data-remove-sites', 'data-switch-publish']) { // Edge Delivery Services authored in AEM, added and taken off again
    const ctx = await context(), p = await page(ctx); await pick(p, play); const c0 = await canvas(p); await toSow(p); const s0 = await sow(p); await toBuild(p);
    await goal(p, ownGoal(play)); await add(p, 'eds'); await shut(p);
    await p.selectOption('.node[data-p="eds"] select[data-choice="authoring"]', 'universal'); await p.waitForTimeout(400); const c1 = await canvas(p);
    await toSow(p); await toBuild(p); await node(p, 'eds'); await press(p, `#card [${how}]`); await p.waitForTimeout(400); const c2 = await canvas(p);
    await toSow(p); const s2 = await sow(p);
    if (how === 'data-remove-sites') ok(c1.boxes.includes('aemsites') && same([c2.boxes, c2.at, c2.lines, c2.n, c2.total, c2.extra], [c0.boxes, c0.at, c0.lines, c0.n, c0.total, 0]) && same([s2.on, s2.total, s2.added], [s0.on, s0.total, null]),
      `3. ${PLAY[play].label} plus Edge Delivery Services authored in AEM, seen on Services, then "Remove AEM Sites from canvas": Build is at once back to the starting boxes, services and total, and so is Services`, JSON.stringify({c0: [c0.n, c0.total], c2: [c2.n, c2.total, c2.extra, c2.boxes], s2: [s2.n, s2.total]}));
    else ok(same(c2.on, ['aemsites']) && !c2.boxes.includes('eds') && c2.extra === 0 && s2.n === c2.n && s2.total === c2.total && same(s2.added[play].products, ['aemsites']),
      `3. ${PLAY[play].label} plus Edge Delivery Services authored in AEM, seen on Services, then "Switch to traditional AEM Publish": AEM Sites stays as the added product, nothing of Edge Delivery Services is still counted, and Services shows the canvas's services and total`, JSON.stringify({c2: [c2.on, c2.n, c2.total, c2.extra], s2: [s2.n, s2.total, s2.added]}));
    await ctx.close();
  }
  { // known limit, pinned: a service of the product ticked on Services before the product was added goes off when the product is removed
    const ctx = await context(), p = await page(ctx); await pick(p, 'cja'); const c0 = await canvas(p); await toSow(p); const s0 = await sow(p);
    const ticked = await p.evaluate(() => { const s = catalog().find(x => x.plays.includes('cja') && /Coworker Skills for CJA reporting/.test(x.name)); if (!s) return ''; state.estimates.cja[s.id].on = true; save(); render(); return s.id; });
    const s1 = await sow(p); await toBuild(p); const c1 = await canvas(p);
    await goal(p, ownGoal('cja')); await add(p, 'cw'); await shut(p); await toSow(p); await toBuild(p);
    await node(p, 'cw'); await press(p, '#card [data-rm="cw"]'); await p.waitForTimeout(400); const c2 = await canvas(p); await toSow(p); const s2 = await sow(p);
    ok(!!ticked && s1.n === s0.n + 1 && c1.extra === 1 && c2.extra === 0 && c2.total === c0.total && s2.on === s0.on && s2.total === s0.total,
      '3. known limit, pinned: "Coworker Skills for CJA reporting" ticked on Services, then Coworker added, seen on Services and removed: the service is off and the total is the play\'s starting total', JSON.stringify({ticked, s0: s0.n, s1: s1.n, c1: c1.extra, c2: [c2.extra, c2.total, c0.total], s2: [s2.n, s2.total]}));
    await ctx.close();
  }

  // ============ 4. round trips ============
  {
    const ctx = await context(), p = await page(ctx); await pick(p, 'cja'); await goal(p, 'slow-reporting'); await add(p, 'target'); await shut(p); const c0 = await canvas(p);
    await p.reload(); await p.waitForFunction('window.READY===true'); const c1 = await canvas(p);
    ok(same([c1.play, c1.on, c1.goal, c1.lines, c1.total], ['cja', ['target'], 'slow-reporting', c0.lines, c0.total]), '4. a reload keeps the play, the added product and the goal', JSON.stringify(c1).slice(0, 200));
    const [dl] = await Promise.all([p.waitForEvent('download', {timeout: 20000}), p.click('#save-draft')]); const file = path.join(tmp, 'draft.json'); await dl.saveAs(file);
    await p.waitForURL(u => !/\/sow\//.test(String(u)), {timeout: 20000}); await p.waitForFunction('window.READY===true');
    const draft = JSON.parse(fs.readFileSync(file, 'utf8'));
    ok(draft.play === 'cja' && draft.goal === 'slow-reporting' && same(draft.added.cja.products, ['target']), '4. Save draft writes the play, the added product and the goal', JSON.stringify({play: draft.play, goal: draft.goal, added: draft.added}));
    const ctx2 = await context(), q = await page(ctx2); await q.setInputFiles('#draft-file', file); await q.waitForURL(u => !/\/sow\//.test(String(u)) && /synced=|index\.html$|\/$/.test(String(u)), {timeout: 20000}); await q.waitForFunction('window.READY===true'); await q.waitForTimeout(500);
    const c2 = await canvas(q); await menu(q); const l2 = await list(q);
    ok(same([c2.play, c2.label, c2.on, c2.goal, c2.lines, c2.total], ['cja', PLAY.cja.label, ['target'], 'slow-reporting', c0.lines, c0.total]) && l2.view === 'ranked', '4. Open draft in a clean browser brings back the play with its name, the added product, the goal (the list opens ranked, with no question) and the same services and total', JSON.stringify(c2).slice(0, 300) + ' ' + l2.view);
    await ctx2.close();
    // Build from the SOW steps when the canvas holds another play
    await toSow(p); await p.evaluate(() => localStorage.setItem('abv-sow-build-v1', JSON.stringify({play: 'abv', on: [], out: ['cdn'], v: 2}))); await toBuild(p); const c3 = await canvas(p);
    ok(same([c3.play, c3.on, c3.goal], ['cja', ['target'], 'slow-reporting']), '4. Build, pressed on the SOW steps while the canvas holds another play, puts this play, its added product and its goal back', JSON.stringify(c3).slice(0, 200));
    // Change play clears the products and the goal; the play picked next asks, with its own problem first
    await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300);
    const cleared = await p.evaluate(() => ({play: st.play, on: st.on, goal: st.goal || ''}));
    await pick(p, 'cja'); const c4 = await canvas(p); await menu(p); const l4 = await list(p), first4 = await p.$eval('#add-menu [data-goal]', x => x.dataset.goal + (x.classList.contains('own') ? ' own' : ''));
    ok(cleared.play === null && !cleared.on.length && !cleared.goal && !c4.on.length && !c4.goal && c4.lines === untouched.cja.c.lines && l4.view === 'goal' && first4 === 'ai-traffic-revenue own',
      '4. Change play clears the added product and the goal; the same play picked again starts clean and asks the question with its own problem first', JSON.stringify({cleared, on: c4.on, goal: c4.goal, view: l4.view, first4}));
    await goal(p, 'slow-reporting'); await shut(p); await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300); await pick(p, 'abv'); await menu(p);
    const l5 = await list(p), first5 = await p.$eval('#add-menu [data-goal]', x => x.dataset.goal + (x.classList.contains('own') ? ' own' : ''));
    ok(l5.view === 'goal' && first5 === 'ai-answers-missing own', '4. after Change play the next play asks again, with that play\'s own problem first', l5.view + ' ' + first5);
    // Start over, on Build and on the SOW steps
    await goal(p, 'ai-answers-missing'); await add(p, 'cja'); await shut(p); await p.click('#start-over'); await p.click('#confirm-yes'); await p.waitForTimeout(300);
    const over = await p.evaluate(() => ({play: st.play, on: st.on, goal: st.goal || '', saved: localStorage.getItem(KEY)}));
    ok(over.play === null && !over.on.length && !over.goal && !/"goal"/.test(over.saved), '4. Start over on Build clears the added product and the goal', JSON.stringify(over).slice(0, 200));
    await pick(p, 'abv'); await goal(p, 'ai-answers-missing'); await add(p, 'cja'); await shut(p); await toSow(p);
    await p.click('#start-over'); await Promise.all([p.waitForURL(u => !/\/sow\//.test(String(u))), p.click('#start-over-confirm')]); await p.waitForFunction('window.READY===true');
    const over2 = await p.evaluate(() => ({play: st.play, on: st.on, goal: st.goal || '', tool: localStorage.getItem(TOOL_KEY) || ''}));
    ok(over2.play === null && !over2.on.length && !over2.goal && !/"goal"|"added"/.test(over2.tool), '4. Start over on the SOW steps clears them too, on the canvas and in the engagement', JSON.stringify(over2).slice(0, 200));
    await ctx.close();
  }

  // ============ 5. the number, to the digit (made-up sample numbers) ============
  ok(!checker(FIX_A) && !checker(FIX_B) && !checker(FIX_B10) && !same(REAL, FIX_A) && !same(REAL, FIX_B) && !same(REAL, FIX_B10) && FIX_A.numbered.includes('cw') && FIX_A.numbered.includes('bv') && !FIX_B.numbered.includes('cw') && !('bv+cja' in FIX_B.sets) && 'aa+cja' in FIX_B.sets && 'cja+target' in FIX_B.sets,
    '5. the sample tables pass the checker, are not the real table, and hold what the checks below need (no set for Brand Visibility + Customer Journey Analytics)', [checker(FIX_A), checker(FIX_B), checker(FIX_B10)].join(' | '));
  const calcOf = (l, id) => (l.rows.find(r => r.id === id) || {calc: []}).calc;
  const APPROVED = DEF + 'Fewer than 30 customers own both products on this canvas, so these numbers set Brand Visibility aside and use the 673 customers who own Customer Journey Analytics. That makes them rough, and probably too low.';
  let listB;
  { const p = await open({table: FIX_B}); await pick(p, 'cja'); await goal(p, 'ai-traffic-revenue'); const l = listB = await list(p), t = l.rows.find(r => r.id === 'target'), cw = l.rows.find(r => r.id === 'cw'), tc = calcOf(l, 'target');
    ok(l.def === APPROVED, '5. sample, Brand Visibility + Customer Journey Analytics, its own goal: the paragraph is the approved one, with the 673 customers who own Customer Journey Analytics', l.def);
    ok(t && t.num === '.45' && t.cnt === '305 of 673 · Rough · How this number was worked out' && tc[0] === 'All customers: 1,001 of 3,000 own Target. 1,001 ÷ 3,000 = 0.3337' && tc[1] === 'Customers who own Customer Journey Analytics: 305 of 673 own Target. (305 + 10 × 0.3337) ÷ (673 + 10) = 0.4514' && tc[2] === 'Shown as .45.' && /^We add 10 pretend customers to every group except all customers\./.test(tc[3]),
      '5. Target shows .45 with "305 of 673 · Rough", and its lines read 1,001 ÷ 3,000 = 0.3337, then (305 + 10 × 0.3337) ÷ (673 + 10) = 0.4514', JSON.stringify(t));
    ok(cw && cw.rank === 1 && cw.next && cw.head === FITS[1] && cw.none === 'No number yet' && !cw.num && cw.cnt === 'New product. Too few customers own it yet for a number.' && cw.why === 'Builds on the goal. My client\'s leaders want readouts on request. This needs CJA B2C edition.',
      '5. Coworker leads "Builds on the goal" with "Next", "No number yet" and "New product. Too few customers own it yet for a number." (the approved picture)', JSON.stringify(cw));
    // the fall-back's consequence, pinned: a product that is not the goal's own is set aside first, then the goal's rarer product
    await add(p, 'target'); const l2 = await list(p);
    ok(l2.def === DEF + 'Fewer than 30 customers own all 3 products on this canvas, so these numbers set Target and Brand Visibility aside and use the 673 customers who own Customer Journey Analytics. That makes them rough, and probably too low.',
      '5. pinned: with Target added, the count sets Target and then Brand Visibility aside and still rests on the 673 customers who own Customer Journey Analytics', l2.def);
    await p.context().close(); }
  { const p = await open({table: FIX_A}); await pick(p, 'cja'); await goal(p, 'ai-traffic-revenue'); const l = await list(p), cw = l.rows.find(r => r.id === 'cw'), c = calcOf(l, 'cw');
    ok(cw && cw.num === '.06' && cw.cnt.startsWith('40 of 673') && /120 ÷ 3,000 = 0\.0400$/.test(c[0]) && /\(40 \+ 10 × 0\.0400\) ÷ \(673 \+ 10\) = 0\.0592$/.test(c[1]), '5. sample with the bar at 90: Coworker shows the page\'s ".06", from 0.0400 and 0.0592', JSON.stringify(cw));
    await p.context().close(); }
  for (const [T, name] of [[FIX_B, 'B'], [FIX_A, 'A']]) { const p = await open({table: T}); await pick(p, 'custom', ''); await add(p, 'aa'); await add(p, 'cja'); await goal(p, 'ai-traffic-revenue'); const l = await list(p);
    if (name === 'B') { const t = l.rows.find(r => r.id === 'target'), c = calcOf(l, 'target');
      ok(l.def === DEF + 'These numbers count the 539 customers who own Adobe Analytics and Customer Journey Analytics.' && t.num === '.47' && t.cnt === '256 of 539 · How this number was worked out' && c.length === 5 && c[2] === 'Customers who own Adobe Analytics and Customer Journey Analytics: 256 of 539 own Target. (256 + 10 × 0.4514) ÷ (539 + 10) = 0.4745',
        '5. sample, Create your own play with Adobe Analytics and Customer Journey Analytics: the numbers count the 539 customers who own both, Target shows .47 (not rough) and its third line reads (256 + 10 × 0.4514) ÷ (539 + 10) = 0.4745', l.def + ' ' + JSON.stringify(t)); }
    else { const v = l.rows.find(r => r.id === 'bv'), c = calcOf(l, 'bv');
      ok(v && v.num === '.04' && /= 0\.0317$/.test(c[0]) && /= 0\.0371$/.test(c[1]) && /= 0\.0353$/.test(c[2]), '5. sample with the bar at 90, same canvas: Brand Visibility shows .04, from 0.0317, 0.0371 and 0.0353', JSON.stringify(v)); }
    await p.context().close(); }
  { const p = await open({table: FIX_B}); await pick(p, 'abv'); await goal(p, 'ai-answers-missing'); const l = await list(p), nums = l.rows.filter(r => r.num);
    ok(l.def === DEF + 'Only 95 customers own Brand Visibility, so these numbers are rough.' && nums.length > 3 && nums.every(r => / · Rough · /.test(r.cnt)), '5. sample, Adobe Brand Visibility: "Only 95 customers own Brand Visibility, so these numbers are rough." and every row with a number carries "Rough"', l.def);
    await p.context().close(); }
  { const p = await open({table: FIX_B10}); await pick(p, 'abv'); await goal(p, 'ai-answers-missing'); await p.evaluate(() => document.querySelectorAll('#add-menu details').forEach(d => { d.open = true; })); const l = await list(p), lines = l.rows.flatMap(r => r.calc.filter(x => / = \d\.\d{4}$/.test(x))), zero = l.rows.find(r => /^fewer than 10 of 90 /.test(r.cnt));
    ok(l.def === DEF + 'Only 90 customers own Brand Visibility, so these numbers are rough. Counts are rounded down to the nearest 10.' && !!zero && lines.length > 8 && lines.every(redoLine),
      '5. the sample rounded down to the nearest 10: the paragraph says so, a count of 0 reads "fewer than 10 of 90", and every printed line of arithmetic redoes to its printed result', l.def + ' | ' + (zero || {}).cnt + ' | ' + lines.filter(x => !redoLine(x)).slice(0, 2).join(' / '));
    await p.context().close(); }

  // ============ 6. the real table, by an independent sum ============
  const against = (l, T, on, goalId) => { const g = redo(T, on, goalId), bad = [];
    for (const r of l.rows) { const v = g.number(r.id);
      if (!v ? !(r.none === 'No number yet' && !r.num) : !(r.num === shownAs(v.t) && r.cnt === (v.k || T.round === 1 ? num(v.k) : 'fewer than ' + T.round) + ' of ' + num(v.n) + (g.rough ? ' · Rough' : '') + ' · How this number was worked out' && r.calc.filter(x => / = \d\.\d{4}$/.test(x)).every(redoLine))) bad.push(r.id + ' ' + r.num + ' ' + r.cnt); }
    for (let t = 0; t < 4; t++) { const ts = l.rows.filter(r => tierOf(r) === t && g.number(r.id)).map(r => g.number(r.id).t); if (ts.some((v, i) => i && v > ts[i - 1])) bad.push('order under ' + FITS[t]); }
    if (!l.rows.every((r, i) => r.rank === i + 1)) bad.push('ranks');
    const says = g.kept.length || g.aside.length ? (g.kept.length ? num(g.n) + ' customers who own' : 'use all ' + num(g.n) + ' customers') : 'count all ' + num(g.n) + ' customers';
    if (!l.def.includes(g.aside.length || !g.kept.length ? says : num(g.n) + ' customers ')) bad.push('group: ' + l.def);
    if (/rough/.test(l.def) !== g.rough) bad.push('rough in the paragraph');
    if ((T.round > 1) !== l.def.endsWith('Counts are rounded down to the nearest ' + T.round + '.')) bad.push('rounding sentence');
    return {bad, numbers: l.rows.filter(r => r.num).length, g}; };
  { const blob = PAGE.match(/const NEXT=(\{[^;]*\});/), built = read('canvas/index.html').match(/const NEXT=(\{[^;]*\});/);
    ok(!!blob && !!built && same(JSON.parse(blob[1]), REAL) && same(JSON.parse(built[1]), REAL), '6. the table in canvas/index.html and site/index.html is canvas/next_product_counts.json, number for number');
    for (const play of READY) { const p = await open(); await pick(p, play); const gid = ownGoal(play); await goal(p, gid); await p.evaluate(() => document.querySelectorAll('#add-menu details').forEach(d => { d.open = true; }));
      let l = await list(p), on = (await canvas(p)).boxes, a = against(l, REAL, on, gid);
      ok(!a.bad.length && l.rows.length > 25, `6. real table, ${PLAY[play].label} with its own goal: every number, count, "Rough" mark and printed line on screen is what the method gives, numbers fall under each heading, and the paragraph names the group that counts (${a.numbers} rows with a number)`, a.bad.slice(0, 4).join(' | '));
      const top = l.rows[0].adds.split(',')[0]; await add(p, top); await p.evaluate(() => document.querySelectorAll('#add-menu details').forEach(d => { d.open = true; })); l = await list(p); on = (await canvas(p)).boxes; a = against(l, REAL, on, gid);
      ok(!a.bad.length && on.includes(top) && !l.rows.some(r => r.adds.split(',').includes(top)), `6. real table, the same after adding the top row (${NAME[top]}): the list is worked out again and still matches`, a.bad.slice(0, 4).join(' | '));
      await p.context().close(); }
    const p = await open(); await pick(p, 'custom', ''); const eight = ['aemsites', 'aemassets', 'aa', 'target', 'workfront', 'marketo', 'rtcdp', 'creativecloud']; for (const id of eight) await add(p, id);
    await goal(p, 'customer-data-silos'); await p.evaluate(() => document.querySelectorAll('#add-menu details').forEach(d => { d.open = true; })); const l = await list(p), a = against(l, REAL, eight, 'customer-data-silos');
    ok(!a.bad.length && a.g.left.join() === 'creativecloud' && /Creative Cloud has no customer numbers yet, so it is not counted\./.test(l.def), '6. real table, Create your own play with eight products: the list matches the method, and the paragraph says Creative Cloud has no customer numbers yet, so it is not counted', a.bad.slice(0, 4).join(' | ') + ' ' + l.def);
    await p.context().close(); }

  // ============ 7. structure, and the reasons ============
  { const l = listB, t = k => l.rows.filter(r => tierOf(r) === k), con = t(2), held = l.held;
    ok(same(l.heads, [FITS[1], FITS[2], 'Not suggested']) && same(t(1).map(r => r.id), ['cw']) && con.length === 9 && same(con.filter(r => !r.fold).map(r => r.name), ['AEM Sites', 'Target', 'Journey Optimizer', 'Adobe Commerce']) && same(con.filter(r => !r.fold).map(r => r.num), ['.52', '.45', '.31', '.12'])
      && con.filter(r => r.fold).length === 5 && con.some(r => r.fold && r.id === 'bc') && same(l.folds.map(f => [f.name, f.count, f.open]), [['More that connect to the goal', '5 products', false], [FITS[3], '22 products', false]]) && t(3).length === 22,
      '7. sample, Brand Visibility + Customer Journey Analytics, its own goal: Coworker under "Builds on the goal"; nine under "Connects to the goal", of which AEM Sites .52, Target .45, Journey Optimizer .31 and Adobe Commerce .12 show and five sit in a closed fold with Brand Concierge; 22 in the closed fold "Not tied to this goal" (the approved picture, which showed 20 before Commerce Optimizer and Commerce Intelligence joined on Nov 19 2026)', JSON.stringify({heads: l.heads, con: con.map(r => r.name + r.num + (r.fold ? '*' : '')), folds: l.folds}));
    ok(held.length === 1 && held[0].id === 'aa' && held[0].head === 'Not suggested' && held[0].tag === 'Add anyway' && held[0].to === 'Customer Journey Analytics is on your canvas. Add Adobe Analytics only if your client still runs it.' && !l.rows.some(r => r.id === 'aa') && l.text.trim().endsWith(held[0].to),
      '7. Adobe Analytics sits last, under "Not suggested", with "Add anyway" and its reason, and has no rank and no number', JSON.stringify(held));
    ok(l.k === 'Add product' && l.top === 'Ranked for your client\'s goal. Brand Visibility and Customer Journey Analytics solve it, and both are on your canvas.' && l.goal === 'Goal: My client can\'t tie AI traffic to revenue' && l.role === 'menu' && l.wide
      && l.rows.find(r => r.id === 'eds').why === 'Connects to the goal. Native integration with Brand Visibility (partner workflow with Edge Delivery Services). Shared platform with Customer Journey Analytics.' && l.rows.find(r => r.id === 'eds').adds === 'eds,aemsites',
      '7. the top reads as approved, the goal box names the goal, and the AEM Sites row gives its approved reason and its two ways to add it', l.top + ' | ' + l.goal + ' | ' + JSON.stringify(l.rows.find(r => r.id === 'eds')));
    const p = await open({table: FIX_B}); await pick(p, 'cja'); await goal(p, 'ai-traffic-revenue'); await add(p, 'aa'); const on = await canvas(p);
    ok(on.on.join() === 'aa' && on.label === PLAY.cja.label, '7. and "Add anyway" still adds Adobe Analytics', JSON.stringify(on.on)); await p.context().close(); }
  { // the other plays, each with its own goal(s): the headings the files give (PLAN D1), with the real table
    // Nov 19 2026: Commerce Optimizer and Commerce Intelligence add two rows to every list: under Connects to the goal where Adobe Commerce, Edge Delivery Services, AEM Assets or Sites Optimizer solves it, else under Not tied to this goal
    const WANT = {'ai-answers-missing': [5, 0, 29, ''], 'ai-traffic-revenue': [1, 9, 22, 'aa'], 'product-pages-ai': [3, 7, 23, ''], 'organic-traffic-falling': [2, 9, 21, ''], 'slow-website': [3, 9, 20, ''], 'seo-fix-backlog': [1, 10, 21, ''], 'fsi-complex-questions': [3, 5, 25, ''], 'team-busywork': [4, 12, 18, '']};
    const got = {}, whys = [], order = []; let fourCw = '', notEach = '';
    for (const play of READY) { const p = await open(); await pick(p, play);
      for (const g of PROBLEMS.filter(q => q.play === play)) { await goal(p, g.id); const l = await list(p), t = k => l.rows.filter(r => tierOf(r) === k);
        got[g.id] = [t(1).length, t(2).length, t(3).length, l.held.map(h => h.id).join()]; whys.push(...t(1).map(r => r.why));
        if (t(0).length || l.rows.some((r, i) => i && tierOf(r) < tierOf(l.rows[i - 1])) || !l.rows[0].next || l.rows.filter(r => r.next).length !== 1) order.push(g.id);
        if (play === 'coworker') { fourCw = t(1).map(r => r.name + ': ' + r.why).join(' | '); notEach += ' bv on coworker: ' + tierOf(l.rows.find(r => r.id === 'bv')); }
        if (play === 'abv') notEach += ' cw on abv: ' + tierOf(l.rows.find(r => r.id === 'cw')); }
      await p.context().close(); }
    ok(Object.keys(WANT).length === Object.keys(got).length && Object.keys(WANT).every(k => same(got[k], WANT[k])), '7. the six plays with their own goals (eight goals): the rows under "Builds on the goal", "Connects to the goal" and "Not tied to this goal" and the products held back are the ones the tool\'s files give', JSON.stringify(got));
    ok(!order.length, '7. on each of them the headings come in order, no row solves a goal the play already solves, and "Next" sits on the first row only', order.join());
    ok(fourCw.split(' | ').length === 4 && fourCw.split(' | ').every(x => x.endsWith(': Builds on the goal. Native integration with Coworker.')), '7. on the Adobe Coworker play the four rows that build on the goal read "Native integration with Coworker."', fourCw);
    ok(notEach === ' cw on abv: 3 bv on coworker: 3', '7. said plainly, pinned: Coworker on the Adobe Brand Visibility play and Brand Visibility on the Adobe Coworker play sit in "Not tied to this goal" (no documented connection between the two)', notEach);
    // all 26 goals on an empty Create your own play
    const p = await open(); await pick(p, 'custom', ''); const all = await p.evaluate(() => PROBS.map(g => { st.goal = g.id; const R = rankRows(); return {id: g.id, builds: R.rows.filter(r => r.tier === 1).map(r => r.why), next: R.rows[0].tier}; }));
    await p.evaluate(() => { delete st.goal; }); const bad = [...all.flatMap(g => g.builds), ...whys].filter(w => /My client owns|My client runs|My client licenses|leaves the setup/.test(w) || !/\.$/.test(w));
    ok(all.length === 26 && all.every(g => g.next === 0) && all.flatMap(g => g.builds).length > 40 && !bad.length, '7. over all 26 goals on an empty Create your own play and over the six plays, no reason under "Builds on the goal" says the client already owns, runs or licenses the product, or that a product leaves the setup; an empty canvas starts with what solves the goal', bad.slice(0, 3).join(' | '));
    // "Next" is on no row when every row is in "Not tied to this goal"
    const sv = PROBLEMS.find(g => g.id === 'slow-reporting'), every = await p.evaluate(g => { st.goal = g; const f = goalFit(goalOf()), tied = CUSTOM.products.filter(id => id !== 'aemsites' && fitOf(id, f) < 3); st.on = tied; delete st.goal; return tied; }, sv.id);
    await p.evaluate(() => render()); await goal(p, sv.id); await p.evaluate(() => document.querySelectorAll('#add-menu details').forEach(d => { d.open = true; })); const l = await list(p);
    ok(every.length > 3 && l.rows.length > 5 && l.rows.every(r => tierOf(r) === 3 && !r.next) && !l.heads.some(h => FITS.includes(h)), '7. when every row left is in "Not tied to this goal", no row carries "Next"', JSON.stringify({every, rows: l.rows.length, heads: l.heads, next: l.rows.filter(r => r.next).length}));
    await p.context().close(); }

  { // Nov 18 2026: a play offers every outside system that connects to a product on it, so on the Adobe Coworker play Brand Visibility brings the CDN, and the
    // row that adds Brand Visibility keeps its chip's note about the CDN, as Create your own play does; a note about a system the play would still not offer stays off
    const p = await open(), why = {}; await pick(p, 'coworker');
    for (const g of ['slow-reporting', 'cant-see-what-works']) { await goal(p, g); const l = await list(p); why[g] = (l.rows.find(r => r.id === 'bv') || {}).why; why[g + ', rows naming the CDN'] = l.rows.filter(r => /CDN/.test(r.why)).length; }
    await p.context().close();
    const q = await open(); await pick(q, 'custom', ''); await goal(q, 'slow-reporting'); const own = ((await list(q)).rows.find(r => r.id === 'bv') || {}).why; await q.context().close();
    const names = await (async () => { const p = await open(), bad = []; for (const play of READY) { await pick(p, play, '');
      bad.push(...await p.evaluate(() => { const out = []; for (const g of PROBS) { st.goal = g.id; const R = rankRows();
        for (const r of R.rows) if (r.tier === 1) { const ids = rowIds(r.id), c = R.f.refine.find(c => c.add.some(id => ids.includes(id))); const offered = offerOf([...(play().custom ? [] : play().products), ...st.on, ...ids]); if (c.note && r.why.includes(c.note) && c.add.some(id => P[id].outside && !offered.includes(id))) out.push(st.play + ' ' + g.id + ' ' + r.id); } }
        delete st.goal; return out; }));
      await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300); } await p.context().close(); return bad; })();
    ok(why['slow-reporting'] === 'Builds on the goal. My client wants the AI channel included. Brand Visibility\'s CJA source needs CDN logs, so the CDN belongs on the canvas.' && why['cant-see-what-works'] === 'Builds on the goal. My client wants AI assistants included as a channel. Brand Visibility\'s CJA source needs CDN logs, so the CDN belongs on the canvas.' && why['slow-reporting, rows naming the CDN'] === 1 && why['cant-see-what-works, rows naming the CDN'] === 1
      && own === 'Builds on the goal. My client wants the AI channel included. Brand Visibility\'s CJA source needs CDN logs, so the CDN belongs on the canvas.' && !names.length,
      '7. on Adobe Coworker, which offers the CDN once Brand Visibility is on it, the Brand Visibility row gives the client detail and "the CDN belongs on the canvas" (both goals that add it), as Create your own play does; on no play and for no goal does a reason carry the note of a chip that adds an outside system the play would not offer with that product on it', JSON.stringify({why, own, names: names.slice(0, 5)})); }

  // ============ 8. the goal: asked once ============
  { const p = await open({table: FIX_B}); await pick(p, 'aem'); await menu(p); let l = await list(p);
    const q = await p.evaluate(() => ({own: [...document.querySelectorAll('#add-menu [data-goal].own')].map(x => x.textContent), subs: [...document.querySelectorAll('#add-menu .rk-sub')].map(x => x.textContent), all: (document.querySelector('#add-menu [data-goal-all]') || {}).textContent, field: !!document.getElementById('goal-q'), label: (document.querySelector('#goal-form label') || {}).textContent, ph: (document.getElementById('goal-q') || {}).placeholder}));
    ok(l.view === 'goal' && l.role === 'group' && l.label === 'What is your client trying to accomplish?' && l.k === l.label && l.top === 'You answer once for this canvas. Every suggestion after this follows it.' && same(q.subs, ['This play\'s problems', 'Other problems']) && same(q.own, PROBLEMS.filter(g => g.play === 'aem').map(g => g.chip)) && q.all === 'See all 26 problems' && q.label === 'Or describe it in your own words' && q.ph === 'For example: leaders want a monthly readout on AI traffic' && !(await canvas(p)).goal,
      '8. on a ready-made play Add product first asks "What is your client trying to accomplish?", the play\'s own problems first (three on the Edge Delivery play), then the common ones, "See all 26 problems" and a field for the partner\'s own words; nothing is set yet', JSON.stringify(q));
    await p.click('#add-menu [data-goal-all="1"]'); await p.waitForTimeout(150); const allN = await p.$$eval('#add-menu [data-goal]', x => x.length), heads = await p.$$eval('#add-menu .rk-sub', x => x.map(y => y.textContent));
    ok(allN === 26 && heads.length === 6 && heads[0] === 'Revenue growth goals' && await p.$eval('#add-menu [data-goal-all]', x => x.textContent) === 'Show fewer problems', '8. "See all 26 problems" lists all 26 under the first page\'s six headings, with "Show fewer problems"', allN + ' ' + heads.join());
    // typed: chips to confirm, the text stays, nothing is set until a chip is pressed
    await p.fill('#goal-q', 'leaders want a monthly readout on AI traffic'); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
    const typed = await p.evaluate(() => ({heard: (document.querySelector('#add-menu .rk-heard') || {}).textContent, chips: [...document.querySelectorAll('#add-menu .rk-chips [data-goal]')].map(x => x.dataset.goal), field: document.getElementById('goal-q').value, goal: st.goal || '', focus: document.activeElement.dataset.goal || ''}));
    ok(typed.heard === 'Closest to what you typed. Pick one:' && typed.chips.length >= 1 && typed.chips.length <= 3 && typed.field === 'leaders want a monthly readout on AI traffic' && !typed.goal && typed.focus === typed.chips[0], '8. a typed goal offers up to three chips to confirm, keeps the typed text in the field, sets nothing, and puts the keyboard on the first chip', JSON.stringify(typed));
    await p.fill('#goal-q', 'zzzz qqqq'); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
    const miss = await p.evaluate(() => ({heard: (document.querySelector('#add-menu .rk-heard') || {}).textContent, chips: document.querySelectorAll('#add-menu .rk-chips [data-goal]').length, goal: st.goal || ''}));
    ok(miss.heard === 'That doesn\'t match a problem on the list. Try one of the closest, or describe it another way:' && miss.chips >= 4 && !miss.goal, '8. words that match nothing say so, in the first page\'s words, and offer problems to pick from', JSON.stringify(miss));
    await p.fill('#goal-q', 'leaders want a monthly readout on AI traffic'); await p.keyboard.press('Enter'); await p.waitForTimeout(200); await p.click(`#add-menu .rk-chips [data-goal="${typed.chips[0]}"]`); await p.waitForTimeout(250); l = await list(p);
    const c1 = await canvas(p), focus1 = await p.evaluate(() => document.activeElement === document.querySelector('#add-menu [data-add]'));
    ok(c1.goal === typed.chips[0] && l.view === 'ranked' && focus1 && (await handover(p)).goal === typed.chips[0], '8. pressing a chip sets the goal, shows the ranked list with the keyboard on its first row, and the hand-over names the goal', c1.goal + ' ' + l.view + ' ' + focus1);
    await shut(p); await menu(p); l = await list(p); ok(l.view === 'ranked', '8. the question is not asked again on that canvas: Add product opens the ranked list', l.view);
    // Change: the current goal marked, a way back, and a new goal re-ranks without touching the canvas
    const before = l.rows.map(r => r.id + tierOf(r)).join(); await p.click('#add-menu [data-goal-ask]'); await p.waitForTimeout(200);
    const ch = await p.evaluate(() => ({now: (document.querySelector('#add-menu .rk-now') || {}).innerText, cur: [...document.querySelectorAll('#add-menu [data-goal].cur')].map(x => x.dataset.goal).join(), focus: document.activeElement.dataset.goal || '', keep: (document.querySelector('#add-menu [data-goal-back]') || {}).textContent}));
    ok(ch.cur === c1.goal && ch.focus === c1.goal && ch.keep === 'Keep this goal' && ch.now.startsWith('Your goal now: '), '8. "Change" shows the question with the current goal marked and in focus, and "Keep this goal" as the way back', JSON.stringify(ch));
    await p.click('#add-menu [data-goal-back]'); await p.waitForTimeout(150); ok((await list(p)).view === 'ranked' && (await canvas(p)).goal === c1.goal, '8. "Keep this goal" returns to the ranked list unchanged');
    const other = PROBLEMS.find(g => g.starter && g.id !== c1.goal && g.play !== 'aem').id; await goal(p, other); l = await list(p); const c2 = await canvas(p);
    ok(c2.goal === other && l.rows.map(r => r.id + tierOf(r)).join() !== before && same([c2.boxes, c2.lines, c2.total, c2.on], [c1.boxes, c1.lines, c1.total, c1.on]), '8. a new goal re-ranks the list at once and leaves the canvas alone', c2.goal);
    await p.context().close(); }
  { // not asked after Build this
    const p = await open({table: FIX_B}); const i = PROBLEMS.findIndex(g => g.id === 'ai-traffic-revenue'); await p.click(`#bp [data-bpp="${i}"]`); await p.waitForSelector('#bp [data-bpa="build"]', {timeout: 8000}); await p.click('#bp [data-bpa="build"]'); await p.waitForTimeout(500);
    const c = await canvas(p); await menu(p); const l = await list(p);
    ok(c.play === 'cja' && c.goal === 'ai-traffic-revenue' && l.view === 'ranked' && l.goal === 'Goal: My client can\'t tie AI traffic to revenue', '8. a goal given on the first page (Build this) is not asked again: Add product opens ranked for it', JSON.stringify({play: c.play, goal: c.goal, view: l.view}));
    await p.context().close(); }
  { // Create your own play: today's menu with a strip until there is a goal; the grouped menu stays one press away after
    const p = await open({table: FIX_B}); await pick(p, 'custom', ''); await add(p, 'cja'); await menu(p); let l = await list(p);
    const today = await p.evaluate(() => ({first: document.getElementById('add-menu').firstElementChild.className, ranks: document.querySelectorAll('#add-menu .rk-n, #add-menu .rk-num, #add-menu .rk-none').length, groups: document.querySelectorAll('#add-menu .mgrp, #add-menu .it2').length, held: [...document.querySelectorAll('#add-menu .g')].map(x => x.textContent)}));
    ok(l.view === 'groups' && !l.wide && l.role === 'menu' && today.first === 'rk-strip' && l.strip === 'Rank this list for your client\'s goalSay once what your client is trying to accomplish. The best fit comes first.' && !today.ranks && today.groups > 10 && today.held.includes('Not suggested') && l.k === 'Add a product',
      '8. Create your own play with no goal: today\'s grouped menu, with a strip on top that offers to rank it, and no rank and no number anywhere', JSON.stringify(today) + ' ' + l.strip);
    await p.click('#add-menu .rk-strip'); await p.waitForTimeout(200); l = await list(p); const back = await p.evaluate(() => ({subs: [...document.querySelectorAll('#add-menu .rk-sub')].map(x => x.textContent), b: (document.querySelector('#add-menu .rk-allb') || {}).textContent}));
    ok(l.view === 'goal' && same(back.subs, ['Common problems']) && back.b === 'Back to all products', '8. the strip opens the question, with the common problems and "Back to all products"', JSON.stringify(back));
    await p.click('#add-menu .rk-allb'); await p.waitForTimeout(150); ok((await list(p)).view === 'groups' && !(await canvas(p)).goal, '8. "Back to all products" returns to the grouped menu with no goal set');
    await goal(p, 'slow-reporting'); l = await list(p);
    ok(l.view === 'ranked' && l.allb === 'All products, by group' && l.held.some(h => h.id === 'aa' && h.tag === 'Add anyway'), '8. with a goal the list is ranked, Adobe Analytics is under "Not suggested" there too, and "All products, by group" sits under the list', l.view + ' ' + l.allb);
    await p.click('#add-menu .rk-allb'); await p.waitForTimeout(150); l = await list(p); const t2 = await p.evaluate(() => document.querySelectorAll('#add-menu .rk-n, #add-menu .rk-num').length);
    ok(l.view === 'groups' && l.strip === 'Back to the ranked listGoal: My client\'s team spends too long pulling reports' && !t2 && l.k === 'Add a product', '8. "All products, by group" shows today\'s menu, with "Back to the ranked list" and the goal on its strip', l.strip);
    await p.click('#add-menu .rk-strip'); await p.waitForTimeout(150); ok((await list(p)).view === 'ranked', '8. and "Back to the ranked list" returns to it');
    await p.context().close(); }

  // ============ 9. the RFI Builder ============
  { const ctx = await context(), p = await page(ctx); await pick(p, 'cja'); await goal(p, ownGoal('cja')); await add(p, 'target'); await shut(p); await toSow(p); const s0 = await sow(p), work = () => p.evaluate(() => Object.entries(state.estimates.cja || {}).filter(([, r]) => r.on).map(([k]) => k).sort().join()), w0 = await work();
    await p.evaluate(() => { go('rfp'); RFPBuilder.load('pasted.txt', '2.1 How does Adobe Workfront connect to Adobe Experience Manager Assets for creative review and approval?'); }); await p.waitForTimeout(300);
    await p.evaluate(() => { const li = document.querySelector('#rfp-questions li[data-i="0"]'); if (li) li.click(); }); await p.waitForTimeout(200);
    const can = await p.evaluate(() => !!document.getElementById('rfp-use') && document.querySelectorAll('#rfp-answer .rfp-line').length);
    if (can) { await p.click('#rfp-use'); await p.waitForTimeout(100); await p.click('#rfp-to-sow'); await p.waitForTimeout(150); await p.click('#rfp-handoff-go'); await p.waitForTimeout(700); }
    const s1 = await p.evaluate(() => ({play: state.play, added: state.added || null, canvas: JSON.parse(localStorage.getItem('abv-sow-build-v1') || '{}').play})), w1 = await work();
    await toBuild(p); await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300); await pick(p, 'cja'); const again = await canvas(p); await toSow(p); const s2 = await sow(p);
    ok(can > 0 && s1.play === 'custom' && s1.canvas === 'custom' && same(s1.added, s0.added) && w0.split(',').length >= s0.n && w1 === w0 && !again.on.length && again.n === untouched.cja.c.n && s2.title === TITLES.cja && s2.added === null,
      '9. with a ready-made play that holds an added product, sending RFI services to the statement of work still opens Your own play, and the saved engagement still holds the play\'s added product and services; the play picked again starts clean, as it always has, without the added product', JSON.stringify({can, s1, w0, w1, again: [again.on, again.n], s2: [s2.title, s2.added]}));
    await ctx.close(); }

  // ============ 10. nothing from the customer files but the summary table ============
  { const keys = ['v', 'round', 'min_group', 'pretend', 'min_number', 'products', 'numbered', 'few', 'sets'], T = REAL, width = 1 + T.numbered.length, ids = new Set(ADOBE);
    const strings = [...T.products, ...T.numbered, ...T.few, ...Object.keys(T.sets).flatMap(k => k ? k.split('+') : [])], rows = Object.values(T.sets), flat = rows.flat();
    ok(same(Object.keys(T).sort(), keys.slice().sort()) && strings.every(s => ids.has(s) && s !== 'eds') && [T.v, T.round, T.min_group, T.pretend, T.min_number, ...flat].every(v => Number.isInteger(v) && v >= 0) && flat.every(v => v % T.round === 0) && rows.every(r => Array.isArray(r) && r.length === width && r[0] >= T.min_group),
      '10. the table holds only its nine keys, product ids of the catalog and whole numbers: every count a multiple of the rounding, no set under the smallest group, one number for each product with a number in every row');
    const row0 = JSON.stringify(T.sets['']), others = ['site/sow/index.html', 'rfp_answers.js', 'rfp_proposal.js', 'rfp_facts.json', 'rfp_method.json'].filter(f => { const t = read(f); return t.includes('min_group') || t.includes('"numbered"') || t.includes(row0); });
    ok(!others.length, '10. the SOW steps, the RFI Builder and its two data files do not contain the table', others.join());
    let checkerRun = ''; try { checkerRun = execFileSync('python3', ['canvas/next_product_check.py'], {cwd: ROOT, encoding: 'utf8', stdio: 'pipe'}); } catch (e) { checkerRun = 'FAILED ' + (e.stdout || '') + (e.stderr || ''); }
    ok(/^ok {4}the real file/.test(checkerRun) && /\n0 failed\s*$/.test(checkerRun) && !/FAIL/.test(checkerRun), '10. python3 canvas/next_product_check.py passes: the real file, and every kind of bad table refused', checkerRun.split('\n').filter(x => /FAIL/.test(x)).join(' | ').slice(0, 300));
    let inCanvas = []; try { inCanvas = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', 'canvas'], {cwd: ROOT, encoding: 'utf8'}).split('\n').filter(Boolean); } catch (e) { inCanvas = ['canvas/git ls-files did not run.csv']; }
    const sheets = inCanvas.filter(f => /\.(xlsx?|xlsm|csv|tsv|parquet)$/i.test(f)), data = inCanvas.filter(f => /^canvas\/[^/]+\.json$/.test(f)).sort();
    ok(inCanvas.length > 10 && !sheets.length && same(data, ['canvas/catalog.json', 'canvas/catalog_map.json', 'canvas/never_suggest.json', 'canvas/next_product_counts.json', 'canvas/problems.json', 'canvas/training.json']),
      '10. canvas/ holds no spreadsheet, and beside canvas/next_product_counts.json its only data files are the catalog, its map, the problems, the never-go-backwards rules and the training links (saved or not)', sheets.concat(data).join()); }

  // ============ 11. words ============
  { const texts = []; let one = '';
    for (const play of ['cja', 'coworker', 'commerce']) { const p = await open(); await pick(p, play); await menu(p); texts.push((await list(p)).text); await goal(p, ownGoal(play));
      await p.evaluate(() => { document.querySelectorAll('#add-menu details').forEach(d => { d.open = true; }); document.querySelectorAll('#add-menu .rk-calc').forEach(d => { d.hidden = false; }); }); const l = await list(p); texts.push(l.text); if (play === 'coworker') one = l.def; await p.context().close(); }
    const hit = texts.map(t => (t.match(/sample|mockup|\$|segment|\bARR\b|\bDX\b|dollar|confirm with Adobe/i) || [''])[0]).filter(Boolean);
    ok(texts.length === 6 && texts.every(t => t.length > 300) && !hit.length, '11. the question and the ranked lists (folds and arithmetic opened) hold no "Sample", "Mockup", dollar sign or figure, "segment" or "ARR"', hit.join());
    ok(!PAGE.includes(', which is not in this play') && PAGE.includes(' on the canvas</span>'), '11. a service that waits for a product no longer says ", which is not in this play": every play can take the product');
    ok(/Too few customers own Coworker to count them on their own, so these numbers use all [\d,]+ customers\. That makes them rough, and probably too low\./.test(one) && !/Fewer than/.test(one), '11. real table, Adobe Coworker: the one-product fall-back says "Too few customers own Coworker to count them on their own" and never "Fewer than"', one); }

  { const p = await open(); await pick(p, 'commerce'); await goal(p, ownGoal('commerce')); await add(p, 'acrobat'); await menu(p); const one = (await list(p)).def; await add(p, 'acrobatsign'); await menu(p); const two = (await list(p)).def;
    await p.evaluate(() => removeProduct('acrobat')); await add(p, 'express'); await menu(p); const plain = (await list(p)).def; await p.context().close();
    ok(one.includes(' Acrobat and Acrobat Services has no customer numbers yet, so it is not counted.') && two.includes(' These have no customer numbers yet, so they are not counted: Acrobat and Acrobat Services; Acrobat Sign.') && !two.includes('Services and Acrobat Sign')
      && plain.includes(' Adobe Express and Acrobat Sign have no customer numbers yet, so they are not counted.'),
      '11. a product whose own name holds "and" is listed after a colon ("These have no customer numbers yet, so they are not counted: Acrobat and Acrobat Services; Acrobat Sign."); other names keep "X and Y have no customer numbers yet"', [one, two, plain].map(x => x.slice(x.indexOf('too low.') + 8)).join(' | ')); }

  // ============ 12. phone and keyboard ============
  { const p = await open({table: FIX_B, w: 390, h: 844}); await pick(p, 'cja'); const bar = await p.evaluate(() => ({wide: document.documentElement.scrollWidth, add: document.getElementById('add-btn').getBoundingClientRect().right, open: !document.getElementById('add-menu').hidden}));
    await menu(p); const fitsIn = () => p.evaluate(() => { const m = document.getElementById('add-menu').getBoundingClientRect(), inner = document.getElementById('add-menu'); return {left: Math.round(m.left), right: Math.round(m.right), page: document.documentElement.scrollWidth, side: inner.scrollWidth - inner.clientWidth}; });
    const q = await fitsIn(); await goal(p, 'ai-traffic-revenue'); const r = await fitsIn(), fs2 = await p.$eval('#add-menu .rk-num', x => [getComputedStyle(x).fontSize, Math.round(x.getBoundingClientRect().right)]);
    ok(bar.wide <= 390 && bar.add <= 390 && !bar.open && [q, r].every(v => v.left >= 0 && v.right <= 390 && v.page <= 390 && v.side <= 0) && r.right - r.left === 358 && fs2[0] === '22px' && fs2[1] <= 390,
      '12. at 390 px on a ready-made play the toolbar, the question and the ranked list fit with nothing scrolling sideways; the menu is 358 px wide, does not open by itself, and the number is 22 px', JSON.stringify({bar, q, r, fs2}));
    await p.context().close(); }
  for (const w of [390, 320]) { const p = await open({w, h: 844}); await pick(p, 'cja'); await goal(p, ownGoal('cja'));
    const line = await p.evaluate(() => { document.querySelectorAll('#add-menu details').forEach(d => { d.open = true; }); const m = document.getElementById('add-menu'), hw = [...m.querySelectorAll('.rk-cnt .rk-hw')];
      return {n: hw.length, rough: [...m.querySelectorAll('.rk-cnt')].filter(x => / · Rough · How this number was worked out$/.test(x.textContent)).length, split: hw.filter(x => x.getClientRects().length !== 1 || x.querySelector('button').getBoundingClientRect().height > 24).length, side: m.scrollWidth - m.clientWidth}; });
    ok(line.n > 5 && line.rough === line.n && !line.split && line.side <= 0, `12. at ${w} px, on the real table, every count line (it ends "· Rough · How this number was worked out") keeps the dot on the same line as its link, and nothing scrolls sideways`, JSON.stringify(line));
    await p.context().close(); }
  { const p = await open({table: FIX_B}); await pick(p, 'coworker'); await goal(p, ownGoal('coworker')); const first = (await list(p)).rows[0].id;
    const labels = await p.evaluate(() => [...document.querySelectorAll('#add-menu .rk-opt')].map(x => x.getAttribute('aria-label')));
    await (await p.$('#add-menu .rk-row [data-add]')).dblclick(); await p.waitForTimeout(500); const one = await p.evaluate(() => st.on.slice());
    await (await p.$('#add-menu .rk-row [data-add]')).click(); await p.waitForTimeout(500); const two = await p.evaluate(() => st.on.length);
    ok(same(one, [first]) && two === 2, '12. a double-click on the first row adds that one product, not also the row that moves up under the pointer; a separate click then adds the next', JSON.stringify({first, one, two}));
    ok(same(labels, ['Add AEM Sites with Edge Delivery Services', 'Add AEM Sites with traditional AEM Publish']), '12. the two AEM Sites buttons are named for a screen reader: "Add AEM Sites with Edge Delivery Services" and "Add AEM Sites with traditional AEM Publish"', labels.join(' | '));
    await p.context().close(); }
  { const p = await open({table: FIX_B}); await pick(p, 'cja'); await goal(p, 'ai-traffic-revenue'); await shut(p);
    await p.focus('#add-btn'); await p.keyboard.press('Enter'); await p.waitForTimeout(250); const seen = [];
    for (let i = 0; i < 9; i++) { await p.keyboard.press('Tab'); seen.push(await p.evaluate(() => { const a = document.activeElement; return a.matches('[data-goal-ask]') ? 'Change' : a.id === 'add-find' ? 'find' : a.matches('[data-add]') ? 'add:' + a.dataset.add : a.matches('[data-how]') ? 'how:' + a.dataset.how : a.tagName === 'SUMMARY' ? 'fold' : a.tagName; })); }
    ok(seen.slice(0, 6).join() === 'Change,find,add:cw,add:eds,add:aemsites,how:eds' && seen.includes('add:target'), '12. from the keyboard, Tab walks "Change", the find box, each row\'s Add and each "How this number was worked out"', seen.join());
    await p.focus('#add-menu [data-how="target"]'); await p.keyboard.press('Enter'); await p.waitForTimeout(100); const how = await p.evaluate(() => ({open: !document.querySelector('#add-menu [data-how="target"]').closest('.rk-row').querySelector('.rk-calc').hidden, aria: document.querySelector('#add-menu [data-how="target"]').getAttribute('aria-expanded')}));
    await p.focus('#add-menu button[data-add="target"]'); const label = await p.evaluate(() => document.activeElement.getAttribute('aria-label')); await p.keyboard.press('Enter'); await p.waitForTimeout(400);
    const after = await p.evaluate(() => ({on: st.on.join(), first: document.activeElement === document.querySelector('#add-menu [data-add]'), open: !document.getElementById('add-menu').hidden}));
    await p.keyboard.press('Escape'); await p.waitForTimeout(100);
    ok(how.open && how.aria === 'true' && label === 'Add Target. Connects to the goal. Number .45, 305 of 673 customers.' && after.on === 'target' && after.first && after.open && await p.isHidden('#add-menu'),
      '12. Enter opens a number\'s arithmetic and adds a product (its button reads "Add Target. Connects to the goal. Number .45, 305 of 673 customers."); focus lands on the first row of the new list; Escape closes the menu', JSON.stringify({how, label, after}));
    await p.context().close(); }

  // ============ 13. the find box ============
  { const p = await open({table: FIX_B}); await pick(p, 'cja'); await goal(p, 'ai-traffic-revenue'); const rank = listB.rows.find(r => r.id === 'target').rank;
    await p.fill('#add-find', 'target'); await p.waitForTimeout(150); let l = await list(p);
    ok(same(l.heads, ['1 match']) && l.rows.length === 1 && l.rows[0].id === 'target' && l.rows[0].rank === rank && l.rows[0].num === '.45' && l.rows[0].why.startsWith('Connects to the goal.') && !l.folds.length && !l.rows[0].next, '13. typing "target" leaves the Target row under "1 match", with its rank, its heading\'s words and its number', JSON.stringify(l.rows));
    await p.fill('#add-find', 'analytics'); await p.waitForTimeout(150); l = await list(p);
    ok(l.heads.join() === '2 matches,Not suggested' && same(l.rows.map(r => r.id), ['ca', 'mmm']) && l.rows[0].rank < l.rows[1].rank && l.held.length === 1 && l.held[0].id === 'aa', '13. typing "analytics" lists the two matches in rank order and Adobe Analytics under "Not suggested"', JSON.stringify({heads: l.heads, rows: l.rows.map(r => r.id + ' ' + r.rank), held: l.held}));
    await p.fill('#add-find', 'coworker'); await p.waitForTimeout(150); l = await list(p); ok(l.rows.length === 1 && l.rows[0].id === 'cw' && l.rows[0].rank === 1 && !l.rows[0].next, '13. a match that is first in the list keeps its rank and hides "Next"', JSON.stringify(l.rows.map(r => [r.id, r.rank, r.next])));
    await p.fill('#add-find', 'zzqq'); await p.waitForTimeout(150); ok(await p.$eval('#add-list', x => x.textContent) === 'No product matches. Clear the box to see them all.', '13. nonsense shows "No product matches. Clear the box to see them all."');
    await p.fill('#add-find', ''); await p.waitForTimeout(150); l = await list(p); ok(l.rows.length === listB.rows.length && l.rows[0].next, '13. clearing the box brings the whole ranked list back');
    await p.context().close(); }

  ok(!errs.length, 'no script errors', errs.slice(0, 3).join(' | '));
  await b.close(); fs.rmSync(tmp, {recursive: true, force: true});
  console.log(fails ? `${fails} of ${n} CHECK(S) FAILED` : `all ${n} checks passed`); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
