// Step 95 (Nov 14 2026, Adam: "kill everything in image 1", Continue "at the top right hand side of canvas", the ring below "reflects
// the play you have built above", "a reset tab and when you press it goes back to match the products above", then "yes" to
// sow/mockups/nov14_play_ring/). Run from the repo root after python3 sow/build_site.py:
//   node sow/test_step95.js
const path = require('path');
const {chromium} = require('playwright');
const PAGE = 'file://' + path.join(__dirname, 'site', 'index.html');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 500) + ']')); if (!c) fails++; };
(async () => {
  const b = await chromium.launch(), errs = [];
  const fresh = async (w = 1600, h = 950) => { const ctx = await b.newContext({viewport: {width: w, height: h}}), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto(PAGE); return p; };
  const choose = async (p, label) => { const id = await p.$$eval('#picker [data-play]', (bs, l) => bs.find(x => x.textContent.includes(l)).dataset.play, label);
    await p.click(`#picker [data-play="${id}"]`); await p.waitForTimeout(500); };
  // what the ring shows: red boxes, red lines (as pairs of product ids) and the panel beside it
  const ring = p => p.evaluate(() => {
    const at = {}; document.querySelectorAll('.wke-node').forEach(n => { at[n.getAttribute('transform')] = n.dataset.id; });
    const key = l => { const a = Object.keys(at).find(k => k === `translate(${l.getAttribute('x1')},${l.getAttribute('y1')})`), c = Object.keys(at).find(k => k === `translate(${l.getAttribute('x2')},${l.getAttribute('y2')})`); return [at[a], at[c]].sort().join('+'); };
    return {red: [...document.querySelectorAll('.wke-node-focus')].map(n => n.dataset.id).sort(), near: [...document.querySelectorAll('.wke-node-near')].map(n => n.dataset.id).sort(),
      pressed: [...document.querySelectorAll('.wke-node[aria-pressed="true"]')].map(n => n.dataset.id),
      lines: [...document.querySelectorAll('.wke-edge-active')].map(key).sort(), all: document.querySelectorAll('.wke-edge').length, nodes: document.querySelectorAll('.wke-node').length,
      panel: document.querySelector('.wke-inspector').innerText.replace(/\n+/g, '\n'), away: document.querySelector('.wke-reset').classList.contains('wke-reset-away')};
  });
  const between = (p, ids) => p.evaluate(ids => CAT.connections.filter(c => ids.includes(c.a) && ids.includes(c.b)).map(c => [c.a, c.b].sort().join('+')).sort(), ids);

  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const canvasState = p => p.evaluate(() => JSON.stringify({
    saved: st, products: prods().map(p => p.id), connections: conns().map(c => c.id), totals: totals(),
    focus: fsel, allEdges: showAllEdges, card, pinned, cardHidden: document.getElementById('card').hidden
  }));

  // 1. what image 1 held is gone; the canvas, then the ring and the stats
  const p = await fresh(); await choose(p, 'Sites Optimizer'); await p.fill('#rate', '150'); await p.waitForTimeout(300);
  const sec = await p.evaluate(() => { const s = document.getElementById('knowledge-model-section'); return {shown: !s.hidden, text: s.innerText, summary: !!s.querySelector('summary,details.knowledge-model-disclosure'),
    controls: s.querySelectorAll('.wke-heading,.wke-controls,.wke-modes,.wke-summary,[data-control="product"],[data-action="mode"],[data-action="connections"]').length, stats: !!s.querySelector('.km-stats'), first: s.firstElementChild.id}; });
  ok(sec.shown && !sec.summary && !sec.controls && !/Explore product connections|The knowledge model|A connected catalog|My solution|Explore the catalog|Explore a product or system|Focus on selected product|Browsing does not change your canvas/.test(sec.text) && sec.stats && sec.first === 'knowledge-model-root',
    'the section under the canvas opens straight on the ring: no title, heading, paragraph, switch, dropdown, focus button or count line', JSON.stringify(sec).slice(0, 400));
  const cont = await p.evaluate(() => { const s = document.getElementById('save').getBoundingClientRect(), c = document.getElementById('canvas').getBoundingClientRect(); return {top: Math.round(s.top - c.top), right: Math.round(c.right - s.right)}; });
  ok(!(await p.$('#hint')) && cont.top === 18 && cont.right === 30 && (await p.textContent('#save')).trim() === 'Continue →', 'Continue sits at the top right of the canvas, and the lightning bolt line is gone', JSON.stringify(cont));

  // 2. the play view: the play's products and systems in red, the catalog's lines between them in red, the panel names the play
  const mine = await p.evaluate(() => prods().map(x => x.id).sort()), names = await p.evaluate(() => prods().map(x => x.name)), label = await p.evaluate(() => play().label);
  let r = await ring(p);
  ok(JSON.stringify(r.red) === JSON.stringify(mine) && !r.near.length && r.nodes === await p.evaluate(() => CAT.products.length) && r.all === await p.evaluate(() => CAT.connections.length),
    `the whole catalog is drawn (${r.nodes} products and systems, ${r.all} relationships), with the play's ${mine.length} in red`, JSON.stringify(r.red) + ' vs ' + JSON.stringify(mine));
  const want = await between(p, mine);
  ok(JSON.stringify(r.lines) === JSON.stringify(want) && want.length > 0, `the ${want.length} catalog relationships between them are the red lines`, JSON.stringify(r.lines) + ' vs ' + JSON.stringify(want));
  ok(r.panel.startsWith('YOUR PLAY\n' + label) && names.every(x => r.panel.includes(x)) && r.panel.includes(want.length + ' connection' + (want.length === 1 ? '' : 's') + ' between them in the catalog.'),
    'the panel beside the ring names the play, lists its products and counts the connections between them', r.panel);
  ok(!r.away && await p.isVisible('.wke-reset') && (await p.textContent('.wke-reset')).trim() === 'Reset to my play', 'Reset to my play sits on the ring\'s left, outlined while the ring shows the play');

  // 3. a click on another product shows what it connects with; Reset goes back to the play
  await p.click('.wke-node[data-id="target"]'); await p.waitForTimeout(200); r = await ring(p);
  const tg = await p.evaluate(() => CAT.connections.filter(c => c.a === 'target' || c.b === 'target').map(c => [c.a, c.b].sort().join('+')).sort());
  ok(JSON.stringify(r.red) === '["target"]' && JSON.stringify(r.lines) === JSON.stringify(tg) && r.near.length === tg.length && /^ADOBE PRODUCT\nTarget\nNot on my canvas/.test(r.panel) && r.away,
    `a click on Target shows its ${tg.length} relationships and its card, and Reset turns solid red`, JSON.stringify(r).slice(0, 400));
  await p.click('.wke-reset'); await p.waitForTimeout(200); r = await ring(p);
  ok(JSON.stringify(r.red) === JSON.stringify(mine) && JSON.stringify(r.lines) === JSON.stringify(want) && r.panel.startsWith('YOUR PLAY') && !r.away, 'Reset to my play goes back to the play');
  await p.click('.wke-node[data-id="bv"]'); await p.waitForTimeout(200); r = await ring(p);
  ok(same(r.red, mine) && same(r.lines, want) && same(r.pressed, ['bv']) && /^ADOBE PRODUCT\nBrand Visibility\nOn my canvas/.test(r.panel),
    'inspecting Brand Visibility opens its card while the built play and its connections stay highlighted');
  await p.click('.wke-reset'); await p.waitForTimeout(200);

  // Browsing is read-only, including products and connected outside systems that the canvas can add.
  { await p.click('.wke-node[data-id="aemassets"]'); await p.waitForTimeout(200); const assets = !!(await p.$('.wke-add'));
    await p.click('.wke-node[data-id="search"]'); await p.waitForTimeout(200); const search = !!(await p.$('.wke-add'));
    await p.click('.wke-node[data-id="cja"]'); await p.waitForTimeout(200); const cja = !!(await p.$('.wke-add'));
    ok(!assets && !cja && !search, 'neither an Adobe product nor an eligible outside system offers a canvas write from the ring', JSON.stringify({assets, search, cja}));
    await p.click('.wke-reset'); await p.waitForTimeout(200); }

  // 4. the keyboard reaches the same things
  await p.focus('.wke-node[data-id="cja"]'); await p.keyboard.press('Enter'); await p.waitForTimeout(200); r = await ring(p);
  ok(JSON.stringify(r.red) === '["cja"]' && await p.evaluate(() => document.activeElement.dataset.id === 'cja'), 'Enter on a product selects it and keeps the focus there');
  await p.focus('.wke-reset'); await p.keyboard.press('Enter'); await p.waitForTimeout(200); r = await ring(p);
  ok(r.panel.startsWith('YOUR PLAY') && await p.evaluate(() => document.activeElement.classList.contains('wke-reset')), 'Enter on Reset goes back to the play and keeps the focus on Reset');
  await p.context().close();

  // 5. the ring follows the canvas: Create your own play, products added and removed above, a clicked product kept
  const q = await fresh(); await choose(q, 'Create your own'); await q.waitForTimeout(300);
  r = await ring(q);
  ok(!r.red.length && /Nothing is on your canvas yet/.test(r.panel) && r.panel.startsWith('YOUR PLAY\nYour own play\n'), 'an empty Create your own play: nothing in red, the panel names it as the canvas does ("Your own play") and says to add products above', r.panel);
  await q.evaluate(() => addProduct('cja')); await q.keyboard.press('Escape'); await q.waitForTimeout(300); r = await ring(q);
  ok(/The 1 product on your canvas/.test(r.panel) && !/between them/.test(r.panel), 'with one product the panel counts no connections "between them"', r.panel);
  await q.evaluate(() => addProduct('rtcdp')); await q.keyboard.press('Escape'); await q.waitForTimeout(300); r = await ring(q);
  ok(JSON.stringify(r.red) === '["cja","rtcdp"]' && JSON.stringify(r.lines) === JSON.stringify(await between(q, ['cja', 'rtcdp'])) && /The 2 products on your canvas/.test(r.panel), 'products added on the canvas turn red in the ring at once', JSON.stringify(r).slice(0, 300));
  const example = ['rtcdp', 'ajo', 'target', 'cja', 'bv', 'marketo', 'cdn', 'crm'].sort();
  await q.evaluate(() => {
    for (const id of ['ajo', 'target', 'bv', 'marketo']) addProduct(id);
    addOutside('cdn'); addOutside('crm');
  });
  await q.fill('#rate', '150');
  await q.click('.node[data-p="bv"]');
  await q.click('#fb-svc');
  const beforeBrowse = await canvasState(q);
  const playLines = await between(q, example);
  r = await ring(q);
  ok(same(r.red, example) && same(r.lines, playLines) && playLines.length === 15 && !r.pressed.length && await q.isVisible('#card'),
    'the eight-product play has 15 highlighted links, with an upper canvas product card open');
  await q.click('.wke-node[data-id="cja"]');
  r = await ring(q);
  ok(same(r.red, example) && same(r.lines, playLines) && !r.near.length && same(r.pressed, ['cja']) && r.panel.startsWith('ADOBE PRODUCT\nCustomer Journey Analytics\nOn my canvas'),
    'clicking CJA preserves every red product and link and selects only CJA for inspection');
  const catalog = await q.evaluate(() => ({
    links: CAT.connections.filter(c => c.a === 'cja' || c.b === 'cja').map(c => c.id).sort(),
    services: [...new Set([...P.cja.lines, ...P.cja.more])]
  }));
  const displayed = await q.evaluate(() => ({
    links: [...document.querySelectorAll('.wke-connections details')].map(d => d.dataset.relationship).sort(),
    services: [...document.querySelector('.wke-services select').options].map(o => o.value)
  }));
  ok(catalog.links.length === 17 && catalog.services.length === 7 && same(displayed, catalog),
    'the CJA inspector offers all 17 catalog relationships and seven product services');
  const relationship = q.locator('.wke-connections details').first();
  await relationship.locator('summary').click();
  await q.selectOption('.wke-services select', catalog.services[1]);
  r = await ring(q);
  ok(await relationship.getAttribute('open') !== null && await q.isVisible('.wke-connections details[open] .wke-relationship') &&
    (await q.textContent('.wke-service-id')).trim() === catalog.services[1] && same(r.red, example) && same(r.lines, playLines) && same(r.pressed, ['cja']),
    'reading a relationship and switching services keeps the same play and CJA inspector');

  await q.focus('.wke-node[data-id="aemassets"]');
  await q.keyboard.press('Space');
  r = await ring(q);
  const assetsLinks = await q.evaluate(() => CAT.connections.filter(c => c.a === 'aemassets' || c.b === 'aemassets').map(c => [c.a, c.b].sort().join('+')).sort());
  ok(same(r.red, ['aemassets']) && same(r.pressed, ['aemassets']) && same(r.lines, assetsLinks) && r.away &&
    /Not on my canvas/.test(r.panel) && !await q.locator('[data-action="add"]').count(),
    'Space on an eligible out-of-play product explores only its connections without offering to add it');
  await q.focus('.wke-node[data-id="crm"]');
  await q.keyboard.press('Enter');
  r = await ring(q);
  ok(same(r.red, example) && same(r.lines, playLines) && same(r.pressed, ['crm']) && /On my canvas/.test(r.panel),
    'Enter on an in-play outside system returns to the play graph and opens its details');
  await q.keyboard.press('Escape');
  await q.click('.wke-reset');
  r = await ring(q);
  ok(same(r.red, example) && same(r.lines, playLines) && !r.pressed.length && r.panel.startsWith('YOUR PLAY') && await canvasState(q) === beforeBrowse,
    'inspecting products, relationships and services and resetting leave the upper canvas choices, prices, focus and open card intact');

  await q.click('.wke-node[data-id="cja"]');
  await q.evaluate(() => addProduct('aemassets'));
  const extended = [...example, 'aemassets'].sort();
  r = await ring(q);
  ok(same(r.red, extended) && same(r.lines, await between(q, extended)) && same(r.pressed, ['cja']),
    'adding a canvas product updates the ring immediately and preserves an inspector that is still in the play');
  await q.click('.wke-node[data-id="aemforms"]');
  await q.evaluate(() => removeProduct('aemassets'));
  r = await ring(q);
  ok(same(r.red, example) && same(r.lines, playLines) && !r.pressed.length && r.panel.startsWith('YOUR PLAY'),
    'a canvas membership change while browsing outside returns to the updated play');
  await q.click('.wke-node[data-id="cja"]');
  await q.evaluate(() => removeProduct('cja'));
  const remaining = await q.evaluate(() => prods().map(p => p.id).sort());
  r = await ring(q);
  ok(same(r.red, remaining) && same(r.lines, await between(q, remaining)) && !r.pressed.length && r.panel.startsWith('YOUR PLAY'),
    'removing the inspected member on the upper canvas closes its inspector and shows the remaining play');
  await q.click('.wke-node[data-id="cja"]');
  await q.click('.wke-reset');
  r = await ring(q);
  ok(same(r.red, remaining) && !r.red.includes('cja') && same(r.lines, await between(q, remaining)) && !r.pressed.length,
    'Reset from the removed product restores the latest canvas membership and links');
  await q.click('.wke-node[data-id="cja"]');
  await q.evaluate(() => addProduct('cja'));
  r = await ring(q);
  ok(same(r.red, example) && same(r.lines, playLines) && same(r.pressed, ['cja']) && /On my canvas/.test(r.panel),
    'adding the product being explored to the upper canvas keeps its details and restores the full play graph');
  await q.context().close();

  // 5b. review fix: a new play opens the ring on that play, not on the product clicked under the last one (Change play and Start over)
  { const c = await fresh(); await choose(c, 'Customer Journey Analytics'); await c.click('.wke-node[data-id="target"]'); await c.waitForTimeout(200);
    await c.click('#change-play'); await c.waitForTimeout(200); if (await c.isVisible('#confirm-yes')) await c.click('#confirm-yes'); await c.waitForTimeout(300);
    await choose(c, 'Adobe Commerce'); r = await ring(c);
    const label = await c.evaluate(() => play().title || play().label), mine = await c.evaluate(() => prods().map(x => x.id).sort());
    ok(r.panel.startsWith('YOUR PLAY\n' + label) && JSON.stringify(r.red) === JSON.stringify(mine) && !r.away, 'Change play: the ring shows the new play, with Reset outlined', r.panel.slice(0, 120));
    await c.click('.wke-node[data-id="target"]'); await c.waitForTimeout(200);
    await c.click('#start-over'); await c.waitForTimeout(200); if (await c.isVisible('#confirm-yes')) await c.click('#confirm-yes'); await c.waitForTimeout(300);
    await choose(c, 'Create your own'); r = await ring(c);
    ok(/Nothing is on your canvas yet/.test(r.panel) && !r.red.length && !r.away, 'Start over: the next play opens on its own empty view', r.panel.slice(0, 120));
    await c.context().close(); }

  // 5c. review fix: phones and tablets keep Continue at the canvas's bottom right, inside the canvas even in a busy focus view
  for (const [w, h] of [[360, 640], [375, 667], [820, 600]]) {
    const m = await fresh(w, h); await choose(m, 'Create your own');
    await m.evaluate(() => { for (const i of ['rtcdp', 'cja', 'ajo', 'aemsites', 'target', 'marketo']) addProduct(i); }); await m.keyboard.press('Escape'); await m.waitForTimeout(400);
    const g = await m.evaluate(() => { const s = document.getElementById('save').getBoundingClientRect(), c = document.getElementById('canvas').getBoundingClientRect();
      return {focus: !document.getElementById('fbar').hidden, gapBottom: Math.round(c.bottom - s.bottom), inside: s.top >= c.top && s.bottom <= c.bottom}; });
    ok(g.focus && g.inside && g.gapBottom === 18, `at ${w}x${h} a busy canvas keeps Continue at its bottom right, whole`, JSON.stringify(g));
    await m.context().close();
  }

  // 6. readable everywhere: no faded text, no dashes; a tablet and a phone keep the page from scrolling sideways
  const f = await fresh(); await choose(f, 'Sites Optimizer');
  const faded = await f.evaluate(() => [...document.querySelectorAll('#knowledge-model-section *')].filter(e => parseFloat(getComputedStyle(e).opacity) < 1).length);
  ok(faded === 0 && !/[–—]/.test(await f.textContent('#knowledge-model-section')), 'no faded text and no dashes in the ring\'s section');
  await f.context().close();
  for (const [w, h] of [[768, 1024], [390, 844]]) {
    const m = await fresh(w, h); await choose(m, 'Sites Optimizer');
    const s = await m.evaluate(() => ({wide: document.documentElement.scrollWidth, reset: document.querySelector('.wke-reset').getBoundingClientRect().width > 0}));
    ok(s.wide <= w && s.reset, `at ${w} pixels the page does not scroll sideways and Reset to my play shows`, JSON.stringify(s));
    await m.context().close();
  }
  ok(!errs.length, 'no page errors', errs.join(' | '));
  console.log(fails ? `\n${fails} OF ${n} STEP 95 CHECKS FAILED` : `\nALL STEP 95 CHECKS PASSED (${n})`);
  await b.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
