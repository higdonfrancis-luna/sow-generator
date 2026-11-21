// Standalone Brand Concierge scope, its optional extensions, saved quotes and RFI answers.
const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');
const {open: openRfi} = require('./rfp_prototype/review_2026-11-09/harness.js');
const catalog = require('./canvas/catalog.json');
const lines = catalog.lines;
const work = [
  ['BC01', 'How would you launch Brand Concierge in a second language and test localized answers?'],
  ['BC02', 'How would you set up Brand Concierge product cards from our product catalog spreadsheet for a small store?'],
  ['BC03', 'How would you instrument Brand Concierge website analytics callbacks and test their event payloads?'],
  ['BC04', 'How would you customize the Brand Concierge chat interface to match our design system?'],
  ['BC05', 'What monthly services would you provide to review Brand Concierge engagement dashboard metrics?'],
  ['BC06', 'How would you configure Brand Concierge administrator roles and sandbox access?']
];
const added = work.map(([id]) => id);
const origin = 'https://concierge-scope.test/';
const site = path.join(__dirname, 'site');
async function canvas(browser, saved) {
  const ctx = await browser.newContext({viewport: {width: 1440, height: 1000}, acceptDownloads: true});
  await ctx.route(origin + '**', route => {
    const name = new URL(route.request().url()).pathname;
    return route.fulfill({path:path.join(site, name.endsWith('/') ? name + 'index.html' : name)});
  });
  const p = await ctx.newPage();
  if (saved) await p.addInitScript(s => {
    if (!localStorage.getItem('abv-sow-build-v1')) localStorage.setItem('abv-sow-build-v1', JSON.stringify(s));
  }, saved);
  await p.goto(origin); await p.waitForFunction(() => window.READY);
  return p;
}
const selected = p => p.evaluate(() => [...prods(), ...conns()].flatMap(all).filter(counted));
const show = p => p.locator('#stage .node[data-p="bc"]').dblclick();
async function checkServices() {
  const b = await chromium.launch();
  try {
    const p = await canvas(b);
    await p.locator('#picker [data-play="custom"]').click();
    await p.locator('#add-menu [data-add="bc"]').click();
    await p.keyboard.press('Escape');
    await p.locator('#rate').fill('150');
    assert.deepEqual(await selected(p), ['F02']);
    assert.deepEqual(await p.locator('#stage .node').evaluateAll(nodes => nodes.map(n => n.dataset.p)), ['bc']);
    for (const [size, hours, tests, pages, routes] of [['small',320,50,5,1],['large',1280,300,25,2],['typical',640,150,10,1]]) {
      await p.locator('#size [data-size="' + size + '"]').click();
      await show(p);
      const details = p.locator('#card details[data-more="scope:F02"]');
      const summary = details.locator('summary');
      assert.equal((await summary.innerText()).trim(), 'What the implementation includes');
      if (!await details.evaluate(el => el.open)) await summary.click();
      const description = await details.innerText();
      for (const part of [tests + ' test conversations', pages + ' pages', routes + ' handoff route']) {
        assert.ok(description.includes(part), size + ': ' + description);
      }
      await summary.click();
      assert.deepEqual(await selected(p), ['F02']);
      assert.equal(await p.evaluate(() => totals().yr), hours * 150);
      await p.keyboard.press('Escape');
    }
    await show(p);
    const extras = p.locator('#card details.more').filter({has:p.locator('summary', {hasText:'Available services'})});
    await extras.locator(':scope > summary').click();
    assert.deepEqual(new Set(await extras.locator('[data-l]').evaluateAll(es => es.map(e => e.dataset.l))), new Set(['FSI01',...added]));
    for (const id of added) {
      const row = p.locator('#card [data-l="' + id + '"]');
      assert.equal(await row.locator('a.src').getAttribute('href'), lines[id].url);
      assert.match(lines[id].url, /^https:\/\/experienceleague\.adobe\.com\//);
      await row.locator('[data-t]').click();
    }
    await p.keyboard.press('Escape');
    const expected = new Set(['F02',...added]);
    assert.deepEqual(new Set(await selected(p)),expected);
    assert.equal((await selected(p)).length, expected.size);
    await p.reload(); await p.waitForFunction(() => window.READY);
    assert.deepEqual(new Set(await selected(p)),expected);
    await p.locator('.tabs [data-tab="services"]').click();
    await p.waitForURL('**/sow/index.html#services');
    for (const id of added) {
      const card = p.locator('.service-card[data-line="CANVAS-' + id + '"]');
      assert.equal(Number(await card.locator('[data-line-field="hours"]').inputValue()), lines[id].base);
      assert.ok((await card.locator('[data-line-field="scope"]').inputValue()).trim().length > 40, id);
      assert.ok((await card.locator('a').evaluateAll(es => es.map(a => a.href))).includes(lines[id].url), id);
    }
    const expectedFee = [...expected].reduce((sum,id) => sum + lines[id].base * 150 * (lines[id].unit === 'monthly' ? 12 : 1), 0);
    assert.equal(await p.evaluate(() => totals().totalFee), expectedFee);
    await p.locator('[data-step="document"]').click();
    const doc = await p.locator('#sow-preview').innerText();
    for (const id of added) assert.ok(doc.includes(lines[id].name), id);
    const [download] = await Promise.all([p.waitForEvent('download'),p.locator('#save-draft').click()]);
    const draft = await download.path();
    const reopened = await canvas(b);
    await reopened.locator('#draft-file').setInputFiles(draft);
    await reopened.waitForFunction(() => window.READY && st.play === 'custom');
    assert.deepEqual(new Set(await selected(reopened)),expected);
    assert.equal(await reopened.evaluate(() => totals().yr), expectedFee);

    const legacy = await canvas(b, {v:2,play:'custom',on:['bc'],out:[],ls:{F02:false,FSI01:true},rate:150,
      size:'typical',months:12,serviceDefaults:true,selectionVersion:1,combinedDefaultsVersion:1});
    assert.deepEqual(await selected(legacy), ['FSI01']);
    assert.equal(await legacy.evaluate(() => totals().yr), 32*150*12);
    console.log('Standalone scope, size-specific implementation, six service choices, SOW, draft and prior quote passed.');
  } finally { await b.close(); }
}
async function checkRfi() {
  const h = await openRfi();
  try {
    for (const [id,question] of work) {
      const {questions} = await h.text(question);
      const draft = questions[0]?.draft;
      assert.ok(draft?.lines.some(l => l.id === id), id + ': ' + question + ' / ' + JSON.stringify(draft?.lines));
      assert.ok(draft.sources.some(s => s.url === lines[id].url), id + ': missing Adobe source');
    }
    assert.deepEqual(h.errors,[]);
    console.log('All six RFI questions matched the requested service and its Adobe source.');
  } finally { await h.close(); }
}
(async () => { await checkServices(); await checkRfi(); })().catch(e => {console.error(e);process.exitCode=1;});
