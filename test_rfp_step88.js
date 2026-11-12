// RFI Builder step 88 (Nov 12 2026, Adam: "give them some freaking intelligence", "go"): Build with Adobe RFI Agent reads the RFI
// and then writes every Adobe answer with the AI writer, to a brief (approach, steps, deliverables, timeline and effort, risk),
// from the services and Adobe facts that apply; the services it rests on are the answer's services; a question the writer
// could not answer keeps the catalog's; "Answers, to print" carries every draft while none is marked; the Word proposal
// finds the outside systems the RFI names (Snowflake, Power BI). The reader and the writer are stubbed here (no call leaves
// this machine); the worker's route is checked as text.
// Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_step88.js
const fs = require('fs'), path = require('path');
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
const READ = {items: [{kind: 'adobe', ref: 'B.1', text: 'Describe how you would implement Customer Journey Analytics, including data views and the first reports for our merchandising team.'},
  {kind: 'adobe', ref: 'B.2', text: 'How would you bring order history from our Snowflake data warehouse into Customer Journey Analytics?'},
  {kind: 'adobe', ref: 'B.3', text: 'How would Customer Journey Analytics reports reach Power BI for our finance team?'},
  {kind: 'adobe', ref: 'B.4', text: 'Is Customer Journey Analytics hosted in the United States?'},
  {kind: 'firm', ref: 'A.1', text: 'Describe your firm\'s experience with retailers of our size.'}], notes: [], truncated: false};
// what the writer sends back: built from the request, with things the page must take out (a dash, a catalog id, a release
// label, a service and a source it was not given)
const reply = b => { const s = b.services.find(x => x.matched) || b.services[0];
  return {model: 'claude-opus-5-5', data: {sections: [
    {heading: 'Our approach', items: ['For ' + b.client + ', we start from the reports your merchandising and finance teams read every Monday — then work back to the data.']},
    {heading: 'How we would do it', items: ['1. Run a two-day discovery with your analysts and agree the questions the first reports answer.', 'Deliver ' + s.id + ' so the data lands where your teams need it.',
      'Turn on the new feature now in beta for early readers.', 'Build data views and a first Analysis Workspace project with your team.', 'Hand over a runbook and train two of your analysts.']},
    {heading: 'What you get', items: ['A working connection, documented end to end.', 'Data views, a first project and a runbook your team owns.']},
    {heading: 'Timeline and effort', items: ['About four weeks, with typical effort near ' + s.hours + ' hours for the core work.']},
    {heading: 'Risk we manage', items: ['Mismatched customer keys between systems: we test the join on a sample in week one.']}],
    services: [s.id, 'ZZ99'], sources: [1, 999]}}; };
(async () => {
  const h = await open(), p = h.page, READ_URL = 'https://warroom-assistant.adam-d1a.workers.dev/rfi/read', WRITE_URL = 'https://warroom-assistant.adam-d1a.workers.dev/rfi/answer';
  const asked = [];
  await p.route(READ_URL, route => route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify(READ)}));
  await p.route(WRITE_URL, async route => { const b = JSON.parse(route.request().postData()); asked.push(b); await new Promise(r => setTimeout(r, 400));
    if (/Power BI/.test(b.question)) return route.fulfill({status: 502, contentType: 'application/json', body: JSON.stringify({error: 'The AI writer did not answer.'})});
    return route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify(reply(b))}); });
  const Q = ref => `RFPBuilder.state.questions.find(q => q.label === '${ref}')`;
  const btn = () => p.$eval('#rfp-ai', b => b.textContent);

  // 1. one press reads the RFI, then writes the answers
  await h.text(DOC, 'northwind_rfi.txt');
  await h.eval(() => { RFPBuilder.state.client = 'Northwind Outdoor Supply'; });   // the client box, as a partner fills it
  const click = p.click('#rfp-ai');
  await p.waitForFunction(() => /^Writing answers… \d of \d · \d:\d\d$/.test(document.getElementById('rfp-ai').textContent), null, {timeout: 8000}).catch(() => {});
  ok(/^Writing answers… \d of 3 · \d:\d\d$/.test(await btn()), 'after the reading, the button says it is writing the answers, how many of how many, and counts the seconds', await btn());
  await click; await p.waitForFunction(() => document.getElementById('rfp-ai').textContent === 'Undo AI reading', null, {timeout: 15000}).catch(() => {});
  ok(await btn() === 'Undo AI reading', 'when the answers are written the button undoes the reading, as before', await btn());
  const refs = [...new Set(asked.map(b => b.ref))].sort();
  ok(refs.join() === 'B.1,B.2,B.3', 'the writer is asked for the three Adobe questions that need a plan; the hosting question keeps its sourced fact answer and the firm question is not sent', refs.join());
  ok(asked.filter(b => b.ref === 'B.3').length === 2, 'a question the writer could not answer is tried twice');
  const toast = await p.$eval('#toast', t => t.textContent);
  ok(toast === 'Check the list against the document before you answer. 2 of 3 answers were written with AI; the others are drafted from the catalog. Read each one before you use it.', 'the closing message says how many answers the AI wrote', toast);

  // 2. what leaves the browser
  const b2 = asked.find(b => b.ref === 'B.2');
  ok(Object.keys(b2).sort().join() === 'client,connection,facts,question,ref,rfi,services,sources,words', 'a request carries the client, the RFI, the question, its word budget, the services, the connection, Adobe facts and their pages, and nothing else', Object.keys(b2).join());
  ok(b2.words === 135 && b2.client === 'Northwind Outdoor Supply' && /order history from our Snowflake/.test(b2.rfi), 'the budget is 90 percent of the RFI\'s 150-word limit, and the client and RFI text go with it', b2.words + ' ' + b2.client);
  ok(b2.services.some(s => s.matched && s.id === 'OX3') && b2.services.length <= 24 && b2.services.every(s => s.id && s.name && typeof s.hours === 'number' && /^(one-time|monthly)$/.test(s.billing)), 'the Snowflake question carries the warehouse service (OX3) as matched, with names, hours and billing, at most 24 services', b2.services.map(s => s.id).join());
  ok(b2.connection && b2.connection.between.includes('Customer Journey Analytics') && b2.sources.length > 0 && b2.sources.every(s => /^https:\/\//.test(s.url) && s.n > 0), 'it carries the warehouse connection and numbered Adobe pages', JSON.stringify(b2.connection && b2.connection.between));
  ok(!asked.some(b => /\$\s?\d|per hour|hourly rate/i.test(JSON.stringify(b.services))), 'no rate or price goes to the writer');

  // 3. what comes back is checked before it is shown
  const ai = await h.eval(new Function('return ' + Q('B.2') + '.ai'));
  ok(ai && ai.model === 'claude-opus-5-5' && ai.services.join() === 'OX3' && ai.sources.length === 1, 'the answer keeps the model that wrote it, only the services and the one Adobe page it was given', JSON.stringify(ai && {m: ai.model, s: ai.services, n: ai.sources.length}));
  const flat = ai ? ai.sections.map(([hd, items]) => hd + ': ' + items.join(' | ')).join('\n') : '';
  ok(!/[—–]/.test(flat) && !/\bbeta\b/i.test(flat) && !/\bOX3\b/.test(flat) && /Deliver .+ so the data lands/.test(flat) && /^How we would do it: Run a two-day/m.test(flat), 'no dash, no sentence with a release label, the catalog id is the service\'s name, a list number is taken off', flat.slice(0, 600));
  ok(!(await h.eval(new Function('return ' + Q('B.3') + '.ai'))) && await h.eval(new Function('return RFPAnswers.hasAnswer(' + Q('B.3') + ')')), 'the question the writer could not answer keeps the catalog\'s answer');

  // 4. the answer on screen
  await h.select(await h.eval(new Function('return RFPBuilder.state.questions.indexOf(' + Q('B.2') + ')')));
  const panel = await p.textContent('#rfp-answer');
  ok(/Our approach/.test(panel) && /How we would do it/.test(panel) && /Timeline and effort/.test(panel) && /Risk we manage/.test(panel) && /Mismatched customer keys/.test(panel), 'the answer shows the brief\'s sections', panel.slice(0, 300));
  const words = await h.eval(new Function('const q=' + Q('B.2') + ';return RFPAnswers.responseRows().rows.find(r=>r[0]===q.label)[4].split(/\\s+/).filter(Boolean).length'));
  ok(words > 60 && words <= 150, 'the answer in the download fits the RFI\'s 150 words', words);
  const lines = await h.eval(new Function('return RFPAnswers.compose(' + Q('B.2') + ').m.lines'));
  ok(lines.join() === 'OX3', 'the services the AI\'s answer rests on are the answer\'s services, so they become the statement of work ticks', lines.join());

  // 5. printing with no answer marked carries every draft; once one is marked, only the marked ones
  let doc = await h.eval(() => RFPAnswers.responseDoc());
  ok(/Mismatched customer keys/.test(doc) && (doc.match(/Mismatched customer keys/g) || []).length === 2, 'with no answer marked, Answers, to print carries every drafted answer', (doc.match(/Mismatched customer keys/g) || []).length);
  const rows = await h.eval(() => RFPAnswers.responseRows().rows);
  ok(rows.filter(r => /^B\.[123]$/.test(r[0])).every(r => r[6] === 'Draft' && r[4].length > 40), 'and the Excel copy marks them Draft', JSON.stringify(rows.map(r => r[0] + ':' + r[6])));
  await p.click('#rfp-use'); await p.waitForTimeout(150);
  doc = await h.eval(() => RFPAnswers.responseDoc());
  ok((doc.match(/Mismatched customer keys/g) || []).length === 1 && /Your answer:/.test(doc), 'once an answer is marked Use this answer, only marked answers print and the rest are blanks');

  // 6. an AI answer stays with the work, and goes when its question changes
  const saved = await h.eval(new Function('const q=' + Q('B.1') + ';return JSON.parse(JSON.stringify(q)).ai&&RFPAnswers.aiOf(q)&&true'));
  ok(saved === true, 'the AI answer is kept with the question, so Save my work and a reload keep it');
  ok(await h.eval(new Function('const q=Object.assign({},' + Q('B.1') + ',{text:"Describe how you would train our analysts."});return RFPAnswers.aiOf(q)===null')), 'an AI answer is not used once its question\'s text has changed');
  ok(await h.eval(() => RFPAnswers.takeAI({kind: 'adobe', text: 'x'}, {services: [], sources: []}, {sections: [{heading: 'Our approach', items: ['—']}]}, 'm') === false), 'a reply with nothing usable is refused and the catalog answer stays');

  // 7. the Word proposal finds the outside systems the RFI names
  await h.file(path.join(__dirname, 'rfp_prototype/demo/Tallgrass_Home_and_Garden_Inc_RFP.pdf'));
  const pack = await h.eval(() => RFPAnswers.proposalPack().connections.map(c => c.pair + ':' + c.services.map(s => s.id).join(',')));
  ok(pack.some(c => /^Data warehouse \+ Customer Journey Analytics:.*OX3/.test(c)) && pack.some(c => /^Customer Journey Analytics \+ BI tools:BI1,BI2/.test(c)), 'the proposal is given the Snowflake and Power BI connections with their services, so it no longer calls them custom work', pack.join(' | '));

  // 8. the worker
  const W = fs.readFileSync(path.join(__dirname, 'ai_reading/warroom-assistant-worker.js'), 'utf8');
  ok(/'\/rfi\/answer'/.test(W) && /handleRfiAnswer/.test(W) && /us\.anthropic\.claude-opus-5-5/.test(W) && /async function writerFetch/.test(W), 'the worker has the /rfi/answer route and writes with Opus 5.5');
  ok((wf => /\[400, 403, 404\]/.test(wf) && /ask\(BEDROCK_URL_SONNET\)/.test(wf))(W.slice(W.indexOf('async function writerFetch'), W.indexOf('async function writerFetch') + 900)), 'when Opus 5.5 is not open to the key, the writer falls back to Sonnet 5');
  const rules = W.slice(W.indexOf('const RFI_ANSWER_RULES'), W.indexOf('const RFI_ANSWER_RULES') + 6000) + W.slice(W.indexOf('const RFI_PROPOSE_RULES'), W.indexOf('const RFI_PROPOSE_RULES') + 12000);
  ok(!/Confirm with Adobe/.test(rules) && /How we would do it/.test(rules) && /Risk we manage/.test(rules) && /never a bracketed field for hours/.test(rules) && /Never mention the catalog/.test(rules), 'the writer\'s brief has the five sections, always gives the hours (never a blank field), and neither brief tells the partner to confirm with Adobe');
  {const f = W.slice(W.indexOf('function answerObject'), W.indexOf('const RFI_ANSWER_MAX_CHARS')); const answerObject = new Function(f + ';return answerObject;')();
   ok(f.length > 100 && answerObject('{"sections":[]} and then {"sections":[{"heading":"b","items":["y } {"]}]} done.').sections[0].heading === 'b' && answerObject('no answer') === null && /answerObject\(got\.text\)/.test(W), 'the worker reads the last complete answer in the writer\'s reply, so a note or a second draft after it does not lose the answer');}
  ok(h.errors.length === 0, 'no page errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `\n${fails} of ${n} STEP 88 CHECKS FAILED` : `\nALL STEP 88 CHECKS PASSED (${n})`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
