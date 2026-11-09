// C7.9 retry: the real Excel download, with console errors recorded. node c79_retry.js
const fs = require('fs'), path = require('path');
const {open} = require('/home/user/warroom/sow/rfp_prototype/review_2026-11-09/harness.js');
const HERE = __dirname, QA = '/home/user/warroom/sow/qa/rfp_fixtures';
(async () => {
  const h = await open(); const page = h.page; const logs = [];
  page.on('console', m => logs.push(m.type() + ': ' + m.text().slice(0, 200)));
  const r = await h.file(path.join(QA, 'bank_rfp.xlsx'));
  const idx = l => r.questions.findIndex(q => q.label === l);
  await h.setStatus(idx('2.2'), 'used'); await h.setStatus(idx('2.4'), 'skipped'); await h.setAnswer(idx('1.1'), 'We are a 40-person firm.');
  const rows = await h.rows();
  const btn = await page.evaluate(() => { const b = document.getElementById('rfp-download-xlsx'); return b ? {hidden: b.closest('[hidden]') !== null, text: b.textContent} : null; });
  const [dl] = await Promise.all([page.waitForEvent('download', {timeout: 60000}), page.click('#rfp-download-xlsx')]);
  const file = path.join(HERE, 'out_C7.9_response.xlsx'); await dl.saveAs(file);
  const out = {button: btn, header: rows.rows[0], columns: rows.rows[0].length, statuses: [...new Set(rows.rows.slice(1).map(x => x[3]))], srcHeader: rows.srcs[0], nrows: rows.rows.length, nsrcs: rows.srcs.length, suggested: dl.suggestedFilename(), bytes: fs.statSync(file).size,
    code: await h.eval(() => { const src = document.getElementById('rfp-answers').textContent; return (src.match(/const rows=\[\[[^\]]*\]\],srcs=\[\[[^\]]*\]\]/) || [''])[0]; }), consoleLogs: logs.slice(0, 10), pageErrors: h.errors};
  fs.writeFileSync(path.join(HERE, 'out_C7.9.json'), JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1));
  await h.close();
})().catch(e => { console.error(e); process.exit(1); });
