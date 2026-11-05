"""Step 47 updates to test_review_nov2.js (Nov 5 2026), each traced to an intended step 47 change by an independent
investigation (none is a regression):
- S25's near-miss check on a phone: the card now fits the first screen and scrolls inside itself (items 3, 25, 26), so
  each X is scrolled into the card's own view and only points inside the card count
- S27's layout check: under 900 px the canvas keeps scale 0.7 and scrolls inside itself (item 3), so a box must lie
  inside that scroll area rather than the visible part
- S27's warehouse card: the availability now says Adobe's pages conflict on Data Mirror (item 44)
- S32: F02's last paragraph was rewritten (item 11); the other words are unchanged
Run once from sow/.

    python3 tests_step47_review.py
"""
import os
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'test_review_nov2.js')
s = open(P, encoding='utf-8').read()


def rep(a, b):
    global s
    assert s.count(a) == 1, (s.count(a), a[:100])
    s = s.replace(a, b)


rep("""      return p.$$eval('#card .ln .tg', ts => ts.filter(t => t.checkVisibility()).map(t => { const r = t.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const pts = [[r.left - 3, cy], [r.right + 3, cy], [cx, r.top - 3], [cx, r.bottom + 3]].filter(([x, y]) => x >= 0 && y >= 0 && x < innerWidth && y < innerHeight);""",
    """      return p.$$eval('#card .ln .tg', ts => ts.filter(t => t.checkVisibility()).map(t => { const c = document.getElementById('card'); c.scrollTop += t.getBoundingClientRect().top - c.getBoundingClientRect().top - c.clientHeight / 2;
        const r = t.getBoundingClientRect(), k = c.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, L = Math.max(0, k.left + c.clientLeft), T = Math.max(0, k.top + c.clientTop);
        const pts = [[r.left - 3, cy], [r.right + 3, cy], [cx, r.top - 3], [cx, r.bottom + 3]].filter(([x, y]) => x >= L && y >= T && x < Math.min(innerWidth, k.left + c.clientLeft + c.clientWidth) && y < Math.min(innerHeight, k.top + c.clientTop + c.clientHeight));""")
rep("""      for (const n of ns) if (n.r.left < cv.left - 1 || n.r.right > cv.right + 1 || n.r.top < cv.top - 1 || n.r.bottom > cv.bottom + 1) bad.push('off the canvas ' + n.id);""",
    """      /* step 47 (audit item 3): under 900 px the canvas keeps scale 0.7 and scrolls inside itself; a box must lie inside that scroll area */
      const sc = document.getElementById('scroller'), pan = document.getElementById('canvas').classList.contains('pan'), L = pan ? cv.left - sc.scrollLeft : cv.left, T = pan ? cv.top - sc.scrollTop : cv.top, R = pan ? L + sc.scrollWidth : cv.right, B = pan ? T + sc.scrollHeight : cv.bottom;
      for (const n of ns) if (n.r.left < L - 1 || n.r.right > R + 1 || n.r.top < T - 1 || n.r.bottom > B + 1) bad.push('off the canvas ' + n.id);""")
rep("""dc.text.includes('Availability: Needs CJA Select, Prime or Ultimate (Data Mirror is not in CJA Foundation)')""",
    """dc.text.includes("Availability: Adobe's pages conflict: the Data Mirror pages call it a limited release for CJA users") && dc.text.includes('Needs CJA Select, Prime or Ultimate (not in CJA Foundation); confirm enablement with the Adobe account team')""")
rep("""same: [t.replace(/\\n\\n/g, ' '), PRIOR32[id].assumptions[0]].map(""",
    """same: [t.replace(/\\n\\n/g, ' '), PRIOR32[id].assumptions[0].replace(/Adobe's Brand Concierge FAQ puts .*$/, "These hours cover the partner's work around Adobe's setup: approved sources and reviewers, conversation and disclosure design, the handoff, the golden-answer and refusal tests and the staged rollout.")].map(""")
open(P, 'w', encoding='utf-8').write(s)
print('test_review_nov2.js: step 47 updates applied')
