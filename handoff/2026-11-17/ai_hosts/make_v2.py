# Round two of the ChatGPT, Claude and Microsoft Copilot proposal: the build data.
# Starts from round one's proposal_data.json and applies Adam's answers of Nov 18 and the double check.
# Every quote is proven word for word on its saved page with the project's matcher; the script stops if one is not.
# Run: python3 -I make_v2.py <ai_hosts folder> <output json>
import json, sys, copy, os
sys.path.insert(0, '/home/user/sow-generator/handoff/2026-11-17/evidence_page/tools')
from verify import found
W, OUT = sys.argv[1], sys.argv[2]
P = W + '/pages/'
d = json.load(open(W + '/proposal_data.json', encoding='utf-8'))

def Q(fname, quote, url, title):
    fn = P + fname
    assert os.path.exists(fn), fname
    assert found(quote, fn), ('QUOTE NOT ON PAGE', fname, quote[:90])
    return {'quote': quote, 'url': url, 'title': title, 'file': 'pages/' + fname}

EL = 'Experience League: '
U = {
 'ajo': ('4ccaf822b710.html', 'https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/combine/ajo-mcp', EL + 'Journey Optimizer connector for AI assistants'),
 'target': ('140e4a52fdc5.html', 'https://experienceleague.adobe.com/en/docs/target/using/mcp/target-mcp', EL + 'Target connector for AI assistants'),
 'target_start': ('80c40768b214.html', 'https://experienceleague.adobe.com/en/docs/target/using/mcp/target-mcp-get-started', EL + 'Target connector: get started'),
 'rtcdp': ('edccf58b522c.html', 'https://experienceleague.adobe.com/en/docs/experience-platform/rtcdp/intro/rtcdp-mcp', EL + 'Real-Time CDP connector for AI assistants'),
 'frameio': ('db889f052c3a.html', 'https://help.frame.io/en/articles/17218043-connecting-frame-io-mcp-server-with-ai-clients-beta', 'Frame.io Help: connecting Frame.io to AI assistants'),
 'claude_cc': ('267f563fa9ce.html', 'https://helpx.adobe.com/creative-cloud/apps/integration-with-other-apps/adobe-connectors/adobe-for-claude.html', 'Adobe Help: Adobe for Claude'),
 'copilot_cc': ('13ae3325cc3a.html', 'https://helpx.adobe.com/creative-cloud/apps/integration-with-other-apps/adobe-connectors/adobe-for-copilot.html', 'Adobe Help: Adobe for Microsoft Copilot'),
 'cw': ('42563717365b.html', 'https://experienceleague.adobe.com/en/docs/coworker/content/ai-platforms', EL + 'Adobe CX Enterprise Coworker for AI Platforms'),
 'aem': ('79a0eafe9ddf.html', 'https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/mcp-support/using-mcp-with-aem-as-a-cloud-service', EL + 'Using MCP with AEM as a Cloud Service'),
 'gspm': ('5f4f43ae5d74.html', 'https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/ai-assistants/connect-ai-assistants', EL + 'GenStudio for Performance Marketing: connect AI assistants'),
 'cja': ('7f041247af79.html', 'https://developer.adobe.com/analytics-mcp/docs/guides/copilot', 'Adobe Developer: connect to Copilot Studio'),
 'workfront': ('48a079e858e3.html', 'https://experienceleague.adobe.com/en/docs/workfront/using/basics/workfront-mcp-server/configure-workfront-mcp-server', EL + 'Configure the Workfront MCP server'),
 'feed': ('4c19125c3468.html', 'https://experienceleague.adobe.com/en/docs/analytics/export/analytics-data-feed/create-feed', EL + 'Create a data feed'),
 'gs_chatgpt_ad': ('fee8896a0817.html', 'https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/activation/paid-media-ads/activate-chatgpt-ad', EL + 'GenStudio for Performance Marketing: activate a ChatGPT ad'),
 'gs_activation': ('c8d1de4b5a32.html', 'https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/activation/create-activation', EL + 'GenStudio for Performance Marketing: create an activation'),
 'ew': ('56105c00a9c4.html', 'https://www.aem.live/docs/ew/authoring/mcp', 'Adobe aem.live: Experience Workspace MCP'),
 'blog': ('adam_paste_2026-11-18_claude_design_blog.txt', 'https://business.adobe.com/blog/adobe-experience-manager-journey-optimizer-claude-design', 'Adobe for Business blog: From Claude Design to production (text pasted by Adam)'),
}
def q(key, quote):
    f, u, t = U[key]; return Q(f, quote, u, t)
def src(key):
    f, u, t = U[key]; return {'url': u, 'title': t}
K = d['setup_kinds']

def conn(cid, a, b, kind, label, how, srckey, ev, more, gain, flows, prereqs):
    return {'id': cid, 'a': a, 'b': b, 'kind': 'outside', 'setup_kind': K[kind], 'label': label, 'how': how, 'source': src(srckey),
            'evidence': ev, 'more_evidence': more, 'gain': {'title': gain[0], 'text': gain[1]},
            'flows': [{'from': f[0], 'to': f[1], 'what': f[2], 'needs': []} for f in flows], 'availability': '', 'prereqs': prereqs}

conns = [c for c in d['connections'] if c['b'] != 'aa' and c['a'] != 'aa']          # Adam: no Adobe Analytics lines
removed = [c['id'] for c in d['connections'] if 'aa' in (c['a'], c['b'])]
new = []

# Target, in ChatGPT and in Claude
for host, name, start in (('chatgpt', 'ChatGPT', 'Each person adds Adobe’s Target address in ChatGPT and signs in with their Adobe login.'),
                          ('claude', 'Claude', 'Each person adds Adobe’s Target address in Claude on the web, Claude Desktop or Claude Code and signs in with their Adobe login.')):
    new.append(conn(f'{host}-target', host, 'target', 'address', f'Each person adds Adobe’s Target address in {name}',
        start + ' In plain words they check the status, results and change history of tests, create and change A/B and Experience Targeting activities, audiences and offers, and switch activities on and off. What each person can do follows their Target role: Observer reads, Editor creates and changes, Approver switches activities on and off, and every change waits for the person to confirm it.',
        'target', q('target', 'The Adobe Target MCP server provides both read and write access to activities, audiences, offers, and implementation configuration.'),
        [q('target_start', 'You have a supported MCP-compatible application (currently Claude Web, Claude Desktop, Claude Code, Cursor, or ChatGPT).'),
         q('target', 'Editor role or higher is required for write operations; Approver role is required for activation and deactivation.'),
         q('target', 'Write tools include safety annotations and confirmation gates so that no state-changing action is executed without explicit user confirmation.')],
        ('Tests checked and changed by asking', f'Your client’s team checks how tests are doing and makes routine changes by asking in {name}, within the Target roles each person already has.'),
        [(host, 'target', 'Questions about tests, and requested changes'), ('target', host, 'Test status, results and change history, and the result of each change')],
        ['An active Target license with an Adobe Experience Platform organization', 'Target roles set in the Adobe Admin Console: Observer to read, Editor to create and change, Approver to switch activities on and off', 'Each person signs in with their Adobe login and picks the organization', 'Recommendations work needs Target Premium']))

# Real-Time CDP, in ChatGPT and in Claude (look only)
for host, name, start in (('chatgpt', 'ChatGPT', 'Each person adds Adobe’s Real-Time CDP address in ChatGPT as a connector and signs in with their Adobe login.'),
                          ('claude', 'Claude', 'Each person adds Adobe’s Real-Time CDP address in Claude as a connector, or on a Claude Team or Enterprise plan the workspace owner adds it once and each person switches it on; then they sign in with their Adobe login.')):
    new.append(conn(f'{host}-rtcdp', host, 'rtcdp', 'address', f'Each person adds Adobe’s Real-Time CDP address in {name}',
        start + ' In plain words they check audiences, destinations and data flows, for example which flow runs failed in the last day, naming the organization and sandbox. The connection looks only: it does not create, activate, change or delete anything, and it does not bring back delivery or conversion numbers from destination platforms.',
        'rtcdp', q('rtcdp', 'The Real-Time CDP MCP server is distributed as a remote HTTP transport server that users install and configure in supported MCP clients and app platforms (for example, Claude, ChatGPT, Claude Code, Codex, Cursor, or VS Code).'),
        [q('rtcdp', 'The Real-Time CDP MCP server is a read-only monitoring and triage surface.'),
         q('rtcdp', 'This integration serves both Adobe Real-Time CDP and Adobe Real-Time CDP B2B Edition customers'),
         q('rtcdp', 'The MCP server does not return downstream delivery stats, engagement, or conversion metrics from destination platforms.')],
        ('Audience and data flow checks by asking', f'Your client’s team checks audiences, destinations and data flows and spots failed runs by asking in {name}.'),
        [(host, 'rtcdp', 'Questions about audiences, destinations and data flows'), ('rtcdp', host, 'What is set up and how the data flows ran (look only)')],
        ['An active Real-Time CDP license (B2B Edition included)', 'Permission in Experience Platform to view audiences, destinations and data flows', 'The organization ID and the sandbox to ask about', 'Each person signs in with their Adobe login']))

# Journey Optimizer, in Claude only (Adobe does not list ChatGPT for it); plus Claude Design emails
new.append(conn('claude-ajo', 'claude', 'ajo', 'ready', 'Adobe Journey Optimizer is in Claude’s connector list, and Claude Design sends emails into it',
    'Each person picks Adobe Journey Optimizer under Connectors in Claude on the web or Claude Desktop and signs in. In plain words they look into campaigns, journeys and offers: what is live, who a campaign targets, how a journey branches, which sender domains and unsubscribe settings a channel uses. The connection looks only; it changes nothing. Designers also send an email made in Claude Design straight into Journey Optimizer, where it arrives as a ready-to-use template, structured for personalization.',
    'ajo', q('ajo', 'To set up the MCP server in Claude Web or Claude Desktop, go to Connectors and select Adobe Journey Optimizer.'),
    [q('ajo', 'The Adobe Journey Optimizer MCP server lets you inspect, summarize, and troubleshoot campaigns, journeys, and offers directly from your AI assistant.'),
     q('ajo', 'You need at minimum View permissions for the objects you want to query — campaigns, journeys, or offers.'),
     q('blog', 'Adobe Experience Manager and Adobe Journey Optimizer are now available as workflow destinations in Claude Design’s new “Send to” export feature.'),
     q('blog', 'For email, the workflow is just as direct and efficient. Claude Design produces an HTML file that Adobe Journey Optimizer (AJO) can use immediately as a template.')],
    ('Campaign answers, and emails from Claude Design', 'Your client’s team checks campaigns and journeys by asking in Claude, and designers hand emails made in Claude Design to Journey Optimizer as templates, with no download and upload in between.'),
    [('claude', 'ajo', 'Questions about campaigns, journeys and offers'), ('ajo', 'claude', 'Campaign, journey and channel details (look only)'), ('claude', 'ajo', 'Emails made in Claude Design, as ready-to-use templates')],
    ['An active Journey Optimizer license', 'View permission in Journey Optimizer for the campaigns, journeys and offers people ask about', 'Claude on the web or Claude Desktop; Claude Design for the email hand-off']))

# Frame.io, in ChatGPT and in Claude (Frame.io's own help site, accepted by Adam on Nov 10)
for host, name in (('chatgpt', 'ChatGPT'), ('claude', 'Claude')):
    new.append(conn(f'{host}-frameio', host, 'frameio', 'ready', f'Frame.io connects to {name}',
        f'Each person connects Frame.io in {name} and signs in with their Adobe login. In plain words they create projects and folders, upload files, make share links and request reviews, manage comments, access and metadata, and pull reports such as who approved what and the audit history. Everything follows the person’s Frame.io permissions, and changes wait for their approval. The assistant reads file names and folders, not what is inside a video or image.',
        'frameio', q('frameio', 'Use your MCP-compatible AI agent — Claude, ChatGPT, and many more — to connect to our Frame.io MCP server and control Frame.io directly through natural language.'),
        [q('frameio', 'Essentially, everything a Frame.io content admin can do in the UI, an AI agent can do through natural language.'),
         q('frameio', 'Example actions include creating folders, uploading files, managing share links, pulling audit logs, managing access, and much more.')],
        ('Review work by asking', f'Your client’s team uploads, shares for review and reports on approvals by asking in {name}, within their Frame.io permissions.'),
        [(host, 'frameio', 'Requests to upload, organize, share and report'), ('frameio', host, 'Files, review links, comments and reports')],
        ['Frame.io (version 4)', 'Each person signs in with their Adobe login', 'Uploads need Contributor access or higher']))

# Creative Cloud and Acrobat in Claude (Adobe's connector); Adobe Express stays out: Adobe says its Express capabilities are not available to enterprise accounts
cc_q = q('claude_cc', 'Adobe for Claude connects Claude with capabilities from Acrobat, Adobe Express, Photoshop, Lightroom, Illustrator, Firefly, Premiere, InDesign, and Adobe Stock.')
new.append(conn('claude-creativecloud', 'claude', 'creativecloud', 'ready', 'One Adobe connector brings Photoshop, Illustrator, Firefly and Premiere tools into Claude',
    'Each person adds Adobe’s connector in Claude. By describing the job they edit photos, make designs, cut video and generate images with tools from Photoshop, Lightroom, Illustrator, Firefly, Premiere and InDesign, and find Adobe Stock images. Signing in with an Adobe account saves the work to Creative Cloud.',
    'claude_cc', cc_q, [],
    ('Quick creative edits in the chat', 'Your client’s team makes quick photo, design and video edits by describing them in Claude.'),
    [('claude', 'creativecloud', 'A description of the edit, with the files'), ('creativecloud', 'claude', 'The edited files')],
    ["Your client's own Claude", 'An Adobe account; some tools need an eligible paid Adobe plan']))
new.append(conn('claude-acrobat', 'claude', 'acrobat', 'ready', 'The same Adobe connector brings Acrobat PDF tools into Claude',
    'The same Adobe connector in Claude includes Acrobat. By describing the job a person creates, edits and reviews PDFs in the chat.',
    'claude_cc', cc_q, [],
    ('PDF jobs in the chat', 'Your client’s team handles PDFs by describing the job in Claude.'),
    [('claude', 'acrobat', 'A description of the PDF job, with the files'), ('acrobat', 'claude', 'The finished PDF')],
    ["Your client's own Claude", 'An Adobe account; some tools need an eligible paid Adobe plan']))

# Microsoft Copilot (the third box)
new.append(conn('copilot-cw', 'copilot', 'cw', 'ready', 'Adobe publishes Coworker as an agent for Microsoft 365 Copilot, approved by the Microsoft 365 administrator',
    'Your client’s Microsoft 365 administrator approves Adobe CX Enterprise Coworker in the Microsoft 365 and Teams admin centers and deploys it to chosen people or the whole organization. They then ask Coworker in plain words in Teams, Word, Excel, PowerPoint and Copilot chat, and get marketing insights within the permissions they already have in Adobe.',
    'cw', q('cw', 'Use Adobe CX Enterprise Coworker for Copilot to get marketing insights in Microsoft 365 Copilot.'),
    [q('cw', 'Approve Adobe CX Enterprise Coworker in both the Microsoft 365 admin center and the Teams admin center.'),
     q('cw', 'Once your administrator enables Coworker, you can access it across Microsoft 365 Copilot surfaces, including Teams, Word, Excel, PowerPoint, and web chat.')],
    ('Coworker where the team already works', 'Your client’s team gets marketing answers from Coworker in Teams and Office, at no extra cost beyond the Coworker license.'),
    [('copilot', 'cw', 'Questions typed in plain words in Microsoft 365 Copilot'), ('cw', 'copilot', 'Marketing insights, within each person’s Adobe permissions')],
    ['A Coworker license', 'Microsoft 365 Copilot', 'The Microsoft 365 administrator allows apps and agents from outside publishers']))
aem_list = q('aem', 'Anthropic Claude Microsoft 365 Copilot OpenAI ChatGPT')
new.append(conn('copilot-aemsites', 'copilot', 'aemsites', 'address', 'Each person adds Adobe’s AEM address in Microsoft 365 Copilot',
    'Adobe lists Microsoft 365 Copilot among the chat applications for its AEM connection. A person adds Adobe’s AEM address and signs in with their Adobe ID. In plain words they find, create, change and publish pages and content fragments on AEM as a Cloud Service, within their own AEM permissions.',
    'aem', aem_list, [q('aem', 'Practitioners and content architects can manage sites and content fragments, and import assets, with AI assistance while staying within AEM\'s existing permission model.')],
    ('Page content by asking', 'Your client’s content team finds, drafts and updates pages and content fragments by asking in Microsoft 365 Copilot, under the AEM permissions each person already has.'),
    [('copilot', 'aemsites', 'Requests to find, create, change or publish pages and content fragments'), ('aemsites', 'copilot', 'Results and the content found, for review before it goes live')],
    ['AEM as a Cloud Service, on release 26309 or later', 'Each person signs in with their own Adobe ID and works within their AEM permissions']))
new.append(conn('copilot-aemassets', 'copilot', 'aemassets', 'address', 'The same AEM connection works with assets from Microsoft 365 Copilot',
    'The AEM connection in Microsoft 365 Copilot also covers AEM Assets. In plain words your client’s team searches, imports, uploads, downloads, moves and publishes assets, edits their details and finds unused ones.',
    'aem', aem_list, [q('aem', 'There is also support for asset upload, download, move/copy/delete, and publish/unpublish for assets, along with editing metadata, inspecting references, and identifying unused assets.')],
    ('Asset work by asking', 'Your client’s team finds and handles assets by asking in Microsoft 365 Copilot, under the AEM permissions each person already has.'),
    [('copilot', 'aemassets', 'Requests to search, import, upload or publish assets'), ('aemassets', 'copilot', 'The assets found and the result of each action')],
    ['AEM as a Cloud Service, on release 26309 or later', 'Each person signs in with their own Adobe ID and works within their AEM permissions']))
new.append(conn('copilot-gspm', 'copilot', 'gspm', 'address', 'Your client adds Adobe’s GenStudio address in Microsoft Copilot',
    'Adobe hosts the connection. Following Microsoft’s steps for a custom connection, your client adds Adobe’s GenStudio for Performance Marketing address in Microsoft Copilot, and each person signs in with their Adobe ID. In plain words they ask how ads are performing, put together a draft ad from a template, and publish an approved ad to a connected channel.',
    'gspm', q('gspm', 'A supported plan that allows remote MCP connections when you use Claude, ChatGPT, or Microsoft Copilot.'),
    [q('gspm', 'Microsoft controls the setup flow for custom MCP connections in Copilot.')],
    ('Ad answers and drafts by asking', 'Your client’s marketers get performance answers and first drafts by asking in Microsoft Copilot, with their own GenStudio permissions.'),
    [('copilot', 'gspm', 'Questions about ad performance and requests for a draft or to publish an approved ad'), ('gspm', 'copilot', 'Performance answers, drafts to review, and the result of publishing')],
    ['Access to GenStudio for Performance Marketing', 'A Microsoft Copilot plan that allows custom connections', 'Each person signs in with their Adobe ID']))
new.append(conn('copilot-cja', 'copilot', 'cja', 'guide', 'Your client adds Adobe’s Customer Journey Analytics address as a tool in Copilot Studio',
    'Your client’s team adds Adobe’s Customer Journey Analytics address as a tool in Copilot Studio and builds a small agent on it. People then ask that agent for Customer Journey Analytics data in plain words, in Microsoft Copilot.',
    'cja', q('cja', 'You can request Adobe Analytics and Customer Journey Analytics data using Copilot Studio.'), [],
    ('Analytics answers by asking', 'Your client’s team gets Customer Journey Analytics answers by asking an agent in Microsoft Copilot.'),
    [('copilot', 'cja', 'Questions about the data, in plain words'), ('cja', 'copilot', 'Answers from the data views each person can use')],
    ['Customer Journey Analytics, with access for the connection set in the Admin Console', 'Copilot Studio']))
wf_q = q('workfront', 'If you use a different MCP-compatible AI agentic platform (for example, Gemini or Microsoft Copilot), follow the steps in that platform\'s documentation for adding a custom MCP server.')
new.append(conn('copilot-workfront', 'copilot', 'workfront', 'address', 'Your client adds Adobe’s Workfront address in Microsoft Copilot',
    'Adobe hosts the Workfront connection and names Microsoft Copilot among the platforms it works with. Your client adds Adobe’s Workfront address following Microsoft’s steps, and each person signs in. In plain words they find projects, tasks and issues and, once the Workfront administrator switches writing on, create, update and delete them, with each person’s own Workfront access.',
    'workfront', wf_q, [],
    ('Work managed by asking', 'Your client’s team looks up and updates projects, tasks and issues by asking in Microsoft Copilot, within the Workfront access each person already has.'),
    [('copilot', 'workfront', 'Requests to find, create or update projects, tasks and issues'), ('workfront', 'copilot', 'The Workfront items found and the result of each change')],
    ["Workfront on Adobe's sign-in system (Adobe Identity Management System)", 'The Workfront administrator allows the connection: reading is on from the start, writing is off until switched on', 'Each person signs in and works within their own Workfront access']))
new.append(conn('copilot-planning', 'copilot', 'planning', 'address', 'Workfront Planning rides on the Workfront connection in Microsoft Copilot',
    'Workfront Planning has no connection of its own. When your client’s Workfront package includes Planning, the Workfront connection in Microsoft Copilot also brings the Planning tools, so the team searches, creates and changes Planning records in plain words.',
    'workfront', wf_q, [],
    ('Planning records by asking', 'Your client’s team searches and updates Planning records by asking in Microsoft Copilot, within their own Workfront access.'),
    [('copilot', 'planning', 'Requests to search, create or change Planning records'), ('planning', 'copilot', 'The Planning records found and the result of each change')],
    ['A Workfront package that includes Workfront Planning', 'The Workfront connection in Microsoft Copilot']))
cop_cc = [q('copilot_cc', 'Use Adobe\'s creativity and productivity tools directly in Microsoft Copilot.'),
          q('copilot_cc', 'Adobe for Microsoft Copilot is available to Microsoft Copilot enterprise customers in Copilot Cowork on desktop and web.'),
          q('copilot_cc', 'Your Microsoft administrator must enable access before you can get started.')]
new.append(conn('copilot-creativecloud', 'copilot', 'creativecloud', 'ready', 'Adobe’s connector brings creative tools into Microsoft Copilot',
    'Your client’s Microsoft administrator switches on Adobe’s connector for Microsoft Copilot. In Copilot Cowork, on desktop and web, people then edit images and create designs with Adobe’s creative tools by describing the job.',
    'copilot_cc', cop_cc[0], cop_cc[1:],
    ('Quick creative edits in Copilot', 'Your client’s team edits images and makes designs by describing them in Microsoft Copilot.'),
    [('copilot', 'creativecloud', 'A description of the edit or design, with the files'), ('creativecloud', 'copilot', 'The edited images and designs')],
    ['Microsoft Copilot for enterprise, with Copilot Cowork', 'The Microsoft administrator switches the connector on', 'Some tools need the matching Adobe subscription']))
new.append(conn('copilot-acrobat', 'copilot', 'acrobat', 'ready', 'The same connector brings Acrobat PDF tools into Microsoft Copilot',
    'The same Adobe connector in Microsoft Copilot works with PDFs: people create and edit PDFs by describing the job in Copilot Cowork.',
    'copilot_cc', cop_cc[0], cop_cc[1:],
    ('PDF jobs in Copilot', 'Your client’s team handles PDFs by describing the job in Microsoft Copilot.'),
    [('copilot', 'acrobat', 'A description of the PDF job, with the files'), ('acrobat', 'copilot', 'The finished PDF')],
    ['Microsoft Copilot for enterprise, with Copilot Cowork', 'The Microsoft administrator switches the connector on']))

# Two missing lines between boxes the tool already has
new.append(conn('aa-cstore', 'aa', 'cstore', 'technical', 'Adobe Analytics data feeds land in your client’s cloud storage',
    'Adobe Analytics delivers its data feeds, the raw data behind reports, on a schedule to a cloud storage account your client sets up as the destination.',
    'feed', q('feed', 'Any cloud accounts that you previously configured are available to use for data feeds.'),
    [q('feed', 'Adobe recommends using a cloud account for your report destination.')],
    ('Raw Analytics data in your client’s own storage', 'Your client’s data team gets the full Adobe Analytics data on a schedule, in its own cloud storage, for its own tools.'),
    [('aa', 'cstore', 'Data feed files, on a schedule')],
    ['A cloud storage account your client sets up as the destination']))
new.append(conn('gspm-ads', 'gspm', 'ads', 'technical', 'GenStudio for Performance Marketing activates ads to ad platforms, ChatGPT ads among them',
    'Approved ads go from GenStudio for Performance Marketing to your client’s ad accounts: ChatGPT ads, and for display ads Google Campaign Manager 360, Innovid, Amazon Ads or The Trade Desk.',
    'gs_chatgpt_ad', q('gs_chatgpt_ad', 'Adobe GenStudio for Performance Marketing supports the activation of ChatGPT ad experiences.'),
    [q('gs_chatgpt_ad', 'Activating a ChatGPT ad follows the same general steps required for activation to other paid ad channels.'),
     q('gs_activation', 'If your selection includes display-format experiences, specify which display platform to use: Google Campaign Manager 360, Innovid, Amazon Ads, or The Trade Desk.')],
    ('Approved ads straight to the ad accounts', 'Your client’s team sends approved ads to its ad platforms from GenStudio for Performance Marketing, without rebuilding them there.'),
    [('gspm', 'ads', 'Approved ads, to the chosen ad accounts')],
    ['Your client’s ad accounts connected to GenStudio for Performance Marketing']))

# Edge Delivery Services authored in Experience Workspace, in Claude and in ChatGPT (aem.live, accepted by Adam on Nov 18)
ew_q = q('ew', 'The Experience Workspace MCP connects AI assistants like Claude or ChatGPT to your Experience Workspace projects using the Model Context Protocol (MCP), an open standard for giving AI tools access to external services.')
for host, name in (('claude', 'Claude'), ('chatgpt', 'ChatGPT')):
    new.append(conn(f'{host}-eds', host, 'eds', 'address', f'Each person adds Adobe\u2019s Experience Workspace address in {name}',
        f'When your client\u2019s Edge Delivery site is authored in Experience Workspace, each person adds Adobe\u2019s Experience Workspace address in {name} as a custom connector and signs in with their Adobe login. In plain words they browse the site\u2019s content, read files, create new pages, move things around and check version history, without leaving the chat.',
        'ew', ew_q,
        [q('ew', 'Once connected, AI assistants that observe the MCP standard can browse your content, read files, create new pages, move things around, and check version history without you ever leaving the chat window.'),
         q('ew', 'Experience Workspace MCP can be added to Claude (and also others like ChatGPT) as a custom connector.')],
        ('Site pages by asking', f'Your client\u2019s team drafts, moves and checks pages of its Edge Delivery site by asking in {name}.'),
        [(host, 'eds', 'Requests to browse, create, change or move pages'), ('eds', host, 'The content found, and the result of each change')],
        ['An Edge Delivery site authored in Experience Workspace', 'Each person signs in with their Adobe login']))

# Claude Design pages into AEM: a second flow on the existing Claude + AEM Sites line
for c in conns:
    if c['id'] == 'claude-aemsites':
        c['how'] += ' Designers also send a page made in Claude Design straight into AEM, where it becomes a managed page inside AEM’s approval workflows.'
        c['flows'].append({'from': 'claude', 'to': 'aemsites', 'what': 'Pages made in Claude Design, sent into AEM', 'needs': []})
        c['more_evidence'] = (c.get('more_evidence') or []) + [q('blog', 'Adobe Experience Manager and Adobe Journey Optimizer are now available as workflow destinations in Claude Design’s new “Send to” export feature.'),
                                                              q('blog', 'The design becomes a managed, brand-ready experience, truly streamlining the creation to publication workflow.')]
        c['label'] = 'Adobe publishes an Adobe Experience Manager connector in Claude, and Claude Design sends pages into AEM'

conns += new
out = copy.deepcopy(d)
out['made'] = '2026-11-18, round two (main session): round one with Adam’s answers of Nov 18 and the double check of ChatGPT’s fact-check'
out['status'] = 'Proposal, not built. Adam said yes to the boxes (ChatGPT, Claude, Microsoft Copilot), to the play rule and to lines without hours; no Adobe Analytics lines.'
out['connections'] = conns
out['removed_by_adam'] = removed
cop = copy.deepcopy(next(o for o in d['outside_systems'] if o['id'] == 'claude'))
cop.update({'id': 'copilot', 'name': 'Microsoft Copilot', 'title': 'Microsoft Copilot',
            'systems': 'Your client’s staff use Adobe products from inside Microsoft Copilot (Microsoft 365 Copilot, Copilot Studio or Copilot Cowork)',
            'systems_on_brand_visibility_plays': 'Your client’s staff use Adobe products from inside Microsoft Copilot.',
            'card_note': '', 'card_note_evidence': []})
out['outside_systems'] = d['outside_systems'] + [cop]
svcs = []
for s in d['new_services']:
    if s['owner'] == 'aa': continue
    s = copy.deepcopy(s)
    if s['owner'] in ('cja', 'aemsites', 'aemassets', 'workfront', 'gspm'):
        s['name'] = s['name'].replace('in ChatGPT or Claude', 'in ChatGPT, Claude or Microsoft Copilot')
        s['bands']['large'] = s['bands']['large'].replace('Both assistants', 'Two or three assistants')
    svcs.append(s)
out['new_services'] = svcs
rs = copy.deepcopy(d.get('reused_services') or {})
rs['AN07'] = 'Data feeds and Data Warehouse exports: covers the new Adobe Analytics to cloud storage line'
rs['GS04'] = 'Paid media connections and activation setup: covers the new GenStudio for Performance Marketing to ad platforms line'
out['reused_services'] = rs
for p in out['plays']:
    if p['play'] in ('cja', 'coworker', 'custom'): p['add'] = sorted(set(p['add']) | {'copilot'})
    if p['play'] == 'aem': p['add'] = sorted(set(p['add']) | {'chatgpt', 'claude'}); p['standing'] = 'optional'
out['build_rules'] = [r for r in d['build_rules'] if 'Good to know' not in r and 'tick' not in r] + [
  'No release label, date, caveat or note about what is coming or left out, anywhere in the tool (Adam, Nov 18).',
  'Real limits stay inside the how sentence (look only, roles, what the assistant cannot read); no new card section.',
  'Services stay listed on their Adobe product, like Coworker set up in an AI platform today; the lines themselves carry no services.',
  'A play offers ChatGPT, Claude and Microsoft Copilot whenever a product on its canvas connects to them, and the CDN on the Adobe Coworker play once Brand Visibility is added (Adam, Nov 18).']
json.dump(out, open(OUT, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
by = {}
for c in conns:
    host = c['a'] if c['a'] in ('chatgpt', 'claude', 'copilot') else (c['b'] if c['b'] in ('chatgpt', 'claude', 'copilot') else 'existing boxes')
    by.setdefault(host, []).append(c['b'] if host != 'existing boxes' else c['id'])
for k, v in by.items(): print(k, len(v), ', '.join(v))
print('lines', len(conns), '| removed', removed, '| services', [s['id'] for s in svcs])
print('quotes proven:', sum(1 + len(c.get('more_evidence') or []) for c in new) + 2)
