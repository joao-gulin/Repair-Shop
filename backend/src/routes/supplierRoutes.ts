import type { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/auth";
import { createSupplier, deleteSupplier, getSupplierById, getSuppliers, updateSupplier } from "../controllers/supplierController";
import { createSupplierSchema, type updateSupplierSchema } from "../utils/validation";
import { validateRequest } from "../middleware/validate";
import type { z } from "zod";

export async function supplierRoutes(fastify: FastifyInstance) {
  // List Suppliers
  fastify.get("/", { preHandler: authenticate }, getSuppliers)

  // Get Supplier by ID
  fastify.get<{ Params: { id: string } }>(
    "/:id",
    { preHandler: authenticate },
    getSupplierById
  )

  // Create Supplier
  fastify.post<{ Body: z.infer<typeof createSupplierSchema> }>(
    "/",
    { preHandler: validateRequest(createSupplierSchema) },
    createSupplier
  )

  // Update Supplier
  fastify.put<{ Params: { id: string }; Body: z.infer<typeof updateSupplierSchema>}>(
    "/:id",
    { preHandler: authenticate },
    updateSupplier
  )

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: authenticate },
    deleteSupplier
  )
}