// Step 58 (Nov 10 2026): the Brand Visibility wording pass. No trial or paid-offer wording about Brand Visibility, and
// Adobe Analytics is not named as a way to feed Brand Visibility. Checks the canvas cards, the SOW, and that work saved on
// the step 57 build (sow/qa/step58_fixtures/, captured from commit 0cfc619) takes the new wording without "Scope edited".
// Run from the repo root after python3 sow/build_site.py:
//   node sow/test_step58.js
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
// what rule 1 and rule 2 forbid, wherever a partner or a client reads it
const TRIAL = /\btrials?\b|paid (?:Brand Visibility )?offer|paid Brand Visibility/i;
const TRIAL_OK = /Sites Optimizer trial|Trial sites authored in Google Drive or SharePoint|Adobe's trial page says headless delivery|Try Before You Buy, a trial or the Agentic SKU/gi;
const trial = t => TRIAL.test(String(t).replace(TRIAL_OK, ''));
const aaFeed = t => String(t).split(/(?<=[.;])\s+/).some(s => /Adobe Analytics/.test(s) && /Brand Visibility|Business Impact/.test(s));
const hit = t => { const s = String(t).replace(TRIAL_OK, ''), m = TRIAL.exec(s); return m ? s.slice(Math.max(0, m.index - 60), m.index + 80) : (String(t).split(/(?<=[.;])\s+/).find(x => /Adobe Analytics/.test(x) && /Brand Visibility|Business Impact/.test(x)) || '').slice(0, 160); };
(async () => {
  await new Promise(r => server.listen(0, r));
  const BASE = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch(), errs = [];
  const fresh = async () => { const ctx = await b.newContext({viewport: {width: 1500, height: 950}}); const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); return p; };
  const seeded = async store => { const p = await fresh(); await p.goto(BASE + 'robots.txt');
    await p.evaluate(s => { for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, store); return p; };

  // 1. the canvas cards
  let p = await fresh(); await p.goto(BASE); await p.waitForTimeout(400);
  const card = async sel => { await p.click(sel); await p.waitForTimeout(300); const t = await p.textContent('#card'); await p.click('#card [data-close]'); await p.waitForTimeout(150); return t.replace(/\s+/g, ' '); };
  const play = async id => { if (await p.isVisible('#change-play')) { await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300); } await p.click(`#picker [data-play="${id}"]`); await p.waitForTimeout(400); };
  await play('cja');
  let t = await card('.ib[data-c="bv-cja"]');
  ok(t.includes("A Brand Visibility license (CJA's page requires it for the source)") && !trial(t) && !aaFeed(t), 'Brand Visibility + CJA: the first prerequisite is "A Brand Visibility license", with no trial wording', hit(t));
  await p.click('#out-btn'); await p.waitForTimeout(200);
  const menu = (await p.textContent('#out-menu')).replace(/\s+/g, ' ');
  ok(!trial(menu) && !aaFeed(menu) && !/nor Adobe Analytics/.test(menu), 'the Add outside system menu names no trial and no Adobe Analytics feed', hit(menu));
  await p.click('#out-menu [data-out="search"]'); await p.waitForTimeout(400);
  if (await p.isVisible('#card')) await p.click('#card [data-close]');
  t = await card('.ib[data-c="search-bv"]');
  ok(t.includes('GA4 is included with the Brand Visibility license.') && t.includes('Needs a Brand Visibility license') && t.includes('can fill the Business Impact tab, as CJA can.') && t.includes('when your client does not have CJA') && !trial(t) && !/Adobe Analytics/.test(t),
    'Search data + Brand Visibility: GA4 comes with the license, the tag reads "Needs a Brand Visibility license", and the Business Impact tab is filled by GA4 "as CJA can"', hit(t) || t.slice(0, 200));
  ok(/Connect Search Console, and GA4 where your client does not have CJA,/.test(await p.evaluate(() => LN.SD1.scope)) && await p.evaluate(() => LN.SD1.tier === 'a Brand Visibility license'), 'the Search Console and GA4 service says "where your client does not have CJA"');
  await play('aem');
  t = await card('.ib[data-c="bv-eds"]');
  ok(/Brand Visibility license; for the one-click route, users with the Adobe LLM Optimizer Users product profile(?! \()/.test(t) && !trial(t), 'Brand Visibility + Edge Delivery Services: the license line no longer speaks of trial users', hit(t));
  await play('commerce');
  t = await card('.ib[data-c="bv-commerce"]');
  ok(/Adobe Commerce storefront and a Brand Visibility license(?! \()/.test(t) && !trial(t), 'Brand Visibility + Adobe Commerce: the license line no longer speaks of trials', hit(t));
  ok((await p.evaluate(() => { const c = CAT.connections.find(x => x.id === 'bv-commerce'); return c.prereqs[0]; })) === 'Adobe Commerce storefront and a Brand Visibility license', 'and it is still the first prerequisite on that card');
  await play('custom');
  for (const id of ['bv', 'aemsites']) { if (await p.isHidden('#add-menu')) await p.click('#add-btn'); await p.click(`#add-menu [data-add="${id}"]`); await p.waitForTimeout(300); }
  await p.keyboard.press('Escape'); await p.mouse.click(40, 938); await p.waitForTimeout(200);
  if (await p.isVisible('#card')) await p.click('#card [data-close]');
  t = await card('.ib[data-c="aemsites-bv"]');
  ok(t.includes("Not stated by Adobe; confirm your client's deployment allowance and supported opportunity types before optimization begins.") && /users need the Adobe LLM Optimizer Users product profile(?! \()/.test(t) && !trial(t),
    'AEM Sites + Brand Visibility: the availability note and the license line carry no trial wording', hit(t));
  // every card and every service of every play, as data
  const all = await p.evaluate(() => JSON.stringify({c: CAT.connections.map(c => [c.id, c.label, c.how, c.availability, c.sowAvailability, c.tier, c.covered, ...(c.prereqs || []), ...(c.sowPrereqs || []), c.gain && c.gain.title, c.gain && c.gain.text, c.sowHow, c.sowGain, c.sowNote, ...(c.flows || []).map(f => f.what)]),
    p: CAT.products.map(q => [q.id, q.title, q.systems, q.rec]), l: Object.values(CAT.lines).map(l => [l.id, l.name, l.scope, l.ext, l.tier])}));
  const rows = [...JSON.parse(all).c, ...JSON.parse(all).p, ...JSON.parse(all).l], bad = rows.filter(r => r.slice(1).some(x => x && (trial(x) || aaFeed(x))));
  ok(rows.length > 290 && !bad.length, `none of the ${rows.length} cards, products and services on the canvas says a Brand Visibility trial or names Adobe Analytics as its feed`, bad.map(r => r[0] + ': ' + hit(r.slice(1).find(x => x && (trial(x) || aaFeed(x))))).slice(0, 3).join(' | '));
  await p.context().close();

  // 2. work saved on the step 57 build: the CJA play with Search data
  const cja = JSON.parse(fs.readFileSync(path.join(FIX, 'step57_cja_search.json'), 'utf8')), before = JSON.parse(cja['partner-sow-studio-v6']);
  ok(/trial workspaces cannot connect/.test(before.estimates.cja.C01.assumptions) && /The paid offer is assumed/.test(before.estimates.cja.L03.assumptions) && /not the free trial/.test(before.estimates.cja['CANVAS-BVCJ2'].assumptions) && /neither CJA nor Adobe Analytics/.test(before.estimates.cja['CANVAS-SD1'].scope),
    'the fixture holds the step 57 wording (C01, L03, the Brand Visibility + CJA service and the Search Console service)');
  p = await seeded(cja); await p.goto(BASE + 'sow/index.html#services'); await p.waitForTimeout(900);
  let got = await p.evaluate(() => { const e = state.estimates.cja, pick = id => ({on: e[id].on, hours: e[id].hours, scope: e[id].scope, assumptions: e[id].assumptions, changed: !!e[id].scopeChanged});
    return {play: state.play, C01: pick('C01'), L03: pick('L03'), BVCJ2: pick('CANVAS-BVCJ2'), SD1: pick('CANVAS-SD1'), c01Default: CATALOG.find(c => c.id === 'C01').assumptions, l03Default: CATALOG.find(c => c.id === 'L03').assumptions,
      hints: [...document.querySelectorAll('.review-hint')].filter(x => !x.hidden).length, flagged: Object.keys(e).filter(k => e[k].scopeChanged)}; });
  ok(got.play === 'cja' && got.C01.assumptions === got.c01Default && /the Client holds a Brand Visibility license, the CJA integration is enabled/.test(got.C01.assumptions) && !trial(got.C01.assumptions) && !aaFeed(got.C01.assumptions),
    'opened on this build, Connect Brand Visibility and CJA measurement reads "the Client holds a Brand Visibility license" and names no Adobe Analytics feed', hit(got.C01.assumptions) || got.C01.assumptions.slice(0, 200));
  ok(got.L03.assumptions === got.l03Default && !trial(got.L03.assumptions) && /inside them\. The Client confirms its licensed deployment allowance/.test(got.L03.assumptions), 'the deployment pilot no longer says "The paid offer is assumed"', hit(got.L03.assumptions));
  ok(/A Brand Visibility license \(CJA's page requires it for the source\)/.test(got.BVCJ2.assumptions) && !trial(got.BVCJ2.assumptions), 'the Brand Visibility + CJA research service takes "A Brand Visibility license"', hit(got.BVCJ2.assumptions));
  ok(/GA4 where the Client does not have CJA,/.test(got.SD1.scope) && /GA4 is included with the Brand Visibility license\./.test(got.SD1.assumptions) && /has a Brand Visibility license\./.test(got.SD1.assumptions) && !trial(got.SD1.scope + got.SD1.assumptions) && !/Adobe Analytics/.test(got.SD1.scope + got.SD1.assumptions),
    'the Search Console and GA4 service takes the new scope and assumptions', hit(got.SD1.scope + ' ' + got.SD1.assumptions) || got.SD1.assumptions.slice(0, 200));
  ok(!got.flagged.length && got.hints === 0, 'and none of it is shown as "Scope edited"', got.flagged.join(', '));
  ok(['C01', 'L03'].every(id => got[id].on === before.estimates.cja[id].on && got[id].hours === before.estimates.cja[id].hours) && got.BVCJ2.on === true && got.SD1.on === true && got.BVCJ2.hours === before.estimates.cja['CANVAS-BVCJ2'].hours,
    'the choices and hours are as saved');
  await p.click('[data-step="document"]'); await p.waitForTimeout(500);
  let doc = (await p.textContent('#sow-preview')).replace(/\s+/g, ' ');
  ok(doc.includes('holds a Brand Visibility license') && !trial(doc) && !aaFeed(doc) && !/nor Adobe Analytics/.test(doc), 'the statement of work for that engagement says a Brand Visibility license, with no trial wording and no Adobe Analytics feed', hit(doc));
  await p.context().close();

  // 3. work saved on the step 57 build: Create your own play with Brand Visibility and AEM Sites
  const own = JSON.parse(fs.readFileSync(path.join(FIX, 'step57_own_play_bv_aemsites.json'), 'utf8'));
  p = await seeded(own); await p.goto(BASE + 'sow/index.html#services'); await p.waitForTimeout(900);
  got = await p.evaluate(() => { const e = state.estimates.custom; return {play: state.play, a1: e['CANVAS-AXC01'].assumptions, a3: e['CANVAS-AXC03'].assumptions, flagged: Object.keys(e).filter(k => e[k].scopeChanged), on: e['CANVAS-AXC01'].on}; });
  ok(got.play === 'custom' && got.on && [got.a1, got.a3].every(a => /Availability: Not stated by Adobe\. The Client confirms its licensed deployment allowance and supported opportunity types before optimization begins\./.test(a) && /users need the Adobe LLM Optimizer Users product profile;/.test(a) && !trial(a)),
    'an own-play engagement with AEM Sites + Brand Visibility takes the new availability note and license line', hit(got.a1) || got.a1.slice(0, 220));
  ok(!got.flagged.length, 'and is not shown as "Scope edited"', got.flagged.join(', '));
  await p.click('[data-step="document"]'); await p.waitForTimeout(500);
  doc = (await p.textContent('#sow-preview')).replace(/\s+/g, ' ');
  ok(!trial(doc) && !aaFeed(doc), 'its statement of work carries no trial wording', hit(doc));
  await p.context().close();

  // 4. a line the partner edited keeps their words; only the old sentence inside it is replaced, and it stays marked as edited
  const edited = JSON.parse(JSON.stringify(before));
  edited.estimates.cja.C01.assumptions += ' Our own note for this client.'; edited.estimates.cja.C01.scopeChanged = true;
  p = await seeded({...cja, 'partner-sow-studio-v6': JSON.stringify(edited)}); await p.goto(BASE + 'sow/index.html#services'); await p.waitForTimeout(900);
  got = await p.evaluate(() => ({a: state.estimates.cja.C01.assumptions, def: CATALOG.find(c => c.id === 'C01').assumptions, changed: !!state.estimates.cja.C01.scopeChanged}));
  ok(got.a === got.def + ' Our own note for this client.' && got.changed && !trial(got.a) && !aaFeed(got.a), 'an edited line keeps the partner\'s own words, loses only the old sentences and stays marked as edited', hit(got.a) || got.a.slice(-160) + ' changed=' + got.changed);
  await p.context().close();

  ok(!errs.length, 'no page errors', errs.slice(0, 3).join(' | '));
  await b.close(); server.close();
  console.log(fails ? `\n${fails} of ${n} STEP 58 CHECKS FAILED` : `\nALL STEP 58 CHECKS PASSED (${n})`);
  process.exit(fails ? 1 : 0);
})();
