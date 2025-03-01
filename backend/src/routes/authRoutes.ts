import { FastifyInstance } from 'fastify'
import { register, login } from '../controllers/authController'
import { validateRequest } from '../middleware/validate'
import { registerSchema, loginSchema } from '../utils/validation'

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', { preHandler: validateRequest(registerSchema) }, register)
  fastify.post('/login', { preHandler: validateRequest(loginSchema) }, login)
}