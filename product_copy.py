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
    """Give every connection a Client-facing availability and prerequisite list where the partner's differs.

    Step 53 (Nov 10 2026, Adam's decision 2): `connection_client` {id: {how, gain, note}} gives a connection the
    client-voice version of its how and gain (sowHow, sowGain) that the RFP Builder's drafted answer prefers over the
    partner's card text, and a partner note (sowNote) holding the cautions and lifecycle labels the client version
    leaves out. `line_scopes` {id: [before, after]} rewords a research line's scope so it starts with a verb."""
    client = RULES.get('connection_client', {})
    for c in cat['connections']:
        avail = sow(c.get('sowAvailability') or c.get('availability') or '')
        if avail and avail != (c.get('sowAvailability') or c.get('availability')):
            c['sowAvailability'] = avail
        pre = [sow(x) for x in (c.get('sowPrereqs') or c.get('prereqs') or [])]
        if pre and pre != (c.get('sowPrereqs') or c.get('prereqs')):
            c['sowPrereqs'] = pre
        cv = client.get(c['id'])
        if cv:
            assert cv.get('how'), f"{c['id']}: connection_client needs a how"
            c['sowHow'] = cv['how']
            if cv.get('gain'):
                c['sowGain'] = cv['gain']
            if cv.get('note'):
                c['sowNote'] = cv['note']
    for lid, (before, after) in RULES.get('line_scopes', {}).items():
        line = cat['lines'].get(lid)
        if not line:
            continue
        if line.get('scope') == after:
            continue
        assert line.get('scope') == before, f"{lid}.scope: expected {before[:60]!r}, found {str(line.get('scope'))[:60]!r}"
        line['scope'] = after
    # step 58 (Nov 10 2026): `line_tiers` {id: [before, after]} rewords the package tag a research line carries
    # ("Needs ..." on the canvas, "Assumes your client has ..." in the SOW)
    for lid, (before, after) in RULES.get('line_tiers', {}).items():
        line = cat['lines'].get(lid)
        if not line or line.get('tier') == after:
            continue
        assert line.get('tier') == before, f"{lid}.tier: expected {before!r}, found {line.get('tier')!r}"
        line['tier'] = after
    return cat


def connection_notes(cat):
    """Per-connection wording of the partner's card (Nov 8, Adam). Two rule sets:
    `connection_prereqs` {id: [[before, after], ...]}: a prerequisite reworded and moved to the top of "Before it works",
    so the card shows it without opening "more" (the Coworker eligibility caveat, worded as Adobe words it per product).
    `connection_overrides` {id: {field: [[before, after], ...]}}: text replaced in place on one connection's partner fields
    (availability, label, how, gain.title, gain.text, flows.<i>.what, prereqs, tier, covered), a field set whole with
    `<field>_set`, or its SOW fields (sowAvailability,
    sowPrereqs); `connection_top` {id: [prerequisite texts]} moves those items to the top of the list.
    A partner rewrite of availability or prereqs leaves the SOW what it printed before, unless the SOW has its
    own version. Both run before sow_view, so the SOW still gets its own Client-voice version of every line."""
    notes = RULES.get('connection_prereqs', {})
    overrides = RULES.get('connection_overrides', {})
    top = RULES.get('connection_top', {})
    for c in cat['connections']:
        # `connection_top` {id: [exact prerequisite texts]}: the pitch-changing items first, so they show above the fold;
        # the SOW list moves with them (same index), so the two stay aligned
        for text in reversed(top.get(c['id'], [])):
            pre = c.get('prereqs') or []
            assert text in pre, f"{c['id']}.prereqs: {text[:60]!r} not found for connection_top"
            i = pre.index(text)
            c['prereqs'] = [pre[i]] + pre[:i] + pre[i + 1:]
            if c.get('sowPrereqs') and len(c['sowPrereqs']) == len(pre):
                sp = c['sowPrereqs']
                c['sowPrereqs'] = [sp[i]] + sp[:i] + sp[i + 1:]
        for before, after in notes.get(c['id'], []):
            for key in ('prereqs', 'sowPrereqs'):
                items = c.get(key) or []
                if before in items:
                    i = items.index(before)
                    c[key] = [after] + items[:i] + items[i + 1:]
        for field, pairs in overrides.get(c['id'], {}).items():
            # the SOW keeps the text it printed before a partner-card rewrite, unless it has its own version
            if field in ('availability', 'sowAvailability') and not c.get('sowAvailability') and c.get('availability'):
                c['sowAvailability'] = c['availability']
            if field in ('prereqs', 'sowPrereqs') and not c.get('sowPrereqs') and c.get('prereqs'):
                c['sowPrereqs'] = list(c['prereqs'])
            if field.endswith('_set'):
                # a field the connection did not have, set whole (for example an availability line for an outside system)
                base = field[:-4]
                assert not c.get(base), f"{c['id']}.{base} already has a value; use a replacement pair"
                c[base] = pairs
            elif field in ('prereqs', 'sowPrereqs'):
                for before, after in pairs:
                    assert before in (c.get(field) or []), f"{c['id']}.{field}: {before[:60]!r} not found"
                    c[field] = [after if x == before else x for x in c[field]]
            elif field.startswith('flows.'):
                i, k = field.split('.')[1:3]
                flow = c['flows'][int(i)]
                for before, after in pairs:
                    assert before in flow.get(k, ''), f"{c['id']}.{field}: {before[:60]!r} not found"
                    flow[k] = flow[k].replace(before, after)
            elif field.startswith('gain.'):
                k = field.split('.', 1)[1]
                for before, after in pairs:
                    assert before in (c.get('gain') or {}).get(k, ''), f"{c['id']}.{field}: {before[:60]!r} not found"
                    c['gain'][k] = c['gain'][k].replace(before, after)
            else:
                for before, after in pairs:
                    assert before in (c.get(field) or ''), f"{c['id']}.{field}: {before[:60]!r} not found"
                    c[field] = c[field].replace(before, after)
    return cat


def template_overrides(catalog):
    """`template_overrides` {id: {field: [[before, after], ...]}}: text replaced on one template's field (Nov 8), with
    dotted paths for the size bands (bands.small.scope). Idempotent: a pair whose `after` is already in place is skipped.
    Used to keep a template's partner-only fields (basis, band quantities) in the partner's voice and its SOW fields
    (scope, deliverable, acceptance, assumptions, exclusions, and their band variants) in the Client's."""
    rules = RULES.get('template_overrides', {})
    for t in catalog:
        for field, pairs in rules.get(t['id'], {}).items():
            keys = field.split('.')
            holder = t
            for k in keys[:-1]:
                holder = holder[k]
            value = holder.get(keys[-1]) or ''
            for before, after in pairs:
                if after in value and before not in value:
                    continue
                assert before in value, f"{t['id']}.{field}: {before[:60]!r} not found"
                value = value.replace(before, after)
            holder[keys[-1]] = value
    return catalog
