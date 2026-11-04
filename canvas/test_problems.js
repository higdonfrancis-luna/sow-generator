// Click test for Start from your client's problem (step 40) on the Build canvas. Run from the repo root:
//   node sow/canvas/test_problems.js
// Every problem chip and every refine chip is clicked like a partner would, and Build this must put exactly the products
// the answer named on the canvas, with the same total the answer quoted. Typed questions, no match, no rate and a phone too.
const {chromium} = require('playwright');
const path = require('path'), fs = require('fs');
const HERE = __dirname;
const CANVAS = 'file://' + path.join(HERE, 'index.html');
const CAT = JSON.parse(fs.readFileSync(path.join(HERE, 'catalog.json'), 'utf8'));
const PROBS = JSON.parse(fs.readFileSync(path.join(HERE, 'problems.json'), 'utf8')).problems;
const P = Object.fromEntries(CAT.products.map(p => [p.id, p])), PL = Object.fromEntries(CAT.plays.map(p => [p.id, p]));
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + d + ']')); if (!c) fails++; };
const same = (a, b) => [...a].sort().join() === [...b].sort().join();

async function answer(page) { await page.waitForSelector('#bp-body .bp-ans', {timeout: 5000}); await page.waitForTimeout(950); }
async function read(page) {
  return page.evaluate(() => ({rec: document.querySelector('.bp-ans .bp-lbl').textContent,
    boxes: [...document.querySelectorAll('.bp-ans .bp-p')].map(e => e.textContent.replace(' (outside system)', '')),
    total: (document.querySelector('.bp-del b') || {}).textContent || '', del: document.querySelector('.bp-del').textContent,
    heard: document.querySelector('.bp-heard').textContent,
    refine: [...document.querySelectorAll('[data-bpr]')].map(b => b.textContent)}));
}
async function build(page) {
  await page.click('[data-bpa="build"]'); await page.waitForTimeout(250);
  const r = await page.evaluate(() => ({picker: document.getElementById('picker').hidden, total: document.getElementById('t-big').textContent,
    nodes: [...document.querySelectorAll('#stage .node')].map(n => n.dataset.p), play: JSON.parse(localStorage.getItem('abv-sow-build-v1')).play}));
  await page.click('#change-play'); await page.click('#confirm-yes'); await page.waitForTimeout(150);
  return r;
}
const names = ids => ids.map(id => P[id].name);

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({viewport: {width: 1440, height: 1000}});
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(CANVAS); await page.waitForTimeout(300);

  // the box, in the partner's voice, above the play cards
  const top = await page.evaluate(() => ({t: document.querySelector('#bp .bp-t').textContent, ph: document.getElementById('bp-q').placeholder,
    above: !!(document.getElementById('bp').compareDocumentPosition(document.querySelector('#picker-list')) & Node.DOCUMENT_POSITION_FOLLOWING),
    chips: [...document.querySelectorAll('[data-bpp]')].map(b => b.textContent), all: !!document.querySelector('[data-bpa="all"]')}));
  ok(top.t === "Not sure which play? Start from your client's problem", 'the box asks about your client\'s problem', top.t);
  ok(top.ph === "e.g. My client doesn't show up when people ask ChatGPT about their category", 'the example is in the partner\'s voice', top.ph);
  ok(top.above, 'the box sits above the play cards');
  ok(top.chips.length === 6 && top.all, 'six suggested problems and See all problems', top.chips.join(' | '));
  await page.click('[data-bpa="all"]');
  ok(await page.locator('[data-bpp]').count() === 19, 'See all problems shows all 19');
  await page.click('[data-bpa="fewer"]');
  ok(await page.locator('[data-bpp]').count() === 6, 'Show fewer problems goes back to six');
  ok(PROBS.every(p => /\bmy client/i.test(p.problem) && /\bmy client/i.test(p.chip) && !/\b(we|our|us)\b/i.test(p.problem + ' ' + p.chip)), 'every problem and chip speaks as the partner, about my client');
  ok(PROBS.every(p => p.refine.every(r => /\bmy client/i.test(r.chip))), 'every refine chip speaks about my client');

  // a partner who entered $150 an hour before (the rate sits on the canvas toolbar, hidden while picking)
  await page.evaluate(() => localStorage.setItem('abv-sow-build-v1', JSON.stringify({v: 2, rate: 150}))); await page.reload(); await page.waitForTimeout(300);

  // every problem: the answer's play and products, then Build this gives the same products and total
  for (let i = 0; i < PROBS.length; i++) {
    const p = PROBS[i];
    await page.click('[data-bpa="all"]'); await page.click(`[data-bpp="${i}"]`);
    ok(await page.locator('.bp-work').count() === 1, `#${i + 1} shows a short working moment first`);
    await answer(page); const a = await read(page);
    const pl = PL[p.play], want = names(pl.custom ? p.products : p.products);
    ok(a.rec.includes(pl.label), `#${i + 1} recommends ${pl.label}`, a.rec);
    ok(same(a.boxes, want), `#${i + 1} names its products`, a.boxes.join(', '));
    ok(a.heard.startsWith('Heard: your client') || a.heard.startsWith('Heard: visitors'), `#${i + 1} says what it heard, about your client`, a.heard);
    const r = await build(page);
    ok(r.picker && r.play === p.play && same(r.nodes, p.products), `#${i + 1} Build this puts the same play and products on the canvas`, r.play + ' ' + r.nodes.join(','));
    ok(a.total && a.total === r.total, `#${i + 1} the answer's total matches the canvas (${r.total})`, a.total + ' vs ' + r.total);

    // each refine chip offered on the first answer, one at a time
    for (let k = 0; k < p.refine.length; k++) {
      await page.click('[data-bpa="all"]'); await page.click(`[data-bpp="${i}"]`); await answer(page);
      const btn = page.locator(`[data-bpr="${k}"]`);
      if (!(await btn.count())) { console.log(`   (#${i + 1} "${p.refine[k].chip}" is not offered on this setup)`); continue; }
      await btn.click(); await answer(page); const a2 = await read(page);
      ok(a2.heard.startsWith('Updated: '), `#${i + 1} refine "${p.refine[k].chip}" updates the answer`, a2.heard);
      ok(!a2.refine.includes(p.refine[k].chip), `#${i + 1} refine "${p.refine[k].chip}" is not offered twice`);
      const r2 = await build(page);
      ok(same(names(r2.nodes), a2.boxes) && a2.total === r2.total, `#${i + 1} refine "${p.refine[k].chip}" builds what it shows (${r2.total})`, a2.boxes.join(',') + ' vs ' + names(r2.nodes).join(',') + ' / ' + a2.total + ' vs ' + r2.total);
    }
  }

  // refine chips chain, and a chip that would drop a product the partner added is not offered
  await page.click('[data-bpa="all"]'); await page.click('[data-bpp="0"]'); await answer(page);
  await page.click('[data-bpr="0"]'); await answer(page);   // owns CJA: the CJA play
  let c = await read(page);
  ok(c.rec.includes(PL.cja.label) && !c.refine.some(t => /Commerce|financial/.test(t)), 'after CJA, chips that would drop CJA are not offered', c.refine.join(' | '));
  const bubbles = await page.locator('.bp-ask').count();
  ok(bubbles === 2, 'the question and the refine chip show as the partner\'s messages', String(bubbles));
  await page.click('[data-bpa="again"]');
  ok(await page.locator('#bp-form').isVisible() && await page.locator('[data-bpp]').count() === 6, 'Ask about another problem goes back to the question box');

  // a switch to Create your own play says the CDN box leaves
  await page.click('[data-bpp="1"]'); await answer(page);
  await page.click('[data-bpr="3"]'); await answer(page); c = await read(page);
  ok(/Create your own play/.test(c.heard) && /CDN box leaves the setup/.test(c.heard) && !c.boxes.includes('CDN'), 'readouts move the setup to Create your own play and say the CDN box leaves', c.heard);
  await page.click('[data-bpa="again"]');

  // typed questions, as partners would ask them
  const typed = [
    ["My client isn't showing up in ChatGPT", 'ai-answers-missing'],
    ["My customer's website is slow and hard to update", 'slow-website'],
    ['our client wants their website personalized, it shows every visitor the same thing', 'same-site-for-everyone'],
    ["My client's B2B leads go cold", 'b2b-leads-go-cold'],
    ['Shoppers abandon carts at my client and nobody follows up', 'abandoned-carts'],
  ];
  for (const [q, id] of typed) {
    await page.fill('#bp-q', q); await page.press('#bp-q', 'Enter'); await answer(page); c = await read(page);
    const want = PROBS.find(p => p.id === id);
    ok(c.rec.includes(PL[want.play].label) && same(c.boxes, names(want.products)), `typed "${q}" finds ${id}`, c.rec + ' / ' + c.boxes.join(','));
    await page.click('[data-bpa="again"]');
  }
  await page.fill('#bp-q', "My client doesn't show up when people ask ChatGPT about their category, and they can't tell if AI traffic turns into sales.");
  await page.click('.bp-go'); await answer(page); c = await read(page);
  ok(c.heard.startsWith('Two problems here:') && c.rec.includes(PL.cja.label), 'the mockup\'s question hears two problems and recommends the CJA play', c.heard + ' / ' + c.rec);
  ok(await page.locator('[data-bpa="another"]').count() === 1, 'Show another setup is offered when two problems match');
  await page.click('[data-bpa="another"]'); await answer(page); c = await read(page);
  ok(c.rec.includes(PL.abv.label), 'Show another setup shows the other match', c.rec);
  await page.click('[data-bpa="again"]');
  await page.fill('#bp-q', 'zebra quantum potato'); await page.press('#bp-q', 'Enter'); await page.waitForTimeout(100);
  const nm = await page.evaluate(() => ({t: document.getElementById('bp-body').textContent, chips: document.querySelectorAll('[data-bpp]').length, form: !document.getElementById('bp-form').hidden}));
  ok(/No match yet/.test(nm.t) && nm.chips >= 1 && nm.form, 'no match says so plainly and offers the closest problems', nm.t.slice(0, 90));
  await page.fill('#bp-q', ''); await page.press('#bp-q', 'Enter');
  ok(await page.locator('.bp-work, .bp-ans').count() === 0, 'an empty question does nothing');

  // ---------- step 41: the fixes from the step 40 review (sow/review_step40_2026-11-04/FINDINGS.md) ----------
  // a product the client already has: the services that stand it up start off, the note says so, Build this keeps them off
  await page.click('[data-bpp="0"]'); await answer(page); const own0 = await read(page);
  const edsK = PROBS[0].refine.findIndex(r => (r.owned || []).includes('eds'));
  await page.click(`[data-bpr="${edsK}"]`); await answer(page); const own1 = await read(page);
  const hrs = d => Number((d.match(/([\d,]+) one-time hour/) || [0, '0'])[1].replace(/,/g, ''));
  ok(/already has Edge Delivery Services, so these services start off: .*Implement AEM Sites on Edge Delivery/.test(own1.heard), 'S41: "site runs on Edge Delivery" says the services that stand it up start off', own1.heard);
  ok(!/Implement AEM Sites on Edge Delivery|SEO-safe content migration/.test(own1.del) && hrs(own1.del) < 600, 'S41: and the answer no longer quotes building or migrating that site', own1.del);
  const own2 = await build(page);
  ok(own1.total === own2.total, 'S41: Build this lands on the same total, with those services off', own1.total + ' vs ' + own2.total);
  await page.click('[data-bpp="0"]'); await answer(page); await page.click(`[data-bpr="${edsK}"]`); await answer(page); await page.click('[data-bpa="build"]'); await page.waitForTimeout(250);
  const offs = await page.evaluate(() => ['A01', 'A02', 'A03', 'A04', 'A05', 'SO2', 'L01'].map(l => lineOn(l)));
  ok(offs.slice(0, 5).every(v => v === false) && offs[5] && offs[6], 'S41: on the canvas the five Edge Delivery build services are off and the others on (the check brings any back)', offs.join(','));
  await page.click('#change-play'); await page.click('#confirm-yes'); await page.waitForTimeout(150);
  ok(PROBS.every(p => p.refine.every(r => !(r.owned || []).length || r.add.some(id => r.owned.includes(id)))), 'S41: every owned product is one the chip adds');

  // an answer left on the picker works out its fees again after the canvas changes (rate, size)
  await page.click('[data-bpp="1"]'); await answer(page); const st0 = await read(page);
  await page.click('#picker [data-play="aem"]'); await page.waitForTimeout(300);
  await page.fill('#rate', '300'); await page.click('#size [data-size="large"]'); await page.waitForTimeout(150);
  await page.click('#change-play'); await page.click('#confirm-yes'); await page.waitForTimeout(400);
  const st1 = await read(page);
  ok(st1.total !== st0.total && /at \$300 an hour/.test(st1.del), 'S41: after a new rate and size, the answer on the picker quotes them', st0.total + ' then ' + st1.total);
  const st2 = await build(page);
  ok(st1.total === st2.total, 'S41: and Build this lands on the total it quotes', st1.total + ' vs ' + st2.total);
  await page.evaluate(() => localStorage.setItem('abv-sow-build-v1', JSON.stringify({v: 2, rate: 150}))); await page.reload(); await page.waitForTimeout(300);

  // matching: 65 partner questions (the step 40 and step 41 reviewers' among them) land on the right problem; two
  // problems only when both are named ('TWO' or 'ONE' when it matters); null means anything but financial services
  const S41 = [
   ['abandoned carts are a big problem for my client','abandoned-carts'],['my client has lots of abandoned shopping carts','abandoned-carts'],["my client's pages load slowly",'slow-website'],
   ["our client's site speed is terrible",'slow-website'],["my client's site is slow",'slow-website'],['my client is in banking and members ask complicated questions','fsi-complex-questions'],
   ['my client is an insurer and customers call instead','fsi-complex-questions'],["ChatGPT gets my client's product details wrong",'product-pages-ai','ONE'],
   ['customer data is all over the place, CRM, warehouse, email','customer-data-silos','ONE'],['my client has a huge backlog of SEO fixes and no devs','seo-fix-backlog','ONE'],
   ['Real-Time CDP',null,'ONE'],['my client wants a chatbot on their site','site-visitors-cant-find-answers'],['my client wants to know how much revenue comes from ChatGPT','ai-traffic-revenue'],
   ['They want to know if AI is sending them any sales','ai-traffic-revenue'],['my client does not show up in Chat GPT','ai-answers-missing'],['my client wants to personalise their website','same-site-for-everyone'],
   ['LLMs never mention my client','ai-answers-missing'],['my client wants to rank higher','organic-traffic-falling'],['my client needs fewer calls to the call center','site-visitors-cant-find-answers'],
   ["My client doesn't show up when people ask ChatGPT about their category, and they can't tell if AI traffic turns into sales.",'ai-traffic-revenue','TWO'],
   ["My client isn't showing up in ChatGPT",'ai-answers-missing'],["My customer's website is slow and hard to update",'slow-website'],['Shoppers abandon carts at my client and nobody follows up','abandoned-carts'],
   ['my client is a bank and their customers call instead of finding answers online','fsi-complex-questions'],['zebra quantum potato','NOMATCH'],
   // the questions the step 41 re-check used
   ['Our insurance client wants to personalize their website','same-site-for-everyone'],['Insurance client: leads go cold in Marketo','b2b-leads-go-cold'],["Retail bank's marketing team is buried in busywork",'team-busywork'],
   ['An insurance company whose site is slow','slow-website'],['insurance','NOMATCH'],["Their sales team doesn't see what marketing does with leads",'b2b-leads-go-cold'],["Their sales reps can't see marketing engagement",'b2b-leads-go-cold'],
   ['They want to speed up approvals','content-too-slow'],['Our speed to market is too slow for campaigns','content-too-slow'],["Merchandisers can't update the store without devs",'storefront-hard-to-update'],
   ['Questions come up about pricing all the time on the site',null,'ONE'],['My client wants to come up with a new logo','off-brand-assets'],['The category managers want better merchandising','storefront-hard-to-update'],
   ['My client is missing from AI answers and their organic traffic is falling','organic-traffic-falling','TWO'],["My client isn't in ChatGPT answers and can't tell if AI traffic drives revenue",'ai-traffic-revenue','TWO'],
   ['Abandoned carts and emails go out on a calendar','abandoned-carts','TWO'],['Their reports are slow and their team is buried in routine work','slow-reporting','TWO'],
   ['Can we prove ROI from AI search traffic?','ai-traffic-revenue','ONE'],['The store is slow and product details are wrong in ChatGPT','product-pages-ai'],
   ["A fintech's users call support about their accounts",'fsi-complex-questions'],["A regional lender's borrowers call the call center about loan rates",'fsi-complex-questions'],
   ["An asset management firm's investors call with questions about their accounts",'fsi-complex-questions'],['My client is an investment firm and clients call with questions about their portfolio','fsi-complex-questions'],
   ["A credit card issuer's cardholders call about their rates",'fsi-complex-questions'],["An annuity provider's customers call about policies",'fsi-complex-questions'],
   ['Migrating from Sitecore','slow-website'],['They want to automate repetitive marketing work','team-busywork'],['Their team wastes hours on routine tasks','team-busywork'],
   ['The site takes 8 seconds to load','slow-website'],["Gemini and Claude never recommend my client's products",'ai-answers-missing'],['Everyone uses different versions of the logo','off-brand-assets'],
   ["Our brand guidelines aren't followed",'off-brand-assets'],['Customers call about accounts, policies or rates',null],["My client's banking or insurance customers call about accounts, policies or rates",'fsi-complex-questions'],
   ["My client's customers have complicated questions about accounts, policies or rates, and they leave the site or call instead.",null],
   ["My client's store is slow and hard to change",'storefront-hard-to-update'],["My client's site is slow and fails Core Web Vitals",'slow-website'],["My client's website is slow",'slow-website'],['We bank on AI to grow',null],
   ["my client doesn't know which pages drive conversions",'cant-see-what-works'],['Site search is terrible and people bounce','site-visitors-cant-find-answers'],
 // the second step 41 re-check's questions
 ['Their privacy policy page is outdated',null],["The retailer's return policy page gets a lot of calls",null],['The policy of the marketing team is to approve everything manually',null],
 ['They have a policy against using AI',null],['They have a loan of developers from another team',null],['Customers have questions about their return policy',null],
 ["A bank's conversion rate is low on the site",null],['Our client is a bank and their site has a bounce rate problem',null],['Quick question for you','NOMATCH'],['We need more data','NOMATCH'],
 ['How much revenue comes from AI assistants?','ai-traffic-revenue','ONE'],["They don't show up in AI answers and their search traffic is dropping",'organic-traffic-falling','TWO'],
 ["My client isn't showing up in AI search and their site fails Core Web Vitals",'slow-website','TWO'],["An insurer whose customers call about policies and who doesn't show up in AI answers",'fsi-complex-questions','TWO'],
 ["Customer data is scattered and they can't see which channels work",'customer-data-silos','TWO'],['The team spends too long pulling reports and is buried in routine work','slow-reporting','TWO'],
 ["My client's website doesn't appear in AI generated answers",'ai-answers-missing'],['Search engine traffic is falling','organic-traffic-falling'],["They can't tell which channel drives conversions",'cant-see-what-works'],
 ["Their messages aren't triggered by what customers do",'disconnected-messages'],["Customers can't find what they're looking for on the site",'site-visitors-cant-find-answers'],
 ['Their people waste hours on manual tasks','team-busywork'],['The site is not optimised for search','organic-traffic-falling'],['ChatGPT shows the wrong prices for their products','product-pages-ai'],
 ['Their product descriptions are wrong when people ask ChatGPT to compare products','product-pages-ai'],["They're losing traffic since Google started showing AI overviews",'organic-traffic-falling'],
 ["A mortgage lender whose borrowers can't find answers on the site",'fsi-complex-questions'],['A credit card company where cardholders call the call center','fsi-complex-questions'],
 ['Their content calendar slips and launches are late','content-too-slow'],['Their brand identity is inconsistent across teams','off-brand-assets'],['Leadership is pushing for faster reporting','slow-reporting'],
 ['They want geo-targeted personalization','same-site-for-everyone'],
 // the third step 41 re-check's questions ('!id' means anything but that problem)
 ['My client is looking to replatform their site','slow-website'],['My client is looking to rebuild their site','slow-website'],
 ['My client is an insurer and wants a chatbot on its site','fsi-complex-questions'],['My client is a wealth manager and wants Brand Concierge','fsi-complex-questions'],
 ['My client wants a chatbot that answers banking questions','fsi-complex-questions'],['A bank wants a conversational assistant for customer questions','fsi-complex-questions'],
 ['FSI client: members leave the site and call instead','fsi-complex-questions'],["My FSI client's customers call instead of finding answers online",'fsi-complex-questions'],
 ['My client is in finserv and customers call about rates','fsi-complex-questions'],["My client made a big investment in self service but visitors can't find answers",'site-visitors-cant-find-answers'],
 ["A retailer's shoppers can't find answers about credit card payments at checkout",'site-visitors-cant-find-answers'],["My client's catalog isn't showing up right in ChatGPT shopping",'product-pages-ai','ONE'],
 ["My client's products don't show up in ChatGPT shopping",'product-pages-ai','ONE'],['They want to run A/B tests on landing pages','same-site-for-everyone'],
 ['My client mentioned they want an AI agent for the team','team-busywork'],['My client wants to rank their leads by fit','!organic-traffic-falling'],
 ['My client wastes time marketing to the wrong people','!content-too-slow'],["Our bank's interest rates are wrong in ChatGPT",'!fsi-complex-questions'],
 ['Customers call about their loans instead of using the website','fsi-complex-questions'],["My client's insured members call about claims",'fsi-complex-questions'],
 ['My client wants to build customer journeys','disconnected-messages'],["Buyers can't find my client in ChatGPT",'ai-answers-missing'],['My client wants real-time dashboards','slow-reporting'],
 ['My client wants better visibility in large language models','ai-answers-missing'],['My client never shows up in GPT answers','ai-answers-missing'],['Fewer visitors from Google','organic-traffic-falling'],
  ];
  for (const [q, want, two] of S41) {
    const r = await page.evaluate(q => { bpAsk(q); clearTimeout(bpT); return {lead: bp.view === 'nomatch' ? 'NOMATCH' : PROBS[bp.hits[0]].id, pair: !!bp.pair}; }, q);
    ok((want === null ? r.lead !== 'fsi-complex-questions' : want[0] === '!' ? r.lead !== want.slice(1) : r.lead === want) && (!two || (two === 'TWO') === r.pair), `S41: "${q}" finds ${want === null ? 'anything but financial services' : want[0] === '!' ? 'anything but ' + want.slice(1) : want}${two === 'TWO' ? ', two problems' : two === 'ONE' ? ', one problem' : ''}`, JSON.stringify(r));
  }
  const fsiOff = await page.evaluate(() => { bpAsk('my client wants a chatbot on their site'); clearTimeout(bpT); return PROBS.findIndex(p => p.id === 'fsi-complex-questions'); });
  ok(await page.evaluate(i => bpScore(i, 'my client wants a chatbot and their customers call instead'), fsiOff) === 0, 'S41: the financial services problem needs an industry word');
  ok(await page.evaluate(() => { const ks = []; for (const p of PROBS) { bpAsk(p.chip); clearTimeout(bpT); const k = bp.hits.map(i => bpKey(bpBase(PROBS[i]))); ks.push(new Set(k).size === k.length); } return ks.every(Boolean); }), 'S41: Show another setup never repeats a setup');

  // the second re-check: notes name only the services in this setup; a storefront build stays unless the chip says so;
  // two problems start from an existing site; a switch to the FSI play brings its CDN box
  const sim = async (pid, chips) => page.evaluate(([pid, chips]) => { const p = PROBS.find(x => x.id === pid); let s = bpBase(p); const notes = [];
    for (const c of chips) { const r = p.refine.find(x => x.chip === c); const n = bpNext(s, r); const inSet = bpSim({...n, off: []}).ids; notes.push(n.off.filter(l => !(s.off || []).includes(l) && inSet.includes(l))); s = n; }
    const z = bpSim(s); return {ids: z.ids, notes, out: s.out, play: s.play}; }, [pid, chips]);
  let z = await sim('ai-answers-missing', ["My client's site runs on Edge Delivery Services"]);
  ok(!z.notes[0].some(l => /^XA|^XC|^SI/.test(l)) && z.notes[0].includes('A01'), 'S41: the "already has" note names only services this setup has', z.notes[0].join(','));
  z = await sim('off-brand-assets', ["My client's site runs on Edge Delivery", "My client's product images are in Commerce"]);
  ok(!z.ids.includes('A01'), 'S41: an Edge Delivery site the client has keeps its build off after a Commerce chip', z.ids.join(','));
  z = await sim('product-pages-ai', ["My client's storefront runs on Edge Delivery"]);
  ok(!z.ids.includes('XA18') && !z.ids.includes('XA19'), 'S41: a storefront the client already runs on Edge has no storefront build', z.ids.join(','));
  z = await sim('team-busywork', ['My client runs Marketo Engage']);
  ok(!['MK01', 'MK02', 'MK03', 'MK04', 'MK05'].some(l => z.ids.includes(l)) && z.ids.includes('MK06'), 'S41: a Marketo the client runs keeps only the work done in it', z.ids.join(','));
  z = await sim('site-visitors-cant-find-answers', []);
  ok(!['A01', 'A02', 'A03'].some(l => z.ids.includes(l)) && z.ids.includes('F02'), 'S41: "Visitors can\'t find answers" starts from the client\'s Edge Delivery site (no site rebuild)', z.ids.join(','));
  z = await sim('storefront-hard-to-update', []);
  ok(!z.ids.includes('A01') && z.ids.includes('XA18'), 'S41: the store problem builds the Commerce storefront, not an AEM Sites implementation', z.ids.join(','));
  z = await sim('site-visitors-cant-find-answers', ['My client is in financial services or insurance']);
  ok(z.play === 'fsi' && z.out.includes('cdn'), 'S41: a switch to the FSI play brings its CDN box', JSON.stringify(z.out));

  // step 43: the answer lists every connection under How they connect, with the bolt, the two products and the kind
  await page.evaluate(() => { clearTimeout(bpT); bp.view = 'start'; bpRender(); });
  await page.click('[data-bpp="1"]'); await answer(page);
  const cx = await page.evaluate(() => ({n: document.querySelectorAll('.bp-ans .bp-cx').length, want: bpConns(bp.setup).length, txt: [...document.querySelectorAll('.bp-ans .bp-cx')].map(e => e.textContent),
    bolt: [...document.querySelectorAll('.bp-ans .bp-cx .bp-pill')].every(e => e.querySelector('svg') && e.textContent.trim() === 'Integrate'), h3: [...document.querySelectorAll('.bp-ans h3.bp-lbl')].map(e => e.textContent)}));
  ok(cx.n === cx.want && cx.n === 2 && cx.txt.some(t => /CDN \+ Brand Visibility/.test(t)) && cx.bolt, 'S43: How they connect lists every connection, the CDN one included, each with the Integrate bolt', JSON.stringify(cx.txt));
  ok(cx.h3[0].startsWith('Recommended') && cx.h3.includes('How they connect') && cx.h3.includes('Why they work together'), 'S43: the answer\'s section labels are headings', cx.h3.join(' | '));
  ok(cx.txt.every(t => !/\bthe client\b|\bthe customer's\b/i.test(t)), 'S43: connection lines speak to the partner ("your client")', JSON.stringify(cx.txt));
  const allCx = await page.evaluate(() => PROBS.every(p => { bpAsk(p.chip, PROBS.indexOf(p)); clearTimeout(bpT); bp.view = 'answer'; bpRender(); return document.querySelectorAll('.bp-ans .bp-cx').length === bpConns(bp.setup).length; }));
  ok(allCx, 'S43: on all 19 answers, How they connect lists exactly the setup\'s connections');
  await page.evaluate(() => { clearTimeout(bpT); bp.view = 'start'; bpRender(); });

  // the why text drops a product a chip took out; notes are full sentences; outside systems lowercase mid-sentence
  const p8 = PROBS.findIndex(p => p.id === 'site-visitors-cant-find-answers'), k8 = PROBS[p8].refine.findIndex(r => r.play === 'fsi');
  await page.evaluate(() => { clearTimeout(bpT); bp.view = 'start'; bpRender(); });
  await page.click('[data-bpa="all"]'); await page.click(`[data-bpp="${p8}"]`); await answer(page); await page.click(`[data-bpr="${k8}"]`); await answer(page);
  const why8 = await page.$$eval('.bp-ans ul li', ls => ls.map(l => l.textContent).join(' '));
  ok(!/Edge Delivery/.test(why8), 'S41: after Edge Delivery leaves the setup, the why text no longer describes it', why8);
  await page.click('[data-bpa="again"]');
  ok(PROBS.every(p => p.refine.every(r => !r.note || (/^[A-Z]/.test(r.note) && /\.$/.test(r.note) && r.note.split(' ').length >= 4))), 'S41: every refine note is a full sentence');
  await page.click('[data-bpp="1"]'); await answer(page); await page.click('[data-bpr="1"]'); await answer(page); await page.click('[data-bpr="3"]'); await answer(page);
  const lc = await read(page);
  ok(/the data warehouse box/.test(lc.heard) && !/the Data warehouse/.test(lc.heard), 'S41: outside systems read lowercase mid-sentence', lc.heard);
  await page.click('[data-bpa="again"]');

  // no rate yet: the range at $100 to $300 an hour
  await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(300);
  await page.click('[data-bpp="0"]'); await answer(page); c = await read(page);
  ok(/ to \$.* at \$100 to \$300 an hour/.test(c.del) && /enter your rate/.test(c.del), 'with no rate, the answer gives the $100 to $300 range', c.del);
  const before = await page.evaluate(() => localStorage.getItem('abv-sow-build-v1'));
  await page.click('[data-bpa="again"]');
  ok(before === await page.evaluate(() => localStorage.getItem('abv-sow-build-v1')), 'asking changes nothing saved until Build this');
  ok(!errs.length, 'no page errors', errs.join(' | '));

  // a phone: no sideways scroll, on the question and on an answer
  const ph = await (await b.newContext({viewport: {width: 375, height: 800}, isMobile: true, hasTouch: true})).newPage();
  await ph.goto(CANVAS); await ph.waitForTimeout(300);
  const w1 = await ph.evaluate(() => document.getElementById('picker').scrollWidth <= document.getElementById('picker').clientWidth);
  await ph.tap('[data-bpp="3"]'); await answer(ph);
  const w2 = await ph.evaluate(() => document.getElementById('picker').scrollWidth <= document.getElementById('picker').clientWidth);
  ok(w1 && w2, 'on a phone the box and the answer fit with no sideways scroll');

  await b.close();
  console.log(fails ? `${fails} CHECK(S) FAILED` : 'ALL PROBLEM CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})();
