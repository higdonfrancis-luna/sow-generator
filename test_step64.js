// Step 64 (Nov 10 2026, Adam's answers to canvas/research/expansion_2026-11-10/wave2/WAVE2_PROPOSAL.md): wave 2 of the catalog
// expansion, GenStudio and creative. Adobe Express, Creative Cloud, Frame.io, Workfront Planning, Firefly Creative Production,
// Firefly Custom Models and Brand Intelligence are on Create your own play and in the RFI Builder, with 55 services of their
// own and 46 more across 26 connections. The six plays on the front page are unchanged.
// Run from the repo root after python3 sow/canvas/build.py and python3 sow/build_site.py:
//   node sow/test_step64.js
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
const FILES = [R('wave2_content_tools.json'), R('wave2_firefly_family.json')];
const SEVEN = Object.fromEntries(FILES.flatMap(f => f.products).map(x => [x.id, x]));
const WANT = Object.fromEntries(FILES.flatMap(f => f.connections).map(c => [c.id, c]));
const PAIRS = Object.keys(WANT);
const LABELS = /limited availability|limited testing|coming soon|\bbeta\b|early access|early adopter|pre-release|2024\.10|2026\.07/i;
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
  const byId = Object.fromEntries(cat.products.map(x => [x.id, x])), conn = Object.fromEntries(cat.conns.map(c => [c.id, c])), seven = Object.keys(SEVEN);
  // step 66 (Nov 10 2026) added four products, 20 connections and 74 services; step 85 (Nov 12 2026) added Adobe Commerce + CRM and eight services
  // Nov 15 2026 (19b0363, the reviewed canvas, canvas/research/eds_measurement.json) added one connection, Edge Delivery Services +
  // Customer Journey Analytics (eds-cja), with one optional service of its own, EDC01 "Measure Edge Delivery page and block
  // interactions": 152 connections and 532 services, and still 34 Adobe products and 9 outside systems
  // Nov 17 2026 (Adam: "yes for both"): Brand Intelligence + Creative Cloud and Brand Intelligence + Coworker, two connections with no services: 157 connections
  ok(cat.products.length === 34 && cat.outside === 10 && cat.conns.length === 157 && Object.keys(cat.lines).length === 537 &&
    !!conn['eds-cja'] && conn['eds-cja'].a === 'eds' && conn['eds-cja'].b === 'cja' && conn['eds-cja'].lines.join() === '' && conn['eds-cja'].more.join() === 'EDC01' &&
    !!cat.lines.EDC01 && cat.lines.EDC01.name === 'Measure Edge Delivery page and block interactions',
    'the catalog holds 34 Adobe products, 10 outside systems, 157 connections and 537 services (Brand Intelligence added Creative Cloud and Coworker, with no services of their own; Coworker added two optional services, Coworker set up in an AI platform and Workfront Fusion scenarios with Coworker; Brand Intelligence added Frame.io, Firefly Creative Production and Figma, each with one optional service; step 91 added six; the reviewed canvas added Edge Delivery Services + Customer Journey Analytics with one optional service, EDC01)',
    [cat.products.length, cat.outside, cat.conns.length, Object.keys(cat.lines).length, conn['eds-cja'] && [conn['eds-cja'].a, conn['eds-cja'].b, ...conn['eds-cja'].lines, '|', ...conn['eds-cja'].more].join(' '), cat.lines.EDC01 && cat.lines.EDC01.name].join());
  ok(seven.length === 7 && seven.every(id => byId[id] && byId[id].name === SEVEN[id].name && byId[id].lines.join() === SEVEN[id].lines.filter(l => l.default).map(l => l.id).join() &&
    byId[id].more.join() === SEVEN[id].lines.filter(l => !l.default).map(l => l.id).join()), 'each of the seven products is in it with its services, starting and optional as proposed', seven.filter(id => !byId[id]).join());
  ok(seven.reduce((t, id) => t + byId[id].lines.length + byId[id].more.length, 0) === 56, 'the seven hold 56 services of their own (55 as built in step 64, and FP10 from step 65)');
  // step 65 (Nov 10 2026, Adam: "yes to both" after Adobe MAX): 3D digital twin workflows is an optional service; Ideation space, in beta, is not in the tool
  ok(byId.fireflycp.more.includes('FP10') && !byId.fireflycp.lines.includes('FP10') && /^3D digital twin workflows/.test(cat.lines.FP10.name), 'step 65: 3D digital twin workflows (FP10) is an optional service on Firefly Creative Production');
  ok(!/ideation space/i.test(JSON.stringify(cat.lines) + JSON.stringify(cat.conns)), 'step 65: Ideation space, which Adobe has in beta, is in no service');
  ok(PAIRS.length === 26 && PAIRS.every(id => conn[id] && [...conn[id].lines, ...conn[id].more].sort().join() === WANT[id].lines.map(l => l.id).sort().join()) &&
    PAIRS.reduce((t, id) => t + conn[id].lines.length + conn[id].more.length, 0) === 46, 'the 26 connections are in it, with 46 services between them', PAIRS.filter(id => !conn[id]).join());
  const theirs = cat.conns.filter(c => seven.includes(c.a) || seven.includes(c.b)).map(c => c.id);
  ok(theirs.filter(id => !/(^|-)(aa|mmeasure|acrobat|acrobatsign)(-|$)/.test(id) && !['frameio-brandintel', 'fireflycp-brandintel', 'figma-brandintel', 'creativecloud-brandintel', 'cw-brandintel'].includes(id)).length === 26 && !theirs.some(id => id.split('-').includes('bv')) && !conn['gspm-fireflycm'] && !conn['express-aemsites'] && !theirs.some(id => /cw/.test(id) && /firefly/.test(id)),
    'nothing more: none of the seven connects to Brand Visibility, GenStudio + Custom Models and Express + AEM Sites are left out, and Coworker has no Firefly line', theirs.join());
  // Nov 17 2026 (Adam: "yes for both"): Brand Intelligence + Creative Cloud and Brand Intelligence + Coworker are native, with no services of
  // their own, on Adobe's Brand validation page; the Coworker one also cites Adobe's November 10 news as a supporting reference
  const nov17 = await p.evaluate(() => ['creativecloud-brandintel', 'cw-brandintel'].map(id => CAT.connections.find(c => c.id === id) || {id, lines: [], more: [], prereqs: []}));
  ok(nov17.every(c => c.kind === 'native' && c.no_services && !c.lines.length && !c.more.length && c.availability === '' && (c.source || {}).url === 'https://business.adobe.com/products/brand-intelligence/validate.html' &&
      /so there is no separate service here\.$/.test(c.covered || '') && !!c.sowHow && c.prereqs.includes('Adobe Brand Intelligence licensed and onboarded, with the Validate add-on')) &&
    /Adobe Photoshop/.test(nov17[0].how) && (nov17[0].how || '').includes('"so teams can review content where they already work"') && (nov17[1].how || '').includes('"AI chat surfaces such as Adobe CX Coworker"') &&
    (nov17[1].references || []).some(r => r.url === 'https://news.adobe.com/news/2026/11/adobe-agentic-ai-content-supply-chain'),
    'Nov 17: Brand Intelligence connects natively to Creative Cloud (Photoshop) and to Coworker, on Adobe\'s Brand validation page and in Adobe\'s words in quotation marks, with no services of their own; the Coworker card also cites Adobe\'s news', JSON.stringify(nov17.map(c => [c.id, c.kind, c.covered])));
  ok(cat.plays.filter(x => !x.startsWith('custom')).join('|') === 'abv:bv|cja:bv+cja|commerce:bv+commerce|aem:bv+so+eds|fsi:bv+bc|coworker:cw', 'the six plays on the front page are unchanged', cat.plays.join('|'));
  ok(byId.fireflycp.name === 'Firefly Creative Production' && !cat.products.some(x => /Firefly Services/.test(x.name)), 'Firefly Creative Production is one box; Firefly Services has none of its own');

  // the voice rules of step 47, on the 26 connections
  const voice = await p.evaluate(ids => { const bare = s => /\b[Tt]he client(?![-\w])|\b[Cc]lients\b|\b[Yy]our\b(?! client)/.test(s.replace(/Your client|your client/g, '')), order = /(^|[;.(:]\s*|\bso\s+)(confirm|prove it)\b/i;
    const cs = CAT.connections.filter(c => ids.includes(c.id));
    return {card: cs.flatMap(c => [c.how, c.label, c.availability, ...(c.prereqs || []), ...(c.flows || []).map(f => f.what), c.gain && c.gain.title, c.gain && c.gain.text].filter(x => typeof x === 'string' && bare(x)).map(x => c.id + ': ' + x.slice(0, 70))),
      sow: cs.flatMap(c => [c.sowAvailability || c.availability, ...(c.sowPrereqs || c.prereqs || [])].filter(x => typeof x === 'string' && order.test(x)).map(x => c.id + ': ' + x.slice(0, 70)))}; }, PAIRS);
  ok(!voice.card.length && !voice.sow.length, 'the 26 connections keep the voice rules: "your client" on the card, conditions (not instructions) for the statement of work', JSON.stringify(voice));

  // 2. Create your own play: the menu and the seven product cards
  await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400);
  const menu = await p.evaluate(() => [...document.querySelectorAll('#add-menu details.mgrp')].map(d => [d.dataset.grp, [...d.querySelectorAll('[data-add]')].map(x => x.dataset.add)]));
  const grp = Object.fromEntries(menu);
  ok(menu.map(x => x[0]).join('|') === 'AI & agents|Content & workflows|Creativity & design|Data & analytics|Campaign management|Document productivity', 'the Add product menu has a new heading, Creativity & design, third as on Adobe\'s menu', menu.map(x => x[0]).join('|'));
  ok(grp['Creativity & design'].join() === 'creativecloud,express,fireflycp,fireflycm' && grp['AI & agents'].includes('brandintel') && grp['Content & workflows'].includes('frameio') && grp['Content & workflows'].includes('planning'),
    'Creative Cloud, Express and the two Firefly products sit under it; Brand Intelligence under AI & agents; Frame.io and Workfront Planning under Content & workflows', JSON.stringify(grp['Creativity & design']));
  ok(menu.reduce((t, x) => t + x[1].length, 0) === 34 && !grp['More products'], 'all 34 products are under a heading, none under More products');
  await p.context().close();
  const shown = [];
  for (const id of seven) { const q = await own([id]); await openCard(q, `.node[data-p="${id}"]`); const c = await readCard(q); shown.push([id, c]); await q.context().close(); }
  ok(shown.every(([id, c]) => c.rows.filter(r => !r.more).map(r => r.id).join() === byId[id].lines.join() && c.rows.filter(r => r.more).map(r => r.id).join() === byId[id].more.join()),
    'each product card lists its starting services, then its optional ones', shown.map(([id, c]) => id + ':' + c.rows.length).join());
  ok(shown.every(([id, c]) => c.links.length === c.rows.length && c.links.every(u => /^https:\/\/(experienceleague\.adobe\.com|helpx\.adobe\.com|developer\.adobe\.com|help\.frame\.io)\//.test(u))), 'every service on the seven cards links to its Adobe page',
    shown.flatMap(x => x[1].links).filter(u => !/^https:\/\/(experienceleague\.adobe\.com|helpx\.adobe\.com|developer\.adobe\.com|help\.frame\.io)\//.test(u)).slice(0, 3).join());
  const rowOf = (id, l) => shown.find(x => x[0] === id)[1].rows.find(r => r.id === l).text;
  ok(/Needs Frame\.io Enterprise: Prime/.test(rowOf('frameio', 'FR04')) && /Needs Validate add-on/.test(rowOf('brandintel', 'BN02')) && /Also needs Figma/.test(rowOf('brandintel', 'BN06')),
    'a service that needs a plan, an add-on or another tool says so in a tag (Frame.io Prime, the Validate add-on, Figma)');
  ok(/Also needs a USDZ 3D model of each product/.test(rowOf('fireflycp', 'FP10')), 'step 65: the 3D digital twin service says it needs a USDZ model of each product');
  ok(/where the plan includes Secure Sharing/.test(cat.lines.FR03.scope) && /which Frame\.io workspace each Workfront project template/.test(cat.lines.XJ15.scope), 'the two scopes Frame.io\'s help pages corrected are in (Secure Sharing by plan, the workspace a project template chooses)');

  // 3. the 26 connection cards, each on a canvas of its own two products
  const cards = {};
  for (const id of PAIRS) { const q = await own([conn[id].a, conn[id].b]); await openCard(q, `.ib[data-c="${id}"]`); cards[id] = await readCard(q); await q.context().close(); }
  ok(PAIRS.every(id => cards[id].rows.map(r => r.id).join() === [...conn[id].lines, ...conn[id].more].join()), 'each of the 26 connection cards lists its own services', PAIRS.filter(id => cards[id].rows.map(r => r.id).join() !== [...conn[id].lines, ...conn[id].more].join()).join());
  // step 86 (Nov 12 2026): availability caveats are out. Seven of the 26 keep a short factual availability line; the other 19 show none
  const AVAIL = {'frameio-workfront': 'The Frame.io viewer is the default viewer for all Workfront review and approval workflows and is included for all Workfront users.',
    'frameio-creativecloud': 'Frame.io is off by default for Creative Cloud for enterprise customers until the administrator activates it.',
    'planning-gspm': 'The GenStudio workspace appears in Workfront Planning when the company has purchased both products.',
    'aemassets-fireflycp': 'The AEM integration requires AEM as a Cloud Service, on the minimum release Adobe names on its page, and supports the Author tier only, not the Delivery tier.',
    'ajo-fireflycm': 'Creating custom Firefly models requires a Firefly ETLA agreement.',
    'workfront-brandintel': 'The AI Reviewer is not available in Sandbox environments.'};
  const availBad = PAIRS.filter(id => (conn[id].availability || '') !== (AVAIL[id] || '') || (AVAIL[id] ? !cards[id].text.includes('Availability: ' + AVAIL[id]) : /Availability:/.test(cards[id].text)));
  ok(!availBad.length && PAIRS.every(id => /BEFORE IT WORKS/i.test(cards[id].text) && /WHAT YOU GET TOGETHER/i.test(cards[id].text) && /HOW IT CONNECTS/i.test(cards[id].text)),
    'and each says what kind it is, what it needs first, what the two give together and how they connect; six show their factual availability line and the other 20 show none', availBad.join());
  ok(/Two routes\./.test(cards['frameio-aemassets'].text) && /direct export/.test(cards['frameio-aemassets'].text), 'Frame.io + AEM Assets describes both routes: through Workfront, and Frame.io\'s direct export');
  ok(!/health care|finance|sensitive data|Availability:|enabled for your client's Workfront instance by Adobe/i.test(cards['planning-cw'].text) && cards['planning-cw'].text.includes('A Workfront Standard and a Planning Standard license for each user, with both license types in the access level when your client has both a Workflow and a Planning package') &&
    cards['planning-cw'].text.includes('Coworker enabled for the organization by the main Workfront administrator') &&
    cards['planning-cw'].text.includes('The Coworker panel allowed in each user\'s access level, where it is disabled by default') && cards['planning-cw'].text.includes('The read-only and write MCP tools chosen by the Workfront administrator in System Preferences') &&
    cards['planning-cw'].text.includes('A review of every proposed action, because actions are permanent and can be irreversible'),
    'step 86: Workfront Planning + Coworker carries no industry note and no availability line, and keeps its license line and its four technical prerequisites', cards['planning-cw'].text);
  ok(/Adobe Brand Intelligence licensed and onboarded/.test(cards['workfront-brandintel'].text), 'the Workfront AI Reviewer card says Brand Intelligence is onboarded first');
  { const q = await own(['cw', 'brandintel']); await openCard(q, '.ib[data-c="cw-brandintel"]'); const c = await readCard(q); await q.context().close();
    ok(!c.rows.length && c.text.includes('Coworker\'s own services set Coworker up.') && c.text.includes('"AI chat surfaces such as Adobe CX Coworker"') && /your client/i.test(c.text) && !/Availability:|confirm/i.test(c.text),
      'Nov 17: the Brand Intelligence + Coworker card quotes Adobe, says where its work sits instead of listing services, and asks the partner to confirm nothing', c.text.slice(0, 300)); }
  const everything = [...shown.map(x => x[1].text), ...PAIRS.map(id => cards[id].text)].join('\n');
  ok(!LABELS.test(everything), 'none of the 33 cards says beta, early access, limited availability or coming soon, or gives a release number', (everything.match(LABELS) || [''])[0]);
  ok(/your client/.test(everything) && !/\bthe Client\b/.test(everything), 'the cards speak to the partner ("your client"), never in the Client\'s voice');

  // 4. the services reach the statement of work
  p = await own(['frameio', 'workfront', 'planning', 'cw']); await p.fill('#rate', '150'); await p.waitForTimeout(200);
  await p.click('#save'); await p.waitForURL('**/sow/index.html#scope', {timeout: 15000}); await p.waitForTimeout(800);
  await p.click('[data-step="services"]'); await p.waitForTimeout(500);
  const sow = await p.evaluate(() => { const row = id => state.estimates.custom['CANVAS-' + id] || {};
    return {on: ['FR01', 'XJ13', 'XJ14', 'XJ25', 'XJ32'].filter(id => row(id).on), xj13: row('XJ13').assumptions, xj32: row('XJ32').assumptions}; });
  ok(sow.on.join() === 'FR01,XJ13,XJ14,XJ25,XJ32', 'Frame.io\'s services and the Workfront, Planning and Coworker connection services arrive in the statement of work', sow.on.join());
  ok((sow.xj13 || '').includes('Availability: The Frame.io viewer is the default viewer for all Workfront review and approval workflows and is included for all Workfront users. Prerequisites for Frame.io + Workfront: ') &&
    (sow.xj13 || '').includes('; A Workfront contract that supports unified review and approval; ') && (sow.xj13 || '').includes('A Frame.io Enterprise license for uploading straight into Frame.io projects; the viewer alone needs none') &&
    !/your client|account representative checks|Adobe confirms|Adobe says|before this service starts/.test(sow.xj13 || ''),
    'step 86: the statement of work keeps the Workfront contract and the Frame.io Enterprise license as prerequisites, with no "Adobe confirms" sentence', sow.xj13);
  ok((sow.xj32 || '').includes('Prerequisites for Workfront Planning + Coworker: A Workfront Standard and a Planning Standard license for each user, with both license types in the access level when the Client has both a Workflow and a Planning package; Coworker enabled for the organization by the main Workfront administrator; The Coworker panel allowed in each user\'s access level, where it is disabled by default; ' +
    'The read-only and write MCP tools chosen by the Workfront administrator in System Preferences; A review of every proposed action, because actions are permanent and can be irreversible.') &&
    !/Availability:|health care|finance|industry|Adobe confirms|confirmed with Adobe|offered to the Client|your client/.test(sow.xj32 || ''),
    'step 86: Planning + Coworker lists its license line and its four technical prerequisites there, with no availability sentence and no industry note', sow.xj32);
  await p.click('[data-step="document"]'); await p.waitForTimeout(500);
  const doc = await p.textContent('#sow-preview');
  ok(/Unified review and approval rollout/.test(doc) && !/your client/i.test(doc) && !LABELS.test(doc), 'the statement of work lists them, never says "your client" and carries no release label', (doc.match(LABELS) || [''])[0]);
  await p.context().close();

  // 5. the RFI Builder answers questions about the seven
  const h = await openRfi();
  const r = await h.text('1. Describe how you would roll out Frame.io review and approval with Workfront.\n2. Describe your approach to implementing Adobe Express for our marketing teams.\n' +
    '3. How would you set up Firefly Creative Production to produce asset variations from AEM Assets?\n4. How would you implement Workfront Planning for our marketing calendar?\n' +
    '5. How would you implement Adobe Brand Intelligence for our brand reviews?\n6. How would you train Firefly Custom Models on our brand imagery?\n7. How would Creative Cloud connect to AEM Assets?');
  const a = r.questions.map(q => ({products: q.draft ? q.draft.products.map(x => x.id) : [], lines: q.draft ? q.draft.lines.map(x => x.id) : [], conn: q.draft ? q.draft.conn : null, uncovered: (q.draft && q.draft.uncovered) || [], plain: q.draft ? q.draft.plain : ''}));
  const dump = i => JSON.stringify(a[i] && [a[i].products, a[i].conn, a[i].lines.slice(0, 4), a[i].uncovered]);
  ok(a.length === 7 && a[0].products.includes('frameio') && a[0].products.includes('workfront') && a[0].lines.some(l => /^XJ1[3-6]$/.test(l)) && !a[0].uncovered.length, 'Frame.io with Workfront is answered from their connection, and Frame.io is no longer "not in this catalog"', dump(0));
  ok(a[1].products.join() === 'express' && a[1].lines.some(l => /^EP\d/.test(l)) && !a[1].uncovered.length, 'an Adobe Express question draws Express services', dump(1));
  ok(a[2].products.includes('fireflycp') && a[2].products.includes('aemassets') && a[2].lines.some(l => /^XK0[12]$/.test(l)) && !a[2].uncovered.length, 'Firefly Creative Production with AEM Assets, from their connection', dump(2));
  ok(a[3].products.includes('planning') && a[3].lines.some(l => /^WP\d/.test(l)), 'a Workfront Planning question draws Planning services', dump(3));
  ok(a[4].products.join() === 'brandintel' && a[4].lines.some(l => /^BN\d/.test(l)) && !a[4].products.includes('bv'), 'Brand Intelligence is its own product, not Brand Visibility', dump(4));
  ok(a[5].products.includes('fireflycm') && a[5].lines.some(l => /^FM\d/.test(l)) && !a[5].uncovered.length, 'a Firefly Custom Models question draws its services', dump(5));
  ok(a[6].products.includes('creativecloud') && a[6].products.includes('aemassets') && a[6].lines.some(l => /^XJ2[0-2]$/.test(l)), 'Creative Cloud with AEM Assets, from their connection', dump(6));
  ok(a.every(x => x.plain && !/your client|the partner/i.test(x.plain) && !LABELS.test(x.plain)), 'the drafted answers speak to the client and carry no release label');
  const r2 = await h.text('1. How would you implement Adobe Firefly for our designers?');
  const u = r2.questions[0].draft;
  ok(u && (u.uncovered || []).includes('Firefly') , 'a question about Firefly on its own still says Firefly is not in this catalog', JSON.stringify(u && [u.products.map(x => x.id), u.uncovered]));
  // Nov 17: Brand Intelligence + Coworker and Brand Intelligence + Creative Cloud have no services of their own because their work
  // sits on the two products' own services (the cards' covered line). A question that names either pair is answered from those
  // services, and the partner is not told that Experience League lists no services for the pair
  const r3 = await h.text('1. Describe how you would use Adobe Brand Intelligence with Adobe CX Enterprise Coworker so our marketers can check content against our brand guidelines.\n' +
    '2. How would our designers see Adobe Brand Intelligence checks in Creative Cloud apps such as Photoshop?');
  const bi = r3.questions.map(q => ({products: q.draft ? q.draft.products.map(x => x.id) : [], lines: q.draft ? q.draft.lines.map(x => x.id) : []})), biNotes = [];
  for (const q of r3.questions) { await h.select(q.i); biNotes.push(await h.panel()); }
  ok(bi.length === 2 && ['cw', 'brandintel'].every(id => bi[0].products.includes(id)) && ['creativecloud', 'brandintel'].every(id => bi[1].products.includes(id)) &&
    bi.every(x => x.lines.some(l => /^BN\d/.test(l))) && !biNotes.some(t => /Experience League lists no services/.test(t)),
    'Nov 17: a question that names Brand Intelligence with Coworker or with Creative Cloud is answered from their own services, with no "Experience League lists no services" note', JSON.stringify(bi) + ' ' + biNotes.map(t => t.slice(0, 200)).join(' | '));
  ok(!h.errors.length, 'no page errors in the RFI Builder', h.errors.slice(0, 2).join(' | '));
  await h.close();

  ok(!errs.length, 'no page errors', errs.slice(0, 3).join(' | '));
  console.log(fails ? `\n${fails} of ${n} STEP 64 CHECKS FAILED` : `\nALL STEP 64 CHECKS PASSED (${n})`);
  await b.close(); server.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
