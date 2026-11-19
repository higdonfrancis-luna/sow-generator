// Run after building site/: node test_canvas_authoring.js
const assert = require('node:assert/strict');
const path = require('node:path');

const authoringSelect = '.node[data-p="eds"] select[data-choice="authoring"]';
const aemAuthorRows = ['SI01', 'SI05', 'AXD01', 'AXD02', 'AXC05'];
const separateSiteRows = ['SI02', 'SI04', 'SI06'];
const documentRows = ['CS1', 'CS2'];

const read = async (page, expression) => JSON.parse(await page.evaluate('JSON.stringify(' + expression + ')'));
const click = (page, selector) => page.evaluate('document.querySelector(' + JSON.stringify(selector) + ').click()');
const services = page => page.follow('.tabs [data-tab="services"]', 'sow/index.html#services');
const build = page => page.follow('.steps [data-build]', 'index.html');

async function start(page, play = 'aem') {
  await click(page, '#picker-list [data-play="' + play + '"]');
  await page.evaluate("document.getElementById('rate').value = '185'; document.getElementById('rate').dispatchEvent(new Event('input', {bubbles:true}));");
  await click(page, '#size [data-size="large"]');
}

/* Nov 18 2026: a ready-made play starts with every outside system it offers (the AEM play: the CDN, Search data, Authoring docs, ChatGPT and
   Claude). The checks of switching the authoring choice run on the AEM play as it started before, the CDN its one outside system */
async function startAsBefore(page) {
  await start(page);
  await page.evaluate("for (const id of st.out.filter(x => x !== 'cdn')) removeOutside(id)");
}

async function addCustomProduct(page, id) {
  await page.evaluate("if (document.getElementById('add-menu').hidden) document.getElementById('add-btn').click()");
  if (id === 'eds' || id === 'aemsites') {
    await page.evaluate("{const paths = document.querySelector('#add-menu details[data-sites-offering]'); if (paths && !paths.open) paths.querySelector('summary').click()}");
  }
  await click(page, '#add-menu [data-add="' + id + '"]');
}

async function addOutside(page, id) {
  await click(page, '#out-btn');
  await click(page, '#out-menu [data-out="' + id + '"]');
}

async function customAemPlay(page, startWithPublish = false) {
  await start(page, 'custom');
  await addCustomProduct(page, 'bv');
  await addCustomProduct(page, 'so');
  await addOutside(page, 'cdn');
  if (startWithPublish) await addCustomProduct(page, 'aemsites');
  await addCustomProduct(page, 'eds');
  if (!startWithPublish) await choose(page, /Universal Editor/);
  assert.equal((await options(page)).value, 'universal');
  assert.equal((await buildQuote(page)).total, 1170680);
}

async function addFromRfi(page, products, lines) {
  const answer = {kind:'adobe', text:'Scope the requested implementation work', status:'used', answer:'Reviewed',
    draft:{m:{products, lines}, sections:[], parts:{}, asks:[]}};
  await page.evaluate('RFPBuilder.state.questions=[' + JSON.stringify(answer) + ']; RFPAnswers.toSow()');
}

async function openPreviousBuild(page, products, outside) {
  const saved = {v:2, selectionVersion:1, combinedDefaultsVersion:1, play:'custom',
    on:products, out:outside, keep:{}, ls:{}, size:'large', rate:185, months:12};
  await page.evaluate(`localStorage.setItem('abv-sow-build-v1', ${JSON.stringify(JSON.stringify(saved))})`);
  await page.reload();
}

async function options(page) {
  const result = await read(page, `(function() {
    const s = document.querySelector(${JSON.stringify(authoringSelect)});
    if (!s) return null;
    const label = s.closest('label') || (s.id && document.querySelector('label[for="' + s.id + '"]'));
    return {value:s.value, enabled:!s.hasAttribute('disabled'), label:s.getAttribute('aria-label') || label?.textContent,
      buttonParent:!!s.parentElement.closest('button,[role=button]'),
      options:Array.from(s.querySelectorAll('option'), o=>({value:o.value,text:o.textContent.trim()}))};
  }())`);
  assert(result, 'Build should render the authoring dropdown inside the visible Edge Delivery offering');
  assert.equal(result.enabled, true);
  assert.match(result.label, /author/i, 'the select must have an accessible descriptive label');
  assert.equal(result.buttonParent, false, 'the dropdown must be independently focusable, outside the node button');
  assert.equal(result.options.length, 3);
  assert.match(result.options[0].text, /choose.*author/i);
  return result;
}

async function choose(page, label) {
  const fields = await options(page);
  const option = label ? fields.options.find(o => label.test(o.text)) : fields.options[0];
  assert(option, 'Missing authoring option ' + label);
  await page.evaluate(`(function() {
    const s=document.querySelector(${JSON.stringify(authoringSelect)});
    s.value=${JSON.stringify(option.value)};
    s.dispatchEvent(new Event('change', {bubbles:true}));
  }())`);
  assert.equal((await options(page)).value, option.value);
  return option.value;
}

async function buildQuote(page) {
  const quote = await read(page, `({ids:[...prods(), ...conns()].flatMap(all).filter(counted).sort(),
      one:totals().one, monthly:totals().mon, total:totals().yr})`);
  assert.equal(quote.ids.length, new Set(quote.ids).size, 'a combined card must count each service once');
  return quote;
}

const servicesQuote = page => read(page, `({ids:selectedLines().map(baseId).sort(), one:totals().oneFee,
  monthly:totals().monthFee, total:totals().totalFee})`);

async function roundTrip(page) {
  const expected = await buildQuote(page);
  const method = (await options(page)).value;
  await services(page);
  const onServices = await servicesQuote(page);
  assert.deepEqual(onServices, expected, 'Build and Services must agree on the whole service set and fees');
  const migrationScope = {universal:'into AEM Author', documents:'into Word or Google Docs', '':'content source confirmed in discovery'}[method];
  if (expected.ids.includes('A02')) {
    const scope = await page.evaluate("selectedLines().find(s=>baseId(s)==='A02').scope");
    assert(scope.includes(migrationScope), 'migration scope should follow the chosen authoring method');
    const hasText = await page.evaluate('SOWDocument.render(docState(),selectedLines(),totals()).includes(' + JSON.stringify(migrationScope) + ')');
    assert(hasText, 'the actual SOW must use the matching migration scope');
  }
  await build(page);
  assert.deepEqual(await buildQuote(page), expected, 'a Services visit cannot change the Build quote');
  assert.equal((await options(page)).value, method, 'the dropdown answer must survive the handoff');
  return expected;
}

function expectRows(quote, list, on) {
  for (const id of list) assert.equal(quote.ids.includes(id), on, id + ' should be ' + (on ? 'included' : 'excluded'));
}

async function runAuthoringChecks(newSession) {
  let failures = 0;
  async function check(name, run) {
    const page = await newSession();
    try { await run(page); console.log('PASS ' + name); }
    catch (error) { failures++; console.error('FAIL ' + name + ': ' + error.message); }
    finally { await page.close(); }
  }

  await check('the named play renders a single customer-facing AEM offering and awaits discovery', async page => {
    await start(page);
    const field = await options(page);
    assert.equal(field.value, field.options[0].value);
    assert.deepEqual(Array.from(field.options.slice(1), o => o.text).sort(), ['AEM Universal Editor', 'Word or Google Docs'].sort());
    const nodes = await read(page, 'Array.from(document.querySelectorAll(".node"), n=>n.dataset.p).sort()');
    assert.deepEqual(nodes, ['bv','cdn','chatgpt','claude','csrc','eds','search','so']);
    const pending = await roundTrip(page);
    expectRows(pending, aemAuthorRows, false);
    expectRows(pending, separateSiteRows, false);
    // Nov 18 2026: Authoring docs starts on the canvas, so its setup counts while the choice awaits discovery; the write-back stays optional
    expectRows(pending, ['CS1', 'SD1'], true);
    expectRows(pending, ['CS2'], false);
    assert.equal(pending.total, 1107040 + (32 + 16) * 185);
    expectRows(pending, ['A01', 'SO2', 'OX1'], true);
    // Native key behavior and focus restoration require a real browser.
    if (page.keyboardSelect) {
      await page.keyboardSelect(authoringSelect, 'End');
      assert.equal((await options(page)).value, 'documents');
      await page.keyboardSelect(authoringSelect, 'Home');
      assert.equal((await options(page)).value, field.options[0].value);
    }
  });

  await check('switching the authoring method recomputes Services and fees in both directions', async page => {
    await startAsBefore(page);
    const pending = await buildQuote(page);
    await choose(page, /Universal Editor/);
    const aem = await roundTrip(page);
    expectRows(aem, aemAuthorRows, true);
    expectRows(aem, separateSiteRows, false);
    expectRows(aem, documentRows, false);
    assert.equal(aem.total, 1170680, 'the established AEM-authoring quote must stay reproducible');
    assert.equal(aem.monthly, 37000);
    const visiblePairs = await read(page, `Array.from(document.querySelectorAll('#edges path.edge'),
      edge=>[edge.dataset.s,edge.dataset.e].sort().join('/')).sort()`);
    assert.deepEqual(visiblePairs, ['bv/cdn','bv/eds','eds/so'], 'the shared AEM offering should have one line per neighbor and no self-connection');
    assert.equal(await page.evaluate('document.querySelectorAll(\'.node[data-p="aemsites"]\').length'), 0);
    await choose(page, /Word or Google Docs/);
    const docs = await roundTrip(page);
    expectRows(docs, aemAuthorRows, false);
    expectRows(docs, separateSiteRows, false);
    expectRows(docs, ['CS1'], true);
    expectRows(docs, ['CS2'], false);
    assert.equal(docs.total, pending.total + 32 * 185);
    assert.equal(docs.monthly, pending.monthly);
    await choose(page, null);
    assert.deepEqual(await roundTrip(page), pending, 'unanswered must be a real, reversible state');
    await choose(page, /Universal Editor/);
    assert.deepEqual(await buildQuote(page), aem, 'switching back cannot accumulate service hours');
  });

  await check('a saved two-card AEM draft reopens with its original quote and one AEM card', async page => {
    await openPreviousBuild(page, ['bv','so','eds','aemsites'], ['cdn']);
    const field = await options(page);
    assert.equal(field.value, field.options.find(o=>o.text==='AEM Universal Editor').value);
    const quote = await roundTrip(page);
    assert.equal(quote.total, 1170680);
    expectRows(quote, aemAuthorRows, true);
    await services(page);
    const title = await page.evaluate('docTitle()');
    assert.equal((title.match(/AEM Sites/g)||[]).length, 1, 'the customer-facing SOW title should also show a single AEM offering');
    await build(page);
    assert.equal(await page.evaluate('document.querySelectorAll(\'.node[data-p="aemsites"]\').length'), 0);
  });

  await check('a legacy document-based quote retains its previously selected Optimizer write-back', async page => {
    await openPreviousBuild(page, ['bv','so','eds'], ['cdn','csrc']);
    assert.equal((await options(page)).value, 'documents');
    const quote = await roundTrip(page);
    expectRows(quote, documentRows, true);
    assert.equal(quote.total, 1115920);
    await services(page);
    const draft = await read(page, 'state');
    delete draft.canvasDecisions.custom.authoring;
    delete draft.canvasSelection.custom.choices.CS2;
    draft.canvasSelection.custom.defaults.CS2 = true;
    assert.equal(draft.estimates.custom['CANVAS-CS2'].on, true);
    await page.evaluate('openDraftText(' + JSON.stringify(JSON.stringify(draft)) + ')');
    assert.deepEqual(await servicesQuote(page), quote, 'a saved default-on estimate must also survive opening directly in Services');
    await build(page);
    assert.deepEqual(await buildQuote(page), quote);
  });

  await check('adding Sites Optimizer after reopening a legacy document quote leaves new write-back optional', async page => {
    await openPreviousBuild(page, ['bv','eds'], ['cdn','csrc']);
    assert.equal((await buildQuote(page)).total, 1052280);
    await addCustomProduct(page, 'so');
    const quote = await roundTrip(page);
    assert.equal(quote.total, 1112960);
    expectRows(quote, ['CS1', 'SO1', 'SO2'], true);
    expectRows(quote, ['CS2'], false);
  });

  await check('a saved quote with both authoring sources keeps its existing work and fees', async page => {
    await openPreviousBuild(page, ['bv','so','eds','aemsites'], ['cdn','csrc']);
    assert.equal((await options(page)).value, 'universal');
    const quote = await roundTrip(page);
    expectRows(quote, [...aemAuthorRows, ...documentRows], true);
    assert.equal(quote.total, 1179560);
    assert(await page.evaluate("!!document.querySelector('.node[data-p=csrc]')"), 'the explicitly scoped outside document source should still be visible');
  });

  await check('edited Services, zero rates and named-draft choices survive switching and reopening', async page => {
    await startAsBefore(page);
    await choose(page, /Universal Editor/);
    await services(page);
    const removeId = await page.evaluate("selectedLines().find(s=>baseId(s)==='SI05').id");
    const editId = await page.evaluate("selectedLines().find(s=>baseId(s)==='AXD01').id");
    await click(page, '[data-remove="' + removeId + '"]');
    const customScope = 'Integrate exactly three regional editorial teams with the AEM content source.';
    for (const [field, value] of [['hours','19'], ['rate','0'], ['scope',customScope]]) {
      const selector = '[data-line="' + editId + '"] [data-line-field="' + field + '"]';
      await page.evaluate(`(function() {
        const input=document.querySelector(${JSON.stringify(selector)});
        input.value=${JSON.stringify(value)};
        input.dispatchEvent(new Event('input', {bubbles:true}));
      }())`);
    }
    await build(page);
    const revised = await roundTrip(page);
    expectRows(revised, ['SI05'], false);
    assert.equal(revised.total, 1170680 - (56 + 56) * 185, 'deliberate exclusion and free setup both affect the quote');
    await choose(page, /Word or Google Docs/);
    await roundTrip(page);
    await choose(page, /Universal Editor/);
    assert.deepEqual(await roundTrip(page), revised);
    await services(page);
    const draft = await page.evaluate('JSON.stringify(state)');

    const clean = await newSession();
    try {
      await start(clean);
      await services(clean);
      await clean.evaluate('openDraftText(' + JSON.stringify(draft) + ')');
      const edit = await read(clean, "selectedLines().filter(s=>baseId(s)==='AXD01').map(s=>[s.hours,s.rate,s.scope])");
      assert.deepEqual(edit, [[19, 0, customScope]]);
      await build(clean);
      assert.equal((await options(clean)).value, 'universal');
      assert.deepEqual(await roundTrip(clean), revised);
    } finally { await clean.close(); }
  });

  await check('traditional AEM Sites remains an independently selectable delivery scope', async page => {
    await start(page, 'custom');
    await addCustomProduct(page, 'aemsites');
    const nodes = await read(page, 'Array.from(document.querySelectorAll(".node"), n=>n.dataset.p)');
    assert.deepEqual(nodes, ['aemsites']);
    assert.equal(await page.evaluate('document.querySelectorAll(' + JSON.stringify(authoringSelect) + ').length'), 0);
    expectRows(await buildQuote(page), separateSiteRows, true);
  });

  const retained = ['L01', 'L02', 'O01', 'O02', 'SO2', 'OX1'];
  const cardActions = [
    {label:'Switch to traditional AEM Publish', ids:[...retained, 'SI01','SI02','SI04','SI05','SI06','AXC01','AXC05'], one:261220, monthly:44400, total:794020},
    {label:'Remove AEM Sites from canvas', ids:retained, one:45880, monthly:37000, total:489880},
  ];
  for (const startWithPublish of [false, true]) {
    for (const action of cardActions) {
      await check((startWithPublish ? 'Publish-first' : 'Edge-first') + ' offering supports ' + action.label, async page => {
        await customAemPlay(page, startWithPublish);
        const title = '.node[data-p="eds"] .offering-title';
        await click(page, title);
        if (!await page.evaluate("card?.id === 'eds'")) await click(page, title);
        const controls = await read(page, "Array.from(document.querySelectorAll('#card button.rm'), b=>b.textContent.trim())");
        assert.deepEqual(controls.sort(), cardActions.map(a=>a.label).sort());
        await page.evaluate("Array.from(document.querySelectorAll('#card button.rm')).find(b=>b.textContent.trim()===" + JSON.stringify(action.label) + ").click()");
        const expected = {ids:action.ids.slice().sort(), one:action.one, monthly:action.monthly, total:action.total};
        assert.deepEqual(await buildQuote(page), expected);
        await services(page);
        assert.deepEqual(await servicesQuote(page), expected);
        await build(page);
        assert.deepEqual(await buildQuote(page), expected);
      });
    }
  }

  for (const explicitSource of [false, true]) {
    await check(explicitSource ? 'RFI write-back is billable on a separately selected document source'
      : 'RFI write-back under Universal Editor waits for a compatible authoring choice', async page => {
      await customAemPlay(page);
      if (explicitSource) await addOutside(page, 'csrc');
      const before = await buildQuote(page);
      expectRows(before, ['CS2'], false);
      await services(page);
      await click(page, '.steps [data-step="rfp"]');
      await click(page, '#rfp-paste-btn');
      await page.evaluate("document.getElementById('rfp-text').value='Describe how you will configure Sites Optimizer write-back to SharePoint or Google Drive.'");
      await click(page, '#rfp-paste-go');
      await click(page, '#rfp-use');
      assert.deepEqual(await read(page, 'RFPBuilder.state.questions[0].draft.m.lines'), ['CS2']);
      await click(page, '#rfp-to-sow');
      assert.equal(await page.evaluate("document.getElementById('rfp-handoff-modal').hidden"), false);
      assert.deepEqual(await servicesQuote(page), before, 'opening the confirmation cannot change fees');
      await click(page, '#rfp-handoff-go');
      const expected = explicitSource
        ? {ids:[...before.ids, 'CS2'].sort(), one:before.one + 2960, monthly:before.monthly, total:before.total + 2960}
        : before;
      assert.deepEqual(await servicesQuote(page), expected);
      assert.equal(await page.evaluate('state.canvasSelection.custom.choices.CS2'), true, 'the RFI request must be remembered');
      await build(page);
      assert.equal((await options(page)).value, 'universal');
      assert.equal(await page.evaluate("!!document.querySelector('.node[data-p=csrc]')"), explicitSource);
      assert.deepEqual(await roundTrip(page), expected);
      if (!explicitSource) {
        await choose(page, /Word or Google Docs/);
        assert.equal((await roundTrip(page)).total, 1115920);
        expectRows(await buildQuote(page), ['CS1','CS2'], true);
      }
    });
  }

  for (const config of [
    {method:'universal', match:/Universal Editor/, opposite:['csrc','eds'], waiting:'CS1'},
    {method:'documents', match:/Word or Google Docs/, opposite:['aemsites','eds'], waiting:'AXD01'}
  ]) {
    await check('RFI merge respects ' + config.method + ' scope and retains a conflicting request for later', async page => {
      await start(page, 'custom');
      await addCustomProduct(page, 'eds');
      await choose(page, config.match);
      const before = await buildQuote(page);
      await services(page);
      await addFromRfi(page, ['cja'], ['CJ01']);
      const merged = await read(page, 'selectedLines().map(baseId).sort()');
      assert.deepEqual(merged, [...before.ids, 'CJ01'].sort(), 'only the requested analytics work should be added');
      assert.equal(await page.evaluate('state.canvasDecisions.custom.authoring'), config.method);
      await build(page);
      assert.deepEqual((await roundTrip(page)).ids, merged);
      await services(page);
      await addFromRfi(page, config.opposite, [config.waiting]);
      assert.equal(await page.evaluate('state.canvasDecisions.custom.authoring'), config.method);
      const after = await read(page, 'selectedLines().map(baseId).sort()');
      assert.deepEqual(after, merged, 'a request for the other method should wait without changing the quote');
      await build(page);
      assert.equal((await options(page)).value, config.method);
      assert.deepEqual((await buildQuote(page)).ids, after);
      await choose(page, config.method === 'documents' ? /Universal Editor/ : /Word or Google Docs/);
      expectRows(await roundTrip(page), [config.waiting], true);
    });
  }

  await check('an originally empty RFI scope can infer AEM authoring from the requested service', async page => {
    await start(page, 'cja');
    await services(page);
    await addFromRfi(page, ['aemsites','eds'], ['AXD01']);
    assert.equal(await page.evaluate('state.canvasDecisions.custom.authoring'), 'universal');
    const active = await read(page, 'selectedLines().map(baseId).sort()');
    assert.deepEqual(active, ['AXD01'], 'a fresh RFI must add only the requested authoring service');
    await build(page);
    assert.equal((await options(page)).value, 'universal');
    assert.deepEqual((await roundTrip(page)).ids, active);
  });

  // Nov 16 2026: AEM Sites work already in the statement of work stays on when an RFI answer brings Edge Delivery.
  await check('an Edge Delivery RFI answer about Target on the site keeps the AEM Sites work already in the statement of work', async page => {
    await start(page, 'custom');
    await click(page, '#size [data-size="typical"]');
    await addCustomProduct(page, 'aemsites');
    const before = await buildQuote(page);
    assert.deepEqual([before.ids, before.total], [['SI01', 'SI02', 'SI04', 'SI05', 'SI06'], 156880]);
    await services(page);
    await click(page, '.steps [data-step="rfp"]');
    await click(page, '#rfp-paste-btn');
    await page.evaluate("document.getElementById('rfp-text').value=" + JSON.stringify('How would Adobe Target personalize our Edge Delivery Services site?'));
    await click(page, '#rfp-paste-go');
    await click(page, '#rfp-use');
    assert.deepEqual(await read(page, 'RFPBuilder.state.questions[0].draft.m.lines'), ['XA22']);
    await click(page, '#rfp-to-sow');
    assert.match(await page.evaluate("document.getElementById('rfp-handoff-text').textContent"), /nothing already in the statement of work is removed/);
    await click(page, '#rfp-handoff-go');
    const after = await servicesQuote(page);
    assert.deepEqual(after.ids, [...before.ids, 'XA22'].sort(), 'the hand-off adds the requested service and removes none');
    assert.equal(after.total, 165760);
    await build(page);
    assert.deepEqual(await roundTrip(page), after);
  });

  if (failures) throw Error(failures + ' failed authoring checks');
}

// Each test uses a separate browser context. Intercept local files under one origin
// so that drafts and navigation behave like the normal hosted application.
async function main() {
  const {chromium} = require('playwright');
  const origin = 'http://sow.test/';
  const site = path.join(__dirname, 'site');
  const browser = await chromium.launch();
  try {
    await runAuthoringChecks(async () => {
      const context = await browser.newContext({viewport:{width:1440,height:900}});
      await context.route(origin + '**', async route => {
        const requested = new URL(route.request().url()).pathname;
        const file = path.join(site, requested === '/' ? 'index.html' : requested);
        await route.fulfill({path:file});
      });
      const page = await context.newPage();
      await page.goto(origin, {waitUntil:'domcontentloaded'});
      return {evaluate:code=>page.evaluate(code), close:()=>context.close(), reload:()=>page.reload(),
        async keyboardSelect(selector, key) {
          await page.locator(selector).focus();
          await page.keyboard.press(key);
          assert(await page.locator(selector).evaluate(s=>document.activeElement===s), 'the control must retain focus after a keyboard change');
        },
        async follow(selector, destination) {
          await Promise.all([page.waitForURL(origin + destination, {waitUntil:'domcontentloaded'}), page.locator(selector).click()]);
        }};
    });
  } finally { await browser.close(); }
}

module.exports = {runAuthoringChecks};
if (require.main === module) main().catch(error=>{console.error(error);process.exitCode=1;});
