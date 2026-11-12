# Outside review of the catalog: what held up (Nov 12 2026)

Two outside AI reviewers (ChatGPT, two passes covering all 150 connections and 517 services; a second reviewer, two passes covering products 1 to 10) read the catalog export in `sow/qa/review_pack/out/`. This is the verified result. **Nothing in the tool or the catalog has been changed.** Every item below waits for Adam's yes.

## How each claim was checked

1. Each of the 223 claims was given to a checker that read the catalog entry (`sow/qa/review_pack/show.py`) and the Adobe page as it is served today (`page_text.py`), and looked for the reviewer's quote word for word.
2. Each claim that held went to a second checker told to refute it.
3. The findings that survived were merged so that one change appears once. Every claim id is accounted for (see the end).

Pages on business.adobe.com and www.adobe.com cannot be read from this session and were not used.

## The numbers

- Claims checked: 223 (81 from the first pass, 142 from the second).
- Final verdicts: 83 confirmed, 122 partly right, 8 already covered, 5 not reproduced, 5 against a decision Adam already made.
- The second check overturned or narrowed 18.
- After merging: 241 proposed items. 79 are small edits that follow existing rules; 162 need a decision.

| Part | Items | Need a decision |
|---|---|---|
| Things resting on a beta, early access or limited release | 20 | 13 |
| Accuracy: prerequisites, wording and facts | 53 | 18 |
| Overlaps (the same work could be billed twice) | 61 | 42 |
| Gaps: connections and services we do not have | 90 | 88 |
| Housekeeping: sources and structure | 17 | 1 |

Item numbers run through the whole document, so "yes to 1 to 20" or "skip 57" is enough.

## Part 1. Things resting on a beta, early access or limited release

### Needs a decision (13)

**1. AEM Sites and Workfront: Universal Editor Workfront plugin is Early Access** (Remove; medium)

- Entries: `AXE01`, `aemsites-workfront`, `AXE02`
- Change: Remove AXE01. In aemsites-workfront, drop the Universal Editor plugin route from the label, how, availability and prerequisites 1 and 2, keeping the Fusion AEM MCP route (AXE02) with its prerequisites. Relabel to "Workfront Fusion's AEM MCP connector". Review whether type "extension" still fits, and whether the Content Fragments in Workfront prerequisite still belongs.
- Adobe says: https://experienceleague.adobe.com/en/docs/platform-learn/tutorial-one-adobe/wfplanning/wfpl2/ex4 (updated Oct 16, 2026): "This plugin is currently in Early Access mode and isn't generally available yet."
- I recommend: Remove AXE01 and the plugin route. It is AXE01's only source and the skeptic found no generally available source.
- **Your call:** Adobe's tutorial calls the Universal Editor Workfront plugin Early Access. Remove that route and AXE01 under your no-early-access rule, or keep it as a named exception like Marketo Optimizer?
- From claims: c2-a04

**2. AEM agents with Coworker: Adobe lists them as a beta program** (Record as an exception; medium)

- Entries: `A05`, `CW-AEM`, `cw-eds`, `aemsites-cw`, `aemassets-cw`, `aemforms-cw`, `AXD08`, `AXD09`, `AXD10`, `AXD11`, `AXD12`, `AFX13`, `AFX14`, `AFX15`
- Change: No factual fix. Owner's call: either record AEM agents as an exception and keep today's gating wording, or remove CW-AEM, AXD08 to AXD12, AFX13 and AFX15, and cut A05 back to the partner-run governance process. AFX14 (submit connectors, data-model services, custom functions) is real AEM work that could stay, reworded without Coworker.
- Adobe says: experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/release-notes/release-notes/release-notes-current : "Current beta programs. The following sections list active beta programs" lists "Agents in AEM". Forms page: "available now? Yes."
- I recommend: Record as a named exception. The five capability pages carry no beta label and the catalog already gates access.
- **Your call:** Adobe's current AEM release notes list "Agents in AEM" under active beta programs, though Adobe also sells them through the Agentic SKU and says the Forms capability is available now. Do you want AEM agents kept as an exception like Marketo Optimizer, or taken out (the Coworker services for AEM Sites, Assets, Forms and Edge Delivery, and the automated checks in A05)?
- From claims: m2-a02

**3. Coworker with CJA: keep B2C edition while Adobe's pages disagree** (No change; small)

- Entries: `cw-cja`, `cw-rtcdp`, `cw-ajo`, `cw-target`
- Change: No change to edition or eligibility conditions on cw-cja, cw-rtcdp, cw-ajo or cw-target. cw-cja stays at "CJA B2C edition". The cw-rtcdp, cw-ajo and cw-target conditions match Adobe's table. Recheck CJA B2B edition when Adobe's three Coworker pages agree.
- Adobe says: coworker/content/chat/ui-guide (updated November 10, 2026): "Customer Journey Analytics B2B edition / Available now / Available now". But coworker/content/home: "The B2B editions of Real-Time CDP, Adobe Journey Optimizer, and Customer Journey Analytics are coming soon."
- I recommend: Keep B2C under the no-coming-soon rule and recheck later.
- **Your call:** Adobe's Coworker pages disagree on CJA B2B edition: one says available now, two say coming soon. Keep cw-cja at "CJA B2C edition" until they agree, or widen it to B2B now?
- From claims: g-o03

**4. Edge Delivery martech plugin: does co-innovation count as limited availability** (Record as an exception; small)

- Entries: `XA22`, `XA23`, `XA24`, `XL13`, `target-eds`, `ajo-eds`, `rtcdp-eds`, `aa-eds`
- Change: Keep the four plugin services with Adobe's co-innovation note on the partner card. Optionally add the condition "where your client has it from AEM Engineering" to XA23 and XA24, whose text is plugin-only. If Adam treats co-innovation like beta, XA23, XA24 and XL13 would need a direct Web SDK route or removal.
- Adobe says: Lab page (.../tutorial-one-adobe/assetmgmt/assetm1/ex5): "currently available to customers in collaboration with AEM Engineering via co-innovation projects." www.aem.live/developer/martech-integration gives public install steps; "co-innovation" appears nowhere there.
- I recommend: Keep them with the note, matching the Nov 7 decision, and add the condition to XA23 and XA24.
- **Your call:** Adobe's lab page says the Edge Delivery martech plugin comes only through AEM Engineering co-innovation projects. Keep the four plugin services with that note on the partner card, as you decided for co-innovation on Nov 7, or treat co-innovation like beta and drop the plugin route?
- From claims: m2-a03

**5. Journey Optimizer B2B Edition landing pages and forms: setup is in limited beta** (No change; small)

- Entries: `ajob2b`, `MO08`, `MK03`
- Change: None for now. Landing pages need a preset and subdomain, and Adobe badges that setup page as a limited beta release. If Adobe removes the badge, add an optional one-time B2B Edition service modelled on MO08: landing page subdomain and presets, form presets with their HTTP API streaming connection and dataset, standard forms and landing pages built, tested and linked from journeys.
- Adobe says: experienceleague.adobe.com .../journey-optimizer-b2b/user/admin/channels/configure-channels-landing-pages : "[beta] ... this feature is currently in a limited beta release"
- I recommend: Keep it out under the standing beta rule. Recheck the badge later.
- **Your call:** Adobe's Journey Optimizer B2B Edition landing page setup page is badged "limited beta release" today. Do you want to keep landing pages and forms out of the B2B Edition until that badge goes, or include the service with no label as you did for Marketo Optimizer?
- From claims: c2-c18

**6. Journey Optimizer B2B Edition with Firefly Custom Models rests on beta Brands** (Record as an exception; large)

- Entries: `ajob2b-fireflycm`, `ajo-fireflycm`, `XK11`, `FM03`
- Change: None unless you say yes. If yes: add native connection ajob2b-fireflycm mirroring ajo-fireflycm, with one service (add the published model by its Firefly model ID, test the connection, enable it, show email and landing page creators how to choose it). Prerequisites: a Firefly ETLA covering custom models, a published model, the B2B Edition AI user agreement. No Brands alignment work; training stays FM03.
- Adobe says: experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/brands/brands-overview : "This capability is currently available as a public beta." The generative-ai-models page itself has no beta label.
- I recommend: Leave it out for now. The tab sits inside a feature Adobe labels public beta. Recheck when the label is gone.
- **Your call:** In Journey Optimizer B2B Edition, custom Firefly models are added on a tab inside Brands, and Adobe labels Brands there a public beta (the models page itself carries no label). Does that count as resting on a beta, so we leave this connection out, or should we add it like the Journey Optimizer one?
- From claims: c2-b07

**7. Marketo Optimizer: Adobe's personas page still says Beta release** (Record as an exception; small)

- Entries: `moptimizer`, `moptimizer-marketo`, `moptimizer-cw`, `moptimizer-ads`
- Change: No catalog change proposed. Marketo Optimizer (MO01 to MO13) and its three connections (XQ01 to XQ08) are in with no label by the Nov 11 decision. Record that the exception stands, or take the product and its connections out until Adobe drops the Beta wording. Four other cited Marketo Optimizer pages have no beta or limited availability wording today.
- Adobe says: experienceleague.adobe.com/en/docs/marketo-optimizer/user/audiences/personas: "For the Beta release of Marketo Optimizer"
- I recommend: Keep the named exception and recheck the page before a partner launch.
- **Your call:** Adobe's Marketo Optimizer personas page still says "For the Beta release of Marketo Optimizer". Do you want to keep Marketo Optimizer in the catalog with no label, as you decided on Nov 11, or take it and its three connections out until Adobe drops the Beta wording?
- From claims: c2-a20

**8. Real-Time CDP Collaboration: record as a named exception** (Record as an exception; small)

- Entries: `collab`, `CO01`, `CO02`, `CO03`, `CO04`, `CO05`, `CO06`, `rtcdp-collab`, `XD01`, `XD02`, `XD03`
- Change: No catalog change. Keep the product, its six services, the Real-Time CDP connection and XD01 to XD03. Add Real-Time CDP Collaboration to the written list of exceptions to the no-label rule, beside Marketo Optimizer and Firefly Custom Models. Note that the badge is regional and that the regions sit in the rtcdp-collab availability line. No card shows the badge's words.
- Adobe says: experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/quick-start-guide: badge "Limited Availability"; "currently available in the United States, Canada, Australia, New Zealand, and across Europe, the Middle East, and Africa, with global availability coming soon". Release notes: "is now generally available in the united states".
- I recommend: Yes, record the exception. The badge is about regions and the owner already said "in".
- **Your call:** Adobe still shows a "Limited Availability" badge on Real-Time CDP Collaboration, for regions only. You said "in" on Nov 10. Shall we list it as a named exception to the no-label rule so reviews stop raising it?
- From claims: c2-a09

**9. Real-Time CDP context in Brand Concierge replies is Limited Availability: remove** (Remove; medium)

- Entries: `XA09`, `rtcdp-bc`, `XA08`
- Change: Remove XA09; keep XA08 and the events-into-Platform direction on rtcdp-bc. Drop profile-context wording from label, how, gain, availability, prerequisite 4 and the SOW copies (sowHow, sowGain, sowNote, sowAvailability, sowPrereqs), keeping "The baseline is anonymous visitors". Remove the SOW tool's XA09 confirmation check and its F02 assumption swap (sow/index.html). Saved statements of work keep XA09 as the partner's own service. Do not re-base XA09 on the blueprint page.
- Adobe says: experienceleague.adobe.com/en/docs/brand-concierge/content/release-notes/current (April 2026): "Brand Concierge Integration with Real-Time CDP (Limited Availability)"
- I recommend: Remove XA09 and the profile-context wording. The label is on the exact feature and no owner exception was found.
- **Your call:** Adobe still labels Real-Time CDP context in Brand Concierge replies Limited Availability, while its architecture blueprint describes profile lookup with no label. OK to remove the optional service "Real-Time CDP context in conversations" (XA09) and have the Real-Time CDP + Brand Concierge card say only that replies are for anonymous visitors, or keep it as an exception like Marketo Optimizer?
- From claims: g-o02, m2-a04, g-a02

**10. Recheck Pinterest, Snapchat and TikTok named in ad source service** (Reword; small)

- Entries: `AD1`, `ads-cja`
- Change: Recheck AD1 on the Ad platforms + CJA line. It names Pinterest, Snapchat and TikTok. Adobe's Content Analytics paid media page labels those three as limited testing. If the label applies to AD1's use, drop the three names from AD1. The checkers did not give new wording.
- Adobe says: https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/paid-media : "Pinterest, Snapchat, and TikTok are in the limited testing phase of release and might not be available yet in your environment."
- I recommend: Recheck AD1's own source page first. Remove the three names if Adobe labels them limited there too.
- **Your call:** AD1 names Pinterest, Snapchat and TikTok, which this Adobe page labels limited testing for Content Analytics paid media. Should that be rechecked, and the three names removed if the label applies?
- From claims: c2-b09

**11. Sites Optimizer: Core Web Vitals pull requests, keep or cut** (Reword; small)

- Entries: `SO1`, `SO2`, `so-eds`, `aemsites-so`, `AXC06`
- Change: Owner's call. If cut: drop Core Web Vitals pull-request wording from SO1, SO2, so-eds and aemsites-so and keep downloaded patches handed to the developer. If kept: no change. Either way leave AXC06 as is: its stored quote is unlabeled, it scopes no forms work, and Form Accessibility appears only in that quote.
- Adobe says: Release notes (same page): "Core Web Vitals Code Deployment (Early Access) - Submit eligible code patches as a pull request". But .../opportunities/core-web-vitals says, unlabeled: "Pull request delivery - Automatically opens a linked pull request".
- I recommend: Cut back to downloaded patches in the four entries, since one Adobe entry carries the label. Leave AXC06 alone.
- **Your call:** Adobe's release notes label Core Web Vitals pull-request deployment Early Access, but its Core Web Vitals page and the Cloud Manager GitHub auto-fix note describe pull requests with no label. Keep the pull-request wording in SO1, SO2, so-eds and aemsites-so, or cut it back to downloaded patches only?
- From claims: c2-a01, m2-a01

**12. Warehouse tables into CJA rests on Data Mirror, labelled limited** (Record as an exception; medium)

- Entries: `dwh-cja`, `OX3`, `DW2`, `dwh-ajo`, `DW1`
- Change: None until the owner decides. If kept: no wording change (CJA Select, Prime or Ultimate and enablement confirmed with the Adobe account team are already stated, no label shown); add dwh-cja, OX3 and DW2 to the recheck-before-partner-launch list. If removed: retire OX3 and the Data Mirror wording on dwh-cja, or rescope OX3 to standard warehouse source connectors without change data capture. DW1 does not use Data Mirror and stands.
- Adobe says: experienceleague.adobe.com/en/docs/experience-platform/xdm/data-mirror/overview: badge "Limited Availability"; "Data Mirror is available as a limited release for Customer Journey Analytics users". CJA 2026 release notes list Data Mirror: General availability June 17, 2026.
- I recommend: Keep as is on the CJA release notes, record it as an exception, and put dwh-cja, OX3 and DW2 on the recheck list.
- **Your call:** Adobe's Experience Platform page still badges Data Mirror "Limited Availability" (a limited release for CJA customers), while CJA's own release notes say it became generally available June 17, 2026. Do you want to keep "Warehouse tables into CJA" (OX3) and its connection with no label, as with Marketo Optimizer, or take them out until the Platform page drops the badge?
- From claims: c2-a23, g-o01

**13. Workfront Planning reporting: drop the Canvas Dashboard** (Reword; medium)

- Entries: `WP06`
- Change: Reword WP06: "Prepare your client's Planning data in Workfront Data Connect and connect their own reporting tool." Cite the planning-in-data-connect page with the Snowflake quote. Add a prerequisite: Workfront Data Connect available to the client, with a Snowflake reader account or connection. Consider renaming to "Planning reporting data", since no dashboards are built.
- Adobe says: https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-reporting/planning-information-in-reports : "The Canvas Dashboards feature is currently only available for users participating in the beta stage."
- I recommend: Keep WP06 in the narrower form, renamed "Planning reporting data", and have the owner look at the hours.
- **Your call:** With the Canvas Dashboard removed, WP06 is only Data Connect preparation for the client's own reporting tool. Keep it in that narrower form (24/40/72 hours may be high), or retire WP06?
- From claims: c2-a13

### Small edits, no decision needed beyond a yes (7)

| # | What | Entries | Change |
|---|---|---|---|
| 14 | AEM Forms Submission PDF: say which setup route is covered | AF06, AFX01, aemforms-aemsites | Add one scope sentence to AF06, with no Early Adopter label shown: the Submission PDF is configured in the Forms editor for the form, with one XDP template; setting it on an AEM Sites page through the Adaptive Forms Container, and locale-specific XDP templates, are not part of this service. Optionally add the same line to the aemforms-aemsites prerequisites. |
| 15 | Ad platforms into CJA: drop the Pinterest, Snapchat and TikTok beta sources | ads-cja, AD1 | AD1: "(Google Ads or Meta)". ads-cja how: "The Google Ads source comes with CJA (Adobe states no license line for Meta Ads, so confirm it)". Remove the Pinterest, Snapchat and TikTok page links; add .../sources/connectors/advertising/google-ads. Drop "TikTok business verification" from the prerequisites. Make the same edits to the matching sowHow and AD1 scope lines in sow/product_copy_rules.json. |
| 16 | Adobe Analytics move to Web SDK: drop the beta upgrade assistant | AN06 | Rewrite AN06 without the upgrade assistant: move the client's Adobe Analytics tag extension setup to the Web SDK tag extension on Adobe's documented migration path, reusing existing data elements and rule conditions, adding the new rule actions, then testing the library and comparing reports before publishing. Do not promise XDM mapping. Swap the page and quote to analytics-extension-to-web-sdk. Keep title and hours. |
| 17 | Firefly Custom Models: say it needs a Creative Cloud for enterprise plan | fireflycm, FM01 | Add one prerequisite to fireflycm (or FM01): "A Creative Cloud for enterprise Edition 5, Edition 4 or Edition 4 with premium stock plan with Firefly Custom Models added, and Adobe Storage for business. These services cover organizations managed in the Admin Console." No beta wording shown, no service removed. |
| 18 | Frame.io permission design: avoid the word "group" | FR02 | Wording only, in FR02: replace "set the permissions each group inherits" with "set the account roles and the permissions each team's users inherit down workspaces, projects and folders". Keep hours, Adobe page and stored quote. Show no beta label and add no Access Groups work. |
| 19 | Sites Optimizer on AEM Sites: drop FAQ structured-data deployment line | AXC08 | Delete "Confirm enablement for FAQ structured-data deployment" from AXC08. Leave the rest of the service as it is. |
| 20 | Sites Optimizer: take out Dispatcher redirects for broken backlinks | SO1, SO2, aemsites-so | Remove the Dispatcher broken-backlink redirect sentences from the SO1 and SO2 assumptions. In aemsites-so, remove "except enabled Dispatcher redirects" from the how text and the Dispatcher mention from the availability line. Redirects are applied by hand. |

## Part 2. Accuracy: prerequisites, wording and facts

### Needs a decision (18)

**21. AEM Sites author training: name the Page Editor first** (Reword; small)

- Entries: `SI05`, `SI02`
- Change: Reword SI05. Title: "Author training". Text: "Train authors to edit pages in the AEM Page Editor, or in the Universal Editor where the site is built for it (as on Edge Delivery), and hand over authoring guides for the site's components and templates." Point its Adobe page and quote at the Page Editor versus Universal Editor page. No new service: AXD01 and AXD02 cover Universal Editor set-up.
- Adobe says: https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/page-editor-universal-editor : Page Editor "recommended for use with the Core Components and traditional AEM projects"; "There is no direct migration path from the Page Editor to the Universal Editor."
- I recommend: Yes, rename and reword SI05 so the training matches the default build.
- **Your call:** SI05 trains authors on the Universal Editor, but the default AEM Sites build (SI02) is one Adobe says is authored in the Page Editor. OK to rename SI05 to "Author training" and have it name the Page Editor first, with the Universal Editor for Edge Delivery sites?
- From claims: c2-a07

**22. Ad platforms into CJA: optional prerequisite on landing page URL and edit rights** (Add a prerequisite; small)

- Entries: `ads-cja`
- Change: Optional: add one ads-cja prerequisite (prereqs and sowPrereqs): "The website event data in CJA captures the full landing page URL with its query string, and a CJA user can edit the connection and data view".
- Adobe says: .../cja-usecases/cross-channel/paid-media-web prerequisites: "Customer Journey Analytics permission to edit the target connection and data view"; "Website events that capture the full landing page URL, including its query string"
- I recommend: Add it. Both are on Adobe's prerequisites list and the card only says the URLs carry the IDs.
- **Your call:** The Ad platforms + CJA card already says CJA Select or higher. Do you want one more prerequisite on it (the website data in CJA captures the full landing page URL, and someone can edit the CJA connection and data view), or is the link update enough?
- From claims: g-a14

**23. App Builder line on the two GenStudio app cards** (Reword; small)

- Entries: `ajo-gspm`, `marketo-gspm`
- Change: On ajo-gspm and marketo-gspm, add the GenStudio product description (helpx) to the Adobe pages and reword the App Builder prerequisite to: "Adobe Developer App Builder: Adobe includes one pack with GenStudio licenses started or renewed on or after April 7, 2025; confirm it on your client's contract." The other choice is to drop the line from both cards.
- Adobe says: helpx.adobe.com/legal/product-descriptions/adobe-genstudio-for-performance-marketing---product-description.html: "will also receive one Pack of Adobe Developer App Builder". The app pages only say "open App Builder applications"; no page read says the app requires a pack.
- I recommend: Keep it as the softer contract check with the helpx source added.
- **Your call:** Adobe does not say the Journey Optimizer or Marketo app for GenStudio needs an App Builder pack; it only says newer GenStudio licenses include one. Keep the line as a contract check, or drop it from both cards?
- From claims: g-o04

**24. Brand Visibility services: keep Semrush unnamed, clarify the decision note** (No change; small)

- Entries: `L01`, `O01`, `SD1`, `bv`, `search-bv`
- Change: None to L01, O01, SD1, bv or search-bv. Adobe says the paid Prompt Library is powered by Semrush Enterprise AIO, but the Brand Visibility license includes it, so no separate license is involved. Optional, outside partner text: reword the decision note to "Standalone Semrush and other third-party SEO suites are left out; the Semrush Enterprise AIO that Adobe includes in the paid Brand Visibility license is part of Brand Visibility and is not named."
- Adobe says: https://helpx.adobe.com/legal/product-descriptions/adobe-brand-visibility.html : "Customer's license to Adobe Brand Visibility includes a license for Customer to access and use Semrush Enterprise AIO"
- I recommend: Leave L01 and O01 as they are, keep Semrush unnamed in partner text, and update the decision note as worded.
- **Your call:** Adobe's paid Brand Visibility license includes Semrush Enterprise AIO and its Prompt Library runs on it. Do you want to keep Semrush unnamed everywhere (as today), and should the "Semrush left out" decision note say it means standalone Semrush only?
- From claims: m-d04, m2-a10

**25. Brand Visibility with CJA: name the setup steps in the connection service** (Reword; small)

- Entries: `bv-cja`, `C01`
- Change: Wording only on C01, no new service. Name the steps: confirm each site is selectable in the Adobe Brand Visibility source, set up the source dataflow in the CJA connection's sandbox, add the dataset to the connection and its CDN fields to the data view, match the web data's full URL to Brand Visibility's CDN URL, run Adobe's end-to-end validation. Keep the URL and host matching idea, reworded as the full-URL join.
- Adobe says: https://experienceleague.adobe.com/en/docs/analytics-platform/using/integrations/bv/configure : "Adobe does not modify your Customer Journey Analytics connections or data views."
- I recommend: Reword C01 to name the steps. Say the partner does them with the Client's administrator access unless Adam prefers guide and validate.
- **Your call:** Adobe lists adding the Brand Visibility dataset to the CJA connection and data view as the customer's job. Should C01 say the partner does these steps with the Client's administrator access, or that the Client does them while the partner guides and validates?
- From claims: g-c28

**26. Edge Delivery Services: name the three authoring routes, including Experience Workspace** (Reword; small)

- Entries: `eds`, `A04`, `A01`
- Change: On eds, name the authoring choice in A04 (decision) and A01 (set-up): Experience Workspace (Adobe's default for new projects; enabling it means the ew.enabled flag and quick edit in the code), Word or Google Docs, or AEM Sites with the Universal Editor for existing AEM implementations. No change to csrc-eds or aemsites-eds. Hours unchanged. Sources: the Edge Delivery overview and www.aem.live/docs/ew/about.
- Adobe says: experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/overview: "Experience Workspace is the modern default face to AEM and is the default for all new projects."
- I recommend: Name the three routes in A04 and A01. Wording only, no new service.
- **Your call:** Adobe now calls Experience Workspace the default authoring for new Edge Delivery projects. Do you want A04 and A01 to name it as one of three authoring routes (wording only, hours unchanged), or would you rather leave "set up authoring" general?
- From claims: m-a02

**27. Edge Delivery build service A01 names Brand Visibility: keep or neutral wording** (No change; small)

- Entries: `eds`, `A01`
- Change: Leave A01 as it is. It is a play template that opens "Turn Brand Visibility findings..." and ends with Brand Visibility's Optimize at Edge routing. The open question is whether Create your own play should show neutral wording when Edge Delivery is picked without Brand Visibility. The checkers did not propose wording.
- Adobe says: No Adobe page decides this. The catalog text of A01 names Brand Visibility; the skeptic confirmed that and said to leave A01 as it is.
- I recommend: Leave A01 unchanged for now, as both checkers advise.
- **Your call:** A01 is a play template that names Brand Visibility. Should it stay as it is, or get neutral wording when Edge Delivery is picked without Brand Visibility on Create your own play?
- From claims: m2-c03

**28. Edge Delivery build sets up Brand Visibility routing without Brand Visibility** (No change; small)

- Entries: `A01`, `eds`
- Change: No change proposed by the checkers. The skeptic noted that A01 (Implement AEM Sites on Edge Delivery) sets up Brand Visibility's Optimize at Edge routing even when Brand Visibility is not on the canvas. The only possible change is to make that clause apply only when Brand Visibility is in the play. That would change the AEM play's wording.
- Adobe says: experienceleague.adobe.com/en/docs/brand-visibility/using/resources/optimize-at-edge/overview: "Add *AdobeEdgeOptimize/1.0* user-agent to the allowlist in your site's robots.txt file or bot-traffic management rules."
- I recommend: Leave A01 as it is for the plays. Decide only whether Create your own play needs the clause made conditional.
- **Your call:** A01 sets up Brand Visibility's edge routing even when Brand Visibility is not on the canvas. Do you want that clause to stay in A01, or should it apply only when Brand Visibility is in the play?
- From claims: m2-b03

**29. Frame.io: name Admin Console user management as a prerequisite** (Add a prerequisite; medium)

- Entries: `FR01`, `FR08`
- Change: No new service. Add a prerequisite to FR01 and FR08: "User management in the Adobe Admin Console: a Frame.io V4 enterprise account in an Adobe organization that does not use the Global Admin Console. Adobe's Frame.io account team moves existing accounts on request." Optionally add "confirm eligibility and coordinate the move with Adobe's Frame.io account team" to FR01's description.
- Adobe says: https://helpx.adobe.com/business/enterprise/products-entitlements/frame-io-integration/migrate-frameio-user-management.html : "Contact your Frame.io account team to transition eligible V4 accounts to centralized user management"
- I recommend: Add the prerequisite only. Adobe's account team does the move, so a separate service would be padding.
- **Your call:** Is a prerequisite on FR01 and FR08 enough, or do you want a small separate one-time service for coordinating the move to Admin Console user management?
- From claims: c2-c21

**30. GenStudio user role line on Journey Optimizer and Marketo template cards** (Add a prerequisite; small)

- Entries: `ajo-gspm`, `marketo-gspm`, `XG05`, `GS01`
- Change: Optional. No change is needed: the GenStudio roles service (GS01) already assigns system managers, editors and collaborators. If Adobe's line is mirrored, add to ajo-gspm and marketo-gspm: "A GenStudio role for each user (Collaborator, the lowest, or higher); creating the email takes an editor or system manager." Do not use the first checker's wording. Leave XG05's text and hours as they are.
- Adobe says: experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/templates/use-templates, Prerequisites: "Users must have the "Collaborator" role (the lowest level) or higher". User roles page: "Collaborators can view assets ... but not create, edit, or delete these assets".
- I recommend: Leave it to GS01. The reviewer's "author role" does not exist, and every GenStudio user already meets Adobe's line.
- **Your call:** Adobe lists "Collaborator role (the lowest level) or higher" for Journey Optimizer and Marketo templates in GenStudio, which every GenStudio user already has. Do you want that line added to the two cards anyway, or left to the GenStudio roles service (GS01)?
- From claims: g-a15

**31. Marketo Engage and Brand Concierge: connection needs admin access and a feature flag** (Add a prerequisite; small)

- Entries: `marketo-bc`
- Change: marketo-bc first prerequisite becomes: "Marketo Engage connected to Brand Concierge, which needs admin access and a feature flag (confirm enablement with Adobe)". Add the go-live technical setup page (.../go-live-guide/technical-setup-and-optional-features) as a source.
- Adobe says: .../go-live-guide/technical-setup-and-optional-features: "connecting marketo engage to receive leads and activities, with admin access and a feature flag". No beta or limited label shown.
- I recommend: Keep the connection and name admin access and the feature flag as a prerequisite. Adobe shows no release label.
- **Your call:** Adobe says connecting Marketo Engage to Brand Concierge needs "a feature flag", with no beta or limited label. Keep the connection and name the flag as a prerequisite, or treat a flag as limited availability and drop it?
- From claims: m2-a07

**32. Marketo Engage with Target card runs through Audience Manager: keep, relabel or drop** (No change; small)

- Entries: `marketo-target`, `XB08`
- Change: Leave marketo-target typed platform, with label, how and prerequisites unchanged. The type is not wrong: the Oct 31 audit defines it as a path through Experience Platform or another shared Adobe service such as Audience Manager, partners see "Shared-platform data path", and the label already names Audience Manager. Changing the type to native was overturned.
- Adobe says: Same Marketo page: "after a list is uploaded from marketo to adobe audience manager, it can also be accessed by adobe target. that configuration must be enabled in adobe target"
- I recommend: Keep the card as it is. The page does not say Target use needs an Audience Manager license.
- **Your call:** The Marketo + Target card runs through Audience Manager, which you left out of the catalog. Keep the card as it is, a shared-platform data path (the Oct 31 audit's meaning: Experience Platform or another shared Adobe service such as Audience Manager), relabel it a native integration (Adobe's overview page says "native audience syncing"), or drop the card?
- From claims: g-a11

**33. Marketo Measure CRM connection: say it is not for Ultimate** (Reword; small)

- Entries: `MZ02`, `mmeasure-rtcdp`
- Change: MZ02: open the description with "For Marketo Measure Tiers 1 to 3 (Ultimate has no direct CRM connection; its CRM data comes through Experience Platform):". mmeasure-rtcdp: add a prerequisite, "Ultimate has no direct CRM or Marketo Engage connection, so leave out the CRM package and connection service and the Marketo Engage connection".
- Adobe says: https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-ultimate/marketo-measure-ultimate-overview : "The direct CRM and Marketo Engage connections are no longer available for Ultimate."
- I recommend: Make the two wording edits now. Skip the automatic switch-off unless he asks for it.
- **Your call:** Is a wording note on MZ02 enough, or do you want the tool to switch MZ02 off automatically when the Marketo Measure + Real-Time CDP (Ultimate) connection is on? The second is a new tool behavior.
- From claims: c2-a18

**34. Real-Time CDP audiences to Adobe Analytics service needs an Audience Manager license** (No change; small)

- Entries: `XL06`, `aa-rtcdp`
- Change: Flag from the first checker, outside the claim and not re-checked by the skeptic. XL06 only works with an Audience Manager license, a product Adam left out of the catalog. The aa-rtcdp card already names the Audience Manager license in its prerequisites. No change proposed until Adam decides whether XL06 stays as an optional service.
- Adobe says: .../destinations/catalog/adobe/experience-cloud-audiences: "To send audiences to Adobe Analytics, you need an Audience Manager license"
- I recommend: Keep XL06 as optional, since the license is already named as a prerequisite on the card.
- **Your call:** XL06 only works with an Audience Manager license, a product you left out. Keep XL06 as an optional service?
- From claims: g-d05

**35. Real-Time CDP audiences to Marketo service: stored quote gone from Adobe's page** (Reword; small)

- Entries: `XB05`
- Change: Flag from the first checker, outside the claim and not re-checked by the skeptic. XB05's stored quote ("...where they will appear as static lists") is no longer on Adobe's Marketo destination page (updated Nov 6). The page has no "static lists", "V2" or "Legacy" wording now. Proposed: reword XB05 to Adobe's current audience and profile sync and replace the quote.
- Adobe says: .../destinations/catalog/adobe/marketo-engage-connection (updated November 6, 2026): "Use this destination for real-time synchronization of audience data and profile attributes between Adobe Experience Platform and Marketo Engage."
- I recommend: Re-read the page, then reword XB05 and its quote to the current sync wording.
- **Your call:** XB05's stored quote about static lists is no longer on Adobe's Marketo destination page. Should XB05 be reworded to Adobe's current audience and profile sync?
- From claims: g-d05

**36. Real-Time CDP with Target: custom workspace sends attributes to the default workspace** (Add a prerequisite; small)

- Entries: `rtcdp-target`, `XA05`
- Change: rtcdp-target prerequisites, add: "With a custom Target workspace (Target Premium) and same-page or next-page personalization with attributes, audiences reach the selected workspace; mapped attributes go to the default Target workspace". XA05, end with: "and check that audiences appear in the selected workspace and, where a custom workspace is used, mapped attributes in the default workspace". Leave out Adobe's "will change in a future update". No change to hours.
- Adobe says: experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/personalization/adobe-target-connection: "only the selected audiences are sent to the selected Target workspace. The mapped attributes are sent to the default Target workspace."
- I recommend: Add the caveat now and recheck before a partner launch.
- **Your call:** Adobe says this behavior "will change in a future update". Do you want the caveat added now and rechecked before a partner launch, or left out because it is temporary?
- From claims: g-a05

**37. Reword Implement Brand Concierge (F02) to fit any industry** (Reword; medium)

- Entries: `bc`, `F02`
- Change: Only if the owner agrees, and with no split of the service. Reword F02's opening from "for the agreed banking or insurance products" to "the agreed products", with disclosures "where required", on Create your own play, where F02 also appears. The checkers differ on the FSI play: one keeps the banking, insurance and disclosure wording there, the other rewords F02 everywhere. FSI01, C04 and CW-FSI stay as they are.
- Adobe says: experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/brand-concierge-faq: "wide range of industries, including retail and e-commerce, travel and hospitality, financial services". The go-live checklist page has nothing industry-specific.
- I recommend: Reword for Create your own play and keep the FSI wording on the FSI play. No split of the service.
- **Your call:** F02 was written for the financial-services play but also appears on Create your own play. Should it read industry-neutral there, with the banking, insurance and disclosure wording kept only on the FSI play?
- From claims: m2-c04, c2-c08

**38. Target + Edge Delivery connection: keep the "Supported extension" type** (No change; small)

- Entries: `target-eds`
- Change: No change to the target-eds label, how or prerequisites: they already say "no plugin" for the Web SDK route and "Martech plugin route only" for the plugin. Leave the type as extension unless the owner chooses otherwise. The skeptic found native is not clearly better, and an Oct 31 audit kept extension on this exact point.
- Adobe says: https://www.aem.live/developer/target-integration: "The recommended future-proof approach is via the Adobe Experience Platform WebSDK". The checker notes this route still has the team "add the alloy.js file" and code; the word "plugin" is not on the page.
- I recommend: Keep "Supported extension". The card's text already separates the routes and marks the plugin as optional.
- **Your call:** Target + Edge Delivery shows as "Supported extension". Adobe's recommended Web SDK route needs no plugin, only the alloy.js file and code added to the site. Keep "Supported extension", or change the type to "Shared-platform data path" (as Target + Commerce is) or "Native integration"?
- From claims: g-a12

### Small edits, no decision needed beyond a yes (35)

| # | What | Entries | Change |
|---|---|---|---|
| 39 | AEM Sites and Target: optional line that Recommendations can be an offer | aemsites-target | The claimed missing restriction is already on the card (not in Multivariate Test or Recommendations activities). Optional polish only: append to the aemsites-target gain text, after the exclusion, "Recommendations can still be included as an offer in an A/B Test or Experience Targeting activity." Not re-checked by a skeptic. |
| 40 | Acrobat Sign identity checks: name the identity provider contract | SG07 | Add a prerequisite to SG07: "For a Digital Identity Gateway provider, your client holds its own contract with that identity provider, has it configured, and keeps enough identity transactions with it; these are not part of the Acrobat Sign license." Keep the description, hours and the single service. |
| 41 | Acrobat electronic seals: name Adobe's supported certificate providers rule | AB09 | AB09: replace "a trust service provider that follows the Cloud Signature Consortium standard" with "a trust service provider the PDF Electronic Seal API supports". Add a prerequisite: your client's seal certificate is hosted by a qualified trust service provider Adobe lists as supported, with static-PIN explicit authorization and the OAuth 2.0 client credential flow; confirm the provider before estimating. Do not name the four providers. |
| 42 | Adobe Analytics on Edge Delivery card: say the martech plugin is co-innovation | aa-eds, XL13 | aa-eds: availability and first prerequisite say the martech plugin is available through AEM Engineering co-innovation, per Adobe's One Adobe lab, and add the lab URL (experienceleague .../tutorial-one-adobe/assetmgmt/assetm1/ex5) to its Adobe pages. XL13: add "where your client has it from AEM Engineering", as XA22 has. No change to the target-eds, ajo-eds or rtcdp-eds labels. |
| 43 | Adobe Commerce with Real-Time CDP: add an opt-out process prerequisite | commerce-rtcdp | Add commerce-rtcdp prerequisite: "Your client's process for setting shopper opt-outs in Experience Platform for back office data". |
| 44 | Adobe Commerce with Real-Time CDP: add shopper opt-out steps to back office data | commerce-rtcdp, XA14 | Add to XA14: "Back office data is sent for every shopper, so agree with your client how a shopper's opt-out is set in Experience Platform (the storefront collector handles consent; back office data does not), set the Sales Orders Feed indexer to update by schedule, and check an opted-out shopper." |
| 45 | Adobe Express with Creative Cloud: allow device upload, add the Update step | express-creativecloud, XJ12 | Prerequisite becomes: "Photoshop and Illustrator files uploaded from a device, or saved as cloud files so they show under Your stuff in Express". In how: "edits made in Photoshop or Illustrator are applied in Express by selecting Update". In XJ12, "cloud files" becomes "uploaded or saved as cloud files". Add the linked-images page as a second Adobe page. |
| 46 | Adobe Express with Frame.io approvals: add the two user licenses | express-frameio, XJ06 | Add two prerequisites to express-frameio, worded as on express-workfront: "An Express Enterprise premium license for the designers who attach the workflow to a template" and "A Standard Workfront license for people who request approval". Keep the Collaborator line for reviewers. Optional: end XJ06 with "and check the license each designer, requester and reviewer needs", as XJ04 does. |
| 47 | Brand Concierge and Adobe Commerce: name all five Commerce values, including store codes | bc-commerce, XA13 | bc-commerce prerequisite: "Commerce environment ID, website code, store code, store view code and API key, supplied by the Commerce or IT team". XA13 parenthesis: "(the Commerce MCP needs Live Search and the Commerce environment ID, website code, store code, store view code and API key)". Add the concierge-management and first-brand-concierge pages to bc-commerce's Adobe pages. Leave the Live Search wording as is. |
| 48 | CRM with Target: Customer Attributes identity wording | crm-target, CR1 | Reword crm-target's Customer Attributes prerequisite (and its SOW wording): "For Customer Attributes: a Customer Attributes product profile in the Admin Console, and the site passes the matching customer ID under the source's alias with the state set to authenticated, through the Experience Cloud ID service (setCustomerIDs) or the Web SDK identityMap; Adobe's Target page also shows mbox3rdPartyId." Leave the Bulk Profile Update API prerequisite as is. |
| 49 | Content Analytics: add the page readiness condition for experience capture | CA01, CA02 | CA01: after "agree which pages and assets to analyze", add "and check that the web pages chosen for experience capture show the same text from their URL alone, with no cookie-based or other personalization". CA02: change "experience capture" to "experience capture for the web pages that qualify". Hours unchanged. The condition is for the web channel only. |
| 50 | Coworker with CJA and Journey Optimizer: add source for B2C edition | cw-cja, cw-ajo | Add https://experienceleague.adobe.com/en/docs/coworker/content/chat/overview to the Adobe pages of cw-cja and cw-ajo, so their B2C edition prerequisites rest on a listed page. Both cards cite only the workflows page, which has no edition wording. No change to the conditions themselves. |
| 51 | Edge Delivery Services launch: add Operational Telemetry and a post-launch Lighthouse recheck | eds, A03 | A03: add a clause to add Operational Telemetry to the current site before launch, compare before and after metrics, and recheck the Lighthouse score on the production domain after cutover. No separate one-time service. A02 already has Lighthouse checks before launch. |
| 52 | Experimentation Accelerator: insights and opportunities need text-based changes | EX03, ajo-xa | EX03 description: end with "...which the accelerator needs before it generates opportunities and, once a test reaches statistical significance, insights; both are limited to experiments with text-based changes." ajo-xa prerequisite: change "opportunities are limited to them" to "insights and opportunities are limited to them". EX05 and EX06: no change. |
| 53 | Frame.io server-to-server automation: add the enterprise account prerequisites | FR06 | Add prerequisites to FR06, keeping its quote and hours: a Frame.io enterprise account with API integration capabilities, on Frame.io V4 and administered in the Adobe Admin Console; a system admin, or a developer assigned the Frame.io S2S API product, with Adobe Developer Console access. A short license tag such as "a Frame.io enterprise account with API access" would fit. No separate migration service. |
| 54 | Frame.io with AEM Assets: Organization ID prerequisite is too strict | frameio-aemassets | Replace "Workfront and AEM Assets under one Organization ID in the Admin Console" with: "Workfront and AEM Assets each associated with an Organization ID in the Admin Console; Adobe allows several AEM Assets repositories on one Workfront environment, or several Workfront environments on one repository, across Organization IDs, with one integration set up for each". Add no cross-org accounts or permissions steps: Adobe's page states none. |
| 55 | GenStudio ad accounts: separate Campaign Manager 360 from Meta and LinkedIn | GS04 | Reword GS04: "Connect your client's Meta, LinkedIn and Campaign Manager 360 accounts with the right permissions (admin access to the advertiser for Campaign Manager 360). For Meta and LinkedIn, confirm historical data reaches Insights and test activation into existing campaigns and ad sets. For Campaign Manager 360, test delivery to the advertiser's creative library; your client's team launches the ads there." Add the CM360 page as a second reference. |
| 56 | GenStudio paid media service names Campaign Manager 360 unconfirmed | GS04 | Confirm GS04's "Campaign Manager 360" on an Adobe page, or reword GS04 to the channels Adobe names on the Activate overview page (Meta, LinkedIn). Do this before any move of GS04. |
| 57 | Journey Optimizer and CJA: two permission routes, not one | ajo-cja | In ajo-cja, replace prerequisite 3 with two lines: "Users with a CJA product profile: CJA Audience Creation and Audience View permissions and the Journey Optimizer Manage profiles permission" and "Users with no CJA license or no CJA product profile: the Journey Optimizer View channel reports permission or a related role". Leave the other prerequisites, the availability line and services JC01 and JC02 as they are. |
| 58 | Journey Optimizer with Experimentation Accelerator: add source for Starter exclusion | ajo-xa | Keep the prerequisite "A paid Experimentation Accelerator license on top of Journey Optimizer, and not a Journey Optimizer Starter package". Add the Experimentation Accelerator product description (helpx) to the card's Adobe pages, since the card's Experience League page does not state the fact. |
| 59 | Journey Optimizer with Target: add audience-sharing permissions | ajo-target, rtcdp-target | On ajo-target add one prerequisite (prereqs and sowPrereqs), matching rtcdp-target: "Audience sharing: a Target user with default workspace access and the Approver role, and destination, profile and segment permissions in Experience Platform to connect and activate". No new citation is needed: the audience-sharing flow already links the Adobe Target connection page. The existing datastream prerequisite stays. |
| 60 | Marketo Engage with Real-Time CDP: replace the outdated stored quote | marketo-rtcdp, XB05 | XB05's stored quote is not found on the Marketo Engage connection page; the first checker found it on the Legacy V2 page (.../catalog/adobe/marketo-engage). Replace it with: "real-time synchronization of audience data and profile attributes", cited to the marketo-engage-connection page. |
| 61 | Marketo Engage with Real-Time CDP: spell out the destination's sync choices | marketo-rtcdp, XB05 | Keep one service, same hours. Reword XB05: connect the Marketo Engage connection destination, choose the sync type (audience only, profile only, or both), the person action (update existing only, or also create new) and the partition for new leads, set the deduplication field (Marketo lead ID and ECID not supported), map fields, activate audiences to Marketo lists. Drop "static". |
| 62 | Marketo Engage with Target: replace the stored Adobe quote on XB08 | XB08, marketo-target | Replace XB08's stored quote with the visible sentence: "After a list is uploaded from Marketo to Adobe Audience Manager, it can also be accessed by Adobe Target." Do not use the first checker's two-sentence version: it fails the word-for-word check. The old quote sits only in the page's meta description, not in the visible text. |
| 63 | Real-Time CDP profile service: note Adobe un-collapses collapsed graphs | RT03 | Add an optional prerequisite to RT03: on an existing sandbox with collapsed graphs, Adobe's account team or support un-collapses them. The first checker also noted that Adobe says primary identity settings are overridden by identity settings, which touches RT01's wording. |
| 64 | Real-Time CDP with Journey Optimizer: separate streaming audiences from edge audiences | rtcdp-ajo | Reword rtcdp-ajo prerequisite 3 from "Streaming or edge audiences, or events, for real-time triggers" to: "Events or streaming-evaluated audiences for real-time journey entry (Adobe supports only streaming-evaluated audiences for audience qualification); edge audiences for same-page and next-page web and app personalization". No new services and no other entry changes. |
| 65 | Sites Optimizer document write-back: optional package line | csrc-so, CS2, aemsites-so | None required: csrc-so and CS2 already hold the tier "Sites Optimizer Ultimate" and the SOW line says "Assumes your client has Sites Optimizer Ultimate." Optional, for consistency with aemsites-so: add to csrc-so prerequisites "Sites Optimizer license; deploying fixes (Auto-Optimize) is in the Ultimate package, while Prime only identifies and suggests". No Prime fallback inside CS2; SO1 and SO2 cover hand-applied fixes. |
| 66 | Target Recommendations from Analytics data: name Target Premium | XL03, aa-target | XL03: add tier "Target Premium" (the field TG04 uses). aa-target: in both prereqs and sowPrereqs, change the last item to "For Recommendations from Analytics data: Target Premium (Recommendations is not in Target Standard) and product variables implemented in Analytics". TG04: none, it already carries the tier. |
| 67 | Target Recommendations setup: name Target Premium as a prerequisite | TG04 | Add a Target Premium license as a prerequisite on TG04. Adobe's feeds page carries the Target Premium badge and TG04 lists no such prerequisite today. |
| 68 | Target on Edge Delivery setup service: fix the quoted Adobe sentence | XA22 | XA22 only: keep the page https://www.aem.live/developer/target-integration and replace the stored quote with "We support 2 different ways of integrating with Adobe Target. The recommended future-proof approach is via the Adobe Experience Platform WebSDK". The current quote is not on that page; it sits on the martech plugin page and describes the plugin's prerequisites. |
| 69 | Warehouse sources into Real-Time CDP: tidy the license tag wording | dwh-rtcdp, DW1 | No new prerequisite: the license is already on the card and on DW1 as a "Needs" tag. Optional polish: word the tier with Adobe's full name, "the standalone Advanced Enterprise Source Connectors SKU". Add to the first prerequisite that Adobe lists the Azure Databricks source for Experience Platform on Azure only (BigQuery and Snowflake: Azure and AWS). |
| 70 | Workfront + Journey Optimizer card: widen label to mention message triggering | workfront-ajo | Widen the workfront-ajo connection label and availability line to mention message triggering. Today the label reads "Fusion connector creates Journey Optimizer templates and fragments". Do this only if the Fusion message service is added or XB15 is widened. |
| 71 | Workfront Planning + AEM Assets card: add the AEM and Workfront integration prerequisite | planning-aemassets | Add to the planning-aemassets prerequisites what Adobe states: "an Adobe Experience Manager license and an integration between Adobe Experience Manager and Workfront to connect AEM assets or content fragments with Planning record types". The card names only the license today. |
| 72 | Workfront Planning reports service: name Data Connect license, add warehouse clause | WP06, planning | On WP06, add the prerequisite: Workfront Data Connect (included in Workflow Ultimate; an add-on for Workflow Select or Prime; use is limited by allotted compute hours). Extend the wording: "...for their own reporting tool or their own data warehouse, through a Snowflake reader account connection". Add a second source, the share-data-externally page. The second checker also proposed the tag "Needs the Workfront Ultimate package": settle on one license wording. Do not add schema-mapping, snapshot or scheduled-validation tasks. |
| 73 | Workfront Planning with Workfront: lookup fields show to all workspace viewers | planning-workfront, XJ25, AXA03 | Add a prerequisite to planning-workfront: "Lookup fields from Workfront show to everyone with View or higher permission on the Planning workspace, whatever their Workfront access: agree the fields and the workspace sharing first". In XJ25, after "bring in the lookup fields leaders need", add "agreed with your client, since everyone who can view the workspace sees them". AXA03 (lookup fields from AEM Assets) could carry the same note. |

## Part 3. Overlaps (the same work could be billed twice)

### Needs a decision (42)

**74. AEM Assets with Express and Firefly: build on the agreed folders and tags** (Reword; small)

- Entries: `XJ02`, `XJ03`, `XK02`, `AS02`
- Change: Reword only, no removal. XJ02: "Using the metadata forms and tags already set in AEM Assets, add any missing metadata tabs and set up the filters and saved searches in the Assets view...". XJ03 and XK02: open with "Within the folder structure and tags already agreed for AEM Assets, agree where ... land", keeping the guide, naming, tracing and output-node work.
- Adobe says: Experience League, native-integration-adobe-express: "Content Advisor uses the same metadata configuration as in Assets View, replicating the list of metadata tabs and content in Assets view asset details page."
- I recommend: Make the three wording edits. Adam decides the hours.
- **Your call:** Should XJ02, XJ03 and XK02 keep their current hours once they say they build on AS02's folders, tags and metadata forms, or do you want them lowered?
- From claims: c2-d16

**75. AEM Forms migration and AEM Sites content migration share transfer runs** (Overlap note; small)

- Entries: `AF11`, `SI03`
- Change: Keep both services and hours. Add one sentence to AF11 only: where the AEM Sites content migration is also in scope for the same source, the Content Transfer Tool setup and transfer runs are planned together and counted once. Do not say the forms paths join the Sites migration set.
- Adobe says: experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/setup-configure-migrate/migrate-to-forms-as-a-cloud-service: "the content transfer tool migrates the content from your AEM Forms environment to an AEM as a Cloud Service environment"
- I recommend: Add the one sentence to AF11 and leave hours alone. The overlap only exists when both optional services are chosen.
- **Your call:** When a statement of work has both the AEM Sites content migration (SI03) and the AEM Forms migration (AF11), do you want a one-sentence note on AF11 saying the transfer runs are counted once, or leave both as they are and let the partner trim hours?
- From claims: c2-d15

**76. AEM Forms with Coworker: build on the connectors already set up** (Reword; small)

- Entries: `AFX14`, `AF04`, `AF05`
- Change: Reword AFX14 so it builds on AF04 and AF05: "Check that the submit connectors and Form Data Model services built for the forms are ones Coworker can select, add any connector or custom function still missing, then test the rule and submission prompts with your client's team." Keep the page, quote and optional status.
- Adobe says: Experience League, AEM forms-use-cases: "The connector must already be configured in Experience Manager before the Form submission configuration skill can select and set it"
- I recommend: Reword AFX14 as given and keep it optional. Adam decides the hours.
- **Your call:** Should AFX14's hours (8/16/32) stay as they are once it covers only the missing connectors, custom functions and prompt testing?
- From claims: c2-d17

**77. Accelerator access for Target teams should not start selected** (Reword; small)

- Entries: `XH03`, `EX01`
- Change: Make XH03 optional (not starting selected). Both EX01 and XH03 start selected today, so a Target-only client is counted twice. Target users who also hold Journey Optimizer use the roles route in EX01.
- Adobe says: https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-access: "users with only a target license can access it only through the apps switcher."
- I recommend: Make XH03 optional.
- **Your call:** Should "Accelerator access for Target teams" (XH03) stop starting selected, so a partner adds it only when the client has people with a Target license alone?
- From claims: c2-d20

**78. Acrobat PDF viewer embed: point to the AEM Sites and Adobe Analytics services** (Overlap note; small)

- Entries: `AB06`, `XN19`, `XN21`
- Change: Wording only. Add to AB06, by service name, not id: "For pages on AEM Sites, use PDF Viewer component on site pages instead. Where your client has Adobe Analytics, the event mapping and report are PDF viewing events in Adobe Analytics." Optionally narrow AB06's last clause to "viewer events passed to your client's own analytics tool". XN19 and XN21 unchanged. No hours change.
- Adobe says: https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtodata: "To automatically receive PDF analytics events, pass the Analytics report suite ID when creating the AdobeDC.View instance."
- I recommend: Add the pointer sentence to AB06. Leave XN19, XN21 and hours alone.
- **Your call:** AB06 is already optional and XN21 is already narrow, so the only fix is one pointer sentence in AB06 telling partners to pick the AEM Sites component service instead on AEM pages. Do you want that sentence added, or leave it since partners choose their own services?
- From claims: c2-d42

**79. Acrobat Services with Acrobat Sign: narrow generated agreements to the joining work** (Reword; small)

- Entries: `XN17`, `AB05`, `SG09`
- Change: Reword XN17 to the joining work: add Acrobat Sign text tags to the generated agreement templates with the Document Generation Tagger, pass each generated document to Acrobat Sign for signature, and test end to end. Say the Word templates and Document Generation API connection are AB05 and the Sign API application and webhooks are SG09. Hours then need the owner's review.
- Adobe says: https://experienceleague.adobe.com/en/docs/acrobat-services-learn/tutorials/usecases/acceleratesales: "Use Acrobat Sign to capture e-signatures on your generated agreements"
- I recommend: Narrow XN17 and name AB05 and SG09 as the owners of the rest. Adam sets the hours.
- **Your call:** Should XN17 be narrowed to the joining work only (with lower hours, your estimate), or stay a self-contained bundle for partners who pick it without AB05 and SG09?
- From claims: c2-d40

**80. Acrobat document automation: optional pointer to Workfront Fusion and Power Automate** (Overlap note; small)

- Entries: `AB04`, `XN18`, `AB10`
- Change: Not a defect; the second check found no duplicate. Optional: add one sentence to AB04 saying document steps that run in Workfront Fusion or Power Automate are scoped under those services instead (XN18, AB10). No change to XN18, AB10 or any hours.
- Adobe says: Workfront Fusion pdf-modules page: "PDF Services also allow you to combine, compress, or read metadata for a PDF file, as well as control password protection on the file."
- I recommend: Optional. Add the one sentence, by service name, or leave as is. Do not cut XN18.
- **Your call:** Do you want one sentence on AB04 saying document steps that run in Workfront Fusion or Power Automate are scoped under those services instead (XN18, AB10)?
- From claims: c2-d41

**81. Acrobat with Acrobat Sign: signature training becomes a short briefing** (Reword; small)

- Entries: `XN15`, `AB11`, `SG13`
- Change: Reword XN15 only: "Agree with your client which teams send for signature from Acrobat and which use Acrobat Sign Solutions, write the short guide for requesting, tracking and saving agreements as templates in Acrobat, and brief the teams on which route to use. Hands-on training sits in each product's own training service." Leave AB11 and SG13 unchanged.
- Adobe says: https://helpx.adobe.com/acrobat/desktop/e-sign-documents/learn-about-signatures/e-sign-overview.html: "Use Request e-signatures to send documents to others for electronic signatures through Adobe Acrobat Sign."
- I recommend: Reword XN15 as given. Adam decides whether its hours come down.
- **Your call:** If XN15's training becomes a short briefing, do you want to lower its hours (now 16/24/48, the same as full Acrobat Sign training)?
- From claims: c2-d38

**82. Acrobat with Adobe Express: drop the repeated product-profile decision** (Reword; small)

- Entries: `XN20`, `AB01`, `AB03`, `acrobat-express`
- Change: Reword XN20 only: "Make your client's brand kits and templates available to the groups whose product profile keeps Adobe Express on, and show teams how stylizing a PDF, editing images and bringing a file back work." Keep the acrobat-express prerequisite (Express services left on in the product profile). AB01 and AB03 unchanged.
- Adobe says: helpx.adobe.com/acrobat/desktop/use-acrobat-ai/set-up-acrobat-generative-ai/acrobat-studio-enterprise.html: "To revoke access to AI Assistant, disable AI Assistant, and Adobe Express in the product profile."
- I recommend: Reword XN20 as given. Keep the prerequisite and the hours.
- **Your call:** XN20 can be sold with AB01 unticked. Are you fine with the "which groups keep Express on" decision living only in AB01 and the connection's prerequisite, and do XN20's hours (8/16/32) stay as they are?
- From claims: c2-d43

**83. Adobe Analytics data collection: say which site route each service covers** (Reword; medium)

- Entries: `AN03`, `XL13`, `XL11`, `XL14`
- Change: Reword only, no removals. XL13: say it uses the datastream and data layer from AN03 where that is in scope, and that the plugin loads Web SDK itself. AN03: add that on Edge Delivery pages it covers the data layer, datastream and variable mapping, not the Web SDK extension. XL11: say it is the Analytics-extension route, an alternative to AN03's Web SDK setup. Leave XL14 as is.
- Adobe says: https://www.aem.live/developer/martech-integration: "you do not add the Adobe Experience Platform Web SDK, the Adobe Analytics or the Adobe Target extensions"
- I recommend: Make the three wording edits now. Adam decides whether AN03's hours or starting selection change.
- **Your call:** When Adobe Analytics sits on the canvas with Edge Delivery or AEM Sites, should the hours of AN03 stay as they are with only the wording changed, or should AN03 start unselected (or smaller) so the site's tag setup is not counted twice?
- From claims: c2-d35

**84. Analysis Workspace projects: optional note about reports built under connection services** (Overlap note; small)

- Entries: `AN04`, `CJ04`, `XL02`, `XL10`, `XL15`, `XN21`, `XM32`
- Change: Not a duplicate; the second check found the texts already separate the work. Optional: a one-line note on the general Analysis Workspace services (Adobe Analytics AN04 and Customer Journey Analytics CJ04) saying reports built under a connection service are scoped there and not counted again. If added, add it to both, not AN04 alone. No hours change.
- Adobe says: https://experienceleague.adobe.com/en/docs/analytics/analyze/analysis-workspace/home: "Analysis Workspace allows you to build analyses quickly to gather insights and then share those insights with others."
- I recommend: Optional. If wanted, one rule on both AN04 and CJ04. Otherwise leave as is.
- **Your call:** Do you want a one-line note on the general Analysis Workspace services (Adobe Analytics AN04 and Customer Journey Analytics CJ04) saying reports built under a connection service are scoped there and not counted again, or leave them as they are?
- From claims: c2-d36

**85. Analytics upgrade to CJA repeats the two Adobe Analytics + CJA services** (Overlap note; medium)

- Entries: `CJ03`, `XL07`, `XL08`, `aa-cja`
- Change: Add ['CJ03',['XL07','XL08']] to OVERLAPS in sow/index.html, so the overlap review asks how they differ when CJ03 sits beside XL07 or XL08. Alternative: reword CJ03 to planning, Web SDK implementation and reporting API and export porting, and point history and project migration to XL07 and XL08. XL07's multi-report-suite Data Prep work is not in CJ03 and stays.
- Adobe says: https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/upgrade-to-cja/cja-upgrade-recommendations: "Set up the Adobe Analytics source connector (for bringing over historical data)" and "Migrate projects and components"
- I recommend: Add the overlap review entry. It follows the Nov 3 rule and needs no hours change.
- **Your call:** When the Analytics upgrade (CJ03) is picked with XL07 or XL08, should the SOW ask how they differ, or should CJ03 be narrowed and its hours (your estimates) lowered?
- From claims: g-d03

**86. Base Coworker pilot and training repeat the Coworker connection services** (Overlap note; small)

- Entries: `CW02`, `CW05`, `XB10`, `XB14`, `XJ32`, `XJ33`, `XQ04`, `XG08`, `XH01`, `XH02`
- Change: Keep all ten services and hours. Widen CW05's basis sentence to: "Reduce the hours for pilot and training already delivered under another statement of work or under a Coworker connection service in this one." Add a matching sentence to CW02 for user access checks. No wording change on XJ32 or XH01. Extending the canvas overlap flag to these pairs is optional.
- Adobe says: https://experienceleague.adobe.com/en/docs/coworker/content/home: "Assign roles and access to Coworker features". The page says nothing on billing.
- I recommend: Add the two sentences now. Leave the flag as optional.
- **Your call:** When the base Coworker services and a Coworker connection service are in one statement of work, is one sentence telling the partner to reduce pilot and training hours enough, or should the tool also flag the pair?
- From claims: c2-d11

**87. CDN log forwarding by the partner starts switched on** (No change; small)

- Entries: `OX1`, `L02`, `cdn-bv`, `bv`
- Change: None. L02 and OX1 are not duplicates: they split Adobe's two phases with one owner each, and the SOW tool already tells the partner to take OX1 off when the client's team creates the job. OX1 starting on is the owner's step 45 decision (Nov 4, "go"). Starting it off would undo that.
- Adobe says: experienceleague.adobe.com/en/docs/brand-visibility/using/log-forwarding/log-forwarding-overview: "register your CDN on the CDN Configuration page to generate the needed S3 credentials and path details" and "create a log-forwarding job (or upload logs manually) in your CDN provider's console"
- I recommend: Keep it on as decided on Nov 4. The page does not say who does the CDN console work.
- **Your call:** On Nov 4 (step 45) you said "go" to CDN log forwarding, set up by the partner (16 hours) starting switched on in every Brand Visibility play. A reviewer says the client's IT team usually runs its own CDN console, so it should start off. Keep it on as you decided, or start it off?
- From claims: m2-b02

**88. CJA audience services with Real-Time CDP and Target: add to overlap review** (Overlap note; medium)

- Entries: `C06`, `RC03`, `TC04`, `XA05`, `rtcdp-cja`, `target-cja`, `rtcdp-target`
- Change: Add three pairs to the overlap review: RC03 + C06, TC04 + RC03, and TC04 + XA05. All four services start selected and the overlap review lists none of them today. C06 stays selected (AI-referred visitors, plan only; kept on Nov 1).
- Adobe says: experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/audiences/publish: "After you create and publish an audience in Customer Journey Analytics, the audience is available in Experience Platform"
- I recommend: Add the three pairs to the overlap review, in line with the Nov 3 rule that every service counts.
- **Your call:** With CJA, Real-Time CDP and Target together, three services start selected that each build and publish CJA audiences (C06, RC03, TC04). Should the tool ask the partner how they differ in its overlap review, or should TC04 start unselected when RC03 is on?
- From claims: m-d01

**89. Content Analytics + GenStudio ad tracking: reword so tracking design is set once** (Reword; small)

- Entries: `XD14`, `CA04`, `ca-gspm`
- Change: Reword XD14 only: "Confirm the ad accounts GenStudio activates into are connected as Experience Platform paid media sources for Content Analytics, then apply and test the tracking ID and URL parameter convention at activation. Where Paid media channel setup (CA04) is selected, the convention and key mapping are set there." XD14 must still stand alone, since CA04 is optional. No hours change proposed.
- Adobe says: experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/paid-media: "requires customer-specific tracking-key mapping and reporting configuration" and "Enabling the connector does not automatically add these parameters to your ad URLs"
- I recommend: Make the wording change. Leave hours as they are.
- **Your call:** When both CA04 and XD14 are selected, do you want XD14's hours lowered, or is the wording change alone enough?
- From claims: c2-d21

**90. Content Analytics + GenStudio monthly service repeats GenStudio's variant work** (Reword; small)

- Entries: `XD15`, `GS06`, `CA06`, `ca-gspm`
- Change: Reword XD15 to stop at the hand-off: "Each month, pull the strongest and weakest creative attributes of GenStudio-activated ads from Content Analytics and turn them into GenStudio prompts and briefs for that month's content refresh." Drop "generate and approve variants, and retire weak ads" (GS06 owns that). Leave CA06 and GS06 as they are.
- Adobe says: experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/insights/overview: "Find content that is not performing well and use the integrated generative AI to create variations immediately"
- I recommend: Trim XD15 to analysis and briefs. GS06 is always beside it and already owns the variants.
- **Your call:** XD15 and GS06 both count making and approving new ad variants each month. OK to trim XD15 to the analysis and briefs only, and do you want its hours lowered to match?
- From claims: c2-d23

**91. Content Analytics paid media setup overlaps Ad platforms + CJA services** (Overlap note; medium)

- Entries: `CA04`, `AD1`, `AD2`, `ads-cja`
- Change: Add to CA04's scope: "Where Ad platform sources into CJA or Ad spend joined to web conversions is also in the SOW, the source connections and the campaign-level join are done there; this service then covers enabling the paid media channel and the asset and experience tracking keys." Or list CA04 beside AD1 in the overlap review.
- Adobe says: experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/guided: "Paid media requires the configuration of Experience Platform source connectors to your ad publishers."
- I recommend: Pick one of the two. Either fits; the overlap review matches the Nov 3 rule.
- **Your call:** When Content Analytics paid media setup (CA04) and the Ad platforms + CJA services (AD1, AD2) are in the same SOW, do you want a sentence in CA04 saying the connector setup is done once, or should the pair go into the overlap review like the outside-system services?
- From claims: m-d02

**92. Content Hub setup counted twice with GenStudio for Performance Marketing** (Reword; small)

- Entries: `XG04`, `XG03`, `AS05`, `aemassets-gspm`
- Change: XG04: open with a guard, e.g. "Where Content Hub's approval step and portal are not already set up (Content Hub portal for approved assets), set up the approval fields and configure filters, asset details and search; approve the assets creators need and check expiry dates." XG03: keep the text; note the Content Hub deployment is not counted again when AS05 is selected. AS05 unchanged.
- Adobe says: experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/content/connect-aem-repo: "Follow the Deploy Content Hub self-service process to enable Content Hub for your existing AEM Assets in Cloud Manager"
- I recommend: Add the wording guard to XG04 and the note to XG03. Leave hours as they are.
- **Your call:** When a partner picks AS05 together with XG03 and XG04, should the hours for XG03 and XG04 drop automatically, or is a wording guard on XG04 enough?
- From claims: c2-d12

**93. Coworker plugin packaging service ticked by default** (No change; small)

- Entries: `CW07`, `cw`
- Change: No change proposed. The checkers left one owner call: whether "Package Skills and connections as a plugin" (CW07, 16 to 64 hours) stays ticked by default on the Coworker card or starts unticked.
- Adobe says: experienceleague.adobe.com/en/docs/coworker/content/customizations/plugins/manage-plugins-for-your-org: "how plugins package skills and connected services". The page says nothing about overlap between services.
- I recommend: Keep it as it is unless you want a smaller starting Coworker scope.
- **Your call:** Should "Package Skills and connections as a plugin" (CW07, 16 to 64 hours) stay ticked by default on the Coworker card, or start unticked for clients who only want Skills inside their workspace?
- From claims: m2-b09

**94. Creative Cloud plugin packaging counted in three services** (Reword; small)

- Entries: `XJ20`, `XJ23`, `CC02`
- Change: Wording only, CC02 unchanged. In XJ20 and XJ23, replace "Add ... to your client's Creative Cloud deployment packages" with: include the plugin in the packages built under Deployment packages with apps and plugins where that service is selected, or add it to your client's existing packages (XJ23: or a plugin-only package) where it is not.
- Adobe says: helpx.adobe.com/business/enterprise/deploy-apps-updates/create-packages/create-managed-packages.html: "Create customized packages that contain Adobe apps and services, configuration options, or Marketplace plugins."
- I recommend: Make the wording change in XJ20 and XJ23. Leave hours as they are.
- **Your call:** When CC02 is selected with XJ20 or XJ23, do you want their hours lowered for the shared packaging step, or is the wording change enough?
- From claims: c2-d25

**95. Edge Delivery build says "set up authoring" that connection services also cover** (Reword; small)

- Entries: `A01`, `CS1`, `AXD01`, `AXD02`, `eds`, `csrc-eds`, `aemsites-eds`
- Change: In A01's description and deliverable, narrow "set up authoring" / "configured authoring" so content-source setup is scoped on its connection card (CS1 for documents; AXD01 and AXD02 for AEM Sites authoring), e.g. "connect the agreed content source (its setup is a separate service when AEM Sites or Authoring docs is on the canvas)". Leave CS1, AXD01 and AXD02 unchanged. No hours change.
- Adobe says: https://www.aem.live/docs/aem-authoring: "the same concepts of page blocks and sections used when authoring document-based content are used to structure your pages"
- I recommend: Reword A01 only so authoring setup is counted once, on the connection card. Keep all hours. AXD02 is not a duplicate and stays.
- **Your call:** A01 is one of the older template services whose wording you approved and it shows in the SOW. OK to reword "set up authoring" so the content-source setup is counted only in AXD01 or CS1, with A01's hours left as they are?
- From claims: m2-b06, c2-d01

**96. Express approval templates in Workfront are built twice (XJ06 and XJ14)** (Reword; medium)

- Entries: `XJ06`, `XJ14`
- Change: Reword XJ06 to the Express-only part: attach unified approval templates to Express templates, run one remix through approval, train reviewers in the Frame.io viewer. Say the template build is XJ14 (the first checker adds: when Frame.io + Workfront is in scope). Lower XJ06's hours.
- Adobe says: experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/express-wf-frame: "a user with a Standard license must create an approval workflow template in Workfront" (links to XJ14's own page)
- I recommend: Reword XJ06 to the Express-only work and let Adam set the lower hours.
- **Your call:** XJ06's hours would drop once template building moves to XJ14: what should the new low, typical and high hours be (16/24/48 today)?
- From claims: c2-d24

**97. Express review: Workfront Proof route and Frame.io route are either/or** (Overlap note; small)

- Entries: `XJ04`, `XJ05`, `XJ06`
- Change: Add a line on XJ04/XJ05 and XJ06 that they are either/or (Workfront proofing viewer or Frame.io viewer) for the same Express templates. XJ04 and XJ05 are a separate route, not the same tasks, so nothing is removed.
- Adobe says: experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/wf-proof-and-express: "using advanced proof templates" and "Workfront proofing viewer" (a separate route from unified approval with the Frame.io viewer)
- I recommend: Add the either/or line now. Changing which services start selected is Adam's call.
- **Your call:** When Express, Workfront and Frame.io are all on the canvas, should the Proof services (XJ04, XJ05) start unselected so only the Frame.io route is counted, or is an either/or line enough?
- From claims: c2-d24

**98. Firefly Creative Production workflow build: state what the connection services cover** (Reword; small)

- Entries: `FP03`, `FP04`, `XK01`, `XK05`, `XK06`, `XK07`
- Change: Wording only, no hours change. Add one sentence to FP04 (and optionally FP03): "Connecting AEM Assets or Frame.io as the source and destination, and preparing InDesign or Photoshop merge templates, are separate services." XK01 and XK05 stay as they are.
- Adobe says: https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/use-template-and-data-merge-nodes.html: "You connect workflow inputs" and "Treat template upload as the prerequisite step"
- I recommend: Add the sentence to FP04 and FP03.
- **Your call:** Do you want a one-sentence boundary added to FP04 (and FP03) saying that storage connections and merge templates are separate services, or is the product and connection split clear enough as it is?
- From claims: c2-d28

**99. Firefly Custom Models: connection services publish the models a second time** (Reword; small)

- Entries: `FM03`, `FM04`, `FM05`, `XK08`, `XK09`, `XK10`
- Change: XK09 and XK10: drop "Publish the approved models" and start from the models published under FM03. Word sharing as adding the Express users or design team under FM05's permission plan. Keep the in-app check, guide hand-over and designer walkthrough. XK08: say the technical account is added under the FM05 plan. FM03, FM04, FM05 unchanged.
- Adobe says: https://helpx.adobe.com/firefly/web/custom-models/manage-custom-models/share-custom-models.html: "generator : can generate with your published model in creative cloud apps but cannot edit or review."
- I recommend: Make the wording edits. Hours are Adam's call.
- **Your call:** With publishing taken out of XK09 and XK10, do you want to lower their hours (now 8/16/24 and 8/16/32), or leave them as they are?
- From claims: c2-d32

**100. Frame.io + AEM Assets services repeat the Workfront to Assets connection** (Reword; medium)

- Entries: `XB12`, `XJ17`, `XJ18`
- Change: Keep XB12 as owner of the repository connection and metadata mapping. Make XJ17 and XJ18 conditional, not stripped: where XB12 is in scope, XJ17 covers only sending and testing approved files, and XJ18 only extra fields for approved assets. Where AEM Assets + Workfront is not on the canvas, XJ17 still sets the integration up. Hours are the owner's.
- Adobe says: experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/use-aem-with-frame and .../configure-integrations/configure-aacs-integration both say: "you can't change the repository after you save the initial configuration"
- I recommend: Add the conditional wording to XJ17 and XJ18 with XB12 as owner. Leave hours until Adam decides.
- **Your call:** When Frame.io, Workfront and AEM Assets are all on the canvas, should XJ17 and XJ18 drop to smaller hours, or stay as they are with wording that says the Workfront connection is counted once under XB12?
- From claims: c2-d13

**101. Implement Brand Concierge repeats the script, knowledge source and handoff services** (Overlap note; medium)

- Entries: `F02`, `XP06`, `XP07`, `MQ01`, `MQ03`, `CM1`, `CM2`, `XA11`, `XA12`, `AXE03`, `C04`, `bc`, `mqualifier-bc`
- Change: No hours change. Either add CM1, CM2, XA11, XA12, AXE03, XP06 and XP07 to the overlap review against F02 (as C04 already is), or add to F02's assumptions: where a Brand Concierge connection is on the canvas, its knowledge-source, script and handoff services carry that setup, and F02 covers curation, conversation design, testing and rollout. Add to XP06: where Marketo Qualifier is in scope, users and calendars are set up once under MQ01 and MQ03. No change to C04.
- Adobe says: experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/sales-handoff/configure-in-composer: "Complete Set up representatives in Adobe Marketo Qualifier first. The integrations check for connected calendars and live chat availability, and will not activate without them."
- I recommend: Add the notes to F02 and XP06, or add the seven services to the overlap review against F02, matching C04. Leave the hours alone.
- **Your call:** F02 (Implement Brand Concierge) already includes sources, the handoff and launch, and the Brand Concierge connection services cover the same steps. Should the SOW ask how they differ (as it does for C04), do you want a one-line "counted once" note on F02 and XP06, or would you rather lower F02's hours when a Brand Concierge connection is on the canvas?
- From claims: m2-b07, c2-d04

**102. Implement Brand Concierge: overlap with handoff, source and install services** (Overlap note; medium)

- Entries: `F02`, `XP06`, `XP07`, `CM1`, `CM2`, `AXE03`, `XA11`, `XA13`
- Change: Hours: none. No split unless the owner wants one. Either add one sentence to F02's assumptions saying handoff, knowledge-source and script-install work is counted once when XP06, XP07, CM1, CM2, AXE03, XA11 or XA13 is in the same statement of work, or add those pairs to the overlap review so the SOW asks how they differ. The reviewer's "hours are wrong" claim did not hold.
- Adobe says: https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/brand-concierge-faq : "many implementations reach go-live in about 6-9 weeks". The "15-30 minutes" in the first-concierge guide is a first draft in preview, not a launch.
- I recommend: Add the pairs to the overlap review, in line with the Nov 3 rule. Leave the hours and the single line as they are.
- **Your call:** F02 (640 hours Typical) already includes the handoff, content sources and page install. The connection services for the same work (XP06, XP07, CM1, CM2, AXE03, XA11, XA13) also start selected. Do you want a one-line note in F02, those pairs added to the overlap review, or F02 left as is?
- From claims: m-d05

**103. Journey Optimizer B2B communication limits set twice (JB02 and XH07)** (Reword; small)

- Entries: `JB02`, `XH07`, `ajob2b-marketo`
- Change: Leave JB02 as is. Reword XH07: "Review the communication limit rules set in the B2B Edition so they suit sends from both products, raise the request with Adobe to extend them to your client's Marketo Engage Munchkin codes, and test that an email over the limit is held back whichever product sends it."
- Adobe says: https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/channels/configure-channels-emails : "the communication limit rules are defined in one location"
- I recommend: Reword XH07 so the rules are set once, under JB02. Hours are your call.
- **Your call:** XH07 loses the rule setup (JB02 keeps it). Do you want XH07's hours (8/16/24) lowered, or left as they are?
- From claims: c2-d19

**104. Journey Optimizer first journeys named three times (welcome, abandoned cart)** (Reword; medium)

- Entries: `JO05`, `XA01`, `XA02`, `XA16`
- Change: Hours untouched. XA01: Real-Time CDP audiences and profile attributes as entry, conditions and suppression for the starting journeys, then test. XA16: Commerce events set up as journey events, and cart and order data added to the cart and browse journeys. XA02: add "beyond the starting journeys". Alternative: keep the wording and give these lines the step 30 overlap note beside JO05.
- Adobe says: Blueprints event-triggered-messaging page (XA01's page): "Common scenarios include abandoned cart recovery, post-purchase follow-up, welcome messages after registration"
- I recommend: Reword the three connection lines to the extra work only; JO05 stays the owner of the first journeys.
- **Your call:** Your Nov 3 rule is that every service counts and the SOW asks how overlapping services differ. Do you want these three connection lines reworded to the extra work only, or kept as they are with that same overlap note beside First journeys and campaigns?
- From claims: g-d01

**105. Marketo + Workfront services reuse Workfront's request form and project template** (Reword; small)

- Entries: `XB01`, `XB02`, `WF03`, `WF04`
- Change: Reword only, no merge. XB01: "Add the campaign fields the automation needs to the Workfront request form (built under WF03 where selected) and build the Fusion scenario that picks the right Marketo program template, clones it and passes request details into its My Tokens." XB02: start "Add a Ready for Review task and status to the campaign project template (built under WF04 where selected), ...". Hours unchanged.
- Adobe says: experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/b2b-patterns/campaign-review-and-approval: "Configure your Workfront Project with a Ready for Review task"; "Use project templates... define tasks, queue topics, create custom forms"
- I recommend: Reword XB01 and XB02 as written and keep their hours. The Fusion scenarios are the bulk of the work and are distinct.
- **Your call:** When Workfront's own services (WF03, WF04) are on the same SOW as the Marketo + Workfront services (XB01, XB02), do you want XB01 and XB02's hours left as they are, or trimmed because the request form and project template are already built?
- From claims: c2-d08

**106. Marketo Measure stage mapping in two services on Ultimate (MZ05, XM31)** (Reword; small)

- Entries: `MZ05`, `XM31`, `mmeasure-rtcdp`
- Change: Add one sentence to MZ05: "On Marketo Measure Ultimate, the stage mapping rules for each dataset are built under Marketo Measure destination and stage mapping; this service then covers the attribution model weights and the touchpoint and segment review." Keep XM31's text. No new service.
- Adobe says: https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-ultimate/marketo-measure-ultimate-overview : "All Marketo Measure Ultimate rules are dataset-specific"; "We no longer automatically include CRM stages on stage mapping"
- I recommend: Add the sentence to MZ05 so stage mapping has one owner on Ultimate. Hours are your call.
- **Your call:** When a statement of work has both services on Marketo Measure Ultimate, should MZ05's hours drop, or is the one-sentence note enough? Hours are your estimates.
- From claims: c2-d34

**107. Marketo Optimizer Coworker Skills service should replace the general Coworker Skills** (Overlap note; medium)

- Entries: `XQ06`, `CW03`, `cw`
- Change: Add XQ06 to the SPECIAL list in sow/canvas/template.html through a patch step, so ticking it replaces CW03, as the other seven Skills services do (CW-CJA, CW-AEM, CW-FSI, AXD11, XA25, XA26, XA27). The partner can still keep CW03. Check whether other copies of the list (sow/index.html, the Services step) need the same id. No hours change. No change to CW02, CW03's default or the per-product rollout services.
- Adobe says: experienceleague.adobe.com/en/docs/marketo-optimizer/user/coworker/skills: "These skills answer product questions and let you build new custom skills."
- I recommend: Add XQ06 to the list so it behaves like the other seven. It is Skill authoring like them.
- **Your call:** XQ06 Skills are built inside Marketo Optimizer's own chat. Should ticking XQ06 replace the two general Coworker Skills (CW03), as the other seven Skills services do, or should both count?
- From claims: m2-b09, c2-d10

**108. Marketo Optimizer Coworker brief service rebuilds first programs and journeys** (Reword; small)

- Entries: `XQ05`, `MO03`, `MO05`, `MO06`
- Change: Reword XQ05 only: "Write the campaign brief template your client's team fills in, with the program type, audience criteria, journey design and tokens Coworker looks for, prove it by building one pilot program from a real brief, and run Coworker's check before launch." Consider renaming it "Campaign brief template for Coworker". No change to MO03, MO05, MO06 (no overlap with MO06).
- Adobe says: experienceleague.adobe.com/en/docs/marketo-optimizer/user/coworker/program-from-brief : the skill "builds that entire structure end-to-end from your brief - the program itself, subfolders, tokens, people lists, and person journeys"
- I recommend: Reword XQ05 to the brief template, one pilot program and the check. Hours are your call.
- **Your call:** XQ05's hours (16/32/56) were set when it built "the first programs". If it becomes a brief template plus one pilot program, do you want to lower them?
- From claims: c2-d48

**109. Marketo Optimizer journey entries and listen steps built twice (MO05, XQ02)** (Reword; small)

- Entries: `MO05`, `XQ02`, `moptimizer-marketo`
- Change: Reword XQ02: "Map the Marketo Engage activities (form fills, email clicks, web visits) that the journeys in First person journeys enter and listen on, add the actions that add people to Marketo Engage static lists, change Marketo Engage program status and request Marketo Engage campaigns, then test each hand-off in both products." MO05 unchanged.
- Adobe says: experienceleague.adobe.com/en/docs/marketo-optimizer/user/audiences/event-based-audiences : "select one or more Marketo Engage activities (standard or custom) as the qualifying events"
- I recommend: Reword XQ02 so MO05 alone builds entries and listen steps. Hours are your call.
- **Your call:** XQ02 would do less after the rewording (no entry or listen-for-event build). Do you want its hours (24/40/72) lowered, or left as they are?
- From claims: c2-d47

**110. Marketo Qualifier representative calendar setup billed twice (MQ03, XP06)** (Reword; small)

- Entries: `MQ03`, `XP06`, `MQ01`, `mqualifier-bc`
- Change: Reword XP06 to the concierge-only work: "Confirm each representative's calendar is connected (set up under Outlook, calendars and booking links), write the meeting confirmation email, set live chat availability, check everyone under Manage members, and choose round robin or a direct agent for meetings and for chats." Drop "Add your client's representatives" (MQ01 covers it). Leave MQ03 as is.
- Adobe says: https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/sales-handoff/representative-setup : "Each representative does this once, in their own profile"
- I recommend: Reword XP06 so the calendar is connected once, under MQ03. Hours are your call.
- **Your call:** XP06 would cover less work after the reword. Do you want to lower its hours (16/24/48 today), or keep them?
- From claims: c2-d45

**111. Sites Optimizer scanner and first pilot fix listed in three services** (Overlap note; medium)

- Entries: `AXC05`, `CS2`, `SO1`, `aemsites-so`, `csrc-so`
- Change: No merge. AXC05 and CS2: word the pilot fix as a connection test, one of the first fixes agreed in Sites Optimizer setup (SO1), not an extra one. Scanner allow-listing: either remove it from AXC05 (SO1 keeps it), or add "Where Sites Optimizer setup is also in scope, the scanner is allowed once." SO1 assumptions: connecting the content source (SharePoint app or Drive share) and the AEM author route are scoped in their own services.
- Adobe says: experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/settings: "Grant AEM Sites Optimizer access to your content source" (one Settings task)
- I recommend: Make the counted-once wording changes with the SO1 move. The core work of the three services differs. AXC05's hours are your call.
- **Your call:** Sites Optimizer setup and the two connection services each include a first pilot fix and the scanner allow-listing. Add wording saying these are done once with hours unchanged, or take the scanner work out of AXC05 and lower its hours (16/24/40), and to what?
- From claims: m2-b05, c2-d03

**112. Sites Optimizer setup overlaps Connect Sites Optimizer to AEM author** (Overlap note; medium)

- Entries: `SO1`, `AXC05`, `aemsites-so`
- Change: Once SO1 sits on the product, it starts selected beside AXC05 on an AEM Sites canvas (both 16/24/40 hours). The scanner allow-list sits in both SO1's assumptions and AXC05, and both include a first fix. Trim that overlap so it is carried once (the skeptic on one claim did not say which of the two to trim; the other says trim SO1), or add an overlap note between the two.
- Adobe says: experienceleague.adobe.com .../sites-optimizer/content/documentation/settings : "you must have credentials with administrative access to Google Search Console for the domain"
- I recommend: Do it with the SO1 move. Keep both, trim scanner allow-listing and the first fix from SO1, add an overlap note. Hours are his call.
- **Your call:** On an AEM Sites canvas, SO1 and "Connect Sites Optimizer to AEM author" would both start selected at 16/24/40 hours. Keep both selected, or lower one's hours?
- From claims: m2-c01, c2-c07

**113. Three Adobe Express services all say they build templates** (Reword; small)

- Entries: `EP03`, `XJ10`, `XJ12`, `XJ11`
- Change: Reword only. XJ10: "Share your client's paid social and display Express templates to the organization, confirm their locks carry into GenStudio, and check each one generates with the right fields tagged." XJ12: end with "and bring the first files into Express, ready to become templates." Leave EP03 and XJ11 as they are. No removals.
- Adobe says: https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/templates/express-templates: "use the adobe express instructions to create a custom template with brand restrictions"
- I recommend: Make the two wording edits. Hours are Adam's call.
- **Your call:** If XJ10 stops building the ad templates and only shares and checks them, should its hours (16/32/56) come down, or stay as they are?
- From claims: c2-d27

**114. Two Brand Visibility publishing workflows can both be ticked** (Overlap note; small)

- Entries: `C05`, `C03`, `bv`, `bv-eds`
- Change: Do not move C05. Add to C05's assumptions that it covers a site authored outside AEM and Edge Delivery, and that for an AEM or Edge Delivery site the AEM optimization publishing workflow (C03) is used instead. Optionally add C05 and C03 to the existing overlap note so the SOW asks how they differ when both are on.
- Adobe says: experienceleague.adobe.com/en/docs/brand-visibility/using/essentials/best-practices: "Use the Adobe Brand Visibility's Opportunities dashboard to identify and make specifically recommended, immediate changes to your site." The page names no CMS, so it decides nothing.
- I recommend: Add the sentence to C05 and add the pair to the overlap review. Do not create a cms-bv connection.
- **Your call:** C05 (Existing CMS publishing workflow) and C03 (AEM optimization publishing workflow) can both be ticked on Create your own play. This pair was left open on Nov 2. Do you want one sentence on C05 saying it is for sites not on AEM or Edge Delivery, and should the two also show the "Overlaps with" note when both are on?
- From claims: m2-b04, c2-d02

**115. Workfront Planning records linked to AEM Assets is offered twice** (Remove; medium)

- Entries: `AXA03`, `XJ28`, `aemassets-workfront`, `planning-aemassets`
- Change: Retire AXA03. Keep XJ28 on Workfront Planning + AEM Assets as the single owner. Fold AXA03's two extras into XJ28: choosing the lookup fields to show, and agreeing how teams link assets to records. Saved statements of work keep AXA03 as the partner's own service.
- Adobe says: experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-records/connect-records: "you can connect individual records to Experience Manager objects", listing "image files folders content fragments"
- I recommend: Retire AXA03 and add the lookup fields and linking agreement to XJ28.
- **Your call:** Retire AXA03 so Planning record linking is offered only on Workfront Planning + AEM Assets (XJ28), or keep it on AEM Assets + Workfront for partners who never add the Planning box?
- From claims: c2-d09, g-d04

### Small edits, no decision needed beyond a yes (19)

| # | What | Entries | Change |
|---|---|---|---|
| 116 | AEM Forms on AEM Sites pages: place the forms, do not rebuild them | AFX01, AF03, aemforms-aemsites | Reword the end of AFX01 only: "...allow the Adaptive Forms Container in the page templates, and place the forms built under Adaptive form build with rules on pages and Experience Fragments (created in the page with the Container, or embedded), then check that they render and submit there." AF03 and all hours stay unchanged. |
| 117 | AEM Sites service not needed when every page is on Edge Delivery | SI02, aemsites-eds | Add an assumption to SI02 that it is not needed where every page is delivered on Edge Delivery. Text only, with no tool rule that switches SI02 off. Today only the aemsites-eds card text says to take it out. |
| 118 | Acrobat Sign templates and Acrobat-built forms may cover the same forms | SG03, XN16, acrobat-acrobatsign | Keep both. Add a scope sentence to XN16: it covers only existing PDF forms whose fields are built in Acrobat, and those forms are not counted in SG03's template set; who may use and edit each uploaded template stays with SG03. Optionally add to SG03 that templates built from Acrobat form fields are scoped under XN16. |
| 119 | Brand Visibility edge routing counted twice: Edge Delivery build and AEM Sites | AXC01, AXC03, A01, aemsites-bv | Add one sentence to AXC01 and AXC03 (or to the aemsites-bv card): "Where Implement AEM Sites on Edge Delivery is part of this engagement, it turns this route on and allows the user agent for the Edge Delivery site; keep this service only for a separate AEM-published site." Leave A01, C07 and L03 as they are. Do not move L03. Alternative: add the A01 and AXC01 pair to the tool's overlap review. |
| 120 | Commerce Data Connection install counted in both Real-Time CDP and Adobe Analytics | XL14, XA14, aa-commerce, commerce-rtcdp | On aa-commerce and in XL14's text, add a conditional note: where Commerce Data Connection to Platform (XA14) is in the statement of work, the Data Connection install and the base schema and datastream are priced once there; XL14 then covers the Analytics commerce field group, the Adobe Analytics service with the report suite ID on the datastream, and the event check. XL14 alone keeps the install. No change to hours, XA14 or XA20. |
| 121 | Creative Cloud services setup: Frame.io switch belongs to the Frame.io connection | CC04, XJ19 | CC04: add that the Frame.io service is turned on under Frame.io + Creative Cloud when that connection is in scope. XJ19 and all hours unchanged. |
| 122 | Creative Cloud training: leave connected-product panels to each connection's service | CC06, XJ19, XJ22, XJ23 | CC06: end at "shared libraries and cloud documents" and say panels for a connected product (Frame.io, Workfront, AEM Assets) are taught in that connection's service. FR07, XJ19, XJ22, XJ23 and all hours unchanged. |
| 123 | Edge Delivery renditions for AEM Assets: reuse the existing processing profile | AXD07, AS04 | AXD07: add "Where Processing profiles and renditions is also in scope, the Edge Delivery renditions are added to that profile." No service removed. Hours untouched. AS04 unchanged. |
| 124 | Experimentation Accelerator access: say which license each service is for | EX01, XH03, xa-target | Keep both. EX01: add "for people with an Adobe Experience Platform or Journey Optimizer license". XH03: add "for people with only a Target license; where every user is Target-only, this takes the place of Accelerator access, roles and sandboxes". Do not merge into one service. |
| 125 | Firefly Creative Production: API services name credentials again | FP01, FP05, FP06, XK08 | Wording only. FP05: replace "credentials and tokens" with "access tokens from the credentials set up in access and roles". FP06: replace "with credentials" with "using the Developer Console project's credentials". Leave FP01 and XK08 as they are. The FP06 and XK08 half is not a duplicate. |
| 126 | Firefly Custom Models monthly upkeep overlaps the one-time retrain | FM06, FM07 | Reword FM07 only: "...refresh training sets and prompt guides as campaigns and products change, retrain models on the refreshed sets where needed and remove models nobody uses. Moving models to a newer Firefly image model is the separate one-time service." Swap FM07's stored quote to the same page's "Review your training data and settings to make edits as needed." FM06 and all hours unchanged. |
| 127 | GenStudio email templates: say which templates each service adapts | GS03, XG05, XG06 | Keep the placeholder step and hours. XG05: "add the field placeholders GenStudio expects to the email templates already in the Journey Optimizer library". XG06: "...already in the Marketo Engage library". GS03: say its templates are the ones "uploaded to GenStudio Content". Optionally give XG05 the Journey Optimizer for GenStudio page as a second reference. |
| 128 | Marketo Optimizer people lists could be counted twice (MO04, XQ01) | MO04, XQ01, moptimizer-marketo | No removal, no hours change. Bound MO04: "Build the dynamic and static people lists your client needs new in Marketo Optimizer, with filters on activity, company and person attributes..." and add that lists adapted from Marketo Engage smart lists are counted in the Marketo Engage connection's service. Optionally end XQ01 with "Each adapted list is counted here only." |
| 129 | Marketo program templates and My Tokens in two services (MK03, XB03) | MK03, XB03, marketo-workfront | Reword XB03 only; hours and optional status unchanged: "Adapt the Marketo program templates the automation clones (from the Marketo Engage build or your client's existing ones): add the My Tokens the request fills, standardize naming, and agree the review steps and approvers." No change to MK03. |
| 130 | Search Console service picks prompts that the prompt strategy already picks | SD1, L01, search-bv | Keep SD1 and its hours. Reword only its last clause: "then review the prompts Search Console suggests and add the agreed ones to the prompt portfolio from Prompt strategy and measurement plan, within the agreed prompt count." This also fixes "suggested queries" (Adobe says prompt suggestions). No change to L01 or L02. Do not add "query export/filtering". |
| 131 | Target + CJA audiences: reword so destination setup is not repeated | TC04, XA05, target-cja, rtcdp-target | Reword TC04 to activating the agreed CJA audiences to the Adobe Target destination and checking them in Target, with destination setup under XA05 when Real-Time CDP is on the canvas. XA05 unchanged. C06 stays selected. |
| 132 | Target Recommendations feed counted once with Adobe Analytics connection | XL03, TG04 | Add one sentence to XL03 only, with no change to hours or to TG04: "Where the Analytics classifications feed is also your client's catalog feed in Recommendations catalog and setup, that feed is set up once." |
| 133 | Two AEM Assets migration services need a line between them | AS03, XC15, aemassets, commerce-aemassets | Keep both services and their hours. AS03: "Commerce product and category media are migrated under Migrate Commerce media to AEM Assets when that connection is in scope." XC15: "Covers Commerce catalog media only; the rest of the asset library is under Asset and metadata migration. Where Asset and metadata migration is also in scope, the Commerce product media is imported once; this service covers its SKU, role and position mapping and approval." |
| 134 | Workfront Planning workspace design should exclude the GenStudio workspace | WP02, XJ30, XJ31 | In WP02 only: say it covers the client's own Planning workspaces, not the GenStudio workspace (that is XJ30 and XJ31 on the GenStudio connection), and replace the examples "campaigns, products, regions and personas" with ones that are not GenStudio record types. No change to WP01, XJ30, XJ31 or any hours. |

## Part 4. Gaps: connections and services we do not have

### New connections (20), each needs a yes and hours

**135. AEM Assets to Cloud storage line for bulk import** (New connection; medium)

- Entries: `aemassets-cstore`, `AS03`, `aemassets`, `cstore`
- Change: Optional. Add an outside connection aemassets-cstore: bulk import from Azure, AWS or Google Cloud. Prerequisites: source credentials and source folder name. It carries AS03 or points to it. No new service, no new hours, never a second migration service. Otherwise change nothing.
- Adobe says: https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/assets-view/bulk-import-assets-view : "Supported data sources for bulk import"; lists Azure, AWS, Google Cloud, Dropbox, OneDrive. No beta or limited wording.
- I recommend: Low priority. The work is already sold as AS03. Add the line only if you want it on the canvas, pointing to AS03.
- **Your call:** AS03 already sells the asset migration under AEM Assets. Do you also want a line on the canvas from AEM Assets to the Cloud storage box (no new service, no new hours), or leave it as it is? If yes, should the Cloud storage box also stand for Dropbox and OneDrive?
- From claims: c2-b05

**136. AEM Forms to CRM line for Salesforce form submissions** (New connection; large)

- Entries: `aemforms-crm`, `AF04`, `AF05`, `aemforms`, `crm`
- Change: Add connection aemforms-crm, type outside: Adaptive Forms send submitted data to Salesforce through a Form Data Model. One small service for the Salesforce part only: connected app with OAuth 2.0 client credential flow and API-only user, Swagger file, RESTful data source, binding the submit action. Prerequisite: Salesforce connected app and API-only user. Name Salesforce only, not Dynamics. Do not repeat AF04 or AF05 hours.
- Adobe says: https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/use-form-data-model/aem-forms-salesforce-integration : "When users submit forms, the data is synchronized with Salesforce automatically." No beta or early-access wording.
- I recommend: Add the line with one small Salesforce-only service and an overlap note beside AF04 and AF05. Hours are yours to set.
- **Your call:** The Salesforce work is already possible under AF04 (Form Data Model) and AF05 (submit actions). Do you want a separate AEM Forms to CRM line on the canvas with one small Salesforce service, or leave it inside AF04?
- From claims: c2-b04

**137. Acrobat Sign to CRM line for the Salesforce package** (New connection; medium)

- Entries: `acrobatsign-crm`, `SG10`, `MZ02`, `acrobatsign`, `crm`
- Change: Add connection acrobatsign-crm, type outside, citing the installation guide. Move SG10 under it with hours and wording unchanged. Prerequisites: a Salesforce org on a supported edition (Professional, Enterprise, Unlimited, Developer, Performance) and the Acrobat Sign account provisioned in the Salesforce channel. Do not add the reviewer's acceptance-testing scope.
- Adobe says: https://helpx.adobe.com/sign/web/integrations/acrobat-sign-for-salesforce/salesforce-installation-guide.html : "You can get the app from the AppExchange"; "Adobe Acrobat Sign account is properly provisioned in the Salesforce channel". No beta wording.
- I recommend: Decide once for both SG10 and MZ02, since the checker found this is a pattern. Either way, no new service or hours.
- **Your call:** Moving SG10 under a new Acrobat Sign to CRM line means partners see it only when the CRM box is on the canvas. Do you want that, or should SG10 stay on the Acrobat Sign card like the Marketo Measure CRM package (MZ02) does today?
- From claims: c2-b19

**138. Add Cloud storage + Journey Optimizer connection for orchestrated campaigns** (New connection; large)

- Entries: `cstore-ajo`, `ajo`, `cstore`, `dwh-ajo`, `DW2`
- Change: Add connection cstore-ajo (type outside) with one service: file feeds from Amazon S3, Google Cloud Storage or SFTP into a change-data-capture relational dataset (primary key, version descriptor), a _change_request_type column (u or d) in every row, mapping, schedule, first-load check. Prerequisites: Journey Optimizer Campaigns or Campaigns & Journeys package; one dataflow per dataset. Drop "reconciliation". Say it covers only what DW2 does not when both are in the SOW.
- Adobe says: experienceleague.adobe.com/en/docs/journey-optimizer/using/campaigns/orchestrated-campaigns/data-configuration/schemas-datasets/ingest-data: "Cloud Storage (Amazon S3, Google Cloud Storage, SFTP)" under "Supported sources for orchestrated campaigns". No beta or limited wording.
- I recommend: Add it with one service and a line saying it covers only what DW2 does not. Adam sets the hours.
- **Your call:** Do you want orchestrated campaigns shown from the Cloud storage box as well as the Data warehouse box, or is the warehouse route (DW2) enough? If yes, what hours should the service carry (DW2 is 32/56/96)?
- From claims: g-b05

**139. Add Real-Time CDP + CRM connection (audiences to Salesforce)** (New connection; large)

- Entries: `rtcdp-crm`, `rtcdp`, `crm`, `RT02`, `RT04`, `OX5`
- Change: Add connection rtcdp-crm, type outside. One new service: audiences to Salesforce Leads or Contacts (connected app, a custom field per audience as Mapping ID, SalesforceId, attribute mapping, status check); Dynamics 365 updates Contacts only. Prerequisites: Segmentation Service people audiences, 25 audience fields per object, IP allowlisting, soft deletes only on the source. For the way in, point the card to RT02, or add a source service that starts off. Drop "removal tests".
- Adobe says: experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/crm/salesforce: "you can select between either leads or contacts and update attributes and audience data into Salesforce CRM". No beta label on the source or destination route.
- I recommend: Add the line with the one destination service and point to RT02 for the way in. Adam sets the hours.
- **Your call:** RT02 already names CRM as a source. On a new CRM + Real-Time CDP line, do you want only the new Salesforce destination service (card pointing to RT02 for the way in), or also a separate CRM source service, as the data warehouse has with DW1? What hours?
- From claims: g-b01

**140. Add Real-Time CDP + Cloud storage connection (files in, files out)** (New connection; large)

- Entries: `cstore-rtcdp`, `rtcdp`, `cstore`, `RT02`, `RT04`, `RT06`, `dwh-rtcdp`, `cstore-cja`
- Change: Add connection cstore-rtcdp, type outside, worded for the whole Cloud storage box, not S3 alone. Two services at most: files in (access, IP allowlist, mapping, schedule, first load) and files out (keys or role, format, schedule, first delivery). Prerequisite: dataset export needs Real-Time CDP Prime or Ultimate. Leave alerts to RT06. Say it covers only what RT02 and RT04 do not. Do not rest it on Experience Platform on AWS.
- Adobe says: experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/cloud-storage/s3: "Experience Platform allows you to bring in data from S3 through batches". .../destinations/catalog/cloud-storage/amazon-s3: "export data files from Adobe CX Enterprise applications into your own buckets". No beta label.
- I recommend: Add the line, as Data warehouse has one, with wording that it covers only what RT02 and RT04 do not. Only the S3 pages were read.
- **Your call:** RT02 and RT04 already cover sources and destinations in general. Do you want a separate Cloud storage + Real-Time CDP line, as you have for Data warehouse, and should it be one service or two (files in, files out)? What hours?
- From claims: g-b02

**141. Add Target + Workfront connection through Workfront Fusion** (New connection; large)

- Entries: `target-workfront`, `target`, `workfront`, `workfront-ajo`, `XB15`
- Change: Add connection target-workfront, type extension, modelled on workfront-ajo: Fusion's Adobe Target modules create, read, update, delete and search activities, offers and audiences. Prerequisites: Workfront Fusion (extra purchase on Prime and Select), Standard Work license or higher, an active Adobe Target account, a Target server-to-server connection created by a Developer. One optional service: Fusion scenarios on Target records. Do not word it as Adobe's "approval-to-activity mapping".
- Adobe says: experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-target-modules: "you can automate workflows that use Adobe Target"; "This action module creates an AB or XT activity, an offer, or an audience". No beta or limited wording.
- I recommend: Add it, matching the Journey Optimizer Fusion card, with one optional service. Adam sets the hours.
- **Your call:** Do you want a Target + Workfront (Fusion) connection added? It is real and documented, but it is a generic Fusion connector like the Journey Optimizer one, with one optional service. Hours would be your estimate (workfront-ajo's XB15 is 24/48/80).
- From claims: g-b11

**142. Add a CRM to Journey Optimizer connection** (New connection; large)

- Entries: `ajo`, `crm`, `crm-ajo`, `RT02`, `OX5`
- Change: Add connection crm-ajo, type outside, modelled on crm-cja. One service: authenticate the Experience Platform CRM source (Salesforce or Microsoft Dynamics), select data and schedule, map fields to Journey Optimizer profiles, monitor the dataflows. Prerequisites: permission to manage sources, CRM credentials, agreed fields. Leave out consent mapping and identity alignment. Word any AWS note as OX5 does, without the limited-availability label. Overlaps RT02 when Real-Time CDP is also on the canvas.
- Adobe says: https://experienceleague.adobe.com/en/docs/journey-optimizer/using/connect-systems/get-started-sources : "sync contact information, preferences, and engagement history from platforms like salesforce or microsoft dynamics". No beta wording.
- I recommend: Add it, with an overlap note against RT02 so the statement of work asks how they differ.
- **Your call:** Do you want a CRM + Journey Optimizer line on the canvas, when the same CRM source work is already in Real-Time CDP's "Data sources and ingestion setup" (RT02)? It would serve clients who have Journey Optimizer without Real-Time CDP.
- From claims: g-b06

**143. Add a Marketo Engage to Ad platforms connection** (New connection; large)

- Entries: `marketo`, `ads`, `marketo-ads`
- Change: Add connection marketo-ads (Marketo Engage + Ad platforms, type outside; the Ad platforms box exists). Services only as Adobe lists: Facebook custom audiences from smart or static lists, Facebook Lead Ads with offline conversions, a Marketo list as a LinkedIn audience, Google as a LaunchPoint service, a first-run check. Read the LinkedIn and Google how-to pages first. Leave out the reviewer's "consent-aware" wording.
- Adobe says: https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/demand-generation/ad-network-integrations/understanding-ad-network-integrations : "These integrations currently work with Facebook, LinkedIn, and Google." No beta or limited wording.
- I recommend: Add it with Facebook and LinkedIn first. Hold the Google line until its how-to page is read.
- **Your call:** Do you want a Marketo Engage + Ad platforms connection added (hours would be your estimates)? Adobe's page still says "Google AdWords" and its how-to page could not be opened: include Google now, or only Facebook and LinkedIn until it is read?
- From claims: c2-b02

**144. Adobe Analytics to AEM Forms line for form analytics** (New connection; medium)

- Entries: `aa-aemforms`, `AF09`, `aa`, `aemforms`
- Change: Add connection aa-aemforms, type extension, citing the Experience League page. Prerequisites: an Adobe Analytics report suite, a Tags property with the Adobe Experience Manager Forms and Adobe Analytics extensions, and adaptive forms on Core or Foundation Components. Reference or move AF09 onto it. No new service, no second fee.
- Adobe says: https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/services/integrate-aem-forms-with-adobe-analytics : "When an event occurs on an adaptive form, AEM Forms send these data elements to Adobe Analytics." No beta or limited label.
- I recommend: Add the line and have it reference AF09, so AF09 still shows under AEM Forms and is counted once.
- **Your call:** Should AF09 move onto the new Adobe Analytics + AEM Forms line (it would then show only when both products are on the canvas), or stay under AEM Forms and just be referenced from the line?
- From claims: c2-b03

**145. Adobe Analytics to Cloud storage line for data feeds** (New connection; medium)

- Entries: `aa-cstore`, `AN07`, `aa`, `cstore`
- Change: Add an outside connection aa-cstore: Analytics data feeds deliver raw data to the Client's bucket on Amazon S3, Google Cloud Platform or Azure. Source it to the data feed overview page with the quote found. Point it at AN07 with no new service or hours. Prerequisites: the Client's bucket, and an Analytics product admin or a product profile with access to data feeds.
- Adobe says: https://experienceleague.adobe.com/en/docs/analytics/export/analytics-data-feed/data-feed-overview : "A bucket configured on Amazon S3, Google Cloud Platform, Azure RBAC, or Azure SAS." No beta or limited label; only FTP and SFTP are marked legacy.
- I recommend: Add the line pointing at AN07. It is the only outside-system link Adobe Analytics would have, and it adds no hours.
- **Your call:** AN07 already sells this work under Adobe Analytics. Do you want a line drawn on the canvas between Adobe Analytics and Cloud storage that points at AN07, or is the service on the product enough?
- From claims: c2-b18

**146. Adobe Analytics to Marketing Campaign Analytics line, no new service** (New connection; medium)

- Entries: `aa-mmm`, `XD09`, `XL04`, `MM02`, `MM03`, `mmm-cja`
- Change: Do not add a new service: it would repeat XD09, XL04, MM02 and MM03. At most, add a platform connection aa-mmm with no new hours that points to those existing services, so a client with Adobe Analytics and Marketing Campaign Analytics but no CJA sees the path. Otherwise none.
- Adobe says: https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/ingest-data/overview : "Data collected using the Adobe Analytics source connector." No beta wording.
- I recommend: Optional. The work is already in the catalog. Add the pointer line only if you want that path visible without CJA.
- **Your call:** Do you want a line drawn between Adobe Analytics and Marketing Campaign Analytics that adds no new service and only points to the work already listed (XD09, XL04, MM02, MM03), or leave it as is?
- From claims: c2-b10

**147. Adobe Commerce to CRM line for partner-built integrations** (New connection; large)

- Entries: `commerce-crm`, `commerce`, `crm`, `XC16`
- Change: Add connection commerce-crm, type outside, worded as a partner-built integration on Adobe's Commerce integration starter kit (App Builder), never as a native CRM connector. Prerequisites: App Builder access and Commerce eventing. One optional service: map customer and order entities, implement events and APIs, retries and reconciliation. Note that Adobe supports the kit's basic functionality only, not custom code.
- Adobe says: https://developer.adobe.com/commerce/extensibility/starter-kit/integration/create-integration : "The starter kit is a scaffolding designed to make custom integrations easier." Also: "Adobe does not provide support services for modified code or your custom integrations."
- I recommend: Add it only if you are happy selling custom integration work. Word it as partner-built. Hours are yours to set.
- **Your call:** Adobe's page offers a starter kit for custom work, not a ready-made CRM connector, and it leads with ERP. Do you want a Commerce to CRM line on the canvas for partner-built integrations like this?
- From claims: c2-b01

**148. Adobe Express to Ad platforms line for ad add-ons** (New connection; large)

- Entries: `express-ads`, `express`, `ads`, `EP06`
- Change: Add connection express-ads, type outside: Express designs go to Google Ads, the Amazon Ads creative assets library and LinkedIn Campaign Manager through Express add-ons. One optional, small service: install and sign in to the chosen add-ons, pick ad accounts or profiles, prepare ad sizes, test the handoff. Prerequisites: the client's ad accounts; Google add-on is static content only; Amazon guest mode only checks designs.
- Adobe says: helpx.adobe.com/express/web/add-ons-and-integrations/create-publish-google-ads.html : "create and publish Google Ads directly from one platform" and "only static content is supported at this time". No beta or coming soon wording on the three add-on pages.
- I recommend: Your call. It is real but thin. If added, keep it to one small optional service with hours you set.
- **Your call:** The Express ad add-ons (Google Ads, Amazon Ads, LinkedIn) are real and unlabeled, but the partner work is light: installing an add-on and signing in. Do you want this as a connection with one small optional service, or left out as too thin to sell?
- From claims: c2-b11

**149. Content Analytics to Ad platforms line holding paid media setup** (New connection; medium)

- Entries: `CA04`, `AD1`, `ads-cja`, `ca`, `ads`
- Change: Optional. Add a platform-type connection between Ad platforms and Content Analytics and move CA04 under it unchanged (Google Ads and Meta Ads only). If built, word it so source onboarding is not counted twice beside AD1 on ads-cja. No new services and no new outside system box. Otherwise none.
- Adobe says: https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/paid-media : "for example, for Google Ads or Meta Ads". No label on Google or Meta.
- I recommend: Optional. CA04 already sells the work. If you add the line, include an overlap note beside AD1.
- **Your call:** Do you want a line on the canvas between Ad platforms and Content Analytics that holds the existing Paid media channel setup service (CA04), or leave that service under Content Analytics as it is today?
- From claims: c2-b09

**150. Draw Marketo Measure to Ad platforms line, splitting existing service** (New connection; medium)

- Entries: `mmeasure`, `ads`, `mmeasure-ads`, `MZ04`
- Change: Add outside-type connection mmeasure-ads (Marketo Measure + Ad platforms), sourced to the Integrated Ad Platforms and Spend management methods pages. Move MZ04's ad account connection and auto-tagging there. Keep CRM campaign cost sync and manual spend upload on the product. Split MZ04's existing hours, add none. Note Adobe's limit of 300 ad connections and that Facebook auto-tagging erases ad performance history.
- Adobe says: https://experienceleague.adobe.com/en/docs/marketo-measure/using/api-connections/utilizing-marketo-measures-api-connections/integrated-ad-platforms : "Marketo Measure has API connections with Google AdWords, Microsoft BingAds, Facebook Ads and Doubleclick Campaign Manager". No beta or limited label.
- I recommend: Add the line and split MZ04's hours. Decide it together with the CRM and BI lines.
- **Your call:** Do you want a line from Marketo Measure to the Ad platforms box, with MZ04 split between the line and the product (same total hours)? Should the card use Adobe's old names (Google AdWords, BingAds, Doubleclick Campaign Manager) or today's names?
- From claims: c2-b16

**151. Draw Marketo Measure to CRM line, reusing existing service** (New connection; medium)

- Entries: `mmeasure`, `crm`, `crm-mmeasure`, `MZ02`
- Change: Add connection crm-mmeasure, type outside: Salesforce or Microsoft Dynamics connects to Marketo Measure by the installed package or managed solution, or the packageless route with a dedicated connected user. Availability note: not Marketo Measure Ultimate, which has no direct CRM connection (use mmeasure-rtcdp). Reuse MZ02 as its single service. No new service or hours. Source: the packageless integration page.
- Adobe says: experienceleague.adobe.com/en/docs/marketo-measure/using/configuration-and-setup/getting-started-with-marketo-measure/marketo-measure-crm-packageless-integration : "you are required to install a Salesforce Package or a Microsoft Dynamics Managed Solution." Ultimate overview: "Ultimate does not have a direct CRM connection."
- I recommend: Add the line. It reuses MZ02, so nothing is counted twice.
- **Your call:** Marketo Measure's CRM work is already sold as MZ02 but no line goes to the CRM box. Do you want that line added, reusing MZ02 with no new hours?
- From claims: c2-b15

**152. GenStudio for Performance Marketing to Ad platforms line** (New connection; medium)

- Entries: `ads-gspm`, `GS04`, `gspm`, `ads`
- Change: Add an outside connection ads-gspm (GenStudio for Performance Marketing + Ad platforms), sourced to the Activate overview page, and move GS04 onto it unchanged (same hours and quote) so it counts once. No new service.
- Adobe says: https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/activation/overview : "A GenStudio system manager or editor must connect the ad account for each paid ad channel before you can activate an ad experience to that channel." No beta wording.
- I recommend: Add the line and move GS04 onto it, matching how Marketo Optimizer + Ad platforms works. Note GS04 starts selected today.
- **Your call:** GenStudio's paid media setup (GS04) sits on the GenStudio box today. Do you want a line between GenStudio and Ad platforms that carries it instead, as Marketo Optimizer + Ad platforms does, or leave it where it is?
- From claims: c2-b08

**153. Journey Optimizer B2B Edition to CRM line for In-CRM Insights** (New connection; large)

- Entries: `ajob2b-crm`, `ajob2b`, `crm`, `XP05`
- Change: Add connection ajob2b-crm, type outside: read-only buying-group views inside Salesforce or Microsoft Dynamics 365, not a data sync. One optional one-time service: set the Sales Insights: View Sales Insights permission, role and user group with an Experience Platform product profile; install the In-CRM Insights package or Dynamics solution; test sign-in and buying-group views; brief sales users.
- Adobe says: https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/accounts/buying-groups/incrm-insights : "integrates into Salesforce and Microsoft Dynamics 365"; "data is read-only through In-CRM Insights". No beta or limited wording on the page; release notes could not be opened.
- I recommend: Add it. Nothing in the catalog covers it and the install and permissions are real partner work. Say read-only in the wording.
- **Your call:** Do you want Journey Optimizer B2B Edition to show a CRM connection for this small read-only add-in (one optional service, hours yours to set)?
- From claims: c2-b06

**154. Optional Marketo Measure to BI tools line** (New connection; medium)

- Entries: `mmeasure`, `mmeasure-bi`, `MZ07`
- Change: No new service or hours: MZ07 already covers the reader account and Adobe's Power BI or Tableau template. Optional: add connection mmeasure-bi (type outside) showing MZ07 once, with the Snowflake reader account server, warehouse, username and password as the prerequisite, citing the Power BI template and reader account pages. Do it only if Marketo Measure's outside-system work is to be drawn as lines.
- Adobe says: https://experienceleague.adobe.com/en/docs/marketo-measure/using/bi-report-templates/marketo-measure-report-template-power-bi : "You still need to set up a data connection to your Snowflake instance." No beta label.
- I recommend: Give one answer for all three Marketo Measure lines (CRM, ad platforms, BI). If yes to those, add this too.
- **Your call:** Marketo Measure's BI work (MZ07) is already a service on the product. Do you want a line drawn to the BI tools box for it, the same way as for CRM (MZ02) and ad platforms (MZ04)?
- From claims: c2-b17

### New services (54), each needs a yes and hours

**155. AEM Assets: add an asset expiry and license controls service** (New service; large)

- Entries: `aemassets`, `AS02`, `XG04`
- Change: Add an optional one-time AEM Assets service, "Asset expiry and license controls": add expiry and license fields to metadata forms, configure the expiry notification job (timing, lead time, emails) through Cloud Manager, point protected assets to license agreement pages, and test that expired assets unpublish from Publish and Dynamic Media. Do not say "all distribution routes". Hours are the owner's.
- Adobe says: https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/drm: "The expiry information ensures that the published asset is automatically unpublished when it expires."
- I recommend: Add as its own optional service. XG04 only checks expiry dates for GenStudio.
- **Your call:** Do you want this as a new optional AEM Assets service (your hours), or folded into AS02 as one more clause?
- From claims: c2-c15

**156. AEM Sites: add a multilingual and Multi Site Manager setup service** (New service; large)

- Entries: `aemsites`, `AXD03`, `AXC08`
- Change: Add one optional one-time service under AEM Sites, "Multilingual sites: translation and Multi Site Manager setup": language masters and language copies, translation provider connection and translation integration framework configurations, translation projects, blueprint and rollout configurations, Live Copies. Prerequisite: the client's translation provider, with a connector or XML export. Keep AXD03 as the Edge Delivery add-on. Leave out AI translation. Hours for the owner.
- Adobe says: experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/administering/reusing-content/msm-and-translation: "Translation lets you automate the translation of page content to create and maintain multilingual websites".
- I recommend: Add it. SI01 to SI06 do not cover translation or Live Copies.
- **Your call:** Do you want a multilingual and Multi Site Manager setup service on the AEM Sites card (optional, your hours)? A translation provider would be named only as a prerequisite, not as a new outside system box.
- From claims: c2-c13

**157. AEM Sites: add a site accessibility review service** (New service; large)

- Entries: `aemsites`, `SI04`, `AF18`, `AXC07`
- Change: Add an optional one-time AEM Sites service, "Site accessibility review", modelled on AF18: agree the WCAG 2.1 level the client's site should conform to (Adobe names Level A and AA), review templates, components and authored content against it, correct what templates and components control, and give authors guidance. Leave out keyboard and assistive-technology wording unless another Adobe page is cited.
- Adobe says: https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/compliance/accessibility/web-accessibility: "When creating your site, you should determine the overall level to which you would like your site to conform."
- I recommend: Add it, mirroring AF18. AXC07 covers accessibility only with Sites Optimizer.
- **Your call:** Do you want an optional accessibility review service on AEM Sites, like the one you approved for AEM Forms (AF18)? The hours would be your estimate; AF18 uses 16/32/64.
- From claims: c2-c14

**158. Acrobat Sign: add a migrate templates from Docusign service** (New service; large)

- Entries: `acrobatsign`, `SG03`, `SG04`
- Change: Add an optional one-time Acrobat Sign service, "Migrate templates from Docusign": inventory templates, run Admin > Migrate Templates from Docusign, recreate workflows whose recipient roles fail, check field placement on partial migrations, test. Prerequisites: an enterprise-tier Acrobat Sign Solutions account (not Acrobat Sign for Government) with custom workflow creation enabled. No outside system box. Hours for the owner.
- Adobe says: https://helpx.adobe.com/sign/web/admin/assets/migrate-external-templates.html: "Acrobat Sign supports direct import of Docusign templates." Also "Acrobat Sign Solutions: Supported, Acrobat Sign for Government: Not supported".
- I recommend: Add it. SG03 and SG04 build from scratch and no service covers import.
- **Your call:** Are you fine naming Docusign, a competitor, in a service title? It would be named only as the source of the import. Hours are yours to set.
- From claims: c2-c25

**159. Add a Customer Journey Analytics service for AI assistants (ChatGPT, Claude)** (New service; large)

- Entries: `cja`, `FP07`, `BN05`, `cw-cja`
- Change: Add one small optional one-time service under cja, modelled on FP07 and BN05: grant MCP read-only or MCP full access in an Admin Console product profile, add the CJA plugin or connector in the client's approved AI assistant (ChatGPT or Claude), choose the IMS org, set tool permissions, test answers against Analysis Workspace, write usage rules. Prerequisites: the client approves the AI assistant; ChatGPT Plus or Pro; product administrators always get full MCP access. Leave out "approved-query validation".
- Adobe says: developer.adobe.com/analytics-mcp/docs/guides/chatgpt: "Adobe publishes Customer Journey Analytics as a plugin in ChatGPT". .../guides/claude: "adobe publishes customer journey analytics as a connector in the claude connector directory". No beta label; only Gemini is "coming soon".
- I recommend: Add one optional service under CJA covering both assistants. No new outside box. Leave Gemini out.
- **Your call:** Do you want the CJA plugin for ChatGPT and Claude in the catalog? If yes, as one small optional service under Customer Journey Analytics (like FP07 for Firefly), or as a connection to a new outside box "AI assistants"? What hours?
- From claims: g-b14, g-b15

**160. Add a monthly Brand Concierge tuning and quality service for any industry** (New service; large)

- Entries: `bc`, `FSI01`, `F02`
- Change: Add one optional monthly, industry-neutral Brand Concierge service: dashboard review at least weekly, failed-query and content-gap fixes, knowledge-source health and refreshes, feedback and tone tuning, transcript review feeding and re-scoring the golden evaluation set, findings to the Client. Cite the go-live guide and the FAQ quote. Keep FSI01 optional. Leave out the "product-card CSV", handoff metrics and transcript export. Hours are the owner's.
- Adobe says: experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/go-live-guide/your-pre-go-live-checklist-and-rollout-plan: "Continue monitoring through your analytics dashboard at least weekly after full rollout." FAQ: "Content can be refreshed on a regular schedule, or manually at any time".
- I recommend: Add it. FSI01 is the only monthly Brand Concierge service today and Adobe's page is not industry-specific.
- **Your call:** Do you want a new optional monthly Brand Concierge tuning and quality service for any industry, beside the FSI review (FSI01), and what hours should it carry?
- From claims: m2-c04, c2-c08

**161. Add a monthly Edge Delivery Services code and performance upkeep service** (New service; large)

- Entries: `eds`, `SO2`, `SI06`, `A03`
- Change: Add one optional monthly service under Edge Delivery Services: each month, ship block and template changes through pull requests that pass the PageSpeed check, review Core Web Vitals, 404s and JavaScript errors in Operational Telemetry, and update redirects. Cite aem.live/developer/keeping-it-100 and aem.live/docs/operational-telemetry, not the go-live checklist. No "CDN maintenance" wording. Core Web Vitals fixes stay with SO2 where Sites Optimizer is licensed. Hours are the owner's.
- Adobe says: https://www.aem.live/developer/keeping-it-100: "it is not hard to keep it at 100 if you continuously test". https://www.aem.live/docs/operational-telemetry: "Operational telemetry data can be used to diagnose performance issues."
- I recommend: Add it as optional, with an overlap review against SO2 when both are on the canvas. Keep Core Web Vitals fixes with SO2.
- **Your call:** Edge Delivery Services has no monthly service today. Do you want one for partners who sell it without Sites Optimizer (it would overlap the monthly Sites Optimizer fixes, SO2, where both are in scope), and at what hours?
- From claims: m2-c03, m-c02

**162. Adobe Analytics: add a mobile app data collection service** (New service; large)

- Entries: `aa`, `AN03`, `AN06`
- Change: Add an optional one-time service under Adobe Analytics, "Mobile app data collection": set up the datastream with the Analytics service, the mobile tag property and the Edge Network extension, register the extensions in the iOS and Android apps with the client's developers, map app events to Analytics variables, and validate before release. Hours are the owner's.
- Adobe says: https://experienceleague.adobe.com/en/docs/analytics/implementation/aep-edge/mobile-sdk/overview: "It is available for Android™, iOS, and various cross-platform development frameworks."
- I recommend: Add it. AN03 and AN06 are web only.
- **Your call:** Do you want a mobile app data collection service under Adobe Analytics, as an optional line, and what hours should it carry?
- From claims: c2-c22

**163. Adobe Commerce has no services of its own** (New service; large)

- Entries: `commerce`
- Change: Add own services under product commerce: "Store hierarchy, websites and basic configuration" and "Catalog, categories, attributes and pricing setup". Each must rest on a quote from the detailed commerce-admin page for that task, not the guide summary. Leave catalog enrichment out (PaaS only; C02 covers enrichment). Name Adobe Commerce B2B as the prerequisite for shared catalogs. Hours are the owner's. Payments, shipping, tax and back-office integration need their own research first.
- Adobe says: experienceleague.adobe.com/en/docs/commerce-admin/start/guide-overview: "Learn the concepts of store hierarchy and configuration scope and walk through the basic configuration settings." Catalog menu page: "product creation, category, and inventory management tools".
- I recommend: Ask first. If yes, research the two services properly and have the owner set hours. It is a gap, not an error.
- **Your call:** Adobe Commerce is the only product with no services of its own. Do you want core Commerce set-up services (store set-up, catalog set-up) added for Create your own play, or was it left empty on purpose because the Commerce play is for existing customers?
- From claims: m-a01

**164. Adobe Commerce: Live Search setup, B2B setup and monthly operations services** (New service; large)

- Entries: `commerce`, `XA13`
- Change: If the owner agrees, add under Adobe Commerce, each on its own verified Adobe page: Live Search install and configuration, B2B setup (company accounts, shared catalogs, negotiable quotes; optional), and a monthly operations line. Hold checkout and payments and ERP integration until each is sourced. XA13 only confirms Live Search facets and assumes Live Search already runs.
- Adobe says: experienceleague.adobe.com/en/docs/commerce/live-search/install: "Install the live search extension configure the api keys sync your catalog data". commerce-admin/b2b/introduction: "company accounts", "shared catalogs", "negotiable quotes".
- I recommend: Only after a yes on Commerce core services. The monthly operations line still needs its own Adobe source.
- **Your call:** If Commerce gets its own services, do you also want Live Search setup, B2B setup and a monthly operations line, with your hours?
- From claims: m2-c02

**165. Adobe Commerce: add a B2B buyer and purchasing setup service** (New service; large)

- Entries: `commerce`
- Change: Add one optional one-time service under Adobe Commerce, "B2B buyer and purchasing setup": enable B2B features, set up company accounts with roles and permissions, shared catalogs with company pricing, negotiable quotes, purchase orders with order approval, and payment on account. Prerequisite: the Adobe Commerce B2B extension installed. Leave out the reviewer's beta wording. The approval-rules page itself was not read.
- Adobe says: https://experienceleague.adobe.com/en/docs/commerce-admin/b2b/enable-basic-features : "By default, all B2B features are initially disabled." Also "available only on commerce projects that have the adobe commerce b2b extension installed"
- I recommend: Add it. Both checkers confirmed the gap, and it is the best sourced of the four Commerce proposals.
- **Your call:** Adobe Commerce has no services of its own today, only services on its connections to other products. Do you want a B2B setup service on the Commerce box itself, which would be the first one?
- From claims: c2-c05

**166. Adobe Commerce: add a catalog import service** (New service; large)

- Entries: `commerce`, `XC15`
- Change: If the owner agrees, add one optional one-time service on Adobe Commerce, "Catalog import": choose the import method (Admin CSV, Bulk, Async or CSV REST API) by catalog size and update frequency, prepare and load the agreed catalog, check the results. Media stays with XC15. Leave out product types, attributes, categories, price rules and cutover unless another Adobe page is sourced.
- Adobe says: experienceleague.adobe.com/en/docs/commerce-learn/tutorials/cloud-infrastructure-and-self-hosted/catalog-and-products/catalog-import: "There are a few native methods for importing a catalog into Adobe Commerce."
- I recommend: Add only in the narrow form, and only if Commerce gets its own services.
- **Your call:** Do you want a "Catalog import" service on Adobe Commerce itself, or should Commerce stay connections only?
- From claims: c2-c02, m2-c02

**167. Adobe Commerce: add a checkout, payment, tax and delivery settings service** (New service; large)

- Entries: `commerce`, `XA19`
- Change: Only with the owner's yes. Add one optional one-time service under Adobe Commerce, "Checkout, payment, tax and delivery settings": set the Sales settings in the Commerce Admin (tax, checkout, shipping settings, delivery methods, payment methods) to the client's approved rules and place test orders. Leave out refund and fulfillment wording. Smaller alternative: name payment, shipping and tax checks in XA19's description.
- Adobe says: https://experienceleague.adobe.com/en/docs/commerce-admin/config/guide-overview : "The Sales configuration settings determine checkout and tax settings, payment and shipping options"
- I recommend: Decide once for all four Commerce proposals. If Commerce stays as is, take the smaller XA19 wording edit only.
- **Your call:** Adobe Commerce has only integration services today, none for setting up the store itself. Do you want one optional service for checkout, payment, tax and delivery settings, or should Commerce stay a product the client already runs?
- From claims: c2-c03

**168. Adobe Commerce: add a first own service, store structure and Admin setup** (New service; large)

- Entries: `commerce`, `XC10`
- Change: If the owner agrees, add one optional one-time service under Adobe Commerce, "Store structure and Admin setup": websites, stores and store views with configuration scope, currency display per store view, and Admin user roles. Leave out the SaaS/PaaS/Optimizer choice and "merchant operating model". Note the page describes Commerce installations with the Admin, not Commerce Optimizer. Do not use the reviewer's quotes.
- Adobe says: experienceleague.adobe.com/en/docs/commerce-admin/start/setup/websites-stores-views: "a single installation can have multiple websites, and each website can have multiple stores and store views".
- I recommend: Decide first whether Commerce stays connections only. If not, this is the best sourced first service.
- **Your call:** Adobe Commerce has no services of its own, only services on its connections. Was that on purpose (the plays sell to existing Commerce customers), or do you want an optional "Store structure and Admin setup" service?
- From claims: m2-c02, c2-c01

**169. Adobe Commerce: add a monthly maintenance and upgrades service** (New service; large)

- Entries: `commerce`, `SI06`
- Change: If the owner agrees, add one monthly service under Adobe Commerce, modelled on SI06: apply patches with the Quality Patches Tool, plan and test upgrades, check indexing and site performance, fix issues after go-live. Prerequisite: the client's Commerce deployment leaves this work with them. Leave out SaaS/PaaS ownership, orders and integrations wording.
- Adobe says: https://experienceleague.adobe.com/en/docs/commerce-operations/implementation-playbook/best-practices/maintenance/overview : "The maintenance phase includes the following activities: Bug fixing, Catalog management, Configuration, Feature enhancements, Indexing, Managed services, Site monitoring, Upgrades"
- I recommend: Follow the single Commerce decision. If yes, add it with the prerequisite as worded.
- **Your call:** Adobe Commerce has no services of its own today, only services under its connections. Do you want a monthly Commerce maintenance service (patches, upgrades, indexing, monitoring) as its first, like the monthly one AEM Sites has?
- From claims: c2-c06

**170. Adobe Commerce: add an inventory sources and stocks setup service** (New service; large)

- Entries: `commerce`
- Change: Only with the owner's yes. Add one optional one-time service under Adobe Commerce, "Inventory sources and stocks setup": configure sources, stocks, website assignment and salable quantity, and set shipment-matching rules to the client's fulfillment rules. Cite the inventory introduction page. Leave out backorders unless a second Adobe page is read and cited.
- Adobe says: https://experienceleague.adobe.com/en/docs/commerce-admin/inventory/introduction : "Stocks for tracking aggregated salable quantities across assigned sources"
- I recommend: Follow the single Commerce decision. Add it only if he wants core Commerce setup work in the catalog.
- **Your call:** Adobe Commerce has no services of its own today, only services on its connections to other products. Do you want to start offering core Commerce store setup work, beginning with an optional inventory sources and stocks setup service?
- From claims: c2-c04

**171. Brand Concierge has no monthly review service outside financial services** (New service; large)

- Entries: `FSI01`, `CW-FSI`, `bc`, `cw-bc`
- Change: No change for double billing: FSI01 is a monthly manual review and CW-FSI a one-time Skill build. If the owner agrees, add one optional monthly service on bc, industry-neutral: sampled conversation review against Client-approved sources, source-refresh requests, one report, citing the go-live page. Keep FSI01 as the financial-services version, with a note to select only one of the two.
- Adobe says: experienceleague.adobe.com/en/docs/brand-concierge/content/go-live-guide/your-pre-go-live-checklist-and-rollout-plan: "Continue monitoring through your analytics dashboard at least weekly after full rollout." It names no industry and supports weekly dashboard monitoring only.
- I recommend: Add the general monthly service as optional, with your hours, and keep FSI01 for financial services.
- **Your call:** Brand Concierge's only monthly service is written for banks and insurers. Do you want a general monthly answer and source review for other Brand Concierge clients (retail, B2B), or should Brand Concierge stay a financial-services offer? If yes, the new service needs your hours.
- From claims: m2-b08

**172. Brand Visibility deployment pilot shows only on the Commerce connection** (New service; medium)

- Entries: `L03`, `bv-commerce`, `C02`, `C07`
- Change: Not a duplicate; a placement defect. Move L03 (same id, text, hours; one copy) from the bv-commerce connection to Brand Visibility's own services as an optional line. Keep C02 and C07 on bv-commerce and keep the Commerce play starting with L03 off. Recheck the C07 auto-select rule and saved drafts that hold L03.
- Adobe says: https://experienceleague.adobe.com/en/docs/brand-visibility/using/resources/impact-measurement-engine : "No. You can optimize any pages." The page has 0 mentions of "commerce".
- I recommend: Move it to Brand Visibility as an optional line on every play, so no starting total changes.
- **Your call:** If L03 moves to Brand Visibility itself, should it be optional on every play (the checker's suggestion, so no play's starting total changes), or start selected on the plays that set up an edge route, such as the AEM play?
- From claims: c2-d06

**173. CJA with BI tools: add an Excel reports (Report Builder) service** (New service; large)

- Entries: `cja-bi`, `BI1`, `BI2`, `cja`
- Change: Add one optional one-time service, "Excel reports in Report Builder": confirm the add-in is approved and installed for the named users, build the agreed workbooks on your client's CJA data views, and check the numbers against Analysis Workspace. Page: rb-overview. No Select tag: the catalog says Report Builder comes with every CJA package. Do not call it "implementation".
- Adobe says: https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-reportbuilder/rb-overview : "allows you to create, edit, and refresh custom reports easily within Microsoft Excel using Adobe Customer Journey Analytics data"
- I recommend: Add it as optional. The card names Report Builder but sells no service for it. Placement is Adam's call.
- **Your call:** Do you want an optional Excel reports (Report Builder) service at all? If so, should it sit under the CJA + BI tools connection, where Report Builder is already mentioned, or under the CJA product itself, since the add-in needs no BI extension license?
- From claims: g-c27

**174. CRM with Adobe Target: add a Bulk Profile Update API service** (New service; large)

- Entries: `crm-target`, `CR1`
- Change: Add one optional one-time service under crm-target, not selected by default (an alternative to CR1): CRM profile data into Target by the Bulk Profile Update API. Export the agreed attributes as a batch file keyed on TNT ID or mbox3rdPartyId, choose v1 or v2, send by HTTP POST, check profiles in Target. Cite the bulk-profile-update-api page; quote "uses an HTTP POST API."
- Adobe says: https://experienceleague.adobe.com/en/docs/target-dev/developer/implementation/methods/bulk-profile-update-api : "uses an HTTP POST API." and "requires either the TNT ID or the mbox3rdPartyId"
- I recommend: Add the optional service, since the card already describes this route and lists a prerequisite for it.
- **Your call:** Do you want a second, optional service on CRM + Target for the Bulk Profile Update API route, or should the card keep one service and drop the API mention?
- From claims: g-c22

**175. Content Analytics: add a mobile app instrumentation service** (New service; large)

- Entries: `CA01`, `CA02`, `CA03`
- Change: Add one optional one-time Content Analytics service, "Mobile app instrumentation for Content Analytics": add the Content Analytics extension with MobileCore, Edge and EdgeIdentity to the iOS and Android apps, register experiences and track views and clicks on the agreed screens, validate events and exclusions, support the app release. Prerequisite: the Client's app team and release cycle. Alternative: CA02's wording says the app work is the Client's.
- Adobe says: https://developer.adobe.com/client-sdks/solution/adobe-content-analytics/ : "Add MobileCore, Edge, EdgeIdentity, and Content Analytics as dependencies to your project."
- I recommend: Add the optional service. CA02 names mobile channels but stops at publishing Tags, so the app-side work has no owner today.
- **Your call:** Do you want a separate optional mobile app service for Content Analytics, or should CA02's wording say the app work is the Client's?
- From claims: c2-c19

**176. Creative Cloud: add a single sign-on and directory setup service** (New service; large)

- Entries: `CC01`, `CC07`, `AB01`, `SG01`
- Change: Add one optional one-time service under Creative Cloud, "Single sign-on and directory setup": create the directory in the Admin Console, claim and verify the email domains, connect the client's identity provider over SAML 2.0, test sign-in and user sync. Prerequisite: the client's IT owns the identity provider and DNS. Keep AB01 and SG01 as they are, with a note not to bill single sign-on twice.
- Adobe says: https://helpx.adobe.com/business/enterprise/identity-sso/set-up-identity/set-up-identity-with-sso.html : "Each integration requires you first to create a directory in the Admin Console" and "claim and verify your email domains"
- I recommend: Add it as optional with the overlap note on AB01 and SG01, in line with the Nov 3 overlap rule.
- **Your call:** Do you want single sign-on and directory setup as its own optional service under Creative Cloud, or is it work the client's IT usually has in place already and best left as the clause in the Acrobat and Acrobat Sign services?
- From claims: c2-c20

**177. Customer Journey Analytics: add a consent reporting and filtering service** (New service; large)

- Entries: `cja`
- Change: Add one optional one-time service under cja, "Consent reporting and filtering": confirm the profile data holding consent policy membership, create the configuration on the agreed connection, agree reporting only or filtering per marketing action, check the consent components in the data views. Prerequisites: Healthcare Shield or Privacy & Security Shield; CJA system administrator; an existing connection. Say filtered data cannot be recovered. Drop the reviewer's "privacy validation" wording.
- Adobe says: https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-connections/consent-reporting-filtering/consent-overview : "Your organization has licensed Adobe Healthcare Shield or Privacy & Security Shield."
- I recommend: Add as optional with the Shield license named as a prerequisite, or skip if too niche for partners.
- **Your call:** Do you want this small, niche service added? It applies only to clients who license Healthcare Shield or Privacy & Security Shield.
- From claims: g-c25

**178. Customer Journey Analytics: add a monthly data quality review service** (New service; large)

- Entries: `cja`, `CJ06`
- Change: Add one optional monthly CJA service, "Monthly data quality review": review skipped and deleted records in the connection details, track No value in key dimensions with a QA project and alerts, audit data view settings, and fix or route issues to the data source owner. Rest it on the no-value page. No separate one-time acceptance-test service: one-time checks already sit inside AXA04, AXA05, OX5 and XL08.
- Adobe says: https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/complex-data/no-value : "Build a QA dashboard that monitors No value trends over time"
- I recommend: Add it as its own optional monthly line. CJ06 is analysis only. Skip the one-time acceptance-test service.
- **Your call:** Do you want a monthly CJA data quality service as its own optional line, or folded into CJ06 the way Adobe Analytics' AN08 combines analysis with a collection check? Hours would be your estimate.
- From claims: g-c26

**179. Customer Journey Analytics: add an access and sensitive-data controls service** (New service; large)

- Entries: `cja`
- Change: Add one optional one-time CJA service, "Access and sensitive-data controls": Admin Console product profiles per team with chosen data views and tools, restricted data views (segment for rows; include/exclude or value bucketing for values), project curation, and a check that Experience Platform labels surface in data views. Do not promise per-metric permissions. Leave out the "Labs access" permission.
- Adobe says: https://experienceleague.adobe.com/en/docs/analytics-platform/using/technotes/access-control : "more granular ways to limit access, such as workspace curation and row-level as well as value-level access control"
- I recommend: Add it as optional. No CJA service covers access or governance work today.
- **Your call:** Do you want a one-time CJA access and sensitive-data controls service added, with your own hours?
- From claims: g-c24

**180. Data warehouse with Real-Time CDP: add Federated Audience Composition as an option** (New service; large)

- Entries: `dwh-rtcdp`, `DW1`, `dwh-ajo`
- Change: Add an optional one-time service under dwh-rtcdp, "Federated audience composition": allow-list Adobe's IP addresses, create the federated database connection, model the agreed tables, build the first compositions and publish the audiences to Experience Platform. Prerequisites: Real-Time CDP and/or Journey Optimizer Prime or Ultimate, the Federated Audience Composition add-on, the Manage Federated Data permission. Not selected by default.
- Adobe says: https://experienceleague.adobe.com/en/docs/federated-audience-composition/using/start/access-prerequisites : "requires Adobe Real-Time Customer Data Platform and/or Adobe Journey Optimizer Prime or Ultimate packages... must have purchased the Federated Audience Composition add-on"
- I recommend: Add it on Data warehouse + Real-Time CDP, optional, with the add-on named as a prerequisite. Journey Optimizer placement is Adam's call.
- **Your call:** Do you want Federated Audience Composition offered as an optional second service on the Data warehouse + Real-Time CDP card (it needs a paid Adobe add-on)? Should it also appear on Data warehouse + Journey Optimizer, since Adobe says it works with either product?
- From claims: g-c05

**181. Journey Optimizer B2B Edition: add a buying group stages model service** (New service; large)

- Entries: `ajob2b`, `JB03`, `JB06`
- Change: Add one optional one-time service under Journey Optimizer B2B Edition, "Buying group stages model": agree stages, entry, success and failure stages and transitions with sales and marketing, build and publish the single model, add it to solution interests, test stage transitions in an account journey. Note: once published it cannot be edited, and can be deleted only when no solution interest uses it. Do not say JB06 depends on it.
- Adobe says: https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/accounts/buying-groups/buying-group-stages : "only one model is supported; to plan the optimal model, work with your marketing and sales teams"
- I recommend: Add it as its own optional service. No current service or connection mentions a stages model.
- **Your call:** Do you want buying group stages as its own optional service on Journey Optimizer B2B Edition, or folded into the wording of JB03 (Buying groups and solution interests) with no new line? Hours are yours to set either way.
- From claims: c2-c17

**182. Journey Optimizer B2B Edition: add a first person journeys service** (New service; large)

- Entries: `ajob2b`, `JB04`, `MO05`
- Change: Add an optional one-time service under Journey Optimizer B2B Edition, "First person journeys": build the first lead-based person journeys on Experience Platform audiences, add the nodes and journey flow, then test and publish. Leave out exclusions and re-entry. Alternative: fold into JB04 as "First account and person journeys". The checker could not find the release notes.
- Adobe says: https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/journeys/journeys-overview : "Orchestrate lead-based marketing using Experience Platform Audiences and data."
- I recommend: Add it as a separate optional service. JB04 covers account journeys only and Adobe documents two journey types.
- **Your call:** Do you want person journeys as a separate optional service under Journey Optimizer B2B Edition, or folded into JB04 as "First account and person journeys"?
- From claims: c2-c16

**183. Journey Optimizer and Target: add audience sharing service** (New service; large)

- Entries: `ajo-target`, `XA07`, `XA05`
- Change: Add a one-time service under ajo-target, e.g. "Share Journey Optimizer audiences to Target": configure the Adobe Target destination, workspace and Target-enabled datastream, activate the audiences and confirm they appear in Target. Add the Adobe Target connection page to the connection's Adobe pages. Wording should mirror XA05 so the two do not read as different work.
- Adobe says: experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/personalization/adobe-target-connection : "The Adobe Target destination is now available to organizations with Adobe Journey Optimizer, in addition to organizations with Real-Time CDP"
- I recommend: Add it, mirror XA05's wording, and let the overlap review ask how the two differ.
- **Your call:** When Real-Time CDP, Journey Optimizer and Target are all on the canvas, the new service and XA05 would both show for the same destination setup. Is that acceptable, or should the two be worded so the overlap is obvious to the partner?
- From claims: g-c13

**184. Journey Optimizer: add mobile app push setup service** (New service; large)

- Entries: `ajo`, `JO01`
- Change: Add an optional one-time service under ajo, "Mobile app push setup": add the app's push credentials (APNs, FCM), create the mobile tags property with the Journey Optimizer extension, work with your client's app developers to add the Experience Platform Mobile SDK, register push tokens and tracking, and test with an event-triggered journey. Leave the push channel configuration in JO01. Do not mention the quick start workflow (public beta).
- Adobe says: experienceleague.adobe.com/en/docs/journey-optimizer/using/channels/push/push-config/push-configuration : "The technical setup involves close collaboration between the app developer and business administrator"
- I recommend: Add it as optional. JO01 covers only the admin side of push.
- **Your call:** Do you want an optional Journey Optimizer service for mobile app push setup (the app-side Mobile SDK work), with hours you set?
- From claims: g-c10

**185. Journey Optimizer: add opt-out, consent and preference setup service** (New service; large)

- Entries: `ajo`, `JO01`
- Change: Add an optional one-time Journey Optimizer service, "Opt-out, consent and preference setup": add opt-out to email and mobile messages, define preference attributes on the profile, build the preference page, create consent policies, and test that opted-out profiles are excluded. Prerequisite: the preference center and consent policies need the Healthcare Shield or Privacy and Security Shield add-on; opt-out links do not.
- Adobe says: experienceleague.adobe.com/en/docs/journey-optimizer/using/privacy/consent/preference-center : "currently only available for organizations that have purchased the Adobe Healthcare Shield or Privacy and Security Shield add-on offerings."
- I recommend: One optional service, with the Shield add-on named as the prerequisite for the preference center and consent policies.
- **Your call:** Most Journey Optimizer clients will not own a Shield add-on. Should this be one optional service with the add-on as a prerequisite for the preference-center part, or should opt-out setup go into JO01's wording and the preference center be a separate optional service?
- From claims: g-c08

**186. Journey Optimizer: add sandbox promotion and release checks service** (New service; large)

- Entries: `ajo`, `JO01`, `RT05`
- Change: Add one optional one-time service under ajo, "Sandbox promotion and release checks": export journeys, campaigns, custom actions, templates and fragments as a package, import into production, re-enter custom action authentication, select channel configurations, update landing page references, recreate custom channels, check each copied object before publishing. Prerequisite: Manage sandboxes and Manage packages permissions. Keep orchestrated campaigns out.
- Adobe says: experienceleague.adobe.com/en/docs/journey-optimizer/using/connect-systems/sandbox/copy-objects-to-sandbox : "we strongly recommend that you perform a thorough check"
- I recommend: Add it under Journey Optimizer only for now. The checked Adobe page is the Journey Optimizer one.
- **Your call:** Sandbox tooling serves both Journey Optimizer and Real-Time CDP. Do you want this as one Journey Optimizer service only, or a matching one under Real-Time CDP too? Hours are yours to set.
- From claims: g-c11

**187. Journey Optimizer: add subscription landing pages service** (New service; large)

- Entries: `ajo`
- Change: Add an optional one-time Journey Optimizer service, "Subscription landing pages": set up the landing page subdomain and preset, create the subscription lists, build, test and publish the opt-in and opt-out pages, and link them in messages. Leave out public landing pages and the Cloudflare subdomain migration (both limited availability).
- Adobe says: experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/landing-pages/get-started-lp : "Before creating a landing page, complete these setup steps"
- I recommend: Add it as optional. Keep public landing pages and the Cloudflare migration out, since Adobe labels them limited availability.
- **Your call:** Do you want an optional Journey Optimizer service for subscription landing pages, and what hours should it carry?
- From claims: g-c09

**188. Journey Optimizer: approval policies for journeys and campaigns** (New service; large)

- Entries: `ajo`, `JO01`
- Change: Add an optional one-time service under ajo, "Approval policies for journeys and campaigns": agree what needs sign-off and by whom, grant the Approve & Publish permissions, create and activate the policies (conditions, reviewers, Block self-approval), test one request end to end. Prerequisite: system or product administrator rights. Keep it small and say it builds on JO01's roles.
- Adobe says: experienceleague.adobe.com/en/docs/journey-optimizer/using/test/approve/approval-policies : "Approval policies allow administrators to establish a validation process for journeys and campaigns."
- I recommend: A small optional service that says it builds on JO01's roles. Folding a clause into JO01 is also fine.
- **Your call:** Do you want approval policies as a small optional Journey Optimizer service of its own, or folded into JO01 (Access, sandbox and channel setup) as one more clause? Hours would be your estimate either way.
- From claims: g-c12

**189. Journey Optimizer: optional LINE channel setup service** (New service; large)

- Entries: `ajo`, `JO01`, `JO02`, `MO09`
- Change: No connection. If wanted, one optional service under Journey Optimizer, modelled on MO09: LINE channel configuration (marketing or transactional, consent), LINE user ID capture through LINE Login or LIFF, ingestion and Identity Service stitching, a first test message. Prerequisite: Adobe sets up the channel settings through the client's Adobe representative. Otherwise no change, since JO01 and JO02 cover it generically.
- Adobe says: https://experienceleague.adobe.com/en/docs/journey-optimizer/using/channels/line/line-configuration : "Reach out to your Adobe representative to set up your channel settings." No beta or availability label.
- I recommend: Decide it with SMS, push and WhatsApp. If those are added, add LINE the same way; otherwise leave it.
- **Your call:** Do you want LINE as an optional service under Journey Optimizer? It has no per-channel services today, and a LINE connection would need a new outside system box.
- From claims: g-b09

**190. Journey Optimizer: optional SMS and MMS channel setup service** (New service; large)

- Entries: `ajo`, `JO01`
- Change: No new connection. Add one optional Journey Optimizer service, "SMS and MMS channel setup": connect the client's Sinch, Twilio or Infobip account (API token and Service ID), create inbound and feedback webhooks where the provider supports them (not Twilio), set opt-in, opt-out and help keywords, create the mobile configuration, and test. Prerequisite: the client's own provider account. Source: the mobile-configuration page. Alternatively, name the providers in JO01.
- Adobe says: https://experienceleague.adobe.com/en/docs/journey-optimizer/using/channels/mobile/configure-mobile/mobile-configuration : "supported providers for mobile messaging and mms are: sinch, twilio and infobip". No beta label. Webhook page: "twilio: webhooks are not available."
- I recommend: Add the optional service with no new box. Hours are yours to set.
- **Your call:** Do you want SMS provider setup (Sinch, Twilio, Infobip) as its own optional Journey Optimizer service, or one added sentence in JO01? A connection line would need a new outside system box for SMS providers.
- From claims: g-b07

**191. Journey Optimizer: optional WhatsApp channel setup service** (New service; large)

- Entries: `ajo`, `JO01`, `MO09`
- Change: No connection. Add an optional Journey Optimizer service modeled on MO09: API credentials, webhooks with opt-in, opt-out and help keywords, channel configuration, first messages from Meta-approved templates. Prerequisites: Meta Business Manager account, WhatsApp Business Account with verified sender, Meta token, approved templates, Adobe's "cjm_whatsapp entitlement provisioned", no third-party BSP. Note that marketing templates to US numbers are suspended.
- Adobe says: experienceleague.adobe.com/en/docs/journey-optimizer/using/channels/whatsapp/get-started-whatsapp : "You can now send WhatsApp messages directly through Journey Optimizer via Meta's Cloud API." No beta or availability label.
- I recommend: Add the optional service with no new box, and state the US marketing-template limit in it.
- **Your call:** Do you want WhatsApp as an optional Journey Optimizer service (like MO09 under Marketo Optimizer), or as a connection, which would need a new outside system box? Adobe says marketing template messages to US phone numbers are suspended.
- From claims: g-b08

**192. Journey Optimizer: optional mobile push channel setup service** (New service; large)

- Entries: `ajo`, `JO01`
- Change: No new connection. Add one optional service under ajo, "Mobile push channel setup": Data Collection permissions, APNs and FCM push credentials, the push channel configuration, the Journey Optimizer extension in the mobile property with your client's app developers, and a test journey to a device. Source: the push-configuration page. Do not use the mobile onboarding quick start (public beta).
- Adobe says: experienceleague.adobe.com/en/docs/journey-optimizer/using/channels/push/push-config/push-configuration : "The mobile app push credential registration is required to authorize Adobe to send push notifications on your behalf". Only the quick start is "a public beta".
- I recommend: Add the optional service with no new box. Hours are yours to set.
- **Your call:** Do you want an optional "Mobile push channel setup" service under Journey Optimizer (no new box), a new outside system box for Apple and Google push services, or to leave push inside JO01's general channel setup?
- From claims: g-b10

**193. Marketo Engage: add an email subscription center service** (New service; large)

- Entries: `MK01`, `MK03`, `MK04`
- Change: Add an optional one-time Marketo Engage service, "Email subscription center": agree with your client's marketing teams the content types, mailing-list segmentation and how often people want to hear from them, then build the subscription center with its form and landing page. Cite the planning page and the tutorial. Leave out suppression logic and opt-out testing unless another Adobe page is cited.
- Adobe says: https://experienceleague.adobe.com/en/docs/experiences-by-you/implementing-new-instance/planning-for-new-implementation : "example - create an email subscription center"
- I recommend: Add it. The planning page the other Marketo services rest on lists it as its own build.
- **Your call:** Do you want an optional "Email subscription center" service under Marketo Engage, and what hours should it carry?
- From claims: c2-c09

**194. Real-Time CDP: add a data retention and dataset retirement service** (New service; large)

- Entries: `rtcdp`, `RT05`
- Change: Add one optional one-time service under Real-Time CDP, "Data retention and dataset retirement": agree retention periods with your client, set Experience Event expiration, data lake retention and pseudonymous profile expiration, schedule expirations for datasets no longer needed, and change the dataflows feeding them first. Cite the dataset-expiration page and its quote. Hours are the owner's.
- Adobe says: experienceleague.adobe.com/en/docs/experience-platform/data-lifecycle/ui/dataset-expiration: "If a dataset is set to expire, you must manually change any dataflows that may be ingesting data into that dataset". No beta label.
- I recommend: Add it as its own optional service. No Real-Time CDP service covers retention today.
- **Your call:** Do you want retention and dataset retirement as its own optional Real-Time CDP service (with your hours), or folded into RT05 (governance) as one more sentence?
- From claims: g-c04

**195. Real-Time CDP: add a privacy request setup service (access and delete)** (New service; large)

- Entries: `rtcdp`, `RT05`
- Change: Add an optional one-time service under rtcdp, "Privacy request setup (access and delete)": add identity descriptors to datasets subject to requests, list the primary identity values to send per customer (Adobe's limit: nine), agree which products each request targets (Profile, Identity Service, data lake), and test access and delete jobs through Privacy Service. Keep it small.
- Adobe says: https://experienceleague.adobe.com/en/docs/experience-platform/catalog/privacy : "all datasets that are subject to privacy requests must contain an identity descriptor"
- I recommend: Add a small optional service. RT01 to RT06 never mention privacy requests.
- **Your call:** Do you want a small optional Real-Time CDP service for setting up privacy access and delete requests, or should that stay the client's own job and be an assumption on RT05 instead?
- From claims: g-c01

**196. Real-Time CDP: add a sandbox promotion service** (New service; large)

- Entries: `rtcdp`, `RT05`
- Change: Add an optional one-time Real-Time CDP service, "Sandbox promotion": package the schemas, identities, datasets, audiences, policies and batch source dataflows built in the development sandbox, import them into the production sandbox, re-enter source account credentials, enable schemas and datasets for Profile, turn on the draft dataflows and disabled policies, and check the result. Say streaming dataflows and destinations are set up by hand.
- Adobe says: https://experienceleague.adobe.com/en/docs/experience-platform/sandbox/ui/sandbox-tooling : "source account credentials are not replicated"; "supports only batch-based source dataflows"
- I recommend: Add it on Real-Time CDP as optional. RT05 only sets sandboxes up. Journey Optimizer copy is Adam's call.
- **Your call:** Sandbox tooling also covers Journey Optimizer. Do you want this as a Real-Time CDP service only, or the same service on Journey Optimizer too?
- From claims: g-c03

**197. Sites Optimizer setup only offered with Edge Delivery** (New service; medium)

- Entries: `SO1`, `SO2`, `so-eds`, `aemsites-so`, `search-so`
- Change: Move SO1 (Sites Optimizer setup) from the so-eds connection to the Sites Optimizer product, beside SO2, so every architecture gets it. Today AEM Sites plus Sites Optimizer without Edge Delivery gets AXC05 only: no Search Console, roles or first triage.
- Adobe says: experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/settings: "the GitHub URL of your EDS site". The checker reads the Search Console connector as a general setting, not specific to Edge Delivery.
- I recommend: Move SO1 to the Sites Optimizer product and check Play 3 still shows it the same way.
- **Your call:** SO1 is one of the older template services and sits in Play 3. Is it OK to move it onto the Sites Optimizer product so it shows without Edge Delivery?
- From claims: m2-b05

**198. Sites Optimizer: add monthly engagement and security posture fixes** (New service; large)

- Entries: `so`, `SO2`
- Change: Add one optional monthly service under Sites Optimizer: review new engagement opportunities (accessibility issues, broken internal links, missing alt text, high-traffic low-CTR pages) and security posture opportunities (CORS, cross-site scripting, website permissions, website vulnerabilities), agree fixes, deploy content fixes to authoring, hand code and permission fixes to the named developer. Exclude forms opportunities (early access). No separate triage service. Hours are the owner's.
- Adobe says: experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/opportunity-types/security-posture: "cors configuration, cross-site scripting, website permissions, and website vulnerabilities". Engagement page: "accessibility issues, broken internal links, high bounce rates, and missing alt text".
- I recommend: Add the optional monthly service, leaving forms opportunities out. Whether security fixes belong in it is your call.
- **Your call:** Do you want partners to offer security posture fixes (CORS, cross-site scripting, permissions, library vulnerabilities) as a monthly Sites Optimizer service, or keep the monthly work to SEO and engagement only?
- From claims: m-c01

**199. Target on Edge Delivery: add author-managed offers from Experience Workspace** (New service; large)

- Entries: `target-eds`, `XA22`
- Change: Add one optional one-time service under target-eds, not selected by default: "Author-managed Target offers from Experience Workspace". Work: Developer Console project with the Target API, the Target role in Admin Console, the adobe-target config sheet and its permissions, the Prepare menu row, author training on send, update and delete. Prerequisites: site authored in Experience Workspace; XA22 in place. Hours are the owner's.
- Adobe says: www.aem.live/docs/ew/administering/send-to-adobe-target: "Turn on the Send to Adobe Target plugin for the Prepare menu." No beta or early-access wording. The Prepare menu page calls it "adobe-provided, but feature-flagged".
- I recommend: Add it if you accept feature-flagged as generally available. The prerequisite line already exists with no service behind it.
- **Your call:** Adobe calls Send to Adobe Target a "feature-flagged" plugin (off until a config row turns it on), not beta or early access. Are you happy to treat that as generally available and add this small optional service? The catalog has no other Experience Workspace service today.
- From claims: g-c23

**200. Target: add Auto-Target and Automated Personalization setup** (New service; large)

- Entries: `target`, `TG03`, `TG05`
- Change: Add one optional one-time Target service, "Auto-Target and Automated Personalization setup": choose the goal metric, experiences and offers, set the control share (50/50 or 90/10, never under 10%) and the control experience, QA, launch and read lift. Prerequisite: a Target Premium license. Cite the Auto-Target overview page and its stored quote. Leave TG03 unchanged. Hours are the owner's.
- Adobe says: experienceleague.adobe.com/en/docs/target/using/activities/auto-target/auto-target-to-optimize: "Auto-Target is available as part of the Target Premium solution. This feature is not available in Target Standard without a Target Premium license." No beta label.
- I recommend: Add the optional service with Target Premium as its prerequisite.
- **Your call:** Do you want a separate optional Auto-Target and Automated Personalization service for Target Premium clients, or should TG03 and TG05 simply name those activity types where the client has Premium?
- From claims: g-c19

**201. Target: add a service for Target in mobile apps** (New service; large)

- Entries: `target`, `TG01`
- Change: Add an optional one-time service under Target, "Target in mobile apps with Mobile SDK": enable Target in the app's datastream, install the Offer Decisioning and Target extension in the mobile tag property, add the proposition interactions field group, register the Optimize extension in the iOS and Android apps, build a first A/B test and validate in Assurance. Prerequisite: the app already runs the Platform Mobile SDK.
- Adobe says: experienceleague.adobe.com/en/docs/platform-learn/implement-mobile-sdk/experience-cloud/target: "Update your tag property with the Offer Decisioning and Target extension." Prerequisite: "Successfully built and run app with SDKs installed and configured." No beta label.
- I recommend: Your call. The source is a tutorial lesson and this would be the catalog's first mobile app service.
- **Your call:** The catalog has no mobile app services for any product today. Do you want Target in mobile apps added as the first one, or should mobile app work stay out of the catalog?
- From claims: g-c16

**202. Target: add a service to move at.js to Web SDK** (New service; large)

- Entries: `target`, `TG01`
- Change: Add one optional one-time service under Target with its own id (not a TG01 variant), like AN06: "Move an existing at.js setup to Web SDK": assess the at.js implementation and pick a migration approach, replace at.js with Web SDK, update audiences and profile scripts that use mbox parameters to XDM, validate rendering, reporting and integrations. Cite the migration-overview page. Hours are the owner's.
- Adobe says: experienceleague.adobe.com/en/docs/platform-learn/migrate-target-to-websdk/migration-overview: "Update the foundational implementation to replace at.js with the Platform Web SDK". No beta label.
- I recommend: Add it as its own optional service, matching AN06 for Analytics.
- **Your call:** Do you want an optional one-time Target service for moving an existing at.js setup to Web SDK, like AN06 for Analytics, and what hours should it carry?
- From claims: g-c15

**203. Target: add an optional server-side delivery service** (New service; large)

- Entries: `target`, `TG01`
- Change: Add one optional one-time service under Target, not starts-selected: "Server-side Target delivery". Call Target from your client's servers for apps, kiosks, email or backend-rendered pages: the Edge Network Server API where Target runs on Web SDK (the catalog's TG01 route), or the Delivery API and server-side SDKs where it runs on at.js. Cite the server-side overview. Hours are the owner's (TG01 is 60/120/240 for comparison).
- Adobe says: experienceleague.adobe.com/en/docs/target-dev/developer/server-side/server-side-overview: "Deliver experiences from any server-side platform or application that can make HTTP/S calls." No beta or legacy label.
- I recommend: Add it as optional and not starts-selected, if you want developer work of this kind in the catalog.
- **Your call:** Do you want an optional server-side Target service at all? It is real developer work, but only clients with apps, kiosks or server-rendered pages need it.
- From claims: g-c17

**204. Target: optional training and handover service** (New service; large)

- Entries: `target`
- Change: Optional, owner's call: add one one-time Target service, "Target user training and handover": train the client's team by role to build, QA, launch and read activities, with a handover guide. Use welcome kit chapter 2 as the source, not the reviewer's quote, which describes Adobe's own tutorials. The skeptic found this is not a defect: Real-Time CDP and Journey Optimizer have no training service either.
- Adobe says: experienceleague.adobe.com/en/docs/target/using/introduction/welcome/target-welcome-kit-2: "You can assign users the roles of Observer, Editor, Publisher, or Approver."
- I recommend: Optional. Add it only if you want Target to match products that carry training.
- **Your call:** Do you want a one-time training and handover service on Target, as most products have, or leave it out as on Real-Time CDP and Journey Optimizer? If yes, you set the hours (similar services are 16/32/56) and whether it starts selected.
- From claims: g-c21

**205. Workfront + Journey Optimizer: add sending approved messages through Fusion** (New service; large)

- Entries: `workfront-ajo`, `XB15`
- Change: Add an optional one-time service under workfront-ajo, "Approved message execution through Fusion": on Workfront approval, a Fusion scenario triggers a unitary or audience-based Journey Optimizer message (request and campaign ids, recipients mapped to Experience Platform profile ids and namespaces) and checks audience-based status. Prerequisite: an existing Journey Optimizer campaign whose id the module takes. Do not promise failure handling from this page. Hours are the owner's.
- Adobe says: experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-journey-optimizer-modules: "triggers a unitary message to the recipients you specify"; "checks the status of an audience-based batch message". No beta label.
- I recommend: Add it as a second optional service. XB15 stays about templates and fragments.
- **Your call:** Do you want a second, optional Workfront + Journey Optimizer service that sends an approved message from Workfront through Fusion, or should XB15 simply be widened to cover it?
- From claims: g-c14

**206. Workfront Fusion: add optional monthly scenario upkeep service** (New service; large)

- Entries: `workfront`, `WF06`
- Change: Add one optional monthly service under Workfront for clients running Workfront Fusion scenarios: review stored incomplete executions, fix the cause (bad data, expired connection or token, configuration) and resolve or rerun them. Prerequisite: a Workfront Fusion license. Leave out record reconciliation and recovery instructions, which Adobe's page does not support.
- Adobe says: experienceleague.adobe.com/en/docs/workfront-learn/tutorials-workfront/fusion/troubleshooting-and-error-handling/understand-incomplete-executions : "Incomplete executions can be stored in Workfront Fusion where they can later be reviewed and resolved."
- I recommend: Add it, optional and off by default. All eleven Fusion services are one-time today.
- **Your call:** Workfront Fusion is not a product box. Do you want one monthly Fusion upkeep service under Workfront (optional, off by default), or would you rather leave monthly Fusion work out?
- From claims: c2-c12

**207. Workfront: add optional resource pools and capacity planning service** (New service; large)

- Entries: `workfront`, `WF01`
- Change: Add an optional one-time Workfront service, "Resource pools, schedules and capacity planning": create resource pools and associate them with users, projects and templates; set schedules, time off and job roles on user profiles (cost rates if budgeting by cost); set up budgeting in the Resource Planner and assignment in the Workload Balancer. Not selected by default. Hours are the owner's estimate.
- Adobe says: experienceleague.adobe.com/en/docs/workfront/using/manage-resources/resource-planning-in-adobe-workfront/get-started-resource-planner : "To assign actual work to users you must use the Workload Balancer."
- I recommend: Add it as optional and off by default. WF01 to WF06 cover job roles only.
- **Your call:** Do you want resource and capacity planning as an optional Workfront service, and what hours should it carry?
- From claims: c2-c10

**208. Workfront: add optional service to build the first reports** (New service; large)

- Entries: `workfront`, `WF06`
- Change: Add one optional one-time Workfront service (e.g. WF07, "Project, task and request reports"): agree the questions managers need answered, build custom Workfront reports with columns, filters, groupings and charts, and check the results with the client's team. Prerequisite: a Standard Workfront license with edit access to reports. Leave sharing out unless sourced from Adobe's report-sharing page. Hours are the owner's.
- Adobe says: experienceleague.adobe.com/en/docs/workfront/using/reporting/reports/create-manage-reports/create-custom-report : "You can use any of the built-in reports available in Workfront, or you can build your custom reports from scratch."
- I recommend: Add it as optional. WF06 only maintains reports monthly, and no service builds them.
- **Your call:** Do you want a one-time Workfront service for building the first set of reports, or is that already inside WF01 to WF05 as you scope them?
- From claims: c2-c11

### Other (14), each needs a yes and hours

**209. Adobe Analytics data collection (AN03): add consent setup wording** (Reword; small)

- Entries: `aa`, `AN03`, `XL13`, `AN05`
- Change: Extend AN03's description, no new service and no hours change: after "the Web SDK extension" add "set the extension's default consent and the rules that pass the visitor's choice from your client's consent platform", and end with "validate in development, including that nothing is sent after an opt-out, before publishing to production." Optionally add the consent tutorial as a second reference. Leave XL13 and AN05 unchanged.
- Adobe says: https://experienceleague.adobe.com/en/docs/platform-learn/implement-web-sdk/consent-management/setup-consent: "Set consent for Experience Platform Web SDK based on the visitor's action" and "set default consent to out or pending as required".
- I recommend: Fold it into AN03 with hours unchanged. A separate service could double count with XL13.
- **Your call:** Should consent setup sit inside AN03 at its current hours (60/120/240), or do you want the hours raised for it?
- From claims: c2-c23

**210. Adobe Marketing Agent for Microsoft 365 Copilot with Customer Journey Analytics** (No change; large)

- Entries: `cja`, `rtcdp`, `ajo`, `cw-cja`
- Change: None without the owner's yes. If yes: a new outside system "Microsoft 365 Copilot" with an outside-type connection to CJA (and Real-Time CDP, Journey Optimizer) and one small service: enable the agent in the Microsoft 365 admin center, assign users, sign in, set sandbox and data view, test prompts, train users. Prerequisites: Microsoft 365 with Teams or Copilot Chat; Experience Platform Agent Orchestrator and agents entitlement; read-only; English.
- Adobe says: experienceleague.adobe.com/en/docs/cx-enterprise-ai/experience-cloud-ai/agents/ama-ms: "currently supports experience platform operational insights, customer journey analytics data insights, audience agent, and the journey agent". No beta label. Adobe says it "does not require a separate permissions setup".
- I recommend: Leave it out for now. The partner work is thin and it needs a new outside box.
- **Your call:** Adobe documents a Marketing Agent for Microsoft 365 Copilot that answers CJA questions in Teams, Word, PowerPoint and Excel (read-only). Adding it needs a new outside box and the partner work is small. Add the box, or leave it out?
- From claims: g-b16

**211. Adobe Target data to Google Analytics 4 with response tokens** (No change; large)

- Entries: `target`, `search-bv`, `SD1`, `aa-target`, `target-cja`
- Change: None until the owner decides. If yes: one outside-type connection from Target with a single small service: turn on response tokens in Target Administration, add Adobe's Web SDK (2.6.0 or later) or at.js event code that sends activity and experience names to GA4, and validate. Rest it on "send Target data to Google Analytics 4". Leave out consent and reconciliation.
- Adobe says: experienceleague.adobe.com/en/docs/target/using/administer/response-tokens: "send Target data to Google Analytics 4" and "Google Analytics can be sent data via Platform Web SDK version 2.6.0 (or later) by adding the following code in the HTML page". No beta label.
- I recommend: Leave it out. Adobe documents page code, not a product integration, and Target reporting is covered by Adobe Analytics and CJA.
- **Your call:** Adobe documents sending Target activity and experience names to Google Analytics 4 with page code. Do you want that as a Target service? If yes, which box should it connect to: Search data (where GA4 sits today as a Brand Visibility feed), BI tools, or a new outside analytics box?
- From claims: g-b12

**212. Brand Concierge monthly review: add evaluation reruns and dashboard figures** (Reword; small)

- Entries: `FSI01`
- Change: No new service. In FSI01 (the financial services text and the neutral "Answer and source review" text), add rerunning the evaluation sets after configuration changes and reporting the analytics dashboard's figures in the monthly report. FSI01 is not for financial services only, so no second monthly service is needed.
- Adobe says: experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/evaluation/evaluation : "Treat evaluations as an ongoing practice rather than a one-time gate."
- I recommend: Add the clause. It widens the monthly work, so hours are worth a look.
- **Your call:** Should the monthly Brand Concierge review (FSI01) also say it reruns Adobe's evaluation sets and reports the analytics dashboard, or stay as a conversation-sampling review only?
- From claims: m-c03

**213. Marketo Measure with Adobe Analytics card: mention Target** (Reword; small)

- Entries: `mmeasure-aa`, `XM32`, `mmeasure`, `target`
- Change: Smallest fix: add to mmeasure-aa's "how" that the same Customer Attributes source can also be subscribed to Target. Alternative: a native mmeasure-target connection with one optional service (subscribe Target, first account-based audiences), prerequisites: Marketo Measure and Adobe Analytics subscriptions, the XM32 source, Target's attribute limit (5 Standard, 200 Premium). No source-creation hours twice. Drop the reviewer's identity-validation and personalization-test services.
- Adobe says: https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-and-adobe/marketo-measure-integrations-with-adobe-analytics : "You can configure Subscriptions for Adobe Analytics or Adobe Target." No release label. Use cases name Analytics only.
- I recommend: Add the one sentence to the existing card. Adobe's page is too thin for a new line.
- **Your call:** Adobe mentions Target in one sentence on the Marketo Measure and Adobe Analytics page. Do you want a new Marketo Measure + Target line with one optional service, or just a sentence on the existing card?
- From claims: c2-b14

**214. Move Sites Optimizer setup (SO1) onto the Sites Optimizer product** (Reword; medium)

- Entries: `so`, `so-eds`, `SO1`, `SO2`, `search-so`, `aemsites-so`
- Change: Add no new service. Move SO1 from connection so-eds to product so, still starting selected, text and hours unchanged (it is already route-neutral). so-eds then has no service: one checker says its card needs a pointer to SO1 or a small Edge Delivery repository and content-source step, the other says CS2 and the so-eds prerequisites already cover it. Check Play 3 still counts SO1 once and totals the same.
- Adobe says: experienceleague.adobe.com .../sites-optimizer/content/documentation/basics : "Sites Optimizer provides a list of all the production AEM sites registered in Cloud Manager"
- I recommend: Move it and put a pointer on the Edge Delivery card. An AEM Sites plus Sites Optimizer canvas has no setup service today.
- **Your call:** Sites Optimizer setup (SO1) shows only when Edge Delivery is on the canvas. OK to move it onto the Sites Optimizer product so it shows on every AEM Sites route?
- From claims: m2-c01, c2-c07

**215. Optional canvas line: Customer Journey Analytics + Experimentation Accelerator** (No change; small)

- Entries: `cja-xa`, `aa-xa`, `EX04`, `XH04`, `TC01`, `xa`, `cja`
- Change: No new service or hours. Optional only: a cja-xa line labelled "CJA metrics imported as an experiment's primary metric", with the prerequisite that CJA was chosen as the reporting source in Target or Journey Optimizer, pointing to EX04. If added, aa-xa should get the same line, since Adobe's sentence names both. Otherwise none.
- Adobe says: experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor: "only cja metrics are available to import"; metrics "are determined by the data source configured in adobe target or adobe journey optimizer". No set-up between CJA and the accelerator is described.
- I recommend: Leave as is. EX04, XH04 and TC01 already offer the work; the gap is cosmetic.
- **Your call:** Do you want a line drawn between Customer Journey Analytics and Experimentation Accelerator (and the same for Adobe Analytics), even though Adobe describes no set-up between them and EX04 already offers the work? It adds a canvas line only.
- From claims: g-b13

**216. Real-Time CDP profile service: add identity settings and graph simulation** (Reword; small)

- Entries: `RT03`, `rtcdp`
- Change: Reword RT03 to add: "designate the unique namespaces and namespace priority in Identity Settings, test them in graph simulation (for example a shared device), and check the identity dashboard for collapsed graphs". Add the implementation guide as a second Adobe page. No new service.
- Adobe says: experienceleague.adobe.com/en/docs/experience-platform/identity/features/identity-graph-linking-rules/implementation-guide: "use the identity settings ui to designate your unique namespaces and configure your namespaces by order of priority". Overview: "Identity graph linking rules is now generally available".
- I recommend: Make the wording change and add the second page. Hours are your call.
- **Your call:** Do you want RT03's hours (24/40/80) left as they are once identity settings and graph simulation are added to its wording?
- From claims: g-c02

**217. Real-Time CDP to Braze (mobile engagement platforms)** (No change; large)

- Entries: `rtcdp`, `RT04`, `RT06`, `ads-rtcdp`
- Change: None without the owner's yes: Braze is not one of the nine outside systems, and RT04 already covers the work generically. If yes: add an outside box (for example "Mobile engagement platforms"), an outside connection to rtcdp, and one service: Braze API key, identity mapped to external_id, attribute mapping, first activation checked in Braze. Leave out "removal tests" and "campaign handoff", which are not on Adobe's page.
- Adobe says: experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/mobile-engagement/braze: "The Braze destination helps you send profile data to Braze." and "exported to Braze under the AdobeExperiencePlatformSegments attribute." No beta label.
- I recommend: Leave it under RT04. No new box unless partners ask for Braze by name.
- **Your call:** Do you want a new outside system box for mobile engagement platforms such as Braze, connected to Real-Time CDP? Today RT04 covers any destination in general terms, so nothing is wrong if you say no.
- From claims: g-b03

**218. Real-Time CDP to Salesforce Marketing Cloud (email platforms)** (No change; large)

- Entries: `rtcdp`, `RT04`, `RT06`, `crm`
- Change: None until the owner decides. If yes: add an outside system for email platforms and an outside-type connection to Real-Time CDP. Audiences export as CSV to the client's SFTP in batches (every 3 to 24 hours); the client's Marketing Cloud admin sets up the import. Prerequisites: SFTP credentials, Adobe IP allowlist, a unique identifier. Leave out matching and reconciliation, which Adobe does not document.
- Adobe says: experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/email-marketing/salesforce-marketing-cloud: "you must first connect to the destination in Experience Platform, and then set up a data import from your storage location into Salesforce Marketing Cloud". No beta label.
- I recommend: Leave it under RT04. No new box for now.
- **Your call:** Salesforce Marketing Cloud fits none of the nine outside systems (the CRM box is sales CRM). Do you want a new outside box for email platforms with a file-export connection to Real-Time CDP, or is RT04's general "connect the agreed destinations" enough?
- From claims: g-b04

**219. Sites Optimizer first review: name engagement and security opportunity types** (Reword; small)

- Entries: `SO1`, `so`
- Change: Name the engagement and security posture opportunity types in SO1's first review, beside the SEO ones it lists today (broken backlinks, metadata, structured data, sitemap issues, Core Web Vitals). SO1 already does the triage, so no separate triage service. Leave forms opportunities out (early access).
- Adobe says: experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/documentation/opportunities/low-views: "the forms optimization capability is available under an early access program". The seven opportunity type pages carry no beta or early access label.
- I recommend: Reword SO1 only if you add the monthly engagement and security service.
- **Your call:** May SO1's first review name the engagement and security opportunity types, given SO1 is a template service in the plays?
- From claims: m-c01

**220. Target Recommendations setup: add the monthly feed schedule and expiry** (Reword; small)

- Entries: `TG04`, `target`
- Change: In TG04's description, add that the feed is scheduled to run at least monthly because Adobe expires uploaded items after 61 days, and that retired items are deleted by hand in Target. No new monthly service unless the owner wants one. The skeptic found a standalone monthly service thin, since a feed scheduled at setup meets the rule unattended.
- Adobe says: experienceleague.adobe.com/en/docs/target/using/recommendations/entities/feeds: "Uploaded entities and entity attributes expire after 61 days." Also "your feed should run at least monthly".
- I recommend: Reword TG04 only. Skip the monthly service.
- **Your call:** Do you want a separate optional monthly Target service for Recommendations upkeep (feed status checks, failed imports, removing retired items, tuning criteria), or is adding the feed schedule and the 61-day expiry to TG04 enough?
- From claims: g-c20

**221. Target implementation: add a consent and privacy request clause** (Reword; small)

- Entries: `TG01`, `target`
- Change: Add a clause to TG01, not a new service: "connect your client's consent platform so Target runs only after consent, and record which ids (ECID, tntid, thirdPartyId) your client sends in access and delete requests through Adobe's Privacy Service." Cite the page for the request ids only. Read Adobe's Web SDK consent page before wording the consent step, since this page's opt-in steps are for at.js.
- Adobe says: experienceleague.adobe.com/en/docs/target-dev/developer/implementation/privacy/cmp-privacy-and-general-data-protection-regulation: "Delete Data Subject information stored within Target"; "Consent management isn't supported by and shouldn't be achieved via Target for GDPR and CCPA."
- I recommend: Add the clause to TG01. The Target-only work is too small for its own service.
- **Your call:** Do you want consent and privacy requests as one clause in the Target implementation service (the checkers' suggestion), or as a small optional service of its own?
- From claims: g-c18

**222. Workfront Planning lines to BI tools and Data warehouse** (No change; medium)

- Entries: `planning`, `planning-bi`, `planning-dwh`, `WP06`
- Change: Do not add planning-bi or planning-dwh connections now. WP06 already scopes the work. Adobe documents read-only access through Snowflake views, not an export pipeline. If a planning-bi line is added later, narrow WP06 to Canvas Dashboard reports so hours are not counted twice. Adobe also says not all Data Connect capabilities reach Planning bought standalone.
- Adobe says: https://experienceleague.adobe.com/en/docs/workfront/using/reporting/data-lake/create-a-reader-account : "the reader account provides read-only access" and "shares your data through snowflake views only".
- I recommend: No new lines. The WP06 edit covers it.
- **Your call:** Do you want lines on the canvas from Workfront Planning to BI tools and to Data warehouse, or is the added prerequisite and clause on the Planning reports service (WP06) enough? Data Connect is a Workfront feature, so a line could sit on Workfront instead.
- From claims: c2-b12, c2-b13

### Small edits, no decision needed beyond a yes (2)

| # | What | Entries | Change |
|---|---|---|---|
| 223 | Brand Concierge build: name brand profile and three evaluation types | F02 | No new service. Optional wording only: in F02, name the brand profile and Adobe's three evaluation types (functional, out-of-scope, safeguard) beside the golden-answer test set. |
| 224 | Marketo Measure: name the quarterly touchpoint suppression review | MZ05, MZ08 | No new service. MZ08: add "and, once a quarter, review touchpoint suppression so logins, unsubscribe forms, careers pages and internal apps stay out of attribution". MZ05: change "review touchpoint and segment settings" to "set touchpoint suppression and segment settings". Hours unchanged. |

## Part 5. Housekeeping: sources and structure

### Needs a decision (1)

**225. AEM Forms + Adobe Analytics: optional new connection and a placement rule** (New connection; medium)

- Entries: `AF09`, `AF08`, `aemforms`, `aa`
- Change: Optional: add an AEM Forms + Adobe Analytics connection that points to AF09 (form analytics), now that Adobe Analytics is a box. Optional: write down one rule for where integration work sits (on the connection when both ends are boxes on the canvas, otherwise on the product with an "also needs" tag).
- Adobe says: https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/services/integrate-aem-forms-with-adobe-analytics : "When an event occurs on an adaptive form, AEM Forms send these data elements to Adobe Analytics."
- I recommend: Keep AF08 and AF09 on AEM Forms. Add the AEM Forms + Adobe Analytics line pointing to AF09 only if he wants it.
- **Your call:** Do you want one rule written down (work sits on the connection when both ends are boxes, otherwise on the product with an "also needs" tag), with AF08 and AF09 moved or pointed to from their connections now that Acrobat Sign and Adobe Analytics are boxes?
- From claims: m-d03

### Small edits, no decision needed beyond a yes (16)

| # | What | Entries | Change |
|---|---|---|---|
| 226 | Acrobat Sign + AEM Forms card: point to the e-signature service | acrobatsign-aemforms, AF08, XN10 | On the acrobatsign-aemforms card, name AF08 (E-signature with Acrobat Sign) as the service that creates the API application and cloud configuration, the way crm-mqualifier already names MQ02. No blanket move of services. Leave SG10 to SG12, MK02 and MQ02 where they are. Nothing is sold twice today. |
| 227 | Ad platforms into CJA: update the old paid media guide link | AD2, ads-cja | In AD2's url and the ads-cja reference "Join Paid Media Data With Web Data In Customer Journey Analytics", replace /cja-usecases/data-ingestion/paid-media with /cja-usecases/cross-channel/paid-media-web. Title and tier unchanged. The claim that the CJA package requirement is missing did not hold: both entries already say CJA Select or higher. |
| 228 | Ad spend joined to web conversions (AD2): update the moved Adobe page address | AD2 | Update AD2's page URL to the redirected address. The CJA paid-media guide now redirects to .../cja-usecases/cross-channel/paid-media-web. |
| 229 | Brand Concierge Commerce catalog service: add the framework page | XA13 | XA13: add the Skills and Integrations Framework page (https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/skills-and-integrations) as the first reference, with the quote "backed by Adobe Live Search". Keep the FAQ as the second reference for the custom-variations quote. No change to the service text or hours. |
| 230 | Brand Concierge data services: cite the implementation pages | XA10, XA08, ajo-bc | XA10: cite the Developer and customization guide first, with the quote "Brand Concierge writes conversation data - prompts, responses, and feedback - into Adobe Experience Platform (AEP) datasets"; keep the blueprint as second reference. XA08: add the Deploy a concierge page with the quote "A datastream is the destination for activity data generated by visitor interactions with the concierge" beside the blueprint. ajo-bc: none. |
| 231 | Brand Concierge on Edge Delivery: two stored quotes sit on other pages | XA11, XA12, bc-eds | XA11: keep the deployment URL, replace the quote with "Have the website team install the script directly in the page code or through a tag manager". XA12: keep the knowledge-sources URL, replace the quote with "Crawls a sitemap, selected individual URLs, or URLs supplied in a CSV file". No change to service text or hours. |
| 232 | Brand Concierge sales handoff: name both calendars (optional) | XP06 | Optional, not needed for accuracy. XP06 could read "help each connect a calendar (Microsoft Outlook or Google Calendar)", matching Adobe's representative-setup page. F02, mqualifier-bc and MQ03 stay as they are. |
| 233 | Coworker skills for Target: give the stored quote its page | XA27 | On XA27, add "Experience League: What are skills in Coworker?" (https://experienceleague.adobe.com/en/docs/coworker/content/customizations/skills/what-are-skills) as a reference so the stored quote has its page. Keep the Accelerate experimentation page for the Target workflow. Optional: the Coworker Chat workflows page backs "guided activity setup" better. No wording or hours change. |
| 234 | Customer Journey Analytics: add a reporting check to service CJ02 | cja, CJ02 | Optional polish from the checkers: add "and check the data in reporting" to CJ02, in place of a separate one-time acceptance-test service. |
| 235 | Journey Optimizer B2B email setup: say it is the dedicated Marketo instance | JB02, MK01, ajob2b-marketo | Not a duplicate: the second checker overturned it. Optional clarity only: JB02 could open "In the dedicated Marketo Engage instance attached to the B2B Edition" so nobody reads it as the client's own instance. No hours change, no shared deliverable, no change to MK01. |
| 236 | Marketo Engage CRM sync service: replace a quote no longer found | MK02 | Replace MK02's stored quote with words that are on its Adobe page today. The checkers found the current stored quote is NOT FOUND on that page. The file does not give the replacement sentence, so it has to be picked from the page. |
| 237 | Marketo Engage and Brand Concierge service: stored quote is not on its page | XB11 | XB11: swap the stored quote for "their concierge engagement is written to that record as native activity types", which is on the same cited page (marketo-activities). No note on the topics, summary and language attributes: the catalog does not promise them. |
| 238 | Outside systems note still says CDN log forwarding starts off | OX1 | Side note from the skeptic: sow/canvas/OUTSIDE_SYSTEMS.md line 80 still says OX1 is "Off". Since step 45 it starts on. Update that line of the record so it matches the tool. No catalog or tool change. |
| 239 | Real-Time CDP + CJA audiences (RC03): replace a quote not on Adobe's page | RC03 | RC03's stored quote was not found on Adobe's page. Replace it with "After you create and publish an audience in Customer Journey Analytics, the audience is available in Experience Platform". |
| 240 | Real-Time CDP with Adobe Analytics and with Marketo: add destination pages | aa-rtcdp, marketo-rtcdp | Add a second Adobe page to each connection, no wording change. aa-rtcdp: Experience Cloud Audiences connection (https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/experience-cloud-audiences). marketo-rtcdp: Marketo Engage connection destination (https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/marketo-engage-connection). |
| 241 | Review pack should print flow sources and license or package tiers | ajo-target, cja-bi, BI1, BI2, dwh-rtcdp, DW1 | No catalog change. Outside the catalog: have the review pack (sow/qa/review_pack/show.py and build_pack.py) print each flow's source and each entry's "tier" field. Reviewers flagged a missing citation on ajo-target, a missing CJA package on cja-bi, BI1 and BI2, and a missing license on dwh-rtcdp and DW1 because the pack hides them. The catalog already holds all of them. |

## Part 6. Quotes and links (checked by script)

- `sow/qa/review_pack/check_all.py` read all 482 cited pages: all answer; 6 redirect; 31 of 462 stored quotes are no longer on their page word for word and need a fresh sentence (list in `sow/qa/review_pack/out/link_quote_check.json`).
- 55 services store no quote. The reviewers proposed sentences: 31 of 32 from ChatGPT and 25 of 33 from the second reviewer are on Adobe's page word for word. The checked list is `proposed_quotes_checked.json` in this folder.

## Claims that did not hold

| Claim | Why |
|---|---|
| g-a16 | Already covered: JC02 already cites the Experimentation panel page as a supporting reference and names the context labels. Side flag for the review tools only: show.py and build_pack.py leave out supporting references (73 of 517 services have them), so other missing-citation claims may be false. |
| g-a08 (TG04 part only) | TG04 already carries the tier "Target Premium" in the catalog, so the reviewer is wrong there. The XL03 and aa-target parts are kept as an item. |
| m2-a01 (AXC06 forms part only) | AXC06 scopes no forms work; Form Accessibility appears only in its stored quote, which is unlabeled. The checker left AXC06 as is. |
| m2-a05 | Not reproduced. The reviewer's page returns 404 and Adobe's Coworker workflows page lists the journey anomaly skill with no availability label. No change. |
| c2-d37 | Second check overturned it: XL10 and XN21 are already scoped to their own integration, any overlap with AN02 is a few admin clicks inside the owner's hours. Change: none. |
| c2-d49 | Final change is none required. C05 sits once under Brand Visibility, so there is no double fee; the reviewer's point is a placement suggestion. Optional only: show C05 as a line between Brand Visibility and Other CMS site. |
| c2-d50 | Already covered. OX3, OX4 and OX5 already say they add their own datasets to the connection CJ02 sets up (the step 28 choice). Optional only: one more assumption sentence saying so. |
| c2-d44 | Already covered: SG09 is the client's own application over the REST API, and the Acrobat Sign + Workfront card already sends Workfront signature work to Fusion (XN11, XN12). The second checker's change is none; the extra clause is polish, not a defect. |

Also false from the first pass: the second reviewer's report that the export file was corrupted (it was valid), and its two "missing" Brand Concierge connections (both exist). The 42 "empty descriptions" were a fault in the export, fixed before the second pass. Several "missing license" claims were already on the cards as a "Needs ..." tag that the review tool did not print; `show.py` now prints it.

## Files

- `findings.json`: every item with its evidence, and the verdict on each claim.
- `proposed_quotes_checked.json`: the reviewers' proposed quotes, each marked found or not.
- The reviewers' reports are not in the repo; the catalog export and prompts are in `sow/qa/review_pack/out/`.
