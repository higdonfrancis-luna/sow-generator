/* RFP Builder: the screen. The drop zone, the paste box, the question list and its filters, the status line. Step 49,
   part one; split out of patch_step49.py on Nov 10 2026. Uses RFPFinder and RFPReaders; RFPAnswers hooks in through
   onLoad and onRender. Steps 50 to 52 (Nov 10 2026): every dropped file is read, rows carry the client's ID and a
   Mandatory or Desirable badge, requirements say so, the filters count, a To sort row says Sort first, and a Not picked
   up list holds every paragraph the finder set aside, each with Make this a question. Exposes window.RFPBuilder. */
(function(){
const $r=id=>document.getElementById(id);
const rfp={name:'',questions:[],skipped:[],paragraphs:[],sheets:[],workbooks:[],notes:[],noun:'',filter:'all'};
const {findQuestions,classify,paragraphs,KIND}=window.RFPFinder;const {readFile}=window.RFPReaders;
const LINK={adobe:'See answer',firm:'Write answer',unsure:'Sort first'};
const FILTER={all:'All',adobe:KIND.adobe,firm:KIND.firm,unsure:KIND.unsure,notpicked:'Not picked up'};
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
  else for(const [i,q] of rfp.questions.entries()){
    const li=document.createElement('li');li.dataset.kind=q.kind;li.dataset.i=i;li.hidden=rfp.filter!=='all'&&q.kind!==rfp.filter;
    if(rfp.selected===i)li.classList.add('sel');
    li.innerHTML='<span class="rfp-tag">'+KIND[q.kind]+'</span><span class="rfp-q">'+(q.label?'<b>'+esc(q.label)+'</b>':'')+
      (q.priority?'<span class="rfp-pri '+q.priority+'">'+(q.priority==='mandatory'?'Mandatory':'Desirable')+'</span>':'')+esc(q.text)+
      (q.requirement&&q.kind!=='firm'?'<span class="rfp-req">Requirement, not a question: the answer starts "We would meet this by".</span>':'')+
      (q.status?'<br><span class="rfp-state'+(q.status==='used'?' ok':'')+'">'+(q.status==='used'?'Used':'Skipped')+'</span>':'')+'</span>'+
      '<select class="rfp-kind" aria-label="Which pile this question belongs to">'+Object.entries(KIND).map(([k,v])=>'<option value="'+k+'"'+(k===q.kind?' selected':'')+'>'+v+'</option>').join('')+'</select>'+
      '<span class="rfp-open">'+(rfp.selected===i?'Open':LINK[q.kind]+' &rsaquo;')+'</span>';
    list.appendChild(li);
  }
  status(statusLine());
  $r('rfp-results').hidden=!rfp.questions.length&&!rfp.skipped.length;
  const counts={all:rfp.questions.length,adobe:count('adobe'),firm:count('firm'),unsure:count('unsure'),notpicked:rfp.skipped.length};
  for(const b of document.querySelectorAll('[data-rfp-filter]')){const f=b.dataset.rfpFilter;b.setAttribute('aria-pressed',f===rfp.filter?'true':'false');b.textContent=FILTER[f]+' ('+counts[f]+')';}
  if(window.RFPBuilder&&window.RFPBuilder.onRender)window.RFPBuilder.onRender();
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
// every dropped or chosen file is read in turn, under its own name (step 51)
async function take(files){
  files=[...(files||[])].filter(Boolean);if(!files.length)return;
  const big=files.find(f=>f.size>25000000);
  if(big){status(big.name+' is over 25 MB. Export the RFP without images, or paste its text.');return;}
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
  let p=payload;
  if(typeof p==='string'){const t=window.RFPReaders.rowsFromDelimitedText?window.RFPReaders.rowsFromDelimitedText(p):null;p=t||{parts:[{text:p}]};}
  else if(p&&!p.parts)p=Object.assign({},p,{parts:[...(p.rows?[{rows:p.rows}]:[]),...(p.text?[{text:p.text}]:[])]});
  const r=window.RFPFinder.read((p&&p.parts)||[]);
  Object.assign(rfp,{name,questions:r.questions,skipped:r.skipped,paragraphs:r.paragraphs,sheets:r.sheets,noun:(p&&p.noun)||'',workbooks:(p&&p.workbooks)||[],notes:(p&&p.notes)||[],filter:'all',selected:null});
  if(window.RFPBuilder&&window.RFPBuilder.onLoad)window.RFPBuilder.onLoad();
  if(!rfp.questions.length){
    if(rfp.skipped.length){rfp.filter='notpicked';renderList();}else $r('rfp-results').hidden=true;
    status(name+': no questions found. RFP questions usually end with a question mark or start with words like describe, provide or explain, and requirements are numbered.'+(rfp.skipped.length?' '+rfp.skipped.length+' '+(rfp.skipped.length===1?'paragraph was':'paragraphs were')+' not picked up: make one a question if it is one.':' Try pasting the questions section.')+(rfp.notes.length?' '+rfp.notes.join(' '):''));
    return;
  }
  renderList();
}
const drop=$r('rfp-drop');
$r('rfp-choose').addEventListener('click',()=>$r('rfp-file').click());
$r('rfp-file').addEventListener('change',e=>{const fs=[...e.target.files];e.target.value='';take(fs);});
for(const ev of ['dragenter','dragover'])drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('over');});
for(const ev of ['dragleave','drop'])drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('over');});
drop.addEventListener('drop',e=>{take(e.dataTransfer&&e.dataTransfer.files);});
$r('rfp-paste-btn').addEventListener('click',()=>{$r('rfp-paste').hidden=false;$r('rfp-text').focus();});
$r('rfp-paste-cancel').addEventListener('click',()=>{$r('rfp-paste').hidden=true;});
$r('rfp-paste-go').addEventListener('click',()=>{const t=$r('rfp-text').value;if(!t.trim()){status('Paste the RFP text first.');return;}$r('rfp-paste').hidden=true;load('Pasted text',t);});
$r('rfp-results').addEventListener('click',e=>{const b=e.target.closest('[data-rfp-filter]');if(b){rfp.filter=b.dataset.rfpFilter;renderList();}});
$r('rfp-clear').addEventListener('click',()=>{Object.assign(rfp,{name:'',questions:[],skipped:[],paragraphs:[],sheets:[],workbooks:[],notes:[],noun:'',filter:'all'});$r('rfp-text').value='';renderList();status('');});
$r('rfp-questions').addEventListener('change',e=>{const s=e.target.closest('.rfp-kind');if(!s)return;const li=s.closest('li');const q=rfp.questions[Number(li.dataset.i)];q.kind=s.value;delete q.draft;delete q.status;delete q.answer;renderList();});
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
window.RFPBuilder={findQuestions,classify,paragraphs,state:rfp,load,renderList};
})();
