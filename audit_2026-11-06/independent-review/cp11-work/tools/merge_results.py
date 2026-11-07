"""Rebuild checkpoint 11 from immutable checkpoint 10 and reviewed family results.

Run from any directory. Original received exports and reconciliations are never edited.
Cached-page retrieval, current primary-body review and accepted earlier evidence remain
separate. A URL is closed only by an explicit source-task result or a new full-body
evidence record; pre-existing open tasks require their assigned task result.
"""
import csv
import hashlib
import json
import os
from collections import Counter
from pathlib import Path

W = Path(__file__).resolve().parents[1]
R = W.parent
OUT = R / 'checkpoint-11'
OUT.mkdir(exist_ok=True)
DATE = '2026-11-07'

def js(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'))

def write_csv(path, rows, fields=None):
    fields = fields or list(dict.fromkeys(k for r in rows for k in r))
    with path.open('w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for row in rows:
            writer.writerow({k: js(v) if isinstance(v, (dict, list)) else v for k, v in row.items()})

master = list(csv.DictReader((R/'review-progress/warroom-review-checkpoint-10.csv').open()))
byid = {r['id']: r for r in master}
assert len(byid) == len(master) == 278
lookups = json.loads((R/'source-lookups.json').read_text())
tasks = {t['url']: dict(t) for t in lookups['url_tasks']}
original_tasks = set(tasks)
results = []
for p in sorted((W/'results').glob('*.json')):
    selected = os.environ.get('WARROOM_REVIEW_FAMILIES')
    if selected and p.stem not in selected.split(','):
        continue
    d = json.loads(p.read_text())
    assert len({r['id'] for r in d['records']}) == len(d['records']), p
    d['_file'] = p.relative_to(R).as_posix()
    d.setdefault('reviewer', 'Claude Code' if p.stem == 'root' else 'ChatGPT continuation reviewer')
    results.append(d)

reviews = {}
for result in results:
    for item in result['records']:
        rid = item['id']
        assert rid in byid, rid
        if rid in reviews:
            assert result.get('amendment'), ('Duplicate family ownership', rid)
        reviews[rid] = {**item, 'reviewer': result['reviewer'], 'result_file': result['_file']}
    for t in result['url_tasks']:
        u = t['url']
        row = tasks.setdefault(u, {'url': u, 'records': [], 'provenance': 'Added during checkpoint 11'})
        row.setdefault('cp10_status_class', row.get('status_class', 'not previously tracked'))
        row['status_class'] = t['new_status']
        row['cp11_review'] = t
        row['verification_provenance'] = result['reviewer'] + '; ' + result['_file']
        row['status_note'] = t.get('remaining') or 'Mapped claims resolved against primary page body.'
        row['access_date'] = DATE
        mapped = [c['record'] for c in t.get('claims', []) if c.get('record')]
        row['records'] = sorted(set(row.get('records', [])) | set(mapped))

for rid, review in reviews.items():
    for e in review.get('evidence', []):
        u = e.get('url')
        if not u:
            continue
        if u not in tasks and e.get('depth') in ('full-body', 'primary-body sections', 'full-page'):
            tasks[u] = {'url': u, 'records': [rid], 'status_class': 'closed',
                        'status_note': 'New primary-body evidence for the mapped claim.',
                        'verification_provenance': review['reviewer'], 'access_date': DATE,
                        'cp11_evidence': [e], 'cp10_status_class': 'not previously tracked'}
        elif u in tasks:
            tasks[u]['records'] = sorted(set(tasks[u].get('records', [])) | {rid})
            tasks[u].setdefault('cp11_evidence', []).append({**e, 'record': rid, 'reviewer': review['reviewer']})

queue = []
for row in master:
    rid = row['id']
    review = reviews.get(rid)
    if review:
        if review.get('scope_review') == 'complete':
            row['status'] = 'reviewed'
            row['scope_review'] = 'complete'
        for field in ('position', 'verdict', 'priority', 'correction'):
            value = review.get(field, '')
            if value or field == 'correction':
                if field != 'correction' or value or review.get('work') == 'scope_review':
                    row['current_' + field] = value
            row['cp11_' + field] = value
        row['cp11_reviewer'] = review['reviewer']
        row['cp11_result_file'] = review['result_file']
        row['cp11_primary_evidence'] = review.get('evidence', [])
        row['cp11_catalog_edits'] = review.get('catalog_edits', [])
        row['cp11_settled_change'] = review.get('settled_change')
        row['cp11_notes'] = review.get('notes', '')
        row['cp11_scope_review'] = review.get('scope_review')
    mapped = [t for t in tasks.values() if rid in t.get('records', [])]
    open_tasks = [t for t in mapped if t['status_class'] != 'closed']
    row['cp11_outstanding_urls'] = [t['url'] for t in open_tasks]
    row['cp11_citation_verification'] = 'pending' if open_tasks else 'mapped claims resolved; see retained and current evidence'
    queue.append({'id': rid, 'record_type': row['type'], 'kind': row['kind'],
                  'scope_status': row['scope_review'] or ('complete' if row['status'] == 'reviewed' else 'pending'),
                  'queue_status': 'open' if open_tasks or row['status'] != 'reviewed' else 'closed',
                  'open_or_partial_or_conflicted_urls': [t['url'] for t in open_tasks],
                  'closed_source_urls': [t['url'] for t in mapped if t['status_class'] == 'closed'],
                  'current_reviewer': review['reviewer'] if review else 'Retained checkpoint 10 evidence',
                  'historical_evidence': row.get('evidence_full', ''),
                  'accepted_evidence': row.get('evidence_accepted_from_other_reviewer', '')})

pending = sorted(r['id'] for r in master if r['status'] != 'reviewed')
assert len(pending) + sum(r['status'] == 'reviewed' for r in master) == 278
assert len({r['id'] for r in queue}) == 278
integrity = []
manifest = json.loads((R/'IMPORT_MANIFEST.json').read_text())
for item in manifest['files']:
    if item['status'] == 'imported_unchanged':
        p = R/item['package_path']
        assert hashlib.sha256(p.read_bytes()).hexdigest() == item['sha256'], p
        integrity.append(item['package_path'])
counts = {'checkpoint': 11, 'date': DATE, 'records': 278,
          'scope_reviewed': 278-len(pending), 'scope_pending': len(pending),
          'pending_by_kind': dict(Counter(r['kind'] for r in master if r['status'] != 'reviewed')),
          'families_completed': [r['family'] for r in results],
          'url_tasks': len(tasks), 'url_status': dict(Counter(t['status_class'] for t in tasks.values())),
          'received_files_preserved_unchanged': len(integrity),
          'received_checkpoint_exports_preserved_unchanged': 5,
          'note': 'Scope review, URL checks and primary evidence provenance are distinct. Earlier Claude evidence is retained; new ChatGPT reads are explicitly labelled. Source cache retrieval is not a review.'}
write_csv(OUT/'warroom-review-checkpoint-11.csv', master)
write_csv(OUT/'warroom-record-verification-queue-cp11.csv', queue)
write_csv(OUT/'warroom-url-tasks-cp11.csv', list(tasks.values()))
(OUT/'warroom-review-remaining-ids-cp11.txt').write_text(''.join(byid[i]['type']+':'+i+'\n' for i in pending))
(OUT/'warroom-cp11-counts.json').write_text(json.dumps(counts, indent=2)+'\n')
(OUT/'REVIEW_STATE.json').write_text(json.dumps({'counts': counts, 'records_by_id': byid, 'reviews': reviews}, indent=2)+'\n')
(OUT/'source-lookups.json').write_text(json.dumps({'url_tasks': list(tasks.values()), 'record_verification_queue': queue}, indent=2)+'\n')
handoff = R/'HANDOFF.md'
old = handoff.read_text()
marker = '\n<!-- ORIGINAL CLAUDE HANDOFF -->\n'
if marker in old:
    old = old.split(marker, 1)[1]
intro = f'''# Current continuation: checkpoint 11, {DATE}

Work branch: `claude/determined-brahmagupta-clez60`. Continue its existing history; do not reset it. Main, abv-partner-plays and the original audit branch remain untouched. Adam authorized review and implementation, with no further Step 3 approval required. Do not merge or deploy.

Current scope coverage: **{counts['scope_reviewed']} reviewed, {counts['scope_pending']} pending, 278 total**. URL task states: `{js(counts['url_status'])}`. These counts measure different things. The 49 imported files, including the five received exports, still match the import manifest exactly.

Latest exports: `checkpoint-11/warroom-cp11-counts.json`, `checkpoint-11/warroom-review-checkpoint-11.csv`, `checkpoint-11/warroom-review-remaining-ids-cp11.txt`, `checkpoint-11/warroom-record-verification-queue-cp11.csv` and `checkpoint-11/warroom-url-tasks-cp11.csv`. `checkpoint-11/REVIEW_STATE.json` and `checkpoint-11/source-lookups.json` provide structured lookups. Results are in `cp11-work/results/`; regenerate exports with `python3 cp11-work/tools/merge_results.py`.

Completed families: {', '.join(counts['families_completed'])}. Finish remaining scope/source tasks before applying the reconciled edits. Keep accepted amendments ahead of original audit recommendations. New reviewer evidence records say who read the primary body and how it was retrieved; prior Claude and accepted ChatGPT evidence remains in its original columns.

Application validation must include ten Node suites, check.py, and affected citation/assumption propagation, canvas-to-SOW flow, totals and downloads. Local browser launch is blocked by the execution environment's socket restrictions. The test-only GitHub Actions workflow `Warroom review validation` now provides the permitted browser route on this work branch. Its baseline run is https://github.com/higdonfrancis-luna/warroom/actions/runs/42340198171 at c6a7ffbb42a2cd16ef775c5cfd96ea38762cfa77; record observed outcomes separately, never infer a pass from a scheduled run. The workflow has no deployment step.

The original import and source-cache handoff follows for provenance.
'''
handoff.write_text(intro+marker+old)
print(json.dumps(counts, indent=2))
