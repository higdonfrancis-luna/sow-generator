// Step 54 (Nov 10 2026): the client is told what we need. Run from the repo root after python3 sow/rfp_prototype/build.py:
//   node sow/test_rfp_step54.js
// Checks, on the built prototype and against the picture Adam approved (decision 1): the note's four lists (Adobe licenses,
// Ask your client with a tick box each, Confirm with Adobe, Assumptions), no six-item cap, each matched line's own
// requirements, ticked asks in the response as "What we would need from you", a typed fact moving its item to "What you
// already have in place, as confirmed with your team" led by its subject, the internal line, partner voice in the note,
// the line after an edit, and the two downloads and the Excel.
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
const FIX = __dirname + '/qa/rfp_fixtures';
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 500) + ']')); if (!c) fails++; };
const HAVE = 'What you already have in place, as confirmed with your team', NEED = 'What we would need from you';
(async () => {
  const h = await open();
  const note = () => h.eval(() => { const n = document.querySelector('#rfp-answer .rfp-partner-note'); if (!n) return null; const L = s => [...n.querySelectorAll(s + ' li')].map(x => x.textContent.trim()); return {text: n.textContent, sells: L('.rfp-sells'), asks: [...n.querySelectorAll('.rfp-asks li')].map(li => ({text: li.querySelector('label span').textContent.trim(), ticked: li.querySelector('.rfp-tick').checked, disabled: li.querySelector('.rfp-tick').disabled, badge: li.querySelector('.rfp-badge').textContent, placeholder: li.querySelector('.rfp-fact').placeholder})), confirm: L('.rfp-confirm'), assumptions: L('.rfp-assume')}; });
  // the response's sections, read from the DOM (the headings are drawn in capitals, so innerText would not match them)
  const body = () => h.eval(() => { const out = {}; for (const h4 of document.querySelectorAll('#rfp-body h4')) { const ul = h4.nextElementSibling; out[h4.textContent] = ul && ul.tagName === 'UL' ? [...ul.querySelectorAll('li')].map(li => li.textContent) : [ul ? ul.textContent : '']; } out._order = [...document.querySelectorAll('#rfp-body h4')].map(h => h.textContent); return out; });
  const section = (b, head) => (b[head] || []).join('\n');
  const count = (b, head) => (b[head] || []).length;
  // 6.1, 6.2: bank 2.2, nine prerequisites, all shown, the asks ticked by default and in the response
  let r = await h.file(FIX + '/bank_rfp.xlsx');
  const i22 = r.questions.findIndex(x => x.label === '2.2');
  await h.select(i22);
  let n = await note();
  ok(n && /Notes for you, not for the client/.test(n.text) && /Internal\. Nothing in this box goes into the response, the Excel or your client's workbook, except the asks you leave ticked \(all start ticked\) and what you type\./.test(n.text), 'the note says it is internal, except what the partner ticks or types', n && n.text.slice(0, 200));
  ok(n && n.sells.length === 1 && /paid Brand Visibility offering/.test(n.sells[0]) && /Adobe licenses this proposal includes \(Adobe quotes them\)/.test(n.text), 'the license the play sells sits under "Adobe licenses this proposal includes (Adobe quotes them)"', JSON.stringify(n && n.sells));
  ok(n && n.asks.length === 9 && n.asks.some(a => /Acceptance that some Brand Visibility data is processed temporarily in the United States/.test(a.text)) && n.asks.some(a => /CJA data view that maps Page URL/.test(a.text)) && n.asks.some(a => /For Business Impact in Brand Visibility/.test(a.text)), '6.2 no six-item cap: the three prerequisites the old note dropped are back, nine asks in all', JSON.stringify(n && n.asks.map(a => a.text.slice(0, 40))));
  ok(n && n.asks.some(a => /^Your Customer Journey Analytics package: CJA Select or higher\./.test(a.text)), '6.2 the matched line\'s own tier (C01: CJA Select or higher) is an ask', JSON.stringify(n && n.asks.map(a => a.text.slice(0, 50))));
  ok(n && n.asks.every(a => a.ticked && !a.disabled && a.badge === 'In the response' && a.placeholder === 'What your client told you'), 'every ask starts ticked, badged "In the response", with an empty field whose placeholder is "What your client told you"', JSON.stringify(n && n.asks.map(a => [a.ticked, a.badge, a.placeholder])));
  ok(/Ask your client\. Ticked items go into the response as "What we would need from you"\. Type what your client told you and the item moves to "What you already have in place"\./.test(n.text), 'the note explains the tick boxes in the approved words');
  let b = await body();
  ok(count(b, NEED) === 9 && /CDN access logs forwarded to and received by Brand Visibility/.test(section(b, NEED)), '6.1 the response answers "what do you need from us?": the nine ticked asks under "What we would need from you"', section(b, NEED).slice(0, 300));
  ok(!/the Client\b|your client|Your client/.test(section(b, NEED)), 'the needs are in the client\'s voice', section(b, NEED).slice(0, 300));
  // untick one: it leaves the response
  await h.page.click('#rfp-answer .rfp-asks li:nth-child(3) .rfp-tick'); await h.page.waitForTimeout(100);
  n = await note(); b = await body();
  ok(n.asks[2].ticked === false && n.asks[2].badge === 'Not in the response' && count(b, NEED) === 8 && !section(b, NEED).includes(n.asks[2].text.slice(0, 30)), 'an unticked ask leaves the response and is badged "Not in the response"', JSON.stringify([n.asks[2].ticked, n.asks[2].badge, count(b, NEED)]));
  // type a fact: the item moves to what the client already has, led by its subject
  await h.page.fill('#rfp-answer .rfp-asks li:nth-child(1) .rfp-fact', 'Akamai serves both sites; your IT team confirmed log forwarding can be enabled.'); await h.page.waitForTimeout(150);
  n = await note(); b = await body();
  ok(n.asks[0].badge === 'Answered by your note below' && n.asks[0].disabled === true && n.asks[0].ticked === false, 'a typed fact badges its item "Answered by your note below" and greys out its tick box', JSON.stringify(n.asks[0]));
  ok(count(b, HAVE) === 1 && /^CDN access logs: Akamai serves both sites; your IT team confirmed log forwarding can be enabled\.$/.test(section(b, HAVE)), '6.5 the fact appears under "' + HAVE + '", led by the subject of its ask', section(b, HAVE));
  ok(count(b, NEED) === 7 && !/CDN access logs forwarded/.test(section(b, NEED)), 'the answered item leaves "What we would need from you"', section(b, NEED).slice(0, 200));
  ok(b._order.join('|') === ['Our approach', 'What we would do', HAVE, NEED, 'Adobe sources for the product facts above'].join('|'), 'the order is what we would do, what you already have in place, what we would need from you, sources', b._order.join('|'));
  ok((await h.eval(() => document.activeElement && document.activeElement.classList.contains('rfp-fact'))), 'the field keeps focus while the response updates');
  ok(n.assumptions.some(a => /^Availability: /.test(a)), 'the connection\'s availability sits under Assumptions behind this answer', JSON.stringify(n.assumptions));
  // 6.4 partner voice in the note
  let r2 = await h.text('How would Brand Concierge answer our customers\' questions about accounts and rates?');
  await h.select(0); n = await note();
  ok(n && !/\bthe Client\b(?! ID)|\bThe Client\b/.test(n.text) && /your client/i.test(n.text), '6.4 the note says "your client", never "the Client"', n && n.text.slice(0, 400));
  // 6.3, 6.7: three boxes plus assumptions
  r2 = await h.text('How does Coworker work with Customer Journey Analytics for our AI channel readouts?');
  await h.select(0); n = await note();
  ok(n && n.confirm.some(x => /Adobe's onboarding team configures Coworker/.test(x)) && !n.asks.some(a => /Adobe's onboarding team/.test(a.text)) && !n.sells.some(x => /onboarding team configures/.test(x)), '6.3 what only Adobe does sits under Confirm with Adobe, not under the licenses or the asks', JSON.stringify(n && [n.confirm, n.sells]));
  ok(n && n.sells.some(x => /Coworker Chat license through the Adobe account team/.test(x)), '6.3 a license through the account team is an Adobe license this proposal includes', JSON.stringify(n && n.sells));
  r2 = await h.file(FIX + '/mfg_rfp.pdf');
  await h.select(r2.questions.findIndex(x => x.label === 'B.3')); n = await note();
  ok(n && n.assumptions.some(x => /Pilot users are a training scope, not a software seat limit/.test(x)) && !n.asks.some(a => /training scope/.test(a.text)), '6.7 a scope statement is an assumption, not an ask with a field', JSON.stringify(n && [n.assumptions, n.asks.map(a => a.text.slice(0, 40))]));
  ok(n && n.asks.some(a => /application owners and an Adobe onboarding contact/.test(a.text)), '6.7 an ask-shaped assumption stays an ask', JSON.stringify(n && n.asks.map(a => a.text.slice(0, 60))));
  r2 = await h.file(FIX + '/retail_rfi.docx');
  await h.select(r2.questions.findIndex(x => x.label === 'Q8')); n = await note();
  ok(n && n.sells.some(x => /Also needs Real-Time CDP or Journey Optimizer, licensed separately\./.test(x)) && n.asks.some(a => /Your Customer Journey Analytics package: CJA Select or higher\./.test(a.text)), '6.2 a matched line\'s "also needs" and tier reach the note (retail Q8, line C06)', JSON.stringify(n && [n.sells, n.asks.map(a => a.text)]));
  // a ticked ask reaches the client in the SOW's own client wording, matched to the partner's prerequisite by its words
  r2 = await h.text('How would Coworker work inside Workfront for our campaign managers?');
  await h.select(0); b = await body(); n = await note();
  ok(count(b, NEED) === 2 && /^Write MCP tools option enabled in System Preferences by a Workfront admin before Coworker can change anything\.$/m.test(section(b, NEED)) && /^Users need existing Workfront access to each object\.$/m.test(section(b, NEED)) && !/Adobe confirms that Coworker/.test(section(b, NEED)), 'Coworker + Workfront: the two asks reach the client as themselves, not as another prerequisite from the SOW list (the lists differ in order)', section(b, NEED));
  ok(n.confirm.filter(x => /not currently available to organizations in health care, finance/.test(x)).length === 1 && !/the Client\b/.test(n.confirm.join(' ')) && n.confirm.some(x => /^Adobe's support or professional services team configures Coworker/.test(x)) && !n.sells.some(x => /configures Coworker/.test(x)), 'Coworker + Workfront: the eligibility caution sits once under Confirm with Adobe, in partner voice, and Adobe\'s own configuration work sits there too, split from the license it was written with', JSON.stringify([n.confirm, n.sells]));
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22); n = await note();
  ok(/Not in the client's text: The AI-referred visits and conversions come from your client's own CJA web data/.test(n.text) && !n.confirm.some(x => /ordinary referrer/.test(x)), '5.4 the Brand Visibility + CJA caution the client no longer reads is a line of its own in the note, not under Confirm with Adobe', n.text.slice(0, 400));
  // 6.5 after Edit, the note says ticks and notes no longer change the answer
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22);
  await h.page.click('#rfp-edit-btn'); await h.page.fill('#rfp-edit', 'Our own words for 2.2.'); await h.page.click('#rfp-save-edit'); await h.page.waitForTimeout(150);
  n = await note();
  ok(n && /You edited this answer, so ticks and notes here no longer change it; they go into your checklist only\. Edit it again and type them in\./.test(n.text), 'after an edit the note says the ticks and notes no longer change the answer', n && n.text.slice(0, 300));
  // the downloads: the response carries the two client sections and none of the note; the checklist carries all four lists
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22);
  await h.page.click('#rfp-answer .rfp-asks li:nth-child(3) .rfp-tick'); await h.page.fill('#rfp-answer .rfp-asks li:nth-child(1) .rfp-fact', 'Akamai serves both sites.'); await h.page.waitForTimeout(150);
  const doc = (await h.doc()).replace(/<[^>]+>/g, ' ');
  ok(doc.includes(HAVE) && /CDN access logs: Akamai serves both sites\./.test(doc) && doc.includes(NEED) && /full URL field/.test(doc) && !/CJA administrator who adds/.test(doc.split(NEED)[1].split('Adobe sources')[0]), 'the downloaded response carries the typed fact and the ticked asks, not the unticked one', doc.slice(doc.indexOf(HAVE), doc.indexOf(HAVE) + 400));
  ok(!/Notes for you|Ask your client|Adobe licenses this proposal|Confirm with Adobe|Assumptions behind|Internal\./.test(doc), 'the downloaded response carries nothing else from the note');
  const asks = await h.asks();
  ok(/Adobe licenses this proposal includes \(Adobe quotes them\)/.test(asks) && /Ask your client<\/h4>/.test(asks) && /Confirm with Adobe<\/h4>/.test(asks) && /Assumptions behind this answer<\/h4>/.test(asks), 'the checklist download has the four lists', asks.length + ' bytes');
  ok(/Your client says: <\/b>Akamai serves both sites\./.test(asks) && /In the response as what we would need from you/.test(asks) && /Not in the response/.test(asks) && /Will confirm with the client/.test(asks), 'the checklist marks each ask as answered, in the response or not in the response', asks.slice(asks.indexOf('Ask your client'), asks.indexOf('Ask your client') + 600));
  ok(!/\bthe Client\b(?! ID)/.test(asks.replace(/<[^>]+>/g, ' ')), 'the checklist speaks to the partner (your client), never of the Client');
  ok(/Nothing here is in the downloaded response, the Excel or your client's workbook except the items you ticked/.test(asks), 'the checklist\'s intro says what does reach the response');
  const rows = (await h.rows()).rows, r22 = rows.find(x => x[0] === '2.2');
  ok(r22 && r22[4].includes(HAVE) && r22[4].includes(NEED) && /CDN access logs: Akamai serves both sites\./.test(r22[4]), 'the Excel row carries both client sections', r22 && r22[4].slice(-300));
  // the ticks and notes survive moving between questions
  await h.select(i22 + 1); await h.select(i22); n = await note();
  ok(n.asks[2].ticked === false && n.asks[0].badge === 'Answered by your note below', 'ticks and typed notes are kept when the partner moves to another question and back', JSON.stringify([n.asks[2].ticked, n.asks[0].badge]));
  // what the second round of skeptics found (Nov 10), kept closed
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22);
  await h.page.fill('#rfp-answer .rfp-asks li:nth-child(1) .rfp-fact', 'Akamai serves both sites.'); await h.page.click('#rfp-answer .rfp-asks li:nth-child(3) .rfp-tick'); await h.page.waitForTimeout(100);
  await h.page.click('#rfp-answer .rfp-chip [data-rm="cja"]'); await h.page.waitForTimeout(200);   // redraft from Brand Visibility alone: the asks change
  let keyed = await h.eval(() => { const q = RFPBuilder.state.questions[RFPBuilder.state.selected]; return {facts: Object.keys(q.facts || {}), ticks: Object.keys(q.ticks || {}), asks: q.draft ? q.draft.asks : []}; });
  ok(keyed.facts.every(k => /CDN access logs forwarded/.test(k)) && keyed.ticks.every(k => /CJA administrator/.test(k)), 'ticks and typed notes are keyed by the ask\'s words, not its position, so a redraft cannot move them to another ask', JSON.stringify(keyed.facts.concat(keyed.ticks)).slice(0, 200));
  b = await body();
  ok(!keyed.asks.some(a => /CDN access logs forwarded/.test(a)) ? count(b, HAVE) === 0 : true, 'a typed note whose ask is gone from the redraft does not reach the client', JSON.stringify(b[HAVE]));
  await h.page.selectOption('#rfp-add', 'cja'); await h.page.waitForTimeout(200); n = await note(); b = await body();
  ok(n.asks[0].badge === 'Answered by your note below' && n.asks[2].ticked === false && /CDN access logs: Akamai serves both sites/.test(section(b, HAVE)), 'adding the product back restores the note and the untick on the same asks', JSON.stringify([n.asks[0].badge, n.asks[2].ticked]));
  // template assumptions: only ask-shaped sentences are asks
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(r.questions.findIndex(x => x.label === '2.4')); n = await note(); b = await body();
  ok(n && !n.asks.some(a => /The prompt count is the service scope|This is the one monthly readout|Stable prompt cohort|Shared strategy work is reused/.test(a.text)) && n.assumptions.some(a => /prompt count is the service scope|one monthly readout|Stable prompt cohort/.test(a)), '6.7 scope statements from the templates sit under Assumptions, not under Ask your client (bank 2.4)', JSON.stringify([n && n.asks.map(a => a.text.slice(0, 40)), n && n.assumptions.map(a => a.slice(0, 40))]));
  ok(count(b, NEED) === n.asks.length, 'only the asks reach "What we would need from you"', count(b, NEED) + ' vs ' + n.asks.length);
  // the second documented connection's prerequisites are offered too
  r = await h.text('How would Brand Visibility work with our Edge Delivery Services site and our Customer Journey Analytics data?'); await h.select(0); n = await note();
  const conns = await h.eval(() => RFPBuilder.state.questions[0].draft.m.conns.map(c => c.id));
  ok(conns.length >= 2 && n.asks.some(a => /Experience Platform user who sets up the Adobe Brand Visibility source dataflow/.test(a.text)) && n.assumptions.filter(a => /^Availability of /.test(a)).length >= 2, 'the prerequisites and availability of every connection the answer uses are in the note (bv+eds and bv+cja)', JSON.stringify([conns, n.asks.length, n.assumptions.filter(a => /^Availability/.test(a))]));
  // an emptied edit leaves the answer out
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22);
  await h.page.click('#rfp-edit-btn'); await h.page.fill('#rfp-edit', '   '); await h.page.click('#rfp-save-edit'); await h.page.waitForTimeout(150);
  const st = await h.eval(() => { const q = RFPBuilder.state.questions[RFPBuilder.state.selected]; return [q.status, q.answer]; });
  const doc2 = await h.doc();
  ok(st[0] === 'skipped' && st[1] === undefined && /Your answer:/.test(doc2.split('2.2 How would you connect')[1].split('<section>')[0]), 'saving an emptied answer leaves the question out of the client copy instead of printing the draft again', JSON.stringify(st));
  // after an edit the badges and the checklist say so
  await h.select(i22); await h.page.click('#rfp-edit-btn'); await h.page.fill('#rfp-edit', 'Our own words.'); await h.page.click('#rfp-save-edit'); await h.page.waitForTimeout(150); n = await note();
  ok(n && n.asks.every(a => a.badge === 'Not in the edited answer') && /Not in the edited answer/.test(await h.asks()), 'after an edit every ask is badged "Not in the edited answer", on screen and in the checklist', JSON.stringify(n && n.asks.map(a => a.badge).slice(0, 3)));
  // ownership read across "and"
  r = await h.text('We already license Brand Visibility and Customer Journey Analytics. 2.2 How would you connect them?');
  ok((await h.eval(() => [...RFPAnswers.ownedProducts()].sort().join(','))) === 'bv,cja', '4.10 "we already license Brand Visibility and Customer Journey Analytics" marks both as owned', await h.eval(() => [...RFPAnswers.ownedProducts()].join(',')));
  // a documented pair whose services are all optional still drafts
  r = await h.text('How does Workfront work with AEM Sites?');
  ok(r.questions[0].draft && r.questions[0].draft.conn === 'aemsites+workfront' && r.questions[0].draft.lines.length > 0, 'a pair whose services are all optional lines drafts from the first of them (AEM Sites + Workfront)', JSON.stringify(r.questions[0].draft && [r.questions[0].draft.conn, r.questions[0].draft.lines.map(l => l.id)]));
  // "do you need anything from us" is not a capability question
  r = await h.text('Is there anything you need from us to connect our Customer Journey Analytics data to Brand Visibility?');
  ok(r.questions[0].draft && !r.questions[0].draft.capability && r.questions[0].draft.asks.length >= 5, '6.1 a yes/no phrasing of "what do you need from us" still lists the asks', JSON.stringify(r.questions[0].draft && [r.questions[0].draft.capability, r.questions[0].draft.asks.length]));
  // a typed note about "the client" reads to the client as "you"
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22);
  await h.page.fill('#rfp-answer .rfp-asks li:nth-child(1) .rfp-fact', "The client's IT team told us Akamai fronts both sites."); await h.page.waitForTimeout(120); b = await body();
  ok(/CDN access logs: Your IT team told us Akamai fronts both sites\./.test(section(b, HAVE)), 'a note typed about "the client" reaches the client as "your"', section(b, HAVE));
  // what the third round of skeptics found (Nov 10, after the second batch), kept closed
  const sect = () => h.eval(() => RFPBuilder.state.questions[RFPBuilder.state.selected].draft.sections);
  // 6.2: every documented prerequisite appears once, in one list (target+eds has seven; a trio of connections keeps all of theirs)
  r = await h.text('How would Adobe Target personalize our Edge Delivery Services site?'); await h.select(0); n = await note();
  ok(n && n.sells.some(x => /^Adobe Target license$/.test(x)) && ['Web SDK route', 'at.js route, also on aem.live', 'Target turned on for the agreed pages', 'Consent management platform connected', 'Optional, for authors'].every(k => n.asks.some(a => a.text.includes(k))) && n.confirm.some(x => /^Martech plugin route only/.test(x)), '6.2 all seven prerequisites of Target + Edge Delivery are in the note, each in one list (no near-duplicate rule)', JSON.stringify(n && [n.sells, n.asks.map(a => a.text.slice(0, 40)), n.confirm.map(x => x.slice(0, 40))]));
  r = await h.text('How would Brand Visibility, Customer Journey Analytics and Adobe Commerce work together for our store?'); await h.select(0); n = await note();
  ok(n && n.asks.length >= 14 && n.asks.some(a => /CJA administrator who adds the Brand Visibility dataset/.test(a.text)) && n.asks.some(a => /Data Connection extension sending Commerce data/.test(a.text)), '6.2 in a three-connection answer no prerequisite of a later connection is swallowed by an earlier one', n && n.asks.length + ' asks');
  // 6.3: licenses are licenses, Adobe's own work is Confirm with Adobe, statements are assumptions
  r = await h.text('How would you connect Adobe Commerce to AEM Sites for our product pages?'); await h.select(0); n = await note();
  ok(n && n.sells.some(x => /^Also needs the CIF add-on\.$/.test(x)) && n.confirm.some(x => /^CIF add-on provisioned by Adobe/.test(x)) && n.asks.some(a => /^A publicly reachable HTTPS Commerce GraphQL endpoint/.test(a.text)), '6.3 the CIF add-on is a license, its provisioning is Adobe\'s, and the GraphQL endpoint is an ask though it ends in "not supported"', JSON.stringify(n && [n.sells, n.confirm.map(x => x.slice(0, 40)), n.asks.map(a => a.text.slice(0, 40))]));
  r = await h.text('How would AEM Sites experience fragments be used in Adobe Target activities?'); await h.select(0); n = await note();
  ok(n && n.confirm.some(x => /^Adobe Target Customer Care has enabled/.test(x)) && !n.asks.some(a => /Customer Care/.test(a.text)), '6.3 what Adobe Customer Care enables sits under Confirm with Adobe', JSON.stringify(n && n.confirm));
  r = await h.text('How would Workfront connect to AEM Sites for our content team?'); await h.select(0); n = await note();
  ok(n && n.confirm.some(x => /^Adobe enabling the configured plugin/.test(x)) && !n.asks.some(a => /Adobe enabling/.test(a.text)), '6.3 "Adobe enabling the configured plugin" is Adobe\'s, not a need the client supplies', JSON.stringify(n && n.confirm));
  // 6.5: a clause-led ask gives a lead that names the thing
  await h.page.fill('#rfp-answer .rfp-asks li:nth-child(' + (n.asks.findIndex(a => /^For Fusion:/.test(a.text)) + 1) + ') .rfp-fact', 'We are on release 26400.'); await h.page.waitForTimeout(120); b = await body();
  ok(/^AEM release 26309 for Fusion: We are on release 26400\.$/m.test(section(b, HAVE)), '6.5 a clause-led ask ("For Fusion: AEM release 26309 ...") leads its fact with the thing, not with "and"', section(b, HAVE));
  r = await h.text('How would Journey Optimizer offer decisions run in our Adobe Target activities?'); await h.select(0); n = await note();
  ok(n && n.assumptions.some(x => /^Legacy offer route: Target as the reporting source, with no A4T/.test(x)) && !n.sells.some(x => /reporting source/.test(x)) && n.sells.some(x => /^Also needs Journey Optimizer Ultimate or the Offer Decisioning add-on\.$/.test(x)), '6.3 "offer" alone is not a license word: the reporting-source statement is an assumption and the Offer Decisioning add-on the license', JSON.stringify(n && [n.sells, n.assumptions.map(x => x.slice(0, 50))]));
  r = await h.text('How would you roll out Coworker Chat across our team\'s existing Adobe applications?'); await h.select(0); n = await note();
  ok(n && n.assumptions.some(x => /^The work covers Coworker Chat in your client's licensed, eligible Adobe applications/.test(x)) && !n.sells.some(x => /work covers Coworker Chat/.test(x)) && n.asks.length && n.asks.every(a => /^(?:Your client provides|Existing eligible applications are healthy|Administrators decide)/.test(a.text)), '6.7 scope and exclusion statements of the Coworker templates are assumptions; only the client-shaped sentences are asks', JSON.stringify(n && [n.sells, n.asks.map(a => a.text.slice(0, 50))]));
  r = await h.text('How would you build off-site authority for our financial-services brand with publishers and communities using Brand Visibility?'); await h.select(0); n = await note();
  ok(n && n.asks.some(a => /^Credible evidence from your client and explicit outreach authorization are available\./.test(a.text)) && n.asks.some(a => /^Your client's designated financial-services reviewers approve/.test(a.text)) && !n.asks.some(a => /The log-forwarding job|Brand Visibility runs the tracked prompts/.test(a.text)) && n.assumptions.some(x => /^The log-forwarding job in your client's CDN console is often the longest item; you confirm its date/.test(x)), '6.4 and 6.7 the note speaks to the partner ("Credible evidence from your client", "you confirm its date") and the Brand Visibility statements are assumptions', JSON.stringify(n && [n.asks.map(a => a.text.slice(0, 60)), n.assumptions.map(x => x.slice(0, 60))]));
  r = await h.text('What ongoing Coworker support would you give our Skills after the pilot?'); await h.select(0); n = await note();
  ok(n && n.asks.some(a => /^An accepted pilot, your client's feedback and available usage reports are in place\./.test(a.text)) && n.assumptions.some(x => /^You and your client review usage after three months/.test(x)), '6.4 "Client feedback" and "The partner and the Client" read as the partner\'s own note', JSON.stringify(n && [n.asks.map(a => a.text), n.assumptions]));
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(r.questions.findIndex(x => x.label === '2.3')); n = await note();
  ok(n && n.assumptions.some(x => /^These hours cover your work around Adobe's setup/.test(x)) && !/the partner|partner-|Partner-/.test(n.text) && n.asks.some(a => /so your client confirms its own record-keeping needs/.test(a.text)), '6.4 the note never says "the partner": "These hours cover your work"; the record-keeping sentence stays an ask', n && n.text.slice(0, 300));
  // the typed note's voice: apostrophes, "our client", THE CLIENT, bare Client, the customer, the partner as object and subject
  const V = [["The client’s IT team told us Akamai fronts both sites.", "Your IT team told us Akamai fronts both sites."], ["Our client already runs the TikTok business verification.", "You already run the TikTok business verification."], ["The CLIENT confirmed the Meta app is verified.", "You confirmed the Meta app is verified."], ["Client confirmed this on 4 Nov.", "You confirmed this on 4 Nov."], ["The customer’s DAM team owns the folder structure.", "Your DAM team owns the folder structure."], ["The client gave the partner read access to the logs last week.", "You gave us read access to the logs last week."], ["The partner was given access by the client.", "We were given access by you."], ["You use Akamai; the partner has access.", "You use Akamai; we have access."], ["The client and the partner agreed the route.", "You and we agreed the route."], ["Live chat conversations are kept for 30 days, so the Client confirms its own record-keeping needs.", "Live chat conversations are kept for 30 days, so you confirm your own record-keeping needs."], ["The Client provides access to the current sites, vendors and analytics, and names its approvers.", "You provide access to the current sites, vendors and analytics, and name your approvers."], ["We explain what the results mean for the Client, which actions come first, and the Client review.", "We explain what the results mean for you, which actions come first, and your review."]];
  const vr = []; for (const [a, want] of V) { const got = await h.voice(a); if (got !== want) vr.push(a + ' => ' + got); }
  ok(vr.length === 0, '6.4 a typed note reaches the client in its voice whatever the partner called the two parties (curly apostrophes, our client, THE CLIENT, Client, the customer, the partner given, shown or kept)', vr.join(' | '));
  // 6.5 a typed fact gets the same scrub as the rest of the response
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22);
  await h.page.fill('#rfp-answer .rfp-asks li:nth-child(1) .rfp-fact', 'We confirmed with the client that the Legacy at.js route is in place.'); await h.page.waitForTimeout(120); b = await body();
  ok(/^CDN access logs: We confirmed with you that the at\.js route \(Adobe's earlier library\) is in place\.$/m.test(section(b, HAVE)), '6.5 a typed fact passes the client scrub (no Legacy) and the voice rewrite', section(b, HAVE));
  // 6.6 a skipped question sends nothing: badges, the internal line, the asks explainer and the checklist say so
  await h.setStatus(i22, 'skipped'); await h.select(i22); n = await note();
  ok(n && n.asks.every(a => a.badge === 'Not in the response: the question is skipped') && /Internal\. Nothing in this box goes into the response, the Excel or your client's workbook: the question is skipped\./.test(n.text) && /While the question is skipped, ticks and notes go into your checklist only\./.test(n.text), '6.6 after Skip the badges and the internal line say nothing from the box reaches the response', JSON.stringify(n && [n.asks.map(a => a.badge).slice(0, 2), n.text.slice(0, 200)]));
  ok(/Not in the response: the question is skipped/.test(await h.asks()), '6.6 the checklist marks a skipped question\'s asks as not in the response');
  // 6.6 the capability path has no edited-answer line and no promise about ticks
  r = await h.text('Where is Brand Concierge hosted? We will not use Adobe Target for this.'); await h.select(0);
  await h.page.fill('#rfp-firm', 'US-East.'); await h.page.click('#rfp-firm-use'); await h.page.waitForTimeout(100); const cp = await h.panel();
  ok(r.questions[0].draft && r.questions[0].draft.capability && /rules out Target/.test(cp) && /Internal\. Nothing in this box goes into the response, the Excel or your client's workbook\. All of it goes into your checklist\./.test(cp) && !/You edited this answer|except the asks/.test(cp), '6.6 the capability box carries no edited-answer line and no promise about ticks when it has nothing to tick', cp.slice(Math.max(0, cp.indexOf('Internal')), cp.indexOf('Internal') + 260));
  // 6.5 a fact typed before Edit, saved with the prefilled draft, is badged as in the edited answer
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22);
  await h.page.fill('#rfp-answer .rfp-asks li:nth-child(1) .rfp-fact', 'Akamai serves both sites.'); await h.page.waitForTimeout(100);
  await h.page.click('#rfp-edit-btn'); await h.page.click('#rfp-save-edit'); await h.page.waitForTimeout(150); n = await note();
  ok(n && n.asks.every(a => a.badge === 'In the edited answer') && /You edited this answer, so ticks and notes here no longer change it/.test(n.text) && /While the answer is edited, ticks and notes go into your checklist only\./.test(n.text), '6.5 saving the prefilled draft keeps every ask badged "In the edited answer"; the box says ticks go to the checklist only', JSON.stringify(n && n.asks.map(a => a.badge).slice(0, 3)));
  // after Edit, taking the products out keeps the saved answer in view with Edit and Skip
  await h.page.click('#rfp-edit-btn'); await h.page.fill('#rfp-edit', 'Our own words for 2.2.'); await h.page.click('#rfp-save-edit'); await h.page.waitForTimeout(100);
  await h.page.click('#rfp-answer .rfp-chip [data-rm="cja"]'); await h.page.waitForTimeout(150); await h.page.click('#rfp-answer .rfp-chip [data-rm="bv"]'); await h.page.waitForTimeout(150);
  ok(/Our own words for 2\.2\./.test(await h.panel()) && (await h.eval(() => !!document.getElementById('rfp-edit-btn') && !!document.getElementById('rfp-skip'))) && (await h.doc()).includes('Our own words for 2.2.'), 'a saved answer whose products were taken out stays in view with Edit and Skip, since it still reaches the client', (await h.panel()).slice(0, 200));
  // a pile change clears the ticks and notes with the draft
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22);
  await h.page.fill('#rfp-answer .rfp-asks li:nth-child(1) .rfp-fact', 'Akamai.'); await h.page.waitForTimeout(100);
  await h.eval(i => { const s = document.querySelector(`#rfp-questions li[data-i="${i}"] .rfp-kind`); s.value = 'firm'; s.dispatchEvent(new Event('change', {bubbles: true})); }, i22); await h.page.waitForTimeout(100);
  ok((await h.eval(i => { const q = RFPBuilder.state.questions[i]; return [q.kind, q.facts === undefined, q.ticks === undefined, q.pick === undefined].join('|'); }, i22)) === 'firm|true|true|true', 'a pile change clears the ticks, notes and product picks with the draft, so nothing survives half-way', await h.eval(i => JSON.stringify(RFPBuilder.state.questions[i]).slice(0, 200), i22));
  // decision 2: the client's own words survive the scrub; the SOW's drafting talk does not
  r = await h.text('How would Brand Concierge help shoppers compare products in our Adobe Commerce store?'); await h.select(0);
  const work = (await sect()).find(s => s[0] === 'What we would do');
  ok(work && /^We will turn on the Commerce catalog integration .* test product cards and comparisons/.test(work[1][0]), 'decision 2 the Brand Concierge + Commerce line keeps "product cards" (the client\'s own words, not canvas talk) and its verb', work && work[1][0].slice(0, 200));
  r = await h.text('How would you analyze conversation-to-purchase handoff rates from Brand Concierge in Customer Journey Analytics?'); await h.select(0);
  ok(/only where there is a documented source/.test(JSON.stringify(await sect())) && !/the SOW/.test(JSON.stringify(await sect())), 'decision 2 "where the SOW identifies" reads "where there is" to the client', JSON.stringify(await sect()).slice(0, 200));
  r = await h.text('How would Real-Time CDP audiences personalize Brand Concierge replies?'); await h.select(0);
  ok(/We do not assume the Brand Concierge-bundled datastream/.test(JSON.stringify(await sect())), 'decision 2 "Do not assume" becomes a statement ("We do not assume")', JSON.stringify(await sect()).slice(0, 200));
  r = await h.text('How would you set up Analysis Workspace projects and dashboards in CJA for our executive team?'); await h.select(0);
  ok(/we will agree with you whether app setup and access support/.test(JSON.stringify(await sect())) && !/state whether/.test(JSON.stringify(await sect())), 'decision 2 "state whether" (SOW drafting talk) becomes "agree with you whether"', JSON.stringify(await sect()).slice(0, 200));
  // the matcher and the ownership scan
  r = await h.text('Lot 3: Customer Journey Analytics\n3.1 How would our Power BI reports read the data?');
  ok(r.questions[0].draft && r.questions[0].draft.conn === 'cja+bi' && r.questions[0].draft.lines.length === 2, 'a question that names only the client\'s BI tool under a CJA heading draws the connection from the heading', JSON.stringify(r.questions[0].draft && [r.questions[0].draft.conn, r.questions[0].draft.lines.map(l => l.id)]));
  r = await h.text('Our audiences built in Customer Journey Analytics need to reach Target, and offer decisions run in Adobe Target activities.\n1. How would you connect them?');
  ok((await h.eval(() => [...RFPAnswers.ownedProducts()])).length === 0, '"built in" and "run in" name a product without saying the client runs it', (await h.eval(() => [...RFPAnswers.ownedProducts()])).join(','));
  // more than four connections: the lists stop where the approach stops
  r = await h.text('How would Marketo Engage, Workfront, AEM Assets, Coworker and Journey Optimizer work together for our campaign team?'); await h.select(0); n = await note();
  ok(n && n.assumptions.filter(x => /^Availability of /.test(x)).length === 4, 'the note carries the prerequisites and availability of the four connections the approach names, not of every pair', JSON.stringify(n && n.assumptions.filter(x => /^Availability of /.test(x)).map(x => x.slice(0, 50))));
  ok(h.errors.length === 0, 'no script errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `${fails} STEP 54 CHECK(S) FAILED` : 'ALL STEP 54 CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
