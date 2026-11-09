// Cluster c7_state, follow-ups 2: the answer panel after a pile change on the open row (stale panel), and Start over's
// Clear everything (does it take the RFP list with it). Run:
// node /home/user/warroom/sow/rfp_prototype/review_2026-11-09/verification/c7_state/extras2_c7.js
const fs = require('fs'), path = require('path');
const {open} = require('/home/user/warroom/sow/rfp_prototype/review_2026-11-09/harness.js');
const HERE = __dirname;
const XLSX = '/home/user/warroom/sow/qa/rfp_fixtures/bank_rfp.xlsx';
const out = {};
const log = (k, v) => { out[k] = v; console.log('\n[' + k + '] ' + JSON.stringify(v, null, 1).slice(0, 4000)); };

(async () => {
  const h = await open();
  const page = h.page;
  const dialogs = [];
  page.on('dialog', d => { dialogs.push({type: d.type(), message: d.message()}); d.dismiss().catch(() => {}); });
  const base = await h.file(XLSX);
  const idx = lab => base.questions.find(q => q.label === lab).i;

  // ---------- extra: the open row's pile is changed; the panel keeps the old answer; what the stale buttons then do
  {
    const i = idx('2.2'); await h.select(i); await page.click('#rfp-use'); await page.waitForTimeout(60);
    await page.selectOption(`#rfp-questions li[data-i="${i}"] select.rfp-kind`, 'firm'); await page.waitForTimeout(80);
    const stale = await page.evaluate(i => { const q = RFPBuilder.state.questions[i]; return {kind: q.kind, status: q.status || null, draft: !!q.draft, panelHead: document.querySelector('#rfp-answer h3').textContent.slice(0, 60), panelBadge: (document.querySelector('#rfp-answer .rfp-state') || {}).textContent || null, panelButtons: [...document.querySelectorAll('#rfp-answer button')].map(b => b.id), panelHasFirmTextarea: !!document.getElementById('rfp-firm')}; }, i);
    await page.click('#rfp-skip'); await page.waitForTimeout(80);
    const afterSkipOnStale = await page.evaluate(i => { const q = RFPBuilder.state.questions[i]; return {kind: q.kind, status: q.status || null, listBadge: (document.querySelector(`#rfp-questions li[data-i="${i}"] .rfp-state`) || {}).textContent || null, panelNow: document.getElementById('rfp-answer').textContent.slice(0, 140), summary: document.getElementById('rfp-summary').textContent.slice(0, 120)}; }, i);
    const doc = await h.doc(); const sec = /<section><h3>2\.2 [\s\S]*?<\/section>/.exec(doc);
    log('X_stale_panel', {afterPileChange: stale, afterSkipOnStalePanel: afterSkipOnStale, responseSection22: sec ? sec[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200) : null});
    await page.selectOption(`#rfp-questions li[data-i="${i}"] select.rfp-kind`, 'adobe'); await page.waitForTimeout(80);
  }
  // ---------- extra: Start over, Clear everything (navigates, so last)
  {
    await h.select(idx('2.2')); await page.click('#rfp-use'); await page.waitForTimeout(60);
    const before = await page.evaluate(() => ({questions: RFPBuilder.state.questions.length, used: RFPBuilder.state.questions.filter(q => q.status === 'used').length}));
    await page.click('#start-over'); await page.waitForTimeout(150);
    const modalText = await page.evaluate(() => (document.querySelector('.modal:not([hidden])') || {}).textContent);
    const [nav] = await Promise.all([page.waitForNavigation({timeout: 10000}).catch(() => null), page.click('#start-over-confirm')]);
    await page.waitForTimeout(400);
    const after = await page.evaluate(() => ({url: location.href, questions: typeof RFPBuilder !== 'undefined' ? RFPBuilder.state.questions.length : null}));
    log('X_start_over_confirm', {before, modalText, mentionsRFP: /RFP/.test(modalText || ''), navigated: !!nav, after, dialogs});
  }
  fs.writeFileSync(path.join(HERE, 'out_C7_extras2.json'), JSON.stringify({errors: h.errors, dialogs, results: out}, null, 1));
  console.log('\npage errors:', JSON.stringify(h.errors));
  await h.close();
})().catch(e => { console.error(e); process.exit(1); });
