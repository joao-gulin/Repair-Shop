import { FastifyInstance } from "fastify";
import {
  getUserById,
  registerUser,
  updateUser
} from "../controllers/userController";
import { validateRequest } from "../middleware/validate";
import { getUserSchema, registerSchema, updateUserSchema } from "../utils/validation";
import type { z } from "zod";

export default async function userRoutes(fastify: FastifyInstance) {
  // Register user
  fastify.post<{ Body: z.infer<typeof registerSchema> }>(
    "/register",
    { preHandler: validateRequest(registerSchema) },
    registerUser
  );

  // Update user by ID
  fastify.put<{ Params: { id: string }; Body: z.infer<typeof updateUserSchema> }>(
    "/:id",
    { preHandler: validateRequest(updateUserSchema) },
    updateUser
  );
  
  // Get User by ID
  fastify.get<{ Params: z.infer<typeof getUserSchema> }>(
    "/:id", // Fetch user by ID
    { preHandler: validateRequest(getUserSchema) },
    getUserById
  );
}
