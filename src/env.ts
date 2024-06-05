import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_ENDPOINT: z.string().url(),
  CLOUDFLARE_ACCESS_KEY_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
