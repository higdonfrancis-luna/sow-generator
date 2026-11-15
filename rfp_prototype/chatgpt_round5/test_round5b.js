/* Browser regressions from the independent Round 5b review. Pass item numbers to run a subset. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {open} = require('../review_2026-11-09/harness.js');
const {downloadWord, tableIn, technicalBodies} = require('./test_word_complete.js');
const reviewFile = name => path.join(__dirname, 'review_5b', name);
const demoFile = name => path.join(__dirname, '..', 'demo', name);

const cases = new Map();
cases.set(1, async h => {
  const {questions} = await h.file(reviewFile('chapters_kingsfold.pdf'));
  const chapters = ['1. Digital Experience', '2. Data and Analytics', '3. Implementation', '4. Vendor Profile'];
  const expected = chapters.flatMap((section, i) =>
    Array.from({length: i === 0 ? 4 : 3}, (_, j) => [`${i + 1}.${j + 1}`, section]));
  assert.deepEqual(questions.map(q => [q.label, q.section]), expected, 'Every numbered requirement has its printed chapter');
  const word = await downloadWord(h);
  const matrix = tableIn(word, 'Requirements matrix', 'Ref');
  assert.deepEqual(matrix.map(row => [row.Ref, row['RFI section']]), expected);
  for (const [ref, chapter] of expected) {
    const row = matrix.find(r => r.Ref === ref);
    if (row['Answered in'] === 'To write') continue;
    const destination = word.sections.find(s => 'Section ' + s.number === row['Answered in']);
    assert.ok(destination);
    if (destination.title !== 'About our firm') assert.equal(destination.title, chapter.replace(/^\d+\. /, ''));
  }
});

cases.set(2, async h => {
  const {questions} = await h.file(reviewFile('overview_heading_harrow_lake.docx'));
  const overview = questions.filter(q => q.section === 'Overview');
  assert.deepEqual(overview.map(q => [q.label, q.text]), [
    ['1.1', 'Provide an overview of your firm and its Adobe practice.'],
    ['1.2', 'Describe two comparable credit union or banking implementations.']
  ], 'Numbered requests survive a Word Overview heading');
  assert.equal(questions.length, 11);
  const skipped = await h.eval(() => RFPBuilder.state.skipped.map(x => x.text));
  assert.ok(skipped.some(text => text.includes('We run Adobe Experience Manager Sites on premises today')),
    'The excluded background paragraph is available in Not picked up');
  const mixed = await h.eval(() => RFPFinder.read([{text: 'Submission instructions\n\nUse the response form.\n\nDescribe your accessibility testing approach for AEM Sites.\n\n2.1 Explain how you would verify a release.'}]));
  assert.deepEqual(mixed.questions.map(q => q.text), ['Describe your accessibility testing approach for AEM Sites.', 'Explain how you would verify a release.']);
  assert.ok(mixed.skipped.some(row => row.text === 'Use the response form.'));
});

cases.set(3, async h => {
  const {questions} = await h.file(reviewFile('a_paragraph_kingsfold.pdf'));
  const migration = questions.find(q => q.label === '1.3');
  const continuation = 'A Drupal 9 site with about 3,000 pages and 40 content types runs our site today and must be retired at launch.';
  assert.equal(migration.text, 'Describe your migration approach for our current site. ' + continuation);
  assert.equal(questions.length, 4);
  const pasted = await h.find('A Public website\nA.1 Describe your migration approach.\nA Drupal site handles 40 content types\nand must be retired at launch.\nB Analytics\nB.1 Explain how you would measure readership.');
  assert.deepEqual(pasted.map(q => [q.label, q.section]), [['A.1','A Public website'], ['B.1','B Analytics']]);
  assert.match(pasted[0].text, /A Drupal site handles 40 content types and must be retired at launch\.$/);
});

cases.set(4, async h => {
  const website = '1. Describe how you would build our new website on AEM Sites with Edge Delivery Services.';
  const analytics = '2. Describe how you would implement Customer Journey Analytics.';
  async function limits() {
    return h.eval(() => RFPBuilder.state.questions.map(q => {
      const words = RFPAnswers.wordsIn(RFPAnswers.usedText(q));
      return [q.limit, RFPAnswers.limitOf(q)?.max ?? null, words];
    }));
  }
  for (const [instruction, max] of [
    ['Responses must not exceed 120 words.',120], ['Each response must not exceed 50 words.',50],
    ['Each response must be not exceeding 200 words.',200], ['Responses are max. 115 words.',115]
  ]) {
    await h.text(['Request for Information', instruction, website, analytics].join('\n'));
    const rows = await limits();
    assert.deepEqual(rows.map(row => row.slice(0,2)), [[max,max],[max,max]], instruction);
    assert.ok(rows.every(row => row[2] > 0 && row[2] <= max), 'Rendered answers obey ' + instruction);
  }
  await h.text('Section A: Websites\nAnswers must not exceed 150 words.\n' + website +
    '\nSection B: Analytics\n' + analytics);
  assert.deepEqual((await limits()).map(row => row.slice(0,2)), [[150,150],[null,null]]);
  await h.text(fs.readFileSync(reviewFile('word_limits.txt'), 'utf8'));
  assert.deepEqual((await limits()).map(row => row[0]), [250,250,300,250,250]);
  const legacy = await h.eval(() => RFPAnswers.limitOf({text:'Describe migration in no more than 110 words.',limit:null}));
  assert.equal(legacy.max, 110, 'A historical null does not skip limit fallbacks');
});

cases.set(5, async h => {
  const {questions} = await h.file(demoFile('Cedar_Prairie_Mutual_Insurance_Company_RFP.pdf'));
  const headings = {
    B: ['Website on AEM Sites with Edge Delivery Services',300],
    C: ['AI visibility and the conversational experience',250],
    D: ['Data, analytics and integrations',250],
    E: ['Security, hosting and compliance',150],
    F: ['Enablement, Coworker and ongoing services',200],
    G: ['Pricing',250]
  };
  const limits = await h.eval(() => RFPBuilder.state.questions.map(q => q.limit));
  for (const [letter, [title, maximum]] of Object.entries(headings)) {
    const rows = questions.filter(q => q.section.startsWith('Section ' + letter + '.'));
    assert.ok(rows.length);
    for (const q of rows) {
      assert.equal(q.section, 'Section ' + letter + '. ' + title, 'Clean heading for ' + q.label);
      assert.equal(limits[q.i], maximum);
    }
  }
  const word = await downloadWord(h);
  const matrix = tableIn(word, 'Requirements matrix', 'Ref');
  assert.equal(matrix.length, questions.length);
  for (const [i, row] of matrix.entries()) {
    const letter = /^Section ([B-G])\./.exec(questions[i].section)?.[1], section = headings[letter];
    if (!section) continue;
    assert.equal(row['RFI section'], 'Section ' + letter + '. ' + section[0]);
    if (row['Answered in'] === 'To write') continue;
    const dest = word.sections.find(s => 'Section ' + s.number === row['Answered in']);
    assert.ok(dest);
    if (dest.title !== 'About our firm') assert.equal(dest.title, section[0]);
  }
});

cases.set(6, async h => {
  const website = ['1. Describe how you would implement AEM Sites for our new public website.',
    '2. Explain how you would migrate our Drupal content into AEM Sites.'];
  const analytics = ['1. Describe how you would set up Customer Journey Analytics to report on website visits.',
    '2. Explain how you would connect AEM Sites data into Customer Journey Analytics.'];
  await h.text(['Request for Proposal: Website Program','Section A: Public website',...website,'Section B: Analytics',...analytics].join('\n\n'));
  async function checkDuplicateRefs() {
    // The same build used by the download control must accept independent estimates at identical printed numbers.
    await h.eval(async () => { await RFPProposal.build(RFPProposal.contentOf(RFPAnswers.proposalPack())); });
    const doc = await downloadWord(h), rows = tableIn(doc, 'Requirements matrix', 'Ref');
    assert.deepEqual(rows.map(row => row.Ref), ['1','2','1','2']);
    assert.equal(new Set(rows.map(row => row['RFI section'])).size, 2, 'Repeated codes have distinguishable printed sections');
    const services = tableIn(doc, 'Services and effort', 'Service').filter(row => !row.Service.startsWith('Total,'));
    assert.ok(services.length && services.every(row => !/^[12]$/.test(row['Counted in'])), 'Ambiguous service references identify the section or file');
    assert.ok(rows.every(row => row['Answered in'] !== 'To write'));
  }
  await checkDuplicateRefs();
  // Two files can also use identical headings and independent numbering.
  await h.page.locator('#rfp-file').setInputFiles([['site.txt',website], ['analytics.txt',analytics]].map(([name,items]) =>
    ({name,mimeType:'text/plain',buffer:Buffer.from(['Section A: Delivery',...items].join('\n\n'))})));
  await h.page.waitForFunction(() => RFPBuilder.state.name.includes('site.txt') && RFPBuilder.state.questions.length === 4);
  await checkDuplicateRefs();
});

cases.set(7, async h => {
  const {questions}=await h.file(demoFile('Cedar_Prairie_Mutual_Insurance_Company_Response_Form.xlsx'));
  const index = ref => questions.findIndex(q => q.label === ref);
  await h.setStatus(index('B.1'),'used');
  await h.setStatus(index('B.2'),'used');
  const six = ['A02','AXD01','AXD02','SI02','SI05','SI10'];
  const catalog = require('../../canvas/catalog.json').lines;
  async function checkScope(expected, total) {
    const doc=await downloadWord(h), rows=tableIn(doc,'Services and effort','Service');
    assert.deepEqual(rows.filter(r=>!r.Service.startsWith('Total,')).map(r=>r.Service).sort(),
      expected.map(id=>catalog[id].name).sort(), 'All approved and ticked services reach Word');
    assert.equal(rows.find(r=>r.Service==='Total, one-time services')['Planning hours'],total.toLocaleString('en-US'));
    return doc;
  }
  await checkScope(six,1032);
  const edit='We will agree the implementation sequence with your delivery team.';
  await h.setAnswer(index('B.1'),edit);
  assert.ok((await checkScope(six,1032)).blocks.some(b=>b.text===edit), 'Edited words reach the client verbatim');
  await h.select(index('B.2'));
  await h.page.locator('.rfp-line[data-id="A02"]').evaluate(box=>box.click());
  const remaining=six.filter(id=>id!=='A02');
  await checkScope(remaining,792);
  // Capture the normal handoff before the SOW consumes it and adds its default recommendations.
  await h.eval(()=>{const write=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){
    if(key==='abv-sow-handoff')window.lastServiceHandoff=JSON.parse(value);
    return write.call(this,key,value);
  };});
  await h.page.click('#rfp-to-sow');
  await h.page.click('#rfp-handoff-go');
  const handed=await h.eval(()=>window.lastServiceHandoff.managed.sort());
  assert.deepEqual(handed,remaining);

  await h.page.locator('.steps [data-step="rfp"]').click();
  await h.text('Responses must not exceed 120 words.\n\n1. Describe how you would implement Customer Journey Analytics.');
  const full = Array(120).fill('approved').join(' ');
  await h.setAnswer(0,full);
  const capped = await downloadWord(h), row = tableIn(capped,'Requirements matrix','Ref')[0];
  const response=capped.sections.find(s=>'Section '+s.number===row['Answered in']).blocks;
  assert.deepEqual(response.slice(1).map(b=>b.text),[full], 'An edit at the exact cap leaves no room for a second estimate inside the response');
  assert.ok(Number(row['One-time hours'])>0,'The matrix still carries the approved service effort');
});

cases.set(8, async h => {
  const gold=require('./gold/briarhaven.json'), catalog=require('../../canvas/catalog.json').lines;
  await h.file(path.join(__dirname,gold.file));
  const doc=await downloadWord(h), bodies=technicalBodies(doc,gold.questions.map(q=>q.label));
  const rows=tableIn(doc,'Services and effort','Service'), matrix=tableIn(doc,'Requirements matrix','Ref');
  const text=ref=>bodies.get(ref)?.paragraphs.join(' ')||'';
  for(const [id, locations, promise] of [
    ['SI05',['A.1'],/train authors|author training/i],
    ['SI04',['A.2','F.2'],/cutover/i],
    ['AS07',['B.4'],/expir|replace|withdraw/i],
    ['TG03',['E.1'],/prioritiz|backlog|ideation/i]
  ]){
    const row=rows.find(r=>r.Service===catalog[id].name);
    assert.ok(row&&locations.includes(row['Counted in']), id+' must be charged where its work is described: '+JSON.stringify(row));
    assert.match(text(row['Counted in']),promise);
  }
  for(const [ref,discovery] of [['C.5',true],['D.2',false]]){
    const r=matrix.find(row=>row.Ref===ref);
    assert.equal(Number(r['Monthly hours']),0,ref+' asks for a one-time deliverable');
    if(discovery||!Number(r['One-time hours'])){
      assert.equal(Number(r['One-time hours']),0);
      assert.match(text(ref),/Estimate in discovery/i);
      assert.ok(!rows.some(row=>row['Counted in']===ref));
    }
  }
});

const cedarForm = demoFile('Cedar_Prairie_Mutual_Insurance_Company_Response_Form.xlsx');
const cedarQuestion = 'We will not license Adobe Target in this phase. Describe how you would run A/B tests on the new quote-start page without it.';

async function downloadFile(h, id) {
  const page = h.page, button = page.locator('#' + id);
  const menuItem = await page.locator('#rfp-dl-menu #' + id).count();
  if (menuItem && await button.isHidden()) await page.click('#rfp-download-menu');
  const [download] = await Promise.all([page.waitForEvent('download', {timeout: 4000}), button.press('Enter')]);
  if (menuItem) await page.locator('#rfp-dl-menu').waitFor({state:'hidden'});
  return await download.path();
}
async function savedInFreshTab(h, file, isDraft) {
  const p = await h.page.context().newPage();
  try {
    await p.goto(h.base + 'index.html#rfp');
    await p.setInputFiles(isDraft ? '#draft-file' : '#rfp-work-file',
      {name:'saved.json', mimeType:'application/json', buffer:fs.readFileSync(file)});
    await p.waitForFunction(() => RFPBuilder.state.questions.some(q => q.label === 'B.7'));
    return await p.evaluate(() => {
      const q = RFPBuilder.state.questions.find(q => q.label === 'B.7');
      return {text:q.text, answer:q.answer, status:q.status, rate:state.rate, scope:[...RFPAnswers.kbExclusions(q)]};
    });
  } finally { await p.close(); }
}

cases.set(9, async h => {
  const {questions} = await h.file(cedarForm);
  const i = questions.findIndex(q => q.label === 'B.7');
  assert.equal(questions[i].text, cedarQuestion);
  await h.select(i);
  await h.page.click('#rfp-use');
  for (const [id, isDraft] of [['rfp-save-work',false], ['save-draft',true]]) {
    const file = await downloadFile(h,id), reopened = await savedInFreshTab(h,file,isDraft);
    assert.equal(reopened.text, cedarQuestion, id + ' preserves the client wording in a fresh tab');
    assert.equal(reopened.status,'used');
    assert.ok(reopened.scope.includes('target'));
  }
  const checklist = (await h.checklist()).slice(1).filter(row => row[0] === 'B.7');
  assert.ok(checklist.length, 'Checklist keeps the question reference');
  assert.ok(checklist.every(row => {
    const short = row[1].replace(/(?:\.{3}|…)$/, '').trimEnd();
    return short.includes('Adobe Target') && cedarQuestion.startsWith(short);
  }), 'The short question keeps the original client wording, including the excluded product');
  const word = await downloadWord(h), matrix = tableIn(word,'Requirements matrix','Ref');
  assert.equal(matrix.find(r => r.Ref === 'B.7').Requirement,cedarQuestion);
  assert.ok(word.blocks.some(b => b.style === 'Heading2' && b.text === 'B.7  ' + cedarQuestion));
  const returned = await h.workbook('rfp-writeback');
  assert.equal(returned.sheets.Requirements.find(r => r[0] === 'B.7')[2], cedarQuestion, 'The filled workbook keeps the original question');
  // An older work file with masked procurement text still matches the original when it is supplied again.
  const old = await h.eval(() => RFPBuilder.snapshot());
  const oldRow = old.questions.find(q => q.label === 'B.7');
  oldRow.text = oldRow.text.replace('Adobe Target','declined product');
  oldRow.scopeMatch = true; oldRow.scopeV1 = [2]; oldRow.answer = 'Saved supplier decision.';
  await h.file(cedarForm);
  await h.page.setInputFiles('#rfp-work-file', {name:'older.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(old))});
  await h.page.waitForFunction(() => RFPBuilder.state.questions.some(q => q.answer === 'Saved supplier decision.'));
  assert.equal(await h.eval(() => RFPBuilder.state.questions.find(q => q.label === 'B.7').text),cedarQuestion);
});

cases.set(10, async h => {
  const {questions} = await h.file(cedarForm);
  const index = questions.findIndex(q => q.label === 'B.7');
  const allowed = 'As you asked, we will run A/B tests without Adobe Target, using Edge Delivery experimentation.';
  const mixed = 'We will test without Adobe Target, but we will deploy Adobe Target after launch.';
  await h.eval(() => { state.rate = 287; save(); });
  await h.select(index);
  async function edit(text) {
    await h.page.click('#rfp-edit-btn');
    await h.page.fill('#rfp-edit',text);
    await h.page.click('#rfp-save-edit');
  }
  async function checkSaves(answer) {
    for (const [id, isDraft] of [['rfp-save-work',false], ['save-draft',true]]) {
      let file;
      try { file = await downloadFile(h,id); }
      catch(error) { throw Error(id + ': ' + await h.page.textContent('#toast'), {cause:error}); }
      const reopened = await savedInFreshTab(h,file,isDraft);
      assert.equal(reopened.answer,answer);
      if (isDraft) assert.equal(reopened.rate,287);
    }
  }
  await edit(allowed);
  await checkSaves(allowed);
  const word = await downloadWord(h);
  assert.ok(word.blocks.some(b => b.text === allowed));
  const filled = await h.workbook('rfp-writeback');
  assert.ok(filled.sheets.Requirements.find(r => r[0] === 'B.7').includes(allowed));
  await edit('As you asked, no Target. We will use Edge Delivery experimentation.');
  const revised = await h.workbook('rfp-writeback');
  assert.ok(revised.sheets.Requirements.find(r => r[0] === 'B.7').some(cell => /no Target/.test(cell)));
  await edit(mixed);
  await checkSaves(mixed);
  // Both client exports flag a positive proposal to use the declined product. Working saves above stay available.
  await assert.rejects(h.eval(() => RFPProposal.contentOf(RFPAnswers.proposalPack())), /scope|excluded|ruled out/i);
  const files = [];
  const record = file => files.push(file.suggestedFilename());
  h.page.on('download', record);
  try {
    for (const id of ['rfp-download-proposal','rfp-writeback']) {
      if (await h.page.isHidden('#rfp-dl-menu')) await h.page.click('#rfp-download-menu');
      await h.page.locator('#' + id).press('Enter');
      const warning = id === 'rfp-writeback' ? '#toast' : '#rfp-progress-text';
      await h.page.waitForFunction(selector => {
        const text = document.querySelector(selector)?.textContent || '';
        return /B\.7/.test(text) && /scope|excluded|ruled out/i.test(text);
      },warning);
      if (await h.page.isVisible('#rfp-progress-close')) await h.page.click('#rfp-progress-close');
    }
    assert.deepEqual(files,[], 'Neither client export writes an answer proposing an excluded product');
  } finally { h.page.off('download',record); }
});

cases.set(11, async h => {
  const gold = require('./gold/briarhaven.json');
  const {questions} = await h.file(path.join(__dirname,gold.file));
  const allText = doc => doc.blocks.flatMap(b => b.rows ? b.rows.flat() : b.text || '').join('\n');
  const regionalPromise = /each country site|country sites as MSM Live Copies|one author per market/i;
  const index = ref => questions.findIndex(q => q.label === ref);
  const unmarked = await downloadWord(h);
  assert.doesNotMatch(allText(unmarked),regionalPromise);
  await h.setStatus(index('A.1'),'used');
  await h.setStatus(index('A.3'),'used');
  await h.setStatus(index('D.3'),'used');
  const approved = await downloadWord(h);
  const services = tableIn(approved,'Services and effort','Service');
  assert.ok(services.some(r => r.Service === 'Executive dashboards in Power BI' && r['Planning hours'] === '48'),
    'Briarhaven names Power BI; the approved BI dashboard service keeps its 48 catalog hours');
  assert.doesNotMatch(allText(approved),regionalPromise);
  assert.doesNotMatch(allText(approved),/your client['’]s BI tool|connect the dots for your client/i);
  assert.match(technicalBodies(approved,['A.1']).get('A.1').paragraphs.join(' '),/language cop(?:y|ies)/i);

  for (const [requested,label] of [['Tableau','Tableau'],['our BI tool','your BI tool'],['Power BI or Looker','your BI tool']]) {
    const question = 'Describe how to build executive dashboards on Customer Journey Analytics data views in ' + requested + '.';
    // Use a client response form so both retained client exports exercise the same BI wording.
    const bytes = await h.eval(question => {
      const book = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book,XLSX.utils.aoa_to_sheet([
        ['Number','Question','Response'], ['1',question,'']
      ]),'Dashboards');
      return [...new Uint8Array(XLSX.write(book,{type:'array',bookType:'xlsx'}))];
    },question);
    await h.page.click('#rfp-clear');
    if (await h.page.isVisible('#rfp-clear-confirm')) await h.page.click('#rfp-clear-confirm');
    await h.page.setInputFiles('#rfp-file',{name:'dashboards.xlsx',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',buffer:Buffer.from(bytes)});
    await h.page.waitForFunction(question => RFPBuilder.state.questions.length===1 && RFPBuilder.state.questions[0].text===question,question);
    await h.setStatus(0,'used');
    const word = await downloadWord(h);
    const named = 'Executive dashboards in ' + label;
    assert.ok(tableIn(word,'Services and effort','Service').some(row => row.Service === named),named);
    const copy = technicalBodies(word,['1']).get('1').paragraphs.join(' ');
    const filled = (await h.workbook('rfp-writeback')).sheets.Dashboards[1];
    assert.equal(filled[1],question);
    for (const submitted of [copy,filled[2]]) {
      assert.doesNotMatch(submitted,/your client['’]s BI tool/i);
      if (requested === 'Tableau') assert.match(submitted,/dashboards in Tableau/i);
    }
    assert.equal(tableIn(word,'Requirements matrix','Ref')[0].Requirement,question);
  }

  for (const [background,ask,regional] of [
    ['We run one US site and translate selected pages into Spanish.', 'Describe language copies and local corrections in AEM Sites for the Spanish translations.',false],
    ['We sell in multiple markets through our single public website.', 'Describe language copies and local corrections in AEM Sites for selected Spanish pages.',false],
    ['We will retire our country sites and translate pages on one public website.', 'Describe language copies and local corrections in AEM Sites for selected Spanish pages.',false],
    ['We need language masters for local corrections.', 'Describe an AEM Sites rollout to country sites without overwriting local corrections.',true],
    ['We sell in several countries. Country sites are out of scope. We need one public site only.', 'Describe how AEM Sites will translate selected pages and review local corrections.',false],
    ['We need to roll out AEM Sites to three countries with language masters and local corrections across markets.',
      'Describe how we would create each country site as an MSM Live Copy with local corrections in AEM Sites.',true]
  ]) {
    const r = await h.text(background+'\n\n1. '+ask);
    assert.equal(r.questions[0].draft.lines.some(l => l.id === 'SI08'), regional,background);
    await h.setStatus(0,'used');
    const word=await downloadWord(h), copy=allText(word);
    if (regional) assert.match(copy,/Language copies and local corrections across markets/);
    else assert.doesNotMatch(copy,regionalPromise);
  }
  await h.text('1. Describe how Customer Journey Analytics would report page views for translated landing pages.');
  await h.setStatus(0,'used');
  assert.doesNotMatch(technicalBodies(await downloadWord(h),['1']).get('1').paragraphs.join(' '),/create a language copy/i, 'Analytics measurement does not commission the translation work');
  await h.text('Power BI is out of scope. We run Tableau.\n\n1. Describe how to build executive dashboards on Customer Journey Analytics data views in our BI tool.');
  await h.setStatus(0,'used');
  assert.ok(tableIn(await downloadWord(h),'Services and effort','Service').some(row => row.Service === 'Executive dashboards in Tableau'));
  const quoted = "Describe how your client's BI tool would display Customer Journey Analytics executive dashboards.";
  const edit = "Your client's BI tool is the wording your procurement team approved.";
  await h.text('1. ' + quoted);
  await h.setAnswer(0,edit);
  const word = await downloadWord(h);
  assert.equal(tableIn(word,'Requirements matrix','Ref')[0].Requirement,quoted);
  assert.ok(word.blocks.some(b => b.text === edit));
});

async function run() {
  const chosen = process.argv.slice(2).map(Number);
  for (const id of chosen) assert.ok(cases.has(id), 'Unknown item ' + id);
  const h = await open();
  try {
    for (const [id, check] of cases) {
      if (chosen.length && !chosen.includes(id)) continue;
      await check(h);
      console.log('PASS Round 5b item ' + id);
    }
    assert.deepEqual(h.errors, [], 'Unexpected browser errors');
  } finally { await h.close(); }
}
if (require.main === module) run().catch(e => { console.error(e); process.exitCode = 1; });
