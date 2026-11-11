// Mockup only (Nov 11 2026, Adam: "yes, use sonnet 5 and draw the button"). The RFI Builder with the Washington State RFP
// dropped in: the offer to read the document with AI, and the list after the AI reading. Drawn by changing the page in the
// browser only (the "after" list is the helper model's reading in wa_ai_reading.json): nothing in the tool is changed.
//   node sow/mockups/nov11_ai_reading/button_mock.js <path to the RFP PDF>     writes ai_button.png
const path = require('path'), fs = require('fs');
const {open} = require(path.join(__dirname, '..', '..', 'rfp_prototype', 'review_2026-11-09', 'harness.js'));
const AI = JSON.parse(fs.readFileSync(path.join(__dirname, 'wa_ai_reading.json'), 'utf8')).items;
(async () => { const h = await open({scale: 2}), p = h.page;
  await h.file(path.resolve(process.argv[2]));
  const BOX = 'border:1.5px solid #1C1C1C;border-left:6px solid #EB1000;border-radius:10px;padding:14px 18px;margin:0 0 16px;max-width:1180px;background:#fff;color:#1C1C1C';
  const top = async () => { await p.evaluate(() => { document.getElementById('rfp-status').scrollIntoView({block: 'start'}); window.scrollBy(0, -14); }); await p.waitForTimeout(200); return (await p.screenshot({clip: {x: 0, y: 0, width: 1500, height: 640}})).toString('base64'); };
  await p.evaluate(BOX => { const d = document.createElement('div'); d.id = 'mock-ai'; d.style.cssText = BOX;
    d.innerHTML = '<p style="margin:0 0 10px;font-size:16.5px;line-height:1.5"><b>This reads like a document, not a list of questions.</b> The tool found 47 items in 36 pages, and 26 of them it could not sort. An AI reading usually finds far more of what the client is asking for.</p>' +
      '<p style="margin:0 0 10px"><button type="button" class="primary">Read this document with AI</button></p>' +
      '<p style="margin:0;font-size:15px;line-height:1.5">The document’s text is sent to an AI model (Claude, on Amazon Bedrock) to list the requirements. It is not stored. Your answers are still written from Adobe’s documentation, with no AI.</p>';
    document.querySelector('#rfp-results .rfp-your-call').insertAdjacentElement('beforebegin', d); }, BOX);
  const before = await top();
  await h.eval(items => { const S = RFPBuilder.state; S.questions = items.filter(x => x.kind !== 'skip').map((x, i) => ({label: x.ref, text: x.text, kind: x.kind, order: i + 1, section: ''})); S.skipped = items.filter(x => x.kind === 'skip').map((x, i) => ({text: x.text, reason: 'Bidding rules, set aside by the AI reading', order: 1000 + i, section: ''})); S.filter = 'adobe'; S.selected = null; RFPBuilder.renderList(); }, AI);
  await p.waitForTimeout(300);
  await p.evaluate(() => { const d = document.getElementById('mock-ai');
    d.innerHTML = '<p style="margin:0 0 10px;font-size:16.5px;line-height:1.5"><b>Read with AI: 182 requirements found.</b> 129 about Adobe products, 53 about your firm. 9 groups of bidding rules were set aside: see Not picked up. Check the list against the document before you answer: an AI reading can miss or misread a line.</p>' +
      '<p style="margin:0"><button type="button">Go back to the tool’s own reading</button></p>';
    document.getElementById('rfp-status').textContent = 'RFP 2123-778 AEM Implementation.pdf: read with AI. 182 requirements found. 129 about Adobe products, 53 about your firm. 9 groups were not picked up: see Not picked up.'; });
  const after = await top();
  const FONTS = path.join(__dirname, '..', '..', '..', 'video', 'fonts'), b64 = f => fs.readFileSync(f).toString('base64');
  const font = w => `@font-face{font-family:"Source Sans 3";font-weight:${w};src:url(data:font/woff2;base64,${b64(path.join(FONTS, `source-sans-3-latin-${w}-normal.woff2`))}) format("woff2")}`;
  const part = (k, t, img) => `<div class="k">${k}</div><p>${t}</p><img src="data:image/png;base64,${img}">`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${font(400)}${font(700)}
body{margin:0;font-family:"Source Sans 3",sans-serif;color:#1C1C1C;background:#fff}.bar{height:10px;background:#EB1000}main{padding:30px 44px 40px;width:1500px}
h1{font-size:34px;margin:0 0 18px}.k{font-size:15px;font-weight:700;letter-spacing:2px;color:#B30B00;text-transform:uppercase;margin-top:26px}p{font-size:20px;line-height:28px;margin:4px 0 12px}img{width:100%;display:block;border:1.5px solid #1C1C1C}
</style></head><body><div class="bar"></div><main><h1>Read this document with AI: proposal for Adam's yes, nothing built</h1>
${part('1. After a PDF or Word document is dropped in', 'When the file reads like a document, the tool offers an AI reading. It never runs by itself. An Excel file or a clean list of questions gets no offer.', before)}
${part('2. After a click on the button', 'The AI’s list takes the place of the tool’s own, sorted the same way. The answers are drafted as today. One click goes back.', after)}
</main></body></html>`;
  if (/[–—]/.test(html.replace(/data:[^"')]+/g, ''))) throw new Error('a dash in the page');
  const pg = await p.context().newPage(); await pg.setViewportSize({width: 1588, height: 900}); await pg.setContent(html); await pg.waitForTimeout(400);
  await pg.screenshot({path: path.join(__dirname, 'ai_button.png'), fullPage: true}); console.log('written'); await h.close(); })().catch(e => { console.error(e); process.exit(1); });
