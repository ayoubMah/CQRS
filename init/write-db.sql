CREATE TABLE IF NOT EXISTS orders (
    id          UUID PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    amount      DECIMAL(10,2) NOT NULL,
    status      VARCHAR(50) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);
