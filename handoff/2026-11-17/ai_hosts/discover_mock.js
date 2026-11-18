// Mockups for Adam (Nov 18): how partners find ChatGPT, Claude and Microsoft Copilot.
// 1. The first page: a new client problem and a new play card in the agentic lineup.
// 2. The new play, "Adobe in your client's AI assistant": Coworker with the three assistants.
// 3. Any other canvas: products say which assistants they work in, and the assistants lead the Add outside system menu.
// Everything is painted into the built page's memory for the picture only. Nothing in the repository changes.
// Run: node discover_mock.js [1|2|3|all]
const BASE = '/tmp/claude-0/-home-user-sow-generator/e88698e0-9171-589a-9f89-0f508776c935/scratchpad/ai_hosts';
const OUT = BASE + '/round2/pictures';
const { chromium } = require('playwright');
const fs = require('fs');
fs.mkdirSync(OUT, { recursive: true });
const D = JSON.parse(fs.readFileSync('/home/user/sow-generator/handoff/2026-11-17/ai_hosts/proposal_data_v2.json', 'utf8'));
const only = process.argv[2] || 'all';
const M = 'Mockup: proposed, not built. ';
const PLAY = { id: 'aiassist', section: 'Adobe agentic lineup, or build your own play', label: 'Adobe in your client’s AI assistant', sub: 'Coworker and their Adobe products inside Copilot, ChatGPT or Claude', badge: 'New', products: ['cw'], outside: ['copilot', 'chatgpt', 'claude'], ostart: ['copilot', 'chatgpt', 'claude'], pos: { cw: [0, 0] }, opos: { copilot: [-1, -1], chatgpt: [0, -1], claude: [1, -1] } };
const PROB = { id: 'adobe-in-ai-assistant', problem: 'Our people work in Microsoft Copilot, ChatGPT or Claude all day, and want our Adobe data and tools there.', chip: 'My client’s team wants Adobe inside its AI assistant', starter: true, play: 'aiassist', products: ['cw', 'copilot', 'chatgpt', 'claude'], keywords: [], why: 'Coworker works inside Microsoft 365 Copilot, ChatGPT and Claude, and so do many of the Adobe products your client may already own.', sources: [], refine: [] };

async function open(b, w, h) {
  const ctx = await b.newContext({ viewport: { width: w || 1500, height: h || 1000 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('pageerror', e => console.log('PAGE ERROR', e.message));
  await p.goto('file:///home/user/sow-generator/canvas/index.html');
  await p.waitForFunction(() => window.READY === true);
  await p.evaluate(([D, PLAY, PROB]) => {
    I.chat = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5h16v10.5H11l-4.5 3.8V16H4z"/><path d="M8 9.5h8M8 12.5h5"/></svg>';
    for (const s of D.outside_systems) { const o = { id: s.id, name: s.name, title: s.title, icon: 'chat', outside: true, systems: s.systems, rec: '', lines: [], more: [] }; CAT.products.push(o); P[s.id] = o; }
    for (const c of D.connections) { const o = { id: c.id, a: c.a, b: c.b, lines: [], more: [], how: c.how, source: c.source, gain: c.gain, flows: c.flows, kind: 'outside', label: c.label, availability: '', prereqs: c.prereqs, no_services: true }; C.push(o); CBY[o.id] = o; }
    for (const pl of D.plays) if (pl.add && pl.add.length && PLAYS[pl.play]) { const q = PLAYS[pl.play]; q.outside = [...new Set([...(q.outside || []), ...pl.add])]; }
    const np = Object.assign({}, PLAY); CAT.plays.splice(CAT.plays.findIndex(x => x.id === 'coworker') + 1, 0, np); PLAYS[np.id] = np;
    PROBS.unshift(PROB);
  }, [D, PLAY, PROB]);
  return p;
}
async function label(p, text) {
  await p.evaluate((text) => {
    let d = document.getElementById('mock-label');
    if (!d) { d = document.createElement('div'); d.id = 'mock-label'; document.body.appendChild(d); }
    d.style.cssText = 'position:fixed;left:14px;bottom:14px;z-index:99999;background:#1d1d1d;color:#fff;font:600 14px Arial,sans-serif;padding:7px 12px;border-radius:6px;max-width:70vw';
    d.textContent = text;
  }, text);
}
const outline = (sel) => `${sel}{outline:3px solid #EB1000!important;outline-offset:4px;border-radius:10px}`;

(async () => {
  const b = await chromium.launch();
  if (only === 'all' || only === '1') {   // the first page: the new problem chip and the new play card
    const p = await open(b, 1500, 2100);
    await p.evaluate(() => {
      // redraw the play cards with the new play, the way the page draws them at load
      const secs = [...new Set(CAT.plays.map(x => x.section))];
      const ag = [...document.querySelectorAll('#picker-list .sh')].find(h => /agentic/i.test(h.textContent));
      const grid = ag && ag.nextElementSibling;
      const np = PLAYS.aiassist;
      const card = `<button class="pc-card pc-new" data-play="aiassist" id="mock-play"><span class="pc-badge">New</span><b>${esc(np.label)}</b><span class="s">${esc(np.sub)}</span><span class="chips">${['Coworker', 'Microsoft Copilot', 'ChatGPT', 'Claude'].map(x => `<span>${x}</span>`).join('')}</span></button>`;
      const cw = grid && grid.querySelector('[data-play="coworker"]');
      if (cw) { cw.insertAdjacentHTML('afterend', card); grid.style.setProperty('--cols', grid.children.length); }
      if (typeof bpRender === 'function') bpRender();
      const chip = [...document.querySelectorAll('.bp-chip')].find(x => /inside its AI assistant/.test(x.textContent));
      if (chip) chip.id = 'mock-chip';
    });
    await p.addStyleTag({ content: outline('#mock-play') + outline('#mock-chip') });
    await p.waitForTimeout(300);
    await label(p, M + 'First page: a new client problem (top) and a new play in the agentic lineup (outlined in red).');
    const h = await p.evaluate(() => { const g = [...document.querySelectorAll('#picker-list .grid')]; const last = g[1] || g[0]; const y = Math.ceil(last.getBoundingClientRect().bottom + scrollY + 24); const l = document.getElementById('mock-label'); l.style.position = 'absolute'; l.style.bottom = 'auto'; l.style.top = y + 'px'; return y + 60; });
    await p.screenshot({ path: OUT + '/d1_first_page_problem_and_play.png', fullPage: true, clip: { x: 0, y: 0, width: 1500, height: h } });
    console.log('1 done, height', h);
  }
  if (only === 'all' || only === '2') {   // the new play's canvas
    const p = await open(b, 1500, 1000);
    await p.evaluate(() => { const btn = document.createElement('button'); btn.className = 'pc-card'; btn.dataset.play = 'aiassist'; document.getElementById('picker-list').appendChild(btn); btn.click(); });
    await p.waitForTimeout(900);
    await label(p, M + 'The new play: Coworker with Microsoft Copilot, ChatGPT and Claude on the canvas from the start. The partner keeps the assistant the client uses and removes the others.');
    await p.screenshot({ path: OUT + '/d2_new_play_canvas.png' });
    // the ranked Add product list on this play, for its own goal
    const has = await p.$('#add-btn');
    if (has) { await p.click('#add-btn'); await p.waitForTimeout(500); }
    await label(p, M + 'Add product on the new play asks the client\u2019s goal once, with this play\u2019s own problem first.');
    await p.screenshot({ path: OUT + '/d2b_new_play_add_product.png' });
    const goal = await p.$('#add-menu [data-goal]');
    if (goal) { await goal.click(); await p.waitForTimeout(800); }
    await p.addStyleTag({ content: '#add-menu{max-height:none!important}' });
    await p.evaluate(() => {
      const hosts = ['copilot', 'chatgpt', 'claude'];
      document.querySelectorAll('#add-menu [data-add]').forEach(r => {
        const id = r.dataset.add; const on = hosts.filter(h => C.some(c => (c.a === h && c.b === id) || (c.b === h && c.a === id)));
        if (!on.length) return;
        const d = document.createElement('span'); d.textContent = 'Also works in ' + on.map(h => P[h].name.replace('Microsoft ', '')).join(', ').replace(/, ([^,]*)$/, ' and $1');
        d.style.cssText = 'display:block;font-size:13px;font-weight:600;color:#EB1000;margin-top:2px';
        const why = [...r.querySelectorAll('*')].find(e => /^(Solves|Builds on|Connects to|Not tied to) (the|this) goal/.test(e.textContent.trim()) && e.querySelectorAll('*').length <= 4);
        (why || r).appendChild(d);
      });
    });
    await p.evaluate((txt) => { const l = document.getElementById('mock-label'); if (l) l.remove(); const m = document.getElementById('add-menu'); const n = document.createElement('div'); n.textContent = txt; n.style.cssText = 'font:600 13px Arial,sans-serif;color:#fff;background:#1d1d1d;padding:6px 10px;border-radius:5px;margin:10px 18px 14px'; m.appendChild(n); }, M + 'Then the ranked list: products that also work in the client\u2019s assistant say so (red line).');
    await p.waitForTimeout(300);
    const menu = await p.$('#add-menu');
    if (menu) await menu.screenshot({ path: OUT + '/d2c_new_play_ranked_list.png' });
    console.log('2 done');
  }
  if (only === 'all' || only === '3') {   // a hint on any other canvas: Create your own play with three products
    const p = await open(b, 1600, 1100);
    await p.click('#picker [data-play="custom"]'); await p.waitForTimeout(700);
    for (const id of ['cja', 'aemsites', 'workfront']) {
      if (await p.isHidden('#add-menu')) await p.click('#add-btn');
      await p.waitForTimeout(300);
      const ok = await p.evaluate((id) => { const x = document.querySelector(`#add-menu [data-add="${id}"]`); if (!x) return false; for (let e = x.parentElement; e; e = e.parentElement) if (e.tagName === 'DETAILS') e.open = true; x.click(); return true; }, id);
      if (!ok) console.log('could not add', id);
      await p.waitForTimeout(400); await p.keyboard.press('Escape'); await p.waitForTimeout(200);
    }
    await p.evaluate(() => {
      const hosts = ['copilot', 'chatgpt', 'claude'];
      document.querySelectorAll('.node').forEach(n => {
        const id = n.dataset.id || n.dataset.p || (Object.keys(P).find(k => n.textContent.includes(P[k].name)));
        const on = hosts.filter(h => C.some(c => (c.a === h && c.b === id) || (c.b === h && c.a === id)));
        if (!id || !on.length || P[id].outside) return;
        const d = document.createElement('div'); d.className = 'mock-hint';
        d.textContent = 'Works in ' + on.map(h => P[h].name.replace('Microsoft ', '')).join(', ').replace(/, ([^,]*)$/, ' and $1');
        d.style.cssText = 'position:absolute;left:50%;top:calc(100% + 16px);transform:translateX(-50%);white-space:nowrap;font-size:13px;font-weight:600;color:#EB1000;text-decoration:underline;cursor:pointer;background:#fff;padding:2px 8px;border-radius:6px';
        n.appendChild(d);
      });
    });
    await label(p, M + 'Create your own play: each product that works in an AI assistant says so. Clicking the line adds the assistant.');
    await p.screenshot({ path: OUT + '/d3_hint_on_products.png' });
    await p.click('#out-btn'); await p.waitForTimeout(400);
    await p.evaluate(() => {
      const m = document.getElementById('out-menu'); if (!m) return;
      const rows = [...m.querySelectorAll('[data-out],[data-add-out],button')].filter(x => /ChatGPT|Claude|Copilot/.test(x.textContent));
      const head = document.createElement('div'); head.className = 'g'; head.textContent = 'Your client’s AI assistant'; head.style.cssText = 'padding:10px 18px 4px;font:700 11.5px Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#6b6b6b';
      const first = m.querySelector('.hd') ? m.querySelector('.hd').nextElementSibling : m.firstElementChild;
      m.insertBefore(head, first);
      const order = ['Copilot', 'ChatGPT', 'Claude']; rows.sort((x, y) => order.findIndex(k => x.textContent.includes(k)) - order.findIndex(k => y.textContent.includes(k)));
      rows.forEach(r => m.insertBefore(r, first));
      const rest = document.createElement('div'); rest.className = 'g'; rest.textContent = 'Other outside systems'; rest.style.cssText = head.style.cssText; m.insertBefore(rest, first);
    });
    await p.addStyleTag({ content: '#out-menu{max-height:none!important}' });
    await p.evaluate((txt) => { const l = document.getElementById('mock-label'); if (l) l.remove(); const m = document.getElementById('out-menu'); const n = document.createElement('div'); n.textContent = txt; n.style.cssText = 'font:600 13px Arial,sans-serif;color:#fff;background:#1d1d1d;padding:6px 10px;border-radius:5px;margin:10px 18px 14px'; m.appendChild(n); }, M + 'Add outside system: the assistants your client’s products work in come first.');
    const menu = await p.$('#out-menu');
    if (menu) await menu.screenshot({ path: OUT + '/d3b_out_menu_assistants_first.png' });
    console.log('3 done');
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
