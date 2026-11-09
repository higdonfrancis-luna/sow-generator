// A two-sentence question whose first sentence is longer than 80 characters and wraps at the sentence end (PDF and paste).
const {open} = require('/home/user/warroom/sow/rfp_prototype/review_2026-11-09/harness.js');
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, 'out');
(async () => {
  const h = await open();
  const pasted = '2.5 Our customers have complex questions about their accounts, insurance policies and the current rates.\nHow would Brand Concierge answer them from approved sources?\n2.6 Our customers have complex questions about their accounts, insurance policies and the current rates. How would Brand Concierge answer them from approved sources?\n';
  const r = await h.text(pasted, 'long_wrap.txt');
  const out = {text: pasted, paragraphs: await h.paragraphs(pasted), status: r.status, questions: r.questions.map(q => ({label: q.label, text: q.text, kind: q.kind}))};
  fs.writeFileSync(path.join(OUT, 'extras2_long_wrap.json'), JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1));
  await h.close();
})();
