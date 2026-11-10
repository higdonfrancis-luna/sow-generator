// Mockup only (Nov 10 2026, Adam: "Let's see what we could do with what we build versus what Adobe built ... if we can
// perform them without AI and basically run this for free for our partners that helps me get this approved").
// One page: where Adobe's AI draft of the bank RFP reads better than ours, how each gap closes with rules and no AI, and
// what answer 2.1 and the panel would look like. Nothing in the tool is changed.
//   node sow/mockups/nov10_rfi_no_ai/mock.js     writes no_ai_plan.html and no_ai_plan.png
const {chromium} = require('playwright');
const fs = require('fs'), path = require('path');
const FONTS = path.join(__dirname, '..', '..', '..', 'video', 'fonts');
const b64 = f => fs.readFileSync(f).toString('base64');
const font = w => `@font-face{font-family:"Source Sans 3";font-weight:${w};src:url(data:font/woff2;base64,${b64(path.join(FONTS, `source-sans-3-latin-${w}-normal.woff2`))}) format("woff2")}`;
const GAPS = [
  ['Three answers came out blank', 'Answers all eight', 'A warning at download when answers will be blank, and "Approve" renamed "Use this answer" so it reads as the partner\'s own choice', 'Small'],
  ['Never names the client', 'Says "Northbridge" throughout', 'Read the client\'s name from the RFP\'s title lines, or take the Client name the partner typed, and use it in each answer\'s opening', 'Small'],
  ['AEM Sites answer has no discovery step and no list of what the bank must provide', 'Opens with a current-state assessment and ends with what it needs', 'One new sourced service (discovery and migration plan) and a "What we would need from you" list on the AEM Sites services', 'Small, one page of research'],
  ['Answers run 225 to 292 words', 'Runs 105 to 168 words', 'A "Shorter answers" switch. The shorter wording of each sentence already exists, built for word limits', 'Small'],
  ['Says little about a bank\'s own controls', 'Often mentions approval of regulated content, consent, accessibility and privacy', 'Where the RFP is from a bank or insurer, one line per answer on who approves regulated content and customer data use. Brand Concierge already has it', 'Medium'],
  ['A question that names no product is not drafted', 'Drafts everything', 'A larger word list for what each product is asked about, built from real RFPs. This is the one place AI would do more', 'Medium, needs sample RFPs'],
  ['Opening sentences exist for seven products', 'Writes about any product', 'Research the same sourced sentences for Commerce, Journey Optimizer, Workfront, Coworker and the rest', 'Medium, product by product'],
];
const OURS = [
  ['Every sentence traces to Adobe\'s pages', '38 links on a sources sheet in the bank file. Adobe\'s draft cites nothing'],
  ['Says what the work is', 'Named services with quantities, in delivery order. Adobe\'s draft could be any vendor\'s'],
  ['Asks the client for what is needed', 'Adobe\'s draft assumes and hedges ("must be confirmed", "not implied by this response")'],
  ['The RFP never leaves the partner\'s computer', 'The file is read in the browser. Nothing is sent to a server or a model'],
  ['No running cost', 'A page on Proto. No model, no key, no usage bill'],
  ['The same answer every time', 'Rules, so two partners get the same wording and every change is tested'],
  ['Goes on to a statement of work', 'The approved answers carry their services into the SOW'],
];
const NEW = s => `<span class="new">${s}</span>`;
const ANSWER = `<h4>Our approach</h4><ul>
<li>${NEW('For Northbridge Mutual Bank')} we would implement AEM Sites as a Cloud Service. Code is deployed through Cloud Manager, Adobe's one route for it, so every release passes the same code quality checks.</li>
<li>${NEW('We would start with discovery: an inventory of your current site\'s content, templates, URLs and integrations, then an agreed content model, migration mapping and acceptance criteria before the build starts.')}</li>
<li>How your existing content moves depends on where it sits today. From an existing AEM instance, Adobe's Content Transfer Tool moves it across. From another CMS, we would export the content, map it to the new templates and load it into AEM.</li>
<li>For go-live we would plan a content freeze, check the migrated content with you, test in the stage environment and run user acceptance testing before the DNS cutover, with redirects and rollback criteria agreed beforehand.</li></ul>
<h4>What we would do</h4><ul><li>The four services as today: Cloud Manager setup, the site build, content migration, author training.</li></ul>
<h4>${NEW('What we would need from you')}</h4><ul>
<li>${NEW('Access to the current site and its content, or an export of it.')}</li>
<li>${NEW('An inventory of pages, URLs and integrations, with an owner for each content area.')}</li>
<li>${NEW('Named reviewers for the content checks and user acceptance testing.')}</li>
<li>${NEW('Your accessibility, retention and security requirements for the site.')}</li></ul>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>${font(400)}${font(600)}${font(700)}
body{margin:0;font-family:"Source Sans 3",sans-serif;color:#1C1C1C;background:#fff}.bar{height:10px;background:#EB1000}main{padding:38px 52px 48px;width:1796px}
.k{font-size:16px;font-weight:700;letter-spacing:2.2px;color:#B30B00;text-transform:uppercase}h1{font-size:40px;margin:6px 0 4px}p.sub{font-size:21px;line-height:30px;margin:0 0 26px;max-width:1500px}
h2{font-size:27px;margin:30px 0 12px}h4{font-size:14px;letter-spacing:1.4px;text-transform:uppercase;margin:14px 0 4px}
table{border-collapse:collapse;width:100%;font-size:18.5px;line-height:26px}th{text-align:left;font-size:14px;letter-spacing:1.5px;text-transform:uppercase;padding:9px 14px;border-bottom:2px solid #1C1C1C}
td{padding:10px 14px;border-bottom:1px solid #D5D5D5;vertical-align:top}td:first-child{font-weight:700;width:330px}.eff{font-weight:600;white-space:nowrap}
.two{display:grid;grid-template-columns:1.25fr 1fr;gap:34px;align-items:start}.box{border:2px solid #1C1C1C;border-radius:14px;padding:16px 22px 18px;font-size:18px;line-height:26px}
.box ul{margin:4px 0 0;padding-left:22px}.box li{margin:3px 0}.new{background:#FFE8E5;border-bottom:2px solid #EB1000;font-weight:600}
.note{border:1.5px solid #1C1C1C;border-left:6px solid #EB1000;border-radius:10px;padding:12px 16px;margin:0 0 14px;font-size:18px;line-height:26px}
.btn{display:inline-block;border:1.5px solid #1C1C1C;border-radius:999px;padding:6px 18px;font-weight:700;font-size:17px;margin-right:10px}.btn.red{background:#EB1000;border-color:#EB1000;color:#fff}
.warn{border:2px solid #EB1000;border-radius:10px;padding:12px 16px;font-size:18px;line-height:26px;font-weight:600}.legend{font-size:17px;margin:0 0 10px}
</style></head><body><div class="bar"></div><main>
<div class="k">Proposal for Adam's yes, Nov 10 2026: nothing built</div><h1>Beating Adobe's AI draft with no AI</h1>
<p class="sub">From the bank RFP both tools answered. On the eight product questions ours is stronger wherever it answers. These are the places Adobe's draft reads better, and how each one closes with rules alone.</p>
<h2>Where Adobe's draft is ahead, and the fix</h2>
<table><thead><tr><th>Ours today</th><th>Adobe's draft</th><th>The fix, with no AI</th><th>Size</th></tr></thead><tbody>
${GAPS.map(g => `<tr><td>${g[0]}</td><td>${g[1]}</td><td>${g[2]}</td><td class="eff">${g[3]}</td></tr>`).join('')}</tbody></table>
<h2>What it would look like</h2>
<div class="two"><div><p class="legend">Answer 2.1, AEM Sites and migration. <span class="new">Marked</span> is what would be added.</p><div class="box">${ANSWER}</div></div>
<div><p class="legend">In the RFI Builder</p>
<div class="note"><b>Your call.</b> These answers are suggested drafts, drawn from Adobe's public documentation. Review and edit every answer: you are responsible for what you send to your client.</div>
<p style="margin:0 0 14px"><span class="btn red">Use this answer</span><span class="btn">Leave out</span></p>
<div class="warn">3 answers about Adobe products are not marked "Use this answer" and will be blank in the file: 2.6, 2.7, 2.8.</div>
<h2 style="font-size:22px;margin-top:26px">What ours has that an AI draft does not</h2>
<table style="font-size:17.5px;line-height:25px"><tbody>${OURS.map(o => `<tr><td style="width:250px">${o[0]}</td><td>${o[1]}</td></tr>`).join('')}</tbody></table></div></div>
</main></body></html>`;
(async () => {
  if (/[–—]/.test(html.replace(/data:[^"')]+/g, ''))) throw new Error('a dash in the page');
  fs.writeFileSync(path.join(__dirname, 'no_ai_plan.html'), html);
  const b = await chromium.launch(), p = await (await b.newContext({viewport: {width: 1900, height: 1000}, deviceScaleFactor: 1.5})).newPage();
  await p.setContent(html); await p.waitForTimeout(500); await p.screenshot({path: path.join(__dirname, 'no_ai_plan.png'), fullPage: true});
  console.log('written', await p.evaluate(() => document.documentElement.scrollHeight)); await b.close();
})().catch(e => { console.error(e); process.exit(1); });
