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

# A second, harder demo RFP: Cedar Prairie Mutual (Nov 12 2026)

Adam: "should we create a test RFP that is a bit more robust and that allows AI to answer every question?", then "yes, build
the insurer RFP". Unlike Tallgrass, the wording is not tuned to the tool: it reads like a real insurer's RFP.

- `Cedar_Prairie_Mutual_Insurance_Company_RFP.pdf`: five pages. Cedar Prairie Mutual Insurance Company is a fictional
  regional insurer (the last line says so). 39 requirements in seven sections, each with its own word limit (A 200, B 300,
  C 250, D 250, E 150, F 200, G 250) and a Mandatory or Desirable tag: the firm (5), the website on AEM Sites with Edge
  Delivery Services (8), Brand Visibility and Brand Concierge (6), Customer Journey Analytics and integrations (7),
  security and hosting (6), training, Coworker and monthly services (5), pricing (2).
- `Cedar_Prairie_Mutual_Insurance_Company_Response_Form.xlsx`: the client's response form, the same 39 rows (Ref, Section,
  Requirement, Mandatory or Desirable, Word limit, Vendor response, Compliance with a drop-down), to test writing answers
  back into the client's own file.
- What it tests on purpose: systems the catalog names as outside systems (Drupal, Akamai, Salesforce, Snowflake, Power BI)
  and ones it does not cover (Genesys Cloud handoff, Okta sign-on, a print vendor); a product the client already uses
  (Marketo Engage); a product it rules out (Adobe Target, B.7); fact questions (E.1 to E.6); a pricing question (G.1);
  regulated content (B.6, C.4, D.6).
- `build_cedar_prairie.py` makes both files from one list of requirements (`cedar_prairie_rfp.html` is the PDF's source):
  `python3 sow/rfp_prototype/demo/build_cedar_prairie.py`.
