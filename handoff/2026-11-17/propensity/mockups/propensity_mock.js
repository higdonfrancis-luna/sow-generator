// Mockup pictures for the "client goal first, then ranked Add product" idea.
// Opens the built canvas, then paints mock content into the Add product menu for the picture only.
// Every number is a made-up SAMPLE. Nothing in the repository changes.
const R = require('path').resolve(__dirname, '..', '..', '..');
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
#add-menu.pp{max-height:none;width:560px}
.pp-sample{display:inline-block;background:#FFF2B3;border:1px solid #C9A400;color:#5c4a00;font-size:11px;font-weight:700;letter-spacing:.08em;padding:2px 7px;border-radius:5px;text-transform:uppercase;white-space:nowrap}
.pp-banner{margin:2px 18px 10px;padding:8px 12px;background:#FFF9DB;border:1px solid #C9A400;border-radius:10px;font-size:13.5px;line-height:1.35;color:#3d3200}
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
.pp-chip.all{border-color:#EB1000;color:#EB1000;font-weight:600}
.pp-or{padding:0 18px 12px;font-size:14.5px;color:#4a4a4a}
.pp-or div{margin-top:6px;border:1.5px solid #1C1C1C;border-radius:10px;padding:9px 12px;color:#8a8a8a}
`;

const GOAL = 'My client can’t tie AI traffic to revenue';
const question = `
<div class="hd"><div class="k">What is your client trying to accomplish?</div>
<p>You answer once for this canvas. Every suggestion after this follows it.</p></div>
<div class="pp-chips">
<span class="pp-chip">My client is missing from AI answers</span>
<span class="pp-chip">${GOAL}</span>
<span class="pp-chip">My client’s website is slow</span>
<span class="pp-chip">My client’s products are wrong in AI shopping answers</span>
<span class="pp-chip">My client’s banking or insurance customers call about accounts, policies or rates</span>
<span class="pp-chip">My client’s team spends too long pulling reports</span>
<span class="pp-chip all">See all 23 problems</span>
</div>
<div class="pp-or">Or describe it in your own words<div>For example: we can’t see which AI answers send buyers to us</div></div>`;

const row = (n, name, tag, why, num, count, next) => `
<div class="pp-row"><span class="pp-rank">${n}</span>
<span class="pp-name">${name}${next ? '<span class="pp-next">Next</span>' : ''}</span>
${num ? `<span class="pp-num">${num}</span>` : '<span></span>'}
<span class="pp-why"><b>${tag}.</b> ${why}${count ? `<br><i>${count}</i>` : ''}</span></div>`;

const head = (title, sub) => `<div class="hd"><div class="k">${title}</div><p>${sub}</p></div>
<div class="pp-goal"><span><b>Goal:</b> ${GOAL}</span><u>Change</u></div>`;

// Day one: ranked only by what the tool already knows (the goal's products, documented connections). No numbers.
const dayOne = head('Add product', 'Ranked for your client’s goal. On your canvas: Customer Journey Analytics.') + `
<div class="pp-grp">Solves the goal</div>
${row(1, 'Brand Visibility', 'Solves the goal', 'With Customer Journey Analytics it ties AI traffic to revenue.', '', '', true)}
<div class="pp-grp">Builds on the goal</div>
${row(2, 'Coworker', 'Builds on the goal', 'My client’s leaders want readouts on request.')}
<div class="pp-grp">Connects to the goal</div>
${row(3, 'AEM Sites', 'Connects to the goal', 'Native connection to Brand Visibility. Platform connection to Customer Journey Analytics.')}
${row(4, 'Adobe Commerce', 'Connects to the goal', 'Native connection to Brand Visibility. Platform connection to Customer Journey Analytics.')}
${row(5, 'Journey Optimizer', 'Connects to the goal', 'Native connection to Customer Journey Analytics.')}
${row(6, 'Target', 'Connects to the goal', 'Native connection to Customer Journey Analytics.')}
<div class="pp-fold">More that connect to the goal <span>7 products</span></div>
<div class="pp-fold">Not tied to this goal <span>19 products</span></div>`;

const banner = '<div class="pp-banner"><span class="pp-sample">Sample numbers</span> Made up for this mockup. Real numbers come from the customer data, as summary counts only.</div>';
const def = '<p class="pp-def">The number is the share of customers who own everything on your canvas and also own the product. It is for planning, not a forecast.</p>';

// With data: the same order of groups, now with a propensity number and the customer count. All numbers are SAMPLE.
const withData = head('Add product', 'Ranked for your client’s goal. On your canvas: Customer Journey Analytics.') + banner + def + `
<div class="pp-grp">Solves the goal</div>
${row(1, 'Brand Visibility', 'Solves the goal', 'With Customer Journey Analytics it ties AI traffic to revenue.', '.91', 'Sample: 612 of the 673 customers who own Customer Journey Analytics', true)}
<div class="pp-grp">Builds on the goal</div>
${row(2, 'Coworker', 'Builds on the goal', 'My client’s leaders want readouts on request.', '.74', 'Sample: 498 of 673')}
<div class="pp-grp">Connects to the goal</div>
${row(3, 'AEM Sites', 'Connects to the goal', 'Native connection to Brand Visibility.', '.68', 'Sample: 458 of 673')}
${row(4, 'Journey Optimizer', 'Connects to the goal', 'Native connection to Customer Journey Analytics.', '.55', 'Sample: 370 of 673')}
${row(5, 'Target', 'Connects to the goal', 'Native connection to Customer Journey Analytics.', '.47', 'Sample: 316 of 673')}
${row(6, 'Adobe Commerce', 'Connects to the goal', 'Native connection to Brand Visibility.', '.22', 'Sample: 148 of 673')}
<div class="pp-fold">More that connect to the goal <span>7 products</span></div>
<div class="pp-fold">Not tied to this goal <span>19 products</span></div>`;

// After Brand Visibility goes on the canvas: the list re-ranks, still for the same goal. All numbers are SAMPLE.
const reRanked = head('Add product', 'Ranked for your client’s goal. On your canvas: Customer Journey Analytics, Brand Visibility.') + banner + `
<div class="pp-grp">Builds on the goal</div>
${row(1, 'Coworker', 'Builds on the goal', 'My client’s leaders want readouts on request.', '.81', 'Sample: 496 of the 612 customers who own Customer Journey Analytics and Brand Visibility', true)}
<div class="pp-grp">Connects to the goal</div>
${row(2, 'AEM Sites', 'Connects to the goal', 'Native connection to Brand Visibility.', '.72', 'Sample: 441 of 612')}
${row(3, 'Journey Optimizer', 'Connects to the goal', 'Native connection to Customer Journey Analytics.', '.58', 'Sample: 355 of 612')}
${row(4, 'Target', 'Connects to the goal', 'Native connection to Customer Journey Analytics.', '.49', 'Sample: 300 of 612')}
${row(5, 'Brand Concierge', 'Connects to the goal', 'Partner workflow with Brand Visibility. Native connection to Customer Journey Analytics.', '.31', 'Sample: 190 of 612')}
${row(6, 'Adobe Commerce', 'Connects to the goal', 'Native connection to Brand Visibility.', '.24', 'Sample: 147 of 612')}
<div class="pp-fold">More that connect to the goal <span>6 products</span></div>
<div class="pp-fold">Not tied to this goal <span>19 products</span></div>`;

(async () => {
  await new Promise(res => srv.listen(0, res));
  const b = await chromium.launch();
  async function shot(name, products, html) {
    const ctx = await b.newContext({ viewport: { width: 1500, height: 1180 }, deviceScaleFactor: 2 });
    const p = await ctx.newPage();
    await p.goto('http://localhost:' + srv.address().port + '/');
    await p.waitForTimeout(500);
    await p.click('#picker [data-play="custom"]');
    await p.waitForTimeout(500);
    for (const id of products) {
      if (await p.isHidden('#add-menu')) await p.click('#add-btn');
      await p.$eval('#add-menu [data-add="' + id + '"]', e => { const d = e.closest('details'); if (d) d.open = true; });
      await p.click('#add-menu [data-add="' + id + '"]');
      await p.waitForTimeout(350);
    }
    await p.keyboard.press('Escape');
    await p.waitForTimeout(200);
    if (await p.isHidden('#add-menu')) await p.click('#add-btn');
    await p.waitForTimeout(300);
    await p.addStyleTag({ content: CSS });
    await p.evaluate(h => { const m = document.getElementById('add-menu'); m.classList.add('pp'); m.innerHTML = h; }, html);
    await p.waitForTimeout(200);
    const box = await p.evaluate(() => { const r = document.getElementById('add-menu').getBoundingClientRect(); return [Math.round(r.bottom), Math.round(r.right)]; });
    await p.screenshot({ path: out + '/' + name + '.png', clip: { x: 0, y: 0, width: 1500, height: Math.min(1180, Math.max(box[0] + 30, 520)) } });
    console.log(name, 'menu bottom/right', box);
    await ctx.close();
  }
  await shot('c1_goal_question', [], question);
  await shot('c2_ranked_day_one', ['cja'], dayOne);
  await shot('c3_ranked_with_sample_numbers', ['cja'], withData);
  await shot('c4_after_adding_brand_visibility', ['cja', 'bv'], reRanked);
  await b.close();
  srv.close();
})().catch(e => { console.error(e); process.exit(1); });
