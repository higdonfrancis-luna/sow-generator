// Mockup only (Nov 10 2026, Adam: "What happens when you go to the three that are left ... the six that are left"). Shows the
// RFI Builder after a click on each proposed link, by changing the page in the browser only: nothing in the tool is changed.
//   node sow/mockups/nov10_summary_options/after_click.js     writes after_click.png
const path = require('path'), fs = require('fs');
const {open} = require(path.join(__dirname, '..', '..', 'rfp_prototype', 'review_2026-11-09', 'harness.js'));
(async () => { const h = await open({scale: 2}), p = h.page;
  await h.file(path.join(__dirname, '..', '..', 'rfp_prototype', 'try', 'Northbridge_Mutual_Bank_RFP_2026.xlsx'));
  const iOf = l => h.eval(l => RFPBuilder.state.questions.findIndex(q => q.label === l), l);
  for (const l of ['2.1', '2.2', '2.3', '2.4', '2.5']) { await h.select(await iOf(l)); await p.click('#rfp-use'); await p.waitForTimeout(120); }
  const show = async (kind, first, n, what) => { await p.click('[data-rfp-filter="review"]'); await p.waitForTimeout(150); await h.select(await iOf(first));
    await p.evaluate(([kind, n, what]) => { const qs = RFPBuilder.state.questions;
      document.querySelectorAll('#rfp-questions li[data-i]').forEach(li => { if (qs[+li.dataset.i].kind !== kind) li.remove(); });
      document.querySelectorAll('[data-rfp-filter]').forEach(b => b.setAttribute('aria-pressed', 'false'));
      const f = document.querySelector('.rfp-filters'), old = document.getElementById('mock-left'); if (old) old.remove();
      const t = document.createElement('p'); t.id = 'mock-left'; t.style.cssText = 'margin:10px 0 0;font-size:15.5px;font-weight:700;color:#1C1C1C';
      t.innerHTML = 'Showing the ' + n + ' ' + what + ' that are left. <button type="button" class="rfp-link" style="margin-left:8px">Show all questions</button>'; f.insertAdjacentElement('afterend', t);
      document.getElementById('rfp-summary').hidden = true;   // the bar has its own picture, summary_options.png
      document.getElementById('rfp-results').scrollIntoView({block: 'start'}); window.scrollBy(0, -16); }, [kind, n, what]);
    await p.waitForTimeout(200); return (await p.screenshot()).toString('base64'); };
  const adobe = await show('adobe', '2.6', 3, 'Adobe product questions'), firm = await show('firm', '1.1', 6, 'questions about your firm');
  const FONTS = path.join(__dirname, '..', '..', '..', 'video', 'fonts'), b64 = f => fs.readFileSync(f).toString('base64');
  const font = w => `@font-face{font-family:"Source Sans 3";font-weight:${w};src:url(data:font/woff2;base64,${b64(path.join(FONTS, `source-sans-3-latin-${w}-normal.woff2`))}) format("woff2")}`;
  const part = (k, t, img) => `<div class="k">${k}</div><p>${t}</p><img src="data:image/png;base64,${img}">`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${font(400)}${font(700)}
body{margin:0;font-family:"Source Sans 3",sans-serif;color:#1C1C1C;background:#fff}.bar{height:10px;background:#EB1000}main{padding:30px 44px 40px;width:1500px}
h1{font-size:34px;margin:0 0 22px}.k{font-size:15px;font-weight:700;letter-spacing:2px;color:#B30B00;text-transform:uppercase;margin-top:26px}p{font-size:20px;line-height:28px;margin:4px 0 12px}img{width:100%;display:block;border:1.5px solid #1C1C1C}
</style></head><body><div class="bar"></div><main><h1>After a click on a "Go to the ones that are left" link: proposal, nothing built</h1>
${part('After "Go to the 3 that are left"', 'You stay in the RFI Builder. The list shows only the three Adobe questions, and the first one is open with its drafted answer. Use this answer, then Next to review.', adobe)}
${part('After "Go to the 6 that are left"', 'The list shows only the six questions about your firm, and the first one is open with a box to write in.', firm)}
</main></body></html>`;
  if (/[–—]/.test(html.replace(/data:[^"')]+/g, ''))) throw new Error('a dash in the page');
  const pg = await p.context().newPage(); await pg.setViewportSize({width: 1588, height: 900}); await pg.setContent(html); await pg.waitForTimeout(400);
  await pg.screenshot({path: path.join(__dirname, 'after_click.png'), fullPage: true});
  console.log('written'); await h.close(); })().catch(e => { console.error(e); process.exit(1); });
