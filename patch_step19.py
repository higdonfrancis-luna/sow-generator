"""Step 19 of the SOW tool (Nov 2 2026): the wording review of steps 17 and 18, read against Adobe's pages by an
independent reviewer; every quote below was checked in the saved page text. No hours or starting services change.
- SO1 and SO2 (Sites Optimizer): Adobe's code-patch pages describe pull requests without an Early Access label, its
  July notes list pull requests on GitHub, GitLab, Bitbucket and Azure DevOps, and its October notes list "Core Web
  Vitals Code Deployment (Early Access)"; patches can also be downloaded. So code patches reach the developer as a pull
  request or a downloaded patch, by the route agreed at setup, and always through the customer's review and release.
  The Dispatcher item is Early Access only for broken-backlink redirects on AEM as a Cloud Service. Deploying to
  authoring needs the same permission and configuration gate as preparing patches. Setup now deploys the first
  content fixes it accepts; Prime says who applies what; Core Web Vitals come from Operational Telemetry.
- C06: the same facts, read more plainly (no license claim; each member's primary identity; a destination activates
  after publishing).
- C03: one sentence for both routes, and why Optimize at Edge is not this workflow; "Brand Visibility", not "ABV".
- L03: the self-serve route on AEM as a Cloud Service's managed Fastly CDN is set up in the pilot; selected URLs sit
  inside routed paths; the Last-Modified check is work in the scope, and the assumption says what happens without it.
- F02: Marketo Qualifier's prerequisites in full; the handoff is live chat, meeting booking or both; two routes at
  Large without "separately agreed, supported"; when Marketo Engage is needed (custom routing rules, activity
  write-back); the golden-answer set is scored, not just passed; the second reference reads as its own title.
- CW07: Typical names its quantity; Large's deliverable reads for one plugin or two; installing a plugin grants no
  access (Adobe's "Manage Plugins and Marketplaces", now its second reference).
- FSI notes and toasts say the discovery-to-answer workflow is off and when to add it; the optional services intro
  fits every service it offers.
Run once on the step 18 file (sow/index.html); every anchor must appear exactly once.

    python3 patch_step19.py index.html
"""
import json
import re
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'const PRIOR18=' in html and 'PRIOR19' not in html, 'run this on the step 18 file'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


m = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html)
raw = m.group(1)
CAT = json.loads(raw)
assert json.dumps(CAT, ensure_ascii=False) == raw
BY = {c['id']: c for c in CAT}
prior = {}
KEYS = ('scope', 'deliverable', 'acceptance', 'assumptions', 'exclusions')


def keep_old(lid, key):
    assert key in KEYS, key
    c = BY[lid]
    olds = [c[key]] + [c['bands'][b][key] for b in ('small', 'large') if key in c['bands'][b]]
    prior.setdefault(lid, {}).setdefault(key, [])
    for o in olds:
        if o not in prior[lid][key]:
            prior[lid][key].append(o)


def sub(lid, key, old, new, where=('base', 'small', 'large')):
    """replace old with new in the base text and in each band text that has this key; each must hold it once"""
    keep_old(lid, key)
    c = BY[lid]
    holders = [(c, 'base')] + [(c['bands'][b], b) for b in ('small', 'large') if key in c['bands'][b]]
    for h, name in holders:
        if name not in where:
            continue
        assert h[key].count(old) == 1, (lid, name, key, old)
        h[key] = h[key].replace(old, new)


# ---------- SO1 ----------
sub('SO1', 'scope', 'set who can suggest and who can deploy,', 'set who can deploy fixes and who can prepare code patches,')
sub('SO1', 'scope', 'Agree the route for each kind of fix (authoring, source documents or code patches) and who reviews and releases it.',
    'Agree the route and owner for each kind of fix (authoring or source documents, code patches, or configuration such as redirects), '
    'deploy the first agreed content fixes (with Prime, apply them by hand) and prepare any code patches they need.')
sub('SO1', 'acceptance', 'the first agreed content fixes are deployed, and any first code patches are with the named developer.',
    'the first agreed content fixes are in authoring (with Prime, applied by hand), and any code patches for them are with the named developer.')
sub('SO1', 'assumptions',
    "With the Ultimate package, approved content fixes go into authoring (on Edge Delivery, into the source documents) for people to review "
    "and publish, and Core Web Vitals fixes are prepared as code patches, which need a connected code repository, permission to prepare them "
    "and a named developer who reviews, tests, merges and releases them. Submitting code patches as pull requests and deploying redirects "
    "through Dispatcher are Early Access features, used only where Adobe has enabled them. With Prime, which identifies and suggests fixes, "
    "the first agreed fixes are applied by hand through the content, code or configuration workflow that fits each one. Adobe analyzes Core "
    "Web Vitals only on pages with at least 1,000 page views.",
    "With the Ultimate package, approved content fixes go into authoring (on document-authored Edge Delivery sites, into the source "
    "documents) for people to review and publish, and Core Web Vitals fixes are prepared as code patches for a named developer who reviews, "
    "tests, merges and releases them. Deploying to authoring and preparing code patches each need the user's permission for that action and "
    "a fully configured site (Adobe's example is a connected code repository). Code patches reach the developer as a pull request in the "
    "connected repository or as a downloaded patch; Adobe's October 2026 release notes list pull-request submission for Core Web Vitals as "
    "Early Access, so the route is confirmed here. On AEM as a Cloud Service sites, deploying broken-backlink redirects through Dispatcher "
    "is Early Access, used only where Adobe has enabled it. With Prime, which identifies and suggests fixes, the first agreed content and "
    "configuration fixes are applied by hand and code fixes go to the named developer. Core Web Vitals come from real-user data "
    "(Operational Telemetry, connected during setup if it isn't yet), and Adobe analyzes them only on pages with at least 1,000 page views.")
assert all(o in BY['SO1']['assumptions'] for o, _ in BY['SO1']['neutral']['bv']['assumptions'])

# ---------- SO2 ----------
BY['SO2']['basis'] = ("One site: each month, review Sites Optimizer's new SEO opportunities, approve the fixes, deploy the content fixes, "
                      "hand code patches to the developer, and report the results.")
sub('SO2', 'scope', 'hand the Core Web Vitals code patches to the named developer to review, test, merge and release,',
    'prepare the code patches (such as Core Web Vitals fixes) and hand them to the named developer to review, test, merge and release,')
sub('SO2', 'acceptance', "The month's agreed content fixes are deployed to authoring and published by the customer, its code patches are "
    "with the named developer with their status recorded, and the results are reported.",
    "The month's agreed content fixes are in authoring, ready for the customer to publish (with Prime, applied by hand), the month's code "
    "patches are with the named developer and their status is in the fix log, and the results are reported.")
sub('SO2', 'assumptions', "content fixes go into authoring (on Edge Delivery, into the source documents) and people publish them",
    "content fixes go into authoring (on document-authored Edge Delivery sites, into the source documents) and people publish them")
sub('SO2', 'assumptions', "Submitting code patches as pull requests and deploying redirects through Dispatcher are Early Access features, used "
    "only where Adobe has enabled them; otherwise those fixes go through the customer's own release process. With Prime (identify and "
    "suggest only), approved fixes are applied by hand through the content, code or configuration workflow that fits each one.",
    "Code patches arrive as pull requests or downloaded patches, by the route agreed at setup, and either way go through the customer's own "
    "review and release process; on AEM as a Cloud Service sites, broken-backlink redirects deploy through Dispatcher only where Adobe has "
    "enabled that Early Access feature. With Prime (identify and suggest only), the partner applies approved content and configuration "
    "fixes by hand, and code fixes go to the named developer with Sites Optimizer's recommendation.")
assert BY['SO2']['scope'].count(' in the Brand Visibility review') == 1
assert all(o in BY['SO2']['assumptions'] for o, _ in BY['SO2']['neutral']['bv']['assumptions'])

# ---------- C06 ----------
sub('C06', 'assumptions', "The customer is licensed for Experience Platform's Real-Time Customer Profile, which CJA audiences publish to, and "
    "has an administrator with CJA's Audience Publishing permission and Experience Platform's Manage Profiles permission, and an agreed "
    "Person ID in the CJA connection, whose identity namespace becomes each audience's primary identity.",
    "The customer's Experience Platform has Real-Time Customer Profile, where CJA publishes audiences. A CJA administrator, who gets the "
    "Audience Publishing permission automatically, also has Experience Platform's Manage Profiles permission. The Person ID in the CJA "
    "connection is agreed: CJA sends it as each audience member's primary identity, one identity per person.")
sub('C06', 'assumptions', "Any downstream destination is already configured and licensed; it does not replace publishing to Real-Time Customer Profile.",
    "Any downstream destination is already configured and licensed in Experience Platform and is activated there after the audience is published.")
assert all(o in BY['C06']['assumptions'] for o, _ in BY['C06']['neutral']['bv']['assumptions'])

# ---------- C03 ----------
sub('C03', 'scope', 'from ABV findings to AEM review and publishing', 'from Brand Visibility findings to AEM review and publishing')
sub('C03', 'assumptions', "The exact AEM or Edge Delivery route is confirmed before work begins. The route from Brand Visibility's "
    "recommendations to AEM is confirmed for the tenant before work begins: a native route only where Adobe confirms it is enabled, otherwise "
    "this partner-designed workflow, where findings reach AEM through the customer's authoring and approval process.",
    "Before work begins, the authoring route (AEM or Edge Delivery) is confirmed, and so is how Brand Visibility's findings reach it: through "
    "an Adobe connection only where Adobe confirms one is enabled for the customer, otherwise through this partner-designed workflow and the "
    "customer's authoring and approval process. Optimize at Edge changes only what AI agents receive at the CDN; this workflow carries "
    "findings into AEM itself.")

# ---------- L03 ----------
LM = 'check that each selected page sends a Last-Modified header where the opportunity needs one, then deploy approved changes'
sub('L03', 'scope', 'Using the agreed Optimize at Edge route, deploy approved changes', 'Using the agreed Optimize at Edge route, ' + LM, where=('base', 'small'))
keep_old('L03', 'scope')
lg = BY['L03']['bands']['large']
assert lg['scope'].count('Using up to two agreed Optimize at Edge routes, deploy approved changes') == 1
lg['scope'] = lg['scope'].replace('Using up to two agreed Optimize at Edge routes, deploy approved changes', 'Using up to two agreed Optimize at Edge routes, ' + LM)
sub('L03', 'assumptions', "(Optimize at Edge routing on the outer CDN: already in place, applied by the customer's CDN team, or covered by "
    "CDN readiness and routing in the Commerce play), access, capacity and approved changes.",
    "(Optimize at Edge routing on the outer CDN: already in place; set up self-serve in Brand Visibility, as part of this pilot, for AEM as a "
    "Cloud Service sites on Adobe's managed Fastly CDN; applied by the customer's CDN team; or covered by CDN readiness and routing in the "
    "Commerce play), access, capacity and approved changes. Where routing covers only some paths, the selected URLs are inside them.")
sub('L03', 'assumptions', 'so the opportunity type is confirmed for the client.', 'so the opportunity type is confirmed for the customer.')
sub('L03', 'assumptions', "For content opportunities that watch the source page for changes, such as Add LLM-friendly Summaries, Brand "
    "Visibility relies on the page's Last-Modified response header and skips the optimization when it is missing; this pilot checks the "
    "header on the selected pages before deployment, and any fix is agreed with the customer first.",
    "For content opportunities such as Add LLM-friendly Summaries, Brand Visibility watches the source page's Last-Modified response header: "
    "it pauses the optimization for review when the page changes and skips it when the header is missing. A selected page without the header "
    "is replaced, or the customer's team adds the header before deployment.")
assert 'deliverable' not in lg
lg['deliverable'] = BY['L03']['deliverable'].replace('when Adobe generates one for the deployment.', 'when Adobe generates one for each deployment.')
assert lg['deliverable'] != BY['L03']['deliverable']

# ---------- F02 ----------
f02 = BY['F02']
sub('F02', 'scope', 'set up one supported handoff to the customer-designated team,', 'set up the handoff (live chat, meeting booking or both) routed to one customer-designated team,', where=('base',))
sub('F02', 'scope', 'set up two separately agreed, supported handoff routes to the customer-designated teams,',
    'set up two handoff routes, each agreed separately, to two customer-designated teams,', where=('large',))
sub('F02', 'scope', "build the golden-answer test set (with the priority discovery questions from the Brand Visibility program) and the refusal "
    "and escalation scenarios with the customer's reviewers,",
    "build, with the customer's reviewers, the golden-answer test set (including the priority discovery questions from the Brand Visibility "
    "program) and the refusal and escalation scenarios,")
assert f02['neutral']['bv'] == {'scope': [[' (with the priority discovery questions from the Brand Visibility program)', '']]}
f02['neutral']['bv'] = {'scope': [[' (including the priority discovery questions from the Brand Visibility program)', '']]}
sub('F02', 'acceptance', 'the golden-answer tests and the refusal and escalation scenarios pass;',
    'the golden-answer set scores at or above the agreed level for correctness, helpfulness and brand fit, and the refusal and escalation scenarios pass;')
sub('F02', 'assumptions', "which needs representatives with a connected calendar or set chat availability;",
    "which needs the representatives added as users in the Adobe Admin Console and at least one representative with a connected calendar "
    "(for meeting booking) or set live chat availability (for live chat);")
sub('F02', 'assumptions', "Live chat and meeting booking don't need Marketo Engage; custom routing rules and writing concierge activities to the "
    "Marketo person record do.",
    "Live chat and meeting booking don't need Marketo Engage: round robin and direct-agent routing work without it, and it is needed only for "
    "custom routing rules, which pick a team by Marketo attributes, and for writing concierge activities to the Marketo person record.")
f02['sourceTitle2'] = 'Experience League: Brand Concierge live chat and meeting booking'

# ---------- CW07 ----------
cw7 = BY['CW07']
sub('CW07', 'scope', 'Package the agreed Skills and connections as one installable plugin,', 'Package the agreed Skills and up to two connections as one installable plugin,', where=('base',))
sub('CW07', 'deliverable', 'The plugin packages, the marketplace repository,', 'The plugin package or packages, the marketplace repository,', where=('large',))
sub('CW07', 'assumptions', 'Reuse across customers is the partner\'s choice.',
    "Reuse across customers is the partner's choice. The agreed users already have access to the products the connections reach; installing "
    "the plugin grants none.")
cw7['source2'] = 'https://experienceleague.adobe.com/en/docs/coworker/content/customizations/plugins/manage-plugins-for-your-org'
cw7['sourceTitle2'] = 'Experience League: Manage plugins and marketplaces'

blob = json.dumps(CAT, ensure_ascii=False)
assert '—' not in blob and '–' not in blob and 'consultants' not in blob
rep('<script>const CATALOG=' + raw + ';</script>', '<script>const CATALOG=' + blob + ';</script>')
rep("const PRIOR18=", "const PRIOR19=" + json.dumps(prior, ensure_ascii=False) + ";\nconst PRIOR18=")
rep("...(PRIOR18[c.id]?.[key]||[])].filter(x=>typeof x==='string')", "...(PRIOR18[c.id]?.[key]||[]),...(PRIOR19[c.id]?.[key]||[])].filter(x=>typeof x==='string')")

# two references read as two titles
rep("+(s.source2?' and <a href=\"'", "+(s.source2?'; <a href=\"'")

# FSI notes and toasts: the discovery-to-answer workflow is off, and when to add it
rep("new:'This engagement implements Brand Concierge (Implement Brand Concierge is on). Its golden-answer tests include the Brand Visibility discovery questions, so the separate discovery-to-answer workflow starts off.',",
    "new:'This engagement implements Brand Concierge (Implement Brand Concierge is on), and its golden-answer tests include the Brand Visibility discovery questions. The separate discovery-to-answer workflow is off; add it if the customer also wants the question-to-source map and its refresh workflow.',")
rep("remediate:'The live experience needs fixes first. Implement Brand Concierge stays on: edit its scope to the remediation work, with the Brand Visibility discovery questions in its tests, before issuing.'}",
    "remediate:'The live experience needs fixes first. Implement Brand Concierge stays on: before issuing, rewrite its scope and hours as the remediation work and keep the Brand Visibility discovery questions in its tests.'}")
rep("state.fsiState==='remediate'?'Implement Brand Concierge stays on: edit its scope to the remediation work, with the Brand Visibility questions in its tests.':'Implement Brand Concierge is on, with the Brand Visibility questions in its tests.'",
    "state.fsiState==='remediate'?'Implement Brand Concierge stays on: rewrite its scope as the remediation work and keep the Brand Visibility questions in its tests. The discovery-to-answer workflow is off.':'Implement Brand Concierge is on, with the Brand Visibility questions in its tests; the discovery-to-answer workflow is off.'")
rep("<p>Choose the channels and review work this engagement needs. Additions are estimated separately.</p>",
    "<p>Choose the optional services this engagement needs. Additions are estimated separately.</p>")

assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 19 applied: wording review of steps 17 and 18')
