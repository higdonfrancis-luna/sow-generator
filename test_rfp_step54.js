// Step 54 (Nov 10 2026): the client is told what we need. Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_step54.js
// Checks, on the built prototype and against the picture Adam approved (decision 1): the note's four lists (Adobe licenses,
// Ask your client with a tick box each, the notes about Adobe, Assumptions; since Nov 17 the notes about Adobe are two lists,
// Ask Adobe and Good to know), no six-item cap, each matched line's own
// requirements, ticked asks in the response as "What we would need from you", a typed fact moving its item to "What you
// already have in place, as confirmed with your team" led by its subject, the internal line, partner voice in the note,
// the line after an edit, and the two downloads and the Excel.
// Step 93 removed the AI path; no check here used it, and the order check now accepts the knowledge base's "How we would do it" for the work section.
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
const {technicalBodies, tableIn} = require('./rfp_prototype/chatgpt_round5/test_word_complete.js');
const FIX = __dirname + '/qa/rfp_fixtures';
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 500) + ']')); if (!c) fails++; };
const HAVE = 'What you already have in place, as confirmed with your team', NEED = 'What we would need from you';
(async () => {
  const h = await open();
  const note = () => h.eval(() => { const n = document.querySelector('#rfp-answer .rfp-partner-note'); if (!n) return null; const L = s => [...n.querySelectorAll(s + ' li')].map(x => x.textContent.trim()); return {text: n.textContent, sells: L('.rfp-sells'), asks: [...n.querySelectorAll('.rfp-asks li')].map(li => ({text: li.querySelector('label span').firstChild.textContent.trim(), ticked: li.querySelector('.rfp-tick').checked, disabled: li.querySelector('.rfp-tick').disabled, badge: li.querySelector('.rfp-badge').textContent, placeholder: li.querySelector('.rfp-fact').placeholder})), ask: L('.rfp-confirm'), know: L('.rfp-know'), confirm: L('.rfp-confirm').concat(L('.rfp-know')), heads: [...n.querySelectorAll('.rfp-confirm, .rfp-know')].map(u => u.previousElementSibling.textContent), assumptions: L('.rfp-assume')}; });
  // the response's sections, read from the DOM (the headings are drawn in capitals, so innerText would not match them)
  const body = () => h.eval(() => { const out = {}; for (const h4 of document.querySelectorAll('#rfp-body h4')) { const ul = h4.nextElementSibling; out[h4.textContent] = ul && ul.tagName === 'UL' ? [...ul.querySelectorAll('li')].map(li => li.textContent) : [ul ? ul.textContent : '']; } out._order = [...document.querySelectorAll('#rfp-body h4')].map(h => h.textContent); return out; });
  const section = (b, head) => (b[head] || []).join('\n');
  const count = (b, head) => (b[head] || []).length;
  // 6.1, 6.2: bank 2.2, nine prerequisites, all shown, the asks ticked by default and in the response
  let r = await h.file(FIX + '/bank_rfp.xlsx');
  const i22 = r.questions.findIndex(x => x.label === '2.2');
  await h.select(i22);
  let n = await note();
  ok(n && /Notes for you, not for the client/.test(n.text) && /Internal\. Nothing in this box goes into the proposal or your client's workbook, except the asks you leave ticked \(all start ticked\) and what you type\./.test(n.text), 'the note says it is internal, except what the partner ticks or types', n && n.text.slice(0, 200));
  ok(n && n.sells.length === 1 && /^A Brand Visibility license/.test(n.sells[0]) && !/trial|paid/i.test(n.sells[0]) && /Adobe licenses this proposal includes \(Adobe quotes them\)/.test(n.text), 'the license the play sells sits under "Adobe licenses this proposal includes (Adobe quotes them)"', JSON.stringify(n && n.sells));
  ok(n && n.asks.length === 9 && n.asks.some(a => /Acceptance that some Brand Visibility data is processed temporarily in the United States/.test(a.text)) && n.asks.some(a => /CJA data view that maps Page URL/.test(a.text)) && n.asks.some(a => /For Business Impact in Brand Visibility/.test(a.text)), '6.2 no six-item cap: the three prerequisites the old note dropped are back, nine asks in all', JSON.stringify(n && n.asks.map(a => a.text.slice(0, 40))));
  ok(n && n.asks.some(a => /^Your Customer Journey Analytics package: CJA Select or higher\./.test(a.text)), '6.2 the matched line\'s own tier (C01: CJA Select or higher) is an ask', JSON.stringify(n && n.asks.map(a => a.text.slice(0, 50))));
  // step 67: the bank RFP asks for under 300 words an answer, so some ticked asks are badged as left out to fit
  const FIT = 'Left out to fit the word limit', inResp = n ? n.asks.filter(a => a.badge === 'In the response').length : 0;
  ok(n && n.asks.every(a => a.ticked && !a.disabled && (a.badge === 'In the response' || a.badge === FIT) && a.placeholder === 'What your client told you') && inResp >= 4, 'every ask starts ticked, badged "In the response" or, under the RFP\'s word limit, "Left out to fit the word limit", with an empty field whose placeholder is "What your client told you"', JSON.stringify(n && n.asks.map(a => [a.ticked, a.badge, a.placeholder])));
  ok(/Ask your client\. Ticked items go into the response as "What we would need from you"\. Type what your client told you and the item moves to "What you already have in place"\./.test(n.text), 'the note explains the tick boxes in the approved words');
  let b = await body();
  ok(count(b, NEED) === inResp && inResp < 9 && /CDN access logs forwarded to and received by Brand Visibility/.test(section(b, NEED)), '6.1 the response answers "what do you need from us?": the ticked asks that fit under "What we would need from you" (the rest stay in the checklist)', section(b, NEED).slice(0, 300));
  ok(!/the Client\b|your client|Your client/.test(section(b, NEED)), 'the needs are in the client\'s voice', section(b, NEED).slice(0, 300));
  // The planning hours consume part of the word budget. Removing one long ask can admit several shorter ones.
  const previouslyCut = n.asks.filter(a => a.badge === FIT).map(a => a.text);
  const removedAsk = n.asks[2].text;
  await h.page.click('#rfp-answer .rfp-asks li:nth-child(3) .rfp-tick'); await h.page.waitForTimeout(100);
  n = await note(); b = await body();
  const includedAfter = n.asks.filter(a => a.badge === 'In the response');
  ok(n.asks[2].text === removedAsk && !n.asks[2].ticked && n.asks[2].badge === 'Not in the response' &&
     count(b, NEED) === includedAfter.length && includedAfter.some(a => previouslyCut.includes(a.text)) &&
     !section(b, NEED).includes(removedAsk.slice(0, 30)), 'the unticked ask leaves the response and a previously omitted ask fits',
     JSON.stringify([n.asks[2], includedAfter.map(a => a.text), b[NEED]]));
  // type a fact: the item moves to what the client already has, led by its subject
  await h.page.fill('#rfp-answer .rfp-asks li:nth-child(1) .rfp-fact', 'Akamai serves both sites; your IT team confirmed log forwarding can be enabled.'); await h.page.waitForTimeout(150);
  n = await note(); b = await body();
  ok(n.asks[0].badge === 'Answered by your note below' && n.asks[0].disabled === true && n.asks[0].ticked === false, 'a typed fact badges its item "Answered by your note below" and greys out its tick box', JSON.stringify(n.asks[0]));
  ok(count(b, HAVE) === 1 && /^CDN access logs: Akamai serves both sites; your IT team confirmed log forwarding can be enabled\.$/.test(section(b, HAVE)), '6.5 the fact appears under "' + HAVE + '", led by the subject of its ask', section(b, HAVE));
  ok(count(b, NEED) === n.asks.filter(a => a.badge === 'In the response').length && count(b, NEED) >= 5 && !/CDN access logs forwarded/.test(section(b, NEED)), 'the answered item leaves "What we would need from you"', section(b, NEED).slice(0, 200));
  // step 93: the answer is the method knowledge base's five parts, so the work is under "How we would do it" (or the catalog's "What we would do"); the client sections still come after it, then the sources
  const workAt = b._order.findIndex(x => x === 'What we would do' || x === 'How we would do it');
  ok(b._order[0] === 'Our approach' && workAt > 0 && workAt < b._order.indexOf(HAVE) && b._order.slice(-3).join('|') === [HAVE, NEED, 'Adobe sources for the product facts above'].join('|'), 'the order is what we would do, what you already have in place, what we would need from you, sources', b._order.join('|'));
  ok((await h.eval(() => document.activeElement && document.activeElement.classList.contains('rfp-fact'))), 'the field keeps focus while the response updates');
  ok(!n.assumptions.some(a => /^Availability/.test(a)) && !/Not stated by Adobe|once it is enabled for the organization|Adobe's confirmation that the site is available|the CJA integration enabled for the organization/.test(n.text) && n.asks.some(a => /^CDN access logs forwarded to and received by Brand Visibility for each site(?!,)/.test(a.text)) && n.asks.some(a => /^For Business Impact in Brand Visibility: a signed-in user with CJA access to the data view in the same IMS organization as the site, and permission to manage configuration in Brand Visibility/.test(a.text)), 'step 86: Brand Visibility + CJA has no availability, so no Availability line sits under Assumptions behind this answer; the CDN log and Business Impact prerequisites stay, without their caveat clauses', JSON.stringify([n.assumptions, n.asks.map(a => a.text.slice(0, 80))]));
  // 6.4 partner voice in the note
  let r2 = await h.text('How would Brand Concierge answer our customers\' questions about accounts and rates?');
  await h.select(0); n = await note();
  ok(n && !/\bthe Client\b(?! ID)|\bThe Client\b/.test(n.text) && /your client/i.test(n.text), '6.4 the note says "your client", never "the Client"', n && n.text.slice(0, 400));
  // 6.3, 6.7: three boxes plus assumptions
  r2 = await h.text('How does Coworker work with Customer Journey Analytics for our AI channel readouts?');
  await h.select(0); n = await note();
  ok(n && n.know.some(x => /Adobe's onboarding team configures Coworker/.test(x)) && !n.ask.length && !n.asks.some(a => /Adobe's onboarding team/.test(a.text)) && !n.sells.some(x => /onboarding team configures/.test(x)), '6.3 what only Adobe does sits under Good to know, not under Ask Adobe, the licenses or the asks', JSON.stringify(n && [n.confirm, n.sells]));
  ok(n && n.sells.some(x => /^Coworker Chat license$/.test(x)) && !/through the Adobe account team|health care|finance|confirm eligibility/i.test(n.text), '6.3 the Coworker Chat license is an Adobe license this proposal includes, with no "through the Adobe account team" and no eligibility caution (step 86)', JSON.stringify(n && n.sells));
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
  ok(!/health care|finance|confirm eligibility|generally available|not currently (?:available|offered)/i.test(n.text) && !n.assumptions.some(x => /^Availability/.test(x)) && !/the Client\b/.test(n.confirm.join(' ')) && n.sells.some(x => /^Workfront Standard license \(any Workfront package\)$/.test(x)) && n.sells.some(x => /^CX Enterprise Coworker license for your client's organization$/.test(x)) && n.know.some(x => /^Adobe's support or professional services team configures Coworker/.test(x)) && !n.ask.length && !n.sells.some(x => /configures Coworker/.test(x)), 'Coworker + Workfront: no eligibility caution and no availability line are left (step 86); the Workfront and Coworker licenses stay, and Adobe\'s own configuration work sits under Good to know, in partner voice, split from the license it was written with', JSON.stringify([n.confirm, n.sells, n.assumptions]));
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22); n = await note();
  ok(/Not in the client's text: The AI-referred visits and conversions come from your client's own CJA web data/.test(n.text) && !n.confirm.some(x => /ordinary referrer/.test(x)), '5.4 the Brand Visibility + CJA caution the client no longer reads is a line of its own in the note, not under Ask Adobe or Good to know', n.text.slice(0, 400));
  // 6.5 after Edit, the note says ticks and notes no longer change the answer
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22);
  await h.page.click('#rfp-edit-btn'); await h.page.fill('#rfp-edit', 'Our own words for 2.2.'); await h.page.click('#rfp-save-edit'); await h.page.waitForTimeout(150);
  n = await note();
  ok(n && /You edited this answer, so ticks and notes here no longer change it; they go into your checklist only\. Edit it again and type them in\./.test(n.text), 'after an edit the note says the ticks and notes no longer change the answer', n && n.text.slice(0, 300));
  // the downloads: the response carries the two client sections and none of the note; the checklist carries every list
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22);
  await h.page.click('#rfp-answer .rfp-asks li:nth-child(3) .rfp-tick'); await h.page.fill('#rfp-answer .rfp-asks li:nth-child(1) .rfp-fact', 'Akamai serves both sites.'); await h.page.waitForTimeout(150);
  await h.page.click('#rfp-use'); await h.page.waitForTimeout(100);   // step 55: the downloads carry approved answers
  const doc = technicalBodies(await h.word(), ['2.2']).get('2.2').paragraphs.join('\n');
  ok(doc.includes(HAVE) && /CDN access logs: Akamai serves both sites\./.test(doc) && doc.includes(NEED) &&
    /full URL field/.test(doc) && !/CJA administrator who adds/.test(doc), 'the Word answer carries the typed fact and ticked asks and omits the unticked one');
  ok(!/Notes for you|Ask your client|Adobe licenses this proposal|Confirm with Adobe|Ask Adobe|Good to know|Assumptions behind|Internal\./.test(doc), 'the Word answer excludes internal notes');
  const checklist = await h.checklist(), rows22 = checklist.filter(row => row[0] === '2.2');
  const types = new Set(checklist.slice(1).map(row => row[2]));
  ok(['License', 'Ask your client', 'Ask Adobe', 'Good to know', 'Assumption'].every(type => types.has(type)) && types.size === 5, 'the checklist workbook uses the five partner item types, and none is "Confirm with Adobe"', [...types].join());
  ok(rows22.some(row => /Your client says: Akamai serves both sites\./.test(row[3]) && row[4] === 'Yes') &&
    rows22.some(row => /full URL field/.test(row[3]) && row[4] === 'Yes') &&
    rows22.some(row => /CJA administrator who adds/.test(row[3]) && row[4] === 'No'), 'the checklist records the typed fact and marks ticked and unticked asks against the client answer');
  ok(!/\bthe Client\b(?! ID)/.test(rows22.map(row => row[3]).join('\n')), 'the checklist uses partner voice');
  const client = await h.workbook('rfp-writeback');
  const r22 = client.sheets.Questions.find(row => row[1] === '2.2');
  ok(r22 && r22[3].includes(HAVE) && r22[3].includes(NEED) && /CDN access logs: Akamai serves both sites\./.test(r22[3]), 'the client workbook carries both client sections');
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
  ok(count(b, NEED) === n.asks.filter(a => a.badge === 'In the response').length, 'only the asks reach "What we would need from you" (the ones the word limit leaves room for)', count(b, NEED) + ' vs ' + n.asks.filter(a => a.badge === 'In the response').length);
  // the second documented connection's prerequisites are offered too (and, since the Nov 15 canvas merge documented Edge Delivery + CJA, the third's;
  // that merge also renamed the product to "AEM Sites with Edge Delivery Services", the name the availability line now carries)
  r = await h.text('How would Brand Visibility work with our Edge Delivery Services site and our Customer Journey Analytics data?'); await h.select(0); n = await note();
  const conns = await h.eval(() => RFPBuilder.state.questions[0].draft.m.conns.map(c => c.id));
  const av2 = n.assumptions.filter(a => /^Availability/.test(a));
  ok(conns.length >= 2 && conns.join('|') === 'bv-eds|eds-cja|bv-cja' && n.asks.some(a => /Experience Platform user who sets up the Adobe Brand Visibility source dataflow/.test(a.text)) && n.asks.some(a => /^CDN log forwarding for agentic traffic data(?! \()/.test(a.text)) && n.asks.some(a => /^Consent settings and permission to instrument the Edge Delivery pages\./.test(a.text)) && !/documents no connection between/.test(n.text) && !/confirm the route for Adobe's managed CDN|Not stated by Adobe|once it is enabled for the organization/.test(n.text) && av2.length === 1 && av2[0] === 'Availability of Brand Visibility + AEM Sites with Edge Delivery Services: Your client confirms its licensed deployment, actual outer-CDN routing, required access and authoring release process before this workflow you manage starts.', 'the prerequisites of every connection the answer uses are in the note (bv+eds, eds+cja and bv+cja), with the availability of the one that has any (bv+eds, under the product\'s name "AEM Sites with Edge Delivery Services") and no line for the two that have none (eds+cja; bv+cja, step 86)', JSON.stringify([conns, n.asks.length, av2]));
  // an emptied edit leaves the answer out
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22);
  await h.page.click('#rfp-edit-btn'); await h.page.fill('#rfp-edit', '   '); await h.page.click('#rfp-save-edit'); await h.page.waitForTimeout(150);
  const st = await h.eval(() => { const q = RFPBuilder.state.questions[RFPBuilder.state.selected]; return [q.status, q.answer]; });
  const doc2 = await h.word();
  ok(st[0] === 'skipped' && st[1] === undefined && tableIn(doc2, 'Requirements matrix', 'Ref').find(row => row.Ref === '2.2')['Answered in'] === 'To write' &&
    !technicalBodies(doc2, ['2.2']).has('2.2'), 'saving an emptied answer leaves it out of the client copy');
  const noAsksInResponse = async () => {
    const rows = (await h.checklist()).filter(row => row[0] === '2.2' && row[2] === 'Ask your client');
    return rows.length > 0 && rows.every(row => row[4] === 'No');
  };
  // after an edit the badges and the checklist say so
  await h.select(i22); await h.page.click('#rfp-edit-btn'); await h.page.fill('#rfp-edit', 'Our own words.'); await h.page.click('#rfp-save-edit'); await h.page.waitForTimeout(150); n = await note();
  ok(n && n.asks.every(a => a.badge === 'Not in the edited answer') && await noAsksInResponse(), 'after an edit every ask is badged "Not in the edited answer", on screen and in the checklist', JSON.stringify(n && n.asks.map(a => a.badge).slice(0, 3)));
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
  ok(n && n.sells.length === 1 && /^Adobe Target license$/.test(n.sells[0]) && n.asks.length === 6 && ['Web SDK route', 'at.js route, also on aem.live: Target client code and IMS org ID', 'Martech plugin route only: the aem-martech plugin, Adobe Analytics, a datastream connected to Target and Analytics, and a Tags property with the Adobe Client Data Layer extension', 'Target turned on for the agreed pages', 'Consent management platform connected', 'Optional, for authors'].every(k => n.asks.filter(a => a.text.includes(k)).length === 1) && !n.confirm.some(x => /Martech plugin/.test(x)) && !/co-innovation|One Adobe lab|AEM Engineering|legacy/i.test(n.text) && !n.assumptions.some(x => /^Availability/.test(x)), '6.2 all seven prerequisites of Target + Edge Delivery are in the note, each once in one list (the license, and six asks that now include the martech plugin route), with no Legacy or co-innovation label and no availability line (step 86)', JSON.stringify(n && [n.sells, n.asks.map(a => a.text.slice(0, 40)), n.confirm.map(x => x.slice(0, 40)), n.assumptions]));
  r = await h.text('How would Brand Visibility, Customer Journey Analytics and Adobe Commerce work together for our store?'); await h.select(0); n = await note();
  ok(n && n.asks.length >= 14 && n.asks.some(a => /CJA administrator who adds the Brand Visibility dataset/.test(a.text)) && n.asks.some(a => /Data Connection extension sending Commerce data/.test(a.text)), '6.2 in a three-connection answer no prerequisite of a later connection is swallowed by an earlier one', n && n.asks.length + ' asks');
  // 6.3: licenses are licenses, Adobe's own work is Good to know, statements are assumptions
  r = await h.text('How would you connect Adobe Commerce to AEM Sites for our product pages?'); await h.select(0); n = await note();
  ok(n && n.sells.some(x => /^Also needs the CIF add-on\.$/.test(x)) && n.sells.some(x => /^CIF add-on$/.test(x)) && !n.asks.some(a => /CIF add-on/.test(a.text)) && !n.confirm.some(x => /CIF add-on/.test(x)) && !/provisioned by Adobe|sales representative|maintenance mode/i.test(n.text) && !n.assumptions.some(x => /^Availability/.test(x)) && n.asks.some(a => /^A publicly reachable HTTPS Commerce GraphQL endpoint/.test(a.text)), '6.3 the CIF add-on is a license (no "provisioned by Adobe through the sales representative" and no maintenance-mode label, step 86), no availability line repeats it, and the GraphQL endpoint is an ask though it ends in "not supported"', JSON.stringify(n && [n.sells, n.confirm.map(x => x.slice(0, 40)), n.asks.map(a => a.text.slice(0, 40)), n.assumptions]));
  r = await h.text('How would AEM Sites experience fragments be used in Adobe Target activities?'); await h.select(0); n = await note();
  ok(n && !/Customer Care|has enabled|must be enabled in Target/.test(n.text) && n.confirm.length === 0 && n.asks.some(a => /^Content Fragment export requires AEM as a Cloud Service/.test(a.text)) && n.asks.some(a => /^Adobe Target Standard or Premium \(Standard exports to the default workspace only\)/.test(a.text)) && n.assumptions.some(x => x === 'Availability: Before export setup, your client confirms that the stated licensing, deployment, permissions and activity prerequisites are met.'), '6.3 nothing says Adobe Customer Care must enable the fragment integration (step 86): nothing sits under Ask Adobe or Good to know, the AEM as a Cloud Service and Target Standard or Premium requirements stay asks, and the availability line keeps the client\'s confirmation only', JSON.stringify(n && [n.confirm, n.asks.map(a => a.text.slice(0, 60)), n.assumptions]));
  r = await h.text('How would Workfront connect to AEM Sites for our content team?'); await h.select(0); n = await note();
  ok(n && n.asks.some(a => /^Two Workfront task custom forms/.test(a.text)) && !n.asks.some(a => /configured plugin/.test(a.text)) && !/Adobe enabling|Adobe has to enable|Where Adobe enables|enabled and configured/.test(n.text) && n.confirm.length === 0 && n.assumptions.some(x => x === 'Availability: Your client confirms that the Universal Editor plugin or selected Fusion connector is configured for its environment.'), '6.3 "Two Workfront task custom forms" is an ask, and the client is not asked to bring the plugin the service sets up (step 86); nothing is left under Ask Adobe or Good to know and the availability line says configured, not enabled', JSON.stringify(n && [n.confirm, n.asks.map(a => a.text.slice(0, 60)), n.assumptions]));
  // 6.5: a clause-led ask gives a lead that names the thing
  await h.page.fill('#rfp-answer .rfp-asks li:nth-child(' + (n.asks.findIndex(a => /^For Fusion:/.test(a.text)) + 1) + ') .rfp-fact', 'We are on release 26400.'); await h.page.waitForTimeout(120); b = await body();
  ok(/^AEM release 26309 for Fusion: We are on release 26400\.$/m.test(section(b, HAVE)), '6.5 a clause-led ask ("For Fusion: AEM release 26309 ...") leads its fact with the thing, not with "and"', section(b, HAVE));
  r = await h.text('How would Journey Optimizer offer decisions run in our Adobe Target activities?'); await h.select(0); n = await note();
  ok(n && n.assumptions.some(x => /^Offer decision route: Target as the reporting source, with no A4T or offer-decision-level Target reporting$/.test(x)) && !n.sells.some(x => /reporting source/.test(x)) && n.sells.some(x => /^Also needs Journey Optimizer Ultimate or the Offer Decisioning add-on\.$/.test(x)) && !/Legacy|Adobe's direction/i.test(n.text) && n.confirm.length === 0 && n.assumptions.some(x => x === 'Availability: Audience sharing uses the separate Adobe Target destination.'), '6.3 "offer" alone is not a license word: the reporting-source statement ("Offer decision route: ...", no Legacy label, step 86) is an assumption and the Offer Decisioning add-on the license; the availability line keeps only the audience-sharing fact', JSON.stringify(n && [n.sells, n.confirm, n.assumptions.map(x => x.slice(0, 80))]));
  r = await h.text('How would you roll out Coworker Chat across our team\'s existing Adobe applications?'); await h.select(0); n = await note();
  ok(n && n.assumptions.some(x => /^The work covers Coworker Chat in your client's licensed Adobe applications; Coworker for teams, a separate standalone application, is out of scope\.$/.test(x)) && !n.sells.some(x => /work covers Coworker Chat/.test(x)) && n.asks.length === 3 && n.asks.every(a => /^(?:Your client provides application owners and an Adobe onboarding contact\.|Existing applications are healthy and your client's administrators provide access and approved source material\.|Administrators decide whether users may install plugins)/.test(a.text)) && !/eligible|Adobe enablement is underway/i.test(n.text), '6.7 scope and exclusion statements of the Coworker templates are assumptions; only the client-shaped sentences are asks (step 86 wording: no "eligible", no "Adobe enablement is underway")', JSON.stringify(n && [n.sells, n.asks.map(a => a.text.slice(0, 50)), n.assumptions]));
  r = await h.text('How would you build off-site authority for our financial-services brand with publishers and communities using Brand Visibility?'); await h.select(0); n = await note();
  ok(n && n.asks.some(a => /^Credible evidence from your client and explicit outreach authorization are available\./.test(a.text)) && !n.asks.some(a => /financial-services reviewers/.test(a.text)) && !n.asks.some(a => /The log-forwarding job|Brand Visibility runs the tracked prompts/.test(a.text)) && n.assumptions.some(x => /^The log-forwarding job in your client's CDN console is often the longest item; you confirm its date/.test(x)), '6.4 and 6.7 the note speaks to the partner ("Credible evidence from your client", "you confirm its date") and the Brand Visibility statements are assumptions', JSON.stringify(n && [n.asks.map(a => a.text.slice(0, 60)), n.assumptions.map(x => x.slice(0, 60))]));
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
  ok(n && n.asks.every(a => a.badge === 'Not in the response: the question is left out') && /Internal\. Nothing in this box goes into the proposal or your client's workbook: the question is left out\./.test(n.text) && /While the question is left out, ticks and notes go into your checklist only\./.test(n.text), '6.6 after Skip the badges and the internal line say nothing from the box reaches the response', JSON.stringify(n && [n.asks.map(a => a.badge).slice(0, 2), n.text.slice(0, 200)]));
  ok(await noAsksInResponse(), '6.6 the checklist marks a left-out question\'s asks as not in the response');
  // 6.6 the capability path has no edited-answer line and no promise about ticks
  r = await h.text('Where is Brand Concierge hosted? We will not use Adobe Target for this.'); await h.select(0);
  await h.page.fill('#rfp-firm', 'US-East.'); await h.page.click('#rfp-firm-use'); await h.page.waitForTimeout(100); const cp = await h.panel();
  ok(r.questions[0].draft?.capability && await h.page.locator('#rfp-scope-note').count() === 0 && /capability question, not answered from this catalog/.test(cp) &&
    !/You edited this answer|except the asks|so the catalog cannot draft/.test(cp), '6.6 the capability panel explains the hosting limitation without treating the refusal as a product request or promising a ticked ask', cp.slice(-600));
  // The same capability panel shows the reminder when the hosting question names the excluded product.
  r = await h.text('Request for Information\n\nConstraints\nWe will not use Adobe Target.\n\nRequirements\n1. Where are Brand Concierge and Adobe Target hosted?'); await h.select(0);
  ok(r.questions[0].draft?.capability && await h.page.locator('#rfp-scope-note').textContent() === 'Your client rules out Target.',
    '6.6 the capability panel names Target when the question asks about it and the background excludes it');
  // 6.5 a fact typed before Edit, saved with the prefilled draft, is badged as in the edited answer
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22);
  await h.page.fill('#rfp-answer .rfp-asks li:nth-child(1) .rfp-fact', 'Akamai serves both sites.'); await h.page.waitForTimeout(100);
  await h.page.click('#rfp-edit-btn'); await h.page.click('#rfp-save-edit'); await h.page.waitForTimeout(150); n = await note();
  ok(n && n.asks[0].badge === 'In the edited answer' && n.asks.filter(a => a.badge === 'In the edited answer').length >= 5 && n.asks.every(a => /^(?:In|Not in) the edited answer$/.test(a.badge)) && /You edited this answer, so ticks and notes here no longer change it/.test(n.text) && /While the answer is edited, ticks and notes go into your checklist only\./.test(n.text), '6.5 saving the prefilled draft keeps every ask it carried badged "In the edited answer" (the ones the word limit left out say so); the box says ticks go to the checklist only', JSON.stringify(n && n.asks.map(a => a.badge).slice(0, 3)));
  // after Edit, taking the products out keeps the saved answer in view with Edit and Skip
  await h.page.click('#rfp-edit-btn'); await h.page.fill('#rfp-edit', 'Our own words for 2.2.'); await h.page.click('#rfp-save-edit'); await h.page.waitForTimeout(100);
  await h.page.click('#rfp-answer .rfp-chip [data-rm="cja"]'); await h.page.waitForTimeout(150); await h.page.click('#rfp-answer .rfp-chip [data-rm="bv"]'); await h.page.waitForTimeout(150);
  ok((await h.eval(() => document.getElementById('rfp-firm') && document.getElementById('rfp-firm').value)) === 'Our own words for 2.2.' && (await h.eval(() => !!document.getElementById('rfp-firm-use') && !!document.getElementById('rfp-skip'))) && (await h.eval(() => !RFPBuilder.state.questions.some(q => q.answer === 'Our own words for 2.2.' && q.status === 'used'))), 'a saved answer whose products were taken out stays in view in its box with Approve and Leave out, and waits for a new approval (step 88: while no answer is approved, every draft prints)', (await h.panel()).slice(0, 200));
  await h.page.click('#rfp-firm-use'); await h.page.waitForTimeout(100);
  ok(technicalBodies(await h.word(), ['2.2']).get('2.2')?.paragraphs.includes('Our own words for 2.2.'), 'approved again, the saved answer reaches the client copy');
  // a pile change clears the ticks and notes with the draft
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22);
  await h.page.fill('#rfp-answer .rfp-asks li:nth-child(1) .rfp-fact', 'Akamai.'); await h.page.waitForTimeout(100);
  await h.eval(i => { const s = document.querySelector(`#rfp-questions li[data-i="${i}"] .rfp-kind`); s.value = 'firm'; s.dispatchEvent(new Event('change', {bubbles: true})); }, i22); await h.page.waitForTimeout(100);
  ok((await h.eval(i => { const q = RFPBuilder.state.questions[i]; return [q.kind, q.facts === undefined, q.ticks === undefined, q.pick === undefined].join('|'); }, i22)) === 'firm|true|true|true', 'a pile change clears the ticks, notes and product picks with the draft, so nothing survives half-way', await h.eval(i => JSON.stringify(RFPBuilder.state.questions[i]).slice(0, 200), i22));
  // decision 2: the client's own words survive the scrub; the SOW's drafting talk does not
  r = await h.text('How would Brand Concierge help shoppers compare products in our Adobe Commerce store?'); await h.select(0);
  const work = (await sect()).find(s => s[0] === 'What we would do');
  ok(work && work[1].some(x => /^We will turn on the Commerce catalog integration .* test product cards and comparisons/.test(x)), 'decision 2 the Brand Concierge + Commerce line keeps "product cards" (the client\'s own words, not canvas talk) and its verb', work && work[1].map(x => x.slice(0, 80)).join(' | '));
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
  const av4 = n ? n.assumptions.filter(x => /^Availability/.test(x)) : [];
  ok(n && av4.join('|') === ['Availability of AEM Assets + Coworker: AEM agents come through the Agentic SKU.', 'Availability of Workfront + Journey Optimizer: Before configuration, your client confirms the Fusion and Workfront licenses, active Journey Optimizer account, and Developer Console credentials for the selected organization and sandbox.', 'Availability of AEM Assets + Workfront: Only for organizations onboarded to the Adobe Admin Console.'].join('|') && n.asks.some(a => /^User access set up, following Adobe's steps/.test(a.text)) && n.sells.some(x => x === 'If Coworker Chat across applications is in scope: a license for it') && !/Not stated by Adobe|generally available|Try Before You Buy|health care|financial services|confirm eligibility|enabled for the subscription/i.test(n.text), 'the note carries the prerequisites of the four connections the approach names, not of every pair, and the availability of the three that have one (Marketo Engage + Coworker has none since step 86; its access and license prerequisites stay)', JSON.stringify(av4.map(x => x.slice(0, 70))));
  // Nov 17 2026 (Adam: "Ask Adobe, confirm with Adobe, it's the same thing. Maybe we get consistent on it.", then yes to the picture
  // handoff/2026-11-17/small_items/item2_ask_adobe_today_vs_proposed.png): the notes about Adobe are two lists, "Ask Adobe:" over the
  // ones that tell the partner to ask Adobe and "Good to know:" over the rest, each in the order it had; a list with no notes shows no
  // heading; the checklist types its rows the same way; and neither phrase reaches the Word proposal or the client's workbook
  r = await h.file(FIX + '/bank_rfp.xlsx');
  const i26 = r.questions.findIndex(x => x.label === '2.6');
  await h.select(i26); n = await note();
  ok(n && n.heads.join('|') === 'Ask Adobe:|Good to know:' && n.ask.length === 5 && n.know.length === 3 && !/Confirm with Adobe/.test(n.text), 'bank 2.6: the notes about Adobe sit under two headings, five under "Ask Adobe:" and three under "Good to know:", and "Confirm with Adobe:" is gone', JSON.stringify(n && [n.heads, n.ask.length, n.know.length]));
  ok(n && [/^Brand Concierge region: .*runs in US-East\. It stays out of the response\. Ask Adobe which is current\.$/, /^Experience Platform regions: .*\. Ask Adobe if the region your client needs is offered\.$/, /^Where your data is hosted for AEM Forms: .*\. Ask Adobe before you answer for it\.$/, /^Certifications for Brand Visibility, Brand Concierge and AEM Forms: .*\. Ask Adobe which certifications cover them\.$/, /^Security certifications and encryption for Brand Visibility and AEM Forms: .*\. Ask Adobe before you answer for them\.$/].every((re, k) => re.test(n.ask[k])),
    'bank 2.6: every note under "Ask Adobe:" tells the partner to ask Adobe in that one phrase (the Brand Concierge and Experience Platform notes are reworded), in the order the notes had', JSON.stringify(n && n.ask.map(x => x.slice(0, 30) + ' ... ' + x.slice(-45))));
  ok(n && !n.know.some(x => /ask Adobe/i.test(x)) && [/^Target hosting: .*The response names only the cluster cities\.$/, /^Marketo data center: .*\. Confirm your client's data center and pod\.$/, /^FedRAMP and IRAP on Adobe's Trust Center list cover named offerings only: .*name one only if your client is on that offering\.$/].every((re, k) => re.test(n.know[k])),
    'bank 2.6: the Target, Marketo and FedRAMP notes sit under "Good to know:", worded as they were and in the order they had (the Marketo note still sends the partner to the client)', JSON.stringify(n && n.know.map(x => x.slice(0, 30) + ' ... ' + x.slice(-45))));
  let list = await h.checklist();
  const typed = (rows, type) => rows.filter(row => row[2] === type).map(row => row[3]);
  ok(typed(list.filter(row => row[0] === '2.6'), 'Ask Adobe').join('|') === n.ask.join('|') && typed(list.filter(row => row[0] === '2.6'), 'Good to know').join('|') === n.know.join('|') && !list.some(row => /Confirm with Adobe/.test(row[2])),
    'the checklist types the same notes of 2.6 "Ask Adobe" and "Good to know", in the same order, and no row is typed "Confirm with Adobe"', JSON.stringify(list.filter(row => row[0] === '2.6').map(row => [row[2], row[3].slice(0, 30)])));
  // every answer approved, so both client documents carry all of them; NOTE_WORDS is the two headings and the guards' own shape for an instruction to ask Adobe
  const NOTE_WORDS = /Good to know|Confirm with Adobe|\basks? Adobe\b(?!['’]s| data\b| (?:Analytics|Commerce|Express)\b)/i, wordText = async () => (await h.word()).blocks.flatMap(block => block.rows ? block.rows.flat() : [block.text]).join('\n');
  for (const x of r.questions) if (x.kind !== 'firm') await h.setStatus(x.i, 'used');
  const wordAll = await wordText();
  const bookAll = Object.values((await h.workbook('rfp-writeback')).sheets).flat(2).join('\n');
  ok(/Where your data is hosted/.test(wordAll) && /Where your data is hosted/.test(bookAll) && !NOTE_WORDS.test(wordAll) && !NOTE_WORDS.test(bookAll),
    'neither the Word proposal nor the client\'s workbook carries "Good to know" or an instruction to ask Adobe, in any case of letters, with every answer of the bank RFP approved (2.6 among them)', (wordAll.match(NOTE_WORDS) || bookAll.match(NOTE_WORDS) || [''])[0]);
  const scrubbed = await h.eval(() => ['Brand Concierge runs in US-East. Ask Adobe which is current. We will set it up.', 'Say how they work together in your own words, or ask Adobe. We map your fields.', 'We map your fields. Ask Adobe where the data is hosted. Ask Adobe first.', 'Your people ask Adobe data questions without switching tools.', 'Your analysts ask Adobe Analytics questions in chat.'].map(t => RFPProposal.scrubText(t, new Set())));
  ok(scrubbed.join(' || ') === 'Brand Concierge runs in US-East. We will set it up. || We map your fields. || We map your fields. || Your people ask Adobe data questions without switching tools. || Your analysts ask Adobe Analytics questions in chat.', 'the Word proposal\'s own filter drops a sentence that says to ask Adobe, whatever word follows, and keeps one where Adobe is part of what is asked ("ask Adobe data questions", "ask Adobe Analytics questions"), which is what Coworker users do', scrubbed.join(' || '));
  r = await h.text('How would Coworker work inside Workfront for our campaign managers?'); await h.select(0); n = await note();
  ok(n && n.heads.join('|') === 'Good to know:' && n.know.length === 1 && !n.ask.length && !/Ask Adobe/.test(n.text), 'a question with nothing to ask Adobe shows "Good to know:" alone, with no "Ask Adobe:" heading', JSON.stringify(n && [n.heads, n.ask, n.know]));
  r = await h.text('Explain how Workfront, Brand Concierge and Sites Optimizer work together for our marketing team.'); await h.select(0); n = await note();
  ok(n && n.heads.join('|') === 'Ask Adobe:' && n.ask.length === 1 && !n.know.length && !/Good to know/.test(n.text), 'a question with only something to ask Adobe shows "Ask Adobe:" alone, with no "Good to know:" heading', JSON.stringify(n && [n.heads, n.ask, n.know]));
  ok(n && /^This catalog documents no connection between Brand Concierge and Sites Optimizer, or between .*\. Say how they work together in your own words, or ask Adobe\.$/.test(n.ask[0]) && !/confirm it with Adobe/.test(n.text), 'the note for products with no documented connection ends "or ask Adobe."', n && n.ask[0]);
  list = await h.checklist();
  ok(typed(list, 'Ask Adobe').join('|') === n.ask.join('|') && !typed(list, 'Good to know').length, 'and the checklist types that note "Ask Adobe"', JSON.stringify(list.slice(1).map(row => [row[2], row[3].slice(0, 30)])));
  await h.setStatus(0, 'used');
  const wordNc = await wordText();
  ok(/Sites Optimizer/.test(wordNc) && !NOTE_WORDS.test(wordNc), 'with that answer approved, the Word proposal carries none of the note', (wordNc.match(NOTE_WORDS) || [''])[0]);
  // the sorter (ASK_ADOBE in rfp_answers.js): no catalog prerequisite says to ask Adobe today, so two are put on the Workfront + Coworker
  // connection in the page, one in the new words and one in the old, and taken off again
  const PUT = ['Ask Adobe where the Coworker data is hosted.', 'Confirm with Adobe that the option is on.'];
  await h.eval(put => { RFP_CAT.connections.find(c => c.id === 'workfront-cw').prereqs.push(...put); }, PUT);
  r = await h.text('How would Coworker work inside Workfront for our campaign managers?'); await h.select(0); n = await note();
  const plainIn = r.questions[0].draft.plain;
  await h.setStatus(0, 'used');
  const wordIn = await wordText();
  await h.eval(put => { RFP_CAT.connections.find(c => c.id === 'workfront-cw').prereqs.splice(-put.length); }, PUT);
  ok(n && n.ask.join('|') === PUT.join('|') && n.know.length === 1 && !n.asks.some(a => NOTE_WORDS.test(a.text)) && /Workfront/.test(plainIn) && !NOTE_WORDS.test(plainIn) && /Workfront/.test(wordIn) && !NOTE_WORDS.test(wordIn),
    'a prerequisite that says to ask Adobe, in the new words ("Ask Adobe where ...") or the old ("Confirm with Adobe that ..."), goes under "Ask Adobe:" and stays out of the asks, the response and the Word proposal', JSON.stringify(n && [n.ask, n.know, n.asks.map(a => a.text).filter(x => NOTE_WORDS.test(x)), (plainIn.match(NOTE_WORDS) || [''])[0], (wordIn.match(NOTE_WORDS) || [''])[0]]));
  ok(h.errors.length === 0, 'no script errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `${fails} STEP 54 CHECK(S) FAILED` : 'ALL STEP 54 CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
