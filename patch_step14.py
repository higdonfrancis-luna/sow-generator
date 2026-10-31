"""Step 14 of the SOW tool (Oct 31 2026): fixes from the adversarial readiness audit
(sow/audit_2026-10-31/; change log and open assumptions in the same folder).
- Fees: "Illustrative services fees", planning hours x the partner's approved rate, no cost, margin or profit implied.
  The unsourced $100 to $300 rate range is gone. The total is "Implementation + 12-month term", not "Year one".
- Sizing: every service has three planning bands, each naming the quantity its hours assume (estimating_bands.json);
  the deliverable text follows the band. A numeric prompt count (and markets count) sets only the three prompt
  services (L01, L02, O01); 200 prompts is Typical, matching their scope. The Delivery size switch sets every other
  service, never the prompt count. Each card has its own band; typed hours are kept and flagged.
- Service concepts: lines that only the Build canvas has (research lines) arrive as "Service concept, not quote-ready",
  with an empty deliverable and acceptance; Download, Print and CSV wait until they are written.
- Overlaps: generic and specialized Coworker Skills, or the shared setup and its separate packages, both selected
  need a distinct scope before export.
- FSI: a Brand Concierge today question (new, live and healthy, live but needs fixes) turns Implement Brand Concierge
  on or off; the SOW carries the customer's operating model.
- The SOW's dependencies and each stage's outcome come from the play and the selected services; section 8 lists the
  commercial terms the partner completes; "Source" becomes "Capability reference".
- Text fixes: L03 (one URL count, measurement conditional), C07 (CDN readiness and routing where required, no blanket
  Fastly exception, on by default in the Commerce play), C04 (no "existing deployment" when F02 builds it), O01, O04,
  O06, O08, C02, CW06, CW-FSI.
Run once on the step 13 file; every anchor must appear exactly once.

    python3 patch_step14.py index.html
"""
import json
import os
import re
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
HERE = os.path.dirname(os.path.abspath(__file__))


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


# ---------- catalog: text fixes, then planning bands ----------
m = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html)
raw = m.group(1)
CAT = json.loads(raw)
assert json.dumps(CAT, ensure_ascii=False) == raw
BY = {c['id']: c for c in CAT}
FIX = json.load(open(os.path.join(HERE, 'step14_text.json'), encoding='utf-8'))
prior = {}
for lid, fields in FIX['lines'].items():
    c = BY[lid]
    for k, v in fields.items():
        if k.startswith('+'):
            k = k[1:]
            assert v not in c[k], (lid, k)
            v = c[k] + ' ' + v
        assert k in c, (lid, k)
        if k in ('scope', 'deliverable', 'acceptance', 'assumptions', 'exclusions'):
            prior.setdefault(lid, {})[k] = c[k]
        assert '—' not in v and '–' not in v, (lid, k)
        c[k] = v
for lid, order in FIX.get('starters', {}).items():
    pass
BANDS = json.load(open(os.path.join(HERE, 'estimating_bands.json'), encoding='utf-8'))
for c in CAT:
    b = BANDS['lines'][c['id']]
    out = {'driver': b['driver']}
    for size in ('small', 'typical', 'large'):
        x = {'qty': b[size]['qty']}
        for k in ('scope', 'deliverable', 'acceptance'):
            pairs = b[size].get(k)
            if pairs:
                t = c[k]
                for old, new in pairs:
                    assert t.count(old) == 1, f"{c['id']} {size} {k}: {old!r} found {t.count(old)} times"
                    t = t.replace(old, new)
                x[k] = t
        out[size] = x
    c['bands'] = out
assert set(BANDS['lines']) == set(BY), 'every service needs planning bands, and only services do'
# wording that belongs to a context ('bv': Brand Visibility is in the engagement; 'fsi': the FSI play); outside it the line reads neutrally
for lid, n in FIX.get('neutral', {}).items():
    c = BY[lid]
    for flag, fields in n.items():
        assert flag in ('bv', 'fsi'), (lid, flag)
        for k, pairs in fields.items():
            texts = [c[k]] + [c['bands'][b].get(k, '') for b in ('small', 'large')]
            for old, new in pairs:
                assert any(old in t for t in texts), f'{lid} {flag} {k}: {old!r} not found'
    c['neutral'] = n
blob = json.dumps(CAT, ensure_ascii=False)
assert '—' not in blob and '–' not in blob
rep('<script>const CATALOG=' + raw + ';</script>', '<script>const CATALOG=' + blob + ';</script>')

# ---------- styles ----------
rep('.basis{padding:11px 13px;border:1px solid var(--line);border-radius:4px;font-size:13px;line-height:1.5;margin-top:14px}',
    '.basis{padding:11px 13px;border:1px solid var(--line);border-radius:4px;font-size:13px;line-height:1.5;margin-top:14px}'
    '.basis ul{margin:6px 0 6px 18px;padding:0}.basis li{margin:2px 0}.basis .rec{margin:6px 0 0}'
    '.service-qty{font-size:14px;margin-top:6px;max-width:760px}.service-qty b{font-weight:700}'
    '.why{display:block;font-size:13px;font-weight:600;margin-top:8px;max-width:760px}.why input{display:block;width:100%;margin-top:4px}'
    '.service-flag{font-size:14px;font-weight:600;color:var(--red);margin-top:6px;max-width:760px}'
    '.concept-tag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;border:1.5px solid var(--ink);border-radius:3px;padding:1px 6px;margin-left:10px;vertical-align:3px}'
    '.readiness{border:2px solid var(--red);border-radius:6px;padding:14px 18px;margin:0 0 18px;background:#fff}'
    '.readiness h3{font-size:17px;margin:0 0 6px}.readiness ul{margin:0 0 0 18px;padding:0;font-size:15px}.readiness li{margin:3px 0}'
    '.sow-flag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:1.5px solid #111;border-radius:3px;padding:1px 6px;margin-left:8px}'
    '.sow-deps{margin:6px 0 0 18px;padding:0}.sow-deps li{margin:3px 0}.size-switch{align-self:flex-start}@media print{body.not-ready #sow-preview{display:none}}')
rep('.line-costs{display:grid;grid-template-columns:140px 140px 140px 1fr;gap:16px;align-items:end;margin:16px 0 10px}',
    '.line-costs{display:grid;grid-template-columns:150px 130px 130px 130px 1fr;gap:16px;align-items:end;margin:16px 0 10px}')
rep('.line-costs{grid-template-columns:120px 120px 125px 1fr}', '.line-costs{grid-template-columns:140px 110px 110px 120px 1fr}')

# ---------- Scope step ----------
rep('<label id="prompt-field">Prompts to curate and monitor<input data-cover="prompts" placeholder="e.g. 200 prompts to start, reviewed monthly; adjust to the customer\'s license"></label>',
    '<label id="prompt-field">Prompts to monitor<input type="number" min="1" max="100000" step="1" inputmode="numeric" data-cover="promptCount" placeholder="e.g. 200"><small>Sets the planning band of the three prompt services only. 200 is the usual start; Adobe recommends no number.</small></label>')
rep('<label>Markets and languages<input data-cover="markets" placeholder="e.g. US / English"></label>',
    '<label>Markets and languages<input data-cover="markets" placeholder="e.g. US / English"></label><label id="market-count-field">Markets or languages monitored<input type="number" min="1" max="200" step="1" inputmode="numeric" data-cover="marketCount" placeholder="e.g. 1"><small>Two or three set the prompt services to at least Typical; four to six set Large. Above six markets or 3,000 prompts, you set their hours.</small></label>')
rep('<div class="form-card" id="fsi-context" hidden><h3>Financial services delivery context</h3><p class="hint">This play covers discovery, approved answers and customer handoffs using an existing Brand Concierge deployment.</p>',
    '<div class="form-card" id="fsi-context" hidden><h3>Financial services delivery context</h3><label class="wide">Brand Concierge today<select data-meta="fsiState"><option value="new">Not live yet: implement it in this engagement</option><option value="healthy">Live and healthy: build on it</option><option value="remediate">Live but needs fixes: scope the remediation</option></select></label><p class="hint" id="fsi-note"></p>')
rep('<p class="hint">All fees are calculated from estimated service hours × partner rate. You can override the rate for individual services.</p>',
    '<p class="hint">Fees are planning hours × your approved rate. No cost, margin or overrun is modeled. You can override the rate for individual services.</p>')
rep('<textarea data-meta="terms" rows="3" placeholder="Insert the partner’s payment terms and reference to its applicable agreement."></textarea>',
    '<textarea data-meta="terms" rows="4" placeholder="Billing model (time and materials or fixed fee), invoicing schedule, review windows, customer dependency deadlines, pause and restart terms, change control and the governing agreement."></textarea>')

# ---------- Services step ----------
rep('<p>Starting hours for the work in this play. Enter your rate and the figures are yours; change any line to fit the customer.</p>',
    '<p>Planning hours for this play, each tied to the quantity on its card. They are assumptions to confirm with your delivery lead, not a quote. Enter your approved rate and change any line to fit the customer.</p>')
rep('<div class="size-field">Customer size<div class="size-switch" id="size-switch" role="group" aria-label="Customer size"><button type="button" data-size="small" title="Up to 200 prompts, one market and domain">Small</button><button type="button" data-size="typical" title="200 to 1,000 prompts, up to three markets">Typical</button><button type="button" data-size="large" title="1,000+ prompts, many markets or domains">Large</button></div><small>Set from the prompts on the Scope step</small></div>',
    '<div class="size-field">Delivery size<div class="size-switch" id="size-switch" role="group" aria-label="Delivery size"><button type="button" data-size="small" title="The smallest planning band on every service; each card says what it assumes">Small</button><button type="button" data-size="typical" title="The middle planning band on every service; each card says what it assumes">Typical</button><button type="button" data-size="large" title="The largest planning band on every service; each card says what it assumes">Large</button></div><small>Sets every service\'s planning band; change one on its card.<br>The prompt count sets the prompt services.</small></div>')
rep('<div class="earn-head"><h3>What a partner makes on this play</h3><p id="earn-caption"></p></div>',
    '<div class="earn-head"><h3>Illustrative services fees</h3><p id="earn-caption"></p></div>')
rep('<section id="document-panel" class="panel" role="tabpanel" hidden><div class="document-actions">',
    '<section id="document-panel" class="panel" role="tabpanel" hidden><div class="readiness" id="readiness" hidden></div><div class="document-actions">')

# ---------- statement of work renderer ----------
rep("""    scope += '<div class="sow-context"><strong>Dependencies and risks</strong><p>The customer owns three things the schedule depends on. CDN log forwarding is set up by the customer\\'s IT team and gates Brand Visibility\\'s agentic and referral traffic insights and the CJA connection; the partner starts the strategy and prompt work before it is live and confirms the forwarding date in week one. Analytics and attribution are agreed before any business outcome is evaluated. Content approvals follow the customer\\'s review cadence; delays extend the optimization timeline, not the fee.</p></div>';""",
    """    const deps = Array.isArray(s.dependencies) ? s.dependencies.filter(d => typeof d === 'string' && d.trim()) : [];
    scope += '<div class="sow-context"><strong>Dependencies and risks</strong>' + (deps.length ? '<ul class="sow-deps">' + deps.map(d => '<li>' + escape(d) + '</li>').join('') + '</ul>' : '<p>Customer access, inputs and reviewer availability are confirmed in week one.</p>') + '</div>';
    const model = Array.isArray(s.operatingModel) ? s.operatingModel.filter(d => typeof d === 'string' && d.trim()) : [];
    if (model.length) scope += '<div class="sow-context"><strong>Operating model the customer owns</strong><ul class="sow-deps">' + model.map(d => '<li>' + escape(d) + '</li>').join('') + '</ul><p>The partner can help set these up within the selected services. Ownership and compliance decisions stay with the customer.</p></div>';""")
rep("""      services += '<div class="sow-service"><div class="sow-service-heading"><h3>' + (i + 1) + '. ' + text(line.name, 'Service') + '</h3><span>' + cadence + '</span></div>';
      services += paragraph('Scope', line.scope, 'Define the included activities and quantities.');""",
    """      services += '<div class="sow-service"><div class="sow-service-heading"><h3>' + (i + 1) + '. ' + text(line.name, 'Service') + (line.concept ? '<span class="sow-flag">Service concept</span>' : '') + '</h3><span>' + cadence + '</span></div>';
      if (line.concept) services += '<p class="sow-review-note">Service concept, not quote-ready: write the quantity, deliverable and acceptance criteria before approval.</p>';
      services += paragraph('Scope', line.scope, 'Define the included activities and quantities.');
      if (typeof line.estimateBasis === 'string' && line.estimateBasis.trim()) services += paragraph('Estimate basis', line.estimateBasis);""")
rep("""    let fees = '<p class="sow-section-intro">Estimated services fees in ' + code + '. Fees are based on the scoped effort and the partner\\'s hourly rates.</p>';""",
    """    let fees = '<p class="sow-section-intro">Illustrative services fees in ' + code + ': planning hours \\u00d7 the partner\\'s hourly rates. The hours are planning assumptions tied to the quantities in section 3 and are confirmed by the partner\\'s delivery lead before approval. No cost, margin or overrun is modeled.</p>';""")
rep("""(monthly ? 'One-time work plus ' + (term === null ? 'the agreed' : hours(term)) + ' months of recurring services' : 'Selected one-time services')""",
    """(monthly ? 'Implementation plus ' + (term === null ? 'the agreed operating term' : 'a ' + hours(term) + '-month operating term') : 'Selected one-time services')""")
rep("""text(s.terms, '[Partner to complete payment terms and governing agreement]')""",
    """text(s.terms, '[Partner to complete under its agreement with the customer: billing model (time and materials or fixed fee); invoicing schedule; review windows for each deliverable; customer dependency deadlines and what happens when they slip; pause and restart terms; the change-control procedure for scope, hours or schedule; and the governing agreement.]')""")
rep("""    const coverageFields = [['domains',s.play==='coworker'?'Applications and environments in scope':'In-scope domains, sites or URLs'],['prompts','Prompt portfolio'],""",
    """    const coverageFields = [['domains',s.play==='coworker'?'Applications and environments in scope':'In-scope domains, sites or URLs'],['fsiState','Brand Concierge today'],['prompts','Prompt portfolio'],""")
rep("""      if (['channels','fsiProducts','fsiReview','fsiHandoff'].includes(key) && !(typeof coverage[key] === 'string' && coverage[key].trim())) continue;""",
    """      if (['channels','fsiProducts','fsiReview','fsiHandoff','fsiState'].includes(key) && !(typeof coverage[key] === 'string' && coverage[key].trim())) continue;
      if (key === 'prompts' && s.noPrompts) continue;
      if (key === 'pages' && s.noPages) continue;""")

# ---------- app: state ----------
rep("const defaultBrief=p=>({title:'',objective:PLAYS[p].objective,coverage:{estate:'',domains:'',prompts:'',pages:'',markets:'',workflows:'',channels:'',fsiProducts:'',fsiReview:'',fsiHandoff:''}});",
    "const defaultBrief=p=>({title:'',objective:PLAYS[p].objective,coverage:{estate:'',domains:'',prompts:'',promptCount:'',pages:'',markets:'',marketCount:'',workflows:'',channels:'',fsiProducts:'',fsiReview:'',fsiHandoff:''}});")
rep(",terms:'',briefs:{},estimates:{},custom:[],canvas:[],handoffAt:0});",
    ",terms:'',fsiState:'new',briefs:{},estimates:{},custom:[],canvas:[],handoffAt:0});")
rep("""const canvasLine=(c,plays)=>{const n=v=>Math.max(0,Number(v)||0),scope=text(c.scope,'')||text(c.name,'',180);return{id:c.id,name:text(c.name,'',180),stage:['Launch','Connect','Optimize'].includes(c.stage)?c.stage:'Launch',low:n(c.low),base:n(c.base),high:n(c.high),unit:c.unit==='monthly'?'monthly':'one-time',plays,scope,deliverable:text(c.deliverable,scope),acceptance:text(c.acceptance,'Customer confirms the agreed deliverable meets the documented scope.'),assumptions:text(c.assumptions,'Customer and partner agree access, inputs and review responsibilities.'),exclusions:text(c.exclusions,'Work outside the described scope.'),basis:text(c.basis,'Service chosen on the Build canvas.'),source:typeof c.source==='string'&&/^https:\\/\\//.test(c.source)?c.source:'',sourceTitle:text(c.sourceTitle,'')};};""",
    """/* lines only the canvas has (from Adobe documentation research) are service concepts: their deliverable and acceptance are written before the SOW is issued */
const canvasLine=(c,plays)=>{const n=v=>Math.max(0,Number(v)||0),scope=text(c.scope,'')||text(c.name,'',180),concept=c.concept===true;return{id:c.id,name:text(c.name,'',180),stage:['Launch','Connect','Optimize'].includes(c.stage)?c.stage:'Launch',low:n(c.low),base:n(c.base),high:n(c.high),unit:c.unit==='monthly'?'monthly':'one-time',plays,scope,deliverable:concept?text(c.deliverable,''):text(c.deliverable,scope),acceptance:concept?text(c.acceptance,''):text(c.acceptance,'Customer confirms the agreed deliverable meets the documented scope.'),assumptions:concept?text(c.assumptions,''):text(c.assumptions,'Customer and partner agree access, inputs and review responsibilities.'),exclusions:concept?text(c.exclusions,''):text(c.exclusions,'Work outside the described scope.'),basis:concept?'Service concept from Adobe documentation. The hours are a placeholder band until the quantity is written.':text(c.basis,'Service chosen on the Build canvas.'),source:typeof c.source==='string'&&/^https:\\/\\//.test(c.source)?c.source:'',sourceTitle:text(c.sourceTitle,''),concept,bands:c.bands&&typeof c.bands==='object'?c.bands:null};};""")
rep("const newLine=(s,on,size='typical')=>({on,hours:sizeHours(s,size),hoursEdited:false,rate:'',cadence:s.unit==='monthly'?'monthly':'one-time',scope:s.scope,deliverable:s.deliverable,acceptance:s.acceptance,assumptions:s.assumptions,exclusions:s.exclusions,scopeChanged:false});",
    """/* planning bands: each service names the quantity its Small, Typical and Large hours assume; Small and Large rewrite the deliverable text to match */
const bandText=(s,b,k)=>s.bands&&s.bands[b]&&typeof s.bands[b][k]==='string'?s.bands[b][k]:s[k];
const bandQty=(s,b)=>s.bands&&s.bands[b]&&s.bands[b].qty?s.bands[b].qty:'';
/* wording that belongs to a context: Brand Visibility in the engagement ('bv') or the FSI play ('fsi'); outside it the line reads neutrally */
let CUSTOM_BV=true;
const ctxOf=p=>({bv:p==='custom'?CUSTOM_BV:p!=='coworker',fsi:p==='fsi'});
function neutralize(s,p,t,k){if(!s||!s.neutral||typeof t!=='string')return t;const f=ctxOf(p);for(const flag of Object.keys(s.neutral)){if(f[flag])continue;for(const [o,w] of (s.neutral[flag][k]||[]))t=t.split(o).join(w);}return t;}
const lineText=(s,p,b,k)=>neutralize(s,p,['scope','deliverable','acceptance'].includes(k)?bandText(s,b,k):s[k],k);
const newLine=(s,on,size,p)=>({on,band:size,bandSet:false,hours:sizeHours(s,size),hoursEdited:false,hoursWhy:'',rate:'',cadence:s.unit==='monthly'?'monthly':'one-time',scope:lineText(s,p,size,'scope'),deliverable:lineText(s,p,size,'deliverable'),acceptance:lineText(s,p,size,'acceptance'),assumptions:lineText(s,p,size,'assumptions'),exclusions:lineText(s,p,size,'exclusions'),scopeChanged:false});
/* the prompt count sets only the services whose work scales with prompts and markets */
const MONITORING=['L01','L02','O01'];
const baseId=s=>String(s.id).replace(/^CANVAS-/,'');
const intOf=v=>{const m=String(v??'').match(/\\d[\\d,]*/);if(!m)return null;const n=parseInt(m[0].replace(/,/g,''),10);return Number.isFinite(n)&&n>0?n:null;};
const BAND_ORDER=['small','typical','large'];
const promptBand=n=>n<200?'small':n<=1000?'typical':'large';
const marketBand=n=>n<=1?'small':n<=3?'typical':'large';
const PROMPT_CAP=3000,MARKET_CAP=6;
function monitoringBand(p,st=state){const c=st.briefs[p]&&st.briefs[p].coverage||{},n=intOf(c.promptCount);if(!n)return null;const m=intOf(c.marketCount)||1;return BAND_ORDER[Math.max(BAND_ORDER.indexOf(promptBand(n)),BAND_ORDER.indexOf(marketBand(m)))];}
/* above the largest band the partner sets the prompt services' hours and gives the reason */
function monitoringOver(p){const c=state.briefs[p].coverage,n=intOf(c.promptCount),m=intOf(c.marketCount)||1;return !!n&&(n>PROMPT_CAP||m>MARKET_CAP);}""")
rep(" d.size=validSize(s.size)?s.size:'typical';d.sizeManual=s.sizeManual===true;",
    " d.size=validSize(s.size)?s.size:'typical';d.sizeManual=s.sizeManual===true;d.fsiState=['new','healthy','remediate'].includes(s.fsiState)?s.fsiState:s.estimates&&s.estimates.fsi&&s.estimates.fsi.F02&&s.estimates.fsi.F02.on===false?'healthy':'new';")
rep("  for(const k of Object.keys(b.coverage))b.coverage[k]=text(prior.coverage?.[k]);d.briefs[p]=b;d.estimates[p]={};",
    "  for(const k of Object.keys(b.coverage))b.coverage[k]=text(prior.coverage?.[k]);\n  for(const k of ['promptCount','marketCount']){const n=intOf(b.coverage[k]);b.coverage[k]=n?String(n):'';}\n  if(!b.coverage.promptCount){const n=intOf(b.coverage.prompts);if(n)b.coverage.promptCount=String(n);}\n  d.briefs[p]=b;d.estimates[p]={};")
rep("""    r.on=typeof original.on==='boolean'?original.on:r.on;r.hours=amount(original.hours,r.hours);if(r.hours==='')r.hours=0;r.hoursEdited=original.hoursEdited===true;""",
    """    r.on=typeof original.on==='boolean'?original.on:r.on;r.hours=amount(original.hours,r.hours);if(r.hours==='')r.hours=0;r.hoursEdited=original.hoursEdited===true;
    r.band=validSize(original.band)?original.band:BAND_ORDER.find(b=>c[SIZES[b]]===r.hours)||d.size;r.bandSet=original.bandSet===true;r.hoursWhy=text(original.hoursWhy,'',300);""")
rep("""    for(const key of ['scope','deliverable','acceptance','assumptions','exclusions'])if(typeof original[key]==='string')r[key]=text(original[key]);
    const previous=PREVIOUS_SCOPES[c.id];
    if(previous&&Object.keys(previous).every(k=>original[k]===previous[k]))for(const k of Object.keys(previous))r[k]=c[k];
    r.scopeChanged=r.scopeChanged||original.scopeChanged===true||['scope','deliverable','acceptance'].some(k=>r[k]!==c[k]);""",
    """    /* a text the partner never edited (this version's, a band's or an earlier version's) follows the line's band; an edited one is kept */
    let edited=false;
    for(const key of ['scope','deliverable','acceptance','assumptions','exclusions']){if(typeof original[key]!=='string')continue;const o=text(original[key]),known=[c[key],...BAND_ORDER.map(b=>bandText(c,b,key)),PREVIOUS_SCOPES[c.id]?.[key],PRIOR_TEXT[c.id]?.[key]].filter(x=>typeof x==='string');
     if(known.includes(o))r[key]=bandText(c,r.band,key);else{r[key]=o;if(['scope','deliverable','acceptance'].includes(key))edited=true;}}
    r.scopeChanged=r.scopeChanged||edited||(original.scopeChanged===true&&['scope','deliverable','acceptance'].some(k=>r[k]!==bandText(c,r.band,k)));""")
rep("""let state=normalize(blank()),step='scope',toastTimer;""",
    """const PRIOR_TEXT=""" + json.dumps(prior, ensure_ascii=False) + """;
let state=normalize(blank()),step='scope',toastTimer;""")

# ---------- app: fees ----------
rep("""const RATE_RANGE=[100,300];
const rateRangeText=()=>RATE_RANGE.map(money).join(' to ');
""", '')
rep("$('rate-hint').textContent='Partner rates run about '+rateRangeText();$('earn-caption').textContent=t.totalFee===null?'Enter your rate to see your dollars.':state.rate!==''?'At your rate of '+money(Number(state.rate))+' an hour. Change it, the size or any line and these figures update.':'At the rates on each line. Change any line and these figures update.';",
    "$('rate-hint').textContent='Use your approved rate card.';$('earn-caption').textContent=t.totalFee===null?'Enter your approved rate to see illustrative fees: planning hours \\u00d7 your rate. No cost, margin or profit is modeled.':state.rate!==''?'Planning hours \\u00d7 your rate of '+money(Number(state.rate))+' an hour. These are fees, not profit: no cost, margin or overrun is modeled.':'Planning hours \\u00d7 the rates on each line. These are fees, not profit: no cost, margin or overrun is modeled.';")
rep("const t=totals(),m=state.months,span=m===12?'Year one':m+(m===1?' month':' months');",
    "const t=totals(),m=state.months,span='Implementation + '+m+'-month term';")

# ---------- app: selected lines carry their estimate basis; dependencies and the operating model come from the services ----------
rep("function selectedLines(){return entries().filter(s=>row(s).on).map(s=>{const r=row(s),rate=r.rate!==''?Number(r.rate):state.rate!==''?Number(state.rate):null;return {...s,...r,rate,fee:rate===null&&r.hours>0?null:(rate||0)*r.hours};});}",
    """const BAND_NAME={small:'Small',typical:'Typical',large:'Large'};
function estimateBasis(s,r){if(isCustom(s))return 'Partner-defined service and hours.';const per=r.cadence==='monthly'?' a month':'';
 if(s.concept)return 'Service concept: placeholder '+BAND_NAME[r.band].toLowerCase()+' band of '+s[SIZES[r.band]]+' hours'+per+'. Write the quantity before approval.';
 if(s.written)return 'Partner-written service: '+r.hours+' hours'+per+' (the placeholder '+BAND_NAME[r.band]+' band was '+s[SIZES[r.band]]+'); the quantity is in the scope.';
 const plan='Planning band '+BAND_NAME[r.band]+', '+s[SIZES[r.band]]+' hours'+per+': '+bandQty(s,r.band)+'.';
 const why=(r.hoursWhy||'').trim().replace(/[.\\s]+$/,'');
 if(r.hoursEdited)return 'Partner-set hours: '+r.hours+per+' (the '+BAND_NAME[r.band]+' band assumes '+s[SIZES[r.band]]+': '+bandQty(s,r.band)+'). Reason: '+(why||'to be recorded')+'.';
 return plan+(why&&needsWhy(s,r)?' Partner\\'s reason: '+why+'.':'')+' A planning assumption, confirmed by the partner\\'s delivery lead before approval.';}
/* a concept is written when its scope is rewritten and its deliverable, acceptance and assumptions say something */
const realEdit=(a,b)=>{a=String(a||'').trim();b=String(b||'').trim();if(a===b)return false;let i=0;while(i<a.length&&i<b.length&&a[i]===b[i])i++;let j=0;while(j<a.length-i&&j<b.length-i&&a[a.length-1-j]===b[b.length-1-j])j++;return a.length-i-j>=15;};
const conceptDone=(s,r)=>realEdit(r.scope,s.scope)&&['deliverable','acceptance','assumptions'].every(k=>String(r[k]||'').trim().length>=20);
const NO_PROFILE='The baseline is the anonymous, public-information experience; profile-based answers are not assumed.';
function selectedLines(){const out=entries().filter(s=>row(s).on).map(s=>{const r=row(s),rate=r.rate!==''?Number(r.rate):state.rate!==''?Number(state.rate):null,done=s.concept&&conceptDone(s,r),v={...s,concept:s.concept&&!done,written:done};return {...v,...r,rate,fee:rate===null&&r.hours>0?null:(rate||0)*r.hours,estimateBasis:estimateBasis(v,r)};});
 /* when the profile line is scoped, Implement Brand Concierge says so instead of ruling profiles out */
 if(out.some(l=>baseId(l)==='XA09'))for(const l of out)if(baseId(l)==='F02')l.assumptions=l.assumptions.replace(NO_PROFILE,'The baseline is the anonymous, public-information experience; profile-based answers only as scoped in Real-Time CDP context in conversations, after Adobe\\'s written confirmation.');
 return out;}
/* charge both only with a distinct scope: specialized Coworker Skills replace generic Skills, and the shared setup replaces its separate packages */
const SPECIAL_SKILLS=['CW-CJA','CW-AEM','CW-FSI','AXD11','XA25','XA26','XA27'];
const OVERLAPS=[['CW03',SPECIAL_SKILLS]];
function overlapOf(s,lines){const id=baseId(s),o=OVERLAPS.find(x=>x[0]===id);if(!o)return [];return lines.filter(l=>o[1].includes(baseId(l)));}
const FSI_STATE={new:'Not live yet: implemented in this engagement',healthy:'Live and healthy: this engagement builds on it',remediate:'Live but needs fixes: remediation scoped in this engagement'};
function dependencyList(lines){const ids=new Set(lines.map(baseId)),has=(...x)=>x.some(i=>ids.has(i)),out=[];
 const waits=has('C02')?'Deployments and product-page enrichment wait for it.':'Deployments wait for it.',bv=has('L01','L02','L03','O01','O02','C01','C02','C05');
 if(has('L02','C01'))out.push('CDN log forwarding is set up by the customer\\'s IT team. It gates Brand Visibility\\'s AI-agent and referral traffic data'+(has('C01')?' and the CJA connection':'')+'; the partner starts the strategy and prompt work before it is live and confirms the date in week one.');
 if(has('C07'))out.push('Optimize at Edge routing: the partner prepares and tests the rules, and the customer\\'s CDN team (or the partner, with delegated access) applies them in the agreed change window. '+waits);
 else if(has('L03','C02'))out.push('Optimize at Edge routing is applied on the customer\\'s outer CDN by its CDN team (it is self-serve only for AEM as a Cloud Service sites on Adobe\\'s managed Fastly CDN). '+waits);
 if(has('C01','C06','O01','O06'))out.push('Analytics and attribution definitions are agreed before any business outcome is evaluated.'+(bv?' AI-agent activity, monitored visibility, AI-referred visits and conversions, and tested lift are kept as separate measures when reported; lift is claimed only from a tested comparison.':''));
 if(has('A04','A01','A02','A03','A05'))out.push('The customer confirms the page set, templates, integrations, CDN route and DNS ownership before the build starts.');
 if(has('F02','C04','FSI01','CW-FSI'))out.push('The customer names the Brand Concierge operating owner and keeps the approved sources current; answer tests and refusal and escalation scenarios are approved before launch.');
 if(lines.some(l=>/^CW/.test(baseId(l))||SPECIAL_SKILLS.includes(baseId(l))))out.push('Adobe\\'s onboarding team enables Coworker and the eligible applications; customer administrators grant access and approve any connection or plugin.');
 if(has('O02','O03','O04','O05','O07','O08','O09','C03','C05','A02','SO2'))out.push('Content and publishing approvals follow the customer\\'s review cadence. Delays are handled through the change-control and pause terms in section 8.');
 if(lines.some(l=>l.concept))out.push('Service concepts are not quote-ready until their quantity, deliverable and acceptance criteria are written.');
 out.push('Customer access, inputs and reviewer availability are confirmed in week one.');return out;}
const FSI_MODEL=['A named operating owner for the Brand Concierge experience.','The current version of each approved source, with its owner and review date.','A golden-answer test set, run before launch and again after any source or configuration change.','Refusal and escalation scenarios: the questions the experience declines or hands to a person.','Failure handling for a missing source, an answer that fails review, or a handoff that is down.','Source-change triggers: a rate, fee, eligibility or disclosure change starts a review before the update goes live.','Handoff ownership: who staffs live chat or meetings. The documented route is Adobe Marketo Qualifier (another platform is confirmed with Adobe first), which keeps live chat conversations for 30 days.','A controlled rollout: internal end-to-end tests, then a small share of the target pages (Adobe\\'s example starts at 5%), widened as results hold, with at least weekly monitoring.'];
const GEN_MODEL=FSI_MODEL.map(x=>x.startsWith('Source-change triggers')?'Source-change triggers: a product, price or policy change starts a review before the update goes live.':x);
const DOC_TITLE={cja:'Services for Brand Visibility and Customer Journey Analytics',commerce:'Services for Brand Visibility and Adobe Commerce',aem:'Services for Brand Visibility, Sites Optimizer and Edge Delivery Services',fsi:'Services for Brand Visibility and Brand Concierge',abv:'Services for Brand Visibility',coworker:'Services for Adobe CX Enterprise Coworker'};
const listText=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];
const docTitle=()=>state.play==='custom'?(state.customNames.length?'Services for '+listText(state.customNames):'Services for the selected Adobe products'):DOC_TITLE[state.play];""")
rep("function docState(){return {...state,...brief(),title:brief().title||PLAYS[state.play].label+' services'};}",
    """function promptSummary(){const c=brief().coverage,n=intOf(c.promptCount),m=intOf(c.marketCount);if(!n)return c.prompts||'';return n.toLocaleString('en-US')+' prompts'+(m?' in '+m+(m===1?' market or language':' markets or languages'):'')+' (sets the prompt services to the '+BAND_NAME[monitoringBand(state.play)]+' band)';}
function docState(){const lines=selectedLines();return {...state,...brief(),coverage:{...brief().coverage,prompts:promptSummary(),fsiState:state.play==='fsi'?FSI_STATE[state.fsiState]:''},noPrompts:!lines.some(l=>MONITORING.includes(baseId(l))),noPages:!lines.some(l=>['O02','O03','O05','A02','C03','C05','SO2'].includes(baseId(l))),dependencies:dependencyList(lines),operatingModel:lines.some(l=>['F02','C04','FSI01'].includes(baseId(l)))?(state.play==='fsi'?FSI_MODEL:GEN_MODEL):[],title:brief().title||docTitle()};}
/* what must be written before the SOW is issued */
function issues(){const lines=selectedLines(),out=[];
 for(const s of lines){const r=row(s),base=catalog().find(x=>x.id===s.id);if(s.concept)out.push(s.name+': a service concept. Rewrite its scope with the quantity, and write its deliverable, acceptance criteria and assumptions (20 characters or more each), or remove it.');
  const o=overlapOf(s,lines);if(o.length&&!realEdit(r.scope,lineText(base,state.play,r.band,'scope')))out.push(s.name+' overlaps with '+o.map(x=>x.name).join(' and ')+'. Charge both only for distinct work: rewrite its scope to say how it differs, or remove it.');
  if(needsWhy(s,r)&&(r.hoursWhy||'').trim().length<15)out.push(s.name+': '+(r.hoursEdited?'your hours ('+r.hours+') differ from the '+BAND_NAME[r.band]+' band ('+s[SIZES[r.band]]+')':monitoringOver(state.play)?'the prompt count or markets are above the largest band (up to 3,000 prompts in up to six markets or languages), so set its hours yourself':'its band ('+BAND_NAME[r.band]+') differs from the one the prompt count sets ('+BAND_NAME[monitoringBand(state.play)]+')')+'. Give the reason on its card.');}
 for(const s of lines)if(baseId(s)==='XA09'){const r=row(s);if(!(/confirm/i.test(r.assumptions)&&/\\d/.test(r.assumptions)))out.push(s.name+': record Adobe\\'s written confirmation (date or reference) that the Limited Availability integration is enabled for the tenant, use case and region in its assumptions.');}
 if(!state.terms.trim())out.push('Commercial terms (section 8): complete the billing model, invoicing, review windows, dependency deadlines, pause and restart, change control and the governing agreement on the Scope step.');
 if(state.play==='fsi'){const f=state.estimates.fsi.F02,on=!!(f&&f.on),c=brief().coverage,fc=CATALOG.find(x=>x.id==='F02');
  if(state.fsiState==='remediate'&&on&&!realEdit(f.scope,lineText(fc,'fsi',f.band,'scope')))out.push('Implement Brand Concierge: the experience is live but needs fixes, so rewrite its scope to the remediation work, or remove it.');
  if(state.fsiState==='healthy'&&on)out.push('Implement Brand Concierge is on, but the Scope step says Brand Concierge is live and healthy: remove it or change the answer.');
  if(state.fsiState==='new'&&!on)out.push('Brand Concierge is not live yet, but Implement Brand Concierge is off: add it or change the answer on the Scope step.');
  if(!(c.fsiReview||'').trim()||!(c.fsiHandoff||'').trim())out.push('Financial services delivery context: name the approved sources and reviewers, and the handoff route and outcome, on the Scope step.');}
 return out;}
function renderReadiness(){const list=issues(),box=$('readiness');box.hidden=!list.length;document.body.classList.toggle('not-ready',list.length>0);box.innerHTML=list.length?'<h3>Before you issue this SOW</h3><ul>'+list.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><p class="hint">Download, Print and CSV export open once these are done. Save draft works anytime.</p>':'';return list;}
function ready(){if(!renderReadiness().length)return true;if(step!=='document')go('document');toast('Finish the items under Before you issue this SOW first.');return false;}""")

# ---------- app: stage outcomes by play ----------
rep("const STAGES={Launch:['Fixed scope','Outcome: prompt set approved, workspace configured, CDN log forwarding on, baseline recorded.'],Connect:['Fixed scope','Outcome: the integrations and builds live and verified with the customer.'],Optimize:['Program','Outcome: fixes deployed and measured each month, movement reported against named peers.']};\nconst stageHead=st=>'<div class=\"stage-head\"><h3>'+esc(st)+'</h3><span class=\"tag\">'+esc(STAGES[st][0])+'</span><p>'+esc(STAGES[st][1])+'</p></div>';",
    """const STAGES={Launch:['Fixed scope'],Connect:['Fixed scope'],Optimize:['Program']};
/* Connect and Optimize outcomes by kind of play; the Launch outcome is built from the selected services */
const OUTCOMES={bv:{Connect:'Outcome: the integrations and builds live and verified with the customer.',Optimize:'Outcome: fixes deployed each month; visibility and referral movement reported against named peers.'},
 coworker:{Connect:'Outcome: the approved connections or plugin installed and checked.',Optimize:'Outcome: usage reviewed each month and the agreed Skills kept current.'},
 custom:{Connect:'Outcome: each chosen connection configured and tested against its prerequisites.',Optimize:'Outcome: the agreed recurring work delivered and reported each month.'}};
function outcome(st){const fam=['coworker','custom'].includes(state.play)?state.play:'bv';if(st!=='Launch')return OUTCOMES[fam][st];
 const lines=selectedLines(),ids=new Set(lines.map(baseId)),has=(...x)=>x.some(i=>ids.has(i)),parts=[];
 if(has('L01','L02'))parts.push('prompt set approved, workspace configured and baseline recorded; CDN log forwarding on once the customer\\'s IT team completes it');
 if(has('A01','A02','A03'))parts.push('the site built, migrated and launched on Edge Delivery');
 if(has('F02'))parts.push('Brand Concierge ready on the agreed pages');
 if(lines.some(l=>/^CW/.test(baseId(l))&&stageOf(l)==='Launch'))parts.push('Coworker workflows agreed, access and context checked and the pilot accepted');
 return 'Outcome: '+(parts.length?parts.join('; '):'the agreed setup work accepted by the customer')+'.';}
const stageHead=st=>'<div class="stage-head"><h3>'+esc(st)+'</h3><span class="tag">'+esc(STAGES[st][0])+'</span><p>'+esc(outcome(st))+'</p></div>';""")

# ---------- app: scope step ----------
rep(" $('offsite-coverage').hidden=state.play==='coworker';$('fsi-context').hidden=state.play!=='fsi';\n}",
    " $('offsite-coverage').hidden=state.play==='coworker';$('fsi-context').hidden=state.play!=='fsi';\n $('prompt-field').hidden=$('market-count-field').hidden=!entries().some(s=>MONITORING.includes(baseId(s)));\n $('fsi-note').textContent={new:'This engagement implements Brand Concierge (Implement Brand Concierge is on), then maps discovery questions to approved sources and tests the handoff.',healthy:'This engagement builds on the live Brand Concierge experience: discovery questions, approved sources and the handoff. Implement Brand Concierge is off.',remediate:'The live experience needs fixes first. Implement Brand Concierge stays on: edit its scope to the remediation work before issuing.'}[state.fsiState];\n}")

# ---------- app: service cards ----------
rep("""+(isCustom(s)?'<span class="custom-tag">Custom</span>':'')+'</h3><p class="service-scope">'+esc(r.scope)+'</p>'+(s.source?'<p class="service-source">Source: <a href="'+esc(s.source)+'" target="_blank" rel="noopener">'+esc(s.sourceTitle||'Adobe documentation')+'</a></p>':'')+'</div><button class="remove-line\"""",
    """+(isCustom(s)?'<span class="custom-tag">Custom</span>':'')+(s.concept?'<span class="concept-tag">Service concept, not quote-ready</span>':'')+'</h3><p class="service-scope">'+esc(r.scope)+'</p>'+qtyLine(s,r)+flagLine(s,r)+(s.source?'<p class="service-source">Capability reference: <a href="'+esc(s.source)+'" target="_blank" rel="noopener">'+esc(s.sourceTitle||'Adobe documentation')+'</a></p>':'')+'</div><button class="remove-line\"""")
rep("""×</button></div><div class="line-costs"><label>Estimated hours'""",
    """×</button></div><div class="line-costs">'+bandSelect(s,r)+'<label>Estimated hours'""")
rep("""<div class="basis"><b>Starting scope:</b> '+esc(s.basis)+(isCustom(s)?' Partner-defined hours.':' Hours by customer size: Small '+s.low+', Typical '+s.base+', Large '+s.high+'.')+'</div><div class="form-grid">""",
    """'+basisBlock(s)+'<div class="form-grid">""")
rep("function renderRows(){",
    """function needsWhy(s,r){if(isCustom(s)||s.concept)return false;const mb=MONITORING.includes(baseId(s))?monitoringBand(state.play):null;return r.hoursEdited||(!!mb&&r.bandSet&&r.band!==mb)||(MONITORING.includes(baseId(s))&&monitoringOver(state.play));}
const plural=(n,w)=>n.toLocaleString('en-US')+' '+w+(n===1?'':'s');
function qtyLine(s,r){if(isCustom(s))return '';const per=r.cadence==='monthly'?' a month':'',mb=MONITORING.includes(baseId(s))?monitoringBand(state.play):null,c=brief().coverage;
 const why=r.hoursEdited?'Your hours: '+r.hours+per+' (the '+BAND_NAME[r.band]+' band assumes '+s[SIZES[r.band]]+').':r.bandSet?'Chosen on this card.':mb?'Set by '+plural(intOf(c.promptCount),'prompt')+(intOf(c.marketCount)?' in '+plural(intOf(c.marketCount),'market'):'')+' on the Scope step.':'Set by the delivery size.';
 return '<div class="qty-wrap"><p class="service-qty"><b>Planning band: '+BAND_NAME[r.band]+'.</b> '+esc(s.concept?'Quantity not yet written; describe it in the scope.':s.written?'Partner-written; the quantity is in the scope.':bandQty(s,r.band)+'.')+' '+esc(why)+'</p>'+(needsWhy(s,r)?'<label class="why">Reason for the change, printed in the SOW<input data-line-field="hoursWhy" maxlength="300" value="'+esc(r.hoursWhy||'')+'" placeholder="e.g. the customer already has an approved prompt set"></label>':'')+'</div>';}
function flagLine(s,r){const o=overlapOf(s,selectedLines());return o.length&&r.on?'<p class="service-flag">Overlaps with '+esc(o.map(x=>x.name).join(' and '))+'. Charge both only for distinct work: say how in the scope.</p>':'';}
function bandSelect(s,r){if(isCustom(s))return '';const per=s.unit==='monthly'?' / mo':'';return '<label>Planning band<select data-line-field="band" aria-label="Planning band for '+esc(s.name)+'">'+(r.hoursEdited?'<option value="" selected disabled>Your hours</option>':'')+BAND_ORDER.map(b=>'<option value="'+b+'"'+(!r.hoursEdited&&r.band===b?' selected':'')+'>'+BAND_NAME[b]+', '+s[SIZES[b]]+' h'+per+'</option>').join('')+'</select></label>';}
function basisBlock(s){if(isCustom(s))return '<div class="basis"><b>Partner-defined service and hours.</b></div>';if(s.written)return '<div class="basis"><b>Partner-written service</b> from a concept in Adobe documentation. The hours are the partner\\'s; the quantity is in the scope.</div>';const per=s.unit==='monthly'?' a month':'';
 if(s.concept)return '<div class="basis"><b>Service concept from Adobe documentation.</b> The hours (Small '+s.low+', Typical '+s.base+', Large '+s.high+per+') are placeholder bands. Write the quantity, deliverable, acceptance criteria and assumptions before the SOW is issued.</div>';
 return '<div class="basis"><b>What each band assumes</b>'+(s.bands?' (scales with '+esc(s.bands.driver.charAt(0).toLowerCase()+s.bands.driver.slice(1))+')':'')+'<ul>'+BAND_ORDER.map(b=>'<li>'+BAND_NAME[b]+', '+s[SIZES[b]]+' hours'+per+': '+esc(bandQty(s,b)||'not yet written')+'</li>').join('')+'</ul><p class="rec">Estimate record: a partner planning assumption written October 2026, not yet checked against an independent delivery estimate or delivery actuals. Confirm with your delivery lead before quoting.</p></div>';}
function renderRows(){""")
rep(" renderExtensions();\n}\nfunction renderExtensions(){", " renderExtensions();renderReadiness();\n}\nfunction renderExtensions(){")
rep("C07:'CDN readiness (stores not on Fastly)'", "C07:'CDN readiness and routing'")
rep("function renderDocument(){$('sow-preview').innerHTML=SOWDocument.render(docState(),selectedLines(),totals());}",
    "function renderDocument(){$('sow-preview').innerHTML=SOWDocument.render(docState(),selectedLines(),totals());renderReadiness();}")
rep("""<p>'+sizeHours(s,state.size)+' planning hours · '+(s.unit==='monthly'?'monthly':'one-time')+(s.source?' · <a href="'+esc(s.source)+'" target="_blank" rel="noopener">'+esc(s.sourceTitle||'Source')+'</a>':'')+'</p></div>""",
    """<p>'+sizeHours(s,state.size)+' planning hours ('+BAND_NAME[state.size]+' band) · '+(s.unit==='monthly'?'monthly':'one-time')+(s.concept?' · service concept':'')+(s.source?' · Capability reference: <a href="'+esc(s.source)+'" target="_blank" rel="noopener">'+esc(s.sourceTitle||'Adobe documentation')+'</a>':'')+'</p></div>""")

# ---------- app: events ----------
rep(" if(reset){const c=entries().find(s=>s.id===reset.dataset.reset),prior=row(c);state.estimates[state.play][c.id]={...newLine(c,true,state.size),rate:prior.rate};renderRows();renderTotals();save();}",
    " if(reset){const c=entries().find(s=>s.id===reset.dataset.reset),prior=row(c);state.estimates[state.play][c.id]={...newLine(c,true,state.size,state.play),rate:prior.rate};syncBands(state.play);renderRows();renderTotals();save();}")
rep(" if(node.dataset.meta){const k=node.dataset.meta;state[k]=k==='months'?Math.max(1,Math.min(120,Math.round(Number(node.value)||1))):k==='rate'?amount(node.value,''):text(node.value);save();}",
    " if(node.dataset.meta){const k=node.dataset.meta;state[k]=k==='months'?Math.max(1,Math.min(120,Math.round(Number(node.value)||1))):k==='rate'?amount(node.value,''):text(node.value);if(k==='fsiState')applyFsiState();save();}")
rep(" if(node.dataset.cover){brief().coverage[node.dataset.cover]=text(node.value);if(node.dataset.cover==='prompts'&&!state.sizeManual){const size=sizeFromPrompts(node.value);if(size&&size!==state.size){applySize(size);renderSize();renderRows();renderTotals();}}save();}",
    " if(node.dataset.cover){const k=node.dataset.cover;if(k==='promptCount'||k==='marketCount'){const n=intOf(node.value);brief().coverage[k]=n?String(n):'';syncBands(state.play);renderRows();renderTotals();}else brief().coverage[k]=text(node.value);save();}")
rep("const card=node.closest('[data-line]');if(card&&node.dataset.lineField){const r=state.estimates[state.play][card.dataset.line],k=node.dataset.lineField;if(k==='cadence')return;",
    "const card=node.closest('[data-line]');if(card&&node.dataset.lineField){const r=state.estimates[state.play][card.dataset.line],k=node.dataset.lineField;if(k==='cadence'||k==='band')return;if(k==='hoursWhy'){r.hoursWhy=text(node.value,'',300);save();return;}")
rep("if(card&&node.dataset.lineField==='cadence'){state.estimates[state.play][card.dataset.line].cadence=node.value;state.estimates[state.play][card.dataset.line].scopeChanged=true;renderRows();renderTotals();save();}",
    "if(card&&node.dataset.lineField==='cadence'){state.estimates[state.play][card.dataset.line].cadence=node.value;state.estimates[state.play][card.dataset.line].scopeChanged=true;renderRows();renderTotals();save();}if(card&&node.dataset.lineField==='band'&&validSize(node.value)){const s=entries().find(x=>x.id===card.dataset.line),r=row(s);r.band=node.value;r.bandSet=true;r.hoursEdited=false;r.hours=sizeHours(s,r.band);if(!r.scopeChanged){r.scope=lineText(s,state.play,r.band,'scope');r.deliverable=lineText(s,state.play,r.band,'deliverable');}renderRows();renderTotals();save();toast(s.name+': '+BAND_NAME[r.band]+' band, '+r.hours+' hours.');}")
rep("const sizeFromPrompts=v=>{const n=parseInt(String(v).replace(/[^0-9]/g,''),10);return !n?null:n>1000?'large':n>200?'typical':'small';};\nfunction applySize(size){state.size=size;for(const p of Object.keys(PLAYS))for(const s of catalog().filter(x=>x.plays.includes(p))){const r=state.estimates[p][s.id];if(r&&!r.hoursEdited&&!isCustom(s))r.hours=sizeHours(s,size);}}",
    """/* each line's band: its own choice on the card, else the prompt count for the prompt services, else the delivery size; typed hours and edited text are kept */
function syncBands(p){const mb=monitoringBand(p);for(const s of catalog().filter(x=>x.plays.includes(p))){const r=state.estimates[p][s.id];if(!r||isCustom(s))continue;
 const b=r.bandSet&&validSize(r.band)?r.band:MONITORING.includes(baseId(s))&&mb?mb:state.size;r.band=b;if(!r.hoursEdited)r.hours=sizeHours(s,b);if(!r.scopeChanged)for(const k of ['scope','deliverable','acceptance','assumptions','exclusions'])r[k]=lineText(s,p,b,k);}}
function applySize(size){state.size=size;for(const p of Object.keys(PLAYS))syncBands(p);}
function applyFsiState(){const r=state.estimates.fsi&&state.estimates.fsi.F02;if(!r)return;r.on=state.fsiState!=='healthy';renderScope();toast(state.fsiState==='healthy'?'Implement Brand Concierge is off: the experience is live and healthy.':state.fsiState==='remediate'?'Implement Brand Concierge stays on: edit its scope to the remediation work.':'Implement Brand Concierge is on.');}""")
rep("$('size-switch').onclick=e=>{const b=e.target.closest('[data-size]');if(!b||b.dataset.size===state.size)return;state.sizeManual=true;state.size=b.dataset.size;for(const p of Object.keys(PLAYS))for(const s of catalog().filter(x=>x.plays.includes(p))){const r=state.estimates[p][s.id];if(r&&!r.hoursEdited&&!isCustom(s))r.hours=sizeHours(s,state.size);}renderSize();renderRows();renderTotals();save();toast('Hours set for a '+b.textContent.toLowerCase()+' customer. Lines you edited keep your hours.');};",
    "$('size-switch').onclick=e=>{const b=e.target.closest('[data-size]');if(!b||b.dataset.size===state.size)return;state.sizeManual=true;applySize(b.dataset.size);renderSize();renderRows();renderTotals();save();toast('Planning bands set to '+b.textContent+'. Lines with their own band, the prompt services when a prompt count is set, and lines with your hours keep theirs.');};")
rep("$('download-sow').onclick=()=>{const body=", "$('download-sow').onclick=()=>{if(!ready())return;const body=")
rep("$('print-sow').onclick=()=>{renderDocument();window.print();};", "$('print-sow').onclick=()=>{renderDocument();if(!ready())return;window.print();};")
rep("$('export-csv').onclick=()=>{const header=", "$('export-csv').onclick=()=>{if(!ready())return;const header=")
rep("const rows=selectedLines().map(l=>[state.customer,state.partner,l.name,l.cadence,l.hours,l.rate??'',state.currency,l.fee??'',l.cadence==='monthly'?state.months:'',l.fee===null?'':l.fee*(l.cadence==='monthly'?state.months:1),l.scope,l.deliverable,l.acceptance,l.assumptions,l.exclusions]);",
    "const rows=selectedLines().map(l=>[state.customer,state.partner,l.name,l.cadence,l.hours,l.rate??'',state.currency,l.fee??'',l.cadence==='monthly'?state.months:'',l.fee===null?'':l.fee*(l.cadence==='monthly'?state.months:1),l.scope,l.deliverable,l.acceptance,l.assumptions,l.exclusions,l.estimateBasis]);")
rep("'Included work','Deliverable','Acceptance criteria','Assumptions','Exclusions'];", "'Included work','Deliverable','Acceptance criteria','Assumptions','Exclusions','Estimate basis'];")

# ---------- app: handoff from the canvas ----------
rep("  state.canvas.push(canvasLine(t?{...t,id:'CANVAS-'+l.id,source:t.source,sourceTitle:t.sourceTitle}:{...l,id:'CANVAS-'+l.id,source:l.url,sourceTitle:l.src},[p]));}",
    "  state.canvas.push(canvasLine(t?{...t,id:'CANVAS-'+l.id,source:t.source,sourceTitle:t.sourceTitle}:{...l,id:'CANVAS-'+l.id,source:l.url,sourceTitle:l.src,concept:true,deliverable:'',acceptance:'',assumptions:typeof l.prereqs==='string'?l.prereqs:'',exclusions:''},[p]));}")
rep("  const r=state.estimates[p][s.id]||(state.estimates[p][s.id]=newLine(s,false,state.size));r.on=!!(l&&l.on);if(!r.hoursEdited)r.hours=sizeHours(s,state.size);}",
    "  const r=state.estimates[p][s.id]||(state.estimates[p][s.id]=newLine(s,false,state.size,p));r.on=!!(l&&l.on);}\n syncBands(p);")

# ---------- app: the AEM play's objective promises no AI inclusion (audit: no universal formula) ----------
AEM_OLD = "Build the site on AEM Sites with Edge Delivery Services, keep it right for search with Sites Optimizer, and get it into AI answers with Brand Visibility, then turn their findings into the content and technical improvements that keep it there."
AEM_NEW = "Build the site on AEM Sites with Edge Delivery Services, keep it right for search with Sites Optimizer, and track and improve how it appears in AI answers with Brand Visibility, then turn their findings into content and technical improvements."
rep("objective:'" + AEM_OLD + "'}", "objective:'" + AEM_NEW + "'}")
rep("if(p==='fsi'&&b.objective==='Improve discovery of approved content and align it with the existing Brand Concierge experience and agreed customer next steps.')b.objective=PLAYS.fsi.objective;",
    "if(p==='fsi'&&b.objective==='Improve discovery of approved content and align it with the existing Brand Concierge experience and agreed customer next steps.')b.objective=PLAYS.fsi.objective;\n  if(p==='aem'&&b.objective==='" + AEM_OLD + "')b.objective=PLAYS.aem.objective;")

# ---------- re-test fixes: the play reaches every new line; context-only wording; custom plays know their products ----------
rep("const original=s.estimates?.[p]?.[c.id],r=newLine(c,STARTERS[p].includes(c.id),d.size);", "const original=s.estimates?.[p]?.[c.id],r=newLine(c,STARTERS[p].includes(c.id),d.size,p);")
rep("newLine(s,true,state.size)", "newLine(s,true,state.size,state.play)", 2)
rep(",terms:'',fsiState:'new',briefs:{},estimates:{},custom:[],canvas:[],handoffAt:0});",
    ",terms:'',fsiState:'new',customBV:true,customNames:[],v14:true,briefs:{},estimates:{},custom:[],canvas:[],handoffAt:0});")
rep(" d.size=validSize(s.size)?s.size:'typical';d.sizeManual=s.sizeManual===true;d.fsiState=",
    " CUSTOM_BV=d.customBV=s.customBV!==false;d.customNames=Array.isArray(s.customNames)?s.customNames.filter(x=>typeof x==='string').slice(0,20).map(x=>x.slice(0,60)):[];\n d.size=validSize(s.size)?s.size:'typical';d.sizeManual=s.sizeManual===true;d.fsiState=")
rep("    for(const key of ['scope','deliverable','acceptance','assumptions','exclusions']){if(typeof original[key]!=='string')continue;const o=text(original[key]),known=[c[key],...BAND_ORDER.map(b=>bandText(c,b,key)),PREVIOUS_SCOPES[c.id]?.[key],PRIOR_TEXT[c.id]?.[key]].filter(x=>typeof x==='string');\n     if(known.includes(o))r[key]=bandText(c,r.band,key);else{r[key]=o;if(['scope','deliverable','acceptance'].includes(key))edited=true;}}\n    r.scopeChanged=r.scopeChanged||edited||(original.scopeChanged===true&&['scope','deliverable','acceptance'].some(k=>r[k]!==bandText(c,r.band,k)));",
    "    for(const key of ['scope','deliverable','acceptance','assumptions','exclusions']){if(typeof original[key]!=='string')continue;const o=text(original[key]),known=[c[key],...BAND_ORDER.map(b=>bandText(c,b,key)),PREVIOUS_SCOPES[c.id]?.[key],PRIOR_TEXT[c.id]?.[key]].filter(x=>typeof x==='string').flatMap(x=>[x,neutralize(c,p,x,key)]);\n     if(known.includes(o))r[key]=lineText(c,p,r.band,key);else{r[key]=o;if(['scope','deliverable','acceptance'].includes(key))edited=true;}}\n    r.scopeChanged=r.scopeChanged||edited||(original.scopeChanged===true&&['scope','deliverable','acceptance'].some(k=>r[k]!==lineText(c,p,r.band,k)));")
rep("   d.estimates[p][c.id]=r;\n  }\n }",
    "   d.estimates[p][c.id]=r;\n  }\n  /* drafts saved before CDN readiness joined the Commerce play's starting scope get it back with the pilot or enrichment */\n  if(p==='commerce'&&s.v14!==true&&s.estimates&&s.estimates.commerce){const e=d.estimates.commerce;if(e.C07&&!e.C07.on&&((e.L03&&e.L03.on)||(e.C02&&e.C02.on)))e.C07.on=true;}\n }")
rep("canvasLine=(c,plays)=>{const n=v=>Math.max(0,Number(v)||0),scope=text(c.scope,'')||text(c.name,'',180),concept=c.concept===true;return{",
    "canvasLine=(c,plays)=>{const n=v=>Math.max(0,Number(v)||0),scope=text(c.scope,'')||text(c.name,'',180),concept=c.concept===true;return{neutral:c.neutral&&typeof c.neutral==='object'?c.neutral:null,")
rep("const p=h.play;state.play=p;state.handoffAt=Number(h.at);",
    "const p=h.play;state.play=p;state.handoffAt=Number(h.at);\n if(p==='custom'){CUSTOM_BV=state.customBV=Array.isArray(h.products)?h.products.includes('bv'):true;state.customNames=Array.isArray(h.names)?h.names.filter(x=>typeof x==='string').slice(0,20).map(x=>x.slice(0,60)):[];}")
rep("  state.canvas.push(canvasLine(t?{...t,id:'CANVAS-'+l.id,source:t.source,sourceTitle:t.sourceTitle}:",
    "  state.canvas.push(canvasLine(t?{...t,id:'CANVAS-'+l.id,name:neutralize(t,p,t.name,'name'),basis:neutralize(t,p,t.basis,'basis'),source:t.source,sourceTitle:t.sourceTitle}:")
# default exclusions no longer exclude the site build the AEM play sells; custom title and objective read as a customer document
rep("exclusions:'Software licenses and consumption charges, travel, taxes, third-party fees, platform rebuilds and work outside the selected service scopes are excluded.',",
    "exclusions:NEW_EXCL,")
rep("const blank=()=>({", "const OLD_EXCL='Software licenses and consumption charges, travel, taxes, third-party fees, platform rebuilds and work outside the selected service scopes are excluded.',NEW_EXCL='Software licenses and consumption charges, travel, taxes, third-party fees and work outside the selected service scopes are excluded.';\nconst blank=()=>({")
rep(" for(const key of ['partner','customer','sowId','date','startDate','timeline','approvalPartner','approvalCustomer','responsibilities','exclusions','terms'])d[key]=text(s[key],d[key]);",
    " for(const key of ['partner','customer','sowId','date','startDate','timeline','approvalPartner','approvalCustomer','responsibilities','exclusions','terms'])d[key]=text(s[key],d[key]);\n if(d.exclusions===OLD_EXCL)d.exclusions=NEW_EXCL;")
rep("custom:{group:'Build your own',label:'Your own play',short:'Built on the canvas',objective:'Deliver the agreed services for the products and connections chosen on the Build canvas.'}",
    "custom:{group:'Build your own',label:'Your own play',short:'Built on the canvas',objective:'Deliver the agreed services for the selected Adobe products and their connections.'}")
rep("  if(p==='aem'&&b.objective==='" + AEM_OLD + "')b.objective=PLAYS.aem.objective;",
    "  if(p==='aem'&&b.objective==='" + AEM_OLD + "')b.objective=PLAYS.aem.objective;\n  if(p==='custom'&&b.objective==='Deliver the agreed services for the products and connections chosen on the Build canvas.')b.objective=PLAYS.custom.objective;")

# ---------- re-test fixes, part 3: typed hours that equal a band take that band; the prompt counts read as numbers; old drafts re-band; the CSV says what the fees are; Services' rate and size reach the canvas ----------
rep("if(k==='scope')card.querySelector('.service-scope').textContent=r.scope;}refreshCosts();save();}",
    "if(k==='scope')card.querySelector('.service-scope').textContent=r.scope;}\n  if(k==='hours'){const s=entries().find(x=>x.id===card.dataset.line),hit=isCustom(s)?null:BAND_ORDER.find(b=>sizeHours(s,b)===r.hours);if(hit){r.hoursEdited=false;if(hit!==r.band){r.band=hit;r.bandSet=true;if(!r.scopeChanged){r.scope=lineText(s,state.play,hit,'scope');r.deliverable=lineText(s,state.play,hit,'deliverable');r.acceptance=lineText(s,state.play,hit,'acceptance');card.querySelector('.service-scope').textContent=r.scope;}}}\n   const q=card.querySelector('.qty-wrap');if(q)q.outerHTML=qtyLine(s,r);const bs=card.querySelector('[data-line-field=\"band\"]');if(bs)bs.closest('label').outerHTML=bandSelect(s,r);}\n  refreshCosts();save();}")
rep("if(k==='promptCount'||k==='marketCount'){const n=intOf(node.value);brief().coverage[k]=n?String(n):'';",
    "if(k==='promptCount'||k==='marketCount'){const v=node.valueAsNumber,n=Number.isFinite(v)?Math.floor(v):intOf(node.value);brief().coverage[k]=n>=1?String(n):'';")
rep("if(!data||![2,3,4].includes(data.version)||!validPlay(data.play)||!data.estimates||typeof data.estimates!=='object')throw Error('schema');state=normalize(data);go('scope');toast('Draft opened. Only service scope and partner fees are retained.');",
    "if(!data||![2,3,4].includes(data.version)||!validPlay(data.play)||!data.estimates||typeof data.estimates!=='object')throw Error('schema');state=normalize(data);for(const p of Object.keys(PLAYS))syncBands(p);go('scope');if(!sizeNotice('Draft opened. '))toast('Draft opened. Only service scope and partner fees are retained.');")
rep(" d.size=validSize(s.size)?s.size:'typical';d.sizeManual=s.sizeManual===true;",
    " d.size=validSize(s.size)?s.size:'typical';d.sizeManual=s.sizeManual===true;\n /* drafts from before the fix took their size from the prompt text, so they go back to Typical unless the partner chose it */\n if(s.v14!==true&&s.sizeManual!==true&&d.size!=='typical'){d.size='typical';d.sizeNote=true;}")
rep("function render(){", "function sizeNotice(lead=''){if(!state.sizeNote)return false;delete state.sizeNote;save();toast(lead+'Delivery size reset to Typical: the earlier version set it from the prompt text.');return true;}\nfunction render(){")
rep("render();\n</script></body></html>", "render();sizeNotice();\n</script></body></html>")
rep("const header=['Customer','Partner','Service','Cadence','Estimated hours','Hourly rate','Currency','Estimated fee per period','Recurring term months','Estimated term fee','Included work','Deliverable','Acceptance criteria','Assumptions','Exclusions','Estimate basis'];",
    "const header=['Customer','Partner','Service','Cadence','Estimated hours','Hourly rate','Currency','Estimated fee per period','Recurring term months','Estimated term fee','Included work','Deliverable','Acceptance criteria','Assumptions','Exclusions','Estimate basis','Fee basis'];")
rep("l.scope,l.deliverable,l.acceptance,l.assumptions,l.exclusions,l.estimateBasis]);",
    "l.scope,l.deliverable,l.acceptance,l.assumptions,l.exclusions,l.estimateBasis,FEE_BASIS]);const t=totals();rows.push(['','','Illustrative total: implementation + '+state.months+'-month term','',t.oneHours+t.monthHours*state.months,'',state.currency,'',state.months,t.totalFee??'','','','','','','',FEE_BASIS]);")
rep("$('export-csv').onclick=()=>{if(!ready())return;", "const FEE_BASIS='Illustrative: planning hours x partner rate; no cost, margin or overrun modeled';\n$('export-csv').onclick=()=>{if(!ready())return;")
rep("function save(){try{localStorage.setItem(KEY,JSON.stringify(state));localStorage.removeItem(OLD_KEY);}catch(e){toast('Browser saving unavailable. Use Save draft.');}}",
    "function save(){try{localStorage.setItem(KEY,JSON.stringify(state));localStorage.removeItem(OLD_KEY);syncCanvas();}catch(e){toast('Browser saving unavailable. Use Save draft.');}}\n/* the rate and size set here are the canvas's too, so a trip back to Build keeps them */\nfunction syncCanvas(){const c=JSON.parse(localStorage.getItem('abv-sow-build-v1')||'null');if(!c||typeof c!=='object')return;const rate=state.rate===''?0:Number(state.rate);if(c.rate!==rate||c.size!==state.size||c.v!==2){c.rate=rate;c.size=state.size;c.v=2;localStorage.setItem('abv-sow-build-v1',JSON.stringify(c));}}")

# ---------- re-test fixes, part 4: concepts need real writing and survive a trip to Build; FSI answers are checked against the services; overlap and remediation need a real scope edit ----------
rep(" for(const old of state.canvas.filter(c=>c.plays.includes(p)))delete state.estimates[p][old.id];\n", " const before=state.canvas.filter(c=>c.plays.includes(p)).map(c=>c.id);\n")
rep(" for(const s of catalog().filter(x=>x.plays.includes(p))){if(isCustom(s))continue;const l=byId.get(s.id.replace(/^CANVAS-/,''));",
    " for(const id of before)if(!state.canvas.some(c=>c.id===id))delete state.estimates[p][id];\n for(const s of catalog().filter(x=>x.plays.includes(p))){if(isCustom(s))continue;const l=byId.get(s.id.replace(/^CANVAS-/,''));")
rep("d.canvas.push(canvasLine(c,c.plays));seen.add(c.id);",
    "d.canvas.push(canvasLine({...c,concept:!CATALOG.some(x=>x.id===c.id.replace(/^CANVAS-/,''))},c.plays));seen.add(c.id);")
rep("$('starting-scope').onclick=()=>{for(const s of entries())row(s).on=STARTERS[state.play].includes(s.id);",
    "$('starting-scope').onclick=()=>{for(const s of entries())row(s).on=STARTERS[state.play].includes(s.id);if(state.play==='fsi'&&state.estimates.fsi.F02)state.estimates.fsi.F02.on=state.fsiState!=='healthy';")
rep("placeholder=\"e.g. Existing live chat or appointment route to the designated team; measure qualified enquiries and completed appointments.\"",
    "placeholder=\"e.g. Live chat and meeting booking through Adobe Marketo Qualifier to the designated team (another platform needs Adobe's confirmation); measure qualified enquiries and completed appointments.\"")
rep("      if (['channels','fsiProducts','fsiReview','fsiHandoff','fsiState'].includes(key) && !(typeof coverage[key] === 'string' && coverage[key].trim())) continue;",
    "      if (['channels','fsiState'].includes(key) && !(typeof coverage[key] === 'string' && coverage[key].trim())) continue;")

# ---------- app: starters and first render ----------
rep("commerce:['L01','L02','L03','C02','O01','O02']", "commerce:['L01','L02','L03','C02','C07','O01','O02']")
rep("applyHandoff();\n", "applyHandoff();\nfor(const p of Object.keys(PLAYS))syncBands(p);\n")

assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 14 applied:', len(CAT), 'services with planning bands;', len(prior), 'services with revised text')
