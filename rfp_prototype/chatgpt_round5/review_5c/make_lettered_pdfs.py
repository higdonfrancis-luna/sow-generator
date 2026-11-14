import sys
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
ss=getSampleStyleSheet()
out,lim=sys.argv[1],sys.argv[2]
st=[Paragraph("Request for Information: Harbor Credit Union Website",ss['Title']),Paragraph("Harbor Credit Union invites qualified partners to respond.",ss['Normal'])]
st+=[Paragraph("A. Public Website",ss['Heading2']),Paragraph(lim,ss['Normal']),
 Paragraph("A.1 Describe how you would build our new public website on AEM Sites with Edge Delivery Services.",ss['Normal']),
 Paragraph("A.2 Explain your approach to migrating about 4,000 pages from our current WordPress site into AEM Sites.",ss['Normal']),
 Paragraph("B. Analytics",ss['Heading2']),
 Paragraph("B.1 Describe how you would implement Customer Journey Analytics for web and app data.",ss['Normal'])]
SimpleDocTemplate(out,pagesize=letter).build(st)
