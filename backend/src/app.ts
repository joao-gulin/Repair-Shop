import Fastify, { FastifyInstance } from 'fastify'
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import dotenv from 'dotenv'

import { userRoutes } from './routes/userRoutes'

dotenv.config()