import { AppDataSource } from '../config/database';
import { TRPCError } from '@trpc/server';
import { User } from '../entities/User';
import jwt from 'jsonwebtoken';
import { middleware } from '../trpc';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key';

export interface JWTPayload {
  userId: string;
}

export const createToken = (user: User): string => {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired token',
    });
  }
};

export const isAuthed = middleware(async ({ ctx, next }) => {
  const { req } = ctx;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'No authorization header',
    });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  const user = await AppDataSource.getRepository(User).findOneBy({ id: payload.userId });
  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User not found',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
