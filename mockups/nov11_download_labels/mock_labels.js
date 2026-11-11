// Mockup only (Nov 11 2026, Adam: "we should do a better job of labeling the outputs, they get confusing"). Nothing in the
// tool changes: the Download menu of the built page is relabelled in the browser. Two pictures: today, and proposed.
//   node sow/mockups/nov11_download_labels/mock_labels.js
const path = require('path'); const {open} = require(path.resolve(__dirname, '../../rfp_prototype/review_2026-11-09/harness.js'));
const DOC = ['Request for Proposals 77-A: AEM Forms Implementation', 'The Division is replacing its forms software with AEM Forms. AEM Forms will be hosted by Adobe.',
  '3.1 Describe how you would create a form data model for our data sources in AEM Forms.', '3.2 Describe how you would convert 300 existing forms to adaptive forms in AEM Forms.',
  '4.1 Provide three references from similar projects.'].join('\n\n');
const NEW = `
<p class="mk-h">Your answers <span>the ones you marked "Use this answer", in the RFI's order</span></p>
<button type="button"><b>Answers to print</b><span>Each question with its answer. Opens in your browser: print it or save it as a PDF.</span></button>
<button type="button"><b>Answers in Excel</b><span>One row per question, with the Adobe sources on their own sheet.</span></button>
<p class="mk-h">A full proposal <span>written by AI from the whole RFI</span></p>
<button type="button"><b>Proposal in Word</b><span>A written bid: summary, solution, services and hours, schedule, requirements matrix. Takes 2 to 3 minutes. It does not use the answers you chose above.</span></button>
<p class="mk-h">For you <span>not for the client</span></p>
<button type="button"><b>My checklist</b><span>What to ask your client and what to confirm with Adobe.</span></button>`;
(async () => { const h = await open({scale: 2}), p = h.page; await p.setViewportSize({width: 1100, height: 900});
  await p.goto(p.url().split('#')[0] + '#rfi'); await p.reload(); await p.waitForTimeout(500);
  await p.evaluate(t => RFPBuilder.load('division_rfp.txt', t), DOC); await p.waitForTimeout(300);
  await h.setStatus(0, 'used'); await p.waitForTimeout(200);
  await p.click('#rfp-download-menu'); await p.waitForTimeout(200);
  const shot = async name => { const m = await p.$('#rfp-dl-menu'), b = await m.boundingBox(), t = await (await p.$('#rfp-download-menu')).boundingBox();
    const sy = await p.evaluate(() => window.scrollY); await p.screenshot({path: path.join(__dirname, name), fullPage: true, clip: {x: Math.max(0, b.x - 24), y: t.y + sy - 16, width: b.width + 48, height: b.y + b.height - t.y + 36}}); };
  await shot('labels_today.png');
  await p.addStyleTag({content: '#rfp-dl-menu .mk-h{margin:0;padding:12px 16px 4px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#C40000}#rfp-dl-menu .mk-h span{display:block;margin-top:2px;font-size:13px;font-weight:400;letter-spacing:0;text-transform:none;color:#1C1C1C}#rfp-dl-menu .mk-h:not(:first-child){border-top:1.5px solid var(--line);margin-top:6px}'});
  await p.evaluate(html => { const m = document.getElementById('rfp-dl-menu'), cls = m.querySelector('button').className.replace('sep', ''); m.innerHTML = html; m.querySelectorAll('button').forEach(b => { b.className = cls; }); }, NEW);
  await p.waitForTimeout(150); await shot('labels_proposed.png');
  await h.close(); })().catch(e => { console.error(e); process.exit(1); });
