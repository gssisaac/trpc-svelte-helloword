import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../trpc';
import { createUserSchema, loginSchema } from '../entities/User';
import { AppDataSource } from '../config/database';
import { TRPCError } from '@trpc/server';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';
import { createToken, isAuthed } from '../middleware/auth';

const userRepository = AppDataSource.getRepository(User);

export const authRouter = router({
  register: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      const existingUser = await userRepository.findOneBy({ email: input.email });
      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User already exists',
        });
      }

      const passwordHash = await bcrypt.hash(input.password, 10);
      const user = userRepository.create({
        email: input.email,
        passwordHash,
        name: input.name || null,
      });

      await userRepository.save(user);
      const token = createToken(user);

      return { user, token };
    }),

  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ input }) => {
      const user = await userRepository.findOneBy({ email: input.email });
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      const validPassword = await bcrypt.compare(input.password, user.passwordHash);
      if (!validPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid password',
        });
      }

      const token = createToken(user);
      return { user, token };
    }),

  me: publicProcedure
    .use(isAuthed)
    .query(async ({ ctx }) => {
      return { user: ctx.user };
    }),
});