"""Step 45 test updates (Nov 4 2026): the CDN starts on the canvas in every Brand Visibility play, so the checks that
counted a play's boxes, lines and starting totals without it now count it. Run once from sow/.

    python3 tests_step45.py
"""
import os
HERE = os.path.dirname(os.path.abspath(__file__))


def edit(rel, pairs):
    p = os.path.join(HERE, rel)
    s = open(p, encoding='utf-8').read()
    for a, b in pairs:
        assert s.count(a) == 1, (rel, a[:80])
        s = s.replace(a, b)
    open(p, 'w', encoding='utf-8').write(s)


edit('canvas/test_canvas.js', [
    ("JSON.stringify(await nodes(p)) === JSON.stringify(['bv', 'eds', 'so']), 'picking a play\\'s box puts its products on the canvas'",
     "JSON.stringify(await nodes(p)) === JSON.stringify(['bv', 'cdn', 'eds', 'so']), 'picking a play\\'s box puts its products on the canvas, and the CDN (step 45: on from the start)'"),
    ("JSON.stringify(await edges(p)) === JSON.stringify(['bv-eds', 'so-eds']) && (await p.$$('.ib')).length === 2, 'they connect themselves, an i on each connection'",
     "JSON.stringify(await edges(p)) === JSON.stringify(['bv-eds', 'cdn-bv', 'so-eds']) && (await p.$$('.ib')).length === 3, 'they connect themselves, a lightning bolt on each connection'"),
    ("  const nodeText = await p.$$eval('.node', es => es.map(x => x.textContent.trim()));\n  ok(nodeText.every(x => !/\\$/.test(x)) && nodeText.every(x => /\\d+ services?$|Services on its connections$/.test(x)),",
     "  const nodeText = await p.$$eval('.node', es => es.map(x => x.textContent.trim())), adobeText = await p.$$eval('.node:not(.out)', es => es.map(x => x.textContent.trim()));\n"
     "  ok(nodeText.every(x => !/\\$/.test(x)) && adobeText.every(x => /\\d+ services?$|Services on its connections$/.test(x)) && nodeText.includes('CDNRecommended'),"),
    ("ok((await nodes(p)).length === 3 && await p.isHidden('#confirm'), 'Cancel keeps the play as it was');",
     "ok((await nodes(p)).length === 4 && await p.isHidden('#confirm'), 'Cancel keeps the play as it was');"),
    ("    const want = CAT.connections.filter(c => pl.products.includes(c.a) && pl.products.includes(c.b)).map(c => c.id).sort();\n"
     "    const tq = await read(q), eq = expected(pl.id);\n"
     "    ok(JSON.stringify(await nodes(q)) === JSON.stringify([...pl.products].sort())",
     "    const start = [...pl.products, ...(pl.ostart || [])], want = CAT.connections.filter(c => start.includes(c.a) && start.includes(c.b)).map(c => c.id).sort();   // step 45: the CDN starts on\n"
     "    const tq = await read(q), eq = expected(pl.id);\n"
     "    ok(JSON.stringify(await nodes(q)) === JSON.stringify([...start].sort())"),
    ("ok(t.big === money(e.yr) && t.big === money(expected('cja').yr), `Brand Visibility and CJA built by hand total the same as the CJA play (${t.big})`",
     "ok(t.big === money(e.yr) && t.big === money(expected('cja', 'base', 150, {}, ['bv', 'cja']).yr), `Brand Visibility and CJA built by hand total the same as the CJA play without its CDN (${t.big})`"),
])
edit('test_site.js', [
    ("(await p.$$('.node')).length === 3, 'Build goes back to the canvas as it was left');",
     "(await p.$$('.node')).length === 4, 'Build goes back to the canvas as it was left (with the CDN, on from the start)');"),
])
print('step 45 test updates applied')

# second round: the boxes on a phone and after a reload count the CDN; the outside connections include step 45's twelve;
# Create your own play's menu offers the new systems too
edit('canvas/test_canvas.js', [
    ("(await nodes(ph)).length === 3, 'on a phone a play still draws, with no sideways scroll');",
     "(await nodes(ph)).length === 4, 'on a phone a play still draws, with no sideways scroll');"),
    ("ok(OUTC.length === 4 && OUTC.every(c => c.kind === 'outside' && ['native', 'platform'].includes(c.line) && c.label && c.prereqs.length >= 3 && c.source && c.source.url && c.how),\n"
     "      `step 27: each outside system's connection",
     "ok(OUTC.length === 16 && OUTC.every(c => c.kind === 'outside' && ['native', 'platform'].includes(c.line) && c.label && c.prereqs.length >= (['cdn-bv', 'dwh-cja', 'cstore-cja', 'crm-cja'].includes(c.id) ? 3 : 1) && c.source && c.source.url && c.how),\n"
     "      `steps 27 and 45: each outside system's connection"),
    ("ok(a.length === 3 && JSON.stringify(a) === JSON.stringify(c), 'after a reload",
     "ok(a.length === 4 && JSON.stringify(a) === JSON.stringify(c), 'after a reload"),
    ("ok(items.length === 4 && ['dwh', 'cstore', 'crm'].every(id => items.some(x => x.id === id && /Connects to CJA/.test(x.t))) && items.some(x => x.wait && /Connects to Brand Visibility: add it first/.test(x.t)),\n"
     "      'S44: its menu offers the data warehouse, cloud storage and CRM for CJA, and says the CDN needs Brand Visibility first'",
     "ok(items.length === 9 && ['dwh', 'cstore', 'crm', 'ads', 'bi'].every(id => items.some(x => x.id === id && /Connects to CJA/.test(x.t))) && items.some(x => x.wait && /Connects to Brand Visibility: add it first/.test(x.t)),\n"
     "      'S44: its menu offers the data warehouse, cloud storage, CRM, ad platforms and BI tools for CJA (step 45), and says the CDN needs Brand Visibility first'"),
])
print('step 45 test updates, second round, applied')
