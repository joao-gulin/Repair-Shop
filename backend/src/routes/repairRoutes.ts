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

export async function repairRoutes(fastify: FastifyInstance) {
  // Apply authentication to all routes
  fastify.addHook('preHandler', authenticate);

  fastify.get('/', getRepairs);
  fastify.get('/:id', getRepairById);
  fastify.post('/', { preHandler: validateRequest(createRepairSchema) }, createRepair);
  fastify.put('/:id', { preHandler: validateRequest(updateRepairSchema) }, updateRepair);
  fastify.delete('/:id', deleteRepair);
}