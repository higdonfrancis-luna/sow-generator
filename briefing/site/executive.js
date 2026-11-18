(()=>{'use strict';
const D=window.BRIEF_DATA,R=window.WarroomROI,$=id=>document.getElementById(id);
if(!D||!R){$('app-error').hidden=false;return;}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=(n,d=0)=>Number(n).toLocaleString('en-US',{maximumFractionDigits:d});
const money=n=>n===null?'Not modeled':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const compact=n=>Math.abs(n)>=1e6?(n<0?'−':'')+'$'+(Math.abs(n)/1e6).toFixed(2)+'M':Math.abs(n)>=1e3?(n<0?'−':'')+'$'+num(Math.abs(n)/1e3)+'K':money(n);
const size=n=>n>=1e6?(n/1e6).toFixed(2)+' MB':n>=1e3?(n/1e3).toFixed(1)+' KB':n+' B';
const clone=x=>JSON.parse(JSON.stringify(x));
let model=clone(R.portfolioPresets.base),stream='brandVisibility',scenario='base',lastResult=null;const invalidFields=new Set();
function invalidate(message){lastResult=null;$('export-roi').disabled=true;['bv-arr','bv-recognized','bv-volume-wins','bv-quality-wins','bv-total-wins','other-arr','other-wins','portfolio-arr','portfolio-recognized','roi-contribution','roi-percent','roi-breakeven'].forEach(id=>$(id).textContent='N/A');['bv-explanation','bv-volume-detail','bv-quality-detail','bv-investment'].forEach(id=>$(id).textContent='Complete valid model inputs to calculate this result.');$('model-definition').textContent=message;$('model-definition').classList.add('model-error');}
const fields=[
 {key:'activePartners',label:'Target partners',min:0,max:10000,step:1,help:'Partners in this product’s rollout cohort.'},
 {key:'opportunitiesPerPartnerYear',label:'Qualified RFPs / partner / year',min:0,max:1000,step:1,help:'Unique opportunities with incremental Adobe value.'},
 {key:'currentSubmitRate',label:'Current submission rate · %',min:0,max:100,step:1,percent:true,help:'Share of eligible opportunities bid today.'},
 {key:'licenseARRPerWin',label:'Adobe annual value / win · USD',min:0,max:10000000,step:5000,help:'Illustrative subscription value, not Adobe list pricing.'},
 {key:'hoursBefore',label:'Hours per proposal · today',min:0,max:10000,step:1,help:'Preparation plus required expert review.'},
 {key:'hoursAfter',label:'Hours per proposal · with tool',min:1,max:10000,step:1,help:'Hypothesis to measure during the pilot.'},
 {key:'baselineWinRate',label:'Current win rate · %',min:0,max:100,step:1,percent:true,help:'Wins among submitted eligible proposals.'},
 {key:'winRateUpliftPp',label:'Win-rate improvement · points',min:-100,max:100,step:1,help:'2 points means 20% becomes 22%, not 20.4%.'},
 {key:'ramp',label:'Productive adoption in 2027 · %',min:0,max:100,step:1,percent:true,advanced:true,help:'Annual exposure after onboarding and ramp.'},
 {key:'reinvestmentFraction',label:'Saved time reinvested in bids · %',min:0,max:100,step:1,percent:true,advanced:true,help:'Remaining time is partner capacity, not Adobe revenue.'},
 {key:'addedSubmissionWinRate',label:'Win rate on additional bids · %',min:0,max:100,step:1,percent:true,advanced:true,help:'Marginal opportunities can convert differently.'},
 {key:'attribution',label:'Incremental effect attributed · %',min:0,max:100,step:1,percent:true,advanced:true,help:'Tool’s assumed causal contribution to the uplift.'},
 {key:'realization',label:'Incremental outcomes active by year end · %',min:0,max:100,step:1,percent:true,advanced:true,help:'Sales-cycle realization, not a second win rate.'},
 {key:'recognitionFraction',label:'2027 revenue recognition fraction · %',min:0,max:100,step:1,percent:true,advanced:true,help:'50% approximates half a year of service on average.'}
];
function renderInputs(){for(const id of invalidFields)if(id.startsWith('roi-'))invalidFields.delete(id);
 for(const advanced of [false,true]){
  $(advanced?'advanced-inputs':'commercial-inputs').innerHTML=fields.filter(f=>!!f.advanced===advanced).map(f=>'<label for="roi-'+f.key+'">'+esc(f.label)+'<input id="roi-'+f.key+'" data-roi="'+f.key+'" type="number" inputmode="decimal" min="'+f.min+'" max="'+f.max+'" step="'+f.step+'" value="'+Number((model[stream][f.key]*(f.percent?100:1)).toFixed(6))+'"><small>'+esc(f.help)+'</small></label>').join('');
 }
 document.querySelectorAll('[data-stream]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.stream===stream)));
 $('commercial-inputs').setAttribute('aria-labelledby',stream==='brandVisibility'?'bv-tab':'other-tab');
 document.querySelectorAll('[data-roi]').forEach(el=>el.addEventListener('input',()=>{
  const f=fields.find(x=>x.key===el.dataset.roi),v=Number(el.value);
  if(el.value===''||!Number.isFinite(v)||v<f.min||v>f.max){el.setAttribute('aria-invalid','true');invalidFields.add(el.id);invalidate('Enter a valid value for '+f.label+'.');return;}
  el.removeAttribute('aria-invalid');invalidFields.delete(el.id);model[stream][f.key]=v/(f.percent?100:1);scenario='custom';document.querySelectorAll('[data-scenario]').forEach(b=>b.classList.remove('active'));update();
 }));
}
function update(){
 if(invalidFields.size){invalidate('Complete all highlighted inputs to calculate this scenario.');return;}
 let out;try{out=R.calculatePortfolio(model);}catch(e){invalidate(e.message);return;}
 lastResult=out;$('export-roi').disabled=false;$('model-definition').classList.remove('model-error');
 const bv=out.brandVisibility,other=out.otherAdobe,b=bv.adobe,o=other.adobe,c=out.combined,x=model.brandVisibility;
 $('bv-arr').textContent=compact(b.modeledYearEndIncrementalARR);$('bv-recognized').textContent=money(b.modeledYearOneSubscriptionRevenue);
 $('bv-explanation').textContent=num(b.realizedAttributableIncrementalWins,1)+' realized, attributable additional wins × '+money(x.licenseARRPerWin)+' annual BV subscription value. Existing wins and partner services fees are excluded.';
 $('bv-volume-wins').textContent=num(bv.annual.incrementalWinsFromMoreSubmissions,1);$('bv-volume-detail').textContent=num(bv.annual.addedSubmissions,1)+' extra bids × '+num(bv.rates.addedSubmissionWinRate*100,1)+'% assumed win rate, before attribution and year-end realization.';
 $('bv-quality-wins').textContent=num(bv.annual.incrementalWinsFromWinRate,1);$('bv-quality-detail').textContent=num(bv.annual.baselineSubmissions,1)+' existing bids × '+num(x.winRateUpliftPp,1)+' percentage-point change, before attribution and realization.';
 $('bv-total-wins').textContent=num(b.realizedAttributableIncrementalWins,1);
 $('other-arr').textContent=compact(o.modeledYearEndIncrementalARR);$('other-wins').textContent=num(o.realizedAttributableIncrementalWins,1)+' incremental wins · '+money(o.modeledYearOneSubscriptionRevenue)+' modeled 2027 revenue';
 $('portfolio-arr').textContent=compact(c.modeledYearEndIncrementalARR);$('portfolio-recognized').textContent=money(c.modeledYearOneSubscriptionRevenue)+' modeled recognized revenue in 2027';
 const chosen=out[stream],cx=model[stream];$('model-definition').textContent=(stream==='brandVisibility'?'Brand Visibility':'Other Adobe')+': '+num(chosen.annual.qualifiedOpportunities,1)+' qualified opportunities after ramp; '+num(chosen.annual.baselineSubmissions,1)+' baseline bids → '+num(chosen.annual.totalSubmissions,1)+' with the tool. '+num(chosen.annual.hoursReleased)+' partner hours released; '+num(chosen.annual.hoursReinvested)+' reinvested in additional bids.'+(chosen.annual.demandCapApplied?' Added bids are capped by the eligible unsubmitted opportunities.':'')+' Inputs describe calendar 2027. '+chosen.warnings.join(' ');
 document.querySelector('.revenue-controls>p').textContent=(scenario==='custom'?'Custom scenario':'Illustrative '+({base:'working',conservative:'lower',stretch:'upper'}[scenario]||'working')+' case')+' · awaiting Adobe baseline data';
 $('roi-contribution').textContent=money(c.modeledNetContribution);$('roi-percent').textContent=c.modeledFirstYearROI===null?'Not defined':num(c.modeledFirstYearROI*100)+'%';
 const perWin=x.licenseARRPerWin*x.recognitionFraction*x.contributionMargin;$('roi-breakeven').textContent=perWin>0?num(Math.ceil(c.firstYearCost/perWin)):'Not attainable';
 const gate=out.brandVisibilityInvestmentGate;$('bv-investment').textContent='Brand Visibility alone: '+money(b.modeledYearOneContribution)+' modeled contribution against the entire '+money(c.firstYearCost)+' program budget. '+(b.modeledYearOneContribution>=c.firstYearCost?'The BV case covers this budget.':'The BV case does not cover this budget.')+' This uses an assumed '+num(x.contributionMargin*100)+'% contribution margin.';
 renderSensitivity();
}
function renderSensitivity(){let table=$('sensitivity-table');if(!table)return;table.innerHTML=Object.entries(R.portfolioPresets).map(([key,p])=>{const r=R.calculatePortfolio(p);return '<tr><td>'+esc({conservative:'Lower case',base:'Working case',stretch:'Upper case'}[key])+'</td><td>'+num(p.brandVisibility.activePartners)+'</td><td>'+money(r.brandVisibility.adobe.modeledYearEndIncrementalARR)+'</td><td>'+money(r.otherAdobe.adobe.modeledYearEndIncrementalARR)+'</td><td>'+money(r.combined.modeledYearOneSubscriptionRevenue)+'</td></tr>';}).join('');}
document.querySelectorAll('[data-stream]').forEach(b=>b.addEventListener('click',()=>{stream=b.dataset.stream;renderInputs();update();}));
document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',()=>{scenario=b.dataset.scenario;model=clone(R.portfolioPresets[scenario]);invalidFields.clear();document.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));document.querySelectorAll('[data-scenario]').forEach(x=>x.classList.toggle('active',x===b));$('rollout-cost').value=model.sharedRolloutCost;$('annual-cost').value=model.sharedAnnualRunBudget;$('contribution-margin').value=model.brandVisibility.contributionMargin*100;renderInputs();update();}));
for(const id of ['rollout-cost','annual-cost','contribution-margin'])$(id).addEventListener('input',()=>{const v=Number($(id).value);if($(id).value===''||!Number.isFinite(v)||v<0||id==='contribution-margin'&&v>100){$(id).setAttribute('aria-invalid','true');invalidFields.add(id);invalidate('Enter a valid program budget and contribution margin.');return;}$(id).removeAttribute('aria-invalid');invalidFields.delete(id);if(id==='rollout-cost')model.sharedRolloutCost=v;else if(id==='annual-cost')model.sharedAnnualRunBudget=v;else{model.brandVisibility.contributionMargin=v/100;model.otherAdobe.contributionMargin=v/100;}scenario='custom';document.querySelectorAll('[data-scenario]').forEach(b=>b.classList.remove('active'));update();});
$('export-roi').addEventListener('click',()=>{if(!lastResult)return;const payload={title:'2027 partner growth scenario',status:'Illustrative assumptions, not an Adobe forecast',scenario,technicalSnapshot:D.commit,inputs:model,results:lastResult,recognitionNote:'Annual approximation. Finance must validate subscription values, service start dates, recognition and contribution assumptions.'};const u=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='Adobe-Partner-Growth-2027-Scenario.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);});
$('rollout-cost').value=model.sharedRolloutCost;$('annual-cost').value=model.sharedAnnualRunBudget;$('contribution-margin').value=model.brandVisibility.contributionMargin*100;renderInputs();update();

// Deployment topology and the exact artifact census share the pinned source snapshot.
const components=Object.fromEntries(D.deployment.components.map(c=>[c.id,c]));
const deployNodes=[
 {id:'source-control',stage:'Source & build',label:'GitHub + Python',detail:'Versioned source, knowledge compilation and GitHub Actions checks.',metric:'6 build scripts · 1,151 physical lines',related:['build','ci']},
 {id:'hosting',stage:'Publish',label:'Adobe Proto',detail:'Static files packaged from sow/site/ and uploaded as a ZIP.',metric:'9 files · 8.62 MB uncompressed',related:[]},
 {id:'sow-rfi',stage:'Run',label:'Partner’s browser',detail:'JavaScript matching, scope, pricing and document generation.',metric:'7 standalone JS modules + 2 HTML sources',related:['canvas','local-readers','local-word','browser-storage']},
 {id:'optional-worker',stage:'Optional API',label:'Cloudflare Worker',detail:'Explicit AI-assisted reading or answering. Separate from the core path.',metric:'Shared worker · 3,035 physical lines',related:['shared-worker-storage']},
 {id:'optional-inference',stage:'Optional inference',label:'AWS Bedrock',detail:'Configured model calls through the Worker, in us-west-2.',metric:'Managed inference service',related:[]}
];
const deployButton=n=>'<button class="deploy-node" data-deploy="'+n.id+'" aria-pressed="false"><span class="micro">'+esc(n.stage)+'</span><strong>'+esc(n.label)+'</strong><small>'+esc(n.detail)+'</small><span class="node-footprint">'+esc(n.metric)+' →</span></button>';
$('deployment-map').innerHTML=deployNodes.slice(0,3).map((n,i)=>'<div class="deploy-stage"><p>'+esc(n.stage)+'<span aria-hidden="true">'+(i<2?'→':'')+'</span></p>'+deployButton(n)+'</div>').join('');$('optional-deployment-map').innerHTML='<div class="optional-path"><div class="optional-label"><p class="micro">EXPLICIT OPTIONAL BRANCH</p><h3>Browser → Worker → Bedrock</h3><p>The deterministic path does not require these calls. Browser storage keeps local working state; the shared Worker also has KV/R2 bindings and route telemetry.</p></div>'+deployNodes.slice(3).map(deployButton).join('')+'</div>';
function inspectDeployment(id){const n=deployNodes.find(x=>x.id===id),c=components[id],group=[c,...n.related.map(k=>components[k])];document.querySelectorAll('[data-deploy]').forEach(b=>{b.classList.toggle('active',b.dataset.deploy===id);b.setAttribute('aria-pressed',String(b.dataset.deploy===id));});
 const hostFields=id==='hosting'?'<p><strong>Documented host:</strong> <a href="'+esc(c.documented_url)+'" target="_blank" rel="noopener">'+esc(c.documented_url)+'</a></p><p><strong>Release:</strong> '+esc(c.release_method)+'</p>':'';
 const facts=hostFields+group.map(x=>'<p><strong>'+esc(x.title)+'.</strong> '+esc(x.execution_location)+'. '+esc(x.note||'')+'</p>').join('');const refs=[...new Map(group.flatMap(c=>c.evidence).map(e=>[e.url,e])).values()];
 $('deployment-detail').innerHTML='<div><p class="micro">COMPONENT · '+esc(n.stage)+'</p><h3>'+esc(n.label)+'</h3><a class="text-link" href="#scale" style="font-size:13px;display:inline-block;margin-top:20px">Inspect artifact lines and bytes →</a></div><div>'+facts+'<div class="deployment-files">'+refs.slice(0,8).map(e=>'<a href="'+esc(e.url)+'" target="_blank" rel="noopener">'+esc(e.path)+':'+e.start_line+' →</a>').join('')+'</div></div>';
}
document.querySelectorAll('[data-deploy]').forEach(b=>b.addEventListener('click',()=>inspectDeployment(b.dataset.deploy)));inspectDeployment('hosting');
const F=D.footprint,T=F.totals,files=F.active_artifacts;
$('scale-totals').innerHTML=[
 [num(T.maintained_source_artifacts.physical_lines),'maintained source-artifact lines','15 files · includes inline code, data and assets'],
 [num(T.javascript_test_sources.physical_lines),'regression test-source lines','59 test files · 35 core suites executed'],
 [size(T.runtime_knowledge_json.bytes),'canonical runtime knowledge','3 JSON files · 531 service methods'],
 [size(T.deployed_site_physical_artifacts.bytes),'packaged distribution','9 files · includes embedded data and libraries']
].map(([n,l,q])=>'<div><strong>'+n+'</strong><span>'+esc(l)+'</span><small>'+esc(q)+'</small></div>').join('');
const groups=[
 {id:'browser',title:'Browser application',kind:'Maintained source',filter:f=>f.category==='Standalone browser JavaScript source'||f.category==='Maintained HTML source with inline code and data',description:'Application logic, document intake, requirement discovery, answer composition, review, Word export and the SOW/canvas workspaces.',boundary:'HTML source includes inline JavaScript, CSS, generated reference blocks, data and embedded assets. These physical lines are an artifact footprint, not a deduplicated logical-code total.'},
 {id:'knowledge',title:'Knowledge assets',kind:'Canonical generated data',filter:f=>f.category==='Runtime knowledge JSON',description:'The catalog, factual evidence and implementation methods are shared across the workflow. They are compiled from curated inputs and then embedded in the application.',boundary:'The method file contains 531 service entries and 8,187 matching phrases packed onto one physical line. Bytes and record counts are more informative than formatting-dependent line counts.'},
 {id:'build',title:'Build pipeline',kind:'Active Python scripts',filter:f=>f.category==='Active Python build pipeline',description:'Six active Python files assemble, validate and normalize the current application and its knowledge. Historical edit and research scripts are outside this active-build category.',boundary:'These source files produce artifacts shown in the distribution tab. Do not add generated copies as newly authored code.'},
 {id:'tests',title:'Validation',kind:'Regression sources and checker',filter:f=>f.category==='JavaScript regression test source'||f.component==='Static content and catalog checks',description:'59 JavaScript test-source files plus the main static checker. The separate validation record reports the 35 core suites executed for this snapshot.',boundary:'An inventory of test files is not a claim that every test was executed or every behavior is covered.'},
 {id:'worker',title:'Optional AI worker',kind:'Shared server-side source',filter:f=>f.component==='Optional AI worker',description:'The Cloudflare Worker exposes optional RFI model routes and other Warroom features. It is separate from local matching and Word generation.',boundary:'This is a shared Worker file, not 3,035 lines dedicated solely to the RFI routes. Configured providers and routes are source evidence; live deployment settings were not audited.'},
 {id:'distribution',title:'Published package',kind:'Generated files and vendor libraries',rows:D.deployedFootprint,description:'Exact nine-file distribution built for Adobe Proto. Generated HTML embeds application logic, knowledge and assets; parser/export libraries are bundled separately.',boundary:'Uncompressed artifact bytes, not page-load transfer measurements. Generated HTML and vendor libraries are separate from authored source. This confirms the pinned build, not the version currently served by Proto.'}
];
// Exact census categories preserve all seven standalone browser modules.
function groupRows(g){return g.rows||files.filter(g.filter);}
$('artifact-components').innerHTML=groups.map(g=>'<button data-artifact="'+g.id+'" aria-pressed="false"><span>'+esc(g.title)+'</span><small>'+groupRows(g).length+' files</small></button>').join('');
function inspectArtifacts(id){const g=groups.find(x=>x.id===id),rows=groupRows(g);document.querySelectorAll('[data-artifact]').forEach(b=>{b.classList.toggle('active',b.dataset.artifact===id);b.setAttribute('aria-pressed',String(b.dataset.artifact===id));});$('artifact-kind').textContent=g.kind;$('artifact-title').textContent=g.title;$('artifact-description').textContent=g.description;
 $('artifact-rows').innerHTML=rows.map(f=>'<tr><td><a href="'+esc(f.evidence_url||D.repositoryUrl+'/blob/'+D.commit+'/'+f.path)+'" target="_blank" rel="noopener">'+esc(f.path)+'</a><small>'+esc(f.component||f.category)+(f.core_suite?' · executed core suite':'')+'</small></td><td>'+num(f.physical_lines)+'</td><td title="'+num(f.bytes)+' bytes">'+size(f.bytes)+'</td></tr>').join('')+'<tr class="artifact-total"><td><strong>'+rows.length+' artifacts in this view</strong></td><td><strong>'+num(rows.reduce((n,r)=>n+r.physical_lines,0))+'</strong></td><td><strong>'+size(rows.reduce((n,r)=>n+r.bytes,0))+'</strong></td></tr>';
 $('artifact-boundary').textContent=g.boundary;
}
document.querySelectorAll('[data-artifact]').forEach(b=>b.addEventListener('click',()=>inspectArtifacts(b.dataset.artifact)));inspectArtifacts('browser');
$('footprint-policy').textContent=F.definitions.physical_lines+' '+F.definitions.bytes+' '+F.definitions.active_scope_completeness+' The tracked SOW tree contains '+num(T.sow_tree.files)+' artifacts ('+size(T.sow_tree.bytes)+'), including historical research, mockups, generated copies and libraries. That repository size is not an authored-code total.';
})();
