# Cassini

Stack: Node,js, Fastify, PrismaORM, Cloudflare R2.

## Requirements

### Functional requirements

- [ ] It must be possible to upload;
- [ ] It should be possible to view the last 5 uploads;

### Business roles

- [ ] Uploads should be removed after seven days;
- [ ] It should only be possible to view unexpired uploads;
- [ ] It should only be possible to upload secure files;
- [ ] It should only be possible to upload files up to 1Gb each;

### Non functional requirements

- [ ] Use Cloudflare R2 to upload files;
- [ ] Upload must be done directly by front-end using Presigned URLs;
- [ ] SHaring links must be signed to prevent public access.

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
