/* RFI Builder step 75 (Nov 11 2026): Download proposal, a full proposal as a Word file. Step 92 (Nov 13 2026, Adam: "we've
   gotta get rid of the AI", "Yes, please" to the no-AI sample and its four fixes): the proposal is built on this page with no AI,
   in an instant, from the answers the page already drafts for each question (the knowledge base's method answers, else the
   catalog's), the client's own facts, the catalog's services and
   hours and Adobe's public sources. Its parts: the cover and At a glance; an executive summary filled with the client's facts
   (the products, the dates, the totals, what the work leaves them with, what they ruled out); What you told us; one section for
   each of the RFI's own sections, requirement by requirement; Services and effort; What we need from you; About our firm, for
   the partner to answer; the requirements matrix; the Adobe sources. Bracketed fields mark what only the partner can supply.
   Exposes window.RFPProposal. */
(function(){
const R=window.RFPBuilder,A=window.RFPAnswers,S=R.state,$r=id=>document.getElementById(id);
const BANNED=/\bbeta\b|early access|coming soon|limited availability|Adobe Consulting Services|[$€£]\s?\d|\bconfirm(?:ed)? (?:\w+ ){0,4}with Adobe\b|\bnot stated by Adobe\b|\b(?:obtain|get|secure|seek)\b[^.?!]{0,80}\bfrom Adobe\b|\bAdobe['\u2019]s written\b|\bin writing from Adobe\b|\bfrom Adobe in writing\b|\b(?:check|verify|validate|confirm)(?:ed|s|ing)?\b[^.?!]{0,60}\b(?:with|by) Adobe\b(?!\s+[A-Z])|\b(?:pending|subject to|awaiting)\b[^.?!]{0,30}\bAdobe['\u2019]?s? (?:confirmation|approval|sign-?off)\b/i;   // step 89: and any sentence that defers a point to Adobe
let NAMES={};
const DOCX='application/vnd.openxmlformats-officedocument.wordprocessingml.document';

// ---- when it is built, a line stays at the foot of the window until it is closed: where the file went and a way to get it again
// (Adam: "it wrote it and then disapeared?", then yes to "Your proposal is ready. It was saved to your Downloads folder as ...")
function outcome(text,file,blob){let el=$r('rfp-progress');
  if(!el){el=document.createElement('div');el.id='rfp-progress';el.className='rfp-progress';el.setAttribute('role','status');document.body.appendChild(el);}
  el.textContent='';el.hidden=false;el.classList.add('done');
  const say=document.createElement('span');say.id='rfp-progress-text';
  if(file){const b=document.createElement('b');b.textContent='Your proposal is ready.';say.append(b,' It was saved to your Downloads folder as '+file+'. It was built from your answers, our service catalog and Adobe\u2019s public documentation: review it, edit it and fill in the highlighted fields before you send it.');}
  else{const b=document.createElement('b');b.textContent='The proposal was not written.';say.append(b,' '+text);}
  el.appendChild(say);
  if(blob){const again=document.createElement('button');again.type='button';again.id='rfp-proposal-again';again.textContent='Download it again';again.addEventListener('click',()=>download(file,blob,DOCX));el.appendChild(again);}
  const close=document.createElement('button');close.type='button';close.id='rfp-progress-close';close.textContent='Close';close.addEventListener('click',()=>{el.hidden=true;});el.appendChild(close);}

// ---- every sentence passes the same checks the catalog's text does
const str=x=>typeof x==='string'?x:x==null?'':String(x);
function scrubText(s,ok){
  let t=str(s).replace(/\s*[–—]\s*/g,', ').replace(/\s+/g,' ').trim();
  // the writer sometimes cites a service's id beside a source number ('[AF01, 14]'): the id goes, the numbers stay as a citation
  t=t.replace(/\[([^\[\]]{1,120})\]/g,(m,inner)=>{const parts=inner.split(',').map(x=>x.trim());if(!parts.some(x=>NAMES[x]))return m;const nums=parts.filter(x=>/^\d{1,3}$/.test(x));return nums.length?'['+nums.join(',')+']':'';});
  t=t.replace(/\[(\d{1,3}(?:\s*,\s*\d{1,3})*)\]/g,(m,ns)=>{const keep=ns.split(',').map(x=>Number(x.trim())).filter(n=>ok.has(n));return keep.length?'['+keep.join(',')+']':'';});   // a source number that is not in the catalog proves nothing
  t=t.replace(/\b([A-Z]{2,3}\d{2})\b/g,(m,id)=>NAMES[id]||m);                                                    // a catalog id means nothing to the client: the service's name stands in
  if(BANNED.test(t))t=t.split(/(?<=[.!?])\s+/).filter(x=>!BANNED.test(x)).join(' ');                                          // a sentence with a word Adam ruled out is left out
  return t.replace(/\s+([.,;:])/g,'$1').replace(/\s{2,}/g,' ').trim();}
// Services and effort is built here, from the catalog: the names, what we will do and the hours are the catalog's own
function servicesSection(plan,pack,records,cite){
  const by={};for(const o of [...pack.products,...pack.connections])for(const l of o.services)by[l.id]=l;
  const ids=[...new Set((Array.isArray(plan.services)?plan.services:[]).map(str))].filter(id=>by[id]);if(!ids.length)return null;
  const lines=records||ids.map(id=>by[id]);
  const rows=lines.map(l=>{
    const source=cite?cite(l.source):l.src;
    return [l.name,A.scopeText(A.doLine(l.id))+(source?' ['+source+']':''),l.unit==='monthly'?l.hours+' a month':String(l.hours),...(records?[l.ref]:[])];
  });
  const once=sumHours(lines,'one-time'),monthly=sumHours(lines,'monthly');
  if(once)rows.push(['Total, one-time services','',once.toLocaleString('en-US')]);if(monthly)rows.push(['Total, monthly services','',monthly.toLocaleString('en-US')+' a month']);
  if(records)for(const row of rows)if(row.length===3)row.push('');
  const blocks=[{type:'p',text:'These are the services this proposal rests on. Each comes from our delivery catalog and is grounded in the Adobe documentation page it cites.'},
    {type:'table',columns:['Service','What we will do','Planning hours',...(records?['Counted in']:[])],widths:records?[24,46,15,15]:[27,58,15],rows},
    {type:'p',text:'Hours are planning estimates at a typical size, not a quote. They carry into the statement of work, where scope and size are confirmed with you. Fees are stated at [HOURLY RATE] in the pricing response.'}];
  const custom=(Array.isArray(plan.custom)?plan.custom:[]).map(c=>[str(c&&c.work),str(c&&c.estimate)]).filter(r=>r[0]);
  // step 81 (Adam: yes to the sentence): the total is not the whole job where the RFI asks for work the catalog does not cover
  if(custom.length)blocks.splice(2,0,{type:'callout',title:'Not the whole job',text:'This total covers the standard services above. The work listed below is not yet estimated and will add to it.'});
  if(custom.length)blocks.push({type:'h2',text:'Work to be estimated in discovery'},{type:'p',text:'The RFI asks for work that no catalog service covers. It is scoped and estimated with you in discovery, and is not in the hours above.'},{type:'table',columns:['Work the RFI asks for','How it will be estimated'],widths:[45,55],rows:custom});
  return {number:'5',title:'Services and effort',blocks};}

// ---- step 92: the proposal from this page's own answers, with no AI
const plural=(n,one,many)=>n+' '+(n===1?one:many);
const listOf=a=>a.length<2?(a[0]||''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];
const capital=t=>/[a-z]/.test(t)?t:t.toLowerCase().replace(/\b([a-z])/g,c=>c.toUpperCase()).replace(/\b(And|Or|Of|For|The|To|In|On|At|By|With|An|A)\b/g,w=>w.toLowerCase()).replace(/^./,c=>c.toUpperCase());
const bare=t=>String(t||'').replace(/^\s*(?:[A-Z]{1,3}[.-]?)?\d+(?:\.\d+)*[.)]?\s+/,'').trim();
// the RFI's own title: its first line that names the request, else the client's name
function titleOf(){const ps=(S.paragraphs||[]).filter(p=>typeof p==='string').slice(0,6).map(p=>p.split(/\s+Issued\b/)[0].trim());
  const t=ps.find(p=>/^(?:RFP|RFI|RFQ|Request for (?:information|proposals?|quotation))\b/i.test(p)&&p.length<=140);
  return t||'';}
// Generated citations and partner fields have their own Word formatting. Preserve
// the partner's actual text, including currency, bracketed numbers and line breaks.
function refsFor(questions){
  const refs=new Map(),used=new Set(questions.map(q=>str(q.label).trim().toUpperCase()).filter(Boolean));
  questions.forEach((q,i)=>{
    let ref=str(q.label).trim();
    if(!ref){
      let n=i+1;
      while(used.has('Q'+n))n++;
      used.add('Q'+n);
      ref='[Q'+n+': replace with the RFI\'s reference]';
    }
    refs.set(q,ref);
  });
  const labels = new Map();
  for(const [q,label] of refs){
    if(!labels.has(label))labels.set(label,[]);
    labels.get(label).push(q);
  }
  questions.forEach((q,index)=>{
    const label=refs.get(q),duplicates=labels.get(label);
    let section=q.section||'';
    if(duplicates.length>1&&duplicates.some(other=>other!==q&&(other.section||'')===section)){
      if(q.file)section=[section,q.file].filter(Boolean).join(', ');
      if(duplicates.some(other=>other!==q&&other.section===q.section&&other.file===q.file))
        section=[section,'Requirement '+(index+1)].filter(Boolean).join(', ');
    }
    refs.set(q,{key:index+1,label,section,countedIn:duplicates.length>1?[section,label].filter(Boolean).join(', '):label});
  });
  return refs;
}
function checkPartnerText(q,text,ref){
  const limit=A.limitOf(q),count=A.wordsIn(text);
  if(limit&&count>limit.max)throw Error(ref+' has '+count+' words. Shorten the answer to '+limit.max+' words before downloading.');
  if(/\bbeta\b|early access|coming soon|limited availability/i.test(text))
    throw Error('Review the release wording in the answer to '+ref+' before downloading.');
}
function sumHours(lines,unit){
  return lines.reduce((total,l)=>total+(l.unit===unit?l.hours:0),0);
}
function serviceRows(pack,effort,refs){
  const supplied=new Map([...pack.products,...pack.connections].flatMap(p=>p.services.map(l=>[l.id,l])));
  const lines=[];
  for(const [id,{q}] of effort.owners){
    const catalog=RFP_CAT.lines[id],packLine=supplied.get(id);
    const unit=catalog?.unit==='monthly'?'monthly':'one-time',hours=Number(catalog?.base);
    if(!packLine||!Number.isFinite(hours)||hours<0||packLine.hours!==hours||packLine.unit!==unit||packLine.name!==catalog.name||!A.kbPermitted(id,q))
      throw Error('The service scope or catalog hours for '+id+' do not agree with the answer to '+refs.get(q).countedIn+'.');
    lines.push({id,name:catalog.name,hours,unit,ref:refs.get(q).countedIn,key:refs.get(q).key,source:catalog.url?{title:catalog.src||catalog.name,url:catalog.url}:null});
  }
  return lines;
}
function checkEffortClaim(text,row,ref){
  const claims=text.split(/(?<=[.!?])\s+|\n+/).filter(s=>A.effortClaim.test(s));
  for(const line of claims){
    const numbers=[...line.matchAll(/\b(\d[\d,]*(?:\.\d+)?)\s+(?:(one[- ]time|monthly|implementation|delivery|planning|project)\s+)?hours?\b(?:\s+(a month|per month|monthly|one[- ]time))?/gi)];
    if(!numbers.length)continue;
    let once=0,monthly=0;
    for(const m of numbers){
      const n=Number(m[1].replace(/,/g,''));
      if(/month/i.test((m[2]||'')+' '+(m[3]||'')+' '+(/\bmonthly (?:planning )?estimate\b/i.test(line)?'monthly':'')))monthly+=n;
      else once+=n;
    }
    if(once!==(row?.once||0)||monthly!==(row?.monthly||0))
      throw Error('The planning hours in the edited answer to '+ref+' disagree with its catalog services. Review the estimate before downloading.');
  }
}
function sourcesForProposal(){
  const list=[],numbers=new Map();
  function cite(source){
    const keep=source&&A.scopeSource(source);
    if(!keep)return null;
    if(!numbers.has(keep.url)){
      numbers.set(keep.url,list.length+1);
      list.push({n:list.length+1,title:keep.title,url:keep.url});
    }
    return numbers.get(keep.url);
  }
  const digits='⁰¹²³⁴⁵⁶⁷⁸⁹';
  function remap(text,sources){
    return text.replace(/\[(\d{1,3}(?:\s*,\s*\d{1,3})*)\]|([⁰¹²³⁴⁵⁶⁷⁸⁹]+(?:,[⁰¹²³⁴⁵⁶⁷⁸⁹]+)*)/g,(match,bracket,sup)=>{
      const local=bracket||[...sup].map(c=>c===','?',':digits.indexOf(c)).join('');
      const mapped=[...new Set(local.split(',').map(n=>cite(sources[Number(n)-1])).filter(Boolean))];
      return mapped.length?'['+mapped.join(',')+']':'';
    });
  }
  return {list,cite,remap};
}
function contentOf(pack){
  NAMES={};for(const o of [...pack.products,...pack.connections])for(const l of o.services)NAMES[l.id]=l.name;
  const first=((S.paragraphs||[]).find(p=>typeof p==='string'&&p.trim())||'').trim(),client=A.clientOrg()||(/^[A-Z][A-Z&.,' ]{3,60}$/.test(first)&&!/\b(?:RFP|RFI|REQUEST)\b/.test(first)?capital(first):'[CLIENT NAME]'),adobe=S.questions.filter(q=>q.kind==='adobe'),firm=S.questions.filter(q=>q.kind!=='adobe');
  const refs=refsFor(S.questions),got=new Map(),asks=[],told=[],citations=sourcesForProposal();
  const effort=A.planningEffort(),services=serviceRows(pack,effort,refs);
  for(const q of S.questions){
    const a=A.proposalAnswer(q,effort);
    if(!a)continue;
    if(a.text!==null){
      checkPartnerText(q,a.text,refs.get(q).countedIn);
      checkEffortClaim(a.text,effort.byQuestion.get(q),refs.get(q).countedIn);
      if(A.scopeConflict(a.text,q))throw Error('Review the client scope in the edited answer to '+refs.get(q).countedIn+' before downloading.');
    }
    got.set(q,a);
    for(const x of a.asks||[])if(!asks.includes(x))asks.push(x);
    for(const [,items] of a.sections)for(const x of items)if(/^You told us:/.test(x)){const f=x.replace(/^You told us:\s*/,'');if(!told.includes(f))told.push(f);}}
  const answeredAdobe=adobe.filter(q=>got.has(q)).length, answeredFirm=got.size-answeredAdobe;
  const five=servicesSection({services:services.map(l=>l.id)},pack,services,citations.cite);
  const once=sumHours(services,'one-time'),monthly=sumHours(services,'monthly');
  const hoursOnce=once?once.toLocaleString('en-US'):'',hoursMonth=monthly?monthly.toLocaleString('en-US'):'';
  const ruledOut=A.kbExclusions(),names=A.rfiProducts().filter(id=>!ruledOut.has(id)).map(id=>(RFP_CAT.products.find(p=>p.id===id)||{}).name).filter(Boolean);
  const launch=A.rfiLaunch(),plan=A.rfiTimeline(),outcomes=[...new Set([...got.values()].map(a=>a.outcome).filter(Boolean))].slice(0,3);
  const sections=[];let n=1;const next=()=>String(n++);
  // fix 3: a fuller executive summary, from the client's own facts
  const summary=adobe.length?client+' is looking for a partner to deliver '+(names.length?listOf(names):'its Adobe program')+(launch?', with a launch on '+launch:plan?', within a '+plan+' plan':'')+'. This proposal answers '+plural(answeredAdobe,'Adobe requirement','Adobe requirements')+(answeredAdobe<adobe.length?' of '+adobe.length:'')+(answeredFirm?' and '+plural(answeredFirm,'supplier question','supplier questions'):'')+'.':
    'This proposal addresses '+plural(firm.length,'supplier question','supplier questions')+' for '+client+'. '+plural(answeredFirm,'answer is','answers are')+' included in About our firm.';
  const sum=[{type:'p',text:summary}];
  if(services.length)sum.push({type:'p',text:'The work rests on '+plural(services.length,'service','services')+' from our catalog'+(hoursOnce?': about '+hoursOnce+' one-time planning hours':'')+(hoursMonth?(hoursOnce?' and ':': ')+hoursMonth+' hours a month after launch':'')+'. Section '+'[SERVICES]'+' sets them out.'});
  if(outcomes.length)sum.push({type:'p',text:'What the work leaves you with:'},{type:'bullets',items:outcomes});
  sum.push({type:'callout',title:'For the partner',text:'[ADD YOUR WIN THEMES: why your firm, your relevant references, and how this program meets the client\'s goals.]'});
  sections.push({number:next(),title:'Executive summary',blocks:sum});
  if(told.length)sections.push({number:next(),title:'What you told us',blocks:[{type:'p',text:'We built this proposal around the facts in your RFI:'},{type:'bullets',items:told}]});
  // fix 1: one section for each of the RFI's own sections; fix 2: the client's facts are not repeated inside each answer
  const groups=[];for(const q of adobe){if(!got.has(q))continue;const key=refs.get(q).section;let g=groups.find(x=>x.key===key);if(!g){g={key,qs:[]};groups.push(g);}g.qs.push(q);}
  const where=new Map();
  for(const g of groups){const number=next(),blocks=[];
    for(const q of g.qs){
      const a=got.get(q);
      where.set(q,number);
      blocks.push({type:'h2',text:refs.get(q).label+'  '+A.scopeText(q.text,q),answerKey:refs.get(q).key});
      if(a.text!==null){
        blocks.push({type:'p',text:a.text,literal:true});
        const row=effort.byQuestion.get(q);
        if(row&&(row.once||row.monthly)){
          const title='Catalog effort for this requirement',estimate=A.effortLine(row),limit=A.limitOf(q);
          if(!limit||A.wordsIn([a.text,title,estimate].join(' '))<=limit.max)
            blocks.push({type:'table',columns:[title],widths:[100],rows:[[estimate]]});
        }
        continue;
      }
      for(const [hd,items] of a.sections){
        const keep=items.filter(x=>!/^You told us:/.test(x)).map(x=>citations.remap(A.scopeText(x,q),a.sources)).filter(Boolean);
        if(keep.length)blocks.push({type:'p',text:hd+':'},{type:'bullets',items:keep});
      }
    }
    sections.push({number,title:g.key?capital(bare(bare(g.key).replace(/^Section\s+/i,'')).replace(/^[A-Z][.)]\s+/,'')):'Our response',blocks});}
  if(five){five.number=next();sections.push(five);sections[0].blocks.forEach(b=>{if(b.text)b.text=b.text.replace('[SERVICES]',five.number);});}
  else sections[0].blocks.forEach(b=>{if(b.text)b.text=b.text.replace(/ Section \[SERVICES\] sets them out\./,'');});
  if(asks.length)sections.push({number:next(),title:'What we need from you',blocks:[{type:'p',text:'To keep to the plan, we will need these from your team:'},{type:'bullets',items:asks.slice(0,15)}]});
  if(firm.length){
    const number=next();
    const rows=firm.map(q=>{
      const answer=got.get(q);
      if(answer)where.set(q,number);
      return [refs.get(q).label,A.scopeText(q.text,q),answer?answer.text:'[YOUR ANSWER]'];
    });
    sections.push({number,title:'About our firm',blocks:[{type:'table',columns:['Ref','Requirement','Our answer'],widths:[15,40,45],rows,literalColumn:2}]});
  }
  sections.push({number:next(),title:'Requirements matrix',blocks:[{type:'table',columns:['Ref','RFI section','Requirement','Answered in','One-time hours','Monthly hours'],widths:[11,17,40,12,10,10],
    rows:S.questions.map(q=>{
      const row=effort.byQuestion.get(q);
      return [refs.get(q).label,refs.get(q).section,A.scopeText(q.text,q),where.has(q)?'Section '+where.get(q):'To write',row?String(row.once):'',row?String(row.monthly):''];
    })}]});
  const ok=new Set(citations.list.map(s=>s.n)),clean=x=>scrubText(A.scopeText(x),ok);
  for(const section of sections){
    section.title=clean(section.title)||'Response';
    for(const b of section.blocks){
      if(b.text&&!b.literal)b.text=clean(b.text);
      if(b.items)b.items=b.items.map(clean).filter(Boolean);
      if(b.rows)b.rows=b.rows.map(r=>r.map((x,i)=>i===b.literalColumn||/^\[[A-Z]/.test(x)?x:clean(x)));
    }
  }
  // Prune references whose only sentence was removed by the final copy checks.
  const sources=[],cited=new Map();
  function finalCitation(t){
    return t.replace(/\[(\d+(?:,\s*\d+)*)\]/g,(_,group)=>{
      const numbers=[];
      for(const n of group.split(',').map(Number)){
        const source=citations.list[n-1];
        if(!source)continue;
        if(!cited.has(n)){cited.set(n,sources.length+1);sources.push({...source,n:sources.length+1});}
        numbers.push(cited.get(n));
      }
      return numbers.length?'['+numbers.join(',')+']':'';
    });
  }
  for(const section of sections)for(const b of section.blocks){
    if(b.items)b.items=b.items.map(finalCitation);
    if(b.type==='table'&&b.columns[0]==='Service')for(const row of b.rows)row[1]=finalCitation(row[1]);
  }
  const today=new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}),title=titleOf();
  // fix 4: the RFI's real title, never its file name
  return {meta:{title:'Proposal: '+(clean(title)||clean(client)||'[CLIENT NAME]'),client:clean(client)||'[CLIENT NAME]',client_unit:'',solicitation:clean(title),project:'',prepared_by:'[PARTNER LEGAL NAME]',date:today},
    notices:['Draft, built from this RFI, our service catalog and Adobe\'s public documentation, for you to review, edit and complete before it is sent. Connect the dots for your client in your own words. Every [BRACKETED FIELD] is information only you can supply. '+A.reviewNotice.join(' ')],
    glance:{stats:[{value:String(got.size),label:answeredFirm?'requirements answered':'Adobe requirements answered'},{value:String(services.length),label:'catalog services'},...(hoursOnce?[{value:hoursOnce,label:'one-time planning hours'}]:[]),...(hoursMonth?[{value:hoursMonth,label:'planning hours a month'}]:[])].slice(0,4),outcomes:[]},
    sections,sources,ledger:services.map(({id,name,hours,unit,ref,key})=>({id,name,hours,unit,ref,key}))};}

// Refuse a Word file if an output field disagrees with the catalog service charged
// to its requirement. This also checks content supplied directly to the Word builder.
function validateEffort(C){
  const lines=C.ledger,refs=new Map(),ids=new Set(),bad=()=>{throw Error('The proposal service counts or planning hours do not agree. Review the requirements before downloading.');};
  for(const l of lines){
    const cat=RFP_CAT.lines[l.id];
    if(ids.has(l.id)||!cat||cat.base!==l.hours||cat.name!==l.name||l.unit!==(cat.unit==='monthly'?'monthly':'one-time'))bad();
    ids.add(l.id);
    if(!refs.has(l.key))refs.set(l.key,{once:0,monthly:0});
    refs.get(l.key)[l.unit==='monthly'?'monthly':'once']+=l.hours;
  }
  const stats=C.glance.stats,stat=label=>Number(String(stats.find(s=>s.label===label)?.value||0).replace(/,/g,''));
  const once=sumHours(lines,'one-time'),monthly=sumHours(lines,'monthly');
  if(stat('catalog services')!==lines.length||stat('one-time planning hours')!==once||stat('planning hours a month')!==monthly)bad();
  const table=title=>C.sections.find(s=>s.title===title)?.blocks.find(b=>b.type==='table');
  const service=table('Services and effort');
  if(lines.length){
    if(!service||service.rows.length!==lines.length+Number(once>0)+Number(monthly>0))bad();
    for(const [i,l] of lines.entries()){
      const row=service.rows[i];
      if(row[0]!==l.name||row[2]!==String(l.hours)+(l.unit==='monthly'?' a month':'')||row[3]!==l.ref)bad();
    }
    if(once&&(service.rows[lines.length][0]!=='Total, one-time services'||service.rows[lines.length][2]!==once.toLocaleString('en-US')))bad();
    if(monthly&&(service.rows.at(-1)[0]!=='Total, monthly services'||service.rows.at(-1)[2]!==monthly.toLocaleString('en-US')+' a month'))bad();
    const summary=C.sections[0].blocks.find(b=>b.text?.startsWith('The work rests on '))?.text||'';
    if(!summary.startsWith('The work rests on '+plural(lines.length,'service','services')+' from our catalog')
      ||once&&!summary.includes(once.toLocaleString('en-US')+' one-time planning hours')
      ||monthly&&!summary.includes(monthly.toLocaleString('en-US')+' hours a month'))bad();
  }else if(service)bad();
  const matrix=table('Requirements matrix');
  const checked=new Set();
  for(const [index,row] of matrix.rows.entries()){
    const ref=index+1,sum=refs.get(ref);
    if((sum&&row[3]==='To write')||Number(row[4])!==(sum?.once||0)||Number(row[5])!==(sum?.monthly||0))bad();
    if(sum)checked.add(ref);
  }
  if(checked.size!==refs.size)bad();
  const printed=new Set();
  for(const section of C.sections){
    let ref=null;
    for(const b of section.blocks){
      if(b.type==='h2'){ref=b.answerKey;continue;}
      if(!ref)continue;
      const row=refs.get(ref);
      if(b.literal){checkEffortClaim(b.text,row,ref);if(row)printed.add(ref);continue;}
      if(b.type==='table'&&b.columns[0]==='Catalog effort for this requirement'){
        if(!row||b.rows[0]?.[0]!==A.effortLine(row))bad();
        printed.add(ref);
      }
      for(const line of b.items||[]){
        if(!/^Planning estimate:/.test(line))continue;
        if(!row||printed.has(ref)||line!==A.effortLine(row))bad();
        printed.add(ref);
      }
    }
  }
  if([...refs.keys()].some(ref=>!printed.has(ref)))bad();
}
// ---- the Word file (the layout of sow/proposal_sample/build_docx.js)
const loadDocx=()=>new Promise((ok,fail)=>{if(window.docx)return ok(window.docx);const sc=document.createElement('script');sc.src='lib/docx.iife.js';sc.onload=()=>ok(window.docx);sc.onerror=()=>fail(Error('The Word builder did not load.'));document.head.appendChild(sc);});
async function build(C){
  validateEffort(C);
  const D=await loadDocx(),{Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,ShadingType,BorderStyle,AlignmentType,HeadingLevel,LevelFormat,Footer,Header,PageNumber,PageBreak,ExternalHyperlink,VerticalAlign,TableLayoutType}=D;
  const RED='EB1000',INK='1C1C1C',RULE='C9C9C9',PALE='F4F4F4',FIELD='FFF1A8',FONT='Arial',W=12240-2*1080;
  function runs(text,o={}){const out=[],s=str(text);let last=0;
    for(const m of s.matchAll(/\[(\d{1,3}(?:,\s*\d{1,3})*)\]|\[([A-Z][A-Z0-9 ,.'\/&()-]{2,})\]/g)){
      if(m.index>last)out.push(new TextRun(Object.assign({text:m[1]?s.slice(last,m.index).replace(/\s+$/,''):s.slice(last,m.index),font:FONT},o)));
      if(m[1])out.push(new TextRun(Object.assign({},o,{text:m[1].replace(/\s+/g,''),font:FONT,superScript:true,color:RED,bold:true})));
      else out.push(new TextRun(Object.assign({},o,{text:'['+m[2]+']',font:FONT,bold:true,shading:{type:ShadingType.CLEAR,fill:FIELD,color:'auto'}})));
      last=m.index+m[0].length;}
    if(last<s.length)out.push(new TextRun(Object.assign({text:s.slice(last),font:FONT},o)));
    return out;}
  function literalRuns(text,style){
    return str(text).split(/\r\n|\r|\n/).map((line,i)=>new TextRun({...style,font:FONT,text:line,...(i?{break:1}:{})}));
  }
  const P=(text,o={},ro={})=>new Paragraph(Object.assign({children:runs(text,Object.assign({size:21,color:INK},ro)),spacing:{before:0,after:140,line:300}},o));
  const none={style:BorderStyle.NONE,size:0,color:'FFFFFF'},thin={style:BorderStyle.SINGLE,size:4,color:RULE},gap=a=>new Paragraph({children:[],spacing:{before:0,after:a}});
  const cell=(children,w,o={})=>new TableCell(Object.assign({children,width:{size:w,type:WidthType.DXA},margins:{top:90,bottom:90,left:130,right:130},verticalAlign:VerticalAlign.TOP},o));
  function table(b){const n=b.columns.length;
    const pct=b.widths||Array(n).fill(100/n),tot=pct.reduce((a,x)=>a+x,0),w=pct.map(x=>Math.round(W*x/tot));w[n-1]+=W-w.reduce((a,x)=>a+x,0);
    const head=new TableRow({tableHeader:true,cantSplit:true,children:b.columns.map((c,i)=>cell([new Paragraph({children:[new TextRun({text:str(c),font:FONT,bold:true,size:18,color:'FFFFFF'})],spacing:{before:0,after:0}})],w[i],{shading:{type:ShadingType.CLEAR,fill:INK,color:'auto'},borders:{top:none,bottom:none,left:none,right:none}}))});
    const rows=b.rows.map(r=>{const total=/^total\b/i.test(str(r[0]));
      return new TableRow({cantSplit:true,children:b.columns.map((_,i)=>cell([new Paragraph({children:(i===b.literalColumn&&r[i]!=='[YOUR ANSWER]'?literalRuns:runs)(r[i],{size:19,color:INK,bold:total||(i===0&&n>2)}),spacing:{before:0,after:0,line:270}})],w[i],{shading:total?{type:ShadingType.CLEAR,fill:PALE,color:'auto'}:undefined,borders:{top:none,left:none,right:none,bottom:thin}}))});});
    return [new Table({width:{size:W,type:WidthType.DXA},columnWidths:w,layout:TableLayoutType.FIXED,rows:[head,...rows]}),gap(160)];}
  function callout(b){const edge={style:BorderStyle.SINGLE,size:6,color:INK};
    return [new Table({width:{size:W,type:WidthType.DXA},columnWidths:[W],layout:TableLayoutType.FIXED,rows:[new TableRow({cantSplit:true,children:[cell([
      new Paragraph({children:[new TextRun({text:str(b.title).toUpperCase(),font:FONT,bold:true,size:17,color:RED,characterSpacing:30})],spacing:{before:0,after:60}}),
      new Paragraph({children:runs(b.text,{size:20,color:INK}),spacing:{before:0,after:0,line:290}})],W,
      {margins:{top:160,bottom:160,left:220,right:220},borders:{top:edge,bottom:edge,right:edge,left:{style:BorderStyle.SINGLE,size:36,color:RED}}})]})]}),gap(160)];}
  function block(b){
    if(b.type==='p')return [b.literal?new Paragraph({children:literalRuns(b.text,{size:21,color:INK}),spacing:{after:140,line:300}}):P(b.text)];
    if(b.type==='h2')return [new Paragraph({heading:HeadingLevel.HEADING_2,children:[new TextRun({text:b.text,font:FONT,bold:true,size:25,color:INK})]})];
    if(b.type==='bullets')return b.items.map(t=>new Paragraph({numbering:{reference:'dots',level:0},children:runs(t,{size:21,color:INK}),spacing:{before:0,after:90,line:300}}));
    if(b.type==='table')return table(b);
    return callout(b);}
  const m=C.meta,body=[],label=(t,after)=>new Paragraph({children:[new TextRun({text:t,font:FONT,bold:true,size:18,color:RED,characterSpacing:40})],spacing:{before:0,after}});
  body.push(new Paragraph({children:[new TextRun({text:'PROPOSAL',font:FONT,bold:true,size:20,color:'FFFFFF',characterSpacing:60})],shading:{type:ShadingType.CLEAR,fill:RED,color:'auto'},spacing:{before:0,after:0},indent:{left:160},border:{top:{style:BorderStyle.SINGLE,size:48,color:RED,space:6},bottom:{style:BorderStyle.SINGLE,size:48,color:RED,space:6}}}));
  body.push(gap(0),new Paragraph({children:[],spacing:{before:1500,after:0}}));
  body.push(new Paragraph({children:[new TextRun({text:m.title,font:FONT,bold:true,size:64,color:INK})],spacing:{before:0,after:240,line:260}}));
  body.push(new Paragraph({children:runs(m.client,{size:30,color:INK}),spacing:{before:0,after:60}}));
  if(m.client_unit)body.push(new Paragraph({children:runs(m.client_unit,{size:24,color:INK}),spacing:{before:0,after:0}}));
  body.push(gap(600));
  const metaRow=(k,v)=>new TableRow({children:[cell([new Paragraph({children:[new TextRun({text:k.toUpperCase(),font:FONT,bold:true,size:16,color:RED,characterSpacing:30})],spacing:{before:0,after:0}})],2600,{borders:{top:thin,bottom:none,left:none,right:none}}),
    cell([new Paragraph({children:runs(v,{size:21,color:INK}),spacing:{before:0,after:0}})],W-2600,{borders:{top:thin,bottom:none,left:none,right:none}})]});
  body.push(new Table({width:{size:W,type:WidthType.DXA},columnWidths:[2600,W-2600],layout:TableLayoutType.FIXED,rows:[['Solicitation',m.solicitation],['Project',m.project],['Prepared by',m.prepared_by],['Date',m.date]].filter(x=>x[1]).map(x=>metaRow(x[0],x[1]))}));
  body.push(gap(500));
  for(const n of C.notices)body.push(...callout({title:'Read first',text:n}));
  body.push(new Paragraph({children:[new PageBreak()]}));
  body.push(label('AT A GLANCE',80),new Paragraph({children:[new TextRun({text:'What this proposal delivers',font:FONT,bold:true,size:40,color:INK})],spacing:{before:0,after:260}}));
  if(C.glance.stats.length){const s=C.glance.stats,w=Math.floor(W/s.length),ws=s.map((_,i)=>i===s.length-1?W-w*(s.length-1):w);
    body.push(new Table({width:{size:W,type:WidthType.DXA},columnWidths:ws,layout:TableLayoutType.FIXED,rows:[new TableRow({children:s.map((x,i)=>cell([
      new Paragraph({children:[new TextRun({text:str(x.value),font:FONT,bold:true,size:str(x.value).length>7?44:60,color:RED})],spacing:{before:0,after:40}}),
      new Paragraph({children:[new TextRun({text:str(x.label),font:FONT,size:19,color:INK})],spacing:{before:0,after:0,line:270}})],ws[i],
      {margins:{top:180,bottom:180,left:180,right:140},borders:{top:{style:BorderStyle.SINGLE,size:18,color:INK},bottom:thin,left:none,right:none}}))})]}),gap(260));}
  for(const o of C.glance.outcomes)body.push(new Paragraph({numbering:{reference:'dots',level:0},children:runs(o,{size:23,color:INK}),spacing:{before:0,after:130,line:320}}));
  body.push(new Paragraph({children:[new TextRun({text:'CONTENTS',font:FONT,bold:true,size:18,color:RED,characterSpacing:40})],spacing:{before:420,after:120}}));
  for(const s of C.sections)body.push(new Paragraph({children:[new TextRun({text:s.number+'   ',font:FONT,bold:true,size:21,color:RED}),new TextRun({text:s.title,font:FONT,size:21,color:INK})],spacing:{before:0,after:70},border:{bottom:{style:BorderStyle.SINGLE,size:4,color:RULE,space:3}}}));
  for(const s of C.sections){
    body.push(new Paragraph({heading:HeadingLevel.HEADING_1,pageBreakBefore:true,children:[new TextRun({text:s.number+'  ',font:FONT,bold:true,size:36,color:RED}),new TextRun({text:s.title,font:FONT,bold:true,size:36,color:INK})]}));
    for(const b of s.blocks)body.push(...block(b));}
  if(C.sources.length){
    body.push(new Paragraph({heading:HeadingLevel.HEADING_1,pageBreakBefore:true,children:[new TextRun({text:'Adobe sources',font:FONT,bold:true,size:36,color:INK})]}));
    body.push(P('These Adobe-published sources inform this draft. The small red numbers in the text point here. Review each cited source to confirm that it supports the associated claim and applies to the proposed solution.'));
    for(const x of C.sources)body.push(new Paragraph({children:[new TextRun({text:x.n+'   ',font:FONT,bold:true,size:19,color:RED}),new ExternalHyperlink({link:x.url,children:[new TextRun({text:x.title,font:FONT,size:19,color:INK,underline:{}})]})],spacing:{before:0,after:80},indent:{left:420,hanging:420}}));}
  const doc=new Document({creator:'RFI Builder',title:m.title,
    styles:{default:{document:{run:{font:FONT,size:21}},
      heading1:{run:{font:FONT,size:36,bold:true,color:INK},paragraph:{spacing:{before:0,after:220},keepNext:true}},
      heading2:{run:{font:FONT,size:25,bold:true,color:INK},paragraph:{spacing:{before:260,after:110},keepNext:true}}}},
    numbering:{config:[{reference:'dots',levels:[{level:0,format:LevelFormat.BULLET,text:'•',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:360,hanging:240}},run:{color:RED,font:FONT}}}]}]},
    sections:[{properties:{page:{size:{width:12240,height:15840},margin:{top:1080,bottom:1080,left:1080,right:1080}},titlePage:true},
      headers:{default:new Header({children:[new Paragraph({children:[new TextRun({text:m.title,font:FONT,size:16,color:INK})],alignment:AlignmentType.RIGHT,border:{bottom:{style:BorderStyle.SINGLE,size:4,color:RULE,space:4}}})]}),first:new Header({children:[new Paragraph({children:[]})]})},
      footers:{default:new Footer({children:[new Paragraph({children:[new TextRun({text:[m.client,m.solicitation,'Draft for review','Page '].filter(Boolean).join('   |   '),font:FONT,size:16,color:INK}),new TextRun({children:[PageNumber.CURRENT],font:FONT,size:16,color:INK})]})]}),first:new Footer({children:[new Paragraph({children:[]})]})},
      children:body}]});
  return Packer.toBlob(doc);}

let last=null;
async function run(){
  if(!S.questions.length){toast('Load an RFI first.');return;}
  last=null;
  try{const content=contentOf(A.proposalPack());const blob=await build(content);last=content;
    const file=A.baseName()+'-proposal.docx';download(file,blob,DOCX);outcome('',file,blob);}
  catch(e){outcome((e&&e.message)||'The proposal could not be built. Try again.');}
}
window.RFPProposal={run,contentOf,build,scrubText,servicesSection,last:()=>last};
})();
