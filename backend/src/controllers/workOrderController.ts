import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../utils/prisma';
import { 
  createWorkOrderSchema, 
  updateWorkOrderSchema, 
  addPartToWorkOrderSchema 
} from '../utils/validation';
import { z } from 'zod';

type CreateWorkOrderRequest = z.infer<typeof createWorkOrderSchema>;
type UpdateWorkOrderRequest = z.infer<typeof updateWorkOrderSchema>;
type AddPartRequest = z.infer<typeof addPartToWorkOrderSchema>;

export const getWorkOrders = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const workOrders = await prisma.workOrder.findMany({
      include: {
        client: true,
        repairs: true,
        parts: {
          include: {
            part: true
          }
        }
      }
    });
    return workOrders;
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const getWorkOrderById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  try {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id },
      include: {
        client: true,
        repairs: true,
        parts: {
          include: {
            part: true
          }
        }
      }
    });

    if (!workOrder) {
      return reply.status(404).send({ error: 'Work order not found' });
    }

    return workOrder;
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const createWorkOrder = async (
  request: FastifyRequest<{ Body: CreateWorkOrderRequest }>,
  reply: FastifyReply
) => {
  const { clientId, description, status } = request.body;

  try {
    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return reply.status(404).send({ error: 'Client not found' });
    }

    const workOrder = await prisma.workOrder.create({
      data: {
        clientId,
        description,
        status: status || 'OPEN',
        totalCost: 0
      }
    });

    return workOrder;
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const updateWorkOrder = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateWorkOrderRequest }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const updateData = request.body;

  try {
    // Check if work order exists
    const workOrder = await prisma.workOrder.findUnique({
      where: { id }
    });

    if (!workOrder) {
      return reply.status(404).send({ error: 'Work order not found' });
    }

    // If client is being updated, check if it exists
    if (updateData.clientId) {
      const client = await prisma.client.findUnique({
        where: { id: updateData.clientId }
      });

      if (!client) {
        return reply.status(404).send({ error: 'Client not found' });
      }
    }

    const updatedWorkOrder = await prisma.workOrder.update({
      where: { id },
      data: updateData
    });

    return updatedWorkOrder;
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const deleteWorkOrder = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  try {
    // Check if work order exists
    const workOrder = await prisma.workOrder.findUnique({
      where: { id }
    });

    if (!workOrder) {
      return reply.status(404).send({ error: 'Work order not found' });
    }

    // First delete all related repairs and parts
    await prisma.repair.deleteMany({
      where: { workOrderId: id }
    });

    await prisma.workOrderPart.deleteMany({
      where: { workOrderId: id }
    });

    // Then delete the work order
    await prisma.workOrder.delete({
      where: { id }
    });

    return { message: 'Work order deleted successfully' };
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const addPartToWorkOrder = async (
  request: FastifyRequest<{ 
    Params: { id: string }; 
    Body: AddPartRequest 
  }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const { partId, quantity } = request.body;

  try {
    // Check if work order exists
    const workOrder = await prisma.workOrder.findUnique({
      where: { id }
    });

    if (!workOrder) {
      return reply.status(404).send({ error: 'Work order not found' });
    }

    // Check if part exists and has enough stock
    const part = await prisma.part.findUnique({
      where: { id: partId }
    });

    if (!part) {
      return reply.status(404).send({ error: 'Part not found' });
    }

    if (part.stockQuantity < quantity) {
      return reply.status(400).send({ 
        error: 'Not enough stock available',
        available: part.stockQuantity,
        requested: quantity
      });
    }

    // Check if part is already in work order
    const existingPart = await prisma.workOrderPart.findFirst({
      where: {
        workOrderId: id,
        partId
      }
    });

    let workOrderPart;

    if (existingPart) {
      // Update quantity
      workOrderPart = await prisma.workOrderPart.update({
        where: { id: existingPart.id },
        data: {
          quantity: existingPart.quantity + quantity
        },
        include: {
          part: true
        }
      });
    } else {
      // Add new part to work order
      workOrderPart = await prisma.workOrderPart.create({
        data: {
          workOrderId: id,
          partId,
          quantity
        },
        include: {
          part: true
        }
      });
    }

    // Update part stock
    await prisma.part.update({
      where: { id: partId },
      data: {
        stockQuantity: part.stockQuantity - quantity
      }
    });

    // Update work order total cost
    const totalPartCost = part.price * quantity;
    await prisma.workOrder.update({
      where: { id },
      data: {
        totalCost: workOrder.totalCost + totalPartCost
      }
    });

    return workOrderPart;
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const removePartFromWorkOrder = async (
  request: FastifyRequest<{ 
    Params: { id: string; partId: string };
    Querystring: { quantity?: string } 
  }>,
  reply: FastifyReply
) => {
  const { id, partId } = request.params;
  const quantityToRemove = request.query.quantity ? parseInt(request.query.quantity) : undefined;
  try {
    // Check if part is in work order
    const workOrderPart = await prisma.workOrderPart.findFirst({
      where: {
        workOrderId: id,
        partId
      },
      include: {
        part: true
      }
    });
    if (!workOrderPart) {
      return reply.status(404).send({ error: 'Part not found in work order' });
    }
    // Get the work order
    const workOrder = await prisma.workOrder.findUnique({
      where: { id }
    });
    if (!workOrder) {
      return reply.status(404).send({ error: 'Work order not found' });
    }
    let updatedQuantity = 0;
    
    if (quantityToRemove && quantityToRemove < workOrderPart.quantity) {
      // Partial removal
      updatedQuantity = workOrderPart.quantity - quantityToRemove;
      
      await prisma.workOrderPart.update({
        where: { id: workOrderPart.id },
        data: {
          quantity: updatedQuantity
        }
      });
      // Return parts to inventory
      await prisma.part.update({
        where: { id: partId },
        data: {
          stockQuantity: workOrderPart.part.stockQuantity + quantityToRemove
        }
      });
      // Update work order cost
      const costReduction = workOrderPart.part.price * quantityToRemove;
      await prisma.workOrder.update({
        where: { id },
        data: {
          totalCost: workOrder.totalCost - costReduction
        }
      });
      return { 
        message: `Removed ${quantityToRemove} of part from work order`, 
        remainingQuantity: updatedQuantity 
      };
    } else {
      // Complete removal
      // Calculate total cost to remove
      const costReduction = workOrderPart.part.price * workOrderPart.quantity;
      
      // Return parts to inventory
      await prisma.part.update({
        where: { id: partId },
        data: {
          stockQuantity: workOrderPart.part.stockQuantity + workOrderPart.quantity
        }
      });
      
      // Remove the part from work order
      await prisma.workOrderPart.delete({
        where: { id: workOrderPart.id }
      });
      
      // Update work order cost
      await prisma.workOrder.update({
        where: { id },
        data: {
          totalCost: workOrder.totalCost - costReduction
        }
      });
      
      return { 
        message: 'Part completely removed from work order' 
      };
    }
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
};