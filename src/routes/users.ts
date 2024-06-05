import { FastifyInstance } from "fastify";
import {
  createUser,
  getUser,
  updateUser,
} from "../controllers/userControllers";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/", createUser);
  app.get("/:id", getUser);
  app.put("/:id", updateUser);
}
