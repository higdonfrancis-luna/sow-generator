// Step 53 (Nov 10 2026): client-safe wording. Run from the repo root after python3 sow/rfp_prototype/build.py:
//   node sow/test_rfp_step53.js
// Checks, on the built prototype: every service line reads as a sentence ("We will <verb>", or "<clause>, we will <verb>");
// the voice rewrite handles the partner as an object, the partner compounds, "you and your client", Client-provided and
// Client authorization, and the verbs does, authorizes and authors; the connection cards Adam approved for client-voice
// wording draft without lifecycle labels or partner cautions, which land in the note under Confirm with Adobe; no partner
// or Client word reaches any drafted response of the four made-up RFPs; the downloaded response is the client's copy;
// and the odd reference title is gone.
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
const FIX = __dirname + '/qa/rfp_fixtures';
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 500) + ']')); if (!c) fails++; };
// what a client must never read in a drafted response
const LABELS = /\blegacy\b|maintenance mode|co-innovation|limited number of customers|not currently (?:offered|available)|current scope|pilot item|\bAdobe says\b|confirm(?:ed|s|ing)?(?: [a-z']+){0,4} with Adobe|\bconfirm it\b|confirm(?:ed)? for your|prove it|is a design to prove|measure the implementation|\bbeta\b/i;
const PARTNER = /\bthe Client\b(?! ID| Secret)|\bClient's\b|\byour client\b|\bthe partner\b|\bpartner-|\bpartner validation|\bA our\b|\ba our\b|Client authorization|Client-provided|\bwe (?:does|authorizes|authors|has|is)\b|\byou (?:does|authorizes|authors|has|is)\b/;
const BROKEN = /\b[Ww]e will (?:the|a|an|your|our|where|for|with|in|once|using|derived|query|this|that|these|those|each|all|any|its|their|it|them|you|we|us|is|are|and|or)\b/;
const CARDS = [
  ['workfront-cw', 'How would Coworker work inside Workfront for our campaign managers?', /health care|finance/i],
  ['commerce-aemsites', 'How does the CIF add-on bring Adobe Commerce catalog data into AEM Sites authoring?', null],
  ['ajo-target', 'How can Journey Optimizer offer decisions run in Adobe Target activities?', null],
  ['target-eds', 'How would you run Adobe Target personalization on our Edge Delivery Services pages?', null],
  ['ajo-eds', 'How would Journey Optimizer web campaigns change our Edge Delivery Services pages?', null],
  ['rtcdp-eds', 'How do Edge Delivery Services page events reach Real-Time CDP profiles?', null],
  ['ads-cja', 'How do our Google Ads and TikTok ad platform costs come into Customer Journey Analytics?', null],
  ['target-commerce', 'How would Adobe Target use Adobe Commerce shopping data for tests?', null],
  ['cw-cja', 'How does Coworker work with Customer Journey Analytics for our AI channel readouts?', null],
  ['cja-bc', 'How does Brand Concierge conversation data reach Customer Journey Analytics?', null],
];
(async () => {
  const h = await open();
  // 5.3 every line is a sentence
  const lines = await h.eval(() => Object.keys(RFP_CAT.lines).map(id => [id, RFPAnswers.doLine(id)]));
  const broken = lines.filter(([, t]) => BROKEN.test(t) || PARTNER.test(t));
  ok(lines.length > 190 && broken.length === 0, `5.3 all ${lines.length} service lines read as sentences, with no partner or Client word`, JSON.stringify(broken.slice(0, 6)));
  const clause = lines.filter(([, t]) => /^(?:Where|For|With|Using|Once|In|If|When|After)\b[^,:]*[,:] we will [a-z]/.test(t));
  ok(clause.length >= 20, `5.3 lines that open with a setting clause keep it and take "we will" after it (${clause.length} of them)`, JSON.stringify(lines.filter(([, t]) => /^(?:Where|For|With|Using|Once|In)\b/.test(t)).slice(0, 4)));
  ok(lines.some(([id, t]) => id === 'BI2' && /^We will build the agreed dashboards on CJA data views/.test(t)) && lines.some(([id, t]) => id === 'BI1' && /^We will set up Query Service and data view permissions with your admin/.test(t)), 'decision 2: BI1 and BI2 read as in the picture Adam approved', JSON.stringify(lines.filter(([id]) => id === 'BI1' || id === 'BI2')));
  ok(lines.some(([id, t]) => id === 'AD1' && /^For the agreed ad accounts \(Google Ads, Meta, Pinterest, Snapchat or TikTok\), we will authorize/.test(t)) && lines.some(([id, t]) => id === 'AD2' && /^We will build derived fields/.test(t)), 'decision 2: AD1 and AD2 start with a verb', JSON.stringify(lines.filter(([id]) => id === 'AD1' || id === 'AD2')));
  ok(lines.some(([id, t]) => id === 'CW01' && /responsibilities of Adobe, us and you\.$/.test(t)) && lines.some(([id, t]) => id === 'O09' && /footage and assets you provide/.test(t) && /once you authorize it\.$/.test(t)) && lines.some(([id, t]) => id === 'C02' && /create a validation sheet/.test(t)), 'decision 2: CW01, O09 and C02 no longer say partner or Client to the client', JSON.stringify(lines.filter(([id]) => ['CW01', 'O09', 'C02'].includes(id))));
  ok(lines.some(([id, t]) => id === 'C05' && /managed by us/.test(t)) && lines.some(([id, t]) => id === 'C03' && /managed by us/.test(t)) && lines.some(([id, t]) => id === 'O05' && /improvements we design in your existing CMS/.test(t)), 'decision 2: C03, C05 and O05 speak as we and you', JSON.stringify(lines.filter(([id]) => ['C03', 'C05', 'O05'].includes(id))));
  // the voice rewrite
  const V = async (s, want, label) => { const got = await h.voice(s); ok(got === want, 'voice: ' + label, JSON.stringify(got)); };
  await V('the Client authorizes the upload', 'you authorize the upload', '"the Client authorizes" becomes "you authorize"');
  await V('a handoff managed by the partner', 'a handoff managed by us', 'the partner as an object becomes us');
  await V("A partner-built Skill turns your client's measures into a readout", 'Our Skill turns your measures into a readout', 'a partner compound becomes our, with its article');
  await V('At setup, you and your client assign responsibility for governance labels.', 'At setup, we and you assign responsibility for governance labels.', '"you and your client" becomes "we and you" (5.6)');
  await V('the partner does the work and the Client does the review', 'we do the work and you do the review', 'does becomes do');
  await V('This applies only when your client authors in documents.', 'This applies only when you author in documents.', 'authors becomes author');
  await V('a simple edit using Client-provided approved footage, uploaded with Client authorization', 'a simple edit using your approved footage, uploaded with your authorization', 'Client-provided and Client authorization');
  await V('the responsibilities of Adobe, the partner and the Client', 'the responsibilities of Adobe, us and you', 'a list of the three parties');
  // 5.1, 5.2, 5.4: the approved cards draft in client voice, their cautions in the note
  for (const [conn, text, note] of CARDS) {
    const r = await h.text(text); const q = r.questions[0];
    const got = q && q.draft && q.draft.conn;
    const expect = conn.split('-');
    const same = got && (got === expect[0] + '+' + expect[1] || got === expect[1] + '+' + expect[0]);
    if (!same) { ok(false, `${conn}: the question draws the intended connection`, JSON.stringify(got)); continue; }
    const plain = q.draft.plain;
    ok(!LABELS.test(plain) && !PARTNER.test(plain), `${conn}: the response carries no lifecycle label or partner caution`, (plain.match(LABELS) || plain.match(PARTNER) || []).join(', ') + ' :: ' + plain.slice(0, 240));
    if (note) { await h.select(0); const n = await h.eval(() => { const b = document.querySelector('#rfp-answer .rfp-confirm'); return b ? b.textContent : ''; }); ok(note.test(n), `${conn}: the caution the client no longer reads sits under Confirm with Adobe in the note`, n.slice(0, 300)); }
  }
  // 5.2 Journey Optimizer + Brand Concierge has no services behind it: the client reads nothing, the partner reads what Adobe says
  let r = await h.text('How would Journey Optimizer follow up after a Brand Concierge conversation?');
  ok(!r.questions[0].draft, '5.2 the undocumented Journey Optimizer + Brand Concierge route drafts nothing for the client', JSON.stringify(r.questions[0].draft));
  await h.select(0);
  ok(/No match in the catalog/.test(await h.panel()) && /Experience League lists no services for Journey Optimizer \+ Brand Concierge/.test(await h.panel()) && /not documented|documents no|confirm/i.test(await h.panel()), '5.2 the panel tells the partner that Experience League lists no services for the pair, and what Adobe says', (await h.panel()).slice(0, 400));
  r = await h.file(FIX + '/bank_rfp.xlsx');
  let q = r.questions.find(x => x.label === '2.2');
  ok(q && q.draft && !/ordinary referrer reporting can show without it|lift comes only from a test/.test(q.draft.plain), '5.4 bank 2.2 no longer coaches the partner inside the client text', q && q.draft && q.draft.plain.slice(0, 400));
  ok(q && q.draft.sources.some(s => /Customer Journey Analytics product description/.test(s.title)) && !q.draft.sources.some(s => /customer-journey-analytics\.html/.test(s.title)), '4.14 the reference titled by its file name now has a readable title', JSON.stringify(q && q.draft.sources.map(s => s.title)));
  // nothing partner-only reaches any drafted response of the four made-up RFPs
  let leaks = [];
  for (const f of ['bank_rfp.xlsx', 'retail_rfi.docx', 'mfg_rfp.pdf', 'bank_rfp.txt']) {
    r = await h.file(FIX + '/' + f);
    for (const x of r.questions) if (x.draft && x.draft.plain) { const body = x.draft.plain.split('\n\nAdobe sources')[0]; for (const m of [...(body.match(LABELS) || []), ...(body.match(PARTNER) || [])]) leaks.push(f + ' ' + x.label + ': ' + m); }
  }
  ok(leaks.length === 0, 'no drafted response in the four made-up RFPs carries a lifecycle label or a partner or Client word', leaks.join(' | '));
  // 5.5, 7.1 (part): the downloaded response is the client's copy
  r = await h.file(FIX + '/bank_rfp.xlsx');
  const i24 = r.questions.findIndex(x => x.label === '2.4'), i21 = r.questions.findIndex(x => x.label === '2.1');
  await h.setStatus(i24, 'skipped'); await h.setStatus(i21, 'used');
  const doc = await h.doc();
  ok(/<h1>Response to bank rfp<\/h1>/.test(doc) && !/Drafted by the partner|response draft|not yet reviewed|Reviewed|Skipped by the partner|About your firm|No catalog match|class="tag"/.test(doc), '5.5 the client copy has no intro about the partner and no status tags, and is titled from the client\'s file', doc.slice(0, 300));
  const sec24 = doc.split('2.4 Describe how Brand Visibility')[1].split('<section>')[0];
  ok(/Your answer:/.test(sec24) && !/We will|Our approach/.test(sec24), '7.1 a skipped answer prints as a blank in the client copy, not in full', sec24.slice(0, 200));
  ok(!PARTNER.test(doc.replace(/<[^>]+>/g, ' ')) && !LABELS.test(doc.replace(/<[^>]+>/g, ' ')), 'the client copy carries no partner or Client word and no lifecycle label', (doc.replace(/<[^>]+>/g, ' ').match(PARTNER) || doc.replace(/<[^>]+>/g, ' ').match(LABELS) || []).join(', '));
  ok(h.errors.length === 0, 'no script errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `${fails} STEP 53 CHECK(S) FAILED` : 'ALL STEP 53 CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
