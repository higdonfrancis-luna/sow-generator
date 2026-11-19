// The product map (the knowledge explorer) also open at the bottom of the first page, under the five play rows and the One play per statement of work
// note (Adam's decision of Nov 19 2026). The first page has no canvas, so nothing is marked as on it; once a play is picked the map goes back under the
// canvas and shows that play as before.
// Run from the repo root after python3 canvas/build.py and python3 build_site.py:
//   node test_map_first_page.js
const path = require('path'), fs = require('fs');
const {chromium} = require('playwright');
const ROOT = __dirname, ORIGIN = 'https://map-first-page.test/';
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 700) + ']')); if (!c) fails++; };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const CAT = JSON.parse(fs.readFileSync(path.join(ROOT, 'canvas/catalog.json'), 'utf8')), P = Object.fromEntries(CAT.products.map(p => [p.id, p]));
const PROMPT = 'Click any product or outside system to see what it connects to and the services it has.';

(async () => {
  const b = await chromium.launch(), errs = [];
  const page = async (w = 1440, h = 900, o = {}) => { const ctx = await b.newContext({viewport: {width: w, height: h}, ...o});
    await ctx.route(ORIGIN + '**', async r => { let u = decodeURIComponent(new URL(r.request().url()).pathname); if (u.endsWith('/')) u += 'index.html';
      const f = path.join(ROOT, 'site', u); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return r.fulfill({status: 404, body: ''}); await r.fulfill({path: f}); });
    await ctx.route('https://abvfirefly.netlify.app/**', r => r.fulfill({status: 404, body: ''}));
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); });
    await p.goto(ORIGIN + 'index.html'); await p.waitForFunction('window.READY===true'); return p; };
  // what the map shows: red products, blue dots, lit lines, the Reset tab, the legend and the side panel
  const map = p => p.evaluate(() => { const s = document.getElementById('knowledge-model-section'), key = l => [l.x1.baseVal.value, l.y1.baseVal.value, l.x2.baseVal.value, l.y2.baseVal.value].join();
    const at = {}; s.querySelectorAll('.wke-node').forEach(g => { const m = /translate\(([^,]+),([^)]+)\)/.exec(g.getAttribute('transform')); at[g.dataset.id] = [+m[1], +m[2]]; });
    return {shown: !s.hidden && s.getBoundingClientRect().height > 0, inPicker: s.parentElement.id === 'picker-map', afterScreen: s.previousElementSibling?.classList.contains('sow-canvas-screen') || false,
      label: s.getAttribute('aria-label'), red: [...s.querySelectorAll('.wke-node-focus')].map(g => g.dataset.id).sort(), dots: s.querySelectorAll('.wke-on-canvas').length,
      lit: s.querySelectorAll('.wke-edge-active').length, reset: !!s.querySelector('.wke-reset'), legend: s.querySelector('.wke-legend').innerText, membership: !!s.querySelector('.wke-membership'),
      panel: s.querySelector('.wke-inspector').innerText.replace(/\n+/g, '\n').trim(), text: s.innerText,
      links: [...s.querySelectorAll('.wke-connections details')].map(d => d.dataset.relationship).sort(), at}; });

  // ============ 1. the first page: the map, open, under the rows and the note ============
  for (const [w, h, o, where] of [[1440, 900, {}, 'on a computer'], [390, 844, {isMobile: true, hasTouch: true}, 'on a phone']]) {
    const p = await page(w, h, o), m = await map(p);
    const order = await p.evaluate(() => { const one = document.querySelector('#picker .one'), slot = document.getElementById('picker-map'), rows = document.getElementById('picker-list');
      return {afterNote: one.nextElementSibling === slot, belowRows: slot.getBoundingClientRect().top >= rows.getBoundingClientRect().bottom && slot.getBoundingClientRect().top >= one.getBoundingClientRect().bottom,
        last: slot === slot.parentElement.lastElementChild, head: slot.querySelector('h2').textContent, line: slot.querySelector('.picker-map-s').textContent,
        headStyle: [getComputedStyle(slot.querySelector('h2')).textTransform, getComputedStyle(document.querySelector('#picker-list .sh')).textTransform], wide: document.documentElement.scrollWidth}; });
    ok(m.shown && m.inPicker && order.afterNote && order.belowRows && order.last && !order.headStyle[0].localeCompare(order.headStyle[1]),
      `1. ${where}: the map is open at the very bottom of the first page, after the five play rows and the One play per statement of work note, with a heading in the rows' style`, JSON.stringify({m: [m.shown, m.inPicker], order}));
    ok(order.head === 'See how every product connects' && order.line === 'Every Adobe product and outside system in this tool, and the lines that connect them.' && m.label === 'How every product connects',
      `1. ${where}: its heading reads See how every product connects, with one plain line under it`, JSON.stringify(order));
    ok(!m.red.length && !m.dots && !m.lit && !m.reset && !/On my canvas|Not on my canvas|Your play|Reset to my play/i.test(m.text) && m.panel === PROMPT && Object.keys(m.at).length === CAT.products.length,
      `1. ${where}: the whole catalog is drawn and nothing is marked as on my canvas: no red products, no blue dots, no lit lines, no Reset to my play tab, no On my canvas line, and the panel starts with a plain prompt`,
      JSON.stringify({red: m.red, dots: m.dots, lit: m.lit, reset: m.reset, legend: m.legend, panel: m.panel}));
    ok(order.wide <= w, `1. ${where}: nothing on the first page scrolls sideways`, order.wide);
    // clicking a product works as on the canvas: its lines light up and the panel lists what it connects to and its services, read-only
    await p.evaluate(() => document.querySelector('#knowledge-model-section .wke-node[data-id="claude"]').scrollIntoView({block: 'center'})); await p.waitForTimeout(150);
    await p.click('#knowledge-model-section .wke-node[data-id="claude"]'); await p.waitForTimeout(250);
    const c = await map(p), mine = CAT.connections.filter(x => x.a === 'claude' || x.b === 'claude'), others = mine.map(x => P[x.a === 'claude' ? x.b : x.a].name);
    ok(same(c.red, ['claude']) && c.lit === mine.length && same(c.links, mine.map(x => x.id).sort()) && others.every(x => c.panel.includes(x)) && c.panel.startsWith('OUTSIDE SYSTEM\nClaude'),
      `1. ${where}: clicking Claude lights its ${mine.length} lines and the panel lists everything it connects to`, JSON.stringify({red: c.red, lit: c.lit, panel: c.panel.slice(0, 300)}));
    ok(!c.membership && !c.reset && !c.dots && !/On my canvas|Not on my canvas/.test(c.text) && !(await p.$('#knowledge-model-section input[type="checkbox"]')) && await p.evaluate(() => st.play === null && !st.on.length),
      `1. ${where}: after the click nothing is ticked or added: no On my canvas line, no Reset tab, and still no play or product picked`);
    await p.context().close();
  }

  // the services of a product with services, read-only
  { const p = await page(); await p.click('#knowledge-model-section .wke-node[data-id="cja"]'); await p.waitForTimeout(250);
    const s = await p.evaluate(() => ({opts: [...document.querySelectorAll('#knowledge-model-section .wke-services option')].map(o => o.value), ro: document.querySelector('#knowledge-model-section .wke-services').innerText}));
    ok(same(s.opts.sort(), [...new Set([...(P.cja.lines || []), ...(P.cja.more || [])])].filter(id => CAT.lines[id]).sort()) && /read-only/.test(s.ro),
      '1. clicking Customer Journey Analytics on the first page lists its services, read-only', JSON.stringify(s).slice(0, 300));

    // ============ 2. picking a play: the map goes back under the canvas and shows that play as before ============
    await p.evaluate(() => document.querySelector('#picker-list .pc-card[data-play="commerce"]').click()); await p.waitForTimeout(800);
    const m = await map(p), on = await p.evaluate(() => ({ids: displayProducts().map(x => x.id).sort(), label: play().title || play().label, picker: document.getElementById('picker').hidden}));
    const between = CAT.connections.filter(c => on.ids.includes(c.a) && on.ids.includes(c.b)).length;
    ok(on.picker && m.shown && !m.inPicker && m.afterScreen && m.label === 'Your play in the product catalog',
      '2. after picking Brand Visibility + Adobe Commerce the map sits under the canvas again, not on the hidden first page', JSON.stringify(m).slice(0, 300));
    ok(same(m.red, on.ids) && m.dots === on.ids.length && m.lit === between && m.reset && /On my canvas/.test(m.legend) && m.panel.startsWith('YOUR PLAY\n' + on.label),
      `2. the map under the canvas shows the play as before: its ${on.ids.length} products and systems in red with blue dots, the ${between} lines between them, Reset to my play and the play's name in the panel (the Claude click from the first page is gone)`,
      JSON.stringify({red: m.red, ids: on.ids, dots: m.dots, lit: m.lit, panel: m.panel.slice(0, 120)}));
    await p.click('#knowledge-model-section .wke-node[data-id="claude"]'); await p.waitForTimeout(250); const c = await map(p);
    ok(c.membership && /Not on my canvas/.test(c.panel) && c.reset, '2. on the canvas a product outside the play still says Not on my canvas, with Reset to my play');

    // ============ 3. Change play: back on the first page the map is there again with nothing on it ============
    await p.click('#change-play'); await p.waitForTimeout(200); await p.click('#confirm-yes'); await p.waitForTimeout(600);
    const back = await map(p);
    ok(await p.evaluate(() => st.play === null && !document.getElementById('picker').hidden) && back.shown && back.inPicker && !back.red.length && !back.dots && !back.reset && back.panel === PROMPT,
      '3. Change play brings back the first page with the map at its bottom, and nothing on it is marked as on my canvas', JSON.stringify({red: back.red, reset: back.reset, panel: back.panel}));
    await p.context().close(); }

  ok(!errs.length, 'no script errors on the first page or the canvas', errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(fails ? `\n${fails} of ${n} MAP ON THE FIRST PAGE CHECKS FAILED` : `\nALL ${n} MAP ON THE FIRST PAGE CHECKS PASSED`);
  process.exit(fails ? 1 : 0);
})();
