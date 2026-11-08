"""Apply reviewed template edits and retain old defaults for saved-draft migration.

Run once (or idempotently) before canvas/build.py and build_site.py.
"""
import copy
import json
from pathlib import Path
import re
import sys

SOW = Path(__file__).resolve().parent
sys.path.insert(0, str(SOW / 'canvas'))
from review_amendments import MANIFEST, get, put
from product_copy import tree as public_copy


def main():
    manifest = json.loads(MANIFEST.read_text())
    path = SOW / 'index.html'
    html = path.read_text()
    pattern = r'<script>const CATALOG=(\[.*?\]);</script>'
    match = re.search(pattern, html, re.S)
    catalog = json.loads(match.group(1))
    by_id = {c['id']: c for c in catalog}
    prior = {}
    for change in manifest['changes']:
        if change['entity_type'] != 'service' or change['id'] not in by_id:
            continue
        target = by_id[change['id']]
        old = copy.deepcopy(target)
        for edit in change['edits']:
            current = get(target, edit['field'])
            if current not in (edit['before'], edit['after'], public_copy(edit['before']), public_copy(edit['after'])):
                raise ValueError(f"Review input drift: {change['id']}.{edit['field']}")
            put(target, edit['field'], edit['after'])
            key = edit['field'].split('.')[-1]
            if key in ('scope', 'deliverable', 'acceptance', 'assumptions', 'exclusions') and isinstance(edit['before'], str):
                prior.setdefault(change['id'], {}).setdefault(key, []).append(edit['before'])
                prior[change['id']][key].append(edit['after'])
        assert all(target[k] == old[k] for k in ('low', 'base', 'high', 'unit'))
        if change['id'] == 'A01':
            # The new routing qualification belongs only to engagements with BV.
            routing = target['assumptions'][target['assumptions'].index(' Optimize at Edge'):]
            pair = [routing, '']
            rules = target['neutral']['bv']['assumptions']
            if pair not in rules:
                rules.append(pair)
    html = html[:match.start(1)] + json.dumps(public_copy(catalog), ensure_ascii=False) + html[match.end(1):]
    declaration = 'const PRIOR_REVIEW=' + json.dumps(prior, ensure_ascii=False) + ';'
    if 'const PRIOR_REVIEW=' in html:
        html = re.sub(r'const PRIOR_REVIEW=.*?;\n', lambda _: declaration + '\n', html, count=1)
    else:
        html = html.replace('const PREVIOUS_SCOPES=', declaration + '\nconst PREVIOUS_SCOPES=', 1)
        html = html.replace('...(PRIOR47[baseId(c)]?.[key]||[]),', '...(PRIOR47[baseId(c)]?.[key]||[]),...(PRIOR_REVIEW[baseId(c)]?.[key]||[]),', 1)
    path.write_text(html)
    print(f'Applied reviewed amendments to {len(prior)} templates; partner estimates preserved.')


if __name__ == '__main__':
    main()
