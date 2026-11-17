"""Builds propensity-method.html, the "Propensity to buy" tab for Adam's Partner growth brief.

It borrows the head, masthead, footer and menu script from the Coworker evidence tab, so both tabs
look like the brief, and writes its own main content. It presents the counting design
(../design_transparent.md) as the proposed method. Every customer count and every number like .45
on the page is a labeled sample. Real customer numbers never go on this page or into this repository
without Adam's say-so and the data owner's sign-off.

The page shows one picture in two sizes: propensity-mockup.png and propensity-mockup-phone.png,
copied from ../mockups/p3_list_only.png and p3_list_phone.png.

Run:  python3 build_method_page.py ../../evidence_page/coworker-evidence.html propensity-method.html
"""
import os
import shutil
import sys

src, dst = sys.argv[1], sys.argv[2]
here = os.path.dirname(os.path.abspath(__file__))
t = open(src, encoding='utf-8').read()


def rep(old, new, n=1):
    global t
    assert t.count(old) == n, (t.count(old), n, old[:80])
    t = t.replace(old, new)


head, rest = t.split('<main id="main">')
tail = rest.split('</main>')[1]
t = head

# head: title, description, the active tab, and this tab's own header label
rep('<title>Coworker evidence · Partner growth</title>', '<title>Propensity to buy · Partner growth</title>')
a = t.index('<meta name="description" content="')
b = t.index('">', a)
t = t[:a] + ('<meta name="description" content="How the tool will rank the next Adobe product for a client: the client’s goal '
             'sets the order, and a number anyone can redo by hand shows how common the product is among similar customers.') + t[b:]
rep('<a href="coworker-evidence.html" class="active" aria-current="page">Coworker evidence</a><a href="propensity-method.html">Propensity to buy</a>',
    '<a href="coworker-evidence.html">Coworker evidence</a><a href="propensity-method.html" class="active" aria-current="page">Propensity to buy</a>')
rep('<span class="internal-label"><span class="brief-status-dot" aria-hidden="true"></span> Working system · Evidence inside</span>',
    '<span class="internal-label">Proposal · Not built yet</span>')

# this tab's own styles, after the shared ones
rep('</style>', '''/* Propensity to buy tab */
main h1,main h2,main h3,main .micro{text-wrap:balance}
.pm-status{max-width:920px;margin:26px auto 0;padding:16px 20px;border:1px solid #d9b200;border-radius:14px;background:#fffaf0;font-size:16px;line-height:1.5;color:#3d3200}
.pm-status strong{color:#2a2200}
.pm-sample{display:inline-block;margin-right:4px;padding:2px 8px;border:1px solid #c9a400;border-radius:5px;background:#fff2b3;color:#5c4a00;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;vertical-align:.08em}
.pm-short .impact-ledger h3{margin-top:0}
.pm-steps .micro span{color:var(--muted)}
.pm-calc{font-variant-numeric:tabular-nums;white-space:nowrap}
.pm-example{margin-top:30px}
.pm-example h3{font-size:22px;line-height:1.25;margin-bottom:6px}
.pm-example>p{font-size:15px;line-height:1.55;color:var(--muted);margin:0 0 14px;max-width:920px}
.pm-table thead th:first-child{width:25%}
.pm-table thead th:nth-child(2){width:28%}
.pm-table tbody td strong{color:var(--ink)}
.pm-rules{max-width:920px}
.pm-rules thead th:first-child{width:55%}
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
.pm-figure{margin:34px 0 0;display:grid;grid-template-columns:minmax(0,560px) minmax(0,1fr);gap:28px;align-items:start}
.pm-figure img{display:block;width:100%;max-width:560px;height:auto;border-radius:10px}
.pm-figure .pm-narrow{display:none;max-width:361px}
.pm-figure figcaption{font-size:15px;line-height:1.6;color:#555}
.pm-figure figcaption strong{color:var(--ink)}
@media(min-width:1101px){#proof .cw-steps{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:1100px){.pm-two,.pm-figure{grid-template-columns:1fr}}
@media(max-width:700px){.pm-calc{white-space:normal}.pm-status{font-size:15px}}
@media(max-width:480px){.pm-figure .pm-wide{display:none}.pm-figure .pm-narrow{display:block}}
@media print{.skip-link{display:none}.pm-status,.pm-sample{-webkit-print-color-adjust:exact;print-color-adjust:exact}.pm-figure{grid-template-columns:minmax(0,400px) minmax(0,1fr);gap:20px;break-inside:avoid}}
</style>''')

SAMPLE = '<p><span class="pm-sample">Sample numbers</span> Made up to show the arithmetic. They are not customer data.</p>'
TABLE_HEAD = ('<thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">Customers counted</th>'
              '<th scope="col" role="columnheader">Count</th><th scope="col" role="columnheader">Arithmetic</th></tr></thead>')

MAIN = '''<main id="main">
<section class="hero executive-hero wrap cw-hero" id="top">
  <div class="hero-copy"><p class="eyebrow">Next product</p><h1>The next product for a client,<em> worked out in the open.</em></h1><p class="hero-deck">How the tool will rank the next Adobe product for a client. The client’s goal sets the order. A number anyone can redo by hand shows how common the product is among similar customers.</p><div class="actions"><a class="button primary" href="#logic">See the logic <span aria-hidden="true">↓</span></a><a class="text-link" href="#meaning">What the number means →</a></div>
  <p class="pm-status"><strong>Where this stands.</strong> This is the method we propose. It is not in the tool yet. A first look at real customer data was taken on November 17. None of its numbers are on this page: every customer count and every number like .45 here is a sample. With a list of what customers own today, the number shows ownership, not buying.</p></div>
</section>
<section class="metric-strip wrap cw-metrics" aria-label="This method in numbers"><div><strong>23</strong><span>client goals already in the tool</span></div><div><strong>158</strong><span>documented connections in the tool</span></div><div><strong>34</strong><span>Adobe products in the tool</span></div><div><strong>0</strong><span>real customer numbers on this page</span></div></section>

<section class="section cw-asks pm-short" id="short"><div class="wrap">
  <div class="section-heading"><div><p class="eyebrow">In short</p><h2>The goal sets the order. The data sets the number.</h2></div><p>Two questions get two separate answers. Which product fits this client’s goal? The tool’s own files answer that. How common is that product among similar customers? Customer data answers that.</p></div>
  <div class="impact-ledger">
      <article>
        <h3>The goal sets the order.</h3>
        <p>The partner says once what the client is trying to accomplish. Products that solve that goal come first. Next come products that build on it, then products that connect to it. So the highest number is not always first.</p>
      </article>
      <article>
        <h3>The data sets the number.</h3>
        <p>Next to each product is one number between 0 and 1. It is the share of similar customers who also own the product. Similar means customers who own every Adobe product on the canvas. When too few do, the tool sets a product aside and says which. The customer count sits beside the number.</p>
      </article>
      <article>
        <h3>Checks come first.</h3>
        <p>Before partners see a number, we check the numbers against customers we held back from the count. If the numbers do not hold up, the tool keeps the goal order and shows only the share of all customers.</p>
      </article>
  </div>
</div></section>

<section class="section capability-section sow-case cw-process pm-steps" id="logic"><div class="wrap">
  <div class="section-heading"><div><p class="eyebrow">How it works</p><h2>The logic,<br>step by step.</h2></div><p>Six steps. The first two need no customer data. The other four need it. Partners see the list only after the data is loaded and the checks are done, so the list never shows without numbers.</p></div>
  <ol class="capability-flow cw-steps">
      <li><p class="micro">Step 1 · <span>No data needed</span></p><h3>Ask the goal once</h3><p>The tool asks one question for each canvas: what is your client trying to accomplish? The partner picks one of the <strong>23</strong> client problems already in the tool, or types the goal and confirms the closest of the 23. The answer stays with that canvas until the partner changes it.</p></li>
      <li><p class="micro">Step 2 · <span>No data needed</span></p><h3>Sort every product by fit</h3><p><strong>Solves the goal:</strong> the products that problem calls for. <strong>Builds on the goal:</strong> products added when the partner gives more detail about the client. <strong>Connects to the goal:</strong> products with a documented connection to one that solves it. Everything else comes last, under “Not tied to this goal”. AEM Sites and AEM Sites with Edge Delivery Services share one row. Products already on the canvas are not listed. When a ready-made play already holds every product that solves the goal, the list starts with products that build on the goal.</p></li>
      <li><p class="micro">Step 3 · <span>Needs customer data</span></p><h3>Count similar customers</h3><p>Take the customers who own every Adobe product on the canvas. Count how many of them also own the product. That share is the starting number, and the count is shown beside it. A new product that too few customers own gets no number, and the list says so. Outside systems, such as a CDN or a CRM, are not in the data and are left out.</p></li>
      <li><p class="micro">Step 4 · <span>Needs customer data</span></p><h3>Steady the small groups</h3><p>A small group can show 0 or 1 by chance. So we add <strong>10</strong> pretend customers to every group except all customers. They own the product as often as the next larger group does. Large groups barely move. Small groups stop swinging.</p></li>
      <li><p class="micro">Step 5 · <span>Needs customer data</span></p><h3>Fall back when a combination is rare</h3><p>If fewer than <strong>30</strong> customers own every Adobe product on the canvas, the tool sets one product aside at a time until 30 or more remain, and says which it set aside. Products that neither solve the goal nor build on it are set aside first, then the goal’s own products. Within each kind, the product the fewest customers own goes first. If no product is left, the group is all customers. A number worked out this way is marked as rough. Expect this often when a canvas holds a new product.</p></li>
      <li><p class="micro">Step 6 · <span>Needs customer data</span></p><h3>Order the list, then re-rank</h3><p>The goal headings come first. Under a heading, the higher number comes first. Each time a product goes on or comes off the canvas, every number is worked out again. The goal stays the same.</p></li>
  </ol>
  <div class="pm-example" id="rules">
    <h3 id="rules-h">Rules we set by hand: never go backwards</h3>
    <p>A high number does not always mean a good next step. A client does not go back to an older product once it owns the newer one that does the same job. So the list leaves these out, and says so each time. The team keeps the rules.</p>
    <div class="cw-table pm-rules">
      <table role="table" aria-labelledby="rules-h">
        <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">When the canvas holds</th><th scope="col" role="columnheader">The list never suggests</th></tr></thead>
        <tbody role="rowgroup">
        <tr role="row"><th scope="row" role="rowheader">Customer Journey Analytics</th><td role="cell" data-label="The list never suggests">Adobe Analytics</td></tr>
        <tr role="row"><th scope="row" role="rowheader">Journey Optimizer</th><td role="cell" data-label="The list never suggests">Target</td></tr>
        <tr role="row"><th scope="row" role="rowheader">AEM Sites with Edge Delivery Services</th><td role="cell" data-label="The list never suggests">AEM Sites with traditional AEM Publish</td></tr>
        </tbody>
      </table>
    </div>
    <p class="pm-shown">Each rule runs one way. A client with Adobe Analytics can still be offered Customer Journey Analytics. A rule only stops a suggestion. A partner can still add the product by hand, and the tool still shows how the two work together for a client who owns both. On Create your own play the product moves to a “Not suggested” line. Adobe Campaign and Adobe Commerce on-premises are not in the tool, so the list can never suggest them.</p>
  </div>
</div></section>

<section class="section cw-evidence" id="example"><div class="wrap">
  <div class="section-heading"><div><p class="eyebrow">The arithmetic</p><h2>A number you can redo by hand.</h2></div><p>Each number opens to the lines of arithmetic behind it. Here are two, with made-up sample numbers. The canvas is the ready-made play Brand Visibility + Customer Journey Analytics. The goal is “My client can’t tie AI traffic to revenue”.</p></div>
  <p class="pm-note"><strong>Where the play fits.</strong> For this goal the tool already recommends the play Brand Visibility + Customer Journey Analytics. The list answers the next question: what comes after the play?</p>
  <p class="pm-note"><strong>A rare combination.</strong> In this sample fewer than 30 customers own both products on the canvas. Both products solve the goal, and Brand Visibility has fewer owners in the sample. So the count sets Brand Visibility aside and uses the 673 customers who own Customer Journey Analytics.</p>
  <div class="pm-example" id="example-target">
    <h3 id="ex1-h">Target, a common product in the sample</h3>
    ''' + SAMPLE + '''
    <div class="cw-table pm-table">
      <table role="table" aria-labelledby="ex1-h">
        ''' + TABLE_HEAD + '''
        <tbody role="rowgroup">
        <tr role="row"><th scope="row" role="rowheader">All customers</th><td role="cell" data-label="Count">1,001 of 3,000 own Target</td><td role="cell" data-label="Arithmetic"><span class="pm-calc">1,001 ÷ 3,000 = <strong>0.3337</strong></span></td></tr>
        <tr role="row"><th scope="row" role="rowheader">Customers who own Customer Journey Analytics</th><td role="cell" data-label="Count">305 of 673 own Target</td><td role="cell" data-label="Arithmetic"><span class="pm-calc">(305 + 10 × 0.3337) ÷ (673 + 10) = <strong>0.4514</strong></span></td></tr>
        </tbody>
      </table>
    </div>
    <p class="pm-shown">On screen: <b>.45</b> with “305 of 673”. A line above the list says the 673 are the customers who own Customer Journey Analytics.</p>
  </div>
  <div class="pm-example" id="example-low">
    <h3 id="ex2-h">Coworker, a low number in the sample</h3>
    ''' + SAMPLE + '''
    <div class="cw-table pm-table">
      <table role="table" aria-labelledby="ex2-h">
        ''' + TABLE_HEAD + '''
        <tbody role="rowgroup">
        <tr role="row"><th scope="row" role="rowheader">All customers</th><td role="cell" data-label="Count">120 of 3,000 own Coworker</td><td role="cell" data-label="Arithmetic"><span class="pm-calc">120 ÷ 3,000 = <strong>0.0400</strong></span></td></tr>
        <tr role="row"><th scope="row" role="rowheader">Customers who own Customer Journey Analytics</th><td role="cell" data-label="Count">40 of 673 own Coworker</td><td role="cell" data-label="Arithmetic"><span class="pm-calc">(40 + 10 × 0.0400) ÷ (673 + 10) = <strong>0.0592</strong></span></td></tr>
        </tbody>
      </table>
    </div>
    <p class="pm-shown">On screen this would be <b>.06</b> with “40 of 673”. In the picture below Coworker shows no number, because a new product with too few owners gets none.</p>
  </div>
  <figure class="pm-figure" id="example-list">
    <img src="propensity-mockup.png" class="pm-wide" width="{W}" height="{H}" alt="Mockup of the Add product list on the play Brand Visibility + Customer Journey Analytics. Coworker is first under Builds on the goal, with no number yet because it is new. Under Connects to the goal come AEM Sites .52, Target .45, Journey Optimizer .31 and Adobe Commerce .12. A line at the bottom says Adobe Analytics is left out because Customer Journey Analytics is on the canvas. All numbers are samples.">
    <img src="propensity-mockup-phone.png" class="pm-narrow" width="{PW}" height="{PH}" loading="lazy" alt="Mockup of the Add product list on the play Brand Visibility + Customer Journey Analytics. Coworker is first under Builds on the goal, with no number yet because it is new. Under Connects to the goal come AEM Sites .52, Target .45, Journey Optimizer .31 and Adobe Commerce .12. A line at the bottom says Adobe Analytics is left out because Customer Journey Analytics is on the canvas. All numbers are samples.">
    <figcaption><strong>The goal leads, even without a number.</strong> In this sample Coworker has no number yet, because it is new, and AEM Sites shows .52. Coworker still comes first, because it builds on this goal and AEM Sites only connects to it. The number only sorts products under the same heading, such as “Connects to the goal”. It never moves a product to another heading. The link “How this number was worked out” opens the arithmetic.<br><br>The picture is a mockup with sample numbers. Ready-made plays have no Add product button today.</figcaption>
  </figure>
</div></section>

<section class="section cw-asks" id="meaning"><div class="wrap">
  <div class="section-heading"><div><p class="eyebrow">Read it right</p><h2>What the number means.</h2></div><p>The meaning depends on the data behind it. The tool will say which one it is, in words, next to the numbers.</p></div>
  <div class="pm-two">
      <article>
        <p class="micro">With a list of what customers own today</p>
        <h3>How common the product is</h3>
        <p>The number is the share of similar customers who own the product today. It describes ownership. It cannot tell which product a customer bought first.</p>
      </article>
      <article>
        <p class="micro">With purchase dates, or two lists a year apart</p>
        <h3>A true propensity to buy</h3>
        <p>The number becomes the share of similar customers without the product who bought it within 12 months. Only this version can be checked against what customers went on to buy.</p>
      </article>
  </div>
  <p class="pm-note"><strong>A guide, not an exact score.</strong> No propensity number is ever exact. This one shows a direction: which products similar customers more often own. The client’s goal, not the number, decides the order.</p>
  <p class="pm-note"><strong>Which one will we have?</strong> We will know when the data is read. If it has no purchase dates, a second list a year later is enough to turn the number into a true propensity to buy.</p>
  <p class="pm-note"><strong>Who similar customers are.</strong> They are the accounts in the customer data that own every Adobe product on the canvas, or every product the count keeps when the combination is rare. The tool will name the data and its date. A partner’s client may not look like them. The count treats those products as owned, including ones the partner is only proposing to the client.</p>
  <p class="pm-note"><strong>Three things the number is not.</strong> It is not a forecast for one client. It does not measure the goal: a list of what customers own has no goals in it. It is not a judgment of fit: fit comes from the goal and the documented connections. The goal sets the order. On a rare combination it also decides which product is set aside first, so the customers behind the number can change with the goal.</p>
</div></section>

<section class="section capability-section sow-case cw-process" id="proof"><div class="wrap">
  <div class="section-heading"><div><p class="eyebrow">Before partners see it</p><h2>How we will check the numbers.</h2></div><p>Four checks, then four conditions. If the numbers fail, the tool keeps the goal order and shows only the share of all customers.</p></div>
  <ol class="capability-flow cw-steps">
      <li><p class="micro">Check 1</p><h3>Redo it by hand</h3><p>Every number opens to its lines of arithmetic, like the two examples above. Anyone can redo them on a calculator from the counts on the page.</p></li>
      <li><p class="micro">Check 2</p><h3>Hold customers back</h3><p>We build the counts from half the customers and test them on the other half. When the tool says <strong>.25</strong>, about 25 in 100 of the similar customers we held back should own the product.</p></li>
      <li><p class="micro">Check 3</p><h3>Beat the simple list</h3><p>We hide one product each held-back customer owns and see if it is among the three highest numbers. The numbers must do this more often than a plain list of the most-owned products. If they do not, we say so and show only the share of all customers.</p></li>
      <li><p class="micro">Check 4 · needs purchase dates or two lists a year apart</p><h3>Test against what happened</h3><p>We rebuild the counts as they stood 12 months ago, then compare them with what customers bought in the 12 months that followed.</p></li>
  </ol>
  <p class="pm-note"><strong>The four conditions.</strong> We sort the numbers into ranges, such as .20 to .30. Every range with 500 or more checks lands within 0.05 of what the tool said. The numbers beat the simple list. The privacy check passes: a check will stop the build if the file for the tool holds a group under 30, or anything other than products and counts. The data owner signs off.</p>
  <p class="pm-note"><strong>What the checks cover.</strong> They test the number, not the goal order or the rules set by hand. The goal order comes from the 23 client problems the team wrote and the documented connections, and each reason on screen is the client detail or the documented connection behind it. With a list of what customers own today, the checks show whether the ownership shares are right. Only Check 4 shows what customers went on to buy. The rules set by hand only hide rows. They change no number, and the checks are run without them.</p>
  <p class="pm-note"><strong>Why counting and not a statistical model?</strong> A model might rank better, but nobody can redo its number by hand. The same checks can score a model later.</p>
</div></section>

<section class="section cw-asks" id="data"><div class="wrap">
  <div class="section-heading"><div><p class="eyebrow">Customer data</p><h2>What we need, and how it is protected.</h2></div><p>The method needs very little about each customer, and no account ever reaches the tool.</p></div>
  <div class="pm-two">
      <article>
        <p class="micro">What we need</p>
        <h3>One row for each account</h3>
        <ul class="pm-list">
          <li>The Adobe products the account owns.</li>
          <li>The date of the list.</li>
          <li>No customer names.</li>
          <li>Purchase dates, if they exist. They turn the number into a true propensity to buy.</li>
          <li>One rule for what counts as owning a product, so trials do not count.</li>
          <li>A table that matches each product name in the data to one of the tool’s 34 products.</li>
        </ul>
      </article>
      <article>
        <p class="micro">How it is protected</p>
        <h3>Only summary counts reach the tool</h3>
        <ul class="pm-list">
          <li>The data is never saved to GitHub.</li>
          <li>The counting happens away from the tool. The tool gets group sizes and owner counts only.</li>
          <li>No group smaller than <strong>30</strong> customers is published. A count inside a group can be smaller than 30. It never points to an account, and it can be rounded if the data owner asks.</li>
          <li>Counts are Adobe-internal. Before any partner sees one, we confirm who can open the tool and the data owner approves.</li>
        </ul>
      </article>
  </div>
</div></section>

<section class="section cw-evidence" id="status"><div class="wrap">
  <div class="section-heading"><div><p class="eyebrow">Today</p><h2>Where it stands.</h2></div><p>What is prepared, and what waits for the customer data and for decisions.</p></div>
  <div class="pm-two">
      <article>
        <p class="micro">Prepared</p>
        <h3>The groundwork that needs no data</h3>
        <ul class="pm-list">
          <li>The <strong>23</strong> client problems and the <strong>158</strong> documented connections are in the tool today.</li>
          <li>For all 23 goals, we worked out the goal headings from the tool’s real files. Each goal has 1 to 4 products that solve it, 1 to 5 that build on it and up to 20 that connect to it.</li>
          <li>The arithmetic was tried on made-up accounts to see that it runs. That is not proof.</li>
          <li>Mockups with sample numbers are ready for review.</li>
        </ul>
      </article>
      <article>
        <p class="micro">Not yet</p>
        <h3>The part that needs data and decisions</h3>
        <ul class="pm-list">
          <li>Nothing is in the tool.</li>
          <li>Ready-made plays have no Add product button today. This proposal would add one.</li>
          <li>Customer data arrived on November 17 and a first look is done. None of it is in the tool.</li>
          <li>The checks have had a first run on that data. The results are being reviewed.</li>
          <li>The data owner has not signed off.</li>
          <li>Open choices: counting or a statistical model; where the list appears; what happens to a play when a product is added; the name on screen; exact or rounded counts; and where the counting is done.</li>
          <li>The values 30 and 10 are starting values. The hold-back check on the real data confirms or changes them.</li>
        </ul>
      </article>
  </div>
  <p class="pm-note"><strong>First lessons from real data, November 17.</strong> The number brings back long-established products, not new ones, so only the client’s goal can put a new product on the list. Proposed next, for Adam to decide: show numbers for established products only, and say they mean a product line above a set yearly size; mark a number from a rare combination as rough, because it reads low; and show no number for creative and document products for now, because the first files are too narrow for them.</p>
  <p class="pm-note"><strong>What comes next.</strong> First the open choices. Then the customer data. Then the checks. Partners see the list only after the checks are done, the privacy check passes and the data owner signs off. If the numbers fail their checks, the list shows only the share of all customers.</p>
</div></section>
</main>'''

tail = tail.replace('Checked on November 17, 2026. Every source is a public Adobe page. Every quote is word for word.',
                    'Draft of November 17, 2026. Sample numbers only on this page.')
assert 'Sample numbers only on this page' in tail
from PIL import Image

out_dir = os.path.dirname(os.path.abspath(dst))
sizes = {}
for name, source in (('propensity-mockup.png', 'p3_list_only.png'), ('propensity-mockup-phone.png', 'p3_list_phone.png')):
    shutil.copyfile(os.path.join(here, '..', 'mockups', source), os.path.join(out_dir, name))
    sizes[name] = Image.open(os.path.join(out_dir, name)).size
(W, H), (PW, PH) = sizes['propensity-mockup.png'], sizes['propensity-mockup-phone.png']
MAIN = MAIN.replace('{W}', str(W)).replace('{H}', str(H)).replace('{PW}', str(PW)).replace('{PH}', str(PH))
open(dst, 'w', encoding='utf-8').write(t + MAIN + tail)
print('wrote', dst, 'and its two pictures')
