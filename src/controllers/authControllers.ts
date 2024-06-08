import { FastifyReply, FastifyRequest } from "fastify";
import {
  requestMagicLinkBodySchema,
  validateMagicLinkQuerySchema,
} from "../lib/auth-schemas";
import { prisma } from "../db/prisma";
import jwt from "jsonwebtoken";
import { env } from "../env";
import { sendAuthEmail, sendMail } from "../lib/email";

const SECRET_KEY = env.JWT_SECRET;

export async function requestMagicLink(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email } = requestMagicLinkBodySchema.parse(request.body);

  try {
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (!userExists) {
      return reply.code(404).send({
        error: "User not exists",
        message: null,
        data: null,
      });
    }

    const token = jwt.sign({ userId: userExists.id }, SECRET_KEY, {
      expiresIn: "15m",
    });

    const magicLink = `${env.BASE_URL}/validate-magic-link?token=${token}`;

    // function to send email
    sendMail({
      to: email,
      subject: "Your Magic Link to Login",
      text: `<a href="${magicLink}"} style={{color: "#3d8"}}>Click here to login</a>`,
    });

    // sendAuthEmail(userExists.email, userExists.name);

    return reply.code(200).send({
      error: null,
      message: "Magic Link sent.",
      data: null,
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

export async function validateMagicLink(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { token } = validateMagicLinkQuerySchema.parse(request.query);

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };

    const userIsValid = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!userIsValid) {
      return reply.code(401).send({
        error: "Invalid token",
        message: null,
        data: null,
      });
    }

    const sessionToken = jwt.sign({ userId: userIsValid.id }, SECRET_KEY);

    return reply.code(200).send({
      error: null,
      message: "Login successfully",
      data: {
        sessionToken,
      },
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
