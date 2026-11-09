/* RFP Builder: the screen. The drop zone, the paste box, the question list and its filters, the status line. Step 49,
   part one; split out of patch_step49.py on Nov 10 2026. Uses RFPFinder and RFPReaders; RFPAnswers hooks in through
   onLoad and onRender. Exposes window.RFPBuilder. */
(function(){
const $r=id=>document.getElementById(id);
const rfp={name:'',questions:[],filter:'all'};
const {findQuestions,questionsFromRows,classify,paragraphs,KIND}=window.RFPFinder;const {readFile}=window.RFPReaders;
function status(msg){$r('rfp-status').textContent=msg;}
function renderList(){
  const list=$r('rfp-questions');list.innerHTML='';
  for(const [i,q] of rfp.questions.entries()){
    const li=document.createElement('li');li.dataset.kind=q.kind;li.dataset.i=i;li.hidden=rfp.filter!=='all'&&q.kind!==rfp.filter;
    if(rfp.selected===i)li.classList.add('sel');
    li.innerHTML='<span class="rfp-tag">'+KIND[q.kind]+'</span><span class="rfp-q">'+(q.label?'<b>'+esc(q.label)+'</b>':'')+esc(q.text)+(q.status?'<br><span class="rfp-state'+(q.status==='used'?' ok':'')+'">'+(q.status==='used'?'Used':'Skipped')+'</span>':'')+'</span><select class="rfp-kind" aria-label="Which pile this question belongs to">'+Object.entries(KIND).map(([k,v])=>'<option value="'+k+'"'+(k===q.kind?' selected':'')+'>'+v+'</option>').join('')+'</select><span class="rfp-open">'+(rfp.selected===i?'Open':(q.kind==='firm'?'Write answer':'See answer')+' &rsaquo;')+'</span>';
    list.appendChild(li);
  }
  const n=rfp.questions.length,a=rfp.questions.filter(q=>q.kind==='adobe').length,f=rfp.questions.filter(q=>q.kind==='firm').length,u=n-a-f;
  status(n?rfp.name+': '+n+' question'+(n===1?'':'s')+' found. '+a+' about Adobe services, '+f+' about your firm'+(u?', '+u+' to sort':'')+'. Change a pile with the menu on its row.':'');
  $r('rfp-results').hidden=!n;
  for(const b of document.querySelectorAll('[data-rfp-filter]'))b.setAttribute('aria-pressed',b.dataset.rfpFilter===rfp.filter?'true':'false');
  if(window.RFPBuilder&&window.RFPBuilder.onRender)window.RFPBuilder.onRender();
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
async function take(file){
  if(!file)return;
  if(file.size>25000000){status('That file is over 25 MB. Export the RFP without images, or paste its text.');return;}
  status('Reading '+file.name+' in your browser...');
  try{
    const read=await readFile(file);
    load(file.name,read);
  }catch(e){status('Could not read '+file.name+'. '+(e&&e.message?e.message:'Try saving it as PDF or .docx, or paste the text.'));}
}
function load(name,payload){
  // payload: the RFP's text, or {rows, text, source, wb} from a reader that kept a table's rows (step 51). Tab-separated or
  // comma-separated pastes go through the same row reader when it recognises them.
  if(typeof payload==='string'&&window.RFPReaders.rowsFromDelimitedText){const t=window.RFPReaders.rowsFromDelimitedText(payload);if(t)payload=t;}
  const text=typeof payload==='string'?payload:(payload&&payload.text)||'';
  rfp.name=name;rfp.paragraphs=text?paragraphs(text):[];rfp.source=(payload&&payload.source)||null;rfp.wb=(payload&&payload.wb)||null;
  rfp.questions=[...(payload&&payload.rows?questionsFromRows(payload.rows):[]),...(text?findQuestions(text):[])];rfp.filter='all';rfp.selected=null;if(window.RFPBuilder&&window.RFPBuilder.onLoad)window.RFPBuilder.onLoad();
  if(!rfp.questions.length){status(name+': no questions found. RFP questions usually end with a question mark or start with words like describe, provide or explain. Try pasting the questions section.');$r('rfp-results').hidden=true;return;}
  renderList();
}
const drop=$r('rfp-drop');
$r('rfp-choose').addEventListener('click',()=>$r('rfp-file').click());
$r('rfp-file').addEventListener('change',e=>{const f=e.target.files[0];e.target.value='';take(f);});
for(const ev of ['dragenter','dragover'])drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('over');});
for(const ev of ['dragleave','drop'])drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('over');});
drop.addEventListener('drop',e=>{const f=e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0];take(f);});
$r('rfp-paste-btn').addEventListener('click',()=>{$r('rfp-paste').hidden=false;$r('rfp-text').focus();});
$r('rfp-paste-cancel').addEventListener('click',()=>{$r('rfp-paste').hidden=true;});
$r('rfp-paste-go').addEventListener('click',()=>{const t=$r('rfp-text').value;if(!t.trim()){status('Paste the RFP text first.');return;}$r('rfp-paste').hidden=true;load('Pasted text',t);});
$r('rfp-results').addEventListener('click',e=>{const b=e.target.closest('[data-rfp-filter]');if(b){rfp.filter=b.dataset.rfpFilter;renderList();}});
$r('rfp-clear').addEventListener('click',()=>{rfp.name='';rfp.questions=[];$r('rfp-text').value='';renderList();status('');});
$r('rfp-questions').addEventListener('change',e=>{const s=e.target.closest('.rfp-kind');if(!s)return;const li=s.closest('li');const q=rfp.questions[Number(li.dataset.i)];q.kind=s.value;delete q.draft;delete q.status;delete q.answer;renderList();});
window.RFPBuilder={findQuestions,classify,paragraphs,state:rfp,load,renderList};
})();
