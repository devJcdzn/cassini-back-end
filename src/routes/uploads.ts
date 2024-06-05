import { FastifyInstance } from "fastify";
import { getFile, uploadFile } from "../controllers/fileController";

export async function fileRoutes(app: FastifyInstance) {
  app.post("/uploads", uploadFile);
  app.get("/uploads/:id", getFile);
}
