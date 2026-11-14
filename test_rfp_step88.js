// RFI Builder step 88 (Nov 12 2026, Adam: "give them some freaking intelligence", "go"): Build with Adobe RFI Agent read the RFI
// and wrote every Adobe answer with the AI writer, to a brief (approach, steps, deliverables, timeline and effort, risk);
// "Answers, to print" carries every draft while none is marked; the Word proposal finds the outside systems the RFI names
// (Snowflake, Power BI).
// Step 93 removed the AI path (Adam: "no ai until adobe says they want it"); its checks went: the button and its timer, the
// requests to the reader and the writer, the checks on the writer's reply, aiOf and takeAI, and the worker's /rfi/answer route.
// What stays runs with no AI (Adam chose to ship with the catalog's answers on screen): the download fits the
// RFI's word limit, the answer's services are the statement of work ticks, printing carries every draft until one is marked,
// and the Word proposal is given the Snowflake and Power BI connections.
// Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_step88.js
const path = require('path');
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 500) + ']')); if (!c) fails++; };
const DOC = ['Request for Information: Customer analytics', 'Northwind Outdoor Supply Inc. is evaluating Customer Journey Analytics for its retail and online channels.',
  'Responses are limited to 150 words per question.',
  'B.1 Describe how you would implement Customer Journey Analytics, including data views and the first reports for our merchandising team.',
  'B.2 How would you bring order history from our Snowflake data warehouse into Customer Journey Analytics?',
  'B.3 How would Customer Journey Analytics reports reach Power BI for our finance team?',
  'B.4 Is Customer Journey Analytics hosted in the United States?',
  'A.1 Describe your firm\'s experience with retailers of our size.'].join('\n');
(async () => {
  const h = await open(), p = h.page;
  const Q = ref => `RFPBuilder.state.questions.find(q => q.label === '${ref}')`;

  // 1. the Snowflake question's answer on screen, with no AI
  await h.text(DOC, 'northwind_rfi.txt');
  await h.eval(() => { RFPBuilder.state.client = 'Northwind Outdoor Supply'; });   // the client box, as a partner fills it
  await h.select(await h.eval(new Function('return RFPBuilder.state.questions.indexOf(' + Q('B.2') + ')')));
  const panel = await p.textContent('#rfp-answer');
  const words = await h.eval(new Function('const q=' + Q('B.2') + ';return RFPAnswers.responseRows().rows.find(r=>r[0]===q.label)[4].split(/\\s+/).filter(Boolean).length'));
  ok(words > 60 && words <= 150, 'the answer in the download fits the RFI\'s 150 words', words);
  const lines = await h.eval(new Function('const q=' + Q('B.2') + ';return RFPAnswers.compose(q).m.lines.join()'));
  ok(lines === 'OX3', 'the services the answer rests on (the warehouse service, OX3) become the statement of work ticks', lines);

  // 2. printing with no answer marked carries every draft; once one is marked, only the marked ones
  let doc = await h.eval(() => RFPAnswers.responseDoc());
  const how = d => (d.match(/<h4>Our approach<\/h4>/g) || []).length;
  ok(how(doc) === 3 && (doc.match(/Your answer:/g) || []).length === 1, 'with no answer marked, Answers, to print carries every drafted answer (the three that need a plan) and only the firm question is a blank', how(doc));
  const rows = await h.eval(() => RFPAnswers.responseRows().rows);
  ok(rows.filter(r => /^B\.[123]$/.test(r[0])).every(r => r[6] === 'Draft' && r[4].length > 40), 'and the Excel copy marks them Draft', JSON.stringify(rows.map(r => r[0] + ':' + r[6])));
  await p.click('#rfp-use'); await p.waitForTimeout(150);
  doc = await h.eval(() => RFPAnswers.responseDoc());
  ok(how(doc) === 1 && /Your answer:/.test(doc), 'once an answer is marked Use this answer, only marked answers print and the rest are blanks');

  // 3. the Word proposal finds the outside systems the RFI names
  await h.file(path.join(__dirname, 'rfp_prototype/demo/Tallgrass_Home_and_Garden_Inc_RFP.pdf'));
  const pack = await h.eval(() => RFPAnswers.proposalPack().connections.map(c => c.pair + ':' + c.services.map(s => s.id).join(',')));
  ok(pack.some(c => /^Data warehouse \+ Customer Journey Analytics:.*OX3/.test(c)) && pack.some(c => /^Customer Journey Analytics \+ BI tools:BI1,BI2/.test(c)), 'the proposal is given the Snowflake and Power BI connections with their services, so it no longer calls them custom work', pack.join(' | '));

  ok(h.errors.length === 0, 'no page errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `\n${fails} of ${n} STEP 88 CHECKS FAILED` : `\nALL STEP 88 CHECKS PASSED (${n})`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
