import { FastifyInstance } from "fastify";
import { getFile, uploadFile } from "../controllers/fileController";

export async function fileRoutes(app: FastifyInstance) {
  app.post("/", uploadFile);
  app.get("/:id", getFile);
}
