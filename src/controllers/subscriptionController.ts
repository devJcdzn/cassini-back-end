import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../db/prisma";
import { createCheckoutSession } from "../lib/stripe";

export async function createCheckout(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = request?.user;

  if (!user) {
    return reply.code(401).send({
      error: "Unauthorized",
      message: null,
      data: null,
    });
  }
  try {
    const userExists = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExists) {
      return reply.code(401).send({
        error: "Unauthorized",
        message: null,
        data: null,
      });
    }

    const checkout = await createCheckoutSession(
      userExists.id,
      userExists.email
    );

    if (!checkout) {
      return reply.send({
        error: "Error to generate checkout",
        message: null,
        data: null,
      });
    }

    return reply.code(200).send({
      error: null,
      message: "Checkout created.",
      data: checkout,
    });
  } catch (err) {
    console.error(err);
    return reply.code(500).send({
      error: err as string,
      message: null,
      data: null,
    });
  }
}
