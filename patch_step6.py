"""Step 6 of the SOW tool (Oct 29 2026, from David in product marketing, the Digital Opportunity Reports, the partner
impact stories and the Impact Measurement Engine docs; Adam: "let's build them all"):
- the sizes defined in prompts, markets and domains, shown under the switch; the Scope step's prompt count sets the size
  until the partner picks one by hand
- CDN log forwarding and delivery-network setup in setup's deliverables and acceptance (L02), as an assumption on the
  CJA connection (C01), and a "Dependencies and risks" block in the SOW document's scope section
- the paid-offer and org-enabled-CJA assumptions on C01 (works with Adobe Analytics too)
- Impact Measurement Engine measurement in the deployment pilot (L03: 20 URLs at once, two weeks) and the monthly
  review (O01: before-and-after results, movement against named peers)
- two new AEM lines (A04 discovery and solution architecture, A05 governance and change management) in the AEM play's
  starting scope, and an optional executive-alignment line (X01) on every play
- the services grouped by stage with a one-line outcome, tagged Fixed scope or Program
- a line's fee shows its own range until a rate is set, like the totals
Run once on the step 5 file; every anchor must appear exactly once.

    python3 patch_step6.py index.html
"""
import json
import re
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:70]!r}'
    html = html.replace(old, new)


IME = 'https://experienceleague.adobe.com/en/docs/brand-visibility/using/resources/impact-measurement-engine'
EDS_OVERVIEW = 'https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/overview'
GOVERNANCE = 'https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agents/governance/overview'


def service(id, stage, low, base, high, plays, unit, name, basis, scope, deliverable, acceptance, assumptions, exclusions, source=None, title=None):
    s = {'id': id, 'stage': stage, 'base': base, 'low': low, 'high': high, 'plays': plays, 'unit': unit, 'name': name, 'basis': basis,
         'scope': scope, 'deliverable': deliverable, 'acceptance': acceptance, 'assumptions': assumptions, 'exclusions': exclusions}
    if source:
        s['source'] = source
        s['sourceTitle'] = title
    return s


# ---- catalog text
m = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html, re.S)
catalog = json.loads(m.group(1))
by = {s['id']: s for s in catalog}
assert len(catalog) == 35

by['L02']['scope'] = 'Configure the agreed monitoring portfolio, validate pilot access, confirm the delivery-network setup and get CDN log forwarding enabled with the customer\'s IT team, and record one baseline for the 200 starting prompts and three competitors.'
by['L02']['deliverable'] = 'Configured monitoring, CDN log forwarding enabled with agentic and referral traffic flowing, baseline visibility/citation report and prioritized initial opportunities.'
by['L02']['acceptance'] = 'Pilot users can access the workspace, CDN logs are arriving, and the baseline records the agreed prompts, engines, market and measurement dates.'
by['L02']['assumptions'] = 'An approved prompt plan and supported workspace are available. CDN log forwarding is customer IT work and often the longest item; the partner confirms its date in week one and starts the strategy and prompt work before it is live. The prompt count is the service scope.'

by['L03']['scope'] = 'Configure one supported ABV optimization route, deploy approved changes to at least 20 eligible URLs at once, verify rollback, measure the result with the Impact Measurement Engine after two weeks, and run two operator sessions.'
by['L03']['deliverable'] = 'Validated deployment pilot, release/rollback checklist, the Impact Measurement Engine\'s before-and-after citation report and operator handover.'
by['L03']['acceptance'] = 'Approved pilot changes deploy successfully, rollback is verified, the measurement report is reviewed with the customer, and the customer accepts release ownership.'
by['L03']['source'] = IME
by['L03']['sourceTitle'] = 'Experience League: Impact Measurement Engine'

by['C01']['assumptions'] = 'The native integration is available (it also works with Adobe Analytics), the customer is on the paid Brand Visibility offer (trial workspaces cannot connect), the CJA integration is enabled for the organization, and CDN log forwarding is live, since the connection reads the CDN log summaries. Customer application owners provide access and approve metric definitions.'

by['O01']['scope'] = 'Maintain the prompt portfolio (200 prompts to start) and three competitors; review up to five prompt changes, read the Impact Measurement Engine\'s before-and-after results for the fixes deployed, prioritize up to 10 actions, and hold one customer review using five business measures.'
by['O01']['deliverable'] = 'Prompt change log, visibility and citation trends reported as movement against named peers, prioritized optimization backlog and outcome report.'

new_aem = [
    service('A04', 'Launch', 80, 160, 320, ['aem'], 'one-time', 'Discovery and solution architecture',
            'One site: current-state assessment, the Edge Delivery versus traditional AEM decision, and the target architecture for the agreed page set.',
            'Assess the current sites, vendors and content debt; rationalize duplicated components and templates; decide Edge Delivery versus traditional AEM for the agreed page set; and set the target architecture, integrations and governance model with the customer\'s executives.',
            'Current-state assessment, component rationalization list, architecture decision record and a build plan with owners and dates.',
            'The customer\'s executive sponsors approve the architecture decision and the build plan.',
            'The customer provides access to the current sites, vendors and analytics, and names its approvers. Hours scale with the number of sites, vendors and stakeholders.',
            'The build itself, content migration, and changes to systems outside the agreed scope.',
            EDS_OVERVIEW, 'Experience League: Edge Delivery Services overview'),
    service('A05', 'Launch', 60, 120, 240, ['aem'], 'one-time', 'Governance and change management',
            'One site: design-system standards, content governance, and the change program for the teams who will author and publish.',
            'Set the design-system and component standards every team follows; turn the customer\'s brand and content rules into governance checks in AEM; define roles, approvals and the publishing process; and run the change program (training, playbooks, office hours) for the authoring teams.',
            'Design-system standards, configured governance checks, the roles and approvals model, training materials and a change plan.',
            'The authoring teams publish through the agreed process, and the governance checks run on the agreed templates.',
            'The customer names a content owner and the teams in scope. Hours scale with the number of teams and templates.',
            'Writing the content, the build, and organizational design beyond the authoring teams.',
            GOVERNANCE, 'Experience League: AEM Governance Agent'),
]
exec_line = service('X01', 'Launch', 24, 40, 80, ['abv', 'coworker', 'cja', 'commerce', 'aem', 'fsi'], 'one-time', 'Executive alignment workshops',
                    'One engagement: up to three workshops with the customer\'s executive approvers, before and during delivery.',
                    'Run up to three workshops with the customer\'s executive approvers: agree the business outcome and success measures, work through each approver\'s questions before decisions are made as a group, and review progress against the go-live date.',
                    'Workshop outputs, the agreed success measures and decision log, and an executive progress review.',
                    'The approvers sign off on the outcome, the measures and the plan.',
                    'The customer names its approvers and makes them available. Hours scale with the number of approvers and workshops.',
                    'Ongoing program management (see the monthly services) and work outside the agreed engagement.')
ids = [s['id'] for s in catalog]
catalog.insert(ids.index('A03') + 1, new_aem[1])      # A05 after the launch line
catalog.insert(ids.index('A01'), new_aem[0])          # A04 before the build
catalog.append(exec_line)
assert len(catalog) == 38
html = html[:m.start(1)] + json.dumps(catalog, ensure_ascii=False) + html[m.end(1):]

# ---- starting scope and optional services
rep("aem:['L01','L02','A01','A02','A03','C03','O01','O02']", "aem:['L01','L02','A04','A01','A02','A03','A05','C03','O01','O02']")
rep("const choices=state.play==='coworker'?['CW04']:state.play==='fsi'?['O04','O07','O08','O09','FSI01']:state.play==='commerce'?['C07','O04','O07','O08','O09']:['O04','O07','O08','O09'];",
    "const choices=state.play==='coworker'?['CW04','X01']:state.play==='fsi'?['O04','O07','O08','O09','FSI01','X01']:state.play==='commerce'?['C07','O04','O07','O08','O09','X01']:['O04','O07','O08','O09','X01'];")
rep("C07:'CDN readiness (stores not on Fastly)',CW04:'Connection or plugin setup'};", "C07:'CDN readiness (stores not on Fastly)',CW04:'Connection or plugin setup',X01:'Executive alignment workshops'};")

# ---- sizes: definitions under the switch; the Scope step's prompt count sets the size until the partner picks one
rep('<span id="estimate-caption-tail"></span></div>\n<div class="totals" id="totals"></div>',
    '<span id="estimate-caption-tail"></span></div>\n<p class="size-defs"><b>Small:</b> up to 200 prompts, one market and domain. <b>Typical:</b> 200 to 1,000 prompts, up to three markets. <b>Large:</b> 1,000+ prompts, many markets or domains. Set from the Scope step\'s prompt count; change it here any time.</p>\n<div class="totals" id="totals"></div>')
rep(".estimate-caption b{font-weight:700}", ".estimate-caption b{font-weight:700}.size-defs{font-size:14px;margin:-4px 0 14px}")
rep("const blank=()=>({version:4,play:'cja',size:'typical',", "const blank=()=>({version:4,play:'cja',size:'typical',sizeManual:false,")
rep(" d.size=validSize(s.size)?s.size:'typical';", " d.size=validSize(s.size)?s.size:'typical';d.sizeManual=s.sizeManual===true;")
rep("$('size-switch').onclick=e=>{const b=e.target.closest('[data-size]');if(!b||b.dataset.size===state.size)return;state.size=b.dataset.size;for(const p of Object.keys(PLAYS))",
    "const sizeFromPrompts=v=>{const n=parseInt(String(v).replace(/[^0-9]/g,''),10);return !n?null:n>1000?'large':n>200?'typical':'small';};\n"
    "function applySize(size){state.size=size;for(const p of Object.keys(PLAYS))for(const s of catalog().filter(x=>x.plays.includes(p))){const r=state.estimates[p][s.id];if(r&&!r.hoursEdited&&!isCustom(s))r.hours=sizeHours(s,size);}}\n"
    "$('size-switch').onclick=e=>{const b=e.target.closest('[data-size]');if(!b||b.dataset.size===state.size)return;state.sizeManual=true;state.size=b.dataset.size;for(const p of Object.keys(PLAYS))")
rep(" if(node.dataset.cover){brief().coverage[node.dataset.cover]=text(node.value);save();}",
    " if(node.dataset.cover){brief().coverage[node.dataset.cover]=text(node.value);if(node.dataset.cover==='prompts'&&!state.sizeManual){const size=sizeFromPrompts(node.value);if(size&&size!==state.size){applySize(size);renderSize();renderRows();renderTotals();}}save();}")
rep("const size=state.size;state=normalize({...blank(),partner,rate,currency,size});", "const size=state.size,sizeManual=state.sizeManual;state=normalize({...blank(),partner,rate,currency,size,sizeManual});")

# ---- the services grouped by stage, each with its tag and outcome
rep("function renderRows(){\n const lines=selectedLines();\n $('service-lines').innerHTML=lines.map(s=>{const r=row(s);return '<article class=\"service-card\"",
    "const STAGES={Launch:['Fixed scope','Outcome: prompt set approved, workspace configured, CDN log forwarding on, baseline recorded.'],Connect:['Fixed scope','Outcome: the integrations and builds live and verified with the customer.'],Optimize:['Program','Outcome: fixes deployed and measured each month, movement reported against named peers.']};\n"
    "const stageHead=st=>'<div class=\"stage-head\"><h3>'+esc(st)+'</h3><span class=\"tag\">'+esc(STAGES[st][0])+'</span><p>'+esc(STAGES[st][1])+'</p></div>';\n"
    "function renderRows(){\n const lines=selectedLines();let last='';\n $('service-lines').innerHTML=lines.map(s=>{const r=row(s);const st=STAGES[s.stage]?s.stage:'Launch';const head=st!==last?stageHead(st):'';last=st;return head+'<article class=\"service-card\"")
rep(".service-card{border:1px solid var(--line);border-radius:6px;padding:18px 20px 14px;background:#fff;margin:0 0 12px}",
    ".service-card{border:1px solid var(--line);border-radius:6px;padding:18px 20px 14px;background:#fff;margin:0 0 12px}.stage-head{display:flex;align-items:baseline;flex-wrap:wrap;gap:12px;margin:22px 0 10px;padding-top:14px;border-top:1px solid var(--line)}.stage-head:first-child{margin-top:0;padding-top:0;border-top:0}.stage-head h3{font-size:18px;margin:0}.stage-head .tag{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:1.5px solid var(--ink);border-radius:3px;padding:1px 7px}.stage-head p{margin:0;font-size:14px}")

# ---- a line's fee shows its own range until a rate is set
rep("<div class=\"line-fee\"><strong>'+(s.fee===null?'Enter a rate':money(s.fee))+'</strong><small>'+(r.cadence==='monthly'?'per month':'estimated fee')+'</small></div>",
    "<div class=\"line-fee\"><strong'+(s.fee===null?' class=\"range\"':'')+'>'+lineFeeText(s)+'</strong><small>'+(r.cadence==='monthly'?'per month':'estimated fee')+(s.fee===null?' at '+rateRangeText():'')+'</small></div>")
rep("card.querySelector('.line-fee strong').textContent=s.fee===null?'Enter a rate':money(s.fee);",
    "const feeEl=card.querySelector('.line-fee strong');feeEl.textContent=lineFeeText(s);feeEl.classList.toggle('range',s.fee===null);feeEl.nextElementSibling.textContent=(s.cadence==='monthly'?'per month':'estimated fee')+(s.fee===null?' at '+rateRangeText():'');")
rep("const rateRangeText=()=>RATE_RANGE.map(money).join(' to ')+' an hour';",
    "const rateRangeText=()=>RATE_RANGE.map(money).join(' to ')+' an hour';\nconst lineFeeText=s=>s.fee===null?RATE_RANGE.map(rate=>money(s.hours*rate)).join(' to '):money(s.fee);")
rep(".line-fee strong{display:block;font-size:22px}", ".line-fee strong{display:block;font-size:22px}.line-fee strong.range{font-size:18px}")

# ---- the SOW document: dependencies and risks at the end of the scope section
rep("    html += section(2, 'Scope and coverage', scope);",
    "    scope += '<div class=\"sow-context\"><strong>Dependencies and risks</strong><p>The customer owns three things the schedule depends on. CDN log forwarding is set up by the customer\\'s IT team and gates Brand Visibility\\'s agentic and referral traffic insights and the CJA connection; the partner starts the strategy and prompt work before it is live and confirms the forwarding date in week one. Analytics and attribution are agreed before any business outcome is evaluated. Content approvals follow the customer\\'s review cadence; delays extend the optimization timeline, not the fee.</p></div>';\n"
    "    html += section(2, 'Scope and coverage', scope);")

# ---- a fresh browser-storage key so the new starting scope shows
rep("const KEY='partner-sow-studio-v5',", "const KEY='partner-sow-studio-v6',")

assert '–' not in html and '—' not in html
assert 'Enter a rate' not in html
open(path, 'w', encoding='utf-8').write(html)
print('patched', path, len(html), 'chars;', len(catalog), 'services')
