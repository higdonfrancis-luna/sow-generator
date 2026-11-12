"""Step 86 (Nov 12 2026), with data_step86.py: a connection with no availability text prints no Availability line.

Until now a researched service on a connection carried "Availability: not stated by Adobe." into the statement of work when
its connection said nothing. Adam: "publish every connection every feature every functionality as though it's available
and don't provide any caveats". The line is now printed only when the connection has something to say (a package, a
limit). Three places build that line: the canvas hand-off (template.html), the RFI Builder's hand-off (rfp_answers.js) and
the definitions an older draft opens with (build.py).

Run once from the repo root: python3 sow/canvas/patch_step86.py
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SOW = os.path.dirname(HERE)

OLD_JS = "L.origin==='research'&&conn?'Availability: '+String(o.sowAvailability||o.availability||'not stated by Adobe').replace(/([^.])$/,'$1.'):''"
NEW_JS = "L.origin==='research'&&conn&&(o.sowAvailability||o.availability)?'Availability: '+String(o.sowAvailability||o.availability).replace(/([^.])$/,'$1.'):''"
OLD_PY = """                availability = str(owner.get('sowAvailability') or owner.get('availability') or 'not stated by Adobe')
                assumptions.append('Availability: ' + availability.rstrip('.') + '.')
"""
NEW_PY = """                availability = str(owner.get('sowAvailability') or owner.get('availability') or '')
                if availability:
                    assumptions.append('Availability: ' + availability.rstrip('.') + '.')
"""
for path, old, new in ((os.path.join(HERE, 'template.html'), OLD_JS, NEW_JS), (os.path.join(SOW, 'rfp_answers.js'), OLD_JS, NEW_JS),
                       (os.path.join(HERE, 'build.py'), OLD_PY, NEW_PY)):
    s = open(path, encoding='utf-8').read()
    assert s.count(old) == 1, (path, s.count(old))
    before = [s.count(c) for c in '(){}[]']
    s = s.replace(old, new)
    after = [s.count(c) for c in '(){}[]']
    assert before[0] - before[1] == after[0] - after[1] and before[2:] == after[2:], path
    open(path, 'w', encoding='utf-8').write(s)
print('step 86 patch applied: no Availability line where a connection has none')
