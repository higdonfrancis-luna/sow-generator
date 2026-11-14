/* Browser regressions from the independent Round 5b review. Pass item numbers to run a subset. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {open} = require('../review_2026-11-09/harness.js');
const {downloadWord, tableIn} = require('./test_word_complete.js');
const reviewFile = name => path.join(__dirname, 'review_5b', name);
const demoFile = name => path.join(__dirname, '..', 'demo', name);

const cases = new Map();
cases.set(1, async h => {
  const {questions} = await h.file(reviewFile('chapters_kingsfold.pdf'));
  const chapters = ['1. Digital Experience', '2. Data and Analytics', '3. Implementation', '4. Vendor Profile'];
  const expected = chapters.flatMap((section, i) =>
    Array.from({length: i === 0 ? 4 : 3}, (_, j) => [`${i + 1}.${j + 1}`, section]));
  assert.deepEqual(questions.map(q => [q.label, q.section]), expected, 'Every numbered requirement has its printed chapter');
  const word = await downloadWord(h);
  const matrix = tableIn(word, 'Requirements matrix', 'Ref');
  assert.deepEqual(matrix.map(row => [row.Ref, row['RFI section']]), expected);
  for (const [ref, chapter] of expected) {
    const row = matrix.find(r => r.Ref === ref);
    if (row['Answered in'] === 'To write') continue;
    const destination = word.sections.find(s => 'Section ' + s.number === row['Answered in']);
    assert.ok(destination);
    if (destination.title !== 'About our firm') assert.equal(destination.title, chapter.replace(/^\d+\. /, ''));
  }
});

cases.set(2, async h => {
  const {questions} = await h.file(reviewFile('overview_heading_harrow_lake.docx'));
  const overview = questions.filter(q => q.section === 'Overview');
  assert.deepEqual(overview.map(q => [q.label, q.text]), [
    ['1.1', 'Provide an overview of your firm and its Adobe practice.'],
    ['1.2', 'Describe two comparable credit union or banking implementations.']
  ], 'Numbered requests survive a Word Overview heading');
  assert.equal(questions.length, 11);
  const skipped = await h.eval(() => RFPBuilder.state.skipped.map(x => x.text));
  assert.ok(skipped.some(text => text.includes('We run Adobe Experience Manager Sites on premises today')),
    'The excluded background paragraph is available in Not picked up');
  const mixed = await h.eval(() => RFPFinder.read([{text: 'Submission instructions\n\nUse the response form.\n\nDescribe your accessibility testing approach for AEM Sites.\n\n2.1 Explain how you would verify a release.'}]));
  assert.deepEqual(mixed.questions.map(q => q.text), ['Describe your accessibility testing approach for AEM Sites.', 'Explain how you would verify a release.']);
  assert.ok(mixed.skipped.some(row => row.text === 'Use the response form.'));
});

cases.set(3, async h => {
  const {questions} = await h.file(reviewFile('a_paragraph_kingsfold.pdf'));
  const migration = questions.find(q => q.label === '1.3');
  const continuation = 'A Drupal 9 site with about 3,000 pages and 40 content types runs our site today and must be retired at launch.';
  assert.equal(migration.text, 'Describe your migration approach for our current site. ' + continuation);
  assert.equal(questions.length, 4);
  const pasted = await h.find('A Public website\nA.1 Describe your migration approach.\nA Drupal site handles 40 content types\nand must be retired at launch.\nB Analytics\nB.1 Explain how you would measure readership.');
  assert.deepEqual(pasted.map(q => [q.label, q.section]), [['A.1','A Public website'], ['B.1','B Analytics']]);
  assert.match(pasted[0].text, /A Drupal site handles 40 content types and must be retired at launch\.$/);
});

cases.set(4, async h => {
  const website = '1. Describe how you would build our new website on AEM Sites with Edge Delivery Services.';
  const analytics = '2. Describe how you would implement Customer Journey Analytics.';
  async function limits() {
    return h.eval(() => RFPBuilder.state.questions.map(q => {
      const words = RFPAnswers.wordsIn(RFPAnswers.usedText(q));
      return [q.limit, RFPAnswers.limitOf(q)?.max ?? null, words];
    }));
  }
  for (const [instruction, max] of [
    ['Responses must not exceed 120 words.',120], ['Each response must not exceed 50 words.',50],
    ['Each response must be not exceeding 200 words.',200], ['Responses are max. 115 words.',115]
  ]) {
    await h.text(['Request for Information', instruction, website, analytics].join('\n'));
    const rows = await limits();
    assert.deepEqual(rows.map(row => row.slice(0,2)), [[max,max],[max,max]], instruction);
    assert.ok(rows.every(row => row[2] > 0 && row[2] <= max), 'Rendered answers obey ' + instruction);
  }
  await h.text('Section A: Websites\nAnswers must not exceed 150 words.\n' + website +
    '\nSection B: Analytics\n' + analytics);
  assert.deepEqual((await limits()).map(row => row.slice(0,2)), [[150,150],[null,null]]);
  await h.text(fs.readFileSync(reviewFile('word_limits.txt'), 'utf8'));
  assert.deepEqual((await limits()).map(row => row[0]), [250,250,300,250,250]);
  const legacy = await h.eval(() => RFPAnswers.limitOf({text:'Describe migration in no more than 110 words.',limit:null}));
  assert.equal(legacy.max, 110, 'A historical null does not skip limit fallbacks');
});

cases.set(5, async h => {
  const {questions} = await h.file(demoFile('Cedar_Prairie_Mutual_Insurance_Company_RFP.pdf'));
  const headings = {
    B: ['Website on AEM Sites with Edge Delivery Services',300],
    C: ['AI visibility and the conversational experience',250],
    D: ['Data, analytics and integrations',250],
    E: ['Security, hosting and compliance',150],
    F: ['Enablement, Coworker and ongoing services',200],
    G: ['Pricing',250]
  };
  const limits = await h.eval(() => RFPBuilder.state.questions.map(q => q.limit));
  for (const [letter, [title, maximum]] of Object.entries(headings)) {
    const rows = questions.filter(q => q.section.startsWith('Section ' + letter + '.'));
    assert.ok(rows.length);
    for (const q of rows) {
      assert.equal(q.section, 'Section ' + letter + '. ' + title, 'Clean heading for ' + q.label);
      assert.equal(limits[q.i], maximum);
    }
  }
  const word = await downloadWord(h);
  const matrix = tableIn(word, 'Requirements matrix', 'Ref');
  assert.equal(matrix.length, questions.length);
  for (const [i, row] of matrix.entries()) {
    const letter = /^Section ([B-G])\./.exec(questions[i].section)?.[1], section = headings[letter];
    if (!section) continue;
    assert.equal(row['RFI section'], 'Section ' + letter + '. ' + section[0]);
    if (row['Answered in'] === 'To write') continue;
    const dest = word.sections.find(s => 'Section ' + s.number === row['Answered in']);
    assert.ok(dest);
    if (dest.title !== 'About our firm') assert.equal(dest.title, section[0]);
  }
});

async function run() {
  const chosen = process.argv.slice(2).map(Number);
  for (const id of chosen) assert.ok(cases.has(id), 'Unknown item ' + id);
  const h = await open();
  try {
    for (const [id, check] of cases) {
      if (chosen.length && !chosen.includes(id)) continue;
      await check(h);
      console.log('PASS Round 5b item ' + id);
    }
    assert.deepEqual(h.errors, [], 'Unexpected browser errors');
  } finally { await h.close(); }
}
if (require.main === module) run().catch(e => { console.error(e); process.exitCode = 1; });
