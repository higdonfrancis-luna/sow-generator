/* RFI Builder step 75 (Nov 11 2026): Download proposal, a full proposal as a Word file. Step 92 (Nov 13 2026, Adam: "we've
   gotta get rid of the AI", "Yes, please" to the no-AI sample and its four fixes): the proposal is built on this page with no AI,
   in an instant, from the answers the page already drafts for each question (the knowledge base's method answers, an answer
   written by the RFI Agent where the partner ran it, else the catalog's), the client's own facts, the catalog's services and
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
function servicesSection(plan,pack){
  const by={};for(const o of [...pack.products,...pack.connections])for(const l of o.services)by[l.id]=l;
  const ids=[...new Set((Array.isArray(plan.services)?plan.services:[]).map(str))].filter(id=>by[id]);if(!ids.length)return null;
  const rows=ids.map(id=>{const l=by[id];return [l.name,A.doLine(id)+(l.src?' ['+l.src+']':''),l.unit==='monthly'?l.hours+' a month':String(l.hours)];});
  const once=ids.filter(id=>by[id].unit!=='monthly').reduce((n,id)=>n+by[id].hours,0),monthly=ids.filter(id=>by[id].unit==='monthly').reduce((n,id)=>n+by[id].hours,0);
  if(once)rows.push(['Total, one-time services','',once.toLocaleString('en-US')]);if(monthly)rows.push(['Total, monthly services','',monthly.toLocaleString('en-US')+' a month']);
  const blocks=[{type:'p',text:'These are the services this proposal rests on. Each comes from our delivery catalog and is grounded in the Adobe documentation page it cites.'},
    {type:'table',columns:['Service','What we will do','Planning hours'],widths:[27,58,15],rows},
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
// one question's answer, as the page drafts it: the RFI Agent's where the partner ran it, else the knowledge base's, else the catalog's
function answerOf(q){const d=A.compose(q);if(!d)return null;
  if(d.ai)return {sections:A.written(d,q).sections,services:d.m?d.m.lines:[],sources:d.sources||[]};
  const five=A.method(q,d);
  if(five)return {sections:A.written(Object.assign({},d,{ai:five}),q).sections,services:five.services,sources:five.sources||[],asks:five.asks||[],outcome:five.services.length&&typeof RFP_METHOD!=='undefined'&&RFP_METHOD.services[five.services[0]]?RFP_METHOD.services[five.services[0]].outcome:''};
  const w=A.written(d,q);return w.sections.length?{sections:w.sections,services:d.m?d.m.lines:[],sources:d.sources||[]}:null;}
function contentOf(pack){
  NAMES={};for(const o of [...pack.products,...pack.connections])for(const l of o.services)NAMES[l.id]=l.name;
  const first=((S.paragraphs||[]).find(p=>typeof p==='string'&&p.trim())||'').trim(),client=A.clientOrg()||(/^[A-Z][A-Z&.,' ]{3,60}$/.test(first)&&!/\b(?:RFP|RFI|REQUEST)\b/.test(first)?capital(first):'[CLIENT NAME]'),adobe=S.questions.filter(q=>q.kind==='adobe'&&q.label),firm=S.questions.filter(q=>q.kind!=='adobe'&&q.label);
  const got=new Map(),services=new Set(),asks=[],srcs=[],seen=new Set(),told=[];
  for(const q of adobe){const a=answerOf(q);if(!a)continue;got.set(q,a);a.services.forEach(s=>services.add(s));
    for(const x of a.asks||[])if(!asks.includes(x))asks.push(x);
    for(const s of a.sources)if(s&&s.url&&!seen.has(s.url)){seen.add(s.url);srcs.push({title:s.title,url:s.url});}
    for(const [,items] of a.sections)for(const x of items)if(/^You told us:/.test(x)){const f=x.replace(/^You told us:\s*/,'');if(!told.includes(f))told.push(f);}}
  const ok=new Set(srcs.map((_,i)=>i+1)),clean=x=>scrubText(x,ok),cleanAll=a=>a.map(clean).filter(Boolean);
  const five=servicesSection({services:[...services]},pack),totals=five?five.blocks.find(b=>b.type==='table').rows.filter(r=>/^Total\b/.test(r[0])):[];
  const hoursOnce=(totals.find(r=>/one-time/.test(r[0]))||[])[2]||'',hoursMonth=((totals.find(r=>/monthly/.test(r[0]))||[])[2]||'').replace(' a month','');
  const ruledOut=A.kbExclusions(),names=A.rfiProducts().filter(id=>!ruledOut.has(id)).map(id=>(RFP_CAT.products.find(p=>p.id===id)||{}).name).filter(Boolean),excluded=[...ruledOut].map(id=>(RFP_CAT.products.find(p=>p.id===id)||{}).name).filter(Boolean);
  const launch=A.rfiLaunch(),plan=A.rfiTimeline(),outcomes=[...new Set([...got.values()].map(a=>a.outcome).filter(Boolean))].slice(0,3);
  const sections=[];let n=1;const next=()=>String(n++);
  // fix 3: a fuller executive summary, from the client's own facts
  const sum=[{type:'p',text:client+' is looking for a partner to deliver '+(names.length?listOf(names):'its Adobe program')+(launch?', with a launch on '+launch:plan?', within a '+plan+' plan':'')+'. This proposal answers '+plural(got.size,'Adobe requirement','Adobe requirements')+(got.size<adobe.length?' of '+adobe.length:'')+' with the method we follow, what you receive, the effort and the risk we manage, drawn from our delivery catalog and Adobe\'s public documentation.'}];
  if(services.size)sum.push({type:'p',text:'The work rests on '+plural(services.size,'service','services')+' from our catalog'+(hoursOnce?': about '+hoursOnce+' one-time planning hours':'')+(hoursMonth?(hoursOnce?' and ':': ')+hoursMonth+' hours a month after launch':'')+'. Section '+'[SERVICES]'+' sets them out.'});
  if(outcomes.length)sum.push({type:'p',text:'What the work leaves you with:'},{type:'bullets',items:outcomes});
  if(excluded.length)sum.push({type:'p',text:'As you asked, nothing in this proposal relies on '+listOf(excluded).replace(/ and ([^,]*)$/,' or $1')+'.'});
  sum.push({type:'callout',title:'For the partner',text:'[ADD YOUR WIN THEMES: why your firm, your relevant references, and how this program meets the client\'s goals.]'});
  sections.push({number:next(),title:'Executive summary',blocks:sum});
  if(told.length)sections.push({number:next(),title:'What you told us',blocks:[{type:'p',text:'We built this proposal around the facts in your RFI:'},{type:'bullets',items:told}]});
  // fix 1: one section for each of the RFI's own sections; fix 2: the client's facts are not repeated inside each answer
  const groups=[];for(const q of adobe){if(!got.has(q))continue;const key=q.section||'';let g=groups.find(x=>x.key===key);if(!g){g={key,qs:[]};groups.push(g);}g.qs.push(q);}
  const where=new Map();
  for(const g of groups){const number=next(),blocks=[];
    for(const q of g.qs){where.set(q,number);blocks.push({type:'h2',text:q.label+'  '+bare(q.text).slice(0,260)});
      for(const [hd,items] of got.get(q).sections){const keep=items.filter(x=>!/^You told us:/.test(x));if(keep.length)blocks.push({type:'p',text:hd+':'},{type:'bullets',items:keep});}}
    sections.push({number,title:g.key?capital(bare(bare(g.key).replace(/^Section\s+/i,'')).replace(/^[A-Z][.)]\s+/,'')):'Our response',blocks});}
  if(five){five.number=next();sections.push(five);sections[0].blocks.forEach(b=>{if(b.text)b.text=b.text.replace('[SERVICES]',five.number);});}
  else sections[0].blocks.forEach(b=>{if(b.text)b.text=b.text.replace(/ Section \[SERVICES\] sets them out\./,'');});
  if(asks.length)sections.push({number:next(),title:'What we need from you',blocks:[{type:'p',text:'To keep to the plan, we will need these from your team:'},{type:'bullets',items:asks.slice(0,15)}]});
  let firmAt='';
  if(firm.length){firmAt=next();sections.push({number:firmAt,title:'About our firm',blocks:[{type:'p',text:'[ANSWER EACH OF THESE IN YOUR OWN WORDS: they are about your firm.]'},{type:'table',columns:['Ref','Requirement','Our answer'],widths:[10,50,40],rows:firm.map(q=>[q.label,bare(q.text).slice(0,300),'[YOUR ANSWER]'])}]});}
  sections.push({number:next(),title:'Requirements matrix',blocks:[{type:'table',columns:['Ref','Requirement','Answered in'],widths:[10,65,25],rows:S.questions.filter(q=>q.label).map(q=>[q.label,bare(q.text).slice(0,200),q.kind==='adobe'?(where.has(q)?'Section '+where.get(q):'[TO WRITE]'):firmAt?'Section '+firmAt:'[TO WRITE]'])}]});
  for(const s of sections)for(const b of s.blocks){if(b.text)b.text=clean(b.text);if(b.items)b.items=cleanAll(b.items);if(b.rows)b.rows=b.rows.map(r=>r.map(x=>/^\[[A-Z]/.test(x)?x:clean(x)));}
  const today=new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}),title=titleOf();
  // fix 4: the RFI's real title, never its file name
  return {meta:{title:'Proposal: '+(title||client),client,client_unit:'',solicitation:title,project:'',prepared_by:'[PARTNER LEGAL NAME]',date:today},
    notices:['Draft, built from this RFI, our service catalog and Adobe\'s public documentation, for you to review, edit and complete before it is sent. Connect the dots for your client in your own words. Every [BRACKETED FIELD] is information only you can supply. '+A.reviewNotice.join(' ')],
    glance:{stats:[{value:String(got.size),label:'Adobe requirements answered'},{value:String(services.size),label:'catalog services'},...(hoursOnce?[{value:hoursOnce,label:'one-time planning hours'}]:[]),...(hoursMonth?[{value:hoursMonth,label:'planning hours a month'}]:[])].slice(0,4),outcomes:[]},
    sections,sources:srcs.map((s,i)=>({n:i+1,title:s.title,url:s.url}))};}

// ---- the Word file (the layout of sow/proposal_sample/build_docx.js)
const loadDocx=()=>new Promise((ok,fail)=>{if(window.docx)return ok(window.docx);const sc=document.createElement('script');sc.src='lib/docx.iife.js';sc.onload=()=>ok(window.docx);sc.onerror=()=>fail(Error('The Word builder did not load.'));document.head.appendChild(sc);});
async function build(C){
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
  const P=(text,o={},ro={})=>new Paragraph(Object.assign({children:runs(text,Object.assign({size:21,color:INK},ro)),spacing:{before:0,after:140,line:300}},o));
  const none={style:BorderStyle.NONE,size:0,color:'FFFFFF'},thin={style:BorderStyle.SINGLE,size:4,color:RULE},gap=a=>new Paragraph({children:[],spacing:{before:0,after:a}});
  const cell=(children,w,o={})=>new TableCell(Object.assign({children,width:{size:w,type:WidthType.DXA},margins:{top:90,bottom:90,left:130,right:130},verticalAlign:VerticalAlign.TOP},o));
  function table(b){const n=b.columns.length;
    const pct=b.widths||Array(n).fill(100/n),tot=pct.reduce((a,x)=>a+x,0),w=pct.map(x=>Math.round(W*x/tot));w[n-1]+=W-w.reduce((a,x)=>a+x,0);
    const head=new TableRow({tableHeader:true,cantSplit:true,children:b.columns.map((c,i)=>cell([new Paragraph({children:[new TextRun({text:str(c),font:FONT,bold:true,size:18,color:'FFFFFF'})],spacing:{before:0,after:0}})],w[i],{shading:{type:ShadingType.CLEAR,fill:INK,color:'auto'},borders:{top:none,bottom:none,left:none,right:none}}))});
    const rows=b.rows.map(r=>{const total=/^total\b/i.test(str(r[0]));
      return new TableRow({cantSplit:true,children:b.columns.map((_,i)=>cell([new Paragraph({children:runs(r[i],{size:19,color:INK,bold:total||(i===0&&n>2)}),spacing:{before:0,after:0,line:270}})],w[i],{shading:total?{type:ShadingType.CLEAR,fill:PALE,color:'auto'}:undefined,borders:{top:none,left:none,right:none,bottom:thin}}))});});
    return [new Table({width:{size:W,type:WidthType.DXA},columnWidths:w,layout:TableLayoutType.FIXED,rows:[head,...rows]}),gap(160)];}
  function callout(b){const edge={style:BorderStyle.SINGLE,size:6,color:INK};
    return [new Table({width:{size:W,type:WidthType.DXA},columnWidths:[W],layout:TableLayoutType.FIXED,rows:[new TableRow({cantSplit:true,children:[cell([
      new Paragraph({children:[new TextRun({text:str(b.title).toUpperCase(),font:FONT,bold:true,size:17,color:RED,characterSpacing:30})],spacing:{before:0,after:60}}),
      new Paragraph({children:runs(b.text,{size:20,color:INK}),spacing:{before:0,after:0,line:290}})],W,
      {margins:{top:160,bottom:160,left:220,right:220},borders:{top:edge,bottom:edge,right:edge,left:{style:BorderStyle.SINGLE,size:36,color:RED}}})]})]}),gap(160)];}
  function block(b){
    if(b.type==='p')return [P(b.text)];
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
  const pack=A.proposalPack();
  if(!pack.products.length){toast('This RFI names no Adobe product in the catalog, so there is nothing to build a proposal on.');return;}
  try{const content=contentOf(pack);last=content;const blob=await build(content);
    const file=A.baseName()+'-proposal.docx';download(file,blob,DOCX);outcome('',file,blob);}
  catch(e){outcome((e&&e.message)||'The proposal could not be built. Try again.');}
}
window.RFPProposal={run,contentOf,build,scrubText,servicesSection,last:()=>last};
})();
