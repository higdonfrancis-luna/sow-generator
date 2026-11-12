"""The second demo RFP (Nov 12 2026, Adam: "yes, build the insurer RFP"): Cedar Prairie Mutual Insurance Company, a fictional
regional insurer, asks for one partner to rebuild its website on AEM Sites with Edge Delivery Services, implement Brand
Visibility and Brand Concierge, connect Customer Journey Analytics to its data, and roll out Coworker. Unlike Tallgrass, the
wording is not tuned to the tool: it reads like a real insurer's RFP, with a word limit per section, Mandatory and Desirable
tags, questions about the firm, security and pricing, systems the catalog does not cover and a product the client rules out.

One list of questions makes both files, so they always match:
  Cedar_Prairie_Mutual_Insurance_Company_RFP.pdf               the RFP as issued (printed from cedar_prairie_rfp.html)
  Cedar_Prairie_Mutual_Insurance_Company_Response_Form.xlsx    the client's response form, one row per requirement

Run from the repo root: python3 sow/rfp_prototype/demo/build_cedar_prairie.py
"""
import html, os, subprocess, json
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation

HERE = os.path.dirname(os.path.abspath(__file__))
NAME = 'Cedar_Prairie_Mutual_Insurance_Company'
M, D = 'Mandatory', 'Desirable'

SECTIONS = [
    ('A', 'Your firm and experience', 200, [
        ('A.1', M, 'Provide an overview of your firm, including years in business, number of employees, office locations and your Adobe partner level.'),
        ('A.2', M, 'Describe your experience delivering digital experience work for insurance carriers or other regulated financial services organizations.'),
        ('A.3', M, 'Provide three client references for similar work completed in the past three years, with a contact name, title and phone number for each.'),
        ('A.4', D, 'Describe the key personnel you propose for this engagement, their roles, and the Adobe certifications each holds.'),
        ('A.5', M, 'State whether you intend to use subcontractors for any part of this work. If so, name them and describe their role.'),
    ]),
    ('B', 'Website on AEM Sites with Edge Delivery Services', 300, [
        ('B.1', M, 'Describe how you would build our new public website on AEM Sites with Edge Delivery Services, including the blocks and page templates our marketing team will author with.'),
        ('B.2', M, 'Our current site runs on Drupal 9 and holds about 3,400 pages and 900 PDF documents, including state rate filings. Describe how you would migrate this content, what you would retire, and how you would preserve URLs.'),
        ('B.3', M, 'Describe how you would make the new site conform to WCAG 2.2 Level AA, and how accessibility would be checked before each release.'),
        ('B.4', D, 'Describe how you would achieve and keep strong Core Web Vitals and Lighthouse scores on the new site.'),
        ('B.5', M, 'Akamai is our enterprise CDN and must remain in front of the site. Describe how you would configure Akamai with Edge Delivery Services, including caching, purging and security headers.'),
        ('B.6', M, 'Every page that mentions rates, coverage or claims must be approved by our Compliance team before it is published. Describe the review and approval workflow you would set up for authors and reviewers.'),
        ('B.7', D, 'We will not license Adobe Target in this phase. Describe how you would run A/B tests on the new quote-start page without it.'),
        ('B.8', M, 'Describe your go-live and cutover plan, including redirects, search engine protection and rollback.'),
    ]),
    ('C', 'AI visibility and the conversational experience', 250, [
        ('C.1', M, 'Describe how you would use Adobe Brand Visibility to measure how AI assistants such as ChatGPT, Gemini and Perplexity describe Cedar Prairie and our products, and how you would report it to us.'),
        ('C.2', M, 'Describe the program you would run to improve how Cedar Prairie appears in AI-generated answers, both on our own site and on third-party sites.'),
        ('C.3', M, 'Describe how you would implement Adobe Brand Concierge on our website to help visitors compare auto, home and life coverage and start a quote.'),
        ('C.4', M, 'Describe how Brand Concierge answers would be limited to approved Cedar Prairie content, and the guardrails you would put in place for regulated topics such as rates and claim decisions.'),
        ('C.5', D, 'When a visitor asks for a person, the conversation should pass to a licensed agent in our Genesys Cloud contact center. Describe how you would design this handoff.'),
        ('C.6', D, 'Describe how you would measure Brand Concierge conversations and report what visitors ask, where they drop off and how many start a quote.'),
    ]),
    ('D', 'Data, analytics and integrations', 250, [
        ('D.1', M, 'Describe how you would implement Customer Journey Analytics to analyze web, Brand Concierge, email and agent activity together for the same customer.'),
        ('D.2', M, 'Policy and claims data is held in our Snowflake data warehouse. Describe how you would bring the data we need into Customer Journey Analytics, and how you would keep it current.'),
        ('D.3', M, 'Our agents work in Salesforce Financial Services Cloud. Describe how website and Brand Concierge activity would reach Salesforce, and how Salesforce data would reach Customer Journey Analytics.'),
        ('D.4', D, 'Our executives read their reports in Microsoft Power BI. Describe how Customer Journey Analytics data would be made available there.'),
        ('D.5', M, 'We use Marketo Engage today for policyholder and agent email. Describe how you would connect Marketo Engage to the new website and to Customer Journey Analytics.'),
        ('D.6', M, 'Describe how consent, privacy preferences and Gramm-Leach-Bliley Act obligations would be respected in the data you collect, store and activate.'),
        ('D.7', D, 'Our annual policy notices are sent from a legacy print vendor. Describe whether and how they should be brought into this program.'),
    ]),
    ('E', 'Security, hosting and compliance', 150, [
        ('E.1', M, 'Where are AEM Sites with Edge Delivery Services, Brand Concierge and Customer Journey Analytics hosted, and can our data be kept in the United States?'),
        ('E.2', M, 'Which security certifications and attestations do the proposed Adobe products hold, such as SOC 2 Type 2 and ISO 27001?'),
        ('E.3', M, 'Describe how data is encrypted at rest and in transit in the proposed Adobe products.'),
        ('E.4', M, 'Can our employees sign in to the Adobe products with single sign-on through Okta? Describe how access would be set up and removed.'),
        ('E.5', D, 'What uptime commitments apply to the proposed Adobe products?'),
        ('E.6', M, 'Is Cedar Prairie content or customer data used to train AI models in Brand Concierge or Coworker?'),
    ]),
    ('F', 'Enablement, Coworker and ongoing services', 200, [
        ('F.1', M, 'Describe how you would train our content authors, Compliance reviewers and analysts, and what materials you would leave behind.'),
        ('F.2', D, 'We plan to roll out Adobe Coworker to our marketing team of 35 people. Describe how you would set it up for our work and help the team adopt it.'),
        ('F.3', M, 'Describe the monthly services you would provide after launch for the website and Brand Concierge, including releases, monitoring and support hours.'),
        ('F.4', M, 'Describe the monthly Brand Visibility reporting and improvement service you would provide after launch.'),
        ('F.5', D, 'Describe your knowledge transfer and transition plan should Cedar Prairie bring this work in-house or move it to another partner.'),
    ]),
    ('G', 'Pricing', 250, [
        ('G.1', M, 'Provide your pricing for the scope of work as a fixed fee by phase, with the hours and hourly rates by role that support it.'),
        ('G.2', M, 'List the assumptions your pricing depends on, and anything Cedar Prairie must provide.'),
    ]),
]
ABOUT = [
    'Cedar Prairie Mutual Insurance Company is a regional mutual insurer founded in 1921 and based in Cedar Rapids, Iowa. We write auto, home, farm and life coverage in Iowa, Illinois, Minnesota, Nebraska and Wisconsin, with about 410,000 policyholders served through 1,150 independent agents and a contact center of 140 people.',
    'Our public website, cedarprairie-example.com, has about 1.1 million visits a month. It runs on Drupal 9, which reaches the end of its support, and our marketing team needs a developer for most changes. More of our prospects now research coverage through AI assistants before they visit us, and we do not know how those assistants describe us.',
]
SCOPE = [
    'Cedar Prairie has selected Adobe Experience Manager Sites with Edge Delivery Services, Adobe Brand Visibility, Adobe Brand Concierge, Customer Journey Analytics and Adobe Coworker. None of them is set up yet. We are looking for one implementation partner to rebuild and migrate our website, implement the five products, connect them to our systems, train our people and provide monthly services after launch.',
    'Our systems today: Drupal 9 (website), Akamai (CDN), Salesforce Financial Services Cloud (agents), Snowflake (policy and claims data), Microsoft Power BI (executive reporting), Marketo Engage (email), Genesys Cloud (contact center) and Okta (employee sign-on). We expect the new website and Brand Concierge to launch within ten months of contract signing, with Customer Journey Analytics reporting live within twelve months.',
]


def esc(t):
    return html.escape(t, quote=False)


def page():
    q = []
    for code, title, words, items in SECTIONS:
        q.append(f'<h3>Section {code}. {esc(title)}</h3><p class="lim">Answer each requirement in this section in {words} words or fewer.</p>')
        for ref, kind, text in items:
            q.append(f'<p class="q"><b>{ref}</b> ({kind}) {esc(text)}</p>')
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>RFP CPM-2026-031: Digital Experience Platform Implementation Services</title>
<style>
@page{{size:Letter;margin:0.9in 1in 0.9in 1in}}
body{{font-family:Georgia,'Times New Roman',serif;font-size:11pt;line-height:1.42;color:#1a1a1a;margin:0}}
.org{{font-family:Arial,Helvetica,sans-serif;font-size:13pt;color:#1f4e79;font-weight:bold;margin:0 0 6pt}}
h1{{font-family:Arial,Helvetica,sans-serif;font-size:19pt;line-height:1.2;margin:0 0 4pt;color:#1a1a1a}}
.sub{{font-family:Arial,Helvetica,sans-serif;font-size:11pt;margin:0 0 26pt;color:#1a1a1a}}
.rule{{border:0;border-top:2.5pt solid #1f4e79;margin:0 0 12pt}}
table.meta{{border-collapse:collapse;width:100%;margin:0 0 14pt;font-family:Arial,Helvetica,sans-serif;font-size:10pt}}
table.meta td{{border:0.75pt solid #9aa3ad;padding:5pt 8pt;vertical-align:top}}
table.meta td:first-child{{width:32%;font-weight:bold;background:#eef2f7}}
h2{{font-family:Arial,Helvetica,sans-serif;font-size:13pt;margin:16pt 0 5pt;color:#1f4e79;break-after:avoid}}
h3{{font-family:Arial,Helvetica,sans-serif;font-size:11pt;margin:13pt 0 2pt;break-after:avoid}}
p{{margin:0 0 7pt}}
p.lim{{font-style:italic;margin:0 0 6pt}}
p.q{{margin:0 0 6pt 0;padding-left:30pt;text-indent:-30pt;break-inside:avoid}}
.note{{font-family:Arial,Helvetica,sans-serif;font-size:9pt;color:#1a1a1a;border:0.75pt solid #9aa3ad;padding:6pt 8pt;margin:14pt 0 0}}
</style></head><body>
<p class="org">Cedar Prairie Mutual Insurance Company</p>
<hr class="rule" style="margin-bottom:34pt">
<h1>Request for Proposal CPM-2026-031</h1>
<p class="sub">Digital Experience Platform Implementation Services</p>
<table class="meta">
<tr><td>Issued</td><td>November 30, 2026</td></tr>
<tr><td>Questions due</td><td>December 11, 2026</td></tr>
<tr><td>Proposals due</td><td>January 8, 2027, 4:00 p.m. Central Time</td></tr>
<tr><td>Contact</td><td>Strategic Sourcing, sourcing@cedarprairie-example.com</td></tr>
</table>
<h2>1. About Cedar Prairie Mutual</h2>
{''.join(f'<p>{esc(t)}</p>' for t in ABOUT)}
<h2>2. Scope of work</h2>
{''.join(f'<p>{esc(t)}</p>' for t in SCOPE)}
<h2>3. Instructions</h2>
<p>Respond to every requirement in the attached response form, in the order given, and submit the form with your proposal. Requirements marked Mandatory must be answered; a proposal that leaves a Mandatory requirement unanswered may be disqualified. Requirements marked Desirable are scored but not required. Each section states its word limit.</p>
<h2>4. Requirements</h2>
{''.join(q)}
<h2>5. Evaluation</h2>
<p>Proposals will be scored on the approach to Sections B to F (45 percent), the firm's experience, team and references (25 percent), security and compliance (10 percent) and price (20 percent). Cedar Prairie may hold presentations with up to three bidders in February 2027. Cedar Prairie is not obliged to accept the lowest-priced proposal or any proposal.</p>
<p class="note">Sample document for demonstration. Cedar Prairie Mutual Insurance Company is a fictional company, and this is not a real solicitation.</p>
</body></html>"""


def form(path):
    wb = Workbook()
    cover = wb.active; cover.title = 'Instructions'
    for r in [['Cedar Prairie Mutual Insurance Company'], ['RFP CPM-2026-031: Digital Experience Platform Implementation Services'], ['Response form'], [],
              ['Answer every requirement on the Requirements sheet in the Vendor response column. Mandatory requirements must be answered.'],
              ['Keep each response within the word limit shown for its section. Do not change the requirement text or the order of the rows.'],
              ['In the Compliance column, choose Comply, Partially comply or Do not comply.'], [],
              ['Sample document for demonstration. Cedar Prairie Mutual Insurance Company is a fictional company, and this is not a real solicitation.']]:
        cover.append(r)
    cover['A1'].font = Font(bold=True, size=14, color='1F4E79'); cover['A2'].font = Font(bold=True, size=12); cover.column_dimensions['A'].width = 120
    ws = wb.create_sheet('Requirements')
    head = ['Ref', 'Section', 'Requirement', 'Mandatory or Desirable', 'Word limit', 'Vendor response', 'Compliance']
    ws.append(head)
    fill = PatternFill('solid', fgColor='1F4E79'); thin = Side(style='thin', color='9AA3AD')
    for c in ws[1]:
        c.font = Font(bold=True, color='FFFFFF'); c.fill = fill; c.alignment = Alignment(wrap_text=True, vertical='center')
    for code, title, words, items in SECTIONS:
        for ref, kind, text in items:
            ws.append([ref, f'{code}. {title}', text, kind, words, '', ''])
    for row in ws.iter_rows(min_row=1, max_row=ws.max_row):
        for c in row:
            c.border = Border(top=thin, bottom=thin, left=thin, right=thin)
            if c.row > 1: c.alignment = Alignment(wrap_text=True, vertical='top')
    for col, w in zip('ABCDEFG', (7, 26, 60, 14, 9, 70, 16)):
        ws.column_dimensions[col].width = w
    ws.freeze_panes = 'A2'
    dv = DataValidation(type='list', formula1='"Comply,Partially comply,Do not comply"', allow_blank=True)
    ws.add_data_validation(dv); dv.add(f'G2:G{ws.max_row}')
    wb.save(path)


def main():
    src = os.path.join(HERE, 'cedar_prairie_rfp.html')
    text = page()
    assert '—' not in text and '–' not in text, 'no dashes in the RFP'
    open(src, 'w', encoding='utf-8').write(text)
    pdf = os.path.join(HERE, NAME + '_RFP.pdf')
    js = ("const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();"
          f"await p.goto('file://{src}');await p.pdf({{path:{json.dumps(pdf)},format:'Letter',printBackground:true}});await b.close();}})();")
    subprocess.run(['node', '-e', js], check=True)
    form(os.path.join(HERE, NAME + '_Response_Form.xlsx'))
    n = sum(len(s[3]) for s in SECTIONS)
    print(f'{n} requirements in {len(SECTIONS)} sections: {NAME}_RFP.pdf and {NAME}_Response_Form.xlsx')


if __name__ == '__main__':
    main()
