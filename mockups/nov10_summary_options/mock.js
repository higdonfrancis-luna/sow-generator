// Mockup only (Nov 10 2026, Adam on the RFI Builder's summary bar: "There's a lot going on here"). Draws the bar as it is
// today and as proposed (the three settings behind one Options button, closed until asked for) by changing the page in the
// browser only: nothing in the tool is changed.
//   node sow/mockups/nov10_summary_options/mock.js     writes summary_options.png
const path = require('path'), fs = require('fs');
const {open} = require(path.join(__dirname, '..', '..', 'rfp_prototype', 'review_2026-11-09', 'harness.js'));
(async () => { const h = await open({scale: 2}), p = h.page;
  await h.file(path.join(__dirname, '..', '..', 'rfp_prototype', 'try', 'Northbridge_Mutual_Bank_RFP_2026.xlsx'));
  const iOf = l => h.eval(l => RFPBuilder.state.questions.findIndex(q => q.label === l), l);
  for (const l of ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8']) { await h.select(await iOf(l)); await p.click('#rfp-use'); await p.waitForTimeout(120); }
  const shot = async () => (await (await p.$('#rfp-summary')).screenshot()).toString('base64');
  const today = await shot();
  const draw = (isOpen, on) => p.evaluate(([isOpen, on]) => { const el = document.getElementById('rfp-summary'), acts = el.querySelector('.rfp-actions');
    let box = document.getElementById('mock-opts');
    if (!box) { box = document.createElement('div'); box.id = 'mock-opts'; box.style.cssText = 'border-top:1px solid #D5D5D5;margin-top:16px;padding-top:14px';
      const labs = [...el.querySelectorAll('.rfp-include, .rfp-client')];
      labs[0].querySelector('span').textContent = 'Include the answers I have not chosen, marked as drafts';
      labs[1].querySelector('span').textContent = 'Shorter answers, about 170 words each';
      labs.forEach(l => { l.style.margin = '0 0 10px'; box.appendChild(l); }); labs[2].style.margin = '0';
      box.insertBefore(labs[1], labs[0]); acts.insertAdjacentElement('afterend', box);
      const b = document.createElement('button'); b.type = 'button'; b.id = 'mock-opt-btn'; b.className = 'rfp-link'; b.style.cssText = 'margin-left:6px;align-self:center'; acts.appendChild(b); }
    box.hidden = !isOpen; document.getElementById('rfp-shorter').checked = on;
    document.getElementById('mock-opt-btn').textContent = 'Options' + (on ? ' (1 on)' : ''); }, [isOpen, on]);
  await draw(false, false); const closed = await shot();
  await draw(true, true); const opened = await shot();
  const FONTS = path.join(__dirname, '..', '..', '..', 'video', 'fonts'), b64 = f => fs.readFileSync(f).toString('base64');
  const font = w => `@font-face{font-family:"Source Sans 3";font-weight:${w};src:url(data:font/woff2;base64,${b64(path.join(FONTS, `source-sans-3-latin-${w}-normal.woff2`))}) format("woff2")}`;
  const part = (k, t, img) => `<div class="k">${k}</div><p>${t}</p><img src="data:image/png;base64,${img}">`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${font(400)}${font(700)}
body{margin:0;font-family:"Source Sans 3",sans-serif;color:#1C1C1C;background:#fff}.bar{height:10px;background:#EB1000}main{padding:30px 44px 40px;width:1500px}
h1{font-size:34px;margin:0 0 22px}.k{font-size:15px;font-weight:700;letter-spacing:2px;color:#B30B00;text-transform:uppercase;margin-top:26px}p{font-size:20px;line-height:28px;margin:4px 0 12px}img{width:100%;display:block}
</style></head><body><div class="bar"></div><main><h1>RFI Builder summary bar: proposal for Adam's yes, nothing built</h1>
${part('Today', 'The count, three settings, two buttons and two links, all at once.', today)}
${part('Proposed', 'The count, the red button and Download. The three settings wait behind one Options link.', closed)}
${part('Proposed, Options opened', 'A click on Options shows the settings. The link says how many are on, so a ticked setting is never forgotten.', opened)}
</main></body></html>`;
  if (/[–—]/.test(html.replace(/data:[^"')]+/g, ''))) throw new Error('a dash in the page');
  const pg = await p.context().newPage(); await pg.setViewportSize({width: 1588, height: 900}); await pg.setContent(html); await pg.waitForTimeout(400);
  await pg.screenshot({path: path.join(__dirname, 'summary_options.png'), fullPage: true});
  console.log('written'); await h.close(); })().catch(e => { console.error(e); process.exit(1); });
