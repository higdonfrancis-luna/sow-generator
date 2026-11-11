// Mockup only (Nov 11 2026, Adam: "yes, use sonnet 5 and draw the button", then "just have a button say Read with AI"). The RFI Builder with the Washington State RFP
// dropped in: the offer to read the document with AI, and the list after the AI reading. Drawn by changing the page in the
// browser only (the "after" list is the helper model's reading in wa_ai_reading.json): nothing in the tool is changed.
//   node sow/mockups/nov11_ai_reading/button_mock.js <path to the RFP PDF>     writes ai_button.png
const path = require('path'), fs = require('fs');
const {open} = require(path.join(__dirname, '..', '..', 'rfp_prototype', 'review_2026-11-09', 'harness.js'));
const AI = JSON.parse(fs.readFileSync(path.join(__dirname, 'wa_ai_reading.json'), 'utf8')).items;
(async () => { const h = await open({scale: 2}), p = h.page;
  await h.file(path.resolve(process.argv[2]));
  const top = async () => { await p.evaluate(() => { document.getElementById('rfp-status').scrollIntoView({block: 'start'}); window.scrollBy(0, -14); }); await p.waitForTimeout(200); return (await p.screenshot({clip: {x: 0, y: 0, width: 1500, height: 520}})).toString('base64'); };
  // one button, in the row of filters beside Start over
  const button = label => p.evaluate(label => { const old = document.getElementById('mock-ai'); if (old) old.remove();
    const b = document.createElement('button'); b.type = 'button'; b.id = 'mock-ai'; b.textContent = label; b.style.cssText = 'margin-left:auto;border-color:#EB1000;color:#EB1000;font-weight:700';
    const clear = document.getElementById('rfp-clear'); clear.style.marginLeft = '0'; clear.insertAdjacentElement('beforebegin', b); }, label);
  await button('Read with AI');
  const before = await top();
  await h.eval(items => { const S = RFPBuilder.state; S.questions = items.filter(x => x.kind !== 'skip').map((x, i) => ({label: x.ref, text: x.text, kind: x.kind, order: i + 1, section: ''})); S.skipped = items.filter(x => x.kind === 'skip').map((x, i) => ({text: x.text, reason: 'Bidding rules, set aside by the AI reading', order: 1000 + i, section: ''})); S.filter = 'all'; S.selected = 0; RFPBuilder.renderList(); if (RFPBuilder.onRestore) RFPBuilder.onRestore(); }, AI);
  await p.waitForTimeout(400); await button('Undo Read with AI');
  await p.evaluate(() => { document.getElementById('rfp-status').textContent = 'wa_dshs.pdf: read with AI. 182 requirements found. 129 about Adobe products, 53 about your firm. 9 groups were not picked up: see Not picked up.'; });
  const after = await top();
  const FONTS = path.join(__dirname, '..', '..', '..', 'video', 'fonts'), b64 = f => fs.readFileSync(f).toString('base64');
  const font = w => `@font-face{font-family:"Source Sans 3";font-weight:${w};src:url(data:font/woff2;base64,${b64(path.join(FONTS, `source-sans-3-latin-${w}-normal.woff2`))}) format("woff2")}`;
  const part = (k, t, img) => `<div class="k">${k}</div><p>${t}</p><img src="data:image/png;base64,${img}">`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${font(400)}${font(700)}
body{margin:0;font-family:"Source Sans 3",sans-serif;color:#1C1C1C;background:#fff}.bar{height:10px;background:#EB1000}main{padding:30px 44px 40px;width:1500px}
h1{font-size:34px;margin:0 0 18px}.k{font-size:15px;font-weight:700;letter-spacing:2px;color:#B30B00;text-transform:uppercase;margin-top:26px}p{font-size:20px;line-height:28px;margin:4px 0 12px}img{width:100%;display:block;border:1.5px solid #1C1C1C}
</style></head><body><div class="bar"></div><main><h1>Read with AI: proposal for Adam's yes, nothing built</h1>
${part('1. One button', 'Read with AI sits beside Start over once an RFI is loaded. Nothing else is added to the page.', before)}
${part('2. After a click', 'The AI’s list takes the place of the tool’s own, and the status line says so. The same button undoes it.', after)}
</main></body></html>`;
  if (/[–—]/.test(html.replace(/data:[^"')]+/g, ''))) throw new Error('a dash in the page');
  const pg = await p.context().newPage(); await pg.setViewportSize({width: 1588, height: 900}); await pg.setContent(html); await pg.waitForTimeout(400);
  await pg.screenshot({path: path.join(__dirname, 'ai_button.png'), fullPage: true}); console.log('written'); await h.close(); })().catch(e => { console.error(e); process.exit(1); });
