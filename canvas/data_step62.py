"""Step 62 canvas data (Nov 10 2026, Adam's answers to sow/canvas/research/expansion_2026-11-10/wave1/SIX_PROPOSAL.md): the six
products researched on Oct 30 join the Create your own play picker, from the research rechecked on Nov 10.

Adam: Real-Time CDP Collaboration in; GenStudio's extra connections "if they exist, yes" (all four: Journey Optimizer, Marketo
Engage, Real-Time CDP, Coworker); Marketing Campaign Analytics + Content Analytics left out ("I go with your recommendation");
Content Analytics + Coworker in (Content Analytics is read inside Customer Journey Analytics, where Coworker works), with the
license to confirm with Adobe; Journey Optimizer B2B Edition + Target "keep it".

1. research/portal_acquisition_insights.json and research/portal_omnichannel_b2b.json are replaced by the rechecked files
   (expansion_2026-11-10/wave1/, where build.py did not read them). In the first, the mmm-ca connection and its two services
   (XD10, XD11) move to `left_out`, and the two GenStudio prerequisites that gave a date say what to confirm instead.
2. catalog_map.json: the six products get a place on Create your own play.
3. research/connection_types.json: what each of the 19 connections is (kind and label), Adobe's availability in its own terms
   and the prerequisites, with the evidence quotes the recheck verified. The two Coworker connections carry the eligibility
   line the other Coworker connections carry, and Content Analytics + Coworker says to confirm the license with Adobe.
4. ../product_copy_rules.json, connection_client: the client-voice how and gain of the 19 connections, for the RFI Builder.
5. The voice rules of step 47 (found by `node sow/test_step47.js` on the first build): two card headings said "your" where the
   partner's card says "your client", and five availability or prerequisite lines told the partner to confirm something. The
   card keeps that instruction; the statement of work gets the same point as a condition (`sow_availability`, `sow_prereqs`).

Run once from the repo root, then rebuild:

    python3 sow/canvas/data_step62.py
    python3 sow/canvas/build.py && python3 sow/build_site.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SOW = os.path.dirname(HERE)
WAVE1 = os.path.join(HERE, 'research', 'expansion_2026-11-10', 'wave1')
SIX = ['gspm', 'ca', 'mmm', 'collab', 'ajob2b', 'xa']


def load(path):
    return json.load(open(path, encoding='utf-8'))


def save(path, data, indent=1, ascii_only=True):
    # each file keeps the layout it already has, so the change shows as the lines that changed (build.py checks the catalog for dashes)
    open(path, 'w', encoding='utf-8').write(json.dumps(data, indent=indent, ensure_ascii=ascii_only) + '\n')


# ---- 1. the rechecked research takes the place of the Oct 30 files ----
acq = load(os.path.join(WAVE1, 'portal_acquisition_insights.json'))
omni = load(os.path.join(WAVE1, 'portal_omnichannel_b2b.json'))
assert load(os.path.join(HERE, 'research', 'portal_acquisition_insights.json'))['checked'] != acq['checked'], 'step 62 is already applied'

gone = next(c for c in acq['connections'] if c['id'] == 'mmm-ca')
assert [l['id'] for l in gone['lines']] == ['XD10', 'XD11']
acq['connections'] = [c for c in acq['connections'] if c['id'] != 'mmm-ca']
acq['left_out'].append({
    'pair': 'mmm-ca',
    'what': 'Marketing Campaign Analytics + Content Analytics: shared paid media data (XD10) and a monthly channel and creative review (XD11)',
    'why': "Adam, Nov 10 2026: left out. No data passes between the two applications; both read the paid media datasets one set of "
           "Experience Platform sources creates, and a line on the canvas would suggest more. The recheck's write-up of the pair is in "
           "expansion_2026-11-10/wave1/portal_acquisition_insights.json."})
DATED = 'Adobe Developer App Builder on the GenStudio contract (one pack comes with licenses started or renewed on or after April 7, 2025)'
UNDATED = "Adobe Developer App Builder on the GenStudio contract: confirm that your client's license includes a pack"
for cid in ('ajo-gspm', 'marketo-gspm'):
    c = next(x for x in acq['connections'] if x['id'] == cid)
    assert c['prereqs'].count(DATED) == 1, cid
    c['prereqs'] = [UNDATED if x == DATED else x for x in c['prereqs']]
# the partner's card says "your client": two headings the recheck wrote for the client
HEADINGS = {'rtcdp-collab': ('Your audiences meet partner audiences', "Your client's audiences meet a collaborator's audiences"),
            'rtcdp-gspm': ('Content written for your segments', "Content written for your client's segments")}
for cid, (old, new) in HEADINGS.items():
    c = next(x for x in acq['connections'] if x['id'] == cid)
    assert c['gain']['title'] == old, (cid, c['gain']['title'])
    c['gain']['title'] = new
save(os.path.join(HERE, 'research', 'portal_acquisition_insights.json'), acq)
save(os.path.join(HERE, 'research', 'portal_omnichannel_b2b.json'), omni)

# ---- 2. the six products on Create your own play ----
map_path = os.path.join(HERE, 'catalog_map.json')
cmap = load(map_path)
custom = next(p for p in cmap['plays'] if p['id'] == 'custom')
PLACE = {'xa': [0, 3], 'collab': [0, 4], 'mmm': [1, 4], 'ca': [2, 4], 'ajob2b': [3, 4], 'gspm': [4, 4]}
assert set(PLACE) == set(SIX) and all(any(p['id'] == i for p in cmap['products']) for i in SIX)
taken = [tuple(v) for v in list(custom['pos'].values()) + list(custom['opos'].values())]
for pid, at in PLACE.items():
    assert pid not in custom['products'] and tuple(at) not in taken, pid
    custom['products'].append(pid)
    custom['pos'][pid] = at
save(map_path, cmap)

# ---- 3. what each connection is ----
COWORKER_ELIGIBILITY = ("Adobe's Workfront documentation says Coworker in Workfront is not currently available to health care and "
                        "finance organizations; Adobe states no such limit for this connection, so confirm eligibility with Adobe for your client")
CA_LICENSE = ("Adobe's pages ask for Customer Journey Analytics data views and do not say whether the standalone Content Analytics "
              "license is enough: confirm it with Adobe for your client")
types_path = os.path.join(HERE, 'research', 'connection_types.json')
types = load(types_path)
rules_path = os.path.join(SOW, 'product_copy_rules.json')
rules = load(rules_path)
# what the statement of work says where the partner's card tells the partner to confirm something: {connection: {card line: SOW line}}
SOW_PREREQS = {
    'ajo-gspm': {UNDATED: "Adobe Developer App Builder on the GenStudio contract, with a pack included in the Client's license"},
    'marketo-gspm': {UNDATED: "Adobe Developer App Builder on the GenStudio contract, with a pack included in the Client's license"},
    'ajob2b-aemassets': {"Adobe's product description allows one Experience Manager repository, although the guide describes adding more: confirm with Adobe before planning several":
                         "One Experience Manager repository, as Adobe's product description allows; more than one is confirmed with Adobe first"},
    'ca-cw': {CA_LICENSE: "Adobe confirms that the Client's Content Analytics license covers Coworker Chat on its data views before this service starts"},
}
COLLAB_CARD = " Confirm your client's region and license with Adobe."
COLLAB_SOW = " The Client's region and license are confirmed with Adobe before this service starts."
added = []
for research in (acq, omni):
    for c in research['connections']:
        if not c.get('kind'):          # connections already in the tool, copied through untouched by the recheck
            assert c['id'] in types['connections'], c['id']
            continue
        assert (c['a'] in SIX or c['b'] in SIX) and c['id'] not in types['connections'] and c['id'] not in rules['connection_client'], c['id']
        prereqs = list(c['prereqs'])
        if 'cw' in (c['a'], c['b']):
            prereqs = [COWORKER_ELIGIBILITY] + prereqs
        if c['id'] == 'ca-cw':
            prereqs.insert(1, CA_LICENSE)
        evidence = [{'url': s['url'], 'quote': s['quote']} for s in c.get('prereq_sources', []) if s.get('url') and s.get('quote')]
        src = c.get('availability_source') or {}
        if src.get('url') and src.get('quote'):
            evidence.append({'url': src['url'], 'quote': src['quote']})
        entry = {'kind': c['kind'], 'label': c['label'], 'availability': c['availability'], 'prereqs': prereqs, 'evidence': evidence}
        if c['id'] == 'rtcdp-collab':
            assert c['availability'].endswith(COLLAB_CARD), c['availability']
            entry['sow_availability'] = c['availability'][:-len(COLLAB_CARD)] + COLLAB_SOW
        for card, sow in SOW_PREREQS.get(c['id'], {}).items():
            assert prereqs.count(card) == 1, (c['id'], card)
            entry.setdefault('sow_prereqs', {})[str(prereqs.index(card))] = sow
        types['connections'][c['id']] = entry
        # ---- 4. the same connection in the client's voice ----
        client = c['client']
        rules['connection_client'][c['id']] = {'how': client['how'], 'gain': client['gain'], 'note': client.get('note', '')}
        added.append(c['id'])
assert len(added) == 19 and 'mmm-ca' not in added, added
save(types_path, types)
save(rules_path, rules, indent=2, ascii_only=False)
print('step 62 data applied: six products on Create your own play, 19 connections:', ', '.join(added))
