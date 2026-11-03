// Mockup (Nov 3 2026, partner voice Nov 3 pm): "Start from your client's problem" on the play picker, phase 1 (no AI behind it; it matches a
// curated list of problems to sourced products, connections and services). Frame 1: the question box with suggested
// problems. Frame 2: a problem asked and the answer, with follow-up chips and Build this. Not built.
//   node sow/mockups/nov3_problem/mock_problem.js
const {chromium} = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, '..', '..', 'site'), OUT = __dirname;
const server = http.createServer((req, res) => { let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (u.endsWith('/')) u += 'index.html'; const f = path.join(SITE, u);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; } res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); fs.createReadStream(f).pipe(res); });
const ICON_CHAT = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EB1000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/></svg>';
const ICON_SEND = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const CSS = `
#bp{background:#fff;border:1.5px solid #1C1C1C;border-top:4px solid #EB1000;border-radius:8px;padding:22px 24px;margin:0 0 26px;max-width:1080px}
#bp .t{display:flex;gap:10px;align-items:center;font-weight:700;font-size:20px;color:#1C1C1C}
#bp .s{margin:6px 0 14px;font-size:15px;color:#3A3A3A}
#bp .box{display:flex;gap:10px;align-items:center;border:1.5px solid #1C1C1C;border-radius:8px;padding:10px 10px 10px 14px;font-size:16px;color:#3A3A3A;background:#fff}
#bp .box span{flex:1}#bp .go{background:#EB1000;border-radius:6px;width:38px;height:38px;display:flex;align-items:center;justify-content:center}
#bp .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
#bp .chip{border:1.5px solid #1C1C1C;border-radius:18px;padding:7px 13px;font-size:14px;font-weight:600;color:#1C1C1C;background:#fff}
#bp .chip.red{border-color:#EB1000;color:#C40000}
#bp .ask{display:flex;justify-content:flex-end;margin:4px 0 14px}#bp .ask div{background:#1C1C1C;color:#fff;border-radius:14px 14px 4px 14px;padding:11px 15px;font-size:15px;max-width:640px}
#bp .ans{border-left:4px solid #EB1000;padding:4px 0 2px 16px}
#bp .lbl{font-size:12px;font-weight:700;letter-spacing:.12em;color:#C40000;margin:12px 0 6px}
#bp .heard{font-size:15px;color:#1C1C1C}
#bp .prods{display:flex;align-items:center;gap:0;margin:6px 0 4px}
#bp .p{border:1.5px solid #1C1C1C;border-top:5px solid #EB1000;border-radius:6px;padding:9px 14px;font-weight:700;font-size:15px;background:#fff}
#bp .ln{width:70px;border-top:2px dotted #1C1C1C;position:relative}#bp .ln b{position:absolute;top:-12px;left:24px;width:22px;height:22px;border:2px solid #EB1000;border-radius:50%;background:#fff;color:#EB1000;font:700 13px/18px sans-serif;text-align:center}
#bp .why{font-size:15px;color:#1C1C1C;margin:2px 0;line-height:1.5}#bp ul{margin:2px 0 0 18px;padding:0;font-size:15px;line-height:1.6;color:#1C1C1C}
#bp .row{display:flex;gap:12px;align-items:center;margin-top:16px;flex-wrap:wrap}
#bp .build{background:#EB1000;color:#fff;font-weight:700;border-radius:6px;padding:11px 18px;font-size:15px}
#bp .alt{border:1.5px solid #1C1C1C;border-radius:6px;padding:10px 16px;font-weight:600;font-size:15px}
#bp .note{font-size:13.5px;color:#3A3A3A;margin-top:10px}
#picker .in h2{margin-top:0}`;
const HEAD = `<div class="t">${ICON_CHAT}Not sure which play? Start from your client's problem</div>
<div class="s">Describe what your client is trying to fix. You get the products, how they connect and the services you can offer, from Adobe's documentation.</div>`;
const FRAME1 = `<div id="bp">${HEAD}<div class="box"><span>e.g. My client doesn't show up when people ask ChatGPT about their category</span><div class="go">${ICON_SEND}</div></div>
<div class="chips"><span class="chip">My client is missing from AI answers</span><span class="chip">My client can't tie AI traffic to revenue</span><span class="chip">My client's site is slow and losing search traffic</span><span class="chip">My client's products are wrong in AI shopping answers</span><span class="chip">My client's customers call instead of finding answers</span><span class="chip">My client's team spends too long pulling reports</span><span class="chip red">See all problems</span></div></div>`;
const FRAME2 = `<div id="bp">${HEAD}
<div class="ask"><div>My client doesn't show up when people ask ChatGPT about their category, and they can't tell if AI traffic turns into sales.</div></div>
<div class="ans"><div class="heard"><b>Two problems here:</b> your client's visibility in AI answers, and proving what AI-referred visitors are worth. Here's the setup you can offer for that.</div>
<div class="lbl">RECOMMENDED: BRAND VISIBILITY + CUSTOMER JOURNEY ANALYTICS</div>
<div class="prods"><div class="p">Brand Visibility</div><div class="ln"><b>i</b></div><div class="p">Customer Journey Analytics</div></div>
<div class="lbl">WHY THEY WORK TOGETHER</div>
<ul><li>Brand Visibility shows where AI answers mention or skip your client's brand, and serves AI assistants a fuller page.</li><li>Customer Journey Analytics follows AI-referred visitors to conversions, so the work is measured in revenue, not mentions.</li></ul>
<div class="lbl">WHAT YOU DELIVER</div>
<div class="why">6 starting services: setup and baseline, prompt strategy, the CJA connection, AI-traffic audiences, monthly monitoring and content improvements. 216 one-time hours + 104 a month, <b>$219,600</b> at $150 an hour over 12 months.</div>
<div class="lbl">REFINE</div>
<div class="chips" style="margin-top:4px"><span class="chip">My client closes deals in a CRM</span><span class="chip">My client's revenue data sits in Snowflake, BigQuery or Databricks</span><span class="chip">My client's offline results arrive as file drops</span><span class="chip">My client's leaders want readouts on request</span></div>
<div class="row"><span class="build">Build this</span><span class="alt">Show another setup</span></div>
<div class="note">Matched from a list of common client problems, using only products and connections Adobe documents. Edit anything on the next screen.</div></div></div>`;
(async () => {
  await new Promise(r => server.listen(0, r)); const BASE = `http://localhost:${server.address().port}/`; const b = await chromium.launch();
  for (const [name, html, h] of [['problem_ask.png', FRAME1, 1100], ['problem_answer.png', FRAME2, 1500]]) {
    const p = await (await b.newContext({viewport: {width: 1440, height: h}, deviceScaleFactor: 2})).newPage();
    await p.goto(BASE); await p.waitForTimeout(500);
    await p.evaluate(([css, html]) => { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); const inr = document.querySelector('#picker .in'); inr.insertAdjacentHTML('afterbegin', html); }, [CSS, html]);
    await p.waitForTimeout(300); await p.screenshot({path: path.join(OUT, name)}); await p.context().close(); }
  await b.close(); server.close();
})();
