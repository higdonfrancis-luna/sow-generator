// Step 71 (Nov 11 2026, Adam: "looks great, yes" to sow/mockups/nov10_wave4/wave4_cards.png and the recommendations in
// canvas/research/expansion_2026-11-10/wave4/WAVE4_PROPOSAL.md): the Marketo family. Marketo Qualifier and Marketo Optimizer
// are on Create your own play and in the RFI Builder, with 21 services of their own and 16 more across six connections.
// Run from the repo root after python3 sow/canvas/build.py and python3 sow/build_site.py:
//   node sow/test_step71.js
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
const FILES = [R('wave4_marketo_qualifier.json'), R('wave4_marketo_optimizer.json')];
const FOUR = Object.fromEntries(FILES.flatMap(f => f.products).map(x => [x.id, x]));
const WANT = Object.fromEntries(FILES.flatMap(f => f.connections).map(c => [c.id, c]));
const PAIRS = Object.keys(WANT), OUT = ['crm', 'ads'];
const LABELS = /limited availability|limited testing|coming soon|\bbeta\b|\blabs\b|early access|early adopter|pre-release|general availability|end of life|end-of-life|end of support/i;
(async () => {
  await new Promise(r => server.listen(0, r));
  const BASE = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch(), errs = [];
  const fresh = async (w = 1500, h = 1000) => { const ctx = await b.newContext({viewport: {width: w, height: h}, acceptDownloads: true}); const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); return p; };
  const addP = async (p, id) => { if (await p.isHidden('#add-menu')) await p.click('#add-btn');
    await p.$eval(`#add-menu [data-add="${id}"]`, e => { const d = e.closest('details'); if (d) d.open = true; });   // step 63: a product can sit under a closed heading
    await p.click(`#add-menu [data-add="${id}"]`); await p.waitForTimeout(300); };
  const addO = async (p, id) => { await p.keyboard.press('Escape'); await p.click('#out-btn'); await p.waitForTimeout(250); await p.click(`#out-menu [data-out="${id}"]`); await p.waitForTimeout(300); };
  const closeAll = async p => { await p.keyboard.press('Escape'); await p.waitForTimeout(150); if (await p.isVisible('#card')) await p.click('#card [data-close]').catch(() => {}); await p.waitForTimeout(150); };
  const openCard = async (p, sel) => { await closeAll(p); await p.click(sel); await p.waitForTimeout(400);
    for (const d of await p.$$('#card details')) if (!(await d.evaluate(x => x.open))) await d.$eval('summary', s => s.click()); await p.waitForTimeout(200); };
  const own = async ids => { const p = await fresh(); await p.goto(BASE); await p.waitForTimeout(400); await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400);
    for (const id of [...ids].sort((x, y) => OUT.includes(x) - OUT.includes(y))) await (OUT.includes(id) ? addO(p, id) : addP(p, id));   // an outside system is offered once a product it connects to is on the canvas
    await closeAll(p); return p; };
  const readCard = p => p.evaluate(() => ({head: document.querySelector('#card').innerText.split('\n').slice(0, 3).join(' | '), text: document.querySelector('#card').innerText,
    rows: [...document.querySelectorAll('#card .ln')].map(r => ({id: r.dataset.l, text: r.innerText.replace(/\s+/g, ' '), more: !!r.closest('details')})),
    links: [...document.querySelectorAll('#card a.src')].map(a => a.href)}));

  // 1. the catalog
  let p = await fresh(); await p.goto(BASE); await p.waitForTimeout(500);
  const cat = await p.evaluate(() => ({products: CAT.products.filter(x => !x.outside), outside: CAT.products.filter(x => x.outside).length, conns: CAT.connections.map(c => ({id: c.id, a: c.a, b: c.b, lines: c.lines, more: c.more})),
    lines: CAT.lines, plays: CAT.plays.map(x => x.id + ':' + x.products.join('+'))}));
  const byId = Object.fromEntries(cat.products.map(x => [x.id, x])), conn = Object.fromEntries(cat.conns.map(c => [c.id, c])), four = Object.keys(FOUR);
  ok(cat.products.length === 34 && cat.outside === 9 && cat.conns.length === 151 && Object.keys(cat.lines).length === 525, 'the catalog holds 34 Adobe products, 9 outside systems, 151 connections and 525 services (steps 85 and 86)',
    [cat.products.length, cat.outside, cat.conns.length, Object.keys(cat.lines).length].join());
  ok(four.sort().join() === 'moptimizer,mqualifier' && four.every(id => byId[id] && byId[id].name === FOUR[id].name && byId[id].lines.join() === FOUR[id].lines.filter(l => l.default).map(l => l.id).join() &&
    byId[id].more.join() === FOUR[id].lines.filter(l => !l.default).map(l => l.id).join()), 'Marketo Qualifier and Marketo Optimizer are in it, with their services starting and optional as proposed', four.join());
  ok(byId.mqualifier.lines.length + byId.mqualifier.more.length === 8 && byId.moptimizer.lines.length + byId.moptimizer.more.length === 13, 'Marketo Qualifier holds 8 services of its own and Marketo Optimizer 13');
  ok(PAIRS.sort().join() === 'crm-mqualifier,moptimizer-ads,moptimizer-cw,moptimizer-marketo,mqualifier-bc,mqualifier-marketo' && PAIRS.every(id => conn[id] && [...conn[id].lines, ...conn[id].more].sort().join() === WANT[id].lines.map(l => l.id).sort().join()) &&
    PAIRS.reduce((t, id) => t + conn[id].lines.length + conn[id].more.length, 0) === 16, 'the six connections are in it, with 16 services between them', PAIRS.join());
  const theirs = cat.conns.filter(c => four.includes(c.a) || four.includes(c.b)).map(c => c.id);
  ok(theirs.length === 6 && !cat.conns.some(c => four.includes(c.a) && four.includes(c.b)), 'nothing more, and no line between the two: Adobe documents no setup for the pair', theirs.join());
  ok(!byId.ajob2b.lines.concat(byId.ajob2b.more).some(l => /^MO/.test(l)) && byId.ajob2b.name === 'Journey Optimizer B2B Edition' && !conn['moptimizer-ajob2b'], 'Journey Optimizer B2B Edition is as it was: Marketo Optimizer is its own product');
  ok(FILES.every(f => f.left_out.length && f.not_documented.length), 'what was left out and the pairs with no documented setup are on record in each research file');
  ok(cat.plays.filter(x => !x.startsWith('custom')).join('|') === 'cja:bv+cja|commerce:bv+commerce|aem:bv+so+eds|fsi:bv+bc|abv:bv|coworker:cw', 'the six plays on the front page are unchanged', cat.plays.join('|'));

  // the voice rules of step 47, on the 20 connections
  const voice = await p.evaluate(ids => { const bare = s => /\b[Tt]he client(?![-\w])|\b[Cc]lients\b|\b[Yy]our\b(?! client)/.test(s.replace(/Your client|your client/g, '')), order = /(^|[;.(:]\s*|\bso\s+)(confirm|prove it)\b/i;
    const cs = CAT.connections.filter(c => ids.includes(c.id));
    return {card: cs.flatMap(c => [c.how, c.label, c.availability, ...(c.prereqs || []), ...(c.flows || []).map(f => f.what), c.gain && c.gain.title, c.gain && c.gain.text].filter(x => typeof x === 'string' && bare(x)).map(x => c.id + ': ' + x.slice(0, 70))),
      sow: cs.flatMap(c => [c.sowAvailability || c.availability, ...(c.sowPrereqs || c.prereqs || [])].filter(x => typeof x === 'string' && order.test(x)).map(x => c.id + ': ' + x.slice(0, 70)))}; }, PAIRS);
  ok(!voice.card.length && !voice.sow.length, 'the six connections keep the voice rules: "your client" on the card, conditions (not instructions) for the statement of work', JSON.stringify(voice));

  // 2. Create your own play: the menu and the two product cards
  await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400);
  const menu = await p.evaluate(() => [...document.querySelectorAll('#add-menu details.mgrp')].map(d => [d.dataset.grp, [...d.querySelectorAll('[data-add]')].map(x => x.dataset.add)]));
  const grp = Object.fromEntries(menu);
  ok(grp['Campaign management'].join() === 'ajo,ajob2b,xa,marketo,moptimizer,mqualifier,mmeasure,target', 'both sit under Campaign management, after Marketo Engage', grp['Campaign management'].join());
  ok(menu.reduce((t, x) => t + x[1].length, 0) === 34 && !grp['More products'], 'all 34 products are under a heading, none under More products');
  await p.fill('#add-find', 'marketo'); await p.waitForTimeout(200);
  ok((await p.$$eval('#add-list [data-add]', a => a.map(x => x.dataset.add))).sort().join() === 'marketo,mmeasure,moptimizer,mqualifier', 'Find a product lists the four Marketo products for "marketo"');
  await p.context().close();
  const shown = [];
  for (const id of four) { const q = await own([id]); await openCard(q, `.node[data-p="${id}"]`); const c = await readCard(q); shown.push([id, c]); await q.context().close(); }
  ok(shown.every(([id, c]) => c.rows.filter(r => !r.more).map(r => r.id).join() === byId[id].lines.join() && c.rows.filter(r => r.more).map(r => r.id).join() === byId[id].more.join()),
    'each product card lists its starting services, then its optional ones', shown.map(([id, c]) => id + ':' + c.rows.length).join());
  const HOSTS = /^https:\/\/(experienceleague\.adobe\.com|helpx\.adobe\.com|developer\.adobe\.com|www\.aem\.live)\//;
  ok(shown.every(([id, c]) => c.links.length === c.rows.length && c.links.every(u => HOSTS.test(u))), 'every service on the two cards links to its Adobe page', shown.flatMap(x => x[1].links).filter(u => !HOSTS.test(u)).slice(0, 3).join());
  const rowOf = (id, l) => shown.find(x => x[0] === id)[1].rows.find(r => r.id === l).text;
  ok(/Also needs Salesforce or Microsoft Dynamics/.test(rowOf('mqualifier', 'MQ02')) && /Also needs Microsoft 365 with Outlook/.test(rowOf('mqualifier', 'MQ03')) && /Also needs A WhatsApp Business Account/i.test(rowOf('moptimizer', 'MO09')),
    'a service that needs an outside system says so in a tag (the CRM, Outlook, a WhatsApp Business Account)');
  const cardOf = id => shown.find(x => x[0] === id)[1].text;
  ok(!/\b(M[OQ]|JB|XP|XQ)\d\d\b/.test(cardOf('moptimizer') + cardOf('mqualifier')), 'the cards name no internal service id');

  // 3. the six connection cards, each on a canvas of its own two products (a CRM and ad platforms are outside systems)
  const cards = {};
  for (const id of PAIRS) { const q = await own([conn[id].a, conn[id].b]); await openCard(q, `.ib[data-c="${id}"]`); cards[id] = await readCard(q); await q.context().close(); }
  ok(PAIRS.every(id => cards[id].rows.map(r => r.id).join() === [...conn[id].lines, ...conn[id].more].join()), 'each of the six connection cards lists its own services', PAIRS.filter(id => cards[id].rows.map(r => r.id).join() !== [...conn[id].lines, ...conn[id].more].join()).join());
  // step 86: the availability caveats are gone; a card shows an Availability line only where a fact is left to state
  const AVAIL = {'moptimizer-marketo': 'One Marketo Engage instance is the data source, and it is set when the Marketo Optimizer instance is provisioned.',
    'moptimizer-ads': 'Three destinations can be activated from Marketo Optimizer: Google Customer Match, Facebook Custom Audience and LinkedIn Matched Audience.',
    'crm-mqualifier': 'The connection works with Salesforce and Microsoft Dynamics 365, one active at a time. The Add to Outbound Workflow and Add to Marketo Campaign actions are for Salesforce and work in desktop Lightning Experience, not the Salesforce mobile app.',
    'mqualifier-bc': 'Live chat and meeting booking do not require Marketo Engage; custom routing rules do.', 'moptimizer-cw': '', 'mqualifier-marketo': ''};
  const KEPT = {'moptimizer-cw': 'The conversational experience permission for each user who works in Coworker, plus the Manage or View permission of every feature a skill touches',
    'mqualifier-marketo': 'Access to the Adobe Developer Console and to Admin in Marketo Engage for whoever does the setup',
    'moptimizer-marketo': 'A Marketo Engage subscription: Adobe connects one Marketo Engage instance as the data source at provisioning'};
  const flat = id => cards[id].text.replace(/\s+/g, ' ');
  const CAVEAT = /Not stated by Adobe|confirm (eligibility )?with Adobe|Adobe confirms|Adobe says (one|three|Marketing|live)|Adobe documents (the connection|Coworker)|all production regions|health care and finance|available on request to Adobe/i;
  const availBad = PAIRS.filter(id => (AVAIL[id] ? !flat(id).includes('Availability: ' + AVAIL[id]) : /Availability:/.test(cards[id].text)) || CAVEAT.test(flat(id)) || (KEPT[id] && !flat(id).includes(KEPT[id])) ||
    !/BEFORE IT WORKS/i.test(cards[id].text) || !/WHAT YOU GET TOGETHER/i.test(cards[id].text) || !/HOW IT CONNECTS/i.test(cards[id].text));
  ok(Object.keys(AVAIL).sort().join() === [...PAIRS].sort().join() && !availBad.length,
    'and each says what it needs first, what the two give together and how they connect; four state their availability as a plain fact, Coworker and Marketo Engage with Marketo Qualifier show no Availability line, and no caveat is left while the permissions, access and Marketo Engage subscription stay', availBad.join());
  ok(/Marketo Engage is the data source/.test(cards['moptimizer-marketo'].text) && /Outside system/i.test(cards['crm-mqualifier'].text) && /Outside system/i.test(cards['moptimizer-ads'].text), 'Marketo Optimizer + Marketo Engage says Marketo Engage is the data source, and the CRM and ad platform cards are marked as outside systems');
  ok(/Marketo Engage subscription/i.test(cardOf('moptimizer') + cards['moptimizer-marketo'].text) && /HIPAA/.test(cardOf('moptimizer') + PAIRS.map(id => cards[id].text).join('\n')), 'Marketo Optimizer says it needs Marketo Engage first and carries Adobe\'s HIPAA statement');
  const everything = [...shown.map(x => x[1].text), ...PAIRS.map(id => cards[id].text)].join('\n');
  ok(!LABELS.test(everything), 'none of the eight cards says beta, Labs, early access, limited availability, general availability or coming soon', (everything.match(LABELS) || [''])[0]);
  ok(/your client/.test(everything) && !/\bthe Client\b/.test(everything), 'the cards speak to the partner ("your client"), never in the Client\'s voice');
  ok(!/higher conversion|conversion rate|\b\d+x\b|in about a day|Dentsu|Consulting Services/i.test(everything), 'no sales claim from Adobe\'s seller material is on a card');

  // 4. the services reach the statement of work
  p = await own(['marketo', 'moptimizer', 'mqualifier', 'bc']); await p.fill('#rate', '150'); await p.waitForTimeout(200);
  await p.click('#save'); await p.waitForURL('**/sow/index.html#scope', {timeout: 15000}); await p.waitForTimeout(800);
  await p.click('[data-step="services"]'); await p.waitForTimeout(500);
  const sow = await p.evaluate(() => { const row = id => state.estimates.custom['CANVAS-' + id] || {};
    return {on: ['MO01', 'MQ01', 'XQ01', 'XP01', 'XP06'].filter(id => row(id).on), xq01: row('XQ01').assumptions, xp06: row('XP06').assumptions}; });
  ok(sow.on.join() === 'MO01,MQ01,XQ01,XP01,XP06', 'the Marketo Optimizer, Marketo Qualifier and connection services arrive in the statement of work', sow.on.join());
  ok(/the Client/.test(sow.xq01 || '') && !/your client/.test((sow.xq01 || '') + (sow.xp06 || '')), 'worded for the Client there', (sow.xq01 || '').slice(0, 300));
  await p.click('[data-step="document"]'); await p.waitForTimeout(500);
  const doc = await p.textContent('#sow-preview');
  ok(/Marketo Optimizer/.test(doc) && /Marketo Qualifier/.test(doc) && !/your client/i.test(doc) && !LABELS.test(doc), 'the statement of work lists them, never says "your client" and carries no release label', (doc.match(LABELS) || [''])[0]);
  await p.context().close();

  // 5. the RFI Builder answers questions about the two, and still says what it does not cover
  const h = await openRfi();
  const r = await h.text('1. How would you set up Adobe Marketo Qualifier with our Salesforce CRM for our business development representatives?\n2. Describe your approach to implementing Marketo Optimizer on our Marketo Engage instance.\n' +
    '3. How would Brand Concierge hand a chat over to a representative in Marketo Qualifier?\n4. How would you implement Journey Optimizer B2B Edition for our buying groups?\n5. How would you implement Adobe Campaign for our email program?');
  const a = r.questions.map(q => ({products: q.draft ? q.draft.products.map(x => x.id) : [], lines: q.draft ? q.draft.lines.map(x => x.id) : [], conn: q.draft ? q.draft.conn : null, uncovered: (q.draft && q.draft.uncovered) || [], plain: q.draft ? q.draft.plain : ''}));
  const dump = i => JSON.stringify(a[i] && [a[i].products, a[i].conn, a[i].lines.slice(0, 4), a[i].uncovered]);
  ok(a.length === 5 && a[0].products.includes('mqualifier') && !a[0].products.includes('marketo') && a[0].lines.some(l => /^(MQ|XP)\d/.test(l)) && !a[0].uncovered.length, 'a Marketo Qualifier question draws Marketo Qualifier services, and is not read as Marketo Engage', dump(0));
  ok(a[1].products.includes('moptimizer') && a[1].products.includes('marketo') && a[1].lines.some(l => /^XQ0[123]$/.test(l)) && !a[1].products.includes('ajo') && !a[1].products.includes('so'), 'Marketo Optimizer with Marketo Engage, from their connection, and not read as Journey Optimizer or Sites Optimizer', dump(1));
  ok(a[2].products.includes('mqualifier') && a[2].products.includes('bc') && a[2].lines.some(l => /^XP0[678]$/.test(l)), 'the Brand Concierge hand-off is answered from the connection', dump(2));
  ok(a[3].products.includes('ajob2b') && !a[3].products.includes('moptimizer'), 'Journey Optimizer B2B Edition is still its own answer', dump(3));
  ok(a[4].uncovered.includes('Adobe Campaign'), 'Adobe Campaign is still named as not in this catalog', dump(4));
  ok(a.slice(0, 3).every(x => x.plain && !/your client|the partner/i.test(x.plain) && !LABELS.test(x.plain)), 'the drafted answers speak to the client and carry no release label', a.slice(0, 3).map(x => (x.plain.match(LABELS) || [''])[0]).join('|'));
  ok(!h.errors.length, 'no page errors in the RFI Builder', h.errors.slice(0, 2).join(' | '));
  await h.close();

  ok(!errs.length, 'no page errors', errs.slice(0, 3).join(' | '));
  console.log(fails ? `\n${fails} of ${n} STEP 71 CHECKS FAILED` : `\nALL STEP 71 CHECKS PASSED (${n})`);
  await b.close(); server.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
