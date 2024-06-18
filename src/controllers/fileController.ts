import { prisma } from "../db/prisma";
import { r2 } from "../lib/providers/cloudflare";
import { FastifyRequest, FastifyReply } from "fastify";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { randomUUID } from "crypto";

import {
  getUploadsParamsSchema,
  uploadBodySchema,
} from "../lib/schemas/upload-schemas";
import {
  bannedMimeTypes,
  isFileAllowed,
  isFileSizeAllowed,
} from "../lib/utils/file-check";

export async function uploadFile(request: FastifyRequest, reply: FastifyReply) {
  const { name, contentType, size } = uploadBodySchema.parse(request.body);
  // const userId = request.user?.id;

  try {
    // Logic to add e user owner for a file
    // const user = await prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    //   include: {
    //     File: true,
    //   },
    // });

    // if (!user) {
    //   return reply.status(401).send({
    //     error: "Unauthorized",
    //     message: null,
    //     data: null,
    //   });
    // }

    const fileIsAllowed =
      isFileAllowed(contentType, bannedMimeTypes) && isFileSizeAllowed(size);

    if (!fileIsAllowed) {
      return reply.code(400).send({
        error: "File Type is not Allowed",
        message: "please check banned MIME types or max upload size",
        data: {
          bannedMimeTypes,
          sizeAllowed: "1Gb",
        },
      });
    }

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
        // ownerId: user.id,
      },
    });

    reply.code(200).send({
      id: file.id,
      signedUrl,
    });
  } catch (err) {
    console.log(err);
    return reply.code(500).send({
      error: "Server error",
      message: err as string,
      data: null,
    });
  }
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

  reply.code(301).redirect(signedUrl);
}

export async function getRecentFiles(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = request?.user;

  try {
    if (!user) {
      return reply.code(401).send({
        error: "Unauthorized",
        message: null,
        data: null,
      });
    }

    const userExists = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        File: {
          select: {
            id: true,
            name: true,
            owner: {
              select: {
                name: true,
                email: true,
                id: true,
              },
            },
          },
        },
      },
    });

    return reply.send({
      files: userExists?.File,
      length: userExists?.File.length,
    });
  } catch (err) {
    return reply.code(500).send({
      error: "Server Error",
      message: null,
      data: null,
    });
  }
}
