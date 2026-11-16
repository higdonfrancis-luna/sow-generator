"""Get your team ready (Nov 16 2026): write canvas/training.json, the partner hub page, certifications and training shown on each
product card, from the record in canvas/research/training_2026-11-16/ (research.json: every exam checked against Adobe's
certification portal and every training link fetched; partner_hub_links.json: the hub pages the owner opened while signed in).

    python3 canvas/data_training.py     # then python3 canvas/build.py and python3 build_site.py
"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
RECORD = os.path.join(HERE, 'research', 'training_2026-11-16')
research = json.load(open(os.path.join(RECORD, 'research.json'), encoding='utf-8'))
hub = json.load(open(os.path.join(RECORD, 'partner_hub_links.json'), encoding='utf-8'))
R = {p['id']: p for p in research['products']}

HUB_NAMES = {
    'brand-visibility': 'Adobe Brand Visibility', 'brand-concierge': 'Adobe Brand Concierge', 'experience-manager': 'Adobe Experience Manager',
    'commerce': 'Adobe Commerce', 'genstudio-for-performance-marketing': 'Adobe GenStudio for Performance Marketing', 'analytics': 'Adobe Analytics',
    'content-analytics': 'Adobe Content Analytics', 'customer-journey-analytics': 'Adobe Customer Journey Analytics', 'real-time-cdp': 'Adobe Real-Time CDP',
    'journey-optimizer': 'Adobe Journey Optimizer', 'marketo': 'Adobe Marketo', 'frame-io': 'Adobe Frame.io', 'workfront': 'Adobe Workfront',
    'acrobat': 'Adobe Acrobat', 'acrobat-sign': 'Adobe Acrobat Sign', 'creative-cloud': 'Adobe Creative Cloud', 'express': 'Adobe Express',
    'firefly': 'Adobe Firefly', 'cx-enterprise-coworker': 'CX Enterprise Coworker', 'target': 'Adobe Target', 'mix-modeler': 'Adobe Mix Modeler',
}
slugs = dict(hub['confirmed'])
slugs['so'] = 'experience-manager'   # the owner's check found no Sites Optimizer page; its family page stands in until one is confirmed

# the Products filter on the partner training catalog, only where the filter is named for the product or its family
FILTER = {
    'aemsites': 'Adobe Experience Manager', 'eds': 'Adobe Experience Manager', 'aemassets': 'Adobe Experience Manager', 'aemforms': 'Adobe Experience Manager',
    'aa': 'Adobe Analytics', 'cja': 'Customer Journey Analytics', 'mmm': 'Adobe Mix Modeler', 'ajo': 'Adobe Journey Optimizer',
    'ajob2b': 'Adobe Journey Optimizer B2B Edition', 'target': 'Adobe Target', 'commerce': 'Adobe Commerce', 'marketo': 'Adobe Marketo Engage',
    'workfront': 'Adobe Workfront', 'gspm': 'GenStudio', 'fireflycp': 'Firefly', 'fireflycm': 'Firefly', 'acrobat': 'Adobe Acrobat', 'acrobatsign': 'Adobe Acrobat Sign',
}
SEARCH = {
    'so': 'Sites Optimizer', 'ca': 'Content Analytics', 'rtcdp': 'Real-Time CDP', 'collab': 'Real-Time CDP Collaboration', 'xa': 'Experimentation Accelerator',
    'mmeasure': 'Marketo Measure', 'mqualifier': 'Marketo Qualifier', 'moptimizer': 'Marketo Optimizer', 'planning': 'Workfront Planning', 'express': 'Adobe Express',
    'frameio': 'Frame.io', 'creativecloud': 'Creative Cloud', 'bv': 'Brand Visibility', 'bc': 'Brand Concierge', 'cw': 'Coworker', 'brandintel': 'Brand Intelligence',
}
# a product with no certification of its own whose work Adobe places inside another product: that product's certifications are the closest
# the tool presents AEM Sites and Edge Delivery Services as one offering, so that offering carries the AEM Sites certifications as its own
SAME = {'eds': 'aemsites'}
CLOSEST = {'aemforms': 'aemsites', 'so': 'aemsites', 'collab': 'rtcdp', 'planning': 'workfront', 'ca': 'cja',
           'mmeasure': 'marketo', 'mqualifier': 'marketo', 'moptimizer': 'marketo', 'fireflycm': 'fireflycp'}
LEVELS = ['Professional', 'Expert', 'Master', 'Qualified']   # certifications by level, then Qualified Credentials
KINDS = {'learning path', 'course', 'playlist', 'tutorial', 'documentation'}

out = {'checked': '2026-11-16', 'hub': 'https://partners.adobe.com/digitalexperience/products/',
       'catalog': hub['training_catalog'], 'products': {}}
for pid, p in R.items():
    exams = []
    for e in sorted(p['exams'], key=lambda e: LEVELS.index(e['level'])):
        item = {'title': re.sub(r'\s*\(Beta\)$', '', e['official_title']), 'url': e['portal_url'].replace('#_blank', '')}
        if e.get('exam_id'):
            item['id'] = e['exam_id']
        if e.get('credential_type') == 'qualified credential':
            item['credential'] = True
        if e.get('counts_toward_partner_requirements') == 'no':
            item['partner'] = False
        assert item['url'].startswith('https://certification.adobe.com/certification/'), item
        exams.append(item)
    training = []
    for t in p['training']:
        assert t['http_status'] == 200 and t['kind'] in KINDS, t
        training.append({'kind': t['kind'], 'title': t['title'], 'url': t['url']})
    entry = {}
    if pid in slugs:
        entry['hub'] = {'slug': slugs[pid], 'name': HUB_NAMES[slugs[pid]]}
    assert (pid in FILTER) != (pid in SEARCH), pid
    entry['filter' if pid in FILTER else 'search'] = FILTER.get(pid) or SEARCH[pid]
    entry['exams'] = exams
    if pid in CLOSEST:
        assert not exams and p['certification_status'] == 'none' and p.get('nearest_certification') == CLOSEST[pid], pid
        entry['closest'] = CLOSEST[pid]
    entry['training'] = training
    out['products'][pid] = entry

for pid, src in SAME.items():
    assert not out['products'][pid]['exams'] and R[pid].get('nearest_certification') == src, pid
    out['products'][pid]['exams'] = [dict(e) for e in out['products'][src]['exams']]
for pid, e in out['products'].items():
    if 'closest' in e:
        assert out['products'][e['closest']]['exams'], pid
with open(os.path.join(HERE, 'training.json'), 'w', encoding='utf-8') as target:
    json.dump(out, target, indent=1, ensure_ascii=False)
    target.write('\n')
n = sum(len(e['exams']) for e in out['products'].values())
print(len(out['products']), 'products;', n, 'exams;', sum(len(e['training']) for e in out['products'].values()), 'training links;',
      sum(1 for e in out['products'].values() if 'hub' in e), 'with a hub page')
