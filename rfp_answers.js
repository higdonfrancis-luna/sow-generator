/* Step 49, part two (Nov 9 2026): drafted answers for the RFP Builder prototype. Everything runs in the browser from the
   catalog the page already carries (RFP_CAT: the canvas's products, connections and lines; CATALOG: the SOW templates;
   REVIEW_CONCEPTS: the research lines' SOW text). No AI, no network, nothing stored: answers live in memory with the
   question list and clear when the page closes.

   Steps 50 to 52 (Nov 10 2026, Adam approved the first batch). The matcher tells product names from topic words: a draft
   starts from a product the question (or its stem or section) names, and a topic word only adds the second product of a
   documented connection, unless the question asks which products to use. 'Target' and 'Commerce' count only as Adobe's
   products; 'aem' never scores inside 'AEM Assets' or 'AEM Forms'; a product the client rules out ('We will not use Adobe
   Target') is dropped and said; Adobe products this catalog does not cover are named as such; yes/no and fact questions
   (hosting, security, languages, limits) get the capability box with Adobe's pages, not a build plan; To sort and firm
   questions are never drafted; ties between connections go to the products the question names; a line beside a
   connection needs a word of its own name in the question, product-name words aside; products the RFP says the client
   already runs get no setup, upgrade or launch lines; no line means No match; every named product is kept, with the
   pairs the catalog has no connection for named to the partner. Requirements are answered "We would meet this by".
   The partner can change the products a draft is drawn from. The Excel adds Section, Mandatory or desirable and Comply,
   and the answers used can be written back into the client's own workbook, values only. */
(function(){
const R=window.RFPBuilder,CAT=typeof RFP_CAT!=='undefined'?RFP_CAT:null;if(!R||!CAT)return;   // RFP_CAT and the page's CATALOG are const declarations, so they are not on window
const $r=id=>document.getElementById(id);
const P=Object.fromEntries(CAT.products.map(p=>[p.id,p])),C=CAT.connections.filter(c=>P[c.a]&&P[c.b]),LN=CAT.lines;
const TPL=Object.fromEntries((typeof CATALOG!=='undefined'?CATALOG:[]).map(t=>[t.id,t]));
const CON=typeof REVIEW_CONCEPTS!=='undefined'?REVIEW_CONCEPTS:{};
const F=window.RFPFinder;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- what a question is about (step 52: names apart from topic words) */
const NAMES={
 bv:['brand visibility','adobe brand visibility','llm optimizer','llmo','abv'],
 cja:['customer journey analytics','cja'],
 aemsites:['aem sites','experience manager sites','adobe experience manager','aem'],
 eds:['edge delivery services','edge delivery','eds','franklin','aem live'],
 so:['sites optimizer','aem sites optimizer'],
 commerce:['adobe commerce','magento','commerce cloud'],
 bc:['brand concierge','concierge'],
 cw:['coworker','adobe coworker','cx enterprise coworker'],
 rtcdp:['real-time cdp','real time cdp','realtime cdp','rtcdp','rt-cdp','experience platform','adobe experience platform','aep'],
 ajo:['journey optimizer','adobe journey optimizer','ajo'],
 target:['adobe target'],
 marketo:['marketo engage','marketo'],
 workfront:['workfront','workfront fusion','adobe workfront'],
 aemassets:['aem assets','experience manager assets','assets essentials','dynamic media','content hub'],
 cdn:['akamai','cloudflare','cloudfront','fastly','imperva'],
 dwh:['snowflake','bigquery','databricks','redshift'],
 cstore:['amazon s3','azure blob','google cloud storage'],
 crm:['salesforce','dynamics 365','microsoft dynamics','hubspot'],
 ads:['google ads','meta ads','tiktok ads','linkedin ads','microsoft ads'],
 bi:['power bi','tableau','looker'],
 search:['search console','google search console','google analytics 4','ga4'],
 csrc:['sharepoint','google drive','google docs'],
 cms:['wordpress','sitecore','drupal','contentful']};
const TOPICS={
 bv:['ai assistant','ai answer','ai overview','chatgpt','perplexity','gemini','ai search','ai shopping','shopping assistant','agentic traffic','answer engine','generative engine','visible in ai','show up in ai','ai citation','ai visibility'],
 cja:['analytics','measure','measurement','measured','attribution','journey analysis','report on','reporting','dashboard','conversion data','customer journey','cross-channel analysis'],
 aemsites:['content management system','cms','authoring','web content','multi-site','multisite','site template'],
 eds:['site speed','page speed','core web vitals','fast site','new website','new site','site rebuild','redesign','website platform','lighthouse'],
 so:['seo','search engine optimization','search traffic','organic traffic','technical seo','site optimization'],
 commerce:['storefront','online store','ecommerce','e-commerce','product page','product catalog','checkout','shopping cart','b2b commerce'],
 bc:['chatbot','chat bot','conversational','virtual assistant','answer their questions','questions about accounts','self-service answers','live chat','conversational assistant'],
 cw:['agent skills','readouts on request','routine work','ai agent for our team','by asking'],
 rtcdp:['customer data platform','cdp','customer profile','unified profile','unified customer profile','audience','segment','known customer','first-party data','identity resolution','data ingestion'],
 ajo:['journey','email journey','triggered message','sms','push notification','campaign orchestration','abandoned cart','abandon cart','cart abandonment','messaging','ip warmup','warmup','sending subdomain','subdomain delegation'],
 target:['personalization','personalize','personalise','personalisation','a/b test','a/b testing','ab test','ab testing','experimentation','product recommendation','recommendation'],
 marketo:['marketing automation','lead scoring','lead nurturing','nurture','b2b marketing','lead management'],
 workfront:['work management','project intake','request intake','campaign request','proofing','creative review'],
 aemassets:['digital asset management','dam','asset library','brand asset','images and video','approved images','product images','rendition','asset metadata'],
 cdn:['cdn','access logs','log forwarding','content delivery network'],
 dwh:['data warehouse','warehouse'],
 cstore:['cloud storage','sftp','file drops','blob storage'],
 crm:['our crm','the crm','crm'],
 ads:['ad platform','paid media','ad spend'],
 bi:['bi tool','business intelligence'],
 csrc:['word documents','document authoring'],
 cms:['another cms','tag manager','legacy cms']};
// Adobe products this catalog does not cover: named as such, never answered as a neighbour ('AEM Forms' is not AEM Sites)
const UNCOVERED=[['aem forms','AEM Forms'],['experience manager forms','AEM Forms'],['adobe forms','AEM Forms'],['adobe campaign','Adobe Campaign'],['campaign classic','Adobe Campaign'],['campaign standard','Adobe Campaign'],['campaign v8','Adobe Campaign'],['audience manager','Audience Manager'],['aem guides','AEM Guides'],['experience manager guides','AEM Guides'],['aem screens','AEM Screens'],['adobe express','Adobe Express'],['genstudio','GenStudio'],['firefly','Firefly'],['frame io','Frame.io'],['mix modeler','Mix Modeler'],['adobe advertising','Adobe Advertising'],['marketo measure','Marketo Measure'],['bizible','Marketo Measure'],['acrobat sign','Acrobat Sign'],['adobe sign','Acrobat Sign'],['learning manager','Adobe Learning Manager'],['adobe analytics','Adobe Analytics']];
const STRONG=new Set(['dam','cdp','seo','chatgpt','perplexity','chatbot','storefront','lighthouse','sms','gemini']);
const norm=s=>' '+String(s||'').toLowerCase().replace(/[^a-z0-9/]/g,' ')+' ';   // one character for one, so positions match the text
const aliasRe=a=>new RegExp('(?<=\\s)'+a.toLowerCase().replace(/[^a-z0-9/]+/g,' ').trim().split(' ').map(w=>w.replace(/\//g,'\\/')).join('\\s+')+'(?:s|es)?(?=\\s)','g');
const ALIAS=[];
for(const [pid,arr] of Object.entries(NAMES))for(const a of arr)ALIAS.push({re:aliasRe(a),type:'name',pid,w:2});
for(const [pid,arr] of Object.entries(TOPICS))for(const a of arr)ALIAS.push({re:aliasRe(a),type:'topic',pid,w:a.includes(' ')||STRONG.has(a)?2:1});
for(const [a,label] of UNCOVERED)ALIAS.push({re:aliasRe(a),type:'uncovered',pid:label,w:3});
// 'We will not use Adobe Target', 'instead of Marketo': the client rules the product out
const NEG_VERB=/\b(?:not|never|no longer|don't|do not|won't|will not|doesn't|does not|cannot|can't|isn't|aren't)(?:\s+[a-z']+){0,2}?\s+(?:use|using|want|need|include|including|consider|considering|propose|proposing|implement|implementing|license|licensing|buy|adopt|renew|keep|continue with|move to|go with|require)(?:\s+(?:the|any|a|an|adobe))*\s*$/i;
const NEG_NEAR=/\b(?:instead of|rather than|other than|except|excluding|not)\s+(?:adobe\s+)?$/i;
function negated(raw,at){const before=raw.slice(Math.max(0,at-80),at),cut=Math.max(before.lastIndexOf('.'),before.lastIndexOf(';'),before.lastIndexOf('?'),before.lastIndexOf('!'));const w=before.slice(cut+1);return NEG_VERB.test(w)||NEG_NEAR.test(w);}
function scan(text){
  const raw=String(text||''),t=norm(raw),hits=[];
  for(const A of ALIAS){A.re.lastIndex=0;let m;while((m=A.re.exec(t)))hits.push({a:m.index,b:m.index+m[0].length,type:A.type,pid:A.pid,w:A.w});}
  // Target and Commerce are ordinary words too: the product only capitalised mid-sentence ('connect AEM Sites to Target',
  // 'reach Commerce product pages'), or 'target' beside a personalization or testing word
  const tested=/personali[sz]|a\/b test|\bab test|experiment|recommendation/i.test(raw);
  for(const [word,pid] of [['Target','target'],['Commerce','commerce']]){const re=new RegExp('\\b'+word+'\\b','gi');let m;
    while((m=re.exec(raw))){const before=raw.slice(0,m.index),cap=m[0][0]===word[0],mid=/[a-z0-9,;:)'"\u2019]\s+$/.test(before);
      if(((cap&&mid)||(pid==='target'&&tested))&&!/\be-\s*$/i.test(before))hits.push({a:m.index+1,b:m.index+1+word.length,type:'name',pid,w:2});}}
  hits.sort((x,y)=>(y.b-y.a)-(x.b-x.a)||x.a-y.a);
  const kept=[];for(const h of hits)if(!kept.some(k=>h.a<k.b&&k.a<h.b))kept.push(h);   // the longest words win: 'aem' inside 'AEM Assets' does not count
  for(const h of kept)h.neg=negated(raw,h.a-1);
  return kept;
}
function detectAll(text){
  const named={},topics={},uncovered=[],excluded=new Set();
  const hits=scan(text);
  for(const h of hits){if(h.type==='uncovered'){if(!h.neg&&!uncovered.includes(h.pid))uncovered.push(h.pid);continue;}if(h.neg)excluded.add(h.pid);}
  for(const h of hits){if(h.type==='uncovered'||h.neg||excluded.has(h.pid)||!P[h.pid])continue;const bag=h.type==='name'?named:topics;bag[h.pid]=(bag[h.pid]||0)+h.w;}
  const order=o=>Object.entries(o).sort((x,y)=>y[1]-x[1]).map(x=>x[0]);
  return {named:order(named),topics:order(topics).filter(id=>!named[id]),score:Object.fromEntries(Object.keys(P).map(id=>[id,(named[id]||0)*2+(topics[id]||0)])),topicScore:topics,uncovered,excluded:[...excluded].filter(id=>P[id]).map(id=>P[id].name)};
}
function detect(q){const d=detectAll(q);return [...d.named,...d.topics];}
const STOP=new Set('a an and the of to for in on with our your you we us it its is are be how what which would do does can will should describe provide explain list detail outline please that this these those from by at as or into than then there their they them about any all some more most other such also after before when where who whom need needs needed want wants including include includes use using used'.split(' '));
const stem=w=>w.length>5?w.replace(/(ing|ed|es)$/,'').replace(/ies$/,'y'):w.length>3?w.replace(/s$/,''):w;
const tokens=s=>[...new Set(String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').split(' ').filter(w=>w.length>2&&!STOP.has(w)).map(stem))];
const overlap=(a,b)=>a.filter(x=>b.includes(x)).length;
const ONGOING=/\b(ongoing|after launch|post-launch|monthly|each month|run and operate|support (?:services|model)|managed support|maintenance|optimi[sz]ation services|managed services)\b/i;
const SOLUTION=/\bwhich (?:adobe )?(?:products?|solutions?|tools?|applications?|capabilities)\b|\bwhat (?:adobe )?(?:products?|solutions?|tools?|applications?)\b[^?.]*\b(?:use|recommend|propose)|\brecommend(?:ed)? (?:adobe )?(?:products?|solutions?)\b/i;
const MIGRATE=/\b(?:migrat|move|moving|import|transfer|re-?platform|upgrad)/i,MIGRATE_LINE=/migrat|transfer|move from|upgrade|transition/i;
const SETUP=/\b(?:setup|set up|implement|implementation|instance|onboarding|upgrade|launch|go-live|cutover|hypercare|pipelines)\b/i;
const DURATION=/^how (?:many (?:weeks|months|days|hours)|long)\b|\bhow long\b|\bhow many (?:weeks|months)\b/i;
const GENERIC=new Set(['answer','content','data','site','page','program','review','setup','monthly','service','adobe','web','custom','client','brand','report','plan','work','team','experience','digital','search','ai','connect','connection','setup','existing','new','agreed']);
const nameWords=ids=>{const s=new Set();for(const id of ids)for(const a of [P[id].name,...(NAMES[id]||[])])for(const w of tokens(a))s.add(w);return s;};
const ownerOf=l=>Object.values(P).find(p=>(p.lines||[]).includes(l)||(p.more||[]).includes(l));
function match(text,opts){
  opts=opts||{};const qt=tokens(text),d=detectAll(text),owned=opts.owned||new Set();
  let named=d.named,via='question',forced=null;
  if(opts.pick){named=opts.pick.filter(id=>P[id]);via='pick';}
  else if(!named.length&&opts.context){const c=detectAll(opts.context);named=c.named.filter(id=>!d.excluded.includes(P[id].name));if(named.length)via='context';}
  // Adobe Analytics is not in this catalog: the upgrade to Customer Journey Analytics is the service it covers
  if(!opts.pick&&d.uncovered.includes('Adobe Analytics')&&!named.includes('cja')){named=['cja',...named];forced=['CJ03'];}
  const ongoing=ONGOING.test(text);let fromContext=false,prods=named.slice();
  if(!opts.pick){   // topic words: a second product through a documented connection, or the products when the question asks which to use
    const solutioning=SOLUTION.test(text),approach=!F.factShaped(text),namedAdobe=named.filter(id=>!P[id].outside);   // the client's own system (WordPress, Snowflake) is not an Adobe product
    for(const id of d.topics){if(prods.includes(id))continue;
      if(prods.length&&prods.length<4&&C.some(c=>(c.a===id&&prods.includes(c.b))||(c.b===id&&prods.includes(c.a))))prods.push(id);
      else if(!namedAdobe.length&&!P[id].outside&&prods.filter(x=>!P[x].outside).length<3&&(solutioning||(approach&&d.topicScore[id]>=2))){prods.push(id);via='topic';}
    }
  }
  if(!prods.length){
    if(ongoing&&opts.ctx&&opts.ctx.length){prods=opts.ctx.slice(0,5);fromContext=true;}
    else return {products:[],conn:null,conns:[],missing:[],lines:[],fromContext:false,via,uncovered:d.uncovered,excluded:d.excluded};
  }
  // the connections between the products, the pair the question names most strongly first
  const sc=id=>d.score[id]||0;
  const conns=fromContext?[]:C.filter(c=>prods.includes(c.a)&&prods.includes(c.b)).map(c=>({c,s:sc(c.a)+sc(c.b),o:overlap(qt,tokens((c.label||'')+' '+(c.how||'')+' '+((c.gain||{}).text||'')))})).sort((x,y)=>y.s-x.s||y.o-x.o).map(x=>x.c);
  const conn=conns[0]||null,adobe=prods.filter(id=>!P[id].outside);
  const missing=[];if(adobe.length>2)for(let i=0;i<adobe.length;i++)for(let j=i+1;j<adobe.length;j++)if(!conns.some(c=>[c.a,c.b].includes(adobe[i])&&[c.a,c.b].includes(adobe[j])))missing.push(P[adobe[i]].name+' and '+P[adobe[j]].name);
  // the words of the products the question itself names are not evidence for a line ('analytics' in Customer Journey
  // Analytics does not ask for the Adobe Analytics upgrade); words of a product found only by its topic still are
  const owners=[...adobe.map(id=>P[id]),...conns],nameW=nameWords(d.named.filter(id=>prods.includes(id))),migrate=MIGRATE.test(text);
  const hasMonthly=owners.some(o=>[...(o.lines||[]),...(o.more||[])].some(l=>LN[l]&&LN[l].unit==='monthly'));
  const seen=new Set(),cands=[];
  for(const o of owners){const isConn='a' in o;for(const l of [...(o.lines||[]),...(o.more||[])]){if(seen.has(l)||!LN[l])continue;seen.add(l);
    const L=LN[l],isDefault=(o.lines||[]).includes(l),monthly=L.unit==='monthly';
    if(forced&&!forced.includes(l))continue;
    if((fromContext||(ongoing&&hasMonthly))&&!monthly)continue;                 // an ongoing-services question wants the monthly lines
    if(!isConn&&owned.has(o.id)&&SETUP.test(L.name))continue;                    // the client already runs it: no setup, upgrade or launch line
    const nameT=tokens(L.name).filter(w=>!nameW.has(w)),nameHit=overlap(qt,nameT.filter(w=>!GENERIC.has(w)));
    const hit=overlap(qt,nameT)*2+overlap(qt,tokens(L.scope||(TPL[l]||{}).scope||'').filter(w=>!nameW.has(w)&&!(conn&&GENERIC.has(w))));   // beside a connection, common words in a scope prove nothing
    const mig=migrate&&MIGRATE_LINE.test(L.name);
    let s=hit+(isConn?3:0)+(isDefault?2:0)+(mig?4:0);
    if(!isDefault&&(hit<3||!nameHit)&&!mig)s=-1;                                // an optional line needs a distinctive word of its own name in the question
    if(conn&&!isConn&&!nameHit&&!mig)s=-1;                                       // beside a matched connection, a product's own line needs one too
    if(forced)s=10;
    cands.push({id:l,s,hit,isDefault});}}
  cands.sort((x,y)=>y.s-x.s);
  let lines=cands.filter(x=>x.s>0&&(x.hit>0||x.isDefault||forced)).slice(0,fromContext?5:adobe.length>2?6:4).map(x=>x.id);
  if(!lines.length&&!fromContext&&via!=='topic'){const o=conn||adobe.map(id=>P[id]).find(p=>(p.lines||[]).length&&!owned.has(p.id));if(o)lines=(o.lines||[]).slice(0,2);}
  return {products:prods,conn,conns,missing,lines,fromContext,via,uncovered:d.uncovered,excluded:d.excluded,forced:!!forced};
}

/* ---------- the partner's words to the client */
// Step 53: the pronoun swap also handles the partner as an object ("by the partner" becomes "by us"), the partner
// compounds ("partner-managed"), "you and your client", "Client-provided" and "Client authorization", and the verb
// lists cover does, authorizes, authors and the other verbs the catalog uses.
const YOU_VERBS='has|is|does|confirms|provides|approves|names|supplies|grants|manages|installs|shares|agrees|owns|runs|keeps|reviews|signs|sets|adds|licenses|needs|holds|pays|picks|decides|gives|sends|forwards|turns|enables|accepts|appoints|authorizes|authors|assigns|publishes|uses|checks|tests|configures|selects|chooses|maintains|operates|hosts|exports|imports|delegates|defines|tracks|reports|wants|allocates|forwards|supports|accepts|reads|writes|edits|records|stores|collects|keeps|retains|deletes|controls|governs|nominates|designates|identifies|lists|tells|lets|allows|permits|issues|requests|raises|opens|books|schedules|attends|completes|finishes|signs|makes|takes|brings|puts|places|points|routes|pays';
const WE_VERBS='does|confirms|checks|builds|sets|validates|documents|tests|installs|configures|maps|keeps|reviews|prepares|publishes|runs|flags|routes|starts|agrees|authorizes|authors|assigns|creates|adds|uses|enables|loads|imports|exports|migrates|delivers|trains|connects|activates|provides|names|shares|hands|measures|tracks|reports|designs|holds|signs|pays|supplies|approves|grants|manages|owns|plans|writes|reads|records|stores|collects|defines|identifies|lists|makes|takes|brings|puts|places|points|completes|finishes|raises|opens|books|schedules|registers|deploys|ships|monitors|reconciles|rebuilds|extracts|models|labels|tags|applies|replaces|moves|cleans|wires|secures|sizes|ranks|gathers|compares|guides|coaches|converts|describes|computes|proposes|enriches|stands|carries|prints|styles|fits|indexes|surfaces|automates|simplifies|trims|fixes|teaches|engages|retires|operates|maintains|hosts|generates|responds|resolves|govern|turns|gives|sends|forwards|picks|decides|needs';
const conj=v=>({has:'have',is:'are',does:'do'}[v]||singular(v));
function rfp(t){
  return String(t||'')
    .replace(/\byou and your client\b/gi,'we and you')
    .replace(/\bYour client's\b/g,'Your').replace(/\byour client's\b/g,'your').replace(/\bYour client\b/g,'You').replace(/\byour client\b/g,'you')
    .replace(/\b([Tt]he )?Client-provided\b/g,(m,t)=>(t&&t[0]==='T'?'Your':'your')).replace(/\bClient authorization\b/g,'your authorization')
    .replace(/\b([Tt]he )?Client-(\w+)/g,(m,t,w)=>(t&&t[0]==='T'?'Your ':'your ')+w)
    .replace(/\bone your\b/g,'your')
    .replace(/\bThe Client's\b(?! ID| Secret)/g,'Your').replace(/\bthe Client's\b(?! ID| Secret)/g,'your').replace(/\bThe Client\b(?! ID| Secret)/g,'You').replace(/\bthe Client\b(?! ID| Secret)/g,'you')
    .replace(/\bnamed Client (reviewers?|approvers?|owners?)\b/g,'your named $1').replace(/\bone Client review\b/g,'one review with you').replace(/\band Client agree\b/g,'and you agree')
    .replace(/\bClient (reviewers?|review|approvers?|approval|team|owners?|stakeholders?|administrators?|admins?|users?)\b/g,'your $1')
    .replace(/\b(of|with|by|for|to|between|from|across|and|or|than|like|through|at|on|in|among|including|against) the partner\b/g,'$1 us').replace(/, the partner\b/g,', us')
    .replace(/\bThe partner's\b/g,'Our').replace(/\bthe partner's\b/g,'our').replace(/\bThe partner\b/g,'We').replace(/\bthe partner\b/g,'we').replace(/\bPartners\b/g,'We')
    .replace(/\bpartner-(?:built|designed|managed|written|led|run|owned|created|developed|maintained|operated|delivered)\b/gi,'our').replace(/\b([Aa])n? our\b/g,(m,a)=>a==='A'?'Our':'our')
    .replace(new RegExp('\\b([Yy]ou) ('+YOU_VERBS+')\\b','g'),(m,y,v)=>y+' '+conj(v))
    .replace(new RegExp('\\b([Ww]e) ('+WE_VERBS+')\\b','g'),(m,w,v)=>w+' '+conj(v))
    .replace(new RegExp('\\b([Ww]e|[Yy]ou)\\b([^.;:]*?) and ('+WE_VERBS+'|'+YOU_VERBS+')\\b','g'),(m,w,mid,v)=>w+mid+' and '+conj(v));
}
function singular(v){if(/ies$/.test(v))return v.replace(/ies$/,'y');if(/(sh|ch|x|ss)es$/.test(v))return v.replace(/es$/,'');return v.replace(/s$/,'');}
// the partner's own note speaks to the partner: "the Client" is "your client" there (step 54, finding 6.4)
function partnerVoice(t){return String(t||'').replace(/\bThe Client's\b(?! ID| Secret)/g,"Your client's").replace(/\bthe Client's\b(?! ID| Secret)/g,"your client's").replace(/\bThe Client\b(?! ID| Secret)/g,'Your client').replace(/\bthe Client\b(?! ID| Secret)/g,'your client').replace(/\bClient (reviewers?|approvers?|owners?|team|administrators?|admins?|users?)\b/g,"your client's $1");}
const lc=s=>s?s[0].toLowerCase()+s.slice(1):s;
const listOf=a=>a.length>1?a.slice(0,-1).join(', ')+' and '+a[a.length-1]:a[0]||'';
// Step 53: a scope that opens with a setting clause ("Where ..., set up", "For the agreed accounts (...), authorize",
// "Using the agreed route, check", "In Cloud Manager, set up") keeps the clause and takes "we will" after it.
const CLAUSE=/^(where|if|for|when|once|after|with|in|using|before|during|through|on|at|within|from|under|across|as|while|unless|until|whenever|wherever)\b/i;
const NOT_VERB=/^(?:a|an|the|your|our|we|you|us|it|its|they|their|them|this|that|these|those|each|all|any|some|no|not|and|or|but|is|are|was|were)\b/i;
function splitClause(scope){
  if(!CLAUSE.test(scope))return null;
  let depth=0;
  for(let i=0;i<Math.min(scope.length,220);i++){const c=scope[i];
    if(c==='(')depth++;else if(c===')')depth=Math.max(0,depth-1);
    else if((c===','||c===':')&&depth===0){const head=scope.slice(0,i),rest=scope.slice(i+1).trim();
      if(rest&&!NOT_VERB.test(rest)&&head.split(/\s+/).length>=2)return [head,rest];   // 'For a CDN without a guide, or logs in a log store: build' keeps looking past 'or'
      if(c===':')return null;}}
  return null;
}
function doLine(id){const L=LN[id],scope=rfp(L.scope||(TPL[id]||{}).scope||L.name);
  let m=/^each month,?\s+(.*)$/i.exec(scope);if(m)return 'Each month we will '+lc(m[1]);
  const cl=splitClause(scope);if(cl)return cl[0]+', we will '+lc(cl[1]);
  return 'We will '+lc(scope);}
// every drafted line's own page first, then the lines' references, then the connections' sources (step 52)
function sources(m){const out=[],seen=new Set();const add=(url,title)=>{if(!url||seen.has(url))return;seen.add(url);out.push({url,title:title||url});};
  for(const id of m.lines){const L=LN[id];add(L.url,L.src);}
  for(const id of m.lines)for(const r of (LN[id].references||[]))add(r.url,r.title);
  for(const c of (m.conns&&m.conns.length?m.conns:m.conn?[m.conn]:[])){if(c.source)add(c.source.url,c.source.title);for(const f of (c.flows||[]))if(f.source)add(f.source.url,f.source.title);}
  return out.slice(0,Math.max(6,m.lines.length));}
// The capability box: what a fact question names and where Adobe answers it (step 52)
const TRUST={url:'https://www.adobe.com/trust.html',title:'Adobe Trust Center'};
const BC_SECURITY={url:'https://www.adobe.com/trust/resources/ungated/adobe-brand-concierge-security-overview.html',title:'Adobe Trust Center: Adobe Brand Concierge Security Overview'};
const SECURITY=/\b(?:host|hosted|hosting|data cent(?:er|re)|residency|region|encrypt|certif|complian|soc ?2|iso ?27001|hipaa|gdpr|pci|fedramp|sso|saml|single sign-on|okta|security|secure|uptime|sla|availability|disaster recovery|backup|retention|penetration|vulnerab|privacy)/i;
const FACT_TOPIC=/\b(?:hosted|hosting|data cent(?:er|re)|data residency|encrypt|certif|compliant|compliance|wcag|soc ?2|iso ?27001|hipaa|gdpr|pci|fedramp|sso|saml|single sign-on|okta|uptime|sla|rto|rpo|disaster recovery|backup|retention|penetration test|languages?|concurrent)\b/i;
function capLinks(text,prods){const out=[];if(SECURITY.test(text)||!prods.length)out.push(TRUST);if(prods.includes('bc')&&SECURITY.test(text))out.push(BC_SECURITY);
  for(const id of prods){const p=P[id];if(!p||p.outside)continue;const l=[...(p.lines||[]),...(p.more||[])].find(x=>LN[x]&&LN[x].url);if(l&&!out.some(o=>o.url===LN[l].url))out.push({url:LN[l].url,title:LN[l].src||p.name});}
  return out;}
function compose(q,ctx){
  if(!q||q.kind!=='adobe')return null;                                         // To sort and Your firm questions are never drafted
  const text=q.text,owned=ownedProducts(),context=[q.context,q.section].filter(Boolean).join(' ');
  const extra={firmPart:q.firmPart||'',requirement:!!q.requirement};
  if(F.factShaped(text)||(q.requirement&&FACT_TOPIC.test(text))){              // a yes/no or fact question: no build plan
    const d=detectAll(text),prods=(q.pick||(d.named.length?d.named:detectAll(context).named)).filter(id=>P[id]);
    return Object.assign({capability:true,m:{products:prods,conn:null,conns:[],missing:[],lines:[],fromContext:false},sections:[],sources:[],links:capLinks(text,prods),sells:[],asks:[],uncovered:d.uncovered.length?d.uncovered:null,excluded:d.excluded.length?d.excluded:null},extra);
  }
  const m=match(text,{context,ctx:ctx||contextProducts(),pick:q.pick,owned});
  if(!m.lines.length){
    if(m.uncovered.length&&!m.products.filter(id=>!P[id].outside).length)return Object.assign({uncovered:m.uncovered,m:Object.assign({},m,{products:[]}),sections:[],sources:[],links:[],sells:[],asks:[],excluded:m.excluded.length?m.excluded:null},extra);
    return null;                                                               // no line found: No match, never one empty sentence
  }
  const lineOwner=Object.fromEntries(m.lines.map(l=>[l,ownerOf(l)]));
  const names=m.products.filter(id=>!P[id].outside||(m.conn&&[m.conn.a,m.conn.b].includes(id))).map(id=>P[id].name);
  const approach=[],lead=q.requirement?'We would meet this by using ':'We would deliver this with ';
  if(m.conn){
    if(q.requirement)approach.push(lead+listOf([P[m.conn.a].name,P[m.conn.b].name])+'.');
    // step 53: the client-voice how and gain written for the response, where the catalog has them; the partner's card text otherwise
    approach.push(m.conn.sowHow?rfp(m.conn.sowHow):rfp(m.conn.how||''));
    if(m.conn.sowGain)approach.push(rfp(m.conn.sowGain));else if(!m.conn.sowHow&&m.conn.gain&&m.conn.gain.text)approach.push(rfp(m.conn.gain.text));
    const more=m.conns.slice(1,4).map(c=>P[c.a].name+' and '+P[c.b].name);
    if(more.length)approach.push('The proposal also uses the documented connection'+(more.length>1?'s':'')+' between '+more.join(', and between ')+'.');
  }
  else if(m.fromContext){const monthly=[...new Set(m.lines.map(l=>lineOwner[l]).filter(Boolean).map(p=>p.name))];approach.push('After launch, across the Adobe products in this proposal, our ongoing services for '+listOf(monthly)+' are these.');}
  else approach.push(lead+listOf(names)+'.');
  const work=m.lines.filter(id=>LN[id].unit!=='monthly').map(doLine),after=m.lines.filter(id=>LN[id].unit==='monthly').map(doLine);
  const sections=[['Our approach',approach.filter(Boolean)],['What we would do',work],['After launch',after]].filter(s=>s[1].length);
  if(DURATION.test(text)&&work.length){const hours=m.lines.filter(id=>LN[id].unit!=='monthly').reduce((n,id)=>n+(Number(LN[id].base)||0),0);
    sections.push(['Our planning estimate',['About '+hours.toLocaleString('en-US')+' hours of our work for the services above, at a typical size. We would confirm the schedule with you once the scope is agreed.']]);}
  // Nov 9 (Adam): the prerequisites are not part of the answer to the client. They become a note for the partner.
  // Step 54 (Nov 10, Adam's decision 1): four lists, no cap, and the matched lines' own requirements too. The asks carry
  // a tick box; the ticked ones go into the response as "What we would need from you", a typed fact moves its item to
  // "What you already have in place".
  const n=noteItems(m,owned);
  return Object.assign({m,sections,sources:sources(m),sells:n.sells,asks:n.asks,confirm:n.confirm,assumptions:n.assumptions,uncovered:m.uncovered.length?m.uncovered:null,excluded:m.excluded.length?m.excluded:null},extra);
}
const LICENSE=/\b(paid|licen[cs]es?d?|subscription|offering|offer|sku|entitlement|edition|package|add-on|trial|for teams)\b/i;
// what only Adobe can do or confirm: provisioning, onboarding, enabling an integration, a route Adobe does not document
const ADOBE_DOES=/\b(?:by Adobe\b|Adobe(?:'s)? (?:support|onboarding|account|professional services|sales|engineering) team\b|Adobe's (?:support|onboarding|professional services|account team)\b|Adobe Support\b|provisioned by Adobe|through (?:the |an? )?(?:Adobe )?(?:account team|sales representative|support ticket)|confirm(?:ed|s)?(?: \w+){0,4} with Adobe|Adobe confirms|Adobe does not document|which Adobe does not|not document(?:ed)?\b|Adobe says|Adobe states|Adobe marks|Adobe's direction|co-innovation|One Adobe lab|AEM Engineering|enabled by Adobe|Adobe enablement is|Adobe turns on|Adobe has turned on|written confirmation from Adobe|Adobe's written confirmation)/i;
// a statement of scope or exclusion, not something to ask the client for
const ASSUMPTION=/\btraining scope\b|\bnot an? (?:software|Adobe|seat) (?:seat )?limit\b|\bnot supported\b|\bstays? unchanged\b|\bboundary\b|\bdoes not list\b|\bis reused\b|\b(?:is|are) measured with\b|\bno native\b|\bno pre-built\b|\bnot acceptance requirements\b|\bisn't charged again\b|\bnot charged again\b|\bcannot change after\b|\breports? to one source only\b|\bis (?:a |an )?(?:separate|separately) \w+ work\b|\bwould be separate work\b|\bis out of scope\b|\bare out of scope\b|\bonly where\b.*\bis confirmed\b|\bno (?:[a-z]+ )?connector is assumed\b|\bis included here once\b|\b(?:is|are) built and tested\b|\bpermissions apply\b|\bactions are supported\b/i;
const ASKSHAPE=/\b(?:you|your|client|user|users|admin|administrator|owner|reviewer|approver|access|licen[cs]e|approv|provide|suppl|grant|name[sd]?\b|forward|enable|turn(?:ed|s)? on|connected|installed|set up|entitlement|headroom|permission|credential|token|sign-?in|account|contact|allocated|assign)/i;
function noteItems(m,owned){
  const inAnswer=[...m.products,...(m.conn?[m.conn.a,m.conn.b]:[])];
  const sells=[],asks=[],confirm=[],assumptions=[],seen=new Set();
  const push=(list,t)=>{t=String(t||'').trim();if(!t||seen.has(t.toLowerCase()))return;seen.add(t.toLowerCase());list.push(t);};
  const place=n=>{const about=detect(n).filter(id=>inAnswer.includes(id));
    if(LICENSE.test(n)&&about.length&&about.some(id=>!owned.has(id)))return push(sells,n);
    if(ADOBE_DOES.test(n))return push(confirm,n);
    if(ASSUMPTION.test(n)&&!(/^(?:your|the client|a |an )/i.test(n)&&ASKSHAPE.test(n)&&!/\btraining scope|not an? (?:software|Adobe|seat)/i.test(n)))return push(assumptions,n);
    if(LICENSE.test(n)&&about.length)return push(assumptions,'Already in place per the RFP: '+n);
    push(asks,n);};
  if(m.conn){
    for(const p of (m.conn.prereqs||[]))place(p);                                   // every prerequisite, no cap
    if(m.conn.sowNote)push(confirm,m.conn.sowNote);                                 // the caution the client-voice text leaves out
    const avail=m.conn.sowAvailability||m.conn.availability;if(avail)push(assumptions,'Availability: '+String(avail).replace(/\.?$/,'.'));
  }
  for(const id of m.lines){const L=LN[id];                                           // each matched line's own requirements
    if(L.ext){const about=detect(L.ext).filter(x=>!owned.has(x));(about.length?push(sells,'Also needs '+L.ext.replace(/\.?$/,'')+', licensed separately.'):push(assumptions,'Also needs '+L.ext.replace(/\.?$/,'.')));}
    if(L.tier){const about=detect(L.tier).filter(x=>P[x]&&!P[x].outside),who=about.length?P[about[0]].name:(ownerOf(id)||{}).name||(m.conn?P[m.conn.a].name+' or '+P[m.conn.b].name:'Adobe');
      push(asks,'Your '+who+' package: '+L.tier.replace(/\.?$/,'')+'.');}
    if(!m.conn){const a=(TPL[id]||{}).assumptions||(CON[id]||{}).assumptions||'';for(const s of a.split(/(?<=\.)\s+/))if(s.trim())place(s.trim());}}
  return {sells,asks,confirm,assumptions};
}
// a short subject for an ask, so a typed fact reads "CDN access logs: Akamai serves both sites" (finding 6.5)
const SUBJ_STOP=/\s+(?:forwarded|who|that|which|with|for|in|on|to|from|at|by|enabled|set|configured|provisioned|licensed|connected|added|turned|granted|approved|installed|through|and|as|so|where|when|if|before|after|under|via|per|carry|carries|need|needs|must|has|have|is|are|includes|holds|approve|approves|sent|back|out)\b|[,;:(]/i;
function subjectOf(t){let s=String(t||'').replace(/^(?:a|an|the|your client's|your|our)\s+/i,'').trim();
  const i=s.search(SUBJ_STOP);if(i>0)s=s.slice(0,i);
  const w=s.trim().split(/\s+/);if(w.length>7)s=w.slice(0,7).join(' ');
  s=s.replace(/[.;,:]+$/,'').trim();return s||String(t||'').split(/\s+/).slice(0,4).join(' ');}
const ticked=(q,i)=>!(q&&q.ticks&&q.ticks[i]===false);
const factOf=(q,i)=>q&&q.facts?String(q.facts[i]||'').trim():'';
// The products the RFP says the client already has, read from every paragraph of the RFP, headings and background
// included ('our Customer Journey Analytics data', 'The bank licensed Brand Visibility', 'runs Marketo Engage').
// Only product names count, never a topic word ('our new site' is not Edge Delivery).
const OWNS=/(?:\b(?:our|existing|current|incumbent)\s+(?:[a-z]+\s+)?|\b(?:already|currently|today)\s+(?:use|uses|run|runs|have|has|own|owns|license|licenses)\s+|\b(?:licensed|licenses|has licensed|have licensed|subscribes to|subscribe to)\s+|\b(?:runs|run|is|are|built|hosted|sits?|lives?|stored)\s+(?:on|in)\s+|\b(?:runs|uses)\s+|\b(?:we|they)\s+(?:use|run|own|have)\s+)(?:adobe\s+)?$/i;
const OWNS_AFTER=/^\s*(?:customers?|licensee|instance|subscription)\b/i;
function ownedProducts(){
  if(rfpState.owned)return rfpState.owned;const s=new Set();
  const paras=rfpState.paragraphs&&rfpState.paragraphs.length?rfpState.paragraphs:rfpState.questions.map(q=>q.text);
  for(const p of paras){const raw=String(p);for(const h of scan(raw)){if(h.type!=='name'||h.neg||!P[h.pid]||P[h.pid].outside)continue;
    const before=raw.slice(Math.max(0,h.a-1-40),h.a-1),after=raw.slice(h.b-1,h.b-1+20);
    if(OWNS.test(before)||(/\b(?:an?|existing)\s+(?:adobe\s+)?$/i.test(before)&&OWNS_AFTER.test(after)))s.add(h.pid);}}
  rfpState.owned=s;return s;}
// the partner's own note under the draft, in four lists (step 54): licenses, asks with tick boxes, confirm with Adobe,
// assumptions. Nothing in it reaches the downloads except what the partner ticks or types.
const INTERNAL='Internal. Nothing in this box goes into the downloads, except what you tick or type.';
function badgeHTML(q,i){const f=factOf(q,i);if(f)return '<span class="rfp-badge">Answered by your note below</span>';return ticked(q,i)?'<span class="rfp-badge">In the response</span>':'<span class="rfp-badge off">Not in the response</span>';}
function noteHTML(d,q){
  if(!d)return '';
  const extra=[],confirm=[...(d.confirm||[])];
  if(d.excluded)extra.push('Your client rules out '+listOf(d.excluded)+', so the draft leaves '+(d.excluded.length>1?'them':'it')+' out.');
  if(d.uncovered&&d.m&&d.m.lines.length)extra.push(d.m.forced?'Adobe Analytics is not in this catalog; the draft proposes the upgrade to Customer Journey Analytics.':'Not in this catalog: '+listOf(d.uncovered)+'. Check Adobe\'s pages before you answer for '+(d.uncovered.length>1?'them':'it')+'.');
  if(d.m&&d.m.missing&&d.m.missing.length)confirm.push('This catalog documents no connection between '+d.m.missing.join(', or between ')+'. Say how they work together in your own words, or confirm it with Adobe.');
  const asks=d.asks||[],sells=d.sells||[],assumptions=d.assumptions||[];
  if(!sells.length&&!asks.length&&!confirm.length&&!assumptions.length&&!extra.length)return '';
  return '<div class="rfp-partner-note"><h4>Notes for you, not for the client</h4><p class="rfp-internal">'+INTERNAL+'</p>'+
    (q&&q.answer?'<p class="rfp-edited">You edited this answer, so ticks and what you type here no longer change it. Edit it again to add them.</p>':'')+
    extra.map(x=>'<p>'+esc(x)+'</p>').join('')+
    (sells.length?'<p>Adobe licenses this proposal includes (Adobe quotes them):</p><ul class="rfp-sells">'+sells.map(x=>'<li>'+esc(partnerVoice(x))+'</li>').join('')+'</ul>':'')+
    (asks.length?'<p>Ask your client. Ticked items go into the response as "What we would need from you". Type what your client told you and the item moves to "What you already have in place".</p><ul class="rfp-asks">'+
      asks.map((x,i)=>'<li><label><input type="checkbox" class="rfp-tick" data-i="'+i+'"'+(ticked(q,i)&&!factOf(q,i)?' checked':'')+(factOf(q,i)?' disabled':'')+'><span>'+esc(partnerVoice(x))+' '+badgeHTML(q,i)+'</span></label><textarea class="rfp-fact" data-i="'+i+'" rows="2" placeholder="What your client told you" aria-label="What your client told you about: '+esc(partnerVoice(x))+'">'+esc(factOf(q,i))+'</textarea></li>').join('')+'</ul>':'')+
    (confirm.length?'<p>Confirm with Adobe:</p><ul class="rfp-confirm">'+confirm.map(x=>'<li>'+esc(partnerVoice(x))+'</li>').join('')+'</ul>':'')+
    (assumptions.length?'<p>Assumptions behind this answer:</p><ul class="rfp-assume">'+assumptions.map(x=>'<li>'+esc(partnerVoice(x))+'</li>').join('')+'</ul>':'')+'</div>';
}
// What the partner typed under an ask joins the response as "What you already have in place, as confirmed with your
// team", each line led by the ask's subject; the ticked asks without a note join as "What we would need from you".
const HAVE='What you already have in place, as confirmed with your team',NEED='What we would need from you';
function facts(q,d){const out=[];if(!q||!q.facts)return out;const asks=(d&&d.asks)||[];
  for(const i of Object.keys(q.facts).sort((a,b)=>a-b)){const f=factOf(q,i);if(!f)continue;const subj=asks[i]?subjectOf(rfp(asks[i])):'';
    out.push(subj&&!f.toLowerCase().startsWith(subj.toLowerCase())?subj+': '+f:f);}
  return out;}
function needs(q,d){const out=[];for(const [i,a] of ((d&&d.asks)||[]).entries())if(ticked(q,i)&&!factOf(q,i))out.push(rfp(a).replace(/\.?$/,'.'));return out;}
const sectionsOf=(d,q)=>{const f=facts(q,d),n=needs(q,d);return [...d.sections,...(f.length?[[HAVE,f]]:[]),...(n.length?[[NEED,n]]:[])];};
const SRC_HEAD='Adobe sources for the product facts above';
function plain(d,q){return sectionsOf(d,q).map(([h,items])=>h+'\n'+items.map(x=>'- '+x).join('\n')).join('\n\n')+(d.sources.length?'\n\n'+SRC_HEAD+'\n'+d.sources.map(s=>'- '+s.title+': '+s.url).join('\n'):'');}
function answerHTML(d,q){return sectionsOf(d,q).map(([h,items])=>'<h4>'+esc(h)+'</h4>'+(items.length===1&&h==='Our approach'?'<p>'+esc(items[0])+'</p>':'<ul>'+items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>')).join('')+(d.sources.length?'<h4>'+SRC_HEAD+'</h4><ul class="rfp-sources">'+d.sources.map(s=>'<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener">'+esc(s.title)+'</a></li>').join('')+'</ul>':'');}

/* ---------- the answer panel */
const rfpState=R.state;let editing=false;
function contextProducts(){const c={};for(const q of rfpState.questions){if(q.kind!=='adobe')continue;for(const id of detectAll(q.text).named)c[id]=(c[id]||0)+1;}return Object.entries(c).sort((x,y)=>y[1]-x[1]).map(x=>x[0]).filter(id=>!P[id].outside);}
function current(){const i=rfpState.selected;return Number.isInteger(i)?rfpState.questions[i]:null;}
// Drawn from: the partner can take a product out or add one, and the answer is drafted again (step 52)
function chipsHTML(q,d){
  const prods=d&&d.m?d.m.products:(q.pick||[]);
  const conns=d&&d.m&&d.m.conn?[d.m.conn]:[];
  const add='<select class="rfp-add" id="rfp-add" aria-label="Add a product to draw from"><option value="">+ Add a product</option>'+CAT.products.filter(p=>!prods.includes(p.id)).map(p=>'<option value="'+p.id+'">'+esc(p.name+(p.outside?' (outside Adobe)':''))+'</option>').join('')+'</select>';
  return '<p class="rfp-drawn">Drawn from: '+prods.map(id=>'<span class="rfp-chip">'+esc(P[id].name)+'<button type="button" data-rm="'+id+'" aria-label="Take '+esc(P[id].name)+' out of this answer">\u00d7</button></span>').join('')+conns.map(c=>'<span class="rfp-chip conn">'+esc(P[c.a].name+' + '+P[c.b].name)+'</span>').join('')+add+'</p>';
}
function capHTML(d){
  if(d.capability)return '<div class="rfp-cap"><h4>A capability question, not answered from this catalog</h4><p>This catalog describes services and the documented connections between Adobe products. It does not hold product facts such as hosting, security, compliance, languages or limits, so it drafts nothing here rather than a build plan. Check Adobe\'s pages and write the answer yourself:</p><ul>'+d.links.map(s=>'<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener">'+esc(s.title)+'</a></li>').join('')+'</ul></div>';
  return '<div class="rfp-cap"><h4>Not in this catalog</h4><p>'+esc(listOf(d.uncovered))+(d.uncovered.length>1?' are':' is')+' an Adobe product this catalog does not cover, so it drafts nothing here rather than an answer about another product. Check Adobe\'s pages and write the answer yourself.</p></div>';
}
function whyNone(q){const d=detectAll(q.text);let out=d.excluded.length?'Your client rules out '+listOf(d.excluded)+', so nothing is drafted from '+(d.excluded.length>1?'them':'it')+'. ':'';
  // a documented connection with no services behind it (Journey Optimizer + Brand Concierge): the partner learns what Adobe says
  for(const c of C)if(d.named.includes(c.a)&&d.named.includes(c.b)&&![...(c.lines||[]),...(c.more||[])].some(l=>LN[l])){const why=c.sowNote||c.availability||'';out+='Experience League lists no services for '+P[c.a].name+' + '+P[c.b].name+(why?': '+partnerVoice(why).replace(/\.?$/,'.'):'.')+' ';}
  return out;}
function renderAnswer(){
  const box=$r('rfp-answer');if(!box)return;const q=current();
  if(!q){box.innerHTML='<p class="hint">Pick a question on the left to see its drafted answer.</p>';return;}
  const head='<h3>'+(q.label?'<b>'+esc(q.label)+'</b> ':'')+esc(q.text)+'</h3>';
  if(q.kind==='unsure'){box.innerHTML=head+'<p class="rfp-note">Sort this question first: choose Adobe products or Your firm in the menu on its row. Questions in To sort are not drafted, counted or downloaded with a draft.</p>'+nav();return;}
  if(q.kind==='firm'){box.innerHTML=head+(q.status==='used'?'<span class="rfp-state ok">Used</span>':'')+'<p class="rfp-note">This one is about your firm, so it is yours to write. Type it here and it goes into the downloaded response in place of the blank.</p>'+
    '<textarea id="rfp-firm" rows="7" placeholder="Your answer" aria-label="Your answer">'+esc(q.answer||'')+'</textarea><div class="rfp-actions"><button type="button" class="primary" id="rfp-firm-use">Use this answer</button>'+nav()+'</div>';return;}
  if(!q.draft)q.draft=compose(q);
  if(!q.draft){box.innerHTML=head+chipsHTML(q,null)+'<p class="rfp-note">No match in the catalog for this question. '+esc(whyNone(q))+'Answer it yourself, add a product above to draw from, or move it to Your firm. The questions this tool answers are about Adobe products, their connections and the services around them.</p>'+nav();return;}
  const d=q.draft,state=q.status==='used'?'<span class="rfp-state ok">Used</span>':q.status==='skipped'?'<span class="rfp-state">Skipped</span>':'';
  if(!d.m.lines.length){   // the capability box, or a product this catalog does not cover: the partner writes the answer
    box.innerHTML=head+state+chipsHTML(q,d)+capHTML(d)+noteHTML(d,q)+'<textarea id="rfp-firm" rows="6" placeholder="Your answer" aria-label="Your answer">'+esc(q.answer||'')+'</textarea><div class="rfp-actions"><button type="button" class="primary" id="rfp-firm-use">Use this answer</button>'+nav()+'</div>';return;}
  if(editing){box.innerHTML=head+state+'<textarea id="rfp-edit" rows="16" aria-label="Edit the answer">'+esc(q.answer||plain(d,q))+'</textarea><div class="rfp-actions"><button type="button" class="primary" id="rfp-save-edit">Save and use</button><button type="button" id="rfp-cancel-edit">Cancel</button></div>';return;}
  const body='<div id="rfp-body">'+(q.answer?'<pre class="rfp-plain">'+esc(q.answer)+'</pre>':answerHTML(d,q))+'</div>';
  const firmPart=d.firmPart?'<div class="rfp-firm-part"><h4>Your part to write</h4><p>This question also asks for '+esc(d.firmPart)+'. The catalog does not answer that part: add it with Edit before you use the answer.</p></div>':'';
  box.innerHTML=head+state+chipsHTML(q,d)+'<p class="rfp-voice">Your response to the client</p>'+body+firmPart+noteHTML(d,q)+
    '<div class="rfp-actions"><button type="button" class="primary" id="rfp-use">'+(q.status==='used'?'Used, keep it':'Use this answer')+'</button><button type="button" id="rfp-edit-btn">Edit</button><button type="button" id="rfp-skip">Skip</button>'+nav()+'</div>';
}
function redraft(q,pick){q.pick=pick;delete q.draft;editing=false;q.draft=compose(q);R.renderList();renderAnswer();summary();}
function nav(){return '<button type="button" id="rfp-next">Next question</button>';}
function select(i){rfpState.selected=i;editing=false;R.renderList();renderAnswer();}
function next(){const qs=rfpState.questions;const from=Number.isInteger(rfpState.selected)?rfpState.selected:-1;
  for(let k=1;k<=qs.length;k++){const i=(from+k)%qs.length;if(qs[i].kind==='adobe'&&!qs[i].status){select(i);return;}}
  for(let k=1;k<=qs.length;k++){const i=(from+k)%qs.length;if(qs[i].kind==='adobe'){select(i);return;}}}
function summary(){
  const el=$r('rfp-summary');if(!el)return;const qs=rfpState.questions;if(!qs.length){el.hidden=true;return;}
  const adobe=qs.filter(q=>q.kind==='adobe'),used=adobe.filter(q=>q.status==='used'),lines=selectedLineIds();
  el.hidden=false;
  const firm=qs.filter(q=>q.kind==='firm'),written=firm.filter(q=>q.status==='used'),wb=writable();
  el.innerHTML='<p><b>'+used.length+' of '+adobe.length+'</b> answer'+(adobe.length===1?'':'s')+' about Adobe products used, <b>'+written.length+' of '+firm.length+'</b> firm answer'+(firm.length===1?'':'s')+' written, <b>'+lines.size+'</b> service'+(lines.size===1?'':'s')+' selected for the statement of work.</p>'+
    '<div class="rfp-actions"><button type="button" class="primary" id="rfp-to-sow"'+(lines.size?'':' disabled')+'>Add to my statement of work</button><button type="button" id="rfp-download">Download RFP response</button><button type="button" id="rfp-download-xlsx">Download response as Excel</button>'+(wb?'<button type="button" id="rfp-writeback">Write answers into '+esc(wb.w.name)+'</button>':'')+'<button type="button" id="rfp-download-asks">Download questions for your client</button></div>'+
    (wb?'<p class="rfp-wb-note">Writes the answers you used into the '+esc(wb.head)+' column of your client\'s own workbook, on each question\'s row. Values only: the workbook\'s formatting is not kept.</p>':'');
}
function selectedLineIds(){const s=new Set();for(const q of rfpState.questions)if(q.status==='used'&&q.draft&&q.kind==='adobe')for(const id of q.draft.m.lines)s.add(id);return s;}
function selectedProducts(){const s=new Set();for(const q of rfpState.questions)if(q.status==='used'&&q.draft&&q.kind==='adobe'&&q.draft.m.lines.length){for(const id of q.draft.m.products)s.add(id);if(q.draft.m.conn){s.add(q.draft.m.conn.a);s.add(q.draft.m.conn.b);}}return s;}

/* ---------- into the statement of work: the same hand-off the canvas uses, as Your own play */
function toSow(){
  const lines=selectedLineIds(),prods=[...selectedProducts()];if(!lines.size)return;
  const adobe=prods.filter(id=>!P[id].outside),outside=prods.filter(id=>P[id].outside);
  const owners=[...prods.map(id=>P[id]),...C.filter(c=>prods.includes(c.a)&&prods.includes(c.b))];
  const payload=[],seen=new Set(),ls={};
  for(const o of owners){const conn='a' in o;for(const l of [...(o.lines||[]),...(o.more||[])]){if(seen.has(l)||!LN[l])continue;seen.add(l);const L=LN[l],on=lines.has(l);ls[l]=on;
    payload.push({id:l,on,lock:false,want:on,def:(o.lines||[]).includes(l),name:L.name,unit:L.unit,low:L.low,base:L.base,high:L.high,url:L.url,src:L.src,references:L.references||[],scope:L.scope||'',stage:L.unit==='monthly'?'Optimize':conn?'Connect':'Launch',
      prereqs:[L.origin==='research'&&conn?'Availability: '+String(o.sowAvailability||o.availability||'not stated by Adobe').replace(/([^.])$/,'$1.'):'',L.origin==='research'&&conn&&o.prereqs&&o.prereqs.length?'Prerequisites for '+P[o.a].name+' + '+P[o.b].name+': '+(o.sowPrereqs||o.prereqs).join('; ').replace(/\.$/,'')+'.':'',L.ext?'Also needs '+L.ext.replace(/\.$/,'')+'.':'',L.tier?'Assumes your client has '+L.tier.replace(/\.$/,'')+'.':''].filter(Boolean).join(' ')});}}
  const now=Date.now(),names=adobe.map(id=>P[id].name);
  try{
    localStorage.setItem('abv-sow-handoff',JSON.stringify({v:1,play:'custom',size:state.size||'typical',rate:state.rate||'',lines:payload,managed:payload.map(l=>l.id),fresh:true,products:adobe,names,outside,at:now}));
    localStorage.setItem('abv-sow-build-v1',JSON.stringify({v:2,play:'custom',on:adobe,out:outside,ls,keep:{},rate:state.rate||0,size:state.size||'typical',months:state.months||12,eff:null,fresh:false,cur:state.currency||'USD',def:null,recover:names}));
  }catch(e){toast('This browser blocks saving, so the services could not be carried over.');return;}
  applyHandoff();render();go('services');toast(lines.size+' service'+(lines.size===1?'':'s')+' from the RFP are on Your own play. The RFP list is still on the RFP Builder tab.');
}

/* ---------- the response document: the client's copy (step 53: no intro about the partner, no status tags) */
const CAP_TAG='Capability question: not answered from the catalog',OUT_TAG='Not in this catalog';
const clientName=()=>String(rfpState.name||'RFP').replace(/\.[a-z0-9]+$/i,'').replace(/ and \d+ more$/,'').replace(/[_-]+/g,' ').trim()||'RFP';
const DOC_CSS='body{font-family:"Source Sans 3",Arial,sans-serif;color:#1c1c1c;max-width:860px;margin:40px auto;padding:0 20px;line-height:1.5}h1{font-size:26px}h3{font-size:17px;margin:28px 0 4px}h4{font-size:13px;letter-spacing:1.2px;text-transform:uppercase;margin:14px 0 4px}p,li{font-size:15px}.tag{font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:0 0 6px}.blank{font-weight:600}.space{height:90px;border:1px dashed #999;border-radius:8px}pre{white-space:pre-wrap;font:inherit}section{page-break-inside:avoid}.intro{border:1.5px solid #1c1c1c;border-radius:10px;padding:12px 16px}';
function responseDoc(){
  const qs=rfpState.questions,name=clientName();
  const blank='<p class="blank">Your answer:</p><div class="space"></div>';
  const body=qs.map(q=>{const label=(q.label?q.label+' ':'')+q.text;
    if(q.kind!=='adobe')return '<section><h3>'+esc(label)+'</h3>'+(q.answer?'<pre>'+esc(q.answer)+'</pre>':blank)+'</section>';
    const d=q.draft||compose(q);
    if(!d||!d.m.lines.length||q.status==='skipped')return '<section><h3>'+esc(label)+'</h3>'+(q.answer&&q.status!=='skipped'?'<pre>'+esc(q.answer)+'</pre>':blank)+'</section>';
    const text=q.answer?'<pre>'+esc(q.answer)+'</pre>':answerHTML(d,q);
    return '<section><h3>'+esc(label)+'</h3>'+text+'</section>';}).join('');
  return '<!doctype html><html><head><meta charset="utf-8"><title>Response to '+esc(name)+'</title><style>'+DOC_CSS+'</style></head><body>'+
    '<h1>Response to '+esc(name)+'</h1>'+body+'</body></html>';
}

/* ---------- the partner's checklist: the four lists of the note, question by question (step 54) */
function asksDoc(){
  const qs=rfpState.questions,name=rfpState.name||'RFP';
  const li=x=>'<li>'+esc(partnerVoice(x))+'</li>';
  const body=qs.map(q=>{if(q.kind!=='adobe')return '';const d=q.draft||compose(q);if(!d)return '';
    const confirm=[...(d.confirm||[]),...(d.m&&d.m.missing&&d.m.missing.length?['This catalog documents no connection between '+d.m.missing.join(', or between ')+'.']:[])];
    if(!d.sells.length&&!d.asks.length&&!confirm.length&&!(d.assumptions||[]).length&&!d.firmPart)return '';
    return '<section><h3>'+esc((q.label?q.label+' ':'')+q.text)+'</h3>'+(d.firmPart?'<h4>Your part to write</h4><p>'+esc(d.firmPart)+'</p>':'')+
      (d.sells.length?'<h4>Adobe licenses this proposal includes (Adobe quotes them)</h4><ul>'+d.sells.map(li).join('')+'</ul>':'')+
      (d.asks.length?'<h4>Ask your client</h4><ul>'+d.asks.map((x,i)=>'<li>'+esc(partnerVoice(x))+'<br><b>'+(factOf(q,i)?'Client says: </b>'+esc(factOf(q,i))+' (in the response as what you already have in place)':(ticked(q,i)?'In the response as what we would need from you</b>':'Not in the response</b>'))+(factOf(q,i)?'':'<br><b>Will confirm with the client</b>')+'</li>').join('')+'</ul>':'')+
      (confirm.length?'<h4>Confirm with Adobe</h4><ul>'+confirm.map(li).join('')+'</ul>':'')+
      ((d.assumptions||[]).length?'<h4>Assumptions behind this answer</h4><ul>'+d.assumptions.map(li).join('')+'</ul>':'')+'</section>';}).join('');
  return '<!doctype html><html><head><meta charset="utf-8"><title>'+esc(name)+': questions for your client</title><style>'+DOC_CSS+'</style></head><body>'+
    '<h1>'+esc(name)+': questions for your client</h1><p class="intro">For your firm, not for the client. For each question the tool drafted an answer to, this lists the Adobe licenses the proposal includes, what to ask your client, what to confirm with Adobe and the assumptions behind the answer. Nothing here is in the downloaded response except the items you ticked, which appear there as "'+NEED+'", and what you typed, which appears as "'+HAVE+'".</p>'+(body||'<p>No drafted answer needs anything from your client.</p>')+'</body></html>';
}

/* ---------- the response as a workbook (RFPs arrive as spreadsheets, so the answer can go back as one) */
function loadXLSX(){return new Promise((ok,fail)=>{if(window.XLSX)return ok(window.XLSX);const sc=document.createElement('script');sc.src='lib/xlsx.mini.min.js';sc.onload=()=>ok(window.XLSX);sc.onerror=()=>fail(Error('The spreadsheet library did not load.'));document.head.appendChild(sc);});}
const PRIORITY={mandatory:'Mandatory',desirable:'Desirable'};
const stripSources=t=>t.replace(new RegExp('\\n\\n'+SRC_HEAD+'\\n[\\s\\S]*$'),'');
function responseRows(){
  const rows=[['Number','Section','Question','Mandatory or desirable','Response','Comply','Status']],srcs=[['Number','Source','Link']];
  for(const q of rfpState.questions){const d=q.kind==='adobe'?(q.draft||compose(q)):null;
    let text='',status='';
    if(q.kind==='firm'){text=q.answer||'';status=q.answer?'Written by the partner':'About your firm: still to write';}
    else if(q.kind!=='adobe'){text=q.answer||'';status=q.answer?'Written by the partner':'To sort: still to answer';}
    else if(!d){text=q.answer||'';status=q.answer?'Written by the partner':'No catalog match: still to write';}
    else if(!d.m.lines.length){text=q.answer||'';status=q.answer?'Written by the partner':(d.capability?CAP_TAG:OUT_TAG)+': still to write';}
    else{text=q.answer||stripSources(plain(d,q));status=q.status==='used'?'Reviewed':q.status==='skipped'?'Skipped by the partner':'Draft, not yet reviewed';
      for(const s of d.sources)srcs.push([q.label||'',s.title,s.url]);}
    rows.push([q.label||'',q.section||'',q.text,PRIORITY[q.priority]||'',text,q.comply||'',status]);}
  return {rows,srcs};
}
async function responseXlsx(){
  let X;try{X=await loadXLSX();}catch(e){toast(e.message);return;}
  const {rows,srcs}=responseRows(),wb=X.utils.book_new();
  const ws=X.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:8},{wch:28},{wch:60},{wch:14},{wch:100},{wch:10},{wch:28}];X.utils.book_append_sheet(wb,ws,'Response');
  const ws2=X.utils.aoa_to_sheet(srcs);ws2['!cols']=[{wch:8},{wch:60},{wch:90}];X.utils.book_append_sheet(wb,ws2,'Sources');
  const out=X.write(wb,{bookType:'xlsx',type:'array'});
  download(baseName()+'-response.xlsx',out,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}
const baseName=n=>(n||rfpState.name||'RFP').replace(/\.[a-z0-9]+$/i,'').replace(/ and \d+ more$/,'').replace(/[^a-zA-Z0-9-]/g,'-').slice(0,80);
// Write the answers the partner used back into the client's own workbook, in its Response column (step 51)
function writable(){
  for(const w of rfpState.workbooks||[])for(const [sheet,S] of Object.entries(w.sheets||{}))if(S.cols&&S.cols.response!==undefined&&rfpState.questions.some(q=>q.file===w.name&&q.sheet===sheet))
    return {w,head:String(((S.headers||[])[S.cols.response])||'Response').trim()||'Response'};
  return null;
}
function usedText(q){
  if(q.status!=='used')return '';
  if(q.answer)return q.answer;
  const d=q.kind==='adobe'?(q.draft||compose(q)):null;
  return d&&d.m.lines.length?stripSources(plain(d,q)):'';
}
async function writeBack(){
  const wb=writable();if(!wb)return;let X;try{X=await loadXLSX();}catch(e){toast(e.message);return;}
  const W=wb.w;let n=0;
  for(const q of rfpState.questions){
    if(q.file!==W.name||q.row==null)continue;const S=W.sheets[q.sheet];if(!S||S.cols.response===undefined)continue;
    const text=usedText(q);if(!text)continue;
    W.wb.Sheets[q.sheet][X.utils.encode_cell({r:q.row,c:S.startCol+S.cols.response})]={t:'s',v:text};n++;
  }
  const csv=W.type==='csv',out=X.write(W.wb,{bookType:csv?'csv':'xlsx',type:csv?'string':'array'});
  download(baseName(W.name)+'-answered.'+(csv?'csv':'xlsx'),out,csv?'text/csv':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  toast(n?n+' answer'+(n===1?'':'s')+' written into '+W.name+'.':'No answers used yet, so nothing was written. Use an answer first.');
}

/* ---------- wiring */
document.addEventListener('click',e=>{
  const li=e.target.closest('#rfp-questions li');
  if(li){if(li.dataset.i!==undefined&&!e.target.closest('select,button'))select(Number(li.dataset.i));return;}
  const rm=e.target.closest('.rfp-chip [data-rm]'),q=current();
  if(rm&&q){redraft(q,(q.draft&&q.draft.m?q.draft.m.products:(q.pick||[])).filter(id=>id!==rm.dataset.rm));return;}
  const id=e.target.id;
  if(id==='rfp-use'&&q&&q.draft){q.status='used';R.renderList();renderAnswer();summary();return;}
  if(id==='rfp-firm-use'&&q){const t=$r('rfp-firm').value.trim();q.answer=t;q.status=t?'used':undefined;R.renderList();renderAnswer();summary();return;}
  if(id==='rfp-download-xlsx'){responseXlsx();return;}
  if(id==='rfp-writeback'){writeBack();return;}
  if(id==='rfp-skip'&&q){q.status='skipped';R.renderList();renderAnswer();summary();return;}
  if(id==='rfp-edit-btn'&&q){editing=true;renderAnswer();return;}
  if(id==='rfp-cancel-edit'){editing=false;renderAnswer();return;}
  if(id==='rfp-save-edit'&&q){q.answer=$r('rfp-edit').value;q.status='used';editing=false;R.renderList();renderAnswer();summary();return;}
  if(id==='rfp-next'){next();return;}
  if(id==='rfp-to-sow'){toSow();return;}
  if(id==='rfp-download-asks'){download(baseName()+'-questions-for-your-client.html',asksDoc(),'text/html');return;}
  if(id==='rfp-download'){download(baseName()+'-response.html',responseDoc(),'text/html');return;}
});
document.addEventListener('change',e=>{if(e.target.id!=='rfp-add'||!e.target.value)return;const q=current();if(!q)return;
  redraft(q,[...(q.draft&&q.draft.m?q.draft.m.products:(q.pick||[])),e.target.value]);});
// a typed fact or a tick changes the response in place (the field keeps focus) and the item's badge
function refreshItem(q,i){const li=document.querySelector('#rfp-answer .rfp-asks .rfp-fact[data-i="'+i+'"]');const item=li&&li.closest('li');if(!item)return;
  const badge=item.querySelector('.rfp-badge');if(badge)badge.outerHTML=badgeHTML(q,i);
  const box=item.querySelector('.rfp-tick');if(box){box.disabled=!!factOf(q,i);box.checked=ticked(q,i)&&!factOf(q,i);}
  const b=$r('rfp-body');if(b&&!q.answer)b.innerHTML=answerHTML(q.draft,q);}
document.addEventListener('input',e=>{const t=e.target.closest('.rfp-fact');if(!t)return;const q=current();if(!q||!q.draft)return;
  (q.facts=q.facts||{})[t.dataset.i]=t.value;refreshItem(q,t.dataset.i);});
document.addEventListener('change',e=>{const t=e.target.closest('.rfp-tick');if(!t)return;const q=current();if(!q||!q.draft)return;
  (q.ticks=q.ticks||{})[t.dataset.i]=t.checked;refreshItem(q,t.dataset.i);});
R.onRender=()=>{summary();if(current()&&current().kind==='adobe'&&!current().draft)current().draft=compose(current());};
R.onLoad=()=>{rfpState.selected=null;rfpState.owned=null;editing=false;if(rfpState.questions.some(q=>q.kind==='adobe'))next();else{renderAnswer();summary();}};
window.RFPAnswers={match,compose,rfp,plain,doLine,toSow,responseDoc,asksDoc,responseRows,writeBack,ownedProducts,context:contextProducts,detect,detectAll,scan};
})();
