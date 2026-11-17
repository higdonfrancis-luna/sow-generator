// Step 62 (Nov 10 2026, Adam's answers to canvas/research/expansion_2026-11-10/wave1/SIX_PROPOSAL.md): the six products
// researched on Oct 30 and rechecked on Nov 10 are on Create your own play and in the RFI Builder: GenStudio for Performance
// Marketing, Content Analytics, Marketing Campaign Analytics, Real-Time CDP Collaboration, Journey Optimizer B2B Edition and
// Experimentation Accelerator, with 36 services of their own and 36 more across 19 connections. Marketing Campaign Analytics
// + Content Analytics is left out. The six plays on the front page are unchanged.
// Run from the repo root after python3 sow/canvas/build.py and python3 sow/build_site.py:
//   node sow/test_step62.js
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
const SIX = {gspm: ['GenStudio for Performance Marketing', 6, 0], ca: ['Content Analytics', 4, 2], mmm: ['Marketing Campaign Analytics', 6, 0], collab: ['Real-Time CDP Collaboration', 5, 1],
  ajob2b: ['Journey Optimizer B2B Edition', 6, 0], xa: ['Experimentation Accelerator', 5, 1]};
const PAIRS = ['rtcdp-collab', 'rtcdp-mmm', 'rtcdp-ca', 'mmm-cja', 'cja-ca', 'ca-gspm', 'workfront-gspm', 'aemassets-gspm', 'ajo-gspm', 'marketo-gspm', 'rtcdp-gspm', 'cw-gspm', 'ajo-xa', 'ajob2b-aemassets', 'ca-cw',
  'xa-target', 'ajob2b-marketo', 'ajob2b-rtcdp', 'ajob2b-target'];
const LABELS = /limited availability|limited testing|coming soon|\bbeta\b|early access|early adopter|pre-release|April 7, 2025/i;
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
  const cat = await p.evaluate(() => ({products: CAT.products.filter(x => !x.outside), outside: CAT.products.filter(x => x.outside).length, conns: CAT.connections.map(c => ({id: c.id, a: c.a, b: c.b, lines: c.lines, more: c.more, availability: c.availability || ''})),
    lines: CAT.lines, plays: CAT.plays.map(x => x.id + ':' + x.products.join('+'))}));
  const byId = Object.fromEntries(cat.products.map(x => [x.id, x])), conn = Object.fromEntries(cat.conns.map(c => [c.id, c]));
  // step 64 (Nov 10 2026) added seven products, 26 connections and 101 services to the 21, 98 and 304 this step left
  // step 66 (Nov 10 2026) added four products, 20 connections and 74 services
  // step 85 (Nov 12 2026) added Adobe Commerce + CRM and eight services (seven of Adobe Commerce's own, one on the connection)
  // the reviewed canvas (Nov 15 2026, commit 19b0363) added one connection, Edge Delivery Services + Customer Journey Analytics
  // (eds-cja), with one optional service of its own, EDC01 "Measure Edge Delivery page and block interactions": 152 and 532
  // Nov 17 2026 (Adam: "yes for both"): Brand Intelligence + Creative Cloud and Brand Intelligence + Coworker, two connections with no services: 157 connections
  ok(cat.products.length === 34 && cat.outside === 10 && cat.conns.length === 157 && Object.keys(cat.lines).length === 537 &&
    !!conn['eds-cja'] && conn['eds-cja'].a === 'eds' && conn['eds-cja'].b === 'cja' && conn['eds-cja'].lines.join() === '' && conn['eds-cja'].more.join() === 'EDC01' && !!cat.lines.EDC01,
    'the catalog holds 34 Adobe products, 10 outside systems, 157 connections and 537 services (Brand Intelligence added Creative Cloud and Coworker, with no services of their own; Coworker added two optional services, Coworker set up in an AI platform and Workfront Fusion scenarios with Coworker; Brand Intelligence added Frame.io, Firefly Creative Production and Figma, each with one optional service; step 91 added six; the reviewed canvas added Edge Delivery + Customer Journey Analytics with one service, EDC01)',
    [cat.products.length, cat.outside, cat.conns.length, Object.keys(cat.lines).length, conn['eds-cja'] && [...conn['eds-cja'].lines, '|', ...conn['eds-cja'].more].join(' ')].join());
  ok(Object.entries(SIX).every(([id, [name, a, m]]) => byId[id] && byId[id].name === name && byId[id].lines.length === a && byId[id].more.length === m), 'each of the six products is in it with its six services (starting and optional as proposed)',
    JSON.stringify(Object.keys(SIX).map(id => byId[id] && [id, byId[id].lines.length, byId[id].more.length])));
  ok(PAIRS.every(id => conn[id] && conn[id].lines.length + conn[id].more.length > 0) && PAIRS.reduce((t, id) => t + conn[id].lines.length + conn[id].more.length, 0) === 36, 'the 19 connections are in it, with 36 services between them', PAIRS.filter(id => !conn[id]).join());
  const six = Object.keys(SIX), WAVE2 = ['express', 'creativecloud', 'frameio', 'planning', 'fireflycp', 'fireflycm', 'brandintel'],   // step 64 connects three of these to the six
    theirs = cat.conns.filter(c => (six.includes(c.a) || six.includes(c.b)) && !WAVE2.includes(c.a) && !WAVE2.includes(c.b)).map(c => c.id);
  ok(theirs.length === 19 && !conn['mmm-ca'] && !conn['collab-mmm'] && !conn['collab-cja'] && !theirs.some(id => id.split('-').includes('bv')),
    'Marketing Campaign Analytics + Content Analytics is left out, as are the two Collaboration pairs Adobe does not document; none of the six connects to Brand Visibility', theirs.join());
  ok(cat.plays.filter(x => !x.startsWith('custom')).join('|') === 'abv:bv|cja:bv+cja|commerce:bv+commerce|aem:bv+so+eds|fsi:bv+bc|coworker:cw', 'the six plays on the front page are unchanged', cat.plays.join('|'));
  ok(!JSON.stringify([six.map(id => byId[id]), theirs.map(id => conn[id])]).match(/Mix Modeler(?! ?\))/) && Object.values(cat.lines).every(l => !/\bMix Modeler\b|\bMMM\b/.test(l.name + ' ' + (l.scope || ''))),
    'no service is named or scoped with Mix Modeler: the product is Marketing Campaign Analytics');

  // the voice rules of step 47, on the 19 connections: the card says "your client" (never a bare "your" or "the client"), and
  // the statement of work's availability and prerequisites are conditions, never an instruction to confirm something
  const voice = await p.evaluate(ids => { const bare = s => /\b[Tt]he client(?![-\w])|\b[Cc]lients\b|\b[Yy]our\b(?! client)/.test(s.replace(/Your client|your client/g, '')), order = /(^|[;.(:]\s*|\bso\s+)(confirm|prove it)\b/i;
    const cs = CAT.connections.filter(c => ids.includes(c.id));
    return {card: cs.flatMap(c => [c.how, c.label, c.availability, ...(c.prereqs || []), ...(c.flows || []).map(f => f.what), c.gain && c.gain.title, c.gain && c.gain.text].filter(x => typeof x === 'string' && bare(x)).map(x => c.id + ': ' + x.slice(0, 70))),
      sow: cs.flatMap(c => [c.sowAvailability || c.availability, ...(c.sowPrereqs || c.prereqs || [])].filter(x => typeof x === 'string' && order.test(x)).map(x => c.id + ': ' + x.slice(0, 70)))}; }, PAIRS);
  ok(!voice.card.length && !voice.sow.length, 'the 19 connections keep the voice rules: "your client" on the card, conditions (not instructions) for the statement of work', JSON.stringify(voice));

  // 2. Create your own play: the picker and the six product cards
  await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400);
  const menu = await p.$$eval('#add-menu [data-add]', e => e.map(x => ({id: x.dataset.add, text: x.textContent.replace(/\s+/g, ' ').trim()})));
  const deg = id => new Set(cat.conns.filter(c => (c.a === id || c.b === id) && byId[c.a] && byId[c.b]).map(c => c.a === id ? c.b : c.a)).size;
  ok(menu.length === 34 && six.every(id => { const m = menu.find(x => x.id === id); return m && m.text.includes(SIX[id][0]) && m.text.includes(`Connects to ${deg(id)} product${deg(id) === 1 ? '' : 's'}`); }),
    'the Add product menu lists 34 products, each of the six with how many products it connects to', JSON.stringify(menu.filter(x => six.includes(x.id)).map(x => x.text)));
  await p.context().close();
  const shown = [];
  for (const id of six) { const q = await own([id]); await openCard(q, `.node[data-p="${id}"]`); const c = await readCard(q); shown.push([id, c]); await q.context().close(); }
  ok(shown.every(([id, c]) => c.rows.filter(r => !r.more).map(r => r.id).join() === byId[id].lines.join() && c.rows.filter(r => r.more).map(r => r.id).join() === byId[id].more.join()),
    'each product card lists its starting services, then its optional ones', shown.map(([id, c]) => id + ':' + c.rows.length).join());
  ok(shown.every(([id, c]) => c.links.length === c.rows.length && c.links.every(u => /^https:\/\/(experienceleague\.adobe\.com|helpx\.adobe\.com|www\.aem\.live|developer\.adobe\.com)\//.test(u))), 'every service on the six cards links to its Adobe page');
  const rowOf = (id, l) => shown.find(x => x[0] === id)[1].rows.find(r => r.id === l).text;
  ok(/Also needs a cloud data source such as Amazon S3, Google Cloud Storage or Snowflake/.test(rowOf('collab', 'CO03')) && /Also needs Customer Journey Analytics or Adobe Analytics as the reporting source/.test(rowOf('xa', 'EX04')),
    'a service that needs something outside the tool says so (Collaboration\'s cloud sources, the accelerator\'s reporting source)');
  ok(/Marketing Campaign Analytics/.test(shown.find(x => x[0] === 'mmm')[1].head), 'the Marketing Campaign Analytics card carries the new name', shown.find(x => x[0] === 'mmm')[1].head);

  // 3. the 19 connection cards, each on a canvas of its own two products
  const cards = {};
  for (const id of PAIRS) { const q = await own([conn[id].a, conn[id].b]); await openCard(q, `.ib[data-c="${id}"]`); cards[id] = await readCard(q); await q.context().close(); }
  ok(PAIRS.every(id => cards[id].rows.map(r => r.id).join() === [...conn[id].lines, ...conn[id].more].join()), 'each of the 19 connection cards lists its own services', PAIRS.filter(id => cards[id].rows.map(r => r.id).join() !== [...conn[id].lines, ...conn[id].more].join()).join());
  // step 86 (Nov 12 2026): availability caveats are out of the catalog. Four of the 19 have no availability left and show no
  // Availability line; the other 15 show their own line, word for word. The Coworker eligibility caution and the "confirm it
  // with Adobe" line are gone, and the licenses and technical prerequisites beside them stay.
  const NOAVAIL = ['rtcdp-mmm', 'rtcdp-gspm', 'ajob2b-aemassets', 'ajob2b-target'], flat = s => s.replace(/\s+/g, ' ');
  const availBad = PAIRS.filter(id => conn[id].availability ? !flat(cards[id].text).includes('Availability: ' + conn[id].availability) : /Availability:/.test(cards[id].text));
  ok(PAIRS.filter(id => !conn[id].availability).join() === NOAVAIL.join() && !availBad.length &&
    flat(cards['cw-gspm'].text).includes("Availability: Your client's organization controls whether the Coworker connection is on.") &&
    flat(cards['rtcdp-collab'].text).includes('Availability: Collaboration is available to Real-Time CDP Prime and Ultimate customers in the United States, Canada, Australia, New Zealand, and Europe, the Middle East and Africa.') &&
    PAIRS.every(id => /BEFORE IT WORKS/i.test(cards[id].text) && /WHAT YOU GET TOGETHER/i.test(cards[id].text) && /HOW IT CONNECTS/i.test(cards[id].text)),
    'and each says what kind it is, what it needs first, what the two give together and how they connect; 15 show their own availability line word for word and the four with none show no Availability line',
    JSON.stringify([PAIRS.filter(id => !conn[id].availability), availBad]));
  ok(['ca-cw', 'cw-gspm'].every(id => !/confirm eligibility|health care|finance organizations|Adobe confirms/i.test(cards[id].text)) &&
    /CX Enterprise Coworker for your client's organization, with the GenStudio connection made available by the organization/.test(cards['cw-gspm'].text) &&
    /An Adobe account with access to GenStudio: the connection uses that user's identity and permissions/.test(cards['cw-gspm'].text) &&
    /Coworker Chat licensed for your client(?! through)/.test(cards['ca-cw'].text) && /Coworker Chat connected to your client's Customer Journey Analytics data views/.test(cards['ca-cw'].text),
    'the two Coworker connections carry no eligibility caution, and keep the Coworker license and access they need first');
  ok(!/confirm it with Adobe|do not say whether|standalone Content Analytics license is enough|Adobe's pages ask/i.test(cards['ca-cw'].text) &&
    flat(cards['ca-cw'].text).includes('Availability: Needs a Coworker Chat license; the content questions run on a data view configured for Content Analytics.') &&
    /The standard \(B2C\) edition of Customer Journey Analytics(?!,)/.test(cards['ca-cw'].text) && /A data view configured for Content Analytics, so the readiness and guided configuration services come first/.test(cards['ca-cw'].text),
    'Content Analytics + Coworker no longer says to confirm the license with Adobe, and still names the Coworker Chat license, the Customer Journey Analytics edition and the Content Analytics data view');
  ok(cards['ajob2b-rtcdp'].rows.every(r => /Needs Real-Time CDP B2B Edition or B2P Edition/.test(r.text)) && cards['aemassets-gspm'].rows.every(r => /Needs Content Hub on AEM Assets as a Cloud Service/.test(r.text)) &&
    /Needs Real-Time CDP Prime or Ultimate/.test(cards['rtcdp-mmm'].rows.find(r => r.id === 'XD04').text), 'the services that need a package say so in a tag (Real-Time CDP B2B Edition, Content Hub, Real-Time CDP Prime or Ultimate)');
  const everything = [...shown.map(x => x[1].text), ...PAIRS.map(id => cards[id].text)].join('\n');
  ok(!LABELS.test(everything), 'none of the 25 cards says limited availability, coming soon, beta or early access, or gives the license date', (everything.match(LABELS) || [''])[0]);
  ok(/United States, Canada, Australia, New Zealand/.test(cards['rtcdp-collab'].text), 'Collaboration\'s regions are among what it needs first');
  ok(/the client's organization|your client/.test(everything) && !/\bthe Client\b/.test(everything), 'the cards speak to the partner ("your client"), never in the Client\'s voice');

  // 4. the services reach the statement of work
  p = await own(['gspm', 'workfront', 'aemassets']); await p.fill('#rate', '150'); await p.waitForTimeout(200);
  await p.click('#save'); await p.waitForURL('**/sow/index.html#scope', {timeout: 15000}); await p.waitForTimeout(800);
  await p.click('[data-step="services"]'); await p.waitForTimeout(500);
  const sow = await p.evaluate(() => { const row = id => state.estimates.custom['CANVAS-' + id] || {};
    return {on: ['GS01', 'GS06', 'XG01', 'XG02', 'XG03', 'XG04'].filter(id => row(id).on), xg03: row('XG03').assumptions, gs01: row('GS01').scope}; });
  ok(sow.on.join() === 'GS01,GS06,XG01,XG02,XG03,XG04', 'GenStudio\'s services and its Workfront and AEM Assets connection services arrive in the statement of work', sow.on.join());
  ok(/Assumes the Client has Content Hub on AEM Assets as a Cloud Service/.test(sow.xg03 || '') && !/your client/.test((sow.xg03 || '') + (sow.gs01 || '')), 'worded for the Client there, with the package it assumes', sow.xg03);
  await p.click('[data-step="document"]'); await p.waitForTimeout(500);
  const doc = await p.textContent('#sow-preview');
  ok(/Workfront Proof approvals for GenStudio content/.test(doc) && !/your client/i.test(doc) && !LABELS.test(doc), 'the statement of work lists them, never says "your client" and carries no release label');
  await p.context().close();

  // 5. the RFI Builder answers questions about the six
  const h = await openRfi();
  const r = await h.text('1. Describe how you would implement GenStudio for Performance Marketing with Workfront approvals.\n2. How would Marketing Campaign Analytics scores be used in Customer Journey Analytics?\n' +
    '3. How would you set up Journey Optimizer B2B Edition with our Marketo Engage instance?\n4. Describe your approach to implementing Content Analytics.\n5. How would Mix Modeler help us plan budgets?');
  const a = r.questions.map(q => ({products: q.draft ? q.draft.products.map(x => x.id) : [], lines: q.draft ? q.draft.lines.map(x => x.id) : [], conn: q.draft ? q.draft.conn : null, uncovered: (q.draft && q.draft.uncovered) || [], plain: q.draft ? q.draft.plain : ''}));
  ok(a.length === 5 && a[0].conn === 'workfront+gspm' && a[0].lines.some(l => ['XG01', 'XG02'].includes(l)) && !a[0].uncovered.length, 'GenStudio with Workfront approvals is answered from their connection, and GenStudio is no longer "not in this catalog"', JSON.stringify([a[0] && a[0].conn, a[0] && a[0].lines, a[0] && a[0].uncovered]));
  ok(a[1].conn === 'mmm+cja' && a[1].lines.some(l => /^XD0[789]$/.test(l)), 'Marketing Campaign Analytics scores in Customer Journey Analytics, from their connection', JSON.stringify([a[1].conn, a[1].lines]));
  ok(a[2].products.includes('ajob2b') && !a[2].products.includes('ajo') && a[2].conn === 'ajob2b+marketo', 'Journey Optimizer B2B Edition is its own product, not Journey Optimizer, and is answered with Marketo Engage', JSON.stringify([a[2].products, a[2].conn]));
  ok(a[3].products.join() === 'ca' && a[3].lines.length > 0 && a[3].lines.every(l => /^CA\d/.test(l)), 'a Content Analytics question draws Content Analytics services', JSON.stringify([a[3].products, a[3].lines]));
  ok(a[4].products.includes('mmm') && !a[4].uncovered.length && /Marketing Campaign Analytics/.test(a[4].plain), 'a question that still says Mix Modeler is answered as Marketing Campaign Analytics', JSON.stringify([a[4].products, a[4].uncovered]));
  ok(a.every(x => x.plain && !/your client|the partner/i.test(x.plain) && !LABELS.test(x.plain)), 'the drafted answers speak to the client and carry no release label');
  ok(!h.errors.length, 'no page errors in the RFI Builder', h.errors.slice(0, 2).join(' | '));
  await h.close();

  // 5b. a canvas with every product and every outside system still opens the statement of work promptly (it took 37 seconds
  // before the scrub kept its answers), and the scrub gives the same wording however often it is asked
  p = await fresh(); await p.goto(BASE); await p.waitForTimeout(500); await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400);
  const every = await p.evaluate(() => { const c = CAT.plays.find(x => x.custom); for (const id of c.products) addProduct(id); for (const id of c.outside) addOutside(id); return c.products.length + c.outside.length; });
  await p.waitForTimeout(300); await p.fill('#rate', '150'); await p.waitForTimeout(100);
  const t0 = Date.now(); await p.click('#save'); await p.waitForURL('**/sow/index.html#scope', {timeout: 60000}); const took = Date.now() - t0;
  ok(every === 44 && took < 15000, 'a canvas with all 34 products and 10 outside systems opens the statement of work in seconds', every + ' boxes, ' + took + ' ms');
  const same = await p.evaluate(() => { const t = state.canvas.map(c => c.scope).concat(['It is in beta and is planned for release in Q3 2027.', 'https://example.com/beta']);
    const a = t.map(x => ProductCopy.scrub(x)), again = t.map(x => ProductCopy.scrub(x)); return {n: t.length, same: a.every((x, i) => x === again[i]), url: a[a.length - 1], changed: a[a.length - 2] !== t[t.length - 2]}; });
  ok(same.n > 250 && same.same && same.url === 'https://example.com/beta' && same.changed, 'the scrub answers the same for a sentence it has seen, still rewrites a release label, and still leaves a link alone', JSON.stringify(same));
  await p.context().close();

  // 6. a phone
  p = await fresh(390, 844); await p.goto(BASE); await p.waitForTimeout(500);
  await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(500);
  await addP(p, 'gspm'); await addP(p, 'ca'); await closeAll(p);
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1) && (await p.$$('.node[data-p="gspm"], .node[data-p="ca"]')).length === 2, 'on a 390-pixel phone two of the six sit on the canvas and the page does not scroll sideways');
  await p.context().close();

  ok(!errs.length, 'no page errors', errs.slice(0, 3).join(' | '));
  await b.close(); server.close();
  console.log(fails ? `\n${fails} of ${n} STEP 62 CHECKS FAILED` : `\nALL STEP 62 CHECKS PASSED (${n})`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
