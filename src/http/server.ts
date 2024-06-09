import { app } from "../app";
import cors from "@fastify/cors";

app.register(cors, {
  origin: "*",
});

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("🔥 Http Server running...");
  });
