"""Step 49 (Nov 8 2026, Adam: "a fifth tab called RFP Builder", "ok 3"): the RFP Builder tab, part one.

The partner drops a client's RFP or RFI (PDF, Word or text). The page reads it in the browser (pdf.js and mammoth from
lib/, loaded only when the tab opens; nothing is uploaded or stored), finds the questions, and sorts them into three
piles: Adobe services (answered from this catalog in part two), Your firm (references, team, pricing: the partner's),
and Not sure (the partner moves it). Each question's pile can be changed. Nothing about the RFP is saved to browser
storage; the list clears when the page closes.

    python3 sow/patch_step49.py sow/index.html
    python3 sow/canvas/build.py && python3 sow/build_site.py
    node sow/test_rfp.js

Anchors are unique strings in index.html; each is checked to appear once before the edit.
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()


def once(anchor):
    n = html.count(anchor)
    assert n == 1, f'anchor appears {n} times: {anchor[:80]!r}'


def replace(anchor, new):
    global html
    once(anchor)
    html = html.replace(anchor, new, 1)


# 1. the tab, after Statement of work
TAB = '<button role="tab" data-step="document" aria-controls="document-panel">Statement of work</button>'
replace(TAB, TAB + '<button role="tab" data-step="rfp" aria-controls="rfp-panel">RFP Builder</button>')

# 2. the panel, after the Statement of work panel
DOC_END = '<div id="sow-preview"></div></section>'
PANEL = '''<section id="rfp-panel" class="panel" role="tabpanel" hidden><div class="section-intro"><h2>Answer an RFP from the catalog</h2><p>Drop your client's RFP or RFI. The tool finds the questions and sorts them: the ones about Adobe services it can answer from this catalog, the ones about your firm stay yours. The file is read in your browser only. Nothing is uploaded or stored, and the list clears when you close the page.</p></div>
<div class="rfp-drop" id="rfp-drop"><b>Drop the RFP here, or choose a file</b><span>PDF, Word (.docx), Excel (.xlsx), CSV or text</span><div class="row"><button type="button" class="primary" id="rfp-choose">Choose file</button><button type="button" id="rfp-paste-btn">Paste text instead</button></div><input type="file" id="rfp-file" accept=".pdf,.docx,.xlsx,.xls,.csv,.txt,.md,application/pdf,text/plain" hidden></div>
<div id="rfp-paste" hidden><textarea id="rfp-text" rows="9" placeholder="Paste the RFP text here, questions and all" aria-label="RFP text"></textarea><div class="next-row"><button type="button" id="rfp-paste-cancel">Cancel</button><button type="button" class="primary" id="rfp-paste-go">Find the questions</button></div></div>
<p class="hint rfp-status" id="rfp-status" aria-live="polite"></p>
<div id="rfp-results" hidden><div class="rfp-filters" role="group" aria-label="Show questions"><button type="button" data-rfp-filter="all" aria-pressed="true">All</button><button type="button" data-rfp-filter="adobe" aria-pressed="false">Adobe services</button><button type="button" data-rfp-filter="firm" aria-pressed="false">Your firm</button><button type="button" data-rfp-filter="unsure" aria-pressed="false">Not sure</button><button type="button" id="rfp-clear">Clear</button></div><ol class="rfp-list" id="rfp-questions"></ol></div></section>'''
replace(DOC_END, DOC_END + '\n' + PANEL)

# 3. the panel switch and the hash route know the new step
replace("for(const name of ['scope','services','document'])$(name+'-panel').hidden=name!==step;",
        "for(const name of ['scope','services','document','rfp'])$(name+'-panel').hidden=name!==step;")
replace("location.hash.slice(1);if(['scope','services','document'].includes(s))step=s;}",
        "location.hash.slice(1);if(['scope','services','document','rfp'].includes(s))step=s;}")

# 4. styles, before the first closing style tag
CSS = '''
/* step 49: RFP Builder */
.rfp-drop{border:2px dashed var(--red);border-radius:16px;padding:26px 20px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px;margin:0 0 14px;background:#fff}
.rfp-drop.over{border-style:solid}
.rfp-drop b{font-size:17px}.rfp-drop span{font-size:14px}.rfp-drop .row{display:flex;gap:10px;margin-top:8px;flex-wrap:wrap;justify-content:center}
#rfp-text{width:100%;box-sizing:border-box;border:1.5px solid var(--line);border-radius:12px;padding:12px;font:inherit;font-size:15px;line-height:1.45}
.rfp-status{min-height:20px}
.rfp-filters{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}
.rfp-filters button[aria-pressed=true]{background:var(--red);color:#fff;border-color:var(--red)}
.rfp-filters #rfp-clear{margin-left:auto}
.rfp-list{list-style:none;margin:0;padding:0}
.rfp-list li{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:start;border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin:0 0 8px;font-size:15px;line-height:1.45;background:#fff}
.rfp-list li[hidden]{display:none}
.rfp-tag{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:1.5px solid var(--red);color:var(--red);border-radius:999px;padding:2px 8px;white-space:nowrap;margin-top:2px}
.rfp-list li[data-kind=firm] .rfp-tag{border-color:var(--ink);color:var(--ink)}
.rfp-list li[data-kind=unsure] .rfp-tag{border-style:dashed;border-color:var(--ink);color:var(--ink)}
.rfp-q b{margin-right:6px}
.rfp-kind{font:inherit;font-size:13px;border:1.5px solid var(--line);border-radius:10px;padding:4px 8px;background:#fff;color:var(--ink)}
@media (max-width:700px){.rfp-list li{grid-template-columns:1fr}.rfp-filters #rfp-clear{margin-left:0}}
</style>'''
# the page has two style blocks (the print styles come second); the new rules join the first
assert html.count('</style>') == 2
html = html.replace('</style>', CSS, 1)

# 5. the script, after the page's own script
SCRIPT = '''<script id="rfp-builder">
/* step 49: RFP Builder, part one. Reads the file in the browser, finds the questions, sorts them into piles.
   The RFP never leaves the page: no network call, no browser storage. */
(function(){
const $r=id=>document.getElementById(id);
const rfp={name:'',questions:[],filter:'all'};
const LIB='lib/';
// Adobe products and the work around them: a question that names one is about Adobe services
const ADOBE=/\\badobe\\b|\\baem\\b|experience manager|edge delivery|\\bfranklin\\b|universal editor|\\bsites optimizer\\b|\\btarget\\b|customer journey analytics|\\bcja\\b|adobe analytics|journey optimizer|\\bajo\\b|\\bmarketo\\b|\\bworkfront\\b|\\bfusion\\b|\\bcommerce\\b|\\bmagento\\b|brand visibility|llm optimizer|brand concierge|\\bcoworker\\b|experience platform|\\baep\\b|real-time cdp|\\bcdp\\b|dynamic media|content hub|\\bweb sdk\\b|\\btags\\b|audience manager|experience cloud|firefly|genstudio|\\bcontent ai\\b|\\bagentic\\b/i;
// the kind of work this catalog scopes, even when the RFP does not name the product
const WORK=/implement|migrat|integrat|personali[sz]|analytics|\\bseo\\b|search engine|ai (assistant|answer|agent|overview)|chatgpt|perplexity|gemini|cms\\b|content management|digital asset|\\bdam\\b|marketing automation|customer data|\\bcdp\\b|email (campaign|journey|program)|journey|audience|segment|web ?site (build|rebuild|redesign|platform)|storefront|e-?commerce|product catalog|chat ?bot|conversational|knowledge base|content fragment|headless|cdn|tag manag|data layer|dashboard|report(ing)?\\b|data warehouse|snowflake|bigquery|databricks|salesforce|dynamics|crm\\b|lead (scoring|routing|management)|nurture|attribution|consent|privacy|accessib|core web vitals|page speed|hosting|data residency|security (controls|certif)|soc ?2|iso 27001|hipaa|gdpr|sla\\b|uptime|roadmap|release|upgrade|license|licensing|package|edition|sandbox|environment|training|adoption|governance|optimi[sz]ation|after launch|post-launch|ongoing|managed services|support services|maintenance|monitoring/i;
// the partner's own answers: about the firm, not the products
const FIRM=/\\b(your|the|our) (project |proposed |delivery |account |core |leadership )?(firm|company|organi[sz]ation|agency|team|staff|personnel|consultants|resources)\\b|\\breferences?\\b|case stud|client list|past performance|years in business|\\bfounded\\b|headquarter|office locations?|headcount|employees|org(ani[sz]ation)? chart|\\bresumes?\\b|résumés?|\\bbios?\\b|(their|your|staff|team|consultant)s?\\s+(adobe\\s+)?certif|partner (status|tier|level)|specializ(ation|ed partner)|pricing|\\bprice\\b|\\bhourly rates?\\b|\\byour rates?\\b|\\brate card\\b|\\bfees?\\b|\\bcosts?\\b|\\bbudget\\b|invoice|invoicing|payment terms|discount|insurance|liability|indemn|warrant(y|ies)\\b|\\blegal\\b|contract terms|master services agreement|\\bmsa\\b|conflict of interest|diversity|\\bdei\\b|sustainability|subcontract|offshore|onshore|time ?zones?|financial statements|\\brevenue\\b|\\bd&b\\b|dun & bradstreet|bonding|background checks|security clearance|project management (approach|methodology)|delivery methodology|escalation|account management|communication plan|status report|change (control|order|request)|risk management|quality assurance|transition plan|\\bexit\\b|termination|intellectual property|\\bip\\b ownership|work samples|portfolio|awards|differentiators?|why (should we|your)|company overview|executive summary|cover letter|signature|authorized|acknowledg/i;
const ASKS=/^(describe|explain|provide|list|detail|outline|how|what|which|where|when|who|confirm|identify|indicate|state|include|demonstrate|summari[sz]e|specify|propose|define|discuss|document|share|present|submit|do you|does your|can you|will you|are you|have you|is your|please)\\b/i;
const NUM=/^((\\d+(\\.\\d+)*[.)]?)|([A-Za-z]\\.\\d+(\\.\\d+)*[.)]?)|([A-Za-z][.)])|(\\(?[a-z0-9]{1,3}\\)))\\s+/;
const INSTRUCTION=/\\b(respond|reply|answer)\\b.*\\b(each|every|all)\\b.*\\b(question|item|section)s?\\b|in the order (given|listed|presented|shown)|^instructions?\\b|^submit\\b|^include a signed|\\bdeadline\\b|^(responses?|proposals?) (are |is )?due\\b|^keep each answer/i;
function paragraphs(text){
  const lines=text.replace(/\\r/g,'').split('\\n').map(l=>l.replace(/\\s+/g,' ').trim());
  const out=[];let cur='';
  const flush=()=>{if(cur.trim())out.push(cur.trim());cur='';};
  for(const l of lines){
    if(!l){flush();continue;}
    const starts=NUM.test(l)||/^(q(uestion)?\\s?\\d+)/i.test(l)||/^[\\u2022\\-\\u2013\\u2013*]\\s/.test(l)||/^(section|part|appendix|schedule|exhibit|attachment|annex)\\s+[A-Z0-9]/i.test(l);
    const prevDone=/[.?!:]$/.test(cur);
    if(starts||(prevDone&&/^[A-Z]/.test(l)&&cur.length>80))flush();
    cur=cur?cur+' '+l:l;
  }
  flush();return out;
}
function findQuestions(text){
  const qs=[];const seen=new Set();
  for(const p of paragraphs(text)){
    if(p.length<12||p.length>900)continue;
    let label='',body=p;const m=NUM.exec(p)||/^(q(uestion)?\\s?\\d+[.:)]?)\\s+/i.exec(p);
    if(m){label=m[0].trim().replace(/[.)]$/,'');body=p.slice(m[0].length).trim();}
    const asks=/\\?/.test(body)||body.replace(/^[\\u2022\\-\\u2013*]\\s*/,'').split(/(?<=[.!])\\s+/).some(sentence=>ASKS.test(sentence));   // a request verb may open the second sentence: 'Our team runs X. Describe how...'
    if(!asks)continue;
    if(!/\\?/.test(body)&&INSTRUCTION.test(body))continue;
    const key=body.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
    if(seen.has(key))continue;seen.add(key);
    qs.push({label,text:body,kind:classify(body)});
    if(qs.length>=300)break;
  }
  return qs;
}
function classify(q){
  // the firm's own answers first: 'your team and their Adobe certifications' is about the firm, not the product
  if(FIRM.test(q))return 'firm';
  if(ADOBE.test(q))return 'adobe';
  if(WORK.test(q))return 'adobe';
  return 'unsure';
}
async function readFile(file){
  const name=file.name.toLowerCase();
  if(name.endsWith('.pdf')||file.type==='application/pdf')return readPdf(file);
  if(name.endsWith('.docx'))return readDocx(file);
  if(/\\.(xlsx|xlsm|xls|csv)$/.test(name))return readSheet(file);
  if(name.endsWith('.doc'))throw Error('Save the Word file as .docx first; the old .doc format cannot be read in the browser.');
  return file.text();
}
async function readPdf(file){
  const pdfjs=await import('./'+LIB+'pdf.min.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc='./'+LIB+'pdf.worker.min.mjs';
  const doc=await pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false,disableFontFace:true}).promise;
  let text='';
  for(let i=1;i<=doc.numPages;i++){
    const page=await doc.getPage(i),content=await page.getTextContent();
    let lastY=null,line='';
    for(const it of content.items){
      if(!('str' in it))continue;
      const y=Math.round(it.transform[5]);
      if(lastY!==null&&Math.abs(y-lastY)>2){text+=line.trim()+'\\n';line='';}
      line+=it.str+(it.hasEOL?'\\n':' ');lastY=y;
    }
    text+=line.trim()+'\\n\\n';
  }
  return text;
}
function readSheet(file){
  // every sheet, row by row: the cells of a row joined with spaces, so a '#' column and a question column read as one numbered line
  return new Promise((resolve,reject)=>{
    const go=async()=>{try{
      const wb=window.XLSX.read(new Uint8Array(await file.arrayBuffer()),{type:'array',cellDates:false});
      const lines=[];
      for(const name of wb.SheetNames){
        const rows=window.XLSX.utils.sheet_to_json(wb.Sheets[name],{header:1,raw:false,defval:''});
        for(const row of rows){
          const cells=row.map(c=>String(c==null?'':c).trim()).filter(Boolean);
          // a numbering-only cell ('2.1', 'Q3', 'A.2') joins the cell after it; every other cell is its own line, so a Section column stays a heading
          for(let i=0;i<cells.length;i++){
            if(/^\\(?[A-Za-z]?\\d{0,3}(\\.\\d+)*[.)]?$/.test(cells[i])&&cells[i].length<=8&&i+1<cells.length){lines.push(cells[i].replace(/[.)]$/,'')+' '+cells[i+1]);i++;}
            else lines.push(cells[i]);
          }
        }
        lines.push('');
      }
      resolve(lines.join('\\n'));
    }catch(e){reject(e);}};
    if(window.XLSX)return go();
    const sc=document.createElement('script');sc.src=LIB+'xlsx.mini.min.js';sc.onload=go;sc.onerror=()=>reject(Error('The spreadsheet reader did not load.'));document.head.appendChild(sc);
  });
}
function readDocx(file){
  return new Promise((resolve,reject)=>{
    const run=()=>window.mammoth.extractRawText({arrayBuffer:null}).catch(()=>{}),go=async()=>{try{const r=await window.mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()});resolve(r.value);}catch(e){reject(e);}};
    if(window.mammoth)return go();
    const s=document.createElement('script');s.src=LIB+'mammoth.browser.min.js';s.onload=go;s.onerror=()=>reject(Error('The Word reader did not load.'));document.head.appendChild(s);
  });
}
const KIND={adobe:'Adobe services',firm:'Your firm',unsure:'Not sure'};
function status(msg){$r('rfp-status').textContent=msg;}
function renderList(){
  const list=$r('rfp-questions');list.innerHTML='';
  for(const [i,q] of rfp.questions.entries()){
    const li=document.createElement('li');li.dataset.kind=q.kind;li.dataset.i=i;li.hidden=rfp.filter!=='all'&&q.kind!==rfp.filter;
    li.innerHTML='<span class="rfp-tag">'+KIND[q.kind]+'</span><span class="rfp-q">'+(q.label?'<b>'+esc(q.label)+'</b>':'')+esc(q.text)+'</span><select class="rfp-kind" aria-label="Which pile this question belongs to">'+Object.entries(KIND).map(([k,v])=>'<option value="'+k+'"'+(k===q.kind?' selected':'')+'>'+v+'</option>').join('')+'</select>';
    list.appendChild(li);
  }
  const n=rfp.questions.length,a=rfp.questions.filter(q=>q.kind==='adobe').length,f=rfp.questions.filter(q=>q.kind==='firm').length,u=n-a-f;
  status(n?rfp.name+': '+n+' question'+(n===1?'':'s')+' found. '+a+' about Adobe services, '+f+' about your firm'+(u?', '+u+' to sort':'')+'. Change a pile with the menu on its row.':'');
  $r('rfp-results').hidden=!n;
  for(const b of document.querySelectorAll('[data-rfp-filter]'))b.setAttribute('aria-pressed',b.dataset.rfpFilter===rfp.filter?'true':'false');
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
async function take(file){
  if(!file)return;
  if(file.size>25000000){status('That file is over 25 MB. Export the RFP without images, or paste its text.');return;}
  status('Reading '+file.name+' in your browser...');
  try{
    const text=await readFile(file);
    load(file.name,text);
  }catch(e){status('Could not read '+file.name+'. '+(e&&e.message?e.message:'Try saving it as PDF or .docx, or paste the text.'));}
}
function load(name,text){
  rfp.name=name;rfp.questions=findQuestions(text||'');rfp.filter='all';
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
$r('rfp-questions').addEventListener('change',e=>{const s=e.target.closest('.rfp-kind');if(!s)return;const li=s.closest('li');rfp.questions[Number(li.dataset.i)].kind=s.value;renderList();});
window.RFPBuilder={findQuestions,classify,paragraphs,state:rfp,load};
})();
</script>'''
END = "render();sizeNotice();if(loadFailed)toast(LOAD_FAILED);\n</script></body></html>"
replace(END, "render();sizeNotice();if(loadFailed)toast(LOAD_FAILED);\n</script>\n" + SCRIPT + "</body></html>")

open(path, 'w', encoding='utf-8').write(html)
print('step 49 applied: RFP Builder tab, panel, styles and script')
