"""RFI Builder step 73 (Nov 11 2026): Adam tried Read with AI on Proto. "Get rid of this" (the long intro) and "put this
there instead": "The answers provided are suggested drafts, drawn from Adobe's public documentation. Review every
suggestion provided for accuracy." "The Read with AI button is hidden. Put that button and Start over in place of this
text" (the Your call box). "Make the Read with AI much more visible. And it should say something like 'Build Answers with
AI'." On a line under the button saying the RFI's text goes to an AI model: "We don't have to put that there because Adobe
will make the decision as to what they want to use for AI going forward." And: "READ WITH AI took forever to load the
answers and when it did the page moved so slow."

- patch_step49.py: the intro is his one sentence; the Your call box is gone; in its place a row with the red Build
  Answers with AI button and Start over; the filters row holds only the filters.
- rfp_ui.js: the button's names (Build Answers with AI, Undo AI reading), and a count of the seconds while it reads.
- The lag was fixed separately in rfp_answers.js (the products an RFI's questions name, and a question the catalog cannot
  answer, are remembered and not worked out again on every click).

Run once from the repo root, then rebuild:

    python3 sow/patch_step73.py
    python3 sow/build_site.py
"""
import os

SOW = os.path.dirname(os.path.abspath(__file__))


def patch(name, pairs):
    path = os.path.join(SOW, name)
    text = open(path, encoding='utf-8').read()
    bal = lambda t: (t.count('{') - t.count('}'), t.count('(') - t.count(')'), t.count('[') - t.count(']'))
    before = bal(text)
    for old, new in pairs:
        assert text.count(old) == 1, ('anchor not found once', name, old[:90], text.count(old))
        text = text.replace(old, new)
    assert bal(text) == before, ('brackets changed', name, before, bal(text))
    open(path, 'w', encoding='utf-8').write(text)
    print('patched', name, len(pairs))


patch('patch_step49.py', [
    ("<p>Drop your client's RFI. The tool finds the questions and sorts them: the ones about Adobe products it can answer from this catalog, the ones about your firm stay yours. The file is read in your browser only. Nothing is uploaded or stored on a server, unless you choose Read with AI, which sends the RFI’s text to an AI model to list what it asks for: your work stays in this tab until you close it or start over, and Save my work keeps a copy as a file. Answering an RFP? Answer its questions here, then Add to my statement of work to scope and price it.</p>",
     "<p>The answers provided are suggested drafts, drawn from Adobe’s public documentation. Review every suggestion provided for accuracy.</p>"),
    ('<p class="your-call rfp-your-call"><b>Your call.</b> These answers are suggested drafts, drawn from Adobe’s public documentation. Review and edit every answer: you are responsible for what you send to your client.</p>',
     '<div class="rfp-ai-row"><button type="button" class="primary" id="rfp-ai">Build Answers with AI</button><button type="button" id="rfp-clear">Start over</button></div>'),
    ('<button type="button" id="rfp-ai">Read with AI</button><button type="button" id="rfp-clear">Start over</button></div><p class="rfp-left-note"', '</div><p class="rfp-left-note"'),
    (".rfp-filters #rfp-ai{margin-left:auto;border-color:var(--red);color:var(--red);font-weight:700}\n.rfp-filters #rfp-ai:disabled{border-color:#1C1C1C;color:#1C1C1C;cursor:default}\n",
     "/* step 73: Build Answers with AI and Start over, on a row of their own above the filters */\n.rfp-ai-row{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin:6px 0 14px}\n.rfp-ai-row button{min-height:48px;margin:0}\n.rfp-ai-row #rfp-ai{font-size:17px;padding:12px 26px}\n.rfp-ai-row #rfp-ai:disabled{background:#fff;border-color:#1C1C1C;color:#1C1C1C;cursor:default}\n"),
    (".rfp-filters #rfp-ai{margin-left:0}}", "}"),
    (".rfp-your-call{margin:0 0 16px}\n", ""),
])

patch('rfp_ui.js', [
    ("{const b=$r('rfp-ai');b.textContent=aiBusy?'Reading with AI\\u2026':rfp.ai?'Undo Read with AI':'Read with AI';b.disabled=aiBusy;}",
     "{const b=$r('rfp-ai');b.textContent=aiBusy?'Reading with AI\\u2026 '+clock():rfp.ai?'Undo AI reading':'Build Answers with AI';b.disabled=aiBusy;}"),
    ("askReplace('Undoing Read with AI brings back the tool\\'s own list", "askReplace('Undoing the AI reading brings back the tool\\'s own list"),
    ("askReplace('Read with AI replaces the list on screen", "askReplace('Build Answers with AI replaces the list on screen"),
    ("let aiBusy=false;\n", "let aiBusy=false,aiFrom=0,aiTick=null;\n// step 73: the button counts the seconds while the reader works, so a wait of a minute does not look stuck\nconst clock=()=>{const s=Math.max(0,Math.round((Date.now()-aiFrom)/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};\n"),
    ("  aiBusy=true;renderList();status(rfp.name+': reading with AI. A long document can take a few minutes; keep this tab open.');",
     "  aiBusy=true;aiFrom=Date.now();renderList();status(rfp.name+': reading with AI. A long document can take a few minutes; keep this tab open.');\n  aiTick=setInterval(()=>{if(aiBusy)$r('rfp-ai').textContent='Reading with AI\\u2026 '+clock();},1000);"),
    ("  aiBusy=false;\n  if(rfp.questions!==was)return;", "  aiBusy=false;clearInterval(aiTick);\n  if(rfp.questions!==was){renderList();return;}"),
    ("'Read with AI: check the list against the document before you answer. An AI reading can miss or misread a line.'", "'Check the list against the document before you answer. An AI reading can miss or misread a line.'"),
    ("so Undo Read with AI can bring it back", "so Undo AI reading can bring it back"),
])
