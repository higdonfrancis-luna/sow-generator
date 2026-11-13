// Round 4: explicit scope refusals constrain no-AI services and dependencies, without changing saved AI answers.
// Synthetic RFIs exercise product categories, alternatives, question-local wording and state changes; no holdout file is read.
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
let n=0, fails=0;
const ok=(yes,label,details='')=>{n++;console.log((yes?'✅ ':'❌ ')+label+(yes||!details?'':' ['+details+']'));if(!yes)fails++;};
(async()=>{
  const h=await open();
  const doc=async(background,question='Describe how you would configure Adobe Target for controlled A/B experiments.')=>{
    await h.text('Request for information\n'+background+'\nA.1 '+question);
    return h.eval(()=>{const q=RFPBuilder.state.questions.find(x=>x.label==='A.1');if(!q)throw Error('Synthetic requirement not parsed');q.kind='adobe';delete q.draft;
      const d=RFPAnswers.compose(q),p=d?RFPAnswers.kbPlan(q,d):null,a=d?RFPAnswers.method(q,d):null;
      return {excluded:[...RFPAnswers.kbExclusions(q)],plan:p&&p.ids||[],text:a?a.sections.map(x=>x[1].join(' ')).join('\n'):'',permitted:Object.fromEntries(['C06','TC04','AS01','SI07','AF09','AXA04'].map(id=>[id,RFPAnswers.kbPermitted(id,q)]))};});
  };
  let r=await doc('We are evaluating Adobe Target. We do not currently own Real-Time CDP or AEM Assets. We have not yet bought a license package.');
  ok(!r.excluded.length,'Not owning a license yet is not a product prohibition',r.excluded.join());
  r=await doc('We are evaluating Adobe Target and AEM Sites. We will not license a customer data platform, a separate digital asset management product, a commerce platform or a work-management suite.');
  ok(['rtcdp','aemassets','commerce','workfront'].every(id=>r.excluded.includes(id)),'A client refusal applies to every product category in its list',r.excluded.join());
  ok(!r.permitted.AS01&&r.permitted.SI07,'Excluded DAM services cannot lead or ride along while permitted site workflow remains eligible');
  ok(r.plan.every(id=>!/^CD/.test(id))&&!/This (?:also needs|uses) (?:Adobe )?Real-Time CDP/.test(r.text),'The no-AI experiment does not depend on the refused CDP',r.plan.join());
  r=await doc('We are evaluating Customer Journey Analytics and Adobe Target. We will not license Real-Time CDP. Journey Optimizer is available to this project.','Describe how to share CJA journey audiences with Adobe Target.');
  ok(r.permitted.C06&&r.permitted.TC04,'An alternative prerequisite stays eligible when Journey Optimizer is permitted');
  let choice=await h.eval(()=>RFPAnswers.kbChoices('Share the audience through Real-Time CDP or Journey Optimizer.',RFPBuilder.state.questions.find(x=>x.label==='A.1')));
  ok(choice==='Share the audience through Journey Optimizer.','Alternative wording keeps only the permitted prerequisite',choice);
  ok(!/Real-Time CDP/.test(r.text),'The full no-AI method does not recommend the prohibited alternative',r.text);
  r=await doc('We are evaluating Customer Journey Analytics and Adobe Target. We will not license Real-Time CDP or Journey Optimizer.','Describe how to share CJA journey audiences with Adobe Target.');
  ok(!r.permitted.C06&&!r.permitted.TC04,'Both free-text and structured alternative prerequisites fail when every route is excluded');
  ok(!r.plan.length&&!r.text,'When every audience-sharing route is prohibited, composition does not substitute neighboring work');
  const filtered=await h.eval(()=>{const q=RFPBuilder.state.questions.find(x=>x.label==='A.1');return RFPAnswers.kbAllowedMatch(q,{products:['cja','target','rtcdp'],lines:['C06','TC04'],conn:null,conns:[],excluded:[],missing:[]});});
  ok(!filtered.lines.length&&!filtered.products.includes('rtcdp'),'An all-prohibited match is empty, not replaced by an arbitrary neighboring service');
  r=await doc('We are evaluating AEM Sites and AEM Assets.','Describe downloadable-document handling without assuming a new asset-management license.');
  ok(r.excluded.includes('aemassets')&&!r.permitted.AS01,'A question-local no-new-asset-management-license condition is honored');
  const local=await h.eval(()=>{const other={text:'Describe the AEM Assets onboarding.'};return [...RFPAnswers.kbExclusions(other)];});
  ok(!local.includes('aemassets'),'A restriction on one requirement does not silently become a document-wide ban');
  r=await doc('We are evaluating AEM Assets.','Describe approval without requiring AEM Assets authors to obtain administrator access.');
  ok(!r.excluded.includes('aemassets'),'A constraint on product users is not mistaken for a product-license refusal');
  r=await doc('We are evaluating AEM Forms. Adobe Analytics is excluded from this project.');
  ok(r.excluded.includes('aa')&&!r.permitted.AF09,'A product-first scope exclusion applies across the document');
  const explicitScope=await h.eval(()=>{const q={text:'Describe the AEM Sites approval workflow.'};return {newDoc:[...RFPAnswers.kbExclusions(q,'We will not license AEM Assets.')],permitted:RFPAnswers.kbPermitted('AS01',q,'We will not license AEM Assets.')};});
  ok(explicitScope.newDoc.includes('aemassets')&&!explicitScope.permitted,'Finder can test a new document before the old state is replaced');
  const recovery=await h.eval(()=>{const q={text:'Explain how authors and reviewers would approve a page before it goes live.'};return {allowed:!!RFPAnswers.scopeEvidence(q,'We plan to implement AEM Sites.'),blocked:!!RFPAnswers.scopeEvidence(q,'We plan to implement AEM Sites. We will not license AEM Sites.')};});
  ok(recovery.allowed&&!recovery.blocked,'Finder recovery honors explicit document prohibitions before changing state');
  await doc('We are evaluating Adobe Analytics and AEM Forms.');
  const changed=await h.eval(()=>{const q=RFPBuilder.state.questions.find(x=>x.label==='A.1');const before=RFPAnswers.kbPermitted('AF09',q);RFPBuilder.state.paragraphs.push('We will not license Adobe Analytics.');const after=RFPAnswers.kbPermitted('AF09',q);return {before,after};});
  ok(changed.before&&!changed.after,'An edited document invalidates exclusions even when its question-array identity is unchanged');
  r=await doc('We are evaluating AEM Forms. We will not license Adobe Analytics.');
  ok(!r.permitted.AF09,'A service is excluded when its mandatory ext product is refused');
  r=await doc('We are evaluating AEM Sites and Customer Journey Analytics. We will not license Real-Time CDP or Adobe Analytics.');
  ok(r.permitted.AXA04,'Experience Platform data collection does not become an invented RT-CDP license prerequisite');
  const ai=await h.eval(()=>{const q=RFPBuilder.state.questions.find(x=>x.label==='A.1');q.ai={text:q.text,sections:[['Our approach',['Saved AI wording.']]],services:['AF09'],sources:[],model:'saved-ai'};const d=RFPAnswers.compose(q);return {text:d.ai.sections[0][1][0],services:d.m.lines};});
  ok(ai.text==='Saved AI wording.'&&ai.services.includes('AF09'),'Saved AI wording and selected services retain their existing path');
  const reviewed=await h.eval(()=>[
    'We will not require suppliers to hold Adobe Target certification.',
    'We will not require AEM Assets authors to obtain administrator access.',
    'We will not license Real-Time CDP and will implement Adobe Target.',
    'Real-Time CDP and AEM Assets are excluded from this project.',
    'We do not use Adobe Target yet. We plan to implement Adobe Target.',
    'The university will not license Real-Time CDP.',
    'We will not require Adobe Target.'
  ].map(text=>({global:[...RFPAnswers.kbExclusions({text:'Describe the implementation.'},text)],local:[...RFPAnswers.kbExclusions({text},'')]})));
  ok(reviewed[0].global.length===0&&reviewed[0].local.length===0,'Supplier certification requirements are not product prohibitions',JSON.stringify(reviewed[0]));
  ok(reviewed[1].global.length===0&&reviewed[1].local.length===0,'Author access requirements are not product prohibitions',JSON.stringify(reviewed[1]));
  ok(['global','local'].every(k=>reviewed[2][k].includes('rtcdp')&&!reviewed[2][k].includes('target')),'A coordinated positive implementation clause ends the refusal list',JSON.stringify(reviewed[2]));
  ok(['global','local'].every(k=>['rtcdp','aemassets'].every(id=>reviewed[3][k].includes(id))),'A shared exclusion predicate applies to every product in its coordinated subject',JSON.stringify(reviewed[3]));
  ok(reviewed[4].global.length===0&&reviewed[4].local.length===0,'Present non-use with yet does not prohibit the planned implementation',JSON.stringify(reviewed[4]));
  ok(reviewed[5].global.includes('rtcdp'),'An identified client in third person can state a global licensing prohibition',JSON.stringify(reviewed[5]));
  ok(reviewed[6].global.includes('target')&&reviewed[6].local.includes('target'),'A direct refusal to require the product itself still constrains service selection',JSON.stringify(reviewed[6]));
  r=await doc('We are evaluating Adobe Target. We will not license a customer data platform.','Explain how to set up an Adobe Target trial on public pages, with three experiments running at once. Cover audience boundaries, editorial approval and evidence to interpret uneven traffic.');
  ok(r.plan[0]==='TG03'&&!r.plan.some(id=>['XA05','RT04','RT06'].includes(id)),'An explicitly named product retains its own suitable method after prohibited connection services are removed',r.plan.join());
  r=await doc('We are evaluating AEM Sites. We will not license a separate digital asset management product.','Propose a practical approach to downloadable documents: remove duplicates, replace inaccessible files and maintain page links without assuming a new asset-management license.');
  ok(!r.plan.length&&!r.text,'A license constraint cannot turn unmatched document-delivery work into a generic licensing answer',r.text);
  const fallback=await h.eval(()=>{const q=RFPBuilder.state.questions.find(x=>x.label==='A.1'),d=RFPAnswers.compose(q);return d&&d.kb||false;});
  ok(!fallback,'The unmatched implementation question has no unrelated fact-sheet fallback');
  await h.text('We are evaluating AEM Sites. We will not license AEM Assets.\nA.1 Where is AEM Sites hosted?');
  const factual=await h.eval(()=>{const q=RFPBuilder.state.questions.find(x=>x.label==='A.1');q.kind='adobe';const d=RFPAnswers.compose(q);return !!(d&&d.kb);});
  ok(factual,'A real fact question keeps its sourced answer in a document with a product prohibition');
  await h.text('How does Brand Concierge trigger follow-up journeys in Adobe Journey Optimizer?');
  const unsupported=await h.eval(()=>{const q=RFPBuilder.state.questions[0];q.kind='adobe';return RFPAnswers.compose(q);});
  ok(!unsupported,'A named product pair cannot recover a one-product method for an unsupported integration');
  ok(!h.errors.length,'No browser page errors',h.errors.join(' | '));
  await h.close();console.log(`${n-fails}/${n} Round 4 exclusion checks passed`);if(fails)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
