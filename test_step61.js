// Step 61 (Nov 10 2026, Adam: "yes" to build AEM Forms, wave 1 of the catalog expansion, with his five answers): AEM Forms
// is a product on Create your own play with 18 services and six connections; the long tag is "Needs the Forms
// Communications add-on"; PDF form conversion stays, with its caveat; Form accessibility review is new; the two services
// AEM Forms replaces (Site forms that submit to Marketo, Site form requests into Workfront) are retired with their two
// connections, and a statement of work that used one keeps it as the partner's own service; the RFI Builder answers AEM
// Forms questions. The six plays on the front page are unchanged.
// Run from the repo root after python3 sow/canvas/build.py and python3 sow/build_site.py:
//   node sow/test_step61.js
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, 'site'), FIX = path.join(__dirname, 'qa', 'step61_fixtures');
const {open: openRfi} = require(path.join(__dirname, 'rfp_prototype', 'review_2026-11-09', 'harness.js'));
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 500) + ']')); if (!c) fails++; };
const T = {'.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript'};
const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (u.endsWith('/')) u += 'index.html';
  const f = path.join(SITE, u);
  if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, {'Content-Type': T[path.extname(f)] || 'text/plain'}); fs.createReadStream(f).pipe(res);
});
const FORMS_START = ['AF01', 'AF02', 'AF03', 'AF04', 'AF05', 'AF06', 'AF16', 'AF17'];
const FORMS_MORE = ['AF07', 'AF08', 'AF09', 'AF10', 'AF11', 'AF18', 'AF12', 'AF13', 'AF14', 'AF15'];
const PAIRS = {'aemforms-aemsites': ['AFX01', 'AFX02', 'AFX03'], 'aemforms-eds': ['AFX04', 'AFX05', 'AFX06'], 'aemforms-rtcdp': ['AFX07', 'AFX08'],
  'aemforms-marketo': ['AFX09', 'AFX10'], 'aemforms-workfront': ['AFX11', 'AFX12'], 'aemforms-cw': ['AFX13', 'AFX14', 'AFX15']};
(async () => {
  await new Promise(r => server.listen(0, r));
  const BASE = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch(), errs = [];
  const fresh = async (w = 1500, h = 1000) => { const ctx = await b.newContext({viewport: {width: w, height: h}, acceptDownloads: true}); const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); return p; };
  const addP = async (p, id) => { if (await p.isHidden('#add-menu')) await p.click('#add-btn');
    await p.$eval(`#add-menu [data-add="${id}"]`, e => { const d = e.closest('details'); if (d) d.open = true; });   // step 63: a product can sit under a closed heading
    await p.click(`#add-menu [data-add="${id}"]`); await p.waitForTimeout(300); };
  const closeAll = async p => { await p.keyboard.press('Escape'); await p.waitForTimeout(150); if (await p.isVisible('#card')) await p.click('#card [data-close]').catch(() => {}); await p.waitForTimeout(150); };
  const openCard = async (p, sel) => { await closeAll(p); await p.click(sel); await p.waitForTimeout(400);
    for (const d of await p.$$('#card details')) if (!(await d.evaluate(x => x.open))) await d.$eval('summary', s => s.click()); await p.waitForTimeout(200); };

  // 1. the catalog: one product and six connections more, the two retired services and their connections gone
  let p = await fresh(); await p.goto(BASE); await p.waitForTimeout(500);
  const cat = await p.evaluate(() => ({products: CAT.products.filter(x => !x.outside).map(x => x.id), outside: CAT.products.filter(x => x.outside).length, conns: CAT.connections.map(c => c.id), lines: Object.keys(CAT.lines),
    forms: CAT.products.find(x => x.id === 'aemforms'), plays: CAT.plays.map(x => x.id + ':' + x.products.join('+'))}));
  // step 62 (Nov 10 2026) added six products, 19 connections and 72 services to the 15, 79 and 232 this step left
  // step 64 (Nov 10 2026) added seven products, 26 connections and 101 services to the 21, 98 and 304 step 62 left
  // step 66 (Nov 10 2026) added four products, 20 connections and 74 services
  // step 85 (Nov 12 2026) added one connection (Adobe Commerce + CRM) and eight services (CE01 to CE07, XR01) to the 150 and 517
  ok(cat.products.length === 34 && cat.outside === 9 && cat.conns.length === 151 && cat.lines.length === 531, 'the catalog holds 34 Adobe products, 9 outside systems, 151 connections and 531 services (step 85 added Adobe Commerce + CRM and eight services)', [cat.products.length, cat.outside, cat.conns.length, cat.lines.length].join());
  ok(cat.forms && cat.forms.name === 'AEM Forms' && cat.forms.title === 'AEM Forms as a Cloud Service' && cat.forms.lines.join() === FORMS_START.join() && cat.forms.more.join() === FORMS_MORE.join(),
    'AEM Forms has 8 starting services and 10 optional ones, the accessibility review among them', JSON.stringify(cat.forms && [cat.forms.lines, cat.forms.more]));
  ok(Object.keys(PAIRS).every(id => cat.conns.includes(id)) && cat.conns.filter(id => /aemforms/.test(id) && id !== 'acrobatsign-aemforms').length === 6, 'it connects to six products: AEM Sites, Edge Delivery Services, Real-Time CDP, Marketo Engage, Workfront and Coworker (and, since step 66, Acrobat Sign)', cat.conns.filter(id => /aemforms/.test(id)).join());
  ok(!cat.lines.includes('XB09') && !cat.lines.includes('XB13') && !cat.conns.includes('marketo-eds') && !cat.conns.includes('workfront-eds'), 'the two retired services and their two connections are not in the catalog');
  ok(cat.plays.filter(x => !x.startsWith('custom')).join('|') === 'cja:bv+cja|commerce:bv+commerce|aem:bv+so+eds|fsi:bv+bc|abv:bv|coworker:cw' && !cat.conns.some(id => /aemforms/.test(id) && /bv/.test(id)),
    'the six plays on the front page are unchanged, and AEM Forms has no Brand Visibility connection', cat.plays.join('|'));

  // 2. Create your own play: AEM Forms in the picker, on the canvas, and its card
  await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400);
  const menu = await p.$$eval('#add-menu [data-add]', e => e.map(x => x.textContent.replace(/\s+/g, ' ').trim()));
  ok(menu.length === 34 && menu.some(t => /^AEM Forms ?Connects to 7 products$/.test(t)), 'the Add product menu lists 34 products, AEM Forms with "Connects to 7 products" (Acrobat Sign joined its six in step 66)', menu.filter(t => /Forms/.test(t)).join());
  for (const id of ['aemforms', 'aemsites', 'marketo', 'workfront', 'eds']) await addP(p, id);
  await closeAll(p); await p.fill('#rate', '150'); await p.waitForTimeout(300);
  const drawn = await p.$$eval('.ib', e => e.map(x => x.dataset.c));
  ok(['aemforms-aemsites', 'aemforms-marketo', 'aemforms-workfront', 'aemforms-eds'].every(id => drawn.includes(id)), 'on the canvas AEM Forms draws its connections to AEM Sites, Marketo Engage, Workfront and Edge Delivery Services', drawn.join());
  ok(!drawn.includes('marketo-eds') && !drawn.includes('workfront-eds'), 'and there is no line between Marketo Engage and Edge Delivery Services, or between Workfront and Edge Delivery Services');
  await openCard(p, '.node[data-p="aemforms"]');
  const card = await p.evaluate(() => ({title: document.querySelector('#card').innerText.split('\n').slice(0, 3).join(' | '),
    rows: [...document.querySelectorAll('#card .ln')].map(r => ({id: r.dataset.l, text: r.innerText.replace(/\s+/g, ' '), more: !!r.closest('details')})), text: document.querySelector('#card').innerText}));
  ok(/AEM Forms as a Cloud Service/.test(card.title) && card.rows.filter(r => !r.more).map(r => r.id).join() === FORMS_START.join() && card.rows.filter(r => r.more).map(r => r.id).join() === FORMS_MORE.join(),
    'its card is titled AEM Forms as a Cloud Service and lists the 8 starting services, then the 10 optional ones', card.title);
  const tagged = card.rows.filter(r => /Needs the Forms Communications add-on/.test(r.text)).map(r => r.id);
  ok(tagged.join() === 'AF12,AF13,AF14,AF15' && !/Document Renditions license|Forms - Communications/.test(card.text), 'the four document generation services carry the short tag "Needs the Forms Communications add-on", and the long one is gone', tagged.join());
  ok(/Form accessibility review/.test(card.rows.find(r => r.id === 'AF18').text) && /PDF form conversion to adaptive forms/.test(card.rows.find(r => r.id === 'AF10').text), 'Form accessibility review and PDF form conversion to adaptive forms are both on offer');
  ok(/Also needs Acrobat Sign Solutions/.test(card.rows.find(r => r.id === 'AF08').text) && /Also needs Adobe Analytics/.test(card.rows.find(r => r.id === 'AF09').text), 'e-signature and form analytics say which product they also need');
  ok(await p.evaluate(() => [...document.querySelectorAll('#card a.src')].every(a => /^https:\/\/(experienceleague\.adobe\.com|www\.aem\.live|helpx\.adobe\.com)\//.test(a.href))), 'every service on the card links to its Adobe page');
  // the six connection cards, each on a canvas of its own two products (a busy canvas shows one product's lines at a time)
  const cards = {};
  for (const id of Object.keys(PAIRS)) { const q = await fresh(); await q.goto(BASE); await q.waitForTimeout(400); await q.click('#picker [data-play="custom"]'); await q.waitForTimeout(400);
    for (const x of id.split('-')) await addP(q, x);
    await openCard(q, `.ib[data-c="${id}"]`);
    cards[id] = await q.evaluate(() => ({rows: [...document.querySelectorAll('#card .ln')].map(r => r.dataset.l), text: document.querySelector('#card').innerText})); await q.context().close(); }
  ok(Object.entries(PAIRS).every(([id, ls]) => cards[id].rows.join() === ls.join()), 'each of the six connection cards lists its own services', JSON.stringify(Object.fromEntries(Object.entries(cards).map(([k, v]) => [k, v.rows]))));
  // step 86 (Nov 12 2026): availability caveats are gone; only AEM Forms + Workfront keeps a factual availability line
  ok(Object.entries(cards).every(([id, c]) => /BEFORE IT WORKS/i.test(c.text) && /WHAT YOU GET TOGETHER/i.test(c.text) && !/Not stated by Adobe|Is the Forms Agentic Capability available now/i.test(c.text)
      && (id === 'aemforms-workfront' ? /Availability: For AEM Forms as a Cloud Service\./.test(c.text) : !/Availability:/.test(c.text))),
    'and each says what kind it is, what it needs first and what the two give together; only AEM Forms + Workfront has an Availability line ("For AEM Forms as a Cloud Service."), and none says "Not stated by Adobe"',
    JSON.stringify(Object.fromEntries(Object.entries(cards).map(([k, v]) => [k, (v.text.match(/Availability:[^\n]*/) || ['none'])[0]]))));
  ok(/CX Enterprise Coworker license, configured by Adobe's onboarding team/.test(cards['aemforms-cw'].text) && /A valid Experience Manager Forms license, with Forms onboarding complete/.test(cards['aemforms-cw'].text)
      && !/confirm eligibility|health care|finance organizations|through the Adobe account team|Adobe confirms/i.test(cards['aemforms-cw'].text),
    'AEM Forms + Coworker keeps the Coworker license and the AEM Forms license lines, and no longer carries the eligibility caveat (health care and finance, confirm with Adobe)', cards['aemforms-cw'].text.replace(/\s+/g, ' '));
  ok(/Workfront Fusion/.test(cards['aemforms-workfront'].text) && /Also needs Workfront Fusion/.test(cards['aemforms-workfront'].text), 'AEM Forms + Workfront says it runs through Workfront Fusion');

  // 3. the services reach the statement of work
  await openCard(p, '.node[data-p="aemforms"]');
  await p.click('#card .ln[data-l="AF10"] button.tg'); await p.waitForTimeout(200);
  await p.click('#card .ln[data-l="AF18"] button.tg'); await p.waitForTimeout(200);
  await p.click('#card .ln[data-l="AF12"] button.tg'); await p.waitForTimeout(200);
  await closeAll(p);
  await p.click('#save'); await p.waitForURL('**/sow/index.html#scope', {timeout: 15000}); await p.waitForTimeout(800);
  await p.click('[data-step="services"]'); await p.waitForTimeout(500);
  const sow = await p.evaluate(() => { const on = id => !!(state.estimates.custom['CANVAS-' + id] && state.estimates.custom['CANVAS-' + id].on), row = id => state.estimates.custom['CANVAS-' + id] || {};
    return {on: ['AF01', 'AF03', 'AF10', 'AF18', 'AF12', 'AFX01', 'AFX09', 'AFX11'].filter(on), off: ['AF07', 'AF13'].filter(on), af10: row('AF10').scope, af18: row('AF18').scope, af12: row('AF12').assumptions,
      ids: state.canvas.map(c => c.id), title: docState().title}; });
  ok(sow.on.join() === 'AF01,AF03,AF10,AF18,AF12,AFX01,AFX09,AFX11' && !sow.off.length, 'the starting services and the three turned on arrive in the statement of work; the ones left off stay off', sow.on.join());
  ok(/Foundation Components, the earlier of Adobe's two component sets for adaptive forms/.test(sow.af10 || ''), 'PDF form conversion says its forms come out on Foundation Components, the earlier component set', sow.af10);
  ok(/the Client's forms/.test(sow.af18 || '') && /WCAG or Section 508/.test(sow.af18) && !/your client/.test(sow.af18), 'the accessibility review is worded for the Client in the statement of work', sow.af18);
  ok(/Assumes the Client has the Forms Communications add-on/.test(sow.af12 || ''), 'a document generation service assumes the Forms Communications add-on in the statement of work', sow.af12);
  ok(!sow.ids.some(id => /XB09|XB13/.test(id)), 'no retired service arrives from the canvas');
  await p.click('[data-step="document"]'); await p.waitForTimeout(500);
  const doc = await p.textContent('#sow-preview');
  ok(/Adaptive form build with rules/.test(doc) && /Form accessibility review/.test(doc) && /Forms mapped and submitted to Marketo/.test(doc) && !/your client/i.test(doc), 'the statement of work lists the AEM Forms services and never says "your client"');
  await p.context().close();

  // 4. saved work from the step 60 build that used "Site forms that submit to Marketo" (on) and held "Site form requests into Workfront" (off)
  const store = JSON.parse(fs.readFileSync(path.join(FIX, 'step60_own_play_site_forms.json'), 'utf8')), old = JSON.parse(store['partner-sow-studio-v6']);
  ok(old.canvas.some(c => c.id === 'CANVAS-XB09') && old.estimates.custom['CANVAS-XB09'].on === true && old.canvas.some(c => c.id === 'CANVAS-XB13') && old.estimates.custom['CANVAS-XB13'].on === false,
    'the saved work holds both retired services: the Marketo one in use, the Workfront one only on offer');
  p = await fresh(); await p.goto(BASE + 'robots.txt');
  await p.evaluate(s => { for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, store);
  await p.goto(BASE + 'sow/index.html#services'); await p.waitForTimeout(1000);
  const kept = () => p.evaluate(() => { const c = state.custom.find(x => x.id === 'CUSTOM-XB09-custom'), r = c && state.estimates.custom[c.id];
    return {c: c && {name: c.name, scope: c.scope, basis: c.basis, stage: c.stage, base: c.base}, r: r && {on: r.on, hours: r.hours, scope: r.scope, rate: r.rate}, canvas: state.canvas.map(x => x.id), custom: state.custom.map(x => x.id),
      shown: [...document.querySelectorAll('#services-panel [data-id], #services-panel tr, #services-panel .line')].some(x => /Site forms that submit to Marketo/.test(x.textContent)), body: document.querySelector('#services-panel').innerText}; });
  let k = await kept();
  const was = old.canvas.find(c => c.id === 'CANVAS-XB09'), wasRow = old.estimates.custom['CANVAS-XB09'];
  ok(k.c && k.c.name === 'Site forms that submit to Marketo' && k.r && k.r.on === true && k.r.hours === wasRow.hours && k.r.scope === wasRow.scope, 'the service in use is kept as the partner\'s own service, with its name, hours, wording and choice', JSON.stringify(k.c));
  ok(k.c && /retired this service on November 10, 2026, so it is now your own service/.test(k.c.basis) && k.c.base === wasRow.hours && k.c.scope === was.scope, 'and it says the tool retired it and it is the partner\'s own now');
  ok(!k.canvas.some(id => /XB09|XB13/.test(id)) && k.custom.join() === 'CUSTOM-XB09-custom', 'the canvas copies of both retired services are gone, and the one only on offer is dropped', k.custom.join());
  ok(/Site forms that submit to Marketo/.test(k.body) && !/Site form requests into Workfront/.test(k.body), 'the Services step shows the kept service and not the dropped one');
  const others = await p.evaluate(() => ['CANVAS-MK01', 'CANVAS-WF01', 'CANVAS-XB01', 'CANVAS-XB03'].map(id => state.estimates.custom[id] && state.estimates.custom[id].on).join());
  ok(others === ['CANVAS-MK01', 'CANVAS-WF01', 'CANVAS-XB01', 'CANVAS-XB03'].map(id => old.estimates.custom[id].on).join(), 'every other service in the saved work is as it was', others);
  await p.reload(); await p.waitForTimeout(900); k = await kept();
  ok(k.c && k.r && k.r.on === true && k.custom.join() === 'CUSTOM-XB09-custom', 'a reload keeps it, once');
  // back through Build and forward again: the partner's own service survives the trip
  await p.click('[data-step="build"], [data-nav="build"], a[href*="index.html"]').catch(() => {}); await p.waitForTimeout(300);
  await p.goto(BASE + 'index.html'); await p.waitForTimeout(900);
  const back = await p.evaluate(() => ({nodes: [...document.querySelectorAll('.node')].map(x => x.dataset.p), conns: [...document.querySelectorAll('.ib')].map(x => x.dataset.c)}));
  ok(['marketo', 'eds', 'workfront'].every(id => back.nodes.includes(id)) && !back.conns.includes('marketo-eds') && !back.conns.includes('workfront-eds'), 'the saved canvas opens with its three products and without the two retired connections', back.conns.join());
  await p.click('#save'); await p.waitForURL('**/sow/index.html#scope', {timeout: 15000}); await p.waitForTimeout(900); k = await kept();
  ok(k.c && k.r && k.r.on === true && k.r.hours === wasRow.hours, 'after a trip through Build the kept service is still in the statement of work, turned on, with its hours');
  // the same through Open draft
  const draft = path.join(require('os').tmpdir(), 'step61-draft.json'); fs.writeFileSync(draft, JSON.stringify(old));
  const q = await fresh(); await q.goto(BASE + 'sow/index.html#services'); await q.waitForTimeout(700);
  q.on('dialog', d => d.accept());
  await q.setInputFiles('#draft-file', draft); await q.waitForTimeout(1500);
  const opened = await q.evaluate(() => ({custom: state.custom.map(x => x.id), on: state.estimates.custom['CUSTOM-XB09-custom'] && state.estimates.custom['CUSTOM-XB09-custom'].on, canvas: state.canvas.map(x => x.id)}));
  ok(opened.custom.join() === 'CUSTOM-XB09-custom' && opened.on === true && !opened.canvas.some(id => /XB09|XB13/.test(id)), 'a draft file from the step 60 build opens the same way', JSON.stringify(opened.custom));
  fs.unlinkSync(draft); await q.context().close(); await p.context().close();

  // 5. the RFI Builder answers AEM Forms questions (the harness the RFI suites use drives the page's own code)
  const h = await openRfi();
  const r = await h.text('1. Describe how you would use AEM Forms for digital account opening.\n2. How will adaptive forms submit lead data to Marketo Engage?\n3. How would Experience Manager Forms submissions start work in Workfront?');
  const a = r.questions.map(q => ({products: q.draft ? q.draft.products.map(x => x.id) : [], lines: q.draft ? q.draft.lines.map(x => x.id) : [], conn: q.draft ? q.draft.conn : null, uncovered: (q.draft && q.draft.uncovered) || [], plain: q.draft ? q.draft.plain : ''}));
  ok(a.length === 3 && a[0].products.includes('aemforms') && !a[0].products.includes('aemsites') && a[0].lines.length > 0 && a[0].lines.every(l => /^AF\d/.test(l)) && !a[0].uncovered.length,
    'a question that names AEM Forms is answered with AEM Forms services, not marked as outside the catalog and not answered as AEM Sites', JSON.stringify(a[0]).slice(0, 300));
  ok(a[1].conn === 'aemforms+marketo' && a[1].lines.some(l => ['AFX09', 'AFX10'].includes(l)), 'adaptive forms that feed Marketo Engage are answered from AEM Forms + Marketo Engage', JSON.stringify([a[1].conn, a[1].lines]));
  ok(a[2].conn === 'aemforms+workfront' && a[2].lines.some(l => ['AFX11', 'AFX12'].includes(l)), 'and a form that starts work in Workfront from AEM Forms + Workfront', JSON.stringify([a[2].conn, a[2].lines]));
  ok(a.every(x => x.plain && !/your client|the partner/i.test(x.plain)), 'the drafted answers speak to the client');
  ok(!h.errors.length, 'no page errors in the RFI Builder', h.errors.slice(0, 2).join(' | '));
  await h.close();

  // 6. a phone: the AEM Forms card fits
  p = await fresh(390, 844); await p.goto(BASE); await p.waitForTimeout(500);
  await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(500);
  await addP(p, 'aemforms'); await closeAll(p);
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1) && (await p.$$('.node[data-p="aemforms"]')).length === 1, 'on a 390-pixel phone AEM Forms sits on the canvas and the page does not scroll sideways');
  await p.context().close();

  ok(!errs.length, 'no page errors', errs.slice(0, 3).join(' | '));
  await b.close(); server.close();
  console.log(fails ? `\n${fails} of ${n} STEP 61 CHECKS FAILED` : `\nALL STEP 61 CHECKS PASSED (${n})`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
