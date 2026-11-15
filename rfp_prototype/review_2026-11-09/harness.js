// Harness for reproducing claims about the RFP Builder prototype (Nov 9 2026 review). It serves the built prototype
// (sow/site/sow/, built by python3 sow/build_site.py) and drives the page's own code, so every
// verdict in RESPONSE.md comes from the shipped JavaScript, not from a reading of it.
//
// As a module:
//   const {open} = require('/home/user/warroom/sow/rfp_prototype/review_2026-11-09/harness.js');
//   const h = await open();
//   const r = await h.text('2.1 Describe ...\n2.2 How would ...');   // paste path: the finder, the piles, every draft
//   const f = await h.file('/abs/path/to/rfp.xlsx');                 // drop path: the same, through the file readers
//   await h.voice('the Client agrees');                              // the client-voice rewrite rfp()
//   await h.classify('Provide three references.');                  // the pile a question lands in
//   await h.detect('our Marketo instance');                          // the products a question names
//   await h.eval(() => RFPBuilder.state.client);                    // anything on the page (RFPBuilder, RFPAnswers, state)
//   await h.setStatus(i, 'used' | 'skipped' | null); await h.setAnswer(i, 'text'); await h.setFact(i, askIndex, 'text');
//   await h.word(); await h.checklist(); await h.workbook("rfp-writeback"); // inspect the downloaded Office files
//   await h.shot('/abs/path.png');                                   // screenshot of the RFP panel
//   h.page                                                           // the Playwright page, for anything else
//   await h.close();
// Result shape of text()/file(): {status, count, questions: [{i, label, text, kind, draft}]} where draft is null (no
// catalog match, or a firm question) or {products: [{id, name}], conn: 'a+b' | null, fromContext, lines: [{id, name, unit}],
// sections: [[heading, [items]]], plain, sources: [{title, url}], sells: [], asks: []}.
// CLI: node harness.js --text "..."  |  node harness.js --file /abs/path  |  node harness.js --json inputs.json
//   where inputs.json is [{"name": "...", "text": "..."} | {"name": "...", "file": "/abs/path"}]; prints JSON.
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.resolve(__dirname, '..', '..', 'site', 'sow');   // the SOW generator's page, with the RFP Builder tab since the Nov 9 merge
const TYPES = {'.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript', '.json': 'application/json'};

async function downloadWord(h) {
  if (await h.page.isHidden('#rfp-dl-menu')) await h.page.click('#rfp-download-menu');
  const [file] = await Promise.all([
    h.page.waitForEvent('download', {timeout: 15000}),
    h.page.click('#rfp-download-proposal')
  ]);
  assert.match(file.suggestedFilename(), /\.docx$/);
  await h.page.click('#rfp-progress-close');
  const filePath = await file.path();
  const xml = execFileSync('unzip', ['-p', filePath, 'word/document.xml'], {encoding: 'utf8', maxBuffer: 64e6});
  const blocks = await h.eval(xml => {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    const w = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
    const all = (el, tag) => Array.from(el.getElementsByTagNameNS(w, tag));
    const text = el => Array.from(el.getElementsByTagNameNS(w, '*'))
      .filter(n => ['t', 'br', 'tab'].includes(n.localName))
      .map(n => n.localName === 't' ? n.textContent : (n.localName === 'br' ? '\n' : '\t')).join('');
    return Array.from(all(doc, 'body')[0].children).map(el => {
      if (el.localName === 'tbl') return {rows: all(el, 'tr').map(tr => Array.from(tr.children)
        .filter(e => e.localName === 'tc').map(tc => all(tc, 'p').map(text).join('\n')))};
      const citations = all(el, 'r').filter(r => all(r, 'vertAlign')[0]?.getAttributeNS(w, 'val') === 'superscript')
        .flatMap(r => text(r).trim().split(/,\s*/)).filter(n => /^\d+$/.test(n));
      return {text: text(el), style: all(el, 'pStyle')[0]?.getAttributeNS(w, 'val') || '', ...(citations.length ? {citations} : {})};
    });
  }, xml);
  const sections = [];
  for (const block of blocks) {
    if (block.style === 'Heading1') {
      const heading = /^(?:(\d+)\s+)?(.+)$/.exec(block.text);
      sections.push({number: heading[1], title: heading[2], blocks: []});
    } else if (sections.length) sections.at(-1).blocks.push(block);
  }
  return {blocks, sections, filePath};
}

// Click the same menu a partner uses, then read the saved Excel file.
async function downloadWorkbook(page, id) {
  if (await page.isHidden('#rfp-dl-menu')) await page.click('#rfp-download-menu');
  const [download] = await Promise.all([page.waitForEvent('download'), page.click('#' + id)]);
  const bytes = Array.from(fs.readFileSync(await download.path()));
  const sheets = await page.evaluate(async bytes => {
    const X = await RFPReaders.loadXLSX();
    const wb = X.read(new Uint8Array(bytes), {type: 'array'});
    return Object.fromEntries(wb.SheetNames.map(name =>
      [name, X.utils.sheet_to_json(wb.Sheets[name], {header: 1, raw: false, defval: ''})]));
  }, bytes);
  return {filename: download.suggestedFilename(), sheets};
}

async function open(opts = {}) {
  if (!fs.existsSync(path.join(SITE, 'index.html'))) throw new Error('Build the site first: python3 sow/build_site.py');
  const server = http.createServer((req, res) => {
    let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
    if (u.endsWith('/')) u += 'index.html';
    const f = path.join(SITE, u);
    if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, {'Content-Type': TYPES[path.extname(f)] || 'text/plain'}); fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => server.listen(0, r));
  const BASE = `http://localhost:${server.address().port}/`;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({viewport: {width: 1500, height: 1100}, deviceScaleFactor: opts.scale || 1});
  const page = await ctx.newPage();
  // step 88: no check sends an RFI to the live AI writer; a check that wants written answers stubs this address on its page
  await ctx.route('https://warroom-assistant.adam-d1a.workers.dev/rfi/answer', r => r.abort());
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('dialog', d => d.accept());   // step 56: the leave-this-page warning never blocks a check
  await page.goto(BASE + 'index.html#rfp'); await page.waitForTimeout(400);

  const read = () => page.evaluate(() => {
    const qs = RFPBuilder.state.questions;
    const slim = (q) => {
      if (q.kind === 'firm') return null;
      const d = q.draft || RFPAnswers.compose(q);
      if (!d) return null;
      return {
        products: d.m.products.map(id => ({id, name: RFP_CAT.products.find(p => p.id === id).name})),
        conn: d.m.conn ? d.m.conn.a + '+' + d.m.conn.b : null, fromContext: !!d.m.fromContext,
        lines: d.m.lines.map(id => ({id, name: RFP_CAT.lines[id].name, unit: RFP_CAT.lines[id].unit})),
        sections: d.sections, plain: RFPAnswers.plain(d, q), sources: d.sources, sells: d.sells, asks: d.asks,
        capability: !!d.capability, kb: !!d.kb, confirm: d.confirm || [], uncovered: d.uncovered || null, excluded: d.excluded || null,
      };
    };
    return {status: document.getElementById('rfp-status').textContent, count: qs.length,
      skipped: (RFPBuilder.state.skipped || []).length,
      questions: qs.map((q, i) => ({i, label: q.label || '', text: q.text, kind: q.kind, status: q.status || null, priority: q.priority || '', section: q.section || '', context: q.context || '', requirement: !!q.requirement, firmPart: q.firmPart || '', draft: slim(q)}))};
  });
  // step 55: Start over asks first, so the harness confirms it
  const clear = async () => { await page.evaluate(() => { const b = document.getElementById('rfp-clear'); if (b) b.click(); const c = document.getElementById('rfp-clear-confirm'); if (c && !document.getElementById('rfp-start-over-modal').hidden) c.click(); }); await page.waitForTimeout(50); };

  const h = {
    page, base: BASE, errors,
    async text(text, name = 'pasted.txt') {
      await clear();
      await page.evaluate(([n, t]) => RFPBuilder.load(n, t), [name, text]);
      await page.waitForTimeout(80);
      return read();
    },
    async file(file) {
      await clear();
      await page.setInputFiles('#rfp-file', file);
      await page.waitForFunction(f => /found|Could not read|no questions/.test(document.getElementById('rfp-status').textContent) && document.getElementById('rfp-status').textContent.includes(f), path.basename(file), {timeout: 60000}).catch(() => {});
      await page.waitForTimeout(150);
      return read();
    },
    read,
    voice: s => page.evaluate(s => RFPAnswers.rfp(s), s),
    classify: s => page.evaluate(s => RFPBuilder.classify(s), s),
    detect: s => page.evaluate(s => RFPAnswers.detect(s), s),
    find: s => page.evaluate(s => RFPBuilder.findQuestions(s), s),
    paragraphs: s => page.evaluate(s => RFPBuilder.paragraphs(s), s),
    eval: (fn, arg) => page.evaluate(fn, arg),
    async select(i) { await page.evaluate(i => { const li = document.querySelector(`#rfp-questions li[data-i="${i}"]`); if (li) li.click(); }, i); await page.waitForTimeout(120); },
    async setStatus(i, status) { await page.evaluate(([i, s]) => { const q = RFPBuilder.state.questions[i]; if (s) q.status = s; else delete q.status; if (q.kind !== 'firm' && !q.draft) q.draft = RFPAnswers.compose(q); RFPBuilder.renderList(); }, [i, status]); await page.waitForTimeout(60); },
    async setAnswer(i, text) { await page.evaluate(([i, t]) => { const q = RFPBuilder.state.questions[i]; q.answer = t; q.status = t ? 'used' : undefined; RFPBuilder.renderList(); }, [i, text]); await page.waitForTimeout(60); },
    async setFact(i, k, text) { await page.evaluate(([i, k, t]) => { const q = RFPBuilder.state.questions[i]; if (!q.draft) q.draft = RFPAnswers.compose(q); (q.facts = q.facts || {})[(q.draft && q.draft.asks && q.draft.asks[k]) || String(k)] = t; RFPBuilder.renderList(); }, [i, k, text]); await page.waitForTimeout(60); },   // step 54: notes are keyed by the ask's words
    word: () => downloadWord(h),
    workbook: id => downloadWorkbook(page, id),
    checklist: async () => (await downloadWorkbook(page, 'rfp-download-checklist')).sheets['My checklist'],
    panel: () => page.evaluate(() => document.getElementById('rfp-answer').textContent),
    async shot(file) { const el = await page.$('#rfp-panel'); await el.screenshot({path: file}); return file; },
    async close() { await browser.close(); server.close(); },
  };
  return h;
}
module.exports = {open, downloadWord, downloadWorkbook};

if (require.main === module) {
  (async () => {
    const a = process.argv.slice(2);
    const h = await open();
    let out;
    if (a[0] === '--text') out = await h.text(a.slice(1).join(' '));
    else if (a[0] === '--file') out = await h.file(path.resolve(a[1]));
    else if (a[0] === '--json') {
      const inputs = JSON.parse(fs.readFileSync(path.resolve(a[1]), 'utf8'));
      out = [];
      for (const inp of inputs) out.push({name: inp.name, result: inp.file ? await h.file(path.resolve(inp.file)) : await h.text(inp.text, inp.name || 'pasted.txt')});
    } else { console.error('usage: node harness.js --text "..." | --file path | --json inputs.json'); process.exit(2); }
    if (h.errors.length) out = {errors: h.errors, result: out};
    console.log(JSON.stringify(out, null, 1));
    await h.close();
  })().catch(e => { console.error(e); process.exit(1); });
}
