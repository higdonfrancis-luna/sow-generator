"""Step 47 on the SOW steps (Nov 5 2026, Adam: "yes, fix all 45"): the SOW-step items of the full audit
(sow/audit_2026-11-05/FINDINGS.md) in this pass; the canvas half is sow/canvas/patch_step47_sow.py.
- 1: the saved engagement loads after the outside-system values normalize uses (loaded before them, Search data, Ad
  platforms, BI tools, Authoring documents, Website on another CMS or AEM Assets threw, and the page saved a blank
  engagement over the partner's work). One that still can't be opened is never written over: a backup copy is kept, this
  visit saves nothing until a draft is opened or the partner starts over, and a toast says so.
- 9 and 10: CDN log forwarding (on by default since step 45) and the SOW agree on who creates the log job; the Scope
  note says where the log job stands; on the AEM play with Adobe's managed CDN, L02 reads the managed route and the
  partner is told OX1 has no CDN console to work in.
- 13: Download, Print and CSV also wait for the schedule, both parties' names and a rate; the SOW's rates note goes.
- 15: the warehouse dependency names only what the products on the canvas need.
- 19: Use starting scope gives a canvas line its canvas default (sent with the hand-over), so AEM Assets and the other
  outside systems' services stay on.
- 20: typed hours take a band when the partner leaves the field, not at each keystroke.
- 33: service texts no longer point to sections or services the SOW doesn't have.
- 34: a partner's own service no longer prints "Confirm access ..." and old drafts lose "Customer confirms".
- 35: the estate example says the Client and the label says it prints.
- 36: the Services step's stage outcomes speak to the partner (your client).
- 40: an engagement opened at ?play= keeps its work when Build shows the picker and the same play is picked.
- 41: the markets monitored set the band without a prompt count.
- 42: the fee table stacks on phones instead of splitting names mid-word.
Changed service wording keeps its earlier text in PRIOR47, so an unedited saved engagement takes the new wording.
Run once on the step 46 SOW page, then build_site.py.

    python3 sow/patch_step47_sow.py sow/index.html
"""
import json, os, re, sys
path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'loadFailed' not in html, 'run this once on the step 46 SOW page'


def rep(old, new, n=1):
    global html
    assert html.count(old) == n, (html.count(old), old[:90])
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')

# ---- the catalog: changed texts, with the earlier ones in PRIOR47 ----
m = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html, re.S)
raw = m.group(1)
CAT = json.loads(raw)
assert json.dumps(CAT, ensure_ascii=False) == raw
by = {c['id']: c for c in CAT}
PRIOR47 = {}


def sub(sid, keys, old, new):
    """replace old with new in one text of a service (keys: 'scope' or ('bands','small','scope')), keeping the earlier text"""
    keys = (keys,) if isinstance(keys, str) else keys
    o = by[sid]
    for k in keys[:-1]:
        o = o[k]
    t = o[keys[-1]]
    assert t.count(old) == 1, (sid, keys, old)
    PRIOR47.setdefault(sid, {}).setdefault(keys[-1], []).append(t)
    o[keys[-1]] = t.replace(old, new)


# 9: the log job is created in the Client's CDN console, by whoever the SOW says (OX1 or the Client's team)
for keys in ('scope', ('bands', 'small', 'scope'), ('bands', 'large', 'scope')):
    sub('L02', keys, "once the Client's CDN team has created the log job", "once the log-forwarding job is active in the Client's CDN console")
sub('L02', 'assumptions', "The Client's CDN team creates the log job in its CDN console (unless CDN log forwarding, set up by the partner, is selected), and it is often the longest item;",
    "The log-forwarding job in the Client's CDN console is often the longest item;")
# 10: on the AEM play with Adobe's managed CDN (cdnown off) there is no CDN console of the Client's own
assert 'neutral' not in by['L02']
by['L02']['neutral'] = {'cdnown': {
    'scope': [["register CDN log forwarding in Brand Visibility and confirm the logs arrive once the log-forwarding job is active in the Client's CDN console",
               "register CDN log forwarding in Brand Visibility by the route Adobe confirms for its managed CDN in week one, and confirm the logs arrive"]],
    'assumptions': [["The log-forwarding job in the Client's CDN console is often the longest item;",
                     "On Adobe's managed CDN, the log-forwarding route is confirmed with Adobe in week one; it is often the longest item;"]]}}
for keys in ('scope', ('bands', 'small', 'scope'), ('bands', 'large', 'scope')):
    o = by['L02']
    for k in (keys if isinstance(keys, tuple) else (keys,)):
        o = o[k]
    assert by['L02']['neutral']['cdnown']['scope'][0][0] in o
assert by['L02']['neutral']['cdnown']['assumptions'][0][0] in by['L02']['assumptions']
# 33: no pointers to sections or services the SOW doesn't have
sub('A03', 'exclusions', 'support beyond the hypercare period stated in Included work.', "support beyond the hypercare period in this service's scope.")
sub('OX1', 'exclusions', 'or logs kept elsewhere (see Log export from another CDN or log store).', 'or logs kept elsewhere (a separate service).')
sub('SO2', 'exclusions', 'new content creation (see the content program)', 'new content creation (a separate service)')
sub('X01', 'exclusions', 'Ongoing program management (see the monthly services) and work outside the agreed engagement.', 'Ongoing program management and work outside the agreed engagement.')
sub('C02', 'assumptions', 'Pilot pages already tested elsewhere are excluded from this unit.', 'Pilot pages already tested elsewhere are excluded from this pilot.')
new_raw = json.dumps(CAT, ensure_ascii=False)
assert not re.search('[\u2013\u2014]', new_raw)
html = html[:m.start(1)] + new_raw + html[m.end(1):]

rep('/* step 46: the service wording before "the Client" (unedited earlier wording takes the new wording) */\n',
    '/* step 46: the service wording before "the Client" (unedited earlier wording takes the new wording) */\n'
    '/* step 47: the wording before the audit fixes (the CDN log job, pointers to sections the SOW does not have) */\n'
    'const PRIOR47=' + json.dumps(PRIOR47, ensure_ascii=False) + ';\n')
rep("...(PRIOR46[baseId(c)]?.[key]||[]),", "...(PRIOR46[baseId(c)]?.[key]||[]),...(PRIOR47[baseId(c)]?.[key]||[]),...(isCustom(c)&&c[key]===OWN_NEW[key]?OLD_OWN[key]:[]),")

# ---- 1: load the saved engagement after everything normalize uses, and never write over one that can't be opened ----
rep("let state=normalize(blank()),step='scope',toastTimer;\n"
    "try{const saved=localStorage.getItem(KEY),legacy=saved?null:localStorage.getItem(OLD_KEY);if(saved||legacy){const parsed=JSON.parse(saved||legacy);if([2,3,4].includes(parsed.version))state=normalize(parsed);}}catch(e){}\n", '')
rep("const outsideOk=s=>!s.outside||(outsideOn(s.outside)&&(state.play!=='custom'||!OUT_WITH[s.id]||(state.customProducts||[]).includes(OUT_WITH[s.id])));\n",
    "const outsideOk=s=>!s.outside||(outsideOn(s.outside)&&(state.play!=='custom'||!OUT_WITH[s.id]||(state.customProducts||[]).includes(OUT_WITH[s.id])));\n"
    "/* step 47: the saved engagement loads here, after every value normalize uses (loaded above the outside systems, a step 45 system threw and a blank engagement\n"
    "   was saved over the partner's work). One that still can't be opened is never written over: it keeps a backup copy, this visit saves nothing until a draft\n"
    "   is opened or the partner starts over, and a toast says so */\n"
    "let state=normalize(blank()),step='scope',toastTimer,loadFailed=false;\n"
    "try{const saved=localStorage.getItem(KEY),legacy=saved?null:localStorage.getItem(OLD_KEY);if(saved||legacy){try{const parsed=JSON.parse(saved||legacy);if([2,3,4].includes(parsed.version))state=normalize(parsed);}"
    "catch(e){console.error('The saved engagement could not be opened:',e);loadFailed=true;state=normalize(blank());try{localStorage.setItem(KEY+'-backup',saved||legacy);}catch(x){}}}}catch(e){}\n"
    "const LOAD_FAILED='Your saved work could not be opened. It is kept as it was, with a backup copy, and nothing here is saved over it until you open a draft or start over.';\n")
rep("function save(){if(reloading)return;", "function save(){if(reloading||loadFailed)return;")
rep("state=normalize(data);for(const p of Object.keys(PLAYS))syncBands(p);", "state=normalize(data);loadFailed=false;for(const p of Object.keys(PLAYS))syncBands(p);")
rep("closeStartOver();state=normalize(blank());save();", "closeStartOver();state=normalize(blank());loadFailed=false;save();")
rep("render();sizeNotice();\n</script>", "render();sizeNotice();if(loadFailed)toast(LOAD_FAILED);\n</script>")

# ---- 9 and 10: who creates the log job, and the AEM play on Adobe's managed CDN ----
rep("let CUSTOM_BV=true;\nconst ctxOf=p=>({bv:p==='custom'?CUSTOM_BV:p!=='coworker',fsi:p==='fsi'});",
    "let CUSTOM_BV=true,AEM_MANAGED=false;\n"
    "/* step 47: 'cdnown' is off only on the AEM play when Adobe's managed CDN serves the site, where the Client has no CDN console of its own */\n"
    "const ctxOf=p=>({bv:p==='custom'?CUSTOM_BV:p!=='coworker',fsi:p==='fsi',cdnown:!(p==='aem'&&AEM_MANAGED)});")
rep("d.cdnRoute=['managed','own','unknown'].includes(s.cdnRoute)?s.cdnRoute:'unknown';",
    "d.cdnRoute=['managed','own','unknown'].includes(s.cdnRoute)?s.cdnRoute:'unknown';AEM_MANAGED=d.cdnRoute==='managed';")
rep("if(k==='cdnRoute')renderScope();save();}", "if(k==='cdnRoute'){rewordCdn();renderScope();}save();}")
rep("function rewordAt(was){",
    "/* step 47: the AEM play's CDN answer changed: each text still in the wording for the earlier answer takes the wording for this one */\n"
    "function rewordCdn(){const was=AEM_MANAGED,now=state.cdnRoute==='managed';AEM_MANAGED=now;if(was===now)return;for(const s of catalog().filter(x=>x.plays.includes('aem'))){const r=(state.estimates.aem||{})[s.id];if(!r||isCustom(s)||!s.neutral||!s.neutral.cdnown)continue;\n"
    " for(const k of TEXT_KEYS){AEM_MANAGED=was;const old=[s[k],...BAND_ORDER.map(x=>bandText(s,x,k))].filter(x=>typeof x==='string').map(x=>neutralize(s,'aem',x,k));AEM_MANAGED=now;if(old.includes(r[k]))r[k]=lineText(s,'aem',r.band,k);}}}\n"
    "function rewordAt(was){")
rep(r"creates the log-forwarding job. The partner prepares and checks them, and does them only with access your client grants: for the log job, add the CDN box on Build and its CDN log forwarding service.'",
    r"creates the log-forwarding job. You prepare and check them, and do them only with access your client grants.'")
rep(r"unknown:'Confirm in discovery which CDN serves the site. Until then the SOW lists your client\'s CDN team as a dependency.'};" + "\n",
    r"unknown:'Confirm in discovery which CDN serves the site. Until then the SOW lists your client\'s CDN team as a dependency.'};" + "\n"
    "/* step 47: the note says where the log job stands now (CDN log forwarding, set up by the partner starts on with the CDN box since step 45) */\n"
    r"const MANAGED_OX1='CDN log forwarding, set up by the partner is on, but the Scope step says Adobe\'s managed CDN serves the site, where your client has no CDN console of its own: take the CDN box off on Build, or change the answer.';" + "\n"
    "const aemCdnBox=()=>((state.outside||{}).aem||[]).includes('cdn'),aemOX1=()=>{const r=(state.estimates.aem||{}).OX1;return !!(r&&r.on)&&aemCdnBox();};\n"
    "function cdnNote(){const r=state.cdnRoute;\n"
    r" if(r==='own')return CDN_NOTE.own+' '+(aemOX1()?'For the log job, CDN log forwarding, set up by the partner is already in Services; take it off with its X there if your client\'s team creates the job.':aemCdnBox()?'For the log job, add CDN log forwarding, set up by the partner back on Build, on the CDN and Brand Visibility lightning bolt.':'For the log job, add the CDN box on Build, with its CDN log forwarding service.');" + "\n"
    " return r==='managed'&&aemOX1()?CDN_NOTE.managed+' '+MANAGED_OX1:CDN_NOTE[r]||CDN_NOTE.unknown;}\n")
rep("$('cdn-note').textContent=CDN_NOTE[state.cdnRoute]||CDN_NOTE.unknown;", "$('cdn-note').textContent=cdnNote();")
rep("if((!aemCdn||has('OX1','OX2'))&&has('L02','C01','OX1','OX2'))", "if((!aemCdn||(aemCdn!=='managed'&&has('OX1','OX2')))&&has('L02','C01','OX1','OX2'))")
rep(r"if(has('L01','L02'))parts.push('prompt set approved, workspace configured and baseline recorded; CDN log forwarding on once the Client\'s IT team completes it');",
    r"if(has('L01','L02'))parts.push('prompt set approved, workspace configured and baseline recorded; CDN log forwarding on once '+(has('OX1')?'the partner creates the log job with your client\'s IT access and approval':has('OX2')?'your client\'s team runs the partner\'s log export':'your client\'s IT team completes it'));")

# ---- 13 and 10: what must be written before the SOW is issued ----
rep("pause and restart, change control and the governing agreement on the Scope step. Placeholder text such as TBD does not count.');\n",
    "pause and restart, change control and the governing agreement on the Scope step. Placeholder text such as TBD does not count.');\n"
    "  /* step 47: no SOW goes out without its schedule, both parties or a rate, and none bills a log job in a CDN console the Client doesn't have */\n"
    "  if(substance(state.timeline)<15)out.push('Delivery schedule (section 4): write the delivery phases and review dates on the Scope step. Placeholder text such as TBD does not count.');\n"
    "  if(substance(state.customer)<2||substance(state.partner)<2)out.push('Client and partner: name your client and your company on the Scope step.');\n"
    "  if(totals().missing)out.push('Hourly rates: enter your rate on the Scope step, or a rate on each line.');\n"
    "  if(state.play==='aem'&&state.cdnRoute==='managed'&&lines.some(l=>baseId(l)==='OX1'))out.push(MANAGED_OX1);\n")
rep("      if (missing) fees += '<p class=\"sow-review-note\">Complete the missing hourly rates before approving the fee estimate.</p>';\n", '')

# ---- 15: the warehouse dependency names what the products on the canvas need ----
rep(r"if(outsideOn('dwh'))out.push('Data warehouse: the Client\'s data team gives the access the source needs (for Google BigQuery, a dataset for temporary tables; for Azure Databricks, a SAS token in the cluster\'s Spark configuration), allows Adobe\'s IP addresses where the warehouse needs it and turns on change tracking for each table. Data Mirror needs CJA Select, Prime or Ultimate.');",
    "if(outsideOn('dwh')){/* step 47: what each product on the canvas needs from the warehouse */const on=id=>state.play===id||(state.play==='custom'&&(state.customProducts||[]).includes(id));\n"
    r"  out.push(['Data warehouse: the Client\'s data team gives the access the source needs (for Google BigQuery, a dataset for temporary tables; for Azure Databricks, a SAS token in the cluster\'s Spark configuration) and allows Adobe\'s IP addresses where the warehouse needs it.',"
    r"on('cja')?'Change tracking is on for each table; Data Mirror for CJA needs CJA Select, Prime or Ultimate.':'',"
    r"on('rtcdp')?'The Real-Time CDP route copies tables on a schedule and needs Real-Time CDP Ultimate or the Advanced Enterprise Source Connectors.':'',"
    r"on('ajo')?'Data Mirror for orchestrated campaigns needs a Journey Optimizer Campaigns package, with change tracking on and deletes managed at the source.':''].filter(Boolean).join(' '));}")

# ---- 19: a canvas line keeps its canvas default, and Use starting scope gives it back ----
rep("concept,bands:c.bands&&typeof c.bands==='object'?c.bands:null,locked:c.locked===true};};",
    "concept,bands:c.bands&&typeof c.bands==='object'?c.bands:null,locked:c.locked===true,def:typeof c.def==='boolean'?c.def:null};};")
rep("sourceTitle:t.sourceTitle,locked:c.locked===true},c.plays));}", "sourceTitle:t.sourceTitle,locked:c.locked===true,def:c.def},c.plays));}")
rep(",locked:l.lock===true},[p]));}", ",locked:l.lock===true,def:l.def},[p]));}")
rep("$('starting-scope').onclick=()=>{for(const s of entries())row(s).on=STARTERS[state.play].includes(s.id)||OUT_START.includes(s.id);",
    "$('starting-scope').onclick=()=>{/* step 47: a line from the canvas takes its canvas default (a hand-over from before step 47 has none, so its choice stays) */"
    "for(const s of entries()){const r=row(s);r.on=s.id.startsWith('CANVAS-')?(typeof s.def==='boolean'?s.def:r.on):STARTERS[state.play].includes(s.id)||OUT_START.includes(s.id);}")

# ---- 20: typed hours take a band when the partner leaves the field ----
rep("  if(k==='hours'){const s=entries().find(x=>x.id===card.dataset.line),hit=isCustom(s)?null:BAND_ORDER.find(b=>sizeHours(s,b)===r.hours);if(hit){r.hoursEdited=false;if(hit!==r.band){r.bandSet=true;applyBand(s,r,hit,state.play);card.querySelector('.service-scope').textContent=r.scope;for(const k of TEXT_KEYS){const ta=card.querySelector('textarea[data-line-field=\"'+k+'\"]');if(ta&&ta.value!==r[k])ta.value=r[k];}}}\n",
    "  if(k==='hours'){const s=entries().find(x=>x.id===card.dataset.line);\n")
rep("document.addEventListener('change',e=>{const node=e.target,card=node.closest('[data-line]');",
    "/* step 47: typed hours that match a band take that band once the partner leaves the field (or uses its arrows), not at each keystroke: typing 400 passed through 40, the Small band */\n"
    "function hoursBand(card){const s=entries().find(x=>x.id===card.dataset.line),r=s&&row(s),hit=!s||isCustom(s)||!r.hoursEdited?null:BAND_ORDER.find(b=>sizeHours(s,b)===r.hours);if(!hit)return;"
    "r.hoursEdited=false;if(hit!==r.band){r.bandSet=true;applyBand(s,r,hit,state.play);}renderRows();renderTotals();save();}\n"
    "document.addEventListener('focusout',e=>{const n=e.target,card=n.closest&&n.closest('[data-line]');if(card&&n.dataset.lineField==='hours')hoursBand(card);});\n"
    "document.addEventListener('change',e=>{const node=e.target,card=node.closest('[data-line]');if(card&&node.dataset.lineField==='hours')hoursBand(card);")

# ---- 34: a partner's own service: no instruction in its assumptions, and old drafts take the current defaults ----
rep("assumptions:'Confirm access, approved inputs and review responsibilities.'", "assumptions:OWN_NEW.assumptions", 2)
rep("const isCustom=s=>/^CUSTOM/.test(s.id);\n",
    "const isCustom=s=>/^CUSTOM/.test(s.id);\n"
    "/* step 47: a partner's own service starts with these; one saved on an earlier default (an instruction to the partner, or Customer) takes the current one */\n"
    "const OWN_NEW={acceptance:'Client confirms the agreed deliverable meets the documented scope.',assumptions:'Client and partner agree access, inputs and review responsibilities.'},"
    "OLD_OWN={acceptance:['Customer confirms the agreed deliverable meets the documented scope.'],assumptions:['Confirm access, approved inputs and review responsibilities.','Customer and partner agree access, inputs and review responsibilities.']};\n"
    "const ownDefault=(k,t)=>OLD_OWN[k].includes(t)?OWN_NEW[k]:t;\n")
rep("acceptance:text(c.acceptance,'Client confirms the agreed deliverable meets the documented scope.'),assumptions:text(c.assumptions,'Client and partner agree access, inputs and review responsibilities.'),exclusions:text(c.exclusions,'Work outside the described scope.'),basis:text(c.basis,'Partner-defined service scope.')",
    "acceptance:ownDefault('acceptance',text(c.acceptance,OWN_NEW.acceptance)),assumptions:ownDefault('assumptions',text(c.assumptions,OWN_NEW.assumptions)),exclusions:text(c.exclusions,'Work outside the described scope.'),basis:text(c.basis,'Partner-defined service scope.')")

# ---- 35: the estate example is SOW text ----
rep('<label>Context only<input data-cover="estate" placeholder="e.g. Your client owns 100 domains; this engagement covers the two listed above.">',
    '<label>Context only, printed in the SOW<input data-cover="estate" placeholder="e.g. The Client owns 100 domains; this engagement covers the two listed above.">')

# ---- 36: the Services step's stage outcomes speak to the partner (they don't print) ----
rep("Connect:'Outcome: the integrations and builds live and verified with the Client.'", "Connect:'Outcome: the integrations and builds live and verified with your client.'")
rep("'the agreed setup work accepted by the Client'", "'the agreed setup work accepted by your client'")

# ---- 40: an engagement opened at ?play= keeps its work when Build shows the picker and the same play is picked ----
rep("function rewordCdn(){",
    "/* step 47: the partner has worked on this play here: a choice, hours, a band, a rate or text of their own, an own service that is on, or Scope details */\n"
    "function hasWork(p){const est=state.estimates[p]||{},b=state.briefs[p],d=defaultBrief(p);\n"
    " if(state.custom.some(c=>c.plays.includes(p)&&est[c.id]&&est[c.id].on))return true;\n"
    " if(b&&(b.title||b.objective!==d.objective||Object.values(b.coverage).some(v=>v)))return true;\n"
    " return catalog().filter(s=>s.plays.includes(p)&&!isCustom(s)).some(s=>{const r=est[s.id];return !!r&&(r.on!==(STARTERS[p].includes(s.id)||OUT_START.includes(s.id))||r.hoursEdited||r.scopeChanged||r.bandSet||r.rate!=='');});}\n"
    "function rewordCdn(){")
rep("document.addEventListener('click',e=>{if(e.target.closest('[data-build]')){save();if(canvasPlay()!==state.play&&state.handoffAt>0)syncCanvas(true);",
    "document.addEventListener('click',e=>{if(e.target.closest('[data-build]')){save();if(canvasPlay()!==state.play&&(state.handoffAt>0||(!!e.target.closest('.steps [data-build]')&&hasWork(state.play))))syncCanvas(true);")
a, b = html.index('function applyHandoff(){'), html.index('function hasWork(p){')
seg = html[a:b]
assert seg.count('h.fresh===true') == 4, seg.count('h.fresh===true')
html = html[:a] + seg.replace('h.fresh===true', 'fresh') + html[b:]
rep(" const p=h.play;state.play=p;state.handoffAt=Number(h.at);",
    " /* step 47: the same play picked again on an engagement that has had no hand-over yet (opened at ?play=) keeps the partner's work */\n"
    " const p=h.play,fresh=h.fresh===true&&!(p===state.play&&state.handoffAt===0&&hasWork(p));state.play=p;state.handoffAt=Number(h.at);")

# ---- 41: the markets monitored set the band without a prompt count ----
rep("function monitoringBand(p,st=state){const c=st.briefs[p]&&st.briefs[p].coverage||{},n=intOf(c.promptCount);if(!n)return null;const m=intOf(c.marketCount)||1;return BAND_ORDER[Math.max(BAND_ORDER.indexOf(promptBand(n)),BAND_ORDER.indexOf(marketBand(m)))];}",
    "/* step 47: two or more markets set the band on their own, as the Scope hint says; one market with no prompt count leaves the delivery size's band */\n"
    "function monitoringBand(p,st=state){const c=st.briefs[p]&&st.briefs[p].coverage||{},n=intOf(c.promptCount),mk=intOf(c.marketCount);if(!n&&!(mk>1))return null;const m=mk||1;return BAND_ORDER[Math.max(n?BAND_ORDER.indexOf(promptBand(n)):0,BAND_ORDER.indexOf(marketBand(m)))];}")
rep("return !!n&&(n>PROMPT_CAP||m>MARKET_CAP);}", "return (!!n&&n>PROMPT_CAP)||m>MARKET_CAP;}")
rep("if(!n)return c.prompts||'';", "if(!n)return m?m+(m===1?' market or language':' markets or languages')+' monitored':c.prompts||'';")
rep("mb?'Set by '+plural(intOf(c.promptCount),'prompt')+(intOf(c.marketCount)?' in '+plural(intOf(c.marketCount),'market'):'')+' on the Scope step.'",
    "mb?'Set by '+(intOf(c.promptCount)?plural(intOf(c.promptCount),'prompt')+(intOf(c.marketCount)?' in ':''):'')+(intOf(c.marketCount)?plural(intOf(c.marketCount),'market'):'')+' on the Scope step.'")

# ---- 42: the fee table stacks on phones (print and wide screens unchanged) ----
rep(".sow-fee-total dd{font-size:17px}}",
    ".sow-fee-total dd{font-size:17px}}\n"
    ".sow-fee-label{display:none}"
    "@media screen and (max-width:760px){.sow-fee-table thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}"
    ".sow-fee-table,.sow-fee-table tbody{display:block}.sow-fee-table tr{display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:14px;padding:10px 0;border-bottom:1px solid #EDEDED}"
    ".sow-document .sow-fee-table td{border-bottom:0;padding:2px 0;width:auto}.sow-document .sow-fee-table td:first-child{grid-column:1/-1;overflow-wrap:break-word;font-weight:600;padding-bottom:4px}"
    ".sow-document .sow-fee-table td:nth-child(2),.sow-document .sow-fee-table td:nth-child(3),.sow-document .sow-fee-table td:nth-child(4){grid-column:1;text-align:left}"
    ".sow-document .sow-fee-table td:last-child{grid-column:2;grid-row:2/span 3;align-self:start}.sow-fee-label{display:inline;font-weight:600}}")
rep("for (const line of list) fees += '<tr><td>' + text(line.name, 'Service') + '</td><td>' + (line.cadence === 'monthly' ? 'Per month' : 'One-time') + '</td><td class=\"sow-number\">' + hours(line.hours) + '</td><td class=\"sow-number\">' + (line.hours === 0 && !numeric(line.rate) ? 'Not applicable' : amount(line.rate, code)) + '</td>",
    "for (const line of list) fees += '<tr><td>' + text(line.name, 'Service') + '</td><td><span class=\"sow-fee-label\">Cadence: </span>' + (line.cadence === 'monthly' ? 'Per month' : 'One-time') + '</td><td class=\"sow-number\"><span class=\"sow-fee-label\">Hours: </span>' + hours(line.hours) + '</td><td class=\"sow-number\"><span class=\"sow-fee-label\">Rate / hour: </span>' + (line.hours === 0 && !numeric(line.rate) ? 'Not applicable' : amount(line.rate, code)) + '</td>")

assert html.count('{') - html.count('}') == BRACES, (html.count('{') - html.count('}'), BRACES)
assert not re.search('[\u2013\u2014]', html)
open(path, 'w', encoding='utf-8').write(html)

# ---- 35 and 36: the step 46 sweep's record says what these are ----
HERE = os.path.dirname(os.path.abspath(__file__))
dp = os.path.join(HERE, 'sweep46_decisions.json')
dtext = open(dp, encoding='utf-8').read()
dec = json.loads(dtext)
assert dtext.startswith('[\n {') and json.dumps(dec, ensure_ascii=False, indent=1) == dtext
fix = {'c0200': ('The Client', 'Placeholder for SOW text (the estate example prints in the SOW)'),
       'c0262': ('your client', 'Services-step stage outcome shown to the partner (not printed)'),
       'c0263': ("your client\\'s", 'Services-step stage outcome shown to the partner (not printed)'),
       'c0264': ('your client', 'Services-step stage outcome shown to the partner (not printed)')}
for d in dec:
    if d['id'] in fix:
        d['replacement'], d['reason'] = fix[d['id']]
open(dp, 'w', encoding='utf-8').write(json.dumps(dec, ensure_ascii=False, indent=1))
cp = os.path.join(HERE, 'review_step46_2026-11-04', 'CHANGES.md')
md = open(cp, encoding='utf-8').read()
for old, new in [('el>Context only**Customer → Your client** owns 100 domains', 'el>Context only**Customer → The Client** owns 100 domains (step 47: the example prints in the SOW)'),
                 ('verified with **the customer → the Client**.', 'verified with **the customer → your client**. (step 47: a Services-step stage outcome shown to the partner, not printed)'),
                 ("CDN log forwarding on once **the customer's → the Client's** IT team completes it", "CDN log forwarding on once **the customer's → your client's** IT team completes it (step 47: shown to the partner, not printed)"),
                 ('accepted by **the customer → the Client**', 'accepted by **the customer → your client** (step 47: shown to the partner, not printed)')]:
    assert md.count(old) == 1, old
    md = md.replace(old, new)
open(cp, 'w', encoding='utf-8').write(md)
print('step 47 (SOW pass) applied: saved work loads safely, the CDN log job, issue checks, starting scope, typed hours, own services, markets, the fee table')
