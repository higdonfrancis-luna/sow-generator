# The build data for the "Adobe agentic AI" play (Adam's "go", Nov 18).
# 1. The first-page card: three outcome areas on Adam's product mapping, and the complete play.
# 2. An "Ask it" example question for every assistant connection: Adobe's own words where Adobe gives an example
#    (proven word for word on the saved page), otherwise a plain question that stays within what the connection does.
# 3. The Claude + Brand Intelligence connection (Adobe's developer guide names Claude Desktop as the example host).
# Run: python3 -I make_agentic.py <ai_hosts folder> <output json>
import json, sys, os
sys.path.insert(0, '/home/user/sow-generator/handoff/2026-11-17/evidence_page/tools')
from verify import found
W, OUT = sys.argv[1], sys.argv[2]
P = W + '/pages/'
V2 = json.load(open('/home/user/sow-generator/handoff/2026-11-17/ai_hosts/proposal_data_v2.json', encoding='utf-8'))

def proven(fname, text):
    assert os.path.exists(P + fname), fname
    assert found(text, P + fname), ('NOT ON PAGE', fname, text[:80])
    return text

SRC = {
 'cw': ('42563717365b.html', 'https://experienceleague.adobe.com/en/docs/coworker/content/ai-platforms'),
 'cja_claude': ('', 'https://developer.adobe.com/analytics-mcp/docs/guides/claude'),
 'cja_copilot': ('7f041247af79.html', 'https://developer.adobe.com/analytics-mcp/docs/guides/copilot'),
 'aem': ('79a0eafe9ddf.html', 'https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/mcp-support/using-mcp-with-aem-as-a-cloud-service'),
 'workfront': ('', 'https://experienceleague.adobe.com/en/docs/workfront/using/basics/workfront-mcp-server/workfront-mcp-server-tools'),
 'marketo': ('', 'https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/mcp-server'),
 'target': ('128ba6ee76f5.html', 'https://experienceleague.adobe.com/en/docs/target/using/mcp/target-mcp-use-cases'),
 'rtcdp': ('edccf58b522c.html', 'https://experienceleague.adobe.com/en/docs/experience-platform/rtcdp/intro/rtcdp-mcp'),
 'ajo': ('4ccaf822b710.html', 'https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/combine/ajo-mcp'),
 'frameio': ('db889f052c3a.html', 'https://help.frame.io/en/articles/17218043-connecting-frame-io-mcp-server-with-ai-clients-beta'),
 'copilot_cc': ('13ae3325cc3a.html', 'https://helpx.adobe.com/creative-cloud/apps/integration-with-other-apps/adobe-connectors/adobe-for-copilot.html'),
 'bi': ('76d8ee1d0ba4.html', 'https://developer.adobe.com/adobe-brand-intelligence/guides/mcp-integration/'),
}
# the saved file of a page round one or round two fetched, found by its address
import glob
IDX = {}
for f in glob.glob(P + 'index*.tsv'):
    for l in open(f, encoding='utf-8', errors='ignore'):
        x = l.rstrip('\n').split('\t')
        if len(x) >= 2 and x[0] and os.path.exists(P + x[0]): IDX.setdefault(x[1], x[0])
def fileof(key):
    f, u = SRC[key]
    return f or IDX.get(u) or IDX.get(u + '/') or IDX.get(u.rstrip('/'))

def adobe(key, text):
    f = fileof(key); assert f, ('no saved page for', key)
    return {'ask': proven(f, text), 'adobe_words': True, 'source': SRC[key][1]}
def plain(text, why):
    return {'ask': text, 'adobe_words': False, 'within': why}

ASK = {}
for h in ('chatgpt', 'claude', 'copilot'):
    ASK[f'{h}-cw'] = adobe('cw', 'Show journeys with loyalty audiences.')
    ASK[f'{h}-aemsites'] = adobe('aem', 'Create a new content fragment for the spring campaign based on our hero banner model and fill in its fields from this brief.')
    ASK[f'{h}-aemassets'] = plain('Find our approved spring campaign images and show me where each one is used.', 'The AEM connection searches assets and shows where an asset is used.')
    ASK[f'{h}-workfront'] = adobe('workfront', 'Move task Wireframes to the Mobile App Redesign project.')
    ASK[f'{h}-planning'] = plain('Show me the campaigns planned for next quarter.', 'The Workfront connection searches Planning records.')
    ASK[f'{h}-gspm'] = plain('How did our spring ads perform last month?', 'The GenStudio connection answers how ads are performing.')
    ASK[f'{h}-acrobat'] = plain('Turn these notes into a formatted PDF.', "Adobe's connector creates PDFs and turns content into formatted PDFs.")
ASK['chatgpt-cja'] = adobe('cja_claude', 'Using Customer Journey Analytics, show me the top 20 pages by page views for the last 7 days.')
ASK['claude-cja'] = adobe('cja_claude', 'Using Customer Journey Analytics, show me the top 20 pages by page views for the last 7 days.')
ASK['copilot-cja'] = adobe('cja_copilot', 'Show me what data views are available.')
ASK['copilot-creativecloud'] = adobe('copilot_cc', 'Use Adobe to resize this photo for Instagram, YouTube, and TikTok.')
ASK['chatgpt-creativecloud'] = plain('Remove the background from this product photo.', "Adobe's connector edits photos with Photoshop tools.")
ASK['claude-creativecloud'] = plain('Remove the background from this product photo.', "Adobe's connector edits photos with Photoshop tools.")
ASK['chatgpt-express'] = plain('Make an Instagram post from a template with our spring offer.', "Adobe's plugin brings Adobe Express templates into ChatGPT.")
ASK['claude-marketo'] = adobe('marketo', 'What smart campaigns are active right now?')
ASK['claude-fireflycp'] = plain('Run our product-shot workflow on these five images.', 'Claude runs published Firefly Creative Production workflows from a plain request.')
for h in ('chatgpt', 'claude'):
    ASK[f'{h}-target'] = adobe('target', 'Show me all active tests that have reached statistical significance — which experiences are winning?')
    ASK[f'{h}-rtcdp'] = adobe('rtcdp', 'Show me flow runs from the last 24 hours and flag any failures.')
    ASK[f'{h}-frameio'] = adobe('frameio', 'Upload my asset to Frame.io, generate a share link, and request a review from the following people.')
    ASK[f'{h}-eds'] = plain('List the pages in our about section and draft a new FAQ page there.', 'The Experience Workspace connection browses content and creates new pages.')
ASK['claude-ajo'] = adobe('ajo', 'Which campaigns/journeys are currently live?')
ASK['claude-brandintel'] = plain('Check this graphic against our brand guidelines and show me what needs changing.', "Brand Intelligence's Validate checks an asset against the brand's guidelines and returns its findings.")

# every assistant connection in the round-two data, and the new Claude + Brand Intelligence one, has its question
ids = [c['id'] for c in V2['connections'] if c['a'] in ('chatgpt', 'claude', 'copilot')] + ['claude-brandintel']
missing = [i for i in ids if i not in ASK]; extra = [k for k in ASK if k not in ids]
assert not missing and not extra, (missing, extra)

bi = SRC['bi']
BI = {
 'id': 'claude-brandintel', 'a': 'claude', 'b': 'brandintel', 'kind': 'outside',
 'setup_kind': V2['setup_kinds']['guide'],
 'label': 'Your client connects Brand Intelligence’s brand checks to Claude, following Adobe’s developer guide',
 'how': 'Adobe’s developer guide shows how to connect Brand Intelligence’s brand checks (Validate) to a chat assistant, with Claude Desktop as its example. Once connected, a marketer gives Claude an image or a link and asks for a brand check; Brand Intelligence runs the check against the brand’s guidelines, and Claude reports the findings as they come back.',
 'source': {'url': bi[1], 'title': 'Adobe Developer: Brand Intelligence MCP integration'},
 'evidence': {'quote': proven(bi[0], 'This guide is for teams integrating Adobe Brand Intelligence Validate into their own chat assistant via its MCP (Model Context Protocol) server.'), 'url': bi[1], 'title': 'Adobe Developer: Brand Intelligence MCP integration', 'file': 'pages/' + bi[0]},
 'more_evidence': [
   {'quote': proven(bi[0], 'Example config (e.g. for Claude Desktop or any MCP-compatible host)'), 'url': bi[1], 'title': 'Adobe Developer: Brand Intelligence MCP integration', 'file': 'pages/' + bi[0]},
   {'quote': proven(bi[0], 'The validation result is the answer — never your own opinion.'), 'url': bi[1], 'title': 'Adobe Developer: Brand Intelligence MCP integration', 'file': 'pages/' + bi[0]}],
 'gain': {'title': 'Brand checks where the work is made', 'text': 'Your client’s marketers check a draft against the brand’s guidelines by asking in Claude, before it goes to review.'},
 'flows': [{'from': 'claude', 'to': 'brandintel', 'what': 'The image or link to check', 'needs': []}, {'from': 'brandintel', 'to': 'claude', 'what': 'The findings, against the brand’s guidelines', 'needs': []}],
 'availability': '',
 'prereqs': ['Brand Intelligence with Validate, with the brand’s guidelines loaded', 'A developer connects Claude with an Adobe sign-in, following Adobe’s guide'],
 'services': 'none new: Brand Intelligence’s own services stay as they are (Validate checks built into your client’s tools covers the same kind of set-up)'}

OUT_DATA = {
 'made': '2026-11-18 (main session), after Adam’s "go" on the pictures e1_agentic_explainer.png and e2_first_page_agentic_card.png',
 'status': 'Approved to build, on top of the ChatGPT, Claude and Microsoft Copilot boxes. The existing plays stay exactly as they are.',
 'family': {
   'section': 'Adobe agentic AI: find, keep and grow customers',
   'label': 'Adobe agentic AI',
   'sub': 'Adobe’s agents working with the AI your client’s buyers and team already use. Pick the outcome your client wants, or open the whole play.',
   'areas': [
     {'label': 'Find new customers', 'line': 'Reach new buyers in ad and media channels, and show up when they ask AI.', 'products': ['rtcdp', 'bv', 'cw', 'cja'], 'outside_on': ['ads', 'copilot', 'chatgpt', 'claude']},
     {'label': 'Keep customers', 'line': 'Journeys that keep customers coming back, and answers when they ask.', 'products': ['ajo', 'bc', 'cw', 'cja'], 'outside_on': ['copilot', 'chatgpt', 'claude']},
     {'label': 'Grow share of wallet', 'line': 'The right offer for each customer on the site, and journeys that cross-sell.', 'products': ['target', 'ajo', 'cw', 'cja'], 'outside_on': ['copilot', 'chatgpt', 'claude']}],
   'all': {'label': 'Or open the complete agentic play', 'products': ['rtcdp', 'ajo', 'target', 'cja', 'cw', 'bv', 'bc', 'brandintel'], 'outside_on': ['ads', 'copilot', 'chatgpt', 'claude']},
   'adam': ['"find customers keep customers grow their share of wallet"', '"Retention probably falls more to Adobe Journey Optimizer ... acquisition probably falls more to Real-Time CDP connecting to different advertising and media channels ... organic growth probably connects more to Adobe Target and Adobe Journey Optimizer ... CJA obviously feeds everything with all of the data"'],
   'notes': ['Built like the GenStudio family card; each area opens a canvas with its products placed and the listed outside systems on from the start (the partner removes the assistants the client does not use; adding an assistant adds no hours).', 'The canvas title names the area (for example "Adobe agentic AI: Find new customers") if that is a small change; otherwise the canvas reads as Create your own play, as GenStudio areas do today.', 'The CDN stays offered, not on from the start, for Brand Visibility.']},
 'ask_it': ASK,
 'ask_it_rules': ['Shown at the top of each assistant connection’s card, for the partner only, in quotation marks, introduced by "Ask it:". Never in what the client reads (statement of work, RFI answers, downloads).', 'Where adobe_words is true the question is Adobe’s own example from the source page, word for word; otherwise it stays within what the connection does (see within).'],
 'new_connection': BI,
}
json.dump(OUT_DATA, open(OUT, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('ask_it entries', len(ASK), '| Adobe’s words', sum(1 for v in ASK.values() if v['adobe_words']), '| plain', sum(1 for v in ASK.values() if not v['adobe_words']))
print('new connection quotes proven: 3')
