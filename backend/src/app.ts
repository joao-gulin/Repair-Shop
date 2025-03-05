import Fastify, { FastifyInstance } from 'fastify'
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import formbody from '@fastify/formbody';
import dotenv from 'dotenv'

import { authRoutes } from './routes/authRoutes'
import clientRoutes from './routes/clientRoutes'
import userRoutes from './routes/userRoutes';
import { repairRoutes } from './routes/repairRoutes';

dotenv.config()

export const build = async (): Promise<FastifyInstance> => {
  const app = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
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
  app.register(userRoutes, { prefix: '/api/users' })
  app.register(clientRoutes, { prefix: '/api/clients' })
  app.register(repairRoutes, { prefix: '/api/repairs' })

  app.get('/health', async () => {
    return { status: 'OK' };
  });

  return app
}