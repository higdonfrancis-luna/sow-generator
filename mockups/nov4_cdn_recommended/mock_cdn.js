// Mockup (Nov 4 2026, Adam: "ok"): the CDN starts on the canvas in every Brand Visibility play, tagged Recommended, with
// CDN log forwarding turned on (Adobe: without it "the Agentic Traffic dashboard can't display metrics"); the partner can
// still take it off. Search data shows Recommended in the Add outside system menu. Injected at runtime; nothing built.
//   node sow/mockups/nov4_cdn_recommended/mock_cdn.js
const {chromium} = require('playwright'); const path = require('path');
const PAGE = 'file://' + path.join(__dirname, '..', '..', 'site', 'index.html'), OUT = __dirname;
function inject() {
  const sv = d => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  I.search = sv('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>');
  const p = {id: 'search', name: 'Search data', title: 'Search data', outside: true, icon: 'search', systems: 'Google Search Console and Google Analytics 4', lines: [], more: []}; CAT.products.push(p); P.search = p;
  const c = {id: 'search-bv', a: 'search', b: 'bv', kind: 'outside', line: 'native', label: '', how: 'Search Console queries suggest prompts to track; GA4 fills the Business Impact tab', source: {url: 'https://experienceleague.adobe.com/en/docs/brand-visibility/using/dashboards/brands-management', title: 'Experience League'}, lines: [], more: [], availability: 'Generally available.', prereqs: [], gain: null, flows: []}; C.push(c); CBY[c.id] = c;
  for (const k of ['cja', 'commerce', 'aem', 'fsi', 'abv']) { const pl = PLAYS[k], used = new Set(Object.values({...pl.pos, ...pl.opos}).map(v => v.join())), [x, y] = pl.pos.bv;
    for (const q of [[x - 1, y], [x, y + 1], [x - 1, y + 1]]) if (!used.has(q.join())) { pl.opos.search = q; pl.outside.push('search'); break; } }
  // CDN log forwarding moves from More services to the services the connection starts with
  const cdn = CBY['cdn-bv']; cdn.lines = ['OX1']; cdn.more = ['OX2']; DEF.OX1 = true;
  const css = document.createElement('style'); css.textContent = '.rec{display:inline-block;font-size:12px;line-height:16px;font-weight:700;color:#B40000;background:#fff;border:1.5px solid #EB1000;border-radius:10px;padding:1px 8px;margin-top:6px}'
    + '.node .rec{position:absolute;left:50%;bottom:-12px;transform:translateX(-50%);margin:0;white-space:nowrap}.card .recp{margin:2px 0 8px;font-size:13.5px;line-height:19px;color:#1C1C1C}.card .recp .rec{margin:0 0 3px}.it2 .rec{margin:0 0 0 8px;vertical-align:1px}';
  document.head.appendChild(css);
  const note = '<p class="recp"><span class="rec">Recommended</span><br>On from the start: Adobe says the Agentic Traffic dashboard needs CDN logs. Take it off if your client already forwards them.</p>';
  const card0 = cardHTML; cardHTML = (k, id) => { const h = card0(k, id); return (k === 'c' && id === 'cdn-bv') || (k === 'p' && id === 'cdn') ? h.replace('</h4>', '</h4>' + note) : h; };
  const menu0 = outMenuHTML; outMenuHTML = () => menu0().replace(/(data-out="search"[^>]*><span class="nm">[\s\S]*?)<\/span>/, '$1<span class="rec">Recommended</span></span>');
  const r0 = render; render = (...a) => { r0(...a); const n = document.querySelector('.node[data-p="cdn"]'); if (n && !n.querySelector('.rec')) { if (getComputedStyle(n).position === 'static') n.style.position = 'relative'; n.insertAdjacentHTML('beforeend', '<span class="rec">Recommended</span>'); } };
  UNI = {k: '', s: new Set()}; pkKey = '';
}
(async () => { const b = await chromium.launch();
  const open = async (s, h = 1000) => { const p = await (await b.newContext({viewport: {width: 1440, height: h}, deviceScaleFactor: 2})).newPage(); await p.goto(PAGE);
    await p.evaluate(s => localStorage.setItem('abv-sow-build-v1', JSON.stringify({v: 2, rate: 150, ...s})), {...s, out: []}); await p.reload(); await p.waitForTimeout(900);
    await p.evaluate(`(${inject})()`); await p.evaluate(out => { st.out = out; render(); }, s.out); await p.waitForTimeout(900); return p; };
  const shot = async (s, file, click, h) => { const p = await open(s, h); if (click) { await p.click(click); await p.waitForTimeout(600); } await p.screenshot({path: path.join(OUT, file)}); await p.context().close(); };
  await shot({play: 'abv', out: ['cdn']}, 'cdn_bv_start.png');
  await shot({play: 'abv', out: ['cdn']}, 'cdn_bv_card.png', '.ib[data-c="cdn-bv"]', 1500);
  await shot({play: 'abv', out: ['cdn']}, 'cdn_bv_menu.png', '#out-btn');
  await shot({play: 'aem', out: ['cdn']}, 'cdn_aem_start.png');
  await b.close(); })();
