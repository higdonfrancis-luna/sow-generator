"""Focus view mockup: a copy of the Build canvas prototype with anchored edits.

Reads prototype_copy.html (an unchanged copy of allcat/sow/canvas/index.html),
applies each edit only if its anchor appears exactly once, writes index.html.
"""
import pathlib, sys

HERE = pathlib.Path(__file__).resolve().parent
src = (HERE / 'prototype_copy.html').read_text(encoding='utf-8')
out = src


def once(old):
    n = out.count(old)
    if n != 1:
        sys.exit(f'anchor found {n} times, expected 1: {old[:70]!r}')


def swap(old, new):
    global out
    once(old)
    out = out.replace(old, new)
    print('ok   ', old[:60].replace('\n', ' '))


def block(start, end, new):
    """Replace the text from `start` up to (not including) `end`."""
    global out
    once(start)
    i = out.index(start)
    j = out.index(end, i)
    assert out.count(end, i, j + len(end)) == 1
    out = out[:i] + new + out[j:]
    print('block', start[:60].replace('\n', ' '))


# ---------------------------------------------------------------- CSS
CSS = r'''
/* ---------- focus view: a busy canvas draws one product's connections at a time ---------- */
.fbar{position:absolute;left:0;right:0;top:0;z-index:4;height:78px;background:#fff;border-bottom:1px solid var(--line);padding:0 30px;display:flex;align-items:center;gap:16px}
.fbar[hidden]{display:none}
.fbar .fi{flex:none;display:flex}
.fbar .fl{flex:none;width:250px;display:flex;flex-direction:column;line-height:1.2}
.fbar .fl .k{font-size:12.5px;font-weight:700;letter-spacing:1.4px;color:var(--dred);text-transform:uppercase}
.fbar .fl b{font-size:18px;line-height:22px}
.fbar .fm{flex:1;min-width:0;display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;font-size:16px;line-height:22px;color:var(--ink)}
.fbar .chip{font-size:14.5px;font-weight:700;border:1.5px solid var(--ink);border-radius:3px;padding:0 8px;line-height:23px;background:#fff;color:var(--ink);white-space:nowrap}
.fbar .chip:hover{border-color:var(--red);color:var(--red)}
.fbar .btn{flex:none}
.node.fv{flex-direction:column;gap:3px}
.node .nn{display:flex;align-items:center;justify-content:center;gap:8px}
.node .cn{font-size:16px;line-height:21px;font-weight:600;color:var(--ink2);border-radius:3px;padding:0 7px}
.node.lk{border-color:var(--red)}
.node.fx{border-color:var(--red);border-width:3px;border-top-width:6px}
.node.fx .cn{background:var(--red);color:#fff}
.edge.cx{stroke:var(--red);stroke-width:4}
.ib.cx{background:var(--red);color:#fff}
'''
swap('</style></head><body>', CSS + '</style></head><body>')

# ---------------------------------------------------------------- markup
HUB = ('<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#EB1000" stroke-width="2.2" '
       'stroke-linecap="round" aria-hidden="true"><rect x="9.5" y="10.5" width="9" height="7" rx="1.5"/>'
       '<circle cx="4" cy="4.5" r="2.4"/><circle cx="24" cy="4.5" r="2.4"/><circle cx="4" cy="23.5" r="2.4"/>'
       '<circle cx="24" cy="23.5" r="2.4"/><path d="M5.8 6.3l3.7 4.2M22.2 6.3l-3.7 4.2M5.8 21.7l3.7-4.2M22.2 21.7l-3.7-4.2"/></svg>')
BAR = ('\n  <div class="fbar" id="fbar" hidden><span class="fi">' + HUB + '</span>'
       '<div class="fl"><span class="k" id="fb-k"></span><b id="fb-b"></b></div>'
       '<div class="fm" id="fb-m"></div>'
       '<button class="btn" id="fb-clear" aria-label="Clear the selected product" hidden>'
       '<svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" '
       'stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/></svg>Clear</button></div>')
swap('<main class="canvas" id="canvas">', '<main class="canvas" id="canvas">' + BAR)

# ---------------------------------------------------------------- script: constants and helpers
swap('const COLW=370,ROWH=150,NW=230,NH=66,TOP=80,RAD=14;',
     'let COLW=370,ROWH=150,NW=230,NH=66,TOP=80;const RAD=14;\n'
     '/* focus view: with FOCUS_AT or more connections on the canvas, only the connections of the product\n'
     '   you hover or click are drawn; every box says how many it has, and the total still counts them all */\n'
     'const FOCUS_AT=10;')

swap('const conns=()=>C.filter(c=>has(c.a)&&has(c.b));',
     r'''const conns=()=>C.filter(c=>has(c.a)&&has(c.b));
let fsel=null,fhov=null,fT=0,dwellT=0;
const fv=()=>!!play()&&conns().length>=FOCUS_AT;
const fcur=()=>fv()?(fhov||fsel):null;
const linksOf=id=>conns().filter(c=>c.a===id||c.b===id);
const otherEnd=(c,id)=>c.a===id?c.b:c.a;
const count=(n,w)=>(n?n:'No')+' '+w+(n===1?'':'s');
/* focus view boxes are taller (they carry the count) and the rows sit closer, since few lines run between them at once */
function setLayout(){const f=fv();NH=f?86:66;ROWH=f?130:150;}''')

# ---------------------------------------------------------------- focus view routing (the original router is untouched)
STAR = r"""
/* ---------- focus view routing ----------
   every line leaves the focused product: a neighbor in the same row or column gets a straight line;
   anything else runs through the gap beside the product (left or right), then along the gap between rows,
   and the lanes and ports are ordered so that no two of the product's lines cross */
function starGeometry(fid){
  const [cf,rf]=pos(fid),o=at(P[fid]),ps=prods(),LANE=10,OFF=12,midY=o.y+NH/2,routes=[];
  const lastRow=Math.max(...ps.map(p=>pos(p.id)[1])),lastCol=Math.max(...ps.map(p=>pos(p.id)[0]));
  for(const c of linksOf(fid)){const t=otherEnd(c,fid),[ct,rt]=pos(t),T=at(P[t]),g={c,t,ct,rt,T};
    if(rt===rf&&Math.abs(ct-cf)===1){g.k='h1';g.side=ct>cf?'R':'L';}
    else if(ct===cf&&Math.abs(rt-rf)===1)g.k='v1';
    else{g.side=ct>cf?'R':ct<cf?'L':(cf===lastCol&&cf>0?'L':'R');
      if(ct===cf){g.k='in';g.ey=T.y+NH/2;}
      else if(Math.abs(ct-cf)===1){g.k='out';g.ey=T.y+NH/2;}
      else{g.k='ch';g.ch=rt>rf?rt:rt<rf?rt+1:(rf===lastRow&&rf>0?rf:rf+1);g.rise=g.ch===rt+1;g.dist=Math.abs(ct-cf);}}
    routes.push(g);}
  /* in a gap between rows: lines that rise into a box sit above lines that drop into one */
  const chans={};for(const g of routes)if(g.k==='ch')(chans[g.side+g.ch]=chans[g.side+g.ch]||[]).push(g);
  for(const arr of Object.values(chans)){arr.sort((a,b)=>a.rise!==b.rise?(a.rise?-1:1):a.rise?a.dist-b.dist:b.dist-a.dist);
    arr.forEach((g,i)=>{g.ey=rowChan(g.ch)+(i-(arr.length-1)/2)*LANE;});}
  for(const side of ['R','L']){const s=side==='R'?1:-1,x0=colChan(side==='R'?cf+1:cf),edge=side==='R'?o.x+NW:o.x;
    const S=routes.filter(g=>g.side===side),h1=S.find(g=>g.k==='h1'),tr=S.filter(g=>g.k!=='h1');
    const order=grp=>[...grp.filter(g=>g.k==='in').sort((a,b)=>Math.abs(a.ey-midY)-Math.abs(b.ey-midY)),
                      ...grp.filter(g=>g.k!=='in').sort((a,b)=>Math.abs(b.ey-midY)-Math.abs(a.ey-midY))];
    const up=order(tr.filter(g=>g.ey<midY)),dn=order(tr.filter(g=>g.ey>=midY));
    for(const grp of [up,dn])grp.forEach((g,i)=>{g.lx=x0+s*(i-(grp.length-1)/2)*LANE;});
    /* ports top to bottom: rising lines (innermost lane highest), the straight neighbor, falling lines (innermost lowest) */
    const portOrder=[...up,...(h1?[h1]:[]),...[...dn].reverse()];
    portOrder.forEach((g,i)=>{g.py=o.y+NH*(.2+.6*(i+1)/(portOrder.length+1));g.px=edge;});}
  return routes.map(g=>{let pts;
    if(g.k==='v1'){const x=o.x+NW/2;pts=g.rt>rf?[{x,y:o.y+NH},{x,y:g.T.y}]:[{x,y:o.y},{x,y:g.T.y+NH}];}
    else if(g.k==='h1')pts=[{x:g.px,y:g.py},{x:g.side==='R'?g.T.x:g.T.x+NW,y:g.py}];
    else{pts=[{x:g.px,y:g.py},{x:g.lx,y:g.py},{x:g.lx,y:g.ey}];
      if(g.k==='out')pts.push({x:g.side==='R'?g.T.x:g.T.x+NW,y:g.ey});
      else if(g.k==='in')pts.push({x:g.side==='R'?g.T.x+NW:g.T.x,y:g.ey});
      else{const ex=g.T.x+NW/2+(g.rise?-OFF:OFF);pts.push({x:ex,y:g.ey},{x:ex,y:g.rise?g.T.y+NH:g.T.y});}}
    return{c:g.c,r:g.k,d:pts.length===2?`M${pts[0].x},${pts[0].y} L${pts[1].x},${pts[1].y}`:rounded(pts,8),se:[fid,g.t]};});
}
/* focus view: each i dot sits on a stretch of its own line, near the product it leads to, away from the other lines */
function placeDots(paths){const ps=prods(),near=(q,m)=>ps.some(p=>{const o=at(p);return q.x>o.x-m&&q.x<o.x+NW+m&&q.y>o.y-m&&q.y<o.y+NH+m;});
  const S=paths.map(p=>{const L=p.getTotalLength(),pts=[];for(let s=0;s<=L;s+=4)pts.push(p.getPointAtLength(s));return{p,L,pts};}),dots=[];
  return S.map((a,i)=>{let best=null;
    for(let j=0;j<a.pts.length;j++){const q=a.pts[j],t=j*4/a.L,tight=near(q,28);if(t<.2||(tight&&near(q,16))||dots.some(d=>Math.hypot(d.x-q.x,d.y-q.y)<34))continue;
      let crowd=0;for(let k=0;k<S.length;k++)if(k!==i&&S[k].pts.some(r=>Math.abs(r.x-q.x)<15&&Math.abs(r.y-q.y)<15))crowd++;
      const sc=crowd*1000+(tight?300:0)+(1-t)*100;if(!best||sc<best.sc)best={sc,q};}
    const m=best?best.q:a.p.getPointAtLength(a.L/2);dots.push(m);return m;});}
"""
swap('/* ---------- render ---------- */', STAR + '/* ---------- render ---------- */')

# ---------------------------------------------------------------- render, drawEdges, fit
RENDER = r'''function render(){
  setLayout();
  const stage=$('stage'),ps=prods(),F=fv();
  stage.querySelectorAll('.node').forEach(e=>e.remove());
  for(const p of ps){const o=at(p),n=document.createElement('div'),k=F?linksOf(p.id).length:0;n.className='node'+(F?' fv':'')+(shown.has(p.id)?'':' enter');n.dataset.p=p.id;n.tabIndex=0;n.setAttribute('role','button');
    n.setAttribute('aria-label',p.name+(F?', '+count(k,'connection'):'')+': see its services');n.style.left=o.x+'px';n.style.top=o.y+'px';n.style.height=NH+'px';
    n.innerHTML=F?`<span class="nn">${p.icon==='spark'?I.spark:''}<span>${esc(p.name)}</span></span><span class="cn">${count(k,'connection')}</span>`:(p.icon==='spark'?I.spark:'')+'<span>'+esc(p.name)+'</span>';
    hook(n,'p',p.id);stage.appendChild(n);}
  shown=new Set(ps.map(p=>p.id));
  const pl=play();$('picker').hidden=!!pl;$('save').hidden=!pl;$('choose').hidden=!!pl;$('playname').hidden=!pl;$('change-play').hidden=!pl;
  $('play-label').textContent=pl?pl.label:'';
  drawEdges();markNodes();barUI();
  fit();totalsUI();hintUI();
  if(card&&!(card.k==='p'?has(card.id):shownC.has(card.id)))hideCard(true);else if(card){applyHot();setTimeout(placeCard,380);}
  save();
}
/* the lines: every connection, as today, or in focus view only the connections of the product hovered or clicked */
function drawEdges(){
  const stage=$('stage'),svg=$('edges'),ps=prods(),fid=fcur(),first=stage.querySelector('.node');
  stage.querySelectorAll('.ib').forEach(e=>e.remove());svg.innerHTML='<defs><marker id="arr" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#EB1000"/></marker></defs>';
  const F=fv(),geo=F?(fid?starGeometry(fid):[]):geometry(),nowC=new Set(geo.map(g=>g.c.id)),dots=[];
  const inNode=q=>ps.some(p=>{const o=at(p);return q.x>o.x-16&&q.x<o.x+NW+16&&q.y>o.y-16&&q.y<o.y+NH+16;});
  const paths=geo.map(g=>{const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',g.d);path.setAttribute('class','edge');path.dataset.c=g.c.id;path.dataset.s=g.se[0];path.dataset.e=g.se[1];svg.appendChild(path);return path;});
  const fdots=F?placeDots(paths):null;
  geo.forEach((g,gi)=>{const path=paths[gi];
    const len=path.getTotalLength();let mid=null;
    if(F)mid=fdots[gi];
    else{for(const t of [.5,.42,.58,.34,.66,.26,.74,.18,.82]){const q=path.getPointAtLength(len*t);if(!inNode(q)&&dots.every(d=>Math.hypot(d.x-q.x,d.y-q.y)>32)){mid=q;break;}}
    if(!mid)mid=path.getPointAtLength(len/2);dots.push(mid);}
    if(!shownC.has(g.c.id)){path.style.strokeDasharray=len;path.style.strokeDashoffset=len;requestAnimationFrame(()=>requestAnimationFrame(()=>{path.style.strokeDashoffset=0;}));}
    const b=document.createElement('button');b.className='ib'+(shownC.has(g.c.id)?'':' enter');b.textContent='i';b.dataset.c=g.c.id;
    b.setAttribute('aria-label','Services that connect '+P[g.c.a].name+' and '+P[g.c.b].name);b.style.left=(mid.x-14)+'px';b.style.top=(mid.y-14)+'px';
    hook(b,'c',g.c.id);stage.insertBefore(b,first);
  });
  shownC=nowC;
}
/* focus view: the focused product and its connections are marked; the bar names them */
function markNodes(){const id=fcur(),lk=new Set(id?linksOf(id).map(c=>otherEnd(c,id)):[]);
  document.querySelectorAll('.node').forEach(n=>{const p=n.dataset.p;n.classList.toggle('fx',p===id);n.classList.toggle('lk',lk.has(p));});}
function barUI(){const F=fv();$('fbar').hidden=!F;if(!F)return;
  const id=fcur(),n=conns().length;
  if(!id){$('fb-k').textContent='On this canvas';$('fb-b').textContent=count(n,'connection');
    $('fb-m').innerHTML=`<span>Hover a product to see its connections; click it to keep them showing. The total includes the services on all ${n}.</span>`;}
  else{const L=linksOf(id).map(c=>[c,otherEnd(c,id)]).sort((x,y)=>pos(x[1])[0]-pos(y[1])[0]||pos(x[1])[1]-pos(y[1])[1]);
    $('fb-k').textContent=count(L.length,'connection');$('fb-b').textContent=P[id].name;
    $('fb-m').innerHTML=L.length?'<span>connects to</span>'+L.map(([c,o])=>`<span class="chip" data-c="${c.id}">${esc(P[o].name)}</span>`).join(''):'<span>No documented connection with the other products on this canvas.</span>';}
  $('fb-clear').hidden=!fsel;}
function refocus(){drawEdges();markNodes();barUI();
  if(card&&card.k==='c'&&!shownC.has(card.id))hideCard(true);else if(card){applyHot();placeCard();}}
'''
block('function render(){', 'function fit(){', RENDER)

FIT = r'''function fit(){
  const cv=$('canvas'),ps=prods(),F=fv();if(!ps.length)return;
  const xs=ps.map(p=>at(p).x),ys=ps.map(p=>at(p).y);
  let minX=Math.min(...xs),maxX=Math.max(...xs)+NW,minY=Math.min(...ys),maxY=Math.max(...ys)+NH;
  /* focus view sizes the stage for every product's lines, so it never jumps as the focus moves */
  const bb=F?focusBox():$('edges').querySelectorAll('path.edge').length?$('edges').getBBox():null;
  if(bb){minX=Math.min(minX,bb.x-16);maxX=Math.max(maxX,bb.x+bb.width+16);minY=Math.min(minY,bb.y-16);maxY=Math.max(maxY,bb.y+bb.height+16);}
  const W=maxX-minX,H=maxY-minY,cw=cv.clientWidth;let s,ty;
  if(F){/* focus view: below the bar, and clear of Save and continue */const top0=$('fbar').offsetHeight+12,avail=cv.clientHeight-top0-84;
    s=Math.min(1,(cw-80)/W,avail/H);ty=top0+(avail-H*s)/2-minY*s;}
  else{const ch=cv.clientHeight-64;s=Math.min(1,(cw-80)/W,(ch-50)/H);ty=(ch-H*s)/2-minY*s+8;}
  const tx=(cw-W*s)/2-minX*s;
  $('stage').style.transform=`translate(${tx}px,${ty}px) scale(${s})`;
}
function focusBox(){const svg=$('edges'),tmp=[];
  for(const p of prods())for(const g of starGeometry(p.id)){const e=document.createElementNS('http://www.w3.org/2000/svg','path');e.setAttribute('d',g.d);svg.appendChild(e);tmp.push(e);}
  if(!tmp.length)return null;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  for(const e of tmp){const b=e.getBBox();x0=Math.min(x0,b.x);y0=Math.min(y0,b.y);x1=Math.max(x1,b.x+b.width);y1=Math.max(y1,b.y+b.height);e.remove();}
  return{x:x0,y:y0,width:x1-x0,height:y1-y0};}
'''
block('function fit(){', 'function totalsUI(){', FIT)

# ---------------------------------------------------------------- hover and click
HOOK = r'''function hook(el,k,id){
  el.addEventListener('mouseenter',()=>{
    if(fv()){clearTimeout(fT);if(k==='p'){clearTimeout(hideT);intend(id);return;}}
    if(pinned)return;clearTimeout(hideT);showCard(k,id,el);});
  /* while a product is selected, another product takes the focus only when the pointer rests on it */
  el.addEventListener('mousemove',()=>{if(k==='p'&&fv()&&fsel&&fsel!==id&&fhov!==id)intend(id);});
  el.addEventListener('mouseleave',()=>{
    if(fv()){clearTimeout(dwellT);leaveSoon();}
    if(pinned)return;clearTimeout(hideT);hideT=setTimeout(()=>hideCard(),260);});
  el.addEventListener('click',e=>{e.stopPropagation();
    if(fv()&&k==='p'){clearTimeout(dwellT);fsel=fsel===id?null:id;fhov=fsel?null:id;refocus();if(!pinned){clearTimeout(hideT);showCard(k,id,el);}return;}
    if(fv()&&k==='c'&&fhov){fsel=fhov;fhov=null;refocus();}
    if(pinned&&card&&card.k===k&&card.id===id){hideCard(true);return;}pinned=true;showCard(k,id,el);});
  el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}});
}
function intend(id){clearTimeout(dwellT);
  const go=()=>{fhov=fsel===id?null:id;refocus();if(!pinned){clearTimeout(hideT);showCard('p',id,document.querySelector(`.node[data-p="${id}"]`));}};
  if(fsel===id||fhov===id){go();return;}
  dwellT=setTimeout(go,fsel?260:90);}
function leaveSoon(){clearTimeout(fT);fT=setTimeout(()=>{if(fhov){fhov=null;refocus();}},300);}
'''
block('function hook(el,k,id){', 'function anchorEl(){', HOOK)

# ---------------------------------------------------------------- card placement
PLACE = r'''function placeCard(){const el=anchorEl(),box=$('card');if(!el||box.hidden)return;
  const cv=$('canvas').getBoundingClientRect(),F=fv(),w=box.offsetWidth,h=box.offsetHeight;let a=el.getBoundingClientRect();
  /* focus view: a card stays below the bar unless it is too tall to fit there */
  const top0=F&&h+20<=cv.height-$('fbar').offsetHeight?$('fbar').offsetHeight+10:10;
  if(card.k==='c'){const o=CBY[card.id],rs=[a,...[o.a,o.b].map(id=>document.querySelector(`.node[data-p="${id}"]`)).filter(Boolean).map(n=>n.getBoundingClientRect())];
    a={left:Math.min(...rs.map(r=>r.left)),right:Math.max(...rs.map(r=>r.right)),top:Math.min(...rs.map(r=>r.top)),bottom:Math.max(...rs.map(r=>r.bottom))};}
  if(F&&card.k==='p'){/* focus view: the product card goes where it covers the fewest of the product's own i dots and connected products */
    const keep=[[a,500],...[...document.querySelectorAll('.ib')].map(b=>[b.getBoundingClientRect(),60]),...[...document.querySelectorAll('.node.lk')].map(n=>[n.getBoundingClientRect(),3])];
    const ax=a.left-cv.left,ay=a.top-cv.top,near=[a.right-cv.left+14,ay-12];let best=null;
    for(const l0 of [near[0],ax-14-w,10,cv.width-w-10])for(const t0 of [near[1],top0,cv.height-h-10]){
      const l=Math.max(10,Math.min(cv.width-w-10,l0)),t=Math.max(top0,Math.min(cv.height-h-10,t0));
      const r={left:cv.left+l,top:cv.top+t,right:cv.left+l+w,bottom:cv.top+t+h};
      let s=Math.hypot(l-near[0],t-near[1])*.2;for(const [k,wt] of keep)s+=wt*ov(r,k);
      if(!best||s<best[0])best=[s,l,t];}
    box.style.left=best[1]+'px';box.style.top=best[2]+'px';return;}
  let left=a.right-cv.left+14;if(left+w>cv.width-10)left=a.left-cv.left-14-w;if(left<10)left=Math.max(10,Math.min(cv.width-w-10,a.left-cv.left));
  let top=a.top-cv.top-12;top=Math.max(top0,Math.min(top,cv.height-h-10));
  box.style.left=left+'px';box.style.top=top+'px';}
const ov=(r,k)=>Math.max(0,Math.min(r.right,k.right)-Math.max(r.left,k.left))*Math.max(0,Math.min(r.bottom,k.bottom)-Math.max(r.top,k.top));
'''
block('function placeCard(){', 'function hideCard(force){', PLACE)

# ---------------------------------------------------------------- card hover keeps the focus
swap("$('card').addEventListener('mouseenter',()=>clearTimeout(hideT));\n$('card').addEventListener('mouseleave',()=>{if(!pinned)hideT=setTimeout(()=>hideCard(),260);});",
     "$('card').addEventListener('mouseenter',()=>{clearTimeout(hideT);clearTimeout(fT);});\n"
     "$('card').addEventListener('mouseleave',()=>{if(fv())leaveSoon();if(!pinned)hideT=setTimeout(()=>hideCard(),260);});")
swap("  const t=e.target.closest('[data-t]');if(t){const l=t.dataset.t;",
     "  if(fv()&&fhov&&e.target.closest('[data-t],summary')){fsel=fhov;fhov=null;refocus();}\n  const t=e.target.closest('[data-t]');if(t){const l=t.dataset.t;")

# ---------------------------------------------------------------- new play and start over clear the focus
swap("st.play=b.dataset.play;st.ls={};moreOpen={};openMenu(false);render();}",
     "st.play=b.dataset.play;st.ls={};moreOpen={};fsel=null;fhov=null;openMenu(false);render();}")
swap("$('confirm').hidden=true;hideCard(true);st.play=null;st.ls={};moreOpen={};render();",
     "$('confirm').hidden=true;hideCard(true);st.play=null;st.ls={};moreOpen={};fsel=null;fhov=null;render();")

# ---------------------------------------------------------------- Escape and an empty-canvas click clear the focus
swap("document.addEventListener('keydown',e=>{if(e.key==='Escape'){openMenu(false);hideCard(true);$('confirm').hidden=true;}});",
     "document.addEventListener('keydown',e=>{if(e.key==='Escape'){openMenu(false);const had=!!card;hideCard(true);if(!had&&(fsel||fhov)){fsel=null;fhov=null;refocus();}$('confirm').hidden=true;}});\n"
     "/* focus view: a click on the empty canvas clears the selected product (a pinned card closes first) */\n"
     "$('canvas').addEventListener('click',e=>{if(!fv()||pinned||e.target.closest('.node,.ib,.card,.fbar,.picker,.save'))return;hideCard(true);if(fsel||fhov){fsel=null;fhov=null;refocus();}});\n"
     "$('fbar').addEventListener('click',e=>e.stopPropagation());\n"
     "$('fbar').addEventListener('mouseenter',()=>clearTimeout(fT));\n"
     "$('fbar').addEventListener('mouseleave',()=>{if(fv())leaveSoon();chipHot(null);});\n"
     "$('fb-clear').addEventListener('click',e=>{e.stopPropagation();fsel=null;fhov=null;hideCard(true);refocus();});\n"
     "/* hovering a name in the bar lights up its line and i dot */\n"
     "function chipHot(cid){document.querySelectorAll('.cx').forEach(x=>x.classList.remove('cx'));if(cid)document.querySelectorAll(`.edge[data-c=\"${cid}\"],.ib[data-c=\"${cid}\"]`).forEach(x=>x.classList.add('cx'));}\n"
     "$('fb-m').addEventListener('mouseover',e=>{const c=e.target.closest('.chip');chipHot(c?c.dataset.c:null);});")

# ---------------------------------------------------------------- mockup title
swap('<title>Build: partner services canvas</title>', '<title>Build: focus view mockup</title>')

(HERE / 'index.html').write_text(out, encoding='utf-8')
print('wrote', HERE / 'index.html', len(out), 'bytes')
