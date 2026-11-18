// Step 85 (Nov 12 2026, Adam: "Yeah, we should add Services around Adobe Commerce customers", then "It looks like the right 8"):
// Adobe Commerce has seven optional services of its own (CE01 to CE07) and a new connection, Adobe Commerce + CRM, with one
// optional service (XR01), a partner-built integration on Adobe's Commerce integration starter kit.
// Run from the repo root after python3 sow/canvas/build.py and python3 sow/build_site.py:
//   node sow/test_step85.js
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
const CAT = JSON.parse(fs.readFileSync(path.join(__dirname, 'canvas', 'catalog.json'), 'utf8'));
const FOUND = JSON.parse(fs.readFileSync(path.join(__dirname, 'canvas', 'research', 'commerce_2026-11-12', 'commerce_services.json'), 'utf8'));
const OWN = ['CE01', 'CE02', 'CE03', 'CE04', 'CE05', 'CE06', 'CE07'], ALL = [...OWN, 'XR01'];
const CAVEATS = /limited availability|coming soon|\bbeta\b|\blabs\b|early access|early adopter|generally available|not stated by Adobe|confirm (?:\w+ ){0,5}with Adobe|\basks? Adobe\b(?!['’]s| data\b| (?:Analytics|Commerce|Express)\b)|Consulting Services/i;
const LABELS = new RegExp(CAVEATS.source + '|\\$\\d', 'i');   // the catalog text carries no price either; the statement of work shows the partner's own fees
(async () => {
  await new Promise(r => server.listen(0, r));
  const BASE = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch(), errs = [];
  const fresh = async () => { const ctx = await b.newContext({viewport: {width: 1500, height: 1100}}); const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); return p; };
  const closeAll = async p => { await p.keyboard.press('Escape'); await p.waitForTimeout(150); if (await p.isVisible('#card')) await p.click('#card [data-close]').catch(() => {}); await p.waitForTimeout(150); };
  const openCard = async (p, sel) => { await closeAll(p); await p.click(sel); await p.waitForTimeout(400);
    for (const d of await p.$$('#card details')) if (!(await d.evaluate(x => x.open))) await d.$eval('summary', s => s.click()); await p.waitForTimeout(200); };
  const readCard = p => p.evaluate(() => ({text: document.querySelector('#card').innerText,
    rows: [...document.querySelectorAll('#card .ln')].map(r => ({id: r.dataset.l, text: r.innerText.replace(/\s+/g, ' '), more: !!r.closest('details')})),
    links: [...document.querySelectorAll('#card a.src')].map(a => a.href)}));

  // 1. the catalog
  const P = Object.fromEntries(CAT.products.map(p => [p.id, p])), L = CAT.lines, K = Object.fromEntries(CAT.connections.map(c => [c.id, c]));
  const adobe = CAT.products.filter(p => !p.outside).length;
  // the reviewed canvas (19b0363) added one connection, Edge Delivery Services + Customer Journey Analytics (eds-cja), with one optional service of its own,
  // EDC01 "Measure Edge Delivery page and block interactions": 152 connections and 532 services, and still 34 Adobe products and 9 outside systems
  const edc = K['eds-cja'];
  // Nov 17 2026 (Adam: "yes for both"): Brand Intelligence + Creative Cloud and Brand Intelligence + Coworker, two connections with no services: 157 connections
  // Nov 17 2026 (Adam: "yes!"): 26 Coworker services, all optional (CW09 to CW11 on Coworker, 23 on its connections), and the new
  // Coworker + Adobe Analytics connection (cw-aa) with one of them: 158 connections and 563 services
  // Nov 17 2026: Figma connects to AEM Assets, GenStudio for Performance Marketing, Adobe Express and Firefly Custom Models (canvas/research/wave6_figma.json), four connections with six optional services, XF01 to XF06
  // Nov 18 2026: ChatGPT, Claude and Microsoft Copilot as outside systems (canvas/research/wave7_ai_assistants.json), 41 connections and six optional services on their products, XT01 and XT03 to XT07
  ok(adobe === 34 && CAT.products.length - adobe === 13 && CAT.connections.length === 203 && Object.keys(L).length === 575 &&
    !!edc && edc.a === 'eds' && edc.b === 'cja' && edc.lines.join() === '' && edc.more.join() === 'EDC01' && !!L.EDC01 && L.EDC01.name === 'Measure Edge Delivery page and block interactions',
    'the catalog holds 34 Adobe products, 13 outside systems, 203 connections and 575 services (ChatGPT, Claude and Microsoft Copilot joined as outside systems with 39 connections, two more connections joined boxes the tool already had, and six optional services sit on their products; Figma connects to AEM Assets, GenStudio for Performance Marketing, Adobe Express and Firefly Custom Models, with six optional services; Coworker added 26 optional services, three of its own and 23 on its connections, and Coworker + Adobe Analytics with one of them; Brand Intelligence added Creative Cloud and Coworker, with no services of their own; Coworker added two optional services, Coworker set up in an AI platform and Workfront Fusion scenarios with Coworker; Brand Intelligence added Frame.io, Firefly Creative Production and Figma, each with one optional service; step 91 added six; the reviewed canvas added Edge Delivery Services + Customer Journey Analytics with one optional service, EDC01)',
    [adobe, CAT.products.length - adobe, CAT.connections.length, Object.keys(L).length, edc ? [edc.a, edc.b, edc.lines.join('+'), edc.more.join('+')].join('/') : 'no eds-cja', (L.EDC01 || {}).name || 'no EDC01'].join());
  ok(P.commerce.lines.length === 0 && P.commerce.more.join() === OWN.join(), 'Adobe Commerce has seven services of its own, none ticked to start', P.commerce.lines.concat(P.commerce.more).join());
  ok(ALL.every(i => L[i] && L[i].origin === 'research' && L[i].scope && L[i].evidence && /^https:\/\/(experienceleague|developer)\.adobe\.com\//.test(L[i].url) && L[i].low < L[i].base && L[i].base < L[i].high),
    'each of the eight says what the partner does, rests on a quote from a public Adobe page, and has small, typical and large hours', ALL.filter(i => !(L[i] && L[i].scope && L[i].evidence)).join());
  ok(ALL.every(i => L[i].name === FOUND.services[i].name && L[i].scope === FOUND.services[i].scope && L[i].evidence === FOUND.services[i].evidence && L[i].base === FOUND.services[i].base),
    'and each is the text and hours of the research record, unchanged');
  ok(OWN.filter(i => L[i].unit === 'monthly').join() === 'CE07' && L.XR01.unit === 'one-time', 'Monthly maintenance and upgrades is the one monthly service');
  ok(/B2B extension/.test(L.CE06.tier || '') && /cloud infrastructure or on-premises/.test(L.CE05.tier || '') && /App Builder/.test(L.XR01.tier || '') && /CRM/.test(L.XR01.ext || ''),
    'what a client must own is a tag: the B2B extension, the Commerce form Live Search installs on, App Builder, and a CRM with APIs');
  const c = K['commerce-crm'];
  ok(c && c.kind === 'outside' && c.line === 'native' && c.lines.length === 0 && c.more.join() === 'XR01' && c.prereqs.length === 6 && !c.availability && c.flows.length === 2 && c.gain && c.sowHow && c.sowGain,
    'Adobe Commerce + CRM is an outside connection with one optional service, six prerequisites, both directions and its client wording, and no availability line', c && JSON.stringify([c.kind, c.line, c.more, c.prereqs.length, c.availability]));
  ok(/partner-built/i.test(c.label) && /starter kit/.test(c.label + c.how) && !/native connector/i.test(c.label + c.how), 'it says plainly that the partner builds it on Adobe\'s Commerce integration starter kit');
  const shown = [P.commerce.name, ...ALL.flatMap(i => [L[i].name, L[i].scope, L[i].tier || '', L[i].ext || '']), c.label, c.how, c.gain.title, c.gain.text, ...c.prereqs, ...c.flows.map(f => f.what), c.sowHow, c.sowGain].join('\n');
  ok(!LABELS.test(shown) && !/[–—]/.test(shown), 'no release label, no caveat, no price and no dash in any of it', (shown.match(LABELS) || [''])[0]);
  ok(/your client/.test(ALL.map(i => L[i].scope).join(' ')) && !/\bthe Client\b/.test(ALL.map(i => L[i].scope).join(' ')) && !/your client/i.test(c.sowHow + c.sowGain), 'the services speak to the partner, the client wording to the client');
  ok(CAT.plays.filter(p => !p.custom).every(pl => !ALL.some(i => (pl.on || []).includes(i))), 'no play turns any of them on');

  // 2. the cards on Create your own play
  let p = await fresh(); await p.goto(BASE); await p.waitForTimeout(400); await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400);
  if (await p.isHidden('#add-menu')) await p.click('#add-btn');
  await p.$eval('#add-menu [data-add="commerce"]', e => { const d = e.closest('details'); if (d) d.open = true; });
  await p.click('#add-menu [data-add="commerce"]'); await p.waitForTimeout(300);
  await p.keyboard.press('Escape'); await p.click('#out-btn'); await p.waitForTimeout(250); await p.click('#out-menu [data-out="crm"]'); await p.waitForTimeout(300);
  await openCard(p, '.node[data-p="commerce"]');
  let card = await readCard(p);
  ok(card.rows.map(r => r.id).join() === OWN.join() && card.rows.every(r => r.more) && OWN.every(i => card.text.includes(L[i].name)), 'the Adobe Commerce card lists the seven under More services', card.rows.map(r => r.id).join());
  ok(/Needs the Adobe Commerce B2B extension/.test(card.text) && card.links.length >= 7 && card.links.every(h => /adobe\.com/.test(h)), 'with the B2B tag and a link to each Adobe page');
  await openCard(p, 'button.ib[data-c="commerce-crm"]');
  card = await readCard(p);
  ok(/Adobe Commerce \+ CRM/.test(card.text) && /Outside system/i.test(card.text) && /Before it works/i.test(card.text) && /App Builder/.test(card.text) && !/Availability:/.test(card.text) && card.rows.map(r => r.id).join() === 'XR01',
    'the Adobe Commerce + CRM card says Outside system, lists what it needs first and its one service, and has no Availability line', card.text.slice(0, 300));
  ok(!LABELS.test(card.text), 'and no caveat', (card.text.match(LABELS) || [''])[0]);

  // 3. ticked services reach the statement of work
  await p.evaluate(() => { for (const id of ['CE01', 'CE07', 'XR01']) st.ls[id] = true; render(); });
  await closeAll(p); await p.fill('#rate', '150'); await p.waitForTimeout(200);
  await p.click('#save'); await p.waitForURL('**/sow/index.html#scope', {timeout: 15000}); await p.waitForTimeout(800);
  await p.click('[data-step="services"]'); await p.waitForTimeout(500);
  const sow = await p.evaluate(() => { const row = id => state.estimates.custom['CANVAS-' + id] || {};
    return {on: ['CE01', 'CE07', 'XR01'].filter(id => row(id).on), hours: ['CE01', 'CE07', 'XR01'].map(id => row(id).hours), xr: row('XR01').assumptions || '', cadence: row('CE07').cadence, once: row('CE01').cadence}; });
  ok(sow.on.join() === 'CE01,CE07,XR01' && sow.hours.join() === '32,32,120' && sow.cadence !== sow.once && /month/i.test(String(sow.cadence)), 'ticked on the canvas, the three arrive in the statement of work with their hours, the monthly one as monthly', JSON.stringify(sow).slice(0, 300));
  ok(/Prerequisites for Adobe Commerce \+ CRM:/.test(sow.xr) && !/Availability:/.test(sow.xr) && !/not stated/i.test(sow.xr) && /App Builder/.test(sow.xr), 'the connection service carries its prerequisites and no Availability sentence', sow.xr.slice(0, 300));
  await p.click('[data-step="document"]'); await p.waitForTimeout(500);
  const doc = await p.textContent('#sow-preview');
  ok(/Store structure and Admin setup/.test(doc) && /Commerce to CRM integration/.test(doc) && /Monthly maintenance and upgrades/.test(doc) && !/your client/i.test(doc) && !CAVEATS.test(doc), 'the statement of work lists them, never says "your client" and carries no caveat', (doc.match(CAVEATS) || [''])[0]);
  await p.context().close();

  // 4. the Commerce play still starts as it did
  p = await fresh(); await p.goto(BASE); await p.waitForTimeout(400); await p.click('#picker [data-play="commerce"]'); await p.waitForTimeout(500);
  const play = await p.evaluate(() => ({ticked: [...new Set([...prods(), ...conns()].flatMap(o => all(o)).filter(l => counted(l)))], offered: (P.commerce.more || []).length}));
  ok(!ALL.some(i => play.ticked.includes(i)) && play.offered === 7, 'on the Commerce play the seven are offered on the Adobe Commerce card and none is counted until ticked', play.ticked.join());
  await p.context().close();

  // 5. the RFI Builder answers Commerce questions from them
  const h = await openRfi();
  const r = await h.text('1. How would you set up our Adobe Commerce store structure, with websites, stores and store views for three countries?\n2. Describe your approach to installing and configuring Live Search on Adobe Commerce.\n' +
    '3. How would you integrate Adobe Commerce with our Salesforce CRM so customers and orders stay in step?\n4. What monthly maintenance and upgrade support do you provide for Adobe Commerce?');
  const a = r.questions.map(q => ({products: q.draft ? q.draft.products.map(x => x.id) : [], lines: q.draft ? q.draft.lines.map(x => x.id) : [], plain: q.draft ? q.draft.plain : ''}));
  const dump = i => JSON.stringify(a[i] && [a[i].products, a[i].lines.slice(0, 5)]);
  ok(a.length === 4 && a[0].products.includes('commerce') && a[0].lines.includes('CE01'), 'a store structure question draws Store structure and Admin setup', dump(0));
  ok(a[1].lines.includes('CE05'), 'a Live Search question draws Live Search setup', dump(1));
  ok(a[2].products.includes('commerce') && a[2].lines.includes('XR01'), 'a Commerce and CRM question draws the integration service', dump(2));
  ok(a[3].lines.includes('CE07'), 'a maintenance question draws the monthly service', dump(3));
  ok(a.every(x => !LABELS.test(x.plain)), 'and no drafted answer carries a caveat', a.map(x => (x.plain.match(LABELS) || [''])[0]).join('|'));
  await h.close();

  ok(!errs.length, 'no script errors', errs.slice(0, 3).join(' | '));
  await b.close(); server.close();
  console.log(fails ? `\n${fails} of ${n} STEP 85 CHECKS FAILED` : `\nALL STEP 85 CHECKS PASSED (${n})`);
  process.exit(fails ? 1 : 0);
})();
