import fastify from "fastify";
import { registerRoutes } from "./routes";
import rawBodyPlugin from "fastify-raw-body";

const app = fastify();

app.register(rawBodyPlugin, {
  field: "rawBody",
  global: false,
  runFirst: true,
});

registerRoutes(app);

app.get("/hello-world", () => {
  return "Hello World";
});

export { app };
