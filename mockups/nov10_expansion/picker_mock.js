// Mockup only (Nov 10 2026, Adam: "yes, make the map and the picker mockup"): draws the proposed grouped Add product menu
// on top of the real Create your own play page, from picker_data.json (written by
// sow/canvas/research/expansion_2026-11-10/build_map.py). Nothing in the product changes. Run from the repo root:
//   node sow/mockups/nov10_expansion/picker_mock.js
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, '..', '..', 'site'), OUT = __dirname;
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'picker_data.json'), 'utf8'));
const T = {'.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript'};
const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (u.endsWith('/')) u += 'index.html';
  const f = path.join(SITE, u);
  if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, {'Content-Type': T[path.extname(f)] || 'text/plain'}); fs.createReadStream(f).pipe(res);
});
const CSS = `
.mfind{display:flex;align-items:center;gap:8px;margin:8px 18px 4px;border:1.5px solid #1C1C1C;border-radius:10px;padding:7px 12px;font-size:16px;color:#1C1C1C;background:#fff}
.mfind svg{flex:none}.mfind .ph{color:#3A3A3A}.mfind .typed{font-weight:600}.mfind .caret{display:inline-block;width:1.5px;height:19px;background:#1C1C1C;margin-left:1px}
.mgrp{border-top:1px solid var(--line);margin-top:6px}
.mgrp summary{cursor:pointer;list-style:none;display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;column-gap:10px;padding:9px 18px 5px;font-weight:700;font-size:16px;color:#1C1C1C}
.mgrp summary::-webkit-details-marker{display:none}
.mgrp summary .cnt{font-weight:600;font-size:14.5px;color:#3A3A3A}
.mgrp[open] summary svg{transform:rotate(180deg)}
.mgrp[open] summary{padding-bottom:3px}
.mgrp .it2{padding-left:18px}
.it2 .newtag{display:inline-block;margin-left:8px;font-size:12px;font-weight:700;letter-spacing:.6px;color:#B30B00;border:1.5px solid #B30B00;border-radius:999px;padding:0 7px;line-height:18px;vertical-align:1px;text-transform:uppercase}
.it2 .grp{grid-column:1/-1;font-size:14.5px;line-height:19px;color:#3A3A3A;margin-top:1px}
.addmenu.mock{max-height:none}
`;
const CHEV = '<svg width="13" height="13" viewBox="0 0 24 24"><path d="M5 9l7 7 7-7" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const LENS = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1C1C1C" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/></svg>';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const row = (p, tag, extra = '') => `<button class="it2" role="menuitem"><span class="nm">${esc(p.name)}${p.isNew ? '<span class="newtag">New</span>' : ''}</span>${tag ? `<span class="ctag">${tag}</span>` : ''}${extra}</button>`;
const find = typed => `<div class="mfind">${LENS}${typed ? `<span class="typed">${esc(typed)}</span><span class="caret"></span>` : '<span class="ph">Find a product</span>'}</div>`;
const plural = n => `${n} product${n === 1 ? '' : 's'}`;
function first() {
  return `<div class="hd"><div class="k">Add your first product</div><p>Grouped the way Adobe's own menu groups them. Each one says how many of the others it connects to.</p></div>` + find('') +
    DATA.groups.map((g, i) => `<details class="mgrp"${i === 0 ? ' open' : ''}><summary><span>${esc(g.name)}</span><span class="cnt">${plural(g.products.length)}</span>${CHEV}</summary>` +
      g.products.map(p => row(p, `Connects to ${plural(p.n)}`)).join('') + `</details>`).join('');
}
function onCanvas() {
  const all = DATA.groups.flatMap(g => g.products.map(p => ({...p, group: g.name}))).filter(p => !DATA.canvas.includes(p.id));
  const yes = all.filter(p => p.to.length).sort((a, b) => b.to.length - a.to.length || a.name.localeCompare(b.name));
  let h = `<div class="hd"><div class="k">Add a product</div><p>Products that connect to your canvas come first.</p></div>` + find('') +
    `<div class="g">Connects to your canvas</div>` + yes.map(p => row(p, `Connects to ${p.to.length} on your canvas`)).join('') +
    `<div class="g">Not connected to your canvas yet</div>`;
  h += DATA.groups.map(g => ({name: g.name, rest: g.products.filter(p => !DATA.canvas.includes(p.id) && !p.to.length)})).filter(g => g.rest.length)
    .map(g => `<details class="mgrp" style="border-top:0;margin-top:0"><summary><span>${esc(g.name)}</span><span class="cnt">${plural(g.rest.length)}</span>${CHEV}</summary></details>`).join('');
  return h;
}
function found(typed) {
  const all = DATA.groups.flatMap(g => g.products.map(p => ({...p, group: g.name}))).filter(p => p.name.toLowerCase().includes(typed.toLowerCase()));
  return `<div class="hd"><div class="k">Add your first product</div><p>Grouped the way Adobe's own menu groups them. Each one says how many of the others it connects to.</p></div>` + find(typed) +
    `<div class="g">${all.length} match${all.length === 1 ? '' : 'es'}</div>` + all.map(p => row(p, `Connects to ${plural(p.n)}`, `<span class="grp">${esc(p.group)}</span>`)).join('');
}
(async () => {
  await new Promise(r => server.listen(0, r));
  const B = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch();
  const shot = async (name, html, addFirst, h = 1000, whole = false) => {
    const ctx = await b.newContext({viewport: {width: 1400, height: h}, deviceScaleFactor: 2}), p = await ctx.newPage();
    await p.goto(B + 'index.html'); await p.waitForTimeout(600);
    await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(700);
    for (const id of addFirst) {
      if (await p.$eval('#add-menu', e => e.hidden)) { await p.click('#add-btn'); await p.waitForTimeout(300); }
      await p.click(`#add-menu [data-add="${id}"]`); await p.waitForTimeout(450);
    }
    if (await p.$eval('#add-menu', e => e.hidden)) { await p.click('#add-btn'); await p.waitForTimeout(300); }
    await p.addStyleTag({content: CSS});
    await p.$eval('#add-menu', (e, [h, whole]) => { e.innerHTML = h; if (whole) e.classList.add('mock'); }, [html, whole]);
    await p.waitForTimeout(200);
    const box = await p.$eval('#add-menu', e => { const r = e.getBoundingClientRect(); return {bottom: r.bottom, scroll: e.scrollHeight, client: e.clientHeight}; });
    console.log(name, JSON.stringify(box));
    await p.screenshot({path: path.join(OUT, name)});
    await ctx.close();
  };
  await shot('picker_first_product.png', first(), []);
  // the whole list in one picture: on a laptop this menu scrolls, as today's does
  await shot('picker_on_canvas.png', onCanvas(), DATA.canvas, 1480, true);
  await shot('picker_find.png', found(DATA.typed), []);
  await b.close(); server.close();
})().catch(e => { console.error(e); process.exit(1); });
