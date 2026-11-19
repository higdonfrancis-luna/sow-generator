// The first page in Adam's row order, the Client KBO plays, one start card per AI assistant, two videos, the assistant lines' own look, Copilot's steps
// in the five assistant services and an i on Creative Cloud (Adam's decisions of Nov 18 2026, evening; pictures h1_first_page_rows.png, h2_two_videos.png and
// h3_first_page_kbo_and_assistant_cards.png in handoff/2026-11-17/ai_hosts/discovery_pictures, the research in ai_hosts/KBO_AND_ASSISTANT_CARDS.md, both on the
// handoff branch). States saved on the build before this change are in qa/first_page_fixtures (made on commit f306102).
// Run from the repo root after python3 canvas/build.py and python3 build_site.py:
//   node test_first_page_rows.js
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const {chromium} = require('playwright');
const ROOT = __dirname, ORIGIN = 'https://first-page-rows.test/', FIX = path.join(ROOT, 'qa', 'first_page_fixtures');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 700) + ']')); if (!c) fails++; };
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8'), json = f => JSON.parse(read(f)), same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const CAT = json('canvas/catalog.json'), WAVE = json('canvas/research/wave7_ai_assistants.json'), TYPES = json('canvas/research/connection_types.json'), KB = json('rfp_method.json');
const P = Object.fromEntries(CAT.products.map(p => [p.id, p])), CBY = Object.fromEntries(CAT.connections.map(c => [c.id, c])), PLAY = Object.fromEntries(CAT.plays.map(p => [p.id, p]));
const CUSTOM = PLAY.custom, AI = ['chatgpt', 'claude', 'copilot'];
// Adam, Nov 12 and Nov 18: "They don't need our editorial and our caveat and dates that things are coming"
const LABELS = /\bbeta\b|early access|early adopter|limited availability|coming soon|\bpreview\b|not yet|roadmap|\b(?:is|are|was|were) planned\b|planned for a future|future release|confirm(?:ed|s)? (?:[\w'-]+ ){0,6}with adobe|\bask adobe\b|written confirmation|(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+(?:\d{1,2},?\s+)?20\d\d|\bq[1-4]\s+20\d\d|\b20[2-3]\d\b|\bAdam\b/i;
// the first page, top to bottom (Adam: "First row should be those 4 Brand Visibility plays ... Second row should be our Adobe agentic offering ... Third row should
// be GenStudio ... Client KBO plays ... last row would be build your own play")
const ROWS = [
  ['Brand Visibility plays', ['Brand Visibility + Customer Journey Analytics', 'Brand Visibility + Adobe Commerce', 'Brand Visibility + Sites Optimizer and Edge Delivery Services', 'Brand Visibility + Brand Concierge']],
  ['Adobe agentic lineup', ['Adobe Coworker', 'Adobe Brand Visibility', 'Adobe Brand Concierge', 'Adobe Brand Intelligence']],
  ['Adobe GenStudio lineup', ['Adobe GenStudio']],
  ['Client KBO plays', ['']],
  ['Build your own play', ['Create your own play', 'Adobe in Claude', 'Adobe in ChatGPT', 'Adobe in Microsoft Copilot']]];
// the Client KBO plays: each area's sentence, products and the outside systems its canvas starts with (the rule: every system that connects to one of them)
const KBO = [
  ['Find new customers', 'Reach new buyers in ad and media channels, and show up when they ask AI.', ['rtcdp', 'gspm', 'bv', 'cw', 'cja'],
    ['cdn', 'dwh', 'cstore', 'crm', 'ads', 'bi', 'search', 'figma', 'chatgpt', 'claude', 'copilot']],
  ['Keep customers', 'Journeys that keep customers coming back, and answers when they ask.', ['ajo', 'bc', 'cw', 'cja'],
    ['dwh', 'cstore', 'crm', 'ads', 'bi', 'cms', 'chatgpt', 'claude', 'copilot']],
  ['Grow share of wallet', 'The right offer for each customer on the site, and journeys that cross-sell.', ['target', 'ajo', 'cw', 'cja'],
    ['dwh', 'cstore', 'crm', 'ads', 'bi', 'chatgpt', 'claude', 'copilot']],
  ['Find, keep and grow customers', 'Or open all three together', ['rtcdp', 'gspm', 'bv', 'ajo', 'bc', 'target', 'cw', 'cja'],
    ['cdn', 'dwh', 'cstore', 'crm', 'ads', 'bi', 'search', 'cms', 'figma', 'chatgpt', 'claude', 'copilot']]];
// one start card per AI assistant (Adam: "I think you would choose your platform"): its line, its products, and the outside systems its canvas starts with
const CARDS = {
  claude: ['Adobe in Claude', 'For clients who work in Claude', ['cw', 'cja', 'ajo', 'aemsites', 'workfront'], ['dwh', 'cstore', 'crm', 'ads', 'bi', 'claude']],
  chatgpt: ['Adobe in ChatGPT', 'For clients who work in ChatGPT', ['cw', 'cja', 'aemsites', 'gspm', 'express'], ['dwh', 'cstore', 'crm', 'ads', 'bi', 'figma', 'chatgpt']],
  copilot: ['Adobe in Microsoft Copilot', 'For clients who work in Microsoft 365', ['cw', 'cja', 'aemsites', 'workfront'], ['dwh', 'cstore', 'crm', 'ads', 'bi', 'copilot']]};
// the first look (overview_video on branch claude/upbeat-cerf-veoxip): its words from that video's own page
const LOOK = {file: 'sow-generator-and-rfi-builder-first-look.mp4', eye: 'A first look', title: 'See the services, the hours and the fees behind every Adobe product',
  line: "A 72-second overview: pick a play, see the services on every connection, enter your own rate, and turn it into a statement of work. Have an RFI? Drop it in for drafted answers with Adobe's sources."};
// Copilot's route in each of the five services named for ChatGPT, Claude or Microsoft Copilot, taken from that product's Copilot line; hours as before
const XT = {
  XT01: ['cja', [8, 16, 32], "(in Microsoft Copilot, add Adobe's Customer Journey Analytics address as a tool in Copilot Studio and build a small agent on it)"],
  XT03: ['aemsites', [16, 24, 40], "(in Microsoft Copilot, build an agent in Copilot Studio with Adobe's AEM address as its tool, following Adobe's step-by-step set-up)"],
  XT04: ['aemassets', [8, 16, 32], "(in Microsoft Copilot, the Copilot Studio agent with Adobe's AEM address as its tool)"],
  XT05: ['workfront', [16, 24, 40], "(in Microsoft Copilot, add Adobe's Workfront address following Microsoft's steps for a custom connection)"],
  XT06: ['gspm', [16, 24, 40], "in Microsoft Copilot, following Microsoft's steps for a custom connection)"]};
const CC_NOTE = "Creative Cloud for enterprise: the creative apps rolled out across your client's company. The services here cover user setup, app deployment packages, shared libraries, sharing rules, custom fonts, training and monthly administration, not any one app.";
const COPILOT_STUDIO = 'https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/mcp-support/enterprise-platforms/setup-microsoft-copilot-studio';

// ============ 1. the catalog: the rows, the cards, the line types, Copilot's steps and the Creative Cloud note ============
{ ok(same(CAT.rows.map(r => [r.head, r.plays || r.card]), [['Brand Visibility plays', ['cja', 'commerce', 'aem', 'fsi']], ['Adobe agentic lineup', ['coworker', 'abv']],
      ['Adobe GenStudio lineup', 'family'], ['Client KBO plays', 'agentic'], ['Build your own play', ['custom']]]) && CAT.plays.every(p => !('section' in p)),
    '1. the first page\'s rows are data, top to bottom: the four Brand Visibility plays, the agentic lineup (Coworker, then Brand Visibility), the GenStudio card, the Client KBO plays card and Build your own play; no play keeps a heading of its own',
    JSON.stringify(CAT.rows));
  ok(same(CUSTOM.starts.map(x => [x.label, x.after]), [['Adobe Brand Concierge', 'abv'], ['Adobe Brand Intelligence', 'abv'], ['Adobe in Claude', 'custom'], ['Adobe in ChatGPT', 'custom'], ['Adobe in Microsoft Copilot', 'custom']]),
    '1. Adobe Brand Concierge and Adobe Brand Intelligence sit after Adobe Brand Visibility, and the three assistant cards after Create your own play', JSON.stringify(CUSTOM.starts.map(x => [x.label, x.after])));
  const A = CUSTOM.agentic;
  ok(!A.label && !A.sub && !A.name && A.named && same(A.areas.map(a => [a.label, a.line, a.products]), KBO.slice(0, 3).map(a => a.slice(0, 3))) &&
      A.all.label === 'Or open all three together' && A.all.name === 'Find, keep and grow customers' && same(A.all.products, KBO[3][2]) && !('with' in A.all) && !A.all.products.includes('brandintel'),
    '1. the Client KBO plays card has no title or sub line; Find new customers adds GenStudio for Performance Marketing, all three together drop Brand Intelligence, and the canvases take the area\'s own name', JSON.stringify(A).slice(0, 500));
  ok(Object.entries(CARDS).every(([ai, [label, sub, products]]) => { const x = CUSTOM.starts.find(s => s.assistant === ai); return x && x.label === label && x.sub === sub && same(x.products, products) && x.named && x.places; }),
    '1. one start card per AI assistant: Adobe in Claude, Adobe in ChatGPT and Adobe in Microsoft Copilot, each with its line, its products and a canvas named after it');
  const assistant = CAT.connections.filter(c => AI.includes(c.a) || AI.includes(c.b)), outside = CAT.connections.filter(c => c.kind === 'outside');
  ok(assistant.length === 40 && assistant.every(c => c.line === 'assistant') && CAT.connections.filter(c => c.line === 'assistant').length === 40 && outside.every(c => ['native', 'platform', 'assistant'].includes(c.line)),
    '1. all 40 lines between ChatGPT, Claude or Microsoft Copilot and an Adobe product have the AI assistant line type, no other line has it, and every outside system\'s line now has a type',
    outside.filter(c => !c.line).map(c => c.id).join());
  ok(CBY['aa-cstore'].line === 'native' && CBY['gspm-ads'].line === 'native' &&
      TYPES.connections['aa-cstore'].evidence.some(e => e.quote === 'In the Destination section, configure the destination where you want the data to be sent.') &&
      TYPES.connections['gspm-ads'].evidence.some(e => e.quote === 'A GenStudio system manager or editor must connect the ad accounts for each paid ad platform before you can activate an experience to that platform.'),
    '1. Adobe Analytics + Cloud storage and GenStudio for Performance Marketing + Ad platforms are native: each is the product\'s own connection (Analytics data feeds to a cloud account set up in Analytics; GenStudio\'s own ad account connections), not through Experience Platform, as the CDN, Search Console and Figma lines are');
  const ca = CBY['copilot-aemsites'], wc = WAVE.connections.find(c => c.id === 'copilot-aemsites');
  ok(/builds an agent in Copilot Studio and adds Adobe's AEM address to it as a tool, following Adobe's step-by-step set-up/.test(ca.how) && ca.source.url === COPILOT_STUDIO &&
      ca.label === "Your client builds an agent in Copilot Studio with Adobe's AEM address as its tool" && ca.prereqs.some(x => /^Copilot Studio/.test(x)) && /Copilot Studio/.test(ca.sowHow) &&
      wc.setup === "From Adobe's developer guide: your team sets it up" && ['Follow these steps to connect Microsoft Copilot Studio to AEM\'s MCP servers.', 'Sign in using your Adobe ID when redirected.']
        .every(q => TYPES.connections['copilot-aemsites'].evidence.some(e => e.url === COPILOT_STUDIO && e.quote === q)),
    '1. Copilot + AEM Sites follows Adobe\'s step-by-step Microsoft set-up: an agent built in Copilot Studio with Adobe\'s AEM address as its tool, linked to that page, with its quotes as evidence and the client\'s version to match', ca.how);
  const cs = CBY['copilot-aemassets'], ws = WAVE.connections.find(c => c.id === 'copilot-aemassets');
  ok(/builds in Copilot Studio with Adobe's AEM address also covers AEM Assets/.test(cs.how) && cs.label === "The same Copilot Studio agent with Adobe's AEM address works with assets" && cs.prereqs.some(x => /^Copilot Studio/.test(x)) &&
      /Copilot Studio/.test(cs.sowHow) && !/Microsoft 365 Copilot/.test(cs.how + cs.sowHow + cs.label) && ws.setup === wc.setup &&
      TYPES.connections['copilot-aemassets'].evidence.some(e => e.url === COPILOT_STUDIO && e.quote === 'Follow these steps to connect Microsoft Copilot Studio to AEM\'s MCP servers.'),
    '1. Copilot + AEM Assets says the same route: the same Copilot Studio agent with Adobe\'s AEM address, its set-up, what comes first, its evidence and the client\'s version to match', cs.how + ' | ' + cs.sowHow);
  ok(Object.entries(XT).every(([id, [owner, hours, step]]) => { const L = CAT.lines[id], w = WAVE.products.flatMap(p => p.lines).find(l => l.id === id);
      return P[owner].more.includes(id) && same([L.low, L.base, L.high], hours) && L.scope.includes(step) && /ChatGPT|Claude/.test(L.scope) && w.basis.startsWith('One assistant (ChatGPT, Claude or Microsoft Copilot)') && w.default === false; }),
    '1. the five services named for ChatGPT, Claude or Microsoft Copilot each name Copilot\'s step in their scope and read "One assistant (ChatGPT, Claude or Microsoft Copilot)" in their basis, on the same products, off at the start, with the same hours',
    Object.keys(XT).map(id => id + ': ' + CAT.lines[id].scope.slice(0, 80)).join(' | '));
  ok(/Copilot Studio with Adobe's AEM address for Microsoft Copilot/.test(KB.services.XT03.steps.join(' ')) && /in Microsoft Copilot following Microsoft's steps/.test(KB.services.XT05.steps.join(' ')) && /Copilot Studio/.test(KB.services.XT01.steps.join(' ')) &&
      /the Copilot Studio agent with Adobe's AEM address for Microsoft Copilot/.test(KB.services.XT04.steps.join(' ')) && /in Microsoft Copilot, following Microsoft's steps for a custom connection/.test(KB.services.XT06.steps.join(' ')),
    '1. the five RFI write-ups name the same Copilot routes (Customer Journey Analytics, AEM Sites and AEM Assets through Copilot Studio, Workfront and GenStudio for Performance Marketing by Microsoft\'s steps)');
  ok(same(CAT.products.filter(p => p.info).map(p => [p.id, p.info]), [['creativecloud', CC_NOTE]]) && P.creativecloud.title === 'Creative Cloud for enterprise',
    '1. Creative Cloud alone carries a note, in plain words: what the tool means by Creative Cloud and what its services cover, naming no app');
  const shown = [...CAT.rows.map(r => r.head), ...CUSTOM.starts.flatMap(x => [x.label, x.sub]), ...A.areas.flatMap(a => [a.label, a.line]), A.all.label, A.all.name, CC_NOTE, LOOK.eye, LOOK.title, LOOK.line,
    ca.how, ca.label, ca.sowHow, ...ca.prereqs, ...Object.keys(XT).map(id => CAT.lines[id].scope)];
  ok(!shown.some(s => LABELS.test(s)), '1. no release label, date or caveat in the rows, the cards, the note, the first look\'s words, the corrected line or the five scopes', shown.filter(s => LABELS.test(s)).join(' | '));
  const sha = f => crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, f))).digest('hex');
  ok(fs.existsSync(path.join(ROOT, 'site', LOOK.file)) && sha(LOOK.file) === sha('site/' + LOOK.file) && fs.statSync(path.join(ROOT, LOOK.file)).size > 6e6,
    '1. the first look ships inside the site, byte for byte the copy kept in the repository (so git stores it once)'); }

(async () => {
  const b = await chromium.launch(), errs = [], asked = [];
  const context = async (w = 1440, h = 900, o = {}) => { const ctx = await b.newContext({viewport: {width: w, height: h}, acceptDownloads: true, ...o});
    await ctx.route(ORIGIN + '**', async r => { let u = decodeURIComponent(new URL(r.request().url()).pathname); if (u.endsWith('/')) u += 'index.html'; asked.push(u);
      const f = path.join(ROOT, 'site', u); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return r.fulfill({status: 404, body: ''}); await r.fulfill({path: f}); });
    await ctx.route('https://abvfirefly.netlify.app/**', r => r.fulfill({status: 404, body: ''}));
    return ctx; };
  const watch = p => { p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); }); return p; };
  const page = async (w, h, o) => { const p = watch(await (await context(w, h, o)).newPage()); await p.goto(ORIGIN + 'index.html'); await p.waitForFunction('window.READY===true'); return p; };
  const home = async p => { await p.evaluate(() => localStorage.clear()); await p.goto(ORIGIN + 'index.html'); await p.waitForFunction('window.READY===true'); };
  const state = p => p.evaluate(() => ({play: st.play, on: st.on.slice(), out: (st.out || []).slice(), area: st.area || null, label: document.getElementById('play-label').textContent,
    n: totals().n, yr: totals().yr, view: fv(), menu: outsideOffer().filter(id => !has(id))}));
  const clickIn = (p, sel) => p.evaluate(sel => document.querySelector(sel).click(), sel).then(() => p.waitForTimeout(450));
  // no box on another, no bolt on a box, every box inside the canvas (with every line drawn), and nothing scrolls sideways
  const clean = p => p.evaluate(() => { const boxes = [...document.querySelectorAll('#stage .node')].map(e => e.getBoundingClientRect()), dots = [...document.querySelectorAll('.ib')].map(e => e.getBoundingClientRect());
    const hit = (a, c) => a.left < c.right && c.left < a.right && a.top < c.bottom && c.top < a.bottom, se = document.scrollingElement;
    return {overlap: boxes.some((a, i) => boxes.some((c, j) => i !== j && hit(a, c))), dotOnBox: dots.some(d => boxes.some(x => hit(d, x))), sideways: se.scrollWidth > se.clientWidth + 1, n: boxes.length}; });

  // ============ 2. the first page: five rows in Adam's order, everything else where it was ============
  { const p = await page(1440, 900);
    const f = await p.evaluate(() => { const out = [];
      for (const h of document.querySelectorAll('#picker-list .sh')) { const next = h.nextElementSibling;
        out.push([h.textContent, next.classList.contains('grid') ? [...next.children].map(c => c.querySelector('b').textContent) : [(next.querySelector(':scope>b') || {}).textContent || '']]); }
      const kids = [...document.querySelector('#picker .in').children].map(e => e.id || e.className || e.tagName);
      const sizes = [...document.querySelectorAll('#picker-list .grid')].map(g => new Set([...g.children].map(c => { const r = c.getBoundingClientRect(); return [Math.round(r.top), Math.round(r.width), Math.round(r.height)].join(); })).size);
      return {rows: out, kids, sizes, badge: [...document.querySelectorAll('#picker-list .pc-badge')].map(x => x.closest('[data-play]').dataset.play + ':' + x.textContent)}; });
    ok(same(f.rows, ROWS), '2. the first page shows five rows in Adam\'s order, under these headings: Brand Visibility plays (the four plays), Adobe agentic lineup (Adobe Coworker, Adobe Brand Visibility, Adobe Brand Concierge, Adobe Brand Intelligence), Adobe GenStudio lineup, Client KBO plays (a card with no title) and Build your own play (Create your own play and the three assistant cards)',
      JSON.stringify(f.rows));
    ok(f.sizes.every(s => s === 1) && f.badge.join() === 'abv:New', '2. every row of plays is level with its cards the same size, and Adobe Brand Visibility keeps its New badge in the agentic lineup', JSON.stringify(f));
    ok(same(f.kids.slice(0, 5), ['vids', 'bp', 'rfi-door', 'H2', 'lead']) && f.kids[5] === 'picker-list',
      '2. everything else keeps its place: the videos at the top, then the problem finder, the RFI Builder door, Choose a play to start, and the rows', JSON.stringify(f.kids));
    const gs = await p.evaluate(() => { const x = document.querySelector('#picker-list .pc-fam[data-card="family"]'); return {label: x.querySelector(':scope>b').textContent, sub: x.querySelector(':scope>.s').textContent,
      areas: [...x.querySelectorAll('.fam-area')].map(a => a.querySelector('b').textContent + ':' + [...a.querySelectorAll('.chips span')].map(s => s.textContent).join('|')), all: x.querySelector('.fam-all').textContent}; });
    ok(gs.label === 'Adobe GenStudio' && gs.sub === 'People think it is one product. It is a family of products in six areas. Pick the area your client is buying.' && gs.areas.length === 6 &&
        gs.areas[1] === 'Creative foundations:Creative Cloud|Frame.io' && gs.all === 'Or open the whole family together', '2. the GenStudio card is unchanged but for its heading', JSON.stringify(gs));
    const kbo = await p.evaluate(() => { const x = document.querySelector('#picker-list .pc-fam[data-card="agentic"]');
      return {title: !!x.querySelector(':scope>b'), sub: !!x.querySelector(':scope>.s'), text: x.textContent, areas: [...x.querySelectorAll('.fam-area')].map(a => [a.querySelector('b').textContent, a.querySelector('.s').textContent, [...a.querySelectorAll('.chips span')].map(s => s.textContent), a.dataset.name]),
        all: [x.querySelector('.fam-all').textContent, x.querySelector('.fam-all').dataset.name]}; });
    ok(!kbo.title && !kbo.sub && !/agentic/i.test(kbo.text) && same(kbo.areas, KBO.slice(0, 3).map(a => [a[0], a[1], a[2].map(id => P[id].name), a[0]])) && same(kbo.all, ['Or open all three together', KBO[3][0]]),
      '2. the Client KBO plays card: no "Adobe agentic AI" title or sub line, the three areas with their sentences and chips, and "Or open all three together"', JSON.stringify(kbo).slice(0, 600));
    const cards = await p.evaluate(() => [...document.querySelectorAll('#picker-list .pc-card[data-assistant]')].map(c => ({ai: c.dataset.assistant, name: c.dataset.name, label: c.querySelector('b').textContent, sub: c.querySelector('.s').textContent,
      chips: [...c.querySelectorAll('.chips span')].map(s => [s.textContent, getComputedStyle(s).borderTopStyle])})));
    const short = id => P[id].short || P[id].name;
    ok(cards.length === 3 && cards.every(c => { const [label, sub, products] = CARDS[c.ai]; return c.label === label && c.name === label && c.sub === sub &&
        same(c.chips, [[P[c.ai].name, 'dashed'], ...products.map(id => [short(id), 'solid'])]); }),
      '2. each assistant card shows its assistant first, drawn like an outside system (a dashed outline), then its products', JSON.stringify(cards));
    // the product map at the bottom (Nov 19) scrolls sideways inside its own box on a phone, as it does under the canvas; that box stays inside the page
    for (const w of [1440, 390]) { await p.setViewportSize({width: w, height: 900}); await p.waitForTimeout(300);
      const lay = await p.evaluate(() => ({sideways: document.scrollingElement.scrollWidth > document.scrollingElement.clientWidth + 1 || [...document.querySelectorAll('#picker .in *')].some(e => !e.closest('.wke-graph-scroll svg') && e.getBoundingClientRect().right > innerWidth + 1),
        cols: getComputedStyle(document.querySelector('#picker-list .grid')).gridTemplateColumns.split(' ').length}));
      ok(!lay.sideways && lay.cols === (w > 1100 ? 4 : 1), `2. at ${w} px nothing runs off the side, and each row of plays is ${w > 1100 ? 'four cards across' : 'one card above another'}`, JSON.stringify(lay)); }
    await p.context().close(); }

  // ============ 3. the Client KBO plays: products, outside systems, names, and no fee line ============
  { const p = await page(1440, 900), seen = [];
    for (const [name] of KBO) { await home(p); await clickIn(p, `#picker-list [data-name="${name}"]`); seen.push(await state(p)); }
    ok(seen.every((s, i) => s.play === 'custom' && same(s.on, KBO[i][2]) && same(s.out, KBO[i][3]) && s.area === KBO[i][0] && s.label === KBO[i][0]),
      '3. each Client KBO area and all three together open Your own play with their products placed, every outside system they connect to on (the rule), and the canvas named "Find new customers", "Keep customers", "Grow share of wallet" or "Find, keep and grow customers"',
      JSON.stringify(seen.map(s => [s.label, s.on, s.out])));
    // Nov 19 2026: the area cards show no fee line (Adam: that is what the canvas estimates and the Services step are for), before or after a rate is entered
    await home(p); const look = () => p.evaluate(() => [...document.querySelectorAll('#picker-list .pc-fam[data-card="agentic"] .fam-area')].map(a => ({fee: !!a.querySelector('.fam-fee'), text: a.textContent})));
    const before = await look(); await p.evaluate(() => { st.rate = 175; render(); }); const after = await look();
    ok(before.length === 3 && [...before, ...after].every(a => !a.fee && !/\$|an hour/.test(a.text)),
      '3. no Client KBO area shows a fee line, before or after the partner enters a rate', JSON.stringify(after));
    await p.context().close(); }

  // ============ 4. one start card per AI assistant: its assistant alone, its products, its name, its places ============
  { const p = await page(1440, 900), seen = {};
    for (const ai of AI) { await home(p); await clickIn(p, `#picker-list .pc-card[data-assistant="${ai}"]`); await p.keyboard.press('Escape');
      const s = await state(p); await p.evaluate(() => { showAllEdges = true; fsel = null; render(); }); await p.waitForTimeout(700); seen[ai] = {...s, lay: await clean(p), places: await p.evaluate(() => !!areaPlaces())}; }
    ok(AI.every(ai => { const s = seen[ai], [label, , products, out] = CARDS[ai]; return s.play === 'custom' && same(s.on, products) && same(s.out, out) && s.label === label && s.area === label; }),
      '4. each assistant card opens Your own play with its products placed, its own assistant alone among ChatGPT, Claude and Microsoft Copilot, the other outside systems the rule puts on, and the canvas named like the card',
      JSON.stringify(Object.fromEntries(AI.map(ai => [ai, [seen[ai].label, seen[ai].on, seen[ai].out]]))));
    ok(AI.every(ai => AI.filter(x => x !== ai).every(x => seen[ai].menu.includes(x)) && !seen[ai].menu.includes(ai)), '4. the other two assistants wait in the Add outside system menu',
      JSON.stringify(Object.fromEntries(AI.map(ai => [ai, seen[ai].menu]))));
    ok(AI.every(ai => seen[ai].places && !seen[ai].lay.overlap && !seen[ai].lay.dotOnBox && !seen[ai].lay.sideways), '4. at 1440 px each assistant card\'s canvas keeps its own compact places, with every line drawn: no box on another, no bolt on a box, nothing off the side',
      JSON.stringify(seen));
    const ph = await page(390, 844, {isMobile: true, hasTouch: true}), phone = {};
    for (const ai of AI) { await home(ph); await clickIn(ph, `#picker-list .pc-card[data-assistant="${ai}"]`); phone[ai] = await clean(ph); }
    ok(AI.every(ai => !phone[ai].overlap && !phone[ai].dotOnBox && !phone[ai].sideways && phone[ai].n === CARDS[ai][2].length + CARDS[ai][3].length), '4. on a 390 px phone the same: every box drawn, none on another, and the page never scrolls sideways', JSON.stringify(phone));
    await ph.context().close();
    // the name stays through a reload, the SOW steps, a draft opened again and the trip back; Start over and Change play drop it
    const kept = {}, overs = {};
    for (const ai of AI) { await home(p); await clickIn(p, `#picker-list .pc-card[data-assistant="${ai}"]`); await p.fill('#rate', '150'); await p.waitForTimeout(200);
      const c0 = await state(p); await p.reload(); await p.waitForFunction('window.READY===true'); await p.waitForTimeout(300); const c1 = await state(p);
      await Promise.all([p.waitForURL(/\/sow\//), p.click('#save')]); await p.waitForTimeout(1000);
      const sow = await p.evaluate(() => ({title: document.getElementById('play-title').textContent, area: state.area, total: totals().totalFee, outside: state.outside.custom}));
      const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#save-draft')]); const file = await dl.path();
      const d = await page(); await d.setInputFiles('#draft-file', file); await d.waitForURL(/\/sow\//); await d.waitForURL(u => !/\/sow\//.test(String(u)), {timeout: 15000});
      await d.waitForFunction('window.READY===true'); await d.waitForTimeout(400); const back = await state(d);
      const name = CARDS[ai][0];
      kept[ai] = c0.label === name && c1.label === name && c1.area === name && sow.title === name && sow.area === name && back.label === name && back.area === name && same(back.out, c0.out) && back.yr === c0.yr && sow.total === c0.yr && same(sow.outside, c0.out) || {c0, c1, sow, back};
      await d.click('#start-over'); await d.click('#confirm-yes'); await d.waitForTimeout(300); overs[ai] = await d.evaluate(() => ({play: st.play, area: st.area || null}));
      await d.context().close(); }
    ok(AI.every(ai => kept[ai] === true), '4. each assistant card\'s canvas keeps its name and its outside systems through a reload, on the SOW steps (their title) and through a draft saved and opened again, with the same total', JSON.stringify(kept));
    const d = await page(); await clickIn(d, '#picker-list .pc-card[data-assistant="claude"]'); await d.click('#change-play'); await d.click('#confirm-yes'); await d.waitForTimeout(300);
    await d.click('#picker [data-play="custom"]'); await d.waitForTimeout(300); await d.keyboard.press('Escape'); const changed = await state(d);
    ok(AI.every(ai => overs[ai].play === null && !overs[ai].area) && changed.label === 'Your own play' && !changed.area, '4. Start over drops the name on each assistant card\'s canvas, and so does Change play (Create your own play reads Your own play again)', JSON.stringify({overs, changed}));
    await d.context().close(); await p.context().close(); }

  // ============ 5. two videos at the top: the plays video unchanged, the first look beside it, playing from the site ============
  { asked.length = 0; const p = await page(1440, 900);
    const v = await p.evaluate(() => { const card = id => { const c = document.getElementById(id), r = c.getBoundingClientRect(); return {x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height),
        eye: c.querySelector('.vid-eye').textContent, title: c.querySelector('.vid-t').textContent, line: c.querySelector('.vid-s').textContent, btn: c.querySelector('.vid-btn').textContent,
        poster: c.querySelector('.vid-poster img').src.slice(0, 23), pw: c.querySelector('.vid-poster img').naturalWidth, ph: c.querySelector('.vid-poster img').naturalHeight,
        fail: c.querySelector('.vid-fail').textContent, href: c.querySelector('.vid-fail a').getAttribute('href'), video: !!c.querySelector('video')}; };
      return {vid: card('vid-card'), look: card('look-card'), bp: document.getElementById('bp').getBoundingClientRect().width}; });
    const poster = fs.readFileSync(path.join(ROOT, 'video_poster.jpg')).toString('base64');
    ok(v.vid.eye === 'Start here' && v.vid.title === 'Watch the four Brand Visibility partner plays' && v.vid.line === 'Five minutes on what each play sells, who it is for and the services partners deliver. Then pick a play below and build its statement of work.' &&
        v.vid.btn === 'Watch the video' && v.vid.href === 'https://abvfirefly.netlify.app/' && await p.evaluate(s => document.querySelector('#vid-play img').src.endsWith(s), poster.slice(-200)),
      '5. the Brand Visibility video card keeps its words, its poster and its fallback link', JSON.stringify(v.vid));
    ok(v.look.eye === LOOK.eye && v.look.title === LOOK.title && v.look.line === LOOK.line && v.look.btn === 'Watch the video' && v.look.poster === 'data:image/jpeg;base64,' && v.look.pw === 1120 && v.look.ph === 630 &&
        v.look.href === LOOK.file && v.look.fail === 'The video could not play here. Open the video' && !v.look.video,
      '5. beside it, the first look: "A first look", its title and its 72-second line, Watch the video, its poster built into the page like the first one\'s, and the same fallback, pointing at its own file', JSON.stringify(v.look));
    ok(v.vid.y === v.look.y && v.vid.w === v.look.w && v.look.x > v.vid.x + v.vid.w && Math.abs(v.look.x + v.look.w - v.vid.x - v.bp) < 2 && !asked.some(u => /\.mp4$/.test(u)),
      '5. the two cards sit side by side across the width of the problem finder, and no video is fetched before it is played', JSON.stringify([v.vid, v.look, v.bp]));
    await p.click('#look-watch'); await p.waitForTimeout(2200);
    const play = await p.evaluate(() => { const x = document.querySelector('#look-box video'), r = x.getBoundingClientRect(), c = document.getElementById('look-card').getBoundingClientRect(), o = document.getElementById('vid-card').getBoundingClientRect();
      return {src: x.getAttribute('src'), controls: x.controls, poster: x.poster.slice(0, 23), t: x.currentTime, paused: x.paused, w: Math.round(r.width), cardW: Math.round(c.width), cardX: Math.round(c.left), other: [Math.round(o.top), Math.round(c.top)],
        fail: !document.getElementById('look-fail').hidden, jump: !!document.querySelector('#look-box .jbtn'), fs: !!document.querySelector('#look-box .fsb'), watch: document.getElementById('look-watch').hidden}; });
    ok(play.src === LOOK.file && asked.includes('/' + LOOK.file) && play.controls && play.poster === 'data:image/jpeg;base64,' && play.t > 0.3 && !play.paused && !play.fail && play.watch,
      '5. Watch the video plays the first look in place, from the site\'s own copy of the file, with the player\'s controls', JSON.stringify(play));
    // Nov 19 2026 (Adam: "maybe 50% of the width on the screen so they'd be next to each other"): a playing video stays in its own half of the row
    ok(play.w > 400 && play.w < play.cardW && play.cardW === v.look.w && play.cardX === v.look.x && play.other[0] === play.other[1] && !play.jump && play.fs,
      '5. while it plays it stays in its own half of the row, beside the plays video card, with the full screen button and no Jump to list (the first look has no parts)', JSON.stringify(play));
    // the plays video is played from Adam's video site; here any file that plays stands in for it
    await p.route('https://abvfirefly.netlify.app/**', r => r.fulfill({path: path.join(ROOT, LOOK.file), contentType: 'video/mp4'}));
    await p.click('#vid-watch'); await p.waitForTimeout(1500);
    const both = await p.evaluate(() => { const r = id => document.getElementById(id).getBoundingClientRect();
      return {playing: !document.querySelector('#vid-box video').paused, videos: document.querySelectorAll('.vid-box video').length, cards: [...document.querySelectorAll('.vid-card.playing')].map(c => c.id),
        poster: !!document.querySelector('#look-box #look-play img'), watch: !document.getElementById('look-watch').hidden, side: Math.round(r('look-card').top) === Math.round(r('vid-card').top) && r('look-card').left >= r('vid-card').right}; });
    ok(both.playing && both.videos === 1 && same(both.cards, ['vid-card']) && both.poster && both.watch && both.side,
      '5. starting the plays video stops the first look and puts its card back to its poster and words, beside the player: one video at a time, each in its own half of the row', JSON.stringify(both));
    await p.click('#look-play'); await p.waitForTimeout(1200);
    ok(await p.evaluate(() => !document.querySelector('#look-box video').paused && !document.querySelector('#vid-box video') && !!document.querySelector('#vid-box #vid-play img') && [...document.querySelectorAll('.vid-card.playing')].map(c => c.id).join() === 'look-card'),
      '5. and the other way round: the first look\'s poster plays it again, and the plays video goes back to its poster');
    await p.context().close();
    const q = await page(1440, 900); await q.route('**/' + LOOK.file, r => r.fulfill({status: 404, body: ''})); await q.click('#look-play'); await q.waitForTimeout(1200);
    ok(await q.evaluate(() => !document.getElementById('look-fail').hidden && document.querySelectorAll('#look-box video').length === 1), '5. a click on the poster plays it too, and where the file cannot play the same fallback line shows');
    await q.context().close();
    const ph = await page(390, 844, {isMobile: true, hasTouch: true});
    const pv = await ph.evaluate(() => { const r = id => document.getElementById(id).getBoundingClientRect(); return {vid: r('vid-card'), look: r('look-card'), box: r('look-box'), copy: document.querySelector('#look-card .vid-copy').getBoundingClientRect(),
      sideways: document.scrollingElement.scrollWidth > document.scrollingElement.clientWidth + 1}; });
    ok(pv.look.top >= pv.vid.bottom && pv.copy.top >= pv.box.bottom && !pv.sideways && Math.abs(pv.box.width / pv.box.height - 16 / 9) < 0.02, '5. on a phone the two cards stack, each picture over its words, and nothing runs off the side', JSON.stringify(pv));
    await ph.context().close(); }

  // ============ 6. the assistant lines' own look: thinner and grey, with a key entry only when one is on the canvas ============
  { const p = await page(1440, 900);
    await clickIn(p, '#picker-list .pc-card[data-assistant="claude"]'); await p.keyboard.press('Escape'); await p.evaluate(() => { showAllEdges = true; fsel = null; render(); }); await p.waitForTimeout(900);
    const look = await p.evaluate(() => { const st_ = e => { const s = getComputedStyle(e); return [s.stroke, s.strokeWidth]; };
      const es = [...document.querySelectorAll('path.edge')], ai = es.filter(e => /^claude-/.test(e.dataset.c)), other = es.filter(e => !/^claude-/.test(e.dataset.c) && !e.classList.contains('pf') && !e.classList.contains('pw') && !e.classList.contains('ex'));
      const key = document.querySelector('#t-legend .key-item.assistant');
      return {ai: ai.map(e => [e.dataset.c, e.getAttribute('class'), ...st_(e)]), other: other.map(e => [e.dataset.c, ...st_(e)]), key: key ? [key.textContent, getComputedStyle(key.querySelector('i')).borderTopColor] : null,
        token: getComputedStyle(document.documentElement).getPropertyValue('--ai').trim()}; });
    ok(look.ai.length === 5 && look.ai.every(([, cls, stroke, w]) => cls === 'edge ai' && stroke === 'rgb(138, 138, 138)' && w === '2px') && look.other.length && look.other.every(([, stroke, w]) => stroke === 'rgb(58, 58, 58)' && w === '2.5px') && look.token === '#8A8A8A',
      '6. every line between Claude and an Adobe product is thinner and grey (the --ai theme token), and the native lines keep their dark, thicker stroke', JSON.stringify(look).slice(0, 700));
    ok(look.key && look.key[0] === 'AI assistant connection' && look.key[1] === 'rgb(138, 138, 138)', '6. the line key has an entry "AI assistant connection", drawn the same grey', JSON.stringify(look.key));
    await home(p); await p.click('#picker [data-play="abv"]'); await p.waitForTimeout(500);
    const none = await p.evaluate(() => ({ai: document.querySelectorAll('path.edge.ai').length, key: !!document.querySelector('#t-legend .key-item.assistant'), keyText: document.getElementById('t-legend').textContent}));
    await home(p); await p.click('#picker [data-play="coworker"]'); await p.waitForTimeout(500);
    const cw = [await p.evaluate(() => [document.querySelectorAll('path.edge.ai').length, !!document.querySelector('#t-legend .key-item.assistant')])];
    for (const id of AI) { await p.evaluate(id => removeOutside(id), id); await p.waitForTimeout(250); }
    cw.push(await p.evaluate(() => [document.querySelectorAll('path.edge.ai').length, !!document.querySelector('#t-legend .key-item.assistant')]));
    ok(none.ai === 0 && !none.key && /Native integration/.test(none.keyText) && same(cw, [[3, true], [0, false]]),
      '6. with no assistant line on the canvas there is no grey line and no key entry (Adobe Brand Visibility; Adobe Coworker once its three assistants are removed)', JSON.stringify({none, cw}));
    await home(p); await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(300); await p.keyboard.press('Escape');
    await p.evaluate(() => { st.on = ['aa', 'gspm']; st.out = ['cstore', 'ads']; render(); }); await p.waitForTimeout(500);
    const two = await p.evaluate(() => Object.fromEntries(['aa-cstore', 'gspm-ads'].map(id => { hideCard(true); const e = document.querySelector(`path.edge[data-c="${id}"]`), drawn = e && [e.getAttribute('class'), getComputedStyle(e).stroke];
      pinned = true; showCard('c', id); return [id, [...(drawn || []), document.querySelector('#card .kind b').textContent, document.querySelector('#card .kind b').className]]; })));
    ok(same(two, {'aa-cstore': ['edge', 'rgb(58, 58, 58)', 'Outside system', ''], 'gspm-ads': ['edge', 'rgb(58, 58, 58)', 'Outside system', '']}),
      '6. the two lines that had no line type now draw solid, as native connections (each product\'s own connection to the system), and their cards still say Outside system', JSON.stringify(two));
    await p.context().close(); }

  // ============ 7. Copilot's step reaches the statement of work ============
  { const p = await page(1440, 900); await clickIn(p, '#picker-list .pc-card[data-assistant="copilot"]'); await p.fill('#rate', '150');
    await p.evaluate(() => { st.ls.XT01 = true; render(); }); await p.waitForTimeout(300);
    await Promise.all([p.waitForURL(/\/sow\//), p.click('#save')]); await p.waitForTimeout(1200);
    const sow = await p.evaluate(async step => { go('document'); await new Promise(r => setTimeout(r, 800)); const t = document.body.innerText; return {xt01: selectedLines().some(l => /XT01/.test(l.id)), copilot: t.includes(step), text: t.length}; }, XT.XT01[2]);
    ok(sow.xt01 && sow.copilot, '7. on the SOW steps, Customer Journey Analytics questions in ChatGPT, Claude or Microsoft Copilot carries Copilot\'s step (an agent built in Copilot Studio) into the statement of work', JSON.stringify(sow));
    await p.context().close(); }

  // ============ 8. the i on Creative Cloud: opens and closes by mouse, keyboard and touch, on the first page and on the canvas ============
  { const p = await page(1440, 900), tip = () => p.evaluate(() => { const t = document.getElementById('info-tip'); return t.hidden ? null : t.textContent; });
    const icons = await p.evaluate(() => [...document.querySelectorAll('#picker-list .info-i')].map(b => [b.dataset.info, b.closest('.chips > span').textContent, b.getAttribute('aria-label'), b.closest('.fam-area').querySelector('b').textContent]));
    ok(same(icons, [['creativecloud', 'Creative Cloud', 'What Creative Cloud means here', 'Creative foundations']]), '8. the first page shows one i, on the Creative Cloud chip of GenStudio\'s Creative foundations; the chip still reads Creative Cloud', JSON.stringify(icons));
    const i = '#picker-list .info-i[data-info="creativecloud"]';
    await p.hover(i); await p.waitForTimeout(150); const m1 = await tip(); await p.mouse.move(5, 5); await p.waitForTimeout(150); const m2 = await tip();
    await p.click(i); await p.waitForTimeout(150); const m3 = await tip(); await p.mouse.move(5, 5); await p.waitForTimeout(150); const m4 = await tip();
    const m5 = await p.evaluate(() => st.play); await p.mouse.click(700, 60); await p.waitForTimeout(150); const m6 = await tip();
    ok(m1 === CC_NOTE && m2 === null && m3 === CC_NOTE && m4 === CC_NOTE && m5 === null && m6 === null,
      '8. by mouse: hovering the i shows the note and moving away hides it; a click keeps it open (and opens no canvas) until a click elsewhere', JSON.stringify([m1, m2, m3, m4, m5, m6]));
    await p.focus('#picker-list .fam-area:has(.info-i)'); await p.keyboard.press('Tab'); await p.waitForTimeout(150);
    const k1 = [await tip(), await p.evaluate(() => document.activeElement.dataset.info)]; await p.keyboard.press('Escape'); await p.waitForTimeout(100);
    const k2 = [await tip(), await p.evaluate(() => document.activeElement.dataset.info)]; await p.keyboard.press('Enter'); await p.waitForTimeout(150);
    const k3 = [await tip(), await p.evaluate(i => [st.play, document.querySelector(i).getAttribute('aria-expanded')], i)]; await p.keyboard.press('Escape'); await p.waitForTimeout(100); const k4 = await tip();
    ok(k1[0] === CC_NOTE && k1[1] === 'creativecloud' && k2[0] === null && k2[1] === 'creativecloud' && k3[0] === CC_NOTE && same(k3[1], [null, 'true']) && k4 === null,
      '8. by keyboard: Tab to the i shows the note, Escape closes it and keeps the focus there, Enter opens it again without opening the canvas, and Escape closes it', JSON.stringify([k1, k2, k3, k4]));
    await p.context().close();
    const t = await page(390, 844, {isMobile: true, hasTouch: true}), ttip = () => t.evaluate(() => { const x = document.getElementById('info-tip'); return x.hidden ? null : [x.textContent, x.getBoundingClientRect().right <= innerWidth, x.getBoundingClientRect().left >= 0]; });
    await t.evaluate(sel => document.querySelector(sel).scrollIntoView({block: 'center'}), i); await t.waitForTimeout(200);
    await t.tap(i); await t.waitForTimeout(200); const t1 = await ttip(); const t2 = await t.evaluate(() => st.play); await t.tap('#picker-list .pc-card[data-play="cja"] .s'); await t.waitForTimeout(250);
    const t3 = await t.evaluate(() => ({tip: !document.getElementById('info-tip').hidden, play: st.play}));
    ok(t1 && t1[0] === CC_NOTE && t1[1] && t1[2] && t2 === null && !t3.tip, '8. by touch: a tap on the i opens the note inside the phone\'s width (and opens no canvas); a tap elsewhere closes it', JSON.stringify({t1, t2, t3}));
    await t.context().close();
    const c = await page(1440, 900); await clickIn(c, '#picker-list .pc-fam[data-card="family"] .fam-area:has(.info-i)'); await c.keyboard.press('Escape'); await c.waitForTimeout(300);
    const box = '#stage .node[data-p="creativecloud"] .info-i';
    await c.click(box); await c.waitForTimeout(200); const b1 = await c.evaluate(() => [document.getElementById('info-tip').hidden ? null : document.getElementById('info-tip').textContent, document.getElementById('card').hidden]);
    await c.keyboard.press('Escape'); await c.waitForTimeout(150); const b2 = await c.evaluate(() => document.getElementById('info-tip').hidden);
    await c.click('#stage .node[data-p="creativecloud"]', {position: {x: 30, y: 50}}); await c.waitForTimeout(400); const b3 = await c.evaluate(() => !document.getElementById('card').hidden && document.getElementById('card-heading').textContent);
    ok(b1[0] === CC_NOTE && b1[1] === true && b2 && b3 === 'Creative Cloud for enterprise', '8. on the canvas the Creative Cloud box has the same i: it opens the note without opening the box\'s card, Escape closes it, and the box itself still opens its card', JSON.stringify({b1, b2, b3}));
    await c.keyboard.press('Escape'); await c.waitForTimeout(300); await c.focus('#stage .node[data-p="creativecloud"]'); await c.keyboard.press('Tab'); await c.waitForTimeout(150);
    const ctip = () => c.evaluate(() => [document.getElementById('info-tip').hidden ? null : document.getElementById('info-tip').textContent, document.activeElement.dataset.info || null, document.getElementById('card').hidden]);
    const ck1 = await ctip(); await c.keyboard.press('Escape'); await c.waitForTimeout(100); const ck2 = await ctip(); await c.keyboard.press('Enter'); await c.waitForTimeout(150); const ck3 = await ctip();
    ok(ck1[0] === CC_NOTE && ck1[1] === 'creativecloud' && ck2[0] === null && ck2[1] === 'creativecloud' && ck3[0] === CC_NOTE && ck3[2] === true,
      '8. on the canvas by keyboard: Tab from the box to its i shows the note, Escape closes it, and Enter opens it again without opening the box\'s card', JSON.stringify([ck1, ck2, ck3]));
    await c.context().close();
    const ct = await page(390, 844, {isMobile: true, hasTouch: true}); await clickIn(ct, '#picker-list .pc-fam[data-card="family"] .fam-area:has(.info-i)'); await ct.keyboard.press('Escape'); await ct.waitForTimeout(300);
    await ct.evaluate(s => document.querySelector(s).scrollIntoView({block: 'center'}), box); await ct.waitForTimeout(200); await ct.tap(box); await ct.waitForTimeout(250);
    const ct1 = await ct.evaluate(() => ({tip: document.getElementById('info-tip').hidden ? null : document.getElementById('info-tip').textContent, card: !document.getElementById('card').hidden}));
    await ct.tap('#play-label'); await ct.waitForTimeout(200); const ct2 = await ct.evaluate(() => document.getElementById('info-tip').hidden);
    ok(ct1.tip === CC_NOTE && !ct1.card && ct2, '8. on a phone canvas by touch: a tap on the i opens the note without opening the box\'s card, and a tap elsewhere closes it', JSON.stringify({ct1, ct2}));
    await ct.context().close();
    ok(!read('site/sow/index.html').includes(CC_NOTE) && !read('rfp_facts.json').includes(CC_NOTE), '8. the note is for the partner on the canvas and the first page only: it is not in the SOW steps, the statement of work or the RFI Builder'); }

  // ============ 9. states saved on the build before this change reopen the same ============
  { const BEFORE = JSON.parse(fs.readFileSync(path.join(FIX, 'before.json'), 'utf8')), got = {};
    for (const k of ['saved_keep', 'saved_complete', 'saved_creative', 'saved_coworker']) { const store = JSON.parse(fs.readFileSync(path.join(FIX, k + '.json'), 'utf8')), ctx = await context(), p = watch(await ctx.newPage());
      await p.goto(ORIGIN + 'robots.txt'); await p.evaluate(s => { for (const [x, v] of Object.entries(s)) if (v !== null) localStorage.setItem(x, v); }, store);
      await p.goto(ORIGIN + 'index.html'); await p.waitForFunction('window.READY===true'); await p.waitForTimeout(400); const c = await state(p);
      await p.goto(ORIGIN + 'sow/index.html#services'); await p.waitForTimeout(1200);
      const s = await p.evaluate(() => ({outside: JSON.parse(JSON.stringify(state.outside)), n: selectedLines().length, total: totals().totalFee}));
      got[k] = {c, s}; await ctx.close(); }
    const sameState = k => { const was = BEFORE[k], now = got[k]; return now && same(now.c.on, was.canvas.on) && same(now.c.out, was.canvas.out) && now.c.n === was.canvas.n && now.c.yr === was.canvas.yr &&
      same(now.s.outside, was.sow.outside) && now.s.n === was.sow.n && now.s.total === was.sow.total; };
    ok(Object.keys(got).every(sameState), '9. canvases and their SOW states saved before this change (Keep customers, the complete agentic play with Brand Intelligence, GenStudio\'s Creative foundations, Adobe Coworker) reopen with the same products, outside systems, services and totals',
      JSON.stringify(Object.fromEntries(Object.keys(got).map(k => [k, {now: [got[k].c.on, got[k].c.out, got[k].c.n, got[k].c.yr, got[k].s.n, got[k].s.total], was: [BEFORE[k].canvas.on, BEFORE[k].canvas.out, BEFORE[k].canvas.n, BEFORE[k].canvas.yr, BEFORE[k].sow.n, BEFORE[k].sow.total]}]))));
    ok(got.saved_keep.c.label === 'Your own play' && !got.saved_keep.c.area && got.saved_creative.c.label === 'Your own play',
      '9. a canvas named on the build before ("Adobe agentic AI: Keep customers") keeps its products and reads Your own play, since the first page no longer opens a canvas by that name', JSON.stringify(got.saved_keep.c));
    const p = await page(); await p.setInputFiles('#draft-file', path.join(FIX, 'draft_complete.json')); await p.waitForURL(/\/sow\//); await p.waitForURL(u => !/\/sow\//.test(String(u)), {timeout: 15000});
    await p.waitForFunction('window.READY===true'); await p.waitForTimeout(400); const c = await state(p);
    await p.goto(ORIGIN + 'sow/index.html#services'); await p.waitForTimeout(1200);
    const s = await p.evaluate(() => ({outside: state.outside.custom, n: selectedLines().length, total: totals().totalFee})), was = BEFORE.draft_complete;
    ok(same(c.on, was.canvas.on) && same(c.out, was.canvas.out) && c.n === was.canvas.n && c.yr === was.canvas.yr && same(s.outside, was.sow.outside.custom) && s.n === was.sow.n && s.total === was.sow.total,
      '9. a draft saved before this change (the complete agentic play) opens with the same products, Brand Intelligence included, outside systems, services and total, on Build and on the SOW steps', JSON.stringify({c, s, was}));
    await p.context().close(); }

  ok(!errs.length, 'no script errors on the first page, the canvas or the SOW steps', errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(fails ? `\n${fails} of ${n} FIRST PAGE ROWS CHECKS FAILED` : `\nALL ${n} FIRST PAGE ROWS CHECKS PASSED`);
  process.exit(fails ? 1 : 0);
})();
