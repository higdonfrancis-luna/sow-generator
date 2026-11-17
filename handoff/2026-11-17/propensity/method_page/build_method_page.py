"""Builds propensity-method.html, the "Propensity to buy" tab for Adam's Partner growth brief.

It borrows the head, masthead, footer and menu script from the Coworker evidence tab, so both tabs
look like the brief, and writes its own main content. Every number on the page is a labeled sample:
no customer data has been read.

Run:  python3 build_method_page.py ../../evidence_page/coworker-evidence.html propensity-method.html
"""
import sys

src, dst = sys.argv[1], sys.argv[2]
t = open(src, encoding='utf-8').read()


def rep(old, new, n=1):
    global t
    assert t.count(old) == n, (t.count(old), n, old[:80])
    t = t.replace(old, new)


head, rest = t.split('<main id="main">')
tail = rest.split('</main>')[1]
t = head

# head: title, description, the active tab
rep('<title>Coworker evidence · Partner growth</title>', '<title>Propensity to buy · Partner growth</title>')
a = t.index('<meta name="description" content="')
b = t.index('">', a)
t = t[:a] + ('<meta name="description" content="How the tool will rank the next Adobe product for a client: the client’s goal '
             'sets the order, and a number anyone can redo by hand shows how common the product is among similar customers.') + t[b:]
rep('<a href="coworker-evidence.html" class="active" aria-current="page">Coworker evidence</a><a href="propensity-method.html">Propensity to buy</a>',
    '<a href="coworker-evidence.html">Coworker evidence</a><a href="propensity-method.html" class="active" aria-current="page">Propensity to buy</a>')

# this tab's own styles, after the shared ones
rep('</style>', '''/* Propensity to buy tab */
.pm-status{margin-top:26px;padding:16px 20px;border:1px solid #d9b200;border-radius:14px;background:#fffaf0;font-size:16px;line-height:1.5;color:#3d3200}
.pm-status strong{color:#2a2200}
.pm-sample{display:inline-block;margin-right:8px;padding:2px 8px;border:1px solid #c9a400;border-radius:5px;background:#fff2b3;color:#5c4a00;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;vertical-align:.08em}
.pm-short .impact-ledger h3{margin-top:0}
.pm-steps .micro span{color:var(--muted)}
.pm-calc{font-variant-numeric:tabular-nums;white-space:nowrap}
.pm-example{margin-top:26px}
.pm-example+.pm-example{margin-top:34px}
.pm-example h3{font-size:22px;line-height:1.25;margin-bottom:6px}
.pm-example>p{font-size:15px;line-height:1.55;color:var(--muted);margin:0 0 14px;max-width:920px}
.pm-table thead th:first-child{width:27%}
.pm-table thead th:nth-child(2){width:30%}
.pm-table tbody td strong{color:var(--ink)}
.pm-shown{margin-top:12px;font-size:15px;line-height:1.55;max-width:920px}
.pm-shown b{font-size:22px;letter-spacing:-.01em;color:var(--ink)}
.pm-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.pm-two article{background:#fff;border:1px solid var(--line);border-radius:17px;padding:25px;min-width:0}
.pm-two h3{font-size:21px;line-height:1.25;margin:10px 0 10px}
.pm-two p,.pm-list li{font-size:15px;line-height:1.6;color:#555}
.pm-two .micro{font-size:11px;line-height:1.4;color:var(--muted);margin:0}
.pm-list{margin:0;padding-left:20px}
.pm-list li+li{margin-top:6px}
.pm-list strong{color:var(--ink)}
.pm-note{margin-top:18px;max-width:920px;font-size:15px;line-height:1.6;color:#555}
.pm-note strong{color:var(--ink)}
@media(max-width:1100px){.pm-two{grid-template-columns:1fr}}
@media(max-width:700px){.pm-calc{white-space:normal}.pm-status{font-size:15px}}
</style>''')

MAIN = '''<main id="main">
<section class="hero executive-hero wrap cw-hero" id="top">
  <div class="hero-copy"><p class="eyebrow">Next product</p><h1>What a client buys next,<em> worked out in the open.</em></h1><p class="hero-deck">How the tool will rank the next Adobe product for a client. The client’s goal sets the order. A number anyone can redo by hand shows how common the product is among similar customers.</p><div class="actions"><a class="button primary" href="#logic">See the logic <span aria-hidden="true">↓</span></a><a class="text-link" href="#meaning">What the number means →</a></div>
  <p class="pm-status"><strong>Where this stands.</strong> This is the method we propose. It is not in the tool yet. No customer data has been read. Every number on this page is a sample.</p></div>
</section>
<section class="metric-strip wrap cw-metrics" aria-label="This method in numbers"><div><strong>23</strong><span>client goals already in the tool</span></div><div><strong>158</strong><span>documented product connections</span></div><div><strong>34</strong><span>Adobe products the list can rank</span></div><div><strong>0</strong><span>customer records read so far</span></div></section>

<section class="section cw-asks pm-short" id="short"><div class="wrap">
  <div class="section-heading"><div><p class="eyebrow">In short</p><h2>The goal sets the order. The data sets the number.</h2></div><p>Two questions get two separate answers. Which product fits this client’s goal? The tool’s own files answer that. How common is that product among similar customers? Customer data answers that.</p></div>
  <div class="impact-ledger">
      <article>
        <h3>The goal sets the order.</h3>
        <p>The partner says once what the client is trying to accomplish. Products that solve that goal come first. Next come products that build on it, then products that connect to it.</p>
      </article>
      <article>
        <h3>The data sets the number.</h3>
        <p>Next to each product is one number between 0 and 1. It is the share of similar customers who also own the product. The customer count sits beside it.</p>
      </article>
      <article>
        <h3>Proof comes first.</h3>
        <p>Before partners see a number, we check the numbers against customers we held back from the count. If the numbers do not hold up, the tool shows the goal order alone.</p>
      </article>
  </div>
</div></section>

<section class="section capability-section sow-case cw-process pm-steps" id="logic"><div class="wrap">
  <div class="section-heading"><div><p class="eyebrow">How it works</p><h2>The logic,<br>step by step.</h2></div><p>Six steps. The first two need no customer data, so they can work on day one. The other four start when the data is loaded and checked.</p></div>
  <ol class="capability-flow cw-steps">
      <li><p class="micro">Step 1 · <span>No data needed</span></p><h3>Ask the goal once</h3><p>The tool asks one question for each canvas: what is your client trying to accomplish? The partner picks one of the <strong>23</strong> client problems already in the tool. The answer stays with that canvas until the partner changes it.</p></li>
      <li><p class="micro">Step 2 · <span>No data needed</span></p><h3>Sort every product by fit</h3><p><strong>Solves the goal:</strong> the products that problem calls for. <strong>Builds on the goal:</strong> products its follow-up answers add. <strong>Connects to the goal:</strong> products with a documented connection to one that solves it. Everything else comes last. All of this comes from the tool’s own files.</p></li>
      <li><p class="micro">Step 3 · <span>Needs customer data</span></p><h3>Count similar customers</h3><p>Take the customers who own everything on the canvas. Count how many of them also own the product. That share is the starting number, and the count is shown beside it.</p></li>
      <li><p class="micro">Step 4 · <span>Needs customer data</span></p><h3>Steady the small groups</h3><p>A small group can show 0 or 1 by chance. So the count is blended with <strong>10</strong> stand-in customers who behave like the next larger group. Large groups barely move. Small groups stop swinging.</p></li>
      <li><p class="micro">Step 5 · <span>Needs customer data</span></p><h3>Fall back when a combination is rare</h3><p>If fewer than <strong>30</strong> customers own everything on the canvas, the tool leaves one product out, counts again and says which product it left out. Products outside the goal are left out first.</p></li>
      <li><p class="micro">Step 6 · <span>Needs customer data</span></p><h3>Order the list, then re-rank</h3><p>The goal groups come first. Inside a group, the higher number comes first. Each time a product goes on or comes off the canvas, every number is worked out again. The goal stays the same.</p></li>
  </ol>
</div></section>

<section class="section cw-evidence" id="example"><div class="wrap">
  <div class="section-heading"><div><p class="eyebrow">The arithmetic</p><h2>A number you can redo by hand.</h2></div><p>Each number opens to the lines of arithmetic behind it. Here are two, with sample numbers from 3,000 made-up accounts. The goal is “My client can’t tie AI traffic to revenue” and Customer Journey Analytics is on the canvas.</p></div>
  <div class="pm-example" id="example-target">
    <h3 id="ex1-h">Target, a product many customers own</h3>
    <p><span class="pm-sample">Sample numbers</span>Made up to show the arithmetic. They are not customer data.</p>
    <div class="cw-table pm-table">
      <table role="table" aria-labelledby="ex1-h">
        <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">Group</th><th scope="col" role="columnheader">Count</th><th scope="col" role="columnheader">Arithmetic</th></tr></thead>
        <tbody role="rowgroup">
        <tr role="row"><th scope="row" role="rowheader">All customers</th><td role="cell" data-label="Count">1,001 of 3,000 own Target</td><td role="cell" data-label="Arithmetic"><span class="pm-calc">1,001 ÷ 3,000 = <strong>0.3337</strong></span></td></tr>
        <tr role="row"><th scope="row" role="rowheader">Customers who own Customer Journey Analytics</th><td role="cell" data-label="Count">305 of 673 own Target</td><td role="cell" data-label="Arithmetic"><span class="pm-calc">(305 + 10 × 0.3337) ÷ (673 + 10) = <strong>0.4514</strong></span></td></tr>
        </tbody>
      </table>
    </div>
    <p class="pm-shown">On screen: <b>.45</b> with “305 of the 673 customers who own Customer Journey Analytics”.</p>
  </div>
  <div class="pm-example" id="example-new">
    <h3 id="ex2-h">Brand Visibility, a new product</h3>
    <p><span class="pm-sample">Sample numbers</span>Made up to show the arithmetic. They are not customer data.</p>
    <div class="cw-table pm-table">
      <table role="table" aria-labelledby="ex2-h">
        <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">Group</th><th scope="col" role="columnheader">Count</th><th scope="col" role="columnheader">Arithmetic</th></tr></thead>
        <tbody role="rowgroup">
        <tr role="row"><th scope="row" role="rowheader">All customers</th><td role="cell" data-label="Count">95 of 3,000 own Brand Visibility</td><td role="cell" data-label="Arithmetic"><span class="pm-calc">95 ÷ 3,000 = <strong>0.0317</strong></span></td></tr>
        <tr role="row"><th scope="row" role="rowheader">Customers who own Customer Journey Analytics</th><td role="cell" data-label="Count">25 of 673 own Brand Visibility</td><td role="cell" data-label="Arithmetic"><span class="pm-calc">(25 + 10 × 0.0317) ÷ (673 + 10) = <strong>0.0371</strong></span></td></tr>
        </tbody>
      </table>
    </div>
    <p class="pm-shown">On screen: <b>.04</b> with “25 of the 673 customers who own Customer Journey Analytics”.</p>
    <p class="pm-note"><strong>A low number can still lead the list.</strong> Brand Visibility is new, so few customers own it yet and its number is low. It still comes first for this goal, because it solves the goal. The number only orders products inside a group. It never moves a product out of its group.</p>
  </div>
</div></section>

<section class="section cw-asks" id="meaning"><div class="wrap">
  <div class="section-heading"><div><p class="eyebrow">Read it right</p><h2>What the number means.</h2></div><p>The meaning depends on the data behind it. The page will say which one it is, in words, next to the numbers.</p></div>
  <div class="pm-two">
      <article>
        <p class="micro">With a list of what customers own today</p>
        <h3>How common the product is</h3>
        <p>The number is the share of similar customers who own the product today. It describes ownership. It cannot tell which product a customer bought first.</p>
      </article>
      <article>
        <p class="micro">With purchase dates, or two lists a year apart</p>
        <h3>A true propensity to buy</h3>
        <p>The number becomes the share of similar customers who bought the product within 12 months. Only this version can be checked against what customers went on to buy.</p>
      </article>
  </div>
  <p class="pm-note"><strong>Three things the number is not.</strong> It is not a forecast for one client. It is not changed by the goal: the goal changes the order and never the number. It is not a judgment of fit: fit comes from the goal and the documented connections.</p>
</div></section>

<section class="section capability-section sow-case cw-process" id="proof"><div class="wrap">
  <div class="section-heading"><div><p class="eyebrow">Before partners see it</p><h2>How we will prove it.</h2></div><p>Four checks, then four conditions. If the numbers fail, the tool keeps the goal order and shows only the share of all customers.</p></div>
  <ol class="capability-flow cw-steps">
      <li><p class="micro">Check 1</p><h3>Redo it by hand</h3><p>Every number opens to its lines of arithmetic, like the two examples above. Anyone can redo them on a calculator from the counts on the page.</p></li>
      <li><p class="micro">Check 2</p><h3>Hold customers back</h3><p>We build the counts from half the customers and test them on the other half. When the tool says <strong>.25</strong>, about 25 in 100 of the held-back customers should own the product.</p></li>
      <li><p class="micro">Check 3</p><h3>Beat the simple list</h3><p>The ranking must do better than a plain list of the most-owned products. If it does not, the plain list is the more accurate answer and we say so.</p></li>
      <li><p class="micro">Check 4 · needs purchase dates</p><h3>Test against what happened</h3><p>We rebuild the counts as they stood 12 months ago, then compare them with what customers bought in the 12 months that followed.</p></li>
  </ol>
  <p class="pm-note"><strong>The four conditions.</strong> Every band of numbers with 500 or more checks lands within 0.05 of what the tool said. The ranking beats the simple list. The privacy check passes. The data owner signs off.</p>
</div></section>

<section class="section cw-asks" id="data"><div class="wrap">
  <div class="section-heading"><div><p class="eyebrow">Customer data</p><h2>What we need, and how it is protected.</h2></div><p>The method needs very little about each customer, and none of it reaches the tool.</p></div>
  <div class="pm-two">
      <article>
        <p class="micro">What we need</p>
        <h3>One row for each account</h3>
        <ul class="pm-list">
          <li>The Adobe products the account owns.</li>
          <li>The date of the list.</li>
          <li>No customer names.</li>
          <li>Purchase dates, if they exist. They turn the number into a true propensity to buy.</li>
        </ul>
      </article>
      <article>
        <p class="micro">How it is protected</p>
        <h3>Only summary counts reach the tool</h3>
        <ul class="pm-list">
          <li>The data is never saved to GitHub.</li>
          <li>The counting happens away from the tool. The tool gets group sizes and owner counts only.</li>
          <li>No group smaller than <strong>30</strong> customers is published.</li>
          <li>The data owner approves before any partner sees a count.</li>
        </ul>
      </article>
  </div>
</div></section>

<section class="section cw-evidence" id="status"><div class="wrap">
  <div class="section-heading"><div><p class="eyebrow">Today</p><h2>Where it stands.</h2></div><p>What is done, and what waits for the customer data and for decisions.</p></div>
  <div class="pm-two">
      <article>
        <p class="micro">Done</p>
        <h3>The part that needs no data</h3>
        <ul class="pm-list">
          <li>The <strong>23</strong> client problems and the <strong>158</strong> documented connections are in the tool today.</li>
          <li>For all 23 goals, we worked out the fit groups from the tool’s real files. Each goal has 1 to 4 products that solve it, 1 to 5 that build on it and 1 to 20 that connect to it.</li>
          <li>The arithmetic was tried on made-up accounts to see that it runs. That is not proof.</li>
          <li>Mockups with sample numbers are ready for review.</li>
        </ul>
      </article>
      <article>
        <p class="micro">Not yet</p>
        <h3>The part that needs data and decisions</h3>
        <ul class="pm-list">
          <li>Nothing is in the tool.</li>
          <li>No customer data has been loaded.</li>
          <li>No number has been checked against real customers.</li>
          <li>The data owner has not signed off.</li>
          <li>Open choices: where the list appears, the name on screen, exact or rounded counts, and the starting values of 30 customers and 10 stand-ins.</li>
        </ul>
      </article>
  </div>
</div></section>
</main>'''

tail = tail.replace('Checked on November 17, 2026. Every source is a public Adobe page. Every quote is word for word.',
                    'Draft of November 17, 2026. Sample numbers only. No customer data has been read.')
assert 'Draft of November 17, 2026' in tail
open(dst, 'w', encoding='utf-8').write(t + MAIN + tail)
print('wrote', dst)
