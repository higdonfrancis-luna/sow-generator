"""Step 45 updates to test_review_nov2.js (Nov 4 2026). The CDN now starts on the canvas in every Brand Visibility play,
with CDN log forwarding (OX1) on, so a play starts $2,400 higher at $150, Typical (16 hours). Run once from sow/.
- the starting totals the checks name move by exactly that $2,400 (B04, step 1b, R2, R3, S22, S23, S24, S38)
- step 27's first check now says the CDN is on when a play starts, and the menus list the step 45 systems
- the outside-system checks of steps 27 to 30 test adding and removing systems, so they start from a play with the CDN
  taken off (pickNoCdn), as a partner can; adding the CDN now brings CDN log forwarding on (+$2,400)
- steps 34 to 36 rebuild a live-site browser: its engagement was saved before step 45, without the CDN, so their
  engagements take the CDN off as the live site had it

    python3 tests_step45_review.py            (first round)
    ROUND=2 python3 tests_step45_review.py    (second round, after a full run)
"""
import os
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'test_review_nov2.js')
s = open(P, encoding='utf-8').read()


def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:100])
    s = s.replace(a, b)


ROUND = os.environ.get('ROUND', '1')
if ROUND == '1':
    # helpers: a play picked with the CDN taken off, and the CDN taken off a canvas
    rep("  const pick = async (p, play, rate) => {", "  /* step 45: the CDN starts on; checks of adding and removing systems start from a play with it taken off, as a partner can */\n"
        "  const noCdn = async p => { await p.evaluate(() => { if ((st.out || []).includes('cdn')) removeOutside('cdn'); }); await p.waitForTimeout(200); };\n"
        "  const pickNoCdn = async (p, play, rate) => { await pick(p, play, rate); await noCdn(p); };\n"
        "  const pick = async (p, play, rate) => {")

    # starting totals: + $2,400 (CDN log forwarding at 16 hours, $150)
    rep("ok(t1 === '$175,200', 'B04 setup: 100 prompts put the prompt services at Small on Services ($175,200)', t1);",
        "ok(t1 === '$177,600', 'B04 setup: 100 prompts put the prompt services at Small on Services ($177,600, with the CDN on from the start)', t1);")
    rep("ok(await canvasTotal(p) === t1, 'B04: Build shows the same $175,200', await canvasTotal(p));", "ok(await canvasTotal(p) === t1, 'B04: Build shows the same $177,600', await canvasTotal(p));")
    rep("ok(await canvasTotal(p) === '$222,000' && !(await p.evaluate(() => lineOn('L03'))), 'step 1b: Commerce starts without the deployment pilot on the canvas ($222,000)'",
        "ok(await canvasTotal(p) === '$224,400' && !(await p.evaluate(() => lineOn('L03'))), 'step 1b: Commerce starts without the deployment pilot on the canvas ($224,400)'")
    rep("ok(await toolTotal(p) === '$222,000' && !(await p.evaluate(() => state.estimates.commerce.L03.on))", "ok(await toolTotal(p) === '$224,400' && !(await p.evaluate(() => state.estimates.commerce.L03.on))")
    rep("ok(await canvasTotal(q) === '$300,000' && !(await q.evaluate(() => lineOn('C04'))), 'step 1b: FSI starts without the separate question mapping ($300,000)'",
        "ok(await canvasTotal(q) === '$302,400' && !(await q.evaluate(() => lineOn('C04'))), 'step 1b: FSI starts without the separate question mapping ($302,400)'")
    rep("ok(await toolTotal(q) === '$300,000' && !n.c04", "ok(await toolTotal(q) === '$302,400' && !n.c04")
    rep("ok(await toolTotal(p) === t2 && t2 === '$219,600' && own.length === 1", "ok(await toolTotal(p) === t2 && t2 === '$222,000' && own.length === 1")
    rep("ok(k.includes('12-month term') && t === '$219,600' && await toolTotal(p) === t", "ok(k.includes('12-month term') && t === '$222,000' && await toolTotal(p) === t")
    rep("ok(ct === '$219,600' && await toolTotal(p) === ct && JSON.stringify(r) === JSON.stringify([48, '', '', true])", "ok(ct === '$222,000' && await toolTotal(p) === ct && JSON.stringify(r) === JSON.stringify([48, '', '', true])")
    rep("ok(ct === '$175,200' && await toolTotal(p) === ct, `S23:", "ok(ct === '$177,600' && await toolTotal(p) === ct, `S23:")
    rep("await toolTotal(p) === '$222,600', 'S24/F3: after Change play, re-adding an own service brings it back as written (20 hours once, $222,600)",
        "await toolTotal(p) === '$225,000', 'S24/F3: after Change play, re-adding an own service brings it back as written (20 hours once, $225,000)")
    rep("kept === 'managed' && total === '$484,800' && !cjaShown", "kept === 'managed' && total === '$487,200' && !cjaShown")

    # step 27, first check: the CDN on when a play starts; the menus offer step 45's systems
    rep("const want = {cja: 'cdn,dwh,cstore,crm', commerce: 'cdn', aem: 'cdn', fsi: 'cdn', abv: 'cdn'}, seen = {};",
        "const want = {cja: 'dwh,cstore,crm,ads,bi,search', commerce: 'search', aem: 'search,csrc,aemassets', fsi: 'search,cms', abv: 'search'}, seen = {};")
    rep("seen[k].btn && seen[k].menu === v && seen[k].boxes === '' && Array.isArray(seen[k].stored) && !seen[k].stored.length),\n"
        "      'S27: every Brand Visibility play has Add outside system; its menu lists the systems that connect to the play (a CDN on all five; a data warehouse, cloud storage and a CRM on CJA too), and none is on when the play starts'",
        "seen[k].btn && seen[k].menu === v && seen[k].boxes === 'cdn' && JSON.stringify(seen[k].stored) === '[\"cdn\"]'),\n"
        "      'S27: every Brand Visibility play has Add outside system; the CDN is on when the play starts (step 45), and the menu lists the other systems that connect to the play (search data on all five; a data warehouse, cloud storage, a CRM, ad platforms and BI tools on CJA; authoring documents and AEM Assets on AEM; another CMS on FSI)'")

    # steps 27 to 30: the outside-system checks start from a play with the CDN taken off
    a = s.index("  // ---------- step 27: outside systems")
    b = s.index("  // ---------- step 31:")
    sec = s[a:b]
    first = sec.index("// 2. CJA at $150, Typical")
    head, rest = sec[:first], sec[first:]
    n = rest.count("await pick(")
    rest = rest.replace("await pick(", "await pickNoCdn(")
    # a phone picks by tapping a box
    rest = rest.replace("await p.tap(`#picker [data-play=\"${play}\"]`); await p.waitForTimeout(500);\n      const s0 = await scale(p);",
                        "await p.tap(`#picker [data-play=\"${play}\"]`); await p.waitForTimeout(500); await noCdn(p);\n      const s0 = await scale(p);")
    s = s[:a] + head + rest + s[b:]
    print('steps 27 to 30:', n, 'picks start with the CDN taken off')

    # step 27, CJA: the menu offers seven systems; adding the CDN brings CDN log forwarding on
    rep("cstore: ['Cloud storage', 'CJA', 'Amazon S3, Azure Blob Storage'], crm: ['CRM', 'CJA', 'Salesforce, Microsoft Dynamics 365']};",
        "cstore: ['Cloud storage', 'CJA', 'Amazon S3, Azure Blob Storage'], crm: ['CRM', 'CJA', 'Salesforce, Microsoft Dynamics 365'],\n"
        "      ads: ['Ad platforms', 'CJA', 'Google Ads, Meta'], bi: ['BI tools', 'CJA', 'Power BI, Tableau'], search: ['Search data', 'Brand Visibility', 'Google Search Console']};")
    rep("ok(items.length === 4 && items.every(x => x.name === exp[x.id][0]", "ok(items.length === 7 && items.every(x => x.name === exp[x.id][0]")
    rep("ok(t0 === '$219,600' && JSON.stringify(steps) === JSON.stringify(['$228,000', '$234,000', '$240,000', '$240,000']),",
        "ok(t0 === '$219,600' && JSON.stringify(steps) === JSON.stringify(['$228,000', '$234,000', '$240,000', '$242,400']),")
    rep("and the CDN $0 (its two services start off)'", "and the CDN $2,400 (CDN log forwarding starts on with it, step 45)'")
    rep("ok((await menuIds(p)).length === 0 && (await p.textContent('#out-menu')).includes('Every outside system for this play is on your canvas'), 'S27: with all four on, the menu says every outside system for the play is on the canvas');",
        "ok((await menuIds(p)).join() === 'ads,bi,search', 'S27: with those four on, the menu still offers ad platforms, BI tools and search data (step 45)', (await menuIds(p)).join());")
    rep("cc.text.includes('Agentic Traffic dashboard') && JSON.stringify(cc.on) === '[false,false]',\n"
        "      'S27: the i on the CDN line names no license, says the Agentic Traffic dashboard needs the logs, and starts with both its services off'",
        "cc.text.includes('Agentic Traffic dashboard') && JSON.stringify(cc.on) === '[true,false]',\n"
        "      'S27: the lightning bolt on the CDN line names no license, says the Agentic Traffic dashboard needs the logs, and starts with CDN log forwarding on and the log export off (step 45)'")
    rep("    // 4. CJA data preparation beside the source services: both count, and each source line shows the overlap (step 30)\n"
        "    await p.click('#card [data-t=\"OX1\"]'); await p.waitForTimeout(300); await shut(p);",
        "    // 4. CJA data preparation beside the source services: both count, and each source line shows the overlap (step 30)\n"
        "    await shut(p);")
    # Change play and Start over clear what the partner added; the CDN starts on again
    rep("ok(ch.abv === '' && ch.cja === '' && ch.total === '$219,600' && ch.over === 0 && ch.after === '', 'S27: Change play and Start over clear the outside systems'",
        "ok(ch.abv === 'cdn' && ch.cja === 'cdn' && ch.total === '$222,000' && ch.over === 0 && ch.after === 'cdn', 'S27: Change play and Start over clear the outside systems the partner added (the CDN starts on again, step 45)'")
    # Remove from canvas: the CDN added brings CDN log forwarding on by itself
    rep("await addOut(r, 'cdn');\n    await openCard(r, '.ib[data-c=\"cdn-bv\"]'); await r.click('#card [data-t=\"OX1\"]'); await r.waitForTimeout(300); await shut(r);",
        "await addOut(r, 'cdn');")
    # step 29: CDN log forwarding is on when the CDN is added, so the choice kept is taking it out; Commerce's log export adds to it
    rep("['abv', 'cdn', 'cdn-bv', 'OX1', '$212,400'], ['commerce', 'cdn', 'cdn-bv', 'OX2', '$228,000']];",
        "['abv', 'cdn', 'cdn-bv', 'OX1', '$210,000'], ['commerce', 'cdn', 'cdn-bv', 'OX2', '$230,400']];")
    rep("(CJA $219,600, Brand Visibility $212,400, Commerce $228,000, on Build and Services)", "(CJA $219,600, Brand Visibility $210,000, Commerce $230,400, on Build and Services)")

    # steps 34 to 36: the live site's engagement had no CDN
    rep("const p = await fresh(); await pick(p, 'fsi', 150); await cont(p); await services(p); await addLib(p, 'CANVAS-C05'); await addLib(p, 'C04');",
        "const p = await fresh(); await pickNoCdn(p, 'fsi', 150); await cont(p); await services(p); await addLib(p, 'CANVAS-C05'); await addLib(p, 'C04');")
    rep("const q = await fresh(); await pick(q, 'cja', 150); await cont(q); await services(q); await q.fill('#service-rate', '175');",
        "const q = await fresh(); await pickNoCdn(q, 'cja', 150); await cont(q); await services(q); await q.fill('#service-rate', '175');")
    rep("const m = await fresh(); await pick(m, 'cja', 150); await cont(m); await services(m); await m.fill('#service-rate', '175');",
        "const m = await fresh(); await pickNoCdn(m, 'cja', 150); await cont(m); await services(m); await m.fill('#service-rate', '175');")
    open(P, 'w', encoding='utf-8').write(s)
    print('test_review_nov2.js: step 45 updates applied')

# second round (after a full run): the menu holds more items, the other plays keep their starting CDN in a draft, and a
# CJA play picked by tapping starts with the CDN; the CJA dependencies name the partner's CDN job, now on from the start
if ROUND == '2':
    s = open(P, encoding='utf-8').read()
    rep("const items = await p.$$eval('#out-menu [data-out]', bs => bs.map(x => ({id: x.dataset.out, name: x.querySelector('.nm').textContent,",
        "const items = await p.$$eval('#out-menu [data-out]', bs => bs.map(x => ({id: x.dataset.out, name: [...x.querySelector('.nm').childNodes].filter(n => !(n.classList && n.classList.contains('rec'))).map(n => n.textContent).join(''), rec: !!x.querySelector('.nm .rec'),")
    rep("ok(items.length === 7 && items.every(x => x.name === exp[x.id][0]", "ok(items.length === 7 && items.every(x => x.rec === ['cdn', 'search'].includes(x.id)) && items.every(x => x.name === exp[x.id][0]")
    rep("ok(Object.keys(dj.outside || {}).join() === 'cja' && dj.outside.cja.slice().sort().join(',') === 'cdn,crm,cstore,dwh'",
        "ok(Object.entries(dj.outside || {}).every(([k, v]) => k === 'cja' || v.join() === 'cdn') && dj.outside.cja.slice().sort().join(',') === 'cdn,crm,cstore,dwh'")
    rep("rr.boxes === '' && rr.r2 === r0 && rr.card && rr.menu === 'cdn',", "rr.boxes === '' && rr.r2 === r0 && rr.card && rr.menu === 'cdn,search',")
    rep("ok(ph.boxes === 'dwh' && ph.open", "ok(ph.boxes === 'cdn,dwh' && ph.open")
    rep("await p.keyboard.press('Enter'); await p.waitForTimeout(150); for (let i = 0; i < 5; i++) await p.keyboard.press('Tab'); await p.waitForTimeout(150);",
        "await p.keyboard.press('Enter'); await p.waitForTimeout(150); for (let i = 0; i < 30 && await p.evaluate(() => !!document.activeElement.closest('#out-menu, #out-btn')); i++) await p.keyboard.press('Tab'); await p.waitForTimeout(150);")
    rep("for (const id of ['dwh', 'cstore', 'crm', 'cdn']) await addOut(p, id);", "for (const id of ['dwh', 'cstore', 'crm', 'cdn', 'ads', 'bi', 'search']) await addOut(p, id);")
    rep("ok(names.length === 4 && names.every(x => x.h <= 24", "ok(names.length === 6 && names.every(x => x.h <= 24")
    rep("r.itemAdds = await p.evaluate(() => st.out.join()) === 'crm';", "r.itemAdds = await p.evaluate(() => st.out.join()) === 'cdn,crm';")
    rep("&& !cjaShown && /CDN log forwarding is set up by the customer's IT team/.test(dCja)", "&& !cjaShown && /CDN log forwarding is the customer's IT team's change: the partner creates the log job/.test(dCja)")
    open(P, 'w', encoding='utf-8').write(s)
    print('test_review_nov2.js: step 45 second round applied')
