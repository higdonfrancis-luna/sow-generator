// Mockup only (Nov 10 2026, Adam on the RFI Builder's summary bar: "There's a lot going on here", then "when answers are not
// chosen why don't we just create without them"). Draws the bar as it is today and as proposed (Shorter answers and the
// client's name behind one Options link; the drafts tick box gone) by changing the page in the browser only: nothing in the
// tool is changed.
//   node sow/mockups/nov10_summary_options/mock.js     writes summary_options.png
const path = require('path'), fs = require('fs');
const {open} = require(path.join(__dirname, '..', '..', 'rfp_prototype', 'review_2026-11-09', 'harness.js'));
(async () => { const h = await open({scale: 2}), p = h.page;
  await h.file(path.join(__dirname, '..', '..', 'rfp_prototype', 'try', 'Northbridge_Mutual_Bank_RFP_2026.xlsx'));
  const iOf = l => h.eval(l => RFPBuilder.state.questions.findIndex(q => q.label === l), l);
  const use = async ls => { for (const l of ls) { await h.select(await iOf(l)); await p.click('#rfp-use'); await p.waitForTimeout(120); } };
  const shot = async () => (await (await p.$('#rfp-summary')).screenshot()).toString('base64');
  const draw = isOpen => p.evaluate(isOpen => { const el = document.getElementById('rfp-summary'), acts = el.querySelector('.rfp-actions');
    const TAG = 'background:#1C1C1C;color:#fff;font-weight:700;font-size:15px;line-height:20px;border-radius:6px;padding:6px 12px';   // black tags are notes on the picture, not part of the tool
    const labs = [...el.querySelectorAll('.rfp-include, .rfp-client')], box = document.createElement('div'); box.style.cssText = 'margin-top:22px;padding:14px 16px;border:2px dashed #1C1C1C;border-radius:10px';
    labs[0].remove();   // the drafts tick box goes: answers not chosen are left out of the downloads
    labs[1].querySelector('span').textContent = 'Shorter answers, about 170 words each'; labs[1].style.margin = '10px 0 10px'; labs[2].style.margin = '0';
    const t2 = document.createElement('span'); t2.style.cssText = TAG + ';display:inline-block'; t2.textContent = 'After the click: these two settings appear here'; box.append(t2, labs[1], labs[2]);
    acts.insertAdjacentElement('afterend', box); box.hidden = !isOpen;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'rfp-link'; b.style.cssText = 'margin-left:6px;align-self:center'; b.textContent = 'Options'; acts.appendChild(b);
    if (!isOpen) { const arrow = document.createElement('span'); arrow.style.cssText = 'align-self:center;margin-left:14px;width:0;height:0;border:9px solid transparent;border-right-color:#1C1C1C;border-left:0';
      const t1 = document.createElement('span'); t1.style.cssText = TAG + ';align-self:center'; t1.textContent = 'New link. A click shows two settings'; acts.append(arrow, t1); } }, isOpen);
  await use(['2.1', '2.2', '2.3', '2.4', '2.5']); await draw(false); await p.evaluate(() => document.querySelectorAll('#rfp-summary .rfp-actions > span').forEach(x => x.remove())); const some = await shot();
  await use(['2.6', '2.7', '2.8']); const today = await shot();
  await draw(false); const closed = await shot();
  await h.select(await iOf('2.1')); await p.click('#rfp-use'); await p.waitForTimeout(120); await p.click('#rfp-use'); await p.waitForTimeout(120);   // off and on again: the bar is drawn afresh
  await draw(true); const opened = await shot();
  const FONTS = path.join(__dirname, '..', '..', '..', 'video', 'fonts'), b64 = f => fs.readFileSync(f).toString('base64');
  const font = w => `@font-face{font-family:"Source Sans 3";font-weight:${w};src:url(data:font/woff2;base64,${b64(path.join(FONTS, `source-sans-3-latin-${w}-normal.woff2`))}) format("woff2")}`;
  const part = (k, t, img) => `<div class="k">${k}</div><p>${t}</p><img src="data:image/png;base64,${img}">`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${font(400)}${font(700)}
body{margin:0;font-family:"Source Sans 3",sans-serif;color:#1C1C1C;background:#fff}.bar{height:10px;background:#EB1000}main{padding:30px 44px 40px;width:1500px}
h1{font-size:34px;margin:0 0 22px}.k{font-size:15px;font-weight:700;letter-spacing:2px;color:#B30B00;text-transform:uppercase;margin-top:26px}p{font-size:20px;line-height:28px;margin:4px 0 12px}img{width:100%;display:block}
</style></head><body><div class="bar"></div><main><h1>RFI Builder summary bar: proposal for Adam's yes, nothing built</h1>
${part('1. Today', 'The count, three settings, two buttons and two links, all at once.', today)}
${part('2. Proposed: what a partner sees', 'The count, the red button, Download, and one new link, Options. No tick boxes and no name box.', closed)}
${part('3. Proposed: after a click on Options', 'The two settings open under the buttons. Another click closes them. (The dashed box and black tags are notes on this picture only.)', opened)}
${part('4. Proposed: when some answers are not chosen', 'The downloads leave them out, and the bar says which ones. No tick box: a partner adds them by hand, or marks them "Use this answer".', some)}
</main></body></html>`;
  if (/[–—]/.test(html.replace(/data:[^"')]+/g, ''))) throw new Error('a dash in the page');
  const pg = await p.context().newPage(); await pg.setViewportSize({width: 1588, height: 900}); await pg.setContent(html); await pg.waitForTimeout(400);
  await pg.screenshot({path: path.join(__dirname, 'summary_options.png'), fullPage: true});
  console.log('written'); await h.close(); })().catch(e => { console.error(e); process.exit(1); });
