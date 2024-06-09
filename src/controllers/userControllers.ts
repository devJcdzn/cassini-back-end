import { prisma } from "../db/prisma";
import { FastifyRequest, FastifyReply } from "fastify";
import {
  createUserBodySchema,
  getUserParamsSchema,
  updateUserBodySchema,
  updateUserParamsSchema,
} from "../lib/schemas/user-schemas";
import { createStripeCustomer } from "../lib/providers/stripe";
import { sendWelcomeEmail } from "../lib/providers/email";

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const { name, email } = createUserBodySchema.parse(request.body);

  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userAlreadyExists) {
    reply.code(400).send({
      error: "User already registered.",
      message: null,
      data: null,
    });
    return;
  }

  const customer = await createStripeCustomer({ email, name });

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      stripeCustomerId: customer.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  await sendWelcomeEmail(email, name);

  return reply.code(201).send({
    error: null,
    message: "User created",
    data: newUser,
  });
}

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = getUserParamsSchema.parse(request.params);

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return reply.code(200).send({
      error: null,
      message: null,
      data: user,
    });
  } catch (err) {
    console.error(err);
  }
}

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = updateUserParamsSchema.parse(request.params);
  const { name } = updateUserBodySchema.parse(request.body);

  const updateData = {
    name,
  };

  try {
    const userUpdated = await prisma.user.update({
      where: {
        id,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return reply.code(200).send({
      error: null,
      message: "User updated",
      data: userUpdated,
    });
  } catch (err) {
    console.error(err);
  }
}
