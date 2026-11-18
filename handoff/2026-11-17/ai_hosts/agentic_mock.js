// Pictures for Adam (Nov 18): one complete agentic play, built around find, keep and grow customers.
// a. An explainer: Adobe's agentic AI between the AI buyers use and the AI the client's team uses.
// b. The first page: an "Adobe agentic AI" card like the GenStudio one, with three outcome areas and the whole play.
// c. The whole play's canvas: seven agentic products, the CDN and the three assistants, with the lines the tool already has.
// Painted into the built page's memory for the picture only. Nothing in the repository changes.
const BASE = '/tmp/claude-0/-home-user-sow-generator/e88698e0-9171-589a-9f89-0f508776c935/scratchpad/ai_hosts';
const OUT = BASE + '/round2/pictures';
const { chromium } = require('playwright');
const fs = require('fs');
const D = JSON.parse(fs.readFileSync('/home/user/sow-generator/handoff/2026-11-17/ai_hosts/proposal_data_v2.json', 'utf8'));
const only = process.argv[2] || 'all';
const M = 'Mockup: proposed, not built. ';
const AREAS = [
  { label: 'Find new customers', line: 'Reach new buyers in ad and media channels, and show up when they ask AI.', products: ['rtcdp', 'bv', 'cw', 'cja'] },
  { label: 'Keep customers', line: 'Journeys that keep customers coming back, and answers when they ask.', products: ['ajo', 'bc', 'cw', 'cja'] },
  { label: 'Grow share of wallet', line: 'The right offer for each customer on the site, and journeys that cross-sell.', products: ['target', 'ajo', 'cw', 'cja'] },
];
const WHOLE = ['rtcdp', 'ajo', 'target', 'cja', 'cw', 'bv', 'bc', 'brandintel'];

async function open(b, w, h) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('pageerror', e => console.log('PAGE ERROR', e.message));
  await p.goto('file:///home/user/sow-generator/canvas/index.html');
  await p.waitForFunction(() => window.READY === true);
  await p.evaluate((D) => {
    I.chat = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5h16v10.5H11l-4.5 3.8V16H4z"/><path d="M8 9.5h8M8 12.5h5"/></svg>';
    for (const s of D.outside_systems) { const o = { id: s.id, name: s.name, title: s.title, icon: 'chat', outside: true, systems: s.systems, rec: '', lines: [], more: [] }; CAT.products.push(o); P[s.id] = o; }
    for (const c of D.connections) { const o = { id: c.id, a: c.a, b: c.b, lines: [], more: [], how: c.how, source: c.source, gain: c.gain, flows: c.flows, kind: 'outside', label: c.label, availability: '', prereqs: c.prereqs, no_services: true }; C.push(o); CBY[o.id] = o; }
    const cu = CAT.plays.find(x => x.custom); cu.outside = [...new Set([...(cu.outside || []), 'copilot', 'chatgpt', 'claude'])]; cu.opos = Object.assign({}, cu.opos || {}, { copilot: [3, -1], chatgpt: [4, 0], claude: [3, 1] });
  }, D);
  return p;
}

(async () => {
  const b = await chromium.launch();
  if (only === 'all' || only === 'a') {   // a. the explainer
    const ctx = await b.newContext({ viewport: { width: 1500, height: 900 }, deviceScaleFactor: 2 });
    const p = await ctx.newPage();
    const box = (t, s, red) => `<div class="bx${red ? ' red' : ''}"><b>${t}</b>${s ? `<span>${s}</span>` : ''}</div>`;
    await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
      body{margin:0;background:#fff;font-family:'Source Sans 3','Segoe UI',Arial,sans-serif;color:#1c1c1c;padding:30px 36px}
      h1{font-size:30px;margin:0 0 4px}.sub{font-size:17px;color:#4a4a4a;margin:0 0 20px}
      .band{border:2px dashed #1c1c1c;border-radius:14px;padding:12px 18px;display:flex;gap:14px;align-items:center;flex-wrap:wrap;font-size:16px;margin:0 0 14px}
      .band .k{font-weight:800;letter-spacing:.06em;text-transform:uppercase;font-size:13px;color:#6b6b6b;min-width:210px}
      .chip{border:1.5px solid #1c1c1c;border-radius:20px;padding:4px 12px;font-weight:600;background:#fff}
      .cols{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:0 0 14px}
      .col{border-radius:16px;border:2px solid #1c1c1c;border-top:7px solid #EB1000;padding:14px 16px 16px}
      .col h2{margin:0 0 4px;font-size:22px}.col p{margin:0 0 12px;font-size:15.5px;color:#3d3d3d;line-height:1.35}
      .bx{border:1.5px solid #1c1c1c;border-radius:10px;padding:8px 12px;margin:0 0 8px;background:#fff}.bx b{display:block;font-size:16px}.bx span{font-size:14px;color:#4a4a4a}
      .bx.red{border-color:#EB1000}
      .agent{border:2px solid #EB1000;border-radius:14px;padding:12px 18px;font-size:16px;margin:0 0 14px}
      .meas{background:#1c1c1c;color:#fff;border-radius:14px;padding:12px 18px;font-size:16px;margin:0 0 14px}
      .ask{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;width:100%;margin-top:8px}.ask div{background:#f4f4f4;border-radius:10px;padding:8px 10px;font-size:14.5px;line-height:1.35}.ask i{font-style:normal;color:#6b6b6b;font-size:13px;display:block;margin-top:3px}
      .mock{display:inline-block;background:#1d1d1d;color:#fff;font:600 13px Arial,sans-serif;padding:6px 10px;border-radius:6px}
    </style></head><body>
      <h1>Adobe agentic AI: find, keep and grow customers</h1>
      <p class="sub">The three things every client wants from AI. Adobe's products do each one, Adobe's agents do the work, and it all works with the AI outside Adobe.</p>
      <div class="band"><span class="k">Where buyers are</span><span class="chip">Ad and media channels</span><span class="chip">ChatGPT</span><span class="chip">Gemini</span><span class="chip">Perplexity</span></div>
      <div class="cols">
        <div class="col"><h2>Find new customers</h2><p>Reach new buyers in ad and media channels, and show up when they ask AI.</p>${box('Real-Time CDP', 'Audiences sent to ad and media channels', true)}${box('Brand Visibility', 'Shows up when buyers ask ChatGPT, Gemini or Perplexity')}</div>
        <div class="col"><h2>Keep customers</h2><p>Journeys that keep customers coming back, and answers when they ask.</p>${box('Journey Optimizer', 'Journeys that keep customers', true)}${box('Brand Concierge', 'Answers customers on the site, day and night')}</div>
        <div class="col"><h2>Grow share of wallet</h2><p>The right offer for each customer, and journeys that cross-sell.</p>${box('Target', 'The right offer for each customer on the site', true)}${box('Journey Optimizer', 'Cross-sell and upsell journeys')}</div>
      </div>
      <div class="agent"><b>Adobe's agents do the work in all three:</b> Coworker builds the audiences, journeys and tests, and Brand Intelligence keeps everything on brand.</div>
      <div class="meas"><b>Customer Journey Analytics feeds everything</b> with all the data, and shows what each outcome brought in.</div>
      <div class="band"><span class="k">Where your client's team works</span><span class="chip">Microsoft Copilot</span><span class="chip">ChatGPT</span><span class="chip">Claude</span><span style="color:#4a4a4a">The AI connectors bring Adobe into the assistant the team already uses. The team asks; Adobe answers:</span>
        <div class="ask"><div>"Which audiences didn't reach the ad channels last night?"<i>Real-Time CDP, in ChatGPT or Claude</i></div><div>"Which journeys are live for customers who stopped buying?"<i>Journey Optimizer, in Claude</i></div><div>"How is the new offer test doing, and which version is winning?"<i>Target, in ChatGPT or Claude</i></div><div>"What did visits from AI answers bring in last month?"<i>Customer Journey Analytics, in all three</i></div></div></div>
      <span class="mock">${M}An explainer for partners, built on Adam's mapping (Nov 18). Each example question is something Adobe's connector for that product does.</span>
    </body></html>`);
    await p.waitForTimeout(300);
    const h = await p.evaluate(() => document.body.scrollHeight);
    await p.screenshot({ path: OUT + '/e1_agentic_explainer.png', clip: { x: 0, y: 0, width: 1500, height: h } });
    await ctx.close();
    console.log('a done');
  }
  if (only === 'all' || only === 'b') {   // b. the first page card
    const p = await open(b, 1500, 2600);
    await p.evaluate((AREAS) => {
      const fam = document.querySelector('#picker-list .pc-fam'); const famHead = fam && fam.previousElementSibling;
      const sim = (ids, r) => bpSim({ play: CUSTOM.id, prods: ids, out: [], off: [] }, r).yr;
      const fee = ids => money(sim(ids, 100)) + ' to ' + money(sim(ids, 300)) + ' at ' + money(100) + ' to ' + money(300) + ' an hour';
      const whole = ['rtcdp', 'ajo', 'target', 'cja', 'cw', 'bv', 'bc', 'brandintel'];
      const html = `<div class="sh" id="mock-head">Adobe agentic AI: find, keep and grow customers</div><div class="pc-fam" id="mock-fam"><b>Adobe agentic AI</b><span class="s">Adobe's agents working with the AI your client's buyers and team already use. Pick the outcome your client wants, or open the whole play.</span><div class="fam-areas">` +
        AREAS.map(a => `<button class="fam-area"><b>${esc(a.label)}</b><span class="s" style="display:block;margin:2px 0 6px">${esc(a.line)}</span><span class="chips">${a.products.map(id => `<span>${esc(P[id].name)}</span>`).join('')}</span><span class="fam-fee">${fee(a.products)}</span></button>`).join('') +
        `</div><button class="fam-all">Or open the complete agentic play: Real-Time CDP, Journey Optimizer, Target, Customer Journey Analytics, Coworker, Brand Visibility, Brand Concierge and Brand Intelligence, with Microsoft Copilot, ChatGPT and Claude</button></div>`;
      (famHead || document.getElementById('picker-list').lastElementChild).insertAdjacentHTML('beforebegin', html);
    }, AREAS);
    await p.addStyleTag({ content: '#mock-fam{outline:3px solid #EB1000;outline-offset:6px}' });
    await p.waitForTimeout(400);
    const r = await p.evaluate(() => { const a = document.getElementById('mock-head').getBoundingClientRect(), f = document.getElementById('mock-fam').getBoundingClientRect(); return { y: Math.floor(a.top + scrollY - 20), h: Math.ceil(f.bottom - a.top + 90) }; });
    await p.evaluate(([y, txt]) => { const d = document.createElement('div'); d.textContent = txt; d.style.cssText = `position:absolute;left:40px;top:${y}px;z-index:99999;background:#1d1d1d;color:#fff;font:600 14px Arial,sans-serif;padding:7px 12px;border-radius:6px`; document.body.appendChild(d); }, [r.y + r.h - 50, M + 'First page: one new card, built like the GenStudio card. The plays you have stay as they are.']);
    await p.screenshot({ path: OUT + '/e2_first_page_agentic_card.png', fullPage: true, clip: { x: 0, y: r.y, width: 1500, height: r.h } });
    console.log('b done');
  }
  if (only === 'all' || only === 'c') {   // c. the whole play's canvas
    const p = await open(b, 1900, 1400);
    await p.evaluate((ids) => { const btn = document.createElement('button'); btn.dataset.start = ids.join(','); document.getElementById('picker-list').appendChild(btn); btn.click(); }, WHOLE);
    await p.waitForTimeout(1200);
    for (const id of ['cdn', 'copilot', 'chatgpt', 'claude']) { await p.evaluate((id) => { try { addOutside(id); } catch (e) { console.log(e.message); } }, id); await p.waitForTimeout(300); }
    await p.waitForTimeout(800);
    await p.evaluate(() => { const o = [...document.querySelectorAll('button, [role=button], label, div')].find(x => /^\s*Option B\s*Show all connections/i.test(x.textContent) && x.querySelectorAll('*').length < 12); if (o) o.click(); });
    await p.waitForTimeout(900);
    await p.evaluate(() => { const l = document.getElementById('play-label'); if (l) l.textContent = 'Adobe agentic AI: the complete play'; });
    const h = await p.evaluate(() => { const n = [...document.querySelectorAll('.node')].map(x => x.getBoundingClientRect().bottom + scrollY); return Math.ceil(Math.max(...n) + 110); });
    await p.evaluate(([y, txt]) => { const d = document.createElement('div'); d.textContent = txt; d.style.cssText = `position:absolute;left:24px;top:${y}px;z-index:99999;background:#1d1d1d;color:#fff;font:600 14px Arial,sans-serif;padding:7px 12px;border-radius:6px;max-width:1700px`; document.body.appendChild(d); }, [h - 70, M + 'The complete agentic play: Brand Visibility, Sites Optimizer, Edge Delivery Services, Brand Concierge, Brand Intelligence, Coworker and Customer Journey Analytics, with the CDN and the three AI assistants. Every line is one the tool already documents.']);
    await p.screenshot({ path: OUT + '/e3_complete_agentic_play_canvas.png', fullPage: true, clip: { x: 0, y: 0, width: 1900, height: h } });
    console.log('c done', h);
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
