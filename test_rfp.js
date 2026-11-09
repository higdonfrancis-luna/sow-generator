// Step 49: the RFP Builder prototype, part one. Run from the repo root after python3 sow/rfp_prototype/build.py:
//   node sow/test_rfp.js
// Serves sow/rfp_prototype/site/ locally (the prototype, not the product), opens the page, uploads three made-up RFPs (text, Word, PDF) and checks the questions
// found and the piles they land in, that nothing leaves the browser, and that nothing about the RFP is stored.
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, 'rfp_prototype', 'site'), FIX = path.join(__dirname, 'qa', 'rfp_fixtures');
const EXPECTED = JSON.parse(fs.readFileSync(path.join(FIX, 'expected.json'), 'utf8'));
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 500) + ']')); if (!c) fails++; };
const TYPES = {'.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript', '.json': 'application/json'};
const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  if (u.endsWith('/')) u += 'index.html';
  const f = path.join(SITE, u);
  if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, {'Content-Type': TYPES[path.extname(f)] || 'text/plain'}); fs.createReadStream(f).pipe(res);
});
(async () => {
  await new Promise(r => server.listen(0, r));
  const BASE = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch(), errs = [], outside = [];
  const ctx = await b.newContext({viewport: {width: 1500, height: 1000}});
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR_/.test(m.text())) errs.push(m.text()); });
  p.on('request', r => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:') && !/fonts\.(googleapis|gstatic)\.com/.test(u)) outside.push(u); });
  await p.goto(BASE + 'index.html'); await p.waitForTimeout(500);
  ok((await p.textContent('.topbar')).includes('RFP Builder prototype, not the live tool'), 'the page says it is the prototype');
  // the tab
  ok(await p.$$eval('.steps [data-step]', e => e.map(x => x.textContent.trim())).then(t => t.join('|')) === 'Scope|Services|Statement of work|RFP Builder', 'the RFP Builder is the fifth tab, after Statement of work');
  await p.click('[data-step="rfp"]'); await p.waitForTimeout(200);
  ok(await p.isVisible('#rfp-panel') && await p.isHidden('#document-panel'), 'clicking the tab shows the RFP Builder and hides the other steps');
  ok((await p.textContent('#rfp-panel .section-intro')).includes('Nothing is uploaded or stored'), 'the panel says the file is read in the browser only');
  // deep link
  await p.goto(BASE + 'index.html#rfp'); await p.waitForTimeout(400);
  ok(await p.isVisible('#rfp-panel'), 'index.html#rfp opens the tab directly');
  // the three RFPs
  const piles = async () => p.$$eval('#rfp-questions li', e => e.map(x => ({kind: x.dataset.kind, label: (x.querySelector('.rfp-q b') || {}).textContent || '', text: x.querySelector('.rfp-q').textContent})));
  for (const [file, exp] of Object.entries(EXPECTED)) {
    if (await p.isVisible('#rfp-clear')) { await p.click('#rfp-clear'); await p.waitForTimeout(100); }
    await p.setInputFiles('#rfp-file', path.join(FIX, file));
    await p.waitForFunction(f => /found|Could not read|no questions/.test(document.getElementById('rfp-status').textContent) && document.getElementById('rfp-status').textContent.includes(f), file, {timeout: 30000}).catch(() => {});
    const rows = await piles();
    ok(rows.length === exp.questions, `${file}: ${exp.questions} questions found`, rows.length + ' found: ' + rows.map(r => r.label || r.text.slice(0, 30)).join(', '));
    const byLabel = Object.fromEntries(rows.map(r => [r.label, r.kind]));
    ok(exp.adobe.every(l => byLabel[l] === 'adobe'), `${file}: the Adobe-services questions land in the Adobe pile`, exp.adobe.map(l => l + ':' + byLabel[l]).join(' '));
    ok(exp.firm.every(l => byLabel[l] === 'firm'), `${file}: the questions about the firm land in Your firm`, exp.firm.map(l => l + ':' + byLabel[l]).join(' '));
    ok(rows.every(r => !/Section \d|Scope of services|Vendor profile/.test(r.text)), `${file}: section headings are not glued to the question before them`, rows.filter(r => /Section \d|Scope of services|Vendor profile/.test(r.text)).map(r => r.text.slice(0, 80)).join(' | '));
    const status = await p.textContent('#rfp-status');
    ok(status.includes(file) && status.includes(exp.questions + ' questions found'), `${file}: the status line names the file and the count`, status);
  }
  // filters and re-sorting
  await p.click('[data-rfp-filter="firm"]'); await p.waitForTimeout(100);
  const shown = await p.$$eval('#rfp-questions li', e => e.filter(x => !x.hidden).map(x => x.dataset.kind));
  ok(shown.length > 0 && shown.every(k => k === 'firm'), 'the Your firm filter shows only that pile');
  await p.click('[data-rfp-filter="all"]'); await p.waitForTimeout(100);
  await p.selectOption('#rfp-questions li:first-child .rfp-kind', 'adobe'); await p.waitForTimeout(100);
  ok((await p.$eval('#rfp-questions li:first-child', e => e.dataset.kind)) === 'adobe', 'a question can be moved to another pile from its row');
  // pasted text
  await p.click('#rfp-clear'); await p.waitForTimeout(100);
  ok((await p.$$eval('#rfp-questions li', e => e.length)) === 0 && await p.isHidden('#rfp-results'), 'Clear empties the list');
  await p.click('#rfp-paste-btn'); await p.fill('#rfp-text', 'Describe your approach to implementing Adobe Target personalization.\n\nProvide three client references.\n\nWhat is your favourite colour?');
  await p.click('#rfp-paste-go'); await p.waitForTimeout(200);
  const pasted = await piles();
  ok(pasted.length === 3 && pasted[0].kind === 'adobe' && pasted[1].kind === 'firm' && pasted[2].kind === 'unsure', 'pasted text: three questions, sorted Adobe, firm, not sure', JSON.stringify(pasted.map(r => r.kind)));
  // privacy
  const stored = await p.evaluate(() => Object.keys(localStorage).map(k => localStorage.getItem(k)).join(' ') + Object.keys(sessionStorage).map(k => sessionStorage.getItem(k)).join(' '));
  ok(!/Northbridge|Harbor & Pine|Meridian|favourite colour/.test(stored), 'nothing from the RFPs is written to browser storage (before the hand-off)');
  ok(outside.length === 0, 'no request left the page while reading the RFPs', outside.join(' | '));
  // part two: drafted answers, use, download, hand-off
  await p.click('#rfp-clear'); await p.waitForTimeout(100);
  await p.setInputFiles('#rfp-file', path.join(FIX, 'bank_rfp.xlsx'));
  await p.waitForFunction(() => /found/.test(document.getElementById('rfp-status').textContent), null, {timeout: 30000});
  const rowFor = async label => p.$$eval('#rfp-questions li', (e, l) => e.findIndex(x => (x.querySelector('.rfp-q b') || {}).textContent === l), label);
  await p.click(`#rfp-questions li:nth-child(${await rowFor('2.2') + 1})`); await p.waitForTimeout(200);
  const ans = await p.textContent('#rfp-answer');
  ok(/Our approach/.test(ans) && /What we would do/.test(ans) && /What we would need from you/.test(ans) && /Sources/.test(ans), '2.2: the drafted answer has approach, work, needs and sources', ans.slice(0, 200));
  ok(/Brand Visibility/.test(ans) && /Customer Journey Analytics|CJA/.test(ans) && !/your client|the Client/.test(ans), '2.2: the answer names both products and speaks to the client as you', ans.slice(0, 300));
  ok(await p.$$eval('#rfp-answer .rfp-sources a', e => e.length > 0 && e.every(a => /^https:\/\/(experienceleague|helpx|business|www)\.adobe\.com|aem\.live/.test(a.href))), '2.2: every source is an Adobe page');
  await p.click('#rfp-use'); await p.waitForTimeout(150);
  ok((await p.$$eval('#rfp-questions li', e => e.filter(x => /Used/.test(x.textContent)).length)) === 1, 'Use this answer marks the row Used');
  ok(/1 of 8/.test(await p.textContent('#rfp-summary')), 'the summary counts 1 of 8 Adobe answers used', await p.textContent('#rfp-summary'));
  await p.click(`#rfp-questions li:nth-child(${await rowFor('2.5') + 1})`); await p.waitForTimeout(200);
  const ongoing = await p.textContent('#rfp-answer');
  ok(/Each month we will/.test(ongoing), '2.5 (ongoing services, no product named) draws the monthly lines from the products the RFP is about', ongoing.slice(0, 300));
  await p.click(`#rfp-questions li:nth-child(${await rowFor('1.2') + 1})`); await p.waitForTimeout(150);
  ok(/about your firm/.test(await p.textContent('#rfp-answer')), 'a Your firm question is left to the partner');
  await p.click(`#rfp-questions li:nth-child(${await rowFor('2.3') + 1})`); await p.waitForTimeout(150);
  await p.click('#rfp-edit-btn'); await p.fill('#rfp-edit', 'Our own words for 2.3.'); await p.click('#rfp-save-edit'); await p.waitForTimeout(150);
  ok(/Our own words for 2.3/.test(await p.textContent('#rfp-answer')) && /2 of 8/.test(await p.textContent('#rfp-summary')), 'an edited answer is kept and counted');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#rfp-download')]);
  const doc = fs.readFileSync(await dl.path(), 'utf8');
  ok(/response draft/.test(doc) && /2\.2 How would you connect/.test(doc) && /What we would do/.test(doc) && /Our own words for 2\.3/.test(doc) && /Provide three references/.test(doc) && /Your answer:/.test(doc), 'the downloaded response holds every question in order, the used answers and blanks for the firm', doc.length + ' bytes');
  ok(!/your client|the Client\b/.test(doc.replace(/Client ID|Client Secret/g, '')), 'the response speaks to the client as you, never as the Client');
  await p.click('#rfp-to-sow'); await p.waitForTimeout(600);
  ok(await p.isVisible('#services-panel') && (await p.textContent('#play-title')) === 'Your own play', 'Add to my statement of work opens the Services step on Your own play', await p.textContent('#play-title'));
  const cards = await p.$$eval('.service-card', e => e.length);
  ok(cards >= 2, `the services from the used answers are on the Services step (${cards} cards)`);
  await p.click('[data-step="rfp"]'); await p.waitForTimeout(150);
  ok((await p.$$eval('#rfp-questions li', e => e.length)) === 14, 'the RFP list is still there after the hand-off');
  // the other steps still work beside the new tab
  await p.click('[data-step="services"]'); await p.waitForTimeout(200);
  ok(await p.isVisible('#services-panel') && await p.isHidden('#rfp-panel'), 'the Services step still opens and the RFP panel hides');
  ok(errs.length === 0, 'no script errors', errs.join(' | '));
  await b.close(); server.close();
  console.log(fails ? `${fails} RFP CHECK(S) FAILED` : 'ALL RFP CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
