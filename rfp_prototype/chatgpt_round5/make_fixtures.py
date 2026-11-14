"""Rebuild the Round 5 procurement documents and their independently reviewed keys.

Run python3 sow/rfp_prototype/chatgpt_round5/make_fixtures.py from any directory.
Dependencies: reportlab, python-docx, openpyxl.
"""
from collections import Counter
from io import BytesIO
from itertools import groupby
import json
from pathlib import Path
import re
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

from docx import Document
from docx.oxml import OxmlElement
from docx.shared import Inches, Pt
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import simpleSplit
from reportlab.pdfgen.canvas import Canvas

ROOT = Path(__file__).resolve().parent
FICTION = "This procurement exercise and the issuing organization are fictional."
INK, NAVY, GRAY, RULE = "#17212B", "#183E62", "#516274", "#C7D2DC"
LEFT, RIGHT, TOP, BOTTOM = 48, 564, 720, 60


def sections(spec):
    for name, items in groupby(spec["questions"], key=lambda q: q["section"]):
        rows = list(items)
        default = Counter(q["limit"] for q in rows).most_common(1)[0][0]
        heading = name if default is None else f"{name} ({default} words per response)"
        yield heading, default, rows


def requirement(q, default):
    if q["limit"] == default:
        return q["text"]
    override = "no word limit" if q["limit"] is None else f'{q["limit"]} words maximum'
    return f'{q["text"]} ({override})'


def priority(index):
    return "Desirable" if index % 4 == 2 else "Mandatory"


def brief(spec, names):
    products = ", ".join(names[item] for item in spec["products_proposed"])
    yield "Products in scope", [products]
    yield "Constraints and submission instructions", spec["not_questions"]
    yield "Milestones", [f'{m["date"]}: {m["name"]}' for m in spec["milestones"]]


class Pdf:
    def __init__(self, path, spec):
        self.spec = spec
        self.canvas = Canvas(str(path), pagesize=letter, invariant=1)
        self.canvas.setTitle(spec["title"])
        self.canvas.setAuthor(spec["client"])
        self.y = TOP
        self.start_page()

    def line(self, x, y, s, font="Helvetica", size=10, color=INK):
        self.canvas.setFont(font, size)
        self.canvas.setFillColor(HexColor(color))
        self.canvas.drawString(x, y, s)

    def start_page(self):
        c = self.canvas
        self.line(LEFT, 754, self.spec["client"], "Helvetica-Bold", 9, NAVY)
        c.drawRightString(RIGHT, 754, self.spec["reference"])
        c.setStrokeColor(HexColor(RULE))
        c.line(LEFT, 744, RIGHT, 744)
        c.line(LEFT, 47, RIGHT, 47)
        self.line(LEFT, 31, "Procurement office", size=9, color=GRAY)
        c.drawRightString(RIGHT, 31, f"Page {c.getPageNumber()}")
        self.y = TOP

    def next_page(self):
        self.canvas.showPage()
        self.start_page()

    def space(self, height):
        if self.y - height < BOTTOM:
            self.next_page()

    def paragraph(self, s, x=LEFT, width=RIGHT-LEFT, font="Helvetica", size=10,
                  leading=14, after=6, color=INK):
        lines = simpleSplit(s, font, size, width)
        self.space(len(lines) * leading)
        for line in lines:
            self.line(x, self.y, line, font, size, color)
            self.y -= leading
        self.y -= after

    def heading(self, s, x=LEFT, width=RIGHT-LEFT):
        self.space(60)
        self.paragraph(s, x, width, "Helvetica-Bold", 13, 16, 9, NAVY)


def pdf_table(pdf, heading, default, rows):
    xref, xtext, xpriority = LEFT + 4, LEFT + 49, RIGHT - 68
    pdf.heading(heading)

    def table_head():
        pdf.canvas.setFillColor(HexColor("#EDF3F8"))
        pdf.canvas.rect(LEFT, pdf.y - 5, RIGHT - LEFT, 20, fill=1, stroke=0)
        for x, text in zip((xref, xtext, xpriority), ("Ref", "Requirement", "Priority")):
            pdf.line(x, pdf.y, text, "Helvetica-Bold", 9, NAVY)
        pdf.y -= 24

    table_head()
    for i, q in enumerate(rows):
        lines = simpleSplit(requirement(q, default), "Helvetica", 10, xpriority - xtext - 12)
        if pdf.y - len(lines) * 14 < BOTTOM:
            pdf.next_page()
            table_head()
        pdf.line(xref, pdf.y, q["label"], "Helvetica-Bold")
        pdf.line(xpriority, pdf.y, priority(i), size=9)
        for line in lines:
            pdf.line(xtext, pdf.y, line)
            pdf.y -= 14
        pdf.canvas.setStrokeColor(HexColor(RULE))
        pdf.canvas.line(LEFT, pdf.y + 6, RIGHT, pdf.y + 6)
        pdf.y -= 10


def pdf_item(pdf, q, default, x, width):
    offset = 34
    lines = simpleSplit(requirement(q, default), "Helvetica", 10, width - offset)
    pdf.space(14 * len(lines))
    pdf.line(x, pdf.y, q["label"], "Helvetica-Bold")
    pdf.paragraph(requirement(q, default), x + offset, width - offset, after=10)


def pdf_columns(pdf, groups):
    gap = 27
    width = (RIGHT - LEFT - gap) / 2
    # Each half-page is a continuous body column with its own section headings.
    for i in range(0, len(groups), 2):
        if i:
            pdf.next_page()
        for side, (heading, default, rows) in enumerate(groups[i:i + 2]):
            x = LEFT + side * (width + gap)
            pdf.y = TOP
            pdf.heading(heading, x, width)
            for q in rows:
                pdf_item(pdf, q, default, x, width)


def pdf_split(pdf, groups):
    # Align the first leaf so it ends in the middle of a long response item.
    # Later leaves flow naturally. Only the first line carries its reference.
    entries = []
    for heading, default, rows in groups:
        entries.append((None, simpleSplit(heading, "Helvetica-Bold", 13, RIGHT - LEFT)))
        for q in rows:
            lines = simpleSplit(requirement(q, default), "Helvetica", 11, RIGHT - LEFT - 43)
            entries.append((q["label"], lines))
    leading = 16
    y = pdf.y
    candidates = []
    for i, (label, lines) in enumerate(entries):
        if label:
            for n in range(1, len(lines)):
                candidates.append((abs(y - n * leading - BOTTOM), i, n))
        y -= leading * len(lines) + 12
    if not candidates:
        raise ValueError("The split-page layout needs a multi-line requirement")
    _, cut_item, cut_line = min(candidates)
    for i, (label, lines) in enumerate(entries):
        for n, s in enumerate(lines):
            if (i, n) == (cut_item, cut_line):
                pdf.next_page()
            elif i > cut_item and pdf.y < BOTTOM:
                pdf.next_page()
            if label and n == 0:
                pdf.line(LEFT, pdf.y, label, "Helvetica-Bold", 11)
            pdf.line(LEFT + 43 if label else LEFT, pdf.y, s,
                     "Helvetica" if label else "Helvetica-Bold",
                     11 if label else 13, INK if label else NAVY)
            pdf.y -= leading
        pdf.y -= 12


def write_pdf(path, spec, names):
    pdf = Pdf(path, spec)
    pdf.paragraph(spec["title"], font="Helvetica-Bold", size=19, leading=23, after=7)
    pdf.paragraph(FICTION, color=GRAY, after=15)
    for heading, body in brief(spec, names):
        pdf.heading(heading)
        for s in body:
            pdf.paragraph(s)
    layout = spec["layout"]
    groups = list(sections(spec))
    if layout == "split_page":
        pdf.y -= 8
        pdf_split(pdf, groups)
    else:
        pdf.next_page()
        if layout == "two_column":
            pdf_columns(pdf, groups)
        else:
            for heading, default, rows in groups:
                if layout == "table":
                    pdf_table(pdf, heading, default, rows)
                else:
                    pdf.heading(heading)
                    if layout == "paragraph":
                        for i in range(0, len(rows), 3):
                            pdf.paragraph(" ".join(requirement(q, default) for q in rows[i:i+3]),
                                          size=11, leading=16, after=12)
                    else:
                        for q in rows:
                            pdf_item(pdf, q, default, LEFT, RIGHT - LEFT)
                pdf.y -= 6
    pdf.canvas.save()


def stable_package(path, package):
    # Office writers put the current time both inside core.xml and on ZIP entries.
    with ZipFile(package) as source, ZipFile(path, "w", ZIP_DEFLATED) as target:
        for name in sorted(source.namelist()):
            data = source.read(name)
            if name == "docProps/core.xml":
                data = re.sub(rb'(<dcterms:(?:created|modified)\b[^>]*>)[^<]+',
                              rb'\g<1>2026-11-14T00:00:00Z', data)
            entry = ZipInfo(name, (2026, 11, 14, 0, 0, 0))
            target.writestr(entry, data, compress_type=ZIP_DEFLATED)


def write_docx(path, spec, names):
    doc = Document()
    section = doc.sections[0]
    section.left_margin = section.right_margin = Inches(0.8)
    section.header.paragraphs[0].text = spec["client"] + "  |  " + spec["reference"]
    doc.styles["Normal"].font.name = "Calibri"
    doc.styles["Normal"].font.size = Pt(11)
    doc.add_paragraph(spec["title"], "Title")
    doc.add_paragraph(FICTION)
    for heading, body in brief(spec, names):
        doc.add_heading(heading, 2)
        for s in body:
            doc.add_paragraph(s)
    doc.add_page_break()

    # Use Word's actual numbering definitions. The reference is not part of w:t.
    if spec["layout"] == "doc_numbered":
        numbering = doc.part.numbering_part.element
        abstract = numbering.xpath(
            './w:abstractNum[w:lvl/w:pStyle[@w:val="ListNumber"]]'
        )[0]
        abstract_id = abstract.get("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}abstractNumId")
        num_id = numbering.add_num(int(abstract_id)).numId
    for heading, default, rows in sections(spec):
        doc.add_heading(heading, 1)
        if spec["layout"] == "doc_table":
            table = doc.add_table(rows=1, cols=3)
            table.style = "Light Shading Accent 1"
            table.autofit = False
            widths = (0.65, 5.2, 1.05)
            for col, w in zip(table.columns, widths):
                col.width = Inches(w)
            for cell, name in zip(table.rows[0].cells, ("Ref", "Requirement", "Priority")):
                cell.text = name
            table.rows[0]._tr.get_or_add_trPr().append(OxmlElement("w:tblHeader"))
            for i, q in enumerate(rows):
                cells = table.add_row().cells
                for cell, value in zip(cells, (q["label"], requirement(q, default), priority(i))):
                    cell.text = value
            for row in table.rows:
                for cell, w in zip(row.cells, widths):
                    cell.width = Inches(w)
                row._tr.get_or_add_trPr().append(OxmlElement("w:cantSplit"))
        else:
            for q in rows:
                p = doc.add_paragraph(requirement(q, default), "List Number")
                numpr = p._p.get_or_add_pPr().get_or_add_numPr()
                numpr.get_or_add_ilvl().val = 0
                numpr.get_or_add_numId().val = num_id
    package = BytesIO()
    doc.save(package)
    stable_package(path, package)


def write_xlsx(path, spec, names):
    book = Workbook()
    instructions = book.active
    instructions.title = "Instructions"
    instructions.column_dimensions["A"].width = 108
    instructions.append([spec["title"]])
    instructions.append([spec["client"]])
    instructions.append([spec["reference"]])
    instructions.append([FICTION])
    for heading, body in brief(spec, names):
        instructions.append([heading])
        instructions.cell(instructions.max_row, 1).font = Font(bold=True, color="183E62")
        for s in body:
            instructions.append([s])
    for row in instructions:
        row[0].alignment = Alignment(vertical="center", wrap_text=True)
        instructions.row_dimensions[row[0].row].height = 18 * max(1, (len(row[0].value) + 99) // 100)
    sheet = book.create_sheet("Response form")
    sheet.append(["Ref", "Requirement", "Mandatory", "Response"])
    sheet.freeze_panes = "B2"
    for col, width in zip("ABCD", (13, 82, 16, 48)):
        sheet.column_dimensions[col].width = width
    for cell in sheet[1]:
        cell.font = Font(bold=True, color="FFFFFF")
        cell.fill = PatternFill("solid", fgColor="183E62")
    for heading, default, rows in sections(spec):
        sheet.append([heading])
        index = sheet.max_row
        sheet.merge_cells(start_row=index, start_column=1, end_row=index, end_column=4)
        sheet.cell(index, 1).font = Font(bold=True, color="183E62")
        sheet.cell(index, 1).fill = PatternFill("solid", fgColor="EDF3F8")
        for i, q in enumerate(rows):
            s = requirement(q, default)
            sheet.append([q["label"], s, priority(i), None])
            for cell in sheet[sheet.max_row]:
                cell.alignment = Alignment(vertical="top", wrap_text=True)
            sheet.row_dimensions[sheet.max_row].height = 18 * (1 + len(s) // 75)
    sheet.print_title_rows = "1:1"
    package = BytesIO()
    book.save(package)
    stable_package(path, package)


def main():
    specs = json.loads((ROOT / "fixtures_source.json").read_text(encoding="utf-8"))
    catalog = json.loads((ROOT.parents[1] / "canvas/catalog.json").read_text(encoding="utf-8"))
    names = {p["id"]: p["name"] for p in catalog["products"]}
    (ROOT / "fixtures").mkdir(exist_ok=True)
    (ROOT / "gold").mkdir(exist_ok=True)
    for spec in specs:
        path = ROOT / spec["file"]
        writer = {".pdf": write_pdf, ".docx": write_docx, ".xlsx": write_xlsx}[path.suffix]
        writer(path, spec, names)
        key = {field: value for field, value in spec.items() if field != "layout"}
        (ROOT / "gold" / (path.stem + ".json")).write_text(
            json.dumps(key, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )


if __name__ == "__main__":
    main()
