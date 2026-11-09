// Cluster c3_piles: reproduces the reviewers' claims about the classifier (classify with FIRM, ADOBE, WORK; the
// Not sure pile) against the built prototype, through the review harness. Every pile comes from the page's own
// RFPBuilder.classify and RFPBuilder.load; the "which alternation fires" column splits the shipped FIRM regex at its
// top-level bars and tests each alternative alone.
// Run: node /home/user/warroom/sow/rfp_prototype/review_2026-11-09/verification/c3_piles/run_c3.js
// Writes inputs.json, out_regexes.json and out_<claim>.json beside this file, and prints a condensed summary.
const fs = require('fs'), path = require('path');
const {open} = require('/home/user/warroom/sow/rfp_prototype/review_2026-11-09/harness.js');
const HERE = __dirname;
const SITE = '/home/user/warroom/sow/rfp_prototype/site/index.html';
const html = fs.readFileSync(SITE, 'utf8');
const save = (name, obj) => fs.writeFileSync(path.join(HERE, name), JSON.stringify(obj, null, 1));
const inputs = {};

// the shipped regexes, read from the built page (single backslashes; the Python source doubles them)
function regexSource(name) { const m = new RegExp('const ' + name + '=/(.*?)/i;').exec(html); if (!m) throw new Error(name + ' not found in the built page'); return m[1]; }
const SRC = {FIRM: regexSource('FIRM'), ADOBE: regexSource('ADOBE'), WORK: regexSource('WORK')};
const RX = Object.fromEntries(Object.entries(SRC).map(([k, s]) => [k, new RegExp(s, 'i')]));
const classifySrc = /function classify\(q\)\{[\s\S]*?\n\}/.exec(html)[0];
// split a regex source at its top-level bars (bars inside groups and classes stay)
function splitTop(src) {
  const parts = []; let depth = 0, cur = '', esc = false, cls = false;
  for (const ch of src) {
    if (esc) { cur += ch; esc = false; continue; }
    if (ch === '\\') { cur += ch; esc = true; continue; }
    if (cls) { cur += ch; if (ch === ']') cls = false; continue; }
    if (ch === '[') { cls = true; cur += ch; continue; }
    if (ch === '(') depth++; else if (ch === ')') depth--;
    if (ch === '|' && depth === 0) { parts.push(cur); cur = ''; continue; }
    cur += ch;
  }
  parts.push(cur); return parts;
}
const ALTS = Object.fromEntries(Object.entries(SRC).map(([k, s]) => [k, splitTop(s)]));
// for one regex: the match the whole regex makes (what classify sees) and every alternative that matches on its own
function fires(name, q) {
  const full = RX[name].exec(q);
  const alts = ALTS[name].map((a, k) => ({k, alt: a, m: new RegExp(a, 'i').exec(q)})).filter(x => x.m).map(x => ({k: x.k, alt: x.alt, matched: x.m[0], index: x.m.index}));
  return {matches: !!full, matched: full ? full[0] : null, index: full ? full.index : null, alternatives: alts};
}

(async () => {
  const h = await open();
  // what the page does with one question: classify, the pipeline pile through load(), and what compose() would draft
  // for it (the draft the Adobe services pile would show; null means "No match in the catalog")
  async function probe(claim, name, text) {
    (inputs[claim] = inputs[claim] || []).push({name, text});
    const pile = await h.classify(text);
    const r = await h.text(text, 'pasted.txt');
    const q0 = r.questions[0] || null;
    const wouldDraft = await h.eval((t) => { const d = RFPAnswers.compose({text: t}); if (!d) return null;
      return {products: d.m.products, conn: d.m.conn ? d.m.conn.a + '+' + d.m.conn.b : null, lines: d.m.lines, first300: RFPAnswers.plain(d, {text: t}).slice(0, 300)}; }, text);
    return {name, text, classify: pile, pipeline: {count: r.count, status: r.status, kind: q0 ? q0.kind : null, label: q0 ? q0.label : null, draft: q0 && q0.draft ? {products: q0.draft.products.map(p => p.id), conn: q0.draft.conn, lines: q0.draft.lines.map(l => l.id), first300: q0.draft.plain.slice(0, 300)} : null},
      FIRM: fires('FIRM', text), ADOBE: fires('ADOBE', text), WORK: fires('WORK', text), detect: await h.detect(text), composeIfAdobe: wouldDraft};
  }
  const line = (p) => `${p.classify.padEnd(6)} | FIRM: ${p.FIRM.matched === null ? '-' : JSON.stringify(p.FIRM.matched)} ${p.FIRM.alternatives.map(a => '#' + a.k + ' ' + a.alt).join(' ; ')} | ADOBE: ${p.ADOBE.matched === null ? '-' : JSON.stringify(p.ADOBE.matched)} | WORK: ${p.WORK.matched === null ? '-' : JSON.stringify(p.WORK.matched)} | detect: ${p.detect.join(',') || '-'} | ${p.text}`;

  save('out_regexes.json', {classify: classifySrc, FIRM: SRC.FIRM, ADOBE: SRC.ADOBE, WORK: SRC.WORK, FIRM_alternatives: ALTS.FIRM, ADOBE_alternatives: ALTS.ADOBE, WORK_alternatives: ALTS.WORK});
  console.log('C3.5 classify():\n' + classifySrc + '\n');

  // C3.1 (Opus A4, Gemini 7): everyday Adobe topics land in Your firm
  const c31 = [
    ['insurance', 'How would Brand Concierge answer questions from our insurance policyholders?'],
    ['pricing', 'How does Adobe Commerce handle B2B pricing and customer-specific catalogs?'],
    ['revenue', 'How would Customer Journey Analytics attribute revenue to AI-referred visits?'],
    ['our organization', 'Describe how Real-Time CDP would unify profiles across our organization.'],
    ['legal', 'How does Brand Concierge keep answers within our legal disclosures?'],
    ['sustainability', 'How can AEM Sites publish our sustainability report pages?'],
    ['invoice', 'How would Adobe Commerce generate an invoice for B2B orders?'],
    ['payment terms', 'How does Adobe Commerce support payment terms for B2B accounts?'],
    ['change requests', 'How does Workfront handle change requests on campaigns?'],
    ['costs', 'How does Customer Journey Analytics report campaign costs against conversions?'],
    ['portfolio', 'How would AEM Assets manage our brand portfolio?'],
    ['exit pages', 'Which Customer Journey Analytics report shows exit pages for AI-referred visits?'],
    ['account management', 'How does Marketo Engage support account management for named accounts?'],
    ['employees', 'How would Coworker help our employees get readouts on request?'],
    ['Gemini: our marketing team', 'How can our marketing team use Adobe Coworker to draft journeys and check anomalies?'],
    ['Gemini: campaign costs', 'How do we join ad spend and campaign costs with web conversions in Customer Journey Analytics?'],
  ];
  const out31 = [];
  console.log('C3.1');
  for (const [name, text] of c31) { const p = await probe('C3.1', name, text); out31.push(p); console.log('  ' + line(p)); }
  save('out_C3.1.json', out31);

  // C3.2 (DeepSeek 13): the bidder shall provide a certified AEM project manager and three public-sector references
  const out32 = {};
  const s1 = 'The bidder shall provide a certified AEM project manager and three public-sector references.';
  (inputs['C3.2'] = inputs['C3.2'] || []).push({name: 'statement', text: s1});
  out32.statement = {text: s1, findQuestions: await h.find(s1), pipeline: await h.text(s1), classifyIfFound: await h.classify(s1), FIRM: fires('FIRM', s1), ADOBE: fires('ADOBE', s1)};
  out32.imperative = await probe('C3.2', 'imperative', 'Provide a certified AEM project manager and three public-sector references.');
  out32.imperative_no_references = await probe('C3.2', 'imperative without references', 'Provide a certified AEM project manager.');
  out32.staffing_variants = [];
  for (const t of ['Name the certified AEM architect who will lead our implementation.', 'Describe the AEM project manager you will assign to this engagement.', 'How many certified AEM developers will be assigned to our project?'])
    out32.staffing_variants.push(await probe('C3.2', 'staffing variant', t));
  console.log('C3.2');
  console.log('  statement: findQuestions -> ' + JSON.stringify(out32.statement.findQuestions) + ' | pipeline count ' + out32.statement.pipeline.count + ' | status: ' + out32.statement.pipeline.status);
  console.log('  ' + line(out32.imperative));
  console.log('  ' + line(out32.imperative_no_references) + ' | composeIfAdobe: ' + JSON.stringify(out32.imperative_no_references.composeIfAdobe && out32.imperative_no_references.composeIfAdobe.products));
  for (const p of out32.staffing_variants) console.log('  ' + line(p) + ' | compose: ' + JSON.stringify(p.composeIfAdobe && p.composeIfAdobe.products));
  save('out_C3.2.json', out32);

  // C3.3 (Opus A5): Not sure rows are drafted
  const out33 = [];
  console.log('C3.3');
  for (const text of ['Who leads the project day to day?', 'What measures do you take to protect our data?']) {
    const p = await probe('C3.3', 'unsure row', text);
    await h.select(0);
    const panel = await h.panel();
    const after = await h.eval(() => { const q = RFPBuilder.state.questions[0]; return {kind: q.kind, hasDraft: !!q.draft, selected: RFPBuilder.state.selected, listTag: document.querySelector('#rfp-questions li .rfp-tag').textContent, listOpen: document.querySelector('#rfp-questions li .rfp-open').textContent, summary: document.getElementById('rfp-summary').textContent, drawnFrom: (document.querySelector('#rfp-answer .rfp-drawn') || {}).textContent || null, useButton: !!document.getElementById('rfp-use')}; });
    const rows = await h.rows(); const doc = await h.doc();
    const docTag = (/<p class="tag">([^<]*)<\/p>/.exec(doc) || [])[1] || null;
    const rec = {...p, afterSelect: after, panel300: panel.slice(0, 300), panel, excelRow: rows.rows[1], responseDocTag: docTag};
    out33.push(rec);
    console.log('  ' + line(p));
    console.log('    selected ' + after.selected + ' | hasDraft ' + after.hasDraft + ' | list tag "' + after.listTag + '" / "' + after.listOpen + '" | drawn: ' + after.drawnFrom + ' | summary: ' + after.summary.trim().slice(0, 120));
    console.log('    panel300: ' + JSON.stringify(panel.slice(0, 300)));
    console.log('    excel row: ' + JSON.stringify(rows.rows[1]) + ' | response doc tag: ' + docTag);
  }
  save('out_C3.3.json', out33);

  // C3.4: controls that must stay in Your firm
  const c34 = ['Provide three references from financial services clients.', 'Describe your project team and their Adobe certifications.', 'What is your pricing model?', 'Provide your hourly rates and a not-to-exceed budget.', 'Confirm your acceptance of our master services agreement.', 'Describe your change control process.'];
  const out34 = [];
  console.log('C3.4');
  for (const text of c34) { const p = await probe('C3.4', 'control', text); out34.push(p); console.log('  ' + line(p) + ' | pipeline kind ' + p.pipeline.kind + ' draft ' + JSON.stringify(p.pipeline.draft)); }
  save('out_C3.4.json', out34);

  // extras: FIRM alternatives the reviewers did not name, ADOBE and WORK words that pull vendor questions into Adobe services
  const extra = [
    ['X1 our team (Gemini hypothetical)', 'How would Coworker help our team draft journeys and check anomalies?'],
    ['X2 time zone', 'How does Journey Optimizer schedule sends in each recipient\'s time zone?'],
    ['X3 executive summary', 'Can Coworker draft an executive summary of campaign results from Customer Journey Analytics?'],
    ['X4 escalation', 'Describe how Brand Concierge handles escalation to a live agent.'],
    ['X5 discount', 'How does Adobe Commerce apply discount rules to B2B customer groups?'],
    ['X6 quality assurance', 'How does Workfront support quality assurance reviews before a campaign launches?'],
    ['X7 signature', 'How does AEM Forms support e-signature for digital account opening?'],
    ['X8 authorized', 'How does Workfront route requests to authorized approvers?'],
    ['X9 warranty', 'Does Adobe Commerce support product warranties and returns?'],
    ['X10 the organization', 'How does Real-Time CDP govern profile access across the organization?'],
    ['X11 target as a word (Opus A5)', 'What is the target go-live date for the new site?'],
    ['X12 chatgpt in WORK (Opus A5)', 'Do you use generative AI tools such as ChatGPT in delivering services? If so, how do you protect our data?'],
    ['X13 soc 2 in WORK', 'Are you SOC 2 Type II certified?'],
    ['X14 training in WORK', 'Describe the training you will provide to our content authors.'],
    ['X15 hosting in WORK', 'Where will the solution be hosted and who manages the hosting?'],
    ['X16 one firm word in a second sentence', 'Describe how Customer Journey Analytics would attribute conversions to campaigns. Include the cost of any additional licenses.'],
  ];
  const outX = [];
  console.log('EXTRA');
  for (const [name, text] of extra) { const p = await probe('extra', name, text); outX.push(p); console.log('  ' + name + ': ' + line(p) + ' | compose: ' + JSON.stringify(p.composeIfAdobe && {products: p.composeIfAdobe.products, lines: p.composeIfAdobe.lines})); }
  save('out_extra.json', outX);

  save('inputs.json', inputs);
  if (h.errors.length) { console.log('PAGE ERRORS: ' + JSON.stringify(h.errors)); save('out_page_errors.json', h.errors); }
  await h.close();
})().catch(e => { console.error(e); process.exit(1); });
