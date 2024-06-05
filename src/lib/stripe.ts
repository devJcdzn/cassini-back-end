import Stripe from "stripe";
import { config } from "../config";
import { env } from "../env";

export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: "2024-04-10",
});

export async function createCheckoutSession(userId: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: config.stripe.proPriceId,
          quantity: 1,
        },
      ],
      success_url: `${env.BASE_URL}`,
      cancel_url: `${env.BASE_URL}`,
      mode: "subscription",
      client_reference_id: userId,
    });

    return {
      url: session.url,
    };
  } catch (err) {
    console.error(err);
  }
}
export function handleProcessWebhookCheckout() {}
export function handleProcessWebhookUpdateSubscription() {}
