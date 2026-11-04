"""Step 43 on the SOW steps (Nov 4 2026, Adam: "mockups look great build 43"): Save draft and Open draft on the Build
page. These steps hold the engagement and its draft format, with the canvas's latest changes, so Build's buttons pass
through here for a moment and come straight back:
- draft=save: these steps save the engagement (the canvas's hand-over included), download the draft file and go back
- draft=open: Build hands the file's text over through this tab's session storage; these steps open it exactly as their
  own Open draft does, then go back to the canvas the draft restored
Each trip carries the time it started (under two minutes, like the catch-up), paints nothing, and a message goes back
for Build to show. Run once on the step 39 SOW page, then build_site.py.

    python3 sow/patch_step43.py sow/index.html
"""
import sys
path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'openDraftText' not in html, 'run this once on the step 39 SOW page'


def rep(old, new):
    global html
    assert html.count(old) == 1, old[:90]
    html = html.replace(old, new)


# the head script paints nothing on a draft trip either, and loads the plain steps again if it stalls
rep("/* the canvas's one-time catch-up passes through here (steps 35 and 36): a trip it just started (marked under two minutes ago) paints nothing, and if the trip stalls the page loads again as the plain SOW steps */\ntry{const q=new URLSearchParams(location.search);if(q.get('sync')==='build'&&",
    "/* the canvas's one-time catch-up (steps 35 and 36) and Build's Save draft and Open draft (step 43) pass through here: a trip it just started (marked under two minutes ago) paints nothing, and if the trip stalls the page loads again as the plain SOW steps */\ntry{const q=new URLSearchParams(location.search);if((q.get('sync')==='build'||q.get('draft')==='save'||q.get('draft')==='open')&&")

# one way to open a draft, from these steps' Open draft or from Build's
rep("$('draft-file').onchange=async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>3000000)throw Error('size');const data=JSON.parse(await file.text());if(!data||![2,3,4].includes(data.version)||!validPlay(data.play)||!data.estimates||typeof data.estimates!=='object')throw Error('schema');state=normalize(data);for(const p of Object.keys(PLAYS))syncBands(p);state.handoffAt=Math.min(state.handoffAt,Date.now());try{localStorage.removeItem(HANDOFF);}catch(err){}syncCanvas(true);go('scope');if(!sizeNotice('Draft opened. '))toast(state.play==='custom'&&!state.customProducts.length&&!state.customNames.length?'Draft opened with no products on the canvas: add them on Build and their services come back as they were.':'Draft opened. Build shows its play and service choices.');}catch(err){toast('Choose a JSON draft saved by this tool or its earlier focused version.');}e.target.value='';};",
    "/* step 43: one way to open a draft, from Open draft here or on Build (which hands the file over through this tab's session storage) */\n"
    "function openDraftText(text){const data=JSON.parse(text);if(!data||![2,3,4].includes(data.version)||!validPlay(data.play)||!data.estimates||typeof data.estimates!=='object')throw Error('schema');state=normalize(data);for(const p of Object.keys(PLAYS))syncBands(p);state.handoffAt=Math.min(state.handoffAt,Date.now());try{localStorage.removeItem(HANDOFF);}catch(err){}syncCanvas(true);\n"
    "  return state.play==='custom'&&!state.customProducts.length&&!state.customNames.length?'Draft opened with no products on the canvas: add them on Build and their services come back as they were.':'Draft opened. Build shows its play and service choices.';}\n"
    "const DRAFT_BAD='Choose a JSON draft saved by this tool or its earlier focused version.';\n"
    "$('draft-file').onchange=async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>3000000)throw Error('size');const msg=openDraftText(await file.text());go('scope');if(!sizeNotice('Draft opened. '))toast(msg);}catch(err){toast(DRAFT_BAD);}e.target.value='';};")

# the trip: read before the address loses its mark, acted on where the catch-up acts
rep("const SYNC_BACK=(()=>{const q=new URLSearchParams(location.search);return q.get('sync')==='build'&&Math.abs(Date.now()-Number(q.get('t')))<120000;})();",
    "const SYNC_BACK=(()=>{const q=new URLSearchParams(location.search);return q.get('sync')==='build'&&Math.abs(Date.now()-Number(q.get('t')))<120000;})();\n"
    "   /* step 43: Build's Save draft (draft=save) and Open draft (draft=open), with the time the trip started */\n"
    "   const DRAFT_TRIP=(()=>{const q=new URLSearchParams(location.search),d=q.get('draft');return (d==='save'||d==='open')&&Math.abs(Date.now()-Number(q.get('t')))<120000?d:null;})();")
rep("if(SYNC_BACK){try{const c=JSON.parse(localStorage.getItem(CANVAS_KEY)||'null');",
    "if(DRAFT_TRIP&&!SYNC_BACK){let msg=DRAFT_TRIP==='save'?'The draft could not be saved here. Try Save draft on the Scope step.':DRAFT_BAD;const back=()=>{reloading=true;document.documentElement.style.visibility='hidden';try{sessionStorage.setItem('abv-sow-draft-msg',msg);}catch(e){}location.replace('../index.html?synced='+Date.now());};\n"
    "  try{if(DRAFT_TRIP==='save'){save();download(slug()+'.json',JSON.stringify(state,null,2),'application/json');msg='Draft saved as '+slug()+'.json in your Downloads. Open draft brings it back.';setTimeout(back,400);}\n"
    "    else{let t=null;try{t=sessionStorage.getItem('abv-sow-draft-in');sessionStorage.removeItem('abv-sow-draft-in');}catch(e){}if(!t)throw Error('none');msg=openDraftText(t);save();back();}}\n"
    "  catch(err){back();}}\n"
    "if(SYNC_BACK){try{const c=JSON.parse(localStorage.getItem(CANVAS_KEY)||'null');")
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('step 43 applied on the SOW steps: Build\'s Save draft and Open draft pass through here')
