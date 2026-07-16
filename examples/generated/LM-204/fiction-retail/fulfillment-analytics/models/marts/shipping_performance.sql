select
  country_code,
  avg(delivery_days) as avg_delivery_days,
  count(*) as order_count
from {{ ref('orders') }}
group by country_code
