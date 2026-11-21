// Audit of Nov 21 2026: open ready-made plays in the built site, as a partner on a fresh browser, and list what starts ticked on
// every product and connection (Typical size, $150 an hour). Run from the repo root after python3 canvas/build.py and
// python3 build_site.py:
//   node audit_2026-11-21/tools/play_defaults.js cja commerce
// Writes audit_2026-11-21/data/play_defaults.json and prints one line per product, outside system and connection.
const path = require('path'), fs = require('fs');
const {chromium} = require('playwright');
const ROOT = path.resolve(__dirname, '..', '..'), ORIGIN = 'https://audit.test/';
(async () => {
  const b = await chromium.launch(), ctx = await b.newContext({viewport: {width: 1440, height: 900}});
  await ctx.route('https://fonts.googleapis.com/**', r => r.fulfill({contentType: 'text/css', body: ''}));
  await ctx.route('https://abvfirefly.netlify.app/**', r => r.fulfill({status: 404, body: ''}));
  await ctx.route(ORIGIN + '**', async r => { let u = decodeURIComponent(new URL(r.request().url()).pathname); if (u.endsWith('/')) u += 'index.html';
    const f = path.join(ROOT, 'site', u); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return r.fulfill({status: 404, body: ''}); await r.fulfill({path: f}); });
  const out = {};
  for (const play of process.argv.slice(2)) {
    const p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(ORIGIN + 'index.html'); await p.waitForFunction('window.READY===true'); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForFunction('window.READY===true');
    await p.click(`#picker [data-play="${play}"]`); await p.waitForTimeout(600); await p.keyboard.press('Escape'); await p.fill('#rate', '150'); await p.waitForTimeout(200);
    out[play] = await p.evaluate(() => { const row = l => ({id: l, name: LN[l].name, unit: unitOf(l), hours: hrs(l), ticked: counted(l)});
      return {label: play().label, size: st.size, rate: st.rate, products: prods().map(o => ({id: o.id, name: o.name, outside: !!o.outside, services: all(o).map(row)})),
        connections: conns().map(o => ({id: o.id, a: P[o.a].name, b: P[o.b].name, a_outside: !!P[o.a].outside, b_outside: !!P[o.b].outside, services: all(o).map(row)})), totals: totals()}; });
    out[play].page_errors = errs; await p.close(); }
  await b.close();
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'play_defaults.json'), JSON.stringify(out, null, 1) + '\n');
  const sum = (ls, unit) => ls.filter(l => l.ticked && (l.unit === 'monthly') === (unit === 'monthly')).reduce((s, l) => s + l.hours, 0);
  for (const [k, v] of Object.entries(out)) { console.log(`\n== ${v.label} (${k}): $${v.totals.one.toLocaleString()} one-time + $${v.totals.mon.toLocaleString()} a month, ${v.totals.n} services ticked`);
    for (const o of v.products) if (!o.outside) console.log(`  product     ${o.name}: ${o.services.filter(l => l.ticked).length} of ${o.services.length} ticked, ${sum(o.services, 'one-time')} h one-time, ${sum(o.services, 'monthly')} h a month`);
    for (const o of v.connections) console.log(`  connection  ${o.a} + ${o.b}: ${o.services.filter(l => l.ticked).length} of ${o.services.length} ticked, ${sum(o.services, 'one-time')} h one-time` +
      o.services.filter(l => l.ticked).map(l => `\n                - ${l.name} (${l.hours} h)`).join('')); }
})();
