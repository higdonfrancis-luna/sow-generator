/* RFI Builder step 75 (Nov 11 2026): Download proposal. Adam set the RFI Builder's download beside a draft from Adobe's own
   tool for the same RFP ("ours answers questions but it doesn't look like an RFP response"), saw the sample in
   sow/proposal_sample/ ("it looks really good way better than what we had before"; "I am 100% OK if it is 100% generated
   by AI") and said yes to building it.

   The proposal is written by an AI model (the route /rfi/propose on the reader's worker; WRITER_URL below is its one
   address) from three things this page sends: the RFI's text, the list of what it asks for, and the catalog's services,
   hours and checked Adobe facts for the products the RFI is about. A plan comes back first (the client, the services,
   the custom work), then five parts are written at once. This page then: drops any source number that is not in the
   catalog, drops a sentence that carries a word Adam ruled out, builds the Services and effort table itself from the
   catalog (so every hour is the catalog's), numbers the sources in order of use, and lays it all out as a Word file.
   Exposes window.RFPProposal. */
(function(){
const R=window.RFPBuilder,A=window.RFPAnswers,S=R.state,$r=id=>document.getElementById(id);
const WRITER_URL='https://warroom-assistant.adam-d1a.workers.dev/rfi/propose';
const PARTS=['front','solution','delivery','matrix','close'];
const RFP_FULL=60000,RFP_HEAD=8000,REQ_MAX=260;
const BANNED=/\bbeta\b|early access|coming soon|limited availability|Adobe Consulting Services|[$€£]\s?\d/i;
let busy=false,from=0,tick=null,done=0,NAMES={};

// ---- what the writer is given
function requirements(){return S.questions.slice(0,REQ_MAX).map(q=>({ref:q.label||'',text:q.text.slice(0,700),kind:q.kind==='firm'?'firm':'adobe'}));}
function rfpText(n){return (S.paragraphs||[]).filter(p=>typeof p==='string').join('\n').slice(0,n);}

// ---- progress: one line, fixed at the foot of the window, while the proposal is written
const clock=()=>{const s=Math.max(0,Math.round((Date.now()-from)/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
function progress(on){let el=$r('rfp-progress');
  if(!on){if(el)el.hidden=true;clearInterval(tick);return;}
  if(!el){el=document.createElement('div');el.id='rfp-progress';el.className='rfp-progress';el.setAttribute('role','status');document.body.appendChild(el);}
  const say=()=>{el.textContent='Writing your proposal with AI… '+clock()+'. Part '+Math.min(done+1,PARTS.length+1)+' of '+(PARTS.length+1)+'. Keep this tab open.';};
  el.hidden=false;say();clearInterval(tick);tick=setInterval(say,1000);}

async function call(part,body){
  for(let attempt=0;attempt<3;attempt++){let data=null;
    try{const r=await fetch(WRITER_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.assign({part},body))});data=await r.json();
      if(r.ok&&data&&data.data&&typeof data.data==='object'){done++;return data.data;}}
    catch(e){data=null;}
    if(attempt===2)throw Error((data&&typeof data.error==='string'&&data.error)||'The AI writer could not be reached.');}
}

// ---- what comes back is checked before it is used
const str=x=>typeof x==='string'?x:x==null?'':String(x);
function scrubText(s,ok){
  let t=str(s).replace(/\s*[–—]\s*/g,', ').replace(/\s+/g,' ').trim();
  t=t.replace(/\[(\d{1,3}(?:\s*,\s*\d{1,3})*)\]/g,(m,ns)=>{const keep=ns.split(',').map(x=>Number(x.trim())).filter(n=>ok.has(n));return keep.length?'['+keep.join(',')+']':'';});   // a source number that is not in the catalog proves nothing
  t=t.replace(/\[?\b([A-Z]{2,3}\d{2})\b\]?/g,(m,id)=>NAMES[id]?(m[0]==='['?'('+NAMES[id]+')':NAMES[id]):m);                                                    // a catalog id means nothing to the client: the service's name stands in
  if(BANNED.test(t))t=t.split(/(?<=[.!?])\s+/).filter(x=>!BANNED.test(x)).join(' ');                                          // a sentence with a word Adam ruled out is left out
  return t.replace(/\s+([.,;:])/g,'$1').replace(/\s{2,}/g,' ').trim();}
function cleanBlock(b,ok){
  if(!b||typeof b!=='object')return null;
  if(b.type==='p'||b.type==='h2'){const text=scrubText(b.text,ok);return text?{type:b.type,text}:null;}
  if(b.type==='bullets'){const items=(Array.isArray(b.items)?b.items:[]).map(x=>scrubText(x,ok)).filter(Boolean);return items.length?{type:'bullets',items}:null;}
  if(b.type==='callout'){const text=scrubText(b.text,ok);return text?{type:'callout',title:scrubText(b.title,ok)||'Note',text}:null;}
  if(b.type==='table'){const columns=(Array.isArray(b.columns)?b.columns:[]).map(x=>scrubText(x,ok)).slice(0,5);if(columns.length<2)return null;
    const rows=(Array.isArray(b.rows)?b.rows:[]).filter(Array.isArray).map(r=>columns.map((_,i)=>scrubText(r[i],ok))).filter(r=>r.some(Boolean));if(!rows.length)return null;
    const w=Array.isArray(b.widths)&&b.widths.length===columns.length&&b.widths.every(x=>Number(x)>0)?b.widths.map(Number):null;
    return {type:'table',columns,rows,widths:w};}
  return null;}
function cleanSection(s,ok){if(!s||typeof s!=='object')return null;const blocks=(Array.isArray(s.blocks)?s.blocks:[]).map(b=>cleanBlock(b,ok)).filter(Boolean);
  const title=scrubText(s.title,ok);return title&&blocks.length?{number:String(s.number||''),title,blocks}:null;}

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
  if(custom.length)blocks.push({type:'h2',text:'Work to be estimated in discovery'},{type:'p',text:'The RFI asks for work that no catalog service covers. It is scoped and estimated with you in discovery, and is not in the hours above.'},{type:'table',columns:['Work the RFI asks for','How it will be estimated'],widths:[45,55],rows:custom});
  return {number:'5',title:'Services and effort',blocks};}

function assemble(plan,parts,pack){
  const ok=new Set(pack.sources.map(s=>s.n)),sections=[];
  NAMES={};for(const o of [...pack.products,...pack.connections])for(const l of o.services)NAMES[l.id]=l.name;
  for(const p of parts)for(const s of (p&&Array.isArray(p.sections)?p.sections:[])){const c=cleanSection(s,ok);if(c&&c.number!=='5')sections.push(c);}
  const five=servicesSection(plan,pack);if(five){const c=cleanSection(five,ok);if(c)sections.push(c);}
  sections.sort((a,b)=>(parseInt(a.number,10)||99)-(parseInt(b.number,10)||99));
  if(sections.length<4)throw Error('The AI writer returned too little to make a proposal.');
  const today=new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  const content={meta:{title:scrubText(plan.title,ok)||'Proposal',client:scrubText(plan.client,ok)||A.clientOrg()||'[CLIENT NAME]',client_unit:scrubText(plan.client_unit,ok),solicitation:scrubText(plan.solicitation,ok)||S.name,project:scrubText(plan.project,ok),prepared_by:'[PARTNER LEGAL NAME]',date:today},
    notices:['Draft, written by AI from this RFI and our service catalog, for you to review, correct and complete before it is sent. Every [BRACKETED FIELD] is information only you can supply.',...(Array.isArray(plan.notices)?plan.notices:[]).map(x=>scrubText(x,ok)).filter(Boolean).slice(0,2)],
    glance:{stats:(Array.isArray(plan.stats)?plan.stats:[]).map(x=>({value:scrubText(x&&x.value,ok),label:scrubText(x&&x.label,ok)})).filter(x=>x.value&&x.label).slice(0,4),outcomes:(Array.isArray(plan.outcomes)?plan.outcomes:[]).map(x=>scrubText(x,ok)).filter(Boolean).slice(0,3)},
    sections,sources:[]};
  // the sources are numbered in the order the proposal uses them
  const renum=new Map(),re=/\[(\d{1,3}(?:,\d{1,3})*)\]/g,fix=t=>str(t).replace(re,(m,ns)=>'['+ns.split(',').map(Number).map(n=>{if(!renum.has(n))renum.set(n,renum.size+1);return renum.get(n);}).join(',')+']');
  content.glance.outcomes=content.glance.outcomes.map(fix);
  for(const s of sections)for(const b of s.blocks){if(b.text)b.text=fix(b.text);if(b.items)b.items=b.items.map(fix);if(b.rows)b.rows=b.rows.map(r=>r.map(fix));}
  const src=Object.fromEntries(pack.sources.map(s=>[s.n,s]));
  content.sources=[...renum].map(([old,n])=>({n,title:src[old].title,url:src[old].url}));
  return content;}

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
  body.push(new Paragraph({children:[new TextRun({text:m.title,font:FONT,bold:true,size:64,color:INK})],spacing:{before:0,after:240,line:700}}));
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
    body.push(P('Every statement about an Adobe product in this proposal rests on one of these public Adobe pages. The small red numbers in the text point here.'));
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

async function run(){
  if(busy)return;
  if(!S.questions.length){toast('Load an RFI first.');return;}
  const pack=A.proposalPack();
  if(!pack.products.length){toast('This RFI names no Adobe product in the catalog, so there is nothing to build a proposal on.');return;}
  busy=true;from=Date.now();done=0;progress(true);
  try{
    const base={name:S.name,requirements:requirements(),pack};
    const plan=await call('plan',Object.assign({rfp:rfpText(RFP_FULL)},base));
    const parts=await Promise.all(PARTS.map(p=>call(p,Object.assign({rfp:rfpText(p==='front'?RFP_FULL:RFP_HEAD),plan},base))));
    const content=assemble(plan,parts,pack);last=content;
    const blob=await build(content);
    download(A.baseName()+'-proposal.docx',blob,'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    toast('Your proposal is downloaded. It was written by AI: review it, fill in the highlighted fields and check it against the RFI before you send it.');
  }catch(e){toast((e&&e.message)||'The proposal could not be written.');}
  finally{busy=false;progress(false);}
}
let last=null;
window.RFPProposal={run,assemble,build,scrubText,servicesSection,isBusy:()=>busy,last:()=>last,WRITER_URL};
})();
