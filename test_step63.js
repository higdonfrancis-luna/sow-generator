// Step 63 (Nov 10 2026, Adam: "looks great" to sow/mockups/nov10_expansion/picker_*.png, then "we should yeah do these"):
// the Add product menu on Create your own play is grouped under the headings of Adobe's own product menu and has a Find a
// product box. It was one list of 21 products.
// Run from the repo root after python3 sow/canvas/build.py and python3 sow/build_site.py:
//   node sow/test_step63.js
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, 'site');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 500) + ']')); if (!c) fails++; };
const T = {'.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript'};
const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (u.endsWith('/')) u += 'index.html';
  const f = path.join(SITE, u);
  if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, {'Content-Type': T[path.extname(f)] || 'text/plain'}); fs.createReadStream(f).pipe(res);
});
const GROUPS = [['AI & agents', ['Brand Visibility', 'Brand Concierge', 'Coworker']], ['Content & workflows', 8], ['Data & analytics', 5], ['Campaign management', 5]];
(async () => {
  await new Promise(r => server.listen(0, r));
  const BASE = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch(), errs = [];
  const fresh = async (w = 1500, h = 1000) => { const ctx = await b.newContext({viewport: {width: w, height: h}}); const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto(BASE); await p.waitForTimeout(400); await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(400); return p; };
  const openMenu = async p => { if (await p.isHidden('#add-menu')) await p.click('#add-btn'); await p.waitForTimeout(200); };
  const groups = p => p.evaluate(() => [...document.querySelectorAll('#add-menu details.mgrp')].map(d => ({name: d.querySelector('summary span').textContent, cnt: d.querySelector('.cnt').textContent, open: d.open,
    items: [...d.querySelectorAll('[data-add] .nm')].map(x => x.textContent)})));
  const shown = p => p.evaluate(() => [...document.querySelectorAll('#add-menu [data-add]')].filter(e => e.checkVisibility({contentVisibilityAuto: true, visibilityProperty: true}) && e.getBoundingClientRect().height > 0).map(e => e.querySelector('.nm').textContent));
  const type = async (p, s) => { await p.fill('#add-find', s); await p.waitForTimeout(200); };

  // 1. an empty canvas: the four headings, in Adobe's order, the first one open
  let p = await fresh(); await openMenu(p);
  let g = await groups(p);
  ok(g.map(x => x.name).join('|') === GROUPS.map(x => x[0]).join('|'), 'the menu has the four headings in the order of Adobe\'s product menu', g.map(x => x.name).join('|'));
  ok(g.every((x, i) => x.items.length === (Array.isArray(GROUPS[i][1]) ? GROUPS[i][1].length : GROUPS[i][1])), 'the headings hold 3, 8, 5 and 5 products', g.map(x => x.items.length).join(','));
  ok(g.reduce((s, x) => s + x.items.length, 0) === 21 && new Set(g.flatMap(x => x.items)).size === 21, 'all 21 products are in the menu, each once');
  ok(g.every(x => x.cnt === x.items.length + ' product' + (x.items.length === 1 ? '' : 's')), 'each heading says how many products it holds', g.map(x => x.cnt).join('|'));
  ok(g[0].open && g.slice(1).every(x => !x.open), 'the first heading is open and the others are closed');
  ok(g[0].items.join('|') === GROUPS[0][1].join('|'), 'AI & agents starts with Brand Visibility', g[0].items.join('|'));
  ok(!(await p.$('#add-menu details.nocon')) && !/more do not connect/i.test(await p.innerText('#add-menu')), 'the old "more do not connect" fold is gone');
  ok(await p.isVisible('#add-find') && (await p.getAttribute('#add-find', 'placeholder')) === 'Find a product', 'the menu has a Find a product box');
  ok(/^Connects to \d+ products?$/.test(await p.innerText('#add-menu [data-add="bv"] .ctag')), 'each product still says how many of the others it connects to');

  // 2. headings open and close, and stay that way
  await p.click('#add-menu details[data-grp="Data & analytics"] summary'); await p.waitForTimeout(200);
  await p.click('#add-menu details[data-grp="AI & agents"] summary'); await p.waitForTimeout(200);
  g = await groups(p);
  ok(g[2].open && !g[0].open, 'a click opens a closed heading and closes an open one');
  ok((await shown(p)).join('|') === g[2].items.join('|'), 'only the open heading shows its products');
  await p.keyboard.press('Escape'); await p.waitForTimeout(200); await openMenu(p); g = await groups(p);
  ok(g[2].open && !g[0].open, 'the headings are as the partner left them when the menu opens again');

  // 3. Find a product
  await type(p, 'journey');
  let hits = await shown(p);
  ok(hits.join('|') === 'Customer Journey Analytics|Experimentation Accelerator|Journey Optimizer|Journey Optimizer B2B Edition', 'typing "journey" lists the four products with it in their name or full name, in A to Z order', hits.join('|'));
  ok((await p.innerText('#add-list .g')) .toLowerCase() === '4 matches' && !(await p.$('#add-list details')), 'the matches are one list with a count, no headings to open');
  ok((await p.innerText('#add-menu [data-add="cja"] .to')) === 'Data & analytics' && await p.isVisible('#add-menu [data-add="cja"] .to'), 'each match says which heading it sits under');
  ok(await p.evaluate(() => document.activeElement.id === 'add-find'), 'the box keeps the cursor as the list changes');
  await type(p, 'FORMS'); ok((await shown(p)).join('|') === 'AEM Forms' && /^1 match$/i.test(await p.innerText('#add-list .g')), 'the search ignores capitals, and one match says "1 match"');
  await type(p, 'mix modeler'); ok((await shown(p)).join('|') === 'Marketing Campaign Analytics', 'a former name finds the product (Mix Modeler)', (await shown(p)).join('|'));
  await type(p, 'cja'); ok((await shown(p)).join('|') === 'Customer Journey Analytics', 'a short name finds the product (CJA)', (await shown(p)).join('|'));
  await type(p, 'zzzz'); ok((await shown(p)).length === 0 && (await p.innerText('#add-list .nomatch')) === 'No product matches. Clear the box to see them all.', 'a word no product has says so');
  await type(p, ''); ok((await groups(p)).length === 4, 'clearing the box brings the headings back');
  await type(p, 'target'); await p.keyboard.press('Escape'); await p.waitForTimeout(200); await openMenu(p);
  ok((await p.inputValue('#add-find')) === '' && (await groups(p)).length === 4, 'the box is empty when the menu opens again');
  await type(p, 'visib'); await p.click('#add-menu [data-add="bv"]'); await p.waitForTimeout(400);
  ok(await p.isVisible('.node[data-p="bv"]'), 'a found product is added with a click');
  await openMenu(p); ok((await p.inputValue('#add-find')) === '', 'the box is empty after a product is added');

  // 4. products on the canvas: the ones that connect first, the rest under their headings, closed
  const lead = await p.evaluate(() => [...document.querySelectorAll('#add-list > [data-add]')].map(e => ({name: e.querySelector('.nm').innerText, tag: e.querySelector('.ctag').innerText, to: e.querySelector('.to').innerText})));
  ok(lead.length > 0 && lead.every(x => x.tag === 'Connects to 1 on your canvas' && x.to === 'Lines to Brand Visibility'), 'products that connect to the canvas come first, in one list, each saying what it lines to', JSON.stringify(lead.slice(0, 2)));
  const heads = await p.evaluate(() => [...document.querySelectorAll('#add-list > .g')].map(e => e.innerText.toLowerCase()));
  ok(heads.join('|') === 'connects to your canvas|not connected to your canvas yet', 'the two parts are named', heads.join('|'));
  g = await groups(p);
  ok(g.length > 0 && g.every(x => !x.open || x.name === 'Data & analytics') && lead.length + g.reduce((s, x) => s + x.items.length, 0) === 20, 'the rest wait under their headings, and the 20 products left are all there', lead.length + '+' + g.map(x => x.items.length).join(','));
  ok(!g.flatMap(x => x.items).some(nm => lead.some(x => x.name === nm)) && !(await p.$('#add-menu [data-add="bv"]')), 'no product is listed twice, and the one on the canvas is not offered');
  await type(p, 'analytics'); hits = await shown(p);
  ok(hits.includes('Customer Journey Analytics') && hits.includes('Content Analytics') && hits.includes('Marketing Campaign Analytics'), 'the box finds products that connect and products that do not', hits.join('|'));
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);

  // 5. the keyboard
  await openMenu(p); await p.focus('#add-menu details.mgrp summary'); const was = (await groups(p))[0].open; await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  ok((await groups(p))[0].open !== was, 'Enter on a heading opens or closes it');
  await p.keyboard.press('Escape'); await p.waitForTimeout(200); ok(await p.isHidden('#add-menu'), 'Escape closes the menu');
  await p.context().close();

  // 6. a phone
  p = await fresh(390, 844); await openMenu(p);
  const box = await p.evaluate(() => { const m = document.getElementById('add-menu').getBoundingClientRect(), f = document.getElementById('add-find').getBoundingClientRect(); return {l: m.left, r: m.right, fl: f.left, fr: f.right, w: innerWidth, sw: document.documentElement.scrollWidth}; });
  ok(box.l >= 0 && box.r <= box.w + 1 && box.fl >= box.l && box.fr <= box.r && box.sw <= box.w + 1, 'on a phone the menu and its box fit the screen', JSON.stringify(box));
  await type(p, 'coworker'); await p.click('#add-menu [data-add="cw"]'); await p.waitForTimeout(400);
  ok(await p.isVisible('.node[data-p="cw"]'), 'on a phone a found product is added');
  await p.context().close();

  // 7. the six plays do not have the menu
  p = await fresh(); await p.goto(BASE); await p.waitForTimeout(400);
  const plays = await p.$$eval('#picker [data-play]', a => a.map(x => x.dataset.play));
  ok(plays.length === 7 && plays.includes('custom'), 'the front page still offers the six plays and Create your own play', plays.join(','));
  await p.context().close();

  ok(!errs.length, 'no page errors', errs.join(' | '));
  console.log(fails ? `\n${fails} OF ${n} STEP 63 CHECKS FAILED` : `\nALL STEP 63 CHECKS PASSED (${n})`);
  await b.close(); server.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
