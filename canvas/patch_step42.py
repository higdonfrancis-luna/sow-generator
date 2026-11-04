"""Step 42 on the Build canvas (Nov 4 2026, Adam: click to open, no hover; "I do like the integrate with the lightning
bolt better"). Mockups: sow/mockups/nov4_click/ (click_open.png, bolt_integrate.png, click_prototype.html).
- a click (or a tap) opens a card and pins it; hovering opens nothing. The card stays until its X, a click elsewhere or
  Escape; a click on another box or pill swaps to its card. The hover-only code is gone (the hover handlers, the
  focus view's hovered product, its timers)
- each connection's i is a pill: a line lightning bolt and "Integrate"
- each product box says how many of its services are on ("6 services"; "Services on its connections" when they all
  sit on its connections), kept current as lines go in and out
- the hint says Click; the answer of Start from your client's problem draws the same bolt on its connections
Run once on the step 41 template, then build.py and build_site.py.

    python3 sow/canvas/patch_step42.py sow/canvas/template.html
"""
import sys
path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'const touchy=' in html and 'I.bolt' not in html, 'run this once on the step 41 template'


def rep(old, new, n=1):
    global html
    assert html.count(old) == n, (html.count(old), old[:90])
    html = html.replace(old, new)


# click to open: the hover handlers and the hover-only state go
rep("let fsel=null,fhov=null,fT=0,dwellT=0;", "let fsel=null;")
rep("const fcur=()=>fv()?(fhov||fsel):null;", "const fcur=()=>fv()?fsel:null;")
a = html.index("/* touch screens: a tap opens and pins a card through its click; only a real mouse opens one on hover */")
b = html.index("function anchorEl(){")
assert html.count("function anchorEl(){") == 1 and a < b
html = html[:a] + r'''/* step 42: a click (or a tap) opens a card and pins it; hovering opens nothing. It stays until its X, a click elsewhere
   or Escape, and a click on another box or pill swaps to its card. In focus view a click on a product shows its lines */
function hook(el,k,id){
  el.addEventListener('click',e=>{e.stopPropagation();if(!$('out-menu').hidden)openOut(false);
    if(fv()&&k==='p'){fsel=fsel===id?null:id;refocus();pinned=!!fsel;if(fsel)showCard(k,id,el);else hideCard(true);return;}
    if(pinned&&card&&card.k===k&&card.id===id){hideCard(true);return;}pinned=true;showCard(k,id,el);});
  el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}});
}
''' + html[b:]
rep("$('card').addEventListener('mouseenter',e=>{if(touchy(e))return;clearTimeout(hideT);clearTimeout(fT);});\n", "")
rep("$('card').addEventListener('mouseleave',e=>{if(touchy(e))return;if(fv())leaveSoon();if(!pinned)hideT=setTimeout(()=>hideCard(),260);});\n", "")
rep("\n  if(fv()&&fhov&&e.target.closest('[data-t],summary')){fsel=fhov;fhov=null;refocus();}", "")
n = html.count("fsel=null;fhov=null;")
rep("fsel=null;fhov=null;", "fsel=null;", n)
rep("if(!had&&(fsel||fhov)){", "if(!had&&fsel){")
rep("if(fsel||fhov){fsel=null;refocus();}", "if(fsel){fsel=null;refocus();}")
rep(":null;fhov=null;render();}", ":null;render();}")
rep("if(fhov===id)fhov=null;", "")
rep("$('fbar').addEventListener('mouseenter',()=>clearTimeout(fT));\n", "")
rep("$('fbar').addEventListener('mouseleave',()=>{if(fv())leaveSoon();chipHot(null);});", "$('fbar').addEventListener('mouseleave',()=>chipHot(null));")
rep("pinned=false,hideT=0,moreOpen={}", "pinned=false,moreOpen={}")
rep("Hover a product to see its connections; click it to keep them showing.", "Click a product to see its connections.")
rep("Hover a product or an i to see its services;", "Click a product or Integrate to see its services;")

# the pill: a line lightning bolt and "Integrate", centred on its line
rep("  spark:'", "  bolt:'<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linejoin=\"round\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M13 2L4 14h7l-1 8 9-12h-7z\"/></svg>',\n  spark:'")
rep(".ib{position:absolute;width:28px;height:28px;border-radius:50%;background:#fff;border:2.5px solid var(--red);color:var(--red);font-weight:700;font-size:16px;line-height:20px;text-align:center;padding:0}",
    ".ib{position:absolute;height:28px;border-radius:14px;background:#fff;border:2px solid var(--red);color:var(--red);font-weight:700;font-size:13px;line-height:1;padding:0 10px 0 8px;white-space:nowrap;display:inline-flex;align-items:center;gap:4px;transform:translate(-50%,-50%);box-shadow:0 0 0 4px var(--soft);cursor:pointer}")
rep("@keyframes pop{from{transform:scale(.6)}to{transform:none}}", "@keyframes pop{from{transform:translate(-50%,-50%) scale(.6)}to{transform:translate(-50%,-50%)}}")
rep("b.textContent='i';b.dataset.c=g.c.id;", "b.innerHTML=I.bolt+'<span>Integrate</span>';b.dataset.c=g.c.id;")
rep("b.style.left=(mid.x-14)+'px';b.style.top=(mid.y-14)+'px';", "b.style.left=mid.x+'px';b.style.top=mid.y+'px';")
rep("dots.every(d=>Math.hypot(d.x-q.x,d.y-q.y)>32)", "dots.every(d=>Math.abs(d.x-q.x)>110||Math.abs(d.y-q.y)>36)")
rep("const dots=[...document.querySelectorAll('.ib')].map(b=>{const r=b.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;return{left:x-hw,right:x+hw,top:y-hw,bottom:y+hw};});",
    "const dots=[...document.querySelectorAll('.ib')].map(b=>{const r=b.getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom};});")
rep("const sc=$('stage').getBoundingClientRect().width/$('stage').offsetWidth,hw=14*sc;", "")

# each product box says how many of its services are on
rep(":(p.icon&&I[p.icon]?I[p.icon]:'')+'<span>'+esc(p.name)+'</span>';",
    ":(p.icon&&I[p.icon]?I[p.icon]:'')+(p.outside?'<span>'+esc(p.name)+'</span>':'<span class=\"nm2\"><span>'+esc(p.name)+'</span><span class=\"cnt\"></span></span>');")
rep("function setLayout(){const f=fv();NH=f?86:66;", "function setLayout(){const f=fv();NH=f?86:76;")  # room for a two-line name and the count
rep("function totalsUI(){", "/* each product box's count of the services on it */\nfunction countsUI(){document.querySelectorAll('#stage .node .cnt').forEach(e=>{const o=P[e.closest('.node').dataset.p],k=all(o).filter(counted).length;e.textContent=k?count(k,'service'):'Services on its connections';});}\nfunction totalsUI(){countsUI();")
rep(".ib.enter{", ".node .nm2{display:flex;flex-direction:column;align-items:center;line-height:1.15}.node .cnt{font-size:13px;font-weight:600;color:#C40000;margin-top:3px}\n.ib.enter{")

# the answer of Start from your client's problem: the same bolt on its connections
rep("aria-label=\"${esc((KIND[c.kind]||'Connection')+': '+(c.label||''))}\">i</b>", "aria-label=\"${esc((KIND[c.kind]||'Connection')+': '+(c.label||''))}\">${I.bolt}</b>")
rep(".bp-ln b{position:absolute;top:-12px;left:24px;", ".bp-ln b{display:flex;align-items:center;justify-content:center;position:absolute;top:-12px;left:24px;")

for gone in ['fhov', 'touchy', 'HOVER', 'intend(', 'leaveSoon', 'dwellT', 'hideT', 'fT=', 'clearTimeout(fT)', "textContent='i'"]:
    assert gone not in html, gone
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('step 42 applied on the canvas: click to open, Integrate pills, counts on the boxes')
