# RFI Builder step 75: Download proposal (Nov 11 2026)

Adam, on seeing the sample proposal for the Washington State RFP: "it looks really good way better than what we had before",
then "yes" to building it into the tool, then "Deploy" for the worker route.

## What a partner sees

The Download menu has a new choice, **Proposal (Word), written by AI**: "A full proposal from this RFI and the catalog:
summary, solution, services, schedule and a requirements matrix. Takes a few minutes." A line at the foot of the window
counts the time and the part while it is written, then a Word file downloads, named after the RFI.

The file has a cover, read-first notices, an at-a-glance page, twelve numbered sections and the Adobe sources:
1 Executive summary, 2 Our understanding of your requirements, 3 Proposed solution, 4 Delivery approach,
5 Services and effort, 6 Training and knowledge transfer, 7 Governance, reporting and acceptance, 8 Illustrative schedule,
9 Requirements response matrix, 10 Bidder qualifications, 11 Assumptions, dependencies and risks,
12 What we need from you, and open questions. What only the partner knows is a highlighted [BRACKETED FIELD].

## How it works

- `sow/rfp_proposal.js` (inlined by `patch_step49.py`): sends the RFI's text, the list of what it asks for and a catalog
  pack (`proposalPack()` in `rfp_answers.js`: up to five products the RFI is about, their services with hours, their
  connections, checked facts and numbered Adobe sources). No answer, note or decision of the partner's is sent.
- The writer is `POST /rfi/propose` on the worker `warroom-assistant` (Claude Sonnet 5 on Adam's Bedrock key, streaming,
  only for calls from proto.adobe.io, nothing stored). A plan comes back first, then five parts are written at once.
  Code: `sow/ai_reading/warroom-assistant-worker.js`. Another key or model is one address, `WRITER_URL`.
- The page checks what comes back before it is used: a source number that is not in the pack is taken out; a sentence
  with a release label, Adobe Consulting Services or a software price is left out; dashes become commas; a catalog id
  becomes the service's name; unknown block types are dropped.
- **Services and effort is never taken from the model.** The page builds it from the catalog: the service names, the
  catalog's own wording and hours, and their totals. The model only chooses which services; an id the catalog does not
  have is dropped. Work the catalog does not cover is listed apart as "Work to be estimated in discovery", with no hours.
- The Word file is made in the browser (`sow/lib/docx.iife.js`, docx 9.7.1). Each part is tried up to three times.

## Deployed

Nov 11: code-only deploy of the worker (the live code equals the repo file; bindings and secrets unchanged; `/rfi/read`
and `/rfi/propose` answer 403 without Proto's Origin). Rollback copy kept in the session's scratch folder; the previous
code is the same file without the `/rfi/propose` route and `handleRfiPropose`.

## Real runs (the live route, from the built page)

| RFP | Time | Pages | Services | One-time hours | Matrix rows | Sources |
|---|---|---|---|---|---|---|
| Washington State DSHS 2123-778 (PDF, AEM Forms) | 2:05 to 2:48 | 27 | 17 to 21 | 952 to 1,488 | 55 to 62 | 22 |
| Northbridge Mutual Bank (Excel, fixture) | 3:15 | 25 | 30 | 2,300 | 14 | 76 |
| Meridian Industrial Controls (PDF, fixture) | 1:33 | 20 | 15 | 628 | 10 | 27 |
| UNDP AEM managed services (PDF, 2019) | about 2:20 | 21 | 2 | 48 | 60 | 20 |

The files are in `sow/rfp_prototype/step75_live/`. In all four: twelve sections in order, every citation points to a
real source in the pack, no release labels, no Adobe Consulting Services, no prices, no dashes, no catalog ids.

## What is not perfect, said plainly

- **It is a draft.** Qualifications, staff, references and rates are bracketed fields. The first notice on the file says so.
- **Two runs of one RFI differ.** The Washington State plan chose 17 services (952 hours) in one run and 21 (1,488) in
  the next. The hours of each service are always the catalog's; which services are chosen is the model's call.
- **UNDP is the weak one.** That RFP asks for managed services on an existing AEM environment (SLAs, backups, disaster
  recovery). The catalog has two services that fit, so the effort table has two rows and the rest is listed as custom
  work, which is honest. But the summary says "the environment runs on Cloud Manager", which the RFP does not say.
  The writer can assume AEM as a Cloud Service when the RFI describes an older setup: check it.
- **Dropped connections in testing.** About one call in four from this session was cut off mid-reply and retried.
  Cloudflare's own count shows every call (41 of 41) finished with no error, so the drops look like this session's
  network path, not the worker. The page now tries each part three times. Watch for it on Proto.
- **The first call after a deploy** got the old code's reply once (a few seconds of rollout).
- The dates in an old RFI are flagged in a notice rather than fixed.

## Checks

`node sow/test_rfp_step75.js` (34, writer stubbed; the worker's route is checked as text).
