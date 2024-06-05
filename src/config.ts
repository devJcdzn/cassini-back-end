import { env } from "./env";

export const config = {
  stripe: {
    publishableKey: env.STRIPE_PUBLISHABLE_KEY,
    secretKey: env.STRIPE_SECRET_KEY,
    proPriceId: "price_1POMqxDCwcS57S1bVaoBMbOb",
    webhookSecret: env.WEBHOOK_SECRET,
  },
};
