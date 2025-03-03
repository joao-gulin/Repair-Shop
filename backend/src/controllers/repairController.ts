import { FastifyRequest, FastifyReply } from "fastify";
import { RepairStatus } from '@prisma/client'
import { prisma } from "../utils/prisma";
import { createRepairSchema, updateRepairSchema } from "../utils/validation";
import { z } from 'zod'

type CreateRepairRequest = z.infer<typeof createRepairSchema>
type UpdateRepairRequest = z.infer<typeof updateRepairSchema>

export const getRepairs = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const repairs = await prisma.repair.findMany({
      include: {
        workOder: {
          include: {
            client: true
          }
        }
      }
    })
    return repairs
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}

export const getRepairById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params
  try {
    const repair = await prisma.repair.findUnique({
      where: { id },
      include: {
        workOder: {
          include: {
            client: true
          }
        }
      }
    })
    if (!repair) {
      return reply.status(404).send({ error: 'Repair not found' })
    }
    return repair
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}

export const createRepair = async (
  request: FastifyRequest<{ Body: CreateRepairRequest }>,
  reply: FastifyReply
) => {
  const { description, status, cost, workOrderId } = request.body
  try {
    // Verify work order exists
    const workOrder = await prisma.workOrder.findUnique({
      where: { id: workOrderId }
    })
    if (!workOrder) {
      return reply.status(404).send({ error: 'Work order not found' })
    }

    // Create repair
    const repair = await prisma.repair.create({
      data: {
        description,
        status,
        cost,
        workOrderId
      }
    })

    // Update work order status if needed
    if (workOrder.status === 'OPEN') {
      await prisma.workOrder.update({
        where: { id: workOrderId },
        data: { status: 'IN_PROGRESS' }
      })
    }

    // Update work order total cost
    await prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        totalCost: {
          increment: cost
        }
      }
    })

    return repair
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}

export const updateRepair = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateRepairRequest }>,
  reply: FastifyReply
) => {
  const { id } = request.params
  const updateData = request.body
  try {
    const existingRepair = await prisma.repair.findUnique({
      where: { id }
    })
    if (!existingRepair) {
      return reply.status(404).send({ error: 'Repair not found' })
    }

    if (updateData.cost !== undefined && updateData.cost !== existingRepair.cost) {
      const costDifferece = updateData.cost - existingRepair.cost

      await prisma.workOrder.update({
        where: { id: existingRepair.workOrderId },
        data: {
          totalCost: {
            increment: costDifferece
          }
        }
      })
    }

    const updateRepair = await prisma.repair.update({
      where: { id },
      data: updateData
    })

    if (updateData.status === 'COMPLETED') {
      const allRepairs = await prisma.repair.findMany({
        where: { workOrderId: existingRepair.workOrderId }
      })

      const allCompleted = allRepairs.every(repair => repair.status === 'COMPLETED')

      if (allCompleted) {
        await prisma.workOrder.update({
          where: { id: existingRepair.workOrderId },
          data: { status: 'COMPLETED' }
        })
      }
    }

    return updateRepair
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}