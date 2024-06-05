import { FastifyInstance } from "fastify";
import { fileRoutes } from "./uploads";
import { usersRoutes } from "./users";

export async function registerRoutes(app: FastifyInstance) {
  try {
    await app.register(fileRoutes);
    await app.register(usersRoutes, { prefix: "/users" });
  } catch (err) {
    console.error(err);
  }
}
