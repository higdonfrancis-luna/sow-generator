// The RFP Builder's summary bar (Nov 9 2026, Adam: "the big red button and the download and that is it", from
// sow/mockups/summary_bar/summary_bar.png). Run from the repo root after python3 sow/rfp_prototype/build.py:
//   node sow/test_rfp_summary_bar.js
// Checks that the bar shows the red button and one Download menu, with Save my work and Open my work as links; that the menu
// holds the four downloads (the client's own workbook only when there is one), opens and closes by click, choice, a click
// elsewhere and Escape; and that the checklist is named as the partner's own.
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
const FIX = __dirname + '/qa/rfp_fixtures';
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 400) + ']')); if (!c) fails++; };
(async () => {
  const h = await open(), p = h.page;
  await h.file(FIX + '/bank_rfp.xlsx');
  const visible = () => p.$$eval('#rfp-summary .rfp-actions > button, #rfp-summary .rfp-actions > .rfp-dl > button', b => b.filter(x => x.offsetParent).map(x => x.textContent.trim()));
  ok((await visible()).join('|') === 'Add to my statement of work|Download ▾', 'the bar shows two buttons: the red Add to my statement of work and Download', (await visible()).join('|'));
  ok(await p.$eval('#rfp-to-sow', b => b.classList.contains('primary')), 'Add to my statement of work is the red button');
  ok(await p.isVisible('#rfp-save-work') && await p.isVisible('#rfp-open-work') && await p.$eval('#rfp-save-work', b => b.classList.contains('rfp-link')) && await p.$eval('#rfp-open-work', b => b.classList.contains('rfp-link')), 'Save my work and Open my work are links beside the counts');
  ok(await p.isHidden('#rfp-dl-menu') && await p.getAttribute('#rfp-download-menu', 'aria-expanded') === 'false', 'the Download menu starts closed');
  await p.click('#rfp-download-menu');
  const items = await p.$$eval('#rfp-dl-menu button', b => b.map(x => x.id + ':' + x.querySelector('b').textContent));
  ok(await p.isVisible('#rfp-dl-menu') && await p.getAttribute('#rfp-download-menu', 'aria-expanded') === 'true' && items.join('|') === 'rfp-writeback:Your answers in bank_rfp.xlsx|rfp-download:Response document|rfp-download-xlsx:Response as a new Excel|rfp-download-asks:My checklist (for you, not the client)', 'the menu opens with the four downloads, the client\'s own workbook first', items.join('|'));
  ok(/Values only: its formatting is not kept/.test(await p.textContent('#rfp-writeback')) && /Vendor response column/.test(await p.textContent('#rfp-writeback')), 'the workbook choice says which column it fills and that only values are kept');
  ok(await p.evaluate(() => document.activeElement && document.activeElement.id === 'rfp-writeback'), 'the first choice takes the keyboard focus when the menu opens');
  await p.keyboard.press('Escape');
  ok(await p.isHidden('#rfp-dl-menu') && await p.evaluate(() => document.activeElement && document.activeElement.id === 'rfp-download-menu'), 'Escape closes the menu and returns the focus to Download');
  await p.click('#rfp-download-menu'); await p.click('#rfp-summary p');
  ok(await p.isHidden('#rfp-dl-menu'), 'a click elsewhere closes the menu');
  await p.click('#rfp-download-menu'); await p.click('#rfp-download-menu');
  ok(await p.isHidden('#rfp-dl-menu'), 'Download opens and closes the menu');
  await p.click('#rfp-download-menu');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#rfp-download-asks')]);
  await p.waitForTimeout(100);
  ok(/-checklist\.html$/.test(dl.suggestedFilename()) && await p.isHidden('#rfp-dl-menu'), 'choosing My checklist downloads it, named as a checklist, and closes the menu', dl.suggestedFilename());
  await p.click('#rfp-download-menu');
  await Promise.all([p.waitForEvent('download'), p.click('#rfp-download-asks span')]);
  ok(true, 'a click on a choice\'s small print runs that choice too');
  ok(!/questions for your client/i.test(await p.textContent('#rfp-panel')) && !await p.$('.rfp-wb-note'), 'no "questions for your client" button and no separate note under the buttons');
  await h.file(FIX + '/mfg_rfp.pdf');
  await p.click('#rfp-download-menu');
  ok((await p.$$eval('#rfp-dl-menu button', b => b.map(x => x.id))).join() === 'rfp-download,rfp-download-xlsx,rfp-download-asks', 'a PDF RFP has no client workbook, so the menu holds three downloads');
  await p.setViewportSize({width: 390, height: 800}); await p.waitForTimeout(150);
  const wide = await p.evaluate(() => { const r = document.getElementById('rfp-dl-menu').getBoundingClientRect(); return r.right <= window.innerWidth + 1; });
  ok(wide, 'on a phone the open menu fits the screen');
  ok(h.errors.length === 0, 'no script errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `${fails} SUMMARY BAR CHECK(S) FAILED` : 'ALL SUMMARY BAR CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
