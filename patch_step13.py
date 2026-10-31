"""Step 13 of the SOW tool (Oct 31 2026; Adam, on the one-site flow mockup sow/mockups/one_site_flow.png: "That looks correct
please make it work like it actually looks"): the Build canvas becomes the site's front page and this tool becomes its
Scope, Services and Statement of work steps, at /sow/.
- The left-hand play list is removed: the play is chosen on the canvas. A Build tab (first in the steps) and a Change play
  button go back to the canvas.
- The canvas hands over its choices (play, size, rate, and every service line with on or off) through the browser
  (localStorage key abv-sow-handoff). Lines this tool already has keep their full scope text; lines only the canvas has
  (research lines, and every line of Create your own play) arrive as canvas lines (ids CANVAS-...) with their own hours by
  size and their source. Hours a partner edited here are kept; the partner's own custom services stay.
- A seventh play, Your own play (id custom), holds Create your own play.
- ?play=<id> opens a play and #scope, #services or #document opens a step (links and tests).
- Start over clears this tool and the canvas, then opens the front page.
Run once on the step 12 file; every anchor must appear exactly once.

    python3 patch_step13.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:80]!r}'
    html = html.replace(old, new)


# the left-hand play list goes, with its styles and its click handling
rep('<aside class="sidebar"><nav id="plays" aria-label="Sales play templates"></nav></aside>', '')
for rule in ['.sidebar{width:280px;flex:none;border-right:1px solid var(--line);padding:24px 0 30px;position:sticky;top:0;min-height:calc(100vh - 69px);max-height:100vh;overflow:auto}',
             '.nav-label{font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;padding:0 24px;margin:0 0 8px}',
             '.nav-label.divided{margin:18px 24px 8px;padding:18px 0 0;border-top:1px solid var(--line)}',
             '.play{display:block;width:100%;border:0;border-left:3px solid transparent;border-radius:0;background:#fff;color:var(--ink);text-align:left;font-size:15px;font-weight:600;line-height:1.3;padding:10px 24px 10px 21px}.play:hover{background:var(--soft)}',
             '.play.active{border-left-color:var(--red);color:var(--red)}',
             '.play small{display:block;font-size:13px;font-weight:400;margin-top:3px;color:var(--ink)}',
             '.sidebar{width:236px}',
             '.sidebar{position:static;width:auto;max-height:none;border-right:0;border-bottom:1px solid var(--line);padding:14px 0 0}',
             '.nav-label{display:none}',
             '.play{min-width:170px;max-width:190px;border-left:0;border-bottom:3px solid transparent;padding:8px 10px}.play.active{border-bottom-color:var(--red)}',
             '.play small{display:none}']:
    rep(rule, '')
rep('.topline,.masthead,.sidebar,.topbar,', '.topline,.masthead,.topbar,')
rep(" let nav='',group='';for(const [id,p] of Object.entries(PLAYS)){if(p.group!==group){group=p.group;nav+='<p class=\"nav-label'+(nav?' divided':'')+'\">'+esc(group)+'</p>';}nav+='<button class=\"play '+(state.play===id?'active':'')+'\" data-play=\"'+id+'\">'+esc(p.label)+'<small>'+esc(p.short)+'</small></button>';}$('plays').innerHTML=nav;\n", '')
rep(" const play=e.target.closest('[data-play]'),nav=e.target.closest('[data-step]'),", " const nav=e.target.closest('[data-step]'),")
rep(" if(play){state.play=play.dataset.play;go('scope');}\n", '')

# Build tab and Change play, back to the canvas
rep('<div class="steps" role="tablist" aria-label="Statement of work steps"><button role="tab" data-step="scope"',
    '<div class="steps" role="tablist" aria-label="Statement of work steps"><button role="tab" data-build>Build</button><button role="tab" data-step="scope"')
rep('<header class="topbar"><div><p class="eyebrow">Partner delivery planning</p><h1 id="play-title"></h1></div></header>',
    '<header class="topbar"><div><p class="eyebrow">Play</p><h1 id="play-title"></h1></div><button data-build>Change play</button></header>')
rep('.topbar{margin-bottom:12px}', '.topbar{margin-bottom:12px;display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.topbar [data-build]{flex:none;margin-top:4px}')

# Your own play
rep("\n};\nconst validPlay",
    ",\n custom:{group:'Build your own',label:'Your own play',short:'Built on the canvas',objective:'Deliver the agreed services for the products and connections chosen on the Build canvas.'}\n};\nconst validPlay")
rep("coworker:['CW01','CW02','CW03','CW07','CW05','CW06']", "coworker:['CW01','CW02','CW03','CW07','CW05','CW06'],custom:[]")

# canvas lines in the state, restored like custom services
rep("terms:'',briefs:{},estimates:{},custom:[]});", "terms:'',briefs:{},estimates:{},custom:[],canvas:[],handoffAt:0});")
rep(" const catalog=[...CATALOG,...d.custom];",
    " d.handoffAt=Number(s.handoffAt)||0;\n"
    " for(const c of (Array.isArray(s.canvas)?s.canvas:[]).slice(0,400)){\n"
    "  if(!c||typeof c!=='object'||!/^CANVAS-[\\w-]{1,80}$/.test(c.id)||seen.has(c.id)||typeof c.name!=='string'||!Array.isArray(c.plays)||!c.plays.every(p=>validPlay(p)))continue;\n"
    "  d.canvas.push(canvasLine(c,c.plays));seen.add(c.id);\n"
    " }\n"
    " const catalog=[...CATALOG,...d.custom,...d.canvas];")
rep("const catalog=()=>[...CATALOG,...state.custom];", "const catalog=()=>[...CATALOG,...state.custom,...state.canvas];")
rep("const newLine=(s,on,size='typical')=>",
    "/* a service line that comes from the Build canvas: hours by size, stage, scope and source as the canvas has them */\n"
    "const canvasLine=(c,plays)=>{const n=v=>Math.max(0,Number(v)||0),scope=text(c.scope,'')||text(c.name,'',180);return{id:c.id,name:text(c.name,'',180),stage:['Launch','Connect','Optimize'].includes(c.stage)?c.stage:'Launch',low:n(c.low),base:n(c.base),high:n(c.high),unit:c.unit==='monthly'?'monthly':'one-time',plays,scope,deliverable:text(c.deliverable,scope),acceptance:text(c.acceptance,'Customer confirms the agreed deliverable meets the documented scope.'),assumptions:text(c.assumptions,'Customer and partner agree access, inputs and review responsibilities.'),exclusions:text(c.exclusions,'Work outside the described scope.'),basis:text(c.basis,'Service chosen on the Build canvas.'),source:typeof c.source==='string'&&/^https:\\/\\//.test(c.source)?c.source:'',sourceTitle:text(c.sourceTitle,'')};};\n"
    "const newLine=(s,on,size='typical')=>")

# the handoff from the canvas, ?play= and #step, applied before the first render
rep("\nrender();\n",
    "\n/* the Build canvas hands over its play, size, rate and service lines through the browser */\n"
    "const HANDOFF='abv-sow-handoff',CANVAS_KEY='abv-sow-build-v1';\n"
    "function applyHandoff(){let h=null;try{h=JSON.parse(localStorage.getItem(HANDOFF)||'null');}catch(e){}\n"
    " if(!h||typeof h!=='object'||!validPlay(h.play)||!Array.isArray(h.lines)||!(Number(h.at)>state.handoffAt))return;\n"
    " const p=h.play;state.play=p;state.handoffAt=Number(h.at);\n"
    " if(validSize(h.size)&&h.size!==state.size){state.sizeManual=true;applySize(h.size);}\n"
    " if(h.rate!==''&&h.rate!==null&&h.rate!==undefined&&Number.isFinite(Number(h.rate)))state.rate=Number(h.rate);\n"
    " const byId=new Map(),tool=new Map(CATALOG.map(c=>[c.id,c]));\n"
    " for(const old of state.canvas.filter(c=>c.plays.includes(p)))delete state.estimates[p][old.id];\n"
    " state.canvas=state.canvas.filter(c=>!c.plays.includes(p));\n"
    " for(const l of h.lines.slice(0,400)){if(!l||typeof l.id!=='string'||!/^[\\w-]{1,80}$/.test(l.id))continue;byId.set(l.id,l);\n"
    "  const t=tool.get(l.id);if(t&&t.plays.includes(p))continue;\n"
    "  state.canvas.push(canvasLine(t?{...t,id:'CANVAS-'+l.id,source:t.source,sourceTitle:t.sourceTitle}:{...l,id:'CANVAS-'+l.id,source:l.url,sourceTitle:l.src},[p]));}\n"
    " for(const s of catalog().filter(x=>x.plays.includes(p))){if(isCustom(s))continue;const l=byId.get(s.id.replace(/^CANVAS-/,''));\n"
    "  const r=state.estimates[p][s.id]||(state.estimates[p][s.id]=newLine(s,false,state.size));r.on=!!(l&&l.on);if(!r.hoursEdited)r.hours=sizeHours(s,state.size);}\n"
    " try{localStorage.removeItem(HANDOFF);}catch(e){}}\n"
    "{const q=new URLSearchParams(location.search).get('play');if(validPlay(q))state.play=q;}\n"
    "applyHandoff();\n"
    "{const s=location.hash.slice(1);if(['scope','services','document'].includes(s))step=s;}\n"
    "document.addEventListener('click',e=>{if(e.target.closest('[data-build]')){save();location.href='../';}});\n"
    "render();\n")
# Your own play has no starting scope of its own: the canvas is its starting scope
rep(" $('play-title').textContent=PLAYS[state.play].label;", " $('play-title').textContent=PLAYS[state.play].label;$('starting-scope').hidden=state.play==='custom';")

# Start over clears this tool and the canvas, then opens the front page
rep("start-over-confirm').onclick=()=>{closeStartOver();state=normalize(blank());save();go('scope');toast('Started over. Every step is blank.');};",
    "start-over-confirm').onclick=()=>{closeStartOver();state=normalize(blank());save();try{localStorage.removeItem(CANVAS_KEY);localStorage.removeItem(HANDOFF);}catch(e){}location.href='../';};")

open(path, 'w', encoding='utf-8').write(html)
print('step 13 applied')
