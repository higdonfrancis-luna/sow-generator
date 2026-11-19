// Step 77 (Nov 11 2026, Adam: "yes, build it"): four client problems for Marketo Qualifier and Marketo Optimizer, and
// See all problems grouped by use case. Run from the repo root after the build:
//   node sow/test_step77.js
const {chromium} = require('playwright'), path = require('path'), fs = require('fs');
const PROBS = JSON.parse(fs.readFileSync(path.join(__dirname, 'canvas/problems.json'), 'utf8')).problems;
const CAT = JSON.parse(fs.readFileSync(path.join(__dirname, 'canvas/catalog.json'), 'utf8'));
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 600) + ']')); if (!c) fails++; };
const NEW = ['reps-email-by-hand', 'chats-never-reach-sales', 'same-nurture-path', 'ad-audiences-stale'];
const same = (a, b) => [...a].sort().join() === [...b].sort().join();
(async () => {
  const b = await chromium.launch(), page = await (await b.newContext({viewport: {width: 1280, height: 1000}})).newPage(), errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + path.join(__dirname, 'site/index.html')); await page.waitForSelector('.bp-chips');

  // the data
  ok(PROBS.length === 23 && PROBS.slice(0, 19).every(p => !NEW.includes(p.id)) && PROBS.slice(19).map(p => p.id).join() === NEW.join(), 'the list has 23 problems: the 19 in their places, then the four new ones');
  ok(PROBS.every(p => ['found', 'site', 'leads', 'messages', 'team'].includes(p.group)), 'every problem has a use-case group');
  const by = Object.fromEntries(PROBS.map(p => [p.id, p]));
  const srcs = ids => JSON.stringify(ids.map(id => CAT.connections.find(c => c.id === id).source.url));
  ok(by['reps-email-by-hand'].products.join() === 'mqualifier,marketo,crm' && by['chats-never-reach-sales'].products.join() === 'bc,mqualifier' && by['same-nurture-path'].products.join() === 'moptimizer,marketo' && by['ad-audiences-stale'].products.join() === 'moptimizer,marketo,ads',
    'two problems lead to Marketo Qualifier and two to Marketo Optimizer');
  ok(JSON.stringify(by['reps-email-by-hand'].sources) === srcs(['mqualifier-marketo', 'crm-mqualifier']) && JSON.stringify(by['chats-never-reach-sales'].sources) === srcs(['mqualifier-bc']) && JSON.stringify(by['same-nurture-path'].sources) === srcs(['moptimizer-marketo']) && JSON.stringify(by['ad-audiences-stale'].sources) === srcs(['moptimizer-ads', 'moptimizer-marketo']),
    'each new problem cites the Adobe pages of the connections it uses');
  ok(NEW.every(id => by[id].play === 'custom' && !by[id].starter && /^My client|^Visitors/.test(by[id].problem) && !/\bbeta\b|early access|coming soon|[–—]/i.test(JSON.stringify(by[id]))),
    'they are in the partner\'s voice, on Create your own play, with no release label and no dash');

  // the starting row is unchanged
  const start = await page.$$eval('[data-bpp]', x => x.map(e => e.textContent));
  ok(start.length === 6 && !await page.$('.bp-gh') && !!await page.$('[data-bpa="all"]'), 'the starting row still has six problems, no headings, and See all problems', start.join(' | '));

  // See all problems: five headings, each group's problems under it
  await page.click('[data-bpa="all"]');
  const groups = await page.$$eval('.bp-gh', hs => hs.map(h => ({h: h.textContent, chips: [...h.nextElementSibling.querySelectorAll('[data-bpp]')].map(c => c.textContent), tag: h.tagName, color: getComputedStyle(h).color, op: getComputedStyle(h).opacity})));
  ok(groups.map(g => g.h).join('|') === 'Get found in AI and search|Website and online store|Leads and sales|Customer messages and data|Content and team productivity', 'See all problems has five use-case headings, in order', groups.map(g => g.h).join('|'));
  const chips = groups.flatMap(g => g.chips);
  ok(groups.map(g => g.chips.length).join() === '5,5,5,4,4' && chips.length === 23 && new Set(chips).size === 23, 'the 23 problems sit under them, 5, 5, 5, 4 and 4, each once', groups.map(g => g.chips.length).join());
  ok(groups.length > 2 && groups[2].chips.join('|') === ["My client's B2B leads go cold", "My client's sales reps research and email every lead by hand", "My client's website chats never reach a salesperson", 'My client sends every lead down the same nurture path', "My client's ad audiences are out of date"].join('|'),
    'Leads and sales holds B2B leads go cold and the four new problems, as drawn', groups.length > 2 ? groups[2].chips.join('|') : '');
  ok(groups.length === 5 && groups[0].chips[0] === 'My client is missing from AI answers' && groups[1].chips[0] === "My client's website is slow" && groups[4].chips[3] === "My client's team spends too long pulling reports", 'the other groups are in the order drawn');
  ok(groups.every(g => g.tag === 'H3' && g.color === 'rgb(196, 0, 0)' && g.op === '1'), 'the headings are real headings in solid red, not dimmed', JSON.stringify(groups[0] || {}));
  ok(!/\bNEW\b/.test(await page.textContent('#bp')), 'no NEW tag is shown (it was only in the picture)');
  ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'nothing runs off the side of the page');
  await page.click('[data-bpa="fewer"]');
  ok((await page.$$('[data-bpp]')).length === 6 && !await page.$('.bp-gh'), 'Show fewer problems goes back to the six');

  // each new problem: its chip gives the setup and the connections, and Build this puts the same products on the canvas
  for (const id of NEW) {
    const p = by[id], names = p.products.map(x => CAT.products.find(q => q.id === x).name);
    await page.click('[data-bpa="all"]');
    await page.click('[data-bpp="' + PROBS.indexOf(p) + '"]'); await page.waitForSelector('#bp-body .bp-ans', {timeout: 5000}); await page.waitForTimeout(950);
    const a = await page.evaluate(() => ({boxes: [...document.querySelectorAll('.bp-ans .bp-p')].map(e => e.textContent.replace(' (outside system)', '')), cx: document.querySelectorAll('.bp-ans .bp-cx').length, want: bpConns(bp.setup).length, text: document.querySelector('.bp-ans').textContent, refine: document.querySelectorAll('[data-bpr]').length}));
    ok(same(a.boxes, names) && a.cx === a.want && a.cx >= 1 && a.text.includes(p.why.slice(0, 50)) && a.refine === p.refine.length, p.chip + ': the answer names ' + names.join(', ') + ', how they connect and ' + p.refine.length + ' ways to refine', JSON.stringify(a).slice(0, 500));
    await page.click('[data-bpa="build"]'); await page.waitForTimeout(250);
    const built = await page.evaluate(() => ({nodes: [...document.querySelectorAll('#stage .node')].map(x => x.dataset.p), play: JSON.parse(localStorage.getItem('abv-sow-build-v1')).play}));
    // Nov 18 2026: the canvas also starts with every outside system that connects to one of its products (Claude and the CRM to Marketo Engage, the CRM to
    // Marketo Qualifier, another CMS site to Brand Concierge, ad platforms to Marketo Optimizer)
    const EXTRA = {'reps-email-by-hand': ['claude'], 'chats-never-reach-sales': ['crm', 'cms'], 'same-nurture-path': ['crm', 'ads', 'claude'], 'ad-audiences-stale': ['crm', 'claude']};
    ok(built.play === 'custom' && same(built.nodes, [...p.products, ...EXTRA[id]]), 'Build this puts exactly those on Create your own play, and the outside systems that connect to them (Nov 18 2026)', JSON.stringify(built));
    await page.click('#change-play'); await page.click('#confirm-yes'); await page.waitForTimeout(150);
  }

  // typed problems find the new ones, and the old ones still lead where they did
  const QS = ['our SDRs spend all day on outbound prospecting emails', 'visitors use live chat on the site but nobody hands off to sales', 'every lead gets the same drip nurture track in Marketo', 'we upload lists to LinkedIn matched audiences by hand and they go stale',
    'our b2b leads go cold before sales calls them', 'my client wants a chatbot on their site', 'my client does not show up in ChatGPT'];
  const typed = await page.evaluate(qs => qs.map(q => { bpAsk(q); clearTimeout(bpT); return bp.view === 'nomatch' ? 'NOMATCH' : PROBS[bp.hits[0]].id; }), QS);
  ok(typed.slice(0, 4).join() === NEW.join(), 'a typed problem about outbound, chat handoff, nurture paths or ad audiences finds its new problem', typed.join());
  ok(typed[4] === 'b2b-leads-go-cold' && typed[5] === 'site-visitors-cant-find-answers' && typed[6] === 'ai-answers-missing', 'typed problems that matched before still lead to the same answers', typed.slice(4).join());

  ok(!errs.length, 'no script errors', errs.join(' | '));
  await b.close();
  console.log(fails ? '\n' + fails + ' STEP 77 CHECKS FAILED' : '\nALL STEP 77 CHECKS PASSED (' + n + ')'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
