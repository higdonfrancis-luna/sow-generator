// Click test for the Build canvas prototype. Run from the repo root:  node sow/canvas/test_canvas.js
// Compares the six Brand Visibility and solo plays with the live SOW tool (sow/index.html), then exercises the play picker and the canvas like a partner would.
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
const PL = Object.fromEntries(CAT.plays.map(p => [p.id, p]));
const LIVE_PLAYS = ['cja', 'commerce', 'aem', 'fsi', 'abv', 'coworker'];
const connsOf = pl => CAT.connections.filter(c => pl.products.includes(c.a) && pl.products.includes(c.b));

function expected(playId, size = 'base', rate = 150, ls = {}) {
  const pl = PL[playId], on = new Set(pl.products), owners = [...CAT.products.filter(p => on.has(p.id)), ...connsOf(pl)];
  let one = 0, mon = 0;
  const add = l => (CAT.lines[l].unit === 'monthly' ? (mon += CAT.lines[l][size] * rate) : (one += CAT.lines[l][size] * rate));
  for (const o of owners) {
    const need = l => (CAT.lines[l].needs || []).every(x => on.has(x));
    for (const l of o.lines) if (ls[l] !== false && need(l)) add(l);
    for (const l of o.more) if ((l in ls ? ls[l] : (pl.on || []).includes(l)) && need(l)) add(l);
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
  const choose = async (p, id) => { await p.click(`#picker [data-play="${id}"]`); await p.waitForTimeout(600); };

  // 1. the four Brand Visibility plays and the two solo plays match the live tool at $150, Typical
  ok(CAT.plays.length === 10, `ten plays in the catalog (${CAT.plays.map(p => p.id).join(', ')})`);
  for (const id of LIVE_PLAYS) {
    const play = PL[id];
    const live = await fresh();
    await live.goto(LIVE); await live.click(`[data-play="${id}"]`); await live.click('[data-step="services"]');
    await live.fill('#service-rate', '150'); await live.waitForTimeout(150);
    const ls = await live.$$eval('.total-card strong', e => e.map(x => x.textContent.trim()));
    const p = await fresh(); await p.goto(CANVAS); await choose(p, id);
    const t = await read(p);
    const liveSub = `${ls[0]} one-time + ${ls[1].replace(' a month', '')} a month`;
    ok(t.big === ls[2] && t.sub === liveSub, `${play.label}: the canvas total matches the live tool (${ls[2]}, ${ls[0]} one-time + ${ls[1]})`, `${t.big} / ${t.sub}`);
    await p.context().close(); await live.context().close();
  }

  // 2. the picker
  const p = await fresh(); await p.goto(CANVAS); await p.waitForTimeout(300);
  ok(await p.isVisible('#picker') && (await nodes(p)).length === 0, 'opens on the play picker, with nothing on the canvas');
  ok((await p.$$('#picker .pc-card')).length === 10, 'the picker shows ten play cards');
  const secs0 = await p.$$eval('#picker .sh', x => x.map(y => y.childNodes[0].textContent.trim()));
  ok(secs0.join('|') === 'Brand Visibility plays|Sell on its own|Adobe sales plays', 'in three groups: Brand Visibility plays, Sell on its own, Adobe sales plays', secs0.join('|'));
  ok((await p.textContent('#picker')).includes('One play per statement of work. To quote a second play, start a second SOW.'), 'the picker says one play per statement of work');
  const chips = await p.$$eval('#picker .pc-card', cs => cs.map(c => c.querySelectorAll('.chips span').length));
  ok(chips.every((n, i) => n === CAT.plays[i].products.length), 'each card shows a chip for each of its products');
  ok(await p.isVisible('#play-btn') && await p.isHidden('#change-play') && await p.isHidden('#save'), 'the toolbar offers Choose a play; Change play and Save wait for a play');
  ok((await p.$$('#add-btn, [data-addp], [data-rm]')).length === 0, 'no Add product, Add or Remove buttons: products come only from the play');

  // 3. choose a play from the toolbar menu
  await p.click('#play-btn'); await p.click('#play-menu [data-play="aem"]'); await p.waitForTimeout(600);
  ok(await p.isHidden('#picker') && JSON.stringify(await nodes(p)) === JSON.stringify(['bv', 'eds', 'so']), 'Choose a play puts that play\'s products on the canvas', (await nodes(p)).join(','));
  ok(JSON.stringify(await edges(p)) === JSON.stringify(['bv-eds', 'so-eds']) && (await p.$$('.ib')).length === 2, 'they connect themselves, an i on each connection', (await edges(p)).join(','));
  ok((await p.textContent('#play-label')).trim() === PL.aem.label && await p.isVisible('#change-play') && await p.isHidden('#play-btn'), 'the toolbar shows the play name and Change play');
  let t = await read(p), e = expected('aem');
  ok(t.big === money(e.yr), 'the total adds every product and connection in the play', `${t.big} vs ${money(e.yr)}`);
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
  ok(!(await p.textContent('#card')).includes('Remove from canvas'), 'the card has no Remove from canvas');
  await p.click('#card [data-t="A03"]'); await p.waitForTimeout(150);
  t = await read(p); e = expected('aem', 'base', 150, {A03: false});
  ok(t.big === money(e.yr) && (await p.textContent('#card .ln[data-l="A03"] .fee')).trim() === 'Removed', 'X on a line takes it out: the card says Removed and the total drops', t.big);
  ok((await p.textContent('#card .ft')).includes('4 of 5 services'), 'the card footer counts what is left', await p.textContent('#card .ft'));
  await p.click('#card [data-t="A03"]'); await p.waitForTimeout(150);
  t = await read(p); e = expected('aem');
  ok(t.big === money(e.yr), 'the check brings it back');
  await p.click('#card [data-t="A03"]'); await p.waitForTimeout(100);   // leave it out for the size test

  // 5. hover an i
  await p.click('#card [data-close]'); await p.waitForTimeout(100);
  await p.hover('.ib[data-c="bv-eds"]'); await p.waitForTimeout(250);
  ok(await p.isVisible('#card') && (await p.textContent('#card .k')).includes('Connection'), 'hovering an i opens the connection card');
  const secs = await p.$$eval('#card .sec', x => x.map(y => y.textContent.trim().toLowerCase()));
  ok(secs.join('|') === 'what you get together|how the data flows|services on this connection', 'the card says what you get together, how the data flows, then the services', secs.join('|'));
  const flowSrc = await p.$$eval('#card .flow', fs => fs.map(f => !!f.querySelector('.src[href^="http"]')));
  ok(flowSrc.length >= 1 && flowSrc.every(Boolean), 'every data flow has its source');
  ok(await p.$eval('.edge[data-c="bv-eds"]', x => x.classList.contains('hot')), 'the hovered connection lights up red');
  ok(await p.$eval('.edge[data-c="bv-eds"]', x => x.getAttribute('marker-end') || x.getAttribute('marker-start')) !== null, 'an arrow on the line shows which way the data goes');
  await p.mouse.move(5, 300); await p.waitForTimeout(400);

  // 6. optional services
  await p.click('.node[data-p="bv"]'); await p.waitForTimeout(200);
  await p.click('#card details.more summary'); await p.waitForTimeout(150);
  ok((await p.textContent('#card details.more .ln[data-l="O03"] .fee')).trim().startsWith('+$'), 'optional lines show what they would add (+$), not counted yet');
  await p.click('#card [data-t="O03"]'); await p.waitForTimeout(150);
  t = await read(p); e = expected('aem', 'base', 150, {A03: false, O03: true});
  ok(t.big === money(e.yr), 'More services adds an optional line, and the total rises', t.big);
  await p.click('#card [data-t="O03"]'); await p.waitForTimeout(100);
  await p.click('#card [data-close]');

  // 7. size and rate
  for (const [btn, key] of [['small', 'low'], ['large', 'high'], ['typical', 'base']]) {
    await p.click(`#size [data-size="${btn}"]`); await p.waitForTimeout(100);
    t = await read(p); e = expected('aem', key, 150, {A03: false});
    ok(t.big === money(e.yr), `${btn[0].toUpperCase() + btn.slice(1)} uses each line's ${key} hours`, `${t.big} vs ${money(e.yr)}`);
  }
  await p.fill('#rate', '200'); await p.waitForTimeout(100);
  t = await read(p); e = expected('aem', 'base', 200, {A03: false});
  ok(t.big === money(e.yr), 'changing the rate reprices everything', t.big);
  await p.fill('#rate', ''); await p.waitForTimeout(100);
  ok((await read(p)).big === '$ ___', 'no rate: the total shows a blank, never a guess');
  await p.fill('#rate', '175'); await p.click('#size [data-size="large"]'); await p.waitForTimeout(100);

  // 8. Change play asks first, clears the canvas and keeps rate and size
  await p.click('#change-play'); await p.waitForTimeout(150);
  ok(await p.isVisible('#confirm') && (await p.textContent('#confirm h3')).trim() === 'Change the play?' && (await p.textContent('#confirm-yes')).trim() === 'Choose another play', 'Change play asks first');
  await p.click('#confirm-no'); await p.waitForTimeout(150);
  ok((await nodes(p)).length === 3 && await p.isHidden('#confirm'), 'Cancel keeps the play as it was');
  await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(400);
  ok(await p.isVisible('#picker') && (await nodes(p)).length === 0, 'Choose another play clears the canvas and opens the picker');
  ok(await p.inputValue('#rate') === '175' && await p.$eval('#size [data-size="large"]', x => x.classList.contains('on')), 'the rate and size stay');
  await choose(p, 'aem');
  t = await read(p); e = expected('aem', 'high', 175);
  ok(t.big === money(e.yr), 'the service choices start fresh (the X\'d line is back)', `${t.big} vs ${money(e.yr)}`);
  await p.fill('#rate', '150'); await p.click('#size [data-size="typical"]'); await p.waitForTimeout(100);

  // 9. every play: its products, its connections, and a clean layout
  for (const pl of CAT.plays) {
    const q = await fresh(); await q.goto(CANVAS); await choose(q, pl.id);
    const want = connsOf(pl).map(c => c.id).sort();
    const tq = await read(q), eq = expected(pl.id);
    ok(JSON.stringify(await nodes(q)) === JSON.stringify([...pl.products].sort()) && JSON.stringify(await edges(q)) === JSON.stringify(want) && tq.big === money(eq.yr),
      `${pl.label}: ${pl.products.length} product${pl.products.length > 1 ? 's' : ''}, ${want.length} connection${want.length === 1 ? '' : 's'}, ${tq.big}`, `${(await edges(q)).join(',')} / ${tq.big}`);
    const boxes = await q.$$eval('.node', es => es.map(e => { const r = e.getBoundingClientRect(); return {x: r.left, y: r.top, w: r.width, h: r.height}; }));
    const dots = await q.$$eval('.ib', es => es.map(e => { const r = e.getBoundingClientRect(); return {x: r.left + r.width / 2, y: r.top + r.height / 2}; }));
    const overlap = (a, c) => a.x < c.x + c.w && c.x < a.x + a.w && a.y < c.y + c.h && c.y < a.y + a.h;
    const cv = await q.$eval('#canvas', c => { const r = c.getBoundingClientRect(); return {x: r.left, y: r.top, w: r.width, h: r.height}; });
    let minGap = 1e9; dots.forEach((a, i) => dots.forEach((c, j) => { if (i < j) minGap = Math.min(minGap, Math.hypot(a.x - c.x, a.y - c.y)); }));
    const clean = boxes.every((a, i) => boxes.every((c, j) => i === j || !overlap(a, c))) &&
      dots.every(d => boxes.every(bx => !(d.x > bx.x - 2 && d.x < bx.x + bx.w + 2 && d.y > bx.y - 2 && d.y < bx.y + bx.h + 2))) &&
      (dots.length < 2 || minGap > 28) && boxes.every(bx => bx.x >= cv.x && bx.y >= cv.y && bx.x + bx.w <= cv.x + cv.w && bx.y + bx.h <= cv.y + cv.h);
    ok(clean, `${pl.label}: no products overlap, no i sits on a product, the i dots stay apart and it all fits`);
    await q.context().close();
  }

  // 10. a connection Adobe documents without services
  const nsv = CAT.connections.filter(c => c.no_services);
  ok(nsv.length > 0 && nsv.every(c => !c.lines.length && !c.more.length && c.how && c.source && c.source.url), `${nsv.length} connection(s) documented without services keep a source and no lines`);
  const nc = nsv[0], npl = CAT.plays.find(pl => pl.products.includes(nc.a) && pl.products.includes(nc.b));
  await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300); await choose(p, npl.id);
  await p.click(`.ib[data-c="${nc.id}"]`); await p.waitForTimeout(300);
  ok((await p.textContent('#card')).includes('does not explicitly list any services for this connection. You can add your own services on the Services tab'), `the i on ${P[nc.a].name} + ${P[nc.b].name} points to the Services tab`);
  await p.click('#card [data-close]');

  // 11. text and readability
  const body = await p.evaluate(() => document.body.innerText);
  ok(!/[–—]/.test(body) && !/[–—]/.test(JSON.stringify(CAT)), 'no en or em dashes anywhere');
  const faded = await p.evaluate(() => [...document.querySelectorAll('.node,.card,.hint,.total,.toolbar *,.picker *')].filter(e => parseFloat(getComputedStyle(e).opacity) < 1).length);
  ok(faded === 0, 'no faded or low-opacity text');
  const unsourced = Object.values(CAT.lines).filter(l => !/^https?:\/\//.test(l.url));
  ok(unsourced.length === 0, `every one of the ${Object.keys(CAT.lines).length} lines in the catalog has a source`);
  ok(P.mmm && P.mmm.name === 'Marketing Campaign Analytics', 'Mix Modeler shows under its new name, Marketing Campaign Analytics');

  // 12. start over, and a phone
  await p.click('#start-over'); await p.waitForTimeout(100);
  ok((await p.textContent('#confirm h3')).trim() === 'Start over?', 'Start over asks first');
  await p.click('#confirm-yes'); await p.waitForTimeout(300);
  ok((await nodes(p)).length === 0 && await p.isVisible('#picker'), 'Start over clears the play and opens the picker');
  const ph = await fresh(390, 844); await ph.goto(CANVAS);
  ok(await ph.evaluate(() => document.documentElement.scrollWidth) <= 390, 'on a phone the picker doesn\'t scroll sideways');
  await choose(ph, 'aem');
  ok(await ph.evaluate(() => document.documentElement.scrollWidth) <= 390 && (await nodes(ph)).length === 3, 'on a phone the play still draws, with no sideways scroll');

  ok(errs.length === 0, 'no script errors', errs.join(' | ').slice(0, 300));
  await b.close();
  console.log(fails ? `${fails} CHECK(S) FAILED` : 'ALL CANVAS CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})();
