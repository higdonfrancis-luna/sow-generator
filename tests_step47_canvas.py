"""Step 47, the canvas pass: the earlier checks that test behaviour this pass changed on purpose
(sow/audit_2026-11-05/FINDINGS.md items 3 and 26). Run once on the step 46 checks.
- 26: in focus view the first click on a product draws its lines and the second opens its card, and the card is placed
  where it covers neither its box nor the product's lightning bolts (beside it when that spot is clean, else above, below,
  a corner or the bottom), so the 13b check clicks twice and checks the card covers neither, instead of a fixed 30 px gap.
- 3: below 600 px the fee box shows its one-line total, so the line-style legend check moves from a phone to a tablet (768 px),
  where the hint is still hidden and the legend still shows under the total. On a phone the focus bar's names scroll sideways
  in one row, so the bar check on a phone checks that row (and the new Services button) sits inside the bar.

    python3 sow/tests_step47_canvas.py
"""
import os
HERE = os.path.dirname(os.path.abspath(__file__))


def patch(name, edits):
    p = os.path.join(HERE, name)
    t = open(p, encoding='utf-8').read()
    dashes = t.count('\u2014') + t.count('\u2013')
    for old, new, n in edits:
        assert t.count(old) == n, (name, t.count(old), old[:90])
        t = t.replace(old, new)
    assert t.count('\u2014') + t.count('\u2013') == dashes, 'no new dashes'
    open(p, 'w', encoding='utf-8').write(t)


patch('canvas/test_canvas.js', [
    ("  // 13b. in focus view a clicked product's card opens beside it and stays while the pointer travels to it\n",
     "  // 13b. in focus view the first click on a product draws its lines; the second opens its card, which covers neither the box nor its\n"
     "  // lightning bolts, and stays while the pointer travels to it (step 47)\n", 1),
    ("      await q.click(`.node[data-p=\"${id}\"]`); await q.waitForTimeout(500);\n"
     "      const nb = await q.$eval(`.node[data-p=\"${id}\"]`, n => { const r = n.getBoundingClientRect(); return {l: r.left, r: r.right}; });\n"
     "      const cb = await q.$eval('#card', n => { const r = n.getBoundingClientRect(); return {l: r.left, r: r.right}; });\n"
     "      const gap = Math.min(Math.abs(cb.l - nb.r), Math.abs(nb.l - cb.r));\n",
     "      await q.click(`.node[data-p=\"${id}\"]`); await q.waitForTimeout(500); const first = await q.isHidden('#card');\n"
     "      await q.click(`.node[data-p=\"${id}\"]`); await q.waitForTimeout(500);\n"
     "      const cover = await q.evaluate(id => { const c = document.getElementById('card').getBoundingClientRect(), hit = r => r.left < c.right && c.left < r.right && r.top < c.bottom && c.top < r.bottom;\n"
     "        return [document.querySelector(`.node[data-p=\"${id}\"]`), ...document.querySelectorAll('.ib')].filter(e => hit(e.getBoundingClientRect())).length; }, id);\n", 1),
    ("      ok(gap <= 30 && await q.isVisible('#card') && (await q.textContent('#card h4')).includes(P[id].title || P[id].name),\n"
     "        `${P[id].name}: in focus view its card opens beside the box (${Math.round(gap)} px) and stays open on the way to it`);\n",
     "      ok(first && cover === 0 && await q.isVisible('#card') && (await q.textContent('#card h4')).includes(P[id].title || P[id].name),\n"
     "        `${P[id].name}: in focus view the first click draws its lines, the second opens its card clear of the box and its bolts, and it stays open on the way to it`, `first ${first}, covers ${cover}`);\n", 1),
    ("    await q.click('.node[data-p=\"rtcdp\"]'); await q.waitForTimeout(500);\n",
     "    await q.click('.node[data-p=\"rtcdp\"]'); await q.waitForTimeout(300); await q.click('.node[data-p=\"rtcdp\"]'); await q.waitForTimeout(500);\n", 1),
    ("    await q.click('.node[data-p=\"cja\"]'); await q.waitForTimeout(700);\n"
     "    ok(await q.isVisible('#card') && (await q.textContent('#card h4')).includes('Customer Journey Analytics'), 'and product cards still open afterwards (with a click)');\n",
     "    await q.click('.node[data-p=\"cja\"]'); await q.waitForTimeout(400); await q.click('.node[data-p=\"cja\"]'); await q.waitForTimeout(700);\n"
     "    ok(await q.isVisible('#card') && (await q.textContent('#card h4')).includes('Customer Journey Analytics'), 'and product cards still open afterwards (a second click, step 47)');\n", 1),
    ("    const pq = await fresh(390, 844); await pq.goto(CANVAS); await choose(pq, 'fsi');\n"
     "    const lg = (await pq.textContent('#t-legend')).trim();\n"
     "    ok(await pq.isVisible('#t-legend') && lg.startsWith('Lines:') && lg.includes('dashed partner-designed workflow') && await pq.evaluate(() => document.documentElement.scrollWidth) <= 390,\n"
     "      'on a phone, where the hint is hidden, the line-style legend shows under the total', lg);\n",
     "    const pq = await fresh(768, 1024); await pq.goto(CANVAS); await choose(pq, 'fsi');\n"
     "    const lg = (await pq.textContent('#t-legend')).trim();\n"
     "    ok(await pq.isVisible('#t-legend') && lg.startsWith('Lines:') && lg.includes('dashed partner-designed workflow') && await pq.evaluate(() => document.documentElement.scrollWidth) <= 768,\n"
     "      'on a tablet, where the hint is hidden, the line-style legend shows under the total (step 47: a phone shows the one-line total)', lg);\n", 1),
    ("    const parts = [document.querySelector('#fbar .fi'), document.querySelector('#fbar .fl'), ...document.querySelectorAll('#fb-m > *'), document.getElementById('fb-clear')].filter(e => e && !e.hidden);\n",
     "    // step 47: on a phone the names scroll sideways in one row, so the row itself must sit inside the bar\n"
     "    const fm = document.getElementById('fb-m'), rolls = getComputedStyle(fm).overflowX === 'auto' && fm.scrollWidth > fm.clientWidth;\n"
     "    const parts = [document.querySelector('#fbar .fi'), document.querySelector('#fbar .fl'), ...(rolls ? [fm] : document.querySelectorAll('#fb-m > *')), document.getElementById('fb-svc'), document.getElementById('fb-clear')].filter(e => e && !e.hidden);\n", 1),
])
print('step 47 canvas-pass checks updated: focus view opens a card on the second click, clear of the box and its bolts')
