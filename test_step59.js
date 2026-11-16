// Step 59 (Nov 10 2026): Engagement title is removed from the Scope step, as drawn in
// sow/mockups/nov10_engagement_title/engagement_title.png. The statement of work is always titled with the play's own
// title, the file is named from the Client or the play, and a title typed earlier is dropped.
// Run from the repo root after python3 sow/build_site.py:
//   node sow/test_step59.js
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, 'site'), FIX = path.join(__dirname, 'qa', 'step58_fixtures');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + d + ']')); if (!c) fails++; };
const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  if (u.endsWith('/')) u += 'index.html';
  const f = path.join(SITE, u);
  if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, {'Content-Type': f.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/plain'}); fs.createReadStream(f).pipe(res);
});
// Nov 15 2026 (19b0363): the canvas shows one customer-facing offering, AEM Sites with Edge Delivery Services, and the AEM play's
// statement of work is titled with that name (it was 'Services for Brand Visibility, Sites Optimizer and Edge Delivery Services').
const TITLES = {cja: 'Services for Brand Visibility and Customer Journey Analytics', commerce: 'Services for Brand Visibility and Adobe Commerce', aem: 'Services for Brand Visibility, Sites Optimizer and AEM Sites with Edge Delivery Services',
  fsi: 'Services for Brand Visibility and Brand Concierge', abv: 'Services for Brand Visibility', coworker: 'Services for Adobe CX Enterprise Coworker'};
(async () => {
  await new Promise(r => server.listen(0, r));
  const BASE = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch(), errs = [];
  const fresh = async (w = 1500) => { const ctx = await b.newContext({viewport: {width: w, height: 950}, acceptDownloads: true}); const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); return p; };

  // 1. the Scope step's Client and partner card
  let p = await fresh(); await p.goto(BASE); await p.waitForTimeout(400);
  await p.click('#picker [data-play="cja"]'); await p.waitForTimeout(400);
  await p.click('#save'); await p.waitForURL('**/sow/index.html#scope', {timeout: 15000}); await p.waitForTimeout(600);
  const cardInfo = async q => q.evaluate(() => { const card = [...document.querySelectorAll('#scope-panel .form-card')].find(c => c.querySelector('h3').textContent === 'Client and partner');
    const labels = [...card.querySelectorAll('label')].map(l => ({name: l.firstChild.textContent.trim(), top: Math.round(l.getBoundingClientRect().top), left: Math.round(l.getBoundingClientRect().left), wide: l.classList.contains('wide')}));
    return {labels, body: document.body.innerText, html: document.documentElement.innerHTML, box: !!document.querySelector('[data-brief="title"]'), briefs: [...document.querySelectorAll('[data-brief]')].map(x => x.dataset.brief)}; });
  let c = await cardInfo(p);
  ok(c.labels.map(l => l.name).join('|') === 'Client|Partner|SOW reference|Prepared on', 'the Client and partner card has four boxes: Client, Partner, SOW reference, Prepared on', c.labels.map(l => l.name).join('|'));
  ok(c.labels[0].top === c.labels[1].top && c.labels[2].top === c.labels[3].top && c.labels[2].top > c.labels[0].top && c.labels[0].left === c.labels[2].left && c.labels[1].left === c.labels[3].left && c.labels[1].left > c.labels[0].left,
    'in two rows: Client and Partner, then SOW reference and Prepared on', JSON.stringify(c.labels));
  ok(!c.box && !/Engagement title/.test(c.body) && !/Engagement title|Use the sales play title/.test(c.html) && c.briefs.join('|') === 'objective', 'there is no Engagement title box, label or placeholder anywhere on the page', c.briefs.join('|'));
  ok(await p.evaluate(() => !('title' in state.briefs.cja) && Object.values(state.briefs).every(x => !('title' in x))), 'a new engagement\'s brief holds no title');

  // 2. the statement of work is titled with the play's own title, for every play
  const seen = {};
  for (const id of Object.keys(TITLES)) seen[id] = await p.evaluate(id => { state.play = id; go('document'); return {h1: document.querySelector('#sow-preview h1').textContent, doc: docState().title}; }, id);
  ok(Object.keys(TITLES).every(id => seen[id].h1 === TITLES[id] && seen[id].doc === TITLES[id]), 'the statement of work is titled with the play\'s own title on all six plays', JSON.stringify(seen).slice(0, 300));
  await p.evaluate(() => { state.play = 'cja'; go('scope'); }); await p.waitForTimeout(200);

  // 3. the downloaded file is named from the Client, or from the play when no Client is typed (Download SOW was removed Nov 13, Print / PDF
  // covers it; Adam, Nov 14: the Services CSV is the download named this way, and the statement of work is read where Print / PDF prints it)
  await p.click('[data-step="document"]'); await p.waitForTimeout(300);
  let [dl] = await Promise.all([p.waitForEvent('download', {timeout: 15000}), p.click('#export-csv')]);
  ok(/^cja-SOW(-DRAFT)?\.csv$/.test(dl.suggestedFilename()), 'with no Client typed, the file is named from the play', dl.suggestedFilename());
  ok(await p.$eval('#sow-preview h1', e => e.textContent) === TITLES.cja, 'and the statement of work carries the play\'s title as its heading');
  await p.click('[data-step="scope"]'); await p.fill('[data-meta="customer"]', 'Northwind Outfitters'); await p.waitForTimeout(200);
  await p.click('[data-step="document"]'); await p.waitForTimeout(300);
  [dl] = await Promise.all([p.waitForEvent('download', {timeout: 15000}), p.click('#export-csv')]);
  ok(/^Northwind-Outfitters-SOW(-DRAFT)?\.csv$/.test(dl.suggestedFilename()), 'with a Client typed, the file is named from the Client', dl.suggestedFilename());
  await p.context().close();

  // 4. a title typed earlier (in this browser or a saved draft) is dropped, and nothing else in the draft changes
  const store = JSON.parse(fs.readFileSync(path.join(FIX, 'step57_cja_search.json'), 'utf8')), old = JSON.parse(store['partner-sow-studio-v6']);
  old.briefs.cja.title = 'Northwind AI visibility program'; old.customer = 'Northwind Outfitters'; old.briefs.cja.coverage.domains = 'northwind.example';
  p = await fresh(); await p.goto(BASE + 'robots.txt');
  await p.evaluate(s => { for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, {...store, 'partner-sow-studio-v6': JSON.stringify(old)});
  await p.goto(BASE + 'sow/index.html#document'); await p.waitForTimeout(900);
  let got = await p.evaluate(() => ({title: 'title' in state.briefs.cja, h1: document.querySelector('#sow-preview h1').textContent, doc: document.querySelector('#sow-preview').textContent, customer: state.customer, domains: state.briefs.cja.coverage.domains, objective: state.briefs.cja.objective, on: state.estimates.cja.C01.on, hours: state.estimates.cja.C01.hours}));
  ok(!got.title && got.h1 === TITLES.cja && !got.doc.includes('Northwind AI visibility program'), 'a browser that held a typed title opens with the play\'s title; the typed title is gone', got.h1);
  ok(got.customer === 'Northwind Outfitters' && got.domains === 'northwind.example' && got.objective === old.briefs.cja.objective && got.on === old.estimates.cja.C01.on && got.hours === old.estimates.cja.C01.hours, 'the Client, the coverage, the objective and the services are as saved');
  [dl] = await Promise.all([p.waitForEvent('download', {timeout: 15000}), p.click('#export-csv')]);
  ok(/^Northwind-Outfitters-SOW(-DRAFT)?\.csv$/.test(dl.suggestedFilename()), 'and its file is named from the Client, not the old title', dl.suggestedFilename());
  // the same through Open draft: a draft file with a title
  const draft = path.join(require('os').tmpdir(), 'step59-draft.json'); fs.writeFileSync(draft, JSON.stringify(old));
  await p.setInputFiles('#draft-file', draft); await p.waitForTimeout(1500);
  got = await p.evaluate(() => ({title: Object.values(state.briefs).some(x => 'title' in x), play: state.play, saved: JSON.parse(localStorage.getItem('partner-sow-studio-v6'))}));
  ok(!got.title && got.play === 'cja' && Object.values(got.saved.briefs).every(x => !('title' in x)), 'a draft file that carries a title opens without it, and the browser saves none');
  fs.unlinkSync(draft);
  await p.context().close();

  // 5. a leftover title is not work to keep; a typed objective still is
  p = await fresh(); await p.goto(BASE + 'sow/index.html#scope'); await p.waitForTimeout(700);
  const w = await p.evaluate(() => { const a = hasWork('abv'); state.briefs.abv.title = 'A leftover title'; const t = hasWork('abv'); delete state.briefs.abv.title;
    state.briefs.abv.objective = 'Win more AI answers for the outdoor range.'; return [a, t, hasWork('abv')]; });
  ok(w[0] === false && w[1] === false && w[2] === true, 'a play with nothing typed holds no work, a leftover title does not change that, and a typed objective still counts as work', JSON.stringify(w));
  await p.context().close();

  // 6. a phone: the card's boxes stack, still without the title
  p = await fresh(390); await p.goto(BASE + 'sow/index.html#scope'); await p.waitForTimeout(700);
  c = await cardInfo(p);
  ok(c.labels.map(l => l.name).join('|') === 'Client|Partner|SOW reference|Prepared on' && !c.box && await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'on a 390-pixel phone the card shows the same four boxes and the page does not scroll sideways', c.labels.map(l => l.name).join('|'));
  await p.context().close();

  ok(!errs.length, 'no page errors', errs.slice(0, 3).join(' | '));
  await b.close(); server.close();
  console.log(fails ? `\n${fails} of ${n} STEP 59 CHECKS FAILED` : `\nALL STEP 59 CHECKS PASSED (${n})`);
  process.exit(fails ? 1 : 0);
})();
