// Mockup only (Nov 11 2026, Adam on the RFI Builder after trying Read with AI on Proto: replace the intro with one plain
// sentence, put the AI button and Start over where the "Your call" box is, make the button much more visible, and call it
// something like "Build Answers with AI"). Drawn by changing the page in the browser only: nothing in the tool is changed.
//   node sow/mockups/nov11_ai_reading/layout_mock.js <path to an RFP PDF>     writes ai_layout.png
const path = require('path'), fs = require('fs');
const {open} = require(path.join(__dirname, '..', '..', 'rfp_prototype', 'review_2026-11-09', 'harness.js'));
(async () => { const h = await open({scale: 2}), p = h.page; await h.file(path.resolve(process.argv[2]));
  const top = async () => { await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(200); return (await p.screenshot({clip: {x: 0, y: 0, width: 1500, height: 760}})).toString('base64'); };
  const today = await top();
  await p.evaluate(() => { const intro = document.querySelector('#rfp-panel .section-intro p') || document.querySelector('#rfp-panel .section-intro');
    intro.textContent = 'The answers provided are suggested drafts, drawn from Adobe’s public documentation. Review every suggestion provided for accuracy.';
    const call = document.querySelector('#rfp-results .rfp-your-call'), ai = document.getElementById('rfp-ai'), clear = document.getElementById('rfp-clear');
    const row = document.createElement('div'); row.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin:6px 0 4px';
    ai.textContent = 'Build Answers with AI'; ai.className = 'primary'; ai.style.cssText = 'margin:0;font-size:17px;padding:12px 26px;min-height:48px;border-color:#EB1000;background:#EB1000;color:#fff';
    clear.style.cssText = 'margin:0;min-height:48px';
    row.append(ai, clear); call.replaceWith(row);
    const note = document.createElement('p'); note.style.cssText = 'margin:0 0 14px;font-size:14.5px;color:#1C1C1C'; note.textContent = 'Sends this RFI’s text to an AI model to find what it asks for. Takes about a minute.'; row.insertAdjacentElement('afterend', note); });
  const proposed = await top();
  await p.evaluate(() => { const ai = document.getElementById('rfp-ai'); ai.textContent = 'Reading with AI… 0:32'; ai.style.background = '#fff'; ai.style.color = '#1C1C1C'; ai.style.borderColor = '#1C1C1C'; });
  const busy = (await p.screenshot({clip: {x: 0, y: 380, width: 1500, height: 200}})).toString('base64');
  const FONTS = path.join(__dirname, '..', '..', '..', 'video', 'fonts'), b64 = f => fs.readFileSync(f).toString('base64');
  const font = w => `@font-face{font-family:"Source Sans 3";font-weight:${w};src:url(data:font/woff2;base64,${b64(path.join(FONTS, `source-sans-3-latin-${w}-normal.woff2`))}) format("woff2")}`;
  const part = (k, t, img) => `<div class="k">${k}</div><p>${t}</p><img src="data:image/png;base64,${img}">`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${font(400)}${font(700)}
body{margin:0;font-family:"Source Sans 3",sans-serif;color:#1C1C1C;background:#fff}.bar{height:10px;background:#EB1000}main{padding:30px 44px 40px;width:1500px}
h1{font-size:34px;margin:0 0 18px}.k{font-size:15px;font-weight:700;letter-spacing:2px;color:#B30B00;text-transform:uppercase;margin-top:26px}p{font-size:20px;line-height:28px;margin:4px 0 12px}img{width:100%;display:block;border:1.5px solid #1C1C1C}
</style></head><body><div class="bar"></div><main><h1>The RFI Builder's top: proposal for Adam's yes, nothing built</h1>
${part('1. Today', 'A long intro, the Your call box, and Read with AI at the far right of the filters.', today)}
${part('2. Proposed', 'Your one sentence as the intro. Where the Your call box was: a big red Build Answers with AI button, with Start over beside it. One small line under it says what it sends and how long it takes.', proposed)}
${part('3. While it reads', 'The button counts the seconds, so a partner can see it is working.', busy)}
</main></body></html>`;
  if (/[–—]/.test(html.replace(/data:[^"')]+/g, ''))) throw new Error('a dash in the page');
  const pg = await p.context().newPage(); await pg.setViewportSize({width: 1588, height: 900}); await pg.setContent(html); await pg.waitForTimeout(400);
  await pg.screenshot({path: path.join(__dirname, 'ai_layout.png'), fullPage: true}); console.log('written'); await h.close(); })().catch(e => { console.error(e); process.exit(1); });
