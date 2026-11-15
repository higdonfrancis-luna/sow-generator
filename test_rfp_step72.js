// RFI Builder step 72 (Nov 11 2026, Adam: "if AI would help, we should add an AI model", "just have a button say Read with
// AI", "go"): the Read with AI button, its undo, what leaves the browser, and the no-AI fix for lines that name no product.
// Step 93 removed the AI path: the checks on the AI button, its timer, the request, the AI's list, undo, saving and reloading it, the reader's errors and the worker's /rfi/read route went.
// What stays: the intro sentence and the no-AI fix, a line that names no product drawing on the products the RFI is about.
// Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_step72.js
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 500) + ']')); if (!c) fails++; };
(async () => {
  const h = await open(), p = h.page;

  // the no-AI fix: a line that names no product, in an RFI about one
  // These technical questions test matching after the partner puts them in Adobe products.
  const lines = async text => { await h.text(text); await h.eval(() => { for (const q of RFPBuilder.state.questions) if (q.kind === 'firm') q.kind = 'adobe'; RFPBuilder.renderList(); }); const r = await h.read(); return r.questions.map(q => ({kind: q.kind, lines: q.draft ? q.draft.lines.map(x => x.id) : [], products: q.draft ? q.draft.products.map(x => x.id) : []})); };
  const ABOUT = 'RFI: AEM Forms implementation\n\nWe are replacing our forms software with AEM Forms.\n\nOur staff will be trained on AEM Forms.\n\nAEM Forms will be hosted by Adobe.\n\n';   // named in three paragraphs or more: the RFI is about it
  let r = await lines(ABOUT + '1. Describe how you would create a form data model for our data sources.\n2. Describe how you would determine pagination for each template.\n3. Describe how you would implement Adobe Target.');
  ok((await p.textContent('#rfp-panel .section-intro p')).trim() === 'The answers provided are suggested drafts, drawn from Adobe’s public documentation. Review every suggestion provided for accuracy.', 'the intro is Adam\'s one sentence (step 73; Adobe will decide what AI the tool uses, so the page does not describe it)');
  await h.select(0); const panel = await p.textContent('#rfp-answer');
  ok(/Form Data Model/.test(panel) && /Your response to the client/.test(panel) && /Adobe sources|Experience League/.test(panel), 'an answer is drafted for the line, with its Adobe sources', panel.slice(0, 200));
  ok(await p.isVisible('#rfp-from-rfp') && /names no product, so the answer draws on the products this RFI is about/.test(await p.textContent('#rfp-from-rfp')) && /AEM Forms/.test(await p.textContent('#rfp-answer .rfp-chips, #rfp-answer')), 'a line that names no product draws on AEM Forms, the product the RFI is about, and says so');
  await h.select(2); ok(!await p.$('#rfp-from-rfp'), 'a line that names its product carries no such note');
  ok(r[0].products.includes('aemforms') && r[0].lines.some(l => /^AF/.test(l)), 'in an RFI about AEM Forms, a question in the Adobe products pile that names no product is answered from AEM Forms where a service\'s own name fits', JSON.stringify(r[0]));
  ok(!r[1].lines.length, 'a question whose only link is a common word ("each", "template") is not answered', JSON.stringify(r[1]));
  ok(r[2].products.join() === 'target', 'a question that names its product is answered from that product alone', JSON.stringify(r[2]));
  r = await lines('1. Describe how you would create a form data model for our data sources.\n2. Describe your approach to Adobe Target.');
  ok(!r[0].products.includes('aemforms'), 'an RFI that is not about a product leaves such a question as it was', JSON.stringify(r[0]));
  ok(!h.errors.length, 'no page errors', h.errors.join(' | '));

  console.log(fails ? `\n${fails} OF ${n} STEP 72 CHECKS FAILED` : `\nALL STEP 72 CHECKS PASSED (${n})`);
  await h.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
