// Click test for step 11, "Add your own service" on the Services step.  node sow/test_own_service.js sow/index.html
const {chromium} = require('playwright');
const path = require('path');
const FILE = 'file://' + path.resolve(process.argv[2] || path.join(__dirname, 'index.html'));
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + d + ']')); if (!c) fails++; };

(async () => {
  const b = await chromium.launch();
  const errs = [];
  const open = async (w = 1440) => { const ctx = await b.newContext({viewport: {width: w, height: 950}}); const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); p.on('dialog', d => { errs.push('dialog'); d.dismiss(); });
    await p.goto(FILE); return p; };
  // which group each card and button sits in: the nearest stage heading above it
  const layout = p => p.evaluate(() => { let g = ''; return [...document.querySelectorAll('#service-lines > *')].map(el => {
    if (el.classList.contains('stage-head')) { g = el.querySelector('h3').textContent; return {k: 'head', g}; }
    if (el.classList.contains('service-card')) return {k: 'card', g, id: el.dataset.line, custom: !!el.querySelector('.custom-tag')};
    if (el.matches('[data-own]')) return {k: 'own', g, label: el.textContent.trim(), stage: el.dataset.own};
    if (el.matches('[data-own-form]')) return {k: 'form', g, stage: el.dataset.ownForm};
    return {k: el.className, g}; }); });
  const totals = p => p.$$eval('.total-card strong', e => e.map(x => x.textContent.trim()));
  const money = s => Number(s.replace(/[^0-9.]/g, ''));

  // 1. every play: one button at the end of each group
  for (const play of ['cja', 'commerce', 'aem', 'fsi', 'abv', 'coworker']) {
    const p = await open(); await p.evaluate(x => { state.play = x; go('scope'); }, play); await p.click('[data-step="services"]'); await p.waitForTimeout(120);
    const L = await layout(p);
    const owns = L.filter(x => x.k === 'own');
    const groups = [...new Set(L.filter(x => x.k === 'head').map(x => x.g))];
    ok(owns.length === groups.length && owns.every(o => o.label === `Add your own ${o.stage} service` && o.g === o.stage), `${play}: one "Add your own ... service" button per group (${owns.map(o => o.stage).join(', ')})`);
    const lastCardIdx = g => L.map((x, i) => x.k === 'card' && x.g === g ? i : -1).filter(i => i >= 0).pop();
    ok(owns.every(o => L.indexOf(o) === lastCardIdx(o.stage) + 1), `${play}: each button sits right after the last service in its group`);
    await p.context().close();
  }

  // 2. add a Launch line on the CJA play
  const p = await open(); await p.evaluate(x => { state.play = x; go('scope'); }, 'cja'); await p.click('[data-step="services"]'); await p.fill('#service-rate', '150'); await p.waitForTimeout(150);
  const before = await totals(p);
  await p.click('[data-own="Launch"]'); await p.waitForTimeout(100);
  let L = await layout(p);
  ok(L.some(x => x.k === 'form' && x.stage === 'Launch') && !L.some(x => x.k === 'own' && x.stage === 'Launch'), 'clicking it opens the form in place of the button');
  ok(await p.evaluate(() => document.activeElement && document.activeElement.name === 'own-name'), 'the cursor lands in Service name');
  await p.click('[data-own-form] button[type="submit"]'); await p.waitForTimeout(100);
  ok((await layout(p)).filter(x => x.custom).length === 0, 'an empty form adds nothing');
  await p.fill('[name="own-name"]', 'Kickoff with the agency of record'); await p.fill('[name="own-hours"]', '12');
  await p.fill('[name="own-scope"]', 'One kickoff session with the customer\'s agency to agree roles, access and timing.');
  await p.click('[data-own-form] button[type="submit"]'); await p.waitForTimeout(150);
  L = await layout(p);
  const c1 = L.find(x => x.custom);
  ok(c1 && c1.g === 'Launch', 'the new line lands in Launch, tagged Custom', JSON.stringify(c1));
  const lastLaunch = L.map((x, i) => x.k === 'card' && x.g === 'Launch' ? i : -1).filter(i => i >= 0).pop();
  ok(L[lastLaunch] && L[lastLaunch].custom && L[lastLaunch + 1].k === 'own', 'it sits at the end of Launch, just above the button');
  const after = await totals(p);
  ok(money(after[0]) - money(before[0]) === 1800, 'one-time total rises by 12 hours at $150 ($1,800)', `${before[0]} to ${after[0]}`);
  ok((await p.textContent('#toast')).includes('added to Launch'), 'a note says it was added to Launch');

  // 3. a monthly line in Optimize, then cancel
  await p.click('[data-own="Optimize"]'); await p.fill('[name="own-name"]', 'Quarterly AI search briefing'); await p.fill('[name="own-hours"]', '6');
  await p.selectOption('[name="own-cadence"]', 'monthly'); await p.fill('[name="own-scope"]', 'A short briefing on what changed in AI answers.');
  await p.click('[data-own-form] button[type="submit"]'); await p.waitForTimeout(150);
  L = await layout(p);
  ok(L.filter(x => x.custom).map(x => x.g).join(',') === 'Launch,Optimize', 'a monthly line lands in Optimize');
  const after2 = await totals(p);
  ok(money(after2[1]) - money(after[1]) === 900, 'monthly total rises by 6 hours at $150 ($900 a month)', `${after[1]} to ${after2[1]}`);
  await p.click('[data-own="Connect"]'); await p.fill('[name="own-name"]', 'Not this one'); await p.click('[data-own-cancel]'); await p.waitForTimeout(100);
  L = await layout(p);
  ok(!L.some(x => x.k === 'form') && L.filter(x => x.custom).length === 2, 'Cancel closes the form and adds nothing');

  // 4. size, document, saving
  for (const size of ['small', 'large']) { await p.evaluate(s => { const x = [...document.querySelectorAll('[data-size]')].find(y => y.dataset.size === s); x && x.click(); }, size); await p.waitForTimeout(100); }
  const hrs = await p.$$eval('.service-card', cs => cs.filter(c => c.querySelector('.custom-tag')).map(c => c.querySelector('[data-line-field="hours"]').value));
  ok(hrs.join(',') === '12,6', 'your own lines keep their hours when the customer size changes', hrs.join(','));
  await p.click('[data-go="document"]'); await p.waitForTimeout(200);
  const doc = await p.textContent('#sow-preview');
  ok(doc.includes('Kickoff with the agency of record') && doc.includes('Quarterly AI search briefing'), 'both lines appear in the statement of work');
  const saved = await p.evaluate(() => JSON.parse(localStorage.getItem('partner-sow-studio-v6')).custom.map(c => c.stage).join(','));
  ok(saved === 'Launch,Optimize', 'the browser copy remembers each line\'s group', saved);
  await p.reload(); await p.click('[data-step="services"]'); await p.waitForTimeout(150);
  L = await layout(p);
  ok(L.filter(x => x.custom).map(x => x.g).join(',') === 'Launch,Optimize', 'after a reload they are still in their groups');

  // 5. the library's own form still works as before
  await p.click('#add-service'); await p.click('.custom-entry summary'); await p.fill('#custom-name', 'From the library'); await p.fill('#custom-scope', 'Library form still works.');
  await p.click('#custom-form button[type="submit"]'); await p.waitForTimeout(150);
  L = await layout(p);
  ok(L.filter(x => x.custom).map(x => x.g).join(',') === 'Launch,Optimize,Optimize', 'the library\'s Create a custom service still works and lands in Optimize');

  // 6. text and a phone
  const ui = await p.evaluate(() => document.getElementById('service-lines').innerText);
  ok(!/[–—]/.test(ui), 'no en or em dashes');
  const ph = await open(390); await ph.evaluate(x => { state.play = x; go('scope'); }, 'cja'); await ph.click('[data-step="services"]'); await ph.click('[data-own="Launch"]'); await ph.waitForTimeout(100);
  const sw = await ph.evaluate(() => document.documentElement.scrollWidth);
  ok(sw <= 390, 'on a phone the form fits without sideways scrolling', String(sw));

  ok(errs.length === 0, 'no script errors', errs.join(' | ').slice(0, 300));
  await b.close();
  console.log(fails ? `${fails} CHECK(S) FAILED` : 'ALL OWN-SERVICE CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})();
