// Click test for Start from your client's problem (step 40) on the Build canvas. Run from the repo root:
//   node sow/canvas/test_problems.js
// Every problem chip and every refine chip is clicked like a partner would, and Build this must put exactly the products
// the answer named on the canvas, with the same total the answer quoted. Typed questions, no match, no rate and a phone too.
const {chromium} = require('playwright');
const path = require('path'), fs = require('fs');
const HERE = __dirname;
const CANVAS = 'file://' + path.join(HERE, 'index.html');
const CAT = JSON.parse(fs.readFileSync(path.join(HERE, 'catalog.json'), 'utf8'));
const PROBS = JSON.parse(fs.readFileSync(path.join(HERE, 'problems.json'), 'utf8')).problems;
const P = Object.fromEntries(CAT.products.map(p => [p.id, p])), PL = Object.fromEntries(CAT.plays.map(p => [p.id, p]));
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + d + ']')); if (!c) fails++; };
const same = (a, b) => [...a].sort().join() === [...b].sort().join();

async function answer(page) { await page.waitForSelector('#bp-body .bp-ans', {timeout: 5000}); await page.waitForTimeout(950); }
async function read(page) {
  return page.evaluate(() => ({rec: document.querySelector('.bp-ans .bp-lbl').textContent,
    boxes: [...document.querySelectorAll('.bp-ans .bp-p')].map(e => e.textContent.replace(' (outside system)', '')),
    total: (document.querySelector('.bp-del b') || {}).textContent || '', del: document.querySelector('.bp-del').textContent,
    heard: document.querySelector('.bp-heard').textContent,
    refine: [...document.querySelectorAll('[data-bpr]')].map(b => b.textContent)}));
}
async function build(page) {
  await page.click('[data-bpa="build"]'); await page.waitForTimeout(250);
  const r = await page.evaluate(() => ({picker: document.getElementById('picker').hidden, total: document.getElementById('t-big').textContent,
    nodes: [...document.querySelectorAll('#stage .node')].map(n => n.dataset.p), play: JSON.parse(localStorage.getItem('abv-sow-build-v1')).play}));
  await page.click('#change-play'); await page.click('#confirm-yes'); await page.waitForTimeout(150);
  return r;
}
const names = ids => ids.map(id => P[id].name);

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({viewport: {width: 1440, height: 1000}});
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(CANVAS); await page.waitForTimeout(300);

  // the box, in the partner's voice, above the play cards
  const top = await page.evaluate(() => ({t: document.querySelector('#bp .bp-t').textContent, ph: document.getElementById('bp-q').placeholder,
    above: !!(document.getElementById('bp').compareDocumentPosition(document.querySelector('#picker-list')) & Node.DOCUMENT_POSITION_FOLLOWING),
    chips: [...document.querySelectorAll('[data-bpp]')].map(b => b.textContent), all: !!document.querySelector('[data-bpa="all"]')}));
  ok(top.t === "Not sure which play? Start from your client's problem", 'the box asks about your client\'s problem', top.t);
  ok(top.ph === "e.g. My client doesn't show up when people ask ChatGPT about their category", 'the example is in the partner\'s voice', top.ph);
  ok(top.above, 'the box sits above the play cards');
  ok(top.chips.length === 6 && top.all, 'six suggested problems and See all problems', top.chips.join(' | '));
  await page.click('[data-bpa="all"]');
  ok(await page.locator('[data-bpp]').count() === 19, 'See all problems shows all 19');
  await page.click('[data-bpa="fewer"]');
  ok(await page.locator('[data-bpp]').count() === 6, 'Show fewer problems goes back to six');
  ok(PROBS.every(p => /\bmy client/i.test(p.problem) && /\bmy client/i.test(p.chip) && !/\b(we|our|us)\b/i.test(p.problem + ' ' + p.chip)), 'every problem and chip speaks as the partner, about my client');
  ok(PROBS.every(p => p.refine.every(r => /\bmy client/i.test(r.chip))), 'every refine chip speaks about my client');

  // a partner who entered $150 an hour before (the rate sits on the canvas toolbar, hidden while picking)
  await page.evaluate(() => localStorage.setItem('abv-sow-build-v1', JSON.stringify({v: 2, rate: 150}))); await page.reload(); await page.waitForTimeout(300);

  // every problem: the answer's play and products, then Build this gives the same products and total
  for (let i = 0; i < PROBS.length; i++) {
    const p = PROBS[i];
    await page.click('[data-bpa="all"]'); await page.click(`[data-bpp="${i}"]`);
    ok(await page.locator('.bp-work').count() === 1, `#${i + 1} shows a short working moment first`);
    await answer(page); const a = await read(page);
    const pl = PL[p.play], want = names(pl.custom ? p.products : p.products);
    ok(a.rec.includes(pl.label), `#${i + 1} recommends ${pl.label}`, a.rec);
    ok(same(a.boxes, want), `#${i + 1} names its products`, a.boxes.join(', '));
    ok(a.heard.startsWith('Heard: your client') || a.heard.startsWith('Heard: visitors'), `#${i + 1} says what it heard, about your client`, a.heard);
    const r = await build(page);
    ok(r.picker && r.play === p.play && same(r.nodes, p.products), `#${i + 1} Build this puts the same play and products on the canvas`, r.play + ' ' + r.nodes.join(','));
    ok(a.total && a.total === r.total, `#${i + 1} the answer's total matches the canvas (${r.total})`, a.total + ' vs ' + r.total);

    // each refine chip offered on the first answer, one at a time
    for (let k = 0; k < p.refine.length; k++) {
      await page.click('[data-bpa="all"]'); await page.click(`[data-bpp="${i}"]`); await answer(page);
      const btn = page.locator(`[data-bpr="${k}"]`);
      if (!(await btn.count())) { console.log(`   (#${i + 1} "${p.refine[k].chip}" is not offered on this setup)`); continue; }
      await btn.click(); await answer(page); const a2 = await read(page);
      ok(a2.heard.startsWith('Updated: '), `#${i + 1} refine "${p.refine[k].chip}" updates the answer`, a2.heard);
      ok(!a2.refine.includes(p.refine[k].chip), `#${i + 1} refine "${p.refine[k].chip}" is not offered twice`);
      const r2 = await build(page);
      ok(same(names(r2.nodes), a2.boxes) && a2.total === r2.total, `#${i + 1} refine "${p.refine[k].chip}" builds what it shows (${r2.total})`, a2.boxes.join(',') + ' vs ' + names(r2.nodes).join(',') + ' / ' + a2.total + ' vs ' + r2.total);
    }
  }

  // refine chips chain, and a chip that would drop a product the partner added is not offered
  await page.click('[data-bpa="all"]'); await page.click('[data-bpp="0"]'); await answer(page);
  await page.click('[data-bpr="0"]'); await answer(page);   // owns CJA: the CJA play
  let c = await read(page);
  ok(c.rec.includes(PL.cja.label) && !c.refine.some(t => /Commerce|financial/.test(t)), 'after CJA, chips that would drop CJA are not offered', c.refine.join(' | '));
  const bubbles = await page.locator('.bp-ask').count();
  ok(bubbles === 2, 'the question and the refine chip show as the partner\'s messages', String(bubbles));
  await page.click('[data-bpa="again"]');
  ok(await page.locator('#bp-form').isVisible() && await page.locator('[data-bpp]').count() === 6, 'Ask about another problem goes back to the question box');

  // a switch to Create your own play says the CDN box leaves
  await page.click('[data-bpp="1"]'); await answer(page);
  await page.click('[data-bpr="3"]'); await answer(page); c = await read(page);
  ok(/Create your own play/.test(c.heard) && /CDN box leaves the setup/.test(c.heard) && !c.boxes.includes('CDN'), 'readouts move the setup to Create your own play and say the CDN box leaves', c.heard);
  await page.click('[data-bpa="again"]');

  // typed questions, as partners would ask them
  const typed = [
    ["My client isn't showing up in ChatGPT", 'ai-answers-missing'],
    ["My customer's website is slow and hard to update", 'slow-website'],
    ['our client wants their website personalized, it shows every visitor the same thing', 'same-site-for-everyone'],
    ["My client's B2B leads go cold", 'b2b-leads-go-cold'],
    ['Shoppers abandon carts at my client and nobody follows up', 'abandoned-carts'],
  ];
  for (const [q, id] of typed) {
    await page.fill('#bp-q', q); await page.press('#bp-q', 'Enter'); await answer(page); c = await read(page);
    const want = PROBS.find(p => p.id === id);
    ok(c.rec.includes(PL[want.play].label) && same(c.boxes, names(want.products)), `typed "${q}" finds ${id}`, c.rec + ' / ' + c.boxes.join(','));
    await page.click('[data-bpa="again"]');
  }
  await page.fill('#bp-q', "My client doesn't show up when people ask ChatGPT about their category, and they can't tell if AI traffic turns into sales.");
  await page.click('.bp-go'); await answer(page); c = await read(page);
  ok(c.heard.startsWith('Two problems here:') && c.rec.includes(PL.cja.label), 'the mockup\'s question hears two problems and recommends the CJA play', c.heard + ' / ' + c.rec);
  ok(await page.locator('[data-bpa="another"]').count() === 1, 'Show another setup is offered when two problems match');
  await page.click('[data-bpa="another"]'); await answer(page); c = await read(page);
  ok(c.rec.includes(PL.abv.label), 'Show another setup shows the other match', c.rec);
  await page.click('[data-bpa="again"]');
  await page.fill('#bp-q', 'zebra quantum potato'); await page.press('#bp-q', 'Enter'); await page.waitForTimeout(100);
  const nm = await page.evaluate(() => ({t: document.getElementById('bp-body').textContent, chips: document.querySelectorAll('[data-bpp]').length, form: !document.getElementById('bp-form').hidden}));
  ok(/No match yet/.test(nm.t) && nm.chips >= 1 && nm.form, 'no match says so plainly and offers the closest problems', nm.t.slice(0, 90));
  await page.fill('#bp-q', ''); await page.press('#bp-q', 'Enter');
  ok(await page.locator('.bp-work, .bp-ans').count() === 0, 'an empty question does nothing');

  // no rate yet: the range at $100 to $300 an hour
  await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(300);
  await page.click('[data-bpp="0"]'); await answer(page); c = await read(page);
  ok(/ to \$.* at \$100 to \$300 an hour/.test(c.del) && /enter your rate/.test(c.del), 'with no rate, the answer gives the $100 to $300 range', c.del);
  const before = await page.evaluate(() => localStorage.getItem('abv-sow-build-v1'));
  await page.click('[data-bpa="again"]');
  ok(before === await page.evaluate(() => localStorage.getItem('abv-sow-build-v1')), 'asking changes nothing saved until Build this');
  ok(!errs.length, 'no page errors', errs.join(' | '));

  // a phone: no sideways scroll, on the question and on an answer
  const ph = await (await b.newContext({viewport: {width: 375, height: 800}, isMobile: true, hasTouch: true})).newPage();
  await ph.goto(CANVAS); await ph.waitForTimeout(300);
  const w1 = await ph.evaluate(() => document.getElementById('picker').scrollWidth <= document.getElementById('picker').clientWidth);
  await ph.tap('[data-bpp="3"]'); await answer(ph);
  const w2 = await ph.evaluate(() => document.getElementById('picker').scrollWidth <= document.getElementById('picker').clientWidth);
  ok(w1 && w2, 'on a phone the box and the answer fit with no sideways scroll');

  await b.close();
  console.log(fails ? `${fails} CHECK(S) FAILED` : 'ALL PROBLEM CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})();
