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
        fsel = null; showAllEdges = false; moreOpen = {}; render();
      }, {products, outside, authoring});
      await p.waitForTimeout(400);
    };
    const snapshot = () => p.evaluate(() => JSON.stringify({products: prods().map(p => p.id), connections: conns().map(c => c.id), selected: [...prods(), ...conns()].flatMap(o => all(o)).filter(counted), choices: st.ls, authoring: st.decisions.authoring, totals: totals()}));
    const products = ['ajo', 'cja', 'target', 'workfront', 'aemassets', 'aemsites', 'aemforms', 'acrobatsign', 'aa', 'commerce'];
    await seed(products, ['crm', 'bi', 'dwh']);
    await p.fill('#rate', '150');
    const before = await snapshot();
    ok(await p.locator('#edges path.edge').count() === 0 && await p.getAttribute('#view-one', 'aria-pressed') === 'true', 'a crowded canvas starts in the one-product view');
    await p.focus('#view-all'); await p.keyboard.press('Enter');
    const all = await p.evaluate(() => ({edges: [...document.querySelectorAll('#edges path.edge')].map(e => e.dataset.c).sort(), expected: conns().map(c => c.id).sort()}));
    ok(all.edges.length === 32 && JSON.stringify(all.edges) === JSON.stringify(all.expected), 'Show all draws exactly the catalog connections among selected products');
    ok(await snapshot() === before, 'showing all connections changes no products, service choices or priced totals');
    await p.click('.node[data-p="cja"]');
    ok(await p.evaluate(() => fcur() === 'cja' && !showAllEdges && document.querySelectorAll('#edges path.edge').length === linksOf('cja').length), 'clicking a product from the full map focuses its connections');
    await p.focus('#view-one'); await p.keyboard.press('Space');
    ok(await p.locator('#edges path.edge').count() === 0 && await snapshot() === before, 'keyboard selection returns to Explore without changing scope or fees');

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
    const guidance = await p.innerText('#card [data-l="XA18"] .tip');
    ok(guidance.includes('Keep it if') && guidance.includes('Remove it if') && guidance.includes('Commerce PaaS') && await snapshot() === included,
      'clicking the i says when to keep and when to remove the service, and changes no fees', guidance);
    await p.click('#card [data-t="XA18"]');
    ok(await p.evaluate(() => !counted('XA18') && counted('XA19')) && (await p.innerText('#card [data-l="XA18"] .tip')).includes('Add it if'),
      'the partner removes a service that does not apply, and its guidance then says when to add it back');

    await seed(['eds', 'cja']);
    await p.click('.ib[data-c="eds-cja"]');
    await p.click('#card [data-t="EDC01"]');
    ok(await p.evaluate(() => counted('EDC01') && !has('aemsites')), 'a partner can select Edge Delivery measurement without a separate AEM Sites work package');

    await seed(['commerce']);
    await p.click('.node[data-p="commerce"]');
    const commerce = await p.evaluate(() => ({open: document.querySelector('#card details.more').open, rows: [...document.querySelectorAll('#card .ln')].map(e => ({id: e.dataset.l, status: e.querySelector('.fee')?.textContent, add: e.querySelector('[data-t]')?.getAttribute('aria-label')})), footer: document.querySelector('#card .ft').textContent, total: totals()}));
    ok(commerce.open && commerce.rows.length === 7 && commerce.rows.every(r => /^CE0[1-7]$/.test(r.id)), 'Commerce exposes all seven available product services by default');
    ok(commerce.rows.every(r => r.status === 'Not selected' && r.add.startsWith('Add ') && !r.add.startsWith('Add back ')) && commerce.footer.includes('No product services selected'), 'unselected services are clearly labelled even before a rate is entered');
    ok(commerce.total.n === 0 && commerce.total.one === 0 && commerce.total.mon === 0, 'viewing available Commerce services does not select or charge for them');
    await p.click('#card details.more summary'); await p.waitForTimeout(30);
    await p.fill('#rate', '150');
    ok(await p.$eval('#card details.more', d => !d.open), 'a manually collapsed available-services list stays collapsed after refresh');
    await p.click('#card details.more summary'); await p.waitForTimeout(30);
    await p.click('#card [data-t="CE01"]');
    const added = await p.evaluate(() => ({n: ownerTotal(P.commerce).n, fee: totals().one, expected: fee('CE01'), copies: document.querySelectorAll('#card [data-l="CE01"]').length, open: document.querySelector('#card details.more').open, selected: all(P.commerce).filter(counted)}));
    ok(added.n === 1 && added.fee === added.expected && added.copies === 1 && added.selected.join() === 'CE01', 'adding one available service selects and prices exactly that service once');
    ok(added.open && await p.$eval('#card details.more summary', e => e.textContent.includes('Available services (6)')), 'the remaining available services stay visible after one is added');
    await p.click('#card [data-t="CE01"]');
    ok(await p.evaluate(() => ownerTotal(P.commerce).n === 0 && totals().one === 0 && document.querySelector('#card [data-l="CE01"] .fee').textContent === 'Not selected'), 'removing the service returns it to Not selected with no product fee');

    await seed(['cja']);
    await p.click('.node[data-p="cja"]');
    const defaultLine = await p.evaluate(() => P.cja.lines.find(l => defOf(l) && met(l)));
    await p.click('#card [data-t="' + defaultLine + '"]');
    ok(await p.$eval('#card [data-l="' + defaultLine + '"]', e => e.querySelector('.fee').textContent === 'Not selected' && !e.querySelector('[data-t]').getAttribute('aria-label').includes('Add back') && getComputedStyle(e.querySelector('.nm')).textDecorationLine === 'none'), 'an off starting service has the same clear status and readable name');

    await seed(products, ['crm', 'bi', 'dwh']);
    await p.click('.node[data-p="commerce"]'); await p.click('#fb-svc');
    ok((await p.textContent('#card .connection-note')).includes('shown separately'), 'product cards distinguish their own services from connection services');
    await p.setViewportSize({width: 390, height: 844});
    await p.evaluate(() => hideCard(true)); await p.waitForTimeout(400);
    await p.click('#view-all'); await p.waitForTimeout(400);
    const mobile = await p.evaluate(() => ({overflow: document.documentElement.scrollWidth > innerWidth + 1, buttons: ['view-one', 'view-all'].map(id => { const r = document.getElementById(id).getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.height >= 44; }), edges: document.querySelectorAll('#edges path.edge').length, expected: conns().length}));
    ok(!mobile.overflow && mobile.buttons.every(Boolean) && mobile.edges === mobile.expected, 'mobile controls remain visible and tappable without page overflow; the full map scrolls inside the canvas');
    await p.click('#view-one');
    await p.evaluate(() => { fsel = 'commerce'; refocus(); pinned = true; showCard('p', 'commerce'); });
    await p.waitForTimeout(400);
    const mobileCard = await p.$eval('#card', e => { const r = e.getBoundingClientRect(); return r.left >= -1 && r.right <= innerWidth + 1 && e.scrollWidth <= e.clientWidth + 1; });
    ok(mobileCard, 'the expanded Commerce card fits the phone width');

    await seed(['bv', 'eds', 'so', 'cja', 'commerce', 'target', 'ajo', 'aemassets', 'frameio', 'express'], ['cdn'], 'universal');
    ok(await p.locator('.node[data-p="aemsites"]').count() === 0 && await p.inputValue('.node[data-p="eds"] select[data-choice="authoring"]') === 'universal',
      'the crowded mobile canvas keeps the selected AEM authoring method on one Sites offering');
    const beforeOpening = await snapshot();
    ok(await p.locator('.ib[data-c]:visible').count() === 0, 'the initial crowded focus view has no visible lightning buttons');
    await p.evaluate(() => { fsel = 'commerce'; refocus(); });
    await p.waitForTimeout(400);
    await p.locator('.ib[data-c="commerce-eds"]').tap();
    ok(await p.isVisible('#card') && await p.evaluate(() => document.querySelector('#card').contains(document.activeElement)), 'a touch-opened connection card takes keyboard focus');
    await p.locator('#card [data-tip="XA18"]').tap();
    const fits = await p.locator('#card [data-l="XA18"] .tip').evaluate(tip => {
      const card = tip.closest('#card'), box = card.getBoundingClientRect(), text = tip.getBoundingClientRect();
      return text.width > 0 && box.left >= -1 && box.right <= innerWidth + 1 && text.left >= box.left - 1 && text.right <= box.right + 1 && card.scrollWidth <= card.clientWidth + 1;
    });
    ok(fits, 'the tapped guidance and its card fit the 390px viewport');
    await p.keyboard.press('Escape');
    ok(await p.isHidden('#card') && await snapshot() === beforeOpening, 'reading the guidance on a phone preserves all service choices and fees');

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
    ok(errors.length === 0, 'no browser errors', errors.join('; '));
  } finally { await browser.close(); server.close(); }
  if (fails) { console.error(fails + ' checks failed'); process.exitCode = 1; } else console.log('ALL CANVAS VIEW CHECKS PASSED');
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });
