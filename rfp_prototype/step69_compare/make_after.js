// RFI Builder step 69: the bank RFP answered by the built tool, every drafted answer chosen, written back into the bank's own workbook.
//   node sow/rfp_prototype/step69_compare/make_after.js      writes after_step69.xlsx beside this file (after python3 sow/build_site.py)
const path = require('path');
const {open} = require(path.join(__dirname, '..', 'review_2026-11-09', 'harness.js'));
(async () => { const h = await open(), p = h.page;
  await h.file(path.join(__dirname, '..', 'try', 'Northbridge_Mutual_Bank_RFP_2026.xlsx'));
  const n = await h.eval(() => { let k = 0; for (const q of RFPBuilder.state.questions) if (q.kind === 'adobe') { q.draft = q.draft || RFPAnswers.compose(q); if (q.draft && (q.draft.kb || (q.draft.m && q.draft.m.lines.length))) { q.status = 'used'; k++; } } return k; });
  await h.eval(() => { RFPBuilder.renderList(); });
  await p.click('#rfp-download-menu').catch(() => {});
  const [d] = await Promise.all([p.waitForEvent('download', {timeout: 20000}), h.eval(() => RFPAnswers.writeBack())]);
  await d.saveAs(path.join(__dirname, 'after_step69.xlsx'));
  console.log('written, with ' + n + ' answers chosen'); await h.close(); })().catch(e => { console.error(e); process.exit(1); });
