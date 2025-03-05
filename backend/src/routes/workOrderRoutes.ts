import type { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/auth";
import { addPartToWorkOrder, createWorkOrder, deleteWorkOrder, getWorkOrderById, getWorkOrders, removePartFromWorkOrder, updateWorkOrder } from "../controllers/workOrderController";
import { z } from "zod";
import { addPartToWorkOrderSchema, createWorkOrderSchema, updateWorkOrderSchema } from "../utils/validation";
import { validateRequest } from "../middleware/validate";

export async function workOrderRoutes(fastify: FastifyInstance) {
  // List Work Orders
  fastify.get("/", { preHandler: authenticate }, getWorkOrders)

  // Get Work Order by ID
  fastify.get<{ Params: { id: string } }>(
    "/:id",
    { preHandler: authenticate },
    getWorkOrderById
  )

  // Create Work Order
  fastify.post<{ Body: z.infer<typeof createWorkOrderSchema> }>(
    "/",
    { preHandler: validateRequest(createWorkOrderSchema) },
    createWorkOrder
  )

  // Update Work Order
  fastify.put<{ Params: { id: string }; Body: z.infer<typeof updateWorkOrderSchema> }>(
    "/:id",
    { preHandler: validateRequest(updateWorkOrderSchema) },
    updateWorkOrder
  )

  // Delete Work Order
  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: authenticate },
    deleteWorkOrder
  )

  // Add Part to Work Order
  fastify.post<{
    Params: { id: string }
    Body: z.infer<typeof addPartToWorkOrderSchema>
  }>(
    "/:id/parts",
    { preHandler: validateRequest(addPartToWorkOrderSchema) },
    addPartToWorkOrder
  )

  // Remove Part from Work Order
  fastify.delete<{
    Params: { id: string; partId: string }
    Querystring: { quantity?: string }
  }>(
    "/:id/parts/:partId",
    { preHandler: authenticate },
    removePartFromWorkOrder
  )
}