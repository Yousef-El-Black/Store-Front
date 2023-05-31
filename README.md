# Storefront backend

This file contains the backend application for an eCommerce store front. It is a RESTful API.

The database schema and and API route information can be found in the [requirements doc](REQUIREMENTS.md).

## Set up

- `docker-compose up` to start the docker container
- `npm install` to install all dependencies
- `npm run build` to build the app

## Start the app

- `npm run dev` to start the app and get access via http://localhost:3000

## Test the app

- add a `database.json` file in the root directory and set the missing `###` parameters

```
{
  "defaultEnv": { "ENV": "ENV" },
  "dev": {
    "driver": "pg",
    "host": { "ENV": "POSTGRES_HOST" },
    "port": { "ENV": "POSTGRES_PORT" },
    "database": { "ENV": "POSTGRES_DB" },
    "user": "###",
    "password": "###"
  },
  "test": {
    "driver": "pg",
    "host": { "ENV": "POSTGRES_HOST" },
    "port": { "ENV": "POSTGRES_PORT" },
    "database": { "ENV": "POSTGRES_DB_TEST" },
    "user": "###",
    "password": "###"
  }
}

```

- `npm run test` to run all tests
- `npm run test:win` to run all tests on Windows

## Libraries used

The application uses the following libraries:

- Runtime: Node.js (JavaScript)
- Web application framework: Express
- Language: TypeScript
- Database: Postgres
- Testing: Jasmine and Supertest

### Ports

The application runs on port `3000` with database on `5432`.

### Environment variables

To satisfy Udacity requirements, the following environment variable are needed.

```
ENV=dev

# DB VARIABLES
POSTGRES_HOST=localhost
POSTGRES_DB=store_dev
POSTGRES_DB_TEST=store_test
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password123

# BCRYPT VARIABLES
BCRYPT_PASSWORD=secret_password
SALT_ROUNDS=10

# JWT
TOKEN_SECRET=secret_token
```

### Instructions

connect to the default postgres database as the server's root user `psql -U postgres`

## In psql run the following to create a user

`CREATE USER postgres WITH PASSWORD 'password123';`

## In psql run the following to create the dev and test database

`CREATE DATABASE store_dev;`
`CREATE DATABASE store_test;`

## Connect to the databases and grant all privileges

# Grant for dev database

`\c store dev`
`GRANT ALL PRIVILEGES ON DATABASE store_dev TO postgres;`

# Grant for test database

`\c store dev`
`GRANT ALL PRIVILEGES ON DATABASE store_test TO postgres;`
