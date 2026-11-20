// RFI Builder step 69 (Nov 10 2026): closing the gaps to Adobe's AI draft of the bank RFP with rules and no AI.
// Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_step69.js
// Adam compared this tool's bank response with Adobe's draft a second time (three of our answers had come out blank) and
// said to fix every gap: "if we can perform them without AI and basically run this for free for our partners that helps me
// get this approved". These checks hold what was built: "Use this answer" for Approve, a warning when chosen answers leave
// others blank, a note that the answers are suggestions, the client's name in each answer, a discovery sentence and a list
// of client needs on AEM Sites, one line each on a bank's or insurer's own controls, a Shorter answers setting, and
// opening sentences for the products that had none.
// Step 93 (Nov 13 2026): the on-screen answer is the method knowledge base's wherever it has one; this file had no AI checks to remove.
// The four checks on how the catalog writer (still the fallback) places, drops and keeps the client's name now read that writer's answer.
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
const fs = require('fs'), FIX = __dirname + '/qa/rfp_fixtures';
const FACTS = JSON.parse(fs.readFileSync(__dirname + '/rfp_facts.json', 'utf8'));
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 600) + ']')); if (!c) fails++; };
const naive = t => String(t).split(/\s+/).filter(Boolean).length;
const NAME = 'Northbridge Mutual Bank', LABELS = ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8'];
(async () => {
  const h = await open(), p = h.page;
  const W = (label, cat) => h.eval(([l, cat]) => { const q = RFPBuilder.state.questions.find(x => x.label === l); let d = q.draft || (q.draft = RFPAnswers.compose(q)); if (cat) { d = Object.assign({}, d); delete d.ai; } const w = RFPAnswers.written(d, q);
    return {sections: w.sections, body: RFPAnswers.plain(d, q).split('\n\nAdobe sources for the product facts above')[0], sources: w.sources.map(s => s.title), lines: d.m.lines, kb: !!d.kb, asks: d.asks || [],
      fit: w.fit && {limit: w.fit.limit, words: w.fit.words, cutLines: w.fit.cutLines}}; }, [label, !!cat]);
  const all = async cat => { const A = {}; for (const l of LABELS) A[l] = await W(l, cat); return A; };   // cat: the catalog writer's answer (step 93: the fallback)
  const sec = (w, head) => (w.sections.find(s => s[0] === head) || [null, []])[1];
  const iOf = l => h.eval(l => RFPBuilder.state.questions.findIndex(q => q.label === l), l);
  const summary = () => p.textContent('#rfp-summary');
  const use = async l => { await h.select(await iOf(l)); await p.click('#rfp-use'); await p.waitForTimeout(120); };

  // ---- 1. the bank RFP as it opens
  await h.file(FIX + '/bank_rfp.xlsx');
  // step 73 (Adam): the note moved into the panel's intro, in his words, and the Your call box went
  ok(!(await p.$('#rfp-results .rfp-your-call')) && /^The answers provided are suggested drafts, drawn from Adobe’s public documentation\. Review every suggestion provided for accuracy\.$/.test((await p.textContent('#rfp-panel .section-intro p')).trim()),
    'the RFI Builder says the answers are suggested drafts to be reviewed for accuracy');
  await h.select(await iOf('2.1'));
  const btns = () => p.$$eval('#rfp-answer .rfp-actions button', b => b.map(x => x.textContent.trim()));
  ok((await btns())[0] === 'Use this answer' && !/Approve/.test((await btns()).join()), 'the button that puts an answer in the response reads "Use this answer"', (await btns()).join('|'));
  ok(/0 of 8 Adobe product questions are answered\./.test(await summary()) && /0 of 6 questions about your firm are answered\./.test(await summary()) && /0 services selected for the statement of work\./.test(await summary()), 'the summary counts the questions answered (step 70\'s wording)', (await summary()).slice(0, 160));
  ok(!(await p.$('#rfp-blank-warn')), 'no warning before any answer is chosen');

  // ---- 2. chosen answers leave the others blank (step 70: with no warning and no drafts box; the count and its link say what is left)
  for (const l of ['2.1', '2.2', '2.3', '2.4', '2.5']) await use(l);
  ok((await btns())[0] === 'In your response, undo' && (await p.textContent('#rfp-questions li[data-i="' + (await iOf('2.5')) + '"] .rfp-state')) === 'In your response', 'a chosen answer says "In your response" on its button and its row');
  ok(!(await p.$('#rfp-blank-warn')) && /5 of 8 Adobe product questions are answered\. Go to the 3 that are left/.test(await summary()), 'with five of eight chosen the bar says three are left, and nothing warns');
  const rows = (await h.workbook('rfp-writeback')).sheets.Questions;
  ok(!rows.find(r => r[1] === '2.6')[3] && /Our approach/.test(rows.find(r => r[1] === '2.1')[3]), 'the filled-in client workbook omits unchosen answers and includes the chosen text');
  await use('2.7'); await use('2.8');   // 2.6 stays drafted, for the checks below

  // ---- 3. the client's name
  ok((await p.inputValue('#rfp-client')) === NAME, 'the client\'s name is read from the RFP\'s title line and shown in a box the partner can change', await p.inputValue('#rfp-client'));
  let A = await all();
  const named = w => (w.body.match(new RegExp('For ' + NAME + ', we (?:would|will) ', 'g')) || []).length;
  ok(['2.1', '2.2', '2.3', '2.4', '2.7', '2.8'].every(l => named(A[l]) === 1), 'each answer that says what we would do names the client once', JSON.stringify(LABELS.map(l => l + ':' + named(A[l]))));
  ok(named(A['2.5']) === 0 && named(A['2.6']) === 0 && A['2.6'].kb, 'the after-launch list and the hosting facts do not');
  const C = await all(true);
  ok(/^For Northbridge Mutual Bank, we would implement AEM Sites as a Cloud Service\./.test(sec(C['2.1'], 'Our approach')[0]) && /^For Northbridge Mutual Bank, we will configure the supported Brand Visibility bot-data connection/.test(sec(C['2.2'], 'What we would do')[0]),
    'in the catalog writer\'s answer it goes in the first sentence that opens "We would" or "We will"');
  ok(Object.values(A).every(w => naive(w.body) <= 294), 'and every answer is still under the RFP\'s 300 words', JSON.stringify(LABELS.map(l => naive(A[l].body))));
  await h.select(await iOf('2.1')); await p.fill('#rfp-client', 'Northbridge'); await p.waitForTimeout(150); A = await all();
  ok(/^For Northbridge, we would implement/.test(sec(A['2.1'], 'Our approach')[0]) && (await p.textContent('#rfp-body')).includes('For Northbridge, we'), 'a name the partner types is used at once, in the answers and in the open panel');
  await p.fill('#rfp-client', ''); await p.waitForTimeout(150); A = await all(true);
  ok(/^We would implement AEM Sites as a Cloud Service\./.test(sec(A['2.1'], 'Our approach')[0]) && !/Northbridge/.test(Object.values(A).map(w => w.body).join(' ')), 'an empty box means no name in any of the catalog writer\'s answers');
  await p.fill('#rfp-client', 'Northbridge'); await p.waitForTimeout(150);
  await p.reload(); await p.waitForTimeout(900);
  ok((await p.inputValue('#rfp-client')) === 'Northbridge' && /^For Northbridge, we would implement/.test(sec(await W('2.1', true), 'Our approach')[0]), 'the typed name is kept across a reload, in the box and in the catalog writer\'s answer');
  await p.evaluate(() => { RFPBuilder.state.client = null; RFPBuilder.persist(); }); await p.reload(); await p.waitForTimeout(900);

  // ---- 4. AEM Sites: discovery, and what the client must provide
  A = await all(); let w = A['2.1'], ap = sec(w, 'Our approach');
  ok(/^We would start with discovery: a review of your current site's content, templates and integrations, a named team with agreed roles, and the measures of success\.$/.test(ap[1]), 'the AEM Sites answer has a discovery step, second in its approach', ap[1]);
  ok(['SI01', 'SI02', 'SI03', 'SI05'].every(l => w.lines.includes(l)) && !(w.fit.cutLines || []).length && sec(w, 'What we would do').length === 4, 'and it costs the answer none of its four services under the limit', JSON.stringify(w.fit));
  ok(w.sources.includes('Experience League: The Readiness Phase of the AEM as a Cloud Service Migration Journey'), 'the discovery sentence brings its Adobe source');
  const D = FACTS.explain.find(x => /^We would start with discovery/.test(x.text || ''));
  ok(D && D.extra === true && D.src.length === 1 && D.asks.length === 4 && D.asks.every(a => /your client/i.test(a.text) && !/your client/i.test(a.client)), 'in the knowledge base it is an extra sentence with a source and four asks, each worded for the partner and for the client');
  ok(w.asks.filter(a => D.asks.some(x => x.text === a)).length === 4, 'the four asks are on the partner\'s checklist for 2.1', JSON.stringify(w.asks));

  // ---- 5. a bank's own controls, once each
  const whole = Object.values(A).map(x => x.body).join('\n');
  // Round 5: verify the consent check without guaranteeing a compliance outcome.
  const CONTENT = 'Your compliance team approves regulated content (rates, fees, disclosures and product claims) before it goes live.', DATA = 'Test cases will verify proposed data uses against the consent rules your team approves.';
  ok(whole.split(DATA).length === 2 && A['2.7'].body.includes(DATA), 'the response says once how customer data is used, in the forms answer, which has the room', JSON.stringify(LABELS.filter(l => A[l].body.includes(DATA))));
  ok(!A['2.4'].body.includes(CONTENT) && !A['2.3'].body.includes(CONTENT) && !A['2.6'].body.includes(DATA) && !A['2.5'].body.includes(CONTENT),
    'the line on regulated content stays out of an answer that explains how a product works (2.4), one that already speaks of compliance (2.3), the hosting facts and the after-launch list');

  // ---- 6. Shorter answers was removed in step 70 (Adam: a partner edits an answer; the RFI's own limit is still obeyed)
  ok(!(await p.$('#rfp-shorter')) && !/Shorter answers/.test(await summary()), 'there is no Shorter answers setting');

  // ---- 7. an RFP that states no limit and names no client
  await h.text('1. Describe your approach to implementing Adobe Experience Manager Sites, including migration of our existing content.\n2. How would you connect our Customer Journey Analytics data to AI assistant traffic?');
  ok((await p.inputValue('#rfp-client')) === '', 'pasted questions with no organization name leave the client box empty');
  w = await h.eval(() => { const q = RFPBuilder.state.questions[0], d = q.draft || (q.draft = RFPAnswers.compose(q)), x = RFPAnswers.written(d, q); return {sections: x.sections, fit: x.fit}; });
  const wc = await h.eval(() => { const q = RFPBuilder.state.questions[0], d = Object.assign({}, q.draft || (q.draft = RFPAnswers.compose(q))); delete d.ai; const x = RFPAnswers.written(d, q); return {sections: x.sections, fit: x.fit}; });
  ok(!wc.fit && /^We would implement AEM Sites as a Cloud Service\./.test(sec(wc, 'Our approach')[0]) && /^We would start with discovery/.test(sec(wc, 'Our approach')[1]), 'with no name the catalog writer\'s answer opens as before, with the discovery step after it');
  const need = sec(w, 'What we would need from you');
  ok(['Access to the current site and its content, or an export of it.', 'An inventory of pages, URLs and integrations, with an owner for each content area.', 'Named reviewers for the content checks and user acceptance testing.', 'Your accessibility, retention and security requirements for the site.'].every(t => need.includes(t)),
    'with no word limit the answer lists what the client must provide, in the client\'s words', JSON.stringify(need));
  ok(!sec(w, 'Our approach').some(t => /compliance team|consent and data-governance/.test(t)), 'an RFP that is not from a bank or an insurer gets no line on compliance');
  await h.text('Request for Information\nHarbor Valley Credit Union\n1. Describe your approach to implementing Adobe Experience Manager Sites.');
  ok((await p.inputValue('#rfp-client')) === 'Harbor Valley Credit Union', 'a name on its own line near the top of pasted text is found too', await p.inputValue('#rfp-client'));
  w = await h.eval(() => { const q = RFPBuilder.state.questions[0], d = q.draft || (q.draft = RFPAnswers.compose(q)), x = RFPAnswers.written(d, q); return {sections: x.sections}; });
  ok(sec(w, 'Our approach').includes(CONTENT) && /^For Harbor Valley Credit Union, we would implement/.test(sec(w, 'Our approach')[0]), 'a credit union\'s RFP with room for it says who approves regulated content, in the AEM Sites answer');


  // ---- 8. every product has its own opening sentences, each backed by a quote from Adobe's pages
  const CAT = JSON.parse(fs.readFileSync(__dirname + '/canvas/catalog.json', 'utf8')), ids = CAT.products.filter(x => !x.outside).map(x => x.id), E = FACTS.explain;
  const has = (kind, id) => E.some(x => x.kind === kind && x.for.length === 1 && x.for[0] === id);
  ok(ids.length === 36 && ids.every(id => has('what', id) && has('role', id)), 'each of the 36 Adobe products has a sentence for what it is and one for its part in a "which products" answer', ids.filter(id => !has('what', id) || !has('role', id)).join());
  ok(ids.every(id => E.filter(x => x.when && x.for.includes(id)).length >= 2), 'and at least two sentences for what an RFP asks about it, alone or with a product it connects to', ids.filter(id => E.filter(x => x.when && x.for.includes(id)).length < 2).join());
  ok(E.filter(x => x.kind !== 'note').every(x => x.text && x.src.length > 0 && x.text.split(/\s+/).length <= 70 && !/\b(?:the client|your client|the partner)\b|—|–/i.test(x.text)), 'every one has an Adobe source, speaks to the client and carries no dash (' + E.length + ' entries)');
  const ask = async list => { await h.text(list.map((t, i) => (i + 1) + '. ' + t).join('\n')); return h.eval(() => RFPBuilder.state.questions.map(q => { const d = q.kind === 'adobe' ? (q.draft || (q.draft = RFPAnswers.compose(q))) : null, w = d && d.m && d.parts ? RFPAnswers.written(d, q) : null;
    return {kind: q.kind, products: d && d.m ? d.m.products : [], lines: d && d.m ? d.m.lines : [], approach: w ? (w.sections.find(s => s[0] === 'Our approach') || [0, []])[1] : [], sources: w ? w.sources.length : 0}; })); };
  let R = await ask(['Describe your approach to implementing Workfront for our marketing team\'s project intake and approvals.', 'How would Adobe Express keep our teams on brand?', 'How does Coworker help our team, and how is it governed?',
    'How would you set up Acrobat Sign for contract signing?', 'Describe your approach to implementing Adobe Journey Optimizer for our email and push programs.', 'How does Marketo Measure attribute revenue to our marketing channels?',
    'How would Firefly Custom Models be trained on our brand imagery?', 'How would Content Analytics show which content drives results?']);
  ok(R.length === 8 && R.every(x => x.kind === 'adobe' && x.approach.length >= 1 && x.sources > 0) && R.map(x => x.products.join()).join('|') === 'workfront|express|cw|acrobatsign|ajo|mmeasure|fireflycm|ca', 'questions about eight products that had no sentences are answered product by product, with sources', JSON.stringify(R.map(x => [x.kind, x.products.join(), x.approach.length])));
  ok(R.every(x => !x.approach.some(t => /^We would deliver this with/.test(t))), 'none of them opens "We would deliver this with": each opens with the answer', JSON.stringify(R.filter(x => x.approach.some(t => /^We would deliver this with/.test(t))).map(x => x.products)));
  ok(/request queues/.test(R[0].approach.join(' ')) && /approved colors and fonts/.test(R[1].approach.join(' ')) && /approval gates/.test(R[2].approach.join(' ')) && /six types of attribution models/.test(R[5].approach.join(' ')), 'and says what the question asks about (request queues, style controls, approval gates, the attribution models)');

  // ---- 9. a larger word list: what an RFP calls the work when it names no product
  R = await ask(['Describe how you would develop online forms for use by our customers and businesses.', 'How would you improve our page speed and organic search traffic?', 'Describe your approach to marketing attribution across our channels.',
    'How would our designers use Photoshop and Illustrator files in the new process?', 'How would Adobe Analytics report on our website and app traffic?', 'Describe your team and its experience with digital asset management projects.']);
  ok(R[0].kind === 'adobe' && R[0].products.includes('aemforms') && R[0].lines.length > 0, 'a question about online forms that names no product is sorted to Adobe products and drafted from AEM Forms', JSON.stringify(R[0]));
  ok(R[1].kind === 'adobe' && R[1].lines.length > 0 && R[2].kind === 'adobe' && R[2].products.includes('mmeasure'), 'so are page speed and organic search (Sites Optimizer, Edge Delivery Services) and marketing attribution (Marketo Measure)', JSON.stringify(R.slice(1, 3).map(x => [x.kind, x.products.join()])));
  ok(R[3].kind === 'adobe' && R[3].products.includes('creativecloud'), 'Photoshop and Illustrator are read as Creative Cloud', JSON.stringify(R[3].products));
  ok(R[4].products.join() === 'aa', 'a question that names Adobe Analytics is answered from Adobe Analytics alone: its general words no longer bring Customer Journey Analytics in', JSON.stringify(R[4].products));
  ok(R[5].kind === 'firm', 'and a question about the partner\'s own team stays with Your firm, whatever topic it mentions', R[5].kind);

  ok(!h.errors.length, 'no page errors', h.errors.slice(0, 3).join(' | '));
  console.log(fails ? fails + ' of ' + n + ' STEP 69 CHECK(S) FAILED' : 'ALL STEP 69 CHECKS PASSED (' + n + ')');
  await h.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
