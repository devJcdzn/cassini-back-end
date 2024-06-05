import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_ENDPOINT: z.string().url(),
  CLOUDFLARE_ACCESS_KEY_SECRET: z.string(),
  JWT_SECRET: z.string(),
  BASE_URL: z.string().url(),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
  STRIPE_PUBLISHABLE_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  WEBHOOK_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
