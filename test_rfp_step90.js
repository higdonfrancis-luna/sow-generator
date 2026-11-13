// RFI Builder step 90 (Nov 13 2026, Adam: "yes build both and deploy the worker"), from the blind panel on the insurer RFP:
// 1. hours per answer: an answer quotes a service's hours only when the question is about that whole piece of work, says when its
//    work is part of a bigger service (the site build), and gives its own short range for work no service covers, never "sized
//    later" (the writer's brief, checked as text);
// 2. a product the client did not choose is named with its license: the request carries the products the RFI names, the writer
//    is told to say so, and the page adds "This uses Adobe Marketo Qualifier, which is licensed separately." when it does not,
//    from the answer's full product names or the services it rests on; the word limit never cuts that line.
// The writer is stubbed (no call leaves this machine). Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_step90.js
const fs = require('fs'), path = require('path');
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 600) + ']')); if (!c) fails++; };
const W = fs.readFileSync(path.join(__dirname, 'ai_reading/warroom-assistant-worker.js'), 'utf8');
const RULES = W.slice(W.indexOf('const RFI_ANSWER_RULES'), W.indexOf('async function handleRfiAnswer'));
const FORM = path.join(__dirname, 'rfp_prototype/demo/Cedar_Prairie_Mutual_Insurance_Company_Response_Form.xlsx');
(async () => {
  // 1. the writer's brief
  ok(/Quote a service's hours only when this question is about that whole piece of work/.test(RULES) && /say the work is part of that service, by its name, and do not repeat its hours/.test(RULES), 'hours: a service\'s hours only when the question is about that whole piece of work; a part of a bigger service names it and does not repeat its hours');
  ok(/your own short range for work none of the services covers/.test(RULES) && /never "sized later"/.test(RULES) && !/sized once/.test(W), 'hours: work no service covers gets the writer\'s own short range, never "sized later" (the step 88 wording is gone)');
  ok(/that it adds no hours of its own/.test(RULES) && /never a bracketed field for hours/i.test(RULES), 'hours: every answer still says what its work takes, and never with a bracketed field');
  ok(/<rfi_products> the Adobe products the client has chosen or already uses/.test(RULES) && /not in <rfi_products>, say so once, plainly, in Timeline and effort: "This uses Adobe Marketo Qualifier, which is licensed separately\."/.test(RULES), 'license: the writer is told which products the client chose and to name any other product\'s license once');
  ok(/<rfi_products>\\n' \+ JSON\.stringify\(chosen\)/.test(W) && /b\.rfi_products\.filter\(x => typeof x === 'string'\)\.slice\(0, 40\)/.test(W), 'license: the worker passes the chosen products to the writer, as strings, 40 at most');

  // 2. the page
  const h = await open(), p = h.page;
  await h.file(FORM);
  const chosen = await h.eval(() => RFPAnswers.rfiProducts().map(id => id).sort().join());
  ok(chosen === 'aemsites,bc,bv,cja,cw,eds,marketo', 'the products the insurer RFP names: AEM Sites, Edge Delivery Services, Brand Visibility, Brand Concierge, CJA, Coworker and Marketo Engage; its title, "Digital Experience Platform", is not Real-Time CDP', chosen);
  const body = await h.eval(() => RFPAnswers.aiInput(RFPBuilder.state.questions.find(q => q.label === 'C.5')));
  ok(body && body.rfi_products.slice().sort().join() === 'AEM Sites,Brand Concierge,Brand Visibility,Coworker,Customer Journey Analytics,Edge Delivery Services,Marketo Engage', 'a request carries the chosen products by name (Marketo Qualifier is not one of them)', body && body.rfi_products.join());
  // the writer's answer, stubbed, run through the page's own checks
  const take = (ref, items, services, extra = {}) => h.eval(([ref, items, services, extra]) => {
    const q = RFPBuilder.state.questions.find(x => x.label === ref), b = RFPAnswers.aiInput(q) || {services: [], sources: []};
    const all = [...b.services, ...services.filter(id => !b.services.some(s => s.id === id)).map(id => ({id, name: id}))];
    const okTake = RFPAnswers.takeAI(q, {services: all, sources: b.sources}, {sections: [{heading: 'Our approach', items: ['We set this up with your team.']}, {heading: 'How we would do it', items}, {heading: 'Timeline and effort', items: [extra.timeline || 'Planning estimate: 40 hours.']}, {heading: 'Risk we manage', items: ['The main risk is late sign-off; we agree reviewers in week one.']}], services, sources: []}, 'claude-opus-5-5');
    return okTake ? q.ai.sections : null; }, [ref, items, services, extra]);
  const lines = secs => (secs || []).flatMap(([hd, it]) => it).filter(t => /licensed separately/.test(t));
  let s = await take('C.5', ['Configure the Brand Concierge handoff through live chat, which runs on Adobe Marketo Qualifier.', 'Design the Genesys Cloud routing with your administrators.'], ['F02']);
  ok(lines(s).join() === 'This uses Adobe Marketo Qualifier, which is licensed separately.' && s.find(x => x[0] === 'Timeline and effort')[1].includes(lines(s)[0]), 'an answer that names Marketo Qualifier, which the insurer did not choose, gets one line in Timeline and effort', JSON.stringify(s));
  s = await take('C.5', ['Configure the handoff through live chat on Adobe Marketo Qualifier.'], ['F02'], {timeline: 'Part of the Brand Concierge implementation. This uses Adobe Marketo Qualifier, which is licensed separately.'});
  ok(lines(s).length === 1, 'when the writer already said it, the page does not say it twice', JSON.stringify(lines(s)));
  s = await take('D.5', ['Build a form block with consent wording that submits to Marketo Engage.'], ['AFX09']);
  ok(lines(s).join() === 'This uses AEM Forms, which is licensed separately.', 'an answer that rests on an AEM Forms service gets its line, even when its words do not name the product', JSON.stringify(lines(s)));
  s = await take('B.6', ['Set up the approval workflow in Workfront, with Compliance as reviewers.'], ['WF06']);
  ok(lines(s).join() === 'This uses Adobe Workfront, which is licensed separately.', 'a Compliance workflow built on Workfront names Workfront\'s license', JSON.stringify(lines(s)));
  s = await take('D.1', ['Create the connection in Customer Journey Analytics, which runs on Adobe Experience Platform, and build the data view.'], []);
  ok(lines(s).length === 0, '"Adobe Experience Platform", under a Customer Journey Analytics answer, is not Real-Time CDP: no line', JSON.stringify(lines(s)));
  s = await take('B.7', ['Since Adobe Target is not licensed in this phase, we split traffic in the page code.', 'Without Adobe Target, each variant is authored as a block.'], []);
  ok(lines(s).length === 0, 'a product the answer rules out ("Adobe Target is not licensed in this phase") gets no line', JSON.stringify(lines(s)));
  s = await take('F.1', ['Cover what differs from Adobe Analytics for analysts moving from it.', 'Unlike Adobe Target, the split runs in page code.'], []);
  ok(lines(s).length === 0, 'a product named only to compare ("what differs from Adobe Analytics", "unlike Adobe Target") gets no line (a Tallgrass answer on Nov 13)', JSON.stringify(lines(s)));
  s = await take('C.3', ['Implement Brand Concierge on your site with Brand Visibility prompts and Customer Journey Analytics reporting.'], ['F02']);
  ok(lines(s).length === 0, 'products the client chose (Brand Concierge, Brand Visibility, CJA) get no line', JSON.stringify(lines(s)));
  // the word limit cuts other items first, never the license line
  const fit = await h.eval(() => { const q = RFPBuilder.state.questions.find(x => x.label === 'C.5'); const d = RFPAnswers.compose(q); return RFPAnswers.written(d, q); });
  const fitLines = fit.sections.flatMap(([hd, it]) => it);
  const words = fit.sections.reduce((t, [hd, it]) => t + [hd, ...it].join(' ').split(/\s+/).filter(Boolean).length, 0);
  ok(fitLines.some(t => /This uses Adobe Marketo Qualifier, which is licensed separately/.test(t)) && words <= 250, 'within the 250-word limit the license line stays', words + ' words');
  const tight = await h.eval(() => { const q = RFPBuilder.state.questions.find(x => x.label === 'C.5'); q.limit = '60'; const d = RFPAnswers.compose(q); const w = RFPAnswers.written(d, q); delete q.limit; return w.sections.flatMap(([hd, it]) => it); });
  ok(tight.some(t => /licensed separately/.test(t)), 'squeezed to 60 words, the answer loses other items before the license line', JSON.stringify(tight));
  ok(h.errors.length === 0, 'no page errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `\n${fails} of ${n} STEP 90 CHECKS FAILED` : `\nALL STEP 90 CHECKS PASSED (${n})`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
