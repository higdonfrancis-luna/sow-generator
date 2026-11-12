// RFI Builder step 81 (Nov 11 2026, Adam: "the top one starting with answers, to print", then "add one sentence right
// under the total ... and fix all three"): plain Download menu labels, a sentence under the proposal's hours total, and
// three readings found while writing the demo RFP. No AI is called here.
// Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_step81.js
const fs = require('fs');
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 600) + ']')); if (!c) fails++; };
const cat = JSON.parse(fs.readFileSync(__dirname + '/canvas/catalog.json', 'utf8')).lines;
const doc = (...background) => ['Request for Proposal 2026-014', ...background,
  'A.1 Describe how you would set up the AEM Sites Cloud Manager program, environments, deployment pipelines and user access.',
  'A.2 Describe your go-live and cutover approach for the new AEM Sites website.',
  'B.1 Describe the Analysis Workspace projects you would build for our marketing team.',
  'B.2 Describe how you would set up Customer Journey Analytics connections and data views.',
  'B.3 Describe how you would train our analysts on Customer Journey Analytics.',
  'C.1 Describe the monthly services you would provide for Customer Journey Analytics after launch.',
  'C.2 Describe the monthly services you would provide for AEM Sites after launch.',
  'D.1 Provide three references from similar projects.'].join('\n\n');
(async () => {
  const h = await open(), p = h.page;
  const drafts = () => h.eval(() => Object.fromEntries(RFPBuilder.state.questions.map(q => { const d = q.kind === 'adobe' ? (q.draft || RFPAnswers.compose(q)) : null; return [q.label, {products: d ? d.m.products : [], lines: d ? d.m.lines : []}]; })));

  // 1. Adam, Nov 12 2026 (step 87): "treat this RFI builder ... as if no one owns those products because they might buy them
  //    together and then there would be services for them all". Whether the RFI says the client has licensed AEM Sites, runs it
  //    today, or both, the set-up and go-live services are offered; ownership is still read, for the license note.
  const SAYS = ['We have licensed Adobe Experience Manager Sites as a Cloud Service and Customer Journey Analytics. We are looking for a partner to stand up both.',
    'Our website runs on Adobe Experience Manager Sites today. We use Customer Journey Analytics for reporting.',
    'We have licensed Adobe Experience Manager Sites. Our website already runs on AEM Sites in production.'];
  for (const [k, says] of SAYS.entries()) {
    await h.text(doc(says), 'owned_' + k + '_rfp.txt');
    const r = await drafts();
    ok(r['A.1'].lines[0] === 'SI01' && r['A.2'].lines[0] === 'SI04' && await h.eval(() => RFPAnswers.ownedProducts().has('aemsites')),
      `where the RFI says "${says.slice(0, 60)}...", AEM Sites is known to be the client's and its set-up and go-live services are still offered`, JSON.stringify([r['A.1'].lines, r['A.2'].lines]));
  }

  // 2. Analysis Workspace follows the RFI
  await h.text(doc('We have chosen Adobe Experience Manager Sites and Customer Journey Analytics, and neither is set up yet.'), 'cja_rfp.txt');
  const one = t => h.eval(t => { const d = RFPAnswers.compose({text: t, kind: 'adobe', label: ''}); return {products: d ? d.m.products : [], lines: d ? d.m.lines : []}; }, t);
  const b1 = await one('Describe the Analysis Workspace projects you would build for our marketing team.');
  ok(b1.products.join() === 'cja' && b1.lines[0] === 'CJ04', 'in an RFI about Customer Journey Analytics, "Analysis Workspace projects" is answered with Customer Journey Analytics\' own service', JSON.stringify(b1));
  const ws = await h.eval(() => ['Build Analysis Workspace projects in Customer Journey Analytics.', 'Build Analysis Workspace projects in Adobe Analytics.'].map(t => RFPAnswers.detectAll(t).named));
  ok(ws[0].join() === 'cja' && ws[1].join() === 'aa', 'a line that names the product beside it goes to that product', JSON.stringify(ws));
  await h.text(['Request for Proposal: Adobe Analytics services', 'We run Adobe Analytics on all our sites. Adobe Analytics report suites need a cleanup. Adobe Analytics is our reporting tool.', '1.1 Describe the Analysis Workspace projects you would build for our marketing team.', '1.2 Describe how you would audit our Adobe Analytics report suites.'].join('\n\n'), 'aa_rfp.txt');
  const a1 = await one('Describe the Analysis Workspace projects you would build for our marketing team.');
  ok(a1.products.join() === 'aa' && a1.lines.includes('AN04'), 'in an RFI about Adobe Analytics it is Adobe Analytics, as before', JSON.stringify(a1));

  // 3. monthly services for a product whose monthly service is an optional one
  await h.text(doc('We have chosen Adobe Experience Manager Sites and Customer Journey Analytics, and neither is set up yet.'), 'cja_rfp.txt');
  r = await drafts();
  ok(r['C.1'].lines.join() === 'CJ06' && cat.CJ06.unit === 'monthly', '"monthly services for Customer Journey Analytics after launch" is answered with its monthly service, not a one-time one', JSON.stringify(r['C.1']));
  ok(r['C.2'].lines.join() === 'SI06', 'the same question about AEM Sites gets its monthly service, as before', JSON.stringify(r['C.2']));
  ok(r['B.2'].lines[0] === 'CJ02' && r['B.3'].lines[0] === 'CJ05' && !r['B.2'].lines.includes('CJ06') && !r['B.3'].lines.includes('CJ06'), 'questions that are not about after-launch work are answered as before', JSON.stringify([r['B.2'].lines, r['B.3'].lines]));

  // 3b. step 82 (Adam: "i want as perfect a product as possible"): the three readings that were seen and left
  const after = await one('Describe the monthly services you would provide after launch.');
  ok(after.lines.join() === 'SI06,CJ06', 'an after-launch question that names no product gets the monthly service of each of the RFI\'s two products (it got nothing when the two had a connection)', JSON.stringify(after));
  await h.text(['Request for Proposal 2026-015', 'We have chosen Adobe Experience Manager Sites for the new website.', '1.1 Describe how you would set up our AEM Sites Cloud Manager program, environments and deployment pipelines.', '1.2 Describe your go-live and cutover approach for the new AEM Sites website.', '1.3 Describe the Analysis Workspace projects you would build for our marketing team.'].join('\n\n'), 'setup_rfp.txt');
  r = await drafts();
  ok(r['1.1'].lines[0] === 'SI01' && r['1.2'].lines[0] === 'SI04' && await h.eval(() => !RFPAnswers.ownedProducts().has('aemsites')), '"set up our AEM Sites Cloud Manager program" asks for the set-up: it does not say the client already runs AEM Sites', JSON.stringify([r['1.1'].lines, r['1.2'].lines]));
  ok(await h.eval(() => RFPBuilder.state.questions.find(q => q.label === '1.3').kind) === 'adobe', 'a line that says only "Analysis Workspace" is sorted into Adobe products, not To sort');
  await h.text(doc('We have chosen Adobe Experience Manager Sites and Customer Journey Analytics, and neither is set up yet.'), 'cja_rfp.txt');

  // 4. the Download menu: four plain lines
  await h.setStatus(0, 'used'); await p.waitForTimeout(150); await p.click('#rfp-download-menu'); await p.waitForTimeout(150);
  const menu = await p.$$eval('#rfp-dl-menu button', bs => bs.map(b => b.querySelector('b').textContent + ': ' + b.querySelector('span').textContent));
  ok(menu.join(' | ') === 'Answers, to print: Your chosen answers, in order. | Answers, in Excel: Your chosen answers, one row each. | Full proposal, in Word: Written by AI. Takes 2 to 3 minutes. | My checklist: Notes for you, not the client.', 'the Download menu is four plain lines', menu.join(' | '));
  ok(await p.$$eval('#rfp-dl-menu button', bs => bs.every(b => !b.className && getComputedStyle(b.querySelector('span')).opacity === '1' && b.getBoundingClientRect().height < 80)), 'each is short, with nothing dimmed and no dividing rules');
  const dl = p.waitForEvent('download', {timeout: 10000}); await p.click('#rfp-download'); const f = await dl;
  ok(/-response\.html$/.test(f.suggestedFilename()), 'Answers, to print still gives the page to print', f.suggestedFilename());

  // 5. the proposal's Services and effort: a sentence right under the total when work is left to estimate
  const plan = {services: ['SI01', 'CJ02'], custom: [{work: 'Conversion of 300 legacy forms', estimate: 'By sample in discovery'}]};
  const five = await h.eval(pl => { const pack = RFPAnswers.proposalPack(); const withC = RFPProposal.servicesSection(pl, pack), without = RFPProposal.servicesSection({services: pl.services, custom: []}, pack); return {a: withC.blocks.map(b => b.type + ':' + (b.title || '') + ':' + (b.text || '').slice(0, 110)), b: without.blocks.map(b => b.type)}; }, plan);
  const at = five.a.findIndex(x => x.startsWith('callout:'));
  ok(at === 2 && five.a[1].startsWith('table:') && five.a[at] === 'callout:Not the whole job:This total covers the standard services above. The work listed below is not yet estimated and will add to it.', 'where the RFI asks for work the catalog does not cover, a boxed sentence sits right under the hours table: the total is not the whole job', five.a.join(' || '));
  ok(five.a.some(x => x.startsWith('h2::Work to be estimated in discovery')) && five.a.findIndex(x => x.startsWith('h2::Work to be estimated')) > at, 'the work to estimate is listed below it');
  ok(!five.b.includes('callout'), 'a proposal with nothing left to estimate has no such sentence', five.b.join());

  ok(!h.errors.length, 'no script errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? '\n' + fails + ' STEP 81 CHECKS FAILED' : '\nALL STEP 81 CHECKS PASSED (' + n + ')'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
