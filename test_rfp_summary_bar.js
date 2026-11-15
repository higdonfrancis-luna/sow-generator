// The RFP Builder's summary bar (Nov 9 2026, Adam: "the big red button and the download and that is it", from
// sow/mockups/summary_bar/summary_bar.png). Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_summary_bar.js
// Checks that the bar shows the red button and one Download menu, with Save my work and Open my work as links; that the menu
// holds the Word proposal and Excel checklist, plus the client's own workbook when available, and closes by choice, a click
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
  // Round 6 keeps one client proposal and the partner checklist. Spreadsheet uploads also keep the client workbook.
  const items = await p.$$eval('#rfp-dl-menu button', bs => bs.map(b => b.querySelector('b').textContent));
  ok(await p.isVisible('#rfp-dl-menu') && await p.getAttribute('#rfp-download-menu', 'aria-expanded') === 'true' && items.join('|') === 'Full proposal, in Word|Your filled-in workbook, in Excel|My checklist, in Excel', 'the workbook menu shows the three approved downloads in order', items.join('|'));
  ok((await p.locator('#rfp-writeback span').textContent()) === "Your answers written back into the client's own workbook.", 'the workbook choice describes writing into the client workbook');
  ok(await p.evaluate(() => document.activeElement?.id === 'rfp-download-proposal'), 'the first choice takes the keyboard focus when the menu opens');
  await p.keyboard.press('Escape');
  ok(await p.isHidden('#rfp-dl-menu') && await p.evaluate(() => document.activeElement && document.activeElement.id === 'rfp-download-menu'), 'Escape closes the menu and returns the focus to Download');
  await p.click('#rfp-download-menu'); await p.click('#rfp-summary p');
  ok(await p.isHidden('#rfp-dl-menu'), 'a click elsewhere closes the menu');
  await p.click('#rfp-download-menu'); await p.click('#rfp-download-menu');
  ok(await p.isHidden('#rfp-dl-menu'), 'Download opens and closes the menu');
  await p.click('#rfp-download-menu');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.locator('#rfp-dl-menu button').filter({hasText:'My checklist, in Excel'}).click()]);
  await p.waitForTimeout(100);
  ok(/-checklist\.xlsx$/.test(dl.suggestedFilename()) && await p.isHidden('#rfp-dl-menu'), 'choosing My checklist downloads it, named as a checklist, and closes the menu', dl.suggestedFilename());
  await p.click('#rfp-download-menu');
  await Promise.all([p.waitForEvent('download'), p.locator('#rfp-dl-menu button').filter({hasText:'My checklist, in Excel'}).locator('span').click()]);
  ok(true, 'a click on a choice\'s small print runs that choice too');
  ok(!/questions for your client/i.test(await p.textContent('#rfp-panel')) && !await p.$('.rfp-wb-note'), 'no "questions for your client" button and no separate note under the buttons');
  await h.file(FIX + '/mfg_rfp.pdf');
  await p.click('#rfp-download-menu');
  ok((await p.$$eval('#rfp-dl-menu button b', bs => bs.map(b => b.textContent))).join('|') === 'Full proposal, in Word|My checklist, in Excel', 'the PDF menu offers Word and the partner checklist');
  await p.setViewportSize({width: 390, height: 800}); await p.waitForTimeout(150);
  const wide = await p.evaluate(() => { const r = document.getElementById('rfp-dl-menu').getBoundingClientRect(); return r.right <= window.innerWidth + 1; });
  ok(wide, 'on a phone the open menu fits the screen');
  ok(h.errors.length === 0, 'no script errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `${fails} SUMMARY BAR CHECK(S) FAILED` : 'ALL SUMMARY BAR CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
