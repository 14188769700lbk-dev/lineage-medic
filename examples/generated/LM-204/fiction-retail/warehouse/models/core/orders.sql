-- Proposed output in warehouse PR #204: shipping_country -> country_code.
select
  order_id,
  customer_id,
  upper(shipping_country) as country_code,
  shipping_country as shipping_country, -- compatibility until 2026-09-01
  total_amount,
  delivery_days
from {{ source('retail', 'orders') }}
