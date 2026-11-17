// Mockup: Create your own play's Add product menu, today and with Adam's "never go backwards" rule.
// Adam, Nov 17: with Customer Journey Analytics on the canvas the menu should not put Adobe Analytics first,
// "because they'd be going backwards". The proposal moves it out of "Connects to your canvas" to a
// "Not suggested" line the partner can still add from. The page is changed for the picture only.
// Run: node own_play_menu_mock.js <output folder>
const R = require('path').resolve(__dirname, '..', '..', '..', '..');
const out = process.argv[2];
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1500, height: 1000 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto('file://' + R + '/canvas/index.html');
  await p.waitForFunction(() => window.READY === true);
  await p.click('#picker [data-play="custom"]');
  await p.waitForTimeout(600);
  if (await p.isHidden('#add-menu')) await p.click('#add-btn');
  await p.$eval('#add-menu [data-add="cja"]', x => { for (let e = x.parentElement; e; e = e.parentElement) if (e.tagName === 'DETAILS') e.open = true; });
  await p.click('#add-menu [data-add="cja"]');
  await p.waitForTimeout(400);
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);
  if (await p.isHidden('#add-menu')) await p.click('#add-btn');
  await p.waitForTimeout(300);
  await p.addStyleTag({ content: '#add-menu{max-height:none}' });
  const menu = await p.$('#add-menu');
  await menu.screenshot({ path: out + '/own_play_menu_today.png' });
  const moved = await p.evaluate(() => {
    const list = document.getElementById('add-list');
    const heads = [...list.querySelectorAll(':scope > .g')];      // "Connects to your canvas", "Not connected to your canvas yet"
    const row = list.querySelector('[data-add="aa"]');
    const head = document.createElement('div');
    head.className = 'g';
    head.textContent = 'Not suggested';
    row.querySelector('.ctag').textContent = 'Add anyway';
    row.querySelector('.to').remove();
    const why = document.createElement('div');
    why.style.cssText = 'padding:0 18px 10px;font-size:14px;line-height:1.4;color:#4a4a4a';
    why.textContent = 'Customer Journey Analytics is on your canvas. Add Adobe Analytics only if your client still runs it.';
    heads[1].before(head);
    head.after(row);
    row.after(why);
    return heads.map(h => h.textContent);
  });
  console.log('menu headings:', moved);
  await p.waitForTimeout(200);
  await menu.screenshot({ path: out + '/own_play_menu_proposed.png' });
  // one picture, today beside proposed
  const today = fs.readFileSync(out + '/own_play_menu_today.png').toString('base64');
  const next = fs.readFileSync(out + '/own_play_menu_proposed.png').toString('base64');
  const q = await (await b.newContext({ viewport: { width: 1120, height: 760 }, deviceScaleFactor: 2 })).newPage();
  await q.setContent(`<body style="margin:0;padding:28px;background:#f2f2f2;font:600 19px Arial,sans-serif;color:#222">
    <div style="display:flex;gap:28px;align-items:flex-start">
      <div><div style="margin-bottom:12px">Today: Adobe Analytics comes first</div><div style="height:640px;overflow:hidden"><img src="data:image/png;base64,${today}" width="500"></div></div>
      <div><div style="margin-bottom:12px">Proposed: not suggested, still there to add</div><div style="height:640px;overflow:hidden"><img src="data:image/png;base64,${next}" width="500"></div></div>
    </div></body>`);
  await q.screenshot({ path: out + '/own_play_menu_today_vs_proposed.png' });
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
