import { FastifyRequest, FastifyReply } from 'fastify'
import { ZodTypeAny, ZodError } from 'zod'

export const validateRequest = (schema: ZodTypeAny) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.body = schema.parse(request.body)
    } catch (error) {
      if (error instanceof ZodError) {
        reply.status(400).send({
          error: 'Validation failed',
          details: error.errors
        })
      } else {
        reply.status(500).send({
          error: 'Internal Server Error'
        })
      }
    }
  }
}