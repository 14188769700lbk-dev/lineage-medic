# LM-204 target repository baseline

This branch is the immutable review base for the LineageMedic `LM-204`
generated-repair pull request. The three small dbt projects mirror the producer,
fulfillment, and finance repositories used by the campaign.

The repair branch is produced from DataHub lineage, schema, ownership, and
observed-query context. Reviewers should compare the generated branch against
this baseline; the application source and its test fixtures remain unchanged.
