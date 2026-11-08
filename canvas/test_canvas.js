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
const ADOBE_C = CAT.connections.filter(c => !P[c.a].outside && !P[c.b].outside);   // step 27: outside systems join the fixed plays only
const OCT30 = ['rtcdp', 'ajo', 'target', 'cja', 'marketo', 'workfront', 'bv', 'so', 'commerce', 'eds', 'cw', 'bc'];
const linked = (a, b) => CAT.connections.some(c => (c.a === a && c.b === b) || (c.a === b && c.b === a));
const CBY_ok = (cid, l) => { const c = CAT.connections.find(x => x.id === cid); return !!c && c.lines.includes(l); };

// what the canvas should total: a play's products (or the products put on Create your own play), at a size and rate
// audit fix (Oct 31): a line can need one of several products (needs_any), and specialized Coworker Skills on a
// connection replace the generic Skills package (CW03) unless the partner keeps it
const SPECIAL = ['CW-CJA', 'CW-AEM', 'CW-FSI', 'AXD11', 'XA25', 'XA26', 'XA27'];
function expected(playId, size = 'base', rate = 150, ls = {}, onIds = null, keep = {}) {
  const pl = PL[playId], on = new Set(onIds || [...pl.products, ...(pl.ostart || [])]), extra = pl.on || [];   // step 45: a play starts with its ostart systems (the CDN)
  const owners = [...CAT.products.filter(p => on.has(p.id)), ...CAT.connections.filter(c => on.has(c.a) && on.has(c.b))];
  let one = 0, mon = 0;
  const add = l => (CAT.lines[l].unit === 'monthly' ? (mon += CAT.lines[l][size] * rate) : (one += CAT.lines[l][size] * rate));
  const need = l => (CAT.lines[l].needs || []).every(x => on.has(x)) && (!(CAT.lines[l].needs_any || []).length || CAT.lines[l].needs_any.some(x => on.has(x)));
  const counted = [];
  for (const o of owners) {
    for (const l of o.lines) if ((l in ls ? ls[l] : !(pl.off || []).includes(l)) && need(l)) counted.push(l);   // a play can start a line off (step 18)
    for (const l of o.more) if ((l in ls ? ls[l] : extra.includes(l)) && need(l)) counted.push(l);
  }
  const special = counted.some(l => SPECIAL.includes(l));
  for (const l of counted) if (!(l === 'CW03' && special && !keep.CW03)) add(l);
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
  // the canvas starts with no rate (audit fix): the tests enter $150 when a play is chosen on a fresh canvas
  const choose = async (p, id) => { await p.click(`#picker [data-play="${id}"]`); await p.waitForTimeout(600);
    if (!(await p.inputValue('#rate'))) { await p.fill('#rate', '150'); await p.waitForTimeout(100); } };
  const addP = async (p, id) => { if (await p.isHidden('#add-menu')) await p.click('#add-btn');
    if (await p.$(`#add-menu details.nocon [data-add="${id}"]`) && !(await p.$eval('#add-menu details.nocon', d => d.open))) await p.click('#add-menu details.nocon summary');
    await p.click(`#add-menu [data-add="${id}"]`); await p.waitForTimeout(350); };
  const outside = async p => { await p.mouse.click(40, 938); await p.waitForTimeout(250); };   // the empty strip by the hint, clear of the menu and Save
  const away = async p => { await p.mouse.move(1595, 945); await p.waitForTimeout(450); };
  // every i can be clicked (nothing covers it) and none sits on another connection's line
  const tidy = async p => p.evaluate(() => {
    const dots = [...document.querySelectorAll('.ib')].map(b => { const r = b.getBoundingClientRect(); return {id: b.dataset.c, x: r.left + r.width / 2, y: r.top + r.height / 2, el: b}; });
    const covered = dots.filter(d => { const h = document.elementFromPoint(d.x, d.y); return !h || h.closest('.ib') !== d.el; }).map(d => d.id);   // step 42: the pill holds a bolt and a word
    const paths = [...document.querySelectorAll('.edge')].map(e => { const L = e.getTotalLength(), m = e.getScreenCTM(), pts = [];
      for (let s = 0; s <= L; s += 2) { const q = e.getPointAtLength(s); pts.push([m.a * q.x + m.c * q.y + m.e, m.b * q.x + m.d * q.y + m.f]); } return {id: e.dataset.c, pts}; });
    const onLine = dots.filter(d => paths.some(pa => pa.id !== d.id && pa.pts.some(([x, y]) => Math.hypot(x - d.x, y - d.y) < 4))).map(d => d.id);
    return {covered, onLine, n: dots.length};
  });
  // every part of the focus bar sits inside the bar and on screen, and no product box sits under the bar
  const barInside = async (p, w) => p.evaluate(w => {
    const bar = document.getElementById('fbar').getBoundingClientRect(), out = [];
    // step 47: on a phone the names scroll sideways in one row, so the row itself must sit inside the bar
    const fm = document.getElementById('fb-m'), rolls = getComputedStyle(fm).overflowX === 'auto' && fm.scrollWidth > fm.clientWidth;
    const parts = [document.querySelector('#fbar .fi'), document.querySelector('#fbar .fl'), ...(rolls ? [fm] : document.querySelectorAll('#fb-m > *')), document.getElementById('fb-svc'), document.getElementById('fb-clear')].filter(e => e && !e.hidden);
    for (const e of parts) { const r = e.getBoundingClientRect(); if (r.left < bar.left - 1 || r.right > bar.right + 1 || r.top < bar.top - 1 || r.bottom > bar.bottom + 1 || r.left < 0 || r.right > w) out.push((e.className || e.id || e.textContent).toString().slice(0, 24)); }
    const under = [...document.querySelectorAll('.node')].filter(n => { const r = n.getBoundingClientRect(); return r.top < bar.bottom && r.bottom > bar.top; }).map(n => n.dataset.p);
    return {out, under, h: Math.round(bar.height)};
  }, w);
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
  // the boxes before a play is picked (Adam, Nov 1): only the masthead (the Adobe logo and the title, under the red stripe)
  // sits above the picker heading, the boxes start right under it, and the old Choose a play menu is gone from the page
  const onlyMasthead = async p => p.evaluate(() => {
    const top = document.querySelector('#picker h2').getBoundingClientRect().top, mast = document.querySelector('.masthead');
    const shown = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
    const other = [...document.querySelectorAll('body *')].filter(e => shown(e) && e.getBoundingClientRect().bottom <= top + 0.5 && !e.closest('.masthead,.topline')).map(e => e.id || e.getAttribute('class') || e.tagName);
    const kids = [...mast.children].filter(shown), cs = getComputedStyle(mast);
    const r = {picker: shown(document.getElementById('picker')), other, mast: kids.map(e => e.alt || e.textContent.trim()).filter(Boolean).join('|'),
      flush: Math.abs(document.getElementById('canvas').getBoundingClientRect().top - mast.getBoundingClientRect().bottom) < 1,
      oneRow: mast.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) <= Math.max(...kids.map(e => e.getBoundingClientRect().height)) + 1,
      menu: ['play-btn', 'play-menu', 'choose'].filter(id => document.getElementById(id))};
    r.ok = r.picker && !r.other.length && ['Adobe|Partner services statement of work|Open draft', 'Adobe|Partner services statement of work'].includes(r.mast) && (innerWidth <= 520) === !r.mast.includes('Open draft') && r.flush;   // step 43 (Adam: keep Open draft on the picker; phones wait for a play)
    return r;
  });

  // 1. the four Brand Visibility plays and the two solo plays match the live tool at $150, Typical
  ok(CAT.plays.length === 7 && FIXED.map(p => p.id).join() === LIVE_PLAYS.join() && CUSTOM && CUSTOM.id === 'custom',
    `seven plays: the six from the live tool, then Create your own play (${CAT.plays.map(p => p.id).join(', ')})`);
  ok(CUSTOM.products.every(id => P[id] && !P[id].outside) && CAT.products.filter(p => !p.outside).length === N && OCT30.every(id => CUSTOM.products.includes(id)),
    `Create your own play offers ${N} products, the 12 researched on Oct 30 among them (${CUSTOM.products.join(', ')})`);
  for (const id of LIVE_PLAYS) {
    const play = PL[id];
    const live = await fresh();
    await live.goto(LIVE); await live.evaluate(x => { state.play = x; go('scope'); }, id); await live.click('[data-step="services"]');
    await live.fill('#service-rate', '150'); await live.waitForTimeout(150);
    const ls = await live.$$eval('.total-card strong', e => e.map(x => x.textContent.trim()));
    const p = await fresh(); await p.goto(CANVAS); await choose(p, id);
    const t = await read(p);
    const liveSub = `${ls[0]} one-time + ${ls[1].replace(' a month', '')} a month for 12 months`;
    ok(t.big === ls[2] && t.sub === liveSub, `${play.label}: the canvas total matches the live tool (${ls[2]}, ${ls[0]} one-time + ${ls[1]})`, `${t.big} / ${t.sub}`);
    await p.context().close(); await live.context().close();
  }

  // 2. the picker
  const p = await fresh(); await p.goto(CANVAS); await p.waitForTimeout(300);
  ok(await p.inputValue('#rate') === '' && (await read(p)).big === '$ ___' && (await read(p)).sub === 'Enter your approved rate to see illustrative fees.',
    'a fresh canvas has no rate: the partner enters an approved rate (audit fix)', JSON.stringify(await read(p)));
  ok((await p.textContent('.total .k')).trim() === 'Illustrative fees: implementation + 12-month term' && (await p.textContent('.toolbar')).includes('Delivery size') && !(await p.textContent('.toolbar')).includes('year one'),
    'the total reads Illustrative fees: implementation + 12-month term, beside Delivery size', (await p.textContent('.total .k')).trim());
  ok(await p.isVisible('#picker') && (await nodes(p)).length === 0, 'opens on the play picker, with nothing on the canvas');
  ok((await p.$$('#picker .pc-card')).length === 7, 'the picker shows seven cards');
  const secs0 = await p.$$eval('#picker .sh', x => x.map(y => y.textContent.trim()));
  ok(secs0.join('|') === 'Brand Visibility plays|Sell on its own|Build your own', 'in three groups: Brand Visibility plays, Sell on its own, Build your own', secs0.join('|'));
  ok((await p.textContent('#picker [data-play="custom"]')).includes('Create your own play') && (await p.textContent('#picker [data-play="custom"] .cchip')).trim() === `${N} products to choose from`,
    `the last card is Create your own play, with ${N} products to choose from`);
  ok((await p.textContent('#picker')).includes('One play per statement of work. To quote a second play, start a second SOW.'), 'the picker says one play per statement of work');
  const chips = await p.$$eval('#picker .pc-card:not([data-play="custom"])', cs => cs.map(c => c.querySelectorAll('.chips span').length));
  ok(chips.every((n, i) => n === FIXED[i].products.length), 'each play card shows a chip for each of its products');
  ok(await p.isHidden('.tabs') && await p.isHidden('.toolbar') && await p.isHidden('#start-over') && await p.isHidden('#change-play') && await p.isHidden('#save') && await p.isHidden('#addwrap'),
    'the steps, the toolbar and Start over wait for a play; so do Change play, Add product and Save');
  ok(fs.readFileSync(path.join(HERE, 'index.html'), 'utf8').includes('<body class="picking">'), 'the page starts on the boxes, so a slow first load never shows the steps, the toolbar or Start over');
  const om0 = await onlyMasthead(p);
  ok(om0.ok, 'only the masthead sits above the boxes: the Adobe logo, Partner services statement of work and Open draft', JSON.stringify(om0));
  ok(!om0.menu.length && (await p.$$eval('#picker [data-play]', x => x.map(y => y.dataset.play))).sort().join() === CAT.plays.map(q => q.id).sort().join(),
    'no Choose a play menu: each of the seven plays is picked from its box', om0.menu.join());

  // 3. a fixed play, chosen from its box
  await p.click('#picker [data-play="aem"]'); await p.waitForTimeout(600); await p.fill('#rate', '150'); await p.waitForTimeout(100);
  ok(await p.isHidden('#picker') && JSON.stringify(await nodes(p)) === JSON.stringify(['bv', 'cdn', 'eds', 'so']), 'picking a play\'s box puts its products on the canvas, and the CDN (step 45: on from the start)', (await nodes(p)).join(','));
  ok(JSON.stringify(await edges(p)) === JSON.stringify(['bv-eds', 'cdn-bv', 'so-eds']) && (await p.$$('.ib')).length === 3, 'they connect themselves, a lightning bolt on each connection', (await edges(p)).join(','));
  ok((await p.textContent('#play-label')).trim() === PL.aem.label && await p.isVisible('#change-play') && !(await p.$('#play-btn, #play-menu, #choose')) && await p.isHidden('#addwrap'),
    'the toolbar shows the play name and Change play, and no Add product (a play\'s products are fixed)');
  ok((await Promise.all(['build', 'scope', 'services', 'sow'].map(k => p.isVisible(`.tabs [data-tab="${k}"]`)))).every(Boolean) && await p.isVisible('#rate') && await p.isVisible('#size') && await p.isVisible('#t-big') && await p.isVisible('#start-over'),
    'with a play picked, the steps, Your rate, Delivery size, the total and Start over show');
  ok(await p.isHidden('#fbar'), 'a small play draws every line, with no focus bar');
  let t = await read(p), e = expected('aem');
  ok(t.big === money(e.yr), 'the total adds every product and connection in the play', `${t.big} vs ${money(e.yr)}`);
  // step 42: each box shows its name and how many of its services are on, no money
  const nodeText = await p.$$eval('.node', es => es.map(x => x.textContent.trim())), adobeText = await p.$$eval('.node:not(.out)', es => es.map(x => x.textContent.trim()));
  ok(nodeText.every(x => !/\$/.test(x)) && adobeText.every(x => /\d+ services?$|Services on its connections$/.test(x)) && nodeText.includes('CDNRecommended'), 'the canvas shows product names and their service counts, no money', nodeText.join(' | '));
  ok(await p.isHidden('#card'), 'no card until you click');

  // 4. click a product (hovering opens nothing), X a line, check it back
  await p.hover('.node[data-p="eds"]'); await p.waitForTimeout(400);
  ok(await p.isHidden('#card'), 'S42: hovering a product opens nothing');
  await p.click('.node[data-p="eds"]'); await p.waitForTimeout(250);
  ok(await p.isVisible('#card') && (await p.textContent('#card h4')).includes('Edge Delivery Services'), 'clicking a product opens its services card');
  const rows = await p.$$eval('#card .ln', r => r.map(x => x.dataset.l));
  ok(JSON.stringify(rows) === JSON.stringify(P.eds.lines), 'the card lists the product\'s services', rows.join(','));
  const srcs = await p.$$eval('#card .ln .src', a => a.map(x => x.href));
  ok(srcs.length === rows.length && srcs.every(h => h.startsWith('http')), 'every line in the card has a source link');
  ok((await p.$$('#card [data-rm]')).length === 0, 'a fixed play\'s card has no Remove from canvas');
  await p.click('#card [data-t="A03"]'); await p.waitForTimeout(150);
  t = await read(p); e = expected('aem', 'base', 150, {A03: false});
  ok(t.big === money(e.yr) && (await p.textContent('#card .ln[data-l="A03"] .fee')).trim() === 'Removed', 'X on a line takes it out: the card says Removed and the total drops', t.big);
  ok((await p.textContent('.node[data-p="eds"] .cnt')) === '4 services', 'S42: the box count follows the X', await p.textContent('.node[data-p="eds"] .cnt'));
  await p.mouse.move(5, 300); await p.waitForTimeout(500);
  ok(await p.isVisible('#card'), 'S42: the card stays open when the pointer moves away');
  ok((await p.textContent('#card .ft')).includes('4 of 5 services'), 'the card footer counts what is left', await p.textContent('#card .ft'));
  await p.click('#card [data-t="A03"]'); await p.waitForTimeout(150);
  t = await read(p); e = expected('aem');
  ok(t.big === money(e.yr), 'the check brings it back');
  await p.click('#card [data-t="A03"]'); await p.waitForTimeout(100);   // leave it out for the size test

  // 5. click an Integrate pill (hovering opens nothing)
  await p.click('#card [data-close]'); await p.waitForTimeout(100);
  ok(await p.isHidden('#card'), 'S42: the card X closes it');
  ok((await p.textContent('.ib[data-c="bv-eds"]')).trim() === '' && !!(await p.$('.ib[data-c="bv-eds"] svg')), 'S44: each connection shows the lightning bolt alone (Adam: the Integrate pill was too long)');
  const mids = await p.evaluate(() => [...document.querySelectorAll('.ib')].map(b => { const e = document.querySelector(`.edge[data-c="${b.dataset.c}"]`), q = e.getPointAtLength(e.getTotalLength() / 2), r = b.getBoundingClientRect(), m = e.getScreenCTM();
    return Math.round(Math.hypot(r.left + r.width / 2 - (m.a * q.x + m.c * q.y + m.e), r.top + r.height / 2 - (m.b * q.x + m.d * q.y + m.f))); }));
  ok(mids.every(d => d <= 2), 'S44: every bolt sits in the middle of its line', mids.join(','));
  await p.hover('.ib[data-c="bv-eds"]'); await p.waitForTimeout(400);
  ok(await p.isHidden('#card'), 'S42: hovering Integrate opens nothing');
  await p.click('.ib[data-c="bv-eds"]'); await p.waitForTimeout(250);
  ok(await p.isVisible('#card') && (await p.textContent('#card .k')).includes('Connection'), 'clicking Integrate opens the connection card');
  const secs = await p.$$eval('#card .sec', x => x.map(y => y.textContent.trim().toLowerCase()));
  ok(secs.join('|') === 'before it works|what you get together|how it connects|services on this connection', 'the card says what it needs, what you get together, how it connects, then the services', secs.join('|'));
  const flowSrc = await p.$$eval('#card .flow', fs => fs.map(f => !!f.querySelector('.src[href^="http"]')));
  ok(flowSrc.length >= 1 && flowSrc.every(Boolean), 'every data flow has its source');
  ok(await p.$eval('.edge[data-c="bv-eds"]', x => x.classList.contains('hot')), 'the open connection lights up red');
  ok(await p.$eval('.edge[data-c="bv-eds"]', x => x.getAttribute('marker-end') || x.getAttribute('marker-start')) !== null, 'an arrow on the line shows which way the data goes');
  await p.click('.node[data-p="so"]'); await p.waitForTimeout(250);
  ok((await p.textContent('#card h4')).includes('Sites Optimizer'), 'S42: a click on another box swaps to its card');
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  ok(await p.isHidden('#card'), 'S42: Escape closes the card');
  ok((await p.textContent('#hint')).trim() === 'Click a lightning bolt to see how the two products integrate.' && !!(await p.$('#hint .hb svg')), 'S44: the line at the bottom is the bolt and "Click a lightning bolt to see how the two products integrate." and nothing else', await p.textContent('#hint'));

  // 6. optional services
  await p.click('.node[data-p="bv"]'); await p.waitForTimeout(200);
  await p.click('#card details.more summary'); await p.waitForTimeout(150);
  ok((await p.textContent('#card details.more .ln[data-l="O04"] .fee')).trim().startsWith('+$'), 'optional lines show what they would add (+$), not counted yet');
  await p.click('#card [data-t="O04"]'); await p.waitForTimeout(150);
  t = await read(p); e = expected('aem', 'base', 150, {A03: false, O04: true});
  ok(t.big === money(e.yr), 'More services adds an optional line, and the total rises', t.big);
  await p.click('#card [data-t="O04"]'); await p.waitForTimeout(100);
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
  ok((await nodes(p)).length === 4 && await p.isHidden('#confirm'), 'Cancel keeps the play as it was');
  await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(400);
  ok(await p.isVisible('#picker') && (await nodes(p)).length === 0, 'Choose another play clears the canvas and opens the picker');
  const om1 = await onlyMasthead(p);
  ok(om1.ok && !om1.menu.length && await p.isHidden('.tabs') && await p.isHidden('.toolbar') && await p.isHidden('#start-over'),
    'back on the boxes, only the masthead sits above them again: no steps, toolbar or Start over', JSON.stringify(om1));
  ok(await p.inputValue('#rate') === '175' && await p.$eval('#size [data-size="large"]', x => x.classList.contains('on')), 'the rate and size stay');
  await choose(p, 'aem');
  ok(await p.isVisible('#rate') && await p.inputValue('#rate') === '175' && await p.isVisible('#size') && await p.$eval('#size [data-size="large"]', x => x.classList.contains('on')),
    'the next play shows the same rate and size ($175, Large)');
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
    const start = [...pl.products, ...(pl.ostart || [])], want = CAT.connections.filter(c => start.includes(c.a) && start.includes(c.b)).map(c => c.id).sort();   // step 45: the CDN starts on
    const tq = await read(q), eq = expected(pl.id);
    ok(JSON.stringify(await nodes(q)) === JSON.stringify([...start].sort()) && JSON.stringify(await edges(q)) === JSON.stringify(want) && tq.big === money(eq.yr) && await layoutClean(q),
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
  await p.keyboard.press('Escape'); await p.waitForTimeout(150);
  await p.click('#empty-add'); await p.waitForTimeout(250);
  ok(await p.isVisible('#add-menu'), 'the empty canvas\'s own Add product button opens the menu with a real click');
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
  ok(t.big === money(e.yr) && t.big === money(expected('cja', 'base', 150, {}, ['bv', 'cja']).yr), `Brand Visibility and CJA built by hand total the same as the CJA play without its CDN (${t.big})`, `${t.big}`);
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

  // 10c. small builds of your own keep every line, packed close, with every i clear of the other lines
  for (const set of [['bv', 'bc'], ['target', 'cja', 'marketo', 'commerce', 'eds'], ['rtcdp', 'ajo', 'marketo', 'workfront', 'cw'], ['aemassets', 'workfront', 'aemsites', 'cja']]) {
    const q = await fresh(); await q.goto(CANVAS); await choose(q, 'custom');
    for (const id of set) await addP(q, id);
    await outside(q); await away(q);
    const td = await tidy(q), clean = await layoutClean(q), names = set.map(id => P[id].short || P[id].name).join(', ');
    ok(await q.isHidden('#fbar') && clean && td.covered.length === 0 && td.onLine.length === 0,
      `${names}: every line drawn, ${td.n} i dot${td.n === 1 ? '' : 's'}, none covered or sitting on another line, a clean layout`, JSON.stringify(td));
    if (set.length === 2) ok(JSON.stringify(await q.evaluate(() => [pos('bv'), pos('bc')])) === '[[0,1],[1,0]]', 'two products far apart on the grid are packed side by side');
    await q.context().close();
  }

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
  ok((await p.textContent('#card .ln.lock')).includes('Needs Real-Time CDP or Journey Optimizer on the canvas') && (await p.$$('#card .ln.lock [data-addp="rtcdp"]')).length === 1,
    'Target and CJA: a line that needs Real-Time CDP or Journey Optimizer says so, with an Add button');
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
  const all = CUSTOM.products, nAll = ADOBE_C.length;
  ok((await nodes(p)).length === N && await p.isVisible('#fbar') && (await edges(p)).length === 0, `all ${N} on: the canvas goes calm, no lines at rest (${nAll} connections)`);
  ok((await p.textContent('#fbar')).includes(`${nAll} connections`) && (await p.textContent('#fbar')).includes(`The total includes the services on all ${nAll}`), 'the bar says how many connections there are and that the total counts them all');
  const counts = await p.$$eval('.node', ns => ns.map(n => [n.dataset.p, (n.querySelector('.cn') || {}).textContent]));
  ok(counts.every(([id, c]) => c === `${ADOBE_C.filter(x => x.a === id || x.b === id).length} connection${ADOBE_C.filter(x => x.a === id || x.b === id).length === 1 ? '' : 's'}`), 'every box says how many connections it has');
  t = await read(p); e = expected('custom', 'base', 150, {C06: false}, all);
  ok(t.big === money(e.yr), 'the total still counts every connection\'s services', `${t.big} vs ${money(e.yr)}`);
  await p.click('.node[data-p="cja"]'); await away(p);
  const cjaLinks = ADOBE_C.filter(c => c.a === 'cja' || c.b === 'cja').map(c => c.id).sort();
  ok(JSON.stringify(await edges(p)) === JSON.stringify(cjaLinks) && (await p.$$('.ib')).length === cjaLinks.length, `clicking CJA draws just its ${cjaLinks.length} lines, each with its i`);
  ok((await p.textContent('#fbar')).includes('connects to') && await p.isVisible('#fb-clear'), 'the bar names what CJA connects to, with Clear');
  await p.click('#fb-clear'); await away(p);
  ok((await edges(p)).length === 0 && await p.isHidden('#fb-clear'), 'Clear goes back to the calm canvas');
  let clean = true, bad = [];
  for (const id of all) { await p.click(`.node[data-p="${id}"]`); await away(p);
    const n = (await edges(p)).length, want = ADOBE_C.filter(c => c.a === id || c.b === id).length;
    if (n !== want || !(await layoutClean(p))) { clean = false; bad.push(id); }
    await p.click('#fb-clear'); await p.waitForTimeout(100); }
  ok(clean, 'every product\'s lines draw in full, with no i on a box, the i dots apart and everything on screen', bad.join(','));
  const nsv = CAT.connections.filter(c => c.no_services && all.includes(c.a) && all.includes(c.b));
  ok(nsv.length > 0 && nsv.every(c => !c.lines.length && !c.more.length && c.how && c.source && c.source.url), `${nsv.length} connection(s) Adobe documents without services keep a source and no lines`);
  await p.click(`.node[data-p="${nsv[0].a}"]`); await away(p);
  await p.click(`.ib[data-c="${nsv[0].id}"]`); await p.waitForTimeout(300);
  ok((await p.textContent('#card')).includes('does not explicitly list any services for this connection. You can add your own services on the Services tab'), `the i on ${P[nsv[0].a].name} + ${P[nsv[0].b].name} points to the Services tab`);
  await p.click('#card [data-close]'); await p.click('#fb-clear'); await p.waitForTimeout(150);

  // 13b. in focus view the first click on a product draws its lines; the second opens its card, which covers neither the box nor its
  // lightning bolts, and stays while the pointer travels to it (step 47)
  { const q = await fresh(); await q.goto(CANVAS); await choose(q, 'custom');
    for (const id of CUSTOM.products) await q.evaluate(i => addProduct(i), id);
    await q.keyboard.press('Escape'); await away(q);
    for (const id of ['rtcdp', 'bc', 'workfront']) {
      await q.click(`.node[data-p="${id}"]`); await q.waitForTimeout(500); const first = await q.isHidden('#card');
      await q.click(`.node[data-p="${id}"]`); await q.waitForTimeout(500);
      const cover = await q.evaluate(id => { const c = document.getElementById('card').getBoundingClientRect(), hit = r => r.left < c.right && c.left < r.right && r.top < c.bottom && c.top < r.bottom;
        return [document.querySelector(`.node[data-p="${id}"]`), ...document.querySelectorAll('.ib')].filter(e => hit(e.getBoundingClientRect())).length; }, id);
      const rm = await q.$eval('#card [data-rm]', b => { b.scrollIntoView({block: 'nearest'}); const r = b.getBoundingClientRect(); return {x: r.left + r.width / 2, y: r.top + r.height / 2}; });
      await q.mouse.move(rm.x, rm.y, {steps: 30}); await q.waitForTimeout(400);
      ok(first && cover === 0 && await q.isVisible('#card') && (await q.textContent('#card h4')).includes(P[id].title || P[id].name),
        `${P[id].name}: in focus view the first click draws its lines, the second opens its card clear of the box and its bolts, and it stays open on the way to it`, `first ${first}, covers ${cover}`);
      await q.click('#card [data-close]'); await q.waitForTimeout(150); await q.click('#fb-clear'); await q.waitForTimeout(150);
    }
    await q.click('.node[data-p="rtcdp"]'); await q.waitForTimeout(300); await q.click('.node[data-p="rtcdp"]'); await q.waitForTimeout(500);
    await q.click('#card [data-rm="rtcdp"]'); await q.waitForTimeout(500);
    ok(!(await nodes(q)).includes('rtcdp') && (await nodes(q)).length === N - 1, 'Remove from canvas works in focus view');
    await q.context().close(); }
  { const q = await fresh(); await q.goto(CANVAS); await choose(q, 'custom');
    // audit fix: CJA audiences reach Target through Real-Time CDP or Journey Optimizer, so with Journey Optimizer on the canvas the line is open
    for (const id of ['target', 'cja', 'ajo']) await addP(q, id);
    await outside(q); await away(q);
    await q.click('.ib[data-c="target-cja"]'); await q.waitForTimeout(300);
    ok((await q.$$('#card .ln.lock')).length === 0 && (await q.$$('#card .ln[data-l="TC04"]')).length === 1 && (await read(q)).big === money(expected('custom', 'base', 150, {}, ['target', 'cja', 'ajo']).yr),
      'with Journey Optimizer on the canvas, CJA audiences for Target need no Real-Time CDP (either one carries the Target destination)');
    await q.click('#card [data-close]'); await q.waitForTimeout(150);
    await q.context().close(); }
  { const q = await fresh(); await q.goto(CANVAS); await choose(q, 'custom');
    for (const id of ['target', 'cja', 'cw', 'marketo']) await addP(q, id);
    await outside(q); await away(q);
    const before = (await edges(q)).length;
    await q.click('.ib[data-c="target-cja"]'); await q.waitForTimeout(300);
    await q.click('#card [data-addp="rtcdp"]'); await q.waitForTimeout(800);
    ok(before < 10 && await q.isVisible('#fbar') && await q.isVisible('#card') && (await q.textContent('#card h4')).includes('Target') && (await edges(q)).includes('target-cja'),
      `adding Real-Time CDP from a card tips the canvas into focus view (${before} connections before) and keeps the card and its line`);
    await q.click('#card [data-close]'); await q.waitForTimeout(200); await away(q);
    await q.click('.node[data-p="cja"]'); await q.waitForTimeout(400); await q.click('.node[data-p="cja"]'); await q.waitForTimeout(700);
    ok(await q.isVisible('#card') && (await q.textContent('#card h4')).includes('Customer Journey Analytics'), 'and product cards still open afterwards (a second click, step 47)');
    await q.context().close(); }

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
  const om2 = await onlyMasthead(p);
  ok(om2.ok && await p.isHidden('.tabs') && await p.isHidden('.toolbar') && await p.isHidden('#start-over'), 'and the steps, the toolbar and Start over wait for the next play', JSON.stringify(om2));
  const ph = await fresh(390, 844); await ph.goto(CANVAS);
  ok(await ph.evaluate(() => document.documentElement.scrollWidth) <= 390, 'on a phone the picker doesn\'t scroll sideways');
  await ph.waitForTimeout(300); const om3 = await onlyMasthead(ph);
  ok(om3.ok && om3.oneRow && await ph.isHidden('#start-over'), 'on a phone only the masthead sits above the boxes, on one row with no gap left for Start over', JSON.stringify(om3));
  const ph375 = await fresh(375, 812); await ph375.goto(CANVAS); await ph375.waitForTimeout(300); const om4 = await onlyMasthead(ph375);
  ok(om4.ok && om4.oneRow, 'on a 375 px phone too, the masthead is one row, with no empty row under the title', JSON.stringify(om4));
  const tab = await fresh(768, 1024); await tab.goto(CANVAS); await tab.waitForTimeout(300);
  const mh0 = await tab.$eval('.masthead', e => e.getBoundingClientRect().height); await tab.click('#picker [data-play="aem"]'); await tab.waitForTimeout(500);
  const mh1 = await tab.$eval('.masthead', e => e.getBoundingClientRect().height);
  ok(Math.abs(mh1 - mh0) < 0.5, 'on a tablet the masthead keeps its height when a play is picked', `${mh0} then ${mh1}`);
  const kb = await fresh(); await kb.goto(CANVAS); await kb.waitForTimeout(300); await kb.keyboard.press('Tab');
  const first = await kb.$eval('#picker [data-play]', e => e.dataset.play);
  // step 40: the question box sits above the play boxes, so the first Tab lands in it; Tab then walks its visible
  // button and chips to the first play box, and nothing hidden takes focus on the way
  ok(await kb.evaluate(() => document.activeElement.id) === 'open-draft', 'from the keyboard, the first Tab lands on Open draft in the top bar (step 43)');
  await kb.keyboard.press('Tab');
  ok(await kb.evaluate(() => document.activeElement.id) === 'bp-q', 'and the next in the question box above the play boxes');
  let walk = [];
  for (let i = 0; i < 12 && await kb.evaluate(() => !document.activeElement.dataset.play); i++) { await kb.keyboard.press('Tab'); walk.push(await kb.evaluate(() => { const e = document.activeElement, r = e.getBoundingClientRect(); return !!(r.width && r.height) && !e.closest('[hidden]'); })); }
  ok(await kb.evaluate(() => document.activeElement.dataset.play) === first && walk.every(Boolean), 'then Tab reaches the first play box, with nothing hidden above it taking focus', walk.length + ' stops');
  await kb.keyboard.press('Enter'); await kb.waitForTimeout(500);
  ok(await kb.isHidden('#picker') && await kb.isVisible('.tabs') && (await kb.textContent('#play-label')).trim() === (PL[first].title || PL[first].label), 'Enter on a box picks that play and brings back the steps and the toolbar');
  await choose(ph, 'aem');
  ok(await ph.evaluate(() => document.documentElement.scrollWidth) <= 390 && (await nodes(ph)).length === 4, 'on a phone a play still draws, with no sideways scroll');
  await ph.click('#change-play'); await ph.click('#confirm-yes'); await ph.waitForTimeout(300); await choose(ph, 'custom');
  ok(await ph.isHidden('#add-menu') && await ph.isVisible('#empty'), 'on a phone, Create your own play waits for a tap on Add product (the menu does not open by itself)');
  await ph.click('#empty-add'); await ph.waitForTimeout(300);
  const mr = await ph.$eval('#add-menu', m => { const r = m.getBoundingClientRect(); return {l: r.left, r: r.right}; });
  ok(await ph.isVisible('#add-menu') && mr.l >= 0 && mr.r <= 390 && await ph.evaluate(() => document.documentElement.scrollWidth) <= 390, 'the Add product menu opens fully on a phone screen, no sideways scroll', JSON.stringify(mr));
  await addP(ph, 'bv');
  ok((await nodes(ph)).includes('bv') && await ph.evaluate(() => document.documentElement.scrollWidth) <= 390, 'adding a product from the menu on a phone works, still no sideways scroll');
  for (const [w, h, pg] of [[390, 844, ph], [768, 1024, null], [1024, 768, null]]) {
    const q = pg || await fresh(w, h);
    if (!pg) { await q.goto(CANVAS); await choose(q, 'custom'); }
    for (const id of CUSTOM.products) await q.evaluate(i => addProduct(i), id);
    await q.keyboard.press('Escape'); await q.mouse.move(2, 2); await q.waitForTimeout(500);
    // the harness adds products under a resting pointer, which can leave a hover card open: close it as a partner would
    if (await q.isVisible('#card')) { await q.click('#card [data-close]'); await q.waitForTimeout(200); }
    await q.click('.node[data-p="cja"]'); await q.waitForTimeout(600);
    const bi = await barInside(q, w);
    ok(bi.out.length === 0 && bi.under.length === 0 && await q.evaluate(() => document.documentElement.scrollWidth) <= w,
      `at ${w} wide, with all ${N} on and CJA picked, every part of the focus bar sits inside it (${bi.h} px tall) and no box sits under it`, JSON.stringify(bi));
  }

  // 16. audit fix (Oct 31): every connection says what it is; partner workflows draw dashed; specialized Skills replace generic ones
  { const KINDS = ['native', 'platform', 'extension', 'partner'];
    ok(ADOBE_C.every(c => KINDS.includes(c.kind) && c.label && c.availability && Array.isArray(c.prereqs)),
      `every connection is typed, with availability and prerequisites (${KINDS.map(k => k + ' ' + CAT.connections.filter(c => c.kind === k).length).join(', ')})`,
      ADOBE_C.filter(c => !KINDS.includes(c.kind)).map(c => c.id).join(','));
    const OUTC = CAT.connections.filter(c => !ADOBE_C.includes(c));
    ok(OUTC.length === 16 && OUTC.every(c => c.kind === 'outside' && ['native', 'platform'].includes(c.line) && c.label && c.prereqs.length >= (['cdn-bv', 'dwh-cja', 'cstore-cja', 'crm-cja'].includes(c.id) ? 3 : 1) && c.source && c.source.url && c.how),
      `steps 27 and 45: each outside system's connection is typed Outside system, with its line style, how it connects, prerequisites and source (${OUTC.map(c => c.id + ' ' + c.line).join(', ')})`);
    const q = await fresh(); await q.goto(CANVAS); await choose(q, 'fsi');
    ok(await q.$eval('.edge[data-c="bv-bc"]', e => e.classList.contains('pw')) && (await q.textContent('#t-legend')).includes('dashed partner-designed workflow'),
      'Brand Visibility + Brand Concierge draws dashed, and the legend (shown on phones, under the total) says what each line style means');
    await q.click('.ib[data-c="bv-bc"]'); await q.waitForTimeout(300);
    const kind = (await q.textContent('#card .kind')).trim();
    ok(kind.startsWith('Partner-designed workflow') && kind.includes('no native connector assumed') && (await q.textContent('#card')).includes('How it connects'),
      'its card says Partner-designed workflow, no native connector assumed, under How it connects', kind.slice(0, 90));
    const ib = await q.$eval('.ib[data-c="bv-bc"]', e => { const r = e.getBoundingClientRect(); return {x: r.left + r.width / 2, y: r.top + r.height / 2}; });
    ok(await q.evaluate(({x, y}) => !!document.elementFromPoint(x, y).closest('.ib'), ib), 'the card opens beside its i, not on top of it');
    await q.click('#card [data-close]'); await q.click('#change-play'); await q.click('#confirm-yes'); await q.waitForTimeout(300);
    await choose(q, 'custom');
    for (const id of ['rtcdp', 'bc', 'cw', 'cja']) await addP(q, id);
    await outside(q); await away(q);
    if (await q.isVisible('#card')) await q.click('#card [data-close]');
    ok(await q.$eval('.edge[data-c="rtcdp-bc"]', e => e.classList.contains('pf')) && await q.$eval('.edge[data-c="cw-cja"]', e => !e.classList.contains('pf') && !e.classList.contains('pw') && !e.classList.contains('ex')),
      'shared-platform paths draw dotted and native integrations solid', await q.$eval('.edge[data-c="rtcdp-bc"]', e => e.getAttribute('class')));
    await q.click('.ib[data-c="rtcdp-bc"]'); await q.waitForTimeout(300);
    ok((await q.textContent('#card .avail')).includes('enable the integration for your client') && (await q.textContent('#card')).includes('anonymous visitors'),   // Nov 8: partner voice on the card
      'Real-Time CDP + Brand Concierge shows confirmed tenant enablement and the anonymous baseline on the card');
    await q.click('#card [data-close]'); await q.waitForTimeout(150);
    let t = await read(q), e = expected('custom', 'base', 150, {}, ['rtcdp', 'bc', 'cw', 'cja']);
    ok(t.big === money(e.yr), `with Coworker Skills for CJA on the canvas, the generic Skills package is not counted (${t.big})`, `${t.big} vs ${money(e.yr)}`);
    await q.click('.node[data-p="cw"]'); await q.waitForTimeout(300);
    ok(await q.$eval('#card .ln[data-l="CW03"]', r => r.classList.contains('rp') && r.textContent.includes('Replaced by the specialized Skills')), 'its line says Replaced by the specialized Skills');
    await q.click('#card [data-keep="CW03"]'); await q.waitForTimeout(200);
    t = await read(q); e = expected('custom', 'base', 150, {}, ['rtcdp', 'bc', 'cw', 'cja'], {CW03: true});
    ok(t.big === money(e.yr) && !(await q.$eval('#card .ln[data-l="CW03"]', r => r.classList.contains('rp'))), 'one click keeps it for distinct Skills, and the total adds it', t.big);
    await q.click('#card [data-close]'); await q.waitForTimeout(150);
    await q.click('.node[data-p="rtcdp"]'); await q.waitForTimeout(300);
    const cpt = await q.$$eval('#card .ln .cpt', x => x.length), lines = await q.$$eval('#card .ln', x => x.length);
    ok(cpt > 0 && cpt === lines - await q.$$eval('#card .ln.lock', x => x.length), `lines from Adobe documentation research carry a Concept tag (${cpt})`);
    // completeness critic (Oct 31): links say Capability reference; the term entered in the SOW steps sets the canvas total; on a phone the legend shows under the total
    ok(!(await q.content()).includes('="Source: ') && (await q.$$('#card a.src[title^="Capability reference: "]')).length > 0, 'every link on the canvas says Capability reference, not Source');
    await q.evaluate(() => { const s = JSON.parse(localStorage.getItem('abv-sow-build-v1')); s.months = 6; localStorage.setItem('abv-sow-build-v1', JSON.stringify(s)); });
    await q.reload(); await q.waitForTimeout(600);
    if (await q.isVisible('#card')) await q.click('#card [data-close]');
    t = await read(q); e = expected('custom', 'base', 150, {}, ['rtcdp', 'bc', 'cw', 'cja'], {CW03: true});
    ok((await q.textContent('#t-k')).trim() === 'Illustrative fees: implementation + 6-month term' && t.sub.endsWith('a month for 6 months') && t.big === money(e.one + 6 * e.mon),
      `a 6-month term entered in the SOW steps sets the canvas total and its label (${t.big})`, `${(await q.textContent('#t-k')).trim()} | ${t.big} vs ${money(e.one + 6 * e.mon)}`);
    ok(await q.isHidden('#t-legend'), 'on a wide screen the legend stays in the hint, not under the total');
    await q.context().close();
    const pq = await fresh(768, 1024); await pq.goto(CANVAS); await choose(pq, 'fsi');
    const lg = (await pq.textContent('#t-legend')).trim();
    ok(await pq.isVisible('#t-legend') && lg.startsWith('Lines:') && lg.includes('dashed partner-designed workflow') && await pq.evaluate(() => document.documentElement.scrollWidth) <= 768,
      'on a tablet, where the hint is hidden, the line-style legend shows under the total (step 47: a phone shows the one-line total)', lg);
    await pq.context().close(); }

  // after a reload, the products sit where a fresh layout puts them, not 25 to 30 px low until the next resize (Adam, Nov 1)
  { const q = await fresh(1600, 950); await q.goto(CANVAS); await choose(q, 'aem'); await q.reload(); await q.waitForTimeout(900);
    const at = async () => q.$$eval('.node', ns => ns.map(n => { const r = n.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top)]; }));
    const a = await at(); await q.evaluate(() => fit()); await q.waitForTimeout(700); const c = await at();
    ok(a.length === 4 && JSON.stringify(a) === JSON.stringify(c), 'after a reload the products sit where the layout puts them, with no shift on the next resize', `${JSON.stringify(a)} then ${JSON.stringify(c)}`);
    await q.context().close(); }

  // step 44: Add outside system on Create your own play
  { const q = await fresh(); await q.goto(CANVAS); await q.evaluate(() => localStorage.setItem('abv-sow-build-v1', JSON.stringify({v: 2, rate: 150, play: 'custom', on: ['cja']}))); await q.reload(); await q.waitForTimeout(800);
    ok(await q.isVisible('#out-btn'), 'S44: Create your own play has Add outside system');
    await q.click('#out-btn'); await q.waitForTimeout(200);
    const items = await q.$$eval('#out-menu .it2', es => es.map(e => ({id: e.dataset.out || null, wait: e.disabled, t: e.querySelector('.ctag').textContent})));
    ok(items.length === 9 && ['dwh', 'cstore', 'crm', 'ads', 'bi'].every(id => items.some(x => x.id === id && /Connects to CJA/.test(x.t))) && items.some(x => x.wait && /Connects to Brand Visibility: add it first/.test(x.t)),
      'S44: its menu offers the data warehouse, cloud storage, CRM, ad platforms and BI tools for CJA (step 45), and says the CDN needs Brand Visibility first', JSON.stringify(items));
    const t0 = await q.textContent('#t-big'); await q.click('#out-menu [data-out="crm"]'); await q.waitForTimeout(500);
    ok((await nodes(q)).includes('crm') && (await edges(q)).includes('crm-cja') && (await q.textContent('#t-big')) !== t0, 'S44: adding the CRM puts its box beside CJA, connected, with its services in the total', (await edges(q)).join(','));
    ok(await layoutClean(q), 'S44: and the canvas stays clean');
    await q.context().close(); }

  ok(errs.length === 0, 'no script errors', errs.join(' | ').slice(0, 300));
  await b.close();
  console.log(fails ? `${fails} CHECK(S) FAILED` : 'ALL CANVAS CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})();
