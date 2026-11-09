# Claude Opus 5.5 review (as pasted by Adam, Nov 9 2026)

I ran it. I built the prototype from `abv-partner-plays` at `4e789a0` and drove it in headless Chromium. Your own 64 checks all pass. Then I put about 140 hostile inputs and 8 RFP files through the page's own code: a Word table, an Excel compliance matrix, PDFs with page breaks and running headers, and a scanned PDF. I also pushed all 201 service lines and 75 connections through the step that rewrites text into the partner's voice to the client.

## Verdict

The foundations are strong. It isn't ready for a real RFP yet.

What's strong:

* Every sentence it drafts is text from your sourced catalog. Every error I found was the wrong catalog text being picked, never an invented fact.
* Your own checks pass, including "nothing leaves the page" and "nothing is stored" before the hand-off.
* "No match in the catalog" is honest when a question names no product.
* The note for the partner is the right idea.

What's not:

* The question finder misses the shapes most real RFPs use.
* Common words send Adobe questions to "Your firm".
* The matcher answers the product it sees, not the question asked.
* Some lines meant only for partners reach the client.

Grade: D+ on real RFP shapes, B+ on the three made-up RFPs it was built against. Almost every fix is in the finder or the matcher. The catalog itself doesn't need to change.

## A. Findings (most severe first)

1. Critical. Requirements written as statements are invisible.
   * Input: `3.1 The solution shall support multi-site management with shared components across 12 regional brands.` I also tried "must", "should", "Respondent will provide...", "Vendor to confirm..." and "Support for...".
   * Got: no questions found for all six. The same kind of row is dropped from a Word table (4.3) and a PDF table (3.4).
   * Expected: every numbered requirement becomes a row.
2. Critical. Mandatory and desirable tags delete the question.
   * Input: `2.1 (M) Describe...`, `2.2 [Mandatory] Describe...`, `2.3 MANDATORY: Explain...`, `2.4 Desirable - Describe...`, `[M] 2.5 Describe...`
   * Got: all dropped. Only `...programs. (Mandatory)` survived, with the tag left inside the question text.
   * Expected: the question is found, and the tag goes into its own M/D field.
3. Critical. Excel compliance matrices collapse.
   * Input: a matrix with columns Req ID, Category, Requirement, Priority, Comply (Y/N/P), Vendor response, plus a Security sheet.
   * Got: "2 questions found". FR-01 to FR-06 all vanish, including two rows that start with "Describe". The Priority "M", the ID and the Category glue onto the front of each row. SEC-01 and SEC-02 merge with the header row into one item.
   * The same matrix pasted as tabs becomes a single question, which gets drafted as an AEM Sites + Target answer.
   * Expected: one item per row, with the client's ID, the M/D value and the Y/N/P column.
4. Critical. Everyday Adobe topics land in "Your firm", where nothing is drafted. 13 of 13 of my test questions did this:
   * "insurance" (the FSI play)
   * "pricing" (B2B pricing in Commerce)
   * "revenue", "our organization", "legal", "sustainability", "invoice", "payment terms", "change requests", "costs", "portfolio", "exit pages", "account management", "employees"
   * Example: `How would Brand Concierge answer questions from our insurance policyholders?`
   * Expected: a firm word only wins when the question is about the respondent, as in "your insurance coverage".
5. Critical. Confident answers to the wrong product or the wrong question.
   * `What is the target go-live date for the new site?` gets a Target on Edge Delivery answer that tells the client about "the legacy at.js", "AEM Engineering co-innovation" and "+1.2 seconds mobile Largest Contentful Paint".
   * `Do you use generative AI tools such as ChatGPT in delivering services? If so, how do you protect our data?` gets a full Brand Visibility proposal, After launch services included, filed under Adobe services. RFPs ask this about the vendor's own AI use all the time.
   * `Describe your approach to implementing Adobe Analytics.` gets "We would deliver this with Customer Journey Analytics."
   * `...AEM Forms for digital account opening` gets an AEM Sites build plan.
   * `We will not use Adobe Target. Describe the alternatives you recommend.` gets "We would deliver this with Target."
   * "Not sure" rows are drafted too: `Who leads the project day to day?` gets Marketo Engage, and `What measures do you take to protect our data?` gets Customer Journey Analytics.
   * Expected: draft only when an Adobe product is what the question is about, respect negation, and never draft a "Not sure" row.
6. Critical. Wording meant only for partners reaches the client. The "Our approach" text comes from the canvas card, which keeps these labels on purpose for partners.
   * `How would Coworker work inside Workfront for our campaign managers?` puts "Adobe says Coworker is not currently offered to health care, finance or some other industries" into the response. That's the line you took out of the FSI SOW on Nov 8, now in a bank's RFP response.
   * Others that reach the client: "CIF Core Components are in maintenance mode", "(a Legacy capability)", "the legacy at.js", and "co-innovation" on two Edge Delivery connections.
   * Expected: the response gets the same client-side wording as the SOW, and `check_rendered_copy.js` also crawls drafted responses.
7. Critical. "Skip" leaves nothing out.
   * After "Skip" on 2.4, the downloaded response still prints the full draft under "Skipped by the partner", and the Excel row keeps the text.
   * Every unreviewed draft goes out too, tagged "Draft, not yet reviewed", under an intro that talks about "the partner".
   * Expected: skipped and unapproved answers export as blanks.
8. High. "What do you need from us?" gets no answer.
   * Your bank question 2.2 asks it outright. By design, every prerequisite sits in the partner note, and empty fields "stay out of the response".
   * So the client never learns that CDN log forwarding, which your catalog calls "often the longest item", is on them.
   * Expected: open items appear in the response as dependencies, each one with a box the partner can untick.
9. High. The note drops prerequisites.
   * It shows only the first six. 12 of the 75 connections have more.
   * For bank 2.2 (Brand Visibility + CJA, nine prerequisites), the dropped three include "Acceptance that some Brand Visibility data is processed temporarily in the United States".
   * The note also ignores each service line's own requirements. 2.2 commits to "publish them to Real-Time Customer Profile" (line C06), which your catalog says needs "Real-Time CDP or Journey Optimizer". Neither the response nor the note says so.
   * "Add to my statement of work" then switches C06 on in the SOW.
10. High. Your own fixture question gets the wrong connection.
   * `Our product images live in AEM Assets. How do approved images reach Commerce product pages?` (retail Q3) gets AEM Sites + AEM Assets.
   * `Describe how AEM Assets feeds Adobe Commerce product pages.` gets Commerce + AEM Sites (the CIF add-on).
   * The "AEM" inside "AEM Assets" also counts as AEM Sites, which pulls in the wrong pair. Your test only checks which pile the question lands in.
   * Expected: the Commerce + AEM Assets connection, which the catalog has.
11. High. Service lines that ignore what the client said, and carry into the SOW.
   * Bank 2.2 says "our Customer Journey Analytics data", but the draft adds the Adobe Analytics to CJA upgrade ("We will plan the upgrade path..."), and the hand-off switches that upgrade on in the SOW.
   * Bank 2.7 says "Our marketing team runs Marketo Engage", but the draft adds "document the new instance setup" and a whole site go-live ("cut over DNS and the CDN...").
12. High. Answers with nothing in them.
   * Adobe Commerce has no service lines of its own. So `Our current platform is Magento Open Source 2.4. Describe your approach to upgrading it.` gets exactly one sentence, "We would deliver this with Adobe Commerce.", and no sources.
   * In a two-lot RFP, `2.2 Describe your approach to ongoing support.` gets "...our ongoing services for Customer Journey Analytics are these." followed by nothing.
   * Bank 2.5 names four products and lists services for only two.
13. High. Yes/no, capability and hosting questions get a build plan.
   * These all get "We would deliver this with Brand Concierge." plus the implementation line: `Where is Brand Concierge data hosted, and is it encrypted at rest?`, `What languages does Brand Concierge support?` and `Can Brand Concierge answer questions about a member's own account balance after they log in?`
   * `How many concurrent authors can AEM Sites support?` gets the same treatment with AEM Sites build lines.
   * A procurement reader takes these as a yes. Your rule that hosting questions get no catalog match only holds when no product is named.
   * Bank 2.3 also promises "set up the handoff (live chat, meeting booking or both)", while the note says that handoff runs through Adobe Marketo Qualifier, a separate product.
14. High. The RFP's structure gets lost.
   * Under `Lot 1: Adobe Experience Manager Sites`, question 1.1 gets "No match".
   * The `Lot 2: Customer Journey Analytics` heading glues onto 1.2, which is then answered as CJA.
   * `2.1 Describe your implementation approach.` disappears as a duplicate of 1.1.
   * Sub-questions a), b) and c) are dropped. (i), (ii) and (iii) lose their parent and get labels like "(i".
   * Word table rows lose their numbers, so the Excel "Number" column is blank.
   * A PDF question that runs onto the next page stops at "which teams on our side", and its second half becomes a separate unnumbered row.
   * Running headers glue in, garbled: "N ort hb r idge M utu a l...".
15. High. The instruction filter deletes real questions.
   * `Submit a migration plan for moving our 40 regional sites to AEM Sites.`
   * `Describe how Brand Concierge would answer all of our members' questions about rates and fees.`
   * `...alerts campaign owners when a deadline is at risk.`
   * All three are dropped.
16. High. Work is easy to lose.
   * Text typed in a firm answer is thrown away unless "Use this answer" is clicked first. I typed in 1.1, clicked "Next question", and it was gone.
   * Changing a row's pile deletes its answer.
   * "Clear" wipes everything without asking.
   * A refresh or a closed tab loses it all.
17. High. Typed client facts lose their subject.
   * Typing `Yes` under the CDN logs item puts "What you have in place: Yes" in the client's response.
   * After "Edit", any facts typed later silently stay out of the response.
18. Medium. The note sorts items into the wrong boxes, and uses "the Client".
   * Under "Part of this proposal": "The Client has licensed Brand Concierge and supplies the approved content...", which is a client duty. Also "Adobe's support or professional services team configures Coworker...", which is Adobe's work.
   * Under "Ask your client for these": assumptions with a field under them ("Shared strategy work is reused across related domains."), and things only Adobe can do ("CIF add-on provisioned by Adobe...").
19. Medium. What the client owns is read only from the questions.
   * A Background line, `The bank licensed Brand Visibility in 2026...`, still produces "Part of this proposal: The paid Brand Visibility offering".
   * `...our new site on EDS?` marks Edge Delivery as already owned, because of the words "our new site".
20. Medium. Grammar and voice in what the client reads.
   * 19 of the 201 service lines come out broken, for example "We will where you are on Analytics for Target today, choose...", "We will once Adobe provisions the CIF add-on, set..." and "We will the agreed dashboards...".
   * Six lines still talk about partners or "the Client", for example "the Adobe/partner/Client responsibility split" and "a partner validation sheet".
   * The Brand Visibility + CJA approach coaches the partner inside the client's text: "which ordinary referrer reporting can show without it; lift comes only from a test."
21. Medium. Questions with two parts lose one.
   * `...implementing AEM Sites and the team you would assign` goes to Your firm with no AEM draft.
   * `...including a timeline and staffing plan` gets no timeline or staffing.
   * `Describe your experience implementing Adobe Experience Manager Sites for banks.` gets a build plan instead of experience.
22. Medium. Silent limits.
   * A 350-item questionnaire shows "300 questions found", and the Adobe question after it is gone without a warning.
   * Paragraphs over 900 characters are dropped.
   * The shorthand partners actually use ("ABV", "AEP", "Adobe Experience Platform") gets no match, and "LLMO" matches only CJA.
   * "REQ-001", "FR-3.2" and "Item 15:" numbering is dropped.
23. Medium. "Add to my statement of work" replaces saved work without asking. It overwrote a canvas build saved in the browser, and the page has no confirmation step anywhere. This matters once the tab sits on the same site as the product.
24. Low. Smaller things.
   * "Please note that all responses become the property of..." shows up as a question.
   * A scanned PDF says "no questions found" when the real reason is that it has no text layer.
   * French, Spanish and Portuguese questions are dropped.
   * Rows can't be opened from the keyboard.
   * The response's title is the file name ("...RFP_2026.xlsx: response draft").
   * 4 of 158 drafted lines lose their own source because of the six-source cap.
   * "Adobe: customer-journey-analytics.html" shows as a source title.
   * Only the first file of a multi-file drop is read.

## B. What's missing

Sizes: S is days, M is a week or two, L is several weeks.

Top five:

1. A requirement matrix that writes back into the client's own file.
   * Who: the bid manager.
   * What it saves: re-keying every answer into the client's workbook, and missing a mandatory row, which can disqualify the bid.
   * Each row carries its ID, M/D, Y/N/P, owner, status, answer and source.
   * Where: the browser. The free SheetJS build drops the client's cell formatting when it writes, so it needs ExcelJS or a values-only copy.
   * Size: M for Excel, L for Word tables. It depends on fixing A1 to A3.
2. Assumptions, dependencies and exclusions, plus questions for the client's Q&A window.
   * Who: the solution architect, delivery lead and legal.
   * What it saves: scope creep and margin. It also answers "what do you need from us?".
   * The data already exists: the connection prerequisites, each line's own requirements, and the SOW assumptions.
   * The open items also become numbered clarification questions that cite the RFP section, ready for the client's Q&A deadline.
   * Where: the browser. Size: S to M.
3. Save, resume and team review without a server.
   * Who: everyone on the bid.
   * "Save my work" writes a file to the partner's computer, and the tool reads it back.
   * A working workbook with Owner, Status and Comment columns can go round SharePoint and be imported again.
   * Where: the browser. Size: S for save and resume, M for the round trip.
4. An answer library for the firm's own questions.
   * Who: the proposal manager.
   * What it saves: about half of each RFP (14 of 30 questions in your three fixtures are about the firm).
   * It stays on the partner's machine and is shared as a file.
   * Matching paraphrased questions without sending anything out is possible with a small model that runs inside the page (transformers.js).
   * Size: M. A library shared across the partner's team needs a server.
5. A sourced facts base that also covers capability statements.
   * Who: the solution architect and the security lead.
   * Why: compliance matrices are mostly "The platform must support..." rows, which neither the catalog nor the planned knowledge base answers.
   * Contract terms such as uptime and support should read "per your Adobe agreement".
   * Keep Adobe's platform apart from the partner's own security controls.
   * Where: the browser, as static JSON. Size: L, mostly research.

After that:

6. RFP at a glance, for the go/no-go call. Due dates, word limits, scoring weights, the platforms and competitors named, and which play matches. The tool reads all of this today and throws it away. Browser. S to M.
7. Portal-ready output. Word and character counters, with the limit read from the RFP (the bank workbook says "Keep each answer under 300 words"), a plain-text mode, and a real .docx. Browser. S to M.
8. Pricing and staffing from the SOW. Fill the client's pricing sheet (my matrix's Pricing tab was ignored) and a phase timeline, using the partner's own rate and fees only. Browser. M.
9. A check before every download. Unanswered mandatory rows, unapproved drafts, lifecycle words and voice. Browser. S.
10. After submission. Put the RFP number on each SOW line, keep a list of everything the response promised, and handle clarification rounds and orals. Browser. S to M.

What a model adds that a static page can't: it can read any layout and language, tell "does X support Y?" from "describe your approach", and trim an answer to a word limit. The cost is that the client's document leaves the browser, so it needs Adobe-approved hosting and an explicit opt-in.

What a server adds: a shared answer library, team review with names and a history of who approved what, and scheduled re-checks of every source between builds.

## C. Changes to what's there

1. Rename the tab "RFP Builder" to "Answer an RFP", which matches the panel heading. A first-time partner reads "Builder" as a tool for writing RFPs.
2. Rename "Use this answer" to "Approve", and make the downloads carry approved answers only. Rename "Skip" to "Leave out", and make it actually leave the answer out.
3. Split "Download RFP response" into a "clean response" (no status tags and no note about "the partner") and a "working draft" (with status).
4. Rename "Download questions for your client" to "Download open items (internal)". The file itself says "For your firm, not for the client."
5. Rename "Part of this proposal:" to "Adobe licenses this deal needs (Adobe quotes them)". Partners don't supply Adobe licenses.
6. Split "Ask your client for these" into "Ask your client" and "Confirm with Adobe".
7. Change the field's placeholder from "Will confirm with the client" to "Type what your client told you". The dark placeholder already looks like an answer that's been typed in.
8. Rename "What you have in place" to "Your current setup (as confirmed with your team)". Show each item with its subject, and move the section above "What we would do".
9. Add "What we will need from you" to the response, on by default. This undoes part of the Nov 9 split, on purpose, because of 2.2.
10. Show "Sort first" on "Not sure" rows instead of "See answer ›".
11. Drop "Our approach: We would deliver this with AEM Sites." when there's nothing to add. It's the first line a reader sees.
12. Make the "Drawn from:" chips editable (remove Target, add AEM Assets) and redraft. That's a one-click fix for products matched by mistake.
13. Move "Clear" out of the filter row, rename it "Start over", and confirm before it wipes anything.
14. Rename "Next question" to "Next to review", and include the firm questions. From 1.1 it currently jumps to 2.1.
15. Add a "Not picked up" filter listing every paragraph the finder skipped, with a way to turn one into a question. At today's hit rate it's the partner's only safety net.
16. Make each row keyboard-openable, and show its pile once. Today each row shows the "ADOBE SERVICES" tag and the menu, which say the same thing.

The biggest wins come first: A1 to A4 (the finder and the sorting), then A6 and A7 (what reaches the client), then A13 (telling a yes/no question from an approach question).

My test files and the harness are in its own session's scratchpad (not in this repo). It offered to save them to the ABV branch as regression tests (`sow/qa/rfp_adversarial/`) along with the review.
