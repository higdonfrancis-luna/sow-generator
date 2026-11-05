"""Step 47 on the Build canvas, the card pass (Nov 5 2026): finishes audit item 26 (sow/audit_2026-11-05/FINDINGS.md) after
an independent check found the first pass only partly worked:
- a card always fits inside the canvas and the window, under the focus bar: when it is taller than the room it gets a max
  height and scrolls inside itself, so Remove from canvas stays reachable (before, a card taller than the room was placed as
  if it fit and ran off the bottom: Workfront's card ended at y=917 on a 900 px window)
- the card searches the whole visible canvas (a grid of spots plus the spots beside, above and below its anchor), not a
  handful of spots, and ranks them in order: covers neither its own box or bolt nor a bolt of the selected product; covers
  no box at all (any overlap of a box counts); keeps its full height; then near its anchor, off the lines, the other bolts
  and Continue. So on the AEM play at 1440 x 900 Edge Delivery's card goes to the empty right side instead of slicing
  Brand Visibility and Sites Optimizer
- the room a scrolling canvas grows for a card really adds to its scroll height (the sizer's padding counts in content-box), and
  the canvas keeps that room for a card until the card closes, so placing the card again as the canvas scrolls
  never snaps the scroll back
- it docks full width only when no spot clears its anchor and the selected product's bolts; the dock takes the side of the
  anchor with more room (a scrolling canvas first scrolls the anchor up), so it never covers its own anchor
- the leftover "i dot" comment says lightning bolt
Run once on the step 47 template (after patch_step47.py and patch_step47_content.py), then build.py and ../build_site.py.

    python3 sow/canvas/patch_step47_cards.py
"""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
path = os.path.join(HERE, 'template.html')
html = open(path, encoding='utf-8').read()
assert 'chipHot' in html and 'placeCard' in html and 'const vis=' not in html, 'run this once on the step 47 template'


def one(s):
    assert html.count(s) == 1, s[:90]
    return html.index(s)


BRACES = html.count('{') - html.count('}')

START = '/* step 47: a card never covers the box or lightning bolt it describes'
END = "  box.style.top=(hits(top0)<hits(bottom)?top0:bottom)+'px';}\n"
i, j = one(START), one(END) + len(END)
old = html[i:j]
assert old.count('function placeCard(') == 1 and 'spotsAt' in old and 'best[3]<h' in old

NEW = r"""/* step 47: a card always fits inside the canvas and the window, under the focus bar; taller than the room, it scrolls inside
   itself. It never covers the box or lightning bolt it describes, or a bolt of the selected product (in focus view every bolt
   drawn is one), and it prefers a spot that covers no box at all: any overlap of a box counts. It looks over the whole visible
   canvas, beside, above and below its anchor first, then nearest it, off the lines, the other bolts and Continue. With no spot
   that clears its anchor and those bolts it docks full width on the anchor's roomier side; a scrolling canvas first scrolls
   the anchor up so the dock has room */
function placeCard(noScroll){const el=anchorEl(),box=$('card');if(!el||box.hidden)return;
  box.classList.remove('dock');box.style.width='';box.style.maxHeight='';
  const cvE=$('canvas'),F=fv(),sc=$('scroller'),pan=cvE.classList.contains('pan');
  const R=e=>{const r=e.getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom};},grow=(r,m)=>({left:r.left-m,right:r.right+m,top:r.top-m,bottom:r.bottom+m});
  const drawn=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  /* the room, in canvas coordinates: the canvas inside the window, under the focus bar */
  let cv=cvE.getBoundingClientRect();
  const room=()=>{cv=cvE.getBoundingClientRect();const t=Math.max(cv.top,0)+(F?$('fbar').offsetHeight:0)+10;
    return{l:Math.max(cv.left,0)+10-cv.left,r:Math.min(cv.right,innerWidth)-10-cv.left,t:t-cv.top,b:Math.min(cv.bottom,innerHeight)-10-cv.top};};
  let V=room();
  const w=Math.min(box.offsetWidth,V.r-V.l),nat=box.offsetHeight,H=Math.min(nat,V.b-V.t);box.style.width=w<box.offsetWidth?w+'px':'';
  const sel=F?fcur():card.k==='p'?card.id:null;
  const seen=r=>r.right>cv.left+V.l&&r.left<cv.left+V.r&&r.bottom>cv.top+V.t&&r.top<cv.top+V.b;
  const mine=b=>F||(sel&&[CBY[b.dataset.c].a,CBY[b.dataset.c].b].includes(sel));
  const ends=card.k==='c'?[CBY[card.id].a,CBY[card.id].b]:[];
  /* what is on screen now: the anchor, the bolts to keep clickable (hard), the boxes, the other bolts, Continue and the lines */
  const scan=()=>{const a=R(el),bolts=[...document.querySelectorAll('.ib')].filter(b=>b!==el&&drawn(b)&&seen(R(b)));
    const hard=[grow(a,4),...bolts.filter(mine).map(b=>grow(R(b),4))];
    if(F&&sel&&card.k==='c'){const n=document.querySelector(`.node[data-p="${sel}"]`);if(n)hard.push(grow(R(n),4));}
    const boxes=[...document.querySelectorAll('#stage .node')].filter(n=>n!==el&&drawn(n)&&seen(R(n))).map(n=>[grow(R(n),4),ends.includes(n.dataset.p)||n.classList.contains('lk')?2:1]);
    const others=bolts.filter(b=>!mine(b)).map(R),sv=$('save'),keep=sv.hidden||!drawn(sv)?[]:[grow(R(sv),6)];
    /* the lines, counted on a 16 px grid with running sums, so any spot reads the points it covers at once */
    const G=16,gx=Math.ceil(cv.width/G)+1,gy=Math.ceil(cv.height/G)+1,S=new Float64Array((gx+1)*(gy+1));
    document.querySelectorAll('.edge').forEach(e=>{if(!drawn(e))return;const L=e.getTotalLength(),m=e.getScreenCTM();if(!m)return;
      for(let s=0;s<=L;s+=8){const q=e.getPointAtLength(s),x=Math.floor((m.a*q.x+m.c*q.y+m.e-cv.left)/G),y=Math.floor((m.b*q.x+m.d*q.y+m.f-cv.top)/G);if(x>=0&&y>=0&&x<gx&&y<gy)S[(y+1)*(gx+1)+x+1]++;}});
    for(let y=1;y<=gy;y++)for(let x=1;x<=gx;x++)S[y*(gx+1)+x]+=S[(y-1)*(gx+1)+x]+S[y*(gx+1)+x-1]-S[(y-1)*(gx+1)+x-1];
    const lines=(l,t,r,b)=>{const x0=Math.max(0,Math.ceil(l/G)),y0=Math.max(0,Math.ceil(t/G)),x1=Math.min(gx,Math.floor(r/G)),y1=Math.min(gy,Math.floor(b/G));
      return x1<=x0||y1<=y0?0:S[y1*(gx+1)+x1]-S[y0*(gx+1)+x1]-S[y1*(gx+1)+x0]+S[y0*(gx+1)+x0];};
    return{a,hard,boxes,others,keep,lines};};
  let O=scan();
  /* score a spot: [bolts and anchor covered, boxes covered, shorter than its full height, the rest] */
  const rate=(l,t,ww,hh,rank)=>{const r={left:cv.left+l,top:cv.top+t,right:cv.left+l+ww,bottom:cv.top+t+hh},a=O.a;
    let hd=0,bx=0;for(const k of O.hard)if(ov(r,k)>0)hd++;for(const [k,wt] of O.boxes)if(ov(r,k)>0)bx+=wt;
    let s=Math.hypot(l+ww/2-(a.left+a.right)/2+cv.left,t+hh/2-(a.top+a.bottom)/2+cv.top)*4+O.lines(l,t,l+ww,t+hh)*150;
    /* where a box must be covered, covering all of it reads better than slicing it */
    for(const [k] of O.boxes)if(ov(r,k)>0&&!(k.left>=r.left&&k.right<=r.right&&k.top>=r.top&&k.bottom<=r.bottom))s+=8000;
    for(const k of O.others)if(ov(r,k)>0)s+=3000;for(const k of O.keep)if(ov(r,k)>0)s+=20000;
    return[hd,bx,rank,s];};
  const less=(x,y)=>{for(let k=0;k<4;k++)if(x[k]!==y[k])return x[k]<y[k];return false;};
  /* the spots: beside, above and below the anchor (and the box group of a connection), then a grid over the room */
  const spots=hh=>{const xs=new Set(),ys=new Set(),a=O.a,ax=a.left-cv.left,ay=a.top-cv.top,aw=a.right-a.left,ah=a.bottom-a.top;
    const near=r=>{const x=r.left-cv.left,y=r.top-cv.top,rw=r.right-r.left,rh=r.bottom-r.top;[x+rw+14,x-14-w,x,x+rw-w,x+rw/2-w/2].forEach(v=>xs.add(v));[y-12,y+rh/2-hh/2,y+rh+12-hh,y-14-hh,y+rh+14].forEach(v=>ys.add(v));};
    near(O.a);
    if(card.k==='c'){const rs=[a,...ends.map(id=>document.querySelector(`.node[data-p="${id}"]`)).filter(Boolean).map(R)];
      near({left:Math.min(...rs.map(r=>r.left)),right:Math.max(...rs.map(r=>r.right)),top:Math.min(...rs.map(r=>r.top)),bottom:Math.max(...rs.map(r=>r.bottom))});}
    for(let x=V.l;x<V.r-w;x+=12)xs.add(x);xs.add(V.r-w);for(let y=V.t;y<V.b-hh;y+=12)ys.add(y);ys.add(V.b-hh);
    const cx=x=>Math.round(Math.max(V.l,Math.min(V.r-w,x))),cy=y=>Math.round(Math.max(V.t,Math.min(V.b-hh,y)));
    return[[...new Set([...xs].map(cx))],[...new Set([...ys].map(cy))]];};
  const search=()=>{let best=null;
    [...new Set([H,Math.min(H,320),Math.min(H,220)])].forEach((hh,rank)=>{const [xs,ys]=spots(hh);
      for(const l of xs)for(const t of ys){const s=rate(l,t,w,hh,rank);if(!best||less(s,best[0]))best=[s,l,t,hh];}});
    if(!best||best[0][0])return false;if(best[3]<nat)box.style.maxHeight=best[3]+'px';box.style.left=best[1]+'px';box.style.top=best[2]+'px';return true;};
  if(search())return;
  /* no clean spot: a scrolling canvas grows by the card's height (until the card closes, so a scroll never snaps back), so every
     bolt can be scrolled clear of it, scrolls the anchor up and looks again; then the card docks across the room on the anchor's roomier side */
  if(pan){$('sizer').style.paddingBottom=(H+10)+'px';
    if(!noScroll){const need=O.a.top-(cv.top+V.t)-10,can=sc.scrollHeight-sc.clientHeight-sc.scrollTop;if(need>0&&can>0){sc.scrollTop+=Math.min(need,can);V=room();O=scan();if(search())return;}}}
  box.classList.add('dock');box.style.left=V.l+'px';box.style.width=(V.r-V.l)+'px';const dn=box.offsetHeight;
  const up=O.a.top-6-(cv.top+V.t),down=cv.top+V.b-(O.a.bottom+6),min=Math.min(dn,140);
  const side=[[V.t,Math.min(dn,up)],[V.b-Math.min(dn,down),Math.min(dn,down)]].filter(s=>s[1]>=min).map(s=>[rate(V.l,s[0],V.r-V.l,s[1],0),s]).sort((x,y)=>less(x[0],y[0])?-1:less(y[0],x[0])?1:y[1][1]-x[1][1]);
  const [t,hh]=side.length?side[0][1]:up>down?[V.t,Math.max(60,up)]:[V.b-Math.max(60,down),Math.max(60,down)];
  if(hh<dn)box.style.maxHeight=hh+'px';box.style.top=t+'px';}
"""
html = html[:i] + NEW + html[j:]
assert html.count('function placeCard(') == 1

# the room a scrolling canvas grows for a card is padding under the sizer, which must add to its height
c = '.sizer{position:absolute;left:0;top:0;width:0;height:0;pointer-events:none}'
one(c)
html = html.replace(c, '.sizer{position:absolute;left:0;top:0;width:0;height:0;pointer-events:none;box-sizing:content-box}')

# the leftover comment
o = '/* hovering a name in the bar lights up its line and i dot */'
one(o)
html = html.replace(o, '/* hovering a name in the bar lights up its line and lightning bolt */')

assert html.count('{') - html.count('}') == BRACES, 'braces changed'
assert '—' not in NEW and '–' not in NEW
open(path, 'w', encoding='utf-8').write(html)
print('✅ step 47 card pass applied to', path)
