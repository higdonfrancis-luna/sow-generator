# Step 91: six services for the catalog gaps the holdout RFI found (Nov 13 2026)

Adam: "yes, build 1 and 2", item 1 of `sow/rfp_prototype/kb_method/ROUND3_PROPOSAL.md`. ChatGPT's test RFI, Vennor Quay
Motionworks, asked for work the catalog had no service for, so 8 of its 18 implementation questions got no draft without AI, and
two of the insurer's and Tallgrass's questions fell back to today's catalog answer.

## What was built

Six optional services. The catalog is 34 Adobe products, 9 outside systems, 151 connections and 531 services.

| Id | Product | Service | Billing | Hours (small / typical / large) | Needs | Adobe page |
|---|---|---|---|---|---|---|
| SI07 | AEM Sites | Page review and approval workflow | one-time | 40 / 80 / 160 |  | [Publishing Pages from the Sites Console](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/authoring/sites-console/publishing-pages) |
| SI08 | AEM Sites | Language copies and local corrections across markets | one-time | 40 / 80 / 160 | a translation service provider, through an AEM connector or XML export and import | [Translation Best Practices](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/administering/reusing-content/translation/best-practices) |
| SI09 | AEM Sites | Nightly ERP or PIM data into AEM pages | one-time | 40 / 80 / 160 | Adobe Developer App Builder access; the client's nightly export file | [OpenAPI-Based APIs](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/open-api-based-apis) |
| SI10 | AEM Sites | Content migration from another CMS | one-time | 140 / 280 / 560 | an Azure Blob Storage or Amazon S3 account for Bulk Import | [Package Manager](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developer-tools/package-manager) |
| AS07 | AEM Assets | Document versions, expiry and replacement on published pages | one-time | 16 / 32 / 64 | AEM Sites for the pages that use the documents | [Add digital assets](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/add-assets) |
| MK07 | Marketo Engage | Email program and preference migration from another platform | one-time | 48 / 96 / 200 | exports from the current email platform | [View Blocked People in a Smart Campaign](https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/core-marketo-concepts/smart-campaigns/smart-campaign-data/view-blocked-people-in-a-smart-campaign) |

- All six start unticked, on Create your own play and in the RFI Builder; no play turns one on. Like step 85's Commerce
  services, they also show as optional lines on the AEM Sites, AEM Assets and Marketo Engage cards of the plays that carry those
  products; totals do not change until one is ticked.
- **Hours are our own estimates**, set beside two or three comparable services each (the reasoning is in each research file).
  Adam approved them as shown in the table above (Nov 13, "ok").
- Each service has a method entry and phrases in the method knowledge base (`sow/rfp_prototype/kb_method/`, batch 13).

## How it was researched

One writer per service drafted it from Adobe's pages, a second reader re-fetched every page and checked the scope, the method,
the overlap with the product's other services, the hours and the phrases, and a fixer applied what held (each change is listed
in the file's `checker_changes`). A script then found every quote word for word on its page (`sow/qa/review_pack/lib.py`): 36
of 36. The files: `SI07.json` to `MK07.json` in this folder, brief in `BRIEF.md`.

## Notes from the research, for Adam

- **SI07, page approvals:** for AEM Sites as a Cloud Service authoring. Removing the authors' replicate right turns their
  publishes into requests that start Adobe's request workflow, customized with review, legal or safety sign-off and an urgent
  out-of-hours route; the approval record is the workflow history and a page version at each publish, kept for the client's
  retention period. Not in the hours: a Universal Editor extension that adds a workflow to its own Publish button, email notices
  from workflow steps (they need advanced networking), and exporting the record to an outside audit service. On Edge Delivery
  sites authored in Experience Workspace, Adobe's own Request Publish does this job instead.
- **SI08, language copies:** country sites as MSM Live Copies of language masters, a translation provider integrated, and the
  rule for which components a market may correct locally (breaking inheritance keeps the local change when the central page is
  updated). For sites not on Edge Delivery; AXD03 covers Edge Delivery sites that already have the MSM structure. The
  translators' own work is not in the hours.
- **SI09, ERP or PIM data:** a Content Fragment Model with only the fields agreed for the public site (never prices or stock), a
  nightly App Builder job that checks each file and writes it to AEM through the Content Fragment Management API, and a runbook:
  a late, incomplete or conflicting file is held and the published values stay live. Adobe documents publishing fragments from
  the console, not through the API, so the client's product data owner publishes after each run. One App Builder pack comes with
  AEM Sites as a Cloud Service.
- **SI10, migration from another CMS:** Adobe documents no import tool for moving another CMS into an AEM Sites site that is not
  on Edge Delivery, so the inventory, mapping and import scripts are ours; Adobe's Package Manager, Bulk Import and pipeline-free
  redirects do the loading. The RFI Builder uses A02 on an Edge Delivery RFI and SI03 for a move from an older AEM.
- **AS07, documents:** an expiration date in the Expires field takes a withdrawn document off Publish at the next midnight run, so
  urgent withdrawals are unpublished at once; replacements go up as new versions under the same name, after a check of the pages
  on the References tab, and a wrong one is reverted in the Timeline. Never Replace, which gives the asset a new ID.
- **MK07, email migration:** people, subscription choices and suppression flags imported and set (Unsubscribed, Marketing
  Suspended, Blocklisted, Email Invalid), a conflict rule agreed with the client's legal team, the subscription center, the active
  programs rebuilt, and the first migrated send checked so no suppressed person receives it.

## What changed in the RFI Builder's no-AI writer

- **A migration written for one source answers only an RFI moving from it, in the live answers too.** SI10 (another CMS) appears
  only where the RFI names one (Drupal, a CMS built in house); where the RFI does not say what it moves from, the answer's own
  sentence covers both routes, so the bank RFP's question 2.1 keeps its four services under its 300 words (found by
  test_rfp_step67 and _step69). The Content Transfer Tool service (SI03) stays off an RFI that names another CMS, as the knowledge
  base already did since round 1; this is a change to today's catalog answers for such an RFI (Tallgrass A.3 no longer offers the
  Content Transfer Tool for its own CMS).
- On an RFI for Edge Delivery Services, SI10 gives way to A02.
- A migration service leads or rides along only on a question about moving something ("migrate", "move our site into", "import
  our records from"), so "a failed transfer" of an enquiry is not a migration.
- One phrase added to MK02 (opt-out sync with the CRM).
- Three scopes reworded so they read right in the client's voice, found by test_rfp_step53: SI10 ("Where you are moving from a
  CMS other than AEM, we will list every page and file ..." and "we will set up a redirect ..."), AS07 ("each document to be
  withdrawn or limited in time") and SI08 ("your translation service provider").
- Measured: the insurer's Compliance approval question (B.6) now leads with SI07 (128 hours, where the measured round 2 answer said 168 for governance and change management);
  Tallgrass A.3 and Vennor A.1 (moving off another CMS) and Vennor C.1 (the email migration) now get answers from the new
  services; the two tuning RFIs lead with the right service 38 times in 38. `node sow/test_step91.js` (21).

## Seen, not changed (for Adam)

- **Sorting without AI.** Six of Vennor's questions still land in To sort and two in Your firm, so the no-AI writer still drafts
  no answer for them (the AI reads them all). With the new services the phrases now find them strongly (the page approval
  question scores 42 for SI07), so sorting such a question into Adobe products by its phrases now looks possible; a proposal.
- **The live matcher** reads "a failed transfer" as a migration and puts MK07 first for Vennor C.2 in today's catalog answer and in
  what the AI writer is given. The no-AI writer's rule above would fix the live matcher too; a proposal.
- Asks for Legal team approval under an AEM Sites heading go to Your firm today (the finder's firm words); "translate our pages
  into French and German" still leads with the site build; Vennor A.4 ("nightly ERP files to product pages") is read as a firm
  question, and "product pages" alone reads as Adobe Commerce.
