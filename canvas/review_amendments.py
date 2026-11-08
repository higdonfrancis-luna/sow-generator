"""Apply the reconciled CP11 decisions after assembling the original catalog inputs.

The immutable review manifest keeps accepted amendments ahead of the original audit.
Templates are authored in sow/index.html; concepts and connections are amended here.
"""
import copy
import json
from pathlib import Path
import re
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from product_copy import tree as public_copy

MANIFEST = Path(__file__).resolve().parents[1] / 'audit_2026-11-06/independent-review/checkpoint-11/proposed-implementation-manifest.json'


def parts(field):
    return [int(x) if x.isdigit() else x for x in re.findall(r'[^.\[\]]+', field)]


def get(obj, field):
    for key in parts(field):
        if not isinstance(obj, (dict, list)):
            return None
        try:
            obj = obj[key]
        except (KeyError, IndexError):
            return None
    return obj


def put(obj, field, value):
    keys = parts(field)
    for key in keys[:-1]:
        obj = obj[key]
    obj[keys[-1]] = copy.deepcopy(value)


def apply_catalog(cat):
    manifest = json.loads(MANIFEST.read_text())
    connections = {c['id']: c for c in cat['connections']}
    for change in manifest['changes']:
        target = connections[change['id']] if change['entity_type'] == 'connection' else cat['lines'].get(change['id'])
        if target is None:  # CW00 and X01 are only present in the SOW catalog.
            continue
        template = target.get('origin') == 'sow'
        edits = []
        for edit in change['edits']:
            field = edit['field']
            if template:
                if field not in ('source', 'sourceTitle', 'references'):
                    continue  # Rich template text is carried by the SOW catalog.
                field = {'source': 'url', 'sourceTitle': 'src'}.get(field, field)
            current = get(target, field)
            if current not in (edit['before'], edit['after'], public_copy(edit['before']), public_copy(edit['after'])):
                raise ValueError(f"Review input drift: {change['id']}.{field}: {current!r}")
            edits.append((field, edit['after']))
        for field, value in edits:
            put(target, field, value)
    return cat
