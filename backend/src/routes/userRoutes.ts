// src/routes/userRoutes.ts
import { FastifyInstance } from 'fastify';
import { registerUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { validateRequest } from '../middleware/validate';
import { registerSchema, updateUserSchema } from '../utils/validation';

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/register', { preHandler: validateRequest(registerSchema) }, registerUser);
  fastify.get('/', getUsers);
  fastify.get('/:id', getUserById);
  fastify.put('/:id', { preHandler: validateRequest(updateUserSchema) }, updateUser);
  fastify.delete('/:id', deleteUser);
}