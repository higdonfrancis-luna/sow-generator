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

## Round 2 (Nov 13): what was built

Adam's plan for round 2, after round 1's judges: phrases for matching, a topic playbook for common asks with no service, tailoring,
then measure again, with ChatGPT helping ("We might as well put its brain to work").

1. **Phrases.** Every service has the phrases an RFI uses for its work: 4,034 written by Claude (12 batches, each checked by a
   second agent so each set points to its own service: 171 fixes, `phrases/checks_batch_NN.json`; 4 added by hand where the checks'
   own reasoning put them, `phrases/checks_manual.json`) and 4,075 written by ChatGPT on its own, without reading Claude's
   (`chatgpt_round2/phrases_batch_NN.json`), merged by `build_method.py` into `rfp_method.json`: 8,109 in all. The no-AI writer
   ranks the services of the question's products by them (a rare word counts more than a common one; a product's own name or an AI
   assistant's name proves nothing; the matcher's own order still counts) and leans a whole-site build question to the site build.
   On the two tuning RFIs the right service or topic now leads 35 times in 37 (round 1: 29); ChatGPT's phrases leave that unchanged
   and add new wording for RFIs never seen.
2. **The topic playbook** (`playbook/`, brief in `playbook/BRIEF.md`): accessibility, page speed and Core Web Vitals, the client's
   own CDN, A/B testing without Adobe Target, consent and privacy; 24 Adobe facts, each quoted word for word from Adobe's pages with
   the page's title. Each topic was written, then checked by a skeptic (41 findings, 37 applied). A topic answers a question that
   says one of its triggers and is about one of its products, unless a service of its own answers it; where two match, the one the
   question asks about wins; its own hours are counted once (a month after launch); the consent topic names back the laws asked
   about (the Gramm-Leach-Bliley Act).
3. **Hours and services.** Each answer's services are settled once (`kbPlan`); every service's hours are counted in one answer
   only, its home, and every "estimated in our answer to" names an answer that counts it; one whole workstream per phase (no
   second site build); the hours line leads Timeline and effort, so a word limit trims softer lines first.
4. **Tailoring.** The answer opens with what the client told us, in its own words ("You told us: Akamai is your enterprise CDN
   and must remain in front of the site.").
5. **Checks.** `node sow/test_rfp_kb_round2.js` (46).

## ChatGPT's part

On branch `chatgpt/kb-round2`, merged here (`chatgpt_round2/`, tasks in `TASKS.md`, outputs in `DONE.md`): its own phrases; a
blind judge of round 1, which agreed with Claude's judges (insurer: AI 7.3, no AI 3.8, catalog 3.5; Tallgrass: 7.6, 6.5, 3.8); and
a fresh test RFI, **Vennor Quay Motionworks** (`test_rfi.txt`: a fictional dealer-led manufacturer, 26 requirements, three
languages and five markets), written without reading the tool, so the tool was never tuned on it. Task 4 (judge round 2 blind) is
on hold until Adam asks.

## Second measurement (Nov 13): four answers per requirement, blind, twelve judges

`scores_round2/`: for each requirement the judges saw, shuffled and unlabeled, the AI's answer (the live run), the round 2 no-AI
answer, the round 1 no-AI answer and today's catalog answer. Four judges per RFI: procurement, technical, business, and an Adobe
solution architect checking every statement about Adobe. Scores in `results.json`, every judge's notes in `judges.json`.

| | AI | No AI, round 2 | No AI, round 1 | Today's catalog |
|---|---|---|---|---|
| Insurer (24 requirements) | 7.6 | **4.5** | 3.3 | 2.8 |
| Tallgrass (13) | 7.6 | **5.6** | 5.0 | 2.9 |
| Vennor, never tuned on (7) | 7.3 | **3.2** | 2.7 | 2.1 |
| All | 7.5 | **4.6** | 3.7 | 2.7 |

The topic answers did best: page speed 7.1 (round 1: 1.1; the AI: 8.0), A/B testing without Target 6.8 (1.1), accessibility 6.0
(1.1), the client's own CDN 5.5 (1.8), consent and GLBA 5.1 (2.1); the Compliance approval workflow rose from 1.1 to 3.5 and the
Snowflake and Power BI answers reached 6.8 and 6.3.

**A second, independent judge.** ChatGPT scored the same three panels blind (Task 4, `chatgpt_round2/judge_round2_*.json`):
AI 7.1, no AI round 2 **5.1**, round 1 4.1, catalog 3.1 (insurer 7.1, 4.8, 3.5, 3.2; Tallgrass 7.5, 6.5, 6.1, 3.2; Vennor 6.6, 3.3,
2.7, 2.4). The same ranking and the same rise of about one point from round 1 to round 2; it puts the gap to the AI at 2.0 points
where Claude's judges put it at 2.9.

**Coverage on the RFI never tuned on.** The AI read Vennor's 22 Adobe and security questions and its 4 firm questions without a
miss and drafted every one. With no AI, 8 of the 18 implementation questions landed in To sort or Your firm and got no draft: they
name the work and no product ("How would authors and reviewers approve a page before it goes live?"). A dry run showed phrases do
not sort them reliably (references and staffing questions scored as high as real Adobe questions); the cause is the catalog,
which has no service for most of that work (see round 3).

## The accuracy audit (Nov 13)

Every statement about Adobe in the 44 no-AI answers (321 in all) was checked on Adobe's pages by nine auditors, and a skeptic tried
to refute each of the 51 findings (`scores_round2/audit/findings.json`). 42 held: 6 wrong and 36 misfits (true, but wrong for the
client or the question); 9 were refuted. Fixed since the measurement (not yet scored again):
- 22 edits in 10 knowledge-base entries, each with its finding and Adobe's words (`scores_round2/audit/kb_fixes.json`): Cloud
  Manager profiles before AEM product profiles; the BI extension permission; the BI extension's 30 days is a default, not a limit;
  logs reviewed weekly, within the seven days Cloud Manager keeps them; tested 301 redirects; documents in a migration's
  keep-or-retire map; Optimize at Edge on the outer CDN with the client's CDN team; a source inventory without example channels the
  client may not have; Brand Concierge's live chat and meeting booking go through Adobe Marketo Qualifier, now named with its
  license where the client has not chosen it.
- The writer: a product a service also needs (CJA audiences publish into Real-Time CDP or Journey Optimizer) is named with its
  license when the client has not chosen it, as the AI writer does since step 90; a connection's services ride along only where
  the question names both products (no Universal Editor setup in a go-live answer); a package line goes with the answer that
  counts its service.

## Round 3 (Nov 13, Adam: "yes, build 1 and 2"): built, not yet scored again

`ROUND3_PROPOSAL.md` lists six items; Adam said yes to the first two.

- **Item 1, the catalog gaps: step 91.** Six optional services, each researched on Adobe's pages, checked by a second reader and
  fixed (36 quotes found word for word): SI07 page review and approval workflow, SI08 language copies and local corrections, SI09
  nightly ERP or PIM data into pages, SI10 content migration from another CMS, AS07 document versions, expiry and replacement,
  MK07 email program and preference migration. Record and hours for Adam to review:
  `sow/canvas/research/gaps_2026-11-13/STEP91.md`; `node sow/test_step91.js` (21).
- **Item 2, answers that fit the client:** a step keeps only the option the RFI has made (your own Akamai CDN, AEM Authoring,
  Power BI, Salesforce); on an Edge Delivery RFI the Edge Delivery launch, build and migration services take the place of their AEM
  as a Cloud Service counterparts; the opener never repeats a question's ask or instructions, and each background sentence opens
  one answer, the one it fits best; the work is placed against the RFI's own launch date; phrase matching takes out whole Adobe
  product names, not every word in one ("measure" counts again); three phrasings added where a check showed the gap.
- **Measured on the tuning RFIs:** the right service or topic leads 38 times in 38 (round 2: 35 in 37; Tallgrass A.3, moving off
  its own CMS, now has a service). On Vennor Quay the Drupal move and the email migration now have answers. Six of Vennor's
  questions still land in To sort and two in Your firm, so they get no draft without AI; sorting by phrases now looks possible
  (`STEP91.md`). `node sow/test_rfp_kb_round2.js` (54).

## Round 3, still proposed (waiting for Adam): items 3 to 6 of `ROUND3_PROPOSAL.md`
