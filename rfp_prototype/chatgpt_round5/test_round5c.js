// Exercise the shipped reader and downloads through the file and paste controls.
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const {open} = require('../review_2026-11-09/harness.js');

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
