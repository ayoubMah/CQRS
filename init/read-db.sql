CREATE TABLE IF NOT EXISTS orders (
    id          UUID PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    amount      DECIMAL(10,2) NOT NULL,
    status      VARCHAR(50) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE MATERIALIZED VIEW IF NOT EXISTS customer_order_stats AS
SELECT
    customer_name,
    COUNT(*)    AS total_orders,
    SUM(amount) AS total_spent
FROM orders
GROUP BY customer_name;

CREATE UNIQUE INDEX IF NOT EXISTS idx_cust_stats
    ON customer_order_stats (customer_name);
