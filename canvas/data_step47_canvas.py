"""Step 47 canvas data, the canvas pass (Nov 5 2026, Adam: "yes, fix all 45"; items from sow/audit_2026-11-05/FINDINGS.md):
- 8: the FSI problem's "My client wants conversation summaries" chip says Adobe doesn't currently offer Coworker to
  health care, finance or some other industries, so the partner confirms eligibility with Adobe first (the chip stays;
  Coworker for FSI is Adam's open question)
- 23: the two chips that say the CDN belongs on the canvas ("My client wants the AI channel included", "My client wants
  AI assistants included as a channel") add the CDN with Brand Visibility, so Build this puts CDN log forwarding in the quote
- 28: Authoring documents and Website on another CMS get shorter names on their canvas boxes (Authoring docs, Other CMS
  site), so the name no longer runs over the OUTSIDE ADOBE label; the full names stay as the card titles
Run once on the step 46 problems.json and catalog_map.json (after patch_step47_sow.py), then build.py and ../build_site.py.

    python3 sow/canvas/data_step47_canvas.py
"""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))


def patch(name, edits):
    p = os.path.join(HERE, name)
    t = open(p, encoding='utf-8').read()
    braces = t.count('{') - t.count('}')
    for old, new in edits:
        assert t.count(old) == 1, (name, old[:90])
        t = t.replace(old, new)
    assert t.count('{') - t.count('}') == braces, name
    assert not re.search('[\u2013\u2014]', t), name
    open(p, 'w', encoding='utf-8').write(t)


BV_ONLY = '''     "add": [
      "bv"
     ],
     "note": "Brand Visibility's CJA source needs CDN logs, so the CDN belongs on the canvas."'''
BV_CDN = '''     "add": [
      "bv",
      "cdn"
     ],
     "note": "Brand Visibility's CJA source needs CDN logs, so the CDN belongs on the canvas."'''
patch('problems.json', [
    ('"note": "Brand Concierge isn\'t on Coworker\'s compatible applications list, so confirm with Adobe."',
     '"note": "Adobe says Coworker is not currently offered to health care, finance or some other industries, so confirm eligibility with Adobe before proposing it. Brand Concierge also isn\'t on Coworker\'s compatible applications list."'),
    ('"chip": "My client wants the AI channel included",\n' + BV_ONLY, '"chip": "My client wants the AI channel included",\n' + BV_CDN),
    ('"chip": "My client wants AI assistants included as a channel",\n' + BV_ONLY, '"chip": "My client wants AI assistants included as a channel",\n' + BV_CDN),
])
patch('catalog_map.json', [
    ('"name": "Authoring documents",', '"name": "Authoring docs",\n   "title": "Authoring documents",'),
    ('"name": "Website on another CMS",', '"name": "Other CMS site",\n   "title": "Website on another CMS",'),
])
print('step 47 canvas data applied: the Coworker eligibility note, the CDN with the AI channel chips, the short outside names')
