"""Step 63 (Nov 10 2026, Adam: "looks great" to sow/mockups/nov10_expansion/picker_*.png, then "we should yeah do these"):
the Add product menu on Create your own play is grouped under the headings of Adobe's own product menu and has a Find a
product box. It was one list of 21 products.

- On an empty canvas the products sit under AI & agents, Content & workflows, Data & analytics and Campaign management
  (Creativity & design and Document productivity appear when wave 2 and wave 3 give them products). Each heading opens and
  closes and says how many products it holds; the first is open, with Brand Visibility at its top. Each product still says how many of the others it connects
  to.
- With products on the canvas, the ones that connect to it still come first, in one list. The rest wait under the same
  headings, closed, where "N more do not connect to your canvas yet" was.
- Typing in Find a product lists the products whose name matches, each with its heading.
- A heading a partner opened or closed stays that way while the page is open. The box empties when the menu closes or a
  product is added.

Run once from the repo root, then rebuild:

    python3 sow/canvas/patch_step63.py
    python3 sow/canvas/build.py && python3 sow/build_site.py
"""
import hashlib
import os

HERE = os.path.dirname(os.path.abspath(__file__))
path = os.path.join(HERE, 'template.html')
html = open(path, encoding='utf-8').read()
assert 'const GROUPS=' not in html, 'step 63 is already in template.html'
BRACES, PARENS = html.count('{') - html.count('}'), html.count('(') - html.count(')')


def rep(old, new):
    global html
    assert html.count(old) == 1, ('anchor not found once', old[:80], html.count(old))
    html = html.replace(old, new)


# 1. the styles: the old "N more do not connect" fold goes, the group headings and the find box come
rep('details.nocon{border-top:1px solid var(--line);margin-top:6px}\n'
    'details.nocon summary{cursor:pointer;list-style:none;display:flex;align-items:center;gap:6px;padding:8px 18px 4px;font-weight:600;font-size:15.5px;color:var(--ink)}\n'
    'details.nocon summary::-webkit-details-marker{display:none}\n'
    'details.nocon[open] summary svg{transform:rotate(180deg)}\n',
    '.it2 .to.show{display:block}\n'
    'details.mgrp{border-top:1px solid var(--line);margin-top:6px}\n'
    '.g+details.mgrp{border-top:0;margin-top:0}\n'
    'details.mgrp summary{cursor:pointer;list-style:none;display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;column-gap:10px;padding:9px 18px 5px;font-weight:700;font-size:16px;color:var(--ink)}\n'
    'details.mgrp summary::-webkit-details-marker{display:none}\n'
    'details.mgrp summary:focus-visible{outline:2px solid var(--ink);outline-offset:-2px}\n'
    'details.mgrp summary .cnt{font-weight:600;font-size:14.5px;color:var(--ink2)}\n'
    'details.mgrp[open] summary svg{transform:rotate(180deg)}\n'
    '.mfind{display:flex;align-items:center;gap:8px;margin:8px 18px 4px;border:1.5px solid var(--ink);border-radius:10px;padding:0 12px;background:#fff}\n'
    '.mfind:focus-within{outline:2px solid var(--ink);outline-offset:1px}\n'
    '.mfind svg{flex:none}\n'
    '.mfind input{flex:1;min-width:0;border:0;outline:0;background:none;font:inherit;font-size:16px;line-height:22px;color:var(--ink);padding:7px 0}\n'
    '.mfind input::placeholder{color:var(--ink2);opacity:1}\n'
    '.addmenu .nomatch{margin:10px 18px 6px;font-size:15.5px;line-height:21px;color:var(--ink)}\n')

# 2. a search icon beside the chevron
rep("  chev:'<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\">",
    "  lens:'<svg width=\"17\" height=\"17\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" aria-hidden=\"true\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"M16.5 16.5L21 21\"/></svg>',\n"
    "  chev:'<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\">")

# 3. the groups, what the partner opened, and what is typed in the box
rep('let noOpen=false;\n',
    "/* step 63: the menu's groups, under the headings of Adobe's own product menu and in its order; a product not listed falls under More products */\n"
    "const GROUPS=[['AI & agents',['bv','bc','cw']],['Content & workflows',['aemsites','aemassets','eds','so','aemforms','commerce','workfront','gspm']],"
    "['Data & analytics',['rtcdp','cja','ca','mmm','collab']],['Campaign management',['ajo','ajob2b','xa','marketo','target']]];\n"
    "const groupOf=id=>(GROUPS.find(g=>g[1].includes(id))||['More products'])[0],placeIn=id=>{const g=GROUPS.find(g=>g[1].includes(id));return g?g[1].indexOf(id):99;};\n"
    "let grpOpen={},findQ='';\n")

# 4. a row can keep its second line showing (the heading a found product sits under)
rep("const item=(id,tag,to)=>`<button class=\"it2\" data-add=\"${id}\" role=\"menuitem\"><span class=\"nm\">${esc(P[id].name)}</span>${tag?`<span class=\"ctag\">${tag}</span>`:''}${to?`<span class=\"to\">${esc(to)}</span>`:''}</button>`;",
    "const item=(id,tag,to,show)=>`<button class=\"it2\" data-add=\"${id}\" role=\"menuitem\"><span class=\"nm\">${esc(P[id].name)}</span>${tag?`<span class=\"ctag\">${tag}</span>`:''}${to?`<span class=\"to${show?' show':''}\">${esc(to)}</span>`:''}</button>`;")

# 5. the menu itself: its heading and the box, then the list (drawn again as the partner types, so the box keeps its place)
a, b = html.index('function menuHTML(){'), html.index('function openAdd(on){')
assert html.count('function menuHTML(){') == 1 and html.count('function openAdd(on){') == 1
assert hashlib.sha1(html[a:b].encode()).hexdigest() == '930a3f5ab20f0d00909b7a836e7e94d15c12d47a', 'the menu is not as step 62 left it'
MENU = r"""function menuHTML(){const pl=play();if(!pl||!pl.custom)return '';
  if(!pl.products.some(id=>!st.on.includes(id)))return `<div class="hd"><div class="k">Add a product</div><p>Every product is on your canvas.</p></div>`;
  const first=!st.on.length;
  return `<div class="hd"><div class="k">${first?'Add your first product':'Add a product'}</div><p>${first?'Grouped the way Adobe\'s own menu groups them. Each one says how many of the others it connects to.':'Products that connect to your canvas come first.'}</p></div>`+
    `<label class="mfind">${I.lens}<input id="add-find" type="search" placeholder="Find a product" aria-label="Find a product" autocomplete="off" value="${esc(findQ)}"></label><div id="add-list">${listHTML()}</div>`;}
function listHTML(){const pl=play(),byName=(a,b)=>P[a].name.localeCompare(P[b].name),rest=pl.products.filter(id=>!st.on.includes(id)),first=!st.on.length;
  const deg=id=>pl.products.filter(q=>q!==id&&linked(id,q)).length,to=id=>st.on.filter(q=>linked(id,q));
  const tag=id=>first?`Connects to ${deg(id)} product${deg(id)===1?'':'s'}`:to(id).length?`Connects to ${to(id).length} on your canvas`:'';
  const row=id=>item(id,tag(id),!first&&to(id).length?'Lines to '+andList(to(id).map(q=>P[q].name)):'');
  /* typed in the box: every product whose name matches, with the heading it sits under */
  const q=findQ.trim().toLowerCase();
  if(q){const hit=rest.filter(id=>[P[id].name,P[id].title,P[id].short].some(s=>s&&s.toLowerCase().includes(q))).sort(byName);
    return hit.length?`<div class="g">${hit.length} match${hit.length===1?'':'es'}</div>`+hit.map(id=>item(id,tag(id),groupOf(id),true)).join(''):`<p class="nomatch">No product matches. Clear the box to see them all.</p>`;}
  const sect=(list,openFirst)=>[...GROUPS.map(g=>g[0]),'More products'].map(name=>[name,list.filter(id=>groupOf(id)===name).sort((a,b)=>placeIn(a)-placeIn(b)||byName(a,b))]).filter(g=>g[1].length)
    .map(([name,ids],i)=>`<details class="mgrp" data-grp="${esc(name)}"${(name in grpOpen?grpOpen[name]:openFirst&&i===0)?' open':''}><summary><span>${esc(name)}</span><span class="cnt">${ids.length} product${ids.length===1?'':'s'}</span>${I.chev}</summary>${ids.map(row).join('')}</details>`).join('');
  if(first)return sect(rest,true);
  /* products on the canvas: the ones that connect to it first, the rest under their headings, closed */
  const yes=rest.filter(id=>to(id).length).sort((a,b)=>to(b).length-to(a).length||byName(a,b)),no=rest.filter(id=>!to(id).length);
  return (yes.length?`<div class="g">Connects to your canvas</div>`+yes.map(row).join(''):'')+(no.length?`<div class="g">Not connected to your canvas yet</div>`+sect(no,false):'');}
"""
html = html[:a] + MENU + html[b:]

# 6. the box empties when the menu closes or a product is added
rep("  if(on){hideCard(true);m.innerHTML=menuHTML();placeAdd();}else preview(null);if(was!==!!on&&pl)fit();}",
    "  if(on){hideCard(true);m.innerHTML=menuHTML();placeAdd();}else{preview(null);findQ='';}if(was!==!!on&&pl)fit();}")
rep("function addProduct(id){if(!play().custom||st.on.includes(id))return;st.on=[...st.on,id];",
    "function addProduct(id){if(!play().custom||st.on.includes(id))return;st.on=[...st.on,id];findQ='';")

# 7. a heading remembers whether it is open; typing redraws the list
rep("  const sm=e.target.closest('summary');if(sm)setTimeout(()=>{noOpen=sm.parentElement.open;},0);});",
    "  const sm=e.target.closest('summary');if(sm)setTimeout(()=>{grpOpen[sm.parentElement.dataset.grp]=sm.parentElement.open;},0);});\n"
    "$('add-menu').addEventListener('input',e=>{if(e.target.id!=='add-find')return;findQ=e.target.value;preview(null);$('add-list').innerHTML=listHTML();});")

assert 'noOpen' not in html and 'nocon' not in html, 'a piece of the old fold is left'
assert html.count('{') - html.count('}') == BRACES and html.count('(') - html.count(')') == PARENS, 'braces or parentheses no longer balance'
open(path, 'w', encoding='utf-8').write(html)
print('step 63 applied to the canvas template: the Add product menu is grouped under Adobe\'s headings, with a Find a product box')
