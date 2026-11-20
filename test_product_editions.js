// Exercise the existing canvas pickers, their service gates, and the SOW and draft handoff.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');

const origin = 'https://sow-editions.test/';
const site = path.join(__dirname, 'site');
const catalog = require('./canvas/catalog.json');
const methods = require('./rfp_method.json').services;
const sourced = require('./canvas/research/wave9_editions.json');
const editionKeys = ['ajoPackage', 'assetsPackage', 'sitesDeployment', 'targetEdition', 'frameVersion', 'marketoPackage', 'workflowPackage'];

assert(editionKeys.every(key => catalog.versions[key]));
assert(sourced.products.flatMap(product => product.lines).every(line =>
  line.source.url.startsWith('https://experienceleague.adobe.com/') && line.evidence && methods[line.id]));

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  try {
    const open = async (products, viewport = {width: 1440, height: 1000}, storage) => {
      const ctx = await browser.newContext({viewport, acceptDownloads: true});
      await ctx.route('https://fonts.googleapis.com/**', r => r.fulfill({contentType: 'text/css', body: ''}));
      await ctx.route(origin + '**', r => {
        let name = new URL(r.request().url()).pathname;
        if (name.endsWith('/')) name += 'index.html';
        const file = path.join(site, name);
        return fs.existsSync(file) ? r.fulfill({path: file}) : r.fulfill({status: 404, body: ''});
      });
      const page = await ctx.newPage();
      page.on('pageerror', e => errors.push(e.message));
      if (storage) await page.addInitScript(values => {
        for (const [key, value] of Object.entries(values)) {
          if (localStorage.getItem(key) === null) localStorage.setItem(key, value);
        }
      }, storage);
      await page.goto(origin);
      await page.waitForFunction(() => window.READY);
      if (products) {
        await page.locator('#picker [data-play="custom"]').click();
        await page.keyboard.press('Escape');
        for (const product of products) await page.evaluate(id => addProduct(id), product);
      }
      return page;
    };
    const pick = (page, key, value, inCard = false) => page.locator(`${inCard ? '#card' : '#stage'} select[data-choice="${key}"]`).selectOption(value);
    const counted = (page, ids) => page.evaluate(ids => ids.filter(counted), ids);
    const available = (page, ids) => page.evaluate(ids => ids.filter(id => !lineGate(id)), ids);
    const openCard = (page, id) => page.evaluate(id => showCard('p', id), id);
    const check = async (label, run) => { await run(); console.log('PASS', label); };

    await check('Journey Optimizer packages preserve shared work and scope the documented journey capabilities', async () => {
      const p = await open(['ajo', 'target']);
      const ids = ['JO01', 'JO02', 'JO05', 'JO07', 'JO08', 'JO09', 'JO10', 'XA07'];
      assert.deepEqual(await counted(p, ids), ['JO07', 'JO09']);
      await pick(p, 'ajoPackage', 'select');
      assert.deepEqual(await counted(p, ids), ['JO07', 'JO09']);
      await pick(p, 'ajoPackage', 'prime');
      assert.deepEqual(await counted(p, ids), ['JO02', 'JO05', 'JO07']);
      await pick(p, 'ajoPackage', 'ultimate');
      assert.deepEqual(await counted(p, ids), ['JO02', 'JO05', 'JO07', 'XA07']);
      await pick(p, 'ajoPackage', 'starter');
      assert.deepEqual(await counted(p, ids), ['JO05', 'JO07', 'JO10', 'XA07']);
      await p.reload();
      await p.waitForFunction(() => window.READY);
      assert.equal(await p.locator('select[data-choice="ajoPackage"]').inputValue(), 'starter');
      await pick(p, 'ajoPackage', '');
      assert.deepEqual(await counted(p, ids), ['JO07', 'JO09']);
      await p.context().close();
    });

    await check('AEM Assets Prime and Ultimate scope their own onboarding and processing', async () => {
      const p = await open(['aemassets']);
      const ids = ['AS01', 'AS04', 'AS08', 'AS09'];
      assert.deepEqual(await counted(p, ids), ['AS08', 'AS09']);
      await pick(p, 'assetsPackage', 'prime');
      assert.deepEqual(await counted(p, ids), ['AS08', 'AS09']);
      await pick(p, 'assetsPackage', 'ultimate');
      assert.deepEqual(await counted(p, ids), ['AS01', 'AS04']);
      await p.context().close();
    });

    await check('AEM Sites scopes Cloud Service, service pack work, and the optional 6.5 LTS upgrade', async () => {
      const p = await open(['aemsites']);
      const ids = ['SI01', 'SI02', 'SI04', 'SI05', 'SI06', 'SI11', 'SI12', 'SI13'];
      assert.deepEqual(await counted(p, ids), ['SI02', 'SI05']);
      await pick(p, 'sitesDeployment', 'cloud');
      assert.deepEqual(await counted(p, ids), ['SI01', 'SI02', 'SI04', 'SI05', 'SI06']);
      await pick(p, 'sitesDeployment', 'lts');
      assert.deepEqual(await counted(p, ids), ['SI02', 'SI05', 'SI11', 'SI13']);
      assert.deepEqual(await available(p, ['SI12']), []);
      await pick(p, 'sitesDeployment', 'v65');
      assert.deepEqual(await available(p, ['SI12']), ['SI12']);
      assert.deepEqual(await counted(p, ['SI12']), []);
      await p.evaluate(() => { addProduct('eds'); showCard('p', 'eds'); });
      assert.equal(await p.locator('#card select[data-choice="sitesDeployment"]').inputValue(), 'v65');
      await pick(p, 'sitesDeployment', 'lts', true);
      assert.equal(await p.locator('#card select[data-choice="sitesDeployment"]').inputValue(), 'lts');
      await p.context().close();
    });

    await check('Target shares core setup and preserves selections while changing editions', async () => {
      const p = await open(['target'], {width: 390, height: 844});
      assert.deepEqual(await counted(p, ['TG02', 'TG06']), ['TG06']);
      await pick(p, 'targetEdition', 'standard');
      assert.deepEqual(await available(p, ['TG04']), []);
      await openCard(p, 'target');
      await p.locator('#card [data-t="TG06"]').click();
      await pick(p, 'targetEdition', 'premium');
      assert.deepEqual(await counted(p, ['TG02', 'TG06']), []);
      assert.deepEqual(await available(p, ['TG02', 'TG04']), ['TG02', 'TG04']);
      const fits = await p.locator('#stage select[data-choice="targetEdition"]').evaluate(select => {
        const node = select.closest('.node').getBoundingClientRect();
        const picker = select.getBoundingClientRect();
        return picker.left >= node.left && picker.right <= node.right && picker.bottom <= node.bottom + 1;
      });
      assert(fits);
      await p.context().close();
    });

    await check('Frame.io selects the API, metadata and rights protection that match its version', async () => {
      const p = await open(['frameio']);
      const ids = ['FR04', 'FR05', 'FR06'];
      await pick(p, 'frameVersion', 'legacy');
      assert.deepEqual(await available(p, ids), []);
      await pick(p, 'frameVersion', 'v4select');
      assert.deepEqual(await available(p, ids), ['FR05', 'FR06']);
      await pick(p, 'frameVersion', 'v4prime');
      assert.deepEqual(await available(p, ids), ids);
      await p.context().close();
    });

    await check('Marketo Engage retains the CRM setup and selects the entitled lifecycle scope', async () => {
      const p = await open(['marketo']);
      const ids = ['MK02', 'MK04', 'MK08', 'MK09'];
      for (const value of ['growth', 'select']) {
        await pick(p, 'marketoPackage', value);
        assert.deepEqual(await counted(p, ids), ['MK02', 'MK08']);
      }
      for (const value of ['prime', 'ultimate']) {
        await pick(p, 'marketoPackage', value);
        assert.deepEqual(await counted(p, ids), ['MK02', 'MK04']);
        assert.deepEqual(await available(p, ['MK09']), ['MK09']);
      }
      await openCard(p, 'marketo');
      assert.match(await p.locator('#card').innerText(), /Marketo Measure is included with Ultimate/);
      await p.context().close();
    });

    await check('Workfront changes Workflow services independently of the purchase choice and carries them into the SOW', async () => {
      const p = await open(['workfront', 'gspm']);
      await openCard(p, 'workfront');
      const ids = ['WF07', 'WF08', 'WF09', 'WF10'];
      await pick(p, 'workflowPackage', 'select', true);
      assert.deepEqual(await available(p, ids), ['WF09']);
      await pick(p, 'workflowPackage', 'prime', true);
      assert.deepEqual(await available(p, ids), ['WF07', 'WF08', 'WF09']);
      await pick(p, 'workflowPackage', 'ultimate', true);
      assert.deepEqual(await available(p, ids), ids);
      await pick(p, 'workflowPackage', 'fusion', true);
      assert.deepEqual(await available(p, ids), ids);
      assert.equal(await p.locator('#stage select[data-choice="workfrontVersion"]').inputValue(), 'after');
      assert.deepEqual(await available(p, ['XG01']), []);
      await p.evaluate(() => { st.ls.WF10 = true; hideCard(true); render(); });
      await p.locator('#save').click();
      await p.waitForURL('**/sow/index.html#scope');
      const sow = await p.evaluate(() => ({
        editions: state.canvasDecisions.custom,
        selected: selectedLines().map(row => row.id),
        count: selectedLines().length,
      }));
      assert.equal(sow.editions.workflowPackage, 'fusion');
      assert.equal(sow.editions.workfrontVersion, 'after');
      assert(sow.selected.includes('CANVAS-WF10'));
      assert(!sow.selected.includes('CANVAS-XG01'));
      const [download] = await Promise.all([p.waitForEvent('download'), p.locator('#save-draft').click()]);
      const draft = await download.path();
      const q = await open();
      await q.locator('#draft-file').setInputFiles(draft);
      await q.waitForFunction(() => window.READY && st.play === 'custom' && st.decisions.workflowPackage === 'fusion');
      assert.deepEqual(await counted(q, ['WF10','XG01']), ['WF10']);
      await q.context().close();
      await p.context().close();
    });

    await check('A saved quote from before the new pickers retains its selected services and estimate', async () => {
      const storage = {'abv-sow-build-v1': JSON.stringify({
        play: 'custom', on: ['ajo', 'target'], out: [],
        decisions: {authoring: '', workfrontVersion: 'before', commerceVersion: 'saas'},
        serviceDefaults: true, combinedDefaultsVersion: 1, selectionVersion: 1, rate: 175, v: 2,
        ls: {JO03: true, TG02: false, TG04: true},
      })};
      const p = await open(null, {width: 1440, height: 1000}, storage);
      assert.deepEqual(await counted(p, ['JO01','JO02','JO03','JO05','JO07','JO09','TG02','TG04','TG06']),
        ['JO01','JO02','JO03','JO05','TG04']);
      assert.equal(await p.locator('#stage select[data-choice="ajoPackage"]').inputValue(), '');
      await p.locator('#save').click();
      await p.waitForURL('**/sow/index.html#scope');
      const preserved = await p.evaluate(() => selectedLines().map(s => s.id));
      assert(preserved.includes('CANVAS-JO01') && preserved.includes('CANVAS-JO03') && preserved.includes('CANVAS-TG04'));
      assert(!preserved.includes('CANVAS-JO07') && !preserved.includes('CANVAS-TG06'));
      await p.context().close();
    });

    assert.deepEqual(errors, []);
    console.log('All product edition scenarios passed.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
