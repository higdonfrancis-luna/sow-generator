/* RFP Builder: the screen. The drop zone, the paste box, the question list and its filters, the status line. Step 49,
   part one; split out of patch_step49.py on Nov 10 2026. Uses RFPFinder and RFPReaders; RFPAnswers hooks in through
   onLoad and onRender. Steps 50 to 52 (Nov 10 2026): every dropped file is read, rows carry the client's ID and a
   Mandatory or Desirable badge, requirements say so, the filters count, a To sort row says Sort first, and a Not picked
   up list holds every paragraph the finder set aside, each with Make this a question. Steps 55 and 56 (Nov 10 2026): a To
   review filter, Start over with a confirmation, rows that open from the keyboard, the work kept in this tab's session storage
   (snapshot, restore, merge for a Save my work file). Exposes window.RFPBuilder. */
(function(){
const $r=id=>document.getElementById(id);
const rfp={name:'',questions:[],skipped:[],paragraphs:[],sheets:[],workbooks:[],notes:[],noun:'',filter:'all',includeDrafts:false,selected:null};
const {findQuestions,classify,paragraphs,KIND}=window.RFPFinder;const {readFile}=window.RFPReaders;
const LINK={adobe:'See answer',firm:'Write answer',unsure:'Sort first'};
const FILTER={all:'All',adobe:KIND.adobe,firm:KIND.firm,unsure:KIND.unsure,review:'To review',notpicked:'Not picked up'};
const toReview=q=>(q.kind==='adobe'||q.kind==='firm')&&!q.status;   // still needs a decision: approve or leave out
const hasWork=()=>rfp.questions.some(q=>q.status||q.answer||(q.facts&&Object.values(q.facts).some(Boolean))||(q.ticks&&Object.values(q.ticks).some(v=>v===false))||(q.lines&&Object.values(q.lines).some(v=>v===false)));
function status(msg){$r('rfp-status').textContent=msg;}
const count=k=>rfp.questions.filter(q=>q.kind===k).length;
function statusLine(){
  const qs=rfp.questions,n=qs.length;if(!n)return '';
  const req=rfp.noun==='requirements'||qs.every(q=>q.requirement);
  const noun=req?(n===1?'requirement':'requirements'):(n===1?'question':'questions');
  const sheets=rfp.sheets.length>1?' on '+rfp.sheets.length+' sheets ('+rfp.sheets.join(', ')+')':'';
  const piles=[count('adobe')?count('adobe')+' about Adobe products':'',count('firm')?count('firm')+' about your firm':'',count('unsure')?count('unsure')+' to sort':''].filter(Boolean).join(', ');
  const m=qs.filter(q=>q.priority==='mandatory').length,d=qs.filter(q=>q.priority==='desirable').length;
  const md=m||d?' '+[m?m+' mandatory':'',d?d+' desirable':''].filter(Boolean).join(', ')+'.':'';
  const s=rfp.skipped.length,sk=s?' '+s+' '+(s===1?'paragraph was':'paragraphs were')+' not picked up: see Not picked up.':' Nothing was skipped.';
  return rfp.name+': '+n+' '+noun+' found'+sheets+'. '+piles+'.'+md+sk+(rfp.notes.length?' '+rfp.notes.join(' '):'');
}
function renderList(){
  const list=$r('rfp-questions');list.innerHTML='';
  if(rfp.filter==='notpicked'){
    for(const [k,s] of rfp.skipped.entries()){
      const li=document.createElement('li');li.className='rfp-skip';
      li.innerHTML='<span class="rfp-tag">Not picked up</span><span class="rfp-q">'+esc(s.text.length>600?s.text.slice(0,600)+'\u2026':s.text)+'<span class="rfp-why">'+esc(s.reason)+'</span></span><button type="button" class="rfp-make" data-k="'+k+'">Make this a question</button>';
      list.appendChild(li);
    }
    if(!rfp.skipped.length)list.innerHTML='<li class="rfp-skip rfp-none">Nothing was skipped: every paragraph was read as a question, a requirement, a heading or a title.</li>';
  }
  else {if(rfp.filter!=='all'&&!rfp.questions.some(q=>rfp.filter==='review'?toReview(q):q.kind===rfp.filter))list.innerHTML='<li class="rfp-skip rfp-none">'+(rfp.filter==='review'?'Nothing to review: every question has a decision.':'No question in this pile.')+'</li>';
  for(const [i,q] of rfp.questions.entries()){
    const li=document.createElement('li');li.dataset.kind=q.kind;li.dataset.i=i;li.tabIndex=0;li.setAttribute('role','button');li.hidden=rfp.filter==='all'?false:rfp.filter==='review'?!toReview(q):q.kind!==rfp.filter;
    if(rfp.selected===i)li.classList.add('sel');
    li.innerHTML='<span class="rfp-tag">'+KIND[q.kind]+'</span><span class="rfp-q">'+(q.label?'<b>'+esc(q.label)+'</b>':'')+
      (q.priority?'<span class="rfp-pri '+q.priority+'">'+(q.priority==='mandatory'?'Mandatory':'Desirable')+'</span>':'')+esc(q.text)+
      (q.requirement&&q.kind!=='firm'?'<span class="rfp-req">Requirement, not a question: the answer starts "We would meet this by".</span>':'')+
      (q.status?'<br><span class="rfp-state'+(q.status==='used'?' ok':'')+'">'+(q.status==='used'?'Approved':'Left out')+'</span>':'')+'</span>'+
      '<select class="rfp-kind" aria-label="Which pile this question belongs to">'+Object.entries(KIND).map(([k,v])=>'<option value="'+k+'"'+(k===q.kind?' selected':'')+'>'+v+'</option>').join('')+'</select>'+
      '<span class="rfp-open">'+(rfp.selected===i?'Open':LINK[q.kind]+' &rsaquo;')+'</span>';
    list.appendChild(li);
  }}
  status(statusLine());
  $r('rfp-results').hidden=!rfp.questions.length&&!rfp.skipped.length;
  const counts={all:rfp.questions.length,adobe:count('adobe'),firm:count('firm'),unsure:count('unsure'),review:rfp.questions.filter(toReview).length,notpicked:rfp.skipped.length};
  for(const b of document.querySelectorAll('[data-rfp-filter]')){const f=b.dataset.rfpFilter;b.setAttribute('aria-pressed',f===rfp.filter?'true':'false');b.textContent=FILTER[f]+' ('+counts[f]+')';}
  if(window.RFPBuilder&&window.RFPBuilder.onRender)window.RFPBuilder.onRender();
  persist();
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
// every dropped or chosen file is read in turn, under its own name (step 51)
async function take(files){
  files=[...(files||[])].filter(Boolean);if(!files.length)return;
  const big=files.find(f=>f.size>25000000);
  if(big){status(big.name+' is over 25 MB. Export the RFI without images, or paste its text.');return;}
  const names=files.map(f=>f.name).join(', ');
  status('Reading '+names+' in your browser...');
  const parts=[],notes=[],workbooks=[],read=[],nouns=[];let noText=[];
  for(const f of files){
    try{
      const r=await readFile(f),ps=typeof r==='string'?[{text:r}]:(r.parts||[]);
      for(const p of ps){p.file=f.name;if(p.rows)for(const row of p.rows)row.file=f.name;parts.push(p);}
      nouns.push((r&&r.noun)||'');if(r&&r.workbook)workbooks.push(r.workbook);if(r&&r.noText)noText.push(f.name);
      read.push(f.name);
    }catch(e){notes.push('Could not read '+f.name+'. '+(e&&e.message?e.message:'Try saving it as PDF or .docx, or paste the text.'));}
  }
  if(!read.length){status(notes.join(' '));return;}
  if(noText.length)notes.push(noText.join(', ')+(noText.length===1?' has':' have')+' no text layer (it looks like a scan), so nothing in it could be read. Run it through text recognition, or paste the text.');
  if(read.length>1)notes.unshift('Read '+read.length+' files.');
  load(read.length>1?read[0]+' and '+(read.length-1)+' more':read[0],{parts,noun:nouns.every(n=>n==='requirements')?'requirements':'',workbooks,notes});
}
function load(name,payload){
  // payload: the RFP's text, or {parts:[{text}|{rows}], noun, workbooks, notes} from the readers. A pasted table
  // (tab-separated, or comma-separated with a header row) goes through the same row reader when it is recognised.
  // Step 56: on top of work, the same RFP dropped again (the way the client's workbook comes back after a reload) keeps every
  // decision; a different one asks before it replaces what is on screen.
  if(hasWork()&&!load.confirmed){const keep=snapshot();const probe=parse(payload);
    if(probe&&sameKeys(probe.questions)){load.confirmed=true;try{load(name,payload);}finally{load.confirmed=false;}merge(keep);status(statusLine()+' Your decisions were kept.');return;}
    askReplace('The RFI on screen has decisions on it. Loading '+name+' clears them; Save my work first if you want to keep them.',()=>{load.confirmed=true;try{load(name,payload);}finally{load.confirmed=false;}});return;}
  let p=payload;
  if(typeof p==='string'){const t=window.RFPReaders.rowsFromDelimitedText?window.RFPReaders.rowsFromDelimitedText(p):null;p=t||{parts:[{text:p}]};}
  else if(p&&!p.parts)p=Object.assign({},p,{parts:[...(p.rows?[{rows:p.rows}]:[]),...(p.text?[{text:p.text}]:[])]});
  const r=window.RFPFinder.read((p&&p.parts)||[]);
  Object.assign(rfp,{name,questions:r.questions,skipped:r.skipped,paragraphs:r.paragraphs,sheets:r.sheets,noun:(p&&p.noun)||'',workbooks:(p&&p.workbooks)||[],notes:(p&&p.notes)||[],filter:'all',selected:null,includeDrafts:false});
  if(window.RFPBuilder&&window.RFPBuilder.onLoad)window.RFPBuilder.onLoad();
  if(!rfp.questions.length){
    if(rfp.skipped.length){rfp.filter='notpicked';renderList();}else $r('rfp-results').hidden=true;
    status(name+': no questions found. RFI questions usually end with a question mark or start with words like describe, provide or explain, and requirements are numbered.'+(rfp.skipped.length?' '+rfp.skipped.length+' '+(rfp.skipped.length===1?'paragraph was':'paragraphs were')+' not picked up: make one a question if it is one.':' Try pasting the questions section.')+(rfp.notes.length?' '+rfp.notes.join(' '):''));
    return;
  }
  renderList();
}
function parse(payload){let p=payload;if(typeof p==='string'){const t=window.RFPReaders.rowsFromDelimitedText?window.RFPReaders.rowsFromDelimitedText(p):null;p=t||{parts:[{text:p}]};}else if(p&&!p.parts)p=Object.assign({},p,{parts:[...(p.rows?[{rows:p.rows}]:[]),...(p.text?[{text:p.text}]:[])]});try{return window.RFPFinder.read((p&&p.parts)||[]);}catch(e){return null;}}
const sameKeys=qs=>{const b=new Set((qs||[]).map(qKey));return rfp.questions.length>0&&rfp.questions.filter(q=>b.has(qKey(q))).length>=Math.ceil(rfp.questions.length/2);};
// one confirmation for every replace (another RFP dropped, Open my work, Open draft): the question, then Cancel or Replace it
let replaceGo=null;
function askReplace(text,go){replaceGo=go;$r('rfp-replace-text').textContent=text;$r('rfp-replace-modal').hidden=false;$r('rfp-replace-go').focus();}
const closeReplace=()=>{$r('rfp-replace-modal').hidden=true;replaceGo=null;};
$r('rfp-replace-cancel').addEventListener('click',closeReplace);
$r('rfp-replace-go').addEventListener('click',()=>{const go=replaceGo;closeReplace();if(go)go();});
$r('rfp-replace-modal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeReplace();});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;for(const id of ['rfp-start-over-modal','rfp-replace-modal','rfp-handoff-modal']){const m=$r(id);if(m&&!m.hidden)m.hidden=true;}if(replaceGo)replaceGo=null;});
const drop=$r('rfp-drop');
$r('rfp-choose').addEventListener('click',()=>$r('rfp-file').click());
$r('rfp-file').addEventListener('change',e=>{const fs=[...e.target.files];e.target.value='';take(fs);});
for(const ev of ['dragenter','dragover'])drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('over');});
for(const ev of ['dragleave','drop'])drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('over');});
drop.addEventListener('drop',e=>{take(e.dataTransfer&&e.dataTransfer.files);});
$r('rfp-paste-btn').addEventListener('click',()=>{$r('rfp-paste').hidden=false;$r('rfp-text').focus();});
$r('rfp-open-work-empty').addEventListener('click',()=>$r('rfp-work-file').click());
$r('rfp-paste-cancel').addEventListener('click',()=>{$r('rfp-paste').hidden=true;});
$r('rfp-paste-go').addEventListener('click',()=>{const t=$r('rfp-text').value;if(!t.trim()){status('Paste the RFI text first.');return;}$r('rfp-paste').hidden=true;load('Pasted text',t);});
$r('rfp-results').addEventListener('click',e=>{const b=e.target.closest('[data-rfp-filter]');if(b){rfp.filter=b.dataset.rfpFilter;renderList();}});
$r('rfp-clear').addEventListener('click',()=>{$r('rfp-start-over-modal').hidden=false;$r('rfp-clear-confirm').focus();});
const closeStartOver=()=>{$r('rfp-start-over-modal').hidden=true;};
$r('rfp-clear-cancel').addEventListener('click',closeStartOver);
$r('rfp-start-over-modal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeStartOver();});
$r('rfp-clear-confirm').addEventListener('click',()=>{closeStartOver();clearAll();});
// Start over: the RFP, its questions and every answer, tick and note go, from the screen and from this tab's storage
function clearAll(){Object.assign(rfp,{name:'',questions:[],skipped:[],paragraphs:[],sheets:[],workbooks:[],notes:[],noun:'',filter:'all',includeDrafts:false,selected:null});$r('rfp-text').value='';try{sessionStorage.removeItem(SKEY);}catch(e){}if(window.RFPBuilder&&window.RFPBuilder.onLoad)window.RFPBuilder.onLoad();renderList();status('');}
// rows open from the keyboard too (Enter or Space on the row itself; the pile menu keeps its own keys)
$r('rfp-questions').addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const li=e.target.closest('li');if(!li||e.target!==li||li.dataset.i===undefined)return;e.preventDefault();const i=li.dataset.i;li.click();const again=document.querySelector('#rfp-questions li[data-i="'+i+'"]');if(again)again.focus();});
// the tool's own Start over says it clears every step: the RFP goes with it
document.addEventListener('click',e=>{if(e.target.closest('#start-over-confirm'))clearAll();},true);
$r('rfp-questions').addEventListener('change',e=>{const s=e.target.closest('.rfp-kind');if(!s)return;const li=s.closest('li');const q=rfp.questions[Number(li.dataset.i)];q.kind=s.value;delete q.draft;delete q.status;delete q.answer;delete q.facts;delete q.ticks;delete q.pick;delete q.lines;renderList();if(window.RFPBuilder&&window.RFPBuilder.onPileChange)window.RFPBuilder.onPileChange(Number(li.dataset.i));});
// Not picked up: the partner makes a paragraph a question; it joins the list where it stood in the RFP
$r('rfp-questions').addEventListener('click',e=>{
  const b=e.target.closest('.rfp-make');if(!b)return;e.stopPropagation();
  const k=Number(b.dataset.k),s=rfp.skipped[k];if(!s)return;
  const q=Object.assign(window.RFPFinder.asQuestion(s.text,s.section),{order:s.order,made:true});
  const sel=Number.isInteger(rfp.selected)?rfp.questions[rfp.selected]:null;
  rfp.skipped.splice(k,1);
  const at=rfp.questions.findIndex(x=>(x.order||0)>s.order);
  if(at<0)rfp.questions.push(q);else rfp.questions.splice(at,0,q);
  if(sel)rfp.selected=rfp.questions.indexOf(sel);
  if(!rfp.skipped.length)rfp.filter='all';
  renderList();
});
// Step 56: the work stays in this tab. Session storage survives a reload or a trip to another step and clears when the tab
// closes; a snapshot is also what Save draft carries and what Save my work writes to a file. The client's workbook is not
// kept (it is the dropped file itself), so Write answers into it waits for the file to be dropped again.
const SKEY='abv-rfp-work-v1';
const strip=q=>{const o={};for(const k of Object.keys(q))if(k!=='draft')o[k]=q[k];return o;};
// a row from a file: only the fields the page writes, in the shapes it writes them
const sound=q=>{const o=strip(q);if(o.priority!=='mandatory'&&o.priority!=='desirable')delete o.priority;if(typeof o.label!=='string')delete o.label;if(o.status!=='used'&&o.status!=='skipped')delete o.status;if(typeof o.answer!=='string'||!o.answer)delete o.answer;for(const k of ['facts','ticks','lines'])if(!o[k]||typeof o[k]!=='object'||Array.isArray(o[k]))delete o[k];if(Array.isArray(o.pick))o.pick=o.pick.filter(x=>typeof x==='string');else delete o.pick;return o;};
function snapshot(){return {v:1,name:rfp.name,questions:rfp.questions.map(strip),skipped:rfp.skipped,paragraphs:rfp.paragraphs,sheets:rfp.sheets,notes:rfp.notes,noun:rfp.noun,filter:rfp.filter,selected:rfp.selected,includeDrafts:!!rfp.includeDrafts};}
let tooBig=false;
function persist(){try{if(!rfp.questions.length&&!rfp.skipped.length){sessionStorage.removeItem(SKEY);return;}sessionStorage.setItem(SKEY,JSON.stringify(snapshot()));}catch(e){if(!tooBig){tooBig=true;status(statusLine()+' This RFI is too large for the tab to keep across a reload: use Save my work.');}}}
function restore(snap){
  if(!snap||snap.v!==1||!Array.isArray(snap.questions)||typeof snap.name!=='string')return false;
  const qs=snap.questions.filter(q=>q&&typeof q==='object'&&typeof q.text==='string'&&q.text.trim()&&KIND[q.kind]).map(sound);
  if(!qs.length)return false;
  Object.assign(rfp,{name:snap.name,questions:qs,skipped:Array.isArray(snap.skipped)?snap.skipped.filter(x=>x&&typeof x.text==='string'):[],paragraphs:Array.isArray(snap.paragraphs)?snap.paragraphs:[],sheets:Array.isArray(snap.sheets)?snap.sheets:[],workbooks:[],notes:Array.isArray(snap.notes)?snap.notes:[],noun:snap.noun==='requirements'?'requirements':'',filter:FILTER[snap.filter]?snap.filter:'all',includeDrafts:snap.includeDrafts===true,selected:Number.isInteger(snap.selected)&&snap.selected>=0&&snap.selected<qs.length?snap.selected:null});
  renderList();if(window.RFPBuilder&&window.RFPBuilder.onRestore)window.RFPBuilder.onRestore();status(statusLine());return true;}
function restoreSession(){try{const s=sessionStorage.getItem(SKEY);return !!s&&restore(JSON.parse(s));}catch(e){return false;}}
// two people splitting an RFP: a Save my work file of the same RFP adds its decisions, answers, ticks and notes to the rows that have none here
const qKey=q=>(q.label||'')+'|'+q.text;
const sameRfp=snap=>{const b=new Set((snap.questions||[]).filter(q=>q&&typeof q.text==='string').map(qKey));return rfp.questions.length>0&&rfp.questions.filter(q=>b.has(qKey(q))).length>=Math.ceil(rfp.questions.length/2);};
function merge(snap){const out={decisions:0,notes:0,added:0};const mine=new Map(rfp.questions.map(q=>[qKey(q),q]));
  for(const raw of snap.questions){if(!raw||typeof raw!=='object'||typeof raw.text!=='string'||!KIND[raw.kind])continue;const q=sound(raw),t=mine.get(qKey(q));
    if(!t){if(q.made&&(q.status||q.answer)){const at=rfp.questions.findIndex(x=>(x.order||0)>(q.order||0));if(at<0)rfp.questions.push(q);else rfp.questions.splice(at,0,q);rfp.skipped=rfp.skipped.filter(s=>s.text!==q.text);out.added++;}continue;}   // a question the other side made from Not picked up, and answered
    if(t.status||t.answer)continue;                                                                                     // a row with a decision here is never changed
    if(q.status||q.answer){if(q.status)t.status=q.status;if(q.answer)t.answer=q.answer;if(q.pick)t.pick=q.pick;delete t.draft;out.decisions++;}   // the pile chosen here stays
    for(const k of ['facts','ticks','lines'])if(q[k]){const before=JSON.stringify(t[k]||{});t[k]=Object.assign({},q[k],t[k]||{});if(JSON.stringify(t[k])!==before)out.notes++;}}
  renderList();if(window.RFPBuilder&&window.RFPBuilder.onRestore)window.RFPBuilder.onRestore();return out;}
/* step 57 (Nov 10 2026, Adam: "why wouldn't you just have RFP builder?", "it's RFI"): from the first page's front door
   (sow/index.html#rfi) the RFI Builder opens on its own: no steps, no play, no SOW draft buttons. A reload on #rfp keeps it;
   any other arrival shows the full tool; Add to my statement of work (rfp_answers.js) turns it off and opens Services. */
const RFI_ONLY='abv-rfi-only';
function rfiOnly(on){document.body.classList.toggle('rfi-only',on);try{if(on)sessionStorage.setItem(RFI_ONLY,'1');else sessionStorage.removeItem(RFI_ONLY);}catch(e){}}
{const h=location.hash.slice(1);let keep=false;try{keep=h==='rfp'&&sessionStorage.getItem(RFI_ONLY)==='1';}catch(e){}
  if(h==='rfi'){rfiOnly(true);go('rfp');}else rfiOnly(keep);}
$r('rfi-back').addEventListener('click',()=>{rfiOnly(false);location.href='../index.html';});
window.RFPBuilder={findQuestions,classify,paragraphs,state:rfp,load,renderList,persist,snapshot,restore,restoreSession,merge,sameRfp,clearAll,hasWork,askReplace,rfiOnly};
})();
