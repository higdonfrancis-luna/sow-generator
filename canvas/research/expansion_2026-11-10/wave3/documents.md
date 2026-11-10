# Wave 3, documents (AEM Guides, Acrobat and Acrobat Services, Acrobat Sign): research trail

Checked Nov 10 2026. Research only: nothing in the tool, the catalog or the site was changed, nothing was built and nothing was committed. The data is in `documents.json` beside this file. The other wave 3 products (Adobe Analytics, Audience Manager, Adobe Campaign, Adobe Advertising, Marketo Measure) belong to other helpers and are not here, with one exception flagged below: the Acrobat and Adobe Analytics connection.

## Summary

Three products with 36 services, and 13 connections with 23 services (59 services in all). Hours are our own estimates for a mid-market client; Adobe publishes none.

| Product | id | Services | Starting | Optional | Monthly |
|---|---|---|---|---|---|
| AEM Guides (Adobe Experience Manager Guides as a Cloud Service) | `aemguides` | 10 | 7 | 3 | 1 |
| Acrobat and Acrobat Services (Adobe Acrobat for enterprise and the Adobe Acrobat Services APIs) | `acrobat` | 12 | 3 | 9 | 1 |
| Acrobat Sign (Adobe Acrobat Sign Solutions) | `acrobatsign` | 14 | 6 | 8 | 1 |

| Connection | id | Kind | Services | Label |
|---|---|---|---|---|
| AEM Guides + AEM Sites | `aemguides-aemsites` | native | XN01, XN02, XN03 | AEM Sites output preset publishes DITA maps as Sites pages on Adobe's Guides templates; topics can also become Experience Fragments |
| AEM Guides + AEM Assets | `aemguides-aemassets` | native | XN04 | Topics and topic elements publish as Content Fragments on models created in AEM Assets |
| AEM Guides + Edge Delivery Services | `aemguides-eds` | native | XN05, XN06, XN07 | Edge Delivery Service output preset publishes DITA maps to an Edge Delivery site through a GitHub or GitLab publish profile |
| AEM Guides + Workfront | `aemguides-workfront` | native | XN08, XN09 | Guides creates and tracks authoring, review, publishing and translation tasks as Workfront tasks |
| AEM Guides + Coworker | `aemguides-cw` | native | XN22, XN23 | AI Assistant in Guides runs in Agentic mode on Coworker, with Import, Create and Smart tagging skills |
| Acrobat Sign + AEM Forms | `acrobatsign-aemforms` | native | XN10 | Acrobat Sign cloud configuration in AEM Forms sends form documents for signature, from a workflow step or a sign-enabled form |
| Acrobat Sign + Workfront | `acrobatsign-workfront` | extension | XN11, XN12 | Workfront Fusion modules create Acrobat Sign agreements from Workfront work and act on agreement events |
| Acrobat Sign + Marketo Engage | `acrobatsign-marketo` | partner | XN13, XN14 | Agreement data reaches Marketo Engage through the CRM sync, for reminder and notification campaigns |
| Acrobat and Acrobat Services + Acrobat Sign | `acrobat-acrobatsign` | native | XN15, XN16, XN17 | Request e-signatures in Acrobat sends through Acrobat Sign, and forms authored in Acrobat become Acrobat Sign fields |
| Acrobat and Acrobat Services + Workfront | `acrobat-workfront` | extension | XN18 | Workfront Fusion's Adobe PDF Services modules generate, convert, combine and read PDFs inside a scenario |
| Acrobat and Acrobat Services + AEM Sites | `acrobat-aemsites` | native | XN19 | PDF Viewer Core Component embeds PDFs on AEM Sites pages through the PDF Embed API |
| Acrobat and Acrobat Services + Adobe Express | `acrobat-express` | native | XN20 | Adobe Express design tools open from Acrobat's Edit menu, switched per user group in the product profile |
| Acrobat and Acrobat Services + Adobe Analytics | `acrobat-aa` | native | XN21 | The PDF Embed API viewer sends PDF viewing events to an Adobe Analytics report suite |

No product in this scope is itself under an early or limited label, and none has an announced end of life. The lifecycle points sit one level down and are raised under "Lifecycle questions for Adam".

## How this was researched

- Started from this morning's map-level pass (`../aem_documents.json`) and its downloaded copies of the documentation (528 AEM Guides pages, 544 Acrobat Sign help pages, 120 Acrobat Sign tutorial pages, 480 Acrobat help pages, 50 Acrobat Services tutorial pages, 269 AEM Forms pages), which were searched by script to find the setup, prerequisite and availability sentences. Every page cited was then downloaded again for the quote check.
- Sources: experienceleague.adobe.com (AEM Guides guide, Workfront Fusion, AEM Core Components, AEM Forms, Acrobat Sign and Acrobat Services tutorials), helpx.adobe.com (Acrobat Sign help, Acrobat help, the enterprise admin guide) and developer.adobe.com (Acrobat Services).
- Every page was downloaded with `curl -sS -L -m 45` into a fresh folder, tags stripped and spacing collapsed, and each quote matched word for word with `../wave1/verify_wave1.py` run on `documents.json` as it is.
- **Quote check: 167 quotes in `documents.json`, plus 48 more quotes used only in this trail, on 94 pages in all, every one found, none unverified.** A made-up quote was run through the same check to confirm it fails (it did: 1 not found).
- Service ids (GD, AB, SG, XN) and connection ids were checked by script against `sow/canvas/catalog.json` and every JSON under `sow/canvas/research/`: no repeats.
- Voice checks run by script on every card field, with the patterns from `sow/qa/check_product_copy.py`: no lifecycle label or forecast, no date or dated version number, no "the client", "clients" or bare "your", no prerequisite that opens with or follows a colon with "confirm", a `sow_prereq` wherever a prerequisite carries a restriction or tells the partner to confirm with Adobe, the client-voice fields free of partner words and of the letters "prove it", no em or en dashes in either file.
- www.adobe.com answered with real pages when tried once (the Acrobat Sign business page and the Acrobat Customization Wizard guide). They were read for context only; no quote in `documents.json` rests on that host, because the checker counts it as a host it cannot read. business.adobe.com did not answer (see "Pages not read").

## Lifecycle questions for Adam

1. **AEM Guides: is the AI Assistant, and with it the Coworker connection, under a beta label?** The feature pages carry no badge, and the release notes that added the Coworker skills carry none. But Adobe's generative AI disclosure page for Guides (updated Nov 3 2026) still says: "By using the AI Assistant, You hereby acknowledge that the use of Beta is provided "as is" without warranty of any kind." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/ai-assistant-aem/adobe-generative-ai-disclosures) The release note that introduced the assistant titled it "AI Assistant (Beta) with smart authoring and help features for enhanced productivity" (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/release-info/release-notes/cloud-release-notes/2025-releases/2502-release/whats-new-2025-02-0). And Agentic mode, the part that runs on Coworker, is switched on by Adobe on request: "To use AI Assistant in Agentic mode, your organization needs to be onboarded to Adobe CX Enterprise Coworker and have available credits; once onboarded, contact your Customer Success team to enable the feature." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/ai-assistant-aem/ai-assistant) **What was done:** the Standard-mode assistant has no line (see "Left out"). The Coworker connection (`aemguides-cw`, XN22 and XN23) is written in full and marked as held for this answer. **Recommendation:** keep the Coworker connection, with "Adobe confirms that Agentic mode is enabled" as a condition in the statement of work, because the pages that describe the feature and the two release notes that added the Coworker skills carry no label, and the card says nothing about a label; drop it (one entry) if Adam reads the disclosure page as deciding the matter.
2. **Acrobat Sign: the Microsoft Power Automate experience inside Acrobat Sign has an announced end.** "In January 2027, the embedded Power Automate experience within Acrobat Sign is being discontinued." (https://helpx.adobe.com/sign/web/advanced-users/power-automate-workflows/power-automate-embedded-integration-retirement-in-2027.html) Adobe adds: "For the majority of customers, Power Automate workflows created through the embedded Power Automate experience within Acrobat Sign will continue to function without interruption and will remain accessible through the Microsoft Power Automate interface." (https://helpx.adobe.com/sign/web/advanced-users/power-automate-workflows/power-automate-embedded-integration-retirement-in-2027.html) **Recommendation (done):** no service rests on it. SG11 covers the Microsoft 365 add-ins for Teams, Outlook, Word and PowerPoint only.
3. **AEM Guides comes in two versions.** "It comes in two flavors - on-prem and cloud service." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/about-aemg/intro) **Recommendation (done):** one box, written for the Cloud Service, where Guides is an add-on selected in Cloud Manager. On-premise (AEM 6.5) is named in the notes as not covered.
4. **Acrobat is sold under several plan names, and the APIs under another name.** The app plans in the help are Acrobat Studio, Premium, Pro and Standard: "IT admins can manage access to Acrobat Studio using assignment rules in the Adobe Admin Console, similar to assigning Acrobat Premium, Pro, or Standard licenses." (https://helpx.adobe.com/acrobat/desktop/use-acrobat-ai/set-up-acrobat-generative-ai/acrobat-studio-enterprise.html) The APIs are Acrobat Services: "Adobe Acrobat Services has five main APIs: the Adobe PDF Services API, the Adobe PDF Embed API, the Adobe Document Generation API, the Adobe PDF Extract API and Adobe PDF Accessibility Auto-Tag API." (https://developer.adobe.com/document-services/docs/overview/) Experience Manager pages call the same thing Document Services APIs. **Recommendation (done):** one box named "Acrobat and Acrobat Services", titled "Adobe Acrobat for enterprise and the Adobe Acrobat Services APIs", with no plan name in a service name.
5. **Acrobat Sign has three plans with different features, and two older names still on Adobe's pages.** Adobe states availability beside each feature, for example for custom send workflows: "Acrobat Standard and Acrobat Pro: Not Supported" (https://helpx.adobe.com/sign/web/advanced-users/custom-workflows/overview.html). AEM Forms and Workfront Fusion pages still say Adobe Sign. **Recommendation (done):** product name "Acrobat Sign", title "Adobe Acrobat Sign Solutions"; every line assumes the Solutions plan, and the `acrobat-acrobatsign` connection explains what the Acrobat plans include.
6. **Features under a label, left out:** in AEM Guides the new map collection and the review sync with the AEM Inbox ("This feature is currently available as a Beta feature and is disabled by default." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/release-info/release-notes/cloud-release-notes/2026-releases/2606-release/whats-new-2026-06-0)), the new baseline experience, template presets and the MCP server (all enabled by Adobe on request); in Acrobat the Adobe Express AI Assistant ("Adobe Express AI Assistant is in beta and uses partner (non-Adobe) models to help generate content." (https://helpx.adobe.com/acrobat/desktop/edit-documents/enhance-pdfs-with-adobe-express/design-express-acrobat.html)); from AEM Forms, document expiration for agreements (Early Adopter Program). Acrobat's what's new page also says "We're rolling out some features in phases." (https://helpx.adobe.com/acrobat/desktop/whats-new/whats-new-acrobat-desktop.html) No line names a feature from that page.

## Product: AEM Guides (`aemguides`)

**Title:** Adobe Experience Manager Guides as a Cloud Service. **What:** A component content management system inside Experience Manager for structured (DITA) product and technical documentation: web-based authoring, review, translation and publishing from one source to AEM Sites pages, PDF, HTML5, knowledge bases and other formats. Source: https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/about-aemg/intro

**Notes:** These lines assume AEM Guides as a Cloud Service, which Adobe provides as an add-on selected in Cloud Manager on a program with AEM Assets. Adobe also ships Guides for AEM 6.5 on-premise, where installation and several settings differ; these lines do not cover it. Content must be DITA: existing Word, InDesign, XHTML or FrameMaker documents are converted, and conversion works only on well structured source files, so GD03 is the line that varies most. The AI Assistant, the new map collection, the new baseline experience and the review sync with the AEM Inbox are not services here (see left_out). Publishing to AEM Sites, Edge Delivery Services, Content Fragments and Experience Fragments, and the Workfront task integration, are connections, not product lines. Knowledge base targets outside Adobe (Salesforce, ServiceNow) and learning systems are product lines with an ext. Hours are our own estimates for a mid-market client; Adobe publishes none.

### Prerequisites

- An AEM as a Cloud Service program with AEM Assets, where Guides is selected as an add-on in Cloud Manager
  - Quote: "Starting 2024.2.0 release, Experience Manager Guides is only available as an automated add-on for Experience Manager as a Cloud Service." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/deploy-conf-aemg-cs/conf-deployment-dispatcher-cs)
- Users placed in the Authors, Reviewers and Publishers groups that Guides creates
  - Quote: "AEM Guides provides three out-of-the-box groups. These groups are: Authors, Reviewers, and Publishers." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/user-group-sec-cs/user-admin-sec)
- Content in DITA, or well structured source documents that can be converted to DITA
  - Quote: "To be able to convert a Word document successfully, your document should be well structured." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/migrate-content-cs/non-dita-content)
- An IMS configuration from the Adobe Developer Console for the cloud publishing service
  - Quote: "As the cloud publishing service is secured by Adobe IMS OAuth-based authentication, perform the following steps to integrate their environments with Adobe's secure token-based authentication workflows and start using the cloud-based scalable publishing solution." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/knowledge-base/kb-articles/publishing/configure-microservices-imt-config)
- A translation service provider connected to AEM where content is translated by people
  - Quote: "To automate translation workflows, you integrate translation service providers with AEM and create projects for translating content into multiple languages." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/aemg-integrations/conf-translation)

### Tiers

- **AEM Guides as a Cloud Service:** The version these lines assume: an add-on that Cloud Manager provisions on a program once Guides is selected under AEM Assets.
  - Quote: "It comes in two flavors - on-prem and cloud service." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/about-aemg/intro)
- **AEM Guides on-premise (AEM 6.5):** The other version Adobe ships. It is installed as packages on AEM 6.5 and configured in the web console; none of these lines is scoped for it.
  - Quote: "This guide provides the instructions to download, install, and configure AEM Guides for Cloud Service and On-Premise." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/introduction)

### Services

| id | Service | Unit | Low / base / high hours | Starting or optional | Also needs | Needs |
|---|---|---|---|---|---|---|
| GD01 | Guides enablement, users and groups | one-time | 16 / 32 / 56 | starting |  |  |
| GD02 | Folder profiles, authoring templates and document states | one-time | 32 / 56 / 104 | starting |  |  |
| GD03 | Content migration into DITA | one-time | 60 / 120 / 280 | starting |  |  |
| GD04 | PDF templates and output presets | one-time | 40 / 80 / 160 | starting |  |  |
| GD05 | Review workflow and baselines | one-time | 24 / 40 / 72 | starting |  |  |
| GD06 | Translation setup with a translation provider | one-time | 24 / 48 / 96 | optional | a translation service provider |  |
| GD07 | Knowledge base publishing to Salesforce or ServiceNow | one-time | 24 / 40 / 80 | optional | Salesforce Knowledge or ServiceNow |  |
| GD08 | Learning and training courses | one-time | 32 / 56 / 104 | optional | a learning system that accepts SCORM packages |  |
| GD09 | Training for authors, reviewers and publishers | one-time | 24 / 40 / 72 | starting |  |  |
| GD10 | Monthly publishing and content health support | monthly | 16 / 24 / 40 | starting |  |  |

- **GD01 Guides enablement, users and groups** (starting): one-time, 16 / 32 / 56 hours. Select the Guides add-on on your client's Cloud Manager program, run the pipeline for each environment, check the installation, and place users in the Authors, Reviewers and Publishers groups with the folder permissions each team needs.
  - Quote: "To install Experience Manager Guides on any environment under the integrated program, you must run the pipeline associated with the environment." (Experience League: Deployment and dispatcher configuration (AEM Guides), https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/deploy-conf-aemg-cs/conf-deployment-dispatcher-cs)
- **GD02 Folder profiles, authoring templates and document states** (starting): one-time, 32 / 56 / 104 hours. Set up global and folder-level profiles for your client's products or departments: topic and map templates, conditional attributes, editor settings, and the document states a topic moves through from draft to published.
  - Quote: "AEM Guides allows you to configure authoring (topic or map) templates, output templates, conditional attribute, and Editor configurations at an enterprise (global) level as well as at a folder level." (Experience League: Configure global or folder-level profiles, https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/global-folder-profiles/conf-profiles)
- **GD03 Content migration into DITA** (starting): one-time, 60 / 120 / 280 hours. Upload your client's existing DITA content and convert Word, InDesign, XHTML or unstructured FrameMaker documents to DITA: prepare the source files and the style-to-tag mapping, run the conversions in batches, and correct the topics and maps that result.
  - Quote: "AEM Guides allows you to convert a variety of structured and unstructured documents into DITA format." (Experience League: Migrate existing content (AEM Guides), https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/migrate-content-cs/migrate-content)
- **GD04 PDF templates and output presets** (starting): one-time, 40 / 80 / 160 hours. Build your client's Native PDF templates (page layouts, stylesheets, table of contents, headers and footers) and the output presets for PDF and HTML5 with their conditions and variables, and set up the credentials the cloud publishing service needs.
  - Quote: "With the native PDF publishing, you can use predefined templates to ensure consistency in content layout and structure, apply stylesheets to alter the look-and-feel of your output, optimize PDF, set printer marks, allow screen reader support, set PDF conformance, embed fonts, and much more." (Experience League: Native PDF output preset, https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/output-presets-aemg/pdf-preset/native-pdf-web-editor)
- **GD05 Review workflow and baselines** (starting): one-time, 24 / 40 / 72 hours. Set up how your client's topics are reviewed and released: who starts review tasks, how document states change, the notification steps in the review workflow, and baselines that fix the topic versions a release publishes or translates.
  - Quote: "Experience Manager Guides provides the Baseline feature that allows the users to create baselines and use them to publish or translate topics of different versions." (Experience League: Work with Baseline from the Map dashboard, https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/work-with-baseline/generate-output-use-baseline-for-publishing)
- **GD06 Translation setup with a translation provider** (optional; also needs a translation service provider): one-time, 24 / 48 / 96 hours. Connect your client's translation provider to AEM, create the translation configurations and language folders, and run the first translation project for a map, including how changed topics are sent again.
  - Quote: "To automate translation workflows, you integrate translation service providers with AEM and create projects for translating content into multiple languages." (Experience League: Translate content (AEM Guides configuration), https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/aemg-integrations/conf-translation)
- **GD07 Knowledge base publishing to Salesforce or ServiceNow** (optional; also needs Salesforce Knowledge or ServiceNow): one-time, 24 / 40 / 80 hours. Create the publish profile for your client's Salesforce or ServiceNow knowledge base, build the Knowledge Base output preset with its article settings and conditions, and publish and check the first articles.
  - Quote: "The available options are; Adobe Experience Manager, Salesforce, and ServiceNow." (Experience League: Knowledge Base output preset, https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/output-presets-aemg/generate-output-knowledge-base)
- **GD08 Learning and training courses** (optional; also needs a learning system that accepts SCORM packages): one-time, 32 / 56 / 104 hours. Set up the course templates and settings for learning content, build your client's first course with quizzes, and publish it as a SCORM package and PDF for your client's learning system.
  - Quote: "You can create courses using templates, add interactive elements (such as accordions, carousels, multimedia, and more), add quizzes using different question types or through a Question bank, and publish the course in supported output formats." (Experience League: Overview of the Product Training and Learning content, https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/learning-training-content/get-started/intro-lc/intro)
- **GD09 Training for authors, reviewers and publishers** (starting): one-time, 24 / 40 / 72 hours. Train your client's team by role: authors on the editor, content reuse and conditions, reviewers on review tasks and comments, publishers on presets, baselines and output generation, with a handover guide.
  - Quote: "Depending upon the group a user is associated with, they are allowed to perform specific tasks." (Experience League: User administration and security (AEM Guides), https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/user-group-sec-cs/user-admin-sec)
- **GD10 Monthly publishing and content health support** (starting): monthly, 16 / 24 / 40 hours. Each month, generate and check your client's releases, run the map and content reuse reports and fix broken links, adjust presets and templates, and test new Guides releases before authors use them.
  - Quote: "Adobe Experience Manager Guides provides a few reports that give a useful insight into the overall health of the content in your repository and how content is being used in the documentation process." (Experience League: Introduction to reports (AEM Guides), https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/reports-aem-guide/reports-intro)

## Product: Acrobat and Acrobat Services (`acrobat`)

**Title:** Adobe Acrobat for enterprise and the Adobe Acrobat Services APIs. **What:** Adobe's PDF products for business, as one box: the Acrobat apps for creating, editing, protecting and signing PDFs, licensed and deployed through the Admin Console, and Acrobat Services, cloud APIs that create, convert, generate, extract, tag, seal and embed PDFs inside your client's own applications. Source: https://developer.adobe.com/document-services/docs/overview/

**Notes:** Two things share this box and should not be mixed up. Lines AB01 to AB03 and AB11 are the Acrobat apps, which Adobe sells as enterprise plans (Acrobat Studio, Premium, Pro and Standard) assigned to named users in the Admin Console; this is mostly IT work with a small partner share. Lines AB04 to AB10 and AB12 are Acrobat Services, the developer APIs, where most partner work sits. Adobe's developer pages still say Document Services in places, and Experience Manager pages say Document Services APIs or Document Cloud PDF Viewer, not Acrobat. The PDF Embed API is a free offering that needs only a client ID; the PDF Services API is measured in Document Transactions, and Document Generation, PDF Extract, Accessibility Auto-Tag and Electronic Seal come with it. The APIs process documents in the United States unless the Europe region is configured, and credentials stay on a server. A client that already has the AEM Forms Communications APIs (AF12 to AF15) generates documents there from XDP templates; AB05 is the Word-template route and the two should not both be sold for the same documents. Hours are our own estimates for a mid-market client; Adobe publishes none.

### Prerequisites

- Named user licenses for Acrobat, assigned through product profiles in the Admin Console
  - Quote: "Each license is assigned to a single user." (https://helpx.adobe.com/acrobat/desktop/use-acrobat-ai/set-up-acrobat-generative-ai/acrobat-studio-enterprise.html)
- For AI Assistant: its license in the same Admin Console as the Acrobat license
  - Quote: "Both the Acrobat license and the AI Assistant license must appear in the same Admin Console to assign them to users." (https://helpx.adobe.com/acrobat/desktop/use-acrobat-ai/set-up-acrobat-generative-ai/acrobat-studio-enterprise.html)
- For the APIs: credentials kept on a server, never sent to end user devices
  - Quote: "SDK credentials should not be sent to untrusted environments or end user devices." (https://developer.adobe.com/document-services/docs/overview/pdf-services-api/)
- For API volumes above the free allowance: paid credentials under a separate written agreement with Adobe
  - Quote: "Paid credentials enable a greater processing quota and require entering into a separate written agreement." (https://developer.adobe.com/document-services/docs/overview/limits/)
- For the PDF Embed API: a client ID registered for the website domain it is used on
  - Quote: "If the client ID is incorrect or you are using it on a domain other than the one you registered, then the PDF preview is blocked with an error message." (https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/gettingstarted/)
- For document processing outside the United States: the Europe region, available once PDF Services API is purchased
  - Quote: "Adobe PDF Services APIs use United States as a default region to process all the documents." (https://developer.adobe.com/document-services/docs/overview/pdf-services-api/howtos/service-region-configuration-for-apis)

### Tiers

- **Acrobat plans for enterprise:** Acrobat Studio, Premium, Pro and Standard, assigned as named user licenses. Acrobat Studio adds AI Assistant, PDF Spaces and Adobe Express. Lines AB01, AB02 and AB11 apply to any of them; AB03 needs a plan with AI Assistant.
  - Quote: "Acrobat Studio combines Acrobat Pro, PDF tools, Acrobat AI Assistant, PDF Spaces, and new creation capabilities powered by Adobe Express." (https://helpx.adobe.com/acrobat/desktop/use-acrobat-ai/set-up-acrobat-generative-ai/acrobat-studio-enterprise.html)
- **PDF Services API:** The paid API offering. It includes Document Generation, PDF Extract, Accessibility Auto-Tag and Electronic Seal, and is measured in Document Transactions. Lines AB04, AB05, AB07 to AB10 and AB12 need it.
  - Quote: "The latter two APIs and their SDKs are bundled into Adobe PDF Services API as part of a paid offering." (https://developer.adobe.com/document-services/docs/overview/)
- **PDF Embed API:** The viewer for web pages. Adobe offers it free; it needs a client ID for each domain. Line AB06 and the AEM Sites connection use it.
  - Quote: "PDF Embed API is a free offering." (https://developer.adobe.com/document-services/docs/overview/)

### Services

| id | Service | Unit | Low / base / high hours | Starting or optional | Also needs | Needs |
|---|---|---|---|---|---|---|
| AB01 | Licenses, product profiles and sign-in | one-time | 16 / 24 / 48 | starting |  |  |
| AB02 | Deployment packages and configured settings | one-time | 16 / 32 / 64 | starting |  |  |
| AB03 | AI Assistant and PDF Spaces rollout | one-time | 16 / 24 / 48 | optional |  | an Acrobat plan with AI Assistant |
| AB04 | PDF Services API document automation | one-time | 40 / 80 / 160 | optional |  | PDF Services API |
| AB05 | Document generation from Word templates | one-time | 32 / 64 / 120 | optional |  | PDF Services API |
| AB06 | PDF viewer embedded in your client's site | one-time | 16 / 32 / 64 | optional |  |  |
| AB07 | Content extraction from PDFs | one-time | 32 / 56 / 104 | optional |  | PDF Services API |
| AB08 | PDF accessibility tagging at scale | one-time | 24 / 48 / 96 | optional |  | PDF Services API |
| AB09 | Electronic seals on issued documents | one-time | 16 / 32 / 64 | optional | a trust service provider that hosts the certificate | PDF Services API |
| AB10 | PDF Services in Microsoft Power Automate flows | one-time | 16 / 32 / 56 | optional | Microsoft Power Automate with premium connectors | PDF Services API |
| AB11 | Training for users and administrators | one-time | 16 / 24 / 40 | starting |  |  |
| AB12 | Monthly document automation upkeep | monthly | 8 / 16 / 32 | optional |  | PDF Services API |

- **AB01 Licenses, product profiles and sign-in** (starting): one-time, 16 / 24 / 48 hours. Set up your client's Acrobat licensing in the Admin Console: the identity type and single sign-on, product profiles by team with the services each one gets, automatic assignment rules, and users added in bulk.
  - Quote: "Admins can customize the Product Profiles for Acrobat Premium for enterprise, Acrobat Studio for enterprise, and Acrobat Reader Premium for enterprise." (Adobe Help: Administer Acrobat Studio for enterprise, https://helpx.adobe.com/acrobat/desktop/use-acrobat-ai/set-up-acrobat-generative-ai/acrobat-studio-enterprise.html)
- **AB02 Deployment packages and configured settings** (starting): one-time, 16 / 32 / 64 hours. Build Acrobat packages in the Admin Console for each platform your client runs, set features and preferences with the Acrobat Customization Wizard before rollout, and agree with your client's IT team how updates are run.
  - Quote: "After downloading the package, use the Acrobat Customization Wizard to configure Acrobat features and preferences before organization-wide deployment." (Adobe Help: Create Acrobat-only deployment packages, https://helpx.adobe.com/enterprise/using/deploying-acrobat.html)
- **AB03 AI Assistant and PDF Spaces rollout** (optional; needs an Acrobat plan with AI Assistant): one-time, 16 / 24 / 48 hours. Decide with your client which teams get the generative AI features, assign the licenses and product profile services, turn features off where your client's policy requires, and train teams on summaries, questions with citations and shared PDF Spaces.
  - Quote: "AI Assistant requires a Named User license of Acrobat because the feature relies on cloud-based services linked to a user's identity." (Adobe Help: Administer Acrobat Studio for enterprise, https://helpx.adobe.com/acrobat/desktop/use-acrobat-ai/set-up-acrobat-generative-ai/acrobat-studio-enterprise.html)
- **AB04 PDF Services API document automation** (optional; needs PDF Services API): one-time, 40 / 80 / 160 hours. Connect your client's application to the PDF Services API with server-side credentials and automate the document steps it needs, such as creating PDFs from Office files or HTML, text recognition, combining, compressing, protecting and exporting, with files read from and written to your client's own storage.
  - Quote: "The PDF Services API offers a number of operations to programmatically manipulate documents and automate many different types of document workflows." (Adobe Developer: Acrobat Services APIs introduction, https://developer.adobe.com/document-services/docs/overview/)
- **AB05 Document generation from Word templates** (optional; needs PDF Services API): one-time, 32 / 64 / 120 hours. Build your client's contract, invoice or letter templates in Microsoft Word with template tags for text, tables, images and conditions, define the JSON data each one merges, and connect the Document Generation API so documents are produced from your client's system.
  - Quote: "Document Generation API accepts a document template (with template tags) along with the input data to generate the final document." (Adobe Developer: Document Generation API overview, https://developer.adobe.com/document-services/docs/overview/document-generation-api/)
- **AB06 PDF viewer embedded in your client's site** (optional): one-time, 16 / 32 / 64 hours. Embed PDFs in your client's web pages or app with the PDF Embed API: a client ID for each domain, the embed mode, the tools visitors see, and viewer events passed to your client's analytics.
  - Quote: "Adobe PDF Embed API allows you to embed a PDF viewer in your web applications with only a few lines of code." (Adobe Developer: PDF Embed API overview, https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/)
- **AB07 Content extraction from PDFs** (optional; needs PDF Services API): one-time, 32 / 56 / 104 hours. Build the pipeline that sends your client's PDFs, native or scanned, to the PDF Extract API and loads the text, tables and figures it returns, as structured JSON or Markdown, into your client's search, data or AI systems.
  - Quote: "The JSON output captures document structure information, such as the natural reading order of the various extracted elements and the layout of the elements on each given page." (Adobe Developer: PDF Extract API overview, https://developer.adobe.com/document-services/docs/overview/pdf-extract-api/)
- **AB08 PDF accessibility tagging at scale** (optional; needs PDF Services API): one-time, 24 / 48 / 96 hours. Run your client's backlog of untagged PDFs through the Accessibility Auto-Tag API, read the tagging reports, and correct in Acrobat what tagging alone does not settle, such as alt text, complex tables, titles and reading order.
  - Quote: "Automatic tagging is a good first step on a document's journey to full accessibility." (Adobe Developer: PDF Accessibility Auto-Tag API overview, https://developer.adobe.com/document-services/docs/overview/pdf-accessibility-auto-tag-api/)
- **AB09 Electronic seals on issued documents** (optional; also needs a trust service provider that hosts the certificate; needs PDF Services API): one-time, 16 / 32 / 64 hours. Apply your client's organizational seal to invoices, statements and other official PDFs with the PDF Electronic Seal API, using a certificate hosted by a trust service provider that follows the Cloud Signature Consortium standard, with the seal's appearance set for each document type.
  - Quote: "These digital certificates are issued by a CSC compliant Trust Service Provider (TSP)." (Adobe Developer: PDF Electronic Seal API overview, https://developer.adobe.com/document-services/docs/overview/pdf-electronic-seal-api/)
- **AB10 PDF Services in Microsoft Power Automate flows** (optional; also needs Microsoft Power Automate with premium connectors; needs PDF Services API): one-time, 16 / 32 / 56 hours. Set up the Adobe PDF Services connector in your client's Microsoft Power Automate with its credentials, and build the flows that convert, combine, protect or generate documents on files in OneDrive, SharePoint or another storage connector.
  - Quote: "Adobe PDF Services connector, as part of Adobe Acrobat Services, allows users to perform any of the actions available in Adobe PDF Services API within Microsoft Power Automate." (Experience League: Getting credentials for Microsoft Power Automate (Acrobat Services tutorial), https://experienceleague.adobe.com/en/docs/acrobat-services-learn/tutorials/pdfservices/getting-credentials-power-automate)
- **AB11 Training for users and administrators** (starting): one-time, 16 / 24 / 40 hours. Train your client's teams on the Acrobat tasks that matter to them, such as editing, combining, protecting, redacting and requesting signatures, and administrators on licenses, packages and updates, with a handover guide.
  - Quote: "Learn about Acrobat Studio for enterprise and how admins manage licensing, access, and security." (Adobe Help: Administer Acrobat Studio for enterprise, https://helpx.adobe.com/acrobat/desktop/use-acrobat-ai/set-up-acrobat-generative-ai/acrobat-studio-enterprise.html)
- **AB12 Monthly document automation upkeep** (optional; needs PDF Services API): monthly, 8 / 16 / 32 hours. Each month, review Document Transaction usage against your client's allowance, fix failed jobs, and update templates and flows as your client's documents change.
  - Quote: "Adobe PDF Services API licensing is measured per Document Transaction which is based on the initial endpoint request (i.e., API call) and the digital output, with each operation in the table described below." (Adobe Developer: Licensing and usage limits (PDF Services API), https://developer.adobe.com/document-services/docs/overview/limits/)

## Product: Acrobat Sign (`acrobatsign`)

**Title:** Adobe Acrobat Sign Solutions. **What:** Adobe's e-signature service: send documents for signature, collect electronic and digital signatures, and track every agreement with an audit report. The Acrobat Sign Solutions plan adds groups, configurable templates, custom send workflows, bulk sending from a file, the API and connectors for other business systems. Source: https://helpx.adobe.com/sign/web/administers/admin-guide.html

**Notes:** These lines assume an Acrobat Sign Solutions account. Adobe's help states availability feature by feature for three plans: Acrobat Standard and Acrobat Pro (e-signing inside Acrobat, with several features not supported or not configurable), Acrobat Sign Solutions, and Acrobat Sign for Government, a separate environment. Check each line against Adobe's availability note where your client is on the government environment. Premium identity checks such as knowledge-based authentication are purchased separately, and a provider on the Digital Identity Gateway needs its own contract (SG07). API access is reserved for enterprise and developer tier accounts (SG09). Adobe's help documents connectors to systems outside Adobe only; those that matter most are product lines with an ext (SG10 to SG12). The connections to Adobe products are documented on the other product's side (AEM Forms, Workfront Fusion, Acrobat) or in tutorials (Marketo Engage). The Microsoft Power Automate experience inside Acrobat Sign is not a service here (see left_out). Hours are our own estimates for a mid-market client; Adobe publishes none.

### Prerequisites

- An Acrobat Sign Solutions account; Acrobat Standard and Acrobat Pro leave custom send workflows unsupported and templates not configurable
  - Quote: "Acrobat Standard and Acrobat Pro: Not Supported" (https://helpx.adobe.com/sign/web/advanced-users/custom-workflows/overview.html)
- The account entitled through the Adobe Admin Console, for single sign-on and automatic user creation
  - Quote: "The Acrobat Sign account must be entitled through the Adobe Admin Console." (https://helpx.adobe.com/sign/web/administers/user-provisioning/authenticate-with-admin-console-sso.html)
- An enterprise or developer tier account for API access
  - Quote: "API access is reserved exclusively for enterprise and developer tier accounts." (https://helpx.adobe.com/sign/web/developers/rest-apis/api.html)
- Purchased transactions for premium identity checks such as knowledge-based authentication
  - Quote: "Transactions must be purchased through your Adobe sales representative." (https://helpx.adobe.com/sign/web/settings-configuration/send-settings/knowledge-based-auth.html)
- For a sandbox: an enterprise account with a success manager, and a separate entitlement
  - Quote: "The Sandbox environment is a separately entitled pay-for-access environment." (https://helpx.adobe.com/sign/web/developers/sandbox/overview.html)

### Tiers

- **Acrobat Sign Solutions:** The plan these lines assume. Custom send workflows, bulk sending from a CSV file and configurable templates are supported on it.
  - Quote: "Acrobat Sign Solutions: Manual input supported; CSV import supported" (https://helpx.adobe.com/sign/web/advanced-users/send-in-bulk/overview.html)
- **Acrobat Sign for Government:** A separate environment for government customers. Adobe states its availability beside each feature, and some features and templates exist only there or only outside it.
  - Quote: "Certain templates are only available in Adobe Acrobat Sign for Government to support federal forms modernization." (https://helpx.adobe.com/sign/web/advanced-users/reusable-templates/adobe-sign-library-templates.html)
- **Acrobat Standard and Acrobat Pro:** The Acrobat plans include e-signing, with templates enabled but not configurable and custom send workflows not supported. See the acrobat-acrobatsign connection.
  - Quote: "Acrobat Standard and Acrobat Pro: Enabled by default. Not configurable." (https://helpx.adobe.com/sign/web/advanced-users/reusable-templates/create-template.html)

### Services

| id | Service | Unit | Low / base / high hours | Starting or optional | Also needs | Needs |
|---|---|---|---|---|---|---|
| SG01 | Account, users, groups and sign-in | one-time | 16 / 32 / 56 | starting |  |  |
| SG02 | Account settings, branding and security | one-time | 16 / 32 / 64 | starting |  |  |
| SG03 | Library templates and form fields | one-time | 24 / 48 / 96 | starting |  |  |
| SG04 | Custom send workflows | one-time | 16 / 32 / 64 | starting |  |  |
| SG05 | Web forms on your client's site | one-time | 16 / 24 / 48 | optional |  |  |
| SG06 | Bulk sending from a recipient list | one-time | 8 / 16 / 32 | optional |  |  |
| SG07 | Signer identity checks and digital signatures | one-time | 16 / 32 / 64 | optional | a digital identity provider, where one is used |  |
| SG08 | Retention rules and audit records | one-time | 8 / 16 / 32 | optional |  |  |
| SG09 | API and webhook integration with your client's systems | one-time | 40 / 80 / 160 | optional |  | an enterprise or developer tier account |
| SG10 | Acrobat Sign for Salesforce | one-time | 24 / 48 / 96 | optional | Salesforce |  |
| SG11 | Acrobat Sign for Microsoft 365 and Teams | one-time | 16 / 24 / 48 | optional | Microsoft 365 |  |
| SG12 | Acrobat Sign for Workday | one-time | 24 / 48 / 88 | optional | Workday |  |
| SG13 | Training for senders, template authors and administrators | one-time | 16 / 24 / 48 | starting |  |  |
| SG14 | Monthly agreement reporting and template upkeep | monthly | 8 / 12 / 24 | starting |  |  |

- **SG01 Account, users, groups and sign-in** (starting): one-time, 16 / 32 / 56 hours. Set up your client's account structure: groups for each business unit with their own settings, branding and templates, account and group administrators, users and their report access, and sign-in through the Adobe Admin Console with single sign-on.
  - Quote: "Groups allow administrators to segment configuration within Adobe Acrobat Sign so different teams, processes, compliance requirements, or reporting structures can operate with their own settings, branding, and document access." (Adobe Help: Manage Groups in Adobe Acrobat Sign, https://helpx.adobe.com/sign/web/administers/group-management/groups.html)
- **SG02 Account settings, branding and security** (starting): one-time, 16 / 32 / 64 hours. Configure the account and group settings your client's policies call for: company name, logo and email branding, signature preferences, send settings, security settings and the external archive that receives a copy of every signed agreement.
  - Quote: "This article provides an overview of the core features of branding, security settings, users, and templates to get you up and running." (Adobe Help: Set up your Acrobat Sign company account, https://helpx.adobe.com/sign/web/administers/admin-guide.html)
- **SG03 Library templates and form fields** (starting): one-time, 24 / 48 / 96 hours. Turn your client's most used agreements into library templates with signature, date and data fields for each signer, built in the authoring environment or with text tags, and set who may use and edit each one.
  - Quote: "Library templates let users create reusable, interactive documents." (Adobe Help: Create a library template (Acrobat Sign), https://helpx.adobe.com/sign/web/advanced-users/reusable-templates/create-template.html)
- **SG04 Custom send workflows** (starting): one-time, 16 / 32 / 64 hours. Build workflow templates in the Custom Workflow Designer for your client's regular agreement types: recipients and routing, the documents and fields included, email copies, expiration and passwords, with instructions for senders.
  - Quote: "Use the Custom Workflow Designer to create custom Compose pages designed to support your documents, policies, and compliance requirements." (Adobe Help: Custom Workflow Designer overview (Acrobat Sign), https://helpx.adobe.com/sign/web/advanced-users/custom-workflows/overview.html)
- **SG05 Web forms on your client's site** (optional): one-time, 16 / 24 / 48 hours. Create signable web forms for agreements people start themselves, with participants, counter-signers and signer authentication, and embed them on your client's website or share them as links.
  - Quote: "A signable web form can be created to embed on your website (or sent as a web link), allowing multiple people to easily access your form or document and create an agreement." (Adobe Help: Create a web form (Acrobat Sign), https://helpx.adobe.com/sign/web/advanced-users/webforms/create.html)
- **SG06 Bulk sending from a recipient list** (optional): one-time, 8 / 16 / 32 hours. Set up Send in Bulk for agreements that go to many people at once: the parent template, the CSV file with recipients and merge fields, and how your client's team tracks the agreements it creates.
  - Quote: "The Send in Bulk (SiB) feature allows users to create a one-use "parent" template of an agreement and supply a list of recipients." (Adobe Help: Overview of Send in Bulk (Acrobat Sign), https://helpx.adobe.com/sign/web/advanced-users/send-in-bulk/overview.html)
- **SG07 Signer identity checks and digital signatures** (optional; also needs a digital identity provider, where one is used): one-time, 16 / 32 / 64 hours. Choose the identity check for each kind of agreement your client sends, such as Acrobat Sign authentication, a phone or knowledge-based check or a provider on the Digital Identity Gateway, set the defaults by group, and enable digital signatures where the law or your client's policy asks for them.
  - Quote: "The Adobe Acrobat Sign Digital Identity Gateway allows organizations to select from a wide variety of pre-configured third-party digital identity providers (IDP) and leverage the type of identity verification that best suits their functional, security, or compliance needs." (Adobe Help: Acrobat Sign Digital Identity Gateway, https://helpx.adobe.com/sign/web/settings-configuration/digital-identity/digital-identity-gateway.html)
- **SG08 Retention rules and audit records** (optional): one-time, 8 / 16 / 32 hours. Set data governance rules that delete agreements and their data after the retention period your client's records policy sets, and agree where signed copies and audit reports are kept before they are deleted.
  - Quote: "Data governance in Adobe Acrobat Sign allows administrators to automatically delete agreements and associated data from the Acrobat Sign systems after a defined retention period." (Adobe Help: Data governance overview (Acrobat Sign), https://helpx.adobe.com/sign/web/settings-configuration/data-governance/overview.html)
- **SG09 API and webhook integration with your client's systems** (optional; needs an enterprise or developer tier account): one-time, 40 / 80 / 160 hours. Connect your client's application to the Acrobat Sign REST API: the API application and OAuth, agreements sent from templates with your client's data, and webhooks that tell your client's system when an agreement is signed, so signed documents and field data return to it.
  - Quote: "When a subscribed event is triggered, Acrobat Sign constructs an HTTPS POST with a JSON body and delivers that to the URL specified." (Adobe Help: Acrobat Sign webhooks overview, https://helpx.adobe.com/sign/web/developers/webhooks/overview.html)
- **SG10 Acrobat Sign for Salesforce** (optional; also needs Salesforce): one-time, 24 / 48 / 96 hours. Install and configure the Acrobat Sign for Salesforce package in your client's Salesforce org: permission sets, agreement templates with data mappings and merge fields, and buttons that send for signature from a record.
  - Quote: "You can get the app from the AppExchange, and it supports various Salesforce editions: Professional, Enterprise, Unlimited, Developer, and Performance." (Adobe Help: Acrobat Sign for Salesforce installation guide, https://helpx.adobe.com/sign/web/integrations/acrobat-sign-for-salesforce/salesforce-installation-guide.html)
- **SG11 Acrobat Sign for Microsoft 365 and Teams** (optional; also needs Microsoft 365): one-time, 16 / 24 / 48 hours. Deploy the Acrobat Sign add-ins for Teams, Outlook, Word and PowerPoint from the Microsoft admin center, connect them to your client's Acrobat Sign account, and show teams how to send and track agreements from the apps they work in.
  - Quote: "Adobe Acrobat Sign for Microsoft 365 enables Microsoft Admins to deploy all three apps simultaneously through the Microsoft admin center or directly from the Microsoft AppSource." (Adobe Help: Adobe Acrobat Sign for Microsoft 365, https://helpx.adobe.com/sign/web/integrations/microsoft-office/microsoft-365.html)
- **SG12 Acrobat Sign for Workday** (optional; also needs Workday): one-time, 24 / 48 / 88 hours. Connect Acrobat Sign to your client's Workday tenant: the OAuth relationship, the business process steps that send documents for signature, and a service account for the Workday group.
  - Quote: "Adobe Acrobat Sign for Workday: Installation Guide explains how to integrate Adobe Acrobat Sign into your Workday client." (Adobe Help: Adobe Acrobat Sign for Workday installation guide, https://helpx.adobe.com/sign/web/integrations/workday/workday-installation-guide.html)
- **SG13 Training for senders, template authors and administrators** (starting): one-time, 16 / 24 / 48 hours. Train your client's team by role: senders on sending, tracking and reminders, template authors on fields, templates and workflows, administrators on users, groups, settings and reports, with a handover guide.
  - Quote: "These tutorials are designed for administrators who are past the installation phase, and are ready to start administering Acrobat Sign." (Experience League: Acrobat Sign tutorials, administrators overview, https://experienceleague.adobe.com/en/docs/document-cloud-learn/sign-learning-hub/admin-set-up/intro-admin-overview)
- **SG14 Monthly agreement reporting and template upkeep** (starting): monthly, 8 / 12 / 24 hours. Each month, run agreement reports on completion rates and time to sign, review which templates and workflows stall, update templates and settings, and manage users and groups.
  - Quote: "Run agreement reports to better understand the trends of your agreements in terms of what your agreement completion rate is, how long it takes, and which users or workflows seem to have greater success." (Adobe Help: Agreement reports (Acrobat Sign), https://helpx.adobe.com/sign/web/users/reporting-and-exporting-data/agreement-reports.html)

## Connections with services

### AEM Guides + AEM Sites (`aemguides-aemsites`)

**Kind:** native. **Label:** AEM Sites output preset publishes DITA maps as Sites pages on Adobe's Guides templates; topics can also become Experience Fragments

**How:** An AEM Sites output preset turns DITA maps and topics into AEM Sites pages. Adobe supplies a components package and editable Sites templates for Guides, DITA elements are mapped to AEM components, and the templates can be customized in the AEM Template editor. A topic, or chosen elements of it, can also be published as an Experience Fragment for use on any Sites page. Source: Experience League: AEM Sites preset in the Map console, https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/output-presets-aemg/aem-sites/generate-output-aem-site-web-editor

**Gain:** Product documentation on the same site as marketing. Your client's documentation is published as AEM Sites pages from the same DITA source as the PDF, so product and support content sits beside marketing content with one look and one publishing process.

**Flows:**
- AEM Guides to AEM Sites: DITA maps and topics published as Sites pages on the Guides templates (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/output-presets-aemg/aem-sites/generate-output-aem-site-web-editor)
- AEM Guides to AEM Sites: Topics or topic elements published as Experience Fragments (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/generate-output/single-topic-publishing/publish-experience-fragment)

**Availability:** Not stated by Adobe; AEM Sites is one of the output formats Guides ships with. Quote: "users can leverage its best-in-class, single-click publishing capability to generate DITA-based output for the most popular formats - Adobe Experience Manager Sites, PDF, HTML5, EPUB, and custom output through DITA-OT" (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/about-aemg/intro)

**Prerequisites:**
- An AEM Sites structure created from Adobe's Guides templates before the preset is configured
  - Quote: "Before configuring the AEM Sites preset for Experience Manager Guides, your administrator needs to create an AEM Sites structure using the templates." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/output-presets-aemg/aem-sites/generate-output-aem-site-web-editor)
- Access to Cloud Manager and its Git repository, to deploy the Guides components package and Sites template
  - Quote: "Access to Git Repository associated with your environment." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/output-gen-config/conf-aem-sites-output/download-install-aem-sites-templates)
- A Guides release at or above the minimum Adobe names on its page for composite component mapping
  - Quote: "It is recommended that you use the composite component mapping, available in the Experience Manager Guides 2502 release, and newer versions, for an enhanced performance." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/output-presets-aemg/aem-sites/generate-output-aem-site-web-editor)
- A decision on replication of DITA source files, so maps and topics do not reach the publish tier by accident
  - Quote: "To prevent the unintended replication of DITA content to the publish environment and to avoid performance issues, Administrators must explicitly manage DITA asset replication through the Configuration Manager." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/bulk-activation/dita-assets-replication-aem-sites)
- For Experience Fragments: a folder in Experience Fragments with its allowed templates
  - Quote: "Create a folder in the Experience Fragments." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/generate-output/single-topic-publishing/publish-experience-fragment)

**Services:**
- **XN01 AEM Sites templates and output preset for documentation** (starting): one-time, 32 / 56 / 104 hours. Install Adobe's Guides components package and Sites templates through your client's Cloud Manager repository, create the Sites structure, build the AEM Sites output preset for each map, and decide how DITA source files are kept off the publish tier.
  - Quote: "It comes with out-of-the-box editable templates which can be customized as per your requirements using AEM Template editor." (Experience League: AEM Sites preset in the Map console, https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/output-presets-aemg/aem-sites/generate-output-aem-site-web-editor)
- **XN02 Documentation site design and component mapping** (optional): one-time, 40 / 80 / 160 hours. Customize the Guides Sites templates to your client's brand, and map DITA elements to your client's own AEM components where the standard mapping does not fit.
  - Quote: "You may use the predefined DITA element mappings, or you can map DITA elements to your custom AEM components." (Experience League: Customize DITA element mapping with AEM components, https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/output-gen-config/conf-aem-sites-output/customize-dita-element-mapping-aem-components)
- **XN03 Topics published as Experience Fragments** (optional): one-time, 16 / 32 / 56 hours. Create the Experience Fragment folders and templates, write the mapping between topic elements and Sites components, and publish the first topics as fragments your client's page authors reuse.
  - Quote: "Experience Manager Guides allow you to publish a topic or its elements to an Experience Fragment." (Experience League: Publish Experience Fragments (AEM Guides), https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/generate-output/single-topic-publishing/publish-experience-fragment)

**For the client to read:** Your documentation is written once in AEM Guides and published as pages on your AEM Sites website, on templates that match your brand. Selected topics can also be published as fragments that your page authors place on other pages. Your product and support content appears on the same site as your marketing content, stays in step with the PDF version, and is published by your documentation team.

### AEM Guides + AEM Assets (`aemguides-aemassets`)

**Kind:** native. **Label:** Topics and topic elements publish as Content Fragments on models created in AEM Assets

**How:** DITA topics, maps and their images are stored and versioned in the AEM Assets repository. A topic, or chosen elements of it, can be published as a Content Fragment on a Content Fragment model created in AEM Assets: the target folder is connected to the model's configuration and topic elements are mapped to the model's fields. Source: Experience League: Publish Content Fragments (AEM Guides), https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/generate-output/single-topic-publishing/publish-content-fragment

**Gain:** Documentation content as structured fragments. Your client reuses approved documentation, such as a product description or a safety note, as Content Fragments in sites, apps and other channels, without copying text out of the manuals.

**Flows:**
- AEM Guides to AEM Assets: Topics or topic elements published as Content Fragments on a Content Fragment model (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/generate-output/single-topic-publishing/publish-content-fragment)

**Availability:** Not stated by Adobe. Quote: "Experience Manager Guides allows you to publish a topic or its elements to a content fragment." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/generate-output/single-topic-publishing/publish-content-fragment)

**Prerequisites:**
- A Content Fragment model created in AEM Assets
  - Quote: "Create a Content Fragment model in Adobe Experience Manager Assets." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/generate-output/single-topic-publishing/publish-content-fragment)
- A target folder whose cloud configuration points to the model's configuration
  - Quote: "This configuration connects all the Content Fragment models with the folder." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/generate-output/single-topic-publishing/publish-content-fragment)
- An id attribute on every topic element that is published
  - Quote: "You can choose only those elements in a topic that have an id attribute defined." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/generate-output/single-topic-publishing/publish-content-fragment)

**Services:**
- **XN04 Topics published as Content Fragments** (starting): one-time, 16 / 32 / 64 hours. Design the Content Fragment models with your client's content team, connect the target folders to them, map topic elements to the models' fields, and publish and check the first fragments.
  - Quote: "Experience Manager Guides allows you to publish a topic or its elements to a content fragment." (Experience League: Publish Content Fragments (AEM Guides), https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/generate-output/single-topic-publishing/publish-content-fragment)

**For the client to read:** Selected topics from your documentation are published as Content Fragments in AEM Assets, so the same approved text can feed your website, your app and other channels. Your teams reuse documentation content without copying it, and a change made in the source topic can be published again to the fragment.

### AEM Guides + Edge Delivery Services (`aemguides-eds`)

**Kind:** native. **Label:** Edge Delivery Service output preset publishes DITA maps to an Edge Delivery site through a GitHub or GitLab publish profile

**How:** Guides publishes DITA content to an Edge Delivery Services site through a publish profile backed by a Git repository. The site is created from Adobe's Guides boilerplate on GitHub and connected with the AEM Code Sync app, an Edge Delivery Service output preset commits the generated output to the repository, and blocks in the repository control how the content looks. A GitLab repository is supported through Cloud Manager's BYOG option for outside Git repositories. Source: Experience League: Experience Manager Guides and Edge Delivery Services, https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/knowledge-base/kb-articles/publishing/configure-eds

**Gain:** Fast documentation sites from DITA. Your client's documentation is delivered on Edge Delivery Services with a responsive layout, a table of contents from the map and several maps on one site, while authors keep working in DITA.

**Flows:**
- AEM Guides to Edge Delivery Services: Generated documentation pages, table of contents and navigation, committed to the site's repository (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/knowledge-base/kb-articles/publishing/configure-eds)

**Availability:** Not stated by Adobe. Quote: "Adobe Experience Manager Guides allows you to publish your DITA content directly to Edge Delivery Services (EDS) through a dedicated GitHub-based publish profile." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/knowledge-base/kb-articles/publishing/configure-eds)

**Prerequisites:**
- A GitHub repository created from Adobe's Guides boilerplate, with public visibility
  - Quote: "Ensure that the repository visibility is set to Public so it can be accessed by EDS." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/knowledge-base/kb-articles/publishing/configure-eds)
- The AEM Code Sync app installed with the GitHub account that owns the repository
  - Quote: "While installing the application, ensure that you use the same GitHub account that owns the repository." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/knowledge-base/kb-articles/publishing/configure-eds)
- A GitHub OAuth App for the publish profile, or a GitLab project access token
  - Quote: "An OAuth App is required to authenticate users while creating an EDS publish profile in Experience Manager Guides." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/knowledge-base/kb-articles/publishing/configure-eds)
- An HLX API key in the publish profile where a map publishes more than 100 files
  - Quote: "Also, the key is required for publishing the content to EDS if the content size is more than 100 files." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/knowledge-base/kb-articles/publishing/configure-eds)
- For GitLab: a Cloud Manager role that can add repositories
  - Quote: "Access to Cloud Manager, with a role that allows adding repositories (Deployment Manager or Business Owner)." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/knowledge-base/kb-articles/publishing/configure-eds-gitlab)
- For GitLab: a site created from the GitHub boilerplate, not with the one-click option in Cloud Manager
  - Quote: "Do not create the EDS site using the one-click option in Cloud Manager." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/knowledge-base/kb-articles/publishing/configure-eds-gitlab)

**Services:**
- **XN05 Edge Delivery documentation site and publish profile** (starting): one-time, 24 / 48 / 88 hours. Create the site repository from Adobe's Guides boilerplate, connect it with AEM Code Sync, set the mountpoint, create the publish profile and the Edge Delivery Service output presets in Guides, and publish and check the first maps.
  - Quote: "Adobe Experience Manager Guides allows you to publish your DITA content directly to Edge Delivery Services (EDS) through a dedicated GitHub-based publish profile." (Experience League: Experience Manager Guides and Edge Delivery Services, https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/knowledge-base/kb-articles/publishing/configure-eds)
- **XN06 Blocks and styling for the documentation site** (optional): one-time, 24 / 48 / 96 hours. Style the published documentation to your client's brand: adjust the boilerplate's blocks, such as breadcrumbs and navigation, and add custom blocks for content that needs its own treatment.
  - Quote: "EDS uses blocks to control how different parts of your content are styled and displayed." (Experience League: Experience Manager Guides and Edge Delivery Services, https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/knowledge-base/kb-articles/publishing/configure-eds)
- **XN07 GitLab repository through Cloud Manager (BYOG)** (optional; also needs GitLab): one-time, 16 / 32 / 56 hours. For a client whose code lives in GitLab, add the GitLab repository to Cloud Manager, set up the webhook and API key, connect it to the Edge Delivery site with Cloud Manager's BYOG option, and point the Guides publish profile at it.
  - Quote: "To publish content from Experience Manager Guides to Edge Delivery Services (EDS) using GitLab, you connect a GitLab repository to your EDS site through Cloud Manager's Bring Your Own Git (BYOG) capability." (Experience League: Set up and configure GitLab for Edge Delivery Services, https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/knowledge-base/kb-articles/publishing/configure-eds-gitlab)

**For the client to read:** Your documentation is written in AEM Guides and published to a fast Edge Delivery Services site. Each guide appears in the site navigation with its own table of contents, styled to your brand. Your customers get documentation pages that load quickly on any device, and your writers publish updates themselves from the tool they write in.

### AEM Guides + Workfront (`aemguides-workfront`)

**Kind:** native. **Label:** Guides creates and tracks authoring, review, publishing and translation tasks as Workfront tasks

**How:** An administrator connects Guides to Workfront with an OAuth2 application and a custom form created in Workfront for Guides. Authors, reviewers and publishers then get a Workfront tasks page inside Guides, where they create authoring, review, publishing and translation tasks in a Workfront project, attach topics and maps, and work the tasks assigned to them. Source: Experience League: Workfront integration (AEM Guides), https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/workfront-integration/workfront-integration

**Gain:** Documentation work planned in Workfront. Your client's documentation managers plan and track authoring, review, translation and publishing in Workfront while writers and reviewers do the work in Guides, so the plan and the content stay in step.

**Flows:**
- AEM Guides to Workfront: Authoring, review, publishing and translation tasks created from Guides, with the topics and maps they cover (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/workfront-integration/workfront-integration)
- Workfront to AEM Guides: Assigned tasks, due dates and email notifications, shown on the Workfront tasks page in Guides (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/workfront-integration/workfront-integration)

**Availability:** Not stated by Adobe; the tasks page appears once an administrator has configured and enabled the integration. Quote: "Once configured and enabled by your administrator, Adobe Workfront tasks can be accessed right from the Experience Manager Guides Home page." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/workfront-integration/workfront-integration)

**Prerequisites:**
- Standard access to Workfront and administrator access to Guides for the person who connects them
  - Quote: "You have standard access to Adobe Workfront and administrator access to Experience Manager Guides." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/aemg-integrations/conf-workfront)
- A custom form created in Workfront for Guides, with the field names and values exactly as Adobe lists them
  - Quote: "The name and values for each task type must be exactly same as mentioned in the above table." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/aemg-integrations/conf-workfront)
- An OAuth2 application in your client's Workfront, which supplies a Client ID and Client Secret
  - Quote: "On the Workfront configuration page, enter the full URL of your organization's Workfront domain, Client ID, and Client Secret key." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/aemg-integrations/conf-workfront)
- Users added to Workfront with the same email addresses they have in Guides
  - Quote: "Once configured, add users to Adobe Workfront using the same email addresses they have in Experience Manager Guides." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/aemg-integrations/conf-workfront)
- Authors and reviewers who create review tasks placed in the workflow-users group
  - Quote: "When creating a review task in Workfront, users (authors or reviewers) must be part of the workflow-users group." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/aemg-integrations/conf-workfront)

**Services:**
- **XN08 Workfront connection for documentation tasks** (starting): one-time, 16 / 24 / 48 hours. Create the OAuth2 application and the custom form in your client's Workfront, connect Guides to it, add the documentation team to Workfront with matching email addresses and the right AEM groups, and test each task type.
  - Quote: "You create a new custom form in Adobe Workfront required for Experience Manager Guides by specifically using the below fields" (Experience League: Configure Adobe Workfront for Cloud Service (AEM Guides), https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/aemg-integrations/conf-workfront)
- **XN09 Documentation projects and task practice in Workfront** (optional): one-time, 16 / 32 / 56 hours. Design the Workfront projects your client's documentation releases run in, agree how authoring, review, translation and publishing tasks are created and assigned from Guides, and train project managers and writers.
  - Quote: "With this integration, you can create and manage Adobe Workfront tasks directly from Experience Manager Guides." (Experience League: Workfront integration (AEM Guides), https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/workfront-integration/workfront-integration)

**For the client to read:** Your documentation team plans its releases in Workfront. Your writers and reviewers see their Workfront tasks inside AEM Guides, create new ones there, and open the topics a task covers from the task. Your managers see the status of every authoring, review, translation and publishing task in one place, and your writers stay in the tool they write in.

### AEM Guides + Coworker (`aemguides-cw`)

**Note:** Held for Adam's answer (lifecycle question 1 in the trail). The AI Assistant feature pages and the release notes that added the Coworker skills carry no label, but Adobe's generative AI disclosure page for Guides still calls the AI Assistant "the Beta". Drop this connection if Adam says the disclosure page decides it.

**Kind:** native. **Label:** AI Assistant in Guides runs in Agentic mode on Coworker, with Import, Create and Smart tagging skills

**How:** The AI Assistant in Guides has an Agentic mode powered by Coworker. An author describes a task in the AI Assistant panel, and its skills import PDF, Word or Markdown files as structured topics, draft topics and maps from reference material, and recommend tags from your client's taxonomy; the author reviews each result. An administrator selects Agentic mode in Workspace settings once Adobe has enabled it for the environment. Source: Experience League: AI Assistant (AEM Guides), https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/ai-assistant-aem/ai-assistant

**Gain:** First drafts and tagging by asking. Your client's writers turn specifications and legacy documents into structured topics faster and tag content the same way every time, with a person reviewing every result.

**Flows:**
- Coworker to AEM Guides: Imported and drafted DITA topics and maps, and recommended tags, for the author to review (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/ai-assistant-aem/ai-assistant)
- AEM Guides to Coworker: Source files, existing content used for tone and style, and the taxonomy namespaces an administrator selected (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/ai-assistant-aem/ai-assistant)

**Availability:** Adobe says the organization must be onboarded to Coworker with available credits, and that its Customer Success team then enables the feature. Quote: "To use AI Assistant in Agentic mode, your organization needs to be onboarded to Adobe CX Enterprise Coworker and have available credits; once onboarded, contact your Customer Success team to enable the feature." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/ai-assistant-aem/ai-assistant)

**Prerequisites:**
- Adobe's Workfront documentation says Coworker in Workfront is not currently available to health care and finance organizations; Adobe states no such limit for this connection, so confirm eligibility with Adobe for your client
  - Quote: "Coworker is not currently available to organizations in health care, finance, or some other industries with sensitive data." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-general-information/planning-cx-coworker-overview)
  - In the statement of work: Adobe confirms that Coworker is available to the Client's organization before this service starts
- An organization onboarded to Coworker, with credits available
  - Quote: "Your organization must be onboarded to CX Enterprise Coworker before you configure AI Assistant in Agentic mode." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/editor-configs/editor-cloud-settings/configure-ai-assistant-agentic-mode-cs)
- Agentic mode enabled for your client's environment by Adobe's Customer Success team, then switched on in Workspace settings
  - Quote: "After the configuration is complete for your environment, contact the Customer Success team to enable Agentic mode." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/editor-configs/editor-cloud-settings/configure-ai-assistant-agentic-mode-cs)
  - In the statement of work: Adobe confirms that Agentic mode is enabled for the Client's environment before this service starts
- An IMS configuration added to the environment, unless users sign in through single sign-on with Unified Shell enabled
  - Quote: "If Unified shell is enabled and your users log in through SSO, no additional configuration is required." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/editor-configs/editor-cloud-settings/configure-ai-assistant-agentic-mode-cs)
- Taxonomy namespaces selected by an administrator for the Smart tagging skill
  - Quote: "Your Administrator can configure the taxonomies used to generate tag recommendations through Workspace settings by selecting the relevant namespaces for your workspace." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/ai-assistant-aem/ai-assistant-agentic/ai-assistant-agentic)

**Services:**
- **XN22 Agentic mode setup for the AI Assistant** (starting): one-time, 8 / 16 / 32 hours. Add the IMS configuration your client's environment needs, ask Adobe to enable Agentic mode, switch it on in Workspace settings, and select the taxonomy namespaces the Smart tagging skill draws on.
  - Quote: "Administrators can select the mode from the AI features section of the General tab in Workspace settings." (Experience League: AI Assistant (AEM Guides), https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/ai-assistant-aem/ai-assistant)
- **XN23 Import, drafting and tagging practice with the AI Assistant** (starting): one-time, 16 / 32 / 56 hours. Pilot the Import, Create and Smart tagging skills on your client's own material: which legacy PDF and Word files are imported, which reference content drafts start from, the prompts writers reuse, and the review each result gets before it is saved.
  - Quote: "Agentic mode: Uses skills Import, Create, and Smart tagging, to convert files into structured topics, create first draft of content, and recommend relevant tags based on your organization's taxonomy." (Experience League: AI Assistant (AEM Guides), https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/ai-assistant-aem/ai-assistant)

**For the client to read:** Your writers ask the AI Assistant in AEM Guides to turn PDF and Word files into structured topics, to draft new topics from your reference material, and to suggest tags from your own taxonomy. A writer reviews every result before it is kept. Your team moves legacy documents into structured content faster and tags content the same way every time.

### Acrobat Sign + AEM Forms (`acrobatsign-aemforms`)

**Note:** AF08 (E-signature with Acrobat Sign) is already in the tool as an AEM Forms product line with ext "Acrobat Sign Solutions". It covers the API application, the cloud configuration and the Sign Document workflow step, and belongs on this connection once Acrobat Sign is a product. XN10 is the only new line and does not repeat it.

**Kind:** native. **Label:** Acrobat Sign cloud configuration in AEM Forms sends form documents for signature, from a workflow step or a sign-enabled form

**How:** AEM Forms connects to Acrobat Sign through a cloud service configuration on the Author and Publish instances, backed by an Acrobat Sign API application. A Sign Document step in an AEM workflow sends a document for signature, and forms built on Foundation Components can be enabled for Acrobat Sign, with the signers, the signing order and signer authentication set on the form. AEM Forms supports Acrobat Sign and Acrobat Sign Solutions for Government. Source: Experience League: Connect AEM Forms as a Cloud Service with Adobe Acrobat Sign, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/services/adobe-sign-integration-adaptive-forms

**Gain:** Forms that end in a signature. Your client's applications and enrollments finish with a signed document: the form's data fills the document, the signers sign in the order set, and the signed copy returns to the process that needs it.

**Flows:**
- AEM Forms to Acrobat Sign: The filled document, the signers and the signing order (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/adaptive-forms-authoring/authoring-adaptive-forms-foundation-components/use-adobe-sign/working-with-adobe-sign)
- Acrobat Sign to AEM Forms: Signing status and the signed document, returned to the workflow (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/services/adobe-sign-integration-adaptive-forms)

**Availability:** Adobe says AEM Forms supports both Adobe Acrobat Sign and Adobe Acrobat Sign Solutions for Government. Quote: "AEM Forms supports both Adobe Acrobat Sign and Adobe Acrobat Sign Solutions for Government." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/services/adobe-sign-integration-adaptive-forms)

**Prerequisites:**
- An active Acrobat Sign developer account and an Acrobat Sign API application, for its Client ID and Client Secret
  - Quote: "An active Adobe Acrobat Sign developer account." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/services/adobe-sign-integration-adaptive-forms)
- The cloud configuration pointed at the Acrobat Sign shard the account lives on
  - Quote: "Ensure that the Adobe Acrobat Sign Cloud Configurations point to the correct Shard." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/services/adobe-sign-integration-adaptive-forms)
- For forms on Core Components: signing through the Sign Document workflow step, since signing inside the form is not supported
  - Quote: "The service does not support in-form signing experience and does not include the Summary and Verify components for Adaptive Form." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/forms-overview/notable-changes)
- An email address for every signer
  - Quote: "You require at least an email address for every recipient." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/adaptive-forms-authoring/authoring-adaptive-forms-foundation-components/use-adobe-sign/working-with-adobe-sign)
- For Government ID checks: that authentication method enabled in Acrobat Sign
  - Quote: "(Only for Government ID-based authentication) Enable the authentication method for Government ID authentication." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/services/adobe-sign-integration-adaptive-forms)

**Services:**
- **XN10 Signing on forms built with Foundation Components** (optional): one-time, 16 / 32 / 64 hours. Enable Acrobat Sign on your client's Foundation Components forms, such as forms produced by the Automated Forms Conversion service: the signers and their order, signer authentication, the Acrobat Sign fields placed in the document, and the document each signer receives.
  - Quote: "You can use the Adobe Sign Block component to place Adobe Sign fields at various locations in an Adaptive Form." (Experience League: Use Adobe Sign in an Adaptive Form, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/adaptive-forms-authoring/authoring-adaptive-forms-foundation-components/use-adobe-sign/working-with-adobe-sign)

**For the client to read:** Your forms in AEM Forms send the completed document to Acrobat Sign. Your signers receive it by email and sign in the order you set, and the signed copy and its status return to your process. Your applications finish with a signed document without printing or scanning, and your staff see who has signed and who has not.

### Acrobat Sign + Workfront (`acrobatsign-workfront`)

**Kind:** extension. **Label:** Workfront Fusion modules create Acrobat Sign agreements from Workfront work and act on agreement events

**How:** Workfront Fusion's Acrobat Sign modules connect the two products: a scenario starts when an agreement is created or changes, and scenarios create, read and update agreements, upload documents and search records. Adobe documents no Acrobat Sign step inside Workfront itself, so a signature step in a Workfront process is a Fusion scenario. Source: Experience League: Adobe Acrobat Sign modules (Workfront Fusion), https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-sign-modules

**Gain:** Signatures as a step in the work. Your client's contracts, releases and approvals are sent for signature from the Workfront task that needs them, and the task updates when everyone has signed.

**Flows:**
- Workfront to Acrobat Sign: Documents and signer details from a Workfront object, used to create an agreement (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-sign-modules)
- Acrobat Sign to Workfront: Agreement events and status, used to update tasks, issues or documents (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-sign-modules)

**Availability:** Not stated by Adobe for the pair; Adobe documents the Acrobat Sign modules in Workfront Fusion. Quote: "With the Adobe Acrobat Sign modules, you can start an Adobe Workfront Fusion scenario based on events in your Adobe Acrobat Sign account, create, read, or update agreements and other records, search for records using criteria you set, and upload documents." (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-sign-modules)

**Prerequisites:**
- Workfront Fusion, which is an additional purchase on Select and Prime packages that lack Workfront Automation and Integration
  - Quote: "If your organization has a Select or Prime Workfront package that does not include Workfront Automation and Integration, your organization must purchase Adobe Workfront Fusion." (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-sign-modules)
- An Acrobat Sign account with API access, connected to Fusion
  - Quote: "API access is reserved exclusively for enterprise and developer tier accounts." (https://helpx.adobe.com/sign/web/developers/rest-apis/api.html)
- A new agreement for each request, since agreements are not typically changed once started
  - Quote: "We recommend that new users of Adobe Sign focus on creating new agreements using the agreement creation module." (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-sign-modules)
- The document uploaded as a transient document and mapped to the agreement
  - Quote: "There are some options for doing this but the easiest and most common is uploading a transient document and then mapping that document to your agreement." (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-sign-modules)

**Services:**
- **XN11 Signature step in Workfront through Fusion** (starting; also needs Workfront Fusion): one-time, 24 / 48 / 96 hours. Build the Workfront Fusion scenario that sends a document from a Workfront task, issue or project for signature in Acrobat Sign, with the signers taken from your client's Workfront fields.
  - Quote: "With the Adobe Acrobat Sign modules, you can start an Adobe Workfront Fusion scenario based on events in your Adobe Acrobat Sign account, create, read, or update agreements and other records, search for records using criteria you set, and upload documents." (Experience League: Adobe Acrobat Sign modules (Workfront Fusion), https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-sign-modules)
- **XN12 Agreement status back in Workfront** (optional; also needs Workfront Fusion): one-time, 16 / 32 / 56 hours. Add the scenario that watches agreement events and updates the Workfront task, its status and its documents when an agreement is signed, declined or expires, and attaches the signed copy.
  - Quote: "This trigger module starts a scenario when an event that you select occurs." (Experience League: Adobe Acrobat Sign modules (Workfront Fusion), https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-sign-modules)

**For the client to read:** When a piece of work in Workfront needs a signature, the document is sent to Acrobat Sign automatically, and the task in Workfront updates when everyone has signed. Your teams do not chase signatures by email, and your project record shows when each agreement was signed.

### Acrobat Sign + Marketo Engage (`acrobatsign-marketo`)

**Kind:** partner. **Label:** Agreement data reaches Marketo Engage through the CRM sync, for reminder and notification campaigns

**How:** Adobe documents no direct connector. Its tutorials show the route through a CRM: with Acrobat Sign for Salesforce (or for Microsoft Dynamics 365) and the Marketo Engage CRM sync, the Agreement object syncs to Marketo Engage as a custom object, and Marketo sends reminders for unsigned agreements or notifications that an agreement is on its way. Source: Experience League: Send reminders using Acrobat Sign for Salesforce and Marketo, https://experienceleague.adobe.com/en/docs/document-cloud-learn/sign-learning-hub/integrations/marketo/marketo-salesforce-reminder

**Gain:** Follow-up on unsigned agreements. Your client's marketing team reminds people who have not signed, with a link to the agreement, from the same Marketo Engage programs that run the rest of the nurture.

**Flows:**
- Acrobat Sign to Marketo Engage: Agreement name, status, date signed and signing link, synced through the CRM as a custom object (https://experienceleague.adobe.com/en/docs/document-cloud-learn/sign-learning-hub/integrations/marketo/marketo-salesforce-reminder)

**Availability:** Not stated by Adobe; Adobe documents the route in tutorials that place a CRM between the two products. Quote: "This integration uses Acrobat Sign, Acrobat Sign for Salesforce, Marketo, and the Marketo and Salesforce Sync." (https://experienceleague.adobe.com/en/docs/document-cloud-learn/sign-learning-hub/integrations/marketo/marketo-salesforce-reminder)

**Prerequisites:**
- Salesforce with Acrobat Sign for Salesforce installed, or Microsoft Dynamics 365 with Acrobat Sign for Microsoft Dynamics
  - Quote: "Install Acrobat Sign for Salesforce." (https://experienceleague.adobe.com/en/docs/document-cloud-learn/sign-learning-hub/integrations/marketo/marketo-salesforce-reminder)
- The Marketo Engage sync with that CRM installed and running
  - Quote: "Install the Marketo Salesforce Sync." (https://experienceleague.adobe.com/en/docs/document-cloud-learn/sign-learning-hub/integrations/marketo/marketo-salesforce-reminder)
- For text messages: a Marketo SMS feature purchased or configured
  - Quote: "To send notifications from Marketo, you first need to purchase or configure a Marketo SMS management feature." (https://experienceleague.adobe.com/en/docs/document-cloud-learn/sign-learning-hub/integrations/marketo/marketo-salesforce-sms)

**Services:**
- **XN13 Agreement data synced to Marketo Engage** (starting; also needs Salesforce or Microsoft Dynamics 365, with the Acrobat Sign app for it): one-time, 16 / 24 / 48 hours. Enable sync for the Agreement custom object under lead, contact or account in Marketo Engage, expose the agreement fields to triggers, and check the data against your client's CRM.
  - Quote: "Enable Sync for the Agreement object shown under the desired Parent (Lead, Contact, or Account)." (Experience League: Send reminders using Acrobat Sign for Salesforce and Marketo, https://experienceleague.adobe.com/en/docs/document-cloud-learn/sign-learning-hub/integrations/marketo/marketo-salesforce-reminder)
- **XN14 Reminder and notification campaigns for agreements** (starting; also needs Salesforce or Microsoft Dynamics 365, with the Acrobat Sign app for it): one-time, 16 / 32 / 56 hours. Build the Marketo Engage program: tokens that carry the agreement name and signing link, the reminder email, and the smart campaign that sends it when an agreement stays unsigned for the period your client sets.
  - Quote: "Learn how to send an email reminder from Marketo when an agreement remains unsigned after a period of time." (Experience League: Send reminders using Acrobat Sign for Salesforce and Marketo, https://experienceleague.adobe.com/en/docs/document-cloud-learn/sign-learning-hub/integrations/marketo/marketo-salesforce-reminder)

**For the client to read:** Your agreement records flow from your CRM into Marketo Engage. Marketo Engage sends a reminder with the signing link when an agreement stays unsigned, and can tell signers when an agreement is on its way. More of your agreements get signed without your sales team chasing each one.

### Acrobat and Acrobat Services + Acrobat Sign (`acrobat-acrobatsign`)

**Kind:** native. **Label:** Request e-signatures in Acrobat sends through Acrobat Sign, and forms authored in Acrobat become Acrobat Sign fields

**How:** Acrobat's Request e-signatures tool sends documents for signature through Acrobat Sign, with the recipients, the signing order and the fields set in Acrobat. Acrobat Standard and Acrobat Pro include that e-signing with templates enabled but not configurable and custom send workflows not supported; an Acrobat Sign Solutions account adds them. Acrobat form fields named with Acrobat Sign text tags become Acrobat Sign form fields when the document is uploaded, and the Document Generation Tagger places Acrobat Sign text tags in generated documents. Source: Adobe Help: E-signatures in Acrobat, https://helpx.adobe.com/acrobat/desktop/e-sign-documents/learn-about-signatures/e-sign-overview.html

**Gain:** One signing practice across desks and departments. Your client's staff send everyday documents for signature from Acrobat, while departments with regulated or high-volume agreements use templates, workflows and identity checks in Acrobat Sign, on forms prepared once in Acrobat.

**Flows:**
- Acrobat and Acrobat Services to Acrobat Sign: Documents, recipients, signing order and form fields sent for signature (https://helpx.adobe.com/acrobat/desktop/e-sign-documents/learn-about-signatures/e-sign-overview.html)
- Acrobat and Acrobat Services to Acrobat Sign: PDF forms whose Acrobat fields become Acrobat Sign form fields on upload (https://helpx.adobe.com/sign/web/form-field-authors/create-forms-with-acrobat/create-forms-with-acrobat.html)

**Availability:** Adobe states availability feature by feature for Acrobat Standard and Acrobat Pro, Acrobat Sign Solutions and Acrobat Sign for Government. Quote: "Acrobat Standard and Acrobat Pro: Enabled by default. Not configurable." (https://helpx.adobe.com/sign/web/advanced-users/reusable-templates/create-template.html)

**Prerequisites:**
- An Acrobat plan that includes Request e-signatures; signers need no Acrobat subscription
  - Quote: "Signers don't require an Acrobat subscription and can sign agreements from anywhere using a web browser or mobile device." (https://helpx.adobe.com/acrobat/desktop/e-sign-documents/learn-about-signatures/e-sign-overview.html)
- Acrobat Sign Solutions for custom send workflows, which Acrobat Standard and Acrobat Pro do not support
  - Quote: "Acrobat Standard and Acrobat Pro: Not Supported" (https://helpx.adobe.com/sign/web/advanced-users/custom-workflows/overview.html)
- Acrobat Sign Solutions for bulk sending from a CSV file
  - Quote: "Acrobat Standard and Acrobat Pro: Manual user input supported; CSV import not supported" (https://helpx.adobe.com/sign/web/advanced-users/send-in-bulk/overview.html)
- Field names in Acrobat forms that carry an Acrobat Sign text tag
  - Quote: "The system specifically looks at the name the field is given, verifies that an Acrobat Sign tag has been defined." (https://helpx.adobe.com/sign/web/form-field-authors/create-forms-with-acrobat/create-forms-with-acrobat.html)

**Services:**
- **XN15 E-signature practice for Acrobat users** (starting): one-time, 16 / 24 / 48 hours. Agree with your client which teams send for signature from Acrobat and which use Acrobat Sign Solutions, write the short guide for requesting, tracking and saving agreements as templates in Acrobat, and train the teams.
  - Quote: "Use Request e-signatures to send documents to others for electronic signatures through Adobe Acrobat Sign." (Adobe Help: E-signatures in Acrobat, https://helpx.adobe.com/acrobat/desktop/e-sign-documents/learn-about-signatures/e-sign-overview.html)
- **XN16 Acrobat forms prepared as Acrobat Sign templates** (optional): one-time, 16 / 32 / 64 hours. Prepare your client's PDF forms in Acrobat with fields named in Acrobat Sign's text tag syntax, so signer roles, required fields and validations carry over when the forms are uploaded as library templates.
  - Quote: "When a document is uploaded to the Acrobat Sign Document Library or send out for signature, the Acrobat form fields are processed by the system and converted into Acrobat Sign form fields." (Adobe Help: Create forms with Acrobat form fields (Acrobat Sign), https://helpx.adobe.com/sign/web/form-field-authors/create-forms-with-acrobat/create-forms-with-acrobat.html)
- **XN17 Generated agreements sent for signature** (optional; needs PDF Services API): one-time, 32 / 56 / 104 hours. Build the flow that fills a Word template with your client's data through the Document Generation API, places signature fields with Acrobat Sign text tags, and sends the result for signature through the Acrobat Sign API.
  - Quote: "With Adobe Document Generation Tagger, you can easily place these Text Tag fields." (Experience League: Accelerate your sales process (Acrobat Services tutorial), https://experienceleague.adobe.com/en/docs/acrobat-services-learn/tutorials/usecases/acceleratesales)

**For the client to read:** Your staff send everyday documents for signature straight from Acrobat. Forms your teams prepare in Acrobat keep their fields when they become signing templates, and agreements can be generated from your data and sent for signature automatically. Everyone in your organization signs the same way, your regulated agreements get the extra controls they need, and fewer documents are prepared by hand.

### Acrobat and Acrobat Services + Workfront (`acrobat-workfront`)

**Kind:** extension. **Label:** Workfront Fusion's Adobe PDF Services modules generate, convert, combine and read PDFs inside a scenario

**How:** Workfront Fusion's Adobe PDF Services modules call the PDF Services API from a scenario: extract data from a PDF, generate a PDF from data, convert files to and from PDF, and combine, compress or password-protect PDFs. Adobe says neither Adobe nor Workfront Fusion stores the files. Adobe documents no PDF Services step inside Workfront itself. Source: Experience League: Adobe PDF Services modules (Workfront Fusion), https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/pdf-modules

**Gain:** Document steps inside work automation. Your client's Workfront processes produce and handle documents by themselves: a brief becomes a PDF, proofs are combined into one file, and data is read out of an incoming PDF into Workfront fields.

**Flows:**
- Workfront to Acrobat and Acrobat Services: Files and data from Workfront objects, sent to PDF Services for an operation (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/pdf-modules)
- Acrobat and Acrobat Services to Workfront: Generated, converted or combined PDFs and extracted data, written back to Workfront (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/pdf-modules)

**Availability:** Not stated by Adobe for the pair; Adobe documents the Adobe PDF Services modules in Workfront Fusion. Quote: "With the Adobe Workfront Fusion Adobe PDF Services, you can extract data from a PDF file, or generate a new PDF file from data you supply." (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/pdf-modules)

**Prerequisites:**
- Workfront Fusion, which is an additional purchase on Select and Prime packages that lack Workfront Automation and Integration
  - Quote: "If your organization has a Select or Prime Workfront package that does not include Workfront Automation and Integration, your organization must purchase Adobe Workfront Fusion." (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/pdf-modules)
- The Adobe PDF Services API added to a project in the Adobe Developer Console, with OAuth Server-to-Server credentials
  - Quote: "To create an OAuth Server-to-Server connection, you must add the Adobe PDF Services API in your Adobe Developers Console." (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/pdf-modules)
- PDF Services API volume that covers the scenarios' operations
  - Quote: "Paid credentials enable a greater processing quota and require entering into a separate written agreement." (https://developer.adobe.com/document-services/docs/overview/limits/)

**Services:**
- **XN18 PDF steps in Workfront Fusion scenarios** (starting; also needs Workfront Fusion; needs PDF Services API): one-time, 24 / 40 / 80 hours. Create the PDF Services connection in Workfront Fusion and build the scenarios your client needs, such as generating a PDF from Workfront data, converting and combining documents on a task, or reading data out of a PDF into custom form fields.
  - Quote: "PDF Services also allow you to combine, compress, or read metadata for a PDF file, as well as control password protection on the file." (Experience League: Adobe PDF Services modules (Workfront Fusion), https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/pdf-modules)

**For the client to read:** Your Workfront automations use Adobe's PDF services to create, convert, combine and read PDF files as part of a process, and the results are saved back to the work they belong to. Your teams stop preparing routine documents by hand, and the documents attached to your projects arrive in the format the next step needs.

### Acrobat and Acrobat Services + AEM Sites (`acrobat-aemsites`)

**Kind:** native. **Label:** PDF Viewer Core Component embeds PDFs on AEM Sites pages through the PDF Embed API

**How:** The PDF Viewer Core Component embeds a PDF stored as an asset in AEM, or at another address, on an AEM Sites page. The component uses Adobe's Document Services APIs (the PDF Embed API viewer), and an administrator sets a context-aware configuration for it before authors can use it. Authors then choose the viewer type and which tools visitors see. Source: Experience League: PDF Viewer Component (AEM Core Components), https://experienceleague.adobe.com/en/docs/experience-manager-core-components/using/wcm-components/pdf-viewer

**Gain:** PDFs read on the page. Your client's brochures, manuals and reports open inside the page in Adobe's viewer instead of sending visitors to a download, with the controls your client chooses.

**Flows:**
- Acrobat and Acrobat Services to AEM Sites: The PDF Embed API viewer, loaded on the page with your client's client ID (https://experienceleague.adobe.com/en/docs/experience-manager-core-components/using/wcm-components/pdf-viewer)
- AEM Sites to Acrobat and Acrobat Services: The PDF file and the viewer options the author set in the component (https://experienceleague.adobe.com/en/docs/experience-manager-core-components/using/wcm-components/pdf-viewer)

**Availability:** Not stated by Adobe; the component is part of the AEM Core Components. Quote: "The Core Component PDF Viewer component embeds a viewer to display PDF files stored as assets on the page." (https://experienceleague.adobe.com/en/docs/experience-manager-core-components/using/wcm-components/pdf-viewer)

**Prerequisites:**
- A PDF Embed API client ID registered for each site domain
  - Quote: "If the client ID is incorrect or you are using it on a domain other than the one you registered, then the PDF preview is blocked with an error message." (https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/gettingstarted/)
- A context-aware configuration for the component, set by an administrator
  - Quote: "The PDF Viewer Component leverages Adobe's Document Services APIs and requires your administrator to configure a context aware configuration in order to use these services." (https://experienceleague.adobe.com/en/docs/experience-manager-core-components/using/wcm-components/pdf-viewer)

**Services:**
- **XN19 PDF Viewer component on site pages** (starting): one-time, 8 / 16 / 32 hours. Create the PDF Embed API client ID for your client's site domains, set the component's context-aware configuration, add the PDF Viewer component to the page templates, and agree the viewer type and tools authors use.
  - Quote: "The PDF Viewer Component leverages Adobe's Document Services APIs and requires your administrator to configure a context aware configuration in order to use these services." (Experience League: PDF Viewer Component (AEM Core Components), https://experienceleague.adobe.com/en/docs/experience-manager-core-components/using/wcm-components/pdf-viewer)

**For the client to read:** PDFs stored in your asset library open in Adobe's PDF viewer inside your web pages. Your authors choose how the viewer looks and whether visitors can download, print or annotate. Your visitors read documents without leaving the page, on any device.

### Acrobat and Acrobat Services + Adobe Express (`acrobat-express`)

**Kind:** native. **Label:** Adobe Express design tools open from Acrobat's Edit menu, switched per user group in the product profile

**How:** Acrobat opens a PDF in the Adobe Express editor from its Edit menu and offers Express templates and image editing inside Acrobat. Stylizing a PDF copies it into a new Adobe Express file, while an edited or generated image updates in Acrobat directly. Administrators turn the integration off for a user group in the product profile, and Acrobat Studio includes Adobe Express Premium. Source: Adobe Help: Adobe Express features in Acrobat, https://helpx.adobe.com/acrobat/desktop/edit-documents/enhance-pdfs-with-adobe-express/express-features.html

**Gain:** Better looking documents without a designer. Your client's staff give reports, proposals and flyers a finished look from inside Acrobat, with your client's brand kits and templates where the plan includes them.

**Flows:**
- Acrobat and Acrobat Services to Adobe Express: A copy of the PDF, opened as a new Adobe Express file for design (https://helpx.adobe.com/acrobat/desktop/edit-documents/enhance-pdfs-with-adobe-express/express-features.html)
- Adobe Express to Acrobat and Acrobat Services: Edited and generated images placed in the PDF; restyled files downloaded and brought back (https://helpx.adobe.com/acrobat/desktop/edit-documents/enhance-pdfs-with-adobe-express/express-features.html)

**Availability:** Adobe says the integration is accessible with Acrobat Studio, Acrobat Pro or Acrobat Standard subscriptions, for individuals, teams and enterprise customers. Quote: "Accessible with Adobe Acrobat Studio, Acrobat Pro, or Acrobat Standard subscriptions." (https://helpx.adobe.com/acrobat/desktop/edit-documents/enhance-pdfs-with-adobe-express/express-features.html)

**Prerequisites:**
- Adobe Express services left on in the product profile of the groups that use the integration
  - Quote: "Admins can turn off the integration for a user group by turning off the Adobe Express services via the product profile." (https://helpx.adobe.com/acrobat/desktop/edit-documents/enhance-pdfs-with-adobe-express/express-features.html)
- Acrobat Studio, or an Adobe Express plan, for brand kits, premium fonts and assets
  - Quote: "Acrobat Studio includes full access to Adobe Express Premium, removing limitations on fonts, brand kits, and premium assets." (https://helpx.adobe.com/acrobat/desktop/edit-documents/enhance-pdfs-with-adobe-express/express-features.html)
- A step to bring restyled files back, because changes made in Express do not merge into the PDF
  - Quote: "Changes made in Express will not automatically merge with Acrobat." (https://helpx.adobe.com/acrobat/desktop/edit-documents/enhance-pdfs-with-adobe-express/express-features.html)

**Services:**
- **XN20 Express design tools for Acrobat users** (starting): one-time, 8 / 16 / 32 hours. Decide with your client which groups keep the Express integration on in their product profile, make your client's brand kits and templates available to them, and show teams how stylizing a PDF, editing images and bringing a file back work.
  - Quote: "Admins can turn off the integration for a user group by turning off the Adobe Express services via the product profile." (Adobe Help: Adobe Express features in Acrobat, https://helpx.adobe.com/acrobat/desktop/edit-documents/enhance-pdfs-with-adobe-express/express-features.html)

**For the client to read:** Your staff open a PDF in Adobe Express from inside Acrobat to restyle it, edit its images or start from a template, with your brand's colors, fonts and logos where your plan includes them. Your everyday documents look finished and on brand without a design request.

### Acrobat and Acrobat Services + Adobe Analytics (`acrobat-aa`)

**Note:** Adobe Analytics (aa) is another wave 3 product, researched by another helper. This connection is written here because the page that documents it belongs to Acrobat Services. The Adobe Analytics file in this folder (data_analytics.json, as it stood when this was written) does not carry the pair, so this is the only copy; build it together with the Adobe Analytics product.

**Kind:** native. **Label:** The PDF Embed API viewer sends PDF viewing events to an Adobe Analytics report suite

**How:** The PDF Embed API sends viewer events, such as a document opened, pages viewed, downloads, prints and searches, to an Adobe Analytics report suite. The report suite ID is passed when the viewer is created, and two processing rules in Adobe Analytics map the events and their attributes to variables. Source: Adobe Developer: PDF Embed API analytics, https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtodata

**Gain:** Know which documents are read. Your client sees which PDFs on its site are opened, how far people read, and what they download or search for, in the same Adobe Analytics reports as the rest of the site.

**Flows:**
- Acrobat and Acrobat Services to Adobe Analytics: PDF viewer events and their attributes, such as the file name and page number (https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtodata)

**Availability:** Adobe says an organization that already subscribes to Adobe Analytics gets PDF analytics by default, after a few setup steps. Quote: "If your organization already subscribes to Adobe Analytics, rich PDF analytics is yours by default." (https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtodata)

**Prerequisites:**
- Adobe Analytics on the site, instrumented with the same report suite ID the viewer is given
  - Quote: "You must ensure that Adobe Analytics is instrumented using the same reportSuiteId for the website where you are embedding the PDF Viewer." (https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtodata)
- Two processing rules in the report suite that map the viewer's events and attributes to Analytics variables
  - Quote: "You'll need to create two rules and configure them so that you can map collected events and event attributes to Analytics variables." (https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtodata)

**Services:**
- **XN21 PDF viewing events in Adobe Analytics** (starting): one-time, 8 / 16 / 32 hours. Pass your client's report suite ID to the embedded viewer, create the processing rules that map PDF events and their attributes to Analytics variables, and build the report on documents opened, pages read, downloads and searches.
  - Quote: "To automatically receive PDF analytics events, pass the Analytics report suite ID when creating the AdobeDC.View instance." (Adobe Developer: PDF Embed API analytics, https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtodata)

**For the client to read:** The PDF viewer on your pages reports to Adobe Analytics when a document is opened, read, downloaded, printed or searched, and those events appear in your reports beside your other site data. You see which documents your visitors read and how far they get, so you know which ones are worth keeping up to date.

## Not connections

| Pair | Why | Adobe's words |
|---|---|---|
| bv with aemguides, acrobat and acrobatsign | Not documented. This morning's map-level pass searched the 61 Brand Visibility pages for Guides, DITA, Acrobat, PDF Services, Document Cloud, Acrobat Sign and e-sign, and searched each product's documentation for Brand Visibility and LLM Optimizer. The only matches treat PDF as a kind of content AI agents fetch, which is not a tie to Acrobat. Nothing new was found in this pass. | "View agentic interaction for different content types, such as HTML, PDF and so on." (https://experienceleague.adobe.com/en/docs/brand-visibility/using/dashboards/agentic-traffic) |
| acrobat-creativecloud | File conversion only. Acrobat converts Photoshop, Illustrator and InDesign files to PDF and can open an image in an outside editor; no page describes an integration that is set up between Acrobat and the Creative Cloud apps. | "Select your PSD, AI, or INDD file." (https://helpx.adobe.com/acrobat/desktop/create-documents/create-pdfs/convert-to-pdf.html) |
| acrobat-frameio | Not found. The 480 Acrobat desktop help pages downloaded this morning name Frame.io only in Adobe's product menu, and the Frame.io pages read for wave 2 do not name Acrobat. |  |
| acrobat-aemguides | Not an integration. Guides produces PDFs with its own Native PDF publishing or DITA-OT; Acrobat appears in the Guides documentation only as a tool for inspecting a PDF. | "The Native PDF publishing feature uses these standards to generate a PDF." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/output-presets-aemg/pdf-preset/native-pdf-web-editor) |
| acrobat-aemforms (Cloud Service) | Not documented for the Cloud Service. AEM Forms generates PDFs with its own Communications APIs; no AEM Forms as a Cloud Service page sets up Acrobat or the PDF Services API. The only documented tie is to AEM Forms on JEE (see left_out). |  |
| acrobatsign with commerce, ajo, rtcdp, cja, target, aemsites, aemassets, eds, bc, cw, gspm, express, frameio, creativecloud, planning | Not documented. Acrobat Sign's help documents connectors to systems outside Adobe only, and this morning's search of 544 help pages and 120 tutorial pages found no Experience Cloud integration other than Marketo Engage. A search in this pass for an Experience Platform source connector, a Journey Optimizer action or an Adobe Commerce integration for Acrobat Sign found none; Workfront's own guide has no Acrobat Sign integration outside Workfront Fusion. | "Learn how to install, integrate, and use Adobe Acrobat Sign solutions to the existing systems, processes, and applications of your organization." (https://helpx.adobe.com/sign/web/integrations/home.html) |
| aemguides with acrobatsign, aemforms, commerce, cja, rtcdp, ajo, target, marketo, bc, gspm and the other products in the tool | Not documented. This morning's search of all 528 Guides pages for each product name found AEM Sites, AEM Assets, Edge Delivery Services, Workfront and Coworker only. |  |
| acrobat with marketo, ajo, rtcdp, cja, commerce, target, bc, cw, gspm, planning | Not documented. This morning's search of the Acrobat help and the 50 Acrobat Services tutorial pages found Adobe Analytics, Workfront Fusion, AEM Sites, AEM Assets and Acrobat Sign only. |  |

## Left out, and why

| What | Why | Adobe's words |
|---|---|---|
| AI Assistant in Standard mode (smart suggestions and help in the AEM Guides editor) | Adobe's generative AI disclosure page for Guides calls the AI Assistant "the Beta" throughout, and the release note that introduced it titled it "AI Assistant (Beta)". No product line rests on it. The Coworker-powered Agentic mode is written as the aemguides-cw connection and held for Adam's answer (lifecycle question 1). | "By using the AI Assistant, You hereby acknowledge that the use of Beta is provided "as is" without warranty of any kind." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/ai-assistant-aem/adobe-generative-ai-disclosures) |
| New map collection and the review task sync with the AEM Inbox (AEM Guides) | Adobe labels both Beta and keeps them off until its Customer Success team enables them. GD05 and GD10 use the review workflow, baselines and output presets that carry no label. | "This feature is currently available as a Beta feature and is disabled by default." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/release-info/release-notes/cloud-release-notes/2026-releases/2606-release/whats-new-2026-06-0) |
| New baseline experience (AEM Guides) | Adobe calls it a beta enhancement and enables it on request. GD05 uses the Baseline feature as documented in the user guide. | "Contact the AEM Guides Customer Success team to have New baseline enabled on your environment." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/release-info/release-notes/cloud-release-notes/2026-releases/2605-release/whats-new-2026-05-0) |
| Template presets for output generation (AEM Guides) | Enabled by Adobe on request, and tied to a dated release. GD04 builds output presets per map or folder profile, which need no request. | "Contact your Customer Success team to enable this feature." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/aemg-customization/template-presets-output-generation) |
| AEM Guides MCP server (maps, topics, baselines and reports from an outside AI assistant) | Access is by request: Adobe's Guides team must allow-list the organization. Not a service here; it also connects an AI assistant outside Adobe, which the tool does not carry. | "Your organization's IMS Organization ID (Org ID) must be allow-listed by the Adobe Guides team." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/aemg-integrations/mcp/configure-aem-guides-mcp) |
| Direct publishing of SCORM courses from AEM Guides to Adobe Learning Manager | Documented, but Adobe Learning Manager is not a product in the tool. GD08 publishes SCORM and PDF for whatever learning system your client runs; a line for Learning Manager can follow if that product joins. | "Use this setting to publish your content directly to Adobe Learning Manager (ALM)." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/learning-training-content/get-started/publish-course/scorm-output/config-scorm-preset) |
| AEM Guides on-premise (AEM 6.5) | Adobe ships and documents it, with its own installation, upgrade and configuration steps. The lines here are scoped for the Cloud Service only; a client on 6.5 needs its own estimate. | "This guide provides the instructions to download, install, and configure AEM Guides for Cloud Service and On-Premise." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/introduction) |
| Microsoft Power Automate workflows inside Acrobat Sign | Adobe has announced that the Power Automate experience embedded in Acrobat Sign is being discontinued, with a date. No line rests on it. SG11 covers the Microsoft 365 add-ins, which are not affected; flows built in Microsoft Power Automate itself keep working, in Adobe's words, "for the majority of customers". | "In January 2027, the embedded Power Automate experience within Acrobat Sign is being discontinued." (https://helpx.adobe.com/sign/web/advanced-users/power-automate-workflows/power-automate-embedded-integration-retirement-in-2027.html) |
| Document expiration for Acrobat Sign agreements set from an AEM adaptive form | Under Adobe's Early Adopter Program (already recorded in the AEM Forms research). XN10 does not include it. | "Setting document expiration for Adobe Sign agreements is under the Early Adopter Program." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/adaptive-forms-authoring/authoring-adaptive-forms-foundation-components/use-adobe-sign/working-with-adobe-sign) |
| Signing inside the form on AEM Forms Core Components | Not supported on the Cloud Service, in Adobe's words. AF08 (already in the tool) signs through the Sign Document workflow step, and XN10 is scoped for Foundation Components forms, where signing follows submission. | "The service does not support in-form signing experience and does not include the Summary and Verify components for Adaptive Form." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/forms-overview/notable-changes) |
| The classic send experience in Acrobat Sign | Adobe says the modern version is the focus of current development. SG03 and SG04 assume the current authoring and send experience. | "The below article describes the functionality for the "classic" process of sending an agreement." (https://helpx.adobe.com/sign/using/send-document-for-signature.html) |
| Other Acrobat Sign connectors: Microsoft Dynamics 365, ServiceNow, SAP SuccessFactors, NetSuite, Veeva Vault, Coupa, SugarCRM, Zapier, Microsoft Search | Documented by Adobe, but not costed. SG10 to SG12 cover Salesforce, Microsoft 365 and Workday, the three Adobe names first; any of the others can be added as its own line with an ext on request. | "You can use Acrobat Sign inside other applications your organization already uses, such as Microsoft, Salesforce, Workday, and Marketo to name a few." (https://experienceleague.adobe.com/en/docs/document-cloud-learn/sign-learning-hub/integrations/integrations-overview) |
| Notarization, online payments and bio-pharma settings in Acrobat Sign | Documented by Adobe, but not costed: each depends on a third party or a regulated use case (a notarization partner, a payment provider, 21 CFR Part 11 validation) that should be scoped with the client, not sold as a standard line. |  |
| Adobe Express AI Assistant inside Acrobat (designs created from a prompt) | Adobe says it is in beta. XN20 covers the Express design tools, templates and image editing in Acrobat, which carry no label. | "Adobe Express AI Assistant is in beta and uses partner (non-Adobe) models to help generate content." (https://helpx.adobe.com/acrobat/desktop/edit-documents/enhance-pdfs-with-adobe-express/design-express-acrobat.html) |
| Acrobat security policies stored on an AEM Forms server (the acrobat-aemforms tie) | AEM 6.5 Forms on JEE only. Acrobat applies organizational policies that an administrator stores on an AEM Forms server with Document Security, and Adobe documents that capability for AEM Forms on JEE; the tool carries AEM Forms as a Cloud Service. | "The document security capability is available only in AEM Forms on JEE." (https://experienceleague.adobe.com/en/docs/experience-manager-65/content/forms/install-aem-forms/jee-installation/installing-and-configuring-the-document-security-server) |
| PDF preview and annotation in AEM Assets (the acrobat-aemassets tie) | Documented and built in: AEM Assets shows PDFs in the Document Cloud PDF Viewer with nothing for a partner to set up, so there is no service to cost. Raised as an open question: show the pair with no services, or leave it off. | "Experience Manager Assets integrates with the Document Cloud PDF Viewer seamlessly, which lets you preview multiple pages of a PDF document." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/manage-pdf-documents) |
| Acrobat document protection: security policies, redaction, and Microsoft Purview Information Protection labels | Documented in the Acrobat help as things a user or an IT team does in the app; covered by the training line (AB11), not costed as their own services. |  |
| Acrobat Express, the plan (Adobe Express Premium with AI Assistant and PDF Spaces) | A plan, not a service. Adobe says it is available in English only, so it is named here and not in a card; AB01 assigns whichever Acrobat plan your client holds. | "Adobe Acrobat Express is a subscription offering for business professionals that brings together Adobe Express Premium, Acrobat AI Assistant, and PDF Spaces." (https://helpx.adobe.com/acrobat/desktop/get-started/access-the-app/deploy-acrobat-express-enterprise.html) |
| The number of free Document Transactions and any other price or allowance for Acrobat Services | Adam's rule: no software pricing. The cards say only that volumes above the free allowance need paid credentials under a written agreement. | "Paid credentials enable a greater processing quota and require entering into a separate written agreement." (https://developer.adobe.com/document-services/docs/overview/limits/) |

## What a partner would get wrong

### AEM Guides

- Guides is not a package the partner installs any more: it is an add-on selected in Cloud Manager, and each environment gets it when its pipeline runs. "No additional configuration is required in your CM git codebase for installing Experience Manager Guides." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/deploy-conf-aemg-cs/conf-deployment-dispatcher-cs)
- Migration is where the hours go, and it only works on well structured source documents. "If your document is not well structured, the process might not work as expected." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/migrate-content-cs/non-dita-content)
- The machine translation that works out of the box is not a production service; a client that translates needs its own provider (GD06). "Microsoft Translator is available only as a trial license." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/translate-content/translation)
- Publishing Sites pages can drag the DITA source files to the publish tier with them unless an administrator sets the replication option. "This occurs because AEM treats DITA assets as dependencies of the generated Sites pages." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/bulk-activation/dita-assets-replication-aem-sites)
- The AEM Sites preset needs the Sites structure built from Adobe's Guides templates first, and those arrive through the Cloud Manager repository, not through a console upload. "Before configuring the AEM Sites preset for Experience Manager Guides, your administrator needs to create an AEM Sites structure using the templates." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/output-presets-aemg/aem-sites/generate-output-aem-site-web-editor)
- For Edge Delivery Services the repository must be public, and for GitLab the site must not be made with the one-click option. "Ensure that the repository visibility is set to Public so it can be accessed by EDS." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/knowledge-base/kb-articles/publishing/configure-eds) "Sites created that way do not give you the admin permissions required for the later steps." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/knowledge-base/kb-articles/publishing/configure-eds-gitlab)
- A Content Fragment can take only topic elements that carry an id. "You can choose only those elements in a topic that have an id attribute defined." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/generate-output/single-topic-publishing/publish-content-fragment)
- The Workfront integration breaks quietly if the custom form is not exactly as Adobe lists it, or if email addresses differ between the two products. "The name and values for each task type must be exactly same as mentioned in the above table." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/aemg-integrations/conf-workfront)
- The Coworker skills need Coworker onboarding and credits, and then a request to Adobe; an administrator cannot switch them on alone. "After the configuration is complete for your environment, contact the Customer Success team to enable Agentic mode." (https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/editor-configs/editor-cloud-settings/configure-ai-assistant-agentic-mode-cs)

### Acrobat and Acrobat Services

- The box holds two different sales: the apps (licenses and deployment, mostly IT work) and the APIs (where partner hours are). Only the viewer API is free. "The latter two APIs and their SDKs are bundled into Adobe PDF Services API as part of a paid offering. PDF Embed API is a free offering." (https://developer.adobe.com/document-services/docs/overview/)
- API credentials belong on a server. A design that calls the PDF Services API from a browser or a phone is wrong. "The SDK only supports server-based use cases where credentials are saved securely in a safe environment." (https://developer.adobe.com/document-services/docs/overview/pdf-services-api/)
- Documents are processed in the United States unless the Europe region is configured, and that is possible only on the purchased offering. "Once you purchase PDF Services API, its APIs can be configured to process the documents in a specified region that is listed below." (https://developer.adobe.com/document-services/docs/overview/pdf-services-api/howtos/service-region-configuration-for-apis)
- Automatic tagging does not make a PDF accessible by itself, and it replaces tags that are already there (AB08 includes the correction work). "The service replaces any existing tags within your document, so it provides the most benefit for PDFs that have no tags or low-quality tags." (https://developer.adobe.com/document-services/docs/overview/pdf-accessibility-auto-tag-api/)
- Accessibility tagging and electronic seals use up the allowance much faster than other operations. "10 Document Transactions (per page)" (https://developer.adobe.com/document-services/docs/overview/limits/)
- An electronic seal needs a certificate hosted by a trust service provider that meets Adobe's conditions, which the client must contract. "These TSPs must support explicit authorization (based on a static PIN only), and the OAuth 2.0 client credential authorization flow." (https://developer.adobe.com/document-services/docs/overview/pdf-electronic-seal-api/)
- The PDF viewer shows an error on any domain its client ID was not registered for, so staging and production each need one. "If the client ID is incorrect or you are using it on a domain other than the one you registered, then the PDF preview is blocked with an error message." (https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/gettingstarted/)
- The AI Assistant license must sit in the same Admin Console as the Acrobat license. "Both the Acrobat license and the AI Assistant license must appear in the same Admin Console to assign them to users." (https://helpx.adobe.com/acrobat/desktop/use-acrobat-ai/set-up-acrobat-generative-ai/acrobat-studio-enterprise.html)
- A PDF restyled in Adobe Express does not flow back into the PDF in Acrobat. "Changes made in Express will not automatically merge with Acrobat." (https://helpx.adobe.com/acrobat/desktop/edit-documents/enhance-pdfs-with-adobe-express/express-features.html)
- For new AEM sites Adobe itself points away from the Core Components page that documents the PDF Viewer component. "However for new projects, Adobe recommends leveraging Edge Delivery Services." (https://experienceleague.adobe.com/en/docs/experience-manager-core-components/using/wcm-components/pdf-viewer)
- PDF analytics in Adobe Analytics is not automatic: the site must use the same report suite, and two processing rules must be created. "You'll need to create two rules and configure them so that you can map collected events and event attributes to Analytics variables." (https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtodata)
- Workfront has no PDF step of its own; the work is done in Workfront Fusion, which some packages do not include. "If your organization has a Select or Prime Workfront package that does not include Workfront Automation and Integration, your organization must purchase Adobe Workfront Fusion." (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/pdf-modules)

### Acrobat Sign

- The plan decides what can be built. E-signing inside Acrobat Standard and Acrobat Pro has no custom send workflows and no bulk sending from a file. "Acrobat Standard and Acrobat Pro: Manual user input supported; CSV import not supported" (https://helpx.adobe.com/sign/web/advanced-users/send-in-bulk/overview.html)
- A web form is a public address; without signer authentication anyone can fill it in. "An unlimited number of users can naturally access a web form as it is a public URL." (https://helpx.adobe.com/sign/web/advanced-users/webforms/create.html)
- Knowledge-based authentication works for people in the United States only and is bought by the transaction. "KBA is only applicable to US-based recipients." (https://helpx.adobe.com/sign/web/settings-configuration/send-settings/knowledge-based-auth.html)
- Acrobat Sign authentication makes a signer without an Adobe account create one, which suits staff better than customers. "Recipients who don't have an Adobe account tied to the email address the agreement is sent to will be required to create a new Adobe user account to complete the verification process." (https://helpx.adobe.com/sign/web/settings-configuration/send-settings/acrobat-sign-auth.html)
- Identity providers on the Digital Identity Gateway are contracted by the client with each provider, not included. "All IDP services require a commercial contract and configuration with the provider prior to use along with ongoing monitoring to ensure that your organization maintains a sufficient volume of IDP service transactions for your use cases." (https://helpx.adobe.com/sign/web/settings-configuration/digital-identity/digital-identity-gateway.html)
- The API is not on every plan, and the older SOAP API is no longer supported. "API access is reserved exclusively for enterprise and developer tier accounts." (https://helpx.adobe.com/sign/web/developers/rest-apis/api.html) "Support for the legacy SOAP APIs has ended as of May 2021." (https://helpx.adobe.com/sign/web/developers/rest-apis/api.html)
- Nothing is deleted until a retention rule says so, and a rule deletes for good; agree the archive first (SG08). "By default, agreements and transaction data are retained in Acrobat Sign while the account is active unless they are manually deleted or governed by a retention rule." (https://helpx.adobe.com/sign/web/settings-configuration/data-governance/overview.html)
- The sandbox is bought separately and starts empty. "The Sandbox does not mirror your existing production account when delivered." (https://helpx.adobe.com/sign/web/developers/sandbox/overview.html)
- In AEM Forms the connection needs an Acrobat Sign developer account and API application, and forms on Core Components cannot sign inside the form. "The service does not support in-form signing experience and does not include the Summary and Verify components for Adaptive Form." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/forms-overview/notable-changes)
- In Workfront Fusion, plan for a new agreement each time; changing one that is out for signature is the hard path. "Agreements are not typically changed once started." (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-sign-modules)
- Marketo Engage and Acrobat Sign do not connect directly; the agreement data travels through Salesforce or Microsoft Dynamics. "This integration uses Acrobat Sign, Acrobat Sign for Salesforce, Marketo, and the Marketo and Salesforce Sync." (https://experienceleague.adobe.com/en/docs/document-cloud-learn/sign-learning-hub/integrations/marketo/marketo-salesforce-reminder)
- In Microsoft Teams the app can no longer be added as a channel tab. "You can no longer add Adobe Acrobat Sign as a tab in the Teams channel." (https://helpx.adobe.com/sign/web/integrations/microsoft-teams/teams.html)
- For Workday, the account that connects should be a service account, because users in multiple groups is on by default. "When creating an Adobe Acrobat Sign account, create a non-user-specific account email (a service account) that is specific to the Workday Group." (https://helpx.adobe.com/sign/web/integrations/workday/workday-installation-guide.html)

## Overlaps with lines already in the catalog (flagged, not changed)

- **AF08 E-signature with Acrobat Sign** (AEM Forms, optional, ext "Acrobat Sign Solutions") already covers the Acrobat Sign API application, the cloud configuration on Author and Publish and the Sign Document workflow step. The AEM Forms trail said it would move to a connection if Acrobat Sign joined the catalog. `acrobatsign-aemforms` therefore carries one new line only (XN10, signing on Foundation Components forms); AF08 should move onto the connection, with its ext dropped, when wave 3 is built.
- **AF09 Form analytics with Adobe Analytics** is in the same position for the Adobe Analytics helper; not touched here.
- **AF12 to AF15 (AEM Forms Communications APIs)** generate documents from XDP templates; **AB05** generates them from Word templates through Acrobat Services. Different products for the same client need. The Acrobat notes say not to sell both for the same documents.
- **AF10 PDF form conversion** produces Foundation Components forms, which is why XN10 names them.
- **EP02 and EP03 (Adobe Express brands and locked templates)** are what XN20 makes available to Acrobat users; XN20 does not build them again.
- **XJ16 and the other Workfront Fusion lines** follow the same pattern as XN11, XN12 and XN18: a connection of kind extension with ext "Workfront Fusion". No Fusion line for Acrobat Sign or PDF Services existed.
- **AXD07 and AXD06 (PDF links and assets on Edge Delivery)** do not embed a viewer; no overlap with XN19, which is the AEM Sites Core Component.
- No line in the catalog covers DITA, Guides, e-signature account setup or the Acrobat Services APIs; a search of the 405 catalog lines for sign, PDF, Acrobat and DITA found only the AEM Forms lines above.

## Open questions for Adam

1. **Coworker in AEM Guides: keep it?** Adobe's feature pages show no beta label, but its legal notice for the Guides AI Assistant still calls it "the Beta", and Adobe switches the Coworker part on by request. Recommendation: keep the Coworker connection with "Adobe confirms it is enabled" as a condition, and leave the older Standard-mode assistant out.
2. **Acrobat Sign with AEM Forms: move the existing e-signature service onto the new connection?** Today it is an AEM Forms service tagged "Also needs Acrobat Sign Solutions". Recommendation: yes, move AF08 to the connection and add the one new service (XN10).
3. **Acrobat Sign with Marketo Engage goes through a CRM. Show it as a connection?** Adobe documents it only in tutorials that use Salesforce or Microsoft Dynamics in between. Recommendation: show it, marked as a route the partner sets up, with the CRM as "also needs"; Marketo is the biggest base in the book.
4. **Acrobat and Adobe Analytics, and Acrobat and AEM Assets.** The first (PDF reading events into Adobe Analytics) is written here although Adobe Analytics is another helper's product, and that helper's file does not have it; the second is built in with nothing to set up. Recommendation: build the Adobe Analytics connection from this file, and leave AEM Assets off the canvas for Acrobat.
5. **Acrobat as one box: are three starting services right?** The apps are mostly IT work (licenses, packages, training); the APIs are where partners earn, and all of them are optional here. Recommendation: keep it as drawn, so a client who only owns Acrobat sees a small starting scope and the API work is added by choice.

## Before merging into the canvas

- `acrobat-aa` uses the id `aa` for Adobe Analytics, which is not in the catalog yet; build it only with that product. `data_analytics.json` in this folder was checked when this trail was written and does not carry the pair, so there is one copy.
- `aemguides-cw` waits for question 1. Its first prerequisite is the standard Coworker eligibility sentence, with its `sow_prereq`.
- AF08 moves to `acrobatsign-aemforms` (question 2); until then the connection would show one optional service only.
- The connection `note` fields are file notes for the builder, not card text.
- Three services carry both an ext and a tier (AB09, AB10, XN18); check the card shows both tags.
- The Fusion prerequisite wording ("an additional purchase on Select and Prime packages") is about packaging, not price; reword if the copy check reads it as pricing.
- Version numbers appear only in evidence and source quotes; card fields say "the minimum Adobe names on its page".

## Pages downloaded and checked

94 pages. Each was downloaded in this pass and holds at least one quote used above or in `documents.json`.

| Page | Address |
|---|---|
| Adobe Developer: Acrobat Services APIs introduction | https://developer.adobe.com/document-services/docs/overview/ |
| Adobe Developer: Document Generation API overview | https://developer.adobe.com/document-services/docs/overview/document-generation-api/ |
| Adobe Developer: Licensing and usage limits (PDF Services API) | https://developer.adobe.com/document-services/docs/overview/limits/ |
| Adobe Developer: PDF Accessibility Auto-Tag API overview | https://developer.adobe.com/document-services/docs/overview/pdf-accessibility-auto-tag-api/ |
| Adobe Developer: PDF Electronic Seal API overview | https://developer.adobe.com/document-services/docs/overview/pdf-electronic-seal-api/ |
| Adobe Developer: PDF Embed API overview | https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/ |
| Adobe Developer: PDF Embed API getting started | https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/gettingstarted/ |
| Adobe Developer: PDF Embed API analytics | https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtodata |
| Adobe Developer: PDF Extract API overview | https://developer.adobe.com/document-services/docs/overview/pdf-extract-api/ |
| Adobe Developer: PDF Services API overview | https://developer.adobe.com/document-services/docs/overview/pdf-services-api/ |
| Adobe Developer: Service region configuration for PDF Services APIs | https://developer.adobe.com/document-services/docs/overview/pdf-services-api/howtos/service-region-configuration-for-apis |
| Experience League: Getting credentials for Microsoft Power Automate (Acrobat Services tutorial) | https://experienceleague.adobe.com/en/docs/acrobat-services-learn/tutorials/pdfservices/getting-credentials-power-automate |
| Experience League: Accelerate your sales process (Acrobat Services tutorial) | https://experienceleague.adobe.com/en/docs/acrobat-services-learn/tutorials/usecases/acceleratesales |
|  | https://experienceleague.adobe.com/en/docs/brand-visibility/using/dashboards/agentic-traffic |
| Experience League: Acrobat Sign tutorials, administrators overview | https://experienceleague.adobe.com/en/docs/document-cloud-learn/sign-learning-hub/admin-set-up/intro-admin-overview |
| Experience League: Acrobat Sign tutorials, integrations overview | https://experienceleague.adobe.com/en/docs/document-cloud-learn/sign-learning-hub/integrations/integrations-overview |
| Experience League: Send reminders using Acrobat Sign for Salesforce and Marketo | https://experienceleague.adobe.com/en/docs/document-cloud-learn/sign-learning-hub/integrations/marketo/marketo-salesforce-reminder |
| Experience League: Send notifications using Acrobat Sign for Salesforce and Marketo | https://experienceleague.adobe.com/en/docs/document-cloud-learn/sign-learning-hub/integrations/marketo/marketo-salesforce-sms |
| Experience League: Installing and configuring document security (AEM 6.5 Forms on JEE) | https://experienceleague.adobe.com/en/docs/experience-manager-65/content/forms/install-aem-forms/jee-installation/installing-and-configuring-the-document-security-server |
| Experience League: Manage PDF documents in Experience Manager Assets as a Cloud Service | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/manage-pdf-documents |
| Experience League: Use Adobe Sign in an Adaptive Form | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/adaptive-forms-authoring/authoring-adaptive-forms-foundation-components/use-adobe-sign/working-with-adobe-sign |
| Experience League: Notable changes in AEM Forms as a Cloud Service | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/forms-overview/notable-changes |
| Experience League: Connect AEM Forms as a Cloud Service with Adobe Acrobat Sign | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/services/adobe-sign-integration-adaptive-forms |
| Experience League: PDF Viewer Component (AEM Core Components) | https://experienceleague.adobe.com/en/docs/experience-manager-core-components/using/wcm-components/pdf-viewer |
| Experience League: Template presets for output generation | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/aemg-customization/template-presets-output-generation |
| Experience League: Translate content (AEM Guides configuration) | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/aemg-integrations/conf-translation |
| Experience League: Configure Adobe Workfront for Cloud Service (AEM Guides) | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/aemg-integrations/conf-workfront |
| Experience League: Configure the AEM Guides MCP server | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/aemg-integrations/mcp/configure-aem-guides-mcp |
| Experience League: Deployment and dispatcher configuration (AEM Guides) | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/deploy-conf-aemg-cs/conf-deployment-dispatcher-cs |
| Experience League: Configure AI Assistant in Agentic mode for Cloud Service | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/editor-configs/editor-cloud-settings/configure-ai-assistant-agentic-mode-cs |
| Experience League: Configure global or folder-level profiles | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/global-folder-profiles/conf-profiles |
|  | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/introduction |
| Experience League: Migrate existing content (AEM Guides) | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/migrate-content-cs/migrate-content |
| Experience League: Migrate non-DITA content | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/migrate-content-cs/non-dita-content |
| Experience League: Customize DITA element mapping with AEM components | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/output-gen-config/conf-aem-sites-output/customize-dita-element-mapping-aem-components |
| Experience League: Download and install AEM Sites templates | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/output-gen-config/conf-aem-sites-output/download-install-aem-sites-templates |
| Experience League: User administration and security (AEM Guides) | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/install-conf-guide/user-group-sec-cs/user-admin-sec |
| Experience League: Experience Manager Guides and Edge Delivery Services | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/knowledge-base/kb-articles/publishing/configure-eds |
| Experience League: Set up and configure GitLab for Edge Delivery Services | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/knowledge-base/kb-articles/publishing/configure-eds-gitlab |
| Experience League: Configure microservice-based publishing with OAuth authentication | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/knowledge-base/kb-articles/publishing/configure-microservices-imt-config |
| Experience League: What's new in the 2025.02.0 release (AEM Guides) | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/release-info/release-notes/cloud-release-notes/2025-releases/2502-release/whats-new-2025-02-0 |
| Experience League: What's new in the 2026.05.0 release (AEM Guides) | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/release-info/release-notes/cloud-release-notes/2026-releases/2605-release/whats-new-2026-05-0 |
| Experience League: What's new in the 2026.06.0 release (AEM Guides) | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/release-info/release-notes/cloud-release-notes/2026-releases/2606-release/whats-new-2026-06-0 |
| Experience League: About Adobe Experience Manager Guides | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/about-aemg/intro |
| Experience League: Adobe Experience Manager Guides Generative AI user disclosures | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/ai-assistant-aem/adobe-generative-ai-disclosures |
| Experience League: AI Assistant (AEM Guides) | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/ai-assistant-aem/ai-assistant |
| Experience League: Smart tagging with AI Assistant (AEM Guides) | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/ai-assistant-aem/ai-assistant-agentic/ai-assistant-agentic |
| Experience League: Overview of the Product Training and Learning content | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/learning-training-content/get-started/intro-lc/intro |
|  | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/learning-training-content/get-started/publish-course/scorm-output/config-scorm-preset |
| Experience League: Manage replication of DITA source assets | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/bulk-activation/dita-assets-replication-aem-sites |
| Experience League: Publish Content Fragments (AEM Guides) | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/generate-output/single-topic-publishing/publish-content-fragment |
| Experience League: Publish Experience Fragments (AEM Guides) | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/generate-output/single-topic-publishing/publish-experience-fragment |
| Experience League: AEM Sites preset in the Map console | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/output-presets-aemg/aem-sites/generate-output-aem-site-web-editor |
| Experience League: Knowledge Base output preset | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/output-presets-aemg/generate-output-knowledge-base |
| Experience League: Native PDF output preset | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/output-presets-aemg/pdf-preset/native-pdf-web-editor |
| Experience League: Work with Baseline from the Map dashboard | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/output-gen/work-with-baseline/generate-output-use-baseline-for-publishing |
| Experience League: Introduction to reports (AEM Guides) | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/reports-aem-guide/reports-intro |
|  | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/map-management-publishing/translate-content/translation |
| Experience League: Workfront integration (AEM Guides) | https://experienceleague.adobe.com/en/docs/experience-manager-guides/using/user-guide/workfront-integration/workfront-integration |
| Experience League: Adobe Acrobat Sign modules (Workfront Fusion) | https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-sign-modules |
| Experience League: Adobe PDF Services modules (Workfront Fusion) | https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/pdf-modules |
|  | https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-general-information/planning-cx-coworker-overview |
| Adobe Help: Convert files to PDF (Acrobat) | https://helpx.adobe.com/acrobat/desktop/create-documents/create-pdfs/convert-to-pdf.html |
| Adobe Help: E-signatures in Acrobat | https://helpx.adobe.com/acrobat/desktop/e-sign-documents/learn-about-signatures/e-sign-overview.html |
| Adobe Help: Create designs with Adobe Express in Acrobat | https://helpx.adobe.com/acrobat/desktop/edit-documents/enhance-pdfs-with-adobe-express/design-express-acrobat.html |
| Adobe Help: Adobe Express features in Acrobat | https://helpx.adobe.com/acrobat/desktop/edit-documents/enhance-pdfs-with-adobe-express/express-features.html |
| Adobe Help: Acrobat Express for enterprise and teams | https://helpx.adobe.com/acrobat/desktop/get-started/access-the-app/deploy-acrobat-express-enterprise.html |
| Adobe Help: Administer Acrobat Studio for enterprise | https://helpx.adobe.com/acrobat/desktop/use-acrobat-ai/set-up-acrobat-generative-ai/acrobat-studio-enterprise.html |
| Adobe Help: What's new in Adobe Acrobat on desktop | https://helpx.adobe.com/acrobat/desktop/whats-new/whats-new-acrobat-desktop.html |
| Adobe Help: Create Acrobat-only deployment packages | https://helpx.adobe.com/enterprise/using/deploying-acrobat.html |
| Adobe Help: Request signatures using the classic environment | https://helpx.adobe.com/sign/using/send-document-for-signature.html |
| Adobe Help: Set up your Acrobat Sign company account | https://helpx.adobe.com/sign/web/administers/admin-guide.html |
| Adobe Help: Manage Groups in Adobe Acrobat Sign | https://helpx.adobe.com/sign/web/administers/group-management/groups.html |
| Adobe Help: Authenticate recipients with Admin Console single sign-on (Acrobat Sign) | https://helpx.adobe.com/sign/web/administers/user-provisioning/authenticate-with-admin-console-sso.html |
| Adobe Help: Custom Workflow Designer overview (Acrobat Sign) | https://helpx.adobe.com/sign/web/advanced-users/custom-workflows/overview.html |
| Adobe Help: Power Automate embedded integration retirement (Acrobat Sign) | https://helpx.adobe.com/sign/web/advanced-users/power-automate-workflows/power-automate-embedded-integration-retirement-in-2027.html |
| Adobe Help: Pre-built library templates (Acrobat Sign) | https://helpx.adobe.com/sign/web/advanced-users/reusable-templates/adobe-sign-library-templates.html |
| Adobe Help: Create a library template (Acrobat Sign) | https://helpx.adobe.com/sign/web/advanced-users/reusable-templates/create-template.html |
| Adobe Help: Overview of Send in Bulk (Acrobat Sign) | https://helpx.adobe.com/sign/web/advanced-users/send-in-bulk/overview.html |
| Adobe Help: Create a web form (Acrobat Sign) | https://helpx.adobe.com/sign/web/advanced-users/webforms/create.html |
| Adobe Help: Acrobat Sign REST API | https://helpx.adobe.com/sign/web/developers/rest-apis/api.html |
| Adobe Help: Acrobat Sign Sandbox overview | https://helpx.adobe.com/sign/web/developers/sandbox/overview.html |
| Adobe Help: Acrobat Sign webhooks overview | https://helpx.adobe.com/sign/web/developers/webhooks/overview.html |
| Adobe Help: Create forms with Acrobat form fields (Acrobat Sign) | https://helpx.adobe.com/sign/web/form-field-authors/create-forms-with-acrobat/create-forms-with-acrobat.html |
| Adobe Help: Acrobat Sign for Salesforce installation guide | https://helpx.adobe.com/sign/web/integrations/acrobat-sign-for-salesforce/salesforce-installation-guide.html |
| Adobe Help: Adobe Acrobat Sign Integrations | https://helpx.adobe.com/sign/web/integrations/home.html |
| Adobe Help: Adobe Acrobat Sign for Microsoft 365 | https://helpx.adobe.com/sign/web/integrations/microsoft-office/microsoft-365.html |
|  | https://helpx.adobe.com/sign/web/integrations/microsoft-teams/teams.html |
| Adobe Help: Adobe Acrobat Sign for Workday installation guide | https://helpx.adobe.com/sign/web/integrations/workday/workday-installation-guide.html |
| Adobe Help: Data governance overview (Acrobat Sign) | https://helpx.adobe.com/sign/web/settings-configuration/data-governance/overview.html |
| Adobe Help: Acrobat Sign Digital Identity Gateway | https://helpx.adobe.com/sign/web/settings-configuration/digital-identity/digital-identity-gateway.html |
|  | https://helpx.adobe.com/sign/web/settings-configuration/send-settings/acrobat-sign-auth.html |
| Adobe Help: Knowledge-based authentication (Acrobat Sign) | https://helpx.adobe.com/sign/web/settings-configuration/send-settings/knowledge-based-auth.html |
| Adobe Help: Agreement reports (Acrobat Sign) | https://helpx.adobe.com/sign/web/users/reporting-and-exporting-data/agreement-reports.html |

Read for context only, no quote taken: https://www.adobe.com/acrobat/business/sign.html (Adobe's Acrobat e-signature page for business) and https://www.adobe.com/devnet-docs/acrobatetk/tools/Wizard/index.html (the Acrobat Customization Wizard guide that AB02 points to).

## Pages not read

- https://business.adobe.com/products/experience-manager/guides/aem-guides.html: Tried once with curl; the connection ended with an error and no page came back. Not tried again. No business.adobe.com page was read in this pass.
- https://github.com/adobe/aem-core-wcm-components: The PDF Viewer component page points to GitHub for the detail of its context-aware configuration. GitHub is not one of the allowed sources, so it was not read; XN19 is scoped from Adobe's sentence on Experience League.
- https://github.com/adobe/aem-guides-boilerplate: Adobe's Guides boilerplate for Edge Delivery Services. Not an allowed source; XN05 and XN06 are scoped from the Experience League article.
- https://help.frame.io: Refused by this session's network settings in wave 2 and not attempted in this pass. The Frame.io side of acrobat-frameio rests on the Adobe pages read for wave 2.
