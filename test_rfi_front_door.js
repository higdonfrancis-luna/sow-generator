// Step 57 (Nov 10 2026, Adam: "you can't get to the tab until you click through a few things", "why wouldn't you just have
// RFP builder?", "it's RFI"): the RFI front door on the first page and the RFI Builder on its own until the hand-off.
// Run from the repo root after python3 sow/canvas/build.py and python3 sow/build_site.py:
//   node sow/test_rfi_front_door.js
// Serves the whole site (sow/site/) and checks the front door, the RFI-only view (no steps, no play, no SOW draft buttons),
// that a reload keeps it, that Add to my statement of work opens the full tool on Services, that every other arrival shows the
// full tool, that Back to the first page leaves without a warning, and that the page fits a phone in RFI-only mode.
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, 'site'), FIX = path.join(__dirname, 'qa', 'rfp_fixtures');
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 400) + ']')); if (!c) fails++; };
const T = {'.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript'};
const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (u.endsWith('/')) u += 'index.html';
  const f = path.join(SITE, u);
  if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, {'Content-Type': T[path.extname(f)] || 'text/plain'}); fs.createReadStream(f).pipe(res);
});
(async () => {
  await new Promise(r => server.listen(0, r));
  const B = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch(), ctx = await b.newContext({viewport: {width: 1400, height: 1000}}), p = await ctx.newPage();
  const errs = [], dialogs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => { dialogs.push(d.type()); d.accept(); });
  const shown = sel => p.$eval(sel, e => !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)).catch(() => false);
  const only = () => p.evaluate(() => document.body.classList.contains('rfi-only'));
  // a change of the address after # alone does not load the page again, so each arrival starts from a blank page
  const visit = async u => { await p.goto('about:blank'); await p.goto(B + u); await p.waitForTimeout(700); };
  // 1. the front door
  await p.goto(B + 'index.html'); await p.waitForTimeout(600);
  const door = await p.evaluate(() => { const d = document.getElementById('rfi-door'), bp = document.getElementById('bp'), a = d && d.querySelector('a');
    return d && {title: d.querySelector('h2').textContent.trim(), link: a.getAttribute('href'), button: a.textContent.trim(), afterProblem: bp.nextElementSibling === d, beforePlays: d.nextElementSibling && d.nextElementSibling.textContent === 'Choose a play to start', sameBox: d.classList.contains('bp')}; });
  ok(door && door.title === 'Have an RFI? Start from it' && door.button === 'Open the RFI Builder' && door.link === 'sow/index.html#rfi', 'the first page has the RFI front door with its red button to the RFI Builder', JSON.stringify(door));
  ok(door && door.afterProblem && door.beforePlays && door.sameBox, 'the door sits under the problem box, in its style, above Choose a play to start');
  // 2. through the door: the RFI Builder on its own
  await p.click('#rfi-door a'); await p.waitForTimeout(800);
  ok(await only() && new URL(p.url()).hash === '#rfp' && await shown('#rfp-panel'), 'the door opens the RFI Builder in RFI-only mode, on #rfp');
  ok(!await shown('.steps') && !await shown('#save-draft') && !await shown('#open-draft') && !await shown('#start-over') && !await shown('#play-title') && !await shown('[data-change]'), 'no steps, no play heading, no Change play and no SOW draft buttons');
  ok(await shown('.rfi-top') && (await p.$eval('.rfi-top h1', e => e.textContent)) === 'Answer an RFI' && (await p.$eval('.rfi-top .eyebrow', e => e.textContent)) === 'RFI Builder' && await shown('#rfi-back') && !await shown('#rfp-panel .section-intro h2'), 'its own heading, Answer an RFI, and Back to the first page');
  ok(/Drop the RFI here/.test(await p.textContent('#rfp-drop')) && /Answering an RFP\? Answer its questions here, then Add to my statement of work to scope and price it\./.test(await p.textContent('#rfp-panel .section-intro')), 'the drop zone says RFI, and the intro says how an RFP is answered');
  await p.reload(); await p.waitForTimeout(800);
  ok(await only() && await shown('#rfp-panel') && !await shown('.steps'), 'a reload keeps the RFI Builder on its own');
  await p.setViewportSize({width: 390, height: 844}); await p.waitForTimeout(200);
  ok(await p.evaluate(() => document.documentElement.scrollWidth) <= 390, 'RFI-only mode fits a 390-pixel phone', String(await p.evaluate(() => document.documentElement.scrollWidth)));
  await p.setViewportSize({width: 1400, height: 1000});
  // 3. the hand-off opens the full tool
  await p.setInputFiles('#rfp-file', path.join(FIX, 'bank_rfp.xlsx'));
  await p.waitForFunction(() => /questions found/.test(document.getElementById('rfp-status').textContent), null, {timeout: 30000});
  await p.waitForTimeout(300); await p.click('#rfp-use'); await p.waitForTimeout(150);
  await p.click('#rfp-to-sow'); await p.waitForTimeout(150); await p.click('#rfp-handoff-go'); await p.waitForTimeout(700);
  ok(!await only() && await shown('.steps') && await shown('#save-draft') && await shown('#play-title') && new URL(p.url()).hash === '#services', 'Add to my statement of work turns RFI-only mode off and opens the full tool on Services', JSON.stringify({only: await only(), hash: new URL(p.url()).hash}));
  ok(/RFI Builder/.test(await p.textContent('.steps')) && /The RFI list is still on the RFI Builder tab/.test(await p.textContent('body')), 'the full tool has the RFI Builder tab, and the toast points to it');
  await visit('sow/index.html#rfp');
  ok(!await only() && await shown('.steps'), 'after the hand-off, coming back to the RFI Builder shows the full tool');
  // 4. every other arrival shows the full tool, and the RFI-only mark does not stick
  await visit('sow/index.html#rfi');
  ok(await only(), 'the #rfi address turns RFI-only mode on again');
  await visit('sow/index.html#scope');
  ok(!await only() && await shown('.steps') && await p.evaluate(() => sessionStorage.getItem('abv-rfi-only')) === null, 'arriving on another step shows the full tool and clears the mark');
  await visit('sow/index.html#rfp');
  ok(!await only(), 'the RFI Builder reached from the full tool keeps the full tool');
  // 5. Back to the first page, the way a partner gets there (a fresh browser, through the door): no warning, the picker and its door
  const ctx2 = await b.newContext({viewport: {width: 1400, height: 1000}}), q = await ctx2.newPage();
  const dialogs2 = []; q.on('dialog', d => { dialogs2.push(d.type()); d.accept(); }); q.on('pageerror', e => errs.push(e.message));
  await q.goto(B + 'index.html'); await q.waitForTimeout(600); await q.click('#rfi-door a'); await q.waitForTimeout(800);
  await q.setInputFiles('#rfp-file', path.join(FIX, 'bank_rfp.txt'));
  await q.waitForFunction(() => /questions found/.test(document.getElementById('rfp-status').textContent), null, {timeout: 30000});
  await q.click('#rfp-use').catch(() => {}); await q.waitForTimeout(150);
  await q.click('#rfi-back'); await q.waitForTimeout(800);
  ok(new URL(q.url()).pathname === '/index.html' && dialogs2.length === 0 && await q.isVisible('#rfi-door'), 'Back to the first page goes back to the play picker and its door, with no leave-this-page warning', JSON.stringify({path: new URL(q.url()).pathname, dialogs: dialogs2}));
  await q.click('#rfi-door a'); await q.waitForTimeout(800);
  ok(await q.evaluate(() => RFPBuilder.state.questions.length) === 12, 'going back in through the door finds the RFI still there (the work is kept in the tab)');
  // 6. the Build page's own step row has the RFI Builder tab
  await q.click('#rfi-back'); await q.waitForTimeout(800);
  await q.click('#picker [data-play="cja"]'); await q.waitForTimeout(600);
  const tabs = await q.$$eval('.tabs button', e => e.map(x => x.textContent.trim()).join('|'));
  ok(tabs === 'Build|Scope|Services|Statement of work|RFI Builder', 'the Build page shows five tabs, RFI Builder last', tabs);
  await q.click('.tabs [data-tab="rfp"]'); await q.waitForTimeout(900);
  ok(/\/sow\/index\.html$/.test(new URL(q.url()).pathname) && new URL(q.url()).hash === '#rfp' && await q.isVisible('#rfp-panel') && !await q.evaluate(() => document.body.classList.contains('rfi-only')) && await q.isVisible('.steps'), 'the RFI Builder tab on Build opens the RFI Builder inside the full tool, with the play');
  await ctx2.close();
  ok(errs.length === 0, 'no script errors', errs.join(' | '));
  await b.close(); server.close();
  console.log(fails ? `${fails} FRONT DOOR CHECK(S) FAILED` : 'ALL FRONT DOOR CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
