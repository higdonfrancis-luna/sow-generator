// Step 50 (Nov 10 2026): the finder reads requirements. Run from the repo root after python3 sow/rfp_prototype/build.py:
//   node sow/test_rfp_step50.js
// Drives the built prototype through the review harness with the reviewers' own inputs (verification/c1_finder/inputs.json)
// and checks: requirement statements, coded IDs, Mandatory and Desirable tags, sub-questions with their stem, lots and
// sections, the anchored instruction filter, notices, request openers, the caps, the Not picked up list with Make this a
// question, the firm's part of a two-part question, requirement answers that start "We would meet this by", and ownership
// read from every paragraph.
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
const IN = require(__dirname + '/rfp_prototype/review_2026-11-09/verification/c1_finder/inputs.json');
const FIX = __dirname + '/qa/rfp_fixtures';
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 400) + ']')); if (!c) fails++; };
const inp = (k, i) => IN[k][i].text;
const brief = r => JSON.stringify(r.questions.map(q => [q.label, q.priority, q.requirement ? 'REQ' : '', q.kind, q.text.slice(0, 40)]));
(async () => {
  const h = await open();
  let r;
  // 1.1 requirements written as statements
  r = await h.text(inp('C1.1', 10));
  ok(r.count === 10 && r.questions.every(q => q.requirement), '1.1 all ten statement forms are found, each marked as a requirement', brief(r));
  ok(r.questions.map(q => q.label).join(',') === '3.1,3.2,3.3,3.4,3.5,3.6,REQ-101,3.2.4,4.1,R1', '1.1 the client\'s own numbers and coded IDs are the labels (REQ-101, 3.2.4, R1)', r.questions.map(q => q.label).join(','));
  r = await h.text('3.1 The solution shall support multi-site management with shared components across 12 regional brands.');
  ok(/1 requirement found/.test(r.status), 'the status line counts requirements when every item is one', r.status);
  // 1.2 mandatory and desirable tags
  r = await h.text(inp('C1.2', 8));
  ok(r.count === 8, '1.2 all eight tagged items are found (none deleted by its tag)', brief(r));
  ok(r.questions.map(q => q.priority[0] || '-').join('') === 'mmmdmmmd', '1.2 each tag becomes a Mandatory or Desirable field', r.questions.map(q => q.priority).join(','));
  ok(r.questions.every(q => !/\(M\)|\[M(andatory)?\]|MANDATORY:|Desirable -|\(Mandatory\)|\(Desirable\)/.test(q.text)), '1.2 the tags are taken out of the question text', JSON.stringify(r.questions.map(q => q.text)));
  ok(r.questions[4].label === '2.5' && r.questions[6].label === 'M1' && r.questions[7].label === 'D1', '1.2 "[M] 2.5", "M1 (Mandatory)" and "D1 (Desirable)" keep their labels', r.questions.map(q => q.label).join(','));
  ok(/6 mandatory, 2 desirable/.test(r.status), 'the status line counts mandatory and desirable items', r.status);
  // 1.3 sub-questions
  r = await h.text(inp('C1.3', 0));
  ok(r.count === 3 && r.questions.map(q => q.label).join(',') === '12 a,12 b,12 c', '1.3 a), b), c) under item 12 are labelled 12 a, 12 b, 12 c', brief(r));
  ok(r.questions.every(q => /Journey Optimizer and Real-Time CDP/.test(q.context)), '1.3 each sub-question carries its stem as context', JSON.stringify(r.questions.map(q => q.context)));
  ok(r.questions[0].draft && r.questions[0].draft.products.some(p => p.id === 'ajo') && r.questions[1].draft && r.questions[1].draft.lines.some(l => l.id === 'JO03'), '1.3 a) is drafted from the stem\'s products and b) finds the IP warmup line', JSON.stringify(r.questions.map(q => q.draft && [q.draft.products.map(p => p.id), q.draft.lines.map(l => l.id)])));
  r = await h.text(inp('C1.3', 3));
  ok(r.count === 1 && r.questions[0].label === '4.1', '1.3 an inline "a) ...; b) ...; c)" stays one item', brief(r));
  r = await h.text(inp('C1.3', 4));
  ok(r.count === 1 && /^Describe how you would: migrate content to AEM Sites; connect AEM Sites to Target; train our authors\.$/.test(r.questions[0].text), '1.3 roman items without a verb join their colon stem as one question', r.questions.map(q => q.text).join(' | '));
  r = await h.text(inp('C1.3', 5));
  ok(r.count === 3 && r.questions.map(q => q.label).join(',') === '5 i,5 ii,5 iii', '1.3 roman items with a verb become 5 i, 5 ii, 5 iii, and the bare stem is not a question of its own', brief(r));
  r = await h.text(IN.X6[0].text);
  ok(r.count === 1 && /migrate content to AEM Sites; connect AEM Sites to Target/.test(r.questions[0].text), 'A8 bullets under a stem ending in a colon join the stem', brief(r));
  // 1.4 lots
  r = await h.text(IN['C1.4'][0].text);
  ok(r.count === 4 && r.questions.map(q => q.label).join(',') === '1.1,1.2,2.1,2.2', '1.4 both lots give two questions each, and 2.1 is not lost to the duplicate check', brief(r));
  ok(/^Lot 1: Adobe Experience Manager Sites$/.test(r.questions[0].section) && /^Lot 2: Customer Journey Analytics$/.test(r.questions[3].section) && r.questions.every(q => !/Lot \d/.test(q.text)), '1.4 lot headings become each question\'s section, not glue on the question before', JSON.stringify(r.questions.map(q => [q.section, q.text])));
  // 1.5 the instruction filter
  r = await h.text([0, 1, 2, 3].map(i => inp('C1.5', i)).join('\n\n'));
  ok(r.count === 3 && r.skipped === 1, '1.5 "Submit a migration plan", "answer all of our members\' questions" and "deadline" questions are kept; the plain statement is set aside', brief(r) + ' skipped ' + r.skipped);
  // 1.6 caps, labels, notices, languages, appendix
  r = await h.text(Array.from({length: 350}, (_, i) => (i + 1) + '. Describe requirement ' + (i + 1) + '.').join('\n'));
  ok(r.count === 350, '1.6 350 numbered items are all read', r.count);
  r = await h.text(Array.from({length: 1005}, (_, i) => (i + 1) + '. Describe requirement ' + (i + 1) + '.').join('\n'));
  ok(r.count === 1000 && r.skipped === 5 && /5 paragraphs were not picked up/.test(r.status), '1.6 past 1,000 items the rest are listed as not picked up, and the status says so', r.count + ' ' + r.skipped + ' ' + r.status.slice(-120));
  r = await h.text(inp('C1.6b', 0));
  ok(r.count === 1 && r.questions[0].text.length > 1100, '1.6 a 1,194-character question is read', r.count);
  r = await h.text(inp('C1.6c', 3));
  ok(r.questions.map(q => q.label).join(',') === 'REQ-001,FR-3.2,Item 15', '1.6 REQ-001, FR-3.2 and Item 15 are labels', brief(r));
  r = await h.text(inp('C1.6d', 0) + '\n\n' + IN.X5[0].text);
  ok(r.count === 0 && r.skipped === 2, '1.6 "Please note ..." and "Questions? Contact ..." are notices, not questions', brief(r));
  r = await h.text(IN['C1.6e'].map(x => x.text).join('\n\n'));
  const why = await h.eval(() => RFPBuilder.state.skipped.map(s => s.reason));
  ok(r.count === 0 && why.length === 3 && why.every(w => /Not in English/.test(w)), '1.6 French, Spanish and Portuguese questions are set aside with a reason that says only English is read', JSON.stringify(why));
  r = await h.text(inp('C1.6f', 0));
  ok(r.count === 3 && r.questions.map(q => q.label).join(',') === 'S1,S2,S3' && r.questions.every(q => /Appendix C: Security Questionnaire/.test(q.section)), '1.6 the security appendix gives S1, S2, S3 under its heading', brief(r));
  // 1.7 two-part questions
  r = await h.text(inp('C1.7', 0) + '\n\n' + inp('C1.7', 1) + '\n\n' + inp('C1.7', 2));
  ok(r.questions[0].kind === 'adobe' && r.questions[0].firmPart === 'the team you would assign', '1.7 "... AEM Sites and the team you would assign" keeps the Adobe draft and names the firm\'s part', JSON.stringify(r.questions[0]).slice(0, 200));
  ok(r.questions[1].kind === 'adobe' && r.questions[1].firmPart === 'a timeline and staffing plan', '1.7 "including a timeline and staffing plan" is the firm\'s part', r.questions[1].firmPart);
  ok(r.questions[2].kind === 'firm', '1.7 "Describe your experience implementing ... for banks" is a firm question', r.questions[2].kind);
  await h.select(0);
  ok(/Your part to write/.test(await h.panel()) && /the team you would assign/.test(await h.panel()), '1.7 the answer panel shows "Your part to write" for the firm\'s part');
  // A8 shapes
  r = await h.text(IN.X1[0].text);
  ok(r.count === 4, 'A8 unnumbered questions on their own lines stay separate', brief(r));
  r = await h.text(IN.X2[0].text);
  ok(r.count === 6, 'A8 "Briefly describe", "Respondents must describe", "Bidders are asked to explain", "In no more than 300 words", "Kindly outline", "The vendor should describe" are all read', brief(r));
  r = await h.text(IN.X3[0].text);
  ok(r.questions.map(q => q.label).join(',') === 'A,B', 'A8 upper-case (A) and (B) items are read, labelled A and B', brief(r));
  r = await h.text(IN.X4[0].text);
  ok(r.count === 3 && r.questions.map(q => q.label).join(',') === 'a,b,a', 'A8 both brackets come off lettered labels', brief(r));
  r = await h.text(IN.X7[0].text);
  ok(r.count === 3, 'A8 "1. Why us?" and "2. Why AEM?" are read', brief(r));
  r = await h.text(IN.X8[0].text);
  ok(r.count === 1 && /authors would be trained\.$/.test(r.questions[0].text), 'A8 a question wrapped onto a second line starting "Include" stays one question', brief(r));
  // requirements are answered "We would meet this by"
  r = await h.text('3.2.4 Vendor shall configure role-based access control and development and production sandboxes in Adobe Experience Platform.');
  const sec = r.questions[0].draft && r.questions[0].draft.sections[0];
  ok(sec && sec[0] === 'Our approach' && /^We would meet this by using Real-Time CDP\./.test(sec[1][0]), 'a requirement\'s drafted answer starts "We would meet this by"', JSON.stringify(sec));
  await h.select(0);
  ok(/Requirement, not a question: the answer starts "We would meet this by"/.test(await h.eval(() => document.getElementById('rfp-questions').textContent)), 'the requirement\'s row says so under its text');
  // the M/D badge on the row
  r = await h.text(inp('C1.2', 8));
  const badges = await h.eval(() => [...document.querySelectorAll('#rfp-questions .rfp-pri')].map(b => b.textContent + ':' + b.className));
  ok(badges.length === 8 && badges[0] === 'Mandatory:rfp-pri mandatory' && badges[3] === 'Desirable:rfp-pri desirable', 'each tagged row shows a Mandatory or Desirable badge', JSON.stringify(badges));
  // Not picked up, and Make this a question
  const statement = 'The bidder shall provide a certified AEM project manager and three public-sector references.';
  r = await h.text('1.1 Describe your approach to implementing AEM Sites.\n\n' + statement);
  ok(r.count === 1 && r.skipped === 1 && /1 paragraph was not picked up: see Not picked up/.test(r.status), 'an unnumbered statement is set aside, and the status line says one paragraph was not picked up', r.status);
  await h.page.click('[data-rfp-filter="notpicked"]'); await h.page.waitForTimeout(100);
  const npLabel = await h.page.textContent('[data-rfp-filter="notpicked"]');
  const npRows = await h.eval(() => [...document.querySelectorAll('#rfp-questions li.rfp-skip')].map(li => li.textContent));
  ok(npLabel === 'Not picked up (1)' && npRows.length === 1 && npRows[0].includes(statement) && /No question or requirement found/.test(npRows[0]) && /Make this a question/.test(npRows[0]), 'the Not picked up filter lists the paragraph with its reason and a Make this a question button', npLabel + ' ' + JSON.stringify(npRows));
  await h.page.click('#rfp-questions .rfp-make'); await h.page.waitForTimeout(150);
  r = await h.read();
  ok(r.count === 2 && r.skipped === 0 && r.questions[1].text === statement && r.questions[1].kind === 'firm', 'Make this a question adds it to the list in its place and sorts it (a certified project manager and references: Your firm)', brief(r));
  ok(await h.eval(() => RFPBuilder.state.filter) === 'all' && /Nothing was skipped/.test(r.status), 'with nothing left to pick up the list goes back to All and the status says nothing was skipped', r.status);
  // 4.10 ownership from any paragraph
  r = await h.text('Background. The bank licensed Brand Visibility in 2026 and uses it today.\n2.2 How would you connect our Customer Journey Analytics data to AI assistant traffic?');
  ok((await h.eval(() => [...RFPAnswers.ownedProducts()].sort().join(','))) === 'bv,cja', '4.10 a background line that is not a question still says the bank owns Brand Visibility', await h.eval(() => [...RFPAnswers.ownedProducts()].join(',')));
  r = await h.text('How would you build our new site on EDS?');
  ok(!(await h.eval(() => RFPAnswers.ownedProducts().has('eds'))), '4.10 "our new site on EDS" does not mark Edge Delivery as owned (a topic word never does)');
  // the regression set still reads the same
  for (const [f, n] of [['bank_rfp.txt', 12], ['retail_rfi.docx', 8], ['mfg_rfp.pdf', 10], ['bank_rfp.xlsx', 14]]) {
    r = await h.file(FIX + '/' + f);
    ok(r.count === n, `${f}: still ${n} questions`, r.status);
  }
  ok(h.errors.length === 0, 'no script errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `${fails} STEP 50 CHECK(S) FAILED` : 'ALL STEP 50 CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
