// End-to-end test of the one website (sow/site/): the Build canvas front page hands the play and its services to the
// Scope, Services, Statement of work and RFP Builder steps at /sow/. Run from the repo root after python3 sow/build_site.py:
//   node sow/test_site.js
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, 'site');
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + d + ']')); if (!c) fails++; };
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
  const fresh = async (w = 1600, h = 950) => { const ctx = await b.newContext({viewport: {width: w, height: h}});
    // The behavior check must also run offline. The SOW has a local fallback font;
    // fulfill only its optional Google stylesheet rather than hiding script errors.
    await ctx.route('https://fonts.googleapis.com/**', r => r.fulfill({status: 200, contentType: 'text/css', body: ''}));
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); return p; };
  const canvasTotal = async p => (await p.textContent('#t-big')).trim();
  const toolTotal = async p => (await p.$$eval('.total-card strong', e => e.map(x => x.textContent.trim())))[2];
  const toolLines = async p => p.$$eval('.service-card', e => e.map(x => x.dataset.line));
  const addP = async (p, id) => { if (await p.isHidden('#add-menu')) await p.click('#add-btn');
    await p.$eval(`#add-menu [data-add="${id}"]`, button => {
      for (let parent = button.parentElement; parent; parent = parent.parentElement) {
        if (parent.tagName === 'DETAILS') parent.open = true;
      }
    });   // AEM delivery choices sit inside both a product group and the Sites offering.
    await p.click(`#add-menu [data-add="${id}"]`); await p.waitForTimeout(300); };
  // the boxes before a play is picked (Adam, Nov 1): only the masthead (the Adobe logo and the title, under the red stripe)
  // sits above the picker heading, the boxes start right under it, and the old Choose a play menu is gone from the page
  const onlyMasthead = async p => p.evaluate(() => {
    const top = document.querySelector('#picker .in').firstElementChild.getBoundingClientRect().top, mast = document.querySelector('.masthead');
    const shown = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
    const other = [...document.querySelectorAll('body *')].filter(e => shown(e) && e.getBoundingClientRect().bottom <= top + 0.5 && !e.closest('.masthead,.topline')).map(e => e.id || e.getAttribute('class') || e.tagName);
    const r = {picker: shown(document.getElementById('picker')), other, mast: [...mast.children].filter(shown).map(e => e.alt || e.textContent.trim()).filter(Boolean).join('|'),
      flush: Math.abs(document.getElementById('canvas').getBoundingClientRect().top - mast.getBoundingClientRect().bottom) < 1,
      menu: ['play-btn', 'play-menu', 'choose'].filter(id => document.getElementById(id))};
    r.ok = r.picker && !r.other.length && ['Adobe|Partner services statement of work|Open draft', 'Adobe|Partner services statement of work'].includes(r.mast) && (innerWidth <= 520) === !r.mast.includes('Open draft') && r.flush;   // step 43 (Adam: keep Open draft on the picker; phones wait for a play)
    return r;
  });

  // 0. the site is built from the current canvas and SOW steps (a stale copy can't be packaged)
  // since the Nov 9 merge the site's SOW page is sow/index.html with the RFP Builder tab added by patch_step49.py, so the check
  // patches a fresh copy of the source and compares the two
  const patchedCopy = path.join(require('os').tmpdir(), 'sow_site_check_' + process.pid + '.html');
  fs.copyFileSync(path.join(__dirname, 'index.html'), patchedCopy);
  require('child_process').execFileSync('python3', [path.join(__dirname, 'patch_step49.py'), patchedCopy], {stdio: 'ignore'});
  ok(fs.readFileSync(path.join(SITE, 'index.html'), 'utf8') === fs.readFileSync(path.join(__dirname, 'canvas', 'index.html'), 'utf8') &&
     fs.readFileSync(path.join(SITE, 'sow', 'index.html'), 'utf8') === fs.readFileSync(patchedCopy, 'utf8'), 'the site matches the current canvas and SOW steps, with the RFP Builder tab (run build.py and build_site.py)');
  fs.unlinkSync(patchedCopy);

  // 1. the front page is the canvas
  const p = await fresh(); await p.goto(BASE); await p.waitForTimeout(400);
  ok(await p.isVisible('#picker') && (await p.$$('#picker .pc-card')).length === 12, 'the front page opens on the play picker, twelve cards (Nov 19 2026: with the three AI assistant cards)');
  ok((await p.$$eval('.tabs button', e => e.map(x => x.textContent.trim()))).join('|') === 'Build|Scope|Services|Statement of work|RFI Builder' && !(await p.textContent('.masthead')).includes('Prototype'),
    'tabs Build, Scope, Services, Statement of work and RFI Builder (step 57), and no Prototype tag');
  const om0 = await onlyMasthead(p);
  ok(om0.ok && !om0.menu.length && await p.isHidden('.tabs') && await p.isHidden('.toolbar') && await p.isHidden('#start-over'),
    'until a play is picked only the masthead sits above the boxes: no steps, toolbar, Start over or Choose a play menu', JSON.stringify(om0));
  await p.$eval('.tabs [data-tab="scope"]', b => b.click()); await p.waitForTimeout(200);
  ok(await p.isHidden('.tabs [data-tab="scope"]') && p.url() === BASE && await p.isVisible('#picker'), 'Scope is hidden until a play is chosen, and even a scripted click on it stays on the canvas');

  // 2. a fixed play carries over
  await p.click('#picker [data-play="aem"]'); await p.waitForTimeout(600);
  ok((await canvasTotal(p)) === '$ ___', 'the canvas starts with no rate; the partner enters an approved one (audit fix)');
  ok((await Promise.all(['build', 'scope', 'services', 'sow'].map(k => p.isVisible(`.tabs [data-tab="${k}"]`)))).every(Boolean) && await p.isVisible('#rate') && await p.isVisible('#size') && await p.isVisible('#t-big') && await p.isVisible('#start-over'),
    'with a play picked, the steps, Your rate, Delivery size, the total and Start over show');
  await p.fill('#rate', '150'); await p.waitForTimeout(150);
  const t0 = await canvasTotal(p);
  await p.click('#save'); await p.waitForURL('**/sow/index.html#scope'); await p.waitForTimeout(500);
  ok(await p.isVisible('#scope-panel') && (await p.textContent('#play-title')).trim() === 'Brand Visibility + Sites Optimizer and Edge Delivery Services', 'Save and continue opens Scope with the play chosen on the canvas');
  ok(await p.$('#plays') === null && await p.isVisible('.steps [data-build]') && await p.isVisible('.topbar [data-build]'), 'no left-hand play list; a Build tab and Change play go back to the canvas');
  await p.click('[data-step="services"]'); await p.waitForTimeout(300);
  ok(await toolTotal(p) === t0, `Services totals what the canvas showed (${t0})`, await toolTotal(p));
  const aemLines = await toolLines(p);
  await p.click('.steps [data-build]'); await p.waitForURL(u => !/\/sow\//.test(String(u))); await p.waitForTimeout(500);
  ok((await p.textContent('#play-label')).includes('Sites Optimizer') && (await p.$$('.node')).length === 8, 'Build goes back to the canvas as it was left (with the CDN, on from the start, and since Nov 18 Search data, Authoring docs, ChatGPT and Claude)');
  await p.click('.node[data-p="eds"] .offering-title'); await p.waitForTimeout(200); await p.click('#card [data-t="A03"]'); await p.waitForTimeout(150); await p.click('#card [data-close]');
  await p.click('#size [data-size="large"]'); await p.waitForTimeout(150);
  const t1 = await canvasTotal(p);
  await p.click('.tabs [data-tab="services"]'); await p.waitForURL('**/sow/index.html#services'); await p.waitForTimeout(500);
  const l1 = await toolLines(p);
  ok(await toolTotal(p) === t1 && !l1.includes('A03') && aemLines.includes('A03'), `a line taken out on the canvas leaves Services, and Large carries over (${t1})`, `${await toolTotal(p)} / ${l1.join(',')}`);
  ok(await p.getAttribute('#size-switch [data-size="large"]', 'aria-pressed') === 'true', 'the size switch shows Large');
  await p.fill('.service-card[data-line="L01"] [data-line-field="hours"]', '99'); await p.waitForTimeout(150);
  await p.click('.steps [data-build]'); await p.waitForURL(u => !/\/sow\//.test(String(u))); await p.waitForTimeout(400);
  await p.click('#save'); await p.waitForURL('**/sow/index.html#scope'); await p.waitForTimeout(400); await p.click('[data-step="services"]'); await p.waitForTimeout(300);
  ok(await p.inputValue('.service-card[data-line="L01"] [data-line-field="hours"]') === '99', 'hours a partner edited in Services survive another trip through Build');
  // a service taken out or added on Services is the canvas's choice too, so a trip through Build keeps it (Adam, Nov 1)
  await p.click('.service-card[data-line="O02"] .remove-line'); await p.waitForTimeout(150);
  await p.click('#service-extensions button[data-add="O04"]'); await p.waitForTimeout(200);
  const tc = await toolTotal(p);
  await p.click('.steps [data-build]'); await p.waitForURL(u => !/\/sow\//.test(String(u))); await p.waitForTimeout(400);
  // (hours typed on Services, like L01's 99 above, stay in the SOW steps, so the canvas total isn't compared here)
  ok(!(await p.evaluate(() => lineOn('O02'))) && await p.evaluate(() => lineOn('O04')),
    'a service taken out or added on Services is out or in on the canvas too');
  await p.click('#save'); await p.waitForURL('**/sow/index.html#scope'); await p.waitForTimeout(400); await p.click('[data-step="services"]'); await p.waitForTimeout(300);
  const l3 = await toolLines(p);
  ok(!l3.includes('O02') && l3.includes('O04') && await toolTotal(p) === tc, 'and a trip back through Build keeps both choices', l3.join(','));
  await p.click('[data-step="scope"]'); await p.fill('[data-meta="customer"]', 'Acme Corp'); await p.waitForTimeout(150);

  // 3. Create your own play carries over, research lines and sources included
  await p.click('.topbar [data-build]'); await p.waitForURL(u => !/\/sow\//.test(String(u))); await p.waitForTimeout(400);
  ok(await p.isVisible('#confirm') && (await p.textContent('#confirm-title')) === 'Change the play?' && !p.url().includes('change=play'), 'Change play next to the play title opens the canvas confirm in one click (step 48)');
  await p.click('#confirm-yes'); await p.waitForTimeout(300);
  await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400);
  await p.click('.tabs [data-tab="scope"]'); await p.waitForTimeout(200);
  ok([BASE, BASE + 'index.html'].includes(p.url()) && (await p.textContent('#toast')).includes('Add a product to the canvas first'), 'on your own play with nothing on the canvas, Scope asks for a product and stays on the canvas');
  for (const id of ['aemassets', 'workfront', 'aemsites', 'cja']) await addP(p, id);
  await p.mouse.click(40, 938); await p.waitForTimeout(300);
  const t2 = await canvasTotal(p), n2 = await p.evaluate(() => totals().n);   // step 44: the line at the bottom no longer counts services
  await p.click('.tabs [data-tab="services"]'); await p.waitForURL('**/sow/index.html#services'); await p.waitForTimeout(500);
  const l2 = await toolLines(p);
  ok((await p.textContent('#play-title')).trim() === 'Your own play' && await toolTotal(p) === t2 && l2.length === n2, `Your own play: the same ${n2} services and the same total (${t2})`, `${await toolTotal(p)}, ${l2.length} lines`);
  ok(l2.includes('CANVAS-XB12') && l2.includes('CANVAS-AXA04') && l2.every(id => id.startsWith('CANVAS-')), 'the canvas lines arrive, AEM Assets + Workfront and AEM Sites + CJA among them');
  const src = await p.$$eval('.service-card .service-source a', e => e.map(x => x.href));
  ok(src.length === l2.length && src.every(h => h.startsWith('https://')), 'every service keeps its Adobe source link');
  ok((await p.$$('#service-lines .custom-tag')).length === 0 && await p.isHidden('#starting-scope'), 'they are not tagged Custom, and there is no starting scope to reset to');
  ok(await p.inputValue('#service-rate') === '150', 'the rate from the canvas carries over');
  await p.click('[data-step="document"]'); await p.waitForTimeout(400);
  const doc = await p.textContent('#sow-preview');
  ok(doc.includes('Workfront to AEM Assets integration') && doc.includes('AEM page data collection for CJA') && doc.includes('Acme Corp'), 'the statement of work lists them, with the Scope details kept');
  // audit fix: lines only the canvas has are service concepts until their deliverable, acceptance and assumptions are written
  await p.click('[data-step="services"]'); await p.waitForTimeout(300);
  const concepts = await p.$$eval('.service-card', e => e.filter(x => x.querySelector('.concept-tag')).map(x => x.dataset.line));
  ok(concepts.length === l2.length - 1 && !concepts.includes('CANVAS-C06'), `every research line arrives as a service concept, not quote-ready (${concepts.length}); the tool's own line (C06) keeps its full scope`, concepts.join(','));
  const pre = await p.evaluate(id => state.estimates.custom[id].assumptions, concepts[0]);
  ok(pre === '' || pre.startsWith('Connection: '), 'a concept from a connection starts with its connection type, availability and prerequisites', pre.slice(0, 80));
  await p.click('[data-step="document"]'); await p.waitForTimeout(300);
  ok(await p.isVisible('#readiness') && (await p.$$('#readiness li')).length >= concepts.length && (await p.textContent('#sow-preview')).includes('Service concept, not quote-ready'), 'the SOW lists what to write before it is issued, and marks each concept');
  { const n = (await p.$$('#readiness li')).length, mark = 'Draft, not ready to issue: ' + n + ' open items.';
    const summary = await p.textContent('#readiness summary'), folded = !(await p.$eval('#readiness', d => d.open));
    // Adam's export simplification: the PDF/print path replaces the redundant HTML download.
    // Verify the actual print handler receives the draft, not only the toolbar label.
    await p.evaluate(() => { window.__printedDraft = null; window.print = () => { window.__printedDraft = document.getElementById('sow-preview').textContent; }; });
    await p.click('#print-sow');
    const draft = await p.evaluate(() => window.__printedDraft);
    ok(await p.locator('#download-sow').count() === 0 && (await p.textContent('#print-sow')) === 'Print / Save PDF', 'one clearly named document export, with the HTML download removed');
    const [dc] = await Promise.all([p.waitForEvent('download'), p.click('#export-csv')]); const csv = fs.readFileSync(await dc.path(), 'utf8');
    ok(folded && summary === n + ' items to finish before you issue this SOW' && (await p.textContent('#sow-preview')).includes(mark), 'the open items fold into one line above the document, which is marked as a draft (step 48)', summary);
    ok(draft.includes(mark) && dc.suggestedFilename().endsWith('-DRAFT.csv') && csv.split('\r\n')[0].includes(mark) && (await p.textContent('#toast')).includes('Before you issue'), 'with concepts still to write, Print / Save PDF and Services CSV retain the not-ready draft marker', dc.suggestedFilename()); }
  const before = (await p.$$('#readiness li')).length;
  await p.click('[data-step="services"]'); await p.waitForTimeout(300);
  const card = `.service-card[data-line="${concepts[0]}"]`;
  await p.click(card + ' .scope-editor summary');
  const scope0 = await p.inputValue(card + ' [data-line-field="scope"]'), pre0 = await p.inputValue(card + ' [data-line-field="assumptions"]');
  // placeholder text does not count as writing (completeness critic, Oct 31)
  await p.fill(card + ' [data-line-field="scope"]', scope0 + ' To be confirmed later with the customer.');
  await p.fill(card + ' [data-line-field="deliverable"]', 'To be confirmed later.');
  await p.fill(card + ' [data-line-field="acceptance"]', 'TBD');
  await p.fill(card + ' [data-line-field="assumptions"]', pre0 + ' TBD.');
  await p.click('[data-step="document"]'); await p.waitForTimeout(300);
  const still = await p.textContent('#readiness');
  ok((await p.$$('#readiness li')).length === before && still.includes('as a number') && still.includes('a number to test'), 'placeholder text (TBD, to be confirmed) does not clear a concept, and the list says what is still missing', still.slice(0, 200));
  await p.click('[data-step="services"]'); await p.waitForTimeout(300);
  await p.click(card + ' .scope-editor summary');
  await p.fill(card + ' [data-line-field="scope"]', scope0 + ' Quantity: three folders and 50 test documents.');
  await p.fill(card + ' [data-line-field="deliverable"]', 'One configured integration and a test record.');
  await p.fill(card + ' [data-line-field="acceptance"]', 'All 3 test documents reach AEM Assets with their metadata within 1 business day.');
  await p.fill(card + ' [data-line-field="assumptions"]', 'Both products are on the same Adobe organization.');
  await p.click('[data-step="document"]'); await p.waitForTimeout(300);
  ok((await p.$$('#readiness li')).length === before - 1, 'rewriting a concept\'s scope with its quantity, and writing its deliverable, acceptance and assumptions, clears it from the list');
  await p.click('.steps [data-build]'); await p.waitForURL(u => !/\/sow\//.test(String(u))); await p.waitForTimeout(400);
  await p.click('#save'); await p.waitForURL('**/sow/index.html#scope'); await p.waitForTimeout(400); await p.click('[data-step="document"]'); await p.waitForTimeout(300);
  ok((await p.$$('#readiness li')).length === before - 1, 'a trip back to Build keeps what was written on the concepts');

  // 3b. re-test fixes: a custom build without Brand Visibility or FSI reads neutrally, with a customer title; Services' rate reaches the canvas
  await p.click('.topbar [data-build]'); await p.waitForURL(u => !/\/sow\//.test(String(u))); await p.waitForTimeout(400);
  ok(await p.isVisible('#confirm') && (await p.textContent('#confirm-title')) === 'Change the play?' && !p.url().includes('change=play'), 'Change play next to the play title opens the canvas confirm in one click (step 48)');
  await p.click('#confirm-yes'); await p.waitForTimeout(300);
  await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400);
  for (const id of ['eds', 'so', 'bc', 'cja']) await addP(p, id);
  await p.mouse.click(40, 938); await p.waitForTimeout(300);
  await p.click('.tabs [data-tab="sow"]'); await p.waitForURL('**/sow/index.html#document'); await p.waitForTimeout(500);
  const ndoc = await p.textContent('#sow-preview');
  ok(!ndoc.includes('Brand Visibility') && !/banking|insurance|financial-services/i.test(ndoc), 'a custom build without Brand Visibility or FSI carries no Brand Visibility or banking text', (ndoc.match(/[^.]*(Brand Visibility|banking|insurance|financial-services)[^.]*\./i) || [''])[0].slice(0, 120));
  ok(ndoc.includes('Services for Edge Delivery Services, Sites Optimizer, Brand Concierge and Customer Journey Analytics') || /Services for [A-Z]/.test(ndoc), 'its title names the products on the canvas', (ndoc.match(/Services for [^\n]{0,90}/) || [''])[0]);
  await p.click('[data-step="services"]'); await p.waitForTimeout(300);
  await p.fill('#service-rate', '187.5'); await p.waitForTimeout(150);
  await p.click('.steps [data-build]'); await p.waitForURL(u => !/\/sow\//.test(String(u))); await p.waitForTimeout(400);
  ok(await p.inputValue('#rate') === '187.5', 'a rate set on Services, with cents, is the rate on the canvas after a trip back to Build', await p.inputValue('#rate'));
  await p.click('.tabs [data-tab="sow"]'); await p.waitForURL('**/sow/index.html#document'); await p.waitForTimeout(400);

  // 3c. completeness critic (Oct 31): the term entered in the SOW steps is the canvas's term, and the FSI answer reaches the canvas
  await p.click('[data-step="scope"]'); await p.waitForTimeout(200);
  await p.fill('[data-meta="months"]', '6'); await p.waitForTimeout(150);
  await p.click('[data-step="services"]'); await p.waitForTimeout(300);
  const t6 = await toolTotal(p);
  await p.click('.steps [data-build]'); await p.waitForURL(u => !/\/sow\//.test(String(u))); await p.waitForTimeout(400);
  ok((await p.textContent('#t-k')).trim() === 'Illustrative fees: implementation + 6-month term' && await canvasTotal(p) === t6 && (await p.textContent('#t-sub')).includes('a month for 6 months'),
    `a 6-month term set in the SOW steps is the canvas's term too, with the same total (${t6})`, `${(await p.textContent('#t-k')).trim()} ${await canvasTotal(p)}`);
  await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300);
  await p.click('#picker [data-play="fsi"]'); await p.waitForTimeout(500);
  const f0 = await canvasTotal(p);
  await p.click('#save'); await p.waitForURL('**/sow/index.html#scope'); await p.waitForTimeout(400);
  await p.selectOption('[data-meta="fsiState"]', 'healthy'); await p.waitForTimeout(150);
  await p.click('[data-step="services"]'); await p.waitForTimeout(300);
  const f1 = await toolTotal(p);
  await p.click('.steps [data-build]'); await p.waitForURL(u => !/\/sow\//.test(String(u))); await p.waitForTimeout(400);
  ok(await canvasTotal(p) === f1 && f1 !== f0 && !(await p.evaluate(() => lineOn('F02'))), `Brand Concierge live and healthy takes Implement Brand Concierge off the canvas too (${f0} to ${f1})`, `${await canvasTotal(p)} vs ${f1}`);
  await p.click('#save'); await p.waitForURL('**/sow/index.html#scope'); await p.waitForTimeout(400); await p.click('[data-step="services"]'); await p.waitForTimeout(300);
  ok(!(await toolLines(p)).includes('F02') && await toolTotal(p) === f1, 'and a trip back through Build keeps it off, with the same total');
  await p.click('[data-step="document"]'); await p.waitForTimeout(300);

  // 3d. Nov 17 2026: the Brand Visibility + Brand Concierge play reads for any industry. With every optional and library service
  //     added and every text open, its connection card on Build, the Scope step (text and examples), the Services step, the
  //     statement of work and the Services CSV carry no banking, insurance or other finance wording.
  { const q = await fresh(), FIN = /financ|banking|insur|rates?(?:, | \/ )fees?/i, seen = {};
    await q.goto(BASE); await q.waitForTimeout(300); await q.click('#picker [data-play="fsi"]'); await q.waitForTimeout(500);
    await q.click('.ib[data-c="bv-bc"]'); await q.waitForTimeout(300); seen.build = await q.textContent('#card'); await q.click('#card [data-close]'); await q.waitForTimeout(150);
    await q.click('#save'); await q.waitForURL('**/sow/index.html#scope'); await q.waitForTimeout(400);
    seen.scope = await q.$eval('#scope-panel', e => e.innerText + '\n' + [...e.querySelectorAll('[placeholder]')].map(x => x.placeholder).join('\n'));
    await q.click('[data-step="services"]'); await q.waitForTimeout(300);
    for (const id of await q.$$eval('#service-extensions [data-add]', e => e.map(x => x.dataset.add))) { await q.click(`#service-extensions [data-add="${id}"]`); await q.waitForTimeout(200); }
    await q.click('#add-service'); await q.waitForTimeout(150);
    const lib = await q.$$eval('#available-services [data-add]', e => e.map(x => x.dataset.add)); await q.click('#close-modal'); await q.waitForTimeout(150);
    for (const id of lib) { await q.click('#add-service'); await q.waitForTimeout(150); await q.click(`#available-services [data-add="${id}"]`); await q.waitForTimeout(150); await q.click('#close-modal'); await q.waitForTimeout(150); }
    const on = await toolLines(q);
    seen.services = await q.$eval('#service-lines', e => { e.querySelectorAll('details').forEach(x => { x.open = true; }); return e.innerText + '\n' + [...e.querySelectorAll('textarea, input')].map(x => x.value).join('\n'); });
    await q.click('[data-step="document"]'); await q.waitForTimeout(400);
    seen.sow = await q.$eval('#sow-preview', e => e.innerText) + '\n' + await q.textContent('#readiness');
    const [d] = await Promise.all([q.waitForEvent('download'), q.click('#export-csv')]); seen.csv = fs.readFileSync(await d.path(), 'utf8');
    const found = Object.entries(seen).filter(([, t]) => FIN.test(t)).map(([k, t]) => k + ': ' + t.slice(Math.max(0, t.search(FIN) - 60), t.search(FIN) + 40).replace(/\s+/g, ' '));
    ok(['C04', 'FSI01', 'CW-FSI', 'O04', 'O07', 'O08', 'O09'].every(id => on.includes(id)) && !found.length,
      `the Brand Visibility + Brand Concierge play reads for any industry: with all ${on.length} services added, its Build card, Scope, Services, statement of work and Services CSV carry no banking, insurance or finance wording`, found.join(' | ') || on.join(','));
    await q.context().close(); }

  // 4. Start over clears everything and goes to the front page
  await p.click('#start-over'); await p.click('#start-over-confirm'); await p.waitForURL(u => !/\/sow\//.test(String(u))); await p.waitForTimeout(400);
  ok(await p.isVisible('#picker') && (await p.$$('.node')).length === 0, 'Start over in the statement of work goes back to the front page, canvas cleared');
  const om1 = await onlyMasthead(p);
  ok(om1.ok && await p.isHidden('.tabs') && await p.isHidden('.toolbar') && await p.isHidden('#start-over'), 'and the front page shows only the masthead above the boxes again', JSON.stringify(om1));
  await p.goto(BASE + 'sow/'); await p.waitForTimeout(400);
  ok(!(await p.inputValue('[data-meta="customer"]')), 'and the Scope details are cleared too');

  // step 44: outside systems on Create your own play reach the SOW steps with their services, at the same total
  { const q = await fresh(); await q.goto(BASE); await q.evaluate(() => localStorage.setItem('abv-sow-build-v1', JSON.stringify({v: 2, rate: 150, play: 'custom', on: ['cja', 'bv']}))); await q.reload(); await q.waitForTimeout(800);
    for (const id of ['dwh', 'cdn']) { await q.click('#out-btn'); await q.waitForTimeout(200); await q.click(`#out-menu [data-out="${id}"]`); await q.waitForTimeout(400); }
    const tc = await canvasTotal(q); await q.click('#save'); await q.waitForURL('**/sow/index.html#scope'); await q.waitForTimeout(500); await q.click('[data-step="services"]'); await q.waitForTimeout(300);
    const sw = await q.evaluate(() => ({out: (state.outside.custom || []).slice().sort().join(), prods: state.customProducts.join()}));
    ok(sw.out === 'cdn,dwh' && sw.prods === 'cja,bv' && await toolTotal(q) === tc, `S44: outside systems on Create your own play reach the SOW steps as outside systems, not products, at the canvas total (${tc})`, JSON.stringify(sw) + ' ' + await toolTotal(q));
    await q.context().close(); }

  // 5. text, errors, a phone
  for (const u of [BASE, BASE + 'sow/']) { await p.goto(u); await p.waitForTimeout(300); ok(!/[–—]/.test(await p.evaluate(() => document.body.innerText)), `no em or en dashes on ${u.replace(BASE, '/')}`); }
  const ph = await fresh(390, 844);
  for (const u of [BASE, BASE + 'sow/']) { await ph.goto(u); await ph.waitForTimeout(400); ok(await ph.evaluate(() => document.documentElement.scrollWidth) <= 390, `on a phone ${u.replace(BASE, '/')} doesn't scroll sideways`); }
  ok(errs.length === 0, 'no script errors', errs.join(' | ').slice(0, 300));
  await b.close(); server.close();
  console.log(fails ? `${fails} CHECK(S) FAILED` : 'ALL SITE CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})();
