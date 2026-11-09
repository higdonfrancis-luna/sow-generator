# Outside reviews of the RFP Builder prototype, Nov 9 2026

Adam ran `../REVIEW_PROMPT.md` past three models and pasted their answers back. They are saved here as received, one file each:

| File | Reviewer | How it worked |
|---|---|---|
| `opus_5_5.md` | Claude Opus 5.5 (in its own Claude Code session on this repo) | Built the prototype from `abv-partner-plays` at `4e789a0`, drove it in headless Chromium, about 140 hostile inputs and 8 RFP files, all 201 service lines and 75 connections through the voice rewrite. |
| `deepseek.md` | DeepSeek | Could not run the page; graded from the written description and the three libraries. |
| `gemini_4_argon.md` | Gemini 4 Argon | Inspected and executed the JavaScript logic (findQuestions, classify, readSheet, match, compose, rfp, toSow, Save draft) against realistic inputs. |

`../RESPONSE.md` sorts every finding into confirmed, partly, not reproduced and disagree, with the reproduction behind each verdict (`../harness.js`, `../verification/`).
