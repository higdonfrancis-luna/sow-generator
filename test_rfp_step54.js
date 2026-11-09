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
  ok(n && /Notes for you, not for the client/.test(n.text) && /Internal\. Nothing in this box goes into the downloads, except what you tick or type\./.test(n.text), 'the note says it is internal, except what the partner ticks or types', n && n.text.slice(0, 200));
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
  // 6.5 after Edit, the note says ticks and notes no longer change the answer
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22);
  await h.page.click('#rfp-edit-btn'); await h.page.fill('#rfp-edit', 'Our own words for 2.2.'); await h.page.click('#rfp-save-edit'); await h.page.waitForTimeout(150);
  n = await note();
  ok(n && /You edited this answer, so ticks and what you type here no longer change it\. Edit it again to add them\./.test(n.text), 'after an edit the note says the ticks and notes no longer change the answer', n && n.text.slice(0, 300));
  // the downloads: the response carries the two client sections and none of the note; the checklist carries all four lists
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22);
  await h.page.click('#rfp-answer .rfp-asks li:nth-child(3) .rfp-tick'); await h.page.fill('#rfp-answer .rfp-asks li:nth-child(1) .rfp-fact', 'Akamai serves both sites.'); await h.page.waitForTimeout(150);
  const doc = (await h.doc()).replace(/<[^>]+>/g, ' ');
  ok(doc.includes(HAVE) && /CDN access logs: Akamai serves both sites\./.test(doc) && doc.includes(NEED) && /full URL field/.test(doc) && !/CJA administrator who adds/.test(doc.split(NEED)[1].split('Adobe sources')[0]), 'the downloaded response carries the typed fact and the ticked asks, not the unticked one', doc.slice(doc.indexOf(HAVE), doc.indexOf(HAVE) + 400));
  ok(!/Notes for you|Ask your client|Adobe licenses this proposal|Confirm with Adobe|Assumptions behind|Internal\./.test(doc), 'the downloaded response carries nothing else from the note');
  const asks = await h.asks();
  ok(/Adobe licenses this proposal includes \(Adobe quotes them\)/.test(asks) && /Ask your client<\/h4>/.test(asks) && /Confirm with Adobe<\/h4>/.test(asks) && /Assumptions behind this answer<\/h4>/.test(asks), 'the checklist download has the four lists', asks.length + ' bytes');
  ok(/Client says: <\/b>Akamai serves both sites\./.test(asks) && /In the response as what we would need from you/.test(asks) && /Not in the response/.test(asks) && /Will confirm with the client/.test(asks), 'the checklist marks each ask as answered, in the response or not in the response', asks.slice(asks.indexOf('Ask your client'), asks.indexOf('Ask your client') + 600));
  ok(!/\bthe Client\b(?! ID)/.test(asks.replace(/<[^>]+>/g, ' ')), 'the checklist speaks to the partner (your client), never of the Client');
  ok(/Nothing here is in the downloaded response except the items you ticked/.test(asks), 'the checklist\'s intro says what does reach the response');
  const rows = (await h.rows()).rows, r22 = rows.find(x => x[0] === '2.2');
  ok(r22 && r22[4].includes(HAVE) && r22[4].includes(NEED) && /CDN access logs: Akamai serves both sites\./.test(r22[4]), 'the Excel row carries both client sections', r22 && r22[4].slice(-300));
  // the ticks and notes survive moving between questions
  await h.select(i22 + 1); await h.select(i22); n = await note();
  ok(n.asks[2].ticked === false && n.asks[0].badge === 'Answered by your note below', 'ticks and typed notes are kept when the partner moves to another question and back', JSON.stringify([n.asks[2].ticked, n.asks[0].badge]));
  ok(h.errors.length === 0, 'no script errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `${fails} STEP 54 CHECK(S) FAILED` : 'ALL STEP 54 CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
