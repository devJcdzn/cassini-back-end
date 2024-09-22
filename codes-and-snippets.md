# Cassini

Stack: Node,js, Fastify, PrismaORM, Cloudflare R2.

## Requirements

### Functional requirements

- [x] It must be possible to upload;
- [ ] It should be possible to view the last 5 uploads;

### Business roles

- [x] Uploads should be removed after seven days;
- [ ] It should only be possible to view unexpired uploads;
- [x] It should only be possible to upload secure files;
- [x] It should only be possible to upload files up to 1Gb each;

### Non functional requirements

- [x] Use Cloudflare R2 to upload files;
- [x] Upload must be done directly by front-end using Presigned URLs;
- [x] Sharing links must be signed to prevent public access.

## Important notes

### Mime Types

```ts
const bannedMimeTypes = [
  ".exe",
  ".dll",
  ".bat",
  ".cmd",
  ".sh",
  ".cgi",
  ".jar",
  ".app",
];
```

### Code Snippets

#### Cloudflare R2 Connection

```ts
import { S3Client } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  region: "auto",
  credentials: {
    endpoint: env.CLOUDFLARE_KEY,
    secretAccessKet: env.CLOUDFLARE_SECRET_KEY,
  },
});
```

#### Cloudflare Upload

```ts
const signedUrl = await getSignedUrl(
  r2,
  new PutObjectCommand({
    Bucket: "cassini-dev",
    Ket: "file.mp4",
    currentType: "video/mp4",
  }),
  { expiresIn: 600 }
);
```

```ts
await axios.put(uploadURL, file, {
  headers: {
    "Content-type": file.type,
  },
});
```

```ts
model FileAccessLog {
  id        String   @id @default(uuid())
  fileId    String   @db.Uuid
  file      File     @relation(fields: [fileId], references: [id], onDelete: Cascade)
  ipAddress String
  accessedAt DateTime @default(now())
  status    String    // Sucesso ou erro (por exemplo: "Success", "Download limit exceeded")
  userAgent String?   // Informação sobre o browser/cliente, se relevante
}
```

```ts
if (file.downloads >= file.downloadLimit) {
  // Registrar o log de acesso com status de erro
  await prisma.fileAccessLog.create({
    data: {
      fileId: file.id,
      ipAddress: request.ip, // Obtém o IP do solicitante
      status: "Download limit exceeded",
      userAgent: request.headers['user-agent'] || null, // Captura o user-agent
    },
  });
```

```ts
model FileAccessLog {
  await prisma.fileAccessLog.create({
    data: {
      fileId: file.id,
      ipAddress: request.ip, // Obtém o IP do solicitante
      status: "Success",
      userAgent: request.headers['user-agent'] || null, // Captura o user-agent
    },
  });
}
```

```ts
export async function getAccessLogs(request: FastifyRequest, reply: FastifyReply) {
  const { fileId } = request.params; // Pega o ID do arquivo da URL

  const logs = await prisma.fileAccessLog.findMany({
    where: { fileId },
    orderBy: { accessedAt: 'desc' }, // Ordena por data de acesso
  });

  reply.code(200).send(logs);
}
```