"""The catalog expansion map (Nov 10 2026, Adam: "yes, make the map and the picker mockup"). Research and pictures only:
nothing here is read by the tool, and the catalog is not changed.

Reads the catalog (canvas/catalog.json), the Oct 30 portal research (canvas/research/portal_*.json), the four family files in
this folder and plan.json (which products are proposed, under which of Adobe's menu headings, in which wave), and writes:

  expansion_map.json                               one row per product: where it stands, its Brand Visibility tie, its connections
  ../../../mockups/nov10_expansion/expansion_map.html   the one-page map (render it to PNG with render_map.js)
  ../../../mockups/nov10_expansion/picker_data.json     the product list and connection counts the picker mockup shows

Run from the repo root:  python3 sow/canvas/research/expansion_2026-11-10/build_map.py
"""
import html
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SOW = os.path.normpath(os.path.join(HERE, '..', '..', '..'))
OUT = os.path.join(SOW, 'mockups', 'nov10_expansion')
os.makedirs(OUT, exist_ok=True)
load = lambda *p: json.load(open(os.path.join(*p), encoding='utf-8'))

CAT = load(SOW, 'canvas', 'catalog.json')
PLAN = load(HERE, 'plan.json')
FAMILIES = ['aem_documents', 'genstudio_creative', 'platform_data_campaign', 'brand_visibility_side']
ALIAS = PLAN['alias']                      # a helper's own id for a product -> the id this map uses
key = lambda i: ALIAS.get(i, i)

# ---- the products: the catalog's Adobe products, the six researched on Oct 30, and the proposed ones ----
P = {}                                     # id -> row
for g in PLAN['groups']:
    for it in g['products']:
        P[it['id']] = dict(id=it['id'], name=it['name'], group=g['name'], wave=it.get('wave'), stands=it['stands'],
                           note=it.get('note', ''), bv=None, links={})
on_canvas = {p['id'] for p in CAT['products'] if not p.get('outside')}
for i in on_canvas:
    assert i in P and P[i]['stands'] == 'canvas', ('a catalog product is missing from plan.json', i)

def link(a, b, how, url, where, verified=True):
    """One documented connection, kept once per pair with its first source."""
    a, b = key(a), key(b)
    if a == b or a not in P or b not in P:
        return
    for x, y in ((a, b), (b, a)):
        P[x]['links'].setdefault(y, dict(how=how, url=url, where=where, verified=verified))

# 1. the catalog's own connections between Adobe products
for c in CAT['connections']:
    if c['a'] in on_canvas and c['b'] in on_canvas:
        link(c['a'], c['b'], c.get('how', ''), (c.get('source') or {}).get('url', ''), 'catalog')
# 2. the Oct 30 portal research (a pair documented only as a product-page bullet with no services is left out, as it was then)
for f in ('portal_omnichannel_b2b', 'portal_acquisition_insights'):
    for c in load(SOW, 'canvas', 'research', f + '.json')['connections']:
        if not c.get('no_services'):
            link(c['a'], c['b'], c.get('how', ''), (c.get('source') or {}).get('url', ''), 'oct30')
# 3. this pass
unverified = []
for f in FAMILIES:
    for p in load(HERE, f + '.json')['products']:
        pid = key(p['id'])
        for c in p.get('connections', []):
            if PLAN['drop'].get(f"{pid}|{key(c['to'])}"):
                continue
            if not c.get('verified'):
                unverified.append((pid, c['to'], c.get('url', '')))
                continue
            link(pid, c['to'], c.get('how', ''), c.get('url', ''), 'nov10')
        bv = p.get('bv') or {}
        if pid in P and pid != 'bv' and bv.get('documented') and bv.get('verified'):
            link(pid, 'bv', bv.get('how', ''), bv.get('url', ''), 'nov10')
for pair, x in PLAN.get('add', {}).items():   # a connection read by hand after the helpers, each with its page
    a, b = pair.split('|')
    link(a, b, x['how'], x['url'], 'nov10')

PLAYS = [('cja', 'CJA play', ['cja']), ('commerce', 'Commerce play', ['commerce']), ('aem', 'Sites Optimizer and Edge Delivery play', ['so', 'eds']),
         ('fsi', 'Brand Concierge play', ['bc'])]
rows = []
for g in PLAN['groups']:
    for it in g['products']:
        p = P[it['id']]
        p['bv'] = p['links'].get('bv')
        p['plays'] = [name for _, name, prods in PLAYS if any(q in p['links'] for q in prods)] if p['id'] != 'bv' else []
        rows.append(p)
json.dump(dict(checked=PLAN['checked'], rows=[dict(id=p['id'], name=p['name'], group=p['group'], stands=p['stands'], wave=p['wave'], note=p['note'],
                                                bv=p['bv'], connects=sorted(p['links']), plays=p['plays']) for p in rows], unverified=unverified),
          open(os.path.join(HERE, 'expansion_map.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)

# ---- the picker mockup's data: every proposed product, how many of the others it connects to ----
shown = [p for p in rows if p['wave'] != 'out']
ids = {p['id'] for p in shown}
canvas = PLAN['picker_canvas']
json.dump(dict(canvas=canvas, typed=PLAN['picker_typed'], groups=[dict(name=g['name'], products=[
    dict(id=p['id'], name=p['name'], isNew=p['stands'] != 'canvas', n=len([q for q in p['links'] if q in ids]), to=[q for q in canvas if q in p['links']])
    for p in shown if p['group'] == g['name']]) for g in PLAN['groups']]), open(os.path.join(OUT, 'picker_data.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)

# ---- the map ----
e = html.escape
short = PLAN['short']
nm = lambda i: short.get(i, P[i]['name'])
STANDS = {'canvas': ('On the canvas', 's-on'), 'oct30': ('Researched Oct 30', 's-res'), 'new': ('New', 's-new')}
WAVE = {1: 'Wave 1', 2: 'Wave 2', 3: 'Wave 3', 4: 'Wave 4', 'out': 'Leave out', None: ''}
CHECK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EB1000" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
NONE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1C1C1C" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>'

def chip(i):
    c = 'chip new' if P[i]['stands'] != 'canvas' else 'chip'
    return f'<span class="{c}">{e(nm(i))}</span>'

def tr(p):
    lab, cls = STANDS[p['stands']]
    if p['id'] == 'bv':
        bv = '<td class="bv self">The product this tool is built to sell</td>'
    elif p['bv']:
        bv = f'<td class="bv yes">{CHECK}<span><b>Documented.</b> {e(PLAN["bv_words"].get(p["id"], p["bv"]["how"]))}</span></td>'
    else:
        bv = f'<td class="bv no">{NONE}<span>None documented</span></td>'
    order = sorted((q for q in p['links'] if q != 'bv'), key=lambda q: (P[q]['stands'] != 'canvas', nm(q)))
    con = ''.join(chip(q) for q in order) or '<span class="plain">None documented yet</span>'
    plays = ''.join(f'<span class="play">{e(x)}</span>' for x in p['plays']) or ('<span class="plain">All of them</span>' if p['id'] == 'bv' else '<span class="plain">Your own play</span>')
    wave = '' if p['stands'] == 'canvas' else f'<span class="wave w{p["wave"]}">{WAVE[p["wave"]]}</span>'
    note = f'<div class="note">{e(p["note"])}</div>' if p['note'] else ''
    return f'<tr><td class="pn"><b>{e(p["name"])}</b>{note}</td><td><span class="st {cls}">{lab}</span></td>{bv}<td class="con">{con}</td><td class="pl">{plays}</td><td class="wv">{wave}</td></tr>'

body = ''
for g in PLAN['groups']:
    rs = [p for p in rows if p['group'] == g['name']]
    body += f'<tr class="grp"><td colspan="6">{e(g["name"])}<span>{len(rs)} products</span></td></tr>' + ''.join(tr(p) for p in rs)

new = [p for p in rows if p['stands'] != 'canvas' and p['wave'] != 'out']
pairs = lambda sel: len({tuple(sorted((p['id'], q))) for p in rows if sel(p) for q in p['links'] if sel(P[q])})
today, after = pairs(lambda p: p['stands'] == 'canvas'), pairs(lambda p: p['wave'] != 'out')
tied = [p for p in new if p['bv']]
tiles = [(f'{len(on_canvas)} to {len(on_canvas) + len(new)}', 'Adobe products in the picker'),
         (f'{today} to {after}', 'connections Adobe documents between them'),
         (str(len(tied)), 'of the new products have a documented tie to Brand Visibility'),
         ('6', 'plays on the front page, unchanged')]
page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Catalog expansion map</title>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>
*{{box-sizing:border-box}}body{{margin:0;background:#fff;color:#1C1C1C;font-family:"Source Sans 3","Source Sans Pro",Arial,sans-serif;font-size:16px;line-height:22px}}
.bar{{height:8px;background:#EB1000}}.wrap{{width:1760px;padding:30px 44px 40px}}
h1{{font-size:38px;line-height:44px;margin:0;font-weight:900}}.sub{{font-size:19px;line-height:27px;margin:8px 0 0;max-width:1300px;color:#1C1C1C}}
.eyebrow{{font-size:14px;font-weight:700;letter-spacing:1.8px;color:#B30B00;text-transform:uppercase;margin:0 0 6px}}
.tiles{{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin:26px 0 8px}}
.tile{{border:2px solid #1C1C1C;border-top:6px solid #EB1000;border-radius:12px;padding:14px 20px 16px}}.tile b{{display:block;font-size:34px;line-height:40px;font-weight:900}}.tile span{{font-size:17px;line-height:23px}}
.key{{display:flex;flex-wrap:wrap;gap:8px 26px;align-items:center;margin:22px 0 10px;font-size:16px}}.key div{{display:flex;align-items:center;gap:8px}}
table{{border-collapse:collapse;width:100%;margin-top:6px}}th{{text-align:left;font-size:13.5px;letter-spacing:1.4px;text-transform:uppercase;font-weight:700;padding:10px 12px;border-bottom:2px solid #1C1C1C;vertical-align:bottom}}
td{{padding:9px 12px;border-bottom:1px solid #D5D5D5;vertical-align:top}}
tr.grp td{{background:#1C1C1C;color:#fff;font-weight:700;font-size:17px;letter-spacing:.3px;padding:8px 12px;border-bottom:0}}tr.grp td span{{font-weight:600;font-size:15px;margin-left:12px}}
.pn{{width:270px}}.pn b{{font-size:17.5px}}.note{{font-size:14.5px;line-height:19px;margin-top:2px;color:#1C1C1C}}
.st{{display:inline-block;font-size:13.5px;font-weight:700;border-radius:999px;padding:1px 11px;line-height:22px;white-space:nowrap;border:1.5px solid #1C1C1C}}
.s-on{{background:#1C1C1C;color:#fff}}.s-res{{background:#fff;color:#1C1C1C}}.s-new{{background:#fff;color:#B30B00;border-color:#B30B00}}
.bv{{width:400px}}.bv svg{{flex:none;margin-top:2px}}td.bv.yes,td.bv.no{{}}.bv>span{{display:inline}}
td.bv{{font-size:15.5px;line-height:21px}}td.bv.yes{{background:#FFF1EF}}td.bv.self{{font-weight:700;color:#B30B00}}
td.bv svg{{float:left;margin-right:8px}}td.bv span{{display:block;overflow:hidden}}
.con{{width:470px}}.chip{{display:inline-block;font-size:14px;font-weight:600;border:1.5px solid #1C1C1C;border-radius:999px;padding:0 10px;line-height:22px;margin:0 6px 5px 0;white-space:nowrap}}
.chip.new{{border-color:#B30B00;color:#B30B00}}.plain{{font-size:15.5px}}
.pl{{width:250px}}.play{{display:block;font-size:14.5px;font-weight:600;line-height:20px}}
.wv{{width:110px}}.wave{{display:inline-block;font-size:13.5px;font-weight:700;border-radius:6px;padding:1px 10px;line-height:22px;white-space:nowrap;border:1.5px solid #1C1C1C}}
.w1{{background:#EB1000;border-color:#EB1000;color:#fff}}.w2{{background:#1C1C1C;color:#fff}}.w3{{background:#fff}}.w4{{background:#fff;border-style:dashed}}.wout{{background:#F0F0F0}}
.foot{{font-size:15.5px;line-height:22px;margin-top:20px;max-width:1500px}}.foot p{{margin:0 0 6px}}
</style></head><body><div class="bar"></div><div class="wrap">
<p class="eyebrow">Partner SOW tool and RFI Builder: proposal, {e(PLAN["checked_words"])}</p>
<h1>Catalog expansion map</h1>
<p class="sub">Every product from Adobe's menu, what Adobe's own documentation says it connects to, and its tie to Brand Visibility. The front page keeps its six plays. The new products join the Create your own play picker and the RFI Builder's answers.</p>
<div class="tiles">{''.join(f'<div class="tile"><b>{e(a)}</b><span>{e(b)}</span></div>' for a, b in tiles)}</div>
<div class="key"><div><span class="st s-on">On the canvas</span> in the tool today</div><div><span class="st s-res">Researched Oct 30</span> services and sources already written</div><div><span class="st s-new">New</span> first read on Nov 10</div>
<div><span class="chip">Product</span> on the canvas today</div><div><span class="chip new">Product</span> proposed</div></div>
<table><thead><tr><th>Product</th><th>Where it stands</th><th>Tie to Brand Visibility</th><th>Adobe documents a connection to</th><th>Adds to these plays</th><th>When</th></tr></thead><tbody>{body}</tbody></table>
<div class="foot">{''.join(f'<p>{e(x)}</p>' for x in PLAN['foot'])}</div>
</div></body></html>'''
assert '—' not in page and '–' not in page, 'a dash crept into the map'
open(os.path.join(OUT, 'expansion_map.html'), 'w', encoding='utf-8').write(page)
print(f'{len(rows)} products ({len(on_canvas)} on the canvas, {len(new)} proposed), {today} to {after} documented pairs, {len(tied)} new ties to Brand Visibility, {len(unverified)} unverified connections left out')
