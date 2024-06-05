import { z } from "zod";

export const uploadBodySchema = z.object({
  name: z.string().min(1),
  contentType: z.string().regex(/\w+\/[-+.\w]+/),
});

export const getUploadsParamsSchema = z.object({
  id: z.string().cuid(),
});
