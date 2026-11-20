// Click test for the Build canvas prototype. Run from the repo root:  node sow/canvas/test_canvas.js
// Compares the six plays with the live SOW tool (sow/index.html), then exercises the play picker, the fixed plays and
// Create your own play (Add product, Remove from canvas, the full connection map) like a partner would.
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
const LIVE_PLAYS = ['abv', 'cja', 'commerce', 'aem', 'fsi', 'coworker'];
// The catalog retains two Sites delivery scopes for pricing. The picker presents one offering.
const OFFERINGS = CUSTOM.products.filter(id => id !== 'aemsites');
const N = OFFERINGS.length;
const offeringId = id => id === 'aemsites' ? 'eds' : id;
const ADOBE_C = CAT.connections.filter(c => !P[c.a].outside && !P[c.b].outside);   // step 27: outside systems join the fixed plays only
const OCT30 = ['rtcdp', 'ajo', 'target', 'cja', 'marketo', 'workfront', 'bv', 'so', 'commerce', 'eds', 'cw', 'bc'];
// Build the expected customer-facing topology independently from the catalog.
const offeringRoutes = ADOBE_C.map(c => ({id: c.id, a: offeringId(c.a), b: offeringId(c.b)})).filter(c => c.a !== c.b);
function neighbors(id) {
  const links = offeringRoutes.filter(c => c.a === id || c.b === id);
  return [...new Set(links.map(c => c.a === id ? c.b : c.a))].sort();
}
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
  const versions = {...Object.fromEntries(Object.keys(CAT.versions).map(key => [key, ''])), workfrontVersion: 'after', commerceVersion: 'saas'};
  const gated = id => Object.entries(CAT.versions).some(([key, version]) => on.has(version.product)
    && version.gates.some(gate => gate.ids.includes(id) && (!gate.when || gate.when.includes(versions[key]))
      && (!gate.only || !gate.only.includes(versions[key])) && (!gate.with || on.has(gate.with)) && !(gate.unless && on.has(gate.unless))));
  const counted = [];
  for (const o of owners) {
    if (gated(o.id)) continue;
    for (const l of [...o.lines, ...o.more]) {
      const main = o.lines.includes(l) && !(pl.off || []).includes(l);
      const promoted = CAT.serviceDefaults.on.includes(l);
      const owned = (CAT.serviceDefaults.off[playId] || []).includes(l);
      const suppressed = (l === 'CS2' && on.has('eds')) || (l === 'ACO09' && on.has('commerce') && !on.has('ocp'));
      const checked = ls[l] ?? (!owned && !suppressed && (main || promoted || extra.includes(l)));
      if (checked && need(l) && !gated(l)) counted.push(l);
    }
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
    await p.$eval(`#add-menu [data-add="${id}"]`, button => {
      for (let parent = button.parentElement; parent; parent = parent.parentElement) {
        if (parent.tagName === 'DETAILS') parent.open = true;
      }
    });   // AEM delivery choices sit inside both a product group and the Sites offering.
    await p.click(`#add-menu [data-add="${id}"]`); await p.waitForTimeout(350); };
  const outside = async p => { await p.mouse.click(40, 938); await p.waitForTimeout(250); };   // the empty strip at the canvas's foot, clear of the menu and Continue
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
  // every part of the canvas guide sits inside the bar and on screen, and no product box sits under the bar
  const barInside = async (p, w) => p.evaluate(w => {
    const bar = document.getElementById('fbar').getBoundingClientRect(), out = [];
    const parts = [...document.querySelector('#fbar').children];
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
    // step 64: the stage is drawn smaller as products are added, bolts included, so the gap is measured against the scale
    // (39 on the stage is the 28 px this check asked for at the 21 product scale of 0.72)
    const scale = await p.$eval('#stage', e => +getComputedStyle(e).getPropertyValue('--s') || 1);
    return boxes.every((a, i) => boxes.every((c, j) => i === j || !overlap(a, c))) &&
      dots.every(d => boxes.every(bx => !(d.x > bx.x - 2 && d.x < bx.x + bx.w + 2 && d.y > bx.y - 2 && d.y < bx.y + bx.h + 2))) &&
      (dots.length < 2 || minGap > 39 * scale) && boxes.every(bx => bx.x >= cv.x && bx.y >= cv.y && bx.x + bx.w <= cv.x + cv.w && bx.y + bx.h <= cv.y + cv.h);
  };
  // the boxes before a play is picked (Adam, Nov 1): only the masthead (the Adobe logo and the title, under the red stripe)
  // sits above the picker heading, the boxes start right under it, and the old Choose a play menu is gone from the page
  const onlyMasthead = async p => p.evaluate(() => {
    const top = document.querySelector('#picker .in').firstElementChild.getBoundingClientRect().top, mast = document.querySelector('.masthead');
    const shown = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
    const other = [...document.querySelectorAll('body *')].filter(e => shown(e) && e.getBoundingClientRect().bottom <= top + 0.5 && !e.closest('.masthead,.topline')).map(e => e.id || e.getAttribute('class') || e.tagName);
    const kids = [...mast.children].filter(shown), cs = getComputedStyle(mast);
    const r = {picker: shown(document.getElementById('picker')), other, mast: [...mast.querySelectorAll('img,.t,.saved,button,a')].filter(shown).map(e => e.alt || e.textContent.trim()).filter(Boolean).join('|'),
      flush: Math.abs(document.getElementById('canvas').getBoundingClientRect().top - mast.getBoundingClientRect().bottom) < 1,
      oneRow: mast.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) <= Math.max(...kids.map(e => e.getBoundingClientRect().height)) + 1,
      menu: ['play-btn', 'play-menu', 'choose'].filter(id => document.getElementById(id))};
    r.ok = r.picker && !r.other.length && r.mast === 'Adobe|Partner services statement of work|Open draft|Have an RFI?' && r.flush;
    return r;
  });

  // 1. the four Brand Visibility plays and the two solo plays match the live tool at $150, Typical
  ok(CAT.plays.length === 7 && FIXED.map(p => p.id).join() === LIVE_PLAYS.join() && CUSTOM && CUSTOM.id === 'custom',
    `seven plays: the six from the live tool, then Create your own play (${CAT.plays.map(p => p.id).join(', ')})`);
  ok(CUSTOM.products.every(id => P[id] && !P[id].outside) && CAT.products.filter(p => !p.outside).length === CUSTOM.products.length && OCT30.every(id => CUSTOM.products.includes(id)),
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
    ok(t.big === ls[2] && t.sub === liveSub, `${play.label}: the canvas total matches the live tool (${ls[2]}, ${ls[0]} one-time + ${ls[1]}; Nov 19 2026: a new engagement there starts with the services the play's starting outside systems bring on the canvas)`, `${t.big} / ${t.sub}`);
    await p.context().close(); await live.context().close();
  }

  // 2. the picker
  const p = await fresh(); await p.goto(CANVAS); await p.waitForTimeout(300);
  ok(await p.inputValue('#rate') === '' && (await read(p)).big === '$ ___' && (await read(p)).sub === 'Enter your approved rate to see illustrative fees.',
    'a fresh canvas has no rate: the partner enters an approved rate (audit fix)', JSON.stringify(await read(p)));
  ok((await p.textContent('.total .k')).trim() === 'Illustrative fees: implementation + 12-month term' && (await p.textContent('.toolbar')).includes('Delivery size') && !(await p.textContent('.toolbar')).includes('year one'),
    'the total reads Illustrative fees: implementation + 12-month term, beside Delivery size', (await p.textContent('.total .k')).trim());
  ok(await p.isVisible('#picker') && (await nodes(p)).length === 0, 'opens on the play picker, with nothing on the canvas');
  ok((await p.$$('#picker .pc-card')).length === 12, 'the picker shows twelve cards: seven plays and the five that open Your own play with products placed (Nov 19 2026: the three AI assistant cards joined)');
  const secs0 = await p.$$eval('#picker-list .sh', x => x.map(y => y.textContent.trim()));
  ok(secs0.join('|') === 'Brand Visibility plays|Adobe agentic lineup|Build your own play, frontier model integrations', 'in three rows, in Adam\'s order (Nov 19 2026): Brand Visibility plays; Adobe agentic lineup; Build your own play', secs0.join('|'));
  ok((await p.textContent('#picker [data-play="custom"]')).includes('Create your own play') && (await p.textContent('#picker [data-play="custom"] .cchip')).trim() === `${N} products to choose from`,
    `the last card is Create your own play, with ${N} products to choose from`);
  ok((await p.textContent('#picker')).includes('One play per statement of work. To quote a second play, start a second SOW.'), 'the picker says one play per statement of work');
  const chips = await p.$$eval('#picker .pc-card[data-play]:not([data-play="custom"])', cs => cs.map(c => [c.dataset.play, c.querySelectorAll('.chips span').length]));
  ok(chips.length === FIXED.length && chips.every(([id, n]) => n === PL[id].products.length), 'each play card shows a chip for each of its products', JSON.stringify(chips));
  const starts = await p.$$eval('#picker .pc-card[data-start]', cs => cs.map(c => [c.dataset.start, c.querySelectorAll('.chips span').length].join(':')));
  ok(starts.join('|') === CAT.plays.find(p => p.custom).starts.map(x => x.products.join(',') + ':' + (x.products.length + (x.assistant ? 1 : 0))).join('|'), 'so does each card that opens Your own play with its products placed, an assistant card with a chip for its assistant first (Nov 19 2026)', starts.join('|'));
  ok(await p.isHidden('.tabs') && await p.isHidden('.toolbar') && await p.isHidden('#start-over') && await p.isHidden('#change-play') && await p.isHidden('#save') && await p.isHidden('#addwrap'),
    'the steps, the toolbar and Start over wait for a play; so do Change play, Add product and Save');
  ok(fs.readFileSync(path.join(HERE, 'index.html'), 'utf8').includes('<body class="picking">'), 'the page starts on the boxes, so a slow first load never shows the steps, the toolbar or Start over');
  const om0 = await onlyMasthead(p);
  ok(om0.ok, 'only the masthead sits above the boxes, with the Adobe logo, title, Open draft and Have an RFI?', JSON.stringify(om0));
  ok(!om0.menu.length && (await p.$$eval('#picker [data-play]', x => x.map(y => y.dataset.play))).sort().join() === CAT.plays.map(q => q.id).sort().join(),
    'no Choose a play menu: each of the seven plays is picked from its box', om0.menu.join());

  // 3. a fixed play, chosen from its box
  await p.click('#picker [data-play="aem"]'); await p.waitForTimeout(600); await p.fill('#rate', '150'); await p.waitForTimeout(100);
  ok(await p.isHidden('#picker') && JSON.stringify(await nodes(p)) === JSON.stringify(['bv', 'cdn', 'chatgpt', 'claude', 'csrc', 'eds', 'search', 'so']), 'picking a play\'s box puts its products on the canvas, and every outside system it offers (step 45: the CDN; Nov 18 2026: Search data, Authoring docs, ChatGPT and Claude too)', (await nodes(p)).join(','));
  ok(JSON.stringify(await edges(p)) === JSON.stringify(['bv-eds', 'cdn-bv', 'chatgpt-eds', 'claude-eds', 'csrc-eds', 'csrc-so', 'search-bv', 'search-so', 'so-eds']) && (await p.$$('.ib')).length === 9, 'they connect themselves, a lightning bolt on each connection', (await edges(p)).join(','));
  ok((await p.textContent('#play-label')).trim() === PL.aem.label && await p.isVisible('#change-play') && !(await p.$('#play-btn, #play-menu, #choose')) && await p.isVisible('#add-btn') && await p.isHidden('#add-menu'),
    'the toolbar shows the play name, Change play and Add product, with its menu closed (Nov 18: a product can be added to a ready-made play)');
  ok((await Promise.all(['build', 'scope', 'services', 'sow'].map(k => p.isVisible(`.tabs [data-tab="${k}"]`)))).every(Boolean) && await p.isVisible('#rate') && await p.isVisible('#size') && await p.isVisible('#t-big') && await p.isVisible('#start-over'),
    'with a play picked, the steps, Your rate, Delivery size, the total and Start over show');
  ok(await p.isVisible('#canvas-product-help'), 'a small play includes the product gesture and the link to the map below');
  let t = await read(p), e = expected('aem');
  ok(t.big === money(e.yr), 'the total adds every product and connection in the play', `${t.big} vs ${money(e.yr)}`);
  // step 42: each box shows its name and how many of its services are on, no money
  const nodeText = await p.$$eval('.node', es => es.map(x => x.textContent.trim()));
  const otherCards = await p.$$eval('.node:not(.out):not([data-p="eds"]) .cnt', counts => counts.map(e => e.textContent.trim()));
  ok(nodeText.every(x => !/\$/.test(x)) && otherCards.length === 2 && otherCards.every(t => /^(\d+ services?|Services on its connections)$/.test(t)) &&
    await p.isVisible('.node[data-p="eds"] select[data-choice="authoring"]') && nodeText.includes(P.cdn.name + 'Recommended'),
    'the canvas shows service counts, the AEM authoring control and the existing CDN, with fees in the estimate', nodeText.join(' | '));
  ok(await p.isHidden('#card'), 'no card until you click');

  // 4. click a product (hovering opens nothing), X a line, check it back
  await p.hover('.node[data-p="eds"]'); await p.waitForTimeout(400);
  ok(await p.isHidden('#card'), 'S42: hovering a product opens nothing');
  await p.dblclick('.node[data-p="eds"] .offering-title'); await p.waitForTimeout(250);
  ok(await p.isVisible('#card') && (await p.textContent('#card h4')).includes('Edge Delivery Services'), 'clicking a product opens its services card');
  const rows = await p.$$eval('#card .ln', r => r.map(x => x.dataset.l));
  ok(JSON.stringify(rows) === JSON.stringify(P.eds.lines), 'the card lists the product\'s services', rows.join(','));
  const srcs = await p.$$eval('#card .ln .src', a => a.map(x => x.href));
  ok(srcs.length === rows.length && srcs.every(h => h.startsWith('http')), 'every line in the card has a source link');
  ok((await p.$$('#card [data-rm]')).length === 0, 'a fixed play\'s card has no Remove from canvas');
  await p.click('#card [data-t="A03"]'); await p.waitForTimeout(150);
  t = await read(p); e = expected('aem', 'base', 150, {A03: false});
  ok(t.big === money(e.yr) && (await p.textContent('#card .ln[data-l="A03"] .fee')).trim() === 'Not selected', 'X on a line takes it out: the card says Not selected (ChatGPT, Nov 13: "Removed" was misleading) and the total drops', t.big);
  ok(await p.inputValue('.node[data-p="eds"] select[data-choice="authoring"]') === '', 'editing delivery scope does not answer the authoring question');
  await p.mouse.move(5, 300); await p.waitForTimeout(500);
  ok(await p.isVisible('#card'), 'S42: the card stays open when the pointer moves away');
  ok((await p.textContent('#card .ft')).includes('4 product services selected'), 'the card footer counts what is left', await p.textContent('#card .ft'));
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
  await p.dblclick('.node[data-p="so"]'); await p.waitForTimeout(250);
  ok((await p.textContent('#card h4')).includes('Sites Optimizer'), 'S42: a click on another box swaps to its card');
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  ok(await p.isHidden('#card'), 'S42: Escape closes the card');
  { const at = await p.evaluate(() => { const s = document.getElementById('save').getBoundingClientRect(), c = document.getElementById('canvas').getBoundingClientRect(); return {top: Math.round(s.top - c.top), right: Math.round(c.right - s.right), bottom: Math.round(c.bottom - s.bottom)}; });
    ok(!(await p.$('#hint')) && !/Click a lightning bolt/.test(await p.textContent('#canvas')) && at.top === 18 && at.right === 30 && at.bottom > 300,
      'step 95 (Adam, Nov 14): no line at the foot of the canvas, and Continue sits at the canvas\'s top right', JSON.stringify(at)); }

  // 6. optional services
  await p.dblclick('.node[data-p="bv"]'); await p.waitForTimeout(200);
  await p.click('#card details.more summary'); await p.waitForTimeout(150);
  ok((await p.textContent('#card details.more .ln[data-l="O04"] .fee')).trim() === 'Not selected', 'optional lines say Not selected, with an Add button, and are not counted yet');
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
  ok((await nodes(p)).length === 8 && await p.isHidden('#confirm'), 'Cancel keeps the play as it was');
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
  await p.dblclick('.node[data-p="bv"]'); await p.waitForTimeout(200);
  await p.click('#card [data-t="C05"]'); await p.waitForTimeout(150);
  t = await read(p); e = expected('abv', 'base', 150, {C05: false});
  ok(t.big === money(e.yr) && (await p.textContent('#card .ln[data-l="C05"] .fee')).trim() === 'Not selected', 'Brand Visibility on its own: X on its prompt strategy line takes it out and keeps it out', t.big);
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
  const firstTags = await p.$$eval('#add-menu .mgrp > [data-add], #add-menu .mgrp > [data-sites-offering]', items =>
    items.map(i => [i.dataset.add || 'eds', i.querySelector('.ctag').textContent.trim()]));
  ok(await p.isVisible('#add-menu') && firstTags.length === N && await p.locator('[data-sites-offering] [data-add]').count() === 2,
    `the Add product menu shows ${N} offerings, with two delivery choices under AEM Sites`);
  ok(firstTags.every(([id, tag]) => { const n = neighbors(id).length; return tag === `Connects to ${n} product${n === 1 ? '' : 's'}`; }),
    'before anything is on the canvas, each product says how many of the others it connects to', firstTags.slice(0, 3).map(x => x.join(': ')).join(' | '));
  const emptyBox = await p.$eval('#empty h2', e => e.getBoundingClientRect()), menuBox = await p.$eval('#add-menu', e => e.getBoundingClientRect());
  ok(emptyBox.left > menuBox.right, 'the open menu does not cover the empty canvas message');
  await p.keyboard.press('Escape'); await p.waitForTimeout(150);
  await p.click('#empty-add'); await p.waitForTimeout(250);
  ok(await p.isVisible('#add-menu'), 'the empty canvas\'s own Add product button opens the menu with a real click');
  await addP(p, 'bv');
  ok(JSON.stringify(await nodes(p)) === '["bv"]' && await p.isHidden('#empty') && await p.isVisible('#save'), 'adding a product puts it on the canvas; Save appears');
  ok(await p.isVisible('#add-menu'), 'the menu stays open to add more');
  const yes = await p.$$eval('#add-list > [data-add], #add-list > [data-sites-offering]', items => items.map(i => i.dataset.add || 'eds'));
  const wantYes = neighbors('bv');
  ok(yes.length === wantYes.length && yes.every(id => wantYes.includes(id)), `products that connect to the canvas come first (${yes.join(', ')})`);
  ok((await p.textContent('#add-menu .g')).trim().toLowerCase() === 'connects to your canvas' && (await p.$$eval('#add-list > [data-add] .ctag, #add-list > [data-sites-offering] .ctag', x => x.map(y => y.textContent.trim()))).every(s => s === 'Connects to 1 on your canvas'),
    'each says "Connects to 1 on your canvas"');
  const restN = N - 1 - wantYes.length;
  // step 63: the rest wait under Adobe's menu headings, closed, where "N more do not connect to your canvas yet" was
  const waiting = await p.evaluate(() => ({head: [...document.querySelectorAll('#add-list .g')].map(g => g.textContent.trim().toLowerCase()), groups: [...document.querySelectorAll('#add-list details.mgrp')].map(d => ({open: d.open, n: d.querySelectorAll(':scope > [data-add], :scope > [data-sites-offering]').length, said: d.querySelector('.cnt').textContent.trim()}))}));
  ok(waiting.head[1] === 'not connected to your canvas yet' && waiting.groups.reduce((t, g) => t + g.n, 0) === restN && waiting.groups.every(g => !g.open && g.said === `${g.n} product${g.n === 1 ? '' : 's'}`),
    `the other ${restN} wait under "Not connected to your canvas yet", grouped under closed headings that say how many each holds`, JSON.stringify(waiting));
  await p.$eval('#add-menu [data-add="cja"]', e => { const d = e.closest('details'); if (d) d.open = true; });
  await p.hover('#add-menu [data-add="cja"]'); await p.waitForTimeout(150);
  ok(await p.$eval('.node[data-p="bv"]', n => n.classList.contains('pre')), 'pointing at a product in the menu outlines what it would connect to on the canvas');
  await addP(p, 'cja');
  ok(JSON.stringify(await edges(p)) === '["bv-cja"]', 'adding CJA connects it to Brand Visibility by itself');
  t = await read(p); e = expected('custom', 'base', 150, {}, ['bv', 'cja']);
  const crossSell = expected('cja', 'base', 150, {}, ['bv', 'cja']);
  ok(t.big === money(e.yr) && e.yr > crossSell.yr, `Brand Visibility and CJA built by hand include new CJA setup work (${t.big})`, `Cross-sell without outside systems: ${money(crossSell.yr)}`);
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
    ok(await q.isVisible('#canvas-product-help') && clean && td.covered.length === 0 && td.onLine.length === 0,
      `${names}: every line drawn, ${td.n} i dot${td.n === 1 ? '' : 's'}, none covered or sitting on another line, a clean layout`, JSON.stringify(td));
    if (set.length === 2) ok(JSON.stringify(await q.evaluate(() => [pos('bv'), pos('bc')])) === '[[0,1],[1,0]]', 'two products far apart on the grid are packed side by side');
    await q.context().close();
  }

  // 11. Remove from canvas keeps the choices underneath
  await p.dblclick('.node[data-p="cja"]'); await p.waitForTimeout(250);
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

  // Product titles and plain boxes use the same mouse gesture, even when the node also has a version picker.
  const tap = async (pg, id, twice = false) => {
    const node = pg.locator(`.node[data-p="${id}"]`), title = node.locator('.offering-title');
    const control = await title.count() ? title : node;
    if (twice) await control.dblclick();
    else await control.click();
  };
  // 13. Even the busiest canvas opens with every connection.
  for (const id of OFFERINGS) if (!(await nodes(p)).includes(id)) await addP(p, id);
  await outside(p); await away(p);
  await p.selectOption('.node[data-p="eds"] select[data-choice="authoring"]', 'universal');
  const all = OFFERINGS, nAll = OFFERINGS.reduce((sum, id) => sum + neighbors(id).length, 0) / 2;
  ok((await nodes(p)).length === N && await p.isVisible('#fbar') && (await edges(p)).length === nAll, `all ${N} offerings open with all ${nAll} connections`);
  ok((await p.textContent('#fbar')).includes(`${nAll} connections`) && await p.locator('#canvas-product-help a').getAttribute('href') === '#knowledge-model-section', 'the guide gives the count and links to the lower map');
  const counts = await p.$$eval('.node:not([data-p="eds"])', ns => ns.map(n => [n.dataset.p, n.querySelector('.cn').textContent]));
  ok(counts.length === N - 1 && counts.every(([id, c]) => c === `${neighbors(id).length} connection${neighbors(id).length === 1 ? '' : 's'}`),
    'other product cards count distinct connected offerings while the AEM card shows the authoring method');
  const selected = await p.evaluate(() => [...prods(), ...conns()].flatMap(all).filter(counted));
  const expectedTerm = selected.reduce((sum, id) => sum + CAT.lines[id].base * 150 * (CAT.lines[id].unit === 'monthly' ? 12 : 1), 0);
  t = await read(p);
  ok(new Set(selected).size === selected.length && t.big === money(expectedTerm), 'the total prices every selected service once, including shared AEM connections', `${t.big} vs ${money(expectedTerm)}`);
  const drawn = await edges(p);
  await tap(p, 'cja'); await away(p);
  ok(await p.isHidden('#card') && JSON.stringify(await edges(p)) === JSON.stringify(drawn), 'one click keeps all connections on the canvas');
  const rendered = await p.$$eval('#edges path.edge', es => es.map(e => [e.dataset.s, e.dataset.e]));
  ok(all.every(id => {
    const linked = rendered.filter(pair => pair.includes(id)).map(([a,b]) => a === id ? b : a).sort();
    return JSON.stringify(linked) === JSON.stringify(neighbors(id));
  }) && (await p.$$('.ib')).length === drawn.length, 'each product has its complete set of direct connections and every line has one bolt');
  const nsv = CAT.connections.filter(c => c.no_services && all.includes(c.a) && all.includes(c.b));
  ok(nsv.length > 0 && nsv.every(c => !c.lines.length && !c.more.length && c.how && c.source && c.source.url), `${nsv.length} connection(s) Adobe documents without services keep a source and no lines`);
  await p.click(`.ib[data-c="${nsv[0].id}"]`); await p.waitForTimeout(300);
  ok((await p.textContent('#card')).includes('does not explicitly list any services for this connection. You can add your own services on the Services tab'), `the i on ${P[nsv[0].a].name} + ${P[nsv[0].b].name} points to the Services tab`);
  await p.click('#card [data-close]'); await p.waitForTimeout(150);

  // 13b. A single mouse click preserves the overview. A double-click opens services.
  { const q = await fresh(); await q.goto(CANVAS); await choose(q, 'custom');
    for (const id of OFFERINGS) await q.evaluate(i => addProduct(i), id);
    await q.selectOption('.node[data-p="eds"] select[data-choice="authoring"]', 'universal');
    await q.keyboard.press('Escape'); await away(q);
    for (const id of ['rtcdp', 'bc', 'workfront']) {
      await tap(q, id); const first = await q.isHidden('#card');
      await tap(q, id, true); await q.waitForTimeout(500);
      const cover = await q.evaluate(id => { const c = document.getElementById('card').getBoundingClientRect(), hit = r => r.left < c.right && c.left < r.right && r.top < c.bottom && c.top < r.bottom;
        return hit(document.querySelector(`.node[data-p="${id}"]`).getBoundingClientRect()) ? 1 : 0; }, id);
      const rm = await q.$eval('#card [data-rm]', b => { b.scrollIntoView({block: 'nearest'}); const r = b.getBoundingClientRect(); return {x: r.left + r.width / 2, y: r.top + r.height / 2}; });
      await q.mouse.move(rm.x, rm.y, {steps: 30}); await q.waitForTimeout(400);
      ok(first && cover === 0 && await q.isVisible('#card') && (await q.textContent('#card h4')).includes(P[id].title || P[id].name),
        `${P[id].name}: a double-click opens the card clear of its box and it stays open on the way to Remove`, `first ${first}, covers ${cover}`);
      await q.click('#card [data-close]'); await q.waitForTimeout(150);
    }
    await tap(q, 'rtcdp', true); await q.waitForTimeout(500);
    await q.click('#card [data-rm="rtcdp"]'); await q.waitForTimeout(500);
    ok(!(await nodes(q)).includes('rtcdp') && (await nodes(q)).length === N - 1, 'removing a product updates the full canvas');
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
      `adding Real-Time CDP from a card shows its additional connections (${before} connections before) and keeps the card and its line`);
    await q.click('#card [data-close]'); await q.waitForTimeout(200); await away(q);
    await tap(q, 'cja', true); await q.waitForTimeout(700);
    ok(await q.isVisible('#card') && (await q.textContent('#card h4')).includes('Customer Journey Analytics'), 'and product cards still open with a double-click afterwards');
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
  ok(!/[–—]/.test(body) && !/[–—]/.test(JSON.stringify(CAT, (k, v) => k === 'ask' ? undefined : v)), 'no en or em dashes anywhere (Nov 18 2026: but one Ask it question, Adobe\'s own example word for word, on its card)');
  const faded = await p.evaluate(() => [...document.querySelectorAll('.node,.card,.save,.total,.toolbar *,.picker *,.addmenu *,.fbar *,.empty *,#knowledge-model-section *')].filter(e => parseFloat(getComputedStyle(e).opacity) < 1).length);
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
  ok(await kb.evaluate(() => document.activeElement.id) === 'vid-play', 'the next on the plays video at the top of the page (step 83)');
  await kb.keyboard.press('Tab'); await kb.keyboard.press('Tab');
  ok(await kb.evaluate(() => document.activeElement.id) === 'look-play', 'then, after Watch the video, the first look beside it (Nov 19 2026)');
  await kb.keyboard.press('Tab'); await kb.keyboard.press('Tab');
  ok(await kb.evaluate(() => document.activeElement.id) === 'bp-q', 'then, after its Watch the video, the question box above the play boxes');
  let walk = [];
  for (let i = 0; i < 12 && await kb.evaluate(() => !document.activeElement.dataset.play); i++) { await kb.keyboard.press('Tab'); walk.push(await kb.evaluate(() => { const e = document.activeElement, r = e.getBoundingClientRect(); return !!(r.width && r.height) && !e.closest('[hidden]'); })); }
  ok(await kb.evaluate(() => document.activeElement.dataset.play) === first && walk.every(Boolean), 'then Tab reaches the first play box, with nothing hidden above it taking focus', walk.length + ' stops');
  await kb.keyboard.press('Enter'); await kb.waitForTimeout(500);
  ok(await kb.isHidden('#picker') && await kb.isVisible('.tabs') && (await kb.textContent('#play-label')).trim() === (PL[first].title || PL[first].label), 'Enter on a box picks that play and brings back the steps and the toolbar');
  await choose(ph, 'aem');
  ok(await ph.evaluate(() => document.documentElement.scrollWidth) <= 390 && (await nodes(ph)).length === 8, 'on a phone a play still draws, with no sideways scroll');
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
    for (const id of OFFERINGS) await q.evaluate(i => addProduct(i), id);
    await q.selectOption('.node[data-p="eds"] select[data-choice="authoring"]', 'universal');
    await q.keyboard.press('Escape'); await q.mouse.move(2, 2); await q.waitForTimeout(500);
    // the harness adds products under a resting pointer, which can leave a hover card open: close it as a partner would
    if (await q.isVisible('#card')) { await q.click('#card [data-close]'); await q.waitForTimeout(200); }
    await tap(q, 'cja'); await q.waitForTimeout(600);
    const bi = await barInside(q, w);
    ok(bi.out.length === 0 && bi.under.length === 0 && await q.evaluate(() => document.documentElement.scrollWidth) <= w,
      `at ${w} wide, with all ${N} on and CJA picked, the canvas guide fits (${bi.h} px tall) and no box sits under it`, JSON.stringify(bi));
  }

  // 16. audit fix (Oct 31): every connection says what it is; partner workflows draw dashed; specialized Skills replace generic ones
  { const KINDS = ['native', 'platform', 'extension', 'partner'];
    // step 86 (Nov 12): availability caveats are stripped, so a connection either has a short factual availability line or none at all
    const CAVEAT = /not stated by adobe|confirm with adobe|adobe confirms|adobe has enabled|adobe to enable|adobe's written confirmation|generally available|adobe documents|co-innovation|try before you buy|limited availability|early access|\bbeta\b|[\u2013\u2014]/i;
    const LABEL = /\blegacy\b/i;   // a release label on the label or availability line; in a prerequisite "legacy configuration" or "legacy connector" is a technical fact and stays
    const AV = ADOBE_C.filter(c => c.availability), NOAV = ADOBE_C.filter(c => c.availability === '');
    ok(ADOBE_C.every(c => KINDS.includes(c.kind) && c.label && typeof c.availability === 'string' && c.availability === c.availability.trim() && !CAVEAT.test(c.availability) && !CAVEAT.test(c.label) && !LABEL.test(c.availability) && !LABEL.test(c.label) && Array.isArray(c.prereqs) && c.prereqs.length >= 1 && c.prereqs.every(x => x && !CAVEAT.test(x)))
        && AV.length === 66 && NOAV.length === 77,   // Nov 17: Brand Intelligence + Creative Cloud and + Coworker have no availability line, nor has Coworker + Adobe Analytics; Nov 19: nor have Commerce Optimizer's four lines to Adobe products and Commerce Intelligence + Adobe Commerce
      `every connection is typed, with prerequisites, and its availability is a plain factual line or empty, with no caveat or release label (${KINDS.map(k => k + ' ' + CAT.connections.filter(c => c.kind === k).length).join(', ')}; ${AV.length} with a line, ${NOAV.length} with none)`,
      ADOBE_C.filter(c => !KINDS.includes(c.kind) || typeof c.availability !== 'string' || CAVEAT.test(c.availability) || CAVEAT.test(c.label) || LABEL.test(c.availability) || LABEL.test(c.label) || !Array.isArray(c.prereqs) || !c.prereqs.length || c.prereqs.some(x => !x || CAVEAT.test(x))).map(c => c.id).join(',') + ` (${AV.length} with, ${NOAV.length} without)`);
    const OUTC = CAT.connections.filter(c => !ADOBE_C.includes(c));
    // Nov 18 2026: the 41 lines of ChatGPT, Claude and Microsoft Copilot, and Adobe Analytics + Cloud storage and GenStudio for Performance Marketing + Ad platforms,
    // came in with no route style. Nov 19 2026: the assistants' lines have a style of their own ('assistant', thinner and grey), and the other two are native
    const AIC = c => ['chatgpt', 'claude', 'copilot'].some(id => [c.a, c.b].includes(id)), PLAIN = c => AIC(c) || ['aa-cstore', 'gspm-ads'].includes(c.id);
    ok(OUTC.length === 74 && OUTC.filter(PLAIN).length === 42 && OUTC.some(c => c.id === 'commerce-crm' && c.line === 'native') && OUTC.every(c => c.kind === 'outside' && (AIC(c) ? c.line === 'assistant' : ['native', 'platform'].includes(c.line)) && c.label && c.prereqs.length >= (['cdn-bv', 'dwh-cja', 'cstore-cja', 'crm-cja'].includes(c.id) ? 3 : 1) && c.source && c.source.url && c.how),
      `steps 27, 45 and 85: each outside system's connection (74 with Adobe Commerce + CRM and, since Nov 19, its four back-office systems, the PIM and Other commerce platform to Commerce Optimizer and the CRM and Ad platforms to Commerce Intelligence, Brand Intelligence + Figma, Figma's four to AEM Assets, GenStudio for Performance Marketing, Adobe Express and Firefly Custom Models, and since Nov 18 the 42 of the assistants and two more boxes, Claude + Brand Intelligence the last) is typed Outside system, with its line style (the assistants' their own), how it connects, prerequisites and source (${OUTC.map(c => c.id + ' ' + c.line).join(', ')})`);
    const q = await fresh(); await q.goto(CANVAS); await choose(q, 'fsi');
    ok(await q.$eval('.edge[data-c="bv-bc"]', e => e.classList.contains('pw')) && (await q.textContent('#t-legend')).includes('Partner workflow'),
      'Brand Visibility + Brand Concierge draws dashed, and the key above the map says what each line style means');
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
    { const av = (await q.textContent('#card .avail')).trim(), card = await q.textContent('#card');   // step 86: the tenant-enablement caveat is gone, the license stays
      ok(av === 'Availability: The baseline is anonymous visitors.' && !/enable the integration|written confirmation|tenant enablement|confirm with Adobe/i.test(card) && card.includes('Concierge events reach Experience Platform; replies can use profile context') && card.includes("Real-Time CDP licensed separately (Brand Concierge's license excludes it)"),
        'Real-Time CDP + Brand Concierge shows the anonymous baseline as its availability, no tenant-enablement caveat, and still lists the separate Real-Time CDP license on the card', av + ' | ' + card.slice(0, 400)); }
    await q.click('#card [data-close]'); await q.waitForTimeout(150);
    let t = await read(q), e = expected('custom', 'base', 150, {}, ['rtcdp', 'bc', 'cw', 'cja']);
    ok(t.big === money(e.yr), `with Coworker Skills for CJA on the canvas, the generic Skills package is not counted (${t.big})`, `${t.big} vs ${money(e.yr)}`);
    await q.dblclick('.node[data-p="cw"]'); await q.waitForTimeout(300);
    ok(await q.$eval('#card .ln[data-l="CW03"]', r => r.classList.contains('rp') && r.textContent.includes('Replaced by the specialized Skills')), 'its line says Replaced by the specialized Skills');
    await q.click('#card [data-keep="CW03"]'); await q.waitForTimeout(200);
    t = await read(q); e = expected('custom', 'base', 150, {}, ['rtcdp', 'bc', 'cw', 'cja'], {CW03: true});
    ok(t.big === money(e.yr) && !(await q.$eval('#card .ln[data-l="CW03"]', r => r.classList.contains('rp'))), 'one click keeps it for distinct Skills, and the total adds it', t.big);
    await q.click('#card [data-close]'); await q.waitForTimeout(150);
    await q.dblclick('.node[data-p="rtcdp"]'); await q.waitForTimeout(300);
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
    ok(await q.isVisible('#t-legend') && await q.$eval('#t-legend', e => !e.closest('.total')) && (await q.textContent('#t-legend')).startsWith('What the lines on the map mean:'),
      'on a wide screen the labelled line key sits above the map, outside the total');
    await q.context().close();
    const pq = await fresh(768, 1024); await pq.goto(CANVAS); await choose(pq, 'fsi');
    const lg = (await pq.textContent('#t-legend')).trim();
    ok(await pq.isVisible('#t-legend') && lg.startsWith('What the lines on the map mean:') && lg.includes('Partner workflow') && await pq.evaluate(() => document.documentElement.scrollWidth) <= 768,
      'on a tablet the labelled line key shows above the map with no sideways scroll', lg);
    await pq.context().close(); }

  // after a reload, the products sit where a fresh layout puts them, not 25 to 30 px low until the next resize (Adam, Nov 1)
  { const q = await fresh(1600, 950); await q.goto(CANVAS); await choose(q, 'aem'); await q.reload(); await q.waitForTimeout(900);
    const at = async () => q.$$eval('.node', ns => ns.map(n => { const r = n.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top)]; }));
    const a = await at(); await q.evaluate(() => fit()); await q.waitForTimeout(700); const c = await at();
    ok(a.length === 8 && JSON.stringify(a) === JSON.stringify(c), 'after a reload the products sit where the layout puts them, with no shift on the next resize', `${JSON.stringify(a)} then ${JSON.stringify(c)}`);
    await q.context().close(); }

  // step 44: Add outside system on Create your own play
  { const q = await fresh(); await q.goto(CANVAS); await q.evaluate(() => localStorage.setItem('abv-sow-build-v1', JSON.stringify({v: 2, rate: 150, play: 'custom', on: ['cja']}))); await q.reload(); await q.waitForTimeout(800);
    ok(await q.isVisible('#out-btn'), 'S44: Create your own play has Add outside system');
    await q.click('#out-btn'); await q.waitForTimeout(200);
    const items = await q.$$eval('#out-menu .it2', es => es.map(e => ({id: e.dataset.out || null, wait: e.disabled, t: e.querySelector('.ctag').textContent})));
    ok(items.length === 18 && ['dwh', 'cstore', 'crm', 'ads', 'bi', 'chatgpt', 'claude', 'copilot'].every(id => items.some(x => x.id === id && /Connects to CJA/.test(x.t))) && items.some(x => x.wait && /Connects to Brand Visibility: add it first/.test(x.t)) && items.some(x => x.wait && x.t === 'Connects to AEM Assets, GenStudio for Performance Marketing, Adobe Express, Firefly Custom Models and Brand Intelligence: add one first'),
      'S44: its menu offers the data warehouse, cloud storage, CRM, ad platforms and BI tools for CJA (step 45), and ChatGPT, Claude and Microsoft Copilot (Nov 18), says the CDN needs Brand Visibility first, and Figma needs one of the five products it connects to first (18 systems since Nov 19 2026)', JSON.stringify(items));
    const t0 = await q.textContent('#t-big'); await q.click('#out-menu [data-out="crm"]'); await q.waitForTimeout(500);
    ok((await nodes(q)).includes('crm') && (await edges(q)).includes('crm-cja') && (await q.textContent('#t-big')) !== t0, 'S44: adding the CRM puts its box beside CJA, connected, with its services in the total', (await edges(q)).join(','));
    ok(await layoutClean(q), 'S44: and the canvas stays clean');
    await q.context().close(); }

  // Nov 17 2026: Figma connects to AEM Assets, GenStudio for Performance Marketing, Adobe Express and Firefly Custom Models through the plugins
  // and the add-on Adobe documents (canvas/research/wave6_figma.json): native lines, Adobe's pages as links only, six services that start off
  { const FIG = {'figma-aemassets': ['aemassets', {XF01: [8, 16, 32], XF02: [8, 16, 32]}], 'figma-gspm': ['gspm', {XF03: [16, 32, 56], XF04: [8, 16, 32]}],
      'figma-express': ['express', {XF05: [8, 16, 32]}], 'figma-fireflycm': ['fireflycm', {XF06: [8, 16, 24]}]};
    const ADOBE_PAGE = /^https:\/\/(?:experienceleague|helpx)\.adobe\.com\//;
    const fc = Object.keys(FIG).map(id => CAT.connections.find(c => c.id === id) || {id, prereqs: [], flows: [], lines: [], more: []});
    ok(fc.every(c => c.a === 'figma' && c.b === FIG[c.id][0] && c.kind === 'outside' && c.line === 'native' && c.label && c.how && c.availability === '' && c.prereqs.length >= 3 &&
        c.gain && c.gain.title && c.gain.text && c.sowHow && c.sowGain && ADOBE_PAGE.test((c.source || {}).url) && c.flows.length && c.flows.every(f => ADOBE_PAGE.test(f.source.url)) &&
        (c.references || []).length && c.references.every(r => ADOBE_PAGE.test(r.url) && r.title) && !c.lines.length && c.more.join() === Object.keys(FIG[c.id][1]).join()),
      'Nov 17: Figma connects natively to AEM Assets, GenStudio for Performance Marketing, Adobe Express and Firefly Custom Models, each with how it works, what you get together, its prerequisites, Adobe pages and services that start off',
      JSON.stringify(fc.map(c => [c.id, c.kind, c.line, c.lines, c.more])));
    const xf = Object.values(FIG).flatMap(([, h]) => Object.entries(h));
    ok(xf.every(([id, h]) => { const l = CAT.lines[id]; return !!l && l.origin === 'research' && l.unit === 'one-time' && !!l.scope && ADOBE_PAGE.test(l.url) && [l.low, l.base, l.high].join() === h.join(); }) &&
        CAT.lines.XF04.ext === 'GenStudio Photoshop from Adobe Exchange, in Photoshop 25.6.0 or later',
      'Nov 17: XF01 to XF06 carry their scope, Adobe page and hours, and the Photoshop conversion says it also needs GenStudio Photoshop',
      xf.map(([id]) => id + ' ' + (CAT.lines[id] ? [CAT.lines[id].low, CAT.lines[id].base, CAT.lines[id].high].join('/') : 'missing')).join(', '));
    const shown = fc.flatMap(c => [c.label, c.how, ...c.prereqs, c.gain && c.gain.title, c.gain && c.gain.text, ...c.flows.map(f => f.what)])
      .concat(xf.flatMap(([id]) => [(CAT.lines[id] || {}).name, (CAT.lines[id] || {}).scope, (CAT.lines[id] || {}).ext].filter(x => x !== undefined)));
    const hedge = t => typeof t !== 'string' || /confirm|not stated|\bbeta\b|limited availability|coming soon|recommended approach|account (?:team|manager)|in writing|\bthe client\b|\bclients\b/i.test(t) || /\b[Yy]our\b(?! client)/.test(t);
    ok(!shown.some(hedge), 'Nov 17: the Figma cards and services ask nothing of Adobe, carry no availability caveat and speak to the partner about "your client"', shown.find(hedge));
    // Adobe's Figma page documents custom models the designer has created, not models shared with them; one plugin carries one name;
    // each card says how it works in three sentences at most; GenStudio Photoshop is XF04's own note, not a prerequisite of the card
    const cm = fc[3], said = c => [c.label, c.how, ...c.prereqs, c.gain && c.gain.text, ...c.flows.map(f => f.what), c.sowHow, c.sowGain].join(' ');
    ok(/created/.test(cm.how) && /created/.test(cm.label) && !/\bshar|Generator/i.test(said(cm) + ' ' + (CAT.lines.XF06 || {}).scope) && [fc[1], cm].every(c => /Firefly Enterprise and GenStudio plugin/.test(c.label)) &&
        fc.every(c => c.how.split(/(?<=\.)\s+/).length <= 3) && !fc[1].prereqs.some(x => /Photoshop/.test(x)),
      'Nov 17: Figma + Firefly Custom Models promises only the custom models a designer has created, both plugin cards name the Firefly Enterprise and GenStudio plugin, each card says how it works in three sentences at most, and GenStudio Photoshop stays the conversion service\'s own note',
      JSON.stringify([cm.label, fc.map(c => c.how.split(/(?<=\.)\s+/).length), fc[1].prereqs.filter(x => /Photoshop/.test(x))]));
    // On a new custom canvas, attaching Figma selects the main services on its connections.
    const q = await fresh(); await q.goto(CANVAS); await choose(q, 'custom');
    for (const id of ['aemassets', 'gspm', 'express', 'fireflycm']) await addP(q, id);
    await outside(q); const t0 = await read(q);
    await q.click('#out-btn'); await q.waitForTimeout(200);
    const tag = await q.$eval('#out-menu [data-out="figma"] .ctag', e => ({t: e.textContent, r: getComputedStyle(e).borderTopLeftRadius, h: Math.round(e.getBoundingClientRect().height)})).catch(() => ({t: 'no Figma item'}));
    ok(tag.t === 'Connects to AEM Assets, GenStudio for Performance Marketing, Adobe Express and Firefly Custom Models' && tag.r === '12px' && tag.h > 30,
      'Nov 17: Add outside system offers Figma for the four products on the canvas, and its tag, on several lines, keeps its words inside its rounded corners', JSON.stringify(tag));
    await q.click('#out-menu [data-out="figma"]'); await q.waitForTimeout(500); await away(q);
    const drawn = await edges(q), t1 = await read(q);
    const sum = s => Number(s.replace(/[^0-9.]/g, ''));
    const setupHours = xf.reduce((hours, [id]) => hours + CAT.lines[id].base, 0);
    ok(Object.keys(FIG).every(id => drawn.includes(id)) && sum(t1.big) === sum(t0.big) + setupHours * 150 && t1.sub === t0.sub, 'adding Figma draws its four lines and includes their main services',
      drawn.join(',') + ' ' + t0.big + ' then ' + t1.big);
    ok(await layoutClean(q), 'Nov 17: and the canvas stays clean, with no box on another and every i clear of the boxes');
    await q.click('.ib[data-c="figma-aemassets"]'); await q.waitForTimeout(400);
    const card = await q.$eval('#card', c => ({text: c.innerText, rows: [...c.querySelectorAll('.ln')].map(r => r.dataset.l), links: [...c.querySelectorAll('a')].map(a => a.href)}));
    ok(card.text.includes('Figma + AEM Assets') && /Outside system/i.test(card.text) && /Before it works/i.test(card.text) && /What you get together/i.test(card.text) && /How it connects/i.test(card.text) &&
        card.rows.join() === 'XF01,XF02' && card.links.length > 0 && card.links.every(h => ADOBE_PAGE.test(h)),
      'Nov 17: the Figma + AEM Assets card says how they connect, what comes first and what you get, offers its two services and links only to Adobe pages', JSON.stringify(card).slice(0, 400));
    await q.click('#card [data-t="XF01"]'); await q.waitForTimeout(400);
    const t2 = await read(q);
    ok(sum(t2.big) === sum(t1.big) - CAT.lines.XF01.base * 150, 'removing the AEM Assets Connector rollout removes its typical hours from the total', t1.big + ' then ' + t2.big);
    await q.context().close(); }

  // Nov 17 2026, never go backwards (Adam: "any newer product that offers the same functionality that an older product did: they're not going to go
  // backwards"). His rules are data (never_suggest.json), each one-way, and only change what the Add product menu on Create your own play suggests:
  // the older product leaves its group for a "Not suggested" heading, where it can still be added.
  { const RULES = JSON.parse(fs.readFileSync(path.join(HERE, 'never_suggest.json'), 'utf8')).rules.map(r => r.when_on_canvas_any.join() + '>' + r.never_suggest.join());
    const own = async ids => { const q = await fresh(); await q.goto(CANVAS); await choose(q, 'custom'); for (const id of ids) await addP(q, id); await outside(q); await away(q); return q; };
    // the open menu as a partner reads it, with the pointer away from it: its headings in order (the "g" headings; the groups of an empty canvas
    // are not read), and every product with the heading it sits under
    const menu = async (q, find) => { if (await q.isHidden('#add-menu')) await q.click('#add-btn'); await q.waitForTimeout(250);
      if (find !== undefined) { await q.fill('#add-find', find); await q.waitForTimeout(250); }
      await away(q);
      return q.$$eval('#add-list > *', els => { const heads = [], rows = []; let under = '';
        for (const e of els) {
          if (e.classList.contains('g')) { under = e.textContent.trim(); heads.push(under); continue; }
          for (const b of e.matches('[data-add]') ? [e] : e.querySelectorAll('[data-add]')) { const tag = b.querySelector('.ctag'), why = b.querySelector('.to');
            rows.push({id: b.dataset.add, under, name: b.querySelector('.nm').textContent.trim(), tag: tag ? tag.textContent.trim() : '', why: why ? why.textContent.trim() : '',
              seen: !!why && why.getBoundingClientRect().height > 0, sites: !!b.closest('.sites-menu')}); }
        }
        return {heads, rows}; }); };
    const page0 = await own([]), onPage = await page0.evaluate(() => NEVER.map(r => Object.keys(r).join() + ':' + r.when_on_canvas_any.join() + '>' + r.never_suggest.join()).join(' '));
    ok(RULES.join(' ') === 'cja>aa ajo>target eds>aemsites' && onPage === RULES.map(r => 'when_on_canvas_any,never_suggest:' + r).join(' '),
      'Nov 17: never_suggest.json holds Adam\'s three one-way rules (Customer Journey Analytics holds back Adobe Analytics, Journey Optimizer holds back Target, Edge Delivery holds back traditional AEM Publish), and the page gets their product ids only', RULES.join(' ') + ' / ' + onPage);
    const m0 = await menu(page0);
    ok(m0.heads.length === 0 && m0.rows.length === N + 1 && !(await page0.innerText('#add-menu')).includes('Not suggested'), 'Nov 17: an empty canvas holds nothing back: every product is offered and there is no "Not suggested"', m0.heads.join(' | ') + ' ' + m0.rows.length);
    await page0.context().close();
    for (const [trigger, held] of [['cja', 'aa'], ['ajo', 'target']]) {
      const T = P[trigger].name, H = P[held].name, why = `${T} is on your canvas. Add ${H} only if your client still runs it.`;
      const q = await own([trigger, 'rtcdp']);
      let m = await menu(q), r = m.rows.filter(x => x.id === held);
      ok(m.heads.join(' | ') === 'Connects to your canvas | Not suggested | Not connected to your canvas yet' && r.length === 1 && r[0].under === 'Not suggested' && m.rows.filter(x => x.under === 'Not suggested').length === 1,
        `Nov 17: with ${T} on the canvas, ${H} sits once under "Not suggested", right after "Connects to your canvas", and in no other group`, m.heads.join(' | ') + ' ' + JSON.stringify(r));
      ok(r.length === 1 && r[0].name === H && r[0].tag === 'Add anyway' && r[0].why === why && r[0].seen, `Nov 17: its tag reads "Add anyway", and the line under its name, shown without pointing at the row, reads "${why}"`, JSON.stringify(r));
      // take the newer product off: the older one is an ordinary row again
      await outside(q); await q.dblclick(`.node[data-p="${trigger}"]`); await q.waitForTimeout(300); await q.click(`#card [data-rm="${trigger}"]`); await q.waitForTimeout(400);
      m = await menu(q); r = m.rows.filter(x => x.id === held);
      ok(!m.heads.includes('Not suggested') && r.length === 1 && r[0].under === 'Connects to your canvas' && r[0].tag === 'Connects to 1 on your canvas' && r[0].why === 'Lines to Real-Time CDP' && !r[0].seen,
        `Nov 17: with ${T} removed, ${H} is back in its normal place under "Connects to your canvas" and "Not suggested" is gone`, m.heads.join(' | ') + ' ' + JSON.stringify(r));
      // put it back, then Add anyway: the product goes on the canvas like any other
      await addP(q, trigger); m = await menu(q);
      ok(m.rows.filter(x => x.id === held).map(x => x.under + ':' + x.tag).join() === 'Not suggested:Add anyway', `Nov 17: with ${T} added again, ${H} is under "Not suggested" again`, JSON.stringify(m.rows.filter(x => x.id === held)));
      await q.click(`#add-menu [data-add="${held}"]`); await q.waitForTimeout(400);
      const on = await nodes(q), es = await edges(q); m = await menu(q);
      ok(JSON.stringify(on) === JSON.stringify([trigger, held, 'rtcdp'].sort()) && es.some(c => c.split('-').sort().join() === [trigger, held].sort().join()) && !m.heads.includes('Not suggested') && !m.rows.some(x => x.id === held),
        `Nov 17: "Add anyway" puts ${H} on the canvas beside ${T}, with their connection, and the menu has nothing left to hold back`, on.join() + ' / ' + es.join() + ' / ' + m.heads.join(' | '));
      await q.context().close();
    }
    // one-way: the older product on the canvas never holds the newer one back
    for (const [older, newer] of [['aa', 'cja'], ['target', 'ajo']]) {
      const q = await own([older]), m = await menu(q), r = m.rows.filter(x => x.id === newer);
      ok(!m.heads.includes('Not suggested') && r.length === 1 && r[0].under === 'Connects to your canvas' && r[0].tag === 'Connects to 1 on your canvas',
        `Nov 17: one-way: with ${P[older].name} on the canvas, ${P[newer].name} is still suggested under "Connects to your canvas"`, m.heads.join(' | ') + ' ' + JSON.stringify(r));
      await q.context().close();
    }
    // a canvas with none of the newer products: both older ones in their normal place
    { const q = await own(['bv', 'rtcdp']), m = await menu(q), two = m.rows.filter(x => ['aa', 'target'].includes(x.id));
      ok(!m.heads.includes('Not suggested') && two.length === 2 && two.every(x => x.under === 'Connects to your canvas' && x.tag === 'Connects to 1 on your canvas'),
        'Nov 17: a canvas with neither Customer Journey Analytics nor Journey Optimizer shows no "Not suggested": Adobe Analytics and Target are suggested as before', m.heads.join(' | ') + ' ' + JSON.stringify(two));
      await q.context().close(); }
    // both newer products on the canvas: one heading, the two older products under it by name, each with its own line
    { const q = await own(['cja', 'ajo']), m = await menu(q), held = m.rows.filter(x => x.under === 'Not suggested');
      ok(m.heads.join(' | ') === 'Connects to your canvas | Not suggested | Not connected to your canvas yet' && m.rows.filter(x => ['aa', 'target'].includes(x.id)).length === 2 &&
          held.map(x => [x.id, x.tag, x.why, x.seen].join(':')).join() === ['aa:Add anyway:Customer Journey Analytics is on your canvas. Add Adobe Analytics only if your client still runs it.:true',
            'target:Add anyway:Journey Optimizer is on your canvas. Add Target only if your client still runs it.:true'].join(),
        'Nov 17: with Customer Journey Analytics and Journey Optimizer both on the canvas, one "Not suggested" heading holds Adobe Analytics then Target, each with its own line', m.heads.join(' | ') + ' ' + JSON.stringify(held));
      await q.context().close(); }
    // every other product on the canvas: nothing connects first, so "Not suggested" is the menu's first and only heading
    { const q = await own(OFFERINGS.filter(id => !['aa', 'target'].includes(id))); let m = await menu(q);
      ok(m.heads.join(' | ') === 'Not suggested' && m.rows.map(x => x.id + ':' + x.under + ':' + x.tag).join() === 'aa:Not suggested:Add anyway,target:Not suggested:Add anyway',
        'Nov 17: when only the held-back products are left to add, "Not suggested" is the first and only heading, with Adobe Analytics then Target', m.heads.join(' | ') + ' ' + JSON.stringify(m.rows.map(x => x.id + ':' + x.under)));
      await q.click('#add-menu [data-add="aa"]'); await q.waitForTimeout(400); await addP(q, 'target');
      m = await menu(q); const said = (await q.innerText('#add-menu')).replace(/\s+/g, ' ');
      ok((await nodes(q)).length === N && m.rows.length === 0 && said.includes('Every product is on your canvas') && !said.includes('Not suggested'),
        'Nov 17: and once both are added the menu says every product is on the canvas', (await nodes(q)).length + ' ' + said);
      await q.context().close(); }
    // on a phone the two lines wrap inside the menu
    { const q = await fresh(390, 844); await q.goto(CANVAS); await choose(q, 'custom'); await q.click('#empty-add'); await q.waitForTimeout(300); await addP(q, 'cja'); await addP(q, 'ajo');
      const m = await menu(q), held = m.rows.filter(x => x.under === 'Not suggested');
      const box = await q.evaluate(() => { const r = document.getElementById('add-menu').getBoundingClientRect();
        return {page: document.documentElement.scrollWidth, menu: [r.left, r.right], lines: [...document.querySelectorAll('#add-menu [data-add] .to.show')].map(e => { const x = e.getBoundingClientRect(); return [x.left, x.right, x.height]; })}; });
      ok(held.map(x => x.id + ':' + x.seen).join() === 'aa:true,target:true' && box.page <= 390 && box.menu[0] >= 0 && box.menu[1] <= 390 && box.lines.length === 2 && box.lines.every(l => l[0] >= box.menu[0] && l[1] <= box.menu[1] && l[2] > 0),
        'Nov 17: on a phone the "Not suggested" rows and their lines sit inside the menu, with no sideways scroll', JSON.stringify(held.map(x => x.id + ':' + x.seen)) + ' ' + JSON.stringify(box));
      await q.context().close(); }
    // the find box finds a held-back product, under the same heading, tag and line
    { const q = await own(['cja']); let m = await menu(q, 'analytics'), r = m.rows.filter(x => x.id === 'aa');
      const n = m.rows.length - 1, why = 'Customer Journey Analytics is on your canvas. Add Adobe Analytics only if your client still runs it.';
      ok(n >= 1 && m.heads.join(' | ') === `${n} match${n === 1 ? '' : 'es'} | Not suggested` && m.rows.slice(0, n).every(x => x.under === m.heads[0] && /analytics/i.test(x.name)) && m.rows[n].id === 'aa' &&
          r.length === 1 && r[0].under === 'Not suggested' && r[0].tag === 'Add anyway' && r[0].why === why && r[0].seen,
        'Nov 17: typing "analytics" in the find box lists the suggested matches, then Adobe Analytics under "Not suggested" with "Add anyway" and its line', m.heads.join(' | ') + ' ' + JSON.stringify(m.rows.map(x => x.id + ':' + x.under)));
      m = await menu(q, 'adobe analytics');
      ok(m.heads.join(' | ') === 'Not suggested' && m.rows.map(x => x.id + ':' + x.tag + ':' + x.why).join() === 'aa:Add anyway:' + why, 'Nov 17: typing its whole name finds Adobe Analytics alone, still under "Not suggested"', m.heads.join(' | ') + ' ' + JSON.stringify(m.rows));
      await q.click('#add-menu [data-add="aa"]'); await q.waitForTimeout(400);
      ok(JSON.stringify(await nodes(q)) === '["aa","cja"]', 'Nov 17: and adding it from the find box puts it on the canvas', (await nodes(q)).join());
      await q.context().close(); }
    // AEM Sites: one entry, two ways. Sites Optimizer alone holds nothing back
    { const q = await own(['so']), m = await menu(q), s = m.rows.filter(x => x.sites);
      ok(!m.heads.includes('Not suggested') && s.map(x => [x.id, x.name, x.under].join(':')).join() === 'eds:With Edge Delivery Services:Connects to your canvas,aemsites:With traditional AEM Publish:Connects to your canvas',
        'Nov 17: Sites Optimizer alone holds nothing back: the AEM Sites entry still offers Edge Delivery Services and traditional AEM Publish', m.heads.join(' | ') + ' ' + JSON.stringify(s));
      await q.context().close(); }
    // Edge Delivery on the canvas: AEM Sites is one box there, so its entry has left the menu and traditional AEM Publish is not offered at all
    { const q = await own(['eds', 'so']), m = await menu(q), t1 = await menu(q, 'traditional'), t2 = await menu(q, 'AEM Sites'), all = [m, t1, t2];
      ok(JSON.stringify(await nodes(q)) === '["eds","so"]' && all.every(x => !x.heads.includes('Not suggested') && !x.rows.some(y => y.id === 'aemsites' || y.sites)) && t1.rows.length === 0,
        'Nov 17: with AEM Sites with Edge Delivery Services on the canvas, the menu offers no traditional AEM Publish, listed or found: the AEM Sites entry is already off the menu, so no "Not suggested" line is needed',
        JSON.stringify(all.map(x => [x.heads, x.rows.filter(y => y.id === 'aemsites' || y.sites)])));
      await q.context().close(); }
    { const q = await own(['aemsites']), m = await menu(q), s = m.rows.filter(x => x.sites);
      ok(!m.heads.includes('Not suggested') && s.map(x => x.id + ':' + x.name).join() === 'eds:Use Edge Delivery Services',
        'Nov 17: one-way: with AEM Sites on traditional AEM Publish on the canvas, the menu still offers Edge Delivery Services', m.heads.join(' | ') + ' ' + JSON.stringify(s));
      await q.context().close(); }
    // the rules stop at the menu: a service that needs Adobe Analytics still says so, and its button still adds it
    { const q = await own(['cw', 'cja']); await q.click('.ib[data-c="cw-cja"]'); await q.waitForTimeout(400);
      for (const d of await q.$$('#card details')) if (!(await d.evaluate(x => x.open))) await d.$eval('summary', s => s.click());
      await q.waitForTimeout(200);
      const row = await q.$eval('#card .ln[data-l="XA29"]', x => ({text: x.innerText.replace(/\s+/g, ' '), button: [...x.querySelectorAll('[data-addp]')].map(b => b.dataset.addp + ':' + b.textContent.trim()).join()})).catch(() => ({text: 'no XA29 row', button: ''}));
      ok(row.text.includes('Needs Adobe Analytics on the canvas') && row.button === 'aa:Add Adobe Analytics', 'Nov 17: on Coworker + Customer Journey Analytics, "Adobe Analytics and CJA data validation and fixes" still says it needs Adobe Analytics on the canvas, with its "Add Adobe Analytics" button', JSON.stringify(row));
      await q.click('#card .ln[data-l="XA29"] [data-addp="aa"]'); await q.waitForTimeout(600);
      const on = await nodes(q), locked = await q.$$eval('#card .ln[data-l="XA29"]', xs => xs.map(x => x.classList.contains('lock')).join());
      ok(JSON.stringify(on) === '["aa","cja","cw"]' && locked === 'false', 'Nov 17: and the button puts Adobe Analytics on the canvas beside Customer Journey Analytics and unlocks the service', on.join() + ' ' + locked);
      await q.context().close(); }
    // Nov 18: a ready-made play has Add product too, and its ranked list follows the same rules: with the play's own goal chosen, Adobe Analytics sits
    // under "Not suggested" on the play that holds Customer Journey Analytics, and the play that holds Edge Delivery offers no AEM Sites row at all
    for (const id of ['cja', 'aem']) {
      const q = await fresh(); await q.goto(CANVAS); await choose(q, id);
      const on = await nodes(q), shut = await q.isVisible('#add-btn') && await q.isHidden('#add-menu');
      await q.click('#add-btn'); await q.waitForTimeout(300); await q.click('#add-menu [data-goal].own'); await q.waitForTimeout(300);
      const list = await q.evaluate(() => { const m = document.getElementById('add-menu'), g = [...m.querySelectorAll('.g')].find(x => x.textContent === 'Not suggested'), held = [];
        for (let x = g && g.nextElementSibling; x && x.matches('.it2'); x = x.nextElementSibling) held.push(x.dataset.add + ':' + x.querySelector('.ctag').textContent);
        return {goal: st.goal || '', held: held.join(), ranked: [...m.querySelectorAll('.rk-row [data-add]')].map(x => x.dataset.add)}; });
      ok(shut && PL[id].products.every(x => on.includes(x)) && list.goal && list.ranked.length > 20 && (id === 'cja' ? list.held === 'aa:Add anyway' && !list.ranked.includes('aa') : list.held === '' && !list.ranked.includes('eds') && !list.ranked.includes('aemsites')),
        `Nov 18: the ready-made play ${PL[id].label} opens with its own products and the Add product button; with its own goal chosen, ${id === 'cja' ? 'Adobe Analytics sits under "Not suggested" with "Add anyway" and has no rank' : 'the ranked list offers no AEM Sites row and holds nothing back'}`, on.join() + ' ' + JSON.stringify(list).slice(0, 300));
      await q.context().close();
    }
  }
  ok(errs.length === 0, 'no script errors', errs.join(' | ').slice(0, 300));
  await b.close();
  console.log(fails ? `${fails} CHECK(S) FAILED` : 'ALL CANVAS CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})();
