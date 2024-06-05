import { z } from "zod";

export const createUserBodySchema = z.object({
  name: z.string().min(3),
  email: z.string().email("please select an valid email"),
});

export const getUserParamsSchema = z.object({
  id: z.string().uuid(),
});

export const updateUserBodySchema = z.object({
  name: z.string().optional(),
});

export const updateUserParamsSchema = z.object({
  id: z.string().uuid(),
});
