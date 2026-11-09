// Cluster c8_check (the skeptic): spot-checks of the CONFIRMED sample through the shipped page.
// Run: node /home/user/warroom/sow/rfp_prototype/review_2026-11-09/verification/c8_check/confirmed.js
const fs = require('fs'), path = require('path');
const {open} = require('/home/user/warroom/sow/rfp_prototype/review_2026-11-09/harness.js');
const HERE = __dirname, FX = path.join(HERE, 'fixtures'), QA = '/home/user/warroom/sow/qa/rfp_fixtures';
const save = (name, obj) => fs.writeFileSync(path.join(HERE, name), JSON.stringify(obj, null, 1));
const slim = q => ({label: q.label, text: q.text, kind: q.kind, status: q.status, products: q.draft ? q.draft.products.map(p => p.id) : null, conn: q.draft ? q.draft.conn : null,
  lines: q.draft ? q.draft.lines.map(l => l.id) : null, sections: q.draft ? q.draft.sections : null, sells: q.draft ? q.draft.sells : null, asks: q.draft ? q.draft.asks : null, nsources: q.draft ? q.draft.sources.length : null,
  plain300: q.draft ? q.draft.plain.slice(0, 300) : null});
const brief = r => ({status: r.status, count: r.count, questions: r.questions.map(slim)});

(async () => {
  const h = await open(); const page = h.page;
  const idx = (r, label) => r.questions.findIndex(q => q.label === label);

  // ================= C1.1 statements
  {
    const ten = ['3.1 The solution shall support multi-site management with shared components across 12 regional brands.', '3.2 The solution must support role-based publishing.', '3.3 The platform should provide a sitemap and redirects.',
      '3.4 Respondent will provide a migration plan for our 40 sites.', '3.5 Vendor to confirm support for multi-language sites.', '3.6 Support for scheduled publishing.',
      'REQ-101: The proposed CDP must ingest batch data from Snowflake and streaming events from Web SDK.', '3.2.4 Vendor shall configure role-based access control and development and production sandboxes in Adobe Experience Platform.',
      '4.1 Ability to export Experience Fragments from AEM Sites to Adobe Target as HTML or JSON offers.', 'R1. The solution shall provide a unified customer profile across channels.'];
    const out = {single: {}, all: null};
    for (const t of ten) out.single[t] = (await h.text(t)).count;
    const all = ten.join('\n');
    out.all = {paragraphs: await h.paragraphs(all), result: brief(await h.text(all))};
    save('out_C1.1.json', out); console.log('C1.1', JSON.stringify(Object.values(out.single)), out.all.result.count);
  }

  // ================= C1.6 silent limits
  {
    const out = {};
    const lines = []; for (let i = 1; i <= 350; i++) lines.push(i + '. ' + (i > 345 ? 'Describe how Brand Visibility reports AI citations for requirement ' + i + '.' : 'Describe requirement ' + i + '.'));
    const r = await h.text(lines.join('\n'));
    out.a_350 = {count: r.count, status: r.status, lastLabel: r.questions[r.questions.length - 1].label, bv_rows: r.questions.filter(q => /Brand Visibility/.test(q.text)).length, warning_in_status: /not read|more|skipped|limit/i.test(r.status)};
    const long = '7. Describe your approach to implementing AEM Sites for our forty regional brands, including how authors would share components and templates across sites. ' + 'Our bank runs forty regional sites on a legacy content management system with separate templates, separate hosting and separate release cycles. '.repeat(8);
    out.b_long = {length: long.length, count: (await h.text(long)).count, control_under_900: (await h.text(long.slice(0, 880).replace(/\s\S*$/, '.'))).count};
    out.c_codes = {}; for (const t of ['REQ-001 Describe your approach to AEM Sites.', 'FR-3.2 Describe your approach to Target.', 'Item 15: Describe your approach to Marketo.']) out.c_codes[t] = (await h.text(t)).count;
    out.d_notice = brief(await h.text('Please note that all responses become the property of Northbridge Mutual Bank.'));
    out.e_lang = {}; for (const t of ["Décrivez votre approche pour la mise en œuvre d'AEM Sites.", 'Describa su enfoque para implementar Adobe Target.', 'Descreva sua abordagem para implementar o Marketo Engage.']) out.e_lang[t] = (await h.text(t)).count;
    const sec = 'Appendix C: Security Questionnaire\nS1. Do you support single sign-on with SAML 2.0?\nS2. Is customer data encrypted at rest?\nS3. Describe your data retention policy.';
    out.f_security = {paragraphs: await h.paragraphs(sec), result: brief(await h.text(sec))};
    out.rules = await h.eval(() => { const src = document.getElementById('rfp-builder').textContent; return {len: (src.match(/if\(p\.length<12\|\|p\.length>\d+\)continue;/) || [''])[0], cap: (src.match(/if\(qs\.length>=\d+\)break;/) || [''])[0]}; });
    save('out_C1.6.json', out); console.log('C1.6', JSON.stringify({a: out.a_350.count, b: out.b_long.count, c: out.c_codes, d: out.d_notice.count, e: out.e_lang, f: out.f_security.result.count}));
  }

  // ================= C2.5 PDFs
  {
    const out = {};
    for (const f of ['c25_split.pdf', 'c25_table.pdf', 'c25_scan.pdf']) out[f] = brief(await h.file(path.join(FX, f)));
    const html = fs.readFileSync('/home/user/warroom/sow/rfp_prototype/site/index.html', 'utf8');
    const block = html.slice(html.indexOf('async function readPdf(file){'), html.indexOf('const KIND={adobe:'));
    await page.evaluate(code => { window.__rd = new Function('LIB', code + '\nreturn {readPdf, readSheet, readDocx};')('lib/'); }, block);
    out.raw = {};
    for (const f of ['c25_split.pdf', 'c25_table.pdf', 'c25_scan.pdf']) out.raw[f] = await page.evaluate(async ([b64, name]) => { const fl = new File([Uint8Array.from(atob(b64), c => c.charCodeAt(0))], name, {type: 'application/pdf'}); try { return await window.__rd.readPdf(fl); } catch (e) { return 'READER ERROR ' + e.message; } }, [fs.readFileSync(path.join(FX, f)).toString('base64'), f]);
    save('out_C2.5.json', out); console.log('C2.5', Object.entries(out).filter(([k]) => k !== 'raw').map(([k, v]) => k + ':' + v.count).join(' '));
  }

  // ================= C3.3 Not sure rows drafted
  {
    const out = {};
    for (const t of ['Who leads the project day to day?', 'What measures do you take to protect our data?']) {
      const r = await h.text(t); const q = r.questions[0];
      await h.select(0);
      const panel = await page.evaluate(() => document.getElementById('rfp-answer').textContent);
      out[t] = {classify: await h.classify(t), kind: q.kind, listTag: await page.evaluate(() => document.querySelector('#rfp-questions li .rfp-tag').textContent), products: q.draft && q.draft.products.map(p => p.id), lines: q.draft && q.draft.lines.map(l => l.id), panel300: panel.slice(0, 300), useButton: await page.evaluate(() => !!document.getElementById('rfp-use')), summary: await page.evaluate(() => document.getElementById('rfp-summary').textContent.slice(0, 120)),
        rows_status: (await h.rows()).rows[1][3], doc_has_draft: /Draft, not yet reviewed/.test(await h.doc())};
    }
    out.branch_sites = await h.eval(() => { const src = document.getElementById('rfp-answers').textContent; return {kind_firm_tests: (src.match(/kind==='firm'/g) || []).length, kind_adobe_tests: (src.match(/kind==='adobe'/g) || []).length, kind_unsure_tests: (src.match(/kind==='unsure'/g) || []).length}; });
    save('out_C3.3.json', out); console.log('C3.3', JSON.stringify(Object.values(out).map(v => v.products || v)));
  }

  // ================= C4.2 generative AI in delivery
  {
    const t = 'Do you use generative AI tools such as ChatGPT in delivering services? If so, how do you protect our data?';
    const r = await h.text(t);
    const out = {classify: await h.classify(t), detect: await h.detect(t), result: brief(r), work_hit: await h.eval(s => { const src = document.getElementById('rfp-builder').textContent; const W = new RegExp(src.match(/const WORK=\/(.*)\/i;/)[1], 'i'); return (W.exec(s) || [null])[0]; }, t)};
    save('out_C4.2.json', out); console.log('C4.2', out.classify, out.detect, out.result.questions[0].lines);
  }

  // ================= C4.6 Assets to Commerce
  {
    const out = {};
    for (const t of ['Our product images live in AEM Assets. How do approved images reach Commerce product pages?', 'Describe how AEM Assets feeds Adobe Commerce product pages.']) {
      const r = await h.text(t); const q = r.questions[0];
      out[t] = {detect: await h.detect(t), conn: q.draft && q.draft.conn, lines: q.draft && q.draft.lines.map(l => l.id),
        scores: await h.eval(s => { const t = ' ' + s.toLowerCase().replace(/[^a-z0-9/]+/g, ' ') + ' '; const src = document.getElementById('rfp-answers').textContent; const A = new Function('return ' + /const ALIASES=(\{[\s\S]*?\});/.exec(src)[1])(); const score = {}; for (const [pid, names] of Object.entries(A)) for (const a of names) { const hit = a.length <= 4 ? t.includes(' ' + a + ' ') : t.includes(a); if (hit) score[pid] = (score[pid] || 0) + (a.length <= 4 ? 1 : 2); } return score; }, t)};
    }
    out.connection_order = await h.eval(() => RFP_CAT.connections.map((c, i) => [i, c.id]).filter(([i, id]) => /aemassets|commerce-aemsites/.test(id)));
    out.commerce_aemassets = await h.eval(() => { const c = RFP_CAT.connections.find(k => k.id === 'commerce-aemassets'); return c ? {label: c.label, lines: c.lines, more: c.more} : null; });
    out.detect_aem_assets = await h.detect('AEM Assets');
    save('out_C4.6.json', out); console.log('C4.6', Object.values(out).slice(0, 2).map(v => v.conn));
  }

  // ================= C4.10 ownership read only from questions
  {
    const out = {};
    const bg = 'Background. The bank licensed Brand Visibility in 2026 and uses it today.\n2.2 How would you connect our Customer Journey Analytics data to AI assistant traffic, and what do you need from us?';
    let r = await h.text(bg); out.background = {paragraphs: await h.paragraphs(bg), count: r.count, owned: await h.eval(() => [...RFPAnswers.ownedProducts()]), sells: r.questions[r.questions.length - 1].draft && r.questions[r.questions.length - 1].draft.sells};
    r = await h.text('Background. We use Brand Visibility today. Is that correct?\n2.2 How would you connect our Customer Journey Analytics data to AI assistant traffic, and what do you need from us?');
    out.background_as_question = {count: r.count, owned: await h.eval(() => [...RFPAnswers.ownedProducts()]), sells: r.questions[r.questions.length - 1].draft && r.questions[r.questions.length - 1].draft.sells};
    r = await h.text('How would you build our new site on EDS?');
    out.eds = {count: r.count, owned: await h.eval(() => [...RFPAnswers.ownedProducts()]), detect: await h.detect('How would you build our new site on EDS?'), eds_aliases: await h.eval(() => { const src = document.getElementById('rfp-answers').textContent; return (src.match(/eds:\[[^\]]*\]/) || [''])[0]; })};
    save('out_C4.10.json', out); console.log('C4.10', JSON.stringify(out.background.owned), JSON.stringify(out.eds.owned));
  }

  // ================= C5.4 bank 2.2 coaching sentence
  {
    const out = {};
    const PH = 'which ordinary referrer reporting can show without it; lift comes only from a test';
    let r = await h.text('How would you connect our Customer Journey Analytics data to AI assistant traffic, and what do you need from us?');
    out.alone = {conn: r.questions[0].draft.conn, approach: r.questions[0].draft.sections[0][1], phrase_present: JSON.stringify(r.questions[0].draft.sections).includes(PH)};
    r = await h.file(path.join(QA, 'bank_rfp.txt')); const i = idx(r, '2.2'); const q = r.questions[i];
    out.in_bank = {count: r.count, label: q.label, conn: q.draft.conn, phrase_present: JSON.stringify(q.draft.sections).includes(PH)};
    out.gain_source = await h.eval(() => { const c = RFP_CAT.connections.find(k => k.id === 'bv-cja'); return {gain: c.gain.text, sow_gain: c.sow_gain || c.sowGain || null, keys: Object.keys(c)}; });
    save('out_C5.4.json', out); console.log('C5.4', out.alone.phrase_present, out.in_bank.phrase_present);
  }

  // ================= C6.2 the six-prerequisite cap and line requirements
  {
    const out = {};
    out.catalog = await h.eval(() => { const over = RFP_CAT.connections.filter(c => (c.prereqs || []).length > 6).map(c => c.id + ' (' + c.prereqs.length + ')'); return {connections: RFP_CAT.connections.length, overSix: over, dropped: RFP_CAT.connections.reduce((n, c) => n + Math.max(0, (c.prereqs || []).length - 6), 0), C06: {ext: RFP_CAT.lines.C06.ext || null, tier: RFP_CAT.lines.C06.tier || null}, C01: {ext: RFP_CAT.lines.C01.ext || null, tier: RFP_CAT.lines.C01.tier || null}}; });
    const r = await h.file(path.join(QA, 'bank_rfp.xlsx')); const q = r.questions[idx(r, '2.2')];
    const all9 = await h.eval(() => RFP_CAT.connections.find(k => k.id === 'bv-cja').prereqs);
    const shown = [...q.draft.sells, ...q.draft.asks];
    out.bank22 = {conn: q.draft.conn, lines: q.draft.lines.map(l => l.id), shown: shown.length, notShown: all9.filter(p => !shown.includes(p)), us_processing_shown: shown.some(s => /United States/.test(s)),
      rtcdp_or_ajo_in_response_or_note: /Real-Time CDP|Journey Optimizer/.test(JSON.stringify(q.draft.sections) + JSON.stringify(shown)), C06_line_text: (q.draft.sections.find(s => s[0] === 'What we would do') || [null, []])[1].find(x => /audiences/.test(x))};
    out.cap_rule = await h.eval(() => { const src = document.getElementById('rfp-answers').textContent; return (src.match(/if\(m\.conn\)need=[^\n]*/) || [''])[0].slice(0, 160); });
    out.ext_tier_readers = await h.eval(() => { const src = document.getElementById('rfp-answers').textContent; return {ext: (src.match(/L\.ext|LN\[[^\]]+\]\.ext/g) || []).length, tier: (src.match(/L\.tier|LN\[[^\]]+\]\.tier/g) || []).length, in_toSow_only: /L\.ext\?'Also needs/.test(src)}; });
    save('out_C6.2.json', out); console.log('C6.2', out.catalog.overSix.length, out.bank22.shown, out.bank22.notShown.length);
  }

  // ================= C6.7 non-connection notes from template assumptions
  {
    const out = {};
    let r = await h.file(path.join(QA, 'mfg_rfp.pdf'));
    for (const lab of ['B.3', 'B.4']) { const q = r.questions[idx(r, lab)]; out['mfg ' + lab] = {text: q.text, products: q.draft && q.draft.products.map(p => p.id), conn: q.draft && q.draft.conn, lines: q.draft && q.draft.lines.map(l => l.id), sells: q.draft && q.draft.sells, asks: q.draft && q.draft.asks}; }
    r = await h.file(path.join(QA, 'retail_rfi.docx'));
    { const q = r.questions[idx(r, 'Q4')]; out['retail Q4'] = {text: q.text, products: q.draft && q.draft.products.map(p => p.id), conn: q.draft && q.draft.conn, lines: q.draft && q.draft.lines.map(l => l.id), sells: q.draft && q.draft.sells, asks: q.draft && q.draft.asks, owned: await h.eval(() => [...RFPAnswers.ownedProducts()])}; }
    save('out_C6.7.json', out); console.log('C6.7', JSON.stringify(Object.values(out).map(v => (v.asks || []).length)));
  }

  // ================= C7.4 Used toggle, per-line control, edited answer hand-off
  {
    const r = await h.file(path.join(QA, 'bank_rfp.xlsx')); const i = idx(r, '2.2'); await h.select(i);
    const clicks = [];
    for (let k = 0; k < 3; k++) { await page.click('#rfp-use'); await page.waitForTimeout(60); clicks.push(await page.evaluate(i => ({status: RFPBuilder.state.questions[i].status, button: document.getElementById('rfp-use').textContent}), i)); }
    const controls = await page.evaluate(() => ({buttons: [...document.querySelectorAll('#rfp-answer button')].map(b => b.id), checkboxes: document.querySelectorAll('#rfp-answer input[type=checkbox]').length, inputs: [...document.querySelectorAll('#rfp-answer input,#rfp-answer textarea,#rfp-answer select')].map(e => e.tagName + '.' + e.className)}));
    await page.click('#rfp-edit-btn'); await page.fill('#rfp-edit', 'We will connect your CJA data to AI assistant traffic.'); await page.click('#rfp-save-edit'); await page.waitForTimeout(80);
    const edited = await page.evaluate(i => { const q = RFPBuilder.state.questions[i]; return {status: q.status, answer: q.answer, draftLines: q.draft.m.lines}; }, i);
    await page.evaluate(() => { window.__set = []; const o = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { window.__set.push([k, v.slice(0, 20000)]); return o.apply(this, arguments); }; });
    await page.click('#rfp-to-sow'); await page.waitForTimeout(400);
    const handoff = await page.evaluate(() => { const e = window.__set.find(x => x[0] === 'abv-sow-handoff'); if (!e) return null; const j = JSON.parse(e[1]); return {play: j.play, fresh: j.fresh, products: j.products, linesOn: j.lines.filter(l => l.on).map(l => l.id), linesTotal: j.lines.length}; });
    const sow = await page.evaluate(() => ({play: state.play, hash: location.hash, onInCustom: Object.entries(state.estimates.custom || {}).filter(([k, v]) => v.on).map(([k]) => k)}));
    const out = {clicks, controls, edited, handoff, sow, handler: await h.eval(() => { const src = document.getElementById('rfp-answers').textContent; return {use: (src.match(/if\(id==='rfp-use'[^\n]*/) || [''])[0].slice(0, 160), selectedLineIds: (src.match(/function selectedLineIds\(\)[^\n]*/) || [''])[0].slice(0, 200)}; })};
    save('out_C7.4.json', out); console.log('C7.4', JSON.stringify(clicks.map(c => c.status)), 'checkboxes', controls.checkboxes, 'handoff', handoff && handoff.linesOn);
  }

  // ================= C7.9 the Excel columns
  {
    await page.goto(h.base + 'index.html#rfp'); await page.waitForTimeout(400);
    const r = await h.file(path.join(QA, 'bank_rfp.xlsx'));
    await h.setStatus(idx(r, '2.2'), 'used'); await h.setStatus(idx(r, '2.4'), 'skipped'); await h.setAnswer(idx(r, '1.1'), 'We are a 40-person firm.');
    const rows = await h.rows();
    const [dl] = await Promise.all([page.waitForEvent('download', {timeout: 20000}), page.click('#rfp-download-xlsx')]);
    const file = path.join(HERE, 'out_C7.9_response.xlsx'); await dl.saveAs(file);
    const out = {header: rows.rows[0], columns: rows.rows[0].length, statuses: [...new Set(rows.rows.slice(1).map(x => x[3]))], srcHeader: rows.srcs[0], suggested: dl.suggestedFilename(), bytes: fs.statSync(file).size, code: await h.eval(() => { const src = document.getElementById('rfp-answers').textContent; return (src.match(/const rows=\[\[[^\]]*\]\],srcs=\[\[[^\]]*\]\]/) || [''])[0]; })};
    save('out_C7.9.json', out); console.log('C7.9', JSON.stringify(out.header), out.bytes);
  }

  if (h.errors.length) { console.log('PAGE ERRORS', h.errors); save('out_page_errors_confirmed.json', h.errors); }
  await h.close();
})().catch(e => { console.error(e); process.exit(1); });
