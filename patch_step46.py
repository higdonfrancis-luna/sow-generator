"""Step 46 on the SOW steps (Nov 4 2026, Adam: "yes" to the client sweep): a service researched on the canvas speaks to
the partner there ("your client"); when it comes over with the hand-over as a service concept, its name, scope and
prerequisites read "the Client", as the rest of the statement of work does; and a saved FSI engagement still on the
play's objective as it read before the sweep takes the new one, as does one still on the default responsibilities.
Run once on the step 45 SOW page, after
sweep46_apply.py, then build_site.py.

    python3 sow/patch_step46.py sow/index.html
"""
import sys
path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'docVoice' not in html and 'PRIOR46' in html, 'run this once, after sweep46_apply.py'


def rep(old, new):
    global html
    assert html.count(old) == 1, old[:90]
    html = html.replace(old, new)


BR = html.count('{') - html.count('}')
rep("function applyHandoff(){",
    "/* step 46: the canvas says \"your client\" to the partner; in the statement of work the party is \"the Client\" */\n"
    "const docVoice=t=>typeof t==='string'?t.replace(/\\b([Yy])our client\\b/g,(m,y)=>y==='Y'?'The Client':'the Client'):t;\n"
    "function applyHandoff(){")
rep("{...l,id:'CANVAS-'+l.id,source:l.url,sourceTitle:l.src,concept:true,deliverable:'',acceptance:'',assumptions:typeof l.prereqs==='string'?l.prereqs:'',exclusions:''}",
    "{...l,name:docVoice(l.name),scope:docVoice(l.scope),id:'CANVAS-'+l.id,source:l.url,sourceTitle:l.src,concept:true,deliverable:'',acceptance:'',assumptions:typeof l.prereqs==='string'?docVoice(l.prereqs):'',exclusions:''}")
# a saved FSI engagement still on the play's objective as it read before the sweep takes the new one
FSI45 = ("Improve AI discovery of the agreed banking, insurance or financial-services offering, align Brand Concierge answers with "
         "customer-approved sources and disclosures, and support a measured handoff to the customer-designated team.")
assert FSI45 not in html and "Client-approved sources and disclosures" in html
rep("if(p==='fsi'&&b.objective==='Improve discovery of approved content and align it with the existing Brand Concierge experience and agreed customer next steps.')b.objective=PLAYS.fsi.objective;",
    "if(p==='fsi'&&b.objective==='Improve discovery of approved content and align it with the existing Brand Concierge experience and agreed customer next steps.')b.objective=PLAYS.fsi.objective;\n"
    "  if(p==='fsi'&&b.objective==='" + FSI45 + "')b.objective=PLAYS.fsi.objective;")
# and one still on the default responsibilities as they read before the sweep ("Customer: provide ...") takes the new default
RESP45 = ("Customer: provide approved source material, required access, named reviewers and publishing approvals.\\nPartner: deliver the agreed work, "
          "test the outputs, document changes and coordinate review.\\nAdobe and application owners: confirm supported capabilities and perform any enablement assigned to them.")
assert RESP45 not in html and "responsibilities:'Client: provide approved source material" in html
rep(" if(d.exclusions===OLD_EXCL)d.exclusions=NEW_EXCL;",
    " if(d.exclusions===OLD_EXCL)d.exclusions=NEW_EXCL;\n if(d.responsibilities==='" + RESP45 + "')d.responsibilities=blank().responsibilities;")
assert html.count('{') - html.count('}') == BR
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('step 46 applied on the SOW steps: canvas research services read "the Client"')
