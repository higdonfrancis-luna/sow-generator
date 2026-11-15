// Run from the repository root after python3 sow/canvas/build.py and python3 sow/build_site.py.
// Exercise the partner's file picker, row controls, menus and saved work on the built page.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {open} = require('../review_2026-11-09/harness.js');
const {bankCsvWriteBack, hasInlineBankSources, hasBankWordCitations} = require('../../test_rfp_part3.js');

const round5 = path.resolve(__dirname, '../chatgpt_round5');
const keys = fs.readdirSync(path.join(round5, 'gold')).filter(name => name.endsWith('.json'))
  .map(name => JSON.parse(fs.readFileSync(path.join(round5, 'gold', name), 'utf8')));
const bank = keys.find(key => /Briarhaven/.test(key.client));
const menuRows = {
  word: ['Full proposal, in Word', 'Every answer, ready to edit, print or send.'],
  workbook: ['Your filled-in workbook, in Excel', "Your answers written back into the client's own workbook."],
  checklist: ['My checklist, in Excel', 'Notes for you, not the client. One row per item.']
};
const norm = s => s.replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();
const fileOf = key => path.join(round5, key.file);
const pick = async (h, label) => {
  const i = await h.eval(label => RFPBuilder.state.questions.findIndex(q => q.label === label), label);
  assert.ok(i >= 0, 'Missing question ' + label);
  await h.page.locator('#rfp-questions li[data-i="' + i + '"] .rfp-q').click();
};
async function openMenu(h) {
  if (await h.page.locator('#rfp-dl-menu').isHidden()) await h.page.locator('#rfp-download-menu').click();
}
async function checkMenu(h, expected) {
  await openMenu(h);
  const options = (await h.page.locator('#rfp-dl-menu button').allInnerTexts()).map(norm);
  assert.deepEqual(options, expected.map(k => menuRows[k].join(' ')));
  await h.page.keyboard.press('Escape');
}
async function download(h, key, extension) {
  await openMenu(h);
  const item = h.page.locator('#rfp-dl-menu button').filter({hasText:menuRows[key][0]});
  assert.equal(await item.count(), 1, 'Missing ' + menuRows[key][0]);
  const [dl] = await Promise.all([h.page.waitForEvent('download', {timeout:20000}), item.click()]);
  assert.equal(path.extname(dl.suggestedFilename()), extension);
  if (await h.page.locator('#rfp-progress-close').isVisible()) await h.page.locator('#rfp-progress-close').click();
  return dl.path();
}
function openBook(file) {
  return JSON.parse(execFileSync('python3', ['-c',
    'from openpyxl import load_workbook\nimport sys,json\nwith open(sys.argv[1],"rb") as f:\n w=load_workbook(f,data_only=True)\n print(json.dumps({s.title:list(s.values) for s in w},default=str))',
    file], {encoding:'utf8', maxBuffer:32e6}));
}
function docText(file) {
  return execFileSync('python3', ['-c',
    'import zipfile,sys,xml.etree.ElementTree as E\nw="{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"\nwith zipfile.ZipFile(sys.argv[1]) as z:\n d=E.fromstring(z.read("word/document.xml"))\n print("\\n".join("".join(t.text or "" for t in p.iter(w+"t")) for p in d.iter(w+"p")))',
    file], {encoding:'utf8', maxBuffer:32e6});
}
async function edit(h, marker) {
  await h.page.click('#rfp-edit-btn');
  await h.page.fill('#rfp-edit',marker);
  await h.page.click('#rfp-save-edit');
  assert.equal(await h.page.locator('#rfp-answer .rfp-plain').textContent(),marker);
  assert.match(await h.panel(),/In your response/);
}

async function piles(h) {
  const file = 'legacy-unsorted.json', text = 'Who leads the project day to day?';
  await h.text('Request for Information\n1. ' + text + '\n\nBackground\nOur procurement coordinator is based in Duluth.');
  const q = await h.eval(() => RFPBuilder.state.questions.map(q => [q.kind,q.text]));
  assert.deepEqual(q, [['firm',text]]);
  const filters = await h.page.locator('[data-rfp-filter]').allTextContents();
  assert.ok(filters.some(t => /Your firm/.test(t)) && filters.every(t => !/to sort/i.test(t)));
  assert.ok(!(await h.page.locator('#rfp-results').innerText()).includes('Sort first'));
  assert.deepEqual(await h.page.locator('#rfp-questions .rfp-kind option').evaluateAll(es => es.map(e => e.value)), ['adobe','firm']);
  await h.page.locator('[data-rfp-filter="notpicked"]').click();
  assert.match(await h.page.locator('#rfp-questions').innerText(), /coordinator.*Duluth/i);
  const old = await h.eval(() => RFPBuilder.snapshot());
  old.questions[0].kind = 'unsure';
  old.questions[0].answer = 'Dana Bell leads delivery.';
  old.questions[0].status = 'used';
  old.filter = 'unsure'; old.selected = 0;
  await h.eval(() => RFPBuilder.clearAll());
  await h.page.locator('#rfp-work-file').setInputFiles({name:file,mimeType:'application/json',buffer:Buffer.from(JSON.stringify(old))});
  await h.page.waitForFunction(() => RFPBuilder.state.questions.length === 1);
  for (let i = 0; i < 2; i++) {
    if (i) await h.page.reload();
    await h.page.waitForFunction(() => window.RFPBuilder?.state.questions.length === 1);
    const restored = await h.eval(() => {
      const q = RFPBuilder.state.questions[0]; return [q.kind,q.answer,q.status,RFPBuilder.state.filter];
    });
    assert.deepEqual(restored.slice(0,3), ['firm','Dana Bell leads delivery.','used']);
    assert.notEqual(restored[3], 'unsure');
    await h.page.locator('[data-rfp-filter="firm"]').click();
    assert.match(await h.page.locator('#rfp-questions').innerText(), /Who leads the project/);
  }
  // The second path opens legacy work over the original issued file and merges its answer.
  await h.text('Request for Information\n1. ' + text + '\n\nBackground\nOur procurement coordinator is based in Duluth.');
  await h.page.locator('#rfp-work-file').setInputFiles({name:file,mimeType:'application/json',buffer:Buffer.from(JSON.stringify(old))});
  await h.page.waitForFunction(() => RFPBuilder.state.questions[0]?.status === 'used');
  const merged = await h.eval(() => RFPBuilder.state.questions.map(q => [q.kind,q.answer]));
  assert.deepEqual(merged,[['firm','Dana Bell leads delivery.']]);
  await checkMenu(h,['word','checklist']);
  await h.eval(() => RFPBuilder.clearAll());
  const csv = 'Ref,Requirement,Response\nQ1,and the accompanying evidence.,\nQ2,And describe how you would supply the evidence.,\nQ3,24/7 call centre coverage,\nQ4,in accordance with the,\nQ5,and,\nQ6,In accordance with ISO 27001,';
  await h.page.locator('#rfp-file').setInputFiles({name:'continuations.csv',mimeType:'text/csv',buffer:Buffer.from(csv)});
  await h.page.waitForFunction(() => RFPBuilder.state.name === 'continuations.csv');
  assert.deepEqual(await h.eval(() => RFPBuilder.state.questions.map(q => q.label)),['Q2','Q3','Q6']);
  await h.page.locator('[data-rfp-filter="notpicked"]').click();
  const skipped = await h.page.locator('#rfp-questions').innerText();
  assert.match(skipped,/and the accompanying evidence/);
  assert.match(skipped,/in accordance with the/);
  assert.ok(await h.eval(() => RFPBuilder.state.skipped.some(q => q.text.trim() === 'and')));
}
async function productPanel(h) {
  await h.file(fileOf(bank)); await pick(h,'A.1');
  assert.deepEqual(await h.page.locator('.rfp-drawn .rfp-chip [data-rm]').evaluateAll(es => es.map(e => e.dataset.rm)), ['aemsites']);
  assert.doesNotMatch(await h.panel(), /No match/);
  // Round 6b: A.1 names AEM Sites; journeys alone is not a product name.
  assert.equal(await h.page.locator('#rfp-scope-note').count(),0);
  const groups = await h.page.locator('#rfp-add optgroup').evaluateAll(gs => gs.map(g => ({name:g.label,
    options:[...g.querySelectorAll('option')].map(o => ({id:o.value,name:o.textContent.trim()}))})));
  assert.deepEqual(groups.map(g => g.name), ['In this RFI','Other Adobe products, A to Z','Outside systems, A to Z']);
  const catalog = await h.eval(() => RFP_CAT.products.map(p => ({id:p.id,outside:!!p.outside})));
  const eligible = catalog.filter(p => !bank.products_excluded.includes(p.id) && p.id !== 'aemsites');
  const included = groups[0].options.map(o => o.id);
  assert.deepEqual(included.slice().sort(),bank.products_proposed.filter(id => id !== 'aemsites').sort());
  const offered = groups.flatMap(g => g.options.map(o => o.id));
  assert.deepEqual(offered.slice().sort(),eligible.map(p => p.id).sort(), 'each eligible product or outside system appears once');
  assert.ok(groups[1].options.every(o => catalog.find(p => p.id === o.id)?.outside === false));
  assert.deepEqual(groups[2].options.map(o => o.id).sort(), eligible.filter(p => p.outside).map(p => p.id).sort());
  for (const g of groups.slice(1)) {
    const names = g.options.map(o => o.name);
    assert.deepEqual(names,names.slice().sort());
  }
  await h.page.selectOption('#rfp-add','aemforms');
  assert.ok(await h.page.locator('.rfp-drawn [data-rm="aemforms"]').count());
  await h.page.locator('.rfp-drawn [data-rm="aemforms"]').click();
  assert.equal(await h.page.locator('.rfp-drawn [data-rm="aemforms"]').count(),0);
  await h.page.locator('.rfp-drawn [data-rm="aemsites"]').click();
  assert.equal(await h.page.locator('.rfp-drawn [data-rm]').count(),0);
  assert.equal(await h.page.locator('#rfp-scope-note').count(),0,'Removing the final product manually must not blame a client exclusion');
}
async function noMatch(h) {
  await h.text('Request for Information\n1. We will not use Adobe Target. Describe the Adobe Target implementation approach for our public website.');
  await pick(h,'1');
  assert.match(await h.panel(),/your client rules out Adobe Target|your client rules out Target/i);
  assert.doesNotMatch(await h.panel(),/No match in the catalog/);
  assert.equal(await h.page.locator('#rfp-add option[value="target"]').count(),0);
  assert.equal(await h.page.locator('.rfp-drawn [data-rm="target"]').count(),0);
  await h.text('Request for Information\n1. We will not use Journey Optimizer. Describe your proposed AEM Sites approach for deposit and mortgage enquiry journeys.');
  await pick(h,'1');
  assert.match(await h.panel(),/Your client rules out Journey Optimizer, so this answer draws on AEM Sites only\./i);
  assert.deepEqual(await h.page.locator('.rfp-drawn [data-rm]').evaluateAll(es => es.map(e => e.dataset.rm)),['aemsites']);
  await h.text('Request for Information\n1. Describe how you would implement AEM Guides for technical documentation.');
  await pick(h,'1');
  assert.match(await h.panel(),/not (?:in|cover)|does not cover/i);
  assert.doesNotMatch(await h.panel(),/your client rules out/i);
}
async function longNote(h) {
  const text = 'Describe the AEM Sites workflow for public documents. ' + 'Include the acceptance evidence, delivery responsibilities and action needed to restore the approved version after review. '.repeat(12);
  await h.text('Request for Information\n1. '+text);
  const row = h.page.locator('#rfp-questions li[data-i="0"]');
  assert.equal(await row.locator('.rfp-why').textContent(), 'This line is very long: it may hold several requirements.');
  assert.doesNotMatch(await row.innerText(),/Adobe RFI Agent/);
  await row.getByRole('button',{name:/Show all/}).click();
  assert.match(await row.innerText(), /restore the approved version after review/);
}

async function checklistAndWord(h) {
  await h.file(fileOf(bank));
  await checkMenu(h,['word','checklist']);
  await pick(h,'A.2');
  const confirmed = 'The bank supplied a verified copy of its asset register.';
  await h.page.locator('#rfp-answer .rfp-fact').first().fill(confirmed);
  const edited = 'We will check the inventory before migration. ' + confirmed;
  await edit(h,edited);
  await pick(h,'A.1');
  const leftOutFact = 'The bank approved three public page templates.';
  await h.page.locator('#rfp-answer .rfp-fact').first().fill(leftOutFact);
  await h.page.click('#rfp-skip');
  assert.match(await h.panel(),/Left out/);
  const book = openBook(await download(h,'checklist','.xlsx'));
  assert.equal(Object.keys(book)[0], 'My checklist');
  const [header,...rows] = book['My checklist'];
  assert.deepEqual(header,['Ref','Question','Type','Item','In the response','Done']);
  assert.ok(rows.length && rows.every(([ref,question,type,item,inResponse,done]) => ref && question &&
    ['License','Ask your client','Confirm with Adobe','Assumption'].includes(type) &&
    typeof item === 'string' && item.trim().length > 4 && ['Yes','No'].includes(inResponse) && !done));
  const firstQuestion = rows.findIndex(r => r[0] !== 'All');
  assert.ok(firstQuestion > 0);
  assert.ok(rows.slice(0,firstQuestion).every(r => r[1] === 'Whole RFI'));
  assert.ok(rows.slice(firstQuestion).every(r => r[0] !== 'All' && r[1] !== 'Whole RFI'));
  const whole = rows.slice(0,firstQuestion);
  const globalItems = whole.map(r => norm(r[3]).toLowerCase());
  assert.equal(new Set(globalItems).size,globalItems.length);
  assert.ok(rows.slice(firstQuestion).every(r => !globalItems.includes(norm(r[3]).toLowerCase())));
  for (const name of [/real.time (?:customer data platform|cdp)|RT-CDP/i,/journey optimizer|\bAJO\b/i,/workfront/i,/adobe analytics/i]) {
    const hits = rows.filter(r => name.test(r[3]) && /rules? out|excluded|declin|out of scope|will not license/i.test(r[3]));
    assert.equal(hits.length,1,'Exactly one whole-RFI exclusion for '+name);
    assert.equal(hits[0][0],'All');
    assert.equal(hits[0][2],'Assumption');
  }
  const includedFact = rows.filter(r => r[3].includes(confirmed));
  assert.equal(includedFact.length,1);
  assert.deepEqual([includedFact[0][0],includedFact[0][2],includedFact[0][4]],['A.2','Ask your client','Yes']);
  assert.ok(rows.some(r => r[3].includes(leftOutFact) && r[0] === 'A.1' && r[4] === 'No'));
  const skipped = rows.filter(r => r[0] === 'A.1' && r[2] === 'Ask your client');
  assert.ok(skipped.length && skipped.every(r => r[4] === 'No'), 'a left-out answer cannot contain a requested client fact');
  const beforeCopy = JSON.stringify(book);
  const repeated = openBook(await download(h,'checklist','.xlsx'));
  assert.equal(JSON.stringify(repeated),beforeCopy,'Repeated downloads preserve the checklist and the partner’s choices');
  const proposal = docText(await download(h,'word','.docx'));
  assert.ok(proposal.includes(edited) && proposal.includes('A.1') && proposal.includes('A.2') && proposal.includes('To write'));
  const wordKey = keys.find(k => k.file.endsWith('.docx'));
  await h.file(fileOf(wordKey));
  await checkMenu(h,['word','checklist']);
}
async function spreadsheet(h) {
  const file = path.join(round5,'fixtures','bellwater-city.xlsx');
  // Observe the actual in-browser read, including its busy state, without replacing the library.
  let release;
  const permit = new Promise(resolve => {release = resolve;});
  const route = '**/lib/xlsx.mini.min.js';
  await h.page.route(route, async r => {await permit; await r.continue();});
  const fetching = h.page.waitForRequest(request => request.url().endsWith('/lib/xlsx.mini.min.js'));
  try {
    await h.page.locator('#rfp-file').setInputFiles(file);
    await fetching;
    assert.match(await h.page.locator('#rfp-status').innerText(),/Reading bellwater-city\.xlsx/);
  } finally {release();}
  await h.page.waitForFunction(() => RFPBuilder.state.name === 'bellwater-city.xlsx' && RFPBuilder.state.questions.length === 16);
  await h.page.unroute(route);
  await checkMenu(h,['word','workbook','checklist']);
  await pick(h,'A.1');
  const marker = 'The clerk will verify the correction with the resident and save the audit record.';
  await edit(h,marker);
  await pick(h,'A.2'); await h.page.click('#rfp-skip');
  await pick(h,'A.3'); await h.page.click('#rfp-use');
  const original = openBook(file), filled = openBook(await download(h,'workbook','.xlsx'));
  assert.deepEqual(filled.Instructions,original.Instructions,'The original instructions sheet is preserved');
  const source = original['Response form'], copy = filled['Response form'];
  assert.equal(source.length,copy.length);
  assert.deepEqual(copy.map(r => r.slice(0,3)),source.map(r => r.slice(0,3)), 'The client’s references, requirements and priorities remain in their own cells');
  assert.deepEqual(copy[0],['Ref','Requirement','Mandatory','Response']);
  const response = ref => copy.find(r => r[0] === ref)[3];
  assert.equal(response('A.1'),marker);
  assert.ok(!response('A.2') && response('A.3')?.length > 40,'Skipped and approved answers go to the correct response cells');
  assert.ok(Object.keys(openBook(await download(h,'checklist','.xlsx'))).includes('My checklist'));
  assert.ok(docText(await download(h,'word','.docx')).includes(marker));
}
async function keysAndKinds(h) {
  assert.equal(keys.length,19);
  for (const key of keys) {
    const read = await h.file(fileOf(key));
    assert.equal(read.count,key.questions.length,key.client);
    assert.deepEqual(read.questions.map(q => q.kind),key.questions.map(q => q.kind),key.client);
    const ui = await h.page.locator('#rfp-questions li[data-i]').evaluateAll(items => items.map(el => [
      el.dataset.kind,
      !!el.querySelector('.rfp-kind option[value="unsure"]'),
      /Sort first|To sort/i.test(el.innerText)
    ]));
    assert.equal(ui.length,key.questions.length,key.client);
    assert.ok(ui.every(([kind,extraOption,sortAction]) => ['adobe','firm'].includes(kind) && !extraOption && !sortAction),key.client);
  }
}

async function review6b1(h) {
  await h.file(fileOf(bank)); await pick(h,'A.1');
  assert.deepEqual(await h.page.locator('.rfp-drawn [data-rm]').evaluateAll(es => es.map(e => e.dataset.rm)), ['aemsites']);
  assert.equal(await h.page.locator('#rfp-scope-note').count(),0,
    'An unnamed excluded product must not get a scope note from the word journeys');
  for (const name of ['Journey Optimizer','AJO']) {
    const question = 'Describe how you would use '+name+' with AEM Sites for our public website.';
    const read = await h.text('Request for Information\n\nConstraints\nWe will not use Journey Optimizer.\n\nRequirements\n1. '+question);
    assert.deepEqual(read.questions.map(q => q.text),[question],'The refusal stays outside the question being tested');
    await pick(h,'1');
    assert.match(await h.page.locator('#rfp-scope-note').innerText(), /Your client rules out Journey Optimizer/);
    assert.equal(await h.page.locator('.rfp-drawn [data-rm="ajo"]').count(),0);
  }
  // Related features and ordinary words can guide drafting without naming the excluded product.
  for (const [excluded, wording] of [
    ['Adobe Target', 'measure the target audience for A/B testing'],
    ['Adobe Analytics', 'use our existing report suite'],
    ['Adobe Analytics', 'inform our analytics strategy'],
    ['Real-Time CDP', 'connect our digital experience platform'],
    ['AEM Forms', 'support adaptive forms for mobile visitors'],
    ['Workfront', 'use Adobe Workfront Planning for our delivery calendar'],
    ['Creative Cloud', 'publish assets edited in Photoshop']
  ]) {
    const question = 'Describe how AEM Sites would ' + wording + '.';
    const found = await h.text('Request for Information\n\nConstraints\nWe will not use ' + excluded +
      '.\n\nRequirements\n1. ' + question);
    assert.deepEqual(found.questions.map(q => q.text), [question]);
    await pick(h, '1');
    assert.equal(await h.page.locator('#rfp-scope-note').count(), 0, wording);
  }

}

async function review6b2(h) {
  const source = fs.readFileSync(path.resolve(__dirname,'../../rfp_answers.js'),'utf8');
  const checklist = source.slice(source.indexOf('function checklistRows()'),source.indexOf('async function downloadChecklist()'));
  assert.match(checklist,/\bextraLines\s*\(\s*d\s*\)/,
    'The checklist must pass its draft directly, with no obsolete excluded override');
  assert.doesNotMatch(source, /\/\/[^\n]*rules out[^\n]*\nfunction extraLines/,
    'The extraLines comment must describe only the notes it still supplies');
  await h.file(fileOf(bank));
  const rows = await h.checklist();
  assert.equal(rows.filter(r => r[0] === 'All' && /rules out/.test(r[3])).length,1);
  assert.ok(rows.slice(1).some(r => r[0] !== 'All' && r[2] === 'Ask your client'));
}

async function review6b3(h) {
  const grid = [['Ref','Requirement','Comply','Response'],
    ['A.1','Describe the AEM Sites publishing workflow.','Yes','']];
  const table = await h.eval(grid => RFPReaders.table(grid),grid);
  assert.ok(!Object.hasOwn(table.rows[0],'comply'),'The reader must not import unused compliance values');
  assert.equal(table.cols.comply,2);
  assert.equal(table.cols.response,3,'Compliance is metadata, not the answer column');
  const csv = grid.map(row => row.join(',')).join('\n');
  await h.page.locator('#rfp-file').setInputFiles({name:'compliance.csv',mimeType:'text/csv',buffer:Buffer.from(csv)});
  await h.page.waitForFunction(() => RFPBuilder.state.name === 'compliance.csv');
  assert.equal(await h.eval(() => RFPBuilder.state.questions.length),1);
  assert.ok(await h.eval(() => !Object.hasOwn(RFPBuilder.state.questions[0],'comply')),
    'The finder must not recreate the unused compliance value');
  await pick(h,'A.1');
  const marker = 'We will review and publish approved AEM Sites content.';
  await edit(h,marker);
  const filled = await h.workbook('rfp-writeback');
  assert.deepEqual(Object.values(filled.sheets)[0][1].slice(0,grid[0].length),['A.1',grid[1][1],'Yes',marker],
    'Writeback preserves the client compliance cell and fills only the response');
  const legacy = await h.eval(() => RFPBuilder.snapshot());
  legacy.questions[0].comply = 'Yes';
  await h.eval(() => RFPBuilder.clearAll());
  await h.page.locator('#rfp-work-file').setInputFiles({name:'legacy-comply.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(legacy))});
  await h.page.waitForFunction(() => RFPBuilder.state.questions[0]?.answer);
  await h.page.reload();
  await h.page.waitForFunction(() => RFPBuilder.state.questions[0]?.answer);
  assert.deepEqual(await h.eval(() => RFPBuilder.state.questions.map(q => [q.label,q.text,q.status,q.answer])),
    [['A.1',grid[1][1],'used',marker]],'A legacy draft holding comply reopens with its answer');
  assert.ok(docText(await download(h,'word','.docx')).includes(marker));
  const source = fs.readFileSync(path.resolve(__dirname,'../../rfp_answers.js'),'utf8');
  assert.doesNotMatch(source.slice(0,source.indexOf('const ')),/The Excel adds Section/);
  const metadataOnly = await h.eval(() => RFPReaders.table([
    ['Requirement','Comply'],['Describe the AEM Sites workflow.','Yes']]));
  assert.ok(metadataOnly && metadataOnly.cols.response === undefined,
    'A requirement and compliance table has no writable answer column');
}

async function review6b4(h) {
  const csv = await bankCsvWriteBack(h);
  assert.ok(hasInlineBankSources(csv), 'Bank 2.6 includes its numbered sources in the CSV response');
  const rows = Object.values(csv.sheets)[0], row = rows.find(r => r[1] === '2.6');
  const sourceStart = row[3].indexOf('Adobe sources for the product facts above');
  // Leave the valid source list in the file, but on another requirement.
  rows.find(r => r[1] === '2.5')[3] += row[3].slice(sourceStart);
  row[3] = row[3].slice(0, sourceStart).trimEnd();
  assert.equal(hasInlineBankSources(csv), false, 'Sources on another CSV row do not support 2.6');
}

async function review6b5(h) {
  const workbook = path.resolve(__dirname, '../../qa/rfp_fixtures/bank_rfp.xlsx');
  const addendum = '9.1 Where is our data hosted, and what security certifications apply to AEM Sites, Marketo Engage and Brand Concierge?';
  await h.page.setInputFiles('#rfp-file', [
    {name:'bank_rfp.xlsx', mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer:fs.readFileSync(workbook)},
    {name:'Security addendum.txt', mimeType:'text/plain', buffer:Buffer.from(addendum)}
  ]);
  await h.page.waitForFunction(() => RFPBuilder.state.questions.some(q => q.label === '9.1'));
  const doc = await h.word();
  assert.ok(hasBankWordCitations(doc), 'Bank 2.6 cites its numbered Adobe sources in Word');
  // Remove the superscript formatting only from 2.6, keeping the text and other answers intact.
  let removed = 0, elsewhere = 0;
  for (const section of doc.sections) {
    let ref;
    for (const p of section.blocks) {
      if (p.style === 'Heading2') ref = /^(\d+\.\d+)\b/.exec(p.text)?.[1];
      else if (p.citations && ref === '2.6') { removed += p.citations.length; delete p.citations; }
      else if (ref && p.citations) elsewhere += p.citations.length;
    }
  }
  assert.ok(removed > 5 && elsewhere > 5, 'The downloaded Word file has numeric citations in 2.6 and other real answers');
  assert.equal(hasBankWordCitations(doc), false, 'Superscripts on other answers do not support 2.6');
}

async function review6b6(h) {
  const {wordCopyIssues} = require('../../qa/rfp_word_copy.js');
  await h.file(path.resolve(__dirname, '../../qa/rfp_fixtures/bank_rfp.xlsx'));
  const doc = await h.word();
  assert.deepEqual(wordCopyIssues(doc), {clientVoice:null,partnerNote:null,internalStatus:null},
    'The original downloaded Word copy passes all three screeners');
  const phrases = {
    clientVoice: ['your client','the Client'],
    partnerNote: ['Notes for you','Ask your client','Adobe licenses this proposal','Confirm with Adobe','Assumptions behind','Internal.'],
    internalStatus: ['Drafted by the partner','not yet reviewed','Skipped by the partner','No catalog match']
  };
  for (const [field, values] of Object.entries(phrases)) {
    for (const text of values) {
      const paragraph = {text};
      for (const [where, blocks] of [
        ['first paragraph',[paragraph, ...doc.blocks]],
        ['last paragraph',[...doc.blocks, paragraph]],
        ['table cell',[...doc.blocks, {rows:[['Working table'],[text]]}]]
      ]) {
        assert.equal(wordCopyIssues({blocks})[field], text, field + ' must detect ' + text + ' in the ' + where);
      }
    }
  }
}

async function review6b7(h) {
  const {formsRfp, hasExpectedRunPiles} = require('../../test_rfp_step74.js');
  const {questions} = await h.text(formsRfp);
  assert.ok(hasExpectedRunPiles(questions),'The status report is Your firm and the seven implementation parts are Adobe products');
  const parts = questions.filter(q => /^3 \(\d+\)$/.test(q.label));
  assert.equal(parts.length,8);
  for (const part of parts) {
    const changed = questions.map(q => q === part ? {...q,kind:q.kind === 'firm' ? 'adobe' : 'firm'} : q);
    assert.equal(hasExpectedRunPiles(changed),false,'The check detects the wrong pile for ' + part.label + ': ' + part.text.slice(0,70));
  }
}

(async () => {
  const failures = [];
  const groups = {piles,productPanel,noMatch,longNote,checklistAndWord,spreadsheet,keysAndKinds,review6b1,review6b2,review6b3,review6b4,review6b5,review6b6,review6b7};
  const requested = process.argv.slice(2);
  assert.ok(requested.every(name => Object.hasOwn(groups,name)), 'Unknown Round 6 acceptance group');
  for (const [name,run] of Object.entries(groups)) {
    if (requested.length && !requested.includes(name)) continue;
    const h = await open();
    try {
      await run(h);
      assert.deepEqual(h.errors,[]);
      console.log('PASS '+name);
    } catch (error) {
      failures.push(name);
      console.error('FAIL '+name+'\n'+error.stack);
    } finally {await h.close();}
  }
  assert.deepEqual(failures,[], 'Round 6 browser acceptance failures');
})().catch(error => {console.error(error);process.exitCode = 1;});
