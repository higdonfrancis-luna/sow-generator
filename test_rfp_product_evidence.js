// Generic business product pages and catalogs are not evidence of an ecommerce platform.
// Preserve explicit Commerce names and transactional language, including solutioning.
const {open}=require(__dirname+'/rfp_prototype/review_2026-11-09/harness.js');
let checks=0,fails=0;
const ok=(pass,label,detail='')=>{checks++;console.log((pass?'✅ ':'❌ ')+label+(pass||!detail?'':' ['+detail+']'));if(!pass)fails++;};
(async()=>{
  const h=await open();
  try{
    const probe=async text=>{
      await h.text('A.1 '+text);
      return h.eval(()=>{
        const q=RFPBuilder.state.questions.find(x=>x.label==='A.1');
        if(!q)throw Error('Requirement was not parsed');
        q.kind='adobe';delete q.draft;
        const match=RFPAnswers.match(q.text),draft=RFPAnswers.compose(q);
        return {matched:match.products,products:draft?draft.m.products:[],lines:draft?draft.m.lines:[],connection:draft&&draft.m.conn&&draft.m.conn.id};
      });
    };
    let r=await probe('Describe how Adobe Target would test our public product pages and enquiry entry points.');
    ok(r.matched.includes('target')&&!r.matched.includes('commerce'),'Product pages keep Target without inventing Commerce',JSON.stringify(r));
    ok(r.products.includes('target')&&!r.products.includes('commerce')&&!r.lines.includes('XA21'),'The composed answer has no Commerce testing connection',JSON.stringify(r));
    r=await probe('Describe how AEM Assets would manage approved files for our product catalog.');
    ok(r.matched.includes('aemassets')&&!r.matched.includes('commerce')&&!r.products.includes('commerce'),'A product catalog can be an asset-management task without Commerce',JSON.stringify(r));
    r=await probe('Our product images live in AEM Assets. How do approved images reach Commerce product pages?');
    ok(r.matched.includes('commerce')&&r.matched.includes('aemassets')&&r.connection==='commerce-aemassets','A capitalized Commerce name keeps its Assets connection',JSON.stringify(r));
    r=await probe('Describe how AEM Assets feeds Adobe Commerce product pages.');
    ok(r.products.includes('commerce')&&r.products.includes('aemassets')&&r.connection==='commerce-aemassets','An explicit Adobe Commerce integration is unchanged',JSON.stringify(r));
    r=await probe('Describe how Adobe Target would test our ecommerce checkout and shopping cart.');
    ok(r.matched.includes('commerce')&&r.matched.includes('target')&&r.connection==='target-commerce','Transactional ecommerce evidence still supports the Commerce connection',JSON.stringify(r));
    r=await probe('Which Adobe products would you recommend for our ecommerce storefront?');
    ok(r.matched.includes('commerce'),'Solutioning still recognizes an ecommerce storefront',JSON.stringify(r));
    r=await probe('Which Adobe products would you recommend for a product catalog of downloadable brochures?');
    ok(!r.matched.includes('commerce'),'Solutioning alone does not turn a brochure catalog into Commerce',JSON.stringify(r));
    ok(!h.errors.length,'No browser script errors',h.errors.join(' | '));
  }finally{await h.close();}
  console.log(`${checks-fails}/${checks} product-evidence checks passed`);if(fails)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
