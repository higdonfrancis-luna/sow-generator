// Round 5 (Nov 14 2026): grades the RFI Builder's reader against hand-checked answer keys. For every key in gold/ (or the
// ones named), it drops the key's file into the built page through the review harness and compares what the reader found
// with the key: every numbered question found once, with its own code, its exact text, its section, its word limit and its
// pile; nothing else read as a question; no running header or footer glued into a question.
// Run from the repo root after python3 sow/build_site.py:
//   node sow/rfp_prototype/chatgpt_round5/check_reader.js                 (every key in gold/)
//   node sow/rfp_prototype/chatgpt_round5/check_reader.js briarhaven      (one key)
//   add --json out.json to save each key's results
const fs = require('fs'), path = require('path');
const {open} = require(path.join(__dirname, '..', 'review_2026-11-09', 'harness.js'));
const GOLD = path.join(__dirname, 'gold');
const args = process.argv.slice(2), jsonAt = args.indexOf('--json'), jsonOut = jsonAt >= 0 ? args.splice(jsonAt, 2)[1] : null;
const keys = (args.length ? args : fs.readdirSync(GOLD).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, ''))).sort();
// text is compared after normalizing what a PDF can change without changing the words: spacing, curly quotes, dashes split
// across lines ("unauthorized- access")
const norm = s => String(s || '').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/-\s+/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();
const words = s => norm(s).split(' ').filter(Boolean);
const overlap = (a, b) => { const A = words(a), B = new Set(words(b)); return A.length ? A.filter(w => B.has(w)).length / Math.max(A.length, B.size) : 0; };
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 700) + ']')); if (!c) fails++; return c; };
(async () => {
  const h = await open(), all = {};
  for (const key of keys) {
    const gold = JSON.parse(fs.readFileSync(path.join(GOLD, key + '.json'), 'utf8')), file = path.join(__dirname, gold.file);
    console.log(`\n== ${key}: ${path.basename(file)} (${gold.questions.length} questions)`);
    await h.file(file);
    const found = await h.eval(() => RFPBuilder.state.questions.map(q => ({label: q.label || '', text: q.text || '', section: q.section || '', limit: q.limit == null ? null : q.limit, kind: q.kind})));
    const res = {key, found: found.length, want: gold.questions.length, missing: [], wrongText: [], wrongSection: [], wrongLimit: [], wrongKind: [], extra: [], glued: []};
    const byLabel = new Map(); found.forEach(q => { if (q.label) byLabel.set(q.label, (byLabel.get(q.label) || []).concat([q])); });
    // Free-standing asks have no printed reference. Compare those in document order.
    const unnumbered = found.filter(q => !q.label);
    let nextUnnumbered = 0;
    for (const [index, g] of gold.questions.entries()) {
      const hits = g.label ? byLabel.get(g.label) || [] : [unnumbered[nextUnnumbered++]].filter(Boolean);
      const ref = g.label || 'row ' + (index + 1);
      if (hits.length !== 1) { res.missing.push(ref + (hits.length > 1 ? ` (found ${hits.length} times)` : '')); continue; }
      const q = hits[0];
      if (norm(q.text) !== norm(g.text)) res.wrongText.push(`${ref}: ${Math.round(overlap(q.text, g.text) * 100)}% of words match; found "${q.text.slice(0, 140)}"`);
      if (!norm(q.section).includes(norm(g.section.replace(/^[A-Z] /, ''))) && norm(q.section) !== norm(g.section)) res.wrongSection.push(`${ref}: "${q.section}" (want "${g.section}")`);
      if (q.limit !== g.limit) res.wrongLimit.push(`${ref}: ${q.limit} (want ${g.limit})`);
      if (q.kind !== g.kind) res.wrongKind.push(`${ref}: ${q.kind} (want ${g.kind})`);
    }
    const inOrder = found.length === gold.questions.length && found.every((q, i) => q.label === gold.questions[i].label);
    const complete = res.missing.length === 0;
    const labels = new Set(gold.questions.map(g => g.label));
    res.extra = found.filter(q => q.label && !labels.has(q.label)).concat(unnumbered.slice(nextUnnumbered)).map(q => `${q.label || '(no code)'} "${q.text.slice(0, 90)}"`);
    res.glued = found.filter(q => (gold.never_in_text || []).some(s => q.text.includes(s))).map(q => `${q.label || '(no code)'}: "${q.text.slice(0, 90)}"`);
    const notQ = found.filter(q => (gold.not_questions || []).some(s => norm(q.text).startsWith(norm(s))));
    ok(complete && inOrder, `${key}: every question is found once, in RFI order with its printed reference (${gold.questions.length - res.missing.length} of ${gold.questions.length})`, res.missing.join(', '));
    ok(complete && !res.wrongText.length, `${key}: each question's text is exactly the RFI's, nothing merged in and nothing cut off`, res.wrongText.join(' | '));
    ok(complete && !res.wrongSection.length, `${key}: each question carries its section`, res.wrongSection.join(' | '));
    ok(complete && !res.wrongLimit.length, `${key}: each question carries its applicable word limit or null`, res.wrongLimit.join(' | '));
    ok(complete && !res.wrongKind.length, `${key}: each question lands in the right pile (Adobe products or Your firm)`, res.wrongKind.join(' | '));
    ok(!res.extra.length, `${key}: nothing else is read as a question (constraints and instructions are context)`, res.extra.join(' | '));
    ok(!res.glued.length && !notQ.length, `${key}: no running header, footer or instruction line is glued into a question`, [...res.glued, ...notQ.map(q => 'instruction as question: ' + q.text.slice(0, 80))].join(' | '));
    ok(found.every(q => ['adobe', 'firm'].includes(q.kind)), `${key}: every row has a recognized pile`, found.filter(q => !['adobe', 'firm'].includes(q.kind)).map(q => q.label || q.text.slice(0, 60)).join(' | '));
    all[key] = res;
  }
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(all, null, 1));
  console.log(fails ? `\n${fails} OF ${n} READER CHECKS FAILED` : `\nALL READER CHECKS PASSED (${n})`);
  await h.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
