// Pictures for Adam (Nov 18): where the "services around Coworker" already live, and a compact summary in the tool.
// f1. The brief's Coworker evidence page, top and its list of pairings with counts (as it is today).
// f2. Mockup: the Adobe Coworker play, Coworker's card with a short "Services around Coworker" table:
//     Coworker on its own, then one row per product Coworker connects to, with the number of services and typical hours.
// Nothing in the repository changes. Run: node coworker_services_mock.js
const OUT = '/tmp/claude-0/-home-user-sow-generator/e88698e0-9171-589a-9f89-0f508776c935/scratchpad/ai_hosts/round2/pictures';
const BRIEF = '/tmp/claude-0/-home-user-sow-generator/e88698e0-9171-589a-9f89-0f508776c935/scratchpad/cwev/site/coworker-evidence.html';
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  {   // f1: the brief page
    const ctx = await b.newContext({ viewport: { width: 1500, height: 1100 }, deviceScaleFactor: 2 });
    const p = await ctx.newPage();
    await p.goto('file://' + BRIEF); await p.waitForTimeout(1200);
    const y = await p.evaluate(() => { const n = document.querySelector('.cw-jump'); if (!n) return 0; n.scrollIntoView({ block: 'center' }); window.scrollTo({ top: Math.max(0, n.getBoundingClientRect().top + scrollY - 420), behavior: 'instant' }); return Math.round(scrollY); });
    await p.waitForTimeout(400);
    await p.evaluate(() => { const n = document.querySelector('.cw-jump'); if (n) { n.style.outline = '3px solid #EB1000'; n.style.outlineOffset = '6px'; } const d = document.createElement('div'); d.textContent = 'Your brief today: the Coworker evidence page lists every Coworker service, grouped by the product it pairs with (red outline: the pairings and how many services each has).'; d.style.cssText = 'position:fixed;left:14px;bottom:14px;z-index:99999;background:#1d1d1d;color:#fff;font:600 14px Arial,sans-serif;padding:7px 12px;border-radius:6px;max-width:80vw'; document.body.appendChild(d); });
    await p.screenshot({ path: OUT + '/f1_brief_coworker_page.png' });
    await ctx.close();
    console.log('f1 done', y);
  }
  {   // f2: the tool, Coworker play, Coworker's card with the summary
    const ctx = await b.newContext({ viewport: { width: 1500, height: 1200 }, deviceScaleFactor: 2 });
    const p = await ctx.newPage();
    p.on('pageerror', e => console.log('PAGE ERROR', e.message));
    await p.goto('file:///home/user/sow-generator/canvas/index.html');
    await p.waitForFunction(() => window.READY === true);
    await p.click('#picker [data-play="coworker"]'); await p.waitForTimeout(800);
    await p.evaluate(() => { const n = [...document.querySelectorAll('.node')].find(x => x.textContent.includes('Coworker')); n.click(); });
    await p.waitForTimeout(700);
    await p.evaluate(() => {
      const base = id => { const L = LN[id]; return L && L.unit !== 'monthly' ? L.base : 0; };
      const own = [...(P.cw.lines || []), ...(P.cw.more || [])];
      const rows = C.filter(c => c.a === 'cw' || c.b === 'cw').map(c => { const o = c.a === 'cw' ? c.b : c.a; const ids = [...(c.lines || []), ...(c.more || [])]; return { name: P[o].name, n: ids.length, h: ids.reduce((s, i) => s + base(i), 0) }; }).filter(r => r.n).sort((a, b) => b.n - a.n || b.h - a.h);
      const total = own.length + rows.reduce((s, r) => s + r.n, 0);
      const tr = (name, n, h, add) => `<tr><td style="padding:6px 8px 6px 0">${name}</td><td style="padding:6px 8px;text-align:right">${n}</td><td style="padding:6px 8px;text-align:right">${h ? h + ' h' : ''}</td><td style="padding:6px 0 6px 8px;text-align:right">${add ? '<u style="color:#EB1000;font-weight:600">Add</u>' : ''}</td></tr>`;
      const html = `<div class="sec" id="mock-sec" style="margin-top:6px">Services around Coworker</div>
        <p style="margin:2px 0 8px;font-size:14px;color:#4a4a4a">${total} services in all. Each product Coworker connects to brings its own Coworker services. Add a product to see them on the canvas.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14.5px"><thead><tr style="text-align:left;color:#6b6b6b;font-size:12.5px;letter-spacing:.06em;text-transform:uppercase"><th style="padding:4px 8px 4px 0">With</th><th style="padding:4px 8px;text-align:right">Services</th><th style="padding:4px 8px;text-align:right">Typical hours</th><th></th></tr></thead><tbody>` +
        tr('<b>Coworker on its own</b>', own.length, own.reduce((s, i) => s + base(i), 0), false) + rows.map(r => tr(r.name, r.n, r.h, true)).join('') + `</tbody></table>`;
      const c = document.getElementById('card');
      const first = c.querySelector('.sec');
      (first ? first : c.lastElementChild).insertAdjacentHTML('beforebegin', html);
      document.body.appendChild(c);
      c.style.cssText += ';position:absolute;left:40px;top:40px;max-height:none;overflow:visible;z-index:99998;width:600px';
      window.scrollTo(0, 0);
      const t = document.createElement('div'); t.textContent = 'Mockup: proposed, not built. On Coworker’s card (any play, the Adobe Coworker play included): one line per product, not a long list of services.'; t.style.cssText = 'font:600 13px Arial,sans-serif;color:#fff;background:#1d1d1d;padding:5px 10px;border-radius:5px;display:inline-block;margin-top:14px'; c.appendChild(t);
    });
    await p.waitForTimeout(300);
    await (await p.$('#card')).screenshot({ path: OUT + '/f2_coworker_card_services_around.png' });
    await ctx.close();
    console.log('f2 done');
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
