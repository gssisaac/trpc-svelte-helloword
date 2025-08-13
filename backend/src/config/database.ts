import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import dotenv from 'dotenv';

dotenv.config();

// Use individual parameters if provided, fall back to connection string
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'trpc_svelte_db',
};

export const AppDataSource = new DataSource({
  type: 'postgres',
  // Use individual parameters if password is provided, otherwise fall back to URL
  ...(process.env.DB_PASSWORD ? dbConfig : { url: process.env.DATABASE_URL }),
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  entities: [User],
  migrations: [],
  subscribers: [],
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});