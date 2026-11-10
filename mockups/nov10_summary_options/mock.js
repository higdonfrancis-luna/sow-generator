// Mockup only (Nov 10 2026, Adam on the RFI Builder's summary bar: "There's a lot going on here", then "if they're missing
// stuff then they're missing stuff they can add it manually"). Draws the bar as it is today and as proposed (no drafts tick
// box and no blank-answers warning; Shorter answers and the client's name stay) by changing the page in the browser only:
// nothing in the tool is changed.
//   node sow/mockups/nov10_summary_options/mock.js     writes summary_options.png
const path = require('path'), fs = require('fs');
const {open} = require(path.join(__dirname, '..', '..', 'rfp_prototype', 'review_2026-11-09', 'harness.js'));
(async () => { const h = await open({scale: 2}), p = h.page;
  await h.file(path.join(__dirname, '..', '..', 'rfp_prototype', 'try', 'Northbridge_Mutual_Bank_RFP_2026.xlsx'));
  const iOf = l => h.eval(l => RFPBuilder.state.questions.findIndex(q => q.label === l), l);
  const use = async ls => { for (const l of ls) { await h.select(await iOf(l)); await p.click('#rfp-use'); await p.waitForTimeout(120); } };
  const shot = async () => (await (await p.$('#rfp-summary')).screenshot()).toString('base64');
  const draw = () => p.evaluate(() => { const el = document.getElementById('rfp-summary'), labs = [...el.querySelectorAll('.rfp-include')], warn = document.getElementById('rfp-blank-warn');
    labs[0].remove(); if (warn) warn.remove();   // the drafts tick box and the blank-answers warning go: answers not chosen are left out of the downloads
    labs[1].querySelector('span').textContent = 'Shorter answers, about 170 words each'; });
  await use(['2.1', '2.2', '2.3', '2.4', '2.5']); const todaySome = await shot(); await draw(); const some = await shot();
  await use(['2.6', '2.7', '2.8']); const today = await shot(); await draw(); const all = await shot();
  const FONTS = path.join(__dirname, '..', '..', '..', 'video', 'fonts'), b64 = f => fs.readFileSync(f).toString('base64');
  const font = w => `@font-face{font-family:"Source Sans 3";font-weight:${w};src:url(data:font/woff2;base64,${b64(path.join(FONTS, `source-sans-3-latin-${w}-normal.woff2`))}) format("woff2")}`;
  const part = (k, t, img) => `<div class="k">${k}</div><p>${t}</p><img src="data:image/png;base64,${img}">`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${font(400)}${font(700)}
body{margin:0;font-family:"Source Sans 3",sans-serif;color:#1C1C1C;background:#fff}.bar{height:10px;background:#EB1000}main{padding:30px 44px 40px;width:1500px}
h1{font-size:34px;margin:0 0 22px}.k{font-size:15px;font-weight:700;letter-spacing:2px;color:#B30B00;text-transform:uppercase;margin-top:26px}p{font-size:20px;line-height:28px;margin:4px 0 12px}img{width:100%;display:block}
</style></head><body><div class="bar"></div><main><h1>RFI Builder summary bar: proposal for Adam's yes, nothing built</h1>
${part('Today, every answer chosen', 'Three settings on the bar.', today)}
${part('Proposed, every answer chosen', 'Two settings: shorter answers and the client’s name. The drafts tick box is gone.', all)}
${part('Today, three answers not chosen', 'A red warning as well.', todaySome)}
${part('Proposed, three answers not chosen', 'The same bar. The count says 5 of 8, and the downloads leave the other three out.', some)}
</main></body></html>`;
  if (/[–—]/.test(html.replace(/data:[^"')]+/g, ''))) throw new Error('a dash in the page');
  const pg = await p.context().newPage(); await pg.setViewportSize({width: 1588, height: 900}); await pg.setContent(html); await pg.waitForTimeout(400);
  await pg.screenshot({path: path.join(__dirname, 'summary_options.png'), fullPage: true});
  console.log('written'); await h.close(); })().catch(e => { console.error(e); process.exit(1); });
