// Mockup pictures for "ask the client's goal once, then a ranked Add product list" on a READY-MADE play.
// Adam, Nov 17 (second session): the ranked list belongs on the ready-made plays; Create your own play stays freeform.
// Opens the built canvas on the Brand Visibility + Customer Journey Analytics play, shows the hidden Add product
// button and paints mock content into its menu for the picture only. Every number is a made-up SAMPLE.
// Nothing in the repository changes. Run: node propensity_mock.js <output folder>
const R = require('path').resolve(__dirname, '..', '..', '..', '..');
const out = process.argv[2];
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = R + '/site';
const T = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml' };
const srv = http.createServer((q, s) => {
  let u = decodeURIComponent(q.url.split('?')[0].split('#')[0]);
  if (u.endsWith('/')) u += 'index.html';
  const f = path.join(SITE, u);
  if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end(); }
  s.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'text/plain' });
  fs.createReadStream(f).pipe(s);
});

const CSS = `
#add-menu.pp{max-height:none;width:590px;display:block}
.pp-sample{display:inline-block;background:#FFF2B3;border:1px solid #C9A400;color:#5c4a00;font-size:11px;font-weight:700;letter-spacing:.08em;padding:2px 7px;border-radius:5px;text-transform:uppercase;white-space:nowrap}
.pp-banner{margin:2px 18px 10px;padding:8px 12px;background:#FFF9DB;border:1px solid #C9A400;border-radius:10px;font-size:13.5px;line-height:1.6;color:#3d3200}
.pp-goal{margin:0 18px 10px;padding:9px 12px;border:1.5px solid #1C1C1C;border-radius:12px;font-size:14.5px;line-height:1.35;display:flex;gap:10px;align-items:baseline;justify-content:space-between}
.pp-goal b{font-weight:700}
.pp-goal u{color:#EB1000;font-weight:600;text-decoration:underline;white-space:nowrap}
.pp-def{margin:0 18px 10px;font-size:13.5px;line-height:1.4;color:#4a4a4a}
.pp-grp{padding:10px 18px 2px;font-size:11.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6b6b6b;border-top:1px solid #D9D9D9}
.pp-row{display:grid;grid-template-columns:20px 1fr auto;column-gap:10px;row-gap:1px;padding:9px 18px}
.pp-rank{color:#6b6b6b;font-weight:600;font-size:15px;padding-top:2px}
.pp-name{font-size:16.5px;font-weight:600;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.pp-next{background:#EB1000;color:#fff;font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:2px 7px;border-radius:20px}
.pp-num{font-size:26px;font-weight:700;font-variant-numeric:tabular-nums;grid-row:span 2;align-self:center;letter-spacing:-.01em}
.pp-why{grid-column:2;font-size:13.5px;color:#4a4a4a;line-height:1.38}
.pp-why i{font-style:normal;color:#6b6b6b}
.pp-fold{padding:11px 18px;border-top:1px solid #D9D9D9;font-weight:600;font-size:15px;display:flex;justify-content:space-between}
.pp-fold span{font-weight:400;color:#4a4a4a}
.pp-chips{display:flex;flex-wrap:wrap;gap:8px;padding:2px 18px 12px}
.pp-chip{border:1.5px solid #1C1C1C;border-radius:22px;padding:6px 13px;font-size:14.5px;line-height:1.25;background:#fff}
.pp-chip.own{border-color:#EB1000;border-width:2px;font-weight:600}
.pp-chip.all{border-color:#EB1000;color:#EB1000;font-weight:600}
.pp-sub{padding:4px 18px 6px;font-size:11.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6b6b6b}
.pp-or{padding:0 18px 12px;font-size:14.5px;color:#4a4a4a}
.pp-or div{margin-top:6px;border:1.5px solid #1C1C1C;border-radius:10px;padding:9px 12px;color:#8a8a8a}
.pp-left{margin:0;padding:11px 18px 6px;border-top:1px solid #D9D9D9;font-size:13.5px;line-height:1.4;color:#4a4a4a}
`;

const GOAL = 'My client can’t tie AI traffic to revenue';
const mock = extra => '<div class="pp-banner"><span class="pp-sample">Mockup</span> Ready-made plays have no Add product button today, and the ranked list is not built.' + (extra || '') + '</div>';

// 1. The one-time question. The play's own problem comes first, then the other starter problems of the first page.
const question = `
<div class="hd"><div class="k">What is your client trying to accomplish?</div>
<p>You answer once for this canvas. Every suggestion after this follows it.</p></div>
${mock()}
<div class="pp-sub">This play’s problem</div>
<div class="pp-chips"><span class="pp-chip own">${GOAL}</span></div>
<div class="pp-sub">Other problems</div>
<div class="pp-chips">
<span class="pp-chip">My client is missing from AI answers</span>
<span class="pp-chip">My client’s website is slow</span>
<span class="pp-chip">My client’s products are wrong in AI shopping answers</span>
<span class="pp-chip">My client’s banking or insurance customers call about accounts, policies or rates</span>
<span class="pp-chip">My client’s team spends too long pulling reports</span>
<span class="pp-chip all">See all 23 problems</span>
</div>
<div class="pp-or">Or describe it in your own words<div>For example: leaders want a monthly readout on AI traffic</div></div>`;

const row = (n, name, tag, why, num, count, next) => `
<div class="pp-row"><span class="pp-rank">${n}</span>
<span class="pp-name">${name}${next ? '<span class="pp-next">Next</span>' : ''}</span>
<span class="pp-num">${num}</span>
<span class="pp-why"><b>${tag}.</b> ${why}<br><i>${count}</i> \u00b7 <u>How this number was worked out</u></span></div>`;

const head = `<div class="hd"><div class="k">Add product</div><p>Ranked for your client’s goal. Brand Visibility and Customer Journey Analytics solve it, and both are on your canvas.</p></div>
<div class="pp-goal"><span><b>Goal:</b> ${GOAL}</span><u>Change</u></div>`;

// The reasons use the canvas legend's own words: Native integration, Shared platform, Partner workflow.
const WHY = {
  cw: 'My client’s leaders want readouts on request. This needs CJA B2C edition.',
  commerce: 'Native integration with Brand Visibility. Shared platform with Customer Journey Analytics.',
  aemsites: 'Native integration with Brand Visibility (partner workflow with Edge Delivery Services). Shared platform with Customer Journey Analytics.',
  ajo: 'Native integration with Customer Journey Analytics.',
  target: 'Native integration with Customer Journey Analytics.',
};
// For this goal and canvas the tool's files give 1 product that builds on the goal, 10 rows that connect to it
// (AEM Sites' two deliveries are one row) and 20 products not tied to it. Adobe Analytics is one of the 10 and
// is left out by Adam's rule, so 9 remain: 4 shown and 5 folded.
const folds = `<div class="pp-fold">More that connect to the goal <span>5 products</span></div>
<div class="pp-fold">Not tied to this goal <span>20 products</span></div>
<p class="pp-left"><b>Left out: Adobe Analytics.</b> Customer Journey Analytics is on your canvas, so Adobe Analytics is not suggested.</p>`;

const def = '<p class="pp-def">The goal sets the order. The number is the share of similar customers who also own the product. It is for planning, not a forecast. Fewer than 30 customers own both products on this canvas, so these numbers set Brand Visibility aside and use the 673 customers who own Customer Journey Analytics.</p>';

// 2. The list. It ships only once the customer data is in (Adam, Nov 17), so every row has its number.
// The goal still sets the order; the number sorts products under the same heading. All numbers are SAMPLE.
const withData = head + mock(' <span class="pp-sample">Sample numbers</span> Made up for this picture. Real numbers come from the customer data, as summary counts only.') + def + `
<div class="pp-grp">Builds on the goal</div>
${row(1, 'Coworker', 'Builds on the goal', WHY.cw, '.06', 'Sample: 40 of 673', true)}
<div class="pp-grp">Connects to the goal</div>
${row(2, 'AEM Sites', 'Connects to the goal', WHY.aemsites, '.52', 'Sample: 352 of 673')}
${row(3, 'Target', 'Connects to the goal', WHY.target, '.45', 'Sample: 305 of 673')}
${row(4, 'Journey Optimizer', 'Connects to the goal', WHY.ajo, '.31', 'Sample: 210 of 673')}
${row(5, 'Adobe Commerce', 'Connects to the goal', WHY.commerce, '.12', 'Sample: 81 of 673')}
` + folds;

(async () => {
  await new Promise(res => srv.listen(0, res));
  const b = await chromium.launch();
  async function shot(name, html) {
    const ctx = await b.newContext({ viewport: { width: 1500, height: 1400 }, deviceScaleFactor: 2 });
    const p = await ctx.newPage();
    await p.goto('http://localhost:' + srv.address().port + '/');
    await p.waitForTimeout(500);
    await p.click('#picker [data-play="cja"]');
    await p.waitForTimeout(700);
    await p.addStyleTag({ content: CSS });
    const label = await p.evaluate(h => {
      const w = document.getElementById('addwrap');
      w.hidden = false;                       // today the button is hidden on ready-made plays
      const m = document.getElementById('add-menu');
      m.hidden = false; m.classList.add('pp'); m.innerHTML = h;
      return document.getElementById('play-label').textContent;
    }, html);
    await p.waitForTimeout(250);
    const box = await p.evaluate(() => { const r = document.getElementById('add-menu').getBoundingClientRect(); return Math.round(r.bottom); });
    await p.screenshot({ path: out + '/' + name + '.png', clip: { x: 0, y: 0, width: 1500, height: Math.min(1400, Math.max(box + 30, 560)) } });
    if (name.startsWith('p3')) {   // the two pictures the brief's tab shows: the list alone, and a phone-width one
      await p.addStyleTag({ content: '#add-menu.pp{box-shadow:0 0 0 40px #fff}' });
      await (await p.$('#add-menu')).screenshot({ path: out + '/p3_list_only.png' });
      await p.addStyleTag({ content: '#add-menu.pp{width:361px}.pp-num{font-size:22px}' });
      await p.waitForTimeout(200);
      await (await p.$('#add-menu')).screenshot({ path: out + '/p3_list_phone.png' });
    }
    console.log(name, '| play:', label, '| menu bottom', box);
    await ctx.close();
  }
  await shot('p1_play_goal_question', question);
  await shot('p3_play_ranked_with_sample_numbers', withData);
  await b.close();
  srv.close();
})().catch(e => { console.error(e); process.exit(1); });
