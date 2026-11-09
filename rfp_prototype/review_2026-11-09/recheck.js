// Integration recheck for steps 50 to 52 (Nov 10 2026): replays the headline inputs from the three outside reviews against
// the built prototype and says, for each, whether the fix landed. Run from anywhere after python3 sow/rfp_prototype/build.py:
//   node sow/rfp_prototype/review_2026-11-09/recheck.js
// It is coarser than the three step test files; it is the cross-step check after the merge.
const {open} = require(__dirname + '/harness.js');
const path = require('path');
const FIX = path.resolve(__dirname, '..', '..', 'qa', 'rfp_fixtures'), VFX = path.resolve(__dirname, 'verification', 'c2_readers', 'fixtures');
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 300) + ']')); if (!c) fails++; };
const prods = q => (q.draft ? q.draft.products.map(p => p.id) : []);
const lines = q => (q.draft ? q.draft.lines.map(l => l.id) : []);
(async () => {
  const h = await open();
  let r, q;
  // finder (step 50)
  r = await h.text('3.1 The solution shall support multi-site management with shared components across 12 regional brands.');
  ok(r.count === 1 && r.questions[0].label === '3.1' && r.questions[0].requirement, '1.1 a numbered statement is a requirement', JSON.stringify(r.questions[0] || r.status));
  r = await h.text('REQ-101: The proposed CDP must ingest batch data from Snowflake and streaming events from Web SDK.');
  ok(r.count === 1 && /^REQ-101$/.test(r.questions[0].label), '1.1 a coded id is the label', JSON.stringify(r.questions[0] || r.status));
  r = await h.text('2.1 (M) Describe your approach to implementing AEM Sites.\n2.2 [Mandatory] Describe your migration approach.\n2.4 Desirable - Describe your training program.\nM1 (Mandatory) The solution must support SSO.');
  ok(r.count === 4 && r.questions[0].priority === 'mandatory' && !/\(M\)/.test(r.questions[0].text) && r.questions[2].priority === 'desirable' && r.questions[3].priority === 'mandatory', '1.2 mandatory and desirable tags become a field', JSON.stringify(r.questions.map(x => [x.label, x.priority, x.text.slice(0, 30)])));
  r = await h.text('12. We are implementing Adobe Journey Optimizer and Real-Time CDP.\na) Describe how you will configure sandboxes, roles, and sending subdomains.\nb) How will you execute the IP warmup plan?\nc) Explain how audiences and profile attributes flow into journeys.');
  ok(r.count === 3 && /Journey Optimizer/.test(r.questions[0].context) && /^12 ?a$/i.test(r.questions[0].label), '1.3 sub-questions keep their stem and a combined label', JSON.stringify(r.questions.map(x => [x.label, x.context.slice(0, 40)])));
  ok(r.count === 3 && prods(r.questions[0]).length > 0 && lines(r.questions[1]).includes('JO03'), '1.3 the stem gives a) its products and b) finds the IP warmup line', JSON.stringify(r.questions.map(x => [prods(x), lines(x)])));
  r = await h.text('Lot 1: Adobe Experience Manager Sites\n1.1 Describe your implementation approach.\n1.2 Describe your approach to ongoing support.\nLot 2: Customer Journey Analytics\n2.1 Describe your implementation approach.\n2.2 Describe your approach to ongoing support.');
  ok(r.count === 4 && !/Lot 2/.test(r.questions[1].text) && /Lot 1/.test(r.questions[0].section) && prods(r.questions[0]).includes('aemsites') && /Lot 2/.test(r.questions[2].section) && prods(r.questions[2]).includes('cja'), '1.4 lot headings are sections, not glue, and 2.1 survives', JSON.stringify(r.questions.map(x => [x.label, x.section, prods(x)])));
  r = await h.text('Submit a migration plan for moving our 40 regional sites to AEM Sites.\n\nDescribe how Brand Concierge would answer all of our members\' questions about rates and fees.\n\nDescribe how Workfront alerts campaign owners when a deadline is at risk.');
  ok(r.count === 3, '1.5 the instruction filter no longer deletes real questions', r.count + ' found: ' + r.status);
  r = await h.text(Array.from({length: 350}, (_, i) => (i + 1) + '. Describe requirement ' + (i + 1) + (i >= 345 ? ' for Brand Visibility.' : '.')).join('\n'));
  ok(r.count === 350 || /not read/.test(r.status), '1.6 350 items are all read, or the status says what was not', r.count + ' ' + r.status.slice(0, 120));
  r = await h.text('Do you support SSO?\nDo you encrypt data at rest?\nWhat is your uptime SLA?\nDescribe your approach to AEM Sites.');
  ok(r.count === 4, 'A8 unnumbered questions on their own lines stay separate', r.count + ' found');
  r = await h.text('Briefly describe your approach to AEM Sites.\n\nRespondents must describe their migration approach.\n\nIn no more than 300 words, outline your training plan.');
  ok(r.count === 3, 'A8 request openers are recognised', r.count + ' found');
  r = await h.text('Please note that all responses become the property of Northbridge Mutual Bank.\n\nQuestions? Contact the procurement office at rfp@northbridge.example before 3 May.');
  ok(r.count === 0, '1.6 notices are not questions', r.count + ' found');
  r = await h.text('Describe your approach to migrating our forty regional sites to AEM Sites on Edge Delivery Services.\nInclude how you would keep search rankings during the move and how authors would be trained.');
  ok(r.count === 1, 'A8 a two-line question stays one question', r.count + ' found');
  // piles (step 52)
  for (const [t, exp] of [['How would Brand Concierge answer questions from our insurance policyholders?', 'adobe'], ['How does Customer Journey Analytics report campaign costs against conversions?', 'adobe'], ['How can our marketing team use Adobe Coworker to draft journeys and check anomalies?', 'adobe'], ['Provide three references from financial services clients.', 'firm'], ['Describe your project team and their Adobe certifications.', 'firm'], ['Provide a certified AEM project manager.', 'firm'], ['Do you use generative AI tools such as ChatGPT in delivering services? If so, how do you protect our data?', 'firm'], ['Describe your experience implementing Adobe Experience Manager Sites for banks.', 'firm']]) {
    ok((await h.classify(t)) === exp, '3.x pile: ' + t.slice(0, 70) + ' -> ' + exp, await h.classify(t));
  }
  r = await h.text('Who leads the project day to day?');
  ok(r.count === 1 && r.questions[0].kind === 'unsure' && !r.questions[0].draft, '3.3 a To sort row is not drafted', JSON.stringify([r.questions[0] && r.questions[0].kind, prods(r.questions[0] || {})]));
  // matcher (step 52)
  r = await h.text('What is the target go-live date for the new site?'); q = r.questions[0];
  ok(!q || !q.draft || !prods(q).includes('target'), '4.1 a go-live date question is not answered as Target', JSON.stringify(q && [q.kind, prods(q)]));
  r = await h.text('Describe your approach to implementing Adobe Analytics.'); q = r.questions[0];
  ok(q && (!q.draft || (lines(q).join() === 'CJ03')), '4.3 Adobe Analytics draws only the upgrade line', JSON.stringify(q && [prods(q), lines(q)]));
  r = await h.text('Describe how you would use AEM Forms for digital account opening.'); q = r.questions[0];
  ok(q && (!q.draft || q.draft.uncovered), '4.4 AEM Forms is named as not covered, not answered as AEM Sites', JSON.stringify(q && [prods(q), lines(q), q.draft && q.draft.uncovered]));
  r = await h.text('We will not use Adobe Target. Describe the alternatives you recommend.'); q = r.questions[0];
  ok(q && !prods(q).includes('target'), '4.5 a negated product is dropped', JSON.stringify(q && prods(q)));
  r = await h.text('Our product images live in AEM Assets. How do approved images reach Commerce product pages?'); q = r.questions[0];
  ok(q && q.draft && q.draft.conn === 'commerce+aemassets', '4.6 retail Q3 gets Commerce + AEM Assets', JSON.stringify(q && q.draft && q.draft.conn));
  r = await h.file(path.join(FIX, 'bank_rfp.xlsx')); q = r.questions.find(x => x.label === '2.2');
  ok(q && q.draft && q.draft.conn === 'bv+cja' && !lines(q).includes('CJ03') && lines(q).includes('C01'), '4.7 bank 2.2 keeps C01 and drops the Adobe Analytics upgrade line', JSON.stringify(q && [q.draft && q.draft.conn, lines(q)]));
  q = r.questions.find(x => x.label === '2.7');
  ok(q && q.draft && !lines(q).includes('MK05') && !lines(q).includes('A03'), '4.7 bank 2.7 drops the instance setup and go-live lines', JSON.stringify(q && lines(q)));
  ok(r.count === 14 && r.questions.filter(x => x.kind === 'adobe').length === 8, 'the bank workbook still gives 14 questions, 8 Adobe', r.status);
  r = await h.text('Our current platform is Magento Open Source 2.4. Describe your approach to upgrading it.'); q = r.questions[0];
  ok(q && (!q.draft || lines(q).length > 0), '4.8 no one-sentence draft without lines', JSON.stringify(q && [prods(q), lines(q)]));
  r = await h.text('Where is Brand Concierge data hosted, and is it encrypted at rest?'); q = r.questions[0];
  ok(q && (q.kind !== 'adobe' || !q.draft || q.draft.capability), '4.9 a hosting question gets the capability box, not a build plan', JSON.stringify(q && [q.kind, q.draft && q.draft.capability, lines(q)]));
  r = await h.text('How would you build high-value audiences for targeting from our Customer Journey Analytics data?'); q = r.questions[0];
  ok(q && !prods(q).includes('target'), 'A8 targeting does not mean Target', JSON.stringify(q && prods(q)));
  r = await h.text('Explain how AEM Sites, Target, Customer Journey Analytics and Real-Time CDP work together for a single customer view.'); q = r.questions[0];
  ok(q && prods(q).includes('rtcdp') && prods(q).length === 4, '4.12 four named products are all kept', JSON.stringify(q && prods(q)));
  r = await h.text('Background. The bank licensed Brand Visibility in 2026 and uses it today.\n2.2 How would you connect our Customer Journey Analytics data to AI assistant traffic?'); q = r.questions.find(x => x.label === '2.2');
  ok(q && q.draft && !q.draft.sells.some(s => /Brand Visibility offering/.test(s)), '4.10 ownership is read from a background line', JSON.stringify(q && q.draft && q.draft.sells));
  // readers (step 51)
  r = await h.file(path.join(VFX, 'requirements.xlsx'));
  ok(r.count === 8 && r.questions[0].label === 'FR-01' && r.questions.some(x => x.priority === 'mandatory') && r.questions.some(x => x.label === 'SEC-02'), '2.1 the compliance matrix gives one row per requirement with its id and priority', JSON.stringify(r.questions.map(x => [x.label, x.priority, x.kind])) + ' ' + r.status.slice(0, 120));
  r = await h.file(path.join(VFX, 'table.docx'));
  ok(r.count === 3 && r.questions.map(x => x.label).join() === '4.1,4.2,4.3', '2.3 a Word table keeps its numbers and its statement row', JSON.stringify(r.questions.map(x => [x.label, x.text.slice(0, 30)])));
  r = await h.file(path.join(VFX, 'split.pdf'));
  q = r.questions.find(x => x.label === '3.4');
  ok(q && /involved\?$/.test(q.text) && !r.questions.some(x => /Northbridge Mutual Bank RFP/.test(x.text)), '2.5 a question split across a page break is whole and the running header is gone', JSON.stringify(r.questions.map(x => [x.label, x.text.slice(-40)])));
  r = await h.file(path.join(VFX, 'two_columns.pdf'));
  ok(r.questions.map(x => x.label).sort().join() === '3.1,3.2,3.3,3.4', 'A8 two columns are read column by column', JSON.stringify(r.questions.map(x => [x.label, x.text.slice(0, 40)])));
  r = await h.file(path.join(VFX, 'scan.pdf'));
  ok(/no text layer/i.test(r.status), '2.5 a scanned PDF says so', r.status);
  r = await h.file(path.join(VFX, 'multiline.csv'));
  ok(r.count === 2 && r.questions[0].label === 'R-1', '2.4 a CSV with coded ids and a multi-line cell gives two rows', JSON.stringify(r.questions.map(x => [x.label, x.text.slice(0, 40)])));
  ok(h.errors.length === 0, 'no script errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `${fails} RECHECK(S) FAILED` : 'ALL RECHECKS PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
