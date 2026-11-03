"""Step 40 on the Build canvas (Nov 3 2026, Adam: "build it please"): Start from your client's problem, on the play picker.
Partners ask on behalf of their clients ("My client doesn't show up in ChatGPT"). No AI: the question is matched to the 19
problems in problems.json (from sow/problem_review_2026-11-03/), and the answer gives the play, its products and how they
connect, why they work together and the starting services, hours and fees, from the canvas's own catalog and math.
Refine chips add products or switch the play; Build this puts the setup on the canvas. Mockups: sow/mockups/nov3_problem/.
Run once on the step 39 template, then build.py and build_site.py.

    python3 sow/canvas/patch_step40.py sow/canvas/template.html
"""
import sys
path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'id="bp"' not in html, 'step 40 is already on this template'

CSS_AT = '.picker .one{'
CSS = r'''/* Start from your client's problem (step 40) */
.bp{background:#fff;border:1.5px solid #1C1C1C;border-top:4px solid #EB1000;border-radius:8px;padding:22px 24px;margin:0 0 26px;max-width:1080px}
.bp .bp-t{display:flex;gap:10px;align-items:center;font-weight:700;font-size:20px;color:#1C1C1C;margin:0}
.bp .bp-s{margin:6px 0 14px;font-size:15px;color:#3A3A3A}
.bp-box{display:flex;gap:10px;align-items:center;border:1.5px solid #1C1C1C;border-radius:8px;padding:6px 6px 6px 14px;background:#fff}
.bp-box[hidden]{display:none}
.bp-box:focus-within{outline:2px solid #EB1000;outline-offset:1px}
.bp-box input{flex:1;min-width:0;border:0;outline:0;font:inherit;font-size:16px;color:#1C1C1C;background:transparent;padding:6px 0}
.bp-box input::placeholder{color:#3A3A3A;opacity:1}
.bp-go{background:#EB1000;border:0;border-radius:6px;width:38px;height:38px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:none}
.bp-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.bp-chip{border:1.5px solid #1C1C1C;border-radius:18px;padding:7px 13px;font:inherit;font-size:14px;font-weight:600;color:#1C1C1C;background:#fff;cursor:pointer;text-align:left}
.bp-chip:hover{border-color:#EB1000}
.bp-chip.red{border-color:#EB1000;color:#C40000}
.bp-ask{display:flex;justify-content:flex-end;margin:4px 0 10px}
.bp-ask div{background:#1C1C1C;color:#fff;border-radius:14px 14px 4px 14px;padding:11px 15px;font-size:15px;max-width:640px;overflow-wrap:anywhere}
.bp-work{display:flex;gap:6px;align-items:center;font-size:15px;color:#1C1C1C;padding:4px 0 4px 20px;border-left:4px solid #EB1000}
.bp-work i{width:7px;height:7px;border-radius:50%;background:#EB1000;animation:bpDot 1s infinite ease-in-out}
.bp-work i:nth-of-type(2){animation-delay:.15s}.bp-work i:nth-of-type(3){animation-delay:.3s}
@keyframes bpDot{0%,80%,100%{opacity:.25}40%{opacity:1}}
.bp-ans{border-left:4px solid #EB1000;padding:4px 0 2px 16px}
.bp-ans>*{animation:bpIn .35s ease both}
.bp-ans>:nth-child(2){animation-delay:.1s}.bp-ans>:nth-child(3){animation-delay:.2s}.bp-ans>:nth-child(4){animation-delay:.3s}.bp-ans>:nth-child(5){animation-delay:.4s}
.bp-ans>:nth-child(6){animation-delay:.5s}.bp-ans>:nth-child(7){animation-delay:.6s}.bp-ans>:nth-child(8){animation-delay:.7s}.bp-ans>:nth-child(n+9){animation-delay:.8s}
@keyframes bpIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.bp-ans>*,.bp-work i{animation:none}}
.bp-lbl{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#C40000;margin:14px 0 6px}
.bp-heard{font-size:15px;color:#1C1C1C;line-height:1.5}
.bp-prods{display:flex;align-items:center;flex-wrap:wrap;row-gap:8px;margin:6px 0 4px}
.bp-p{border:1.5px solid #1C1C1C;border-top:5px solid #EB1000;border-radius:6px;padding:9px 14px;font-weight:700;font-size:15px;background:#fff;color:#1C1C1C}
.bp-p.out{border-top:1.5px dashed #1C1C1C}
.bp-gap{width:14px}
.bp-ln{width:70px;border-top:2px dotted #1C1C1C;position:relative}
.bp-ln b{position:absolute;top:-12px;left:24px;width:22px;height:22px;border:2px solid #EB1000;border-radius:50%;background:#fff;color:#EB1000;font-weight:700;font-size:13px;line-height:18px;text-align:center;cursor:help}
.bp ul{margin:2px 0 0 18px;padding:0;font-size:15px;line-height:1.6;color:#1C1C1C}
.bp-del{font-size:15px;color:#1C1C1C;line-height:1.5}
.bp-row{display:flex;gap:12px;align-items:center;margin-top:16px;flex-wrap:wrap}
.bp-build{background:#EB1000;color:#fff;font:inherit;font-weight:700;border:0;border-radius:6px;padding:11px 18px;font-size:15px;cursor:pointer}
.bp-alt{background:#fff;color:#1C1C1C;font:inherit;font-weight:600;border:1.5px solid #1C1C1C;border-radius:6px;padding:10px 16px;font-size:15px;cursor:pointer}
.bp-note{font-size:13.5px;color:#3A3A3A;margin-top:10px}
@media (max-width:600px){.bp{padding:18px 16px}.bp .bp-t{font-size:18px}.bp-ln{width:40px}.bp-ln b{left:9px}}
'''
assert html.count(CSS_AT) == 1
html = html.replace(CSS_AT, CSS + CSS_AT)

HTML_AT = '<section class="picker" id="picker"><div class="in"><h2>Choose a play to start</h2>'
BOX = ('<section class="picker" id="picker"><div class="in">'
       '<div class="bp" id="bp"><h2 class="bp-t"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EB1000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/></svg>Not sure which play? Start from your client\'s problem</h2>'
       '<p class="bp-s">Describe what your client is trying to fix. You get the products, how they connect and the services you can offer, from Adobe\'s documentation.</p>'
       '<form class="bp-box" id="bp-form"><input id="bp-q" maxlength="300" autocomplete="off" aria-label="Describe your client\'s problem" placeholder="e.g. My client doesn\'t show up when people ask ChatGPT about their category">'
       '<button class="bp-go" type="submit" aria-label="Ask"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></form>'
       '<div id="bp-body" aria-live="polite"></div></div>'
       '<h2>Choose a play to start</h2>')
assert html.count(HTML_AT) == 1
html = html.replace(HTML_AT, BOX)

JS_AT = "$('picker').addEventListener('click',pick);"
JS = r'''/* ---------- Start from your client's problem (step 40) ----------
   No AI: the partner's words are matched to the problems in problems.json (keywords first, then shared words), and the
   answer comes from the catalog: the play, its products and connections, and its starting services priced with the canvas's own math */
const PROBS=/*PROBLEMS*/null;
const BP_STOP=new Set('a about an and are as at be by can cant client clients customer customers do does doesnt dont for from get gets has have how i in is isnt it its just my no not of on or our people so that the their them they this to too up us very want wants we what when which who why with wont'.split(' '));
const bpNorm=s=>' '+String(s).toLowerCase().replace(/[‘’]/g,"'").replace(/'s\b/g,'').replace(/'/g,'').replace(/[^a-z0-9]+/g,' ').trim()+' ';
const bpStem=w=>w.length>4?w.replace(/(ing|ed|es|s)$/,''):w;
const bpWords=s=>new Set(bpNorm(s).trim().split(' ').filter(w=>w&&!BP_STOP.has(w)).map(bpStem));
const BPW=PROBS.map(p=>bpWords(p.problem+' '+p.chip));
/* a keyword found whole counts 3 plus its length in words; each word shared with the problem counts 1; 3 or more is a match */
function bpScore(i,text){const t=bpNorm(text);let s=0;for(const k of PROBS[i].keywords)if(t.includes(bpNorm(k)))s+=3+k.split(' ').length;for(const w of bpWords(text))if(BPW[i].has(w))s++;return s;}
const BP_MIN=3;
const bpYou=s=>(/^[A-Z][a-z]/.test(s)?s[0].toLowerCase()+s.slice(1):s).replace(/\bmy client/g,'your client');
const bpKey=s=>s.play+'|'+[...s.prods].sort().join()+'|'+[...s.out].sort().join();
let bp={view:'start',asked:'',hits:[],i:0,two:false,setup:null,steps:[],near:[]};
/* a problem's setup: its play, the Adobe products and the outside systems that play offers */
function bpBase(p){const pl=PLAYS[p.play];return{play:p.play,prods:p.products.filter(id=>!P[id].outside),out:pl.custom?[]:p.products.filter(id=>P[id].outside&&(pl.outside||[]).includes(id))};}
/* a refine chip: adds (or removes) products, and can switch the play; null when the play can't hold what it adds */
function bpNext(s,r){const tp=PLAYS[r.play||s.play],rm=r.remove||[];
  if(tp.custom){if(r.add.some(id=>P[id].outside||!tp.products.includes(id)))return null;return{play:tp.id,prods:[...new Set([...s.prods,...r.add])].filter(id=>!rm.includes(id)),out:[]};}
  const outs=r.add.filter(id=>P[id].outside);if(r.add.some(id=>!P[id].outside&&!tp.products.includes(id))||outs.some(id=>!(tp.outside||[]).includes(id)))return null;
  return{play:tp.id,prods:tp.products.slice(),out:[...new Set([...s.out,...outs])].filter(id=>(tp.outside||[]).includes(id))};}
/* a chip is offered when it changes the setup and keeps every Adobe product already in it (unless it says to take one out) */
function bpOk(s,r){const n=bpNext(s,r);if(!n)return false;const rm=r.remove||[];return !s.prods.some(id=>!rm.includes(id)&&!n.prods.includes(id))&&bpKey(n)!==bpKey(s);}
const bpConns=s=>{const ids=[...s.prods,...s.out];return C.filter(c=>ids.includes(c.a)&&ids.includes(c.b));};
/* the setup's starting services, hours and fees, worked out exactly as the canvas would show them right after Build this */
function bpSim(s,rate){const was={play:st.play,on:st.on,out:st.out,ls:st.ls,keep:st.keep,fresh:st.fresh,rate:st.rate};
  st.play=s.play;st.on=PLAYS[s.play].custom?s.prods.slice():[];st.out=s.out.slice();st.ls={};st.keep={};st.fresh=true;if(rate!==undefined)st.rate=rate;UNI={k:'',s:new Set()};
  const r={names:[],oh:0,mh:0,concept:false};
  try{for(const o of [...prods(),...conns()])for(const l of all(o))if(counted(l)){r.names.push(LN[l].name);if(unitOf(l)==='monthly')r.mh+=hrs(l);else r.oh+=hrs(l);if(LN[l].origin==='research'&&!(effOf(l)&&effOf(l).w))r.concept=true;}
    const t=totals();r.yr=t.yr;}
  finally{Object.assign(st,was);UNI={k:'',s:new Set()};}
  return r;}
const bpHrs=n=>(Math.round(n*10)/10).toLocaleString('en-US');
const bpChip=(i,cls)=>`<button type="button" class="bp-chip${cls||''}" data-bpp="${i}">${esc(PROBS[i].chip)}</button>`;
function bpStartHTML(){const all=bp.view==='all',ids=PROBS.map((p,i)=>i).filter(i=>all||PROBS[i].starter);
  return `<div class="bp-chips">${ids.map(i=>bpChip(i)).join('')}<button type="button" class="bp-chip red" data-bpa="${all?'fewer':'all'}">${all?'Show fewer problems':'See all problems'}</button></div>`;}
function bpAnswerHTML(){const p=PROBS[bp.hits[bp.i]],s=bp.setup,pl=PLAYS[s.play],ids=[...s.prods,...s.out],last=bp.steps[bp.steps.length-1];
  let heard;
  if(last)heard=`<b>Updated:</b> ${esc(bpYou(last.chip))}.${last.note?' '+esc(last.note):''}`;
  else if(bp.two)heard=`<b>Two problems here:</b> ${esc(bpYou(PROBS[bp.hits[1-bp.i]].chip))}, and ${esc(bpYou(p.chip))}. Here's the setup you can offer for both.`;
  else heard=`<b>Heard:</b> ${esc(bpYou(p.chip))}. Here's the setup you can offer for that.`;
  const boxes=ids.map((id,k)=>{const a=ids[k-1],c=a&&C.find(c=>(c.a===a&&c.b===id)||(c.a===id&&c.b===a));
    return (k?(c?`<span class="bp-ln"><b title="${esc(c.label||KIND[c.kind]||'')}" aria-label="${esc((KIND[c.kind]||'Connection')+': '+(c.label||''))}">i</b></span>`:'<span class="bp-gap"></span>'):'')+`<span class="bp-p${P[id].outside?' out':''}">${esc(P[id].name)}${P[id].outside?' (outside system)':''}</span>`;}).join('');
  const base=bpConns(bpBase(p)).map(c=>c.id),why=p.why.replace(/\.\s+(?=[A-Z])/g,'.\n').split('\n').concat(bpConns(s).filter(c=>!base.includes(c.id)&&c.label).map(c=>c.label.replace(/\s*$/,'').replace(/([^.])$/,'$1.')));
  const priced=st.rate>0,lo=bpSim(s,priced?undefined:100),hi=priced?null:bpSim(s,300),n=lo.names.length;
  const names=n<=6?andList(lo.names):lo.names.slice(0,5).join(', ')+' and '+(n-5)+' more';
  const term=lo.mh?' over '+st.months+' months':'';
  const del=n?`${n} starting service${n===1?'':'s'}: ${esc(names)}. ${bpHrs(lo.oh)} one-time hour${lo.oh===1?'':'s'}${lo.mh?' + '+bpHrs(lo.mh)+' a month':''}, `+
    (priced?`<b>${money(lo.yr)}</b> at ${money(st.rate)} an hour${term}.`:`<b>${money(lo.yr)} to ${money(hi.yr)}</b> at ${money(100)} to ${money(300)} an hour${term}; enter your rate on the next screen.`)+
    (lo.concept?' Includes service concepts with placeholder hours.':''):'No starting services yet; add them on the next screen.';
  const refs=p.refine.map((r,k)=>[r,k]).filter(([r])=>!bp.steps.some(x=>x.chip===r.chip)&&bpOk(s,r));
  return `<div class="bp-ans"><div class="bp-heard">${heard}</div>
<div class="bp-lbl">Recommended: ${esc(pl.custom?pl.label+': '+andList(s.prods.map(short)):pl.label)}</div><div class="bp-prods">${boxes}</div>
<div class="bp-lbl">Why they work together</div><ul>${why.map(w=>`<li>${esc(w)}</li>`).join('')}</ul>
<div class="bp-lbl">What you deliver</div><div class="bp-del">${del}</div>
${refs.length?`<div class="bp-lbl">Refine</div><div class="bp-chips" style="margin-top:4px">${refs.map(([r,k])=>`<button type="button" class="bp-chip" data-bpr="${k}">${esc(r.chip)}</button>`).join('')}</div>`:''}
<div class="bp-row"><button type="button" class="bp-build" data-bpa="build">Build this</button>${bp.hits.length>1?'<button type="button" class="bp-alt" data-bpa="another">Show another setup</button>':''}<button type="button" class="bp-alt" data-bpa="again">Ask about another problem</button></div>
<div class="bp-note">Matched from a list of common client problems, using only products and connections Adobe documents. Edit anything on the next screen.</div></div>`;}
function bpRender(){const v=bp.view,talk=v==='working'||v==='answer';$('bp-form').hidden=talk;
  const bubbles=talk?[bp.asked,...bp.steps.map(x=>x.chip)].map(t=>`<div class="bp-ask"><div>${esc(t)}</div></div>`).join(''):'';
  if(v==='working')$('bp-body').innerHTML=bubbles+'<div class="bp-work">Matching your client\'s problem <i></i><i></i><i></i></div>';
  else if(v==='answer')$('bp-body').innerHTML=bubbles+bpAnswerHTML();
  else if(v==='nomatch')$('bp-body').innerHTML=`<p class="bp-heard" style="margin:12px 0 0"><b>No match yet.</b> That doesn't match a problem on our list. Try one of the closest, or describe it another way:</p><div class="bp-chips">${bp.near.map(i=>bpChip(i)).join('')}<button type="button" class="bp-chip red" data-bpa="all">See all problems</button></div>`;
  else $('bp-body').innerHTML=bpStartHTML();}
let bpT=0;
const bpWait=ms=>matchMedia('(prefers-reduced-motion: reduce)').matches?150:ms;
function bpShow(ms){clearTimeout(bpT);bp.view='working';bpRender();bpT=setTimeout(()=>{bp.view='answer';bpRender();const a=$('bp-body').querySelector('.bp-ans');if(a&&a.getBoundingClientRect().top<0)a.scrollIntoView({block:'start'});},bpWait(ms));}
/* a typed problem, or a problem chip (forced): the best matches, and when one setup covers the other's, both are heard */
function bpAsk(text,forced){const sc=PROBS.map((p,i)=>[i,bpScore(i,text)]).sort((a,b)=>b[1]-a[1]);bp.asked=text;bp.steps=[];bp.two=false;bp.i=0;
  bp.hits=(forced!==undefined?[[forced,1/0],...sc.filter(([i])=>i!==forced)]:sc).filter(([,v])=>v>=BP_MIN).slice(0,3).map(([i])=>i);
  if(!bp.hits.length){bp.near=sc.filter(([,v])=>v>0).slice(0,4).map(([i])=>i);if(!bp.near.length)bp.near=PROBS.map((p,i)=>i).filter(i=>PROBS[i].starter);clearTimeout(bpT);bp.view='nomatch';bpRender();return;}
  if(forced===undefined&&bp.hits.length>1){const cov=(a,b)=>PROBS[b].products.every(id=>PROBS[a].products.includes(id));
    if(cov(bp.hits[1],bp.hits[0])){bp.two=true;bp.i=1;}else if(cov(bp.hits[0],bp.hits[1]))bp.two=true;
    if(bp.two)bp.hits=bp.hits.slice(0,2);}
  bp.setup=bpBase(PROBS[bp.hits[bp.i]]);bpShow(900);}
$('bp-form').addEventListener('submit',e=>{e.preventDefault();const q=$('bp-q').value.trim();if(!q){$('bp-q').focus();return;}bpAsk(q);});
$('bp').addEventListener('click',e=>{const pc=e.target.closest('[data-bpp]');if(pc){const i=Number(pc.dataset.bpp);bpAsk(PROBS[i].chip,i);return;}
  const rc=e.target.closest('[data-bpr]');if(rc){const r=PROBS[bp.hits[bp.i]].refine[Number(rc.dataset.bpr)],was=bp.setup,n=bpNext(was,r);if(!n)return;
    const lost=was.out.filter(id=>!n.out.includes(id)),notes=[];if(n.play!==was.play)notes.push('That moves the setup to '+PLAYS[n.play].label+'.');if(r.note)notes.push(r.note);
    if(lost.length)notes.push((PLAYS[n.play].custom?"Create your own play doesn't offer outside systems, so ":"This play doesn't offer it, so ")+andList(lost.map(id=>'the '+P[id].name+' box'))+(lost.length>1?' leave':' leaves')+' the setup.');
    bp.steps.push({chip:r.chip,note:notes.join(' ')});bp.setup=n;bpShow(500);return;}
  const a=e.target.closest('[data-bpa]');if(!a)return;const k=a.dataset.bpa;
  if(k==='all'||k==='fewer'){bp.view=k==='all'?'all':'start';bpRender();return;}
  if(k==='again'){clearTimeout(bpT);bp.view='start';bpRender();$('bp-q').value='';$('bp-q').focus();return;}
  if(k==='another'){bp.i=(bp.i+1)%bp.hits.length;bp.two=false;bp.steps=[];bp.setup=bpBase(PROBS[bp.hits[bp.i]]);bpShow(500);return;}
  if(k==='build'){const s=bp.setup;clearTimeout(bpT);st.play=s.play;st.on=PLAYS[s.play].custom?s.prods.slice():[];st.out=s.out.slice();st.ls={};st.keep={};st.fresh=true;st.pubSig=null;moreOpen={};fsel=null;fhov=null;
    bp.view='start';$('bp-q').value='';bpRender();render();}});
bpRender();
'''
assert html.count(JS_AT) == 1
html = html.replace(JS_AT, JS + JS_AT)
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print("step 40 applied on the canvas: Start from your client's problem")
