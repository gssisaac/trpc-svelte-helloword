import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { User } from './entities/User';
import { initTRPC } from '@trpc/server';

export interface Context {
  req: CreateExpressContextOptions['req'];
  res: CreateExpressContextOptions['res'];
  user?: User;
}

export const createContext = ({ req, res }: CreateExpressContextOptions): Context => ({
  req,
  res,
});

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;
