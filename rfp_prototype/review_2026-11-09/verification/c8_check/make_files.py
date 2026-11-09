"""Cluster c8_check (the skeptic): test files made independently of the other clusters.
Run: python3 make_files.py   (writes ./fixtures). Needs openpyxl and reportlab."""
import os
from openpyxl import Workbook
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

HERE = os.path.dirname(os.path.abspath(__file__))
FX = os.path.join(HERE, 'fixtures')
os.makedirs(FX, exist_ok=True)
W, H = letter

# ---- C2.2: Gemini's header and row, the trap row, and a natural four-row matrix
GHDR = ['Req ID', 'Category', 'Requirement Description', 'Mandatory / Desirable', 'Vendor Compliance (Y/N/P)', 'Vendor Response']


def sheet(name, rows, header=GHDR):
    wb = Workbook(); ws = wb.active; ws.title = 'Requirements'
    if header: ws.append(header)
    for r in rows: ws.append(list(r) + [None] * (len(GHDR) - len(r)))
    wb.save(os.path.join(FX, name))


sheet('c22_req04.xlsx', [('REQ-04', 'Analytics', 'Describe how Customer Journey Analytics joins paid media data with web conversions.', 'Mandatory')])
sheet('c22_trap.xlsx', [('REQ-05', 'Explain how you handle security', 'System must support SSO', 'Mandatory')])
sheet('c22_matrix.xlsx', [
    ('REQ-01', 'Content', 'Describe your approach to implementing AEM Sites.', 'Mandatory'),
    ('REQ-02', 'Content', 'The solution shall support 12 regional brands.', 'Mandatory'),
    ('REQ-03', 'Analytics', 'How would you connect Customer Journey Analytics to Brand Visibility?', 'Desirable'),
    ('REQ-04', 'Analytics', 'Describe how Customer Journey Analytics joins paid media data with web conversions.', 'Mandatory')])
# the same four rows with plain numeric IDs, the shape the reader was written for
sheet('c22_matrix_numeric.xlsx', [
    ('1', 'Content', 'Describe your approach to implementing AEM Sites.', 'Mandatory'),
    ('2', 'Content', 'The solution shall support 12 regional brands.', 'Mandatory'),
    ('3', 'Analytics', 'How would you connect Customer Journey Analytics to Brand Visibility?', 'Desirable'),
    ('4', 'Analytics', 'Describe how Customer Journey Analytics joins paid media data with web conversions.', 'Mandatory')])
# ID | Requirement | M/D only (no Category column), coded IDs
sheet('c22_two_col.xlsx', [('REQ-04', 'Describe how Customer Journey Analytics joins paid media data with web conversions.', 'Mandatory')],
      header=['Req ID', 'Requirement', 'Mandatory / Desirable'])

# ---- C2.4: DeepSeek's exact CSV, then a natural variant: a quoted cell holding two sentences (first one over 80 characters)
open(os.path.join(FX, 'c24_multiline.csv'), 'w', encoding='utf-8', newline='').write(
    'ID,Requirement,Response\r\n"R-1","The system must\nsupport real-time activation",""\r\n"R-2","Describe your approach to implementing Adobe Target.",""\r\n')
TWO = 'Describe your approach to implementing Adobe Target across our regional brands and markets.\nInclude how you would train our authors.'
open(os.path.join(FX, 'c24_two_sentences_numeric.csv'), 'w', encoding='utf-8', newline='').write(
    'ID,Requirement,Response\r\n"1","%s",""\r\n"2","Describe your approach to implementing Marketo Engage.",""\r\n' % TWO)
open(os.path.join(FX, 'c24_two_sentences_coded.csv'), 'w', encoding='utf-8', newline='').write(
    'ID,Requirement,Response\r\n"R-1","%s",""\r\n"R-2","Describe your approach to implementing Marketo Engage.",""\r\n' % TWO)
wb = Workbook(); ws = wb.active; ws.title = 'Requirements'
ws.append(['ID', 'Requirement', 'Response']); ws.append(['1', TWO, None]); ws.append(['2', 'Describe your approach to implementing Marketo Engage.', None])
wb.save(os.path.join(FX, 'c24_two_sentences.xlsx'))

# ---- C2.5: a question over a page break with a running header, a table PDF, a PDF with no text layer
c = canvas.Canvas(os.path.join(FX, 'c25_split.pdf'), pagesize=letter)
c.setFont('Helvetica', 9); c.drawString(36, H - 40, 'Harbor & Pine Home Goods RFI 2026 Page 1')
c.setFont('Helvetica-Bold', 11); c.drawString(36, H - 80, 'Section 3. Adobe platform services')
c.setFont('Helvetica', 9)
y = H - 110
for l in ['3.1 Describe your approach to implementing Adobe Experience Manager Sites.',
          '3.2 How would you migrate our existing content?',
          '3.3 Describe how you would connect our Customer Journey Analytics data to Brand Visibility, and which teams on our side']:
    c.drawString(36, y, l); y -= 18
c.showPage()
c.setFont('Helvetica', 9); c.drawString(36, H - 40, 'Harbor & Pine Home Goods RFI 2026 Page 2')
c.drawString(36, H - 80, 'would need to be involved?')
c.drawString(36, H - 98, '3.4 Describe your training approach for AEM Sites authors.')
c.save()
styles = getSampleStyleSheet()
d = SimpleDocTemplate(os.path.join(FX, 'c25_table.pdf'), pagesize=letter)
data = [['No.', 'Requirement', 'Response'],
        ['3.4', 'The solution shall support multi-site management across 12 regional brands.', ''],
        ['3.5', 'Describe your approach to implementing AEM Sites.', '']]
tb = Table(data, colWidths=[40, 380, 100]); tb.setStyle(TableStyle([('GRID', (0, 0), (-1, -1), 0.5, colors.black), ('FONTSIZE', (0, 0), (-1, -1), 9)]))
d.build([Paragraph('Section 3. Scope of services', styles['Heading2']), Spacer(1, 12), tb])
c = canvas.Canvas(os.path.join(FX, 'c25_scan.pdf'), pagesize=letter)
c.rect(36, 36, W - 72, H - 72); c.setFillGray(0.8); c.rect(60, H - 200, 300, 120, fill=1); c.showPage(); c.save()
print('written:', sorted(os.listdir(FX)))
