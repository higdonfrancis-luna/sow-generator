"""Step 37 of the SOW tool (Nov 3 2026, Adam: "ok, fix", UNRESOLVED.md item 22): the Services CSV's total row follows
the screens. With no monthly service it read "Illustrative total: implementation + 12-month term" with 12 in the
months column; now it reads "Illustrative total: one-time services only" and leaves the months blank, as the screens
and the SOW say "One-time services only". With monthly services it is unchanged.
Run once on the step 36 file.

    python3 patch_step37.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
old = ("rows.push(['','','Illustrative total: implementation + '+state.months+'-month term','',cents(t.oneHours+t.monthHours*state.months),'',state.currency,'',state.months,t.totalFee??'',")
new = ("rows.push(['','',t.monthHours>0?'Illustrative total: implementation + '+state.months+'-month term':'Illustrative total: one-time services only','',cents(t.oneHours+t.monthHours*state.months),'',state.currency,'',t.monthHours>0?state.months:'',t.totalFee??'',")
assert html.count(old) == 1 and 'one-time services only\',' not in html, 'run this on the step 36 file'
b = html.count('{') - html.count('}')
html = html.replace(old, new)
assert html.count('{') - html.count('}') == b and '—' not in html
open(path, 'w', encoding='utf-8').write(html)
print('step 37 applied: the CSV total row says one-time services only when there are no monthly services')
