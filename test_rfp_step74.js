// RFI Builder step 74 (Nov 11 2026, Adam on a 1,200-word row from a government RFP: "This one answer is so long and then I
// don't even see the question"; "build both"): a long numbered run is split into its requirements with no AI, and any line
// that is still long is shown short with Show all, in the list and above its answer.
// Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_step74.js
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
const {tableIn} = require('./rfp_prototype/chatgpt_round5/test_word_complete.js');
const FIX = __dirname + '/qa/rfp_fixtures';
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 600) + ']')); if (!c) fails++; };
const pad = (s, k) => Array.from({length: k}, (_, i) => s + ' ' + (i + 1)).join('; ');
// one paragraph, as a PDF gives it when a numbered list loses its line breaks
const RUN = '3. Scope of work for the AEM Forms implementation. (1) Prepare and submit bi-weekly project status reports. The reports include: Accomplishments; Critical issues; and Personnel utilized; ' +
  'Design/Setup activities (1) Work with agency staff to develop and document the forms architecture; (2) Determine pagination requirements for each template; (3) Support the customer in setting up SQL storage for forms archival; ' +
  'Develop/Integration activities (1) Create a form data model for the data source; (2) Create up to fifteen (15) XDP templates in AEM Forms Designer for the Print Channel; (3) Convert all existing forms (approximately 300) to adaptive forms; ' +
  '(4) Bidder staff must have at least three (3) years of experience with ' + pad('form conversion task', 30) + '.';
const LONG_PLAIN = '4. Describe how you would migrate our forms to AEM Forms, covering ' + pad('the conversion of form family', 40) + '.';
const formsRfp = 'Request for Proposals: AEM Forms Implementation\n\nThe Division is replacing its forms software with AEM Forms.\n\nAEM Forms will be hosted by Adobe.\n\n' + RUN + '\n\n' + LONG_PLAIN + '\n\n5. Describe your approach to training our staff on AEM Forms.';

function hasExpectedRunPiles(questions) {
  const parts = questions.filter(q => /^3 \(\d+\)$/.test(q.label));
  return parts.length === 8 && parts[0].kind === 'firm' && parts.slice(1).every(q => q.kind === 'adobe');
}

module.exports = {formsRfp, hasExpectedRunPiles};

if (require.main === module) (async () => {
  const h = await open(), p = h.page;
  const r = await h.text(formsRfp);
  const Q = r.questions, by = l => Q.filter(q => q.label === l);

  // 1. the run is split at its own numbering
  ok(!Q.some(q => q.label === '3' && q.text.length > 400) && Q.filter(q => /^3 \(\d+\)$/.test(q.label)).length === 8, 'a long paragraph that carries its own numbering becomes one line per number (eight here)', Q.map(q => q.label).join(','));
  ok(by('3').length === 1 && by('3')[0].text === 'Scope of work for the AEM Forms implementation.', 'the words before the first number stay a line of their own', by('3').map(q => q.text).join('|'));
  ok(by('3 (1)').map(q => q.text.slice(0, 60)).join(' | ') === 'Prepare and submit bi-weekly project status reports. The rep | Design/Setup activities: Work with agency staff to develop a | Develop/Integration activities: Create a form data model for', 'a short heading just before a "(1)" leads the lines under it, and leaves the line before it', by('3 (1)').map(q => q.text.slice(0, 60)).join(' | '));
  ok(/Personnel utilized$/.test(by('3 (1)')[0].text) && !/Design\/Setup/.test(by('3 (1)')[0].text), 'that heading is taken off the end of the line before', by('3 (1)')[0].text.slice(-60));
  ok(by('3 (2)').some(q => q.text === 'Develop/Integration activities: Create up to fifteen (15) XDP templates in AEM Forms Designer for the Print Channel') && /at least three \(3\) years of experience/.test(by('3 (4)')[0].text), '"fifteen (15)" and "three (3) years" are numbers said twice, not new lines', by('3 (2)').map(q => q.text).join(' | '));
  ok(hasExpectedRunPiles(Q),
    'the status-report part is Your firm and the other seven parts are Adobe products', Q.filter(q => /^3 \(/.test(q.label)).map(q => q.label + ':' + q.kind).join(','));
  ok(await h.eval(() => RFPBuilder.state.questions.map(q => q.order).every((o, i, a) => i === 0 || o > a[i - 1])), 'the lines keep the document\'s order');
  const dm = Q.find(q => /Create a form data model/.test(q.text));
  ok(dm && dm.draft && dm.draft.lines.some(l => /^AF/.test(l.id)), 'a split line is drafted like any other (the form data model line draws an AEM Forms service)', JSON.stringify(dm && dm.draft && dm.draft.lines.map(l => l.id)));

  // 2. a long line with no numbering stays one line, shown short
  ok(by('4').length === 1 && by('4')[0].text.split(/\s+/).length > 150, 'a long line with no numbering of its own is not split');
  const row = l => p.$eval(`#rfp-questions li[data-i="${Q.findIndex(q => q.label === l)}"] .rfp-q`, e => e.innerText.replace(/\s+/g, ' '));
  const total = by('4')[0].text.split(/\s+/).length;
  ok(new RegExp('covering the conversion of form family 1; .{0,400}… Show all ' + total + ' words').test(await row('4')) && (await row('4')).split(' ').length < 80, 'in the list it shows its first words, then Show all with the count', (await row('4')).slice(0, 200));
  ok(await p.textContent(`#rfp-questions li[data-i="${Q.findIndex(q => q.label === '4')}"] .rfp-why`) === 'This line is very long: it may hold several requirements.', 'the note for an unsplit long line uses the approved wording');
  ok(!/Show all/.test(await row('5')) && !/Show all/.test(await row('3 (2)')), 'a line of ordinary length is shown whole');
  await h.select(Q.findIndex(q => q.label === '4'));
  const head = () => p.$eval('#rfp-answer h3', e => e.innerText.replace(/\s+/g, ' '));
  ok(/… Show all \d+ words$/.test(await head()) && (await head()).split(' ').length < 60, 'above its answer the line is short too, so the answer is in view', (await head()).slice(-80));
  ok(await p.evaluate(() => { const a = document.querySelector('#rfp-answer h3').getBoundingClientRect(); return a.height < 160; }), 'the heading is a few lines tall, not a screen');
  await p.click('#rfp-answer h3 .rfp-more'); await p.waitForTimeout(150);
  ok(/form family 40\. Show less$/.test(await head()) && /form family 40\. Show less/.test(await row('4')), 'Show all opens the whole line, above the answer and in the list, with Show less', (await head()).slice(-60));
  await p.click(`#rfp-questions li[data-i="${Q.findIndex(q => q.label === '4')}"] .rfp-more`); await p.waitForTimeout(150);
  ok(/… Show all \d+ words$/.test(await head()) && /Show all/.test(await row('4')), 'Show less closes it again, from the list as well');
  ok(await h.eval(() => RFPBuilder.state.questions.find(q => q.label === '4').text.split(/\s+/).length) === total && tableIn(await h.word(), 'Requirements matrix', 'Ref').find(r => r.Ref === '4').Requirement === by('4')[0].text, 'only the display is short: the line itself, and the download, keep every word');

  // 3. the files the other suites read are found as before
  const counts = [];
  for (const f of ['bank_rfp.xlsx', 'mfg_rfp.pdf', 'retail_rfi.docx', 'bank_rfp.txt']) counts.push((await h.file(FIX + '/' + f)).count);
  ok(counts.join() === '14,' + counts.slice(1).join() && counts.every(c => c > 0), 'the test RFIs are read as before (the bank workbook still has 14 questions)', counts.join());
  ok(!h.errors.length, 'no page errors', h.errors.join(' | '));
  console.log(fails ? `\n${fails} OF ${n} STEP 74 CHECKS FAILED` : `\nALL STEP 74 CHECKS PASSED (${n})`);
  await h.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
