import { FastifyInstance } from "fastify";
import { fileRoutes } from "./uploads";

export async function registerRoutes(app: FastifyInstance) {
  try {
    await app.register(fileRoutes, { prefix: "/uploads" }); // Route without middleware
  } catch (err) {
    console.error(err);
  }
}
