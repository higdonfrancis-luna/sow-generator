// Round 4: recover questions written as work, not product names, using this document's
// named-product scope and strong method phrases. Vendor and security answers stay theirs.
// These checks exercise the page, including the missing-draft fallback. No AI is called.
const path=require('path');
const {open}=require(__dirname+'/rfp_prototype/review_2026-11-09/harness.js');
let n=0,fails=0;
const ok=(c,m,d='')=>{n++;console.log((c?'✅ ':'❌ ')+m+(c||!d?'':' ['+String(d).slice(0,700)+']'));if(!c)fails++;};
const survey=h=>h.eval(()=>RFPBuilder.state.questions.map(q=>{const d=RFPAnswers.compose(q),m=d&&RFPAnswers.method(q,d);return {ref:q.label,text:q.text,kind:q.kind,method:!!m,via:d&&d.m.via};}));
(async()=>{const h=await open();try{
  await h.file(path.join(__dirname,'rfp_prototype/kb_method/chatgpt_round2/test_rfi.txt'));
  const first=await survey(h),at=r=>first.find(x=>x.ref===r);
  for(const r of ['A.2','A.3','A.4','B.2','B.3','C.3'])ok(at(r)&&at(r).kind==='adobe'&&at(r).method,r+' unnamed delivery work is sorted and receives a method draft',JSON.stringify(at(r)));
  ok(first.filter(x=>/^F\./.test(x.ref)).every(x=>x.kind!=='adobe'&&!x.method),'manufacturer supplier questions are not recovered as Adobe work');
  await h.file(path.join(__dirname,'rfp_prototype/kb_method/chatgpt_round2/test_rfi_2.txt'));
  const second=await survey(h),at2=r=>second.find(x=>x.ref===r);
  for(const r of ['A.3','B.5','C.3','C.4','C.5'])ok(at2(r)&&at2(r).kind==='adobe'&&at2(r).method,r+' unnamed website, status, testing or rollout work gets a method draft',JSON.stringify(at2(r)));
  ok(second.filter(x=>/^[DE]\./.test(x.ref)).every(x=>x.kind!=='adobe'&&!x.method),'university security and supplier questions retain their own answers');
  ok(second.filter(x=>!x.ref&&/^We expect mobilisation/.test(x.text)).every(x=>x.kind!=='adobe'&&!x.method),'a background schedule is not promoted by overlapping pilot and launch words');
  const work='Explain how authors and reviewers would approve a page before it goes live.';
  await h.text('We plan to implement AEM Sites.\n\n'+work);
  let rows=await survey(h),q=rows.find(x=>x.text===work);
  ok(q&&q.kind==='adobe'&&q.method,'an unnumbered request can use an explicit background product scope',JSON.stringify(q));
  await h.text(work);
  rows=await survey(h);q=rows.find(x=>x.text===work);
  ok(q&&q.kind!=='adobe'&&!q.method,'loading a new RFI without a named product cannot reuse the previous scope',JSON.stringify(q));
  await h.text('We plan to implement AEM Sites.\n\nA.1 Provide two references for approval workflow implementation.\nA.2 Propose the team you would assign to author training.\nA.3 Explain your delivery methodology for content migration.\nA.4 Describe your pricing for translated page rollout.\nA.5 Where is the data hosted?');
  rows=await survey(h);
  ok(rows.filter(x=>/^A\.[1-4]$/.test(x.ref)).every(x=>x.kind==='firm'&&!x.method),'reference, staffing, delivery-method and pricing questions remain firm despite service phrases',JSON.stringify(rows));
  q=rows.find(x=>x.ref==='A.5');ok(q&&!q.method,'a hosting fact request is not given an implementation method',JSON.stringify(q));
  // A sectionless procurement paragraph may name the product only on the first of two separate asks.
  const followup='Explain how editors approve a change.';
  await h.text('Describe your plan to publish AEM Sites notices. '+followup+'\n\nProvide your commercial terms for the pilot.');
  const adjacent=await h.read(),publication=adjacent.questions[1],supplier=adjacent.questions[2];
  ok(adjacent.count===3&&publication.text===followup&&publication.kind==='adobe'&&publication.draft&&
    publication.draft.products.map(p=>p.id).join()==='aemsites'&&publication.draft.lines.length>0&&
    await h.eval(ids=>{const p=RFP_CAT.products.find(p=>p.id==='aemsites');return ids.every(id=>[...p.lines,...p.more].includes(id));},publication.draft.lines.map(l=>l.id)),
    'the adjacent editorial question is drafted only from the AEM Sites service catalog',JSON.stringify(publication));
  ok(supplier&&supplier.kind==='firm'&&!supplier.draft,'the commercial response stays with the supplier',JSON.stringify(supplier));
  await h.text(followup);const standalone=(await h.read()).questions[0];
  ok(standalone.kind==='firm'&&!standalone.draft,'a standalone editorial question cannot inherit a product from another file');
  ok(!h.errors.length,'the page reports no runtime errors',h.errors.join(' | '));
}finally{await h.close();}
console.log(`${n} checks, ${fails} failures`);if(fails)process.exit(1);
})().catch(e=>{console.error(e);process.exit(1);});
