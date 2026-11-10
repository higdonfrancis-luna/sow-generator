"""Step 66, follow-up (Nov 10 2026): found by the full run on the step 66 build (`test_rfp_step52.js`, `recheck.js`, check 4.3).

Before step 66 Adobe Analytics was not in the catalog, and the RFI Builder had a rule for a question that named it: draft the
upgrade to Customer Journey Analytics (CJ03) only, and tell the partner "Adobe Analytics is not in this catalog". Adobe
Analytics is a product now, so a question about it is answered from its own services and the rule can never fire. The rule
and the `forced` list that served only it are removed from rfp_answers.js; nothing else used them.

Run once from the repo root, then rebuild:

    python3 sow/patch_step66_rfi.py
    python3 sow/build_site.py
"""
import os

path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'rfp_answers.js')
text = open(path, encoding='utf-8').read()
balance = lambda t: (t.count('{') - t.count('}'), t.count('(') - t.count(')'), t.count('[') - t.count(']'))
before = balance(text)
PAIRS = [
    ("  let named=d.named,via='question',forced=null;", "  let named=d.named,via='question';"),
    ("  // Adobe Analytics is not in this catalog: the upgrade to Customer Journey Analytics is the service it covers\n"
     "  if(!opts.pick&&d.uncovered.includes('Adobe Analytics')&&!named.includes('cja')){named=['cja',...named];forced=['CJ03'];}\n", ""),
    ("    if(forced&&!forced.includes(l))continue;\n", ""),
    ("    if(forced)s=10;\n", ""),
    ("(x.hit>0||x.isDefault||forced)", "(x.hit>0||x.isDefault)"),
    (",excluded:d.excluded,forced:!!forced};", ",excluded:d.excluded};"),
    ("out.push(d.m.forced?'Adobe Analytics is not in this catalog; the draft proposes the upgrade to Customer Journey Analytics.':'Not in this catalog: '+",
     "out.push('Not in this catalog: '+"),
]
for old, new in PAIRS:
    assert text.count(old) == 1, ('anchor not found once', old[:70], text.count(old))
    text = text.replace(old, new)
assert 'forced' not in text, 'a piece of the old rule is left'
assert balance(text) == before, 'braces, parentheses or brackets no longer balance'
open(path, 'w', encoding='utf-8').write(text)
print('the Adobe Analytics upgrade rule is removed from the RFI Builder: Adobe Analytics is answered from its own services')
