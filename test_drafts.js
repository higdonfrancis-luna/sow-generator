// Step 43: Save draft and Open draft on the Build page, over a server like Netlify (a folder serves its index.html) and
// one like Adobe Proto (exact file names under a prefix). Run from the repo root after python3 sow/build_site.py:
//   node sow/test_drafts.js
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const SITE = path.join(__dirname, 'site');
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + d + ']')); if (!c) fails++; };
function serve(proto) {
  const PRE = '/proto/abc/v1';
  const s = http.createServer((req, res) => { let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
    if (proto) { if (!u.startsWith(PRE + '/')) { res.writeHead(404); res.end(); return; } u = u.slice(PRE.length); if (u === '/') u = '/index.html'; }
    else if (u.endsWith('/')) u += 'index.html';
    const f = path.join(SITE, u);
    if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404, {'Content-Type': 'application/json'}); res.end('{"error":"object not found"}'); return; }
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); fs.createReadStream(f).pipe(res); });
  return new Promise(r => s.listen(0, () => r({s, base: `http://localhost:${s.address().port}${proto ? PRE + '/' : '/'}`})));
}
(async () => {
  const b = await chromium.launch(), tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'drafts-'));
  for (const proto of [false, true]) {
    const {s, base} = await serve(proto), tag = proto ? ' (Proto)' : ' (Netlify)';
    const ctx = await b.newContext({viewport: {width: 1440, height: 900}, acceptDownloads: true}); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(base); await p.waitForTimeout(400);
    ok(await p.isVisible('#open-draft') && await p.isHidden('#save-draft') && await p.isHidden('#saved-note'), 'on the play picker, Open draft shows and Save draft waits for a play' + tag);
    await p.click('#picker [data-play="aem"]'); await p.waitForTimeout(400);
    ok(await p.isVisible('#save-draft') && await p.isVisible('#open-draft') && await p.isVisible('#saved-note') && (await p.textContent('#saved-note')).includes('Saved in this browser'), 'with a play, Save draft, Open draft and "Saved in this browser as you go" show' + tag);
    await p.fill('#rate', '175'); await p.click('#size [data-size="large"]'); await p.waitForTimeout(150);
    await p.dblclick('.node[data-p="eds"] .offering-title'); await p.waitForTimeout(250); await p.click('#card [data-t="A03"]'); await p.waitForTimeout(150); await p.keyboard.press('Escape');
    const total = await p.textContent('#t-big');
    const [dl] = await Promise.all([p.waitForEvent('download', {timeout: 15000}), p.click('#save-draft')]);
    const file = path.join(tmp, (proto ? 'p-' : 'n-') + dl.suggestedFilename()); await dl.saveAs(file);
    await p.waitForURL(u => !/\/sow\//.test(String(u)), {timeout: 15000}); await p.waitForTimeout(700);
    const draft = JSON.parse(fs.readFileSync(file, 'utf8'));
    ok(draft.play === 'aem' && Number(draft.rate) === 175 && draft.estimates && draft.estimates.aem && draft.estimates.aem.A03 && draft.estimates.aem.A03.on === false, 'Save draft downloads the SOW steps\' own draft, with the canvas\'s latest changes (play, rate, a line taken out)' + tag, JSON.stringify({play: draft.play, rate: draft.rate, A03: draft.estimates && draft.estimates.aem && draft.estimates.aem.A03}));
    ok(/\.json$/.test(dl.suggestedFilename()), 'the draft is a JSON file' + tag, dl.suggestedFilename());
    ok(await p.isVisible('#canvas') && (await p.textContent('#t-big')) === total && await p.evaluate(() => lineOn('A03') === false), 'and the partner is back on Build, where they were' + tag, await p.textContent('#t-big') + ' vs ' + total);
    await p.waitForFunction(() => document.getElementById('toast').textContent.includes('Draft saved as'), null, {timeout: 5000}).catch(() => {});   // the message shows a moment after the page is back
    ok((await p.textContent('#toast')).includes('Draft saved as'), 'a message says the draft was saved' + tag, await p.textContent('#toast'));
    ok(!errs.length, 'no page errors' + tag, errs.join(' | '));
    await ctx.close();

    // a new browser: Open draft from the play picker
    const c2 = await b.newContext({viewport: {width: 1440, height: 900}}); const q = await c2.newPage(); const e2 = []; q.on('pageerror', e => e2.push(e.message));
    await q.goto(base); await q.waitForTimeout(400);
    if (proto) {
      await q.getByRole('button', {name: "My client's website is slow", exact: true}).click();
      await q.locator('#bp [data-bpa="build"]').click();
      await q.locator('#back-to-answer').waitFor();
    }
    await q.setInputFiles('#draft-file', file); await q.waitForURL(u => /synced=|index\.html$|\/$/.test(String(u)) && !/\/sow\//.test(String(u)), {timeout: 15000}); await q.waitForTimeout(900);
    ok(await q.isHidden('#picker') && (await q.textContent('#play-label')).includes('Sites Optimizer') && (await q.inputValue('#rate')) === '175', 'Open draft on a new browser puts the play and rate back on Build' + tag, await q.textContent('#play-label'));
    ok(await q.evaluate(() => lineOn('A03') === false) && (await q.textContent('#t-big')) === total, 'with the same services and the same total' + tag, await q.textContent('#t-big') + ' vs ' + total);
    await q.waitForFunction(() => document.getElementById('toast').textContent.includes('Draft opened'), null, {timeout: 5000}).catch(() => {});
    ok((await q.textContent('#toast')).includes('Draft opened'), 'a message says the draft was opened' + tag, await q.textContent('#toast'));
    ok(await q.isHidden('#back-to-answer'), 'opening another engagement clears the previous question history' + tag);
    // the SOW steps hold the same engagement
    await q.click('#save'); await q.waitForURL('**/sow/index.html#scope', {timeout: 15000}); await q.waitForTimeout(600);
    ok(await q.evaluate(() => state.play === 'aem' && Number(state.rate) === 175 && state.estimates.aem.A03.on === false), 'Continue shows the same engagement on the SOW steps' + tag);
    // a draft saved on the SOW steps opens on Build too
    const [dl2] = await Promise.all([q.waitForEvent('download', {timeout: 15000}), q.click('#save-draft')]).catch(() => [null]);
    ok(!!dl2, 'the SOW steps\' own Save draft still works' + tag);
    ok(!e2.length, 'no page errors after opening' + tag, e2.join(' | '));
    await c2.close();

    // a file that isn't a draft
    const bad = path.join(tmp, 'bad.json'); fs.writeFileSync(bad, '{"hello": "world"}');
    const c3 = await b.newContext({viewport: {width: 1440, height: 900}}); const r = await c3.newPage();
    await r.goto(base); await r.waitForTimeout(400); await r.setInputFiles('#draft-file', bad); await r.waitForTimeout(500);
    ok(!/\/sow\//.test(r.url()) && await r.isVisible('#picker') && (await r.textContent('#toast')).includes('Choose a JSON draft'), 'a file that is not a draft says so and stays on Build' + tag, await r.textContent('#toast'));
    await c3.close(); s.close();
  }
  // a phone: the picker's top bar stays on one row
  const {s, base} = await serve(false); const ph = await (await b.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true})).newPage();
  await ph.goto(base); await ph.waitForTimeout(400);
  ok(await ph.isVisible('#open-draft') && await ph.isVisible('#rfi-door') && await ph.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'the phone picker shows both entry points without sideways scrolling');
  await ph.tap('#picker [data-play="cja"]'); await ph.waitForTimeout(400);
  ok(await ph.isVisible('#save-draft') && await ph.isVisible('#open-draft') && await ph.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'on a phone with a play, both buttons show with no sideways scroll');
  s.close(); await b.close();
  console.log(fails ? `${fails} CHECK(S) FAILED` : 'ALL DRAFT CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})();
