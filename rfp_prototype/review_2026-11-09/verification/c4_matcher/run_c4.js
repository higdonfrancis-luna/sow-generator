// Cluster c4_matcher: reproduces the reviewers' claims about the answer matcher (detect, ALIASES, match, compose,
// ownedProducts, sources) against the built prototype, through the review harness. Every pile, product, connection,
// line and drafted text comes from the page's own RFPBuilder.load / RFPAnswers.compose (h.text, h.file, h.detect,
// h.classify). The per-candidate scores come from an instrumented copy of the shipped rfp-answers script evaluated in
// the same page: the same code with three probe lines (detect's score table, match's connection list, match's
// candidate list) and the UI wiring stripped, exported as window.RFPDbg.
// Run: node /home/user/warroom/sow/rfp_prototype/review_2026-11-09/verification/c4_matcher/run_c4.js
// Writes inputs.json and out_<claim>.json beside this file, and prints a condensed summary.
const fs = require('fs'), path = require('path');
const {open} = require('/home/user/warroom/sow/rfp_prototype/review_2026-11-09/harness.js');
const HERE = __dirname, FIX = '/home/user/warroom/sow/qa/rfp_fixtures';
const save = (n, o) => fs.writeFileSync(path.join(HERE, n), JSON.stringify(o, null, 1));
const inputs = {};
const note = (claim, name, input) => { (inputs[claim] = inputs[claim] || []).push({name, input}); };
const first = (s, n) => String(s || '').slice(0, n);

(async () => {
  const h = await open();

  // the instrumented copy of the shipped script (identical code, three probe lines, no wiring)
  const dbgType = await h.eval(() => {
    let s = document.getElementById('rfp-answers').textContent;
    const once = (a) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error('anchor x' + n + ': ' + a.slice(0, 50)); };
    const rep = (a, b) => { once(a); s = s.replace(a, b); };
    const EXP = 'window.RFPAnswers={match,compose,rfp,plain,doLine,toSow,responseDoc,asksDoc,responseRows,ownedProducts,context,detect};';
    once(EXP); once('/* ---------- wiring */');
    const i = s.indexOf('/* ---------- wiring */'), j = s.indexOf(EXP);
    s = s.slice(0, i) + 'window.RFPDbg={match,compose,rfp,plain,doLine,ownedProducts,context,detect,sources,tokens,P,C,LN,TPL,CON,ALIASES,STOP,GENERIC,ONGOING,LICENSE,OWNS};' + s.slice(j + EXP.length);
    rep('return Object.entries(score).sort(', 'window.__detectScore=score;return Object.entries(score).sort(');
    rep('const conn=conns.length?conns[0].c:null;', 'window.__conns=conns.map(x=>({conn:x.c.a+"+"+x.c.b,id:x.c.id,s:x.s}));const conn=conns.length?conns[0].c:null;');
    rep('cands.push({id:l,s,hit,isDefault});}}', 'cands.push({id:l,s,hit,isDefault,nameHit,monthly,owner:isConn?o.a+"+"+o.b:o.id});}}window.__cands=cands.slice();');
    (0, eval)(s);
    return typeof window.RFPDbg;
  });
  if (dbgType !== 'object') throw new Error('instrumented copy did not install');

  // the scoring behind one question, with the page's current question list as context (what compose() passes)
  const dbgMatch = (q) => h.eval((q) => {
    const D = window.RFPDbg; window.__conns = null; window.__cands = null; window.__detectScore = null;
    const ctx = D.context(); const m = D.match(q, ctx); const qt = D.tokens(q);
    const inter = (a, b) => a.filter(x => b.includes(x));
    return {detectScore: window.__detectScore, detectOrder: D.detect(q), qtokens: qt, ongoing: D.ONGOING.test(q), context: ctx,
      products: m.products, conn: m.conn ? m.conn.a + '+' + m.conn.b : null, fromContext: m.fromContext, lines: m.lines, conns: window.__conns,
      cands: (window.__cands || []).map(c => { const L = D.LN[c.id]; const scope = L.scope || (D.TPL[c.id] || {}).scope || '';
        return {...c, name: L.name, unit: L.unit, nameTokensInQ: inter(D.tokens(L.name), qt), scopeTokensInQ: inter(D.tokens(scope), qt)}; })};
  }, q);

  const slim = (d) => d && {products: d.products.map(p => p.id + ' (' + p.name + ')'), conn: d.conn, fromContext: d.fromContext,
    lines: d.lines.map(l => l.id + ': ' + l.name + ' [' + l.unit + ']'), sections: d.sections, plain: d.plain, sources: d.sources, sells: d.sells, asks: d.asks};

  // one pasted question: the page's pile and draft, what compose() would draft whatever the pile, and the scoring
  async function probe(claim, name, text) {
    note(claim, name, text);
    const r = await h.text(text, 'pasted.txt');
    const forced = await h.eval((t) => { const d = RFPAnswers.compose({text: t}); if (!d) return null;
      return {products: d.m.products, conn: d.m.conn ? d.m.conn.a + '+' + d.m.conn.b : null, fromContext: !!d.m.fromContext, lines: d.m.lines, plain: RFPAnswers.plain(d, {text: t})}; }, text);
    return {name, text, count: r.count, status: r.status, classify: await h.classify(text), detect: await h.detect(text),
      questions: r.questions.map(q => ({label: q.label, text: q.text, kind: q.kind, draft: slim(q.draft)})), composeAnyPile: forced, scoring: await dbgMatch(text)};
  }
  const summary = (p) => { const q = p.questions[0]; const d = q && q.draft;
    return `${p.name}: found=${p.count} pile=${q ? q.kind : '-'} detect=[${p.detect}] products=[${d ? d.products.map(x => x.split(' ')[0]) : (p.composeAnyPile ? p.composeAnyPile.products + ' (compose only)' : '-')}] conn=${d ? d.conn : (p.composeAnyPile ? p.composeAnyPile.conn : '-')} lines=[${d ? d.lines.map(x => x.split(':')[0]) : (p.composeAnyPile ? p.composeAnyPile.lines : '-')}]\n   plain: ${JSON.stringify(first(d ? d.plain : (p.composeAnyPile ? p.composeAnyPile.plain : ''), 200))}`; };

  // ---------- C4.1
  const c41 = await probe('C4.1', 'go-live date', 'What is the target go-live date for the new site?');
  const plain41 = c41.questions[0] && c41.questions[0].draft ? c41.questions[0].draft.plain : '';
  c41.phrases = Object.fromEntries(['legacy at.js', 'co-innovation', '+1.2 seconds', 'Largest Contentful Paint'].map(p => [p, plain41.includes(p)]));
  save('out_C4.1.json', c41); console.log('C4.1 ' + summary(c41) + '\n   phrases: ' + JSON.stringify(c41.phrases));

  // ---------- C4.2
  const c42 = await probe('C4.2', 'generative AI in delivery', 'Do you use generative AI tools such as ChatGPT in delivering services? If so, how do you protect our data?');
  const d42 = c42.questions[0] && c42.questions[0].draft;
  c42.afterLaunch = d42 ? (d42.sections.find(s => s[0] === 'After launch') || [null, []])[1] : null;
  save('out_C4.2.json', c42); console.log('C4.2 ' + summary(c42) + '\n   After launch items: ' + (c42.afterLaunch ? c42.afterLaunch.length : 'none'));

  // ---------- C4.3
  const c43 = await probe('C4.3', 'Adobe Analytics', 'Describe your approach to implementing Adobe Analytics.');
  save('out_C4.3.json', c43); console.log('C4.3 ' + summary(c43));

  // ---------- C4.4
  const c44 = await probe('C4.4', 'AEM Forms', 'Describe how you would use AEM Forms for digital account opening.');
  save('out_C4.4.json', c44); console.log('C4.4 ' + summary(c44));

  // ---------- C4.5
  const c45 = await probe('C4.5', 'not Target', 'We will not use Adobe Target. Describe the alternatives you recommend.');
  save('out_C4.5.json', c45); console.log('C4.5 ' + summary(c45));

  // ---------- C4.6
  const c46a = await probe('C4.6', 'retail Q3', 'Our product images live in AEM Assets. How do approved images reach Commerce product pages?');
  const c46b = await probe('C4.6', 'Assets feeds Commerce', 'Describe how AEM Assets feeds Adobe Commerce product pages.');
  const c46cat = await h.eval(() => ({
    commerceAemassets: RFP_CAT.connections.filter(c => [c.a, c.b].includes('commerce') && [c.a, c.b].includes('aemassets')).map(c => ({id: c.id, a: c.a, b: c.b, label: c.label, lines: c.lines, more: c.more})),
    candidates: RFP_CAT.connections.filter(c => ['commerce', 'aemassets', 'aemsites'].includes(c.a) && ['commerce', 'aemassets', 'aemsites'].includes(c.b)).map(c => ({id: c.id, a: c.a, b: c.b, catalogIndex: RFP_CAT.connections.indexOf(c), label: c.label, how: c.how, gain: (c.gain || {}).text || null})),
    aemInsideAemAssets: (() => { const D = window.RFPDbg; window.__detectScore = null; const o = D.detect('AEM Assets'); return {order: o, score: window.__detectScore}; })(),
  }));
  save('out_C4.6.json', {retailQ3: c46a, assetsFeedsCommerce: c46b, catalog: c46cat});
  console.log('C4.6a ' + summary(c46a) + '\n   conns: ' + JSON.stringify(c46a.scoring.conns) + '\n   detectScore: ' + JSON.stringify(c46a.scoring.detectScore));
  console.log('C4.6b ' + summary(c46b) + '\n   conns: ' + JSON.stringify(c46b.scoring.conns) + '\n   detectScore: ' + JSON.stringify(c46b.scoring.detectScore));
  console.log('C4.6 catalog commerce+aemassets: ' + JSON.stringify(c46cat.commerceAemassets) + '\n   detect("AEM Assets"): ' + JSON.stringify(c46cat.aemInsideAemAssets));

  // ---------- C4.7, C4.8 (bank 2.5), C4.9 (bank 2.3): the workbook
  note('C4.7', 'bank_rfp.xlsx', FIX + '/bank_rfp.xlsx');
  const bank = await h.file(FIX + '/bank_rfp.xlsx');
  const byLabel = (lab) => bank.questions.find(q => q.label === lab);
  const lineIdsByScope = await h.eval(() => { const out = {}; const pats = {upgrade: /plan the upgrade path/i, instance: /document the new instance setup/i, cutover: /cut over DNS and the CDN/i, handoff: /set up the handoff/i};
    for (const [id, L] of Object.entries(RFP_CAT.lines)) { const scope = (L.scope || '') + ' ' + ((typeof CATALOG !== 'undefined' && CATALOG.find(t => t.id === id) || {}).scope || '');
      for (const [k, re] of Object.entries(pats)) if (re.test(scope) || re.test(L.name)) (out[k] = out[k] || []).push({id, name: L.name, unit: L.unit, scope: L.scope}); }
    // which owners hold each of those lines
    for (const k of Object.keys(out)) for (const x of out[k]) x.owners = [...RFP_CAT.products.filter(p => (p.lines || []).includes(x.id) || (p.more || []).includes(x.id)).map(p => p.id + (p.lines.includes(x.id) ? ' (default)' : ' (more)')), ...RFP_CAT.connections.filter(c => (c.lines || []).includes(x.id) || (c.more || []).includes(x.id)).map(c => c.a + '+' + c.b + ((c.lines || []).includes(x.id) ? ' (default)' : ' (more)'))];
    return out; });
  const q22 = byLabel('2.2'), q27 = byLabel('2.7'), q25 = byLabel('2.5'), q23 = byLabel('2.3');
  const s22 = await dbgMatch(q22.text), s27 = await dbgMatch(q27.text), s25 = await dbgMatch(q25.text), s23 = await dbgMatch(q23.text);
  save('out_C4.7.json', {file: 'bank_rfp.xlsx', status: bank.status, count: bank.count, lineIdsByScope, q22: {text: q22.text, kind: q22.kind, draft: slim(q22.draft), scoring: s22}, q27: {text: q27.text, kind: q27.kind, draft: slim(q27.draft), scoring: s27}});
  console.log('C4.7 workbook: ' + bank.status);
  console.log('   ids by scope: ' + JSON.stringify(Object.fromEntries(Object.entries(lineIdsByScope).map(([k, v]) => [k, v.map(x => x.id + ' ' + x.owners.join('/'))]))));
  console.log('   2.2 products=' + q22.draft.products.map(p => p.id) + ' conn=' + q22.draft.conn + ' lines=' + JSON.stringify(q22.draft.lines.map(l => l.id + ': ' + l.name)));
  console.log('   2.2 cands: ' + JSON.stringify(s22.cands.map(c => [c.id, c.s, 'hit', c.hit, 'def', c.isDefault, c.owner, c.nameTokensInQ, c.scopeTokensInQ])));
  console.log('   2.7 products=' + q27.draft.products.map(p => p.id) + ' conn=' + q27.draft.conn + ' lines=' + JSON.stringify(q27.draft.lines.map(l => l.id + ': ' + l.name)));
  console.log('   2.7 cands: ' + JSON.stringify(s27.cands.map(c => [c.id, c.s, 'hit', c.hit, 'def', c.isDefault, c.owner, c.nameTokensInQ, c.scopeTokensInQ])));

  // C4.8 bank 2.5
  const prodOfLine = await h.eval((ids) => ids.map(id => ({id, owners: [...RFP_CAT.products.filter(p => (p.lines || []).includes(id) || (p.more || []).includes(id)).map(p => p.id), ...RFP_CAT.connections.filter(c => (c.lines || []).includes(id) || (c.more || []).includes(id)).map(c => c.a + '+' + c.b)]})), q25.draft.lines.map(l => l.id));
  const c48bank25 = {text: q25.text, kind: q25.kind, draft: slim(q25.draft), lineOwners: prodOfLine, scoring: s25,
    productsWithLines: q25.draft.products.filter(p => prodOfLine.some(x => x.owners.includes(p.id))).map(p => p.id)};
  console.log('C4.8 bank 2.5: fromContext=' + q25.draft.fromContext + ' products=' + q25.draft.products.map(p => p.id) + ' lines=' + q25.draft.lines.map(l => l.id) + ' productsWithLines=' + c48bank25.productsWithLines);
  console.log('   2.5 cands (monthly only reach here): ' + JSON.stringify(s25.cands.map(c => [c.id, c.s, 'hit', c.hit, 'def', c.isDefault, c.owner])));

  // C4.9 bank 2.3
  const q23info = await h.eval((ids) => { const D = window.RFPDbg; return ids.map(id => { const L = D.LN[id]; return {id, name: L.name, scope: L.scope, ext: L.ext || null, tier: L.tier || null, needs: L.needs || null, needs_any: L.needs_any || null, tplAssumptions: (D.TPL[id] || {}).assumptions || null, conAssumptions: (D.CON[id] || {}).assumptions || null}; }); }, q23.draft.lines.map(l => l.id));
  const qualifier = await h.eval(() => { const hits = []; const scan = (where, s) => { if (typeof s === 'string' && /qualifier/i.test(s)) hits.push({where, text: s}); };
    for (const [id, L] of Object.entries(RFP_CAT.lines)) for (const [k, v] of Object.entries(L)) scan('line ' + id + '.' + k, v);
    for (const c of RFP_CAT.connections) for (const [k, v] of Object.entries(c)) { if (Array.isArray(v)) v.forEach((x, i) => scan('conn ' + c.a + '+' + c.b + '.' + k + '[' + i + ']', typeof x === 'string' ? x : JSON.stringify(x))); else scan('conn ' + c.a + '+' + c.b + '.' + k, typeof v === 'string' ? v : JSON.stringify(v)); }
    for (const p of RFP_CAT.products) for (const [k, v] of Object.entries(p)) scan('product ' + p.id + '.' + k, typeof v === 'string' ? v : JSON.stringify(v));
    if (typeof CATALOG !== 'undefined') for (const t of CATALOG) for (const [k, v] of Object.entries(t)) scan('template ' + t.id + '.' + k, typeof v === 'string' ? v : JSON.stringify(v));
    if (typeof REVIEW_CONCEPTS !== 'undefined') for (const [id, t] of Object.entries(REVIEW_CONCEPTS)) for (const [k, v] of Object.entries(t)) scan('concept ' + id + '.' + k, typeof v === 'string' ? v : JSON.stringify(v));
    return hits; });
  const c49bank23 = {text: q23.text, kind: q23.kind, draft: slim(q23.draft), lines: q23info, scoring: s23,
    promisesHandoff: /set up the handoff \(live chat, meeting booking or both\)/i.test(q23.draft.plain),
    qualifierInAsksOrSells: [...q23.draft.asks, ...q23.draft.sells].filter(x => /qualifier/i.test(x)), qualifierAnywhereInCatalog: qualifier};
  console.log('C4.9 bank 2.3: promisesHandoff=' + c49bank23.promisesHandoff + ' qualifierInAsksOrSells=' + JSON.stringify(c49bank23.qualifierInAsksOrSells) + '\n   Qualifier anywhere in the page catalog: ' + JSON.stringify(qualifier.map(x => x.where)) + '\n   sells=' + JSON.stringify(q23.draft.sells) + '\n   asks=' + JSON.stringify(q23.draft.asks));

  // ---------- C4.8 the rest
  const c48a = await probe('C4.8', 'Magento upgrade', 'Our current platform is Magento Open Source 2.4. Describe your approach to upgrading it.');
  const commerceLines = await h.eval(() => { const p = RFP_CAT.products.find(p => p.id === 'commerce'); return {lines: p.lines, more: p.more, connectionsWithLines: RFP_CAT.connections.filter(c => c.a === 'commerce' || c.b === 'commerce').map(c => c.a + '+' + c.b + ': ' + (c.lines || []).concat(c.more || []).join(','))}; });
  const lot2text = 'Lot 2: Customer Journey Analytics\n2.1 Describe your implementation approach.\n2.2 Describe your approach to ongoing support.';
  note('C4.8', 'Lot 2 (as given)', lot2text);
  const c48lot = await h.text(lot2text);
  const c48lotScoring = {}; for (const q of c48lot.questions) c48lotScoring[q.label] = await dbgMatch(q.text);
  const twoLots = 'Lot 1: Adobe Experience Manager Sites\n1.1 Describe your implementation approach.\n1.2 Describe your approach to ongoing support.\nLot 2: Customer Journey Analytics\n2.1 Describe your implementation approach.\n2.2 Describe your approach to ongoing support.';
  note('C4.8', 'two lots (closest construction of Opus A14/A12)', twoLots);
  const c48two = await h.text(twoLots);
  const c48twoScoring = {}; for (const q of c48two.questions) c48twoScoring[q.label] = await dbgMatch(q.text);
  save('out_C4.8.json', {magento: c48a, commerceInCatalog: commerceLines, lot2AsGiven: {count: c48lot.count, status: c48lot.status, questions: c48lot.questions.map(q => ({label: q.label, text: q.text, kind: q.kind, draft: slim(q.draft)})), scoring: c48lotScoring},
    twoLots: {count: c48two.count, status: c48two.status, questions: c48two.questions.map(q => ({label: q.label, text: q.text, kind: q.kind, draft: slim(q.draft)})), scoring: c48twoScoring}, bank25: c48bank25});
  console.log('C4.8 ' + summary(c48a) + '\n   commerce in catalog: ' + JSON.stringify(commerceLines));
  console.log('C4.8 Lot 2 as given: ' + c48lot.status + '\n   ' + c48lot.questions.map(q => q.label + ' kind=' + q.kind + ' draft=' + (q.draft ? 'fromContext=' + q.draft.fromContext + ' products=' + q.draft.products.map(x => x.id) + ' lines=' + q.draft.lines.length + ' sections=' + JSON.stringify(q.draft.sections) : 'null')).join('\n   '));
  console.log('C4.8 two lots: ' + c48two.status + '\n   ' + c48two.questions.map(q => q.label + ' ' + JSON.stringify(q.text) + ' kind=' + q.kind + ' draft=' + (q.draft ? 'fromContext=' + q.draft.fromContext + ' products=' + q.draft.products.map(x => x.id) + ' lines=' + q.draft.lines.length + ' sections=' + JSON.stringify(q.draft.sections) : 'null')).join('\n   '));

  // ---------- C4.9 capability and hosting questions
  const c49qs = ['Where is Brand Concierge data hosted, and is it encrypted at rest?', 'What languages does Brand Concierge support?', 'Can Brand Concierge answer questions about a member\'s own account balance after they log in?',
    'How many concurrent authors can AEM Sites support?', 'Does Real-Time CDP support data residency in Australia?', 'Is AEM Sites WCAG 2.2 AA compliant?', 'What is the uptime SLA for Adobe Commerce?'];
  const c49 = []; for (const q of c49qs) { const p = await probe('C4.9', q.slice(0, 40), q); c49.push(p); console.log('C4.9 ' + summary(p)); }
  save('out_C4.9.json', {capability: c49, bank23: c49bank23});

  // ---------- C4.10 ownership
  const bg = 'Background. The bank licensed Brand Visibility in 2026 and uses it today.\n2.2 How would you connect our Customer Journey Analytics data to AI assistant traffic?';
  note('C4.10', 'background line', bg);
  const c410a = await h.text(bg);
  const owned410a = await h.eval(() => [...RFPAnswers.ownedProducts()]);
  const paras410 = await h.paragraphs(bg), found410 = await h.find(bg);
  const edsQ = 'How would you build our new site on EDS?';
  note('C4.10', 'EDS', edsQ);
  const c410b = await h.text(edsQ);
  const owned410b = await h.eval(() => [...RFPAnswers.ownedProducts()]);
  const why410b = await h.eval((t) => { const D = window.RFPDbg; const s = t.toLowerCase(); const out = [];
    for (const [pid, names] of Object.entries(D.ALIASES)) { if (!D.P[pid] || D.P[pid].outside) continue; for (const a of names) { if (a.length <= 4) continue; const i = s.indexOf(a); if (i > 0) out.push({pid, alias: a, index: i, window: s.slice(Math.max(0, i - 24), i), owns: D.OWNS.test(s.slice(Math.max(0, i - 24), i))}); } }
    return {hits: out, OWNS: String(D.OWNS), edsAliases: D.ALIASES.eds}; }, edsQ);
  save('out_C4.10.json', {background: {paragraphs: paras410, found: found410, count: c410a.count, status: c410a.status, questions: c410a.questions.map(q => ({label: q.label, text: q.text, kind: q.kind, draft: slim(q.draft)})), ownedProducts: owned410a},
    eds: {count: c410b.count, questions: c410b.questions.map(q => ({label: q.label, text: q.text, kind: q.kind, draft: slim(q.draft)})), ownedProducts: owned410b, detect: await h.detect(edsQ), why: why410b}});
  const q410 = c410a.questions.find(q => q.label === '2.2') || c410a.questions[0];
  console.log('C4.10 background: paragraphs=' + JSON.stringify(paras410) + ' found=' + found410.length + ' owned=' + JSON.stringify(owned410a) + '\n   2.2 sells=' + JSON.stringify(q410 && q410.draft && q410.draft.sells) + '\n   2.2 asks=' + JSON.stringify(q410 && q410.draft && q410.draft.asks));
  console.log('C4.10 EDS: owned=' + JSON.stringify(owned410b) + ' detect=' + JSON.stringify(await h.detect(edsQ)) + ' why=' + JSON.stringify(why410b.hits) + '\n   draft products=' + (c410b.questions[0].draft && c410b.questions[0].draft.products.map(p => p.id)) + ' lines=' + (c410b.questions[0].draft && c410b.questions[0].draft.lines.map(x => x.id)) + ' sells=' + JSON.stringify(c410b.questions[0].draft && c410b.questions[0].draft.sells));

  // ---------- C4.11 aliases
  const alia = ['Describe your approach to implementing ABV for our brand.', 'How would you set up AEP sandboxes?', 'How would you configure Adobe Experience Platform sandboxes and roles?', 'How would LLMO report our AI citations?'];
  const c411det = []; for (const q of alia) { note('C4.11', 'detect', q); const sc = await h.eval((q) => { const D = window.RFPDbg; window.__detectScore = null; const o = D.detect(q); return {order: o, score: window.__detectScore, pageDetect: RFPAnswers.detect(q)}; }, q); c411det.push({q, ...sc, classify: await h.classify(q)}); console.log('C4.11 detect ' + JSON.stringify(q) + ' -> ' + JSON.stringify(sc.pageDetect) + ' score=' + JSON.stringify(sc.score) + ' pile=' + c411det[c411det.length - 1].classify); }
  const g1 = await probe('C4.11', 'Gemini 1 WordPress/DAM', 'How will you migrate our existing WordPress CMS and legacy DAM into the new platform?');
  const migLines = await h.eval(() => ['SI03', 'AS03', 'A02', 'XC01', 'CM1', 'CM2'].map(id => { const L = RFP_CAT.lines[id]; return L ? {id, name: L.name, unit: L.unit, scope: (L.scope || '').slice(0, 160), owners: [...RFP_CAT.products.filter(p => (p.lines || []).includes(id) || (p.more || []).includes(id)).map(p => p.id + ((p.lines || []).includes(id) ? ' (default)' : ' (more)')), ...RFP_CAT.connections.filter(c => (c.lines || []).includes(id) || (c.more || []).includes(id)).map(c => c.a + '+' + c.b + ((c.lines || []).includes(id) ? ' (default)' : ' (more)'))]} : {id, missing: true}; }));
  const g2 = await probe('C4.11', 'Gemini 2 SSO/EU', 'Do you support single sign-on (SSO) with Okta and SAML 2.0, and where is data hosted in the EU?');
  const g3 = await probe('C4.11', 'Gemini 3 status reports', 'How will you track project issues, risks, and weekly status reports during the rebuild?');
  const firmSrc = await h.eval(() => { const html = document.documentElement.outerHTML; const m = /const FIRM=\/(.*?)\/i;/.exec(html); return m ? m[1] : null; });
  const g3firm = (() => { const re = new RegExp(firmSrc, 'i'); const m = re.exec(g3.text); return m ? m[0] : null; })();
  save('out_C4.11.json', {detect: c411det, gemini1: g1, migrationLinesInCatalog: migLines, gemini2: g2, gemini3: {...g3, FIRM_match: g3firm}});
  console.log('C4.11 ' + summary(g1) + '\n   migration lines: ' + JSON.stringify(migLines.map(x => x.id + ' ' + (x.owners || 'missing').toString())) + '\n   conns: ' + JSON.stringify(g1.scoring.conns) + ' detectScore=' + JSON.stringify(g1.scoring.detectScore));
  console.log('C4.11 ' + summary(g2) + '\n   ongoing=' + g2.scoring.ongoing + ' context=' + JSON.stringify(g2.scoring.context));
  console.log('C4.11 ' + summary(g3) + '\n   FIRM matched: ' + JSON.stringify(g3firm) + ' detectScore=' + JSON.stringify(g3.scoring.detectScore));

  // ---------- C4.12 four products
  const c412 = await probe('C4.12', 'four products', 'Explain how AEM Sites, Target, Customer Journey Analytics and Real-Time CDP work together for a single customer view.');
  const p412 = c412.questions[0].draft ? c412.questions[0].draft.plain : '';
  c412.gapWords = Object.fromEntries(['partial', 'gap', 'not documented', 'does not', 'no documented', 'separately', 'pairwise'].map(w => [w, p412.toLowerCase().includes(w)]));
  save('out_C4.12.json', c412); console.log('C4.12 ' + summary(c412) + '\n   detectScore=' + JSON.stringify(c412.scoring.detectScore) + ' conns=' + JSON.stringify(c412.scoring.conns) + ' gapWords=' + JSON.stringify(c412.gapWords));

  // ---------- C4.13 durations
  const c413 = await probe('C4.13', 'weeks to implement', 'How many weeks to implement AEM Sites?');
  const durations = await h.eval(() => { const D = window.RFPDbg; const re = /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|twelve)(?:\s*(?:to|or)\s*\d+)?[- ]?(weeks?|months?|days?|business days?|working days?)\b/gi; const out = [];
    for (const [id, L] of Object.entries(D.LN)) { const scope = L.scope || (D.TPL[id] || {}).scope || ''; const texts = {scope, name: L.name}; for (const [k, t] of Object.entries(texts)) { let m; re.lastIndex = 0; while ((m = re.exec(t))) out.push({id, field: k, phrase: m[0], context: t.slice(Math.max(0, m.index - 60), m.index + m[0].length + 60), name: L.name, unit: L.unit, owners: [...D.C.filter(c => (c.lines || []).includes(id) || (c.more || []).includes(id)).map(c => c.a + '+' + c.b), ...Object.values(D.P).filter(p => (p.lines || []).includes(id) || (p.more || []).includes(id)).map(p => p.id)], isDefaultSomewhere: [...D.C, ...Object.values(D.P)].some(o => (o.lines || []).includes(id))}); } }
    return out; });
  // does each duration line reach a draft: a question built from its owner and its name
  const reach = []; for (const d of durations) { const owner = d.owners[0]; if (!owner) { reach.push({id: d.id, owner: null}); continue; }
    const ownerName = await h.eval((o) => o.includes('+') ? o.split('+').map(id => RFP_CAT.products.find(p => p.id === id).name).join(' and ') : RFP_CAT.products.find(p => p.id === o).name, owner);
    const q = 'Describe your approach to ' + d.name.toLowerCase() + ' for ' + ownerName + '.'; note('C4.13', 'reach ' + d.id, q);
    const r = await h.eval((args) => { const d = RFPAnswers.compose({text: args.q}); if (!d) return null; return {lines: d.m.lines, inDraft: d.m.lines.includes(args.id), plainHasPhrase: RFPAnswers.plain(d, {text: args.q}).includes(args.phrase)}; }, {q, id: d.id, phrase: d.phrase});
    reach.push({id: d.id, owner, question: q, result: r}); }
  save('out_C4.13.json', {weeks: c413, durationsInCatalog: durations, reach});
  console.log('C4.13 ' + summary(c413) + '\n   duration phrases in line scopes/names: ' + durations.length + ' -> ' + JSON.stringify(durations.map(d => d.id + ' ' + d.field + ' "' + d.phrase + '"')) + '\n   reach: ' + JSON.stringify(reach.map(r => r.id + ':' + (r.result ? (r.result.inDraft ? 'in draft' : 'not picked') + (r.result.plainHasPhrase ? ' phrase printed' : '') : 'no draft'))));

  // ---------- C4.14 the six-source cap
  const files = ['bank_rfp.xlsx', 'retail_rfi.docx', 'mfg_rfp.pdf'];
  const c414 = {perFile: [], missing: [], totalDraftedLines: 0};
  for (const f of files) { note('C4.14', f, FIX + '/' + f); const r = await h.file(FIX + '/' + f);
    const lineUrls = await h.eval(() => Object.fromEntries(Object.entries(RFP_CAT.lines).map(([id, L]) => [id, {url: L.url, src: L.src, refs: (L.references || []).length}])));
    const qs = [];
    for (const q of r.questions) { if (!q.draft) continue; const urls = q.draft.sources.map(s => s.url); const lines = q.draft.lines.map(l => l.id); c414.totalDraftedLines += lines.length;
      const miss = lines.filter(id => lineUrls[id].url && !urls.includes(lineUrls[id].url));
      qs.push({label: q.label, products: q.draft.products.map(p => p.id), conn: q.draft.conn, lines, sourcesCount: q.draft.sources.length, sources: q.draft.sources.map(s => s.title), missingOwnUrl: miss.map(id => ({id, url: lineUrls[id].url, src: lineUrls[id].src}))});
      for (const m of miss) c414.missing.push({file: f, label: q.label, id: m, url: lineUrls[m].url, src: lineUrls[m].src, sourcesCount: q.draft.sources.length}); }
    c414.perFile.push({file: f, status: r.status, questions: qs}); }
  const cjaTitle = await h.eval(() => { const hits = []; const T = 'Adobe: customer-journey-analytics.html';
    for (const [id, L] of Object.entries(RFP_CAT.lines)) { if (L.src === T) hits.push({where: 'line ' + id + '.src', url: L.url}); for (const r of (L.references || [])) if (r.title === T) hits.push({where: 'line ' + id + '.references', url: r.url}); }
    for (const c of RFP_CAT.connections) { if (c.source && c.source.title === T) hits.push({where: 'conn ' + c.a + '+' + c.b + '.source', url: c.source.url}); for (const f of (c.flows || [])) if (f.source && f.source.title === T) hits.push({where: 'conn ' + c.a + '+' + c.b + '.flows', url: f.source.url}); }
    return hits; });
  c414.cjaTitle = cjaTitle;
  save('out_C4.14.json', c414);
  console.log('C4.14 drafted lines=' + c414.totalDraftedLines + ' missing own url=' + c414.missing.length + ' ' + JSON.stringify(c414.missing) + '\n   title "Adobe: customer-journey-analytics.html": ' + JSON.stringify(cjaTitle));
  for (const pf of c414.perFile) console.log('   ' + pf.file + ': ' + pf.questions.map(q => q.label + ' src=' + q.sourcesCount + (q.missingOwnUrl.length ? ' MISSING ' + q.missingOwnUrl.map(x => x.id) : '')).join(' | '));

  // ---------- extras
  const ex = {};
  ex.notSureDrafted = []; for (const q of ['Who leads the project day to day?', 'What measures do you take to protect our data?']) { const p = await probe('extra', 'not sure drafted', q); ex.notSureDrafted.push(p); console.log('EXTRA ' + summary(p) + ' detectScore=' + JSON.stringify(p.scoring.detectScore)); }
  // "Do you support ..." inside a real RFP: ONGOING's "support" plus context
  const bankTxt = fs.readFileSync(FIX + '/bank_rfp.txt', 'utf8') + '2.7 Do you support single sign-on (SSO) with Okta and SAML 2.0?\n2.8 Does the platform support WCAG 2.2 AA?\n';
  note('extra', 'bank text plus support questions', bankTxt);
  const exb = await h.text(bankTxt, 'bank_plus.txt');
  ex.supportInContext = exb.questions.filter(q => ['2.7', '2.8', '2.6'].includes(q.label)).map(q => ({label: q.label, text: q.text, kind: q.kind, draft: slim(q.draft)}));
  for (const q of ex.supportInContext) console.log('EXTRA in-context ' + q.label + ' pile=' + q.kind + ' draft=' + (q.draft ? 'fromContext=' + q.draft.fromContext + ' products=' + q.draft.products.map(x => x.split(' ')[0]) + ' lines=' + q.draft.lines.map(x => x.split(':')[0]) + ' plain=' + JSON.stringify(first(q.draft.plain, 220)) : 'null'));
  // 'target' inside 'targeting'
  const t1 = await probe('extra', 'targeting', 'How would you build high-value audiences for targeting from our Customer Journey Analytics data?'); ex.targeting = t1; console.log('EXTRA ' + summary(t1) + ' detectScore=' + JSON.stringify(t1.scoring.detectScore));
  // ownedProducts reads only the first occurrence of an alias
  const o1q = 'Which Marketo features would you enable in our Marketo instance?'; note('extra', 'owned second occurrence', o1q);
  const o1 = await h.text(o1q); ex.ownedFirstOccurrence = {q: o1q, owned: await h.eval(() => [...RFPAnswers.ownedProducts()]), sells: o1.questions[0].draft && o1.questions[0].draft.sells, asks: o1.questions[0].draft && o1.questions[0].draft.asks};
  console.log('EXTRA owned first occurrence: ' + JSON.stringify(ex.ownedFirstOccurrence));
  const o2q = 'Which features would you enable in our Marketo instance?'; note('extra', 'owned single occurrence', o2q);
  const o2 = await h.text(o2q); ex.ownedSingleOccurrence = {q: o2q, owned: await h.eval(() => [...RFPAnswers.ownedProducts()]), sells: o2.questions[0].draft && o2.questions[0].draft.sells};
  console.log('EXTRA owned single occurrence: ' + JSON.stringify(ex.ownedSingleOccurrence));
  save('out_extra.json', ex);

  save('inputs.json', inputs);
  if (h.errors.length) console.log('PAGE ERRORS: ' + JSON.stringify(h.errors));
  await h.close();
})().catch(e => { console.error(e); process.exit(1); });
