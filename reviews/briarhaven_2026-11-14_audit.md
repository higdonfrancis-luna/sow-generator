# Briarhaven RFI audit: the plan (Nov 14 2026)

Five independent auditors (the bank's evaluation panel, root causes, accuracy, the RFI Builder screen, the options) read Adam's Briarhaven downloads (Word proposal, HTML response, checklist, Excel) from the no-AI build, then one synthesis. Nothing in the tool was changed. Steps are numbered from 97 (step 96 is the AEM Assets change).

## 1. Verdict on the Word document

The Word proposal scores **2 out of 10** with the bank's evaluation panel, and five auditors scored it between 2 and 4. A bank would screen it out as non-compliant before anyone read it on merit. It answers 2 of about 19 Adobe requirements ("2 Adobe requirements answered"), puts those 2 answers under garbled headings, and its hours contradict each other (216 and 112 hours in the answers, 96 in the table).

## 2. Why it went wrong

The writing is not the main problem. The tool read the PDF badly, and every step after that worked on broken input.

1. **The PDF reader scrambled the requirements table.** It read the Ref | Requirement | Priority table as a page in two columns. The codes, each row's last line, the Mandatory tags and the page header got moved away from their rows. Only B.3, D.4 and H.3 kept a code, and each one sits on the wrong text. The B.3 heading reads: "B.3 and rendition requirements. B.4 public entry points. Request for Proposal | 2027 delivery programme BCB-RFP-2027-014 Propose an AEM Forms approach..."
2. **Questions with no code never reach Word.** The proposal only uses questions that carry a code. The screen drafted about 15 Adobe answers and Word printed 2.
3. **Several questions were merged into one.** One row holds five AEM Sites questions: the content model, the Drupal migration, branch search, performance, and publishing and rollback. They get one answer.
4. **Answers draw on the wrong products.** Services are picked by matching words across the whole catalog. "Journeys" pulls in Journey Optimizer, and "test cases" pulls in Target. So the AEM Forms answer contains Analysis Workspace steps and Target setup steps.
5. **Products the client ruled out still show up.** The tool takes ruled-out products out after it has picked the services, and never picks again. So a question can lose its whole draft (A.1). Ruled-out names also stay inside sentences: Workfront Fusion, "an Adobe Analytics source connection", and Real-Time CDP in the licensing lines.
6. **The proposal keeps only the first five products.** Target was the sixth, so its services dropped out of the table. The cover says "5 catalog services" but the table lists 2.
7. **Word ignores the partner's choices.** It rebuilds every answer from scratch, so Use this answer, Leave out, edited text and typed firm answers never reach it. Your "test" answers are in the Excel and missing from Word.
8. **There is no bid skeleton.** The proposal has no delivery plan against 26 March, 18 June and 24 September 2027, no team, no commercials, no assumptions and exclusions, and no compliance matrix with Mandatory tags.

This is why the SOW builder looks great and the RFI output does not. We control the SOW builder's input. Here the input is a client's PDF, and the reader breaks it before anything else runs.

## 3. What can be fixed without AI, and what cannot

**Fixable without AI** (this is most of the damage):
- Read table pages correctly, strip running headers, and keep codes and Mandatory tags on their rows.
- Carry every question into Word, with the partner's accepted or edited answers and typed firm answers.
- Use one list of services and hours, so the cover, the answers and the table agree, with source numbers that point to the right pages.
- Limit each answer to the products its question names, and pick again after removing ruled-out products.
- Scrub ruled-out products from every sentence in every download.
- Use the RFI's own facts: Drupal (not the Content Transfer Tool), Snowflake (not BigQuery or Databricks), and a new AEM build.
- Add fixed bid sections filled from page data: plan, team, commercials, assumptions, compliance matrix, and an executive summary built from the RFI's numbers and dates.
- Add catalog services for the gaps: forms-to-Salesforce integration, and a CJA measurement design.

My estimate: this takes the Word proposal from 2 to about 5 or 6 out of 10.

**Not fixable without AI:**
- Wording each answer to its exact question in the client's own terms. The catalog's sentences stay generic.
- Reading RFP layouts the rules have never seen. Rules fix Briarhaven's table, but the next client's PDF will break something new.
- An executive summary that reads as if a person wrote it for this bank.

## 4. Recommendation on AI and ChatGPT

**AI: none now. Build the no-AI fixes first.** Writing with AI on broken questions would still produce a polished proposal that answers the wrong questions.

**If AI comes back later, make it one call to read, not to write.**
- One Opus 5.5 call lists the client's requirements as data: code, section, exact text, word limit, Mandatory tag, products named, products ruled out.
- The page checks that every item appears word for word in the RFI, so the AI cannot invent a requirement.
- Nothing the AI writes reaches the client.
- Cost is about $0.15 to $0.30 a run at list price, in 40 to 60 seconds. Your Bedrock price may differ.
- Build it behind a switch, off, and turn it on only when Adobe says yes to AI.
- One call to write is the last resort. Consider it only if blind scores stay under about 6 after everything else is built, and then only as a rewording pass where every service, hour and source must come from the page.

**ChatGPT should help, with two exact tasks:**
1. **Build a test pack.** Write 15 to 20 fictional RFIs and RFPs (bank, insurer, retail, public sector) as PDFs that use hard layouts: running headers, Ref | Requirement | Priority tables, codes at line ends, several asks in one paragraph, and section letters such as "A Public website". For each one, also write a gold JSON list of every requirement: code, section, exact text, Mandatory or Desirable, products named, products ruled out. This becomes the reader's test suite, and later the yardstick for the AI reading call.
2. **Judge blind.** Score the Word proposals before and after each step, as in round 3, without being told which version is which.

Please also attach the original Briarhaven PDF if you still have it, so we can make it a fixture. The auditors had to rebuild it.

## 5. Your UI questions

- **To sort (image 2):** remove it. Two of its three rows were broken pieces of the PDF, and the third was a real firm question. Every row should land in Adobe products or Your firm. Broken fragments should go to Not picked up.
- **Why add another product (image 3):** you should not have had to. A.1 names AEM Sites, but the tool read "journeys" as Journey Optimizer, which the bank ruled out. That removed every service, so the panel said "No match" and offered Add a product. The fix: try again without the ruled-out products (which gives the AEM Sites draft), show the products the question names in "Drawn from", and say why when a ruled-out product blocks a draft.
- **Alphabetical list (image 4):** yes. Put "In this RFI" first, then other Adobe products A to Z, then outside systems A to Z. Today it is 43 products in catalog order with outside systems mixed in.
- **Journey Optimizer (image 5):** there was no reason to add it. The client ruled it out, and adding it killed the draft. Ruled-out products should be hidden from the list, or shown greyed out as "(your client rules it out)".
- **Downloads and formats:**
  - **Full proposal, in Word:** always offered. It becomes the one document to print once it carries every answer.
  - **Answers, to print (HTML):** remove it in the same step that makes Word complete. You are right that it repeats Word. Today it is the only download that matches the screen, so it has to stay until then.
  - **Answers, in Excel:** remove it for PDF and Word RFIs. For this PDF it had Number on 3 of 24 rows and Section, Mandatory and Comply empty. For a spreadsheet RFI, keep only the write-back into the client's own file, and keep Word as well.
  - **My checklist:** make it Excel, one row per item with a Done column. Lines that hold for the whole RFI go once at the top (the bank's rule-out line is repeated 8 times today). Excel suits a to-do list better than PDF.
  - **Smaller fix:** a note on long rows still says "Build with Adobe RFI Agent splits a line like this". That button was removed on Nov 14, so the note should change.

## 6. Step plan (ordered by impact on what the client receives)

**Step 97: Word carries everything the partner approved.**
- Take every question, and give the ones with no code a reference such as Q7, flagged for the partner to replace.
- Use the partner's accepted or edited answer, skip Leave out, and put typed firm answers in About our firm.
- The requirements matrix lists every question. A test checks that Word's answer count equals the screen's.

**Step 98: The reader reads tables.**
- Do not split table pages into columns, and keep each code, last line and Mandatory tag with its row.
- Strip a repeated header wherever it lands, and rejoin text across page breaks.
- In a coded RFI, a line continues the open requirement until the next code. Read "A Public website" as a section heading. Make Briarhaven a fixture: the reader must find A.1 to H.3.

**Step 99: One list of services and hours.**
- Remove the five-product cap and apply the client's exclusions.
- Build the cover count, each answer's hours and the table from one list. The download refuses to save if they disagree.
- Map source numbers to the proposal's own list, and only list sources something cites.

**Step 100: Answers fit their question.**
- Screen and Word use the same answer.
- The lead service comes from the product the question names. Words like "journey" and "test" count only next to a product name.
- Remove ruled-out products before picking, not after. If a named product has nothing left, fall back to its own build services, never another product's.

**Step 101: Nothing wrong for this client.**
- Scrub ruled-out products from every sentence in all downloads, with a build check.
- Use the RFI's facts to pick the branch: Drupal, Snowflake, a new AEM build.
- Remove the promise to include Adobe's quote and the consent guarantee. Treat instruction lines ("Distinguish included work...") as rules to follow, not questions to answer.

**Step 102: The bid skeleton.**
- Delivery plan against the RFI's dates, a team table with placeholders, and commercials from hours times the partner's rate (subscriptions separate).
- Assumptions and exclusions, and a compliance matrix with Ref, Mandatory and Comply columns.
- An executive summary built from the RFP's number, title, figures, dates and outside systems. Partner-only notes move out of the client copy.

**Step 103: The RFI Builder screen.**
- Remove To sort.
- Order and group Add a product, and hide ruled-out products.
- Explain why a ruled-out product blocks a draft, and fix the stale long-row note.

**Step 104: Downloads.**
- Remove Answers to print, and remove the generic Excel for PDF and Word RFIs.
- The checklist becomes Excel.

**Step 105: Catalog gaps.**
- Add a forms-to-CRM integration service (mapping, duplicates, retry, exception queue) and a CJA measurement design service. Their hours wait for your review.
- When nothing fits, write "to be estimated in discovery" instead of the nearest service.

**After each step,** ChatGPT judges the Word output blind. After step 102 we decide whether the one reading call is needed. Each step gets a PNG mockup and your yes before it is built, as usual.
