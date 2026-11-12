# Step 89, proposed: what the insurer RFP found (Nov 12 2026)

Adam asked for a harder test RFP ("yes, build the insurer RFP and deploy the worker"). Cedar Prairie Mutual
(`demo/Cedar_Prairie_Mutual_Insurance_Company_RFP.pdf` and `_Response_Form.xlsx`, 39 requirements, seven sections, each
with its own word limit) was run through Build Answers with AI on the live worker, and read seven more times to measure the
reading. Nothing below is built; it waits for Adam's yes.

## What works

- The writing itself: Opus 5.5 wrote every answer it was given (23 on the Excel form in about two minutes), specific to an
  insurer (Compliance approval of rates and claims pages, GLBA, licensed agents, Akamai kept in front, Snowflake policy
  data, 35 Coworker users). The no-Target question got a real non-Target method.
- The tool's own reading of the Excel form: all 39 rows with their references; the firm and pricing questions go to Your
  firm; the client's name is found.

## What it found

1. **Word limits.** The RFP gives 200, 300, 250, 250, 150, 200 and 250 words by section. The PDF is read as 200 words for
   every question (the first limit in the document): website answers are cut short and security answers can run over. The
   Excel form's Word limit column is not read at all, so the AI answers ran 390 to 700 words where 150 to 300 are allowed.
   An RFP can disqualify an answer for this.
2. **The Excel form loses its references.** The AI reader is sent only the requirement text, not the Ref, Section,
   Mandatory or Word limit columns, so it makes up references ("WCAG 2.2 AA conformance" one run, "Response form" the
   next). Answers then cannot go back into the client's own rows, and the list reads oddly.
3. **Half a PDF can vanish without a word.** In 2 of 7 readings, the second half of the PDF (C.2 to G.2, 30 requirements)
   came back as "The AI model found nothing to answer in this document." The worker says that whenever the model's reply
   has no line in the expected tab layout; the page accepts it as an empty part (the rule was meant for a signature page)
   and does not retry.
4. **Questions that name no product are not written.** The AI reading drops section headings, so "Describe your go-live
   and cutover plan" (B.8), the Drupal migration (B.2) and "improve how Cedar Prairie appears in AI-generated answers"
   (C.2) find no services and keep the catalog's answer or none.
5. **A product the client rules out.** "We will not license Adobe Target" got Target's services as candidates, and its
   answer listed two Target services, which would become statement of work ticks.
6. **Ask-Adobe wording slips through.** "We will get its hosting region from Adobe in writing before you sign" and "we
   will obtain Adobe's written data-use terms" are "confirm with Adobe" in other words (rule 12); the page's filter only
   catches the exact phrase.

## Proposed fixes

1. Each question takes the word limit stated for its own section (the nearest limit above it in the document) or its
   row's Word limit column; the answer is fitted to it.
2. When the RFI is a spreadsheet the tool reads row by row with references, Build Answers with AI keeps those rows and goes
   straight to writing (references, Mandatory tags, limits and write-back stay right; about 30 seconds faster).
3. The worker reads replies with pipes or spaces as well as tabs, and calls a reply with no usable line a failure; the page
   tries a part that comes back empty once more, and if it is still empty says so: "Part 2 of 2 of this RFI could not be
   read. Check its questions yourself, or press the button again."
4. A question that names no product is given the services of the products the RFI is about, and the writer picks what
   applies; the tool's own classifier keeps a firm question away from the writer. A product the question rules out
   ("will not license", "without") gives it no services.
5. The writer's brief and the page's filter rule out any sentence that defers to Adobe ("get ... from Adobe in writing",
   "obtain Adobe's written terms").

Then: rerun Cedar Prairie and Tallgrass live, score them blind, and add the checks to `node sow/test_rfp_step89.js`.

Files from the runs: `step88_live/cedar_xlsx_answers.txt`, `step88_live/cedar_pdf_answers.txt`.
