# Verified live evidence

`live-datahub-read-run.json` is a sanitized run manifest captured on July 16, 2026 from LineageMedic connected to a self-hosted DataHub Quickstart through the official `mcp-server-datahub` stdio server.

The capture proves that the run:

- called `get_lineage` for `orders.shipping_country` with three downstream hops;
- requested six DataHub entities across dbt, Airflow, Looker, and Power BI;
- retrieved an observed SQL query attached to the `shipping_country` schema field;
- generated four patches across three isolated repository copies;
- passed SQL parsing, dbt reference, contract, and lineage-coverage gates; and
- staged, but did not persist, `save_document` without explicit approval.

The file was checked for tokens, authorization headers, passwords, local paths, email addresses, and hostnames before publication. The source catalog is the synthetic Fiction Retail scenario and contains no private organizational metadata.

Recreate the catalog with [`scripts/seed-fiction-retail.py`](../../scripts/seed-fiction-retail.py), then follow [`docs/live-datahub-setup.md`](../../docs/live-datahub-setup.md).
