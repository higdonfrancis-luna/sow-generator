// Cluster c6_note follow-up: the Workfront + Coworker question behind Opus's "Adobe's support or professional services team
// configures Coworker" quote, the SOW hand-off payload captured as the page writes it (applyHandoff consumes the key), the
// template assumptions behind the C6.3 and C6.7 note items, the C06 assumption the connection path skips, and the split of
// C6.4's hits between voice ("the Client") and OAuth terms ("Client ID", "Client Secret").
// Run: node /home/user/warroom/sow/rfp_prototype/review_2026-11-09/verification/c6_note/followup_c6.js
const fs = require('fs'), path = require('path');
const {open} = require('/home/user/warroom/sow/rfp_prototype/review_2026-11-09/harness.js');
const HERE = __dirname, FIX = '/home/user/warroom/sow/qa/rfp_fixtures';
const save = (n, o) => fs.writeFileSync(path.join(HERE, n), JSON.stringify(o, null, 1));
const first = (s, n = 300) => String(s || '').slice(0, n);
(async () => {
  const h = await open();
  await h.eval(() => { const s = document.getElementById('rfp-answers').textContent; window.__LICENSE = (0, eval)(/const LICENSE=(\/[^\n]*?\/i);/.exec(s)[1]); });
  const explain = (items, inAnswer, owned) => h.eval(([items, inAnswer, owned]) => items.map(n => { const about = RFPAnswers.detect(n).filter(id => inAnswer.includes(id)); const lic = window.__LICENSE.test(n);
    return {item: n, licenseWord: (window.__LICENSE.exec(n) || [''])[0], detect: RFPAnswers.detect(n), aboutInAnswer: about, placed: lic && about.length && about.some(id => !owned.includes(id)) ? 'sells' : 'asks'}; }), [items, inAnswer, owned]);
  const assumptionsOf = ids => h.eval(ids => ids.map(id => { const t = CATALOG.find(x => x.id === id), c = REVIEW_CONCEPTS[id]; const a = (t || {}).assumptions || (c || {}).assumptions || '';
    return {id, name: RFP_CAT.lines[id].name, from: t && t.assumptions ? 'CATALOG (TPL)' : c && c.assumptions ? 'REVIEW_CONCEPTS (CON)' : 'none', inTPL: !!t, inCON: !!c, assumptions: a, firstTwoSentences: a ? a.split(/(?<=\.)\s+/).slice(0, 2) : []}; }), ids);
  const inAnswerOf = d => [...d.products.map(p => p.id), ...(d.conn ? d.conn.split('+') : [])];
  const out = {};

  // F1: a Coworker question that names Workfront reaches workfront+cw, whose first prerequisite bundles the license and Adobe's configuring work
  const QS = ['How would Coworker give our leaders readouts on request from Workfront?', 'Our leaders wait days for reports. Describe how Coworker could give them readouts on request.', 'How would Coworker in Real-Time CDP give our leaders readouts on request?'];
  out.F1 = [];
  for (const text of QS) { const r = await h.text(text); const d = r.questions[0].draft; const owned = await h.eval(() => [...RFPAnswers.ownedProducts()]);
    out.F1.push({text, conn: d && d.conn, products: d && d.products.map(p => p.id), lines: d && d.lines.map(l => l.id), sells: d && d.sells, asks: d && d.asks, owned, placement: d ? await explain([...d.sells, ...d.asks], inAnswerOf(d), owned) : [],
      opusQuoteUnder: d ? (d.sells.find(x => /Adobe's support or professional services team configures Coworker/.test(x)) ? 'Part of this proposal' : d.asks.find(x => /Adobe's support or professional services team configures Coworker/.test(x)) ? 'Ask your client for these' : 'not present') : 'no draft'}); }
  // every connection prerequisite that carries the quote
  out.F1_catalog = await h.eval(() => RFP_CAT.connections.flatMap(c => (c.prereqs || []).map((x, k) => ({conn: c.id, index: k, item: x})).filter(x => /support or professional services team configures Coworker/.test(x.item))));
  console.log('F1:', out.F1.filter(x => x.text).map(x => x.conn + ' -> ' + x.opusQuoteUnder));

  // F2: the SOW hand-off payload for bank 2.2 (captured through Storage.prototype.setItem before applyHandoff removes it)
  const bank = await h.file(FIX + '/bank_rfp.xlsx'); const q22 = bank.questions.find(q => q.label === '2.2');
  await h.setStatus(q22.i, 'used');
  await h.eval(() => { window.__ls = {}; const orig = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { window.__ls[k] = v; return orig.call(this, k, v); }; });
  await h.page.click('#rfp-to-sow'); await h.page.waitForTimeout(250);
  out.F2 = await h.eval(() => { const p = JSON.parse(window.__ls['abv-sow-handoff'] || 'null'); if (!p) return {captured: Object.keys(window.__ls)}; const on = p.lines.filter(l => l.on);
    return {products: p.products, names: p.names, play: p.play, lineCount: p.lines.length, onLines: on.map(l => ({id: l.id, name: l.name, stage: l.stage, origin: RFP_CAT.lines[l.id].origin || null, prereqs: l.prereqs})),
      carriesConnPrereqs: p.lines.some(l => /Prerequisites for/.test(l.prereqs)), carriesUsProcessing: p.lines.some(l => /United States/.test(l.prereqs)), toast: (document.querySelector('.toast, #toast') || {}).textContent || null, tabNow: location.hash}; });
  console.log('F2:', JSON.stringify(out.F2.onLines, null, 0).slice(0, 600), '| conn prereqs carried:', out.F2.carriesConnPrereqs, '| US processing carried:', out.F2.carriesUsProcessing);

  // F3: the assumptions behind the note items of the non-connection answers in C6.3 and C6.7, and the C06 assumption the connection path skips
  out.F3 = {bv_chatgpt: await assumptionsOf(['L02', 'L01', 'O01', 'O02']), bc_accounts: await assumptionsOf(['F02']), cw_readouts_and_mfgB3: await assumptionsOf(['CW01', 'CW02', 'CW03', 'CW05']), mfgB4_workfront: await assumptionsOf(['WF05', 'WF06', 'WF02', 'WF01']), bank22_lines: await assumptionsOf(['C01', 'C06', 'CJ03'])};
  console.log('F3 B.4 Workfront assumptions:', out.F3.mfgB4_workfront.map(x => x.id + ':' + x.from + ':' + first(x.assumptions, 60)));
  console.log('F3 C06 assumptions:', first(out.F3.bank22_lines[1].assumptions, 400));

  // F4: C6.4's hits split between the Client voice and OAuth terms
  const c64 = JSON.parse(fs.readFileSync(path.join(HERE, 'out_C6.4.json'), 'utf8'));
  const isOauth = x => /Client (ID|Secret)/.test(x) && !/\bthe Client\b(?! ID| Secret)|\bClient's\b|\bClient (provides|has|licenses|administrators|reviewers)/.test(x);
  out.F4 = {voiceHits: c64.hits.filter(x => !isOauth(x.item)), oauthTermHits: c64.hits.filter(x => isOauth(x.item))};
  out.F4.voiceDistinct = [...new Set(out.F4.voiceHits.map(x => x.item))];
  out.F4.voiceByHeading = {sells: out.F4.voiceHits.filter(x => x.heading === 'Part of this proposal').length, asks: out.F4.voiceHits.filter(x => x.heading === 'Ask your client for these').length};
  console.log('F4: voice hits', out.F4.voiceHits.length, 'distinct', out.F4.voiceDistinct.length, out.F4.voiceByHeading, '| OAuth-term hits', out.F4.oauthTermHits.length);

  // F5: retail Q4's owned products (why the license items are asks there) and Q1's wording that marks Commerce owned
  const retail = await h.file(FIX + '/retail_rfi.docx');
  out.F5 = {owned: await h.eval(() => [...RFPAnswers.ownedProducts()]), q1: retail.questions.find(q => q.label === 'Q1').text, q4: (q => ({sells: q.draft.sells, asks: q.draft.asks, conn: q.draft.conn}))(retail.questions.find(q => q.label === 'Q4'))};
  out.F5.placementIfNothingOwned = await explain([...out.F5.q4.sells, ...out.F5.q4.asks], ['commerce', 'eds'], []);
  console.log('F5: retail owned', out.F5.owned, '| Q4 items that would be sells with nothing owned:', out.F5.placementIfNothingOwned.filter(x => x.placed === 'sells').map(x => first(x.item, 70)));

  save('out_followup.json', out);
  if (h.errors.length) { save('out_followup_page_errors.json', h.errors); console.log('PAGE ERRORS', h.errors); }
  await h.close();
})().catch(e => { console.error(e); process.exit(1); });
