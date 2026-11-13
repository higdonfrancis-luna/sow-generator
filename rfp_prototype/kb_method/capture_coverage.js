// Round 4: capture every parsed question, not just the current Adobe pile. The fixed
// cohorts below separate classification coverage, authored-key coverage, the original
// blind-panel cohort and all genuinely AI-written numbered requirements. No AI is called.
// Run after building the site:
//   node sow/rfp_prototype/kb_method/capture_coverage.js <output.json>
// Only these four already-seen RFIs are read. The held-out RFI and its key are excluded.
const fs=require('fs'),path=require('path');
const {open}=require('../review_2026-11-09/harness.js');
const ROOT=path.resolve(__dirname,'../../..'),BASE=path.join(ROOT,'sow/rfp_prototype/kb_method');
const SOURCES=[
  {tag:'cedar',src:'sow/rfp_prototype/demo/Cedar_Prairie_Mutual_Insurance_Company_Response_Form.xlsx'},
  {tag:'tallgrass',src:'sow/rfp_prototype/demo/Tallgrass_Home_and_Garden_Inc_RFP.pdf'},
  {tag:'vennor',src:'sow/rfp_prototype/kb_method/chatgpt_round2/test_rfi.txt',key:'test_rfi_key.json'},
  {tag:'virelune',src:'sow/rfp_prototype/kb_method/chatgpt_round2/test_rfi_2.txt',key:'test_rfi_2_key.json'}
];
const numbered=ref=>typeof ref==='string'&&/\d/.test(ref)&&ref.trim().length>0;
const json=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const unique=refs=>[...new Set(refs.filter(numbered))];
const hasText=x=>typeof x==='string'&&x.trim().length>0;
function measures(refs,rows){
  const by=new Map(rows.filter(r=>numbered(r.ref)).map(r=>[r.ref,r]));
  const picked=refs.map(ref=>({ref,row:by.get(ref)})),method=p=>p.row&&hasText(p.row.kb),answer=p=>method(p)||(p.row&&hasText(p.row.catalog));
  return {denominator:refs.length,observed_records:picked.filter(p=>p.row).length,
    adobe_records:picked.filter(p=>p.row&&p.row.kind==='adobe').length,
    method_answers:picked.filter(method).length,any_no_ai_answers:picked.filter(answer).length,
    no_method_refs:picked.filter(p=>!method(p)).map(p=>p.ref),no_answer_refs:picked.filter(p=>!answer(p)).map(p=>p.ref)};
}
function cohort(name,refs,before,after){return {name,refs,before:measures(refs,before),after:measures(refs,after)};}
async function capture(h,input){
  if(/test_rfi_3(?:_key)?\./.test(input.src+' '+(input.key||'')))throw Error('Held-out RFI access is prohibited');
  await h.file(path.join(ROOT,input.src));
  const rows=await h.eval(()=>{
    const text=w=>w.sections.map(([hd,items])=>hd+'\n'+items.map(t=>'- '+t).join('\n')).join('\n\n');
    return RFPBuilder.state.questions.map((q,index)=>{
      const d=RFPAnswers.compose(q),method=d?RFPAnswers.method(q,d):null,lim=RFPAnswers.limitOf(q);
      return {index,ref:q.label||'',question:q.text,kind:q.kind,section:q.section||'',requirement:!!q.requirement,
        limit:lim?lim.max:null,services:d&&d.m?d.m.lines:[],kbServices:method?method.services:[],topic:method&&method.topic||null,
        kb:method?text(RFPAnswers.written(Object.assign({},d,{ai:method}),q)):null,
        catalog:d?RFPAnswers.plain(d,q).split('\nAdobe sources')[0]:'',capability:!!(d&&d.capability),sourced_facts:!!(d&&d.kb)};
    });
  });
  if(h.errors.length)throw Error(input.tag+': page errors: '+h.errors.join(' | '));
  const before=json(path.join(BASE,'scores_round3',input.tag+'_no_ai_answers.json')).map(r=>({...r,kind:'adobe'}));
  const ai=json(path.join(BASE,'scores_round3','ai_answers_'+input.tag+'.json')).answers;
  const oldRefs=unique(Object.keys(json(path.join(BASE,'scores_round3',input.tag+'_key.json'))));
  const aiRefs=unique(ai.filter(r=>r.model==='claude-opus-5-5').map(r=>r.ref));
  const allNumbered=rows.filter(r=>numbered(r.ref)),classified=allNumbered.filter(r=>r.kind==='adobe');
  const key=input.key?json(path.join(BASE,'chatgpt_round2',input.key)):null;
  const authoredAdobe=key?new Set(key.filter(r=>r.kind==='adobe').map(r=>r.ref)):null;
  const implementationRefs=authoredAdobe?aiRefs.filter(ref=>authoredAdobe.has(ref)):aiRefs;
  return {tag:input.tag,source:input.src,question_count:rows.length,numbered_question_count:allNumbered.length,
    classified_adobe:{denominator:classified.length,method_answers:classified.filter(r=>hasText(r.kb)).length,any_no_ai_answers:classified.filter(r=>hasText(r.kb)||hasText(r.catalog)).length},
    // No authored requirement key exists for Cedar/Tallgrass; null is deliberately not inferred from the classifier.
    authored_key:key?{source:'sow/rfp_prototype/kb_method/chatgpt_round2/'+input.key,
      kinds:Object.fromEntries(['adobe','firm','security'].map(kind=>[kind,key.filter(r=>r.kind===kind).length])),
      coverage:cohort('authored Adobe requirements',unique(key.filter(r=>r.kind==='adobe').map(r=>r.ref)),before,rows)}:null,
    original_panel:cohort('original Round 3 blind-panel requirements',oldRefs,before,rows),
    expanded_implementation:cohort('AI-written implementation requirements, filtered by authored Adobe kind where a key exists',implementationRefs,before,rows),
    expanded_ai:cohort('all actually AI-written numbered requirements, including non-implementation items; coverage only',aiRefs,before,rows),questions:rows};
}
(async()=>{
  const out=process.argv[2];if(!out||process.argv.length!==3)throw Error('usage: node capture_coverage.js <output.json>');
  if(/test_rfi_3(?:_key)?\./.test(out))throw Error('Held-out output path is prohibited');
  const rfis=[];
  // Match eval_answers.js: each RFI starts in a fresh page, including its unnumbered background rows.
  for(const input of SOURCES){const h=await open();
    try{const result=await capture(h,input);rfis.push(result);console.log(input.tag+': '+result.classified_adobe.method_answers+'/'+result.classified_adobe.denominator+' currently classified Adobe questions have method answers');}
    finally{await h.close();}}
  const totals={};
  for(const key of ['original_panel','expanded_implementation','expanded_ai']){totals[key]={denominator:rfis.reduce((n,r)=>n+r[key].refs.length,0)};for(const stage of ['before','after'])totals[key][stage]=Object.fromEntries(['observed_records','adobe_records','method_answers','any_no_ai_answers'].map(metric=>[metric,rfis.reduce((n,r)=>n+r[key][stage][metric],0)]));}
  const result={description:'Round 3 recorded outputs versus the current built no-AI page on four seen RFIs.',
    baseline_note:'Before counts use saved Round 3 eval_answers rows, which contain only that run\'s Adobe pile; a missing record does not reveal whether the old parser omitted or misclassified the requirement.',
    scoring_note:'Judge the expanded implementation panel once, then aggregate scores separately on original_panel.refs and expanded_implementation.refs; expanded_ai is an optional coverage population that may include security questions, not the primary implementation score denominator.',totals,rfis};
  fs.mkdirSync(path.dirname(path.resolve(out)),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');
  console.log('Coverage captured for four seen RFIs; original cohort '+totals.original_panel.denominator+', expanded implementation cohort '+totals.expanded_implementation.denominator+', all-AI coverage cohort '+totals.expanded_ai.denominator+'.');
})().catch(e=>{console.error(e);process.exit(1);});
