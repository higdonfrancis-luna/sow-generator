"""Three made-up RFPs for the RFP Builder tests: a bank (text), a retailer (Word) and a manufacturer (PDF, made by
Playwright from HTML). Run from the repo root: python3 sow/qa/rfp_fixtures/make_fixtures.py"""
import os, zipfile, subprocess, json
HERE = os.path.dirname(os.path.abspath(__file__))

BANK = """Request for Proposal: Digital Experience Services
Northbridge Mutual Bank
Section 1. Company background
1.1 Provide a brief overview of your firm, including years in business and headquarters location.
1.2 Provide three references from financial services clients for similar work.
1.3 Describe your project team and their Adobe certifications.
Section 2. Adobe platform services
2.1 Describe your approach to implementing Adobe Experience Manager Sites, including migration of our existing content.
2.2 How would you connect our Customer Journey Analytics data to AI assistant traffic, and what do you need from us?
2.3 Our customers have complex questions about accounts, policies and rates. How would Brand Concierge answer them from approved sources?
2.4 Describe how Brand Visibility shows where our brand appears in ChatGPT and Perplexity answers.
2.5 What ongoing optimization services do you provide after launch?
2.6 Where is our data hosted, and what security certifications apply to the Adobe products you propose?
Section 3. Commercial terms
3.1 Provide your hourly rates and a not-to-exceed budget for the first year.
3.2 Describe your change control process.
3.3 Confirm your acceptance of our master services agreement.
"""

RETAIL = """Request for Information
Harbor & Pine Home Goods
Please respond to each item below.
Q1. Our online store runs on Adobe Commerce. How would you make our product pages readable by AI shopping assistants?
Q2. Shoppers abandon carts and nobody follows up. Which Adobe products and services would you use, and what would you set up?
Q3. Our product images live in AEM Assets. How do approved images reach Commerce product pages?
Q4. Describe your approach to building a storefront on Edge Delivery Services.
Q5. Provide case studies from retail clients.
Q6. What is your pricing model?
Q7. Who would be on the account team?
Q8. Describe how you report on the full customer journey across web, email and the store.
"""

MFG_HTML = """<html><body style="font-family:Arial;font-size:12pt">
<h1>RFP 2026-14: Marketing technology services</h1>
<h2>Meridian Industrial Controls</h2>
<p>Instructions: answer every question in the order given.</p>
<h3>A. Vendor profile</h3>
<p>A.1 Describe your company, ownership and office locations.</p>
<p>A.2 Provide résumés for the proposed project manager and lead architect.</p>
<p>A.3 State your professional liability insurance coverage.</p>
<h3>B. Scope of services</h3>
<p>B.1 Our marketing team runs Marketo Engage and Workfront. Describe how a campaign request in Workfront could set up a Marketo program.</p>
<p>B.2 How would you bring our Snowflake warehouse data into Customer Journey Analytics?</p>
<p>B.3 Our leaders wait days for reports. Describe how Coworker could give them readouts on request.</p>
<p>B.4 What training and adoption program do you recommend for Workfront?</p>
<p>B.5 Describe the governance model you propose for Real-Time CDP data and consent.</p>
<h3>C. Terms</h3>
<p>C.1 Provide your payment terms and invoicing schedule.</p>
<p>C.2 Describe your approach to intellectual property ownership of deliverables.</p>
</body></html>"""


def docx(path, text):
    paras = ''.join('<w:p><w:r><w:t xml:space="preserve">%s</w:t></w:r></w:p>' % l.replace('&', '&amp;').replace('<', '&lt;') for l in text.split('\n'))
    doc = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>%s</w:body></w:document>' % paras
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
        z.writestr('_rels/.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
        z.writestr('word/document.xml', doc)


open(os.path.join(HERE, 'bank_rfp.txt'), 'w', encoding='utf-8').write(BANK)
docx(os.path.join(HERE, 'retail_rfi.docx'), RETAIL)
open(os.path.join(HERE, 'mfg_rfp.html'), 'w', encoding='utf-8').write(MFG_HTML)
subprocess.run(['node', '-e', """
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+process.argv[1]);await p.pdf({path:process.argv[2],format:'Letter'});await b.close();})();
""", os.path.join(HERE, 'mfg_rfp.html'), os.path.join(HERE, 'mfg_rfp.pdf')], check=True)
os.remove(os.path.join(HERE, 'mfg_rfp.html'))
# the same bank RFP as a spreadsheet (Section, #, Question, Vendor response), the shape RFPs often arrive in; needs openpyxl
try:
    from openpyxl import Workbook
    from openpyxl.styles import Font, Alignment, PatternFill
    rows = [l for l in BANK.split('\n') if l[:1].isdigit() and '.' in l[:4]]
    extra = ['2.7 Our marketing team runs Marketo Engage. How would site forms on the new site feed Marketo, and what licensing does that need?',
             '2.8 Which Adobe products would you use to personalize the site for known customers, and how would results be measured?']
    rows = rows[:9] + extra + rows[9:]
    wb = Workbook(); ws = wb.active; ws.title = 'Questions'
    ws['A1'] = 'Northbridge Mutual Bank'; ws['A1'].font = Font(bold=True, size=14)
    ws['A2'] = 'Request for Proposal: Digital Experience Services, 2026'
    ws['A3'] = 'Instructions: answer every question in column D. Keep each answer under 300 words unless the question asks for more.'
    for c, h in enumerate(['Section', '#', 'Question', 'Vendor response'], 1):
        cell = ws.cell(row=5, column=c, value=h); cell.font = Font(bold=True, color='FFFFFF'); cell.fill = PatternFill('solid', fgColor='1C1C1C')
    section = {'1': '1. Company background', '2': '2. Adobe platform services', '3': '3. Commercial terms'}
    for r, line in enumerate(rows, 6):
        num, q = line.split(' ', 1)
        ws.cell(row=r, column=1, value=section[num[0]]); ws.cell(row=r, column=2, value=num); ws.cell(row=r, column=3, value=q).alignment = Alignment(wrap_text=True, vertical='top'); ws.cell(row=r, column=4, value='')
    for col, w in zip('ABCD', (28, 6, 90, 60)): ws.column_dimensions[col].width = w
    ws2 = wb.create_sheet('Submission'); ws2['A1'] = 'Submission checklist'; ws2['A2'] = 'Submit responses by December 5, 2026 to procurement@northbridgemutual.example'; ws2['A3'] = 'Include a signed cover letter and your certificate of insurance.'
    wb.save(os.path.join(HERE, 'bank_rfp.xlsx'))
except ImportError:
    print('openpyxl not installed: bank_rfp.xlsx not rebuilt')
# what the tests expect
json.dump({
    'bank_rfp.txt': {'questions': 12, 'adobe': ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6'], 'firm': ['1.1', '1.2', '1.3', '3.1', '3.2', '3.3']},
    'retail_rfi.docx': {'questions': 8, 'adobe': ['Q1', 'Q2', 'Q3', 'Q4', 'Q8'], 'firm': ['Q5', 'Q6', 'Q7']},
    'mfg_rfp.pdf': {'questions': 10, 'adobe': ['B.1', 'B.2', 'B.3', 'B.4', 'B.5'], 'firm': ['A.1', 'A.2', 'A.3', 'C.1', 'C.2']},
    'bank_rfp.xlsx': {'questions': 14, 'adobe': ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8'], 'firm': ['1.1', '1.2', '1.3', '3.1', '3.2', '3.3']},
}, open(os.path.join(HERE, 'expected.json'), 'w'), indent=1)
print('fixtures written:', sorted(os.listdir(HERE)))
