/* Step 49, part two (Nov 9 2026): drafted answers for the RFP Builder prototype. Everything runs in the browser from the
   catalog the page already carries (RFP_CAT: the canvas's products, connections and lines; CATALOG: the SOW templates;
   REVIEW_CONCEPTS: the research lines' SOW text). No AI, no network, nothing stored: answers live in memory with the
   question list and clear when the page closes. */
(function(){
const R=window.RFPBuilder,CAT=typeof RFP_CAT!=='undefined'?RFP_CAT:null;if(!R||!CAT)return;   // RFP_CAT and the page's CATALOG are const declarations, so they are not on window
const $r=id=>document.getElementById(id);
const P=Object.fromEntries(CAT.products.map(p=>[p.id,p])),C=CAT.connections.filter(c=>P[c.a]&&P[c.b]),LN=CAT.lines;
const TPL=Object.fromEntries((typeof CATALOG!=='undefined'?CATALOG:[]).map(t=>[t.id,t]));
const CON=typeof REVIEW_CONCEPTS!=='undefined'?REVIEW_CONCEPTS:{};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- what a question is about */
const ALIASES={
 bv:['brand visibility','llm optimizer','ai assistant','ai answer','ai overview','chatgpt','perplexity','gemini','ai search','ai agent','agentic traffic','answer engine','generative engine','visible in ai','show up in ai'],
 cja:['customer journey analytics','cja','analytics','measure','measurement','attribution','journey analysis','report on','reporting','dashboards','conversion data'],
 aemsites:['aem sites','experience manager sites','adobe experience manager','aem','content management system','cms','authoring','web content'],
 eds:['edge delivery','site speed','page speed','core web vitals','fast site','new website','new site','rebuild','redesign','website platform'],
 so:['sites optimizer','seo','search engine optimization','search traffic','organic traffic','technical seo','site optimization'],
 commerce:['adobe commerce','magento','storefront','online store','ecommerce','e-commerce','product page','product catalog','checkout','shopping'],
 bc:['brand concierge','concierge','chatbot','conversational','virtual assistant','answer their questions','questions about accounts','self-service answers','live chat'],
 cw:['coworker','agent skills','readouts on request','routine work','ai agent for our team','by asking'],
 rtcdp:['real-time cdp','rtcdp','customer data platform','cdp','customer profile','unified profile','audiences','segments','known customers','first-party data'],
 ajo:['journey optimizer','ajo','journeys','email journey','triggered message','sms','push notification','campaign orchestration','abandoned cart','messaging'],
 target:['adobe target','target','personalization','personalize','personalise','a/b test','ab test','experimentation','recommendations'],
 marketo:['marketo','marketing automation','lead scoring','lead nurturing','nurture','leads','b2b marketing','feed marketo'],
 workfront:['workfront','work management','project intake','request intake','campaign request','proofing'],
 aemassets:['aem assets','experience manager assets','digital asset management','dam','asset library','brand assets','images and video','approved images'],
 cdn:['cdn','akamai','cloudflare','cloudfront','fastly','imperva','access logs','log forwarding'],
 dwh:['snowflake','bigquery','databricks','data warehouse','warehouse'],
 cstore:['amazon s3','blob storage','cloud storage','sftp','file drops'],
 crm:['salesforce','dynamics 365','our crm','the crm','crm'],
 ads:['google ads','meta ads','tiktok','pinterest','snapchat','ad platform','paid media','ad spend'],
 bi:['power bi','tableau','looker','bi tool','business intelligence'],
 search:['search console','google analytics 4','ga4'],
 csrc:['sharepoint','google drive','word documents','google docs','document authoring'],
 cms:['another cms','wordpress','sitecore','drupal','contentful','tag manager']};
const STOP=new Set('a an and the of to for in on with our your you we us it its is are be how what which would do does can will should describe provide explain list detail outline please that this these those from by at as or into than then there their they them about any all some more most other such also after before when where who whom need needs needed want wants including include includes use using used'.split(' '));
const stem=w=>w.length>5?w.replace(/(ing|ed|es)$/,'').replace(/ies$/,'y'):w.length>3?w.replace(/s$/,''):w;
const tokens=s=>[...new Set(String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').split(' ').filter(w=>w.length>2&&!STOP.has(w)).map(stem))];
function detect(q){
  const t=' '+q.toLowerCase().replace(/[^a-z0-9/]+/g,' ')+' ',score={};
  for(const [pid,names] of Object.entries(ALIASES)){if(!P[pid])continue;
    for(const a of names){const hit=a.length<=4?t.includes(' '+a+' '):t.includes(a);if(hit)score[pid]=(score[pid]||0)+(a.length<=4?1:2);}}
  return Object.entries(score).sort((x,y)=>y[1]-x[1]).map(x=>x[0]);
}
const overlap=(a,b)=>a.filter(x=>b.includes(x)).length;
const ONGOING=/\b(ongoing|after launch|post-launch|monthly|each month|run and operate|support|maintenance|optimi[sz]ation services|managed services)\b/i;
const GENERIC=new Set(['answer','content','data','site','page','program','review','setup','monthly','service','adobe','web','custom','client','brand','report','plan','work','team','experience','digital','search','ai','connect','connection','setup','existing','new','agreed']);
function match(q,ctx){
  const qt=tokens(q);let prods=detect(q).slice(0,3);
  const ongoing=ONGOING.test(q);let fromContext=false;
  if(!prods.length){if(ongoing&&ctx&&ctx.length){prods=ctx.slice(0,4);fromContext=true;}else return {products:[],conn:null,lines:[],fromContext:false};}
  // a connection answers only when the question names both of its products; an 'ongoing services' question wants the monthly lines, not a connection
  const conns=fromContext?[]:C.filter(c=>prods.includes(c.a)&&prods.includes(c.b)).map(c=>({c,s:overlap(qt,tokens((c.label||'')+' '+(c.how||'')+' '+((c.gain||{}).text||'')))})).sort((x,y)=>y.s-x.s);
  const conn=conns.length?conns[0].c:null;
  const owners=[...prods.map(id=>P[id]),...(conn?[conn]:[])];
  const seen=new Set(),cands=[];
  for(const o of owners){const isConn='a' in o;for(const l of [...(o.lines||[]),...(o.more||[])]){if(seen.has(l)||!LN[l])continue;seen.add(l);
    const L=LN[l],isDefault=(o.lines||[]).includes(l),monthly=L.unit==='monthly';
    if(fromContext&&!monthly)continue;
    const nameHit=overlap(qt,tokens(L.name).filter(w=>!GENERIC.has(w))),hit=overlap(qt,tokens(L.name))*2+overlap(qt,tokens(L.scope||(TPL[l]||{}).scope||''));
    let s=hit+(isConn?3:0)+(isDefault?2:0);
    if(!isDefault&&(hit<3||!nameHit))s=-1;        // an optional line needs a distinctive word of its own name in the question
    if(conn&&!isConn&&hit<2)s=-1;                  // beside a matched connection, a product line needs real overlap too
    cands.push({id:l,s,hit,isDefault});}}
  cands.sort((x,y)=>y.s-x.s);
  let lines=cands.filter(x=>x.s>0&&(x.hit>0||x.isDefault)).slice(0,fromContext?5:4).map(x=>x.id);
  if(!lines.length&&prods.length&&!fromContext){const o=conn||P[prods[0]];lines=(o.lines||[]).slice(0,2);}
  return {products:prods,conn,lines,fromContext};
}

/* ---------- the partner's words to the client */
function rfp(t){
  return String(t||'')
    .replace(/\bYour client's\b/g,'Your').replace(/\byour client's\b/g,'your').replace(/\bYour client\b/g,'You').replace(/\byour client\b/g,'you')
    .replace(/\b([Tt]he )?Client-(\w+)/g,(m,t,w)=>(t&&t[0]==='T'?'Your ':'your ')+w)
    .replace(/\bone your\b/g,'your')
    .replace(/\bThe Client's\b(?! ID| Secret)/g,'Your').replace(/\bthe Client's\b(?! ID| Secret)/g,'your').replace(/\bThe Client\b(?! ID| Secret)/g,'You').replace(/\bthe Client\b(?! ID| Secret)/g,'you')
    .replace(/\bnamed Client (reviewers?|approvers?|owners?)\b/g,'your named $1').replace(/\bone Client review\b/g,'one review with you').replace(/\band Client agree\b/g,'and you agree')
    .replace(/\bClient (reviewers?|review|approvers?|approval|team|owners?|stakeholders?)\b/g,'your $1')
    .replace(/\bThe partner's\b/g,'Our').replace(/\bthe partner's\b/g,'our').replace(/\bThe partner\b/g,'We').replace(/\bthe partner\b/g,'we').replace(/\bPartners\b/g,'We').replace(/\bpartner-built\b/g,'our')
    .replace(/\b([Yy]ou) (has|is|confirms|provides|approves|names|supplies|grants|manages|installs|shares|agrees|owns|runs|keeps|reviews|signs|sets|adds|licenses|needs|holds|pays|picks|decides|gives|sends|forwards|turns|enables|accepts|appoints)\b/g,(m,y,v)=>y+' '+({has:'have',is:'are'}[v]||v.replace(/s$/,'')))
    .replace(/\b([Ww]e) (confirms|checks|builds|sets|validates|documents|tests|installs|configures|maps|keeps|reviews|prepares|publishes|runs|flags|routes|starts|agrees)\b/g,(m,w,v)=>w+' '+singular(v))
    .replace(/\b([Ww]e|[Yy]ou)\b([^.;:]*?) and (supplies|provides|confirms|approves|names|grants|manages|keeps|owns|runs|starts|agrees|sets|builds|tests|reviews|flags|routes|checks|maps|publishes|designs|holds|signs|pays)\b/g,(m,w,mid,v)=>w+mid+' and '+singular(v));
}
function singular(v){if(/ies$/.test(v))return v.replace(/ies$/,'y');if(/(sh|ch|x|ss)es$/.test(v))return v.replace(/es$/,'');return v.replace(/s$/,'');}
const lc=s=>s?s[0].toLowerCase()+s.slice(1):s;
function doLine(id){const L=LN[id],scope=rfp(L.scope||(TPL[id]||{}).scope||L.name);
  let m=/^each month,?\s+(.*)$/i.exec(scope);if(m)return 'Each month we will '+lc(m[1]);
  m=/^((?:where|if|for|when|once|after)\b[^:]{0,120}):\s*(.*)$/i.exec(scope);if(m)return m[1]+': we will '+lc(m[2]);
  return 'We will '+lc(scope);}
function sources(m){const out=[],seen=new Set();const add=(url,title)=>{if(!url||seen.has(url))return;seen.add(url);out.push({url,title:title||url});};
  for(const id of m.lines){const L=LN[id];add(L.url,L.src);for(const r of (L.references||[]))add(r.url,r.title);}
  if(m.conn){if(m.conn.source)add(m.conn.source.url,m.conn.source.title);for(const f of (m.conn.flows||[]))if(f.source)add(f.source.url,f.source.title);}
  return out.slice(0,6);}
function compose(q,ctx){
  const m=match(q.text,ctx||context());
  if(!m.products.length&&!m.lines.length)return null;
  const names=m.products.map(id=>P[id].name);
  const approach=[];
  if(m.conn){approach.push(rfp(m.conn.how||''));if(m.conn.gain&&m.conn.gain.text)approach.push(rfp(m.conn.gain.text));}
  else if(names.length)approach.push((m.fromContext?'After launch, across the Adobe products in this proposal, our ongoing services for ':'We would deliver this with ')+(names.length>1?names.slice(0,-1).join(', ')+' and '+names[names.length-1]:names[0])+(m.fromContext?' are these.':'.'));
  const work=m.lines.filter(id=>LN[id].unit!=='monthly').map(doLine),after=m.lines.filter(id=>LN[id].unit==='monthly').map(doLine);
  let need=[];
  if(m.conn)need=(m.conn.sowPrereqs||m.conn.prereqs||[]).slice(0,5).map(rfp);
  else{for(const id of m.lines){const a=(TPL[id]||{}).assumptions||(CON[id]||{}).assumptions||'';if(a){need.push(...rfp(a).split(/(?<=\.)\s+/).slice(0,2));}if(need.length>=4)break;}need=need.slice(0,4);}
  return {m,sections:[['Our approach',approach.filter(Boolean)],['What we would do',work],['What we would need from you',need],['After launch',after]].filter(s=>s[1].length),sources:sources(m)};
}
function plain(d){return d.sections.map(([h,items])=>h+'\n'+items.map(x=>'- '+x).join('\n')).join('\n\n')+(d.sources.length?'\n\nSources\n'+d.sources.map(s=>'- '+s.title+': '+s.url).join('\n'):'');}
function answerHTML(d){return d.sections.map(([h,items])=>'<h4>'+esc(h)+'</h4>'+(items.length===1&&h==='Our approach'?'<p>'+esc(items[0])+'</p>':'<ul>'+items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>')).join('')+(d.sources.length?'<h4>Sources</h4><ul class="rfp-sources">'+d.sources.map(s=>'<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener">'+esc(s.title)+'</a></li>').join('')+'</ul>':'');}

/* ---------- the answer panel */
const rfpState=R.state;let editing=false;
function context(){const c={};for(const q of rfpState.questions){if(q.kind==='firm')continue;for(const id of detect(q.text))c[id]=(c[id]||0)+1;}return Object.entries(c).sort((x,y)=>y[1]-x[1]).map(x=>x[0]).filter(id=>!P[id].outside);}
function current(){const i=rfpState.selected;return Number.isInteger(i)?rfpState.questions[i]:null;}
function renderAnswer(){
  const box=$r('rfp-answer');if(!box)return;const q=current();
  if(!q){box.innerHTML='<p class="hint">Pick a question on the left to see its drafted answer.</p>';return;}
  const head='<h3>'+(q.label?'<b>'+esc(q.label)+'</b> ':'')+esc(q.text)+'</h3>';
  if(q.kind==='firm'){box.innerHTML=head+'<p class="rfp-note">This one is about your firm, so the tool leaves it to you. It stays in the downloaded response with a blank space for your answer.</p>'+nav();return;}
  if(!q.draft)q.draft=compose(q);
  if(!q.draft){box.innerHTML=head+'<p class="rfp-note">No match in the catalog for this question. Answer it yourself, or move it to Your firm. The questions this tool answers are about Adobe products, their connections and the services around them.</p>'+nav();return;}
  const state=q.status==='used'?'<span class="rfp-state ok">Used</span>':q.status==='skipped'?'<span class="rfp-state">Skipped</span>':'';
  if(editing){box.innerHTML=head+state+'<textarea id="rfp-edit" rows="16" aria-label="Edit the answer">'+esc(q.answer||plain(q.draft))+'</textarea><div class="rfp-actions"><button type="button" class="primary" id="rfp-save-edit">Save and use</button><button type="button" id="rfp-cancel-edit">Cancel</button></div>';return;}
  const body=q.answer&&q.answer!==plain(q.draft)?'<pre class="rfp-plain">'+esc(q.answer)+'</pre>':answerHTML(q.draft);
  const products=q.draft.m.products.map(id=>'<span class="rfp-chip">'+esc(P[id].name)+'</span>').join('');
  box.innerHTML=head+state+'<p class="rfp-drawn">Drawn from: '+products+(q.draft.m.conn?'<span class="rfp-chip conn">'+esc(P[q.draft.m.conn.a].name+' + '+P[q.draft.m.conn.b].name)+'</span>':'')+'</p>'+body+
    '<div class="rfp-actions"><button type="button" class="primary" id="rfp-use">'+(q.status==='used'?'Used, keep it':'Use this answer')+'</button><button type="button" id="rfp-edit-btn">Edit</button><button type="button" id="rfp-skip">Skip</button>'+nav()+'</div>';
}
function nav(){return '<button type="button" id="rfp-next">Next question</button>';}
function select(i){rfpState.selected=i;editing=false;R.renderList();renderAnswer();}
function next(){const qs=rfpState.questions;const from=Number.isInteger(rfpState.selected)?rfpState.selected:-1;
  for(let k=1;k<=qs.length;k++){const i=(from+k)%qs.length;if(qs[i].kind!=='firm'&&!qs[i].status){select(i);return;}}
  for(let k=1;k<=qs.length;k++){const i=(from+k)%qs.length;if(qs[i].kind!=='firm'){select(i);return;}}}
function summary(){
  const el=$r('rfp-summary');if(!el)return;const qs=rfpState.questions;if(!qs.length){el.hidden=true;return;}
  const adobe=qs.filter(q=>q.kind!=='firm'),used=adobe.filter(q=>q.status==='used'),lines=selectedLineIds();
  el.hidden=false;
  el.innerHTML='<p><b>'+used.length+' of '+adobe.length+'</b> Adobe-services answer'+(adobe.length===1?'':'s')+' used, <b>'+lines.size+'</b> service'+(lines.size===1?'':'s')+' selected for the statement of work.</p>'+
    '<div class="rfp-actions"><button type="button" class="primary" id="rfp-to-sow"'+(lines.size?'':' disabled')+'>Add to my statement of work</button><button type="button" id="rfp-download">Download RFP response</button></div>';
}
function selectedLineIds(){const s=new Set();for(const q of rfpState.questions)if(q.status==='used'&&q.draft)for(const id of q.draft.m.lines)s.add(id);return s;}
function selectedProducts(){const s=new Set();for(const q of rfpState.questions)if(q.status==='used'&&q.draft){for(const id of q.draft.m.products)s.add(id);if(q.draft.m.conn){s.add(q.draft.m.conn.a);s.add(q.draft.m.conn.b);}}return s;}

/* ---------- into the statement of work: the same hand-off the canvas uses, as Your own play */
function toSow(){
  const lines=selectedLineIds(),prods=[...selectedProducts()];if(!lines.size)return;
  const adobe=prods.filter(id=>!P[id].outside),outside=prods.filter(id=>P[id].outside);
  const owners=[...prods.map(id=>P[id]),...C.filter(c=>prods.includes(c.a)&&prods.includes(c.b))];
  const payload=[],seen=new Set(),ls={};
  for(const o of owners){const conn='a' in o;for(const l of [...(o.lines||[]),...(o.more||[])]){if(seen.has(l)||!LN[l])continue;seen.add(l);const L=LN[l],on=lines.has(l);ls[l]=on;
    payload.push({id:l,on,lock:false,want:on,def:(o.lines||[]).includes(l),name:L.name,unit:L.unit,low:L.low,base:L.base,high:L.high,url:L.url,src:L.src,references:L.references||[],scope:L.scope||'',stage:L.unit==='monthly'?'Optimize':conn?'Connect':'Launch',
      prereqs:[L.origin==='research'&&conn?'Availability: '+String(o.sowAvailability||o.availability||'not stated by Adobe').replace(/([^.])$/,'$1.'):'',L.origin==='research'&&conn&&o.prereqs&&o.prereqs.length?'Prerequisites for '+P[o.a].name+' + '+P[o.b].name+': '+(o.sowPrereqs||o.prereqs).join('; ').replace(/\.$/,'')+'.':'',L.ext?'Also needs '+L.ext.replace(/\.$/,'')+'.':'',L.tier?'Assumes your client has '+L.tier.replace(/\.$/,'')+'.':''].filter(Boolean).join(' ')});}}
  const now=Date.now(),names=adobe.map(id=>P[id].name);
  try{
    localStorage.setItem('abv-sow-handoff',JSON.stringify({v:1,play:'custom',size:state.size||'typical',rate:state.rate||'',lines:payload,managed:payload.map(l=>l.id),fresh:true,products:adobe,names,outside,at:now}));
    localStorage.setItem('abv-sow-build-v1',JSON.stringify({v:2,play:'custom',on:adobe,out:outside,ls,keep:{},rate:state.rate||0,size:state.size||'typical',months:state.months||12,eff:null,fresh:false,cur:state.currency||'USD',def:null,recover:names}));
  }catch(e){toast('This browser blocks saving, so the services could not be carried over.');return;}
  applyHandoff();render();go('services');toast(lines.size+' service'+(lines.size===1?'':'s')+' from the RFP are on Your own play. The RFP list is still on the RFP Builder tab.');
}

/* ---------- the response document */
function responseDoc(){
  const qs=rfpState.questions,name=rfpState.name||'RFP';
  const body=qs.map(q=>{const label=(q.label?q.label+' ':'')+q.text;
    if(q.kind==='firm')return '<section><h3>'+esc(label)+'</h3><p class="tag">About your firm</p><p class="blank">Your answer:</p><div class="space"></div></section>';
    const d=q.draft||compose(q);
    if(!d)return '<section><h3>'+esc(label)+'</h3><p class="tag">No catalog match</p><p class="blank">Your answer:</p><div class="space"></div></section>';
    const status=q.status==='used'?'Reviewed':q.status==='skipped'?'Skipped by the partner':'Draft, not yet reviewed';
    const text=q.answer&&q.answer!==plain(d)?'<pre>'+esc(q.answer)+'</pre>':answerHTML(d);
    return '<section><h3>'+esc(label)+'</h3><p class="tag">'+status+'</p>'+text+'</section>';}).join('');
  return '<!doctype html><html><head><meta charset="utf-8"><title>'+esc(name)+': response draft</title><style>body{font-family:"Source Sans 3",Arial,sans-serif;color:#1c1c1c;max-width:860px;margin:40px auto;padding:0 20px;line-height:1.5}h1{font-size:26px}h3{font-size:17px;margin:28px 0 4px}h4{font-size:13px;letter-spacing:1.2px;text-transform:uppercase;margin:14px 0 4px}p,li{font-size:15px}.tag{font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:0 0 6px}.blank{font-weight:600}.space{height:90px;border:1px dashed #999;border-radius:8px}pre{white-space:pre-wrap;font:inherit}section{page-break-inside:avoid}.intro{border:1.5px solid #1c1c1c;border-radius:10px;padding:12px 16px}</style></head><body>'+
    '<h1>'+esc(name)+': response draft</h1><p class="intro">Drafted by the partner from Adobe\'s documentation, question by question. Answers marked Reviewed were checked by the partner; drafts not yet reviewed and questions about the partner\'s firm still need the partner\'s words. Sources are Adobe Experience League and adobe.com pages.</p>'+body+'</body></html>';
}

/* ---------- wiring */
document.addEventListener('click',e=>{
  const li=e.target.closest('#rfp-questions li');
  if(li&&!e.target.closest('select')){select(Number(li.dataset.i));return;}
  const id=e.target.id,q=current();
  if(id==='rfp-use'&&q&&q.draft){q.status='used';if(!q.answer)q.answer=plain(q.draft);R.renderList();renderAnswer();summary();return;}
  if(id==='rfp-skip'&&q){q.status='skipped';R.renderList();renderAnswer();summary();return;}
  if(id==='rfp-edit-btn'&&q){editing=true;renderAnswer();return;}
  if(id==='rfp-cancel-edit'){editing=false;renderAnswer();return;}
  if(id==='rfp-save-edit'&&q){q.answer=$r('rfp-edit').value;q.status='used';editing=false;R.renderList();renderAnswer();summary();return;}
  if(id==='rfp-next'){next();return;}
  if(id==='rfp-to-sow'){toSow();return;}
  if(id==='rfp-download'){download(((rfpState.name||'RFP').replace(/\.[a-z0-9]+$/i,'').replace(/[^a-zA-Z0-9-]/g,'-').slice(0,80)+'-response.html'),responseDoc(),'text/html');return;}
});
R.onRender=()=>{summary();if(current()&&current().kind!=='firm'&&!current().draft)current().draft=compose(current());};
R.onLoad=()=>{rfpState.selected=null;editing=false;renderAnswer();summary();};
window.RFPAnswers={match,compose,rfp,plain,toSow,responseDoc,context,detect};
})();
