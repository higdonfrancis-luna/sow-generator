"""Step 17 of the SOW tool (Nov 2 2026): fixes from ChatGPT's last review of the bundle (sow/review_2026-11-02/).
Adam: "you're in charge here; you don't have to take ChatGPT's recommendations for gospel. Take one last look."
Every finding was reproduced first; each fix has a test (sow/test_review_nov2.js) that failed before it.

State and export:
- B01 Opening a draft brings its play, products and service choices to the Build canvas (even in an empty browser),
  and clears a stale handoff, so a trip through Build keeps the draft's engagement. The draft keeps the canvas's
  product ids for Create your own play; older drafts name their products, which the canvas matches by name.
- B02 The canvas sets on or off only the lines it shows. A service added on the Services step that the canvas doesn't
  show (for example the deployment pilot in Brand Visibility on its own, or executive alignment) keeps its choice,
  unless the play was just picked again on the canvas.
- B03 A rate cleared on the canvas clears it here too.
- B04 The canvas total uses each line's own band (including the band the prompt count sets), typed hours, line rate
  and cadence, plus the services added on the Services step, so Build and Services show the same total, in the
  SOW's currency.
- B05 One band helper: a band picked on the card, matched by typed hours, set by the size or by the prompt count
  updates all five texts the partner has not rewritten (scope, deliverable, acceptance, assumptions, exclusions).
- B06 Implement Brand Concierge at Large sets up two handoff routes everywhere (it said one); the plugin package at
  Small and Large says what each band packages.
- B07 Drafts from versions 2 and 3 with a quantity keep the multiplied hours as the partner's hours and a note with
  the unit count; the SOW waits for the reason and the combined deliverable.
- D01 A draft's retired technical SEO line (kept as the partner's own) beside Sites Optimizer's monthly fixes must say
  how it differs, or go, before the SOW is issued.
- Money is kept in cents: line fees round half up to the cent, totals add the rounded fees, and the CSV and the SOW
  show the same figures (cents shown only when there are any).
Wording (checked against Adobe's pages on Nov 2 2026):
- C01 Sites Optimizer setup and monthly fixes name the route for each kind of fix: content fixes into authoring (on
  Edge Delivery, the source documents) for people to publish; Core Web Vitals fixes as code patches that a named
  developer reviews, tests, merges and releases (a connected repository and permission needed); pull requests and
  Dispatcher redirects are Early Access; Core Web Vitals needs pages with at least 1,000 page views.
- C02 CJA audiences: Real-Time Customer Profile is required (a downstream destination doesn't replace it), with the
  publishing permissions and the Person ID from the connection.
- C03 no longer says Adobe documents no route from Brand Visibility to AEM: the route is confirmed for the tenant.
- L03 checks the Last-Modified header where the opportunity needs it, and deploys on the agreed edge route instead of
  configuring one (the CDN line or the customer's CDN team owns routing).
- F02 cites Adobe's pre-go-live checklist and the live chat and meeting booking page, and says plain chat and meeting
  booking don't need Marketo Engage.
Run once on the step 16 file (sow/index.html); every anchor must appear exactly once.

    python3 patch_step17.py index.html
"""
import json
import re
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'const PRIOR15=' in html and 'function syncCanvas(){' in html and 'PRIOR17' not in html, 'run this on the step 16 file'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


m = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html)
raw = m.group(1)
CAT = json.loads(raw)
assert json.dumps(CAT, ensure_ascii=False) == raw
BY = {c['id']: c for c in CAT}
prior = {}  # id -> key -> [step 16 texts, base and bands], so drafts saved with them follow the new wording


def keep_old(lid, key):
    c = BY[lid]
    olds = [c[key]] + [c['bands'][b][key] for b in ('small', 'large') if key in c['bands'][b]]
    prior.setdefault(lid, {}).setdefault(key, [])
    for o in olds:
        if o not in prior[lid][key]:
            prior[lid][key].append(o)


def replace_in(lid, key, old, new, bands=True):
    keep_old(lid, key)
    c = BY[lid]
    assert c[key].count(old) == 1, (lid, key, old)
    c[key] = c[key].replace(old, new)
    for b in ('small', 'large'):
        if bands and key in c['bands'][b]:
            assert c['bands'][b][key].count(old) == 1, (lid, b, key, old)
            c['bands'][b][key] = c['bands'][b][key].replace(old, new)


def append(lid, key, sentence):
    keep_old(lid, key)
    c = BY[lid]
    assert sentence not in c[key]
    c[key] = c[key] + ' ' + sentence
    for b in ('small', 'large'):
        if key in c['bands'][b]:
            c['bands'][b][key] = c['bands'][b][key] + ' ' + sentence


def band_text(lid, band, key, text):
    """a new band-level text; the old one for this band was the base text, which stays known"""
    c = BY[lid]
    assert key not in c['bands'][band], (lid, band, key)
    assert text != c[key]
    c['bands'][band][key] = text


# ---------- B06: each band's texts say the quantity its hours assume ----------
f02 = BY['F02']
band_text('F02', 'large', 'scope', f02['scope'].replace('set up one supported handoff to the customer-designated team',
                                                         'set up two separately agreed, supported handoff routes to the customer-designated teams'))
band_text('F02', 'large', 'deliverable', f02['deliverable'].replace('the source, guardrail and disclosure configuration;',
                                                                     'the source, guardrail and disclosure configuration; both handoff routes, configured and tested;'))
band_text('F02', 'large', 'acceptance', f02['acceptance'].replace('disclosures and the handoff;', 'disclosures and both handoff routes;'))
assert 'two separately agreed' in f02['bands']['large']['scope'] and 'both handoff routes' in f02['bands']['large']['acceptance']
assert 'for the agreed banking or insurance products' in f02['bands']['large']['scope']  # the FSI neutral pair still applies
band_text('CW07', 'small', 'scope', "Package the agreed Skills (up to two, with no connections) as one installable plugin, publish it to a "
          "marketplace repository the customer's administrators add, and document how administrators review and install it.")
band_text('CW07', 'small', 'acceptance', "Administrators review the plugin's Skills, install it, and the agreed users see the Skills working.")
band_text('CW07', 'large', 'scope', "Package the agreed Skills and connections (up to six Skills and four connections) as one installable "
          "plugin, or as two plugins, publish them to a marketplace repository the customer's administrators add, and document how "
          "administrators review and install them.")
band_text('CW07', 'large', 'deliverable', 'The plugin packages, the marketplace repository, the review and install instructions and a '
          'version record for each plugin.')
band_text('CW07', 'large', 'acceptance', "Administrators review each plugin's Skills, install it, and the agreed users see the Skills "
          "and connections working.")

# ---------- C01: Sites Optimizer names the route for each kind of fix ----------
ROUTES_SO1 = ("How a fix is deployed depends on its opportunity. With the Ultimate package, approved content fixes go into authoring "
              "(on Edge Delivery, into the source documents) for people to review and publish, and Core Web Vitals fixes are prepared "
              "as code patches, which need a connected code repository, permission to prepare them and a named developer who reviews, "
              "tests, merges and releases them. Submitting code patches as pull requests and deploying redirects through Dispatcher "
              "are Early Access features, used only where Adobe has enabled them. With Prime, which identifies and suggests fixes, "
              "the first agreed fixes are applied by hand through the content, code or configuration workflow that fits each one. "
              "Adobe analyzes Core Web Vitals only on pages with at least 1,000 page views.")
replace_in('SO1', 'assumptions', "Deploying fixes from Sites Optimizer needs its Ultimate package; with Prime, which identifies and "
           "suggests fixes, the first agreed fixes are applied by hand in authoring.", ROUTES_SO1)
append('SO1', 'scope', 'Agree the route for each kind of fix (authoring, source documents or code patches) and who reviews and releases it.')
replace_in('SO1', 'deliverable', 'the roles and approvals model, and a prioritized list',
           'the roles and approvals model, the route and owner for each kind of fix, and a prioritized list')
replace_in('SO1', 'acceptance', 'The customer can see and approve opportunities, and the first agreed fixes are deployed.',
           'The customer can see and approve opportunities, each kind of fix has an agreed route and owner, the first agreed content '
           'fixes are deployed, and any first code patches are with the named developer.')

so2 = BY['SO2']
replace_in('SO2', 'scope', 'approve or edit the suggested fixes with the content owner, deploy them, and report',
           "approve or edit the suggested fixes with the content owner, deploy the content fixes to authoring for people to publish, "
           "hand the Core Web Vitals code patches to the named developer to review, test, merge and release, and report")
assert so2['scope'].count(' in the Brand Visibility review') == 1
replace_in('SO2', 'deliverable', "Monthly fix log and the month's search results.",
           "Monthly fix log with each fix's route and status, and the month's search results.")
replace_in('SO2', 'acceptance', 'The agreed fixes for the month are deployed and reported.',
           "The month's agreed content fixes are deployed to authoring and published by the customer, its code patches are with the "
           "named developer with their status recorded, and the results are reported.")
BV_FIXES = (", and the site fixes Brand Visibility flags (robots.txt rules for AI crawlers, redirects for pages AI agents can't reach) "
            "are made by hand in the site's configuration or redirect sheet, within the same allowance")
old_so2 = ("Sites Optimizer finds the opportunities and suggests fixes on its own, and with the Ultimate package deploys approved fixes "
           "into authoring for people to publish; these hours cover reviewing and editing the suggestions with the content owner, "
           "publishing and the report. With Prime (identify and suggest only), the approved fixes are applied by hand in authoring. "
           "These are the month's site fixes in one allowance: Sites Optimizer's approved fixes land in authoring and people publish them"
           + BV_FIXES + ".")
new_so2 = ("Sites Optimizer finds the opportunities and suggests fixes on its own. How an approved fix is deployed depends on its "
           "opportunity: with the Ultimate package, content fixes go into authoring (on Edge Delivery, into the source documents) and "
           "people publish them, and Core Web Vitals fixes are prepared as code patches that the named developer reviews, tests, "
           "merges and releases through the existing development workflow. Submitting code patches as pull requests and deploying "
           "redirects through Dispatcher are Early Access features, used only where Adobe has enabled them; otherwise those fixes go "
           "through the customer's own release process. With Prime (identify and suggest only), approved fixes are applied by hand "
           "through the content, code or configuration workflow that fits each one. These hours cover reviewing and editing the "
           "suggestions with the content owner, deploying the content fixes, preparing the code patches and handing them to the "
           "developer, and the report; the developer's review, testing, merge and release are outside these hours unless agreed. "
           "These are the month's site fixes in one allowance" + BV_FIXES + ".")
replace_in('SO2', 'assumptions', old_so2, new_so2)
replace_in('SO2', 'exclusions', 'new content creation (see the content program), and development outside AEM.',
           "new content creation (see the content program), the developer's review, testing, merge and release of code patches "
           "unless agreed, and development outside AEM.")
assert so2['neutral']['bv']['assumptions'] == [[BV_FIXES, '']] and so2['neutral']['bv']['scope'] == [[' in the Brand Visibility review', '']]

# ---------- C02: CJA audiences publish to Real-Time Customer Profile; a destination doesn't replace it ----------
replace_in('C06', 'assumptions', 'The customer licenses Real-Time Customer Profile or another supported destination, and channel owners take part.',
           "The customer is licensed for Experience Platform's Real-Time Customer Profile, which CJA audiences publish to, and has an "
           "administrator with CJA's Audience Publishing permission and Experience Platform's Manage Profiles permission, and an "
           "agreed Person ID in the CJA connection, whose identity namespace becomes each audience's primary identity. Channel owners "
           "confirm identity, consent and the intended use, and take part. Any downstream destination is already configured and "
           "licensed; it does not replace publishing to Real-Time Customer Profile. The source datasets don't need to be enabled for "
           "Profile.")
assert all(o in BY['C06']['assumptions'] for o, _ in BY['C06']['neutral']['bv']['assumptions'])

# ---------- C03: the route from Brand Visibility to AEM is confirmed, not ruled out ----------
replace_in('C03', 'assumptions', "This is a partner-designed workflow: Adobe documents no direct publishing link from Brand Visibility into "
           "AEM, so its findings reach AEM through the customer's authoring and approval process.",
           "The route from Brand Visibility's recommendations to AEM is confirmed for the tenant before work begins: a native route "
           "only where Adobe confirms it is enabled, otherwise this partner-designed workflow, where findings reach AEM through the "
           "customer's authoring and approval process. Publishing to production stays with the customer's review and approval.")

# ---------- L03: deploy on the agreed edge route (routing is owned elsewhere) and check Last-Modified first ----------
l03 = BY['L03']
# the basis is the catalog's description, never saved in a draft
assert l03['basis'] == 'One supported optimization route and one deployment of 20 to 50 eligible URLs.'
l03['basis'] = 'One deployment of 20 to 50 eligible URLs on an agreed Optimize at Edge route.'
replace_in('L03', 'scope', 'Configure one supported Brand Visibility optimization route; deploy approved changes',
           'Using the agreed Optimize at Edge route, deploy approved changes', bands=False)
keep_old('L03', 'scope')
l03['bands']['small']['scope'] = l03['bands']['small']['scope'].replace(
    'Configure one supported Brand Visibility optimization route; deploy approved changes', 'Using the agreed Optimize at Edge route, deploy approved changes')
l03['bands']['large']['scope'] = l03['bands']['large']['scope'].replace(
    'Configure up to two supported Brand Visibility optimization routes; deploy approved changes', 'Using up to two agreed Optimize at Edge routes, deploy approved changes')
assert all('Configure' not in t for t in (l03['scope'], l03['bands']['small']['scope'], l03['bands']['large']['scope']))
append('L03', 'assumptions', "For content opportunities that watch the source page for changes, such as Add LLM-friendly Summaries, Brand "
       "Visibility relies on the page's Last-Modified response header and skips the optimization when it is missing; this pilot "
       "checks the header on the selected pages before deployment, and any fix is agreed with the customer first.")

# ---------- F02: Adobe's current pages next to the claims; plain chat and meetings don't need Marketo Engage ----------
replace_in('F02', 'assumptions', 'is not a documented route and is confirmed with Adobe first.',
           "is not a documented route and is confirmed with Adobe first. Live chat and meeting booking don't need Marketo Engage; "
           "custom routing rules and writing concierge activities to the Marketo person record do.")
f02['source'] = 'https://experienceleague.adobe.com/en/docs/brand-concierge/content/go-live-guide/your-pre-go-live-checklist-and-rollout-plan'
f02['sourceTitle'] = 'Experience League: Brand Concierge pre-go-live checklist and rollout plan'
f02['source2'] = 'https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/sales-handoff/overview'
f02['sourceTitle2'] = 'Live chat and meeting booking'

blob = json.dumps(CAT, ensure_ascii=False)
assert '—' not in blob and '–' not in blob and 'consultants' not in blob
rep('<script>const CATALOG=' + raw + ';</script>', '<script>const CATALOG=' + blob + ';</script>')
rep("const PRIOR15=", "const PRIOR17=" + json.dumps(prior, ensure_ascii=False) + ";\nconst PRIOR15=")
rep("...(PRIOR15[c.id]?.[key]||[])].filter(x=>typeof x==='string')", "...(PRIOR15[c.id]?.[key]||[]),...(PRIOR17[c.id]?.[key]||[])].filter(x=>typeof x==='string')")
rep("'Adobe documentation')+'</a></p>':'')", "'Adobe documentation')+'</a>'+(s.source2?' and <a href=\"'+esc(s.source2)+'\" target=\"_blank\" rel=\"noopener\">'+esc(s.sourceTitle2||'Adobe documentation')+'</a>':'')+'</p>':'')")

# ---------- money in cents ----------
rep("const amount=(v,f=0,max=1e8)=>v===''?'':Number.isFinite(Number(v))&&v!==null&&v!==undefined?Math.min(max,Math.max(0,Number(v))):f;\n",
    "const amount=(v,f=0,max=1e8)=>v===''?'':Number.isFinite(Number(v))&&v!==null&&v!==undefined?Math.min(max,Math.max(0,Number(v))):f;\n"
    "/* money is kept in cents: each line's fee is rounded half up to the cent, and totals add the rounded fees */\n"
    "const cents=v=>Math.round(Number((Number(v)*100).toPrecision(15)))/100;\n")
rep("const money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:state.currency,minimumFractionDigits:0,maximumFractionDigits:2}).format(v);",
    "const money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:state.currency,minimumFractionDigits:Math.round(Math.abs(v)*100)%100?2:0,maximumFractionDigits:2}).format(v);")
rep("new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode(currency), minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value)",
    "new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode(currency), minimumFractionDigits: Math.round(value * 100) % 100 ? 2 : 0, maximumFractionDigits: 2 }).format(value)")
rep("fee:rate===null&&r.hours>0?null:(rate||0)*r.hours,", "fee:rate===null&&r.hours>0?null:cents((rate||0)*r.hours),")
rep("const missing=missingOne+missingMonth;return{oneHours,monthHours,oneFee:missingOne?null:oneFee,monthFee:missingMonth?null:monthFee,totalFee:missing?null:oneFee+monthFee*state.months,missing,months:state.months};}",
    "const missing=missingOne+missingMonth;oneFee=cents(oneFee);monthFee=cents(monthFee);return{oneHours:cents(oneHours),monthHours:cents(monthHours),oneFee:missingOne?null:oneFee,monthFee:missingMonth?null:monthFee,totalFee:missing?null:cents(oneFee+monthFee*state.months),missing,months:state.months};}")
rep("l.fee===null?'':l.fee*(l.cadence==='monthly'?state.months:1),", "l.fee===null?'':cents(l.fee*(l.cadence==='monthly'?state.months:1)),")
rep("t.oneHours+t.monthHours*state.months,'',state.currency", "cents(t.oneHours+t.monthHours*state.months),'',state.currency")

# ---------- B05: one band helper for every way a band changes ----------
rep("function syncBands(p){const mb=monitoringBand(p);for(const s of catalog().filter(x=>x.plays.includes(p))){const r=state.estimates[p][s.id];if(!r||isCustom(s))continue;\n"
    " const b=r.bandSet&&validSize(r.band)?r.band:MONITORING.includes(baseId(s))&&mb?mb:state.size;r.band=b;if(!r.hoursEdited)r.hours=sizeHours(s,b);if(!r.scopeChanged)for(const k of ['scope','deliverable','acceptance','assumptions','exclusions'])r[k]=lineText(s,p,b,k);}}\n",
    "/* a line takes its band's hours unless the partner typed them, and its band's wording in each of the five texts the partner has not rewritten */\n"
    "const TEXT_KEYS=['scope','deliverable','acceptance','assumptions','exclusions'];\n"
    "function applyBand(s,r,b,p){r.band=b;if(!r.hoursEdited)r.hours=sizeHours(s,b);for(const k of TEXT_KEYS){const known=[s[k],...BAND_ORDER.map(x=>bandText(s,x,k))].filter(x=>typeof x==='string').flatMap(x=>[x,neutralize(s,p,x,k)]);if(!r.scopeChanged||known.includes(r[k]))r[k]=lineText(s,p,b,k);}}\n"
    "function syncBands(p){const mb=monitoringBand(p);for(const s of catalog().filter(x=>x.plays.includes(p))){const r=state.estimates[p][s.id];if(!r||isCustom(s))continue;\n"
    " applyBand(s,r,r.bandSet&&validSize(r.band)?r.band:MONITORING.includes(baseId(s))&&mb?mb:state.size,p);}}\n")
rep("const s=entries().find(x=>x.id===card.dataset.line),r=row(s);r.band=node.value;r.bandSet=true;r.hoursEdited=false;r.hours=sizeHours(s,r.band);if(!r.scopeChanged){r.scope=lineText(s,state.play,r.band,'scope');r.deliverable=lineText(s,state.play,r.band,'deliverable');}renderRows();",
    "const s=entries().find(x=>x.id===card.dataset.line),r=row(s);r.bandSet=true;r.hoursEdited=false;applyBand(s,r,node.value,state.play);renderRows();")
rep("if(hit){r.hoursEdited=false;if(hit!==r.band){r.band=hit;r.bandSet=true;if(!r.scopeChanged){r.scope=lineText(s,state.play,hit,'scope');r.deliverable=lineText(s,state.play,hit,'deliverable');r.acceptance=lineText(s,state.play,hit,'acceptance');card.querySelector('.service-scope').textContent=r.scope;}}}",
    "if(hit){r.hoursEdited=false;if(hit!==r.band){r.bandSet=true;applyBand(s,r,hit,state.play);card.querySelector('.service-scope').textContent=r.scope;for(const k of TEXT_KEYS){const ta=card.querySelector('textarea[data-line-field=\"'+k+'\"]');if(ta&&ta.value!==r[k])ta.value=r[k];}}}")

# ---------- B07: an earlier draft's quantity keeps its hours as the partner's, with the unit count, and waits for review ----------
rep(r"    if(Number(s.version)<4){const qty=amount(original.qty,1);r.hours*=qty===''?1:qty;if(qty!==1){r.scope+='\nImported quantity: '+qty+' original scope units. Confirm the combined deliverable.';r.scopeChanged=true;}}" + "\n",
    "")
rep("    r.scopeChanged=r.scopeChanged||edited||(original.scopeChanged===true&&['scope','deliverable','acceptance'].some(k=>r[k]!==lineText(c,p,r.band,k)));\n",
    "    r.scopeChanged=r.scopeChanged||edited||(original.scopeChanged===true&&['scope','deliverable','acceptance'].some(k=>r[k]!==lineText(c,p,r.band,k)));\n"
    "    /* versions 2 and 3 multiplied a line by a quantity: the hours stay as the partner's, the note keeps the unit count, and the SOW waits for the reason and the combined deliverable */\n"
    "    const qty=Number(s.version)<4?amount(original.qty,1):1,units=qty===''?1:qty;\n"
    "    if(units!==1&&!r.scope.includes(IMPORT_NOTE)){r.hours=cents(r.hours*units);r.hoursEdited=true;r.scope+='\\n'+IMPORT_NOTE+units+' original scope units. Write the combined deliverable here and remove this note.';r.scopeChanged=true;}\n")
rep("const PRIOR_TEXT=", "const IMPORT_NOTE='Imported quantity: ';\nconst PRIOR_TEXT=")
rep("  if(needsWhy(s,r)&&(r.hoursWhy||'').trim().length<15)",
    "  if(String(r.scope).includes('\\n'+IMPORT_NOTE))out.push(s.name+': opened from an earlier draft with a quantity. Write the combined deliverable into its scope and remove the import note.');\n"
    "  if(needsWhy(s,r)&&(r.hoursWhy||'').trim().length<15)")

# ---------- D01: the retired technical SEO line, kept from a draft, overlaps Sites Optimizer's monthly fixes ----------
rep("basis:'Kept from this draft: the tool retired this service on November 1, 2026, so it is now your own service.',retired:{",
    "basis:'Kept from this draft: the tool retired this service on November 1, 2026, so it is now your own service.',retiredFrom:'O03',retired:{")
rep("basis:text(c.basis,'Partner-defined service scope.')});seen.add(c.id);",
    "basis:text(c.basis,'Partner-defined service scope.'),...(c.retiredFrom==='O03'?{retiredFrom:'O03'}:{})});seen.add(c.id);")
rep("function overlapOf(s,lines){const id=baseId(s),",
    "/* a draft's retired technical SEO line covers the same site fixes as Sites Optimizer's monthly fixes */\n"
    "function overlapOf(s,lines){if(s.retiredFrom==='O03')return lines.filter(l=>baseId(l)==='SO2');const id=baseId(s),")

# ---------- B01 and B04: the canvas shows this engagement ----------
rep("customBV:true,customNames:[],v14:true,", "customBV:true,customNames:[],customProducts:[],v14:true,")
rep("d.customNames=Array.isArray(s.customNames)?s.customNames.filter(x=>typeof x==='string').slice(0,20).map(x=>x.slice(0,60)):[];",
    "d.customNames=Array.isArray(s.customNames)?s.customNames.filter(x=>typeof x==='string').slice(0,20).map(x=>x.slice(0,60)):[];"
    "d.customProducts=Array.isArray(s.customProducts)?s.customProducts.filter(x=>typeof x==='string'&&/^[\\w-]{1,40}$/.test(x)).slice(0,30):[];")
rep("/* the rate, size, term and every service choice set here are the canvas's too, so a trip back to Build keeps them and both show the same total; the partner's own services live only here */\n"
    "function syncCanvas(){const c=JSON.parse(localStorage.getItem('abv-sow-build-v1')||'null');if(!c||typeof c!=='object')return;const was=JSON.stringify(c);c.rate=state.rate===''?0:Number(state.rate);c.size=state.size;c.months=state.months;c.v=2;\n",
    "/* each line's own settings for the canvas, in every play: on, typed hours or its own band (set on its card, or by the prompt count: p), line rate, cadence, a written-up concept, and the hours of a line the canvas doesn't show */\n"
    "function canvasEff(){const plays={};for(const p of Object.keys(PLAYS)){const est=state.estimates[p]||{},mb=monitoringBand(p),o={};\n"
    "  for(const s of catalog().filter(x=>x.plays.includes(p))){const r=est[s.id];if(!r)continue;const e={m:r.cadence==='monthly'?1:0};if(r.on)e.o=1;\n"
    "   if(isCustom(s)||r.hoursEdited)e.h=Number(r.hours)||0;else if(r.bandSet)e.b=r.band;else if(MONITORING.includes(baseId(s))&&mb){e.b=r.band;e.p=1;}\n"
    "   if(r.rate!=='')e.r=Number(r.rate);if(s.concept&&conceptDone(s,r))e.w=1;if(e.o&&!isCustom(s))e.z=[s.low,s.base,s.high];\n"
    "   if(e.o||'h' in e||e.b||'r' in e||e.w||e.m!==(s.unit==='monthly'?1:0))o[baseId(s)]=e;}\n"
    "  plays[p]=o;}return {v:1,plays};}\n"
    "const canvasPlay=()=>{try{const c=JSON.parse(localStorage.getItem('abv-sow-build-v1')||'null');return c&&typeof c==='object'?c.play:null;}catch(e){return null;}};\n"
    "/* the rate, size, term, currency, every service choice and each line's own settings set here are the canvas's too, so a trip back to Build keeps them and both show the same total;\n"
    "   restore (an opened draft, or Build when the canvas holds another play) also gives the canvas this play and its products, even in an empty browser */\n"
    "function syncCanvas(restore){let c=null;try{c=JSON.parse(localStorage.getItem('abv-sow-build-v1')||'null');}catch(e){}if(!c||typeof c!=='object'||Array.isArray(c)){if(!restore)return;c={};}const was=JSON.stringify(c);\n"
    " if(restore){c.play=state.play;c.ls={};c.keep={};delete c.fresh;delete c.recover;c.on=state.play==='custom'?state.customProducts.slice():[];if(state.play==='custom'&&!c.on.length&&state.customNames.length)c.recover=state.customNames.slice();}\n"
    " c.rate=state.rate===''?0:Number(state.rate);c.size=state.size;c.months=state.months;c.cur=state.currency;c.v=2;c.eff=canvasEff();\n")
rep("document.addEventListener('click',e=>{if(e.target.closest('[data-build]')){save();location.href='../';}});",
    "document.addEventListener('click',e=>{if(e.target.closest('[data-build]')){save();if(canvasPlay()!==state.play)syncCanvas(true);location.href='../';}});")
rep("state=normalize(data);for(const p of Object.keys(PLAYS))syncBands(p);go('scope');if(!sizeNotice('Draft opened. '))toast('Draft opened. Only service scope and partner fees are retained.');",
    "state=normalize(data);for(const p of Object.keys(PLAYS))syncBands(p);state.handoffAt=Math.min(state.handoffAt,Date.now());try{localStorage.removeItem(HANDOFF);}catch(err){}syncCanvas(true);go('scope');"
    "if(!sizeNotice('Draft opened. '))toast(state.play==='custom'&&!state.customProducts.length&&!state.customNames.length?'Draft opened. Its products could not be read: add them again on the Build canvas.':'Draft opened. Build shows its play and service choices.');")

# ---------- B02 and B03: what the canvas hands over ----------
rep("state.customNames=Array.isArray(h.names)?h.names.filter(x=>typeof x==='string').slice(0,20).map(x=>x.slice(0,60)):[];}",
    "state.customNames=Array.isArray(h.names)?h.names.filter(x=>typeof x==='string').slice(0,20).map(x=>x.slice(0,60)):[];"
    "state.customProducts=Array.isArray(h.products)?h.products.filter(x=>typeof x==='string'&&/^[\\w-]{1,40}$/.test(x)).slice(0,30):[];}")
rep(" if(h.rate!==''&&h.rate!==null&&h.rate!==undefined&&Number.isFinite(Number(h.rate)))state.rate=Number(h.rate);\n",
    " /* a rate cleared on the canvas clears it here too; a handoff without a rate leaves it */\n"
    " if('rate' in h){const n=Number(h.rate);state.rate=h.rate===''||h.rate===null||!Number.isFinite(n)||n<=0?'':amount(n,'');}\n")
rep(" for(const s of catalog().filter(x=>x.plays.includes(p))){if(isCustom(s))continue;const l=byId.get(s.id.replace(/^CANVAS-/,''));\n"
    "  const r=state.estimates[p][s.id]||(state.estimates[p][s.id]=newLine(s,false,state.size,p));r.on=!!(l&&l.on);}\n",
    " /* the canvas sets on or off only the lines it shows; a service added here that the canvas doesn't show keeps its choice, unless the play was just picked again */\n"
    " const managed=new Set((Array.isArray(h.managed)?h.managed:h.lines.map(l=>l&&l.id)).filter(x=>typeof x==='string'));\n"
    " for(const s of catalog().filter(x=>x.plays.includes(p))){if(isCustom(s))continue;const id=baseId(s),l=byId.get(id);\n"
    "  const r=state.estimates[p][s.id]||(state.estimates[p][s.id]=newLine(s,false,state.size,p));if(managed.has(id))r.on=!!(l&&l.on);else if(h.fresh===true)r.on=STARTERS[p].includes(s.id);}\n")

assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 17 applied: Nov 2 review fixes (state, export, wording)')
