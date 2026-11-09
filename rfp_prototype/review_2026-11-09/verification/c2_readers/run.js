// Cluster c2_readers: drives the shipped page through the harness and records exact outputs per claim.
// node run.js   (writes out/*.json). Raw reader text comes from the page's own readPdf/readSheet/readDocx,
// copied verbatim out of the built index.html and run in the page against the same File (labelled "raw" below).
const {open} = require('/home/user/warroom/sow/rfp_prototype/review_2026-11-09/harness.js');
const fs = require('fs'), path = require('path');
const HERE = __dirname, FX = path.join(HERE, 'fixtures'), OUT = path.join(HERE, 'out');
const SHIPPED = path.join(HERE, '..', '..', '..', 'qa_fixtures_placeholder');
const QA = '/home/user/warroom/sow/qa/rfp_fixtures';
const SITE = '/home/user/warroom/sow/rfp_prototype/site/index.html';
fs.mkdirSync(OUT, {recursive: true});
const save = (name, data) => fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 1));
const slimQ = q => ({i: q.i, label: q.label, text: q.text, kind: q.kind,
  draft: q.draft ? {products: q.draft.products.map(p => p.id), conn: q.draft.conn, lines: q.draft.lines.map(l => l.id), plain300: (q.draft.plain || '').slice(0, 300)} : null});
const slim = r => ({status: r.status, count: r.count, questions: r.questions.map(slimQ), piles: {adobe: r.questions.filter(q => q.kind === 'adobe').length, firm: r.questions.filter(q => q.kind === 'firm').length, unsure: r.questions.filter(q => q.kind === 'unsure').length}});
const mime = f => ({'.pdf': 'application/pdf', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '.csv': 'text/csv', '.txt': 'text/plain'}[path.extname(f)] || '');

(async () => {
  const h = await open();
  const page = h.page;
  // install the shipped readers (verbatim block from the built page) so the raw text each reader hands to load() can be recorded
  const html = fs.readFileSync(SITE, 'utf8');
  const block = html.slice(html.indexOf('async function readPdf(file){'), html.indexOf('const KIND={adobe:'));
  await page.evaluate(code => { window.__readers = new Function('LIB', code + '\nreturn {readPdf, readSheet, readDocx};')('lib/'); }, block);
  const raw = async file => {
    const b64 = fs.readFileSync(file).toString('base64');
    return page.evaluate(async ([b64, name, type]) => {
      const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
      const f = new File([bytes], name, {type});
      const n = name.toLowerCase();
      try {
        if (n.endsWith('.pdf')) return await window.__readers.readPdf(f);
        if (n.endsWith('.docx')) return await window.__readers.readDocx(f);
        if (/\.(xlsx|xlsm|xls|csv)$/.test(n)) return await window.__readers.readSheet(f);
        return await f.text();
      } catch (e) { return 'READER ERROR: ' + e.message; }
    }, [b64, path.basename(file), mime(file)]);
  };
  const run = async file => {
    const r = await h.file(file);
    const text = await raw(file);
    return {file: path.basename(file), raw: text, paragraphs: await h.paragraphs(text), result: slim(r)};
  };
  const all = {};

  // ---- C2.1 compliance matrix, Excel then pasted as tabs
  all['C2.1'] = {xlsx: await run(path.join(FX, 'requirements.xlsx'))};
  for (const v of ['requirements_one_block.tsv', 'requirements_two_blocks.tsv']) {
    const t = fs.readFileSync(path.join(FX, v), 'utf8');
    const r = await h.text(t, v);
    all['C2.1'][v] = {text: t, paragraphs: await h.paragraphs(t), result: slim(r)};
  }
  save('C2.1_matrix.json', all['C2.1']);

  // ---- C2.2 Gemini's exact row and the trap
  all['C2.2'] = {};
  for (const f of ['req04.xlsx', 'req04_noheader.xlsx', 'trap.xlsx', 'trap_noheader.xlsx', 'trap_numeric_id.xlsx', 'req04_numeric_id.xlsx']) all['C2.2'][f] = await run(path.join(FX, f));
  save('C2.2_req04_trap.json', all['C2.2']);

  // ---- C2.3 Word table
  all['C2.3'] = await run(path.join(FX, 'table.docx'));
  all['C2.3'].rows = await h.rows();
  save('C2.3_word_table.json', all['C2.3']);

  // ---- C2.4 CSV with a quoted multiline cell
  all['C2.4'] = {};
  for (const f of ['multiline.csv', 'multiline_numeric.csv']) all['C2.4'][f] = await run(path.join(FX, f));
  // what SheetJS itself makes of the quoted newline (rows as parsed), to separate the CSV parse from the line join
  all['C2.4'].sheetjs_rows = await page.evaluate(async b64 => {
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const wb = window.XLSX.read(bytes, {type: 'array', cellDates: false});
    return window.XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header: 1, raw: false, defval: ''});
  }, fs.readFileSync(path.join(FX, 'multiline.csv')).toString('base64'));
  save('C2.4_csv_multiline.json', all['C2.4']);

  // ---- C2.5 PDFs
  all['C2.5'] = {};
  for (const f of ['split.pdf', 'split_glyph_header.pdf', 'table.pdf', 'scan.pdf']) all['C2.5'][f] = await run(path.join(FX, f));
  // pdf.js items for the glyph header page, to show what readPdf joins
  all['C2.5'].split_glyph_items_page2 = await page.evaluate(async b64 => {
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const pdfjs = await import('./lib/pdf.min.mjs');
    const doc = await pdfjs.getDocument({data: bytes, isEvalSupported: false, disableFontFace: true}).promise;
    const pg = await doc.getPage(2), c = await pg.getTextContent();
    return c.items.filter(it => 'str' in it).map(it => ({str: it.str, y: Math.round(it.transform[5]), hasEOL: it.hasEOL}));
  }, fs.readFileSync(path.join(FX, 'split_glyph_header.pdf')).toString('base64'));
  save('C2.5_pdfs.json', all['C2.5']);

  // ---- C2.6 multi-file drop
  all['C2.6'] = {};
  await page.evaluate(() => { const b = document.getElementById('rfp-clear'); if (b) b.click(); });
  all['C2.6'].input_multiple_attr = await page.evaluate(() => document.getElementById('rfp-file').hasAttribute('multiple'));
  try { await page.setInputFiles('#rfp-file', [path.join(QA, 'bank_rfp.xlsx'), path.join(QA, 'retail_rfi.docx')]); all['C2.6'].setInputFiles = 'accepted'; }
  catch (e) { all['C2.6'].setInputFiles = 'Playwright error: ' + e.message.split('\n')[0]; }
  // a real drop: a DataTransfer with both files dropped on the drop zone
  const files = ['bank_rfp.xlsx', 'retail_rfi.docx'].map(f => ({name: f, b64: fs.readFileSync(path.join(QA, f)).toString('base64'), type: mime(f)}));
  await page.evaluate(() => { const b = document.getElementById('rfp-clear'); if (b) b.click(); });
  await page.evaluate(files => {
    const dt = new DataTransfer();
    for (const f of files) dt.items.add(new File([Uint8Array.from(atob(f.b64), c => c.charCodeAt(0))], f.name, {type: f.type}));
    const drop = document.getElementById('rfp-drop');
    drop.dispatchEvent(new DragEvent('drop', {dataTransfer: dt, bubbles: true, cancelable: true}));
  }, files);
  await page.waitForFunction(() => /found|Could not read|no questions/.test(document.getElementById('rfp-status').textContent), null, {timeout: 30000}).catch(() => {});
  await page.waitForTimeout(300);
  const dropped = await h.read();
  all['C2.6'].drop_both = {status: dropped.status, count: dropped.count, labels: dropped.questions.map(q => q.label)};
  // the other order
  await page.evaluate(() => { const b = document.getElementById('rfp-clear'); if (b) b.click(); });
  await page.evaluate(files => {
    const dt = new DataTransfer();
    for (const f of files) dt.items.add(new File([Uint8Array.from(atob(f.b64), c => c.charCodeAt(0))], f.name, {type: f.type}));
    document.getElementById('rfp-drop').dispatchEvent(new DragEvent('drop', {dataTransfer: dt, bubbles: true, cancelable: true}));
  }, files.slice().reverse());
  await page.waitForFunction(() => /found|Could not read|no questions/.test(document.getElementById('rfp-status').textContent), null, {timeout: 30000}).catch(() => {});
  await page.waitForTimeout(300);
  const dropped2 = await h.read();
  all['C2.6'].drop_both_reversed = {status: dropped2.status, count: dropped2.count, labels: dropped2.questions.map(q => q.label)};
  all['C2.6'].code = {
    change: html.match(/\$r\('rfp-file'\)\.addEventListener\('change',[^\n]*/)[0],
    drop: html.match(/drop\.addEventListener\('drop',[^\n]*/)[0],
    input: html.match(/<input type="file" id="rfp-file"[^>]*>/)[0],
  };
  save('C2.6_multi_drop.json', all['C2.6']);

  // ---- C2.7 controls: the four shipped fixtures
  all['C2.7'] = {};
  for (const f of ['bank_rfp.xlsx', 'bank_rfp.txt', 'retail_rfi.docx', 'mfg_rfp.pdf']) {
    const r = await run(path.join(QA, f));
    all['C2.7'][f] = {status: r.result.status, count: r.result.count, labels: r.result.questions.map(q => q.label + ':' + q.kind), raw: r.raw};
  }
  all['C2.7'].expected = JSON.parse(fs.readFileSync(path.join(QA, 'expected.json'), 'utf8'));
  save('C2.7_controls.json', all['C2.7']);

  all.pageErrors = h.errors;
  save('all.json', all);
  await h.close();
  console.log('done; page errors:', h.errors.length);
})().catch(e => { console.error(e); process.exit(1); });
