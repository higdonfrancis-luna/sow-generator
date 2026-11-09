// Cluster c1_finder: reproduces the reviewers' claims about the question finder (findQuestions, paragraphs, the
// INSTRUCTION filter, the 300 and 900 limits) against the built prototype, through the review harness.
// Run: node /home/user/warroom/sow/rfp_prototype/review_2026-11-09/verification/c1_finder/run_c1.js
// Writes inputs.json and out_<claim>.json beside this file, and prints a condensed summary.
const fs = require('fs'), path = require('path');
const {open} = require('/home/user/warroom/sow/rfp_prototype/review_2026-11-09/harness.js');
const HERE = __dirname;
const inputs = {};
const save = (name, obj) => fs.writeFileSync(path.join(HERE, name), JSON.stringify(obj, null, 1));

// condensed view of a text() result: count, status, and per question label | kind | products | conn | lines | first 300 chars of the draft
const brief = (r) => ({
  status: r.status, count: r.count,
  questions: r.questions.map(q => ({
    i: q.i, label: q.label, kind: q.kind, text: q.text,
    products: q.draft ? q.draft.products.map(p => p.id) : null,
    conn: q.draft ? q.draft.conn : null,
    fromContext: q.draft ? q.draft.fromContext : null,
    lines: q.draft ? q.draft.lines.map(l => l.id) : null,
    draft300: q.draft ? q.draft.plain.slice(0, 300) : null,
  })),
});

(async () => {
  const h = await open();
  const results = {};
  async function run(claim, name, text) {
    inputs[claim] = inputs[claim] || [];
    inputs[claim].push({name, text});
    const r = await h.text(text, 'pasted.txt');
    const paras = await h.paragraphs(text);
    const out = {name, text, paragraphs: paras, result: brief(r), raw: r};
    results[claim] = results[claim] || [];
    results[claim].push(out);
    const b = out.result;
    console.log(`\n[${claim}] ${name}\n  paragraphs: ${JSON.stringify(paras)}\n  count=${b.count} status=${JSON.stringify(b.status)}`);
    for (const q of b.questions) console.log(`   #${q.i} label=${JSON.stringify(q.label)} kind=${q.kind} products=${JSON.stringify(q.products)} conn=${q.conn} lines=${JSON.stringify(q.lines)}\n      text=${JSON.stringify(q.text)}\n      draft300=${JSON.stringify(q.draft300)}`);
    return out;
  }

  // ---------- C1.1 statements
  const C11 = [
    '3.1 The solution shall support multi-site management with shared components across 12 regional brands.',
    '3.2 The solution must support role-based publishing.',
    '3.3 The platform should provide a sitemap and redirects.',
    '3.4 Respondent will provide a migration plan for our 40 sites.',
    '3.5 Vendor to confirm support for multi-language sites.',
    '3.6 Support for scheduled publishing.',
    'REQ-101: The proposed CDP must ingest batch data from Snowflake and streaming events from Web SDK.',
    '3.2.4 Vendor shall configure role-based access control and development and production sandboxes in Adobe Experience Platform.',
    '4.1 Ability to export Experience Fragments from AEM Sites to Adobe Target as HTML or JSON offers.',
    'R1. The solution shall provide a unified customer profile across channels.',
  ];
  for (const [k, t] of C11.entries()) await run('C1.1', `statement ${k + 1}`, t);
  await run('C1.1', 'all ten in one paste', C11.join('\n'));

  // ---------- C1.2 mandatory and desirable tags
  const C12 = [
    '2.1 (M) Describe your approach to implementing AEM Sites.',
    '2.2 [Mandatory] Describe your migration approach.',
    '2.3 MANDATORY: Explain how Brand Visibility reports AI citations.',
    '2.4 Desirable - Describe your training program.',
    '[M] 2.5 Describe your support model.',
    '2.6 Describe how you would set up Marketo programs. (Mandatory)',
    'M1 (Mandatory) The solution must support SSO.',
    'D1 (Desirable) The solution should support dark mode.',
  ];
  for (const [k, t] of C12.entries()) await run('C1.2', `tag ${k + 1}`, t);
  await run('C1.2', 'all eight in one paste', C12.join('\n'));

  // ---------- C1.3 sub-questions
  await run('C1.3', 'AJO and RTCDP with a) b) c)', '12. We are implementing Adobe Journey Optimizer and Real-Time CDP.\na) Describe how you will configure sandboxes, roles, and sending subdomains.\nb) How will you execute the IP warmup plan?\nc) Explain how audiences and profile attributes flow into journeys.');
  await run('C1.3', 'a) alone (what the finder keeps of it)', 'Describe how you will configure sandboxes, roles, and sending subdomains.');
  await run('C1.3', 'b) with the parent words attached (a construction, to see whether JO03 can match at all)', 'How will you execute the IP warmup plan for Adobe Journey Optimizer?');
  await run('C1.3', 'inline a) b) c)', '4.1 Describe: a) data ingestion; b) identity resolution; c) activation.');
  await run('C1.3', 'roman (i) (ii) (iii) as given', '5. Describe how you would:\n(i) migrate content to AEM Sites\n(ii) connect AEM Sites to Target\n(iii) train our authors');
  await run('C1.3', 'roman (i) (ii) (iii) with request verbs (a construction, to see the label)', '5. Describe how you would:\n(i) Describe how you would migrate content to AEM Sites.\n(ii) Explain how you would connect AEM Sites to Target.\n(iii) Describe how you would train our authors.');
  const jo = await h.eval(() => Object.entries(RFP_CAT.lines).filter(([id, l]) => /warm/i.test(id + ' ' + l.name + ' ' + (l.scope || ''))).map(([id, l]) => ({id, name: l.name, unit: l.unit, scope: (l.scope || '').slice(0, 160)})));
  const ajoLines = await h.eval(() => { const p = RFP_CAT.products.find(p => p.id === 'ajo'); return {lines: p.lines, more: p.more || []}; });
  const aliasHits = await h.eval(() => ({detect_ip_warmup: RFPAnswers.detect('How will you execute the IP warmup plan?'), detect_sandboxes: RFPAnswers.detect('Describe how you will configure sandboxes, roles, and sending subdomains.'), detect_parent: RFPAnswers.detect('We are implementing Adobe Journey Optimizer and Real-Time CDP.')}));
  results['C1.3_catalog'] = {warmup_lines: jo, ajo_product_lines: ajoLines, detect: aliasHits};
  console.log('\n[C1.3] catalog lines about warmup:', JSON.stringify(jo), '\n  ajo product lines:', JSON.stringify(ajoLines), '\n  detect():', JSON.stringify(aliasHits));

  // ---------- C1.4 lot headings and duplicates
  await run('C1.4', 'two lots', 'Lot 1: Adobe Experience Manager Sites\n1.1 Describe your implementation approach.\n1.2 Describe your approach to ongoing support.\nLot 2: Customer Journey Analytics\n2.1 Describe your implementation approach.\n2.2 Describe your approach to ongoing support.');

  // ---------- C1.5 the instruction filter
  const C15 = [
    'Submit a migration plan for moving our 40 regional sites to AEM Sites.',
    "Describe how Brand Concierge would answer all of our members' questions about rates and fees.",
    'Describe how Workfront alerts campaign owners when a deadline is at risk.',
    'The system alerts campaign owners when a deadline is at risk.',
  ];
  for (const [k, t] of C15.entries()) await run('C1.5', `instruction ${k + 1}`, t);
  const instr = await h.eval((texts) => {
    const INSTRUCTION = /\b(respond|reply|answer)\b.*\b(each|every|all)\b.*\b(question|item|section)s?\b|in the order (given|listed|presented|shown)|^instructions?\b|^submit\b|^include a signed|\bdeadline\b|^(responses?|proposals?) (are |is )?due\b|^keep each answer/i;
    const ASKS = /^(describe|explain|provide|list|detail|outline|how|what|which|where|when|who|confirm|identify|indicate|state|include|demonstrate|summari[sz]e|specify|propose|define|discuss|document|share|present|submit|do you|does your|can you|will you|are you|have you|is your|please)\b/i;
    return texts.map(t => { const m = INSTRUCTION.exec(t); return {text: t, asks: ASKS.test(t), instruction_match: m ? m[0] : null}; });
  }, C15);
  results['C1.5_regex'] = instr;
  console.log('\n[C1.5] INSTRUCTION matches:', JSON.stringify(instr, null, 1));

  // ---------- C1.6 silent limits
  const lines350 = [];
  for (let n = 1; n <= 350; n++) lines350.push(n <= 345 ? `${n}. Describe requirement ${n}.` : `${n}. Describe how Brand Visibility reports AI citations for requirement ${n}.`);
  {
    const r = await h.text(lines350.join('\n'), 'pasted.txt');
    inputs['C1.6a'] = [{name: '350 numbered lines, the last five about Brand Visibility', text: '(generated: see run_c1.js) first line ' + lines350[0] + ' ... last line ' + lines350[349]}];
    const out = {count: r.count, status: r.status, first: r.questions[0], last: r.questions[r.questions.length - 1], lastLabel: r.questions[r.questions.length - 1].label, bvFound: r.questions.filter(q => /Brand Visibility/.test(q.text)).length};
    results['C1.6a'] = out;
    console.log('\n[C1.6a] 350 lines: count=' + out.count + ' lastLabel=' + out.lastLabel + ' bvFound=' + out.bvFound + '\n  status=' + JSON.stringify(out.status));
  }
  {
    const filler = ' Our bank runs forty regional sites on a legacy content management system with separate templates, separate hosting and separate release cycles, and the marketing team cannot publish a campaign page across all regions without a developer on each one.';
    let long = '7. Describe your approach to implementing AEM Sites for our forty regional brands, including how authors would share components and templates across sites, how you would migrate the existing pages, and how the sites would be found in search and in AI answers.';
    while (long.length < 1200) long += filler;
    long = long.slice(0, 1200).replace(/\s+\S*$/, '.');
    const r = await h.text(long, 'pasted.txt');
    inputs['C1.6b'] = [{name: 'one ' + long.length + '-character question naming AEM Sites', text: long}];
    results['C1.6b'] = {length: long.length, count: r.count, status: r.status, questions: brief(r).questions};
    console.log('\n[C1.6b] ' + long.length + ' chars: count=' + r.count + ' status=' + JSON.stringify(r.status));
    const r2 = await h.text(long.slice(0, 890).replace(/\s+\S*$/, '.'), 'pasted.txt');
    results['C1.6b_control_890'] = {count: r2.count, status: r2.status};
    console.log('  control at <=900 chars: count=' + r2.count);
  }
  const C16c = ['REQ-001 Describe your approach to AEM Sites.', 'FR-3.2 Describe your approach to Target.', 'Item 15: Describe your approach to Marketo.'];
  for (const [k, t] of C16c.entries()) await run('C1.6c', `numbering ${k + 1}`, t);
  await run('C1.6c', 'all three in one paste', C16c.join('\n'));
  await run('C1.6d', 'property notice', 'Please note that all responses become the property of Northbridge Mutual Bank.');
  const C16e = ["Décrivez votre approche pour la mise en œuvre d'AEM Sites.", 'Describa su enfoque para implementar Adobe Target.', 'Descreva sua abordagem para implementar o Marketo Engage.'];
  for (const [k, t] of C16e.entries()) await run('C1.6e', `language ${k + 1}`, t);
  await run('C1.6f', 'security appendix', 'Appendix C: Security Questionnaire\nS1. Do you support single sign-on with SAML 2.0?\nS2. Is customer data encrypted at rest?\nS3. Describe your data retention policy.');

  // ---------- C1.7 two-part questions
  await run('C1.7', 'AEM Sites and the team', 'Describe your approach to implementing AEM Sites and the team you would assign.');
  await run('C1.7', 'timeline and staffing plan', 'Describe your approach to implementing AEM Sites, including a timeline and staffing plan.');
  await run('C1.7', 'experience for banks', 'Describe your experience implementing Adobe Experience Manager Sites for banks.');

  // ---------- extra: adjacent checks the reviewers did not run
  await run('X1', 'unnumbered short questions on their own lines', 'Do you support SSO?\nDo you encrypt data at rest?\nWhat is your uptime SLA?\nDescribe your approach to AEM Sites.');
  await run('X2', 'common request openers not in ASKS', 'Briefly describe your approach to AEM Sites.\n\nRespondents must describe their approach to implementing Adobe Target.\n\nBidders are asked to explain their approach to Marketo Engage.\n\nIn no more than 300 words, describe your approach to Customer Journey Analytics.\n\nKindly outline your approach to Brand Concierge.\n\nThe vendor should describe its approach to Workfront.');
  await run('X3', 'upper-case lettered sub-items', '(A) Describe your approach to AEM Sites.\n(B) Describe your approach to Adobe Target.');
  await run('X4', 'lower-case lettered sub-items: label stripping', '(a) Describe your approach to AEM Sites.\n(b) Describe your approach to Adobe Target.\na) Describe your approach to Marketo Engage.');
  await run('X5', 'a question mark bypasses the instruction filter', 'Questions? Contact the procurement office at rfp@northbridge.example before the deadline of 3 May.');
  await run('X6', 'a stem that ends with a colon survives alone', '5. Describe how you would:\n- migrate content to AEM Sites\n- connect AEM Sites to Target');
  await run('X7', 'numbered lines under 12 characters', '1. Why us?\n2. Why AEM?\n3. Describe your approach to AEM Sites.');
  await run('X8', 'wrapped question split by the paragraph rule', 'Describe your approach to migrating our forty regional sites to AEM Sites on Edge Delivery Services.\nInclude how you would keep search rankings during the move and how authors would be trained.');

  // the regexes and limits, quoted from patch_step49.py
  const src = fs.readFileSync('/home/user/warroom/sow/patch_step49.py', 'utf8').split('\n');
  const quote = (re) => src.map((l, i) => [i + 1, l]).filter(([, l]) => re.test(l)).map(([n, l]) => ({line: n, text: l.replace(/\\\\/g, '\\')}));
  results['regexes'] = {
    NUM: quote(/^const NUM=/), ASKS: quote(/^const ASKS=/), INSTRUCTION: quote(/^const INSTRUCTION=/),
    limits: quote(/p\.length<12\|\|p\.length>900|qs\.length>=300/), paragraph_rules: quote(/const starts=|const prevDone=|if\(starts\|\|/),
    asks_gate: quote(/const asks=/), dedupe: quote(/const key=body|seen\.has\(key\)/), label: quote(/label=m\[0\]/),
  };
  console.log('\n[regexes]', JSON.stringify(results['regexes'], null, 1));

  save('inputs.json', inputs);
  for (const [k, v] of Object.entries(results)) save('out_' + k.replace(/[^A-Za-z0-9_.]/g, '_') + '.json', v);
  console.log('\npage errors:', JSON.stringify(h.errors));
  await h.close();
})().catch(e => { console.error(e); process.exit(1); });
