# Wave 4, Adobe Marketo Qualifier (`mqualifier`): research trail

Checked Nov 10 2026. Research only: nothing in the tool, the catalog or the site was changed, nothing was built, no test or build script was run, and nothing was committed. The data is in `marketo_qualifier.json` beside this file, in the shape of `../../wave3_documents.json`. Marketo Optimizer (`moptimizer`) belongs to another helper and is not here.

## Summary

One product with 8 services, and 3 connections with 8 services (16 services in all). Hours are our own estimates for a mid-market sales team; Adobe publishes none.

| Product | id | Services | Starting | Optional | Monthly |
|---|---|---|---|---|---|
| Marketo Qualifier (Adobe Marketo Qualifier) | `mqualifier` | 8 | 7 | 1 | 1 |

| id | Service | Unit | Low / base / high | Starts on | Needs |
|---|---|---|---|---|---|
| MQ01 | User groups, access and email opt-out | one-time | 8 / 12 / 24 | yes | |
| MQ02 | CRM connection and field mapping | one-time | 16 / 32 / 56 | yes | Also needs Salesforce or Microsoft Dynamics 365 |
| MQ03 | Outlook, calendars and booking links | one-time | 8 / 16 / 32 | yes | Also needs Microsoft 365 with Outlook |
| MQ04 | Knowledge Center playbook | one-time | 16 / 32 / 64 | yes | |
| MQ05 | First Outbound Workflows | one-time | 24 / 40 / 80 | yes | |
| MQ06 | Prospect list imports | one-time | 8 / 16 / 24 | no | |
| MQ07 | Training for representatives, managers and administrators | one-time | 16 / 24 / 40 | yes | |
| MQ08 | Monthly outreach review and playbook upkeep | monthly | 8 / 12 / 24 | yes | |

A typical engagement at base hours: 156 one-time hours and 12 hours a month on the product alone.

| Connection | id | Kind | Services (starting in bold) | Label |
|---|---|---|---|---|
| Marketo Qualifier + Marketo Engage | `mqualifier-marketo` | native | **XP01**, XP02, XP03 | A Marketo Engage webhook sends live activity to Marketo Qualifier, and activity sync writes outreach activities back to Marketo Engage |
| CRM + Marketo Qualifier | `crm-mqualifier` | native | **XP04**, XP05 | Marketo Qualifier reads the CRM through an API connection, writes outreach activities, opt-outs and status updates back, and an optional plugin shows its insights on CRM record pages |
| Marketo Qualifier + Brand Concierge | `mqualifier-bc` | native | **XP06**, **XP07**, XP08 | Brand Concierge's Handoff to sales skill routes live chats and meeting bookings through Marketo Qualifier, where representatives set availability and take chats |

| id | Connection service | Low / base / high | Starts on | Needs |
|---|---|---|---|---|
| XP01 | Marketing Highlights setup | 16 / 24 / 48 | yes | |
| XP02 | Sales outreach in Marketo scoring and timelines | 16 / 24 / 48 | no | |
| XP03 | Automatic enrollment from live Marketo activity | 16 / 24 / 40 | no | |
| XP04 | Activity sync and CRM Sync Rules | 16 / 24 / 48 | yes | |
| XP05 | CRM plugin and Salesforce actions | 16 / 24 / 48 | no | |
| XP06 | Representatives and routing for concierge handoffs | 16 / 24 / 48 | yes | |
| XP07 | Live chat and meeting booking in the concierge | 16 / 32 / 56 | yes | |
| XP08 | Custom routing rules on Marketo attributes | 8 / 16 / 32 | no | Needs Marketo Engage |

Connection services: 8, of which 4 start on and 4 are optional. All one-time.

The product itself carries no early or limited label on any page read. One feature does (Smart audience) and is left out. Adobe's release notes date the stand-alone app to their entry of 08-17-2026, so the product is about three months old and its guide is changing fast: 10 of the 16 pages were updated today.

## How this was researched

- Started at https://experienceleague.adobe.com/en/docs/marketo-qualifier/using/home and followed every link inside the guide. The guide has 16 pages (the 12 the brief names plus Admin settings, Set up Marketing Highlights, Email Outbox and the release notes, which the home page does not link but other pages do). All 16 were read in full.
- Brand Concierge was a candidate pair, and the catalog's existing `marketo-bc` connection already names Marketo Qualifier, so the seven pages of the Brand Concierge guide's sales handoff section were read in full too. They are where the setup of that connection is documented.
- One page of the Marketo Optimizer guide (its overview) was read, only to see what it says about Marketo Qualifier.
- Every page was fetched with plain `curl -sS -L -m 45`, no changed headers. Tags were stripped and spacing collapsed, and each quote matched word for word with `../wave1/verify_wave1.py` run on `marketo_qualifier.json` as it is.
- **Quote check: 57 quotes in `marketo_qualifier.json`, all 57 found, 0 not found, 0 unverified. 26 more quotes used only in this trail were run through the same checker: all 26 found.** A made-up quote was added to confirm the check fails when it should (it did: 1 not found).
- Ids: MQ01 to MQ08, XP01 to XP08, the product id `mqualifier` and the three connection ids were checked by script against `sow/canvas/catalog.json` (products, connections, lines) and every other JSON file under `sow/canvas/research/` (34 at the last run, which included the other helper's `marketo_optimizer.json` as it stood then): no repeats. That file was still being written, so the two need one more check when both are final.
- Voice checks run by script on every card field, with the patterns from `sow/qa/check_product_copy.py`: no lifecycle label or forecast, no date or dated version number, no "the client", "clients" or bare "your", no prerequisite that contains "confirm", the client fields free of partner words and of the letters "prove it", `sow_availability` in the Client's voice, no em or en dashes in either file. All pass.

## What the public pages say the product is and needs

- **What it is.** "Adobe Marketo Qualifier is an AI-powered app that automates prospect qualification, outreach, and cross-channel buyer engagement for business development representatives (BDRs)." (home)
- **Family.** "The app is part of the Marketo product family, alongside Marketo Engage, Marketo Optimizer, and Marketo Measure." (home)
- **Earlier name.** The Brand Concierge guide says live chat and meeting booking "route through Adobe Marketo Qualifier (formerly Sales Qualifier)". The Marketo Qualifier guide itself does not mention the earlier name. The tool's `marketo-bc` card already uses the new name.
- **Stand-alone.** "Marketo Qualifier is now available as a stand-alone app. It supports Marketo Engage and Marketo Optimizer." (release notes) No page says a Marketo Engage subscription is required. The Brand Concierge guide says the handoff works without one: "Live chat and meeting booking do not require Adobe Marketo Engage."
- **Who sets it up.** "After Adobe provisions Marketo Qualifier for your organization, a Marketo system administrator must create the required user groups and connect Salesforce or Microsoft Dynamics 365." (getting started)
- **Experience Platform shows up as plumbing.** The user group is assigned the Adobe Experience Platform product profile "Default Production All Access"; the Marketing Highlights credentials are created on the "Experience Platform API"; the webhook carries a sandbox name. No page asks for a Real-Time CDP license or describes profiles or audiences moving.
- **A CRM is expected.** Salesforce or Microsoft Dynamics 365, one at a time: "Only one CRM can be active at a time." Prospects can also be imported from CSV or added by hand.

## The product's services, and why these eight

| id | What Adobe's page backs it with | Page |
|---|---|---|
| MQ01 | "Administrators who configure CRM connections, the Knowledge Center, and global email opt-out settings must also belong to the Marketo Qualifier Admins user group." | getting-started |
| MQ02 | "Inbound mapping controls which CRM fields Marketo Qualifier imports and where they appear." | integrations |
| MQ03 | "The connection lets Marketo Qualifier send from your mailbox, recognize when a prospect replies, and schedule meetings on your calendar." | integrations |
| MQ04 | "Upload sales plays, ideal customer profiles (ICPs), positioning guides, and other sales collateral in PDF, PPTX, or DOCX format." | admin-settings |
| MQ05 | "An Outbound Workflow is a goal-driven outreach cadence. You define the goal and targeting criteria. AI then proposes a multitouch cadence and writes personalized email content for each prospect." | outbound-workflows |
| MQ06 | "Map any custom or additional CSV fields, not only the standard ones." | prospects |
| MQ07 | "Use Tasks to complete the actions generated by Outbound Workflows. Select a task, take action, mark the task complete, and continue to the next task without leaving the page." | tasks |
| MQ08 | "To track outbound activity and results across your team, select Outbound performance in the left navigation." | performance |

- MQ01 to MQ05 follow Adobe's own order: groups, CRM, each representative's mailbox, the playbook, then workflows. MQ07 and MQ08 are the training and monthly lines every product in the tool has.
- MQ06 is optional because CRM prospects import by themselves; a CSV import matters only for lists outside the CRM.
- The email opt-out footer sits in MQ01 because it is one switch and one template, set by the same administrators.
- MQ02 sits on the product and not on the CRM connection, the way Marketo Measure's MZ02 does, because Adobe's setup cannot finish without it. See open question 1.

## Connections with services

### Marketo Qualifier + Marketo Engage (`mqualifier-marketo`)

Documented with setup on the Marketo Qualifier guide's own page, in four parts: "Part A: Create API credentials in the Adobe Developer Console.", "Part C: Configure a webhook in Marketo Engage.", "Part D: Add the webhook to a trigger Smart Campaign." The other direction is the Activity sync switch: "Activity sync writes Marketo Qualifier outreach activities to your CRM and Marketo."

- XP01 (starts on) is the four-part setup.
- XP02 (optional) is the marketing-side use of the activities, which Adobe names: "marketing teams can use the Marketo activities in lead scoring and engagement timelines."
- XP03 (optional) is automatic enrollment: "An Outbound Workflow can evaluate live Marketing Highlights activity against its targeting criteria."
- Availability, in Adobe's words: "Marketing Highlights is available in all production regions: North America, EMEA, and Australia." The card repeats it, and `sow_availability` restates it as a condition.
- No prerequisite tells the partner to check anything with Adobe. The region endpoint, organization ID and sandbox name are values "your Adobe contact can confirm"; the card says the Adobe contact can supply them.

### CRM + Marketo Qualifier (`crm-mqualifier`)

The id puts `crm` first, as the tool's three CRM connections do (`crm-cja`, `crm-marketo`, `crm-target`). In the catalog those three carry `kind: "outside"` with `line: "native"`; this file says `native`, one of the four kinds the brief allows, and the build should set it the way the other CRM connections are set.

- XP04 (starts on): the Activity sync switch and CRM Sync Rules. "Marketo Qualifier can write lead status updates back to Salesforce and Microsoft Dynamics automatically as a prospect moves through an Outbound Workflow, so representatives no longer update the CRM by hand."
- XP05 (optional): the CRM plugin. Adobe calls it optional: "Administrators can optionally install the CRM plugin so that representatives can use Marketo Qualifier insights inside Salesforce or Microsoft Dynamics 365." The list view and record page buttons are documented for Salesforce only, and "work in desktop Salesforce Lightning Experience, not the Salesforce mobile app."
- The Activity sync switch is one switch for the CRM and Marketo Engage together. XP04 turns it on; XP02 on the Marketo connection is the use of what lands in Marketo.

### Marketo Qualifier + Brand Concierge (`mqualifier-bc`)

Documented with setup, but on the Brand Concierge guide, not on a Marketo Qualifier page. "Both are offered by the same skill, Handoff to sales, and both route through Adobe Marketo Qualifier (formerly Sales Qualifier), where your representatives connect their calendars, set their availability, and take chats." "When a visitor asks to speak to someone, the chat arrives in the Chat inbox in Adobe Marketo Qualifier."

- XP06 (starts on): representatives, availability and the routing type.
- XP07 (starts on): the two integrations and the Handoff to sales skill in Composer, tested and published.
- XP08 (optional, needs Marketo Engage): custom routing rules. "Custom routing is the one part of live chat and meeting booking that requires Adobe Marketo Engage, because the rules are built on Marketo lead and company attributes."
- What these three do not do: the Smart Campaigns that use the concierge activity types in Marketo Engage. That is XB11 on `marketo-bc`, already in the tool.

## Not connections

| Pair | Why not | Adobe's words |
|---|---|---|
| `mqualifier-moptimizer` | No setup on any Marketo Qualifier page. Marketo Optimizer is named as family, as a product the app supports, as the tier for AI person summaries, and as data AI Chat can read. The Marketo Optimizer overview describes Marketo Qualifier in a paragraph and links to its guide, with no setup. Nothing is written from this side. | "It supports Marketo Engage and Marketo Optimizer." (release notes) "Adobe Marketo Qualifier is an AI-driven application that you can use with Marketo Optimizer." (Marketo Optimizer overview) |
| `mqualifier-mmeasure` | Named once, in the family list. | "The app is part of the Marketo product family, alongside Marketo Engage, Marketo Optimizer, and Marketo Measure." |
| `mqualifier-ajob2b` | A heading over four sample questions for AI Chat. Lookups only. | "These connected-data lookups read and report on your data; they do not create, edit, or launch programs or campaigns." |
| `mqualifier-rtcdp` | Shared plumbing (product profile, API name, sandbox), not a connection. | "Select Add API, select Experience Platform API, then select Next." |
| `mqualifier-cw` | Not found on any of the 16 pages. | |

## Left out, and why

| What | Why | Adobe's words |
|---|---|---|
| Smart audience | Labelled Beta in its title, on the home page, in the release notes and wherever it is linked. Left out under Adam's lifecycle rule. No card, scope or prerequisite mentions it. | "Build target lists with Smart audience (Beta) by describing accounts in plain language, adding CRM data and growth signals, and reviewing scored leads for an Outbound Workflow." "During the Beta, keep these limits in mind:" |
| Smart audience actions in AI Chat | Part of the same feature. | "In Smart audience (Beta), chat supports actions on the audience list, including saving a list, adding information columns, filtering and prioritizing accounts and leads, and adding selected leads to an existing Outbound Workflow." |
| Google for email or calendar | Named in one line of the profile page; the integration page documents Outlook only. MQ03 is written for Outlook. | "Select Microsoft Outlook or Google and follow the sign-in process." |
| The email plugin for Outlook | Named, never documented. | "BDRs can use the CRM plugin to access business intelligence directly within Salesforce or Microsoft Dynamics 365, and the email plugin to access it in Outlook." |
| A LinkedIn integration | There is none. An InMail step is a task the representative completes by hand. | "The work panel shows content to copy and send from LinkedIn." |
| AI person summaries as a service | Tier-bound, with no setup. Kept as a tier on the product. | "AI person summaries are available on instances running Marketo Optimizer Prime or Ultimate." |
| AI Chat as its own service | No setup beyond the Knowledge Center (MQ04); covered in training (MQ07). | "AI Chat availability depends on your organization's configuration and your permissions." |
| Concierge activity attributes for topics, summary and language | Adobe says they come later. They belong to `marketo-bc` (XB11), not this file; recorded so nobody adds them. | "Some attributes on this activity type, including topics discussed, summary, and language, are planned for a future release." |
| Sales claims, software pricing, Adobe Consulting Services | Forbidden by the brief and Adam's rules. None written. | |

## What a partner would get wrong

1. **"It only reads the CRM."** The integration page says "It does not otherwise modify CRM records." after listing activities and opt-outs. The admin page then describes CRM Sync Rules, which write field updates: "An update can target the Lead, Contact, Account, or Opportunity record, not only the lead." The two pages do not agree. XP04 treats the rules as real and has the partner test them against the CRM's validation rules; the product note lists all three kinds of write.
2. **"Nothing is sent without approval", and automatic enrollment.** "Marketo Qualifier does not send email until you approve it." But the automatic enrollment section ends: "When the criteria match, the prospect is enrolled and outreach starts." The page does not say whether a draft still waits for review in that case. XP03's scope does not promise either; the partner should test it before telling a client's legal or sales leadership how it behaves.
3. **Disconnecting the CRM stops everything.** "When you disconnect a CRM, Outbound Workflows pause for all prospects in your organization, and no new prospects sync from your CRM until you reconnect." A CRM migration or a credential change needs a plan.
4. **Sharing a workflow cannot be undone.** "Sharing is permanent."
5. **The user group names are literal.** "User group names must match exactly as shown in the preceding steps." The managers' group is a third, optional one: "You can also create an optional Marketo Qualifier BDR managers group. Members of this group can access email performance reports."
6. **The Salesforce instance URL.** "Do not use a lightning.force.com URL as the instance URL."
7. **The playbook is not instant.** "A playbook can take up to 24 hours to process."
8. **The mailbox question a security team will ask.** "Marketo Qualifier reads only replies to emails that it sent, not the rest of your inbox."
9. **AI Chat is not reporting.** "AI Chat looks up information; it is not a reporting tool."
10. **The chat inbox is not in the Marketo Qualifier guide.** Chat inbox, Routing rules, Manage members, Meeting bookings, Meeting performance and Live chat availability are all described as screens of Marketo Qualifier, but only in the Brand Concierge guide. A partner reading only the Marketo Qualifier guide would not know they exist. The same guide says the calendar can be Google ("Choose the calendar you want to connect, either Microsoft Outlook or Google Calendar."), while the Marketo Qualifier profile page says "Select Connect and follow the Microsoft sign-in process."
11. **Live chats are kept for a month.** "Live chat conversations are retained for 30 days."
12. **Round robin resets on UTC.** "The 24-hour round robin reset runs on UTC, not on the representative's local time zone."
13. **Two representatives, one prospect.** "If another representative is already contacting the prospect, Marketo Qualifier displays a warning before duplicate outreach starts."

## Overlaps with lines already in the catalog (flagged, not changed)

- **XB11, Brand Concierge activity in Marketo programs (`marketo-bc`).** It already covers the Smart Campaigns on concierge activities and says meetings and chat need Marketo Qualifier. XP06 to XP08 stop at the handoff, so nothing is written twice. Once `mqualifier` is a box in the tool, the `marketo-bc` prerequisite "Adobe Marketo Qualifier for meeting booking and live chat, with representatives added in the Admin Console and calendars or chat availability set" describes the work of XP06. Flagged for the build; not changed.
- **F02, Implement Brand Concierge (320 / 640 / 1280).** A full concierge build may already include the handoff. XP07 is the handoff alone, for a client whose concierge exists. The overlap review the tool already runs for source services is the place to ask; not changed.
- **MK02, CRM sync and field mapping (Marketo Engage).** A different connection: Marketo Engage's own CRM sync. MQ02 is Marketo Qualifier's separate API connection to the same CRM, with its own credentials and its own field mapping. Not a duplicate, but a client will hear "CRM mapping" twice, so the names differ.
- **MK04, Lead scoring, lifecycle and data hygiene (Marketo Engage).** XP02 adds Marketo Qualifier's outreach activities to scoring that MK04 builds. XP02 is optional and small for that reason.
- **MZ02, CRM package and connection (Marketo Measure).** Same pattern as MQ02 and XP05, for another product. No overlap.
- No line in the catalog mentions Marketo Sales Insight, outbound cadences or a sales playbook.

## Open questions for Adam

1. **Where should the CRM connection service sit?** Adobe's setup cannot finish without Salesforce or Dynamics, so MQ02 is on the product with an "Also needs Salesforce or Microsoft Dynamics 365" tag, and the CRM connection holds only what goes back into the CRM (XP04, XP05). **Recommendation:** keep it this way. It matches Marketo Measure (MZ02), and a partner who never drags the CRM box onto the canvas still gets the one service the product cannot run without.
2. **Brand Concierge: is a connection sourced only from the Brand Concierge guide good enough?** The Marketo Qualifier guide never mentions Brand Concierge, the chat inbox or routing rules. The Brand Concierge guide documents all of it, step by step, with no label. **Recommendation:** yes, keep `mqualifier-bc`. The pages are public, current (Oct 27) and specific, and this is the pairing that ties the product to a Brand Visibility play (the FSI play sells Brand Concierge).
3. **Marketo Optimizer: no line from this side?** The public pages say the two work together and nothing about setup. **Recommendation:** no connection unless the other helper finds setup on a Marketo Optimizer page. The Prime or Ultimate requirement for AI person summaries stays as a tier note on the product.
4. **Outlook only, or Outlook and Google?** Adobe documents Outlook in full and names Google in passing (and Google Calendar in the Brand Concierge guide). **Recommendation:** write Outlook only, as built here, and ask the product team once whether Gmail is supported for sending.
5. **Does a client need Marketo Engage to buy this?** The public pages say the app is stand-alone and "supports Marketo Engage and Marketo Optimizer", that a "Marketo system administrator" does the setup, and that the Brand Concierge handoff works without Marketo Engage. None states a license rule. **Recommendation:** the card says "Marketo Qualifier provisioned by Adobe" and nothing about what it is sold with; ask the product team before a partner pitches it to a client with no Marketo product.
6. **Menu heading.** **Recommendation:** Campaign management, beside Marketo Engage and Marketo Measure, since Adobe calls the three one family.
7. **The two disagreements on Adobe's pages** (items 1 and 2 under "What a partner would get wrong": whether the app modifies CRM records, and whether automatic enrollment waits for approval). **Recommendation:** leave the cards as written, which promise neither, and pass both to the product team; they matter to a client's compliance review.

## Before merging into the canvas

- `crm-mqualifier` should take `kind: "outside"` and `line: "native"` like the other CRM connections.
- `sow_availability` is given on `mqualifier-marketo` (regions) and `crm-mqualifier` (the two CRMs; Salesforce desktop for the actions). No prerequisite needs a `sow_prereq`: none tells the partner to check with Adobe.
- XP08 carries `tier: "Marketo Engage"` (it shows as "Needs Marketo Engage"). Marketo Engage is a product in the tool, so the build may prefer to show the service only when the Marketo box is on the canvas.
- MQ02 and MQ03 carry `ext`.
- The RFI Builder will need the names a question uses: Marketo Qualifier, Sales Qualifier, Account Qualification Agent, Outbound Workflows, BDR, SDR, sales engagement, outbound cadence.
- Check the service and connection ids against the other helper's `marketo_optimizer.json` once it is final.

## Pages downloaded and checked

Marketo Qualifier guide (16, all read in full; base https://experienceleague.adobe.com/en/docs/marketo-qualifier/using/):

| Page | Adobe's last update | Quoted in the JSON |
|---|---|---|
| home | Nov 10 2026 | yes |
| getting-started | Nov 10 2026 | yes |
| prospects | Nov 10 2026 | yes |
| accounts | Oct 27 2026 | source of one flow |
| smart-audience | Nov 10 2026 | left out (quote under left_out) |
| outbound-workflows | Nov 10 2026 | yes |
| tasks | Nov 10 2026 | yes |
| email-outbox | Oct 27 2026 | no (read-only screen; covered in training) |
| performance | Oct 27 2026 | yes |
| ai-assistant | Oct 27 2026 | yes |
| integrations | Nov 10 2026 | yes |
| marketing-highlights-setup | Oct 27 2026 | yes |
| crm-plugin-setup | Nov 10 2026 | yes |
| admin-settings | Nov 10 2026 | yes |
| profile-settings | Oct 27 2026 | yes (left_out) |
| release-notes | Nov 10 2026 | yes |

Brand Concierge guide, sales handoff section (7, all read in full; base https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/sales-handoff/): overview, representative-setup, routing-rules, configure-in-composer, chat-inbox, monitor, marketo-activities. All last updated Oct 27 2026. `monitor` is read but not quoted.

Marketo Optimizer guide (1): https://experienceleague.adobe.com/en/docs/marketo-optimizer/user/guide-overview, for its paragraph on Marketo Qualifier only.

## Pages not read

- The two CRM plugin installation pages on experience.adobe.com that the plugin article links to (Salesforce and Dynamics). They are signed-in Adobe app pages, not documentation, on a host outside the three this pass may read. Not tried.
- The overview video on the guide home (video.tv.adobe.com). Not opened.
- No business.adobe.com or www.adobe.com page was needed or tried: every claim rests on Experience League.
