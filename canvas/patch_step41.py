"""Step 41 on the Build canvas (Nov 4 2026, Adam: "yes" to the fixes from the step 40 review,
sow/review_step40_2026-11-04/FINDINGS.md). On Start from your client's problem:
- a product the client already has (a refine chip's or a problem's `owned`) starts with the services that stand it up
  off (OWNED_OFF: setup, implementation, migration, go-live, onboarding training); the work done in it stays on, and the
  note names exactly the services in this setup that start off; a chip that adds standing up a product says so
- an answer works out its fees again whenever the play picker comes back (Change play, Start over), so it never quotes
  an old rate, size, term or currency
- matching: only the words that carry meaning, as stems, on both sides (plurals, endings, verb forms, spelling
  variants); "a & b" keywords need both words, so short words only count in context; keywords that say the same thing
  count once; a problem can require a word that unlocks it without scoring (financial services needs an industry word)
  and can specialize a general one; "Two problems here" only when the partner named both (the second scores 5 or more
  on keywords of its own and at least 40% of the first, and one setup covers both); ties go to the more specific
  keyword match; Show another setup skips setups already shown
- the why text drops sentences about a product a refine chip took out (the new play's own why when none is left); a
  problem can carry its own note; a switch from Create your own play to a named play brings that play's outside systems;
  outside system names read lowercase mid-sentence; the no-match line says "the list"; the footer points to the canvas
  for each connection's kind
Run once on the step 40 template (with data_step41.py on problems.json), then build.py and build_site.py.

    python3 sow/canvas/patch_step41.py sow/canvas/template.html
"""
import sys
path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'id="bp"' in html and 'OWNED_OFF' not in html, 'run this once on the step 40 template'


def rep(old, new):
    global html
    assert html.count(old) == 1, old[:90]
    html = html.replace(old, new)


# matching: word stems on both sides, spelling variants, required words; "up" carries meaning in a phrase (show up, come up)
rep(" to too up us very ", " to too us very ")
rep("a about an and are as at be by can cant client clients customer customers do ", "a about an and are as at be by can cant client clients do ")
a = html.index("const bpNorm=s=>"); b = html.index("const BP_MIN=3;\n")
assert html.count("const bpNorm=s=>") == 1 and a < b and b - a < 1200
html = html[:a] + r'''/* step 41: plurals, endings, verb forms and spelling variants match too: the question and every keyword are reduced to the same word stems */
const BP_SYN=[[/ chat gpt /g,' chatgpt '],[/ a b /g,' ab '],[/ personalis/g,' personaliz'],[/ optimis/g,' optimiz'],[/ llms /g,' llm '],[/ insurers? /g,' insurance ']];
const bpStem=w=>{if(w.length>3&&/ies$/.test(w))w=w.slice(0,-3)+'y';else if(w.length>3&&/[^s]s$/.test(w))w=w.slice(0,-1);if(w.length>5)w=w.replace(/(ing|ed|ly)$/,'');if(w.length>5)w=w.replace(/(ation|ate)$/,'at');return w;};
const bpToks=s=>{let t=' '+String(s).toLowerCase().replace(/[‘’]/g,"'").replace(/'s\b/g,'').replace(/'/g,'').replace(/[^a-z0-9]+/g,' ').trim()+' ';for(const [r,v] of BP_SYN)t=t.replace(r,v);return t.trim().split(' ').filter(Boolean);};
/* only the words that carry meaning, as stems: "product details are wrong" still matches "product details wrong" */
const bpNorm=s=>' '+bpToks(s).filter(w=>!BP_STOP.has(w)).map(bpStem).join(' ')+' ';
const bpWords=s=>new Set(bpToks(s).filter(w=>!BP_STOP.has(w)).map(bpStem));
const BPW=PROBS.map(p=>bpWords(p.problem+' '+p.chip));
/* a keyword "a & b" needs both anywhere in the question (so a short word only counts in context, like "show up" with AI);
   a keyword counts once even when two of its spellings meet (insurer and insurance) */
const bpKN=k=>k.split('&').map(bpNorm).filter(n=>n.trim());
const BPK=PROBS.map(p=>{const m=new Map();for(const k of p.keywords){const n=bpKN(k),id=n.join('&');if(n.length&&!m.has(id))m.set(id,[k,n,id]);}return [...m.values()];}),BPQ=PROBS.map(p=>(p.requires||[]).map(bpKN));
/* keywords more than one problem uses (like attribution or dam) never name a second problem on their own */
const BPG=new Set(BPK.flatMap(ks=>ks.map(([,,id])=>id)).filter((n,i,a)=>a.indexOf(n)!==i));
/* keywords that say the same thing count once: one whose words all sit inside another matched keyword's words adds nothing */
const bpWs=k=>new Set(k[1].join(' ').trim().split(/\s+/));
const bpKw=(i,t)=>{const m=BPK[i].filter(k=>k[1].every(x=>t.includes(x))).sort((a,b)=>bpWs(b).size-bpWs(a).size),kept=[];
  for(const k of m){const w=bpWs(k);if(!kept.some(x=>{const v=bpWs(x);return [...w].every(y=>v.has(y));}))kept.push(k);}return kept;};
const bpPts=k=>3+k[1].join(' ').trim().split(/\s+/).length;
/* a keyword found counts 3 plus its length in words; each word shared with the problem counts 1; 3 or more is a match.
   A problem with required words (financial services) scores nothing without one of them, and they unlock it without scoring */
function bpScore(i,text){const t=bpNorm(text);if(BPQ[i].length&&!BPQ[i].some(q=>q.every(n=>t.includes(n))))return 0;let s=0;for(const k of bpKw(i,t))s+=bpPts(k);for(const w of bpWords(text))if(BPW[i].has(w))s++;return s;}
''' + html[b:]

# a product the client already has: the services that stand it up start off
rep("const bpKey=s=>s.play+'|'+[...s.prods].sort().join()+'|'+[...s.out].sort().join();",
    r'''const bpKey=s=>s.play+'|'+[...s.prods].sort().join()+'|'+[...s.out].sort().join()+'|'+[...(s.off||[])].sort().join();
/* step 41: when a refine chip says the client already has a product, the services that stand it up start off (the work done in it stays on) */
const OWNED_OFF={eds:['A04','A01','A02','A03','A05','SI01','SI02','SI04','SI05','AXD01','AXD02'],storefront:['XA18','XA19'],commerce:['XA18','XA19'],aemsites:['SI01','SI02','SI04','SI05'],aemassets:['AS01','AS02','AS03','AS04'],'commerce-media':['XC15'],
  marketo:['MK01','MK02','MK03','MK04','MK05'],workfront:['WF01','WF02','WF03','WF04','WF05'],ajo:['JO01','JO02','JO04','JO05'],bc:['F02'],target:['TG01','TG02'],rtcdp:['RT01','RT02','RT03','RT05'],cw:['CW02'],bv:['L02']};
const bpOff=(s,r)=>[...new Set([...(s.off||[]),...(r.owned||[]).flatMap(id=>OWNED_OFF[id]||[])])];
const bpLc=s=>/^[A-Z][a-z]/.test(s)?s[0].toLowerCase()+s.slice(1):s;''')
rep("let bp={view:'start',asked:'',hits:[],i:0,two:false,setup:null,steps:[],near:[]};",
    "let bp={view:'start',asked:'',hits:[],i:0,pair:null,setup:null,steps:[],near:[]};")
rep("out:pl.custom?[]:p.products.filter(id=>P[id].outside&&(pl.outside||[]).includes(id))};}",
    "out:pl.custom?[]:p.products.filter(id=>P[id].outside&&(pl.outside||[]).includes(id)),off:[...new Set([...(p.owned||[]).flatMap(id=>OWNED_OFF[id]||[]),...(p.off||[])])]};}")
rep("return{play:tp.id,prods:[...new Set([...s.prods,...r.add])].filter(id=>!rm.includes(id)),out:[]};}",
    "return{play:tp.id,prods:[...new Set([...s.prods,...r.add])].filter(id=>!rm.includes(id)),out:[],off:bpOff(s,r)};}")
rep("return{play:tp.id,prods:tp.products.slice(),out:[...new Set([...s.out,...outs])].filter(id=>(tp.outside||[]).includes(id))};}",
    "const canon=PLAYS[s.play].custom?((PROBS.find(q=>q.play===tp.id)||{}).products||[]).filter(id=>P[id].outside):[];\n  return{play:tp.id,prods:tp.products.slice(),out:[...new Set([...s.out,...outs,...canon])].filter(id=>(tp.outside||[]).includes(id)),off:bpOff(s,r)};}")
rep("const r={names:[],oh:0,mh:0,concept:false};", "const r={names:[],ids:[],oh:0,mh:0,concept:false};")
rep("if(counted(l)){r.names.push(LN[l].name);", "if(counted(l)){r.names.push(LN[l].name);r.ids.push(l);")
rep("st.play=s.play;st.on=PLAYS[s.play].custom?s.prods.slice():[];st.out=s.out.slice();st.ls={};st.keep={};st.fresh=true;if(rate!==undefined)st.rate=rate;",
    "st.play=s.play;st.on=PLAYS[s.play].custom?s.prods.slice():[];st.out=s.out.slice();st.ls=Object.fromEntries((s.off||[]).map(l=>[l,false]));st.keep={};st.fresh=true;if(rate!==undefined)st.rate=rate;")
rep("if(k==='build'){const s=bp.setup;clearTimeout(bpT);st.play=s.play;st.on=PLAYS[s.play].custom?s.prods.slice():[];st.out=s.out.slice();st.ls={};",
    "if(k==='build'){const s=bp.setup;clearTimeout(bpT);st.play=s.play;st.on=PLAYS[s.play].custom?s.prods.slice():[];st.out=s.out.slice();st.ls=Object.fromEntries((s.off||[]).map(l=>[l,false]));")

# the answer: two problems only when both were named; the why text drops a product a chip took out; a problem's own note
rep("else heard=`<b>Heard:</b> ${esc(bpYou(p.chip))}. Here's the setup you can offer for that.`;",
    "else heard=`<b>Heard:</b> ${esc(bpYou(p.chip))}. Here's the setup you can offer for that.`;\n  if(!last&&p.note)heard+=' '+esc(p.note);")
rep("else if(bp.two)heard=`<b>Two problems here:</b> ${esc(bpYou(PROBS[bp.hits[1-bp.i]].chip))}, and ${esc(bpYou(p.chip))}. Here's the setup you can offer for both.`;",
    "else if(bp.pair&&bp.i===0)heard=`<b>Two problems here:</b> ${esc(bpYou(PROBS[bp.pair[0]].chip))}, and ${esc(bpYou(PROBS[bp.pair[1]].chip))}. Here's the setup you can offer for both.`;")
rep("const base=bpConns(bpBase(p)).map(c=>c.id),why=p.why.replace(/\\.\\s+(?=[A-Z])/g,'.\\n').split('\\n').concat(",
    "const base=bpConns(bpBase(p)).map(c=>c.id),gone=bpBase(p).prods.filter(id=>!s.prods.includes(id)),sents=q=>q.why.replace(/\\.\\s+(?=[A-Z])/g,'.\\n').split('\\n'),kept=sents(p).filter(w=>!gone.some(id=>[P[id].name,P[id].short].filter(Boolean).some(n=>w.includes(n)))),own=PROBS.find(q=>q.play===s.play),why=(kept.length||pl.custom||!own?kept:sents(own)).concat(")
rep("c.label.replace(/\\s*$/,'').replace(/([^.])$/,'$1.')", "bpVoice(c.label.replace(/\\s*$/,'').replace(/([^.])$/,'$1.'))")
rep("const bpHrs=n=>", "/* connection labels in the partner's voice */\nconst bpVoice=s=>s.replace(/\\b[Tt]he (customer|client)'s\\b/g,(m,w)=>(m[0]==='T'?'Your':'your')+\" client's\").replace(/^Aem\\.live\\b/,'The aem.live');\nconst bpHrs=n=>")

a = html.index("function bpAsk(text,forced){"); b = html.index("  bp.setup=bpBase(PROBS[bp.hits[bp.i]]);bpShow(900);}")
assert html.count("function bpAsk(text,forced){") == 1 and a < b
html = html[:a] + r'''/* ties go to the problem whose keywords matched more specifically */
const bpKwPts=(i,t)=>bpKw(i,t).reduce((s,k)=>s+bpPts(k),0);
function bpAsk(text,forced){const t=bpNorm(text),sc=PROBS.map((p,i)=>[i,bpScore(i,text),bpKwPts(i,t)]).sort((a,b)=>b[1]-a[1]||b[2]-a[2]);bp.asked=text;bp.steps=[];bp.pair=null;bp.i=0;
  let hits=(forced!==undefined?[[forced,1/0],...sc.filter(([i])=>i!==forced)]:sc).filter(([,v])=>v>=BP_MIN);
  if(!hits.length){bp.near=sc.filter(([,v])=>v>0).slice(0,4).map(([i])=>i);if(!bp.near.length)bp.near=PROBS.map((p,i)=>i).filter(i=>PROBS[i].starter);clearTimeout(bpT);bp.view='nomatch';bpRender();return;}
  /* two problems only when the partner named both: the second scores 5 or more on keywords of its own (not shared with
     another problem, not part of a keyword the first matched, not built on one) and at least 40% of the first, and one setup covers both
     (it leads; with the same products, the higher score leads) */
  /* a specialized problem whose required word is there and a keyword of its own matched (financial services) leads over the general one it specializes */
  for(const h of hits){const g=bpKwPts(h[0],t)>0&&PROBS[h[0]].specializes,gi=hits.findIndex(x=>PROBS[x[0]].id===g),hi=hits.indexOf(h);if(g&&gi>=0&&gi<hi){hits.splice(hi,1);hits.splice(gi,0,h);}}
  let lead=hits[0][0];
  if(forced===undefined&&hits.length>1){const [a,va]=hits[0],[b,vb]=hits[1],ka=bpKw(a,t),kb=bpKw(b,t),cov=(x,y)=>PROBS[y].products.every(id=>PROBS[x].products.includes(id));
    const own=kb.filter(k=>!BPG.has(k[2])&&!ka.some(x=>x[2].includes(k[2])||(x[1].length===1&&k[1].some(part=>part.includes(x[1][0])||x[1][0].includes(part))))).reduce((s,k)=>s+bpPts(k),0);
    if(vb>=5&&vb>=0.4*va&&own>=5&&(cov(a,b)||cov(b,a))){bp.pair=[a,b];if(!cov(a,b))lead=b;}}
  /* Show another setup offers only setups not already shown */
  const seen=new Set([bpKey(bpBase(PROBS[lead]))]);bp.hits=[lead];
  for(const [i] of hits){const k=bpKey(bpBase(PROBS[i]));if(seen.has(k))continue;seen.add(k);bp.hits.push(i);if(bp.hits.length>=3)break;}
''' + html[b:]
rep("if(k==='another'){bp.i=(bp.i+1)%bp.hits.length;bp.two=false;bp.steps=[];",
    "if(k==='another'){bp.i=(bp.i+1)%bp.hits.length;bp.steps=[];")

# notes: the services a product the client already has starts without; outside system names lowercase mid-sentence
rep("if(n.play!==was.play)notes.push('That moves the setup to '+PLAYS[n.play].label+'.');if(r.note)notes.push(r.note);",
    "if(n.play!==was.play)notes.push('That moves the setup to '+PLAYS[n.play].label+'.');if(r.note)notes.push(r.note);\n"
    "    const inSet=bpSim({...n,off:[]}).ids,offNew=n.off.filter(l=>!(was.off||[]).includes(l)&&inSet.includes(l));if(offNew.length)notes.push('Your client already has '+andList((r.owned||[]).filter(id=>(OWNED_OFF[id]||[]).some(l=>offNew.includes(l))).map(id=>id==='storefront'?'a Commerce storefront on Edge':id==='commerce-media'?'its product images in AEM Assets':P[id].name))+', so '+(offNew.length>1?'these services start':'this service starts')+' off: '+offNew.map(l=>LN[l].name).join('; ')+'. Turn '+(offNew.length>1?'any':'it')+' back on with the check on the canvas.');\n"
    "    const built=r.add.filter(id=>!(r.owned||[]).includes(id)&&!was.prods.includes(id)&&(P[id].lines||[]).some(l=>(OWNED_OFF[id]||[]).includes(l)&&inSet.includes(l)));if(built.length)notes.push('This adds standing up '+andList(built.map(id=>P[id].name))+': '+built.flatMap(id=>P[id].lines.filter(l=>OWNED_OFF[id].includes(l)&&inSet.includes(l))).map(l=>LN[l].name).join('; ')+'. If your client already has '+(built.length>1?'them':'it')+', take '+(built.flatMap(id=>P[id].lines.filter(l=>OWNED_OFF[id].includes(l)&&inSet.includes(l))).length>1?'those':'it')+' out with X on the canvas.');")
rep("andList(lost.map(id=>'the '+P[id].name+' box'))+(lost.length>1?' leave':' leaves')+' the setup.');",
    "andList(lost.map(id=>'the '+bpLc(P[id].name)+' box'))+(lost.length>1?' leave':' leaves')+' the setup.'+(lost.includes('cdn')&&n.prods.includes('bv')?\" Brand Visibility still needs your client's CDN, which you set up with them outside this tool.\":''));\n"
    "    if(lost.includes('cdn'))for(let i=0;i<notes.length-1;i++)notes[i]=notes[i].replace(/\\.\\s+/g,'.\\n').split('\\n').filter(x=>!/CDN logs/.test(x)).join(' ');")
rep("That doesn't match a problem on our list.", "That doesn't match a problem on the list.")

rep("Matched from a list of common client problems, using only products and connections Adobe documents. Edit anything on the next screen.",
    "Matched from a list of common client problems, using Adobe's documentation. Edit anything on the next screen, where each connection says whether Adobe documents it or a partner designs it.")

# an answer works out its fees again whenever the play picker comes back (after Change play or Start over clear the play)
rep("bpRender();\n$('picker').addEventListener('click',pick);",
    "$('confirm-yes').addEventListener('click',()=>setTimeout(()=>{if(!play()&&bp.view==='answer')bpRender();},0));\nbpRender();\n$('picker').addEventListener('click',pick);")

assert 'bp.two' not in html and '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print("step 41 applied on the canvas: owned products, fees worked out again, matching, why text")
