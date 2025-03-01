import { FastifyRequest, FastifyReply } from "fastify"
import bycrypt from 'bcrypt'
import { prisma } from '../utils/prisma'
import { registerSchema, loginSchema } from "../utils/validation"
import { z } from 'zod'

type RegisterRequest = z.infer<typeof registerSchema>
type LoginRequest = z.infer<typeof loginSchema>

export const register = async (
  request: FastifyRequest<{ Body: RegisterRequest }>,
  reply: FastifyReply
) => {
  const { name, email, password, role } = request.body

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return reply.status(400).send({ error: 'User already exists' })
    }

    const salt = await bycrypt.genSalt(10)
    const hashedPassword = await bycrypt.hash(password, salt)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'STAFF'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    })

    const token = await reply.jwtSign({
      id: user.id,
      email: user.email,
      role: user.role
    })

    return { user, token }
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}

export const login = async (
  request: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply
) => {
  const { email, password } = request.body

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' })
    }

    // Verify password
    const isMatch = await bycrypt.compare(password, user.password)
    if (!isMatch) {
      return reply.status(401).send({ error: 'Invalid credentials' })
    }

    // Generate token
    const token = await reply.jwtSign({
      id: user.id,
      email: user.email,
      role: user.role
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}