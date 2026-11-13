# The method knowledge base (Nov 13 2026)

Adam: "I wanna look at removing AI from our tool ... I think we could build out a knowledge base robust enough with an architecture
that's brilliant ... where we don't need AI", then "build out the knowledge base and then start testing the output versus our
knowledge base", and the key metric: "The AI answers scored 6.9 to 7.7; today's no-AI answers score 2.5 to 3.1. If we can get those
no AI answer scores closer to the ones with AI then the partners can just fill in the gaps themselves ... I don't want incorrect
information in there, but it doesn't have to be the panoply of what AI could provide." The button stays as it is (Build with Adobe
RFI Agent); the live tool is unchanged until Adam decides.

## What it is

Every one of the catalog's 525 services has an entry in `sow/rfp_method.json`: 3 to 6 steps of the method, 2 to 5 deliverables,
up to 3 asks of the client, the main risk and how we handle it, the outcome, whether it is a whole workstream or a task, and its
phase. Adobe facts in an entry come only from that service's own checked material (its scope, the Adobe quote checked word for
word, the play templates, the connection's how, the knowledge base's facts); our own practice (workshops, inventories, pilots,
sign-offs, runbooks) is described freely.

## How it was built

- `batches/`: each service's material, in twelve batches. `BRIEF.md`: the rules. `examples.json`: three entries written by hand.
- `drafts/`: twelve drafting agents, one per batch.
- `reviewed/`: a workflow per batch (Review under `REVIEW.md`, then a skeptic looking for any Adobe claim the material does not
  carry or any broken rule, then a fixer who applies only the findings that hold up): 74 findings, all applied.
- `build_method.py`: the checker (shape, sizes by hours, no dashes, marketing words, prices, hours, release labels or ask-Adobe
  wording, the partner's voice, every product name in the entry's own material); it writes `sow/rfp_method.json`, and the site
  build runs it first. All 525 pass.

## How answers are built from it (no AI)

`RFPAnswers.method(q, d)` in `sow/rfp_answers.js`, not yet what partners see: the five parts the AI writes (our approach, how we
would do it, what you get, timeline and effort, risk we manage) from the matched services' entries, the RFI's own timeline, the
hours (a whole workstream's hours only in the question that is its home), license prerequisites and the license line for a
product the client did not choose; fitted to the RFI's word limit by the page's own `written()`. A service written for moving off
an older AEM is never used when the RFI's site runs on something else (Tallgrass's in-house CMS): the catalog has no service for
that move yet, so today's answer stands there.

## First measurement (Nov 13): three answers per requirement, blind, three judges each

`eval_answers.js` writes the no-AI answers; `panel_build.py` shuffles them with the AI's (the live run of Nov 13) and today's
catalog answers; six judges (procurement, technical and business lenses, on each RFI) scored every answer 1 to 10. Files and the
judges' notes: `scores_2026-11-13/`.

| | AI | Knowledge base, no AI | Today's catalog, no AI |
|---|---|---|---|
| Tallgrass (13 requirements) | 7.5 | **5.4** | 2.4 |
| Cedar Prairie insurer (24) | 7.5 | **3.5** | 2.8 |
| Both | 7.5 | **4.2** | 2.6 |

The knowledge base beats today's catalog answer on 31 of 37 requirements. Where the tool picked the right service, its answers
scored 5 to 6 on both RFIs (Tallgrass B.3 Snowflake 6.0, A.2 site build 6.0, Cedar D.2 Snowflake 6.2, D.4 Power BI 5.7).

## What the judges held against the no-AI answers, and the fix for each

1. **The wrong service** (the biggest: 8 of 24 insurer requirements scored 1 to 2): accessibility, Core Web Vitals and A/B
   testing got site-setup text, the Genesys handoff got analytics, GLBA got audiences. The insurer's questions are written as a real
   RFP, not to the catalog's words. Fix: each entry gets the phrases an RFI uses for that work ("approval workflow", "agent
   handoff", "WCAG") and the matcher scores them first; and a short topic playbook for common asks the catalog has no service for
   (accessibility, page performance, a client's own CDN, testing without Target, consent and privacy), each linked to the services
   whose hours it draws on.
2. **No tailoring**: the winners open with the client's own facts (Drupal 9, 3,400 pages, 900 PDFs, Akamai, Genesys, 35
   marketers). Fix: the opening sentence restates the facts the question and the RFI give (systems, sizes, timeline, industry).
3. **Stock openers**: the Adobe fact sentence ("your call center, point-of-sale systems and online properties") reads as pasted,
   and as retail wording to an insurer. Fix: no stock fact sentence; the outcome leads.
4. **License lines**: "users who know Adobe Analytics" gave "This uses Adobe Analytics, which is licensed separately". Fix: "know"
   and "familiar" count as naming a product without using it.
5. **The timeline line** ("This runs during the build") reads as boilerplate. Fix: sequence the work against its neighbours.

## Seen, not changed

- The catalog has no service for moving content off a non-AEM site into AEM Sites (Tallgrass A.3); flagged to Adam on Nov 12.
- The matcher's alias "experience platform" (Real-Time CDP) also matches "digital experience platform" (step 90).
