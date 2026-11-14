import docx, sys
from docx.shared import Pt
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
D=sys.argv[1]
# T1 Word
d=docx.Document()
d.add_heading('Request for Information: Digital Member Experience',0)
d.add_paragraph('Harrow Lake Credit Union invites responses from implementation partners.')
d.add_heading('Project Background',1)
d.add_paragraph('We run Adobe Experience Manager Sites on premises today and plan to move to the cloud. Adobe Target is out of scope and must not be proposed.')
d.add_heading('Functional Requirements',1)
t=d.add_table(rows=1,cols=3)
for c,h in zip(t.rows[0].cells,['Req ID','Requirement Description','Priority']): c.text=h
rows=[('FR-01','The solution must migrate 2,400 pages from AEM 6.5 to AEM Sites as a Cloud Service.','Mandatory'),
('FR-02','The solution must publish forms built with AEM Forms on member-facing pages.','Mandatory'),
('FR-03','Describe how you will build member audiences in Real-Time CDP from our core banking data.','Desirable'),
('FR-04','The solution should provide reports in Customer Journey Analytics for loan application drop-off.','Desirable'),
('FR-05','Explain how authors will preview and approve content before it is published.','Mandatory'),
('FR-06','The supplier must provide a test plan covering accessibility to WCAG 2.2 AA.','Mandatory')]
for r in rows:
    cells=t.add_row().cells
    for c,v in zip(cells,r): c.text=v
d.add_heading('Overview',1)
d.add_paragraph('1.1 Provide an overview of your firm and its Adobe practice.')
d.add_paragraph('1.2 Describe two comparable credit union or banking implementations.')
d.add_heading('Vendor Questions',1)
for q in ['Describe your approach to knowledge transfer to our web team.','Explain your support model after launch, including response times.','List the roles you would assign to this project.']:
    d.add_paragraph(q,style='List Number')
d.save(D+'/t1_harrow_lake.docx')

# T2 PDF
c=canvas.Canvas(D+'/t2_kingsfold.pdf',pagesize=letter); W,H=letter
pages=[[('h','1. Digital Experience'),
 ('q','1.1 Describe how you would rebuild our public site on Adobe Experience Manager Sites with Edge Delivery Services, including the templates and blocks you would create for our product pages and branch locator.'),
 ('q','1.2 Explain how our marketing editors will author pages in the Universal Editor.'),
 ('q','1.3 Describe your migration approach for our current site.'),
 ('p','A Drupal 9 site with about 3,000 pages and 40 content types runs our site today and must be retired at launch.'),
 ('q','1.4 How will you protect search rankings during the move?')],
 [('h','2. Data and Analytics'),
 ('q','2.1 Describe how you will implement Customer Journey Analytics with data from our website and call center.'),
 ('q','2.2 Explain how you would build audiences in Real-Time CDP for cross-sell campaigns.'),
 ('q','2.3 What dashboards would you deliver for the leadership team?'),
 ('h','3. Implementation'),
 ('q','3.1 Provide a project plan with milestones for a twelve month program.'),
 ('q','3.2 Describe how you will test performance and accessibility before launch.'),
 ('q','3.3 Explain how you will train our staff.')],
 [('h','4. Vendor Profile'),
 ('q','4.1 Provide three client references for similar work.'),
 ('q','4.2 Describe your Adobe partner level and certified staff.'),
 ('q','4.3 Provide your hourly rates by role.')]]
import textwrap
for n,pg in enumerate(pages,1):
    c.setFont('Helvetica',8); c.drawString(54,H-36,'Kingsfold Savings Bank | RFI KSB-2026-11 | Confidential'); c.drawRightString(W-54,36,f'Page {n} of {len(pages)}')
    y=H-80
    for kind,txt in pg:
        if kind=='h':
            c.setFont('Helvetica-Bold',13); y-=10; c.drawString(54,y,txt); y-=22
        else:
            c.setFont('Helvetica',10)
            for line in textwrap.wrap(txt,95):
                c.drawString(54 if kind=='q' else 72,y,line); y-=13
            y-=8
    c.showPage()
c.save()

# T3 pasted text
open(D+'/t3_ashgrove.txt','w').write('''Ashgrove Outdoor Co. - Partner RFI

We sell camping gear online through Adobe Commerce and want a partner to help us grow. Please answer each item below in no more than 200 words.

a) Describe how you would set up Adobe Commerce Live Search for our 9,000 product catalog.
b) Explain how you would connect Adobe Commerce to our Salesforce instance so that
A Salesforce account is created for every new B2B buyer.
c) What is your approach to testing the checkout before launch?
d) Describe how Brand Visibility would show where our products appear in AI answers.
e) Provide two references from retail clients.
f) Quote your fees for the first year.
''')
