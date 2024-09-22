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
import { basicSub } from "../lib/utils/subscriptions";

export async function uploadFile(request: FastifyRequest, reply: FastifyReply) {
  const { name, contentType, size } = uploadBodySchema.parse(request.body);

  try {
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
      { expiresIn: 300 }
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
  const maxDownloadTimeLimit = 60 * 60 * 24 * 7; // 7 days

  const file = await prisma.file.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const currentDate = new Date();
  const fileCreationDate = new Date(file.createdAt);
  const difference = currentDate.getTime() - fileCreationDate.getTime();
  const daysDifference = difference / (1000 * 3600 * 24);

  if (daysDifference >= 7) {
    await prisma.file.delete({
      where: { id },
    });

    return reply.code(403).send({
      error: "Download time limit exceeded",
      message: "This file has exceeded the maximum download time limit.",
    });
  }

  if (file.downloads >= basicSub.downloadLimit) {
    return reply.code(403).send({
      error: "Download limit exceeded",
      message: "This file has reached the maximum number of downloads.",
    });
  }

  const signedUrl = await getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: "cassini-dev",
      Key: file.key,
    }),
    { expiresIn: maxDownloadTimeLimit }
  );

  await prisma.file.update({
    where: { id: file.id },
    data: {
      downloads: file.downloads + 1,
    },
  });

  reply.code(301).redirect(signedUrl);
}

// export async function getRecentFiles(
//   request: FastifyRequest,
//   reply: FastifyReply
// ) {
//   const user = request?.user;

//   try {
//     if (!user) {
//       return reply.code(401).send({
//         error: "Unauthorized",
//         message: null,
//         data: null,
//       });
//     }

//     const userExists = await prisma.user.findUnique({
//       where: {
//         id: user.id,
//       },
//       include: {
//         File: {
//           select: {
//             id: true,
//             name: true,
//             owner: {
//               select: {
//                 name: true,
//                 email: true,
//                 id: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     return reply.send({
//       files: userExists?.File,
//       length: userExists?.File.length,
//     });
//   } catch (err) {
//     return reply.code(500).send({
//       error: "Server Error",
//       message: null,
//       data: null,
//     });
//   }
// }
