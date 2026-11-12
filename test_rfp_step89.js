// RFI Builder step 89, fix 3 (Nov 12 2026, Adam: "fix number 3"): no part of an RFI goes missing without a word. A test RFP
// read seven times lost its second half twice: the reader's reply came back with no line in the tab layout, the worker called
// that "nothing to answer" and the page left the part out. Now the worker reads pipes, runs of spaces and a written-out \t
// too, and the page tries an empty part again and, if it is still empty, names it in the closing message and under Not
// picked up. The reader is stubbed here (no call leaves this machine); the worker's reader is checked on its own.
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
    if (k === 2 && (mode === 'empty' || (mode === 'once' && seen[k] === 1))) return route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({error: 'The AI model found nothing to answer in this document.'})});
    const first = (b.text.match(/Requirement (\d+)\./) || [])[1] || '0';
    return route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({items: [{kind: 'adobe', ref: 'Part ' + k, text: 'Convert the forms from requirement ' + first + ' on to adaptive forms in AEM Forms.'}], notes: []})}); });
  const run = async () => { calls = []; seen = {}; await p.click('#rfp-ai'); await p.waitForFunction(() => /Undo AI reading|Build Answers with AI/.test(document.getElementById('rfp-ai').textContent) && !document.getElementById('rfp-ai').disabled, null, {timeout: 30000}); await p.waitForTimeout(150); };
  const undo = async () => { if (/Undo AI reading/.test(await p.textContent('#rfp-ai'))) { await p.click('#rfp-ai'); await p.waitForTimeout(150); const y = await p.$('#rfp-replace-yes'); if (y && await y.isVisible()) await y.click(); await p.waitForTimeout(150); } };
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
  ok(h.errors.length === 0, 'no page errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `\n${fails} of ${n} STEP 89 CHECKS FAILED` : `\nALL STEP 89 CHECKS PASSED (${n})`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
