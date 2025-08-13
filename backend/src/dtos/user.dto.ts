import { z } from 'zod';

export const userDtoSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
});

export type UserDTO = z.infer<typeof userDtoSchema>;

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
