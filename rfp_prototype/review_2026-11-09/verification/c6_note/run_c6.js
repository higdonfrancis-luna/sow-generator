// Cluster c6_note: reproduces the reviewers' claims about the partner note (compose's sells and asks, LICENSE, the six-item
// cap, line requirements, typed facts) against the built prototype, through the review harness. Every count, label,
// product, connection, line id, section and note item comes from the page's own RFPBuilder.load / RFPAnswers.compose
// (h.file, h.text, h.read, h.doc, h.rows, h.asks, h.panel). The closure-only pieces (LICENSE, OWNS) are read back from the
// shipped script's own text in the page and re-evaluated there; CATALOG and REVIEW_CONCEPTS are the page's own globals.
// Run: node /home/user/warroom/sow/rfp_prototype/review_2026-11-09/verification/c6_note/run_c6.js
// Writes inputs.json and out_<claim>.json beside this file, and prints a condensed summary.
const fs = require('fs'), path = require('path');
const {open} = require('/home/user/warroom/sow/rfp_prototype/review_2026-11-09/harness.js');
const HERE = __dirname, FIX = '/home/user/warroom/sow/qa/rfp_fixtures';
const save = (n, o) => fs.writeFileSync(path.join(HERE, n), JSON.stringify(o, null, 1));
const inputs = {};
const note = (claim, name, input) => { (inputs[claim] = inputs[claim] || []).push({name, input}); };
const first = (s, n = 300) => String(s || '').slice(0, n);
const CLIENT = /\bthe Client\b|\bClient's\b|\bClient\b/;
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

(async () => {
  const h = await open();
  const log = (...a) => console.log(...a);

  // the closure constants, read from the shipped script's text and re-evaluated in the page
  const consts = await h.eval(() => {
    const s = document.getElementById('rfp-answers').textContent;
    const lic = /const LICENSE=(\/[^\n]*?\/i);/.exec(s), owns = /const OWNS=(\/[^\n]*?\/i);/.exec(s);
    window.__LICENSE = (0, eval)(lic[1]); window.__OWNS = (0, eval)(owns[1]);
    const need = /let need=\[\];\n([\s\S]*?)const owned=ownedProducts\(\)/.exec(s);
    const split = /const sells=\[\],asks=\[\];\n([\s\S]*?)return \{m,sections/.exec(s);
    return {LICENSE: lic[1], OWNS: owns[1], needRule: need && need[1], splitRule: split && split[1]};
  });
  save('out_consts.json', consts);

  // why each need item landed where it did, by the shipped rule, for a given draft
  const explain = (items, inAnswer, owned) => h.eval(([items, inAnswer, owned]) => items.map(n => {
    const about = RFPAnswers.detect(n).filter(id => inAnswer.includes(id));
    const lic = window.__LICENSE.test(n), licWord = (window.__LICENSE.exec(n) || [''])[0];
    const sells = lic && about.length && about.some(id => !owned.includes(id));
    return {item: n, licenseMatch: lic, licenseWord: licWord, detect: RFPAnswers.detect(n), aboutInAnswer: about, ownedAmongAbout: about.filter(id => owned.includes(id)), placed: sells ? 'sells (Part of this proposal)' : 'asks (Ask your client for these)'};
  }), [items, inAnswer, owned]);
  const owned = () => h.eval(() => [...RFPAnswers.ownedProducts()]);
  const inAnswerOf = d => [...d.products.map(p => p.id), ...(d.conn ? d.conn.split('+') : [])];
  const byLabel = (r, label) => r.questions.find(q => q.label === label);
  const slim = d => d && {products: d.products.map(p => p.id + ' (' + p.name + ')'), conn: d.conn, fromContext: d.fromContext,
    lines: d.lines.map(l => l.id + ': ' + l.name + ' [' + l.unit + ']'), sections: d.sections, plain: d.plain, sells: d.sells, asks: d.asks};
  // the section of a response document or checklist for one question label
  const sectionFor = (html, label) => { const parts = html.split('<section>').slice(1).map(s => s.split('</section>')[0]); return parts.find(p => p.startsWith('<h3>' + esc(label) + ' ')) || null; };

  /* ===== C6.1: bank 2.2 asks what the client must supply; the response has no prerequisites ===== */
  log('\n== C6.1');
  note('C6.1', 'bank_rfp.xlsx', FIX + '/bank_rfp.xlsx');
  let bank = await h.file(FIX + '/bank_rfp.xlsx');
  let q22 = byLabel(bank, '2.2');
  const doc1 = await h.doc(), rows1 = await h.rows(), asks1 = await h.asks();
  const d22 = q22.draft;
  const responseText = d22.sections.map(([hd, items]) => hd + ' ' + items.join(' ')).join(' ');
  const c61 = {
    file: 'bank_rfp.xlsx', status: bank.status, count: bank.count, owned: await owned(),
    q22: {i: q22.i, label: q22.label, text: q22.text, kind: q22.kind},
    draft: slim(d22),
    sectionHeadings: d22.sections.map(s => s[0]),
    asksHasCdnAccessLogs: d22.asks.some(x => /CDN access logs/.test(x)),
    asksCdnItem: d22.asks.find(x => /CDN access logs/.test(x)) || null,
    responseMentionsCdn: /\bCDN\b/i.test(responseText), responseCdnPhrases: (responseText.match(/[^.]*\bCDN\b[^.]*\./gi) || []),
    responseMentionsForwarding: /forward/i.test(responseText), responseMentionsLogs: /\blogs?\b/i.test(responseText),
    responseSaysClientMustSupply: /\b(you (will )?(need|must|supply|provide|forward)|we need from you|from you\b)/i.test(responseText),
    prereqWordsInResponse: d22.asks.concat(d22.sells).filter(x => responseText.includes(x)),
    responseDocSection22: sectionFor(doc1, '2.2'), responseRow22: rows1.rows.find(r => r[0] === '2.2'), asksDocSection22: sectionFor(asks1, '2.2'),
  };
  save('out_C6.1.json', c61);
  log('2.2 headings:', c61.sectionHeadings, '| asks has CDN access logs:', c61.asksHasCdnAccessLogs, '| response mentions CDN:', c61.responseMentionsCdn, c61.responseCdnPhrases);
  log('sells:', d22.sells.length, 'asks:', d22.asks.length, 'lines:', d22.lines.map(l => l.id));

  /* ===== C6.2: the six-item cap, the dropped bv-cja items, line ext and tier ===== */
  log('\n== C6.2');
  const cap = await h.eval(() => {
    const P = Object.fromEntries(RFP_CAT.products.map(p => [p.id, p]));
    const all = RFP_CAT.connections, live = all.filter(c => P[c.a] && P[c.b]);
    const over = live.filter(c => (c.prereqs || []).length > 6).map(c => ({id: c.id, conn: c.a + '+' + c.b, n: c.prereqs.length, dropped: c.prereqs.slice(6), droppedLicense: c.prereqs.slice(6).filter(x => window.__LICENSE.test(x))}));
    return {connections: all.length, connectionsLive: live.length, overSix: over.length, over, byCount: live.reduce((m, c) => { const k = (c.prereqs || []).length; m[k] = (m[k] || 0) + 1; return m; }, {})};
  });
  const bvcja = await h.eval(() => RFP_CAT.connections.find(c => c.id === 'bv-cja').prereqs);
  const shown = [...d22.sells, ...d22.asks];
  const lineReq = await h.eval(ids => ids.map(id => ({id, name: RFP_CAT.lines[id].name, unit: RFP_CAT.lines[id].unit, origin: RFP_CAT.lines[id].origin || null, ext: RFP_CAT.lines[id].ext || null, tier: RFP_CAT.lines[id].tier || null, scope: RFP_CAT.lines[id].scope || null})), d22.lines.map(l => l.id));
  const noteText = shown.join(' '), respText = d22.plain;
  const c62 = {
    capRule: 'compose: if(m.conn)need=(m.conn.prereqs||[]).slice(0,6)', connections: cap.connections, connectionsLive: cap.connectionsLive, overSix: cap.overSix, byPrereqCount: cap.byCount,
    overSixList: cap.over.map(o => o.id + ' (' + o.n + ')'), overSixDetail: cap.over,
    bvcjaPrereqs: bvcja, bvcjaCount: bvcja.length, shownInNote: shown, shownCount: shown.length,
    notShown: bvcja.filter(x => !shown.includes(x)),
    lines: lineReq,
    c06InDraft: d22.lines.some(l => l.id === 'C06'),
    c06LineText: d22.sections.flatMap(s => s[1]).find(x => /Real-Time Customer Profile/.test(x)) || null,
    noteMentionsRtcdpOrAjo: /Real-Time CDP|Journey Optimizer/.test(noteText), responseMentionsRtcdpOrAjo: /Real-Time CDP|Journey Optimizer/.test(respText),
    noteMentionsTier: /CJA Select/.test(noteText), responseMentionsTier: /CJA Select/.test(respText),
    tierInAsksViaDerivedField: d22.asks.filter(x => /CJA Select/.test(x)),
  };
  save('out_C6.2.json', c62);
  log('over six:', cap.overSix, c62.overSixList);
  log('bv-cja not shown:', c62.notShown);
  log('lines:', lineReq.map(l => l.id + ' ext=' + l.ext + ' tier=' + l.tier), '| C06 in draft:', c62.c06InDraft, '| note says RTCDP/AJO:', c62.noteMentionsRtcdpOrAjo, '| response says:', c62.responseMentionsRtcdpOrAjo);

  /* ===== C6.3: wrong boxes ===== */
  log('\n== C6.3');
  const Q63 = [
    ['bc_accounts', "How would Brand Concierge answer our customers' questions about accounts and rates?"],
    ['cw_readouts', 'How would Coworker give our leaders readouts on request?'],
    ['bv_chatgpt', 'Describe how Brand Visibility shows where our brand appears in ChatGPT answers.'],
    ['assets_cif', 'How would approved AEM Assets images reach Adobe Commerce product pages through the CIF add-on?'],
    ['commerce_aem', 'How does Adobe Commerce connect to AEM Sites?'],
  ];
  const c63 = {LICENSE: consts.LICENSE, splitRule: consts.splitRule.trim(), needRule: consts.needRule.trim(), runs: []};
  const TARGETS = [/The Client has licensed Brand Concierge/, /Adobe's support or professional services team configures Coworker/, /Shared strategy work is reused across related domains/, /CIF add-on provisioned by Adobe/];
  for (const [name, text] of Q63) {
    note('C6.3', name, text);
    const r = await h.text(text);
    const q = r.questions[0], d = q && q.draft;
    const own = await owned();
    const ex = d ? await explain([...d.sells, ...d.asks], inAnswerOf(d), own) : [];
    const hits = [];
    for (const t of TARGETS) { for (const x of (d ? d.sells : [])) if (t.test(x)) hits.push({pattern: t.source, heading: 'Part of this proposal', item: x}); for (const x of (d ? d.asks : [])) if (t.test(x)) hits.push({pattern: t.source, heading: 'Ask your client for these', item: x}); }
    c63.runs.push({name, text, count: r.count, kind: q && q.kind, owned: own, draft: slim(d), placement: ex, quotedTextsFound: hits});
    log(name, '| conn:', d && d.conn, '| products:', d && d.products.map(p => p.id), '| sells:', d && d.sells.length, '| asks:', d && d.asks.length, '| hits:', hits.map(x => x.heading + ': ' + first(x.item, 60)));
  }
  save('out_C6.3.json', c63);

  /* ===== C6.4: "the Client" in the note ===== */
  log('\n== C6.4');
  const c64 = {rule: 'note items are the raw prereqs (m.conn.prereqs) or raw TPL/CON assumptions; neither passes through rfp()', files: [], pasted: [], hits: [], lowercaseClientHits: []};
  const addHits = (source, r) => {
    for (const q of r.questions) { const d = q.draft; if (!d) continue;
      for (const [heading, items] of [['Part of this proposal', d.sells], ['Ask your client for these', d.asks]]) for (const x of items) {
        if (CLIENT.test(x)) c64.hits.push({source, label: q.label, question: first(q.text, 120), conn: d.conn, heading, item: x});
        if (/\bthe client\b|\bclient's\b/.test(x)) c64.lowercaseClientHits.push({source, label: q.label, heading, item: x});
      } }
  };
  for (const f of ['bank_rfp.xlsx', 'bank_rfp.txt', 'retail_rfi.docx', 'mfg_rfp.pdf']) {
    note('C6.4', f, FIX + '/' + f);
    const r = await h.file(FIX + '/' + f);
    c64.files.push({file: f, status: r.status, count: r.count, drafted: r.questions.filter(q => q.draft).map(q => q.label), owned: await owned(),
      notes: r.questions.filter(q => q.draft).map(q => ({label: q.label, conn: q.draft.conn, products: q.draft.products.map(p => p.id), sells: q.draft.sells, asks: q.draft.asks}))});
    addHits(f, r);
  }
  for (const [name, text] of Q63) { const r = await h.text(text); c64.pasted.push({name, text, sells: r.questions[0].draft && r.questions[0].draft.sells, asks: r.questions[0].draft && r.questions[0].draft.asks}); addHits('pasted:' + name, r); }
  // the whole catalog: every connection's first six prerequisites that say Client, and where they would land with nothing owned
  c64.catalogWide = await h.eval(() => { const out = []; for (const c of RFP_CAT.connections) (c.prereqs || []).forEach((x, k) => { if (/\bClient\b/.test(x)) { const about = RFPAnswers.detect(x).filter(id => id === c.a || id === c.b); out.push({conn: c.id, index: k, shownUnderCap: k < 6, item: x, placedWithNothingOwned: window.__LICENSE.test(x) && about.length ? 'sells' : 'asks'}); } }); return out; });
  save('out_C6.4.json', c64);
  log('Client hits in fixtures + pasted:', c64.hits.length); for (const x of c64.hits) log(' ', x.source, x.label, '|', x.heading, '|', first(x.item, 110));
  log('catalog-wide prereqs saying Client:', c64.catalogWide.length, 'of which under the cap:', c64.catalogWide.filter(x => x.shownUnderCap).length);

  /* ===== C6.5: typed facts ===== */
  log('\n== C6.5');
  bank = await h.file(FIX + '/bank_rfp.xlsx'); q22 = byLabel(bank, '2.2');
  note('C6.5', 'bank_rfp.xlsx 2.2: setFact(i,0,"Yes")', {i: q22.i, k: 0, text: 'Yes'});
  await h.setFact(q22.i, 0, 'Yes');
  let r = await h.read(); let d = byLabel(r, '2.2').draft;
  const factSection = d.plain.split('\n\n').find(s => s.startsWith('What you have in place')) || null;
  const docA = await h.doc(), rowsA = await h.rows(), asksA = await h.asks();
  const c65 = {
    i: q22.i, asks: d.asks, ask0: d.asks[0], sells: d.sells,
    afterFact0: {plainSection: factSection, plainTail: d.plain.split('Sources')[0].slice(-400), docSection22: sectionFor(docA, '2.2'), row22: rowsA.rows.find(x => x[0] === '2.2'), asksDocSection22: sectionFor(asksA, '2.2'),
      factHasSubject: /An? |[A-Z][a-z]+ (is|are|has|have)/.test('Yes'), docSaysYouHave: /You have an Experience Platform user|You have/.test(docA)},
  };
  // the screen: select 2.2 and read the rendered body
  await h.select(q22.i);
  c65.afterFact0.screenBody = await h.eval(() => (document.getElementById('rfp-body') || {}).textContent);
  // then Edit (harness path: setAnswer) and a later fact
  note('C6.5', 'then setAnswer(i,"Our own words.") and setFact(i,1,"An AEP user is in place.")', {i: q22.i, answer: 'Our own words.', k: 1, text: 'An AEP user is in place.'});
  await h.setAnswer(q22.i, 'Our own words.');
  await h.setFact(q22.i, 1, 'An AEP user is in place.');
  const docB = await h.doc(), rowsB = await h.rows(), asksB = await h.asks();
  c65.afterEditThenFact1 = {docSection22: sectionFor(docB, '2.2'), factInDoc: docB.includes('An AEP user is in place.'), factInRows: JSON.stringify(rowsB.rows.find(x => x[0] === '2.2')).includes('An AEP user is in place.'), row22: rowsB.rows.find(x => x[0] === '2.2'),
    factInAsksDoc: asksB.includes('An AEP user is in place.'), asksDocSection22: sectionFor(asksB, '2.2'), state: await h.eval(i => { const q = RFPBuilder.state.questions[i]; return {answer: q.answer, status: q.status, facts: q.facts}; }, q22.i)};
  // the real UI path: fresh load, select 2.2, click Edit, click Save and use, then type a fact into the note's field
  bank = await h.file(FIX + '/bank_rfp.xlsx'); q22 = byLabel(bank, '2.2');
  note('C6.5', 'UI path: select 2.2, click Edit, click Save and use, type into .rfp-fact[data-i=1]', {i: q22.i, typed: 'An AEP user is in place.'});
  await h.select(q22.i);
  await h.page.click('#rfp-edit-btn'); await h.page.waitForTimeout(80);
  const editPrefill = await h.eval(() => document.getElementById('rfp-edit').value);
  await h.page.click('#rfp-save-edit'); await h.page.waitForTimeout(80);
  const noteStillShown = await h.eval(() => !!document.querySelector('#rfp-answer .rfp-partner-note'));
  const fieldCount = await h.eval(() => document.querySelectorAll('#rfp-answer .rfp-fact').length);
  await h.page.fill('#rfp-answer .rfp-fact[data-i="1"]', 'An AEP user is in place.'); await h.page.waitForTimeout(80);
  const docC = await h.doc(), rowsC = await h.rows(), asksC = await h.asks();
  c65.uiPath = {editPrefillHead: first(editPrefill, 200), editPrefillHasFactsSection: editPrefill.includes('What you have in place'), noteStillShownAfterSave: noteStillShown, factFields: fieldCount,
    stateAfterTyping: await h.eval(i => { const q = RFPBuilder.state.questions[i]; return {answerHead: String(q.answer || '').slice(0, 80), status: q.status, facts: q.facts}; }, q22.i),
    screenBodyHasFact: (await h.eval(() => (document.getElementById('rfp-body') || {}).textContent || '')).includes('An AEP user is in place.'),
    factInDoc: docC.includes('An AEP user is in place.'), factInRows: JSON.stringify(rowsC.rows.find(x => x[0] === '2.2')).includes('An AEP user is in place.'), factInAsksDoc: asksC.includes('An AEP user is in place.'),
    onScreenPromise: await h.eval(() => { const p = [...document.querySelectorAll('#rfp-answer .rfp-partner-note p')].map(x => x.textContent); return p; })};
  // facts typed before Edit are frozen into the edited text
  bank = await h.file(FIX + '/bank_rfp.xlsx'); q22 = byLabel(bank, '2.2');
  await h.setFact(q22.i, 0, 'Yes'); await h.select(q22.i); await h.page.click('#rfp-edit-btn'); await h.page.waitForTimeout(80);
  c65.factBeforeEdit = {prefillTail: (await h.eval(() => document.getElementById('rfp-edit').value)).split('Sources')[0].slice(-200)};
  await h.page.click('#rfp-cancel-edit'); await h.page.waitForTimeout(50);
  save('out_C6.5.json', c65);
  log('fact section after Yes:', JSON.stringify(factSection), '| screen body has fact:', (c65.afterFact0.screenBody || '').includes('What you have in place'));
  log('after Edit then fact: in doc', c65.afterEditThenFact1.factInDoc, '| in rows', c65.afterEditThenFact1.factInRows, '| in asks doc', c65.afterEditThenFact1.factInAsksDoc);
  log('UI path: note still shown', noteStillShown, 'fields', fieldCount, '| in doc', c65.uiPath.factInDoc, '| in rows', c65.uiPath.factInRows, '| screen body has fact', c65.uiPath.screenBodyHasFact);

  /* ===== C6.6: the note's heading, and that none of it reaches the downloads ===== */
  log('\n== C6.6');
  const c66 = {perFile: [], leaks: {doc: [], rows: []}, noteItemsChecked: 0};
  for (const f of ['bank_rfp.xlsx', 'retail_rfi.docx', 'mfg_rfp.pdf']) {
    const r = await h.file(FIX + '/' + f);
    const q = r.questions.find(x => x.draft && (x.draft.sells.length || x.draft.asks.length));
    await h.select(q.i);
    const screen = await h.eval(() => { const n = document.querySelector('#rfp-answer .rfp-partner-note'); return n && {h4: n.querySelector('h4').textContent, paragraphs: [...n.querySelectorAll('p')].map(p => p.textContent), sells: [...n.querySelectorAll('.rfp-sells li')].map(x => x.textContent), asks: [...n.querySelectorAll('.rfp-asks li')].map(x => x.childNodes[0].textContent), placeholder: (n.querySelector('.rfp-fact') || {}).placeholder, ariaLabel: (n.querySelector('.rfp-fact') || {}).getAttribute && n.querySelector('.rfp-fact').getAttribute('aria-label'), voiceLabel: (document.querySelector('#rfp-answer .rfp-voice') || {}).textContent}; });
    const doc = await h.doc(), rows = await h.rows(), asks = await h.asks();
    const docText = doc, rowsText = JSON.stringify(rows.rows);
    const fixed = ['Notes for you, not for the client', 'Part of this proposal', 'Ask your client for these', 'Will confirm with the client', 'What the client says about'];
    const fixedLeaks = {doc: fixed.filter(s => docText.includes(s)), rows: fixed.filter(s => rowsText.includes(s)), asksDoc: fixed.filter(s => asks.includes(s))};
    for (const qq of r.questions) { if (!qq.draft) continue; for (const x of [...qq.draft.sells, ...qq.draft.asks]) { c66.noteItemsChecked++;
      if (docText.includes(esc(x))) c66.leaks.doc.push({file: f, label: qq.label, item: x});
      if (rowsText.includes(JSON.stringify(x).slice(1, -1))) c66.leaks.rows.push({file: f, label: qq.label, item: x}); } }
    c66.perFile.push({file: f, selected: q.label, screen, fixedStringLeaks: fixedLeaks, asksDocIntro: (/<p class="intro">(.*?)<\/p>/.exec(asks) || [])[1], responseDocIntro: (/<p class="intro">(.*?)<\/p>/.exec(doc) || [])[1]});
    log(f, q.label, '| h4:', screen && screen.h4, '| fixed leaks:', JSON.stringify(fixedLeaks));
  }
  // the styling, from the patch and the built page
  const patch = fs.readFileSync('/home/user/warroom/sow/patch_step49.py', 'utf8'), built = fs.readFileSync('/home/user/warroom/sow/rfp_prototype/site/index.html', 'utf8');
  c66.css = {patch: (patch.match(/\.rfp-partner-note[^\n]*/g) || []), built: (built.match(/\.rfp-partner-note\{[^}]*\}/g) || []), voice: (patch.match(/\.rfp-voice\{[^}]*\}/g) || []), fact: (patch.match(/\.rfp-fact,#rfp-firm\{[^}]*\}/g) || []), placeholder: (patch.match(/\.rfp-fact::placeholder[^\n]*/g) || [])};
  c66.onScreenExclusionWording = {heading: c66.perFile[0].screen.h4, paragraphs: c66.perFile[0].screen.paragraphs, saysExcludedFromDownloads: c66.perFile[0].screen.paragraphs.some(p => /download|export|Excel/i.test(p)), saysStaysOut: c66.perFile[0].screen.paragraphs.filter(p => /stays out/.test(p))};
  save('out_C6.6.json', c66);
  log('note items checked:', c66.noteItemsChecked, '| leaks into response doc:', c66.leaks.doc.length, '| into rows:', c66.leaks.rows.length);

  /* ===== C6.7: non-connection answers draw on template assumptions ===== */
  log('\n== C6.7');
  const c67 = {rule: consts.needRule.trim(), cases: []};
  const assumptionsOf = ids => h.eval(ids => ids.map(id => { const t = CATALOG.find(x => x.id === id), c = REVIEW_CONCEPTS[id]; const a = (t || {}).assumptions || (c || {}).assumptions || ''; return {id, name: RFP_CAT.lines[id].name, from: t && t.assumptions ? 'CATALOG (TPL)' : c && c.assumptions ? 'REVIEW_CONCEPTS (CON)' : 'none', assumptions: a, firstTwoSentences: a ? a.split(/(?<=\.)\s+/).slice(0, 2) : []}; }), ids);
  for (const [f, label] of [['mfg_rfp.pdf', 'B.3'], ['mfg_rfp.pdf', 'B.4'], ['retail_rfi.docx', 'Q4']]) {
    note('C6.7', f + ' ' + label, FIX + '/' + f);
    const r = await h.file(FIX + '/' + f), q = byLabel(r, label), d = q.draft;
    const own = await owned();
    const src = d ? await assumptionsOf(d.lines.map(l => l.id)) : [];
    const ex = d ? await explain([...d.sells, ...d.asks], inAnswerOf(d), own) : [];
    c67.cases.push({file: f, label, text: q.text, kind: q.kind, owned: own, draft: slim(d), assumptionSources: src, placement: ex,
      itemOrigin: d ? [...d.sells, ...d.asks].map(x => ({item: x, fromLine: (src.find(s => s.firstTwoSentences.includes(x)) || {}).id || null})) : []});
    log(f, label, '| conn:', d && d.conn, '| lines:', d && d.lines.map(l => l.id), '| sells:', d && d.sells, '| asks:', d && d.asks);
  }
  save('out_C6.7.json', c67);

  /* ===== extras ===== */
  log('\n== extras');
  // X1: catalog-wide placement of every connection's prerequisites with nothing owned: client duties under sells, Adobe's work under asks, cap drops
  const x1 = await h.eval(() => {
    const out = {sellsSayingClient: [], asksAdobeDoes: [], sellsAdobeDoes: [], cappedTotal: 0, cappedConns: [], perConn: []};
    const ADOBE_DOES = /provisioned by Adobe|Adobe('s)? (support|professional services|onboarding|team|account team)|Adobe (enables|provisions|configures|turns on|sets up|installs|must|confirms|allocates)|by Adobe\b|from Adobe\b|Adobe-provisioned/i;
    for (const c of RFP_CAT.connections) { const pre = c.prereqs || []; const shown = pre.slice(0, 6); const sells = [], asks = [];
      for (const n of shown) { const about = RFPAnswers.detect(n).filter(id => id === c.a || id === c.b); (window.__LICENSE.test(n) && about.length ? sells : asks).push(n); }
      if (pre.length > 6) { out.cappedTotal += pre.length - 6; out.cappedConns.push(c.id); }
      for (const n of sells) { if (/\bClient\b/.test(n)) out.sellsSayingClient.push({conn: c.id, item: n}); if (ADOBE_DOES.test(n)) out.sellsAdobeDoes.push({conn: c.id, item: n}); }
      for (const n of asks) if (ADOBE_DOES.test(n)) out.asksAdobeDoes.push({conn: c.id, item: n, licenseMatch: window.__LICENSE.test(n), detect: RFPAnswers.detect(n)});
      out.perConn.push({conn: c.id, sells, asks}); }
    return out; });
  save('out_X1_catalog_placement.json', x1);
  log('X1: sells saying Client:', x1.sellsSayingClient.length, '| asks that are Adobe\'s work:', x1.asksAdobeDoes.length, '| sells that are Adobe\'s work:', x1.sellsAdobeDoes.length, '| prereqs dropped by the cap:', x1.cappedTotal, 'on', x1.cappedConns.length, 'connections');
  // X2: the checklist's intro says nothing in it is in the response, but a typed fact is in both
  bank = await h.file(FIX + '/bank_rfp.xlsx'); q22 = byLabel(bank, '2.2');
  await h.setFact(q22.i, 1, 'An AEP user is in place.');
  const docX = await h.doc(), asksX = await h.asks();
  const x2 = {asksDocIntro: (/<p class="intro">(.*?)<\/p>/.exec(asksX) || [])[1], factInAsksDoc: asksX.includes('An AEP user is in place.'), factInResponseDoc: docX.includes('An AEP user is in place.'), asksDocSection22: sectionFor(asksX, '2.2')};
  save('out_X2_checklist_intro.json', x2);
  log('X2: fact in checklist', x2.factInAsksDoc, '| in response', x2.factInResponseDoc);
  // X3: a pile change drops the draft, status and answer but keeps the typed facts
  const x3 = await h.eval(i => { const q = RFPBuilder.state.questions[i]; const before = {facts: JSON.parse(JSON.stringify(q.facts || null)), hasDraft: !!q.draft};
    const sel = document.querySelector(`#rfp-questions li[data-i="${i}"] select.rfp-kind`); sel.value = 'firm'; sel.dispatchEvent(new Event('change', {bubbles: true}));
    const mid = {kind: q.kind, hasDraft: !!q.draft, facts: JSON.parse(JSON.stringify(q.facts || null))};
    const sel2 = document.querySelector(`#rfp-questions li[data-i="${i}"] select.rfp-kind`); sel2.value = 'adobe'; sel2.dispatchEvent(new Event('change', {bubbles: true}));
    const d = RFPBuilder.state.questions[i].draft || RFPAnswers.compose(q);
    return {before, afterToFirm: mid, afterBack: {kind: q.kind, facts: q.facts, plainHasFact: RFPAnswers.plain(d, q).includes('An AEP user is in place.')}, handler: "q.kind=s.value;delete q.draft;delete q.status;delete q.answer; (q.facts is not deleted)"}; }, q22.i);
  save('out_X3_pile_change_keeps_facts.json', x3);
  log('X3: facts after pile change to firm and back:', JSON.stringify(x3.afterBack.facts), '| back in the response:', x3.afterBack.plainHasFact);
  // X4: the SOW hand-off: what C06 and the connection carry into the statement of work (toSow writes localStorage and switches tabs)
  bank = await h.file(FIX + '/bank_rfp.xlsx'); q22 = byLabel(bank, '2.2');
  await h.setStatus(q22.i, 'used');
  await h.page.click('#rfp-to-sow'); await h.page.waitForTimeout(200);
  const x4 = await h.eval(() => { const p = JSON.parse(localStorage.getItem('abv-sow-handoff') || 'null'); if (!p) return null; const on = p.lines.filter(l => l.on); return {products: p.products, play: p.play, onLines: on.map(l => ({id: l.id, name: l.name, stage: l.stage, prereqs: l.prereqs})), c01Origin: RFP_CAT.lines.C01.origin || null, c06Origin: RFP_CAT.lines.C06.origin || null, anyCarriesUsProcessing: p.lines.some(l => /United States/.test(l.prereqs)), anyCarriesConnPrereqs: p.lines.some(l => /Prerequisites for/.test(l.prereqs))}; });
  save('out_X4_sow_handoff.json', x4);
  log('X4: SOW hand-off on lines:', x4 && x4.onLines.map(l => l.id + ': ' + l.prereqs), '| carries connection prereqs:', x4 && x4.anyCarriesConnPrereqs, '| US processing:', x4 && x4.anyCarriesUsProcessing);

  save('inputs.json', inputs);
  if (h.errors.length) { save('out_page_errors.json', h.errors); log('PAGE ERRORS', h.errors); }
  await h.close();
})().catch(e => { console.error(e); process.exit(1); });
