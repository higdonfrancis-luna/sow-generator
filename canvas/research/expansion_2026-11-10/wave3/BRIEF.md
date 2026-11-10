# Wave 3, data, campaign and documents: service-level research brief (Nov 10 2026)

Adam, Nov 10: "yes" to starting wave 3's research while wave 2's tests finish. Research and pictures only in this pass:
nothing in the tool changes until he has seen the cards and said yes.

Wave 3 products: Adobe Analytics (`aa`), Audience Manager (`aam`), Adobe Campaign (`campaign`), Adobe Advertising
(`advertising`), Marketo Measure (`mmeasure`, formerly Bizible), AEM Guides (`aemguides`), Acrobat and Acrobat Services
(`acrobat`) and Acrobat Sign (`acrobatsign`). They will join the Create your own play picker and the RFI Builder; the six
plays on the tool's front page do not change.

## Read first

- `../BRIEF.md`: the source rules, blocked hosts, the quote check, no em dashes.
- `../wave2/BRIEF.md`: "What to write, for each product in your scope" and "Output" apply here unchanged (the fields of a
  product, a service, a connection; the two files to write).
- `../wave1/BRIEF_RECHECK.md`, steps 3 to 7: the lifecycle rule, what each connection and product needs, the client voice.
- `../../wave2_content_tools.json` and `../wave2/content_tools.md`: a finished file and trail from wave 2, built into the
  tool as step 64. Match its shape and its level of care.
- `../platform_data_campaign.json` and `../aem_documents.json`: this morning's map-level pass on the wave 3 products, with
  the connections Adobe documents and the pages. Start from it.

## The tool today (28 Adobe products)

Brand Visibility `bv`, Sites Optimizer `so`, Edge Delivery Services `eds`, AEM Sites `aemsites`, AEM Assets `aemassets`, AEM
Forms `aemforms`, Adobe Commerce `commerce`, Brand Concierge `bc`, Coworker `cw`, Customer Journey Analytics `cja`,
Real-Time CDP `rtcdp`, Journey Optimizer `ajo`, Target `target`, Marketo Engage `marketo`, Workfront `workfront`, GenStudio
for Performance Marketing `gspm`, Content Analytics `ca`, Marketing Campaign Analytics `mmm`, Real-Time CDP Collaboration
`collab`, Journey Optimizer B2B Edition `ajob2b`, Experimentation Accelerator `xa`, Adobe Express `express`, Creative Cloud
`creativecloud`, Frame.io `frameio`, Workfront Planning `planning`, Firefly Creative Production `fireflycp`, Firefly Custom
Models `fireflycm`, Brand Intelligence `brandintel`.

## Adam's calls that bind this wave

- **Brand Visibility is not pitched with Adobe Analytics.** Write no `bv` connection for `aa`, and no service that feeds
  Adobe Analytics data to Brand Visibility. Brand Visibility connects with Customer Journey Analytics. List the pair under
  `left_out` with "Adam, Nov 10 2026".
- **Nothing a partner or client reads says beta, early access, limited availability, coming soon, "is planned", or gives a
  release date.** A feature under such a label is left out and listed with Adobe's words. Where the label sits on the whole
  product or on something central to it, raise it as a lifecycle question for Adam with the quotes.
- **End of life and migrations are lifecycle questions too.** Audience Manager (Adobe publishes a guide for moving to
  Real-Time CDP), Adobe Campaign Standard and Classic v7 against Campaign v8, Marketo Measure's editions: say what Adobe
  says today, with quotes, and recommend how the product should be shown (for example Adobe Campaign as one box written for
  v8, and Audience Manager's services centered on the move to Real-Time CDP).
- **Nothing about Adobe Consulting Services**, and no software pricing.

## What the build of wave 2 taught (write it right the first time)

- **Version numbers read as dates.** The copy check flags "2024.10" or "2026.07" in a card field (scope, how, label,
  availability, prerequisites, gain, flows, client). Say "the minimum release Adobe names on its page" there; the number may
  stay in `evidence` and source quotes.
- **"are planned", "is planned"** read as a forecast. Use "managed", "set up", "scheduled".
- **The client-voice fields (`client.how`, `client.gain`) must not contain the letters "prove it"**, which also rules out
  "approve it" and "improve it" there. Say "have approved it".
- **`sow_prereq` is the Client's voice:** "the Client's", never "your". "Adobe confirms that ... before this service
  starts."
- **`availability` that carries a restriction Adobe states** (an industry, a region) also needs `sow_availability`: the
  same point as a condition, without Adobe's label.
- **A Coworker connection** that Adobe's page restricts by industry says so in a prerequisite, with a `sow_prereq`; where
  Adobe's page states no limit, the first prerequisite is: "Adobe's Workfront documentation says Coworker in Workfront is
  not currently available to health care and finance organizations; Adobe states no such limit for this connection, so
  confirm eligibility with Adobe for your client".
- **Overlaps:** where a service would repeat one already in the tool (read `../../../catalog.json`, `lines`), say so in the
  trail and do not write a second copy.

## Ids

Product service ids and connection service ids are given in your prompt. Check them by script against
`../../../catalog.json` and every JSON file under `sow/canvas/research/`: no repeats.

## Hosts

experienceleague.adobe.com, helpx.adobe.com, developer.adobe.com and www.aem.live are open. business.adobe.com and
www.adobe.com are on the allowed list but have answered with a bot check before: try once with curl, and if the page that
comes back is not the article, list it under `pages_not_read` and move on. Never work around a refusal or a bot check.

Check every quote the way `../verify_quotes.py` does before you finish (the checker in `../wave1/verify_wave1.py` runs on
your JSON as is). Write only the two files named in your prompt. Do not commit. Do not run any build script. No em dashes
or en dashes anywhere.
