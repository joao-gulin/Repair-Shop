// src/routes/clientRoutes.ts
import { FastifyInstance } from "fastify";
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} from "../controllers/clientController";
import { authenticate } from "../middleware/auth";
import { createClientSchema, updateClientSchema } from "../utils/validation";
import { validateRequest } from "../middleware/validate";
import type { z } from "zod";

export default async function clientRoutes(fastify: FastifyInstance) {
  // Listar clientes (pode ou não ter validação)
  fastify.get("/", { preHandler: authenticate }, getClients);

  // Obter um cliente pelo ID
  fastify.get<{ Params: { id: string } }>(
    "/:id",
    { preHandler: authenticate },
    getClientById
  );

  // Criar um cliente
  fastify.post<{ Body: z.infer<typeof createClientSchema> }>(
    "/",
    { preHandler: validateRequest(createClientSchema) },
    createClient
  );

  // Atualizar um cliente (atenção ao schema)
  fastify.put<{ Params: { id: string }; Body: z.infer<typeof updateClientSchema> }>(
    "/:id",
    { preHandler: validateRequest(updateClientSchema) },
    updateClient
  );

  // Deletar um cliente
  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: authenticate },
    deleteClient
  );
}
