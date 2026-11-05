"""Step 48, the canvas checks (Nov 5 2026, Adam: "Let's fix what we know that needs to be fixed and then we have to be ready
to ship it"): the step 47 checks that test behaviour step 48 changed on purpose (sow/canvas/patch_step48.py and
sow/canvas/data_step48.py), and the new checks for its three canvas fixes. Run once on the step 47 checks.
- fix 5: the banking and insurance problem no longer has the "My client wants conversation summaries" chip, so item 8's check
  (that chip's note carries Adobe's finance exclusion) becomes: the problem offers no chip that adds Coworker, and its
  Marketo Engage, AEM Sites and CJA chips stay. A new check types the banking question, picks the CJA chip and finds no
  Coworker chip on the way.
- fix 2: a card opens at least min(600 px, its own height) tall, so the 23b judge looks for a clean spot of that height
  (not 220 px), counts the window below the tabs as the room while the canvas is marked tall, and adds the new rules:
  every card that isn't docked is that tall wherever a spot that tall clears its anchor and the selected product's bolts
  (elsewhere the step 47 heights stay), opens scrolled to its top and shows its close X. 23b also runs at the laptop
  sizes of the rehearsal (1536x864, 1280x800). A new check opens the Brand Visibility + CJA lightning bolt at 1440x900,
  1536x864 and 1280x800, as the rehearsal did.
- fix 4: a new check: "Also needs Real-Time CDP or Journey Optimizer" shows on the CJA play, where neither is on the
  canvas, and leaves when either is on a custom canvas; Audiences that act on the data stays counted on the CJA play.

    python3 sow/tests_step48_canvas.py [folder that holds test_step47.js, default sow/]
"""
import os, sys
HERE = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))


def patch(name, edits):
    p = os.path.join(HERE, name)
    t = open(p, encoding='utf-8').read()
    dashes = t.count('\u2014') + t.count('\u2013')
    for old, new, n in edits:
        assert t.count(old) == n, (name, t.count(old), old[:90])
        t = t.replace(old, new)
    assert t.count('\u2014') + t.count('\u2013') == dashes, 'no new dashes'
    open(p, 'w', encoding='utf-8').write(t)


ANCHOR = "  // (later passes of step 47 add their sections above this line)\n"
NEW = r"""  // 30. (step 48, fix 2) the rehearsal's card: the Brand Visibility + CJA lightning bolt opens a card tall enough to read
  // at laptop sizes, inside the window below the tabs, scrolled to its top with its close X showing, clear of its bolt
  for (const [w, h] of [[1440, 900], [1536, 864], [1280, 800]]) { const p = await fresh({width: w, height: h}); await pick(p, 'cja'); await p.fill('#rate', '150');
    await p.click('.ib[data-c="bv-cja"]'); await p.waitForTimeout(400);
    const r = await p.evaluate(() => { const c = document.getElementById('card'), cr = c.getBoundingClientRect(), tb = document.querySelector('.tabs').getBoundingClientRect(), x = c.querySelector('.close').getBoundingClientRect();
      const at = e => { const q = e.getBoundingClientRect(), k = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return !!k && e.contains(k); };
      return {h: Math.round(cr.height), top: Math.round(cr.top), bottom: Math.round(cr.bottom), tabs: Math.round(tb.bottom), ih: innerHeight, st: c.scrollTop, x: x.top >= cr.top && at(c.querySelector('.close')), bolt: at(document.querySelector('.ib[data-c="bv-cja"]'))}; });
    ok(r.h >= 600 && r.top >= r.tabs && r.bottom <= r.ih && r.st === 0 && r.x && r.bolt, `step 48 fix 2: at ${w}x${h} the Brand Visibility + CJA card opens ${r.h} px tall (was 220), below the tabs and inside the window, at its top with its close X, its bolt clear`, JSON.stringify(r));
    await p.context().close(); }
  // 31. (step 48, fix 4) "Also needs Real-Time CDP or Journey Optimizer" shows only while neither is on the canvas
  { const p = await fresh(); await pick(p, 'cja'); await p.fill('#rate', '150');
    const need = () => p.evaluate(() => { hideCard(true); showCard('p', 'cja'); const l = document.querySelector('#card [data-l="C06"]'); return l ? l.textContent : 'no line'; });
    const cja = await need(), on = await p.evaluate(() => counted('C06'));
    await p.evaluate(() => localStorage.clear()); await pick(p, 'custom'); await p.evaluate(() => { for (const id of ['bv', 'cja']) addProduct(id); openAdd(false); }); await p.waitForTimeout(300); const none = await need();
    await p.evaluate(() => { addProduct('rtcdp'); openAdd(false); }); await p.waitForTimeout(300); const rt = await need();
    await p.evaluate(() => { removeProduct('rtcdp'); addProduct('ajo'); openAdd(false); }); await p.waitForTimeout(300); const jo = await need();
    ok(cja.includes('Also needs Real-Time CDP or Journey Optimizer') && on && none.includes('Also needs') && !rt.includes('Also needs') && !jo.includes('Also needs'),
      'step 48 fix 4: Audiences that act on the data says Also needs Real-Time CDP or Journey Optimizer on the CJA play (still counted there) and on a canvas without either, and not once Real-Time CDP or Journey Optimizer is on it', JSON.stringify({cja, on, none, rt, jo}).slice(0, 500));
    await p.context().close(); }
  // 32. (step 48, fix 5) the banking question offers no Coworker chip, before or after the CJA chip
  { const p = await fresh(); await p.goto(BASE); await p.waitForTimeout(400);
    await p.fill('#bp-q', 'banking customers call about rates'); await p.press('#bp-q', 'Enter'); await p.waitForSelector('#bp-body .bp-ans', {timeout: 5000}); await p.waitForTimeout(950);
    const chips = () => p.$$eval('[data-bpr]', es => es.map(e => e.textContent)); const first = await chips();
    await p.click('[data-bpr]:has-text("My client licenses CJA")'); await p.waitForTimeout(1200); const then = await chips();
    const cw = await p.evaluate(() => document.querySelector('.bp-ans:last-of-type .bp-prods').textContent);
    ok(first.includes('My client licenses CJA') && ![...first, ...then].some(c => /conversation summaries|Coworker/.test(c)) && !cw.includes('Coworker'),
      'step 48 fix 5: the banking question offers no chip that adds Coworker, before or after My client licenses CJA, and recommends no Coworker', JSON.stringify({first, then, cw}).slice(0, 500));
    await p.context().close(); }

"""

patch('test_step47.js', [
    # fix 5: item 8's chip is gone
    ("  // 17. (item 8) the FSI conversation summaries chip says Adobe doesn't currently offer Coworker to finance organizations\n"
     "  { const p = await fresh(); await p.goto(BASE); await p.waitForTimeout(300);\n"
     "    const n = await p.evaluate(() => PROBS.find(x => x.id === 'fsi-complex-questions').refine.find(r => r.chip === 'My client wants conversation summaries').note);\n"
     "    ok(/not currently offered to health care, finance or some other industries, so confirm eligibility with Adobe/.test(n) && /compatible applications list/.test(n), 'item 8: the FSI chip that adds Coworker carries Adobe\\'s finance exclusion', n);\n",
     "  // 17. (item 8, step 48 fix 5) the banking and insurance problem offers no chip that adds Coworker, which Adobe doesn't currently offer to finance organizations\n"
     "  { const p = await fresh(); await p.goto(BASE); await p.waitForTimeout(300);\n"
     "    const n = await p.evaluate(() => PROBS.find(x => x.id === 'fsi-complex-questions').refine.map(r => r.chip + (r.add.includes('cw') ? ' (adds Coworker)' : '')));\n"
     "    ok(n.join('|') === \"My client runs Marketo Engage|My client's site is on AEM Sites|My client licenses CJA\", 'step 48 fix 5: the banking and insurance problem offers no chip that adds Coworker; its Marketo Engage, AEM Sites and CJA chips stay', n.join(' | '));\n", 1),
    # fix 2: the 23b judge
    ("  // 23b. (item 26, the card pass) at 1440x900, 1600x950, 1920x1080 and 768x1024 on every play, Create your own play with all 14\n",
     "  // 23b. (item 26, the card pass; step 48 adds 1536x864 and 1280x800) at 1440x900, 1536x864, 1280x800, 1600x950, 1920x1080 and\n"
     "  // 768x1024 on every play, Create your own play with all 14\n", 1),
    ("  // bolts, every such bolt answers elementFromPoint; wherever a spot covers no box at all, the card covers no box\n",
     "  // bolts, every such bolt answers elementFromPoint; wherever a spot covers no box at all, the card covers no box. Step 48: a card\n"
     "  // that isn't docked is at least min(600 px, its own height, the room) tall wherever a spot that tall clears its anchor and the\n"
     "  // selected product's bolts, opens at its top and shows its close X; while the canvas is marked tall the room is the window\n"
     "  // below the tabs\n", 1),
    ("      const V = {l: Math.max(cv.left, 0), r: Math.min(cv.right, innerWidth), t: Math.max(cv.top, 0) + (F ? document.getElementById('fbar').offsetHeight : 0), b: Math.min(cv.bottom, innerHeight)};\n",
     "      const tall = document.getElementById('canvas').classList.contains('tall');\n"
     "      const V = {l: Math.max(cv.left, 0), r: Math.min(cv.right, innerWidth), t: tall ? Math.max(document.querySelector('.tabs').getBoundingClientRect().bottom, 0) : Math.max(cv.top, 0) + (F ? document.getElementById('fbar').offsetHeight : 0), b: Math.min(cv.bottom, innerHeight)};\n", 1),
    ("      const w = cr.width, h = Math.min(cr.height, 220); let cH = false, cB = false;\n",
     "      const w = cr.width, h = Math.min(cr.height, 600); let cH = false, cB = false;\n", 1),
    ("      if (cB && boxes.some(k => hit(cr, k))) bad.push('covers a box with a clear spot free');\n",
     "      if (cB && boxes.some(k => hit(cr, k))) bad.push('covers a box with a clear spot free');\n"
     "      const fl = Math.min(c.scrollHeight + 8, 600, V.b - V.t - 20); let cT = false;\n"
     "      for (let x = V.l + 10; x <= V.r - 10 - w && !cT; x += 6) for (let y = V.t + 10; y <= V.b - 10 - fl; y += 6) if (!hard.some(k => hit({left: x, top: y, right: x + w, bottom: y + fl}, k, 4))) { cT = true; break; }\n"
     "      if (!c.classList.contains('dock') && cT && cr.height < fl - 2) bad.push('short ' + Math.round(cr.height) + ' of ' + (c.scrollHeight + 8));\n"
     "      if (c.scrollTop) bad.push('opens scrolled'); if (!at(c.querySelector('.close'))) bad.push('close X hidden');\n", 1),
    ("    for (const [w, h] of [[1440, 900], [1600, 950], [1920, 1080], [768, 1024]]) { const bad = []; let n = 0;\n",
     "    for (const [w, h] of [[1440, 900], [1536, 864], [1280, 800], [1600, 950], [1920, 1080], [768, 1024]]) { const bad = []; let n = 0;\n", 1),
    # the new step 48 checks, above the line later passes add theirs above
    (ANCHOR, NEW + ANCHOR, 1),
])
print('step 48 canvas checks: item 8 becomes no Coworker chip on the banking problem, the 23b judge expects tall cards, three new checks')
