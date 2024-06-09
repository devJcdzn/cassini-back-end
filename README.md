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
