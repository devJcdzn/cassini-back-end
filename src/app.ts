import fastify from "fastify";
import { registerRoutes } from "./routes";

const app = fastify();

registerRoutes(app);

app.get("/hello-world", () => {
  return "Hello World";
});

export { app };
