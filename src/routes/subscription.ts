import { FastifyInstance } from "fastify";
import { createCheckout } from "../controllers/subscriptionController";

export async function subscriptionRoutes(app: FastifyInstance) {
  app.post("/", createCheckout);
  // app.get("/:id", );
}
