// Cluster c2_readers, adjacent findings: node extras.js (writes out/extras.json)
const {open} = require('/home/user/warroom/sow/rfp_prototype/review_2026-11-09/harness.js');
const fs = require('fs'), path = require('path');
const HERE = __dirname, FX = path.join(HERE, 'fixtures'), OUT = path.join(HERE, 'out');
const SITE = '/home/user/warroom/sow/rfp_prototype/site/index.html';
const mime = f => ({'.pdf': 'application/pdf', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '.xls': 'application/vnd.ms-excel', '.csv': 'text/csv', '.txt': 'text/plain'}[path.extname(f)] || '');
const slimQ = q => ({label: q.label, text: q.text, kind: q.kind, products: q.draft ? q.draft.products.map(p => p.id) : null, conn: q.draft ? q.draft.conn : null});
(async () => {
  const h = await open(); const page = h.page;
  const html = fs.readFileSync(SITE, 'utf8');
  const block = html.slice(html.indexOf('async function readPdf(file){'), html.indexOf('const KIND={adobe:'));
  await page.evaluate(code => { window.__readers = new Function('LIB', code + '\nreturn {readPdf, readSheet, readDocx};')('lib/'); }, block);
  const raw = async file => page.evaluate(async ([b64, name, type]) => {
    const f = new File([Uint8Array.from(atob(b64), c => c.charCodeAt(0))], name, {type}); const n = name.toLowerCase();
    try { if (n.endsWith('.pdf')) return await window.__readers.readPdf(f); if (n.endsWith('.docx')) return await window.__readers.readDocx(f); if (/\.(xlsx|xlsm|xls|csv)$/.test(n)) return await window.__readers.readSheet(f); return await f.text(); }
    catch (e) { return 'READER ERROR: ' + e.message; }
  }, [fs.readFileSync(file).toString('base64'), path.basename(file), mime(file)]);
  const run = async file => { const r = await h.file(file); const text = await raw(file); return {file: path.basename(file), raw: text, paragraphs: await h.paragraphs(text), status: r.status, count: r.count, questions: r.questions.map(slimQ)}; };
  const out = {};
  for (const f of ['priority_first.xlsx', 'numeric_ids_comply.xlsx', 'wrap_sentence.pdf', 'two_columns.pdf', 'chromium_header.pdf', 'requirements.xls']) {
    if (!fs.existsSync(path.join(FX, f))) { out[f] = 'fixture missing'; continue; }
    out[f] = await run(path.join(FX, f));
  }
  // pdf.js items of the Chromium header page, to see how the generator splits the text
  out.chromium_items = await page.evaluate(async b64 => {
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const pdfjs = await import('./lib/pdf.min.mjs');
    const doc = await pdfjs.getDocument({data: bytes, isEvalSupported: false, disableFontFace: true}).promise;
    const pg = await doc.getPage(1), c = await pg.getTextContent();
    return c.items.filter(it => 'str' in it).map(it => [it.str, Math.round(it.transform[5]), it.hasEOL]);
  }, fs.readFileSync(path.join(FX, 'chromium_header.pdf')).toString('base64'));
  // the same wrapped two-sentence question through the paste path (a hard line break at the sentence boundary)
  const pasted = 'Section 2. Adobe platform services\n2.3 Our customers have complex questions about accounts, policies and rates. How would Brand\nConcierge answer them from approved sources?\n2.4 Our customers have complex questions about accounts, policies and rates.\nHow would Brand Concierge answer them from approved sources?\n';
  const r = await h.text(pasted, 'wrapped.txt');
  out.pasted_wrap = {text: pasted, paragraphs: await h.paragraphs(pasted), status: r.status, count: r.count, questions: r.questions.map(slimQ)};
  out.pageErrors = h.errors;
  fs.writeFileSync(path.join(OUT, 'extras.json'), JSON.stringify(out, null, 1));
  await h.close();
  for (const [k, v] of Object.entries(out)) { if (v && v.status) { console.log('\n== ' + k + '\nRAW: ' + JSON.stringify(v.raw) + '\nPARAGRAPHS: ' + JSON.stringify(v.paragraphs) + '\n' + v.status); console.log(JSON.stringify(v.questions)); } else console.log('\n== ' + k, JSON.stringify(v)); }
})().catch(e => { console.error(e); process.exit(1); });
