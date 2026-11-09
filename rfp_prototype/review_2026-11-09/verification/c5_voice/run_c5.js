// Cluster c5_voice: reproduces the reviewers' claims about the wording that reaches the client (compose's Our approach
// from the connection's how and gain.text, doLine over line scopes, rfp()) against the built prototype, through the
// review harness. Run: node /home/user/warroom/sow/rfp_prototype/review_2026-11-09/verification/c5_voice/run_c5.js
// Writes inputs.json and out_<claim>.json beside this file, and prints a condensed summary.
const fs = require('fs'), path = require('path');
const {open} = require('/home/user/warroom/sow/rfp_prototype/review_2026-11-09/harness.js');
const HERE = __dirname;
const RULES = JSON.parse(fs.readFileSync('/home/user/warroom/sow/product_copy_rules.json', 'utf8'));
const CATALOG = JSON.parse(fs.readFileSync('/home/user/warroom/sow/canvas/catalog.json', 'utf8'));
const inputs = {};
const save = (name, obj) => fs.writeFileSync(path.join(HERE, name), JSON.stringify(obj, null, 1));
const note = (claim, name, text) => { (inputs[claim] = inputs[claim] || []).push({name, text}); };

// the drafted sections of the first Adobe question of a text() result, flattened
const first = (r) => r.questions.find(q => q.kind !== 'firm') || r.questions[0];
const approachOf = (q) => { const s = q && q.draft && q.draft.sections.find(x => x[0] === 'Our approach'); return s ? s[1] : []; };
const allText = (q) => q && q.draft ? q.draft.sections.map(s => s[1].join('\n')).join('\n') : '';
const brief = (q) => q ? ({i: q.i, label: q.label, kind: q.kind, text: q.text,
  products: q.draft ? q.draft.products.map(p => p.id) : null, conn: q.draft ? q.draft.conn : null,
  lines: q.draft ? q.draft.lines.map(l => l.id) : null, sections: q.draft ? q.draft.sections : null,
  asks: q.draft ? q.draft.asks : null, sells: q.draft ? q.draft.sells : null}) : null;

const LIFECYCLE = /maintenance mode|Legacy|legacy|co-innovation|limited number of customers|not currently offered|health care|finance|beta|planned/g;
const CAUTION = /confirm with Adobe|so confirm|prove it|pilot|your client|the partner|partner's|partners|before you|ask Adobe|check with|do not promise|don't promise|caveat|not a documented capability|documents no setup|Named by Adobe/gi;
const VOICE = /you and you|the client\b|the customer|partner|the Client|Client's/g;
const matches = (re, s) => { const out = []; let m; re.lastIndex = 0; while ((m = re.exec(s || ''))) { out.push({phrase: m[0], at: m.index, around: s.slice(Math.max(0, m.index - 60), m.index + m[0].length + 60)}); } return out; };
const sentenceAround = (s, at) => { const start = s.lastIndexOf('. ', at) + 1, end = s.indexOf('. ', at); return s.slice(start < 0 ? 0 : start, end < 0 ? s.length : end + 1).trim(); };
const sowReplace = (s) => { let v = s || ''; for (const [b, a] of RULES.sow_replacements) v = v.split(b).join(a); return v; };

(async () => {
  const h = await open();
  const P = await h.eval(() => Object.fromEntries(RFP_CAT.products.map(p => [p.id, p.name])));
  const conns = await h.eval(() => RFP_CAT.connections.map(c => ({id: c.id, a: c.a, b: c.b, label: c.label, how: c.how, gain: c.gain ? c.gain.text : '', availability: c.availability, sowAvailability: c.sowAvailability || null, prereqs: c.prereqs || [], sowPrereqs: c.sowPrereqs || null})));
  const pageConnFields = await h.eval(() => Object.keys(RFP_CAT.connections[0]));
  console.log('RFP_CAT connections:', conns.length, 'fields on the page:', pageConnFields.join(','));

  // ---------- C5.1 the Workfront + Coworker question, then the lifecycle sweep
  const q51 = 'How would Coworker work inside Workfront for our campaign managers?';
  note('C5.1', 'Opus A6 input', q51);
  const r51 = await h.text(q51);
  const f51 = first(r51);
  const app51 = approachOf(f51).join('\n');
  const c51 = {input: q51, result: brief(f51), approach: app51, contains_not_currently_offered: app51.includes('not currently offered to health care, finance'),
    where_in_page: {panel_response_section: app51.includes('not currently offered to health care, finance')}};
  console.log('\n[C5.1] conn=', f51.draft && f51.draft.conn, 'contains phrase:', c51.contains_not_currently_offered, '\n  approach:', app51.slice(0, 400));

  const sweep51 = [];
  for (const c of conns) {
    const text = (c.how || '') + ' ' + (c.gain || '');
    const hits = matches(LIFECYCLE, text);
    if (hits.length) sweep51.push({id: c.id, a: c.a, b: c.b, hits: hits.map(x => ({phrase: x.phrase, in: (c.how || '').includes(x.phrase) && (c.how || '').indexOf(x.phrase) === text.indexOf(x.phrase) ? 'how' : 'gain.text', around: x.around}))});
  }
  console.log('[C5.1] lifecycle hits in how+gain.text:', sweep51.length, sweep51.map(x => x.id + ':' + x.hits.map(y => y.phrase).join('|')).join('  '));
  // each hit, as a question naming both products, through the page
  const probes51 = [];
  for (const hit of sweep51) {
    const q = `How does ${P[hit.a]} work with ${P[hit.b]}?`;
    note('C5.1', 'sweep probe ' + hit.id, q);
    const r = await h.text(q);
    const f = first(r);
    const sections = allText(f);
    const inDraft = hit.hits.map(x => ({phrase: x.phrase, in_draft: sections.includes(x.phrase)}));
    const c = conns.find(x => x.id === hit.id);
    const afterSow = {how: sowReplace(c.how), gain: sowReplace(c.gain)};
    const stillAfterSow = hit.hits.map(x => ({phrase: x.phrase, remains_after_sow_replacements: (afterSow.how + ' ' + afterSow.gain).includes(x.phrase)}));
    probes51.push({id: hit.id, question: q, matched_conn: f.draft ? f.draft.conn : null, products: f.draft ? f.draft.products.map(p => p.id) : null, matched_intended: !!(f.draft && f.draft.conn === hit.a + '+' + hit.b),
      phrases: inDraft, sections: f.draft ? f.draft.sections : null, sow_replacements_pass: stillAfterSow,
      sow_fields_on_page: {sowAvailability: c.sowAvailability, availability: c.availability, sowPrereqs: c.sowPrereqs}});
    console.log(`   ${hit.id}: conn=${f.draft && f.draft.conn} intended=${probes51[probes51.length - 1].matched_intended} phrases=${JSON.stringify(inDraft)} sow_pass=${JSON.stringify(stillAfterSow)}`);
  }
  save('out_C5.1.json', {question: c51, sweep: sweep51, probes: probes51});

  // ---------- C5.2 the three Gemini questions, then the caution sweep over every connection
  const q52 = ['How does Brand Concierge trigger follow-up journeys in Adobe Journey Optimizer?', 'How does Brand Concierge use AEM Sites for product cards in answers?', 'How does Brand Visibility enrich product detail pages in Adobe Commerce?'];
  const c52 = [];
  for (const q of q52) {
    note('C5.2', 'Gemini 4 input', q);
    const r = await h.text(q);
    const f = first(r);
    const app = approachOf(f);
    const cautions = matches(CAUTION, allText(f));
    c52.push({input: q, result: brief(f), approach: app, cautions});
    console.log(`\n[C5.2] ${q}\n  conn=${f.draft && f.draft.conn} lines=${JSON.stringify(f.draft && f.draft.lines.map(l => l.id))}\n  approach=${JSON.stringify(app).slice(0, 700)}\n  cautions=${JSON.stringify(cautions.map(x => x.phrase))}`);
  }
  const sweep52 = [], misses52 = [];
  for (const c of conns) {
    const q = `How does ${P[c.a]} work with ${P[c.b]}?`;
    note('C5.2', 'sweep ' + c.id, q);
    const r = await h.text(q);
    const f = first(r);
    const conn = f.draft ? f.draft.conn : null;
    const intended = conn === c.a + '+' + c.b;
    if (!intended) misses52.push({id: c.id, question: q, matched_conn: conn, products: f.draft ? f.draft.products.map(p => p.id) : null});
    const sections = f.draft ? f.draft.sections : [];
    for (const [heading, items] of sections) for (const item of items) {
      for (const m of matches(CAUTION, item)) sweep52.push({id: c.id, matched_conn: conn, intended, heading, phrase: m.phrase, sentence: sentenceAround(item, m.at), item});
    }
  }
  console.log('\n[C5.2] sweep: questions whose draft is not the intended connection:', misses52.length, JSON.stringify(misses52.map(m => m.id + '->' + m.matched_conn)));
  console.log('[C5.2] caution hits in drafted sections:', sweep52.length);
  for (const s of sweep52) console.log(`   ${s.id} [${s.heading}] "${s.phrase}": ${s.sentence.slice(0, 200)}`);
  save('out_C5.2.json', {questions: c52, sweep: sweep52, misses: misses52});

  // ---------- C5.3 doLine over every line, then the rfp() voice sweep
  const doLines = await h.eval(() => Object.keys(RFP_CAT.lines).map(id => {
    const L = RFP_CAT.lines[id], T = typeof CATALOG !== 'undefined' ? CATALOG.find(t => t.id === id) : null;
    const scope = L.scope || (T && T.scope) || L.name;
    return {id, name: L.name, unit: L.unit, origin: L.origin || null, scopeSource: L.scope ? 'line.scope' : (T && T.scope) ? 'CATALOG.scope' : 'line.name', scope, out: RFPAnswers.doLine(id)};
  }));
  const BAD_START = /^(?:Each month we will|[^:]{0,130}: we will|We will) (where|once|if|when|after|for|the|a|an|derived|agreed)\b/i;
  const firstWord = (o) => { const m = /(?:^|: |^Each month )[Ww]e will ([A-Za-z'-]+)/.exec(o); return m ? m[1] : null; };
  const words = {};
  for (const d of doLines) { const w = firstWord(d.out); d.firstWord = w; words[w] = (words[w] || 0) + 1; }
  // verbs: every first word that reads as a bare infinitive after "we will"; the rest are flagged
  const VERBS = new Set(['add','agree','align','allow','analyse','analyze','apply','assess','assign','audit','automate','baseline','build','capture','carry','check','choose','classify','clean','collect','combine','compare','complete','configure','confirm','connect','convert','coordinate','create','decide','define','deliver','deploy','describe','design','detect','develop','document','draft','enable','enrich','establish','evaluate','expand','extend','extract','feed','fix','follow','forward','gather','generate','govern','group','guide','hand','handle','help','hold','identify','implement','import','improve','include','install','integrate','interview','introduce','join','keep','launch','lead','link','list','load','log','maintain','make','manage','map','measure','meet','merge','migrate','model','monitor','move','name','normalize','onboard','operate','optimise','optimize','outline','own','pair','pick','pilot','place','plan','point','prepare','present','prioritise','prioritize','produce','promote','propose','prove','provide','provision','publish','put','qualify','rank','read','rebuild','recommend','reconcile','record','refine','refresh','register','release','remove','repair','repeat','replace','report','request','research','resolve','retire','return','review','revise','rewrite','roll','route','run','schedule','scope','score','screen','secure','seed','select','send','set','share','ship','show','size','specify','stand','start','stay','structure','submit','summarise','summarize','supply','support','sync','tag','tailor','take','target','teach','test','tidy','tier','track','train','translate','trim','triage','tune','turn','update','upgrade','use','validate','verify','walk','watch','wire','work','write']);
  for (const d of doLines) {
    const w = (d.firstWord || '').toLowerCase();
    d.badStart = BAD_START.test(d.out);
    d.firstWordIsVerb = VERBS.has(w);
    d.flag = d.badStart || !d.firstWordIsVerb;
    // a lowercased proper noun or acronym right after "we will" ("we will cJA ...", "we will brand Visibility ...")
    d.lowercasedProperNoun = /(?:^|: |^Each month )[Ww]e will (?:[a-z][A-Z]|(?:brand|adobe|aem|cja|edge|journey|real|marketo|workfront|coworker|target|commerce|experience|sites|optimize|content|analytics|google|microsoft|salesforce|snowflake|fastly|akamai|cloudflare)\b [A-Z])/.test(d.out) && /^[A-Z]/.test(d.scope);
  }
  const flagged = doLines.filter(d => d.flag);
  console.log('\n[C5.3] doLine first words:', JSON.stringify(words));
  console.log('[C5.3] flagged as ungrammatical:', flagged.length);
  for (const d of flagged) console.log(`   ${d.id} (${d.scopeSource}): ${d.out.slice(0, 160)}`);
  const lowered = doLines.filter(d => d.lowercasedProperNoun);
  console.log('[C5.3] lowercased proper noun after "we will":', lowered.length, lowered.map(d => d.id + ': ' + d.out.slice(0, 60)).join(' | '));
  save('out_C5.3_doLine.json', {firstWords: words, flagged, lowercasedProperNoun: lowered, all: doLines});

  // rfp() over every line scope and every connection how, gain.text, prereqs and sowPrereqs
  const voiceIn = [];
  for (const d of doLines) voiceIn.push({kind: 'line.scope', id: d.id, source: d.scopeSource, text: d.scope, reachesClient: 'yes: What we would do / After launch'});
  for (const c of conns) {
    voiceIn.push({kind: 'conn.how', id: c.id, text: c.how || '', reachesClient: 'yes: Our approach'});
    voiceIn.push({kind: 'conn.gain.text', id: c.id, text: c.gain || '', reachesClient: 'yes: Our approach'});
    (c.prereqs || []).forEach((p, i) => voiceIn.push({kind: 'conn.prereqs[' + i + ']', id: c.id, text: p, reachesClient: i < 6 ? 'no: partner note only (unrewritten), first six' : 'no: dropped by slice(0,6)'}));
    (c.sowPrereqs || []).forEach((p, i) => voiceIn.push({kind: 'conn.sowPrereqs[' + i + ']', id: c.id, text: p, reachesClient: 'no: RFP_CAT carries it but rfp_answers.js never reads it except toSow'}));
  }
  const voiceOut = await h.eval((items) => items.map(x => Object.assign({}, x, {out: RFPAnswers.rfp(x.text)})), voiceIn);
  const voiceHits = [];
  for (const v of voiceOut) { const ms = matches(VOICE, v.out); if (ms.length) voiceHits.push(Object.assign({}, v, {phrases: ms.map(m => m.phrase), around: ms.map(m => m.around)})); }
  const byKind = {};
  for (const v of voiceHits) byKind[v.kind.replace(/\[\d+\]/, '[]')] = (byKind[v.kind.replace(/\[\d+\]/, '[]')] || 0) + 1;
  console.log('\n[C5.3] rfp() voice hits:', voiceHits.length, JSON.stringify(byKind));
  for (const v of voiceHits) console.log(`   ${v.kind} ${v.id} ${JSON.stringify(v.phrases)}: ${v.out.slice(0, 170)}`);
  // agreement failures the verb lists do not cover: "you <verb>s", "we <verb>s"
  const AGREE = /\b([Yy]ou|[Ww]e) ([a-z]+(?:s|es))\b(?! and)/g;
  const agree = [];
  for (const v of voiceOut) { if (!/\b(the Client|the partner|your client|Partners|Client-)\b/.test(v.text) && !/\bthe Client's\b/.test(v.text)) continue; for (const m of matches(AGREE, v.out)) { const w = m.phrase.split(' ')[1]; if (/^(this|his|its|is|was|has|does|goes|plus|minus|across|access|process|address|business|analysis|basis|status|progress|previous|less|unless|always|sometimes|perhaps|yes|es)$/.test(w)) { if (/^(is|was|has|does|goes)$/.test(w)) agree.push({kind: v.kind, id: v.id, phrase: m.phrase, around: m.around}); continue; } agree.push({kind: v.kind, id: v.id, phrase: m.phrase, around: m.around}); } }
  console.log('[C5.3] possible agreement failures after the rewrite:', agree.length);
  for (const a of agree) console.log(`   ${a.kind} ${a.id} "${a.phrase}": ${a.around}`);
  save('out_C5.3_rfp.json', {count: voiceHits.length, byKind, hits: voiceHits, agreementCandidates: agree, allInputsCount: voiceIn.length});

  // ---------- C5.4 bank 2.2
  const q54 = 'How would you connect our Customer Journey Analytics data to AI assistant traffic, and what do you need from us?';
  note('C5.4', 'bank 2.2 alone', q54);
  const r54 = await h.text(q54);
  const f54 = first(r54);
  const app54 = approachOf(f54).join('\n');
  const phrase54 = 'which ordinary referrer reporting can show without it; lift comes only from a test';
  const bank = fs.readFileSync('/home/user/warroom/sow/qa/rfp_fixtures/bank_rfp.txt', 'utf8');
  note('C5.4', 'bank_rfp.txt whole', bank);
  const rb = await h.text(bank, 'bank_rfp.txt');
  const qb = rb.questions.find(q => q.label === '2.2');
  const appb = approachOf(qb).join('\n');
  save('out_C5.4.json', {alone: {input: q54, result: brief(f54), approach: app54, contains: app54.includes(phrase54)}, inBankFile: {result: brief(qb), approach: appb, contains: appb.includes(phrase54)}, phrase: phrase54,
    gainTextOnPage: conns.find(c => c.id === 'bv-cja').gain});
  console.log(`\n[C5.4] alone: conn=${f54.draft && f54.draft.conn} contains=${app54.includes(phrase54)}\n  ${app54.slice(0, 500)}\n  in bank file: conn=${qb.draft && qb.draft.conn} contains=${appb.includes(phrase54)}`);

  // ---------- C5.5 the downloaded response's intro
  const doc = await h.doc();
  const intro = (/<p class="intro">([\s\S]*?)<\/p>/.exec(doc) || [])[1] || '';
  const tags = [...doc.matchAll(/<p class="tag">([^<]*)<\/p>/g)].map(m => m[1]);
  const rows = await h.rows();
  const statuses = [...new Set(rows.rows.slice(1).map(r => r[3]))];
  const asksDoc = await h.asks();
  const asksIntro = (/<p class="intro">([\s\S]*?)<\/p>/.exec(asksDoc) || [])[1] || '';
  save('out_C5.5.json', {loaded: 'bank_rfp.txt', intro, mentions_the_partner: /the partner/.test(intro), partnerCount: (intro.match(/partner/g) || []).length, statusTags: [...new Set(tags)], excelStatuses: statuses, asksDocIntro: asksIntro, docHead: doc.slice(0, 200)});
  console.log('\n[C5.5] intro:', intro, '\n  mentions "the partner":', /the partner/.test(intro), '\n  tags in doc:', JSON.stringify([...new Set(tags)]), '\n  excel statuses:', JSON.stringify(statuses));

  // ---------- C5.6 dwh-cja: "you and your client"
  const dwh = conns.find(c => c.id === 'dwh-cja');
  const idx = dwh.prereqs.findIndex(p => p.startsWith('At setup, you and your client assign'));
  const q56 = 'How do we bring Snowflake data warehouse tables into Customer Journey Analytics?';
  note('C5.6', 'Gemini 5 input', q56);
  const r56 = await h.text(q56);
  const f56 = first(r56);
  const sections56 = allText(f56);
  const noteAsks = f56.draft ? f56.draft.asks : [];
  const panel = await h.panel();
  const doc56 = await h.doc(), asks56 = await h.asks();
  const voicePrereq = await h.voice(dwh.prereqs[idx]);
  save('out_C5.6.json', {input: q56, result: brief(f56), prereq_index: idx, prereq_count: dwh.prereqs.length, prereq_text: dwh.prereqs[idx], shown_in_note: noteAsks.includes(dwh.prereqs[idx]) || (f56.draft && f56.draft.sells.includes(dwh.prereqs[idx])),
    you_and_you: {in_sections: sections56.includes('you and you'), in_asks: noteAsks.some(a => a.includes('you and you')), in_panel: panel.includes('you and you'), in_responseDoc: doc56.includes('you and you'), in_asksDoc: asks56.includes('you and you')},
    you_and_your_client: {in_panel: panel.includes('you and your client'), in_asksDoc: asks56.includes('you and your client'), in_responseDoc: doc56.includes('you and your client')},
    rfp_of_that_prereq_if_it_were_applied: voicePrereq, asks_shown: noteAsks, panelText: panel});
  console.log(`\n[C5.6] conn=${f56.draft && f56.draft.conn} prereq index=${idx} of ${dwh.prereqs.length}; shown in note=${noteAsks.includes(dwh.prereqs[idx])}\n  "you and you" in sections=${sections56.includes('you and you')} asks=${noteAsks.some(a => a.includes('you and you'))} panel=${panel.includes('you and you')} doc=${doc56.includes('you and you')} asksDoc=${asks56.includes('you and you')}\n  rfp() on that prereq: ${voicePrereq.slice(0, 120)}`);

  // ---------- C5.7 what rfp() rewrites
  const src = await h.eval(() => RFPAnswers.rfp.toString());
  const singularSrc = await h.eval(() => { try { return RFPAnswers.rfp.toString().includes('singular') ? 'singular(v): if(/ies$/.test(v))return v.replace(/ies$/,"y");if(/(sh|ch|x|ss)es$/.test(v))return v.replace(/es$/,"");return v.replace(/s$/,"")' : null; } catch (e) { return null; } });
  // one entry per .replace( call, in order; the text is the call as written in the shipped page
  const rules = src.split('.replace(').slice(1).map((s, i) => ({n: i + 1, call: '.replace(' + s.replace(/\s*\n\s*\.?$/, '').replace(/\)\s*;?\s*\}\s*$/, ')').trim()}));
  save('out_C5.7.json', {source: src, singular: singularSrc, rules});
  console.log('\n[C5.7] rfp() rules parsed:', rules.length);

  // ---------- extras: strings outside Our approach that reach the client; "the partner" tags; sample rewrites
  const samples = ['The partner does not edit articles about the client directly.', 'Partners confirm the route with Adobe.', 'The Client provides the list and the partner maps it.', 'the Client approves the plan', 'The Client owns the CDN and manages the tokens', 'The Client keeps the key and the partner validates it'];
  const sampleOut = await h.eval((s) => s.map(x => ({in: x, out: RFPAnswers.rfp(x)})), samples);
  save('out_X_samples.json', sampleOut);
  console.log('\n[X] sample rewrites:'); for (const s of sampleOut) console.log('   ', JSON.stringify(s.in), '->', JSON.stringify(s.out));

  save('inputs.json', inputs);
  if (h.errors.length) { console.log('PAGE ERRORS', h.errors); save('page_errors.json', h.errors); }
  await h.close();
})().catch(e => { console.error(e); process.exit(1); });
