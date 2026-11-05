# Full audit of the SOW tool (Nov 5 2026)

Adam (Nov 5): "just find everything that needs to be fixed and fix it all at once", and the wording rule: customers buy products; partners implement services for their clients.

Six auditors (canvas wording, SOW wording, canvas bugs, SOW-step bugs, layout at four screen sizes, facts against the research) read and drove the site at commit 58e693d; every finding was checked by a skeptic who tried to disprove it. 65 confirmed, 2 disproved, merged into the 45 items below, each with the fix to make.

Item 1 was reproduced by Claude too: on the step 45 and 46 builds, a saved engagement with Search data (or another step 45 system) on the canvas loses the client name and the partner's work on the next load. The live step 44 site doesn't have it.

## 1. Saved engagement is wiped on the next load when certain outside systems or AEM Assets are on the canvas (high)

Where: sow/index.html lines 302-303 (load) and line 309 (const OUTSIDE_MORE); same in sow/site/sow/index.html

Problem: The saved engagement is loaded before OUTSIDE_MORE is declared. With Search data, Ad platforms, BI tools, Authoring documents, CMS or AEM Assets on any play, loading throws an error. The empty catch hides it, and the page saves a blank engagement over the partner's work: client, terms, hours, months, own services and even the canvas rate.

Fix: 1. Move const OUTSIDE_MORE and the outside helpers (outsideAllowed, normOutside) above line 302. Better, move the whole load (lines 302-303) below every const that normalize uses.
2. In the load catch, log the error, set a flag so save() does not overwrite the stored key in that session, keep a backup copy of the raw JSON under a separate key, and show the partner a toast saying the saved work could not be opened.
3. Add a regression test that stores an engagement with each of search, ads, bi, csrc, cms and aemassets (dwh as control). Reload the SOW steps, run Build then Continue twice, and open a draft. Check that client, rate, months, own services and hours survive each time.

## 2. Removing an outside system in focus view crashes the canvas, freezes the total and doesn't save the removal (high)

Where: sow/canvas/template.html removeOutside() line 690 and fcur() line 337 (built into sow/site/index.html)

Problem: Selecting an outside system in focus view (10 or more connections) and choosing Remove from canvas leaves the selection on a box that no longer exists. render() then throws. The total stays at the old figure, so the canvas shows $867,600 while Services shows $856,800. The removal is never saved, so a reload brings the system back, and every later change throws until Escape.

Fix: 1. In removeOutside, add if(fsel===id)fsel=null; before render(), as removeProduct does.
2. Change line 337 to const fcur=()=>fv()&&fsel&&has(fsel)?fsel:null; and at the top of render() add if(fsel&&!has(fsel))fsel=null;
3. Rebuild with build.py.
4. Add a test_canvas.js check: in focus view, click an outside system and remove it. Expect no pageerror, a shown total equal to totals().yr, and localStorage out without that system.

## 3. Build canvas can't be read or tapped on phones and tablets (high)

Where: sow/canvas/template.html fit() (around line 548), built into sow/site/index.html

Problem: fit() shrinks the 1710px stage with no lower limit. On a 390px phone, product names render at 3 to 10px and lightning bolts are about 7px across, too small to read or tap, and the products sit below the first screen. On a 768px tablet with outside systems, names drop to 7 to 9px.

Fix: 1. In fit(), clamp the scale with s=Math.max(MIN_S,...), with MIN_S about 0.7 below 900px.
2. When the clamped stage is wider than #canvas, give #canvas overflow:auto and touch-action:pan-x pan-y. Size an inner sizer to W*s by H*s so the scroll area is real.
3. Start scrollLeft centered on the play's own products.
4. Give each bolt a hit area of at least 44px: a transparent circle behind the glyph, scaled by 1/s.
5. Below 600px, use a smaller canvas min-height and collapse the fee box to its one-line total, so products show on the first screen.
6. Rebuild with build.py, then check at 390 and 768 that products are on the first screen and that tapping a bolt opens its card.

## 4. Licensing and Adobe-term wording says "clients" where Adobe means customers, and it prints in the SOW (high)

Where: sow/canvas/research/connection_types.json lines 3194, 3197, 3238, 3241, 3245, 3252, 3259 (aemassets-ajo, aemsites-ajo), 84 (bv-eds), 953 (aemsites-bv), 2672 (marketo-ajo); sweep decisions c0295, c0299, c0308, c0309

Problem: The rule is that customers buy and license products. These texts are about product eligibility or quote Adobe's own terms, yet they say "health care clients", "for clients with Dynamic Media", "client-managed CDNs" (Adobe says customer-managed CDN, BYOCDN) and "provisioned for your client". The Nov 4 sweep made several of these changes, and the text flows into the SOW assumptions of XC03 to XC07, AXC01 and XB06.

Fix: 1. Edit connection_types.json:
   - Line 3252: "for health care customers it needs the Healthcare Shield and Extended Security for Healthcare add-ons."
   - Lines 3197 and 3259: "Health care customers: ..." (keep "for Dynamic Media" at the end of 3197).
   - Lines 3238 and 3241: "for customers with Dynamic Media (with OpenAPI)".
   - Line 3245: "for customers with Dynamic Media".
   - Line 3194: "depending on the Adobe contract", not "customer's", because it prints as a SOW assumption about the one signing company.
   - Line 84: "Adobe documents it for customer-managed CDNs, BYOCDN; confirm the route for Adobe's managed CDN".
   - Line 953: "Adobe documents log forwarding for customer-managed CDNs (BYOCDN), so ..."
   - Line 2672: "MktoSync: Ingestion Service access provisioned for the customer".
2. Leave XC04's scope ("For clients with Dynamic Media, set up ...", line 3676) and c0298/c0300 ("your client's CDN in front"). Those describe the partner's work.
3. Set c0295, c0299, c0308 and c0309 to keep in sow/sweep46_decisions.json, with reasons "Adobe's term: customer managed CDN (BYOCDN)", "Adobe entitlement" and "licensing: health care customers". Move them to Kept as customer in review_step46_2026-11-04/CHANGES.md.
4. Run python3 sow/canvas/build.py, then python3 sow/build_site.py, then the suites.
5. Add a test_step46.js check that canvas data and a custom-play SOW (AEM Sites, Journey Optimizer, AEM Assets, Brand Visibility, Marketo) contain no "health care clients" and no "client-managed".
6. No migration is needed: the step 34 hand-over updates unedited text.

## 5. Coworker services print partner instructions and internal notes in the client's SOW (high)

Where: sow/index.html CATALOG: CW-FSI, CW01, CW00, CW05, CW06, CW07; canvas Coworker connection prerequisites carried by AXD08 to AXD12, XB10, XB14

Problem: The signed SOW tells the partner things like "confirm eligibility with Adobe before proposing this to a bank or insurer", "Review usage after three months and reset the band", "Reuse across clients is the partner's choice" (which reads as an unagreed IP term) and "Reuse the foundation across sales plays and reduce work already completed." The SOW must never carry partner-internal notes, and in the FSI play it hands the bank or insurer a sales instruction.

Fix: 1. In the CATALOG, rewrite these lines:
   - CW01, CW00 and CW-FSI: end with "Assumes Adobe confirms that Coworker is available to the Client's organization." Delete CW-FSI's neutral.fsi.assumptions swap pair.
   - CW06: "The partner and the Client review usage after three months; any change to the monthly hours is agreed through change control."
   - CW07: delete "Reuse across clients is the partner's choice."
   - CW05 exclusions: "training already delivered under another statement of work".
   - CW00: "A specialized Skills package is included in this statement of work or already implemented. Discovery, context and training already delivered under another statement of work are not repeated."
2. Put the partner tips in each service's basis, which shows on the Services card and is never printed: resize the band after three months, plugin reuse is agreed in your commercial terms, reduce hours for work already delivered, confirm eligibility with Adobe before proposing.
3. In canvas publish(), drop the "confirm eligibility" Coworker prerequisite from what goes to the SOW, or replace it with the same assumption. Keep it on the card.
4. In issues(), copy the XA09 check to every Coworker line in the FSI play: "<service>: record Adobe's written confirmation (date or reference) that Coworker is available to the Client's organization in its assumptions."
5. Add a PRIOR47 record with the current assumptions and exclusions of CW00, CW01, CW05, CW06, CW07 and CW-FSI (FSI and neutral texts), and add it to the known list at line 273. For edited research lines that still contain "confirm eligibility" or "before proposing", add a Before you issue item.
6. Mock up a partner-only eligibility flag on Coworker cards (a UI change, so it needs a PNG and Adam's yes).
7. Add a check that no SOW in any play contains "confirm eligibility", "before proposing", "sales play", "partner's choice" or "reset the band".
8. Copy the page into sow/site/sow/ with build_site.py.

## 6. Canvas prerequisites hand partner instructions and research caveats into SOW assumptions (medium)

Where: sow/canvas/template.html publish() line 897; sow/index.html applyHandoff() line 558 and conceptGaps/realEdit; availability and prereqs in research/connection_types.json

Problem: Every research service on a connection gets "Connection: <kind>. Availability: ..." plus the connection's prerequisites as its SOW assumptions. 51 of 112 such lines carry partner instructions such as "confirm for the client's tenant", "confirm the data use with Adobe", "prove it in a pilot" and "Trial limits conflict ...". The gate needs only 15 added characters, so these instructions stay in the issued SOW.

Fix: 1. Give each connection in connection_types.json two texts: a partner note for the card, and an SOW version written as a condition with an owner. Examples:
   - "Availability: not stated by Adobe; it is confirmed with Adobe for the Client's tenant before this service starts."
   - "Adobe's written confirmation of the data use is obtained before the analysis starts."
   - "a direct Web SDK route is validated in a pilot within this service"
   Do the same for each prerequisite that contains an instruction.
2. Have build.py carry both texts. The card shows the partner note, and publish() hands over only the SOW version, not the "Connection:" kind prefix.
3. Write the SOW versions with "the Client".
4. On load, strip the old "Connection: ... Availability: ..." prefix from unedited prefills and keep partner-added text.
5. Add a regression test: Create your own play with every product on, and assert no SOW assumption contains an imperative "confirm" or "prove it" clause.

## 7. About 80 canvas strings say "the client" or "your" instead of "your client", and reach the SOW in lowercase (medium)

Where: research/connection_types.json, cja_hub.json, aem_sites_assets.json, connections_more.json, marketo_workfront.json, portal_omnichannel_b2b.json; docVoice in sow/index.html line 544; bpVoice in template.html line 784

Problem: The Nov 4 sweep only searched for "customer". So 18 cards still say "confirm for the client's tenant", 30 scopes say things like "map the client's entities", and XA10's name is "...in the client's CJA". A card headline says "A concierge grounded in your site" (meaning the partner's own site), and AXC06 says "(your own GitHub ...)". docVoice only rewrites "your client", so the SOW mixes 13 lowercase "the client" with "the Client", and once says "your own".

Fix: 1. Reword at the source:
   - "the client('s)" becomes "your client('s)"; "confirm for the client." becomes "confirm for your client."
   - "For clients X" becomes "Where your client has X" (SI03, TC03, AXA01, AXA03, XC04).
   - "Client-approved knowledge sources" becomes "Knowledge sources your client approves".
   - connection_types.json line 1887 (and connections_more.json line 396): "A concierge grounded in your client's site".
   - aem_sites_assets.json line 537: "(your client's own GitHub, GitLab, Bitbucket or Azure DevOps, or a branch on a Cloud Manager repository)".
2. Leave the licensing notes as "customers" (see the licensing item). Leave the technical terms: client-side callback functions, client-managed, Client ID and Client Secret, Adobe Client Data Layer, Target client code.
3. As a safety net, add .replace(/\b([Tt])he client(?![-\w])/g,(m,t)=>t+'he Client') to docVoice, and give bpVoice the same lookahead.
4. Widen sweep46_extract.py's SPAN to client and clients, and add gain "title" to its shown keys.
5. Add test_step46.js checks:
   - Shown canvas fields have no bare "the client" or generic "clients" outside the exceptions.
   - No "your" is used without "client".
   - A Create your own play SOW with every product on has no lowercase "the client" and no "your".
6. Rebuild with build.py and build_site.py. No migration is needed (step 34 hand-over).

## 8. FSI problem answer offers Coworker to a bank or insurer without Adobe's finance exclusion (medium)

Where: sow/canvas/problems.json, fsi-complex-questions, refine chip "My client wants conversation summaries" (line 508)

Problem: This problem only matches banking and insurance clients. The chip adds Coworker but notes only that Brand Concierge isn't on Coworker's compatible list. It never says Adobe doesn't currently offer Coworker to finance organizations, which every Coworker card and CW-FSI state.

Fix: 1. Set the note to: "Adobe says Coworker is not currently offered to health care, finance or some other industries, so confirm eligibility with Adobe before proposing it. Brand Concierge also isn't on Coworker's compatible applications list."
2. Keep the chip. Coworker for FSI is Adam's open question, recorded in UNRESOLVED item 11.
3. Run python3 sow/canvas/build.py and python3 sow/build_site.py, then test_problems.js, test_canvas.js and test_site.js.

## 9. CDN log forwarding now starts on, but the SOW and Scope note still say the Client creates the log job (medium)

Where: sow/index.html CATALOG L02 (scope, bands, assumptions); outcome() line 445/446; CDN_NOTE.own line 380 and renderScope line 432

Problem: Since step 45, "CDN log forwarding, set up by the partner" (OX1) is on by default in every Brand Visibility play. The default SOW still says the Client's CDN team creates the log job (L02) while OX1 says the partner creates it. L02 also prints the tool phrase "is selected". The AEM Scope note tells partners to add the CDN box and service, which are already on, and switches to "The partner" mid-sentence.

Fix: 1. L02 scope (all three bands): replace "once the Client's CDN team has created the log job" with "once the log-forwarding job is active in the Client's CDN console".
2. L02 assumptions: replace the "creates the log job ... (unless ... is selected)" clause with "The log-forwarding job in the Client's CDN console is often the longest item;".
3. outcome(): build the clause from the selection:
   - OX1 on: "CDN log forwarding on once the partner creates the log job with your client's IT access and approval"
   - OX2 on: "... once your client's team runs the partner's log export"
   - otherwise: "... once your client's IT team completes it"
4. End CDN_NOTE.own at "...You prepare and check them, and do them only with access your client grants." In renderScope, append a sentence that matches the current state:
   - OX1 on: "already in Services ... take it off with its X if your client's team creates the job"
   - CDN box on, OX1 off: add OX1 back on the CDN and Brand Visibility bolt
   - no box: add the CDN box on Build
5. Add the current L02 texts to PRIOR47 and to the known list at line 273.
6. Add tests:
   - The default SOW for cja, commerce, aem, fsi and abv never contains "Client's CDN team has created the log job" or "is selected)".
   - The three Scope note states each read correctly.
7. Run build_site.py.

## 10. AEM with Adobe-managed CDN: the SOW still bills a job in a CDN console the Client doesn't have (medium)

Where: sow/index.html dependencyList lines 384-386, issues(), CDN_NOTE.managed, L02 (AEM play)

Problem: On the AEM play with "Adobe-managed CDN", the SOW says Adobe confirms the log route in week one. It also charges OX1 (on by default) to create a log job in "the Client's CDN console", which doesn't exist on Adobe's managed CDN. L02 also says the Client's CDN team creates it.

Fix: 1. In issues(), when play is aem, cdnRoute is managed and OX1 is on, add: "CDN log forwarding, set up by the partner is on, but the Scope step says Adobe's managed CDN serves the site, where your client has no CDN console of its own: take the CDN box off on Build, or change the answer." Add the same sentence to CDN_NOTE.managed.
2. Change the line 386 condition to (!aemCdn||(aemCdn!=='managed'&&has('OX1','OX2'))).
3. For aem plus managed, give unedited L02 text managed wording:
   - Scope: "register CDN log forwarding in Brand Visibility by the route Adobe confirms for its managed CDN in week one, and confirm the logs arrive"
   - Assumption: "On Adobe's managed CDN, the log-forwarding route is confirmed with Adobe in week one; it is often the longest item"

## 11. Brand Visibility service texts print estimating notes, play names and tool hints in the SOW (medium)

Where: sow/index.html CATALOG O02, F02, C07, L03 assumptions

Problem: The SOW carries partner-side notes:
- O02 (default in all five Brand Visibility plays): "The page mix and volume can be changed before pricing the service."
- F02: "...not yet reconciled with Adobe's figures or an independent delivery estimate."
- C07: "...the Small band covers confirming and verifying it."
- L03 names "the AEM play" and "the Commerce play" and "This package is selected only when automated deployment is required."

Fix: 1. O02: delete the pricing sentence.
2. F02: move the Adobe FAQ comparison and the "not yet reconciled" caveat to the card's basis. Leave only: "These hours cover the partner's work around Adobe's setup: approved sources and reviewers, conversation and disclosure design, the handoff, the golden-answer and refusal tests and the staged rollout."
3. C07: "Where an existing setup is confirmed ready, this service confirms and verifies it."
4. L03: "(where Implement AEM Sites on Edge Delivery is part of this engagement, it turns the route on)" and "or set up by CDN readiness and routing". Delete the "selected only when" sentence.
5. Leave the "selected" wording in L02, C02 and FSI01 as it is.
6. Add PRIOR47 entries and add them to the known list at line 273.
7. Add a test: every play's SOW with all services on has no "play" and no "Small band".

## 12. Prompt strategy scope prints the tool's hint and "adjust the prompt count" in every Brand Visibility SOW (medium)

Where: sow/index.html CATALOG L01 scope and bands.small/large.scope; promptSummary() line 406

Problem: A Fixed scope line in the signed SOW says "(200 is the usual start)" and "Adjust the prompt count to the Client's license." These are tool hints, and they leave the agreed quantity open. With 500 prompts entered, the SOW states three different quantities.

Fix: 1. L01 scope: "Run two discovery workshops and curate 200 to 1,000 prompts in up to three markets or languages, covering agreed customer intents, three competitors and five business measures." Delete the last sentence from the small and large bands.
2. Add to L01.assumptions: "The agreed prompt count fits within the Client's Brand Visibility license."
3. Drop "(sets the prompt services to the Typical band)" from promptSummary().
4. Add a PRIOR47 entry with the three current scopes and the current assumptions, and add it to the known list at line 273.
5. Optional: add "Keep it within the prompts the Brand Visibility license allows." to the Scope hint at line 33.
6. Run build_site.py.
7. Add a test: no Brand Visibility SOW contains "usual start" or "Adjust the prompt count".

## 13. SOW can be downloaded with no schedule, no names and no rate, and then prints partner to-dos (medium)

Where: sow/index.html issues() lines 409-423; SOWDocument line 137 and line 148

Problem: Download, Print and CSV are gated only on commercial terms. A SOW then ships with:
- "Partner to confirm delivery phases, review dates and dependencies with the Client."
- "Client name" and "Partner name" as the parties.
- With no rate, "Not yet priced" in every cell plus "Complete the missing hourly rates before approving the fee estimate."

Fix: 1. In issues(), add three checks:
   - if(substance(state.timeline)<15) "Delivery schedule (section 4): write the delivery phases and review dates on the Scope step. Placeholder text such as TBD does not count."
   - if(substance(state.customer)<2||substance(state.partner)<2) "Client and partner: name your client and your company on the Scope step."
   - if(totals().missing) "Hourly rates: enter your rate on the Scope step, or a rate on each line."
2. Remove the line 148 note from the document.
3. Update test_review_nov2.js, test_site.js and check.py to fill these fields.
4. Add a check that a downloaded SOW contains no "Partner to confirm", ">Client name<", ">Partner name<" or "Complete the missing hourly rates".
5. Run build_site.py.

## 14. AEM and Commerce SOWs refer to a deployment pilot that isn't in them (medium)

Where: sow/index.html dependencyList line 385; CATALOG C07 scope, deliverable, exclusions and Small band texts

Problem: The default AEM SOW says "A missed window moves the deployment pilot", and the default Commerce SOW's C07 hands off to "the deployment pilot". Neither SOW contains the Automated optimization deployment pilot (L03).

Fix: 1. dependencyList: "A missed window moves "+(has('L03')?'the deployment pilot and ':'')+"the AI-traffic baseline."
2. C07 scope and Small scope: "verify one page before the first optimization goes live through the route".
3. C07 deliverable and Small deliverable: "the handoff of the verified route for the first edge deployment".
4. C07 exclusions: "the optimizations deployed through the route (separate services)".
5. Add the current C07 texts to PRIOR47 and to the known list at line 273.
6. Run build_site.py.

## 15. Warehouse dependency names a CJA package and change tracking even when the warehouse feeds only Real-Time CDP or Journey Optimizer (medium)

Where: sow/index.html dependencyList line 394; sow/canvas/catalog.json dwh product "systems" (products[15])

Problem: Any engagement with the Data warehouse box prints "turns on change tracking for each table. Data Mirror needs CJA Select, Prime or Ultimate." Real-Time CDP copies tables and needs Real-Time CDP Ultimate or the Advanced Enterprise connectors. Journey Optimizer needs a Campaigns package. The card also says "through Data Mirror" for the Real-Time CDP route.

Fix: 1. Build one bullet from the products on the canvas. Shared opening: "Data warehouse: the Client's data team gives the access the source needs (for Google BigQuery, a dataset for temporary tables; for Azure Databricks, a SAS token in the cluster's Spark configuration) and allows Adobe's IP addresses where the warehouse needs it." Then add:
   - CJA: "change tracking is on for each table; Data Mirror for CJA needs CJA Select, Prime or Ultimate."
   - Real-Time CDP: "the Real-Time CDP route copies tables on a schedule and needs Real-Time CDP Ultimate or the Advanced Enterprise Source Connectors."
   - Journey Optimizer: "Data Mirror for orchestrated campaigns needs a Journey Optimizer Campaigns package, with change tracking on and deletes managed at the source."
2. Set the dwh systems text in the build source to "Snowflake, Google BigQuery or Azure Databricks (Data Mirror for CJA and Journey Optimizer; tables copied on a schedule for Real-Time CDP)".
3. Rebuild.

## 16. CJA play's default audience service needs Real-Time CDP or Journey Optimizer but never says so (medium)

Where: sow/index.html CATALOG C06; sow/canvas/build.py add_live()

Problem: C06 is on by default in the CJA play and publishes CJA audiences to Real-Time Customer Profile. Adobe allows that only with Real-Time CDP or Journey Optimizer, and CJA alone doesn't license Profile Service. A CJA-only customer can't receive the service as scoped, and nothing warns the partner.

Fix: 1. Add "ext": "Real-Time CDP or Journey Optimizer" to C06 in the sow/index.html CATALOG.
2. Extend add_live() in build.py to copy ext and tier, as add_research() does.
3. Replace C06's first assumption with: "The Client licenses Real-Time CDP or Journey Optimizer, because CJA audience publishing to Real-Time Customer Profile needs one of them; CJA alone does not license Profile Service."
4. Rebuild, copy to sow/site and rerun the suites.

## 17. CJA services that need Select or Prime carry no "Needs" tag (medium)

Where: sow/canvas/catalog.json via research sources: C01, C06, BVCJ2, bv-cja; marketo-cja and XB07; CJ02; JC01, XA17, XA10, commerce-cja; OX3; sow/index.html C01 and C06 assumptions

Problem: Some CJA services rely on features CJA Foundation doesn't include:
- Derived fields: C01, C06, BVCJ2.
- Graph-based stitching (Prime): XB07, CJ02.
- More than one event dataset per connection (Select): JC01, XA17, XA10.
- Data Mirror: OX3. Its dwh-cja card says Needs CJA Select, but the OX3 row doesn't.
None of these rows or the SOW names the package.

Fix: 1. Add tiers in the research sources, then rebuild with build.py:
   - C01, C06 and BVCJ2: "CJA Select or higher".
   - The bv-cja derived-field prereq: "(CJA Select, Prime or Ultimate; derived fields are not in CJA Foundation)".
   - marketo-cja and XB07: "CJA Prime or higher (graph-based stitching)".
   - CJ02: "CJA Select or higher for field-based stitching, Prime for graph-based".
   - JC01, XA17 and XA10: "CJA Select or higher (more than one event dataset in a connection)". Also commerce-cja. No tier on ajo-cja.
   - OX3: "CJA Select or higher".
2. Add to the C01 and C06 assumptions in the SOW CATALOG: "The Client has licensed CJA Select, Prime or Ultimate (derived fields are not included in CJA Foundation)."

## 18. Other services gated by a higher package or Fusion purchase carry no "Needs" tag (medium)

Where: Research sources for TG04 (cja_hub.json line 86), AXC05 and aemsites-so, SO1/so-eds, XA07/ajo-target, XA15/commerce-rtcdp, XA21, XA27, XA18 to XA20, XC10 to XC12, AXA02 (aemassets-workfront)

Problem: Several services need a package the card never tags:
- TG04 Recommendations needs Target Premium.
- AXC05 and SO1 deploy fixes, which needs Sites Optimizer Ultimate. CS2 is tagged for the same thing.
- XA07 needs Journey Optimizer Ultimate or the Offer Decisioning add-on.
- XA15 needs Real-Time CDP Prime or Ultimate.
- AXA02 is a Workfront Fusion build, but its connection never mentions Fusion.
Partners can scope these for clients whose license can't support them, with no check or upsell note.

Fix: 1. Add tiers in the research sources:
   - TG04: "Target Premium".
   - aemsites-so, AXC05 and SO1: "Sites Optimizer Ultimate".
   - XA07 and ajo-target: "Journey Optimizer Ultimate or the Offer Decisioning add-on".
   - XA15 only: "Real-Time CDP Prime or Ultimate". Do not tag XA14.
   - XA21, and XA27 where it is Recommendations work: "Target Premium".
   - XA18 to XA20: "Commerce Optimizer".
   - XC10 to XC12: "the CIF add-on".
2. Give AXA02 the ext "Workfront Fusion (part of Workfront Ultimate and of Workflow plus Automation and Integration packages; Prime and Select need it bought separately)".
3. Leave XB01, XB02, XB15, AXE02 and XB12 as they are. Their connection prereqs already state the requirement.
4. Rebuild with build.py and build_site.py, then confirm the SOW prints "Assumes the Client has ..." for each new tag.

## 19. Use starting scope turns off services for boxes still on the canvas (medium)

Where: sow/index.html line 522 (#starting-scope handler); canvas publish()

Problem: Use starting scope only keeps catalog starters and OX lines. On AEM with AEM Assets it switches off all six AEM Assets services ($552,000 drops to $487,200) while the box stays on Build. Search data, Ad platforms, BI tools, Authoring documents and CMS services are lost the same way, and the toast says edits were preserved.

Fix: 1. In canvas publish(), send each line's canvas default as def.
2. Store it in applyHandoff with canvasLine(...,{def:l.def===true}).
3. Change line 522 to row(s).on=s.id.startsWith('CANVAS-')?!!s.def:(STARTERS[state.play].includes(s.id)||OUT_START.includes(s.id)). For hand-overs saved without def, fall back to the canvas defOf rule.
4. Add a test: AEM + AEM Assets and CJA + Search data give the same selection and total after Use starting scope as a fresh hand-over.

## 20. Typing hours one key at a time switches the band and rewrites the scope (medium)

Where: sow/index.html line 501, 'input' handler for Planning hours

Problem: Typed hours are matched to a band on every keystroke. Typing 400 in L01 passes through 40 (Small), so the scope switches to the Small wording and the SOW quotes the Small band. Pasting 400 keeps Typical. The same 400 hours give different signed text depending on how they were entered.

Fix: 1. In the 'input' handler, keep r.hoursEdited=true and the live cost refresh, but remove the BAND_ORDER.find/applyBand block.
2. Move that block into the existing 'change' listener for node.dataset.lineField==='hours', then call renderRows(), renderTotals() and save().

## 21. Removing the last product leaves orphan outside systems and an empty engagement that can still continue (medium)

Where: sow/canvas/template.html removeProduct() line 714 and render() line 498

Problem: On Create your own play, removing the only product leaves outside systems such as CRM and Data warehouse with no lines. The total shows $0, the "Add your first product" prompt stays hidden, and Continue hands over an engagement with no products.

Fix: 1. In removeProduct, after updating st.on: st.out=(st.out||[]).filter(o=>!P[o].outside||CAT.products.some(q=>!q.outside&&st.on.includes(q.id)&&linked(o,q.id)));
2. Leave st.ls alone, so line choices come back if the product and system are added again.
3. At line 498, count only Adobe products: const nP=ps.filter(p=>!p.outside).length; then $('empty').hidden=!(own&&!nP) and $('save').hidden=own?!nP:!ps.length.
4. Rebuild, and add a test: add CJA, add Data warehouse, remove CJA. Expect no nodes, the empty state shown and Continue hidden.

## 22. Outside-system menu and card misstate what a system connects to (medium)

Where: sow/canvas/template.html outMenuHTML line 684, outCardHTML lines 691-694

Problem: On Create your own play, the outside-system card lists every product the system could ever connect to. For example, it says "Real-Time CDP, Journey Optimizer and Customer Journey Analytics" with only CJA on the canvas, and contradicts the focus bar. The menu says "add it first" after a list of several products when any one of them is enough. Systems with two lines say "its line", and an orphan system would read "It connects to ."

Fix: 1. Menu: ": add ${need(id).length>1?'one':'it'} first".
2. Card: build all=play().products.filter(q=>linked(id,q)) and on=CAT.products.filter(q=>!q.outside&&linked(id,q.id)&&has(q.id)).
   - If on has items: "It connects to {on names}. The lightning bolt on ${on.length>1?'each of its lines':'its line'} says how, what your client does first, and the services."
   - On the custom play, if other linked products are off the canvas, add "Add {names} to connect it there too."
   - If on is empty: "It connects to {all names}. Add ${all.length>1?'one of them':'it'} to the canvas to draw its line."
3. Rebuild, then add these tests:
   - CJA plus Data warehouse names only CJA.
   - The AEM play with Search data says "each of its lines".
   - Brand Visibility alone shows "add one first" for Data warehouse, CRM, Ad platforms and Authoring documents.

## 23. Two refine chips say the CDN belongs on the canvas, but Build this leaves it off (medium)

Where: sow/canvas/problems.json slow-reporting chip "My client wants the AI channel included" and cant-see-what-works chip "My client wants AI assistants included as a channel"

Problem: The answer says "the CDN belongs on the canvas", but the setup adds only Brand Visibility. The quote therefore leaves out CDN log forwarding.

Fix: 1. Change both chips' add to ["bv","cdn"].
2. Rerun python3 sow/canvas/build.py and test_canvas.js.
3. Add a test that fails when a chip note says "CDN belongs on the canvas" but the resulting setup has no cdn.

## 24. Change play promises Scope details stay, but the new play's Scope starts blank (medium)

Where: sow/canvas/template.html ASK.change line 873; sow/index.html per-play briefs

Problem: The dialog says "Your rate, size and Scope details stay." After switching play, the SOW title, objective, domains, prompt and market counts, pages and workflows come up blank or at the new play's defaults, because they are saved for each play.

Fix: 1. Change ASK.change to: "One play per statement of work, so this clears the canvas and every service choice and edit. Your rate, size, client and partner details stay. Scope details are kept for each play, so the new play's Scope starts fresh and this play's come back if you return to it."
2. Rebuild with build.py.

## 25. At 1280x800 the Continue button falls below the fold on every play (medium)

Where: sow/canvas/template.html .canvas min-height:560px (line 49) and .total min-width:390px (line 45)

Problem: The fee box wraps onto its own row, the canvas keeps a 560px minimum height, and Continue lands at y 824 to 893 on an 800px screen. The same happens at 1536x864. Open cards also run off the bottom.

Fix: 1. Lower .canvas min-height to about 360px. fit() already scales the stage.
2. Lower .total min-width to about 300px so the fee box shares the first toolbar row.
3. Rebuild and copy to sow/site.
4. Check every play at 1280x800, 1366x768, 1536x864 and 1440x900: the bottom of Continue must be within the window and the page should not scroll.

## 26. Open cards cover the lightning bolts they describe and slice product boxes in half (medium)

Where: sow/canvas/template.html placeCard() lines 597-621

Problem: In focus view, a product's card hides most of its own bolts: Real-Time CDP 7 of 9, Journey Optimizer 7 of 11, at 1440 and even 1920. Outside-system cards cover their only bolt, and on a 768 tablet connection cards cut boxes to "mer Journey / nalytics". The partner has to close the card to reach the bolts.

Fix: 1. In focus view, make the first click on a product only draw its lines and fill the focus bar. Open the card on a second click or from a Services button in the bar.
2. When a card opens:
   - Reject any spot that covers the anchor box or a bolt of the selected product.
   - Try more spots: above and below the box, the far edges and corners of the canvas, and the bottom.
   - Count any partial overlap of a box as covering the whole box.
   - Cap the card's height and let it scroll inside.
   - If no spot is clean, dock the card full width at the bottom and scroll the stage so the anchor bolt stays visible.
3. Apply the same logic to the fixed-play fallback, replacing left=Math.max(10,...).
4. Replace "i dots" with "lightning bolts" in the code comment and in canvas/README.md.
5. Add a test at 1440x900, 1600x950 and 768: elementFromPoint hits each anchor bolt after its card opens.

## 27. Tags in the Add outside system menu are cut off at the menu edge (medium)

Where: sow/canvas/template.html .it2 line 161, .ctag line 164, @media max-width:360px line 226

Problem: Long tags such as "Connects to Real-Time CDP, Journey Optimizer and CJA: add it first" run past the menu and are clipped at 1440. On phones (390 to 430px) several tags and system lists are cut and the menu scrolls sideways.

Fix: 1. Set .it2 to grid-template-columns:minmax(0,1fr) auto.
2. Set .ctag to white-space:normal;max-width:100%.
3. Add @media (max-width:540px){#out-menu .it2{grid-template-columns:minmax(0,1fr)} #out-menu .it2 .ctag{justify-self:start;margin-top:2px}} and let .nm wrap.
4. Rebuild.
5. Check at 360, 390, 412, 430, 768 and 1440 that #out-menu scrollWidth equals clientWidth.

## 28. In focus view two outside systems' names are printed over the OUTSIDE ADOBE label (medium)

Where: sow/canvas/catalog_map.json names for Authoring documents and Website on another CMS; .node.out CSS in template.html

Problem: "Authoring documents" and "Website on another CMS" wrap to two lines in the fixed 66px box, so the name overlaps the OUTSIDE ADOBE label and the icon is pushed to the edge.

Fix: 1. Give the two systems shorter canvas names in catalog_map.json, "Authoring docs" and "Other CMS site", and keep the full names as card titles.
2. Rebuild with build.py.
3. Check Create your own play with 10 or more connections at 1280 and 1440: every outside box's name starts at or below 24px from the box top, and scrollHeight is 66px or less.

## 29. Canvas and SOW text cite internal line IDs partners never see, and three reach the SOW (low)

Where: aem_sites_assets.json line 581 (SI02); connection_types.json 1151 (AXD04), 2034 and 2074 (XA14), 2117 (XA20), 3624 (XA14 scope); audit_types.py lines 133, 268 and audit_classification_2026-10-31.json

Problem: Cards say "(SI02)", "(AXD04)" and "priced only as XA14 on the Commerce + Real-Time CDP card", and "XA20: IMS org ID ...". The tool shows only service names, so partners can't resolve these. Three of them print in the client's SOW, including a partner pricing note.

Fix: 1. Canvas-only text:
   - Line 581: "take the Site build with components and templates service out on the AEM Sites card".
   - Line 1151: "(the AEM publish and Edge Delivery on one domain service, under More services on this card)".
2. Prereqs (2034, 2074, 2117): make them plain client prerequisites:
   - "Data Connection extension configured and Commerce events confirmed at the Experience Platform edge"
   - "Data Connection extension sending Commerce data to Experience Platform datasets"
   - "IMS org ID and datastream ID in the storefront configuration"
   Move the pricing pointers into each card's how text, for example "The Data Connection setup is priced once, as Commerce Data Connection to Platform on the Adobe Commerce + Real-Time CDP card."
3. XA14 scope: "For an Edge Delivery storefront, storefront events reach Experience Platform through the storefront's own settings (the Storefront events to Experience Platform service, where included); confirm how back office and profile data flow for the deployment."
4. Make the same changes in audit_types.py and the classification file, edit connection_types.json in place, and rebuild.
5. Add a build check that fails if shown text matches any CAT.lines key.

## 30. Coworker cards say the B2B editions themselves are "coming soon" (low)

Where: sow/canvas/research/connection_types.json lines 361, 2364, 2367, 2428, 2431; sow/canvas/audit_types.py AVAIL lines 42, 66, 67

Problem: Coworker cards and the SOW for XA25/XA26 say "the CJA B2B edition is coming soon" and "Real-Time CDP B2C Edition (B2B Edition coming soon)". The B2B editions ship today. What is coming soon is Coworker support for them.

Fix: 1. Edit in place:
   - Line 361: "...Coworker support for the CJA B2B edition is coming soon."
   - Lines 2364 and 2428: "...the in-product panel and Coworker support for the B2B edition are coming soon."
   - Line 2367: "Real-Time CDP B2C Edition (Coworker support for the B2B Edition is coming soon)"
   - Line 2431: the same for Journey Optimizer.
2. Mirror the text in audit_types.py AVAIL. Do not rerun audit_types.py, because that reverts the step 45 and 46 edits.
3. Rebuild with build.py and build_site.py, and confirm grep finds none of the old phrases.

## 31. Brand written "Aem.live" on the Journey Optimizer + Edge Delivery card (low)

Where: sow/canvas/research/connection_types.json line 2261 (ajo-eds label); template.html bpVoice line 784; audit_types.py WORDING['ajo-eds']

Problem: The card reads "Aem.live martech plugin lets ..." while the problem box (patched by bpVoice) and the rest of the tool write aem.live.

Fix: 1. Set the label to "The aem.live martech plugin lets Journey Optimizer web campaigns change Edge Delivery pages".
2. Remove .replace(/^Aem\.live\b/,'The aem.live') from bpVoice.
3. Add the same label override to WORDING['ajo-eds'] in audit_types.py.
4. Rebuild with build.py and build_site.py, then run the canvas, problems and site tests.

## 32. XA20 scope is a run-on sentence and calls the client "the merchant" (low)

Where: connection_types.json line 3635; audit_types.py LINE_EDITS line 271

Problem: The SOW prints "Add the organization and datastream to the storefront configuration connect the merchant's consent management platform ...". A comma is missing, and "the merchant" is a third name for the party.

Fix: 1. In audit_types.py line 271, make the old string " and check that product, cart and purchase events reach the Edge Network." and the new one ", connect your client's consent management platform (the boilerplate denies consent by default), and check that product, cart and purchase events reach the Edge Network."
2. Edit connection_types.json line 3635 to match.
3. Run build.py and build_site.py.

## 33. Services point to sections and services the SOW doesn't have (low)

Where: sow/index.html CATALOG A03, OX1, SO2, X01 exclusions and C02 assumptions; test_review_nov2.js lines 706, 708

Problem: The SOW says:
- "hypercare period stated in Included work", but no such heading exists.
- "(see Log export from another CDN or log store)", a service absent from every default SOW.
- "(see the content program)", which doesn't exist.
- "Ongoing program management (see the monthly services)", though no monthly service covers it.
- "excluded from this unit", a leftover term.

Fix: 1. A03: "...support beyond the hypercare period in this service's scope."
2. OX1: "...or logs kept elsewhere (a separate service)."
3. SO2: "new content creation (a separate service)".
4. X01: "Ongoing program management and work outside the agreed engagement."
5. C02: "...excluded from this pilot."
6. Add the old texts to PRIOR47 and to the known list at line 273.
7. Update the assertions in test_review_nov2.js.
8. Run build_site.py.

## 34. Partner-added services print "Confirm access ..." as an assumption, and old drafts keep "Customer confirms" (low)

Where: sow/index.html lines 526-527 (own and custom service forms), normalize line 236, known list line 273

Problem: Every partner-defined service prints the instruction "Confirm access, approved inputs and review responsibilities." in the SOW. Drafts saved before step 46 still print "Customer confirms the agreed deliverable meets the documented scope."

Fix: 1. In both forms, set the default assumptions to 'Client and partner agree access, inputs and review responsibilities.'
2. In normalize, map the untouched old defaults on the service record:
   - acceptance 'Customer confirms the agreed deliverable meets the documented scope.' to 'Client confirms the agreed deliverable meets the documented scope.'
   - assumptions 'Confirm access, approved inputs and review responsibilities.' and 'Customer and partner agree access, inputs and review responsibilities.' to the new default.
3. Add an OLD_OWN list to the known list at line 273 for custom lines, so untouched saved lines upgrade without a false "Scope edited" flag.
4. Add a test_step46.js check with a step 45 draft.

## 35. Estate placeholder teaches partners to write "Your client" into the SOW (low)

Where: sow/index.html line 33 (Client estate field); sow/sweep46_decisions.json c0200

Problem: The example "Your client owns 100 domains ..." prints word for word in the SOW under "Client estate, for context". The label "Context only" doesn't say it prints.

Fix: 1. Set the placeholder to "e.g. The Client owns 100 domains; this engagement covers the two listed above."
2. Change the label to "Context only, printed in the SOW".
3. Correct c0200 to "The Client".
4. Run build_site.py.
5. Add a test that no placeholder on an SOW-printed field matches /your client/i.

## 36. Services-step stage outcomes say "the Client" though they speak to the partner and never print (low)

Where: sow/index.html lines 440, 446, 449 (outcome()); sweep c0262 to c0264

Problem: The sweep changed these outcomes to "the Client" on the false belief that they print in the SOW. They appear only on the Services step, which speaks to the partner as "your client".

Fix: 1. Line 440: "Outcome: the integrations and builds live and verified with your client."
2. Line 449: "the agreed setup work accepted by your client".
3. Line 446: follow OX1, as in the CDN log job item.
4. Correct c0262 to c0264 and CHANGES.md to "Services-step stage outcome shown to the partner (not printed)".
5. Run build_site.py.

## 37. Grammar slip in the YouTube Small band scope (low)

Where: sow/index.html CATALOG O08.bands.small.scope

Problem: The SOW prints "Align one existing video that appear in the AI answers ...".

Fix: 1. Change it to "that appears".
2. Add const PRIOR47={"O08":{"scope":[<current Small text verbatim>]}} and add ...(PRIOR47[baseId(c)]?.[key]||[]) after PRIOR46 in the known list. Saved lines then upgrade and keep following the bands.
3. Run build_site.py.

## 38. Product box says "Services on its connections" after the partner removes all its services (low)

Where: sow/canvas/template.html countsUI() line 566

Problem: With every Coworker service removed on Coworker on its own, the box claims its services sit on connections, though that play has none.

Fix: 1. Change to e.textContent = k ? count(k,'service') : (all(o).length ? count(0,'service') : 'Services on its connections');
2. Rebuild and run test_canvas.js.

## 39. Focus view hint says to click a lightning bolt when none is drawn (low)

Where: sow/canvas/template.html hintUI() lines 573-574 and refocus() line 533

Problem: With 10 or more connections and no product selected, no bolts are drawn, yet the bottom hint says "Click a lightning bolt to see how the two products integrate."

Fix: 1. In hintUI(), show no hint when fv()&&!fsel. The focus bar already says to click a product.
2. Otherwise keep the lightning bolt text.
3. Call hintUI() at the end of refocus() so the hint updates when a product is selected or cleared.

## 40. Opening the SOW steps directly, then Build and picking the same play, wipes the partner's work (low)

Where: sow/index.html line 589 (Build click handler); applyHandoff fresh handling

Problem: An engagement started at sow/index.html?play=aem has handoffAt 0, so Build shows the play picker. Picking AEM is treated as a fresh pick, which resets edited hours and turns off own services ($489,600 drops to $487,200).

Fix: 1. Steps-row Build tab: call syncCanvas(true) when canvasPlay()!==state.play and either handoffAt>0 or the saved engagement differs from normalize(blank()) for that play.
2. Keep "Change play" showing the picker. In applyHandoff, skip the fresh wipes when h.play===state.play, handoffAt===0 and the engagement has work.
3. Add a test with the repro: L01 stays 70, the own service stays on, and the total stays $489,600.

## 41. Markets monitored does nothing unless a prompt count is entered (low)

Where: sow/index.html monitoringBand line 218, monitoringOver line 220, promptSummary line 406

Problem: The hint says two or three markets set Typical, four to six set Large and above six ask for a reason. With the prompt count blank, entering 4 or 7 markets changes nothing, and the SOW still says "up to three markets".

Fix: 1. monitoringBand: const n=intOf(c.promptCount),mk=intOf(c.marketCount);if(!n&&!mk)return null;const m=mk||1;return BAND_ORDER[Math.max(n?BAND_ORDER.indexOf(promptBand(n)):0,BAND_ORDER.indexOf(marketBand(m)))];
2. monitoringOver: return (!!n&&n>PROMPT_CAP)||m>MARKET_CAP;
3. Give promptSummary a markets-only summary.
4. Run check.py, copy to sow/site and rerun the tests.

## 42. SOW fee table splits service names mid-word on phones (low)

Where: sow/index.html .sow-document td{overflow-wrap:anywhere} (line 19) and @media(max-width:760px) (line 20); fee table built at line 142

Problem: At 390px the Service column shrinks to about 60px. Names break inside words ("measure/ment") and run 5 to 7 lines, in the preview and in the downloaded SOW.

Fix: 1. In the max-width:760px block, stack the fee rows: tr as display:grid;grid-template-columns:1fr auto, the first td full width with overflow-wrap:break-word, and a visually hidden thead.
2. Add data-label spans for cadence and hours x rate at line 142.
3. Leave print rules unchanged.
4. Check at 390px that .sow-fee-wrap scrollWidth equals clientWidth, in the preview and the downloaded file.

## 43. Recommended tag on the CDN box covers the CDN and Brand Visibility bolt (low)

Where: sow/canvas/template.html .node .rec (line 222) and placeDots near() (lines 470-485)

Problem: Bolt placement ignores the Recommended pill hanging 12px below a box, so on a crowded custom play the CDN to Brand Visibility bolt lands under it.

Fix: 1. In near(), extend the bottom bound of any box where recd(p.id) is true by about 14px, and use it in every branch including the short-line fallback.
2. Rerun the midB layout at 1440, 1280 and 768 and confirm no overlaps.

## 44. Warehouse into CJA card hides Adobe's Limited Availability conflict for Data Mirror (low)

Where: sow/canvas/research/connection_types.json line 3429 (dwh-cja availability)

Problem: The card states only the license gate. Adobe's Data Mirror pages call it a limited release for CJA, while the release notes say it is generally available, and the tool flags such conflicts elsewhere.

Fix: 1. Set availability to: "Adobe's pages conflict: the Data Mirror pages call it a limited release for CJA users, depending on license and feature enablement, while CJA's 2026 release notes list it generally available from June 17, 2026. Needs CJA Select, Prime or Ultimate (not in CJA Foundation); confirm enablement with the Adobe account team."
2. Rebuild with build.py and run test_canvas.js.

## 45. C01 assumption claims the AI-agent dataset "reaches CJA only", which Adobe doesn't state (low)

Where: sow/index.html CATALOG C01 assumptions

Problem: A signed SOW assumption makes a product claim that the live check could not find on Adobe's pages.

Fix: 1. Replace the parenthesis with: "(Brand Visibility's AI-agent data reaches CJA as an Experience Platform dataset through the Adobe Brand Visibility source, which the Client adds to a CJA connection and data view; Adobe Analytics can feed only Brand Visibility's referral reporting on the Business Impact tab)".
2. Run check.py and copy the page to sow/site.

## Disproved by the skeptics

- wording-sow: SOW coverage prints the tool's band mechanics next to the prompt count
- facts: Implement Brand Concierge (F02) sets up live chat and meeting booking through Adobe Marketo Qualifier, a separately licensed product, with no Also needs tag
