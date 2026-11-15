// Step 49: the RFP Builder prototype, part one. Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp.js
// Serves sow/site/sow/ locally (the SOW generator's page, which carries the RFP Builder since the Nov 9 merge), opens the page, uploads three made-up RFPs (text, Word, PDF) and checks the questions
// found and the piles they land in, that nothing leaves the browser, and that nothing about the RFP is stored.
const {wordCopyIssues} = require('./qa/rfp_word_copy.js');
const {chromium} = require('playwright');
const {downloadWorkbook} = require('./rfp_prototype/review_2026-11-09/harness.js');
const {downloadWord, technicalBodies, tableIn} = require('./rfp_prototype/chatgpt_round5/test_word_complete.js');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, 'site', 'sow'), FIX = path.join(__dirname, 'qa', 'rfp_fixtures');
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
  p.on('dialog', d => d.accept());   // step 56: the leave-this-page warning never blocks a check
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR_/.test(m.text())) errs.push(m.text()); });
  p.on('request', r => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:') && !/fonts\.(googleapis|gstatic)\.com/.test(u)) outside.push(u); });
  await p.goto(BASE + 'index.html'); await p.waitForTimeout(500);
  ok(!(await p.textContent('body')).includes('prototype, not the live tool'), 'no prototype badge: since the Nov 9 merge the RFP Builder is part of the SOW generator');
  // the tab
  ok(await p.$$eval('.steps [data-step]', e => e.map(x => x.textContent.trim())).then(t => t.join('|')) === 'Scope|Services|Statement of work|RFI Builder', 'the RFI Builder is the fifth tab, after Statement of work');
  await p.click('[data-step="rfp"]'); await p.waitForTimeout(200);
  ok(await p.isVisible('#rfp-panel') && await p.isHidden('#document-panel'), 'clicking the tab shows the RFP Builder and hides the other steps');
  ok((await p.textContent('#rfp-panel .section-intro')).includes('suggested drafts, drawn from Adobe’s public documentation'), 'the panel says the answers are suggested drafts from Adobe\'s documentation (step 73\'s intro)');
  // deep link
  await p.goto(BASE + 'index.html#rfp'); await p.waitForTimeout(400);
  ok(await p.isVisible('#rfp-panel'), 'index.html#rfp opens the tab directly');
  // the three RFPs
  const piles = async () => p.$$eval('#rfp-questions li', e => e.map(x => ({kind: x.dataset.kind, label: (x.querySelector('.rfp-q b') || {}).textContent || '', text: x.querySelector('.rfp-q').textContent})));
  for (const [file, exp] of Object.entries(EXPECTED)) {
    if (await p.isVisible('#rfp-clear')) { await p.click('#rfp-clear'); await p.click('#rfp-clear-confirm'); await p.waitForTimeout(100); }   // step 55: Start over asks first
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
  ok(await p.isVisible('#rfp-start-over-modal') && (await p.$$eval('#rfp-questions li', e => e.length)) > 0, 'Start over asks first and clears nothing until it is confirmed (step 55)');
  await p.click('#rfp-clear-confirm'); await p.waitForTimeout(100);
  ok((await p.$$eval('#rfp-questions li', e => e.length)) === 0 && await p.isHidden('#rfp-results'), 'Start over, confirmed, empties the list');
  await p.click('#rfp-paste-btn'); await p.fill('#rfp-text', 'Describe your approach to implementing Adobe Target personalization.\n\nProvide three client references.\n\nWhat is your favourite colour?');
  await p.click('#rfp-paste-go'); await p.waitForTimeout(200);
  const pasted = await piles();
  ok(pasted.length === 3 && pasted[0].kind === 'adobe' && pasted[1].kind === 'firm' && pasted[2].kind === 'firm', 'pasted text: three questions, sorted Adobe, firm, firm', JSON.stringify(pasted.map(r => r.kind)));
  // privacy
  const stored = await p.evaluate(() => Object.keys(localStorage).map(k => localStorage.getItem(k)).join(' '));
  ok(!/Northbridge|Harbor & Pine|Meridian|favourite colour/.test(stored), 'nothing from the RFPs is written to the browser\'s lasting storage (before the hand-off)');
  ok(await p.evaluate(() => Object.keys(sessionStorage).join(',') === 'abv-rfp-work-v1' && /favourite colour/.test(sessionStorage.getItem('abv-rfp-work-v1'))), 'the work is kept in this tab\'s session storage only, which clears when the tab closes (step 56)');
  ok(outside.length === 0, 'no request left the page while reading the RFPs', outside.join(' | '));
  // part two: drafted answers, approve, download, hand-off
  await p.click('#rfp-clear'); await p.click('#rfp-clear-confirm'); await p.waitForTimeout(100);
  await p.setInputFiles('#rfp-file', path.join(FIX, 'bank_rfp.xlsx'));
  await p.waitForFunction(() => /found/.test(document.getElementById('rfp-status').textContent), null, {timeout: 30000});
  const rowFor = async label => p.$$eval('#rfp-questions li', (e, l) => e.findIndex(x => (x.querySelector('.rfp-q b') || {}).textContent === l), label);
  // Nov 9 (Adam: not obvious to click a row): every row says See answer, the open row says Open, and the first Adobe-services answer opens by itself
  const opens = await p.$$eval('#rfp-questions li', e => e.map(x => (x.querySelector('.rfp-open') || {}).textContent || ''));
  ok(opens.length === 14 && opens.filter(t => /See answer/.test(t)).length === 7 && opens.filter(t => /Write answer/.test(t)).length === 6 && opens.filter(t => t === 'Open').length === 1, 'every Adobe row says See answer, every firm row Write answer, and the open row says Open', JSON.stringify(opens));
  ok((await p.$eval('#rfp-questions li.sel .rfp-q b', e => e.textContent)) === '2.1' && /Your response to the client/.test(await p.textContent('#rfp-answer')), 'the first Adobe-services question (2.1) opens by itself when the RFP loads, so the panel is never empty');
  await p.click(`#rfp-questions li:nth-child(${await rowFor('2.2') + 1})`); await p.waitForTimeout(200);
  const ans = await p.textContent('#rfp-answer');
  ok(/Your response to the client/.test(ans) && /Our approach/.test(ans) && /What we would do/.test(ans) && /Adobe sources for the product facts above/.test(ans) && /What we would need from you/.test(ans), '2.2: the response has approach, work, sources and, since step 54, what we would need from you, labelled as the response to the client', ans.slice(0, 200));
  // Nov 9 (Adam): the prerequisites are a note for the partner, split into what the proposal sells and what to ask the client for
  const note = await p.$eval('#rfp-answer .rfp-partner-note', e => ({text: e.textContent, sells: [...e.querySelectorAll('.rfp-sells li')].map(x => x.textContent), asks: [...e.querySelectorAll('.rfp-asks li')].map(x => x.textContent)})).catch(() => null);
  ok(note && /Notes for you, not for the client/.test(note.text) && /Internal\. Nothing in this box goes into the proposal or your client's workbook, except the asks you leave ticked/.test(note.text) && /Ask your client\./.test(note.text), '2.2: a boxed note for the partner sits under the response and says it is internal', note && note.text.slice(0, 120));
  ok(note && note.sells.length === 1 && /^A Brand Visibility license \(CJA's page requires it for the source\)/.test(note.sells[0]) && !/trial|paid/i.test(note.sells[0]) && /Adobe licenses this proposal includes/.test(note.text), '2.2: the Brand Visibility license is an Adobe license this proposal includes (the bank owns CJA, not Brand Visibility)', note && JSON.stringify(note.sells));
  ok(note && note.asks.length >= 4 && note.asks.some(a => /CDN access logs/.test(a)) && note.asks.some(a => /CJA administrator/.test(a)) && !note.asks.some(a => /Brand Visibility license/i.test(a)), '2.2: the access, people and fields are what to ask the client for', note && JSON.stringify(note.asks).slice(0, 300));
  ok(await p.evaluate(() => [...RFPAnswers.ownedProducts()].sort().join(',')) === 'cja,marketo', 'the RFP says "our Customer Journey Analytics" and "runs Marketo Engage" (step 52 reads runs X), so CJA and Marketo are the products the bank owns', await p.evaluate(() => [...RFPAnswers.ownedProducts()].join(',')));
  // Nov 9 (Adam: let them type the information right there): a field under each ask; what is typed joins the response
  ok((await p.$$eval('#rfp-answer .rfp-asks .rfp-fact', e => e.length)) === note.asks.length && (await p.$eval('#rfp-answer .rfp-fact', e => e.placeholder)) === 'What your client told you', 'each ask has its own empty field, with the placeholder What your client told you');
  await p.fill('#rfp-answer .rfp-fact[data-i="0"]', 'Akamai serves both sites; your IT team confirmed log forwarding can be enabled.'); await p.waitForTimeout(100);
  const withFact = await p.textContent('#rfp-body');
  ok(/What you already have in place, as confirmed with your team/.test(withFact) && /CDN access logs: Akamai serves both sites/.test(withFact) && (await p.$$eval('#rfp-answer .rfp-fact', e => e.length)) === note.asks.length && (await p.$eval('#rfp-answer .rfp-fact[data-i="0"]', e => e.value)).startsWith('Akamai'), 'the typed fact appears in the response under What you already have in place, led by its subject, while the field keeps focus and its text', withFact.slice(-200));
  ok(!/Will confirm with the client/.test(withFact), 'the asks left blank stay out of the response');
  const resp = await p.$eval('#rfp-answer', e => { const c = e.cloneNode(true); const n = c.querySelector('.rfp-partner-note'); if (n) n.remove(); return c.textContent; });
  ok(/Brand Visibility/.test(resp) && /Customer Journey Analytics|CJA/.test(resp) && !/your client|the Client/.test(resp), '2.2: the response names both products and speaks to the client as you (the partner note may say your client)', resp.slice(0, 300));
  ok(await p.$$eval('#rfp-answer .rfp-sources a', e => e.length > 0 && e.every(a => /^https:\/\/(experienceleague|helpx|business|www)\.adobe\.com|aem\.live/.test(a.href))), '2.2: every source is an Adobe page');
  await p.click('#rfp-use'); await p.waitForTimeout(150);
  ok((await p.$$eval('#rfp-questions li', e => e.filter(x => /In your response/.test(x.textContent)).length)) === 1, 'Use this answer marks the row In your response (step 69; it read Approve and Approved)');
  ok(/1 of 8/.test(await p.textContent('#rfp-summary')), 'the summary counts 1 of 8 Adobe answers approved', await p.textContent('#rfp-summary'));
  await p.click(`#rfp-questions li:nth-child(${await rowFor('2.5') + 1})`); await p.waitForTimeout(200);
  const ongoing = await p.textContent('#rfp-answer');
  ok(/[Ee]ach month we will/.test(ongoing), '2.5 (ongoing services, no product named) draws the monthly lines from the products the RFP is about (step 67: each led by its product)', ongoing.slice(0, 300));
  await p.click(`#rfp-questions li:nth-child(${await rowFor('1.2') + 1})`); await p.waitForTimeout(150);
  ok(/about your firm/.test(await p.textContent('#rfp-answer')) && await p.isVisible('#rfp-firm'), 'a Your firm question shows its own text box');
  await p.fill('#rfp-firm', 'Harbor & Pine Credit Union (2024), Meridian Trust (2025), Lakeshore Mutual (2025). Contacts on request.'); await p.click('#rfp-firm-use'); await p.waitForTimeout(150);
  ok((await p.$eval(`#rfp-questions li:nth-child(${await rowFor('1.2') + 1})`, e => /In your response/.test(e.textContent))) && /1 of 6 questions about your firm are answered/.test(await p.textContent('#rfp-summary')), 'a firm answer typed and chosen marks the row In your response and counts 1 of 6 questions about your firm', await p.textContent('#rfp-summary'));
  await p.click(`#rfp-questions li:nth-child(${await rowFor('2.3') + 1})`); await p.waitForTimeout(150);
  await p.click('#rfp-edit-btn'); await p.fill('#rfp-edit', 'Our own words for 2.3.'); await p.click('#rfp-save-edit'); await p.waitForTimeout(150);
  ok(/Our own words for 2.3/.test(await p.textContent('#rfp-answer')) && /2 of 8/.test(await p.textContent('#rfp-summary')), 'an edited answer is kept and counted');
  const doc = await downloadWord({page: p, eval: (fn, arg) => p.evaluate(fn, arg)});
  const matrix = tableIn(doc, 'Requirements matrix', 'Ref');
  const firm = tableIn(doc, 'About our firm', 'Ref');
  const bodies = technicalBodies(doc, ['2.2', '2.3']);
  const body22 = bodies.get('2.2')?.paragraphs.join('\n') || '';
  const copy = wordCopyIssues(doc);
  ok(matrix.map(row => row.Ref).join('|') === (await piles()).map(row => row.label).join('|') &&
    firm.some(row => row.Requirement.includes('Provide three references')) && firm.some(row => row['Our answer'] === '[YOUR ANSWER]') &&
    bodies.get('2.3')?.paragraphs.includes('Our own words for 2.3.'), 'Word keeps the questions in order, the chosen answer edits, and places to write unanswered firm questions');
  ok(/What you already have in place, as confirmed with your team/.test(body22) && /CDN access logs: Akamai serves both sites/.test(body22) &&
    /What we would need from you/.test(body22) && /CJA administrator who adds/.test(body22) &&
    firm.some(row => row.Ref === '1.2' && /Harbor & Pine Credit Union \(2024\)/.test(row['Our answer'])), 'Word carries the typed fact, ticked asks and typed firm answer');
  ok(!copy.clientVoice, 'the whole Word proposal speaks to the client as you', copy.clientVoice);
  ok(!copy.partnerNote, 'the whole Word proposal excludes the partner notes', copy.partnerNote);
  const checklist = await downloadWorkbook(p, 'rfp-download-checklist');
  const items = checklist.sheets['My checklist'].slice(1);
  const relevant = items.filter(row => row[0] === '2.2');
  ok(relevant.some(row => row[2] === 'License' && /A Brand Visibility license/.test(row[3]) && !/free trial|paid Brand Visibility/i.test(row[3])) &&
    relevant.some(row => row[2] === 'Ask your client' && /CDN access logs/.test(row[3])) && !items.some(row => row[0] === '1.2'), 'the partner checklist includes the license and asks for the drafted question');
  ok(/bank-rfp-checklist\.xlsx$/i.test(checklist.filename), 'the checklist file is named after the RFP', checklist.filename);
  ok(relevant.some(row => /Your client says: Akamai serves both sites/.test(row[3]) && row[4] === 'Yes') &&
    relevant.some(row => row[2] === 'Ask your client' && !row[3].includes('Your client says:')), 'the checklist distinguishes the client fact from unanswered asks');
  const client = await downloadWorkbook(p, 'rfp-writeback');
  const question = ref => client.sheets.Questions.find(row => row[1] === ref);
  ok(/-answered\.xlsx$/.test(client.filename) && client.sheets.Submission && client.sheets.Questions.some(row => row[3] === 'Vendor response'),
    'writeback retains the client workbook and its response column');
  ok(/What you already have in place/.test(question('2.2')[3]) && /What we would need from you/.test(question('2.2')[3]) &&
    /Harbor & Pine/.test(question('1.2')[3]) && question('2.3')[3] === 'Our own words for 2.3.', 'the original answer cells carry the selected draft, firm answer and edited answer');
  const sources = client.sheets['Adobe sources'].slice(1);
  ok(sources.length > 4 && sources.every(row => /^https:\/\//.test(row[3])) && sources.some(row => row[0] === '2.2'),
    'the Adobe sources worksheet links citations to their questions');
  await p.click('#rfp-to-sow'); await p.waitForTimeout(100);
  ok(await p.isVisible('#rfp-handoff-modal') && /This adds \d+ services? from \d+ chosen answers?/.test(await p.textContent('#rfp-handoff-text')), 'Add to my statement of work shows a one-line preview first (step 56)', await p.textContent('#rfp-handoff-text'));
  await p.click('#rfp-handoff-go'); await p.waitForTimeout(600);
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
