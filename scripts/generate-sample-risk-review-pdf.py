from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "sample-schema-change-risk-review.pdf"

INK = colors.HexColor("#15231D")
MUTED = colors.HexColor("#5D6D65")
PAPER = colors.HexColor("#F7FAF8")
LINE = colors.HexColor("#D7E1DB")
CORAL = colors.HexColor("#F56F61")
CORAL_SOFT = colors.HexColor("#FFF0ED")
GREEN = colors.HexColor("#218E67")
GREEN_SOFT = colors.HexColor("#E7F6EF")
AMBER = colors.HexColor("#9A6A16")
AMBER_SOFT = colors.HexColor("#FFF6DF")
WHITE = colors.white


def stylesheet():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="ReportTitle",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=25,
            leading=29,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=7 * mm,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Eyebrow",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=11,
            textColor=CORAL,
            tracking=0.8,
            spaceAfter=2 * mm,
        )
    )
    styles.add(
        ParagraphStyle(
            name="H1Report",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=20,
            textColor=INK,
            spaceBefore=4 * mm,
            spaceAfter=3 * mm,
        )
    )
    styles.add(
        ParagraphStyle(
            name="H2Report",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            textColor=INK,
            spaceBefore=3 * mm,
            spaceAfter=2 * mm,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BodyReport",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=9.4,
            leading=13.5,
            textColor=INK,
            spaceAfter=2.6 * mm,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SmallReport",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=7.5,
            leading=10.2,
            textColor=MUTED,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TableHead",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=7.4,
            leading=9.2,
            textColor=WHITE,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TableCell",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=7.2,
            leading=9.5,
            textColor=INK,
        )
    )
    styles.add(
        ParagraphStyle(
            name="MetricValue",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=17,
            leading=19,
            alignment=TA_CENTER,
            textColor=INK,
        )
    )
    styles.add(
        ParagraphStyle(
            name="MetricLabel",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=7.2,
            leading=9,
            alignment=TA_CENTER,
            textColor=MUTED,
        )
    )
    return styles


S = stylesheet()


def p(text: str, style: str = "BodyReport") -> Paragraph:
    return Paragraph(text, S[style])


def bullet(text: str) -> Table:
    return Table(
        [[p("-", "BodyReport"), p(text, "BodyReport")]],
        colWidths=[4 * mm, 162 * mm],
        style=TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 1 * mm),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        ),
    )


def checklist(items) -> Table:
    return Table(
        [[p("[ ]", "BodyReport"), p(item, "BodyReport")] for item in items],
        colWidths=[8 * mm, 158 * mm],
        style=TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 1 * mm),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.2 * mm),
            ]
        ),
    )


def numbered(number: int, text: str) -> Table:
    badge = Table(
        [[p(str(number), "TableHead")]],
        colWidths=[7 * mm],
        rowHeights=[7 * mm],
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), CORAL),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("BOX", (0, 0), (-1, -1), 0.5, CORAL),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        ),
    )
    return Table(
        [[badge, p(text)]],
        colWidths=[11 * mm, 155 * mm],
        style=TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 1 * mm),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2 * mm),
            ]
        ),
    )


def data_table(headers, rows, widths, row_backgrounds=None):
    body = [[p(cell, "TableHead") for cell in headers]]
    body.extend([[p(cell, "TableCell") for cell in row] for row in rows])
    commands = [
        ("BACKGROUND", (0, 0), (-1, 0), INK),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.35, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 2 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 2 * mm),
        ("TOPPADDING", (0, 0), (-1, -1), 1.7 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1.7 * mm),
    ]
    for row_index in range(1, len(body)):
        fill = PAPER if row_index % 2 else WHITE
        commands.append(("BACKGROUND", (0, row_index), (-1, row_index), fill))
    if row_backgrounds:
        for row_index, fill in row_backgrounds.items():
            commands.append(("BACKGROUND", (0, row_index), (-1, row_index), fill))
    return Table(body, colWidths=widths, repeatRows=1, style=TableStyle(commands))


def callout(label: str, text: str, background, accent) -> Table:
    return Table(
        [[p(label, "Eyebrow"), p(text)]],
        colWidths=[34 * mm, 132 * mm],
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), background),
                ("BOX", (0, 0), (-1, -1), 0.7, accent),
                ("LINEBEFORE", (0, 0), (0, -1), 3, accent),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 3 * mm),
                ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm),
                ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
            ]
        ),
    )


def page_header_footer(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(INK)
    canvas.rect(0, height - 15 * mm, width, 15 * mm, stroke=0, fill=1)
    canvas.setFillColor(WHITE)
    canvas.setFont("Helvetica-Bold", 10)
    canvas.drawString(20 * mm, height - 9.5 * mm, "LineageMedic")
    canvas.setFillColor(colors.HexColor("#8FE0BE"))
    canvas.setFont("Helvetica", 7.5)
    canvas.drawRightString(width - 20 * mm, height - 9.5 * mm, "SYNTHETIC SAMPLE - LM-204")
    canvas.setStrokeColor(LINE)
    canvas.line(20 * mm, 14 * mm, width - 20 * mm, 14 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7)
    canvas.drawString(20 * mm, 9 * mm, "Schema Change Risk Review - illustrative commercial deliverable")
    canvas.drawRightString(width - 20 * mm, 9 * mm, f"Page {doc.page}")
    canvas.restoreState()


def build_story():
    story = [Spacer(1, 8 * mm)]
    story.append(p("FIXED-SCOPE RISK REVIEW", "Eyebrow"))
    story.append(p("Sample schema-change risk review", "ReportTitle"))
    story.append(
        callout(
            "DECISION STATUS",
            "Proposed for human approval. Not deployed. This report organizes observed evidence and review questions; it does not authorize a production migration.",
            AMBER_SOFT,
            AMBER,
        )
    )
    story.append(Spacer(1, 5 * mm))

    meta = [
        [p("Campaign", "TableHead"), p("LM-204 - orders.shipping_country -> country_code", "TableCell")],
        [p("Dataset", "TableHead"), p("Fiction Retail - synthetic", "TableCell")],
        [p("Purpose", "TableHead"), p("Illustrate the proposed USD 750 risk-review deliverable", "TableCell")],
        [p("Evidence base", "TableHead"), p("Sanitized DataHub MCP run against a self-hosted synthetic catalog", "TableCell")],
    ]
    story.append(
        Table(
            meta,
            colWidths=[34 * mm, 132 * mm],
            style=TableStyle(
                [
                    ("BACKGROUND", (0, 0), (0, -1), INK),
                    ("BACKGROUND", (1, 0), (1, -1), PAPER),
                    ("GRID", (0, 0), (-1, -1), 0.35, LINE),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 3 * mm),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm),
                    ("TOPPADDING", (0, 0), (-1, -1), 2.3 * mm),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 2.3 * mm),
                ]
            ),
        )
    )
    story.append(Spacer(1, 6 * mm))

    metrics = []
    for value, label in [("6", "affected assets"), ("3", "repository copies"), ("4", "repair artifacts"), ("4/4", "deterministic gates pass")]:
        metrics.append([[p(value, "MetricValue")], [p(label, "MetricLabel")]])
    metric_cells = [Table(item, colWidths=[39 * mm]) for item in metrics]
    story.append(
        Table(
            [metric_cells],
            colWidths=[41.5 * mm] * 4,
            style=TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), GREEN_SOFT),
                    ("BOX", (0, 0), (-1, -1), 0.5, GREEN),
                    ("INNERGRID", (0, 0), (-1, -1), 0.3, LINE),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
                ]
            ),
        )
    )

    story.append(p("Executive decision", "H1Report"))
    story.append(
        p(
            "Do not perform a flag-day rename. Introduce <b>country_code</b> at the producer, retain <b>shipping_country</b> as a temporary compatibility alias, migrate the internal fulfillment consumer, and preserve the public finance output name until its downstream contract is explicitly changed."
        )
    )
    story.append(
        callout(
            "DATE BOUNDARY",
            "The proposed removal date is September 1, 2026. It is a scenario input, not evidence that every consumer will be ready by then.",
            CORAL_SOFT,
            CORAL,
        )
    )
    story.append(Spacer(1, 4 * mm))
    story.append(
        p(
            "This is not a customer case study. Every asset, owner, query, and repository is synthetic. The underlying tool trace was captured against a self-hosted DataHub instance populated only with the public Fiction Retail scenario.",
            "SmallReport",
        )
    )

    story.append(PageBreak())
    story.append(p("01 / EVIDENCE", "Eyebrow"))
    story.append(p("Scope and evidence", "H1Report"))
    evidence_rows = [
        ("Observed", "DataHub column lineage returned five downstream assets across dbt, Airflow, Looker, and Power BI.", "Sanitized live run manifest"),
        ("Observed", "Six teams or stakeholder groups own the producer and downstream assets.", "DataHub entity responses"),
        ("Observed", "One catalog-attached production query still selects shipping_country.", "DataHub query evidence"),
        ("Observed", "Three lineage assets have repository/file bindings and directly use the changed field.", "Synthetic context fixture"),
        ("Observed", "The Airflow job and two dashboards have no code binding in the supplied repository set.", "Fixture bindings and entity metadata"),
        ("Inferred", "A direct producer rename could break the daily fulfillment model and board-reporting output.", "Requires owner confirmation"),
        ("Proposed", "Apply producer compatibility, direct internal migration, and public-output preservation as separate policies.", "LineageMedic policy selection"),
    ]
    story.append(data_table(["Class", "Result", "Source / boundary"], evidence_rows, [25 * mm, 99 * mm, 42 * mm]))
    story.append(Spacer(1, 5 * mm))
    story.append(
        callout(
            "EVIDENCE RULE",
            "Observed facts come from the checked tool trace and supplied repositories. Inferences require owner confirmation. Proposed actions remain unapproved until the acceptance checklist is satisfied.",
            GREEN_SOFT,
            GREEN,
        )
    )

    story.append(PageBreak())
    story.append(p("02 / DISPOSITION", "Eyebrow"))
    story.append(p("Affected assets and proposed disposition", "H1Report"))
    asset_rows = [
        ("orders", "Retail Platform", "Producer change removes current public field", "Add country_code; retain deprecated shipping_country through the review window"),
        ("shipping_performance", "Fulfillment Analytics", "Daily model groups by the legacy field", "Migrate the internal model to country_code"),
        ("revenue_by_market", "Finance Data", "Public mart exposes the legacy name", "Read country_code internally; continue publishing shipping_country"),
        ("fulfillment_daily", "Fulfillment Platform", "Schedules the affected model before 06:00", "Confirm schedule and rollback; no patch without a repository binding"),
        ("Delivery health", "Ops Leadership", "46 weekly viewers through fulfillment model", "Validate unchanged dashboard semantics after migration"),
        ("Global revenue pulse", "FP&amp;A", "Board-reporting asset with 19 weekly viewers", "Preserve output contract; require owner sign-off before later rename"),
    ]
    story.append(
        data_table(
            ["Asset", "Owner", "Evidence", "Proposed disposition"],
            asset_rows,
            [31 * mm, 31 * mm, 45 * mm, 59 * mm],
        )
    )
    story.append(Spacer(1, 5 * mm))
    story.append(
        callout(
            "MISSING BINDINGS",
            "The Airflow job and two dashboards remain review items. The supplied repositories do not contain safe patch targets for them, so LineageMedic abstains instead of inventing paths.",
            AMBER_SOFT,
            AMBER,
        )
    )

    story.append(PageBreak())
    story.append(p("03 / REPAIR PACKAGE", "Eyebrow"))
    story.append(p("Draft repair package", "H1Report"))
    story.append(p("The isolated repair step produced four review artifacts across three repository copies:"))
    repairs = [
        ("orders.sql", "Adds country_code and the temporary compatibility alias."),
        ("orders.yml", "Encodes both fields and the proposed removal date in the dbt contract."),
        ("shipping_performance.sql", "Migrates the internal fulfillment consumer."),
        ("revenue_by_market.sql", "Changes the input while preserving the public output name."),
    ]
    for idx, (name, description) in enumerate(repairs, start=1):
        story.append(numbered(idx, f"<b>{name}</b> - {description}"))

    story.append(p("Validation evidence", "H1Report"))
    validation_rows = [
        ("SQL parse", "PASS", "Three modified SQL artifacts parse after deterministic dbt rendering.", "Warehouse execution or performance"),
        ("dbt reference resolution", "PASS", "Both ref() calls resolve across copied projects.", "Full production dependency completeness"),
        ("Contract compatibility", "PASS", "Producer SQL and YAML expose both fields through the window.", "Consumer acceptance of the date"),
        ("Lineage coverage", "PASS", "All three code-bound lineage assets received a repair.", "Safety of assets without repository bindings"),
    ]
    story.append(
        data_table(
            ["Gate", "Result", "What it proves", "What it does not prove"],
            validation_rows,
            [36 * mm, 18 * mm, 61 * mm, 51 * mm],
            row_backgrounds={1: GREEN_SOFT, 2: GREEN_SOFT, 3: GREEN_SOFT, 4: GREEN_SOFT},
        )
    )

    story.append(PageBreak())
    story.append(p("04 / OWNER REVIEW", "Eyebrow"))
    story.append(p("Blocking questions for owners", "H1Report"))
    for text in [
        "<b>Retail Platform:</b> can both fields remain readable through September 1, including ingestion and warehouse retention behavior?",
        "<b>Fulfillment Analytics:</b> is the 06:00 SLA tested against the changed model and its rollback path?",
        "<b>Finance Data and FP&amp;A:</b> is shipping_country a contractual public name, and what process authorizes its eventual removal?",
        "<b>Ops Leadership:</b> which dashboard checks establish that the semantic result is unchanged?",
    ]:
        story.append(bullet(text))

    story.append(p("Recommended sequence", "H1Report"))
    sequence = [
        "Obtain owner answers and confirm or revise the removal window.",
        "Merge the producer compatibility change and contract update together.",
        "Validate both fields in the target warehouse using client-owned integration tests.",
        "Migrate the internal fulfillment model and observe its scheduled run.",
        "Keep the finance output stable while its consumers are inventoried.",
        "Treat final removal as a separate campaign with new evidence and approval.",
    ]
    for idx, text in enumerate(sequence, start=1):
        story.append(numbered(idx, text))

    story.append(PageBreak())
    story.append(p("05 / RESIDUAL RISK", "Eyebrow"))
    story.append(p("Residual risk and acceptance", "H1Report"))
    story.append(
        callout(
            "RESIDUAL RISK",
            "The supplied lineage and repositories do not prove that every consumer is cataloged. Ad hoc SQL, exports, notebooks, and downstream systems outside DataHub remain possible. This report reduces uncertainty for the observed graph; it does not certify an outage-free migration.",
            CORAL_SOFT,
            CORAL,
        )
    )
    story.append(Spacer(1, 5 * mm))
    story.append(p("Acceptance checklist", "H1Report"))
    story.append(
        checklist(
            [
                "Technical owner confirms the asset inventory and missing-evidence list.",
                "Each named owner accepts or corrects the proposed disposition.",
                "Client-owned warehouse and integration tests pass.",
                "Removal date and rollback owner are recorded.",
                "Any draft pull request is separately authorized before publication.",
            ]
        )
    )

    story.append(Spacer(1, 6 * mm))
    story.append(
        callout(
            "DELIVERY BOUNDARY",
            "The complete campaign decision and JSON run manifest remain the authoritative human- and machine-readable traces. This illustrative PDF does not replace the source evidence or a mutually accepted statement of work.",
            GREEN_SOFT,
            GREEN,
        )
    )
    story.append(Spacer(1, 10 * mm))
    story.append(p("Prepared from the public LM-204 synthetic campaign.", "SmallReport"))
    story.append(p("Public demo: https://14188769700lbk-dev.github.io/lineage-medic/", "SmallReport"))
    story.append(p("Source: https://github.com/14188769700lbk-dev/lineage-medic", "SmallReport"))
    return story


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=22 * mm,
        leftMargin=22 * mm,
        topMargin=24 * mm,
        bottomMargin=20 * mm,
        title="LineageMedic sample schema-change risk review",
        author="LineageMedic",
        subject="Synthetic LM-204 commercial deliverable sample",
    )
    doc.build(build_story(), onFirstPage=page_header_footer, onLaterPages=page_header_footer)
    print(OUTPUT)


if __name__ == "__main__":
    main()
