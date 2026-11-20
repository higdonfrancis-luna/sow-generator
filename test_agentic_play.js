// Outside systems on the canvas from the start, the Adobe agentic AI card, Ask it and Claude + Brand Intelligence (Nov 18 2026). Adam: "for every single
// play we have and every single play we're going to build, we should automatically put those outside systems in and then people can delete them if they
// want"; "go" on the agentic card (pictures e1 and e2 in handoff/2026-11-17/ai_hosts/discovery_pictures). The build data is
// handoff/2026-11-17/ai_hosts/agentic_play_data.json. States saved on the build before this change are in qa/agentic_fixtures (made on commit 03a07be).
// Run from the repo root after python3 canvas/build.py and python3 build_site.py:
//   node test_agentic_play.js
const path = require('path'), fs = require('fs');
const {chromium} = require('playwright');
const ROOT = __dirname, ORIGIN = 'https://agentic-play.test/', FIX = path.join(ROOT, 'qa', 'agentic_fixtures');
const {open: openRfi} = require(path.join(ROOT, 'rfp_prototype', 'review_2026-11-09', 'harness.js'));
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 700) + ']')); if (!c) fails++; };
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const CAT = JSON.parse(read('canvas/catalog.json')), WAVE = JSON.parse(read('canvas/research/wave7_ai_assistants.json')), TYPES = JSON.parse(read('canvas/research/connection_types.json'));
const P = Object.fromEntries(CAT.products.map(p => [p.id, p])), CBY = Object.fromEntries(CAT.connections.map(c => [c.id, c])), PLAY = Object.fromEntries(CAT.plays.map(p => [p.id, p]));
const AI = ['chatgpt', 'claude', 'copilot'], same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const ALLOWED = /^https:\/\/(?:experienceleague\.adobe\.com|helpx\.adobe\.com|developer\.adobe\.com|www\.adobe\.com|business\.adobe\.com|news\.adobe\.com|help\.frame\.io|www\.aem\.live)\//;
// Adam, Nov 12 and Nov 18: "They don't need our editorial and our caveat and dates that things are coming" (a plan, as in "campaigns planned for next
// quarter", is not a release label: qa/check_product_copy.py flags "is planned" and "planned for a future")
const LABELS = /\bbeta\b|early access|early adopter|limited availability|coming soon|\bpreview\b|not yet|roadmap|\b(?:is|are|was|were) planned\b|planned for a future|future release|confirm(?:ed|s)? (?:[\w'-]+ ){0,6}with adobe|\bask adobe\b|written confirmation|(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+(?:\d{1,2},?\s+)?20\d\d|\bq[1-4]\s+20\d\d|\b20[2-3]\d\b|pasted|\bAdam\b/i;
// the outside systems each starting canvas opens with: every one that connects to a product on it, and a ready-made play's own list
const START = {
  abv: ['cdn', 'search'],
  cja: ['cdn', 'dwh', 'cstore', 'crm', 'ads', 'bi', 'search', 'chatgpt', 'claude', 'copilot'],
  commerce: ['cdn', 'search', 'crm', 'erp', 'pim', 'oms', 'wms'],   // Nov 19 2026: the four back-office systems connect to Adobe Commerce, so they start on too
  aem: ['cdn', 'search', 'csrc', 'chatgpt', 'claude'],
  fsi: ['cdn', 'search', 'cms'],
  coworker: ['chatgpt', 'claude', 'copilot']};
const CARDS = {bc: ['cms'], brandintel: ['figma', 'claude']};
const GENSTUDIO = {
  'Workflow & planning': ['figma', 'chatgpt', 'claude', 'copilot'], 'Creative foundations': ['chatgpt', 'claude', 'copilot'],
  'Scaled content production': ['figma', 'claude'], 'Marketer-led creation': ['ads', 'figma', 'chatgpt', 'claude', 'copilot'],
  'Asset management': ['figma', 'chatgpt', 'claude', 'copilot'], 'Content insights': ['ads', 'figma', 'chatgpt', 'claude', 'copilot'],
  'Or open the whole family together': ['ads', 'figma', 'chatgpt', 'claude', 'copilot']};
// the Adobe agentic AI card, word for word as in the build data (the tool writes a straight apostrophe), and what each canvas it opens holds.
// Nov 19 2026 (Adam's decisions of Nov 18, evening; test_first_page_rows.js): it is the Client KBO plays card, with no title or sub line; Find new customers adds
// GenStudio for Performance Marketing (and with it Figma), all three together drop Brand Intelligence, and the canvases take the area's own name
const AGENTIC = {section: 'Revenue growth goals',
  areas: [
    ['Find new customers', 'Reach new buyers in ad and media channels, and show up when they ask AI.', ['rtcdp', 'gspm', 'bv', 'cw', 'cja'],
      ['cdn', 'dwh', 'cstore', 'crm', 'ads', 'bi', 'search', 'figma', 'chatgpt', 'claude', 'copilot']],
    ['Keep customers', 'Journeys that keep customers coming back, and answers when they ask.', ['ajo', 'bc', 'cw', 'cja'],
      ['dwh', 'cstore', 'crm', 'ads', 'bi', 'cms', 'chatgpt', 'claude', 'copilot']],
    ['Grow share of wallet', 'The right offer for each customer on the site, and journeys that cross-sell.', ['target', 'ajo', 'cw', 'cja'],
      ['dwh', 'cstore', 'crm', 'ads', 'bi', 'chatgpt', 'claude', 'copilot']]],
  all: ['Find, keep and grow customers', 'Or open all three together',
    ['rtcdp', 'gspm', 'bv', 'ajo', 'bc', 'target', 'cw', 'cja'], ['cdn', 'dwh', 'cstore', 'crm', 'ads', 'bi', 'search', 'cms', 'figma', 'chatgpt', 'claude', 'copilot']]};
const GS = 0, AG = 1;   // GenStudio family and revenue goal entries
// Ask it: the question each AI assistant line's card opens with, word for word (agentic_play_data.json, ask_it)
const ASK = {
  'Show journeys with loyalty audiences.': ['chatgpt-cw', 'claude-cw', 'copilot-cw'],
  'Create a new content fragment for the spring campaign based on our hero banner model and fill in its fields from this brief.': ['chatgpt-aemsites', 'claude-aemsites', 'copilot-aemsites'],
  'Find our approved spring campaign images and show me where each one is used.': ['chatgpt-aemassets', 'claude-aemassets', 'copilot-aemassets'],
  'Move task Wireframes to the Mobile App Redesign project.': ['chatgpt-workfront', 'claude-workfront', 'copilot-workfront'],
  'Show me the campaigns planned for next quarter.': ['chatgpt-planning', 'claude-planning', 'copilot-planning'],
  'How did our spring ads perform last month?': ['chatgpt-gspm', 'claude-gspm', 'copilot-gspm'],
  'Turn these notes into a formatted PDF.': ['chatgpt-acrobat', 'claude-acrobat', 'copilot-acrobat'],
  'Using Customer Journey Analytics, show me the top 20 pages by page views for the last 7 days.': ['chatgpt-cja', 'claude-cja'],
  'Show me what data views are available.': ['copilot-cja'],
  'Use Adobe to resize this photo for Instagram, YouTube, and TikTok.': ['copilot-creativecloud'],
  'Remove the background from this product photo.': ['chatgpt-creativecloud', 'claude-creativecloud'],
  'Make an Instagram post from a template with our spring offer.': ['chatgpt-express'],
  'What smart campaigns are active right now?': ['claude-marketo'],
  'Run our product-shot workflow on these five images.': ['claude-fireflycp'],
  'Show me all active tests that have reached statistical significance — which experiences are winning?': ['chatgpt-target', 'claude-target'],
  'Show me flow runs from the last 24 hours and flag any failures.': ['chatgpt-rtcdp', 'claude-rtcdp'],
  'Upload my asset to Frame.io, generate a share link, and request a review from the following people.': ['chatgpt-frameio', 'claude-frameio'],
  'List the pages in our about section and draft a new FAQ page there.': ['chatgpt-eds', 'claude-eds'],
  'Which campaigns/journeys are currently live?': ['claude-ajo'],
  'Check this graphic against our brand guidelines and show me what needs changing.': ['claude-brandintel']};
const ASK_OF = Object.fromEntries(Object.entries(ASK).flatMap(([q, ids]) => ids.map(id => [id, q])));
const BI_URL = 'https://developer.adobe.com/adobe-brand-intelligence/guides/mcp-integration/';
const fix = s => s.replace(/’/g, "'");

// ============ 1. the catalog: the starting systems, Ask it and Claude + Brand Intelligence ============
{ ok(CAT.products.length === 54 && CAT.products.filter(p => p.outside).length === 18 && CAT.connections.length === 217 && Object.keys(CAT.lines).length === 626 && WAVE.connections.length === 42,
    '1. the catalog holds 54 products (18 outside systems), 217 connections and 626 services (the Commerce round added 7, 13 and 33 on Nov 19), and 42 lines for ChatGPT, Claude and Microsoft Copilot (Claude + Brand Intelligence added, no new service)',
    [CAT.products.length, CAT.connections.length, Object.keys(CAT.lines).length, WAVE.connections.length].join());
  ok(Object.entries(START).every(([id, want]) => same(PLAY[id].ostart, want)),
    '1. each ready-made play starts with every outside system on its own list and every one that connects to one of its products: Adobe Brand Visibility the CDN and Search data; + Customer Journey Analytics the CDN, Data warehouse, Cloud storage, CRM, Ad platforms, BI tools, Search data, ChatGPT, Claude and Microsoft Copilot; + Adobe Commerce the CDN, Search data and the CRM; + Sites Optimizer and Edge Delivery Services the CDN, Search data, Authoring docs, ChatGPT and Claude; + Brand Concierge the CDN, Search data and another CMS site; Adobe Coworker ChatGPT, Claude and Microsoft Copilot',
    JSON.stringify(Object.fromEntries(Object.keys(START).map(id => [id, PLAY[id].ostart]))));
  const presets = /const CanvasPresets = (\{.*?\});/.exec(read('site/sow/index.html')), cp = presets ? JSON.parse(presets[1]) : {};
  ok(Object.entries(START).every(([id, want]) => cp[id] && same(cp[id].startingOutside, want)), '1. the SOW steps start a new engagement from the same lists (CanvasPresets)', presets ? presets[1].slice(0, 400) : 'none');
  const bi = CBY['claude-brandintel'], t = TYPES.connections['claude-brandintel'] || {}, w = WAVE.connections.find(c => c.id === 'claude-brandintel') || {};
  ok(bi && bi.a === 'claude' && bi.b === 'brandintel' && bi.kind === 'outside' && bi.line === 'assistant' && bi.source.url === BI_URL && /Claude Desktop as its example/.test(bi.how) &&
      bi.label === "Your client connects Brand Intelligence's brand checks to Claude, following Adobe's developer guide" && bi.gain.title === 'Brand checks where the work is made' &&
      same(bi.flows.map(f => [f.from, f.to, f.what, f.source.url]), [['claude', 'brandintel', 'The image or link to check', BI_URL], ['brandintel', 'claude', "The findings, against the brand's guidelines", BI_URL]]) &&
      same(bi.prereqs, ["Brand Intelligence with Validate, with the brand's guidelines loaded", "A developer connects Claude with an Adobe sign-in, following Adobe's guide"]) &&
      !bi.lines.length && !bi.more.length && bi.covered === "The Validate checks built into your client's tools service sits on Brand Intelligence itself." && bi.availability === '',
    '1. Claude + Brand Intelligence is an outside system line drawn as an AI assistant connection (Nov 19 2026), with its how (Claude Desktop as Adobe\'s example), label, what you get, two flows and two prerequisites from the build data, Adobe\'s developer guide as its source, no services of its own and where its work sits (Validate checks built into your client\'s tools, on Brand Intelligence)',
    JSON.stringify(bi).slice(0, 600));
  ok(bi && /^Your developer connects Claude to Brand Intelligence's brand checks/.test(bi.sowHow) && bi.sowGain === "Your marketers check a draft against your brand's guidelines by asking in Claude, before it goes to review." && !/your client|the partner/i.test(bi.sowHow + bi.sowGain),
    '1. its client version for the SOW steps and the RFI Builder speaks to the client ("Your developer", "Your marketers")', bi && bi.sowHow);
  ok(same((t.evidence || []).map(e => [e.url, e.quote]), [[BI_URL, 'This guide is for teams integrating Adobe Brand Intelligence Validate into their own chat assistant via its MCP (Model Context Protocol) server.'],
      [BI_URL, 'Example config (e.g. for Claude Desktop or any MCP-compatible host)'], [BI_URL, 'The validation result is the answer — never your own opinion.']]) && w.setup === "From Adobe's developer guide: your team sets it up" && w.no_services,
    '1. the three quotes that prove it stay as evidence in connection_types.json, word for word on Adobe\'s developer guide', JSON.stringify(t.evidence));
  const asked = CAT.connections.filter(c => c.ask), assistant = CAT.connections.filter(c => AI.includes(c.a) || AI.includes(c.b));
  ok(Object.keys(ASK_OF).length === 40 && assistant.length === 40 && assistant.every(c => c.ask === ASK_OF[c.id]) && asked.length === 40,
    '1. all 40 AI assistant lines carry their Ask it question, word for word as in the build data, and no other line has one', assistant.filter(c => c.ask !== ASK_OF[c.id]).map(c => c.id).join());
  const wa = WAVE.connections.filter(c => c.ask_it), adobeWords = wa.filter(c => c.ask_it.adobe_words);
  ok(wa.length === 40 && adobeWords.length === 21 && adobeWords.every(c => ALLOWED.test(c.ask_it.source)) && wa.filter(c => !c.ask_it.adobe_words).every(c => c.ask_it.within && !c.ask_it.source),
    '1. the questions and their sources stay with the research data for these lines: 21 in Adobe\'s own words with the Adobe page they come from, 19 plain ones with what the line does that they stay within', [wa.length, adobeWords.length].join());
  const shown = [bi.how, bi.label, bi.covered, bi.sowHow, bi.sowGain, bi.gain.title, bi.gain.text, ...bi.prereqs, ...bi.flows.map(f => f.what), bi.source.title, ...Object.keys(ASK),
    AGENTIC.section, ...AGENTIC.areas.flatMap(a => [a[0], a[1]]), AGENTIC.all[0], AGENTIC.all[1]];
  ok(!shown.some(s => LABELS.test(s)), '1. no release label, date, caveat or ask-Adobe line in the new line, the 40 questions or the agentic card', shown.filter(s => LABELS.test(s)).join(' | ')); }

(async () => {
  const b = await chromium.launch(), errs = [];
  const context = async (w = 1440, h = 900) => { const ctx = await b.newContext({viewport: {width: w, height: h}, acceptDownloads: true});
    await ctx.route(ORIGIN + '**', async r => { let u = decodeURIComponent(new URL(r.request().url()).pathname); if (u.endsWith('/')) u += 'index.html';
      const f = path.join(ROOT, 'site', u); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return r.fulfill({status: 404, body: ''}); await r.fulfill({path: f}); });
    return ctx; };
  const watch = p => { p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); }); return p; };
  const page = async (w, h) => { const p = watch(await (await context(w, h)).newPage()); await p.goto(ORIGIN + 'index.html'); await p.waitForFunction('window.READY===true'); return p; };
  const home = async p => { await p.evaluate(() => localStorage.clear()); await p.goto(ORIGIN + 'index.html'); await p.waitForFunction('window.READY===true'); };
  const state = p => p.evaluate(() => ({play: st.play, on: st.on.slice(), out: (st.out || []).slice(), area: st.area || null, label: document.getElementById('play-label').textContent,
    n: totals().n, yr: totals().yr, full: document.querySelectorAll('#edges path.edge').length === displayConnections().length, ids: [...prods(), ...conns()].flatMap(o => all(o)).filter(counted)}));
  // each starting system's connections to the canvas's products count exactly their starting services (the canvas's own default for each)
  const ticked = p => p.evaluate(() => st.out.every(x => conns().filter(c => c.a === x || c.b === x).every(c => all(c).every(l => counted(l) === defOf(l)))));
  const famClick = async (p, k, i) => {
    const family = k === AG ? PLAY.custom.agentic : PLAY.custom.family;
    await p.getByRole('button',{name:family.areas[Math.max(i,0)].question,exact:true}).click();
    await p.locator(i<0 ? '#bp [data-bpa="build-all"]' : '#bp [data-bpa="build"]').click();
    await p.waitForTimeout(400);
  };

  // Revenue goals preview a play. GenStudio questions show a detailed, priced recommendation.
  { const p = await page(1440, 900);
    const A = AGENTIC, family=PLAY.custom.family;
    const heads=await p.locator('#picker-list .sh').allTextContents();
    ok(same(heads,['Brand Visibility plays','Adobe agentic lineup','Build your own play, frontier model integrations']) &&
      await p.locator('#bp .bp-gh').first().textContent()===A.section,'2. the three play rows follow the revenue and GenStudio questions');
    for (const rate of [0,185]) {
      await p.evaluate(r=>{st.rate=r;render();},rate);
      for (const area of family.areas) {
        await p.getByRole('button',{name:area.question,exact:true}).click();
        const answer=p.locator('#bp .bp-ans');
        const quoted=await answer.locator('.bp-del b').textContent();
        const expected=await p.evaluate(rate=>rate?money(bpSim(bp.setup).yr):money(bpSim(bp.setup,100).yr)+' to '+money(bpSim(bp.setup,300).yr),rate);
        ok(await answer.locator('#bp-goal-title').textContent()==='Recommended: GenStudio · '+area.label &&
          same(await answer.locator('.bp-p').allTextContents(),area.products.map(id=>P[id].name)) &&
          await answer.locator('.bp-cx').count()>0 && await answer.locator(':scope > ul > li').count()>=2 &&
          await answer.locator('.bp-del p').textContent()===area.deliverable && quoted===expected &&
          same(await answer.locator('[data-bpr]').allTextContents(),area.refine.map(r=>r.chip)) &&
          await answer.locator('.capability-references a').count()===area.references.length &&
          await answer.locator('[data-bpa="build-all"]').textContent()===family.all,
          '2. '+area.label+' shows its connections, rationale, delivery, estimate, sources and refinements at rate '+rate);
        await answer.locator('[data-bpa="again"]').click();
      }
    }
    const opened = [];
    for (let i = 0; i < 3; i++) { await famClick(p, AG, i); opened.push(await state(p)); await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300); }
    ok(opened.every((s, i) => s.play === 'custom' && same(s.on, A.areas[i][2]) && same(s.out.slice().sort(), A.areas[i][3].slice().sort()) && s.n > 0),
      '2. each Client KBO area still opens Your own play with its products placed, its outside systems on and their services counted', JSON.stringify(opened.map(s => [s.on, s.out, s.n])));
    await p.context().close(); }

  // ============ 3. every starting canvas: its outside systems, their starting services, the view it opens in ============
  { const p = await page(), seen = {};
    for (const id of Object.keys(START)) { await home(p); await p.click(`#picker [data-play="${id}"]`); await p.waitForTimeout(400); seen[id] = {...await state(p), ticked: await ticked(p)}; }
    ok(Object.entries(START).every(([id, want]) => same(seen[id].out, want) && seen[id].ticked && !seen[id].area),
      '3. each ready-made play opened from the first page starts with exactly its outside systems, each with its connection\'s starting services ticked and its optional ones off', JSON.stringify(Object.fromEntries(Object.entries(seen).map(([k, v]) => [k, [v.out, v.ticked]]))));
    ok(Object.values(seen).every(v => v.full), 'each ready-made play opens with its full set of lines');
    // through Change play, and from the problem finder (Build this)
    await home(p); await p.click('#picker [data-play="abv"]'); await p.waitForTimeout(300); await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300);
    await p.click('#picker [data-play="aem"]'); await p.waitForTimeout(400); const changed = await state(p);
    const finder = {};
    for (const id of Object.keys(START)) { await home(p);
      await p.evaluate(id => { const i = PROBS.findIndex(q => q.play === id); bpAsk(PROBS[i].chip, i); }, id); await p.waitForTimeout(1300);
      await p.click('#bp-body [data-bpa="build"]'); await p.waitForTimeout(400); finder[id] = {...await state(p), ticked: await ticked(p)}; }
    ok(same(changed.out, START.aem) && Object.entries(START).every(([id, want]) => same(finder[id].out, want) && finder[id].ticked),
      '3. a ready-made play reached through Change play or the problem finder\'s Build this starts with the same outside systems and services', JSON.stringify({changed: changed.out, finder: Object.fromEntries(Object.entries(finder).map(([k, v]) => [k, v.out]))}));
    const cards = {};
    for (const id of Object.keys(CARDS)) { await home(p); await p.click(`#picker-list .pc-card[data-start="${id}"]`); await p.waitForTimeout(400); cards[id] = {...await state(p), ticked: await ticked(p)}; }
    ok(Object.entries(CARDS).every(([id, want]) => same(cards[id].out, want) && cards[id].ticked && cards[id].label === 'Your own play'),
      '3. Adobe Brand Concierge starts with another CMS site, and Adobe Brand Intelligence with Figma and Claude, each with its starting services', JSON.stringify(cards));
    const gs = {}, gsn = Object.keys(GENSTUDIO);
    for (let i = 0; i < 7; i++) { await home(p); await famClick(p, GS, i < 6 ? i : -1); gs[gsn[i]] = {...await state(p), ticked: await ticked(p)}; }
    ok(Object.entries(GENSTUDIO).every(([k, want]) => same(gs[k].out, want) && gs[k].ticked && gs[k].label === 'Your own play'),
      '3. each GenStudio area and the whole family starts with the outside systems its products connect to (Figma, Ad platforms and the three assistants where they connect), and stays Your own play',
      JSON.stringify(Object.fromEntries(Object.entries(gs).map(([k, v]) => [k, v.out]))));
    const ag = [];
    for (let i = 0; i < 4; i++) { await home(p); await famClick(p, AG, i < 3 ? i : -1); ag.push({...await state(p), ticked: await ticked(p)}); }
    const want = [...AGENTIC.areas.map(a => [a[0], a[2], a[3]]), [AGENTIC.all[0], AGENTIC.all[2], AGENTIC.all[3]]];
    ok(ag.every((s, i) => s.play === 'custom' && same(s.on, want[i][1]) && same(s.out, want[i][2]) && s.ticked && s.area === want[i][0] && s.label === want[i][0] && s.full),
      '3. each Client KBO area and all three together open Your own play with its products placed, every outside system they connect to on with its starting services, and the canvas named for it ("Find new customers", Nov 19 2026; before, "Adobe agentic AI: Find new customers"); each opens with all of its connections',
      JSON.stringify(ag.map(s => [s.label, s.on, s.out, s.full])));
    await home(p); await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(300);
    ok(same((await state(p)).out, []), '3. Create your own play opened empty starts with no outside system, as before');
    // removing a system takes its services with it
    await home(p); await p.click('#picker [data-play="cja"]'); await p.waitForTimeout(400); await p.fill('#rate', '150'); await p.waitForTimeout(200);
    const r0 = await p.evaluate(() => ({yr: totals().yr, ox3: counted('OX3'), fee: fee('OX3')}));
    await p.evaluate(() => removeOutside('dwh')); await p.waitForTimeout(300);
    const r1 = await p.evaluate(() => ({yr: totals().yr, ox3: [...prods(), ...conns()].some(o => all(o).includes('OX3') && counted('OX3')), out: st.out.slice()}));
    ok(r0.ox3 && !r1.ox3 && !r1.out.includes('dwh') && Math.round(r0.yr - r1.yr) === Math.round(r0.fee), '3. removing Data warehouse from Brand Visibility + Customer Journey Analytics takes its warehouse service and its fee with it', JSON.stringify({r0, r1}));
    // on every starting canvas each service is counted once
    ok([...Object.values(seen), ...Object.values(cards), ...Object.values(gs), ...ag].every(s => new Set(s.ids).size === s.ids.length), '3. no service is counted twice on any starting canvas');
    // Nov 19 2026: and work two services share is flagged: the Experience Platform warehouse source that CJA, Real-Time CDP and Journey Optimizer each set up
    // on the agentic canvases, on the canvas and on the SOW steps
    const flags = [];
    for (let i = -1; i < 3; i++) { await home(p); await famClick(p, AG, i);
      flags.push(await p.evaluate(() => { const here = l => [...prods(), ...conns()].some(o => all(o).includes(l)) && counted(l);
        return {ox3: overlapsOn('OX3').sort().join(), dw1: here('DW1') ? overlapsOn('DW1').join() : '', on: ['OX3', 'DW1', 'DW2'].filter(here).join()}; })); }
    await Promise.all([p.waitForURL(/\/sow\//), p.click('#save')]); await p.waitForTimeout(900); await p.fill('#service-rate', '150').catch(() => {});
    await p.evaluate(() => go('services')); await p.waitForTimeout(400);
    const sowFlags = await p.evaluate(() => [...document.querySelectorAll('.service-flag')].map(e => e.textContent));
    ok(same(flags.map(f => [f.on, f.ox3, f.dw1]), [['OX3,DW1,DW2', 'CJ01,DW1,DW2', 'DW2'], ['OX3,DW1', 'CJ01,DW1', ''], ['OX3,DW2', 'CJ01,DW2', ''], ['OX3,DW2', 'CJ01,DW2', '']]) && sowFlags.some(t => /CJA data preparation in Experience Platform/.test(t) && /Data Mirror/.test(t)),
      '3. the warehouse source CJA, Real-Time CDP and Journey Optimizer each set up in Experience Platform is flagged as shared work on every agentic canvas, and on the SOW steps', JSON.stringify({flags, sowFlags}).slice(0, 700));
    await p.context().close(); }

  // every canvas the first page opens, with all connections shown: no line runs into a box, measured in the stage's own units so its scale hides nothing
  { const p = await page(), bad = {};
    const look = async name => { await p.waitForTimeout(400);
      const r = await p.evaluate(() => { const nodes = [...document.querySelectorAll('#stage .node')].map(n => ({id: n.dataset.p, l: n.offsetLeft, t: n.offsetTop, r: n.offsetLeft + n.offsetWidth, b: n.offsetTop + n.offsetHeight})), out = new Set();
        for (const q of document.querySelectorAll('#edges path.edge')) { const L = q.getTotalLength();
          for (let d = 0; d <= L; d += 2) { const pt = q.getPointAtLength(d);
            for (const n of nodes) if (n.id !== q.dataset.s && n.id !== q.dataset.e && pt.x > n.l + 2 && pt.x < n.r - 2 && pt.y > n.t + 2 && pt.y < n.b - 2) out.add(q.dataset.c + ' in ' + n.id); } }
        return [...out]; });
      if (r.length) bad[name] = r; };
    for (const id of Object.keys(START)) { await home(p); await p.click(`#picker [data-play="${id}"]`); await look(id); }
    for (const id of Object.keys(CARDS)) { await home(p); await p.click(`#picker-list .pc-card[data-start="${id}"]`); await look(id); }
    for (const [k, n] of [[AG, 3], [GS, 6]]) for (let i = -1; i < n; i++) { await home(p); await famClick(p, k, i); await look((k === GS ? 'GenStudio ' : 'Client KBO ') + (i < 0 ? 'all' : i)); }
    ok(!Object.keys(bad).length, '3. on every canvas the first page opens, with all connections shown, no line runs into a box (the whole GenStudio family, whose starting systems put nine lines in one gap, included)', JSON.stringify(bad));
    await p.context().close(); }

  // ============ 4. the problem finder: its fee is the estimate of the canvas Build this opens ============
  { const p = await page(1440, 1000); await p.evaluate(() => { st.rate = 150; }); const rows = [];
    const entries = await p.evaluate(() => PROBS.map(q => ({id:q.id, goal:q.familyKey==='agentic'})));
    for (let i = 0; i < entries.length; i++) {
      await p.evaluate(i => bpAsk(PROBS[i].chip, i), i); await p.waitForTimeout(1200);
      const shown = await p.evaluate(() => { const b = document.querySelector('#bp-body .bp-del b'); return b ? b.textContent : ''; });
      await p.click('#bp-body [data-bpa="build"]'); await p.waitForTimeout(350);
      rows.push({...entries[i], shown, total:await p.evaluate(() => money(totals().yr))});
      await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(250); await p.evaluate(() => { st.rate = 150; }); }
    const priced = rows.filter(r => !r.goal), goals = rows.filter(r => r.goal);
    ok(priced.length === 29 && priced.every(r => r.shown === r.total), '4. each detailed problem, including all six GenStudio plays, quotes the fee on the canvas it opens', JSON.stringify(priced.filter(r => r.shown !== r.total)));
    ok(goals.length === 3 && goals.every(r => !r.shown && r.total.startsWith('$')), '4. revenue goals preview the play and show the estimate once its canvas opens');
    await p.context().close(); }

  // ============ 5. the SOW steps, the area's name, and states saved before this change ============
  // Nov 19 2026: a new engagement opened on the SOW steps themselves (?play=) starts as the canvas hands the same play over: the same outside systems,
  // services and hours, the services researched for the canvas that its starting systems bring included
  { const read = p => p.evaluate(() => { const t = totals(); return {out: (state.outside || {})[state.play], ids: selectedLines().map(l => l.id).sort().join(), one: t.oneHours, mo: t.monthHours}; });
    const rows = {};
    for (const id of Object.keys(START)) { const ctx = await context(), a = watch(await ctx.newPage()); await a.goto(ORIGIN + 'sow/index.html?play=' + id); await a.waitForTimeout(900); const direct = await read(a); await ctx.close();
      const c = await page(); await c.click(`#picker [data-play="${id}"]`); await c.waitForTimeout(300); await Promise.all([c.waitForURL(/\/sow\//), c.click('#save')]); await c.waitForTimeout(900);
      rows[id] = {direct, canvas: await read(c)}; await c.context().close(); }
    ok(Object.entries(rows).every(([id, r]) => same(r.direct.out, START[id]) && JSON.stringify(r.direct) === JSON.stringify(r.canvas)) && rows.cja.direct.one === 464 && ['OX1', 'OX3', 'OX4', 'OX5', 'CANVAS-SD1', 'CANVAS-AD1'].every(l => rows.cja.direct.ids.split(',').includes(l)),
      '5. a new engagement opened on the SOW steps at each ready-made play starts with the same outside systems, services and hours as the canvas hands over (Brand Visibility + Customer Journey Analytics 464 one-time hours)', JSON.stringify(rows).slice(0, 900)); }
  { const p = await page(); await famClick(p, AG, 1); await p.fill('#rate', '150'); await p.waitForTimeout(200);
    const c0 = await state(p); await p.reload(); await p.waitForFunction('window.READY===true'); await p.waitForTimeout(300); const c1 = await state(p);
    await Promise.all([p.waitForURL(/\/sow\//), p.click('#save')]); await p.waitForTimeout(1000);
    const sow = await p.evaluate(() => ({title: document.getElementById('play-title').textContent, area: state.area, n: selectedLines().length, total: totals().totalFee, outside: state.outside.custom}));
    const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#save-draft')]); const file = await dl.path(), draft = JSON.parse(fs.readFileSync(file, 'utf8'));
    const d = await page(); await d.setInputFiles('#draft-file', file); await d.waitForURL(/\/sow\//); await d.waitForURL(u => !/\/sow\//.test(String(u)), {timeout: 15000});
    await d.waitForFunction('window.READY===true'); await d.waitForTimeout(400); const back = await state(d);
    await d.goto(ORIGIN + 'sow/index.html#scope'); await d.waitForTimeout(900); const sow2 = await d.evaluate(() => document.getElementById('play-title').textContent);
    await d.goto(ORIGIN + 'index.html'); await d.waitForFunction('window.READY===true'); await d.waitForTimeout(300);
    const name = 'Keep customers';
    ok(c0.label === name && c1.label === name && sow.title === name && sow.area === name && draft.area === name && back.label === name && back.area === name && sow2 === name &&
        same(back.out, c0.out) && back.n === c0.n && sow.n === c0.n && sow.total === c0.yr,
      '5. the area\'s name stays through a reload, the SOW steps (their title), a draft saved and opened again, and the trip back to Build, with the same outside systems and total', JSON.stringify({c0: c0.label, c1: c1.label, sow, draft: draft.area, back: [back.label, back.n], sow2}));
    await d.click('#change-play'); await d.click('#confirm-yes'); await d.waitForTimeout(300); await d.click('#picker [data-play="custom"]'); await d.waitForTimeout(300);
    const changed = await state(d); await d.keyboard.press('Escape'); await d.click('#start-over'); await d.click('#confirm-yes'); await d.waitForTimeout(300);
    await famClick(d, AG, 0); const named = await state(d); await d.click('#start-over'); await d.click('#confirm-yes'); await d.waitForTimeout(300);
    const over = await d.evaluate(() => ({play: st.play, area: st.area || null})); await famClick(d, GS, 0); const genstudio = await state(d);
    ok(changed.label === 'Your own play' && !changed.area && named.area === 'Find new customers' && over.play === null && !over.area && genstudio.label === 'Your own play' && !genstudio.area,
      '5. the name goes when the partner changes play (Create your own play reads Your own play) or starts over, and a GenStudio area stays Your own play',
      JSON.stringify({changed: [changed.label, changed.area], named: named.area, over, genstudio: [genstudio.label, genstudio.area]}));
    await d.context().close(); await p.context().close(); }
  // Nov 19 2026: the name goes with the last of the area's products, on the canvas and on the SOW steps, and stays gone after a reload
  { const p = await page(); await famClick(p, AG, 1); const one = await p.evaluate(() => { for (const id of ['ajo', 'bc', 'cw']) removeProduct(id); return st.area || null; });
    await p.evaluate(() => { removeProduct('cja'); addProduct('workfront'); }); await p.waitForTimeout(300); const gone = await state(p);
    await Promise.all([p.waitForURL(/\/sow\//), p.click('#save')]); await p.waitForTimeout(900); const sow = await p.evaluate(() => ({title: document.getElementById('play-title').textContent, area: state.area || null}));
    await p.goto(ORIGIN + 'index.html'); await p.waitForFunction('window.READY===true'); await p.waitForTimeout(300); const back = await state(p);
    ok(one === 'Keep customers' && !gone.area && gone.label === 'Your own play' && same(gone.on, ['workfront']) && !sow.area && sow.title === 'Your own play' && !back.area && back.label === 'Your own play',
      '5. an area\'s name stays while one of its products is on the canvas and goes with the last of them: a canvas holding only Workfront reads Your own play, on Build, on the SOW steps and back on Build', JSON.stringify({one, gone: [gone.label, gone.on], sow, back: back.label}));
    await p.context().close(); }
  { // states saved on the build before this change (qa/agentic_fixtures, made on commit 03a07be): what they showed there
    const BEFORE = {
      saved_cja: [['cdn'], 7, 222000, {abv: ['cdn'], cja: ['cdn'], commerce: ['cdn'], aem: ['cdn'], fsi: ['cdn']}, 7, 222000],
      saved_coworker: [[], 6, 94500, {abv: ['cdn'], cja: ['cdn'], commerce: ['cdn'], aem: ['cdn'], fsi: ['cdn'], coworker: []}, 6, 94500],
      saved_genstudio_workflow: [[], 12, 152400, {abv: ['cdn'], cja: ['cdn'], commerce: ['cdn'], aem: ['cdn'], fsi: ['cdn'], custom: []}, 12, 152400]}, got = {};
    for (const k of Object.keys(BEFORE)) { const store = JSON.parse(fs.readFileSync(path.join(FIX, k + '.json'), 'utf8')), ctx = await context(), p = watch(await ctx.newPage());
      await p.goto(ORIGIN + 'robots.txt'); await p.evaluate(s => { for (const [x, v] of Object.entries(s)) localStorage.setItem(x, v); }, store);
      await p.goto(ORIGIN + 'index.html'); await p.waitForFunction('window.READY===true'); await p.waitForTimeout(400); const c = await state(p);
      await p.goto(ORIGIN + 'sow/index.html#services'); await p.waitForTimeout(1000);
      const s = await p.evaluate(() => ({outside: JSON.parse(JSON.stringify(state.outside)), n: selectedLines().length, total: totals().totalFee}));
      got[k] = [c.out, c.n, c.yr, s.outside, s.n, s.total]; await ctx.close(); }
    ok(Object.entries(BEFORE).every(([k, v]) => same(got[k], v)), '5. a canvas and its SOW state saved before this change (Brand Visibility + Customer Journey Analytics, Adobe Coworker, a GenStudio area) reopen with the same outside systems, services and totals: nothing added',
      JSON.stringify(got));
    const p = await page(); await p.setInputFiles('#draft-file', path.join(FIX, 'draft_fsi.json')); await p.waitForURL(/\/sow\//); await p.waitForURL(u => !/\/sow\//.test(String(u)), {timeout: 15000});
    await p.waitForFunction('window.READY===true'); await p.waitForTimeout(400); const c = await state(p);
    await p.goto(ORIGIN + 'sow/index.html#services'); await p.waitForTimeout(1000);
    const s = await p.evaluate(() => ({outside: state.outside.fsi, n: selectedLines().length, total: totals().totalFee}));
    ok(same(c.out, ['cdn']) && c.n === 6 && c.yr === 302400 && same(s.outside, ['cdn']) && s.n === 6 && s.total === 302400,
      '5. a draft saved before this change (Brand Visibility + Brand Concierge) opens with its CDN only and the same services and total, on Build and on the SOW steps', JSON.stringify({c: [c.out, c.n, c.yr], s}));
    await p.context().close(); }

  // ============ 6. Ask it: on every AI assistant line's card, and nowhere the client reads ============
  { const p = await page(1440, 1100), cards = {};
    const all = ['cw', 'aemsites', 'aemassets', 'workfront', 'planning', 'gspm', 'acrobat', 'cja', 'creativecloud', 'express', 'marketo', 'fireflycp', 'target', 'rtcdp', 'frameio', 'ajo', 'brandintel'];
    for (const set of [all, ['eds']]) {
      await home(p); await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(300); await p.keyboard.press('Escape');
      await p.evaluate(ids => { st.on = ids.slice(); st.out = ['chatgpt', 'claude', 'copilot']; render(); }, set); await p.waitForTimeout(300);
      Object.assign(cards, await p.evaluate(() => Object.fromEntries(conns().filter(c => ['chatgpt', 'claude', 'copilot'].some(x => x === c.a || x === c.b)).map(c => { pinned = true; showCard('c', c.id);
        const h = document.querySelector('#card h4'), next = h && h.nextElementSibling; return [c.id, next && next.classList.contains('ask') ? next.textContent : '']; })))); }
    ok(Object.keys(cards).length === 40 && Object.entries(ASK_OF).every(([id, q]) => cards[id] === 'Ask it: "' + q + '"'),
      '6. all 40 AI assistant line cards open, right under their heading, with "Ask it:" and the question in quotation marks, word for word', JSON.stringify(Object.entries(ASK_OF).filter(([id, q]) => cards[id] !== 'Ask it: "' + q + '"').map(([id]) => [id, cards[id]])));
    const other = await p.evaluate(() => { pinned = true; showCard('c', 'bv-cja'); return document.querySelectorAll('#card .ask').length; });
    ok(other === 0, '6. a line that is not an AI assistant\'s has no Ask it');
    await p.context().close();
    const files = ['site/sow/index.html', 'rfp_facts.json', 'rfp_method.json'].map(f => [f, read(f)]);
    ok(files.every(([, t]) => Object.keys(ASK).every(q => !t.includes(q) && !t.includes(JSON.stringify(q).slice(1, -1)))),
      '6. no question is in the SOW steps\' page, which also holds the statement of work and the RFI Builder, or in the RFI Builder\'s facts and write-ups', files.filter(([, t]) => Object.keys(ASK).some(q => t.includes(q))).map(f => f[0]).join()); }
  { const p = await page(); await famClick(p, AG, -1); await p.fill('#rate', '150'); await p.waitForTimeout(200);
    await Promise.all([p.waitForURL(/\/sow\//), p.click('#save')]); await p.waitForTimeout(1000);
    const text = await p.evaluate(async () => { const out = []; for (const s of ['scope', 'services', 'document']) { go(s); await new Promise(r => setTimeout(r, 500)); out.push(document.body.innerText); } return out.join('\n'); });
    const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#save-draft')]), draft = fs.readFileSync(await dl.path(), 'utf8');
    ok(text.length > 2000 && Object.keys(ASK).every(q => !text.includes(q) && !draft.includes(q)), '6. all three Client KBO areas together, handed to the SOW steps: no question on the Scope, Services or Statement of work steps, or in the draft file', text.length);
    await p.context().close(); }
  ok(!errs.length, 'no script errors on the canvas or the SOW steps', errs.slice(0, 3).join(' | '));
  await b.close();

  // ============ 7. the RFI Builder finds Claude + Brand Intelligence, and no question reaches its answers or downloads ============
  const h = await openRfi();
  const r = await h.text(['1. How would our marketers check graphics against our brand guidelines with Brand Intelligence inside Claude?',
    '2. Describe how our analysts would ask Customer Journey Analytics questions inside Microsoft Copilot.'].join('\n'));
  // the assistant line an answer leads with is its aiConn (since the review of the assistant boxes), read as test_ai_assistants.js reads it
  const leads = () => h.eval(() => RFPBuilder.state.questions.map(q => { const d = q.kind === 'adobe' ? q.draft || RFPAnswers.compose(q) : null; return d && d.m && d.m.aiConn ? d.m.aiConn.a + '+' + d.m.aiConn.b : null; }));
  const l1 = await leads(), q = r.questions.map((x, i) => ({conn: l1[i] || null, lines: x.draft ? x.draft.lines.map(y => y.id) : [], plain: x.draft ? x.draft.plain : ''}));
  ok(q[0] && q[0].conn === 'claude+brandintel' && q[0].plain.includes(CBY['claude-brandintel'].sowHow) && !/your client|the partner/i.test(q[0].plain),
    '7. an RFP question that names Claude and Brand Intelligence finds the Claude + Brand Intelligence line, and its answer leads with the line\'s client version', JSON.stringify(q[0]).slice(0, 500));
  // Nov 19 2026: a second wording, Claude named twice and Brand Intelligence's checks as validation
  const r2 = await h.text('1. We check brand compliance in Claude today. Explain how Brand Intelligence validation could run from Claude.');
  const l2 = await leads(), q2 = r2.questions.map((x, i) => ({conn: l2[i] || null, plain: x.draft ? x.draft.plain : ''}));
  ok(q2[0] && q2[0].conn === 'claude+brandintel' && q2[0].plain.includes(CBY['claude-brandintel'].sowHow), '7. so does an RFP question that says the client checks brand compliance in Claude and asks how Brand Intelligence validation could run from it', JSON.stringify(q2[0]).slice(0, 400));
  await h.text(['1. How would our marketers check graphics against our brand guidelines with Brand Intelligence inside Claude?',
    '2. Describe how our analysts would ask Customer Journey Analytics questions inside Microsoft Copilot.'].join('\n'));
  const pack = await h.eval(() => RFPAnswers.proposalPack().connections.map(c => c.pair));
  ok(pack.includes('Claude + Brand Intelligence'), '7. the proposal the RFI Builder writes lists Claude + Brand Intelligence among the connections in the answer', pack.join(', '));
  await h.setStatus(0, 'used'); await h.setStatus(1, 'used');
  const word = await h.word(), check = await h.checklist();
  const said = [...r.questions.map(x => x.draft ? x.draft.plain + JSON.stringify(x.draft.sections) : ''), JSON.stringify(word.blocks), JSON.stringify(check)].join('\n');
  ok(said.length > 1000 && Object.keys(ASK).every(qq => !said.includes(qq)), '7. no Ask it question in the RFI Builder\'s answers, its Word proposal or its checklist download', said.length);
  await h.close();

  console.log(fails ? `\n${fails} of ${n} AGENTIC PLAY CHECKS FAILED` : `\nALL ${n} AGENTIC PLAY CHECKS PASSED`);
  process.exit(fails ? 1 : 0);
})();
