// Step 97. Drive the same file drop, approval controls and Word download as a partner.
// Inspect the saved Word paragraphs and tables independently of the proposal builder.
const assert = require('node:assert/strict');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {open} = require('../review_2026-11-09/harness.js');
const gold = require('./gold/briarhaven.json');

async function downloadWord(h) {
  if (await h.page.isHidden('#rfp-dl-menu')) await h.page.click('#rfp-download-menu');
  const [file] = await Promise.all([
    h.page.waitForEvent('download', {timeout: 15000}),
    h.page.click('#rfp-download-proposal')
  ]);
  assert.match(file.suggestedFilename(), /\.docx$/);
  await h.page.click('#rfp-progress-close');
  const xml = execFileSync('unzip', ['-p', await file.path(), 'word/document.xml'], {encoding: 'utf8', maxBuffer: 64e6});
  const blocks = await h.eval(xml => {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    const w = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
    const all = (el, tag) => Array.from(el.getElementsByTagNameNS(w, tag));
    const text = el => Array.from(el.getElementsByTagNameNS(w, '*'))
      .filter(n => ['t', 'br', 'tab'].includes(n.localName))
      .map(n => n.localName === 't' ? n.textContent : (n.localName === 'br' ? '\n' : '\t')).join('');
    return Array.from(all(doc, 'body')[0].children).map(el => {
      if (el.localName === 'tbl') return {rows: all(el, 'tr').map(tr => Array.from(tr.children)
        .filter(e => e.localName === 'tc').map(tc => all(tc, 'p').map(text).join('\n')))};
      return {text: text(el), style: all(el, 'pStyle')[0]?.getAttributeNS(w, 'val') || ''};
    });
  }, xml);
  const sections = [];
  for (const block of blocks) {
    if (block.style === 'Heading1') {
      const heading = /^(?:(\d+)\s+)?(.+)$/.exec(block.text);
      sections.push({number: heading[1], title: heading[2], blocks: []});
    } else if (sections.length) sections.at(-1).blocks.push(block);
  }
  return {blocks, sections};
}

function tableIn(doc, title, firstHeader) {
  const section = doc.sections.find(s => s.title === title);
  assert.ok(section, 'Word section missing: ' + title);
  const table = section.blocks.find(b => b.rows?.[0][0] === firstHeader);
  assert.ok(table, 'Word table missing from ' + title);
  const [header, ...rows] = table.rows;
  return rows.map(r => Object.fromEntries(header.map((key, i) => [key, r[i]])));
}

function technicalBodies(doc, refs) {
  const answers = new Map();
  for (const section of doc.sections) {
    let body;
    for (const block of section.blocks) {
      if (block.style === 'Heading2') {
        const ref = refs.find(r => block.text === r || block.text.startsWith(r + ' '));
        body = null;
        if (ref) {
          assert.ok(!answers.has(ref), 'Duplicate Word answer for ' + ref);
          body = {section: section.number, paragraphs: []};
          answers.set(ref, body);
        }
      } else if (body && block.text?.trim()) body.paragraphs.push(block.text);
    }
  }
  return answers;
}

async function checkCoverage(h, doc, questions) {
  const matrix = tableIn(doc, 'Requirements matrix', 'Ref');
  const refs = questions.map((q, i) => q.label || "[Q" + (i + 1) + ": replace with the RFI's reference]");
  assert.deepEqual(matrix.map(r => r.Ref), refs, 'Every input requirement occurs once in RFI order');
  const technical = technicalBodies(doc, refs);
  const firm = questions.some(q => q.kind === 'firm') ? tableIn(doc, 'About our firm', 'Ref') : [];
  const firmNumber = doc.sections.find(s => s.title === 'About our firm')?.number;
  const screen = (await h.rows()).rows.slice(1);
  assert.equal(screen.length, questions.length);
  let answered = 0;
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i], ref = refs[i], row = matrix[i];
    assert.equal(row['RFI section'], q.section || '', 'RFI section for ' + ref);
    const firmAnswer = firm.find(f => f.Ref === ref)?.['Our answer'];
    const body = q.kind === 'firm' ? (firmAnswer && !/^\[YOUR ANSWER\]$/.test(firmAnswer) ? firmAnswer : '') :
      technical.get(ref)?.paragraphs.join('\n') || '';
    assert.equal(Boolean(body), Boolean(screen[i][4]), 'Word and screen answer coverage for ' + ref);
    if (!body) {
      assert.match(row['Answered in'], /^to write$/i, 'Unanswered status for ' + ref);
      continue;
    }
    answered++;
    assert.equal(row['Answered in'], 'Section ' + (q.kind === 'firm' ? firmNumber : technical.get(ref).section), 'Printed destination of ' + ref);
    if (q.limit) assert.ok(body.trim().split(/\s+/).length <= q.limit, ref + ' exceeds its ' + q.limit + ' word limit');
  }
  return {technical, firm, matrix, answered};
}

async function run() {
  const h = await open();
  try {
    const p = h.page;
    await h.file(path.join(__dirname, gold.file));
    const first = await checkCoverage(h, await downloadWord(h), gold.questions);
    assert.ok(first.answered > 1, 'The default Word proposal contains its available drafts');
    console.log('PASS unmarked Briarhaven drafts, word limits and all 32 matrix references');

    const select = ref => h.select(gold.questions.findIndex(q => q.label === ref));
    await select('C.1');
    const draftLead = (await p.locator('#rfp-body > p:not(.rfp-fit), #rfp-body > ul:not(.rfp-sources) > li').allTextContents())
      .find(t => t.length > 65);
    await p.click('#rfp-use');
    await select('A.2');
    const edit = 'We will rehearse the Drupal cutover twice for $9,750 [17].\n\nThe bank will sign the redirect register.';
    await p.click('#rfp-edit-btn');
    await p.fill('#rfp-edit', edit);
    await p.click('#rfp-save-edit');
    await select('A.3');
    await p.click('#rfp-skip');
    await select('G.1');
    const firmText = 'Rowan Vale will lead delivery. Birch & Moss will provide our two references.';
    await p.fill('#rfp-firm', firmText);
    await p.click('#rfp-firm-use');
    const choices = await checkCoverage(h, await downloadWord(h), gold.questions);
    assert.equal(choices.answered, 3);
    assert.equal(choices.technical.get('A.2').paragraphs.join('\n'), edit);
    assert.equal(choices.firm.find(r => r.Ref === 'G.1')['Our answer'], firmText);
    assert.ok(!choices.technical.has('A.3'));
    assert.ok(draftLead && choices.technical.get('C.1').paragraphs.join(' ').includes(draftLead.slice(0, 65)),
      'The approved on-screen draft is present under its own code');
    console.log('PASS approved draft, exact edit, omitted answer and typed firm reply in Word');

    await select('A.2');
    await p.click('#rfp-edit-btn');
    await p.fill('#rfp-edit', Array(201).fill('proof').join(' '));
    await p.click('#rfp-save-edit');
    const unexpectedDownloads = [];
    const capture = file => unexpectedDownloads.push(file.suggestedFilename());
    p.on('download', capture);
    try {
      await p.click('#rfp-download-menu');
      await p.click('#rfp-download-proposal');
      await p.waitForFunction(() => document.getElementById('rfp-progress-text')?.textContent.includes('A.2 has 201 words'));
      assert.match(await p.textContent('#rfp-progress-text'), /shorten.*200 words/i);
      assert.deepEqual(unexpectedDownloads, []);
    } finally { p.off('download', capture); }
    await p.click('#rfp-progress-close');
    console.log('PASS over-limit partner text is identified before a file is written');

    await h.text('Describe your AEM Sites author training approach.');
    const anonymousQuestions = await h.eval(() => RFPBuilder.state.questions.map(({label, section, kind, limit}) => ({label, section, kind, limit})));
    assert.equal(anonymousQuestions.length, 1);
    assert.ok(!anonymousQuestions[0].label);
    const anonymous = await checkCoverage(h, await downloadWord(h), anonymousQuestions);
    assert.equal(anonymous.answered, 1);
    console.log('PASS unnumbered requirement has its replacement reference in both answer and matrix');

    await h.text('1. Provide two client references for comparable engagements.');
    await h.select(0);
    await p.fill('#rfp-firm', firmText);
    await p.click('#rfp-firm-use');
    const firmOnly = await downloadWord(h);
    assert.equal(tableIn(firmOnly, 'About our firm', 'Ref')[0]['Our answer'], firmText);
    assert.equal(tableIn(firmOnly, 'Requirements matrix', 'Ref').length, 1);
    console.log('PASS a firm-only RFI can export an approved partner answer');
    assert.deepEqual(h.errors, []);
  } finally {
    await h.close();
  }
}

module.exports = {downloadWord, tableIn, technicalBodies};
if (require.main === module) run().catch(error => { console.error(error); process.exitCode = 1; });
