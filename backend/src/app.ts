import Fastify, { FastifyInstance } from 'fastify'
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import formbody from '@fastify/formbody';
import dotenv from 'dotenv'

import { authRoutes } from './routes/authRoutes'
import clientRoutes from './routes/clientRoutes'

dotenv.config()

export const build = async (): Promise<FastifyInstance> => {
  const app = Fastify({
    logger: {
      level: 'debug',
    }
  })

  // Register plugins
  await app.register(cors, {
    origin: true
  })

  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'default-secret-change-me'
  })

  await app.register(formbody)

  app.register(authRoutes, { prefix: '/api/auth' })
  app.register(clientRoutes, { prefix: '/api/clients' })

  app.get('/health', async () => {
    return { status: 'OK' };
  });

  return app
}