CREATE TABLE products
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price numeric DEFAULT 0.00,
  category VARCHAR(50)
)