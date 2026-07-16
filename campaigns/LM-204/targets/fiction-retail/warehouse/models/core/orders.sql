-- Proposed output in warehouse PR #204: shipping_country -> country_code.
select
  order_id,
  customer_id,
  upper(shipping_country) as country_code,
  total_amount,
  delivery_days
from {{ source('retail', 'orders') }}
