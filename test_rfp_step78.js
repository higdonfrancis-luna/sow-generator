// RFI Builder step 78 (Nov 11 2026, Adam: "build the other fixes as well you discussed, speed etc"): a long RFI is read
// with AI in parts at the same time, and "maintenance" in a line that asks for documentation or training is not a
// question about after-launch services. The AI reader is stubbed here (no call leaves this machine).
// Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_step78.js
const fs = require('fs');
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 600) + ']')); if (!c) fails++; };
const URL = 'https://warroom-assistant.adam-d1a.workers.dev/rfi/read';
const HEAD = ['Request for Proposals 77-A: AEM Forms Implementation', 'The Division is replacing its forms software with AEM Forms. AEM Forms will be hosted by Adobe.'];
const para = i => 'Requirement ' + i + '. The contractor must convert legacy form number ' + i + ' to an adaptive form in AEM Forms, test it with Division staff, and document the result for the forms team before acceptance.';
const LONG = [...HEAD, ...Array.from({length: 200}, (_, i) => para(i + 1))].join('\n\n');
const SHORT = [...HEAD, ...Array.from({length: 8}, (_, i) => para(i + 1))].join('\n\n');
(async () => {
  const h = await open(), p = h.page;
  let calls = [], mode = 'ok', failed = {};
  await p.route(URL, async route => { const body = JSON.parse(route.request().postData()); calls.push(body); await new Promise(r => setTimeout(r, 120 + 60 * ((body.parts || 1) - (body.part || 1))));   // the last part answers first
    const k = body.part || 0; failed[k] = (failed[k] || 0) + 1;
    if (mode === 'flaky' && k === 2 && failed[k] === 1) return route.abort();
    if (mode === 'dead' && k === 2) return route.abort();
    if (mode === 'blank' && k === 2) return route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({error: 'The AI model found nothing to answer in this document.'})});
    const first = (body.text.match(/Requirement (\d+)\./) || [])[1] || '0';
    return route.fulfill({status: 200, contentType: 'application/json', body: '  ' + JSON.stringify({items: [{kind: 'adobe', ref: 'Part ' + (body.part || 1), text: 'Convert the forms from requirement ' + first + ' on to adaptive forms in AEM Forms.'}, {kind: 'firm', ref: 'Part ' + (body.part || 1) + ' firm', text: 'Name the staff for requirement ' + first + '.'}], notes: ['A note from the reading.'], truncated: false})}); });
  const run = async () => { calls = []; failed = {}; await p.click('#rfp-ai'); await p.waitForFunction(() => !/Reading with AI/.test(document.getElementById('rfp-ai').textContent), null, {timeout: 30000}); await p.waitForTimeout(150); };
  const labels = () => h.eval(() => RFPBuilder.state.questions.map(q => q.label));
  const undo = async () => { if (/Undo AI reading/.test(await p.textContent('#rfp-ai'))) { await p.click('#rfp-ai'); await p.waitForTimeout(150); const y = await p.$('#rfp-replace-yes'); if (y && await y.isVisible()) await y.click(); await p.waitForTimeout(150); } };

  // 1. a long RFI goes in parts, at the same time, and comes back in the RFI's order
  await h.text(LONG, 'long_rfp.txt'); const own = (await labels()).length;
  const sent = await h.eval(() => (RFPBuilder.state.paragraphs || []).filter(x => typeof x === 'string').join('\n'));
  await run();
  const parts = calls.slice().sort((a, b) => a.part - b.part), N = parts.length;
  ok(N >= 2 && N <= 12 && N === Math.min(12, Math.ceil(sent.length / 7000)) && parts.every((c, i) => c.part === i + 1 && c.parts === N && c.name === 'long_rfp.txt'), 'a long RFI is sent to the reader in parts (' + N + ' here), each numbered', calls.map(c => c.part + '/' + c.parts).join());
  ok(parts.map(c => c.text).join('\n') === sent, 'the parts are the whole RFI, cut between paragraphs, nothing left out and nothing twice');
  ok(parts.every(c => c.text.length < 7000 * 1.6 && c.text.trim().length >= 200) && Math.max(...parts.map(c => c.text.length)) - Math.min(...parts.map(c => c.text.length)) < 4000, 'the parts are about the same size', parts.map(c => c.text.length).join());
  ok(parts[0].context === '' && parts.slice(1).every(c => c.context.startsWith(sent.slice(0, 2500)) && c.context.length <= 6000) && parts[N - 1].context.endsWith(sent.slice(sent.indexOf(parts[N - 1].text) - 1200, sent.indexOf(parts[N - 1].text))), 'each later part carries the RFI\'s opening and the lines just before it; the first part needs none', parts.map(c => c.context.length).join());
  ok(calls[0].part !== undefined && calls.length === N, 'every part is asked for once when all answer');
  const got = await labels();
  ok(got.join('|') === parts.flatMap(c => ['Part ' + c.part, 'Part ' + c.part + ' firm']).join('|'), 'the lists come back in the RFI\'s order, though the last part answered first', got.join('|'));
  ok(/Undo AI reading/.test(await p.textContent('#rfp-ai')) && (await h.eval(() => RFPBuilder.state.skipped.filter(s => /A note from the AI reading/.test(s.reason)).length)) === 1, 'the button reads Undo AI reading, and a note every part repeats is listed once');
  await undo(); ok((await labels()).length === own, 'Undo AI reading brings the tool\'s own list back');

  // 2. a part that fails once is tried again; a part that fails twice stops the reading and changes nothing
  mode = 'flaky'; await run();
  ok(calls.filter(c => c.part === 2).length === 2 && (await labels()).length === 2 * N, 'a part that could not be reached is tried a second time, and the reading completes', calls.map(c => c.part).join());
  await undo(); mode = 'dead'; await run();
  ok(calls.filter(c => c.part === 2).length === 2 && (await labels()).length === own && /could not be reached\. The tool.s own list is unchanged/.test(await p.$eval('#toast', t => t.textContent)) && /Build with Adobe RFI Agent/.test(await p.textContent('#rfp-ai')), 'a part that fails twice stops the reading: a message says so and the tool\'s own list stays', await p.$eval('#toast', t => t.textContent));
  mode = 'blank'; await run();
  ok((await labels()).length === 2 * (N - 1) && calls.filter(c => c.part === 2).length === 2 && /^Part 2 of \d+ of this RFI came back empty from the AI reading/.test(await p.$eval('#toast', t => t.textContent)), 'a part with nothing to answer is left out, not treated as a failure; since step 89 it is tried a second time and named to the partner', (await labels()).length + ' ' + calls.map(c => c.part).join());
  await undo(); mode = 'ok';

  // 3. a short RFI is read in one call, as before
  await h.text(SHORT, 'short_rfp.txt'); await run();
  ok(calls.length === 1 && Object.keys(calls[0]).sort().join() === 'name,text' && (await labels()).join('|') === 'Part 1|Part 1 firm', 'a short RFI is one call with its name and text only', JSON.stringify(calls.map(c => Object.keys(c))));
  await undo();

  // 4. the worker's route
  const w = fs.readFileSync(__dirname + '/ai_reading/warroom-assistant-worker.js', 'utf8');
  ok(/const \{ name, text, part, parts, context \} = await request\.json\(\);/.test(w) && /This is part ' \+ Number\(part\) \+ ' of ' \+ Number\(parts\) \+ ' of a longer document/.test(w) && /List nothing from the context/.test(w) && /context\.slice\(0, 6000\)/.test(w) && /String\(name \|\| 'document'\)\.slice\(0, 200\) \+ inParts \+ '\\n<document>/.test(w),
    'the reader is told which part it has, given the context, and told to list nothing from it');

  // 5. "maintenance" in a line that asks for documentation or training
  await h.text(SHORT + '\n\nThe Division also uses Acrobat Sign for signatures. Acrobat Sign templates are in scope. Acrobat Sign must be branded.', 'short_rfp.txt');
  const m = await h.eval(() => ['Provide training and knowledge transfer documentation identifying setup, use, maintenance and administration of AEM Forms.', 'Deliver an operations manual covering maintenance of AEM Forms.', 'Describe your ongoing maintenance and support services for AEM Forms after launch.', 'Describe your monthly maintenance of AEM Forms.']
    .map(t => { const d = RFPAnswers.compose({text: t, kind: 'adobe', label: ''}); return d ? {ctx: d.m.fromContext, lines: d.m.lines, lead: /After launch we provide these services each month/.test(RFPAnswers.plain(d, {text: t, kind: 'adobe', label: ''}))} : null; }));
  ok(m[0] && !m[0].ctx && !m[0].lead && m[0].lines.includes('AF16'), 'a line asking for training and documentation on "setup, use, maintenance and administration" is answered with the training service, not a list of monthly services', JSON.stringify(m[0]));
  ok(m[1] && !m[1].ctx && !m[1].lead, 'so is "an operations manual covering maintenance"', JSON.stringify(m[1]));
  ok(m[2] && m[2].lines.includes('AF17') && m[3] && m[3].lines.includes('AF17'), 'a question about ongoing or monthly maintenance still gets the monthly service', JSON.stringify([m[2], m[3]]));

  ok(!h.errors.length, 'no script errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? '\n' + fails + ' STEP 78 CHECKS FAILED' : '\nALL STEP 78 CHECKS PASSED (' + n + ')'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
