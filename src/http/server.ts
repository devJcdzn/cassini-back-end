import { app } from "../app";

import { prisma } from "../db/prisma";
import { r2 } from "../lib/cloudflare";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { randomUUID } from "crypto";
import { getUploadsParamsSchema, uploadBodySchema } from "../lib/schemas";

// app.get("/", () => {
//   return "Hello world";
// });

// app.post("/uploads", async (request) => {
//   const { name, contentType } = uploadBodySchema.parse(request.body);

//   const fileKey = randomUUID().concat("-").concat(name);

//   const signedUrl = await getSignedUrl(
//     r2,
//     new PutObjectCommand({
//       Bucket: "cassini-dev",
//       Key: fileKey,
//       ContentType: contentType,
//     }),
//     { expiresIn: 600 }
//   );

//   await prisma.file.create({
//     data: {
//       name,
//       contentType,
//       key: fileKey,
//     },
//   });

//   return { signedUrl };
// });

// app.get("/uploads/:id", async (request) => {
//   const { id } = getUploadsParamsSchema.parse(request.params);

//   const file = await prisma.file.findUniqueOrThrow({
//     where: {
//       id,
//     },
//   });

//   const signedUrl = await getSignedUrl(
//     r2,
//     new GetObjectCommand({
//       Bucket: "cassini-dev",
//       Key: file.key,
//     }),
//     { expiresIn: 600 }
//   );

//   return { signedUrl };
// });

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("🔥 Http Server running...");
  });
