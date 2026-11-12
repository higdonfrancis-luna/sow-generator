# Step 86: the catalog reads as though everything is available (Nov 12 2026)

Adam: "Anything that is in beta or early access or will be released on this day or next next day leave those alone they're going to come OK just leave them alone ... publish every connection every feature every functionality as though it's available and don't provide any caveats." Asked whether sentences like "where Adobe has enabled that feature" and "once Adobe confirms in writing" should go too: "why would we write that I would strip those and go".

The rule is now item 12 under "How to work with Adam" in `CLAUDE.md`.

## What went and what stayed

**Went:** wording that a feature's availability is not stated, uncertain or to be confirmed with Adobe; work made conditional on Adobe enabling or granting something; release stages and programs and their paraphrases (Legacy, co-innovation, Try Before You Buy), and "Generally available."; Adobe's note on the industries Coworker is not offered to; "Adobe documents ..." framing.

**Stayed:** licenses, packages and add-ons the client must own; technical prerequisites; real limits of a product (row limits, HIPAA statements, one-way syncs); the partner's and the client's own project work, including "confirm" where it is the two of them agreeing something.

## What changed

- **145 connections**, **17 researched services**, **22 play services** (27 texts) and **2 notes** under the first page's client problems. The whole text of every changed field, before and after, is `rewrites.json` in this folder.
- 66 connections now have no availability line at all; 85 keep a short factual one.
- A connection with no availability prints no "Availability:" sentence in the statement of work. Before, it printed "Availability: not stated by Adobe."
- The statement of work page no longer asks for Adobe's written confirmation: the "Before you issue" rule for Coworker services on the FSI play, the same rule for Real-Time CDP context in conversations, and those words in Implement Brand Concierge are removed (`sow/patch_step86.py`).
- A saved draft that holds an old play-service text opens with today's text and is not shown as edited.

## How it was done

1. The partner- and client-facing text of all 150 connections, 475 researched services and 44 play services was split into 39 batches. One agent rewrote each batch; a second checked every rewrite against the batch (lost license? leftover caveat? new fact? right voice?).
2. A script combined the results into whole-field before and after pairs and scanned the result for leftover caveat words.
3. The 16 older test suites that expected the old wording or counts were updated, one agent a suite, and each update was reviewed by another agent who also read the built text again.
4. That review found places where the sweep cut too much or left a fragment. Those 23 corrections are below and under `second_look` in `rewrites.json`.

## Left as they were, on purpose

- `XH07`: A request the partner raises with Adobe is a step of the work, not a caveat, so the sentence stays.
- `XG07`: A request the partner raises with Adobe is a step of the work, not a caveat, so the sentence stays.
- `XL09`: A request the partner raises with Adobe is a step of the work, not a caveat, so the sentence stays.
- `bv-cja license line`: The license line names what the client must own; it is not a caveat, and other rules and checks name it by its text.

## Corrections after the review

| Where | Was | Now | Why |
|---|---|---|---|
| `cw-cja` sowAvailability | The Client confirms Coworker Chat access in its workspace and the supported product edition before this service starts. | (emptied) | a leftover caveat: the card has no availability line and the statement of work should not either |
| `aemsites-target` availability | The stated deployment and activity restrictions apply. | (emptied) | what was left after the caveat came out was a fragment that pointed at nothing |
| `aemsites-so` availability | Confirm the authoring route first. | (emptied) | what was left after the caveat came out was a fragment that pointed at nothing |
| `rtcdp-bc` label | Concierge events reach Experience Platform; profile context in replies | Concierge events reach Experience Platform; replies can use profile context | the second half had lost its verb |
| `dwh-cja` availability | Data Mirror requires CJA Select, Prime or Ultimate (not CJA Foundation) and the appropriate license. | Data Mirror requires CJA Select, Prime or Ultimate (not CJA Foundation) and the appropriate Data Mirror license. | names the license, as the statement of work line does |
| `commerce-aemsites` availability | Needs the CIF add-on. | (emptied) | it only repeated the package tag and the first prerequisite |
| `commerce-aemsites` sowAvailability | Needs the CIF add-on. | (emptied) | it only repeated the package tag and the first prerequisite |
| `express-ajob2b` availability | The Express editing features come with all Journey Optimizer B2B Edition subscriptions. | (emptied) | read as if the full editor needed no license, against the first prerequisite |
| `workfront-cw` prereqs | CX Enterprise Coworker license; Adobe's support or professional services team configures Coworker, its Adobe app integrations and its governance and a | CX Enterprise Coworker license for your client's organization; Adobe's support or professional services team configures Coworker, its Adobe app integrations and its gover | keeps the license apart from Adobe's own set-up work in the RFI Builder's note (its rule needs the license part to be a full phrase) |
| `workfront-cw` sowPrereqs | CX Enterprise Coworker license; Adobe's support or professional services team configures Coworker, its Adobe app integrations and its governance and a | CX Enterprise Coworker license for the Client's organization; Adobe's support or professional services team configures Coworker, its Adobe app integrations and its govern | keeps the license apart from Adobe's own set-up work in the RFI Builder's note (its rule needs the license part to be a full phrase) |
| `target-eds` prereqs | at.js route, also on aem.live: Target client code and IMS org ID | The at.js route, also on aem.live: Target client code and IMS org ID | a client's response capitalized the library's name when the line began with it |
| `target-eds` sowPrereqs | at.js route, also on aem.live: Target client code and IMS org ID | The at.js route, also on aem.live: Target client code and IMS org ID | a client's response capitalized the library's name when the line began with it |
| `ajob2b-aemassets` prereqs | (removed) | One Experience Manager repository | a real limit of the product, which stays; only the "confirm with Adobe" half was a caveat |
| `ajob2b-aemassets` sowPrereqs | (removed) | One Experience Manager repository | a real limit of the product, which stays; only the "confirm with Adobe" half was a caveat |
| `aemsites-workfront` prereqs | The configured plugin, plus two Workfront task custom forms | Two Workfront task custom forms | the service itself sets the extension up, so the client is not asked to bring it |
| `aa-eds` sowPrereqs | The aem-martech plugin is installed in the code repository of the Client's Edge Delivery site | Access to the code repository of the Client's Edge Delivery site, where the aem-martech plugin is installed | the service installs the plugin, so the prerequisite is access to the repository |
| `aemsites-cw` prereqs | AEM agent access through the Agentic SKU | AEM agent access through a trial or the Agentic SKU | a trial is one of the two ways to AEM agent access; only the program name was a release label |
| `aemsites-cw` sowPrereqs | AEM agent access through the Agentic SKU | AEM agent access through a trial or the Agentic SKU | a trial is one of the two ways to AEM agent access; only the program name was a release label |
| `aemsites-cw` availability | AEM agents come through the Agentic SKU. | AEM agents come through a trial or the Agentic SKU. | a trial is one of the two ways to AEM agent access; only the program name was a release label |
| `aemassets-cw` prereqs | AEM Assets as a Cloud Service, plus AEM agent access (the Agentic SKU) | AEM Assets as a Cloud Service, plus AEM agent access (a trial or the Agentic SKU) | a trial is one of the two ways to AEM agent access; only the program name was a release label |
| `aemassets-cw` sowPrereqs | AEM Assets as a Cloud Service, plus AEM agent access (the Agentic SKU) | AEM Assets as a Cloud Service, plus AEM agent access (a trial or the Agentic SKU) | a trial is one of the two ways to AEM agent access; only the program name was a release label |
| `aemassets-cw` availability | AEM agents come through the Agentic SKU. | AEM agents come through a trial or the Agentic SKU. | a trial is one of the two ways to AEM agent access; only the program name was a release label |
| `F02` assumptions | (for live chat). | (for live chat). A handoff to another chat or contact-center platform is not part of this service. | a real limit of the product, which stays; only the "confirm with Adobe" half was a caveat |

## Flagged for Adam, not changed

- **The RFI Builder's note still has a "Confirm with Adobe" list.** With the cautions gone it mostly holds Adobe's own set-up work ("Adobe's onboarding team configures Coworker") and three leftover tips. Recommended: rename it (for example "Adobe's part") or drop it.
- **The RFI knowledge base** (`sow/rfp_facts.json`) still carries a few notes like "Confirm with Adobe which platforms your client's edition covers". They sit beside hosting and compliance facts, so they were not touched. Recommended: strip the feature-availability ones.
- **Journey Optimizer + Brand Concierge** has no services, so the RFI Builder says "Experience League lists no services for" the pair.
- **Requests Adobe has to act on.** Three service steps that say "raise the request with Adobe" were kept as work. Three prerequisites of the same kind were stripped as caveats (Target Customer Care enabling fragment export, A4T provisioning, the Analytics data source for Journey Optimizer). Adam can have them all one way or the other.
- **Coworker and banks.** Nothing now tells a partner that Adobe's Workfront page excludes health care and finance from Coworker in Workfront. That follows the rule.
- Older than this step, seen by the reviewers: an internal id shown in one prerequisite ("see marketo-rtcdp" on Journey Optimizer B2B Edition + Marketo Engage); "your client" in a few statement of work prerequisite lists; a Magento Open Source question is answered as Adobe Commerce.

## Files

- `sow/canvas/data_step86.py`: files the rewrites where the build reads them (`sow/plain_rules.json` for connections and researched services, applied last by `product_copy.plain()`; the play services in `sow/index.html` with a replacement pair each in `product_copy_rules.json`; `canvas/problems.json`).
- `sow/canvas/patch_step86.py` and `sow/patch_step86.py`: no Availability sentence where there is none, and no rule that asks for Adobe's written confirmation.
- `node sow/test_step86.js` (20 checks).
