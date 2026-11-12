// Step 86 (Nov 12 2026, Adam: "publish every connection every feature every functionality as though it's available and don't
// provide any caveats"; of "where Adobe has enabled that feature" and "once Adobe confirms in writing": "why would we write
// that I would strip those and go"). Every availability caveat is out of the catalog text; licenses, technical
// prerequisites and real limits stay. The whole text of each changed field is sow/plain_2026-11-12/rewrites.json.
// Run from the repo root after python3 sow/canvas/build.py and python3 sow/build_site.py:
//   node sow/test_step86.js
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, 'site');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 500) + ']')); if (!c) fails++; };
const T = {'.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript'};
const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (u.endsWith('/')) u += 'index.html';
  const f = path.join(SITE, u);
  if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, {'Content-Type': T[path.extname(f)] || 'text/plain'}); fs.createReadStream(f).pipe(res);
});
const J = (...f) => JSON.parse(fs.readFileSync(path.join(__dirname, ...f), 'utf8'));
const CAT = J('canvas', 'catalog.json'), REC = J('plain_2026-11-12', 'rewrites.json'), PROBS = J('canvas', 'problems.json').problems;
const PAGE = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const TPL = Object.fromEntries(JSON.parse(PAGE.match(/<script>const CATALOG=(\[.*?\]);<\/script>/s)[1]).map(t => [t.id, t]));
// wording that says a feature may not be there, or that Adobe has to say yes first
const CAVEAT = /not stated by Adobe|Adobe (?:does not|doesn't) (?:state|document|specify)|confirm(?:ed|s)? (?:\w+ ){0,6}with Adobe|Adobe confirms|Adobe's (?:written )?confirmation|in writing|account team|\bCSM\b|\bTAM\b|where Adobe has|once Adobe|needs Adobe to|Adobe has to enable|confirmed enablement|confirm enablement|\bbeta\b|early access|early adopter|limited availability|limited release|co-innovation|Try Before You Buy|coming soon|generally available|\(Legacy\)|Legacy offer|maintenance mode|not (?:currently )?(?:offered|available) to (?:health|organizations in health)|confirm eligibility/i;
const LIC = "A Brand Visibility license (CJA's page requires it for the source)";
(async () => {
  await new Promise(r => server.listen(0, r));
  const BASE = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch(), errs = [];
  const fresh = async () => { const ctx = await b.newContext({viewport: {width: 1500, height: 1100}}); const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); return p; };
  const closeAll = async p => { await p.keyboard.press('Escape'); await p.waitForTimeout(150); if (await p.isVisible('#card')) await p.click('#card [data-close]').catch(() => {}); await p.waitForTimeout(150); };
  const openCard = async (p, sel) => { await closeAll(p); await p.click(sel); await p.waitForTimeout(400);
    for (const d of await p.$$('#card details')) if (!(await d.evaluate(x => x.open))) await d.$eval('summary', s => s.click()); await p.waitForTimeout(200); return p.$eval('#card', c => c.innerText); };
  const addP = async (p, id) => { if (await p.isHidden('#add-menu')) await p.click('#add-btn');
    await p.$eval(`#add-menu [data-add="${id}"]`, e => { const d = e.closest('details'); if (d) d.open = true; });
    await p.click(`#add-menu [data-add="${id}"]`); await p.waitForTimeout(300); };
  const own = async ids => { const p = await fresh(); await p.goto(BASE); await p.waitForTimeout(400); await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400);
    for (const id of ids) await addP(p, id); await closeAll(p); return p; };

  // 1. the catalog text
  const K = Object.fromEntries(CAT.connections.map(c => [c.id, c])), L = CAT.lines;
  const texts = [];
  for (const c of CAT.connections) {
    for (const f of ['label', 'how', 'availability', 'sowAvailability', 'sowHow', 'sowGain', 'sowNote', 'tier', 'covered']) if (c[f]) texts.push([c.id + '.' + f, c[f]]);
    for (const f of ['prereqs', 'sowPrereqs']) (c[f] || []).forEach((x, i) => texts.push([c.id + '.' + f + '.' + i, x]));
    if (c.gain) texts.push([c.id + '.gain', c.gain.title + ' ' + c.gain.text]);
    (c.flows || []).forEach((f, i) => texts.push([c.id + '.flow.' + i, f.what]));
  }
  for (const [i, l] of Object.entries(L)) for (const f of ['name', 'nname', 'scope', 'ext', 'tier']) if (l[f]) texts.push([i + '.' + f, l[f]]);
  for (const [i, t] of Object.entries(TPL)) for (const f of ['name', 'scope', 'deliverable', 'assumptions', 'acceptance', 'exclusions', 'basis']) if (t[f]) texts.push([i + '.' + f, t[f]]);
  const hits = texts.filter(([w, s]) => CAVEAT.test(s));
  ok(texts.length > 3000 && !hits.length, `none of the ${texts.length} texts on a card, a service or a statement of work line says a feature may not be available or that Adobe must confirm it`, hits.slice(0, 4).map(([w, s]) => w + ': ' + (s.match(CAVEAT) || [''])[0]).join(' | '));
  const get = (c, f) => f === 'gain_title' ? c.gain.title : f === 'gain_text' ? c.gain.text : f === 'flows_what' ? c.flows.map(x => x.what) : (c[f] === undefined ? (Array.isArray(REC.connections[c.id][f].before) ? [] : '') : c[f]);
  const wrong = [];
  for (const [id, fields] of Object.entries(REC.connections)) for (const [f, v] of Object.entries(fields)) if (JSON.stringify(get(K[id], f)) !== JSON.stringify(v.after)) wrong.push(id + '.' + f);
  for (const [id, fields] of Object.entries(REC.services)) for (const [f, v] of Object.entries(fields)) if ((L[id][f] || '') !== v.after) wrong.push(id + '.' + f);
  for (const [id, fields] of Object.entries(REC.play_services)) for (const [f, v] of Object.entries(fields)) if (JSON.stringify(TPL[id][f]) !== JSON.stringify(v.after)) wrong.push(id + '.' + f);
  ok(Object.keys(REC.connections).length === 145 && Object.keys(REC.services).length === 17 && Object.keys(REC.play_services).length === 22 && !wrong.length,
    'every field of the 145 connections, 17 researched services and 22 play services reads as the record says', wrong.slice(0, 6).join());
  ok(['XH07', 'XG07', 'XL09'].every(i => /Adobe/.test(L[i].scope) && REC.left_as_they_were[i]), 'a request the partner raises with Adobe is a step of the work and stays (three services)');

  // 2. what must stay, stayed
  const withAvail = CAT.connections.filter(c => c.availability);
  ok(withAvail.length > 60 && withAvail.length < 110 && CAT.connections.every(c => typeof c.availability === 'string'), 'a connection with nothing to say has an empty availability; the others keep a factual line', withAvail.length);
  ok(K['cja-bi'].availability === 'Aggregate data only, up to 50,000 rows a query.' && /Select, Prime or Ultimate/.test(K['dwh-cja'].availability) && /CIF add-on/.test(K['commerce-aemsites'].availability),
    'a real limit and a package stay: 50,000 rows on BI tools, the CJA package on warehouse tables, the CIF add-on');
  ok(K['bv-cja'].prereqs.includes(LIC) && K['cw-cja'].prereqs.includes('Coworker Chat license') && K['cw-cja'].prereqs.includes('CJA B2C edition') && K['workfront-cw'].prereqs.some(x => /Workfront Standard license/.test(x)),
    'licenses stay in what a connection needs first: Brand Visibility, Coworker Chat, the CJA edition, Workfront Standard');
  const tags = Object.values(L).filter(l => l.tier).length + CAT.connections.filter(c => c.tier).length;
  ok(tags >= 76, 'no "Needs ..." package tag was lost', tags);
  ok(CAT.connections.every(c => !c.sowPrereqs || c.sowPrereqs.length === c.prereqs.length), 'the statement of work keeps one line for each thing a connection needs');
  const cw = CAT.connections.filter(c => c.a === 'cw' || c.b === 'cw');
  ok(cw.length >= 15 && cw.every(c => !/health ?care|finance|eligib/i.test([c.availability, c.sowAvailability || '', c.sowNote || '', ...c.prereqs, ...(c.sowPrereqs || [])].join(' '))),
    'no Coworker connection says who Adobe does not offer Coworker to', cw.length);
  ok(K['target-eds'].label === 'Target on Edge Delivery through Web SDK, at.js or the martech plugin' && L.XA07.name === 'Journey Optimizer offers in Target tests' && /^Choose the Real-Time CDP profile attributes/.test(L.XA09.scope),
    'labels and names lost their caveat clause, and a service no longer waits on Adobe: the martech plugin, offers in Target tests, Real-Time CDP context in conversations');

  // 3. the cards
  let p = await own(['cw', 'cja', 'target', 'aa']);
  let card = await openCard(p, 'button.ib[data-c="cw-cja"]');
  ok(/Before it works/i.test(card) && /Coworker Chat license/.test(card) && !/Availability:/.test(card) && !CAVEAT.test(card), 'the Coworker + CJA card lists the license and has no Availability line', (card.match(CAVEAT) || [''])[0]);
  card = await openCard(p, 'button.ib[data-c="aa-target"]');
  ok(/Availability: Automated Personalization activities are not supported\./.test(card), 'a card whose connection has a real limit still shows it as Availability', card.slice(0, 200));

  // 4. the statement of work
  const ids = {aa: [...K['aa-target'].lines, ...K['aa-target'].more], cw: [...K['cw-target'].lines, ...K['cw-target'].more].filter(l => L[l].origin === 'research')};
  await p.evaluate(list => { for (const l of list) st.ls[l] = true; render(); }, [ids.aa[0], ...ids.cw.slice(0, 1)]);
  await closeAll(p); await p.fill('#rate', '150'); await p.waitForTimeout(200);
  await p.click('#save'); await p.waitForURL('**/sow/index.html#scope', {timeout: 15000}); await p.waitForTimeout(800);
  await p.click('[data-step="services"]'); await p.waitForTimeout(500);
  const rows = await p.evaluate(list => Object.fromEntries(list.map(id => [id, (state.estimates.custom['CANVAS-' + id] || {}).assumptions || ''])), [ids.aa[0], ...ids.cw.slice(0, 1)]);
  ok(/^Availability: Automated Personalization activities are not supported\. Prerequisites for Adobe Analytics \+ Target:/.test(rows[ids.aa[0]]), 'a connection service whose connection has a limit prints it as Availability', rows[ids.aa[0]].slice(0, 200));
  ok(ids.cw.length && /^Prerequisites for /.test(rows[ids.cw[0]]) && !/Availability:/.test(rows[ids.cw[0]]) && !/not stated/i.test(rows[ids.cw[0]]), 'one whose connection has none prints no Availability sentence, only what it needs first', (rows[ids.cw[0]] || '').slice(0, 200));
  await p.click('[data-step="document"]'); await p.waitForTimeout(500);
  const doc = await p.textContent('#sow-preview');
  ok(!CAVEAT.test(doc) && !/your client/i.test(doc), 'the statement of work for that engagement carries no caveat', (doc.match(CAVEAT) || [''])[0]);

  // 5. a saved draft follows: the page's own wording rules turn each old play-service text into the new one
  const pairs = [];
  const walk = (b, a) => { if (b && typeof b === 'object') for (const k of Object.keys(b)) walk(b[k], a[k]); else if (b !== a) pairs.push([b, a]); };
  for (const fields of Object.values(REC.play_services)) for (const v of Object.values(fields)) walk(v.before, v.after);
  const moved = await p.evaluate(list => list.map(([o, w]) => ProductCopy.scrub(o) === w), pairs);
  ok(pairs.length === 27 && moved.every(Boolean), 'a draft saved with any of the 27 earlier play-service texts opens with today\'s text, so it is not shown as edited', moved.filter(x => !x).length);
  await p.context().close();
  ok(!/is enabled for the organization/.test(TPL.C01.assumptions) && /holds a Brand Visibility license/.test(TPL.C01.assumptions) && ['CW01', 'CW00', 'CW-FSI'].every(i => !/Adobe confirms/.test(TPL[i].assumptions) && !/confirm with Adobe/i.test(TPL[i].basis)),
    'the play services read the same way: the CJA connection keeps its license line, the Coworker services no longer wait for Adobe');
  const bv = TPL.A01.neutral.bv.assumptions.filter(x => x[1] === '' && TPL.A01.assumptions.includes(x[0]));
  ok(bv.length === 1 && bv[0][0].startsWith(' Optimize at Edge'), 'Implement AEM Sites on Edge Delivery still drops its Brand Visibility routing sentences on an engagement without Brand Visibility');

  // 6. the first page
  const notes = PROBS.flatMap(q => q.refine.map(r => r.note || '')).filter(Boolean);
  ok(notes.length === 23 && notes.every(x => !CAVEAT.test(x) && !/health care|finance/i.test(x)), 'no note under a client problem carries a caveat', notes.length);

  ok(!errs.length, 'no script errors', errs.slice(0, 3).join(' | '));
  await b.close(); server.close();
  console.log(fails ? `\n${fails} of ${n} STEP 86 CHECKS FAILED` : `\nALL STEP 86 CHECKS PASSED (${n})`);
  process.exit(fails ? 1 : 0);
})();
