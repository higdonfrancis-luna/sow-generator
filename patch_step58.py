"""Step 58 (Nov 10 2026, Adam: "YES" to sow/bv_copy_review_2026-11-10/PROPOSAL.md): the Brand Visibility wording pass.

Two rules for every word a partner or a client reads in the tool:
1. No Brand Visibility trial. The tool speaks of a Brand Visibility license; nothing says trial, free trial or paid offer.
2. Brand Visibility connects with Customer Journey Analytics. Adobe Analytics is not named as a way to feed Brand Visibility.
Sites Optimizer's own trial wording and Coworker's "Try Before You Buy, a trial or the Agentic SKU" stay: different products.

What it changes:
- sow/product_copy_rules.json
  - `replacements`: thirteen new pairs, each an old sentence or clause and its new wording. The build applies them to the
    canvas catalog, and the page applies them to a saved draft when it opens, so a draft or a browser that holds an old
    sentence takes the new one and is not shown as "Scope edited" (the page compares the scrubbed text with today's).
    The older pair that ended in "The paid offer is assumed." now ends without it.
  - `connection_overrides`: the Brand Visibility + CJA first prerequisite and the AEM Sites + Brand Visibility availability
    note (both written by an override) get the new wording; Search data + Brand Visibility's package tag reads
    "a Brand Visibility license".
  - `connection_top`: the Brand Visibility + Adobe Commerce prerequisite it moves to the top is named by its new text.
  - `line_tiers` (new, read by product_copy.sow_view): the package tag of the service SD1.
- sow/index.html: the Assumptions of two service templates in CATALOG, C01 (Connect Brand Visibility and CJA measurement)
  and L03 (Automated optimization deployment pilot). Nothing else in the page is touched; canvas/build.py refreshes the
  rules the page carries.

Run once from the repo root, then rebuild:

    python3 sow/patch_step58.py
    python3 sow/canvas/build.py && python3 sow/build_site.py
"""
import json
import os
import re

SOW = os.path.dirname(os.path.abspath(__file__))
RULES_PATH = os.path.join(SOW, 'product_copy_rules.json')
PAGE_PATH = os.path.join(SOW, 'index.html')

LICENSE_LINE = "A Brand Visibility license (CJA's page requires it for the source)"
NEW = [
    # rule 1: the trial
    ["The paid Brand Visibility offering, not the free trial (CJA's page requires it for the source)", LICENSE_LINE],
    [" (trial users need the LLMO Admin IMS group)", ""],
    [" (trial users: the LLMO Admin IMS group)", ""],
    [" (trials get one opportunity, Recover Content Visibility by default)", ""],
    ["GA4 is included in the paid Brand Visibility offer and is not available on the free trial.",
     "GA4 is included with the Brand Visibility license."],
    ["The paid Brand Visibility offer is assumed, because trial workspaces have tighter deployment limits.",
     "The Client confirms its licensed deployment allowance and supported opportunity types before optimization begins."],
    ["The paid offer is assumed. The Client confirms its licensed deployment allowance",
     "The Client confirms its licensed deployment allowance"],
    ["is on the paid Brand Visibility offer (trial workspaces cannot connect)", "holds a Brand Visibility license"],
    ["has paid Brand Visibility.", "has a Brand Visibility license."],
    # rule 2: Adobe Analytics is not named as a Brand Visibility feed
    ["; Adobe Analytics can feed only Brand Visibility's referral reporting on the Business Impact tab)", ")"],
    [" (Adobe Analytics can feed Brand Visibility's referral reporting, but the AI-agent dataset reaches CJA only)", ""],
    ["as CJA or Adobe Analytics can", "as CJA can"],
    ["has neither CJA nor Adobe Analytics", "does not have CJA"],
]


def main():
    raw = open(RULES_PATH, encoding='utf-8').read()
    assert LICENSE_LINE not in raw, 'run this once on the step 57 rules'
    rules = json.loads(raw)
    assert json.dumps(rules, ensure_ascii=False, indent=2) + '\n' == raw, 'the rules file no longer round-trips'

    # the older pair for the deployment pilot's trial sentence ends without "The paid offer is assumed."
    old = [r for r in rules['replacements'] if r[0].startswith("Trial workspaces have tighter deployment limits (Adobe's pages give 10 pages")]
    assert len(old) == 1 and old[0][1] == 'The paid offer is assumed. The Client confirms its licensed deployment allowance and enablement for the selected opportunity type.'
    old[0][1] = 'The Client confirms its licensed deployment allowance and enablement for the selected opportunity type.'
    befores = {r[0] for r in rules['replacements']}
    assert not any(b in befores for b, _ in NEW)
    rules['replacements'].extend(NEW)

    over = rules['connection_overrides']
    was = "The paid Brand Visibility offering, not the free trial (CJA's page requires it for the source)"
    for field in ('prereqs', 'sowPrereqs'):
        pairs = over['bv-cja'][field]
        assert len(pairs) == 1 and pairs[0][1] == was, field
        pairs[0][1] = LICENSE_LINE
    pairs = over['aemsites-bv']['availability']
    assert len(pairs) == 1 and pairs[0][1] == ("Not stated by Adobe; trial workspaces have tighter deployment limits, so assume the paid offer and "
                                               "confirm your client's deployment allowance and supported opportunity types before optimization begins.")
    pairs[0][1] = "Not stated by Adobe; confirm your client's deployment allowance and supported opportunity types before optimization begins."
    assert 'search-bv' not in over
    over['search-bv'] = {'tier': [['paid Brand Visibility', 'a Brand Visibility license']]}

    top = rules['connection_top']['bv-commerce']
    assert top[0] == 'Adobe Commerce storefront and a Brand Visibility license (trials get one opportunity, Recover Content Visibility by default)'
    top[0] = 'Adobe Commerce storefront and a Brand Visibility license'

    assert 'line_tiers' not in rules
    rules['line_tiers'] = {'SD1': ['paid Brand Visibility', 'a Brand Visibility license']}

    out = json.dumps(rules, ensure_ascii=False, indent=2) + '\n'
    assert '—' not in out and '–' not in out
    open(RULES_PATH, 'w', encoding='utf-8').write(out)

    # the two service templates: only their Assumptions change, by the same pairs
    html = open(PAGE_PATH, encoding='utf-8').read()
    braces = html.count('{') - html.count('}')
    match = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html, re.S)
    catalog = json.loads(match.group(1))
    assert json.dumps(catalog, ensure_ascii=False) == match.group(1), 'CATALOG no longer round-trips'
    before = json.loads(match.group(1))
    by_id = {t['id']: t for t in catalog}

    def reword(text):
        for a, b in NEW:
            text = text.replace(a, b)
        return text

    for tid in ('C01', 'L03'):
        by_id[tid]['assumptions'] = reword(by_id[tid]['assumptions'])
    c01, l03 = by_id['C01']['assumptions'], by_id['L03']['assumptions']
    assert c01.startswith("The integration is available (Brand Visibility's AI-agent data reaches CJA as an Experience Platform dataset through the "
                          "Adobe Brand Visibility source, which the Client adds to a CJA connection and data view), the Client holds a Brand Visibility "
                          "license, the CJA integration is enabled for the organization, and CDN log forwarding is live,"), c01[:330]
    assert ('the selected URLs are inside them. The Client confirms its licensed deployment allowance and enablement for the selected '
            'opportunity type. Adobe generates an impact analysis only for eligible deployments') in l03
    for text in (c01, l03):
        assert not re.search(r'trial|paid|Adobe Analytics', text, re.I), text
    # nothing else in the 44 templates moved
    changed = [(t['id'], k) for t, o in zip(catalog, before) for k in t if t[k] != o[k]]
    assert changed == [('L03', 'assumptions'), ('C01', 'assumptions')] or sorted(changed) == [('C01', 'assumptions'), ('L03', 'assumptions')], changed
    assert all(reword(json.dumps(t, ensure_ascii=False)) == json.dumps(t, ensure_ascii=False) for t in catalog), 'a template still holds an old sentence'
    html = html[:match.start(1)] + json.dumps(catalog, ensure_ascii=False) + html[match.end(1):]
    assert html.count('{') - html.count('}') == braces
    open(PAGE_PATH, 'w', encoding='utf-8').write(html)
    print('step 58 applied: 13 wording pairs in the rules, 4 connection rules, the SD1 package tag, and the Assumptions of C01 and L03')


if __name__ == '__main__':
    main()
