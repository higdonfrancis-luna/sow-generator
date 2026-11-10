# Wave 4: Adobe Marketo Optimizer (`moptimizer`), service-level research trail

Checked Nov 10 2026. Data file: `marketo_optimizer.json` in this folder. Research only: nothing in the tool changed,
nothing committed, no build script or test run.

## Read this first: two lifecycle questions for Adam

**1. Adobe's guide calls the current release of the whole product a Beta release.** The word is on 11 of the guide's 58
pages, and the guide names an upcoming General Availability release. At the same time Adobe publishes a product
description for it with a license metric (per 1,000 profiles, last updated 8 September 2026), which is what Adobe does
for products it sells.

- "For the Beta release of Marketo Optimizer, the following default personas are defined according to the job title
  attribute:" (Derived personas page)
- "In the upcoming General Availability release, you can edit any of these default personas according to the needs of
  your organization." (same page)
- "Marketo Optimizer supports two of the three subdomain delegation methods in this Beta release." (Email
  deliverability page)
- "Dedicated IP pools are not available at Beta." (same page)
- "Adobe Marketo Optimizer includes up to 5 Sandboxes, unless licensed separately by Customer." (product description
  on helpx.adobe.com)

No card field in the JSON repeats the label, and every service rests only on what Adobe documents as working today
(18 things are left out, listed below). The question is whether the product goes into the tool at all while Adobe's own
guide says Beta.

**2. Scoring Studio sits under "Labs".** The home page lists it under the Labs work area ("Labs Scoring Studio" in the
navigation table), and the permissions page describes Labs as features that are enabled and configured separately. It
is the feature that writes scores back to Marketo Engage. It is left out; the person engagement score, which is not
under Labs, is in MO04.

Recommendations are under "Open questions for Adam" at the end.

## Summary

| | Count |
|---|---|
| Product | 1: Marketo Optimizer (`moptimizer`) |
| Product services | 13: MO01 to MO13 (7 starting, 6 optional) |
| Connections | 3: `moptimizer-marketo`, `moptimizer-cw`, `moptimizer-ads` |
| Connection services | 8: XQ01 to XQ08 (6 starting, 2 optional) |
| Pairs checked with no documented setup | 7 (4 from the brief's list, 3 noted because the pages name them) |
| Left out | 18 |
| Quote check | 73 found on their pages, 0 not found, 0 on pages this session cannot read |

### Product services

| Id | Service | Unit | Low / base / high | Starts on |
|---|---|---|---|---|
| MO01 | Access, roles and sandbox permissions | one-time | 16 / 24 / 48 | yes |
| MO02 | Email sending setup and channel configurations | one-time | 24 / 40 / 72 | yes |
| MO03 | Program types, folders and tokens | one-time | 16 / 32 / 56 | yes |
| MO04 | People lists, personas and engagement scoring | one-time | 24 / 40 / 72 | yes |
| MO05 | First person journeys | one-time | 60 / 100 / 180 | yes |
| MO06 | Email templates, fragments and content rules | one-time | 32 / 56 / 100 | yes |
| MO07 | AI path decisions and journey traffic control | one-time | 24 / 40 / 72 | optional |
| MO08 | Landing pages and forms | one-time | 32 / 56 / 96 | optional |
| MO09 | WhatsApp channel (needs the WhatsApp entitlement; also needs a WhatsApp Business Account with Meta) | one-time | 24 / 40 / 64 | optional |
| MO10 | Message frequency and quiet hours rules | one-time | 8 / 16 / 32 | optional |
| MO11 | Send-time optimization and conditional content | one-time | 16 / 32 / 56 | optional |
| MO12 | Team training and handover | one-time | 16 / 24 / 40 | yes |
| MO13 | Monthly journey and audience reviews | monthly | 16 / 24 / 40 | optional |

Hours are our own estimates for a mid-market client, set on the scale of the Journey Optimizer B2B Edition lines already
in the tool (JB02 24 / 48 / 80, JB04 60 / 100 / 180, JB05 16 / 32 / 56, JB06 16 / 24 / 40). Adobe publishes none.

### Connections and their services

| Connection | Kind | Service | Low / base / high | Starts on |
|---|---|---|---|---|
| `moptimizer-marketo` | native | XQ01 Marketo Engage smart lists adapted into people lists | 16 / 32 / 64 | yes |
| | | XQ02 Journeys triggered by and acting on Marketo Engage | 24 / 40 / 72 | yes |
| | | XQ03 Program inventory and move plan from Marketo Engage | 16 / 32 / 60 | optional |
| `moptimizer-cw` | native | XQ04 Coworker access and skills rollout in Marketo Optimizer | 16 / 24 / 40 | yes |
| | | XQ05 Campaign brief template and programs built by Coworker | 16 / 32 / 56 | yes |
| | | XQ06 Custom Coworker skills for your client's processes | 16 / 32 / 64 | optional |
| `moptimizer-ads` | native | XQ07 Ad platform destinations and permissions | 8 / 16 / 32 | yes |
| | | XQ08 Audience activation from lists and journeys | 16 / 24 / 48 | yes |

## How Marketo Optimizer relates to Journey Optimizer B2B Edition

Written as its own product, as the brief asks. What Adobe's public pages say, word for word:

1. **The setup checklist names a Journey Optimizer B2B Edition product profile.** "When provisioning is complete and
   sandboxes are bound, configure Journey Optimizer B2B Edition access for your team and users." and "Create a Journey
   Optimizer B2B Edition product profile in the Admin Console (one-time/initial setup only)" (Setup checklist).
2. **The page that checklist links to calls the same step a Marketo Optimizer product profile.** "Create a Marketo
   Optimizer product profile in the Admin Console (one-time/initial setup only)." and, in the list of profiles to
   assign, "Adobe Marketo Optimizer - Access" (User access and permissions). So the checklist wording looks like text
   carried over from the Journey Optimizer B2B Edition guide, and the instructions a partner follows say Marketo
   Optimizer.
3. **Adobe calls the two products tiers of one capability in one place.** "Journey traffic control works the same way
   for both Journey Optimizer B2B Edition and Marketo Optimizer. The capability and logic are identical; only minor UI
   differences exist between tiers." (Journey traffic control).
4. **The permissions are Experience Platform permissions under B2B names** (B2B Programs, B2B Journeys, B2B Person
   Lists, B2B Destinations and so on), the same family Journey Optimizer B2B Edition uses. The engagement score page
   links to the Journey Optimizer B2B Edition guide for background on weighting, and the landing page configuration
   page still says "leverage it through Journey Optimizer B2B Edition".
5. **The product description defines the product in the words Adobe uses for Journey Optimizer B2B Edition** ("a B2B
   customer journey orchestration application") and one definition still says "the technical boundaries of Journey
   Optimizer".

What is different, and why it is a separate product in the tool:

- **It is provisioned on a Marketo Engage instance.** "There can be only one Marketo Engage instance as the data source
  and it is preconfigured at time of provisioning of your Marketo Optimizer instance." The sandbox is named after the
  Marketo Engage subscription: "Marketo Optimizer access requires that you enable a specific sandbox that is provisioned
  using the following naming convention: Mktoaep + Marketo Engage subscription prefix."
- **Its journeys are person journeys on people lists** ("person journeys are automated, multistep lead-based marketing
  plans"), where the Journey Optimizer B2B Edition lines in the tool are about B2B schemas, buying groups and account
  journeys.
- **Coworker chat is the front door.** The home page opens on "Ask a question or start a task".
- **It has its own product description and license metric**, separate from the Journey Optimizer B2B Edition one.

Neither guide describes data moving between the two products or a setup that joins them, so there is no
`moptimizer-ajob2b` connection (listed under `not_documented`).

## What a client must have first

| Need | Adobe's words | Page |
|---|---|---|
| A Marketo Engage subscription | "Customer's scoping parameters shall be based upon the Customer's purchase of Marketo Engage." and "There can be only one Marketo Engage instance as the data source and it is preconfigured at time of provisioning of your Marketo Optimizer instance." | Product description; Listen for an event nodes |
| Experience Platform, as the place permissions and sandboxes live. Adobe does not say the client buys it separately: the product description lists sandboxes as part of the product and calls Marketo Optimizer one of the "Adobe Experience Platform-based Products and Services". | "Add users or groups to roles in Adobe Experience Platform." and "Adobe Marketo Optimizer includes up to 5 Sandboxes, unless licensed separately by Customer." | User access and permissions; product description |
| The sandbox Adobe provisions, bound before setup starts and added to every role | "After provisioning is complete and sandboxes are bound, complete the following steps to provide Marketo Optimizer access for your team and users." and "Add this sandbox to every role." | User access and permissions |
| A system administrator | "You must be a system administrator to see the Permissions tile in Experience Platform." | User access and permissions |
| A sending subdomain of its own | "Each subdomain in Marketo Optimizer can only be used by one Adobe product." | Email deliverability |
| No need for HIPAA compliance | "Adobe Marketo Optimizer is not HIPAA compliant and not HIPAA-ready" | WhatsApp channel configuration |

Not stated on any public page read: whether Real-Time CDP is needed (the guide never names it), and whether a client
can buy Marketo Optimizer without already holding Marketo Engage. The product description ties scoping to the Marketo
Engage purchase, and every page assumes a connected Marketo Engage instance, so the product's first prerequisite is
written as a Marketo Engage subscription.

## Overlap with the existing `ajob2b` services (none copied)

| Existing line | What it covers | Why the Marketo Optimizer line is not a copy |
|---|---|---|
| JB01 B2B schemas, XDM fields and events | Generating B2B namespaces and schemas, choosing XDM fields | No Marketo Optimizer line: the guide documents no schema work. The data source is set by Adobe at provisioning. |
| JB02 Email domains and deliverability setup | Tracking CNAMEs, branding domains, DKIM, SPF, DMARC and MX records in the attached Marketo Engage instance | MO02 is a different mechanism: a subdomain delegated to Adobe (fully delegated or CNAME), an IP pool and email channel configurations inside Marketo Optimizer. Adobe says the subdomain cannot be one Marketo Engage already uses. Same subject, different work. |
| JB03 Buying groups and solution interests | Buying groups and role templates | No Marketo Optimizer line: the guide has no buying group pages. |
| JB04 First account journeys and email content | Account journeys | MO05 is person journeys on people lists; MO06 is the email templates and fragments. |
| JB05 User roles, access and team enablement | Product profile, user groups, B2B roles | MO01 is the nearest overlap: the same Admin Console and Permissions steps, with the Marketo Optimizer sandbox and Adobe's three suggested user types. A client with both products would do the Admin Console part once. Flagged for the build: if both products are on one canvas, these two lines overlap in part. |
| JB06 Monthly buying group and journey reviews | Intelligent Dashboard, buying group refresh | MO13 reviews person journeys, lists and traffic control decisions. |
| XH05, XH06 (`ajob2b-marketo`) | A Marketo Engage connection the partner creates for journey actions | `moptimizer-marketo` is not created by the partner: Adobe sets it at provisioning. XQ01 to XQ03 cover adapting lists, building triggers and actions, and the move plan. |
| XH09 (`ajob2b-ads` through Real-Time CDP) | External audiences sent through Experience Platform destinations, needs Real-Time CDP B2B Edition | XQ07 and XQ08 use Marketo Optimizer's own three destinations and need no Real-Time CDP tier. |
| XB10 (`marketo-cw`) | Coworker for Marketo Engage rollout | XQ04 is the rollout inside Marketo Optimizer, with its own permission and skill list. Adobe says the skills are product-scoped: "A few skills are Marketo Engage-only and a couple work in both products (lead import, product knowledge)." |

## How this was researched

- Read `BRIEF.md` in this folder and the briefs it names, `wave3_documents.json` and `wave3/documents.md` for the shape.
- Downloaded the guide with plain `curl -sS -L -m 45` (no browser User-Agent): the overview, the 27 pages it links, and
  every further guide page those pages link, 58 in all. Stripped the tags and read the text. The long design reference
  pages (content components, structure components, custom CSS, form design, landing page design, dark mode, fragment
  authoring, template creation, wait and split nodes, the permissions reference) were read for labels, limits and
  product names and skimmed for the rest.
- Searched all 58 pages by script for other products: Salesforce, Dynamics, CRM, Marketo Measure, Bizible, attribution,
  Real-Time CDP (0 pages each); Sales Qualifier, Marketo Qualifier, Brand Concierge, Experience Manager, Adobe Express
  (found, see `not_documented` and `left_out`).
- Searched all 58 pages by script for lifecycle words (Beta, not yet, planned, future release, roadmap, Coming soon,
  Labs, General Availability). Every hit is either under `left_out` or is the product-wide label in question 1.
- Read outside the guide: the Marketo Optimizer product description and the Journey Optimizer B2B Edition product
  description on helpx.adobe.com; the Journey Optimizer B2B Edition guide overview, release notes, get started page,
  journey traffic control page and engagement score weighting page; the Marketo Qualifier home, integrations and getting
  started pages; the Marketo Engage guide home, current release notes and Coworker for Marketo Engage overview; the
  Marketo Measure guide home; the Coworker guide home; the Experience Platform page on connecting a destination. Of
  these, only the Marketo Qualifier home page names Marketo Optimizer.
- Quote check: `python3 sow/canvas/research/expansion_2026-11-10/wave1/verify_wave1.py
  sow/canvas/research/expansion_2026-11-10/wave4/marketo_optimizer.json` says **73 quotes found on their pages, 0 not
  found, 0 on pages this session cannot read**.
- Id check by script against `sow/canvas/catalog.json` and every JSON file under `sow/canvas/research/`: no MO or XQ id,
  no `moptimizer` id and none of the three connection ids exists anywhere else. 21 service ids, 21 distinct.
- Copy check by script on every card field: no em or en dash, no beta, early access, limited availability, coming soon,
  "is planned" or "are planned", no year, no "the client" or "clients", no bare "your" outside the client voice, no
  prerequisite that opens with or follows a colon with "confirm", no "prove it" in the client voice. Quotes with a dash
  in Adobe's sentence were cut before the dash or not used.

## The three connections, and why each counts

**`moptimizer-marketo`.** The strongest tie in the guide. Adobe documents what moves both ways and what the user sets
up: Marketo Engage activities as journey entry events and listen-for-event triggers (ten trigger activities and ten
filter activities named), journey actions that write to Marketo Engage (add to and remove from a Marketo Engage static
list, change Marketo Engage program status, request a Marketo Engage campaign), the Coworker workflow that adapts a
smart list into a people list with a review card, the Adapt Program skill, and the one-time copy of Design Studio
images. The connection itself is made by Adobe at provisioning, so there is no "connect the two" service; the services
are the work on top of it.

**`moptimizer-cw`.** Coworker is not a separate integration here: it is the chat panel "embedded throughout Adobe
Marketo Optimizer". Adobe documents the permission it needs ("Manage B2B Conversational Experience"), that each skill
is checked against the feature's own permission, a table of about 40 skills, and full pages for six of them. Written
as a connection to match how the tool already shows Coworker for Marketo Engage (`marketo-cw`, XB10). The first
prerequisite is the standard Coworker sentence from the wave 3 brief, with its `sow_prereq`; the Marketo Optimizer
pages state no industry limit for Coworker. See question 3.

**`moptimizer-ads`.** Adobe documents three pre-built destinations (Google Customer Match, Facebook Custom Audience,
LinkedIn Matched Audience), the sign-in that configures each, the 18 Experience Platform permissions needed, activation
from a static list and from a journey action, and the sync (a new member reaches the destination "within 24 hours").
`kind` is `native` because Adobe calls them pre-built integrations inside the product; the existing `ads-rtcdp`
connection in the tool uses `outside`, so the build may prefer that word for a connection to an outside system.
`sow_availability` is set because Adobe limits the catalog to three.

## Checked and not documented

| Pair | Finding | Adobe's words |
|---|---|---|
| `moptimizer-ajob2b` | Shared foundation, no connection | "Journey traffic control works the same way for both Journey Optimizer B2B Edition and Marketo Optimizer." |
| `moptimizer-crm` | Not found: no page names Salesforce, Dynamics or a CRM. Opportunity data arrives through Marketo Engage. | "Activities related to opportunity records associated with leads or accounts." |
| `moptimizer-mmeasure` | Not found: no page names Marketo Measure or attribution. Only the product family sentence on the Marketo Qualifier page. | "The app is part of the Marketo product family, alongside Marketo Engage, Marketo Optimizer, and Marketo Measure." |
| `moptimizer-mqualifier` | No setup on any Marketo Optimizer page; the Qualifier integrations and getting started pages do not name Marketo Optimizer. Left to the Marketo Qualifier research. | "Adobe Marketo Qualifier is an AI-driven application that you can use with Marketo Optimizer." |
| `moptimizer-aemassets` | Planned, not available: also under left out | "These uploaded assets are available for use only in the Marketo Optimizer instance." |
| `moptimizer-bc` (not on the list) | Brand Concierge activities are score inputs and triggers, with no setup | "Activities for leads engaging with Brand Concierge." |
| `moptimizer-rtcdp` (not on the list) | The guide never names Real-Time CDP; the Experience Platform steps are inside MO01, MO08 and XQ07 | "To use web forms, you must have one or more HTTP API streaming connections defined in Adobe Experience Platform." |

## Left out, and why

| What | Adobe's words | Effect on the services |
|---|---|---|
| The release label on the whole product | "For the Beta release of Marketo Optimizer, the following default personas are defined according to the job title attribute:" | Question 1 |
| AEM Assets, AEM Content Fragments and Adobe Express in the email editor | "AEM Assets, AEM Content Fragments, and Adobe Express integrations are planned for a future release." | No `aemassets` connection |
| Asset import from other systems, folders, a ready-made library | "Import of assets from external systems and access to a pre-populated asset library are not yet available." | XQ03 covers the one-time Design Studio copy and uploads by hand only |
| Dedicated IP pools, warmup, PTR management | "Dedicated IP pools are not available at Beta." | MO02 has no warmup work |
| Custom Delegation of the subdomain | "Custom Delegation method for subdomain delegation is not yet available." | MO02 uses fully delegated or CNAME |
| Editing personas, custom personas | "In the upcoming General Availability release, you can edit any of these default personas according to the needs of your organization." | MO04 uses the default personas as filters |
| Test profiles, simulation, proofs, rendering and spam reports | "Test profiles, Simulate Content, and Send Proof are not available in the current release." | MO05 and MO06 test with real sends to an internal list |
| Email comments and review workflow | "Email comments and collaboration (inline comments, @mentions, request-review workflow) are planned for a future release." | No approval workflow service |
| Account-level personalization, custom objects | "Account-level personalization and custom-object data are not available in the current release." | MO06 and MO11 use profile attributes |
| Journey rule sets; SMS, push and direct mail rules | "Journey rules are not yet supported in this Beta release." | MO10 is channel rule sets for email |
| Templates other than email | "In this Beta release, only email templates are supported." | MO08 builds landing pages without templates |
| My Tokens in the personalization editor | "My Tokens are not currently enabled in the Personalization editor." | MO03 creates tokens, promises no use in email content |
| Scoring Studio | "Labs Scoring Studio" (home page navigation table) | Question 2; MO04 uses the person engagement score |
| Coworker commands marked Coming soon | "Some commands appear greyed out and marked Coming soon" | XQ04 checks which skills are active for the client |
| More than three ad destinations | "Additional destinations are planned for future releases." | `moptimizer-ads` names three |
| WhatsApp automated replies, other providers, US marketing templates | "Automated or predefined response messages are not yet supported." | MO09 covers outbound templates and keyword replies |
| More than one traffic-controlled journey per person | "Currently, a person can be placed in only one JTC-selected journey at a time." | MO07 scopes one at a time |
| Interactive webinars | "Use this action to change the status of a person in relation to an interactive webinar." | No page documents creating one; too thin for a service |

## What a partner would get wrong

1. **Reusing the Marketo Engage sending domain.** "You cannot share the same sending subdomain between Marketo Optimizer
   and another product such as Adobe Marketo Engage or Adobe Campaign". A client moving email to Marketo Optimizer needs
   a new subdomain and its reputation starts fresh. MO02 says so in its prerequisites.
2. **Expecting smart lists to carry over whole.** Coworker adapts filters, not memberships, and Adobe says activity and
   membership filters have no equivalent: "have no people-list equivalent". A list can come back with fewer rules than
   the source. XQ01 budgets the review and the rebuild.
3. **Treating the Design Studio images as synced.** "Asset availability in Marketo Optimizer is based on a one-time copy
   of your assets from Marketo Design Studio."
4. **Promising a proof send or a rendering preview.** Not in the current release (left out above).
5. **Publishing without planning for it.** "Publishing is permanent. A published email cannot be edited, renamed,
   deleted, or returned to draft." A live journey is not editable either, and a program keeps its program type for
   good. MO12 trains the team on this and MO03 sets the program types first.
6. **Assuming the full Experience Platform destinations catalog.** "This catalog is not the full Adobe Experience
   Platform destinations catalog."
7. **Selling it into health care.** "Adobe Marketo Optimizer is not HIPAA compliant and not HIPAA-ready". It is a
   product prerequisite in the JSON.
8. **Reading the setup checklist literally.** It says to create a Journey Optimizer B2B Edition product profile; the
   linked instructions and the Admin Console entry say Marketo Optimizer.
9. **WhatsApp marketing to United States numbers.** Adobe's page repeats Meta's pause on marketing templates to US
   numbers, and the channel needs its own Adobe entitlement.

## Open questions for Adam

1. **The whole product is labelled Beta in Adobe's guide. Add it to the tool now?**
   Recommendation: yes, add it to Create your own play and the RFI Builder, with no label in anything a partner or
   client reads (the JSON already has none), the same call you made for Firefly Custom Models ("don't worry about the
   beta"). Adobe publishes a license metric for it, and the services rest only on what works today. Recheck the guide
   on the day it is built: the pages changed as late as October 29, and several left-out items will move when Adobe
   drops the label. If you would rather wait, the research is ready and only needs the quote check rerun.

2. **Scoring Studio is under "Labs". Keep it out?**
   Recommendation: keep it out until it leaves Labs. It is the one feature that writes scores back to Marketo Engage,
   so it would become a fourth service on `moptimizer-marketo` later.

3. **Coworker is built into Marketo Optimizer, not an add-on. Show its work as a connection to the Coworker box (as
   written, three services), or fold it into the product's own services?**
   Recommendation: keep it as the `moptimizer-cw` connection, the way Coworker for Marketo Engage is shown today, so a
   partner who adds Coworker sees the rollout work and one who does not is not shown chat services. The cost: MO11 and
   MO13 mention work a marketer does through the chat panel, and that stays true either way.

4. **Is a Marketo Engage subscription required, or can Marketo Optimizer be bought alone?**
   The public pages assume a connected Marketo Engage instance and tie scoping to "the Customer's purchase of Marketo
   Engage", and say nothing of buying it alone. Recommendation: keep "A Marketo Engage subscription" as the first
   prerequisite, which matches your read, and ask the product team once so the card is not wrong.

5. **`moptimizer-ads` is marked `native`; the tool's other ad platform connection uses `outside`.**
   Recommendation: let the build use whichever word the canvas already uses for a connection to an outside system.
   Nothing else in the entry depends on it.

6. **If Marketo Optimizer and Journey Optimizer B2B Edition are both on one canvas, MO01 and JB05 overlap in part**
   (the Admin Console steps). Recommendation: leave both lines; one play per canvas makes the pair unlikely, and the
   overlap review in the SOW already asks about it.

## Pages read

All under `https://experienceleague.adobe.com/en/docs/marketo-optimizer/user/` (58):

- `guide-overview`, `home-page`, `journey-traffic-control`
- `start/`: `setup-check-list`, `user-management`, `email-deliverability`
- `coworker/`: `chat-interface`, `skills`, `program-from-brief`, `audience-creation`, `journey-observability`,
  `lead-scoring-model`, `personalize-content`, `surface-analytics`
- `marketing-management/`: `marketing-management`, `person-journeys`, `whatsapp-authoring`, `programs/programs`,
  `programs/personalization-my-tokens`, `email-channel/email-channel`, `email-channel/email-authoring`,
  `email-channel/email-send-time-optimization`, `email-channel/email-dark-mode`, `journey-nodes/action-nodes`,
  `journey-nodes/listen-for-event-nodes`, `journey-nodes/next-best-path`, `journey-nodes/person-audience-node`,
  `journey-nodes/split-merge-paths-nodes`, `journey-nodes/wait-nodes`
- `audiences/`: `people-lists`, `event-based-audiences`, `engagement-scores`, `personas`, `destinations`,
  `person-details`
- `content/`: `templates/templates`, `templates/templates-create`, `templates/template-content-governance`,
  `landing-pages/landing-pages`, `landing-pages/landing-pages-create-publish`, `landing-pages/landing-page-design`,
  `forms/forms`, `forms/form-design`, `personalization-expressions`, `conditional-content`,
  `assets/digital-asset-management`, `visual-fragments/fragments`, `visual-fragments/fragment-authoring`,
  `content-design/content-components`, `content-design/structure-components`, `content-design/design-custom-css`
- `admin/`: `channels/email-channel-configuration`, `channels/configuration-channels-whatsapp`,
  `channels/configuration-presets-forms`, `channels/configuration-presets-landing-pages`, `program-types`,
  `business-rules`, `permissions-reference`

Outside the guide:

- `https://helpx.adobe.com/legal/product-descriptions/adobe-marketo-optimizer.html`
- `https://helpx.adobe.com/legal/product-descriptions/adobe-journey-optimizer-b2b.html`
- `https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/guide-overview`, `.../release-notes`,
  `.../get-started/get-started`, `.../journeys/journey-traffic-control`,
  `.../admin/configurations/engagement-score-weighting`
- `https://experienceleague.adobe.com/en/docs/marketo-qualifier/using/home`, `.../integrations`, `.../getting-started`
- `https://experienceleague.adobe.com/en/docs/marketo/using/home`, `.../release-notes/current`,
  `.../product-docs/coworker-for-marketo/overview`
- `https://experienceleague.adobe.com/en/docs/marketo-measure/using/home`
- `https://experienceleague.adobe.com/en/docs/coworker/content/home`
- `https://experienceleague.adobe.com/en/docs/experience-platform/destinations/ui/connect-destination`
- The Workfront page behind the standard Coworker prerequisite (quote rechecked by the script).

## Pages not read

- `https://business.adobe.com/products/marketo/marketo-optimizer.html`: tried once with curl; the connection ended with
  an error and no page came back. Not tried again, and the address was a guess. No business.adobe.com page was read.
- `https://experienceleague.adobe.com/en/docs/marketo-optimizer/user/release-notes`: page not found. The guide links no
  release notes.
- `https://www.adobe.com/legal/licenses-terms/adobe-gen-ai-user-guidelines.html`: linked from the Assets page; not
  needed for any claim, not fetched.
- The two videos on the overview and home pages: not quotable, nothing rests on them.
