#!/usr/bin/env python3
"""Step 77 (Nov 11 2026, Adam: "yes, build it" to sow/mockups/nov11_questions/questions_grouped.png): See all problems lists
the client problems under five use-case headings. The short starting row is unchanged.

Run once from the repo root, after sow/canvas/data_step77.py: python3 sow/canvas/patch_step77.py"""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(HERE, 'template.html')
s = open(PATH, encoding='utf-8').read()
assert 'bp-gh' not in s, 'step 77 has already been applied'
before = (s.count('{') - s.count('}'), s.count('(') - s.count(')'), s.count('[') - s.count(']'))

def rep(a, b):
    global s
    assert s.count(a) == 1, (s.count(a), a[:70])
    s = s.replace(a, b)

rep(""".bp-chip.red{border-color:#EB1000;color:#C40000}""",
    """.bp-chip.red{border-color:#EB1000;color:#C40000}
.bp-gh{margin:18px 0 0;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#C40000}
.bp-gh+.bp-chips{margin-top:8px}""")
rep("""function bpStartHTML(){const all=bp.view==='all',ids=PROBS.map((p,i)=>i).filter(i=>all||PROBS[i].starter);
  return `<div class="bp-chips">${ids.map(i=>bpChip(i)).join('')}<button type="button" class="bp-chip red" data-bpa="${all?'fewer':'all'}">${all?'Show fewer problems':'See all problems'}</button></div>`;}""",
    """/* step 77: See all problems lists them by use case, in each group's own order (problems.json gives every problem its group) */
const BP_GROUPS=[['found','Get found in AI and search'],['site','Website and online store'],['leads','Leads and sales'],['messages','Customer messages and data'],['team','Content and team productivity']];
const BP_ORDER=['ai-answers-missing','ai-traffic-revenue','organic-traffic-falling','seo-fix-backlog','product-pages-ai','slow-website','storefront-hard-to-update','site-visitors-cant-find-answers','same-site-for-everyone','fsi-complex-questions','b2b-leads-go-cold','reps-email-by-hand','chats-never-reach-sales','same-nurture-path','ad-audiences-stale','disconnected-messages','abandoned-carts','customer-data-silos','cant-see-what-works','content-too-slow','off-brand-assets','team-busywork','slow-reporting'];
const bpRank=i=>{const k=BP_ORDER.indexOf(PROBS[i].id);return k<0?BP_ORDER.length+i:k;};
function bpStartHTML(){const all=bp.view==='all',ids=PROBS.map((p,i)=>i).filter(i=>all||PROBS[i].starter);
  if(!all)return `<div class="bp-chips">${ids.map(i=>bpChip(i)).join('')}<button type="button" class="bp-chip red" data-bpa="all">See all problems</button></div>`;
  const known=new Set(BP_GROUPS.map(g=>g[0])),groups=[...BP_GROUPS,['','More problems']].map(([g,h])=>[h,ids.filter(i=>g?PROBS[i].group===g:!known.has(PROBS[i].group)).sort((a,b)=>bpRank(a)-bpRank(b))]).filter(x=>x[1].length);
  return groups.map(([h,m])=>`<h3 class="bp-gh">${esc(h)}</h3><div class="bp-chips">${m.map(i=>bpChip(i)).join('')}</div>`).join('')+'<div class="bp-chips" style="margin-top:18px"><button type="button" class="bp-chip red" data-bpa="fewer">Show fewer problems</button></div>';}""")
after = (s.count('{') - s.count('}'), s.count('(') - s.count(')'), s.count('[') - s.count(']'))
assert before == after, (before, after)
open(PATH, 'w', encoding='utf-8').write(s)
print('template.html: See all problems is grouped by use case')
