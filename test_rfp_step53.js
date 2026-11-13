// Step 53 (Nov 10 2026): client-safe wording. Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_step53.js
// Checks, on the built prototype: every service line reads as a sentence ("We will <verb>", or "<clause>, we will <verb>");
// the voice rewrite handles the partner as an object, the partner compounds, "you and your client", Client-provided and
// Client authorization, and the verbs does, authorizes and authors; the connection cards Adam approved for client-voice
// wording draft without lifecycle labels or partner cautions (step 86, Nov 12: the availability cautions are out of the
// catalog, so they are in neither the response nor the note; licenses and technical prerequisites stay); no partner
// or Client word reaches any drafted response of the four made-up RFPs; the downloaded response is the client's copy;
// and the odd reference title is gone.
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
const FIX = __dirname + '/qa/rfp_fixtures';
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 500) + ']')); if (!c) fails++; };
// what a client must never read in a drafted response
// ("we confirm the route with Adobe before this work starts" is a statement the client may read; an instruction to confirm is not)
const LABELS = /\blegacy\b|maintenance mode|co-innovation|limited number of customers|not currently (?:offered|available)|current scope|pilot item|\bAdobe says\b|(?<!\b(?:[Ww]e|is|are|be|been|was|were) )\bconfirm(?:s|ed|ing)?\b(?: [a-z']+){0,9} with Adobe|\bconfirm it\b|(?:^|[.;:!?] )Confirm\b|confirm(?:ed)? for your|prove it|is a design to prove|measure the implementation|\bbeta\b|\bon the canvas\b|\bthe SOW\b|priced once|More services/i;
const PARTNER = /\bthe Client\b(?! ID| Secret)|\bClient's\b|\byour client\b|\bthe partner\b|\bpartner-|\bpartner validation|\bA our\b|\ba our\b|Client authorization|Client-provided|\bwe (?:does|authorizes|authors|has|is)\b|\byou (?:does|authorizes|authors|has|is)\b/;
const BROKEN = /\b[Ww]e will (?:the|a|an|your|our|where|for|with|in|once|using|derived|query|this|that|these|those|each|all|any|its|their|it|them|you|we|us|is|are|and|or)\b/;
const CARDS = [
  ['workfront-cw', 'How would Coworker work inside Workfront for our campaign managers?', /health care|finance|sensitive data|not currently (?:offered|available)|generally available|eligib|Adobe confirms|confirm(?:s|ed)? (?:[a-z']+ ){0,6}with Adobe/i],
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
  ok(lines.some(([id, t]) => id === 'AD1' && /^We will authorize the Experience Platform advertising sources for the agreed ad accounts \(Google Ads, Meta, Pinterest, Snapchat or TikTok\) once your ad admins approve access/.test(t)) && lines.some(([id, t]) => id === 'AD2' && /^We will build derived fields/.test(t)), 'decision 2: AD1 and AD2 start with a verb', JSON.stringify(lines.filter(([id]) => id === 'AD1' || id === 'AD2')));
  ok(lines.some(([id, t]) => id === 'CW01' && /responsibility split between Adobe, you and us\.$/.test(t)) && lines.some(([id, t]) => id === 'O09' && /footage and assets you provide/.test(t) && /once you authorize it\.$/.test(t)) && lines.some(([id, t]) => id === 'C02' && /create a validation sheet/.test(t)), 'decision 2: CW01, O09 and C02 no longer say partner or Client to the client', JSON.stringify(lines.filter(([id]) => ['CW01', 'O09', 'C02'].includes(id))));
  ok(lines.some(([id, t]) => id === 'C05' && /^We will set up and manage a handoff/.test(t)) && lines.some(([id, t]) => id === 'C03' && /^We will set up and manage a handoff/.test(t)) && lines.some(([id, t]) => id === 'O05' && /^We will design and make improvements to two agreed .* in your existing CMS/.test(t)), 'decision 2: C03, C05 and O05 speak as we and you', JSON.stringify(lines.filter(([id]) => ['C03', 'C05', 'O05'].includes(id))));
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
    if (note) {
      // step 86: Adobe's industry caution is out of the catalog, so it is in neither the note nor the response, and only Adobe's own configuration work is left under Confirm with Adobe; both licenses and the two technical prerequisites stay
      await h.select(0);
      const n = await h.eval(() => { const b = document.querySelector('#rfp-answer .rfp-confirm'); return b ? b.textContent : ''; });
      const whole = await h.eval(() => { const b = document.querySelector('#rfp-answer .rfp-partner-note'); return b ? b.textContent : ''; });
      const body = await h.eval(() => document.getElementById('rfp-body').textContent);
      ok(/^Adobe's support or professional services team configures Coworker, its Adobe app integrations and its governance and approval workflows\.?$/.test(n.trim()) && whole.length > 200 && !note.test(whole.replace('Confirm with Adobe:', '')) && !note.test(body) && !note.test(plain)
        && /Workfront Standard license \(any Workfront package\)/.test(whole)
        && /CX Enterprise Coworker license for your client's organization/.test(whole) && !/Coworker license for your client's organization; Adobe's support/.test(whole)
        && /Write MCP tools option enabled in System Preferences by a Workfront admin before Coworker can change anything\./.test(body)
        && /Users need existing Workfront access to each object\./.test(body),
        `${conn}: the industry caution is gone from the note and the response, only Adobe's own configuration work sits under Confirm with Adobe (split from the license), and both licenses and both technical prerequisites stay`, (n || (whole.match(note) || body.match(note) || []).join(', ')) + ' :: ' + whole.slice(0, 300));
    }
  }
  // 5.2 Journey Optimizer + Brand Concierge has no services behind it: the client reads nothing, and the partner reads that there are no services, with no availability caution (step 86)
  let r = await h.text('How would Journey Optimizer follow up after a Brand Concierge conversation?');
  ok(!r.questions[0].draft, '5.2 the undocumented Journey Optimizer + Brand Concierge route drafts nothing for the client', JSON.stringify(r.questions[0].draft));
  await h.select(0);
  ok(/No match in the catalog/.test(await h.panel()) && /Experience League lists no services for Journey Optimizer \+ Brand Concierge/.test(await h.panel()) && !/not documented|not a documented|documents no|marketed|unconfirmed|confirm(?:s|ed)?\b/i.test(await h.panel()) && !(await h.eval(() => document.querySelector('#rfp-answer .rfp-confirm'))), '5.2 the panel tells the partner that Experience League lists no services for the pair, with no "not documented" or "confirm with Adobe" caution', (await h.panel()).slice(0, 400));
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
  // The explicit review notice is separate from client answers; answer wording still obeys every original rule.
  const clientAnswers=(doc.match(/<section>[\s\S]*?<\/section>/g)||[]).join('').replace(/<[^>]+>/g, ' ');
  ok(!PARTNER.test(clientAnswers) && !LABELS.test(clientAnswers), 'the client answers carry no partner or Client word and no lifecycle label', (clientAnswers.match(PARTNER) || clientAnswers.match(LABELS) || []).join(', '));
  // what the first round of skeptics found (Nov 10), kept closed
  const D = async id => h.eval(id => RFPAnswers.doLine(id), id);
  ok(/^For the agreed file feeds in Amazon S3, Azure Blob Storage, Azure Data Lake Storage Gen2, Google Cloud Storage or SFTP, we will create/.test(await D('OX4')), 'the clause splitter does not cut a list at its first comma (OX4)', await D('OX4'));
  // step 86 took XA09's opening clause ("Once Adobe confirms in writing ... for this tenant, use case and region,") out, so the splitter is tried on a line added for the test, and XA09 is checked for its new wording
  const useCase = await h.eval(() => { RFP_CAT.lines.__T53 = {scope: 'For the agreed tenant, use case and region, choose the profile attributes and signals the concierge may use.'}; const t = RFPAnswers.doLine('__T53'); delete RFP_CAT.lines.__T53; return t; });
  ok(useCase === 'For the agreed tenant, use case and region, we will choose the profile attributes and signals the concierge may use.' && (await D('XA09')) === 'We will choose the Real-Time CDP profile attributes and signals the concierge may use and test the replies against them.', 'the clause splitter skips "use case", and XA09 is a plain promise with no "Once Adobe confirms in writing" clause', useCase + ' || ' + await D('XA09'));
  ok(/^For each agreed ad destination, we will connect/.test(await D('AD3')), 'the clause splitter still cuts at the first verb (AD3)', await D('AD3'));
  ok((await D('AXC06')) === 'For Cloud Manager bring-your-own Git, we will configure pull-request delivery; for Cloud Manager standard repositories, we will configure branch delivery. We will agree developer review, testing and release.' && /We will keep Commerce as Visualization Owner/.test(await D('XC15')), 'every later sentence and semicolon clause of a scope is a promise too, with no "where enabled" or "confirm enablement" caveat (AXC06, XC15)', await D('AXC06'));
  ok(!/legacy/i.test(await D('XB05')) && !/legacy/i.test(await D('AXB02')) && !/legacy/i.test(await D('AXA01')) && /earlier Target configurations/.test(await D('AXB02')), 'the word legacy never reaches the client through a service line (XB05, AXB02, AXA01)', [await D('XB05'), await D('AXB02')].join(' || '));
  ok(/The Tags property on AEM pages comes with/.test(await D('AXA07')) && !/canvas/.test(await D('AXA07')), 'a later sentence that is not an instruction stays as it is, and "on the canvas" becomes "part of this proposal" (AXA07)', await D('AXA07'));
  ok(/If no videos are cited in a month, we and you agree/.test(await D('O08')) && /outreach actions you authorize/.test(await D('O04')), 'O08 and O04 read as the partner and the client, not the partner and Client (A8 voice)', await D('O08'));
  for (const [s, want, label] of [['The Client provides the list and the partner maps it.', 'You provide the list and we map it.', '"and the partner maps" is a subject, so we map'], ['A Skill we build summarizes exported conversations and flags answers for a person on your team to review.', 'A Skill we build summarizes exported conversations and flags answers for a person on your team to review.', 'a noun subject keeps its verb after "we build"'], ['Data your client already exports to files.', 'Data you already export to files.', 'an adverb between you and the verb'], ['You own the videos, provides channel access and supply approved source facts.', 'You own the videos, provide channel access and supply approved source facts.', 'a comma-separated verb chain'], ['the Client keeps the key and gives the partner access to do it', 'you keep the key and give us access to do it', 'the partner as a verb object'], ['Partner-built, tested Skills for summaries and answer flags', 'Our built and tested Skills for summaries and answer flags', 'a partner compound with a second adjective'], ['The partner-built Skill turns the measures into a readout.', 'Our Skill turns the measures into a readout.', 'The partner-built'], ['Credible Client evidence and explicit outreach authorization are available.', 'Credible evidence from you and explicit outreach authorization are available.', 'Credible Client evidence'], ['This is a partner test method; Adobe covers only eligible edge deployments.', 'This is our test method; Adobe covers only eligible edge deployments.', 'a partner test method'], ['Client-side callbacks collect the events', 'Client-side callbacks collect the events', 'Client-side stays a technical term'], ['MktoSync: Ingestion Service access provisioned for the customer.', 'MktoSync: Ingestion Service access provisioned for you.', 'for the customer']]) await V(s, want, label);
  r = await h.text('How would you run Adobe Target personalization on our Edge Delivery Services pages?'); await h.select(0);
  let needsText = await h.eval(() => [...document.querySelectorAll('#rfp-body h4')].filter(x => x.textContent === 'What we would need from you').map(x => x.nextElementSibling.textContent).join(' '));
  ok(!/legacy|earlier library|co-innovation|One Adobe lab|AEM Engineering/i.test(needsText) && /The at\.js route, also on aem\.live: Target client code and IMS org ID\./.test(needsText) && !/At\.js/.test(needsText) && /Martech plugin route only: the aem-martech plugin, Adobe Analytics, a datastream connected to Target and Analytics, and a Tags property with the Adobe Client Data Layer extension\./.test(needsText), 'target-eds: the at.js and martech plugin prerequisites reach the client in full, with no Legacy, "earlier library" or co-innovation label, and the name of the library stays lowercase', needsText.slice(0, 500));
  await h.page.fill('#rfp-answer .rfp-asks li:nth-child(3) .rfp-fact', 'We run at.js 2.x today.'); await h.page.waitForTimeout(120);
  const have = await h.eval(() => [...document.querySelectorAll('#rfp-body h4')].filter(x => /already have in place/.test(x.textContent)).map(x => x.nextElementSibling.textContent).join(' '));
  ok(!/^Legacy|Earlier:/.test(have) && /We run at\.js 2\.x today/.test(have), 'a typed note is led by a real subject, never by a lifecycle word', have);
  r = await h.text('How do we bring Snowflake data warehouse tables into Customer Journey Analytics?'); await h.select(0);
  needsText = await h.eval(() => [...document.querySelectorAll('#rfp-body h4')].filter(x => x.textContent === 'What we would need from you').map(x => x.nextElementSibling.textContent).join(' '));
  ok(/we and you assign responsibility/.test(needsText) && !/\bpartner\b/.test(needsText), 'dwh-cja: "the Client and partner assign" reaches the client as "we and you assign"', needsText.slice(0, 300));
  for (const [t, bad, label] of [['How would Brand Concierge conversations feed Real-Time CDP profiles, and could replies use profile context?', /obtain Adobe|Before scoping/, 'rtcdp-bc'], ['We author in AEM Sites and want our pages published through Edge Delivery Services. How would that work?', /\bcard\b|service out|More services/, 'aemsites-eds'], ['How would abandoned cart journeys in Journey Optimizer start from our Adobe Commerce events?', /priced once|\bcard\b/, 'commerce-ajo'], ['How would our Adobe Commerce carts and orders be analyzed in Customer Journey Analytics?', /priced once|\bcard\b/, 'commerce-cja'], ['How would page views from our AEM Sites pages build profiles and audiences in Real-Time CDP?', /canvas/, 'aemsites-rtcdp (line AXA07)'], ['Our Brand Concierge conversations should be reported in Customer Journey Analytics with our purchase data. How would you build that?', /the SOW\b/, 'cja-bc (line XA10)']]) {
    r = await h.text(t); const q = r.questions[0];
    ok(q && q.draft && q.draft.plain && !bad.test(q.draft.plain) && !PARTNER.test(q.draft.plain.split('\n\nAdobe sources')[0]), `${label}: no instruction to the partner, no canvas or pricing talk in the client's text`, q && q.draft && (q.draft.plain.match(bad) || q.draft.plain.match(PARTNER) || []).join(', '));
  }
  r = await h.text('How does Brand Concierge trigger follow-up journeys in Adobe Journey Optimizer?');
  ok(!r.questions[0].draft, '5.2 Journey Optimizer + Brand Concierge drafts nothing even when a line name matches ("journeys")', JSON.stringify(r.questions[0].draft && r.questions[0].draft.lines));
  r = await h.text('How would Brand Concierge answer questions about our savings accounts and rates?'); await h.select(0);
  await h.page.selectOption('#rfp-add', 'ajo'); await h.page.waitForTimeout(150);
  ok(/Experience League lists no services for (?:the pair|Journey Optimizer \+ Brand Concierge)/.test(await h.panel()), '5.2 the Adobe sentence also shows when Journey Optimizer is added from the chips (in the partner note, since the partner asked for the pair)', (await h.panel()).slice(0, 300));
  r = await h.text('How would Brand Visibility help our pages on Edge Delivery Services show up in AI answers?'); await h.select(0);
  const nt = await h.eval(() => { const n = document.querySelector('#rfp-answer .rfp-partner-note'); return n ? n.textContent : ''; });
  // step 86: the CDN log forwarding prerequisite lost its "confirmed with Adobe" clause, so it is a plain client need, and nothing sits under Confirm with Adobe
  const bvBody = await h.eval(() => document.getElementById('rfp-body').textContent);
  needsText = await h.eval(() => [...document.querySelectorAll('#rfp-body h4')].filter(x => x.textContent === 'What we would need from you').map(x => x.nextElementSibling.textContent).join(' '));
  ok(!/confirm(?:s|ed)? (?:[a-z']+ ){0,6}with Adobe|Adobe documents it for/i.test(bvBody) && !/confirmed with Adobe|Confirm with Adobe|Adobe documents it for/.test(nt) && !(await h.eval(() => document.querySelector('#rfp-answer .rfp-confirm')))
    && /CDN log forwarding for agentic traffic data\./.test(needsText) && /CDN log forwarding for agentic traffic data(?! \()/.test(nt) && /Brand Visibility license; for the one-click route, users with the Adobe LLM Optimizer Users product profile/.test(nt),
    'bv-eds: the CDN log forwarding prerequisite is a plain client need with no "confirmed with Adobe" clause, nothing sits under Confirm with Adobe, and the license stays in the note', nt.slice(0, 400) + ' :: ' + needsText.slice(0, 300));
  await h.file(FIX + '/bank_rfp.xlsx'); await h.file(FIX + '/retail_rfi.docx');
  ok(/<h1>Response to retail rfi<\/h1>/.test(await h.doc()), 'the client copy is titled from the client\'s file without its extension', (await h.doc()).match(/<h1>[^<]*<\/h1>/)[0]);
  await h.text('Describe your approach to implementing AEM Sites.');
  ok(/<h1>Response to your request for proposal<\/h1>/.test(await h.doc()), 'a pasted RFP gets a title the client can read, not "Pasted text"', (await h.doc()).match(/<h1>[^<]*<\/h1>/)[0]);
  r = await h.text('How would you connect our Google Search Console property to Brand Visibility to pick the prompts to track?');
  ok(r.questions[0].draft && r.questions[0].draft.sources.every(s => !/legacy/i.test(s.title)), 'source titles the client reads carry no lifecycle label (SD1)', JSON.stringify(r.questions[0].draft && r.questions[0].draft.sources.map(s => s.title)));
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.setStatus(r.questions.findIndex(x => x.label === '2.4'), 'skipped');
  const rows2 = (await h.rows()).rows;
  ok(rows2.slice(1).every(x => !/partner/i.test(x[6])) && rows2.find(x => x[0] === '2.4')[6] === 'Not answered' && rows2.find(x => x[0] === '2.4')[4] === '', 'the Excel status column says Approved, Draft, Not answered or Still to write, never "the partner", and a left-out answer is blank', JSON.stringify(rows2.map(x => x[6])));
  ok(h.errors.length === 0, 'no script errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `${fails} STEP 53 CHECK(S) FAILED` : 'ALL STEP 53 CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
