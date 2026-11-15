// Run from the repo root after building site/: node test_canvas_navigation.js
// runNavigationChecks also accepts a DOM driver to exercise the same shipped
// scripts and handlers in environments where Chromium cannot open a local socket.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const SITE_LINES = ['SI02', 'SI04', 'SI06'];
const TRACKING = ['AXA04', 'AXA05'];
const routeToServices = page => page.follow('.tabs [data-tab="services"]', 'sow/index.html#services');
const routeToBuild = page => page.follow('.steps [data-build]', 'index.html');
const click = (page, selector) => page.evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);

async function addProduct(page, id) {
  await page.evaluate("if (document.getElementById('add-menu').hidden) document.getElementById('add-btn').click()");
  await click(page, '#add-menu [data-add="' + id + '"]');
  await page.evaluate("if (!document.getElementById('add-menu').hidden) document.getElementById('add-btn').click()");
}

async function start(page, ids) {
  await click(page, '#picker-list [data-play="custom"]');
  for (const id of ids) {
    if (id === 'cdn') {
      await click(page, '#out-btn');
      await click(page, '#out-menu [data-out="cdn"]');
    } else {
      await addProduct(page, id);
    }
  }
  await page.evaluate("const rateField=document.getElementById('rate');rateField.value='185';rateField.dispatchEvent(new Event('input',{bubbles:true}));");
  await click(page, '#size [data-size="large"]');
}

async function openCard(page, id) {
  await click(page, '.node[data-p="' + id + '"]');
  // A crowded map's first click focuses the product; the next opens its card.
  if (!(await page.evaluate(`card?.id===${JSON.stringify(id)}`))) {
    await click(page, '.node[data-p="' + id + '"]');
  }
}
async function toggleBuildLine(page, id) {
  await click(page, '#card [data-t="' + id + '"]');
}
async function snapshot(page) {
  return JSON.parse(await page.evaluate(`JSON.stringify({
    one: totals().one, monthly: totals().mon, term: totals().yr,
    products: prods().map(p=>p.id).sort(),
    selected: [...prods(), ...conns()].flatMap(all).filter(counted).sort()
  })`));
}

async function runNavigationChecks(newSession) {
  const failures = [];
  async function check(name, run) {
    try { await run(); console.log('PASS ' + name); }
    catch (err) { failures.push(name + ': ' + err.message); console.error('FAIL ' + failures.at(-1)); }
  }
  async function useSession(run) {
    const page = await newSession();
    try { return await run(page); } finally { await page.close(); }
  }
  const addEds = page => addProduct(page, 'eds');
  const switchToPublish = async page => { await openCard(page, 'eds'); await click(page, '#card [data-switch-publish]'); };
  const enableHybrid = async page => {
    await click(page, '[data-route="aemsites-eds"]');
    await toggleBuildLine(page, 'AXD04');
  };
  const quoteIds = ['bv', 'so', 'aemsites', 'cdn'];
  const analyticsIds = ['aemsites', 'eds', 'cja'];
  const cases = [
    {name: 'add Edge Delivery', ids: quoteIds, change: addEds, on: [], off: SITE_LINES},
    {name: 'switch to traditional AEM Publish', ids: analyticsIds, change: switchToPublish, on: [...SITE_LINES, ...TRACKING], off: []},
    {name: 'enable hybrid route', ids: analyticsIds, change: enableHybrid, on: ['AXD04', ...TRACKING], off: SITE_LINES}
  ];
  for (const test of cases) {
    await check(test.name + ' directly or after a read-only Services visit', async () => {
      async function quote(visit) {
        return useSession(async page => {
          await start(page, test.ids);
          if (visit) { await routeToServices(page); await routeToBuild(page); }
          await test.change(page);
          return snapshot(page);
        });
      }
      const direct = await quote(false);
      const after = await quote(true);
      const changed = [...new Set([...direct.selected, ...after.selected])].filter(id =>
        direct.selected.includes(id) !== after.selected.includes(id));
      console.log('  direct / via Services: ' + direct.term + ' / ' + after.term);
      assert.equal(after.term, direct.term, 'Term delta ' + (after.term-direct.term) + ' across ' + changed.join(', '));
      assert.deepEqual(after, direct);
      for (const id of test.on) assert(direct.selected.includes(id), id + ' should be on');
      for (const id of test.off) assert(!direct.selected.includes(id), id + ' should be off');
    });
  }

  await check('Build edits matching the old default survive a revised default', () => useSession(async page => {
    await start(page, quoteIds);
    await openCard(page, 'aemsites');
    await toggleBuildLine(page, 'SI02');   // out of scope
    await toggleBuildLine(page, 'SI02');   // partner deliberately includes this work
    await routeToServices(page); await routeToBuild(page); await addEds(page);
    const {selected} = await snapshot(page);
    assert(selected.includes('SI02'), 'separate site build was chosen explicitly');
    assert(!selected.includes('SI04') && !selected.includes('SI06'), 'untouched defaults must still follow EDS');
  }));

  await check('Services edits matching an old default are preserved independently of untouched rows', () => useSession(async page => {
    await start(page, quoteIds);
    await routeToServices(page);
    const id = await page.evaluate("entries().find(s=>baseId(s)==='SI04').id");
    await click(page, '[data-remove="' + id + '"]');
    await click(page, '#add-service');
    await click(page, '#available-services [data-add="' + id + '"]');
    await click(page, '#close-modal');
    await routeToBuild(page); await addEds(page);
    const {selected} = await snapshot(page);
    assert(selected.includes('SI04'), 'explicit separate cutover was lost');
    assert(!selected.includes('SI02') && !selected.includes('SI06'), 'unrelated defaults were frozen');
  }));

  await check('an explicit exclusion in Services survives returning to a scope where the row defaults on', () => useSession(async page => {
    await start(page, ['aemsites','eds','cja']);
    await routeToServices(page);
    const id = await page.evaluate("entries().find(s=>baseId(s)==='SI06').id");
    await click(page, '#add-service');
    await click(page, '#available-services [data-add="' + id + '"]');
    await click(page, '#close-modal');
    await click(page, '[data-remove="' + id + '"]');
    await routeToBuild(page); await switchToPublish(page);
    const {selected} = await snapshot(page);
    assert(!selected.includes('SI06'), 'explicitly excluded operations must stay off');
    assert(selected.includes('SI02') && selected.includes('SI04'), 'separate site build/cutover must default on again');
  }));

  await check('selecting hybrid in Services immediately selects both automatic component-tracking rows', () => useSession(async page => {
    await start(page, analyticsIds);
    await routeToServices(page);
    const id = await page.evaluate("entries().find(s=>baseId(s)==='AXD04').id");
    await click(page, '#add-service');
    await click(page, '#available-services [data-add="' + id + '"]');
    await click(page, '#close-modal');
    const selected = JSON.parse(await page.evaluate('JSON.stringify(selectedLines().map(baseId).sort())'));
    const fee = await page.evaluate('totals().totalFee');
    for (const row of ['AXD04', ...TRACKING]) assert(selected.includes(row), row + ' missing on Services');
    await routeToBuild(page);
    const build = await snapshot(page);
    assert.deepEqual(build.selected, selected);
    assert.equal(build.term, fee);
  }));

  await check('removing A01 in Services automatically offers and counts the separate default routing owner', () => useSession(async page => {
    await start(page, [...quoteIds, 'eds']);
    await routeToServices(page);
    const id = await page.evaluate("entries().find(s=>baseId(s)==='A01').id");
    await click(page, '[data-remove="' + id + '"]');
    const selected = JSON.parse(await page.evaluate('JSON.stringify(selectedLines().map(baseId).sort())'));
    const fee = await page.evaluate('totals().totalFee');
    assert(!selected.includes('A01') && selected.includes('AXC01'), 'Services must recalculate the routing owner on removal');
    await routeToBuild(page);
    const build = await snapshot(page);
    assert.deepEqual(build.selected, selected);
    assert.equal(build.term, fee);
  }));

  await check('shared delivery routing has one automatic owner and allows a deliberate second scope', () => useSession(async page => {
    await start(page, [...quoteIds, 'eds']);
    assert((await snapshot(page)).selected.includes('A01'));
    assert(!(await snapshot(page)).selected.includes('AXC01'), 'already-covered BV routing was charged twice');
    await click(page, '[data-route="aemsites-bv"]');
    await toggleBuildLine(page, 'AXC01');
    await routeToServices(page); await routeToBuild(page);
    assert((await snapshot(page)).selected.includes('AXC01'), 'explicit routing scope was lost');
  }));

  await check('new SOW draft restores automatic choices after opening in an empty browser', async () => {
    const draft = await useSession(async page => {
      await start(page, quoteIds);
      await routeToServices(page);
      return page.evaluate('JSON.stringify(state)');
    });
    await useSession(async page => {
      await start(page, ['aemsites']);
      await routeToServices(page);
      await page.evaluate('openDraftText(' + JSON.stringify(draft) + ')');
      await routeToBuild(page); await addEds(page);
      const {selected} = await snapshot(page);
      for (const id of SITE_LINES) assert(!selected.includes(id), id + ' was frozen by opening a new draft');
    });
  });

  await check('RFI merges the chosen work into an existing custom quote and preserves its automatic defaults', () => useSession(async page => {
    await start(page, ['aemsites', 'bv', 'cdn']);
    await click(page, '[data-route="cdn-bv"]');
    await page.evaluate("const cdn=document.querySelector('#card select[data-choice=cdn]');cdn.value='mixed';cdn.dispatchEvent(new Event('change',{bubbles:true}));");
    await routeToServices(page);
    const before = JSON.parse(await page.evaluate('JSON.stringify(selectedLines().map(baseId))'));
    // SI04 was automatic in the existing scope. CJ01 belongs to a newly introduced product.
    const chosenAnswer = {
      kind:'adobe', text:'Scope AEM Sites cutover and CJA data preparation', status:'used', answer:'Reviewed',
      draft:{m:{products:['aemsites','cja'], lines:['SI04','CJ01']}, sections:[], parts:{}, asks:[]}
    };
    await page.evaluate('RFPBuilder.state.questions=[' + JSON.stringify(chosenAnswer) + ']; RFPAnswers.toSow()');
    const after = JSON.parse(await page.evaluate('JSON.stringify(selectedLines().map(baseId).sort())'));
    assert.deepEqual(after, [...new Set([...before, 'CJ01'])].sort(), 'merge must preserve existing work and add only agreed rows on newly introduced products');
    assert.equal(await page.evaluate('state.canvasDecisions.custom.cdn'), 'mixed');
    await routeToBuild(page);
    const merged = await snapshot(page);
    assert(merged.products.includes('cja'));
    assert.deepEqual(merged.selected, after);
    await addEds(page);
    const changed = await snapshot(page);
    assert(changed.selected.includes('SI04') && changed.selected.includes('CJ01'), 'explicit RFI lines must survive the product change');
    assert(!changed.selected.includes('SI02') && !changed.selected.includes('SI06'), 'RFI must leave unrelated existing rows on automatic pricing');
    assert.equal(await page.evaluate('st.decisions.cdn'), 'mixed');
  }));

  await check('old Build save keeps known explicit and inferred historical quotes', () => useSession(async page => {
    // This is the old Build save format: unrecorded service choices used the then-current catalog defaults.
    const old = {v:2, play:'custom', on:['bv','so','aemsites','eds'], out:['cdn'], size:'large', rate:185,
      months:12, ls:{SI02:false}, keep:{}, decisions:{cdn:'setup'}};
    await page.evaluate(`localStorage.setItem('abv-sow-build-v1', ${JSON.stringify(JSON.stringify(old))})`);
    await page.reload();
    const before = await snapshot(page);
    assert(!before.selected.includes('SI02'), 'old explicit exclusion was lost');
    assert(before.selected.includes('SI04') && before.selected.includes('SI06'), 'old quote lost default-selected rows');
    assert(before.selected.includes('AXC01'), 'historical same-route fee should remain recoverable');
    await routeToServices(page); await routeToBuild(page);
    assert.deepEqual(await snapshot(page), before);
  }));
  if (failures.length) throw Error(failures.length + ' failed navigation scenarios');
}

async function main() {
  const {chromium} = require('playwright');
  const site = path.join(__dirname, 'site');
  const server = http.createServer((req, res) => {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    const file = path.join(site, pathname.endsWith('/') ? pathname + 'index.html' : pathname);
    if (!file.startsWith(site + path.sep) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    res.setHeader('Content-Type', file.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = 'http://127.0.0.1:' + server.address().port + '/';
  let browser;
  try {
    browser = await chromium.launch();
    await runNavigationChecks(async () => {
      const context = await browser.newContext({viewport:{width:1600,height:1000}});
      const page = await context.newPage();
      await page.goto(url, {waitUntil:'domcontentloaded'});
      return {evaluate: code => page.evaluate(code), close: () => context.close(), reload: () => page.reload(),
        follow: async (selector, dest) => {
          await Promise.all([page.waitForURL(url + dest, {waitUntil:'domcontentloaded'}), page.locator(selector).click()]);
          await page.waitForLoadState('domcontentloaded');
        }};
    });
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
module.exports = {runNavigationChecks};
if (require.main === module) main().catch(err => {console.error(err);process.exitCode=1;});
