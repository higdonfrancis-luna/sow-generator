"""Step 32 of the SOW tool (Nov 3 2026, Adam: "OK, I like your suggestion"): the three longest descriptions in short
paragraphs. The assumptions of Sites Optimizer setup (SO1, 267 words), Monthly SEO fixes with Sites Optimizer (SO2, 244)
and Implement Brand Concierge (F02, 251) were one block each, about five times a typical service's (median 51 words),
each mixing five or six separate points. They keep every word and only get paragraph breaks, one point each, as mocked
up in sow/mockups/nov2_exports/long_text_paragraphs.png. The breaks show in the edit box on the Services step, the SOW
preview, the downloaded SOW, Print / PDF and the CSV. A draft or a browser that holds today's single-block wording,
unedited, takes the new wording (PRIOR32); one the partner edited keeps the partner's text.
Run once on the step 31 file; every anchor must appear exactly once.

    python3 patch_step32.py index.html
"""
import json
import re
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'id="download-tool"' not in html and 'PRIOR32' not in html, 'run this on the step 31 file'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


m = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html)
raw = m.group(1)
CAT = json.loads(raw)
assert json.dumps(CAT, ensure_ascii=False) == raw
by = {c['id']: c for c in CAT}

# where each new paragraph starts (the first words of paragraphs 2 onward)
STARTS = {
    'SO1': ['How a fix is deployed depends on its opportunity.', 'Code patches reach the developer as a pull request',
            'With Prime, which identifies and suggests fixes,', 'Core Web Vitals come from real-user data',
            'Brand Visibility connects its own Search Console link;'],
    'SO2': ['How an approved fix is deployed depends on its opportunity:', 'Code patches arrive as pull requests or downloaded patches,',
            'With Prime (identify and suggest only),', 'These hours cover reviewing and editing the suggestions',
            "These are the month's site fixes in one allowance,"],
    'F02': ['The documented handoff is live chat or meeting booking', "Live chat and meeting booking don't need Marketo Engage:",
            'The baseline is the anonymous, public-information experience;', "Adobe's Brand Concierge FAQ puts a basic setup"],
}
PRIOR = {}
for cid, starts in STARTS.items():
    old = by[cid]['assumptions']
    assert '\n' not in old, cid
    new = old
    for s in starts:
        assert new.count(' ' + s) == 1, (cid, s)
        new = new.replace(' ' + s, '\n\n' + s)
    assert new.replace('\n\n', ' ') == old, cid
    assert len(new.split('\n\n')) == len(starts) + 1
    by[cid]['assumptions'] = new
    PRIOR[cid] = {'assumptions': [old]}
blob = json.dumps(CAT, ensure_ascii=False)
assert '—' not in blob and '–' not in blob
rep('<script>const CATALOG=' + raw + ';</script>', '<script>const CATALOG=' + blob + ';</script>')

BRACES = html.count('{') - html.count('}')
# today's single-block wording, unedited, takes the paragraphs
rep('const PRIOR24=', '/* step 32: the single-block wording of the three longest assumptions, before their paragraph breaks */\n'
    'const PRIOR32=' + json.dumps(PRIOR, ensure_ascii=False) + ';\nconst PRIOR24=')
rep("...(PRIOR24[c.id]?.[key]||[])]", "...(PRIOR24[c.id]?.[key]||[]),...(PRIOR32[c.id]?.[key]||[])]")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 32 applied: SO1, SO2 and F02 assumptions in short paragraphs (6, 6 and 5), same words; unedited old wording follows')
