"""Step 64 (Nov 10 2026, Adam's answers to canvas/research/expansion_2026-11-10/wave2/WAVE2_PROPOSAL.md): the seven wave 2
products take their places in the Add product menu, as drawn in sow/mockups/nov10_expansion/picker_*.png, and the RFI Builder
knows their names.

- canvas/template.html: Brand Intelligence joins AI & agents; Frame.io and Workfront Planning join Content & workflows; a new
  heading, Creativity & design, holds Creative Cloud, Adobe Express, Firefly Creative Production and Firefly Custom Models.
- rfp_answers.js: the names and topic words a question uses for the seven. Adobe Express and Frame.io leave the list of
  products the catalog does not cover; Firefly on its own stays there (Firefly Creative Production and Firefly Custom Models
  are answered by name).
- rfp_finder.js: Frame.io, Creative Cloud and Brand Intelligence count as Adobe product names when a question is sorted.

Run once from the repo root, after canvas/data_step64.py, then rebuild:

    python3 sow/canvas/patch_step64.py
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


assert "'brandintel'" not in open(os.path.join(HERE, 'template.html'), encoding='utf-8').read(), 'step 64 is already in template.html'
patch('canvas/template.html', [
    ("['AI & agents',['bv','bc','cw']]", "['AI & agents',['bv','bc','cw','brandintel']]"),
    ("'commerce','workfront','gspm']],", "'commerce','workfront','gspm','frameio','planning']],['Creativity & design',['creativecloud','express','fireflycp','fireflycm']],"),
])
patch('rfp_answers.js', [
    (" xa:['experimentation accelerator','journey optimizer experimentation accelerator'],\n",
     " xa:['experimentation accelerator','journey optimizer experimentation accelerator'],\n"
     " express:['adobe express','express for enterprise'],\n"
     " creativecloud:['creative cloud','adobe creative cloud'],\n"
     " frameio:['frame.io','frame io','frameio'],\n"
     " planning:['workfront planning','adobe workfront planning'],\n"
     " fireflycp:['firefly creative production','firefly services','adobe firefly services'],\n"
     " fireflycm:['firefly custom models','firefly custom model','custom firefly model'],\n"
     " brandintel:['brand intelligence','adobe brand intelligence'],\n"),
    (" ajob2b:['buying group','account-based marketing','account based marketing','account journey'],\n",
     " ajob2b:['buying group','account-based marketing','account based marketing','account journey'],\n"
     " express:['locked template','brand template','social post'],\n"
     " frameio:['video review','review and approval of video','creative review'],\n"
     " planning:['marketing calendar','campaign planning','marketing plan'],\n"
     " fireflycp:['creative production','content production at scale','asset variation'],\n"
     " brandintel:['brand compliance','brand check','on-brand review'],\n"),
    ("['adobe express','Adobe Express'],", ""),
    ("['frame io','Frame.io'],", ""),
])
patch('rfp_finder.js', [
    ("|experimentation accelerator|adaptive forms/i;", "|experimentation accelerator|adaptive forms|frame\\.?\\s?io|creative cloud|brand intelligence/i;"),
])
print('step 64 applied: the seven wave 2 products are in the Add product menu groups and the RFI Builder knows their names')
