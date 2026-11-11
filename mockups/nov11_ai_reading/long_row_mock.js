// Mockup only (Nov 11 2026, Adam on a 1,500-word row in the tool's own reading of the Washington State RFP: "This one
// answer is so long and then I don't even see the question"). A very long line shown short, with Show all, in the list and
// above the answer. Drawn by changing the page in the browser only: nothing in the tool is changed.
//   node sow/mockups/nov11_ai_reading/long_row_mock.js <path to the RFP PDF>     writes long_row.png
const path = require('path'), fs = require('fs');
const {open} = require(path.join(__dirname, '..', '..', 'rfp_prototype', 'review_2026-11-09', 'harness.js'));
(async () => { const h = await open({scale: 2}), p = h.page; await h.file(path.resolve(process.argv[2]));
  const i = await h.eval(() => RFPBuilder.state.questions.findIndex(q => q.text.split(/\s+/).length > 400)); await h.select(i);
  const view = async hgt => { await p.evaluate(i => { document.querySelector(`#rfp-questions li[data-i="${i}"]`).scrollIntoView({block: 'start'}); window.scrollBy(0, -20); }, i); await p.waitForTimeout(200); return (await p.screenshot({clip: {x: 0, y: 0, width: 1500, height: hgt}})).toString('base64'); };
  const today = await view(620);
  await p.evaluate(i => { const words = RFPBuilder.state.questions[i].text.split(/\s+/), n = words.length, short = words.slice(0, 34).join(' ') + ' …';
    const more = '<button type="button" class="rfp-link" style="border:0;background:none;padding:0;margin-left:8px;font-weight:700;color:#EB1000;text-decoration:underline;cursor:pointer;font-size:inherit">Show all ' + n.toLocaleString('en-US') + ' words</button>';
    const li = document.querySelector(`#rfp-questions li[data-i="${i}"]`), q = li.querySelector('.rfp-q'), lab = q.querySelector('b,strong,.rfp-label');
    q.innerHTML = (lab ? lab.outerHTML + ' ' : '') + short + more + '<span class="rfp-why" style="display:block;margin-top:6px;font-weight:700">This line is very long: it may be several requirements run together. Build Answers with AI splits a line like this.</span>';
    const h3 = document.querySelector('#rfp-answer h3'); if (h3) h3.innerHTML = short + more; }, i);
  const proposed = await view(620);
  const FONTS = path.join(__dirname, '..', '..', '..', 'video', 'fonts'), b64 = f => fs.readFileSync(f).toString('base64');
  const font = w => `@font-face{font-family:"Source Sans 3";font-weight:${w};src:url(data:font/woff2;base64,${b64(path.join(FONTS, `source-sans-3-latin-${w}-normal.woff2`))}) format("woff2")}`;
  const part = (k, t, img) => `<div class="k">${k}</div><p>${t}</p><img src="data:image/png;base64,${img}">`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${font(400)}${font(700)}
body{margin:0;font-family:"Source Sans 3",sans-serif;color:#1C1C1C;background:#fff}.bar{height:10px;background:#EB1000}main{padding:30px 44px 40px;width:1500px}
h1{font-size:34px;margin:0 0 18px}.k{font-size:15px;font-weight:700;letter-spacing:2px;color:#B30B00;text-transform:uppercase;margin-top:26px}p{font-size:20px;line-height:28px;margin:4px 0 12px}img{width:100%;display:block;border:1.5px solid #1C1C1C}
</style></head><body><div class="bar"></div><main><h1>A very long line: proposal for Adam's yes, nothing built</h1>
${part('1. Today', 'A 1,500-word line fills the list and pushes its answer off the screen.', today)}
${part('2. Proposed', 'A line longer than about 60 words is shown short, with Show all, in the list and above the answer. The answer is back in view, and a note says what to do about it.', proposed)}
</main></body></html>`;
  if (/[–—]/.test(html.replace(/data:[^"')]+/g, ''))) throw new Error('a dash in the page');
  const pg = await p.context().newPage(); await pg.setViewportSize({width: 1588, height: 900}); await pg.setContent(html); await pg.waitForTimeout(400);
  await pg.screenshot({path: path.join(__dirname, 'long_row.png'), fullPage: true}); console.log('written'); await h.close(); })().catch(e => { console.error(e); process.exit(1); });
