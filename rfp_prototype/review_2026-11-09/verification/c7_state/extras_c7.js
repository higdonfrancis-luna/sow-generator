// Cluster c7_state, follow-ups: the hand-off payload as toSow writes it (captured before applyHandoff consumes the key),
// the real Excel download, and the Change play button. Run after run_c7.js:
// node /home/user/warroom/sow/rfp_prototype/review_2026-11-09/verification/c7_state/extras_c7.js
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
  // record every localStorage write, so the hand-off payload is seen as written even though applyHandoff removes the key
  await page.evaluate(() => { window.__writes = []; const s = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (this === localStorage) window.__writes.push({key: k, value: v}); return s.call(this, k, v); }; });
  const base = await h.file(XLSX);
  const idx = lab => base.questions.find(q => q.label === lab).i;

  // ---------- C7.4 follow-up: the edited 2.2 text, then Add to my statement of work; what the hand-off carried
  {
    const i = idx('2.2'); await h.select(i);
    await page.click('#rfp-edit-btn'); await page.fill('#rfp-edit', 'We will connect your CJA data to AI assistant traffic.'); await page.click('#rfp-save-edit'); await page.waitForTimeout(80);
    await page.evaluate(() => { window.__writes = []; });
    await page.click('#rfp-to-sow'); await page.waitForTimeout(300);
    const writes = await page.evaluate(() => window.__writes.map(w => ({key: w.key, value: w.value})));
    const hand = writes.find(w => w.key === 'abv-sow-handoff'); const hj = hand ? JSON.parse(hand.value) : null;
    const canvasWrite = writes.find(w => w.key === 'abv-sow-build-v1'); const cj = canvasWrite ? JSON.parse(canvasWrite.value) : null;
    log('C7.4_handoff_payload', {keysWrittenInOrder: writes.map(w => w.key), handoff: hj ? {v: hj.v, play: hj.play, fresh: hj.fresh, size: hj.size, rate: hj.rate, products: hj.products, names: hj.names, outside: hj.outside, linesOn: hj.lines.filter(l => l.on).map(l => l.id + ' ' + l.name), linesTotal: hj.lines.length, managed: hj.managed.length} : null,
      firstCanvasWrite: cj ? {play: cj.play, on: cj.on, out: cj.out, lsOn: Object.entries(cj.ls).filter(x => x[1]).map(x => x[0]), fresh: cj.fresh, rate: cj.rate, size: cj.size, recover: cj.recover} : null,
      answerText: await page.evaluate(i => RFPBuilder.state.questions[i].answer, i), draftLines: await page.evaluate(i => RFPBuilder.state.questions[i].draft.m.lines, i),
      handoffKeyAfter: await page.evaluate(() => localStorage.getItem('abv-sow-handoff')), sowServicesOn: await page.evaluate(() => Object.entries(state.estimates.custom || {}).filter(([k, v]) => v.on).map(([k]) => k))});
  }
  // ---------- C7.9 follow-up: the real workbook from Download response as Excel
  {
    await page.click('[data-step="rfp"]'); await page.waitForTimeout(100);
    await h.setStatus(idx('2.4'), 'skipped');
    const [dl] = await Promise.all([page.waitForEvent('download', {timeout: 20000}), page.click('#rfp-download-xlsx')]);
    const file = path.join(HERE, 'out_C7.9_response.xlsx'); await dl.saveAs(file);
    log('C7.9_xlsx_download', {suggestedFilename: dl.suggestedFilename(), bytes: fs.statSync(file).size, savedAs: file});
  }
  // ---------- extra: Change play in the topbar (same navigation as Build?)
  {
    const info = await page.evaluate(() => { const b = document.querySelector('.topbar [data-build]'); return {text: b.textContent, attrs: [...b.attributes].map(a => a.name + (a.value ? '=' + a.value : '')), resolves: new URL('../index.html?change=play', location.href).href, questionsBefore: RFPBuilder.state.questions.length}; });
    const [nav] = await Promise.all([page.waitForNavigation({timeout: 10000}).catch(() => null), page.click('.topbar [data-build]')]);
    await page.waitForTimeout(400);
    const after = await page.evaluate(() => ({url: location.href, questions: typeof RFPBuilder !== 'undefined' ? RFPBuilder.state.questions.length : null}));
    log('X_change_play', {button: info, navigated: !!nav, after, dialogs});
  }
  fs.writeFileSync(path.join(HERE, 'out_C7_extras.json'), JSON.stringify({errors: h.errors, dialogs, results: out}, null, 1));
  console.log('\npage errors:', JSON.stringify(h.errors));
  await h.close();
})().catch(e => { console.error(e); process.exit(1); });
