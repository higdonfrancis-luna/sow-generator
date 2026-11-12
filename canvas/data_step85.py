"""Step 85 (Nov 12 2026): Adobe Commerce gets services of its own. Adam, on the outside review's finding that the product
had none: "Yeah, we should add Services around Adobe Commerce customers. I don't know why I never thought of that", then
"It looks like the right 8" to the list shown him.

Seven optional services on the Adobe Commerce product (CE01 to CE07: store structure and Admin setup, catalog import,
checkout, payment, tax and delivery settings, inventory sources and stocks, Live Search setup, B2B buyer and purchasing
setup, monthly maintenance and upgrades) and one new connection, Adobe Commerce + CRM, with one optional service (XR01),
a partner-built integration on Adobe's Commerce integration starter kit.

The research is research/commerce_2026-11-12/commerce_services.json: each service was drafted from Adobe's public pages,
re-checked by a second reader, and every quote found word for word by script. Hours are our own estimates.

1. research/step85_commerce.json: the research file, as build.py reads it.
2. research/connection_types.json and product_copy_rules.json: what the new connection is, and the same in the client's voice.

Run once from the repo root, then rebuild:

    python3 sow/canvas/data_step85.py
    python3 sow/canvas/build.py && python3 sow/build_site.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SOW = os.path.dirname(HERE)
load = lambda path: json.load(open(path, encoding='utf-8'))


def save(path, data, indent=1, ascii_only=True):
    open(path, 'w', encoding='utf-8').write(json.dumps(data, indent=indent, ensure_ascii=ascii_only) + '\n')


out_path = os.path.join(HERE, 'research', 'step85_commerce.json')
assert not os.path.exists(out_path), 'step 85 is already applied'
found = load(os.path.join(HERE, 'research', 'commerce_2026-11-12', 'commerce_services.json'))
S, K = found['services'], found['connection']
assert sorted(S) == ['CE01', 'CE02', 'CE03', 'CE04', 'CE05', 'CE06', 'CE07', 'XR01']


def line(i):
    s = S[i]
    r = {'id': i, 'name': s['name'], 'unit': s['unit'], 'low': s['low'], 'base': s['base'], 'high': s['high'], 'default': False,
         'scope': s['scope'], 'evidence': s['evidence'], 'source': {'url': s['source_url'], 'title': 'Experience League: ' + s['source_title'] if 'experienceleague' in s['source_url'] else 'Adobe Developer: ' + s['source_title']}}
    for k in ('ext', 'tier'):
        if s[k]:
            r[k] = s[k]
    return r


START = {'url': S['XR01']['source_url'], 'title': 'Adobe Developer: ' + S['XR01']['source_title']}
PAGES = {(o['title']): {'url': o['url'], 'title': 'Adobe Developer: ' + o['title']} for o in S['XR01']['other_pages']}
flows = [{'from': f['from'], 'to': f['to'], 'what': f['what'], 'source': PAGES['Expose Commerce data' if f['from'] == 'commerce' else 'Enrich the shopping experience']} for f in K['flows']]
assert [(f['from'], f['to']) for f in flows] == [('commerce', 'crm'), ('crm', 'commerce')]

# ---- 1. the research file ----
save(out_path, {
    'checked': found['checked'],
    'products': [{'id': 'commerce', 'lines': [line('CE%02d' % n) for n in range(1, 8)]}],
    'connections': [{'id': 'commerce-crm', 'a': 'commerce', 'b': 'crm', 'how': K['how'], 'source': START,
                     'gain': {'title': K['gain_title'], 'text': K['gain_text']}, 'flows': flows, 'lines': [line('XR01')]}],
})

# ---- 2. what the connection is, and the same in the client's voice ----
types_path = os.path.join(HERE, 'research', 'connection_types.json')
types = load(types_path)
rules_path = os.path.join(SOW, 'product_copy_rules.json')
rules = load(rules_path)
assert 'commerce-crm' not in types['connections'] and 'commerce-crm' not in rules['connection_client']
# a connection to an outside system is an outside connection drawn as its route; nothing here runs through Experience Platform
types['connections']['commerce-crm'] = {'kind': 'outside', 'line': 'native', 'label': K['label'], 'availability': '', 'prereqs': list(K['prereqs']),
                                        'evidence': [{'url': e['url'], 'quote': e['quote']} for e in K['evidence']]}
rules['connection_client']['commerce-crm'] = {'how': K['sow_how'], 'gain': K['sow_gain'], 'note': ''}
save(types_path, types)
save(rules_path, rules, indent=2, ascii_only=False)
print('step 85 data applied: seven services on Adobe Commerce (CE01 to CE07) and the Adobe Commerce + CRM connection with XR01')
