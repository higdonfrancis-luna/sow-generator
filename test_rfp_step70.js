// RFI Builder step 70 (Nov 10 2026, Adam on the summary bar: "There's a lot going on here"; "if they're missing stuff then
// they're missing stuff they can add it manually"; "0-6 firm answers sounds off"; "back to the homepage"; then "go" to
// sow/mockups/nov10_summary_options/summary_options.png and after_click.png): one count a line with a link to what is left,
// no drafts tick box, no blank-answers warning, no Shorter answers tick box, Open draft opens a Save my work file, and
// "Back to the home page".
// Run from the repo root after python3 sow/canvas/build.py and python3 sow/build_site.py:
//   node sow/test_rfp_step70.js
const fs = require('fs'), os = require('os'), path = require('path');
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
const {tableIn, technicalBodies} = require('./rfp_prototype/chatgpt_round5/test_word_complete.js');
const BANK = __dirname + '/rfp_prototype/try/Northbridge_Mutual_Bank_RFP_2026.xlsx';
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 500) + ']')); if (!c) fails++; };
(async () => {
  const h = await open(), p = h.page;
  await h.file(BANK);
  const iOf = l => h.eval(l => RFPBuilder.state.questions.findIndex(q => q.label === l), l);
  const use = async ls => { for (const l of ls) { await h.select(await iOf(l)); await p.click('#rfp-use'); await p.waitForTimeout(100); } };
  const counts = () => p.$$eval('#rfp-summary .rfp-count', a => a.map(x => x.textContent.trim().replace(/\s+/g, ' ')));
  const rows = () => p.$$eval('#rfp-questions li[data-i]', a => a.filter(li => !li.hidden).map(li => RFPBuilder.state.questions[+li.dataset.i].label));
  const note = () => p.$eval('#rfp-left-note', e => e.hidden ? '' : e.textContent.trim().replace(/\s+/g, ' '));
  const open1 = () => h.eval(() => { const q = RFPBuilder.state.questions[RFPBuilder.state.selected]; return q ? q.label : ''; });

  // 1. the bar: one count a line, in plain words
  let c = await counts();
  ok(c.length === 3 && c[0] === '0 of 8 Adobe product questions are answered. Go to the 8 that are left' && c[1] === '0 of 6 questions about your firm are answered. Go to the 6 that are left' && /^\d+ services? selected for the statement of work\.$/.test(c[2]), 'the bar has three lines: Adobe product questions, questions about your firm, services', c.join(' | '));
  const bar = await p.textContent('#rfp-summary');
  ok(!/firm answer|answers about Adobe products|are in your response/.test(bar), 'the old sentence and "firm answers" are gone');
  ok(!await p.$('#rfp-include-drafts') && !await p.$('#rfp-shorter') && !await p.$('#rfp-blank-warn') && !await p.$('#rfp-summary input[type=checkbox]'), 'the bar has no tick box and no warning');
  ok(await p.isVisible('#rfp-client') && (await p.inputValue('#rfp-client')) === 'Northbridge Mutual Bank', 'the client\'s name stays on the bar, read from the RFI');
  ok((await p.$$eval('#rfp-summary .rfp-actions > button, #rfp-summary .rfp-actions > .rfp-dl > button', b => b.map(x => x.textContent.trim()))).join('|') === 'Add to my statement of work|Download ▾' && await p.isVisible('#rfp-save-work') && await p.isVisible('#rfp-open-work'), 'the red button, Download, Save my work and Open my work are as before');
  ok(await p.isHidden('#rfp-left-note'), 'no line above the list until a link is used');

  // 2. five answers chosen: the count moves, the link says what is left, nothing warns
  await use(['2.1', '2.2', '2.3', '2.4', '2.5']); c = await counts();
  ok(c[0] === '5 of 8 Adobe product questions are answered. Go to the 3 that are left', 'five chosen: "5 of 8 ... Go to the 3 that are left"', c[0]);
  ok(/^1[0-9] services selected/.test(c[2]) || /^\d+ services selected/.test(c[2]), 'the services line counts the chosen answers\' services', c[2]);
  ok(!await p.$('#rfp-blank-warn') && !/will be blank/.test(await p.textContent('#rfp-summary')), 'no warning about blank answers');

  // 3. the downloads: the chosen answers only, no drafts
  const doc = await h.word(), matrix = tableIn(doc, 'Requirements matrix', 'Ref');
  const refs = ['2.1', '2.2', '2.3', '2.4', '2.5'];
  const bodies = technicalBodies(doc, matrix.map(r => r.Ref));
  ok(matrix.length === 14 && matrix.filter(r => r['Answered in'] === 'To write').length === 9 && bodies.size === 5 && refs.every(ref => bodies.has(ref)), 'the Word proposal includes the five chosen answers and marks the other nine to write');
  const xr = (await h.workbook('rfp-writeback')).sheets.Questions;
  ok(!xr.find(r => r[1] === '2.6')[3] && xr.find(r => r[1] === '2.1')[3].length > 200, 'the filled-in client workbook writes the chosen answer and leaves the unchosen cell empty');
  ok(await h.eval(() => { const qs = RFPBuilder.state.questions; return RFPAnswers.usedText(qs.find(q => q.label === '2.6')) === '' && RFPAnswers.usedText(qs.find(q => q.label === '2.1')).length > 200; }), 'the client\'s own workbook gets the chosen answers only');
  ok(await h.eval(() => RFPAnswers.targetOf === undefined && !('includeDrafts' in RFPBuilder.state) && !('shorter' in RFPBuilder.state) && !('includeDrafts' in RFPBuilder.snapshot()) && !('shorter' in RFPBuilder.snapshot())), 'the removed settings are gone from the page and from saved work');

  // 4. the RFI's own word limit is still obeyed
  await h.select(await iOf('2.1'));
  const fit = await p.$$eval('#rfp-answer .rfp-fit', a => a.map(x => x.textContent).join(' '));
  ok(/This RFI asks for under 300 words an answer\. This answer is \d+/.test(fit) && !/Shorter answers/.test(await p.textContent('#rfp-panel')), 'an answer still fits the RFI\'s own limit, and nothing mentions Shorter answers', fit.slice(0, 160));
  ok(await h.eval(() => RFPBuilder.state.questions.filter(q => q.kind === 'adobe').every(q => RFPAnswers.wordsIn(RFPAnswers.plain(q.draft || RFPAnswers.compose(q), q).split('\nAdobe sources')[0]) <= 330)), 'every drafted answer is near the 300 words the RFI asks for');

  // 5. Go to the 3 that are left
  await p.click('#rfp-left-adobe'); await p.waitForTimeout(150);
  ok((await rows()).join() === '2.6,2.7,2.8', 'the link lists only the three Adobe questions that are left', (await rows()).join());
  ok(await open1() === '2.6' && await p.isVisible('#rfp-use'), 'the first of them is open with its drafted answer and Use this answer', await open1());
  ok(await note() === 'Showing the 3 Adobe product questions that are left. Show all questions', 'a line above the list says what is showing', await note());
  ok((await p.$$eval('[data-rfp-filter]', a => a.filter(b => b.getAttribute('aria-pressed') === 'true').length)) === 0, 'no button of the filter row is pressed');
  await p.click('#rfp-use'); await p.waitForTimeout(120);
  ok((await rows()).join() === '2.7,2.8' && await note() === 'Showing the 2 Adobe product questions that are left. Show all questions' && (await counts())[0] === '6 of 8 Adobe product questions are answered. Go to the 2 that are left', 'choosing one takes it off the list and moves both counts', (await rows()).join() + ' | ' + await note());
  await p.click('#rfp-next'); await p.waitForTimeout(120);
  ok(await open1() === '2.7', 'Next to review opens the next one that is left', await open1());
  await p.click('#rfp-skip'); await p.waitForTimeout(120);
  ok((await rows()).join() === '2.8' && await note() === 'Showing the 1 Adobe product question that is left. Show all questions' && (await counts())[0] === '6 of 8 Adobe product questions are answered. Go to the 1 that is left', 'a question left out is not "left": one remains, said in the singular', await note() + ' | ' + (await counts())[0]);
  await h.select(await iOf('2.8')); await p.click('#rfp-use'); await p.waitForTimeout(120);
  ok((await rows()).length === 0 && await note() === 'No Adobe product questions are left. Show all questions' && (await counts())[0] === '7 of 8 Adobe product questions are answered.', 'when none are left the line says so and the bar\'s link goes away', await note() + ' | ' + (await counts())[0]);
  await p.click('#rfp-show-all'); await p.waitForTimeout(120);
  ok((await rows()).length === 14 && await note() === '' && await p.getAttribute('[data-rfp-filter="all"]', 'aria-pressed') === 'true', 'Show all questions brings the whole list back');

  // 6. Go to the 6 that are left
  await p.click('#rfp-left-firm'); await p.waitForTimeout(150);
  ok((await rows()).join() === '1.1,1.2,1.3,3.1,3.2,3.3' && await open1() === '1.1' && await p.isVisible('#rfp-firm'), 'the firm link lists the six questions about the firm, the first open with a box to write in', (await rows()).join());
  ok(await note() === 'Showing the 6 questions about your firm that are left. Show all questions', 'the line names them', await note());
  await p.fill('#rfp-firm', 'Founded in 2009, with headquarters in Chicago.'); await p.click('#rfp-firm-use'); await p.waitForTimeout(120);
  ok((await rows()).length === 5 && (await counts())[1] === '1 of 6 questions about your firm are answered. Go to the 5 that are left', 'a written firm answer moves the count', (await counts())[1]);
  await p.click('[data-rfp-filter="adobe"]'); await p.waitForTimeout(120);
  ok(await note() === '' && (await rows()).length === 8, 'a filter button takes over from the link');

  // 7. everything answered, and one question
  await h.select(await iOf('2.7')); await p.click('#rfp-skip'); await p.waitForTimeout(100); await p.click('#rfp-use'); await p.waitForTimeout(120);
  ok((await counts())[0] === 'All 8 Adobe product questions are answered.' && !await p.$('#rfp-left-adobe'), 'with every answer chosen the line reads "All 8 ..." and has no link', (await counts())[0]);
  await h.text('Describe your approach to implementing Adobe Experience Manager Sites.'); c = await counts();
  ok(c.length === 2 && c[0] === '0 of 1 Adobe product question is answered. Go to the 1 that is left', 'one question is said in the singular, and a kind with no questions has no line', c.join(' | '));

  // 8. saved work: an older file with the removed settings opens, and they are ignored
  await h.file(BANK); await use(['2.1', '2.2']);
  const snap = await h.eval(() => RFPBuilder.snapshot()), before = await h.eval(() => { const q = RFPBuilder.state.questions.find(q => q.label === '2.3'); return RFPAnswers.plain(RFPAnswers.compose(q), q).length; });
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'step70-')), old = path.join(dir, 'bank-rfp-work.json'), junk = path.join(dir, 'junk.json');
  fs.writeFileSync(old, JSON.stringify(Object.assign({}, snap, {includeDrafts: true, shorter: true}))); fs.writeFileSync(junk, JSON.stringify({hello: 'there'}));
  await h.text('Describe how Adobe Target would personalize our site.');
  await p.setInputFiles('#rfp-work-file', old); await p.waitForTimeout(300);
  if (await p.isVisible('#rfp-replace-go').catch(() => false)) { await p.click('#rfp-replace-go'); await p.waitForTimeout(200); }
  const st = await h.eval(() => ({n: RFPBuilder.state.questions.length, used: RFPBuilder.state.questions.filter(q => q.status === 'used').length, inc: RFPBuilder.state.includeDrafts, sh: RFPBuilder.state.shorter}));
  const after = await h.eval(() => { const q = RFPBuilder.state.questions.find(q => q.label === '2.3'); return RFPAnswers.plain(RFPAnswers.compose(q), q).length; });
  ok(st.n === 14 && st.used === 2 && st.inc === undefined && st.sh === undefined && after === before && tableIn(await h.word(), 'Requirements matrix', 'Ref').filter(r => r['Answered in'] !== 'To write').length === 2, 'an older Save my work file with both settings ticked opens with its answers, and the settings do nothing', JSON.stringify(st) + ' ' + before + '/' + after);

  // 9. Open draft opens a Save my work file: from a step of the full tool
  const work = path.join(dir, 'after-rfp-work.json'); fs.writeFileSync(work, JSON.stringify(snap));
  // the whole site, home page included (the harness serves the tool's own folder)
  const http = require('http'), SITE = path.join(__dirname, 'site'), T = {'.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript'};
  const server = http.createServer((req, res) => { let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (u.endsWith('/')) u += 'index.html';
    const f = path.join(SITE, u); if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, {'Content-Type': T[path.extname(f)] || 'text/plain'}); fs.createReadStream(f).pipe(res); });
  await new Promise(r => server.listen(0, r)); const ROOT = `http://localhost:${server.address().port}/`;
  const ctx = await p.context().browser().newContext({viewport: {width: 1500, height: 950}}), q = await ctx.newPage(), errs = [];
  q.on('pageerror', e => errs.push(e.message));
  const toast = pg => pg.$eval('#toast', t => t.textContent);
  await q.goto(ROOT); await q.waitForTimeout(400); await q.click('#picker [data-play="commerce"]'); await q.waitForTimeout(400); await q.click('#save'); await q.waitForURL('**/sow/index.html#scope'); await q.waitForTimeout(600);
  await q.setInputFiles('#draft-file', work); await q.waitForTimeout(500);
  ok(await q.isVisible('#rfp-panel') && await q.evaluate(() => RFPBuilder.state.questions.length === 14 && RFPBuilder.state.questions.filter(x => x.status === 'used').length === 2), 'on the Scope step, Open draft with a Save my work file opens the RFI Builder with the work in it');
  ok(/^Opened /.test(await toast(q)) && !await q.evaluate(() => document.body.classList.contains('rfi-only')) && await q.evaluate(() => state.play === 'commerce' || (state.customer !== undefined)), 'it says so, and the statement of work on screen is not touched', await toast(q));
  await q.setInputFiles('#draft-file', junk); await q.waitForTimeout(300);
  ok(/^Choose a JSON draft/.test(await toast(q)), 'a file that is neither still gets the tool\'s own message', await toast(q));
  await q.setInputFiles('#draft-file', work); await q.waitForTimeout(400);
  ok(/Merged|holds nothing this RFI does not have already/.test(await toast(q)) && await q.evaluate(() => RFPBuilder.state.questions.length === 14), 'the same file again merges, as Open my work does', await toast(q));

  // 10. and from the home page
  const q2 = await ctx.newPage(); q2.on('pageerror', e => errs.push(e.message));
  await q2.goto(ROOT); await q2.waitForTimeout(400);
  await q2.evaluate(() => sessionStorage.removeItem('abv-rfp-work-v1'));
  await q2.setInputFiles('#draft-file', work); await q2.waitForURL('**/sow/index.html#rf*'); await q2.waitForTimeout(700);
  ok(await q2.isVisible('#rfp-panel') && await q2.evaluate(() => RFPBuilder.state.questions.length === 14 && RFPBuilder.state.questions.filter(x => x.status === 'used').length === 2 && document.body.classList.contains('rfi-only')), 'on the home page, Open draft with a Save my work file opens the RFI Builder on its own with the work in it', q2.url());
  ok(await q2.evaluate(() => sessionStorage.getItem('abv-rfp-work-in') === null), 'the file is handed over once');
  await q2.goto(ROOT); await q2.waitForTimeout(400); await q2.setInputFiles('#draft-file', junk); await q2.waitForTimeout(300);
  ok(/^Choose a JSON draft/.test(await toast(q2)) && !/sow\/index/.test(q2.url()), 'the home page still turns away a file that is neither');

  // 11. Back to the home page
  await q2.goto(ROOT + 'sow/index.html#rfi'); await q2.waitForTimeout(500);
  ok((await q2.textContent('#rfi-back')).trim() === 'Back to the home page' && !/first page/i.test(await q2.evaluate(() => document.body.innerText)), 'the link reads "Back to the home page"');
  await q2.click('#rfi-back'); await q2.waitForURL('**/index.html'); await q2.waitForTimeout(500);
  ok(new URL(q2.url()).pathname === '/index.html', 'and it goes to the home page', q2.url());   // the door itself is test_rfi_front_door.js's check: this browser has a play on its canvas
  ok(!errs.length && !h.errors.length, 'no page errors', errs.concat(h.errors).join(' | '));
  await ctx.close();
  console.log(fails ? `\n${fails} OF ${n} STEP 70 CHECKS FAILED` : `\nALL STEP 70 CHECKS PASSED (${n})`);
  await h.close(); server.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
