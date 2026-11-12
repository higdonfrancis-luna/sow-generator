/* RFP Builder: the question finder and the piles. Step 49, part one (Nov 8 2026); split out of patch_step49.py on
   Nov 10 2026 so steps 50 to 52 can be built on it. Plain functions over text and rows: no DOM, no network, no storage.

   Step 50 (Nov 10 2026, Adam approved the first batch): the finder reads requirements the way real RFPs write them.
   Statements with shall, must, should, will, ability to and support for count when they are numbered or coded; coded IDs
   (REQ-101, FR-3.2, R1., S1., M1, Item 15) are labels; Mandatory and Desirable tags become a field; lettered and roman
   sub-questions keep their stem as context and a combined label ("12 a"); lot and section headings become context
   instead of glue; a stem ending in a colon takes its bullets; notices and instructions are set aside by whole-paragraph
   patterns; the caps are 1,000 items and 3,000 characters, and everything set aside is kept in a Not picked up list.

   Step 52: the piles. Credential, commercial and staffing asks are the firm's even when they name a product; the firm's
   topic words win only when no Adobe product is named; a requirement or yes/no question that names no Adobe product
   goes to To sort. Exposes window.RFPFinder. */
(function(){
const clean=s=>String(s==null?'':s).replace(/\s+/g,' ').trim();
const sentences=s=>clean(s).split(/(?<=[.!?])\s+(?=["\u201c(]?[A-Z0-9])/).filter(Boolean);

/* ---------- labels, tags, requests and requirements (step 50) */
// The client's own numbering, most specific first. 'main' labels can be a stem; 'sub' labels are a), (ii), (A).
const LABELS=[
  [/^((?:q(?:uestion)?|item|requirement|req)\s?#?\s?\d{1,4}(?:\.\d{1,3})*[a-z]?)\s*[.:)]?\s+/i,'main'],   // Q3, Question 4, Item 15
  [/^([A-Z]{1,6}-\d{1,4}(?:\.\d{1,3})*[a-z]?)\s*[.:)]?\s+/,'main'],                                    // REQ-101, FR-3.2, SEC-01, R-1
  [/^([A-Z]{1,3}\d{1,4}(?:\.\d{1,3})*[a-z]?)(?:\s*[.:)]\s*|\s+(?=[A-Z(\[\u201c"]))/,'main'],              // R1. S1. M1 (Mandatory) Q3.
  [/^(\d{1,3}(?:\.\d{1,3}){0,4})(?:\s*[.):]\s+|\s+(?=[A-Z(\[\u201c"]))/,'main'],                          // 12. 3.2.4 1.1 (not '12 regional')
  [/^(\d{4})[.)]\s+(?=[A-Z(\[\u201c"])/,'main'],                                                       // 1000. in a long list
  [/^([A-Z]\.\d{1,3}(?:\.\d{1,3})*)\s*[.):]?\s+/,'main'],                                               // A.1 B.2
  [/^\(((?:i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii))\)\s+/i,'sub'],                                       // (i) (ii)
  [/^((?:i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii))[.)]\s+/,'sub'],                                        // i. ii)
  [/^\(?([a-zA-Z])\)\s+/,'sub'],                                                                        // a) (a) (A) A)
  [/^([a-z])\.\s+/,'sub'],                                                                              // a. b.
  [/^([A-Z])\.\s+/,'main'],                                                                             // A. Vendor profile (often a heading)
];
const BULLET=/^[\u2022\u2023\u25e6\u2043\u2219\u00b7\u25aa\u25cf\-\u2013\u2014*]\s+/;
function labelOf(s){
  if(BULLET.test(s))return {label:'',kind:'bullet',rest:s.replace(BULLET,'')};
  for(const [re,kind] of LABELS){const m=re.exec(s);if(m)return {label:m[1].replace(/\s+/g,' '),kind,rest:s.slice(m[0].length)};}
  return null;
}
// Mandatory and desirable tags: "(M) Describe", "[Mandatory]", "MANDATORY:", "Desirable -", a trailing "(Mandatory)".
const TAGW='mandatory|desirable|required|optional|must[- ]have|nice[- ]to[- ]have|essential|preferred';
const TAG_BR=new RegExp('^[\\(\\[]\\s*(m|d|'+TAGW+')\\s*[\\)\\]]\\s*[:\\-\\u2013]?\\s*','i');
const TAG_LEAD=new RegExp('^('+TAGW+')\\s*(?::|\\s[-\\u2013]|[-\\u2013])\\s*','i');
const TAG_TRAIL=new RegExp('\\s*[\\(\\[]\\s*(m|d|'+TAGW+')\\s*[\\)\\]]\\s*$','i');
const PRI=v=>/^(m|mandatory|required|must|must[- ]have|essential|yes|y|high)$/i.test(clean(v))?'mandatory':/^(d|desirable|optional|should|nice[- ]to[- ]have|preferred|medium|low)$/i.test(clean(v))?'desirable':'';
function takeTag(s,afterLabel){
  let m=TAG_BR.exec(s);
  // a bare "(D)" before any label is a lettered item, unless a numbered label follows it ("[M] 2.5 Describe")
  if(m&&!afterLabel&&/^[md]$/i.test(m[1])){const rest=s.slice(m[0].length);const L=labelOf(rest);if(!L||L.kind!=='main')m=null;}
  if(!m)m=TAG_LEAD.exec(s);
  return m?{p:PRI(m[1]),rest:s.slice(m[0].length)}:null;
}
function parseItem(p){
  let s=clean(p),priority='',t=takeTag(s,false);
  if(t){priority=t.p;s=t.rest;}
  const L=labelOf(s);let label='',kind='';
  if(L){label=L.label;kind=L.kind;s=L.rest;}
  t=takeTag(s,true);if(t){priority=priority||t.p;s=t.rest;}
  const tr=TAG_TRAIL.exec(s);if(tr){priority=priority||PRI(tr[1]);s=s.slice(0,tr.index);}
  return {label,kind,body:clean(s),priority};
}
// Request openers, with the softeners real RFPs put in front of them ("Briefly describe", "In no more than 300 words,
// outline") and the respondent-must forms ("Respondents must describe", "Bidders are asked to explain").
const ASKS=/^(describe|explain|provide|list|detail|outline|how|what|which|where|when|who|whom|whose|why|confirm|identify|indicate|state|include|demonstrate|summari[sz]e|specify|propose|define|discuss|document|share|present|submit|give|show|tell us|walk us|elaborate|clarify|recommend|suggest|name|supply|furnish|set out|advise|comment|do you|does your|does the|do the|can you|could you|would you|will you|are you|have you|has your|is your|is there|are there|is the|are the|can the|will the|please)\b/i;
const SOFT=/^(?:(?:briefly|kindly|please|also|additionally|further|clearly|concisely|fully|separately|specifically|in detail|in brief|where (?:possible|applicable|relevant)|if (?:applicable|relevant)|in (?:no more than|not more than|under|fewer than|less than|up to|about) \d[\d,]* (?:words|characters|pages)|in \d[\d,]* (?:words|characters|pages) or (?:less|fewer)|using (?:no more than )?\d[\d,]* words),?\s+)+/i;
const ACTOR=/^(?:the |each |all |every )?(?:respondents?|bidders?|vendors?|suppliers?|proposers?|offerors?|contractors?|applicants?|consultants?|agenc(?:y|ies)|tenderers?|firms?|providers?|partners?)\s+(?:must|shall|should|will|may|is to|are to|(?:is|are) (?:asked|required|requested|expected|invited|encouraged) to)\s+(?:also\s+|briefly\s+|clearly\s+|fully\s+)?(?:describe|explain|list|detail|outline|demonstrate|confirm|identify|indicate|state|specify|discuss|document|share|present|submit|summari[sz]e|include|propose|define|give|show|set out|elaborate|clarify|provide (?:a |an |the |their |its |your )?(?:description|overview|summary|plan|list|explanation|approach|examples?|details|narrative|response|answer|proposal|statement))\b/i;
const opensRequest=s=>{const x=clean(s).replace(SOFT,'');return ASKS.test(x)||ACTOR.test(x);};
const isRequest=body=>/\?/.test(body)||sentences(body).some(opensRequest);
const REQ_CUE=/\b(shall|must|should|will|is required to|are required to|needs? to|has to|have to|is expected to|are expected to|is able to|are able to|capable of)\b/i;
const REQ_START=/^(?:the )?(?:ability|capability|capacity) to\b|^supports?\s+(?:for|of)\b|^(?:vendor|respondent|bidder|supplier|proposer|offeror|contractor|provider|partner|tenderer)s?\s+to\s+\w/i;
const isRequirement=body=>!isRequest(body)&&(REQ_CUE.test(body)||REQ_START.test(body));
// Lines that continue the request before them rather than start a new one ("Include how you would keep rankings").
const CONT=/^(?:include|including|in particular|in addition|additionally|also|specifically|for example|e\.g\.|this should|this must|your (?:answer|response) should|please (?:also )?include|as part of (?:this|your)|where (?:possible|applicable|relevant)|if (?:so|yes|not|applicable|relevant|any)\b|and\b|or\b|but\b|with\b|such as\b|that\b|which\b)/i;

/* ---------- what is not a question (step 50) */
const HEADING=/^(?:section|part|lot|appendix|schedule|exhibit|attachment|annex|chapter)\s+[A-Z0-9]{1,4}\b[.:)]?/i;
const NOTICE=/^(?:please note|note:|note that|important:|questions\?|any questions|for (?:any )?questions|all questions (?:should|must|regarding|about)|direct (?:all )?questions|the (?:bank|company|client|organi[sz]ation|buyer|purchaser|county|city|state|university|agency) reserves|this (?:rfp|rfi|rfq|request|document) (?:is|does|will|may)|(?:all )?(?:responses?|proposals?|submissions?) (?:will|shall) (?:be|become)|confidential(?:ity)?\b)/i;
const CONTACT=/^(?:contact|email|e-mail|send|direct)\b.*\b[\w.+-]+@[\w-]+\.\w/i;
const INSTRUCTION=/^(?:instructions?\b|(?:please )?(?:respond|reply)\b|answer (?:each|every|all)\b|(?:responses?|proposals?|bids?|submissions?|questions) (?:are|is|must be|should be|shall be|will be) (?:due|submitted|received|sent|delivered|accepted)|submit (?:your|the|all|one|two|three|\d+|an? (?:electronic|signed|original|printed|hard|single|pdf|complete))\b|submit (?:responses?|proposals?|bids?|questions?|answers?)\b|include a signed|keep (?:each|every|your) (?:answer|response)|(?:the )?deadline (?:for|is)\b|late (?:responses|submissions|proposals)\b|in the order (?:given|listed|presented|shown))/i;
const FOREIGN=/\b(?:votre|vous|nous|pour|avec|dans|sont|leur|les|des|une|est|du|au|su|sus|para|por|los|las|una|con|del|como|nuestro|nuestra|sua|seu|uma|com|dos|das|n\u00e3o|und|der|die|ist|mit|f\u00fcr|zu|ihre|wie|het|een|voor|onze)\b/gi;
const ENGLISH=/\b(?:the|and|of|to|your|our|you|we|how|what|describe|with|for|is|are|in)\b/gi;
const notEnglish=s=>{const f=(s.match(FOREIGN)||[]).length;return f>=2&&f>(s.match(ENGLISH)||[]).length;};
const titleLike=s=>s.length<=80&&!/[.?!;]$/.test(s)&&/^[A-Z0-9\u201c"(]/.test(s)&&!isRequest(s)&&!REQ_CUE.test(s)&&!REQ_START.test(s);
const MAXQ=1000,MAXLEN=3000;
const WHY={none:'No question or requirement found in it',notice:'A notice or instruction, not a question',long:'Too long to read as one question (over 3,000 characters)',foreign:'Not in English: this tool reads English questions only',cap:'Over the limit of 1,000 questions, so it was not read',stem:'A statement with no question under it'};

/* ---------- paragraphs: lines joined into the units the finder reads */
function startsItem(l){const t=takeTag(l,false);const s=t?t.rest:l;return !!labelOf(s)||HEADING.test(s);}
function paragraphs(text){
  const lines=String(text||'').replace(/\r/g,'').split('\n').map(clean);
  const out=[];let cur='';
  const flush=()=>{if(cur)out.push(cur);cur='';};
  for(const l of lines){
    if(!l){flush();continue;}
    if(!cur){cur=l;continue;}
    let split;
    if(startsItem(l))split=true;                                       // a numbered, coded, lettered or bulleted line, or a heading
    else if(CONT.test(l))split=false;                                  // 'Include how ...', 'If so, ...' continue the request
    else if(/\?$/.test(cur))split=true;                                // a question mark ends a question
    else if(/[.!]$/.test(cur)&&/^[A-Z\u201c"(]/.test(l)){
      const body=parseItem(cur).body;
      if(isRequest(body))split=opensRequest(l)||cur.length>80;        // two requests in a row are two questions
      else split=!(opensRequest(l)||/\?$/.test(l))&&cur.length>80;     // a statement followed by its question stays one
    }
    else split=/^[A-Z\u201c"]/.test(l)&&cur.length<=60&&titleLike(cur);  // a title line ('Northbridge Mutual Bank')
    if(split)flush();
    cur=cur?cur+' '+l:l;
  }
  flush();return out;
}

/* ---------- the finder: text parts and row parts, in document order */
function session(){return {questions:[],skipped:[],seen:new Set(),section:'',parent:null,order:0,paras:[],sheets:[]};}
function skip(st,text,why,extra){st.skipped.push(Object.assign({text,reason:WHY[why]||why,order:st.order,section:st.section},extra||{}));}
function emit(st,q){
  const key=(q.label||'')+'|'+q.text.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  if(st.seen.has(key))return null;                                     // the same label and the same text twice: one question
  if(st.questions.length>=MAXQ){skip(st,q.text,'cap');return null;}
  st.seen.add(key);
  const r=Object.assign({label:'',text:'',kind:'',priority:'',section:st.section,context:'',requirement:false,order:st.order},q);
  st.questions.push(r);return r;
}
function closeOne(st,P){
  if(P.q&&P.parts.length)P.q.text=P.q.text.replace(/[:.]?$/,': ')+P.parts.join('; ')+'.';   // 'Describe how you would: migrate ...; connect ...'
  else if(P.q&&P.children&&/:$/.test(P.q.text)){const i=st.questions.indexOf(P.q);if(i>=0)st.questions.splice(i,1);}   // a bare stem whose items were read as questions
  else if(!P.q&&!P.children)skip(st,P.raw,'stem');
}
function closeParent(st){let P=st.parent;st.parent=null;while(P){closeOne(st,P);P=P.up;}}
function popSub(st){const P=st.parent;if(P&&P.sub){closeOne(st,P);st.parent=P.up;}}
function scanText(st,text){
  for(const raw of paragraphs(text)){
    st.order++;st.paras.push(raw);
    if(raw.length>MAXLEN){closeParent(st);skip(st,raw,'long');continue;}
    const it=parseItem(raw),body=it.body;
    if(NOTICE.test(raw)||NOTICE.test(body)||CONTACT.test(raw)){skip(st,raw,'notice');continue;}
    if(HEADING.test(raw)||(it.kind==='main'&&titleLike(body)&&body.length<=70&&!it.priority)){closeParent(st);st.section=raw;continue;}
    if(!body)continue;
    if(INSTRUCTION.test(body.replace(SOFT,''))||INSTRUCTION.test(body)){skip(st,raw,'notice');continue;}
    if(notEnglish(body)){skip(st,raw,'foreign');continue;}
    const request=isRequest(body)&&(/\?/.test(body)||body.length>=6),labelled=!!it.label||it.kind==='bullet';
    const requirement=!request&&labelled&&isRequirement(body);
    if(it.kind==='sub')popSub(st);                                      // a sibling of a lettered stem: back to the numbered stem
    const P=st.parent;
    if((it.kind==='sub'||it.kind==='bullet')&&P){
      if(P.q&&!request&&!requirement){P.parts.push(body.replace(/[.;]$/,''));continue;}        // a fragment under its stem
      if(request||requirement){
        P.children=(P.children||0)+1;
        const q=emit(st,{label:[P.label,it.label].filter(Boolean).join(' '),text:body,priority:it.priority||P.priority,context:P.body,requirement});
        if(q&&it.kind==='sub'&&/:$/.test(body))st.parent={label:q.label,body,raw,q,parts:[],priority:q.priority,sub:true,up:P};
        continue;
      }
    }
    if(request||requirement){
      closeParent(st);
      const q=emit(st,{label:it.label,text:body,priority:it.priority,requirement});
      if(q&&(it.kind==='main'||/:$/.test(body)))st.parent={label:it.label,body,raw,q,parts:[],priority:it.priority};
      continue;
    }
    if(it.kind==='main'){closeParent(st);st.parent={label:it.label,body,raw,q:null,parts:[],priority:it.priority};continue;}   // '12. We are implementing ...': a stem for what follows
    if(titleLike(raw))continue;                                                                                                   // a title or a running line
    skip(st,raw,'none');
  }
  closeParent(st);
}
// Rows from a spreadsheet, a CSV, a pasted table or a Word table (step 51): every row with text is an item, with the
// client's own ID, priority and section; a row that is not a question is a requirement.
function scanRows(st,rows){
  for(const r of rows||[]){
    st.order++;
    const it=parseItem(String(r.text||''));let text=it.body;
    if(!text||text.length<4)continue;
    st.paras.push(text);
    if(r.sheet&&!st.sheets.includes(r.sheet))st.sheets.push(r.sheet);
    const label=clean(r.label)||it.label,priority=PRI(r.priority)||it.priority;
    if(!label&&!priority&&titleLike(text)){st.section=text;continue;}                            // a group row inside the table
    if(notEnglish(text)){skip(st,text,'foreign',{sheet:r.sheet,row:r.row});continue;}
    emit(st,{label,text,priority,section:clean(r.section)||st.section,requirement:!isRequest(text),sheet:r.sheet||'',row:r.row,file:r.file||'',comply:clean(r.comply),...(clean(r.limit)?{limit:clean(r.limit)}:{})});   // step 89: a response form's Word limit column
  }
}
// step 74 (Nov 11 2026, Adam: "This one answer is so long and then I don't even see the question"): a line of several hundred words is
// several requirements run together (a PDF whose numbered list lost its line breaks). Where it carries its own numbering, "(1) ... (2) ...",
// it is split there. A short heading just before a "(1)" leads the items under it; "three (3) years" is a number said twice, not an item.
const RUN_MIN=150,NUMWORD=/\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|ninety|hundred)\s*$/i;
function splitRun(q){
  const t=q.text;if(t.split(/\s+/).length<RUN_MIN)return null;
  const marks=[...t.matchAll(/\((\d{1,2})\)\s+/g)].filter(m=>!NUMWORD.test(t.slice(0,m.index)));
  if(marks.length<3)return null;
  const tidy=x=>x.replace(/\s+/g,' ').replace(/^[;:,.\s]+/,'').replace(/(?:[;,]\s*(?:and|or)?\s*)+$/i,'').replace(/[;:,\s]+$/,'').trim();
  const out=[],lead=tidy(t.slice(0,marks[0].index));let heading='';
  if(lead.split(/\s+/).length>=3)out.push({label:q.label,text:lead});
  for(let k=0;k<marks.length;k++){
    const m=marks[k],next=marks[k+1];let seg=t.slice(m.index+m[0].length,next?next.index:t.length);
    let after='';
    if(next&&next[1]==='1'){   // a new list starts: the short phrase after the last semicolon or full stop is its heading
      const cut=Math.max(seg.lastIndexOf(';'),seg.lastIndexOf('. '));const tail=tidy(cut>=0?seg.slice(cut+1):'');
      if(tail&&tail.split(/\s+/).length<=8&&/^[A-Z]/.test(tail)){after=tail;seg=seg.slice(0,cut);}
    }
    const body=tidy(seg);
    if(body.split(/\s+/).length>=2)out.push({label:[q.label,'('+m[1]+')'].filter(Boolean).join(' '),text:(heading?heading+': ':'')+body});
    if(next&&next[1]==='1')heading=after;
  }
  return out.length>=3?out:null;
}
function finish(st){
  const all=[];
  for(const q of st.questions){
    const parts=splitRun(q);
    if(!parts){all.push(q);continue;}
    const whole=classify(q.text,[q.context,q.section].join(' '),q.requirement);
    parts.forEach((p,k)=>{if(all.length<MAXQ)all.push(Object.assign({},q,{label:p.label,text:p.text,order:q.order+(k+1)/1000,run:whole}));});
  }
  st.questions=all;
  for(const q of st.questions){
    q.kind=classify(q.text,[q.context,q.section].join(' '),q.requirement);
    if(q.run){if(q.kind==='unsure'&&q.run==='adobe')q.kind='adobe';delete q.run;}   // a part of a run about an Adobe product stays with it unless it is plainly about the firm
    const sp=q.kind==='adobe'?firmPart(q.text):null;if(sp)q.firmPart=sp.part;
  }
  return {questions:st.questions,skipped:st.skipped,paragraphs:st.paras,sheets:st.sheets};
}
// parts: [{text}] or [{rows}] in document order; the section heading of a text part carries into the rows after it
function read(parts){const st=session();for(const p of parts||[]){if(p.rows)scanRows(st,p.rows);else scanText(st,p.text||'');}return finish(st);}
const findQuestions=text=>read([{text}]).questions;
const questionsFromRows=rows=>read([{rows}]).questions;
// one paragraph the partner makes a question from the Not picked up list
function asQuestion(text,section){const it=parseItem(text);const body=it.body||clean(text);
  return {label:it.label,text:body,priority:it.priority,section:section||'',context:'',requirement:!isRequest(body),kind:classify(body,section||'',!isRequest(body))};}

/* ---------- the piles (step 52) */
// Adobe product names. 'Target' and 'Commerce' are ordinary words too, so they count only as Adobe Target / Adobe
// Commerce, or capitalised mid-sentence ('connect AEM Sites to Target', 'reach Commerce product pages').
const ADOBE_NAME=/\badobe\b|\baem\b|experience manager|edge delivery|\beds\b|\bfranklin\b|universal editor|sites optimizer|customer journey analytics|\bcja\b|analysis workspace|journey optimizer|\bajo\b|\bmarketo\b|\bworkfront\b|\bfusion\b|\bmagento\b|brand visibility|llm optimizer|\bllmo\b|\babv\b|brand concierge|\bcoworker\b|experience platform|\baep\b|real-?time cdp|\brt-?cdp\b|dynamic media|content hub|\bweb sdk\b|audience manager|experience cloud|\bfirefly\b|genstudio|\bcontent ai\b|content analytics|marketing campaign analytics|mix modeler|experimentation accelerator|adaptive forms|frame\.?\s?io|creative cloud|brand intelligence|\bacrobat\b|\bbizible\b|\bphotoshop\b|\billustrator\b|\bindesign\b|premiere pro/i;
const namesAdobe=t=>ADOBE_NAME.test(t)||/(?:^|[^.?!]\s)Target\b/.test(t)||(/\btarget\b/i.test(t)&&/personali[sz]|a\/b test|\bab test|experiment|recommendation/i.test(t))||/(?:^|[^\-]|[^e]-)\bCommerce\b/.test(t.replace(/\be-commerce\b/gi,''));
// The work an Adobe product does, named without the product, strong enough to sort a requirement ('The solution should
// support A/B testing of offers'); a CDN or a warehouse alone is the client's system, not an Adobe product.
const ADOBE_TOPIC=/\ba\/b test|\bab test|multivariate test|experimentation|personali[sz](?:e|ed|ation)|product recommendations|recommendations engine|customer data platform|unified (?:customer )?profile|real-time profile|marketing automation|lead scoring|lead nurtur|digital asset management|\bdam\b|asset library|core web vitals|ai (?:assistant|answer|overview|search|shopping)|ai[- ]generated answers?|answer engine|generative engine|chatgpt|perplexity|conversational (?:ai|assistant|experience)|virtual assistant|chat ?bot|abandon(?:ed)? carts?|cart abandonment|journey orchestration|cross-channel journeys?|triggered (?:email|message)s?|work management|campaign intake|creative proofing|online (?:forms?|applications?)|web forms?|digital forms?|fillable forms?|pdf forms?|form submissions?|forms? (?:portal|builder|templates?|conversion|migration|history)|application forms?|e-?signatures?|electronic signatures?|document generation|digital enrollment|web content management|content management system|site speed|page speed|search engine optimi[sz]ation|organic (?:search|traffic)|technical seo|online store|product catalog|shopping cart|b2b commerce|first-party data|identity resolution|(?:marketing|revenue|multi-touch) attribution|marketing mix|media mix|web analytics|digital analytics|pdf accessibility|document automation|signing workflow|signature workflow|contract signing|brand templates?|video review|marketing calendar|campaign planning|creative production|brand compliance|clean room|data collaboration|buying groups?|account[- ]based marketing|content performance|ad creative|creative variations?|(?:project|request) intake|asset management|brand assets?|asset metadata/i;
// the kind of work this catalog scopes, even when the RFP does not name the product (asked as an approach, not a yes/no)
const WORK=/implement|migrat|integrat|personali[sz]|analytics|\bseo\b|search engine|ai (assistant|answer|agent|overview)|chatgpt|perplexity|gemini|cms\b|content management|digital asset|\bdam\b|marketing automation|customer data|\bcdp\b|email (campaign|journey|program)|journey|audience|segment|web ?site (build|rebuild|redesign|platform)|storefront|e-?commerce|product catalog|chat ?bot|conversational|knowledge base|content fragment|headless|cdn|tag manag|data layer|dashboard|report(ing)?\b|data warehouse|snowflake|bigquery|databricks|salesforce|dynamics|crm\b|lead (scoring|routing|management)|nurture|attribution|consent|privacy|accessib|core web vitals|page speed|hosting|data residency|security (controls|certif)|soc ?2|iso 27001|hipaa|gdpr|sla\b|uptime|roadmap|upgrade|license|licensing|package|edition|sandbox|environment|training|adoption|governance|optimi[sz]ation|after launch|post-launch|ongoing|managed services|support services|maintenance|monitoring/i;
// Always the firm's own answer, even beside a product name: credentials, commercial terms, staffing, the firm's experience
// and its own tools ('Do you use generative AI tools such as ChatGPT in delivering services?').
const FIRM_ALWAYS=new RegExp([
  '\\breferences?\\b','case stud','client list','past performance','years in business','\\bfounded\\b','headquarter','office locations?','headcount',
  '\\bresumes?\\b','r\\u00e9sum\\u00e9s?','\\bbios?\\b','(?:their|your|staff|team|consultant)s?\\s+(?:adobe\\s+)?certif',
  'certified\\s+(?:[a-z]+\\s+){0,2}(?:project managers?|architects?|developers?|consultants?|engineers?|staff|team members?|resources|specialists?|experts?|leads?)\\b',
  '\\bare you\\b[^.?]*\\bcertified\\b','\\b(?:is|are) your (?:firm|company|organi[sz]ation|team|staff|consultants)\\b[^.?]*\\bcertified\\b',
  'partner (?:status|tier|level)','specializ(?:ation|ed partner)',
  'pricing model','your (?:pricing|prices?|fees|costs?|rates?|budget|invoic)','\\bhourly rates?\\b','\\bday rates?\\b','\\bblended rates?\\b','\\brate card\\b','not[- ]to[- ]exceed',
  'master services agreement','\\bmsa\\b','(?:liability|professional|cyber|indemnity) insurance','insurance (?:coverage|certificate)','certificate of insurance','\\bindemn','conflicts? of interest',
  'financial statements','\\bd&b\\b','dun (?:&|and) bradstreet','\\bbonding\\b','background checks','security clearance',
  '\\b(?:provide|name|propose|identify|introduce|describe)\\s+(?:the\\s+|a\\s+|an\\s+|your\\s+)?(?:(?:proposed|dedicated|named|lead|certified|senior)\\s+)*(?:[a-z]+\\s+)?(?:project managers?|architects?|developers?|consultants?|engineers?|team members?)\\b',
  '\\b(?:project managers?|architects?|developers?|consultants?|engineers?|team members?|resources|staff|people)\\b[^.?]*\\b(?:you (?:would|will) assign|will be assigned|be assigned|assigned to|dedicated to|allocated to|who (?:will|would) (?:lead|work|manage|be))',
  'team you (?:would|will) (?:assign|propose)','\\bstaffing\\b','key personnel','named resources','staff augmentation',
  'describe your experience','your (?:experience|track record|expertise) (?:with|in|implementing|delivering|of)','do you have experience',
  'why (?:should we|us\\b|your|choose)','company overview','cover letter',
  '\\bdo you use\\b[^.?]*\\btools?\\b','\\bin (?:delivering|the delivery of|delivery of) (?:our |the |these |this |your )?(?:services|work|engagement|project)\\b'
].join('|'),'i');
// The firm's topic words: theirs when no Adobe product is named ('How does Adobe Commerce handle B2B pricing?' is not).
const FIRM_TOPIC=/\b(?:your|the|our) (?:project |proposed |delivery |account |core |leadership )?(?:firm|company|organi[sz]ation|agency|team|staff|personnel|consultants|resources)\b|\bpricing\b|\bprices?\b|\bfees?\b|\bcosts?\b|\bbudget\b|invoic|payment terms|discount|insurance|liabilit|warrant(?:y|ies)\b|\blegal\b|contract terms|diversity|\bdei\b|sustainability|subcontract|offshore|onshore|time ?zones?|\brevenue\b|project management|methodology|escalation|account management|communication plan|status reports?|change (?:control|order|request)s?|risk management|quality assurance|transition plan|\bexit\b|termination|intellectual property|\bip\b ownership|work samples|portfolio|awards|differentiators?|executive summary|signature|authori[sz]ed|acknowledg|employees|account team|project team/i;
// Yes/no and fact questions: 'Do you support SSO?', 'Where is the data hosted?', 'What is your uptime SLA?'
const FACT=/^(?:is|are|does|do|can|could|will|would|has|have|was|were|did|shall)\b(?!\s+you\s+(?:please\s+)?(?:describe|explain|outline|provide|walk|share|detail|list|tell|give|show|elaborate))|^(?:where|what languages|how many(?!\s+(?:weeks|months|days|hours))|how much|how often|which (?:regions?|languages?|certifications?|data cent(?:er|re)s?|browsers?|countries|standards))\b|^what (?:is|are) (?:the |your )?(?:target )?(?:uptime|sla|availability|retention|rto|rpo|limits?|maximum|minimum|data residency|hosting|go-?live)/i;
const mainSentence=t=>{const s=sentences(t);return s.find(x=>/\?$/.test(x))||s.find(opensRequest)||s[0]||'';};
const factShaped=t=>FACT.test(clean(mainSentence(t)).replace(SOFT,''));
// The firm's part of a two-part question: 'Describe your approach to AEM Sites and the team you would assign'
// (fees and rates count only as the firm's own: 'your fees', 'a cost estimate'; 'questions about rates and fees' is content)
const FIRM_PART=/(?:,\s*|\s+)(?:and|including|together with|along with|as well as|plus)\s+((?:(?:a |an |the |your )?(?:proposed |detailed |high-level )?(?:timelines?|project schedule|implementation schedule|staffing plan|staffing|team you (?:would|will) (?:assign|propose)|project team|resourcing|project plan|references|case studies|(?:cost|price|pricing|fee|budget) estimates?|estimated (?:costs?|fees|budget))|your (?:pricing|costs?|fees|rates|budget))\b[^.?]*)/i;
function firmPart(t){
  const ss=sentences(t);
  for(let i=1;i<ss.length;i++)if(/^(?:please )?(?:include|provide|list|state|give|add)\b/i.test(ss[i])&&(FIRM_TOPIC.test(ss[i])||FIRM_ALWAYS.test(ss[i])))
    return {main:ss.filter((_,j)=>j!==i).join(' '),part:ss[i].replace(/^(?:please )?(?:include|provide|list|state|give|add)\s+/i,'').replace(/[.?!]+$/,'')};
  const m=FIRM_PART.exec(t);if(!m)return null;
  return {main:t.slice(0,m.index)+(/\?$/.test(t)?'?':'.'),part:m[1].replace(/[.?!]+$/,'')};
}
function classify(text,ctx,requirement){
  const t=clean(text),req=requirement===undefined?!isRequest(t)&&REQ_CUE.test(t):!!requirement,asks=isRequest(t)&&!req;
  const sp=firmPart(t);if(sp&&classify(sp.main,ctx,requirement)==='adobe')return 'adobe';      // the Adobe part is drafted; the firm part is the partner's to write
  if(FIRM_ALWAYS.test(t))return 'firm';
  if(namesAdobe(t))return 'adobe';
  if(FIRM_TOPIC.test(t))return 'firm';
  if(namesAdobe(clean(ctx))&&(asks||req)&&!factShaped(t))return 'adobe';                    // under 'Lot 2: Customer Journey Analytics'
  if(ADOBE_TOPIC.test(t))return 'adobe';
  if(asks&&!factShaped(t)&&WORK.test(t))return 'adobe';
  return 'unsure';
}
const KIND={adobe:'Adobe products',firm:'Your firm',unsure:'To sort'};
window.RFPFinder={paragraphs,read,findQuestions,questionsFromRows,asQuestion,classify,firmPart,factShaped,isRequest,isRequirement,parseItem,labelOf,PRI,KIND,
  ADOBE_NAME,ADOBE_TOPIC,WORK,FIRM_ALWAYS,FIRM_TOPIC,FACT,ASKS,INSTRUCTION,NOTICE,namesAdobe,sentences,clean,MAXQ,MAXLEN};
})();
