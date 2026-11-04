"""Step 43 on the Build canvas (Nov 4 2026, Adam: "mockups look great build 43"; mockups in sow/mockups/nov4_drafts/):
- Save draft and Open draft on the top bar, as on the SOW steps, with "Saved in this browser as you go". The SOW steps
  hold the draft format and the canvas's latest changes, so the buttons pass through them for a moment
  (sow/index.html?draft=save or draft=open, see ../patch_step43.py) and come straight back with a message. Open draft
  also works from the play picker (Adam: keep it there); Save draft shows once a play is picked
- the answer of Start from your client's problem lists every connection under "How they connect" (the bolt, the two
  products, the kind and what it does) instead of drawing only boxes that sit side by side; its section labels are
  headings; connection labels speak to the partner ("your client")
Run once on the step 42 template, then build.py and build_site.py.

    python3 sow/canvas/patch_step43.py sow/canvas/template.html
"""
import sys
path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'I.bolt' in html and 'save-draft' not in html, 'run this once on the step 42 template'


def rep(old, new):
    global html
    assert html.count(old) == 1, old[:90]
    html = html.replace(old, new)


# Save draft and Open draft on the top bar
rep('<span class="sp"></span><button class="btn redline" id="start-over">Start over</button></header>',
    '<span class="sp"></span><span class="saved" id="saved-note">Saved in this browser as you go</span><button class="btn" id="save-draft">Save draft</button>'
    '<button class="btn" id="open-draft">Open draft</button><button class="btn redline" id="start-over">Start over</button></header>'
    '<input id="draft-file" type="file" accept=".json,application/json" hidden>')
rep(".masthead .sp{flex:1}", ".masthead .sp{flex:1}\n.masthead .saved{font-size:14px;color:#3A3A3A}\nbody.picking #save-draft,body.picking #saved-note{display:none}\n"
    "@media (max-width:900px){.masthead .saved{display:none}}@media (max-width:520px){body.picking #open-draft{display:none}}")
rep("$('start-over').addEventListener('click',e=>{e.stopPropagation();ask('over');});",
    "$('start-over').addEventListener('click',e=>{e.stopPropagation();ask('over');});\n"
    "/* step 43: Save draft and Open draft, as on the SOW steps. Those steps hold the draft format and the canvas's latest changes, so the\n"
    "   buttons pass through them for a moment (sow/index.html?draft=save or draft=open, with the time the trip started) and come straight back */\n"
    "$('save-draft').addEventListener('click',e=>{e.stopPropagation();if(!play())return;save();location.href='sow/index.html?draft=save&t='+Date.now()+'#scope';});\n"
    "$('open-draft').addEventListener('click',e=>{e.stopPropagation();$('draft-file').click();});\n"
    "$('draft-file').addEventListener('change',async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;\n"
    "  try{if(f.size>3000000)throw Error('size');const t=await f.text(),d=JSON.parse(t);if(!d||typeof d!=='object'||!d.play||!d.estimates)throw Error('schema');sessionStorage.setItem('abv-sow-draft-in',t);}\n"
    "  catch(err){toast('Choose a JSON draft saved by this tool or its earlier focused version.');return;}\n"
    "  location.href='sow/index.html?draft=open&t='+Date.now()+'#scope';});\n"
    "/* the message a draft trip brings back */\n"
    "try{const m=sessionStorage.getItem('abv-sow-draft-msg');if(m){sessionStorage.removeItem('abv-sow-draft-msg');setTimeout(()=>toast(m),300);}}catch(e){}")

# the answer lists every connection
a = html.index("const boxes=ids.map((id,k)=>{const a=ids[k-1],c=a&&C.find(")
b = html.index(".join('');", a) + len(".join('');")
assert html.count("const boxes=ids.map((id,k)=>{const a=ids[k-1],c=a&&C.find(") == 1
html = html[:a] + ("const boxes=ids.map(id=>`<span class=\"bp-p${P[id].outside?' out':''}\">${esc(P[id].name)}${P[id].outside?' (outside system)':''}</span>`).join(''),\n"
                   "    links=bpConns(s).map(c=>`<div class=\"bp-cx\"><span class=\"bp-pill\">${I.bolt}Integrate</span><span><b>${esc(P[c.a].name)} + ${esc(P[c.b].name)}</b> · ${esc(KIND[c.kind]||'Connection')}.${c.label?' '+esc(bpVoice(c.label.replace(/\\s*$/,'').replace(/([^.])$/,'$1.'))):''}</span></div>`).join('');") + html[b:]
rep("const base=bpConns(bpBase(p)).map(c=>c.id),gone=", "const gone=")
rep("why=(kept.length||pl.custom||!own?kept:sents(own)).concat(bpConns(s).filter(c=>!base.includes(c.id)&&c.label).map(c=>bpVoice(c.label.replace(/\\s*$/,'').replace(/([^.])$/,'$1.'))));",
    "why=kept.length||pl.custom||!own?kept:sents(own);")
rep('<div class="bp-lbl">Recommended: ${esc(pl.custom?pl.label+\': \'+andList(s.prods.map(short)):pl.label)}</div><div class="bp-prods">${boxes}</div>',
    '<h3 class="bp-lbl">Recommended: ${esc(pl.custom?pl.label+\': \'+andList(s.prods.map(short)):pl.label)}</h3><div class="bp-prods">${boxes}</div>\n'
    '${links?`<h3 class="bp-lbl">How they connect</h3><div class="bp-cxs">${links}</div>`:\'\'}')
rep('<div class="bp-lbl">Why they work together</div>', '<h3 class="bp-lbl">Why they work together</h3>')
rep('<div class="bp-lbl">What you deliver</div>', '<h3 class="bp-lbl">What you deliver</h3>')
rep('<div class="bp-lbl">Refine</div>', '<h3 class="bp-lbl">Refine</h3>')
rep(".bp-gap{width:14px}\n", "")
rep(".bp-ln{width:70px;border-top:2px dotted #1C1C1C;position:relative}\n", "")
rep(".bp-ln b{display:flex;align-items:center;justify-content:center;position:absolute;top:-12px;left:24px;width:22px;height:22px;border:2px solid #EB1000;border-radius:50%;background:#fff;color:#EB1000;font-weight:700;font-size:13px;line-height:18px;text-align:center;cursor:help}\n",
    ".bp-cx{display:flex;gap:10px;align-items:flex-start;margin:6px 0;font-size:15px;line-height:1.45;color:#1C1C1C}\n"
    ".bp-pill{flex:none;display:inline-flex;align-items:center;gap:4px;border:2px solid #EB1000;color:#EB1000;border-radius:14px;padding:3px 10px 3px 8px;font-weight:700;font-size:13px;line-height:1.2;background:#fff}\n")
rep(".bp-ln{width:40px}.bp-ln b{left:9px}", "")
rep(".bp-prods{display:flex;align-items:center;flex-wrap:wrap;row-gap:8px;margin:6px 0 4px}", ".bp-prods{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin:6px 0 4px}")
rep("const bpVoice=s=>s.replace(", "const bpVoice=s=>s.replace(/\\b([Tt])he client\\b(?!')/g,(m,t)=>(t==='T'?'Your':'your')+' client').replace(")

for gone in ['bp-ln', 'bp-gap', 'const base=']:
    assert gone not in html, gone
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('step 43 applied on the canvas: Save draft and Open draft, How they connect')
