// RFI Builder step 90 (Nov 13 2026, Adam: "yes build both and deploy the worker"), from the blind panel on the insurer RFP:
// 1. hours per answer: an answer quotes a service's hours only when the question is about that whole piece of work, says when its
//    work is part of a bigger service (the site build), and gives its own short range for work no service covers, never "sized
//    later" (the writer's brief, checked as text);
// 2. a product the client did not choose is named with its license: the request carries the products the RFI names, the writer
//    is told to say so, and the page adds "This uses Adobe Marketo Qualifier, which is licensed separately." when it does not,
//    from the answer's full product names or the services it rests on; the word limit never cuts that line.
// Step 93 removed the AI path: the writer's brief and worker checks, the request (aiInput) check and the stubbed writer (takeAI) checks went.
// Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_step90.js
const path = require('path');
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 600) + ']')); if (!c) fails++; };
const FORM = path.join(__dirname, 'rfp_prototype/demo/Cedar_Prairie_Mutual_Insurance_Company_Response_Form.xlsx');
(async () => {
  // the page
  const h = await open(), p = h.page;
  await h.file(FORM);
  const chosen = await h.eval(() => RFPAnswers.rfiProducts().map(id => id).sort().join());
  ok(chosen === 'aemsites,bc,bv,cja,cw,eds,marketo', 'the products the insurer RFP names: AEM Sites, Edge Delivery Services, Brand Visibility, Brand Concierge, CJA, Coworker and Marketo Engage; its title, "Digital Experience Platform", is not Real-Time CDP', chosen);
  // the word limit cuts other items first, never the license line
  // step 93: the answer a partner sees is the knowledge base's (draftOf, reached through hasAnswer, puts it on q.draft), so these two read it
  const fit = await h.eval(() => { const q = RFPBuilder.state.questions.find(x => x.label === 'C.5'); RFPAnswers.hasAnswer(q); const d = q.draft; return Object.assign(RFPAnswers.written(d, q), {model: d && d.ai && d.ai.model}); });
  const fitLines = fit.sections.flatMap(([hd, it]) => it);
  const words = fit.sections.reduce((t, [hd, it]) => t + [hd, ...it].join(' ').split(/\s+/).filter(Boolean).length, 0);
  ok(fit.model === 'knowledge base' && fitLines.some(t => /This uses Adobe Marketo Qualifier, which is licensed separately/.test(t)) && words <= 250, 'within the 250-word limit the license line stays (C.5, the knowledge base\'s answer)', fit.model + ', ' + words + ' words: ' + JSON.stringify(fitLines));
  const tight = await h.eval(() => { const q = RFPBuilder.state.questions.find(x => x.label === 'C.5'); RFPAnswers.hasAnswer(q); const d = q.draft, was = q.limit; q.limit = '60'; const w = RFPAnswers.written(d, q); q.limit = was; return w.sections.flatMap(([hd, it]) => it); });
  ok(tight.some(t => /licensed separately/.test(t)), 'squeezed to 60 words, the answer loses other items before the license line', JSON.stringify(tight));
  ok(h.errors.length === 0, 'no page errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `\n${fails} of ${n} STEP 90 CHECKS FAILED` : `\nALL STEP 90 CHECKS PASSED (${n})`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
