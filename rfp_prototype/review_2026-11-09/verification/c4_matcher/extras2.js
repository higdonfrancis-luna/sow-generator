// Follow-ups for c4_matcher: LLMO phrasings for C4.11 (Opus: "LLMO matches only CJA"), and the C4.10 Background line
// forced into a question (does OWNS ever match "The bank licensed Brand Visibility"?). Writes out_extra2.json.
const fs = require('fs'), path = require('path');
const {open} = require('/home/user/warroom/sow/rfp_prototype/review_2026-11-09/harness.js');
(async () => {
  const h = await open(); const out = {};
  out.llmo = []; for (const q of ['How would LLMO report our AI citations?', 'How would LLMO report on our AI citations?', 'Describe your LLMO reporting.', 'How does LLMO measure our visibility in AI answers?', 'What does LLMO do?'])
    out.llmo.push({q, detect: await h.detect(q), classify: await h.classify(q)});
  const bg = 'Background. The bank licensed Brand Visibility in 2026 and uses it today. Is that correct?\n2.2 How would you connect our Customer Journey Analytics data to AI assistant traffic?';
  const r = await h.text(bg); out.backgroundAsQuestion = {input: bg, count: r.count, questions: r.questions.map(q => ({label: q.label, text: q.text, kind: q.kind})), owned: await h.eval(() => [...RFPAnswers.ownedProducts()]), sells22: (r.questions.find(q => q.label === '2.2') || {}).draft && r.questions.find(q => q.label === '2.2').draft.sells};
  const bg2 = 'Background. We use Brand Visibility today. Is that correct?\n2.2 How would you connect our Customer Journey Analytics data to AI assistant traffic?';
  const r2 = await h.text(bg2); out.backgroundWeUse = {input: bg2, count: r2.count, owned: await h.eval(() => [...RFPAnswers.ownedProducts()]), sells22: (r2.questions.find(q => q.label === '2.2') || {}).draft && r2.questions.find(q => q.label === '2.2').draft.sells};
  fs.writeFileSync(path.join(__dirname, 'out_extra2.json'), JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1)); await h.close();
})().catch(e => { console.error(e); process.exit(1); });
