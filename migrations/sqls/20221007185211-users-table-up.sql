CREATE TABLE "users"
(
  id SERIAL PRIMARY KEY,
  username VARCHAR,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  password_digest VARCHAR
)