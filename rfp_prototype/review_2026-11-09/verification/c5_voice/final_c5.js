// Cluster c5_voice, last pass: three adjacent defects seen through the page, the exact how and gain sentences behind the
// six lifecycle hits beside the SOW's own client wording, and the full cja-bc prerequisite the voice sweep flagged.
// Run: node /home/user/warroom/sow/rfp_prototype/review_2026-11-09/verification/c5_voice/final_c5.js
const fs = require('fs'), path = require('path');
const {open} = require('/home/user/warroom/sow/rfp_prototype/review_2026-11-09/harness.js');
const HERE = __dirname;
const RULES = JSON.parse(fs.readFileSync('/home/user/warroom/sow/product_copy_rules.json', 'utf8'));
const save = (name, obj) => fs.writeFileSync(path.join(HERE, name), JSON.stringify(obj, null, 1));
const first = (r) => r.questions.find(q => q.kind !== 'firm') || r.questions[0];
const sowReplace = (s) => { let v = s || ''; for (const [b, a] of RULES.sow_replacements) v = v.split(b).join(a); return v; };

(async () => {
  const h = await open();
  const conns = await h.eval(() => RFP_CAT.connections);
  const out = {};
  const probes = [
    ['X1 cw-cja', 'How does Coworker work with Customer Journey Analytics for our AI channel readouts?', /A our Skill|you authors|we does/],
    ['X2 csrc-eds', 'How does Edge Delivery publish pages from SharePoint and Google Drive document authoring?', /you authors/],
    ['X3 O04', 'Describe the off-site authority and earned media program you run after launch for Brand Visibility.', /we does not edit|your authorized outreach/],
    ['X4 AD1', 'How do you connect our Google Ads and Meta ad accounts to Customer Journey Analytics for paid media reporting?', /we will your ad admins|we authorizes/],
    ['X5 BI1', 'How do you connect Customer Journey Analytics to our Power BI and Tableau BI tools?', /query Service/],
  ];
  for (const [name, q, re] of probes) {
    const r = await h.text(q);
    const f = first(r);
    const text = f && f.draft ? f.draft.sections.map(s => s[0] + '\n' + s[1].join('\n')).join('\n') : '';
    const m = re.exec(text);
    out[name] = {question: q, conn: f && f.draft ? f.draft.conn : null, lines: f && f.draft ? f.draft.lines.map(l => l.id) : null, hit: m ? m[0] : null, around: m ? text.slice(Math.max(0, m.index - 120), m.index + 120) : null, sections: f && f.draft ? f.draft.sections : null};
    console.log(`\n[${name}] conn=${out[name].conn} lines=${JSON.stringify(out[name].lines)} hit=${JSON.stringify(out[name].hit)}\n  ${out[name].around}`);
  }
  // the exact sentences behind the six lifecycle hits, and the SOW's client wording for the same fact
  const six = ['ajo-target', 'target-eds', 'ajo-eds', 'rtcdp-eds', 'workfront-cw', 'commerce-aemsites'];
  const LIFE = /maintenance mode|Legacy|legacy|co-innovation|limited number of customers|not currently offered|health care|finance/g;
  const cmp = [];
  for (const id of six) {
    const c = conns.find(x => x.id === id);
    const texts = {how: c.how || '', 'gain.text': (c.gain || {}).text || ''};
    const sentences = [];
    for (const [k, v] of Object.entries(texts)) for (const s of v.split(/(?<=\.)\s+/)) if (LIFE.test(s)) { LIFE.lastIndex = 0; sentences.push({field: k, sentence: s, after_sow_replacements: sowReplace(s), changed: sowReplace(s) !== s}); }
    const rulesTouching = RULES.sow_replacements.filter(([b]) => (texts.how + ' ' + texts['gain.text']).includes(b)).map(([b, a]) => ({before: b, after: a}));
    cmp.push({id, sentences, sow_rules_whose_before_string_occurs_in_how_or_gain: rulesTouching, sowAvailability: c.sowAvailability || null, availability: c.availability, sowPrereqs_with_label_removed: (c.sowPrereqs || []).filter(p => !LIFE.test(p)).length + ' of ' + (c.sowPrereqs || []).length, prereqs_with_label: (c.prereqs || []).filter(p => { const t = LIFE.test(p); LIFE.lastIndex = 0; return t; })});
    console.log(`\n[C5.1 ${id}]`); for (const s of sentences) console.log(`  ${s.field}: ${s.sentence}\n    after sow_replacements: ${s.changed ? s.after_sow_replacements : '(unchanged)'}`); console.log('  sow rules whose before-string occurs in how/gain:', rulesTouching.length, '\n  sowAvailability:', c.sowAvailability || '(none)');
  }
  out.lifecycle_vs_sow = cmp;
  const cjabc = conns.find(c => c.id === 'cja-bc');
  out.cja_bc_prereq2 = {text: cjabc.prereqs[2], rfp: await h.voice(cjabc.prereqs[2])};
  console.log('\n[cja-bc prereqs[2]]', cjabc.prereqs[2]);
  out.cw_cja_gain = {original: conns.find(c => c.id === 'cw-cja').gain.text, rfp: await h.voice(conns.find(c => c.id === 'cw-cja').gain.text)};
  console.log('[cw-cja gain]', out.cw_cja_gain.original, '\n  ->', out.cw_cja_gain.rfp);
  save('out_final.json', out);
  if (h.errors.length) console.log('PAGE ERRORS', h.errors);
  await h.close();
})().catch(e => { console.error(e); process.exit(1); });
