"""Step 1 of the SOW tool rebuild (Oct 29 2026): six templates in deck order, Adobe red, black and white,
Source Sans 3, the Adobe logo in the masthead, one planning note instead of 27 repeated disclaimers,
and a source link on every service. Run once on the file ChatGPT built; every anchor must appear exactly once.

    python3 patch_step1.py index.html
"""
import base64
import json
import os
import re
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:70]!r}'
    html = html.replace(old, new)


# ---- head: title and the font the ABV pages use
rep('<title>Partner Statement of Work | ABV &amp; Coworker</title>',
    '<title>Partner services statement of work | Adobe Brand Visibility and Coworker</title>'
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    '<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&amp;display=swap" rel="stylesheet">')

# ---- app CSS: everything from :root to the end of the app print block, plus the estimate-origin line
i = html.index('<style>') + len('<style>')
j = html.index('.sow-document{--sow-ink')
app_css = html[i:j]
assert app_css.startswith(':root{--ink:#203343'), app_css[:40]
assert app_css.rstrip().endswith('@media print{#document-panel[hidden]{display:block!important}}'), app_css[-80:]

new_css = r"""
:root{--red:#EB1000;--ink:#1C1C1C;--line:#D9D9D9;--soft:#EDEDED;--font:'Source Sans 3',Arial,sans-serif}
*{box-sizing:border-box}body{margin:0;background:#fff;color:var(--ink);font:15px/1.45 var(--font)}button,input,select,textarea{font:inherit;color:var(--ink)}button,summary{cursor:pointer}button{border:1.5px solid var(--ink);border-radius:4px;background:#fff;color:var(--ink);padding:9px 14px;font-weight:600}button:hover{background:var(--soft)}button.primary{background:var(--red);color:#fff;border-color:var(--red)}button.primary:hover{background:#C40000;border-color:#C40000}button:focus-visible,input:focus,select:focus,textarea:focus,summary:focus-visible{outline:3px solid var(--red);outline-offset:2px}input,select,textarea{border:1.5px solid var(--ink);border-radius:4px;background:#fff;padding:9px 11px;width:100%;min-width:0}input::placeholder,textarea::placeholder{color:#3A3A3A;opacity:1}textarea{resize:vertical}label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600}label small{font-weight:400}h1,h2,h3,p{margin:0}h1{font-size:30px;letter-spacing:-.3px;line-height:1.2;margin-top:4px}h2{font-size:24px;letter-spacing:-.2px}h3{font-size:17px}
.topline{height:5px;background:var(--red)}.masthead{display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:64px;padding:0 28px;border-bottom:1px solid var(--line)}.brand{display:flex;align-items:center;gap:16px}.brand img{height:26px;width:auto;display:block}.brand span{border-left:1px solid var(--line);padding-left:16px;font-weight:600;font-size:17px;white-space:nowrap}
.frame{display:flex;align-items:flex-start}.sidebar{width:280px;flex:none;border-right:1px solid var(--line);padding:24px 0 30px;position:sticky;top:0;min-height:calc(100vh - 69px);max-height:100vh;overflow:auto}.nav-label{font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;padding:0 24px;margin:0 0 8px}.nav-label.divided{margin:18px 24px 8px;padding:18px 0 0;border-top:1px solid var(--line)}.play{display:block;width:100%;border:0;border-left:3px solid transparent;border-radius:0;background:#fff;color:var(--ink);text-align:left;font-size:15px;font-weight:600;line-height:1.3;padding:10px 24px 10px 21px}.play:hover{background:var(--soft)}.play.active{border-left-color:var(--red);color:var(--red)}.play small{display:block;font-size:13px;font-weight:400;margin-top:3px;color:var(--ink)}
main{flex:1;min-width:0;max-width:1480px;padding:26px 34px 70px}.topbar{margin-bottom:12px}.eyebrow{font-size:12px;letter-spacing:1.8px;text-transform:uppercase;color:var(--red);font-weight:700}.top-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.top-actions button,.more summary{font-size:14px;white-space:nowrap}.more{position:relative}.more summary{list-style:none;border:1.5px solid var(--ink);border-radius:4px;background:#fff;padding:9px 14px;font-weight:600}.more summary::-webkit-details-marker{display:none}.more>div{position:absolute;right:0;top:46px;background:#fff;padding:8px;border:1px solid var(--line);border-radius:4px;box-shadow:0 8px 30px #1c1c1c22;z-index:10;width:200px}.more button{display:block;border:0;text-align:left;width:100%}
.steps{display:flex;border-bottom:1px solid var(--line);gap:26px;margin-bottom:22px}.steps button{border:0;border-bottom:3px solid transparent;background:transparent;border-radius:0;padding:10px 0 11px;font-size:16px}.steps button:hover{background:transparent}.steps button[aria-selected=true]{border-color:var(--red)}.panel[hidden]{display:none!important}.section-intro{margin-bottom:18px}.section-intro p,.document-actions p{font-size:15px;margin-top:4px;max-width:820px}.planning-note{font-size:14px;border-left:3px solid var(--red);padding:2px 0 2px 12px;margin:0 0 16px;max-width:980px}
.form-card{background:#fff;border:1px solid var(--line);border-radius:6px;padding:22px;margin-bottom:16px}.form-card h3{margin-bottom:18px}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:17px}.form-grid.three{grid-template-columns:1fr 1fr 1fr}.form-grid .wide{grid-column:1/-1}.span-two{grid-column:span 2}.form-card>label{margin:16px 0}.form-card h3+label{margin-top:0}.hint{font-size:13px;font-weight:400;line-height:1.5;margin-top:12px}.plain-details{font-size:14px;margin-top:18px}.plain-details label{margin-top:12px}.contract-details summary{font-size:16px;font-weight:600}.contract-details[open] summary{margin-bottom:18px}.next-row{display:flex;justify-content:space-between;gap:14px;align-items:center;margin-top:23px}.saved-note{font-size:13px}
.service-intro{display:flex;justify-content:space-between;gap:15px;align-items:center}.estimate-strip{display:flex;flex-wrap:wrap;gap:22px;align-items:flex-end;border:1px solid var(--line);border-radius:6px;padding:16px 18px;margin:0 0 16px}.estimate-strip label{width:140px}.estimate-strip .hint{flex:1;min-width:180px;max-width:420px;margin:0;padding-bottom:9px}.totals{display:grid;grid-template-columns:1fr 1fr 1.2fr;gap:14px;margin:0 0 20px}.total-card{padding:16px 18px;border:1px solid var(--line);border-radius:6px;background:#fff}.total-card:last-child{background:var(--ink);color:#fff;border-color:var(--ink)}.total-card span{display:block;font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:700}.total-card strong{display:block;font-size:30px;margin:6px 0 4px;letter-spacing:-.5px}.total-card small{font-size:14px}
.service-card{border:1px solid var(--line);border-radius:6px;padding:18px 20px 14px;background:#fff;margin:0 0 12px}.service-card-head{display:flex;gap:20px;justify-content:space-between;align-items:flex-start}.service-info{flex:1;min-width:0}.service-info h3{font-size:18px;margin:2px 0 6px}.cadence-label{font-size:12px;color:var(--red);text-transform:uppercase;letter-spacing:1px;font-weight:700}.service-scope{white-space:pre-line;font-size:14px;max-width:760px}.service-source{font-size:13px;margin-top:6px}.service-source a,.available a{color:var(--red);font-weight:600}.remove-line{border:0;background:transparent;font-size:22px;padding:0 6px;line-height:1}.remove-line:hover{background:transparent;color:var(--red)}.line-costs{display:grid;grid-template-columns:140px 140px 140px 1fr;gap:16px;align-items:end;margin:16px 0 10px}.line-fee{text-align:right;padding-bottom:4px}.line-fee strong{display:block;font-size:22px}.line-fee small{font-size:13px}.scope-editor{border-top:1px solid var(--line);margin-top:12px;padding-top:12px;font-size:14px}.scope-editor summary{font-weight:600}.scope-editor .form-grid{margin-top:15px}.scope-editor .basis{padding:11px 13px;border:1px solid var(--line);border-radius:4px;font-size:13px;line-height:1.5;margin-top:14px}.scope-editor .reset-line{font-size:13px;padding:7px 10px;margin-top:13px}.review-hint{font-size:13px;font-weight:600;color:var(--red);margin-top:8px}.empty{border:1px dashed var(--ink);padding:40px;text-align:center;border-radius:6px}.service-foot{max-width:900px}.service-extensions{border:1px solid var(--line);border-radius:6px;padding:18px 20px;margin-top:22px}.service-extensions p{font-size:14px;margin-top:4px}.extension-options{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.extension-options button{font-size:14px}
.document-actions{display:flex;justify-content:space-between;gap:20px;align-items:center;margin-bottom:22px}.modal[hidden]{display:none}.modal{position:fixed;inset:0;background:#1c1c1c99;z-index:50;display:flex;align-items:center;justify-content:center;padding:25px}.modal-card{background:#fff;border-radius:6px;width:800px;max-height:88vh;overflow:auto;padding:26px;border:1px solid var(--line)}.modal-heading{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:18px}.modal-heading button{border:0;font-size:20px}.modal-card>input{margin-bottom:16px}.available{display:flex;gap:18px;justify-content:space-between;align-items:center;border-bottom:1px solid var(--line);padding:15px 0}.available h3{font-size:16px}.available p{font-size:14px;margin-top:4px}.available button{font-size:14px;padding:7px 12px}.custom-entry{margin-top:24px;font-size:15px;font-weight:600}.custom-entry form{margin-top:18px;display:flex;flex-direction:column;gap:15px}.custom-entry form button{align-self:flex-end}#toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--ink);color:#fff;padding:12px 18px;border-radius:4px;display:none;z-index:100;font-size:14px;max-width:80vw}
@media(max-width:1100px){.sidebar{width:236px}main{padding:24px 24px 60px}.line-costs{grid-template-columns:120px 120px 125px 1fr}.total-card strong{font-size:26px}}@media(max-width:780px){.masthead{flex-direction:column;align-items:flex-start;padding:12px 16px}.brand span{white-space:normal}.frame{display:block}.sidebar{position:static;width:auto;max-height:none;border-right:0;border-bottom:1px solid var(--line);padding:14px 0 0}#plays{display:flex;overflow:auto;gap:6px;padding:0 10px 14px}.nav-label{display:none}.play{min-width:170px;max-width:190px;border-left:0;border-bottom:3px solid transparent;padding:8px 10px}.play.active{border-bottom-color:var(--red)}.play small{display:none}main{padding:20px 16px 60px}.steps{gap:20px}.form-grid,.form-grid.three{grid-template-columns:1fr}.span-two{grid-column:auto}.service-intro,.document-actions{flex-direction:column;align-items:flex-start}.line-costs{grid-template-columns:1fr 1fr}.line-fee{text-align:left}.totals{grid-template-columns:1fr}.total-card{padding:15px}.total-card strong{font-size:26px}.form-card,.service-card{padding:17px}.modal{padding:12px}.modal-card{padding:19px}.next-row{align-items:flex-start}.saved-note{max-width:45%}}@media print{body{background:#fff}.topline,.masthead,.sidebar,.topbar,.steps,#scope-panel,#services-panel,.document-actions,.modal,#toast{display:none!important}main{margin:0;padding:0;max-width:none}#document-panel{display:block!important}#sow-preview{margin:0;padding:0}.panel[hidden]#document-panel{display:block!important}@page{size:A4;margin:16mm}}

[hidden]{display:none!important}
@media print{#document-panel[hidden]{display:block!important}}
"""
html = html[:i] + new_css + html[j:]

# ---- the statement of work document: black ink, solid grays, the same font; the partner's paper carries no Adobe red
rep('.sow-document{--sow-ink:#1c3041;--sow-muted:#617183;--sow-line:#dfe5ea;', '.sow-document{--sow-ink:#1C1C1C;--sow-muted:#3A3A3A;--sow-line:#D9D9D9;')
rep("font:14px/1.6 Inter,Arial,sans-serif;padding:54px 62px;box-shadow:0 8px 40px #1530440b;", "font:14px/1.6 'Source Sans 3',Arial,sans-serif;padding:54px 62px;box-shadow:0 8px 40px #1c1c1c14;")
rep('.sow-doc-header{border-top:5px solid #e35242;', '.sow-doc-header{border-top:5px solid #1C1C1C;')
rep('.sow-coverage>div{border-bottom:1px solid #edf0f3;', '.sow-coverage>div{border-bottom:1px solid #EDEDED;')
rep('.sow-context{border-left:3px solid #b4c3cf;padding:10px 16px;margin-top:18px;background:#f5f7f9;', '.sow-context{border-left:3px solid #1C1C1C;padding:10px 16px;margin-top:18px;background:#F5F5F5;')
rep('.sow-service{margin:24px 0;padding-bottom:15px;border-bottom:1px solid #edf0f3}', '.sow-service{margin:24px 0;padding-bottom:15px;border-bottom:1px solid #EDEDED}')
rep('.sow-review-note{font-size:11px!important;color:#795016;border-left:2px solid #d6ae68;padding:7px 10px;margin:12px 0 0!important;background:#fbf7ee}', '.sow-review-note{font-size:11px!important;color:#C40000;border-left:2px solid #C40000;padding:7px 10px;margin:12px 0 0!important;background:#fff}')
rep('color:var(--sow-muted);background:#f3f6f8;border-bottom:1px solid var(--sow-line);padding:11px 8px;', 'color:var(--sow-muted);background:#F2F2F2;border-bottom:1px solid var(--sow-line);padding:11px 8px;')
rep('.sow-document td{padding:12px 8px;border-bottom:1px solid #e8edf1;', '.sow-document td{padding:12px 8px;border-bottom:1px solid #EDEDED;')
rep('.sow-sign-line{border-bottom:1px solid #a8b6c2;', '.sow-sign-line{border-bottom:1px solid #1C1C1C;')
rep('.sow-placeholder{padding:18px;background:#f5f7f9;', '.sow-placeholder{padding:18px;background:#F5F5F5;')
rep('font-size:10pt;line-height:1.45;color:#172d3f;--sow-line:#d1d9df;', 'font-size:10pt;line-height:1.45;color:#1C1C1C;--sow-line:#D9D9D9;')

# ---- body: masthead with the Adobe logo, the sidebar under it, actions in the masthead
logo = base64.b64encode(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'adobe_logo.png'), 'rb').read()).decode()
rep('<aside class="sidebar"><div class="brand"><span>■</span> Partner Services<br><b>Statement of work</b></div><p class="nav-label">Choose your template</p><nav id="plays" aria-label="Sales play templates"></nav><p class="aside-note">Define the work.<br>Estimate the effort.<br>Set your service fees.</p></aside>\n'
    '<main><header class="topbar"><div><p class="eyebrow">Partner delivery planning</p><h1 id="play-title"></h1></div><div class="top-actions"><button id="save-draft">Save draft</button><button id="open-draft">Open draft</button><details class="more"><summary>More</summary><div><button id="download-tool">Download template</button><button id="export-csv">Services CSV</button><button id="new-draft">New opportunity</button></div></details></div></header>',
    '<div class="topline"></div>\n'
    '<header class="masthead"><div class="brand"><img src="data:image/png;base64,' + logo + '" alt="Adobe"><span>Partner services statement of work</span></div><div class="top-actions"><button id="save-draft">Save draft</button><button id="open-draft">Open draft</button><details class="more"><summary>More</summary><div><button id="download-tool">Download template</button><button id="export-csv">Services CSV</button><button id="new-draft">New opportunity</button></div></details></div></header>\n'
    '<div class="frame">\n<aside class="sidebar"><nav id="plays" aria-label="Sales play templates"></nav></aside>\n'
    '<main><header class="topbar"><div><p class="eyebrow">Partner delivery planning</p><h1 id="play-title"></h1></div></header>')
rep('</main><div class="modal" id="service-modal"', '</main></div><div class="modal" id="service-modal"')

# ---- one planning note instead of the repeated disclaimers
rep('<div class="estimate-origin"><strong>Editable planning assumptions</strong><p>The template’s quantities and hours are proposed starting scopes, not Adobe requirements, product limits or delivery benchmarks. Confirm the work and effort with the partner before using the SOW.</p></div>\n',
    '<p class="planning-note">Hours are starting estimates for the work described, not Adobe requirements. Change any line to fit the customer. You set your own rate.</p>\n')
rep('<span class="hint">Hours are estimates for the described scope. A single-page assignment can have a smaller scope and fewer hours.</span>',
    '<span class="hint">Fees are estimated hours × your rate. You can override the rate on any service.</span>')
rep('<p class="hint library-note">Quantities and hours are proposed scope estimates. Off-site publishing and outreach are partner delivery work; placements and AI citations are not guaranteed.</p>', '')
rep('placeholder="e.g. Setup in weeks 1–4, followed by monthly optimization. Confirm milestones and dependencies."',
    'placeholder="e.g. Setup in weeks 1 to 4, followed by monthly optimization. Confirm milestones and dependencies."')

# ---- the catalog: drop the repeated notes, add a readable title for each source
m = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html, re.S)
assert m
catalog = json.loads(m.group(1))
titles = {
    'https://experienceleague.adobe.com/en/docs/brand-visibility/using/dashboards/prompt-management': 'Experience League: Prompts management',
    'https://business.adobe.com/products/brand-visibility.html': 'Adobe: Brand Visibility product page',
    'https://experienceleague.adobe.com/en/docs/analytics-platform/using/integrations/bv/bv': 'Experience League: Brand Visibility and CJA integration',
    'https://experienceleague.adobe.com/en/docs/brand-visibility/using/dashboards/opportunities/enrich-product-detail-pages': 'Experience League: Enrich Product Detail Pages',
    'https://news.adobe.com/news/2026/06/introducing-adobe-brand-visibility': 'Adobe news: Introducing Adobe Brand Visibility',
    'https://experienceleague.adobe.com/en/docs/brand-concierge/content/home': 'Experience League: Brand Concierge',
    'https://experienceleague.adobe.com/en/docs/coworker/content/home': 'Experience League: Adobe CX Enterprise Coworker',
    'https://experienceleague.adobe.com/en/docs/coworker/content/customizations/skills/what-are-skills': 'Experience League: What are Coworker skills?',
    'https://experienceleague.adobe.com/en/docs/coworker/content/customizations/plugins/manage-plugins-for-your-org': 'Experience League: Manage Coworker plugins and marketplaces',
    'https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/coworker/aem-in-coworker': 'Experience League: AEM in Coworker',
    'https://experienceleague.adobe.com/en/docs/brand-concierge/content/getting-started/exporting-conversations-using-adobe-cx-enterprise-coworker': 'Experience League: Exporting Brand Concierge conversations with Coworker',
    'https://experienceleague.adobe.com/en/docs/brand-visibility/using/essentials/best-practices': 'Experience League: Brand Visibility best practices',
}
for s in catalog:
    for key in ('estimateOrigin', 'estimateNote', 'sourceNote'):
        s.pop(key, None)
    s['sourceTitle'] = titles[s['source']]
assert len(catalog) == 28
html = html[:m.start(1)] + json.dumps(catalog, ensure_ascii=False) + html[m.end(1):]

# ---- plays: the four sales plays in deck order, then the two "sell on its own" templates
rep("""const PLAYS={
 abv:{label:'Brand Visibility standalone',short:'Prompt strategy and optimization',objective:""", """const PLAYS={
 cja:{group:'Sales plays',label:'Brand Visibility + Customer Journey Analytics',short:'Cross-sell to CJA customers',objective:'Connect Brand Visibility findings with existing CJA measurement and use observed customer outcomes to prioritize content improvements.'},
 commerce:{group:'Sales plays',label:'Brand Visibility + Adobe Commerce',short:'Cross-sell to Commerce customers',objective:'Improve discovery of the agreed product content and customer journeys using the existing eligible Commerce environment.'},
 aem:{group:'Sales plays',label:'Brand Visibility + AEM Sites on Edge Delivery',short:'New sales pursuit',objective:'Turn Brand Visibility findings into approved content and technical improvements on the agreed existing AEM site or supported delivery route.'},
 fsi:{group:'Sales plays',label:'Brand Visibility + Brand Concierge',short:'Financial services and insurance',objective:'Improve AI discovery of the agreed banking, insurance or financial-services offering, align Brand Concierge answers with customer-approved sources and disclosures, and support a measured handoff to the customer-designated team.'},
 abv:{group:'Sell on its own',label:'Brand Visibility on its own',short:'Prompt strategy and optimization',objective:""")
rep(""" coworker:{label:'Coworker standalone',short:'Team setup and reusable Skills',objective:'Enable the agreed team to use Coworker Chat for bounded workflows, with reusable Skills, validated outputs, training and a clear handover.'},
 cja:{label:'ABV + Customer Journey Analytics',short:'Measurement and outcomes',objective:'Connect Brand Visibility findings with existing CJA measurement and use observed customer outcomes to prioritize content improvements.'},
 commerce:{label:'ABV + Adobe Commerce',short:'Product discovery and conversion',objective:'Improve discovery of the agreed product content and customer journeys using the existing eligible Commerce environment.'},
 aem:{label:'ABV + AEM Sites / EDS',short:'Content and site improvements',objective:'Turn Brand Visibility findings into approved content and technical improvements on the agreed existing AEM site or supported delivery route.'},
 fsi:{label:'Financial services: ABV + Brand Concierge',short:'Approved answers and customer handoffs',objective:'Improve AI discovery of the agreed banking, insurance or financial-services offering, align Brand Concierge answers with customer-approved sources and disclosures, and support a measured handoff to the customer-designated team.'}
};""", """ coworker:{group:'Sell on its own',label:'Coworker on its own',short:'Context, skills and adoption',objective:'Enable the agreed team to use Coworker Chat for bounded workflows, with reusable Skills, validated outputs, training and a clear handover.'}
};""")
rep("const blank=()=>({version:4,play:'abv',", "const blank=()=>({version:4,play:'cja',")
rep(" d.play=validPlay(s.play)?s.play:'abv';", " d.play=validPlay(s.play)?s.play:'cja';")

# ---- sidebar with group labels
rep(""" $('plays').innerHTML=Object.entries(PLAYS).map(([id,p])=>'<button class="play '+(state.play===id?'active':'')+'" data-play="'+id+'">'+esc(p.label)+'<small>'+esc(p.short)+'</small></button>').join('');""",
    """ let nav='',group='';for(const [id,p] of Object.entries(PLAYS)){if(p.group!==group){group=p.group;nav+='<p class="nav-label'+(nav?' divided':'')+'">'+esc(group)+'</p>';}nav+='<button class="play '+(state.play===id?'active':'')+'" data-play="'+id+'">'+esc(p.label)+'<small>'+esc(p.short)+'</small></button>';}$('plays').innerHTML=nav;""")

# ---- totals: a plain label and an honest note when nothing recurs
rep("const money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:state.currency,maximumFractionDigits:2}).format(v);",
    "const money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:state.currency,minimumFractionDigits:0,maximumFractionDigits:2}).format(v);")
rep("""['Monthly services',t.monthFee,t.monthHours+' hours / month'],['Estimated services fees',t.totalFee,'One-time + '+state.months+' months of recurring work']]""",
    """['Monthly services',t.monthFee,t.monthHours+' hours a month'],['Services total',t.totalFee,t.monthHours>0?'One-time work plus '+state.months+' months of recurring services':'One-time services only']]""")

# ---- service cards: a source link under the scope, and a basis line without the repeated note
rep("""<p class="service-scope">'+esc(r.scope)+'</p></div>""",
    """<p class="service-scope">'+esc(r.scope)+'</p>'+(s.source?'<p class="service-source">Source: <a href="'+esc(s.source)+'" target="_blank" rel="noopener">'+esc(s.sourceTitle||'Adobe documentation')+'</a></p>':'')+'</div>""")
rep("""<div class="basis"><b>Example scope and effort:</b> '+s.base+' hours; planning range '+s.low+'–'+s.high+' hours.<br>'+esc(s.basis)+'<br>'+esc(s.estimateNote||'Partner-defined scope and effort. Review the estimate when changing coverage, complexity or cadence.')+'</div>""",
    """<div class="basis"><b>Starting scope:</b> '+esc(s.basis)+' '+s.base+' hours to start; planning range '+s.low+' to '+s.high+' hours.</div>""")

# ---- service library: the same source link
rep("""<p>'+s.base+' planning hours · '+(s.unit==='monthly'?'monthly':'one-time')+'</p></div><button data-add=""",
    """<p>'+s.base+' planning hours · '+(s.unit==='monthly'?'monthly':'one-time')+(s.source?' · <a href="'+esc(s.source)+'" target="_blank" rel="noopener">'+esc(s.sourceTitle||'Source')+'</a>':'')+'</p></div><button data-add=""")

# ---- the downloaded SOW keeps the font
rep("""'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(docState().title)+'</title><style>'""",
    """'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(docState().title)+'</title><link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet"><style>'""")

assert '–' not in html and '—' not in html, 'dashes left in the file'
for leftover in ('estimateNote', 'estimate-origin', 'library-note', 'aside-note', '--navy', '#203343', 'Inter,Arial', 'standalone'):
    assert leftover not in html, f'leftover: {leftover}'
open(path, 'w', encoding='utf-8').write(html)
print('patched', path, len(html), 'chars')
