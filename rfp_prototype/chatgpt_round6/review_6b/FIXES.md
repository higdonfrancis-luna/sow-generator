# Round 6b for ChatGPT: fixes after review (Nov 15 2026)

Work on `chatgpt/round6`. Bring this folder in with `git checkout origin/claude/amazing-volta-go9ton -- sow/rfp_prototype/chatgpt_round6/review_6b`. Every rule in `../TASKS.md` still applies; add a failing check to `test_round6.js` for each item before fixing it; keep `check_reader.js` at 152 of 152 and `check_parity.js` at 0 losses. Before building anything not on this list, ask Adam whether he would like to see a mockup first.

## Item 1 (Adam: "Yes")

**The ruled-out note shows only when the question names the ruled-out product.** On Briarhaven A.1 ("Describe your proposed AEM Sites approach for deposit, mortgage enquiry and small-business journeys ...") the panel says "Your client rules out Journey Optimizer, so this answer draws on AEM Sites only." The question never asks for Journey Optimizer; the word "journeys" matched it. Expected: the line appears only when the question's own text names the ruled-out product by name (for example "Describe how you would use Journey Optimizer to ..."); on A.1 there is no line, and nothing else on the panel changes.
