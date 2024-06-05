import Stripe from "stripe";
import { config } from "../config";
import { env } from "../env";
import { prisma } from "../db/prisma";

export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: "2024-04-10",
});

export const getStripeCustomerByEmail = async (email: string) => {
  const customers = await stripe.customers.list({ email });

  return customers.data[0];
};

export const createStripeCustomer = async (input: {
  name?: string;
  email: string;
}) => {
  const customer = await getStripeCustomerByEmail(input.email);

  if (customer) return customer;

  return await stripe.customers.create({
    email: input.email,
    name: input?.name,
  });
};

export async function createCheckoutSession(userId: string, userEmail: string) {
  try {
    const customer = await createStripeCustomer({ email: userEmail });

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
      customer: customer.id,
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

export async function handleProcessWebhookCheckout(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;

  const {
    client_reference_id: clientReferenceId,
    subscription: stripeSubscriptionId,
    customer: stripeCustomerId,
    status: checkoutStatus,
  } = session;

  if (!clientReferenceId || !stripeSubscriptionId || !stripeCustomerId) {
    throw new Error("Data is incomplete.");
  }

  if (checkoutStatus !== "complete") return;

  const userExists = await prisma.user.findUnique({
    where: {
      id: clientReferenceId,
    },
    select: {
      id: true,
    },
  });

  if (!userExists) {
    throw new Error("clientReferenceId not found.");
  }

  await prisma.user.update({
    where: { id: userExists.id },
    data: {
      stripeCustomerId: stripeCustomerId as string,
      stripeSubscriptionId: stripeSubscriptionId as string,
    },
  });
}

export async function handleProcessWebhookUpdateSubscription(
  event: Stripe.Event
) {
  const subscription = event.data.object as Stripe.Subscription;

  const {
    status: stripeSubscriptionStatus,
    customer: stripeCustomerId,
    id: stripeSubscriptionId,
  } = subscription;

  const userExists = await prisma.user.findFirst({
    where: {
      stripeCustomerId: stripeCustomerId as string,
    },
    select: {
      id: true,
    },
  });

  if (!userExists) {
    throw new Error("stripeCustomerId not found.");
  }

  console.log({
    message: "Passou aqui",
    data: {
      stripeCustomerId,
      stripeSubscriptionStatus,
      stripeSubscriptionId,
    },
  });

  await prisma.user.update({
    where: {
      id: userExists.id,
    },
    data: {
      stripeCustomerId: stripeCustomerId as string,
      stripeSubscriptionId: stripeSubscriptionId as string,
      stripeSubscriptionStatus,
    },
  });
}
