// Step 51 (Nov 10 2026): spreadsheets, tables and PDFs read as rows. Run from the repo root after
// python3 sow/rfp_prototype/build.py:   node sow/test_rfp_step51.js
// Uses the test files the review made (verification/c2_readers/fixtures): the two-sheet compliance matrix, Gemini's
// REQ-04 row, the trap row, a Word table, a CSV with a multi-line cell, PDFs with a page break, a running header, a
// letter-spaced header, two columns, a table and a scan. Checks one item per row with its ID, section and priority, every
// dropped file read, the new Excel columns, and the answers written back into the client's own workbook, values only.
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
const fs = require('fs'), path = require('path');
const VFX = __dirname + '/rfp_prototype/review_2026-11-09/verification/c2_readers/fixtures', FIX = __dirname + '/qa/rfp_fixtures';
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 400) + ']')); if (!c) fails++; };
const brief = r => JSON.stringify(r.questions.map(q => [q.label, q.priority, q.section, q.text.slice(0, 45)]));
const readBook = (h, file) => h.eval(bytes => { const X = window.XLSX, wb = X.read(new Uint8Array(bytes), {type: 'array'}); return {names: wb.SheetNames, sheets: Object.fromEntries(wb.SheetNames.map(n => [n, X.utils.sheet_to_json(wb.Sheets[n], {header: 1, defval: ''})]))}; }, [...fs.readFileSync(file)]);
(async () => {
  const h = await open();
  let r;
  // 2.1 the compliance matrix
  r = await h.file(VFX + '/requirements.xlsx');
  ok(r.count === 8 && r.questions.map(q => q.label).join(',') === 'FR-01,FR-02,FR-03,FR-04,FR-05,FR-06,SEC-01,SEC-02', '2.1 the two-sheet compliance matrix gives one item per requirement row, with the client\'s ID', brief(r));
  ok(r.questions.map(q => q.priority[0]).join('') === 'mmmdmdmm' && r.questions[0].section === 'Analytics' && r.questions[6].section === 'Security', '2.1 each row keeps its priority (M or D) and its Category as the section', brief(r));
  const MATRIX = ['Describe how Customer Journey Analytics joins paid media data with web conversions.', 'The solution shall support multi-site management across 12 brands.', 'Describe your approach to migrating content into AEM Sites.', 'The platform must publish to a CDN with purge on publish.', 'Vendor shall provide role-based access in Experience Platform.', 'The solution should support A/B testing of offers.', 'Do you support single sign-on with SAML 2.0?', 'Describe your data retention policy.'];
  ok(r.questions.map(q => q.text).join('|') === MATRIX.join('|'), '2.1 each item is the Requirement cell alone: no ID, Category or Priority glued on', JSON.stringify(r.questions.map(q => q.text)));
  ok(r.status === 'requirements.xlsx: 8 requirements found on 2 sheets (Requirements, Security). 4 about Adobe products, 4 to sort. 6 mandatory, 2 desirable. Nothing was skipped.', '2.1 the status line reads exactly as in the picture Adam approved', r.status);
  ok(r.questions.filter(q => q.kind === 'adobe').map(q => q.label).join(',') === 'FR-01,FR-03,FR-05,FR-06', '2.1 FR-01, FR-03, FR-05 and FR-06 are Adobe products; FR-02, FR-04, SEC-01 and SEC-02 are to sort, as pictured', r.questions.map(q => q.label + ':' + q.kind).join(' '));
  for (const f of ['requirements_one_block.tsv', 'requirements_two_blocks.tsv']) {
    r = await h.text(fs.readFileSync(VFX + '/' + f, 'utf8'), f);
    ok(r.count === 8 && r.questions[0].label === 'FR-01' && r.questions[7].label === 'SEC-02' && r.questions[1].priority === 'mandatory', `2.1 the same matrix pasted as tab-separated text (${f}) gives the same eight rows`, brief(r));
  }
  // 2.2 Gemini's row and the trap row
  r = await h.file(VFX + '/req04.xlsx');
  ok(r.count === 1 && r.questions[0].label === 'REQ-04' && r.questions[0].priority === 'mandatory' && /^Describe how Customer Journey Analytics joins/.test(r.questions[0].text), '2.2 REQ-04 keeps its ID and its Mandatory tag, and the text is the requirement alone', brief(r));
  r = await h.file(VFX + '/req04_noheader.xlsx');
  ok(r.count === 1 && r.questions[0].label === 'REQ-04' && r.questions[0].priority === 'mandatory', '2.2 the same row with no header row is read by its longest text column, ID and priority', brief(r));
  r = await h.file(VFX + '/trap.xlsx');
  ok(r.count === 1 && r.questions[0].text === 'System must support SSO' && r.questions[0].section === 'Explain how you handle security', '2.2 with a header row, the Category cell never becomes the question', brief(r));
  for (const f of ['priority_first.xlsx', 'numeric_ids_comply.xlsx']) {
    r = await h.file(VFX + '/' + f);
    ok(r.count === 2 && r.questions.map(q => q.priority[0]).join('') === 'md' && r.questions.every(q => /^Describe/.test(q.text)), `A8 ${f}: single-letter Priority and Comply cells no longer decide whether a row survives or glue onto it`, brief(r));
  }
  // 2.3 a Word table
  r = await h.file(VFX + '/table.docx');
  ok(r.count === 3 && r.questions.map(q => q.label).join(',') === '4.1,4.2,4.3', '2.3 a Word table keeps its numbers, row by row', brief(r));
  ok(r.questions[2].requirement && r.questions.every(q => /^Section 4\. Adobe platform services$/.test(q.section)), '2.3 the statement row is a requirement, and the heading above the table is each row\'s section', brief(r));
  // 2.4 a CSV with a quoted multi-line cell
  r = await h.file(VFX + '/multiline.csv');
  ok(r.count === 2 && r.questions[0].label === 'R-1' && r.questions[0].text === 'The system must support real-time activation', '2.4 a CSV with coded IDs and a line break inside a cell gives two rows, the break collapsed', brief(r));
  r = await h.file(VFX + '/multiline_numeric.csv');
  ok(r.count === 2 && r.questions[0].label === '1', '2.4 the same with numeric IDs', brief(r));
  // 2.5 PDFs
  r = await h.file(VFX + '/split.pdf');
  const q34 = r.questions.find(q => q.label === '3.4');
  ok(r.count === 5 && q34 && /which teams on our side would need to be involved\?$/.test(q34.text), '2.5 a question that runs onto the next page is whole', brief(r));
  ok(r.questions.every(q => !/Northbridge Mutual Bank RFP|Page \d/.test(q.text)) && r.skipped === 0, '2.5 the running header is gone from every question and nothing is left over', brief(r) + ' skipped ' + r.skipped);
  r = await h.file(VFX + '/split_glyph_header.pdf');
  ok(r.count === 5 && /involved\?$/.test(r.questions.find(q => q.label === '3.4').text) && r.questions.every(q => !/Northbridge/.test(q.text)), '2.5 a header drawn one letter at a time is joined into words and dropped as a running header', brief(r));
  r = await h.file(VFX + '/chromium_header.pdf');
  ok(r.questions.every(q => !/N o r t h|N\s?o\s?r\s?t\s?h b/.test(q.text)) && r.questions.some(q => q.label === '3.6' && /Customer Journey Analytics to Brand Visibility\?$/.test(q.text)), '2.5 a letter-spaced line from a browser-printed PDF is not garbled', brief(r));
  r = await h.file(VFX + '/two_columns.pdf');
  ok(r.questions.map(q => q.label).join(',') === '3.1,3.2,3.3,3.4' && r.questions[0].text === 'Describe your approach to implementing AEM Sites.' && r.questions[2].text === 'What ongoing optimization services do you provide after launch?', 'A8 a two-column page is read column by column, each question whole', brief(r));
  r = await h.file(VFX + '/table.pdf');
  ok(r.questions.map(q => q.label).join(',') === '3.4,3.5' && r.questions[0].requirement, '2.5 a PDF table\'s statement row is read as a requirement', brief(r));
  r = await h.file(VFX + '/wrap_sentence.pdf');
  ok(r.questions.map(q => q.label).join(',') === '2.3,2.4' && r.questions.every(q => /approved sources\?$/.test(q.text)), '2.5 a two-sentence question wrapped at the sentence stays whole', brief(r));
  r = await h.file(VFX + '/scan.pdf');
  ok(/no text layer \(it looks like a scan\)/.test(r.status), '2.5 a PDF with no text layer says it looks like a scan', r.status);
  // A8 the old .xls format
  r = await h.file(VFX + '/requirements.xls');
  ok(/older \.xls format/.test(r.status) && /save it as \.xlsx/.test(r.status) && !/undefined|TypeError|Unsupported/.test(r.status), 'A8 a legacy .xls says to save it as .xlsx, with no internal error', r.status);
  // 2.6 every dropped file
  ok(await h.eval(() => document.getElementById('rfp-file').multiple), '2.6 the file chooser takes several files');
  await h.eval(() => { document.getElementById('rfp-clear').click(); document.getElementById('rfp-clear-confirm').click(); });   // step 55: Start over asks first
  await h.page.setInputFiles('#rfp-file', [FIX + '/bank_rfp.txt', VFX + '/requirements.xlsx']);
  await h.page.waitForFunction(() => /found/.test(document.getElementById('rfp-status').textContent), null, {timeout: 60000}).catch(() => {});
  r = await h.read();
  ok(r.count === 20 && /^bank_rfp\.txt and 1 more: 20 questions found/.test(r.status) && /Read 2 files\./.test(r.status), '2.6 both dropped files are read in turn: 12 questions and 8 requirements', r.status);
  // 7.9 the Excel export gains Section, Mandatory or desirable and Comply
  r = await h.file(VFX + '/requirements.xlsx');
  const rows = (await h.rows()).rows;
  ok(rows[0].join('|') === 'Number|Section|Question|Mandatory or desirable|Response|Comply|Status', '7.9 the Excel response has Section, Mandatory or desirable and Comply columns', rows[0].join('|'));
  const fr2 = rows.find(x => x[0] === 'FR-02');
  ok(fr2 && fr2[1] === 'Content' && fr2[3] === 'Mandatory' && fr2[6] === 'Still to sort' && fr2[4] === '', '7.9 a row carries its ID, section and priority; a To sort row has no drafted text', JSON.stringify(fr2));
  // the answers written back into the client's own workbook
  await h.select(0); await h.page.click('#rfp-use'); await h.page.waitForTimeout(100);
  const used = await h.eval(() => RFPAnswers.plain(RFPBuilder.state.questions[0].draft, RFPBuilder.state.questions[0]).split('\n\nAdobe sources')[0]);
  ok(/Your answers in requirements\.xlsx/.test(await h.page.textContent('#rfp-summary')) && /Vendor response column/.test(await h.page.textContent('#rfp-summary')) && /Values only/.test(await h.page.textContent('#rfp-summary')), 'the summary offers to write the answers into the client\'s workbook, naming its Vendor response column and saying values only');
  const [dl] = await Promise.all([h.page.waitForEvent('download'), h.page.click('#rfp-download-menu').then(() => h.page.click('#rfp-writeback'))]);
  const back = await readBook(h, await dl.path());
  const req = back.sheets.Requirements, secu = back.sheets.Security;
  ok(/requirements-answered\.xlsx$/.test(dl.suggestedFilename()) && back.names.join(',') === 'Requirements,Security', 'the client\'s workbook comes back with both its sheets, named for the client\'s file', dl.suggestedFilename() + ' ' + back.names);
  ok(req[0].join('|') === 'Req ID|Category|Requirement|Priority|Comply (Y/N/P)|Vendor response' && req[1][0] === 'FR-01' && req[1][5] === used, 'FR-01\'s answer is in its own row, in the Vendor response column, and the header is untouched', JSON.stringify(req[1]).slice(0, 300));
  ok(req.slice(2).every(x => x[5] === '') && secu.slice(1).every(x => x[5] === ''), 'rows without a used answer are left empty in the client\'s workbook', JSON.stringify(req.slice(2).map(x => x[5])));
  ok(req[2][2] === 'The solution shall support multi-site management across 12 brands.' && req[2][3] === 'M' && secu[1][0] === 'SEC-01', 'the client\'s own cells are kept as they were', JSON.stringify(req[2]));
  // the bank workbook: the answer lands in column D on its row
  r = await h.file(FIX + '/bank_rfp.xlsx');
  const i22 = r.questions.findIndex(q => q.label === '2.2');
  await h.select(i22); await h.page.click('#rfp-use'); await h.page.waitForTimeout(100);
  const [dl2] = await Promise.all([h.page.waitForEvent('download'), h.page.click('#rfp-download-menu').then(() => h.page.click('#rfp-writeback'))]);
  const bank = await readBook(h, await dl2.path());
  const row22 = bank.sheets.Questions.find(x => x[1] === '2.2'), row21 = bank.sheets.Questions.find(x => x[1] === '2.1');
  ok(row22 && /^Our approach/.test(row22[3]) && row21 && row21[3] === '' && bank.names.join(',') === 'Questions,Submission', 'the bank\'s workbook gets 2.2\'s answer in its Vendor response column and nothing else changes', JSON.stringify(row22 && row22.map(c => String(c).slice(0, 30))));
  r = await h.file(FIX + '/bank_rfp.txt');
  ok(!(await h.eval(() => !!document.getElementById('rfp-writeback'))), 'a text or PDF RFP has no workbook to write into, so the button is not offered');
  ok(h.errors.length === 0, 'no script errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `${fails} STEP 51 CHECK(S) FAILED` : 'ALL STEP 51 CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
