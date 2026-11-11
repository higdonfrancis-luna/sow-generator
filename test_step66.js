// Step 66 (Nov 10 2026, Adam's answers to canvas/research/expansion_2026-11-10/wave3/WAVE3_PROPOSAL.md): wave 3 of the catalog
// expansion, cut down to what partners sell. Adobe Analytics, Marketo Measure, Acrobat and Acrobat Services, and Acrobat Sign
// are on Create your own play and in the RFI Builder, with 42 services of their own and 32 more across 20 connections.
// Audience Manager, Adobe Campaign, Adobe Advertising and AEM Guides are left out on his call, as are the Coworker cards.
// Run from the repo root after python3 sow/canvas/build.py and python3 sow/build_site.py:
//   node sow/test_step66.js
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, 'site');
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
const R = f => JSON.parse(fs.readFileSync(path.join(__dirname, 'canvas', 'research', f), 'utf8'));
const FILES = [R('wave3_data_analytics.json'), R('wave3_campaign_advertising.json'), R('wave3_documents.json')];
const FOUR = Object.fromEntries(FILES.flatMap(f => f.products).map(x => [x.id, x]));
const WANT = Object.fromEntries(FILES.flatMap(f => f.connections).map(c => [c.id, c]));
const PAIRS = Object.keys(WANT), GONE = ['aam', 'campaign', 'advertising', 'aemguides'];
const LABELS = /limited availability|limited testing|coming soon|\bbeta\b|early access|early adopter|pre-release|end of life|end-of-life|end of support/i;
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
  const own = async ids => { const p = await fresh(); await p.goto(BASE); await p.waitForTimeout(400); await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400);
    for (const id of ids) await addP(p, id); await closeAll(p); return p; };
  const readCard = p => p.evaluate(() => ({head: document.querySelector('#card').innerText.split('\n').slice(0, 3).join(' | '), text: document.querySelector('#card').innerText,
    rows: [...document.querySelectorAll('#card .ln')].map(r => ({id: r.dataset.l, text: r.innerText.replace(/\s+/g, ' '), more: !!r.closest('details')})),
    links: [...document.querySelectorAll('#card a.src')].map(a => a.href)}));

  // 1. the catalog
  let p = await fresh(); await p.goto(BASE); await p.waitForTimeout(500);
  const cat = await p.evaluate(() => ({products: CAT.products.filter(x => !x.outside), outside: CAT.products.filter(x => x.outside).length, conns: CAT.connections.map(c => ({id: c.id, a: c.a, b: c.b, lines: c.lines, more: c.more})),
    lines: CAT.lines, plays: CAT.plays.map(x => x.id + ':' + x.products.join('+'))}));
  const byId = Object.fromEntries(cat.products.map(x => [x.id, x])), conn = Object.fromEntries(cat.conns.map(c => [c.id, c])), four = Object.keys(FOUR);
  ok(cat.products.length === 34 && cat.outside === 9 && cat.conns.length === 150 && Object.keys(cat.lines).length === 517, 'the catalog holds 34 Adobe products, 9 outside systems, 150 connections and 517 services',
    [cat.products.length, cat.outside, cat.conns.length, Object.keys(cat.lines).length].join());
  ok(four.sort().join() === 'aa,acrobat,acrobatsign,mmeasure' && four.every(id => byId[id] && byId[id].name === FOUR[id].name && byId[id].lines.join() === FOUR[id].lines.filter(l => l.default).map(l => l.id).join() &&
    byId[id].more.join() === FOUR[id].lines.filter(l => !l.default).map(l => l.id).join()), 'Adobe Analytics, Marketo Measure, Acrobat and Acrobat Services, and Acrobat Sign are in it, with their services starting and optional as proposed', four.join());
  ok(four.reduce((t, id) => t + byId[id].lines.length + byId[id].more.length, 0) === 42, 'the four hold 42 services of their own');
  ok(PAIRS.length === 20 && PAIRS.every(id => conn[id] && [...conn[id].lines, ...conn[id].more].sort().join() === WANT[id].lines.map(l => l.id).sort().join()) &&
    PAIRS.reduce((t, id) => t + conn[id].lines.length + conn[id].more.length, 0) === 32, 'the 20 connections are in it, with 32 services between them', PAIRS.filter(id => !conn[id]).join());
  const theirs = cat.conns.filter(c => four.includes(c.a) || four.includes(c.b)).map(c => c.id);
  ok(theirs.length === 20 && !theirs.some(id => id.split('-').includes('bv')), 'nothing more, and none of the four connects to Brand Visibility: Adobe Analytics has no Brand Visibility line', theirs.join());
  ok(!theirs.some(id => id.split('-').includes('cw')), 'no Coworker card came with this wave ("Let\'s just skip those")');
  ok(GONE.every(id => !byId[id]) && !cat.conns.some(c => GONE.includes(c.a) || GONE.includes(c.b)), 'Audience Manager, Adobe Campaign, Adobe Advertising and AEM Guides are not in the tool, nor any connection to them');
  ok(FILES.every(f => f.left_out.some(x => /^Adam, Nov 10 2026/.test(x.why))), 'what Adam left out is on record in each research file, with his words');
  ok(cat.plays.filter(x => !x.startsWith('custom')).join('|') === 'cja:bv+cja|commerce:bv+commerce|aem:bv+so+eds|fsi:bv+bc|abv:bv|coworker:cw', 'the six plays on the front page are unchanged', cat.plays.join('|'));

  // the voice rules of step 47, on the 20 connections
  const voice = await p.evaluate(ids => { const bare = s => /\b[Tt]he client(?![-\w])|\b[Cc]lients\b|\b[Yy]our\b(?! client)/.test(s.replace(/Your client|your client/g, '')), order = /(^|[;.(:]\s*|\bso\s+)(confirm|prove it)\b/i;
    const cs = CAT.connections.filter(c => ids.includes(c.id));
    return {card: cs.flatMap(c => [c.how, c.label, c.availability, ...(c.prereqs || []), ...(c.flows || []).map(f => f.what), c.gain && c.gain.title, c.gain && c.gain.text].filter(x => typeof x === 'string' && bare(x)).map(x => c.id + ': ' + x.slice(0, 70))),
      sow: cs.flatMap(c => [c.sowAvailability || c.availability, ...(c.sowPrereqs || c.prereqs || [])].filter(x => typeof x === 'string' && order.test(x)).map(x => c.id + ': ' + x.slice(0, 70)))}; }, PAIRS);
  ok(!voice.card.length && !voice.sow.length, 'the 20 connections keep the voice rules: "your client" on the card, conditions (not instructions) for the statement of work', JSON.stringify(voice));

  // 2. Create your own play: the menu and the four product cards
  await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400);
  const menu = await p.evaluate(() => [...document.querySelectorAll('#add-menu details.mgrp')].map(d => [d.dataset.grp, [...d.querySelectorAll('[data-add]')].map(x => x.dataset.add)]));
  const grp = Object.fromEntries(menu);
  ok(menu.map(x => x[0]).join('|') === 'AI & agents|Content & workflows|Creativity & design|Data & analytics|Campaign management|Document productivity', 'the Add product menu has a sixth heading, Document productivity, last as on Adobe\'s menu', menu.map(x => x[0]).join('|'));
  ok(grp['Document productivity'].join() === 'acrobat,acrobatsign' && grp['Data & analytics'].includes('aa') && grp['Campaign management'].includes('mmeasure'),
    'Acrobat and Acrobat Sign sit under it; Adobe Analytics under Data & analytics; Marketo Measure under Campaign management');
  ok(menu.reduce((t, x) => t + x[1].length, 0) === 34 && !grp['More products'], 'all 34 products are under a heading, none under More products');
  await p.fill('#add-find', 'bizible'); await p.waitForTimeout(200);
  ok((await p.$$eval('#add-list [data-add]', a => a.map(x => x.dataset.add))).join() === 'mmeasure', 'Find a product finds Marketo Measure by its former name, Bizible');
  await p.context().close();
  const shown = [];
  for (const id of four) { const q = await own([id]); await openCard(q, `.node[data-p="${id}"]`); const c = await readCard(q); shown.push([id, c]); await q.context().close(); }
  ok(shown.every(([id, c]) => c.rows.filter(r => !r.more).map(r => r.id).join() === byId[id].lines.join() && c.rows.filter(r => r.more).map(r => r.id).join() === byId[id].more.join()),
    'each product card lists its starting services, then its optional ones', shown.map(([id, c]) => id + ':' + c.rows.length).join());
  const HOSTS = /^https:\/\/(experienceleague\.adobe\.com|helpx\.adobe\.com|developer\.adobe\.com|www\.aem\.live)\//;
  ok(shown.every(([id, c]) => c.links.length === c.rows.length && c.links.every(u => HOSTS.test(u))), 'every service on the four cards links to its Adobe page', shown.flatMap(x => x[1].links).filter(u => !HOSTS.test(u)).slice(0, 3).join());
  const rowOf = (id, l) => shown.find(x => x[0] === id)[1].rows.find(r => r.id === l).text;
  ok(/Needs PDF Services API/.test(rowOf('acrobat', 'AB04')) && /Also needs Salesforce or Microsoft Dynamics/.test(rowOf('mmeasure', 'MZ02')) && /Also needs Workday/.test(rowOf('acrobatsign', 'SG12')),
    'a service that needs a license or an outside system says so in a tag (PDF Services API, the CRM, Workday)');

  // 3. the 20 connection cards, each on a canvas of its own two products
  const cards = {};
  for (const id of PAIRS) { const q = await own([conn[id].a, conn[id].b]); await openCard(q, `.ib[data-c="${id}"]`); cards[id] = await readCard(q); await q.context().close(); }
  ok(PAIRS.every(id => cards[id].rows.map(r => r.id).join() === [...conn[id].lines, ...conn[id].more].join()), 'each of the 20 connection cards lists its own services', PAIRS.filter(id => cards[id].rows.map(r => r.id).join() !== [...conn[id].lines, ...conn[id].more].join()).join());
  ok(PAIRS.every(id => /Availability:/.test(cards[id].text) && /BEFORE IT WORKS/i.test(cards[id].text) && /WHAT YOU GET TOGETHER/i.test(cards[id].text) && /HOW IT CONNECTS/i.test(cards[id].text)),
    'and each says what kind it is, its availability, what it needs first, what the two give together and how they connect');
  ok(/A4T/.test(cards['aa-target'].text) && /Ultimate/.test(cards['mmeasure-rtcdp'].text), 'Adobe Analytics + Target is Analytics for Target, and Marketo Measure + Real-Time CDP says it is for Ultimate');
  const everything = [...shown.map(x => x[1].text), ...PAIRS.map(id => cards[id].text)].join('\n');
  ok(!LABELS.test(everything), 'none of the 24 cards says beta, early access, limited availability, coming soon or end of life', (everything.match(LABELS) || [''])[0]);
  ok(/your client/.test(everything) && !/\bthe Client\b/.test(everything), 'the cards speak to the partner ("your client"), never in the Client\'s voice');
  ok(!/Brand Visibility/.test(shown.find(x => x[0] === 'aa')[1].text + PAIRS.filter(id => /(^|-)aa(-|$)/.test(id)).map(id => cards[id].text).join('\n')), 'no Adobe Analytics card names Brand Visibility');

  // 4. the services reach the statement of work
  p = await own(['aa', 'target', 'acrobatsign', 'workfront']); await p.fill('#rate', '150'); await p.waitForTimeout(200);
  await p.click('#save'); await p.waitForURL('**/sow/index.html#scope', {timeout: 15000}); await p.waitForTimeout(800);
  await p.click('[data-step="services"]'); await p.waitForTimeout(500);
  const sow = await p.evaluate(() => { const row = id => state.estimates.custom['CANVAS-' + id] || {};
    return {on: ['AN01', 'XL01', 'XL02', 'SG01', 'XN11'].filter(id => row(id).on), xl01: row('XL01').assumptions, xn11: row('XN11').assumptions}; });
  ok(sow.on.join() === 'AN01,XL01,XL02,SG01,XN11', 'the Adobe Analytics, Acrobat Sign and connection services arrive in the statement of work', sow.on.join());
  ok(/the Client/.test(sow.xl01 || '') && !/your client/.test((sow.xl01 || '') + (sow.xn11 || '')), 'worded for the Client there', (sow.xl01 || '').slice(0, 300));
  await p.click('[data-step="document"]'); await p.waitForTimeout(500);
  const doc = await p.textContent('#sow-preview');
  ok(/A4T provisioning/i.test(doc) && !/your client/i.test(doc) && !LABELS.test(doc), 'the statement of work lists them, never says "your client" and carries no release label', (doc.match(LABELS) || [''])[0]);
  await p.context().close();

  // 5. the RFI Builder answers questions about the four, and still says what it does not cover
  const h = await openRfi();
  const r = await h.text('1. How would you set up Analytics for Target with our Adobe Analytics report suites?\n2. Describe your approach to implementing Marketo Measure with our Marketo Engage instance.\n' +
    '3. How would you roll out Acrobat Sign with Workfront for contract approvals?\n4. How would you automate document generation with Adobe Acrobat Services?\n' +
    '5. How would you implement Adobe Campaign for our email program?\n6. How would you implement Audience Manager?');
  const a = r.questions.map(q => ({products: q.draft ? q.draft.products.map(x => x.id) : [], lines: q.draft ? q.draft.lines.map(x => x.id) : [], conn: q.draft ? q.draft.conn : null, uncovered: (q.draft && q.draft.uncovered) || [], plain: q.draft ? q.draft.plain : ''}));
  const dump = i => JSON.stringify(a[i] && [a[i].products, a[i].conn, a[i].lines.slice(0, 4), a[i].uncovered]);
  ok(a.length === 6 && a[0].products.includes('aa') && a[0].products.includes('target') && a[0].lines.some(l => /^XL0[123]$/.test(l)) && !a[0].uncovered.length, 'Adobe Analytics with Target is answered from their connection, and Adobe Analytics is no longer "not in this catalog"', dump(0));
  ok(a[1].products.includes('mmeasure') && a[1].products.includes('marketo') && a[1].lines.some(l => /^XM2[89]$/.test(l)) && !a[1].uncovered.length, 'Marketo Measure with Marketo Engage, from their connection', dump(1));
  ok(a[2].products.includes('acrobatsign') && !a[2].products.includes('acrobat') && a[2].lines.some(l => /^XN1[12]$/.test(l)) && !a[2].uncovered.length, 'Acrobat Sign is its own product, not Acrobat, and is answered with Workfront', dump(2));
  ok(a[3].products.includes('acrobat') && a[3].lines.some(l => /^AB\d/.test(l)), 'an Acrobat Services question draws Acrobat services', dump(3));
  ok(a[4].uncovered.includes('Adobe Campaign') && a[5].uncovered.includes('Audience Manager'), 'Adobe Campaign and Audience Manager are still named as not in this catalog', dump(4) + dump(5));
  ok(a.slice(0, 4).every(x => x.plain && !/your client|the partner/i.test(x.plain) && !LABELS.test(x.plain)), 'the drafted answers speak to the client and carry no release label');
  ok(!h.errors.length, 'no page errors in the RFI Builder', h.errors.slice(0, 2).join(' | '));
  await h.close();

  ok(!errs.length, 'no page errors', errs.slice(0, 3).join(' | '));
  console.log(fails ? `\n${fails} of ${n} STEP 66 CHECKS FAILED` : `\nALL STEP 66 CHECKS PASSED (${n})`);
  await b.close(); server.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
