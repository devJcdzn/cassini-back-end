import { FastifyReply, FastifyRequest } from "fastify";
import { config } from "../config";
import {
  handleProcessWebhookCheckout,
  handleProcessWebhookUpdateSubscription,
  stripe,
} from "../lib/stripe";
import Stripe from "stripe";

export async function stripeWebhook(
  request: FastifyRequest,
  reply: FastifyReply
) {
  let rawBody = request.rawBody as Buffer;

  let event: Stripe.Event;

  if (!config.stripe.webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET_KEY is not set");
    return reply.status(400);
  }

  const signature = request.headers["stripe-signature"];

  if (!signature) {
    console.error("⚠️  Missing Stripe signature.");
    return reply.status(400).send("Webhook Error: Missing Stripe signature.");
  }

  try {
    event = await stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.stripe.webhookSecret
    );
  } catch (err) {
    console.error(`⚠️  Webhook signature verification failed.`, err as string);
    return reply.status(400).send(`Webhook Error: ${err}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleProcessWebhookCheckout(event);
      // Then define and call a function to handle the event checkout.session.completed
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await handleProcessWebhookUpdateSubscription(event);
      // Then define and call a function to handle the event customer.subscription.updated
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
}
