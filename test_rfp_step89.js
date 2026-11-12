// RFI Builder step 89 (Nov 12 2026), from the insurer RFP. Fix 3 (Adam: "fix number 3"): no part of an RFI goes missing without a word. A test RFP
// read seven times lost its second half twice: the reader's reply came back with no line in the tab layout, the worker called
// that "nothing to answer" and the page left the part out. Now the worker reads pipes, runs of spaces and a written-out \t
// too, and the page tries an empty part again and, if it is still empty, names it in the closing message and under Not
// picked up. Then (Adam: "B, yes on 1,2,4 and 5"): the button is Build with Adobe RFI Agent, a third smaller; each answer takes its
// own section's word limit or its row's Word limit column; a response form keeps its rows and goes straight to writing; a question
// that names no product is written from its section's products (or the RFI's), never one the client rules out, and never a firm
// question; no sentence defers a point to Adobe. The reader and the writer are stubbed (no call leaves this machine); the insurer
// PDF's reading is a real one saved from the live reader (demo/cedar_pdf_ai_reading.json); the worker is checked as text.
// Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_step89.js
const fs = require('fs'), path = require('path');
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 500) + ']')); if (!c) fails++; };
const W = fs.readFileSync(path.join(__dirname, 'ai_reading/warroom-assistant-worker.js'), 'utf8');
const readItems = new Function(W.slice(W.indexOf('const READ_KIND'), W.indexOf("// Bedrock's streaming reply")) + ';return readItems;')();
const HEAD = ['Request for Proposal: Forms Modernization', 'The Division is replacing its forms software with AEM Forms.'];
const para = i => 'Requirement ' + i + '. The contractor must convert legacy form number ' + i + ' to an adaptive form in AEM Forms, test it with Division staff, and document the result for the forms team before acceptance.';
const LONG = [...HEAD, ...Array.from({length: 120}, (_, i) => para(i + 1))].join('\n\n');
const DEMO = path.join(__dirname, 'rfp_prototype/demo/Cedar_Prairie_Mutual_Insurance_Company'), READING = JSON.parse(fs.readFileSync(path.join(__dirname, 'rfp_prototype/demo/cedar_pdf_ai_reading.json'), 'utf8'));
(async () => {
  // 1. the worker's reader
  const r = s => readItems(s);
  ok(r('A\tB.1\tBuild the site.\nF\tA.1\tFirm overview.\nN\t\tAn attachment is missing.').items.length === 2 && r('N\t\tAn attachment is missing.').notes[0] === 'An attachment is missing.', 'the tab layout reads as before, notes included');
  ok(r('| A | C.2 | Describe the program. |\n|---|---|---|\n| Kind | Ref | Text |').items.map(x => x.ref + ':' + x.kind).join() === 'C.2:adobe', 'a reply laid out with pipes is read, and a table\'s header and rule lines are not items');
  ok(r('A  D.1  Describe how you would implement Customer Journey Analytics.').items[0].ref === 'D.1', 'a reply laid out with runs of spaces is read');
  ok(r('A\\tE.1\\tWhere is it hosted?').items[0].text === 'Where is it hosted?', 'a reply with a written-out \\t is read');
  ok(r('```\n- A\tB.2\tMigrate the Drupal site.\n```').items.length === 1, 'code fences and bullets do not hide an item');
  ok(r('There are no requirements in this part.\nA short sentence that begins with A and goes on.').items.length === 0, 'a sentence of prose is not read as an item');
  ok(/const \{ items, notes \} = readItems\(got\.text\);/.test(W) && (W.match(/function readItems/g) || []).length === 1, 'the reading route uses it');

  // 2. the page: an empty part is tried again, then named
  const h = await open(), p = h.page, URL = 'https://warroom-assistant.adam-d1a.workers.dev/rfi/read';
  let calls = [], mode = 'ok', seen = {};
  await p.route(URL, async route => { const b = JSON.parse(route.request().postData()); calls.push(b); const k = b.part || 1; seen[k] = (seen[k] || 0) + 1;
    await new Promise(x => setTimeout(x, 80));
    if (mode === 'cedar') { const part = READING.parts.find(x => x.part === k) || {items: [], notes: []}; return route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({items: part.items, notes: part.notes})}); }
    if (k === 2 && (mode === 'empty' || (mode === 'once' && seen[k] === 1))) return route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({error: 'The AI model found nothing to answer in this document.'})});
    const first = (b.text.match(/Requirement (\d+)\./) || [])[1] || '0';
    return route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({items: [{kind: 'adobe', ref: 'Part ' + k, text: 'Convert the forms from requirement ' + first + ' on to adaptive forms in AEM Forms.'}], notes: []})}); });
  const run = async () => { calls = []; seen = {}; await p.click('#rfp-ai'); await p.waitForFunction(() => /Undo AI reading|Build with Adobe RFI Agent/.test(document.getElementById('rfp-ai').textContent) && !document.getElementById('rfp-ai').disabled, null, {timeout: 30000}); await p.waitForTimeout(150); };
  const undo = async () => { if (/Undo AI reading/.test(await p.textContent('#rfp-ai'))) { await p.click('#rfp-ai'); await p.waitForTimeout(150); const y = await p.$('#rfp-replace-go'); if (y && await y.isVisible()) await y.click(); await p.waitForTimeout(150); } };
  const toast = () => p.$eval('#toast', t => t.textContent), labels = () => h.eval(() => RFPBuilder.state.questions.map(q => q.label));
  await h.text(LONG, 'long_rfp.txt');
  const N = Math.max(...(await (async () => { mode = 'ok'; await run(); return calls.map(c => c.parts || 1); })()));
  ok(N >= 2 && (await labels()).length === N && !/came back empty/.test(await toast()), 'a long RFI is read in ' + N + ' parts, and with every part read there is no message about it', (await labels()).join());
  await undo(); mode = 'once'; await run();
  ok(calls.filter(c => c.part === 2).length === 2 && (await labels()).length === N && !/came back empty/.test(await toast()), 'a part that comes back empty once is tried again, and the reading is whole', calls.map(c => c.part).join());
  await undo(); mode = 'empty'; await run();
  const t = await toast(), notes = await h.eval(() => RFPBuilder.state.skipped.filter(x => x.reason === 'A note from the AI reading').map(x => x.text));
  ok(calls.filter(c => c.part === 2).length === 2 && (await labels()).length === N - 1 && (await labels()).every(l => l !== 'Part 2'), 'a part that comes back empty twice is left out and the others are kept', calls.map(c => c.part).join() + ' ' + (await labels()).join());
  ok(new RegExp('^Part 2 of ' + N + ' of this RFI came back empty from the AI reading \\(it starts "Requirement \\d+\\. The contractor must convert legacy form…"\\)\\. Check its questions yourself, or undo the AI reading and build the answers again\\. Check the list against the document').test(t), 'the closing message names the part, the words it starts with, and what to do', t);
  ok(notes.length === 1 && /^Part 2 of \d+ of this RFI came back empty/.test(notes[0]), 'the same note stays under Not picked up after the message is gone', notes.join(' | '));
  ok(!/[—–]/.test(t + notes.join('')), 'no dashes in what the partner reads');
  await undo(); mode = 'ok';

  // 3. the button (Adam: "B" to sow/mockups/nov12_rfi_agent/button_options.png)
  const bb = await p.$eval('#rfp-ai', b => { const r = b.getBoundingClientRect(), s = getComputedStyle(b); return {t: b.textContent, h: Math.round(r.height), radius: s.borderTopLeftRadius, fs: s.fontSize}; });
  ok(bb.t === 'Build with Adobe RFI Agent' && bb.h >= 40 && bb.h <= 50 && bb.radius === '28px' && bb.fs === '16px', 'the button is named Build with Adobe RFI Agent and is a third smaller (44 pixels, 16-pixel words)', JSON.stringify(bb));

  // the writer, stubbed: an answer built from the request, with one sentence that defers a point to Adobe
  const WRITE = 'https://warroom-assistant.adam-d1a.workers.dev/rfi/answer', wrote = [];
  await p.route(WRITE, async route => { const b = JSON.parse(route.request().postData()); wrote.push(b); const sv = b.services.find(x => x.matched) || b.services[0];
    return route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({model: 'claude-opus-5-5', data: {sections: [
      {heading: 'Our approach', items: ['We start from your own plan for ' + (b.ref || 'this requirement') + ', with your team.']},
      {heading: 'How we would do it', items: ['Run a discovery workshop with your team.', 'Deliver the agreed work in stages.', 'Brand Concierge: we will get its hosting region from Adobe in writing before you sign.', 'Before you sign, we will obtain Adobe\'s written data-use terms.', 'Test each stage with your reviewers.']},
      {heading: 'What you get', items: ['A signed-off plan and a tested build.']}], services: sv ? [sv.id] : [], sources: [1]}})}); });
  const pressed = async () => { await p.click('#rfp-ai'); await p.waitForFunction(() => !document.getElementById('rfp-ai').disabled && /Undo AI reading|Build with Adobe RFI Agent/.test(document.getElementById('rfp-ai').textContent), null, {timeout: 60000}); await p.waitForTimeout(200); };
  const limits = refs => h.eval(r => r.map(x => { const q = RFPBuilder.state.questions.find(y => y.label === x); const l = q && RFPAnswers.limitOf(q); return x + ':' + (l ? l.max : '-'); }).join(' '), refs);

  // 4. fixes 1 and 2 on the client's response form
  await h.file(DEMO + '_Response_Form.xlsx');
  const formRefs = await labels();
  ok(formRefs.length === 39 && await limits(['A.1', 'B.1', 'C.3', 'D.2', 'E.1', 'F.2', 'G.1']) === 'A.1:200 B.1:300 C.3:250 D.2:250 E.1:150 F.2:200 G.1:250', 'on the response form each answer takes its own row\'s Word limit (200, 300, 250, 150 by section)', await limits(['A.1', 'B.1', 'C.3', 'D.2', 'E.1', 'F.2', 'G.1']));
  ok(await h.eval(() => RFPBuilder.state.questions.find(q => q.label === 'C.2').kind) === 'adobe', 'C.2, "how Cedar Prairie appears in AI-generated answers", is an Adobe question (Brand Visibility); it was To sort');
  await h.select(await h.eval(() => RFPBuilder.state.questions.findIndex(q => q.label === 'B.3'))); await p.click('#rfp-use'); await p.waitForTimeout(150);
  calls = []; wrote.length = 0; await pressed();
  const sentRefs = [...new Set(wrote.map(b => b.ref))];
  ok(calls.length === 0 && !await p.isVisible('#rfp-replace-modal'), 'a response form is not sent to the AI reader and nothing is asked first: its rows stay as they are', calls.length);
  ok((await labels()).join() === formRefs.join(), 'the form\'s own references stay on every row (A.1 to G.2), so the answers can go back into its rows');
  ok(sentRefs.length >= 20 && sentRefs.includes('C.2') && !sentRefs.includes('B.3') && !sentRefs.some(r => /^A\.|^G\./.test(r)), 'the writer is asked for the form\'s Adobe rows; the answer the partner approved (B.3) and the firm and pricing rows are not sent', sentRefs.join());
  ok(wrote.find(b => b.ref === 'B.1').words === 270 && wrote.find(b => b.ref === 'C.1').words === 225 && wrote.find(b => b.ref === 'F.2').words === 180, 'each request asks for 90 percent of its own row\'s limit (270 of 300, 225 of 250, 180 of 200)');
  const rowWords = await h.eval(() => RFPBuilder.state.questions.filter(q => q.ai).map(q => { const w = RFPAnswers.written(RFPAnswers.compose(q), q); return [q.label, w.sections.reduce((n, [hd, items]) => n + [hd, ...items].join(' ').split(/\s+/).filter(Boolean).length, 0)]; }));
  const lim = {B: 300, C: 250, D: 250, E: 150, F: 200}, over = rowWords.filter(([r, w]) => w > lim[r[0]]);
  ok(rowWords.length >= 20 && !over.length, 'every answer in the download fits its own section\'s limit', JSON.stringify(over));
  const st = await p.textContent('#rfp-status'), t4 = await toast();
  ok(!/read with AI/.test(st) && /39 requirements found/.test(st) && /^All \d+ answers were written with AI; read each one before you use it\.$/.test(t4) && await p.textContent('#rfp-ai') === 'Undo AI reading', 'the status line still describes the form, the message does not ask to check an AI list, and the button can undo', st + ' | ' + t4);
  await undo();
  ok(await h.eval(() => !RFPBuilder.state.questions.some(q => q.ai) && RFPBuilder.state.questions.find(q => q.label === 'B.3').status === 'used' && RFPBuilder.state.aiRows === false) && (await labels()).join() === formRefs.join(), 'undo takes the written answers away and keeps the form and the approval');

  // 5. fixes 1 and 4 on the insurer PDF, read by the AI (a real reading, replayed)
  await h.file(DEMO + '_RFP.pdf'); mode = 'cedar'; calls = []; wrote.length = 0; await pressed();
  ok(calls.length === 2 && (await labels()).includes('C.2') && (await labels()).includes('G.2'), 'the PDF is read by the AI in two parts, as on the live worker', (await labels()).join());
  ok(await limits(['B.1', 'B.8', 'C.2', 'D.1', 'E.4', 'F.3']) === 'B.1:300 B.8:300 C.2:250 D.1:250 E.4:150 F.3:200', 'after the AI reading each question takes the limit stated for its own section, found by its reference (the first limit, 200, held every answer before)', await limits(['B.1', 'B.8', 'C.2', 'D.1', 'E.4', 'F.3']));
  const sent = ref => wrote.find(b => b.ref === ref);
  ok(!sent('A.1') && await h.eval(() => RFPBuilder.state.questions.find(q => q.label === 'A.1').kind === 'adobe'), 'A.1, a question about the firm that the AI reading filed under Adobe, is not sent to the writer');
  ok(sent('B.8') && sent('B.8').services.some(x => x.matched) && sent('B.2') && sent('B.2').services.length > 0, 'questions that name no product (B.8 go-live, B.2 the Drupal migration) are written from the products of their section heading', JSON.stringify([sent('B.8') && sent('B.8').services.map(x => x.id + (x.matched ? '*' : '')), sent('B.2') && sent('B.2').services.length]));
  ok(sent('C.2') && sent('C.2').services.some(x => x.matched && /^O\d{2}$/.test(x.id)), 'C.2 (AI-generated answers) is written with Brand Visibility\'s services', sent('C.2') && sent('C.2').services.map(x => x.id + (x.matched ? '*' : '')).join());
  ok(sent('B.7') && !sent('B.7').services.some(x => /^TG/.test(x.id)), '"without licensing Adobe Target": no Target service is offered for B.7', sent('B.7') && sent('B.7').services.map(x => x.id).join());
  ok(wrote.every(b => b.words === Math.floor({B: 300, C: 250, D: 250, F: 200}[b.ref[0]] * 0.9)), 'each request asks for 90 percent of its own section\'s limit', JSON.stringify(wrote.map(b => b.ref + ':' + b.words)));
  ok(!wrote.some(b => /^E\./.test(b.ref)) && await h.eval(() => ['E.1', 'E.2', 'E.3', 'E.5'].every(r => { const q = RFPBuilder.state.questions.find(x => x.label === r); const d = q && RFPAnswers.compose(q); return d && d.kb; })), 'the security and hosting questions keep their sourced answers from the knowledge base and are not sent to the writer', wrote.filter(b => /^E\./.test(b.ref)).map(b => b.ref).join());

  // 6. fix 5: no sentence that defers a point to Adobe, in an answer or in the Word proposal
  const b1 = await h.eval(() => { const q = RFPBuilder.state.questions.find(x => x.label === 'B.1'); return q.ai ? q.ai.sections.map(([hd, items]) => hd + ': ' + items.join(' | ')).join('\n') : ''; });
  ok(b1 && !/from Adobe in writing|Adobe's written/.test(b1) && /Test each stage with your reviewers/.test(b1) && /Deliver the agreed work in stages/.test(b1), 'an answer keeps its steps and loses "we will get it from Adobe in writing" and "obtain Adobe\'s written terms"', b1);
  const scrub = await h.eval(() => RFPProposal.scrubText('We will get the hosting region from Adobe in writing before you sign. The site is served by Edge Delivery Services.', new Set()) + ' || ' + RFPProposal.scrubText('Pending Adobe confirmation, we would enable the connector. We map your fields.', new Set()));
  ok(!/Adobe in writing|Pending Adobe/.test(scrub) && /served by Edge Delivery Services/.test(scrub) && /We map your fields/.test(scrub), 'the Word proposal drops the same sentences and keeps the rest', scrub);
  ok((W.match(/Never defer a point to Adobe/g) || []).length === 2, 'both writer briefs (answers and proposal) say never to defer a point to Adobe');
  // an AI answer that rests on no catalog service is still the answer
  ok(await h.eval(() => { const q = RFPBuilder.state.questions.find(x => x.label === 'D.7'); const okTake = RFPAnswers.takeAI(q, {services: [], sources: []}, {sections: [{heading: 'Our approach', items: ['We would keep the print notices with your vendor for now and look at them again after launch.']}], services: [], sources: []}, 'claude-opus-5-5'); const d = RFPAnswers.compose(q); return okTake && RFPAnswers.hasAnswer(q) && !!d.ai && d.m.lines.length === 0; }), 'an AI answer that rests on no catalog service (D.7, the print vendor) is shown as the answer, with no service ticked');
  await undo(); mode = 'ok';
  ok(h.errors.length === 0, 'no page errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `\n${fails} of ${n} STEP 89 CHECKS FAILED` : `\nALL STEP 89 CHECKS PASSED (${n})`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
