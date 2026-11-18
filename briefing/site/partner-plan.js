(()=>{'use strict';
const P=window.PartnerPlan,$=id=>document.getElementById(id),clone=x=>JSON.parse(JSON.stringify(x));
if(!P){$('app-error').hidden=false;return;}
const money=n=>n===null?'Not attainable':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const compact=n=>n===null?'Not attainable':n>=1e6?'$'+(n/1e6).toLocaleString('en-US',{maximumFractionDigits:2})+'M':money(n);
const num=n=>n===null?'Not attainable':Number(n).toLocaleString('en-US',{maximumFractionDigits:1});
let inputs=clone(P.defaultInputs),result=null;
const fields=[['partners','Partners',1,0,10000],['dealsPerPartner','Deals per partner',1,0,1000],['dealValue','Average deal value',5000,0,10000000],['closeRate','Share closing in 2027',1,0,100]];
function render(){
 $('plan-mode').value=inputs.mode;$('plan-basis').value=inputs.valueBasis;$('plan-years').value=inputs.contractYears;$('plan-recognition').value=inputs.recognitionFraction*100;
 $('plan-tiers').innerHTML=inputs.tiers.map((t,i)=>'<tr><th scope="row">'+t.name+'<small>'+['Large enterprise opportunities','Established delivery partners','Smaller specialist opportunities'][i]+'</small></th>'+fields.map(([key,label,step,min,max])=>'<td><input type="number" id="plan-'+i+'-'+key+'" data-plan-tier="'+i+'" data-plan-key="'+key+'" aria-label="'+t.name+' '+label+'" value="'+t[key]*(key==='closeRate'?100:1)+'" step="'+step+'" min="'+min+'" max="'+max+'"></td>').join('')+'<td id="plan-tier-result-'+i+'"></td></tr>').join('');
 document.querySelectorAll('[data-plan-tier]').forEach(el=>el.addEventListener('input',update));update();
}
function invalidate(message){result=null;$('plan-export').disabled=true;['plan-hero-value','plan-hero-pipeline','plan-hero-target','plan-hero-wins','plan-annual-value','plan-pipeline','plan-win-count','plan-opportunity-count','plan-recognized'].forEach(id=>$(id).textContent='N/A');for(let i=0;i<3;i++)$('plan-tier-result-'+i).textContent='N/A';['plan-hero-summary','plan-result-summary','plan-pitch'].forEach(id=>$(id).textContent='Complete valid plan inputs to calculate this scenario.');$('plan-sensitivity-rows').innerHTML='';$('plan-status').textContent=message;$('plan-status').classList.add('model-error');}
function update(){
 const next=clone(inputs);next.mode=$('plan-mode').value;next.valueBasis=$('plan-basis').value;
 $('plan-term-label').hidden=next.valueBasis!=='tcv';
 let error='';
 for(const el of document.querySelectorAll('[data-plan-tier]')){const v=Number(el.value),key=el.dataset.planKey;const valid=el.value!==''&&Number.isFinite(v)&&v>=Number(el.min)&&v<=Number(el.max)&&(key!=='partners'||Number.isInteger(v));el.setAttribute('aria-invalid',String(!valid));if(!valid)error='Enter a valid value for '+el.getAttribute('aria-label')+'.';else next.tiers[Number(el.dataset.planTier)][key]=v/(key==='closeRate'?100:1);}
 for(const [id,key,percent] of [['plan-years','contractYears',false],['plan-recognition','recognitionFraction',true]]){const el=$(id);if(key==='contractYears'&&next.valueBasis==='annual'){el.removeAttribute('aria-invalid');continue;}const v=Number(el.value),valid=el.value!==''&&Number.isFinite(v)&&v>=Number(el.min)&&v<=Number(el.max)&&(percent||Number.isInteger(v));el.setAttribute('aria-invalid',String(!valid));if(!valid)error='Enter a valid contract term and revenue-recognition fraction.';else next[key]=v/(percent?100:1);}
 if(error){invalidate(error);return;}
 try{result=P.calculate(next);}catch(e){invalidate(e.message);return;}
 inputs=next;$('plan-export').disabled=false;$('plan-status').classList.remove('model-error');
 const sourced=inputs.mode==='sourced';
 $('plan-heading-partners').textContent=num(result.partners);$('plan-hero-outcome-label').textContent='Annual Brand Visibility contract value from '+(sourced?'modeled 2027 wins':'the 2027 win target');$('plan-outcome-label').textContent='Annual contract value from '+(sourced?'2027 wins':'the 2027 win target');$('plan-hero-wins-label').textContent=$('plan-win-label').textContent=sourced?'expected wins during 2027':'target wins during 2027';
 $('plan-deals-heading').textContent=(sourced?'Opportunities':'Won deals')+' / partner';$('plan-hero-target-label').textContent=sourced?'sourced opportunities':'target won deals';
 $('plan-hero-value').textContent=compact(result.annualizedWonValue);$('plan-hero-pipeline').textContent=compact(result.pipelineValue);$('plan-hero-target').textContent=num(result.targetDeals);$('plan-hero-wins').textContent=num(result.expectedWins);
 $('plan-hero-summary').textContent=num(result.partners)+' partners · '+num(result.targetDeals)+' '+(sourced?'qualified opportunities':'target wins')+' · tier-specific deal values and in-year close assumptions.';
 $('plan-annual-value').textContent=compact(result.annualizedWonValue);$('plan-pipeline').textContent=compact(result.pipelineValue);$('plan-win-count').textContent=num(result.expectedWins);$('plan-opportunity-count').textContent=num(result.requiredOpportunities);$('plan-recognized').textContent=money(result.recognizedRevenue);
 result.tiers.forEach((t,i)=>$('plan-tier-result-'+i).textContent=compact(t.annualizedWonValue));
 const basis=inputs.valueBasis==='annual'?'Deal values are assumed to be annual Adobe subscription values.':'Deal values are assumed to be '+inputs.contractYears+'-year total contract values, divided by '+inputs.contractYears+' to annualize.';
 $('plan-result-summary').textContent=(sourced?num(result.targetDeals)+' sourced opportunities become '+num(result.expectedWins)+' expected wins after each tier’s in-year close assumption.':num(result.targetDeals)+' won deals are the target. The close-rate assumptions determine how many qualified opportunities would be required.')+' '+basis;
 $('plan-status').textContent=(result.requiredOpportunities===null?'The won-deal target is not attainable at a 0% close rate for a tier with a nonzero target. ': '')+'Count each customer opportunity once, even if multiple partners pursue it. Fractional wins are expected values. No current-year revenue baseline is assumed. '+result.warnings.join(' ');
 document.querySelector('.plan-sensitivity').hidden=!sourced;
 $('plan-sensitivity-rows').innerHTML=[.1,.2,.25,.3,.4].map(rate=>{const sample=clone(inputs);sample.tiers.forEach(t=>t.closeRate=rate);const r=P.calculate(sample);return '<tr><th scope="row">'+rate*100+'%</th><td>'+num(r.expectedWins)+'</td><td>'+money(r.annualizedWonValue)+'</td></tr>';}).join('');
 $('plan-pitch').textContent='A '+num(result.partners)+'-partner Brand Visibility program could support '+money(result.annualizedWonValue)+' in annual contract value from 2027 wins under this scenario. '+(result.requiredOpportunities===null?'The current conversion assumptions cannot support the selected won-deal target.':'That requires '+num(result.requiredOpportunities)+' qualified opportunities and '+num(result.expectedWins)+' wins during the year.')+' The tool is the proposed partner-enablement mechanism; incremental impact must be measured against business as usual.';
}
for(const id of ['plan-mode','plan-basis'])$(id).addEventListener('change',update);
for(const id of ['plan-years','plan-recognition'])$(id).addEventListener('input',update);
$('plan-reset').addEventListener('click',()=>{inputs=clone(P.defaultInputs);render();});
$('plan-export').addEventListener('click',()=>{if(!result)return;const payload={title:'2027 Brand Visibility partner plan',status:'Illustrative planning assumptions, not an Adobe forecast or a measured tool effect',inputs,results:result,counting:'Unique customer opportunities; no partner service fees; total partner sales are not all incremental',independentOfDetailedCalculator:true,technicalSnapshot:window.BRIEF_DATA.commit};const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='Brand-Visibility-2027-Partner-Plan.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});render();
})();
