// Step 47 checks (Nov 5 2026): the fixes from the full audit (sow/audit_2026-11-05/FINDINGS.md). Each pass of the step
// adds its own numbered sections. Run from the repo root after python3 sow/canvas/build.py and python3 sow/build_site.py:
//   node sow/test_step47.js
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, 'site');
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 500) + ']')); if (!c) fails++; };
const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  if (u.endsWith('/')) u += 'index.html';
  const f = path.join(SITE, u);
  if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, {'Content-Type': f.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/plain'}); fs.createReadStream(f).pipe(res);
});
(async () => {
  await new Promise(r => server.listen(0, r));
  const BASE = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch(), errs = [];
  const fresh = async (vp = {width: 1600, height: 1000}) => { const p = await (await b.newContext({viewport: vp, acceptDownloads: true})).newPage();
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); return p; };
  const pick = async (p, play) => { await p.goto(BASE); await p.waitForTimeout(400); await p.click(`#picker [data-play="${play}"]`); await p.waitForTimeout(500); };
  const cont = async p => { await p.click('#save'); await p.waitForURL('**/sow/index.html#scope'); await p.waitForTimeout(500); };
  const toSow = async (p, play) => { await pick(p, play); await p.fill('#rate', '150'); await cont(p); };
  const build = async p => { await p.click('.steps [data-build]'); await p.waitForURL(u => !/\/sow\//.test(String(u))); await p.waitForTimeout(600); };
  const services = async p => { await p.click('[data-step="services"]'); await p.waitForTimeout(350); };
  // Nov 18 2026: a ready-made play starts with every outside system it offers, so one already on its canvas is not added again
  const addOut = async (p, id) => { if (await p.evaluate(id => st.out.includes(id), id)) return; await p.click('#out-btn'); await p.waitForTimeout(200); await p.click(`#out-menu [data-out="${id}"]`); await p.waitForTimeout(400); };
  // step 96: AEM Assets is no longer offered on the AEM play; a saved canvas from before keeps it, so it is put on the way that canvas holds it
  const addKept = async (p, id) => { await p.evaluate(id => { st.out = [...st.out, id]; save(); }, id); await p.reload(); await p.waitForTimeout(700); };
  const addSys = (p, id) => id === 'aemassets' ? addKept(p, id) : addOut(p, id);
  const docText = async p => { await p.click('[data-step="document"]'); await p.waitForTimeout(400); return p.$eval('#sow-preview', e => { const copy=e.cloneNode(true); for(const refs of copy.querySelectorAll('.sow-detail'))if(refs.querySelector('h4')?.textContent==='Capability references')refs.remove(); return copy.textContent; }); };
  const shownTotal = p => p.$eval('#totals .total-card:last-child strong', e => e.textContent);
  // the partner's own work: client, rate, term, an own service and hours typed on a line
  const work = async p => { await p.fill('[data-meta="customer"]', 'Acme Bank'); await p.fill('[data-meta="months"]', '9'); await services(p);
    await p.fill('#service-rate', '175'); await p.click('[data-own="Launch"]'); await p.waitForTimeout(200);
    await p.fill('[data-own-form] [name="own-name"]', 'Kickoff and governance'); await p.fill('[data-own-form] [name="own-hours"]', '22');
    await p.fill('[data-own-form] [name="own-scope"]', 'Run the kickoff and set up governance.'); await p.click('[data-own-form] button[type="submit"]'); await p.waitForTimeout(300);
    await p.fill('[data-line="L01"] [data-line-field="hours"]', '70'); await p.locator('[data-line="L01"] [data-line-field="hours"]').blur(); await p.waitForTimeout(300); };
  const kept = p => p.evaluate(() => { const own = state.custom.find(c => c.name === 'Kickoff and governance'), e = state.estimates[state.play];
    return {customer: state.customer, rate: state.rate, months: state.months, own: !!own && !!e[own.id] && e[own.id].on && e[own.id].hours === 22, l01: e.L01 && e.L01.hours, sys: state.outside[state.play] || []}; });
  const same = (k, sys) => k.customer === 'Acme Bank' && k.rate === 175 && k.months === 9 && k.own && k.l01 === 70 && k.sys.includes(sys);

  // 1. (item 1) a saved engagement with a step 45 system or AEM Assets (kept from a canvas saved before step 96) opens again with all its work
  for (const [sys, play] of [['search', 'cja'], ['ads', 'cja'], ['bi', 'cja'], ['csrc', 'aem'], ['cms', 'fsi'], ['aemassets', 'aem'], ['dwh', 'cja']]) {
    const p = await fresh(); await pick(p, play); await p.fill('#rate', '150'); await addSys(p, sys); await cont(p); await work(p);
    const before = await kept(p);
    await p.reload(); await p.waitForTimeout(700); const r1 = await kept(p);
    await build(p); await cont(p); const r2 = await kept(p);
    await build(p); await cont(p); const r3 = await kept(p);
    const draft = await p.evaluate(() => JSON.stringify(state));
    await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(500);
    await p.setInputFiles('#draft-file', {name: 'draft.json', mimeType: 'application/json', buffer: Buffer.from(draft)}); await p.waitForTimeout(600);
    const r4 = await kept(p); await p.reload(); await p.waitForTimeout(600); const r5 = await kept(p);
    ok(same(before, sys) && [r1, r2, r3, r4, r5].every(r => same(r, sys)), `${sys} on the ${play} play: the client, rate, months, own service and hours survive a reload, Build and Continue twice, and an opened draft`,
      JSON.stringify({before, r1, r2, r3, r4, r5}));
    await p.context().close();
  }
  // a saved engagement that can't be opened is kept as it was, with a backup, and the partner is told
  { const p = await fresh(); await toSow(p, 'cja');
    await p.fill('[data-meta="customer"]', 'Acme Bank'); await p.waitForTimeout(200);
    await p.evaluate(() => { const s = localStorage.getItem('partner-sow-studio-v6'); localStorage.setItem('partner-sow-studio-v6', s.slice(0, -7)); });
    const raw = await p.evaluate(() => localStorage.getItem('partner-sow-studio-v6'));
    const failBefore = errs.length;
    await p.reload(); await p.waitForTimeout(700);
    const r = await p.evaluate(() => ({stored: localStorage.getItem('partner-sow-studio-v6'), backup: localStorage.getItem('partner-sow-studio-v6-backup'), toast: document.getElementById('toast').textContent}));
    await p.fill('[data-meta="customer"]', 'Typed after'); await p.waitForTimeout(200);
    const after = await p.evaluate(() => localStorage.getItem('partner-sow-studio-v6'));
    ok(r.stored === raw && r.backup === raw && after === raw && /could not be opened/.test(r.toast), 'a saved engagement that can\'t be opened is never written over: a backup copy is kept and the partner is told', JSON.stringify({same: r.stored === raw, backup: r.backup === raw, after: after === raw, toast: r.toast}));
    errs.splice(failBefore); // the load error is logged on purpose
    await p.context().close(); }

  // 2. (items 9 and 36) the default SOW agrees with CDN log forwarding, set up by the partner; the stage outcomes speak to the partner
  for (const play of ['cja', 'commerce', 'aem', 'fsi', 'abv']) {
    const p = await fresh(); await toSow(p, play); const t = await docText(p);
    ok(!t.includes("Client's CDN team has created the log job") && !t.includes('is selected)') && t.includes("once the log-forwarding job is active in the Client's CDN console"),
      `${play}: the default SOW never says the Client's CDN team creates the log job, or "is selected"`, (t.match(/.{80}(created the log job|is selected\)).{40}/) || [''])[0]);
    if (play === 'cja') {
      await services(p); const heads = await p.$$eval('.stage-head p', e => e.map(x => x.textContent));
      ok(heads.some(h => h.includes("CDN log forwarding on once the partner creates the log job with your client's IT access and approval")) && heads.some(h => h === 'Outcome: the integrations and builds live and verified with your client.'),
        'the Services step outcomes follow OX1 and say your client', heads.join(' | '));
      await p.click('[data-remove="OX1"]'); await p.waitForTimeout(250);
      const h2 = await p.$$eval('.stage-head p', e => e.map(x => x.textContent));
      ok(h2.some(h => h.includes("CDN log forwarding on once your client's IT team completes it")), 'with OX1 off, the Launch outcome says your client\'s IT team completes it', h2.join(' | '));
    }
    await p.context().close();
  }
  { const p = await fresh(); await toSow(p, 'aem'); await p.selectOption('[data-meta="cdnRoute"]', 'own'); await p.waitForTimeout(200);
    const n1 = await p.textContent('#cdn-note');
    await services(p); await p.click('[data-remove="OX1"]'); await p.waitForTimeout(200); await p.click('[data-step="scope"]'); await p.waitForTimeout(200);
    const n2 = await p.textContent('#cdn-note');
    await p.evaluate(() => { state.outside.aem = []; render(); }); await p.waitForTimeout(200);
    const n3 = await p.textContent('#cdn-note');
    ok(n1.includes('You prepare and check them, and do them only with access your client grants.') && n1.includes('already in Services') && !/The partner prepares/.test(n1)
      && n2.includes('back on Build, on the CDN and Brand Visibility lightning bolt') && n3.includes('add the CDN box on Build'),
      'the AEM Scope note on your client\'s own CDN says where the log job stands: already in Services, add it back on the bolt, or add the CDN box', JSON.stringify([n1.slice(-140), n2.slice(-120), n3.slice(-100)]));
    await p.context().close(); }

  // 3. (item 10) AEM on Adobe's managed CDN: L02 reads the managed route, and OX1 is flagged
  { const p = await fresh(); await toSow(p, 'aem'); await p.selectOption('[data-meta="cdnRoute"]', 'managed'); await p.waitForTimeout(250);
    const r = await p.evaluate(() => ({l02: state.estimates.aem.L02.scope, a: state.estimates.aem.L02.assumptions, note: document.getElementById('cdn-note').textContent, issues: issues().join(' | '), deps: dependencyList(selectedLines()).join(' | ')}));
    ok(r.l02.includes('by the route Adobe confirms for its managed CDN in week one, and confirm the logs arrive') && r.a.includes("On Adobe's managed CDN, the log-forwarding route is confirmed with Adobe in week one") && !r.l02.includes('CDN console'),
      'on Adobe\'s managed CDN, L02 registers the log route Adobe confirms in week one, with no CDN console', r.l02.slice(0, 300));
    ok(r.issues.includes('where your client has no CDN console of its own: take the CDN box off on Build') && r.note.includes('where your client has no CDN console of its own') && !r.deps.includes('the partner creates the log job in the CDN console'),
      'with OX1 on, Before you issue and the Scope note say to take the CDN box off, and Dependencies and risks don\'t bill a log job in a CDN console', JSON.stringify({issues: r.issues.slice(0, 200), deps: r.deps.slice(0, 300)}));
    await p.reload(); await p.waitForTimeout(700);
    const kept = await p.evaluate(() => state.estimates.aem.L02.scope);
    await p.selectOption('[data-meta="cdnRoute"]', 'own'); await p.waitForTimeout(250);
    const back = await p.evaluate(() => state.estimates.aem.L02.scope);
    ok(kept === r.l02 && back.includes("once the log-forwarding job is active in the Client's CDN console"), 'the managed wording survives a reload, and the own-CDN answer brings the CDN console wording back', back.slice(0, 200));
    await p.context().close(); }

  // 4. (item 13) no SOW is issued without a schedule, both parties and a rate, and the document prints no partner to-dos
  { const p = await fresh(); await toSow(p, 'cja');
    await p.evaluate(() => { state.terms = 'Time and materials, invoiced monthly; 5-day review windows; change control per the MSA.'; state.rate = ''; save(); });
    await p.click('[data-step="document"]'); await p.waitForTimeout(300);
    const list = await p.textContent('#readiness');
    ok(['Delivery schedule (section 4)', 'Client and partner: name your client and your company', 'Hourly rates: enter your rate'].every(x => list.includes(x)), 'Before you issue asks for the schedule, both names and a rate', list.slice(0, 400));
    // Download SOW (an .html file) was removed Nov 13 (Print / PDF covers it; Adam, Nov 14): the statement of work Print / PDF prints and the CSV are read
    const draft = await p.textContent('#sow-preview'); const [dd] = await Promise.all([p.waitForEvent('download'), p.click('#export-csv')]);
    ok(dd.suggestedFilename().endsWith('-DRAFT.csv') && /Draft, not ready to issue: \d+ open items?\./.test(draft), 'and until they are done, the statement of work Print / PDF prints and the Services CSV are marked as a draft (step 48)', dd.suggestedFilename());
    await p.evaluate(() => { state.timeline = 'TBD'; save(); render(); });
    ok((await p.textContent('#readiness')).includes('Delivery schedule (section 4)'), 'a schedule of "TBD" does not count');
    await p.evaluate(() => { state.customer = 'Acme Bank'; state.partner = 'Partner Co'; state.timeline = 'Weeks 1 to 4: setup and baseline; monthly reviews from week 5.'; state.rate = 150; save(); render(); });
    const body = await p.$eval('#sow-preview', e => e.innerHTML);
    ok(!['Partner to confirm', '>Client name<', '>Partner name<', 'Complete the missing hourly rates'].some(x => body.includes(x)) && body.includes('Acme Bank'), 'the statement of work Print / PDF prints carries no partner to-dos and no placeholder parties');
    await p.context().close(); }

  // 5. (item 15) the warehouse dependency names what each product on the canvas needs
  { const p = await fresh(); await toSow(p, 'cja');
    const d = await p.evaluate(() => { const was = {play: state.play, cp: state.customProducts, out: state.outside.custom}, dep = () => dependencyList([]).find(x => x.startsWith('Data warehouse')) || '';
      state.outside.cja = ['dwh']; const cja = dep(); state.play = 'custom'; state.outside.custom = ['dwh']; state.customProducts = ['rtcdp']; const rt = dep(); state.customProducts = ['ajo']; const ajo = dep();
      state.play = was.play; state.customProducts = was.cp; state.outside.custom = was.out; return {cja, rt, ajo}; });
    ok(d.cja.includes('Data Mirror for CJA needs CJA Select, Prime or Ultimate') && !d.cja.includes('Real-Time CDP')
      && d.rt.includes('copies tables on a schedule and needs Real-Time CDP Ultimate or the Advanced Enterprise Source Connectors') && !/CJA|change tracking/.test(d.rt)
      && d.ajo.includes('Journey Optimizer Campaigns package') && !/CJA Select/.test(d.ajo), 'the warehouse dependency names only what CJA, Real-Time CDP or Journey Optimizer needs', JSON.stringify(d));
    ok(fs.readFileSync(path.join(SITE, 'index.html'), 'utf8').includes('Snowflake, Google BigQuery or Azure Databricks (Data Mirror for CJA and Journey Optimizer; tables copied on a schedule for Real-Time CDP)'), 'the warehouse box names the route for each product');
    await p.context().close(); }

  // 6. (item 19) Use starting scope keeps the services of boxes still on the canvas
  for (const [play, sys] of [['aem', 'aemassets'], ['cja', 'search']]) {
    const p = await fresh(); await pick(p, play); await p.fill('#rate', '150'); await addSys(p, sys); await cont(p); await services(p);
    const sel = () => p.evaluate(() => entries().filter(s => row(s).on).map(s => s.id).sort().join());
    const s0 = await sel(), t0 = await shownTotal(p);
    await p.click('#starting-scope'); await p.waitForTimeout(300);
    const s1 = await sel(), t1 = await shownTotal(p);
    ok(s1 === s0 && t1 === t0 && /CANVAS-/.test(s0), `${play} + ${sys}: Use starting scope gives the same selection and total as a fresh hand-over (${t0})`, JSON.stringify({t0, t1, gone: s0.split(',').filter(x => !s1.split(',').includes(x))}));
    await p.context().close();
  }

  // 7. (item 20) typed hours take a band when the partner leaves the field, not at each keystroke
  { const p = await fresh(); await toSow(p, 'abv'); await services(p);
    const before = await p.evaluate(() => state.estimates.abv.L01.scope);
    await p.click('[data-line="L01"] [data-line-field="hours"]', {clickCount: 3}); await p.keyboard.type('400'); await p.waitForTimeout(100);
    const mid = await p.evaluate(() => ({band: state.estimates.abv.L01.band, scope: state.estimates.abv.L01.scope}));
    await p.locator('[data-line="L01"] [data-line-field="hours"]').blur(); await p.waitForTimeout(250);
    const r = await p.evaluate(() => { const x = state.estimates.abv.L01; return {band: x.band, edited: x.hoursEdited, hours: x.hours, scope: x.scope}; });
    ok(mid.band === 'typical' && mid.scope === before && r.band === 'typical' && r.edited && r.hours === 400 && r.scope === before, 'typing 400 hours never passes through the Small band: the band and the scope stay Typical', JSON.stringify({mid: mid.band, r: {...r, scope: r.scope === before}}));
    await p.fill('[data-line="L01"] [data-line-field="hours"]', '40'); await p.locator('[data-line="L01"] [data-line-field="hours"]').blur(); await p.waitForTimeout(250);
    const s = await p.evaluate(() => { const x = state.estimates.abv.L01; return {band: x.band, edited: x.hoursEdited}; });
    ok(s.band === 'small' && !s.edited, 'hours equal to a band take that band once the field is left', JSON.stringify(s));
    await p.context().close(); }

  // 8. (item 24) Change play says the Scope details are kept for each play
  { const p = await fresh(); await pick(p, 'cja'); await p.click('#change-play'); await p.waitForTimeout(200);
    const t = await p.textContent('#confirm');
    ok(t.includes('Your rate, size, client and partner details stay.') && t.includes("Scope details are kept for each play, so the new play's Scope starts fresh") && !t.includes('Scope details stay.'), 'Change play no longer promises the Scope details stay', t);
    await p.context().close(); }

  // 9. (item 33) no service points to a section or service the SOW doesn't have, and a saved one in the old wording follows
  { const p = await fresh(); await toSow(p, 'aem');
    const left = await p.evaluate(() => ['stated in Included work', '(see Log export', '(see the content program)', '(see the monthly services)', 'excluded from this unit'].filter(x => JSON.stringify(CATALOG).includes(x)));
    ok(!left.length, 'no service text points to Included work, the log export, the content program or the monthly services, or says "this unit"', left.join(' | '));
    const old = await p.evaluate(() => { const r = state.estimates.aem.A03; r.exclusions = PRIOR47.A03.exclusions[0]; state.estimates.aem.SO2.exclusions = PRIOR47.SO2.exclusions[0]; save(); return r.exclusions; });
    await p.reload(); await p.waitForTimeout(700);
    const r = await p.evaluate(() => ({a03: state.estimates.aem.A03, so2: state.estimates.aem.SO2}));
    ok(old.includes('Included work') && r.a03.exclusions.includes("hypercare period in this service's scope") && !r.a03.scopeChanged && r.so2.exclusions.includes('new content creation (a separate service)') && !r.so2.scopeChanged,
      'a saved engagement in the old wording takes the new wording, not marked as edited', r.a03.exclusions);
    await p.context().close(); }

  // 10. (item 34) a partner's own service: no instruction in its assumptions, and a step 45 draft takes the current defaults
  { const p = await fresh(); await toSow(p, 'cja'); await services(p);
    await p.click('[data-own="Launch"]'); await p.waitForTimeout(200); await p.fill('[data-own-form] [name="own-name"]', 'Kickoff'); await p.fill('[data-own-form] [name="own-scope"]', 'Run the kickoff.');
    await p.click('[data-own-form] button[type="submit"]'); await p.waitForTimeout(300);
    const a = await p.evaluate(() => state.custom.find(c => c.name === 'Kickoff').assumptions);
    ok(a === 'Client and partner agree access, inputs and review responsibilities.', 'a new own service assumes Client and partner agree access, inputs and review responsibilities', a);
    const OLD_A = 'Confirm access, approved inputs and review responsibilities.', OLD_C = 'Customer confirms the agreed deliverable meets the documented scope.';
    const draft = {version: 4, v14: true, play: 'cja', rate: 150, currency: 'USD', months: 12, briefs: {}, custom: [{id: 'CUSTOM45', name: 'Old own service', stage: 'Launch', base: 12, plays: ['cja'], scope: 'Do the work.', deliverable: 'Do the work.', acceptance: OLD_C, assumptions: OLD_A, exclusions: 'Work outside the described scope.'}],
      estimates: {cja: {CUSTOM45: {on: true, hours: 12, rate: '', cadence: 'one-time', scope: 'Do the work.', deliverable: 'Do the work.', acceptance: OLD_C, assumptions: OLD_A, exclusions: 'Work outside the described scope.'}}}};
    await p.setInputFiles('#draft-file', {name: 'step45.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(draft))}); await p.waitForTimeout(600);
    const r = await p.evaluate(() => ({c: state.custom.find(c => c.id === 'CUSTOM45'), e: state.estimates.cja.CUSTOM45}));
    ok(r.c.assumptions === a && r.e.assumptions === a && r.e.acceptance === 'Client confirms the agreed deliverable meets the documented scope.' && !r.e.scopeChanged, 'a step 45 draft\'s own service takes the current defaults, not marked as edited', JSON.stringify({a: r.e.assumptions, c: r.e.acceptance, ch: r.e.scopeChanged}));
    await p.context().close(); }

  // 11. (item 35) no SOW-printed field teaches "your client"
  { const p = await fresh(); await toSow(p, 'cja');
    const bad = await p.$$eval('[data-meta],[data-brief],[data-cover]', e => e.filter(x => /your client/i.test(x.placeholder || '')).map(x => x.placeholder));
    const lab = await p.$eval('[data-cover="estate"]', e => e.closest('label').textContent);
    ok(!bad.length && lab.includes('Context only, printed in the SOW'), 'no placeholder on a field the SOW prints says your client, and the estate field says it prints', bad.join(' | '));
    await p.context().close(); }

  // 12. (item 40) an engagement opened at ?play= keeps its work through Build
  for (const viaPicker of [false, true]) {
    const p = await fresh(); await p.goto(BASE + 'sow/index.html?play=aem#services'); await p.waitForTimeout(600);
    await p.fill('#service-rate', '200'); await p.fill('[data-line="L01"] [data-line-field="hours"]', '70'); await p.locator('[data-line="L01"] [data-line-field="hours"]').blur(); await p.waitForTimeout(200);
    await p.click('[data-own="Launch"]'); await p.waitForTimeout(200); await p.fill('[data-own-form] [name="own-name"]', 'Kickoff'); await p.fill('[data-own-form] [name="own-hours"]', '12');
    await p.fill('[data-own-form] [name="own-scope"]', 'Run the kickoff.'); await p.click('[data-own-form] button[type="submit"]'); await p.waitForTimeout(300);
    const t0 = await shownTotal(p);
    let picker;
    if (viaPicker) { await p.evaluate(() => localStorage.removeItem('abv-sow-build-v1')); await p.goto(BASE); await p.waitForTimeout(500); picker = await p.isVisible('#picker'); await p.click('#picker [data-play="aem"]'); await p.waitForTimeout(500); }
    else { await build(p); picker = await p.isVisible('#picker'); }
    await cont(p); await services(p);
    const r = await p.evaluate(() => { const own = state.custom.find(c => c.name === 'Kickoff'); return {l01: state.estimates.aem.L01.hours, own: !!own && state.estimates.aem[own.id].on}; });
    const t1 = await shownTotal(p);
    ok(r.l01 === 70 && r.own && t1 === t0 && (viaPicker ? picker : !picker), viaPicker ? 'picking the same play on the picker keeps the hours, the own service and the total' : 'Build opens the canvas on the play (no picker), and the work and the total come back the same', JSON.stringify({...r, t0, t1, picker}));
    await p.context().close();
  }

  // 13. (item 41) the markets monitored set the band without a prompt count
  { const p = await fresh(); await toSow(p, 'abv');
    await p.fill('[data-cover="marketCount"]', '4'); await p.waitForTimeout(250);
    const r = await p.evaluate(() => ({band: state.estimates.abv.L02.band, scope: state.estimates.abv.L02.scope, sum: promptSummary()}));
    await services(p); const q = await p.textContent('[data-line="L02"] .service-qty');
    await p.click('[data-step="scope"]'); await p.fill('[data-cover="marketCount"]', '7'); await p.waitForTimeout(250);
    const over = await p.evaluate(() => issues().join(' | '));
    await p.fill('[data-cover="marketCount"]', '1'); await p.waitForTimeout(250);
    const one = await p.evaluate(() => state.estimates.abv.L02.band);
    ok(r.band === 'large' && r.scope.includes('four to six markets') && r.sum === '4 markets or languages monitored' && q.includes('Set by 4 markets on the Scope step.') && over.includes('above the largest band') && one === 'typical',
      'four markets set Large, seven ask for your hours, one leaves Typical, with no prompt count', JSON.stringify({band: r.band, sum: r.sum, q: q.slice(0, 160), one}));
    await p.context().close(); }

  // 14. (item 42) the fee table stacks on phones, in the preview and the downloaded SOW
  { const p = await fresh({width: 390, height: 844}); await toSow(p, 'aem');
    await p.evaluate(() => { state.customer = 'Acme Bank'; state.partner = 'Partner Co'; state.timeline = 'Weeks 1 to 4: setup and baseline; monthly reviews from week 5.'; state.terms = 'Time and materials, invoiced monthly; 5-day review windows; change control per the MSA.'; save(); });
    await p.click('[data-step="document"]'); await p.waitForTimeout(400);
    const fit = q => q.$eval('.sow-fee-wrap', e => ({sw: e.scrollWidth, cw: e.clientWidth, name: e.querySelector('tbody td').getBoundingClientRect().width, lines: Math.round(e.querySelector('tbody td').getBoundingClientRect().height / 18)}));
    const a = await fit(p);
    const asFile = () => p.evaluate(() => '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>' + document.querySelector('style').textContent + '</style></head><body>' + document.getElementById('sow-preview').innerHTML + '</body></html>'); const body = await asFile();
    const q = await (await b.newContext({viewport: {width: 390, height: 844}})).newPage(); await q.setContent(body); await q.waitForTimeout(300);
    const c = await fit(q);
    ok(a.sw === a.cw && c.sw === c.cw && a.name > 250 && c.name > 250 && a.lines <= 3, 'at 390px the fee rows stack: no sideways scroll and service names get the full width, in the preview and in the statement of work on its own', JSON.stringify({a, c}));
    await q.context().close(); await p.context().close(); }

  // ---------- the canvas pass (items 2, 3, 8, 21, 22, 23, 25, 26, 27, 28, 38, 39, 43) ----------
  // step 94 put the explorer below the canvas, so the page scrolls; Playwright's element click scrolls it first and then finds the focus bar or
  // Continue over the box. A person clicks the box where it is: at the top of the page, a mouse click at its middle (Playwright's click
  // and, on a phone or tablet, after swiping the canvas so the box sits in the middle of the room under the focus bar)
  const tapAt = async (pg, sel) => { await pg.evaluate(sel => { scrollTo(0, 0); const n = document.querySelector(sel), sc = document.getElementById('scroller'), fb = document.getElementById('fbar');
      if (!document.getElementById('canvas').classList.contains('pan')) return; const r = n.getBoundingClientRect(), s = sc.getBoundingClientRect(), top = fb.hidden ? s.top : Math.max(s.top, fb.getBoundingClientRect().bottom), bottom = Math.min(s.bottom, innerHeight);
      if (r.left >= s.left && r.right <= s.right && r.top >= top && r.bottom <= bottom) return;
      sc.scrollLeft += r.left + r.width / 2 - (s.left + s.width / 2); sc.scrollTop += r.top + r.height / 2 - (top + bottom) / 2; }, sel); await pg.waitForTimeout(100);
    const bx = await (await pg.$(sel)).boundingBox(); await pg.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); };
  const tapNode = (pg, id) => tapAt(pg, `.node[data-p="${id}"]`);
  const all14 = async p => { await p.evaluate(() => { for (const id of CAT.plays.find(x => x.custom).products) addProduct(id); openAdd(false); }); await p.keyboard.press('Escape'); await p.waitForTimeout(500); };
  const covered = (p, sel) => p.evaluate(sel => [...document.querySelectorAll(sel)].filter(e => { const r = e.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, cv = document.getElementById('canvas').getBoundingClientRect();
    if (x < cv.left || x > cv.right || y < cv.top || y > cv.bottom) return false; const h = document.elementFromPoint(x, y); return !h || !e.contains(h); }).map(e => e.dataset.c || e.dataset.p), sel);
  // 15. (item 2) removing an outside system selected in focus view: no error, the total follows, the removal is saved
  { const p = await fresh(); await pick(p, 'custom'); await p.fill('#rate', '150'); await all14(p); await addOut(p, 'dwh');
    const e0 = errs.length; await tapNode(p, 'dwh'); await p.waitForTimeout(300); await p.click('#fb-svc'); await p.waitForTimeout(300);
    await p.click('#card [data-rmout="dwh"]'); await p.waitForTimeout(500); await tapNode(p, 'cja'); await p.waitForTimeout(300);
    const r = await p.evaluate(() => ({big: document.getElementById('t-big').textContent, want: money(totals().yr), out: JSON.parse(localStorage.getItem('abv-sow-build-v1')).out, node: !!document.querySelector('.node[data-p="dwh"]')}));
    ok(errs.length === e0 && r.big === r.want && !r.out.includes('dwh') && !r.node, 'item 2: removing the Data warehouse selected in focus view throws nothing, the total follows and the removal is saved', JSON.stringify(r));
    await p.reload(); await p.waitForTimeout(600); ok(!(await p.$('.node[data-p="dwh"]')), 'item 2: and it stays off after a reload');
    await p.context().close(); }
  // 16. (item 3) phones and tablets: a readable stage that scrolls, products on the first screen, bolts tapped from 18 px off center;
  //     at 1440 and 1600 the canvas never scrolls
  for (const [w, h] of [[390, 844], [768, 1024]]) for (const play of ['cja', 'custom']) {
    const p = await fresh({width: w, height: h}); await pick(p, play); await p.fill('#rate', '150');
    if (play === 'custom') await all14(p);
    // Nov 19 2026: CJA now opens in Explore one product; on a phone its canvas grows by the focus bar, so the map sits below the bar: scrolled into view, as a partner does
    if (play === 'cja' && w < 600) { await p.evaluate(() => document.getElementById('scroller').scrollIntoView({block: 'end'})); await p.waitForTimeout(300); }
    const r = await p.evaluate(() => { const s = Number((/scale\(([0-9.]+)\)/.exec(document.getElementById('stage').style.transform) || [])[1]), own = [...document.querySelectorAll('.node')].filter(n => !n.classList.contains('out'));
      const first = own.filter(n => { const b = n.getBoundingClientRect(); return b.top >= 0 && b.bottom <= innerHeight && b.right > 0 && b.left < innerWidth; }).map(n => n.dataset.p);
      return {s, first, n: own.length, page: document.documentElement.scrollWidth <= innerWidth, pan: document.getElementById('canvas').classList.contains('pan')}; });
    const okFirst = play === 'cja' ? r.first.length === 2 : r.first.length >= 2;
    ok(r.s >= 0.7 - 1e-9 && okFirst && r.page, `item 3: ${play} at ${w} px: the stage keeps scale ${r.s} (0.7 or more), ${r.first.length} of the play's products are on the first screen, no sideways page scroll`, JSON.stringify(r));
    // Nov 19 2026: on the phone the map sits below the focus bar, under the first screen, so the box is tapped where it is with the map scrolled into view
    if (play === 'cja' && w < 600) { const bx = await (await p.$('.node[data-p="cja"]')).boundingBox(); await p.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.waitForTimeout(400); }
    else if (play === 'custom' || await p.evaluate(() => fv())) { await tapNode(p, 'cja'); await p.waitForTimeout(400); }   // Nov 18 2026: CJA opens in Explore one product too
    // the bolts pop in over 0.6 s (.ib.enter); measured mid-pop, a tap 18 px off centre can miss, on any build: wait for the pop to end
    await p.waitForFunction(() => [...document.querySelectorAll('.ib')].every(b => !b.getAnimations().length));
    const bolt = await p.evaluate(() => { const cv = document.getElementById('canvas').getBoundingClientRect(), fb = document.getElementById('fbar'), top = fb.hidden ? cv.top : fb.getBoundingClientRect().bottom, sv = document.getElementById('save').getBoundingClientRect();
      const b = [...document.querySelectorAll('.ib')].find(x => { const r = x.getBoundingClientRect(); return r.left > cv.left + 30 && r.right < cv.right - 30 && r.top > top + 30 && r.bottom < Math.min(cv.bottom, innerHeight) - 30 && !(r.right > sv.left - 30 && r.bottom > sv.top - 30); });
      if (!b) return null; const r = b.getBoundingClientRect(); return {c: b.dataset.c, x: r.left + r.width / 2, y: r.top + r.height / 2, d: r.width}; });
    if (bolt) { await p.mouse.click(bolt.x + 18, bolt.y); await p.waitForTimeout(400); }
    const card = bolt && await p.evaluate(() => !document.getElementById('card').hidden && document.querySelector('#card .k').textContent.includes('Connection'));
    ok(!!bolt && card && (await covered(p, `.ib[data-c="${bolt.c}"]`)).length === 0, `item 3: ${play} at ${w} px: a tap 18 px from a ${bolt ? Math.round(bolt.d) : '?'} px bolt opens its card, and the bolt stays in view`, JSON.stringify(bolt));
    await p.context().close(); }
  for (const w of [1440, 1600]) { const p = await fresh({width: w, height: w === 1440 ? 900 : 950}); await pick(p, 'custom'); await all14(p);
    const r = await p.evaluate(() => ({pan: document.getElementById('canvas').classList.contains('pan'), sw: document.getElementById('scroller').scrollWidth, cw: document.getElementById('scroller').clientWidth, s: document.getElementById('stage').style.transform}));
    ok(!r.pan && r.sw <= r.cw, `item 3: at ${w} px the canvas never scrolls and fits the stage as before (${r.s})`, JSON.stringify(r));
    await p.context().close(); }
  // 17. (item 8, step 48 fix 5) the banking and insurance problem offers no chip that adds Coworker, which Adobe doesn't currently offer to finance organizations
  { const p = await fresh(); await p.goto(BASE); await p.waitForTimeout(300);
    const n = await p.evaluate(() => PROBS.find(x => x.id === 'fsi-complex-questions').refine.map(r => r.chip + (r.add.includes('cw') ? ' (adds Coworker)' : '')));
    ok(n.join('|') === "My client runs Marketo Engage|My client's site is on AEM Sites|My client licenses CJA", 'step 48 fix 5: the banking and insurance problem offers no chip that adds Coworker; its Marketo Engage, AEM Sites and CJA chips stay', n.join(' | '));
  // 18. (item 23) a chip that says the CDN belongs on the canvas puts the CDN in the setup
    const bad = await p.evaluate(() => PROBS.flatMap(q => q.refine.filter(r => /CDN belongs on the canvas/.test(r.note || '')).map(r => { const n = bpNext(bpBase(q), r); return n && n.out.includes('cdn') ? null : q.id + ': ' + r.chip; })).filter(Boolean));
    ok(!bad.length, 'item 23: every chip whose note says the CDN belongs on the canvas leaves the CDN in the setup Build this makes', bad.join(' | '));
    await p.context().close(); }
  // 19. (item 21) removing the last product takes its outside systems with it: the empty state, no Continue
  { const p = await fresh(); await pick(p, 'custom'); await p.fill('#rate', '150'); await p.evaluate(() => { addProduct('cja'); openAdd(false); }); await p.waitForTimeout(300); await addOut(p, 'dwh');
    await tapNode(p, 'cja'); await p.waitForTimeout(300); await p.click('#card [data-rm="cja"]'); await p.waitForTimeout(400);
    const r = await p.evaluate(() => ({nodes: document.querySelectorAll('.node').length, empty: !document.getElementById('empty').hidden, save: document.getElementById('save').hidden, out: st.out}));
    ok(r.nodes === 0 && r.empty && r.save && !r.out.length, 'item 21: with CJA removed the Data warehouse goes too, Add your first product shows and Continue is hidden', JSON.stringify(r));
    await p.evaluate(() => { addProduct('cja'); openAdd(false); }); await p.waitForTimeout(300);
    ok(!(await p.$('.node[data-p="dwh"]')) && await p.isVisible('#save'), 'item 21: adding CJA back brings Continue back');
    await p.context().close(); }
  // 20. (item 22) the outside-system menu and card name what the system really connects to
  { const p = await fresh(); await pick(p, 'custom'); await p.evaluate(() => { addProduct('cja'); openAdd(false); }); await p.waitForTimeout(300); await addOut(p, 'dwh');
    await tapNode(p, 'dwh'); await p.waitForTimeout(300); const t = await p.textContent('#card');
    ok(t.includes('It connects to Customer Journey Analytics. The lightning bolt on its line says how') && /Add .*Real-Time CDP.* to connect it there too\./.test(t) && !/It connects to [^.]*Real-Time CDP/.test(t), 'item 22: CJA plus the Data warehouse: the card names only CJA as connected, and says what to add to connect it there too', t.slice(0, 400));
    await p.context().close(); }
  { const p = await fresh(); await pick(p, 'aem'); await addOut(p, 'search'); await tapNode(p, 'search'); await p.waitForTimeout(300); const t = await p.textContent('#card');
    ok(t.includes('It connects to Brand Visibility and Sites Optimizer. The lightning bolt on each of its lines says how'), 'item 22: the AEM play with Search data says "each of its lines"', t.slice(0, 400));
    await p.context().close(); }
  { const p = await fresh(); await pick(p, 'custom'); await p.evaluate(() => { addProduct('bv'); openAdd(false); }); await p.waitForTimeout(300); await p.click('#out-btn'); await p.waitForTimeout(250);
    const tags = await p.$$eval('#out-menu .it2.wait', es => es.map(e => [e.querySelector('.nm').textContent, e.querySelector('.ctag').textContent]));
    const want = ['Data warehouse', 'CRM', 'Ad platforms', 'Authoring documents'].map(n => (tags.find(x => x[0].startsWith(n)) || [n, ''])[1]);
    ok(want.every(x => x.endsWith(': add one first')), 'item 22: with Brand Visibility alone, the Data warehouse, CRM, Ad platforms and Authoring documents say "add one first"', JSON.stringify(want));
  // 21. (item 27) the menu's tags stay inside it at every width
    const fits = []; for (const w of [360, 390, 412, 430, 768, 1440]) { await p.setViewportSize({width: w, height: 900}); await p.waitForTimeout(250);
      fits.push(await p.evaluate(w => { const m = document.getElementById('out-menu'), mr = m.getBoundingClientRect(); return [w, m.scrollWidth <= m.clientWidth && [...m.querySelectorAll('.ctag,.nm,.sys')].every(e => e.getBoundingClientRect().right <= mr.right + 0.5)]; }, w)); }
    ok(fits.every(x => x[1]), 'item 27: in the Add outside system menu, nothing runs past the edge at 360, 390, 412, 430, 768 and 1440 px', JSON.stringify(fits));
    await p.context().close(); }
  // 22. (item 25) Continue stays on screen and the canvas fits the window on laptop screens, on every play (step 94 put the explorer below
  // the canvas, so the page itself scrolls down to it now)
  { const off = []; for (const [w, h] of [[1280, 800], [1366, 768], [1536, 864], [1440, 900]]) { const p = await fresh({width: w, height: h});
      for (const play of ['cja', 'commerce', 'aem', 'fsi', 'abv', 'coworker', 'custom']) { await pick(p, play); await p.fill('#rate', '150');
        if (play === 'custom') { await p.evaluate(() => { addProduct('cja'); openAdd(false); }); await p.waitForTimeout(300); }
        const r = await p.evaluate(() => ({b: document.getElementById('save').getBoundingClientRect().bottom, sh: Math.round(document.querySelector('.sow-canvas-screen').getBoundingClientRect().bottom), ih: innerHeight}));
        if (r.b > r.ih || r.sh > r.ih) off.push(`${play} ${w}x${h}: ${JSON.stringify(r)}`);
        await p.evaluate(() => localStorage.clear()); }
      await p.context().close(); }
    ok(!off.length, 'item 25: at 1280x800, 1366x768, 1536x864 and 1440x900, Continue is within the window and the canvas fits it, on all seven plays', off.join(' | ')); }
  // 23. (item 26) an open card covers neither its anchor nor the selected product's bolts, at 1440, 1600 and 768
  for (const [w, h] of [[1440, 900], [1600, 950], [768, 1024]]) { const p = await fresh({width: w, height: h}); await pick(p, 'custom'); await p.fill('#rate', '150'); await all14(p);
    const bad = [];
    for (const id of ['rtcdp', 'ajo', 'cja', 'bc']) { await tapNode(p, id); await p.waitForTimeout(300); const first = await p.isHidden('#card');
      await tapNode(p, id); await p.waitForTimeout(500); const dock = await p.$eval('#card', c => c.classList.contains('dock'));
      const cov = [...await covered(p, `.node[data-p="${id}"]`), ...(dock ? [] : await covered(p, '.ib'))]; if (!first || cov.length) bad.push(`${id}: first ${first}, covered ${cov}`);
      const b = await p.$$eval('.ib', es => es.map(e => e.dataset.c)); for (const c of b.slice(0, 3)) { if (!(await covered(p, `.ib[data-c="${c}"]`)).length) { await tapAt(p, `.ib[data-c="${c}"]`); await p.waitForTimeout(350);
        const cc = await covered(p, `.ib[data-c="${c}"]`); if (cc.length) bad.push(`${c} card covers its bolt`); } }
      await p.keyboard.press('Escape'); await p.click('#fb-clear'); await p.waitForTimeout(200); }
    ok(!bad.length, `item 26: at ${w} px in focus view, the first click draws a product's lines, the second opens its card clear of its box and bolts, and a connection card never covers its bolt`, bad.join(' | '));
    await p.evaluate(() => localStorage.clear());
    // Nov 18 2026: each play as it started before, the CDN its one outside system, with the warehouse or Search data added from the menu
    for (const play of ['cja', 'aem']) { await pick(p, play); await p.evaluate(() => { for (const id of st.out.filter(x => x !== 'cdn')) removeOutside(id); }); await addOut(p, play === 'cja' ? 'dwh' : 'search'); const bb = [];
      for (const c of await p.$$eval('.ib', es => es.map(e => e.dataset.c))) { await tapAt(p, `.ib[data-c="${c}"]`); await p.waitForTimeout(350); if ((await covered(p, `.ib[data-c="${c}"]`)).length) bb.push(c); await p.keyboard.press('Escape'); }
      const sys = play === 'cja' ? 'dwh' : 'search'; await tapNode(p, sys); await p.waitForTimeout(350);
      const ob = await covered(p, `.ib[data-c*="${sys}"]`); if (ob.length) bb.push(sys + ' card covers ' + ob); await p.keyboard.press('Escape');
      ok(!bb.length, `item 26: at ${w} px on the ${play} play every connection card leaves its bolt clear, and the outside system's card its own bolts`, bb.join(', ')); await p.evaluate(() => localStorage.clear()); }
    await p.context().close(); }
  // 23b. (item 26, the card pass; step 48 adds 1536x864 and 1280x800) at 1440x900, 1536x864, 1280x800, 1600x950, 1920x1080 and
  // 768x1024 on every play, Create your own play with all 14
  // products: every card ends within the canvas and the window (taller cards scroll, Remove from canvas stays reachable), and
  // elementFromPoint still reaches its own box or bolt; wherever a spot exists that clears the anchor and the selected product's
  // bolts, every such bolt answers elementFromPoint; wherever a spot covers no box at all, the card covers no box. Step 48: a card
  // that isn't docked is at least min(600 px, its own height, the room) tall wherever a spot that tall clears its anchor and the
  // selected product's bolts, opens at its top and shows its close X; while the canvas is marked tall the room is the window
  // below the tabs
  { const judge = () => { const c = document.getElementById('card'), cr = c.getBoundingClientRect(), cv = document.getElementById('canvas').getBoundingClientRect(), F = fv();
      const tall = document.getElementById('canvas').classList.contains('tall');
      const V = {l: Math.max(cv.left, 0), r: Math.min(cv.right, innerWidth), t: tall ? Math.max(document.querySelector('.tabs').getBoundingClientRect().bottom, 0) : Math.max(cv.top, 0) + (F ? document.getElementById('fbar').offsetHeight : 0), b: Math.min(cv.bottom, innerHeight)};
      const hit = (r, k, m = 0) => r.left < k.right + m && k.left - m < r.right && r.top < k.bottom + m && k.top - m < r.bottom;
      const at = e => { const r = e.getBoundingClientRect(), h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!h && e.contains(h); };
      const inV = e => { const r = e.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; return r.width > 0 && x > V.l && x < V.r && y > V.t && y < V.b; };
      const a = document.querySelector(card.k === 'p' ? `.node[data-p="${card.id}"]` : `.ib[data-c="${card.id}"]`), ar = a.getBoundingClientRect(), sel = F ? fcur() : card.k === 'p' ? card.id : null;
      const sv = document.getElementById('save').getBoundingClientRect(), underSave = b => { const r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; return x > sv.left && x < sv.right && y > sv.top && y < sv.bottom; };
      // step 71: a bolt that sits under the Continue button is not the card's to keep clear (Coworker's eleventh line puts one there at 768 wide; the canvas pans)
      const mine = [...document.querySelectorAll('.ib')].filter(b => b !== a && inV(b) && !underSave(b) && (F || (sel && [CBY[b.dataset.c].a, CBY[b.dataset.c].b].includes(sel))));
      const hard = [ar, ...mine.map(b => b.getBoundingClientRect())]; if (F && sel && card.k === 'c') hard.push(document.querySelector(`.node[data-p="${sel}"]`).getBoundingClientRect());
      const boxes = [...document.querySelectorAll('#stage .node')].filter(n => n !== a && inV(n)).map(n => n.getBoundingClientRect());
      const w = cr.width, h = Math.min(cr.height, 600); let cH = false, cB = false;
      for (let x = V.l + 10; x <= V.r - 10 - w && !cB; x += 6) for (let y = V.t + 10; y <= V.b - 10 - h; y += 6) { const r = {left: x, top: y, right: x + w, bottom: y + h};
        if (hard.some(k => hit(r, k, 4))) continue; cH = true; if (!boxes.some(k => hit(r, k, 4))) { cB = true; break; } }
      const bad = [];
      if (!(cr.top >= V.t - 1 && cr.bottom <= V.b + 1 && cr.left >= V.l - 1 && cr.right <= V.r + 1 && cr.bottom <= innerHeight)) bad.push('outside the room ' + Math.round(cr.bottom));
      if (hit(cr, ar) || !at(a)) bad.push('covers its anchor');
      const blocked = mine.filter(b => !at(b)).map(b => b.dataset.c); if (cH && blocked.length) bad.push('blocks ' + blocked);
      if (cB && boxes.some(k => hit(cr, k))) bad.push('covers a box with a clear spot free');
      const fl = Math.min(c.scrollHeight + 8, 600, V.b - V.t - 20); let cT = false;
      for (let x = V.l + 10; x <= V.r - 10 - w && !cT; x += 6) for (let y = V.t + 10; y <= V.b - 10 - fl; y += 6) if (!hard.some(k => hit({left: x, top: y, right: x + w, bottom: y + fl}, k, 4))) { cT = true; break; }
      if (!c.classList.contains('dock') && cT && cr.height < fl - 2) bad.push('short ' + Math.round(cr.height) + ' of ' + (c.scrollHeight + 8));
      if (c.scrollTop) bad.push('opens scrolled'); if (!at(c.querySelector('.close'))) bad.push('close X hidden');
      const rm = c.querySelector('[data-rm],[data-rmout]'); if (rm) { rm.scrollIntoView({block: 'nearest'}); if (!at(rm) || rm.getBoundingClientRect().bottom > innerHeight) bad.push('Remove from canvas out of reach'); }
      return bad.length ? card.k + ':' + card.id + ' ' + bad.join(', ') : ''; };
    for (const [w, h] of [[1440, 900], [1536, 864], [1280, 800], [1600, 950], [1920, 1080], [768, 1024]]) { const bad = []; let n = 0;
      for (const play of ['custom', 'cja', 'commerce', 'aem', 'fsi', 'abv', 'coworker']) { const p = await fresh({width: w, height: h}); await pick(p, play); await p.fill('#rate', '150');
        if (play === 'custom') await all14(p); if (play === 'cja' || play === 'aem') await addOut(p, play === 'cja' ? 'dwh' : 'search');
        const F = await p.evaluate(() => fv()), ids = await p.$$eval('#stage .node', ns => ns.map(n => n.dataset.p));
        for (const id of ids) { await p.evaluate(() => { hideCard(true); if (fv()) { fsel = null; refocus(); } }); await p.waitForTimeout(F ? 350 : 30);
          // step 66 (Nov 10 2026): the box is brought to the middle before the click. Brought only as far as the edge, a box in the
          // bottom row could rest under the Continue button on a 768 px screen, and the forced click pressed Continue
          // (step 94: the page scrolls to the explorer below the canvas, so it goes back to the top, as a person's would, before the click)
          const s = `.node[data-p="${id}"]`; await p.$eval(s, e => { e.scrollIntoView({block: 'center', inline: 'center'}); scrollTo(0, 0); }); await p.click(s, {force: true}); await p.waitForTimeout(F ? 450 : 250);
          if (F) { await p.click(s, {force: true}); await p.waitForTimeout(150); }
          if (await p.isHidden('#card')) { bad.push(`${play} ${id}: no card`); continue; } n++; const r = await p.evaluate(judge); if (r) bad.push(`${play} ${r}`);
          // AEM Sites is now part of the one "AEM Sites with Edge Delivery Services" box (eds), which carries its connections, so that box's bolts are swept
          if (!F && id !== ids[0] || F && !['rtcdp', 'ajo', 'workfront', 'cw', 'eds'].includes(id)) continue;
          for (const c of await p.$$eval('.ib', bs => bs.filter(b => b.getBoundingClientRect().width > 0).map(b => b.dataset.c))) {
            await p.evaluate(() => hideCard(true)); const bs = `.ib[data-c="${c}"]`; await p.$eval(bs, e => e.scrollIntoView({block: 'nearest', inline: 'nearest'}));
            try { await p.click(bs, {timeout: 1500}); } catch (e) { bad.push(`${play} ${id}: bolt ${c} can't be clicked`); continue; }
            await p.waitForTimeout(100); if (await p.isHidden('#card')) continue; n++; const r2 = await p.evaluate(judge); if (r2) bad.push(`${play} ${r2}`); } }
        await p.context().close(); }
      ok(!bad.length && n > 60, `item 26: at ${w}x${h} on all seven plays, ${n} cards each end within the window, never cover their own box or bolt, leave the selected product's bolts clickable and cover no box where a clean spot exists`, bad.slice(0, 8).join(' | ')); } }
  // 24. (item 28) the outside boxes' names sit below the OUTSIDE ADOBE label on one line; the card keeps the full name
  for (const w of [1280, 1440]) { const p = await fresh({width: w, height: 900}); await pick(p, 'custom'); await all14(p);
    await p.evaluate(() => { for (const id of ['csrc', 'cms', 'search', 'dwh']) addOutside(id); }); await p.waitForTimeout(500);
    const r = await p.evaluate(() => { const s = Number(/scale\(([0-9.]+)\)/.exec(document.getElementById('stage').style.transform)[1]);
      return [...document.querySelectorAll('.node.out')].map(n => { const nr = n.getBoundingClientRect(), nm = (n.querySelector('.nn > span:last-child') || n.querySelector(':scope > span:last-of-type')).getBoundingClientRect();
        return {id: n.dataset.p, top: (nm.top - nr.top) / s, one: nm.height / s < 30, fit: nm.bottom <= nr.bottom - 2}; }); });
    ok(r.length === 4 && r.every(x => x.top >= 22 && x.one && x.fit), `item 28: at ${w} px every outside box's name sits below OUTSIDE ADOBE on one line`, JSON.stringify(r));
    await tapNode(p, 'csrc'); await p.waitForTimeout(300); await p.click('#fb-svc'); await p.waitForTimeout(300);
    ok((await p.textContent('#card h4')).trim() === 'Authoring documents' && (await p.textContent('.node[data-p="csrc"]')).includes('Authoring docs'), 'item 28: the box says Authoring docs and its card keeps Authoring documents');
    await p.context().close(); }
  // 25. (item 38) a product whose services were all removed says No services
  { const p = await fresh(); await pick(p, 'coworker'); await tapNode(p, 'cw'); await p.waitForTimeout(300);
    for (const l of await p.$$eval('#card .ln:not(details .ln) [data-t]', es => es.map(e => e.dataset.t))) { await p.click(`#card [data-t="${l}"]`); await p.waitForTimeout(120); }
    const c = (await p.textContent('.node[data-p="cw"] .cnt')).trim();
    ok(c === 'No services', 'item 38: Coworker on its own with every service removed says No services, not Services on its connections', c);
    await p.context().close(); }
  // 26. (item 39; step 95 took the bolt hint out, Adam Nov 14) focus view: Continue sits just under the focus bar, before and after a
  // product is selected, and covers no box or bolt
  { const p = await fresh(); await pick(p, 'custom'); await all14(p);
    const clear = () => p.evaluate(() => { const s = document.getElementById('save').getBoundingClientRect(), b = document.getElementById('fbar').getBoundingClientRect(), hit = r => r.width && r.left < s.right && s.left < r.right && r.top < s.bottom && s.top < r.bottom;
      return !document.getElementById('fbar').hidden && s.top >= b.bottom && s.top - b.bottom <= 14 && ![...document.querySelectorAll('.node,.ib')].some(e => hit(e.getBoundingClientRect())); });
    const c0 = await clear(); await tapNode(p, 'cja'); await p.waitForTimeout(300); const c1 = await clear();
    await p.click('#fb-clear'); await p.waitForTimeout(200); const c2 = await clear();
    ok(!(await p.$('#hint')) && c0 && c1 && c2, 'item 39, step 95: in focus view Continue sits just under the focus bar, clear of every box and bolt, with or without a product selected', JSON.stringify([c0, c1, c2]));
    await p.context().close(); }
  // 27. (item 43) no bolt sits under a Recommended tag
  for (const w of [1440, 1280, 768]) { const p = await fresh({width: w, height: 900}); const bad = [];
    for (const set of [['bv', 'cja', 'eds', 'commerce', 'so'], ['bv', 'cja', 'rtcdp', 'ajo', 'target', 'eds', 'commerce', 'so', 'aemsites']]) { await pick(p, 'custom');
      await p.evaluate(s => { for (const id of s) addProduct(id); openAdd(false); addOutside('cdn'); addOutside('search'); }, set); await p.keyboard.press('Escape'); await p.waitForTimeout(500);
      if (await p.isVisible('#fbar')) { await tapNode(p, 'bv'); await p.waitForTimeout(400); }
      bad.push(...await p.evaluate(() => { const recs = [...document.querySelectorAll('.node .rec')].map(e => e.getBoundingClientRect());
        return [...document.querySelectorAll('.ib')].filter(b => { const r = b.getBoundingClientRect(); return recs.some(k => r.left < k.right && k.left < r.right && r.top < k.bottom && k.top < r.bottom); }).map(b => b.dataset.c); }));
      await p.evaluate(() => localStorage.clear()); }
    ok(!bad.length, `item 43: at ${w} px no lightning bolt sits under a Recommended tag`, bad.join(','));
    await p.context().close(); }

  // 28. (items 4, 5, 6, 7, 11, 12, 29, 37, 45; the content pass) every play's SOW with every service on carries no partner notes, tool hints,
  // internal line IDs or lowercase "the client"; Create your own play with every product on hands over conditions, not instructions
  const allOn = p => p.evaluate(() => { for (const s of catalog().filter(x => x.plays.includes(state.play))) { const r = state.estimates[state.play][s.id]; if (r) r.on = true; } render(); save(); });
  const assumptionsOf = p => p.evaluate(() => selectedLines().map(l => l.name + ': ' + l.assumptions));
  const NOTES = /confirm eligibility|before proposing|sales plays?\b|partner's choice|reset the band|usual start|Adjust the prompt count|Small band|reaches CJA only|video that appear |health care clients|client-managed|\bplays?\b/i;
  const IMPERATIVE = /(^|[;.(:]\s*|\bso\s+)(confirm|prove it)\b/i;
  const IDS = /\b(XA14|XA20|SI02|AXD04)\b|Connection: /;
  for (const play of ['cja', 'commerce', 'aem', 'fsi', 'abv', 'coworker', 'custom']) {
    const p = await fresh(); await pick(p, play); await p.fill('#rate', '150');
    if (play === 'custom') await all14(p);
    await cont(p); await allOn(p); const t = await docText(p), a = await assumptionsOf(p);
    const n = t.match(NOTES), lower = t.match(/.{60}\bthe client(?![-\w]).{20}/), your = t.replace(/bring-your-own/g, 'external').match(/.{60}\byour\b.{20}/i), imp = a.filter(x => IMPERATIVE.test(x.split(': ').slice(1).join(': ')));
    ok(!n && !lower && !your && !IDS.test(t) && !imp.length, `items 4 to 7, 11, 12, 29, 37, 45: the ${play} SOW with every service on has no partner note, tool hint, line ID, "the client" or "your", and no assumption tells the partner to confirm or prove something`,
      JSON.stringify({note: n && t.slice(Math.max(0, n.index - 80), n.index + 40), lower, your, ids: t.match(IDS), imp: imp.slice(0, 3)}));
    if (play === 'cja') ok(t.includes('derived fields are not included in CJA Foundation') && t.includes('CJA audience publishing to Real-Time Customer Profile needs one of them') && t.includes('through the Adobe Brand Visibility source'),
      'items 16, 17 and 45: the CJA SOW assumes CJA Select or higher, Real-Time CDP or Journey Optimizer for C06, and says how the AI-agent data reaches CJA');
    if (play === 'custom') ok(t.includes('Assumes the Client has Target Premium.') && t.includes('Assumes the Client has Journey Optimizer Ultimate or the Offer Decisioning add-on.') && !t.includes('Not stated by Adobe') && !/confirmed with Adobe for the Client's tenant/.test(t)
      && t.includes('Availability: The Client confirms the licensed products, shared sandbox, permissions and publishing configuration described in the prerequisites. Prerequisites for Real-Time CDP + Customer Journey Analytics: Real-Time CDP and CJA working on the same Experience Platform sandbox')
      && (a.find(x => x.startsWith('Adaptive forms on AEM Sites pages: ')) || '').startsWith('Adaptive forms on AEM Sites pages: Prerequisites for AEM Forms + AEM Sites: Adaptive Forms Core Components') && !/Availability: [^:]{0,400}Prerequisites for AEM Forms \+ AEM Sites:/.test(t),
      'items 6 and 18 (step 86): on Create your own play the new package tags print "Assumes the Client has ...", no availability says "Not stated by Adobe" or waits on Adobe\'s confirmation, a connection that keeps an availability prints it as a condition with an owner before its prerequisites, and one with none prints its prerequisites alone',
      JSON.stringify({notStated: (t.match(/.{60}Not stated by Adobe.{80}/) || [''])[0], forms: (a.find(x => x.startsWith('Adaptive forms on AEM Sites pages: ')) || '').slice(0, 160)}));
    if (play === 'fsi') { const r = await p.$eval('#readiness', e => e.textContent);
      // step 86: nothing asks for Adobe's written confirmation that Coworker is available, and the statement of work is not held for it
      ok(!/written confirmation|record Adobe|Coworker is available to the Client's organization/.test(r) && /to finish before you issue this SOW/.test(r), 'item 5 (step 86): on the FSI play Before you issue lists no Coworker service for Adobe\'s written confirmation', r.slice(0, 400));
      await p.evaluate(() => { state.estimates.fsi.CW00.assumptions += ' Kickoff is planned for the second week.'; render(); });
      const r2 = await p.$eval('#readiness', e => e.textContent);
      ok(!/written confirmation|still hold a note to you|confirm eligibility/.test(r2) && !/Coworker shared setup and enablement: record/.test(r2), 'item 5 (step 86): an edited Coworker assumption is not listed for a confirmation or a note either', r2.slice(0, 400)); }
    if (play === 'aem' || play === 'commerce') { await p.evaluate(() => { state.estimates[state.play].L03.on = false; render(); }); const t2 = await docText(p);
      ok(!/moves the deployment pilot|(ahead of|handoff to) the deployment pilot|deployment pilot itself/.test(t2), `item 14: the ${play} SOW without the deployment pilot never points to it in the dependencies or CDN readiness`, (t2.match(/.{80}deployment pilot.{40}/) || [''])[0]); }
    await p.context().close();
  }
  // 29. (item 6) an assumption prefilled before step 47 ("Connection: ...") takes the SOW version on the next hand-over; what the partner added stays
  { const p = await fresh(); await pick(p, 'custom'); await p.fill('#rate', '150'); await all14(p); await cont(p);
    const id = await p.evaluate(() => { const c = state.canvas.find(x => x.concept && x.plays.includes('custom') && /^Availability: /.test(x.assumptions)); const old = 'Connection: Native integration. ' + c.assumptions;
      c.assumptions = old; state.estimates.custom[c.id].assumptions = old + ' The Client confirmed the tenant on 2026-11-01.'; save(); return c.id; });
    await build(p); await cont(p);
    const r = await p.evaluate(id => ({now: state.estimates.custom[id].assumptions, pre: state.canvas.find(x => x.id === id).assumptions}), id);
    ok(r.now === r.pre + ' The Client confirmed the tenant on 2026-11-01.' && !/^Connection: /.test(r.now), 'item 6: an old "Connection: ..." prefill gives way to the SOW version and the partner\'s added sentence stays', JSON.stringify(r));
    await p.context().close(); }
  // 30. (items 7, 16 to 18, 29 to 32, 44) the canvas data: needs tags, your client, aem.live, the B2B editions, XA20, the Data Mirror conflict
  { const p = await fresh(); await pick(p, 'custom');
    const r = await p.evaluate(() => { const cn = Object.fromEntries(CAT.connections.map(c => [c.id, c])), L = CAT.lines;
      const shown = [...CAT.products.flatMap(x => [x.name, x.title, x.systems, x.rec]), ...CAT.connections.flatMap(c => [c.how, c.label, c.availability, c.tier, c.covered, ...(c.prereqs || []), ...(c.flows || []).map(f => f.what), c.gain && c.gain.title, c.gain && c.gain.text]),
        ...Object.values(L).flatMap(l => [l.name, l.scope, l.ext, l.tier])].filter(x => typeof x === 'string');
      return {tags: [L.C01.tier, L.C06.tier, L.C06.ext, L.OX3.tier, L.SO1.tier, L.TG04.tier, L.XA15.tier, L.XB07.tier, L.AXC05.tier, L.XC10.tier, !!L.AXA02.ext],
        lower: shown.filter(s => /\b[Tt]he client(?![-\w])|\b[Cc]lients\b|\b[Yy]our\b(?! client)/.test(s.replace(/Your client|your client/g, '').replace(/bring-your-own/g, 'external'))),
        aem: cn['ajo-eds'].label, b2b: cn['cw-rtcdp'].availability, b2bLabel: cn['cw-rtcdp'].label, b2bPre: cn['cw-rtcdp'].prereqs, dwhPre: cn['dwh-cja'].prereqs, xa20: L.XA20.scope, dwh: cn['dwh-cja'].availability, ids: shown.filter(s => /\((SI02|AXD04)\)|XA20:|priced only as XA14/.test(s)),
        old: shown.filter(s => /health care clients|client-managed|Aem\.live|\(B2B Edition coming soon\)|panel and the B2B edition/.test(s))}; });
    ok(r.tags.join('|') === 'CJA Select or higher|CJA Select or higher|Real-Time CDP or Journey Optimizer|CJA Select or higher|Sites Optimizer Ultimate|Target Premium|Real-Time CDP Prime or Ultimate|CJA Prime or higher (graph-based stitching)|Sites Optimizer Ultimate|the CIF add-on|true',
      'items 16 to 18: the services that need a package or product carry its tag', r.tags.join('|'));
    ok(!r.lower.length && !r.ids.length && !r.old.length, 'items 4, 7, 29 to 31: no shown canvas text says "the client", generic "clients" or a bare "your", cites a line ID, or keeps the old wording', JSON.stringify({lower: r.lower.slice(0, 4), ids: r.ids, old: r.old}));
    ok(r.aem.startsWith('The aem.live martech plugin') && r.b2b === '' && r.b2bLabel === "Adobe's audience skills in Coworker for Real-Time CDP B2C" && r.b2bPre[0] === 'CX Enterprise Coworker license' && r.b2bPre[1] === 'Real-Time CDP B2C Edition' && !r.b2bPre.some(x => /confirm|health care|finance/i.test(x))
      && r.xa20.includes("storefront configuration, connect your client's consent management platform")
      && r.dwh === 'Data Mirror requires CJA Select, Prime or Ultimate (not CJA Foundation) and the appropriate Data Mirror license.' && r.dwhPre[0] === 'CJA Select, Prime or Ultimate' && r.dwhPre.some(x => x.startsWith('Use the CDC datasets created for CJA Data Mirror for CJA analysis only')) && !/feature enablement|confirmed with|beta|limited release|June 17, 2026/i.test(r.dwh + r.dwhPre.join(' ')),
      'items 30 to 32 and 44 (step 86): aem.live; Coworker for Real-Time CDP B2C has no availability caveat and keeps its Coworker license and B2C Edition prerequisites; XA20 as a sentence; Data Mirror keeps its CJA package, license and dataset conflict with no feature enablement to confirm', JSON.stringify({aem: r.aem, b2b: r.b2b, b2bPre: r.b2bPre, dwh: r.dwh, dwhPre0: r.dwhPre[0], xa20: r.xa20.slice(0, 120)}).slice(0, 900));
    await p.context().close(); }

  // 30. (step 48, fix 2) the rehearsal's card: the Brand Visibility + CJA lightning bolt opens a card tall enough to read
  // at laptop sizes, inside the window below the tabs, scrolled to its top with its close X showing, clear of its bolt
  for (const [w, h] of [[1440, 900], [1536, 864], [1280, 800]]) { const p = await fresh({width: w, height: h}); await pick(p, 'cja'); await p.fill('#rate', '150');
    await p.click('#view-all'); await p.waitForTimeout(400);   // Nov 18 2026: CJA opens in Explore one product; Show all connections draws every bolt
    // and they pop in over 0.6 s (.ib.enter): clicked mid-pop, the click retries and scrolls the bolt to the top of the window, so wait for the pop to end
    await p.waitForFunction(() => [...document.querySelectorAll('.ib')].every(b => !b.getAnimations().length));
    await p.click('.ib[data-c="bv-cja"]'); await p.waitForTimeout(400);
    const r = await p.evaluate(() => { const c = document.getElementById('card'), cr = c.getBoundingClientRect(), tb = document.querySelector('.tabs').getBoundingClientRect(), x = c.querySelector('.close').getBoundingClientRect();
      const at = e => { const q = e.getBoundingClientRect(), k = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return !!k && e.contains(k); };
      return {h: Math.round(cr.height), top: Math.round(cr.top), bottom: Math.round(cr.bottom), tabs: Math.round(tb.bottom), ih: innerHeight, st: c.scrollTop, x: x.top >= cr.top && at(c.querySelector('.close')), bolt: at(document.querySelector('.ib[data-c="bv-cja"]'))}; });
    ok(r.h >= 600 && r.top >= r.tabs && r.bottom <= r.ih && r.st === 0 && r.x && r.bolt, `step 48 fix 2: at ${w}x${h} the Brand Visibility + CJA card opens ${r.h} px tall (was 220), below the tabs and inside the window, at its top with its close X, its bolt clear`, JSON.stringify(r));
    await p.context().close(); }
  // 31. (step 48, fix 4) "Also needs Real-Time CDP or Journey Optimizer" shows only while neither is on the canvas
  { const p = await fresh(); await pick(p, 'cja'); await p.fill('#rate', '150');
    const need = () => p.evaluate(() => { hideCard(true); showCard('p', 'cja'); const l = document.querySelector('#card [data-l="C06"]'); return l ? l.textContent : 'no line'; });
    const cja = await need(), on = await p.evaluate(() => counted('C06'));
    await p.evaluate(() => localStorage.clear()); await pick(p, 'custom'); await p.evaluate(() => { for (const id of ['bv', 'cja']) addProduct(id); openAdd(false); }); await p.waitForTimeout(300); const none = await need();
    await p.evaluate(() => { addProduct('rtcdp'); openAdd(false); }); await p.waitForTimeout(300); const rt = await need();
    await p.evaluate(() => { removeProduct('rtcdp'); addProduct('ajo'); openAdd(false); }); await p.waitForTimeout(300); const jo = await need();
    ok(cja.includes('Also needs Real-Time CDP or Journey Optimizer') && on && none.includes('Also needs') && !rt.includes('Also needs') && !jo.includes('Also needs'),
      'step 48 fix 4: Audiences that act on the data says Also needs Real-Time CDP or Journey Optimizer on the CJA play (still counted there) and on a canvas without either, and not once Real-Time CDP or Journey Optimizer is on it', JSON.stringify({cja, on, none, rt, jo}).slice(0, 500));
    await p.context().close(); }
  // 32. (step 48, fix 5) the banking question offers no Coworker chip, before or after the CJA chip
  { const p = await fresh(); await p.goto(BASE); await p.waitForTimeout(400);
    await p.fill('#bp-q', 'banking customers call about rates'); await p.press('#bp-q', 'Enter'); await p.waitForSelector('#bp-body .bp-ans', {timeout: 5000}); await p.waitForTimeout(950);
    const chips = () => p.$$eval('[data-bpr]', es => es.map(e => e.textContent)); const first = await chips();
    await p.click('[data-bpr]:has-text("My client licenses CJA")'); await p.waitForTimeout(1200); const then = await chips();
    const cw = await p.evaluate(() => document.querySelector('.bp-ans:last-of-type .bp-prods').textContent);
    ok(first.includes('My client licenses CJA') && ![...first, ...then].some(c => /conversation summaries|Coworker/.test(c)) && !cw.includes('Coworker'),
      'step 48 fix 5: the banking question offers no chip that adds Coworker, before or after My client licenses CJA, and recommends no Coworker', JSON.stringify({first, then, cw}).slice(0, 500));
    await p.context().close(); }

  // (later passes of step 47 add their sections above this line)
  ok(!errs.length, 'no script errors', errs.join(' | '));
  await b.close(); server.close();
  console.log(fails ? `${fails} STEP 47 CHECK(S) FAILED` : 'ALL STEP 47 CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})();
