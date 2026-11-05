"""Step 48 canvas data (Nov 5 2026, Adam: "Let's fix what we know that needs to be fixed and then we have to be ready to
ship it"; found in the demo rehearsal of step 47):
- fix 5: the banking and insurance problem (fsi-complex-questions) no longer offers the "My client wants conversation
  summaries" refine chip. It added Coworker to a financial services setup while its own note said Adobe doesn't currently
  offer Coworker to finance organizations, next to a Coworker + Brand Concierge connection. The other three FSI chips
  (Marketo Engage, AEM Sites, CJA) stay; no other problem changes.
Run once on the step 47 problems.json, then build.py and ../build_site.py.

    python3 sow/canvas/data_step48.py
"""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
p = os.path.join(HERE, 'problems.json')
t = open(p, encoding='utf-8').read()
old = ''',
    {
     "chip": "My client wants conversation summaries",
     "add": [
      "cw"
     ],
     "play": "custom",
     "note": "Adobe says Coworker is not currently offered to health care, finance or some other industries, so confirm eligibility with Adobe before proposing it. Brand Concierge also isn't on Coworker's compatible applications list."
    }
   ],'''
assert t.count(old) == 1, 'run this once on the step 47 problems.json'
braces = t.count('{') - t.count('}')
t = t.replace(old, '\n   ],')
assert t.count('{') - t.count('}') == braces and not re.search('[\u2013\u2014]', t)
fsi = next(x for x in json.loads(t)['problems'] if x['id'] == 'fsi-complex-questions')
assert [r['chip'] for r in fsi['refine']] == ['My client runs Marketo Engage', "My client's site is on AEM Sites", 'My client licenses CJA']
assert not any('cw' in r.get('add', []) for r in fsi['refine'])
open(p, 'w', encoding='utf-8').write(t)
print('step 48 data: the banking and insurance problem no longer offers a chip that adds Coworker')
