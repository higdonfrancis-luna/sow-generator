# Services and pricing review (November 1, 2026)

Adam's question: are these the right services for each play, including Create your own play; is there redundancy (SEO shows up under both Sites Optimizer and Brand Visibility); and is the pricing around every service right? ChatGPT's "ABV Services & Pricing Deep Audit" (in this folder) gave its view. This is the review of that audit against the current tool, with Adobe's own documentation and the public prices it cites rechecked on November 1.

Nothing here is built. Each step below needs its own yes, and nothing goes live until "deploy".

Pictures: `mockups/services_by_play.png` (starting services in each play, now and proposed) and `mockups/seo_ai_owners.png` (who owns SEO work and who owns AI-answer work). Every service's price check: `PRICE_CHECK.md` (internal).

## The short answer

**Right services.** Mostly right. Two starting lists change in step 1, and Create your own play changes in step 2:
- Commerce: the deployment pilot (L03) becomes an add-on. The CDN readiness line (C07) already sets up the same edge route, so the default charged the route twice. $228,000 becomes $222,000 at Typical.
- FSI: when the concierge is new, the Brand Concierge build (F02) takes in the Brand Visibility questions, so the separate discovery-to-answer line (C04) starts only when Brand Concierge is already live and healthy. $308,400 becomes $300,000.
- Create your own play (step 2): research services start off. A partner picks the ones it wants; each shows "Discovery required" and adds no fee until it is written up. All 14 products go from $1,802,400 to $715,800.
- CJA audiences (C06) and Coworker's one plugin (CW07) stay on: your video and deck sell them as partner services. ChatGPT calls both optional; your call.

**Redundancy.** You're right about SEO. The fix is one owner for each piece of work, decided by where the change lands:
- Brand Visibility's services own AI answers only. Adobe says its edge fixes reach only ChatGPT, Perplexity and Claude; people and search engines get the original page. So they are never SEO work.
- Sites Optimizer's services own search fixes on the AEM site (AEM play), including the site fixes Brand Visibility flags.
- One content line, renamed "Content improvements for search and AI", serves both and is charged once.
- "Technical SEO and AI-search improvements" (O03) retires. It is the line that put SEO under Brand Visibility, and in the AEM play it could charge Sites Optimizer's fixes a second time.

**Pricing.** Nobody can prove the hours yet, ChatGPT included: its own figures are planning guesses too. What we can fix now is the double charges above. Three numbers to check first with partners:
- the monthly Brand Visibility program, $15,600 a month at Typical and $150, against your deck's $3K to $10K
- the AEM site build, $240,000, against your deck's $200K and one partner's advertised $60,000 to $150,000 launches
- the Brand Concierge build, $96,000, close to your deck's $100K, though one partner advertises a simple launch from $14,000.

Two partner delivery leads estimating the same two sample jobs before they see our hours is how we settle them (step 3).

## What ChatGPT's audit reviewed

It reviewed the original October 31 zip, before the October 31 fixes. It still quotes "CDN readiness for stores not on Fastly", free-text prompt parsing and "Year one". Of the 81 recommendations in its summary, custom-play, pricing and red-team sections, 7 were already done, 45 partly done and 27 not done (2 don't apply). Already done before it arrived: fees labeled illustrative, no default rate and no rate range, prompts read as a number and moving only the three prompt services, every service naming the quantity behind its hours, research lines arriving as concepts that must be written up, the FSI "Brand Concierge today" answer, and outcome promises kept out of acceptance.

Its pricing table matches today's tool except Commerce, which rose on October 31 when CDN readiness joined the defaults ($228,000, not $219,600). All 17 price sources it cites still say what it says (checked November 1).

## Who owns what: SEO versus AI answers

The rule: where a change lands decides who owns it, and each piece of work has one owner and one fee.

| Work | Owner | Why |
|---|---|---|
| Prompts, visibility, citations, AI-agent traffic | Brand Visibility: L01, L02, O01 | Brand Visibility runs the prompts and lists opportunities on its own; the hours cover the judgment around it |
| Fixes served at the CDN to AI assistants (summaries, FAQs, Recover Content Visibility) | Brand Visibility: O01 monthly, L03 pilot, C02 product pages | Adobe: these reach only ChatGPT, Perplexity and Claude; people and search bots get the original page (Optimize at Edge overview, Aug 26, 2026) |
| Fixes in the page on an AEM site (metadata, structured data, redirects, broken links, sitemaps, page speed) | Sites Optimizer: SO2, one monthly fix allowance | Adobe: Sites Optimizer applies approved fixes "into the authoring environment only", where people publish them (Deploying to author, Aug 19, 2026) |
| Site fixes Brand Visibility flags on an AEM site (robots.txt rules for AI crawlers, redirects for pages AI agents can't reach) | Sites Optimizer: SO2, same allowance | One redirect fixes both search and AI; made by hand in the site's configuration or redirect sheet |
| Titles, descriptions, structured data and redirects for a new site, through launch | A02 (migration) | Sites Optimizer needs a public production site, so SO1 and SO2 start after launch |
| Page copy | O02, renamed "Content improvements for search and AI" | The only content line; each page change is logged once |
| Crawler access | One request per site, in L02 | Both products use the same Spacecat/1.0 scanner |
| Search Console | One access request; each product connects its own | Adobe documents two separate connections |
| Publishing route | C03 in the AEM play, C05 elsewhere | One route per site; a partner adding both is asked to say how they differ |
| The monthly readout | O01 | In the AEM play it carries a search section from SO2's fix log; SO2 writes no separate report |

Plays without Sites Optimizer (Brand Visibility on its own, CJA, Commerce, FSI) have no SEO service. O01 hands site findings to the customer's web team, or the partner adds its own service with "Add your own service".

## Starting services, play by play

Totals are Typical, implementation plus 12 months, at $150 an hour for comparison only.

| Play | Change in step 1 | Today | Proposed |
|---|---|---|---|
| Brand Visibility on its own | None (O03 leaves the optional list) | $210,000 | $210,000 |
| Brand Visibility + CJA | None. Audiences (C06) stay on, as your video and deck say | $219,600 | $219,600 |
| Brand Visibility + Commerce | Deployment pilot (L03) becomes an add-on | $228,000 | $222,000 |
| Brand Visibility + Sites Optimizer and Edge Delivery | None to the list; one owner per SEO task; O03 retires | $484,800 | $484,800 |
| Brand Visibility + Brand Concierge (FSI), new concierge | F02 takes in the Brand Visibility questions; C04 only when live and healthy | $308,400 | $300,000 |
| FSI, concierge live and healthy | None | $212,400 | $212,400 |
| Coworker on its own | None. The one plugin (CW07) stays on, as your deck says | $81,000 | $81,000 |
| Create your own play, all 14 products | Step 2: research services start off | $1,802,400 | $715,800 |

Also in step 1: in the FSI play, the Coworker add-ons can be scoped but the SOW won't issue until Adobe confirms in writing that the customer can use Coworker. Adobe's Coworker pages for Workfront say Coworker isn't currently offered to finance, health care and some other organizations. This uses the same gate as the profile-answer line (XA09).

## Pricing method

1. The fee stays as built: planning hours times the partner's own approved rate. No default rate, no rate range, no software pricing.
2. No hours change in steps 1 and 2. Totals move only where a double charge goes or a service leaves the starting list.
3. Every card already says what its hours buy (the named quantity, since October 31). Step 1c adds what Adobe's product does on its own, so the hours visibly cover judgment, review, approvals, testing and handover: L01 (Brand Visibility suggests prompts from Semrush and Search Console and creates starter prompts), L02, C01, A01 (Edge Delivery puts page content in the first HTML and keeps the sitemap current) and CW03 (Coworker Chat ships with skills for common tasks). L03, C02 and F02 have had this since October 31.
4. Unknown work stays unknown: from step 2, research services carry no fee until written up.
5. `PRICE_CHECK.md` lists all 40 services with what we found.
6. Step 3 settles the hours: two partner delivery leads estimate two sample jobs before they see our hours (a simple attach, Brand Visibility plus an existing CJA or Commerce; a complex one, a new Edge Delivery site or a new FSI concierge). A band changes only where they disagree, with the reason recorded.

## What I'd not take from ChatGPT's audit, and why

- **Replacing today's hours with its reference ranges** (for example Brand Visibility setup 72 to 112 hours, the monthly program 48 to 76, F02 336 to 536). They are its own planning guesses; the audit itself says partner estimates and pilots must set the final figures.
- **A new managed SEO program under Sites Optimizer.** You said fewer services is fine because partners add their own. It would sit next to SO2 and O02 and bring the overlap back.
- **Budget envelopes and a $150 / $200 / $250 rate selector in the tool.** The envelopes are ChatGPT's own proposal, and you settled on no rate range.
- **Public prices on the cards.** They are single sellers' starting prices and name other Adobe partners; on a card they read as benchmarks. They stay in the internal price check.
- **Merging services into new IDs, a shared-work engine, fees by role, a cost and margin model.** Each is a big build. Starting research services off and a short overlap table (step 2) remove the double charges; cost and margin stay in each partner's own model on purpose.
- **Changing "Implement Brand Concierge" to say Adobe's team configures it.** Adobe's go-live guide does say so. That fact goes into the price check, not the card: your video, deck and rule ("nothing about Adobe Consulting Services") have partners implementing it. Your call if you see it differently.

## Steps

Each step starts with a PNG mockup where the screen changes, and needs its own yes.

| Step | What | Size |
|---|---|---|
| 1a | One owner per piece of work: retire O03 (saved drafts that used it keep it as the partner's own line), rename O02, owner text on O01, O02, SO1, SO2, L02, A02 and C07, the C05 and C03 overlap flag | Data and text; small |
| 1b | Starting services: L03 an add-on in Commerce; F02 takes in the Brand Visibility questions and C04 runs only when the concierge is live and healthy; the FSI Coworker gate | Data, one gate; small |
| 1c | "What Adobe does on its own" lines on five cards | Text; mockup of one card first |
| 2a | Create your own play: research services start off and show "Discovery required" until written up | Canvas and SOW; mockup first |
| 2b | Overlap labels on the canvas where two lines do the same job (data collection, schemas, audiences, journeys, reports, renditions, Coworker access), and Sites Optimizer setup on AEM Sites as well as Edge Delivery | Data and labels |
| 2c | Services choices carry back to the canvas (the gap from this morning) | Behavior |
| 3 | Two partner delivery leads estimate two sample jobs; reset only the bands they disagree on; line up the deck's run-and-operate figure with the tool | Your contacts |
| 4 | An AEM "site today" answer (new site or already on Edge Delivery or AEM Sites) and a CJA "today" answer, like the FSI one; Coworker setup shown as one line | Mockup first |

## Decisions for you

1. Step 1a and 1b as above: yes?
2. CJA audiences (C06) and Coworker's one plugin (CW07): keep them starting on, as your video and deck sell them (recommended), or make them add-ons as ChatGPT suggests (CJA $212,400, Coworker $76,200)?
3. O03: retire it everywhere (recommended), or keep it outside the AEM play, renamed without "SEO"?
4. Step 3: which two partner delivery leads, for example at Deloitte?

## For Adobe to confirm

- Brand Visibility's license minimum. Its earlier pricing page (as LLM Optimizer, January 2026 copy) set a 1,000-prompt minimum sold in steps of 200. If that still holds, the Small band (under 200 prompts) and "200 is the usual start" need your call.
- Coworker for banks and insurers (the gate in step 1b).
- Whether Brand Visibility deploys into AEM directly for a tenant (it would shrink C03).
- How Brand Concierge setup splits between Adobe's team and a partner (it bears on F02's price).
