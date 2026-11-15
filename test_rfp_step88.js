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
const {technicalBodies, tableIn} = require('./rfp_prototype/chatgpt_round5/test_word_complete.js');
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
  const refs = ['B.1', 'B.2', 'B.3', 'B.4'];
  const defaults = await h.word(), drafts = technicalBodies(defaults, refs);
  const words = drafts.get('B.2').paragraphs.join(' ').trim().split(/\s+/).length;
  ok(words > 60 && words <= 150, 'the downloaded Word answer fits the 150-word limit', words);
  const lines = await h.eval(new Function('const q=' + Q('B.2') + ';return RFPAnswers.compose(q).m.lines.join()'));
  ok(lines === 'OX3', 'the services the answer rests on (the warehouse service, OX3) become the statement of work ticks', lines);

  // 2. printing with no answer marked carries every draft; once one is marked, only the marked ones
  const matrix = doc => tableIn(doc, 'Requirements matrix', 'Ref');
  ok(refs.slice(0, 3).every(ref => drafts.get(ref)?.paragraphs.join(' ').length > 40) &&
    tableIn(defaults, 'About our firm', 'Ref').find(row => row.Ref === 'A.1')['Our answer'] === '[YOUR ANSWER]',
    'with no answer marked, Word includes the three technical plans and the blank firm answer');
  ok(matrix(defaults).filter(row => refs.slice(0, 3).includes(row.Ref)).every(row => /^Section /.test(row['Answered in'])),
    'the Word requirements matrix points to every available plan');
  await p.click('#rfp-use');
  const selected = await h.word(), marked = technicalBodies(selected, refs);
  ok(marked.size === 1 && marked.has('B.2') && matrix(selected).every(row => row.Ref === 'B.2' || row['Answered in'] === 'To write'),
    'once approved, only the selected answer prints and the matrix marks the remaining questions to write');

  // 3. the Word proposal finds the outside systems the RFI names
  await h.file(path.join(__dirname, 'rfp_prototype/demo/Tallgrass_Home_and_Garden_Inc_RFP.pdf'));
  const pack = await h.eval(() => RFPAnswers.proposalPack().connections.map(c => c.pair + ':' + c.services.map(s => s.id).join(',')));
  ok(pack.some(c => /^Data warehouse \+ Customer Journey Analytics:.*OX3/.test(c)) && pack.some(c => /^Customer Journey Analytics \+ BI tools:BI1,BI2/.test(c)), 'the proposal is given the Snowflake and Power BI connections with their services, so it no longer calls them custom work', pack.join(' | '));

  ok(h.errors.length === 0, 'no page errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `\n${fails} of ${n} STEP 88 CHECKS FAILED` : `\nALL STEP 88 CHECKS PASSED (${n})`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
