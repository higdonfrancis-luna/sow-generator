"""Step 68 (Nov 10 2026, Adam: "sources out by default with the ticks box is drawn that's nice that they could potentially
add it, and then your wording is much better than mine for the caveats", to sow/mockups/nov10_sources_caveat/*.png):

1. The statement of work no longer lists Adobe's capability references under each service. A tick box on the Statement of
   work step, "Add Adobe capability references as an appendix", off by default, adds them as one appendix after Approval,
   under each service's own heading. The preview, Download SOW and Print / PDF follow it; the choice is kept with the
   engagement (drafts too). The canvas cards, the Services step and the Services CSV keep their references as they were.
2. The partner is told, where the partner works, that the services are suggestions: a "Your call" note under the intro of
   the Services step, and one sentence in the fees box on the Build step. Nothing is added to the statement of work, which
   goes to the client.

It was built and first committed as step 67. The RFI Builder's writer, from another session of the same evening, is also
step 67 and was merged in afterwards, so this one was renumbered 68 (Adam: "ok").

Run once from the repo root, then rebuild:

    python3 sow/patch_step68.py
    python3 sow/canvas/build.py && python3 sow/build_site.py
"""
import os

SOW = os.path.dirname(os.path.abspath(__file__))
YOUR_CALL = ("These services and hours are a suggested starting point, drawn from Adobe’s public documentation. They are not "
             "requirements. Add, remove, reword and price them as you see fit: you decide what you propose to your client.")
SUGGESTIONS = ' Services are suggestions: you decide what to propose.'


def patch(name, pairs):
    path = os.path.join(SOW, name)
    text = open(path, encoding='utf-8').read()
    balance = lambda t: (t.count('{') - t.count('}'), t.count('(') - t.count(')'), t.count('[') - t.count(']'))
    before = balance(text)
    for old, new in pairs:
        assert text.count(old) == 1, ('anchor not found once', name, old[:80], text.count(old))
        text = text.replace(old, new)
    assert balance(text) == before, ('braces, parentheses or brackets no longer balance', name)
    open(path, 'w', encoding='utf-8').write(text)


assert 'sowReferences' not in open(os.path.join(SOW, 'index.html'), encoding='utf-8').read(), 'step 68 is already in index.html'

# ---- 1a. the shared references module: the statement of work's list takes the heading it sits under ----
REFS_OLD = ("  function documentHTML(subject) {\n"
            "    const refs = list(subject);\n"
            "    return refs.length ? '<div class=\"sow-detail\"><h4>Capability references</h4><ul>'+refs.map(r=>'<li>'+link(r)+'</li>').join('')+'</ul></div>' : '';\n")
REFS_NEW = ("  /* step 68: in the statement of work the references sit in an appendix, each service's under its own heading */\n"
            "  function documentHTML(subject, heading) {\n"
            "    const refs = list(subject);\n"
            "    return refs.length ? '<div class=\"sow-detail\"><h4>'+escape(heading)+'</h4><ul>'+refs.map(r=>'<li>'+link(r)+'</li>').join('')+'</ul></div>' : '';\n")
# build.py copies references.js into index.html; the canvas template carries its own copy of the module
for name in ('references.js', 'index.html', 'canvas/template.html'):
    patch(name, [(REFS_OLD, REFS_NEW)])

patch('index.html', [
    # ---- 1b. the statement of work: no references under a service; an appendix when the partner asks for one ----
    ("      services += CapabilityReferences.documentHTML(line);\n", ""),
    ("<span>Draft for review</span></footer></div></article>';",
     "<span>Draft for review</span></footer></div>';\n"
     "    /* step 68: Adobe's capability references are an appendix the partner can add, no longer a list under each service */\n"
     "    if (s.sowReferences) {\n"
     "      const refs = list.map((line, i) => CapabilityReferences.documentHTML(line, (i + 1) + '. ' + (line.name || 'Service'))).join('');\n"
     "      if (refs) html += '<section class=\"sow-section sow-appendix\"><h2>Appendix: Adobe capability references</h2><p class=\"sow-section-intro\">Adobe\\u2019s public documentation for the capabilities each service uses.</p>' + refs + '</section>';\n"
     "    }\n"
     "    html += '</article>';"),
    # the choice is part of the engagement: off unless the partner ticked it
    ("handoffAt:0});", "handoffAt:0,sowReferences:false});"),
    ("CUSTOM_BV=d.customBV=s.customBV!==false;", "d.sowReferences=s.sowReferences===true;CUSTOM_BV=d.customBV=s.customBV!==false;"),
    # the tick box, under the step's buttons
    ("<details class=\"readiness\" id=\"readiness\" hidden></details><div id=\"sow-preview\"></div>",
     "<label class=\"sow-refs-toggle\"><input type=\"checkbox\" id=\"sow-refs\"> Add Adobe capability references as an appendix</label>"
     "<details class=\"readiness\" id=\"readiness\" hidden></details><div id=\"sow-preview\"></div>"),
    (".document-actions{display:flex;justify-content:space-between;gap:20px;align-items:center;margin-bottom:22px}",
     ".document-actions{display:flex;justify-content:space-between;gap:20px;align-items:center;margin-bottom:22px}"
     ".sow-refs-toggle{display:flex;flex-direction:row;align-items:center;justify-content:flex-end;gap:8px;font-size:15.5px;font-weight:600;color:#1C1C1C;margin:-8px 0 14px;cursor:pointer}"
     ".sow-refs-toggle input{width:18px;height:18px;flex:none;margin:0;padding:0;accent-color:#1C1C1C}"
     ".sow-appendix{margin-top:28px}@media print{.sow-appendix{break-before:page}}"
     ".your-call{border:1.5px solid #1C1C1C;border-left:6px solid #EB1000;border-radius:10px;padding:12px 16px;margin:0 0 18px;font-size:15.5px;line-height:23px;color:#1C1C1C;background:#fff;max-width:980px}"),
    (",#services-panel,.document-actions,.modal,#toast{display:none!important}", ",#services-panel,.document-actions,.sow-refs-toggle,.modal,#toast{display:none!important}"),
    ("function renderDocument(){const n=renderReadiness().length;", "function renderDocument(){const n=renderReadiness().length;$('sow-refs').checked=state.sowReferences;"),
    ("$('print-sow').onclick=()=>{renderDocument();window.print();};",
     "$('print-sow').onclick=()=>{renderDocument();window.print();};\n"
     "$('sow-refs').onchange=e=>{state.sowReferences=e.target.checked;save();renderDocument();};"),
    # ---- 2a. the Services step: the services are suggestions ----
    ("<button id=\"starting-scope\">Use starting scope</button><button class=\"primary\" id=\"add-service\">+ Add service</button></div></div>",
     "<button id=\"starting-scope\">Use starting scope</button><button class=\"primary\" id=\"add-service\">+ Add service</button></div></div>"
     "<p class=\"your-call\"><b>Your call.</b> " + YOUR_CALL + "</p>"),
])

# ---- 2b. the Build step: one sentence in the fees box ----
patch('canvas/template.html', [
    ("<div class=\"sub\" id=\"t-note\">Hours are planning assumptions, not a quote.", "<div class=\"sub\" id=\"t-note\">Hours are planning assumptions, not a quote." + SUGGESTIONS),
    ("' of this is service concepts with placeholder hours.':'Hours are planning assumptions, not a quote.');",
     "' of this is service concepts with placeholder hours.':'Hours are planning assumptions, not a quote.')+'" + SUGGESTIONS + "';"),
])
print('step 68 applied: references are an optional appendix in the statement of work; the Services and Build steps say the services are suggestions')
