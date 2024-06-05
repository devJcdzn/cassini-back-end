import { FastifyInstance } from "fastify";
import {
  requestMagicLink,
  validateMagicLink,
} from "../controllers/authControllers";

export async function authRoutes(app: FastifyInstance) {
  app.post("/request-magic-link", requestMagicLink);
  app.get("/validate-magic-link", validateMagicLink);
}
