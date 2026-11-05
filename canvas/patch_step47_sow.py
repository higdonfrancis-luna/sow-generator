"""Step 47 on the canvas, the SOW-step pass (Nov 5 2026, Adam: "yes, fix all 45"; the SOW half is sow/patch_step47_sow.py):
- 19: the hand-over sends each line's canvas default (def), so Use starting scope on the SOW steps keeps a canvas line
  on as the canvas starts it (AEM Assets and the other outside systems' services were switched off).
- 24: Change play no longer promises the Scope details stay: they are kept for each play.
- 15: the warehouse box names the route for each product (Data Mirror for CJA and Journey Optimizer, tables copied on a
  schedule for Real-Time CDP), not Data Mirror for all three.
Run once on the step 46 sources, then build.py and ../build_site.py.

    python3 sow/canvas/patch_step47_sow.py
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


patch('template.html', [
    ("lines.push({id:l,on:counted(l),lock:!met(l),want:lineOn(l),", "lines.push({id:l,on:counted(l),lock:!met(l),want:lineOn(l),def:defOf(l),"),
    ("lines.push({id:l,on:false,lock:true,want:lineOn(l),", "lines.push({id:l,on:false,lock:true,want:lineOn(l),def:defOf(l),"),
    ("'One play per statement of work, so this clears the canvas and every service choice and edit. Your rate, size and Scope details stay.'",
     "'One play per statement of work, so this clears the canvas and every service choice and edit. Your rate, size, client and partner details stay. Scope details are kept for each play, so the new play\\'s Scope starts fresh and this play\\'s come back if you return to it.'"),
])
patch('catalog_map.json', [
    ('"systems": "Snowflake, Google BigQuery or Azure Databricks, through Data Mirror",',
     '"systems": "Snowflake, Google BigQuery or Azure Databricks (Data Mirror for CJA and Journey Optimizer; tables copied on a schedule for Real-Time CDP)",'),
])
print('step 47 (SOW pass) applied on the canvas: canvas defaults in the hand-over, the Change play note, the warehouse routes')
