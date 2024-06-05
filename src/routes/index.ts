import { FastifyInstance } from "fastify";
import { fileRoutes } from "./uploads";
import { usersRoutes } from "./users";
import { authRoutes } from "./auth";
import { authenticate } from "../middleware/middleware";

export async function registerRoutes(app: FastifyInstance) {
  try {
    await app.register(
      async (app) => {
        app.addHook("onRequest", authenticate);
        fileRoutes(app);
      },
      { prefix: "/uploads" }
    );
    await app.register(authRoutes);
    await app.register(usersRoutes, { prefix: "/users" });
  } catch (err) {
    console.error(err);
  }
}
