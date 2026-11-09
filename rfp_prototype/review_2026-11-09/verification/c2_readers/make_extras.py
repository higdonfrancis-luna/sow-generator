"""Extra test files for cluster c2_readers (adjacent findings). Run: python3 make_extras.py"""
import os, subprocess
from openpyxl import Workbook
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
HERE = os.path.dirname(os.path.abspath(__file__)); FX = os.path.join(HERE, 'fixtures')
W, H = letter

# X1: Priority column before the requirement, and a filled Comply column (single-letter cells meet readSheet's numbering rule)
wb = Workbook(); ws = wb.active; ws.title = 'Requirements'
ws.append(['Req ID', 'Priority', 'Requirement', 'Comply (Y/N/P)', 'Vendor response'])
ws.append(['1', 'M', 'Describe how Customer Journey Analytics joins paid media data with web conversions.', 'Y', None])
ws.append(['2', 'D', 'Describe your approach to migrating content into AEM Sites.', 'P', None])
wb.save(os.path.join(FX, 'priority_first.xlsx'))
# X1b: numeric IDs, requirement, then Priority and a filled Comply column after it
wb = Workbook(); ws = wb.active; ws.title = 'Requirements'
ws.append(['Req ID', 'Requirement', 'Priority', 'Comply (Y/N/P)', 'Vendor response'])
ws.append(['1', 'Describe how Customer Journey Analytics joins paid media data with web conversions.', 'M', 'Y', None])
ws.append(['2', 'Describe your approach to migrating content into AEM Sites.', 'D', 'P', None])
wb.save(os.path.join(FX, 'numeric_ids_comply.xlsx'))

# X2: a two-sentence question that wraps at the sentence boundary (PDF), beside the one-line version
c = canvas.Canvas(os.path.join(FX, 'wrap_sentence.pdf'), pagesize=letter); c.setFont('Helvetica', 10)
c.drawString(36, H - 80, 'Section 2. Adobe platform services')
c.drawString(36, H - 100, '2.3 Our customers have complex questions about accounts, policies and rates. How would Brand')
c.drawString(36, H - 114, 'Concierge answer them from approved sources?')
c.drawString(36, H - 140, '2.4 Our customers have complex questions about accounts, policies and rates.')
c.drawString(36, H - 154, 'How would Brand Concierge answer them from approved sources?')
c.showPage(); c.save()

# X3: a two-column PDF page (left and right columns share the same baseline)
c = canvas.Canvas(os.path.join(FX, 'two_columns.pdf'), pagesize=letter); c.setFont('Helvetica', 9)
left = ['3.1 Describe your approach to', 'implementing AEM Sites.', '', '3.2 How would you migrate our', 'existing content?']
right = ['3.3 What ongoing optimization', 'services do you provide after', 'launch?', '', '3.4 Describe your training plan.']
y = H - 80
for l, r in zip(left, right):
    if l: c.drawString(36, y, l)
    if r: c.drawString(320, y, r)
    y -= 14
c.showPage(); c.save()

# X4: a Chromium-printed PDF with a letter-spaced running header (the way Opus's PDFs were probably made)
html = os.path.join(FX, 'chromium_header.html')
open(html, 'w', encoding='utf-8').write('''<html><body style="font-family:Arial;font-size:11pt">
<div style="letter-spacing:2px;font-variant:small-caps;font-size:9pt;color:#555">Northbridge Mutual Bank RFP 2026 Page 2</div>
<p>would need to be involved?</p>
<p>3.5 Describe your training approach for AEM Sites authors.</p>
<p style="word-spacing:6px;letter-spacing:1px">3.6 How would you connect Customer Journey Analytics to Brand Visibility?</p>
</body></html>''')
subprocess.run(['node', '-e', """
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+process.argv[1]);await p.pdf({path:process.argv[2],format:'Letter'});await b.close();})();
""", html, os.path.join(FX, 'chromium_header.pdf')], check=True)
os.remove(html)
print('extras written')
