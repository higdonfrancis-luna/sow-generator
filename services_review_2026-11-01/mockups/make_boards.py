"""Proposal boards for Adam (Nov 1 2026): the starting services in each play, now and proposed (step 1), and who owns
SEO versus AI-answer work. Reads the live catalog, so names and hours are the tool's own.

    python3 sow/services_review_2026-11-01/mockups/make_boards.py      (from the repo root; then shoot.js makes the PNGs)
"""
import html
import json
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
OUT = os.path.dirname(os.path.abspath(__file__))
page = open(os.path.join(ROOT, 'sow', 'index.html'), encoding='utf-8').read()
CAT = {s['id']: s for s in json.loads(re.search(r'const CATALOG=(\[.*?\]);', page, re.S).group(1))}
STARTERS = {k: re.findall(r"'([\w-]+)'", v) for k, v in re.findall(r"(\w+):\[(.*?)\]", re.search(r"const STARTERS=\{(.*?)\};", page, re.S).group(1))}
FONT = 'file://' + os.path.join(ROOT, 'video', 'fonts', 'source-sans-3-latin-{}-normal.woff2')
E = html.escape

# what each starting service serves (the SEO versus AI-answer question)
TAG = {'L01': 'ai', 'L02': 'ai', 'L03': 'ai', 'O01': 'ai', 'C02': 'ai', 'C07': 'ai', 'O02': 'both', 'SO1': 'search', 'SO2': 'search',
       'A02': 'search', 'A04': 'site', 'A01': 'site', 'A03': 'site', 'A05': 'site', 'C03': 'pub', 'C05': 'pub', 'C01': 'measure',
       'C06': 'measure', 'F02': 'concierge', 'C04': 'concierge'}
TAGTXT = {'ai': 'AI answers', 'search': 'Search', 'both': 'Search and AI', 'site': 'Site build', 'pub': 'Publishing', 'measure': 'Measurement',
          'concierge': 'Concierge', 'cw': 'Coworker'}
NEWNAME = {'O02': 'Content improvements for search and AI'}
PLAYS = [('abv', 'Brand Visibility on its own'), ('cja', 'Brand Visibility + Customer Journey Analytics'), ('commerce', 'Brand Visibility + Adobe Commerce'),
         ('aem', 'Brand Visibility + Sites Optimizer and Edge Delivery Services'), ('fsi', 'Brand Visibility + Brand Concierge (FSI)'), ('coworker', 'Coworker on its own')]
# step 1 changes to the starting lists: (play, id) -> (mark, note)
CHANGE = {('commerce', 'L03'): ('addon', 'Add-on: C07 already sets up the edge route, so the default charged the route twice'),
          ('fsi', 'C04'): ('folded', 'Inside the concierge build when it is new; starts on only when Brand Concierge is live and healthy')}
NOTES = {'abv': 'No change to the starting list.',
         'cja': 'No change. Audiences (C06) stay on: your video and deck sell them. ChatGPT calls them optional; your call.',
         'commerce': 'The deployment pilot becomes an add-on.',
         'aem': 'No change to the starting list. Each SEO task now has one owner (next board).',
         'fsi': 'New concierge: the build takes in the Brand Visibility questions. Coworker add-ons wait for Adobe\'s written OK for the customer.',
         'coworker': 'No change. The one plugin (CW07) stays on: your deck sells it. ChatGPT calls it optional; your call.'}


def typ(i):
    s = CAT[i]
    return s['base'], s['unit']


def total(ids):
    one = sum(CAT[i]['base'] for i in ids if CAT[i]['unit'] != 'monthly')
    mon = sum(CAT[i]['base'] for i in ids if CAT[i]['unit'] == 'monthly')
    return (one + 12 * mon) * 150


def proposed(p):
    return [i for i in STARTERS[p] if (p, i) not in CHANGE]


CSS = f"""@font-face{{font-family:S3;src:url({FONT.format(400)})}}@font-face{{font-family:S3;font-weight:600;src:url({FONT.format(600)})}}@font-face{{font-family:S3;font-weight:700;src:url({FONT.format(700)})}}
*{{box-sizing:border-box}}body{{margin:0;background:#fff;color:#1c1c1c;font:15px/1.4 S3,Arial,sans-serif}}
.top{{height:6px;background:#EB1000}}.wrap{{padding:26px 34px 30px}}h1{{font-size:30px;margin:0 0 4px;font-weight:700}}.sub{{font-size:17px;margin:0 0 18px}}
.grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}}.card{{border:2px solid #1c1c1c;border-top:6px solid #EB1000;border-radius:6px;padding:14px 16px 12px}}
.card h2{{font-size:18px;margin:0 0 8px;font-weight:700;line-height:1.25}}.row{{display:flex;align-items:baseline;gap:8px;padding:4px 0;border-bottom:1px solid #d9d9d9;font-size:14.5px}}
.row:last-of-type{{border-bottom:0}}.id{{font-weight:700;min-width:44px}}.nm{{flex:1}}.h{{white-space:nowrap;font-weight:600}}
.tag{{display:inline-block;font-size:11.5px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;border:1.5px solid #1c1c1c;border-radius:3px;padding:0 5px;margin-left:6px;white-space:nowrap}}
.tag.ai{{border-color:#EB1000;color:#C40000}}.tag.both{{background:#EB1000;border-color:#EB1000;color:#fff}}.tag.search{{background:#1c1c1c;color:#fff}}
.row .nm s{{text-decoration-thickness:1.5px}}.why{{display:block;font-size:13px;color:#C40000;font-weight:600;text-decoration:none}}
.new{{display:block;font-size:13px;font-weight:700;color:#C40000}}.tot{{margin-top:8px;font-size:15px;font-weight:700}}.tot b{{color:#C40000}}.note{{font-size:13.5px;margin-top:4px}}
.legend{{display:flex;gap:16px;flex-wrap:wrap;margin:0 0 14px;font-size:14px;align-items:center}}.foot{{margin-top:16px;font-size:14px;border-top:2px solid #1c1c1c;padding-top:10px}}
.cols{{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}}.col{{border:2px solid #1c1c1c;border-radius:6px;padding:14px 16px}}.col.ai{{border-color:#EB1000}}
.col h2{{font-size:20px;margin:0 0 2px}}.col .k{{font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#C40000;margin-bottom:8px}}
.col ul{{margin:6px 0 0 18px;padding:0}}.col li{{margin:5px 0;font-size:15px}}.fact{{font-size:13.5px;margin-top:10px;border-left:3px solid #EB1000;padding-left:9px}}
.retire{{margin-top:16px;border:2px solid #EB1000;border-radius:6px;padding:12px 16px;font-size:15px}}.retire b{{color:#C40000}}
"""


def board_services():
    cards = []
    for p, label in PLAYS:
        rows = []
        for i in STARTERS[p]:
            h, u = typ(i)
            mark, why = CHANGE.get((p, i), ('', ''))
            tag = 'cw' if i.startswith('CW') else TAG.get(i, '')
            nm = f'<s>{E(CAT[i]["name"])}</s>' if mark else E(CAT[i]['name'])
            extra = f'<span class="new">Renamed: {E(NEWNAME[i])}</span>' if i in NEWNAME else ''
            rows.append(f'<div class="row {mark}"><span class="id">{E(i)}</span><span class="nm">{nm}{f"<span class=\"tag {tag}\">{TAGTXT[tag]}</span>" if tag else ""}{extra}{f"<span class=\"why\">{E(why)}</span>" if why else ""}</span>'
                        f'<span class="h">{h} h{" / mo" if u == "monthly" else ""}</span></div>')
        now, new = total(STARTERS[p]), total(proposed(p))
        tot = f'${now:,}' + (f' &rarr; <b>${new:,}</b>' if new != now else ' (no change)')
        live = ''
        if p == 'fsi':
            live = f'<div class="note">Concierge already live and healthy: ${total(["L01", "L02", "C04", "O01", "O02"]):,} (no change).</div>'
        cards.append(f'<div class="card"><h2>{E(label)}</h2>{"".join(rows)}<div class="tot">Typical: {tot}</div>{live}<div class="note">{E(NOTES[p])}</div></div>')
    cards.append('<div class="card"><h2>Create your own play (step 2)</h2><div class="note" style="font-size:15px">Today a product box or a connection line also turns on its research services: with all 14 products, '
                 '97 of the 124 services that start on are research services with placeholder hours.</div><div class="note" style="font-size:15px;margin-top:8px"><b>Proposed:</b> research services start off. A partner picks the ones it wants; '
                 'each shows <b>Discovery required</b> and adds no fee until it is written up.</div><div class="tot">All 14 products: $1,802,400 &rarr; <b>$715,800</b></div>'
                 '<div class="note">Mockup of the cards comes first, at step 2.</div></div>')
    legend = ''.join(f'<span><span class="tag {k}" style="margin-left:0">{v}</span></span>' for k, v in [('ai', 'AI answers'), ('search', 'Search'), ('both', 'Search and AI')])
    body = (f'<div class="top"></div><div class="wrap"><h1>Starting services by play: now and proposed</h1><p class="sub">Step 1. Typical hours; totals are implementation plus 12 months '
            f'at $150 an hour, for comparison only (the tool has no default rate). A struck line leaves the starting list but stays on offer.</p>'
            f'<div class="legend">What each service serves: {legend}<span>Every play: <b>Technical SEO and AI-search improvements (O03)</b> retires (it was optional).</span></div>'
            f'<div class="grid">{"".join(cards)}</div>'
            f'<div class="foot">Partners can still add their own services on the Services step. No service\'s hours change in step 1.</div></div>')
    return f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}</body></html>'


def board_owners():
    body = ('<div class="top"></div><div class="wrap"><h1>One owner for each piece of work: SEO versus AI answers</h1>'
            '<p class="sub">Where a change lands decides who owns it. Each piece of work is charged once, even when it helps both search and AI answers.</p>'
            '<div class="cols">'
            '<div class="col ai"><div class="k">Brand Visibility services</div><h2>AI answers</h2><ul>'
            '<li><b>L01, L02</b>: prompt strategy, setup and baseline</li><li><b>O01</b>: the one monthly readout; in the AEM play it also carries the search section from SO2</li>'
            '<li><b>L03</b>: edge pilot; <b>C02</b>: product pages, for AI assistants</li><li><b>O04, O07, O08, O09</b>: off-site work</li></ul>'
            '<div class="fact">Adobe: Brand Visibility\'s edge fixes reach only ChatGPT, Perplexity and Claude. People and search engines get the original page '
            '(Optimize at Edge overview, Aug 26 2026). So they are never SEO work.</div></div>'
            '<div class="col"><div class="k">Sites Optimizer services (AEM play)</div><h2>Search</h2><ul>'
            '<li><b>SO1</b>: setup, roles, Search Console in Sites Optimizer</li><li><b>SO2</b>: every fix on the AEM site each month, in one allowance: Sites Optimizer\'s own fixes, '
            'plus the site fixes Brand Visibility flags (robots.txt rules for AI crawlers, redirects for pages AI agents can\'t reach)</li>'
            '<li><b>A02</b>: titles, descriptions, structured data and redirects through launch</li></ul>'
            '<div class="fact">Adobe: Sites Optimizer puts its fixes into the page through AEM authoring, where people publish them (Deploying to author, Aug 19 2026). '
            'That helps Google and every assistant.</div></div>'
            '<div class="col"><div class="k">Shared, counted once</div><h2>Search and AI</h2><ul>'
            '<li><b>O02</b>, renamed <b>Content improvements for search and AI</b>: the only content line; each page change logged once</li>'
            '<li>One crawler-access request per site, in <b>L02</b></li><li>One Search Console access request; each product connects its own</li>'
            '<li>One publishing route per site: <b>C03</b> in the AEM play, <b>C05</b> elsewhere</li></ul>'
            '<div class="fact">Plays without Sites Optimizer (on its own, CJA, Commerce, FSI) have no SEO service. O01 hands site findings to the customer\'s web team, '
            'or the partner adds its own service.</div></div></div>'
            '<div class="retire"><b>Retires: Technical SEO and AI-search improvements (O03).</b> It put SEO under Brand Visibility, and in the AEM play it could charge '
            'Sites Optimizer\'s fixes a second time ($8,400 a month at Typical and $150). Partners who sell a full SEO program add it as their own service.</div></div>')
    return f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}</body></html>'


for name, doc in [('services_by_play.html', board_services()), ('seo_ai_owners.html', board_owners())]:
    assert '—' not in doc and '–' not in doc
    open(os.path.join(OUT, name), 'w', encoding='utf-8').write(doc)
print('boards written')
