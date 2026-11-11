// Comparison only (Nov 11 2026, Adam: "maybe it should just be AI", then "ok" to a side-by-side). Washington State DSHS RFP
// 2123-778 read three ways: by the RFI Builder's rules today, by an AI reading (a helper model given the PDF's text and asked
// to list what a bidder must answer), and by that AI reading handed to the tool's own answer writer. Nothing in the tool is
// changed. The numbers were measured on the built tool in this session and are written in below.
//   node sow/mockups/nov11_ai_reading/compare.js     writes ai_reading.png
const {chromium} = require('playwright');
const fs = require('fs'), path = require('path');
const FONTS = path.join(__dirname, '..', '..', '..', 'video', 'fonts');
const b64 = f => fs.readFileSync(f).toString('base64');
const font = w => `@font-face{font-family:"Source Sans 3";font-weight:${w};src:url(data:font/woff2;base64,${b64(path.join(FONTS, `source-sans-3-latin-${w}-normal.woff2`))}) format("woff2")}`;
const COLS = [
  {k: 'Today', t: 'The tool’s rules read the PDF', big: '10', of: 'answers drafted', rows: [['47', 'items found'], ['11', 'sorted as Adobe product work'], ['26', 'left in To sort'], ['1', 'item is a 1,500-word block of the whole scope']],
   ex: ['“Response Due Date: All Responses must be received in their entirety by 2:00 p.m. ...” (read as an Adobe question)', '“Identify and contain Milestones;” (no lead-in, so it cannot be sorted)', 'The whole of Design, Development, Testing and Deliverables as one item']},
  {k: 'AI reads, the tool writes', t: 'An AI lists the requirements, our writer answers them', big: '48', of: 'answers drafted', rows: [['182', 'real requirements listed'], ['129', 'about Adobe product work'], ['53', 'about the firm'], ['9', 'groups of bidding rules set aside']],
   ex: ['“Design should include: determination of frontend approach, Interactive Communications vs adaptive forms.” (answered from AEM Forms)', '“Provide training to business users and developers on AEM Forms Designer.” (answered from AEM Forms)', '“Send a document to multiple signers.” (answered from Acrobat Sign)']},
  {k: 'What is still missing', t: 'Requirements the writer could not answer', big: '81', of: 'of the 129 not drafted', rows: [['', 'They name no product: the RFP says “AEM” once at the top'], ['', 'A fix in our rules, not AI: use the RFP’s product for every line'], ['', 'The scored questions are in Attachment D, a separate Word file'], ['', '']],
   ex: ['“Work with agency staff to develop and document: Forms Schema(s).”', '“Design should include: forms generation workflows.”', '“Fully replace the Central Pro software currently in use ...”']},
];
const col = c => `<div class="col"><div class="k">${c.k}</div><h2>${c.t}</h2><div class="big">${c.big}</div><div class="of">${c.of}</div>
<table>${c.rows.filter(r => r[1]).map(r => `<tr><td class="n">${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</table><h4>Examples</h4><ul>${c.ex.map(e => `<li>${e}</li>`).join('')}</ul></div>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>${font(400)}${font(600)}${font(700)}
body{margin:0;font-family:"Source Sans 3",sans-serif;color:#1C1C1C;background:#fff}.bar{height:10px;background:#EB1000}main{padding:36px 48px 44px;width:1804px}
.top{font-size:16px;font-weight:700;letter-spacing:2.2px;color:#B30B00;text-transform:uppercase}h1{font-size:40px;margin:6px 0 4px}p.sub{font-size:21px;line-height:30px;margin:0 0 26px;max-width:1560px}
.cols{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}.col{border:2px solid #1C1C1C;border-radius:16px;padding:20px 24px 22px}
.k{font-size:15px;font-weight:700;letter-spacing:2px;color:#B30B00;text-transform:uppercase}h2{font-size:24px;line-height:30px;margin:4px 0 10px;min-height:60px}
.big{font-size:110px;line-height:108px;font-weight:700;color:#EB1000}.of{font-size:22px;font-weight:700;margin:0 0 14px}
table{border-collapse:collapse;width:100%;font-size:19px;line-height:27px}td{padding:6px 0;border-top:1px solid #D5D5D5;vertical-align:top}td.n{font-weight:700;width:64px}
h4{font-size:14px;letter-spacing:1.5px;text-transform:uppercase;margin:16px 0 4px}ul{margin:0;padding-left:20px;font-size:18px;line-height:26px}li{margin:5px 0}
.foot{font-size:19px;line-height:28px;margin:24px 0 0;max-width:1640px}
</style></head><body><div class="bar"></div><main>
<div class="top">Comparison for Adam, Nov 11 2026: nothing in the tool is changed</div><h1>One real RFP, read two ways</h1>
<p class="sub">Washington State DSHS, RFP 2123-778, Adobe Experience Manager Implementation: a 36-page PDF with no question marks in it. Every number was measured on the built tool.</p>
<div class="cols">${COLS.map(col).join('')}</div>
<p class="foot"><b>What it says.</b> Reading a document like this is where AI earns its place: 182 requirements against 47, and almost five times the drafted answers. The answers themselves still come from the catalog and Adobe’s pages, with no AI. The AI reading was done by a helper model in this session on the PDF’s text, as a stand-in for what the tool would send.</p>
</main></body></html>`;
(async () => { if (/[–—]/.test(html.replace(/data:[^"')]+/g, ''))) throw new Error('a dash in the page');
  const b = await chromium.launch(), p = await (await b.newContext({viewport: {width: 1900, height: 1000}, deviceScaleFactor: 1.5})).newPage();
  await p.setContent(html); await p.waitForTimeout(500); await p.screenshot({path: path.join(__dirname, 'ai_reading.png'), fullPage: true}); console.log('written'); await b.close(); })().catch(e => { console.error(e); process.exit(1); });
