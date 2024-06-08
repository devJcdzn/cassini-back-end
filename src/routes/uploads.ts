import { FastifyInstance } from "fastify";
import { checkQuota } from "../middleware/middleware";
import {
  getFile,
  getRecentFiles,
  uploadFile,
} from "../controllers/fileController";

export async function fileRoutes(app: FastifyInstance) {
  app.post("/", { preHandler: checkQuota }, uploadFile);
  app.get("/", getRecentFiles);
  app.get("/:id", getFile);
}
