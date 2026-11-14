// RFI Builder step 76 (Nov 11 2026, Adam: "Fix 1-4"): four fixes to the answer writer, found in his download of the
// Washington State RFP read with AI. No AI is called here.
// Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_step76.js
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 600) + ']')); if (!c) fails++; };
const FORMS = ['Request for Proposals 77-A: AEM Forms Implementation for the Division of Child Support', 'The Division is replacing its forms software with AEM Forms. AEM Forms will be hosted by Adobe.',
  'The contractor will implement AEM Forms and convert existing forms to AEM Forms.',
  'Insurance. The Apparent Successful Bidder shall provide evidence of its compliance with the insurance requirements, issued by an insurance company authorized in the State; the insurer shall give notice of cancellation.',
  '3.1 Provide training for Division IT staff on the use of AEM in the above identified areas.',
  '3.2 The contractor must integrate AEM into the case system and replace the legacy forms software.',
  '3.3 Provide training to business users on AEM Sites authoring.',
  '3.4 Provide transfer of knowledge to Division IT staff on the use of AEM.',
  '3.5 Requirements specifications will be documented using Microsoft Office products and/or MS Project and follow industry standards.',
  '3.6 Provide a test plan for user testing of converted templates.',
  '3.7 Describe how you would migrate our content from AEM 6.5 to AEM as a Cloud Service.'].join('\n\n');
const SITES = ['Request for Proposals: website rebuild', 'We run AEM Sites today and want AEM Sites as a Cloud Service.', '1.1 Describe how you would train our authors on AEM.', '1.2 Describe how you would migrate our content from AEM 6.5.', '1.3 Describe your AEM Sites build approach.'].join('\n\n');
const INSURER = ['Request for Proposals: Digital Experience Services', 'Harbor Mutual is an insurer serving 400,000 policyholders. Our underwriting teams review all content.', '1.1 The vendor must implement AEM Sites for our public website.', '1.2 The vendor must implement Adobe Target for personalization.', '1.3 The vendor must set up Adobe Journey Optimizer for email.'].join('\n\n');
(async () => {
  const h = await open();
  const drafts = () => h.eval(() => RFPBuilder.state.questions.map(q => { const d = q.kind === 'adobe' ? (q.draft || RFPAnswers.compose(q)) : null; return {label: q.label, kind: q.kind, products: d ? d.m.products : [], lines: d ? d.m.lines : [], text: d ? RFPAnswers.plain(d, q) : ''}; }));
  // Round 5: verify the consent check without guaranteeing a compliance outcome.
  const CTL = /Test cases will verify proposed data uses against the consent|Your compliance team approves regulated content/;
  const by = (rows, label) => rows.find(r => r.label === label) || {products: [], lines: [], text: ''};

  // 1. a bare 'AEM' follows the RFI
  await h.text(FORMS, 'division_forms_rfp.txt'); let r = await drafts();
  ok(by(r, '3.1').products.join() === 'aemforms' && by(r, '3.1').lines.includes('AF16'), 'in an RFI about AEM Forms, "training on the use of AEM" is answered with AEM Forms training', JSON.stringify(by(r, '3.1')).slice(0, 300));
  ok(by(r, '3.2').products.join() === 'aemforms' && by(r, '3.2').lines.every(l => /^AF/.test(l)), '"integrate AEM" is answered with AEM Forms services, none from AEM Sites', JSON.stringify(by(r, '3.2')).slice(0, 300));
  ok(by(r, '3.3').products.join() === 'aemsites' && by(r, '3.3').lines.includes('SI05'), 'a line that says "AEM Sites" in full is still AEM Sites', JSON.stringify(by(r, '3.3')).slice(0, 300));
  ok((await h.eval(() => RFPAnswers.detect('Provide training on AEM.'))).join() === 'aemforms' || JSON.stringify(await h.eval(() => RFPAnswers.detectAll('Provide training on AEM.').named)) === '["aemforms"]', 'the product read from "AEM" alone is AEM Forms here');
  await h.text(SITES, 'website_rfp.txt'); r = await drafts();
  ok(by(r, '1.1').products.join() === 'aemsites' && by(r, '1.2').lines.includes('SI03'), 'in an RFI about AEM Sites, "AEM" alone is AEM Sites as before, and a real migration still gets the migration service', JSON.stringify([by(r, '1.1').products, by(r, '1.2').lines]));
  await h.eval(() => document.getElementById('rfp-clear') && 0);
  ok(JSON.stringify(await h.eval(() => RFPAnswers.detectAll('Adobe Experience Manager Assets and AEM Guides').named)) === '["aemassets"]', '"AEM Assets" and the products the catalog does not cover are read as before');

  // 2. financial services needs real evidence
  await h.text(FORMS, 'division_forms_rfp.txt'); r = await drafts();
  ok(!r.some(x => CTL.test(x.text)), 'a public agency whose RFI asks the bidder for insurance gets no bank-or-insurer sentence in any answer', (r.find(x => CTL.test(x.text)) || {}).text);
  await h.text(INSURER, 'harbor_mutual_rfp.txt'); r = await drafts();
  ok(r.some(x => CTL.test(x.text)), 'an insurer (policyholders, underwriting) still gets its lines on regulated content and customer data', r.map(x => x.text.slice(0, 200)).join(' || '));
  await h.text(INSURER.replace('Harbor Mutual is an insurer serving 400,000 policyholders. Our underwriting teams review all content.', 'We sell home and auto cover.'), 'Lakeshore_Insurance_RFP.txt'); r = await drafts();
  ok(r.some(x => CTL.test(x.text)), 'so does a client whose file name says Insurance', r.map(x => x.text.slice(0, 160)).join(' || '));
  await h.text(INSURER.replace('Harbor Mutual is an insurer serving 400,000 policyholders. Our underwriting teams review all content.', 'Northbridge is a regional bank.'), 'northbridge_rfp.txt'); r = await drafts();
  ok(r.some(x => CTL.test(x.text)), 'and a bank, as before', r.map(x => x.text.slice(0, 160)).join(' || '));

  // 3. a transfer of knowledge is not a migration
  await h.text(FORMS, 'division_forms_rfp.txt'); r = await drafts();
  ok(!by(r, '3.4').lines.some(l => ['AF11', 'SI03'].includes(l)), '"transfer of knowledge" brings no migration service', by(r, '3.4').lines.join());
  ok(by(r, '3.7').lines[0] === 'AF11', 'a real move from AEM 6.5 still leads with the forms migration service', by(r, '3.7').lines.join());
  const m = await h.eval(() => ['Hold knowledge transfer sessions for our AEM Sites team.', 'Transfer the knowledge needed to run AEM Sites.', 'Transfer our pages into AEM Sites.'].map(t => RFPAnswers.match(t, {}).lines));
  ok(!m[0].includes('SI03') && !m[1].includes('SI03') && m[2].includes('SI03'), '"knowledge transfer sessions" and "transfer the knowledge" are not migrations; "transfer our pages" is', JSON.stringify(m));

  // 4. the office tools a line names are not Adobe services
  const loose = await h.eval(() => ['Requirements specifications will be documented using Microsoft Office products and/or MS Project and follow industry standards.', 'Provide a test plan for user testing of converted templates.', 'Submit a project plan within 30 days.'].map(t => { const d = RFPAnswers.compose({text: t, kind: 'adobe', label: ''}); return d ? d.m.lines : []; }));
  ok(!loose[0].length, 'a line about writing specifications in Microsoft Office and MS Project gets no Adobe service, even in the Adobe products pile', loose[0].join());
  ok(!loose[1].length && !loose[2].length, 'nor does "a test plan for user testing" or "a project plan" (one common word of a service name is not enough)', JSON.stringify(loose.slice(1)));
  ok(by(r, '3.1').lines.length > 0 && by(r, '3.7').lines.length > 0, 'the lines that do ask for a service are still answered');

  ok(!h.errors.length, 'no script errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `\n${fails} STEP 76 CHECKS FAILED` : `\nALL STEP 76 CHECKS PASSED (${n})`); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
