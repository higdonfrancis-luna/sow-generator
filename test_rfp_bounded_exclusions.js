// Product refusals in a base proposal must constrain the draft, method and SOW handoff.
// Uses a fresh public test RFP and synthetic paraphrases, never held-out RFIs or scores.
const {open}=require(__dirname+'/rfp_prototype/review_2026-11-09/harness.js');
let checks=0,fails=0;
const ok=(pass,label,detail='')=>{checks++;console.log((pass?'✅ ':'❌ ')+label+(pass||!detail?'':' ['+detail+']'));if(!pass)fails++;};
(async()=>{
  let h;
  try{
  h=await open();
  await h.page.waitForFunction(()=>window.RFPAnswers&&window.RFPBuilder,{},{timeout:5000});
  const probe=async(text,scope='')=>h.eval(([text,scope])=>[...RFPAnswers.kbExclusions({text},scope)],[text,scope]);
  const refused=['rtcdp','ajo','workfront','aa'];
  const base='RT-CDP, AJO, Workfront and Adobe Analytics are declined for the base proposal. Any separately proposed optional use must be priced independently and must not be required for base delivery or acceptance.';
  let ids=await probe('Describe the implementation.',base);
  ok(refused.every(id=>ids.includes(id)),'A coordinated base-proposal refusal excludes all four named products',ids.join());
  for(const wording of [
    'Adobe Analytics and Journey Optimizer are not included in the initial scope.',
    'Adobe Analytics and Journey Optimizer will be excluded from the proposed implementation.',
    'Adobe Analytics and Journey Optimizer are not required for base delivery.',
    'Adobe Analytics and Journey Optimizer are explicitly declined. Optional alternatives may be separately priced.'
  ]){ids=await probe('Describe the implementation.',wording);ok(['aa','ajo'].every(id=>ids.includes(id)),'Product-first refusal: '+wording,ids.join());}
  for(const wording of [
    'Describe a Customer Journey Analytics design without requiring Adobe Analytics.',
    'Explain how experimentation would operate without RT-CDP or AJO and how exposure respects consent.',
    'Explain Target experiments without adding Real-Time CDP, Journey Optimizer or Workfront.',
    'Describe the reporting design without using Adobe Analytics or Journey Optimizer.'
  ]){ids=await probe(wording);const expected=/Customer Journey Analytics/.test(wording)?['aa']:/Workfront/.test(wording)?['rtcdp','ajo','workfront']:/RT-CDP/.test(wording)?['rtcdp','ajo']:['aa','ajo'];ok(expected.every(id=>ids.includes(id)),'Question-local direct product refusal: '+wording,ids.join());}
  for(const wording of [
    'We will not license Adobe Analytics to implement this project.',
    'We will not use Adobe Analytics to measure these journeys.',
    'Adobe Analytics is excluded to avoid another subscription.'
  ]){ids=await probe('Describe the implementation.',wording);ok(ids.includes('aa'),'A stated purpose does not undo an explicit product refusal: '+wording,ids.join());}
  for(const wording of [
    'Describe Adobe Analytics without requiring users to obtain administrator access.',
    'Describe approval without requiring AEM Assets authors to obtain administrator access.',
    'Explain Adobe Analytics without requiring Adobe Analytics to collect sensitive identifiers.',
    'Explain Adobe Analytics without changing Adobe Analytics cookies.',
    'Adobe Analytics exports are not included in this phase.',
    'Adobe Analytics is not required to identify individual applicants.',
    'We will not require Adobe Analytics to collect sensitive identifiers.',
    'We do not currently own Adobe Analytics. We plan to implement Adobe Analytics.',
    'We will not require suppliers to hold Adobe Target certification.'
  ]){ids=await probe(wording);ok(!ids.length,'A feature, access or current-ownership constraint does not ban its product: '+wording,ids.join());}
  ids=await probe('Explain Adobe Analytics reporting.','Describe CJA without requiring Adobe Analytics.');
  ok(!ids.includes('aa'),'A local no-Analytics condition does not ban Analytics in another requirement');
  const commerce=await h.eval(()=>[
    'Describe Adobe Target experiments on public product pages and enquiry entry points.',
    'Describe AEM Assets metadata and image renditions for the product catalog.',
    'Describe Adobe Commerce storefront implementation and checkout.',
    'Describe ecommerce shopping cart and checkout configuration.'
  ].map(text=>({text,products:RFPAnswers.detect(text)})));
  ok(commerce.slice(0,2).every(x=>!x.products.includes('commerce')),'Generic product pages and catalogs do not imply Adobe Commerce',JSON.stringify(commerce.slice(0,2)));
  ok(commerce.slice(2).every(x=>x.products.includes('commerce')),'Explicit Commerce and transactional commerce language still identify Commerce',JSON.stringify(commerce.slice(2)));

  // The exact three product questions and explicit exclusions from the fresh sample RFP.
  const questions=[
    "Describe your proposed AEM Sites approach for deposit, mortgage enquiry and small-business journeys. Explain the content model, reusable components and author permissions, including Spanish content handling. State assumptions about page templates and provide the evidence you would use to obtain design approval by 26 March 2027.",
    'Describe a Customer Journey Analytics design for public discovery, enquiry starts, submitted applications and signing outcomes. Explain proposed data collection and ingestion paths, supporting services and license dependencies without requiring Adobe Analytics. State how anonymous activity and permitted identifiers would be handled, with unresolved policy decisions assigned to the bank.',
    'Describe how Adobe Target would support controlled experiments on public product pages and enquiry entry points. Propose an initial backlog of three test types, with required implementation work and commercial dependencies. Explain how experimentation would operate without RT-CDP or AJO and how exposure would respect bank-approved consent decisions.'
  ];
  const result=await h.eval(([base,questions])=>{
    const R=RFPBuilder,A=RFPAnswers;R.state.name='Fresh financial-services sample';R.state.paragraphs=[base];
    R.state.questions=questions.map((text,i)=>({text,label:['A.1','D.1','E.1'][i],kind:'adobe',status:'used'}));
    return R.state.questions.map(q=>{const d=A.compose(q);q.draft=d;const p=d&&A.kbPlan(q,d),method=d&&A.method(q,d);return {ref:q.label,products:d&&d.m.products||[],lines:d&&d.m.lines||[],plan:p&&p.ids||[],method:method&&method.services||[],plain:d?A.plain(d,q).split('Adobe sources for the product facts above')[0]:'',allPermitted:[...(d&&d.m.lines||[]),...(p&&p.ids||[]),...(method&&method.services||[])].every(id=>A.kbPermitted(id,q))};});
  },[base,questions]);
  // The shared Shield licensing fact says its add-on is licensed for each product the client USES.
  // Listing the products in that bounded conditional clause does not propose adopting them.
  // Keep every other declined-product mention under review, and keep product/service/dependency checks strict.
  const sharedLicense=/\blicensed with each of (?:Real-Time CDP|Journey Optimizer|Customer Journey Analytics)(?:(?:,\s*|\s+and\s+)(?:Real-Time CDP|Journey Optimizer|Customer Journey Analytics))* you use\./g;
  for(const r of result){ok(!r.products.some(id=>refused.includes(id))&&r.allPermitted,r.ref+' draft, lead and supporting services obey base exclusions',JSON.stringify(r));ok(!/Adobe Analytics|Journey Optimizer|Real-Time CDP|Workfront/.test(r.plain.replace(sharedLicense,'')),r.ref+' user-visible plain response does not recommend declined products',r.plain);}
  ok(!result.find(r=>r.ref==='E.1').products.includes('commerce'),'The public product-page experiment does not add an unrequested Commerce product');
  const facts=await h.eval(()=>{const q={text:'Describe the proposed handling of personal information, including data locations, security and privacy for Adobe Analytics, Journey Optimizer, Workfront and AEM Sites.',kind:'adobe'};const d=RFPAnswers.compose(q);return {products:d&&d.m.products||[],text:d?RFPAnswers.plain(d,q).split('Adobe sources for the product facts above')[0]:''};});
  ok(facts.products.includes('aemsites')&&!facts.products.some(id=>refused.includes(id))&&!/Adobe Analytics|Journey Optimizer|Workfront/.test(facts.text),'The early factual-answer path filters declined products while retaining permitted facts',JSON.stringify(facts));
  const handoff=await h.eval(()=>{localStorage.removeItem('abv-sow-build-v1');RFPAnswers.toSow();const c=JSON.parse(localStorage.getItem('abv-sow-build-v1')||'null');return c&&c.on||[];});
  ok(handoff.length>0&&!handoff.some(id=>refused.includes(id)||id==='commerce'),'The fresh sample handoff cannot restore a declined or spuriously inferred Commerce product',handoff.join());

  // A saved no-AI draft can outlive a changed Background. Check the boundary, not only its text.
  const stale=await h.eval(()=>{
    const R=RFPBuilder,A=RFPAnswers;R.state.paragraphs=[];R.state.questions=[{text:'Describe the AEM Sites components and templates.',label:'A.1',kind:'adobe',status:'used'}];
    const q=R.state.questions[0];q.draft=A.compose(q);const sites=q.draft.m.lines.find(id=>A.kbPermitted(id,q));
    q.draft.m.products.push('aa');q.draft.m.lines.push('AF09');q.draft.m.conn=RFP_CAT.connections.find(c=>[c.a,c.b].includes('aa'));
    R.state.paragraphs=['Adobe Analytics is declined for this phase.'];localStorage.removeItem('abv-sow-build-v1');A.toSow();
    const c=JSON.parse(localStorage.getItem('abv-sow-build-v1')||'null');return {products:c&&c.on||[],selected:c&&c.ls||{},sites};
  });
  ok(stale.sites&&stale.selected[stale.sites]===true&&!stale.products.includes('aa')&&stale.selected.AF09!==true,'Changed constraints filter stale no-AI line choices and connection endpoints at handoff',JSON.stringify(stale));
  ok(!h.errors.length,'No browser errors',h.errors.join(' | '));
  console.log(`${checks-fails}/${checks} bounded exclusion checks passed`);if(fails)process.exitCode=1;
  }finally{if(h)await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
