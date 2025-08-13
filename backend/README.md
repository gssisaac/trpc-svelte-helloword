# tRPC Svelte Hello World - Backend

This is the backend service for the tRPC Svelte Hello World application.

## Environment Variables

Create a `.env` file in the backend directory. You can use either the connection string format or individual configuration parameters:

### Option 1: Using Connection String

```env
# Server Configuration
PORT=3006
NODE_ENV=development

# Database Configuration (Connection String)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trpc_svelte_db

# Authentication
JWT_SECRET=your-super-secret-key-change-this-in-production
```

### Option 2: Using Individual Parameters (Recommended)

```env
# Server Configuration
PORT=3006
NODE_ENV=development

# Database Configuration (Individual Parameters)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=trpc_svelte_db

# Authentication
JWT_SECRET=your-super-secret-key-change-this-in-production
```

### Environment Variables Explanation

Server Configuration:
- `PORT`: The port number the server will listen on (default: 3006)
- `NODE_ENV`: The environment mode ('development' or 'production')

Database Configuration:
- Option 1 - Connection String:
  - `DATABASE_URL`: Full PostgreSQL connection string
  - Format: `postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME`

- Option 2 - Individual Parameters (Recommended):
  - `DB_HOST`: Database host (default: 'localhost')
  - `DB_PORT`: Database port (default: '5432')
  - `DB_USER`: Database user (default: 'postgres')
  - `DB_PASSWORD`: Database password
  - `DB_NAME`: Database name (default: 'trpc_svelte_db')

Authentication:
- `JWT_SECRET`: Secret key for JWT token generation and verification

## Database Setup

1. Install PostgreSQL if you haven't already
2. Create a new database:
```sql
CREATE DATABASE trpc_svelte_db;
```

3. The tables will be automatically created when you start the application in development mode (thanks to TypeORM's `synchronize: true` option)

## Getting Started

1. Install dependencies:
```bash
yarn install
```

2. Create and configure your `.env` file using one of the examples above

3. Start the development server:
```bash
yarn dev
```

## Production Deployment

For production deployment, make sure to:

1. Set `NODE_ENV=production` in your environment
2. Use a strong, unique `JWT_SECRET`
3. Configure your database with proper credentials and access restrictions
4. Disable TypeORM synchronize option for production by setting `NODE_ENV=production`
5. Use SSL for database connections in production
6. Never commit your `.env` file to version control
7. Use secrets management service in production (like AWS Secrets Manager, HashiCorp Vault, etc.)