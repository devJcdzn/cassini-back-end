import { FastifyInstance } from "fastify";
import { stripeWebhook } from "../controllers/stripeController";

export async function webhookRoutes(app: FastifyInstance) {
  app.post("/", {
    config: {
      rawBody: true,
    },
    handler: stripeWebhook,
  });
  // app.get("/:id", );
}
