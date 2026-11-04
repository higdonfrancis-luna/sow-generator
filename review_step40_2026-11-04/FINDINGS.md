# Step 40 review: Start from your client's problem (Nov 4 2026)

Before handing Adam a zip, four independent reviewers tried to break step 40 (matching, state and hand-over, content, UI and hosting), and a skeptic re-ran every finding from scratch. Read-only: nothing was changed. 28 reported, 25 confirmed, 3 rejected. Severity below is the skeptic's.

Nothing here touches the SOW steps or partners' saved work; all seven test suites pass. The findings are about what the new box says and quotes.

## Confirmed

### 1. Chips that say the client already has a product price a full implementation or migration of that product (high, content)

- **Where:** sow/canvas/problems.json refine chips; the 'What you deliver' line from bpSim in patch_step40.py / sow/site/index.html
- **Steps:** Serve sow/site, open the Build canvas. Click 'My client is missing from AI answers', then the refine chip 'My client's site runs on Edge Delivery Services'. Also try: 'My client's products are wrong in AI shopping answers' > 'My client's storefront runs on Edge Delivery'; 'My client's site shows everyone the same thing' (and 'off-brand images', 'customer data is scattered') > 'My client's site runs on Edge Delivery'; 'My client's site is slow...' > 'My client already owns AEM Sites'; 'My client has an SEO backlog...' > 'My client's site is on AEM Sites, not Edge Delivery'; 'My client's team is buried in routine work' > 'My client runs Marketo Engage' / 'runs Workfront' / 'runs AEM Sites'; 'My client's team spends too long pulling reports' > 'My client's journeys run in Journey Optimizer'.
- **Observed:** EDS chip on AI answers: starting services become 'Discovery and solution architecture, Implement AEM Sites on Edge Delivery, SEO-safe content migration, Launch, QA and hypercare...'. Hours go from 152 to 1,792 one-time, and the range is $323,200 to $969,600. 'Storefront runs on Edge Delivery' goes from 232 to 2,096 hours, adding Implement/migration/'Build the Commerce storefront on Edge'. 'Site runs on Edge Delivery' adds about 1,760 hours of EDS implementation and migration (same-site 1,296 to 3,056; customer-data 1,816 to 3,576; off-brand 1,240 to 2,992). 'Already owns AEM Sites' / 'site is on AEM Sites' add 'Site build with components and templates', 'Go-live checklist and cutover' and 'Cloud Manager program'. 'Runs Marketo Engage' adds 'Instance, tracking and email domain setup' and 'CRM sync and field mapping'. 'Runs Workfront' adds 'Discovery, governance and system setup'. 'Journeys run in Journey Optimizer' adds 'Access, sandbox and channel setup' and 'First journeys and campaigns'. The base answers for 'Visitors can't find answers' (2,304 h) and 'store is slow' (1,768 h) also include 'Implement AEM Sites on Edge Delivery' and 'SEO-safe content migration', even though their why text assumes an existing Edge Delivery site. The store answer includes AEM Sites work although AEM Sites is not in the setup.
- **Expected:** When a chip says the client already runs or owns a product, the starting services and fee range should not include building, migrating or launching that product. At most they should include the connection or integration work. Otherwise the partner quotes work, and fees, for a platform the client already has.
- **Skeptic:** I reproduced this against sow/site/index.html, served locally and driven with Playwright. I clicked the problem chips, then the refine chips, and also called bpBase, bpNext and bpSim in the page to get the full lists of service names.

1) "My client is missing from AI answers": the base answer is 5 services, 152 one-time hours + 104 a month, $140,000 to $420,000. After clicking "My client's site runs on Edge Delivery Services" it becomes 12 services, 1,792 one-time hours + 120 a month, $323,200 to $969,600. The new lines are "Discovery and solution architecture", "Implement AEM Sites on Edge Delivery", "SEO-safe content migration", "Launch, QA and hypercare", "Governance and change management" and "Sites Optimizer setup".

2) "My client's products are wrong in AI shopping answers" goes from 232 hours ($148K to $444K) to 15 services and 2,096 hours ($334,400 to $1,003,200) after "My client's storefront runs on Edge Delivery".

3) "My client's team is buried in routine work" goes from 156 to 552 one-time hours after "My client runs Marketo Engage". The added lines are Marketo setup work: "Instance, tracking and email domain setup", "CRM sync and field mapping", "Program templates, emails and landing pages", "Lead scoring, lifecycle and data hygiene" and "User training and setup documentation".

4) "My client's site is slow and losing search traffic": the base answer already has 1,792 hours, including "Implement AEM Sites on Edge Delivery" and "SEO-safe content migration". After "My client already owns AEM Sites" it is 2,472 hours, $420K to $1.26M. That adds "Cloud Manager program, pipelines and access", "Site build with components and templates" and "Go-live checklist and cutover".

5) "My client's team spends too long pulling reports" goes from 204 to 668 hours after "My client's journeys run in Journey Optimizer". That adds "Access, sandbox and channel setup" and "First journeys and campaigns".

Root cause: bpNext switches to the target play and takes that play's full product list (or adds the product in a custom play). bpSim then prices every counted starting line for every product, as if the platform were new. The canvas has no flag for "the client already owns this", so a chip that says the client already runs or owns a product turns into setup, implementation and migration work for that product.

Expected: after such a chip, the services should be the connection or integration work, not a build, migration or launch of a platform the client already has. The answer says the partner can edit everything on the next screen. Even so, the "What you deliver" fee range a partner reads is inflated by 2 to 3 times, and the setup handed to the canvas and the SOW includes the wrong work. That fits the brief's definition of high (wrong products, fees or SOW).

### 2. Plural forms miss keywords, so 'abandoned carts' gets no match (medium, matching)

- **Where:** sow/canvas/patch_step40.py bpScore (t.includes(bpNorm(k)) with no stemming); sow/canvas/problems.json keywords
- **Steps:** Served sow/site, typed each query in #bp-q and pressed Enter (Chromium/Playwright): 'abandoned carts are a big problem for my client', 'my client has lots of abandoned shopping carts', 'my client wants their abandoned carts recovered'.
- **Observed:** All three give 'No match yet.' Problem 12 scores only 2 because bpScore checks keywords as whole phrases on unstemmed text, and ' abandoned carts ' does not contain the keyword ' abandoned cart '. Other inflections fail the same way: 'my client's pages load slowly' and 'our client's site speed is terrible' get no match, 'my client is in banking and members ask complicated questions' gets no match ('bank' is the keyword), and 'my client is an insurer...' doesn't count as insurance ('insurance' is the keyword).
- **Expected:** 'abandoned carts' should match 'My client never follows up on abandoned carts', slow pages should match the slow-site problem, and banking/insurer should match the FSI problem. Keywords should be stemmed the same way the shared words already are.
- **Skeptic:** I reproduced this on a local server of sow/site using Playwright and Chromium: type into #bp-q, press Enter, then read bpScore for every problem. All three abandoned-cart queries in the finding show "No match yet". In each, abandoned-carts scores only 2 against a BP_MIN of 3. The keyword "abandoned cart" scores 7 when typed exactly, and "my client never follows up on abandoned carts" scores 4 and matches. That one only gets through because it repeats words from the problem text.

The cause is in bpScore (sow/canvas/patch_step40.py, line 83): t.includes(bpNorm(k)) matches the keyword phrase as written, with no stemming. bpStem is applied only to the shared words.

More plain-language failures I confirmed:
- "customers abandon their shopping carts": abandoned-carts scores 2, no match.
- "my client's pages load slowly": no match. The top score is 1, and it goes to cant-see-what-works.
- "our client's site speed is terrible": slow-website scores 1, no match.
- "my client's site is slow": slow-website scores 2, no match, which is notable.
- "my client is in banking and members ask complicated questions": fsi-complex-questions scores 2, no match.
- "my client is an insurer and customers call instead": fsi-complex-questions scores 2, no match.

I rate it medium, not high. No wrong products, fees or SOW come out of this; the page just says "No match yet" for common wordings. The no-match message offers the closest problems as a fallback ("Try one of the closest..."), and the right problem is the top scorer in most of these cases, though not for "pages load slowly". Still, a partner typing a natural sentence like "my client's site is slow" or "abandoned carts" is told it isn't on the list, which is misleading.

### 3. 'Two problems here' names a problem the partner never mentioned (medium, matching)

- **Where:** patch_step40.py bpAsk (the cov() two-problem logic with BP_MIN=3)
- **Steps:** Typed each of these: (a) 'ChatGPT gets my client's product details wrong'; (b) 'customer data is all over the place, CRM, warehouse, email'; (c) 'my client has a huge backlog of SEO fixes and no devs'; (d) 'my client's site is slow and their organic traffic is dropping to google ai overviews'; (e) 'Real-Time CDP'.
- **Observed:** (a) 'Two problems here: your client is missing from AI answers, and your client's products are wrong in AI shopping answers' (the keyword 'chatgpt' alone gives problem 0 a score of 5). (b) adds 'your client's messages go out on a calendar' from the single word 'email'. (c) adds 'search traffic is dropping to AI overviews' from 'seo'. (d) claims 'missing from AI answers' but leaves out the slow site the partner did describe. (e) A bare product name gets 'Two problems here: messages go out on a calendar, and customer data is scattered'.
- **Expected:** Claim two problems only when both are clearly in the text, for example by requiring the second hit to have its own distinctive keyword or a score close to the first. One stray keyword should not be enough. Right now, any second hit scoring 3 or more whose products are a subset triggers the claim.
- **Skeptic:** I reproduced this in Chromium against /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/abv/sow/canvas/index.html by typing each phrase into #bp-q and pressing Enter. My script is /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/verify-two/t.js. All five cases match the finding.

(a) "ChatGPT gets my client's product details wrong": problem 5 scores 9 and problem 0 scores 5, from the keyword "chatgpt" alone. The page says "Two problems here: your client is missing from AI answers, and your client's products are wrong in AI shopping answers."

(b) "customer data is all over the place, CRM, warehouse, email": problem 17 scores 9 and problem 11 scores 5, from "email". The page adds "your client's messages go out on a calendar."

(c) "my client has a huge backlog of SEO fixes and no devs": problem 2 scores 4 and problem 4 scores 3. The page names "search traffic is dropping to AI overviews" first. The problem the partner actually described (the SEO backlog) only gets the weaker score.

(d) "...site is slow and their organic traffic is dropping to google ai overviews": problem 2 scores 11 and problem 0 scores 6, so the page claims "missing from AI answers". The slow-site problem (3) scores 3 but is dropped, because only the top two hits are considered for the two-problem claim.

(e) "Real-Time CDP": problem 11 scores 5 and problem 17 scores 4. The page says "Two problems here: your client's messages go out on a calendar, and your client's customer data is scattered."

A control case, "my client's emails go out on a fixed calendar", correctly gives "Heard:" with one problem.

Cause: in bpAsk, any second hit that scores at least BP_MIN=3 and whose products are a subset of the first hit's (cov()) sets bp.two. A single keyword hit is enough to pass, since each keyword adds 3 plus its word count.

Impact: the products and fees come from the covering problem, so they are not wrong. The text, though, tells partners their client has a problem they never described, and in (d) it leaves out one they did describe. That is misleading, so medium.

### 4. A generic chatbot request gets the financial services (FSI) play (medium, matching)

- **Where:** problems.json problem 6 (fsi-complex-questions) keywords 'chatbot', 'concierge', 'conversational', 'ai assistant on site', 'customer questions'
- **Steps:** Typed 'my client wants a chatbot on their site', then 'my client wants a chatbot and also wants to show up in ChatGPT'.
- **Observed:** The first gets 'Heard: your client's customers call instead of finding answers', recommending BRAND VISIBILITY + BRAND CONCIERGE (the FSI play). The second gets 'Two problems here: ... missing from AI answers, and your client's customers call instead of finding answers', also the FSI play. The client was never said to be in financial services or insurance. The general site-answers problem 7 ('chat on site', Brand Concierge + Edge Delivery) loses because 'chatbot' and 'conversational' are keywords only on the FSI problem 6.
- **Expected:** Without an FSI word, a chatbot or concierge request should match 'Visitors can't find answers on my client's site' (problem 7). The FSI play should need an industry signal.
- **Skeptic:** I reproduced this on sow/site/index.html (file://, Playwright, desktop viewport).

What I saw:
- "my client wants a chatbot on their site" answers "Heard: your client's customers call instead of finding answers" and recommends BRAND VISIBILITY + BRAND CONCIERGE. That play id is `fsi`, and catalog.json gives it the sub "Financial services and insurance". The answer lists BV, BC and CDN, with 5 services including Implement Brand Concierge (752 one-time hours + 104 a month).
- "my client wants a chatbot and also wants to show up in ChatGPT" answers "Two problems here: your client is missing from AI answers, and your client's customers call instead of finding answers", with the same FSI play.
- "my client wants an AI concierge on their website" also gets the FSI play.
- "my client wants conversational search on their site" and "visitors can't find answers on my client's site, they want a chatbot" correctly get problem 7 (site-visitors-cant-find-answers: Create your own play with Brand Concierge + Edge Delivery).

Cause: in problems.json, the bare intent words 'chatbot', 'concierge', 'conversational' and 'ai assistant on site' are keywords only on fsi-complex-questions. Problem 7 only has 'chat on site' and 'conversational search'. So a chatbot request with no industry word scores higher on the FSI problem.

Why I count it as a real defect and not taste: the data's own design treats FSI as an industry signal. Problem 7's refine list has "My client is in financial services or insurance", which switches to the fsi play, adds bv and removes eds, and PROBLEMS.md (line 65) says the same. A non-FSI client asking for a chatbot skips that path and lands on the FSI industry play. The Heard line also tells the partner something they never said (customers calling in), and the setup drops Edge Delivery in favor of BV plus CDN.

Expected: with no FSI or industry word, a chatbot or concierge request should match problem 7, and the FSI play should need an industry signal or the refine chip.

Severity is medium, not high: the products shown are Adobe-documented and the partner can edit them on the next screen. But the recommendation and the Heard text are misleading to a partner.

Scratch script: /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/matching-fsi-chatbot-x7/r.js

### 5. Asking about revenue from ChatGPT matches 'missing from AI answers', not 'can't tie AI traffic to revenue' (medium, matching)

- **Where:** patch_step40.py bpScore; problems.json problem 0 keyword 'chatgpt' vs problem 1 keywords
- **Steps:** Typed 'my client wants to know how much revenue comes from chatgpt'.
- **Observed:** Scores [0:5, 1:1]. The answer says 'Heard: your client is missing from AI answers' and recommends BRAND VISIBILITY ON ITS OWN (5 services). The bare keyword 'chatgpt' on problem 0 outweighs 'revenue', and problem 1 only has the phrase 'chatgpt traffic'. 'They want to know if AI is sending them any sales' gets no match at all ([1:2]).
- **Expected:** Problem 1 (the CJA play, Brand Visibility + Customer Journey Analytics), which is the attribution question the partner asked.
- **Skeptic:** I reproduced this in the built page (sow/site/index.html) using Playwright and the page's own bpScore and bpAsk.

1. "my client wants to know how much revenue comes from chatgpt" scores [0:5, 1:1, 8:1]. The only hit is problem 0, since problem 1 scores 1, which is under BP_MIN=3. The page answers "Heard: your client is missing from AI answers" and recommends BRAND VISIBILITY ON ITS OWN (play abv, products bv and cdn).
2. "my client wants to know if chatgpt drives sales" gives the same wrong answer: [0:5, 1:1].
3. "They want to know if AI is sending them any sales" scores [1:2, 0:1, ...], so there is no match. The no-match view does list "My client can't tie AI traffic to revenue" first among the closest problems, so this case is only a mild miss.

Cause (patch_step40.py, bpScore): the bare keyword "chatgpt" on problem 0 scores 3+1=4, plus 1 for the shared word "chatgpt" in problem 0's text. Problem 1 only has the keyword phrase "chatgpt traffic". Neither "revenue" nor "sales" is one of its keywords: its list has "ai revenue" but not "revenue" alone. "revenue" scores 1 only as a word shared with the chip text, and "sales" scores 1 only for queries that contain it.

Expected: problem 1 (the CJA play: Brand Visibility + CJA + CDN), which is the attribution question the partner asked. Observed: the page says with confidence that it heard a different problem and recommends a smaller setup that doesn't answer it. The "My client owns Customer Journey Analytics" refine chip can recover the CJA play, but only if the partner notices the mismatch.

Medium, not high: the page doesn't break and the fees it shows match the setup it shows. The defect is a misleading match on a natural way to ask the question.

### 6. Two problems in one question: the second is dropped even when the setup covers both (medium, matching)

- **Where:** patch_step40.py bpScore and BP_MIN (single words such as 'slow' or 'insurer' never reach 3)
- **Steps:** Typed (a) 'my client is missing from ai answers and their site is slow'; (b) 'my client's website is slow and they don't show up in ChatGPT'; (c) 'my client is an insurer, they're missing from AI answers and customers keep calling'.
- **Observed:** (a) and (b) give 'Heard: your client is missing from AI answers', BRAND VISIBILITY ON ITS OWN. The slow-site problem scores only 2, below BP_MIN, so it is not a hit and there is no 'Show another setup' button. (c) gives BV on its own, and the FSI problem scores 2. In each case the AEM play or the FSI play would cover both problems.
- **Expected:** (a) and (b): 'Two problems here', with the BV + Sites Optimizer and Edge Delivery play. (c): the BV + Brand Concierge FSI play.
- **Skeptic:** I reproduced this two ways: by running the page's own scoring code (copied from bpScore and BP_MIN in sow/canvas/patch_step40.py) against problems.json, and in Chromium against the built sow/site/index.html served locally.

Scores (BP_MIN = 3):
- (a) 'my client is missing from ai answers and their site is slow': ai-answers-missing 8, slow-website 2, organic-traffic-falling 2, fsi 2.
- (b) 'my client's website is slow and they don't show up in ChatGPT': ai-answers-missing 5, slow-website 2.
- (c) 'my client is an insurer, they're missing from AI answers and customers keep calling': ai-answers-missing 8, fsi-complex-questions 2.

What the browser showed, all three times: 'Heard: your client is missing from AI answers', RECOMMENDED: BRAND VISIBILITY ON ITS OWN (Brand Visibility + CDN). There was no 'Two problems here' line and no 'Show another setup' button (zero [data-bpa=another] elements).

Why: the slow-website keywords are multi-word phrases ('slow site', 'page speed'), so 'site is slow' or 'website is slow' matches none of them. Only the shared words 'site' and 'slow' score, 1 point each. 'insurer' doesn't match 'insurance', and 'keep calling' doesn't match 'call', so the FSI problem gets only 2.

Both problems sit inside a larger setup:
- slow-website products [bv, so, eds, cdn] include all of ai-answers-missing's [bv, cdn].
- fsi-complex-questions products [bv, bc, cdn] include them too.

If the second problem had scored 3 or more, the existing cover logic would have answered 'Two problems here' with the AEM or FSI play.

Effect for a partner: the second problem they typed is dropped without any notice and no other setup is offered. The answer is still correct for the first problem (Brand Visibility only), so the products and fees aren't wrong, just incomplete. That makes it medium, not high.

### 7. Common phrasings of listed problems get 'No match yet' (medium, matching)

- **Where:** problems.json keywords; patch_step40.py bpScore/bpStem
- **Steps:** Typed each: 'My customer runs AEM and wants to rank better in Google'; 'my client wants to reduce call center volume'; 'my client wants to personalise the website'; 'my client wants to A/B test their homepage'; 'my client's brand isn't cited by LLMs'; 'my client is invisible to LLMs'; 'my client doesn't show up in Chat GPT'; 'my client doesn't know which pages drive conversions'; 'my clietn's webiste is slwo'; 'personalizaton'.
- **Observed:** Every one shows 'No match yet. That doesn't match a problem on our list.' ('Chat GPT' with a space, 'personalise', 'A/B test' vs keyword 'a/b testing', 'LLMs' vs 'llm visibility', 'rank' vs 'search rankings', 'call center' vs 'call deflection'.)
- **Expected:** The obvious problem: SEO/search (2 or 3), FSI or site answers (6/7), personalization (10), missing from AI answers (0), channels and pages (16), slow site (3). Add spelling variants (chat gpt, personalise, llm/llms, rank) or loose matching for near-miss words and simple typos.
- **Skeptic:** I reproduced all 10 phrasings from the finding: I served sow/canvas over a local http server, typed each phrase into #bp-q with Playwright and pressed Enter. Every one showed "No match yet. That doesn't match a problem on our list." I also read the scores straight from the page's own bpScore. No problem reached BP_MIN=3 for any phrase:
- "rank better in Google": nothing scored.
- "reduce call center volume": only problem 6, at 1.
- "personalise the website": problems 3, 10 and 17, at 1 each.
- "A/B test their homepage": nothing scored.
- "cited by LLMs": only problem 14 (off-brand images), at 1.
- "invisible to LLMs": nothing scored.
- "show up in Chat GPT": only problem 10 (personalization), at 1.
- "which pages drive conversions": only problem 16, at 2.
- the typo sentence and "personalizaton": nothing scored.

For comparison, "my client wants to personalize the website" (US spelling) matches problem 10 with a score of 5. So the British spelling alone turns a hit into a miss.

Causes in the step 40 code (sow/canvas/index.html, around lines 716 to 783):
- Keywords count only as whole substrings after normalizing. "Chat GPT" normalizes to "chat gpt", which doesn't contain "chatgpt". "llms" doesn't contain "llm visibility". "a b test" doesn't contain "a b testing". "rank" doesn't contain "search rankings".
- bpStem only strips ing/ed/es/s, so there is no spelling-variant or fuzzy handling.

The no-match screen also offers misleading "closest" chips in two of these cases. "Chat GPT" suggests "My client's site shows everyone the same thing" (personalization), and "cited by LLMs" suggests "off-brand images". The correct problem 0 (missing from AI answers) is not offered first in either case.

A partner can recover through the chips or "See all problems", and nothing produces wrong products or fees. That makes this medium (misleading or confusing to a partner), not high.

The real defect is the common variants: Chat GPT, LLM/LLMs, personalise, A/B test, rank, call center. Typo handling ("slwo", "clietn") is closer to a wish than a defect.

My repro script is /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/repro/t.js. Its extra control phrase after the 10 failed only because the input was hidden once a match was shown, not because of the matcher.

### 8. A stale answer stays on the picker after the canvas changes, and Build this then gives a different total from the one it quoted (medium, state)

- **Where:** sow/canvas/patch_step40.py, the bpAnswerHTML/bpRender/'build' handler (built into sow/canvas/template.html, sow/canvas/index.html and sow/site/index.html around lines 716-800). pick() (line ~663) and the confirm-yes handler for Change play / Start over (line ~824) return to the picker without calling bpRender or resetting bp.view.
- **Steps:** Serve sow/site over http. Saved state is {v:2,rate:150,months:24,cur:'EUR'}. 1) On the picker, click the problem chip 'My client is missing from AI answers' and wait for the answer, which reads '152 one-time hours + 104 a month, €397,200 at €150 an hour over 24 months.' 2) Don't click Build this. Click the Brand Visibility play card instead. 3) On the canvas, click Start over and then Clear everything. This resets months to 12 and currency to USD and returns to the picker. 4) The picker still shows the old answer. Click Build this. A second route: with rate 150, ask the same problem ($210,000 at $150), click a play card, type 300 in the rate box and pick Large, click Change play and confirm, then click Build this on the old answer.
- **Observed:** After Start over or Change play, the picker shows the answer exactly as it was first worked out, with the old rate, size, months and currency. Clicking Build this puts the setup on the canvas at a different total. Route 1: the answer says €397,200 at €150 an hour over 24 months, but the canvas shows $210,000 (12 months, USD). Route 2: the answer says $210,000 at $150 an hour, but the canvas shows $717,600 (rate 300, Large). The same happens when a rate is entered on the canvas after a no-rate answer: the picker keeps saying '$X to $Y at $100 to $300 an hour; enter your rate on the next screen'.
- **Expected:** An answer quotes the fees Build this will put on the canvas. Either the answer is recomputed (bpRender) whenever the picker shows again, from render() when play() goes back to null, or bp is reset to the start view when a play card is picked, after Change play and after Start over. Nothing re-renders #bp-body when the canvas's st.rate, st.size, st.months, st.cur or st.eff change, so the answer's bpSim numbers go stale.
- **Skeptic:** I reproduced route 2 in Chromium with Playwright, serving sow/site over http with saved state {v:2,rate:150}. Script: /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/repro-stale/r.js

Steps:
1. Click the problem chip "My client is missing from AI answers". The answer reads "152 one-time hours + 104 a month, $210,000 at $150 an hour over 12 months."
2. Click a play card, enter 300 in the rate box and pick Large.
3. Click Change play, then confirm.

Observed: back on the picker, the answer is word for word the same, still "$210,000 at $150 an hour". Clicking Build this puts a canvas total of $717,600 on screen ($84,000 one-time + $52,800 a month for 12 months).

Expected: the answer should quote the fees that Build this will put on the canvas.

Cause in sow/site/index.html (same code in template.html and canvas/index.html):
- The fee text is worked out only inside bpAnswerHTML, which reads st.rate, st.months and st.size through bpSim. It runs only when bpRender() is called.
- pick() (line 663) and the confirm-yes handler (line 824, used by both Change play and Start over) call render() but never bpRender(). They also leave bp.view at 'answer', so #bp-body keeps the HTML from when the answer was first worked out.
- The 'build' handler (line 799) applies bp.setup under the current st, so the quote and the canvas disagree.

I didn't run route 1 (Start over resetting months and currency), but it goes through the same confirm-yes handler with no bpRender, so it should go stale the same way.

This is real and a partner can hit it in normal use: get an answer, look at a play, set a rate, come back. It's medium rather than high because the canvas, and so the SOW, comes out right. Only the quote shown before Build this is stale and misleading.

### 9. Why text still describes Edge Delivery after the refine chip takes Edge Delivery out (medium, content)

- **Where:** bpAnswerHTML in sow/site/index.html (why = p.why of the original problem plus new connection labels); problems site-visitors-cant-find-answers and seo-fix-backlog
- **Steps:** 1) Click 'Visitors can't find answers on my client's site' (via See all problems), then 'My client is in financial services or insurance'. 2) Click 'My client has an SEO backlog and no developers', then 'My client's site is on AEM Sites, not Edge Delivery'.
- **Observed:** 1) The answer says 'Edge Delivery Services leaves the setup.' The boxes show only Brand Visibility and Brand Concierge, yet the first Why bullet still reads 'Brand Concierge loads on an Edge Delivery site in a block the partner builds and can crawl the site's sitemap...'. 2) The answer says '...Edge Delivery Services leaves the setup', yet the first Why bullet still reads 'Sites Optimizer connects to the Edge Delivery site's code repository and content source...'.
- **Expected:** The Why text should match the setup on screen. Drop or replace the problem's base why sentence when a refine removes the product it describes.
- **Skeptic:** I reproduced this with Playwright on a file:// load of sow/site/index.html. The script is /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/content-verify/t.js.

Cause: in bpAnswerHTML, the Why list is always p.why (the original problem's sentence) plus the labels of any new connections (bpConns(s) minus bpConns(bpBase(p))). Nothing removes or replaces the base sentence when a refine takes a product out.

Case 1: See all problems, then "Visitors can't find answers...", then "My client is in financial services or insurance". The Updated line says "Edge Delivery Services leaves the setup." The boxes show only Brand Visibility, i, Brand Concierge. The first Why bullet still reads "Brand Concierge loads on an Edge Delivery site in a block the partner builds and can crawl the site's sitemap...".

Case 2: "My client has an SEO backlog and no developers", then "My client's site is on AEM Sites, not Edge Delivery". The Updated line says "Fixes land in AEM author, and Edge Delivery Services leaves the setup. ... the CDN box leaves the setup." The boxes show BV, Sites Optimizer, AEM Sites. The first Why bullet still reads "Sites Optimizer connects to the Edge Delivery site's code repository and content source...", and a new bullet "Sites Optimizer writes approved fixes to AEM author" follows it, so two bullets say opposite things.

Also seen in case 2: a bullet "Optimize at Edge on AEM's Adobe-managed CDN, AI agents only." appears right after the page says the CDN box left the setup. That is a smaller, related mismatch.

Products, hours and fees follow the refined setup, so the numbers are right. The fault is the explanation contradicting the setup on screen, which would confuse a partner reading it to a client. Medium.

### 10. Financial services chip lost its industry, so non-financial clients get the FSI play (medium, content)

- **Where:** sow/canvas/problems.json fsi-complex-questions chip 'My client's customers call instead of finding answers' (starter: true)
- **Steps:** Type 'My client is a retailer; customers call the store instead of finding answers' and submit (or click the starter chip 'My client's customers call instead of finding answers').
- **Observed:** Heard: 'your client's customers call instead of finding answers.' Recommended: BRAND VISIBILITY + BRAND CONCIERGE (the FSI play, 'Financial services and insurance'), with Implement Brand Concierge and $200,000 to $600,000. The reviewed problem is specific to accounts, policies or rates. Neither the chip nor the heard line says financial services, and a retailer is routed to the FSI play.
- **Expected:** The chip and heard line should keep the financial services / insurance qualifier, as the reviewed problem 7 does ('accounts, policies or rates'). Non-FSI questions like this should route to 'Visitors can't find answers' (Brand Concierge + Edge Delivery).
- **Skeptic:** I reproduced this on the built page, /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/abv/sow/canvas/index.html, served over local http and driven with Playwright. My script is in /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/repro-fsi/t.js.

Steps and results:
1) I typed "My client is a retailer; customers call the store instead of finding answers" in #bp-q and submitted. The page said "Heard: your client's customers call instead of finding answers." It recommended BRAND VISIBILITY + BRAND CONCIERGE (play fsi: bv, bc, cdn) with 5 starting services including Implement Brand Concierge. It showed 752 one-time hours + 104 a month, "$200,000 to $600,000 at $100 to $300 an hour over 12 months".
2) Typing "customers call instead of finding answers" gave the same result.
3) Clicking the starter chip "My client's customers call instead of finding answers" gave the same result.

Nowhere in the answer (heard line, why text or services) does it say financial services or insurance, so a retail partner gets no hint that this is the FSI play.

Cause: in sow/canvas/problems.json, the entry fsi-complex-questions has the problem "...complicated questions about accounts, policies or rates...". Its chip was shortened to "My client's customers call instead of finding answers" (starter: true), which drops the industry. The answer quotes the chip through bpYou(p.chip) at patch_step40.py line 114, so the heard line loses the industry too. Because the page also matches on shared words, a generic non-FSI query lands on this entry instead of site-visitors-cant-find-answers ("Visitors can't find answers on my client's site": Brand Concierge + Edge Delivery Services, play custom). That entry is the right fit for a retailer and offers FSI only as a refine chip.

Mitigation: the approved mockup sow/mockups/nov3_problem/mock_problem.js line 36 uses the same chip wording, so the label itself was signed off. What the mockup didn't settle is that a non-financial client gets the FSI play and its Brand Concierge build hours, with no industry qualifier shown. A partner could hand that setup to a retailer by mistake. The fees and hours are computed correctly for the FSI play, and the partner can refine or switch plays, so I rate it medium rather than high.

### 11. Most of the reviewed connections never appear in the answer, and some 'i' markers show a different connection than the Why text (medium, content)

- **Where:** bpAnswerHTML boxes row (shows an 'i' only between adjacent boxes) and the why list (base connections are excluded)
- **Steps:** Click 'My client's search traffic is dropping to AI overviews' (and also 'My client can't tie AI traffic to revenue', 'My client's teams use off-brand images', 'My client can't see which channels work'). Hover the 'i' markers and read the Why list.
- **Observed:** Organic traffic: the reviewed connections are bv-eds, so-eds and cdn-bv, but only one 'i' shows (Sites Optimizer to Edge Delivery). Brand Visibility and CDN sit next to the others with a blank gap, and their labels appear nowhere. AI traffic to revenue: no line between CJA and CDN, so the cdn-bv log forwarding the Why depends on is not shown. Off-brand images: the Why describes Journey Optimizer's Email Designer picking assets from AEM Assets (aemassets-ajo), but the only marker next to Journey Optimizer is 'Tagged, published AEM Content Fragments reused in Journey Optimizer' (aemsites-ajo, not in the reviewed list). Channels: the Why centers on Journey Optimizer data in CJA (ajo-cja), but the marker shown is aemsites-ajo.
- **Expected:** The 'How they connect' boxes should show the problem's reviewed connections, including non-adjacent ones like bv-eds, cdn-bv and aemassets-ajo, so the Brand Visibility and CDN boxes don't look unconnected and the markers match the Why text.
- **Skeptic:** I reproduced this in Chromium against sow/canvas/index.html. My script is /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/repro-conn/t.js. It clicks each problem chip, then dumps the .bp-prods children with each 'i' title, plus the Why list.

Cause: in patch_step40.py, bpAnswerHTML draws an 'i' only when the catalog has a connection between box k-1 and box k. Otherwise it draws a blank bp-gap. Connections between boxes that aren't next to each other are never shown. The Why list also leaves out the base play's own connection labels.

What I saw:
1. Search traffic dropping to AI overviews. Boxes: Brand Visibility [gap] Sites Optimizer [i: so-eds] Edge Delivery Services [gap] CDN. PROBLEMS.md lists bv-eds, so-eds and cdn-bv, but bv-eds and cdn-bv appear nowhere. Brand Visibility and CDN look unconnected.
2. Can't tie AI traffic to revenue. Boxes: Brand Visibility [i: bv-cja] Customer Journey Analytics [gap] CDN. The cdn-bv log forwarding that the Why text relies on is not shown.
3. Off-brand images. Boxes: AEM Assets [i: aemsites-aemassets] AEM Sites [i: aemsites-ajo 'Tagged, published AEM Content Fragments reused in Journey Optimizer'] Journey Optimizer. The Why text describes Email Designer picking assets from AEM Assets, which is the aemassets-ajo connection, but that connection is never shown. The marker next to Journey Optimizer describes a different integration.
4. Can't see which channels work. Boxes: CJA [i: aemsites-cja] AEM Sites [i: aemsites-ajo] Journey Optimizer. The Why text is about ajo-cja, which is not shown. The marker describes Content Fragments instead.

Expected: the markers show the problem's reviewed connections and match the Why text.

Why medium: the products, hours and fees are not affected, and the connection labels are only in hover tooltips. But blank gaps leave Brand Visibility and CDN looking unconnected, which a partner can see without hovering. Two answers show a tooltip for a connection the Why text doesn't describe, which could mislead a partner explaining the setup to a client. I did not check whether 'Build this' draws every connection on the canvas.

### 12. 'not' and other negations are ignored (low, matching)

- **Where:** patch_step40.py bpScore (no handling of negation; 'not' is only a stop word)
- **Steps:** Typed 'my client is not missing from AI answers, they need personalization'.
- **Observed:** 'Heard: your client is missing from AI answers', BRAND VISIBILITY ON ITS OWN, scored 8 against 4 for personalization.
- **Expected:** The personalization problem ('site shows everyone the same thing'), or at least not the problem the partner explicitly ruled out.
- **Skeptic:** I reproduced this in Chromium against /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/abv/sow/canvas/index.html. I typed the text into #bp-q and clicked the Ask button.

**What happened:** I entered "my client is not missing from AI answers, they need personalization". The page answered "Heard: your client is missing from AI answers. Here's the setup you can offer for that." and recommended BRAND VISIBILITY ON ITS OWN (Brand Visibility plus CDN). Calling bpScore directly gave these scores: ai-answers-missing 8, same-site-for-everyone 4, organic-traffic-falling 2, product-pages-ai 2. The text "my client needs personalization" on its own correctly gives same-site-for-everyone 4.

**Cause:** bpScore (patch_step40.py line 83; index.html around line 782) adds up keyword substring hits and shared words. It never looks at "not" or "isn't" before a phrase, so a problem the partner explicitly ruled out can still win.

**Why low, not medium:**
- The page shows what it matched ("Heard: ..."), and the refine and problem chips let the partner switch.
- Wrong products or fees never reach the SOW without the partner seeing it first.
- Partners rarely describe what a client does NOT need.
- Simply blocking any phrase after "not" would break common problem wording, because many real problems are phrased as negatives. The tool's own placeholder is "My client doesn't show up when people ask ChatGPT...", and "not showing up in AI answers" is another example.

So this is a real limit of the no-AI keyword matcher that can mislead in contrived cases, not a broken feature. If it gets fixed, a narrow rule is safer: drop a problem only when a negation sits directly before that problem's own keyword phrase, and check that the placeholder still matches.

My scratch scripts are in /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/negation/ (t.js, t2.js). I made no changes under abv/.

### 13. Product names match inconsistently, and some matches assert a problem (low, matching)

- **Where:** problems.json keywords ('marketo', 'b2b', 'coworker', 'concierge'); bpAnswerHTML heard text
- **Steps:** Typed 'my client uses AEM', 'my client owns CJA', 'Journey Optimizer', 'Workfront', 'my client wants Brand Visibility', then 'my client uses Marketo', 'Brand Concierge', 'Coworker', 'my client is a B2B software company'.
- **Observed:** The first five get 'No match yet'. Marketo, B2B and Brand Concierge get 'Heard: your client's B2B leads go cold' or 'Heard: your client's customers call instead of finding answers' (the FSI play). Coworker gets 'Heard: your client's team is buried in routine work'. The partner stated no such problem.
- **Expected:** Product names should be handled consistently, either all matched to a related problem without 'Heard: <problem>' wording or all routed to the no-match chips. The page should not tell the partner they described a problem they did not.
- **Skeptic:** I reproduced this in Chromium (Playwright, reduced motion) on the built page /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/abv/sow/canvas/index.html. For each input I typed it into #bp-q, pressed Enter and read #bp-body.

- **No match:** 'my client uses AEM', 'my client owns CJA', 'Journey Optimizer', 'Workfront', 'my client wants Brand Visibility', 'my client uses Adobe Commerce' and 'Target' all show "No match yet. That doesn't match a problem on our list."
- **Marketo and B2B:** 'my client uses Marketo' and 'my client is a B2B software company' both show "Heard: your client's B2B leads go cold. Here's the setup you can offer for that." with Recommended: Create your own play: Marketo and Real-Time CDP.
- **Brand Concierge:** shows "Heard: your client's customers call instead of finding answers." with Recommended: Brand Visibility + Brand Concierge.
- **Coworker:** shows "Heard: your client's team is buried in routine work." with Recommended: Coworker on its own.
- **Real-Time CDP (an extra case I tried):** shows "Two problems here: your client's messages go out on a calendar, and your client's customer data is scattered."

Cause: in problems.json, product names appear as keywords only for some problems ('marketo' and 'b2b' in b2b-leads-go-cold, 'concierge' in fsi-complex-questions, 'coworker' in team-busywork). 'Real-Time CDP' matches through shared words (real, time, cdp). AEM, CJA, Journey Optimizer, Workfront, Target, Commerce and Brand Visibility appear in no keyword list. bpScore counts 3 plus the keyword's word count for a keyword hit, and BP_MIN is 3, so one product-name keyword is enough for a match. bpAnswerHTML then always says "Heard: <problem chip>" (or "Two problems here"), so the page tells the partner their client has a problem they never described.

Impact: the matched setups are sensible (Marketo leads to the Marketo play, Coworker to Coworker). Nothing is mispriced, the page doesn't break, and the partner can edit everything later. The real harms are the "Heard:" wording, which asserts a problem the partner never stated, and the inconsistency: typing Brand Visibility, the product this whole tool is about, gets "No match yet". That is a narrow, misleading-wording defect, so I rate it low, as the reviewer did.

Scratch script: /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/repro-names/t.js

### 14. Generic keywords pull queries to narrower problems, and ties go to list order (low, matching)

- **Where:** patch_step40.py bpAsk sort (stable sort by score only); problems.json shared keywords 'attribution', 'dam', 'pipeline', 'product pages', 'ai shopping'
- **Steps:** Typed 'our client is a retailer with slow product pages', 'my client wants AI shopping assistant on their ecommerce site', 'my client needs better attribution', 'my client's DAM is a mess', 'my client wants to know which campaigns drive pipeline'.
- **Observed:** Slow product pages: 'products are wrong in AI shopping answers' (keyword 'product pages'). AI shopping assistant on the site: 'products are wrong in AI shopping answers' (BV + Commerce) instead of shopping help (Brand Concierge). Attribution: a 4:4 tie, resolved by index to 'can't tie AI traffic to revenue' over 'can't see which channels work'. DAM: a 4:4 tie, resolved to 'content takes too long to launch' over 'teams use off-brand images'. Campaigns and pipeline: 'B2B leads go cold' over 'which channels work'.
- **Expected:** The broader or more accurate problem in each case: slow site or store, site answers or shopping help, channels and attribution (16), off-brand assets or the DAM. Ties should not be broken silently by array order.
- **Skeptic:** I reproduced this by calling bpScore and bpAsk in Playwright on file sow/canvas/index.html. All five scores match the finding. The clearest real miss is "our client is a retailer with slow product pages". It scores product-pages-ai at 6 because of the keyword 'product pages'. slow-website, storefront-hard-to-update and cant-see-what-works each score only 1, below BP_MIN=3, so product-pages-ai is the only hit. The page then says "Heard: your client's products are wrong in AI shopping answers" and recommends BV + Commerce. There is no "Show another setup" button, so the partner never sees the slow-site play.

"my client wants AI shopping assistant on their ecommerce site" also lands on product-pages-ai (7). storefront-hard-to-update scores 5 and abandoned-carts 4. fsi-complex-questions and site-visitors-cant-find-answers (the Brand Concierge problems) are not in the top four at all. A refine chip, "My client wants shopping help on the site", does offer Brand Concierge.

The ties are real but less harmful than described. Attribution scores 4:4 (index 1 ai-traffic-revenue against 16 cant-see-what-works) and DAM scores 4:4 (13 content-too-slow against 14 off-brand-assets). The stable sort picks the lower index, but in both cases the page shows "Show another setup", so the other problem is one click away. The tie is never silent in the sense of being hidden.

"which campaigns drive pipeline" goes to b2b-leads-go-cold at 4 (keyword 'pipeline'). cant-see-what-works scores 1, below BP_MIN, so it is not offered. That outcome is arguably acceptable for a B2B query.

The "Heard: ..." line always shows what the page understood, so a partner can see the mismatch and ask again. That keeps this low: it is a narrow weakness in the keyword matching, not wrong fees or a broken page.

### 15. 'Show another setup' flips between identical setups (low, matching)

- **Where:** patch_step40.py bpAsk (cov both ways, bp.i=1) and the 'another' click handler
- **Steps:** Typed 'my client has a huge backlog of SEO fixes and no devs', then clicked 'Show another setup' several times.
- **Observed:** hits=2,4, and both problems have the same products (BV + Sites Optimizer + Edge Delivery + CDN). Each click shows the same play, products, 12 services and fees, and only the 'Heard' line and refine chips change. Because cov() is true both ways for identical product lists, the first answer leads with the lower-scored problem's refine chips (bp.i=1). The 'Show another' button on a two-problem answer also cycles to the narrower setup, with the 'Two problems' line dropped.
- **Expected:** Skip or merge hits whose setup (bpKey of bpBase) equals the current one, so 'Show another setup' always shows a different setup, and lead with the higher-scored problem when both setups are equal.
- **Skeptic:** I reproduced this in Chromium against the built page, sow/canvas/index.html. The script is /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/repro-another/t.js.

Steps: type "my client has a huge backlog of SEO fixes and no devs", press Enter, then click "Show another setup" twice.

What I saw:
- The match finds two problems, hits=[2,4] (organic-traffic-falling and seo-fix-backlog). problems.json gives both the same products: bv, so, eds and cdn.
- The first answer has bp.i=1 and bp.two=true. It reads "Two problems here: ...search traffic dropping..., and ...SEO backlog...". Its refine chips come from problem 4, the lower-scored hit, because cov() is true in both directions and the first test in bpAsk sets bp.i=1.
- Click 1 sets i=0 and two=false. The answer becomes "Heard: ...search traffic is dropping...". The play, the four products, the 12 starting services, the 1,792 one-time hours + 120 a month and the $323,200 to $969,600 range are all identical. Only the Heard line and the refine chips change (AEM Sites, AEM Assets, many pages).
- Click 2 sets i=1 again. The answer is "Heard: ...SEO backlog...", with the same setup and fees and the problem 4 chips. The "Two problems" framing is gone for good.

Expected: "Show another setup" should show a different setup. Hits with the same setup could be merged or skipped, or the button left out when every hit gives the same setup.

Impact: a partner sees the same products, services and fees under "another setup", which is mildly misleading. No product or fee is wrong, the only thing that really changes is which refine chips appear, and nothing breaks. So this is low.

The finding's side point about which problem leads is weaker. For this input, problem 4 (SEO backlog) arguably matches the typed text better, so leading with it is not clearly wrong. The real defect is the button cycling between identical setups and dropping the two-problem framing.

### 16. Coworker-CJA label promises an 'AI-channel readout' when Brand Visibility isn't in the setup (low, content)

- **Where:** catalog.json connection cw-cja label shown as an appended Why bullet and as an 'i' title
- **Steps:** Click 'My client's team is buried in routine work', then 'My client owns CJA'. Or click 'My client's team spends too long pulling reports' and hover the 'i'.
- **Observed:** Why bullet / tooltip: 'Coworker Chat reads CJA directly (Adobe-built); partner Skills add the client's AI-channel readout.' The setup is Coworker + CJA only, with no Brand Visibility and no AI channel.
- **Expected:** In setups without Brand Visibility, the label should not mention an AI-channel readout (for example, 'partner Skills add the client's readouts').
- **Skeptic:** I reproduced this with Playwright on file:///tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/abv/sow/canvas/index.html. My script is in /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/cwcja/t.js.

Steps: in #bp-q, type "My client's marketing team spends too much time on routine work inside Adobe apps" and press Enter. This matches team-busywork, whose chip is not a starter chip, so typing is the way to reach it. Then click the refine chip "My client owns CJA".

Observed: the answer says "Recommended: Create your own play: Coworker and CJA" and shows only those two products. Under Why they work together, the bullet added from the connection label reads "Coworker Chat reads CJA directly (Adobe-built); partner Skills add the client's AI-channel readout." The only "i" tooltip on the product row has the same text.

The text comes from catalog.json cw-cja "label" at line 497. That entry's "how" (line 471) also says "AI-channel measures", and its prereqs ask for "AI referral fields (and the Brand Visibility dataset for agent traffic)". So the connection was written for the Brand Visibility plays.

Step 40 now also shows the label in setups with no Brand Visibility. The appended Why bullets are built in patch_step40.py line 117 and the "i" title at line 116. The slow-reporting problem (cw + cja) has the same "i" tooltip, but its own "why" text is generic and fine.

Expected: in a setup without Brand Visibility, a partner should see a generic readout description. As shown, the bullet says the client will get an AI-channel readout, which this setup doesn't deliver. The products, fees and SOW are not affected. It is only misleading wording, so low.

### 17. Brand Visibility to CJA measurement is offered with no CDN, and without the warning another chip gives (low, content)

- **Where:** fsi-complex-questions refine 'My client licenses CJA'; cant-see-what-works refine 'My client wants AI assistants included as a channel'
- **Steps:** Click 'My client's customers call instead of finding answers', then 'My client licenses CJA'. Separately, click 'My client can't see which channels work', then 'My client wants AI assistants included as a channel'.
- **Observed:** Both add 'Connect Brand Visibility and CJA measurement' and the Why bullet 'Agent traffic reaches CJA as an Experience Platform dataset...'. The CDN box has left (Create your own play), and no note is shown. The slow-reporting chip for the same situation does say 'Its CJA source needs CDN logs, which only the CJA play offers as a CDN box.'
- **Expected:** Show the same caveat wherever Brand Visibility to CJA is added without CDN log forwarding, because the agent-traffic dataset needs CDN logs.
- **Skeptic:** I reproduced half of this exactly. The other half is overstated. I loaded /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/abv/sow/site/index.html in Playwright and kept the script in /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/repro-cdn/t.js.

(1) Reproduced as reported: the "can't see which channels work" problem. I typed "my client can't see which channels and pages actually drive results" and clicked "My client wants AI assistants included as a channel". The page says only "Updated: your client wants AI assistants included as a channel." with no caveat. Brand Visibility is added to Create your own play (CJA, AEM Sites, Journey Optimizer, Brand Visibility). The Why section gets "Agent traffic reaches CJA as an Experience Platform dataset...". There is no CDN box, and nothing says the agent-traffic data needs CDN logs.

(2) The "team spends too long pulling reports" problem confirms the inconsistency. Clicking "My client wants the AI channel included" adds the same products and the same Why line, but it does show "Its CJA source needs CDN logs, which only the CJA play offers as a CDN box." That note exists only on that one refine entry in problems.json. The "AI assistants included as a channel" refine entry under cant-see-what-works has no note.

(3) The "customers call instead of finding answers" (FSI) case is not quite as reported. After "My client licenses CJA", a note does appear: "That moves the setup to Create your own play. Confirm the data use with Adobe. Create your own play doesn't offer outside systems, so the CDN box leaves the setup." The note comes from the lost-outside-systems logic in patch_step40.py, line 153. So the claim that no note is shown is wrong here. What is missing is why it matters: the CJA connection just added relies on the CDN logs the partner was told left the setup.

Why it matters: catalog.json has a separate "CDN log forwarding, set up by the partner" service, tied to the CDN box. Without the box, the hours omit log forwarding, even though the Brand Visibility to CJA connection's own text says agent activity comes "from CDN logs". It is a narrow, real inconsistency in the guidance. Prices and products are not wrong, and AEM Sites' managed CDN partly softens case (1). That makes it low severity.

### 18. Some refine notes read as fragments or have a dangling pronoun after the Updated sentence (low, content)

- **Where:** sow/canvas/problems.json refine notes, rendered in the 'Updated:' line
- **Steps:** Click 'My client can't tie AI traffic to revenue' > 'revenue data sits in Snowflake...'; 'My client's customers call...' > 'site is on AEM Sites'; 'search traffic is dropping to AI overviews' > 'needs many pages updated quickly'; 'team spends too long pulling reports' > 'wants the AI channel included'; 'can't tie AI traffic to revenue' > CRM > warehouse > 'leaders want readouts on request'.
- **Observed:** 'Updated: your client's revenue data sits in Snowflake, BigQuery or Databricks. Through Data Mirror.' / '...site is on AEM Sites. Through the Content AI index.' / '...needs many pages updated quickly. For bulk changes your client's authors review.' / '...wants the AI channel included. Its CJA source needs CDN logs...' ('Its' has no antecedent; it means Brand Visibility). '...so the CDN box, the CRM box and the Data warehouse box leave the setup' ('Data' capitalized mid-sentence).
- **Expected:** Use full sentences, for example 'The warehouse data comes in through Data Mirror.', 'Brand Concierge answers from AEM's Content AI index.', 'Coworker makes bulk changes your client's authors review.' and 'Brand Visibility's CJA source needs CDN logs...', with lowercase box names mid-sentence.
- **Skeptic:** I reproduced this in Chromium using sow/site/index.html. The code is patch_step40.py line 112, which builds the line as `Updated: ${bpYou(chip)}. ${note}`, plus line 153 for the play-switch and box-removal sentences. Observed text:
1) "can't tie AI traffic to revenue" > Snowflake: "Updated: your client's revenue data sits in Snowflake, BigQuery or Databricks. Through Data Mirror."
2) "customers call instead" > "site is on AEM Sites": "Updated: your client's site is on AEM Sites. That moves the setup to Create your own play. Through the Content AI index. Create your own play doesn't offer outside systems, so the CDN box leaves the setup." Here the fragment comes after the play-switch sentence, so it reads as if it belonged to that sentence and is even harder to follow.
3) "pulling reports" > "AI channel": "Updated: your client wants the AI channel included. Its CJA source needs CDN logs..." Grammatically, "Its" points back to "the AI channel", but it means Brand Visibility.
4) "can't tie AI traffic" > CRM > Snowflake > readouts: "...Needs CJA B2C edition. Create your own play doesn't offer outside systems, so the CDN box, the CRM box and the Data warehouse box leave the setup." The capital D comes from the product name P[dwh].name in the line 153 template.
I did not render "needs many pages updated quickly", but the note "For bulk changes your client's authors review." in problems.json goes through the same code path, so it will show the same way.
Other notes are also clipped but still read clearly in context, for example "Needs CJA B2C edition.", "Synced by SKU." and "Web SDK recommended." The clearly unclear ones are "Through Data Mirror.", "Through the Content AI index." (worst when it lands after the play-switch sentence) and "Its CJA source". A partner could misread them, but nothing changes products, fees or the SOW. Real copy defect, low severity.

### 19. Slow-website chip changes the problem's meaning, and a typed slow-site question is heard as AI overviews (low, content)

- **Where:** problems.json slow-website chip; two-problem heard line
- **Steps:** Read the starter chip for problem 4. Then type 'My client's website is slow and they have a long SEO backlog with no developers' and submit.
- **Observed:** The chip reads 'My client's site is slow and losing search traffic'. The reviewed problem is 'slow, scores poorly on Core Web Vitals and is hard to change'; 'hard to change' is dropped and search-traffic loss is added, which overlaps the organic-traffic problem. The typed question is heard as 'Two problems here: your client has an SEO backlog and no developers, and your client's search traffic is dropping to AI overviews', which the partner never said.
- **Expected:** The chip should keep the reviewed meaning, for example 'My client's site is slow and hard to change'. The heard line should not claim a problem the partner didn't describe.
- **Skeptic:** I reproduced both parts of the finding in Chromium against sow/canvas/index.html, loading a fresh page for each query.

1. The chip changes the problem's meaning. In sow/canvas/problems.json, problem "slow-website" (line 177) reads "My client's website is slow, scores poorly on Core Web Vitals and is hard to change." The reviewed draft (sow/problem_review_2026-11-03/PROBLEMS.md, item 4) says the same. Its chip (line 179) and the starter chip shown on the page both read "My client's site is slow and losing search traffic". The chip drops "hard to change" and adds search-traffic loss, which belongs to a different problem. Compare the store problem's chip (line 943), "My client's store is slow and hard to change", which keeps its meaning.

2. The heard line claims a problem the partner never stated. Typing "My client's website is slow and they have a long SEO backlog with no developers" and submitting shows: "Two problems here: your client has an SEO backlog and no developers, and your client's search traffic is dropping to AI overviews." The partner said nothing about AI overviews or falling traffic, and slowness is not mentioned in the heard line.

3. Side observation, not part of the finding: typing just "My client's website is slow" gives "No match yet". The slow-site problem does appear first among the closest suggestions there.

Severity: low. The recommended play is still Brand Visibility + Sites Optimizer and Edge Delivery Services, with the same products and 12 starting services, so the setup and fees are not wrong. Only the wording that restates the client's problem is misleading.

### 20. Keyboard focus is dropped to <body> after almost every action in the problem box (low, ui)

- **Where:** sow/canvas/patch_step40.py: bpRender / bpShow / the #bp click handler (built into sow/site/index.html and sow/canvas/index.html)
- **Steps:** Serve sow/site and open / at 1440. Using the keyboard only: Tab to the input, type a problem and press Enter. Or Tab to a problem chip and press Enter. Or, in an answer, press Enter on a Refine chip, 'Show another setup', 'See all problems' or 'Build this'. Then read document.activeElement (script: scratchpad/review40/ui/kb.js).
- **Observed:** document.activeElement is BODY after each of these: the submit (because the form is hidden), a problem chip, a Refine chip, 'Show another setup', 'See all problems' and 'Build this'. The clicked control is destroyed by bpRender's innerHTML. Chrome's sequential-focus starting point hides some of this, but screen readers get no focus move, and Safari and Firefox users start tabbing from the top of the page. Only 'Ask about another problem' moves focus on purpose, to the input.
- **Expected:** After an answer renders, focus should move to the answer (for example a focusable 'Heard/Updated' line or the answer container with tabindex=-1). After 'See all problems' it should stay on the chip list. After 'Build this' it should go to the canvas, for example the play name or the Continue button.
- **Skeptic:** I reproduced this with my own script, /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/kbrepro/r.js. It serves sow/site at a 1440 viewport and uses the keyboard only. After each of these, document.activeElement was BODY:
- Enter in #bp-q with "my client is invisible in AI answers"
- Enter on the first problem chip [data-bpp]
- Enter on a Refine chip [data-bpr]
- Enter on 'Build this' [data-bpa=build]

The code explains it. In sow/canvas/patch_step40.py, bpShow and bpRender rebuild the box with innerHTML, which destroys the control that had focus. The #bp click handler calls focus() only in the 'again' branch, which sends focus back to the input. The submit, chip, refine, 'another', 'all' and 'build' branches never move focus.

The practical harm in Chrome is small. Its sequential-focus starting point carries on near the old spot: Tab after submitting reached the first Refine chip, and Tab after 'Build this' reached #save ("Continue"). So a sighted keyboard user in Chrome can still get around. The real gap is for screen readers, which get no focus move and no announcement, since there is no live region or focus target when an answer renders. Users of browsers that restart tabbing from the top of the page are affected too.

It is an accessibility polish defect, not one that gives a partner wrong products, fees or a broken page. I rate it low rather than medium.

### 21. Connection 'i' dots can't be reached by keyboard, touch or screen reader (low, ui)

- **Where:** sow/canvas/patch_step40.py bpAnswerHTML (the .bp-ln b markup)
- **Steps:** Open the box, click 'My client's site is slow and losing search traffic' and look at the product row. Tab through the answer. Then take an aria snapshot of #bp (scratchpad/review40/ui/aria.js).
- **Observed:** The i is a <b title=... aria-label=...> with no tabindex or role. Tab goes straight from the problem chips to the Refine chips, so the label only shows as a mouse-hover tooltip. Touch users can't see it at all. The accessibility snapshot reads the product row as 'Brand Visibility Sites Optimizer i Edge Delivery Services', so screen readers hear 'i' and not the connection label (aria-label on a generic <b> is not exposed).
- **Expected:** Each i should be a focusable button, or have visible or offscreen text, that shows and announces the connection kind and label on focus or tap, like the canvas's own i.
- **Skeptic:** I reproduced this on sow/canvas/index.html, served locally and driven by Playwright/Chromium. My scripts are in /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/verify-i/ (t.js, t2.js).

Steps: open the page, click the chip "My client's site is slow and losing search traffic", then wait for the answer.

What I saw:
- **Markup:** the only connection dot is `<b title="Sites Optimizer connects to the Edge Delivery site; fixes land in authoring for people to publish" aria-label="Native integration: ...">i</b>`. Its tabIndex is -1, and it has no role and no tabindex. It comes from the bpAnswerHTML markup in sow/canvas/patch_step40.py, line 116.
- **Screen readers:** the aria snapshot of #bp reads the product row as "Brand Visibility Sites Optimizer i Edge Delivery Services CDN (outside system)". The aria-label on the generic `<b>` is not exposed, so a screen reader hears "i".
- **Keyboard:** from the chip, Tab goes to the three Refine chips, then Build this, then Ask about another problem, then the play cards. The i never gets focus.
- **Touch:** the label exists only as a `title` tooltip, so touch users can't open it.

So the defect is real. I'm calling it low rather than medium because the label is extra detail. The "Why they work together" list right under it, which keyboard, touch and screen reader users can all reach, already explains how the products fit together, in close to the same words. Nobody gets wrong products, fees or SOW, and the page doesn't break. Only the short connection label and its kind ("Native integration") are lost for non-mouse users.

Fix to consider: make the i a `<button>` with the aria-label (or add offscreen text) so the label shows on focus or tap.

### 22. Answer's product row draws only connections between neighboring boxes, so connected products look unconnected (low, ui)

- **Where:** sow/canvas/patch_step40.py bpAnswerHTML (boxes loop only checks ids[k-1])
- **Steps:** For each of the 19 problems run bpAsk(PROBS[i].chip,i) and compare bpConns(setup) with the connections actually drawn between adjacent boxes (scratchpad/review40/ui/conns.js). Example: click 'My client can't tie AI traffic to revenue'.
- **Observed:** 12 of the 19 answers hide at least one connection. Problem 1 shows Brand Visibility -i- Customer Journey Analytics, then a plain gap, then 'CDN (outside system)', but CDN~Brand Visibility is a connection and has no line. Problems 2 to 4 draw 1 of 3 (Brand Visibility~Edge Delivery Services and CDN~Brand Visibility are missing, and Brand Visibility sits beside Sites Optimizer with a gap). Problem 17 draws 3 of 6. After refining with 'My client closes deals in a CRM', the CRM box also floats with no line.
- **Expected:** Every connection the setup uses (bpConns) should be shown with its i, or the row should not imply that boxes separated by a gap are unconnected. This matters most for the outside-system boxes, the CDN in particular.
- **Skeptic:** I reproduced this in Chromium against sow/canvas/index.html. For each of the 19 problems I ran bpAsk(PROBS[i].chip,i), rendered the answer and read the .bp-prods row next to bpConns(bp.setup). The cause is in bpAnswerHTML in sow/canvas/patch_step40.py: the boxes loop only looks for a connection between ids[k-1] and ids[k]. When two boxes side by side have no direct connection, it draws a plain bp-gap, even when both boxes connect to something else in the setup.

What a partner sees:
- Problem 0: Brand Visibility -i- CDN.
- Problem 1: Brand Visibility -i- Customer Journey Analytics, then a gap, then CDN (outside system). CDN~Brand Visibility is in bpConns, yet the CDN looks unconnected, although problem 0 shows the same pair joined.
- Problems 2 to 4: Brand Visibility, gap, Sites Optimizer -i- Edge Delivery Services, gap, CDN. Only 1 of 3 connections is drawn, and Brand Visibility looks disconnected from the rest of the play. Its BV~EDS and CDN~BV connections are not shown.
- Problems 5 and 6: the CDN sits after a gap even though it connects to Brand Visibility.

Problems 10, 12, 13, 14, 16 and 17 have more connections than boxes (17 has 6 connections across 4 boxes). They draw a chain with an i between every pair, so nothing looks unconnected there. Calling those "hidden" connections overstates the finding. The ones that actually mislead are the gap cases, problems 1 to 6, all involving the CDN outside-system box or Brand Visibility in Play 3.

I did not run the CRM refine path.

The approved mockup only shows two boxes, so it does not settle how this case should look. Products, hours, fees and the setup that "Build this" puts on the canvas are not affected, because the canvas draws the real connections. That makes this a misleading visual in the answer summary rather than a wrong SOW, so I rate it low, not medium.

### 23. Connector line and i wrap to the end of a row, pointing at nothing, on narrow screens (low, ui)

- **Where:** sow/canvas/patch_step40.py CSS .bp-prods / .bp-ln and the max-width:600px media rule
- **Steps:** Render each problem's answer at widths 1440, 1100, 900, 768, 600, 390 and 320, and check whether each .bp-ln sits on the same row as the next box (scratchpad/review40/ui/wrap.js). Visual: at 390, click 'My client can't tie AI traffic to revenue' (scratchpad/review40/ui/ansfull_390.png).
- **Observed:** The dotted line and its i stay at the end of the first row ('Brand Visibility ··(i)··'), and the box it connects to wraps to the next line. Affected: problem 17 at 900 and 768; problems 16 and 17 at 600; 17 of 19 problems at 390; 18 of 19 at 320.
- **Expected:** At narrow widths the row should stack vertically with vertical connectors, or keep each connector with the box it leads to.
- **Skeptic:** I reproduced this on my own, using my own server and script (/tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/repro-wrap/r.js) against sow/site/index.html.

Steps: open the page at 390x900 and click the chip "My client can't tie AI traffic to revenue".

What I measured in .bp-prods:
- Brand Visibility box: top 397, left 53.
- .bp-ln connector with its i: top 419, left 184.
- Customer Journey Analytics box: top 451, left 53.

So the dotted line and the i sit at the end of row 1, pointing at empty space, and the box they connect to wraps to row 2. The screenshot shows this clearly: /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/repro-wrap/s390.png.

For this problem, at 900 and 768 all three boxes stay on one row. I did not separately re-check the reviewer's per-width counts for other problems (problem 17 at 900 and 768, and so on). Their wrap.js uses the same check as mine, so those counts are probably right.

Cause, in sow/canvas/patch_step40.py: `.bp-prods` uses `flex-wrap:wrap`, and the connector is its own flex item between the boxes. Nothing keeps it on the same line as the next box, and the max-width:600px rule only shrinks the line to 40px.

The products and the i's text are still correct, so a partner on a phone gets the right answer. It just looks broken. Low severity.

### 24. Title icon gets squashed at phone widths (low, ui)

- **Where:** sow/canvas/patch_step40.py CSS .bp .bp-t (svg in a flex heading)
- **Steps:** Open / at 390 or 320 wide and measure '.bp-t svg' (scratchpad/review40/ui/probe2.js).
- **Observed:** The 22x22 chat icon renders 15.5x22 at 390 and 12x22 at 320. It is visibly narrower and smaller than the mockup because the flex item can shrink.
- **Expected:** The icon stays 22x22 (flex:none on the svg).
- **Skeptic:** I reproduced this: the title icon shrinks at phone widths. I loaded sow/site/index.html in Chromium with Playwright at each width and measured `.bp-t svg` with getBoundingClientRect. Script: /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/verify-icon/p.js.

| Width | Icon size | flex-shrink |
|---|---|---|
| 1280 | 22 x 22 | 1 |
| 390 | 15.53 x 22 | 1 |
| 320 | 12.08 x 22 | 1 |

Cause: in patch_step40.py, the CSS `.bp .bp-t{display:flex;gap:10px;...}` makes the h2 a flex row holding the inline svg and the long title text. The svg keeps the default flex-shrink:1, so the text squeezes it. The svg has a viewBox, which keeps its proportions, so the line icon is drawn at about 15.5px at 390 wide and about 12px at 320 rather than 22px. Nothing breaks: the icon is just smaller than in the mockup, and smaller than at desktop width.

Expected: the icon stays 22 x 22. Fix: add `flex:none` (or `flex-shrink:0`) to `.bp .bp-t svg`. This is cosmetic only and does not affect products, fees or the SOW.

### 25. Answer sections aren't headings, and the live region re-announces chip lists (low, ui)

- **Where:** sow/canvas/patch_step40.py BOX markup (#bp-body aria-live) and bpAnswerHTML
- **Steps:** With a screen reader or an aria snapshot: ask a problem, then click 'See all problems'.
- **Observed:** 'Recommended', 'Why they work together', 'What you deliver' and 'Refine' are plain divs, so the snapshot shows them run together as one text node, and heading navigation can't jump between sections. The whole #bp-body is aria-live=polite and replaced with innerHTML, so 'See all problems' or 'Show fewer problems' re-announces all 19 chip labels. On a phone the 'Matching your client's problem' line is also above the viewport during the wait (top -344px at 390 after a Refine chip).
- **Expected:** Section labels as h3s. A small separate status live region (for example 'Answer ready: Brand Visibility + ...') instead of a live region around the interactive chips.
- **Skeptic:** I reproduced this with Playwright on /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/abv/sow/site/index.html. The script is /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/a11y/t.js.

1. #bp-body has aria-live="polite" (patch_step40.py line 67). bpRender replaces its innerHTML on every view change (lines 134-137). Clicking "See all problems" re-renders the live region from 7 chips to 20 (19 problems plus "Show fewer problems"). A screen reader would therefore read out the whole chip list again. The same happens on Show fewer and on each working-to-answer swap.

2. In the answer view, the four section labels are all DIV.bp-lbl: "Recommended: ...", "Why they work together", "What you deliver" and "Refine". The answer contains no h1-h4 or role=heading elements, so heading navigation cannot jump between the sections.

This only affects screen reader users. The content, products and fees are still correct, so the severity is low.

I did not check the phone-viewport part (the "Matching your client's problem" line sitting above the viewport). Expected fix: make the labels h3 elements, and use a small separate status live region instead of making the interactive chip container live.

## Rejected by the skeptic

- Moving from 'Visitors can't find answers' to the FSI play leaves out the CDN box the reviewed effect says is offered (content): I reproduced the behavior the finding describes, but I don't think it is a defect.

What I did: ran Playwright against sow/site/index.html, with a fresh browser context for each route. Scripts are in /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/repro-cdn/.

What I saw:
- Route 1, "Visitors can't find answers on my client's site" then "My client is in financial services or insurance": the setup is {play: fsi, prods: [bv, bc], out: []}. The boxes are Brand Visibility and Brand Concierge, with no CDN.
- Route 2, "My client is missing from AI answers" then the same FSI chip: the setup is {play: fsi, prods: [bv, bc], out: [cdn]}, with the CDN box.
- Fees and services are identical on both routes: 5 starting services, 752 one-time hours plus 104 a month, $200,000 to $600,000.
- Build this carries out: [] onto the canvas for route 1.

Why it isn't a defect:
- bpNext keeps only the outside systems already in the client's setup, and route 1 starts with none.
- Picking the FSI play card on the canvas does the same thing: pick() sets st.out = [] (template.html line 663). So route 1 matches the plain FSI play.
- In PROBLEMS.md, "offered" means the play allows that outside box. Problems 1 to 7 use it that way ("the CDN box is offered only on the Brand Visibility plays, so it leaves the canvas"). The FSI play does allow CDN (PLAYS.fsi.outside includes cdn), and the partner can add it with the outside-system button.
- Route 1's "why" text says nothing about CDN, so it promises nothing the setup lacks.
- Products, fees and the SOW are unchanged.

What's left is a difference in which optional box starts on the canvas, which is a design choice. At most it is low.

Separate issue I noticed, not part of this finding: after the route 1 FSI refine (the note says "Edge Delivery Services leaves the setup"), the first "Why they work together" bullet still says "Brand Concierge loads on an Edge Delivery site in a block the partner builds...". That describes a product no longer in the setup. bpAnswerHTML always shows the original problem's why text, even after a refine removes a product, which could confuse a partner.
- The no-match message uses 'our list' (content): I reproduced the text, but I don't think it's a defect. It's a wording preference.

How I reproduced it: I served /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/abv/sow/site/ locally and opened it in Playwright. I typed 'xyzzy plugh' into #bp-q and pressed Enter. #bp-body showed: "No match yet. That doesn't match a problem on our list. Try one of the closest, or describe it another way:" followed by six near chips and "See all problems". The same string is in patch_step40.py line 136 and appears once in each of sow/site/index.html and sow/canvas/index.html.

Why it's not a defect: no project rule bans 'we/our'. The documented voice rule (docs/sessions/2026-11-03.md line 125, PROBLEMS.md line 3) is about the partner's voice: "your client", chips that begin "My client", and "What you deliver". "Our list" fits that. It clearly means the tool's or Adobe's list of problems, so a partner can't misread it. It's the only first-person phrase in the UI (the other 'Our' I found is a quoted Adobe source in the evidence text), so changing it to "the list" would be a small consistency tweak, not a fix.

Side note, not part of this finding: going to http://localhost:8741/index.html timed out waiting for #bp-q, while http://localhost:8741/ rendered the box fine. I didn't look into why.
- Escape does nothing in the problem box (ui): The behavior is as the finding says, but I don't count it as a defect. Steps: I loaded sow/canvas/index.html in Chromium, typed "my client is not showing up in AI answers" into #bp-q and pressed Enter, then waited for the answer (the [data-bpa=again] button appeared). With focus on "Build this", I pressed Escape. The answer stayed on screen. patch_step40.py adds no keydown handling. The page-wide Escape handler (template.html line 804) only closes the add and output menus, the card and the confirm dialog, and clears the selected product; it doesn't touch the problem box. Why it isn't a defect: the answer sits inline in the page. It isn't a modal, popover or menu, and those are the only places users expect Escape to dismiss. The input #bp-q is still on the page while the answer shows, and "Ask about another problem" is a normal button that Tab reaches. Keyboard users can always get back. The approved mockups and PROBLEMS.md never promise Escape behavior. This is a nice-to-have, not a broken behavior a partner would run into. Scratch script: /tmp/claude-0/-home-user-warroom/2b3b814b-2dfa-51cc-9250-9f928b0f479a/scratchpad/review40/esc/t.js
