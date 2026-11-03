"""Step 30 on the Build canvas (Nov 3 2026, Adam: "ok" to option A on sow/mockups/nov3_overlap/counted_once_overlap.png):
counted once becomes the overlap review. CJA data preparation in Experience Platform no longer covers (zeroes) the three
CJA source services from outside systems: with all three on, turning it on lowered the total ($240,000 to $231,600)
and dropped the warehouse, file and CRM work from the SOW, and Adobe's Data Mirror needs relational schemas that the
data preparation service doesn't describe. Now every service counts; while both are on, each source service's line
says it overlaps with CJA data preparation and that the SOW asks how they differ (the SOW steps' half is
sow/patch_step30.py). The covering and its keeps are removed completely; the generic Coworker Skills keep their
"replaced" behavior.
Run once on the step 29 template, then build.py and build_site.py.

    python3 sow/canvas/patch_step30.py sow/canvas/template.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'const COVER=' in html and 'OVERLAP=' not in html, 'run this on the step 29 template'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')

# the covering goes; the overlap is shown instead
rep("/* counted once: CJA data preparation in Experience Platform covers the three CJA source services from outside systems */\n"
    "const COVER={OX3:'CJ01',OX4:'CJ01',OX5:'CJ01'};\n"
    "const replaced=l=>(l==='CW03'&&!st.keep.CW03&&specialOn())||(!!COVER[l]&&!st.keep[l]&&!!LN[COVER[l]]&&has('cja')&&counted(COVER[l]));",
    "/* overlaps: the three CJA source services from outside systems overlap CJA data preparation in Experience Platform; both count, and the SOW steps ask how they differ */\n"
    "const OVERLAP={OX3:'CJ01',OX4:'CJ01',OX5:'CJ01'};\n"
    "const replaced=l=>l==='CW03'&&!st.keep.CW03&&specialOn();\n"
    "const overlapOn=l=>!!OVERLAP[l]&&!!LN[OVERLAP[l]]&&has('cja')&&counted(l)&&counted(OVERLAP[l]);")
rep("<span class=\"rep\">${COVER[l]?'Covered by '+esc(LN[COVER[l]].name)+', which is on. Check to keep it for work that service does not cover.':'Replaced by the specialized Skills on this canvas. Check to keep it for distinct Skills.'}</span>",
    "<span class=\"rep\">Replaced by the specialized Skills on this canvas. Check to keep it for distinct Skills.</span>")
rep("aria-label=\"Keep ${esc(L.name)}${COVER[l]?'':' for distinct Skills'}\"", "aria-label=\"Keep ${esc(L.name)} for distinct Skills\"")
rep("${setNote(l)?'<span class=\"svc\">'+setNote(l)+'</span>':''}</span><span class=\"hr\">",
    "${setNote(l)?'<span class=\"svc\">'+setNote(l)+'</span>':''}${overlapOn(l)?'<span class=\"rep\">Overlaps with '+esc(LN[OVERLAP[l]].name)+', which is on. The SOW asks how they differ.</span>':''}</span><span class=\"hr\">")
# Remove from canvas no longer has keeps to clear (they belonged to the covering)
rep("function removeOutside(id){st.out=(st.out||[]).filter(x=>x!==id);for(const c of C.filter(c=>c.a===id||c.b===id))for(const l of all(c))delete st.keep[l];hideCard(true);render();",
    "function removeOutside(id){st.out=(st.out||[]).filter(x=>x!==id);hideCard(true);render();")

assert 'COVER' not in html, 'the covering must be gone completely'
assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('canvas step 30 applied: every service counts; the source services show the overlap with CJA data preparation')
