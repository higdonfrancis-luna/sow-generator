// The method knowledge base, measured (Nov 13 2026, Adam: "the key metric": how close answers written with no AI come to the AI's).
// Loads an RFI in the built page and writes, for every Adobe question, the answer the knowledge base gives (RFPAnswers.method, fitted
// to the RFI's word limit by the page's own written()) and today's no-AI answer from the catalog, both as the client would read them.
// Run from the repo root after python3 sow/build_site.py:
//   node sow/rfp_prototype/kb_method/eval_answers.js <rfi file> <out.json>
const fs = require('fs');
const {open} = require('../review_2026-11-09/harness.js');
const [,, src, out] = process.argv;
(async () => {
  const h = await open();
  await h.file(src);
  const rows = await h.eval(() => {
    const text = w => w.sections.map(([hd, items]) => hd + '\n' + items.map(t => '- ' + t).join('\n')).join('\n\n');
    return RFPBuilder.state.questions.filter(q => q.kind === 'adobe').map(q => {
      const d = RFPAnswers.compose(q), five = d ? RFPAnswers.method(q, d) : null, lim = RFPAnswers.limitOf(q);
      const kb = five ? text(RFPAnswers.written(Object.assign({}, d, {ai: five}), q)) : null;
      const catalog = d ? RFPAnswers.plain(d, q).split('\nAdobe sources')[0] : '';
      return {ref: q.label, question: q.text, limit: lim ? lim.max : null, services: d && d.m ? d.m.lines : [], kbServices: five ? five.services : [], topic: five && five.topic || null, kb, catalog};
    });
  });
  fs.writeFileSync(out, JSON.stringify(rows, null, 1));
  const n = rows.filter(r => r.kb).length;
  console.log(`${rows.length} Adobe questions; ${n} answered from the method knowledge base, ${rows.length - n} by the catalog alone`);
  if (h.errors.length) console.log('page errors: ' + h.errors.join(' | '));
  await h.close();
})().catch(e => { console.error(e); process.exit(1); });
