"""Step 91 (Nov 13 2026): six services for the catalog gaps the holdout RFI found. Adam: "yes, build 1 and 2" (item 1 of
sow/rfp_prototype/kb_method/ROUND3_PROPOSAL.md): ChatGPT's test RFI, Vennor Quay Motionworks, asked for work the catalog had no
service for, so 8 of its 18 implementation questions got no draft without AI.

Six optional services, each researched on Adobe's public pages, re-checked by a second reader and fixed
(research/gaps_2026-11-13/<ID>.json, brief in BRIEF.md there):
  SI07 to SI10 on AEM Sites: page review and approval workflow; language copies and local corrections across markets; product data
  from ERP or PIM files onto product pages; content migration from another CMS into AEM Sites;
  AS07 on AEM Assets: document versions, expiry and replacement on published pages;
  MK07 on Marketo Engage: email program and preference migration from another platform.
Hours are our own estimates; Adam reviews them before anything is uploaded.

1. research/step91_gaps.json: the research file, as build.py reads it (each line optional, in no play).
2. The method knowledge base: batches/batch_13.json (each service's material), reviewed/batch_13.json (its method entry) and
   phrases/claude_batch_13.json (the phrases an RFI uses for its work), as sow/rfp_prototype/kb_method/build_method.py reads them.

Run once from the repo root, then rebuild:

    python3 sow/canvas/data_step91.py
    python3 sow/canvas/build.py && python3 sow/build_site.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SOW = os.path.dirname(HERE)
KB = os.path.join(SOW, 'rfp_prototype', 'kb_method')
GAPS = os.path.join(HERE, 'research', 'gaps_2026-11-13')
load = lambda path: json.load(open(path, encoding='utf-8'))
IDS = {'aemsites': ['SI07', 'SI08', 'SI09', 'SI10'], 'aemassets': ['AS07'], 'marketo': ['MK07']}
OWNER = {'aemsites': 'AEM Sites', 'aemassets': 'AEM Assets', 'marketo': 'Marketo Engage'}
# the product facts each owner's existing services carry in the knowledge base, so a new entry is checked against the same
NEIGHBOUR = {'aemsites': 'SI02', 'aemassets': 'AS02', 'marketo': 'MK01'}
KEYS = ('id', 'owner', 'name', 'unit', 'scope', 'evidence', 'source_url', 'source_title', 'other_pages', 'low', 'base', 'high',
        'hours_reasoning', 'ext', 'tier', 'notes', 'method', 'phrases', 'checker_changes')


def save(path, data, indent=1, ascii_only=True):
    open(path, 'w', encoding='utf-8').write(json.dumps(data, indent=indent, ensure_ascii=ascii_only) + '\n')


def site_of(url):
    return ('Experience League: ' if 'experienceleague.adobe.com' in url else 'aem.live: ' if 'aem.live' in url
            else 'Adobe Developer: ' if 'developer.adobe.com' in url else 'Adobe Help: ')


out_path = os.path.join(HERE, 'research', 'step91_gaps.json')
assert not os.path.exists(out_path), 'step 91 is already applied'
S = {}
for pid, ids in IDS.items():
    for i in ids:
        s = load(os.path.join(GAPS, i + '.json'))
        miss = [k for k in KEYS if k not in s]
        assert not miss and s['id'] == i and s['owner'] == pid, (i, miss)
        assert s['unit'] in ('one-time', 'monthly') and s['low'] <= s['base'] <= s['high'], i
        S[i] = s


def line(i):
    s = S[i]
    r = {'id': i, 'name': s['name'], 'unit': s['unit'], 'low': s['low'], 'base': s['base'], 'high': s['high'], 'default': False,
         'scope': s['scope'], 'evidence': s['evidence'], 'source': {'url': s['source_url'], 'title': site_of(s['source_url']) + s['source_title']}}
    for k in ('ext', 'tier'):
        if s[k]:
            r[k] = s[k]
    return r


# ---- 1. the research file ----
save(out_path, {'checked': '2026-11-13', 'products': [{'id': pid, 'lines': [line(i) for i in ids]} for pid, ids in IDS.items()]})

# ---- 2. the method knowledge base ----
facts = {}
for f in sorted(os.listdir(os.path.join(KB, 'batches'))):
    for src in load(os.path.join(KB, 'batches', f))['services']:
        facts[src['id']] = src.get('product_facts', [])
batch, entries, phrases = [], [], {}
for pid, ids in IDS.items():
    for i in ids:
        s = S[i]
        batch.append({'id': i, 'name': s['name'], 'owner': [OWNER[pid]], 'unit': s['unit'],
                      'hours': {'low': s['low'], 'base': s['base'], 'high': s['high']}, 'scope': s['scope'], 'adobe_quote': s['evidence'],
                      'license': '; '.join(x for x in (s['tier'], s['ext']) if x),
                      'source': {'title': site_of(s['source_url']) + s['source_title'], 'url': s['source_url']},
                      'product_facts': facts[NEIGHBOUR[pid]] + [o['quote'] for o in s['other_pages']]})
        entries.append({'id': i, **{k: s['method'][k] for k in ('steps', 'deliverables', 'asks', 'risk', 'outcome', 'kind', 'phase')}})
        phrases[i] = s['phrases']
for sub, data in (('batches', {'batch': '13', 'services': batch}), ('reviewed', entries), ('phrases', phrases)):
    path = os.path.join(KB, sub, 'claude_batch_13.json' if sub == 'phrases' else 'batch_13.json')
    assert not os.path.exists(path), path
    save(path, data, ascii_only=False)
print('step 91 data applied: SI07 to SI10 on AEM Sites, AS07 on AEM Assets, MK07 on Marketo Engage, and their knowledge-base entries')
