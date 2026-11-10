"""RFI Builder step 70 (Nov 10 2026, Adam on the summary bar: "There's a lot going on here"; "if they're missing stuff then
they're missing stuff they can add it manually"; "0-6 firm answers sounds off"; "back to the homepage"; then "go" to
sow/mockups/nov10_summary_options/summary_options.png and after_click.png).

- rfp_answers.js: the summary bar says one thing a line ("5 of 8 Adobe product questions are answered."), each count with a
  link to the questions that are left; the drafts tick box, the blank-answers warning and the Shorter answers tick box are
  removed with the code behind them (answers not marked "Use this answer" are left out of the downloads; an RFI's own word
  limit is still obeyed); Open draft opens a Save my work file in the RFI Builder.
- rfp_ui.js: the two "left" views of the list and the line above it; the removed settings leave the saved work.
- patch_step49.py: "Back to the home page", the line above the list, the styles.
- canvas/template.html: the front page's Open draft hands a Save my work file to the RFI Builder.

Run once from the repo root, then rebuild:

    python3 sow/patch_step70.py
    python3 sow/canvas/build.py && python3 sow/build_site.py
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


patch('rfp_answers.js', [
    # Shorter answers goes; an RFI's own limit stays
    ("""const SHORT=170;
// step 69: with Shorter answers on, each answer is fitted to SHORT words, or to the RFP's own limit where that is lower
function targetOf(q){const l=limitOf(q);return rfpState.shorter&&!(l&&l.max<=SHORT)?{n:SHORT,max:SHORT,short:true}:l;}
const limitSays=lim=>lim.short?'Shorter answers is on, so each answer is kept to about '+lim.n+' words.':'This RFI asks for '+(lim.max<lim.n?'under ':'no more than ')+lim.n+' words an answer.';
""", """const limitSays=lim=>'This RFI asks for '+(lim.max<lim.n?'under ':'no more than ')+lim.n+' words an answer.';
"""),
    ("// kept until the questions, what the partner chose, the name or the Shorter answers setting change", "// kept until the questions, what the partner chose or the name change"),
    ("key=[qs.length,rfpState.shorter?1:0,clientOrg(),", "key=[qs.length,clientOrg(),"),
    ("need=needsOf(q,d),lim=targetOf(q),budget=", "need=needsOf(q,d),lim=limitOf(q),budget="),
    ("if(!d)return '';const lim=targetOf(q),p=t=>", "if(!d)return '';const lim=limitOf(q),p=t=>"),
    ("return p('Your edited answer is '+n+' words. '+(lim.short?limitSays(lim)+(n>lim.max?' Shorten it with Edit.':''):'This RFI asks for '+(lim.max<lim.n?'under ':'no more than ')+lim.n+(n>lim.max?', so shorten it with Edit.':'.')));}",
     "return p('Your edited answer is '+n+' words. This RFI asks for '+(lim.max<lim.n?'under ':'no more than ')+lim.n+(n>lim.max?', so shorten it with Edit.':'.'));}"),
    # the blank-answers warning goes
    ("""// step 69: once the partner has chosen some answers, say which drafted ones are not chosen and will come out blank (Adam downloaded a
// bank response with three of eight answers empty and could not see why)
function blankWarn(adobe,used){
  if(!used.length||rfpState.includeDrafts===true)return '';
  const out=adobe.filter(q=>q.status!=='used'&&q.status!=='skipped'&&(q.answer||hasDraft(draftOf(q))));if(!out.length)return '';
  const labels=out.map(q=>q.label).filter(Boolean);
  return '<p class="rfp-blank-warn" id="rfp-blank-warn">'+out.length+' answer'+(out.length===1?'':'s')+' about Adobe products '+(out.length===1?'is':'are')+' not marked "Use this answer" and will be blank in the downloads'+(labels.length===out.length?': '+esc(labels.join(', ')):'')+'.</p>';}
""", """// step 70 (Adam: "0-6 firm answers sounds off", "what if they want to go back and fill in their answers that they missed?"): one count a
// line, in plain words, and beside it a link to the questions of that kind with no decision yet
function countLine(kind,what,qs){
  const n=qs.filter(q=>q.status==='used').length,left=qs.filter(q=>!q.status).length,one=qs.length===1;
  return '<span class="rfp-count"><b>'+(n===qs.length&&!one?'All '+n:n+' of '+qs.length)+'</b> '+what[one?0:1]+' answered.'+
    (left?' <button type="button" class="rfp-link" id="rfp-left-'+kind+'">Go to the '+left+' that '+(left===1?'is':'are')+' left</button>':'')+'</span>';}
"""),
    ("""  el.innerHTML='<div class="rfp-sum-head"><p><b>'+used.length+' of '+adobe.length+'</b> answer'+(adobe.length===1?'':'s')+' about Adobe products and <b>'+written.length+' of '+firm.length+'</b> firm answer'+(firm.length===1?'':'s')+' are in your response. <b>'+lines.size+'</b> service'+(lines.size===1?'':'s')+' selected for the statement of work.</p><div""",
     """  el.innerHTML='<div class="rfp-sum-head"><p>'+(adobe.length?countLine('adobe',['Adobe product question is','Adobe product questions are'],adobe):'')+(firm.length?countLine('firm',['question about your firm is','questions about your firm are'],firm):'')+'<span class="rfp-count"><b>'+lines.size+' service'+(lines.size===1?'':'s')+'</b> selected for the statement of work.</span></p><div"""),
    ("""    '<label class="rfp-include"><input type="checkbox" id="rfp-include-drafts"'+(rfpState.includeDrafts?' checked':'')+'><span>Include the answers you have not chosen to use in the downloads, marked as drafts.</span></label>'+
    '<label class="rfp-include"><input type="checkbox" id="rfp-shorter"'+(rfpState.shorter?' checked':'')+'><span>Shorter answers: keep each answer to about '+SHORT+' words.</span></label>'+
""", ""),
    ("""    blankWarn(adobe,used)+
""", ""),
    ("const adobe=qs.filter(q=>q.kind==='adobe'),used=adobe.filter(q=>q.status==='used'),lines=selectedLineIds();", "const adobe=qs.filter(q=>q.kind==='adobe'),lines=selectedLineIds();"),
    ("const firm=qs.filter(q=>q.kind==='firm'),written=firm.filter(q=>q.status==='used'),wb=writable();", "const firm=qs.filter(q=>q.kind==='firm'),wb=writable();"),
    # the downloads: the answers marked "Use this answer", nothing else
    (".tag{font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:0 0 6px}", ""),
    ("""const blank='<p class="blank">Your answer:</p><div class="space"></div>',mark='<p class="tag">Draft, not yet reviewed</p>',inc=rfpState.includeDrafts===true;
  // approved answers only; a draft goes in, marked, when the partner ticks the box; a question left out stays blank
  const own=q=>q.answer&&q.status==='used'?'<pre>'+esc(q.answer)+'</pre>':q.answer&&inc&&q.status!=='skipped'?mark+'<pre>'+esc(q.answer)+'</pre>':blank;""",
     """const blank='<p class="blank">Your answer:</p><div class="space"></div>';
  // the answers marked "Use this answer" only (step 70: no drafts); every other question stays blank
  const own=q=>q.answer&&q.status==='used'?'<pre>'+esc(q.answer)+'</pre>':blank;"""),
    ("""    if(!hasDraft(d)||q.status==='skipped')return '<section><h3>'+esc(label)+'</h3>'+own(q)+'</section>';
    if(q.status!=='used'&&!inc)return '<section><h3>'+esc(label)+'</h3>'+blank+'</section>';
    const text=(q.status==='used'?'':mark)+(q.answer?'<pre>'+esc(q.answer)+'</pre>':answerHTML(d,q));
    return""", """    if(!hasDraft(d)||q.status==='skipped')return '<section><h3>'+esc(label)+'</h3>'+own(q)+'</section>';
    if(q.status!=='used')return '<section><h3>'+esc(label)+'</h3>'+blank+'</section>';
    const text=q.answer?'<pre>'+esc(q.answer)+'</pre>':answerHTML(d,q);
    return"""),
    ("""    // Step 55: approved answers only; a draft's text goes in, marked, when the partner ticks the box
    let text='',status='';const inc=rfpState.includeDrafts===true,drafted=hasDraft(d);""", """    // Step 55: approved answers only (step 70: no drafts)
    let text='',status='';const drafted=hasDraft(d);"""),
    ("""      else if(inc){text='Draft, not yet reviewed: '+body;status='Draft';}
""", ""),
    ("// what goes back into the client's workbook: an approved answer; a draft, marked, when the partner ticks the box; nothing for a question left out",
     "// what goes back into the client's workbook: an answer marked \"Use this answer\"; nothing for any other question"),
    ("""  if(q.status==='used')return body;
  return rfpState.includeDrafts===true?'Draft, not yet reviewed: '+body:'';
""", """  return q.status==='used'?body:'';
"""),
    ("so nothing was written. Choose one first, or tick the drafts box.');return;}", "so nothing was written. Choose one first.');return;}"),
    ("so a withdrawn approval or an unticked drafts box clears what an earlier write-back put there", "so a withdrawn approval clears what an earlier write-back put there"),
    ("so nothing was written. Choose one first, or tick the drafts box.');\n", "so nothing was written. Choose one first.');\n"),
    ("// a service unticked on an answer stays out of the hand-off (step 56); the drafts box decides what the downloads carry (step 55)", "// a service unticked on an answer stays out of the hand-off (step 56)"),
    ("""(q.lines=q.lines||{})[t.dataset.id]=t.checked;summary();R.persist();return;}
  if(e.target.id==='rfp-include-drafts'){rfpState.includeDrafts=e.target.checked;R.persist();summary();}
  if(e.target.id==='rfp-shorter'){rfpState.shorter=e.target.checked;R.persist();renderAnswer();}});""",
     """(q.lines=q.lines||{})[t.dataset.id]=t.checked;summary();R.persist();}});"""),
    ("written,limitOf,targetOf,clientOrg,", "written,limitOf,clientOrg,"),
    # the links to what is left
    ("""  if(id==='rfp-open-work'){$r('rfp-work-file').click();return;}
""", """  if(id==='rfp-open-work'){$r('rfp-work-file').click();return;}
  if(id==='rfp-left-adobe'||id==='rfp-left-firm'){const kind=id.slice(9);rfpState.filter='left'+kind;R.renderList();   // step 70: only the questions of that kind with no decision, the first one open
    const i=rfpState.questions.findIndex(o=>o.kind===kind&&!o.status);if(i>=0)select(i);$r('rfp-results').scrollIntoView({block:'start'});return;}
"""),
    # Open draft and Open my work read a Save my work file the same way
    ("""const workFile=$r('rfp-work-file');
if(workFile)workFile.addEventListener('change',async e=>{const f=e.target.files&&e.target.files[0];e.target.value='';if(!f)return;
  const bad=()=>toast('Choose a Save my work file from this RFI Builder.');let snap=null;
  try{if(f.size>40000000)throw Error('size');snap=JSON.parse(await f.text());}catch(err){bad();return;}
  if(!snap||snap.v!==1||!Array.isArray(snap.questions)||!snap.questions.length||typeof snap.name!=='string'){bad();return;}
""", """const isWork=snap=>!!snap&&snap.v===1&&Array.isArray(snap.questions)&&snap.questions.length>0&&typeof snap.name==='string';
function openWork(snap){
  const bad=()=>toast('Choose a Save my work file from this RFI Builder.');
  if(!isWork(snap)){bad();return;}
"""),
    ("""  R.askReplace('The file holds a different RFI ('+(snap.name||'unnamed')+', '+snap.questions.length+' question'+(snap.questions.length===1?'':'s')+'). Replacing it clears the RFI on screen; Save my work first if you want to keep what is here.',()=>{if(R.restore(snap))toast('Opened '+(snap.name||'your work')+'.');else bad();});});
""", """  R.askReplace('The file holds a different RFI ('+(snap.name||'unnamed')+', '+snap.questions.length+' question'+(snap.questions.length===1?'':'s')+'). Replacing it clears the RFI on screen; Save my work first if you want to keep what is here.',()=>{if(R.restore(snap))toast('Opened '+(snap.name||'your work')+'.');else bad();});}
const workFile=$r('rfp-work-file');
if(workFile)workFile.addEventListener('change',async e=>{const f=e.target.files&&e.target.files[0];e.target.value='';if(!f)return;
  let snap=null;try{if(f.size>40000000)throw Error('size');snap=JSON.parse(await f.text());}catch(err){}
  openWork(snap);});
"""),
    ("""    df.onchange=async e=>{let snap=null;try{const f=e.target.files&&e.target.files[0];if(f&&f.size<=3000000){const d=JSON.parse(await f.text());if(d&&d.rfp&&d.rfp.v===1&&Array.isArray(d.rfp.questions))snap=d.rfp;}}catch(err){}
""", """    df.onchange=async e=>{let snap=null;try{const f=e.target.files&&e.target.files[0];if(f&&f.size<=3000000){const d=JSON.parse(await f.text());if(d&&d.rfp&&d.rfp.v===1&&Array.isArray(d.rfp.questions))snap=d.rfp;
        else if(isWork(d)&&!d.play){e.target.value='';go('rfp');openWork(d);return;}}}catch(err){}   // step 70: a Save my work file opens in the RFI Builder (Adam chose one with Open draft and nothing opened)
"""),
    ("""R.restoreSession();   // step 56: the work this tab held before a reload or a trip to another step comes back
""", """R.restoreSession();   // step 56: the work this tab held before a reload or a trip to another step comes back
// step 70: a Save my work file chosen with Open draft on the home page arrives here
try{const t=sessionStorage.getItem('abv-rfp-work-in');if(t){sessionStorage.removeItem('abv-rfp-work-in');openWork(JSON.parse(t));}}catch(e){}
"""),
])

patch('rfp_ui.js', [
    ("noun:'',filter:'all',includeDrafts:false,shorter:false,client:null,selected:null};\n", "noun:'',filter:'all',client:null,selected:null};\n"),
    ("filter:'all',selected:null,includeDrafts:false,shorter:false,client:null});", "filter:'all',selected:null,client:null});"),
    ("noun:'',filter:'all',includeDrafts:false,shorter:false,client:null,selected:null});$r('rfp-text')", "noun:'',filter:'all',client:null,selected:null});$r('rfp-text')"),
    ("selected:rfp.selected,includeDrafts:!!rfp.includeDrafts,shorter:!!rfp.shorter,client:", "selected:rfp.selected,client:"),
    ("filter:FILTER[snap.filter]?snap.filter:'all',includeDrafts:snap.includeDrafts===true,shorter:snap.shorter===true,client:", "filter:FILTER[snap.filter]?snap.filter:'all',client:"),
    ("""const toReview=q=>(q.kind==='adobe'||q.kind==='firm')&&!q.status;   // still needs a decision: approve or leave out
""", """const toReview=q=>(q.kind==='adobe'||q.kind==='firm')&&!q.status;   // still needs a decision: approve or leave out
// step 70: the summary bar's links show the questions of one kind that are left; no button of the filter row is pressed then
const LEFT={leftadobe:['adobe','Adobe product question','Adobe product questions'],leftfirm:['firm','question about your firm','questions about your firm']};
const shows=q=>rfp.filter==='all'||(rfp.filter==='review'?toReview(q):LEFT[rfp.filter]?q.kind===LEFT[rfp.filter][0]&&!q.status:q.kind===rfp.filter);
"""),
    ("""function renderList(){
  const list=$r('rfp-questions');list.innerHTML='';
""", """function renderList(){
  const list=$r('rfp-questions');list.innerHTML='';
  {const note=$r('rfp-left-note'),L=LEFT[rfp.filter],n=L?rfp.questions.filter(shows).length:0;note.hidden=!L;
    note.innerHTML=L?(n?'Showing the '+n+' '+L[n===1?1:2]+' that '+(n===1?'is':'are')+' left.':'No '+L[2]+' are left.')+' <button type="button" id="rfp-show-all">Show all questions</button>':'';}
"""),
    ("""  else {if(rfp.filter!=='all'&&!rfp.questions.some(q=>rfp.filter==='review'?toReview(q):q.kind===rfp.filter))list.innerHTML='<li class="rfp-skip rfp-none">'+(rfp.filter==='review'?'Nothing to review: every question has a decision.':'No question in this pile.')+'</li>';""",
     """  else {if(rfp.filter!=='all'&&!LEFT[rfp.filter]&&!rfp.questions.some(shows))list.innerHTML='<li class="rfp-skip rfp-none">'+(rfp.filter==='review'?'Nothing to review: every question has a decision.':'No question in this pile.')+'</li>';"""),
    ("li.hidden=rfp.filter==='all'?false:rfp.filter==='review'?!toReview(q):q.kind!==rfp.filter;", "li.hidden=!shows(q);"),
    ("""$r('rfp-results').addEventListener('click',e=>{const b=e.target.closest('[data-rfp-filter]');if(b){rfp.filter=b.dataset.rfpFilter;renderList();}});""",
     """$r('rfp-results').addEventListener('click',e=>{const b=e.target.closest('[data-rfp-filter]');if(b){rfp.filter=b.dataset.rfpFilter;renderList();}
  if(e.target.id==='rfp-show-all'){rfp.filter='all';renderList();}});"""),
])

patch('patch_step49.py', [
    ("Its heading and Back to the first page show only", "Its heading and Back to the home page show only"),
    ('class="rfi-back">Back to the first page</button>', 'class="rfi-back">Back to the home page</button>'),
    ('<button type="button" id="rfp-clear">Start over</button></div><div class="rfp-grid">', '<button type="button" id="rfp-clear">Start over</button></div><p class="rfp-left-note" id="rfp-left-note" hidden></p><div class="rfp-grid">'),
    ("""/* steps 55 and 56: rows open from the keyboard, the drafts checkbox, the services behind an answer */
.rfp-list li:focus-visible{outline:3px solid var(--red);outline-offset:2px}
.rfp-include{display:flex;flex-direction:row;gap:10px;align-items:flex-start;font-size:15px;font-weight:400;line-height:1.5;margin:4px 0 12px;cursor:pointer}
.rfp-include input{width:18px;height:18px;margin:5px 0 0;accent-color:var(--red);flex:none}
""", """/* steps 55 and 56: rows open from the keyboard, the services behind an answer */
.rfp-list li:focus-visible{outline:3px solid var(--red);outline-offset:2px}
/* step 70: one count a line on the summary bar, and the line above the list when it shows what is left */
.rfp-count{display:block;line-height:1.9}.rfp-count .rfp-link{margin-left:8px}
.rfp-left-note{margin:0 0 12px;font-size:15.5px;font-weight:700;color:#1C1C1C;display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center}
"""),
    (".rfp-client{display:flex;flex-direction:row;flex-wrap:wrap;gap:8px 12px;align-items:center;font-size:15px;font-weight:400;line-height:1.5;margin:4px 0 12px}",
     ".rfp-client{display:flex;flex-direction:row;flex-wrap:wrap;gap:8px 12px;align-items:center;font-size:15px;font-weight:400;line-height:1.5;margin:14px 0 16px}"),
    (""".rfp-blank-warn{border:2px solid var(--red);border-radius:10px;padding:10px 14px;margin:4px 0 14px;font-size:15.5px;line-height:1.5;font-weight:600;color:#1C1C1C}
""", ""),
])

patch('canvas/template.html', [
    ("""const t=await f.text(),d=JSON.parse(t);if(!d||typeof d!=='object'||!d.play||!d.estimates)throw Error('schema');sessionStorage.setItem('abv-sow-draft-in',t);}""",
     """const t=await f.text(),d=JSON.parse(t);
    if(d&&typeof d==='object'&&!d.play&&d.v===1&&Array.isArray(d.questions)&&d.questions.length&&typeof d.name==='string'){sessionStorage.setItem('abv-rfp-work-in',t);location.href='sow/index.html#rfi';return;}   /* RFI Builder step 70: a Save my work file opens in the RFI Builder */
    if(!d||typeof d!=='object'||!d.play||!d.estimates)throw Error('schema');sessionStorage.setItem('abv-sow-draft-in',t);}"""),
])
