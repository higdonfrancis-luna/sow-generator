"""Step 45 on the Build canvas (Nov 4 2026, Adam: "go", on the mockups in sow/mockups/nov4_outside_v2/ and
nov4_cdn_recommended/; data in data_step45.py):
- icons for the five new outside systems (Ad platforms, BI tools, Search data, Authoring documents, Website on another CMS)
- AEM Assets on the AEM play: an Adobe product offered from the same menu ('addons'), which becomes "Add product or
  system" with a group of its own for it; its card has Remove from canvas; a saved canvas keeps it
- the CDN starts on the canvas in every Brand Visibility play ('ostart'), in a play picked here and in the problem box's
  answers; the CDN and Search data say Recommended on their box, in the menu and on their cards, with the reason
- the "Needs [package]" tag on a connection's card and on its services ('tier'), with "Check what your client owns. If
  they don't have it, it's an upsell for Adobe."; the tag rides along to the SOW steps with the service
- a connection whose work sits elsewhere says where ('covered') instead of "Experience League does not list any services"
- the menu and the outside system card say "your client", and the card points to the lightning bolt, not the i
Run once on the step 44 template, then build.py and build_site.py.

    python3 sow/canvas/patch_step45.py sow/canvas/template.html
"""
import sys
path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'placeDots' in html and 'ostart' not in html, 'run this once on the step 44 template'


def rep(old, new):
    global html
    assert html.count(old) == 1, old[:90]
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')
SV = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'

# icons for the new outside systems
rep("\n};\n\nconst play=()=>",
    ",\n  /* step 45: a speaker for ad platforms, bars for BI tools, a magnifier for search data, a page for authoring documents, a window for another CMS */\n"
    f"  ads:'{SV}<path d=\"M3 10v4h3l6 4V6l-6 4z\"/><path d=\"M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12\"/></svg>',\n"
    f"  bi:'{SV}<path d=\"M4 20V10M10 20V4M16 20v-7M22 20H2\"/></svg>',\n"
    f"  search:'{SV}<circle cx=\"11\" cy=\"11\" r=\"6.5\"/><path d=\"M20 20l-4.2-4.2\"/></svg>',\n"
    f"  doc:'{SV}<path d=\"M6 3h8l4 4v14H6z\"/><path d=\"M14 3v4h4M9 12h6M9 16h6\"/></svg>',\n"
    f"  cms:'{SV}<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 9h18M8 9v11\"/></svg>'\n"
    "};\n\nconst play=()=>")
rep("const has=id=>{",
    "/* step 45: systems a play tags Recommended (the CDN and Search data on the Brand Visibility plays), with each one's reason */\n"
    "const recd=id=>{const pl=play();return !!pl&&(pl.recommend||[]).includes(id);};\n"
    "const recNote=id=>`<p class=\"recp\"><span class=\"rec\">Recommended</span><br>${(play().ostart||[]).includes(id)?'On from the start. ':''}${esc(P[id].rec||'')}</p>`;\n"
    "const tierNote=t=>`<p class=\"tierp\"><span class=\"tier\">Needs ${esc(t)}</span><br>Check what your client owns. If they don't have it, it's an upsell for Adobe.</p>`;\n"
    "const has=id=>{")
# a saved canvas keeps an Adobe product added from a play's menu (AEM Assets on the AEM play)
rep("out:Array.isArray(s.out)?[...new Set(s.out.filter(id=>P[id]&&P[id].outside))]:[]",
    "out:Array.isArray(s.out)?[...new Set(s.out.filter(id=>P[id]&&(P[id].outside||CAT.plays.some(q=>(q.addons||[]).includes(id)))))]:[]")
# the CDN starts on in every Brand Visibility play: in a play picked here, and in the problem box's answers
rep("st.play=b.dataset.play;st.on=[];st.out=[];", "st.play=b.dataset.play;st.on=[];st.out=(PLAYS[st.play].ostart||[]).slice();")
rep("out:p.products.filter(id=>P[id].outside&&(pl.outside||[]).includes(id))",
    "out:[...new Set([...(pl.ostart||[]),...p.products.filter(id=>P[id].outside&&(pl.outside||[]).includes(id))])]")
rep("out:[...new Set([...s.out,...outs,...canon])]", "out:[...new Set([...(tp.ostart||[]),...s.out,...outs,...canon])]")
# Recommended on the box
rep("(F?', '+count(k,'connection'):'')+(p.outside?': see how it connects':': see its services'));",
    "(recd(p.id)?', recommended':'')+(F?', '+count(k,'connection'):'')+(p.outside?': see how it connects':': see its services'));")
rep("    n.innerHTML=F?`<span class=\"nn\">", "    n.innerHTML=(F?`<span class=\"nn\">")
rep("'<span class=\"nm2\"><span>'+esc(p.name)+'</span><span class=\"cnt\"></span></span>');\n    hook(n,'p',p.id);",
    "'<span class=\"nm2\"><span>'+esc(p.name)+'</span><span class=\"cnt\"></span></span>'))+(recd(p.id)?'<span class=\"rec\">Recommended</span>':'');\n    hook(n,'p',p.id);")
rep(".node.out{border-style:dashed;",
    ".rec,.tier{display:inline-block;font-size:12px;line-height:16px;font-weight:700;color:var(--dred);background:#fff;border:1.5px solid #EB1000;border-radius:10px;padding:1px 8px}\n"
    ".node .rec{position:absolute;left:50%;bottom:-12px;transform:translateX(-50%);white-space:nowrap}.it2 .rec{margin-left:8px;vertical-align:1px}\n"
    ".ln .nm .tier{display:table;margin-top:4px}.card .tierp,.card .recp{margin:2px 0 8px;font-size:13.5px;line-height:19px;color:var(--ink)}.card .tierp .tier,.card .recp .rec{margin:0 0 3px}\n"
    ".node.out{border-style:dashed;")
# the package tag on a service, and on the SOW steps with it
rep("${I.ext}</a>${setNote(l)?", "${I.ext}</a>${L.tier?'<span class=\"tier\">Needs '+esc(L.tier)+'</span>':''}${setNote(l)?")
rep("L.ext?'Also needs '+L.ext+'.':''].filter(Boolean).join(' ')",
    "L.ext?'Also needs '+L.ext+'.':'',L.tier?'Needs '+L.tier+': check what your client owns; if they don\\'t have it, it is an upsell for Adobe.':''].filter(Boolean).join(' ')")
# the package tag and Recommended on a connection's card; where the work sits when it has no services of its own
rep("h+=`<h4>${esc(k==='p'?o.title:P[o.a].name+' + '+P[o.b].name)}</h4>`;",
    "h+=`<h4>${esc(k==='p'?o.title:P[o.a].name+' + '+P[o.b].name)}</h4>`;\n"
    "  if(k==='c'){if(o.tier)h+=tierNote(o.tier);const r=[o.a,o.b].find(x=>recd(x)&&P[x].rec);if(r)h+=recNote(r);}")
rep("h+=k==='c'?`<p class=\"none\">Adobe Experience League", "h+=k==='c'&&o.covered?`<p class=\"none\">${esc(o.covered)}</p>`:k==='c'?`<p class=\"none\">Adobe Experience League")
# an Adobe product added from the play's menu comes off the canvas the same way
rep("if(k==='p'&&play().custom)h+=`<button class=\"rm\" data-rm=\"${id}\">${I.x}Remove from canvas</button>`;",
    "if(k==='p'&&play().custom)h+=`<button class=\"rm\" data-rm=\"${id}\">${I.x}Remove from canvas</button>`;\n"
    "  else if(k==='p'&&(play().addons||[]).includes(id))h+=`<button class=\"rm\" data-rmout=\"${id}\">${I.x}Remove from canvas</button>`;")
# the outside system card: Recommended, your client, the lightning bolt
rep("<h4>${o.icon&&I[o.icon]?I[o.icon]:''}${esc(o.name)}</h4>`+\n   `<p class=\"how\">A system the customer runs outside Adobe.",
    "<h4>${o.icon&&I[o.icon]?I[o.icon]:''}${esc(o.name)}</h4>`+(recd(id)&&o.rec?recNote(id):'')+\n   `<p class=\"how\">A system your client runs outside Adobe.")
rep("The i on its line says how, what the customer does first, and the services.",
    "The lightning bolt on its line says how, what your client does first, and the services.")
# the menu: Add product or system where the play offers an Adobe product, in a group of its own; Recommended on an item
a = html.index("function outMenuHTML(){")
b = html.index("}).join('');}", a) + len("}).join('');}")
old = html[a:b]
assert html.count(old) == 1 and old.count("const h=`<div class=\"hd\"><div class=\"k\">Add an outside system</div><p>Systems the customer already runs.") == 1
new = (old.replace("const h=`<div class=\"hd\"><div class=\"k\">Add an outside system</div><p>Systems the customer already runs. Each connects through a route Adobe documents.</p></div>`;",
                   "const both=!!(pl.addons||[]).length,ttl=both?'Add a product or system':'Add an outside system',\n"
                   "    h=`<div class=\"hd\"><div class=\"k\">${ttl}</div><p>Systems your client already runs${both?', and Adobe products that connect to this play':''}. Each connects through a route Adobe documents.</p></div>`;")
          .replace("if(!rest.length)return `<div class=\"hd\"><div class=\"k\">Add an outside system</div><p>Every outside system for this play is on your canvas.</p></div>`;",
                   "if(!rest.length)return `<div class=\"hd\"><div class=\"k\">${ttl}</div><p>${both?'Everything this play offers':'Every outside system for this play'} is on your canvas.</p></div>`;\n"
                   "  /* each item: its name (and Recommended), what it connects to, and the systems Adobe documents */\n"
                   "  const item=id=>{const t=to(id),nm=`<span class=\"nm\">${P[id].icon&&I[P[id].icon]?I[P[id].icon]:''}${esc(P[id].name)}${recd(id)?'<span class=\"rec\">Recommended</span>':''}</span>`;return t.length?`<button class=\"it2\" data-out=\"${id}\" role=\"menuitem\">${nm}<span class=\"ctag\">Connects to ${esc(andList(t.map(short)))}</span><span class=\"sys\">${esc(P[id].systems||'')}</span></button>`\n"
                   "    :`<button class=\"it2 wait\" role=\"menuitem\" aria-disabled=\"true\" disabled>${nm}<span class=\"ctag\">Connects to ${esc(andList(need(id).map(short)))}: add it first</span><span class=\"sys\">${esc(P[id].systems||'')}</span></button>`;},\n"
                   "    outs=rest.filter(id=>P[id].outside),adobe=rest.filter(id=>!P[id].outside);"))
i = new.index("  return h+`<div class=\"g\">")
new = new[:i] + ("  return h+(outs.length?`<div class=\"g\">${pl.custom?'Connects to your products':'Connects to this play'}</div>`+outs.map(item).join(''):'')+\n"
                 "    (adobe.length?`<div class=\"g\">Adobe products that connect to this play</div>`+adobe.map(item).join(''):'');}")
html = html[:a] + new + html[b:]
rep("Add outside system <svg width=\"14\"", "<span id=\"out-lbl\">Add outside system</span> <svg width=\"14\"")
rep("$('addwrap').hidden=!own;", "$('addwrap').hidden=!own;$('out-lbl').textContent=pl&&(pl.addons||[]).length?'Add product or system':'Add outside system';")

assert html.count('{') - html.count('}') == BRACES, 'braces changed'
assert 'Systems the customer' not in html and 'The i on its line' not in html
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('step 45 applied on the canvas: new outside systems, AEM Assets on the AEM play, the CDN on from the start, Recommended and Needs [package] tags')
