// Mockups (Nov 4 2026, Adam): 1) Save draft and Open draft on the Build page's top bar, as on the SOW steps, with a
// line that says the work saves in the browser as you go; 2) the problem box answer lists every connection (with the
// bolt, its kind and what it does) instead of drawing only neighbors, and stacks cleanly on a phone. Not built.
//   node sow/mockups/nov4_drafts/mock_drafts.js
const {chromium} = require('playwright'); const path = require('path');
const SITE = path.join(__dirname, '..', '..', 'site'), OUT = __dirname;
const BOLT = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>';
(async () => { const b = await chromium.launch();
  const ctx = async (w, h, s) => { const c = await b.newContext({viewport: {width: w, height: h}, deviceScaleFactor: 2}); const p = await c.newPage(); await p.goto('file://' + path.join(SITE, 'index.html')); if (s) { await p.evaluate(s => localStorage.setItem('abv-sow-build-v1', JSON.stringify({v: 2, rate: 150, ...s})), s); await p.reload(); } await p.waitForTimeout(900); return p; };

  // 1. the SOW steps' top bar today, for reference, then the Build page with the same buttons
  const sow = await (await b.newContext({viewport: {width: 1440, height: 260}, deviceScaleFactor: 2})).newPage();
  await sow.goto('file://' + path.join(SITE, 'sow', 'index.html')); await sow.waitForTimeout(600); await sow.screenshot({path: path.join(OUT, 'drafts_sow_today.png')});
  const st = await sow.evaluate(() => { const g = getComputedStyle(document.getElementById('save-draft')); return {border: g.border, color: g.color, bg: g.backgroundColor, radius: g.borderRadius, pad: g.padding, font: g.font}; });
  let p = await ctx(1440, 900, {play: 'cja', out: ['cdn']});
  await p.evaluate(st => { const so = document.getElementById('start-over'), wrap = document.createElement('div'); wrap.style.cssText = 'display:flex;gap:10px;align-items:center;margin-left:auto';
    const note = document.createElement('span'); note.textContent = 'Saved in this browser as you go'; note.style.cssText = 'font-size:14px;color:#3A3A3A;margin-right:6px';
    const mk = t => { const x = document.createElement('button'); x.textContent = t; Object.assign(x.style, {border: st.border, color: st.color, background: st.bg, borderRadius: st.radius, padding: st.pad, font: st.font, cursor: 'pointer'}); return x; };
    so.parentNode.insertBefore(wrap, so); wrap.append(note, mk('Save draft'), mk('Open draft'), so); }, st);
  await p.waitForTimeout(200); await p.screenshot({path: path.join(OUT, 'drafts_build.png'), clip: {x: 0, y: 0, width: 1440, height: 340}}); await p.context().close();

  // 2. the answer lists every connection
  for (const [w, h, name] of [[1440, 1300, 'answer_connections.png'], [390, 2000, 'answer_connections_phone.png']]) {
    p = await ctx(w, h, null);
    await p.fill('#bp-q', "My client doesn't show up when people ask ChatGPT about their category, and they can't tell if AI traffic turns into sales."); await p.press('#bp-q', 'Enter'); await p.waitForTimeout(2300);
    await p.evaluate(BOLT => { const s = bp.setup, ids = [...s.prods, ...s.out], cs = C.filter(c => ids.includes(c.a) && ids.includes(c.b));
      const row = document.querySelector('.bp-prods'); row.innerHTML = ids.map(id => `<span class="bp-p${P[id].outside ? ' out' : ''}">${P[id].name}${P[id].outside ? ' (outside system)' : ''}</span>`).join('');
      row.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;margin:6px 0 4px';
      const lbl = document.createElement('div'); lbl.className = 'bp-lbl'; lbl.textContent = 'How they connect';
      const ul = document.createElement('div'); ul.innerHTML = cs.map(c => `<div style="display:flex;gap:10px;align-items:flex-start;margin:6px 0;font-size:15px;line-height:1.45;color:#1C1C1C"><span style="flex:none;display:inline-flex;align-items:center;gap:4px;border:2px solid #EB1000;color:#EB1000;border-radius:14px;padding:3px 10px 3px 8px;font-weight:700;font-size:13px;background:#fff">${BOLT}Integrate</span><span><b>${P[c.a].name} + ${P[c.b].name}</b> · ${KIND[c.kind] || ''}. ${bpVoice(c.label || '')}</span></div>`).join('');
      row.after(lbl, ul); document.querySelectorAll('.bp-ans .bp-lbl').forEach(x => x.setAttribute('role', 'heading')); }, BOLT);
    await p.waitForTimeout(1500); /* after the answer's fade-in */ const box = await p.$('#bp'); await box.screenshot({path: path.join(OUT, name)}); await p.context().close(); }
  await b.close(); })();
