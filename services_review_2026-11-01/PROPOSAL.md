# Services and pricing review (November 1, 2026)

- **Right services?** Mostly yes. Commerce, FSI and Create your own play change.
- **Redundancy?** Yes, SEO shows up under both products. One owner for each piece of work fixes it; no starting total changes.
- **Pricing right?** Not proven yet. Three numbers to check first with partners.

Nothing is built. Each step needs its own yes and a mockup first, and nothing goes live until "deploy". Totals are Typical hours at $150 an hour, setup plus 12 months, for comparison only (the tool has no default rate).

## The short answer

**Right services.** Two starting lists change, and Create your own play changes:
- Commerce: the deployment pilot (L03) becomes an add-on. Commerce already starts with its own edge pilot on product pages (C02), on the route the CDN line (C07) sets up. Add L03 back when the customer wants Adobe's impact analysis on a supported opportunity; Adobe doesn't document it for product pages. $228,000 becomes $222,000.
- FSI, new concierge: the build (F02) already curates the sources, writes the test answers and tests the handoff, so the Brand Visibility questions go into its test set. The separate line that maps them (C04) starts on only when a concierge is already live and healthy. When it is live but needs fixes, F02's remediation scope keeps the Brand Visibility questions. $308,400 becomes $300,000.
- Create your own play (step 2): research services start off. A partner picks the ones it wants; each shows "Discovery required" in place of today's Concept tag and adds no fee until it is written up. With all 14 products, $1,802,400 becomes $730,200, or $715,800 with the Commerce and FSI changes too.
- CJA audiences (C06) and Coworker's one plugin (CW07) stay on: your video and deck sell them as partner services. ChatGPT calls both optional; your call.

**Redundancy.** You're right: SEO shows up under both products. It costs extra only when a partner adds the optional "Technical SEO and AI-search improvements" (O03) in the AEM play, so no starting total changes. The fix is one owner for each piece of work, set by where the fix shows up:
- Brand Visibility's services own AI-only work. Adobe says its edge fixes reach only ChatGPT, Perplexity and Claude; people and search engines get the original page. So these fixes aren't SEO work. Brand Visibility still uses SEO data, such as Semrush and Search Console, to pick what to fix, as your video says.
- In the AEM play, Sites Optimizer's monthly fixes (SO2) own fixes in the page itself, including the site fixes Brand Visibility flags.
- One content line, renamed "Content improvements for search and AI" (O02), serves both and is charged once.
- O03 retires. It is the line that put SEO under Brand Visibility, and in the AEM play it could charge Sites Optimizer's fixes a second time. Plays without Sites Optimizer then have no technical SEO line; partners add their own.

**Pricing.** Not proven yet. No one has partner estimates, and ChatGPT's figures are planning guesses too. For 29 of the 40 services there is no like-for-like public price to compare with. Setup (L01, L02) and the monthly review (O01) sit close to one partner's advertised prices. Three numbers to check first:
- The monthly Brand Visibility program (O01 + O02): $15,600 a month, against your deck's $3K to $10K a month. The content line (O02, $9,600 a month) is most of the gap.
- The AEM web program (discovery, build, migration, launch and governance): $240,000, against your deck's $200K and one partner's advertised $60,000 to $150,000 launches.
- The Brand Concierge build (F02): $96,000, close to your deck's $100K, but one partner advertises a simple launch from $14,000.

To settle them, two partner delivery leads estimate the same two sample jobs before they see our hours (step 3). The double charges above can be fixed now.

Pictures: `mockups/services_by_play.png` (starting services in each play, now and proposed) and `mockups/seo_ai_owners.png` (who owns SEO work and who owns AI-answer work). Every service's price check: `PRICE_CHECK.md` (internal: it names other partners' prices).

## Decisions (Adam, November 1)

1. O03 retires everywhere: yes.
2. CJA audiences (C06) and Coworker's one plugin (CW07) stay on as starting services: yes.
3. Step 1a: a before-and-after picture of the cards comes next, then the build on his yes.
4. No outside estimate: "I don't need anyone to check my work." Step 3 is dropped; the hours stay as they are.

## What ChatGPT's audit reviewed

It reviewed the original October 31 zip, before the October 31 fixes. It still quotes "CDN readiness for stores not on Fastly" and asks to remove free-text prompt parsing, both changed on October 31. Of the 81 recommendations in its summary, custom-play, pricing and red-team sections, 7 were already done, 45 partly done and 27 not done (2 don't apply).

The 7 done: prompts read as a number and moving only the three prompt services; no hourly rate range; fees labeled illustrative, with none of the claims it prohibits; ranges never called P50 or P90, and outcome promises kept out of acceptance; the deployment pilot's 20-URL rule for Adobe's impact report; its six documentation checks on research lines; and no market-rate claim for Coworker.

Also built on October 31, but only part of what it asks:
- every service naming the quantity behind its hours
- research lines arriving as concepts that must be written up (their placeholder fees still count)
- the FSI "Brand Concierge today" answer.

Its pricing table matches today's tool except Commerce, which rose on October 31 when CDN readiness joined the defaults ($228,000, not $219,600). All 17 price sources it cites still say what it says (checked November 1).

## Who owns what: SEO versus AI answers

The rule: where a change lands decides who owns it, and each piece of work has one owner and one fee.

| Work | Owner | Why |
|---|---|---|
| Prompts, visibility, citations, AI-agent traffic | Brand Visibility: L01, L02, O01 | Brand Visibility runs the prompts and lists opportunities on its own; the hours cover the judgment around it |
| Fixes served at the CDN to AI assistants (summaries, FAQs, Recover Content Visibility) | Brand Visibility: L03 pilot, C02 product pages. O01 picks the month's fixes; they go live only where an edge route is in place (A01 in the AEM play, C07 in Commerce, L03 when added, or one the customer already has) | Adobe: these reach only ChatGPT, Perplexity and Claude; people and search bots get the original page (Optimize at Edge overview, Aug 26, 2026) |
| Fixes in the page on an AEM site (metadata, structured data, redirects, broken links, sitemaps, page speed) | Sites Optimizer: SO2, one monthly fix allowance (up to 10 fixes at Typical) | Adobe: Sites Optimizer applies approved fixes "into the authoring environment only", where people publish them (Deploying to author, Aug 19, 2026); page-speed code fixes arrive as pull requests for developers to merge |
| Site fixes Brand Visibility flags on an AEM site (robots.txt rules for AI crawlers, redirects for pages AI agents can't reach) | Sites Optimizer: SO2, same allowance | One redirect fixes both search and AI; made by hand in the site's configuration or redirect sheet, and counted against SO2's fixes |
| Titles, descriptions, structured data and redirects for a new site, through launch | A02 (the Edge Delivery migration) | Sites Optimizer needs a public production site, so SO1 and SO2 start after launch |
| Page copy | O02, renamed "Content improvements for search and AI" | The only content line; each page change is logged once |
| Crawler access | One request per site, in L02 | Both products crawl the site with the same Adobe scanner (Spacecat) |
| Search Console | One access request; each product connects its own | Adobe documents two separate connections |
| Publishing route | C03 in the AEM play; C05 in Brand Visibility on its own | One route per site. The two meet only in Create your own play, where step 2b labels them as the same job |
| The monthly readout | O01 | In the AEM play it carries a search section from SO2's fix log; SO2 writes no separate report |

Plays without Sites Optimizer (Brand Visibility on its own, CJA, Commerce, FSI) have no technical SEO service; the content line still helps search. O01 hands site findings to the customer's web team, or the partner adds its own service with the "Add your own Optimize service" button on the Services step.

## Starting services, play by play

| Play | Change | Today | Proposed |
|---|---|---|---|
| Brand Visibility on its own | None (O03 leaves the add-ons) | $210,000 | $210,000 |
| Brand Visibility + CJA | None. Audiences (C06) stay on, as your video and deck say | $219,600 | $219,600 |
| Brand Visibility + Commerce | Deployment pilot (L03) becomes an add-on; the product-page pilot (C02) stays | $228,000 | $222,000 |
| Brand Visibility + Sites Optimizer and Edge Delivery | None to the list; one owner per SEO task; O03 retires | $484,800 | $484,800 |
| Brand Visibility + Brand Concierge (FSI), new concierge | F02's test set takes the Brand Visibility questions; C04 only when the concierge is live and healthy | $308,400 | $300,000 |
| FSI, concierge live and healthy | None | $212,400 | $212,400 |
| Coworker on its own | None. The one plugin (CW07) stays on, as your deck says | $81,000 | $81,000 |
| Create your own play, all 14 products | Step 2: research services start off | $1,802,400 | $730,200 ($715,800 with step 1b) |

Also in step 1b: in the FSI play, the Coworker add-ons can be scoped, but the SOW can't be issued until Adobe confirms in writing that the customer can use Coworker. Adobe's Coworker pages for Workfront say Coworker isn't currently offered to finance, health care and some other organizations. The gate works like the one on the Real-Time CDP profile line in Create your own play.

## Pricing method

1. The fee stays as built: planning hours times the partner's own approved rate. No default rate, no rate range, no software pricing.
2. No hours change in steps 1 and 2. Totals move only where a double charge goes or a service leaves the starting list.
3. Every card already says what its hours buy (since October 31). O01, O02 and SO2 also say what Adobe's product does on its own, and L03, C02 and F02 carry Adobe's facts. Step 1c adds that line to five more cards, so the hours visibly cover judgment, review, approvals, testing and handover: L01 (Brand Visibility suggests prompts from Semrush and Search Console and creates starter prompts), L02, C01, A01 (Edge Delivery puts page content in the first HTML and keeps the sitemap current) and CW03 (Coworker Chat ships with skills for common tasks).
4. From step 2, research services carry no fee until a partner writes them up.
5. `PRICE_CHECK.md` lists all 40 services with what we found.
6. Step 3 settles the hours: two partner delivery leads estimate two sample jobs before they see our hours (a simple one, Brand Visibility plus an existing CJA or Commerce; a complex one, a new Edge Delivery site or a new FSI concierge). A service's hours change only where their estimates differ from ours, and we record why.

## What I'd not take from ChatGPT's audit, and why

- **Replacing today's hours with its reference ranges.** Its ranges run lower than ours: Brand Visibility setup 72 to 112 hours (ours 112), the monthly program 48 to 76 hours a month for the same four page refreshes and one new page (ours 104), and F02 336 to 536 hours (ours 640). They are its own planning guesses, and the audit itself says partner estimates and pilots must set the final figures. Step 3 tests these first.
- **A new managed SEO program under Sites Optimizer.** You said fewer services is fine because partners add their own. It would sit next to SO2 and O02 and bring the overlap back.
- **Monthly budget ranges ($3K to $5K, $6K to $10K, $15K to $25K) and a $150 / $200 / $250 rate selector in the tool.** The ranges are ChatGPT's own proposal, and you settled on no rate range.
- **Public prices on the cards.** They are single sellers' starting prices and name other Adobe partners; on a card they read as benchmarks. They stay in the internal price check.
- **Merging services into new IDs, a system that tracks shared work across services, fees by role, a cost and margin model.** Each is a big build. Starting research services off and a short overlap table (step 2) remove the double charges; cost and margin stay in each partner's own model on purpose.

One more, from our own check of Adobe's pages rather than ChatGPT's audit: Adobe's go-live guide says Adobe's team configures the concierge from the customer's inputs. That fact stays in the price check, off the card: your video and deck have partners implementing Brand Concierge. Flag: F02's card, as built on October 31 and not yet live, quotes Adobe's FAQ on "Adobe consultants handling prompt engineering in the background". Given your rule on Adobe Consulting, step 1a drops that clause and keeps Adobe's timing figures.

## Steps

Each step starts with a PNG mockup and needs its own yes.

| Step | What | Size |
|---|---|---|
| 1a | One owner per piece of work: retire O03 (saved drafts that used it keep it as the partner's own line), rename O02, and owner text on O01, O02, SO1, SO2, L02, A02 and C07; drop the "Adobe consultants" clause from F02 | Text and data; mockup of one card first |
| 1b | Starting services: L03 becomes an add-on in Commerce; in FSI, F02's test set takes the Brand Visibility questions and C04 starts on only when the concierge is live and healthy; the FSI Coworker gate. Same rules on the canvas | Data and one gate; mockup of the gate first |
| 1c | "What Adobe does on its own" lines on five cards | Text; mockup of one card first |
| 2a | Create your own play: research services start off and show "Discovery required" until written up | Canvas and SOW; mockup first |
| 2b | Overlap labels on the canvas where two lines do the same job (publishing route C03 and C05, data collection, schemas, audiences, journeys, reports, renditions, Coworker access), and Sites Optimizer setup on AEM Sites as well as Edge Delivery | Data and labels; mockup first |
| 2c | Services choices carry back to the canvas (the gap explained on November 1) | Behavior |
| 3 | Dropped (Adam, November 1: no outside estimate). The hours stay as they are | |
| 4 | An AEM "site today" answer (new site, or already on Edge Delivery or AEM Sites) and a CJA "today" answer, like the FSI one; the Coworker play's three setup lines (CW01, CW02, CW05) shown as one line, same hours | Mockup first |

## For Adobe to confirm

- Brand Visibility's license minimum. Its earlier pricing page (as LLM Optimizer, January 2026 copy) set a 1,000-prompt minimum sold in steps of 200. If that still holds, the Small band (under 200 prompts) and "200 is the usual start" need your call.
- Coworker for banks and insurers (the gate in step 1b). Adobe's Workfront pages say it isn't offered to finance organizations, yet Adobe's own Coworker licensing deck uses a bank and an insurer as examples.
- Whether Brand Visibility deploys into AEM directly for a customer (it would shrink C03).
- How Brand Concierge setup splits between Adobe's team and a partner (it bears on F02's price).
