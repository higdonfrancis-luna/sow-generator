# RFI Builder step 69, research brief: opening sentences for the products that have none (Nov 10 2026)

Adam, Nov 10: beat Adobe's AI draft of the bank RFP with no AI. One gap: Adobe's tool writes about any product, and this
tool's answers open with sentences that answer the question for seven products only (Brand Visibility, Brand Concierge, AEM
Sites, Real-Time CDP, Target, Customer Journey Analytics, and Marketo Engage with AEM Forms). For every other product an
answer still opens "We would deliver this with ...". Your job is the sentences, and the quotes that back them, for the
products named in your prompt.

## Read first

- `../STEP67.md`, sections "The sentences and their evidence" and "Why Adobe's read better".
- `../part3_research/statements.json`: the `explain_note` and the 31 entries under `explain`. They are the model for what
  you write: read all of them, and their `q` lists.
- `../step67_research/bv.json` and `personalization.json`: the shape of a research file, and `../step67_research/verify.py`,
  the checker your facts must pass.
- For each product, its research file under `sow/canvas/research/` (find it with grep on the product id): its `what`,
  `source` and the `evidence` and `source.url` of its services point you to the right Adobe pages. The product ids and
  names are in `sow/canvas/catalog.json` (`products`).

## What to write, per product

1. **Facts:** six to ten quotes copied word for word from Adobe's public documentation (experienceleague.adobe.com,
   helpx.adobe.com, developer.adobe.com, www.aem.live only), each with `key` (`<product id>.<topic>.<n>`), `product` (the
   id), `url`, `title` (as the tool writes them: "Experience League: <page title>", "Adobe Help: <page title>",
   "Adobe Developer: <page title>", "aem.live: <page title>"), `updated` (the page's last-updated date if it shows one, else
   ""), `quote` and `supports` (one line: what the quote lets us say). A quote is at least 25 characters and is the text as
   the page shows it. Never work around a refusal or a bot check; list what you could not read under `not_found`.
2. **Sentences** (`explain` entries, the same keys as in `statements.json`):
   - one `"kind": "what"`: what the product is and does, in one sentence;
   - one `"kind": "role"`: its part in a "which products would you use" answer, starting with the product's name, short;
   - two to four with `"when"`: the answers to what an RFP asks about that product (how you would implement it, how it
     works, what it reports, how it is governed, what it connects to). `when` lists the words that call for the sentence:
     lower case, three letters or more, word stems are fine ("migrat"), matched from the start of a word.
   - each has `"for": ["<product id>"]`, `"text"`, and `"q"`: the pieces of your quotes that back it. Every `q` entry is
     copied exactly from inside one of your fact quotes (25 characters or more).
3. **Cautions** (`cautions`): anything a partner must not promise (an edition, a region, something Adobe switches on), in a
   sentence each, with the quote. They are for the partner only.

## The voice of a sentence (the client reads it)

- It speaks to the client: "your", "you", "we would". Never "the client", "your client", "the partner" or "customers" for
  the client's own organization.
- It says only what its quotes say. No number, product name or capability that is not in a quote.
- 45 words at most. Plain words. No brackets unless a quote needs them.
- None of these words: beta, trial, legacy, paid, limited availability, maintenance mode, co-innovation, early access,
  preview, coming soon, "not yet", "is planned", "will be available". No dates, no version numbers. If the capability is
  under such a label on Adobe's page, leave it out and put it under `cautions`.
- No em dashes or en dashes anywhere. Straight quotes.

## Output

One JSON file, named in your prompt, in this folder: `{"facts": [...], "explain": [...], "not_found": [...],
"cautions": [...]}`. Before you finish: `python3 ../step67_research/verify.py <your file>` must end ALL QUOTES FOUND, and
check by script that every `q` is inside one of your fact quotes, that no sentence is over 45 words or uses a word from
the list above, and that the file has no dash characters. Write nothing else in the repo, do not run any build, do not
commit. Scratch files go under the scratchpad folder named in your prompt.

Report back in a few lines per product: the sentences you wrote, how many quotes, anything you could not source.
