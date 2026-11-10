// As built (RFI Builder step 70, Nov 10 2026): the bank RFI in the built tool, five of eight answers chosen, then after a
// click on "Go to the 3 that are left".
//   node sow/mockups/nov10_summary_options/as_built.js     writes as_built_bar.png and as_built_left.png
const path = require('path');
const {open} = require(path.join(__dirname, '..', '..', 'rfp_prototype', 'review_2026-11-09', 'harness.js'));
(async () => { const h = await open({scale: 2}), p = h.page;
  await h.file(path.join(__dirname, '..', '..', 'rfp_prototype', 'try', 'Northbridge_Mutual_Bank_RFP_2026.xlsx'));
  const iOf = l => h.eval(l => RFPBuilder.state.questions.findIndex(q => q.label === l), l);
  for (const l of ['2.1', '2.2', '2.3', '2.4', '2.5']) { await h.select(await iOf(l)); await p.click('#rfp-use'); await p.waitForTimeout(120); }
  await (await p.$('#rfp-summary')).screenshot({path: path.join(__dirname, 'as_built_bar.png')});
  await p.click('#rfp-left-adobe'); await p.waitForTimeout(300); await p.evaluate(() => window.scrollBy(0, -16)); await p.waitForTimeout(150);
  await p.screenshot({path: path.join(__dirname, 'as_built_left.png')});
  console.log('written'); await h.close(); })().catch(e => { console.error(e); process.exit(1); });
