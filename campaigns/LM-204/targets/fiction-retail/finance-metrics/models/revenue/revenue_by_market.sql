-- The public output name is consumed by board reporting and must not change yet.
select
  country_code as shipping_country,
  sum(total_amount) as gross_revenue
from {{ ref('orders') }}
group by 1
