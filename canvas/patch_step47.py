"""Step 47 on the Build canvas, the canvas pass (Nov 5 2026, Adam: "yes, fix all 45"; items from sow/audit_2026-11-05/FINDINGS.md;
the canvas data is data_step47_canvas.py, the SOW-step pass is patch_step47_sow.py):
- 2: removing an outside system that is selected in focus view clears the selection, so render() no longer throws, the
  total follows and the removal is saved; a selection that left the canvas is dropped before every render
- 3: phones and tablets: below 900 px the stage never shrinks under 0.7, so names stay readable; what doesn't fit scrolls
  inside the canvas (a scroller with a sizer the size of the scaled stage), starting centered on the play's own products;
  each lightning bolt takes taps 44 px across; below 600 px the canvas is shorter and the fee box shows its one-line total.
  At 900 px and wider nothing changes: the scroller sits exactly where the stage's canvas was and never scrolls
- 21: removing the last product on Create your own play takes the outside systems that only it connected with it (their line
  choices are kept), shows Add your first product again and hides Continue; the hand-over needs an Adobe product
- 22: the outside-system menu says "add one first" when any of several products will do; the card names only the products
  on the canvas it connects to, says "each of its lines" when it has more than one, names the products still to add on Create
  your own play, and never reads "It connects to ."
- 26: in focus view the first click on a product draws its lines and fills the bar; a second click, or Services in the bar,
  opens its card. Every card is placed where it covers neither its box or bolt nor the selected product's bolts: beside the
  anchor, above or below it, in a corner or at the bottom; any overlap of another box counts as the whole box; when no spot
  is clean it docks full width at the bottom (or top) and a scrolling canvas scrolls so the anchor stays in view
- 27: tags in the Add outside system menu wrap inside the menu, and under 540 px they sit below the name
- 25: a shorter canvas minimum (360 px) and a narrower fee box (300 px), so Continue stays on a 1280 x 800 screen
- 28: outside boxes show their short canvas name; the menu and the card keep the full name (the title)
- 38: a product box whose services were all removed says "No services", not "Services on its connections", unless its
  services really sit on its connections
- 39: in focus view with no product selected there is no lightning bolt hint (none is drawn); the hint follows the selection
- 43: a bolt keeps clear of the Recommended tag that hangs below a box
Run once on the step 46 template (after patch_step47_sow.py), then build.py and ../build_site.py.

    python3 sow/canvas/patch_step47.py
"""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
path = os.path.join(HERE, 'template.html')
html = open(path, encoding='utf-8').read()
assert 'id="scroller"' not in html and 'def:defOf(l)' in html, 'run this once on the step 46 template, after patch_step47_sow.py'
BRACES = html.count('{') - html.count('}')


def rep(old, new):
    global html
    assert html.count(old) == 1, (html.count(old), old[:100])
    html = html.replace(old, new)


def rep_span(start, end, new):
    """replace from the unique start anchor through the unique end anchor (inclusive)"""
    global html
    assert html.count(start) == 1 and html.count(end) == 1, (start[:60], end[:60])
    i = html.index(start)
    j = html.index(end, i) + len(end)
    html = html[:i] + new + html[j:]


# ---------- CSS ----------
# 25: Continue on screen at 1280 x 800
rep('.total{margin-left:auto;border:1px solid var(--line);border-top:6px solid var(--red);border-radius:8px;padding:5px 18px 7px;min-width:390px;max-width:460px}',
    '.total{margin-left:auto;border:1px solid var(--line);border-top:6px solid var(--red);border-radius:8px;padding:5px 18px 7px;min-width:300px;max-width:460px}')
rep('.canvas{position:relative;flex:1;min-height:560px;background:var(--soft);overflow:hidden}',
    '.canvas{position:relative;flex:1;min-height:360px;background:var(--soft);overflow:hidden}\n'
    '/* step 47: the stage sits in a scroller exactly over the canvas; it scrolls only on phones and tablets, where the stage keeps a readable size (pan) */\n'
    '.scroller{position:absolute;inset:0;overflow:hidden}\n'
    '.sizer{position:absolute;left:0;top:0;width:0;height:0;pointer-events:none}\n'
    '.canvas.pan .scroller{overflow:auto;touch-action:pan-x pan-y;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}\n'
    '.canvas.pan .stage,.canvas.pan .stage>svg{width:0;height:0}')
# 27: menu tags wrap inside the menu
rep('.it2{display:grid;grid-template-columns:1fr auto;', '.it2{display:grid;grid-template-columns:minmax(0,1fr) auto;')
rep('.ctag{font-size:13.5px;font-weight:700;border:1.5px solid var(--ink);color:var(--ink);background:#fff;border-radius:3px;padding:0 7px;line-height:21px;white-space:nowrap}',
    '.ctag{font-size:13.5px;font-weight:700;border:1.5px solid var(--ink);color:var(--ink);background:#fff;border-radius:3px;padding:0 7px;line-height:21px;white-space:normal;max-width:100%}\n'
    '#out-menu .it2 .ctag{max-width:260px}')
rep('@media (max-width:360px){#out-menu .it2{grid-template-columns:1fr}#out-menu .it2 .nm{white-space:nowrap}#out-menu .it2 .ctag{justify-self:start;margin-top:2px}}',
    '@media (max-width:540px){#out-menu .it2{grid-template-columns:minmax(0,1fr)}#out-menu .it2 .ctag{justify-self:start;margin-top:2px;max-width:100%}}\n'
    '/* step 47: phones and tablets: every lightning bolt takes taps 44 px across, whatever the stage scale (--s) */\n'
    '@media (max-width:899px){.ib::before{content:\'\';position:absolute;left:50%;top:50%;width:calc(44px / var(--s,1));height:calc(44px / var(--s,1));transform:translate(-50%,-50%);border-radius:50%}}\n'
    '/* phones: a shorter canvas, and the fee box shows its one-line total (with the rate prompt while there is no rate) */\n'
    '@media (max-width:599px){.canvas{min-height:300px}.total{display:flex;flex-wrap:wrap;align-items:baseline;column-gap:10px;padding:3px 14px 5px}.total .k,.total #t-note,.total .lgd{display:none}.total .big{font-size:26px;line-height:32px}.total:not(.blank) #t-sub{display:none}}\n'
    '/* phones: the focus bar keeps to a few rows: its names scroll sideways in one row, and its buttons are smaller */\n'
    '@media (max-width:599px){.fbar .fl{flex:1;min-width:0}.fbar .btn{padding:5px 10px}.fbar .fm{flex-wrap:nowrap;overflow-x:auto;padding-bottom:3px}.fbar .fm>span:first-child{flex:none}}\n'
    '/* step 47: a card with no clean spot docks across the canvas */\n'
    '.card.dock{width:auto}')
# 26: the Services button in the focus bar
rep('<button class="btn" id="fb-clear" aria-label="Clear the selected product" hidden>',
    '<button class="btn" id="fb-svc" hidden>Services</button><button class="btn" id="fb-clear" aria-label="Clear the selected product" hidden>')
# 3: the scroller and its sizer around the stage
rep('  <div class="stage" id="stage"><svg id="edges" width="1710" height="640" aria-hidden="true"></svg></div>',
    '  <div class="scroller" id="scroller"><div class="sizer" id="sizer"></div><div class="stage" id="stage"><svg id="edges" width="1710" height="640" aria-hidden="true"></svg></div></div>')

# ---------- script ----------
# 2: a selection that left the canvas is never used
rep('const fcur=()=>fv()?fsel:null;', 'const fcur=()=>fv()&&fsel&&has(fsel)?fsel:null;')
rep("function render(){\n  document.body.classList.toggle('picking',!play());",
    "function render(){\n  if(fsel&&!has(fsel))fsel=null;\n  document.body.classList.toggle('picking',!play());")
rep("function removeOutside(id){st.out=(st.out||[]).filter(x=>x!==id);hideCard(true);render();",
    "function removeOutside(id){st.out=(st.out||[]).filter(x=>x!==id);if(fsel===id)fsel=null;hideCard(true);render();")
# 21: removing the last product
rep("function removeProduct(id){st.on=st.on.filter(x=>x!==id);if(fsel===id)fsel=null;",
    "function removeProduct(id){st.on=st.on.filter(x=>x!==id);\n"
    "  /* step 47: an outside system goes with the last product it connects to (its line choices in st.ls stay, for when both come back) */\n"
    "  st.out=(st.out||[]).filter(o=>!P[o].outside||CAT.products.some(q=>!q.outside&&st.on.includes(q.id)&&linked(o,q.id)));if(fsel===id||(fsel&&!has(fsel)))fsel=null;")
rep("const pl=play(),own=!!pl&&!!pl.custom;$('picker').hidden=!!pl;$('save').hidden=!ps.length;",
    "const pl=play(),own=!!pl&&!!pl.custom,nP=ps.filter(p=>!p.outside).length;$('picker').hidden=!!pl;$('save').hidden=own?!nP:!ps.length;")
rep("$('empty').hidden=!(own&&!ps.length);", "$('empty').hidden=!(own&&!nP);")
rep("function handoff(step){if(!prods().length){", "function handoff(step){if(!prods().some(p=>!p.outside)){")
# 22: the menu and the card say what a system really connects to
rep('<span class="ctag">Connects to ${esc(andList(need(id).map(short)))}: add it first</span>',
    '<span class="ctag">Connects to ${esc(andList(need(id).map(short)))}: add ${need(id).length>1?\'one\':\'it\'} first</span>')
rep('const item=id=>{const t=to(id),nm=`<span class="nm">${P[id].icon&&I[P[id].icon]?I[P[id].icon]:\'\'}${esc(P[id].name)}',
    'const item=id=>{const t=to(id),nm=`<span class="nm">${P[id].icon&&I[P[id].icon]?I[P[id].icon]:\'\'}${esc(P[id].title||P[id].name)}')
rep("function outCardHTML(id){const o=P[id],to=play().products.filter(q=>linked(id,q)).map(q=>P[q].name);\n"
    "  return `<div class=\"k\"><span>Outside system</span><button class=\"close\" data-close aria-label=\"Close\">${I.x}</button></div><h4>${o.icon&&I[o.icon]?I[o.icon]:''}${esc(o.name)}</h4>`",
    "function outCardHTML(id){const o=P[id],pl=play(),nm=q=>P[q].name,every=pl.products.filter(q=>linked(id,q)),\n"
    "    on=CAT.products.filter(q=>!q.outside&&linked(id,q.id)&&has(q.id)).map(q=>q.id),later=pl.custom?every.filter(q=>!has(q)):[];\n"
    "  /* step 47: only the products on the canvas it connects to; the ones still to add on Create your own play; never an empty list */\n"
    "  const con=on.length?`It connects to ${andList(on.map(nm))}. The lightning bolt on ${on.length>1?'each of its lines':'its line'} says how, what your client does first, and the services.`+(later.length?` Add ${andList(later.map(nm))} to connect it there too.`:'')\n"
    "    :`It connects to ${andList(every.map(nm))}. Add ${every.length>1?'one of them':'it'} to the canvas to draw its line.`;\n"
    "  return `<div class=\"k\"><span>Outside system</span><button class=\"close\" data-close aria-label=\"Close\">${I.x}</button></div><h4>${o.icon&&I[o.icon]?I[o.icon]:''}${esc(o.title||o.name)}</h4>`")
rep("   `<p class=\"how\">It connects to ${esc(andList(to))}. The lightning bolt on its line says how, what your client does first, and the services.</p>`+",
    "   `<p class=\"how\">${esc(con)}</p>`+")
# 38: no services left on a box
rep("e.textContent=k?count(k,'service'):'Services on its connections';",
    "e.textContent=k?count(k,'service'):(all(o).length?count(0,'service'):'Services on its connections');")
# 39: no bolt hint while none is drawn
rep("$('hint').innerHTML=pl&&conns().length?`",
    "$('hint').innerHTML=pl&&conns().length&&!(fv()&&!fcur())?`")
rep("function refocus(){drawEdges();markNodes();barUI();", "function refocus(){drawEdges();markNodes();barUI();hintUI();")
# 3: on a scrolling canvas, the product just selected scrolls to the middle
rep("  if(card&&card.k==='c'&&!shownC.has(card.id))hideCard(true);else if(card){applyHot();placeCard();}}\nlet barH=0",
    "  if($('canvas').classList.contains('pan')&&fcur()){const n=document.querySelector(`.node[data-p=\"${fcur()}\"]`),sc=$('scroller');if(n){const r=n.getBoundingClientRect(),c=sc.getBoundingClientRect();sc.scrollLeft+=r.left+r.width/2-(c.left+c.width/2);}}\n"
    "  if(card&&card.k==='c'&&!shownC.has(card.id))hideCard(true);else if(card){applyHot();placeCard();}}\nlet barH=0")
# 43: bolts keep clear of the Recommended tag below a box
rep("near=(q,m)=>ps.some(p=>{const o=at(p);return q.x>o.x-m&&q.x<o.x+NW+m&&q.y>o.y-m&&q.y<o.y+NH+m;});",
    "near=(q,m)=>ps.some(p=>{const o=at(p);return q.x>o.x-m&&q.x<o.x+NW+m&&q.y>o.y-m&&q.y<o.y+NH+(recd(p.id)?14:0)+m;});")
# 26: focus view: the first click selects, the second (or Services in the bar) opens the card
rep("    if(fv()&&k==='p'){fsel=fsel===id?null:id;refocus();pinned=!!fsel;if(fsel)showCard(k,id,el);else hideCard(true);return;}",
    "    if(fv()&&k==='p'){if(fcur()!==id){fsel=id;hideCard(true);refocus();return;}\n"
    "      if(card&&card.k==='p'&&card.id===id){hideCard(true);return;}pinned=true;showCard(k,id,el);return;}")
rep("  $('fb-clear').hidden=!fsel;}",
    "  $('fb-clear').hidden=!fsel;$('fb-svc').hidden=!id;if(id)$('fb-svc').textContent=P[id].outside?'How it connects':'Services';}")
rep("$('fb-clear').addEventListener('click',e=>{e.stopPropagation();fsel=null;hideCard(true);refocus();});",
    "$('fb-clear').addEventListener('click',e=>{e.stopPropagation();fsel=null;hideCard(true);refocus();});\n"
    "$('fb-svc').addEventListener('click',e=>{e.stopPropagation();const id=fcur();if(!id)return;if(card&&card.k==='p'&&card.id===id){hideCard(true);return;}pinned=true;showCard('p',id);});\n"
    "/* a card follows its anchor while the canvas scrolls on a phone or tablet */\n"
    "$('scroller').addEventListener('scroll',()=>{if(card)placeCard(true);},{passive:true});")
# 3: fit(): the floor on the scale, the scroll area and its starting place
rep("  const cv=$('canvas'),ps=prods(),F=fv();if(!ps.length)return;",
    "  const cv=$('canvas'),ps=prods(),F=fv();if(!ps.length){cv.classList.remove('pan');panKey='';return;}")
rep("  const tx=mw+(cw-W*s)/2-minX*s;\n  $('stage').style.transform=`translate(${tx}px,${ty}px) scale(${s})`;\n}",
    "  let tx=mw+(cw-W*s)/2-minX*s;\n"
    "  /* step 47: phones and tablets: under 900 px the stage never shrinks below MIN_S, so names stay readable and bolts tappable;\n"
    "     what doesn't fit scrolls inside the canvas, starting centered on the play's own products */\n"
    "  const pan=document.documentElement.clientWidth<900&&s<MIN_S;cv.classList.toggle('pan',pan);\n"
    "  if(pan){s=MIN_S;const top0=F?$('fbar').offsetHeight+12:8,bot=F?84:72,ah=cv.clientHeight-top0-bot;\n"
    "    tx=W*s+80<=cw?(cw-W*s)/2-minX*s:40-minX*s;ty=H*s<=ah?top0+(ah-H*s)/2-minY*s:top0-minY*s;\n"
    "    $('sizer').style.width=Math.ceil(tx+maxX*s+40)+'px';$('sizer').style.height=Math.ceil(ty+maxY*s+bot)+'px';\n"
    "    const k=st.play+'|'+ps.map(p=>p.id).join()+'|'+cv.clientWidth+'|'+F;\n"
    "    if(k!==panKey){panKey=k;const own=ps.filter(p=>!p.outside),xs2=(own.length?own:ps).map(p=>at(p).x),mid=tx+s*(Math.min(...xs2)+Math.max(...xs2)+NW)/2;\n"
    "      $('scroller').scrollLeft=Math.max(0,mid-cw/2);$('scroller').scrollTop=0;}}\n"
    "  else{panKey='';$('sizer').style.width=$('sizer').style.height='0';$('scroller').scrollLeft=$('scroller').scrollTop=0;}\n"
    "  $('stage').style.transform=`translate(${tx}px,${ty}px) scale(${s})`;$('stage').style.setProperty('--s',s);\n}")
rep("let barH=0;\nfunction fit(){", "let barH=0,panKey='';const MIN_S=.7;\nfunction fit(){")

# 26: card placement
rep_span("function placeCard(){const el=anchorEl(),box=$('card');if(!el||box.hidden)return;",
         "  box.style.left=left+'px';box.style.top=top+'px';}",
         r"""/* step 47: a card never covers the box or lightning bolt it describes, or the bolts of the selected product. It tries beside the
   anchor, above and below it, the corners and the bottom of the canvas; any overlap with another box counts as covering the whole box,
   so no box is sliced in half. With no clean spot it docks full width at the bottom (or the top, when the anchor sits low), and a
   scrolling canvas scrolls so the anchor stays in view */
function placeCard(noScroll){const el=anchorEl(),box=$('card');if(!el||box.hidden)return;
  box.classList.remove('dock');box.style.width='';box.style.maxHeight='';$('sizer').style.paddingBottom='';
  const cvE=$('canvas'),cv=cvE.getBoundingClientRect(),F=fv(),top0=F?$('fbar').offsetHeight+10:10,w=box.offsetWidth,h=Math.min(box.offsetHeight,cv.height-top0-10);
  const R=e=>{const r=e.getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom};},grow=(r,m)=>({left:r.left-m,right:r.right+m,top:r.top-m,bottom:r.bottom+m});
  const a=R(el),sel=F?fcur():card.k==='p'?card.id:null,bolts=[...document.querySelectorAll('.ib')];
  /* must stay clear: the anchor, and the bolts of the selected product (in focus view, every bolt drawn is one) */
  /* (on a scrolling canvas only the bolts in view count) */
  const seen=b=>{const r=R(b);return r.right>cv.left&&r.left<cv.right&&r.bottom>cv.top+top0-10&&r.top<cv.bottom;};
  const hb=bolts.filter(b=>b!==el&&seen(b)&&(F||(sel&&[CBY[b.dataset.c].a,CBY[b.dataset.c].b].includes(sel)))),hard=[a,...hb.map(R)];
  if(F&&sel&&card.k==='c'){const n=document.querySelector(`.node[data-p="${sel}"]`);if(n)hard.push(R(n));}
  /* best kept clear: the other boxes (the connection's two ends and the linked boxes most), the other bolts and the lines drawn */
  const ends=card.k==='c'?[CBY[card.id].a,CBY[card.id].b]:[];
  const soft=[...document.querySelectorAll('#stage .node')].filter(n=>n!==el).map(n=>[R(n),ends.includes(n.dataset.p)||n.classList.contains('lk')?3:1]);
  const others=bolts.filter(b=>b!==el&&!hb.includes(b)).map(R);
  const pts=[];document.querySelectorAll('.edge').forEach(e=>{const L=e.getTotalLength(),m=e.getScreenCTM();for(let s=0;s<=L;s+=8){const q=e.getPointAtLength(s);pts.push([m.a*q.x+m.c*q.y+m.e,m.b*q.x+m.d*q.y+m.f]);}});
  /* the spots, in order of preference: beside the anchor (and, for a connection, beside its two boxes), above and below it, the corners, the bottom */
  const ax=a.left-cv.left,ay=a.top-cv.top,aw=a.right-a.left,ah=a.bottom-a.top,spots=[];
  const spotsAt=h=>{const beside=r=>{const x=r.left-cv.left,y=r.top-cv.top,rw=r.right-r.left,rh=r.bottom-r.top;for(const l of [x+rw+14,x-14-w])for(const t of [y-12,y+rh/2-h/2,y+rh+12-h])spots.push([l,t]);};
  beside(a);
  if(card.k==='c'){const rs=[a,...ends.map(id=>document.querySelector(`.node[data-p="${id}"]`)).filter(Boolean).map(R)];
    beside({left:Math.min(...rs.map(r=>r.left)),right:Math.max(...rs.map(r=>r.right)),top:Math.min(...rs.map(r=>r.top)),bottom:Math.max(...rs.map(r=>r.bottom))});}
  for(const t of [ay-14-h,ay+ah+14])for(const l of [ax,ax+aw/2-w/2,ax+aw-w])spots.push([l,t]);
  spots.push([10,top0],[cv.width-w-10,top0],[10,cv.height-h-10],[cv.width-w-10,cv.height-h-10],[(cv.width-w)/2,cv.height-h-10]);};
  /* a tall card that finds no clean spot tries again capped shorter (it scrolls inside) */
  let best=null;
  for(const hh of [...new Set([h,Math.min(h,320),Math.min(h,220)])]){spots.length=0;spotsAt(hh);
  spots.forEach(([l0,t0],i)=>{const l=Math.max(10,Math.min(cv.width-w-10,l0)),t=Math.max(top0,Math.min(cv.height-hh-10,t0));
    const r={left:cv.left+l,top:cv.top+t,right:cv.left+l+w,bottom:cv.top+t+h};
    if(hard.some(k=>ov(r,grow(k,4))>0))return;
    let s=i*40+Math.hypot(l+w/2-(ax+aw/2),t+h/2-(ay+ah/2))*4;
    for(const [k,wt] of soft)if(ov(r,k)>0)s+=wt*(k.right-k.left)*(k.bottom-k.top);
    for(const k of others)s+=60*ov(r,k);
    for(const [x,y] of pts)if(x>r.left&&x<r.right&&y>r.top&&y<r.bottom)s+=400;
    if(!best||s<best[0])best=[s,l,t,hh];});if(best)break;}
  if(best){if(best[3]<h)box.style.maxHeight=best[3]+'px';box.style.left=best[1]+'px';box.style.top=best[2]+'px';return;}
  /* no clean spot: dock across the canvas, at the bottom unless the anchor sits in the lower half */
  box.classList.add('dock');const dh=Math.max(140,Math.round((cv.height-top0)/2-15));box.style.maxHeight=dh+'px';box.style.left='10px';box.style.width=(cv.width-20)+'px';
  /* on a scrolling canvas the scroll area grows by the docked card, so every bolt can be scrolled clear of it */
  const bh=box.offsetHeight,bottom=cv.height-bh-10,sc=$('scroller');if(cvE.classList.contains('pan'))$('sizer').style.paddingBottom=(bh+10)+'px';
  if(a.bottom>cv.top+bottom-6&&!noScroll&&cvE.classList.contains('pan')){const need=a.bottom-(cv.top+bottom)+20,can=sc.scrollHeight-sc.clientHeight-sc.scrollTop;
    if(can>=need){sc.scrollTop+=need;box.style.top=bottom+'px';return;}}
  const a2=R(el),hits=t=>{const r={left:cv.left,right:cv.right,top:cv.top+t,bottom:cv.top+t+bh};return ov(r,grow(a2,4))>0?1e9:[...document.querySelectorAll('.ib')].filter(b=>b!==el&&ov(r,R(b))>0).length;};
  box.style.top=(hits(top0)<hits(bottom)?top0:bottom)+'px';}""")

rep("function hideCard(force){if(pinned&&!force)return;pinned=false;card=null;$('card').hidden=true;applyHot();}",
    "function hideCard(force){if(pinned&&!force)return;pinned=false;card=null;$('card').hidden=true;$('sizer').style.paddingBottom='';applyHot();}")

# 26: the README says lightning bolts

assert html.count('{') - html.count('}') == BRACES, 'brace balance changed'
assert not re.search('[\u2013\u2014]', html)
open(path, 'w', encoding='utf-8').write(html)

readme = os.path.join(HERE, 'README.md')
t = open(readme, encoding='utf-8').read()
old = 'Clicking a product pins its card beside the box (on the side and at the height that cover the fewest of its lines and i dots), so the pointer can reach X, More services and Remove from canvas.'
assert t.count(old) == 1
t = t.replace(old, 'Since step 47 the first click on a product draws its lines and fills the bar; a second click, or Services in the bar, pins its card where it covers neither the box nor its lightning bolts (beside the box, above or below it, a corner or the bottom, docked full width when nothing is clean), so the pointer can reach X, More services and Remove from canvas.')
old2 = 'On Create your own play every i dot sits on its own line'
assert t.count(old2) == 1
t = t.replace(old2, 'On Create your own play every lightning bolt sits on its own line')
assert not re.search('[\u2013\u2014]', t)
open(readme, 'w', encoding='utf-8').write(t)
print('step 47 (canvas pass) applied: focus-view removal, phones and tablets, last product, outside wording, card placement, menu tags, Continue on screen, short outside names, counts, hint, Recommended tag')
