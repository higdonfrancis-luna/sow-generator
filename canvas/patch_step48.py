"""Step 48, the canvas page (Nov 5 2026, Adam: "Let's fix what we know that needs to be fixed and then we have to be ready
to ship it"; found in the demo rehearsal of step 47):
- fix 2, taller cards: at laptop sizes (1440x900, 1536x864, 1280x800) a lightning bolt or product card opened as a 220 px box
  cut off mid-sentence, because placeCard tried 320 and 220 px heights and ranked covering fewer boxes above height. A card
  now opens at least min(600 px, its own height) tall, and covering another box no longer makes it shorter. Where the
  canvas is shorter than that, or holds no such spot clear of the card's box and bolts, the card uses the window below the
  masthead tabs (it can overlap the toolbar, never the tabs, and stays inside the window); the canvas lets it show there
  only while such a card is open. The step 47 rules stay: a card never covers its own box or bolt, and keeps the selected
  product's bolts clickable where a clean spot exists, so only where no spot 600 px tall clears them do the step 47 heights
  (320 and 220 px) come back, before the dock. A scrolling canvas (phones, tablets) still scrolls the anchor only up to the
  canvas top, never under the toolbar. A card opens scrolled to its top, so its close X shows.
- fix 4: a service's "Also needs ..." note shows only while none of the products it names is on the canvas. Audiences that
  act on the data said "Also needs Real-Time CDP or Journey Optimizer" in red with Real-Time CDP right beside it. What is
  counted does not change, so no play's starting total moves. The notes that name products the canvas doesn't have (AEM
  Forms, Workfront Fusion) show as before.
Run once on the step 47 template, then build.py and ../build_site.py.

    python3 sow/canvas/patch_step48.py
"""
import os, re
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'template.html')
html = open(p, encoding='utf-8').read()
braces = html.count('{') - html.count('}')
EDITS = [
    # fix 2: the canvas lets a tall card reach over the toolbar while one is open
    ('.canvas{position:relative;flex:1;min-height:360px;background:var(--soft);overflow:hidden}\n',
     '.canvas{position:relative;flex:1;min-height:360px;background:var(--soft);overflow:hidden}\n'
     '/* step 48: a card taller than the canvas room uses the window below the tabs */\n'
     '.canvas.tall{overflow:visible}\n', 1),
    ('function showCard(k,id,el){card={k,id};const box=$(\'card\');box.innerHTML=cardHTML(k,id);box.hidden=false;applyHot();placeCard();}',
     'function showCard(k,id,el){card={k,id};const box=$(\'card\');box.innerHTML=cardHTML(k,id);box.hidden=false;box.scrollTop=0;applyHot();placeCard();}', 1),
    ('   the anchor up so the dock has room */\n',
     '   the anchor up so the dock has room. Step 48: a card is at least min(600 px, its own height) tall; where the canvas room is\n'
     '   shorter, or holds no such spot clear of its anchor and bolts, the room is the window below the tabs, over the toolbar */\n', 1),
    ("  box.classList.remove('dock');box.style.width='';box.style.maxHeight='';\n"
     "  const cvE=$('canvas'),F=fv(),sc=$('scroller'),pan=cvE.classList.contains('pan');\n",
     "  const cvE=$('canvas'),F=fv(),sc=$('scroller'),pan=cvE.classList.contains('pan');\n"
     "  box.classList.remove('dock');box.style.width='';box.style.maxHeight='none';cvE.classList.remove('tall');let tall=false;\n", 1),
    ("  const room=()=>{cv=cvE.getBoundingClientRect();const t=Math.max(cv.top,0)+(F?$('fbar').offsetHeight:0)+10;\n",
     "  const room=()=>{cv=cvE.getBoundingClientRect();const t=tall?Math.max(document.querySelector('.tabs').getBoundingClientRect().bottom,0)+10:Math.max(cv.top,0)+(F?$('fbar').offsetHeight:0)+10;\n", 1),
    ("  const w=Math.min(box.offsetWidth,V.r-V.l),nat=box.offsetHeight,H=Math.min(nat,V.b-V.t);box.style.width=w<box.offsetWidth?w+'px':'';\n",
     "  const w=Math.min(box.offsetWidth,V.r-V.l);box.style.width=w<box.offsetWidth?w+'px':'';\n"
     "  const nat=box.offsetHeight;if(V.b-V.t<Math.min(nat,600)){tall=true;cvE.classList.add('tall');V=room();}\n"
     "  let H=Math.min(nat,V.b-V.t);const tallHs=()=>[H,Math.min(H,600)],shortHs=()=>[Math.min(H,320),Math.min(H,220)];\n", 1),
    ("  /* score a spot: [bolts and anchor covered, boxes covered, shorter than its full height, the rest] */\n",
     "  /* score a spot: [bolts and anchor covered, boxes covered, shorter than its full height, the rest]; the heights tried come in\n"
     "     sets (step 48), so a box covered never makes a card shorter than 600 px */\n", 1),
    ('  const search=()=>{let best=null;\n    [...new Set([H,Math.min(H,320),Math.min(H,220)])].forEach(',
     '  const search=hs=>{let best=null;\n    [...new Set(hs)].forEach(', 1),
    # 600 px in the canvas, then in the window below the tabs, then the step 47 heights there, then the dock
    ("  if(search())return;\n  /* no clean spot:",
     "  if(search(tallHs()))return;\n"
     "  if(!tall){tall=true;cvE.classList.add('tall');V=room();H=Math.min(nat,V.b-V.t);O=scan();if(search(tallHs()))return;}\n"
     "  if(search(shortHs()))return;\n"
     "  /* no clean spot:", 1),
    # a scrolling canvas (phones, tablets) still scrolls its anchor only to the top of the canvas, so it stays in view
    ("const need=O.a.top-(cv.top+V.t)-10,can=sc.scrollHeight-sc.clientHeight-sc.scrollTop;if(need>0&&can>0){sc.scrollTop+=Math.min(need,can);V=room();O=scan();if(search())return;}",
     "const need=O.a.top-(Math.max(cv.top,0)+(F?$('fbar').offsetHeight:0)+10)-10,can=sc.scrollHeight-sc.clientHeight-sc.scrollTop;if(need>0&&can>0){sc.scrollTop+=Math.min(need,can);V=room();O=scan();if(search(tallHs())||search(shortHs()))return;}", 1),
    ("function hideCard(force){if(pinned&&!force)return;pinned=false;card=null;$('card').hidden=true;$('sizer').style.paddingBottom='';applyHot();}",
     "function hideCard(force){if(pinned&&!force)return;pinned=false;card=null;$('card').hidden=true;$('canvas').classList.remove('tall');$('sizer').style.paddingBottom='';applyHot();}", 1),
    # fix 4: "Also needs" only while none of the products it names is on the canvas
    ("const missing=x=>{const m=(x.needs||[]).filter(n=>!has(n)).map(n=>[n]);if(!anyOk(x.needs_any))m.push(x.needs_any);return m;};\n",
     "const missing=x=>{const m=(x.needs||[]).filter(n=>!has(n)).map(n=>[n]);if(!anyOk(x.needs_any))m.push(x.needs_any);return m;};\n"
     "/* step 48: a line's \"Also needs\" note, shown only while none of the canvas products it names is on the canvas */\n"
     "const EXT_ANY={C06:['rtcdp','ajo']},extNote=l=>LN[l].ext&&!(EXT_ANY[l]||[]).some(has)?`<span class=\"need\">Also needs ${esc(LN[l].ext)}</span>`:'';\n", 1),
    ('${L.ext?`<span class="need">Also needs ${esc(L.ext)}</span>`:\'\'}', '${extNote(l)}', 2),
]
for old, new, n in EDITS:
    assert html.count(old) == n, ('run this once on the step 47 template', old[:90])
    html = html.replace(old, new)
assert html.count('{') - html.count('}') == braces, 'braces'
assert not re.search('[\u2013\u2014]', html), 'no dashes'
open(p, 'w', encoding='utf-8').write(html)
print('step 48 canvas: cards open at least 600 px tall (over the toolbar where the canvas is short), "Also needs" only when needed')
