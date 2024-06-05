import { prisma } from "../db/prisma";
import { r2 } from "../lib/cloudflare";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { getUploadsParamsSchema, uploadBodySchema } from "../lib/schemas";
import { FastifyRequest, FastifyReply } from "fastify";

export async function uploadFile(request: FastifyRequest, reply: FastifyReply) {
  const { name, contentType } = uploadBodySchema.parse(request.body);

  const fileKey = randomUUID().concat("-").concat(name);

  const signedUrl = await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: "cassini-dev",
      Key: fileKey,
      ContentType: contentType,
    }),
    { expiresIn: 600 }
  );

  const file = await prisma.file.create({
    data: {
      name,
      contentType,
      key: fileKey,
    },
  });

  reply.code(200).send({
    id: file.id,
    signedUrl,
  });
}

export async function getFile(request: FastifyRequest, reply: FastifyReply) {
  const { id } = getUploadsParamsSchema.parse(request.params);

  const file = await prisma.file.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const signedUrl = await getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: "cassini-dev",
      Key: file.key,
    }),
    { expiresIn: 600 }
  );

  reply.code(200).send({ signedUrl });
}
