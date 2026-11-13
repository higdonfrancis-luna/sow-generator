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
   and the answers used can be written back into the client's own workbook, values only.

   Step 67 (Nov 10 2026, Adam, after reading this tool's bank response beside one from Adobe's own tool: "I want ours to be
   better than theirs"): the writer. A draft now answers the question first, from sentences in the knowledge base that
   each rest on a quote from Adobe's pages (RFP_FACTS.explain), and the services follow in delivery order. What reaches
   the client goes through written(): a service is said in full once across the response and pointed to elsewhere; a
   licensing question gets its own Licensing section; a long service sentence becomes a short list; and where the RFP
   states a word limit, each answer is fitted under it, with what was left out named to the partner. */
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
 aemforms:['aem forms','experience manager forms','adobe experience manager forms','adobe forms','adaptive forms','forms as a cloud service'],
 gspm:['genstudio for performance marketing','adobe genstudio for performance marketing','genstudio','adobe genstudio'],
 ca:['content analytics','adobe content analytics'],
 mmm:['marketing campaign analytics','adobe marketing campaign analytics','mix modeler','adobe mix modeler'],
 collab:['real-time cdp collaboration','real time cdp collaboration','rtcdp collaboration','rt-cdp collaboration','cdp collaboration'],
 ajob2b:['journey optimizer b2b edition','journey optimizer b2b','adobe journey optimizer b2b edition','adobe journey optimizer b2b','ajo b2b edition','ajo b2b'],
 xa:['experimentation accelerator','journey optimizer experimentation accelerator'],
 express:['adobe express','express for enterprise'],
 creativecloud:['creative cloud','adobe creative cloud','photoshop','illustrator','indesign','premiere pro'],
 frameio:['frame.io','frame io','frameio'],
 planning:['workfront planning','adobe workfront planning'],
 fireflycp:['firefly creative production','firefly services','adobe firefly services'],
 fireflycm:['firefly custom models','firefly custom model','custom firefly model'],
 brandintel:['brand intelligence','adobe brand intelligence'],
 aa:['adobe analytics','analysis workspace','report suite'],
 mmeasure:['marketo measure','adobe marketo measure','bizible'],
 mqualifier:['marketo qualifier','adobe marketo qualifier','sales qualifier','account qualification agent'],
 moptimizer:['marketo optimizer','adobe marketo optimizer'],
 acrobat:['acrobat','adobe acrobat','acrobat services','pdf services api','document generation api','pdf embed api'],
 acrobatsign:['acrobat sign','adobe acrobat sign','adobe sign'],
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
 bv:['ai assistant','ai answer','ai generated answer','ai overview','chatgpt','perplexity','gemini','ai search','ai shopping','shopping assistant','agentic traffic','answer engine','generative engine','visible in ai','show up in ai','ai citation','ai visibility'],
 cja:['analytics','measure','measurement','measured','attribution','journey analysis','report on','reporting','dashboard','conversion data','customer journey','cross-channel analysis'],
 aemsites:['content management system','cms','authoring','web content','multi-site','multisite','site template','web content management','page templates','content authors'],
 eds:['site speed','page speed','core web vitals','fast site','new website','new site','site rebuild','redesign','website platform','lighthouse'],
 so:['seo','search engine optimization','search traffic','organic traffic','organic search','technical seo','site optimization','broken links'],
 commerce:['storefront','online store','ecommerce','e-commerce','product page','product catalog','checkout','shopping cart','b2b commerce'],
 bc:['chatbot','chat bot','conversational','virtual assistant','answer their questions','questions about accounts','self-service answers','live chat','conversational assistant'],
 cw:['agent skills','readouts on request','routine work','ai agent for our team','by asking'],
 rtcdp:['customer data platform','cdp','customer profile','unified profile','unified customer profile','audience','segment','known customer','first-party data','identity resolution','data ingestion'],
 ajo:['journey','email journey','triggered message','sms','push notification','campaign orchestration','abandoned cart','abandon cart','cart abandonment','messaging','ip warmup','warmup','sending subdomain','subdomain delegation'],
 target:['personalization','personalize','personalise','personalisation','a/b test','a/b testing','ab test','ab testing','experimentation','product recommendation','recommendation'],
 marketo:['marketing automation','lead scoring','lead nurturing','nurture','b2b marketing','lead management'],
 workfront:['work management','project intake','request intake','campaign request','proofing','creative review','resource management','approval workflow'],
 aemassets:['asset management','image library','media library','digital asset management','dam','asset library','brand asset','images and video','approved images','product images','rendition','asset metadata'],
 gspm:['ad creative','creative variation','on-brand content','ad variation'],
 ca:['content performance','content attribute'],
 mmm:['marketing mix','mix modeling','media mix','budget plan'],
 collab:['clean room','data collaboration'],
 ajob2b:['buying group','account-based marketing','account based marketing','account journey'],
 express:['locked template','brand template','social post'],
 frameio:['video review','review and approval of video','creative review'],
 planning:['marketing calendar','campaign planning','marketing plan'],
 fireflycp:['creative production','content production at scale','asset variation'],
 brandintel:['brand compliance','brand check','on-brand review'],
 mmeasure:['marketing attribution','revenue attribution','multi-touch attribution'],
 mqualifier:['prospect qualification','outbound workflow','bdr outreach','business development representative'],
 aa:['web analytics','site analytics','digital analytics'],
 acrobatsign:['signature workflow','signing workflow','contract signing','agreement signing'],
 creativecloud:['creative apps','design apps'],
 fireflycm:['custom model','brand-trained model'],
 xa:['experiment results','test learnings'],
 acrobat:['pdf accessibility','pdf generation','document automation'],
 aemforms:['online application','application form','form template','forms conversion','forms migration','forms history','online form','web form','site form','digital form','fillable form','pdf form','form submission','form builder','forms portal','electronic signature','e-signature','esignature','document generation','digital enrollment'],
 cdn:['cdn','access logs','log forwarding','content delivery network'],
 dwh:['data warehouse','warehouse'],
 cstore:['cloud storage','sftp','file drops','blob storage'],
 crm:['our crm','the crm','crm'],
 ads:['ad platform','paid media','ad spend'],
 bi:['bi tool','business intelligence'],
 csrc:['word documents','document authoring'],
 cms:['another cms','tag manager','legacy cms']};
// Adobe products this catalog does not cover: named as such, never answered as a neighbour ('AEM Guides' is not AEM Sites)
const UNCOVERED=[['adobe campaign','Adobe Campaign'],['campaign classic','Adobe Campaign'],['campaign standard','Adobe Campaign'],['campaign v8','Adobe Campaign'],['audience manager','Audience Manager'],['aem guides','AEM Guides'],['experience manager guides','AEM Guides'],['aem screens','AEM Screens'],['firefly','Firefly'],['adobe advertising','Adobe Advertising'],['learning manager','Adobe Learning Manager']];
const STRONG=new Set(['dam','cdp','seo','chatgpt','perplexity','chatbot','storefront','lighthouse','sms','gemini']);
const norm=s=>' '+String(s||'').toLowerCase().replace(/[^a-z0-9/]/g,' ')+' ';   // one character for one, so positions match the text
const aliasRe=a=>new RegExp('(?<=\\s)'+a.toLowerCase().replace(/[^a-z0-9/]+/g,' ').trim().split(' ').map(w=>w.replace(/\//g,'\\/')).join('\\s+')+'(?:s|es)?(?=\\s)','g');
const ALIAS=[];
for(const [pid,arr] of Object.entries(NAMES))for(const a of arr)ALIAS.push({re:aliasRe(a),type:'name',pid,w:2});
for(const [pid,arr] of Object.entries(TOPICS))for(const a of arr)ALIAS.push({re:aliasRe(a),type:'topic',pid,w:a.includes(' ')||STRONG.has(a)?2:1});
for(const [a,label] of UNCOVERED)ALIAS.push({re:aliasRe(a),type:'uncovered',pid:label,w:3});
// 'We will not use Adobe Target', 'instead of Marketo': the client rules the product out
const NEG_VERB=/\b(?:not|never|no longer|don't|do not|won't|will not|doesn't|does not|cannot|can't|isn't|aren't)(?:\s+[a-z']+){0,2}?\s+(?:use|using|want|need|include|including|consider|considering|propose|proposing|implement|implementing|license|licensing|buy|adopt|renew|keep|continue with|move to|go with|require)(?:\s+(?:the|any|a|an|adobe))*\s*$/i;
const NEG_NEAR=/\b(?:instead of|rather than|other than|except|excluding|not|without(?:\s+(?:licensing|using|buying|purchasing|adopting|implementing|the))?)\s+(?:adobe\s+)?$/i;   // step 89: 'without licensing Adobe Target'
function negated(raw,at){const before=raw.slice(Math.max(0,at-80),at),cut=Math.max(before.lastIndexOf('.'),before.lastIndexOf(';'),before.lastIndexOf('?'),before.lastIndexOf('!'));const w=before.slice(cut+1);return NEG_VERB.test(w)||NEG_NEAR.test(w);}
// Step 76 (Nov 11 2026, Adam: "Fix 1-4"): 'AEM' or 'Adobe Experience Manager' with no product after it is AEM Sites, unless the RFI
// names AEM Forms or AEM Assets in full more often than it names AEM Sites: then it is that product (a forms RFI's 'training on AEM')
const BARE_AEM=/^(?:adobe )?(?:aem|experience manager)$/,AEM_FULL={aemforms:/\b(?:aem|experience manager)\s+forms\b/gi,aemassets:/\b(?:aem|experience manager)\s+assets\b/gi,aemsites:/\b(?:aem|experience manager)\s+sites\b/gi};
let aemOf=null,aemIs='aemsites';
function aemHome(){if(aemOf!==rfpState.questions){aemOf=rfpState.questions;const all=rfpText(),n=id=>(all.match(AEM_FULL[id])||[]).length,sites=n('aemsites');
    aemIs=['aemforms','aemassets'].filter(id=>P[id]&&n(id)>sites).sort((a,b)=>n(b)-n(a))[0]||'aemsites';}
  return aemIs;}
// step 81: 'Analysis Workspace' is in Adobe Analytics and in Customer Journey Analytics. It is Customer Journey Analytics' where the
// line names that product, or where the RFI names it more often than it names Adobe Analytics
let wsOf=null,wsIs='aa';
function workspaceHome(){if(wsOf!==rfpState.questions){wsOf=rfpState.questions;const all=rfpText(),n=re=>(all.match(re)||[]).length;
    wsIs=n(/\bcustomer journey analytics\b|\bCJA\b/gi)>n(/\badobe analytics\b/gi)?'cja':'aa';}
  return wsIs;}
function scan(text,scope){
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
  for(const h of kept)if(h.pid==='aemsites'&&h.type==='name'&&BARE_AEM.test(t.slice(h.a,h.b))){
    const count=id=>(String(scope||'').match(AEM_FULL[id])||[]).length;
    h.pid=scope===undefined?aemHome():['aemforms','aemassets'].filter(id=>P[id]&&count(id)>count('aemsites')).sort((a,b)=>count(b)-count(a))[0]||'aemsites';}
  for(const h of kept)if(h.pid==='aa'&&h.type==='name'&&/^analysis workspaces?$/.test(t.slice(h.a,h.b))&&!kept.some(x=>x!==h&&x.pid==='aa'&&x.type==='name')&&(kept.some(x=>x.pid==='cja'&&x.type==='name'&&!x.neg)||(scope===undefined?workspaceHome():((String(scope).match(/\bcustomer journey analytics\b|\bCJA\b/gi)||[]).length>(String(scope).match(/\badobe analytics\b/gi)||[]).length?'cja':'aa'))==='cja'))h.pid='cja';   // step 81: Analysis Workspace is Customer Journey Analytics' too   // 'AEM' alone is the AEM product the RFI names most
  return kept;
}
function detectAll(text,scope){
  const named={},topics={},uncovered=[],excluded=new Set();
  const hits=scan(text,scope);
  for(const h of hits){if(h.type==='uncovered'){if(!h.neg&&!uncovered.includes(h.pid))uncovered.push(h.pid);continue;}if(h.neg)excluded.add(h.pid);}
  for(const h of hits){if(h.type==='uncovered'||h.neg||excluded.has(h.pid)||!P[h.pid])continue;const bag=h.type==='name'?named:topics;bag[h.pid]=(bag[h.pid]||0)+h.w;}
  // step 69: where the question names another analytics product and not Customer Journey Analytics, the general words (reporting,
  // measure, attribution) are about the product it names
  if(!named.cja&&['aa','mmeasure','mmm','ca'].some(id=>named[id]))delete topics.cja;
  const order=o=>Object.entries(o).sort((x,y)=>y[1]-x[1]).map(x=>x[0]);
  return {named:order(named),topics:order(topics).filter(id=>!named[id]),score:Object.fromEntries(Object.keys(P).map(id=>[id,(named[id]||0)*2+(topics[id]||0)])),topicScore:topics,uncovered,excluded:[...excluded].filter(id=>P[id]).map(id=>P[id].name)};
}
function detect(q){const d=detectAll(q);return [...d.named,...d.topics];}
const STOP=new Set('a an and the of to for in on with our your you we us it its is are be how what which would do does can will should describe provide explain list detail outline please that this these those from by at as or into than then there their they them about any all some more most other such also after before when where who whom need needs needed want wants including include includes use using used'.split(' '));
const stem=w=>w.length>5?w.replace(/(ing|ed|es|s)$/,'').replace(/ies$/,'y'):w.length>3?w.replace(/s$/,''):w;
const tokens=s=>[...new Set(String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').split(' ').filter(w=>w.length>2&&!STOP.has(w)).map(stem))];
const overlap=(a,b)=>a.filter(x=>b.includes(x)).length;
const ONGOING=/\b(ongoing|after launch|post-launch|monthly|each month|run and operate|support (?:services|model)|managed support|maintenance|optimi[sz]ation services|managed services)\b/i;
// step 78: 'maintenance' in a line that asks for documentation or training ('documentation identifying setup, use, maintenance and
// administration') does not make it a question about after-launch services
const DOC_ASK=/\b(?:documentation|training|manuals?|guides?|runbooks?|knowledge transfer)\b/i;
const isOngoing=t=>ONGOING.test(t)&&(ONGOING.test(t.replace(/\bmaintenance\b/gi,' '))||!DOC_ASK.test(t));
const SOLUTION=/\bwhich (?:adobe )?(?:products?|solutions?|tools?|applications?|capabilities)\b|\bwhat (?:adobe )?(?:products?|solutions?|tools?|applications?)\b[^?.]*\b(?:use|recommend|propose)|\brecommend(?:ed)? (?:adobe )?(?:products?|solutions?)\b/i;
const MIGRATE=/\b(?:migrat|move|moving|import|transfer|re-?platform|upgrad)/i,MIGRATE_LINE=/migrat|transfer|move from|upgrade|transition/i;
// step 76: handing over knowledge is training, not a migration; and the office tools a line says to write in ('using Microsoft Office
// products and/or MS Project') are not words about an Adobe service
const KNOWLEDGE=/\b(?:transfer(?:s|red|ring)?\s+(?:of\s+)?(?:the\s+|all\s+)?knowledge|knowledge\s+transfers?)\b/gi,OFFICE=/\b(?:microsoft|ms)\s+(?:office|project|word|excel|powerpoint|visio|teams)(?:\s+(?:products?|suite))?\b/gi;
const DURATION=/^how (?:many (?:weeks|months|days|hours)|long)\b|\bhow long\b|\bhow many (?:weeks|months)\b/i;
const GENERIC=new Set(['answer','content','data','site','page','program','review','setup','monthly','service','adobe','web','custom','client','brand','report','plan','work','team','experience','digital','search','ai','connect','connection','setup','existing','new','agreed']);
// step 72: words of a service's name that are too common to show, alone, that a line with no product in it asks for that service
const WEAK=new Set(['each','document','workflow','template','templat','build','design','create','user','project']);   // step 76: 'user testing' and 'project plan' ask for no service
const nameWords=ids=>{const s=new Set();for(const id of ids)for(const a of [P[id].name,...(NAMES[id]||[])])for(const w of tokens(a))s.add(w);return s;};
const ownerOf=l=>Object.values(P).find(p=>(p.lines||[]).includes(l)||(p.more||[]).includes(l));
function match(text,opts){
  opts=opts||{};const qt=tokens(text.replace(OFFICE,' ').replace(KNOWLEDGE,' knowledge ')),d=detectAll(text);
  let named=d.named,via='question';
  if(opts.pick){named=opts.pick.filter(id=>P[id]);via='pick';}
  else if(!named.length&&opts.context){const c=detectAll(opts.context);named=c.named.filter(id=>!d.excluded.includes(P[id].name));if(named.length)via='context';}
  else if(!named.some(id=>!P[id].outside)&&opts.context){const c=detectAll(opts.context).named.filter(id=>!P[id].outside&&!d.excluded.includes(P[id].name)&&!named.includes(id));if(c.length){named=[...named,...c];via='context';}}   // 'our Power BI reports' under a CJA heading: the heading's product joins the client's own tool
  const ongoing=isOngoing(text);let fromContext=false,prods=named.slice();
  if(!opts.pick){   // topic words: a second product through a documented connection, or the products when the question asks which to use
    const solutioning=SOLUTION.test(text),approach=!F.factShaped(text),namedAdobe=named.filter(id=>!P[id].outside);   // the client's own system (WordPress, Snowflake) is not an Adobe product
    for(const id of d.topics){if(prods.includes(id))continue;
      if(id==='eds'&&rfpNames('aemsites')&&!rfpNames('eds'))continue;   // step 67: where the RFP names AEM Sites and never Edge Delivery, "the new site" is the AEM Sites one
      if(prods.length&&prods.length<4&&C.some(c=>(c.a===id&&prods.includes(c.b))||(c.b===id&&prods.includes(c.a))))prods.push(id);
      else if(!namedAdobe.length&&!P[id].outside&&prods.filter(x=>!P[x].outside).length<3&&(solutioning||(approach&&d.topicScore[id]>=2))){prods.push(id);via='topic';}
    }
  }
  if(!prods.length&&!opts.pick&&!d.uncovered.length&&!(ongoing&&opts.ctx&&opts.ctx.length)){const main=rfpMain().filter(id=>!d.excluded.includes(P[id].name));if(main.length){prods=main;via='rfp';}}   // step 72
  if(!prods.length){
    if(ongoing&&opts.ctx&&opts.ctx.length){prods=opts.ctx.slice(0,10);fromContext=true;}
    else return {products:[],conn:null,conns:[],missing:[],lines:[],fromContext:false,via,uncovered:d.uncovered,excluded:d.excluded};
  }
  // the connections between the products, the pair the question names most strongly first; a documented pair with no
  // services behind it (Journey Optimizer + Brand Concierge) never answers, it is named to the partner instead
  const sc=id=>d.score[id]||0,hasLines=c=>[...(c.lines||[]),...(c.more||[])].some(l=>LN[l]);
  const firstAt={};for(const h of scan(text))if(!h.neg&&h.type!=='uncovered'&&!(h.pid in firstAt&&firstAt[h.pid]<=h.a))firstAt[h.pid]=h.a;   // step 67: where the question first names or describes each product
  const at=c=>(c.a in firstAt?firstAt[c.a]:1e6)+(c.b in firstAt?firstAt[c.b]:1e6);
  const conns=fromContext?[]:C.filter(c=>prods.includes(c.a)&&prods.includes(c.b)&&hasLines(c)).map(c=>({c,s:sc(c.a)+sc(c.b),o:overlap(qt,tokens((c.label||'')+' '+(c.how||'')+' '+((c.gain||{}).text||''))),at:SOLUTION.test(text)?at(c):0})).sort((x,y)=>x.at-y.at||y.s-x.s||y.o-x.o).map(x=>x.c);
  const conn=conns[0]||null,adobe=prods.filter(id=>!P[id].outside);
  // step 82: an after-launch question about the RFI's products is not asking how they connect, so no pair is checked for it
  const missing=[];if(!fromContext)for(let i=0;i<adobe.length;i++)for(let j=i+1;j<adobe.length;j++){if(conns.some(c=>[c.a,c.b].includes(adobe[i])&&[c.a,c.b].includes(adobe[j])))continue;
    const empty=C.find(c=>[c.a,c.b].includes(adobe[i])&&[c.a,c.b].includes(adobe[j]));
    if(empty)missing.push(P[adobe[i]].name+' and '+P[adobe[j]].name+' (Experience League lists no services for the pair: '+partnerVoice(empty.sowNote||empty.availability||'see the card').replace(/\.$/,'')+')');
    else if(adobe.length>2)missing.push(P[adobe[i]].name+' and '+P[adobe[j]].name);}
  // two named products whose only connection has no services behind it: nothing is drafted for the client (the No match
  // panel tells the partner what Adobe says), unless the partner picked the products by hand
  if(!conns.length&&!opts.pick&&adobe.length===2&&missing.some(x=>/Experience League lists no services/.test(x)))return {products:prods,conn:null,conns:[],missing,lines:[],fromContext:false,via,uncovered:d.uncovered,excluded:d.excluded};
  // the words of the products the question itself names are not evidence for a line ('analytics' in Customer Journey
  // Analytics does not ask for the Adobe Analytics upgrade); words of a product found only by its topic still are
  const owners=[...adobe.map(id=>P[id]),...conns],nameW=nameWords(via==='rfp'?adobe:d.named.filter(id=>prods.includes(id))),migrate=MIGRATE.test(text.replace(KNOWLEDGE,' '));
  const hasMonthly=owners.some(o=>[...(o.lines||[]),...(o.more||[])].some(l=>LN[l]&&LN[l].unit==='monthly'));
  const seen=new Set(),cands=[];
  for(const o of owners){const isConn='a' in o;for(const l of [...(o.lines||[]),...(o.more||[])]){if(seen.has(l)||!LN[l]||!keepsLine(l))continue;seen.add(l);   // step 91: a migration written for one source answers only an RFI moving from it
    const L=LN[l],isDefault=(o.lines||[]).includes(l),monthly=L.unit==='monthly';
    if((fromContext||(ongoing&&hasMonthly))&&!monthly)continue;                 // an ongoing-services question wants the monthly lines
    const nameT=tokens(L.name).filter(w=>!nameW.has(w)),nameHit=overlap(qt,nameT.filter(w=>!GENERIC.has(w)));
    const hit=overlap(qt,nameT)*2+overlap(qt,tokens(L.scope||(TPL[l]||{}).scope||'').filter(w=>!nameW.has(w)&&!(conn&&GENERIC.has(w))));   // beside a connection, common words in a scope prove nothing
    const mig=migrate&&MIGRATE_LINE.test(L.name);
    let s=hit+(isConn?3:0)+(isDefault?2:0)+(mig?4:0);
    if(!isDefault&&(hit<3||!nameHit)&&!mig)s=-1;                                // an optional line needs a distinctive word of its own name in the question
    // step 67: an after-launch question also takes the first monthly line of a product that has no starting one
    // (Customer Journey Analytics, Brand Concierge); a financial-services line only when the RFP is from that industry
    let first=false;
    if(s<0&&(fromContext||ongoing)&&monthly&&!isConn&&!(o.lines||[]).some(x=>LN[x]&&LN[x].unit==='monthly')&&(o.more||[]).find(x=>LN[x]&&LN[x].unit==='monthly')===l&&(!/^FSI/.test(l)||isFSI())){s=2;first=true;}   // step 81: also when the question names the product ('monthly services for Customer Journey Analytics')
    if(conn&&!isConn&&!nameHit&&!mig)s=-1;                                       // beside a matched connection, a product's own line needs one too
    cands.push({id:l,s,hit,strong:via==='rfp'?overlap(qt,nameT.filter(w=>!GENERIC.has(w)&&!WEAK.has(w))):0,isDefault,first});}}
  cands.sort((x,y)=>y.s-x.s);
  let lines=cands.filter(x=>x.s>0&&(via==='rfp'?x.strong>1||(x.strong>0&&x.hit>3&&qt.length<26):x.hit>0||x.isDefault||x.first||fromContext)).slice(0,fromContext?8:adobe.length>2?6:4).map(x=>x.id);
  if(via==='rfp'&&!lines.length)return {products:[],conn:null,conns:[],missing:[],lines:[],fromContext:false,via,uncovered:d.uncovered,excluded:d.excluded};
  if(!lines.length&&!fromContext&&via!=='topic'){const o=conn||adobe.map(id=>P[id]).find(p=>(p.lines||[]).length);if(o)lines=((o.lines||[]).length?o.lines:(o.more||[]).filter(l=>LN[l])).slice(0,2);}
  return {products:prods,conn,conns,missing,lines,fromContext,via,uncovered:d.uncovered,excluded:d.excluded};
}

/* ---------- the partner's words to the client */
// Step 53: the pronoun swap also handles the partner as an object ("by the partner" becomes "by us"), the partner
// compounds ("partner-managed"), "you and your client", "Client-provided" and "Client authorization", and the verb
// lists cover does, authorizes, authors and the other verbs the catalog uses.
const YOU_VERBS='has|is|does|confirms|provides|approves|names|supplies|grants|manages|installs|shares|agrees|owns|runs|keeps|reviews|signs|sets|adds|licenses|needs|holds|pays|picks|decides|gives|sends|forwards|turns|enables|accepts|appoints|authorizes|authors|assigns|publishes|uses|checks|tests|configures|selects|chooses|maintains|operates|hosts|exports|imports|delegates|defines|tracks|reports|wants|allocates|forwards|supports|accepts|reads|writes|edits|records|stores|collects|keeps|retains|deletes|controls|governs|nominates|designates|identifies|lists|tells|lets|allows|permits|issues|requests|raises|opens|books|schedules|attends|completes|finishes|signs|makes|takes|brings|puts|places|points|routes|pays';
const WE_VERBS='does|confirms|checks|builds|sets|validates|documents|tests|installs|configures|maps|keeps|reviews|prepares|publishes|runs|flags|routes|starts|agrees|authorizes|authors|assigns|creates|adds|uses|enables|loads|imports|exports|migrates|delivers|trains|connects|activates|provides|names|shares|hands|measures|tracks|reports|designs|holds|signs|pays|supplies|approves|grants|manages|owns|plans|writes|reads|records|stores|collects|defines|identifies|lists|makes|takes|brings|puts|places|points|completes|finishes|raises|opens|books|schedules|registers|deploys|ships|monitors|reconciles|rebuilds|extracts|models|labels|tags|applies|replaces|moves|cleans|wires|secures|sizes|ranks|gathers|compares|guides|coaches|converts|describes|computes|proposes|enriches|stands|carries|prints|styles|fits|indexes|surfaces|automates|simplifies|trims|fixes|teaches|engages|retires|operates|maintains|hosts|generates|responds|resolves|govern|turns|gives|sends|forwards|picks|decides|needs';
const MORE_VERBS='requires|expects|receives|updates|follows|meets|ensures|prefers|depends|relies|specifies|operates|completes|remains|retains|refreshes|logs|gets|puts|applies|implements|matches|owns|exports|imports';
const conj=v=>({has:'have',is:'are',does:'do'}[v]||singular(v));
const VERBS_ALL=WE_VERBS+'|'+YOU_VERBS+'|'+MORE_VERBS;
// a verb the partner is the object of ("gives the partner access"); a clause where the partner is the subject ("and the partner maps it")
const OBJ_VERBS='gives?|gave|given|giving|lets?|letting|tells?|told|telling|allows?|allowed|grants?|granted|sends?|sent|shows?|showed|shown|made|kept|asks?|asked|helps?|helped|pays?|paid|provides?|provided|supplies|supplied|hands?|handed|offers?|offered|authori[sz]es?|authori[sz]ed|enables?|enabled|permits?|permitted|invites?|invited|notif(?:y|ies|ied)|briefs?|briefed|informs?|informed|contacts?|contacted|joins?|joined|includes?|included|names?|named|appoints?|appointed|trusts?|expects?|requires?|needs?|wants?|chooses?|selects?|engages?|hires?|uses?|keeps?|leaves?|makes?|puts?|brings?';
const SUBJ=/(^|[.;:,]\s*|\b(?:and|or|then|if|when|once|where|while|so|but|because|that|which|who)\s+)/.source;
function rfp(t){
  let s=String(t||'').replace(/[\u2018\u2019]/g,"'")   // a typed note's curly apostrophe ("the Client\u2019s") is the straight one here
    // the RFP's own legal style and the partner's own words for the client: THE CLIENT, Client as a bare subject, our client, the customer
    .replace(/\bTHE CLIENT'S\b/g,"the Client's").replace(/\bTHE CLIENT\b/g,'the Client').replace(/\bCLIENT'S\b/g,"Client's").replace(/\bCLIENT\b/g,'Client')
    .replace(/\bOur client's\b/g,'Your').replace(/\bour client's\b/g,'your').replace(/\bOur client\b/g,'You').replace(/\bour client\b/g,'you')
    .replace(/\bThe customer's\b/g,'Your').replace(/\bthe customer's\b/g,'your').replace(/\bThe customer\b/g,'You').replace(/\bthe customer\b/g,'you')
    .replace(/(^|[.!?]\s+)Client (?=(?:confirm|provide|suppl|approv|agree|sign|name|grant|own|run|keep|give|add|share|decide|appoint|allow|set|complete|accept|review|manage|install|has|have|is|was|will|can|did|told|said|verified|checked)\w*\b)/g,'$1You ')
    .replace(/\b([Tt])he Client (application owners|review|reviewers?|approval|approvers?|team|sign-off|feedback|evidence|expertise|data|content|assets)\b/g,(m,t,w)=>(t==='T'?'Your ':'your ')+w)   // "the Client review" is a noun phrase: "your review", not "you review"
    .replace(/\b(?:you and your client|your client and you|the client and you|you and the client)\b(?!'s)/gi,'we and you').replace(/\b(?:you or your client|your client or you)\b(?!'s)/gi,'we or you')
    .replace(/\b(?:you and your client|your client and you)'s\b/gi,'our and your')
    .replace(/\bthe client's\b(?! ID| Secret)/g,'your').replace(/\bThe client's\b(?! ID| Secret)/g,'Your').replace(/\bthe client\b(?!-| ID| Secret)/g,'you').replace(/\bThe client\b(?!-| ID| Secret)/g,'You')
    // the two parties named together: as an object ("between Adobe, the Client and the partner") they are "you and us"; as a subject they are "we and you"
    .replace(/\b(of|with|by|for|to|between|from|across|among|including|against|than|like|through|at|on|in)((?:\s+[A-Z][\w'.]*,?)*)\s+the partner and (?:the )?Client\b/g,'$1$2 us and you')
    .replace(/\b(of|with|by|for|to|between|from|across|among|including|against|than|like|through|at|on|in)((?:\s+[A-Z][\w'.]*,?)*)\s+the Client and (?:the )?partner\b/g,'$1$2 you and us')
    .replace(/\bthe partner and (?:the )?Client\b/g,'we and you').replace(/\bthe Client and (?:the )?partner\b/g,'we and you')
    .replace(/\bYour client's\b/g,'Your').replace(/\byour client's\b/g,'your').replace(/\bYour client\b/g,'You').replace(/\byour client\b/g,'you')
    .replace(/\b([Tt]he )?Client-provided\b/g,(m,t)=>(t&&t[0]==='T'?'Your':'your')).replace(/\bClient authorization\b/g,'your authorization')
    .replace(/\bClient-authori[sz]ed ([a-z]+(?: [a-z]+)?)\b/g,'$1 you authorize')
    .replace(/\b([Tt]he )?Client-(?!side\b|ID\b|Secret\b)(\w+)/g,(m,t,w)=>(t&&t[0]==='T'?'Your ':'your ')+w)
    .replace(/\bone your\b/g,'your')
    .replace(/\bThe Client's\b(?! ID| Secret)/g,'Your').replace(/\bthe Client's\b(?! ID| Secret)/g,'your').replace(/\bThe Client\b(?! ID| Secret)/g,'You').replace(/\bthe Client\b(?! ID| Secret)/g,'you')
    .replace(/\bnamed Client (reviewers?|approvers?|owners?)\b/g,'your named $1').replace(/\bone Client review\b/g,'one review with you').replace(/\band Client agree\b/g,'and you agree')
    .replace(/\bCredible Client evidence\b/g,'Credible evidence from you')
    .replace(/\bClient (application owners|reviewers?|review|approvers?|approval|team|owners?|stakeholders?|administrators?|admins?|users?|expertise|feedback|evidence|facts|data|content|assets|access|input|decisions?|sign-off|resources|systems|environment|tenant|accounts?|contacts?|teams?|side)\b/g,(m,w)=>w==='side'?m:'your '+w)
    .replace(/\bfor the customer\b/g,'for you')
    .replace(/\b([Pp])artner-(built|designed|managed|written|led|run|owned|created|developed|maintained|operated|delivered), (tested|validated|approved|documented|reviewed) /g,(m,p,a,b)=>(p==='P'?'Our ':'our ')+a+' and '+b+' ')
    .replace(/\b([Pp])artner-(?:built|designed|managed|written|led|run|owned|created|developed|maintained|operated|delivered)\b/g,(m,p)=>p==='P'?'Our':'our').replace(/\b([Tt]he|[Aa]n?) [Oo]ur\b/g,(m,a)=>/^[TA]/.test(a)?'Our':'our')
    .replace(/\b[Aa] partner (test|method|pilot|boundary|estimate|validation|workflow|service|deliverable|sheet|test method)\b/g,'our $1')
    .replace(new RegExp('(\\b(?:and|or)|,) the partner (?=(?:[a-z]+(?:s|es|ies|ed)|will|would|can|must|should|may|is|has|does|are|have|do|was|were|did)\\b)','g'),'$1 we ')
    .replace(new RegExp('\\b('+OBJ_VERBS+') the partner\\b','g'),'$1 us')
    .replace(/\b(of|with|by|for|to|between|from|across|and|or|than|like|through|at|on|in|among|including|against) the partner\b/g,'$1 us').replace(/, the partner\b/g,', us')
    .replace(/\bThe partner's\b/g,'Our').replace(/\bthe partner's\b/g,'our').replace(/\bThe partner\b/g,'We').replace(/\bthe partner\b/g,'we').replace(/\bPartners\b/g,'We')
    .replace(new RegExp('\\b([Yy]ou) (already|also|then|still|first|now|currently|typically|usually|only|regularly|routinely|normally) ('+VERBS_ALL+')\\b','g'),(m,y,a,v)=>y+' '+a+' '+conj(v))
    .replace(new RegExp('\\b([Yy]ou) ('+YOU_VERBS+'|'+MORE_VERBS+')\\b','g'),(m,y,v)=>y+' '+conj(v))
    .replace(new RegExp('\\b([Ww]e) ('+WE_VERBS+'|'+MORE_VERBS+')\\b','g'),(m,w,v)=>w+' '+conj(v))
    .replace(new RegExp(SUBJ+'([Ww]e|[Yy]ou)\\b([^.;:]*?) and ('+VERBS_ALL+')\\b','g'),(m,lead,w,mid,v)=>lead+w+mid+' and '+conj(v))
    .replace(new RegExp(SUBJ+'([Ww]e|[Yy]ou)\\b([^.;:,]*?), ('+VERBS_ALL+')\\b','g'),(m,lead,w,mid,v)=>lead+w+mid+', '+conj(v))
    .replace(/\b([Ww]e|[Yy]ou) (was|has|is)\b/g,(m,w,v)=>w+' '+({was:'were',has:'have',is:'are'}[v]))   // "the partner was given access" became "we was"
    .replace(new RegExp(SUBJ+'([Yy]ou)\\b([^.;:]*?) its (own|approvers?|reviewers?|teams?|record-keeping|CDN console|logs|data|sites?|systems?|IT team|licensed deployment|licen[cs]es?|accounts?)\\b','g'),(m,lead,w,mid,n)=>lead+w+mid+' your '+n);   // "you confirm its own needs" is "your own"
  s=s.replace(/\b(of|with|by|for|to|between|from|across|among|including|against) we and you\b/g,'$1 us and you');   // the pair as an object
  s=s.replace(/([.!?]\s+)([a-z])/g,(m,a,b)=>a+b.toUpperCase());   // a sentence that lost its capital to a swap gets it back
  if(/^[A-Z]/.test(String(t||''))&&/^[a-z]/.test(s))s=s[0].toUpperCase()+s.slice(1);
  return s;
}
// What the client must never read, whatever the source: Adobe's lifecycle labels (the SOW's own client rules, kept in
// `rules.sow_replacements` on the page), the word legacy, and the canvas and pricing talk written for the partner.
const CLIENT_SWAPS=[[' (the V2 card is Legacy)',''],['the Legacy at.js route',"the at.js route (Adobe's earlier library)"],['Legacy at.js route',"The at.js route (Adobe's earlier library)"],['confirm it is Available with test searches','check that it shows as available with test searches'],['the legacy at.js',"at.js, Adobe's earlier library"],['legacy Target configurations','earlier Target configurations'],['the legacy configuration for fragment export','the earlier configuration for fragment export'],['No legacy or enhanced connector','No earlier or enhanced connector'],['legacy or enhanced connector','earlier or enhanced connector'],[' (legacy reference page)',''],[' when CJA is on the canvas',' when Customer Journey Analytics is part of this proposal'],[' is on the canvas',' is part of this proposal'],[' on the canvas',' in this proposal'],[' in its current scope',''],[' in the current scope',''],['priced once, ',''],['where the SOW identifies ','where there is '],[' the SOW ',' the statement of work '],['Do not assume','We do not assume'],['state whether','agree with you whether']];
// a sentence written for the partner about the canvas is dropped; "product cards" and "the destination card" are the client's own words and stay
const CLIENT_DROP=/\bon the [A-Z][\w +.'-]* card\b|\bthis card\b|\bMore services\b|\bservice out\b|\bServices tab\b|\bBuild tab\b|\bcounted once\b|\bpriced once\b|\bCreate your own play\b|\bon the canvas\b/;
function clientScrub(t){
  let s=String(t||'');
  const R=typeof rules!=='undefined'&&rules&&rules.sow_replacements?rules.sow_replacements:[];
  for(const [a,b] of R)s=s.split(a).join(b);
  for(const [a,b] of CLIENT_SWAPS)s=s.split(a).join(b);
  s=s.replace(/\bLegacy\b/g,'Earlier').replace(/\blegacy\b/g,'earlier').replace(/\bABV\b/g,'Brand Visibility');
  if(CLIENT_DROP.test(s))s=s.split(/(?<=[.!?])\s+/).filter(x=>!CLIENT_DROP.test(x)).join(' ');
  return s.trim();
}
function singular(v){if(/ies$/.test(v))return v.replace(/ies$/,'y');if(/(sh|ch|x|ss)es$/.test(v))return v.replace(/es$/,'');return v.replace(/s$/,'');}
// the partner's own note speaks to the partner: "the Client" is "your client" there (step 54, finding 6.4), and the partner reads about
// itself as "you": "the partner confirms its date" is "you confirm its date", "Partner-built, tested Skills" are "Skills you build and test"
const PRESENT={built:'build',designed:'design',managed:'manage',written:'write',led:'lead',run:'run',owned:'own',created:'create',developed:'develop',maintained:'maintain',operated:'operate',delivered:'deliver',tested:'test',validated:'validate',approved:'approve',documented:'document',reviewed:'review'};
const PART='built|designed|managed|written|led|run|owned|created|developed|maintained|operated|delivered',NOUN='(?:[\\w\\/-]+ ){0,2}?(?:workflows?|patterns?|[Ss]kills?|process(?:es)?|methods?|boundar(?:y|ies)|estimates?|pilots?|routes?|jobs?|scripts?|blocks?|connectors?|integrations?|extensions?|plugins?|pipelines?|dashboards?|reports?|templates?|deliverables?|sheets?|checks?|tests?|rules?)';
function partnerVoice(t){
  let s=String(t||'').replace(/[\u2018\u2019]/g,"'")
    .replace(/\b([Tt])he Client and (?:the )?partner\b/g,(m,c)=>(c==='T'?'You':'you')+' and your client').replace(/\b([Tt])he partner and (?:the )?Client\b/g,(m,c)=>(c==='T'?'You':'you')+' and your client')
    .replace(/\bCredible Client evidence\b/g,'Credible evidence from your client')
    .replace(/\bClient-authori[sz]ed ([a-z]+(?: [a-z]+)?)\b/g,'$1 your client authorizes')
    .replace(/\b([Tt]he )?Client-(?!side\b|ID\b|Secret\b)(\w+)/g,(m,a,w)=>(a&&a[0]==='T'?"Your client's ":"your client's ")+w)
    .replace(/\bClient (application owners|reviewers?|review|approvers?|approval|team|owners?|stakeholders?|administrators?|admins?|users?|expertise|feedback|evidence|facts|data|content|assets|access|input|decisions?|sign-off|resources|systems|environment|tenant|accounts?|contacts?|teams?)\b/g,"your client's $1")
    .replace(/\bThe [Cc]lient's\b(?! ID| Secret)/g,"Your client's").replace(/\bthe [Cc]lient's\b(?! ID| Secret)/g,"your client's").replace(/\bThe [Cc]lient\b(?! ID| Secret)/g,'Your client').replace(/\bthe [Cc]lient\b(?! ID| Secret)/g,'your client')
    .replace(new RegExp('\\b(?:([Tt]his|[Aa]n?|[Tt]he) )?([Pp])artner-('+PART+'), (tested|validated|approved|documented|reviewed) ('+NOUN+')\\b','g'),(m,a,c,v1,v2,n)=>(a?a+' ':c==='P'?'The ':'')+n+' you '+PRESENT[v1]+' and '+PRESENT[v2])
    .replace(new RegExp('\\b(?:([Tt]his|[Aa]n?|[Tt]he) )?([Pp])artner-('+PART+') ('+NOUN+')\\b','g'),(m,a,c,v,n)=>(a?a+' ':c==='P'?'The ':'')+n+' you '+PRESENT[v])
    .replace(new RegExp('\\b[Pp]artner-('+PART+')\\b','g'),'$1 by you')
    .replace(/\b[Aa] partner (test method|pilot boundary|test|method|pilot|boundary|estimate|validation|workflow|service|deliverable|sheet)\b/g,'your $1')
    .replace(/\bThe partner's\b/g,'Your').replace(/\bthe partner's\b/g,'your').replace(/\bThe partner\b/g,'You').replace(/\bthe partner\b/g,'you')
    .replace(new RegExp('\\b([Yy]ou) ('+VERBS_ALL+')\\b','g'),(m,y,v)=>y+' '+conj(v))
    .replace(new RegExp(SUBJ+'([Yy]ou)\\b([^.;:]*?) and ('+VERBS_ALL+')\\b','g'),(m,lead,w,mid,v)=>lead+w+mid+' and '+conj(v));
  s=s.replace(/([.!?]\s+)([a-z])/g,(m,a,b)=>a+b.toUpperCase());
  return /^[A-Z]/.test(String(t||''))&&/^[a-z]/.test(s)?s[0].toUpperCase()+s.slice(1):s;   // "Client-designated reviewers" opens as "Your client's designated reviewers"
}
const lc=s=>s?s[0].toLowerCase()+s.slice(1):s;
const listOf=a=>a.length>1?a.slice(0,-1).join(', ')+' and '+a[a.length-1]:a[0]||'';
// Step 53: a scope that opens with a setting clause ("Where ..., set up", "For the agreed accounts (...), authorize",
// "Using the agreed route, check", "In Cloud Manager, set up") keeps the clause and takes "we will" after it.
const CLAUSE=/^(where|if|for|when|once|after|with|in|using|before|during|through|on|at|within|from|under|across|as|while|unless|until|whenever|wherever)\b/i;
// the verbs a service scope opens with, so a clause is cut where the work starts ("..., Google Cloud Storage or SFTP: create")
const VERB=/^(?:configure|set|define|plan|build|create|connect|implement|design|run|train|map|document|review|publish|assess|rationali[sz]e|decide|turn|identify|install|enable|validate|test|audit|migrate|export|import|link|prepare|agree|choose|add|assign|load|register|deploy|write|author|model|extract|check|hand|produce|improve|draft|refresh|monitor|track|update|optimi[sz]e|extend|package|pilot|measure|tune|triage|schedule|align|capture|collect|curate|establish|operate|maintain|reconcile|complete|support|coordinate|work|ship|onboard|provision|share|host|generate|record|report|respond|resolve|label|tag|apply|use|replace|move|clean|govern|wire|secure|scope|size|confirm|rank|prompt|gather|compare|guide|coach|convert|describe|provide|activate|compute|propose|enrich|stand|carry|print|style|fit|index|segment|personali[sz]e|surface|automate|rebuild|simplify|trim|prioriti[sz]e|fix|teach|engage|retire|send|allow|give|grant|store|place|bulk|obtain|keep|include|limit|uninstall|re-?point|route|forward|upload|download|read|verify|approve|roll|open|close|start|stop|launch|cut|join|merge|split|pick|name|list|show|hide|remove|delete|clear|sync|match|flag|notify|invite|watch|log|gate|wrap|draw|lift|hold|take|put|bring|sort|rate|score|weigh|adjust|repeat|rerun|rotate|swap|lock|unlock|make|ensure|let|tell|ask|find|book|arrange|order|sample|calibrate|instrument|mount|code|script|locali[sz]e|translate|unpublish|archive|back|restore|renew|hash|normali[sz]e|dedupe|stitch|attribute|forecast|target|suppress|exclude|append|prepend|point|pair|tier|budget|bill|invoice|charge|quote|estimate|sign|accept|reject|escalate|hand|pass|copy|paste|clone|fork|branch|tag|pin|group|cluster|rank|bucket|classify|dedup|hash|redact|mask|encrypt|decrypt|allowlist|whitelist|block|throttle|cache|purge|invalidate|warm|preload|lazy-load|compress|resize|crop|render|preview|stage|promote|demote|roll|cut|ship)\b/i;
const NOUNISH=/^(?:use cases?|set of|run rate|report builder|record types?|release notes|test set|build pipeline|design system|support tickets?|change requests?|access logs?|review rounds?|plan view|sign-?in|setup|check-?ins?|place(?:ment)?s? of|model answers?|train(?:ing)? scope|work management|monitor(?:ing)? dashboards?)\b/i;
const NOT_VERB=/^(?:a|an|the|your|our|we|you|us|it|its|they|their|them|this|that|these|those|each|all|any|some|no|not|and|or|but|is|are|was|were)\b/i;
const opensWork=rest=>!!rest&&VERB.test(rest)&&!NOUNISH.test(rest)&&!NOT_VERB.test(rest);
function splitClause(scope){
  if(!CLAUSE.test(scope))return null;
  let depth=0;
  for(let i=0;i<Math.min(scope.length,260);i++){const c=scope[i];
    if(c==='(')depth++;else if(c===')')depth=Math.max(0,depth-1);
    else if((c===','||c===':')&&depth===0){const head=scope.slice(0,i),rest=scope.slice(i+1).trim();
      if(opensWork(rest)&&head.split(/\s+/).length>=2)return [head,rest];   // 'For a CDN without a guide, or logs in a log store: build' keeps looking past 'or'
      if(c===':')return null;}}
  return null;
}
// one imperative sentence or clause of a scope, as the partner's promise
function promise(s,first){
  s=s.trim();if(!s)return '';
  let m=/^each month,?\s+(.*)$/i.exec(s);if(m)return (first?'Each month we will ':'each month we will ')+lc(m[1]);
  const cl=splitClause(s);if(cl)return cl[0]+', we will '+lc(cl[1]);
  if(first||opensWork(s))return (first?'We will ':'we will ')+lc(s);
  const m2=/^(and|then|or) (.*)$/i.exec(s);if(m2&&opensWork(m2[2]))return m2[1].toLowerCase()+' we will '+lc(m2[2]);   // '...; and align ...' becomes '...; and we will align ...'
  return s;
}
// Step 53: every sentence and semicolon clause of a scope is a promise ("We will ...; for standard repositories, we will ...
// We will confirm ..."), so the client never reads a bare instruction
function doLine(id){const L=LN[id],scope=clientScrub(rfp(L.scope||(TPL[id]||{}).scope||L.name));
  const sentences=scope.split(/(?<=[.!?])\s+(?=[A-Z])/);
  return sentences.map((sent,si)=>{
    const parts=sent.split(/;\s+/);
    return parts.map((p,pi)=>{const out=promise(p,si===0&&pi===0);return pi===0?out[0].toUpperCase()+out.slice(1):out;}).join('; ');
  }).join(' ');}
// every drafted line's own page first, then the lines' references, then the connections' sources (step 52)
function sources(m){const out=[],seen=new Set();const add=(url,title)=>{if(!url||seen.has(url))return;seen.add(url);out.push({url,title:clientScrub(title||url)});};
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
/* ---------- part three: the knowledge base (Adam: yes to the 2.6 picture, sow/mockups/part3_kb/answer_2_6.png). RFP_FACTS is
   sow/rfp_facts.json, built by sow/rfp_prototype/part3_research/build_facts.py from sentences each backed by a quote checked on
   Adobe's public pages. A hosting, security, sign-in, uptime, privacy or licensing question gets those sentences for the products
   it names, or, when it names none, for the products the RFP's other answers draw on; each sentence carries its numbered Adobe
   source. Where Adobe's pages disagree or say nothing, the product goes to Confirm with Adobe, never into the response. Licensing
   terms (editions, how a product is metered) stay in the partner's note; only "needs its own license" sentences reach the client. */
const KB=typeof RFP_FACTS!=='undefined'?RFP_FACTS:null;
const KB_TOPICS=[
 ['hosting',/\b(?:host|hosted|hosting|data cent(?:er|re)s?|residency|resides?|regions?|regional|located|locations?|sovereign\w*|stored|cloud providers?)\b/i],
 ['certifications',/\b(?:certif\w*|soc ?[123]|iso(?:\/iec)? ?27\d*|pci(?: dss)?|fedramp|irap|csa star|attestations?|security)\b/i],
 ['hipaa',/\b(?:hipaa|health ?care|phi)\b/i],
 ['encryption',/\b(?:encrypt\w*|at rest|in transit|tls|customer[- ]managed keys?|cmk|byok|encryption keys?|security)\b/i],
 ['sso',/\b(?:sso|single sign[- ]on|saml|okta|entra|azure ad|active directory|identity providers?|idp|federat\w*|mfa|multi[- ]factor)\b/i],   // "after they log in" is a visitor's sign-in, not single sign-on
 ['uptime',/\b(?:uptime|sla|service levels?|availability|downtime|disaster recovery|backups?|rto|rpo|failover|outages?|resilien\w*)\b/i],
 ['privacy',/\b(?:privacy|gdpr|ccpa|consent|data subjects?|retention|retain\w*|delet\w*|personal data|pii|opt[- ]?(?:in|out))\b/i],
 ['licensing',/\b(?:licen[cs]\w*|editions?|packages?)\b/i]];
const SUP='⁰¹²³⁴⁵⁶⁷⁸⁹',sup=ns=>ns.map(n=>String(n).split('').map(c=>SUP[c]).join('')).join(',');
const kbDate=s=>{const d=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||'');return d?['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d[2]-1]+' '+Number(d[3])+', '+d[1]:'';};
let kbBusy=false;
// the Adobe products the RFP's other answers draw on, in the order the answers first use them
function proposedProducts(q){if(kbBusy)return [];kbBusy=true;const out=[];
  try{for(const o of rfpState.questions){if(o===q||o.kind!=='adobe')continue;const d=o.draft||compose(o);if(!d||d.kb)continue;
    for(const id of d.m.products)if(P[id]&&!P[id].outside&&!out.includes(id))out.push(id);}}finally{kbBusy=false;}
  return out;}
function kbDraft(q,text,context,extra){
  if(!KB)return null;
  const topics=KB_TOPICS.filter(t=>t[1].test(text)).map(t=>t[0]);if(!topics.length)return null;
  const adobe=ids=>ids.filter(id=>P[id]&&!P[id].outside);
  let prods=q.pick?adobe(q.pick):adobe(detectAll(text).named),fromRFP=false;
  if(!q.pick&&!prods.length)prods=adobe(detectAll(context).named);
  if(!q.pick&&!prods.length){prods=proposedProducts(q);fromRFP=true;}
  if(!prods.length)return null;
  const order=id=>prods.indexOf(id),mine=st=>Array.isArray(st.for)?st.for.filter(id=>prods.includes(id)).sort((a,b)=>order(a)-order(b)):[];
  const nums=[],num=i=>{if(!nums.includes(i))nums.push(i);return nums.indexOf(i)+1;};
  const sections=[],tight=[],sells=[],confirm=[],asks=[],clientAsks={},last={},lastT={};let facts=0;
  const put=(S,head,items)=>{if(!items.length)return;let s=S.find(x=>x[0]===head);if(!s)S.push(s=[head,[]]);
    for(const it of items){const prev=s[1][s[1].length-1],lab=/^([^:]{1,200}): /.exec(it);   // one bullet per product: a second sentence for the same products joins the first
      if(lab&&prev&&prev.startsWith(lab[0])){const more=it.slice(lab[0].length);s[1][s[1].length-1]=prev+' '+more[0].toUpperCase()+more.slice(1);}else s[1].push(it);}};
  for(const t of topics){
    const all=KB.statements.filter(st=>st.topic===t),items=[],itemsT=[],has=new Set();
    for(const st of all)if(st.client!==false&&Array.isArray(st.for))for(const id of mine(st))has.add(id);
    const lack=prods.filter(id=>!has.has(id));
    const whole=st=>st.for==='*'&&(!st.only||st.only.some(id=>prods.includes(id)))&&(st.when!=='missing'||lack.length);
    // step 67: every sentence is said twice, in full and in its shorter wording (st.short, the same facts in fewer words), so an RFP
    // with a word limit gets the shorter one; a sentence whose shorter wording is empty is left out of it
    const say=(st,label,short)=>{const ns=(st.src||[]).map(num),text=(short&&st.short!==undefined?st.short:st.text).replace('{missing}',listOf(lack.map(id=>P[id].name)));return text?(label?label+': ':'')+text+(ns.length?sup(ns):''):'';};
    const both=(st,label,A,B)=>{A.push(say(st,label));const t=say(st,label,true);if(t)B.push(t);};
    for(const st of all)if(st.client!==false&&whole(st)&&!st.own)both(st,'',items,itemsT);
    for(const st of all.filter(st=>st.client!==false&&mine(st).length).sort((a,b)=>order(mine(a)[0])-order(mine(b)[0]))){both(st,listOf(mine(st).map(id=>P[id].name)),items,itemsT);facts++;}
    const head=KB.topics[t];
    for(const st of all)if(st.client!==false&&whole(st)&&st.own)both(st,'',last[head]=last[head]||[],lastT[head]=lastT[head]||[]);   // our own sentence closes its section
    for(const st of all)if(st.client===false&&mine(st).length)sells.push(listOf(mine(st).map(id=>P[id].name))+': '+st.text);
    put(sections,head,items);put(tight,head,itemsT);
    const specific=KB.confirm.filter(c=>(c.topic===t)&&c.for.some(id=>prods.includes(id)));
    for(const c of specific)if(!confirm.includes(c.text))confirm.push(c.text);
    const told=new Set(specific.flatMap(c=>c.for)),gap=lack.filter(id=>!told.has(id));
    if(gap.length&&t!=='licensing')confirm.push(t==='certifications'?'Certifications for '+listOf(gap.map(id=>P[id].name))+': not named on Adobe\'s Trust Center compliance list. Ask Adobe which certifications cover '+(gap.length>1?'them':'it')+'.':
      head+' for '+listOf(gap.map(id=>P[id].name))+': not on the Adobe pages this tool holds. Ask Adobe before you answer for '+(gap.length>1?'them':'it')+'.');
    for(const a of KB.asks)if(a.topic===t&&!asks.includes(a.text)){asks.push(a.text);clientAsks[a.text]=a.client;}
  }
  for(const c of KB.confirm)if(c.topic==='*'&&c.for.some(id=>prods.includes(id))&&!confirm.includes(c.text))confirm.push(c.text);
  for(const head of Object.keys(last)){put(sections,head,last[head]);put(tight,head,lastT[head]);}
  if(!facts)return null;   // no sourced fact about the products in this question: the capability box, never an answer made only of general lines and our own promises
  return Object.assign({kb:true,fromRFP,checked:KB.checked,m:{products:prods,conn:null,conns:[],missing:[],lines:[],fromContext:false},sections,tight,
    sources:nums.map(i=>({url:KB.sources[i].url,title:KB.sources[i].title})),sells,asks,confirm,assumptions:[],notes:[],clientAsks},extra);
}
const NEEDS=/\b(?:need|require|expect|want)s? (?:anything |something )?(?:from|of) (?:us|our|you)\b|\bdo you need\b|\banything you (?:need|require)\b|\bwhat (?:do|would|will) you need\b/i;
function compose(q,ctx){
  if(!q||q.kind!=='adobe')return null;                                         // To sort and Your firm questions are never drafted
  const text=q.text,owned=ownedProducts(),context=askedUnder(q);
  const extra={firmPart:q.firmPart||'',requirement:!!q.requirement};
  if((F.factShaped(text)&&!NEEDS.test(text))||(q.requirement&&FACT_TOPIC.test(text))){              // a yes/no or fact question: no build plan
    const kb=kbDraft(q,text,context,extra);if(kb)return kb;                     // part three: answered from the knowledge base where it holds the topic
    const d=detectAll(text),prods=(q.pick||(d.named.length?d.named:detectAll(context).named)).filter(id=>P[id]);
    return Object.assign({capability:true,m:{products:prods,conn:null,conns:[],missing:[],lines:[],fromContext:false},sections:[],sources:[],links:capLinks(text,prods),sells:[],asks:[],uncovered:d.uncovered.length?d.uncovered:null,excluded:d.excluded.length?d.excluded:null},extra);
  }
  let m=match(text,{context,ctx:ctx||(isOngoing(text)?proposalProducts(q):contextProducts()),pick:q.pick});
  const ai=aiOf(q);if(ai&&ai.services.length)m.lines=ai.services;
  if(!ai)m=kbAllowedMatch(q,m);   // Round 4: no-AI services must respect the client's product prohibitions.
  // Round 4: recover only a missing no-AI draft, from strong evidence within the RFI's named products.
  // Saved AI answers and manual product picks retain their existing paths.
  if(!m.lines.length&&!ai&&!q.pick){const scoped=scopeEvidence(q,rfpText());if(scoped)m=scoped;}   // step 88: the services the AI's answer rests on are the answer's services
  if(!m.lines.length&&!ai){   // step 89: an AI answer that rests on no catalog service is still the answer
    if(m.uncovered.length&&!m.products.filter(id=>!P[id].outside).length)return Object.assign({uncovered:m.uncovered,m:Object.assign({},m,{products:[]}),sections:[],sources:[],links:[],sells:[],asks:[],excluded:m.excluded.length?m.excluded:null},extra);
    return kbDraft(q,text,context,extra);                                      // no line found: the knowledge base where it holds the topic, else No match, never one empty sentence
  }
  const names=m.products.filter(id=>!P[id].outside||(m.conn&&[m.conn.a,m.conn.b].includes(id))).map(id=>P[id].name);
  const approach=[],lead=q.requirement?'We would meet this by using ':'We would deliver this with ';
  const ex=explainFor(text,m);   // step 67: the sentences from Adobe's pages that answer what the question asks
  if(m.conn){
    if(q.requirement)approach.push(lead+listOf([P[m.conn.a].name,P[m.conn.b].name])+'.');
    approach.push(...ex.lead);
    // step 53: the client-voice how and gain written for the response, where the catalog has them; the partner's card text
    // otherwise, scrubbed of labels and canvas talk
    const explained=ex.pairs.some(f=>f.includes(m.conn.a)&&f.includes(m.conn.b));   // step 67: the opening sentences already say how the two work together
    if(!explained)approach.push(clientScrub(rfp(m.conn.sowHow||m.conn.how||'')));
    if(explained);else if(m.conn.sowGain)approach.push(clientScrub(rfp(m.conn.sowGain)));else if(!m.conn.sowHow&&m.conn.gain&&m.conn.gain.text)approach.push(clientScrub(rfp(m.conn.gain.text)));
    const more=m.conns.slice(1,4).map(c=>P[c.a].name+' and '+P[c.b].name);
    approach.push(...ex.more);
    if(more.length)approach.push('The proposal also uses the documented connection'+(more.length>1?'s':'')+' between '+more.join(', and between ')+'.');
  }
  else if(m.fromContext)approach.push(ongoingLead(inOrder(m)));
  else{if(q.requirement||!(ex.lead.length+ex.more.length))approach.push(lead+listOf(names)+'.');approach.push(...ex.lead,...ex.more);}
  const ordered=inOrder(m),work=ordered.filter(id=>LN[id].unit!=='monthly').map(doLine),after=ordered.filter(id=>LN[id].unit==='monthly').map(doLine);
  const sections=[['Our approach',approach.filter(Boolean)],['What we would do',work],['After launch',after]].filter(s=>s[1].length);
  const estimate=[];
  if(DURATION.test(text)&&work.length){const hours=m.lines.filter(id=>LN[id].unit!=='monthly').reduce((n,id)=>n+(Number(LN[id].base)||0),0);
    estimate.push('About '+hours.toLocaleString('en-US')+' hours of our work for the services above, at a typical size. We would confirm the schedule with you once the scope is agreed.');
    sections.push([ESTIMATE,estimate]);}
  // Nov 9 (Adam): the prerequisites are not part of the answer to the client. They become a note for the partner.
  // Step 54 (Nov 10, Adam's decision 1): four lists, no cap, and the matched lines' own requirements too. The asks carry
  // a tick box; the ticked ones go into the response as "What we would need from you", a typed fact moves its item to
  // "What you already have in place".
  const n=noteItems(m,owned);
  for(const a of ex.asks)if(!n.asks.includes(a.text)){n.asks.push(a.text);n.clientAsks[a.text]=a.client;}
  const src=[...ex.sources,...sources(m)].filter((x,i,a)=>a.findIndex(y=>y.url===x.url)===i);
  return Object.assign({m,ai,sections,parts:{approach:approach.filter(Boolean),explain:[...ex.lead,...ex.more],extra:ex.extra,explainSources:ex.sources,licensing:ex.licensing,ordered,estimate},sources:src,sells:n.sells,asks:n.asks,confirm:[...n.confirm,...ex.confirm.filter(c=>!n.confirm.includes(c))],assumptions:n.assumptions,notes:n.notes,clientAsks:n.clientAsks,askLine:n.askLine,uncovered:m.uncovered.length?m.uncovered:null,excluded:m.excluded.length?m.excluded:null},extra);
}
// Step 54, third round (Nov 10 2026, after two rounds of skeptics): one rule per kind of fact, tested on the sentence's opening clause
// without its parentheticals. A license line names the license near its start ("Brand Visibility license; ...", "For CJA audiences in
// Target: a Real-Time CDP or Journey Optimizer entitlement ..."); a license word in passing ("depending on the CJA entitlement") is not one.
const LICENSE=/\b(?:licen[cs]es?|offering|entitlements?|editions?|packages?|add-ons?|SKU)\b|\blicen[cs]ed (?:separately|through)\b|\b(?:has|have|is|are) licensed\b/i,PAID=/\bpaid [A-Z]/;
// what only Adobe does: provisioning, onboarding, Customer Care, a Support ticket, enabling an integration
const ADOBE_PERFORMS=/\b(?:provisioned|configured|enabled|set up|issued|activated|switched on|turned on) by Adobe\b|\bAdobe(?:'s)? (?:support|onboarding|professional services|engineering) team\b|\bAdobe's (?:support|onboarding|professional services)\b|\bAdobe Support\b|\bAdobe onboarding\b|\bCustomer Care\b|\bAdobe (?:enabling|enables|turns on|has turned on|to enable|has to enable|must enable)\b|\bAdobe(?: \w+){0,3} has enabled\b/i;
// what only Adobe can confirm: a route Adobe does not document, Adobe's own statement, a written confirmation, the CSM or TAM
const ADOBE_DOES=/\b(?:by Adobe\b|confirm(?:ed|s)?(?: [\w'-]+){0,9} with Adobe|Adobe confirms|Adobe does not document|which Adobe does not|not document(?:ed)?\b|does not say\b|Adobe says|Adobe states|Adobe marks|Adobe's direction|co-innovation|One Adobe lab|AEM Engineering|Adobe enablement is|written confirmation from Adobe|Adobe's written confirmation|written Adobe confirmation|\bCSM\b|\bTAM\b|Try Before You Buy)/i;
const ASK_ADOBE=/\bconfirm(?:ed|s)?(?: [\w'-]+){0,9} with Adobe\b|\bconfirm with the CSM\b|\bwith the CSM or TAM\b/i;   // an instruction to ask Adobe, wherever it sits in the sentence
// a statement of scope or exclusion, not something to ask the client for
const ASSUMPTION=/\btraining scope\b|\bnot an? (?:software|Adobe|seat) (?:seat )?limit\b|\bnot supported\b|\bstays? unchanged\b|\bboundary\b|\bdoes not list\b|\bis reused\b|\b(?:is|are) measured with\b|\bno native\b|\bno pre-built\b|\bnot acceptance requirements\b|\bisn't charged again\b|\bnot charged again\b|\bcannot change after\b|\breports? to one source only\b|\bis (?:a |an )?(?:separate|separately) \w+ work\b|\bwould be separate work\b|\bis out of scope\b|\bare out of scope\b|\bonly where\b.*\bis confirmed\b|\bno (?:[a-z]+ )?connector is assumed\b|\bis included here once\b|\b(?:is|are) built and tested\b|\bpermissions apply\b|\bactions are supported\b|\bThis is (?:a |an |our )?(?:partner )?(?:test|pilot) method\b|\bcovers only eligible\b|\bis priced once\b|^(?:The partner and the Client|the Client and the partner|we and you|you and we)\b|\bPartner-built\b|\bscope a partner-run\b|\bIf that capability is unavailable\b|\bcannot be enabled\b|\bis the service scope\b|\bis the one monthly\b|\bfits within\b/i;
// a statement about how a product or the service behaves ("Scheduled refresh on 75 to 150 audiences, depending on the CJA entitlement")
const STATEMENT_START=/^(?:Included with|Availability:|Applies\b|(?:An?|The) [^,;:]{1,60} (?:is|are) included\b)/;
const STATEMENT_STRONG=/\b(?:is|are) (?:not )?assumed\b|\bneeds? no\b|\bcounts? (?:against|toward)\b|\bdepend(?:s|ing) on\b|\b(?:Adobe|Adobe's [\w' ]{1,25}|Data Connection|The plugin guide) (?:lists|documents|covers)\b|\bmay need\b|\bcomes? from\b|\bwith no\b|^[A-Z][a-z]+ing\b[^,;:]{0,80}\b(?:needs?|stays?|requires?|each need)\b/;
const STATEMENT=/\b(?:cannot|can't|are not|is not|do not|does not|don't|doesn't|isn't|aren't|never|only|with no)\b|^not\b/i;
const ASKSHAPE=/\b(?:you|your|client|user|users|admin|administrator|owner|reviewer|approver|access|licen[cs]e|approv|provide|suppl|grant|name[sd]?\b|forward|enable|turn(?:ed|s)? on|connected|installed|set up|implemented|configured|provisioned|deployed|registered|authored|entitlement|headroom|permission|credential|token|sign-?in|account|contact|allocated|assign|available|availability|consent|allowed|allow|acceptance|accept|confirmation|reviewers|headcount|stakeholder|decision|approved|budget|ownership|owned)/i;
// an instruction written for the partner that opens the clause ("confirm the back-office route before adding those datasets", "Select each destination's identity types")
const TO_PARTNER=/^(?:confirm|document|resolve|validate|scope|treat|get|obtain|check|verify|agree|select|apply|publish|deploy|identify|use|configure|install|create|build|set up|map|load|register|run|test|review|do not)(?= (?!with Adobe\b|route\b|permission\b|cases?\b|rate\b|stays?\b|tickets?\b)[a-z])/i;
// the client doing something ("The Client confirms the supported CJA edition ..."): an ask, whatever else the sentence mentions
const CLIENT_DOES=/^(?:The Client|Your client|the Client|your client)(?:'s [\w-]+(?: [\w-]+)?)? (?:confirms?|provides?|supplies?|names?|approves?|grants?|controls?|runs?|keeps?|gives?|adds?|shares?|agrees?|decides?|appoints?|designates?|nominates?|allows?|signs?|sets?|completes?|accepts?|reviews?|owns?|manages?|installs?|forwards?|exports?|turns?|enables?)\b/;
// a template sentence is an ask only when the client, its people or its things are its subject (finding 6.7); the rest are assumptions
const CLIENT_ASK=/^(?:The Client|Your client|The client|Client[\s-][\w-]+|Your [\w-]+|You\b|Channel owners|Administrators|Legal|Someone|Users|An? (?:[\w-]+ ){0,3}(?:administrator|admin|owner|team|reviewer|approver|developer))\b|\b(?:the Client|your client|Client (?:administrators?|admins?|owners?|reviewers?|team)) (?:provides?|supplies?|names?|confirms?|approves?|grants?|owns?|controls?|runs?|keeps?|gives?|adds?|shares?|agrees?|decides?|appoints?|designates?|nominates?|allows?|signs?|has|have|licenses?|sets?|completes?|accepts?)\b|\b(?:the Client and (?:the )?partner|the partner and (?:the )?Client|we and you|you and we)\b/;
const CLIENT_STATE=/\b(?:are|is) (?:available|in place|supplied|provided|approved and available|accepted|live)\b/;   // "An approved prompt plan and supported workspace are available.": the client has these; only in the opening clause, so "before it is live" proves nothing
// a template sentence that gives the license and the client's duties in one breath is read as two (finding 6.3); so is a prerequisite that
// gives the license and Adobe's own work ("CX Enterprise Coworker licensed through the Adobe account team; Adobe's support ... team configures ...")
const HAS_AND=/^(The Client|Your client) has licensed (.+?) and ((?:provides|supplies|names|confirms|approves|grants|owns|controls|runs|keeps|gives|adds|shares|agrees|decides|appoints|designates|nominates|allows|signs|sets|completes|accepts|reviews|manages)\b.*)$/;
const ADOBE_PART=/^(.+?); ((?:Adobe(?:'s)? (?:support|onboarding|professional services|account)|Adobe Support)\b.*)$/;
function pieces(t,fromTemplate){let m;if(fromTemplate&&(m=HAS_AND.exec(t)))return [m[1]+' has licensed '+m[2]+'.',m[1]+' '+m[3]];if(!fromTemplate&&(m=ADOBE_PART.exec(t))&&m[1].split(/\s+/).length>=6)return [m[1],m[2]];return [t];}
const body=core=>core.replace(/^[^:;]{1,60}:\s*/,'').replace(/^(?:With|Without|Under|On|In|For|If|When|Where|Once) [^,;:]{1,40}, /,'');   // without a leading label ("Web SDK route:", "For Fusion:") or setting clause ("With the Ultimate package, ")
const firstClause=core=>body(core).split(/[;:]/)[0];
const licenseAt=(core,n)=>{const head=firstClause(core).split(/\s+/).slice(0,n).join(' ');return LICENSE.test(head)||PAID.test(head);};   // a license noun among the opening words
function noteItems(m,owned){
  const inAnswer=[...new Set([...m.products,...(m.conn?[m.conn.a,m.conn.b]:[])])];
  const sells=[],asks=[],confirm=[],assumptions=[],notes=[],seen=new Set(),clientAsks={};
  // one list per fact; a repeat in other words is a different fact until a reader says otherwise (the near-duplicate rule of the first build hid prerequisites)
  const push=(list,t)=>{t=String(t||'').trim();const k=t.toLowerCase().replace(/[.\s]+$/,'');if(!t||seen.has(k))return false;seen.add(k);list.push(t);return true;};
  const place=(n,cv,fromTemplate)=>{
    const core=n.replace(/\([^)]*\)/g,' ').replace(/\s+/g,' ').trim(),first=firstClause(core);   // a parenthetical aside does not decide the sentence's kind
    const about=detect(core).filter(id=>inAnswer.includes(id)),license=()=>push(about.some(id=>owned.has(id))?asks:sells,n);   // a license the RFP says the client runs is confirmed with the client, not sold or assumed; the product in a parenthetical aside ("CJA's page requires it") is not the one licensed
    if(ASSUMPTION.test(first))return push(assumptions,n);
    if(CLIENT_DOES.test(core))return push(asks,n);
    if(ASK_ADOBE.test(n)||(cv&&ASK_ADOBE.test(cv)))return push(confirm,n);                       // "confirm with Adobe", in the partner's or the SOW's words
    if(STATEMENT_START.test(core)||STATEMENT_STRONG.test(first))return push(assumptions,n);
    if(licenseAt(core,6)&&/^(?:[A-Z]|an? |the )/.test(first)&&!ADOBE_PERFORMS.test(first))return license();
    if(ADOBE_DOES.test(core)||(cv&&ADOBE_DOES.test(cv)))return push(confirm,n);
    if(ADOBE_PERFORMS.test(fromTemplate?first:core))return push(confirm,n);
    if(fromTemplate&&(CLIENT_ASK.test(core)||CLIENT_STATE.test(first))&&!/\b(?:only where|otherwise|unless)\b/.test(core))return push(asks,n);
    if(licenseAt(core,12))return license();
    if(TO_PARTNER.test(first))return push(assumptions,n);                                          // the partner's own to-do, not the client's
    if(fromTemplate)return push(assumptions,n);                                                    // a template sentence that asks the client for nothing
    if(STATEMENT.test(first)&&!ASKSHAPE.test(first))return push(assumptions,n);                    // a statement about how a product behaves
    return push(asks,n);};
  // every prerequisite of every connection the answer names (the approach names the first four), no cap; the SOW's client-voice version
  // of each (sowPrereqs, matched by its words, since the two lists are not always in the same order) is what a ticked ask says in the response
  const conns=m.conns&&m.conns.length?m.conns.slice(0,4):(m.conn?[m.conn]:[]);
  for(const c of conns){
    const pre=c.prereqs||[],sowPre=c.sowPrereqs||[];
    for(const p of pre){const cv=closest(p,sowPre);for(const x of pieces(p,false)){const before=asks.length;place(x,cv,false);if(asks.length>before&&cv&&x===p)clientAsks[p]=cv;}}
    // the caution the client-voice text leaves out: under Confirm with Adobe when it is about Adobe, else a line of its own
    if(c.sowNote&&!confirm.some(x=>similar(x,c.sowNote)>=0.85)){if(ADOBE_DOES.test(c.sowNote)||/\bAdobe\b/.test(c.sowNote))push(confirm,c.sowNote);else push(notes,c.sowNote);}
    const avail=c.sowAvailability||c.availability;if(avail)push(assumptions,'Availability'+(conns.length>1?' of '+P[c.a].name+' + '+P[c.b].name:'')+': '+String(avail).replace(/\.?$/,'.'));
  }
  const askLine={};let told=asks.length;                                              // step 67: the service an ask came with, so the ask goes where the service goes
  for(const id of m.lines){const L=LN[id];                                           // each matched line's own requirements
    if(L.ext){const named=detect(L.ext).filter(x=>P[x]&&!P[x].outside),have=named.filter(x=>owned.has(x));
      // an "A or B" need is met when the RFP says the client runs one of them; a single add-on named beside an owned product is still a license
      if(have.length&&/\bor\b/.test(L.ext))push(assumptions,'Per the RFI your client already runs '+P[have[0]].name+', which this line needs ('+L.ext.replace(/\.?$/,'')+').');else push(sells,'Also needs '+L.ext.replace(/\.?$/,'')+', licensed separately.');}
    if(L.tier){const about=detect(L.tier).filter(x=>P[x]&&!P[x].outside),adobeIn=inAnswer.filter(x=>P[x]&&!P[x].outside);
      if(/\badd-on\b/i.test(L.tier))push(sells,'Also needs '+L.tier.replace(/\.?$/,'')+'.');
      else{const who=about.length?P[about[0]].name:adobeIn.length===1?P[adobeIn[0]].name:(ownerOf(id)||{}).name||(adobeIn.length?adobeIn.map(x=>P[x].name).join(' or '):'Adobe');push(asks,'Your '+who+' package: '+L.tier.replace(/\.?$/,'')+'.');}}
    if(!m.conn){const a=(TPL[id]||{}).assumptions||(CON[id]||{}).assumptions||'';for(const s of a.split(/(?<=\.)\s+/))if(s.trim())for(const x of pieces(s.trim(),true))place(x,null,true);}
    for(;told<asks.length;told++)askLine[asks[told]]=id;}
  return {sells,asks,confirm,assumptions,notes,clientAsks,askLine};
}
// how alike two sentences are, by their words (0 to 1)
function similar(a,b){const A=new Set(tokens(a)),B=new Set(tokens(b));if(!A.size||!B.size)return 0;let n=0;for(const w of A)if(B.has(w))n++;return n/Math.min(A.size,B.size);}
function closest(p,list){if(list.includes(p))return p;let best=null,score=0.6;for(const s of list){const v=similar(p,s);if(v>score){score=v;best=s;}}return best;}
// a short subject for an ask, so a typed fact reads "CDN access logs: Akamai serves both sites" (finding 6.5): the noun phrase before
// the first verb or preposition; a label ("Web SDK route: alloy.js ...") becomes a bracket, a leading clause ("For Fusion: ...", "At setup, ...")
// moves behind the subject, a one-word lead keeps its phrase, and the lead is capitalised like the needs lines
const SUBJ_VERB=/\s+(?:forwarded|enabled|set|configured|provisioned|licensed|connected|added|turned|granted|approved|installed|allowed|shared|stored|authored|registered|deployed|published|activated|created|issued|onboarded|carry|carries|need|needs|must|has|have|is|are|includes|holds|approve|approves|sent|back|out|grants?|installs?|creates?|gives?|supplies|supply|provides?|names?|confirms?|manages?|agrees?|decides?|reviews?|owns?|runs?|contains?|signs?|allows?|accepts?|applies|apply)\b(?![.\w-])/i;
const SUBJ_PREP=/\s+(?:who|that|which|with|for|in|to|from|at|by|through|and|as|so|where|when|if|before|after|under|via|per|or|such as|you|your)\b(?![.\w-])|(?<!turned|switched)\s+on\b(?![.\w-])|[,;:(]/i;   // "turned on" stays whole
const ROUTE_LABEL=/\b(?:route|customers|sharing|destination|only|authors|on-premises|handoff)$/i;
const TRAIL=/\s+(?:of|and|or|to|for|the|a|an|with|in|on|at|by|from|both|all|each|every|any|some)$/i;
function subjectOf(t){
  let s=clientScrub(String(t||'')).replace(/\([^)]*\)/g,' ').replace(/\s+/g,' ').trim(),tail='';
  const label=/^([^:;]{1,60}):\s*(.+)$/.exec(s);
  if(label){const l=label[1].trim();if(CLAUSE.test(l)){tail=' '+lc(l);s=label[2];}else if(ROUTE_LABEL.test(l)){tail=' ('+l+')';s=label[2];}else s=l;}
  else if(CLAUSE.test(s)&&s.includes(',')){const i=s.indexOf(',');tail=' '+lc(s.slice(0,i));s=s.slice(i+1).trim();}   // "At setup, we and you assign ..." starts after its clause
  const pron=/^(?:we and you|you and we|we|you) ([a-z]+) /i.exec(s);
  if(pron)s=s.slice(pron[0].length);                                                   // "we and you assign responsibility for governance labels" leads with what is assigned
  s=s.replace(/^(?:a|an|the|your client's|your|our|their|its)\s+/i,'');
  const cut=(str,re)=>{const i=str.search(re);return i>0?str.slice(0,i):str;},words=x=>x.trim().split(/\s+/).filter(Boolean).length;
  let lead=cut(cut(s,SUBJ_VERB),SUBJ_PREP);
  if(words(lead)<2)lead=cut(s,SUBJ_PREP);
  if(words(lead)<2)lead=s.split(/[,;:]/)[0].split(/\s+/).slice(0,6).join(' ');
  if(words(lead)>8)lead=lead.split(/\s+/).slice(0,8).join(' ');
  lead=lead.replace(/[.;,:]+$/,'').trim();while(TRAIL.test(lead))lead=lead.replace(TRAIL,'');
  if(!lead||/^(?:and|or|but|then|so)$/i.test(lead))lead=String(t||'').replace(/\([^)]*\)/g,' ').trim().split(/\s+/).slice(0,4).join(' ').replace(/[.;,:]+$/,'');
  if(/^[a-z]+(?:\s|$)/.test(lead))lead=lead[0].toUpperCase()+lead.slice(1);                  // "full URL field" is "Full URL field"; "alloy.js" keeps its case
  return lead+tail;}
// a tick or a typed note belongs to the ask it was made on, keyed by the ask's words, so a redraft never moves it to another ask
const askKey=(d,i)=>(d&&d.asks&&d.asks[i])||String(i);
const ticked=(q,d,i)=>!(q&&q.ticks&&q.ticks[askKey(d,i)]===false);
const factOf=(q,d,i)=>q&&q.facts?String(q.facts[askKey(d,i)]||'').trim():'';
// The products the RFP says the client already has, read from every paragraph of the RFP, headings and background
// included ('our Customer Journey Analytics data', 'The bank licensed Brand Visibility', 'runs Marketo Engage').
// Only product names count, never a topic word ('our new site' is not Edge Delivery).
const OWNS=/(?:\b(?:our|existing|current|incumbent)\s+(?:[a-z]+\s+)?|\b(?:already|currently|today)\s+(?:use|uses|run|runs|have|has|own|owns|license|licenses)\s+|\b(?:licensed|licenses|has licensed|have licensed|subscribes to|subscribe to)\s+|\b(?:runs|run|is|are|hosted|sits?|lives?|stored)\s+on\s+|\b(?:runs|uses)\s+|\b(?:we|they)\s+(?:use|run|own|have)\s+)(?:adobe\s+)?$/i;
// step 81 (Adam: "fix all three"): 'we have licensed AEM Sites' says the client bought it, not that it is set up: the set-up and
// go-live services stay in the answers
const TO_BUILD=/\b(?:set(?:ting)? up|stand(?:ing)? up|implement(?:ing|ation of)?|install(?:ing)?|deploy(?:ing)?|launch(?:ing)?|build(?:ing)?|creat(?:e|ing)|provision(?:ing)?|configur(?:e|ing))\s+(?:[a-z]+\s+){0,3}$/i;
const OWNS_AFTER=/^\s*(?:customers?|licensee|instance|subscription)\b/i;
function ownedProducts(){
  if(rfpState.owned)return rfpState.owned;const s=new Set();
  const paras=rfpState.paragraphs&&rfpState.paragraphs.length?rfpState.paragraphs:rfpState.questions.map(q=>q.text);
  for(const p of paras){const raw=String(p),hits=scan(raw).filter(h=>h.type==='name'&&!h.neg&&P[h.pid]&&!P[h.pid].outside).sort((x,y)=>x.a-y.a);
    for(const [k,h] of hits.entries()){
      const before=raw.slice(Math.max(0,h.a-1-40),h.a-1),after=raw.slice(h.b-1,h.b-1+20);
      if(TO_BUILD.test(raw.slice(Math.max(0,h.a-1-90),h.a-1)))continue;   // step 82: 'set up our AEM Sites program' asks for it; it does not say the client has it
      if(OWNS.test(before)||(/\b(?:an?|existing)\s+(?:adobe\s+)?$/i.test(before)&&OWNS_AFTER.test(after))){const both=x=>s.add(x);both(h.pid);
        for(let j=k+1;j<hits.length;j++){const gap=raw.slice(hits[j-1].b-1,hits[j].a-1);if(/^\s*(?:,|and|,\s*and|or)\s*(?:adobe\s+)?$/i.test(gap))both(hits[j].pid);else break;}}}}   // "we already license Brand Visibility and Customer Journey Analytics": both
  rfpState.owned=s;return s;}
// the partner's own note under the draft, in four lists (step 54): licenses, asks with tick boxes, confirm with Adobe,
// assumptions. Nothing in it reaches the downloads except what the partner ticks or types.
// The internal line names the downloads it means (the response, the Excel and the write-back); the checklist carries the whole box.
// It changes with the question's state: skipped, edited, or live (finding 6.6).
function internalLine(q,asks){const base='Internal. Nothing in this box goes into the response, the Excel or your client\'s workbook';
  if(q&&q.status==='skipped')return base+': the question is left out. All of it goes into your checklist.';
  if(q&&q.answer)return asks.length?base+'. You edited this answer, so ticks and notes here no longer change it; they go into your checklist only. Edit it again and type them in.':base+'. All of it goes into your checklist.';
  return asks.length?base+', except the asks you leave ticked (all start ticked) and what you type. All of it goes into your checklist.':base+'. All of it goes into your checklist.';}
// whether an edited answer still carries an ask: the need sentence the draft put in, or the fact typed for it
function inEdited(q,d,i){if(!q||!q.answer)return false;const a=d.asks[i],f=factOf(q,d,i);const t=f?clientScrub(rfp(f)):clientScrub(rfp((d.clientAsks||{})[a]||a));const probe=t.replace(/\.?$/,'').slice(0,60).toLowerCase();return !!probe&&q.answer.toLowerCase().includes(probe);}
function badgeHTML(q,d,i){
  if(q&&q.status==='skipped')return '<span class="rfp-badge off">Not in the response: the question is left out</span>';
  if(q&&q.answer)return inEdited(q,d,i)?'<span class="rfp-badge">In the edited answer</span>':'<span class="rfp-badge off">Not in the edited answer</span>';
  if(factOf(q,d,i))return '<span class="rfp-badge">Answered by your note below</span>';
  const w=ticked(q,d,i)?written(d,q):null;
  if(w&&w.offAsk.has(i))return '<span class="rfp-badge off">Not in the response: its service is not in this answer</span>';
  if(w&&w.inLic.has(i))return '<span class="rfp-badge">In the response, under Licensing</span>';
  if(w&&w.brief.asks.has(i))return '<span class="rfp-badge off">Not in the response: the answer keeps to how it works</span>';
  if(w&&w.fit&&w.fit.cutAsk.has(i))return '<span class="rfp-badge off">Left out to fit the word limit</span>';
  return ticked(q,d,i)?'<span class="rfp-badge">In the response</span>':'<span class="rfp-badge off">Not in the response</span>';}
// the lines of the note that are neither list: the card's caution, a product the client rules out, a product this catalog does not cover
function extraLines(d){const out=[];
  for(const x of (d.notes||[]))out.push('Not in the client\'s text: '+partnerVoice(x));   // the label stays as it is; the caution itself speaks to the partner
  if(d.excluded)out.push('Your client rules out '+listOf(d.excluded)+', so the draft leaves '+(d.excluded.length>1?'them':'it')+' out.');
  if(d.uncovered&&d.m&&d.m.lines.length)out.push('Not in this catalog: '+listOf(d.uncovered)+'. Check Adobe\'s pages before you answer for '+(d.uncovered.length>1?'them':'it')+'.');
  return out;}
function confirmLines(d){const c=[...(d.confirm||[])];if(d.m&&d.m.missing&&d.m.missing.length)c.push('This catalog documents no connection between '+d.m.missing.join(', or between ')+'. Say how they work together in your own words, or confirm it with Adobe.');return c;}
function asksLead(q){if(q&&q.status==='skipped')return 'Ask your client. While the question is left out, ticks and notes go into your checklist only.';
  if(q&&q.answer)return 'Ask your client. While the answer is edited, ticks and notes go into your checklist only.';
  return 'Ask your client. Ticked items go into the response as "What we would need from you". Type what your client told you and the item moves to "What you already have in place".';}
function noteHTML(d,q){
  if(!d)return '';
  const extra=extraLines(d),confirm=confirmLines(d),asks=d.asks||[],sells=d.sells||[],assumptions=d.assumptions||[],lines=d.m&&d.m.lines?d.m.lines.filter(id=>LN[id]):[];
  if(!sells.length&&!asks.length&&!confirm.length&&!assumptions.length&&!extra.length&&!lines.length)return '';
  return '<div class="rfp-partner-note"><h4>Notes for you, not for the client</h4><p class="rfp-internal">'+esc(internalLine(q,asks))+'</p>'+
    extra.map(x=>'<p>'+esc(x)+'</p>').join('')+
    (sells.length?'<p>Adobe licenses this proposal includes (Adobe quotes them):</p><ul class="rfp-sells">'+sells.map(x=>'<li>'+esc(partnerVoice(x))+'</li>').join('')+'</ul>':'')+
    (asks.length?'<p>'+esc(asksLead(q))+'</p><ul class="rfp-asks">'+
      asks.map((x,i)=>'<li><label><input type="checkbox" class="rfp-tick" data-i="'+i+'"'+(ticked(q,d,i)&&!factOf(q,d,i)?' checked':'')+(factOf(q,d,i)?' disabled':'')+'><span>'+esc(partnerVoice(x))+' '+badgeHTML(q,d,i)+'</span></label><textarea class="rfp-fact" data-i="'+i+'" rows="2" placeholder="What your client told you" aria-label="What your client told you about: '+esc(partnerVoice(x))+'">'+esc(factOf(q,d,i))+'</textarea></li>').join('')+'</ul>':'')+
    (confirm.length?'<p>Confirm with Adobe:</p><ul class="rfp-confirm">'+confirm.map(x=>'<li>'+esc(partnerVoice(x))+'</li>').join('')+'</ul>':'')+
    (assumptions.length?'<p>Assumptions behind this answer:</p><ul class="rfp-assume">'+assumptions.map(x=>'<li>'+esc(partnerVoice(x))+'</li>').join('')+'</ul>':'')+
    (lines.length?'<p>Services behind this answer, for the statement of work. Untick one to leave it out of Add to my statement of work; the response is unchanged.</p><ul class="rfp-lines">'+lines.map(id=>'<li><label><input type="checkbox" class="rfp-line" data-id="'+esc(id)+'"'+(q&&q.lines&&q.lines[id]===false?'':' checked')+'><span>'+esc(LN[id].name)+(LN[id].unit==='monthly'?' (monthly)':'')+'</span></label></li>').join('')+'</ul>':'')+'</div>';
}
// What the partner typed under an ask joins the response as "What you already have in place, as confirmed with your
// team", each line led by the ask's subject; the ticked asks without a note join as "What we would need from you".
const HAVE='What you already have in place, as confirmed with your team',NEED='What we would need from you';
function facts(q,d){const out=[];if(!q||!q.facts)return out;const asks=(d&&d.asks)||[];
  for(const [i,a] of asks.entries()){const f=clientScrub(rfp(factOf(q,d,i)));if(!f)continue;const lead=subjectOf(rfp(a));   // a note typed about "the client" reads to the client as "you", and never carries a lifecycle label
    out.push(lead&&!f.toLowerCase().startsWith(lead.toLowerCase())?lead+': '+f:f);}
  return out;}
// a ticked ask reaches the client in the SOW's own client wording where the connection has one (sowPrereqs), else through the voice rewrite
const needsOf=(q,d)=>{const out=[];for(const [i,a] of ((d&&d.asks)||[]).entries())if(ticked(q,d,i)&&!factOf(q,d,i)){const t=clientScrub(rfp((d.clientAsks||{})[a]||a));if(t)out.push({i,text:(t[0].toUpperCase()+t.slice(1)).replace(/\.?$/,'.')});}return out;};
/* ---------- step 67: the writer. Everything the client reads goes through written(d,q). */
const APPROACH='Our approach',LICENSING='Licensing this needs',WORK='What we would do',AFTER='After launch',ESTIMATE='Our planning estimate';
const SECTION_ORDER=[APPROACH,LICENSING,WORK,AFTER,ESTIMATE,HAVE,NEED];
const wordsIn=t=>String(t||'').split(/\s+/).filter(Boolean).length;   // every token, a bullet's dash included, so the answer is under the limit however the client counts
const countOf=S=>S.reduce((t,[h,items])=>t+wordsIn(h)+items.reduce((a,x)=>a+wordsIn(x)+1,0),0);   // plus the dash each item is written with
// the RFP's own word limit ("Keep each answer under 300 words", "maximum 250 words", "500-word limit"): a question's own limit first,
// then the instructions the finder set aside, then any paragraph of the RFP
const LIMIT_RES=[/\b(under|below|fewer than|less than|no more than|not more than|not (?:to )?exceed(?:ing)?|maximum(?: of)?|max\.?(?: of)?|up to|at most|limit(?:ed)? (?:of|to)|within)\s+(\d{2,4})\s+words\b/i,/\b()(\d{2,4})[- ]words?\s+(?:limit|maximum|max\b|or (?:less|fewer))/i,/\bword (?:limit|count|maximum)()(?:\s+(?:of|is))?\s*:?\s*(\d{2,4})\b/i];
function limitIn(t){t=String(t||'');for(const re of LIMIT_RES){const m=re.exec(t);if(m){const n=Number(m[2]);if(n>=30&&n<=5000)return {n,max:/^(?:under|below|fewer than|less than)$/i.test(m[1])?n-1:n};}}return null;}
const limitSays=lim=>'This RFI asks for '+(lim.max<lim.n?'under ':'no more than ')+lim.n+' words an answer.';
function limitOf(q){const own=q&&limitIn(q.text);if(own)return own;
  const row=q&&rowLimit(q.limit);if(row)return row;                                   // step 89: the response form's own Word limit column
  const at=q?paraAt(q):null;if(at!==null){const l=sectionLimits()[at];if(l)return l;}   // step 89: the limit stated for the question's own section
  for(const s of rfpState.skipped||[]){const l=limitIn(s&&s.text);if(l)return l;}
  for(const p of rfpState.paragraphs||[]){const l=limitIn(typeof p==='string'?p:'');if(l)return l;}
  return null;}
/* step 89 (Nov 12 2026, Adam: yes to "each answer follows its own section's limit"): an insurer's RFP gave each section its own
   limit ("Answer each requirement in this section in 300 words or fewer") and every answer was held to the first one it stated. A
   limit said for a section's answers holds for the questions under it until the next section heading; a question's own limit and a
   response form's Word limit column come first, and the RFI's first limit stays the fallback. */
const SECTION_HEAD=/^(?:(?:section|part|lot|schedule|appendix|annex|chapter|module)\s+[A-Z0-9]{1,4}[.:)]?|\d{1,2}(?:\.\d{1,2})*\.?|[A-Z][.)])\s+[A-Z][^.?!]{0,90}$/i;
const LIMIT_SCOPE=/\b(?:each|every|all|this section|per (?:question|requirement|response|answer|item)|answers|responses|replies)\b/i;   // said of the answers, not of one question
const rowLimit=v=>{const t=String(v==null?'':v).trim();if(!t)return null;const l=limitIn(t);if(l)return l;const m=/^\D{0,12}?(\d{2,4})\D{0,12}$/.exec(t),n=m?Number(m[1]):0;return n>=30&&n<=5000?{n,max:n}:null;};
let limPs=null,limN=-1,limAt=[];
function sectionLimits(){const ps=rfpState.paragraphs||[];if(limPs===ps&&limN===ps.length)return limAt;limPs=ps;limN=ps.length;limAt=[];let cur=null;
  for(const p of ps){const t=typeof p==='string'?p.trim():'';if(SECTION_HEAD.test(t))cur=null;
    const said=t.split(/(?<=[.!?])\s+/).find(x=>limitIn(x)&&LIMIT_SCOPE.test(x));if(said)cur=limitIn(said);limAt.push(cur);}
  return limAt;}
// where a question sits in the RFI's paragraphs: the finder's own place for it, else its reference, else its opening words (the AI
// reading keeps the RFI's references and wording but not the paragraph)
const REF_LIKE=/^(?:[A-Z]{1,4}[-.]?)?\d{1,3}(?:\.\d{1,3})*[a-z]?$/i,paraSeen=new WeakMap(),flatText=x=>String(x||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function paraAt(q){const ps=rfpState.paragraphs||[];if(!q||!ps.length)return null;
  const c=paraSeen.get(q);if(c&&c.ps===ps&&c.n===ps.length&&c.text===q.text)return c.at;
  const head=flatText(q.text).split(' ').slice(0,8).join(' '),o=q.order-1,lab=String(q.label||'').trim();let at=null;
  if(Number.isInteger(o)&&o>=0&&o<ps.length&&head&&flatText(ps[o]).includes(head))at=o;
  if(at===null&&REF_LIKE.test(lab)&&/[.A-Za-z]/.test(lab)){const re=new RegExp('(?:^|[\\s(])'+lab.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=[\\s(:.)]|$)');const i=ps.findIndex(p=>typeof p==='string'&&re.test(p));if(i>=0)at=i;}
  if(at===null&&head.split(' ').length>=5){const i=ps.findIndex(p=>typeof p==='string'&&flatText(p).includes(head));if(i>=0)at=i;}
  paraSeen.set(q,{ps,n:ps.length,text:q.text,at});return at;}
// step 89 (Adam: yes to 4): the AI reading keeps no section, so a question that names no product ('Describe your go-live and cutover
// plan') is read under the heading it sits under in the RFI ('Section B. Website on AEM Sites with Edge Delivery Services')
function headingOf(q){const at=paraAt(q),ps=rfpState.paragraphs||[];if(at===null)return '';for(let i=at;i>=0&&i>=at-80;i--){const t=typeof ps[i]==='string'?ps[i].trim():'';if(SECTION_HEAD.test(t))return t;}return '';}
const askedUnder=q=>[q.context,q.section||(rfpState.ai&&!rfpState.aiRows?headingOf(q):'')].filter(Boolean).join(' ');
// the whole RFP as one text, for what it says about the client (a bank, an insurer)
let rfpTextOf=null,rfpTextIs='';
function rfpText(){if(rfpTextOf!==rfpState.questions){rfpTextOf=rfpState.questions;rfpTextIs=[rfpState.name,...(rfpState.paragraphs||[]).filter(p=>typeof p==='string'),...rfpState.questions.map(q=>q.text)].join(' ');}return rfpTextIs;}
// step 76: 'insurance', 'insurer' and 'insurance company' are not evidence (every public RFP asks the bidder for insurance): an insurer
// shows in the client's name, the file's name, or in words only an insurer uses of itself
const FSI=/\b(?:banks?|banking|insurance products?|reinsur\w+|underwrit\w+|policyholders?|credit unions?|financial services|wealth management|mortgages?|lender|lending)\b/i;
const isFSI=()=>FSI.test(rfpText())||/\b(?:Insurance|Assurance|Insurers?)\b/.test(clientOrg()+' '+String(rfpState.name||'').replace(/[_-]+/g,' '));
// Step 69 (Nov 10 2026, Adam: "Using the clients name and the answer is is a nice touch"): the client's name, used once in an answer.
// The partner's own entry comes first (an empty one means no name), then the Client name on the Scope step, then the RFP's title
// lines, then the file's name. A name is taken from the RFP only when it reads as an organization.
const ORG=/\b(?:Bank|Bancorp|Credit Union|Insurance|Assurance|Mutual|Financial|Group|Inc\.?|LLC|Ltd\.?|Corp(?:oration)?\.?|Company|University|College|Department|Agency|Authority|Association|Health|Hospital|Foundation|Holdings|Partners|State of|City of|County of|Commonwealth of)(?![\w-])/;
const NOT_ORG=/\b(?:request for|rfp|rfi|rfq|proposal|instructions?|section|questions?|response|deadline|due|submission|checklist|vendor|appendix)\b/i;
function detectOrg(){
  for(const raw of (rfpState.paragraphs||[]).filter(p=>typeof p==='string').slice(0,6)){const t=raw.trim().replace(/\s+/g,' ').replace(/[.,]$/,'');
    if(t.length>=3&&t.length<=60&&!/[?:;]/.test(t)&&!NOT_ORG.test(t)&&ORG.test(t)&&t.split(' ').length<=7&&/^[A-Z]/.test(t))return t;}
  const f=String(rfpState.name||'').replace(/\.[a-z0-9]+$/i,'').replace(/[_-]+/g,' ').replace(/\b(?:rfp|rfi|rfq|request for (?:proposal|information)|answered|responses?|draft|final|copy|v\d+|\d{1,4})\b|\(\d+\)/gi,' ').replace(/\s+/g,' ').trim();
  return f&&ORG.test(f)&&f.split(' ').length<=7&&/^[A-Z]/.test(f)?f:'';}
let orgOf=null,orgIs='';
function clientOrg(){
  if(typeof rfpState.client==='string')return rfpState.client.trim();
  try{if(typeof state==='object'&&state&&typeof state.customer==='string'&&state.customer.trim())return state.customer.trim();}catch(e){}
  if(orgOf!==rfpState.questions){orgOf=rfpState.questions;orgIs=detectOrg();}return orgIs;}
// Where the RFP is from a bank or an insurer, the response says once who approves regulated content and once how customer data is used:
// in the first answer whose products call for it, as a service is said once (Adobe's draft of the bank RFP spoke to this; ours did not)
const DATA_P=['rtcdp','cja','target','ajo','ajob2b','marketo','aa','ca','mmm','collab','mmeasure'],CONTENT_P=['aemsites','eds','so','bv','bc','aemforms','aemassets','commerce','express','gspm','acrobat'];
const CONTROLS={data:'Customer data is used only as your consent and data-governance rules allow.',
  content:'Your compliance team approves regulated content (rates, fees, disclosures and product claims) before it goes live.'};
const SAID={data:/\bdata[- ]us(?:e|age) (?:rules|polic)/i,content:/\bcompliance\b/i};   // an answer that already speaks of it does not need the line
const draftText=d=>d.sections.map(s=>s[1].join(' ')).join(' ');
// the line on regulated content stays out of an answer that explains how a product works: two blind reviewers of the bank response
// called it off topic there
const controlKind=(d,q)=>{if(!d||!d.parts||d.m.fromContext)return '';const kind=d.m.products.some(id=>DATA_P.includes(id))?'data':d.m.products.some(id=>CONTENT_P.includes(id))?'content':'';
  if(kind==='content'&&q&&HOW_IT_WORKS.test(q.text)&&d.parts.explain.length>0)return '';return kind&&!SAID[kind].test(draftText(d))?kind:'';};
// said once: in the answer of its kind that a word limit leaves the most room (the first one where there is no limit). The choice is
// kept until the questions, what the partner chose or the name change
let ctlOf=null,ctlKey='',ctlHome={};
function controlHomes(){const qs=rfpState.questions,key=[qs.length,clientOrg(),qs.map(o=>(o.status||'')+(o.answer?'e':'')+(o.pick?o.pick.join('+'):'')).join(',')].join('|');
  if(ctlOf===qs&&ctlKey===key)return ctlHome;ctlOf=qs;ctlKey=key;ctlHome={};
  for(const kind of ['data','content']){let best=null,most=-Infinity;
    for(const o of qs){if(o.kind!=='adobe'||o.status==='skipped'||o.answer)continue;const od=draftOf(o);if(controlKind(od,o)!==kind)continue;
      const fit=written(od,o,true).fit,room=fit?fit.max-fit.words:Infinity;if(room>most){most=room;best=o;}}
    ctlHome[kind]=best;}
  return ctlHome;}
function controlsFor(d,q){if(!isFSI())return '';const kind=controlKind(d,q);return kind&&controlHomes()[kind]===q?CONTROLS[kind]:'';}
// a line written for banks and insurers alike names the client's own industry where the RFP shows it
function industry(t){if(!/banking or insurance/.test(t))return t;const all=rfpText(),bank=/\b(?:banks?|banking|credit unions?)\b/i.test(all),ins=/\b(?:insurers?|insurance (?:compan\w+|carriers?|groups?|products?)|underwrit\w+|policyholders?)\b/i.test(all);
  return bank&&!ins?t.replace(/\bbanking or insurance\b/g,'banking'):ins&&!bank?t.replace(/\bbanking or insurance\b/g,'insurance'):t;}
// a long promise that lists its steps after a colon ("We will set up ...: connect ..., design ..., configure ...") reads as a short list.
// A step starts where a comma is followed by a verb; a comma inside a step ("build, with your reviewers, the test set") stays in it.
function listify(t){
  if(wordsIn(t)<45||/[.!?]\s+[A-Z]/.test(t)||t.includes(';'))return t;
  let depth=0,at=-1;for(let i=0;i<Math.min(t.length,200);i++){const c=t[i];if(c==='(')depth++;else if(c===')')depth=Math.max(0,depth-1);else if(c===':'&&depth===0&&t[i+1]===' '){at=i;break;}}
  if(at<0)return t;
  const head=t.slice(0,at),rest=t.slice(at+2).replace(/\.$/,''),chunks=[];let cur='';depth=0;
  for(let i=0;i<rest.length;i++){const c=rest[i];if(c==='(')depth++;else if(c===')')depth=Math.max(0,depth-1);
    if(c===','&&depth===0&&rest[i+1]===' '){chunks.push(cur);cur='';i++;}else cur+=c;}
  chunks.push(cur);
  const steps=[];for(const raw of chunks){const c=raw.replace(/^(?:and|then) /,'');if(opensWork(c)||!steps.length)steps.push(c);else steps[steps.length-1]+=', '+raw;}
  if(steps.length<5||!opensWork(steps[0]))return t;   // five steps or more: with fewer, a noun that reads as a verb ("render settings") would split a step in two
  return head+':\n  - '+steps.join(';\n  - ')+'.';}
// the services in the order they are delivered: each product's own work in catalog order, then each connection's
const natural=(a,b)=>a.localeCompare(b,'en',{numeric:true});
function inOrder(m){const at=id=>{const p=m.products.findIndex(pid=>P[pid]&&[...(P[pid].lines||[]),...(P[pid].more||[])].includes(id));if(p>=0)return p;
    const c=(m.conns||[]).findIndex(x=>[...(x.lines||[]),...(x.more||[])].includes(id));return c>=0?100+c:999;};
  return m.lines.slice().sort((a,b)=>at(a)-at(b)||natural(a,b));}
function ongoingLead(ids){const names=[...new Set(ids.map(ownerOf).filter(Boolean).map(p=>p.name))];return 'After launch, across the Adobe products in this proposal, our ongoing services for '+listOf(names)+' are these.';}
// the Adobe products this response proposes: the ones its questions name, most named first, then the ones its other answers draw on
function proposalProducts(q){const out=contextProducts();
  for(const o of rfpState.questions){if(o===q||o.kind!=='adobe'||isOngoing(o.text))continue;
    const m=match(o.text,{context:[o.context,o.section].filter(Boolean).join(' '),ctx:[],pick:o.pick});
    for(const id of m.products)if(P[id]&&!P[id].outside&&!out.includes(id))out.push(id);}
  return out;}
// The sentences that answer the question itself (RFP_FACTS.explain, each backed by quotes checked on Adobe's pages): a sentence is used
// when the draft holds every product it speaks for and the question uses one of its words. "Which products would you use" opens with the
// products and what each is for; a product answered alone, with no sentence for the question's words, opens with what the product is.
function explainFor(text,m){
  const none={lead:[],more:[],sources:[],confirm:[],licensing:[],pairs:[],asks:[],extra:[]},E=KB&&KB.explain;   // none is never written toif(!E||m.fromContext)return none;
  const prods=m.products.filter(id=>P[id]&&!P[id].outside);if(!prods.length)return none;
  const low=String(text||'').toLowerCase(),hits=st=>(st.when||[]).filter(w=>new RegExp('\\b'+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).test(low)).length;
  const mine=E.map((st,i)=>({st,i,h:hits(st)})).filter(x=>x.st.for.every(id=>prods.includes(id)));
  const of=(kind,id)=>mine.find(x=>x.st.kind===kind&&x.st.for.length===1&&x.st.for[0]===id);
  const roles=SOLUTION.test(text)&&prods.length>1?prods.map(id=>of('role',id)).filter(Boolean):[];
  const core=mine.filter(x=>!x.st.kind&&!x.st.extra&&x.st.text&&x.h>(m.conn&&!x.st.first&&!roles.length?1:0)).sort((a,b)=>b.h-a.h||a.i-b.i).slice(0,4);
  // step 69: an "extra" sentence (the discovery step) adds to the answer without taking the place of one of its four; under a word
  // limit it gives way to the services
  const extras=mine.filter(x=>x.st.extra&&x.st.text&&x.h>0).slice(0,1),picked=[...core,...extras].sort((a,b)=>a.i-b.i);
  const what=!m.conn&&!picked.length&&!roles.length?prods.slice(0,2).map(id=>of('what',id)).filter(Boolean):[];
  const used=[...roles,...what,...picked],src=[],confirm=[],licensing=[];
  for(const x of mine)if(x.st.kind==='note'&&(x.h>0||!(x.st.when||[]).length)&&!confirm.includes(x.st.confirm))confirm.push(x.st.confirm);   // a caution for the partner alone
  for(const x of used)for(const t of x.st.licensing||[])if(!licensing.includes(t))licensing.push(t);
  for(const x of used){for(const i of x.st.src||[]){const s=KB.sources[i];if(s&&!src.some(y=>y.url===s.url))src.push({url:s.url,title:s.title});}if(x.st.confirm&&!confirm.includes(x.st.confirm))confirm.push(x.st.confirm);}
  const lead=roles.length?['We would use '+listOf(prods.map(id=>P[id].name))+'. '+roles.map(x=>x.st.text).join(' ')]:[];
  const more=[];for(const x of [...what,...picked])(x.st.first||!m.conn||roles.length?lead:more).push(x.st.text);
  const asks=[];for(const x of used)for(const a of x.st.asks||[])if(!asks.some(y=>y.text===a.text))asks.push(a);   // step 69: what the client must provide for the work a sentence describes
  return {lead,more,sources:src,confirm,licensing,pairs:used.map(x=>x.st.for).filter(f=>f.length===2),asks,extra:extras.map(x=>x.st.text)};}
// A service is said in full once in the response: in the answer to an after-launch question when it is monthly work, else in the first
// answer that draws on it. Answers the partner left out or rewrote do not count. The other answers point to it.
function homeOf(id){let first=null;
  for(const o of rfpState.questions){if(o.kind!=='adobe'||o.status==='skipped'||o.answer)continue;const d=draftOf(o);if(!d||!d.parts||!d.m.lines.includes(id))continue;
    if(LN[id].unit==='monthly'&&d.m.fromContext)return o;first=first||o;}
  return first;}
const refOf=o=>o.label?o.label:'"'+(o.text.length>70?o.text.slice(0,67).replace(/\s+\S*$/,'')+'...':o.text)+'"';
const ONGOING_LEAD='After launch we provide these services each month, product by product.';
// step 72: the products an RFI is about, for a line that names none (a 36-page RFP says "Adobe Experience Manager" in its title and
// "forms schema design" on page 9): the Adobe products named in three or more of its paragraphs, the two named most
let mainOf=null,mainN=-1,mainIs=[];
function rfpMain(){const qs=rfpState.questions;if(mainOf!==qs||mainN!==qs.length){mainOf=qs;mainN=qs.length;const n={};
    for(const t of [rfpState.name,...(rfpState.paragraphs||[]).filter(p=>typeof p==='string'),...qs.map(q=>q.text)])for(const id of detectAll(t).named)if(!P[id].outside)n[id]=(n[id]||0)+1;
    mainIs=Object.keys(n).filter(id=>n[id]>=3).sort((a,b)=>n[b]-n[a]).slice(0,2);}
  return mainIs;}
// step 75: what the proposal writer is given: the products this RFI is about (five at most), their services with scope and typical
// hours, the connections between them, the sentences of the knowledge base about them, and one numbered list of the Adobe pages all
// of it rests on
function proposalPack(){
  const ids=[...new Set([...rfpMain(),...contextProducts()])].filter(id=>P[id]&&!P[id].outside).slice(0,5);
  const sources=[],at={},src=(title,url)=>{if(!url)return null;if(!(url in at)){at[url]=sources.length+1;sources.push({n:at[url],title:clientScrub(title||url),url});}return at[url];};
  const line=(id,optional)=>{const L=LN[id];return L?{id,name:L.name,scope:L.scope||(TPL[id]||{}).scope||'',hours:L.base,unit:L.unit==='monthly'?'monthly':'one-time',optional,src:src(L.src,L.url)}:null;};
  const all=o=>[...(o.lines||[]).map(l=>line(l,false)),...(o.more||[]).map(l=>line(l,true))].filter(Boolean);
  const products=ids.map(id=>({id,name:P[id].name,services:all(P[id])}));
  const outs=[...new Set(rfpState.questions.filter(q=>q.kind==='adobe').flatMap(q=>detectAll(q.text).named))].filter(id=>P[id]&&P[id].outside),near=id=>ids.includes(id)||outs.includes(id);   // step 88: Snowflake, Power BI and the like
  const connections=C.filter(c=>near(c.a)&&near(c.b)&&(ids.includes(c.a)||ids.includes(c.b))).map(c=>({pair:P[c.a].name+' + '+P[c.b].name,what:c.label||'',how:c.sowHow||c.how||'',needs:c.sowPrereqs||c.prereqs||[],services:all(c)}));
  const facts=[];
  if(KB){const S=KB.sources||[];for(const e of [...(KB.explain||[]),...(KB.statements||[])]){const who=[].concat(e.for||[]);if(!e.text||!who.some(id=>ids.includes(id)))continue;   // a fact names one product or several
    facts.push({about:who.filter(id=>P[id]).map(id=>P[id].name),text:e.text,src:(e.src||[]).map(i=>S[i]&&src(S[i].title,S[i].url)).filter(Boolean)});}}
  return {products,connections,facts,sources};}
// the products the RFP's questions name, kept until the questions change
let namedOf=null,namedN=-1,namedIs=[];
function rfpNames(id){const qs=rfpState.questions;if(namedOf!==qs||namedN!==qs.length){namedOf=qs;namedN=qs.length;namedIs=contextProducts();}return namedIs.includes(id);}
const HOW_IT_WORKS=/(?:^|[.?!]\s+)(?:please\s+)?(?:describe|explain|outline|show us|tell us)\s+how\b|(?:^|[.?!]\s+)how (?:does|do|would|will|can|is|are) (?!you\b|your\b|we\b)/i;
const licenseAsk=t=>/\blicen[cs]e|\bentitlement\b|\bpackage\b|\badd-on\b/i.test(t.split(/\s+/).slice(0,8).join(' '));
// the superscript numbers of a knowledge-base answer, renumbered in the order they now appear, with the sources they still cite
function recite(sections,sources){const seen=[],re=/[⁰¹²³⁴⁵⁶⁷⁸⁹]+(?:,[⁰¹²³⁴⁵⁶⁷⁸⁹]+)*/g;
  const out=sections.map(([h,items])=>[h,items.map(t=>t.replace(re,g=>sup(g.split(',').map(x=>{const n=Number([...x].map(c=>SUP.indexOf(c)).join(''));let i=seen.indexOf(n);if(i<0){seen.push(n);i=seen.length-1;}return i+1;}))))]);
  return {sections:out,sources:seen.map(n=>sources[n-1]).filter(Boolean)};}
// Returns {sections, sources, fit}. fit is null when the RFP states no word limit, else {limit, max, words, tight, cutLines, cutAsk,
// cutPoints, cutFacts}: what the limit left out, which the partner's panel names.
// Round 4: method entries are assembled by us, so fit their evidence to the question before dropping whole steps.
// Keep accounting and prerequisites verbatim. A pointer is optional only when another line already explains the effort.
// The AI-written answer path below is unchanged; this selection applies only to model "knowledge base".
function fitMethodAnswer(q,sections,tail,budget,need){
  const qs=new Set(tokens(q.text).filter(w=>!GENERIC.has(w))),rows=[],seen=new Set();let k=0;
  const effort=/^(?:Planning estimate:|Its hours are counted in|It adds no hours of its own)/;
  const pointer=/^It (?:sits beside|is part of) our .+, estimated in our answer to /;
  const hasEffort=sections.some(([,items])=>items.some(t=>effort.test(t)));
  const scopes=[
    /\b(?:test\w*|check\w*|verif\w*|validat\w*|prove[ds]?|proving|proof|demonstrat\w*|reconcil\w*|accept\w*|surviv\w*|evidence)\b/i,
    /\b(?:suppress\w*|unsubscrib\w*|blocklist\w*|opt[ -]?out|consent\w*)\b/i,
    /\b(?:approv\w*|review\w*|delegat\w*|owner\w*|leavers?|succession)\b/i,
    /\b(?:rollback|recover\w*|restor\w*|revert\w*|fail\w*)\b/i,
    /\b(?:duplicat\w*|revision\w*|supersed\w*|mandatory|metadata)\b/i,
    /\b(?:accessib\w*|keyboard|screen[ -]?reader|WCAG)\b/i,
    /\b(?:privacy|sensitive|personal|prohibited|free[ -]?text|delet\w*|retention)\b/i
  ].filter(re=>re.test(q.text));
  const add=(section,text,ask)=>{
    const duplicate=seen.has(text);seen.add(text);
    const hit=new Set(tokens(text).filter(w=>qs.has(w))).size,parts=scopes.filter(re=>re.test(text)).length;
    const accounting=effort.test(text)||(pointer.test(text)&&!hasEffort);
    const prerequisite=LICENSE_LINE.test(text)||/^This (?:also )?needs\b/.test(text);
    const dated=section==='Timeline and effort'&&/\byour (?:launch|pilot|approval milestone)\s+(?:on|by|in)\b/i.test(text);
    const recurringStart=section==='Timeline and effort'&&/^This runs every month from\b/.test(text);
    const exclusion=/^You told us:/.test(text)&&/\bnot (?:licen[cs]e|buy|purchase|use)\b|\bmust (?:remain|stay)\b|\bwill retain\b/i.test(text);
    const namedLaw=/^You named .+: we map what\b/.test(text);
    let rank=section==='How we would do it'?60:section==='What you get'?50:section==='Risk we manage'?34:section===HAVE?44:section==='Timeline and effort'?22:section===NEED?8:28;
    rank+=Math.min(hit,4)*2+Math.min(parts,3)*5;
    // A short fact that shares the question's own subject can carry an important source or scale; a stack recital cannot.
    if(/^You told us:/.test(text))rank=wordsIn(text)<=32&&hit>=2?44+Math.min(hit,4)*2:4+Math.min(hit,4);
    if(pointer.test(text))rank=-10;
    if(section==='Our approach'&&/^(?:For further details,|With AEM,|Adobe(?:'s)? .+(?:checklist|reports?)|The Edge Delivery go-live checklist)/.test(text))rank=2;
    if(duplicate)rank=-30;
    rows.push({section,text,ask,k:k++,rank,keep:true,must:!duplicate&&(accounting||prerequisite||dated||recurringStart||exclusion||namedLaw)});
  };
  sections.forEach(([h,items])=>items.forEach(t=>add(h,t,null)));
  tail.forEach(([h,items])=>items.forEach((t,i)=>add(h,t,h===NEED&&need[i]?need[i].i:null)));
  const materialize=()=>[...new Set(rows.filter(r=>r.keep).map(r=>r.section))].map(h=>[h,rows.filter(r=>r.keep&&r.section===h).map(r=>r.text)]);
  let out=materialize();
  while(countOf(out)>budget){
    const candidates=rows.filter(r=>r.keep&&!r.must).map(r=>{
      // Keep a useful method and tangible output before a second generic sentence from another section.
      const last=rows.filter(x=>x.keep&&x.section===r.section).length===1;
      const balance=last&&(r.section==='How we would do it'||r.section==='What you get')?18:0;
      return {r,score:r.rank+balance};
    }).sort((a,b)=>a.score-b.score||wordsIn(b.r.text)-wordsIn(a.r.text)||b.r.k-a.r.k);
    if(!candidates.length)break;
    candidates[0].r.keep=false;out=materialize();
  }
  const removed=rows.filter(r=>!r.keep),off=new Set(removed.filter(r=>r.ask!==null).map(r=>r.ask));
  return {sections:out,cut:removed.filter(r=>r.ask===null).length,off,overflow:countOf(out)>budget};
}
function written(d,q,bare){
  // step 69: the client's name goes into the first sentence the answer keeps that opens "We would" or "We will", so its words are set aside first
  const who=d.parts&&!d.m.fromContext?clientOrg():'';
  const f=facts(q,d),need=d.ai&&Array.isArray(d.ai.asks)?d.ai.asks.map((text,i)=>({text,i})):needsOf(q,d),lim=limitOf(q),budget=(lim?Math.floor(lim.max*0.985):Infinity)-(who?wordsIn(who)+1:0);   // a few words of margin, on a count that already includes every bullet's dash
  const fitOf=(S,x)=>lim?Object.assign({limit:lim.n,max:lim.max,words:countOf(S),tight:false,cutLines:[],cutAsk:new Set(),cutPoints:0,cutFacts:0},x):null;
  const tail=[...(f.length?[[HAVE,f]]:[]),...(need.length?[[NEED,need.map(x=>x.text)]]:[])];
  if(d.ai&&d.ai.model==='knowledge base'){
    const fitted=fitMethodAnswer(q,d.ai.sections,tail,budget,need);
    return {sections:fitted.sections,sources:d.ai.sources,fit:fitOf(fitted.sections,{tight:!!(fitted.cut||fitted.off.size),cutFacts:fitted.cut,cutAsk:fitted.off,mandatoryOverflow:fitted.overflow}),elsewhere:[],offAsk:new Set(),inLic:new Set(),brief:{lines:[],asks:new Set()}};
  }
  if(d.ai){   // step 88: the AI's answer; under a limit its last steps go first, never a section's first sentence
    const S=d.ai.sections.map(([h,items])=>[h,items.slice()]),T=tail.map(([h,items])=>[h,items.slice()]);let cut=0;
    const ask=T.find(x=>x[0]===NEED),off=new Set();
    while(ask&&ask[1].length&&countOf([...S,...T])>budget){ask[1].pop();off.add(need[ask[1].length].i);}   // the asks go first: they stay in the partner's checklist
    while(countOf([...S,...T])>budget){const s=S.filter(x=>x[1].filter(t=>!LICENSE_LINE.test(t)).length>1).sort((a,b)=>b[1].length-a[1].length)[0];if(!s)break;s[1].splice(s[1].map(t=>LICENSE_LINE.test(t)).lastIndexOf(false),1);cut++;}   // step 90: never the line that names a license
    const all=[...S,...T.filter(x=>x[1].length)];
    return {sections:all,sources:d.ai.sources,fit:fitOf(all,{cutFacts:cut,cutAsk:off}),elsewhere:[],offAsk:new Set(),inLic:new Set(),brief:{lines:[],asks:new Set()}};}
  if(d.kb){   // sentences from the knowledge base: the shorter wording when the full one is over the limit, then the last sentences of the last sections
    let S=d.sections,tight=false,cut=0;
    if(countOf([...S,...tail])>budget&&d.tight){S=d.tight;tight=true;}
    S=S.map(([h,items])=>[h,items.slice()]);
    while(countOf([...S,...tail])>budget){const s=S.slice().reverse().find(x=>x[1].length>1);if(!s)break;s[1].pop();cut++;}
    const r=recite([...S,...tail],d.sources);
    return {sections:r.sections,sources:r.sources,fit:fitOf(r.sections,{tight,cutFacts:cut}),elsewhere:[],offAsk:new Set(),inLic:new Set(),brief:{lines:[],asks:new Set()}};}
  if(!d.parts)return {sections:[...d.sections,...tail],sources:d.sources,fit:fitOf([...d.sections,...tail]),elsewhere:[],offAsk:new Set(),inLic:new Set(),brief:{lines:[],asks:new Set()}};
  const polish=t=>listify(industry(t)),askQ=NEEDS.test(q.text),ongoing=isOngoing(q.text),licQ=/\blicen[cs]/i.test(q.text);
  const own=[],away=new Map();
  for(const id of d.parts.ordered){const h=homeOf(id);if(h&&h!==q){if(!away.has(h))away.set(h,[]);away.get(h).push(id);}else own.push(id);}
  const items=[];let k=0;
  const add=(sec,text,pri,x)=>{if(text)items.push(Object.assign({sec,text,pri,k:k++,w:wordsIn(text)+1},x));};
  // what goes in first when words are short: the opening answer, licensing and what the client told the partner; then, turn about,
  // the services by how closely they match the question and the rest of the approach; what we need from the client last, unless the
  // question asks for it
  d.parts.approach.forEach((t,i)=>add(APPROACH,polish(t),i===0?0:(d.parts.extra||[]).includes(t)?3.4:d.parts.explain.includes(t)?1.2+i*0.01:/^The proposal also uses the documented connection/.test(t)?9:(d.parts.explain.length>1?3.05:2.05)+(i-1)*0.1,{must:i===0}));   // where the answer already explains itself, the connection's own text waits behind the services
  const ownLic=licQ&&d.parts.licensing.length>0;   // the answer explains its routes and says what each needs, so the plain list of licenses would only repeat it
  const inLic=new Set(ownLic?need.filter(x=>licenseAsk(x.text)).map(x=>x.i):[]);   // these asks are answered by the Licensing section's own lines
  if(ownLic)for(const t of d.parts.licensing)add(LICENSING,t,0.5,{must:true});
  else for(const x of need)if(licQ&&licenseAsk(x.text))add(LICENSING,x.text,0.5,{must:true});
  const howQ=HOW_IT_WORKS.test(q.text)&&d.parts.explain.length>0;   // "Describe how the product shows ...": the answer is the explanation, with one service to set it up
  const mainLines=d.m.conn?[...(d.m.conn.lines||[]),...(d.m.conn.more||[])]:[],ofProduct=id=>d.m.products.some(pid=>P[pid]&&[...(P[pid].lines||[]),...(P[pid].more||[])].includes(id));
  const rank=id=>(!d.m.conn||mainLines.includes(id)?0:ofProduct(id)?10:20)+d.m.lines.indexOf(id);
  const monthly=t=>/\beach month\b|\bmonthly\b|\bevery month\b|\bper month\b/i.test(t)?t:/^We will /.test(t)?'Each month we will '+t.slice(8):'Each month, '+lc(t);   // monthly work says so
  const said=t=>d.m.fromContext&&ownerOf(t.id)?ownerOf(t.id).name+': '+lc(monthly(t.text)):monthly(t.text);   // an after-launch answer says which product each service is for
  const top=own.filter(id=>LN[id].unit!=='monthly').sort((a,b)=>rank(a)-rank(b))[0];
  for(const id of own.filter(id=>LN[id].unit!=='monthly'))add(WORK,polish(doLine(id)),askQ&&id===top?0.9:2+rank(id)*0.1,{line:id,never:!!lim&&howQ&&id!==top});   // under a limit, a how-does-it-work answer keeps the one service that sets it up
  const elsewhere=[...away].map(([o,ids])=>({ref:refOf(o),names:ids.map(id=>LN[id].name)})),awayIds=new Set([...away].flatMap(x=>x[1]));   // said in full in another answer: not repeated, and the panel tells the partner where
  for(const id of own.filter(id=>LN[id].unit==='monthly'))add(AFTER,said({id,text:polish(doLine(id))}),(ongoing?2:3)+rank(id)*0.1,{line:id});
  const off=new Set(),lineOf=x=>(d.askLine||{})[d.asks[x.i]];
  for(const t of d.parts.estimate)add(ESTIMATE,t,1.5,{must:true});
  for(const t of f)add(HAVE,t,0.6,{must:true});
  for(const x of need)if(awayIds.has(lineOf(x)))off.add(x.i);   // an ask goes where its service goes
  need.filter(x=>!(licQ&&licenseAsk(x.text))&&!off.has(x.i)).forEach((x,i)=>add(NEED,x.text,(askQ?1:4)+(licenseAsk(x.text)?-0.05:i*0.001),{ask:x.i,never:!!lim&&howQ&&!askQ&&!lineOf(x)}));   // and only the asks that come with that service
  // step 69: a bank's or insurer's own controls, said once in the response
  const ctl=bare?'':controlsFor(d,q);if(ctl)add(APPROACH,ctl,3.6);
  let used=0;const open=new Set(),kept=new Set();
  for(const it of items.slice().sort((a,b)=>a.pri-b.pri||a.k-b.k)){const cost=it.w+(open.has(it.sec)?0:wordsIn(it.sec));
    if(it.must||(!it.never&&used+cost<=budget)){kept.add(it);open.add(it.sec);used+=cost;}}
  // an ask whose service the limit left out goes with it; what was passed over then gets the room
  const asks=items.filter(x=>x.sec===NEED),inAnswer=()=>new Set(items.filter(x=>x.line&&kept.has(x)).map(x=>x.line));
  for(const x of asks){const id=(d.askLine||{})[d.asks[x.ask]];if(id&&!inAnswer().has(id)){off.add(x.ask);if(kept.has(x)){kept.delete(x);used-=x.w;}}}
  for(const it of items.filter(x=>!kept.has(x)&&!x.never&&!(x.sec===NEED&&off.has(x.ask))).sort((a,b)=>a.pri-b.pri||a.k-b.k)){const cost=it.w+(open.has(it.sec)?0:wordsIn(it.sec));if(used+cost<=budget){kept.add(it);open.add(it.sec);used+=cost;}}
  if(d.m.fromContext)items[0].text=ONGOING_LEAD;   // each service below is led by its product
  const sections=SECTION_ORDER.map(sec=>[sec,items.filter(x=>x.sec===sec&&kept.has(x)).map(x=>x.text)]).filter(s=>s[1].length);
  if(who)for(const sec of [APPROACH,WORK]){const s=sections.find(x=>x[0]===sec),i=s?s[1].findIndex(t=>/^We (?:would|will) /.test(t)):-1;if(i>=0){s[1][i]='For '+who+', we'+s[1][i].slice(2);break;}}
  const brackets=new Set();for(const s of sections)s[1]=s[1].map(t=>t.replace(/ \(([^()]{20,})\)/g,(m,b)=>{if(brackets.has(b))return '';brackets.add(b);return m;}));
  // the sources of the services that are in the answer, after the sources of its opening sentences
  const inIds=d.m.lines.filter(id=>inAnswer().has(id)),src=[...d.parts.explainSources,...sources(Object.assign({},d.m,{lines:inIds}))].filter((x,i,a)=>a.findIndex(y=>y.url===x.url)===i);
  const brief={lines:items.filter(x=>x.line&&x.never&&!kept.has(x)).map(x=>x.line),asks:new Set(asks.filter(x=>x.never&&!kept.has(x)).map(x=>x.ask))};   // left out because the question asks how it works, not for room
  return {sections,sources:src,elsewhere,offAsk:off,inLic,brief,fit:fitOf(sections,{cutLines:items.filter(x=>x.line&&!x.never&&!kept.has(x)).map(x=>x.line),cutAsk:new Set(asks.filter(x=>!kept.has(x)&&!x.never&&!off.has(x.ask)).map(x=>x.ask)),cutPoints:items.filter(x=>x.sec===APPROACH&&!kept.has(x)).length})};
}
const sectionsOf=(d,q)=>written(d,q).sections;
// what the partner reads above the response when the RFP states a word limit
function fitHTML(d,q){
  if(!d)return '';const lim=limitOf(q),p=t=>'<p class="rfp-kb-from rfp-fit">'+t+'</p>';
  if(q.answer){if(!lim)return '';const n=wordsIn(q.answer);return p('Your edited answer is '+n+' words. This RFI asks for '+(lim.max<lim.n?'under ':'no more than ')+lim.n+(n>lim.max?', so shorten it with Edit.':'.'));}
  const w=written(d,q),fit=w.fit,notes=[];
  if(fit){const out=[];if(fit.cutLines.length)out.push(fit.cutLines.length+' service'+(fit.cutLines.length===1?'':'s')+' ('+fit.cutLines.map(id=>LN[id].name).join('; ')+')');
    if(fit.cutAsk.size)out.push(fit.cutAsk.size+' ask'+(fit.cutAsk.size===1?'':'s'));
    if(fit.cutPoints)out.push(fit.cutPoints+' point'+(fit.cutPoints===1?'':'s')+' of the approach');
    if(fit.cutFacts)out.push(fit.cutFacts+' sentence'+(fit.cutFacts===1?'':'s'));
    notes.push(limitSays(lim)+' This answer is '+fit.words+(fit.words>lim.max?', over the limit: shorten it with Edit.':'.')+
      (fit.tight?' It uses the shorter wording of each fact.':'')+(out.length?' Left out to fit: '+esc(listOf(out))+'. '+(fit.cutFacts&&!fit.cutLines.length&&!fit.cutAsk.size?'Add them back with Edit if you have the room.':'The services stay in your statement of work list and the asks in your checklist.'):''));}
  if(w.brief.lines.length||w.brief.asks.size)notes.push('The question asks how it works, so under the limit the answer keeps to that and one service. Not in it: '+esc(listOf([...(w.brief.lines.length?[w.brief.lines.length+' service'+(w.brief.lines.length===1?'':'s')+' ('+w.brief.lines.map(id=>LN[id].name).join('; ')+')']:[]),...(w.brief.asks.size?[w.brief.asks.size+' ask'+(w.brief.asks.size===1?'':'s')]:[])]))+'. They stay in your statement of work list and your checklist.');
  for(const e of w.elsewhere)notes.push('Not repeated here, because your answer to '+esc(e.ref)+' says it in full: '+esc(e.names.join('; '))+'.');
  return notes.map(p).join('');}
const SRC_HEAD='Adobe sources for the product facts above';
const hasDraft=d=>!!d&&(d.m.lines.length>0||!!d.kb||!!d.ai);   // a drafted answer: services from the catalog, sentences from the knowledge base, or the AI writer's answer (step 89)
// a knowledge-base line leads with its products' names in bold, as in the approved picture
function kbItem(x){const m=/^([^:]{1,200}): /.exec(x);if(!m||!m[1].split(/, | and /).every(n=>CAT.products.some(p=>p.name===n)))return esc(x);return '<b>'+esc(m[1])+':</b> '+esc(x.slice(m[0].length));}
function plain(d,q){const w=written(d,q);return w.sections.map(([h,items])=>h+'\n'+items.map(x=>'- '+x).join('\n')).join('\n\n')+(w.sources.length?'\n\n'+SRC_HEAD+'\n'+w.sources.map((s,i)=>(d.kb?(i+1)+'. ':'- ')+s.title+': '+s.url).join('\n'):'');}
// a list inside an item (listify) is a list inside the bullet
const itemHTML=(x,kb)=>{const [head,...steps]=x.split('\n  - ');return (kb?kbItem(head):esc(head))+(steps.length?'<ul>'+steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul>':'');};
function answerHTML(d,q){const w=written(d,q);return w.sections.map(([h,items])=>'<h4>'+esc(h)+'</h4>'+(items.length===1&&h==='Our approach'?'<p>'+esc(items[0])+'</p>':'<ul>'+items.map(x=>'<li>'+itemHTML(x,d.kb)+'</li>').join('')+'</ul>')).join('')+(w.sources.length?'<h4>'+SRC_HEAD+'</h4><'+(d.kb?'ol':'ul')+' class="rfp-sources">'+w.sources.map(s=>'<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener">'+esc(s.title)+'</a></li>').join('')+'</'+(d.kb?'ol':'ul')+'>':'');}

/* ---------- the answer panel */
const rfpState=R.state;let editing=false;
// kept until the questions or their piles change: every answer asks for it, and it reads every question (on a 60-line RFI a click took
// four seconds without this)
let ctxOf=null,ctxKey='',ctxIs=[];
function contextProducts(){const qs=rfpState.questions,key=qs.map(q=>q.kind==='adobe'?'a':'-').join('');
  if(ctxOf!==qs||ctxKey!==key){ctxOf=qs;ctxKey=key;const c={};for(const q of qs){if(q.kind!=='adobe')continue;for(const id of detectAll(q.text).named)c[id]=(c[id]||0)+1;}
    ctxIs=Object.entries(c).sort((x,y)=>y[1]-x[1]).map(x=>x[0]).filter(id=>!P[id].outside);}
  return ctxIs.slice();}
function current(){const i=rfpState.selected;return Number.isInteger(i)?rfpState.questions[i]:null;}
// Drawn from: the partner can take a product out or add one, and the answer is drafted again (step 52)
function chipsHTML(q,d){
  const prods=(d&&d.m?d.m.products:(q.pick||[])).filter(id=>P[id]);
  const conns=d&&d.m&&d.m.conn?[d.m.conn]:[];
  const add='<select class="rfp-add" id="rfp-add" aria-label="Add a product to draw from"><option value="">+ Add a product</option>'+CAT.products.filter(p=>!prods.includes(p.id)).map(p=>'<option value="'+p.id+'">'+esc(p.name+(p.outside?' (outside Adobe)':''))+'</option>').join('')+'</select>';
  return '<p class="rfp-drawn">Drawn from: '+prods.map(id=>'<span class="rfp-chip">'+esc(P[id].name)+'<button type="button" data-rm="'+id+'" aria-label="Take '+esc(P[id].name)+' out of this answer">\u00d7</button></span>').join('')+conns.map(c=>'<span class="rfp-chip conn">'+esc(P[c.a].name+' + '+P[c.b].name)+'</span>').join('')+add+'</p>';
}
function capHTML(d){
  if(d.capability)return '<div class="rfp-cap"><h4>A capability question, not answered from this catalog</h4><p>This catalog describes services and the documented connections between Adobe products. It does not hold product facts such as hosting, security, compliance, languages or limits, so it drafts nothing here rather than a build plan. Check Adobe\'s pages and write the answer yourself:</p><ul>'+d.links.map(s=>'<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener">'+esc(s.title)+'</a></li>').join('')+'</ul></div>';
  return '<div class="rfp-cap"><h4>Not in this catalog</h4><p>'+esc(listOf(d.uncovered))+(d.uncovered.length>1?' are':' is')+' an Adobe product this catalog does not cover, so it drafts nothing here rather than an answer about another product. Check Adobe\'s pages and write the answer yourself.</p></div>';
}
function whyNone(q){const d=detectAll(q.text),named=q.pick&&q.pick.length?q.pick:d.named;let out=d.excluded.length?'Your client rules out '+listOf(d.excluded)+', so nothing is drafted from '+(d.excluded.length>1?'them':'it')+'. ':'';
  // a documented connection with no services behind it (Journey Optimizer + Brand Concierge): the partner learns what Adobe says
  for(const c of C)if(named.includes(c.a)&&named.includes(c.b)&&![...(c.lines||[]),...(c.more||[])].some(l=>LN[l])){const why=c.sowNote||c.availability||'';out+='Experience League lists no services for '+P[c.a].name+' + '+P[c.b].name+(why?': '+partnerVoice(why).replace(/\.?$/,'.'):'.')+' ';}
  return out;}
function renderAnswer(){
  const box=$r('rfp-answer');if(!box)return;const q=current();
  if(!q){box.innerHTML='<p class="hint">Pick a question on the left to see its drafted answer.</p>';return;}
  const head='<h3>'+(q.label?'<b>'+esc(q.label)+'</b> ':'')+R.longHTML(q,rfpState.selected)+'</h3>';   // step 74: a long line is shown short, so its answer stays in view
  if(q.kind==='unsure'){box.innerHTML=head+'<p class="rfp-note">Sort this question first: choose Adobe products or Your firm in the menu on its row. Questions in To sort are not drafted, counted or downloaded with a draft.</p>'+nav();return;}
  if(q.kind==='firm'){box.innerHTML=head+stateTag(q)+'<p class="rfp-note">This one is about your firm, so it is yours to write. Type it here (it is kept as you type) and approve it, and it goes into the downloads in place of the blank.</p>'+
    '<textarea id="rfp-firm" rows="7" placeholder="Your answer" aria-label="Your answer">'+esc(q.answer||'')+'</textarea><div class="rfp-actions">'+approveBtn('rfp-firm-use',q)+leaveBtn(q)+nav()+'</div>';return;}
  if(!q.draft)q.draft=compose(q);
  if(!q.draft){   // no match: the partner writes the answer here, approves it or leaves the question out, like a capability question; a saved answer stays in view
    box.innerHTML=head+stateTag(q)+chipsHTML(q,null)+'<p class="rfp-note">No match in the catalog for this question. '+esc(whyNone(q))+'Write the answer here, add a product above to draw from, or move it to Your firm. The questions this tool answers are about Adobe products, their connections and the services around them.</p>'+
      '<textarea id="rfp-firm" rows="6" placeholder="Your answer" aria-label="Your answer">'+esc(q.answer||'')+'</textarea><div class="rfp-actions">'+approveBtn('rfp-firm-use',q)+leaveBtn(q)+nav()+'</div>';return;}
  const d=q.draft,state=stateTag(q);
  if(!hasDraft(d)){   // the capability box, or a product this catalog does not cover: the partner writes the answer
    box.innerHTML=head+state+chipsHTML(q,d)+capHTML(d)+noteHTML(d,q)+'<textarea id="rfp-firm" rows="6" placeholder="Your answer" aria-label="Your answer">'+esc(q.answer||'')+'</textarea><div class="rfp-actions">'+approveBtn('rfp-firm-use',q)+leaveBtn(q)+nav()+'</div>';return;}
  if(editing){box.innerHTML=head+state+'<textarea id="rfp-edit" rows="16" aria-label="Edit the answer">'+esc(q.answer||plain(d,q))+'</textarea><div class="rfp-actions"><button type="button" class="primary" id="rfp-save-edit">Save and approve</button><button type="button" id="rfp-cancel-edit">Cancel</button></div>';return;}
  const body='<div id="rfp-body">'+fitHTML(d,q)+(q.answer?'<pre class="rfp-plain">'+esc(q.answer)+'</pre>':answerHTML(d,q))+'</div>';
  const firmPart=d.firmPart?'<div class="rfp-firm-part"><h4>Your part to write</h4><p>This question also asks for '+esc(d.firmPart)+'. The catalog does not answer that part: add it with Edit before you use the answer.</p></div>':'';
  const kbFrom=d.kb?'<p class="rfp-kb-from">'+(d.fromRFP?'The products your other answers in this RFI propose. ':'')+'<span class="rfp-kb-checked">Adobe\'s public pages, checked '+esc(kbDate(d.checked))+'</span></p>':'';
  const fromRfp=d.m&&d.m.via==='rfp'?'<p class="rfp-kb-from" id="rfp-from-rfp">This line names no product, so the answer draws on the products this RFI is about. Remove one above if it does not belong.</p>':'';
  box.innerHTML=head+state+chipsHTML(q,d)+fromRfp+kbFrom+'<p class="rfp-voice">Your response to the client</p>'+body+firmPart+noteHTML(d,q)+
    '<div class="rfp-actions">'+approveBtn('rfp-use',q)+'<button type="button" id="rfp-edit-btn">Edit</button>'+leaveBtn(q)+nav()+'</div>';
}
// step 55: Approve and Leave out are toggles, and the row says Approved or Left out. Step 69 (Nov 10 2026, Adam: "unapproved by who?"):
// the button reads "Use this answer" and the row "In your response", so it is plainly the partner's own choice
const stateTag=q=>q.status==='used'?'<span class="rfp-state ok">In your response</span>':q.status==='skipped'?'<span class="rfp-state">Left out</span>':'';
const approveBtn=(id,q)=>'<button type="button" class="primary" id="'+id+'">'+(q.status==='used'?'In your response, undo':'Use this answer')+'</button>';
const leaveBtn=q=>'<button type="button" id="rfp-skip">'+(q.status==='skipped'?'Left out, undo':'Leave out')+'</button>';
function redraft(q,pick){q.pick=pick;delete q.ai;delete q.draft;delete q.lines;if(q.status==='used')delete q.status;editing=false;q.draft=compose(q);R.renderList();renderAnswer();summary();}   // new text, so the approval goes with the old one
function nav(){return '<button type="button" id="rfp-next">Next to review</button>';}
function select(i){rfpState.selected=i;editing=false;R.renderList();renderAnswer();}
// Next to review: the next row the filter shows that still needs a decision (an Adobe or firm question with no status), after the open one (step 55)
function next(){const rows=[...document.querySelectorAll('#rfp-questions li[data-i]')].filter(li=>!li.hidden).map(li=>Number(li.dataset.i));
  if(!rows.length){toast('This filter shows no questions, so there is nothing to review here.');return;}
  const sel=rfpState.selected;let from=Number.isInteger(sel)?rows.indexOf(sel):-1,hidden=false;
  if(from<0&&Number.isInteger(sel)){from=rows.filter(i=>i<sel).length-1;hidden=true;}   // the open row is hidden by the filter: carry on after its place in the list
  for(let k=1;k<=rows.length-(from<0||hidden?0:1);k++){const i=rows[(from+k+rows.length)%rows.length],q=rfpState.questions[i];if(q&&(q.kind==='adobe'||q.kind==='firm')&&!q.status){select(i);return;}}
  const cur=current(),open=!hidden&&cur&&(cur.kind==='adobe'||cur.kind==='firm')&&!cur.status,unsure=rfpState.questions.filter(q=>q.kind==='unsure').length;
  toast((rfpState.filter==='all'?(open?'Every other question is reviewed.':'Every question is reviewed.'):(open?'Everything else this filter shows is reviewed.':'Everything this filter shows is reviewed.'))+(unsure&&rfpState.filter!=='unsure'?' '+unsure+' still to sort.':''));}
// on load the first Adobe answer opens, so the panel is never empty (Nov 9)
function first(){const i=rfpState.questions.findIndex(q=>q.kind==='adobe');if(i>=0)select(i);}
// step 70 (Adam: "0-6 firm answers sounds off", "what if they want to go back and fill in their answers that they missed?"): one count a
// line, in plain words, and beside it a link to the questions of that kind with no decision yet
function countLine(kind,what,qs){
  const n=qs.filter(q=>q.status==='used').length,left=qs.filter(q=>!q.status).length,one=qs.length===1;
  return '<span class="rfp-count"><b>'+(n===qs.length&&!one?'All '+n:n+' of '+qs.length)+'</b> '+what[one?0:1]+' answered.'+
    (left?' <button type="button" class="rfp-link" id="rfp-left-'+kind+'">Go to the '+left+' that '+(left===1?'is':'are')+' left</button>':'')+'</span>';}
function summary(){
  const el=$r('rfp-summary');if(!el)return;const qs=rfpState.questions;if(!qs.length){el.hidden=true;return;}
  const adobe=qs.filter(q=>q.kind==='adobe'),lines=selectedLineIds();
  el.hidden=false;
  const firm=qs.filter(q=>q.kind==='firm'),wb=writable();
  // Nov 9 (Adam: "the big red button and the download and that is it", from sow/mockups/summary_bar/summary_bar.png): the red button,
  // one Download menu holding the four downloads (each says what you get), and Save and Open as links; the buttons keep their ids
  const item=(id,title,what)=>'<button type="button" role="menuitem" id="'+id+'"><b>'+title+'</b><span>'+what+'</span></button>';
  el.innerHTML='<div class="rfp-sum-head"><p>'+(adobe.length?countLine('adobe',['Adobe product question is','Adobe product questions are'],adobe):'')+(firm.length?countLine('firm',['question about your firm is','questions about your firm are'],firm):'')+'<span class="rfp-count"><b>'+lines.size+' service'+(lines.size===1?'':'s')+'</b> selected for the statement of work.</span></p><div class="rfp-work-links"><button type="button" class="rfp-link" id="rfp-save-work">Save my work</button><button type="button" class="rfp-link" id="rfp-open-work">Open my work</button></div></div>'+
    '<label class="rfp-client"><span>Client\'s name in the answers</span><input type="text" id="rfp-client" maxlength="80" value="'+esc(clientOrg())+'" placeholder="Leave empty to use no name"></label>'+
    '<div class="rfp-actions"><button type="button" class="primary" id="rfp-to-sow"'+(lines.size?'':' disabled')+'>Add to my statement of work</button>'+
    '<div class="rfp-dl"><button type="button" id="rfp-download-menu" aria-haspopup="menu" aria-expanded="false" aria-controls="rfp-dl-menu">Download <span aria-hidden="true">\u25be</span></button>'+
    '<div class="rfp-dl-menu" id="rfp-dl-menu" role="menu" hidden>'+
    (wb?item('rfp-writeback','Your answers in '+esc(wb.w.name),'Your client\'s own file, with the answers in its '+esc(wb.head)+' column. '+(isXlsx(wb.w)?'Its formatting is kept, and the Adobe sources go on a sheet at the end.':'Values only: its formatting is not kept.')):'')+
    // step 81 (Adam: "we should do a better job of labeling the outputs", then "the top one starting with answers, to print"): four plain lines
    item('rfp-download','Answers, to print','Your chosen answers, in order.')+
    item('rfp-download-xlsx','Answers, in Excel','Your chosen answers, one row each.')+
    item('rfp-download-proposal','Full proposal, in Word','Written by AI. Takes 2 to 3 minutes.')+
    item('rfp-download-asks','My checklist','Notes for you, not the client.')+'</div></div></div>';
}
// the services behind the approved answers, minus the ones the partner unticked on the answer (step 56)
// an approved answer back from storage counts before its row is opened. A question the catalog cannot answer is remembered too
// (null), so it is not worked out again on every click; one worked out in the middle of another answer's draft is not kept
function draftOf(q){if(q.draft!==undefined)return q.draft;if(q.kind!=='adobe')return null;const d=compose(q);if(d||!kbBusy)q.draft=d;return d;}
const tickedLines=q=>{const d=q.status==='used'&&q.kind==='adobe'?draftOf(q):null;return d?d.m.lines.filter(id=>!(q.lines&&q.lines[id]===false)):[];};
function selectedLineIds(){const s=new Set();for(const q of rfpState.questions)for(const id of tickedLines(q))s.add(id);return s;}
function selectedProducts(){const s=new Set();for(const q of rfpState.questions){if(!tickedLines(q).length)continue;const m=q.draft.m;for(const id of m.products)s.add(id);if(m.conn){s.add(m.conn.a);s.add(m.conn.b);}}return s;}

/* ---------- into the statement of work: the same hand-off the canvas uses, as Your own play. Step 56: a preview first, then a
   merge: the RFP's services join what the statement of work already holds, the rate, size, term and currency stay, and the
   prerequisites the partner unticked on an answer stay out of the lines' text. */
const onInTool=id=>{const e=(typeof state!=='undefined'&&state.estimates&&state.estimates.custom)||{};return !!((e[id]&&e[id].on)||(e['CANVAS-'+id]&&e['CANVAS-'+id].on));};
function handoffPlan(){const lines=selectedLineIds(),prods=[...selectedProducts()],answers=rfpState.questions.filter(q=>tickedLines(q).length).length,fresh=[...lines].filter(id=>!onInTool(id));return {lines,prods,answers,fresh};}
function previewSow(){const {lines,prods,answers,fresh}=handoffPlan();if(!lines.size)return;const names=prods.filter(id=>!P[id].outside).map(id=>P[id].name);
  let c=null;try{c=JSON.parse(localStorage.getItem('abv-sow-build-v1')||'null');}catch(e){}const other=c&&typeof c==='object'&&c.play&&c.play!=='custom'&&typeof PLAYS!=='undefined'&&PLAYS[c.play]&&typeof hasWork==='function'&&hasWork(c.play)?PLAYS[c.play].label:null;   // a named play with work on it gives way to Your own play; the tool keeps that work
  $r('rfp-handoff-text').textContent=(fresh.length?'This adds '+fresh.length+' service'+(fresh.length===1?'':'s')+(fresh.length<lines.size?' ('+(lines.size-fresh.length)+' of the '+lines.size+' already there)':'')+' from '+answers+' chosen answer'+(answers===1?'':'s')+' to Your own play on the Services step'+(names.length?' ('+listOf(names)+')':'')+'.':'Every service from the '+answers+' chosen answer'+(answers===1?'':'s')+' is already on Your own play; this only opens the Services step.')+' Your rate, size, term and currency stay as they are, and nothing already in the statement of work is removed.'+(other?' Your own play opens in place of '+other+', whose work stays saved in the tool.':'');
  $r('rfp-handoff-modal').hidden=false;$r('rfp-handoff-go').focus();}
// the asks unticked on approved answers: their prerequisite stays out of the statement of work's line text
function droppedPrereqs(){const s=new Set();for(const q of rfpState.questions)if(q.status==='used'&&q.kind==='adobe'&&q.ticks&&q.draft)for(const [k,v] of Object.entries(q.ticks))if(v===false&&q.draft.asks.includes(k))s.add(k);return s;}
function toSow(){
  const {lines,prods}=handoffPlan();if(!lines.size)return;
  let c=null;try{c=JSON.parse(localStorage.getItem('abv-sow-build-v1')||'null');}catch(e){}if(!c||typeof c!=='object'||Array.isArray(c))c={};
  const held=c.play==='custom',union=(a,b)=>[...new Set([...(held&&Array.isArray(a)?a:[]),...b])].filter(id=>P[id]);
  const adobe=union(c.on,prods.filter(id=>!P[id].outside)),outside=union(c.out,prods.filter(id=>P[id].outside)),all=[...adobe,...outside];
  const owners=[...all.map(id=>P[id]),...C.filter(x=>all.includes(x.a)&&all.includes(x.b))],dropped=droppedPrereqs();
  const payload=[],seen=new Set(),ls=held&&c.ls&&typeof c.ls==='object'?Object.assign({},c.ls):{};
  for(const o of owners){const conn='a' in o;
    const dropSow=new Set();if(conn)for(const p of (o.prereqs||[]))if(dropped.has(p)){dropSow.add(p);const cv=closest(p,o.sowPrereqs||[]);if(cv)dropSow.add(cv);}
    const pre=conn?((o.sowPrereqs&&o.sowPrereqs.length?o.sowPrereqs:(o.prereqs||[])).filter(p=>!dropSow.has(p))):[];
    for(const l of [...(o.lines||[]),...(o.more||[])]){if(seen.has(l)||!LN[l])continue;seen.add(l);const L=LN[l],on=lines.has(l)||ls[l]===true;if(lines.has(l))ls[l]=true;
      payload.push({id:l,on,lock:false,want:on,def:(o.lines||[]).includes(l),name:L.name,unit:L.unit,low:L.low,base:L.base,high:L.high,url:L.url,src:L.src,references:L.references||[],scope:L.scope||'',stage:L.unit==='monthly'?'Optimize':conn?'Connect':'Launch',
        prereqs:[L.origin==='research'&&conn&&(o.sowAvailability||o.availability)?'Availability: '+String(o.sowAvailability||o.availability).replace(/([^.])$/,'$1.'):'',L.origin==='research'&&conn&&pre.length?'Prerequisites for '+P[o.a].name+' + '+P[o.b].name+': '+pre.join('; ').replace(/\.$/,'')+'.':'',L.ext?'Also needs '+L.ext.replace(/\.$/,'')+'.':'',L.tier&&![...dropped].some(k=>k.endsWith(': '+L.tier.replace(/\.?$/,'')+'.'))?'Assumes your client has '+L.tier.replace(/\.$/,'')+'.':''].filter(Boolean).join(' ')});}}
  const now=Date.now(),names=adobe.map(id=>P[id].name);
  try{
    localStorage.setItem('abv-sow-handoff',JSON.stringify({v:1,play:'custom',size:state.size||'typical',lines:payload,managed:[...lines],fresh:false,products:adobe,names,outside,at:now}));
    localStorage.setItem('abv-sow-build-v1',JSON.stringify(Object.assign({},c,{v:2,play:'custom',on:adobe,out:outside,ls,keep:held&&c.keep&&typeof c.keep==='object'?c.keep:{},rate:held&&'rate' in c?c.rate:(state.rate||0),size:c.size||state.size||'typical',months:c.months||state.months||12,eff:held?c.eff||null:null,fresh:false,cur:c.cur||state.currency||'USD',def:held?c.def||null:null,recover:names})));
  }catch(e){toast('This browser blocks saving, so the services could not be carried over.');return;}
  if(R.rfiOnly)R.rfiOnly(false);   // step 57: the RFI Builder on its own hands over to the full tool
  applyHandoff();render();go('services');toast(lines.size+' service'+(lines.size===1?'':'s')+' from the RFI '+(lines.size===1?'is':'are')+' on Your own play, beside what was there. The RFI list is still on the RFI Builder tab.');
}

/* ---------- the response document: the client's copy (step 53: no intro about the partner, no status tags) */
const CAP_TAG='Capability question: not answered from the catalog',OUT_TAG='Not in this catalog';
// the client's file, without its extension or " and N more"; a paste has no name the client should read
const clientName=()=>{const n=String(rfpState.name||'');if(!n||/^pasted(?: text|\.txt)?$/i.test(n))return 'your request for proposal';
  return n.replace(/ and \d+ more$/,'').replace(/\.[a-z0-9]+$/i,'').replace(/_+/g,' ').replace(/(?<!\d)-|-(?!\d)/g,' ').replace(/\s+/g,' ').trim()||'your request for proposal';};
const DOC_CSS='body{font-family:"Source Sans 3",Arial,sans-serif;color:#1c1c1c;max-width:860px;margin:40px auto;padding:0 20px;line-height:1.5}h1{font-size:26px}h3{font-size:17px;margin:28px 0 4px}h4{font-size:13px;letter-spacing:1.2px;text-transform:uppercase;margin:14px 0 4px}p,li{font-size:15px}.blank{font-weight:600}.space{height:90px;border:1px dashed #999;border-radius:8px}pre{white-space:pre-wrap;font:inherit}section{page-break-inside:avoid}.intro{border:1.5px solid #1c1c1c;border-radius:10px;padding:12px 16px}';
// step 88 (Nov 12 2026, Adam: "The answers didn't print out because I didn't choose any of the answers"): while no answer is
// marked "Use this answer", the downloads carry every drafted answer; once one is marked, only the marked ones, as before
const noneUsed=()=>!rfpState.questions.some(q=>q.status==='used');
const inResponse=q=>q.status==='used'||(q.status!=='skipped'&&noneUsed());
function responseDoc(){
  const qs=rfpState.questions,name=clientName();
  const blank='<p class="blank">Your answer:</p><div class="space"></div>';
  // the answers marked "Use this answer" only (step 70), or every drafted answer while none is marked (step 88); every other question stays blank
  const own=q=>q.answer&&inResponse(q)?'<pre>'+esc(q.answer)+'</pre>':blank;
  const body=qs.map(q=>{const label=(q.label?q.label+' ':'')+q.text;
    if(q.kind!=='adobe')return '<section><h3>'+esc(label)+'</h3>'+own(q)+'</section>';
    const d=q.draft||compose(q);
    if(!hasDraft(d)||q.status==='skipped')return '<section><h3>'+esc(label)+'</h3>'+own(q)+'</section>';
    if(!inResponse(q))return '<section><h3>'+esc(label)+'</h3>'+blank+'</section>';
    const text=q.answer?'<pre>'+esc(q.answer)+'</pre>':answerHTML(d,q);
    return '<section><h3>'+esc(label)+'</h3>'+text+'</section>';}).join('');
  return '<!doctype html><html><head><meta charset="utf-8"><title>Response to '+esc(name)+'</title><style>'+DOC_CSS+'</style></head><body>'+
    '<h1>Response to '+esc(name)+'</h1>'+body+'</body></html>';
}

/* ---------- the partner's checklist: the four lists of the note, question by question (step 54) */
function asksDoc(){
  const qs=rfpState.questions,name=rfpState.name||'RFI';
  const li=x=>'<li>'+esc(partnerVoice(x))+'</li>';
  // what each ask's line says about the response: skipped and edited questions send nothing from the box (finding 6.6)
  const mark=(q,d,i)=>{const f=factOf(q,d,i),says=f?'<br><b>Your client says: </b>'+esc(f):'';
    if(q.status==='skipped')return 'Not in the response: the question is left out</b>'+says;
    if(q.answer)return (inEdited(q,d,i)?'In the edited answer</b>':'Not in the edited answer</b>')+says;
    if(f)return 'Your client says: </b>'+esc(f)+' (in the response as what you already have in place)';
    return ticked(q,d,i)?'In the response as what we would need from you</b>':'Not in the response</b>';};
  const body=qs.map(q=>{if(q.kind!=='adobe')return '';const d=q.draft||compose(q);if(!d)return '';
    const extra=extraLines(d),confirm=confirmLines(d);
    if(!d.sells.length&&!d.asks.length&&!confirm.length&&!(d.assumptions||[]).length&&!extra.length&&!d.firmPart)return '';
    return '<section><h3>'+esc((q.label?q.label+' ':'')+q.text)+'</h3>'+(d.firmPart?'<h4>Your part to write</h4><p>'+esc(d.firmPart)+'</p>':'')+extra.map(x=>'<p>'+esc(x)+'</p>').join('')+
      (d.sells.length?'<h4>Adobe licenses this proposal includes (Adobe quotes them)</h4><ul>'+d.sells.map(li).join('')+'</ul>':'')+
      (d.asks.length?'<h4>Ask your client</h4><ul>'+d.asks.map((x,i)=>'<li>'+esc(partnerVoice(x))+'<br><b>'+mark(q,d,i)+(factOf(q,d,i)?'':'<br><b>Will confirm with the client</b>')+'</li>').join('')+'</ul>':'')+
      (confirm.length?'<h4>Confirm with Adobe</h4><ul>'+confirm.map(li).join('')+'</ul>':'')+
      ((d.assumptions||[]).length?'<h4>Assumptions behind this answer</h4><ul>'+d.assumptions.map(li).join('')+'</ul>':'')+'</section>';}).join('');
  return '<!doctype html><html><head><meta charset="utf-8"><title>'+esc(name)+': your checklist</title><style>'+DOC_CSS+'</style></head><body>'+
    '<h1>'+esc(name)+': your checklist</h1><p class="intro">For your firm, not for the client. For each question the tool drafted an answer to, this lists the Adobe licenses the proposal includes, what to ask your client, what to confirm with Adobe and the assumptions behind the answer. Nothing here is in the downloaded response, the Excel or your client\'s workbook except the items you ticked, which appear there as "'+NEED+'", and what you typed, which appears as "'+HAVE+'". A skipped question sends nothing, and an edited answer carries only what you typed into it.</p>'+(body||'<p>No drafted answer needs anything from your client.</p>')+'</body></html>';
}

/* ---------- the response as a workbook (RFPs arrive as spreadsheets, so the answer can go back as one) */
function loadXLSX(){return new Promise((ok,fail)=>{if(window.XLSX)return ok(window.XLSX);const sc=document.createElement('script');sc.src='lib/xlsx.mini.min.js';sc.onload=()=>ok(window.XLSX);sc.onerror=()=>fail(Error('The spreadsheet library did not load.'));document.head.appendChild(sc);});}
const PRIORITY={mandatory:'Mandatory',desirable:'Desirable'};
const stripSources=t=>t.replace(new RegExp('\\n\\n'+SRC_HEAD+'\\n[\\s\\S]*$'),'');
function responseRows(){
  const rows=[['Number','Section','Question','Mandatory or desirable','Response','Comply','Status']],srcs=[['Number','Source','Link']];
  for(const q of rfpState.questions){const d=q.kind==='adobe'?(q.draft||compose(q)):null;
    // the Status column says where each answer stands, in words a client may read too (step 53): no "partner" in it.
    // Step 55: approved answers only (step 70: no drafts)
    let text='',status='';const drafted=hasDraft(d);
    if(q.kind==='unsure'){status='Still to sort';}
    else if(q.status==='skipped'){status='Not answered';}
    else{const body=q.answer||(drafted?stripSources(plain(d,q)):'');
      if(!body)status='Still to write';
      else if(q.status==='used'){text=body;status='Final';}
      else if(noneUsed()){text=body;status='Draft';}   // step 88: no answer is marked yet, so every draft goes in
      else status='Draft, not included';
      if(text&&drafted)for(const [i,s] of written(d,q).sources.entries())srcs.push([q.label||'',(d.kb?(i+1)+'. ':'')+s.title,s.url]);}   // a knowledge-base answer's numbers match its sources
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
const baseName=n=>(n||rfpState.name||'RFI').replace(/ and \d+ more$/,'').replace(/\.[a-z0-9]+$/i,'').replace(/[^a-zA-Z0-9-]/g,'-').slice(0,80);
// Write the answers the partner used back into the client's own workbook, in its Response column (step 51)
function writable(){
  for(const w of rfpState.workbooks||[])for(const [sheet,S] of Object.entries(w.sheets||{}))if(S.cols&&S.cols.response!==undefined&&rfpState.questions.some(q=>q.file===w.name&&q.sheet===sheet))
    return {w,head:String(((S.headers||[])[S.cols.response])||'Response').trim()||'Response'};
  return null;
}
// what goes back into the client's workbook: an answer marked "Use this answer" (every drafted answer while none is marked, step 88); nothing for any other question
function usedText(q,bodyOnly){
  if(q.status==='skipped')return '';
  const d=q.kind==='adobe'?(q.draft||compose(q)):null,body=q.answer||(d&&d.m.lines.length?stripSources(plain(d,q)):d&&d.kb?(bodyOnly?stripSources(plain(d,q)):plain(d,q)):'');   // a workbook written without a sources sheet (a CSV, an old .xls) keeps a knowledge-base answer's numbered sources in the cell
  if(!body)return '';
  return inResponse(q)?body:'';
}
/* Step 67: an .xlsx comes back as the client made it. The answers are written into the file's own XML, so its fonts, fills, column
   widths, other sheets and everything else stay as they were; each answer cell wraps and sits at the top of its row, its column is
   widened to fit an answer, and the Adobe sources go on a new last sheet (the cells keep the numbers that point to them). The result is
   read back and checked before it is offered; if anything about the file is unusual, the older values-only route below is used. */
const isXlsx=W=>!!W&&W.type!=='csv'&&!!W.bytes&&W.bytes[0]===0x50&&W.bytes[1]===0x4b;
const xmlEsc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'');
const colNum=a=>[...a.replace(/\d+$/,'')].reduce((n,ch)=>n*26+ch.charCodeAt(0)-64,0);
const SRC_SHEET='Adobe sources',ANSWER_WIDTH=110;
function fillXlsx(X,bytes,cells,srcRows){
  const zip=X.CFB.read(bytes,{type:'array'}),dec=new TextDecoder('utf-8'),enc=new TextEncoder();
  const read=p=>{const f=X.CFB.find(zip,p);return f&&f.content?dec.decode(new Uint8Array(f.content)):null;};
  const write=(p,text)=>{const data=enc.encode(text),f=X.CFB.find(zip,p);if(f){f.content=data;f.size=data.length;}else X.CFB.utils.cfb_add(zip,p,data);};
  const attr=(tag,name)=>{const m=new RegExp('(?:^|\\s)'+name+'="([^"]*)"').exec(tag);return m?m[1]:null;};
  const unesc=s=>String(s||'').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
  let wbx=read('/xl/workbook.xml'),rels=read('/xl/_rels/workbook.xml.rels'),types=read('/[Content_Types].xml'),styles=read('/xl/styles.xml');
  if(!wbx||!rels||!types||!/<sheets>/.test(wbx))throw Error('workbook parts');
  const sheetTags=wbx.match(/<sheet\b[^>]*\/>/g)||[],relTags=rels.match(/<Relationship\b[^>]*\/>/g)||[];
  const pathOf=name=>{const t=sheetTags.find(x=>unesc(attr(x,'name'))===name),rel=t&&relTags.find(r=>attr(r,'Id')===attr(t,'r:id')),tg=rel&&attr(rel,'Target');return tg?(tg[0]==='/'?tg:'/xl/'+tg):null;};
  // a copy of a cell's own style that wraps and sits at the top, added to the workbook's styles once per style
  const xfBlock=styles&&/<cellXfs\b[^>]*>([\s\S]*?)<\/cellXfs>/.exec(styles),xfs=xfBlock?(xfBlock[1].match(/<xf\b[^>]*\/>|<xf\b[^>]*>[\s\S]*?<\/xf>/g)||[]):[],added=[],wrapOf={};
  const wrapStyle=s=>{if(s in wrapOf)return wrapOf[s];const base=xfs[Number(s)||0];if(!base)return wrapOf[s]=null;
    const open=/^<xf\b([^>]*?)\/?>/.exec(base)[1].replace(/\s*applyAlignment="[^"]*"/,''),inner=/\/>$/.test(base)&&!/<\/xf>$/.test(base)?'':base.replace(/^<xf\b[^>]*>/,'').replace(/<\/xf>$/,'');
    const al=/<alignment\b([^>]*?)\/?>/.exec(inner),alAttrs=(al?al[1]:'').replace(/\s*(?:wrapText|vertical)="[^"]*"/g,''),rest=inner.replace(/<alignment\b[^>]*?\/>|<alignment\b[^>]*>[\s\S]*?<\/alignment>/,'');
    added.push('<xf'+open+' applyAlignment="1"><alignment'+alAttrs+' wrapText="1" vertical="top"/>'+rest+'</xf>');return wrapOf[s]=String(xfs.length+added.length-1);};
  const bySheet={};for(const c of cells)(bySheet[c.sheet]=bySheet[c.sheet]||[]).push(c);
  for(const [name,list] of Object.entries(bySheet)){
    const path=pathOf(name);let xml=path&&read(path);if(!xml||!/<sheetData\b/.test(xml))throw Error('sheet '+name);
    if(/<sheetData\b[^>]*\/>/.test(xml))xml=xml.replace(/<sheetData\b([^>]*)\/>/,'<sheetData$1></sheetData>');
    for(const c of list){
      const rowN=Number(c.addr.replace(/^[A-Z]+/,'')),rowRe=new RegExp('<row\\b[^>]*?\\sr="'+rowN+'"[^>]*?(?:/>|>[\\s\\S]*?</row>)'),m=rowRe.exec(xml);
      const cell=s=>'<c r="'+c.addr+'"'+(s!==null&&s!==undefined?' s="'+s+'"':'')+' t="inlineStr"><is><t xml:space="preserve">'+xmlEsc(c.text)+'</t></is></c>';
      if(!m){   // the row is not in the file yet: it goes in before the first later row
        const row='<row r="'+rowN+'">'+cell(wrapStyle('0'))+'</row>',later=[...xml.matchAll(/<row\b[^>]*?\sr="(\d+)"/g)].find(x=>Number(x[1])>rowN);
        xml=later?xml.slice(0,later.index)+row+xml.slice(later.index):xml.replace('</sheetData>',row+'</sheetData>');continue;}
      let row=m[0];if(/\/>$/.test(row)&&!/<\/row>$/.test(row))row=row.replace(/\/>$/,'></row>');
      row=row.replace(/^<row\b[^>]*>/,t=>t.replace(/\s(?:ht|customHeight)="[^"]*"/g,''));   // a fixed row height would cut the answer off
      const cm=new RegExp('<c\\b[^>]*?\\sr="'+c.addr+'"[^>]*?(?:/>|>[\\s\\S]*?</c>)').exec(row);
      if(cm)row=row.slice(0,cm.index)+cell(wrapStyle(attr(/^<c\b[^>]*>/.exec(cm[0])[0],'s')||'0'))+row.slice(cm.index+cm[0].length);
      else{const after=[...row.matchAll(/<c\b[^>]*?\sr="([A-Z]+)\d+"/g)].find(x=>colNum(x[1])>colNum(c.addr));
        row=after?row.slice(0,after.index)+cell(wrapStyle('0'))+row.slice(after.index):row.replace(/<\/row>$/,cell(wrapStyle('0'))+'</row>');}
      xml=xml.slice(0,m.index)+row+xml.slice(m.index+m[0].length);}
    // the answer column wide enough to read an answer in
    for(const n of [...new Set(list.map(c=>colNum(c.addr)))]){
      const col='<col min="'+n+'" max="'+n+'" width="'+ANSWER_WIDTH+'" customWidth="1"/>',cols=/<cols>([\s\S]*?)<\/cols>/.exec(xml);
      if(!cols){xml=xml.replace(/<sheetData\b/,'<cols>'+col+'</cols><sheetData');continue;}
      const tags=cols[1].match(/<col\b[^>]*\/>/g)||[],mine=tags.find(t=>Number(attr(t,'min'))<=n&&Number(attr(t,'max'))>=n);
      if(mine){if(Number(attr(mine,'min'))===n&&Number(attr(mine,'max'))===n&&Number(attr(mine,'width'))<ANSWER_WIDTH)xml=xml.replace(mine,mine.replace(/\swidth="[^"]*"/,' width="'+ANSWER_WIDTH+'"').replace(/\scustomWidth="[^"]*"/,'').replace(/\/>$/,' customWidth="1"/>'));continue;}
      const next=tags.find(t=>Number(attr(t,'min'))>n);xml=next?xml.replace(next,col+next):xml.replace('</cols>',col+'</cols>');}
    write(path,xml);}
  if(added.length)write('/xl/styles.xml',styles.replace(xfBlock[0],'<cellXfs count="'+(xfs.length+added.length)+'">'+xfBlock[1]+added.join('')+'</cellXfs>'));
  if(srcRows.length){   // the sources on a new last sheet
    let k=1;while(X.CFB.find(zip,'/xl/worksheets/sheet'+k+'.xml'))k++;
    let name=SRC_SHEET,i=2;const names=sheetTags.map(t=>unesc(attr(t,'name')));while(names.includes(name))name=SRC_SHEET+' '+(i++);
    const sid=Math.max(0,...sheetTags.map(t=>Number(attr(t,'sheetId'))||0))+1;let rid='rId'+(relTags.length+1);while(relTags.some(r=>attr(r,'Id')===rid))rid+='s';
    const c=(a,v)=>'<c r="'+a+'" t="inlineStr"><is><t xml:space="preserve">'+xmlEsc(v)+'</t></is></c>';
    const rows=[['Question','No.','Adobe source','Link'],...srcRows].map((r,ri)=>'<row r="'+(ri+1)+'">'+r.map((v,ci)=>c('ABCD'[ci]+(ri+1),v)).join('')+'</row>').join('');
    write('/xl/worksheets/sheet'+k+'.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols><col min="1" max="1" width="12" customWidth="1"/><col min="2" max="2" width="6" customWidth="1"/><col min="3" max="3" width="70" customWidth="1"/><col min="4" max="4" width="110" customWidth="1"/></cols><sheetData>'+rows+'</sheetData></worksheet>');
    wbx=wbx.replace('</sheets>','<sheet xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" name="'+xmlEsc(name)+'" sheetId="'+sid+'" r:id="'+rid+'"/></sheets>');write('/xl/workbook.xml',wbx);
    write('/xl/_rels/workbook.xml.rels',rels.replace('</Relationships>','<Relationship Id="'+rid+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'+k+'.xml"/></Relationships>'));
    write('/[Content_Types].xml',types.replace('</Types>','<Override PartName="/xl/worksheets/sheet'+k+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'));}
  if(X.CFB.find(zip,'/\u0001Sh33tJ5'))X.CFB.utils.cfb_del(zip,'/\u0001Sh33tJ5');   // the reader's own marker is not part of the client's file
  return X.CFB.write(zip,{fileType:'zip',type:'array',compression:true});
}
function writeBackKept(X,wb){
  const W=wb.w,cells=[],srcRows=[];
  for(const q of rfpState.questions){
    if(q.file!==W.name||q.row==null)continue;const S=W.sheets[q.sheet];if(!S||S.cols.response===undefined)continue;
    const text=usedText(q,true);if(!text)continue;
    cells.push({sheet:q.sheet,addr:X.utils.encode_cell({r:q.row,c:S.startCol+S.cols.response}),text});
    const d=q.kind==='adobe'?draftOf(q):null;if(hasDraft(d))for(const [i,s] of written(d,q).sources.entries())srcRows.push([q.label||'',d.kb?String(i+1):'',s.title,s.url]);}
  if(!cells.length)return null;
  const out=fillXlsx(X,W.bytes,cells,srcRows),back=X.read(new Uint8Array(out),{type:'array'}),flat=t=>String(t).replace(/\r\n?/g,'\n');
  for(const c of cells){const cell=back.Sheets[c.sheet]&&back.Sheets[c.sheet][c.addr];if(!cell||flat(cell.v)!==flat(c.text))throw Error('read-back '+c.addr);}
  for(const name of W.wb.SheetNames)if(!back.SheetNames.includes(name))throw Error('sheet lost '+name);
  return {out,n:cells.length,sources:srcRows.length};
}
async function writeBack(){
  const wb=writable();if(!wb)return;let X;try{X=await loadXLSX();}catch(e){toast(e.message);return;}
  if(isXlsx(wb.w)){let kept=null;try{kept=writeBackKept(X,wb);}catch(e){kept=false;}
    if(kept===null){toast('No answer is marked "Use this answer" yet, so nothing was written. Choose one first.');return;}
    if(kept){download(baseName(wb.w.name)+'-answered.xlsx',kept.out,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      toast(kept.n+' answer'+(kept.n===1?'':'s')+' written into '+wb.w.name+', with its formatting kept'+(kept.sources?' and the Adobe sources on a sheet at the end.':'.'));return;}}
  const W=wb.w;let n=0;W.orig=W.orig||{};   // the workbook's own cell values, kept from the first write, so a withdrawn approval clears what an earlier write-back put there
  for(const q of rfpState.questions){
    if(q.file!==W.name||q.row==null)continue;const S=W.sheets[q.sheet];if(!S||S.cols.response===undefined)continue;
    const sheet=W.wb.Sheets[q.sheet],addr=X.utils.encode_cell({r:q.row,c:S.startCol+S.cols.response}),key=q.sheet+'!'+addr;
    if(!(key in W.orig))W.orig[key]=sheet[addr]?Object.assign({},sheet[addr]):null;
    const text=usedText(q);
    if(text){sheet[addr]={t:'s',v:text};n++;}else if(W.orig[key])sheet[addr]=Object.assign({},W.orig[key]);else delete sheet[addr];
  }
  const csv=W.type==='csv',out=X.write(W.wb,{bookType:csv?'csv':'xlsx',type:csv?'string':'array'});
  download(baseName(W.name)+'-answered.'+(csv?'csv':'xlsx'),out,csv?'text/csv':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  toast(n?n+' answer'+(n===1?'':'s')+' written into '+W.name+'.':'No answer is marked "Use this answer" yet, so nothing was written. Choose one first.');
}

/* ---------- wiring */
function dlMenu(open){const m=$r('rfp-dl-menu'),b=$r('rfp-download-menu');if(!m||!b)return;m.hidden=!open;b.setAttribute('aria-expanded',String(open));if(open){const f=m.querySelector('button');if(f)f.focus();}}
document.addEventListener('click',e=>{if(e.target.closest('#rfp-download-menu')){dlMenu($r('rfp-dl-menu').hidden);return;}
  if(!e.target.closest('.rfp-dl-menu'))dlMenu(false);},true);   // the capture phase runs before the actions below; a chosen download closes the menu after it runs
document.addEventListener('click',e=>{if(e.target.closest('.rfp-dl-menu button'))setTimeout(()=>dlMenu(false));});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;const m=$r('rfp-dl-menu');if(m&&!m.hidden){dlMenu(false);$r('rfp-download-menu').focus();}});
document.addEventListener('click',e=>{
  const li=e.target.closest('#rfp-questions li');
  if(li){if(li.dataset.i!==undefined&&!e.target.closest('select,button'))select(Number(li.dataset.i));return;}
  const rm=e.target.closest('.rfp-chip [data-rm]'),q=current();
  if(rm&&q){redraft(q,(q.draft&&q.draft.m?q.draft.m.products:(q.pick||[])).filter(id=>id!==rm.dataset.rm));return;}
  const id=e.target.id;
  if(id==='rfp-use'&&q&&q.draft){if(q.status==='used')delete q.status;else q.status='used';R.renderList();renderAnswer();summary();return;}   // Approve toggles (step 55)
  if(id==='rfp-firm-use'&&q){const box=$r('rfp-firm'),t=box?box.value.trim():String(q.answer||'').trim();
    if(q.status==='used')delete q.status;else{if(!t){toast('Type the answer first.');return;}q.answer=t;q.status='used';}
    if(!t)delete q.answer;R.renderList();renderAnswer();summary();return;}
  if(id==='rfp-download-xlsx'){responseXlsx();return;}
  if(id==='rfp-download-proposal'){if(window.RFPProposal)window.RFPProposal.run();return;}   // step 75
  if(id==='rfp-writeback'){writeBack();return;}
  if(id==='rfp-skip'&&q){if(q.status==='skipped')delete q.status;else q.status='skipped';R.renderList();renderAnswer();summary();return;}   // Leave out toggles too
  if(id==='rfp-save-work'){if(rfpState.questions.length)download(baseName()+'-rfp-work.json',JSON.stringify(R.snapshot(),null,1),'application/json');return;}
  if(id==='rfp-open-work'){$r('rfp-work-file').click();return;}
  if(id==='rfp-left-adobe'||id==='rfp-left-firm'){const kind=id.slice(9);rfpState.filter='left'+kind;R.renderList();   // step 70: only the questions of that kind with no decision, the first one open
    const i=rfpState.questions.findIndex(o=>o.kind===kind&&!o.status);if(i>=0)select(i);$r('rfp-results').scrollIntoView({block:'start'});return;}
  if(id==='rfp-handoff-cancel'){$r('rfp-handoff-modal').hidden=true;return;}
  if(id==='rfp-handoff-go'){$r('rfp-handoff-modal').hidden=true;toSow();return;}

  if(id==='rfp-edit-btn'&&q){editing=true;renderAnswer();return;}
  if(id==='rfp-cancel-edit'){editing=false;renderAnswer();return;}
  if(id==='rfp-save-edit'&&q){const v=$r('rfp-edit').value;if(v.trim()){q.answer=v;q.status='used';}else{delete q.answer;q.status='skipped';}editing=false;R.renderList();renderAnswer();summary();return;}   // an emptied answer is left out, never the draft again
  if(id==='rfp-next'){next();return;}
  if(id==='rfp-to-sow'){previewSow();return;}
  if(id==='rfp-download-asks'){download(baseName()+'-checklist.html',asksDoc(),'text/html');return;}
  if(id==='rfp-download'){download(baseName()+'-response.html',responseDoc(),'text/html');return;}
});
document.addEventListener('change',e=>{if(e.target.id!=='rfp-add'||!e.target.value)return;const q=current();if(!q)return;
  redraft(q,[...(q.draft&&q.draft.m?q.draft.m.products:(q.pick||[])),e.target.value]);});
// a typed fact or a tick changes the response in place (the field keeps focus) and the item's badge
function refreshItem(q,i){const li=document.querySelector('#rfp-answer .rfp-asks .rfp-fact[data-i="'+i+'"]');const item=li&&li.closest('li');if(!item)return;const d=q.draft;
  for(const f of document.querySelectorAll('#rfp-answer .rfp-asks .rfp-fact')){const b=f.closest('li').querySelector('.rfp-badge');if(b)b.outerHTML=badgeHTML(q,d,Number(f.dataset.i));}   // a tick can move another ask in or out of a fitted answer
  const box=item.querySelector('.rfp-tick');if(box){box.disabled=!!factOf(q,d,i);box.checked=ticked(q,d,i)&&!factOf(q,d,i);}
  const b=$r('rfp-body');if(b&&!q.answer)b.innerHTML=fitHTML(q.draft,q)+answerHTML(q.draft,q);}
document.addEventListener('input',e=>{const t=e.target.closest('.rfp-fact');if(!t)return;const q=current();if(!q||!q.draft)return;
  (q.facts=q.facts||{})[askKey(q.draft,t.dataset.i)]=t.value;refreshItem(q,t.dataset.i);R.persist();});
document.addEventListener('change',e=>{const t=e.target.closest('.rfp-tick');if(!t)return;const q=current();if(!q||!q.draft)return;
  (q.ticks=q.ticks||{})[askKey(q.draft,t.dataset.i)]=t.checked;refreshItem(q,t.dataset.i);R.persist();});
// a service unticked on an answer stays out of the hand-off (step 56)
document.addEventListener('change',e=>{const t=e.target.closest('.rfp-line');if(t){const q=current();if(!q)return;(q.lines=q.lines||{})[t.dataset.id]=t.checked;summary();R.persist();}});
// the client's name is used as it is typed; an empty box means no name
document.addEventListener('input',e=>{if(e.target.id!=='rfp-client')return;rfpState.client=e.target.value.slice(0,80);R.persist();renderAnswer();});
// a firm answer is kept as it is typed (step 56); emptying an approved one takes its approval away
document.addEventListener('input',e=>{if(e.target.id!=='rfp-firm')return;const q=current();if(!q)return;const t=e.target.value;
  if(t.trim())q.answer=t;else{delete q.answer;if(q.status==='used'){delete q.status;R.renderList();summary();const b=$r('rfp-firm-use');if(b)b.textContent='Use this answer';const st=document.querySelector('#rfp-answer .rfp-state');if(st)st.remove();}}R.persist();});
{const el=$r('rfp-handoff-modal');if(el)el.addEventListener('click',e=>{if(e.target===e.currentTarget)el.hidden=true;});}
// Open my work: a Save my work file of the same RFP merges its decisions into the rows that have none here; another RFP replaces this one after a confirmation
const isWork=snap=>!!snap&&snap.v===1&&Array.isArray(snap.questions)&&snap.questions.length>0&&typeof snap.name==='string';
function openWork(snap){
  const bad=()=>toast('Choose a Save my work file from this RFI Builder.');
  if(!isWork(snap)){bad();return;}
  if(!rfpState.questions.length){if(R.restore(snap))toast('Opened '+(snap.name||'your work')+'.');else bad();return;}
  if(R.sameRfp(snap)){const m=R.merge(snap);const parts=[m.decisions?m.decisions+' decision'+(m.decisions===1?'':'s'):'',m.notes?m.notes+' set'+(m.notes===1?'':'s')+' of ticks or notes':'',m.added?m.added+' question'+(m.added===1?'':'s')+' the other side made from Not picked up':''].filter(Boolean);
    toast(parts.length?'Merged '+listOf(parts)+' from the file into this RFI; rows with a decision here were left as they were.':'The file holds nothing this RFI does not have already; rows with a decision here were left as they were.');return;}
  R.askReplace('The file holds a different RFI ('+(snap.name||'unnamed')+', '+snap.questions.length+' question'+(snap.questions.length===1?'':'s')+'). Replacing it clears the RFI on screen; Save my work first if you want to keep what is here.',()=>{if(R.restore(snap))toast('Opened '+(snap.name||'your work')+'.');else bad();});}
const workFile=$r('rfp-work-file');
if(workFile)workFile.addEventListener('change',async e=>{const f=e.target.files&&e.target.files[0];e.target.value='';if(!f)return;
  let snap=null;try{if(f.size>40000000)throw Error('size');snap=JSON.parse(await f.text());}catch(err){}
  openWork(snap);});
// the RFP travels inside Save draft and comes back with Open draft (the tool's draft keeps its own shape; the RFP rides along as rfp)
{const sd=$r('save-draft'),df=$r('draft-file');
  if(sd&&df){const origSave=sd.onclick,origOpen=df.onchange;
    sd.onclick=e=>{if(rfpState.questions.length||rfpState.skipped.length)state.rfp=R.snapshot();try{if(origSave)origSave.call(sd,e);}finally{delete state.rfp;}};
    df.onchange=async e=>{let snap=null;try{const f=e.target.files&&e.target.files[0];if(f&&f.size<=3000000){const d=JSON.parse(await f.text());if(d&&d.rfp&&d.rfp.v===1&&Array.isArray(d.rfp.questions))snap=d.rfp;
        else if(isWork(d)&&!d.play){e.target.value='';go('rfp');openWork(d);return;}}}catch(err){}   // step 70: a Save my work file opens in the RFI Builder (Adam chose one with Open draft and nothing opened)
      const was=$r('toast').textContent;if(origOpen)await origOpen.call(df,e);
      const refused=/^Choose a JSON draft/.test($r('toast').textContent)&&$r('toast').textContent!==was;   // the tool's own message when the file is not its draft
      if(!snap||refused)return;
      const bring=()=>{if(R.restore(snap))toast('Draft opened, with its RFI and answers on the RFI Builder tab.');};
      if(R.hasWork())R.askReplace('The draft holds an RFI ('+(snap.name||'unnamed')+'). The RFI on screen has decisions on it; opening the draft\'s copy replaces them. Save my work first if you want to keep them.',bring);else bring();};}}
// a warning before the tab closes with work in it; a trip to Build or the tool's own Start over is not a close (step 56)
let navAway=false;document.addEventListener('click',e=>{if(e.target.closest('[data-build],#start-over-confirm,#rfi-back'))navAway=true;},true);
window.addEventListener('beforeunload',e=>{if(navAway||!R.hasWork())return;e.preventDefault();e.returnValue='';});
R.onMore=()=>{if(current())renderAnswer();};
R.onRender=()=>{summary();if(current()&&current().kind==='adobe'&&!current().draft)current().draft=compose(current());};
R.onLoad=()=>{rfpState.selected=null;rfpState.owned=null;editing=false;if(rfpState.questions.some(q=>q.kind==='adobe'))first();else{renderAnswer();summary();}};
R.onPileChange=i=>{if(rfpState.selected===i){editing=false;renderAnswer();}summary();};   // the open row's pile changed: the panel follows (finding 7.2)
R.onRestore=()=>{rfpState.owned=null;editing=false;if(Number.isInteger(rfpState.selected))select(rfpState.selected);else{renderAnswer();summary();}};
/* ---------- step 88 (Nov 12 2026, Adam: "give them some freaking intelligence", "go"): answers written by AI.
   The build button (Build with Adobe RFI Agent since step 89) sends each Adobe question to the writer (/rfi/answer on the reader's worker: Opus 5.5, or Sonnet 5 where
   Opus 5.5 is not enabled) with the client's own description, the services that may apply and the checked facts about their
   products; the answer it writes takes the place of the stitched catalog answer. What comes back is checked here: only the
   services and Adobe pages it was given, no dash, no word Adam ruled out, no catalog id, under the RFI's word limit. A fact
   question keeps its knowledge-base answer, and a question the writer could not answer keeps the catalog's. */
const AI_BANNED=/\b(?:beta|early access|early adopter|limited availability|limited release|coming soon|confirm(?:ed)? (?:\w+ ){0,4}with Adobe|not stated by Adobe|Adobe Consulting Services|seamless(?:ly)?|robust|cutting-edge|world-class|best-in-class)\b|\$\s?\d|\bper hour\b|\bhourly rate\b|\b(?:obtain|get|secure|seek)\b[^.?!]{0,80}\bfrom Adobe\b|\bAdobe['\u2019]s written\b|\bin writing from Adobe\b|\bfrom Adobe in writing\b|\b(?:check|verify|validate|confirm)(?:ed|s|ing)?\b[^.?!]{0,60}\b(?:with|by) Adobe\b(?!\s+[A-Z])|\b(?:pending|subject to|awaiting)\b[^.?!]{0,30}\bAdobe['\u2019]?s? (?:confirmation|approval|sign-?off)\b/i;   // step 89: and any sentence that defers a point to Adobe
function aiInput(q){
  if(!q||q.kind!=='adobe'||q.answer||q.status==='used'||q.status==='skipped')return null;   // step 89: an answer the partner approved or left out stays theirs
  const text=q.text,context=askedUnder(q);
  if((F.factShaped(text)&&!NEEDS.test(text))||(q.requirement&&FACT_TOPIC.test(text)))return null;   // a fact question keeps its sourced knowledge-base answer
  let m=match(text,{context,ctx:isOngoing(text)?proposalProducts(q):contextProducts(),pick:q.pick});
  if(!m.lines.length){   // step 89 (Adam: yes to 4): a question that names no product is written from the products the RFI is about, and the writer picks what applies; a question about the firm is not
    if(q.pick||F.classify(text,'',q.requirement)==='firm')return null;
    {const kb=kbDraft(q,text,context,{});if(kb&&kb.kb)return null;}   // a question the knowledge base answers (certifications, encryption, uptime) keeps its sourced answer
    const main=rfpMain().filter(id=>P[id]&&!m.excluded.includes(P[id].name));if(!main.length)return null;
    m=Object.assign({},m,{products:[...new Set([...m.products,...main])]});}
  const sources=[],at={},src=(title,url)=>{if(!url)return null;if(!(url in at)){at[url]=sources.length+1;sources.push({n:at[url],title:clientScrub(title||url),url});}return at[url];};
  const owners=[...(m.conn?[m.conn]:[]),...m.products.filter(id=>P[id]&&!P[id].outside).map(id=>P[id])],ids=[...new Set([...m.lines,...owners.flatMap(o=>[...(o.lines||[]),...(o.more||[])])])].filter(id=>LN[id]).slice(0,24);
  const services=ids.map(id=>{const L=LN[id],T=TPL[id]||{};return {id,name:L.name,does:clientScrub(L.scope||T.scope||''),deliverable:clientScrub(T.deliverable||''),hours:Number(L.base)||0,billing:L.unit==='monthly'?'monthly':'one-time',
    client_must_license:clientScrub([L.tier,L.ext].filter(Boolean).join('; ')),page:src(L.src,L.url),matched:m.lines.includes(id)};});
  const prods=m.products.filter(id=>P[id]),facts=[];
  if(KB){const S=KB.sources||[];for(const e of [...(KB.explain||[]),...(KB.statements||[])]){const who=[].concat(e.for||[]);if(!e.text||!(who.includes('*')||who.some(id=>prods.includes(id))))continue;
    facts.push({about:who.filter(id=>P[id]).map(id=>P[id].name),text:clientScrub(e.text),pages:(e.src||[]).map(i=>S[i]&&src(S[i].title,S[i].url)).filter(Boolean)});if(facts.length>=40)break;}}
  const connection=m.conn?{between:[P[m.conn.a].name,P[m.conn.b].name],how:clientScrub(rfp(m.conn.sowHow||m.conn.how||'')),needs:(m.conn.sowPrereqs||m.conn.prereqs||[]).map(x=>clientScrub(rfp(x)))}:null;
  const lim=limitOf(q),words=lim?Math.max(80,Math.floor(lim.max*0.9)):350;   // the answer comes first; what we need from the client is fitted into what is left
  const rfi=(rfpState.paragraphs&&rfpState.paragraphs.length?rfpState.paragraphs:rfpState.questions.map(x=>x.text)).filter(x=>typeof x==='string').join('\n').slice(0,9000);
  return {client:clientOrg(),rfi_products:rfiProducts().map(id=>P[id].name),rfi,ref:q.label||'',question:text,words,services,connection,facts,sources};}
const aiText=(t,names)=>{let s=String(t==null?'':t).replace(/\s*[–—]\s*/g,', ').replace(/^\s*(?:\d{1,2}[.)]|[-•*])\s+/,'').replace(/\s+/g,' ').trim();
  s=s.replace(/\b([A-Z]{1,5}\d{1,3})\b/g,(m,id)=>names[id]||m);                                    // a catalog id means nothing to the client
  if(AI_BANNED.test(s))s=s.split(/(?<=[.!?])\s+/).filter(x=>!AI_BANNED.test(x)).join(' ');            // a sentence with a word Adam ruled out is left out
  return s.replace(/\s+([.,;:])/g,'$1').trim();};
function takeAI(q,body,data,model){
  if(!q||!body||!data||!Array.isArray(data.sections))return false;
  const given=new Set(body.services.map(x=>x.id)),names=Object.fromEntries(body.services.map(x=>[x.id,x.name]));
  const sections=data.sections.filter(x=>x&&typeof x.heading==='string'&&Array.isArray(x.items)).map(x=>[aiText(x.heading,names).slice(0,60),x.items.map(t=>aiText(t,names)).filter(t=>t.length>2)]).filter(x=>x[0]&&x[1].length);
  if(!sections.length)return false;
  const services=(Array.isArray(data.services)?data.services:[]).filter(id=>given.has(id)),pages=new Set((Array.isArray(data.sources)?data.sources:[]).map(Number));
  const used=services.length?services:body.services.filter(x=>x.matched).map(x=>x.id);
  licenseLines(sections,used);
  q.ai={text:q.text,sections,services:used,sources:body.sources.filter(x=>pages.has(x.n)).map(x=>({title:x.title,url:x.url})),model:String(model||'')};
  delete q.draft;return true;}
/* step 90 (Nov 13 2026, Adam: yes to "name the license when an answer brings in a product the client didn't pick"): an insurer's
   answers routed the agent handoff through Marketo Qualifier and suggested AEM Forms, both products it had not chosen, as if they
   were included. A product the answer names by its full name, or whose service the answer rests on, that the RFI does not name
   gets one plain line in Timeline and effort, unless the writer already said so. A license is a prerequisite, not a caveat (rule
   12). Only full product names count: "Adobe Experience Platform", under every Customer Journey Analytics answer, is not Real-Time
   CDP; a product the answer rules out ("Adobe Target is not licensed in this phase") gets no line. */
const LICENSE_LINE=/\blicensed separately\b/;
const COMPARED=/\b(?:from|than|unlike|like|versus|vs\.?|compared (?:with|to)|instead of|rather than|replac\w*|migrat\w*|moving|move|switch\w*|familiar with|used to|know|knows|knew)\s+(?:[\w'-]+\s+){0,2}$/i;   // 'what differs from Adobe Analytics' names a product the answer does not use
const brandName=id=>{const n=P[id].name;return /^(?:Adobe|AEM)\b/.test(n)?n:'Adobe '+n;};
let chosenOf=null,chosenParas=null,chosenIs=[];
function rfiProducts(){const qs=rfpState.questions,ps=rfpState.paragraphs||[];if(chosenOf===qs&&chosenParas===ps)return chosenIs.slice();chosenOf=qs;chosenParas=ps;
  const n={};for(const t of [rfpState.name,...ps.filter(p=>typeof p==='string'),...qs.map(q=>q.text)]){const raw=String(t||'');for(const h of scan(raw))if(h.type==='name'&&!h.neg&&P[h.pid]&&!P[h.pid].outside&&!(h.pid==='rtcdp'&&/\bdigital\s+$/i.test(raw.slice(0,h.a-1))))n[h.pid]=(n[h.pid]||0)+1;}   // 'a digital experience platform' is not Real-Time CDP
  chosenIs=Object.keys(n).sort((a,b)=>n[b]-n[a]);return chosenIs.slice();}
const ownersOf=id=>[...Object.keys(P).filter(p=>!P[p].outside&&[...(P[p].lines||[]),...(P[p].more||[])].includes(id)),...C.filter(c=>[...(c.lines||[]),...(c.more||[])].includes(id)).flatMap(c=>[c.a,c.b])];
/* Round 4: a prohibition is different from not owning a license yet. Keep the original product detector and AI input unchanged;
   the no-AI plan uses explicit client prohibitions, including category names and lists, before choosing any service. A Finder
   recovery pass can supply its new document explicitly, before RFPBuilder has replaced the previous document's state. */
const KB_CATEGORIES=[
  {re:/\bcustomer[ -]data platform\b|\bCDP\b/gi,ids:['rtcdp']},
  {re:/\b(?:digital[ -])?asset[ -]management(?:\s+(?:product|platform|system|license))?\b|\bDAM\b/gi,ids:['aemassets']},
  {re:/\bcommerce platform\b/gi,ids:['commerce']},
  {re:/\bwork[ -]management(?:\s+(?:suite|platform|system))?\b/gi,ids:['workfront']},
  {re:/\bmarketing automation(?:\s+(?:suite|platform|system))?\b/gi,ids:['marketo','ajo','ajob2b']}
];
const KB_REFUSAL=/\b(?:will not|shall not|must not|do not|does not|cannot|can't|won't|don't|never)\s+(?:licen[cs]e|buy|purchase|adopt|use|implement|include|require|propose)\b/gi;
const KB_WITHOUT=/\bwithout(?:\s+(?:assuming|requiring|adding|licensing|buying|purchasing|using|adopting|implementing))?(?:\s+(?:a|an|the|any|new|additional|separate|adobe))*\s*$/i;
const KB_NO_LICENSE=/\bno(?:\s+(?:new|additional|separate|a|an|the|any|adobe))*\s*$/i;
function kbConstraintText(){return [rfpState.name,...(rfpState.paragraphs||[]).filter(p=>typeof p==='string'),...rfpState.questions.map(q=>q.text)].join('\n');}
function kbConstraintHits(text,scope){const raw=String(text||''),hits=scan(raw,scope).filter(h=>h.type==='name'&&P[h.pid]&&!P[h.pid].outside).map(h=>({a:h.a-1,b:h.b-1,pid:h.pid}));
  for(const c of KB_CATEGORIES){c.re.lastIndex=0;let m;while((m=c.re.exec(raw)))for(const pid of c.ids)if(P[pid])hits.push({a:m.index,b:m.index+m[0].length,pid});}
  return hits;}
// A refusal must govern the product itself. Names embedded in a requirement about people, access or credentials are not licenses.
const KB_PEOPLE=/^\s+(?:authors?|users?|administrators?|admins?|suppliers?|partners?|staff|teams?|specialists?|certifications?|certificates?|credentials?|skills?|access|permissions?)\b/i;
const KB_SCOPE_OUT=/\b(?:is|are|will be)\s+(?:excluded|out of scope|not (?:permitted|allowed|part of (?:this|the) (?:project|phase|scope)|licensed (?:in|for|through) (?:this|the) (?:project|phase|programme|program)))\b/gi;
function kbListGap(line,a,b,hits){const gap=line.slice(a,b).split('');
  for(const h of hits)if(h.a>=a&&h.b<=b)for(let i=h.a;i<h.b;i++)gap[i-a]=' ';
  return /^(?:[\s,()/&-]|\b(?:a|an|the|any|new|additional|separate|adobe|and|or|nor|either|neither|licenses?|products?|platforms?|suites?|systems?|packages?|entitlements?|such|as)\b)*$/i.test(gap.join(''));}
function kbProhibited(text,local,scope){const raw=String(text||''),out=new Set();
  for(const line of raw.split(/(?<=[.!?;])\s+|[\r\n]+/)){const hits=kbConstraintHits(line,scope);if(!hits.length)continue;
    const spans=[],predicates=[];KB_REFUSAL.lastIndex=0;let m;while((m=KB_REFUSAL.exec(line))){
      // A requirement's "without X" stays local; an identified client can state the document-wide scope in either person.
      const before=line.slice(Math.max(0,m.index-70),m.index);if(!local&&!/\b(?:we|(?:our|the) (?:client|organization|organisation|company|university|institution|business|school|authority|council|agency|programme|program)|this (?:project|programme|program|phase))\s*$/i.test(before))continue;
      const tail=line.slice(m.index+m[0].length),stop=/\b(?:but|however|instead)\b|\b(?:we|they)\s+(?:will|shall|do|may|can)\b|\band\s+(?:(?:will|shall|may|can)\s+)?(?:licen[cs]e|buy|purchase|adopt|use|implement|include|require|propose)\b/i.exec(tail);
      spans.push([m.index+m[0].length,m.index+m[0].length+(stop?stop.index:tail.length)]);}
    KB_SCOPE_OUT.lastIndex=0;while((m=KB_SCOPE_OUT.exec(line)))predicates.push(m.index);
    for(const h of hits){const before=line.slice(Math.max(0,h.a-90),h.a),after=line.slice(h.b,h.b+70),without=KB_WITHOUT.exec(before);
      if(KB_PEOPLE.test(after))continue;
      const currentNonuse=/\b(?:do not|does not|don't|doesn't)\s+(?:currently\s+|yet\s+)?use\s+(?:(?:a|an|the|any|adobe)\s+)*$/i.test(before)&&(/\b(?:currently|yet)\b/i.test(before)||/^\s+(?:yet|currently|at present|today)\b/i.test(after));
      if(currentNonuse)continue;
      const license=/\blicen[cs](?:e|ing)|\bentitlement\b/i.test(line.slice(h.a,h.b+70));
      const withoutProduct=without&&(!/\b(?:assuming|requiring|adding)\b/i.test(without[0])||license);
      const scopedOut=predicates.some(at=>at>=h.b&&kbListGap(line,h.b,at,hits));
      if(spans.some(([a,b])=>h.a>=a&&h.a<b&&kbListGap(line,a,h.a,hits))||scopedOut||(local&&(negated(line,h.a)||withoutProduct||(KB_NO_LICENSE.test(before)&&license))))out.add(h.pid);}}
  return out;}
let kbGlobalText=null,kbGlobalExcluded=[];
function kbExclusions(q,scope){const all=scope===undefined?kbConstraintText():String(scope||'');
  if(kbGlobalText!==all){kbGlobalText=all;kbGlobalExcluded=[...kbProhibited(all,false,all)];}
  return new Set([...kbGlobalExcluded,...kbProhibited(q&&q.text||'',true,all)]);}
function kbExtProducts(text){return [...new Set(scan(text||'').filter(h=>h.type==='name'&&P[h.pid]&&!P[h.pid].outside).map(h=>h.pid))];}
function kbPermitted(id,q,scope){const line=LN[id];if(!line)return false;const excluded=kbExclusions(q,scope),blocked=p=>excluded.has(p);
  if(ownersOf(id).some(blocked)||(line.needs||[]).some(blocked))return false;
  if((line.needs_any||[]).length&&line.needs_any.every(blocked))return false;
  const ext=kbExtProducts(line.ext||'');if(ext.length&&(/\bor\b/i.test(line.ext)?ext.every(blocked):ext.some(blocked)))return false;
  return true;}
function kbAllowedMatch(q,m,scope){const excluded=kbExclusions(q,scope);if(!excluded.size)return m;
  const products=m.products.filter(id=>!excluded.has(id)),conns=(m.conns||[]).filter(c=>![c.a,c.b].some(id=>excluded.has(id)));
  return Object.assign({},m,{products,conn:m.conn&&![m.conn.a,m.conn.b].some(id=>excluded.has(id))?m.conn:conns[0]||null,conns,
    lines:m.lines.filter(id=>kbPermitted(id,q,scope)),excluded:[...new Set([...(m.excluded||[]),...[...excluded].map(id=>P[id].name)])]});}
const KB_PRODUCT_OPTION_NAMES=Object.fromEntries(Object.entries(P).filter(([,p])=>!p.outside).flatMap(([id,p])=>[[p.name,id],[brandName(id),id]]));
const KB_PRODUCT_OPTION_RE=new RegExp('(?:either\\s+)?((?:'+Object.keys(KB_PRODUCT_OPTION_NAMES).sort((a,b)=>b.length-a.length).map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(?:\\s*,\\s*(?:'+Object.keys(KB_PRODUCT_OPTION_NAMES).sort((a,b)=>b.length-a.length).map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+'))*\\s+(?:or)\\s+(?:'+Object.keys(KB_PRODUCT_OPTION_NAMES).sort((a,b)=>b.length-a.length).map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+'))','g');
function kbChoices(text,q){const excluded=kbExclusions(q);if(!excluded.size)return String(text||'');
  return String(text||'').replace(KB_PRODUCT_OPTION_RE,(whole,items)=>{const parts=items.split(/\s*,\s*|\s+or\s+/),kept=parts.filter(x=>!excluded.has(KB_PRODUCT_OPTION_NAMES[x]));
    return kept.length&&kept.length<parts.length?(kept.length===1?kept[0]:kept.slice(0,-1).join(', ')+' or '+kept[kept.length-1]):whole;});}
const kbFit=(text,q)=>kbChoices(fitOptions(text),q),kbFitAll=(items,q)=>items.map(t=>kbFit(t,q));

function licenseLines(sections,used){
  const chosen=new Set(rfiProducts()),text=sections.map(([h,items])=>h+'. '+items.join(' ')).join(' ');
  const nameAt=id=>{const n=P[id].name,re=new RegExp('(?<![\\w-])'+(id==='target'?'Adobe ':'')+n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![\\w-])','g');let m;
    while((m=re.exec(text))){const after=text.slice(m.index+m[0].length,m.index+m[0].length+40);if(!negated(text,m.index)&&!/^\s*(?:is|are|will be|was|would be)\s+not\b|^\s*(?:isn't|aren't)\b/i.test(after)&&!COMPARED.test(text.slice(Math.max(0,m.index-40),m.index)))return true;}return false;};
  const extra=[...new Set([...used.flatMap(ownersOf),...Object.keys(P).filter(id=>!P[id].outside&&!chosen.has(id)&&nameAt(id))])].filter(id=>P[id]&&!P[id].outside&&!chosen.has(id));
  const home=sections.find(x=>/^timeline/i.test(x[0]))||sections.filter(x=>!/^risk/i.test(x[0])).slice(-1)[0]||sections[sections.length-1];
  for(const id of extra){const n=P[id].name,said=new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'[^.]{0,120}\\blicensed separately\\b|\\blicensed separately\\b[^.]{0,60}'+n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i');
    if(!said.test(text))home[1].push('This uses '+brandName(id)+', which is licensed separately.');}}
/* The method knowledge base (Nov 13 2026, Adam: build out the knowledge base, "then start testing the output versus our knowledge
   base"; the key metric is how close answers written with no AI come to the AI's). RFP_METHOD, built by
   sow/rfp_prototype/kb_method/build_method.py, gives every service its steps, deliverables, asks, risk, outcome, kind and phase. The
   answer has the AI's five parts: our approach (the Adobe fact that answers the question, then what the main service leaves the
   client with), how we would do it (the main service's steps, then one step from each supporting service), what you get, timeline
   and effort (the phase, the RFI's own timeline, the hours: a whole workstream's hours only in the question that is its home, and
   the license each service needs), and the risk we manage. Not yet what a partner sees: method(q,d) is called by the checks. */
const METHOD=typeof RFP_METHOD!=='undefined'&&RFP_METHOD&&RFP_METHOD.services?RFP_METHOD.services:null;
const NUM_WORD=/^(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|eighteen|twenty-four|\d{1,2})$/i;
let tlOf=null,tlIs='';
function rfiTimeline(){if(tlOf===rfpState.questions)return tlIs;tlOf=rfpState.questions;const t=rfpText();
  const m=/\bwithin (\w+(?:-\w+)?)\s+months?\b/i.exec(t)||/\b(\w+(?:-\w+)?)[- ]month (?:plan|timeline|window|program|programme|launch|project|engagement)\b/i.exec(t);
  tlIs=m&&NUM_WORD.test(m[1])?m[1].toLowerCase()+'-month':'';return tlIs;}
// round 3 (the judges: "No answer tied its work to the RFP's dates; timelines were relative"): the go-live date the RFI gives
// ("release the first market on 2 August 2027", "launch by March 1, 2027"), so the phase sentence places the work against it
const MONTHS='January|February|March|April|May|June|July|August|September|October|November|December';
const LAUNCH_ON=new RegExp('\\b(?:release|launch|go live|go-live|goes live|went live)\\b[^.;]{0,50}?\\b(?:on|by)\\s+((?:\\d{1,2}\\s+(?:'+MONTHS+')|(?:'+MONTHS+')\\s+\\d{1,2},?)\\s+\\d{4})','i');
let launchOf=null,launchIs='';
function rfiLaunch(){if(launchOf===rfpState.questions)return launchIs;launchOf=rfpState.questions;const m=LAUNCH_ON.exec(rfpText());launchIs=m?m[1].replace(/,$/,''):'';return launchIs;}
function phaseLine(phase){const day=rfiLaunch(),tl=rfiTimeline();
  if(day)return {'discovery':'This comes first, in discovery, before the build starts, so your launch on '+day+' is planned from the start.','build':'This runs during the build, once discovery has agreed the scope, ahead of your launch on '+day+'.','launch':'This runs as the build closes, through testing and cutover to your launch on '+day+'.','after launch':'This runs every month from the month after your launch on '+day+'.'}[phase];
  return PHASE_SAYS[phase]+(tl&&phase!=='after launch'?' It fits within your '+tl+' plan.':'');}
// the question that is a workstream's home: the first Adobe question whose answer leads with it, else the first that uses it (round
// 2: the lead is the knowledge base's own, after the phrases; a topic answer leads with no service)
let streamOf=null,streamIs={};
function homeOfLine(id){const qs=rfpState.questions;if(streamOf!==qs){streamOf=qs;streamIs={};}
  if(!(id in streamIs)){const adobe=qs.filter(x=>x.kind==='adobe');
    const plan=x=>kbPlan(x,draftOf(x));streamIs[id]=adobe.find(x=>leadOf(x)===id)||adobe.find(x=>{const p=plan(x);return !!p&&p.ids.includes(id);})||null;}
  return streamIs[id];}
const PHASE_SAYS={'discovery':'This comes first, in discovery, before the build starts.','build':'This runs during the build, once discovery has agreed the scope.','launch':'This runs as the build closes, through testing, cutover and launch.','after launch':'This runs every month from the month after launch.'};
// a service written for moving content off an older AEM (the Content Transfer Tool) is no answer when the RFI's site runs on
// something else ("a content management system we built ourselves", Drupal): the catalog has no service for that move yet
const PRODUCT_WORDS=new Set(Object.values(P).flatMap(p=>tokens(p.name)));
const FROM_AEM_ONLY=/^Where your client is moving from AEM on-premise or Adobe Managed Services/i;
const OTHER_CMS=/\b(?:built (?:it )?ourselves|home-?grown|in-house (?:cms|content management)|custom(?:-built)? (?:cms|content management)|drupal|wordpress|sitecore|contentful|joomla|squarespace|wix|kentico|optimizely|episerver|acquia|hubspot cms|webflow)\b/i;
const FROM_AEM=/\bAEM (?:on-premise|6\.\d|managed services)\b|\bAdobe Managed Services\b|\bExperience Manager 6\.\d\b/i;
// step 91: a service written for moving off another CMS (SI10) answers only an RFI that names that CMS (Drupal, one built in house);
// where the RFI does not say what it moves from, the answer's own sentence covers both routes ("From an existing AEM instance ...
// From another CMS, we would export the content ..."); the live answers and the knowledge base keep the same rule
const FROM_OTHER_CMS_ONLY=/^Where your client is moving from a CMS other than AEM\b/i;
const keepsLine=(id,scope=rfpText())=>(!FROM_AEM_ONLY.test(LN[id].scope||'')||FROM_AEM.test(scope)||!OTHER_CMS.test(scope))&&(!FROM_OTHER_CMS_ONLY.test(LN[id].scope||'')||OTHER_CMS.test(scope));
/* "You told us": the sentence of the question that says something about the client ("Akamai is our enterprise CDN and must remain
   in front of the site"), else the RFI's own sentence that shares the question's distinctive words ("Our store and loyalty data is in
   a Snowflake data warehouse"), turned to the partner's voice. The client's own words, so nothing in it can be wrong. */
const ASKS_RE=/^(?:please\s+)?(?:describe|explain|outline|provide|state|list|detail|tell|show|confirm|identify|indicate|summari[sz]e|propose|specify|address|include|cover|distinguish|demonstrate|give|supply|submit|estimate|assess|discuss|set out|walk us|how|what|which|where|when|why|who|can|could|will|would|do|does|is|are|has|have)\b/i;   // round 3: 'Propose an approach ...' is the question's own ask, not a fact
const CLIENT_VOICE=/\b(?:our|we|us)\b/i;
const sentencesOf=t=>String(t||'').replace(/\s+/g,' ').split(/(?<=[.!?])\s+(?=[A-Z])/).map(x=>x.trim()).filter(Boolean);
const yourVoice=t=>t.replace(/\bour\b/g,'your').replace(/\bOur\b/g,'Your').replace(/\bwe\b/g,'you').replace(/\bWe\b/g,'You').replace(/\bus\b/g,'you').replace(/\bours\b/g,'yours').replace(/\byou is\b/g,'you are').replace(/\byou has\b/g,'you have').replace(/\byou was\b/g,'you were');
const toldOf=new WeakMap();
// round 3 (the judges: an echo the answer then ignores reads worse than silence): a fact sentence stops before the RFI's own
// instructions ("Your acceptance target is WCAG 2.2 AA; distinguish automated checks ..."), and a sentence from the RFI's background
// opens one answer only, the question whose own words it shares most (Tallgrass's Snowflake and Power BI sentence opened three)
const ORDERS_TAIL=/;\s+(?:distinguish|identify|describe|explain|include|show|state|provide|list|specify|propose|address|cover|set out|demonstrate|confirm|indicate|give)\b[\s\S]*$/i;
const factOfSentence=(t,most)=>{const bare=bareLabel(t).replace(ORDERS_TAIL,'.');return CLIENT_VOICE.test(bare)&&!/\byour?\b/i.test(bare)&&!ASKS_RE.test(bare)&&!/\?$/.test(bare)&&wordsIn(bare)>=6&&wordsIn(bare)<=most?bare:'';};
const ownWords=t=>tokens(t).filter(w=>!GENERIC.has(w)&&!PRODUCT_WORDS.has(w));
let bgOf=null,bgIs=null;
function backgroundOwners(){const qs=rfpState.questions;if(bgOf===qs)return bgIs;bgOf=qs;bgIs=new Map();
  const asked=qs.map(x=>flatText(x.text)).filter(Boolean),every=qs.map(x=>({x,w:ownWords(x.text)}));   // the RFI's own question lines are not facts about the client; a sentence belongs to the question it fits best, whichever pile that question is in
  for(const p of rfpState.paragraphs||[])for(const t of sentencesOf(typeof p==='string'?p:'')){const f=factOfSentence(t,32);if(!f||asked.some(x=>flatText(f).includes(x.slice(0,60)))||bgIs.has(f))continue;
    let best=0,owner=null;const tw=ownWords(f);for(const a of every){const o=overlap(a.w,tw);if(o>best){best=o;owner=a.x;}}
    if(best>=2)bgIs.set(f,{owner,o:best});}
  return bgIs;}
function toldUs(q){if(toldOf.has(q)&&toldOf.get(q).text===q.text)return toldOf.get(q).said;
  let s='';for(const t of sentencesOf(q.text)){const f=factOfSentence(t,40);if(f){s=f;break;}}
  if(!s){let best=0;for(const [f,o] of backgroundOwners())if(o.owner===q&&o.o>best){best=o.o;s=f;}}
  const said=s?'You told us: '+yourVoice(s).replace(/[.!]?$/,'.'):'';   // a colon keeps the client's own capitals (Akamai)
  toldOf.set(q,{text:q.text,said});return said;}
/* Round 2 (Nov 13): the phrases an RFI uses for each service's work (RFP_METHOD services[id].phrases, 6 to 10 each) re-rank the
   services of the products the question is about. A brand name, an AI assistant's name or a word every service uses proves
   nothing; a rare word counts more than a common one, a one-word phrase counts half, and the matcher's own order still counts, so a
   phrase must clearly win ("Core Web Vitals and Lighthouse scores" leads with the site build, not the Universal Editor setup).
   Round 3: an Adobe product's whole name (or alias) is taken out, not every word that appears in one, since "measure" (Marketo
   Measure), "journey" or "sign" on their own are the client's words for the work, while "Edge Delivery Services" is a name. */
const PHRASE_SKIP=new Set(tokens([...GENERIC,'aem','cja','website','build','set','chatgpt','gemini','perplexity','copilot','claude','adobe'].join(' ')));
const PRODUCT_NAME_RE=new RegExp('(?<![\\w-])(?:'+[...new Set(Object.values(P).filter(p=>!p.outside).flatMap(p=>[p.name,...(NAMES[p.id]||[])]))].filter(Boolean).sort((a,b)=>b.length-a.length).map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(?![\\w-])','gi');
const phraseWords=t=>tokens(String(t||'').replace(PRODUCT_NAME_RE,' ')).filter(w=>!PHRASE_SKIP.has(w));
let PHRASE=null;
function phraseIndex(){if(PHRASE)return PHRASE;const by={},df={};
  for(const [id,e] of Object.entries(METHOD||{})){const ps=(e.phrases||[]).map(phraseWords).filter(t=>t.length),bag=new Set(ps.flat());by[id]={ps,bag};for(const w of bag)df[w]=(df[w]||0)+1;}
  const n=Object.keys(by).length||1;PHRASE={by,idf:w=>Math.log(n/(df[w]||n))};return PHRASE;}
function phraseScore(id,qw){const x=phraseIndex(),e=x.by[id];if(!e)return 0;let best=0,all=0;
  for(const t of e.ps){const hit=t.filter(w=>qw.has(w)),v=hit.reduce((a,w)=>a+x.idf(w),0)*hit.length/Math.max(t.length,2);if(v>best)best=v;}
  for(const w of e.bag)if(qw.has(w))all+=x.idf(w);return best+all/3;}
// Round 4: both sorting and missing-draft recovery use the same strong evidence. A phrase must
// share at least two distinctive words, not merely accumulate common words across a long question.
function scopeEvidence(q,scope){if(!METHOD||!q||!scope||F.FIRM_ALWAYS.test(q.text)||F.factShaped(q.text))return null;
  const found=detectAll(scope,scope),products=found.named.filter(id=>P[id]&&!P[id].outside&&!(id==='rtcdp'&&!/\b(?:real[- ]?time cdp|rt-?cdp|aep|adobe experience platform)\b/i.test(scope)));
  if(!products.length)return null;
  const local=detectAll(q.text,scope),excluded=kbExclusions(q,scope),allowed=products.filter(id=>!excluded.has(id)&&!local.excluded.includes(P[id].name));
  const outside=local.named.filter(id=>P[id]&&P[id].outside),owners=[...allowed.map(id=>P[id]),...C.filter(c=>[c.a,c.b].every(id=>allowed.includes(id)||outside.includes(id)))];
  const pool=[...new Set(owners.flatMap(o=>[...(o.lines||[]),...(o.more||[])]))],qw=new Set(phraseWords(q.text)),index=phraseIndex();
  const ranked=pool.filter(id=>METHOD[id]&&LN[id]&&keepsLine(id,scope)&&kbPermitted(id,q,scope)&&(LN[id].unit==='monthly')===isOngoing(q.text)).map(id=>{
    const phrases=index.by[id].ps,shared=phrases.some(p=>{const hit=p.filter(w=>qw.has(w)&&!WEAK.has(w));return hit.length>=2&&hit.length/p.length>=0.5;});
    return {id,score:shared?phraseScore(id,qw):0};
  }).filter(x=>x.score>=8).sort((a,b)=>b.score-a.score);
  let id=ranked.length?ranked[0].id:null;
  if(!id){const topic=PLAYBOOK.find((t,i)=>t.products.some(p=>allowed.includes(p))&&!(t.unless_products||[]).some(p=>allowed.includes(p))&&TRIGGERS[i].some(re=>re.test(q.text)));
    if(topic)id=Object.entries(topic.draws_on).filter(([p])=>allowed.includes(p)).flatMap(([,ids])=>ids).find(x=>METHOD[x]&&LN[x]&&keepsLine(x,scope)&&kbPermitted(x,q,scope));}
  if(!id)return null;
  const own=ownersOf(id),used=allowed.filter(p=>own.includes(p)),connections=C.filter(c=>[...(c.lines||[]),...(c.more||[])].includes(id)&&[c.a,c.b].every(p=>allowed.includes(p)||outside.includes(p)));
  return {products:[...new Set([...used,...connections.flatMap(c=>[c.a,c.b])])],conn:connections[0]||null,conns:connections,missing:[],lines:[id],fromContext:false,via:'phrases',uncovered:local.uncovered,excluded:local.excluded};}
// the services the question's products and their connections offer, in the question's cadence, the matcher's own picks first; a
// question that asks to build the whole site ("build our new public website on AEM Sites") leans to a whole workstream its phrases
// speak to, so the site build's hours land there and not in a later question about one part of it
const BUILD_ASK=/\b(?:build|rebuild|implement|deliver|develop|stand up|create)\b(?:\W+\w+){0,5}?\W+(?:web\s*site|site|storefront|platform|portal)\b/i;
// step 91: a question about moving something (migrate, re-platform, move our site); "a failed transfer" of an enquiry or an import job
// is not one, so a migration service the matcher put first earns no head start there
const MOVE_ASK=/\b(?:migrat\w*|re-?platform\w*|(?:move|moving|transfer|transferring|carry|carrying|load|loading|import|importing|bring|bringing)\s+(?:over\s+)?(?:our|the|your|all|existing|current|active|these|this)\b[^.?]{0,60}\b(?:to|into|onto|from|off)\b)/i;
function byPhrases(q,d){const qw=new Set(phraseWords(q.text)),ong=isOngoing(q.text),whole=BUILD_ASK.test(q.text),lines=d.m.lines,adobe=d.m.products.filter(id=>P[id]&&!P[id].outside),pool=new Set(lines),moving=MOVE_ASK.test(q.text);
  const add=o=>{for(const l of [...(o.lines||[]),...(o.more||[])])if(LN[l]&&(LN[l].unit==='monthly')===ong)pool.add(l);};
  for(const id of adobe)add(P[id]);for(const c of C)if(adobe.includes(c.a)&&adobe.includes(c.b))add(c);
  return [...pool].filter(id=>METHOD[id]&&LN[id]&&keepsLine(id)&&kbPermitted(id,q)).map(id=>{const at=lines.indexOf(id),ps=phraseScore(id,qw),head=at>=0&&(moving||!MIGRATE_LINE.test(LN[id].name));return {id,s:ps+(head?Math.max(0,3-at):0)+(whole&&ps>0&&METHOD[id].kind==='workstream'?3:0)};}).sort((a,b)=>b.s-a.s).map(r=>r.id);}
/* The topic playbook (RFP_METHOD topics, playbook/BRIEF.md): a sourced method for a common ask the catalog has no service for
   (accessibility, page speed, the client's own CDN, A/B testing without Adobe Target, consent and privacy). A topic answers a
   question that says one of its triggers and is about one of its products, unless a service of its own answers it (the lead service
   is a task its phrases clearly match, or one of its phrases says the same words: a forms RFI's accessibility review, CDN logs for
   Brand Visibility), or the topic stands aside for a product the question names, the RFI has chosen or the question is about
   (testing with Adobe Target). Where two topics match, the one the question asks about wins: a trigger in an asking sentence
   ("Describe how ...", "...?") outranks one in the background, then the earlier one. */
const PLAYBOOK=typeof RFP_METHOD!=='undefined'&&RFP_METHOD&&Array.isArray(RFP_METHOD.topics)?RFP_METHOD.topics:[];
// whole words, a plural too ('A/B tests'); a space in a trigger also matches a hyphen ('ADA-compliant'), and a hyphen may follow it
// ('WCAG-compliant'); 'Akamai + CDN' needs both anywhere in the question ("Akamai is our enterprise CDN"), so Akamai's other tools do not count
const wordRe=t=>'(?<![\\w-])'+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\s+/g,'[\\s-]+')+'(?:e?s)?(?!\\w)';
const triggerRe=t=>{if(!/\s\+\s/.test(t))return new RegExp(wordRe(t),'i');const parts=t.split(/\s\+\s/).map(x=>wordRe(x.trim()));
  return Object.assign(new RegExp('^'+parts.map(x=>'(?=[\\s\\S]*'+x+')').join(''),'i'),{parts:parts.map(x=>new RegExp(x,'i'))});};
const triggerAt=(re,t)=>re.parts?Math.max(...re.parts.map(x=>x.exec(t).index)):re.exec(t).index;   // a two-word trigger is said where its later word is
const TRIGGERS=PLAYBOOK.map(t=>t.triggers.map(triggerRe));
const bareLabel=t=>t.replace(/^(?:[A-Z]{1,3}[.-]?)?\d+(?:\.\d+)*[.)]?\s+/,'');
const askingOf=t=>{const a=sentencesOf(t).filter(x=>ASKS_RE.test(bareLabel(x))||/\?$/.test(x));return a.length?a.join(' '):String(t||'');};
function topicOf(q,d,lead){if(!PLAYBOOK.length||!d||!d.m)return null;
  const excluded=kbExclusions(q),prods=d.m.products.filter(id=>P[id]&&!P[id].outside&&!excluded.has(id)),named=detectAll(q.text).named.filter(id=>!excluded.has(id)),chosen=rfiProducts().filter(id=>!excluded.has(id)),ask=askingOf(q.text);
  const task=lead&&METHOD[lead]&&METHOD[lead].kind==='task'?METHOD[lead]:null,clear=!!task&&phraseScore(lead,new Set(phraseWords(q.text)))>=8;
  const found=[];
  for(const [i,t] of PLAYBOOK.entries()){const said=TRIGGERS[i].filter(re=>re.test(q.text));if(!said.length||!t.products.some(id=>prods.includes(id)))continue;
    if((t.unless_products||[]).some(id=>prods.includes(id)||named.includes(id)||chosen.includes(id)))continue;
    if(task&&(clear||(task.phrases||[]).some(p=>said.some(re=>re.test(p)))))continue;
    found.push({t,inAsk:said.some(re=>re.test(ask)),at:Math.min(...said.map(re=>triggerAt(re,q.text)))});}
  found.sort((a,b)=>(b.inAsk-a.inAsk)||(a.at-b.at));
  return found.length?found[0].t:null;}
/* What the knowledge base answers a question with, settled once before any wording: a topic, or the lead service and the services
   beside it. The main service, then only the supporting services the question itself speaks to (a training service does not ride
   along with a migration question): a word of the service's name, or two of its scope, or a service of the connection the question
   names both ends of ("connect Marketo Engage to Customer Journey Analytics"; a go-live question that names no product does not take
   the Universal Editor setup) (a product's own name is no evidence: "AEM" in the question does not make the site build relevant); a monthly service rides along only
   with a question about after launch, and a one-time one only with a question that is not; and one whole workstream per phase (two
   whole site builds are one too many for one answer). A topic answer counts no service: the services it sits beside are counted in
   their own homes. */
// round 3 (the audit: Dispatcher validation and stage sizing in an Edge Delivery go-live): in an RFI on Edge Delivery Services, the
// Edge Delivery service takes the place of its AEM as a Cloud Service counterpart
const EDS_SIBLING={SI04:'A03',SI02:'A01',SI10:'A02'};   // step 91: moving another CMS onto Edge Delivery is A02's SEO-safe migration
const planOf=new WeakMap();
function kbPlan(q,d){if(!METHOD||!q||!d||!d.m||!d.m.lines.length)return null;const f0=d.m.lines.find(id=>kbPermitted(id,q));if(!f0)return null;
  if(!METHOD[f0]||!LN[f0]||!keepsLine(f0))return null;   // the best match is for moving off an older AEM, and this RFI's site runs on something else: today's answer stands
  const key=q.text+'|'+d.m.lines.join(',')+'|'+[...kbExclusions(q)].sort().join(','),c=planOf.get(q);if(c&&c.key===key)return c.plan;
  const ranked=byPhrases(q,d);if(!ranked.length)return null;const topic=topicOf(q,d,ranked[0]);let plan;
  if(topic)plan={topic,ids:[]};
  else{const qt=tokens(q.text),E=id=>METHOD[id],onEds=rfiProducts().includes('eds'),sib=id=>onEds&&EDS_SIBLING[id]&&METHOD[EDS_SIBLING[id]]?EDS_SIBLING[id]:id;
    const first=ranked.map(sib).find(id=>kbPermitted(id,q));if(!first)return null;const own=w=>!GENERIC.has(w)&&!PRODUCT_WORDS.has(w),words_=t=>tokens(t).filter(own);
    const both=!!d.m.conn&&[d.m.conn.a,d.m.conn.b].every(id=>detectAll(q.text).named.includes(id));   // the question names both products of the connection
    const speaks=id=>overlap(qt,words_(LN[id].name))>0||overlap(qt,words_(LN[id].scope||''))>=2||(both&&[...(d.m.conn.lines||[]),...(d.m.conn.more||[])].includes(id));
    const sameCadence=id=>(LN[id].unit==='monthly')===(LN[first].unit==='monthly')||isOngoing(q.text);
    const rival=id=>E(first).kind==='workstream'&&E(id).kind==='workstream'&&E(id).phase===E(first).phase;
    const strayMove=id=>MIGRATE_LINE.test(LN[id].name)&&!MOVE_ASK.test(q.text);   // step 91: a migration service rides along only with a question about moving something
    plan={topic:null,ids:[first,...d.m.lines.filter(id=>id!==first&&sib(id)===id&&METHOD[id]&&LN[id]&&keepsLine(id)&&kbPermitted(id,q)&&sameCadence(id)&&speaks(id)&&!rival(id)&&!strayMove(id))]};}
  planOf.set(q,{key,plan});return plan;}
const leadOf=q=>{const p=kbPlan(q,draftOf(q));return p?(p.topic?'topic:'+p.topic.id:p.ids[0]):null;};
// a topic's own hours are counted once, in the first answer it gives; a later answer from the same topic points there
let tHomeOf=null,tHomeIs={};
function topicHome(t){const qs=rfpState.questions;if(tHomeOf!==qs){tHomeOf=qs;tHomeIs={};}
  if(!(t.id in tHomeIs))tHomeIs[t.id]=qs.filter(x=>x.kind==='adobe').find(x=>{const p=kbPlan(x,draftOf(x));return !!p&&!!p.topic&&p.topic.id===t.id;})||null;
  return tHomeIs[t.id];}
// a topic that maps the laws behind its work (consent and privacy) names back the ones the question names
const LAWS=/\b(?:the\s+)?(?:Gramm-Leach-Bliley Act|Health Insurance Portability and Accountability Act|California Consumer Privacy Act|California Privacy Rights Act|General Data Protection Regulation|Children's Online Privacy Protection Act|Family Educational Rights and Privacy Act)\b|\b(?:GLBA|HIPAA|GDPR|CCPA|CPRA|COPPA|FERPA|PIPEDA|CASL|LGPD)\b/g;
function lawsOf(t){const out=[];for(const m of String(t||'').matchAll(LAWS)){const law=/\s/.test(m[0])&&!/^the\s/i.test(m[0])?'the '+m[0]:m[0].replace(/^The\s/,'the ');if(!out.some(x=>x.toLowerCase()===law.toLowerCase()))out.push(law);}return out;}
function topicAnswer(q,d,t){
  const excluded=kbExclusions(q),prods=new Set([...d.m.products,...rfiProducts()].filter(id=>!excluded.has(id))),facts=t.facts.filter(f=>f.for.some(id=>prods.has(id))).slice(0,2);
  const beside=[...new Set(Object.entries(t.draws_on).filter(([id])=>prods.has(id)).flatMap(([,ids])=>ids))].filter(id=>LN[id]&&kbPermitted(id,q)&&homeOfLine(id)).slice(0,2);   // only services an answer counts
  const later=t.phase==='after launch',time=[],home=topicHome(t);   // the hours line first, as in method()
  if(t.hours&&(!home||home===q))time.push('Planning estimate: about '+t.hours.low.toLocaleString('en-US')+' to '+t.hours.high.toLocaleString('en-US')+' hours '+(later?'a month':'for this work')+'.');
  else if(t.hours)time.push('Its hours are counted in our answer to '+(home.label||'that requirement')+'.');
  time.push(phaseLine(t.phase));
  for(const id of beside)time.push('It sits beside our '+LN[id].name+', estimated in our answer to '+(homeOfLine(id).label||'that requirement')+'.');
  const laws=t.echo_laws?lawsOf(q.text):[],named=laws.length?'You named '+listOf(laws)+': we map what '+(laws.length>1?'they require':'it requires')+' of your data with your privacy and legal team before anything is built.':'';
  const sections=[['Our approach',[toldUs(q),named,...facts.map(f=>kbFit(f.text,q)),kbFit(t.outcome,q)].filter(Boolean)],['How we would do it',kbFitAll(t.steps,q)],['What you get',kbFitAll(t.deliverables,q)],['Timeline and effort',time],['Risk we manage',[kbFit(t.risk,q)]]];
  licenseLines(sections,beside);
  const seen=new Set(),sources=[...facts.map(f=>({title:f.title||t.title,url:f.url})),...(d.sources||[]).map(x=>({title:x.title,url:x.url}))].filter(x=>!seen.has(x.url)&&seen.add(x.url));
  return {sections,services:beside,asks:kbFitAll(t.asks,q),sources,model:'knowledge base',topic:t.id};}
/* Round 3 (the judges and the audit: "Adobe's managed CDN or your own" for an insurer that said Akamai stays in front): where a step
   offers choices the RFI has already made (the CDN, where authors work, the BI tool, the CRM, the cloud storage) and the RFI names
   exactly one of them, only that one is kept; a "such as" list keeps its "such as". */
const OPTIONS=[
  {e:{managed:{re:/\bAdobe(?:'s|-)\s*managed CDN\b/i},own:{re:/\b(?:Akamai|Cloudflare|Fastly|CloudFront)\b|\b(?:our|existing|current) CDN\b/i,say:()=>{const v=/\b(Akamai|Cloudflare|Fastly|CloudFront)\b/i.exec(rfpText());return v?'your own '+v[1]+' CDN':'your own CDN';}}},m:{"Adobe's managed CDN":'managed','your own CDN':'own'}},
  {e:{aem:{on:()=>rfiProducts().includes('aemsites')},sp:{re:/\bSharePoint\b/i},gd:{re:/\bGoogle (?:Drive|Docs)\b/i}},m:{'AEM Authoring':'aem','Microsoft SharePoint':'sp','SharePoint':'sp','Google Drive':'gd'}},
  {e:{pbi:{re:/\bPower ?BI\b/i},tab:{re:/\bTableau\b/i},look:{re:/\bLooker\b/i}},m:{'Power BI':'pbi','Tableau':'tab','Looker':'look'}},
  {e:{sf:{re:/\bSalesforce\b/i},dyn:{re:/\bDynamics\b/i}},m:{'Salesforce':'sf','Microsoft Dynamics 365':'dyn','Microsoft Dynamics':'dyn','Dynamics':'dyn'}},
  {e:{az:{re:/\bAzure\b/i},aws:{re:/\b(?:AWS|Amazon S3)\b/i},gcs:{re:/\bGoogle Cloud\b/i},dbx:{re:/\bDropbox\b/i},od:{re:/\bOneDrive\b/i},sn:{re:/\bSnowflake\b/i},bq:{re:/\bBigQuery\b/i},dbr:{re:/\bDatabricks\b/i}},
   m:{'Azure Blob Storage':'az','Azure storage':'az','Azure':'az','AWS':'aws','Amazon S3':'aws','Google Cloud Storage':'gcs','Google Cloud':'gcs','Dropbox':'dbx','OneDrive':'od','Snowflake':'sn','Google BigQuery':'bq','Azure Databricks':'dbr','Databricks Delta Share':'dbr'}},
].map(g=>{const alt=Object.keys(g.m).sort((a,b)=>b.length-a.length).map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|');
  return Object.assign(g,{re:new RegExp('(such as\\s+)?(?:either\\s+)?((?:'+alt+')(?:\\s*,\\s*(?:'+alt+'))*(?:\\s*,)?\\s+or\\s+(?:'+alt+'))(?![\\w-])','g')});});
function fitOptions(t){const all=rfpText();let out=String(t||'');
  for(const g of OPTIONS){const named=Object.entries(g.e).filter(([,x])=>x.on?x.on():x.re.test(all)).map(([k])=>k);if(named.length!==1)continue;
    out=out.replace(g.re,(whole,such,list)=>{const items=list.split(/\s*,\s*|\s+or\s+/).map(x=>x.trim()).filter(Boolean),keys=items.map(x=>g.m[x]),k=named[0];
      if(!keys.includes(k))return whole;return (such||'')+(g.e[k].say?g.e[k].say():items[keys.indexOf(k)]);});}
  return out;}
const fitAll=a=>a.map(fitOptions);
function method(q,d){
  const plan=kbPlan(q,d);if(!plan)return null;if(plan.topic)return topicAnswer(q,d,plan.topic);
  const E=id=>METHOD[id],ids=plan.ids,main=E(ids[0]),rest=ids.slice(1);
  // round 1's judges: the winners open with the client's own facts, and a stock product sentence reads as pasted; so the answer opens
  // with what the client told us, in its own words, then what the work leaves it with
  const approach=[toldUs(q),main.outcome,controlsFor(d,q)];
  const steps=[...main.steps];for(const id of rest){if(steps.length>=6)break;const s=E(id).steps[0];if(s&&!steps.includes(s))steps.push(s);}
  const gets=[...main.deliverables];for(const id of rest){const g=E(id).deliverables[0];if(g&&!gets.includes(g))gets.push(g);}
  const once=ids.filter(id=>LN[id].unit!=='monthly'),monthly=ids.filter(id=>LN[id].unit==='monthly');
  // every service's hours are counted once, in its home answer; elsewhere a whole workstream is named with that home, a task is not
  let hours=0;const partOf=[],homeHere=id=>{const home=homeOfLine(id);return !home||home===q;};
  for(const id of once){if(homeHere(id))hours+=Number(LN[id].base)||0;else if(E(id).kind==='workstream')partOf.push('It is part of our '+LN[id].name+', estimated in our answer to '+(homeOfLine(id).label||'that requirement')+'.');}
  const month=monthly.filter(homeHere).reduce((n,id)=>n+(Number(LN[id].base)||0),0);
  // the hours line comes first: under a word limit the page trims a section from its end, and the effort is what a panel holds us to
  const time=[];
  if(hours||month)time.push('Planning estimate: '+[hours?hours.toLocaleString('en-US')+' hours'+(month?', one-time':''):'',month?month.toLocaleString('en-US')+' hours a month':''].filter(Boolean).join(', and ')+'.');
  else if(!partOf.length){const h=homeOfLine(ids[0]);time.push(h&&h!==q?'Its hours are counted in our answer to '+(h.label||'that requirement')+'.':'It adds no hours of its own beyond the services named here.');}
  time.push(phaseLine(main.phase),...partOf);
  // a package line (CJA Select or higher) and what a service also needs go with the answer that counts the service, not with every
  // answer it rides along in (the stitching package under a page-view question, from the round 2 audit)
  const counted=ids.filter((id,i)=>i===0||homeHere(id));
  for(const id of counted){const t=LN[id].tier;if(t&&!time.some(x=>x.includes(t)))time.push('This needs '+t+'.');}
  // what a service also needs beyond its own product (the catalog's ext: CJA audiences publish into Real-Time CDP or Journey
  // Optimizer): an Adobe product the client has not chosen is named with its license, as the AI writer does since step 90; one
  // the client has chosen needs no line; anything else (an Azure Storage account) is a prerequisite the client provides
  const excluded=kbExclusions(q),chosen=new Set(rfiProducts().filter(id=>!excluded.has(id)));
  for(const id of counted){const x=kbChoices(LN[id].ext,q);if(!x)continue;const named=detect(x).filter(p=>P[p]&&!P[p].outside);if(named.some(p=>chosen.has(p)))continue;
    const line='This also needs '+x.replace(/\.$/,'')+(named.length?', licensed separately.':'.');if(!time.includes(line))time.push(line);}
  const sections=[['Our approach',[approach[0],kbFit(approach[1],q),approach[2]].filter(Boolean)],['How we would do it',kbFitAll(steps,q)],['What you get',kbFitAll(gets.slice(0,5),q)],['Timeline and effort',time],['Risk we manage',[kbFit(main.risk,q)]]].filter(x=>x[1].length);
  licenseLines(sections,ids);
  const asks=kbFitAll([...new Set(ids.flatMap(id=>E(id).asks))].slice(0,3),q);
  return {sections,services:ids,asks,sources:(d.sources||[]).map(x=>({title:x.title,url:x.url})),model:'knowledge base'};}
// an AI answer saved with the work is used only while its question is unchanged, and only in the shapes this page writes
function aiOf(q){const a=q&&q.ai;if(!a||a.text!==q.text||!Array.isArray(a.sections)||!Array.isArray(a.services)||!Array.isArray(a.sources))return null;
  const sections=a.sections.filter(x=>Array.isArray(x)&&typeof x[0]==='string'&&Array.isArray(x[1])).map(([h,items])=>[h,items.filter(t=>typeof t==='string')]).filter(x=>x[1].length);
  return sections.length?{sections,services:a.services.filter(id=>typeof id==='string'&&LN[id]),sources:a.sources.filter(x=>x&&typeof x.url==='string'&&/^https:\/\//.test(x.url)).map(x=>({title:String(x.title||x.url),url:x.url})),model:a.model}:null;}
window.RFPAnswers={aiInput,takeAI,aiOf,rfiProducts,kbExclusions,kbPermitted,kbAllowedMatch,kbChoices,scopeEvidence,method,kbPlan,homeOfLine,rfiTimeline,hasAnswer:q=>hasDraft(draftOf(q)),match,compose,rfp,plain,written,limitOf,clientOrg,proposalPack,baseName,limitIn,wordsIn,listify,doLine,toSow,responseDoc,asksDoc,responseRows,writeBack,usedText,ownedProducts,context:contextProducts,detect,detectAll,scan};
R.restoreSession();   // step 56: the work this tab held before a reload or a trip to another step comes back
// step 70: a Save my work file chosen with Open draft on the home page arrives here
try{const t=sessionStorage.getItem('abv-rfp-work-in');if(t){sessionStorage.removeItem('abv-rfp-work-in');openWork(JSON.parse(t));}}catch(e){}
})();
