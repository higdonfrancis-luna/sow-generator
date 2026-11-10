"""Step 66 (Nov 10 2026, Adam's answers to canvas/research/expansion_2026-11-10/wave3/WAVE3_PROPOSAL.md): the four wave 3
products take their places in the Add product menu, and the RFI Builder knows their names.

- canvas/template.html: in the focus view a product with more than 14 lines on one side closes its lanes up (Real-Time CDP
  routes 16 with this step; at 10 apart the innermost lane landed on the box's edge and the line could not be drawn).
  Products with 14 or fewer draw as before.
- canvas/template.html: Adobe Analytics joins Data & analytics; Marketo Measure joins Campaign management; a new heading,
  Document productivity, last as on Adobe's menu, holds Acrobat and Acrobat Services, and Acrobat Sign.
- rfp_answers.js: the names and topic words a question uses for the four. Adobe Analytics, Marketo Measure (and Bizible) and
  Acrobat Sign leave the list of products the catalog does not cover.
- rfp_finder.js: Acrobat and Bizible count as Adobe product names when a question is sorted.

Run once from the repo root, after canvas/data_step66.py, then rebuild:

    python3 sow/canvas/patch_step66.py
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


assert "'acrobatsign'" not in open(os.path.join(HERE, 'template.html'), encoding='utf-8').read(), 'step 66 is already in template.html'
patch('canvas/template.html', [
    # Real-Time CDP routes 16 lines down one side with Adobe Analytics and Marketo Measure on: at 10 apart the innermost
    # lane landed on the box's own edge and the line could not be drawn. Lanes close up only when a side holds more than 14.
    ("    for(const grp of [up,dn])grp.forEach((g,i)=>{g.lx=x0+s*(i-(grp.length-1)/2)*LANE;});",
     "    /* step 66: with more than 14 lines on one side the lanes close up, so the innermost stays clear of the box */\n"
     "    for(const grp of [up,dn]){const lane=(grp.length-1)/2*LANE<(COLW-NW)/2-4?LANE:(COLW-NW-8)/(grp.length-1);grp.forEach((g,i)=>{g.lx=x0+s*(i-(grp.length-1)/2)*lane;});}"),
    ("['Data & analytics',['rtcdp','cja','ca','mmm','collab']]", "['Data & analytics',['rtcdp','cja','aa','ca','mmm','collab']]"),
    ("['Campaign management',['ajo','ajob2b','xa','marketo','target']]];", "['Campaign management',['ajo','ajob2b','xa','marketo','mmeasure','target']],['Document productivity',['acrobat','acrobatsign']]];"),
])
patch('rfp_answers.js', [
    (" brandintel:['brand intelligence','adobe brand intelligence'],\n",
     " brandintel:['brand intelligence','adobe brand intelligence'],\n"
     " aa:['adobe analytics','analysis workspace','report suite'],\n"
     " mmeasure:['marketo measure','adobe marketo measure','bizible'],\n"
     " acrobat:['acrobat','adobe acrobat','acrobat services','pdf services api','document generation api','pdf embed api'],\n"
     " acrobatsign:['acrobat sign','adobe acrobat sign','adobe sign'],\n"),
    (" brandintel:['brand compliance','brand check','on-brand review'],\n",
     " brandintel:['brand compliance','brand check','on-brand review'],\n"
     " mmeasure:['marketing attribution','revenue attribution','multi-touch attribution'],\n"
     " acrobat:['pdf accessibility','pdf generation','document automation'],\n"),
    ("['marketo measure','Marketo Measure'],['bizible','Marketo Measure'],['acrobat sign','Acrobat Sign'],['adobe sign','Acrobat Sign'],", ""),
    (",['adobe analytics','Adobe Analytics']];", "];"),
])
patch('rfp_finder.js', [
    ("|frame\\.?\\s?io|creative cloud|brand intelligence/i;", "|frame\\.?\\s?io|creative cloud|brand intelligence|\\bacrobat\\b|\\bbizible\\b/i;"),
])
print('step 66 applied: the four wave 3 products are in the Add product menu groups and the RFI Builder knows their names')
