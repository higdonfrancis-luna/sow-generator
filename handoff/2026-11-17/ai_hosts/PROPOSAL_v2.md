# ChatGPT, Claude and Microsoft Copilot as outside systems: round two

November 18, 2026. For Adam. Nothing is built yet. Round one is `PROPOSAL.md` in this folder; the build data for this round is `proposal_data_v2.json` (every line with its Adobe quote, all proven word for word on the saved pages).

## What changed since your last look

- **Your answers applied:** three boxes (ChatGPT, Claude, Microsoft Copilot); a play offers them whenever a product on its canvas connects to them; lines with no hours are fine; no Adobe Analytics lines anywhere.
- **Your Nov 12 rule applied properly this time:** connectors Adobe calls beta are in (Target, Real-Time CDP, Journey Optimizer, Frame.io). No beta label, date or caveat appears anywhere; real limits (look only, roles) stay in the card sentence. Round one leaving them out was this session's mistake.
- **Your Nov 18 rule:** coming soon is published; anything on a roadmap dated after January 1, 2027 is left out, with no line in the tool about it.
- **Claude Design** to AEM and to Journey Optimizer is in, proven by the Adobe blog text you pasted.
- **Claude and Copilot with Creative Cloud and Acrobat** are in, with no caveat. Adobe Express stays out for those two: Adobe says its Express capabilities there "aren't available to enterprise accounts".
- **Two missing lines between boxes the tool already has** are in: Adobe Analytics to cloud storage, and GenStudio for Performance Marketing to ad platforms. Both use services the tool already has.
- **Totals:** 39 new lines (ChatGPT 13, Claude 15, Microsoft Copilot 9, and 2 between existing boxes). The tool goes from 162 to 201 connections and from 569 to 575 services (the six round-one services, minus the Adobe Analytics one).

## Double check of ChatGPT's fact-check

| ChatGPT said | What Adobe's own pages show | What changes |
|---|---|---|
| Journey Optimizer, Target and Real-Time CDP were wrongly left out | Right. Target: ChatGPT and Claude, read and change tests within Target roles. Real-Time CDP: ChatGPT and Claude, look only. Journey Optimizer: Claude only, look only; Adobe does not list ChatGPT for it. | In, with no beta label. Journey Optimizer gets a Claude line only. |
| Claude Design sends pages to AEM and emails to Journey Optimizer | Right, proven by the Adobe blog text Adam pasted ("now available as workflow destinations"). | In. Email templates only; nothing is said about other channels. |
| Keep Creative Cloud and Acrobat for Claude | Right. Adobe's Claude connector brings Acrobat, Photoshop, Lightroom, Illustrator, Firefly, Premiere, InDesign and Adobe Stock. | In, no caveat. Express stays out for Claude and Copilot (a hard limit for enterprise accounts). |
| Frame.io documents its own connector | Right. Frame.io's help site (accepted by Adam on Nov 10): Claude and ChatGPT, all plans. | In for both. |
| Microsoft 365 Copilot next | Right, and wider: Coworker, AEM Sites and Assets, GenStudio for Performance Marketing, Workfront and Planning, Customer Journey Analytics (through Copilot Studio), Creative Cloud and Acrobat. | Third box, 9 lines. Adobe does not list Copilot for Target, Real-Time CDP, Journey Optimizer or Frame.io. |
| Gemini and Slack have enough evidence | Partly. Gemini: Coworker in Gemini Enterprise and Adobe's creative connector; Acrobat in Gemini was only announced (Nov 10). Slack: Adobe's creative connector (Slack AI Business+ or Enterprise+) and Workfront for Slack. | Candidates for a later round. |
| Adobe Advertising DSP and Workfront agents | Adobe Advertising is not in the tool. Workfront lets a client assign agents built with Claude, OpenAI or Copilot Studio to tasks. | DSP: nothing. Workfront agents: candidates for a later round. |
| Three missing lines between existing boxes | Two hold up on Adobe's pages: Analytics data feeds to cloud storage; GenStudio ads to ad platforms (ChatGPT ads and display platforms). Analytics to BI tools rests on Microsoft's page only. | The two are in; BI is left out. |
| Experience Workspace (Edge Delivery) connector | Documented only on aem.live, Adobe's Edge Delivery documentation site, which is not on the evidence list. Experience League calls Experience Workspace the default for new Edge Delivery projects but names no assistant. | Question for Adam. |
| The "one in five" count was not fair | Right. Of the 33 records the research called connectors, round one confirmed 17 and partly confirmed 6; 3 more were the betas wrongly left out. "Five lines with no hours" was three. | Corrected. |
| Commerce product feeds for ChatGPT (round one asked for a paste) | The Commerce page Adam pasted never names ChatGPT. It says Commerce supports OpenAI's and Google's agent shopping protocols, and its Storefront server lets developers connect any compatible assistant to the live store. | No ChatGPT line. The Storefront server is a Commerce build, not a box. |

## Every play

| Play | At the start | Why |
|---|---|---|
| Adobe Brand Visibility | Not offered | No product on it connects to an assistant. Brand Visibility measures answers in ChatGPT; that is not a connection. |
| Brand Visibility + Customer Journey Analytics | All three offered, optional | Customer Journey Analytics connects to all three. Lines go to it, never to Brand Visibility. |
| Brand Visibility + Adobe Commerce | Not offered | Adobe names no assistant for Commerce. |
| Brand Visibility + Sites Optimizer and Edge Delivery Services | Not offered, unless aem.live counts as evidence | Experience Workspace's connector is documented only on aem.live. |
| Brand Visibility + Brand Concierge | Not offered | No connector. |
| Adobe Coworker | All three offered, optional | Coworker connects to all three. |
| Create your own play | All three in the list | Lines appear for whichever products are on the canvas. |

Once the ranked Add product list is saved, adding a product that connects (for example Target on a Brand Visibility play) brings the boxes with it, and adding Brand Visibility to the Adobe Coworker play brings the CDN.

## Coworker and Brand Visibility

No official Adobe page pairs them. Coworker's own page lists where Coworker Chat is available (Real-Time CDP, Journey Optimizer, Customer Journey Analytics, Adobe Analytics, Target, AEM, Workfront, Marketo Engage), and Brand Visibility is not one of them; no Brand Visibility page mentions Coworker. So the ranked list keeps them apart unless Adam decides to pair them as a sales choice.

## Left out, and why (for Adam; nothing about these goes in the tool)

- Adobe Analytics with any assistant (Adam).
- Journey Optimizer in ChatGPT and in Copilot; Target, Real-Time CDP and Frame.io in Copilot: Adobe does not list them.
- Adobe Express in Claude and in Copilot: Adobe says those Express capabilities are not available to enterprise accounts.
- Claude Design to Adobe Express: it runs through the same Claude connector, with the same Express limit.
- Claude with Brand Intelligence: Adobe's page is a guide for building it into your own assistant, with Claude only as the example.
- Photoshop, Illustrator, Premiere and After Effects local connectors: private beta in early 2027 (Adam's cut-off).
- Journey Optimizer mobile and conversational from Claude Design: "on the roadmap", no date.
- Analytics to BI tools: only Microsoft's page says so.
- Experience Workspace (Edge Delivery): only on aem.live, unless Adam says it counts.
- Commerce and ChatGPT: Adobe names OpenAI's protocol, not ChatGPT.

## Questions for Adam

1. Does aem.live count as evidence? It is Adobe's own Edge Delivery documentation site. My pick: yes; it adds ChatGPT and Claude lines to Edge Delivery Services, so the Brand Visibility + Sites Optimizer and Edge Delivery play offers them.
2. Ranked list, my picks: keep Coworker and Brand Visibility apart (Adobe does not connect them); show small counts such as "10 of 30"; save to the working branch now and get the data owner's sign-off before anything goes to main.

Then the build: the ranked list is saved, and the three boxes go on top of it.

## Appendix: every line

| Box | Adobe product | What the client's team does | Service | Adobe source |
|---|---|---|---|---|
| chatgpt | AEM Assets | With the ready-made listing your client's team searches, imports and downloads assets, sees where an asset is used and finds unused assets, in plain words | XT04 | [link](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/mcp-support/using-mcp-with-aem-as-a-cloud-service) |
| chatgpt | AEM Sites | In plain words they find, create, change and publish pages and content fragments on AEM as a Cloud Service, within their own AEM permissions | XT03 | [link](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/mcp-support/chat-applications/setup-chatgpt) |
| chatgpt | Acrobat and Acrobat Services | By describing the job a person creates PDFs and turns designs or data into formatted PDFs in the chat | none | [link](https://helpx.adobe.com/creative-cloud/apps/integration-with-other-apps/adobe-connectors/adobe-for-chatgpt.html) |
| chatgpt | Adobe Express | A person starts from an Express template, updates the text and colors by describing the change, and can animate the design for social media or turn it into a PDF. | none | [link](https://helpx.adobe.com/creative-cloud/apps/integration-with-other-apps/adobe-connectors/adobe-for-chatgpt.html) |
| chatgpt | Coworker | They then ask Coworker in plain words inside ChatGPT | Coworker set up in an AI platform (existing) | [link](https://experienceleague.adobe.com/en/docs/coworker/content/ai-platforms) |
| chatgpt | Creative Cloud | By describing the job they edit photos, cut and resize video and generate images with tools from Photoshop, Premiere, Firefly and other Adobe apps | none | [link](https://helpx.adobe.com/creative-cloud/apps/integration-with-other-apps/adobe-connectors/adobe-for-chatgpt.html) |
| chatgpt | Customer Journey Analytics | They ask in plain words and get reports from their own data views | XT01 | [link](https://developer.adobe.com/analytics-mcp/docs/guides/chatgpt) |
| chatgpt | Frame.io | In plain words they create projects and folders, upload files, make share links and request reviews, manage comments, access and metadata, and pull reports such as who approved what and the audit history | none | [link](https://help.frame.io/en/articles/17218043-connecting-frame-io-mcp-server-with-ai-clients-beta) |
| chatgpt | GenStudio for Performance Marketing | A person switches on developer mode in ChatGPT on the web, adds Adobe's GenStudio for Performance Marketing address and signs in with their Adobe ID | XT06 | [link](https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/ai-assistants/connect-ai-assistants) |
| chatgpt | Real-Time CDP | In plain words they check audiences, destinations and data flows, for example which flow runs failed in the last day, naming the organization and sandbox | none | [link](https://experienceleague.adobe.com/en/docs/experience-platform/rtcdp/intro/rtcdp-mcp) |
| chatgpt | Target | In plain words they check the status, results and change history of tests, create and change A/B and Experience Targeting activities, audiences and offers, and switch activities on and off | none | [link](https://experienceleague.adobe.com/en/docs/target/using/mcp/target-mcp) |
| chatgpt | Workfront | A person adds Adobe's Workfront address in ChatGPT and signs in | XT05 | [link](https://experienceleague.adobe.com/en/docs/workfront/using/basics/workfront-mcp-server/configure-workfront-mcp-server) |
| chatgpt | Workfront Planning | When your client's Workfront package includes Planning, the Workfront connection in ChatGPT also brings the Planning tools, so the team looks up, searches, creates and changes Planning records in plain words. | XT05 (large size) | [link](https://experienceleague.adobe.com/en/docs/workfront/using/basics/workfront-mcp-server/configure-workfront-mcp-server) |
| claude | AEM Assets | With the ready-made listing your client's team searches, imports and downloads assets, sees where an asset is used and finds unused assets, in plain words | XT04 | [link](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/mcp-support/using-mcp-with-aem-as-a-cloud-service) |
| claude | AEM Sites | In plain words they find, create, change and publish pages and content fragments on AEM as a Cloud Service, within their own AEM permissions | XT03 | [link](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/mcp-support/chat-applications/setup-claude) |
| claude | Acrobat and Acrobat Services | By describing the job a person creates, edits and reviews PDFs in the chat. | none | [link](https://helpx.adobe.com/creative-cloud/apps/integration-with-other-apps/adobe-connectors/adobe-for-claude.html) |
| claude | Coworker | Each person finds it under Connectors in Claude and signs in with their Adobe login | Coworker set up in an AI platform (existing) | [link](https://experienceleague.adobe.com/en/docs/coworker/content/ai-platforms) |
| claude | Creative Cloud | By describing the job they edit photos, make designs, cut video and generate images with tools from Photoshop, Lightroom, Illustrator, Firefly, Premiere and InDesign, and find Adobe Stock images | none | [link](https://helpx.adobe.com/creative-cloud/apps/integration-with-other-apps/adobe-connectors/adobe-for-claude.html) |
| claude | Customer Journey Analytics | They ask in plain words and get reports from their own data views | XT01 | [link](https://developer.adobe.com/analytics-mcp/docs/guides/claude) |
| claude | Firefly Creative Production | In plain words they ask for production jobs, such as removing a background or making several sizes, and Claude picks the workflow actions, runs them and brings back the result. | Run-Workflow MCP for AI agents (existing) | [link](https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/run-workflow-mcp-overview.html) |
| claude | Frame.io | In plain words they create projects and folders, upload files, make share links and request reviews, manage comments, access and metadata, and pull reports such as who approved what and the audit history | none | [link](https://help.frame.io/en/articles/17218043-connecting-frame-io-mcp-server-with-ai-clients-beta) |
| claude | GenStudio for Performance Marketing | A person adds Adobe's GenStudio for Performance Marketing address in Claude as a custom connector, on the web or the desktop app, and signs in with their Adobe ID | XT06 | [link](https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/ai-assistants/connect-ai-assistants) |
| claude | Journey Optimizer | In plain words they look into campaigns, journeys and offers: what is live, who a campaign targets, how a journey branches, which sender domains and unsubscribe settings a channel uses | none | [link](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/combine/ajo-mcp) |
| claude | Marketo Engage | A Marketo administrator creates credentials for a dedicated API-only user, and they go into Claude Desktop (with Adobe's helper file and Node.js on the computer) or Claude Code | XT07 | [link](https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/mcp-server) |
| claude | Real-Time CDP | In plain words they check audiences, destinations and data flows, for example which flow runs failed in the last day, naming the organization and sandbox | none | [link](https://experienceleague.adobe.com/en/docs/experience-platform/rtcdp/intro/rtcdp-mcp) |
| claude | Target | In plain words they check the status, results and change history of tests, create and change A/B and Experience Targeting activities, audiences and offers, and switch activities on and off | none | [link](https://experienceleague.adobe.com/en/docs/target/using/mcp/target-mcp) |
| claude | Workfront | In plain words they find projects, tasks and issues and, once the Workfront administrator switches writing on, create, update and delete them | XT05 | [link](https://experienceleague.adobe.com/en/docs/workfront/using/basics/workfront-mcp-server/configure-workfront-mcp-server) |
| claude | Workfront Planning | When your client's Workfront package includes Planning, the Workfront connection in Claude also brings the Planning tools, so the team looks up, searches, creates and changes Planning records in plain words. | XT05 (large size) | [link](https://experienceleague.adobe.com/en/docs/workfront/using/basics/workfront-mcp-server/configure-workfront-mcp-server) |
| copilot | AEM Assets | In plain words your client’s team searches, imports, uploads, downloads, moves and publishes assets, edits their details and finds unused ones. | XT04 | [link](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/mcp-support/using-mcp-with-aem-as-a-cloud-service) |
| copilot | AEM Sites | A person adds Adobe’s AEM address and signs in with their Adobe ID | XT03 | [link](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/mcp-support/using-mcp-with-aem-as-a-cloud-service) |
| copilot | Acrobat and Acrobat Services | The same Adobe connector in Microsoft Copilot works with PDFs: people create and edit PDFs by describing the job in Copilot Cowork. | none | [link](https://helpx.adobe.com/creative-cloud/apps/integration-with-other-apps/adobe-connectors/adobe-for-copilot.html) |
| copilot | Coworker | They then ask Coworker in plain words in Teams, Word, Excel, PowerPoint and Copilot chat, and get marketing insights within the permissions they already have in Adobe. | Coworker set up in an AI platform (existing) | [link](https://experienceleague.adobe.com/en/docs/coworker/content/ai-platforms) |
| copilot | Creative Cloud | In Copilot Cowork, on desktop and web, people then edit images and create designs with Adobe’s creative tools by describing the job. | none | [link](https://helpx.adobe.com/creative-cloud/apps/integration-with-other-apps/adobe-connectors/adobe-for-copilot.html) |
| copilot | Customer Journey Analytics | People then ask that agent for Customer Journey Analytics data in plain words, in Microsoft Copilot. | XT01 | [link](https://developer.adobe.com/analytics-mcp/docs/guides/copilot) |
| copilot | GenStudio for Performance Marketing | Following Microsoft’s steps for a custom connection, your client adds Adobe’s GenStudio for Performance Marketing address in Microsoft Copilot, and each person signs in with their Adobe ID | XT06 | [link](https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/ai-assistants/connect-ai-assistants) |
| copilot | Workfront | Your client adds Adobe’s Workfront address following Microsoft’s steps, and each person signs in | XT05 | [link](https://experienceleague.adobe.com/en/docs/workfront/using/basics/workfront-mcp-server/configure-workfront-mcp-server) |
| copilot | Workfront Planning | When your client’s Workfront package includes Planning, the Workfront connection in Microsoft Copilot also brings the Planning tools, so the team searches, creates and changes Planning records in plain words. | XT05 (large size) | [link](https://experienceleague.adobe.com/en/docs/workfront/using/basics/workfront-mcp-server/configure-workfront-mcp-server) |
| existing boxes | Adobe Analytics to Cloud storage | Adobe Analytics delivers its data feeds, the raw data behind reports, on a schedule to a cloud storage account your client sets up as the destination. | Data feeds and Data Warehouse exports (existing) | [link](https://experienceleague.adobe.com/en/docs/analytics/export/analytics-data-feed/create-feed) |
| existing boxes | GenStudio for Performance Marketing to Ad platforms | Approved ads go from GenStudio for Performance Marketing to your client’s ad accounts: ChatGPT ads, and for display ads Google Campaign Manager 360, Innovid, Amazon Ads or The Trade Desk. | Paid media connections and activation setup (existing) | [link](https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/activation/paid-media-ads/activate-chatgpt-ad) |
