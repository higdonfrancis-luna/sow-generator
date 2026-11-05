"""Step 47 canvas data, the content pass (Nov 5 2026, Adam: "yes, fix all 45"; items from sow/audit_2026-11-05/FINDINGS.md;
the SOW-step half of this pass is sow/patch_step47_content.py, the canvas page and build half sow/canvas/patch_step47_content.py):
- 4: licensing and Adobe's own terms say customers (health care customers, customers with Dynamic Media, customer-managed
  CDNs, BYOCDN, Ingestion Service access provisioned for the customer, the Adobe contract); the four sweep decisions
  that made them "client" are set back to keep, and CHANGES.md lists them under Kept as customer
- 6: each connection whose availability or prerequisites tell the partner to do something ("confirm for your client's
  tenant", "prove it in a pilot", "confirm eligibility") gets an SOW version written as a condition with an owner
  (sow_availability, sow_prereqs); the card keeps the partner note, and the hand-over sends only the SOW version
- 7: the canvas says "your client" (not "the client", "For clients ..." or a bare "your"); technical terms stay
  (client-side, Client ID and Client Secret, Adobe Client Data Layer); sweep46_extract.py also lists client and clients,
  and the gain titles
- 17 and 18: the package or purchase a line needs is tagged on the line (Needs ...) and, where the whole connection needs
  it, on the connection; AXA02 says it needs Workfront Fusion. XA27 is Target testing Skills, not Recommendations work,
  so it is not tagged
- 29: no internal line IDs on the cards; pricing pointers move from the prerequisites into the card's how text
- 30: what is coming soon is Coworker support for the B2B editions, not the editions
- 31: "The aem.live martech plugin" on the Journey Optimizer + Edge Delivery card
- 32: XA20's scope reads as a sentence and says your client
- 44: the warehouse into CJA card states Adobe's conflicting Data Mirror availability
audit_types.py and the classification file are mirrored by hand (audit_types.py is not rerun, which would revert steps 45 and 46).
Run once on the step 46 sources (after the earlier step 47 passes), then build.py and ../build_site.py.

    python3 sow/canvas/data_step47.py
"""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
SOW = os.path.dirname(HERE)
R = os.path.join(HERE, 'research')
DASH = re.compile('[–—]')
FILES = {}


ORIG = {}


def load(p):
    if p not in FILES:
        FILES[p] = ORIG[p] = open(p, encoding='utf-8').read()
    return FILES[p]


def rep(p, old, new, n=1):
    t = load(p)
    assert t.count(old) == n, (os.path.basename(p), t.count(old), old[:100])
    FILES[p] = t.replace(old, new)


def add_key(p, lid, key, value):
    """insert "key": value right after a line's "id", in the file's own layout (one line per key, or all on one line)"""
    t = load(p)
    m = [x for x in re.finditer(r'"id": "' + re.escape(lid) + r'",(\s+)', t)]
    assert len(m) == 1, (os.path.basename(p), lid, len(m))
    m = m[0]
    seg = t[m.start():m.start() + 4000]
    assert '"' + key + '"' not in seg[:seg.find('}')], (lid, key)
    FILES[p] = t[:m.end()] + '"' + key + '": ' + json.dumps(value, ensure_ascii=False) + ',' + m.group(1) + t[m.end():]


T = os.path.join(R, 'connection_types.json')
MORE = os.path.join(R, 'connections_more.json')
AEM = os.path.join(R, 'aem_sites_assets.json')
HUB = os.path.join(R, 'cja_hub.json')
OMNI = os.path.join(R, 'portal_omnichannel_b2b.json')
MW = os.path.join(R, 'marketo_workfront.json')
VAL = os.path.join(R, 'connections_value.json')
AUD = os.path.join(HERE, 'audit_types.py')
CLS = os.path.join(R, 'audit_classification_2026-10-31.json')

# ---- 4: licensing and Adobe's terms say customers ----
rep(T, "(Adobe documents it for client-managed CDNs; confirm the route for Adobe's managed CDN)",
    "(Adobe documents it for customer-managed CDNs, BYOCDN; confirm the route for Adobe's managed CDN)")
rep(T, 'Adobe documents log forwarding for client-managed CDNs, so', 'Adobe documents log forwarding for customer-managed CDNs (BYOCDN), so')
rep(T, '"MktoSync: Ingestion Service access provisioned for your client"', '"MktoSync: Ingestion Service access provisioned for the customer"')
rep(T, "Assets Essentials, depending on the client's contract", 'Assets Essentials, depending on the Adobe contract')
rep(T, '"Health care clients: Journey Optimizer Healthcare Shield', '"Health care customers: Journey Optimizer Healthcare Shield', 2)
rep(T, 'and for clients with Dynamic Media with OpenAPI, approved', 'and for customers with Dynamic Media (with OpenAPI), approved')
rep(T, 'and for clients with Dynamic Media, approved renditions', 'and for customers with Dynamic Media (with OpenAPI), approved renditions')
rep(T, 'approved Dynamic Media renditions for clients with Dynamic Media"', 'approved Dynamic Media renditions for customers with Dynamic Media"')
rep(T, 'for health care clients it needs the Healthcare Shield', 'for health care customers it needs the Healthcare Shield')

# ---- 7: the partner's client, worded at the source ----
rep(OMNI, '"For clients moving from AEM on-premise or Adobe Managed Services:', '"Where your client is moving from AEM on-premise or Adobe Managed Services:')
rep(HUB, '"For clients on Analytics for Target today, choose', '"Where your client is on Analytics for Target today, choose')
rep(AEM, '"For clients still on the legacy or enhanced connector:', '"Where your client is still on the legacy or enhanced connector:')
rep(AEM, '"For clients on Workfront Planning, connect', '"Where your client has Workfront Planning, connect')
rep(T, '"For clients with Dynamic Media, set up', '"Where your client has Dynamic Media, set up')
rep(OMNI, '"For clients with Dynamic Media, set up', '"Where your client has Dynamic Media, set up')
rep(T, '"Client-approved knowledge sources with named owners and reviewers"', '"Knowledge sources your client approves, with named owners and reviewers"')
rep(T, '"A concierge grounded in your site"', '"A concierge grounded in your client\'s site"')
rep(MORE, '"A concierge grounded in your site"', '"A concierge grounded in your client\'s site"')
rep(AEM, "(your own GitHub, GitLab, Bitbucket or Azure DevOps, or a branch on a Cloud Manager repository)",
    "(your client's own GitHub, GitLab, Bitbucket or Azure DevOps, or a branch on a Cloud Manager repository)")

# ---- 17 and 18: the package or purchase a service needs ----
rep(T, '"A CJA derived field that groups AI referring domains, for referral analysis inside CJA"',
    '"A CJA derived field that groups AI referring domains, for referral analysis inside CJA (CJA Select, Prime or Ultimate; derived fields are not in CJA Foundation)"')
for f, lid, tier in [
        (VAL, 'BVCJ2', 'CJA Select or higher'),
        (MW, 'XB07', 'CJA Prime or higher (graph-based stitching)'),
        (HUB, 'CJ02', 'CJA Select or higher for field-based stitching, Prime for graph-based'),
        (HUB, 'JC01', 'CJA Select or higher (more than one event dataset in a connection)'),
        (MORE, 'XA17', 'CJA Select or higher (more than one event dataset in a connection)'),
        (MORE, 'XA10', 'CJA Select or higher (more than one event dataset in a connection)'),
        (HUB, 'TG04', 'Target Premium'),
        (AEM, 'AXC05', 'Sites Optimizer Ultimate'),
        (MORE, 'XA07', 'Journey Optimizer Ultimate or the Offer Decisioning add-on'),
        (MORE, 'XA15', 'Real-Time CDP Prime or Ultimate'),
        (MORE, 'XA21', 'Target Premium'),
        (MORE, 'XA18', 'Commerce Optimizer'),
        (MORE, 'XA19', 'Commerce Optimizer'),
        (MORE, 'XA20', 'Commerce Optimizer'),
        (OMNI, 'XC10', 'the CIF add-on'),
        (OMNI, 'XC11', 'the CIF add-on'),
        (OMNI, 'XC12', 'the CIF add-on')]:
    add_key(f, lid, 'tier', tier)
add_key(AEM, 'AXA02', 'ext', 'Workfront Fusion (part of Workfront Ultimate and of Workflow plus Automation and Integration packages; Prime and Select need it bought separately)')

# ---- 29: no internal line IDs; the pricing pointers move into the how text ----
rep(AEM, "When every page runs on Edge Delivery, take AEM Sites' own Core Components site build (SI02) out on its card.",
    'When every page runs on Edge Delivery, take the Site build with components and templates service out on the AEM Sites card.')
rep(T, 'both can run on one domain during a phased move with CDN routing rules (AXD04)."',
    'both can run on one domain during a phased move with CDN routing rules (the AEM publish and Edge Delivery on one domain service, under More services on this card)."')
rep(T, '"Data Connection extension configured and Commerce events confirmed at the Experience Platform edge (priced only as XA14 on the Commerce + Real-Time CDP card)"',
    '"Data Connection extension configured and Commerce events confirmed at the Experience Platform edge"')
rep(T, '"Data Connection extension sending Commerce data to Experience Platform datasets (priced only as XA14 on the Commerce + Real-Time CDP card)"',
    '"Data Connection extension sending Commerce data to Experience Platform datasets"')
rep(T, '"XA20: IMS org ID and datastream ID in the storefront configuration"', '"IMS org ID and datastream ID in the storefront configuration"')
PRICED = ' The Data Connection setup is priced once, as Commerce Data Connection to Platform on the Adobe Commerce + Real-Time CDP card.'
rep(MORE, '"how": "Commerce events sent through Data Connection reach Journey Optimizer, which listens for them to start journeys such as abandoned cart."',
    '"how": "Commerce events sent through Data Connection reach Journey Optimizer, which listens for them to start journeys such as abandoned cart.' + PRICED + '"')
rep(MORE, '"how": "Commerce data sent through Data Connection lands in Experience Platform datasets that Customer Journey Analytics can analyze."',
    '"how": "Commerce data sent through Data Connection lands in Experience Platform datasets that Customer Journey Analytics can analyze.' + PRICED + '"')
rep(MORE, 'while drop-ins request catalog and shopping data from Commerce.',
    'while drop-ins request catalog and shopping data from Commerce. The IMS org ID and datastream ID go into the storefront configuration in Storefront events to Experience Platform, under More services on this card.')
XA14_OLD = 'For an Edge Delivery storefront, send storefront events through its Experience Platform settings (XA20) and confirm how back office and profile data flow for the deployment.'
XA14_NEW = ("For an Edge Delivery storefront, storefront events reach Experience Platform through the storefront's own settings (the Storefront events to "
            "Experience Platform service, where included); confirm how back office and profile data flow for the deployment.")
rep(T, XA14_OLD, XA14_NEW)
rep(AUD, "'and check the first events. " + XA14_OLD + "'", '"and check the first events. ' + XA14_NEW + '"')
rep(CLS, ' (priced only as XA14 on the Commerce + Real-Time CDP card)"', '"', 2)
rep(CLS, '"XA20: IMS org ID', '"IMS org ID')
rep(AUD, "'aemsites-eds': {'gain': {'title': 'AEM authoring, Edge Delivery speed', 'text': 'Authors keep AEM Sites tools such as workflows, multi-site management, translation and launches (with the Universal Editor extensions enabled), visitors get fast Edge Delivery pages, and both can run on one domain during a phased move with CDN routing rules (AXD04).'}},",
    "'aemsites-eds': {'gain': {'title': 'AEM authoring, Edge Delivery speed', 'text': 'Authors keep AEM Sites tools such as workflows, multi-site management, translation and launches (with the Universal Editor extensions enabled), visitors get fast Edge Delivery pages, and both can run on one domain during a phased move with CDN routing rules (the AEM publish and Edge Delivery on one domain service, under More services on this card).'}},")

# ---- 30: Coworker support for the B2B editions is coming soon, not the editions ----
for p, n in ((T, 1), (AUD, 1)):
    rep(p, 'Coworker Chat is generally available; the CJA B2B edition is coming soon.', 'Coworker Chat is generally available; Coworker support for the CJA B2B edition is coming soon.', n)
    rep(p, "Coworker Chat is generally available in Coworker's workspace; the in-product panel and the B2B edition are coming soon.",
        "Coworker Chat is generally available in Coworker's workspace; the in-product panel and Coworker support for the B2B edition are coming soon.", 2)
rep(T, '"Real-Time CDP B2C Edition (B2B Edition coming soon)"', '"Real-Time CDP B2C Edition (Coworker support for the B2B Edition is coming soon)"')
rep(T, '"Journey Optimizer B2C Edition (B2B Edition coming soon)"', '"Journey Optimizer B2C Edition (Coworker support for the B2B Edition is coming soon)"')

# ---- 31: the brand is written aem.live ----
rep(T, '"label": "Aem.live martech plugin lets Journey Optimizer web campaigns change Edge Delivery pages"',
    '"label": "The aem.live martech plugin lets Journey Optimizer web campaigns change Edge Delivery pages"')
rep(AUD, "    'ajo-eds': {'how': ", "    'ajo-eds': {'label': 'The aem.live martech plugin lets Journey Optimizer web campaigns change Edge Delivery pages', 'how': ")

# ---- 32: XA20 reads as a sentence and says your client ----
XA20_OLD = "connect the merchant's consent management platform (the boilerplate denies consent by default), and check that product, cart and purchase events reach the Edge Network."
rep(T, 'to the storefront configuration ' + XA20_OLD, "to the storefront configuration, connect your client's consent management platform (the boilerplate denies consent by default), and check that product, cart and purchase events reach the Edge Network.")
rep(AUD, "'and check that product, cart and purchase events reach the Edge Network.', \"" + XA20_OLD + "\"",
    "' and check that product, cart and purchase events reach the Edge Network.', \", connect your client's consent management platform (the boilerplate denies consent by default), and check that product, cart and purchase events reach the Edge Network.\"")

# ---- 44: the Data Mirror conflict ----
rep(T, '"availability": "Needs CJA Select, Prime or Ultimate (Data Mirror is not in CJA Foundation)"',
    '"availability": "Adobe\'s pages conflict: the Data Mirror pages call it a limited release for CJA users, depending on license and feature enablement, while CJA\'s 2026 release notes list it generally available from June 17, 2026. Needs CJA Select, Prime or Ultimate (not in CJA Foundation); confirm enablement with the Adobe account team."')

# ---- 7: the sweep: every shown "the client" says "your client" (client-side, Client ID, client-managed stay) ----
SHOWN = {'how', 'label', 'availability', 'prereqs', 'text', 'what', 'name', 'scope', 'systems', 'sub', 'title_play', 'rec', 'covered', 'tier', 'why', 'problem', 'chip', 'note', 'answer', 'ext'}


def voice(s):
    s = re.sub(r"\b([Tt])he client team\b", lambda m: ('Your' if m.group(1) == 'T' else 'your') + " client's team", s)
    s = re.sub(r"\b([Tt])he client's\b", lambda m: ('Your' if m.group(1) == 'T' else 'your') + " client's", s)
    return re.sub(r"\b([Tt])he client\b(?![-\w'])", lambda m: ('Your' if m.group(1) == 'T' else 'your') + ' client', s)


def shown_strings(o, path, out):
    if isinstance(o, dict):
        for k, v in o.items():
            shown_strings(v, path + [k], out)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            shown_strings(v, path + [i], out)
    elif isinstance(o, str):
        keys = [p for p in path if isinstance(p, str)]
        if keys and path != ['note'] and 'keywords' not in keys and 'evidence' not in keys and 'quotes' not in keys and (keys[-1] in SHOWN or (keys[-1] == 'title' and 'gain' in keys)):
            out.append(o)


swept = 0
for p in [os.path.join(HERE, 'catalog_map.json'), os.path.join(HERE, 'problems.json')] + sorted(os.path.join(R, f) for f in os.listdir(R) if f.endswith('.json')):
    if os.path.basename(p).startswith(('audit_classification', 'outside_systems', 'content_analytics_recheck')):
        continue
    found = []
    shown_strings(json.loads(load(p)), [], found)
    for s in sorted(set(found)):
        v = voice(s)
        if v == s:
            continue
        a, b = json.dumps(s, ensure_ascii=False), json.dumps(v, ensure_ascii=False)
        assert load(p).count(a) == found.count(s), (os.path.basename(p), s[:80])
        rep(p, a, b, found.count(s))
        swept += found.count(s)
assert swept == 94, swept

# ---- 6, 17, 18: the SOW versions of the partner notes, and the connections' packages (connection_types.json is laid out with indent 1) ----
types = json.loads(load(T))
cons = types['connections']
TENANT = "Not stated by Adobe; confirm for your client's tenant."
SOW_AVAIL = {
    TENANT: "Not stated by Adobe; it is confirmed with Adobe for the Client's tenant before this service starts.",
    "Generally available in Brand Concierge; not stated for Content AI on the AEM side, so confirm for your client's environment.":
        "Generally available in Brand Concierge; not stated for Content AI on the AEM side, so it is confirmed with Adobe for the Client's environment before this service starts.",
    "Legacy: Adobe marks offer decisions in Target and Journey Optimizer Decision Management as Legacy; confirm Adobe's direction before new work.":
        "Legacy: Adobe marks offer decisions in Target and Journey Optimizer Decision Management as Legacy; Adobe's direction is confirmed with Adobe before this service starts.",
    'Not documented: Experience League has no Journey Optimizer setup for Brand Concierge; confirm with Adobe.':
        'Not documented: Experience League has no Journey Optimizer setup for Brand Concierge; the route is confirmed with Adobe before this service starts.',
    "Built-in dashboard: generally available. Analysis in your client's own CJA: not documented by Adobe; confirm the data use with Adobe.":
        "Built-in dashboard: generally available. Analysis in the Client's own CJA: not documented by Adobe; Adobe's written confirmation of the data use is obtained before the analysis starts.",
    'Co-innovation for the martech plugin; the Journey Optimizer web channel has no label, and a direct Web SDK route on Edge Delivery is not described by aem.live (prove it in a pilot).':
        'Co-innovation for the martech plugin; the Journey Optimizer web channel has no label, and a direct Web SDK route on Edge Delivery is not described by aem.live, so a direct Web SDK route is validated in a pilot within this service.',
    'Not stated by Adobe. Trial limits conflict: one opportunity on up to 10 pages (Optimize at Edge FAQ), or up to 50 URLs for one opportunity type for trials from April 1, 2026 (Quick Start).':
        'Not stated by Adobe. The paid Brand Visibility offer is assumed, because trial workspaces have tighter deployment limits.',
    'Adobe\'s pages conflict: all subscriptions, a staged beta rollout, and an in-product experience coming soon; confirm for your client.':
        "Adobe's pages describe availability differently (all subscriptions, a staged beta rollout, and an in-product experience coming soon), so availability for the Client is confirmed with Adobe before this service starts.",
    "Adobe's pages conflict: the Data Mirror pages call it a limited release for CJA users, depending on license and feature enablement, while CJA's 2026 release notes list it generally available from June 17, 2026. Needs CJA Select, Prime or Ultimate (not in CJA Foundation); confirm enablement with the Adobe account team.":
        "Adobe's Data Mirror pages call it a limited release for CJA users, depending on license and feature enablement, while CJA's 2026 release notes list it generally available from June 17, 2026. It needs CJA Select, Prime or Ultimate (not in CJA Foundation), and its enablement is confirmed with the Adobe account team before this service starts.",
}
ELIG = "Coworker is not currently offered to organizations in health care, finance or some other industries (Adobe's Coworker in Workfront page); confirm eligibility"
ELIG_SOW = "Adobe confirms that Coworker is available to the Client's organization (Adobe's Coworker in Workfront page says it is not currently offered to organizations in health care, finance or some other industries)"
SOW_PRE = {
    ('bv-eds', 2): ('; confirm Brand Visibility detects it as AEM Cloud Service Managed CDN', ', and Brand Visibility detects it as AEM Cloud Service Managed CDN'),
    ('bv-eds', 4): ("; confirm the route for Adobe's managed CDN)", "; the route for Adobe's managed CDN is confirmed with Adobe before this service starts)"),
    ('so-eds', 2): ('for sites authored in AEM, confirm the connection, since', 'for sites authored in AEM, the connection is confirmed with Adobe before this service starts, since'),
    ('bv-commerce', 1): ('which Commerce setups qualify, so confirm', 'which Commerce setups qualify, so the connection is confirmed with Adobe before this service starts'),
    ('aemsites-bv', 4): ("so confirm how logs from AEM's managed CDN reach Brand Visibility", "so how logs from AEM's managed CDN reach Brand Visibility is confirmed with Adobe before this service starts"),
    ('aemsites-cw', 2): (' (confirm with the CSM or TAM)', ', confirmed with Adobe before this service starts'),
    ('ajo-bc', 2): ('which Adobe does not document; confirm with Adobe', 'which Adobe does not document; the route is confirmed with Adobe before this service starts'),
    ('ajo-eds', 1): ('(not described by aem.live for Journey Optimizer; prove it in a pilot)', '(not described by aem.live for Journey Optimizer; validated in a pilot within this service)'),
    ('marketo-target', 4): ('; confirm ECID matching there', '; ECID matching there is validated within this service'),
    ('marketo-bc', 0): ('(these pages do not describe the connection steps; confirm with Adobe)', '(these pages do not describe the connection steps, so they are confirmed with Adobe before this service starts)'),
    ('aemsites-aemassets', 7): ("; confirm your client's Dynamic Media edition", "; the Client's Dynamic Media edition is confirmed before this service starts"),
}
n_av = n_pre = 0
for cid, c in cons.items():
    if c['availability'] in SOW_AVAIL:
        c['sow_availability'] = SOW_AVAIL[c['availability']]
        n_av += 1
    sp = {}
    for i, x in enumerate(c['prereqs']):
        if x == ELIG:
            sp[str(i)] = ELIG_SOW
        elif (cid, i) in SOW_PRE:
            old, new = SOW_PRE[(cid, i)]
            assert x.count(old) == 1, (cid, i, x)
            sp[str(i)] = x.replace(old, new)
    if sp:
        c['sow_prereqs'] = sp
        n_pre += len(sp)
assert n_av == 26 and n_pre == 18, (n_av, n_pre)
# every partner instruction on a connection has its SOW version
INSTR = re.compile(r"(^|[;,(.]\s*|\bso\s)(confirm|prove it|check)\b", re.I)
for cid, c in cons.items():
    assert not INSTR.search(c.get('sow_availability', c['availability'])), cid
    for i, x in enumerate(c['prereqs']):
        assert not INSTR.search(c.get('sow_prereqs', {}).get(str(i), x)), (cid, i, x)
for cid, tier in [('marketo-cja', 'CJA Prime or higher (graph-based stitching)'), ('commerce-cja', 'CJA Select or higher (more than one event dataset in a connection)'),
                  ('aemsites-so', 'Sites Optimizer Ultimate'), ('ajo-target', 'Journey Optimizer Ultimate or the Offer Decisioning add-on')]:
    assert not cons[cid].get('tier'), cid
    cons[cid]['tier'] = tier
FILES[T] = json.dumps(types, ensure_ascii=False, indent=1) + '\n'

# ---- 4 and 7: the sweep records ----
D = os.path.join(SOW, 'sweep46_decisions.json')
dec = load(D)
for cid, why in [('c0295', "Adobe's term: customer managed CDN (BYOCDN)"), ('c0299', "Adobe's term: customer managed CDN (BYOCDN)"),
                 ('c0308', 'Adobe entitlement'), ('c0309', 'licensing: health care customers')]:
    m = re.search(r'  "id": "' + cid + r'",\n  "action": "change",\n  "replacement": "[^"]*",\n  "reason": "[^"]*"\n', dec)
    assert m and dec.count(m.group(0)) == 1, cid
    dec = dec.replace(m.group(0), '  "id": "' + cid + '",\n  "action": "keep",\n  "reason": ' + json.dumps(why) + '\n')
FILES[D] = dec
CH = os.path.join(SOW, 'review_step46_2026-11-04', 'CHANGES.md')
moved = [
    ("- `canvas/research/connection_types.json`: ...forwarding for agentic traffic data (Adobe documents it for **customer → client**-managed CDNs; confirm the route for Adobe's ...\n",
     "- `canvas/research/connection_types.json`: ...forwarding for agentic traffic data (Adobe documents it for **customer**-managed CDNs; confirm the route for Adobe's ... *(kept: Adobe's term: customer managed CDN (BYOCDN); step 47)*\n"),
    ("- `canvas/research/connection_types.json`: ...ogs for agentic traffic: Adobe documents log forwarding for **customer → client**-managed CDNs, so confirm how logs from AEM's...\n",
     "- `canvas/research/connection_types.json`: ...ogs for agentic traffic: Adobe documents log forwarding for **customer**-managed CDNs, so confirm how logs from AEM's... *(kept: Adobe's term: customer managed CDN (BYOCDN); step 47)*\n"),
    ("- `canvas/research/connection_types.json`: ...MktoSync: Ingestion Service access provisioned for **the customer → your client**...\n",
     "- `canvas/research/connection_types.json`: ...MktoSync: Ingestion Service access provisioned for **the customer**... *(kept: Adobe entitlement; step 47)*\n"),
    ("- `canvas/research/connection_types.json`: ...Not stated by Adobe; for health care **customers → clients** it needs the Healthcare Shield and Extended ...\n",
     "- `canvas/research/connection_types.json`: ...Not stated by Adobe; for health care **customers** it needs the Healthcare Shield and Extended ... *(kept: licensing: health care customers; step 47)*\n"),
]
for old, new in moved:
    rep(CH, old, '')
rep(CH, '## Changed on the canvas: your client (13)\n', '## Changed on the canvas: your client (9)\n')
rep(CH, '## Kept as customer, on purpose (82)\n', '## Kept as customer, on purpose (86)\n\n' + ''.join(n for o, n in moved))
X = os.path.join(SOW, 'sweep46_extract.py')
rep(X, '(?:customers?|Customers?)(?:\'s|\\\\\'s)?\\b")', '(?:customers?|Customers?|clients?|Clients?)(?:\'s|\\\\\'s)?\\b")')
rep(X, "        if not keys or keys[-1] not in SHOWN or 'keywords' in keys or 'evidence' in keys:\n",
    "        # step 47: client and clients are listed too, and a connection's gain title\n"
    "        if not keys or (keys[-1] not in SHOWN and not (keys[-1] == 'title' and 'gain' in keys)) or 'keywords' in keys or 'evidence' in keys:\n")

for p, t in FILES.items():
    if p.endswith('.json'):
        json.loads(t)
    if p.endswith('.py'):
        compile(t, p, 'exec')
    assert len(DASH.findall(t)) == len(DASH.findall(ORIG[p])), ('no new dashes', p)
for p, t in FILES.items():
    open(p, 'w', encoding='utf-8').write(t)
print(f'step 47 content data applied: {swept} canvas texts say your client, {n_av} availability and {n_pre} prerequisite SOW versions')
