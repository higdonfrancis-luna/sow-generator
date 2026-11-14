// RFI Builder step 89 (Nov 12 2026), from the insurer RFP. Fix 3 (Adam: "fix number 3"): no part of an RFI goes missing without a word. A test RFP
// read seven times lost its second half twice: the reader's reply came back with no line in the tab layout, the worker called
// that "nothing to answer" and the page left the part out. Now the worker reads pipes, runs of spaces and a written-out \t
// too, and the page tries an empty part again and, if it is still empty, names it in the closing message and under Not
// picked up. Then (Adam: "B, yes on 1,2,4 and 5"): the button is Build with Adobe RFI Agent, a third smaller; each answer takes its
// own section's word limit or its row's Word limit column; a response form keeps its rows and goes straight to writing; a question
// that names no product is written from its section's products (or the RFI's), never one the client rules out, and never a firm
// question; no sentence defers a point to Adobe. The reader and the writer are stubbed (no call leaves this machine); the insurer
// PDF's reading is a real one saved from the live reader (demo/cedar_pdf_ai_reading.json); the worker is checked as text.
// Step 93 removed the AI path; its checks went: the worker's reader and briefs, the empty-part retry, the button, the writer's requests, undo and takeAI.
// Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_step89.js
const fs = require('fs'), path = require('path');
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 500) + ']')); if (!c) fails++; };
const DEMO = path.join(__dirname, 'rfp_prototype/demo/Cedar_Prairie_Mutual_Insurance_Company');
(async () => {
    const h = await open(), p = h.page;
  const labels = () => h.eval(() => RFPBuilder.state.questions.map(q => q.label));
  const limits = refs => h.eval(r => r.map(x => { const q = RFPBuilder.state.questions.find(y => y.label === x); const l = q && RFPAnswers.limitOf(q); return x + ':' + (l ? l.max : '-'); }).join(' '), refs);
  // the answer the page shows for a question (step 93: the method knowledge base's where it has one), its word count and its services
  const shown = () => h.eval(() => RFPBuilder.state.questions.filter(q => q.kind === 'adobe' && RFPAnswers.hasAnswer(q)).map(q => { const d = q.draft, w = RFPAnswers.written(d, q);
    return {ref: q.label, words: w.sections.reduce((n, [hd, items]) => n + [hd, ...items].join(' ').split(/\s+/).filter(Boolean).length, 0), services: d.ai ? d.ai.services : d.m.lines, plain: RFPAnswers.plain(d, q)}; }));
  const lim = {B: 300, C: 250, D: 250, E: 150, F: 200};

  // 1. fix 1 on the client's response form
  await h.file(DEMO + '_Response_Form.xlsx');
  const formRefs = await labels();
  ok(formRefs.length === 39 && await limits(['A.1', 'B.1', 'C.3', 'D.2', 'E.1', 'F.2', 'G.1']) === 'A.1:200 B.1:300 C.3:250 D.2:250 E.1:150 F.2:200 G.1:250', 'on the response form each answer takes its own row\'s Word limit (200, 300, 250, 150 by section)', await limits(['A.1', 'B.1', 'C.3', 'D.2', 'E.1', 'F.2', 'G.1']));
  ok(await h.eval(() => RFPBuilder.state.questions.find(q => q.label === 'C.2').kind) === 'adobe', 'C.2, "how Cedar Prairie appears in AI-generated answers", is an Adobe question (Brand Visibility); it was To sort');
  const formShown = await shown(), over = formShown.filter(a => a.words > lim[a.ref[0]]);
  ok(formShown.length >= 20 && !over.length, 'every answer on the form fits its own section\'s limit', JSON.stringify(over.map(a => a.ref + ':' + a.words)));
  ok((await labels()).join() === formRefs.join(), 'the form\'s own references stay on every row (A.1 to G.2), so the answers can go back into its rows');
  const byRef = ref => formShown.find(a => a.ref === ref);
  ok(byRef('B.8') && byRef('B.8').services.length > 0 && byRef('B.2') && byRef('B.2').services.length > 0, 'questions that name no product (B.8 go-live, B.2 the Drupal migration) are answered from the products of their section heading', JSON.stringify([byRef('B.8') && byRef('B.8').services, byRef('B.2') && byRef('B.2').services]));
  ok(byRef('C.2') && byRef('C.2').services.some(id => /^O\d{2}$/.test(id)), 'C.2 (AI-generated answers) is answered with Brand Visibility\'s services', byRef('C.2') && byRef('C.2').services.join());
  ok(byRef('B.7') && !byRef('B.7').services.some(id => /^TG/.test(id)), '"without licensing Adobe Target": no Target service is offered for B.7', byRef('B.7') && byRef('B.7').services.join());

  // 2. fix 1 on the insurer PDF, read with no AI
  await h.file(DEMO + '_RFP.pdf');
  ok(await limits(['B.1', 'B.8', 'E.4', 'F.3']) === 'B.1:300 B.8:300 E.4:150 F.3:200', 'each question of the PDF takes the limit stated for its own section, found by its reference', await limits(['B.1', 'B.8', 'E.4', 'F.3']));
  const pdfShown = await shown(), pdfOver = pdfShown.filter(a => a.ref && a.words > lim[a.ref[0]]);
  ok(pdfShown.length >= 15 && !pdfOver.length, 'every answer on the PDF fits its own section\'s limit', JSON.stringify(pdfOver.map(a => a.ref + ':' + a.words)));
  ok(await h.eval(() => ['E.1', 'E.2', 'E.3', 'E.5'].every(r => { const q = RFPBuilder.state.questions.find(x => x.label === r); const d = q && RFPAnswers.compose(q); return d && d.kb; })), 'the security and hosting questions keep their sourced answers from the knowledge base');

  // 3. fix 5: no sentence that defers a point to Adobe, in an answer or in the Word proposal
  const defer = [...formShown, ...pdfShown].filter(a => /from Adobe in writing|Adobe's written|Pending Adobe/i.test(a.plain)).map(a => a.ref);
  ok(!defer.length, 'no answer on the form or the PDF defers a point to Adobe ("from Adobe in writing", "Adobe\'s written", "Pending Adobe")', defer.join());
  const scrub = await h.eval(() => RFPProposal.scrubText('We will get the hosting region from Adobe in writing before you sign. The site is served by Edge Delivery Services.', new Set()) + ' || ' + RFPProposal.scrubText('Pending Adobe confirmation, we would enable the connector. We map your fields.', new Set()));
  ok(!/Adobe in writing|Pending Adobe/.test(scrub) && /served by Edge Delivery Services/.test(scrub) && /We map your fields/.test(scrub), 'the Word proposal drops the same sentences and keeps the rest', scrub);
  ok(h.errors.length === 0, 'no page errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `\n${fails} of ${n} STEP 89 CHECKS FAILED` : `\nALL STEP 89 CHECKS PASSED (${n})`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
