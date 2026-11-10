"""Step 59 (Nov 10 2026, Adam: "YES: remove Engagement title from the Scope step", as drawn in
sow/mockups/nov10_engagement_title/engagement_title.png).

The Client and partner card on the Scope step had an Engagement title box ("Use the sales play title"). It is gone, all
of it: the label and box, the brief's title field, the title carried through the saved-state migration, and the three
places that read it. The statement of work is always titled with the play's own title (as it was whenever the box was
left empty), the downloaded file is named from the Client, or from the play when no Client is typed, and a title typed
earlier, in this browser or in a saved draft, is dropped when the state is opened. The card is now two rows: Client and
Partner, then SOW reference and Prepared on.

Run once on the step 58 SOW page, then build_site.py.

    python3 sow/patch_step59.py sow/index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'Engagement title' in html, 'run this once on the step 58 SOW page'


def rep(old, new):
    global html
    assert html.count(old) == 1, old[:90]
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')
PARENS = html.count('(') - html.count(')')

# 1. the label and its box
rep('<label class="wide">Engagement title<input data-brief="title" placeholder="Use the sales play title"></label>', '')
# 2. a new brief has no title
rep("const defaultBrief=p=>({title:'',objective:", 'const defaultBrief=p=>({objective:')
# 3. a saved state's title (and, before version 4, its project name) is no longer carried over
rep("  b.title=text(prior.title,s.version<4?text(s.project):'');b.objective=text(prior.objective,b.objective);",
    '  b.objective=text(prior.objective,b.objective);')
# 4. the statement of work is titled with the play's title
rep('title:brief().title||docTitle()};}', 'title:docTitle()};}')
# 5. the downloaded file is named from the Client, or from the play
rep("const slug=()=>((state.customer||brief().title||state.play)+'-SOW')", "const slug=()=>((state.customer||state.play)+'-SOW')")
# 6. a typed title no longer counts as an edited brief
rep(' if(b&&(b.title||b.objective!==d.objective||Object.values(b.coverage).some(v=>v)))return true;',
    ' if(b&&(b.objective!==d.objective||Object.values(b.coverage).some(v=>v)))return true;')

assert html.count('{') - html.count('}') == BRACES and html.count('(') - html.count(')') == PARENS
for gone in ('Engagement title', 'data-brief="title"', 'Use the sales play title', 'brief().title', 'prior.title', 'b.title', 's.project', "title:''"):
    assert gone not in html, gone
assert html.count('data-brief="objective"') == 1 and html.count('.form-grid .wide{grid-column:1/-1}') == 1   # the other wide boxes keep their style
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('step 59 applied: Engagement title is removed from the Scope step, the brief and the saved-state migration')
