import { FastifyReply, FastifyRequest } from "fastify";

import { env } from "../env";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma";

const SECRET_KEY = env.JWT_SECRET;

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader?.startsWith("Bearer ")) {
      return reply.code(401).send({
        error: "Missing or Invalid token.",
        message: null,
        data: null,
      });
    }

    // token value = "Bearer ${tokenValue}"
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };

    const userExists = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!userExists) {
      return reply.code(404).send({
        error: "User not found",
        message: null,
        data: null,
      });
    }

    // add user to request to next use
    request.user = userExists;
  } catch (err) {
    console.error(err);
    return reply.code(401).send({
      error: "Invalid or expired token",
      message: null,
      data: null,
    });
  }
}
