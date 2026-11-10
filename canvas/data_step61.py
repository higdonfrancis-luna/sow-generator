"""Step 61 canvas data (Nov 10 2026, Adam: "yes" to build AEM Forms, wave 1 of the catalog expansion, and his five answers):
AEM Forms joins the Create your own play picker with its services and six connections.

1. The wave 1 research (canvas/research/aem_forms.json, moved from expansion_2026-11-10/wave1/ where build.py did not read it):
   - "Leave the gap" on forms history search: nothing is added for it.
   - "Keep it, with the caveat": PDF form conversion (AF10) stays optional and its scope says the converted forms use
     Foundation Components, the earlier of Adobe's two component sets, with Adobe's sentence as evidence.
   - Yes to an accessibility service: AF18, Form accessibility review, optional, on Adobe's accessible forms page.
   - Yes to the shorter tag: "the Forms Communications add-on" on the four document generation services (AF12 to AF15).
2. catalog_map.json: the product `aemforms`, and its place on Create your own play ([4, 3], which was free).
3. research/connection_types.json: what each of the six connections is (kind and label), Adobe's availability in its own
   terms and the prerequisites, with the evidence quotes the research checked. AEM Forms + Coworker carries the Coworker
   license line and the eligibility line the other Coworker connections carry.
4. "Retire both": XB09 (Site forms that submit to Marketo) and XB13 (Site form requests into Workfront) leave the catalog.
   Each was the only service on its connection, so Marketo Engage + Edge Delivery Services and Workfront + Edge Delivery
   Services leave the canvas with them; the same work is AEM Forms + Marketo Engage and AEM Forms + Workfront now. Their
   records go from research/marketo_workfront.json and research/connection_types.json, and their copy rules from
   ../product_copy_rules.json.
5. ../product_copy_rules.json, connection_client: the client-voice how and gain of the six connections, which the RFI
   Builder's drafted answers use (the partner's card keeps the research wording).
6. problems.json: the refine chip "My client's site forms should feed Marketo" (on the slow-site problem) added Marketo
   Engage beside Edge Delivery Services and relied on the retired connection. It adds AEM Forms and Marketo Engage now,
   so the canvas draws AEM Forms + Edge Delivery Services and AEM Forms + Marketo Engage. Its note is unchanged.

Run once from the repo root, then rebuild:

    python3 sow/canvas/data_step61.py
    python3 sow/canvas/build.py && python3 sow/build_site.py
"""
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SOW = os.path.dirname(HERE)
DASH = re.compile('[–—]')


def load(path):
    return json.load(open(path, encoding='utf-8'))


def save(path, data, indent=1, ascii_only=True):
    text = json.dumps(data, indent=indent, ensure_ascii=ascii_only) + '\n'
    assert not DASH.search(json.dumps(data, ensure_ascii=False)), ('a dash in', path)
    open(path, 'w', encoding='utf-8').write(text)


# ---- 1. the research file ----
forms_path = os.path.join(HERE, 'research', 'aem_forms.json')
forms = load(forms_path)
product = next(p for p in forms['products'] if p['id'] == 'aemforms')
lines = {l['id']: l for l in product['lines']}
assert 'AF18' not in lines, 'step 61 is already in research/aem_forms.json'

LONG_TIER, SHORT_TIER = 'the Forms - Communications add-on (a Document Renditions license)', 'the Forms Communications add-on'
tiered = [l for l in product['lines'] if l.get('tier') == LONG_TIER]
assert [l['id'] for l in tiered] == ['AF12', 'AF13', 'AF14', 'AF15'], [l['id'] for l in tiered]
for l in tiered:
    l['tier'] = SHORT_TIER

old_scope = ("Connect the Automated Forms Conversion service, convert your client's existing PDF forms (AcroForms, XFA-based or "
             "non-interactive) in batches within the service's size limits, then review and correct each converted form and apply "
             "your client's template and theme.")
assert lines['AF10']['scope'] == old_scope, lines['AF10']['scope']
lines['AF10']['scope'] = old_scope + (" The service produces forms on Foundation Components, the earlier of Adobe's two component sets "
                                      "for adaptive forms, so converted forms are maintained with that set's editor.")
lines['AF10']['evidence'] = 'The above conversion settings apply to converting PDF forms to Foundation Components-based adaptive forms.'
lines['AF10']['source'] = {
    'url': 'https://experienceleague.adobe.com/en/docs/aem-forms-automated-conversion-service/using/convert-existing-forms-to-adaptive-forms',
    'title': 'Experience League: Convert PDF forms to adaptive forms'}

at = [l['id'] for l in product['lines']].index('AF11') + 1    # with the other optional adaptive form services, before document generation
product['lines'].insert(at, {
    'id': 'AF18', 'name': 'Form accessibility review', 'unit': 'one-time', 'low': 16, 'base': 32, 'high': 64, 'default': False,
    'scope': ("Review your client's forms against the accessibility standard your client names, such as WCAG or Section 508, using "
              "the checks Adobe lists for form authors: an accessible name and description on every control, proper labels, text "
              "equivalents for images, sufficient color contrast and keyboard access. Test each form with an accessibility inspection "
              "tool, correct what the form's settings and theme control, and report what needs custom development."),
    'evidence': 'While authoring an Adaptive Form, form authors must address the following considerations to build an accessible Adaptive Form',
    'source': {'url': 'https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/adaptive-forms-authoring/'
                      'authoring-adaptive-forms-foundation-components/accessible-adaptive-forms/creating-accessible-adaptive-forms',
               'title': 'Experience League: Creating accessible Adaptive Forms'}})
product['notes'] += (" AF18 (Nov 10, Adam: yes to an accessibility service) rests on Adobe's accessible forms page, which Adobe files under "
                     "Foundation Components; its five checks (accessible names, labels, text equivalents, contrast, keyboard) are what the "
                     "service reviews, and the Core Components introduction says those components support accessibility standards and "
                     "guidelines. The service promises a review and fixes, not a conformance certificate.")
save(forms_path, forms)

# ---- 2. the product on the map ----
map_path = os.path.join(HERE, 'catalog_map.json')
cmap = load(map_path)
assert not any(p['id'] == 'aemforms' for p in cmap['products'])
at = [p['id'] for p in cmap['products']].index('aemassets') + 1
cmap['products'].insert(at, {'id': 'aemforms', 'name': 'AEM Forms', 'title': 'AEM Forms as a Cloud Service', 'lines': [], 'more': []})
custom = next(p for p in cmap['plays'] if p['id'] == 'custom')
taken = [tuple(v) for v in list(custom['pos'].values()) + list(custom['opos'].values())]
assert (4, 3) not in taken, 'the place for AEM Forms on Create your own play is taken'
custom['products'].append('aemforms')
custom['pos']['aemforms'] = [4, 3]
save(map_path, cmap)

# ---- 3. what each connection is ----
COWORKER_LICENSE = "CX Enterprise Coworker license through the Adobe account team, configured by Adobe's onboarding team"
# the partner's wording the other Coworker connections end up with (product_copy_rules.json, connection_prereqs); the SOW's
# version comes from sow_replacements, as it does for them
COWORKER_ELIGIBILITY = ("Adobe's Workfront documentation says Coworker in Workfront is not currently available to health care and "
                        "finance organizations; Adobe states no such limit for this connection, so confirm eligibility with Adobe for your client")
WHAT = {
    'aemforms-aemsites': ('native', 'Adaptive forms are built in, or placed on, AEM Sites pages; the Forms Portal lists forms, drafts and submissions there'),
    'aemforms-eds': ('native', 'Adaptive Forms Block puts AEM Forms on Edge Delivery pages; an AEM Forms license is needed'),
    'aemforms-rtcdp': ('native', 'Out-of-the-box connector streams form submissions into Experience Platform profiles'),
    'aemforms-marketo': ('native', 'Submit to Marketo Engage action sends form fills to Marketo people records'),
    'aemforms-workfront': ('extension', 'Out-of-the-box connector starts a Workfront Fusion scenario the partner builds; Fusion license needed'),
    'aemforms-cw': ('native', 'Coworker Chat drafts and edits adaptive forms; submit connectors and custom functions are set up first'),
}
types_path = os.path.join(HERE, 'research', 'connection_types.json')
types = load(types_path)
for c in forms['connections']:
    kind, label = WHAT[c['id']]
    assert c['id'] not in types['connections'], c['id']
    prereqs = list(c['prereqs'])
    evidence = [{'url': s['url'], 'quote': s['quote']} for s in c.get('prereq_sources', [])]
    if c.get('availability_source'):
        evidence.append({'url': c['availability_source']['url'], 'quote': c['availability_source']['quote']})
    if c['id'] == 'aemforms-cw':
        prereqs = [COWORKER_ELIGIBILITY, COWORKER_LICENSE] + prereqs
    types['connections'][c['id']] = {'kind': kind, 'label': label, 'availability': c['availability'], 'prereqs': prereqs, 'evidence': evidence}

# ---- 4. the two retired services and their connections ----
mw_path = os.path.join(HERE, 'research', 'marketo_workfront.json')
mw = load(mw_path)
GONE = {'marketo-eds': 'XB09', 'workfront-eds': 'XB13'}
for cid, lid in GONE.items():
    c = next(x for x in mw['connections'] if x['id'] == cid)
    assert [l['id'] for l in c['lines']] == [lid], (cid, [l['id'] for l in c['lines']])
    del types['connections'][cid]
    del types['lines'][lid]
mw['connections'] = [c for c in mw['connections'] if c['id'] not in GONE]
mw['notes'].append("Step 61 (Nov 10 2026, Adam: retire both): XB09 on marketo-eds and XB13 on workfront-eds left the catalog when AEM Forms "
                   "became a product. Each was its connection's only service and worked only through AEM Forms, so both connections left "
                   "too; the work is AFX09 and AFX10 (aemforms-marketo) and AFX11 and AFX12 (aemforms-workfront) in aem_forms.json. Notes "
                   "above that mention them describe the research as it was on Oct 30.")
save(mw_path, mw)
save(types_path, types)

rules_path = os.path.join(SOW, 'product_copy_rules.json')
rules = load(rules_path)
for cid in GONE:
    for section in ('connection_prereqs', 'connection_overrides', 'connection_top', 'connection_client'):
        rules[section].pop(cid, None)
assert not any(cid in rules[s] for cid in GONE for s in rules if isinstance(rules[s], dict))

# ---- 5. the six connections in the client's voice, for the RFI Builder's drafted answers ----
CLIENT = {
    'aemforms-aemsites': (
        "AEM Forms provides the Adaptive Forms Container and Adaptive Forms Embed components, so your authors create a form inside an AEM Sites "
        "page or Experience Fragment, or place an existing form there. The Forms Portal components list forms, saved drafts and submissions "
        "on your Sites pages.",
        "Your visitors fill in and submit forms without leaving the page, your authors manage those forms with the site's versioning, "
        "translation and multi-site tools, and a portal lists forms, saved drafts and past submissions."),
    'aemforms-eds': (
        "With Edge Delivery Services for AEM Forms, your forms are authored in the Universal Editor (or in Google Sheets or Excel for simple "
        "forms), rendered on your Edge Delivery pages by the Adaptive Forms Block, and submitted to Adobe's Forms Submission Service or to AEM Publish.",
        "Your Edge Delivery pages carry adaptive forms that your authors build visually in the Universal Editor, and submissions can still reach "
        "workflows, the Form Data Model and the other AEM Forms submit actions through AEM Publish."),
    'aemforms-rtcdp': (
        "AEM Forms as a Cloud Service has a connector to Experience Platform: your forms are built on Experience Platform XDM schemas, and each "
        "submission streams to an Experience Platform dataset, where Real-Time CDP uses it to update profiles.",
        "What people enter in a form reaches Real-Time CDP by streaming, so your profiles and audiences include it without a custom integration, "
        "and your forms collect data in the same XDM fields as the rest of your data."),
    'aemforms-marketo': (
        "A Marketo Engage cloud configuration in AEM gives your forms the Marketo data model, and the Submit to Marketo Engage action sends each "
        "submission to Marketo for processing.",
        "Submissions from your adaptive forms land in the Marketo Engage People database, where your smart campaigns and follow-up emails can act "
        "on them, without a separate form data model."),
    'aemforms-workfront': (
        "AEM Forms as a Cloud Service has a connector that submits an adaptive form to a Workfront Fusion scenario through a webhook. We build the "
        "scenario, which then acts on the data, for example by starting work in Workfront.",
        "A submitted form starts a Fusion scenario that can create projects, assign tasks, send notifications and update statuses, so your intake "
        "does not wait for someone to re-key the request."),
    'aemforms-cw': (
        "AEM's Forms Agentic Capability works through Coworker Chat: your users describe a form or a change in plain words, and it creates or updates "
        "the adaptive form in your AEM environment and returns an editor link. Adobe confirms that Coworker is available to your organization "
        "before this service starts.",
        "Your business users describe a form or a change in plain words and get an adaptive form to review in the editor, on Core Components or "
        "Edge Delivery, which leaves your developers the custom work."),
}
assert set(CLIENT) == set(WHAT)
for cid, (how, gain) in CLIENT.items():
    assert cid not in rules['connection_client'], cid
    rules['connection_client'][cid] = {'how': how, 'gain': gain, 'note': ''}
save(rules_path, rules, indent=2, ascii_only=False)

# ---- 6. the problem picker's chip that relied on the retired connection ----
problems_path = os.path.join(HERE, 'problems.json')
text = open(problems_path, encoding='utf-8').read()
old = '''     "chip": "My client's site forms should feed Marketo",
     "add": [
      "marketo"
     ],'''
assert text.count(old) == 1, 'the site forms chip is not as step 60 left it'
open(problems_path, 'w', encoding='utf-8').write(text.replace(old, '''     "chip": "My client's site forms should feed Marketo",
     "add": [
      "aemforms",
      "marketo"
     ],'''))
print('step 61 data applied: AEM Forms (18 product services, 15 connection services, six connections); XB09 and XB13 retired with their two connections')
