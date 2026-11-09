/* RFP Builder: the question finder and the piles. Step 49, part one (Nov 8 2026); split out of patch_step49.py on
   Nov 10 2026 so steps 50 to 52 can be built side by side. Plain functions over text: no DOM, no network, no storage.
   Exposes window.RFPFinder. */
(function(){
// Adobe products and the work around them: a question that names one is about Adobe services
const ADOBE=/\badobe\b|\baem\b|experience manager|edge delivery|\bfranklin\b|universal editor|\bsites optimizer\b|\btarget\b|customer journey analytics|\bcja\b|adobe analytics|journey optimizer|\bajo\b|\bmarketo\b|\bworkfront\b|\bfusion\b|\bcommerce\b|\bmagento\b|brand visibility|llm optimizer|brand concierge|\bcoworker\b|experience platform|\baep\b|real-time cdp|\bcdp\b|dynamic media|content hub|\bweb sdk\b|\btags\b|audience manager|experience cloud|firefly|genstudio|\bcontent ai\b|\bagentic\b/i;
// the kind of work this catalog scopes, even when the RFP does not name the product
const WORK=/implement|migrat|integrat|personali[sz]|analytics|\bseo\b|search engine|ai (assistant|answer|agent|overview)|chatgpt|perplexity|gemini|cms\b|content management|digital asset|\bdam\b|marketing automation|customer data|\bcdp\b|email (campaign|journey|program)|journey|audience|segment|web ?site (build|rebuild|redesign|platform)|storefront|e-?commerce|product catalog|chat ?bot|conversational|knowledge base|content fragment|headless|cdn|tag manag|data layer|dashboard|report(ing)?\b|data warehouse|snowflake|bigquery|databricks|salesforce|dynamics|crm\b|lead (scoring|routing|management)|nurture|attribution|consent|privacy|accessib|core web vitals|page speed|hosting|data residency|security (controls|certif)|soc ?2|iso 27001|hipaa|gdpr|sla\b|uptime|roadmap|release|upgrade|license|licensing|package|edition|sandbox|environment|training|adoption|governance|optimi[sz]ation|after launch|post-launch|ongoing|managed services|support services|maintenance|monitoring/i;
// the partner's own answers: about the firm, not the products
const FIRM=/\b(your|the|our) (project |proposed |delivery |account |core |leadership )?(firm|company|organi[sz]ation|agency|team|staff|personnel|consultants|resources)\b|\breferences?\b|case stud|client list|past performance|years in business|\bfounded\b|headquarter|office locations?|headcount|employees|org(ani[sz]ation)? chart|\bresumes?\b|résumés?|\bbios?\b|(their|your|staff|team|consultant)s?\s+(adobe\s+)?certif|partner (status|tier|level)|specializ(ation|ed partner)|pricing|\bprice\b|\bhourly rates?\b|\byour rates?\b|\brate card\b|\bfees?\b|\bcosts?\b|\bbudget\b|invoice|invoicing|payment terms|discount|insurance|liability|indemn|warrant(y|ies)\b|\blegal\b|contract terms|master services agreement|\bmsa\b|conflict of interest|diversity|\bdei\b|sustainability|subcontract|offshore|onshore|time ?zones?|financial statements|\brevenue\b|\bd&b\b|dun & bradstreet|bonding|background checks|security clearance|project management (approach|methodology)|delivery methodology|escalation|account management|communication plan|status report|change (control|order|request)|risk management|quality assurance|transition plan|\bexit\b|termination|intellectual property|\bip\b ownership|work samples|portfolio|awards|differentiators?|why (should we|your)|company overview|executive summary|cover letter|signature|authorized|acknowledg/i;
const ASKS=/^(describe|explain|provide|list|detail|outline|how|what|which|where|when|who|confirm|identify|indicate|state|include|demonstrate|summari[sz]e|specify|propose|define|discuss|document|share|present|submit|do you|does your|can you|will you|are you|have you|is your|please)\b/i;
const NUM=/^((\d+(\.\d+)*[.)]?)|([A-Za-z]\.\d+(\.\d+)*[.)]?)|([A-Za-z][.)])|(\(?[a-z0-9]{1,3}\)))\s+/;
const INSTRUCTION=/\b(respond|reply|answer)\b.*\b(each|every|all)\b.*\b(question|item|section)s?\b|in the order (given|listed|presented|shown)|^instructions?\b|^submit\b|^include a signed|\bdeadline\b|^(responses?|proposals?) (are |is )?due\b|^keep each answer/i;
function paragraphs(text){
  const lines=text.replace(/\r/g,'').split('\n').map(l=>l.replace(/\s+/g,' ').trim());
  const out=[];let cur='';
  const flush=()=>{if(cur.trim())out.push(cur.trim());cur='';};
  for(const l of lines){
    if(!l){flush();continue;}
    const starts=NUM.test(l)||/^(q(uestion)?\s?\d+)/i.test(l)||/^[\u2022\-\u2013\u2013*]\s/.test(l)||/^(section|part|appendix|schedule|exhibit|attachment|annex)\s+[A-Z0-9]/i.test(l);
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
    let label='',body=p;const m=NUM.exec(p)||/^(q(uestion)?\s?\d+[.:)]?)\s+/i.exec(p);
    if(m){label=m[0].trim().replace(/[.)]$/,'');body=p.slice(m[0].length).trim();}
    const asks=/\?/.test(body)||body.replace(/^[\u2022\-\u2013*]\s*/,'').split(/(?<=[.!])\s+/).some(sentence=>ASKS.test(sentence));   // a request verb may open the second sentence: 'Our team runs X. Describe how...'
    if(!asks)continue;
    if(!/\?/.test(body)&&INSTRUCTION.test(body))continue;
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
const KIND={adobe:'Adobe services',firm:'Your firm',unsure:'Not sure'};
// Structured rows from a spreadsheet or table reader (step 51): one question per row, the client's own ID, priority and
// section kept. rows: [{label, text, priority, section, sheet, row}]
function questionsFromRows(rows){const qs=[];for(const r of rows||[]){const text=String(r.text||'').replace(/\s+/g,' ').trim();if(text.length<6)continue;
  qs.push({label:String(r.label||'').trim(),text,kind:classify(text),priority:r.priority||'',section:r.section||'',sheet:r.sheet||'',row:r.row});}
  return qs;}
window.RFPFinder={paragraphs,findQuestions,questionsFromRows,classify,KIND,ADOBE,WORK,FIRM,ASKS,NUM,INSTRUCTION};
})();
