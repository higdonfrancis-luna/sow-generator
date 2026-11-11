"""Step 71 (Nov 11 2026, Adam: "looks great, yes" to sow/mockups/nov10_wave4/wave4_cards.png): Marketo Optimizer and Marketo
Qualifier take their places in the Add product menu, and the RFI Builder knows their names.

- canvas/template.html: both join Campaign management, after Marketo Engage.
- rfp_answers.js: the names and topic words a question uses for the two ("Sales Qualifier" is Marketo Qualifier's former
  name, as Adobe's Brand Concierge guide gives it).

Run once from the repo root, after canvas/data_step71.py, then rebuild:

    python3 sow/canvas/patch_step71.py
    python3 sow/canvas/build.py && python3 sow/build_site.py
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SOW = os.path.dirname(HERE)


def patch(name, pairs):
    path = os.path.join(SOW, name)
    text = open(path, encoding='utf-8').read()
    braces = text.count('{') - text.count('}'), text.count('(') - text.count(')'), text.count('[') - text.count(']')
    for old, new in pairs:
        assert text.count(old) == 1, ('anchor not found once', name, old[:80], text.count(old))
        text = text.replace(old, new)
    assert braces == (text.count('{') - text.count('}'), text.count('(') - text.count(')'), text.count('[') - text.count(']')), name
    open(path, 'w', encoding='utf-8').write(text)


assert "'mqualifier'" not in open(os.path.join(HERE, 'template.html'), encoding='utf-8').read(), 'step 71 is already in template.html'
patch('canvas/template.html', [
    ("['Campaign management',['ajo','ajob2b','xa','marketo','mmeasure','target']]", "['Campaign management',['ajo','ajob2b','xa','marketo','moptimizer','mqualifier','mmeasure','target']]"),
])
patch('rfp_answers.js', [
    (" mmeasure:['marketo measure','adobe marketo measure','bizible'],\n",
     " mmeasure:['marketo measure','adobe marketo measure','bizible'],\n"
     " mqualifier:['marketo qualifier','adobe marketo qualifier','sales qualifier','account qualification agent'],\n"
     " moptimizer:['marketo optimizer','adobe marketo optimizer'],\n"),
    (" mmeasure:['marketing attribution','revenue attribution','multi-touch attribution'],\n",
     " mmeasure:['marketing attribution','revenue attribution','multi-touch attribution'],\n"
     " mqualifier:['prospect qualification','outbound workflow','bdr outreach','business development representative'],\n"),
])
print('step 71 applied: Marketo Optimizer and Marketo Qualifier are in the Add product menu and the RFI Builder knows their names')
