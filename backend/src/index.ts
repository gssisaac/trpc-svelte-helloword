import { AppDataSource } from './config/database';
import { appRouter } from './routes';
import cors from 'cors';
import { createContext } from './trpc';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

AppDataSource.initialize()
  .then(() => {
    console.log('Database connection initialized');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => console.log('Error initializing database:', error));
