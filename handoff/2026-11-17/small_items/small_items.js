// Pictures for the two small items. Reads the built site; changes nothing in the repository.
const R = require('path').resolve(__dirname, '..', '..', '..');
const out = process.argv[2];
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const { open } = require(R + '/rfp_prototype/review_2026-11-09/harness.js');

(async () => {
  // Item 2: the partner-only notes box, today and with the new heading (text swapped on the page for the picture only)
  const h = await open({ scale: 2 });
  const r = await h.file(R + '/qa/rfp_fixtures/bank_rfp.xlsx');
  await h.select(r.questions.findIndex(x => x.label === '2.6'));
  const note = await h.page.$('#rfp-answer .rfp-partner-note');
  await note.scrollIntoViewIfNeeded();
  console.log('confirm items:', await h.eval(() => [...document.querySelectorAll('#rfp-answer .rfp-confirm li')].map(e => e.textContent.slice(0, 90))));
  await note.screenshot({ path: out + '/item2_today.png' });
  const swapped = await h.eval(() => {
    let n = 0;
    for (const p of document.querySelectorAll('#rfp-answer .rfp-partner-note p')) {
      if (p.textContent === 'Confirm with Adobe:') { p.textContent = 'Adobe’s part:'; n++; }
    }
    return n;
  });
  console.log('headings swapped for the picture:', swapped);
  await note.screenshot({ path: out + '/item2_proposed.png' });
  await h.close();

  // Item 1: Coworker + Adobe Analytics on Create your own play
  const SITE = R + '/site';
  const T = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml' };
  const srv = http.createServer((q, s) => {
    let u = decodeURIComponent(q.url.split('?')[0].split('#')[0]);
    if (u.endsWith('/')) u += 'index.html';
    const f = path.join(SITE, u);
    if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end(); }
    s.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'text/plain' });
    fs.createReadStream(f).pipe(s);
  });
  await new Promise(res => srv.listen(0, res));
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1500, height: 2600 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto('http://localhost:' + srv.address().port + '/');
  await p.waitForTimeout(500);
  await p.click('#picker [data-play="custom"]');
  await p.waitForTimeout(400);
  for (const id of ['cw', 'aa']) {
    if (await p.isHidden('#add-menu')) await p.click('#add-btn');
    await p.$eval('#add-menu [data-add="' + id + '"]', e => { const d = e.closest('details'); if (d) d.open = true; });
    await p.click('#add-menu [data-add="' + id + '"]');
    await p.waitForTimeout(300);
  }
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);
  await p.click('.ib[data-c="cw-aa"]');
  await p.waitForTimeout(400);
  for (const d of await p.$$('#card details')) {
    if (!(await d.evaluate(x => x.open))) await d.$eval('summary', s => s.click());
  }
  await p.waitForTimeout(200);
  await p.$eval('#card .ln[data-l="XL27"]', e => e.scrollIntoView({block:'center'}));
  console.log('card', await p.$eval('#card', e => [e.scrollHeight, e.clientHeight, e.innerText.slice(-700)]));
  await p.screenshot({ path: out + '/item1_today_full.png' });
  await (await p.$('#card')).screenshot({ path: out + '/item1_today_card.png' });
  if (process.argv[3]) {
    await p.click(process.argv[3]);
    await p.waitForTimeout(400);
    await p.screenshot({ path: out + '/item1_proposed_full.png' });
    await (await p.$('#card')).screenshot({ path: out + '/item1_proposed_card.png' });
  }
  await b.close();
  srv.close();
})().catch(e => { console.error(e); process.exit(1); });
