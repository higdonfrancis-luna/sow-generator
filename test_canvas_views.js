// Canvas connection views and service selection states. Run after the normal canvas/site build:
//   node sow/test_canvas_views.js
// CANVAS_TEST_SITE allows the same interaction check against an isolated template preview.
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.resolve(process.env.CANVAS_TEST_SITE || path.join(__dirname, 'site'));
let fails = 0;
const ok = (yes, message, detail = '') => { console.log((yes ? '✅ ' : '❌ ') + message + (yes || !detail ? '' : ': ' + detail)); if (!yes) fails++; };
const server = http.createServer((req, res) => {
  const file = path.join(SITE, req.url.split('?')[0] === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!file.startsWith(SITE + path.sep) || !fs.existsSync(file)) { res.writeHead(404); return res.end('not found'); }
  res.setHeader('Content-Type', file.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/plain');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(r => server.listen(0, r));
  const browser = await chromium.launch(), errors = [];
  try {
    const p = await browser.newPage({viewport: {width: 1600, height: 1000}, hasTouch: true});
    p.on('pageerror', e => errors.push(e.message));
    await p.goto('http://localhost:' + server.address().port + '/');
    await p.waitForFunction(() => window.READY);
    const seed = async (products, outside = [], authoring = '') => {
      await p.evaluate(({products, outside, authoring}) => {
        hideCard(true); openAdd(false); openOut(false);
        st = {...st, play: 'custom', on: products, out: outside, ls: {}, keep: {}, rate: 0, eff: null, decisions: {authoring}, fresh: true, pubSig: null};
        moreOpen = {}; render();
      }, {products, outside, authoring});
      await p.waitForTimeout(400);
    };
    const snapshot = () => p.evaluate(() => JSON.stringify({products: prods().map(p => p.id), connections: conns().map(c => c.id), selected: [...prods(), ...conns()].flatMap(o => all(o)).filter(counted), choices: st.ls, authoring: st.decisions.authoring, totals: totals()}));
    const products = ['ajo', 'cja', 'target', 'workfront', 'aemassets', 'aemsites', 'aemforms', 'acrobatsign', 'aa', 'commerce'];
    await seed(products, ['crm', 'bi', 'dwh']);
    await p.fill('#rate', '150');
    const before = await snapshot();
    const routes = () => p.evaluate(() => ({
      edges: [...document.querySelectorAll('#edges path.edge')].map(e => e.dataset.c).sort(),
      bolts: [...document.querySelectorAll('#stage .ib')].map(e => e.dataset.c).sort(),
      expected: displayConnections().map(c => c.id).sort()
    }));
    const all = await routes();
    const full = state => state.expected.length > 0 && [state.edges, state.bolts].every(ids => JSON.stringify(ids) === JSON.stringify(state.expected));
    ok(full(all) && all.edges.length >= 10, 'a crowded canvas opens with one line and one bolt for every relationship');
    ok(!await p.locator('#view-one,#view-all').count() && await p.isVisible('#canvas-product-help'), 'the canvas shows product instructions in place of the view controls');
    const cja = p.locator('.node[data-p="cja"]');
    await cja.click();
    ok(await p.isHidden('#card') && full(await routes()), 'one mouse click keeps all connections visible');
    await cja.dblclick();
    ok(await p.isVisible('#card [data-rm="cja"]') && full(await routes()), 'double-clicking opens the services and removal control with the full canvas visible');
    await p.keyboard.press('Escape'); await cja.focus(); await p.keyboard.press('Space');
    ok(await p.isVisible('#card') && await snapshot() === before, 'keyboard access and opening product details preserve services and fees');
    await p.keyboard.press('Escape');
    await p.click('#canvas-product-help a');
    await p.locator('#knowledge-model-root .wke-node[data-id="commerce"]').click();
    ok((await p.innerText('#knowledge-model-root .wke-inspector h3')).includes('Commerce') && full(await routes()) && await snapshot() === before, 'one click on the lower map explains Commerce without editing the upper canvas or the quote');
    await cja.dblclick(); await p.click('#card [data-rm="cja"]');
    ok(!await cja.count() && full(await routes()) && (await routes()).edges.length < all.edges.length, 'explicit removal updates the visible lines and bolts together');

    await seed(['commerce', 'eds']);
    ok(await p.locator('#map-info button').count() === 0 && (await p.textContent('#t-legend')).startsWith('What the lines on the map mean:'),
      'the strip above the map holds only the labelled line key, with no questions or notes');
    ok(await p.evaluate(() => counted('XA18') && counted('XA19') && !counted('XA20')), 'the storefront services start included, the optional one stays optional, and there is no question to answer');
    const included = await snapshot();
    await p.click('.ib[data-c="commerce-eds"]');
    ok(await p.locator('#card select').count() === 0 && await p.isHidden('#card [data-l="XA18"] .tip'), 'the connection card asks no scope question and keeps the guidance closed');
    await p.hover('#card [data-tip="XA19"]');
    ok(await p.isVisible('#card [data-l="XA19"] .tip'), 'hovering the i shows when to keep the service');
    await p.click('#card [data-tip="XA18"]');
    await p.mouse.move(5, 5);
    const guidance = await p.innerText('#card [data-l="XA18"] .tip');
    ok(await p.isVisible('#card [data-l="XA18"] .tip') && await p.getAttribute('#card [data-tip="XA18"]', 'aria-expanded') === 'true' && guidance.includes('Keep it if') && guidance.includes('Remove it if') && guidance.includes('Commerce PaaS') && await snapshot() === included,
      'clicking the i says when to keep and when to remove the service, and changes no fees', guidance);
    await p.click('#card [data-t="XA18"]');
    ok(await p.evaluate(() => !counted('XA18') && counted('XA19')) && (await p.innerText('#card [data-l="XA18"] .tip')).includes('Add it if'),
      'the partner removes a service that does not apply, and its guidance then says when to add it back');

    // every one of the eight services, opened the way a partner would: its own guidance, in view, with the row's figures left where they were
    const TIP_CASES = [
      ['XA18', 'commerce-eds', ['commerce', 'eds'], [], 'has Adobe Commerce as a Cloud Service', 'only has Commerce PaaS'],
      ['XA19', 'commerce-eds', ['commerce', 'eds'], [], 'Build the Commerce storefront on Edge is in the quote', 'you removed Build the Commerce storefront on Edge'],
      ['XA20', 'commerce-eds', ['commerce', 'eds', 'cja'], [], 'wants product, cart and purchase events', 'only has Commerce PaaS'],
      ['XJ06', 'express-frameio', ['express', 'frameio'], [], 'is, or will be, on Adobe cloud storage with Unified Approvals', 'you are not setting it up in this project'],
      ['XJ17', 'frameio-aemassets', ['frameio', 'aemassets'], [], 'has Workfront Prime or Ultimate', 'its Workfront package is below Prime'],
      ['XJ18', 'frameio-aemassets', ['frameio', 'aemassets'], [], 'details to arrive on its approved assets', "doesn't need the details carried over"],
      ['OX1', 'cdn-bv', ['bv'], ['cdn'], 'wants you to create the log job', 'CDN team creates the log job itself'],
      ['OX2', 'cdn-bv', ['bv'], ['cdn'], 'has no Adobe guide', "All of your client's logs come from Akamai"]
    ];
    const tipFailures = [];
    for (const [id, connection, products, outside, keep, remove] of TIP_CASES) {
      await seed(products, outside);
      await p.click('.ib[data-c="' + connection + '"]');
      const row = p.locator('#card [data-l="' + id + '"]');
      if (!(await row.isVisible())) await p.click('#card details.more summary');
      const figures = r => { const top = r.getBoundingClientRect().top; return ['.hr', '.fee', '.tg'].map(part => Math.round(r.querySelector(part).getBoundingClientRect().top - top)); };
      const resting = await row.evaluate(figures);
      await p.click('#card [data-tip="' + id + '"]');
      const seen = await row.evaluate(r => { const card = r.closest('#card').getBoundingClientRect(), tip = r.querySelector('.tip'), box = tip.getBoundingClientRect();
        return {text: tip.innerText.replace(/\s+/g, ' '), on: lineOn(r.dataset.l), inView: box.height > 0 && box.top >= card.top - 1 && box.bottom <= card.bottom + 1, tier: !!r.querySelector('.tier')}; });
      const moved = await row.evaluate(figures);
      const [first, second] = seen.on ? ['Keep it if', 'Remove it if'] : ['Add it if', 'Leave it out if'];
      const order = [first, keep, second, remove].map(part => seen.text.indexOf(part));
      if (order.some(at => at < 0) || order.some((at, n) => n && at < order[n - 1]) || !seen.inView || seen.tier || JSON.stringify(moved) !== JSON.stringify(resting))
        tipFailures.push(id + ' ' + JSON.stringify({order, inView: seen.inView, tier: seen.tier, resting, moved, text: seen.text}));
    }
    ok(tipFailures.length === 0, 'each of the eight services opens its own keep and remove guidance in view, in the right order, without moving its hours, fee or X', tipFailures.join(' | '));

    await seed(['commerce', 'eds']);
    await p.click('.ib[data-c="commerce-eds"]');
    await p.hover('#card [data-tip="XA19"]');
    const steady = [];
    for (let i = 0; i < 4; i++) { await p.mouse.wheel(0, 40); await p.waitForTimeout(150); steady.push(await p.isVisible('#card [data-l="XA19"] .tip')); }
    ok(steady.every(Boolean), 'the hovered guidance stays open while the partner scrolls the card to read it', steady.join(','));
    await p.mouse.move(5, 5);
    await p.focus('#card [data-tip="XA19"]');
    const stateOf = () => p.evaluate(() => { const b = document.querySelector('#card [data-tip="XA19"]'), t = document.querySelector('#card [data-l="XA19"] .tip');
      return {shown: getComputedStyle(t).display !== 'none', expanded: b.getAttribute('aria-expanded') === 'true', focused: document.activeElement === b}; });
    const focusedOnly = await stateOf();
    await p.keyboard.press('Enter'); const opened = await stateOf();
    await p.keyboard.press('Enter'); const closed = await stateOf();
    ok(!focusedOnly.shown && !focusedOnly.expanded && opened.shown && opened.expanded && opened.focused && !closed.shown && !closed.expanded && closed.focused,
      'from the keyboard, Enter opens and closes the guidance, focus stays on the i, and aria-expanded always matches what is shown', JSON.stringify({focusedOnly, opened, closed}));
    await p.click('#card [data-tip="XA18"]');
    await p.evaluate(() => { showCard('p', 'commerce'); openRoute(CBY['commerce-eds']); });
    ok(await p.getAttribute('#card [data-tip="XA18"]', 'aria-expanded') === 'false' && await p.isHidden('#card [data-l="XA18"] .tip'), 'a card opened again starts with its guidance closed');

    await seed(['eds', 'cja']);
    await p.click('.ib[data-c="eds-cja"]');
    await p.click('#card [data-t="EDC01"]');
    ok(await p.evaluate(() => counted('EDC01') && !has('aemsites')), 'a partner can select Edge Delivery measurement without a separate AEM Sites work package');

    await p.click('#change-play'); await p.click('#confirm-yes');
    await p.click('#picker [data-play="commerce"]');
    const beforeCommerce = await p.evaluate(() => totals().n);
    await p.dblclick('.node[data-p="commerce"] .offering-title');
    const commerce = await p.evaluate(() => ({open: document.querySelector('#card details.more').open, rows: [...document.querySelectorAll('#card .ln')].map(e => ({id: e.dataset.l, status: e.querySelector('.fee')?.textContent, add: e.querySelector('[data-t]')?.getAttribute('aria-label'), locked: e.classList.contains('lock')})), footer: document.querySelector('#card .ft').textContent, total: totals()}));
    ok(commerce.open && commerce.rows.length === 16 && commerce.rows.every(r => /^CE(?:0[1-9]|1[0-6])$/.test(r.id)), 'Commerce exposes all its available product services by default (seven, and nine more since Nov 19 2026)');
    ok(commerce.rows.filter(r => !r.locked).every(r => r.status === 'Not selected' && r.add?.startsWith('Add ') && !r.add.startsWith('Add back ')) && commerce.footer.includes('No product services selected'), 'unselected services are clearly labelled even before a rate is entered');
    ok(commerce.total.n === beforeCommerce && await p.evaluate(() => ownerTotal(P.commerce).n === 0), 'viewing available Commerce services does not select or charge for them');
    await p.click('#card details.more summary'); await p.waitForTimeout(30);
    await p.fill('#rate', '150');
    ok(await p.$eval('#card details.more', d => !d.open), 'a manually collapsed available-services list stays collapsed after refresh');
    await p.click('#card details.more summary'); await p.waitForTimeout(30);
    const beforeFee = await p.evaluate(() => totals().one);
    await p.click('#card [data-t="CE01"]');
    const added = await p.evaluate(() => ({n: ownerTotal(P.commerce).n, fee: totals().one, expected: fee('CE01'), copies: document.querySelectorAll('#card [data-l="CE01"]').length, open: document.querySelector('#card details.more').open, selected: all(P.commerce).filter(counted)}));
    ok(added.n === 1 && added.fee === beforeFee + added.expected && added.copies === 1 && added.selected.join() === 'CE01', 'adding one available service selects and prices exactly that service once');
    ok(added.open && await p.$eval('#card details.more summary', e => e.textContent.includes('Available services (15)')), 'the remaining available services stay visible after one is added');
    await p.click('#card [data-t="CE01"]');
    ok(await p.evaluate(beforeFee => ownerTotal(P.commerce).n === 0 && totals().one === beforeFee && document.querySelector('#card [data-l="CE01"] .fee').textContent === 'Not selected', beforeFee), 'removing the service returns it to Not selected with no product fee');

    await seed(['cja']);
    await p.dblclick('.node[data-p="cja"]');
    const defaultLine = await p.evaluate(() => P.cja.lines.find(l => defOf(l) && met(l)));
    await p.click('#card [data-t="' + defaultLine + '"]');
    ok(await p.$eval('#card [data-l="' + defaultLine + '"]', e => e.querySelector('.fee').textContent === 'Not selected' && !e.querySelector('[data-t]').getAttribute('aria-label').includes('Add back') && getComputedStyle(e.querySelector('.nm')).textDecorationLine === 'none'), 'an off starting service has the same clear status and readable name');

    await seed(products, ['crm', 'bi', 'dwh']);
    await p.dblclick('.node[data-p="commerce"] .offering-title');
    ok((await p.textContent('#card .connection-note')).includes('shown separately'), 'product cards distinguish their own services from connection services');
    await p.setViewportSize({width: 390, height: 844});
    await p.evaluate(() => hideCard(true)); await p.waitForTimeout(400);
    const mobile = await p.evaluate(() => ({overflow: document.documentElement.scrollWidth > innerWidth + 1,
      hint: document.getElementById('canvas-product-help').innerText, guide: document.getElementById('fbar').getBoundingClientRect().right}));
    ok(!mobile.overflow && mobile.guide <= 391 && full(await routes()), 'the phone shows every connection without sideways page overflow');
    await p.locator('.node[data-p="commerce"] .offering-title').tap();
    ok(mobile.hint.startsWith('Tap a product') && await p.isVisible('#card'), 'the phone gives a tap instruction and one tap opens the card');
    const mobileCard = await p.$eval('#card', e => { const r = e.getBoundingClientRect(); return r.left >= -1 && r.right <= innerWidth + 1 && e.scrollWidth <= e.clientWidth + 1; });
    ok(mobileCard, 'the expanded Commerce card fits the phone width');

    await seed(['bv', 'eds', 'so', 'cja', 'commerce', 'target', 'ajo', 'aemassets', 'frameio', 'express'], ['cdn'], 'universal');
    ok(await p.locator('.node[data-p="aemsites"]').count() === 0 && await p.inputValue('.node[data-p="eds"] select[data-choice="authoring"]') === 'universal',
      'the crowded mobile canvas keeps the selected AEM authoring method on one Sites offering');
    const beforeOpening = await snapshot();
    ok(full(await routes()), 'the crowded phone canvas immediately exposes every connection button');
    await p.locator('.ib[data-c="commerce-eds"]').tap();
    ok(await p.isVisible('#card') && await p.evaluate(() => document.querySelector('#card').contains(document.activeElement)), 'a touch-opened connection card takes keyboard focus');
    await p.locator('#card [data-tip="XA18"]').tap();
    ok(await p.locator('#card [data-tip="XA18"]').evaluate(b => b === document.activeElement && b.getAttribute('aria-expanded') === 'true'), 'the tapped i keeps keyboard focus and reports its guidance as open');
    const fits = await p.locator('#card [data-l="XA18"] .tip').evaluate(tip => {
      const card = tip.closest('#card'), box = card.getBoundingClientRect(), text = tip.getBoundingClientRect();
      return text.width > 0 && box.left >= -1 && box.right <= innerWidth + 1 && text.left >= box.left - 1 && text.right <= box.right + 1 && card.scrollWidth <= card.clientWidth + 1;
    });
    ok(fits, 'the tapped guidance and its card fit the 390px viewport');
    await p.keyboard.press('Escape');
    ok(await p.isHidden('#card') && await p.locator('.ib[data-c="commerce-eds"]').evaluate(b => b === document.activeElement) && await snapshot() === beforeOpening,
      'Escape closes the card, returns focus to its lightning button and preserves all service choices and fees');

    await seed(['commerce', 'eds', 'cja']);
    await p.fill('#rate', '185');
    await p.click('#size [data-size="large"]');
    await p.locator('.ib[data-c="commerce-eds"]').click();
    await p.click('#card details.more summary');
    await p.click('#card [data-t="XA20"]');
    await p.click('.tabs [data-tab="services"]');
    await p.waitForSelector('#services-panel:visible');
    const draftFee = await p.evaluate(() => {
      const original = totals().totalFee;
      // Older saved SOWs had service choices but no scope-decision map or canvas storage.
      const draft = JSON.parse(JSON.stringify(state));
      delete draft.canvasDecisions;
      localStorage.removeItem(CANVAS_KEY);
      localStorage.removeItem(HANDOFF);
      localStorage.setItem(KEY, JSON.stringify(draft));
      return original;
    });
    await p.reload();
    await p.waitForSelector('#services-panel:visible');
    const reopened = await p.evaluate(() => ({fee: totals().totalFee, ids: selectedLines().map(baseId), held: document.querySelectorAll('#scope-review [data-confirm-scope]:not([data-confirm-scope="authoring"])').length}));
    ok(reopened.fee === draftFee && ['XA18', 'XA19', 'XA20'].every(id => reopened.ids.includes(id)) && reopened.held === 0,
      'opening a legacy SOW directly keeps the storefront services, the selected optional tracking work and the exact original fee, with nothing held back', JSON.stringify(reopened));
    // the first page: the four Brand Visibility plays in one row, the agentic lineup four across, every row level with its cards the same size;
    // Adobe Brand Concierge and Adobe Brand Intelligence open Your own play with the product placed; then GenStudio's six areas
    // (Nov 19 2026, Adam's row order: Adobe Brand Visibility moves to the agentic lineup, and Build your own play holds Create your own play and the three assistant cards)
    const f = await browser.newPage({viewport: {width: 1440, height: 900}});
    f.on('pageerror', e => errors.push(e.message));
    await f.goto('http://localhost:' + server.address().port + '/');
    await f.waitForFunction(() => window.READY);
    const front = await f.evaluate(() => [...document.querySelectorAll('#picker-list .grid')].map(g => ({cards: [...g.children].map(c => c.querySelector('b').textContent), sizes: new Set([...g.children].map(c => { const r = c.getBoundingClientRect(); return [Math.round(r.top), Math.round(r.width), Math.round(r.height)].join(); })).size})));
    ok(JSON.stringify(front.map(g => g.cards.length)) === '[4,4,4]' && front.every(g => g.sizes === 1) && front[0].cards[0] === 'Brand Visibility + Customer Journey Analytics' && front[1].cards.join('|') === 'Adobe Coworker|Adobe Brand Visibility|Adobe Brand Concierge|Adobe Brand Intelligence' &&
        front[2].cards.join('|') === 'Create your own play|Adobe in Claude|Adobe in ChatGPT|Adobe in Microsoft Copilot',
      'the first page shows the four Brand Visibility plays in one row, the agentic lineup four across (Adobe Brand Visibility after Adobe Coworker) and Build your own play four across, each row level and its cards the same size', JSON.stringify(front));
    const lead = await f.evaluate(() => { const c = document.querySelector('#picker-list [data-play="abv"]'), s = getComputedStyle(c);
      return {play: c.dataset.play, badges: [...document.querySelectorAll('#picker-list .pc-badge')].map(b => b.closest('[data-play]').dataset.play + ':' + b.textContent), border: s.borderLeftColor, fill: s.backgroundColor}; });
    ok(lead.play === 'abv' && lead.badges.join() === 'abv:New' && lead.border === 'rgb(235, 16, 0)' && lead.fill !== 'rgb(255, 255, 255)',
      'Adobe Brand Visibility stands out in the agentic lineup: the only New badge, a red border and a light red fill', JSON.stringify(lead));
    const words = await f.textContent('#picker-list');
    ok(!words.includes('on its own') && !words.includes('Financial services'), 'no card says "on its own", and Brand Visibility + Brand Concierge no longer says financial services');
    await f.click('#picker-list [data-start="bc"]');
    const started = await f.evaluate(() => ({play: st.play, on: st.on.join(), boxes: [...document.querySelectorAll('#stage .node')].map(n => n.dataset.p).join(), services: totals().n, menu: document.getElementById('add-menu').hidden, add: !document.getElementById('addwrap').hidden}));
    await f.evaluate(() => localStorage.clear()); await f.reload(); await f.waitForFunction(() => window.READY);
    ok(started.play === 'custom' && started.on === 'bc' && started.boxes === 'bc,cms' && started.services > 0 && started.menu && started.add,
      'Adobe Brand Concierge opens Your own play with that product placed, another CMS site beside it (Nov 18 2026: the outside systems it connects to start on the canvas), its services selected and Add product ready', JSON.stringify(started));
    await f.click('#picker-list [data-start="brandintel"]');
    const bi = await f.evaluate(() => ({play: st.play, on: st.on.join(), boxes: [...document.querySelectorAll('#stage .node')].map(n => n.dataset.p).join(), services: totals().n}));
    await f.evaluate(() => localStorage.clear()); await f.reload(); await f.waitForFunction(() => window.READY);
    ok(bi.play === 'custom' && bi.on === 'brandintel' && bi.boxes === 'figma,claude,brandintel' && bi.services > 0, 'Adobe Brand Intelligence opens Your own play with Brand Intelligence placed, Figma and Claude beside it, and its services selected', JSON.stringify(bi));
    const fam = await f.$$eval('#picker-list .pc-fam[data-card="family"] .fam-area', x => x.map(a => ({start: a.dataset.start, label: a.querySelector('b').textContent, fee: !!a.querySelector('.fam-fee'), text: a.textContent})));
    ok(fam.length === 6 && fam.every(a => !a.fee && !/\$|an hour/.test(a.text)),
      'GenStudio shows its six areas with no fee line (Nov 19 2026: removed, fees live on the canvas and the Services step)', JSON.stringify(fam));
    await f.evaluate(() => { st.rate = 185; render(); });
    ok(await f.$$eval('#picker-list .pc-fam[data-card="family"] .fam-area', x => x.every(a => !a.querySelector('.fam-fee') && !/\$|an hour/.test(a.textContent))),
      'GenStudio\'s areas still show no fee line once the partner enters a rate');
    for (let i = 0; i < fam.length; i++) {
      await f.click(`#picker-list .pc-fam[data-card="family"] .fam-area:nth-child(${i + 1})`); await f.waitForTimeout(300);
      const got = await f.evaluate(() => ({play: st.play, on: st.on.join(), boxes: [...document.querySelectorAll('#stage .node')].map(n => n.dataset.p), services: totals().n}));
      ok(got.play === 'custom' && got.on === fam[i].start && fam[i].start.split(',').every(id => got.boxes.includes(id)) && got.services > 0,
        `GenStudio, ${fam[i].label}: opens Your own play with its products placed and its services selected`, JSON.stringify(got));
      await f.click('#change-play'); await f.click('#confirm-yes'); await f.waitForTimeout(300);
    }
    await f.click('#picker-list .pc-fam[data-card="family"] .fam-all'); await f.waitForTimeout(300);   // Nov 19 2026: the GenStudio card comes first, before the Client KBO plays
    const family = await f.evaluate(() => st.on.slice().sort().join());
    ok(family === [...new Set(fam.flatMap(a => a.start.split(',')))].sort().join() && family.split(',').length === 10, 'Or open the whole family together places all ten GenStudio products', family);
    await f.evaluate(() => localStorage.clear()); await f.reload(); await f.waitForFunction(() => window.READY);
    await f.click('#picker-list [data-play="custom"]');
    ok(await f.evaluate(() => st.play === 'custom' && !st.on.length && !document.getElementById('add-menu').hidden), 'Create your own play still opens an empty canvas with the Add product menu open');
    await f.close();
    ok(errors.length === 0, 'no browser errors', errors.join('; '));
  } finally { await browser.close(); server.close(); }
  if (fails) { console.error(fails + ' checks failed'); process.exitCode = 1; } else console.log('ALL CANVAS VIEW CHECKS PASSED');
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });
