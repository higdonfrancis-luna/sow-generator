// Cluster c5_voice follow-up: the seven connections the plain "How does A work with B?" phrasing did not land on, where
// the reviewers' quoted phrases live in the catalog, the Skipped tag in the downloads, capitalised "Client-" through rfp(),
// and the hand classification of the flagged doLine outputs.
// Run: node /home/user/warroom/sow/rfp_prototype/review_2026-11-09/verification/c5_voice/followup_c5.js
const fs = require('fs'), path = require('path');
const {open} = require('/home/user/warroom/sow/rfp_prototype/review_2026-11-09/harness.js');
const HERE = __dirname;
const save = (name, obj) => fs.writeFileSync(path.join(HERE, name), JSON.stringify(obj, null, 1));
const LIFECYCLE = /maintenance mode|Legacy|legacy|co-innovation|limited number of customers|not currently offered|health care|finance|beta|planned/g;
const CAUTION = /confirm with Adobe|so confirm|prove it|pilot|your client|the partner|partner's|partners|before you|ask Adobe|check with|do not promise|don't promise|caveat|not a documented capability|documents no setup|Named by Adobe/gi;
const matches = (re, s) => { const out = []; let m; re.lastIndex = 0; while ((m = re.exec(s || ''))) out.push({phrase: m[0], around: s.slice(Math.max(0, m.index - 70), m.index + m[0].length + 70)}); return out; };
const first = (r) => r.questions.find(q => q.kind !== 'firm') || r.questions[0];

(async () => {
  const h = await open();
  const P = await h.eval(() => Object.fromEntries(RFP_CAT.products.map(p => [p.id, p.name])));
  const conns = await h.eval(() => RFP_CAT.connections);
  console.log('product names:', JSON.stringify(P));

  // 1. the seven misses, with a phrasing that carries the connection's own words
  const alt = {
    'search-bv': 'How does Brand Visibility use Google Search Console and GA4 data for AI search visibility?',
    'search-so': 'How does Sites Optimizer use Google Search Console data for SEO opportunities?',
    'csrc-eds': 'How does Edge Delivery publish pages from SharePoint and Google Drive document authoring?',
    'csrc-so': 'How does Sites Optimizer fix content authored in SharePoint or Google Docs documents?',
    'cms-bc': 'How does Brand Concierge answer from a website on another CMS such as WordPress or Sitecore?',
    'aemassets-eds': 'How do AEM Assets digital asset management images get delivered on Edge Delivery pages?',
    'commerce-aemassets': 'How does Adobe Commerce use AEM Assets digital asset management for product images?',
  };
  const probes = [];
  for (const [id, q] of Object.entries(alt)) {
    const c = conns.find(x => x.id === id);
    const r = await h.text(q);
    const f = first(r);
    const conn = f && f.draft ? f.draft.conn : null;
    const sections = f && f.draft ? f.draft.sections : [];
    const text = sections.map(s => s[1].join('\n')).join('\n');
    const approach = (sections.find(s => s[0] === 'Our approach') || [null, []])[1];
    probes.push({id, question: q, matched_conn: conn, intended: conn === c.a + '+' + c.b, products: f && f.draft ? f.draft.products.map(p => p.id) : null,
      approach, cautions: matches(CAUTION, approach.join('\n')), lifecycle: matches(LIFECYCLE, approach.join('\n')), cautions_all_sections: matches(CAUTION, text).map(x => x.phrase),
      how_gain_cautions_direct: matches(CAUTION, (c.how || '') + ' ' + ((c.gain || {}).text || '')).map(x => x.phrase), how_gain_lifecycle_direct: matches(LIFECYCLE, (c.how || '') + ' ' + ((c.gain || {}).text || '')).map(x => x.phrase)});
    console.log(`\n[miss ${id}] conn=${conn} intended=${conn === c.a + '+' + c.b}\n  approach=${JSON.stringify(approach).slice(0, 500)}\n  cautions in approach=${JSON.stringify(probes[probes.length - 1].cautions.map(x => x.phrase))} direct how+gain cautions=${JSON.stringify(probes[probes.length - 1].how_gain_cautions_direct)} lifecycle=${JSON.stringify(probes[probes.length - 1].how_gain_lifecycle_direct)}`);
  }
  save('out_followup_misses.json', probes);

  // 2. where the reviewers' quoted phrases live, field by field, and which fields compose reads (how, gain.text, prereqs -> note; line scope)
  const quoted = ['Named by Adobe', 'prove it in a pilot', 'confirm with Adobe', 'so confirm', 'agreed AI-channel measures', 'provisioned for the customer', 'not currently offered to health care', 'confirm for your client', 'does not edit articles'];
  const where = [];
  for (const c of conns) {
    const fields = {how: c.how || '', 'gain.text': (c.gain || {}).text || '', 'gain.title': (c.gain || {}).title || '', label: c.label || '', availability: c.availability || '', sowAvailability: c.sowAvailability || ''};
    (c.prereqs || []).forEach((p, i) => fields['prereqs[' + i + ']'] = p);
    (c.sowPrereqs || []).forEach((p, i) => fields['sowPrereqs[' + i + ']'] = p);
    (c.flows || []).forEach((f, i) => fields['flows[' + i + '].what'] = f.what || '');
    for (const [k, v] of Object.entries(fields)) for (const qd of quoted) if (v.includes(qd)) where.push({conn: c.id, field: k, phrase: qd, text: v.slice(0, 260), reaches_response: k === 'how' || k === 'gain.text' ? 'yes (Our approach)' : /^prereqs\[/.test(k) ? 'no (partner note, first six only)' : 'no (compose never reads this field)'});
  }
  const lineHits = await h.eval((quoted) => { const out = []; for (const [id, L] of Object.entries(RFP_CAT.lines)) { const T = typeof CATALOG !== 'undefined' ? CATALOG.find(t => t.id === id) : null; const scope = L.scope || (T && T.scope) || L.name; for (const qd of quoted) if (scope.includes(qd)) out.push({line: id, field: L.scope ? 'line.scope' : 'CATALOG.scope', phrase: qd, text: scope.slice(0, 300), doLine: RFPAnswers.doLine(id).slice(0, 300)}); } return out; }, quoted);
  console.log('\n[where] connection fields holding the quoted phrases:'); for (const w of where) console.log(`   ${w.conn} ${w.field} "${w.phrase}" -> ${w.reaches_response}`);
  console.log('[where] line scopes holding the quoted phrases:'); for (const w of lineHits) console.log(`   ${w.line} ${w.field} "${w.phrase}": ${w.doLine.slice(0, 200)}`);
  const o04 = await h.eval(() => { const T = CATALOG.find(t => t.id === 'O04'); return {catalogScope: T && T.scope, lineScope: RFP_CAT.lines.O04.scope || null, doLine: RFPAnswers.doLine('O04')}; });
  const cwcja = conns.find(c => c.id === 'cw-cja');
  const cwcjaOut = await h.eval((c) => ({how: RFPAnswers.rfp(c.how), gain: RFPAnswers.rfp(c.gain.text)}), cwcja);
  save('out_followup_where.json', {connections: where, lines: lineHits, O04: o04, cw_cja: {how: cwcja.how, gain: cwcja.gain.text, rfp: cwcjaOut}});
  console.log('\n[O04]', JSON.stringify(o04));
  console.log('[cw-cja] how after rfp:', cwcjaOut.how.slice(0, 300), '\n  gain after rfp:', cwcjaOut.gain.slice(0, 300));

  // 3. the Skipped tag in the response and the workbook
  const bank = fs.readFileSync('/home/user/warroom/sow/qa/rfp_fixtures/bank_rfp.txt', 'utf8');
  const rb = await h.text(bank, 'bank_rfp.txt');
  const i24 = rb.questions.find(q => q.label === '2.4').i, i21 = rb.questions.find(q => q.label === '2.1').i;
  await h.setStatus(i24, 'skipped'); await h.setStatus(i21, 'used');
  const doc = await h.doc(), rows = await h.rows();
  const tags = [...new Set([...doc.matchAll(/<p class="tag">([^<]*)<\/p>/g)].map(m => m[1]))];
  const statuses = [...new Set(rows.rows.slice(1).map(r => r[3]))];
  const sec24 = (new RegExp('<section><h3>2\\.4 [\\s\\S]*?</section>').exec(doc) || [''])[0];
  const partnerWords = [...new Set([...doc.matchAll(/[^.<>]*\bpartner\b[^.<>]*/g)].map(m => m[0].trim()))];
  save('out_followup_tags.json', {tags, excelStatuses: statuses, section24_first400: sec24.slice(0, 400), skipped_section_has_draft_text: /<h4>Our approach<\/h4>/.test(sec24), partnerSentencesInDoc: partnerWords});
  console.log('\n[tags] doc tags:', JSON.stringify(tags), '\n  excel statuses:', JSON.stringify(statuses), '\n  skipped 2.4 still carries its draft:', /<h4>Our approach<\/h4>/.test(sec24), '\n  sentences with "partner" in the response doc:', JSON.stringify(partnerWords));

  // 4. capitalised "Client-" strings through rfp()
  const clientDash = await h.eval(() => { const out = []; const texts = []; for (const [id, L] of Object.entries(RFP_CAT.lines)) { const T = typeof CATALOG !== 'undefined' ? CATALOG.find(t => t.id === id) : null; texts.push({id, kind: 'line.scope', text: L.scope || (T && T.scope) || L.name}); if (T && T.assumptions) texts.push({id, kind: 'CATALOG.assumptions', text: T.assumptions}); } for (const c of RFP_CAT.connections) { texts.push({id: c.id, kind: 'how', text: c.how || ''}); texts.push({id: c.id, kind: 'gain.text', text: (c.gain || {}).text || ''}); (c.prereqs || []).forEach((p, i) => texts.push({id: c.id, kind: 'prereqs[' + i + ']', text: p})); (c.sowPrereqs || []).forEach((p, i) => texts.push({id: c.id, kind: 'sowPrereqs[' + i + ']', text: p})); } for (const t of texts) { const m = /\b(?:[Tt]he )?Client-\w+/g; let x; while ((x = m.exec(t.text))) out.push({id: t.id, kind: t.kind, found: x[0], out: RFPAnswers.rfp(t.text).slice(Math.max(0, x.index - 40), x.index + 60)}); } return out; });
  console.log('\n[Client-] occurrences:', clientDash.length); for (const c of clientDash) console.log(`   ${c.kind} ${c.id} "${c.found}" -> ...${c.out}...`);
  save('out_followup_clientdash.json', clientDash);

  // 5. hand classification of the flagged doLine outputs
  const d = JSON.parse(fs.readFileSync(path.join(HERE, 'out_C5.3_doLine.json'), 'utf8'));
  const verbsMissed = new Set(['author', 'package', 'bulk', 'activate', 'export', 'give', 'store', 'index', 'standardize']);
  const broken = d.flagged.filter(x => !verbsMissed.has((x.firstWord || '').toLowerCase()));
  const fine = d.flagged.filter(x => verbsMissed.has((x.firstWord || '').toLowerCase()));
  const byWord = {};
  for (const x of broken) byWord[x.firstWord.toLowerCase()] = (byWord[x.firstWord.toLowerCase()] || 0) + 1;
  const list = broken.map(x => ({id: x.id, scopeSource: x.scopeSource, firstWord: x.firstWord, out: x.out.slice(0, 200), reason: x.firstWord.toLowerCase() === 'the' || x.firstWord.toLowerCase() === 'derived' || x.id === 'BI1' ? 'noun-phrase scope' : x.id === 'AD1' ? 'colon clause starts with a subject, not a verb; plus "we authorizes"' : x.firstWord.toLowerCase() === 'using' ? 'participial clause' : 'leading condition or setting clause with a comma, not a colon'}));
  save('out_C5.3_broken_final.json', {count: broken.length, byFirstWord: byWord, list, falsePositivesInFirstPass: fine.map(x => x.id + ': ' + x.out.slice(0, 80))});
  console.log('\n[C5.3 final] broken doLine outputs:', broken.length, JSON.stringify(byWord), '\n  first-pass false positives (verbs my list lacked):', fine.map(x => x.id).join(', '));
  for (const x of list) console.log(`   ${x.id} (${x.scopeSource}, ${x.reason}): ${x.out.slice(0, 130)}`);

  if (h.errors.length) console.log('PAGE ERRORS', h.errors);
  await h.close();
})().catch(e => { console.error(e); process.exit(1); });
