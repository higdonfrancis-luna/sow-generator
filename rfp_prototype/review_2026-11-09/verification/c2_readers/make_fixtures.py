"""Test files for cluster c2_readers (file readers of the RFP Builder prototype). Run: python3 make_fixtures.py
Writes into ./fixtures. Needs openpyxl, python-docx, reportlab."""
import os, json
from openpyxl import Workbook
from docx import Document
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

HERE = os.path.dirname(os.path.abspath(__file__))
FX = os.path.join(HERE, 'fixtures')
os.makedirs(FX, exist_ok=True)
made = {}

# ---- C2.1 requirements.xlsx: a compliance matrix with two sheets
HDR = ['Req ID', 'Category', 'Requirement', 'Priority', 'Comply (Y/N/P)', 'Vendor response']
FR = [('FR-01', 'Analytics', 'Describe how Customer Journey Analytics joins paid media data with web conversions.', 'M'),
      ('FR-02', 'Content', 'The solution shall support multi-site management across 12 brands.', 'M'),
      ('FR-03', 'Content', 'Describe your approach to migrating content into AEM Sites.', 'M'),
      ('FR-04', 'Hosting', 'The platform must publish to a CDN with purge on publish.', 'D'),
      ('FR-05', 'Security', 'Vendor shall provide role-based access in Experience Platform.', 'M'),
      ('FR-06', 'Personalization', 'The solution should support A/B testing of offers.', 'D')]
SEC = [('SEC-01', 'Security', 'Do you support single sign-on with SAML 2.0?', 'M'),
       ('SEC-02', 'Security', 'Describe your data retention policy.', 'M')]
wb = Workbook(); ws = wb.active; ws.title = 'Requirements'
ws.append(HDR)
for rid, cat, req, pri in FR: ws.append([rid, cat, req, pri, None, None])
ws2 = wb.create_sheet('Security'); ws2.append(HDR)
for rid, cat, req, pri in SEC: ws2.append([rid, cat, req, pri, None, None])
wb.save(os.path.join(FX, 'requirements.xlsx'))
# the same matrix as tab-separated text (two variants: one block, and a blank line between the sheets)
tsv_rows = lambda rows: '\n'.join(['\t'.join(HDR)] + ['\t'.join([rid, cat, req, pri, '', '']) for rid, cat, req, pri in rows])
one_block = tsv_rows(FR) + '\n' + tsv_rows(SEC) + '\n'
two_blocks = tsv_rows(FR) + '\n\n' + tsv_rows(SEC) + '\n'
open(os.path.join(FX, 'requirements_one_block.tsv'), 'w', encoding='utf-8').write(one_block)
open(os.path.join(FX, 'requirements_two_blocks.tsv'), 'w', encoding='utf-8').write(two_blocks)
made['C2.1'] = ['requirements.xlsx', 'requirements_one_block.tsv', 'requirements_two_blocks.tsv']

# ---- C2.2 Gemini's exact row, with Gemini's header; the trap row; and both again with a numeric ID (variant)
GHDR = ['Req ID', 'Category', 'Requirement Description', 'Mandatory / Desirable', 'Vendor Compliance (Y/N/P)', 'Vendor Response']
def sheet(path, rows, header=GHDR):
    wb = Workbook(); ws = wb.active; ws.title = 'Requirements'
    if header: ws.append(header)
    for r in rows: ws.append(list(r) + [None] * (6 - len(r)))
    wb.save(path)
sheet(os.path.join(FX, 'req04.xlsx'), [('REQ-04', 'Analytics', 'Describe how Customer Journey Analytics joins paid media data with web conversions.', 'Mandatory')])
sheet(os.path.join(FX, 'req04_noheader.xlsx'), [('REQ-04', 'Analytics', 'Describe how Customer Journey Analytics joins paid media data with web conversions.', 'Mandatory')], header=None)
sheet(os.path.join(FX, 'trap.xlsx'), [('REQ-05', 'Explain how you handle security', 'System must support SSO', 'Mandatory')])
sheet(os.path.join(FX, 'trap_noheader.xlsx'), [('REQ-05', 'Explain how you handle security', 'System must support SSO', 'Mandatory')], header=None)
sheet(os.path.join(FX, 'trap_numeric_id.xlsx'), [('4.2', 'Explain how you handle security', 'System must support SSO', 'Mandatory')])
sheet(os.path.join(FX, 'req04_numeric_id.xlsx'), [('4.1', 'Analytics', 'Describe how Customer Journey Analytics joins paid media data with web conversions.', 'Mandatory')])
made['C2.2'] = ['req04.xlsx', 'req04_noheader.xlsx', 'trap.xlsx', 'trap_noheader.xlsx', 'trap_numeric_id.xlsx', 'req04_numeric_id.xlsx']

# ---- C2.3 table.docx: a Word table No. | Question | Response
doc = Document()
doc.add_heading('Section 4. Adobe platform services', level=2)
t = doc.add_table(rows=1, cols=3); t.style = 'Table Grid'
for c, h in zip(t.rows[0].cells, ['No.', 'Question', 'Response']): c.text = h
for no, q in [('4.1', 'Describe your approach to implementing AEM Sites.'), ('4.2', 'How would you connect CJA to Brand Visibility?'), ('4.3', 'The solution shall support 12 regional brands.')]:
    cells = t.add_row().cells; cells[0].text = no; cells[1].text = q; cells[2].text = ''
doc.save(os.path.join(FX, 'table.docx'))
made['C2.3'] = ['table.docx']

# ---- C2.4 multiline.csv: a quoted cell with a newline inside it
open(os.path.join(FX, 'multiline.csv'), 'w', encoding='utf-8', newline='').write(
    'ID,Requirement,Response\r\n"R-1","The system must\nsupport real-time activation",""\r\n"R-2","Describe your approach to implementing Adobe Target.",""\r\n')
# variant: the same two rows with numeric IDs, to separate the ID rule from the newline rule
open(os.path.join(FX, 'multiline_numeric.csv'), 'w', encoding='utf-8', newline='').write(
    'ID,Requirement,Response\r\n"1","The system must\nsupport real-time activation",""\r\n"2","Describe your approach to implementing Adobe Target.",""\r\n')
made['C2.4'] = ['multiline.csv', 'multiline_numeric.csv']

# ---- C2.5 (a) split.pdf: a question that runs over a page break, with a running header on page 2
W, H = letter
def split_pdf(path, header_mode='plain'):
    c = canvas.Canvas(path, pagesize=letter)
    def header(text):
        c.setFont('Helvetica', 9)
        if header_mode == 'plain': c.drawString(36, H - 40, text)
        elif header_mode == 'glyphs':   # one text object per glyph, as some generators emit running headers
            x = 36
            for ch in text:
                c.drawString(x, H - 40, ch); x += pdfmetrics.stringWidth(ch, 'Helvetica', 9) + 0.6
    header('Northbridge Mutual Bank RFP 2026 Page 1')
    c.setFont('Helvetica-Bold', 11); c.drawString(36, H - 80, 'Section 3. Adobe platform services')
    c.setFont('Helvetica', 9)
    lines = ['3.1 Describe your approach to implementing Adobe Experience Manager Sites.',
             '3.2 How would you migrate our existing content?',
             '3.3 What ongoing optimization services do you provide after launch?',
             '3.4 Describe how you would connect our Customer Journey Analytics data to Brand Visibility, and which teams on our side']
    y = H - 110
    for l in lines:
        assert pdfmetrics.stringWidth(l, 'Helvetica', 9) < W - 72, l
        c.drawString(36, y, l); y -= 18
    c.showPage()
    header('Northbridge Mutual Bank RFP 2026 Page 2')
    c.setFont('Helvetica', 9)
    c.drawString(36, H - 80, 'would need to be involved?')
    c.drawString(36, H - 98, '3.5 Describe your training approach for AEM Sites authors.')
    c.save()
split_pdf(os.path.join(FX, 'split.pdf'))
split_pdf(os.path.join(FX, 'split_glyph_header.pdf'), header_mode='glyphs')
# (b) table.pdf: a reportlab Table with a declarative row 3.4 and a question row 3.5
styles = getSampleStyleSheet()
d = SimpleDocTemplate(os.path.join(FX, 'table.pdf'), pagesize=letter)
data = [['No.', 'Requirement', 'Response'],
        ['3.4', 'The solution shall support multi-site management across 12 regional brands.', ''],
        ['3.5', 'Describe your approach to implementing AEM Sites.', '']]
tb = Table(data, colWidths=[40, 380, 100]); tb.setStyle(TableStyle([('GRID', (0, 0), (-1, -1), 0.5, colors.black), ('FONTSIZE', (0, 0), (-1, -1), 9)]))
d.build([Paragraph('Section 3. Scope of services', styles['Heading2']), Spacer(1, 12), tb])
# (c) scan.pdf: no text layer at all
c = canvas.Canvas(os.path.join(FX, 'scan.pdf'), pagesize=letter)
c.rect(36, 36, W - 72, H - 72); c.line(36, H / 2, W - 36, H / 2); c.setFillGray(0.85); c.rect(60, H - 200, 300, 120, fill=1)
c.showPage(); c.save()
made['C2.5'] = ['split.pdf', 'split_glyph_header.pdf', 'table.pdf', 'scan.pdf']

json.dump(made, open(os.path.join(FX, 'index.json'), 'w'), indent=1)
print('fixtures written:', sorted(os.listdir(FX)))
