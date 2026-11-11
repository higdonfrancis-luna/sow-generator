// As built (RFI Builder steps 72 and 73, Nov 11 2026): the top of the RFI Builder in the built tool, with an RFP loaded.
//   node sow/mockups/nov11_ai_reading/as_built.js <path to an RFP PDF>     writes as_built_button.png
const path = require('path');
const {open} = require(path.join(__dirname, '..', '..', 'rfp_prototype', 'review_2026-11-09', 'harness.js'));
(async () => { const h = await open({scale: 2}), p = h.page; await h.file(path.resolve(process.argv[2]));
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(200);
  await p.screenshot({path: path.join(__dirname, 'as_built_button.png'), clip: {x: 0, y: 0, width: 1500, height: 760}}); console.log('written'); await h.close(); })().catch(e => { console.error(e); process.exit(1); });
