// Step 67 (Nov 10 2026, Adam, to sow/mockups/nov10_sources_caveat/*.png): the statement of work no longer lists Adobe's
// capability references under each service; a tick box on the Statement of work step, off by default, adds them as one
// appendix. And the Services and Build steps tell the partner that the services are suggestions.
// Run from the repo root after python3 sow/canvas/build.py and python3 sow/build_site.py:
//   node sow/test_step67.js
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), os = require('os'), path = require('path');
const SITE = path.join(__dirname, 'site');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 400) + ']')); if (!c) fails++; };
const T = {'.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript'};
const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (u.endsWith('/')) u += 'index.html';
  const f = path.join(SITE, u);
  if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, {'Content-Type': T[path.extname(f)] || 'text/plain'}); fs.createReadStream(f).pipe(res);
});
const YOUR_CALL = 'Your call. These services and hours are a suggested starting point, drawn from Adobe’s public documentation. They are not requirements. Add, remove, reword and price them as you see fit: you decide what you propose to your client.';
const SUGGEST = 'Services are suggestions: you decide what to propose.';
(async () => {
  await new Promise(r => server.listen(0, r));
  const BASE = `http://localhost:${server.address().port}/`, tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'step67-'));
  const b = await chromium.launch(), errs = [];
  const fresh = async (w = 1500) => { const ctx = await b.newContext({viewport: {width: w, height: 950}, acceptDownloads: true}); const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); return p; };
  const toSow = async (p, play) => { await p.goto(BASE); await p.waitForTimeout(400); await p.click(`#picker [data-play="${play}"]`); await p.waitForTimeout(400);
    await p.fill('#rate', '150'); await p.waitForTimeout(200); await p.click('#save'); await p.waitForURL('**/sow/index.html#scope', {timeout: 15000}); await p.waitForTimeout(600); };
  const doc = async p => { await p.click('[data-step="document"]'); await p.waitForTimeout(500); };
  const read = p => p.evaluate(() => { const d = document.querySelector('#sow-preview .sow-document'), a = d.querySelector('.sow-appendix');
    return {text: d.textContent, services: [...d.querySelectorAll('.sow-service')].map(s => ({name: s.querySelector('h3').textContent.trim(), links: s.querySelectorAll('a').length, heads: [...s.querySelectorAll('h4')].map(h => h.textContent)})),
      appendix: a && {title: a.querySelector('h2').textContent, intro: a.querySelector('p').textContent, heads: [...a.querySelectorAll('h4')].map(h => h.textContent), links: [...a.querySelectorAll('a')].map(x => x.href),
        afterApproval: !!(a.previousElementSibling && a.previousElementSibling.querySelector('.sow-approval')), last: !a.nextElementSibling},
      withRefs: selectedLines().filter(l => CapabilityReferences.list(l).length).length, checked: document.getElementById('sow-refs').checked}; });
  const download = async (p, name) => { const [d] = await Promise.all([p.waitForEvent('download'), p.click('#download-sow')]); const f = path.join(tmp, name); await d.saveAs(f); return fs.readFileSync(f, 'utf8'); };

  // 1. the statement of work, as it opens
  let p = await fresh(); await toSow(p, 'commerce'); await doc(p);
  let d = await read(p);
  ok(await p.isVisible('#sow-refs') && !d.checked && /^\s*Add Adobe capability references as an appendix\s*$/.test(await p.textContent('.sow-refs-toggle')), 'the Statement of work step has a tick box, "Add Adobe capability references as an appendix", not ticked');
  ok(d.services.length > 3 && d.services.every(s => s.links === 0 && !s.heads.some(h => /reference/i.test(h))), 'no service in the statement of work lists references or carries a link', JSON.stringify(d.services.filter(s => s.links).map(s => s.name)));
  ok(!d.appendix && !/capability reference/i.test(d.text), 'and there is no appendix: the statement of work does not mention capability references');
  ok(d.services.every(s => ['Scope', 'Deliverables', 'Acceptance criteria'].every(h => s.heads.includes(h))), 'each service keeps its scope, deliverables and acceptance criteria');
  let file = await download(p, 'off.html');
  ok(!/capability reference/i.test(file) && /Services and deliverables/.test(file), 'Download SOW gives the same: no references');

  // 2. ticked: one appendix after Approval
  await p.check('#sow-refs'); await p.waitForTimeout(300); d = await read(p);
  ok(d.appendix && d.appendix.title === 'Appendix: Adobe capability references' && d.appendix.intro === 'Adobe’s public documentation for the capabilities each service uses.', 'ticking it adds "Appendix: Adobe capability references"', d.appendix && d.appendix.title);
  ok(d.appendix.afterApproval && d.appendix.last, 'the appendix is the last thing in the document, after Approval and its footer');
  ok(d.appendix.heads.length === d.withRefs && d.appendix.heads.every(h => d.services.some(s => s.name.replace(/Service concept$/, '').trim() === h)), 'it lists each service that has references under that service\'s own numbered heading', d.appendix.heads.join(' | '));
  ok(d.appendix.links.length >= d.appendix.heads.length && d.appendix.links.every(u => /^https:\/\//.test(u)), 'every reference is a link to an https page', d.appendix.links.length);
  ok(d.services.every(s => s.links === 0), 'the services themselves still carry no links');
  file = await download(p, 'on.html');
  ok(/Appendix: Adobe capability references/.test(file) && file.indexOf('Appendix: Adobe capability references') > file.indexOf('sow-approval'), 'Download SOW carries the appendix, after Approval');
  ok(/\.sow-refs-toggle[^{]*\{[^}]*\}/.test(file) && !/id="sow-refs"/.test(file), 'the downloaded file has no tick box in it');
  const css = await p.evaluate(() => document.querySelector('style').textContent);
  ok(/\.document-actions,\.sow-refs-toggle,[^{]*\{display:none!important\}/.test(css) && /@media print\{\.sow-appendix\{break-before:page\}\}/.test(css), 'in print the tick box is hidden and the appendix starts on a new page');

  // 3. the choice stays with the engagement
  await p.reload(); await p.waitForTimeout(700); await doc(p); d = await read(p);
  ok(d.checked && d.appendix, 'after a reload the box is still ticked and the appendix is there');
  await p.click('[data-step="services"]'); await p.waitForTimeout(300); await doc(p);
  ok((await read(p)).checked, 'and it stays ticked across the steps');
  await p.uncheck('#sow-refs'); await p.waitForTimeout(300); d = await read(p);
  ok(!d.appendix && !/capability reference/i.test(d.text), 'unticking it takes the appendix away');
  ok(await p.evaluate(() => normalize({}).sowReferences === false && normalize({sowReferences: 'yes'}).sowReferences === false && normalize({sowReferences: true}).sowReferences === true), 'saved work from before this step opens with the box off');

  // 4. the references are still where the partner scopes
  await p.click('[data-step="services"]'); await p.waitForTimeout(400);
  ok(await p.locator('#services-panel .service-source a').count() > 3 && await p.locator('#services-panel .capability-references').count() > 0, 'the Services step keeps each service\'s capability reference and supporting references');
  await doc(p);
  const [csvD] = await Promise.all([p.waitForEvent('download'), p.click('#export-csv')]); const csvF = path.join(tmp, 's.csv'); await csvD.saveAs(csvF);
  ok(/Capability references/.test(fs.readFileSync(csvF, 'utf8')), 'the Services CSV keeps its references column');

  // 5. "Your call" on the Services step
  await p.click('[data-step="services"]'); await p.waitForTimeout(300);
  ok(await p.isVisible('#services-panel .your-call') && (await p.textContent('#services-panel .your-call')).trim() === YOUR_CALL, 'the Services step says the services are a suggested starting point and the partner decides', await p.textContent('#services-panel .your-call').catch(() => ''));
  const order = await p.evaluate(() => { const a = document.querySelector('#services-panel .service-intro'), n = document.querySelector('#services-panel .your-call'); return a.nextElementSibling === n; });
  ok(order, 'the note sits right under the step\'s intro');
  const ink = await p.$eval('#services-panel .your-call', e => { const c = getComputedStyle(e); return c.color + '|' + c.opacity; });
  ok(ink === 'rgb(28, 28, 28)|1', 'in solid dark text, not dimmed', ink);
  await doc(p); d = await read(p);
  ok(!/Your call|suggested starting point|are suggestions/.test(d.text), 'the statement of work, which goes to the client, does not carry the note');
  await p.context().close();

  // 6. the Build step's fees box
  p = await fresh(); await p.goto(BASE); await p.waitForTimeout(400); await p.click('#picker [data-play="cja"]'); await p.waitForTimeout(400);
  ok((await p.textContent('#t-note')).trim() === 'Hours are planning assumptions, not a quote. ' + SUGGEST, 'on a play, before a rate, the fees box says hours are planning assumptions and services are suggestions', await p.textContent('#t-note'));
  await p.fill('#rate', '150'); await p.waitForTimeout(300);
  ok((await p.textContent('#t-note')).trim().endsWith(SUGGEST), 'with a rate it still says so', await p.textContent('#t-note'));
  await p.goto(BASE); await p.waitForTimeout(300); await p.evaluate(() => { try { localStorage.clear(); sessionStorage.clear(); } catch (e) {} }); await p.reload(); await p.waitForTimeout(400);
  await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400);
  await p.evaluate(() => { addProduct('frameio'); addProduct('workfront'); }); await p.keyboard.press('Escape'); await p.fill('#rate', '150'); await p.waitForTimeout(300);
  const note = (await p.textContent('#t-note')).trim();
  ok(/of this is service concepts with placeholder hours\./.test(note) && note.endsWith(SUGGEST), 'on Create your own play the box keeps its service-concepts line and adds the sentence', note);
  await p.context().close();

  // 7. a phone
  p = await fresh(390); await toSow(p, 'abv'); await doc(p);
  const box = await p.evaluate(() => { const r = document.querySelector('.sow-refs-toggle').getBoundingClientRect(); return {l: r.left, r: r.right, w: innerWidth, sw: document.documentElement.scrollWidth}; });
  ok(box.l >= 0 && box.r <= box.w + 1 && box.sw <= box.w + 1, 'on a phone the tick box fits the screen', JSON.stringify(box));
  await p.check('#sow-refs'); await p.waitForTimeout(300);
  ok((await read(p)).appendix, 'and adds the appendix there too');
  await p.click('[data-step="services"]'); await p.waitForTimeout(300);
  const yc = await p.evaluate(() => { const r = document.querySelector('#services-panel .your-call').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth + 1; });
  ok(yc, 'the "Your call" note fits a phone');
  await p.context().close();

  ok(!errs.length, 'no page errors', errs.slice(0, 3).join(' | '));
  console.log(fails ? `\n${fails} of ${n} STEP 67 CHECKS FAILED` : `\nALL STEP 67 CHECKS PASSED (${n})`);
  await b.close(); server.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
