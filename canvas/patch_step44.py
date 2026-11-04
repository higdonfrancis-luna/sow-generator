"""Step 44 on the Build canvas (Nov 4 2026, Adam: the Integrate pill is too long; "make sure the lightning bolt is
always in the middle"; the bottom line says only "Click a lightning bolt to see how the two products integrate"; and
"whether you're creating your own sales play or you're choosing a pre-configured one you want to be able to bring in the
CDN and different data sources"). Mockups: sow/mockups/nov4_bolt/.
- each connection shows only the lightning bolt, in a round button the size of the old i, in the middle of its line (it
  moves the least it can toward either end only when the middle sits on a box, another bolt or another line)
- the line at the bottom of the canvas is the bolt and "Click a lightning bolt to see how the two products integrate."
- Create your own play offers Add outside system too: every outside system, those whose product isn't on the canvas
  saying which product to add first; the boxes take places beside the product they connect to (data_step44.py) and are
  handed over to the SOW steps like any play's (../patch_step44.py)
- the problem box keeps outside systems when a refine chip moves the setup to Create your own play
Run once on the step 43 template (with data_step44.py), then build.py and build_site.py.

    python3 sow/canvas/patch_step44.py sow/canvas/template.html
"""
import sys
path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'save-draft' in html and 'class="hb"' not in html, 'run this once on the step 43 template'


def rep(old, new):
    global html
    assert html.count(old) == 1, old[:90]
    html = html.replace(old, new)


# the bolt alone, round, in the middle of its line
rep(".ib{position:absolute;height:28px;border-radius:14px;background:#fff;border:2px solid var(--red);color:var(--red);font-weight:700;font-size:13px;line-height:1;padding:0 10px 0 8px;white-space:nowrap;display:inline-flex;align-items:center;gap:4px;transform:translate(-50%,-50%);box-shadow:0 0 0 4px var(--soft);cursor:pointer}",
    ".ib{position:absolute;width:30px;height:30px;border-radius:50%;background:#fff;border:2px solid var(--red);color:var(--red);padding:0;display:inline-flex;align-items:center;justify-content:center;transform:translate(-50%,-50%);box-shadow:0 0 0 4px var(--soft);cursor:pointer}\n.ib svg{width:15px;height:15px}")
rep("b.innerHTML=I.bolt+'<span>Integrate</span>';", "b.innerHTML=I.bolt;")
a = html.index("function placeDots(paths){"); b = html.index("\n/* ---------- render ---------- */", a)
c = html.rindex("/*", 0, a)
assert html.count("function placeDots(paths){") == 1
html = html[:c] + r'''/* step 44: each bolt sits in the middle of its line; when the middle is on a box, another bolt or another line, it moves the least it can
   toward either end. A 12 px grid of the lines' sampled points finds the nearest other line quickly */
function placeDots(paths){const ps=prods(),near=(q,m)=>ps.some(p=>{const o=at(p);return q.x>o.x-m&&q.x<o.x+NW+m&&q.y>o.y-m&&q.y<o.y+NH+m;});
  const S=paths.map(p=>{const L=p.getTotalLength(),pts=[];for(let s=0;s<=L;s+=4)pts.push(p.getPointAtLength(s));return{p,L,pts};}),dots=[];
  const G=new Map(),cell=12,key=(x,y)=>Math.floor(x/cell)+','+Math.floor(y/cell);
  S.forEach((a,i)=>a.pts.forEach(q=>{const k=key(q.x,q.y);if(!G.has(k))G.set(k,[]);G.get(k).push([q.x,q.y,i]);}));
  const gap=(q,i)=>{let md=36;const cx=Math.floor(q.x/cell),cy=Math.floor(q.y/cell);
    for(let dx=-3;dx<=3;dx++)for(let dy=-3;dy<=3;dy++)for(const [x,y,j] of G.get((cx+dx)+','+(cy+dy))||[])if(j!==i){const d=Math.hypot(x-q.x,y-q.y);if(d<md)md=d;}return md;};
  const T=[.5];for(let k=1;k<=17;k++)T.push(.5-k*.025,.5+k*.025);
  const ok=(q,i,sp)=>!near(q,16)&&dots.every(d=>Math.hypot(d.x-q.x,d.y-q.y)>=sp)&&gap(q,i)>=15;
  return S.map((a,i)=>{const at=t=>a.p.getPointAtLength(a.L*t);let m=null;
    /* nearest the middle that is clear; on a crowded canvas, nearest the middle that keeps clear of boxes and other bolts */
    for(const t of T){const q=at(t);if(ok(q,i,40)){m=q;break;}}
    if(!m)for(const t of T){const q=at(t);if(!near(q,16)&&dots.every(d=>Math.hypot(d.x-q.x,d.y-q.y)>=40)){m=q;break;}}
    /* a short line on a crowded canvas: the spot off the boxes farthest from the other bolts */
    if(!m){let far=-1;for(const t of T){const q=at(t);if(near(q,2))continue;const d=dots.length?Math.min(...dots.map(d=>Math.hypot(d.x-q.x,d.y-q.y))):1e9;if(d>far){far=d;m=q;}}}
    m=m||at(.5);dots.push(m);return m;});}''' + html[b:]
rep("  const own=!!play()&&!!play().custom,fdots=(F||own)?placeDots(paths):null;\n", "  const mids=placeDots(paths);\n")
rep("    const len=path.getTotalLength();let mid=null;\n    if(F||own)mid=fdots[gi];\n    else{for(const t of [.5,.42,.58,.34,.66,.26,.74,.18,.82]){const q=path.getPointAtLength(len*t);if(!inNode(q)&&dots.every(d=>Math.abs(d.x-q.x)>110||Math.abs(d.y-q.y)>36)){mid=q;break;}}\n    if(!mid)mid=path.getPointAtLength(len/2);dots.push(mid);}\n",
    "    const len=path.getTotalLength(),mid=mids[gi];\n")
rep("const F=fv(),geo=F?(fid?starGeometry(fid):[]):geometry(),nowC=new Set(geo.map(g=>g.c.id)),dots=[];\n  const inNode=q=>ps.some(p=>{const o=at(p);return q.x>o.x-16&&q.x<o.x+NW+16&&q.y>o.y-16&&q.y<o.y+NH+16;});\n",
    "const F=fv(),geo=F?(fid?starGeometry(fid):[]):geometry(),nowC=new Set(geo.map(g=>g.c.id));\n")

# the line at the bottom of the canvas
rep("function hintUI(){const n=totals().n,pl=play();$('t-legend').textContent=pl?legend().trim():'';\n  if(pl&&pl.custom&&!prods().length){$('hint').textContent='';return;}\n  const lead=pl&&pl.custom?`${prods().length} product${prods().length===1?'':'s'}, ${conns().length} connection${conns().length===1?'':'s'}, `:'';\n  $('hint').textContent=pl?`${lead}${n} service${n===1?'':'s'}. Click a product or Integrate to see its services; X takes a line out, the check brings it back.${legend()}`:'';}",
    "function hintUI(){const pl=play();$('t-legend').textContent=pl?legend().trim():'';\n  $('hint').innerHTML=pl&&conns().length?`<span class=\"hb\">${I.bolt}</span><b>Click a lightning bolt to see how the two products integrate.</b>`:'';}")
rep(".masthead .sp{flex:1}", ".masthead .sp{flex:1}\n.hint .hb{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border:2px solid var(--red);border-radius:50%;color:var(--red);background:#fff;vertical-align:-6px;margin-right:8px}.hint .hb svg{width:12px;height:12px}")

# outside systems on Create your own play
rep("const has=id=>{const pl=play();return !!pl&&(pl.custom?st.on.includes(id):pl.products.includes(id)||((pl.outside||[]).includes(id)&&(st.out||[]).includes(id)));};",
    "const has=id=>{const pl=play();return !!pl&&((pl.custom?st.on.includes(id):pl.products.includes(id))||((pl.outside||[]).includes(id)&&(st.out||[]).includes(id)));};")
rep("function packed(){const pl=play(),k=pl.id+'|'+st.on.join(',');if(k===pkKey)return pkMap;",
    "function packed(){const pl=play(),k=pl.id+'|'+st.on.join(',')+'|'+(st.out||[]).join(',');if(k===pkKey)return pkMap;")
a = html.index("function packed(){"); b = html.index("pkKey=k;return pkMap;}", a)
seg = html[a:b]
old = "const ids=st.on.filter(id=>pl.pos[id]),cols=[...new Set(ids.map(id=>pl.pos[id][0]))].sort((a,b)=>a-b),rows=[...new Set(ids.map(id=>pl.pos[id][1]))].sort((a,b)=>a-b);\n  pkMap=Object.fromEntries(ids.map(id=>[id,[cols.indexOf(pl.pos[id][0]),rows.indexOf(pl.pos[id][1])]]));"
assert seg.count(old) == 1, 'packed body changed'
new = "/* step 44: outside systems added here take their places beside the product they connect to (opos) */\n  const at0=id=>pl.pos[id]||(pl.opos||{})[id],ids=[...st.on,...(st.out||[]).filter(id=>has(id))].filter(at0),cols=[...new Set(ids.map(id=>at0(id)[0]))].sort((a,b)=>a-b),rows=[...new Set(ids.map(id=>at0(id)[1]))].sort((a,b)=>a-b);\n  pkMap=Object.fromEntries(ids.map(id=>[id,[cols.indexOf(at0(id)[0]),rows.indexOf(at0(id)[1])]]));"
html = html[:a] + seg.replace(old, new) + html[b:]
rep("$('addwrap').hidden=!own;$('outwrap').hidden=!pl||own||!(pl.outside||[]).length;", "$('addwrap').hidden=!own;$('outwrap').hidden=!pl||!(pl.outside||[]).length;")
rep("function outMenuHTML(){const pl=play();if(!pl||pl.custom)return '';const rest=(pl.outside||[]).filter(id=>!has(id));",
    "function outMenuHTML(){const pl=play();if(!pl)return '';const rest=(pl.outside||[]).filter(id=>!has(id));\n"
    "  /* on Create your own play a system connects to the products on the canvas; one whose product isn't there yet says which to add */\n"
    "  const to=id=>CAT.products.filter(q=>!q.outside&&linked(id,q.id)&&(pl.custom?st.on.includes(q.id):pl.products.includes(q.id))).map(q=>q.id),need=id=>CAT.products.filter(q=>!q.outside&&linked(id,q.id)&&pl.products.includes(q.id)).map(q=>q.id);")
rep("  return h+`<div class=\"g\">Connects to this play</div>`+rest.map(id=>`<button class=\"it2\" data-out=\"${id}\" role=\"menuitem\"><span class=\"nm\">${P[id].icon&&I[P[id].icon]?I[P[id].icon]:''}${esc(P[id].name)}</span><span class=\"ctag\">Connects to ${esc(andList(pl.products.filter(q=>linked(id,q)).map(short)))}</span><span class=\"sys\">${esc(P[id].systems||'')}</span></button>`).join('');}",
    "  return h+`<div class=\"g\">${pl.custom?'Connects to your products':'Connects to this play'}</div>`+rest.map(id=>{const t=to(id);return t.length?`<button class=\"it2\" data-out=\"${id}\" role=\"menuitem\"><span class=\"nm\">${P[id].icon&&I[P[id].icon]?I[P[id].icon]:''}${esc(P[id].name)}</span><span class=\"ctag\">Connects to ${esc(andList(t.map(short)))}</span><span class=\"sys\">${esc(P[id].systems||'')}</span></button>`\n"
    "    :`<button class=\"it2 wait\" role=\"menuitem\" aria-disabled=\"true\" disabled><span class=\"nm\">${P[id].icon&&I[P[id].icon]?I[P[id].icon]:''}${esc(P[id].name)}</span><span class=\"ctag\">Connects to ${esc(andList(need(id).map(short)))}: add it first</span><span class=\"sys\">${esc(P[id].systems||'')}</span></button>`;}).join('');}")
rep(".masthead .sp{flex:1}", ".masthead .sp{flex:1}\n.it2.wait{cursor:not-allowed;background:#F4F4F4}.it2.wait .ctag{color:#3A3A3A;border-color:#3A3A3A}")
# the hand-over names only the Adobe products on Create your own play (outside systems go as outside)
rep("products:prods().map(p=>p.id),names:prods().map(p=>p.name),", "products:prods().filter(p=>!p.outside).map(p=>p.id),names:prods().filter(p=>!p.outside).map(p=>p.name),")

# the problem box keeps outside systems on Create your own play
rep("out:pl.custom?[]:p.products.filter(id=>P[id].outside&&(pl.outside||[]).includes(id)),", "out:p.products.filter(id=>P[id].outside&&(pl.outside||[]).includes(id)),")
rep("if(tp.custom){if(r.add.some(id=>P[id].outside||!tp.products.includes(id)))return null;return{play:tp.id,prods:[...new Set([...s.prods,...r.add])].filter(id=>!rm.includes(id)),out:[],off:bpOff(s,r)};}",
    "if(tp.custom){const outs=r.add.filter(id=>P[id].outside);if(r.add.some(id=>!P[id].outside&&!tp.products.includes(id))||outs.some(id=>!(tp.outside||[]).includes(id)))return null;\n"
    "    return{play:tp.id,prods:[...new Set([...s.prods,...r.add.filter(id=>!P[id].outside)])].filter(id=>!rm.includes(id)),out:[...new Set([...s.out,...outs])].filter(id=>(tp.outside||[]).includes(id)),off:bpOff(s,r)};}")
rep("(PLAYS[n.play].custom?\"Create your own play doesn't offer outside systems, so \":\"This play doesn't offer it, so \")", "(lost.length>1?\"This play doesn't offer them, so \":\"This play doesn't offer it, so \")")
rep("<span class=\"bp-pill\">${I.bolt}Integrate</span>", "<span class=\"bp-pill\" aria-hidden=\"true\">${I.bolt}</span>")
rep(".bp-pill{flex:none;display:inline-flex;align-items:center;gap:4px;border:2px solid #EB1000;color:#EB1000;border-radius:14px;padding:3px 10px 3px 8px;font-weight:700;font-size:13px;line-height:1.2;background:#fff}",
    ".bp-pill{flex:none;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border:2px solid #EB1000;color:#EB1000;border-radius:50%;background:#fff;margin-top:-1px}")

for gone in ['Integrate</span>', 'inNode', 'fdots', "doesn't offer outside systems"]:
    assert gone not in html, gone
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('step 44 applied on the canvas: centred bolt, the one-line hint, outside systems on Create your own play')
