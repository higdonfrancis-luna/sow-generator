"""RFI Builder step 72 (Nov 11 2026): Read with AI. Adam ran a 36-page government RFP through the tool ("Doesn't seem to be
rendering correctly ... maybe it should just be AI"), saw the comparison in sow/mockups/nov11_ai_reading/ai_reading.png
(the rules found 47 items and drafted 10 answers; an AI reading listed 182 requirements), said "we're in beta right now ...
if AI would help, we should add an AI model" with his Amazon Bedrock key on the WARROOM worker, "yes, use sonnet 5", "just
have a button say Read with AI", then "go" to ai_button.png.

- rfp_ui.js: the Read with AI button sends the RFI's text to the reader (one address, AI_URL) and puts the list it returns
  in place of the tool's own; the same button undoes it. The answers are still written by rfp_answers.js from the catalog.
- rfp_answers.js: a line that names no product draws on the products the RFI is about (named in three or more of its
  paragraphs, the two named most), and only where a service's own words answer the line. No AI in this part.
- patch_step49.py: the button, its style, and the intro's sentence on what leaves the browser.

The reader is the route /rfi/read on the worker warroom-assistant (sow/ai_reading/warroom-assistant-worker.js).

Run once from the repo root, then rebuild:

    python3 sow/patch_step72.py
    python3 sow/build_site.py
"""
import os

SOW = os.path.dirname(os.path.abspath(__file__))


def patch(name, pairs):
    path = os.path.join(SOW, name)
    text = open(path, encoding='utf-8').read()
    bal = lambda t: (t.count('{') - t.count('}'), t.count('(') - t.count(')'), t.count('[') - t.count(']'))
    before = bal(text)
    for old, new in pairs:
        assert text.count(old) == 1, ('anchor not found once', name, old[:90], text.count(old))
        text = text.replace(old, new)
    assert bal(text) == before, ('brackets changed', name, before, bal(text))
    open(path, 'w', encoding='utf-8').write(text)
    print('patched', name, len(pairs))


patch('rfp_ui.js', [
    ("noun:'',filter:'all',client:null,selected:null};\n", "noun:'',filter:'all',client:null,selected:null,ai:false,aiUndo:null};\n"),
    ("filter:'all',selected:null,client:null});", "filter:'all',selected:null,client:null,ai:false,aiUndo:null});"),
    ("noun:'',filter:'all',client:null,selected:null});$r('rfp-text')", "noun:'',filter:'all',client:null,selected:null,ai:false,aiUndo:null});$r('rfp-text')"),
    ("selected:rfp.selected,client:", "selected:rfp.selected,ai:rfp.ai===true,aiUndo:rfp.aiUndo||null,client:"),
    ("filter:FILTER[snap.filter]?snap.filter:'all',client:", "filter:FILTER[snap.filter]?snap.filter:'all',ai:snap.ai===true&&!!undoOf(snap.aiUndo),aiUndo:snap.ai===true?undoOf(snap.aiUndo):null,client:"),
    ("""// a row from a file: only the fields the page writes, in the shapes it writes them
""", """// step 72: the tool's own list, kept while the AI's list is on screen so Undo Read with AI can bring it back
const undoOf=u=>u&&Array.isArray(u.questions)&&Array.isArray(u.skipped)?{questions:u.questions.filter(q=>q&&typeof q.text==='string'&&KIND[q.kind]).map(q=>sound(q)),skipped:u.skipped.filter(x=>x&&typeof x.text==='string')}:null;
// a row from a file: only the fields the page writes, in the shapes it writes them
"""),
    ("""  return rfp.name+': '+n+' '+noun+' found'+sheets+'. '+piles+'.'+md+sk+""",
     """  if(rfp.ai)return rfp.name+': read with AI. '+n+' '+(n===1?'requirement':'requirements')+' found. '+piles+'.'+(s?' '+s+' '+(s===1?'entry was':'entries were')+' set aside: see Not picked up.':'');
  return rfp.name+': '+n+' '+noun+' found'+sheets+'. '+piles+'.'+md+sk+"""),
    ("""function renderList(){
  const list=$r('rfp-questions');list.innerHTML='';
""", """function renderList(){
  const list=$r('rfp-questions');list.innerHTML='';
  {const b=$r('rfp-ai');b.textContent=aiBusy?'Reading with AI\\u2026':rfp.ai?'Undo Read with AI':'Read with AI';b.disabled=aiBusy;}
"""),
    ("""  if(e.target.id==='rfp-show-all'){rfp.filter='all';renderList();}});""",
     """  if(e.target.id==='rfp-show-all'){rfp.filter='all';renderList();}
  if(e.target.id==='rfp-ai'&&!aiBusy){   // step 72: decisions made on the list on screen are cleared, so it asks first
    if(rfp.ai){if(hasWork())askReplace('Undoing Read with AI brings back the tool\\'s own list and clears the decisions made on the AI\\'s list. Save my work first if you want to keep them.',undoAI);else undoAI();}
    else if(hasWork())askReplace('Read with AI replaces the list on screen and clears the decisions made on it. Save my work first if you want to keep them.',readWithAI);else readWithAI();}});
/* step 72 (Nov 11 2026, Adam: "if AI would help, we should add an AI model", "just have a button say Read with AI"): the
   RFI's text goes to an AI reader, which lists what the client asks for; its list takes the place of the tool's own. The
   answers are still written from the catalog. AI_URL is the one address of the reader: point it at another to use
   another key or another model. */
const AI_URL='https://warroom-assistant.adam-d1a.workers.dev/rfi/read';
let aiBusy=false;
async function readWithAI(){
  const text=(rfp.paragraphs||[]).filter(p=>typeof p==='string').join('\\n'),was=rfp.questions;
  if(text.trim().length<200){toast('There is too little text in this RFI for an AI reading.');return;}
  aiBusy=true;renderList();status(rfp.name+': reading with AI. A long document can take a few minutes; keep this tab open.');
  let data=null,err='';
  try{const r=await fetch(AI_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:rfp.name,text})});data=await r.json();
    if(!r.ok||!data||!Array.isArray(data.items))err=(data&&typeof data.error==='string'&&data.error)||'The AI reader did not answer.';}
  catch(e){err='The AI reader could not be reached. The tool\\'s own list is unchanged.';}
  aiBusy=false;
  if(rfp.questions!==was)return;   // another RFI was loaded while this one was being read
  const items=err?[]:data.items.filter(x=>x&&typeof x.text==='string'&&x.text.trim()&&['adobe','firm','skip'].includes(x.kind));
  if(err||!items.some(x=>x.kind!=='skip')){renderList();toast(err||'The AI reading found nothing to answer in this RFI.');return;}
  rfp.aiUndo={questions:rfp.questions.map(strip),skipped:rfp.skipped};
  rfp.questions=items.filter(x=>x.kind!=='skip').map((x,i)=>({label:String(x.ref||'').slice(0,80),text:x.text.trim().slice(0,700),kind:x.kind,order:i+1,section:''}));
  rfp.skipped=[...items.filter(x=>x.kind==='skip').map((x,i)=>({text:(x.ref?String(x.ref).slice(0,80)+': ':'')+x.text.trim().slice(0,700),reason:'Set aside by the AI reading',order:10000+i,section:''})),
    ...(Array.isArray(data.notes)?data.notes:[]).filter(t=>typeof t==='string'&&t.trim()).slice(0,5).map((t,i)=>({text:t.trim().slice(0,700),reason:'A note from the AI reading',order:20000+i,section:''}))];
  rfp.ai=true;rfp.filter='all';rfp.selected=null;
  if(window.RFPBuilder&&window.RFPBuilder.onLoad)window.RFPBuilder.onLoad();
  renderList();
  toast(data.truncated?'This is a long document: the AI\\'s list may stop before its end. Check the last pages yourself.':'Read with AI: check the list against the document before you answer. An AI reading can miss or misread a line.');
}
function undoAI(){const u=rfp.aiUndo;if(!u)return;rfp.questions=u.questions;rfp.skipped=u.skipped;rfp.ai=false;rfp.aiUndo=null;rfp.filter='all';rfp.selected=null;
  if(window.RFPBuilder&&window.RFPBuilder.onLoad)window.RFPBuilder.onLoad();renderList();}"""),
])

patch('rfp_answers.js', [
    ("""// the products the RFP's questions name, kept until the questions change
""", """// step 72: the products an RFI is about, for a line that names none (a 36-page RFP says "Adobe Experience Manager" in its title and
// "forms schema design" on page 9): the Adobe products named in three or more of its paragraphs, the two named most
let mainOf=null,mainN=-1,mainIs=[];
function rfpMain(){const qs=rfpState.questions;if(mainOf!==qs||mainN!==qs.length){mainOf=qs;mainN=qs.length;const n={};
    for(const t of [rfpState.name,...(rfpState.paragraphs||[]).filter(p=>typeof p==='string'),...qs.map(q=>q.text)])for(const id of detectAll(t).named)if(!P[id].outside)n[id]=(n[id]||0)+1;
    mainIs=Object.keys(n).filter(id=>n[id]>=3).sort((a,b)=>n[b]-n[a]).slice(0,2);}
  return mainIs;}
// the products the RFP's questions name, kept until the questions change
"""),
    ("""  if(!prods.length){
    if(ongoing&&opts.ctx&&opts.ctx.length){prods=opts.ctx.slice(0,10);fromContext=true;}""",
     """  if(!prods.length&&!opts.pick&&!d.uncovered.length&&!(ongoing&&opts.ctx&&opts.ctx.length)){const main=rfpMain().filter(id=>!d.excluded.includes(P[id].name));if(main.length){prods=main;via='rfp';}}   // step 72
  if(!prods.length){
    if(ongoing&&opts.ctx&&opts.ctx.length){prods=opts.ctx.slice(0,10);fromContext=true;}"""),
    # step 72: a product the line did not name answers only with a service whose own name the line uses, and the RFI's
    # products' own names ("forms", "sites") are not such a word
    ("nameW=nameWords(d.named.filter(id=>prods.includes(id))),migrate=MIGRATE.test(text);", "nameW=nameWords(via==='rfp'?adobe:d.named.filter(id=>prods.includes(id))),migrate=MIGRATE.test(text);"),
    ("cands.push({id:l,s,hit,isDefault});}}", "cands.push({id:l,s,hit,strong:via==='rfp'?overlap(qt,nameT.filter(w=>!GENERIC.has(w)&&!WEAK.has(w))):0,isDefault});}}"),
    ("const nameWords=ids=>", "// step 72: words of a service's name that are too common to show, alone, that a line with no product in it asks for that service\nconst WEAK=new Set(['each','document','workflow','template','templat','build','design','create']);\nconst nameWords=ids=>"),
    ("let lines=cands.filter(x=>x.s>0&&(x.hit>0||x.isDefault||fromContext)).slice(",
     "let lines=cands.filter(x=>x.s>0&&(via==='rfp'?x.strong>1||(x.strong>0&&x.hit>3):x.hit>0||x.isDefault||fromContext)).slice("),
    ("  if(!lines.length&&!fromContext&&via!=='topic'){const o",
     "  if(via==='rfp'&&!lines.length)return {products:[],conn:null,conns:[],missing:[],lines:[],fromContext:false,via,uncovered:d.uncovered,excluded:d.excluded};\n  if(!lines.length&&!fromContext&&via!=='topic'){const o"),
    ("""  box.innerHTML=head+state+chipsHTML(q,d)+kbFrom+'<p class="rfp-voice">Your response to the client</p>'""",
     """  const fromRfp=d.m&&d.m.via==='rfp'?'<p class="rfp-kb-from" id="rfp-from-rfp">This line names no product, so the answer draws on the products this RFI is about. Remove one above if it does not belong.</p>':'';
  box.innerHTML=head+state+chipsHTML(q,d)+fromRfp+kbFrom+'<p class="rfp-voice">Your response to the client</p>'"""),
])

patch('patch_step49.py', [
    ('<button type="button" id="rfp-clear">Start over</button></div><p class="rfp-left-note"', '<button type="button" id="rfp-ai">Read with AI</button><button type="button" id="rfp-clear">Start over</button></div><p class="rfp-left-note"'),
    (".rfp-filters #rfp-clear{margin-left:auto}\n", ".rfp-filters #rfp-ai{margin-left:auto;border-color:var(--red);color:var(--red);font-weight:700}\n.rfp-filters #rfp-ai:disabled{border-color:#1C1C1C;color:#1C1C1C;cursor:default}\n"),
    (".rfp-filters #rfp-clear{margin-left:0}}", ".rfp-filters #rfp-ai{margin-left:0}}"),
    ("The file is read in your browser only. Nothing is uploaded or stored on a server: your work stays in this tab",
     "The file is read in your browser only. Nothing is uploaded or stored on a server, unless you choose Read with AI, which sends the RFI’s text to an AI model to list what it asks for: your work stays in this tab"),
])
