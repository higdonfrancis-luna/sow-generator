"""Step 64 canvas data (Nov 10 2026, Adam's answers to sow/canvas/research/expansion_2026-11-10/wave2/WAVE2_PROPOSAL.md): wave 2
of the catalog expansion, GenStudio and creative. Seven products join the Create your own play picker: Adobe Express, Creative
Cloud, Frame.io, Workfront Planning, Firefly Creative Production, Firefly Custom Models and Brand Intelligence.

Adam: "Add firefly custom models don't worry about the beta" (written for enterprise plans, which carry no label); Brand
Intelligence "Include it"; "frame. Io plus work front is good to go"; Firefly Creative Production and Firefly Services "One box
makes sense"; Creative Cloud's services "sure"; and help.frame.io allowed, so Frame.io's own how-to pages were read
(wave2/frameio_help_recheck.json, 95 quotes checked).

1. research/wave2_content_tools.json and research/wave2_firefly_family.json are the two wave 2 research files, where build.py
   reads them, with what the Frame.io recheck corrected: FR03 names Secure Sharing as plan dependent, XJ15 covers the workspace
   a Workfront project template sends its projects to, and Frame.io + AEM Assets describes both routes (through Workfront, and
   Frame.io's direct export). Two version numbers and one "are planned" are reworded, because the copy check reads them as a
   release date and a forecast.
2. catalog_map.json: the seven products get a name and a place on Create your own play.
3. research/connection_types.json: what each of the 26 connections is (kind and label), Adobe's availability and the
   prerequisites, with the evidence quotes. Where the partner's card tells the partner to have Adobe verify something, the
   statement of work gets the same point as a condition (`sow_prereqs`), in the Client's voice.
4. ../product_copy_rules.json, connection_client: the client-voice how and gain of the 26 connections, for the RFI Builder.

Run once from the repo root, then rebuild:

    python3 sow/canvas/data_step64.py
    python3 sow/canvas/build.py && python3 sow/build_site.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SOW = os.path.dirname(HERE)
WAVE2 = os.path.join(HERE, 'research', 'expansion_2026-11-10', 'wave2')
SEVEN = ['express', 'creativecloud', 'frameio', 'planning', 'fireflycp', 'fireflycm', 'brandintel']


def load(path):
    return json.load(open(path, encoding='utf-8'))


def save(path, data, indent=1, ascii_only=True):
    # each file keeps the layout it already has, so the change shows as the lines that changed (build.py checks the catalog for dashes)
    open(path, 'w', encoding='utf-8').write(json.dumps(data, indent=indent, ensure_ascii=ascii_only) + '\n')


# ---- 1. the research, with the Frame.io recheck's corrections ----
out = {name: os.path.join(HERE, 'research', 'wave2_' + name) for name in ('content_tools.json', 'firefly_family.json')}
assert not any(os.path.exists(p) for p in out.values()), 'step 64 is already applied'
tools = load(os.path.join(WAVE2, 'content_tools.json'))
firefly = load(os.path.join(WAVE2, 'firefly_family.json'))
recheck = {i['target']: i for i in load(os.path.join(WAVE2, 'frameio_help_recheck.json'))['items']}

frameio = next(p for p in tools['products'] if p['id'] == 'frameio')
fr03 = next(l for l in frameio['lines'] if l['id'] == 'FR03')
assert 'the domains allowed to receive shares' in fr03['scope']
fr03['scope'] = recheck['FR03']['proposed_scope']
fw = next(c for c in tools['connections'] if c['id'] == 'frameio-workfront')
xj15 = next(l for l in fw['lines'] if l['id'] == 'XJ15')
assert 'the Workfront Linked Projects workspace' in xj15['scope']
xj15['scope'] = recheck['XJ15']['proposed_scope']
fa = next(c for c in tools['connections'] if c['id'] == 'frameio-aemassets')
assert 'which this session could not read' in fa['how']
fa['how'] = recheck['frameio-aemassets']['proposed_how']
DIRECT = ("Frame.io's direct export, where your client does not use Workfront: a Frame.io V4 account, AEM Assets as a Cloud Service "
          "on the minimum release Frame.io names, and the Adobe Experience Manager app switched on by a Frame.io account admin; it sends no metadata")
fa['prereqs'].append(DIRECT)
# the copy check reads a version number as a date, and "are planned" as a forecast: the cards say the same without either
assert fw['how'].count('projects are planned in Workfront') == 1
fw['how'] = fw['how'].replace('projects are planned in Workfront', 'projects are managed in Workfront')
VERSION = ', version 2024.10.18175 or later'
af = next(c for c in firefly['connections'] if c['id'] == 'aemassets-fireflycp')
assert af['availability'].count(VERSION) == 1 and af['prereqs'][0].count(VERSION) == 1
af['availability'] = af['availability'].replace(VERSION, ', on the minimum release Adobe names on its page')
af['prereqs'][0] = af['prereqs'][0].replace(VERSION, ', on the minimum release Adobe names on its page')
src = recheck['frameio-aemassets']['evidence'][0]
fa['prereq_sources'].append({'url': src['url'], 'quote': src['quote']})
save(out['content_tools.json'], tools)
save(out['firefly_family.json'], firefly)

# ---- 2. the seven products on Create your own play ----
map_path = os.path.join(HERE, 'catalog_map.json')
cmap = load(map_path)
custom = next(p for p in cmap['plays'] if p['id'] == 'custom')
# two new columns at the right: every product's lines draw clean there with all 28 on (test_canvas.js)
PLACE = {'express': [5, 1], 'creativecloud': [5, 2], 'frameio': [5, 3], 'planning': [5, 4], 'fireflycp': [6, 2], 'fireflycm': [6, 1], 'brandintel': [6, 3]}
assert set(PLACE) == set(SEVEN)
taken = [tuple(v) for v in list(custom['pos'].values()) + list(custom['opos'].values())]
for research in (tools, firefly):
    for p in research['products']:
        pid = p['id']
        assert pid in SEVEN and not any(x['id'] == pid for x in cmap['products']) and tuple(PLACE[pid]) not in taken, pid
        entry = {'id': pid, 'name': p['name']}
        if p['title'] != p['name']:
            entry['title'] = p['title']
        entry.update({'lines': [], 'more': []})
        cmap['products'].append(entry)
        custom['products'].append(pid)
        custom['pos'][pid] = PLACE[pid]
save(map_path, cmap)

# ---- 3. what each connection is ----
types_path = os.path.join(HERE, 'research', 'connection_types.json')
types = load(types_path)
rules_path = os.path.join(SOW, 'product_copy_rules.json')
rules = load(rules_path)
# the research wrote three statement-of-work conditions to the partner ("your"); the statement of work speaks of the Client
CLIENT_VOICE = {'in your Firefly Creative Production organization': "in the Client's Firefly Creative Production organization",
                'in your production Workfront': "in the Client's production Workfront"}
# the partner's card keeps Adobe's note on the industries Coworker is not offered to; the statement of work keeps the condition
SOW_AVAILABILITY = {'planning-cw': "Coworker is enabled for the Client's Workfront instance and is offered to the Client's organization, both confirmed with Adobe before this service starts."}
added = []
for research in (tools, firefly):
    for c in research['connections']:
        assert (c['a'] in SEVEN or c['b'] in SEVEN) and c['id'] not in types['connections'] and c['id'] not in rules['connection_client'], c['id']
        prereqs = list(c['prereqs'])
        evidence = [{'url': s['url'], 'quote': s['quote']} for s in c.get('prereq_sources', []) if s.get('url') and s.get('quote')]
        src = c.get('availability_source') or {}
        if src.get('url') and src.get('quote'):
            evidence.append({'url': src['url'], 'quote': src['quote']})
        entry = {'kind': c['kind'], 'label': c['label'], 'availability': c['availability'], 'prereqs': prereqs, 'evidence': evidence}
        for card, sow in (c.get('sow_prereq') or {}).items():
            assert prereqs.count(card) == 1, (c['id'], card)
            for old, new in CLIENT_VOICE.items():
                sow = sow.replace(old, new)
            assert ' your ' not in sow, (c['id'], sow)
            entry.setdefault('sow_prereqs', {})[str(prereqs.index(card))] = sow
        if c['id'] in SOW_AVAILABILITY:
            entry['sow_availability'] = SOW_AVAILABILITY[c['id']]
        types['connections'][c['id']] = entry
        # ---- 4. the same connection in the client's voice ----
        client = dict(c['client'])
        if c['id'] == 'express-workfront':   # the copy check reads "approve it" as the partner instruction "prove it"
            assert client['gain'].count('approve it,') == 1
            client['gain'] = client['gain'].replace('approve it,', 'have approved it,')
        rules['connection_client'][c['id']] = {'how': client['how'], 'gain': client['gain'], 'note': client.get('note', '')}
        added.append(c['id'])
assert len(added) == 26, added
save(types_path, types)
save(rules_path, rules, indent=2, ascii_only=False)
print('step 64 data applied: seven products on Create your own play, 26 connections:', ', '.join(added))
