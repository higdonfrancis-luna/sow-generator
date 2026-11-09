// Cluster c7_state: reproduces the reviewers' claims about statuses, exports, state loss, the hand-off and the keyboard
// against the built prototype, through the review harness and the real UI (Playwright clicks).
// Run: node /home/user/warroom/sow/rfp_prototype/review_2026-11-09/verification/c7_state/run_c7.js
// Writes out_<claim>.json and the screenshots beside this file, and prints a condensed summary.
const fs = require('fs'), path = require('path');
const {open} = require('/home/user/warroom/sow/rfp_prototype/review_2026-11-09/harness.js');
const HERE = __dirname;
const XLSX = '/home/user/warroom/sow/qa/rfp_fixtures/bank_rfp.xlsx';
const save = (name, obj) => fs.writeFileSync(path.join(HERE, name), JSON.stringify(obj, null, 1));
const strip = s => String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const section = (html, label) => { // the <section> of the response document whose h3 starts with the label
  const m = new RegExp('<section><h3>' + label.replace('.', '\\.') + ' [\\s\\S]*?</section>').exec(html);
  return m ? m[0] : null;
};
const out = {};
const log = (k, v) => { out[k] = v; console.log('\n[' + k + '] ' + JSON.stringify(v, null, 1).slice(0, 3000)); };

(async () => {
  const h = await open();
  const page = h.page;
  // a spy on confirm() and alert(): any native dialog would show up here (Playwright auto-dismisses dialogs otherwise)
  const dialogs = [];
  page.on('dialog', d => { dialogs.push({type: d.type(), message: d.message()}); d.dismiss().catch(() => {}); });
  await page.evaluate(() => { window.__confirms = []; const c = window.confirm; window.confirm = (m) => { window.__confirms.push(m); return c.call(window, m); }; });

  const base = await h.file(XLSX);
  const idx = lab => base.questions.find(q => q.label === lab).i;
  log('baseline', {status: base.status, count: base.count, rows: base.questions.map(q => q.label + ' ' + q.kind + (q.draft ? ' lines=' + q.draft.lines.map(l => l.id).join(',') : ''))});

  // ---------- C7.1 unreviewed drafts: no statuses set
  {
    const doc = await h.doc(), rows = await h.rows();
    const intro = /<p class="intro">([\s\S]*?)<\/p>/.exec(doc);
    const tags = [...doc.matchAll(/<p class="tag">([^<]*)<\/p>/g)].map(m => m[1]);
    const secs = base.questions.filter(q => q.kind !== 'firm').map(q => { const s = section(doc, q.label); return {label: q.label, tag: s ? (/<p class="tag">([^<]*)<\/p>/.exec(s) || [])[1] : null, textChars: s ? strip(s.replace(/<h3>[\s\S]*?<\/h3>/, '').replace(/<p class="tag">[^<]*<\/p>/, '')).length : null, first300: s ? strip(s).slice(0, 300) : null}; });
    log('C7.1_unreviewed', {h1: (/<h1>([^<]*)<\/h1>/.exec(doc) || [])[1], intro: intro ? intro[1] : null, tagsInOrder: tags, adobeSections: secs,
      rowsHeader: rows.rows[0], rowStatuses: rows.rows.slice(1).map(r => [r[0], r[3], String(r[2]).length, String(r[2]).slice(0, 120)])});
    fs.writeFileSync(path.join(HERE, 'out_C7.1_unreviewed_response.html'), doc);
  }
  // ---------- C7.1 skip 2.4, then the document and the Excel rows
  {
    const i = idx('2.4');
    await h.setStatus(i, 'skipped');
    const doc = await h.doc(), rows = await h.rows();
    const s = section(doc, '2.4');
    const row = rows.rows.find(r => r[0] === '2.4');
    log('C7.1_skipped_2.4', {panelHasSkippedBadge: (await h.panel()).includes('Skipped') || null, listBadge: await page.evaluate(i => document.querySelector(`#rfp-questions li[data-i="${i}"] .rfp-state`) && document.querySelector(`#rfp-questions li[data-i="${i}"] .rfp-state`).textContent, i),
      section_tag: (/<p class="tag">([^<]*)<\/p>/.exec(s) || [])[1], section_text_chars: strip(s).length, section_first300: strip(s).slice(0, 300),
      excel_row: {number: row[0], status: row[3], responseChars: String(row[2]).length, response300: String(row[2]).slice(0, 300)}});
    fs.writeFileSync(path.join(HERE, 'out_C7.1_skipped_response.html'), doc);
    await h.setStatus(i, null);
  }
  // ---------- C7.9 the Excel header row and the Status values that occur (across states: none, used, skipped, firm written)
  {
    const iUse = idx('2.2'), iSkip = idx('2.4'), iFirm = idx('1.1');
    await h.setStatus(iUse, 'used'); await h.setStatus(iSkip, 'skipped'); await h.setAnswer(iFirm, 'We are a 40-person firm.');
    const rows = await h.rows();
    log('C7.9_rows', {header: rows.rows[0], columns: rows.rows[0].length, statusValues: [...new Set(rows.rows.slice(1).map(r => r[3]))], sourcesHeader: rows.srcs[0], sample: rows.rows.slice(1, 4).map(r => [r[0], r[1].slice(0, 60), String(r[2]).slice(0, 80), r[3]])});
    await h.setStatus(iUse, null); await h.setStatus(iSkip, null); await h.setAnswer(iFirm, '');
  }
  // ---------- C7.10 filter buttons: counts, an unreviewed filter
  {
    const filters = await page.evaluate(() => [...document.querySelectorAll('.rfp-filters button')].map(b => ({text: b.textContent, filter: b.dataset.rfpFilter || null, id: b.id || null, pressed: b.getAttribute('aria-pressed')})));
    log('C7.10_filters', {filters, anyDigitInLabels: filters.some(f => /\d/.test(f.text)), filtersAvailable: filters.map(f => f.filter).filter(Boolean)});
  }
  // ---------- C7.8 each row shows the pile twice
  {
    const rows = await page.evaluate(() => [...document.querySelectorAll('#rfp-questions li')].slice(0, 4).map(li => ({kind: li.dataset.kind, tag: li.querySelector('.rfp-tag').textContent, menuSelected: li.querySelector('select.rfp-kind').selectedOptions[0].textContent, menuOptions: [...li.querySelector('select.rfp-kind').options].map(o => o.textContent), open: li.querySelector('.rfp-open').textContent})));
    log('C7.8_pile_twice', rows);
  }
  // ---------- C7.5 keyboard: tabindex and role on rows, Enter on a focused row; the h1 of the response
  {
    const attrs = await page.evaluate(() => { const li = document.querySelector('#rfp-questions li'); return {tagName: li.tagName, tabindex: li.getAttribute('tabindex'), role: li.getAttribute('role'), hasButtonOrLink: !!li.querySelector('button,a'), focusableInside: [...li.querySelectorAll('select,button,a,[tabindex]')].map(e => e.tagName + (e.className ? '.' + e.className : ''))}; });
    // try: focus the row programmatically (without tabindex this is a no-op), press Enter, see if anything opened
    await page.evaluate(() => { RFPBuilder.state.selected = null; RFPBuilder.renderList(); document.getElementById('rfp-answer').innerHTML = '<p class="hint">Pick a question on the left to see its drafted answer.</p>'; });
    const focusTry = await page.evaluate(() => { const li = document.querySelector('#rfp-questions li[data-i="3"]'); li.focus(); return {activeIsRow: document.activeElement === li, active: document.activeElement.tagName + (document.activeElement.id ? '#' + document.activeElement.id : '')}; });
    await page.keyboard.press('Enter'); await page.waitForTimeout(120);
    const afterEnter = await page.evaluate(() => ({selected: RFPBuilder.state.selected, panel: document.getElementById('rfp-answer').textContent.slice(0, 80)}));
    // Tab through the filter row into the list: which elements receive focus (first 12 stops after the Clear button)
    await page.focus('#rfp-clear');
    const stops = [];
    for (let k = 0; k < 12; k++) { await page.keyboard.press('Tab'); stops.push(await page.evaluate(() => { const a = document.activeElement; return a.tagName + (a.id ? '#' + a.id : '') + (a.className ? '.' + String(a.className).split(' ')[0] : '') + (a.closest('#rfp-questions li') ? ' (in row ' + a.closest('li').dataset.i + ')' : ''); })); }
    // Enter and Space on a focused row's select (the only focusable thing in a row)
    await page.evaluate(() => document.querySelector('#rfp-questions li[data-i="3"] select').focus());
    await page.keyboard.press('Enter'); await page.waitForTimeout(120);
    const afterEnterOnSelect = await page.evaluate(() => ({selected: RFPBuilder.state.selected}));
    const doc = await h.doc();
    log('C7.5_keyboard', {rowAttrs: attrs, focusTry, afterEnter, tabStopsAfterClear: stops, afterEnterOnRowSelect: afterEnterOnSelect, responseH1: (/<h1>([^<]*)<\/h1>/.exec(doc) || [])[1], responseTitle: (/<title>([^<]*)<\/title>/.exec(doc) || [])[1], stateName: await h.eval(() => RFPBuilder.state.name),
      downloadNameWouldBe: await h.eval(() => ((RFPBuilder.state.name || 'RFP').replace(/\.[a-z0-9]+$/i, '').replace(/[^a-zA-Z0-9-]/g, '-').slice(0, 80) + '-response.html'))});
  }
  // ---------- C7.7 Next question from 1.1
  {
    await h.select(idx('1.1'));
    const before = await page.evaluate(() => ({selected: RFPBuilder.state.selected, label: RFPBuilder.state.questions[RFPBuilder.state.selected].label}));
    await page.click('#rfp-next'); await page.waitForTimeout(120);
    const after = await page.evaluate(() => ({selected: RFPBuilder.state.selected, label: RFPBuilder.state.questions[RFPBuilder.state.selected].label, kind: RFPBuilder.state.questions[RFPBuilder.state.selected].kind}));
    // and from the last firm question 3.3 (wraps) and with the Your firm filter on (does Next respect the filter?)
    await h.select(idx('3.3')); await page.click('#rfp-next'); await page.waitForTimeout(120);
    const from33 = await page.evaluate(() => ({label: RFPBuilder.state.questions[RFPBuilder.state.selected].label}));
    await page.click('[data-rfp-filter="firm"]'); await page.waitForTimeout(80); await h.select(idx('1.2')); await page.click('#rfp-next'); await page.waitForTimeout(120);
    const withFirmFilter = await page.evaluate(() => { const i = RFPBuilder.state.selected, li = document.querySelector(`#rfp-questions li[data-i="${i}"]`); return {filter: RFPBuilder.state.filter, selectedLabel: RFPBuilder.state.questions[i].label, selectedRowHidden: li.hidden, visibleSelectedRows: document.querySelectorAll('#rfp-questions li.sel:not([hidden])').length}; });
    await page.click('[data-rfp-filter="all"]'); await page.waitForTimeout(80);
    log('C7.7_next', {before, after, from33, withFirmFilter});
  }
  // ---------- C7.2 (a) firm text typed, Next, back: is it gone?
  {
    await h.select(idx('1.1'));
    await page.fill('#rfp-firm', 'Northbridge answer typed but not used');
    const typed = await page.inputValue('#rfp-firm');
    await page.click('#rfp-next'); await page.waitForTimeout(120);
    const landed = await page.evaluate(() => RFPBuilder.state.questions[RFPBuilder.state.selected].label);
    await h.select(idx('1.1'));
    const back = await page.inputValue('#rfp-firm');
    const qstate = await page.evaluate(i => { const q = RFPBuilder.state.questions[i]; return {answer: q.answer || null, status: q.status || null}; }, idx('1.1'));
    log('C7.2a_firm_text_lost', {typed, nextLandedOn: landed, textareaOnReturn: back, question: qstate});
    // control: Use this answer first, then the text survives
    await page.fill('#rfp-firm', 'Used firm answer'); await page.click('#rfp-firm-use'); await page.waitForTimeout(80); await page.click('#rfp-next'); await page.waitForTimeout(80); await h.select(idx('1.1'));
    out['C7.2a_control_after_use'] = {textareaOnReturn: await page.inputValue('#rfp-firm'), status: await page.evaluate(i => RFPBuilder.state.questions[i].status, idx('1.1'))};
    await h.setAnswer(idx('1.1'), '');
  }
  // ---------- C7.2 (b) Use 2.2, change the pile to firm and back
  {
    const i = idx('2.2');
    await h.select(i); await page.click('#rfp-use'); await page.waitForTimeout(80);
    const used = await page.evaluate(i => { const q = RFPBuilder.state.questions[i]; return {status: q.status, hasDraft: !!q.draft, lines: q.draft.m.lines, button: document.getElementById('rfp-use').textContent, summary: document.getElementById('rfp-summary').textContent}; }, i);
    await page.selectOption(`#rfp-questions li[data-i="${i}"] select.rfp-kind`, 'firm'); await page.waitForTimeout(80);
    const asFirm = await page.evaluate(i => { const q = RFPBuilder.state.questions[i]; return {kind: q.kind, status: q.status || null, hasDraft: !!q.draft, answer: q.answer || null, listTag: document.querySelector(`#rfp-questions li[data-i="${i}"] .rfp-tag`).textContent, listBadge: (document.querySelector(`#rfp-questions li[data-i="${i}"] .rfp-state`) || {}).textContent || null, panelStillShows: document.getElementById('rfp-answer').textContent.slice(0, 160), panelHasUsedBadge: !!document.querySelector('#rfp-answer .rfp-state.ok'), panelHasUseButton: !!document.getElementById('rfp-use'), summary: document.getElementById('rfp-summary').textContent}; }, i);
    await page.selectOption(`#rfp-questions li[data-i="${i}"] select.rfp-kind`, 'adobe'); await page.waitForTimeout(80);
    const backToAdobe = await page.evaluate(i => { const q = RFPBuilder.state.questions[i]; return {kind: q.kind, status: q.status || null, hasDraft: !!q.draft, answer: q.answer || null}; }, i);
    // the same with an edited answer: Edit, type, Save and use, then change the pile
    await h.select(i); await page.click('#rfp-edit-btn'); await page.fill('#rfp-edit', 'An edited answer the partner wrote.'); await page.click('#rfp-save-edit'); await page.waitForTimeout(80);
    const edited = await page.evaluate(i => { const q = RFPBuilder.state.questions[i]; return {status: q.status, answer: q.answer}; }, i);
    await page.selectOption(`#rfp-questions li[data-i="${i}"] select.rfp-kind`, 'unsure'); await page.waitForTimeout(80);
    const editedThenMoved = await page.evaluate(i => { const q = RFPBuilder.state.questions[i]; return {kind: q.kind, status: q.status || null, answer: q.answer || null, hasDraft: !!q.draft}; }, i);
    await page.selectOption(`#rfp-questions li[data-i="${i}"] select.rfp-kind`, 'adobe'); await page.waitForTimeout(80);
    log('C7.2b_pile_change', {afterUse: used, afterMoveToFirm: asFirm, afterMoveBackToAdobe: backToAdobe, editedAnswer: edited, editedThenMovedToUnsure: editedThenMoved});
  }
  // ---------- C7.2 (c) Clear: any confirm()? (g) beforeunload?
  {
    await h.select(idx('2.2')); await page.click('#rfp-use'); await page.waitForTimeout(60);
    const beforeClear = await page.evaluate(() => ({questions: RFPBuilder.state.questions.length, used: RFPBuilder.state.questions.filter(q => q.status === 'used').length}));
    await page.click('#rfp-clear'); await page.waitForTimeout(80);
    const afterClear = await page.evaluate(() => ({questions: RFPBuilder.state.questions.length, resultsHidden: document.getElementById('rfp-results').hidden, status: document.getElementById('rfp-status').textContent, confirms: window.__confirms, selectedStillSet: RFPBuilder.state.selected}));
    const src = fs.readFileSync('/home/user/warroom/sow/rfp_prototype/site/index.html', 'utf8');
    const handlers = await page.evaluate(() => ({onbeforeunload: window.onbeforeunload === null ? null : typeof window.onbeforeunload}));
    log('C7.2c_clear_and_g_beforeunload', {beforeClear, afterClear, dialogsSeen: dialogs, source: {confirmCalls: (src.match(/\bconfirm\(/g) || []).length, confirmContexts: [...src.matchAll(/.{60}\bconfirm\(.{40}/g)].map(m => m[0]), rfpClearMentions: (src.match(/rfp-clear/g) || []).length, beforeunload: (src.match(/beforeunload/g) || []).length}, runtime: handlers});
  }
  // ---------- C7.2 (d) reload
  {
    await h.file(XLSX); await h.select(idx('2.2')); await page.click('#rfp-use'); await page.waitForTimeout(60);
    const before = await page.evaluate(() => ({questions: RFPBuilder.state.questions.length, used: RFPBuilder.state.questions.filter(q => q.status === 'used').length, sessionKeys: Object.keys(sessionStorage), localKeys: Object.keys(localStorage)}));
    await page.reload(); await page.waitForTimeout(500);
    const after = await page.evaluate(() => ({questions: RFPBuilder.state.questions.length, resultsHidden: document.getElementById('rfp-results').hidden, hash: location.hash, sessionKeys: Object.keys(sessionStorage), localKeys: Object.keys(localStorage)}));
    log('C7.2d_reload', {before, after, dialogsSeen: dialogs.length});
  }
  // ---------- C7.2 (f) Save draft in the masthead: what the JSON holds
  {
    await h.file(XLSX); await h.select(idx('2.2')); await page.click('#rfp-use'); await page.waitForTimeout(60); await h.setAnswer(idx('1.1'), 'A firm answer in memory');
    const [dl] = await Promise.all([page.waitForEvent('download', {timeout: 15000}), page.click('#save-draft')]);
    const file = await dl.path(); const txt = fs.readFileSync(file, 'utf8'); let json = null; try { json = JSON.parse(txt); } catch (e) {}
    const src = fs.readFileSync('/home/user/warroom/sow/rfp_prototype/site/index.html', 'utf8');
    log('C7.2f_save_draft', {suggestedFilename: dl.suggestedFilename(), bytes: txt.length, topLevelKeys: json ? Object.keys(json) : null, mentionsRfp: /rfp|RFP|Northbridge|questions/.test(txt), textHasQuestionText: txt.includes('Customer Journey Analytics data to AI assistant'),
      source: {draftKey: (src.match(/const KEY='([^']+)'/) || [])[1], saveDraftHandler: (src.match(/\$\('save-draft'\)\.onclick=[^\n]{0,160}/) || [])[0], rfpStateObject: (src.match(/const rfp=\{[^}]*\};/) || [])[0], rfpInSaveDraft: /JSON\.stringify\(state[^)]*\)/.test(src) && !/state\.rfp|rfp:\s*rfp|RFPBuilder\.state/.test(src.slice(src.indexOf("$('save-draft')"), src.indexOf("$('save-draft')") + 400))}});
    fs.writeFileSync(path.join(HERE, 'out_C7.2f_saved_draft.json'), txt);
  }
  // ---------- C7.4 Used, keep it: does it toggle; per-line checkbox; edited text and the hand-off lines
  {
    await h.file(XLSX); const i = idx('2.2'); await h.select(i);
    const b0 = await page.evaluate(() => document.getElementById('rfp-use').textContent);
    await page.click('#rfp-use'); await page.waitForTimeout(60);
    const s1 = await page.evaluate(i => ({status: RFPBuilder.state.questions[i].status, button: document.getElementById('rfp-use').textContent}), i);
    await page.click('#rfp-use'); await page.waitForTimeout(60);
    const s2 = await page.evaluate(i => ({status: RFPBuilder.state.questions[i].status, button: document.getElementById('rfp-use').textContent}), i);
    await page.click('#rfp-use'); await page.waitForTimeout(60);
    const s3 = await page.evaluate(i => ({status: RFPBuilder.state.questions[i].status, button: document.getElementById('rfp-use').textContent}), i);
    const controls = await page.evaluate(() => ({buttons: [...document.querySelectorAll('#rfp-answer button')].map(b => b.id + ':' + b.textContent), checkboxes: document.querySelectorAll('#rfp-answer input[type=checkbox]').length, inputs: [...document.querySelectorAll('#rfp-answer input,#rfp-answer textarea,#rfp-answer select')].map(e => e.tagName + '.' + e.className), drawnFrom: document.querySelector('#rfp-answer .rfp-drawn').textContent, whatWeWouldDo: [...document.querySelectorAll('#rfp-answer h4')].map(h => h.textContent)}));
    // Skip after Use: the only other status
    await page.click('#rfp-skip'); await page.waitForTimeout(60);
    const afterSkip = await page.evaluate(i => ({status: RFPBuilder.state.questions[i].status, button: document.getElementById('rfp-use').textContent, summary: document.getElementById('rfp-summary').textContent}), i);
    // the hand-off after an edit: edit the 2.2 text to one sentence, Save and use, then Add to my statement of work
    await page.click('#rfp-edit-btn'); await page.fill('#rfp-edit', 'We will connect your CJA data to AI assistant traffic.'); await page.click('#rfp-save-edit'); await page.waitForTimeout(80);
    const editedQ = await page.evaluate(i => { const q = RFPBuilder.state.questions[i]; return {status: q.status, answer: q.answer, draftLines: q.draft.m.lines, draftProducts: q.draft.m.products, conn: q.draft.m.conn ? q.draft.m.conn.a + '+' + q.draft.m.conn.b : null}; }, i);
    await page.evaluate(() => { localStorage.removeItem('abv-sow-handoff'); });
    const toSowEnabled = await page.evaluate(() => !document.getElementById('rfp-to-sow').disabled);
    await page.click('#rfp-to-sow'); await page.waitForTimeout(300);
    const handoff = await page.evaluate(() => { const hnd = JSON.parse(localStorage.getItem('abv-sow-handoff') || 'null'); return hnd ? {v: hnd.v, play: hnd.play, fresh: hnd.fresh, products: hnd.products, names: hnd.names, linesOn: hnd.lines.filter(l => l.on).map(l => l.id), linesTotal: hnd.lines.length, managedCount: hnd.managed.length} : null; });
    const sowState = await page.evaluate(() => ({play: state.play, step: location.hash, customProducts: state.customProducts, onInCustom: Object.entries(state.estimates.custom || {}).filter(([k, v]) => v.on).map(([k]) => k), toast: (document.getElementById('toast') || {}).textContent}));
    log('C7.4_used_toggle_and_lines', {buttonBefore: b0, afterFirstClick: s1, afterSecondClick: s2, afterThirdClick: s3, panelControls: controls, afterSkip, editedQuestion: editedQ, toSowEnabled, handoffWritten: handoff, sowAfter: sowState, linesCarriedEqualDraftLines: JSON.stringify(handoff && handoff.linesOn.sort()) === JSON.stringify(editedQ.draftLines.slice().sort())});
  }
  // ---------- C7.3 the hand-off replaces the saved canvas without asking; fresh:true and a custom play with services
  {
    // go back to the RFP tab, same list still in memory
    await page.evaluate(() => { location.hash = '#rfp'; }); await page.click('[data-step="rfp"]'); await page.waitForTimeout(150);
    const stillThere = await page.evaluate(() => ({questions: RFPBuilder.state.questions.length, used: RFPBuilder.state.questions.filter(q => q.status === 'used').map(q => q.label)}));
    // a different saved canvas state, the shape toSow writes, with other products on and a line on
    const planted = {v: 2, play: 'custom', on: ['aemsites', 'eds', 'so'], out: ['cdn'], ls: {A01: true, A02: true}, keep: {}, rate: 275, size: 'large', months: 24, eff: null, fresh: false, cur: 'EUR', def: null, recover: ['AEM Sites', 'Edge Delivery Services']};
    await page.evaluate(p => { localStorage.setItem('abv-sow-build-v1', JSON.stringify(p)); window.__confirms = []; }, planted);
    // the SOW side: the custom play after the first hand-off holds 2.2's lines; add work of the partner's own there (another line on, edited hours) and save
    const customBefore = await page.evaluate(() => { const est = state.estimates.custom || {}; const ids = Object.keys(est); const on = ids.filter(k => est[k].on); const off = ids.find(k => !est[k].on && !/^CUSTOM/.test(k)); if (off) est[off].on = true; const first = on[0]; if (first) { est[first].hours = 999; } save(); return {playBefore: state.play, handoffAt: state.handoffAt, onBefore: Object.keys(est).filter(k => est[k].on), turnedOn: off, editedHours: first, hoursNow: first ? est[first].hours : null, custom: (state.custom || []).length}; });
    const lsBefore = await page.evaluate(() => JSON.parse(localStorage.getItem('abv-sow-build-v1')));
    // now a second hand-off with 2.1 used as well
    await h.select(idx('2.1')); await page.click('#rfp-use'); await page.waitForTimeout(60);
    await page.click('#rfp-to-sow'); await page.waitForTimeout(300);
    const lsAfter = await page.evaluate(() => JSON.parse(localStorage.getItem('abv-sow-build-v1')));
    const customAfter = await page.evaluate(() => { const est = state.estimates.custom || {}; return {play: state.play, handoffAt: state.handoffAt, onAfter: Object.keys(est).filter(k => est[k].on), confirms: window.__confirms, dialogs: 0}; });
    const hours = await page.evaluate(id => (state.estimates.custom[id] || {}).hours, customBefore.editedHours);
    log('C7.3_handoff_overwrites', {rfpListStillThere: stillThere, plantedCanvas: planted, canvasAfterHandoff: lsAfter, plantedSurvived: {on: JSON.stringify(lsAfter.on) === JSON.stringify(planted.on), rate: lsAfter.rate === planted.rate, size: lsAfter.size === planted.size, months: lsAfter.months === planted.months, cur: lsAfter.cur === planted.cur, out: JSON.stringify(lsAfter.out) === JSON.stringify(planted.out)}, confirmsDuringHandoff: customAfter.confirms, dialogsDuringRun: dialogs,
      customPlayBefore: customBefore, canvasBeforeSecondHandoff: {on: lsBefore.on, ls: lsBefore.ls}, customPlayAfter: customAfter, partnerTurnedOnLineSurvived: customAfter.onAfter.includes(customBefore.turnedOn), editedHoursSurvived: hours === 999, hoursAfter: hours});
    // what the fresh flag does in applyHandoff, from the built page
    const src = fs.readFileSync('/home/user/warroom/sow/rfp_prototype/site/index.html', 'utf8');
    out['C7.3_applyHandoff_fresh_rules'] = [...src.matchAll(/[^\n]{0,140}\bfresh\b[^\n]{0,200}/g)].map(m => m[0]).filter(s => /applyHandoff|delete state\.estimates|STARTERS|newLine\(s,false|const p=h\.play/.test(s)).slice(0, 8);
  }
  // ---------- C7.6 the prototype badge at 1500 and 390 wide
  {
    await page.click('[data-step="rfp"]'); await page.waitForTimeout(100);
    const measure = () => page.evaluate(() => { const r = s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return {x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), text: e.textContent.trim().slice(0, 60)}; }; const note = document.querySelector('.proto-note'); return {viewport: innerWidth, eyebrow: r('.topbar .eyebrow'), h1: r('#play-title'), note: r('.proto-note'), changePlay: r('.topbar [data-build]'), noteDisplay: getComputedStyle(note).display, noteMarginLeft: getComputedStyle(note).marginLeft, h1Display: getComputedStyle(document.getElementById('play-title')).display, topbarOverflowsViewport: document.querySelector('.topbar').getBoundingClientRect().right > innerWidth, docScrollWidth: document.documentElement.scrollWidth}; });
    await page.setViewportSize({width: 1500, height: 1100}); await page.waitForTimeout(150);
    const m1500 = await measure();
    await page.locator('header.topbar').screenshot({path: path.join(HERE, 'shot_C7.6_topbar_1500.png')});
    await page.screenshot({path: path.join(HERE, 'shot_C7.6_top_1500.png'), clip: {x: 0, y: 0, width: 1500, height: 260}});
    await page.setViewportSize({width: 390, height: 844}); await page.waitForTimeout(250);
    const m390 = await measure();
    await page.locator('header.topbar').screenshot({path: path.join(HERE, 'shot_C7.6_topbar_390.png')});
    await page.screenshot({path: path.join(HERE, 'shot_C7.6_top_390.png'), clip: {x: 0, y: 0, width: 390, height: 420}});
    await page.setViewportSize({width: 1500, height: 1100}); await page.waitForTimeout(150);
    log('C7.6_badge', {at1500: m1500, at390: m390, noteBelowH1_1500: m1500.note.y >= m1500.h1.y + m1500.h1.h - 2, noteLeftOffsetFromH1_1500: m1500.note.x - m1500.h1.x, noteBelowH1_390: m390.note.y >= m390.h1.y + m390.h1.h - 2, noteLeftOffsetFromH1_390: m390.note.x - m390.h1.x});
  }
  // ---------- extra: Start over and Change play, do they touch the RFP list?
  {
    await page.evaluate(() => { localStorage.removeItem('abv-sow-handoff'); });
    const before = await page.evaluate(() => RFPBuilder.state.questions.length);
    const startOverHandler = await page.evaluate(() => { const b = document.getElementById('start-over'); return b ? (b.onclick ? b.onclick.toString().slice(0, 300) : 'no onclick property (listener)') : 'no button'; });
    await page.click('#start-over'); await page.waitForTimeout(200);
    const modal = await page.evaluate(() => ({modalOpen: !!document.querySelector('.modal:not([hidden])'), modalText: (document.querySelector('.modal:not([hidden])') || {}).textContent, buttons: [...document.querySelectorAll('.modal:not([hidden]) button')].map(b => b.id + ':' + b.textContent)}));
    log('X_start_over', {questionsBefore: before, startOverHandler, modal});
    // close the modal without confirming
    await page.keyboard.press('Escape'); await page.waitForTimeout(100);
    const cancel = await page.$('.modal:not([hidden]) button:not(.primary)'); if (cancel) { await cancel.click(); await page.waitForTimeout(100); }
    out['X_start_over'].afterCancel = await page.evaluate(() => ({questions: RFPBuilder.state.questions.length, modalOpen: !!document.querySelector('.modal:not([hidden])')}));
  }
  // ---------- C7.2 (e) the Build tab: href or handler, where ../index.html goes, and what is left afterwards (last: it navigates)
  {
    await page.click('[data-step="rfp"]'); await page.waitForTimeout(100);
    const info = await page.evaluate(() => { const b = document.querySelector('.steps [data-build]'); return {tag: b.tagName, text: b.textContent, href: b.getAttribute('href'), role: b.getAttribute('role'), resolves: new URL('../index.html', location.href).href, here: location.href, questions: RFPBuilder.state.questions.length, used: RFPBuilder.state.questions.filter(q => q.status === 'used').length}; });
    const src = fs.readFileSync('/home/user/warroom/sow/rfp_prototype/site/index.html', 'utf8');
    const handler = (src.match(/document\.addEventListener\('click',e=>\{if\(e\.target\.closest\('\[data-build\]'\)\)[^\n]*/) || [])[0];
    const siteFiles = fs.readdirSync('/home/user/warroom/sow/rfp_prototype/site');
    const [nav] = await Promise.all([page.waitForNavigation({timeout: 10000}).catch(e => null), page.click('.steps [data-build]')]);
    await page.waitForTimeout(500);
    const after = await page.evaluate(() => ({url: location.href, title: document.title, hasRFPBuilder: typeof RFPBuilder !== 'undefined', questions: typeof RFPBuilder !== 'undefined' ? RFPBuilder.state.questions.length : null, confirms: window.__confirms || null}));
    log('C7.2e_build_tab', {button: info, handler, prototypeSiteFiles: siteFiles, navigated: !!nav, after, dialogs});
  }
  save('out_C7_all.json', {errors: h.errors, dialogs, results: out});
  for (const k of Object.keys(out)) save('out_' + k.replace(/[^\w.]+/g, '_') + '.json', out[k]);
  console.log('\npage errors:', JSON.stringify(h.errors));
  await h.close();
})().catch(e => { console.error(e); process.exit(1); });
