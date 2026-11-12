# Prompt for an outside review of the catalog

Upload `catalog_for_review.json` with this prompt. Paste everything below the line.

---

You are reviewing a catalog built for Adobe implementation partners. Partners use it to write statements of work: they pick Adobe products, the tool shows how those products connect, and it lists the services a partner can sell for each product and each connection.

The attached file `catalog_for_review.json` holds the whole catalog: 34 Adobe products, 9 outside systems, 150 connections and 517 services. Every service and every connection cites a public Adobe page (Experience League, HelpX, aem.live, developer.adobe.com) and, for services, the sentence on that page it rests on.

I want an independent check of two things: **is what we have right, and what are we missing?**

## How the file is laid out

- `products[]`: each product, with its `services[]`.
- `connections[]`: each pair of products, with `how_it_works`, `what_must_be_true_first`, the Adobe pages it cites and its own `services[]`.
- Each service has: `name`, `what_the_partner_does`, `billing` (one-time or monthly), `hours_small_typical_large`, `starts_selected`, `adobe_page` and `quote_it_rests_on`.
- `connection_types` explains the five kinds of connection.
- `left_out_on_purpose` lists decisions already made. **Do not report these as gaps.**

## What to check

**Part 1. Connections (150).** For each one:
1. Does Adobe document this integration on the cited page, between these two products?
2. Is `how_it_works` accurate, including the direction data flows?
3. Are the prerequisites in `what_must_be_true_first` correct and complete? Is a license, add-on or edition missing?
4. Is the `type` right (native, platform, extension, outside, partner)?

**Part 2. Services (517).** For each one:
1. Does the cited Adobe page support the work described? Does the quote appear on that page?
2. Is the description accurate for the product as it is today? Flag renamed products, renamed features, retired features and steps Adobe now does itself.
3. Is the service filed under the right product or connection?
4. Hours are our own estimates. Flag only clear outliers, and say why.

**Part 3. What is missing.** This matters most.
1. **Connections we lack.** For each of the 34 Adobe products, list integrations Adobe documents with another product in this catalog, or with a common outside system, that we do not have.
2. **Services we lack.** For each product, list work an implementation partner normally delivers that no service covers. Think setup, data, identity, governance, security, migration, testing, training and run-and-operate.
3. **Connections with thin services.** Name connections where Adobe documents more setup work than our services cover.

**Part 4. Housekeeping.**
1. Links that are dead, redirect elsewhere, or now show different content.
2. Two services that describe the same work.
3. Statements in one entry that contradict another.

## Rules for your answer

- **Evidence or it does not count.** Every finding needs the URL of an Adobe page you actually opened and a short exact quote from it. If you cannot open pages, say so at the top, and limit yourself to Part 4 items 2 and 3 plus anything you can show from the file alone.
- **Do not invent.** If you are unsure, put the item under "Could not verify" and say what you would need.
- **Public Adobe documentation only.** No blogs, no partner sites, no forum posts, no training data recalled from memory without a page to back it.
- **Do not suggest** adding beta, early-access or coming-soon features, software prices, or Adobe Consulting Services. Those are out by decision.
- **Say what you did not check.** If you sampled, say how many of the 150 and 517 you covered and which products.

## Format of your answer

Start with five lines: how many connections and services you checked, how many you opened pages for, and your overall verdict.

Then four tables, most serious first:

**Table A. Wrong (fix these).**
| Severity (high, medium, low) | Id | What is wrong | Adobe page URL | Exact quote | Proposed fix |

**Table B. Missing connections.**
| Product A | Product B | What Adobe documents | Adobe page URL | Exact quote | Services a partner would sell |

**Table C. Missing services.**
| Product or connection | Proposed service name | What the partner does | Adobe page URL | Exact quote | One-time or monthly |

**Table D. Housekeeping.**
| Id | Issue (dead link, duplicate, contradiction, renamed) | Detail | Proposed fix |

End with two short lists: **Could not verify** and **Not checked**.

Work through the products in the order they appear in the file. If you run out of room, stop at a product boundary, say where you stopped, and I will ask you to continue.
