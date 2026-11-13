// Round 4: a tight method answer keeps the requested proof and outputs before boilerplate.
// These checks exercise the page's written() with new wording and the two permitted authored RFIs.
// Actual AI answers retain their existing fit behavior. No AI call is made and no holdout is opened.
const path = require('path');
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
let n = 0, fails = 0;
const ok = (condition, message, detail = '') => {
  n++; if (!condition) fails++;
  console.log((condition ? '✅ ' : '❌ ') + message + (condition || !detail ? '' : '  ' + detail));
};

const sample = [
  ['Our approach', [
    'You told us: You have a website, a customer relationship platform, a data warehouse, a business intelligence tool, several regional teams and an established content process.',
    'Your retained content and links survive the move with a record your owners can verify.',
    'For further details, Adobe points to its Accessibility Conformance reports for Adobe solutions.'
  ]],
  ['How we would do it', [
    'Inventory the current pages and assign an owner to approve which pages move, merge or retire.',
    'Map each retained content type to its template and prepare the import from that agreed mapping.',
    'Rehearse the migration on a representative sample and reconcile imported content against the source before the full load.',
    'Build the redirect map for every old URL and test each entry against its agreed destination.',
    'After the final load, verify retained content and inbound links against the approved inventory and deliver the reconciliation report.'
  ]],
  ['What you get', [
    'Approved content inventory and mapping',
    'Tested redirect map for every old URL',
    'Rehearsal results and final reconciliation report'
  ]],
  ['Timeline and effort', [
    'Planning estimate: 80 hours.',
    'This runs during the build, once discovery has agreed the scope, ahead of your launch on 12 July 2028.',
    'It sits beside our initial platform setup, estimated in our answer to A.1.',
    'It sits beside our implementation planning, estimated in our answer to A.2.',
    'This needs CJA Select or higher.',
    'This uses Adobe Customer Journey Analytics, which is licensed separately.'
  ]],
  ['Risk we manage', [
    'A lost page or broken link can block a customer journey: the content owner accepts the reconciliation results before the migration is complete.'
  ]]
];
const question = 'Explain how you would migrate pages and prove every old URL and inbound link survives, including a rehearsal and a final reconciliation report.';

(async () => {
  const h = await open();
  try {
    const fit = (sections, limit, model = 'knowledge base', text = question) => h.eval(([sections, limit, model, text]) => {
      const q = {label: 'T.1', text, kind: 'adobe', limit: String(limit)};
      const d = {m: {fromContext: true, products: [], lines: []}, asks: [], sources: [], ai: {model, sections, asks: [], services: [], sources: []}};
      const out = RFPAnswers.written(d, q);
      return {sections: out.sections, text: out.sections.map(([hd, items]) => hd + '\n' + items.map(t => '- ' + t).join('\n')).join('\n\n'), fit: out.fit};
    }, [sections, limit, model, text]);

    const result = await fit(sample, 250);
    ok(result.text.includes('test each entry') && result.text.includes('After the final load, verify') && result.text.includes('Rehearsal results and final reconciliation report'), 'a tight answer retains late verification steps and the requested proof deliverable', result.text);
    ok(!result.text.includes('It sits beside'), 'boilerplate pointers give way before the migration proof', result.text);
    ok(result.text.includes('Planning estimate: 80 hours.') && result.text.includes('This needs CJA Select or higher.') && result.text.includes('licensed separately.'), 'hours, package prerequisites and separate licenses remain verbatim', result.text);
    ok(result.fit.words <= 250 && !result.fit.mandatoryOverflow, 'the written answer including headings and bullet markers meets the section limit', result.fit.words);
    ok(result.text.indexOf('Rehearse the migration') < result.text.indexOf('After the final load'), 'selected method steps retain their delivery order');
    const shorter = await fit(sample, 200);
    ok(!shorter.text.includes('You told us:') && shorter.text.includes('After the final load, verify'), 'under a tighter limit a repeated stack opener gives way before verification', shorter.text);

    const roomy = await fit(sample, 1000);
    ok(JSON.stringify(roomy.sections) === JSON.stringify(sample) && !roomy.fit.tight, 'a roomy answer retains all original method content and pointers');

    const ai = await fit(sample, 250, 'claude-opus-5-5');
    ok(ai.text.includes('You told us:') && !ai.text.includes('After the final load, verify'), 'actual AI answers retain the existing fit behavior rather than taking the new method-only selector', ai.text);

    for (const limit of [120, 180, 250]) {
      const r = await fit(sample, limit);
      ok(r.fit.words <= limit && !r.fit.mandatoryOverflow && r.text.includes('licensed separately.') && r.text.includes('This needs CJA Select or higher.') && r.text.includes('Planning estimate: 80 hours.'), 'a ' + limit + '-word limit preserves mandatory accounting and licensing', r.fit.words);
    }

    const support = [
      ['Our approach', ['We administer the agreed support service and report its results.']],
      ['How we would do it', ['Review failed transfers, restore the interrupted work and verify the recovered records with the system owner.', 'Document routine maintenance and the release checks for the next support team.']],
      ['What you get', ['Recovery record and monthly service report']],
      ['Timeline and effort', ['Planning estimate: 24 hours, one-time, and 12 hours a month.', 'It is part of our implementation program, estimated in our answer to A.1.', 'This uses Adobe Workfront, which is licensed separately.']]
    ];
    const supported = await fit(support, 90, 'knowledge base', 'Explain ongoing support, including restoration evidence and a monthly report, and distinguish one-time setup from recurring effort.');
    ok(supported.fit.words <= 90 && supported.text.includes('Planning estimate: 24 hours, one-time, and 12 hours a month.'), 'mixed one-time and monthly effort is never rewritten or recounted', supported.text);
    const home = await fit([
      ['How we would do it', ['Verify the data received against the agreed source totals and record differences for the owner.']],
      ['What you get', ['Reconciliation record']],
      ['Timeline and effort', ['Its hours are counted in our answer to A.1.', 'It sits beside our source setup, estimated in our answer to B.2.']]
    ], 60);
    ok(home.fit.words <= 60 && home.text.includes('Its hours are counted in our answer to A.1.') && !home.text.includes('Planning estimate:'), 'a later answer preserves the accounting pointer and adds no duplicate estimate', home.text);

    await h.file(path.join(__dirname, 'rfp_prototype/kb_method/chatgpt_round2/test_rfi.txt'));
    const actual = await h.eval(() => {
      const read = ref => {const q = RFPBuilder.state.questions.find(q => q.label === ref), d = RFPAnswers.compose(q), method = RFPAnswers.method(q, d), w = RFPAnswers.written(Object.assign({}, d, {ai: method}), q); return {text: w.sections.map(([, items]) => items.join('\n')).join('\n'), words: w.fit.words, max: w.fit.max};};
      return {migration: read('A.1'), suppression: read('C.1')};
    });
    ok(actual.migration.text.includes('test every entry') && actual.migration.text.includes('crawl for broken links'), 'the authored migration answer retains redirect testing and the final recrawl', actual.migration.text);
    ok(actual.suppression.text.includes('its recipients include no suppressed address') && actual.suppression.text.includes('Pre-send check record'), 'the authored email migration retains the real-recipient exclusion check and its proof record', actual.suppression.text);
    ok(Object.values(actual).every(r => r.words <= r.max), 'both repaired authored answers remain inside their limits');
    ok(h.errors.length === 0, 'the page raises no errors', h.errors.join(' | '));
  } finally { await h.close(); }
  console.log(fails ? `${fails} of ${n} ROUND 4 TRIMMING CHECKS FAILED` : `ALL ROUND 4 TRIMMING CHECKS PASSED (${n})`);
  process.exit(fails ? 1 : 0);
})().catch(e => {console.error(e); process.exit(1);});
