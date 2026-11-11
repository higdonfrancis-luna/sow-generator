# RFI Builder step 81 (Nov 11 2026)

Adam: "we should do a better job of labeling the outputs, they get confusing"; on the first picture, "still way too
confusing"; on the second (`sow/mockups/nov11_download_labels/labels_simple.png`), "the top one starting with answers, to
print". Then: "add one sentence right under the total ... and fix all three".

## The Download menu: four plain lines

| Was | Is |
|---|---|
| Response document | **Answers, to print**: Your chosen answers, in order. |
| Response as a new Excel | **Answers, in Excel**: Your chosen answers, one row each. |
| Proposal (Word), written by AI | **Full proposal, in Word**: Written by AI. Takes 2 to 3 minutes. |
| My checklist (for you, not the client) | **My checklist**: Notes for you, not the client. |

The dividing rules between the items are gone with their code. The files themselves are unchanged ("Answers, to print"
is still a page that opens in the browser). The client's own workbook, when one was dropped, is still the first item.
Built picture: `sow/mockups/nov11_download_labels/built_menu.png`.

## The proposal: a sentence under the hours total

Where the RFI asks for work the catalog does not cover, Services and effort has a boxed sentence right under the hours
table, "Not the whole job: This total covers the standard services above. The work listed below is not yet estimated and
will add to it." (Adam's Washington State proposal showed 968 hours with the conversion of 300 forms left to estimate.)
A proposal with nothing left to estimate has no such sentence. `servicesSection` in `sow/rfp_proposal.js`.

## Three readings, found while writing the demo RFP

1. **Licensed is not running.** "We have licensed AEM Sites" (also "licenses", "subscribes to") marks the product as
   the client's own but no longer drops its set-up and go-live services; "runs on", "we use", "our ..." still do
   (`LICENSED`, `licensedOnly` in `ownedProducts`).
2. **Analysis Workspace follows the RFI.** It is Customer Journey Analytics' where the line names that product, or
   where the RFI names it more often than Adobe Analytics; a line that names Adobe Analytics stays Adobe Analytics
   (`workspaceHome`, in `scan`).
3. **Monthly services for a named product.** "Monthly services for Customer Journey Analytics after launch" is
   answered with Monthly journey analysis and insights, the product's first monthly service, where it used to fall back
   to a one-time service (the rule that did this for questions naming no product now covers ones that name it).

## Step 82: the three that were seen and left (Adam: "i want as perfect a product as possible")

- **An after-launch question that names no product** ("the monthly services you would provide after launch") got no
  answer when the RFI's two products had a connection between them: the code read it as a question about that
  connection and stopped. It now gets each product's monthly service (`match`: no pair check for an after-launch
  question).
- **"Set up our AEM Sites Cloud Manager program"** no longer marks AEM Sites as already running: a product named right
  after set up, stand up, implement, install, deploy, launch, build, create, provision or configure is being asked for
  (`TO_BUILD` in `ownedProducts`).
- **"Analysis Workspace" alone** sorts a line into Adobe products (`ADOBE_NAME` in `sow/rfp_finder.js`).

`node sow/test_rfp_step81.js` (20); `test_rfp_step75.js` and `test_rfp_summary_bar.js` updated for the labels.
