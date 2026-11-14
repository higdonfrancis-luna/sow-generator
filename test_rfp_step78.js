// RFI Builder step 78 (Nov 11 2026, Adam: "build the other fixes as well you discussed, speed etc"): a long RFI is read
// with AI in parts at the same time, and "maintenance" in a line that asks for documentation or training is not a
// question about after-launch services.
// Step 93 removed the AI path: the checks of reading in parts, retries, empty parts, the one-call short RFI and the worker's route went; the no-AI maintenance checks stay, on the catalog writer's answer.
// Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_step78.js
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 600) + ']')); if (!c) fails++; };
const para = i => 'Requirement ' + i + '. The contractor must convert legacy form number ' + i + ' to an adaptive form in AEM Forms, test it with Division staff, and document the result for the forms team before acceptance.';
const HEAD = ['Request for Proposals 77-A: AEM Forms Implementation', 'The Division is replacing its forms software with AEM Forms. AEM Forms will be hosted by Adobe.'];
const SHORT = [...HEAD, ...Array.from({length: 8}, (_, i) => para(i + 1))].join('\n\n');
(async () => {
  const h = await open();

  // "maintenance" in a line that asks for documentation or training
  await h.text(SHORT + '\n\nThe Division also uses Acrobat Sign for signatures. Acrobat Sign templates are in scope. Acrobat Sign must be branded.', 'short_rfp.txt');
  const m = await h.eval(() => ['Provide training and knowledge transfer documentation identifying setup, use, maintenance and administration of AEM Forms.', 'Deliver an operations manual covering maintenance of AEM Forms.', 'Describe your ongoing maintenance and support services for AEM Forms after launch.', 'Describe your monthly maintenance of AEM Forms.']
    .map(t => { const c = RFPAnswers.compose({text: t, kind: 'adobe', label: ''}); if (!c) return null; const d = Object.assign({}, c); delete d.ai; return {ctx: d.m.fromContext, lines: d.m.lines, lead: /After launch we provide these services each month/.test(RFPAnswers.plain(d, {text: t, kind: 'adobe', label: ''}))}; }));
  ok(m[0] && !m[0].ctx && !m[0].lead && m[0].lines.includes('AF16'), 'a line asking for training and documentation on "setup, use, maintenance and administration" is answered with the training service, not a list of monthly services', JSON.stringify(m[0]));
  ok(m[1] && !m[1].ctx && !m[1].lead, 'so is "an operations manual covering maintenance"', JSON.stringify(m[1]));
  ok(m[2] && m[2].lines.includes('AF17') && m[3] && m[3].lines.includes('AF17'), 'a question about ongoing or monthly maintenance still gets the monthly service', JSON.stringify([m[2], m[3]]));

  ok(!h.errors.length, 'no script errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? '\n' + fails + ' STEP 78 CHECKS FAILED' : '\nALL STEP 78 CHECKS PASSED (' + n + ')'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
