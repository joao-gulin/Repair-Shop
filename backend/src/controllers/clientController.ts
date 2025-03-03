import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from '../utils/prisma'
import { createClientSchema, updateClientSchema } from "../utils/validation";
import { z } from 'zod'

type CreateClientRequest = z.infer<typeof createClientSchema>
type updateClientRequest = z.infer<typeof updateClientSchema>

export const getClients = async (request: FastifyRequest ,reply: FastifyReply) => {
  try {
    const clients = await prisma.client.findMany()
    return clients
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}

export const getClientById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params

  try {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        workOrders: true
      }
    });

    if (! client) {
      return reply.status(404).send({ error: 'Client not found' })
    }

    return client
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}

export const createClient = async (
  request: FastifyRequest<{ Body: CreateClientRequest }>,
  reply: FastifyReply
) => {
  const { name, email, phone, address } = request.body

  try {
    // Check if client with same email already exists
    const existingClient = await prisma.client.findUnique({
      where: { email }
    })

    if (existingClient) {
      return reply.status(400).send({ error: 'Client with this email already exists' })
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        address
      }
    })

    return client
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}

export const updateClient = async (
  request: FastifyRequest<{ Params: { id: string }; Body: updateClientRequest}>,
  reply: FastifyReply
) => {
  const { id } = request.params
  const updateData = request.body

  try {
    const client = await prisma.client.findUnique({
      where: { id }
    })

    if (!client) {
      return reply.status(404).send({ error: 'Client not found' })
    }

    // If email is being updated, check if it's already in use
    if (updateData.email && updateData.email !== client.email ) {
      const existingClient = await prisma.client.findUnique({
        where: { email: updateData.email }
      })

      if (existingClient) {
        return reply.status(400).send({ error: 'Email already in use' })
      }
    }

    const updateClient = await prisma.client.update({
      where: { id },
      data: updateData
    })

    return updateClient
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}

export const deleteClient = async (
  request: FastifyRequest<{ Params: { id: string} }>,
  reply: FastifyReply 
) => {
  const { id } = request.params

  try {
    const client = await prisma.client.findUnique({
      where: { id }
    })

    if (!client) {
      return reply.status(404).send({ error: 'Client not found' })
    }

    const workOrders = await prisma.workOrder.findMany({
      where: { clientId: id }
    })

    if (workOrders.length > 0) {
      return reply.status(400).send({
        error: 'Cannot delete client with existing work orders',
        workOrderCount: workOrders.length
      })
    }

    await prisma.client.delete({
      where: { id }
    })

    return { message: 'Client delete sucessfully' }
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}
