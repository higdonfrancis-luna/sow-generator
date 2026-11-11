#!/usr/bin/env python3
"""Step 77 (Nov 11 2026, Adam: "What if we added a few questions ... around either Marketo optimizer and qualifier? Also,
could we arrange the questions in a way by use cases", then "yes, build it" to sow/mockups/nov11_questions/questions_grouped.png).

Run once from the repo root: python3 sow/canvas/data_step77.py
Adds four client problems (two for Marketo Qualifier, two for Marketo Optimizer) to problems.json and gives every problem
its use-case group. Each new problem uses only connections the catalog already holds (step 71); its "why" restates the
connection's own wording and its source is the connection's Adobe page."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(HERE, 'problems.json')
d = json.load(open(PATH, encoding='utf-8'))
ids = [p['id'] for p in d['problems']]
assert len(ids) == 19 and not any('group' in p for p in d['problems']), 'step 77 has already been applied'
cat = json.load(open(os.path.join(HERE, 'catalog.json'), encoding='utf-8'))
src = {c['id']: c['source']['url'] for c in cat['connections']}

GROUPS = {
    'found': ['ai-answers-missing', 'ai-traffic-revenue', 'organic-traffic-falling', 'seo-fix-backlog', 'product-pages-ai'],
    'site': ['slow-website', 'storefront-hard-to-update', 'site-visitors-cant-find-answers', 'same-site-for-everyone', 'fsi-complex-questions'],
    'leads': ['b2b-leads-go-cold', 'reps-email-by-hand', 'chats-never-reach-sales', 'same-nurture-path', 'ad-audiences-stale'],
    'messages': ['disconnected-messages', 'abandoned-carts', 'customer-data-silos', 'cant-see-what-works'],
    'team': ['content-too-slow', 'off-brand-assets', 'team-busywork', 'slow-reporting'],
}
CHAT = {'chip': "My client's marketers want to build programs by chat", 'add': ['cw']}
NEW = [
    {'id': 'reps-email-by-hand',
     'problem': "My client's sales reps research every lead and write every follow-up email by hand.",
     'chip': "My client's sales reps research and email every lead by hand", 'starter': False,
     'keywords': ['sdr', 'bdr', 'outbound', 'prospecting', 'outreach', 'sales development', 'qualify & lead', 'lead qualification', 'follow up & email & rep', 'by hand & lead', 'marketo qualifier', 'qualifier', 'log & crm', 'book & meeting & rep'],
     'play': 'custom', 'products': ['mqualifier', 'marketo', 'crm'], 'owned': ['marketo'],
     'why': "Marketo Engage sends live lead activity to Marketo Qualifier, so your client's representatives see who opened, clicked, visited or filled out a form, and an Outbound Workflow can enroll the prospects whose activity matches. Marketo Qualifier reads Salesforce or Microsoft Dynamics 365 and writes outreach activities, opt-outs and status updates back, so no one logs them by hand.",
     'sources': [src['mqualifier-marketo'], src['crm-mqualifier']],
     'refine': [{'chip': "My client's site has a Brand Concierge", 'add': ['bc'], 'owned': ['bc']},
                {'chip': 'My client also wants journeys that react to lead activity', 'add': ['moptimizer']}]},
    {'id': 'chats-never-reach-sales',
     'problem': "Visitors chat on my client's website about pricing or a demo, and the conversation never reaches a salesperson.",
     'chip': "My client's website chats never reach a salesperson", 'starter': False,
     'keywords': ['live chat', 'chat & sales', 'chat & salesperson', 'chat & rep', 'handoff', 'hand off', 'talk to sales', 'demo request', 'book a demo', 'meeting booking', 'chat & meeting', 'chat & demo', 'chat & pricing'],
     'play': 'custom', 'products': ['bc', 'mqualifier'],
     'why': "Brand Concierge hands a visitor to a person through its Handoff to sales skill, as a live chat or a booked meeting, and both route through Marketo Qualifier. Your client's representatives set their calendar and chat availability there, and each chat arrives with the concierge conversation's summary and transcript.",
     'sources': [src['mqualifier-bc']],
     'refine': [{'chip': 'My client runs Marketo Engage', 'add': ['marketo'], 'owned': ['marketo']},
                {'chip': "My client's reps work in Salesforce or Dynamics", 'add': ['crm']}]},
    {'id': 'same-nurture-path',
     'problem': "My client sends every lead down the same nurture path, whatever the lead does.",
     'chip': 'My client sends every lead down the same nurture path', 'starter': False,
     'keywords': ['nurture path', 'nurture track', 'nurture stream', 'drip', 'same & nurture', 'nurture & every lead', 'person journey', 'engagement program', 'marketo optimizer', 'optimizer', 'journey & lead', 'one size & nurture'],
     'play': 'custom', 'products': ['moptimizer', 'marketo'], 'owned': ['marketo'],
     'why': "Marketo Optimizer runs on your client's Marketo Engage instance. Marketo Engage activities start person journeys and move people forward in them, and journey actions add people to Marketo Engage lists, change their program status and request campaigns, so your client keeps its database and programs.",
     'sources': [src['moptimizer-marketo']],
     'refine': [{'chip': 'My client wants its ad audiences kept in step too', 'add': ['ads']}, CHAT]},
    {'id': 'ad-audiences-stale',
     'problem': "My client's ad audiences are out of date because someone exports and uploads the lists by hand.",
     'chip': "My client's ad audiences are out of date", 'starter': False,
     'keywords': ['ad audience', 'matched audience', 'customer match', 'custom audience', 'linkedin audience', 'audience & linkedin', 'audience & facebook', 'audience & google ad', 'upload & list & ad', 'export & list & ad', 'paid media audience', 'retargeting list', 'suppression & ad'],
     'play': 'custom', 'products': ['moptimizer', 'marketo', 'ads'], 'owned': ['marketo'],
     'why': "Marketo Optimizer sends people lists to LinkedIn Matched Audience, Google Customer Match and Facebook Custom Audience. A list is activated from the People lists page or by a journey action, and the destination audience stays in step as people join or leave the list. Marketo Optimizer runs on your client's Marketo Engage instance.",
     'sources': [src['moptimizer-ads'], src['moptimizer-marketo']],
     'refine': [CHAT]},
]
by = {p['id']: p for p in d['problems'] + NEW}
order = [i for g in GROUPS.values() for i in g]
assert sorted(order) == sorted(by) and len(order) == 23, 'every problem sits in one group'
for g, members in GROUPS.items():
    for i in members:
        by[i]['group'] = g
d['problems'] = d['problems'] + NEW          # the 19 keep their places (saved work and tests name them by position)
d['note'] += ' Step 77 (Nov 11 2026): four problems for Marketo Qualifier and Marketo Optimizer, and a use-case group on every problem (found, site, leads, messages, team); See all problems lists them under those headings.'
json.dump(d, open(PATH, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
open(PATH, 'a', encoding='utf-8').write('\n')
print('problems.json:', len(d['problems']), 'problems in', len(GROUPS), 'groups')
