// Exercise the shipped reader and downloads through the file and paste controls.
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const {open} = require('../review_2026-11-09/harness.js');

const {downloadWord, tableIn, technicalBodies} = require('./test_word_complete.js');

const cases = new Map();
const demoFile = name => path.join(__dirname,'../demo',name);
const reviewFile = name => path.join(__dirname,'review_5c',name);
const website = 'Describe how you would build our new public website on AEM Sites with Edge Delivery Services.';
const analytics = 'Explain how you would implement Customer Journey Analytics for our website.';

async function limits(h) {
  return h.eval(() => RFPBuilder.state.questions.map(q => ({
    label:q.label, section:q.section, parsed:q.limit, max:RFPAnswers.limitOf(q)?.max ?? null,
    words:RFPAnswers.wordsIn(RFPAnswers.usedText(q,true))
  })));
}
function checkLimits(rows, expected) {
  assert.deepEqual(rows.map(r => r.parsed),expected,'Limits assigned by the reader');
  assert.deepEqual(rows.map(r => r.max),expected,'Effective answer word limits');
  for (const [i,row] of rows.entries()) if (expected[i] !== null && row.words)
    assert.ok(row.words <= expected[i],row.label + ' has ' + row.words + ' words under a cap of ' + expected[i]);
}

cases.set(1, async h => {
  await h.file(demoFile('Tallgrass_Home_and_Garden_Inc_RFP.pdf'));
  const rows = await limits(h);
  assert.equal(rows.length,20);
  assert.ok(rows.some(r => r.words > 0));
  checkLimits(rows,Array(20).fill(249));
  await h.text(['Section 1. Procurement','Keep every answer below 130 words.',
    'Section 2. Delivery','2.1 '+website,'Section 3. Analytics','3.1 '+analytics].join('\n\n'));
  checkLimits(await limits(h),[129,129]);
});

cases.set(2, async h => {
  for (const [heading,rule] of [
    ['Section 1. Instructions to Respondents','All responses must not exceed 90 words.'],
    ['Section 1. Instructions to Respondents','Responses must not exceed 90 words.'],
    ['Section 1. Response guidance','Responses must not exceed 90 words.']
  ]) {
    await h.text(['Request for Information: Lakeshore Health Website',heading,
      rule+'\nSubmit your response by email to the procurement office.',
      'Section 2. Website Requirements','2.1 '+website,'2.2 '+analytics].join('\n\n'));
    checkLimits(await limits(h),[90,90]);
  }
  await h.text(['Section 1. Response guidance','Responses in this section must not exceed 90 words.',
    '1.1 '+website,'Section 2. Delivery','2.1 '+analytics].join('\n\n'));
  checkLimits(await limits(h),[90,null]);
});

// Create ordinary physical PDF headings and wrapped paragraphs with Chromium's print engine.
async function openPdf(h, blocks) {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'round5c-pdf-'));
  const file=path.join(dir,'procurement.pdf'), page=await h.page.context().newPage();
  try {
    await page.setContent('<style>body{font:11pt Arial} h1{font-size:18pt} h2{font-size:14pt} p{margin:0 0 5pt} h2{margin:12pt 0 5pt}</style>');
    await page.evaluate(rows=>{for(const [tag,text] of rows){const el=document.createElement(tag);el.textContent=text;document.body.append(el);}},blocks);
    await page.pdf({path:file,format:'Letter',margin:{top:'0.75in',bottom:'0.75in',left:'0.75in',right:'0.75in'}});
    return await h.file(file);
  } finally { await page.close();fs.rmSync(dir,{recursive:true,force:true}); }
}

cases.set(3, async h => {
  const forms=[
    ['Maximum 300 words per question.',300], ['Proposals should not exceed 400 words per question.',400],
    ['Your response to each question must not exceed 90 words.',90], ['Respondents must not exceed 140 words per answer.',140],
    ['Each question has a 250-word limit.',250], ['The response to each item shall not exceed 230 words.',230],
    ['The narrative for each response must be not exceeding 200 words.',200]
  ];
  for (const [line,n] of forms) for (const heading of ['Request for Information','Section 1 - Website and analytics']) {
    await h.text([heading,line,'1. '+website,'2. '+analytics].join('\n'));
    checkLimits(await limits(h),[n,n]);
  }
  await openPdf(h,[['h1','Request for Information'],['h2','Section 3 - Analytics'],
    ['p','Maximum 150 words per answer.'],['p','3.1 '+analytics],['p','3.2 '+website]]);
  checkLimits(await limits(h),[150,150]);

  await h.text(['Request for Information','1. The response should not exceed 100 words. '+website,'2. '+analytics].join('\n\n'));
  const numbered=await limits(h);
  assert.deepEqual(numbered.map(r=>r.label),['1','2']);
  checkLimits(numbered,[100,null]);
  await h.text(['Section 1. Instructions','Each reply should be no more than 150 words.','Section 2. Delivery','2.1 '+website].join('\n\n'));
  checkLimits(await limits(h),[150]);
  await h.text(['Section A. Website (170 words per response)','A.1 '+website,
    'Section B. Reporting','B.1 '+analytics].join('\n\n'));
  checkLimits(await limits(h),[170,null]);
  const text=['Section 1. Instructions','Maximum 400 words per question.',
    'Section 2. Implementation','Responses in this section must not exceed 75 words.',
    '2.1 '+website,'2.2 '+analytics+' (no word limit)','Section 3. Reporting','3.1 '+analytics].join('\n\n');
  await h.text(text);
  checkLimits(await limits(h),[75,null,400]);
  // Old work may know a row was parsed without saving its budget. Recover the
  // applicable limit from its source paragraphs without borrowing another file's limit.
  await h.page.setInputFiles('#rfp-file',[
    {name:'implementation.txt',mimeType:'text/plain',buffer:Buffer.from(text)},
    {name:'uncapped.txt',mimeType:'text/plain',buffer:Buffer.from('Section 2. Implementation\n\n2.1 '+analytics)}
  ]);
  await h.page.waitForFunction(()=>RFPBuilder.state.questions.length===4);
  const legacy=await h.eval(()=>{
    const snap=RFPBuilder.snapshot();
    for(const q of snap.questions){q.limit=null;q.limitScoped=true;}
    RFPBuilder.restore(snap);
    return RFPBuilder.state.questions.map(q=>RFPAnswers.limitOf(q)?.max??null);
  });
  assert.deepEqual(legacy,[75,null,400,null]);

  for(const [oldRule,max] of [['Use fewer than 95 words.',94],['Narratives shall not exceed 95 words.',95]]){
    await h.text(['Section 1. Response guidance',oldRule,'Section 2. Web','2.1 '+website].join('\n\n'));
    assert.equal((await limits(h))[0].max,max,'Base paragraph fallback: '+oldRule);
  }
  await h.text(['Section A. Website','Responses in this section must not exceed 100 words.','A.1 '+website,
    'Section B. Reporting','Responses in this section must not exceed 75 words.','B.1 '+analytics].join('\n\n'));
  const oldSections=await h.eval(()=>{
    const s=RFPBuilder.snapshot();
    for(const q of s.questions){q.section='';q.limit=null;delete q.order;}
    RFPBuilder.restore(s);
    return RFPBuilder.state.questions.map(q=>RFPAnswers.limitOf(q)?.max??null);
  });
  assert.deepEqual(oldSections,[100,75],'Earlier work can recover a missing section by matching its original question paragraph');
});

cases.set(4, async h => {
  async function checkForm(max) {
    const rows=await limits(h);
    assert.deepEqual(rows.map(r=>[r.label,r.section]),[
      ['A.1','A. Public Website'], ['A.2','A. Public Website'], ['B.1','B. Analytics']
    ],'Only requests are rows, each under its physical lettered heading');
    checkLimits(rows,[max,max,null]);
    assert.ok(rows[0].words>0);
  }
  await h.file(reviewFile('lettered_limit_s1.pdf'));
  await checkForm(100);
  for(const [line,max] of [['Answers in this section must not exceed 120 words.',120],['Each response in this section must stay under 160 words.',159]]){
    await openPdf(h,[['h1','Request for Information'],['h2','A. Public Website'],['p',line],
      ['p','A.1 '+website],['p','A.2 Describe how to administer AEM Sites.'],['h2','B. Analytics'],['p','B.1 '+analytics]]);
    await checkForm(max);
  }
});

cases.set(5, async h => {
  const title='Section B. Website on AEM Sites with Edge Delivery Services';
  const request='B.1 Describe how you would release the new website.';
  for (const instruction of ['Keep responses in this section under 300 words.', 'Please limit each answer to a maximum of 250 words.', 'Each reply should be no more than 150 words.', 'Answers in this section must not exceed 250 words.']) {
    // Same font and closely spaced lines: section names must still end at the physical heading line.
    const {questions}=await openPdf(h,[['h1','Request for Information'],['div',title],['div',instruction],['p',request]]);
    assert.deepEqual(questions.map(q=>[q.label,q.section]),[['B.1',title]],instruction);
  }
  // Native Word heading paragraphs take the same route through the finder.
  const fromWord = await h.eval(([heading,request])=>RFPFinder.read([{heading},{text:'Each reply should be no more than 150 words.'},{text:request}]).questions,[title,request]);
  assert.equal(fromWord[0].section,title);
});

cases.set(6, async h => {
  const chapters=['Submission Instructions','Scope of Work','Background','Audience measurement'];
  const requests=['Describe your firm and its experience.','Describe how you would implement AEM Sites.','Explain how you would migrate the current site.','Describe how you would implement Customer Journey Analytics.'];
  const {questions}=await openPdf(h,[['h1','Request for Information'],...chapters.flatMap((name,i)=>[[i===3?'strong':'h2',name],['p',(i+1)+'. '+requests[i]]])]);
  assert.deepEqual(questions.map(q=>[q.text,q.section]),requests.map((text,i)=>[text,chapters[i]]));
  assert.ok((await h.eval(()=>RFPBuilder.state.skipped.map(x=>x.text))).every(text=>!chapters.includes(text)));
  for(const [lead,request] of [
    ['Our preferred launch is in June.','1. Describe how you would build an accessible AEM Sites website.'],
    ['', 'Describe how you would build an accessible AEM Sites website.']
  ]){
    const title='Delivery checkpoints', blocks=[['h1','Request for Information'],['h2',title]];
    if(lead)blocks.push(['p',lead]);
    const result=await openPdf(h,[...blocks,['p',request]]);
    assert.deepEqual(result.questions.map(q=>q.section),[title],'The first styled heading applies across a background sentence and to uncoded requests');
  }
});

cases.set(7, async h => {
  const chapters=['I. Introduction','II. Scope of Work','III. Analytics Requirements','IV. Supplier Information'];
  const blocks=[['h1','Request for Information'],...chapters.flatMap((name,i)=>[['h2',name],['p',(i+1)+'.1 Describe your approach to the work.'],['p',(i+1)+'.2 Explain how your firm would verify delivery.']])];
  const expected=chapters.flatMap((s,i)=>[[i+1+'.1',s],[i+1+'.2',s]]);
  const pdf=await openPdf(h,blocks);
  assert.deepEqual(pdf.questions.map(q=>[q.label,q.section]),expected);
  const pasted=await h.find(blocks.map(([,s])=>s).join('\n'));
  assert.deepEqual(pasted.map(q=>[q.label,q.section]),expected,'Roman headings also work in plain text');
  const nested=await h.find('1. Describe your project in detail:\n(i) Describe the migration approach.\n(ii) Explain how you test releases.');
  assert.ok(nested.some(q=>q.label.includes('ii')&&q.text.includes('test releases')),'Roman subquestions remain requests');
});

cases.set(8, async h => {
  const a='Describe how you would build our site on AEM Sites with Edge Delivery Services.';
  const b='Explain how you would implement Customer Journey Analytics.';
  const text=['Request for Information','','Instructions','All responses are due on 15 January.',a,'','Background','We run Sitecore today.',b].join('\n');
  await h.text(text);
  const actual=await h.eval(()=>({rows:RFPBuilder.state.questions.map(q=>[q.text,q.section]),paragraphs:RFPBuilder.state.paragraphs}));
  assert.deepEqual(actual.rows,[[a,'Instructions'],[b,'Background']]);
  assert.ok(actual.paragraphs.includes('All responses are due on 15 January.')&&actual.paragraphs.includes('We run Sitecore today.'),'Both context sentences stay available to the writer');
  await h.text('Requirements\nResponses must not exceed 120 words. '+a);
  assert.deepEqual(await h.eval(()=>RFPBuilder.state.questions.map(q=>[q.text,RFPAnswers.limitOf(q)?.max])),[[a,120]]);
});

cases.set(9, async h => {
  const issuer='Northfield Water Authority';
  const a='A.2 '+issuer+' will not license Adobe Target or Adobe Analytics in this program. Describe how you would test two versions of the Pay my bill page and report results within 30 days of launch.';
  const b='A.3 We do not use Marketo Engage and will not license it. Explain how site forms would reach our Salesforce CRM.';
  await h.text([issuer,'Request for Information','Section A. Website',a,b].join('\n\n'));
  const excluded=await h.eval(()=>[...RFPAnswers.kbExclusions(RFPBuilder.state.questions.find(q=>q.label==='A.3'))]);
  for (const id of ['target','aa']) assert.ok(excluded.includes(id),'The issuer excludes '+id+' throughout this procurement');
  const word=await downloadWord(h);
  const matrix=tableIn(word,'Requirements matrix','Ref');
  assert.equal(matrix.find(r=>r.Ref==='A.2').Requirement,a.slice(4),'Keep the client wording in the matrix');
  const bodies=technicalBodies(word,['A.2','A.3']);
  assert.ok(bodies.get('A.3')?.paragraphs.length,'A.3 has an authored answer');
  const sourceFields=word.sections.filter(s=>s.title==='Services and effort'||/sources/i.test(s.title)).flatMap(s=>s.blocks);
  assert.doesNotMatch(JSON.stringify([sourceFields,...Array.from(bodies.values()).map(x=>x.paragraphs)]),/Adobe Analytics|Adobe Target/);
  const scopeControls=await h.eval(()=>{
    const q={text:'Describe how the implementation will work.'};
    const own='A.2 Juniper Water Authority will not license Adobe Target in this program. Describe the available choices.';
    const other='Northfield Water Authority\nRiverside Water Authority will not license Adobe Target in this program.';
    return [own,other].map(scope=>[...RFPAnswers.kbExclusions(q,scope)]);
  });
  assert.ok(scopeControls[0].includes('target'),'An issuer may name itself directly in the requirement');
  assert.ok(!scopeControls[1].includes('target'),'A separately identified buyer sets the document scope');
  const foreign=await h.eval(()=>[...RFPAnswers.kbExclusions({text:'Describe the implementation approach.'},'Northfield Water Authority\nOur subcontractor, Pine Gate Agency, will not license Adobe Target for its own advisory work.')]);
  assert.ok(!foreign.includes('target'),'A third party refusal does not define the buyer scope');
});

const briarhaven=path.join(__dirname,'fixtures','Briarhaven_Community_Bank_RFP.pdf');
const catalog=require('../../canvas/catalog.json').lines;

function assertServiceOwner(word, bodies, id, ref, work) {
  const rows=tableIn(word,'Services and effort','Service').filter(row=>row.Service===catalog[id].name);
  assert.equal(rows.length,1,id+' must be counted exactly once');
  assert.equal(rows[0]['Counted in'],ref,id+' must be charged where its work is described');
  assert.equal(Number(rows[0]['Planning hours'].split(' ')[0].replaceAll(',','')),catalog[id].base);
  const text=bodies.get(ref)?.paragraphs.join(' ')||'';
  assert.match(text,work,ref+' must describe '+catalog[id].name);
  assert.doesNotMatch(text,/Estimate in discovery|counted elsewhere in the requirements matrix/i);
}

cases.set(10,async h=>{
  const {questions}=await h.file(briarhaven);
  for(const approved of [false,true]){
    if(approved)for(const q of questions)await h.setStatus(q.i,'used');
    const word=await downloadWord(h),bodies=technicalBodies(word,questions.map(q=>q.label));
    assertServiceOwner(word,bodies,'AS07','B.4',/expir|replace|withdraw/i);
    assertServiceOwner(word,bodies,'SI04','F.2',/cutover|go-live/i);
    if(approved){
      assertServiceOwner(word,bodies,'AS01','B.1',/user group|admin console|DAM onboarding/i);
      assertServiceOwner(word,bodies,'AF02','C.1',/form templates?|adaptive form template|reusable fragment/i);
      await h.eval(()=>{const store=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){
        if(key==='abv-sow-handoff')window.testHandoff=JSON.parse(value);
        return store.call(this,key,value);
      };});
      await h.page.click('#rfp-to-sow');
      await h.page.click('#rfp-handoff-go');
      const handoff=await h.eval(()=>window.testHandoff.managed.map(id=>RFPAnswers.clientCopy(RFP_CAT.lines[id].name)).sort());
      await h.page.locator('.steps [data-step="rfp"]').click();
      const serviceNames=tableIn(word,'Services and effort','Service').map(r=>r.Service).filter(name=>!name.startsWith('Total,')).sort();
      assert.deepEqual(serviceNames,handoff,'Reassigning ownership must preserve the approved SOW selections');
    }
  }
  const keep=new Set(['A.3','B.1','D.4','F.2']);
  for(const q of questions)if(!keep.has(q.label))await h.setStatus(q.i,'skipped');
  const partial=await downloadWord(h),bodies=technicalBodies(partial,[...keep]);
  assertServiceOwner(partial,bodies,'AS07','B.1',/expir|version|withdraw/i);
});

cases.set(11,async h=>{
  const {questions}=await h.file(reviewFile('northfield60.pdf'));
  const word=await downloadWord(h),bodies=technicalBodies(word,questions.map(q=>q.label));
  for(const [id,ref,copy] of [
    ['AS06','E.10',/asset reports|DAM administration/i],
    ['JO06','C.10',/journey (?:and campaign reports|operations)/i],
    ['RT06','C.10',/audiences?|dataflows?/i],
    ['CJ06','B.8',/journey analysis|attribution|fallout/i],
    ['TG05','D.9',/test design|activities on the roadmap/i],
    ['SI02','A.6',/core components|components and templates/i]
  ])assertServiceOwner(word,bodies,id,ref,copy);
  const matrix=tableIn(word,'Requirements matrix','Ref');
  for(const [ref,once,monthly] of [['B.8',0,32],['C.10',0,72],['E.10',0,16],['A.6',400,0]]){
    const row=matrix.find(r=>r.Ref===ref);
    assert.deepEqual([Number(row['One-time hours']),Number(row['Monthly hours'])],[once,monthly],ref+' has only the matching product work');
  }
});

cases.set(12,async h=>{
  await h.file(briarhaven);
  const word=await downloadWord(h),rows=tableIn(word,'Services and effort','Service');
  const training=rows.find(row=>row.Service===catalog.CJ05.name);
  assert.equal(training['Counted in'],'D.4');
  assert.match(training['What we will do'],/user onboarding and training/i,'A service whose scope was entirely excluded needs a name-based description');
  assert.doesNotMatch(training['What we will do'],/Adobe Analytics/i);
  const source=training['What we will do'].match(/(\d+)$/)?.[1];
  assert.ok(source&&word.sections.find(s=>s.title==='Adobe sources')?.blocks.some(b=>
    b.text?.trim()===source+'   '+catalog.CJ05.src),'Retain the catalog source for the service');
  for(const row of rows.filter(r=>!r.Service.startsWith('Total,')))
    assert.match(row['What we will do'],/[a-z]{3}/i,row.Service+' needs substantive service copy');
});

cases.set(13, async h => {
  const files = [
    ['Lot_1_Website.txt', [
      'Describe the implementation of our new website with AEM Sites.',
      'Provide three client references for comparable website engagements.',
      'Explain how you would migrate our Drupal content to AEM Sites.'
    ]],
    ['Lot_2_Analytics.txt', [
      'Describe how you would implement Customer Journey Analytics.',
      'Provide references from two comparable customer engagements.',
      'Explain how you would connect AEM Sites data to Customer Journey Analytics.'
    ]]
  ];
  const upload = files.map(([name,questions])=>({name,mimeType:'text/plain',
    buffer:Buffer.from(questions.map((q,i)=>(i+1)+'. '+q).join('\n\n'))}));
  await h.page.setInputFiles('#rfp-file',upload);
  await h.page.waitForFunction(()=>RFPBuilder.state.questions.length===6);
  const doc = await downloadWord(h);
  const matrix = tableIn(doc,'Requirements matrix','Ref');
  const titles = ['Lot 1 Website','Lot 2 Analytics'];
  // The issued reference remains available verbatim in the matrix beside its disambiguating section.
  assert.deepEqual(matrix.map(r=>r.Ref),['1','2','3','1','2','3']);
  assert.deepEqual(matrix.map(r=>r['RFI section']),[...Array(3).fill(titles[0]),...Array(3).fill(titles[1])]);
  assert.ok(titles.every(title=>doc.sections.some(section=>section.title===title)));
  const expected = matrix.map((r,i)=>[titles[Math.floor(i/3)],r.Ref]);
  const matches=(display,[title,ref])=>display.includes(title)&&new RegExp('\\b'+ref+'\\b').test(display.replace(title,''));
  const firm = tableIn(doc,'About our firm','Ref');
  assert.deepEqual(firm.map(r=>r.Requirement),[files[0][1][1],files[1][1][1]]);
  assert.ok(firm.every((r,i)=>matches(r.Ref,[titles[i],'2'])), 'Each firm reference identifies its lot');
  for (const [i,title] of titles.entries()) {
    const headings=doc.sections.find(s=>s.title===title).blocks.filter(b=>b.style==='Heading2').map(b=>b.text);
    for(const j of [0,2]){
      const text=files[i][1][j], head=headings.find(t=>t.endsWith(text));
      assert.ok(head&&matches(head.slice(0,-text.length),[title,String(j+1)]),'Word qualifies the reference for '+text);
    }
  }
  // The private checklist keeps the lot in every repeated reference, even when it shortens a question.
  const notes = (await h.checklist()).slice(1).filter(row => row[0] !== 'All');
  assert.ok(notes.length > 1);
  for (const [ref,short] of notes) {
    const prefix = short.replace(/(?:\.{3}|…)$/, '').trimEnd();
    const i = files.flatMap(f=>f[1]).findIndex(q=>q.startsWith(prefix));
    assert.ok(i >= 0 && matches(ref,expected[i]), 'Checklist has an ambiguous reference: ' + ref);
  }
  assert.doesNotMatch(JSON.stringify([doc.sections,notes]), /\.txt/i);
  await h.text([
    'Section A: Website', '1. '+files[0][1][0], '2. '+files[0][1][1],
    'Section B: Analytics', '1. '+files[1][1][0], '2. '+files[1][1][1]
  ].join('\n\n'));
  const again=await downloadWord(h), restarted=tableIn(again,'About our firm','Ref');
  assert.deepEqual(restarted.map(r=>r.Requirement),[files[0][1][1],files[1][1][1]]);
  assert.ok(restarted[0].Ref.includes('Website')&&restarted[1].Ref.includes('Analytics'));
  const repeatedNotes = (await h.checklist()).slice(1).filter(row => row[0] !== 'All');
  assert.ok(repeatedNotes.length && repeatedNotes.every(row => /Website|Analytics/.test(row[0])),
    'Checklist qualifies the numbers that restart in the second section');

  // The retained Excel export writes into the client form. Exercise qualified source references in a two-sheet form.
  const named = await h.eval(([titles, files]) => {
    const book = XLSX.utils.book_new();
    titles.forEach((title,i) => XLSX.utils.book_append_sheet(book,XLSX.utils.aoa_to_sheet([
      ['Number','Question','Response','Section'], ...files[i][1].map((q,j)=>[String(j+1),q,'',title])
    ]),title));
    return [...new Uint8Array(XLSX.write(book,{type:'array',bookType:'xlsx'}))];
  }, [titles,files]);
  await h.page.setInputFiles('#rfp-file', {name:'Lots.xlsx',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',buffer:Buffer.from(named)});
  await h.page.waitForFunction(()=>RFPBuilder.state.questions.length===6 && RFPBuilder.state.questions.every(q=>q.file==='Lots.xlsx'));
  const filled = (await h.workbook('rfp-writeback')).sheets;
  for (const [i,title] of titles.entries()) {
    const response = filled[title].slice(1);
    assert.deepEqual(response.map(row=>String(row[0])),['1','2','3']);
    assert.deepEqual(response.map(row=>row[1]),files[i][1]);
    assert.ok(response[0][2] && response[2][2],title + ' has its own technical answers');
  }
  const namedSources = filled['Adobe sources'].slice(1);
  assert.ok(namedSources.length>1 && namedSources.every(row=>titles.some(title=>String(row[0]).includes(title))),
    'Workbook source references: ' + JSON.stringify([...new Set(namedSources.map(row=>row[0]))]));

  const unnumbered=[
    'Describe how you would make our new AEM Sites website on Edge Delivery Services conform to WCAG 2.2 Level AA.',
    'Describe how accessibility would be checked on our AEM Sites website before each release.'
  ];
  const input=await h.eval(questions=>{
    const w=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(w,XLSX.utils.aoa_to_sheet([['Number','Question','Response'],...questions.map(q=>['',q,''])]),'Questions');
    return [...new Uint8Array(XLSX.write(w,{type:'array',bookType:'xlsx'}))];
  },unnumbered);
  await h.page.setInputFiles('#rfp-file',{name:'Unnumbered.xlsx',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',buffer:Buffer.from(input)});
  await h.page.waitForFunction(()=>RFPBuilder.state.questions.length===2&&RFPBuilder.state.questions.every(q=>!q.label));
  const anonymousNotes = (await h.checklist()).slice(1).filter(row=>row[0]!=='All');
  assert.ok(anonymousNotes.length && anonymousNotes.every(row => !row[0] && unnumbered.some(q=>q.startsWith(row[1].replace(/(?:\.{3}|…)$/, '')))),
    'The checklist quotes the unnumbered question without inventing an issued reference');
  const prose=await h.eval(()=>{
    const q=RFPBuilder.state.questions[1];
    return RFPAnswers.method(q,RFPAnswers.compose(q)).sections.flatMap(s=>s[1]).join(' ');
  });
  assert.match(prose,/our answer to that requirement/);
  await h.setStatus(0,'used');
  const book = (await h.workbook('rfp-writeback')).sheets;
  const responses = book.Questions.slice(1), sources = book['Adobe sources'].slice(1);
  assert.ok(responses.every(row=>!row[0]));
  assert.deepEqual(responses.map(row=>row[1]),unnumbered);
  assert.ok(sources.length && sources.every(row=>!row[0]),'No invented number on the customer workbook source sheet');
  const anonymous=tableIn(await downloadWord(h),'Requirements matrix','Ref');
  assert.match(anonymous[0].Ref,/^\[Q1: replace with the RFI/);
  assert.match(anonymous[1].Ref,/^\[Q2: replace with the RFI/);
});

cases.set(14, async h => {
  const questions = [
    ['Explain how our three language versions on AEM Sites would be maintained across five markets, and how a local correction survives when the central team publishes a later update.',true],
    ['Describe how our three language versions on AEM Sites would be maintained across seven regions, and how a local correction survives when the central team publishes a later update.',true],
    ['Describe how AEM Sites will maintain 140 Spanish pages on our single US website with central review and local corrections.',false]
  ];
  for(const [text,regional] of questions){
    await h.text('1. '+text);
    const ids=await h.eval(()=>{
      const q=RFPBuilder.state.questions[0], d=RFPAnswers.compose(q), p=RFPAnswers.kbPlan(q,d);
      return p?.ids||[];
    });
    if(regional)assert.equal(ids[0],'SI08',text);
    else assert.ok(!ids.includes('SI08'),text);
  }
});

async function run() {
  const chosen = process.argv.slice(2).map(Number);
  for (const id of chosen) assert.ok(cases.has(id),'Unknown item ' + id);
  const h = await open();
  try {
    for (const [id,check] of cases) {
      if (chosen.length && !chosen.includes(id)) continue;
      await check(h);
      console.log('PASS Round 5c item ' + id);
    }
    assert.deepEqual(h.errors,[],'Unexpected browser errors');
  } finally { await h.close(); }
}
if (require.main === module) run().catch(e => {console.error(e);process.exitCode=1;});
