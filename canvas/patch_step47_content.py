"""Step 47 on the Build canvas and its build, the content pass (Nov 5 2026, Adam: "yes, fix all 45"; items from
sow/audit_2026-11-05/FINDINGS.md; the data is data_step47.py, the SOW steps sow/patch_step47_content.py):
- 6: the hand-over sends each research service's SOW version of its connection's availability and prerequisites, written
  as conditions with an owner (sow_availability, sow_prereqs in research/connection_types.json), without the
  "Connection: <kind>." prefix; the card keeps the partner notes
- 7: the problem box says "your client" for "the client" but leaves client-side and client-managed as they are
- 16: a live SOW service carries the product (ext) and the package (tier) it needs onto the canvas, as research lines do
- 29: the build stops if a card shows an internal line ID
- 31: the aem.live label is written right at the source, so the problem box no longer patches it
Run once on the step 46 template and build.py (after the earlier step 47 passes), then build.py and ../build_site.py.

    python3 sow/canvas/patch_step47_content.py
"""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))


def patch(name, edits):
    p = os.path.join(HERE, name)
    t = open(p, encoding='utf-8').read()
    braces = t.count('{') - t.count('}')
    dashes = len(re.findall('[\u2013\u2014]', t))
    for old, new in edits:
        assert t.count(old) == 1, (name, t.count(old), old[:90])
        t = t.replace(old, new)
    assert t.count('{') - t.count('}') == braces, name
    assert len(re.findall('[\u2013\u2014]', t)) == dashes, name
    open(p, 'w', encoding='utf-8').write(t)


patch('template.html', [
    ("prereqs:[L.origin==='research'&&conn?'Connection: '+(KIND[o.kind]||'not typed')+'. Availability: '+(o.availability||'not stated'):'',"
     "L.origin==='research'&&conn&&o.prereqs&&o.prereqs.length?'Prerequisites for '+P[o.a].name+' + '+P[o.b].name+': '+o.prereqs.join('; ')+'.':'',",
     "prereqs:[L.origin==='research'&&conn?'Availability: '+String(o.sowAvailability||o.availability||'not stated by Adobe').replace(/([^.])$/,'$1.'):'',"
     "L.origin==='research'&&conn&&o.prereqs&&o.prereqs.length?'Prerequisites for '+P[o.a].name+' + '+P[o.b].name+': '+(o.sowPrereqs||o.prereqs).join('; ')+'.':'',"),
    ("const bpVoice=s=>s.replace(/\\b([Tt])he client\\b(?!')/g,", "const bpVoice=s=>s.replace(/\\b([Tt])he client\\b(?![-\\w'])/g,"),
    (".replace(/^Aem\\.live\\b/,'The aem.live');", ";"),
])
patch('build.py', [
    ("                      'url': x['source'], 'src': clean(x.get('sourceTitle') or x['source']), 'origin': 'sow'}\n",
     "                      'url': x['source'], 'src': clean(x.get('sourceTitle') or x['source']), 'origin': 'sow'}\n"
     "        # step 47: the product (ext) and the package (tier) a live service needs, as research lines carry them\n"
     "        for k in ('ext', 'tier'):\n"
     "            if x.get(k):\n"
     "                lines[lid][k] = clean(x[k])\n"),
    ("        c['availability'], c['prereqs'] = clean(t.get('availability', '')), [clean(x) for x in t.get('prereqs', [])]\n",
     "        c['availability'], c['prereqs'] = clean(t.get('availability', '')), [clean(x) for x in t.get('prereqs', [])]\n"
     "        # step 47: the SOW version of a partner note (a condition with an owner); the card shows the note, the hand-over the SOW version\n"
     "        if t.get('sow_availability'):\n"
     "            c['sowAvailability'] = clean(t['sow_availability'])\n"
     "        if t.get('sow_prereqs'):\n"
     "            assert all(0 <= int(i) < len(c['prereqs']) for i in t['sow_prereqs']), c['id']\n"
     "            c['sowPrereqs'] = [clean(t['sow_prereqs'].get(str(i), x)) for i, x in enumerate(c['prereqs'])]\n"),
    ("    blob = json.dumps(cat, ensure_ascii=False)\n",
     "    # step 47: partners see service names, never the internal line IDs, so no shown text may cite one\n"
     "    ids = re.compile(r'\\b(?:' + '|'.join(sorted(map(re.escape, used), key=len, reverse=True)) + r')\\b')\n"
     "    shown = [(p['id'], p.get(k)) for p in keep_p for k in ('name', 'title', 'systems', 'rec')]\n"
     "    for c in keep_c:\n"
     "        shown += [(c['id'], c.get(k)) for k in ('how', 'label', 'availability', 'sowAvailability', 'tier', 'covered')]\n"
     "        shown += [(c['id'], x) for x in c.get('prereqs', []) + c.get('sowPrereqs', []) + [f['what'] for f in c.get('flows', [])]]\n"
     "        shown += [(c['id'], c['gain'][k]) for k in ('title', 'text') if c.get('gain')]\n"
     "    shown += [(l, v.get(k)) for l, v in used.items() for k in ('name', 'nname', 'scope', 'ext', 'tier')]\n"
     "    cited = [(w, ids.search(s).group(0)) for w, s in shown if isinstance(s, str) and ids.search(s)]\n"
     "    assert not cited, f'shown text cites internal line IDs: {cited}'\n"
     "    blob = json.dumps(cat, ensure_ascii=False)\n"),
])
print('step 47 content: the hand-over sends the SOW versions, live services carry their needs, no line IDs on the cards')
