// The board for Adam: counted once as built (step 27) next to the proposed overlap review. Uses the PNGs and
// numbers.json that mock_overlap.js writes. Run from the repo root after it:
//   NODE_PATH=/opt/node-tools/node_modules node sow/mockups/nov3_overlap/board_overlap.js
const {chromium} = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = __dirname, img = n => 'file://' + path.join(OUT, n), N = JSON.parse(fs.readFileSync(path.join(OUT, 'numbers.json'), 'utf8'));
(async () => {
  const b = await chromium.launch(), sz = {};
  { const p = await (await b.newContext()).newPage();
    for (const n of ['today_total.png', 'today_card.png', 'proposed_total.png', 'proposed_card.png', 'proposed_readiness.png']) { await p.goto(img(n)); sz[n] = await p.evaluate(() => ({w: document.images[0].naturalWidth / 2, h: document.images[0].naturalHeight / 2})); }
    await p.context().close(); }
  const col = (k, title, sub, total) => `<div class="col"><div class="tag ${k}">${title}</div><p class="sub">${sub}</p>
    <img class="shot" src="${img(k + '_total.png')}" width="${sz[k + '_total.png'].w}"><p class="cap">${total}</p>
    <img class="shot" src="${img(k + '_card.png')}" width="${sz[k + '_card.png'].w}"></div>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet"><style>
*{box-sizing:border-box}body{margin:0;background:#fff;color:#1c1c1c;font-family:'Source Sans 3',sans-serif}.board{padding:36px 40px 44px;width:1440px}
.eye{color:#d40e00;font-weight:700;letter-spacing:2px;font-size:14px;text-transform:uppercase}h1{font-size:34px;line-height:1.15;margin:6px 0 10px}
.lead{font-size:19px;line-height:1.45;margin:0 0 20px;max-width:1300px}h2{font-size:22px;margin:26px 0 12px;padding-top:16px;border-top:2px solid #1c1c1c}
.cols{display:flex;gap:44px;align-items:flex-start}.col{flex:0 0 auto}.shot{display:block;border:1.5px solid #1c1c1c;border-radius:6px;margin:0 0 10px}
.tag{display:inline-block;font-weight:700;font-size:15px;letter-spacing:1.5px;text-transform:uppercase;border:2px solid #1c1c1c;border-radius:4px;padding:2px 10px;margin:0 0 6px}
.tag.proposed{border-color:#d40e00;color:#d40e00}.sub{font-size:17px;line-height:1.45;margin:0 0 12px;max-width:470px}.cap{font-size:17px;line-height:1.45;margin:0 0 14px;max-width:470px}
.why{flex:1;font-size:17px;line-height:1.45}.why h3{font-size:19px;margin:0 0 8px}.why ul{margin:0 0 14px;padding-left:20px}.why li{margin:6px 0}.why b{font-weight:700}.q{font-style:italic}
.opt{font-size:17px;line-height:1.45;margin:6px 0}</style></head><body><div class="board">
<div class="eye">Partner SOW tool · counted once · proposal, not built</div><h1>Counted once: flag the overlap instead of zeroing the line</h1>
<p class="lead">The CJA play at $150 an hour, Typical, with a data warehouse, cloud storage and a CRM added (${N.today_before}), then CJA data preparation in Experience Platform turned on. A final check of step 27 found that the rule you approved works for one source but not for three: turning a service on lowers the total, and the SOW loses the source work.</p>
<div class="cols">${col('today', 'Today (step 27)', 'Data preparation covers the three source services: each shows as covered and adds $0 unless the partner keeps it.', `Turning data preparation on: ${N.today_before} to <b>${N.today_after}</b>. The SOW then has no service for the warehouse, the files or the CRM.`)}
${col('proposed', 'Proposed', 'Every service counts. The canvas flags the overlap on the source service, and the SOW asks how the two differ before it can be issued.', `Turning data preparation on: ${N.proposed_before} to <b>${N.proposed_after}</b>. Nothing drops out; the partner settles the overlap in the SOW.`)}
<div class="why"><h3>Why change it</h3><ul>
<li><b>It lowers the total.</b> The three source services are 136 planning hours at Typical; data preparation is an 80-hour placeholder, so turning it on drops $8,400.</li>
<li><b>Data preparation doesn't describe this work.</b> Its scope: <span class="q">"Design the XDM schemas, create the datasets and set up ingestion for the channels CJA will report on, such as web, app, call center and point of sale data."</span> Adobe: <span class="q">"Data Mirror requires relational schemas"</span> and <span class="q">"fields from standard XDM schemas do not automatically merge with similar named fields from relational schemas"</span> (Experience League: Data Mirror overview; CJA, create a connection).</li>
<li><b>It is simpler and steadier.</b> Five of the reviewers' state bugs come from covering and keeping across Build and Services. The overlap review has no hidden state.</li>
<li><b>The tool already works this way</b> for Brand Concierge's question mapping beside the build: both count, and the SOW asks how they differ.</li></ul>
<h3>Options</h3><p class="opt"><b>A (recommended):</b> the overlap review, as shown.</p><p class="opt"><b>B:</b> keep covering, but only cloud storage and the CRM (not the warehouse). It can still lower the total at Small.</p><p class="opt"><b>C:</b> keep it as built.</p></div></div>
<h2>On the Statement of work step (proposed)</h2><img class="shot" src="${img('proposed_readiness.png')}" width="${Math.min(1360, sz['proposed_readiness.png'].w)}">
<p class="cap" style="max-width:1300px">The same check the tool uses today for a kept service: once each source service's scope says how it differs from data preparation (or one is removed), the SOW can be issued.</p>
</div></body></html>`;
  fs.writeFileSync(path.join(OUT, 'board_overlap.html'), html);
  const p = await (await b.newContext({viewport: {width: 1440, height: 900}, deviceScaleFactor: 2})).newPage(); await p.goto('file://' + path.join(OUT, 'board_overlap.html')); await p.waitForLoadState('networkidle');
  await p.evaluate(() => document.fonts.ready); await (await p.$('.board')).screenshot({path: path.join(OUT, 'counted_once_overlap.png')}); await b.close();
})();
