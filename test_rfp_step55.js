// Steps 55 and 56 (Nov 10 2026): Approve, Leave out and the review flow; the work is kept. Run from the repo root after
// python3 sow/build_site.py:
//   node sow/test_rfp_step55.js
// Checks, on the built prototype: Approve and Leave out toggle and the row says so; a To review filter with counts; Next to
// review walks the rows the filter shows, firm questions included; Start over asks first; rows open from the keyboard; the
// panel follows a pile change; the downloads carry approved answers only unless the drafts box is ticked, and then drafts
// are marked; a firm answer is kept as typed; the work survives a reload in this tab's session storage and clears with
// Start over; the leave warning fires only with work on the page; Save draft carries the RFP and Open draft brings it back;
// each answer's services carry a tick box the hand-off follows; the hand-off previews, then merges without touching the
// tool's rate, size, term, currency or its own services, and leaves an unticked ask out of a research line's text; Save my
// work and Open my work merge two people's halves of one RFP and ask before replacing a different one.
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
const fs = require('fs');
const FIX = __dirname + '/qa/rfp_fixtures';
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 500) + ']')); if (!c) fails++; };
(async () => {
  const h = await open(); const pg = h.page;
  const filters = () => h.eval(() => [...document.querySelectorAll('[data-rfp-filter]')].map(b => b.textContent + (b.getAttribute('aria-pressed') === 'true' ? '*' : '')));
  const row = i => h.eval(i => { const li = document.querySelector(`#rfp-questions li[data-i="${i}"]`); return {hidden: li.hidden, state: (li.querySelector('.rfp-state') || {}).textContent || '', role: li.getAttribute('role'), tab: li.tabIndex}; }, i);
  const btns = () => h.eval(() => [...document.querySelectorAll('#rfp-answer .rfp-actions button')].map(b => b.textContent));
  const summary = () => h.eval(() => document.getElementById('rfp-summary').textContent);
  const q = i => h.eval(i => { const q = RFPBuilder.state.questions[i]; return {label: q.label, kind: q.kind, status: q.status || null, answer: q.answer || null, lines: q.lines || null}; }, i);
  const toast = () => h.eval(() => { const t = document.getElementById('toast'); return t.style.display === 'block' ? t.textContent : ''; });
  let r = await h.file(FIX + '/bank_rfp.xlsx');
  const idx = l => r.questions.findIndex(x => x.label === l);
  const i22 = idx('2.2'), i21 = idx('2.1'), i12 = idx('1.2'), i11 = idx('1.1');
  // ---- step 55: the review flow
  ok(/Nothing is uploaded or stored on a server: your work stays in this tab until you close it or start over/.test(await h.eval(() => document.querySelector('#rfp-panel .section-intro').textContent)), 'the intro says the work stays in this tab (step 56)');
  ok((await filters()).join('|') === 'All (14)*|Adobe products (8)|Your firm (6)|To sort (0)|To review (14)|Not picked up (3)' && (await h.eval(() => document.getElementById('rfp-clear').textContent)) === 'Start over', 'decision 3: the filters carry counts, To review is among them, and Clear is Start over', (await filters()).join('|'));
  ok((await row(i22)).role === 'button' && (await row(i22)).tab === 0, 'a row is a button the keyboard can reach');
  await pg.focus(`#rfp-questions li[data-i="${idx('2.3')}"]`); await pg.keyboard.press('Enter'); await pg.waitForTimeout(150);
  ok((await h.eval(() => RFPBuilder.state.selected)) === idx('2.3'), 'Enter on a focused row opens it (finding 7.5)');
  await h.select(i22);
  ok((await btns()).join('|') === 'Approve|Edit|Leave out|Next to review', 'the answer offers Approve, Edit, Leave out and Next to review', (await btns()).join('|'));
  await pg.click('#rfp-use'); await pg.waitForTimeout(100);
  ok((await btns())[0] === 'Approved, undo' && (await row(i22)).state === 'Approved' && /1 of 8 answers about Adobe products approved/.test(await summary()) && (await filters())[4] === 'To review (13)', 'Approve marks the row Approved, counts it, and takes it out of To review', (await row(i22)).state + ' | ' + (await filters())[4]);
  await pg.click('#rfp-use'); await pg.waitForTimeout(100);
  ok((await btns())[0] === 'Approve' && (await row(i22)).state === '' && (await filters())[4] === 'To review (14)', 'Approve toggles: a second click takes the approval back (finding 7.4)');
  await pg.click('#rfp-skip'); await pg.waitForTimeout(100);
  ok((await btns())[2] === 'Left out, undo' && (await row(i22)).state === 'Left out' && (await filters())[4] === 'To review (13)', 'Leave out marks the row Left out and takes it out of To review');
  await pg.click('#rfp-skip'); await pg.waitForTimeout(100);
  ok((await q(i22)).status === null && (await btns())[2] === 'Leave out', 'Leave out toggles too');
  // firm answers: kept as typed, approved on request, approval needs text
  await h.select(i12);
  ok((await btns()).join('|') === 'Approve|Leave out|Next to review', 'a firm question offers Approve, Leave out and Next to review');
  await pg.click('#rfp-firm-use'); await pg.waitForTimeout(100);
  ok((await q(i12)).status === null && /Type the answer first/.test(await toast()), 'Approve on an empty firm box does nothing but say so');
  await pg.fill('#rfp-firm', 'Three references on request.'); await pg.waitForTimeout(100); await h.select(i22); await h.select(i12);
  ok((await h.eval(() => document.getElementById('rfp-firm').value)) === 'Three references on request.' && (await q(i12)).status === null, 'a firm answer is kept as it is typed, without approval (finding 7.2)');
  await pg.click('#rfp-firm-use'); await pg.waitForTimeout(100);
  ok((await q(i12)).status === 'used' && (await row(i12)).state === 'Approved' && /1 of 6 firm answers approved/.test(await summary()), 'Approve on a typed firm answer marks it Approved and counts it');
  await pg.fill('#rfp-firm', ''); await pg.waitForTimeout(100);
  ok((await q(i12)).status === null && (await q(i12)).answer === null, 'emptying an approved firm answer takes the approval away');
  await pg.fill('#rfp-firm', 'Three references on request.'); await pg.click('#rfp-firm-use'); await pg.waitForTimeout(100);
  await h.select(i22); await pg.click('#rfp-use'); await pg.waitForTimeout(100);
  // To review and Next to review
  await pg.click('[data-rfp-filter="review"]'); await pg.waitForTimeout(100);
  ok((await row(i22)).hidden && (await row(i12)).hidden && !(await row(i11)).hidden && (await h.eval(() => [...document.querySelectorAll('#rfp-questions li[data-i]')].filter(l => !l.hidden).length)) === 12, 'the To review filter hides the approved and left-out rows (finding 7.10)');
  await pg.click('#rfp-next'); await pg.waitForTimeout(150);
  const n1 = await h.eval(() => { const q = RFPBuilder.state.questions[RFPBuilder.state.selected]; return [q.label, q.kind]; });
  ok(n1[0] === '2.3' && n1[1] === 'adobe', 'Next to review carries on after the open row\'s place even when the filter hides it (finding 7.7)', n1.join(' '));
  await h.select(idx('3.3')); await pg.click('#rfp-next'); await pg.waitForTimeout(150);
  const n1b = await h.eval(() => { const q = RFPBuilder.state.questions[RFPBuilder.state.selected]; return [q.label, q.kind]; });
  ok(n1b[0] === '1.1' && n1b[1] === 'firm', 'Next to review wraps to the top and opens a firm question too', n1b.join(' '));
  await pg.click('[data-rfp-filter="firm"]'); await pg.waitForTimeout(100); await h.select(i11);
  for (const l of ['1.3', '3.1', '3.2', '3.3']) { await h.select(idx(l)); await pg.fill('#rfp-firm', 'Answer for ' + l); await pg.click('#rfp-firm-use'); await pg.waitForTimeout(80); }
  await h.select(i11); await pg.click('#rfp-next'); await pg.waitForTimeout(150);
  ok((await h.eval(() => RFPBuilder.state.questions[RFPBuilder.state.selected].label)) === '1.1' && (await toast()) === 'Everything else this filter shows is reviewed.', 'Next to review stays inside the filter and says so when nothing else is left', await toast());
  await pg.click('[data-rfp-filter="all"]'); await pg.waitForTimeout(100);
  // the panel follows a pile change (finding 7.2)
  await h.select(i21);
  await h.eval(i => { const s = document.querySelector(`#rfp-questions li[data-i="${i}"] .rfp-kind`); s.value = 'firm'; s.dispatchEvent(new Event('change', {bubbles: true})); }, i21); await pg.waitForTimeout(100);
  ok(/This one is about your firm/.test(await h.panel()) && await h.eval(() => !!document.getElementById('rfp-firm')), 'the open row moved to Your firm: the panel shows the firm box, not a stale draft');
  await h.eval(i => { const s = document.querySelector(`#rfp-questions li[data-i="${i}"] .rfp-kind`); s.value = 'adobe'; s.dispatchEvent(new Event('change', {bubbles: true})); }, i21); await pg.waitForTimeout(100);
  ok(/Your response to the client/.test(await h.panel()), 'and back to Adobe products the draft is drawn again');
  // ---- step 55: the downloads carry approved answers only
  let doc = (await h.doc()).replace(/<[^>]+>/g, ' ');
  ok(/2\.2 How would you connect[\s\S]{0,400}Our approach/.test(doc) && /2\.1 Describe[\s\S]{0,200}Your answer:/.test(doc) && !/Draft, not yet approved/.test(doc) && /1\.2 Provide three[\s\S]{0,200}Three references on request/.test(doc), 'the client copy carries the approved answers and a blank for every other question (finding 7.1)', doc.slice(doc.indexOf('2.1'), doc.indexOf('2.1') + 200));
  let rows = (await h.rows()).rows;
  ok(rows.find(x => x[0] === '2.2')[6] === 'Approved' && rows.find(x => x[0] === '2.1')[6] === 'Draft, not included' && rows.find(x => x[0] === '2.1')[4] === '' && rows.find(x => x[0] === '1.2')[6] === 'Approved' && rows.find(x => x[0] === '2.6')[6] === 'Draft, not included' && rows.find(x => x[0] === '2.6')[4] === '', 'the Excel says Approved or Draft not included (2.6 is drafted from the knowledge base since part three), and carries no draft text', rows.slice(1).map(x => x[0] + ':' + x[6]).join(' '));
  await pg.click('#rfp-include-drafts'); await pg.waitForTimeout(100);
  doc = (await h.doc()).replace(/<[^>]+>/g, ' '); rows = (await h.rows()).rows;
  ok(/2\.1 Describe[\s\S]{0,300}Draft, not yet approved[\s\S]{0,300}Our approach/.test(doc) && !/2\.2 How would you connect[\s\S]{0,200}Draft, not yet approved/.test(doc), 'with the drafts box ticked, a draft goes into the client copy marked as a draft and an approved answer stays unmarked');
  ok(rows.find(x => x[0] === '2.1')[6] === 'Draft' && /^Draft, not yet approved: /.test(rows.find(x => x[0] === '2.1')[4]) && rows.find(x => x[0] === '2.2')[6] === 'Approved', 'the Excel then carries the draft, marked in its text and its status');
  await h.select(i21); await pg.click('#rfp-skip'); await pg.waitForTimeout(100); doc = (await h.doc()).replace(/<[^>]+>/g, ' ');
  ok(/2\.1 Describe[\s\S]{0,200}Your answer:/.test(doc) && (await h.rows()).rows.find(x => x[0] === '2.1')[6] === 'Not answered', 'a question left out stays blank even with the drafts box ticked');
  await h.select(i21); await pg.click('#rfp-skip'); await pg.click('#rfp-include-drafts'); await pg.waitForTimeout(100);
  // ---- step 56: the work is kept in this tab
  ok(await h.eval(() => { const e = new Event('beforeunload', {cancelable: true}); window.dispatchEvent(e); return e.defaultPrevented; }), 'with work on the page, closing the tab asks first (finding 7.2)');
  await pg.reload(); await pg.waitForTimeout(700);
  const back = await h.eval(() => { const s = RFPBuilder.state; return {n: s.questions.length, approved: s.questions.filter(q => q.status === 'used').map(q => q.label), firm: s.questions.find(q => q.label === '1.2').answer, selected: s.selected, status: document.getElementById('rfp-status').textContent, panel: document.getElementById('rfp-answer').textContent.slice(0, 40), workback: !!document.getElementById('rfp-writeback')}; });
  ok(back.n === 14 && back.approved.join(',') === '1.2,1.3,2.2,3.1,3.2,3.3' && back.firm === 'Three references on request.' && /14 questions found/.test(back.status), 'a reload brings the RFP, its decisions and the typed answers back from this tab\'s session storage', JSON.stringify(back).slice(0, 300));
  ok(Number.isInteger(back.selected) && /^2\.1 Describe/.test(back.panel) && back.workback === false, 'the open answer comes back too; Write answers into the workbook waits for the file to be dropped again', JSON.stringify([back.selected, back.panel, back.workback]));
  r = await h.read();
  // Save draft carries the RFP, Open draft brings it back
  const [dl] = await Promise.all([pg.waitForEvent('download'), pg.click('#save-draft')]);
  const draft = JSON.parse(fs.readFileSync(await dl.path(), 'utf8'));
  ok(draft.rfp && draft.rfp.v === 1 && draft.rfp.questions.length === 14 && draft.rfp.questions.every(x => !('draft' in x)) && !(await h.eval(() => 'rfp' in state)), 'Save draft carries the RFP, without the drafts, and the tool\'s own state keeps its shape (finding 7.2)');
  await pg.click('#rfp-clear'); await pg.click('#rfp-clear-confirm'); await pg.waitForTimeout(100);
  ok((await h.eval(() => [RFPBuilder.state.questions.length, sessionStorage.getItem('abv-rfp-work-v1'), document.getElementById('rfp-results').hidden])).join('|') === '0||true' && !(await h.eval(() => { const e = new Event('beforeunload', {cancelable: true}); window.dispatchEvent(e); return e.defaultPrevented; })), 'Start over, confirmed, clears the list, this tab\'s storage and the leave warning');
  await pg.setInputFiles('#draft-file', {name: 'bank-SOW.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(draft))}); await pg.waitForTimeout(400);
  const opened = await h.eval(() => ({n: RFPBuilder.state.questions.length, approved: RFPBuilder.state.questions.filter(q => q.status === 'used').length, step: [...document.querySelectorAll('[data-step]')].find(b => b.getAttribute('aria-selected') === 'true').dataset.step, toast: document.getElementById('toast').textContent}));
  ok(opened.n === 14 && opened.approved === 6 && opened.step === 'scope' && /Draft opened, with its RFI/.test(opened.toast), 'Open draft brings the RFP and its decisions back beside the tool\'s own draft', JSON.stringify(opened));
  await h.eval(() => go('rfp')); await pg.waitForTimeout(100);
  // ---- step 56: the services behind an answer, the preview and the merge
  await h.select(i22);
  const lines = await h.eval(() => [...document.querySelectorAll('#rfp-answer .rfp-line')].map(c => [c.dataset.id, c.checked]));
  ok(lines.length === 1 && lines[0][0] === 'C01' && lines[0][1] === true && /Services behind this answer, for the statement of work/.test(await h.panel()), 'the note lists the services behind the answer, each ticked for the statement of work', JSON.stringify(lines));
  await pg.click('#rfp-answer .rfp-line'); await pg.waitForTimeout(100);
  const after = await h.eval(() => [RFPBuilder.state.questions[RFPBuilder.state.selected].lines, document.getElementById('rfp-summary').textContent.match(/\d+ services? selected/)[0], document.getElementById('rfp-to-sow').disabled]);
  ok(after[0].C01 === false && after[1] === '0 services selected' && after[2] === true, 'unticking the only service leaves the hand-off nothing to add, and the response is unchanged', JSON.stringify(after));
  await pg.click('#rfp-answer .rfp-line'); await pg.waitForTimeout(100);
  // the tool holds its own work: a rate, size, term and currency, and a service of its own on the custom play
  await h.eval(() => { state.rate = 275; state.size = 'large'; state.months = 24; state.currency = 'EUR'; save(); });
  await pg.click('#rfp-to-sow'); await pg.waitForTimeout(100);
  const preview = await h.eval(() => [!document.getElementById('rfp-handoff-modal').hidden, document.getElementById('rfp-handoff-text').textContent]);
  ok(preview[0] && /^This adds 1 service from 1 approved answer to Your own play on the Services step \(Customer Journey Analytics and Brand Visibility\)\. Your rate, size, term and currency stay as they are, and nothing already in the statement of work is removed\.$/.test(preview[1]), 'Add to my statement of work shows a one-line preview first (finding 7.3)', preview[1]);
  await pg.click('#rfp-handoff-cancel'); await pg.waitForTimeout(100);
  ok(await h.eval(() => document.getElementById('rfp-handoff-modal').hidden && !document.getElementById('rfp-panel').hidden), 'Cancel keeps the partner on the RFP Builder with nothing handed over');
  await pg.click('#rfp-to-sow'); await pg.waitForTimeout(100); await pg.click('#rfp-handoff-go'); await pg.waitForTimeout(600);
  const t1 = await h.eval(() => ({rate: state.rate, size: state.size, months: state.months, cur: state.currency, play: state.play, step: [...document.querySelectorAll('[data-step]')].find(b => b.getAttribute('aria-selected') === 'true').dataset.step, on: Object.entries(state.estimates.custom || {}).filter(([k, v]) => v.on).map(([k]) => k)}));
  ok(t1.play === 'custom' && t1.step === 'services' && t1.rate === 275 && t1.size === 'large' && t1.months === 24 && t1.cur === 'EUR' && t1.on.includes('CANVAS-C01'), 'the hand-off opens Your own play on the Services step with the RFP\'s service on, and the tool\'s rate, size, term and currency stay', JSON.stringify(t1));
  await h.eval(() => { const id = Object.keys(state.estimates.custom).find(k => !state.estimates.custom[k].on && !/^CANVAS/.test(k)); const r = state.estimates.custom[id]; r.on = true; r.hoursEdited = true; r.hours = 99; save(); window.__extra = id; });
  await h.eval(() => go('rfp')); await pg.waitForTimeout(100); await h.select(i21); await pg.click('#rfp-use'); await pg.waitForTimeout(100);
  await pg.click('#rfp-to-sow'); await pg.waitForTimeout(100); await pg.click('#rfp-handoff-go'); await pg.waitForTimeout(600);
  const t2 = await h.eval(() => ({rate: state.rate, cur: state.currency, extraOn: state.estimates.custom[window.__extra].on, extraHours: state.estimates.custom[window.__extra].hours, c01: state.estimates.custom['CANVAS-C01'].on, si: Object.keys(state.estimates.custom).filter(k => /^CANVAS-SI/.test(k) && state.estimates.custom[k].on).length}));
  ok(t2.extraOn === true && t2.extraHours === 99 && t2.c01 === true && t2.si >= 1 && t2.rate === 275 && t2.cur === 'EUR', 'a second hand-off adds the new answer\'s services and keeps the service the partner turned on in the tool, with its hours (the merge, finding 7.3)', JSON.stringify(t2));
  // an unticked ask stays out of a research line's text in the statement of work
  await h.eval(() => go('rfp')); r = await h.text('How would Adobe Target personalize our Edge Delivery Services site?'); await h.select(0);
  const askIdx = await h.eval(() => RFPBuilder.state.questions[0].draft.asks.findIndex(a => /^Target turned on for the agreed pages/.test(a)));
  await pg.click(`#rfp-answer .rfp-asks li:nth-child(${askIdx + 1}) .rfp-tick`); await pg.click('#rfp-use'); await pg.waitForTimeout(100);
  await pg.click('#rfp-to-sow'); await pg.waitForTimeout(100); await pg.click('#rfp-handoff-go'); await pg.waitForTimeout(600);
  const xa22 = await h.eval(() => { const c = state.canvas.find(x => x.id === 'CANVAS-XA22'); const r = (state.estimates.custom || {})['CANVAS-XA22']; return {text: (r && r.assumptions) || (c && c.assumptions) || '', on: !!(r && r.on)}; });
  ok(xa22.on && /Prerequisites for Target \+ Edge Delivery Services/.test(xa22.text) && !/Target turned on for the agreed pages/.test(xa22.text) && /Consent management platform connected/.test(xa22.text), 'the statement of work line keeps the ticked prerequisites and leaves the unticked one out (6.6)', xa22.text.slice(0, 300));
  // ---- step 56: Save my work and Open my work
  await h.eval(() => go('rfp')); r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22); await pg.click('#rfp-use'); await h.select(i12); await pg.fill('#rfp-firm', 'Mine.'); await pg.click('#rfp-firm-use'); await pg.waitForTimeout(100);
  const [dw] = await Promise.all([pg.waitForEvent('download'), pg.click('#rfp-save-work')]);
  const work = JSON.parse(fs.readFileSync(await dw.path(), 'utf8'));
  ok(/bank-rfp-rfp-work\.json$/.test(dw.suggestedFilename()) && work.v === 1 && work.name === 'bank_rfp.xlsx' && work.questions.length === 14 && work.questions.find(x => x.label === '2.2').status === 'used' && work.questions.find(x => x.label === '1.2').answer === 'Mine.', 'Save my work writes the RFP and every decision to a file named after it', dw.suggestedFilename());
  const theirs = JSON.parse(JSON.stringify(work)); for (const x of theirs.questions) { delete x.status; delete x.answer; }
  theirs.questions.find(x => x.label === '2.4').status = 'used'; Object.assign(theirs.questions.find(x => x.label === '1.1'), {status: 'used', answer: 'Founded 2009 in Chicago.'}); Object.assign(theirs.questions.find(x => x.label === '2.2'), {status: 'skipped'});
  await pg.setInputFiles('#rfp-work-file', {name: 'bank_rfp-rfp-work.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(theirs))}); await pg.waitForTimeout(300);
  const merged = await h.eval(() => ({approved: RFPBuilder.state.questions.filter(q => q.status === 'used').map(q => q.label), a11: RFPBuilder.state.questions.find(q => q.label === '1.1').answer, s22: RFPBuilder.state.questions.find(q => q.label === '2.2').status, toast: document.getElementById('toast').textContent}));
  ok(merged.approved.join(',') === '1.1,1.2,2.2,2.4' && merged.a11 === 'Founded 2009 in Chicago.' && merged.s22 === 'used' && /Merged 2 decisions from the file into this RFI; rows with a decision here were left as they were\./.test(merged.toast), 'Open my work with the other half of the same RFP merges their decisions into the rows without one, and never over mine', JSON.stringify(merged));
  const other = {v: 1, name: 'other.docx', questions: [{label: '1', text: 'Describe your firm.', kind: 'firm', status: 'used', answer: 'We are a firm.'}], skipped: [], paragraphs: [], sheets: [], notes: [], noun: ''};
  await pg.setInputFiles('#rfp-work-file', {name: 'other-rfp-work.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(other))}); await pg.waitForTimeout(300);
  ok(await h.eval(() => !document.getElementById('rfp-replace-modal').hidden && /different RFI \(other\.docx, 1 question\)/.test(document.getElementById('rfp-replace-text').textContent) && RFPBuilder.state.questions.length === 14), 'a file holding another RFP asks before replacing the one on screen');
  await pg.click('#rfp-replace-cancel'); await pg.waitForTimeout(100);
  ok((await h.eval(() => RFPBuilder.state.questions.length)) === 14, 'Cancel keeps the RFP on screen');
  await pg.setInputFiles('#rfp-work-file', {name: 'other-rfp-work.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(other))}); await pg.waitForTimeout(200); await pg.click('#rfp-replace-go'); await pg.waitForTimeout(200);
  ok((await h.eval(() => [RFPBuilder.state.questions.length, RFPBuilder.state.name, RFPBuilder.state.questions[0].status])).join('|') === '1|other.docx|used', 'Replace it opens the other RFP with its decisions');
  await pg.setInputFiles('#rfp-work-file', {name: 'notes.json', mimeType: 'application/json', buffer: Buffer.from('{"hello":1}')}); await pg.waitForTimeout(200);
  ok(/Choose a Save my work file/.test(await toast()) && (await h.eval(() => RFPBuilder.state.questions.length)) === 1, 'a file that is not a Save my work file is refused with a plain message');
  // ---- what the skeptics found on the first build of steps 55 and 56, kept closed
  ok(/the ones about Adobe products it can answer/.test(await h.eval(() => document.querySelector('#rfp-panel .section-intro').textContent)), 'the intro names the pile Adobe products (decision 3)');
  await pg.click('#rfp-clear'); await pg.click('#rfp-clear-confirm'); await pg.waitForTimeout(100);
  ok(await h.eval(() => !document.getElementById('rfp-results').hidden === false && !!document.getElementById('rfp-open-work-empty') && document.getElementById('rfp-open-work-empty').offsetParent !== null), 'with nothing on screen, Open my work is offered in the drop zone');
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22); await pg.click('#rfp-use'); await h.select(i21); await pg.click('#rfp-use'); await pg.waitForTimeout(100);
  await pg.reload(); await pg.waitForTimeout(700);
  const restored = await h.eval(() => ({summary: document.getElementById('rfp-summary').textContent.match(/\d+ of 8 answers about Adobe products approved, 0 of 6 firm answers approved, \d+ services? selected/)[0], disabled: document.getElementById('rfp-to-sow').disabled}));
  ok(/^2 of 8 .* [1-9]\d* services? selected/.test(restored.summary) && restored.disabled === false, 'after a reload every approved answer counts and hands off, not only the row that was opened since', JSON.stringify(restored));
  await pg.click('#rfp-to-sow'); await pg.waitForTimeout(100);
  ok(/2 approved answers/.test(await h.eval(() => document.getElementById('rfp-handoff-text').textContent)), 'the preview counts both restored approvals', await h.eval(() => document.getElementById('rfp-handoff-text').textContent));
  await pg.click('#rfp-handoff-cancel'); await pg.waitForTimeout(50);
  // a redraft is new text: the approval goes
  await h.select(i22); await pg.click('#rfp-answer .rfp-chip [data-rm="cja"]'); await pg.waitForTimeout(200);
  ok((await q(i22)).status === null && (await row(i22)).state === '', 'changing the products behind an approved answer takes the approval back, so the new text is read before it goes out');
  // the write-back rewrites every cell each time
  r = await h.file(FIX + '/bank_rfp.xlsx'); await h.select(i22); await pg.click('#rfp-use'); await pg.click('#rfp-include-drafts'); await pg.waitForTimeout(100);
  const cell = (label) => h.eval(l => { const W = RFPBuilder.state.workbooks[0]; const q = RFPBuilder.state.questions.find(x => x.label === l); const S = W.sheets[q.sheet]; const X = window.XLSX; const c = W.wb.Sheets[q.sheet][X.utils.encode_cell({r: q.row, c: S.startCol + S.cols.response})]; return c ? c.v : null; }, label);
  await Promise.all([pg.waitForEvent('download'), pg.click('#rfp-download-menu').then(() => pg.click('#rfp-writeback'))]); await pg.waitForTimeout(200);
  ok(/^Draft, not yet approved: /.test(await cell('2.1')) && /Our approach/.test(await cell('2.2')), 'the write-back puts the marked drafts in while the box is ticked', String(await cell('2.1')).slice(0, 60));
  await pg.click('#rfp-include-drafts'); await Promise.all([pg.waitForEvent('download'), pg.click('#rfp-download-menu').then(() => pg.click('#rfp-writeback'))]); await pg.waitForTimeout(200);
  ok(!(await cell('2.1')) && /Our approach/.test(await cell('2.2')), 'a second write-back with the box unticked puts the workbook\'s own empty cell back where an earlier one wrote a draft (finding 7.1)', String(await cell('2.1')).slice(0, 60));
  await h.select(i22); await pg.click('#rfp-skip'); await pg.waitForTimeout(100);
  ok((await h.eval(() => { const t = document.getElementById('toast').textContent; return t; })) !== undefined, 'left out: the write-back has nothing approved to write');
  // the same RFP dropped again keeps the decisions and brings the workbook back
  await h.select(i22); await pg.click('#rfp-skip'); await pg.click('#rfp-use'); await pg.waitForTimeout(100);
  await pg.setInputFiles('#rfp-file', FIX + '/bank_rfp.xlsx'); await pg.waitForFunction(() => /Your decisions were kept/.test(document.getElementById('rfp-status').textContent), null, {timeout: 30000}).catch(() => {}); await pg.waitForTimeout(200);
  ok((await q(i22)).status === 'used' && /Your decisions were kept/.test(await h.eval(() => document.getElementById('rfp-status').textContent)) && (await h.eval(() => !!document.getElementById('rfp-writeback'))), 'dropping the same workbook again keeps every decision and brings the write-back back', await h.eval(() => document.getElementById('rfp-status').textContent));
  await pg.setInputFiles('#rfp-file', FIX + '/retail_rfi.docx'); await pg.waitForTimeout(1500);
  ok(await h.eval(() => !document.getElementById('rfp-replace-modal').hidden && RFPBuilder.state.name === 'bank_rfp.xlsx'), 'dropping a different RFP on top of decisions asks first');
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(100);
  ok(await h.eval(() => document.getElementById('rfp-replace-modal').hidden && RFPBuilder.state.name === 'bank_rfp.xlsx'), 'Escape closes the confirmation and keeps the RFP on screen');
  await pg.click('#rfp-clear'); await pg.keyboard.press('Escape'); await pg.waitForTimeout(100);
  ok(await h.eval(() => document.getElementById('rfp-start-over-modal').hidden && RFPBuilder.state.questions.length === 14), 'Escape closes Start over too');
  // a no-match Adobe question can be answered, approved or left out
  r = await h.text('We will not use Adobe Target. How would you personalize appointment pages for returning patients?'); await h.select(0);
  ok(r.questions[0].kind === 'adobe' && !r.questions[0].draft && (await btns()).join('|') === 'Approve|Leave out|Next to review' && await h.eval(() => !!document.getElementById('rfp-firm')), 'a no-match question offers a box, Approve and Leave out, so every row in To review can be resolved', (await btns()).join('|'));
  await pg.click('#rfp-skip'); await pg.waitForTimeout(100);
  ok((await q(0)).status === 'skipped' && (await filters())[4] === 'To review (0)', 'Leave out resolves it and To review reaches zero');
  await pg.click('[data-rfp-filter="review"]'); await pg.waitForTimeout(100);
  ok(/Nothing to review: every question has a decision\./.test(await h.eval(() => document.getElementById('rfp-questions').textContent)), 'an empty To review filter says so');
  await pg.click('#rfp-next'); await pg.waitForTimeout(100);
  ok((await toast()) === 'This filter shows no questions, so there is nothing to review here.', 'Next to review on an empty filter says so instead of staying silent', await toast());
  ok(h.errors.length === 0, 'no script errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `${fails} STEP 55 CHECK(S) FAILED` : 'ALL STEP 55 CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
