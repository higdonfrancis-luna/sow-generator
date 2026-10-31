// Click test for the Build canvas prototype. Run from the repo root:  node sow/canvas/test_canvas.js
// Compares the six plays with the live SOW tool (sow/index.html), then exercises the play picker, the fixed plays and
// Create your own play (Add product, Remove from canvas, the busy-canvas focus view) like a partner would.
const {chromium} = require('playwright');
const path = require('path');
const fs = require('fs');
const HERE = __dirname;
const CANVAS = 'file://' + path.join(HERE, 'index.html');
const LIVE = 'file://' + path.join(HERE, '..', 'index.html');
const CAT = JSON.parse(fs.readFileSync(path.join(HERE, 'catalog.json'), 'utf8'));
const MAP = JSON.parse(fs.readFileSync(path.join(HERE, 'catalog_map.json'), 'utf8'));
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + d + ']')); if (!c) fails++; };
const money = n => '$' + Math.round(n).toLocaleString('en-US');
const P = Object.fromEntries(CAT.products.map(p => [p.id, p]));
const PL = Object.fromEntries(CAT.plays.map(p => [p.id, p]));
const CUSTOM = CAT.plays.find(p => p.custom);
const FIXED = CAT.plays.filter(p => !p.custom);
const LIVE_PLAYS = ['cja', 'commerce', 'aem', 'fsi', 'abv', 'coworker'];
const N = CUSTOM.products.length;   // the products Create your own play offers
const OCT30 = ['rtcdp', 'ajo', 'target', 'cja', 'marketo', 'workfront', 'bv', 'so', 'commerce', 'eds', 'cw', 'bc'];
const linked = (a, b) => CAT.connections.some(c => (c.a === a && c.b === b) || (c.a === b && c.b === a));
const CBY_ok = (cid, l) => { const c = CAT.connections.find(x => x.id === cid); return !!c && c.lines.includes(l); };

// what the canvas should total: a play's products (or the products put on Create your own play), at a size and rate
function expected(playId, size = 'base', rate = 150, ls = {}, onIds = null) {
  const pl = PL[playId], on = new Set(onIds || pl.products), extra = pl.on || [];
  const owners = [...CAT.products.filter(p => on.has(p.id)), ...CAT.connections.filter(c => on.has(c.a) && on.has(c.b))];
  let one = 0, mon = 0;
  const add = l => (CAT.lines[l].unit === 'monthly' ? (mon += CAT.lines[l][size] * rate) : (one += CAT.lines[l][size] * rate));
  for (const o of owners) {
    const need = l => (CAT.lines[l].needs || []).every(x => on.has(x));
    for (const l of o.lines) if (ls[l] !== false && need(l)) add(l);
    for (const l of o.more) if ((l in ls ? ls[l] : extra.includes(l)) && need(l)) add(l);
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
  const addP = async (p, id) => { if (await p.isHidden('#add-menu')) await p.click('#add-btn');
    if (await p.$(`#add-menu details.nocon [data-add="${id}"]`) && !(await p.$eval('#add-menu details.nocon', d => d.open))) await p.click('#add-menu details.nocon summary');
    await p.click(`#add-menu [data-add="${id}"]`); await p.waitForTimeout(350); };
  const outside = async p => { await p.mouse.click(40, 938); await p.waitForTimeout(250); };   // the empty strip by the hint, clear of the menu and Save
  const away = async p => { await p.mouse.move(1595, 945); await p.waitForTimeout(450); };
  const layoutClean = async p => {
    const boxes = await p.$$eval('.node', es => es.map(e => { const r = e.getBoundingClientRect(); return {x: r.left, y: r.top, w: r.width, h: r.height}; }));
    const dots = await p.$$eval('.ib', es => es.map(e => { const r = e.getBoundingClientRect(); return {x: r.left + r.width / 2, y: r.top + r.height / 2}; }));
    const overlap = (a, c) => a.x < c.x + c.w && c.x < a.x + a.w && a.y < c.y + c.h && c.y < a.y + a.h;
    const cv = await p.$eval('#canvas', c => { const r = c.getBoundingClientRect(); return {x: r.left, y: r.top, w: r.width, h: r.height}; });
    let minGap = 1e9; dots.forEach((a, i) => dots.forEach((c, j) => { if (i < j) minGap = Math.min(minGap, Math.hypot(a.x - c.x, a.y - c.y)); }));
    return boxes.every((a, i) => boxes.every((c, j) => i === j || !overlap(a, c))) &&
      dots.every(d => boxes.every(bx => !(d.x > bx.x - 2 && d.x < bx.x + bx.w + 2 && d.y > bx.y - 2 && d.y < bx.y + bx.h + 2))) &&
      (dots.length < 2 || minGap > 28) && boxes.every(bx => bx.x >= cv.x && bx.y >= cv.y && bx.x + bx.w <= cv.x + cv.w && bx.y + bx.h <= cv.y + cv.h);
  };

  // 1. the four Brand Visibility plays and the two solo plays match the live tool at $150, Typical
  ok(CAT.plays.length === 7 && FIXED.map(p => p.id).join() === LIVE_PLAYS.join() && CUSTOM && CUSTOM.id === 'custom',
    `seven plays: the six from the live tool, then Create your own play (${CAT.plays.map(p => p.id).join(', ')})`);
  ok(CUSTOM.products.every(id => P[id]) && CAT.products.length === N && OCT30.every(id => CUSTOM.products.includes(id)),
    `Create your own play offers ${N} products, the 12 researched on Oct 30 among them (${CUSTOM.products.join(', ')})`);
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
  ok((await p.$$('#picker .pc-card')).length === 7, 'the picker shows seven cards');
  const secs0 = await p.$$eval('#picker .sh', x => x.map(y => y.textContent.trim()));
  ok(secs0.join('|') === 'Brand Visibility plays|Sell on its own|Build your own', 'in three groups: Brand Visibility plays, Sell on its own, Build your own', secs0.join('|'));
  ok((await p.textContent('#picker [data-play="custom"]')).includes('Create your own play') && (await p.textContent('#picker [data-play="custom"] .cchip')).trim() === `${N} products to choose from`,
    `the last card is Create your own play, with ${N} products to choose from`);
  ok((await p.textContent('#picker')).includes('One play per statement of work. To quote a second play, start a second SOW.'), 'the picker says one play per statement of work');
  const chips = await p.$$eval('#picker .pc-card:not([data-play="custom"])', cs => cs.map(c => c.querySelectorAll('.chips span').length));
  ok(chips.every((n, i) => n === FIXED[i].products.length), 'each play card shows a chip for each of its products');
  ok(await p.isVisible('#play-btn') && await p.isHidden('#change-play') && await p.isHidden('#save') && await p.isHidden('#addwrap'), 'the toolbar offers Choose a play; Change play, Add product and Save wait for a play');
  await p.click('#play-btn'); await p.waitForTimeout(100);
  ok((await p.$$('#play-menu [data-play]')).length === 7, 'the Choose a play menu lists the same seven');

  // 3. a fixed play, chosen from the toolbar menu
  await p.click('#play-menu [data-play="aem"]'); await p.waitForTimeout(600);
  ok(await p.isHidden('#picker') && JSON.stringify(await nodes(p)) === JSON.stringify(['bv', 'eds', 'so']), 'Choose a play puts that play\'s products on the canvas', (await nodes(p)).join(','));
  ok(JSON.stringify(await edges(p)) === JSON.stringify(['bv-eds', 'so-eds']) && (await p.$$('.ib')).length === 2, 'they connect themselves, an i on each connection', (await edges(p)).join(','));
  ok((await p.textContent('#play-label')).trim() === PL.aem.label && await p.isVisible('#change-play') && await p.isHidden('#play-btn') && await p.isHidden('#addwrap'),
    'the toolbar shows the play name and Change play, and no Add product (a play\'s products are fixed)');
  ok(await p.isHidden('#fbar'), 'a small play draws every line, with no focus bar');
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
  ok((await p.$$('#card [data-rm]')).length === 0, 'a fixed play\'s card has no Remove from canvas');
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

  // 8b. a line a play turns on can be taken out (Brand Visibility on its own starts with C05)
  await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300); await choose(p, 'abv');
  await p.click('.node[data-p="bv"]'); await p.waitForTimeout(200);
  await p.click('#card [data-t="C05"]'); await p.waitForTimeout(150);
  t = await read(p); e = expected('abv', 'base', 150, {C05: false});
  ok(t.big === money(e.yr) && (await p.textContent('#card .ln[data-l="C05"] .fee')).trim() === 'Removed', 'Brand Visibility on its own: X on its prompt strategy line takes it out and keeps it out', t.big);
  await p.click('#card [data-t="C05"]'); await p.waitForTimeout(150);
  ok((await read(p)).big === money(expected('abv').yr), 'and the check brings it back');
  await p.click('#card [data-close]');

  // 9. every fixed play: its products, its connections, and a clean layout
  for (const pl of FIXED) {
    const q = await fresh(); await q.goto(CANVAS); await choose(q, pl.id);
    const want = CAT.connections.filter(c => pl.products.includes(c.a) && pl.products.includes(c.b)).map(c => c.id).sort();
    const tq = await read(q), eq = expected(pl.id);
    ok(JSON.stringify(await nodes(q)) === JSON.stringify([...pl.products].sort()) && JSON.stringify(await edges(q)) === JSON.stringify(want) && tq.big === money(eq.yr) && await layoutClean(q),
      `${pl.label}: ${pl.products.length} product${pl.products.length > 1 ? 's' : ''}, ${want.length} connection${want.length === 1 ? '' : 's'}, ${tq.big}, a clean layout`, `${(await edges(q)).join(',')} / ${tq.big}`);
    await q.context().close();
  }

  // 10. Create your own play: an empty canvas and the Add product menu
  await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300); await choose(p, 'custom');
  ok((await p.textContent('#play-label')).trim() === 'Your own play' && await p.isVisible('#addwrap') && await p.isVisible('#change-play'), 'Create your own play: the toolbar says Your own play, with Add product and Change play');
  ok(await p.isVisible('#empty') && (await p.textContent('#empty h2')).trim() === 'Add your first product' && await p.isHidden('#save') && (await nodes(p)).length === 0,
    'it opens on an empty canvas that asks for the first product, with no Save yet');
  ok(await p.isVisible('#add-menu') && (await p.$$('#add-menu [data-add]')).length === N, `the Add product menu opens by itself and lists all ${N} products`);
  const firstTags = await p.$$eval('#add-menu [data-add]', its => its.map(i => [i.dataset.add, i.querySelector('.ctag').textContent.trim()]));
  ok(firstTags.every(([id, tag]) => { const n = CUSTOM.products.filter(q => q !== id && linked(id, q)).length; return tag === `Connects to ${n} product${n === 1 ? '' : 's'}`; }),
    'before anything is on the canvas, each product says how many of the others it connects to', firstTags.slice(0, 3).map(x => x.join(': ')).join(' | '));
  const emptyBox = await p.$eval('#empty h2', e => e.getBoundingClientRect()), menuBox = await p.$eval('#add-menu', e => e.getBoundingClientRect());
  ok(emptyBox.left > menuBox.right, 'the open menu does not cover the empty canvas message');
  await addP(p, 'bv');
  ok(JSON.stringify(await nodes(p)) === '["bv"]' && await p.isHidden('#empty') && await p.isVisible('#save'), 'adding a product puts it on the canvas; Save appears');
  ok(await p.isVisible('#add-menu'), 'the menu stays open to add more');
  const yes = await p.$$eval('#add-menu > [data-add]', its => its.map(i => i.dataset.add));
  const wantYes = CUSTOM.products.filter(id => id !== 'bv' && linked(id, 'bv'));
  ok(yes.length === wantYes.length && yes.every(id => wantYes.includes(id)), `products that connect to the canvas come first (${yes.join(', ')})`);
  ok((await p.textContent('#add-menu .g')).trim().toLowerCase() === 'connects to your canvas' && (await p.$$eval('#add-menu > [data-add] .ctag', x => x.map(y => y.textContent.trim()))).every(s => s === 'Connects to 1 on your canvas'),
    'each says "Connects to 1 on your canvas"');
  const restN = CUSTOM.products.length - 1 - wantYes.length;
  ok((await p.textContent('#add-menu details.nocon summary')).trim().startsWith(`${restN} more do not connect to your canvas yet`), `the other ${restN} wait under "${restN} more do not connect to your canvas yet"`);
  await p.hover('#add-menu [data-add="cja"]'); await p.waitForTimeout(150);
  ok(await p.$eval('.node[data-p="bv"]', n => n.classList.contains('pre')), 'pointing at a product in the menu outlines what it would connect to on the canvas');
  await addP(p, 'cja');
  ok(JSON.stringify(await edges(p)) === '["bv-cja"]', 'adding CJA connects it to Brand Visibility by itself');
  t = await read(p); e = expected('custom', 'base', 150, {}, ['bv', 'cja']);
  ok(t.big === money(e.yr) && t.big === money(expected('cja').yr), `Brand Visibility and CJA built by hand total the same as the CJA play (${t.big})`, `${t.big}`);
  await outside(p);
  ok(await p.isHidden('#add-menu'), 'a click outside closes the menu');

  // 10b. AEM Sites and AEM Assets (Adam, Oct 31): Assets with Workfront and with Sites, and CJA pulling data from Sites
  { const q = await fresh(); await q.goto(CANVAS); await choose(q, 'custom');
    for (const id of ['aemassets', 'workfront', 'aemsites', 'cja']) await addP(q, id);
    await outside(q);
    const es = await edges(q);
    ok(['aemassets-workfront', 'aemsites-aemassets', 'aemsites-cja'].every(x => es.includes(x)), `AEM Assets connects to Workfront and to AEM Sites, and AEM Sites to CJA (${es.join(', ')})`);
    ok(CBY_ok('aemassets-workfront', 'XB12'), 'the Workfront to AEM Assets setup is a default line on AEM Assets + Workfront');
    ok(!CAT.connections.some(c => c.id === 'workfront-eds' && [...c.lines, ...c.more].includes('XB12')), 'and no longer counts on Workfront + Edge Delivery without AEM Assets');
    await q.click('.ib[data-c="aemsites-cja"]'); await q.waitForTimeout(300);
    const fl = await q.$$eval('#card .flow .fl', fs => fs.map(f => [...f.querySelectorAll('.pc')].map(x => x.textContent.trim()).join('>')));
    ok(fl.includes('AEM Sites>CJA') && (await q.textContent('#card .sec')).length > 0, 'the AEM Sites + CJA card shows data flowing from AEM Sites to CJA', fl.join(' | '));
    await q.click('#card [data-close]'); await q.waitForTimeout(150);
    const tq = await read(q), eq = expected('custom', 'base', 150, {}, ['aemassets', 'workfront', 'aemsites', 'cja']);
    ok(tq.big === money(eq.yr), `the four together total ${tq.big}, every product and connection counted once`, `${tq.big} vs ${money(eq.yr)}`);
    await q.context().close(); }

  // 11. Remove from canvas keeps the choices underneath
  await p.click('.node[data-p="cja"]'); await p.waitForTimeout(250);
  await p.click('#card [data-t="C06"]'); await p.waitForTimeout(150);
  ok((await p.$$('#card [data-rm="cja"]')).length === 1, 'a product card on your own play has Remove from canvas');
  await p.click('#card [data-rm="cja"]'); await p.waitForTimeout(400);
  ok(JSON.stringify(await nodes(p)) === '["bv"]' && (await edges(p)).length === 0, 'Remove from canvas takes the product and its connections off');
  t = await read(p); e = expected('custom', 'base', 150, {}, ['bv']);
  ok(t.big === money(e.yr), 'and their services leave the total', t.big);
  await addP(p, 'cja');
  t = await read(p); e = expected('custom', 'base', 150, {C06: false}, ['bv', 'cja']);
  ok(t.big === money(e.yr), 'adding it back restores it as it was left (the X\'d line stays out)', t.big);
  await outside(p);

  // 12. a line that needs another product: added from the card
  await addP(p, 'target'); await outside(p);
  await p.click('.ib[data-c="target-cja"]'); await p.waitForTimeout(300);
  ok((await p.textContent('#card .ln.lock')).includes('Needs Real-Time CDP on the canvas') && (await p.$$('#card .ln.lock [data-addp="rtcdp"]')).length === 1,
    'Target and CJA: a line that needs Real-Time CDP says so, with an Add button');
  t = await read(p); e = expected('custom', 'base', 150, {C06: false}, ['bv', 'cja', 'target']);
  ok(t.big === money(e.yr), 'the waiting line is not in the total');
  await p.click('#card [data-addp="rtcdp"]'); await p.waitForTimeout(600);
  ok((await nodes(p)).includes('rtcdp') && (await p.$$('#card .ln.lock')).length === 0, 'Add puts Real-Time CDP on the canvas and the line unlocks');
  t = await read(p); e = expected('custom', 'base', 150, {C06: false}, ['bv', 'cja', 'target', 'rtcdp']);
  ok(t.big === money(e.yr), 'the total adds Real-Time CDP, its connections and the unlocked line', t.big);
  await p.click('#card [data-close]'); await p.waitForTimeout(150);

  // 13. a busy canvas switches to focus view
  for (const id of CUSTOM.products) if (!(await nodes(p)).includes(id)) await addP(p, id);
  await outside(p); await away(p);
  const all = CUSTOM.products, nAll = CAT.connections.length;
  ok((await nodes(p)).length === N && await p.isVisible('#fbar') && (await edges(p)).length === 0, `all ${N} on: the canvas goes calm, no lines at rest (${nAll} connections)`);
  ok((await p.textContent('#fbar')).includes(`${nAll} connections`) && (await p.textContent('#fbar')).includes(`The total includes the services on all ${nAll}`), 'the bar says how many connections there are and that the total counts them all');
  const counts = await p.$$eval('.node', ns => ns.map(n => [n.dataset.p, (n.querySelector('.cn') || {}).textContent]));
  ok(counts.every(([id, c]) => c === `${CAT.connections.filter(x => x.a === id || x.b === id).length} connection${CAT.connections.filter(x => x.a === id || x.b === id).length === 1 ? '' : 's'}`), 'every box says how many connections it has');
  t = await read(p); e = expected('custom', 'base', 150, {C06: false}, all);
  ok(t.big === money(e.yr), 'the total still counts every connection\'s services', `${t.big} vs ${money(e.yr)}`);
  await p.click('.node[data-p="cja"]'); await away(p);
  const cjaLinks = CAT.connections.filter(c => c.a === 'cja' || c.b === 'cja').map(c => c.id).sort();
  ok(JSON.stringify(await edges(p)) === JSON.stringify(cjaLinks) && (await p.$$('.ib')).length === cjaLinks.length, `clicking CJA draws just its ${cjaLinks.length} lines, each with its i`);
  ok((await p.textContent('#fbar')).includes('connects to') && await p.isVisible('#fb-clear'), 'the bar names what CJA connects to, with Clear');
  await p.click('#fb-clear'); await away(p);
  ok((await edges(p)).length === 0 && await p.isHidden('#fb-clear'), 'Clear goes back to the calm canvas');
  let clean = true, bad = [];
  for (const id of all) { await p.click(`.node[data-p="${id}"]`); await away(p);
    const n = (await edges(p)).length, want = CAT.connections.filter(c => c.a === id || c.b === id).length;
    if (n !== want || !(await layoutClean(p))) { clean = false; bad.push(id); }
    await p.click('#fb-clear'); await p.waitForTimeout(100); }
  ok(clean, 'every product\'s lines draw in full, with no i on a box, the i dots apart and everything on screen', bad.join(','));
  const nsv = CAT.connections.filter(c => c.no_services && all.includes(c.a) && all.includes(c.b));
  ok(nsv.length > 0 && nsv.every(c => !c.lines.length && !c.more.length && c.how && c.source && c.source.url), `${nsv.length} connection(s) Adobe documents without services keep a source and no lines`);
  await p.click(`.node[data-p="${nsv[0].a}"]`); await away(p);
  await p.click(`.ib[data-c="${nsv[0].id}"]`); await p.waitForTimeout(300);
  ok((await p.textContent('#card')).includes('does not explicitly list any services for this connection. You can add your own services on the Services tab'), `the i on ${P[nsv[0].a].name} + ${P[nsv[0].b].name} points to the Services tab`);
  await p.click('#card [data-close]'); await p.click('#fb-clear'); await p.waitForTimeout(150);

  // 14. your own play is kept on reload, and Change play clears it
  await p.reload(); await p.waitForTimeout(700);
  ok((await nodes(p)).length === N && (await p.textContent('#play-label')).trim() === 'Your own play', 'a reload keeps your own play and its products');
  await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300);
  ok(await p.isVisible('#picker'), 'Change play asks, then goes back to the picker');
  await choose(p, 'custom');
  ok((await nodes(p)).length === 0 && await p.isVisible('#empty'), 'and Create your own play starts empty again');
  await p.keyboard.press('Escape'); await p.waitForTimeout(150);
  ok(await p.isHidden('#add-menu'), 'Escape closes the Add product menu');

  // 15. text and readability
  await addP(p, 'bv'); await addP(p, 'cja'); await p.waitForTimeout(200);
  const body = await p.evaluate(() => document.body.innerText);
  ok(!/[–—]/.test(body) && !/[–—]/.test(JSON.stringify(CAT)), 'no en or em dashes anywhere');
  const faded = await p.evaluate(() => [...document.querySelectorAll('.node,.card,.hint,.total,.toolbar *,.picker *,.addmenu *,.fbar *,.empty *')].filter(e => parseFloat(getComputedStyle(e).opacity) < 1).length);
  ok(faded === 0, 'no faded or low-opacity text');
  const unsourced = Object.values(CAT.lines).filter(l => !/^https?:\/\//.test(l.url));
  ok(unsourced.length === 0, `every one of the ${Object.keys(CAT.lines).length} lines in the catalog has a source`);
  ok((MAP.products.find(x => x.id === 'mmm') || {}).name === 'Marketing Campaign Analytics', 'Mix Modeler keeps its new name, Marketing Campaign Analytics, in the map');

  // 16. start over, and a phone
  await p.click('#start-over'); await p.waitForTimeout(100);
  ok((await p.textContent('#confirm h3')).trim() === 'Start over?', 'Start over asks first');
  await p.click('#confirm-yes'); await p.waitForTimeout(300);
  ok((await nodes(p)).length === 0 && await p.isVisible('#picker'), 'Start over clears the play and opens the picker');
  const ph = await fresh(390, 844); await ph.goto(CANVAS);
  ok(await ph.evaluate(() => document.documentElement.scrollWidth) <= 390, 'on a phone the picker doesn\'t scroll sideways');
  await choose(ph, 'aem');
  ok(await ph.evaluate(() => document.documentElement.scrollWidth) <= 390 && (await nodes(ph)).length === 3, 'on a phone a play still draws, with no sideways scroll');
  await ph.click('#change-play'); await ph.click('#confirm-yes'); await ph.waitForTimeout(300); await choose(ph, 'custom');
  for (const id of CUSTOM.products) await ph.evaluate(i => addProduct(i), id);
  await ph.keyboard.press('Escape'); await ph.waitForTimeout(500);
  await ph.click('.node[data-p="cja"]'); await ph.waitForTimeout(500);
  const fb = await ph.$eval('#fbar', e => { const r = e.getBoundingClientRect(); return {right: r.right, h: r.height, sw: document.documentElement.scrollWidth}; });
  ok(fb.right <= 390 && fb.sw <= 390, `on a phone your own play with all ${N} keeps the focus bar on screen, no sideways scroll`, JSON.stringify(fb));

  ok(errs.length === 0, 'no script errors', errs.join(' | ').slice(0, 300));
  await b.close();
  console.log(fails ? `${fails} CHECK(S) FAILED` : 'ALL CANVAS CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})();
