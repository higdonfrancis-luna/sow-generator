"""No customer-facing release labels or product-release dates; retain client dates."""
import json
from pathlib import Path
import re
import sys

SOW = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SOW))
from product_copy import scrub

FORBIDDEN = re.compile(r'\bbeta\b|early access|early adopter|limited availability|limited release|coming soon|(?:June 17, 2026|August 2026|April 1, 2026|October 2026)', re.I)


def check(value, path=''):
    if isinstance(value, dict):
        for k, v in value.items():
            if k not in ('neutral', 'evidence', 'checked'):
                check(v, path + '.' + k)
    elif isinstance(value, list):
        for i, v in enumerate(value):
            check(v, path + f'[{i}]')
    elif isinstance(value, str) and not value.startswith(('https://', 'http://')):
        assert not FORBIDDEN.search(value), (path, value)


html = (SOW / 'index.html').read_text()
templates = json.loads(re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html, re.S).group(1))
canvas = json.loads((SOW / 'canvas/catalog.json').read_text())
check(templates, 'templates')
check(canvas, 'canvas')
check(json.loads((SOW / 'canvas/problems.json').read_text()), 'problem picker')
concepts = json.loads(re.search(r'const REVIEW_CONCEPTS=(.*?);</script>', html, re.S).group(1).replace('<\\/', '</'))
check(concepts, 'concepts')
assert len(templates) == 44 and len(concepts) == 159 and len(canvas['connections']) == 75
assert scrub('Client kickoff: November 7, 2026. Deliver 12 pages in two weeks.') == 'Client kickoff: November 7, 2026. Deliver 12 pages in two weeks.'
check(scrub('Configure the beta connector. The feature is expected to be released in June 2027. Keep 12 fields.'))
assert '12 fields' in scrub('Configure the beta connector. Keep 12 fields.')
assert scrub('The Client site is scheduled to be launched in June 2027.') == 'The Client site is scheduled to be launched in June 2027.'
print('PASS: all 278 records and 159 inherited concept definitions have clean product copy; Client dates and quantities are preserved.')
