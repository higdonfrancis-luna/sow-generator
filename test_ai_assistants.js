// ChatGPT, Claude and Microsoft Copilot as outside systems (Nov 18 2026). Adam: three boxes; "a play should always offer them if there's a product on its
// canvas that connects to them"; lines that sell no hours are fine ("it's a value add and the services will come somewhere else"); no Adobe Analytics lines.
// The build data is handoff/2026-11-17/ai_hosts/proposal_data_v2.json. Run from the repo root after python3 canvas/build.py and python3 build_site.py:
//   node test_ai_assistants.js
const path = require('path'), fs = require('fs');
const {chromium} = require('playwright');
const ROOT = __dirname, ORIGIN = 'https://ai-assistants.test/';
const {open: openRfi} = require(path.join(ROOT, 'rfp_prototype', 'review_2026-11-09', 'harness.js'));
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 700) + ']')); if (!c) fails++; };
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const CAT = JSON.parse(read('canvas/catalog.json')), DATA = JSON.parse(read('handoff/2026-11-17/ai_hosts/proposal_data_v2.json')), KB = JSON.parse(read('rfp_method.json'));
const P = Object.fromEntries(CAT.products.map(p => [p.id, p])), CBY = Object.fromEntries(CAT.connections.map(c => [c.id, c]));
const AI = ['chatgpt', 'claude', 'copilot'], fix = s => s.replace(/’/g, "'");
const XT = {XT01: ['cja', 8, 16, 32], XT03: ['aemsites', 16, 24, 40], XT04: ['aemassets', 8, 16, 32], XT05: ['workfront', 16, 24, 40], XT06: ['gspm', 16, 24, 40], XT07: ['marketo', 16, 24, 48]};
// the pages the evidence standard accepts (handoff/2026-11-17/HANDOFF.md, with help.frame.io for Frame.io and aem.live since Nov 18), never partners.adobe.com
const ALLOWED = /^https:\/\/(?:experienceleague\.adobe\.com|helpx\.adobe\.com|developer\.adobe\.com|www\.adobe\.com|business\.adobe\.com|news\.adobe\.com|help\.frame\.io|www\.aem\.live)\//;
// Adam, Nov 12 and Nov 18: "They don't need our editorial and our caveat and dates that things are coming"
const LABELS = /\bbeta\b|early access|early adopter|limited availability|coming soon|\bpreview\b|not yet|roadmap|\bplanned\b|future release|confirm(?:ed|s)? (?:[\w'-]+ ){0,6}with adobe|\bask adobe\b|written confirmation|(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+(?:\d{1,2},?\s+)?20\d\d|\bq[1-4]\s+20\d\d|\b20[2-3]\d\b|pasted|\bAdam\b/i;

// ============ 1. the catalog: three boxes, 41 lines, six services, as the build data says ============
{ const D = Object.fromEntries(DATA.outside_systems.map(o => [o.id, o]));
  ok(AI.every(id => P[id] && P[id].outside && P[id].name === D[id].name && P[id].icon === 'chat' && P[id].systems === fix(D[id].systems) &&
      P[id].systems_with_bv === fix(D[id].systems_on_brand_visibility_plays) && !P[id].rec && !P[id].lines.length && !P[id].more.length),
    '1. ChatGPT, Claude and Microsoft Copilot are outside systems with the build data\'s names and lines (a second line for plays with Brand Visibility), a speech bubble and no Recommended reason',
    JSON.stringify(AI.map(id => P[id])));
  ok(CAT.products.length === 54 && CAT.products.filter(p => p.outside).length === 18 && CAT.connections.length === 217 && Object.keys(CAT.lines).length === 632,
    '1. the catalog holds 54 products (18 outside systems), 217 connections (Claude + Brand Intelligence joined later on Nov 18; the Commerce round\'s 13 on Nov 19) and 632 services', [CAT.products.length, CAT.connections.length, Object.keys(CAT.lines).length].join());
  const DC = DATA.connections, same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  // Nov 19 2026 (test_first_page_rows.js): an assistant's line has a line type of its own ('assistant', thinner and grey, with its own key entry) and the two
  // lines between boxes the tool already had are typed by their own evidence ('native'); Copilot + AEM Sites follows Adobe's step-by-step Copilot Studio set-up, and Copilot + AEM Assets the same agent
  const LINE = x => AI.includes(x.a) ? 'assistant' : 'native', MOVED = ['copilot-aemsites', 'copilot-aemassets'];
  const off = DC.filter(x => { const c = CBY[x.id]; return !c || c.a !== x.a || c.b !== x.b || c.kind !== 'outside' || c.line !== LINE(x) || (!MOVED.includes(x.id) && (c.label !== fix(x.label) || c.how !== fix(x.how) ||
    !same(c.prereqs, x.prereqs.map(fix)) || c.source.url !== x.source.url)) || c.gain.title !== fix(x.gain.title) || c.gain.text !== fix(x.gain.text) || !same(c.flows.map(f => [f.from, f.to, f.what]), x.flows.map(f => [f.from, f.to, fix(f.what)])) ||
    c.availability !== '' || c.lines.length || c.more.length || !c.covered || !c.sowHow || !c.sowGain; }).map(x => x.id);
  ok(DC.length === 41 && !off.length, '1. all 41 lines are in the catalog as the build data says (how, label, what you get, flows, prerequisites, source; Copilot + AEM Sites and AEM Assets as corrected on Nov 19), with no availability line, the assistant line type (Adobe Analytics + Cloud storage and GenStudio for Performance Marketing + Ad platforms native), no services of their own, where the work sits, and a client version for the SOW steps and the RFI Builder', off.join());
  ok(DC.filter(x => x.sowHow).length === 19 && DC.filter(x => x.sowHow).every(x => CBY[x.id].sowHow === fix(x.sowHow) && CBY[x.id].sowGain === fix(x.sowGain)),
    '1. the 19 lines whose client version the build data writes carry it word for word', DC.filter(x => x.sowHow && CBY[x.id].sowHow !== fix(x.sowHow)).map(x => x.id).join());
  const mine = DC.map(x => CBY[x.id]).filter(Boolean), urls = mine.flatMap(c => [c.source.url, ...c.flows.map(f => f.source.url), ...(c.references || []).map(r => r.url)]);
  ok(urls.length > 82 && urls.every(u => ALLOWED.test(u)), '1. every page behind the 41 lines is one the evidence standard accepts (Experience League, Adobe Help, Adobe Developer, adobe.com, business.adobe.com, Frame.io help, aem.live), never partners.adobe.com', urls.filter(u => !ALLOWED.test(u)).join(' '));
  ok(['claude-aemsites', 'claude-ajo'].every(id => CBY[id].flows.some(f => /Claude Design/.test(f.what) && /^https:\/\/business\.adobe\.com\/blog\//.test(f.source.url))),
    '1. Claude + AEM Sites and Claude + Journey Optimizer each carry the Claude Design hand-off as a flow, linked to Adobe\'s post on it');
  const touches = (c, ids) => ids.some(id => [c.a, c.b].includes(id));
  ok(!CAT.connections.some(c => touches(c, AI) && touches(c, ['bv', 'aa'])) && !DATA.removed_by_adam.some(id => CBY[id]),
    '1. no line goes from ChatGPT, Claude or Microsoft Copilot to Brand Visibility or to Adobe Analytics (Adam: "only Customer Journey Analytics")', CAT.connections.filter(c => touches(c, AI) && touches(c, ['bv', 'aa'])).map(c => c.id).join());
  ok(Object.entries(XT).every(([id, [owner, lo, base, hi]]) => { const L = CAT.lines[id]; return L && P[owner].more.includes(id) && !P[owner].lines.includes(id) && [L.low, L.base, L.high].join() === [lo, base, hi].join() &&
      L.unit === 'one-time' && L.scope && ALLOWED.test(L.url) && KB.services[id] && KB.services[id].steps.length >= 3 && (KB.services[id].phrases || []).length >= 6; }) &&
      !CAT.plays.some(pl => (pl.on || []).some(l => l in XT)) && !CAT.connections.some(c => touches(c, AI) && (c.lines.length || c.more.length)),
    '1. the six services sit on their products (Customer Journey Analytics, AEM Sites, AEM Assets, Workfront, GenStudio for Performance Marketing, Marketo Engage), start off on every play, carry the build data\'s hours, scope and Adobe page, and each has an RFI write-up with its phrases; the lines themselves carry no services',
    Object.keys(XT).map(id => id + ' ' + JSON.stringify(CAT.lines[id] && [CAT.lines[id].low, CAT.lines[id].base, CAT.lines[id].high])).join(', '));
  ok(P.cw.more.includes('CW08') && P.fireflycp.more.includes('FP07') && P.aa.more.includes('AN07') && P.gspm.lines.includes('GS04'),
    '1. the services the lines reuse stay where they are: Coworker set up in an AI platform, Run-Workflow MCP for AI agents, Data feeds and Data Warehouse exports, Paid media connections and activation setup');
  const shown = [...AI.flatMap(id => [P[id].name, P[id].systems, P[id].systems_with_bv]),
    ...mine.flatMap(c => [c.label, c.how, c.covered, c.sowHow, c.sowGain, c.gain.title, c.gain.text, c.source.title, ...c.prereqs, ...c.flows.flatMap(f => [f.what, f.source.title]), ...(c.references || []).map(r => r.title)]),
    ...Object.keys(XT).flatMap(id => [CAT.lines[id].name, CAT.lines[id].scope, CAT.lines[id].src, ...KB.services[id].steps, ...KB.services[id].deliverables, ...KB.services[id].asks, KB.services[id].risk, KB.services[id].outcome])];
  ok(shown.length > 600 && !shown.some(t => LABELS.test(t)), '1. no release label, date, caveat, ask-Adobe line or note about how a page was read in anything the three boxes, their 41 lines and the six services show, page titles included',
    shown.filter(t => LABELS.test(t)).slice(0, 3).join(' | ')); }

(async () => {
  const b = await chromium.launch(), errs = [];
  const context = async (w = 1440, h = 900) => { const ctx = await b.newContext({viewport: {width: w, height: h}, acceptDownloads: true});
    await ctx.route('https://fonts.googleapis.com/**', r => r.fulfill({contentType: 'text/css', body: ''}));
    await ctx.route(ORIGIN + '**', async r => { let u = decodeURIComponent(new URL(r.request().url()).pathname); if (u.endsWith('/')) u += 'index.html';
      const f = path.join(ROOT, 'site', u); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return r.fulfill({status: 404, body: ''}); await r.fulfill({path: f}); });
    return ctx; };
  const page = async ctx => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); });
    await p.goto(ORIGIN + 'index.html'); await p.waitForFunction('window.READY===true'); return p; };
  const open = async (w, h) => page(await context(w, h));
  const pick = async (p, play) => { await p.click(`#picker [data-play="${play}"]`); await p.waitForTimeout(400); await p.fill('#rate', '150'); await p.waitForTimeout(150); };
  const shut = async p => { await p.keyboard.press('Escape'); await p.waitForTimeout(150); };
  // the Add outside system menu as a partner sees it: each entry's box, its tag, its line, and whether it waits for a product
  const outMenu = async p => { if (await p.isHidden('#outwrap')) return null; await p.click('#out-btn'); await p.waitForTimeout(250);
    const items = await p.$$eval('#out-menu .it2', es => es.map(e => { const nm = e.querySelector('.nm'); const rec = !!nm.querySelector('.rec');
      return {name: [...nm.childNodes].filter(x => x.nodeType === 3).map(x => x.textContent).join('').trim(), tag: e.querySelector('.ctag').textContent, sys: (e.querySelector('.sys') || {}).textContent || '', wait: e.disabled, rec, icon: !!nm.querySelector('svg')}; }));
    await shut(p); return items.map(x => ({...x, id: Object.keys(P).find(k => P[k].outside && (P[k].title || P[k].name) === x.name)})); };
  const state = p => p.evaluate(() => ({out: st.out.slice(), offer: outsideOffer(), boxes: prods().map(x => x.id), lines: conns().map(c => c.id), n: totals().n, yr: totals().yr}));
  const add = (p, id) => p.evaluate(id => addProduct(id), id).then(() => p.waitForTimeout(350));
  const addOut = async (p, id) => { await p.click('#out-btn'); await p.waitForTimeout(250); await p.click(`#out-menu [data-out="${id}"]`); await p.waitForTimeout(400); };
  const layoutClean = async p => p.evaluate(() => { const boxes = [...document.querySelectorAll('.node')].map(e => e.getBoundingClientRect()), dots = [...document.querySelectorAll('.ib')].map(e => e.getBoundingClientRect());
    const hit = (a, c) => a.left < c.right && c.left < a.right && a.top < c.bottom && c.top < a.bottom;
    return boxes.every((a, i) => boxes.every((c, j) => i === j || !hit(a, c))) && dots.every(d => boxes.every(x => !hit(d, x))); });

  // ============ 2. at the start: each play offers the systems that connect to its products ============
  // Nov 18 2026, later (Adam: "we should automatically put those outside systems in and then people can delete them if they want"): a ready-made play now
  // starts with every system it offers on its canvas, so the menu lists each one again once the partner removes it
  { const WANT = {abv: 'cdn,search', cja: 'cdn,dwh,cstore,crm,ads,bi,search,chatgpt,claude,copilot', commerce: 'cdn,search,crm,erp,pim,oms,wms', aem: 'cdn,search,csrc,chatgpt,claude', fsi: 'cdn,search,cms',
      coworker: 'chatgpt,claude,copilot', custom: 'cdn,dwh,cstore,crm,ads,bi,search,csrc,cms,figma,chatgpt,claude,copilot,erp,pim,oms,wms,ocp'}, seen = {};
    for (const play of Object.keys(WANT)) { const p = await open(); await pick(p, play); const s = await state(p);
      for (const id of s.out) await p.evaluate(id => removeOutside(id), id);
      const items = await outMenu(p);
      seen[play] = {menu: (items || []).map(x => x.id).join(), ai: (items || []).filter(x => AI.includes(x.id)), out: s.out}; await p.context().close(); }
    ok(Object.entries(WANT).every(([k, v]) => seen[k].menu === v && seen[k].out.join() === (k === 'custom' ? '' : v)), '2. each play offers ChatGPT, Claude and Microsoft Copilot where a product on it connects to them (Brand Visibility + Customer Journey Analytics, Adobe Coworker; ChatGPT and Claude on Brand Visibility + Sites Optimizer and Edge Delivery Services; all three on Create your own play) and none on Adobe Brand Visibility, Brand Visibility + Adobe Commerce (which also offers the CRM, as Adobe Commerce connects to it) or Brand Visibility + Brand Concierge; a ready-made play starts with all it offers on its canvas, and the menu offers each again once removed',
      JSON.stringify(Object.fromEntries(Object.entries(seen).map(([k, v]) => [k, v.menu + ' | ' + v.out.join()]))));
    ok(Object.values(seen).every(v => v.ai.every(x => !x.rec && x.icon)), '2. no assistant carries a Recommended tag, and each shows its speech bubble');
    const line = (play, id) => (seen[play].ai.find(x => x.id === id) || {}).sys;
    ok(line('cja', 'chatgpt') === P.chatgpt.systems_with_bv && line('cja', 'claude') === P.claude.systems_with_bv && line('cja', 'copilot') === P.copilot.systems_with_bv &&
        line('aem', 'chatgpt') === "Your client's staff use Adobe products from inside ChatGPT. Not how Brand Visibility measures ChatGPT answers." && line('coworker', 'claude') === P.claude.systems,
      '2. on a play with Brand Visibility each assistant\'s entry takes its Brand Visibility wording from the build data (ChatGPT\'s says it is not how Brand Visibility measures ChatGPT answers); on Adobe Coworker it says only how the staff use it',
      JSON.stringify([line('cja', 'chatgpt'), line('coworker', 'claude')]));
    ok(seen.coworker.ai.every(x => x.tag === 'Connects to Coworker' && !x.wait) && seen.cja.ai.every(x => x.tag === 'Connects to CJA') && seen.aem.ai.every(x => x.tag === 'Connects to Edge Delivery') && seen.custom.ai.every(x => x.wait),
      '2. each entry names the product on the canvas it connects to (Coworker, CJA, Edge Delivery Services); on an empty Create your own play each waits for a product', JSON.stringify(seen.custom.ai.map(x => x.tag))); }

  // ============ 3. the rule as products come and go ============
  { const p = await open(); await pick(p, 'abv'); const s0 = await state(p);
    await add(p, 'target'); const s1 = await state(p);
    await addOut(p, 'chatgpt'); const s2 = await state(p);
    await p.evaluate(() => removeProduct('target')); await p.waitForTimeout(350); const s3 = await state(p);
    ok(!s0.offer.some(id => AI.includes(id)) && ['chatgpt', 'claude'].every(id => s1.offer.includes(id)) && !s1.offer.includes('copilot') && s2.boxes.includes('chatgpt') && s2.lines.includes('chatgpt-target') &&
        !s3.offer.some(id => AI.includes(id)) && !s3.out.includes('chatgpt') && !s3.boxes.includes('chatgpt'),
      '3. Adobe Brand Visibility offers no assistant; Target added brings ChatGPT and Claude to the menu (Adobe lists no Copilot for Target); ChatGPT added draws its line to Target; Target removed takes the offer away, and ChatGPT goes with the last product it connects to',
      JSON.stringify({s0: s0.offer, s1: s1.offer, s2: s2.lines, s3: s3.offer, out: s3.out}));
    await p.context().close(); }
  { const p = await open(); await pick(p, 'coworker'); await add(p, 'workfront'); const s1 = await state(p);   // Claude is on Adobe Coworker from the start
    await p.evaluate(() => removeProduct('workfront')); await p.waitForTimeout(350); const s2 = await state(p);
    ok(s1.lines.includes('claude-cw') && s1.lines.includes('claude-workfront') && s2.boxes.includes('claude') && s2.lines.includes('claude-cw') && !s2.lines.some(id => /workfront/.test(id)),
      '3. an assistant on the canvas stays while a product it connects to is there: Claude on Adobe Coworker with Workfront keeps its line to Coworker when Workfront is removed', JSON.stringify([s1.lines, s2.lines]));
    await p.context().close(); }

  // ============ 4. the CDN on the Adobe Coworker play once Brand Visibility is added ============
  { const p = await open(); await pick(p, 'coworker'); const s0 = await state(p);
    await add(p, 'bv'); const s1 = await state(p), m1 = await outMenu(p);
    await addOut(p, 'cdn'); const s2 = await state(p), ox1 = await p.evaluate(() => counted('OX1'));
    await p.evaluate(() => removeProduct('bv')); await p.waitForTimeout(350); const s3 = await state(p);
    ok(!s0.offer.includes('cdn') && s1.offer.includes('cdn') && !s1.out.includes('cdn') && (m1 || []).some(x => x.id === 'cdn' && x.tag === 'Connects to Brand Visibility') && (m1 || []).filter(x => AI.includes(x.id)).every(x => x.sys === P[x.id].systems_with_bv) &&
        s2.lines.includes('cdn-bv') && ox1 && s2.yr > s1.yr && !s3.offer.includes('cdn') && !s3.boxes.includes('cdn') && s3.yr === s0.yr,
      '4. Adobe Coworker: Brand Visibility added brings the existing CDN to the menu, not to the canvas; the CDN added draws its line with CDN log forwarding on; Brand Visibility removed takes the CDN and its services away, back to the starting total; with Brand Visibility on, the assistants say they are not how it measures answers',
      JSON.stringify({s1: s1.offer, s2: s2.lines, s3: s3.offer, totals: [s0.yr, s1.yr, s2.yr, s3.yr]}));
    await p.context().close(); }
  { // the ranked Add product list lists Adobe products only, with the assistants on the canvas, and the never go backwards rules still hold a product back
    const p = await open(), rows = {}; for (const play of ['coworker', 'cja', 'custom']) { await pick(p, play); if (play === 'custom') await add(p, 'cja');
      for (const id of AI) await p.evaluate(id => addOutside(id), id);
      rows[play] = await p.evaluate(() => { st.goal = (PROBS.find(q => q.play === st.play) || PROBS[0]).id; const R = rankRows(); delete st.goal; return {ids: R.rows.map(r => r.id), held: heldBy('aa')}; });
      await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300); }
    ok(Object.values(rows).every(r => r.ids.length > 5 && r.ids.every(id => !P[id].outside)) && rows.custom.held === 'cja',
      '4. with the assistants on the canvas the ranked Add product list still lists Adobe products only, and Customer Journey Analytics still holds Adobe Analytics back', JSON.stringify(Object.fromEntries(Object.entries(rows).map(([k, v]) => [k, v.ids.filter(id => P[id].outside).join() + '|' + v.held]))));
    await p.context().close(); }

  // ============ 5. Adobe Coworker with all three, and the Microsoft Copilot + Coworker card ============
  { const p = await open(); await pick(p, 'coworker');   // Nov 18 2026, later: the three start on the canvas
    const s1 = await state(p), places = await p.evaluate(ids => ids.map(id => id + ':' + pos(id).join()), AI), clean = await layoutClean(p);
    for (const id of AI) await p.evaluate(id => removeOutside(id), id); const s0 = await state(p);
    ok(AI.every(id => s1.boxes.includes(id)) && s1.lines.sort().join() === 'chatgpt-cw,claude-cw,copilot-cw' && s1.yr === s0.yr && s1.n === s0.n && places.join() === 'chatgpt:1,0,claude:-1,0,copilot:0,1' && clean,
      '5. Adobe Coworker with ChatGPT, Claude and Microsoft Copilot: three boxes around Coworker (Claude left, ChatGPT right, Microsoft Copilot below), three lines, the same total as without them, no box on another', JSON.stringify({lines: s1.lines, places, totals: [s0.yr, s1.yr]}));
    for (const id of AI) await p.evaluate(id => addOutside(id), id); await p.waitForTimeout(300); const sR = await state(p);
    const card = await p.evaluate(() => { showCard('c', 'copilot-cw'); const c = document.getElementById('card'); return {text: c.innerText, links: [...c.querySelectorAll('a')].map(a => a.href), rows: [...c.querySelectorAll('.ln')].map(r => r.dataset.l)}; });
    await p.click('#card [data-t="CW08"]'); await p.waitForTimeout(300);
    const s2 = await state(p), onCw = await p.evaluate(() => { showCard('p', 'cw'); const r = document.querySelector('#card .ln[data-l="CW08"]'); return !!r && !r.classList.contains('off'); });
    ok(/Microsoft Copilot \+ Coworker/.test(card.text) && /Outside system/i.test(card.text) && /Before it works/i.test(card.text) && /What you get together/i.test(card.text) && /How it connects/i.test(card.text) &&
        card.text.includes(CBY['copilot-cw'].covered) && card.rows.join() === 'CW08' && s2.n === sR.n + 1 && s2.yr > sR.yr && onCw && card.links.length && card.links.every(u => ALLOWED.test(u)) && !LABELS.test(card.text),
      '5. the Microsoft Copilot + Coworker card says how they connect, what comes first and what you get, links only to Adobe\'s pages, and lists the Coworker set up in an AI platform service with its hours and tick: ticked there it is on for Coworker and counted once', JSON.stringify({rows: card.rows, n: [sR.n, s2.n], text: card.text.slice(0, 200)}));
    const box = await p.evaluate(() => { showCard('p', 'chatgpt'); return document.getElementById('card').innerText; });
    ok(box.includes("A system your client runs outside Adobe. Your client's staff use Adobe products from inside ChatGPT.") && box.includes('It connects to Coworker.'),
      '5. the ChatGPT box\'s card says what it is in one plain sentence and what it connects to on this canvas', box.slice(0, 300));
    await p.context().close(); }

  // ============ 6. the six services start off, and canvases saved before them reopen with the same totals ============
  { // the totals the canvases below had before Nov 18, read from the build of the commit before this change
    const SAVED = {
      own_six: [{play: 'custom', on: ['cja', 'aemsites', 'aemassets', 'workfront', 'gspm', 'marketo', 'cw'], out: [], ls: {CW08: true}, rate: 150, size: 'typical'}, 54, 610800],
      own_eds: [{play: 'custom', on: ['eds', 'aemsites', 'cja'], out: [], ls: {}, rate: 150, size: 'large', decisions: {authoring: 'universal'}}, 10, 540000],
      coworker: [{play: 'coworker', on: [], out: [], ls: {CW08: true}, rate: 175, size: 'typical'}, 7, 97300],
      cja: [{play: 'cja', on: [], out: ['cdn', 'dwh'], ls: {}, rate: 200, size: 'small'}, 8, 187200],
      aem: [{play: 'aem', on: [], out: ['cdn'], ls: {}, rate: 150, size: 'typical', decisions: {authoring: 'universal'}}, 18, 514800],
      commerce: [{play: 'commerce', on: [], out: ['cdn'], ls: {}, rate: 150, size: 'typical'}, 7, 224400]}, got = {};
    for (const [k, [s]] of Object.entries(SAVED)) { const p = await open();
      await p.evaluate(s => localStorage.setItem('abv-sow-build-v1', JSON.stringify({combinedDefaultsVersion: 1, selectionVersion: 1, keep: {}, months: 12, v: 2, ...s})), s);
      await p.reload(); await p.waitForFunction('window.READY===true'); await p.waitForTimeout(250);
      got[k] = await p.evaluate(xt => ({n: totals().n, yr: totals().yr, xt: xt.filter(l => counted(l) && [...prods(), ...conns()].some(o => all(o).includes(l)))}), Object.keys(XT)); await p.context().close(); }
    ok(Object.entries(SAVED).every(([k, [, nn, yr]]) => got[k].n === nn && got[k].yr === yr && !got[k].xt.length),
      '6. six canvases saved before the change (Create your own play with all six products, Edge Delivery authored in AEM, Adobe Coworker, Brand Visibility + Customer Journey Analytics, + Sites Optimizer and Edge Delivery Services, + Adobe Commerce) reopen with the same number of services and the same total, and no new service is on', JSON.stringify(got)); }

  // ============ 7. AEM Sites: the assistants' AEM lines need AEM Sites as its own product ============
  { const p = await open(); await pick(p, 'aem'); const s1 = await state(p);   // ChatGPT and Claude are on from the start
    await p.evaluate(() => { st.decisions = {...st.decisions, authoring: 'universal'}; render(); }); await p.waitForTimeout(300);
    const s2 = await p.evaluate(() => ({has: has('aemsites'), lines: conns().map(c => c.id), shown: displayConnections().map(c => c.members.map(m => m.id).join('+')), xt03: all(P.aemsites).includes('XT03'), card: cardHTML('p', 'aemsites').includes('data-t="XT03"')}));
    ok(s1.lines.includes('chatgpt-eds') && s1.lines.includes('claude-eds') && !s1.lines.some(id => /-aemsites$/.test(id) && AI.some(a => id.startsWith(a))) &&
        s2.has && !s2.lines.some(id => ['chatgpt-aemsites', 'claude-aemsites', 'copilot-aemsites'].includes(id)) && !s2.shown.some(x => /aemsites/.test(x) && AI.some(a => x.includes(a))) && !s2.xt03 && !s2.card,
      '7. Brand Visibility + Sites Optimizer and Edge Delivery Services: ChatGPT and Claude draw their lines to Edge Delivery Services; with pages authored in AEM, AEM Sites counts as on the canvas, yet no assistant line to AEM Sites appears and its AEM content service is not offered',
      JSON.stringify({s1: s1.lines, s2}));
    await p.context().close(); }
  { const p = await open(); await pick(p, 'custom'); await add(p, 'aemsites'); await addOut(p, 'copilot'); const s1 = await state(p);
    const xt = await p.evaluate(() => all(P.aemsites).includes('XT03') && cardHTML('p', 'aemsites').includes('data-t="XT03"'));
    await add(p, 'eds'); const s2 = await state(p), card = await p.evaluate(() => { showCard('p', 'copilot'); return document.getElementById('card').innerText; });
    ok(s1.lines.includes('copilot-aemsites') && xt && !s2.lines.includes('copilot-aemsites') && /It connects to .*Add one of them to the canvas to draw its line\./.test(card) && !/AEM Sites/.test(card),
      '7. Create your own play with traditional AEM Publish: Microsoft Copilot draws its line to AEM Sites and the AEM content service is offered; moved to Edge Delivery Services, the line goes (Adobe lists no Copilot route for Edge Delivery) and the box\'s card names the products to add for one',
      JSON.stringify({s1: s1.lines, s2: s2.lines, card: card.slice(0, 300)}));
    await p.context().close(); }

  // ============ 8. the overlap review and the statement of work ============
  { const p = await open(); await pick(p, 'custom'); await add(p, 'workfront'); await add(p, 'cw');
    await p.evaluate(() => { st.ls.XT05 = true; render(); }); await p.waitForTimeout(300);
    const row = await p.evaluate(() => { showCard('p', 'workfront'); const r = document.querySelector('#card [data-t="XT05"]'); return r ? r.closest('.ln').innerText : ''; });
    ok(/Overlaps with Coworker rollout and write access, which is on\. The SOW asks how they differ\./.test(row), '8. Workfront in ChatGPT, Claude or Microsoft Copilot beside Coworker rollout and write access, both on: the service says they overlap and the SOW asks how they differ, so the partner charges only for distinct work', row.slice(0, 300));
    await p.context().close(); }
  { const p = await open(); await pick(p, 'coworker'); await add(p, 'bv'); await addOut(p, 'cdn'); const c = await state(p);   // ChatGPT is on from the start
    await Promise.all([p.waitForURL(/\/sow\/index\.html/), p.click('.tabs [data-tab="services"]')]); await p.waitForTimeout(900);
    const s = await p.evaluate(() => ({outside: (state.outside || {}).coworker || [], n: selectedLines().length, ox1: selectedLines().some(l => l.id.replace(/^CANVAS-/, '') === 'OX1')}));
    const [draft] = await Promise.all([p.waitForEvent('download'), p.click('#save-draft')]);
    const d = await page(await context()); await d.goto(ORIGIN + 'sow/'); await d.waitForTimeout(600); await d.setInputFiles('#draft-file', await draft.path()); await d.waitForTimeout(900);
    await Promise.all([d.waitForURL(u => !/\/sow\//.test(String(u))), d.click('.steps [data-build]')]); await d.waitForFunction('window.READY===true'); await d.waitForTimeout(400);
    const back = await d.evaluate(() => ({out: st.out, boxes: prods().map(x => x.id), n: totals().n}));
    ok(s.outside.includes('chatgpt') && s.outside.includes('cdn') && s.ox1 && s.n === c.n && back.boxes.includes('chatgpt') && back.boxes.includes('cdn') && back.n === c.n,
      '8. Adobe Coworker with Brand Visibility, the CDN and ChatGPT reaches the SOW steps with both outside systems and the same services (CDN log forwarding included), and a draft saved there brings them back on Build',
      JSON.stringify({canvas: c.n, sow: s, back}));
    await d.context().close(); await p.context().close(); }

  // ============ 9. the first page is unchanged (its problem finder is a separate decision for Adam) ============
  { const p = await open(); const f = await p.evaluate(() => ['Claude', 'Microsoft Copilot', 'ChatGPT'].map(t => PROBS.map((q, i) => [q.id, bpScore(i, t)]).filter(x => x[1] > 0).map(x => x[0]).join()));
    ok(f.every(x => x === 'ai-answers-missing'), '9. on the first page "Claude", "Microsoft Copilot" and "ChatGPT" still find only the Brand Visibility problem about AI answers', f.join(' | '));
    await p.context().close(); }
  ok(!errs.length, 'no script errors on the canvas or the SOW steps', errs.slice(0, 3).join(' | '));
  await b.close();

  // ============ 10. the RFI Builder names the three boxes the way it names Figma ============
  const h = await openRfi();
  // what match() drew on for each question: the assistant's line that leads (it carries no services, so it chooses none), the products and the services
  const drawn = () => h.eval(() => RFPBuilder.state.questions.map(q => { const d = q.kind === 'adobe' ? q.draft || RFPAnswers.compose(q) : null;
    return d && d.m ? {lead: d.m.aiConn ? d.m.aiConn.id : null, products: d.m.products.slice(), lines: d.m.lines.slice()} : null; }));
  const ledger = () => h.eval(() => { const L = RFPAnswers.planningEffort(); return RFPBuilder.state.questions.map(q => ((L.byQuestion.get(q) || {}).ids || []).slice()); });
  const norm = t => String(t || '').replace(/[’']/g, "'"), says = (plain, c) => norm(plain).includes(norm(c.sowHow).split(/\s+/).slice(3, 9).join(' '));
  const ofAnswer = (id, prods) => prods.some(p => P[p].lines.includes(id) || P[p].more.includes(id)) || CAT.connections.some(c => prods.includes(c.a) && prods.includes(c.b) && (c.lines.includes(id) || c.more.includes(id)));
  const r = await h.text(['1. Describe how our analysts would ask Customer Journey Analytics questions inside Microsoft Copilot.',
    '2. How would our marketing operations team use the Claude connector for Marketo Engage?',
    '3. Explain how Workfront connects to ChatGPT for our project managers.',
    '4. How will Brand Visibility show whether we show up in ChatGPT?',
    '5. Do you use ChatGPT or Claude in delivering services?',
    '6. How will Customer Journey Analytics report on traffic from ChatGPT?',
    '7. Describe your approach to rolling out Workfront for our marketing teams. Our designers and analysts all use ChatGPT.'].join('\n'));
  const q = r.questions.map(x => ({kind: x.kind, products: x.draft ? x.draft.products.map(y => y.id) : [], lines: x.draft ? x.draft.lines.map(y => y.id) : [], plain: x.draft ? x.draft.plain : ''})), m = await drawn();
  ok(q.length === 7 && m[0].lead === 'copilot-cja' && q[0].lines[0] === 'XT01' && q[0].plain.includes('Copilot Studio') && m[1].lead === 'claude-marketo' && q[1].lines[0] === 'XT07' &&
      q[1].lines.length > 1 && q[1].lines.slice(1).every(id => P.marketo.lines.includes(id) || P.marketo.more.includes(id)) && m[2].lead === 'chatgpt-workfront' && q[2].lines[0] === 'XT05' && q[2].lines.length > 1 &&
      [0, 1, 2].every(i => says(q[i].plain, CBY[m[i].lead])) && q.slice(0, 3).every(x => !/your client|the partner/i.test(x.plain)),
    '10. a question that names ChatGPT, Claude or Microsoft Copilot with a product it connects to finds that line: the client version of how the product works inside the assistant is in the approach, the product\'s service for that work comes first and the product\'s own services follow',
    JSON.stringify(q.slice(0, 3).map((x, i) => [m[i] && m[i].lead, x.lines])));
  ok(q[3].products.join() === 'bv' && q[4].kind === 'firm' && !m[4] && !q[5].products.some(id => AI.includes(id)) && !q[5].lines.includes('XT01') && q[6].products.join() === 'workfront' && !q[6].lines.includes('XT05'),
    '10. an assistant named in passing finds nothing: "show up in ChatGPT" stays with Brand Visibility, "do you use ChatGPT or Claude" stays the partner\'s own answer, traffic from ChatGPT stays a Customer Journey Analytics question, and staff who use ChatGPT keep Workfront\'s own services',
    JSON.stringify(q.slice(3).map(x => [x.kind, x.products, x.lines])));
  const pack = await h.eval(() => RFPAnswers.proposalPack().connections.map(c => c.pair));
  ok(['Microsoft Copilot + Customer Journey Analytics', 'Claude + Marketo Engage', 'ChatGPT + Workfront'].every(x => pack.includes(x)), '10. the proposal the RFI Builder writes lists those lines among the connections of the products in the answer', pack.filter(x => /ChatGPT|Claude|Copilot/.test(x)).join(', '));
  { // every line from an assistant, asked about once
    const L = CAT.connections.filter(c => AI.some(a => [c.a, c.b].includes(a))).map(c => { const a = AI.includes(c.a) ? c.a : c.b; return {c, a, b: a === c.a ? c.b : c.a}; });
    const all = await h.text(L.map((x, i) => `${i + 1}. Describe how our team would work with ${P[x.b].name} inside ${P[x.a].name}.`).join('\n')), mm = await drawn();
    const off = L.filter((x, i) => { const d = all.questions[i].draft, w = mm[i]; if (!d || !w) return true; const ids = d.lines.map(l => l.id), first = x.c.covered_by && /ChatGPT|Claude|Copilot/.test(CAT.lines[x.c.covered_by].name) && P[x.b].more.includes(x.c.covered_by);
      return w.lead !== x.c.id || !/Our approach/.test(d.plain) || !says(d.plain, x.c) || !d.sources.some(s => s.url === x.c.source.url) || !ids.length || !ids.every(id => ofAnswer(id, w.products)) || (first && ids[0] !== x.c.covered_by); }).map(x => x.c.id);
    ok(L.length === 40 && !off.length, '10. each of the 40 lines from ChatGPT, Claude and Microsoft Copilot (Claude + Brand Intelligence included), asked about once, drafts an answer that the line leads: its client version in the approach, its Adobe page among the sources, and services that are all the products\' own, the one for the work inside the assistant first where the product has one', off.join()); }
  { // the questions a review found drafting nothing: each keeps every service the product drew before Nov 18 (from the build of the commit before this change)
    const BEFORE = [['Describe how Coworker will be made available to our employees in Microsoft 365 Copilot and Teams.', 'copilot-cw', 'CW03,CW01,CW02,CW07'],
      ['Explain how our creative team would use Frame.io reviews from within Claude.', 'claude-frameio', 'FR03,FR02,FR07,FR01'],
      ['Describe how our analysts would check Real-Time CDP audiences and data flows inside ChatGPT.', 'chatgpt-rtcdp', 'RT02,RT01,RT03,RT04'],
      ['How would our designers use Creative Cloud from inside Microsoft Copilot?', 'copilot-creativecloud', 'CC03,CC01,CC02,CC04'],
      ['Describe how our staff would create PDFs with Acrobat inside ChatGPT.', 'chatgpt-acrobat', 'AB01,AB02,AB11'],
      ['Describe how our optimization team would run Target tests from inside ChatGPT.', 'chatgpt-target', 'TG03,TG05,TG01,TG02'],
      ['Our designers use Claude Design. Describe how emails made in Claude Design could be sent into Adobe Journey Optimizer.', 'claude-ajo', 'JO01,JO04,JO05,JO02'],
      ['Describe how our team would work with AEM Sites with Edge Delivery Services inside Claude.', 'claude-eds', 'AXD01,AXD02'],
      ['Describe how our team would work with AEM Sites with Edge Delivery Services inside ChatGPT.', 'chatgpt-eds', 'AXD01,AXD02']];
    const got = await h.text(BEFORE.map((x, i) => `${i + 1}. ${x[0]}`).join('\n')), w = await drawn();
    const off = BEFORE.filter((x, i) => { const d = got.questions[i].draft; return !d || !w[i] || w[i].lead !== x[1] || d.lines.map(l => l.id).join() !== x[2] || !says(d.plain, CBY[x[1]]) || /26309/.test(d.plain) || w[i].lines.includes('XT03'); }).map(x => x[1]);
    ok(!off.length, '10. Coworker in Microsoft 365 Copilot and Teams, Frame.io reviews in Claude, Real-Time CDP in ChatGPT, Creative Cloud in Microsoft Copilot, PDFs in ChatGPT, Target tests in ChatGPT and Claude Design emails into Journey Optimizer each lead with the line and keep all the services they drew before; with Edge Delivery Services named, the assistant\'s Edge Delivery line leads, never its AEM Sites line, the AEM content service or its AEM as a Cloud Service release',
      off.join() + ' ' + JSON.stringify(got.questions.map(x => x.draft ? x.draft.lines.map(l => l.id).join() : null))); }
  { // named in passing in an RFI with numbered sections: no assistant work in the services, the steps or the planning estimate; tied in the same RFI, it counts
    const SC = /assistant permission|plugin in ChatGPT|connector in Claude|ChatGPT, Claude or Microsoft Copilot|in ChatGPT or Claude|Adobe Experience Manager plugin|Workfront connector|GenStudio address|API-only user|ChatGPT or Claude administrator|Copilot Studio|LaunchPoint/i;
    const got = await h.text(['Request for information', '', '3. Questions', '3.1 Describe your Workfront rollout for our marketing teams. Our designers and analysts all use ChatGPT.',
      '3.2 Describe how you will implement AEM Sites for our new website. Our employees already use Microsoft Copilot.', '3.3 Describe your approach to GenStudio for Performance Marketing. We already use Claude and ChatGPT for copywriting.',
      '3.5 Describe how AEM Assets will be rolled out. Several teams use Microsoft Copilot and Claude today.', '3.6 How will you set up Marketo Engage? Our marketing operations team uses Claude for drafting.',
      '3.7 Describe how your proposed solution will let our marketers get Customer Journey Analytics insights where they already work.', '3.8 Describe how you will measure our visibility in AI assistants such as ChatGPT, Claude and Microsoft Copilot.',
      '3.9 How would our marketing operations team use the Claude connector for Marketo Engage?'].join('\n'), 'rfp.txt'), led = await ledger();
    const passing = got.questions.slice(0, 7), bad = passing.filter((x, i) => !x.draft || x.draft.products.some(p => AI.includes(p.id)) || x.draft.lines.some(l => l.id in XT) || led[i].some(id => id in XT) || SC.test(x.draft.plain)).map(x => x.label);
    ok(got.questions.length === 8 && !bad.length && led[7].includes('XT07') && got.questions[7].draft.lines[0].id === 'XT07',
      '10. in an RFI with numbered sections, an assistant named in passing beside Workfront, AEM Sites, GenStudio for Performance Marketing, AEM Assets, Marketo Engage or a question on visibility in AI assistants brings no assistant work: not among the services, not in the steps and not in the planning estimate, while the question that ties Claude to Marketo Engage counts its service',
      bad.join() + ' ' + JSON.stringify(led)); }
  await h.close();

  console.log(fails ? `\n${fails} of ${n} AI ASSISTANT CHECKS FAILED` : `\nALL ${n} AI ASSISTANT CHECKS PASSED`);
  process.exit(fails ? 1 : 0);
})();
