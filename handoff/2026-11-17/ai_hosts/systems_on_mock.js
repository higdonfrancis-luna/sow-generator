// Mockup for Adam (Nov 18): a ready-made play with every outside system it connects to on the canvas from the start.
// Brand Visibility + Customer Journey Analytics: the CDN, data warehouse, cloud storage, CRM, ad platforms, BI tools, search data,
// and the three AI assistants (proposed boxes). Nothing in the repository changes.
const OUT = '/tmp/claude-0/-home-user-sow-generator/e88698e0-9171-589a-9f89-0f508776c935/scratchpad/ai_hosts/round2/pictures';
const { chromium } = require('playwright'); const fs = require('fs');
const D = JSON.parse(fs.readFileSync('/home/user/sow-generator/handoff/2026-11-17/ai_hosts/proposal_data_v2.json', 'utf8'));
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1900, height: 1300 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage(); p.on('pageerror', e => console.log('PAGE ERROR', e.message));
  await p.goto('file:///home/user/sow-generator/canvas/index.html'); await p.waitForFunction(() => window.READY === true);
  await p.evaluate((D) => {
    I.chat = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5h16v10.5H11l-4.5 3.8V16H4z"/><path d="M8 9.5h8M8 12.5h5"/></svg>';
    for (const s of D.outside_systems) { const o = { id: s.id, name: s.name, title: s.title, icon: 'chat', outside: true, systems: s.systems, rec: '', lines: [], more: [] }; CAT.products.push(o); P[s.id] = o; }
    for (const c of D.connections) { const o = { id: c.id, a: c.a, b: c.b, lines: [], more: [], how: c.how, source: c.source, gain: c.gain, flows: c.flows, kind: 'outside', label: c.label, availability: '', prereqs: c.prereqs, no_services: true }; C.push(o); CBY[o.id] = o; }
    const pl = PLAYS.cja; pl.outside = [...new Set([...(pl.outside || []), 'copilot', 'chatgpt', 'claude'])];
    pl.opos = Object.assign({}, pl.opos, { copilot: [-1, 1], chatgpt: [-1, -1], claude: [-2, 0] });
    pl.ostart = pl.outside.slice();
  }, D);
  await p.click('#picker [data-play="cja"]'); await p.waitForTimeout(1200);
  await p.evaluate(() => { const o = [...document.querySelectorAll('button, [role=button], label, div')].find(x => /^\s*Option B\s*Show all connections/i.test(x.textContent) && x.querySelectorAll('*').length < 12); if (o) o.click(); });
  await p.waitForTimeout(900);
  const h = await p.evaluate(() => { const n = [...document.querySelectorAll('.node')].map(x => x.getBoundingClientRect().bottom + scrollY); return Math.ceil(Math.max(...n) + 100); });
  await p.evaluate(([y, txt]) => { const d = document.createElement('div'); d.textContent = txt; d.style.cssText = `position:absolute;left:24px;top:${y}px;z-index:99999;background:#1d1d1d;color:#fff;font:600 14px Arial,sans-serif;padding:7px 12px;border-radius:6px;max-width:1800px`; document.body.appendChild(d); }, [h - 64, 'Mockup: proposed, not built. Brand Visibility + Customer Journey Analytics with every system it plugs into on the canvas from the start: the partner deletes what the client doesn’t have. The three AI assistants are the boxes being built now.']);
  await p.screenshot({ path: OUT + '/g1_cja_play_all_systems_on.png', fullPage: true, clip: { x: 0, y: 0, width: 1900, height: h } });
  console.log('done', h);
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
