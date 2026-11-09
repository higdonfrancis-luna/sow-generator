"""Builds the shareable "where the knowledge comes from" page for the RFP Builder's knowledge base (Adam, Nov 9 2026: people at
Adobe will ask where the answers come from). Reads sow/rfp_facts.json, so the shares, counts and links always match what the tool
uses. Run from the repo root:

    python3 sow/rfp_prototype/part3_research/sources_page/build_sources_page.py

Writes sources.html beside this script; it is published as a private claude.ai page Adam can share.
"""
import collections, html, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(HERE))))
F = json.load(open(os.path.join(ROOT, 'sow', 'rfp_facts.json'), encoding='utf-8'))

# each kind of Adobe source: how a URL is recognized, its name, and why the knowledge base uses it
KINDS = [
    ('el', lambda u: 'experienceleague.adobe.com' in u, 'Experience League',
     'Adobe\'s official product documentation, written and kept current by Adobe\'s product teams. It documents, product by product, where each one is hosted and which regions it offers, how it encrypts data, how people sign in, how privacy requests and consent are handled, and how backups and restores work. Most answers start here because it is the most specific source for each product and it changes as the products change.'),
    ('pd', lambda u: 'helpx.adobe.com/legal/product-descriptions' in u, 'Adobe product descriptions',
     'Adobe\'s legal product descriptions on helpx.adobe.com define what each license includes. They are the source for licensing rules (Sites Optimizer is licensed only with AEM Sites; form features on a site need an AEM Forms license) and for service-level options such as AEM Sites\' 99.99% option. How each product is metered stays in the partner\'s notes and never reaches the client.'),
    ('live', lambda u: 'aem.live' in u, 'aem.live',
     'Adobe\'s official documentation site for Edge Delivery Services, run by the AEM team. It covers Edge Delivery\'s security, data residency, delivery architecture and operations in more depth than Experience League does.'),
    ('trust', lambda u: 'compliance-list' in u, 'Adobe Trust Center: compliance list',
     'The Trust Center lists the certifications and attestations each Adobe offering holds, so it is the authority for certification questions: SOC 2 Type 2, SOC 3, the ISO standards, CSA STAR and GLBA ready. Adobe\'s site turns away automated readers, so the tool uses a copy of the page saved from a browser; Adobe dates the page May 21, 2026.'),
    ('bcso', lambda u: 'brand-concierge-security-overview' in u, 'Adobe Trust Center: Brand Concierge security overview',
     'Adobe\'s public security white paper for Brand Concierge, posted on the Trust Center. It covers encryption in transit and at rest, how long conversation history is kept, and how customer data is used.'),
    ('help', lambda u: 'helpx.adobe.com' in u, 'Adobe Help',
     'Adobe\'s Admin Console help pages. They explain single sign-on across Adobe products: Federated IDs with any SAML 2.0 identity provider such as Okta, and Microsoft Entra ID.'),
    ('dev', lambda u: 'developer.adobe.com' in u, 'Adobe Developer',
     'Adobe\'s developer documentation for Cloud Manager, which lists the regions an AEM as a Cloud Service environment can be created in.'),
]
def kind(u):
    for k in KINDS:
        if k[1](u):
            return k
    raise SystemExit('No kind for ' + u)

src = F['sources']
cites, pages = collections.Counter(), collections.defaultdict(collections.Counter)
for st in F['statements']:
    for i in st['src']:
        k = kind(src[i]['url'])[0]
        cites[k] += 1
        pages[k][i] += 1
total = sum(cites.values())
order = sorted([k for k in KINDS if cites[k[0]]], key=lambda k: -cites[k[0]])
el_share = round(100 * cites['el'] / total)
checked = F['checked']
months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
y, m, d = checked.split('-')
checked_text = months[int(m) - 1] + ' ' + str(int(d)) + ', ' + y
e = html.escape

rows = []
for k in order:
    key, _, name, why = k
    share = 100 * cites[key] / total
    links = ''.join(
        '<li><a href="%s" target="_blank" rel="noopener">%s</a><span class="uses">%d %s</span></li>' % (
            e(src[i]['url']), e(src[i]['title']), n, 'sentence' if n == 1 else 'sentences')
        for i, n in sorted(pages[key].items(), key=lambda x: (-x[1], src[x[0]]['title'])))
    rows.append('''
<details class="src" id="src-%s">
 <summary>
  <span class="name">%s</span>
  <span class="bar" aria-hidden="true"><span style="width:%.1f%%"></span></span>
  <span class="pct">%d%%</span>
  <span class="meta">%d %s, %d %s</span>
 </summary>
 <div class="body">
  <p>%s</p>
  <ul class="links">%s</ul>
 </div>
</details>''' % (key, e(name), share, round(share), len(pages[key]), 'page' if len(pages[key]) == 1 else 'pages', cites[key], 'citation' if cites[key] == 1 else 'citations', e(why), links))

page = '''<title>RFP Builder Knowledge Sources</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&amp;display=swap">
<style>
/* Layout: one reading column; the sources are an expandable ledger, each row a bar of its share of citations */
:root{
 --bg:#FFFFFF; --fg:#1C1C1C; --muted-line:#E3DEDD; --soft:#F6F3F2; --accent:#EB1000; --link:#C40D00; --track:#EFE9E8;
 --font:"Source Sans 3", "Helvetica Neue", Arial, sans-serif;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#161414;--fg:#F4F1F0;--muted-line:#3A3433;--soft:#211D1D;--accent:#FF4A3D;--link:#FF7A70;--track:#2E2827;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#161414;--fg:#F4F1F0;--muted-line:#3A3433;--soft:#211D1D;--accent:#FF4A3D;--link:#FF7A70;--track:#2E2827;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font-family:var(--font);font-size:17px;line-height:1.55;padding-left:max(16px, env(safe-area-inset-left, 0px));padding-right:max(16px, env(safe-area-inset-right, 0px));padding-block:40px 64px}
.wrap{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:36px}
.eyebrow{font-size:13px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:var(--accent);margin:0 0 8px}
h1{font-size:clamp(28px,5vw,40px);line-height:1.15;margin:0 0 14px;text-wrap:balance}
h2{font-size:22px;margin:0 0 12px;text-wrap:balance}
.lead{font-size:19px;margin:0;max-width:62ch}
.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:22px}
.stat{border:1.5px solid var(--muted-line);border-radius:14px;padding:12px 14px}
.stat b{display:block;font-size:28px;line-height:1.1;font-variant-numeric:tabular-nums}
.stat span{font-size:14px}
.stat.hot b{color:var(--accent)}
.ledger{display:flex;flex-direction:column;border-top:1.5px solid var(--muted-line)}
.src{border-bottom:1.5px solid var(--muted-line)}
.src summary{list-style:none;cursor:pointer;display:grid;grid-template-columns:minmax(0,15rem) minmax(0,1fr) 3.2rem;grid-template-areas:"name bar pct" "meta meta meta";column-gap:14px;row-gap:2px;align-items:center;padding:14px 4px}
.src summary::-webkit-details-marker{display:none}
.src summary:focus-visible{outline:2.5px solid var(--accent);outline-offset:2px;border-radius:6px}
.name{grid-area:name;font-weight:700;position:relative;padding-left:22px}
.name::before{content:"";position:absolute;left:2px;top:.45em;width:8px;height:8px;border-right:2px solid var(--fg);border-bottom:2px solid var(--fg);transform:rotate(-45deg);transition:transform .15s}
.src[open] .name::before{transform:rotate(45deg);top:.3em}
.bar{grid-area:bar;height:12px;border-radius:6px;background:var(--track);overflow:hidden}
.bar span{display:block;height:100%%;background:var(--accent);border-radius:6px}
.pct{grid-area:pct;font-weight:700;text-align:right;font-variant-numeric:tabular-nums}
.meta{grid-area:meta;font-size:14px;padding-left:22px}
.body{padding:0 4px 18px 26px}
.body p{margin:0 0 12px;max-width:64ch}
.links{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
.links li{display:flex;flex-wrap:wrap;gap:4px 10px;align-items:baseline;font-size:15px}
.links a{color:var(--link);text-underline-offset:2px;min-width:0;overflow-wrap:anywhere}
.uses{font-size:13px;font-weight:600;white-space:nowrap}
.honest{background:var(--soft);border-radius:16px;padding:20px 22px}
.honest ol{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:8px}
.foot{font-size:14px;margin:0}
@media (max-width:560px){.stats{grid-template-columns:repeat(2,minmax(0,1fr))}.src summary{grid-template-columns:minmax(0,1fr) 3rem;grid-template-areas:"name pct" "bar bar" "meta meta";row-gap:6px}.meta{padding-left:0}.body{padding-left:4px}}
@media (prefers-reduced-motion:reduce){.name::before{transition:none}}
</style>
<div class="wrap">
 <header>
  <p class="eyebrow">RFP Builder</p>
  <h1>Where the answers come from</h1>
  <p class="lead">When a client asks about hosting, security, certifications, sign-in, uptime, privacy or licensing, every sentence the RFP Builder drafts comes from Adobe's own public pages, and each one links to the page it came from.</p>
  <div class="stats">
   <div class="stat hot"><b>%(el)d%%</b><span>from Experience League</span></div>
   <div class="stat"><b>%(n_sent)d</b><span>sentences</span></div>
   <div class="stat"><b>%(n_src)d</b><span>Adobe pages cited</span></div>
   <div class="stat"><b>100%%</b><span>Adobe-owned sources</span></div>
  </div>
 </header>
 <section>
  <h2>The sources, by share of citations</h2>
  <div class="ledger">%(rows)s
  </div>
  <p class="foot">Open a source to see why it is used and every page cited from it. %(total)d citations in all; a sentence can cite more than one page.</p>
 </section>
 <section class="honest">
  <h2>How it stays honest</h2>
  <ol>
   <li>Every sentence lists the exact words it relies on from its Adobe page. A checker looks for those words on the page and stops the tool from being built if any are missing.</li>
   <li>Where Adobe's own pages disagree, such as where Brand Concierge data is hosted, the fact goes to the partner as "Confirm with Adobe", never to the client.</li>
   <li>When no Adobe page covers a product on a topic, the tool drafts nothing for it and tells the partner to ask Adobe.</li>
   <li>The facts were checked against Adobe's pages on %(checked)s. Adobe updates its pages often, and the date shows how fresh the facts are.</li>
  </ol>
 </section>
</div>
''' % {'el': el_share, 'n_sent': len(F['statements']), 'n_src': len(src), 'rows': ''.join(rows), 'total': total, 'checked': checked_text}
assert '—' not in page, 'no em dashes'
open(os.path.join(HERE, 'sources.html'), 'w', encoding='utf-8').write(page)
# the same page as a standalone file for Adobe Proto (Adam uploads a zip of index.html there to share it)
os.makedirs(os.path.join(HERE, 'proto'), exist_ok=True)
standalone = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<style>html,body{margin:0}</style>\n'
              + page.split('<div class="wrap">')[0] + '</head>\n<body>\n<div class="wrap">' + page.split('<div class="wrap">', 1)[1] + '</body>\n</html>\n')
open(os.path.join(HERE, 'proto', 'index.html'), 'w', encoding='utf-8').write(standalone)
print('sources.html written: %d sources, %d citations, Experience League %d%%' % (len(src), total, el_share))
