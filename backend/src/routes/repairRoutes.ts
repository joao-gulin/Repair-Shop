import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { createRepairSchema, updateRepairSchema } from '../utils/validation';
import {
  getRepairs,
  getRepairById,
  createRepair,
  updateRepair,
  deleteRepair
} from '../controllers/repairController';
import type { z } from 'zod';

export async function repairRoutes(fastify: FastifyInstance) {
  // Listar Reparações (pode ou não ter validação)
  fastify.get("/", { preHandler: authenticate }, getRepairs);

  // Obter um cliente pelo ID
  fastify.get<{ Params: { id: string } }>(
    "/:id",
    { preHandler: authenticate },
    getRepairById
  );

  // Criar uma Reparação
  fastify.post<{ Body: z.infer<typeof createRepairSchema> }>(
    "/",
    { preHandler: validateRequest(createRepairSchema) },
    createRepair
  );

  // Atualizar um cliente (atenção ao schema)
  fastify.put<{ Params: { id: string }; Body: z.infer<typeof updateRepairSchema> }>(
    "/:id",
    { preHandler: validateRequest(updateRepairSchema) },
    updateRepair
  );

  // Deletar um cliente
  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: authenticate },
    deleteRepair
  );
}