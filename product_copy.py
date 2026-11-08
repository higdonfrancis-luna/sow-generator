"""Customer-facing copy policy; research/audit provenance stays unchanged.

Two layers (Nov 8 2026, Adam: "number three"). The rules in `replacements` and `patterns` apply to everything shown:
no release label, no feature-release date. The `sow_replacements` apply only to what the Client reads, the
availability and prerequisite lines the SOW prints: Adobe's lifecycle and eligibility notes (Legacy, maintenance mode,
co-innovation, a limited number of customers, Coworker not offered to health care or finance) stay on the partner's
canvas card, and the SOW keeps the condition without the label.
"""
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
RULES = json.loads((ROOT / 'product_copy_rules.json').read_text())


def scrub(value):
    if not isinstance(value, str) or value.startswith(('https://', 'http://')):
        return value
    for before, after in RULES['replacements']:
        value = value.replace(before, after)
    for pattern, replacement in RULES['patterns']:
        value = re.sub(pattern, replacement, value, flags=re.I)
    return value


def tree(value):
    if isinstance(value, dict):
        return {k: (v if k == 'neutral' else tree(v)) for k, v in value.items()}
    if isinstance(value, list):
        return [tree(v) for v in value]
    return scrub(value)


def runtime():
    return (ROOT / 'product_copy.js').read_text().replace('/*COPY_RULES*/null', json.dumps(RULES, ensure_ascii=False).replace('</', '<\\/'))


def sow(value):
    """The Client's version of a line the SOW prints."""
    if not isinstance(value, str) or value.startswith(('https://', 'http://')):
        return value
    for before, after in RULES.get('sow_replacements', []):
        value = value.replace(before, after)
    return value


def sow_view(cat):
    """Give every connection a Client-facing availability and prerequisite list where the partner's differs."""
    for c in cat['connections']:
        avail = sow(c.get('sowAvailability') or c.get('availability') or '')
        if avail and avail != (c.get('sowAvailability') or c.get('availability')):
            c['sowAvailability'] = avail
        pre = [sow(x) for x in (c.get('sowPrereqs') or c.get('prereqs') or [])]
        if pre and pre != (c.get('sowPrereqs') or c.get('prereqs')):
            c['sowPrereqs'] = pre
    return cat


def connection_notes(cat):
    """Partner-card prerequisites that differ by connection (Nov 8, Adam: the Coworker eligibility caveat belongs on a
    connection, worded as Adobe words it for that product). Applied before sow_view, so the SOW still gets the condition."""
    notes = RULES.get('connection_prereqs', {})
    for c in cat['connections']:
        for before, after in notes.get(c['id'], []):
            c['prereqs'] = [after if x == before else x for x in c.get('prereqs', [])]
            if c.get('sowPrereqs'):
                c['sowPrereqs'] = [after if x == before else x for x in c['sowPrereqs']]
    return cat
