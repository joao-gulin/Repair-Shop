// src/routes/authRoutes.ts
import { FastifyInstance } from 'fastify';
import { register, login } from '../controllers/authController';
import { validateRequest } from '../middleware/validate';
import { registerSchema, loginSchema } from '../utils/validation';
import { z } from 'zod';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: z.infer<typeof registerSchema> }>(
    '/register',
    { preHandler: validateRequest(registerSchema) },
    register
  );
  fastify.post<{ Body: z.infer<typeof loginSchema> }>(
    '/login',
    { preHandler: validateRequest(loginSchema) },
    login
  );
}
