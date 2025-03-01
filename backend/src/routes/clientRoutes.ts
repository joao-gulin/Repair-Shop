import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/auth'
import { validateRequest } from '../middleware/validate'
import { createClientSchema, updateClientSchema } from '../utils/validation'
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} from '../controllers/clientController';

export async function clientRoutes(fastify: FastifyInstance) {
  // Apply authentication to all routes
  fastify.addHook('preHandler', authenticate)

  fastify.get('/', getClients)
  fastify.get('/:id', getClientById)
  fastify.post('/', { preHandler: validateRequest(createClientSchema) }, createClient)
  fastify.put('/:id', { preHandler: validateRequest(updateClient) }, updateClient)
  fastify.delete('/:id', deleteClient)
}