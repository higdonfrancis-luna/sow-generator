# A short RFP to demo with (Nov 11 2026)

Adam: "i'd also like you to create an rfp or rfi request in pdf. the washington one is way too long. i need something
to demo. fake organization looking for aem and cja implementation services".

- `Tallgrass_Home_and_Garden_Inc_RFP.pdf`: three pages. Tallgrass Home & Garden, Inc. is a fictional retailer (the last
  line of the PDF says so). It asks for AEM Sites and Customer Journey Analytics implementation services: 15 questions
  about the Adobe work (AEM Sites, CJA, the two together, after launch) and 5 about the bidder's firm.
- `tallgrass_rfp.html`: its source. To remake the PDF, print it to PDF from Chromium at Letter size.
- `Tallgrass_proposal_sample_written_by_AI.docx`: what Download > Proposal (Word) made from it on the live writer.

How it runs in the tool (Nov 11, the step 79 build):

| | Result |
|---|---|
| The tool's own reading | 20 questions: 15 Adobe products, 5 Your firm, in under a second |
| Answers drafted with no AI | 15 of 15 Adobe questions (A.6, hosting and certifications, from the knowledge base) |
| Client's name | read from the file's name: Tallgrass Home and Garden Inc |
| Build Answers with AI (live) | 10 seconds, the same 20 lines |
| Proposal (Word), written by AI (live) | 83 seconds |

The wording was tuned so each question lands on the service it is about. Three things in the tool were worked around in
the RFP's wording rather than fixed (flagged for Adam):

- "We have licensed AEM Sites" or "our AEM Sites program" makes the tool treat AEM Sites as already running, so the
  set-up and go-live services drop out. The RFP says "We have chosen ... and neither is set up yet".
- "Analysis Workspace" alone is read as Adobe Analytics, even beside "Customer Journey Analytics".
- "Monthly services for Customer Journey Analytics after launch" gets Audiences that act on the data, not Monthly
  journey analysis and insights, unless the question says "analysis and insights".
- The title lines of a PDF are read as one paragraph, so the client's name is not found there.
