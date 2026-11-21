// The Commerce round (Adam approved the pickers, Nov 19 2026): a version picker inside the Workfront box ("Bought before March 12, 2026", or
// after, the default: no Workfront Proof, so the Proof lines to GenStudio for Performance Marketing and Express fade) and inside the Adobe Commerce box (On-premises, On Cloud
// or Cloud Service, the default, which keeps today's starting services and totals); four back-office systems for Commerce (ERP, PIM, order management,
// warehouse management); Adobe Commerce Optimizer, Adobe Commerce Intelligence and Other commerce platform; the move to Commerce as a Cloud Service and
// multi-store setup. The build data is canvas/research/wave8_commerce.json, with every quote proven word for word on Adobe's pages and Adam's paste.
// States saved before this change are in qa/commerce_fixtures (made on commit ceda500). Run from the repo root after python3 canvas/build.py and
// python3 build_site.py:
//   node test_commerce_versions.js
const path = require('path'), fs = require('fs');
const {chromium} = require('playwright');
const ROOT = __dirname, ORIGIN = 'https://commerce-versions.test/', FIX = path.join(ROOT, 'qa', 'commerce_fixtures');
const {open: openRfi} = require(path.join(ROOT, 'rfp_prototype', 'review_2026-11-09', 'harness.js'));
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 700) + ']')); if (!c) fails++; };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const CAT = JSON.parse(read('canvas/catalog.json')), DATA = JSON.parse(read('canvas/research/wave8_commerce.json')), KB = JSON.parse(read('rfp_method.json'));
const TYPES = JSON.parse(read('canvas/research/connection_types.json')).connections, PASTE = read('handoff/2026-11-17/adam_pastes/2026-11-19_business_adobe_commerce_faq.md');
const P = Object.fromEntries(CAT.products.map(p => [p.id, p])), CBY = Object.fromEntries(CAT.connections.map(c => [c.id, c]));
const SYSTEMS = ['erp', 'pim', 'oms', 'wms'], NEWP = ['aco', 'cintel'], NEWOUT = [...SYSTEMS, 'ocp'];
const NEWC = DATA.connections.map(c => c.id), NEWL = [...DATA.products.flatMap(p => p.lines), ...DATA.connections.flatMap(c => c.lines || [])].map(l => l.id);
const ALLOWED = /^https:\/\/(?:experienceleague\.adobe\.com|helpx\.adobe\.com|developer\.adobe\.com|www\.adobe\.com|news\.adobe\.com|help\.frame\.io|www\.aem\.live)\//;
const LABELS = /\bbeta\b|early access|early adopter|limited availability|coming soon|\bpreview\b|not yet|roadmap|\bplanned\b|future release|confirm(?:ed|s)? (?:[\w'-]+ ){0,6}with adobe|\bask adobe\b|written confirmation|(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+(?:\d{1,2},?\s+)?20\d\d/i;
const norm = s => String(s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
const inPaste = q => { let at = 0; const t = norm(PASTE); return q.split('...').map(norm).filter(Boolean).every(part => { const i = t.indexOf(part, at); if (i < 0) return false; at = i + part.length; return true; }); };

// ============ 1. the catalog: two products, five outside systems, 13 connections and 35 services, as the build data says ============
{ ok(NEWP.every(id => P[id] && !P[id].outside) && NEWOUT.every(id => P[id] && P[id].outside && P[id].icon && P[id].systems) && P.aco.info && /Optimizer Headless/.test(P.aco.info),
    '1. Adobe Commerce Optimizer and Adobe Commerce Intelligence are Adobe products; ERP, PIM, Order management, Warehouse management and Other commerce platform are outside systems with an icon and what they cover; Commerce Optimizer\'s i names its two packages', JSON.stringify(NEWOUT.map(id => P[id] && P[id].systems)));
  ok(CAT.products.length === 54 && CAT.products.filter(p => p.outside).length === 18 && CAT.connections.length === 217 && Object.keys(CAT.lines).length === 632,
    '1. the catalog holds 54 products (18 outside systems), 217 connections and 632 services', [CAT.products.length, CAT.connections.length, Object.keys(CAT.lines).length].join());
  ok(NEWC.length === 13 && NEWC.every(id => CBY[id] && CBY[id].how && CBY[id].label && CBY[id].gain && CBY[id].sowHow && CBY[id].sowGain && CBY[id].prereqs.length >= 2 && ALLOWED.test(CBY[id].source.url) &&
      (CBY[id].flows || []).every(f => ALLOWED.test(f.source.url)) && !CBY[id].availability) && SYSTEMS.every(s => CBY['commerce-' + s] && CBY['commerce-' + s].kind === 'outside' && CBY['commerce-' + s].line === 'native'),
    '1. each of the 13 connections has its how, label, what you get, prerequisites, flows on Adobe pages, client wording and no availability line; the four back-office systems connect to Adobe Commerce as outside systems drawn as their own connections',
    NEWC.filter(id => !CBY[id] || !CBY[id].sowHow).join());
  ok(['aco-commerce', 'aco-pim', 'aco-ocp', 'aco-eds', 'aco-aemassets', 'aco-so', 'cintel-commerce', 'cintel-crm', 'cintel-ads'].every(id => CBY[id]) && CBY['aco-so'].no_services,
    '1. Commerce Optimizer connects to Adobe Commerce, the PIM, Other commerce platform, Edge Delivery Services, AEM Assets and Sites Optimizer; Commerce Intelligence to Adobe Commerce, the CRM and Ad platforms');
  ok(NEWL.length === 35 && NEWL.every(i => CAT.lines[i] && !CAT.products.concat(CAT.connections).some(o => o.lines.includes(i)) && CAT.lines[i].scope && ALLOWED.test(CAT.lines[i].url) &&
      KB.services[i] && KB.services[i].steps.length >= 3 && (KB.services[i].phrases || []).length >= 4) && !CAT.plays.some(pl => (pl.on || []).some(l => NEWL.includes(l))),
    '1. the 35 service definitions keep their original defaults, each with its scope, its Adobe page and an RFI write-up with its phrases', NEWL.filter(i => !KB.services[i]).join());
  const quotes = [...Object.values(DATA.product_evidence).flat(), ...DATA.version_evidence, ...DATA.more_evidence, ...NEWC.flatMap(id => TYPES[id].evidence),
    ...DATA.products.flatMap(p => p.lines).concat(DATA.connections.flatMap(c => c.lines || [])).map(l => ({url: l.source.url, quote: l.evidence}))];
  const paste = quotes.filter(q => /business\.adobe\.com/.test(q.url));
  ok(quotes.length > 110 && quotes.every(q => q.quote && (ALLOWED.test(q.url) || q.url === 'https://business.adobe.com/products/commerce.html')) && !quotes.some(q => /partners\.adobe\.com/.test(q.url)),
    '1. every quote behind the round sits on a page the evidence standard accepts, or on Adam\'s paste of the Adobe Commerce FAQ; none on partners.adobe.com', quotes.filter(q => !ALLOWED.test(q.url) && q.url !== 'https://business.adobe.com/products/commerce.html').map(q => q.url).join());
  ok(paste.length >= 8 && paste.every(q => inPaste(q.quote)), '1. every quote from Adam\'s paste is in it word for word', paste.filter(q => !inPaste(q.quote)).map(q => q.quote.slice(0, 60)).join(' | '));
  const shown = [...NEWP.concat(NEWOUT).flatMap(id => [P[id].name, P[id].title, P[id].systems, P[id].info]),
    ...NEWC.flatMap(id => { const c = CBY[id]; return [c.how, c.label, c.sowHow, c.sowGain, c.gain.title, c.gain.text, ...c.prereqs, ...(c.flows || []).map(f => f.what)]; }),
    ...NEWL.flatMap(i => [CAT.lines[i].name, CAT.lines[i].scope, CAT.lines[i].ext, CAT.lines[i].tier, ...KB.services[i].steps, ...KB.services[i].deliverables, ...KB.services[i].asks, KB.services[i].risk, KB.services[i].outcome]),
    ...Object.values(CAT.versions).flatMap(v => v.gates.map(g => g.reason))].filter(Boolean);
  ok(shown.length > 500 && !shown.some(t => LABELS.test(t)) && !shown.some(t => /[–—]/.test(t)), '1. no release label, date, caveat or dash in anything the round shows: names, systems, cards, services, write-ups and the reasons a version gives',
    shown.filter(t => LABELS.test(t) || /[–—]/.test(t)).slice(0, 3).join(' | '));
  ok(!!CAT.versions.commerceVersion && same(CAT.versions.workfrontVersion.gates.map(g => g.ids), [['workfront-gspm', 'express-workfront'], ['XB02']]),
    '1. the catalog holds the two pickers\' rules; Workfront bought after March 12, 2026 leaves out Workfront + GenStudio for Performance Marketing, Express + Workfront and the Marketo email proofing loop, which all run on Workfront Proof'); }

(async () => {
  const b = await chromium.launch(), errs = [];
  const context = async (w = 1440, h = 900, o = {}) => { const ctx = await b.newContext({viewport: {width: w, height: h}, acceptDownloads: true, ...o});
    await ctx.route('https://fonts.googleapis.com/**', r => r.fulfill({contentType: 'text/css', body: ''}));
    await ctx.route(ORIGIN + '**', async r => { let u = decodeURIComponent(new URL(r.request().url()).pathname); if (u.endsWith('/')) u += 'index.html';
      const f = path.join(ROOT, 'site', u); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return r.fulfill({status: 404, body: u.endsWith('robots.txt') ? 'User-agent: *' : ''}); await r.fulfill({path: f}); });
    await ctx.route('https://abvfirefly.netlify.app/**', r => r.fulfill({status: 404, body: ''}));
    return ctx; };
  const watch = p => { p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); }); return p; };
  const page = async (w, h, o) => { const p = watch(await (await context(w, h, o)).newPage()); await p.goto(ORIGIN + 'index.html'); await p.waitForFunction('window.READY===true'); return p; };
  const pick = async (p, play, rate = '150') => { await p.click(`#picker [data-play="${play}"]`); await p.waitForTimeout(450); await p.keyboard.press('Escape'); if (rate) { await p.fill('#rate', rate); await p.waitForTimeout(150); } };
  const add = (p, id) => p.evaluate(id => addProduct(id), id).then(() => p.waitForTimeout(300));
  const state = p => p.evaluate(() => ({play: st.play, on: st.on.slice(), out: st.out.slice(), n: totals().n, yr: totals().yr, dec: {...st.decisions}, lines: conns().map(c => c.id),
    gone: displayConnections().filter(c => c.members.every(m => gateOf(m.id))).map(c => c.id), faded: [...document.querySelectorAll('#edges .edge.gone')].map(e => e.dataset.c), key: document.getElementById('t-legend').innerText}));
  const choose = async (p, key, v) => { await p.selectOption(`select[data-choice="${key}"]`, v); await p.waitForTimeout(450); };
  const options = (p, key) => p.$$eval(`select[data-choice="${key}"] option`, os => os.map(o => o.textContent));
  const toSow = async p => { await p.click('#save'); await p.waitForURL('**/sow/index.html#scope', {timeout: 15000}); await p.waitForTimeout(800); await p.click('[data-step="services"]'); await p.waitForTimeout(700);
    return p.evaluate(() => ({n: selectedLines().length, total: totals().totalFee, ids: selectedLines().map(l => String(l.id).replace(/^CANVAS-/, '')), dec: JSON.parse(JSON.stringify(state.canvasDecisions[state.play]))})); };
  const back = async p => { await p.click('[data-step="build"], .tabs [data-tab="build"], a[href*="index.html"]').catch(() => {}); };

  // ============ 2. the Workfront picker ============
  { const p = await page(); await pick(p, 'custom'); for (const id of ['workfront', 'gspm', 'express']) await add(p, id);
    const first = await state(p), opts = await options(p, 'workfrontVersion'), inBox = await p.evaluate(() => { const s = document.querySelector('select[data-choice="workfrontVersion"]'), n = s && s.closest('.node');
      const a = n && n.getBoundingClientRect(), c = s && s.getBoundingClientRect(); return !!n && n.dataset.p === 'workfront' && c.left >= a.left && c.right <= a.right && c.top >= a.top && c.bottom <= a.bottom; });
    ok(same(opts, ['Bought before March 12, 2026', 'Bought after March 12, 2026']) && first.dec.workfrontVersion === 'after' && inBox && same(first.gone.sort(), ['express-workfront', 'workfront-gspm']),
      '2. the Workfront box holds its version picker inside it, "Bought before March 12, 2026" or "Bought after March 12, 2026" is picked to start and both Proof connections are faded', JSON.stringify({opts, dec: first.dec, inBox}));
    await choose(p, 'workfrontVersion', 'before'); const s0 = await state(p);
    const fees = await p.evaluate(() => ['XG01', 'XG02', 'XJ04', 'XJ05'].map(l => counted(l) ? (unitOf(l) === 'monthly' ? fee(l) * st.months : fee(l)) : 0).reduce((a, x) => a + x, 0));
    await choose(p, 'workfrontVersion', 'after'); const s1 = await state(p);
    const off = await p.evaluate(() => ['XG01', 'XG02', 'XJ04', 'XJ05'].filter(l => counted(l)));
    ok(s1.dec.workfrontVersion === 'after' && same(s1.gone.sort(), ['express-workfront', 'workfront-gspm']) && same(s1.faded.sort(), s1.gone) && !off.length && s1.yr === s0.yr - fees && s1.n === s0.n - 4 && /Not with the version picked/.test(s1.key),
      '2. bought after March 12, 2026: Workfront + GenStudio for Performance Marketing and Express + Workfront fade, their four services leave the estimate, and the key says what a faded line means', JSON.stringify({gone: s1.gone, yr: [s0.yr, s1.yr, fees], n: [s0.n, s1.n], key: s1.key}));
    await p.click('.ib[data-c="workfront-gspm"]'); await p.waitForTimeout(500);
    const card = await p.evaluate(() => ({why: (document.querySelector('#card .gone-why') || {}).textContent || '', rows: [...document.querySelectorAll('#card .ln.gone')].map(r => r.dataset.l), ticks: document.querySelectorAll('#card .ln.gone .tg').length}));
    ok(/Frame\.io viewer/.test(card.why) && /Workfront Proof/.test(card.why) && same(card.rows.sort(), ['XG01', 'XG02']) && !card.ticks,
      '2. its card says why in plain words (the Frame.io viewer, no Workfront Proof) and shows its services faded, with nothing to tick', JSON.stringify(card));
    await p.keyboard.press('Escape');
    await p.reload(); await p.waitForFunction('window.READY===true'); await p.waitForTimeout(400); const s2 = await state(p);
    ok(s2.dec.workfrontVersion === 'after' && s2.yr === s1.yr && (await p.inputValue('select[data-choice="workfrontVersion"]')) === 'after', '2. the version and the total hold through a reload', JSON.stringify(s2.dec));
    const sow = await toSow(p);
    ok(sow.dec.workfrontVersion === 'after' && !['XG01', 'XG02', 'XJ04', 'XJ05'].some(i => sow.ids.includes(i)) && sow.total === s1.yr && sow.n === s1.n,
      '2. the SOW steps keep the version and leave the four services out, with the canvas\'s total', JSON.stringify({sow, canvas: [s1.n, s1.yr]}));
    const [dl] = await Promise.all([p.waitForEvent('download', {timeout: 15000}), p.click('#save-draft')]); const file = path.join(require('os').tmpdir(), 'commerce-round-wf-draft.json'); await dl.saveAs(file);
    const q = await page(); await q.setInputFiles('#draft-file', file); await q.waitForURL(u => u.searchParams.has('synced'), {timeout: 15000}); await q.waitForFunction('window.READY===true'); await q.waitForTimeout(500);
    const s3 = await state(q);
    ok(s3.dec.workfrontVersion === 'after' && s3.yr === s1.yr && same(s3.gone.sort(), ['express-workfront', 'workfront-gspm']), '2. a draft saved with it opens in a new browser with the same version, faded lines and total', JSON.stringify(s3));
    await choose(q, 'workfrontVersion', 'before'); const s4 = await state(q);
    ok(s4.yr === s0.yr && !s4.gone.length, '2. back to bought before March 12, 2026, the lines and the total come back', JSON.stringify([s4.yr, s0.yr]));
    await add(q, 'marketo'); const mk0 = await q.evaluate(() => lineGate('XB02')); await choose(q, 'workfrontVersion', 'after');
    const mk = await q.evaluate(() => ({xb02: lineGate('XB02'), xb01: lineGate('XB01'), gone: displayConnections().filter(c => c.members.every(m => gateOf(m.id))).map(c => c.id)}));
    ok(!mk0 && /Workfront Proof/.test(mk.xb02) && !mk.xb01 && !mk.gone.includes('marketo-workfront'),
      '2. with Marketo Engage, bought after March 12, 2026 sets aside only the email proofing loop (it turns the email into a Workfront proof); Marketo + Workfront keeps its line and its other services', JSON.stringify({mk0, mk}));
    await q.context().close(); await p.context().close(); }

  // ============ 3. the Commerce picker ============
  { const p = await page(); await pick(p, 'commerce'); const s0 = await state(p), opts = await options(p, 'commerceVersion');
    const lines = () => p.evaluate(() => Object.fromEntries(['CE05', 'CE06', 'CE07', 'CE14', 'CE15', 'CE16', 'XA15'].map(l => [l, lineGate(l)])));
    ok(same(opts, ['On-premises', 'On Cloud', 'Cloud Service']) && s0.dec.commerceVersion === 'saas' && (await p.inputValue('select[data-choice="commerceVersion"]')) === 'saas',
      '3. the Commerce box holds its version picker: On-premises, On Cloud or Cloud Service, with Cloud Service picked to start', JSON.stringify({opts, dec: s0.dec}));
    const g0 = await lines();
    ok(g0.CE05 && g0.CE06 && g0.CE07 && g0.XA15 && !g0.CE14 && !g0.CE15 && g0.CE16 && /Adobe upgrades it automatically/.test(g0.CE07),
      '3. Cloud Service: Live Search setup and B2B setup give way to their smaller Cloud Service services, monthly maintenance and upgrades is not needed (Adobe upgrades it), and Audience Activation and on-premises hosting are out', JSON.stringify(g0));
    await p.dblclick('.version-offering[data-p="commerce"] .offering-title'); await p.waitForTimeout(500);
    const card = await p.evaluate(() => ({text: document.getElementById('card').innerText, gone: [...document.querySelectorAll('#card .ln.gone')].map(r => r.dataset.l)}));
    ok(/Commerce version: Cloud Service/.test(card.text) && same(card.gone.sort(), ['CE05', 'CE06', 'CE07', 'CE08', 'CE09', 'CE10', 'CE11', 'CE12', 'CE16']) && /Adobe upgrades it automatically/.test(card.text),
      '3. the Commerce card names the version and shows the services it leaves out faded, each with its reason', JSON.stringify(card.gone)); await p.keyboard.press('Escape');
    const move = () => p.evaluate(() => ['CE08', 'CE09', 'CE10', 'CE11', 'CE12'].map(l => lineGate(l)));
    const m0 = await move();
    ok(m0.every(r => /Already on Cloud Service/.test(r)), '3. Cloud Service: the five services for the move to Cloud Service step aside, since the client already runs it', JSON.stringify(m0));
    await p.evaluate(() => { st.ls.CE05 = true; st.ls.CE07 = true; render(); });
    const yS = (await state(p)).yr;
    await choose(p, 'commerceVersion', 'paas'); const s1 = await state(p), g1 = await lines();
    ok(!g1.CE05 && !g1.CE06 && !g1.CE07 && g1.CE14 && g1.CE15 && g1.CE16 && !g1.XA15 && s1.yr > yS && await p.evaluate(() => counted('CE05') && counted('CE07')),
      '3. On Cloud: the full Live Search and B2B setups and monthly maintenance count again, ticked ones in the total; the Cloud Service ones and on-premises hosting step aside', JSON.stringify({g1, yr: [yS, s1.yr]}));
    const m1 = await move(); ok(m1.every(r => !r), '3. On Cloud: the move to Cloud Service is offered', JSON.stringify(m1));
    await choose(p, 'commerceVersion', 'saas'); const carry = await p.evaluate(() => ({CE14: counted('CE14'), CE05: counted('CE05')}));
    ok(carry.CE14 && !carry.CE05, '3. moved to Cloud Service with Live Search setup ticked, the smaller search and merchandising configuration takes its place in the estimate', JSON.stringify(carry));
    await choose(p, 'commerceVersion', 'onprem'); const g2 = await lines();
    ok(!g2.CE16 && !g2.CE07 && !g2.CE05, '3. On-premises: monthly on-premises hosting operations is offered beside monthly maintenance and upgrades', JSON.stringify(g2));
    await add(p, 'eds'); const s3 = await state(p);
    ok(s3.gone.includes('commerce-eds') && await p.evaluate(() => !counted('XA18') && /Commerce Optimizer/.test(gateOf('commerce-eds'))),
      '3. Adobe Commerce on-premises with Edge Delivery Services: the storefront line fades, its services leave the estimate, and its card says it needs Cloud Service or Commerce Optimizer', JSON.stringify(s3.gone));
    await add(p, 'aco'); const s4 = await state(p);
    ok(!s4.gone.includes('commerce-eds') && await p.evaluate(() => counted('XA18') && !!lineGate('CE05') && /Optimizer/.test(lineGate('CE05'))),
      '3. with Commerce Optimizer on the canvas the storefront line comes back, and Live Search setup steps aside for Optimizer\'s search', JSON.stringify(s4.gone));
    await p.evaluate(() => removeProduct('aco')); await p.waitForTimeout(300); await choose(p, 'commerceVersion', 'paas');
    const before = await state(p); await p.reload(); await p.waitForFunction('window.READY===true'); await p.waitForTimeout(400); const after = await state(p);
    ok(after.dec.commerceVersion === 'paas' && after.yr === before.yr, '3. the version holds through a reload', JSON.stringify(after.dec));
    const sow = await toSow(p);
    ok(sow.dec.commerceVersion === 'paas' && sow.total === before.yr && !sow.ids.includes('XA18') && sow.ids.includes('CE07'), '3. the SOW steps keep the version, leave the faded storefront services out and match the canvas\'s total', JSON.stringify({sow, yr: before.yr}));
    await p.click('[data-step="document"]');
    ok((await p.textContent('#sow-preview')).includes('The Client runs Adobe Commerce on Cloud.'), '3. the statement of work names the Commerce version the client runs');
    await p.click('[data-step="scope"]');
    const [dl] = await Promise.all([p.waitForEvent('download', {timeout: 15000}), p.click('#save-draft')]); const file = path.join(require('os').tmpdir(), 'commerce-round-commerce-draft.json'); await dl.saveAs(file);
    const q = await page(); await q.setInputFiles('#draft-file', file); await q.waitForURL(u => u.searchParams.has('synced'), {timeout: 15000}); await q.waitForFunction('window.READY===true'); await q.waitForTimeout(500);
    const s5 = await state(q); ok(s5.dec.commerceVersion === 'paas' && s5.yr === before.yr && s5.gone.includes('commerce-eds'), '3. a draft saved with it opens in a new browser with the same version and total', JSON.stringify(s5));
    await q.context().close(); await p.context().close();
    // the RFI Builder is unaffected: the maintenance question still draws the monthly service
    const h = await openRfi(); const r = await h.text('1. What monthly maintenance and upgrade support do you provide for Adobe Commerce?\n2. How would you set up catalog views, search and merchandising in Adobe Commerce Optimizer?');
    const a = r.questions.map(x => x.draft ? {p: x.draft.products.map(y => y.id), l: x.draft.lines.map(y => y.id)} : null);
    ok(a[0] && a[0].l.includes('CE07') && a[1] && a[1].p.includes('aco'), '3. the RFI Builder is unaffected by the pickers: a maintenance question still draws monthly maintenance and upgrades, and it knows Commerce Optimizer by name', JSON.stringify(a));
    await h.close(); }

  // ============ 4. the four back-office systems on Brand Visibility + Adobe Commerce ============
  { const p = await page(); await pick(p, 'commerce', ''); const s = await state(p);
    ok(same(s.out, ['cdn', 'search', 'crm', 'erp', 'pim', 'oms', 'wms']) && SYSTEMS.every(x => s.lines.includes('commerce-' + x)) && s.n === 13,
      '4. Brand Visibility + Adobe Commerce starts with the ERP, PIM, order management and warehouse management on the canvas, beside the CDN, Search data and the CRM, by the on-from-the-start rule; their four main services and the CRM integration start on', JSON.stringify(s));
    const clean = await p.evaluate(() => { const boxes = [...document.querySelectorAll('.node')].map(e => e.getBoundingClientRect()), dots = [...document.querySelectorAll('.ib')].map(e => e.getBoundingClientRect());
      const hit = (a, c) => a.left < c.right && c.left < a.right && a.top < c.bottom && c.top < a.bottom; return boxes.every((a, i) => boxes.every((c, j) => i === j || !hit(a, c))) && dots.every(d => boxes.every(x => !hit(d, x))); });
    ok(clean, '4. no box or bolt overlaps another on that canvas');
    for (const x of SYSTEMS) { await p.click(`.ib[data-c="commerce-${x}"]`); await p.waitForTimeout(400);
      const card = await p.evaluate(() => ({text: document.getElementById('card').innerText, rows: [...document.querySelectorAll('#card .ln')].map(r => r.dataset.l), on: [...document.querySelectorAll('#card .ln:not(.off)')].map(r => r.dataset.l)}));
      ok(/Outside system/i.test(card.text) && /Before it works/i.test(card.text) && /starter kit/.test(card.text) && card.rows.length && card.rows.every(l => CBY['commerce-' + x].more.includes(l)) && card.on.length === 1 && !LABELS.test(card.text),
        `4. the Adobe Commerce + ${P[x].name} card: outside system, built on Adobe's integration starter kit, what comes first, the main service selected and the specialized work optional`, JSON.stringify(card.rows));
      await p.keyboard.press('Escape'); }
    const ex = await p.evaluate(() => { const c = CBY['commerce-erp']; return c.how + ' ' + c.prereqs.join(' '); });
    ok(/Adobe Exchange/.test(ex) && /SAP S\/4HANA/.test(ex) && /Dynamics 365 ERP/.test(ex) && /IBM Sterling/.test(CBY['commerce-oms'].how), '4. the ERP and order management cards name the prebuilt connectors on Adobe Exchange (SAP S/4HANA, Microsoft Dynamics 365 ERP, IBM Sterling Order Management)');
    await p.context().close(); }

  // ============ 5. Commerce Optimizer, Commerce Intelligence and Other commerce platform ============
  { const p = await page(); await pick(p, 'custom');
    await p.click('#add-btn').catch(() => {}); await p.waitForTimeout(300);
    const menu = await p.evaluate(() => [...document.querySelectorAll('#add-menu [data-add]')].map(e => e.dataset.add));
    ok(NEWP.every(id => menu.includes(id)), '5. Create your own play\'s Add product menu offers Commerce Optimizer and Commerce Intelligence', menu.join());
    await p.keyboard.press('Escape');
    for (const id of ['commerce', 'aco', 'cintel']) await add(p, id);
    const offer = await p.evaluate(() => outsideOffer());
    ok(['ocp', 'pim', 'erp', 'oms', 'wms', 'crm', 'ads'].every(x => offer.includes(x)), '5. with them on the canvas, the Add outside system menu offers Other commerce platform and the back-office systems', offer.join());
    for (const x of ['ocp', 'pim', 'crm', 'ads']) await p.evaluate(x => addOutside(x), x); await p.waitForTimeout(400);
    const s = await state(p);
    ok(['aco-commerce', 'aco-pim', 'aco-ocp', 'cintel-commerce', 'cintel-crm', 'cintel-ads', 'commerce-pim'].every(id => s.lines.includes(id)), '5. their lines draw: Optimizer to Commerce, the PIM and Other commerce platform; Intelligence to Commerce, the CRM and Ad platforms', s.lines.join());
    const gone = await p.evaluate(() => ({conn: ['ACO04', 'ACO05'].map(l => lineGate(l)), aco: counted('ACO01') || counted('ACO02') || counted('MBI02')}));
    ok(gone.conn.every(r => /Cloud Service/.test(r)) && gone.aco && same(s.gone.sort(), ['aco-commerce', 'cintel-commerce']) && same(s.faded.sort(), s.gone),
      '5. on Cloud Service the Commerce Optimizer Connector line and the Commerce Intelligence database line fade (both are for Commerce on Cloud or on-premises), while each product retains its own main services', JSON.stringify({gone, lines: s.gone}));
    await p.click('.ib[data-c="aco-commerce"]'); await p.waitForTimeout(400);
    const why = await p.evaluate(() => (document.querySelector('#card .gone-why') || {}).textContent || ''); await p.keyboard.press('Escape');
    await p.click('.ib[data-c="cintel-commerce"]'); await p.waitForTimeout(400);
    const why2 = await p.evaluate(() => (document.querySelector('#card .gone-why') || {}).textContent || ''); await p.keyboard.press('Escape');
    ok(/Commerce on Cloud or on-premises/.test(why) && /Commerce on Cloud and on-premises/.test(why2), '5. each of their cards says why at the top', JSON.stringify([why, why2]));
    await p.dblclick('.node[data-p="aco"]'); await p.waitForTimeout(400);
    const card = await p.evaluate(() => document.getElementById('card').innerText);
    ok(/Search, recommendations and merchandising in Commerce Optimizer/.test(card) && !LABELS.test(card), '5. the Commerce Optimizer card lists its services, with no caveat', card.slice(0, 400));
    await p.keyboard.press('Escape');
    await choose(p, 'commerceVersion', 'paas'); const sp = await state(p);
    ok(!sp.gone.length, '5. On Cloud: both lines are drawn and available', JSON.stringify(sp.gone));
    for (const x of ['erp', 'oms', 'wms']) await p.evaluate(x => addOutside(x), x);
    const ov = await p.evaluate(() => { for (const l of ['CE11', 'XR02', 'XR05', 'XR06', 'XR08']) st.ls[l] = true; render(); return {ce11: overlapsOn('CE11'), xr08: overlapsOn('XR08'), xr05: overlapsOn('XR05')}; });
    ok(same(ov.ce11, ['XA18', 'XR02', 'XR05', 'XR06', 'XR08'].filter(l => ov.ce11.includes(l))) && ['XR02', 'XR05', 'XR06', 'XR08'].every(l => ov.ce11.includes(l)) && same(ov.xr08, ['XR06', 'XR02']) && same(ov.xr05, ['XR02']),
      '5. the integrations rebuilt for the move overlap the ERP, PIM, order management and warehouse integrations, and those overlap each other where they move the same data; all count and the SOW steps ask how they differ', JSON.stringify(ov));
    await p.evaluate(() => { for (const l of ['CE11', 'XR02', 'XR05', 'XR06', 'XR08']) delete st.ls[l]; render(); }); await p.context().close();
    const q = await page(); await pick(q, 'commerce');
    const ranked = await q.evaluate(() => { st.goal = (PROBS.find(x => x.play === 'commerce') || PROBS[0]).id; const R = rankRows(); delete st.goal; return R.rows.map(r => r.id); });
    ok(NEWP.every(id => ranked.includes(id)) && !ranked.some(id => P[id].outside), '5. the ranked Add product list on Brand Visibility + Adobe Commerce lists both new products, Adobe products only', ranked.join());
    const held = await q.evaluate(() => { st.on.push('cja'); const h = heldBy('aa'); st.on.pop(); return h; });
    ok(held === 'cja', '5. the never go backwards rules still hold: Customer Journey Analytics holds Adobe Analytics back', held);
    await q.context().close(); }

  // ============ 6. the map at the bottom of the first page ============
  { const p = await page(); await p.evaluate(() => document.getElementById('picker-map').scrollIntoView());
    const node = await p.$('#knowledge-model-section .wke-node[data-id="aco"]');
    ok(!!node, '6. the product map at the bottom of the first page has Commerce Optimizer');
    if (node) { await node.click(); await p.waitForTimeout(400);
      const panel = await p.evaluate(() => document.querySelector('#knowledge-model-section .wke-inspector').innerText);
      ok(/Commerce Optimizer/.test(panel) && /Other commerce platform/.test(panel) && /PIM/.test(panel), '6. clicking it lists what it connects to, Other commerce platform and the PIM among them', panel.slice(0, 300)); }
    await p.context().close(); }

  // ============ 7. states saved before this change reopen the same ============
  { const BEFORE = JSON.parse(fs.readFileSync(path.join(FIX, 'before.json'), 'utf8')), got = {};
    const WANT = {saved_commerce_paas: ['paas', 'before'], saved_commerce_eds: ['saas', 'before'], saved_commerce_mixed: ['', 'before'], saved_workfront: ['saas', 'before']};
    for (const k of Object.keys(WANT)) { const store = JSON.parse(fs.readFileSync(path.join(FIX, k + '.json'), 'utf8')), ctx = await context(), p = watch(await ctx.newPage());
      await p.goto(ORIGIN + 'robots.txt'); await p.evaluate(s => { for (const [x, v] of Object.entries(s)) if (v !== null) localStorage.setItem(x, v); }, store);
      await p.goto(ORIGIN + 'index.html'); await p.waitForFunction('window.READY===true'); await p.waitForTimeout(400); const c = await state(p);
      const sel = await p.$$eval('select[data-choice="commerceVersion"] option', os => os.map(o => o.textContent)).catch(() => []);
      c.wait = await p.evaluate(() => ['CE08', 'CE14', 'CE15', 'CE16'].map(l => lineGate(l)));
      await p.goto(ORIGIN + 'sow/index.html#services'); await p.waitForTimeout(1200);
      const s = await p.evaluate(() => ({n: selectedLines().length, total: totals().totalFee}));
      got[k] = {c, s, sel}; await ctx.close(); }
    const sameState = k => { const was = BEFORE[k], now = got[k]; return now && same(now.c.on, was.canvas.on) && same(now.c.out, was.canvas.out) && now.c.n === was.canvas.n && now.c.yr === was.canvas.yr && now.s.n === was.sow.n && now.s.total === was.sow.total; };
    ok(Object.keys(WANT).every(sameState), '7. canvases and SOW states saved before this change (the Commerce play with Live Search, B2B and monthly maintenance; Commerce with Edge Delivery Services; both together with Audience Activation; Workfront with GenStudio and Express) reopen with the same products, outside systems, services and totals',
      JSON.stringify(Object.fromEntries(Object.keys(got).map(k => [k, {now: [got[k].c.out, got[k].c.n, got[k].c.yr, got[k].s.n, got[k].s.total], was: [BEFORE[k].canvas.out, BEFORE[k].canvas.n, BEFORE[k].canvas.yr, BEFORE[k].sow.n, BEFORE[k].sow.total]}]))));
    ok(Object.entries(WANT).every(([k, [cv, wv]]) => got[k].c.dec.commerceVersion === cv && got[k].c.dec.workfrontVersion === wv),
      '7. each takes the version that keeps its services: On Cloud for the one with monthly maintenance, Cloud Service for the storefront on Edge Delivery Services, Workfront bought before March 12, 2026; where no version keeps everything, none is picked yet',
      JSON.stringify(Object.fromEntries(Object.keys(got).map(k => [k, got[k].c.dec]))));
    ok(same(got.saved_commerce_mixed.sel, ['Choose a version', 'On-premises', 'On Cloud', 'Cloud Service']), '7. that canvas asks for a version in the box ("Choose a version") and changes nothing until one is picked', JSON.stringify(got.saved_commerce_mixed.sel));
    ok(got.saved_commerce_mixed.c.wait.every(r => /Pick the Commerce version on the box first/.test(r)), '7. until then, the new services that depend on the version wait for one', JSON.stringify(got.saved_commerce_mixed.c.wait));
    const p = watch(await (await context()).newPage()); await p.goto(ORIGIN + 'index.html'); await p.waitForFunction('window.READY===true');
    await p.setInputFiles('#draft-file', path.join(FIX, 'draft_commerce.json')); await p.waitForURL(u => u.searchParams.has('synced'), {timeout: 15000});
    await p.waitForFunction('window.READY===true'); await p.waitForTimeout(400); const c = await state(p);
    await p.goto(ORIGIN + 'sow/index.html#services'); await p.waitForTimeout(1200);
    const s = await p.evaluate(() => ({n: selectedLines().length, total: totals().totalFee})), was = BEFORE.draft_commerce;
    ok(same(c.out, was.canvas.out) && c.n === was.canvas.n && c.yr === was.canvas.yr && s.n === was.sow.n && s.total === was.sow.total && c.dec.commerceVersion === 'paas',
      '7. a draft saved before this change (the Commerce play) opens with the same outside systems, services and total, on Build and on the SOW steps, as On Cloud', JSON.stringify({c, s, was}));
    await p.context().close(); }

  // ============ 8. on a phone ============
  { const p = await page(390, 844, {isMobile: true, hasTouch: true}); await pick(p, 'commerce');
    const fit = await p.evaluate(() => { const s = document.querySelector('select[data-choice="commerceVersion"]'), n = s.closest('.node'), a = n.getBoundingClientRect(), c = s.getBoundingClientRect();
      return c.left >= a.left && c.right <= a.right && c.bottom <= a.bottom + 1 && parseFloat(getComputedStyle(s).minHeight) >= 40; });
    ok(fit, '8. on a phone the Commerce picker sits inside its box and is as tall to tap as Page authoring\'s (40 px before the map is scaled to fit)');
    await p.context().close(); }

  // ============ 9. starting services on new quotes and the older quote defaults ============
  {
    const p = await page(); await pick(p, 'cja');
    const cja = await p.evaluate(() => ({on: all(P.cja).filter(counted), connection: counted('C01')}));
    ok(!cja.on.length && cja.connection, '9. the CJA cross-sell starts without CJA product services and keeps its Brand Visibility connection', JSON.stringify(cja));
    const sow = await toSow(p);
    ok(sow.ids.includes('C01') && ![...P.cja.lines, ...P.cja.more].some(id => sow.ids.includes(id)), '9. the cross-sell selections carry to the SOW', JSON.stringify(sow.ids));
    await p.context().close();

    const q = await page(); await pick(q, 'custom');
    for (const id of ['cja', 'commerce', 'aemsites', 'aemassets', 'gspm', 'express', 'fireflycm', 'brandintel', 'workfront', 'marketo']) await add(q, id);
    await q.evaluate(() => addOutside('figma'));
    await choose(q, 'sitesDeployment', 'cloud');
    const selected = await q.evaluate(() => ({
      main: ['C06', 'CJ01', 'CJ02', 'CE01', 'CE02', 'CE03', 'CE14', 'XT01', 'XT03', 'XT04', 'XT05', 'XT06', 'XT07', 'XF01', 'XF02', 'XF03', 'XF04', 'XF05', 'XF06', 'XK16'].filter(id => !counted(id)),
      optional: ['CJ03', 'CJ06', 'CE13', 'CE15'].filter(counted)
    }));
    ok(!selected.main.length && !selected.optional.length, '9. new implementations select the main setup, Figma and assistant services while keeping specialized work optional', JSON.stringify(selected));
    await choose(q, 'commerceVersion', 'paas');
    ok(await q.evaluate(() => counted('CE05') && !counted('CE06') && !['CE08', 'CE09', 'CE10', 'CE11', 'CE12'].some(counted)), '9. B2B and the Cloud Service migration remain optional on Commerce on Cloud');
    await q.context().close();

    const legacy = await page();
    await legacy.evaluate(() => localStorage.setItem(KEY, JSON.stringify({
      play: 'cja', on: [], out: ['cdn'], ls: {}, decisions: {workfrontVersion:'before',commerceVersion:'saas'},
      selectionVersion: 1, combinedDefaultsVersion: 1, rate: 150, v: 2
    })));
    await legacy.reload(); await legacy.waitForFunction('window.READY===true');
    ok(await legacy.evaluate(() => counted('C06') && !counted('CJ01') && !counted('XT01')), '9. the last release’s saved cross-sell uses its original selections');
    const oldSow = await toSow(legacy);
    ok(oldSow.ids.includes('C06') && !oldSow.ids.includes('CJ01'), '9. opening that saved quote through Services keeps its selections');
    await legacy.context().close();
  }

  // ============ 10. Optimizer storefront on a third-party commerce backend ============
  {
    const p = await page(); await pick(p, 'custom');
    for (const id of ['aco', 'eds']) await add(p, id);
    const selected = () => p.evaluate(() => ['ACO09', 'ACO11', 'ACO12'].filter(counted));
    ok(same(await selected(), ['ACO09']), '10. the third-party storefront services wait for a backend');
    await p.evaluate(() => showCard('c', 'aco-eds'));
    await p.locator('#card [data-l="ACO11"] [data-addp="ocp"]').click();
    ok(same(await selected(), ['ACO09', 'ACO11']), '10. a third-party storefront gets launch work when the backend is attached');
    await add(p, 'cja');
    ok(same(await selected(), ['ACO09', 'ACO11', 'ACO12']), '10. storefront analytics joins once an Experience Platform application is on the canvas');
    const sow = await toSow(p);
    ok(['ACO11', 'ACO12'].every(id => sow.ids.includes(id) && KB.services[id]), '10. both services carry into the SOW and have RFI methods', JSON.stringify(sow.ids));
    await p.click('[data-step="document"]');
    const document = await p.textContent('#sow-preview');
    ok(/Optimizer storefront SEO and launch checklist/.test(document) && /Optimizer storefront events to Experience Platform/.test(document)
      && !/The Client runs Adobe Commerce/.test(document), '10. an Optimizer-only storefront SOW names its services without assuming an Adobe Commerce backend');
    await p.context().close();
  }

  ok(!errs.length, 'no script errors on the canvas or the SOW steps', errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(fails ? `\n${fails} of ${n} COMMERCE ROUND CHECKS FAILED` : `\nALL ${n} COMMERCE ROUND CHECKS PASSED`);
  process.exit(fails ? 1 : 0);
})();
