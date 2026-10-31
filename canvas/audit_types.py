"""Connection types and wording for the Build canvas (audit fix, Oct 31 2026).

Reads research/audit_classification_2026-10-31.json (every connection classified from Adobe's pages, then checked by two
skeptics), applies the skeptics' corrections, adds the corrected card wording below, and writes
research/connection_types.json, which build.py merges into the catalog. The same file carries corrections to research
lines whose names, scopes or sources said more than Adobe documents; the research files keep what the research found.
Re-running it gives the same result.

    python3 audit_types.py && python3 build.py
"""
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
R = os.path.join(HERE, 'research')
KIND = {'native integration': 'native', 'shared-platform data path': 'platform', 'supported extension': 'extension',
        'partner-designed workflow': 'partner'}
NOT_STATED = "Not stated by Adobe; confirm for the client's tenant."
EL = 'https://experienceleague.adobe.com/en/docs/'
SRC = {
    'cw_workflows': {'url': EL + 'coworker/content/chat/use-cases/workflows', 'title': 'Experience League: Coworker Chat workflows'},
    'so_settings': {'url': EL + 'experience-manager-sites-optimizer/content/documentation/settings', 'title': 'Experience League: Sites Optimizer settings'},
    'so_author': {'url': EL + 'experience-manager-sites-optimizer/content/documentation/opportunities/deploying-to-author', 'title': 'Experience League: Sites Optimizer, deploying to author'},
    'aem_websdk': {'url': EL + 'experience-manager-learn/sites/integrations/experience-platform/web-sdk', 'title': 'Experience League: Integrate AEM Sites and Experience Platform Web SDK'},
    'oae': {'url': EL + 'brand-visibility/using/resources/optimize-at-edge/overview', 'title': 'Experience League: Brand Visibility, Optimize at Edge'},
    'bc_ks': {'url': EL + 'brand-concierge/content/documentation/knowledge-sources/knowledge-sources', 'title': 'Experience League: Brand Concierge knowledge sources'},
    'bc_deploy': {'url': EL + 'brand-concierge/content/documentation/deployment/deployment', 'title': 'Experience League: Deploy a Brand Concierge'},
    'commerce_dc': {'url': EL + 'commerce/data-connection/fundamentals/overview', 'title': 'Experience League: Commerce Data Connection'},
    'cw_chat': {'url': EL + 'coworker/content/chat/overview', 'title': 'Experience League: Coworker Chat overview'},
    'cw_exp': {'url': EL + 'coworker/content/chat/use-cases/optimization/accelerate-experimentation', 'title': 'Experience League: Accelerate experimentation with Coworker'},
    'target_dest': {'url': EL + 'experience-platform/destinations/catalog/personalization/adobe-target-connection', 'title': 'Experience League: Adobe Target connection'},
    'mkto_dest': {'url': EL + 'experience-platform/destinations/catalog/adobe/marketo-engage-connection', 'title': 'Experience League: Marketo Engage connection destination'},
}

# Adobe's availability, short enough for the card; anything not listed uses the classification's own words when they
# name a status, or NOT_STATED
AVAIL = {
    'bv-cja': 'Not stated by Adobe; the integration works once it is enabled for the organization.',
    'so-eds': 'Core Web Vitals pull requests are Early Access, on request; the rest is not stated by Adobe.',
    'bv-commerce': "Enrich Product Detail Pages carries no status, and Adobe doesn't say which Commerce setups the connection supports; Product Catalog Enrichment, which writes to the catalog, is Beta.",
    'cw-cja': 'Coworker Chat is generally available; the CJA B2B edition is coming soon.',
    'cw-eds': 'Coworker Chat is generally available; AEM agents come through Try Before You Buy or the Agentic SKU.',
    'cw-bc': "Not stated by Adobe: Brand Concierge isn't on Coworker's compatible applications list, and the route is documented as a video tutorial.",
    'target-cja': "Not stated by Adobe; Auto-Target and Automated Personalization don't yet support CJA as the reporting source.",
    'aemassets-workfront': 'Not stated by Adobe; only for organizations onboarded to the Adobe Admin Console.',
    'aemassets-marketo': 'Not stated by Adobe; access depends on contract and configuration, and only images are supported.',
    'aemsites-bv': 'Not stated by Adobe. Trial limits conflict: one opportunity on up to 10 pages (Optimize at Edge FAQ), or up to 50 URLs for one opportunity type for trials from April 1, 2026 (Quick Start).',
    'aemsites-so': 'Deploying to author is not stated by Adobe; Core Web Vitals pull requests and Dispatcher redirects are Early Access, on request.',
    'aemassets-eds': 'aem.live calls Dynamic Media references and non-image assets an Early Adopter program; Experience League gives no label.',
    'aemsites-cw': 'Coworker Chat is generally available; AEM agents come through Try Before You Buy, a trial or the Agentic SKU.',
    'aemassets-cw': 'Coworker Chat is generally available; AEM agents come through Try Before You Buy, a trial or the Agentic SKU.',
    'aemsites-workfront': "Early Access for the Universal Editor plugin (not generally available yet); the Fusion route's status is not stated.",
    'aemsites-bc': "Generally available in Brand Concierge; not stated for Content AI on the AEM side, so confirm for the client's environment.",
    'rtcdp-target': 'Generally available.',
    'ajo-target': "Legacy: Adobe marks offer decisions in Target and Journey Optimizer Decision Management as Legacy; confirm Adobe's direction before new work.",
    'rtcdp-bc': 'Limited Availability for Real-Time CDP context in replies; the FAQ says the current scope is anonymous visitors.',
    'ajo-bc': 'Not documented: Experience League has no Journey Optimizer setup for Brand Concierge; confirm with Adobe.',
    'cja-bc': "Built-in dashboard: generally available. Analysis in the client's own CJA: not documented by Adobe; confirm the data use with Adobe.",
    'bc-eds': 'Generally available.',
    'bc-commerce': 'Catalog discovery and comparison are generally available; cart and checkout actions are planned.',
    'commerce-rtcdp': "Audience Activation is generally available for Commerce on Cloud and on-premises only; Data Connection's status is not stated.",
    'target-eds': 'Web SDK and at.js routes are documented on aem.live with no label; the martech plugin is co-innovation.',
    'ajo-eds': 'Co-innovation for the martech plugin; the Journey Optimizer web channel has no label, and a direct Web SDK route on Edge Delivery is not described by aem.live (prove it in a pilot).',
    'rtcdp-eds': 'Co-innovation for the martech plugin; Tags with Web SDK also works.',
    'cw-rtcdp': "Coworker Chat is generally available in Coworker's workspace; the in-product panel and the B2B edition are coming soon.",
    'cw-ajo': "Coworker Chat is generally available in Coworker's workspace; the in-product panel and the B2B edition are coming soon.",
    'cw-target': 'Generally available.',
    'marketo-rtcdp': 'Not stated for the whole route; the source connector is generally available on Experience Platform on AWS, which Adobe offers to a limited number of customers.',
    'marketo-cja': 'The Marketo source is generally available on Experience Platform on AWS; the CJA side gives no label.',
    'marketo-target': "Not stated by Adobe; a HIPAA-ready Marketo Engage instance can't use this feature.",
    'marketo-cw': "Adobe's pages conflict: all subscriptions, a staged beta rollout, and an in-product experience coming soon; confirm for the client.",
    'marketo-bc': 'Generally available.',
    'workfront-cw': 'Coworker Chat is generally available in Workfront, but Adobe says Coworker is not currently offered to health care, finance or some other industries.',
    'aemsites-aemassets': 'Not stated by Adobe; Dynamic Media with OpenAPI is enabled per environment through a support ticket.',
    'aemassets-ajo': 'Depends on the contract. Dynamic Media renditions need Dynamic Media as a Cloud Service with Dynamic Media with OpenAPI enabled; the Dynamic Media Template component is Limited Availability.',
    'aemsites-ajo': 'Not stated by Adobe; for health care customers it needs the Healthcare Shield and Extended Security for Healthcare add-ons.',
    'commerce-aemsites': 'Provisioned by Adobe through the sales representative; the CIF storefront and CIF Core Components are in maintenance mode.',
    'commerce-aemassets': 'Not stated by Adobe; free for merchants who meet the licensing requirements, with setup that differs by Commerce deployment.',
}

# where a skeptic split a connection into two types, or the same rule must apply to sibling connections
KIND_OVERRIDE = {
    'bv-cja': 'shared-platform data path',   # agent traffic reaches CJA as an Experience Platform dataset; only the Business Impact read is native
    'aemassets-eds': 'native integration',   # Universal Editor sites pick AEM Assets directly; documents and references need a plugin or picker
    'cw-cja': 'native integration',          # same rule the skeptic applied to Coworker with Real-Time CDP, Journey Optimizer and Target
}

# corrected wording; flows are keyed by their index on the card
WORDING = {
    'bv-cja': {'label': 'Agent traffic reaches CJA as an Experience Platform dataset the client adds to a connection; Brand Visibility reads CJA results natively for its Business Impact view',
               'gain': {'title': 'AI-agent activity and observed referral outcomes', 'text': 'Four separate measures: AI-agent activity (from CDN logs), monitored visibility (tracked prompts), AI-referred visits and conversions (CJA web data), and lift only from a test. The data is aggregate: nothing ties a person to an AI mention.'}},
    'bv-eds': {'label': 'Edge fixes reach AI agents only; lasting changes are made where the site is authored, through a partner-run workflow',
               'how': "Brand Visibility's edge fixes reach AI agents at the CDN without changing the pages people see; lasting fixes are made where the site is authored (AEM's Universal Editor, or Word and Google Docs) and published from there. Routing is self-serve on AEM as a Cloud Service's managed Fastly CDN; other CDNs need routing rules.",
               'gain': {'title': 'Built for search, readable by AI agents', 'text': 'Edge Delivery builds the fast, search-ready site; Brand Visibility shows where AI answers miss it and serves AI agents a fuller page.'},
               'flows': {'0': {'what': 'Edge fixes for AI agents (Optimize at Edge); lasting changes made where the site is authored, through a partner-run workflow', 'source': SRC['oae']}}},
    'so-eds': {'how': 'Sites Optimizer connects to the Edge Delivery site (its code repository and content source) and, with the Ultimate package, deploys approved SEO and content fixes to the source documents or authoring, where the team reviews and publishes them.',
               'source': SRC['so_settings'],
               'gain': {'title': 'Search-ready, and kept that way', 'text': 'Edge Delivery builds search in on day one; Sites Optimizer finds SEO and performance issues as the site grows and deploys suggested fixes to authoring for people to publish.'},
               'flows': {'0': {'what': 'SEO and content fixes deployed to the source documents or authoring for review; Core Web Vitals code patches as pull requests (Early Access)', 'source': SRC['so_author']}}},
    'bv-bc': {'label': 'Partner-managed question-to-approved-source workflow; no native connector assumed',
              'gain': {'title': 'Approved answers to AI-era questions', 'text': "The partner checks that the questions buyers ask AI assistants have approved Brand Concierge sources and tested answers on the brand's site."},
              'flows': {'0': {'what': 'Partner workflow, not a data feed: tracked questions mapped to approved sources and tested answers'}}},
    'bv-commerce': {'label': 'Brand Visibility reads the Commerce catalog and serves AI agents fuller product pages at the CDN',
                    'gain': {'title': 'Product pages AI agents can read', 'text': 'AI agents get the variants, specifications and attributes the catalog already holds, without a change to the storefront or the catalog.'}},
    'cw-cja': {'label': "Coworker Chat reads CJA directly (Adobe-built); partner Skills add the client's AI-channel readout",
               'how': "Coworker Chat reads CJA directly; partner-built Skills turn the client's agreed AI-channel measures in a validated data view into a repeatable readout.",
               'source': SRC['cw_workflows'],
               'gain': {'title': 'Readouts on request', 'text': "A partner-built Skill turns the client's agreed AI channel measures in CJA into a repeatable readout."},
               'flows': {'0': {'what': "A validated data view with AI referral fields, read by Coworker and the partner's Skills", 'source': SRC['cw_workflows']}}},
    'cw-eds': {'how': 'Coworker updates AEM pages, including Edge Delivery pages and bulk changes across many pages, where the client has Coworker and AEM agent access; authors review and publish.',
               'source': SRC['cw_workflows'],
               'gain': {'title': 'Bulk content changes, checked', 'text': 'Where AEM agent access is in place, the content team rolls an approved change across many pages in one request, checked against the brand, and authors publish.'},
               'flows': {'0': {'what': 'Approved changes across many pages, made in AEM for authors to publish', 'source': SRC['cw_workflows']}}},
    'cw-bc': {'how': 'Coworker queries Brand Concierge conversation datasets in Experience Platform (the CSV download needs Data Distiller); partner-built Skills summarize them and flag answers for people to review.',
              'gain': {'title': 'Conversation insights', 'text': 'A partner-built Skill summarizes exported conversations and flags answers for a person to review.'},
              'flows': {'0': {'what': 'Conversation datasets read through Experience Platform Query Service'}}},
    'rtcdp-cja': {'gain': {'title': 'Audiences from the whole journey', 'text': 'Real-Time CDP decides who to reach and sends them out; CJA shows what happened across every step. Counts differ by design, and CJA reports audience membership as of the previous day.'}},
    'target-cja': {'label': 'Supported Target activities report in CJA; CJA audiences reach Target through the Target destination'},
    'aemassets-workfront': {'gain': {'title': 'Finished work lands in the DAM', 'text': 'Documents sent from Workfront projects land in AEM Assets with mapped project metadata, so teams find and reuse them instead of uploading them again.'}},
    'aemsites-cja': {'gain': {'title': 'AEM pages in the full customer journey', 'text': "Content and marketing teams see AEM page views and CTA clicks in CJA next to the client's other channels, so they see which pages and calls to action come before conversions."},
                     'flows': {'0': {'what': 'Page views and CTA clicks from the AEM site, through Web SDK and an Experience Platform dataset', 'source': SRC['aem_websdk']}}},
    'aemsites-rtcdp': {'gain': {'title': 'Site behavior builds the profile', 'text': 'Visits collected with Web SDK into profile-enabled datasets add to the customer profile, so audiences reflect what people browse and read; with Target and the Target destination in place, the same audiences personalize AEM pages.'}},
    'aemsites-target': {'gain': {'title': 'Test and personalize with AEM content', 'text': 'Authors build offers as Experience Fragments in AEM and marketers use them in Target tests and personalization on AEM pages (not in Recommendations activities; JSON and Content Fragment offers only in Form-Based activities), while the content stays managed in AEM.'}},
    'aemassets-marketo': {'gain': {'title': 'One image library for email', 'text': 'In the new Email Designer, authors place images from a linked AEM Assets Delivery repository (images only); updates in AEM reach live emails without re-uploading, and deleting an image in AEM breaks the emails that use it.'}},
    'aemsites-bv': {'how': "On AEM as a Cloud Service's managed CDN, Brand Visibility's Optimize at Edge is self-serve when that CDN is the outer CDN (a customer CDN in front needs its own routing). The AI agents Adobe supports (ChatGPT, Perplexity, Claude) get the optimized version of pages where a fix is deployed; visitors and search bots still get AEM's pages.",
                    'gain': {'title': 'AEM pages AI agents can read', 'text': "Approved fixes reach supported AI agents from AEM's CDN without changing the pages visitors see; content fixes need a Last-Modified header and pause for review when the source page changes. Sampled AEM telemetry gives an approximate view of AI-referred visits, not person-level data."}},
    'aemsites-so': {'how': 'Sites Optimizer deploys approved fixes into AEM author (deploying is in the Ultimate package), where authors review and publish them; it does not publish to the live site itself, except Early Access Dispatcher redirects.',
                    'gain': {'title': 'Fixes land in AEM, ready to publish', 'text': 'SEO and accessibility fixes land in AEM author for authors to publish, and speed fixes can arrive as pull requests where a repository is connected and Adobe has enabled the Early Access feature.'},
                    'flows': {'1': {'what': 'Operational Telemetry from AEM pages (a page needs at least 1,000 page views to be analyzed), the real-user data behind Core Web Vitals findings'},
                              '3': {'what': "Code fixes as pull requests in the site's Git repository (Early Access)"}}},
    'aemsites-eds': {'gain': {'title': 'AEM authoring, Edge Delivery speed', 'text': 'Authors keep AEM Sites tools such as workflows, multi-site management, translation and launches (with the Universal Editor extensions enabled), visitors get fast Edge Delivery pages, and both can run on one domain during a phased move with CDN routing rules (AXD04).'}},
    'aemassets-eds': {'label': 'Built in for Edge Delivery sites authored in the Universal Editor; a Sidekick plugin or custom picker for documents and Dynamic Media references',
                      'how': "For Edge Delivery sites authored in AEM's Universal Editor, authors select AEM Assets directly and the assets publish with the page. For sites authored in Word or Google Docs, a configured AEM Assets Sidekick plugin inserts assets; Dynamic Media with OpenAPI references (approved assets only) need a custom asset picker.",
                      'gain': {'title': 'DAM assets on Edge Delivery pages', 'text': 'Authors pick assets from AEM Assets inside Word, Google Docs or the Universal Editor; with Dynamic Media references, pages stay current when assets change or expire, once block code renders the delivery URLs.'},
                      'flows': {'0': {'what': 'Assets published with Universal Editor pages, copied in from documents, or placed by Dynamic Media reference (approved assets only)'}}},
    'aemsites-cw': {'how': "Where the client has access to AEM's agentic capabilities, Coworker Chat works in AEM Sites: from a plain-language prompt it drafts and updates pages, on Page Editor sites as on Edge Delivery sites, builds Visual Content Fragments from Figma and helps developers with Cloud Manager and the Dispatcher.",
                    'gain': {'title': 'Pages drafted and updated by asking', 'text': 'Content teams describe a page or a change in plain words and Coworker drafts it in AEM Sites from an approved reference page for review; developers get AI diagnosis of build, code scan and config pipeline failures to review before acting.'}},
    'aemassets-cw': {'how': "Where the client has AEM agent access, AEM's Onboarding, Content Discovery and Content Optimization capabilities work through Coworker Chat: Coworker sets up folders, tags and metadata forms once the user confirms, finds assets by metadata or theme (and can filter to approved ones), and makes channel-ready renditions with a Dynamic Media license, Dynamic Media with OpenAPI and approved assets.",
                     'gain': {'title': 'Find, shape and set up assets by asking', 'text': 'Teams find assets in plain words and set up folders, tags and metadata forms with Coworker, confirming each change first; with Dynamic Media with OpenAPI they also get channel-ready renditions of approved assets.'},
                     'flows': {'1': {'what': 'Assets with their metadata, returned in chat, with Dynamic Media delivery URLs for approved assets where the client has Dynamic Media with OpenAPI'}}},
    'aemsites-workfront': {'how': "Where Adobe enables the Early Access plugin, content edited in AEM Sites' Universal Editor can link to Workfront tasks through task custom forms (the Page Editor has no Workfront integration). Workfront Fusion's AEM MCP connector can also read and update AEM pages and content through an AI-driven module; Adobe advises AI Assistant rather than MCP tools for changes, so keep Fusion scenarios read-only or check each change.",
                           'gain': {'title': 'Site content tracked with the work', 'text': "Where the Early Access plugin is enabled, content edited in the Universal Editor can link to Workfront tasks with preview and publish links (Adobe's tutorial shows the setup only)."},
                           'flows': {'1': {'what': "Fusion scenarios that read or update AEM pages and content through AEM's MCP server (AI-driven; keep them read-only or check each change)"}}},
    'aemsites-bc': {'how': 'Brand Concierge has a native AEM Sites knowledge source: for AEM Sites as a Cloud Service with Content AI enabled, the concierge answers from an existing Content AI index, and Content AI Search is among the integrations Adobe recommends for the Site Advisory skill.',
                    'gain': {'title': "Answers from the site's own index", 'text': 'The concierge answers from the AEM Sites content in the Content AI index, without uploads in Brand Concierge; how current it stays depends on how that index is kept up to date.'},
                    'flows': {'0': {'what': "Site content from the Content AI index, used as the concierge's knowledge source"},
                              '1': {'what': 'Named by Adobe, setup not documented; confirm: an AEM Sites or Content AI connection as a source for product cards in answers'}}},
    'rtcdp-ajo': {'how': 'Journey Optimizer and Real-Time CDP share Experience Platform profiles, identities and audiences. Journey Optimizer can also run on its own; Real-Time CDP adds its audience and activation tools on the same data.',
                  'gain': {'title': 'The right message from one profile', 'text': 'Email, push, SMS and web experiences are chosen from the same customer profile and audiences; with streaming audiences and events, timing and offers follow recent behavior.'}},
    'rtcdp-target': {'gain': {'title': 'Known-customer personalization in Target', 'text': 'Target activities can use audiences built from CRM, loyalty, purchase and offline data, not just web behavior. Acting on the same page needs Web SDK or the Edge Network API, a Target-enabled datastream, edge segmentation and an active-on-edge merge policy; without a datastream, audiences support next-session personalization only.'},
                     'flows': {'0': {'what': 'Streaming, batch and edge-evaluated audiences plus selected profile attributes (with a custom Target workspace, mapped attributes go to the default workspace)', 'source': SRC['target_dest']}}},
    'ajo-target': {'label': 'Journey Optimizer offer decisions in manual A/B and Experience Targeting activities (Legacy)',
                   'how': 'Manual A/B Test and Experience Targeting activities in Target can serve offer decisions built in Journey Optimizer (a Legacy capability), and Journey Optimizer organizations can share audiences to Target through the Target destination.',
                   'gain': {'title': 'Test decisioned offers on site', 'text': 'The same offer decision can serve web tests in manual A/B and Experience Targeting activities; report in Target (not Analytics for Target) at activity level, since Target gives no offer-decision level reporting.'},
                   'flows': {'1': {'what': "Experience Platform audiences, through Experience Platform's Target destination (a shared-platform path, open to Journey Optimizer organizations since August 2026)"}}},
    'rtcdp-bc': {'how': "Concierge events land in Experience Platform datasets. The baseline is anonymous visitors: Real-Time CDP context in replies is Limited Availability in the release notes, and the FAQ says there is no live profile lookup in the current scope, so before scoping profile use, get Adobe's written confirmation that the Limited Availability integration is enabled for the tenant.",
                 'gain': {'title': 'Conversation events for audiences; profile answers gated', 'text': "The conversation events Adobe documents (clicks, form submissions, booked meetings, live chats) can build audiences in the client's own Experience Platform; answers that draw on a visitor's profile wait for Adobe's confirmation of the Limited Availability integration."},
                 'flows': {'0': {'what': 'Limited Availability, gated: profile attributes and signals as conversation context, where Adobe confirms it for the tenant'},
                           '1': {'what': "Concierge events (clicks, form submissions, booked meetings, live chats) into Experience Platform datasets, for audiences under the client's own license"}}},
    'ajo-bc': {'label': 'No connector documented; Journey Optimizer follow-up is marketed, not documented',
               'how': "Adobe's product page describes Journey Optimizer follow-up after concierge conversations, but Experience League documents no setup. The documented follow-up routes today are the handoff to sales and Marketo Engage.",
               'gain': {'title': 'Follow-up after the conversation (not documented)', 'text': 'Not a documented capability: a visitor who showed intent in a concierge conversation could get a follow-up by email, SMS or other channels once Adobe documents the route.'},
               'flows': {'0': {'what': 'Unconfirmed: conversation signals that start follow-up journeys (no setup documented)'}}},
    'bc-eds': {'label': 'Partner-designed workflow: concierge script in an Edge Delivery block, site crawled as a knowledge source; no Edge Delivery connector',
               'how': "Brand Concierge's script loads on an Edge Delivery site in a block the partner builds (the script goes in the page code or a tag manager), and the concierge can crawl the site's sitemap or URL list as its knowledge source; the native AEM Sites source needs AEM Sites as a Cloud Service with Content AI.",
               'gain': {'title': 'A concierge grounded in your site', 'text': 'The concierge sits on fast Edge Delivery pages and answers from the published site content, refreshed on the crawl schedule the client sets.'},
               'flows': {'0': {'what': 'Published pages crawled from the sitemap or URL list on the schedule the client sets', 'source': SRC['bc_ks']},
                         '1': {'what': "The concierge chat, delivered in a block the partner builds (Adobe documents the script in page code or a tag manager)", 'source': SRC['bc_deploy']}}},
    'bc-commerce': {'how': 'Brand Concierge connects to Adobe Commerce through the Adobe-managed Commerce MCP server, backed by Live Search, to discover and compare catalog products in conversation; cart and checkout are not available yet.',
                    'gain': {'title': 'Shopping help from the live catalog', 'text': "Shoppers describe what they need and get product cards and side-by-side comparisons drawn from the store's own catalog, through Live Search."},
                    'flows': {'0': {'what': 'Catalog products and attributes from Live Search, for discovery, product cards and comparisons'}}},
    'commerce-rtcdp': {'how': 'The Data Connection extension sends Commerce storefront, back office and profile data to Experience Platform, and Audience Activation brings Real-Time CDP audiences back into Commerce (Commerce on Cloud or on-premises; Real-Time CDP Prime or Ultimate).',
                       'gain': {'title': 'Store data in, audiences back', 'text': 'Shopping behavior and orders build richer profiles; on Commerce on Cloud or on-premises, the audiences built from them drive cart price rules, dynamic blocks and related product rules.'}},
    'commerce-ajo': {'gain': {'title': 'Win back abandoned carts', 'text': 'Abandoned carts and browses can start personalized email or push journeys; other channels need their own Journey Optimizer setup.'}},
    'commerce-cja': {'gain': {'title': 'Shopping in the full journey', 'text': 'Store browsing, carts and orders sit next to any other datasets the client adds to the same CJA connection, so teams can analyze purchase paths across channels.'},
                     'flows': {'0': {'what': 'Storefront, back office and profile datasets, through Experience Platform', 'source': SRC['commerce_dc']}}},
    'commerce-eds': {'gain': {'title': 'A fast storefront authors can edit', 'text': 'Pages are built for speed and authors edit content as documents, while prices, carts and checkout come live from Commerce. Product pages need server-side metadata or AEM Commerce Prerender to be fully crawlable.'},
                     'flows': {'0': {'what': "Commerce APIs to the storefront drop-ins in the shopper's browser (product details, prices, search and cart); Edge Delivery serves pages and code"}}},
    'target-commerce': {'label': 'Commerce events can reach Target through the Edge Network; no setup documented, prove it in a pilot',
                        'how': "Commerce storefront events in a Web SDK datastream with Target enabled reach Target as page or mbox parameters; Adobe lists Target for testing store content, but documents no setup for using Commerce data in it.",
                        'gain': {'title': 'Tests on shopping data (to prove in a pilot)', 'text': 'Target can test store content and offers; using Commerce events in Target is a design to prove in a pilot. Recommendations would be separate work.'},
                        'flows': {'0': {'what': 'Storefront events in a Web SDK datastream with Target enabled'}}},
    'target-eds': {'label': 'Target on Edge Delivery through Web SDK, at.js or the co-innovation martech plugin',
                   'how': "Adobe documents two ways to run Target on Edge Delivery pages: Web SDK (recommended) and the legacy at.js. Adobe's martech plugin, available through AEM Engineering co-innovation, is a third that applies page changes as each block renders; it also needs Adobe Analytics and a Tags property.",
                   'gain': {'title': 'Personalize with a measured speed cost', 'text': "Target tests and personalization run on Edge Delivery pages; Adobe's tests show up to 1.2 seconds more on mobile Largest Contentful Paint when Target changes the page, more for complex changes."}},
    'ajo-eds': {'how': 'Journey Optimizer web campaigns need Web SDK on the site; on Edge Delivery, aem.live describes them through the martech plugin (co-innovation), as an alternative to Target. A direct Web SDK route is a pilot item.',
                'gain': {'title': 'Journey Optimizer web campaigns on Edge Delivery', 'text': "Journey Optimizer web campaigns can change Edge Delivery pages, with the same measured speed cost (up to 1.2 seconds more on mobile Largest Contentful Paint in Adobe's tests)."}},
    'rtcdp-eds': {'how': 'Web SDK on Edge Delivery pages, loaded by the martech plugin (AEM Engineering co-innovation; Tags with Web SDK also works), sends site events to Experience Platform, where they build Real-Time Customer Profiles in profile-enabled datasets.',
                  'gain': {'title': 'Site behavior in Experience Platform profiles', 'text': 'What visitors do on Edge Delivery pages lands in their profiles where consent allows, ready for audiences and activation.'}},
    'cw-rtcdp': {'label': "Adobe's audience skills in Coworker for Real-Time CDP B2C; in-product panel coming soon",
                 'how': "Coworker Chat works with Real-Time CDP B2C from Coworker's workspace now (the in-product panel is coming soon), helping teams create, optimize and analyze audiences in natural language.",
                 'source': SRC['cw_chat'],
                 'gain': {'title': 'Audiences built by asking', 'text': "Marketers describe the audience they need and Coworker drafts, builds and checks it under the client's permissions, with approval where Plan mode or the client's approval gates require it."},
                 'flows': {'1': {'what': "Audiences created or changed, after approval where Plan mode or the client's approval gates require it"}}},
    'cw-ajo': {'label': "Adobe's journey skills in Coworker for Journey Optimizer B2C; in-product panel coming soon",
               'how': "Coworker Chat works with Journey Optimizer B2C from Coworker's workspace now (the in-product panel is coming soon): Adobe's journey skills create journeys from a prompt or a flowchart (Journey Create) and check fallout, conflicts and anomalies.",
               'source': SRC['cw_workflows'],
               'gain': {'title': 'Journeys drafted and checked faster', 'text': "Marketers describe a journey or ask for a performance read, and Coworker drafts the steps with Journey Create and checks them, with approval where Plan mode or the client's approval gates require it."},
               'flows': {'1': {'what': "Journey drafts and changes, after approval where Plan mode or the client's approval gates require it"}}},
    'cw-target': {'label': "Adobe's Target skills in Coworker, in Coworker's workspace and inside Target",
                  'source': SRC['cw_workflows'],
                  'flows': {'1': {'what': "Requested actions in Target, after approval where Plan mode or the client's approval gates require it"}}},
    'marketo-workfront': {'how': "Workfront Fusion scenarios the partner builds from Adobe's blueprint link the two: a Workfront request form sets up a Marketo Engage program from a template, and Marketo emails come back to Workfront as proofs whose approval is sent back to Marketo Engage.",
                          'gain': {'title': 'From campaign request to approved launch', 'text': 'Campaign requests arrive on a structured Workfront form, a Fusion scenario clones the matching Marketo program template and fills its My Tokens, and emails are proofed and approved in Workfront; audiences are still built by a user or come from a smart list in the template.'}},
    'marketo-rtcdp': {'how': 'The Marketo Engage source connector brings Marketo people and activity data into Experience Platform, and the Marketo Engage connection destination sends Real-Time CDP people audiences back to Marketo; using all Marketo datasets for segmentation needs Real-Time CDP B2B Edition.',
                      'gain': {'title': 'Marketo data meets the full profile', 'text': 'Marketo engagement enriches the customer profile, and people audiences built in Real-Time CDP come back to Marketo lists for email and nurture programs.'},
                      'flows': {'1': {'what': 'People audiences back to Marketo through the Marketo Engage connection destination', 'source': SRC['mkto_dest']}}},
    'marketo-ajo': {'gain': {'title': 'Journeys that sync to Marketo', 'text': 'Journeys can sync people and custom object data into Marketo Engage at a chosen step; any Marketo program that acts on it is set up in Marketo.'}},
    'marketo-cja': {'gain': {'title': 'Marketing results in one journey view', 'text': "Once an ID strategy and graph-based stitching (CJA Prime or higher) are proven in a pilot, Marketo activity sits next to web visits, so marketers can compare program activity with later web and conversion activity. Numbers can differ from Marketo's own reports, and account and opportunity views need CJA B2B Edition."}},
    'marketo-target': {'how': "Marketo Engage uploads static or synced list membership to Audience Manager (the Experience Cloud audience service) as an ECID trait and segment, and Target can then use it; this needs Adobe organization mapping first.",
                       'gain': {'title': 'Personalize the site for Marketo lists', 'text': 'Members of shared Marketo lists whose browsers Marketo has matched to an Adobe ECID can get tailored content in Target; only list membership is sent, and it can take 6 to 8 hours to populate.'}},
    'marketo-eds': {'how': 'Forms built with AEM Forms in the Universal Editor for Edge Delivery pages can use the Submit to Marketo Engage action; submissions run through AEM Publish, and AEM Forms needs its own license.',
                    'gain': {'title': 'Site forms feed Marketo', 'text': 'Lead forms built with AEM Forms on Edge Delivery pages submit to Marketo Engage through AEM Publish, ready for scoring and nurture.'},
                    'flows': {'0': {'what': 'Form submissions from Edge Delivery pages, through AEM Forms on AEM Publish, into Marketo Engage leads'}}},
    'marketo-cw': {'gain': {'title': 'Marketo programs started by asking', 'text': 'Marketers describe a campaign in plain words and Coworker builds the program structure with asset placeholders and scheduling, checks it before launch and explains why a lead stalled; the team still writes and approves the assets.'}},
    'marketo-bc': {'how': 'Visitors who fill in a form, book a meeting or start a live chat become Marketo person records, and their concierge engagement is written to those records as activities Smart Campaigns can use; meetings and live chat route through Adobe Marketo Qualifier.',
                   'gain': {'title': 'Concierge engagement in Marketo', 'text': 'Marketo gets an activity for each concierge engagement, with a conversation ID that opens the full transcript in Composer, so follow-up programs can start from it; topics and summaries are planned for a future release.'},
                   'flows': {'0': {'what': 'Engagement activities and leads from forms, meetings and live chats, usable in Smart Campaigns'}}},
    'workfront-eds': {'how': 'Edge Delivery forms built with AEM Forms in the Universal Editor can invoke Workfront Fusion: a submission starts a Fusion scenario, and the partner builds the steps that create the Workfront request or project.',
                      'gain': {'title': 'Site requests into Workfront', 'text': 'Requests made through a form on the site can arrive in Workfront as requests or projects, through a Fusion scenario the partner builds and maintains.'},
                      'flows': {'0': {'what': 'Edge Delivery form submissions, through AEM Forms on AEM Publish, start a Workfront Fusion scenario'}}},
    'workfront-cw': {'how': "CX Enterprise Coworker Chat runs inside Workfront within each user's permissions. It is read-only until a system admin turns on the Write MCP tools option, and Adobe says Coworker is not currently offered to health care, finance or some other industries.",
                     'gain': {'title': 'Workfront work done by asking', 'text': "Once a Workfront admin turns on write access, Coworker can carry out steps within each user's permissions and return the work for approval."}},
    'workfront-ajo': {'gain': {'title': 'Approved work flows into journeys', 'text': 'A Fusion scenario the partner builds can create or update Journey Optimizer content templates and fragments when work is approved in Workfront, cutting copy and paste between teams.'}},
    'aemsites-aemassets': {'how': 'Dynamic Media with OpenAPI lets Sites authors use approved assets from a remote AEM Assets environment in the Page Editor (remote assets in Content Fragments work on AEM 6.5, not on AEM as a Cloud Service); Adobe recommends it over the older Connected Assets.',
                           'gain': {'title': 'One governed library for pages', 'text': 'Authors place brand-approved images from the DAM onto pages built with the Image v3 and Teaser v2 components (other components need custom work), and changes to approved assets reach the live site without re-uploading.'},
                           'flows': {'0': {'what': 'Approved assets and metadata, delivered by URL to pages in the Page Editor'},
                                     '1': {'what': 'Connected Assets only (the older route): page references, so DAM users see where each asset is used'}}},
    'aemassets-ajo': {'how': 'Depending on the contract, AEM Assets is integrated with Journey Optimizer: marketers pick assets from an Assets as a Cloud Service repository in the Email Designer, and for clients with Dynamic Media with OpenAPI, approved renditions stay current when assets change in AEM.',
                      'gain': {'title': 'On-brand DAM assets in email', 'text': 'Marketers place DAM images into email content, and for clients with Dynamic Media, approved renditions update in journey content when the asset changes in AEM.'},
                      'flows': {'0': {'what': 'Assets for email content, and approved Dynamic Media renditions for clients with Dynamic Media'}}},
    'aemsites-ajo': {'gain': {'title': 'Author once, reuse in journeys', 'text': 'Content teams write product and campaign copy once in AEM, and Journey Optimizer reuses the published fragments in email, SMS, web and other channels, personalized per profile once placeholders are declared and mapped in Journey Optimizer.'},
                     'flows': {'0': {'what': 'Published Content Fragments: about five minutes for unitary journeys; batch use cases pick up changes in the next processing batch'}}},
    'commerce-aemsites': {'how': 'The Commerce Integration Framework (CIF) add-on, provisioned by Adobe, connects AEM Sites as a Cloud Service to the Adobe Commerce GraphQL endpoint so authors can search, browse and use product data in AEM. It suits headless AEM content and existing CIF sites: the CIF storefront and CIF Core Components are in maintenance mode, and Adobe recommends Edge Delivery with the Commerce Storefront for new storefronts, while documenting a headless AEM storefront that starts with the CIF add-on.',
                          'gain': {'title': 'Product data inside the content editor', 'text': 'Authors find real products from the Commerce catalog while building headless content, and pages on existing CIF sites, so shopping content uses live product data instead of copied details.'},
                          'flows': {'0': {'what': 'Catalog and product data over GraphQL for AEM authoring tools, and CIF components only on existing CIF sites'}}},
    'commerce-aemassets': {'label': "Approved AEM Assets images sync to Commerce products by SKU (Adobe's extension on Commerce on Cloud and on-premises; built into Commerce as a Cloud Service)",
                           'how': "The AEM Assets Integration for Commerce links approved AEM Assets to Commerce products by SKU, or by custom matching built in Adobe Developer App Builder, and syncs them into the catalog; merchandisers can also pick DAM assets inside the Commerce Admin. On Commerce on Cloud and on-premises it's an Adobe extension the partner installs; on Commerce as a Cloud Service it's configured in the Commerce Admin.",
                           'gain': {'title': 'Approved product images, synced by SKU', 'text': 'Merchandisers manage product images once in AEM Assets; approved images tagged with SKUs reach Commerce products, most within five minutes, keeping storefronts accurate and on brand.'},
                           'flows': {'0': {'what': 'Approved images matched to product SKUs, with image roles, positions and per-store-view alt text'}}},
    'cja-bc': {'label': "Built-in CJA dashboard for conversations; analysis with purchases needs the client's own CJA and Adobe's confirmation",
               'how': "Brand Concierge's built-in analytics dashboard is powered by Customer Journey Analytics and needs no CJA license; analyzing conversations with the rest of the customer journey needs a separately licensed CJA and Adobe's confirmation that the concierge dataset can be used there.",
               'gain': {'title': 'See how conversations go', 'text': 'The built-in dashboard shows conversation trends, repeat engagement, intent, sentiment, feedback and recommendations; with a separately licensed CJA, a partner can put concierge events next to journey and purchase data once Adobe confirms the data use.'},
               'flows': {'0': {'what': "Conversation, sentiment, feedback and engagement data for the built-in dashboard, and, with Adobe's confirmation, for journey analysis in a separately licensed CJA"}}},
}

# research lines whose names or scopes said more than Adobe documents: (file, line id, field, old, new)
LINE_EDITS = [
    ('aem_sites_assets.json', 'AXD11', 'name', 'Coworker Skills for DAM work', 'Partner-written Coworker Skills for DAM work'),
    ('aem_sites_assets.json', 'AXD11', 'scope', 'each with a confirmation step before changes.', "each with a confirmation step before changes. Content Discovery can't write metadata or create or delete assets, so those steps use the Onboarding skills or AEM."),
    ('connections_more.json', 'XA03', 'name', 'Offer decisioning and recommendations', 'Journey Optimizer Decisioning and recommendations'),
    ('connections_more.json', 'XA07', 'name', 'Journey Optimizer offers in Target tests', 'Journey Optimizer offers in Target tests (Legacy offer decisions)'),
    ('connections_more.json', 'XA08', 'scope', 'Set up the concierge datastream and the schema fields for conversation events, then build the first audiences from intent and sentiment signals for activation.',
     "With the client's own Experience Platform license (Brand Concierge's license limits its datastream and dataset to Brand Concierge use), set up the concierge datastream and the schema fields for the conversation events Adobe documents (clicks, form submissions, booked meetings and live chats), then build the first audiences from them for activation."),
    ('connections_more.json', 'XA10', 'name', 'Conversation impact reporting in CJA', "Conversation-to-purchase analysis in the client's CJA (separate license)"),
    ('connections_more.json', 'XA10', 'scope', 'Extend the built-in dashboard with Workspace reports', 'With a separately licensed CJA, extend the built-in dashboard with Workspace reports'),
    ('connections_more.json', 'XA10', 'scope', 'With a separately licensed CJA, extend', "With a separately licensed CJA and Adobe's confirmation that the concierge dataset can be used there, extend"),
    ('connections_more.json', 'XA11', 'scope', 'Add a Brand Concierge block to the site code, place it on the agreed pages and navigation, and set the surface rules for where the concierge appears.',
     "Build a block that loads the Brand Concierge script (Adobe documents the script in page code or a tag manager; the block is the partner's implementation pattern), place it on the agreed pages and navigation, and set the surface rules for where the concierge appears."),
    ('connections_more.json', 'XA12', 'scope', 'Set up AEM content ingestion in Composer or full-site ingestion from the sitemap, check coverage of priority pages, and plan refreshes when content changes.',
     'Set up a Website Links crawl of the Edge Delivery sitemap or URL list (the AEM Sites source applies only where the site is authored in AEM Sites with Content AI), check coverage of priority pages, and schedule refreshes.'),
    ('connections_more.json', 'XA13', 'scope', "Turn on the Commerce catalog integration, map the client's product attributes, test product cards and comparisons, and handle custom catalog variations that need backend work.",
     'Turn on the Commerce catalog integration (the Commerce MCP needs Live Search, an environment ID and an API key), confirm the Live Search attributes and facets the concierge needs are searchable and filterable, test product cards and comparisons, and handle custom catalog variations that need backend work. Cart, checkout and order history stay out until Adobe marks them available.'),
    ('connections_more.json', 'XA15', 'scope', 'Set up the Adobe Commerce destination and Audience Activation, then use the first audiences in cart price rules, dynamic blocks or related product rules.',
     'For Commerce on Cloud or on-premises with Real-Time CDP Prime or Ultimate, set up the Adobe Commerce destination and Audience Activation, then use the first audiences in cart price rules, dynamic blocks or related product rules.'),
    ('connections_more.json', 'XA14', 'scope', 'and check the first events.', 'and check the first events. For an Edge Delivery storefront, send storefront events through its Experience Platform settings (XA20) and confirm how back office and profile data flow for the deployment.'),
    ('connections_more.json', 'XA17', 'scope', 'and build the first purchase and cart reports.', 'and build the first purchase and cart reports (partner-built reports on a standard CJA connection and data view).'),
    ('connections_more.json', 'XA18', 'scope', 'Create the storefront project, link it to Commerce data,', 'For Commerce as a Cloud Service or Commerce Optimizer, create the storefront project, link it to Commerce data,'),
    ('connections_more.json', 'XA20', 'scope', 'and check that product, cart and purchase events reach the Edge Network.', "connect the merchant's consent management platform (the boilerplate denies consent by default), and check that product, cart and purchase events reach the Edge Network."),
    ('connections_more.json', 'XA22', 'scope', 'Install and configure the martech plugin with the datastream and tags, turn on Target for the agreed pages, and check flicker and page speed.',
     "Set up Target on the agreed pages through Web SDK (aem.live's recommended route), or the martech plugin where the client has it through co-innovation, with the datastream and the consent platform, and check flicker and page speed."),
    ('connections_more.json', 'XA23', 'scope', 'Configure the martech plugin and datastream for Journey Optimizer, set up the web surfaces,', 'Configure the martech plugin and datastream for Journey Optimizer (the datastream option, an Active-On-Edge merge policy, the Visual Editing Helper and a check of the engageable profile count), set up the web surfaces,'),
    ('connections_more.json', 'XA24', 'scope', 'then check that visits build profiles under the agreed identities.', "connect the client's consent platform (not the lab's default of consent in), then check that visits build profiles under the agreed identities."),
    ('connections_value.json', 'BVCJ2', 'name', 'Rank AI sources by the value they send', 'Rank AI sources by the visits and conversions they send'),
    ('connections_more.json', 'XA25', 'name', 'Coworker Skills for audience work', 'Partner-written Coworker Skills for audience work'),
    ('connections_more.json', 'XA25', 'scope', "Write and test Skills for the client's recurring audience tasks, such as naming, building, sizing and checking audiences, with approval steps.",
     "Write and test Skills for the client's own audience conventions and checks, on top of Adobe's shipped audience skills (creation, sizing, search and publish), with approval steps."),
    ('connections_more.json', 'XA26', 'name', 'Coworker Skills for journey work', 'Partner-written Coworker Skills for journey work'),
    ('connections_more.json', 'XA26', 'scope', "Write and test Skills for the client's recurring journey tasks, such as journey drafts, pre-launch checks and performance summaries, with approval steps.",
     "Write and test Skills for the client's own journey conventions and pre-launch checks, on top of Adobe's shipped journey skills (Journey Create, fallout, conflict and anomaly checks), with approval steps."),
    ('connections_more.json', 'XA27', 'name', 'Coworker Skills for Target testing', 'Partner-written Coworker Skills for Target testing'),
    ('connections_more.json', 'XA27', 'scope', "Write and test Skills for the client's routine Target work, such as test briefs, setup checks and results summaries, with approval steps.",
     "Write and test Skills for the client's routine Target work in its own formats, such as test briefs and results summaries, on top of Adobe's shipped Target skills (guided activity setup), with approval steps."),
    ('portal_omnichannel_b2b.json', 'XC02', 'name', 'Image modifiers and smart crops for pages', 'Image modifiers, and smart crops where licensed, for pages'),
    ('portal_omnichannel_b2b.json', 'XC02', 'scope', 'Set up the image modifiers and smart crops each page component uses, so every placement gets the right size and format from the DAM.',
     "Set up the image modifiers, and smart crops where the client's Dynamic Media edition includes them, for the Image v3 and Teaser v2 components (other components need custom work), so each placement gets the right size and format from the DAM."),
    ('portal_omnichannel_b2b.json', 'XC04', 'scope', 'set up the approved renditions and smart crops marketers pick in Content Advisor', 'set up the approved renditions and image parameters marketers pick in the asset selector (Content Advisor where it has rolled out)'),
    ('portal_omnichannel_b2b.json', 'XC11', 'scope', 'that authors assemble from products they search and browse in AEM.', 'that authors assemble from products they search and browse in AEM, using Content Fragments and headless content for new builds rather than CIF Core Components, which Adobe has put in maintenance mode.'),
    ('marketo_workfront.json', 'XB10', 'scope', 'Confirm Coworker is enabled and the Gen-AI terms are accepted,', "Confirm Coworker is enabled for the subscription (Adobe's pages differ on its rollout) and the Gen-AI terms are accepted,"),
    ('marketo_workfront.json', 'XB11', 'scope', 'check that conversation activities and new leads arrive,', 'check that engagement activities and leads from forms, meetings and live chats arrive (meetings and chat need Adobe Marketo Qualifier),'),
    ('marketo_workfront.json', 'XB05', 'scope', 'Connect the Marketo V2 destination, map email and other identities for the best match rate,', 'Connect the Marketo Engage connection destination (the V2 card is Legacy), set the deduplication field (ECID is not supported) and map first name, last name and email so leads can be created,'),
]
SOURCE_EDITS = [
    ('connections_more.json', 'XA11', 'https://experienceleague.adobe.com/en/docs/platform-learn/tutorial-one-adobe/agents/agents4/ex2', SRC['bc_deploy']),
    ('connections_more.json', 'XA12', 'https://experienceleague.adobe.com/en/docs/brand-concierge/content/release-notes/current', SRC['bc_ks']),
    ('connections_more.json', 'XA17', 'https://experienceleague.adobe.com/en/docs/commerce-admin/customers/customers-menu/personalize-scale', SRC['commerce_dc']),
    ('connections_more.json', 'XA25', 'https://experienceleague.adobe.com/en/on-demand-events/exl-live-episode-10-08-26', SRC['cw_chat']),
    ('connections_more.json', 'XA27', 'https://experienceleague.adobe.com/en/docs/coworker/content/customizations/skills/what-are-skills', SRC['cw_exp']),
    ('marketo_workfront.json', 'XB05', 'https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/marketo-engage', SRC['mkto_dest']),
]
# lines that were on by default but need a license or setup most clients won't have: optional until the partner confirms
DEFAULT_OFF = [('connections_more.json', 'XA15')]


def short_avail(cid, raw):
    if cid in AVAIL:
        return AVAIL[cid]
    if re.match(r'(?i)generally available', raw):
        return 'Generally available.'
    return NOT_STATED


CW_NOTE = "Coworker is not currently offered to organizations in health care, finance or some other industries (Adobe's Coworker in Workfront page); confirm eligibility"


def line_overrides():
    """corrections for research lines, applied by build.py, so the research files keep what the research found"""
    lines = {}
    for path in sorted(os.listdir(R)):
        if not path.endswith('.json') or path.startswith(('connection_types', 'audit_classification')):
            continue
        d = json.load(open(os.path.join(R, path), encoding='utf-8'))
        for grp in ('products', 'connections'):
            for o in d.get(grp, []):
                for line in o.get('lines', []):
                    lines[(path, line['id'])] = line
    out = {}
    for fname, lid, field, old, new in LINE_EDITS:
        line = lines[(fname, lid)]
        cur = out.get(lid, {}).get(field, line[field])
        assert cur.count(old) == 1, (lid, field, old)
        out.setdefault(lid, {})[field] = cur.replace(old, new)
    for fname, lid, old_url, src in SOURCE_EDITS:
        line = lines[(fname, lid)]
        assert line['source']['url'] == old_url, (lid, line['source']['url'])
        out.setdefault(lid, {}).update({'url': src['url'], 'src': src['title']})
    for fname, lid in DEFAULT_OFF:
        assert lines[(fname, lid)].get('default'), lid
        out.setdefault(lid, {})['default'] = False
    return out


def main():
    src = json.load(open(os.path.join(R, 'audit_classification_2026-10-31.json'), encoding='utf-8'))
    verdicts = {v['id']: v for v in src.get('verdicts', [])}
    out = {}
    for c in src['connections']:
        v = verdicts.get(c['id'])
        kind = c['kind']
        prereqs = list(c['prereqs'])
        avail = c['availability']
        if v:
            if v.get('corrected_kind') in KIND:
                kind = v['corrected_kind']
            if v.get('corrected_prereqs'):
                prereqs = list(v['corrected_prereqs'])
            if v.get('corrected_availability'):
                avail = v['corrected_availability']
        kind = KIND_OVERRIDE.get(c['id'], kind)
        w = WORDING.get(c['id'], {})
        label = w.get('label') or re.sub(r'(?i)^(native integration|shared-platform data path|supported extension|partner-designed workflow)( \(legacy\))?[:;]?\s*', '', c['label'])
        label = label[:1].upper() + label[1:]
        if 'cw' in c['id'].split('-') and not any('health care' in x for x in prereqs):
            prereqs.append(CW_NOTE)
        t = {'kind': KIND[kind], 'label': label, 'availability': short_avail(c['id'], avail), 'prereqs': prereqs,
             'evidence': [{'url': e['url'], 'quote': e['quote']} for e in c['evidence'] if e.get('quote_checked')]}
        for k in ('how', 'source', 'gain', 'flows'):
            if k in w:
                t[k] = w[k]
        out[c['id']] = t
    missing = sorted(set(WORDING) - set(out))
    assert not missing, f'wording for unclassified connections: {missing}'
    lines = line_overrides()
    blob = json.dumps({'about': 'Connection types, availability, prerequisites, evidence and corrected wording for the Build canvas, and corrections to research lines, from the Oct 31 2026 audit fix (audit_types.py).',
                       'checked': '2026-10-31', 'connections': out, 'lines': lines}, ensure_ascii=False, indent=1)
    assert '—' not in blob and '–' not in blob
    open(os.path.join(R, 'connection_types.json'), 'w', encoding='utf-8').write(blob + '\n')
    print(f'{len(out)} connections typed:', {k: sum(1 for x in out.values() if x['kind'] == k) for k in KIND.values()}, f'{len(lines)} research lines corrected')


if __name__ == '__main__':
    main()
