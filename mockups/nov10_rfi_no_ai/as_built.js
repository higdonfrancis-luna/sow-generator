// As built (RFI Builder step 69, Nov 10 2026): the bank RFP in the built tool, five of eight answers chosen.
//   node sow/mockups/nov10_rfi_no_ai/as_built.js     writes as_built_answer.png and as_built_summary.png
const path = require('path');
const {open} = require(path.join(__dirname, '..', '..', 'rfp_prototype', 'review_2026-11-09', 'harness.js'));
(async () => { const h = await open({scale: 2}), p = h.page;
  await h.file(path.join(__dirname, '..', '..', 'rfp_prototype', 'try', 'Northbridge_Mutual_Bank_RFP_2026.xlsx'));
  const iOf = l => h.eval(l => RFPBuilder.state.questions.findIndex(q => q.label === l), l);
  for (const l of ['2.2', '2.3', '2.4', '2.5', '2.1']) { await h.select(await iOf(l)); await p.click('#rfp-use'); await p.waitForTimeout(120); }
  await p.evaluate(() => document.querySelector('.rfp-your-call').scrollIntoView({block: 'start'})); await p.evaluate(() => window.scrollBy(0, -20)); await p.waitForTimeout(200);
  await p.screenshot({path: path.join(__dirname, 'as_built_answer.png')});
  await (await p.$('#rfp-summary')).screenshot({path: path.join(__dirname, 'as_built_summary.png')});
  console.log('written'); await h.close(); })().catch(e => { console.error(e); process.exit(1); });
