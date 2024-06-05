import { FastifyInstance } from "fastify";
import { fileRoutes } from "./uploads";
import { usersRoutes } from "./users";
import { authRoutes } from "./auth";

export async function registerRoutes(app: FastifyInstance) {
  try {
    await app.register(fileRoutes);
    await app.register(authRoutes);
    await app.register(usersRoutes, { prefix: "/users" });
  } catch (err) {
    console.error(err);
  }
}
