#!/usr/bin/env python3
"""Seed the live DataHub quickstart with LineageMedic's Fiction Retail graph."""

from __future__ import annotations

import json
import time
from dataclasses import dataclass
from typing import Iterable

from datahub.cli.config_utils import load_client_config
from datahub.emitter import mce_builder as builder
from datahub.emitter.mcp import MetadataChangeProposalWrapper
from datahub.emitter.rest_emitter import DatahubRestEmitter
from datahub.metadata import schema_classes as schema
from datahub.metadata.urns import QueryUrn


ACTOR = builder.make_user_urn("datahub")
NOW_MS = int(time.time() * 1000)
AUDIT = schema.AuditStampClass(time=NOW_MS, actor=ACTOR)


@dataclass(frozen=True)
class DatasetSpec:
    urn: str
    name: str
    description: str
    owner: str
    domain: str
    repository: str
    file: str
    fields: tuple[tuple[str, str, str], ...]


def mcp(urn: str, aspect: object) -> MetadataChangeProposalWrapper:
    return MetadataChangeProposalWrapper(entityUrn=urn, aspect=aspect)


def ownership(group_name: str) -> schema.OwnershipClass:
    return schema.OwnershipClass(
        owners=[
            schema.OwnerClass(
                owner=builder.make_group_urn(group_name),
                type=schema.OwnershipTypeClass.TECHNICAL_OWNER,
            )
        ],
        lastModified=AUDIT,
    )


def schema_fields(
    fields: Iterable[tuple[str, str, str]],
) -> list[schema.SchemaFieldClass]:
    result: list[schema.SchemaFieldClass] = []
    for field_path, native_type, description in fields:
        logical_type = (
            schema.NumberTypeClass()
            if native_type in {"BIGINT", "DECIMAL", "DOUBLE"}
            else schema.StringTypeClass()
        )
        result.append(
            schema.SchemaFieldClass(
                fieldPath=field_path,
                type=schema.SchemaFieldDataTypeClass(type=logical_type),
                nativeDataType=native_type,
                nullable=False if field_path == "order_id" else True,
                description=description,
                isPartOfKey=field_path == "order_id",
            )
        )
    return result


def dataset_mcps(spec: DatasetSpec) -> list[MetadataChangeProposalWrapper]:
    return [
        mcp(
            spec.urn,
            schema.DatasetPropertiesClass(
                name=spec.name,
                qualifiedName=spec.urn,
                description=spec.description,
                customProperties={
                    "repository": spec.repository,
                    "file": spec.file,
                    "demo": "LineageMedic Fiction Retail",
                },
            ),
        ),
        mcp(
            spec.urn,
            schema.SchemaMetadataClass(
                schemaName=spec.name,
                platform=builder.make_data_platform_urn("dbt"),
                version=0,
                hash="",
                platformSchema=schema.OtherSchemaClass(
                    rawSchema="\n".join(
                        f"{name} {native_type}"
                        for name, native_type, _ in spec.fields
                    )
                ),
                fields=schema_fields(spec.fields),
                created=AUDIT,
                lastModified=AUDIT,
            ),
        ),
        mcp(spec.urn, ownership(spec.owner)),
        mcp(
            spec.urn,
            schema.DomainsClass(domains=[builder.make_domain_urn(spec.domain)]),
        ),
        mcp(spec.urn, schema.SubTypesClass(typeNames=["dbt"])),
    ]


def fine_grained_lineage(upstream: str, downstream: str) -> schema.FineGrainedLineageClass:
    return schema.FineGrainedLineageClass(
        upstreamType=schema.FineGrainedLineageUpstreamTypeClass.FIELD_SET,
        downstreamType=schema.FineGrainedLineageDownstreamTypeClass.FIELD,
        upstreams=[builder.make_schema_field_urn(upstream, "shipping_country")],
        downstreams=[builder.make_schema_field_urn(downstream, "shipping_country")],
        transformOperation="Preserve the shipping_country compatibility field during the rename",
        confidenceScore=1.0,
    )


def main() -> None:
    orders = builder.make_dataset_urn("dbt", "fiction_retail.orders", "PROD")
    shipping = builder.make_dataset_urn(
        "dbt", "fulfillment.shipping_performance", "PROD"
    )
    revenue = builder.make_dataset_urn("dbt", "finance.revenue_by_market", "PROD")

    specs = [
        DatasetSpec(
            urn=orders,
            name="orders",
            description=(
                "Canonical Fiction Retail order model. The proposed change renames "
                "shipping_country to country_code."
            ),
            owner="retail-platform",
            domain="commerce",
            repository="fiction-retail/warehouse",
            file="models/core/orders.sql",
            fields=(
                ("order_id", "BIGINT", "Unique order identifier"),
                ("customer_id", "BIGINT", "Customer identifier"),
                ("order_ts", "TIMESTAMP", "Order creation timestamp"),
                ("shipping_country", "VARCHAR", "Current public shipping-country contract"),
                ("gross_revenue", "DECIMAL", "Gross order revenue"),
            ),
        ),
        DatasetSpec(
            urn=shipping,
            name="shipping_performance",
            description=(
                "Daily fulfillment model grouped by shipping_country and consumed "
                "by operations leadership."
            ),
            owner="fulfillment-analytics",
            domain="operations",
            repository="fiction-retail/fulfillment-analytics",
            file="models/marts/shipping_performance.sql",
            fields=(
                ("shipping_country", "VARCHAR", "Public grouping dimension"),
                ("orders_count", "BIGINT", "Orders shipped"),
                ("avg_delivery_days", "DOUBLE", "Average delivery duration"),
            ),
        ),
        DatasetSpec(
            urn=revenue,
            name="revenue_by_market",
            description=(
                "Board-reporting finance model that publishes revenue by shipping_country."
            ),
            owner="finance-data",
            domain="finance",
            repository="fiction-retail/finance-metrics",
            file="models/revenue/revenue_by_market.sql",
            fields=(
                ("shipping_country", "VARCHAR", "Market dimension retained for compatibility"),
                ("gross_revenue", "DECIMAL", "Gross revenue by market"),
                ("orders_count", "BIGINT", "Order count by market"),
            ),
        ),
    ]

    proposals: list[MetadataChangeProposalWrapper] = []

    domains = {
        "commerce": "Commerce",
        "operations": "Operations",
        "finance": "Finance",
    }
    for domain_id, display_name in domains.items():
        proposals.append(
            mcp(
                builder.make_domain_urn(domain_id),
                schema.DomainPropertiesClass(
                    name=display_name,
                    description=f"Fiction Retail {display_name} domain",
                    created=AUDIT,
                ),
            )
        )

    groups = {
        "retail-platform": "Retail Platform",
        "fulfillment-analytics": "Fulfillment Analytics",
        "finance-data": "Finance Data",
        "fulfillment-platform": "Fulfillment Platform",
        "ops-leadership": "Ops Leadership",
        "fpa": "FP&A",
    }
    for group_id, display_name in groups.items():
        proposals.append(
            mcp(
                builder.make_group_urn(group_id),
                schema.CorpGroupInfoClass(
                    admins=[],
                    members=[],
                    groups=[],
                    displayName=display_name,
                    description=f"Owner group for the LineageMedic demo: {display_name}",
                ),
            )
        )

    for spec in specs:
        proposals.extend(dataset_mcps(spec))

    proposals.extend(
        [
            mcp(
                shipping,
                schema.UpstreamLineageClass(
                    upstreams=[
                        schema.UpstreamClass(
                            dataset=orders,
                            type=schema.DatasetLineageTypeClass.TRANSFORMED,
                            auditStamp=AUDIT,
                        )
                    ],
                    fineGrainedLineages=[fine_grained_lineage(orders, shipping)],
                ),
            ),
            mcp(
                revenue,
                schema.UpstreamLineageClass(
                    upstreams=[
                        schema.UpstreamClass(
                            dataset=orders,
                            type=schema.DatasetLineageTypeClass.TRANSFORMED,
                            auditStamp=AUDIT,
                        )
                    ],
                    fineGrainedLineages=[fine_grained_lineage(orders, revenue)],
                ),
            ),
        ]
    )

    flow = builder.make_data_flow_urn("airflow", "fiction-retail", "prod")
    job = builder.make_data_job_urn(
        "airflow", "fiction-retail", "fulfillment_daily", "prod"
    )
    proposals.extend(
        [
            mcp(
                flow,
                schema.DataFlowInfoClass(
                    name="Fiction Retail",
                    description="Daily Fiction Retail analytics orchestration",
                    project="fiction-retail",
                    env="PROD",
                ),
            ),
            mcp(
                job,
                schema.DataJobInfoClass(
                    name="fulfillment_daily",
                    type="BATCH",
                    description="Runs shipping_performance before the 06:00 SLA",
                    flowUrn=flow,
                    env="PROD",
                    customProperties={"schedule": "0 5 * * *", "sla": "06:00 UTC"},
                ),
            ),
            mcp(
                job,
                schema.DataJobInputOutputClass(
                    inputDatasets=[orders],
                    outputDatasets=[shipping],
                    inputDatasetFields=[
                        builder.make_schema_field_urn(orders, "shipping_country")
                    ],
                    outputDatasetFields=[
                        builder.make_schema_field_urn(shipping, "shipping_country")
                    ],
                    fineGrainedLineages=[fine_grained_lineage(orders, shipping)],
                ),
            ),
            mcp(job, ownership("fulfillment-platform")),
            mcp(job, schema.DomainsClass(domains=[builder.make_domain_urn("operations")])),
        ]
    )

    delivery_dashboard = builder.make_dashboard_urn(
        "looker", "fulfillment_delivery_health"
    )
    finance_dashboard = builder.make_dashboard_urn("powerbi", "global_revenue_pulse")
    stamps = schema.ChangeAuditStampsClass(created=AUDIT, lastModified=AUDIT)
    proposals.extend(
        [
            mcp(
                delivery_dashboard,
                schema.DashboardInfoClass(
                    title="Delivery health",
                    description="Operations dashboard with 46 weekly viewers",
                    lastModified=stamps,
                    datasets=[shipping],
                    customProperties={"weekly_viewers": "46", "tier": "production"},
                ),
            ),
            mcp(delivery_dashboard, ownership("ops-leadership")),
            mcp(
                delivery_dashboard,
                schema.DomainsClass(domains=[builder.make_domain_urn("operations")]),
            ),
            mcp(
                finance_dashboard,
                schema.DashboardInfoClass(
                    title="Global revenue pulse",
                    description="Board-reporting dashboard with 19 weekly viewers",
                    lastModified=stamps,
                    datasets=[revenue],
                    customProperties={"weekly_viewers": "19", "audience": "board"},
                ),
            ),
            mcp(finance_dashboard, ownership("fpa")),
            mcp(
                finance_dashboard,
                schema.DomainsClass(domains=[builder.make_domain_urn("finance")]),
            ),
        ]
    )

    query_specs = [
        (
            "lineage-medic-orders-country-usage",
            orders,
            "Orders grouped by shipping country",
            "select shipping_country, count(*) from analytics.orders group by 1",
            42,
        ),
        (
            "lineage-medic-fulfillment-country-usage",
            shipping,
            "Delivery performance by shipping country",
            "select shipping_country, avg_delivery_days from analytics.shipping_performance",
            21,
        ),
        (
            "lineage-medic-finance-country-usage",
            revenue,
            "Revenue reporting by shipping country",
            "select shipping_country, gross_revenue from finance.revenue_by_market",
            9,
        ),
    ]
    for query_id, subject, name, statement, query_count in query_specs:
        query_urn = str(QueryUrn(query_id))
        proposals.extend(
            [
                mcp(
                    query_urn,
                    schema.QueryPropertiesClass(
                        statement=schema.QueryStatementClass(
                            value=statement,
                            language=schema.QueryLanguageClass.SQL,
                        ),
                        source=schema.QuerySourceClass.SYSTEM,
                        created=AUDIT,
                        lastModified=AUDIT,
                        name=name,
                        description=(
                            "Synthetic observed-query evidence for the LineageMedic "
                            "Fiction Retail hackathon scenario."
                        ),
                        customProperties={"demo": "LineageMedic Fiction Retail"},
                    ),
                ),
                mcp(
                    query_urn,
                    schema.QuerySubjectsClass(
                        subjects=[
                            schema.QuerySubjectClass(entity=subject),
                            schema.QuerySubjectClass(
                                entity=builder.make_schema_field_urn(
                                    subject, "shipping_country"
                                )
                            ),
                        ]
                    ),
                ),
                mcp(
                    query_urn,
                    schema.QueryUsageStatisticsClass(
                        timestampMillis=NOW_MS,
                        eventGranularity=schema.TimeWindowSizeClass(
                            unit=schema.CalendarIntervalClass.DAY,
                            multiple=1,
                        ),
                        queryCount=query_count,
                        lastExecutedAt=NOW_MS,
                        uniqueUserCount=3,
                    ),
                ),
            ]
        )

    config = load_client_config()
    emitter = DatahubRestEmitter(
        gms_server=config.server,
        token=config.token,
        connect_timeout_sec=10,
        read_timeout_sec=30,
    )
    emitter.test_connection()
    for proposal in proposals:
        emitter.emit(proposal)
    emitter.close()

    print(
        json.dumps(
            {
                "status": "seeded",
                "proposalCount": len(proposals),
                "datasets": [orders, shipping, revenue],
                "dataJob": job,
                "dashboards": [delivery_dashboard, finance_dashboard],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
