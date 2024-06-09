import { z } from "zod";

export const requestMagicLinkBodySchema = z.object({
  email: z.string().email(),
});

export const validateMagicLinkQuerySchema = z.object({
  token: z.string(),
});
