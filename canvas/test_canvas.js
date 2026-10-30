// Click test for the Build canvas prototype. Run from the repo root:  node sow/canvas/test_canvas.js
// Compares every play with the live SOW tool (sow/index.html), then exercises the canvas like a partner would.
const {chromium} = require('playwright');
const path = require('path');
const fs = require('fs');
const HERE = __dirname;
const CANVAS = 'file://' + path.join(HERE, 'index.html');
const LIVE = 'file://' + path.join(HERE, '..', 'index.html');
const CAT = JSON.parse(fs.readFileSync(path.join(HERE, 'catalog.json'), 'utf8'));
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + d + ']')); if (!c) fails++; };
const money = n => '$' + Math.round(n).toLocaleString('en-US');
const P = Object.fromEntries(CAT.products.map(p => [p.id, p]));

function expected(prodIds, size = 'base', rate = 150, ls = {}) {
  const on = new Set(prodIds), owners = [...CAT.products.filter(p => on.has(p.id)), ...CAT.connections.filter(c => on.has(c.a) && on.has(c.b))];
  let one = 0, mon = 0;
  for (const o of owners) {
    const need = l => (CAT.lines[l].needs || []).every(x => on.has(x));
    for (const l of o.lines) if (ls[l] !== false && need(l)) (CAT.lines[l].unit === 'monthly' ? (mon += CAT.lines[l][size] * rate) : (one += CAT.lines[l][size] * rate));
    for (const l of o.more) if (ls[l] === true && need(l)) (CAT.lines[l].unit === 'monthly' ? (mon += CAT.lines[l][size] * rate) : (one += CAT.lines[l][size] * rate));
  }
  return {one, mon, yr: one + 12 * mon};
}

(async () => {
  const b = await chromium.launch();
  const errs = [];
  const fresh = async (w = 1600, h = 950) => { const ctx = await b.newContext({viewport: {width: w, height: h}}); const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); return p; };
  const read = async p => ({big: (await p.textContent('#t-big')).trim(), sub: (await p.textContent('#t-sub')).trim()});
  const edges = async p => (await p.$$eval('.edge', es => es.map(e => e.dataset.c))).sort();
  const nodes = async p => (await p.$$eval('.node', es => es.map(e => e.dataset.p))).sort();

  // 1. each play matches the live tool at $150, Typical
  for (const play of CAT.plays) {
    const live = await fresh();
    await live.goto(LIVE); await live.click(`[data-play="${play.id}"]`); await live.click('[data-step="services"]');
    await live.fill('#service-rate', '150'); await live.waitForTimeout(150);
    const ls = await live.$$eval('.total-card strong', e => e.map(x => x.textContent.trim()));
    const p = await fresh(); await p.goto(CANVAS);
    await p.click('#play-btn'); await p.click(`[data-play="${play.id}"]`); await p.waitForTimeout(500);
    const t = await read(p);
    const liveSub = `${ls[0]} one-time + ${ls[1].replace(' a month', '')} a month`;
    ok(t.big === ls[2] && t.sub === liveSub, `${play.label}: the canvas total matches the live tool (${ls[2]}, ${ls[0]} one-time + ${ls[1]})`, `${t.big} / ${t.sub}`);
    ok(JSON.stringify(await nodes(p)) === JSON.stringify([...play.products].sort()), `${play.label}: its products are on the canvas`);
    await p.context().close(); await live.context().close();
  }

  const p = await fresh(); await p.goto(CANVAS); await p.waitForTimeout(300);
  ok(await p.isVisible('#empty') && (await nodes(p)).length === 0, 'opens on an empty canvas with Add product and Start from a play');

  // 2. Play 3, then products connect themselves
  await p.click('#play-btn'); await p.click('[data-play="aem"]'); await p.waitForTimeout(500);
  ok(JSON.stringify(await edges(p)) === JSON.stringify(['bv-eds', 'so-eds']), 'Play 3 draws its two connections, each with an i', (await edges(p)).join(','));
  ok((await p.$$('.ib')).length === 2, 'one i on each connection');
  await p.click('#add-btn'); await p.click('#add-menu [data-p="cw"]'); await p.waitForTimeout(300);
  ok((await edges(p)).includes('cw-eds') && !(await edges(p)).includes('cw-cja'), 'adding Coworker connects it to Edge Delivery Services, and not to CJA (not on the canvas)');
  await p.click('#add-menu [data-p="cja"]'); await p.waitForTimeout(300);
  { const es = await edges(p); ok(es.includes('bv-cja') && es.includes('cw-cja'), 'adding CJA connects it to Brand Visibility and Coworker', es.join(',')); }
  await p.mouse.click(8, 940); await p.waitForTimeout(500);
  let t = await read(p);
  let e = expected(['bv', 'so', 'eds', 'cw', 'cja']);
  ok(t.big === money(e.yr), 'the total adds every product and connection on the canvas', `${t.big} vs ${money(e.yr)}`);

  // 3. the canvas shows names only
  const nodeText = await p.$$eval('.node', es => es.map(x => x.textContent.trim()));
  ok(nodeText.every(x => !/\$|\d/.test(x)), 'the canvas shows product names only, no numbers', nodeText.join(' | '));
  ok(await p.isHidden('#card'), 'no card until you hover');

  // 4. hover a product, X a line, check it back
  await p.hover('.node[data-p="eds"]'); await p.waitForTimeout(250);
  ok(await p.isVisible('#card') && (await p.textContent('#card h4')).includes('Edge Delivery Services'), 'hovering a product opens its services card');
  const rows = await p.$$eval('#card .ln', r => r.map(x => x.dataset.l));
  ok(JSON.stringify(rows) === JSON.stringify(P.eds.lines), 'the card lists the product\'s services', rows.join(','));
  const srcs = await p.$$eval('#card .ln .src', a => a.map(x => x.href));
  ok(srcs.length === rows.length && srcs.every(h => h.startsWith('http')), 'every line in the card has a source link');
  await p.click('#card [data-t="A03"]'); await p.waitForTimeout(150);
  t = await read(p); e = expected(['bv', 'so', 'eds', 'cw', 'cja'], 'base', 150, {A03: false});
  ok(t.big === money(e.yr) && (await p.textContent('#card .ln[data-l="A03"] .fee')).trim() === 'Removed', 'X on a line takes it out: the card says Removed and the total drops by $18,000', t.big);
  ok((await p.textContent('#card .ft')).includes('4 of 5 services'), 'the card footer counts what is left', await p.textContent('#card .ft'));
  await p.click('#card [data-t="A03"]'); await p.waitForTimeout(150);
  t = await read(p); e = expected(['bv', 'so', 'eds', 'cw', 'cja']);
  ok(t.big === money(e.yr), 'the check brings it back');
  await p.click('#card [data-t="A03"]'); await p.waitForTimeout(100);   // leave it out for the re-add test

  // 5. hover an i
  await p.click('#card [data-close]'); await p.waitForTimeout(100);
  await p.hover('.ib[data-c="bv-eds"]'); await p.waitForTimeout(250);
  ok(await p.isVisible('#card') && (await p.textContent('#card .k')).includes('Connection'), 'hovering an i opens the connection card');
  const secs = await p.$$eval('#card .sec', x => x.map(y => y.textContent.trim().toLowerCase()));
  ok(secs.join('|') === 'what you get together|how the data flows|services on this connection', 'the card says what you get together, how the data flows, then the services', secs.join('|'));
  ok((await p.textContent('#card .gain b')).trim().length > 5, 'what you get together has a headline: ' + (await p.textContent('#card .gain b')).trim());
  const flowSrc = await p.$$eval('#card .flow', fs => fs.map(f => !!f.querySelector('.src[href^="http"]')));
  ok(flowSrc.length >= 1 && flowSrc.every(Boolean), 'every data flow has its source');
  ok(await p.$eval('.edge[data-c="bv-eds"]', x => x.classList.contains('hot')), 'the hovered connection lights up red');
  ok(await p.$eval('.edge[data-c="bv-eds"]', x => x.getAttribute('marker-end') || x.getAttribute('marker-start')) !== null, 'an arrow on the line shows which way the data goes');
  await p.mouse.move(5, 300); await p.waitForTimeout(400);
  await p.hover('.ib[data-c="bv-cja"]'); await p.waitForTimeout(250);
  ok((await p.$$('#card .flow')).length === 2 && await p.$eval('.edge[data-c="bv-cja"]', x => !!x.getAttribute('marker-start') && !!x.getAttribute('marker-end')), 'Brand Visibility and CJA: data flows both ways, arrows at both ends');
  await p.mouse.move(5, 300); await p.waitForTimeout(400);

  // 6. optional services
  await p.mouse.move(5, 300); await p.waitForTimeout(400);
  await p.click('.node[data-p="bv"]'); await p.waitForTimeout(200);
  await p.click('#card details.more summary'); await p.waitForTimeout(150);
  ok((await p.textContent('#card details.more .ln[data-l="O03"] .fee')).trim().startsWith('+$'), 'optional lines show what they would add (+$), not counted yet');
  await p.click('#card [data-t="O03"]'); await p.waitForTimeout(150);
  t = await read(p); e = expected(['bv', 'so', 'eds', 'cw', 'cja'], 'base', 150, {A03: false, O03: true});
  ok(t.big === money(e.yr), 'More services adds an optional line, and the total rises', t.big);
  await p.click('#card [data-t="O03"]'); await p.waitForTimeout(100);
  await p.click('#card [data-close]');

  // 7. size and rate
  for (const [btn, key] of [['small', 'low'], ['large', 'high'], ['typical', 'base']]) {
    await p.click(`#size [data-size="${btn}"]`); await p.waitForTimeout(100);
    t = await read(p); e = expected(['bv', 'so', 'eds', 'cw', 'cja'], key, 150, {A03: false});
    ok(t.big === money(e.yr), `${btn[0].toUpperCase() + btn.slice(1)} uses each line's ${key} hours`, `${t.big} vs ${money(e.yr)}`);
  }
  await p.fill('#rate', '200'); await p.waitForTimeout(100);
  t = await read(p); e = expected(['bv', 'so', 'eds', 'cw', 'cja'], 'base', 200, {A03: false});
  ok(t.big === money(e.yr), 'changing the rate reprices everything', t.big);
  await p.fill('#rate', ''); await p.waitForTimeout(100);
  ok((await read(p)).big === '$ ___', 'no rate: the total shows a blank, never a guess');
  await p.fill('#rate', '150'); await p.waitForTimeout(100);

  // 8. remove a product and add it back
  await p.click('.node[data-p="eds"]'); await p.waitForTimeout(150); await p.click('#card [data-rm="eds"]'); await p.waitForTimeout(400);
  ok(!(await nodes(p)).includes('eds') && !(await edges(p)).some(x => x.includes('eds')), 'Remove from canvas takes the product and its connections off');
  t = await read(p); e = expected(['bv', 'so', 'cw', 'cja']);
  ok(t.big === money(e.yr), 'and their services leave the total', t.big);
  await p.click('#add-btn'); await p.click('#add-menu [data-p="eds"]'); await p.mouse.click(8, 940); await p.waitForTimeout(500);
  t = await read(p); e = expected(['bv', 'so', 'eds', 'cw', 'cja'], 'base', 150, {A03: false});
  ok(t.big === money(e.yr), 'adding it back restores it as it was left (the X\'d line stays out)', t.big);

  // 8b. Target and CJA: a service that needs Real-Time CDP, unlocked from the card
  await p.click('#add-btn'); await p.click('#add-menu [data-p="target"]'); await p.mouse.click(8, 940); await p.waitForTimeout(500);
  const hasRt = (await nodes(p)).includes('rtcdp');
  if (!hasRt) {
    await p.click('.ib[data-c="target-cja"]'); await p.waitForTimeout(250);
    const lockTxt = await p.textContent('#card .ln.lock');
    ok(lockTxt.includes('Needs Real-Time CDP') && (await p.$$('#card .ln.lock [data-addp="rtcdp"]')).length === 1, 'Target and CJA: "CJA audiences for Target" waits for Real-Time CDP, with an Add button');
    ok((await p.textContent('#card .flow.wait')).includes('Needs Real-Time CDP'), 'the CJA to Target flow says it needs Real-Time CDP');
    ok(await p.$eval('.edge[data-c="target-cja"]', x => !x.getAttribute('marker-start') && !!x.getAttribute('marker-end') || !!x.getAttribute('marker-start') && !x.getAttribute('marker-end')), 'one arrow only, Target to CJA, until Real-Time CDP is added');
    const t0 = await read(p), on0 = await nodes(p);
    e = expected(on0, 'base', 150, {A03: false});
    ok(t0.big === money(e.yr), 'the waiting line is not in the total');
    await p.click('#card [data-addp="rtcdp"]'); await p.waitForTimeout(600);
    ok((await nodes(p)).includes('rtcdp') && await p.isVisible('#card'), 'Add puts Real-Time CDP on the canvas and keeps the card open');
    ok((await p.$$('#card .ln.lock')).length === 0 && (await p.$$('#card .ln[data-l="TC04"] [data-t="TC04"]')).length === 1, 'the line unlocks and counts');
    ok(await p.$eval('.edge[data-c="target-cja"]', x => !!x.getAttribute('marker-start') && !!x.getAttribute('marker-end')), 'now arrows at both ends: CJA audiences reach Target');
    const t1 = await read(p); e = expected(await nodes(p), 'base', 150, {A03: false});
    ok(t1.big === money(e.yr), 'the total adds Real-Time CDP, its connection to CJA and the unlocked line', t1.big);
    await p.click('#card [data-close]'); await p.waitForTimeout(100);
  }

  // 9. everything on the canvas: layout checks
  await p.click('#add-btn');
  for (const id of CAT.products.map(x => x.id)) if (!(await nodes(p)).includes(id)) { await p.click(`#add-menu [data-p="${id}"]`); await p.waitForTimeout(120); }
  await p.mouse.click(8, 940); await p.waitForTimeout(700);
  const boxes = await p.$$eval('.node', es => es.map(e => { const r = e.getBoundingClientRect(); return {id: e.dataset.p, x: r.left, y: r.top, w: r.width, h: r.height}; }));
  const dots = await p.$$eval('.ib', es => es.map(e => { const r = e.getBoundingClientRect(); return {id: e.dataset.c, x: r.left + r.width / 2, y: r.top + r.height / 2}; }));
  const overlap = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  ok(boxes.every((a, i) => boxes.every((b2, j) => i === j || !overlap(a, b2))), `all ${boxes.length} products on the canvas, none overlapping`);
  ok(dots.every(d => boxes.every(bx => !(d.x > bx.x && d.x < bx.x + bx.w && d.y > bx.y && d.y < bx.y + bx.h))), 'no i sits on a product');
  let minGap = 1e9; dots.forEach((a, i) => dots.forEach((c, j) => { if (i < j) minGap = Math.min(minGap, Math.hypot(a.x - c.x, a.y - c.y)); }));
  ok(minGap > 28, `the ${dots.length} i dots stay apart (closest ${Math.round(minGap)}px)`);
  const cvs = await p.$eval('#canvas', c => { const r = c.getBoundingClientRect(); return {x: r.left, y: r.top, w: r.width, h: r.height}; });
  ok(boxes.every(bx => bx.x >= cvs.x && bx.y >= cvs.y && bx.x + bx.w <= cvs.x + cvs.w && bx.y + bx.h <= cvs.y + cvs.h), 'the whole architecture fits on the canvas');
  if (P.cja && CAT.connections.filter(c => c.b === 'cja' || c.a === 'cja').length >= 4) {
    const into = (await edges(p)).filter(x => x.endsWith('-cja') || x.startsWith('cja-'));
    ok(into.length >= 4, `CJA takes ${into.length} connections, each its own line and i`, into.join(','));
  }

  // 10. text and readability
  const body = await p.evaluate(() => document.body.innerText);
  ok(!/[–—]/.test(body) && !/[–—]/.test(JSON.stringify(CAT)), 'no en or em dashes anywhere');
  const faded = await p.evaluate(() => [...document.querySelectorAll('.node,.card,.hint,.total,.toolbar *')].filter(e => parseFloat(getComputedStyle(e).opacity) < 1).length);
  ok(faded === 0, 'no faded or low-opacity text');
  const unsourced = Object.values(CAT.lines).filter(l => !/^https?:\/\//.test(l.url));
  ok(unsourced.length === 0, `every one of the ${Object.keys(CAT.lines).length} lines in the catalog has a source`);

  // 11. start over, and a phone
  await p.click('#start-over'); await p.click('#confirm-yes'); await p.waitForTimeout(300);
  ok((await nodes(p)).length === 0 && await p.isVisible('#empty'), 'Start over clears the canvas');
  const ph = await fresh(390, 844); await ph.goto(CANVAS); await ph.click('#play-btn'); await ph.click('[data-play="aem"]'); await ph.waitForTimeout(500);
  const sw = await ph.evaluate(() => document.documentElement.scrollWidth);
  ok(sw <= 390, 'on a phone the page doesn\'t scroll sideways', String(sw));
  ok((await nodes(ph)).length === 3, 'on a phone the play still draws');

  ok(errs.length === 0, 'no script errors', errs.join(' | ').slice(0, 300));
  await b.close();
  console.log(fails ? `${fails} CHECK(S) FAILED` : 'ALL CANVAS CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})();
