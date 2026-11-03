"""Step 27 on the Build canvas (Nov 3 2026): outside systems, with Adam's yes ("I like it", then "yes", and "create an
SVG image of it that looks like whatever a database or a data warehouse or a CDN would look like").
- Every Brand Visibility play gets an Add outside system button. Its menu lists the systems the customer runs
  outside Adobe that connect to the play's products: CDN on every Brand Visibility play; data warehouse, cloud
  storage and CRM on the CJA play too. None is on when a play starts (outside_step27.py has the data).
- An outside system is a dashed box with a dark top bar, an OUTSIDE ADOBE tag and a line icon: a globe for the CDN,
  a database cylinder for the data warehouse, a cloud for cloud storage, a contact card for the CRM. Its card says
  what it is and has Remove from canvas; the i on its line says how it connects (labelled Outside system), what the
  customer does first, any license it needs and its services.
- Counted once: CJA data preparation in Experience Platform covers the three CJA source services, so while it is on
  they show as covered and add nothing, unless the partner checks one to keep it, as generic Coworker Skills already
  show as replaced by specialized ones.
- The canvas remembers its outside systems (st.out), hands them over with the lines (outside), and Change play and
  Start over clear them. The SOW steps' half is sow/patch_step27.py.
- The Add outside system menu stays on screen at every width, as the Add product menu does.
Run once on the step 26 template, then build.py and build_site.py.

    python3 sow/canvas/patch_step27.py sow/canvas/template.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'touchy' in html and 'outMenuHTML' not in html, 'run this on the step 26 template'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')
SVG = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'

# line icons for the outside systems
rep("\n};\n\nconst play=()=>PLAYS[st.play]||null;",
    ",\n  /* outside systems: a globe for the CDN, a database cylinder for the data warehouse, a cloud for cloud storage, a contact card for the CRM */\n"
    "  cdn:'" + SVG + "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18\"/><path d=\"M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3z\"/></svg>',\n"
    "  dwh:'" + SVG + "<ellipse cx=\"12\" cy=\"5.5\" rx=\"7.5\" ry=\"2.8\"/><path d=\"M4.5 5.5v13c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8v-13\"/><path d=\"M4.5 12c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8\"/></svg>',\n"
    "  cloud:'" + SVG + "<path d=\"M7.5 19h10a4.5 4.5 0 0 0 .7-8.95A6 6 0 0 0 6.6 8.9 5 5 0 0 0 7.5 19z\"/></svg>',\n"
    "  crm:'" + SVG + "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><circle cx=\"9\" cy=\"11\" r=\"2.3\"/><path d=\"M5.8 16.5c.7-1.6 1.8-2.4 3.2-2.4s2.5.8 3.2 2.4\"/><path d=\"M14.5 10h4M14.5 13.5h4\"/></svg>'\n"
    "};\n\nconst play=()=>PLAYS[st.play]||null;")

# the canvas remembers its outside systems; a play shows the ones added
rep("let st={play:null,on:[],ls:{}", "let st={play:null,on:[],out:[],ls:{}")
rep("on:Array.isArray(s.on)&&CUSTOM?s.on.filter(id=>CUSTOM.products.includes(id)):[],",
    "on:Array.isArray(s.on)&&CUSTOM?s.on.filter(id=>CUSTOM.products.includes(id)):[],out:Array.isArray(s.out)?[...new Set(s.out.filter(id=>P[id]&&P[id].outside))]:[],")
rep("const has=id=>{const pl=play();return !!pl&&(pl.custom?st.on.includes(id):pl.products.includes(id));};",
    "const has=id=>{const pl=play();return !!pl&&(pl.custom?st.on.includes(id):pl.products.includes(id)||((pl.outside||[]).includes(id)&&(st.out||[]).includes(id)));};")
rep("const pos=id=>play().custom?packed()[id]:play().pos[id];",
    "const pos=id=>play().custom?packed()[id]:(play().pos[id]||play().opos[id]);")
rep("const ids=new Set(pl.products),s=new Set();", "const ids=new Set([...pl.products,...(pl.outside||[])]),s=new Set();")
rep("st.play=b.dataset.play;st.on=[];st.ls={};st.keep={};st.fresh=true;", "st.play=b.dataset.play;st.on=[];st.out=[];st.ls={};st.keep={};st.fresh=true;")
rep("st.pubSig=null;st.play=null;st.on=[];st.ls={};st.keep={};moreOpen={};", "st.pubSig=null;st.play=null;st.on=[];st.out=[];st.ls={};st.keep={};moreOpen={};")
rep("products:prods().map(p=>p.id),names:prods().map(p=>p.name)}", "products:prods().map(p=>p.id),names:prods().map(p=>p.name),outside:(st.out||[]).filter(id=>has(id))}")

# an outside connection is labelled Outside system and drawn in its route's style
rep("partner:'Partner-designed workflow'};", "partner:'Partner-designed workflow',outside:'Outside system'};")
rep("EDGE[g.c.kind]", "EDGE[g.c.line||g.c.kind]", 2)
rep("conns().map(c=>c.kind)", "conns().map(c=>c.line||c.kind)")

# counted once
rep("const replaced=l=>l==='CW03'&&!st.keep.CW03&&specialOn();",
    "/* counted once: CJA data preparation in Experience Platform covers the three CJA source services from outside systems */\n"
    "const COVER={OX3:'CJ01',OX4:'CJ01',OX5:'CJ01'};\n"
    "const replaced=l=>(l==='CW03'&&!st.keep.CW03&&specialOn())||(!!COVER[l]&&!st.keep[l]&&!!LN[COVER[l]]&&has('cja')&&counted(COVER[l]));")
rep('<span class="rep">Replaced by the specialized Skills on this canvas. Check to keep it for distinct Skills.</span>',
    '<span class="rep">${COVER[l]?\'Covered by \'+esc(LN[COVER[l]].name)+\', which is on. Check to keep it for work that service does not cover.\':\'Replaced by the specialized Skills on this canvas. Check to keep it for distinct Skills.\'}</span>')
rep('aria-label="Keep ${esc(L.name)} for distinct Skills"', 'aria-label="Keep ${esc(L.name)}${COVER[l]?\'\':\' for distinct Skills\'}"')

# the boxes: dashed, dark top, the tag and the icon
rep("n.className='node'+(F?' fv':'')+(shown.has(p.id)?'':' enter');", "n.className='node'+(F?' fv':'')+(shown.has(p.id)?'':' enter')+(p.outside?' out':'');")
rep("p.icon==='spark'?I.spark:''", "p.icon&&I[p.icon]?I[p.icon]:''", 2)
rep("n.setAttribute('aria-label',p.name+(F?', '+count(k,'connection'):'')+': see its services');",
    "n.setAttribute('aria-label',p.name+(p.outside?', outside Adobe':'')+(F?', '+count(k,'connection'):'')+(p.outside?': see how it connects':': see its services'));")

# its card
rep("function cardHTML(k,id){\n", "function cardHTML(k,id){if(k==='p'&&P[id].outside)return outCardHTML(id);\n")
rep("const rm=e.target.closest('[data-rm]');if(rm){removeProduct(rm.dataset.rm);return;}",
    "const ro=e.target.closest('[data-rmout]');if(ro){removeOutside(ro.dataset.rmout);return;}\n  const rm=e.target.closest('[data-rm]');if(rm){removeProduct(rm.dataset.rm);return;}")

# the Add outside system menu
rep('<div class="addmenu" id="add-menu" role="menu" hidden></div></div>',
    '<div class="addmenu" id="add-menu" role="menu" hidden></div></div>\n'
    '  <div class="addwrap" id="outwrap" hidden><button class="btn outadd" id="out-btn" aria-haspopup="true" aria-expanded="false"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>Add outside system <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9l7 7 7-7" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="addmenu" id="out-menu" role="menu" hidden></div></div>')
rep("$('addwrap').hidden=!own;",
    "$('addwrap').hidden=!own;$('outwrap').hidden=!pl||own||!(pl.outside||[]).length;if($('outwrap').hidden)openOut(false);else if(!$('out-menu').hidden){$('out-menu').innerHTML=outMenuHTML();placeAdd();}")
rep("function menuHTML(){",
    "/* ---------- outside systems: the Add outside system menu, the card and adding or removing one ---------- */\n"
    "function outMenuHTML(){const pl=play();if(!pl||pl.custom)return '';const rest=(pl.outside||[]).filter(id=>!has(id));\n"
    "  const h=`<div class=\"hd\"><div class=\"k\">Add an outside system</div><p>Systems the customer already runs. Each connects through a route Adobe documents.</p></div>`;\n"
    "  if(!rest.length)return h+`<p class=\"none\">Every outside system for this play is on your canvas.</p>`;\n"
    "  return h+`<div class=\"g\">Connects to this play</div>`+rest.map(id=>`<button class=\"it2\" data-out=\"${id}\" role=\"menuitem\"><span class=\"nm\">${P[id].icon&&I[P[id].icon]?I[P[id].icon]:''}${esc(P[id].name)}</span><span class=\"ctag\">Connects to ${esc(andList(pl.products.filter(q=>linked(id,q)).map(short)))}</span><span class=\"sys\">${esc(P[id].systems||'')}</span></button>`).join('');}\n"
    "function openOut(on){const m=$('out-menu'),b=$('out-btn');if(on){openAdd(false);hideCard(true);m.innerHTML=outMenuHTML();}m.hidden=!on;b.setAttribute('aria-expanded',on?'true':'false');if(on)placeAdd();}\n"
    "function addOutside(id){const pl=play();if(!pl||!(pl.outside||[]).includes(id))return;if(!(st.out||[]).includes(id))st.out=[...(st.out||[]),id];openOut(false);render();}\n"
    "function removeOutside(id){st.out=(st.out||[]).filter(x=>x!==id);hideCard(true);render();}\n"
    "function outCardHTML(id){const o=P[id],to=play().products.filter(q=>linked(id,q)).map(q=>P[q].name);\n"
    "  return `<div class=\"k\"><span>Outside system</span><button class=\"close\" data-close aria-label=\"Close\">${I.x}</button></div><h4>${o.icon&&I[o.icon]?I[o.icon]:''}${esc(o.name)}</h4>`+\n"
    "   `<p class=\"how\">A system the customer runs outside Adobe. For this route Adobe documents: ${esc(o.systems||'')}.</p>`+\n"
    "   `<p class=\"how\">It connects to ${esc(andList(to))}. The i on its line says how, what the customer does first, and the services.</p>`+\n"
    "   `<button class=\"rm\" data-rmout=\"${id}\">${I.x}Remove from canvas</button>`;}\n"
    "function menuHTML(){")
rep("$('add-menu').addEventListener('mouseleave',()=>preview(null));",
    "$('add-menu').addEventListener('mouseleave',()=>preview(null));\n"
    "$('out-btn').addEventListener('click',e=>{e.stopPropagation();openOut($('out-menu').hidden);});\n"
    "$('out-menu').addEventListener('click',e=>{e.stopPropagation();const a=e.target.closest('[data-out]');if(a)addOutside(a.dataset.out);});")
rep("document.addEventListener('click',()=>{openAdd(false);if(pinned)hideCard(true);});",
    "document.addEventListener('click',()=>{openAdd(false);openOut(false);if(pinned)hideCard(true);});")
rep("document.addEventListener('keydown',e=>{if(e.key==='Escape'){openAdd(false);",
    "document.addEventListener('keydown',e=>{if(e.key==='Escape'){openAdd(false);openOut(false);")

# the menu stays on screen: the Add product menu's placement covers it too (at 768 pixels it ran past the right edge)
rep("/* keep the Add product menu on screen: shift it left when it would run past the right edge */\n"
    "function placeAdd(){const m=$('add-menu');if(m.hidden)return;m.style.left='';const r=m.getBoundingClientRect(),over=r.right-(document.documentElement.clientWidth-16);if(over>0)m.style.left=-Math.min(over,r.left-16)+'px';}",
    "/* keep the Add product and Add outside system menus on screen: shift each left when it would run past the right edge */\n"
    "function placeAdd(){for(const m of [$('add-menu'),$('out-menu')]){if(m.hidden)continue;m.style.left='';const r=m.getBoundingClientRect(),over=r.right-(document.documentElement.clientWidth-16);if(over>0)m.style.left=-Math.min(over,r.left-16)+'px';}}")

# styles, last in the stylesheet
rep("\n</style>",
    "\n/* outside systems: a dashed box with a dark top bar and the OUTSIDE ADOBE tag; icons beside the names */\n"
    ".node.out{border-style:dashed;border-top:6px solid var(--ink);padding-top:14px}"
    ".node.out::before{content:'OUTSIDE ADOBE';position:absolute;left:0;right:0;top:5px;text-align:center;font-size:10.5px;line-height:13px;letter-spacing:1.3px;font-weight:700;color:var(--ink)}"
    ".node svg{flex:none}.it2 .nm svg{vertical-align:-5px;margin-right:7px}"
    ".it2 .sys{grid-column:1/-1;display:block;font-size:14.5px;line-height:19px;color:var(--ink);margin:1px 0 3px}"
    ".card h4 svg{vertical-align:-4px;margin-right:7px}.btn.outadd{display:flex;align-items:center;gap:8px}\n</style>")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('canvas step 27 applied: outside systems (menu, boxes with line icons, cards, covered lines, hand-over)')
