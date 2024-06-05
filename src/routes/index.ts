import { FastifyInstance } from "fastify";
import { fileRoutes } from "./uploads";

export async function registerRoutes(app: FastifyInstance) {
  await app.register(fileRoutes);
}
