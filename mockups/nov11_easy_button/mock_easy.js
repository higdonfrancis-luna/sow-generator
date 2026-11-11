// Mockup only (Nov 11 2026, Adam: "start over moved to next to back to homepage", "move the Build with AI button more
// centered", "can it look like the famous staples 'Easy Button'?"). Nothing in the tool changes: the built page is restyled
// in the browser. Two options: A a round push button, B a wide centered button.
//   node sow/mockups/nov11_easy_button/mock_easy.js
const {chromium} = require('playwright'), path = require('path'), http = require('http'), fs = require('fs');
const ROOT = path.resolve(__dirname, '../../site/sow');
const DOC = ['Request for Proposals 77-A: AEM Forms Implementation', 'The Division is replacing its forms software with AEM Forms. AEM Forms will be hosted by Adobe.',
  '3.1 Describe how you would create a form data model for our data sources in AEM Forms.', '3.2 Describe how you would convert 300 existing forms to adaptive forms in AEM Forms.',
  '3.3 Describe how you would train our staff on AEM Forms.', '4.1 Provide three references from similar projects.', '4.2 Describe your project management approach.'].join('\n\n');
const A = `
.rfp-ai-row{flex-direction:column;justify-content:center;align-items:center;gap:10px;margin:22px 0 22px}
.rfp-ai-row #rfp-ai{width:190px;height:190px;min-height:0;border-radius:50%;padding:0 22px;font-size:21px;font-weight:700;line-height:1.15;color:#fff;border:0;
  background:radial-gradient(circle at 50% 28%,#FF4A3D 0%,#EB1000 46%,#C40000 100%);
  box-shadow:0 0 0 9px #E9E9E9,0 0 0 11px #BDBDBD,0 12px 0 11px #9A9A9A,0 22px 22px 6px rgba(0,0,0,.28),inset 0 -10px 18px rgba(0,0,0,.22),inset 0 10px 16px rgba(255,255,255,.28);cursor:pointer}
.mock-cap{font-size:15px;font-weight:600;color:#1C1C1C;margin-top:26px}`;
const B = `
.rfp-ai-row{justify-content:center;margin:22px 0 22px}
.rfp-ai-row #rfp-ai{font-size:21px;font-weight:700;padding:18px 56px;border-radius:40px;min-height:64px;box-shadow:0 6px 0 #9E0B00,0 12px 18px rgba(0,0,0,.2)}`;
(async () => {
  const server = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, {'Content-Type': /\.mjs$|\.js$/.test(f) ? 'text/javascript' : 'text/html'}); r.end(d); } }); }).listen(0);
  const b = await chromium.launch();
  for (const [name, css, cap] of [['option_a_round', A, true], ['option_b_wide', B, false]]) {
    const p = await b.newPage({viewport: {width: 1280, height: 900}, deviceScaleFactor: 2});
    await p.goto('http://127.0.0.1:' + server.address().port + '/index.html#rfi'); await p.waitForTimeout(500);
    await p.evaluate(t => RFPBuilder.load('RFP 2123-778 AEM Implementation.pdf', t), DOC); await p.waitForTimeout(300);
    await p.addStyleTag({content: css});
    await p.evaluate(cap => { const back = document.querySelector('.rfi-back'), so = document.getElementById('rfp-clear'), wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;gap:10px;align-items:center'; back.parentNode.insertBefore(wrap, back); so.style.cssText = 'margin:0;min-height:0'; so.className = back.className; wrap.appendChild(so); wrap.appendChild(back);
      if (cap) { const c = document.createElement('div'); c.className = 'mock-cap'; c.textContent = 'Reads the RFI and drafts your answers'; document.querySelector('.rfp-ai-row').appendChild(c); } }, cap);
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.screenshot({path: path.join(__dirname, name + '.png'), clip: {x: 0, y: 0, width: 1280, height: 880}});
    await p.close(); }
  await b.close(); server.close();
})().catch(e => { console.error(e); process.exit(1); });
