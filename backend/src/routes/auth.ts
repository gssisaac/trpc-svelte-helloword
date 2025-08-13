import { createToken, isAuthed } from '../middleware/auth';
import { createUserSchema, loginSchema, userDtoSchema } from '../dtos/user.dto';
import { publicProcedure, router } from '../trpc';

import { AppDataSource } from '../config/database';
import { TRPCError } from '@trpc/server';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';

const userRepository = AppDataSource.getRepository(User);

const mapUserToDTO = (user: User) => ({
  id: user.id,
  email: user.email,
  name: user.name,
});

export const authRouter = router({
  register: publicProcedure
    .input(createUserSchema)
    .output(z.object({ user: userDtoSchema, token: z.string() }))
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

      return { user: mapUserToDTO(user), token };
    }),

  login: publicProcedure
    .input(loginSchema)
    .output(z.object({ user: userDtoSchema, token: z.string() }))
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
      return { user: mapUserToDTO(user), token };
    }),

  me: publicProcedure
    .use(isAuthed)
    .output(z.object({ user: userDtoSchema }))
    .query(async ({ ctx }) => {
      return { user: mapUserToDTO(ctx.user) };
    }),
});