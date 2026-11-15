// Step 52 (Nov 10 2026): honest piles and matching. Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_step52.js
// Replays the reviewers' pile and matcher inputs (verification/c3_piles and c4_matcher) against the built prototype and
// checks the two piles, their filter counts, that questions with no product evidence are for the partner to write, and every honesty gate in the matcher: names apart from topic words,
// negation, products the catalog does not cover, the capability box, ties, owned products, No match, the missing pairs,
// the new aliases, the migration boost, every line's own source, the planning estimate, and the editable Drawn from chips.
const {tableIn} = require('./rfp_prototype/chatgpt_round5/test_word_complete.js');
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
const IN3 = require(__dirname + '/rfp_prototype/review_2026-11-09/verification/c3_piles/inputs.json');
const IN4 = require(__dirname + '/rfp_prototype/review_2026-11-09/verification/c4_matcher/inputs.json');
const fs = require('fs'), FIX = __dirname + '/qa/rfp_fixtures';
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 400) + ']')); if (!c) fails++; };
const prods = q => (q && q.draft ? q.draft.products.map(p => p.id) : []), lines = q => (q && q.draft ? q.draft.lines.map(l => l.id) : []);
const one = async (h, t) => (await h.text(t)).questions[0];
(async () => {
  const h = await open();
  let r, q;
  // 3.1 to 3.4 the piles
  const kinds = async arr => { const out = []; for (const x of arr) out.push(await h.classify(x.text)); return out; };
  let k = await kinds(IN3['C3.1']);
  ok(k.every(x => x === 'adobe'), '3.1 all 16 product questions with an everyday firm word (insurance, pricing, revenue, costs, employees ...) are Adobe products', JSON.stringify(k));
  k = await kinds(IN3['C3.2'].slice(1));
  ok(k.every(x => x === 'firm'), '3.2 staffing asks (a certified AEM project manager, the architect who will lead, developers assigned) are Your firm', JSON.stringify(k));
  k = await kinds(IN3['C3.4']);
  ok(k.every(x => x === 'firm'), '3.4 the six firm controls (references, team and certifications, pricing model, hourly rates, MSA, change control) stay in Your firm', JSON.stringify(k));
  const ex = Object.fromEntries(IN3.extra.map(x => [x.name.split(' ')[0], x.text]));
  ok(await h.classify(ex.X12) === 'firm' && await h.classify(ex.X13) === 'firm', '4.2 "Do you use generative AI tools such as ChatGPT in delivering services?" and "Are you SOC 2 Type II certified?" are Your firm');
  ok(await h.classify(ex.X11) === 'firm' && await h.classify(ex.X15) === 'firm', '4.1 "What is the target go-live date ..." and "Where will the solution be hosted ...?" name no product, so they go to Your firm');
  k = await kinds(['X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'X8', 'X9', 'X10'].map(x => ({text: ex[x]})));
  ok(k.every(x => x === 'adobe'), '3.1 the verifiers\' ten more firm words (time zone, escalation, discount, quality assurance ...) no longer pull product questions into Your firm', JSON.stringify(k));
  // the two pile names and filter counts
  r = await h.file(FIX + '/bank_rfp.xlsx');
  const labels = await h.eval(() => [...document.querySelectorAll('[data-rfp-filter]')].map(b => b.textContent));
  ok(labels.join('|') === 'All (14)|Adobe products (8)|Your firm (6)|To review (14)|Not picked up (3)', 'decision 3: the filters read Adobe products and Your firm, each with its count (step 55 adds To review)', labels.join('|'));
  ok((await h.eval(() => [...document.querySelectorAll('#rfp-questions .rfp-tag')].map(t => t.textContent))).includes('Adobe products') && (await h.eval(() => [...document.querySelector('#rfp-questions .rfp-kind').options].map(o => o.textContent).join('|'))) === 'Adobe products|Your firm', 'the row tag and the pile menu use the new names');
  r = await h.text('Who leads the project day to day?\n\nDescribe your approach to implementing AEM Sites.');
  ok(r.questions[0].kind === 'firm' && !r.questions[0].draft && r.questions[1].kind === 'adobe', '3.3 "Who leads the project day to day?" goes to Your firm and is not drafted (no Marketo from "leads")', JSON.stringify(r.questions.map(x => [x.kind, prods(x)])));
  const link = await h.eval(() => [...document.querySelectorAll('#rfp-questions .rfp-open')].map(x => x.textContent));
  ok(/^Write answer/.test(link[0]), 'a Your firm row says Write answer', JSON.stringify(link));
  ok(await h.eval(() => RFPBuilder.state.selected) === 1, 'the first answer to open is the first Adobe products row');
  await h.select(0);
  ok(/This one is about your firm/.test(await h.panel()) && await h.page.isVisible('#rfp-firm'), 'opening a Your firm row offers the partner an answer box');
  ok(/^0 of 1 Adobe product question is answered\./.test(await h.page.textContent('#rfp-summary')), 'Your firm rows are counted separately from Adobe answers', await h.page.textContent('#rfp-summary'));
  const doc=await h.word(),firm=tableIn(doc,'About our firm','Ref');
  const row=firm.find(r=>r.Requirement==='Who leads the project day to day?');
  const matrix=tableIn(doc,'Requirements matrix','Ref');
  ok(row?.['Our answer']==='[YOUR ANSWER]'&&matrix.find(r=>r.Requirement===row.Requirement)?.['Answered in']==='To write',
    'An unwritten firm question has a partner field in Word and no invented product answer',JSON.stringify(row));
  // 4.1 to 4.14 the matcher
  q = await one(h, 'Describe your approach to implementing Adobe Target personalization, and set a target date for the first test.');
  ok(prods(q).includes('target'), 'Adobe Target is still Adobe Target', JSON.stringify(prods(q)));
  q = await one(h, IN4['C4.3'][0].input);
  // step 66 (Nov 10 2026): Adobe Analytics is a product in the catalog now. The finding was that it was answered as Customer Journey
  // Analytics; it is answered from its own services, and the upgrade rule that stood in for it is gone
  ok(prods(q).includes('aa') && !prods(q).includes('cja') && lines(q).length > 0 && lines(q).every(l => /^(AN|XL)\d/.test(l)), '4.3 "Adobe Analytics" is answered from Adobe Analytics services, not as Customer Journey Analytics', JSON.stringify([prods(q), lines(q)]));
  await h.select(0);
  ok(!/not in this catalog/i.test(await h.panel()), '4.3 the partner\'s note no longer says Adobe Analytics is not in the catalog');
  q = await one(h, IN4['C4.4'][0].input);
  // step 61 (Nov 10 2026): AEM Forms is in the catalog now, so its question is answered with its own services; AEM Guides stands in for a product the catalog does not cover
  ok(q.draft && !(q.draft.uncovered || []).length && prods(q).join() === 'aemforms' && lines(q).length > 0 && lines(q).every(l => /^AF\d/.test(l)), '4.4 AEM Forms is answered with AEM Forms services, not as AEM Sites', JSON.stringify(q.draft && [prods(q), lines(q), q.draft.uncovered]));
  q = await one(h, 'Describe how you would use AEM Guides for our product documentation.');
  ok(q.draft && q.draft.uncovered && q.draft.uncovered.join() === 'AEM Guides' && !prods(q).includes('aemsites') && lines(q).length === 0, '4.4 AEM Guides is named as not in this catalog, not answered as AEM Sites', JSON.stringify(q.draft));
  await h.select(0);
  ok(/Not in this catalog/.test(await h.panel()) && await h.eval(() => !!document.getElementById('rfp-firm')), '4.4 the panel says Not in this catalog and gives a box for the partner\'s own answer');
  q = await one(h, IN4['C4.5'][0].input);
  ok(!prods(q).includes('target') && !q.draft, '4.5 "We will not use Adobe Target" drops Target (nothing else is named, so No match)', JSON.stringify(q.draft));
  await h.select(0);
  // The negative-only question has no named Target match; a request naming it against a background refusal does.
  ok(await h.page.locator('#rfp-scope-note').count() === 0 && /No match in the catalog/.test(await h.panel()), '4.5 Target appears only in the refusal, so the panel shows no scope note');
  q = await one(h, 'Request for Information\n\nConstraints\nWe will not use Adobe Target.\n\nRequirements\n1. Describe how you would implement Adobe Target.');
  await h.select(0);
  ok(!prods(q).includes('target') && /Your client rules out Target/.test(await h.page.locator('#rfp-scope-note').innerText()), '4.5 a request naming Target shows the background exclusion');
  q = await one(h, 'We will not use Adobe Target. Describe how Customer Journey Analytics would report on our campaigns.');
  ok(prods(q).includes('cja') && !prods(q).includes('target') && q.draft.excluded.join() === 'Target', '4.5 with another product named, the draft keeps it and records the exclusion', JSON.stringify(q.draft && [prods(q), q.draft.excluded]));
  for (const x of IN4['C4.6']) { q = await one(h, x.input); ok(q.draft && q.draft.conn === 'commerce+aemassets' && !prods(q).includes('aemsites'), '4.6 "' + x.input.slice(0, 50) + '..." gets Commerce + AEM Assets', JSON.stringify(q.draft && [prods(q), q.draft.conn])); }
  r = await h.file(FIX + '/bank_rfp.xlsx');
  q = r.questions.find(x => x.label === '2.2');
  ok(q.draft.conn === 'bv+cja' && lines(q).join() === 'C01', '4.7 bank 2.2 keeps the connection line C01 and drops the Adobe Analytics upgrade and the unrelated audiences line', JSON.stringify(lines(q)));
  q = r.questions.find(x => x.label === '2.7');
  // step 61: the site forms that feed Marketo are AEM Forms + Marketo Engage now (the Marketo + Edge Delivery service was retired)
  ok(q.draft.conn === 'aemforms+marketo' && ['AFX09', 'AFX10'].every(l => lines(q).includes(l)) && !lines(q).some(l => /^MK|^A0/.test(l)), '4.7 bank 2.7 ("runs Marketo Engage") drops the instance setup and the site go-live, and keeps the site forms that feed Marketo', JSON.stringify([q.draft.conn, lines(q)]));
  q = r.questions.find(x => x.label === '2.6');
  ok(q.draft && q.draft.kb && lines(q).length === 0, '4.9 bank 2.6 (where is our data hosted, which certifications apply) gets the sourced knowledge-base answer (part three), not a build plan');
  q = r.questions.find(x => x.label === '2.5');
  const approach = q.draft.sections[0][1][0];
  ok(/^After launch, across the Adobe products in this proposal, our ongoing services for /.test(approach) && q.draft.lines.every(l => l.unit === 'monthly') && approach.split('for ')[1].split(' are these')[0].split(/, | and /).every(n => q.draft.lines.length && ['Brand Visibility', 'AEM Sites', 'Customer Journey Analytics', 'Brand Concierge', 'Marketo Engage', 'AEM Forms', 'Real-Time CDP', 'Target'].includes(n)), '4.8 bank 2.5 draws monthly lines and names only the products that have them (step 67: the products the other answers propose count too)', approach);
  q = await one(h, IN4['C4.8'][0].input);
  // step 85: Adobe Commerce has services of its own, so the upgrade question has a real line behind it (CE07) and is no longer No match
  const upg = q.draft && q.draft.sections.find(s => s[0] === 'After launch');
  ok(q.draft && prods(q).join() === 'commerce' && q.draft.conn === null && lines(q).join() === 'CE07' && q.draft.lines[0].name === 'Monthly maintenance and upgrades' && q.draft.lines[0].unit === 'monthly'
    && q.draft.sections.length === 2 && upg && upg[1].length === 1 && /^Each month we will apply the patches you need with the Quality Patches Tool .* plan and test the next Adobe Commerce upgrade with the Upgrade Compatibility Tool/.test(upg[1][0])
    && q.draft.sources.some(s => /implementation-playbook\/best-practices\/maintenance\/overview$/.test(s.url)) && !q.draft.capability && !q.draft.kb,
    '4.8 a Magento upgrade question is answered from Adobe Commerce alone with its own line, Monthly maintenance and upgrades (CE07, step 85), its upgrade sentence and its source, not one empty sentence', JSON.stringify(q.draft));
  for (const x of IN4['C4.9']) { q = await one(h, x.input); ok(q.kind !== 'adobe' || (q.draft && (q.draft.capability || q.draft.kb) && lines(q).length === 0), '4.9 "' + x.input.slice(0, 55) + '" gets the capability box or a sourced knowledge-base answer (part three), not a build plan', JSON.stringify(q.draft && [q.kind, q.draft.capability, q.draft.kb, lines(q)])); }
  q = await one(h, 'Is Brand Concierge FedRAMP authorized?');   // part three answers hosting and encryption from the knowledge base; a fact it does not hold still gets the box
  await h.select(0);
  const links = await h.eval(() => [...document.querySelectorAll('#rfp-answer .rfp-cap a')].map(a => a.textContent + ' ' + a.href));
  ok(/A capability question, not answered from this catalog/i.test(await h.panel()) && links.some(l => /Adobe Trust Center https:\/\/www\.adobe\.com\/trust\.html/.test(l)) && links.some(l => /experienceleague\.adobe\.com\/en\/docs\/brand-concierge/.test(l)) && await h.eval(() => !!document.getElementById('rfp-firm')), '4.9 the box links the Adobe Trust Center and Brand Concierge\'s own page, with a box for the partner\'s answer', JSON.stringify(links));
  q = await one(h, IN4['C4.10'][1].input);
  ok(!(await h.eval(() => RFPAnswers.ownedProducts().has('eds'))), '4.10 "our new site on EDS" is not ownership of Edge Delivery');
  const det = async t => h.detect(t);
  ok((await det('Describe your approach to implementing ABV for our brand.')).includes('bv') && (await det('How would you set up AEP sandboxes?')).includes('rtcdp') && (await det('How would you configure Adobe Experience Platform sandboxes and roles?')).includes('rtcdp') && (await det('How would LLMO report our AI citations?'))[0] === 'bv', '4.11 ABV, AEP, Adobe Experience Platform and LLMO are known names');
  q = await one(h, IN4['C4.11'][4].input);
  ok(lines(q).includes('AS03'), '4.11 the WordPress and legacy DAM migration question draws the asset migration line (the migration boost)', JSON.stringify([prods(q), lines(q)]));
  ok(await h.classify(IN4['C4.11'][6].input) === 'firm', '4.11 the status-reports question is Your firm ("rebuild" alone no longer means a site)');
  q = await one(h, IN4['C4.12'][0].input);
  ok(['aemsites', 'target', 'cja', 'rtcdp'].every(id => prods(q).includes(id)) && q.draft.lines.length > 4, '4.12 four named products are all kept, with up to six lines', JSON.stringify([prods(q), lines(q)]));
  q = await one(h, 'Explain how Workfront, Brand Concierge and Sites Optimizer work together for our marketing team.');
  await h.select(0);
  ok(/This catalog documents no connection between/.test(await h.panel()) && /Brand Concierge and Sites Optimizer/.test(await h.panel()), '4.12 the pairs the catalog has no connection for are named to the partner', (await h.panel()).slice(0, 300));
  q = await one(h, IN4['C4.13'][0].input);
  const est = q.draft && q.draft.sections.find(s => s[0] === 'Our planning estimate');
  ok(est && /^About [\d,]+ hours of our work for the services above, at a typical size/.test(est[1][0]), '4.13 "How many weeks to implement AEM Sites?" answers with the planning hours behind the drafted lines', JSON.stringify(est));
  ok(/Adobe sources for the product facts above/.test(q.draft.plain), '4.13 the sources are labelled as Adobe sources for the product facts');
  let lost = 0;
  for (const f of ['bank_rfp.xlsx', 'retail_rfi.docx', 'mfg_rfp.pdf']) { r = await h.file(FIX + '/' + f); for (const x of r.questions) if (x.draft && x.draft.lines.length) { const urls = x.draft.sources.map(s => s.url); for (const l of x.draft.lines) { const u = await h.eval(id => RFP_CAT.lines[id].url, l.id); if (u && !urls.includes(u)) lost++; } } }
  ok(lost === 0, '4.14 every drafted line\'s own page is in its sources, across the three made-up RFPs', lost + ' lost');
  // A8 targeting, and "Do you support" inside an RFP that names products
  q = await one(h, IN4.extra[3].input);
  ok(!prods(q).includes('target'), 'A8 "targeting" does not mean Target', JSON.stringify(prods(q)));
  r = await h.text(IN4.extra[2].input);
  q = r.questions.find(x => x.label === '2.7');
  ok(q && q.kind === 'firm' && !q.draft, 'A8 "Do you support single sign-on ...?" in an RFP that names products is a yes/no question for Your firm, with no ongoing-services draft', JSON.stringify(q && [q.kind, prods(q)]));
  // the Drawn from chips: take a product out, add one, and the answer is drafted again
  r = await h.file(FIX + '/bank_rfp.xlsx');
  const i22 = r.questions.findIndex(x => x.label === '2.2');
  await h.select(i22);
  await h.page.click('#rfp-answer .rfp-chip [data-rm="bv"]'); await h.page.waitForTimeout(150);
  r = await h.read(); q = r.questions[i22];
  ok(prods(q).join() === 'cja' && !q.draft.conn, 'taking Brand Visibility out of 2.2 drafts it again from Customer Journey Analytics alone', JSON.stringify([prods(q), q.draft.conn]));
  await h.page.selectOption('#rfp-add', 'target'); await h.page.waitForTimeout(150);
  r = await h.read(); q = r.questions[i22];
  ok(prods(q).join() === 'cja,target' && q.draft.conn === 'target+cja', 'adding Target drafts it from Target + Customer Journey Analytics', JSON.stringify([prods(q), q.draft.conn]));
  ok(await h.eval(() => RFPBuilder.state.questions.find(x => x.label === '2.2').pick.join()) === 'cja,target', 'the products the partner chose are kept on the question');
  ok(h.errors.length === 0, 'no script errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `${fails} STEP 52 CHECK(S) FAILED` : 'ALL STEP 52 CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
