import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/auth'
import { validateRequest } from '../middleware/validate'
import { createClientSchema, updateClientSchema } from 