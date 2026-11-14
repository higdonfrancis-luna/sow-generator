// RFI Builder step 75 (Nov 11 2026): Download proposal, a full proposal as a Word file. Step 92 (Nov 13 2026, Adam: "we've gotta
// get rid of the AI", then "Yes, please" to the no-AI sample and its four fixes): the proposal is built on the page with no AI, in
// an instant, from the answers the page drafts, the client's facts, the catalog's services and hours and Adobe's sources.
// Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_step75.js
const fs = require('fs'), path = require('path'), {execFileSync} = require('child_process');
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 600) + ']')); if (!c) fails++; };
const DOC = ['Request for Proposals 77-A: AEM Forms Implementation', 'The Division is replacing its forms software with AEM Forms. AEM Forms will be hosted by Adobe.',
  'We will not license Real-Time CDP for this program.',
  'Section 3. Scope of work', '3.1 Describe how you would create a form data model for our data sources in AEM Forms.', '3.2 Describe how you would convert 300 existing forms to adaptive forms in AEM Forms.',
  'Section 4. Your firm', '4.1 Provide three references from similar projects.'].join('\n\n');
const docText = file => execFileSync('unzip', ['-p', file, 'word/document.xml'], {maxBuffer: 64e6}).toString('utf8').replace(/<w:p[ >]/g, '\n<w:p ').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&apos;/g, "'").replace(/&quot;/g, '"');
(async () => {
  const h = await open(), p = h.page, calls = [];
  p.on('request', r => { if (!/^(?:http:\/\/localhost|data:|blob:)/.test(r.url())) calls.push(r.url()); });
  const menu = async () => { if (await p.isHidden('#rfp-dl-menu')) await p.click('#rfp-download-menu'); };

  // 1. the choice in the Download menu
  await h.text(DOC, 'division_rfp.txt');
  await menu();
  const items = await p.$$eval('#rfp-dl-menu button', b => b.map(x => x.id + ':' + x.querySelector('b').textContent));
  ok(items.join('|') === 'rfp-download:Answers, to print|rfp-download-xlsx:Answers, in Excel|rfp-download-proposal:Full proposal, in Word|rfp-download-asks:My checklist', 'the Download menu has four plain choices, the proposal among them (step 81)', items.join('|'));
  ok(await p.$$eval('#rfp-dl-menu button span', x => x.map(e => e.textContent).join('|')) === 'Your chosen answers, in order.|Your chosen answers, one row each.|Built from your answers, ready to edit.|Notes for you, not the client.', 'the proposal line says it is built from the answers, with no AI and no wait');

  // 2. choosing it: the Word file at once, nothing sent anywhere, and the line that says where it went
  const dl = p.waitForEvent('download', {timeout: 15000}), t0 = Date.now();
  await p.click('#rfp-download-proposal');
  const file = await dl, secs = (Date.now() - t0) / 1000, saved = path.join(require('os').tmpdir(), 'step92-' + Date.now() + '.docx'); await file.saveAs(saved); await p.waitForTimeout(300);
  ok(secs < 8 && calls.length === 0, 'the proposal is built in seconds on the page, with no call to any AI or other service', secs + 's, calls: ' + calls.join());
  const doneLine = await p.textContent('#rfp-progress-text');
  ok(file.suggestedFilename() === 'division-rfp-proposal.docx' && doneLine === 'Your proposal is ready. It was saved to your Downloads folder as division-rfp-proposal.docx. It was built from your answers, our service catalog and Adobe’s public documentation: review it, edit it and fill in the highlighted fields before you send it.', 'the line at the foot of the window says where the file went and what to do with it', doneLine);
  const again = p.waitForEvent('download', {timeout: 10000}); await p.click('#rfp-proposal-again'); const f2 = await again;
  ok(f2.suggestedFilename() === 'division-rfp-proposal.docx', 'Download it again gives the same file');
  await p.click('#rfp-progress-close'); ok(await p.isHidden('#rfp-progress'), 'Close takes the line away');

  // 3. what is in it
  const C = await p.evaluate(() => RFPProposal.last());
  const cat = await p.evaluate(() => Object.fromEntries(Object.entries(RFP_CAT.lines).map(([id, l]) => [id, {name: l.name, base: l.base}])));
  const titles = C.sections.map(s => s.title), all = JSON.stringify(C);
  ok(C.meta.title === 'Proposal: Request for Proposals 77-A: AEM Forms Implementation' && C.meta.solicitation === 'Request for Proposals 77-A: AEM Forms Implementation' && !/division_rfp/.test(C.meta.title + C.meta.solicitation), 'fix 4: the title is the RFI\'s own, not its file name', C.meta.title);
  ok(titles[0] === 'Executive summary' && titles.includes('Scope of work') && titles.includes('Services and effort') && titles.includes('About our firm') && titles[titles.length - 1] === 'Requirements matrix' && C.sections.every((s, i) => s.number === String(i + 1)), 'fix 1: the answers sit under the RFI\'s own sections, numbered in order, between the summary and the matrix', titles.join(' | '));
  const scope = C.sections.find(s => s.title === 'Scope of work');
  ok(scope.blocks.filter(b => b.type === 'h2').map(b => b.text.split(' ')[0]).join() === '3.1,3.2' && !/You told us/.test(JSON.stringify(scope)), 'fix 2: each requirement is answered under its own heading, and the client\'s facts are not repeated inside the answers');
  const sum = JSON.stringify(C.sections[0]);
  ok(/is looking for a partner to deliver AEM Forms/.test(sum) && /answers 2 Adobe requirements/.test(sum) && /one-time planning hours/.test(sum) && /Section \d+ sets them out/.test(sum) && /What the work leaves you with/.test(sum) && /\[ADD YOUR WIN THEMES/.test(sum), 'fix 3: the executive summary names the products, the requirements answered, the hours, where they are set out, what the work leaves the client with, and a place for the partner\'s win themes', sum.slice(0, 500));
  // Step 101: even a summary saying that a product was ruled out would disclose its name.
  ok(!/real[- ]?time (?:cdp|customer data platform)|\brt[- ]?cdp\b/i.test(all), 'the excluded product is absent throughout the proposal');
  const five = C.sections.find(s => s.title === 'Services and effort'), rows = five.blocks.find(b => b.type === 'table').rows.filter(r => !/^Total\b/.test(r[0]));
  ok(rows.length >= 2 && rows.every(r => Object.values(cat).some(l => l.name === r[0] && String(l.base) === r[2].replace(' a month', ''))), 'Services and effort lists catalog services at their catalog hours', rows.map(r => r[0] + ' ' + r[2]).join(', '));
  // Step 97: an empty firm placeholder is not an answer. Route it to To write in RFI order.
  const matrix = C.sections[C.sections.length - 1].blocks[0];
  const answeredIn = matrix.columns.indexOf('Answered in'), rfiSection = matrix.columns.indexOf('RFI section');
  ok(matrix.rows.map(r => r[0]).join() === '3.1,3.2,4.1' &&
    matrix.rows.slice(0, 2).every(r => /Scope of work/.test(r[rfiSection]) && r[answeredIn] === 'Section ' + scope.number) &&
    /Your firm/.test(matrix.rows[2][rfiSection]) && matrix.rows[2][answeredIn] === 'To write',
    'the matrix preserves the source sections, points to both drafted answers, and flags the unwritten firm answer', JSON.stringify(matrix.rows));
  ok(!/[–—]/.test(all) && !/\bAI\b|written by|\bbeta\b|coming soon|Adobe Consulting Services|\$\d/.test(all) && C.notices.length === 1 && /^Draft, built from this RFI, our service catalog and Adobe's public documentation/.test(C.notices[0]) && /Adobe-published sources/.test(C.notices[0]) && /before sharing with a client/.test(C.notices[0]) && /does not mean Adobe has reviewed or approved/.test(C.notices[0]), 'no dash, no AI wording, no release label, no price; one note asks the partner to review it before sharing, and says Adobe has not approved it (ChatGPT\'s review notice)', C.notices[0]);
  ok(C.sources.length >= 1 && C.sources.every((s, i) => s.n === i + 1 && /^https:\/\//.test(s.url)), 'the Adobe sources are listed and numbered');

  // 4. the Word file itself
  const t = docText(saved), size = fs.statSync(saved).size;
  ok(size > 8000 && /Proposal: Request for Proposals 77-A/.test(t) && /AT A GLANCE/.test(t) && /CONTENTS/.test(t) && /Executive summary/.test(t) && /Requirements matrix/.test(t) && /Adobe sources/.test(t), 'the Word file has the cover, the at-a-glance page, the contents, the sections and the sources');
  ok(/\[PARTNER LEGAL NAME\]/.test(t) && /\[HOURLY RATE\]/.test(t) && /\[YOUR ANSWER\]/.test(t) && /Total, one-time services/.test(t), 'with the services table and the fields only the partner can fill in');
  ok(!/undefined|\[object Object\]|written by AI/.test(t), 'and nothing in it reads "undefined" or says it was written by AI');

  // Step 97: firm-only submissions must export the approved firm answer alongside every matrix row.
  await h.text('1. Provide three references from similar projects.\n2. Describe your change control process.', 'supplier_rfi.txt');
  const firmAnswer = 'Our references have authorized procurement to contact their project leads.';
  await h.setAnswer(0, firmAnswer); await h.setStatus(1, 'skipped');
  await menu(); const firmDownload = p.waitForEvent('download', {timeout: 10000});
  await p.click('#rfp-download-proposal');
  const firmFile = await firmDownload, firmText = docText(await firmFile.path());
  const firmContent = await p.evaluate(() => RFPProposal.last());
  const firmSection = firmContent.sections.find(s => s.title === 'About our firm');
  const firmMatrix = firmContent.sections.find(s => s.title === 'Requirements matrix').blocks[0];
  const destination = firmMatrix.columns.indexOf('Answered in');
  ok(firmText.includes(firmAnswer) && firmText.includes('Requirements matrix') && JSON.stringify(firmSection.blocks).includes(firmAnswer) &&
    firmMatrix.rows.map(r => r[0]).join() === '1,2' && firmMatrix.rows[0][destination] === 'Section ' + firmSection.number &&
    firmMatrix.rows[1][destination] === 'To write',
    'firm-only Word exports the approved text and accounts for the omitted requirement', JSON.stringify(firmMatrix.rows));
  ok(!h.errors.length, 'no page errors', h.errors.join(' | '));
  console.log(fails ? `\n${fails} OF ${n} STEP 75 CHECKS FAILED` : `\nALL STEP 75 CHECKS PASSED (${n})`);
  await h.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
