import type { FastifyReply, FastifyRequest } from "fastify";
import type { createSupplierSchema, updateSupplierSchema } from "../utils/validation";
import { prisma } from "../utils/prisma";
import type { z } from "zod";

type CreateSupplierRequest = z.infer<typeof createSupplierSchema>
type UpdateSupplierRequest = z.infer<typeof updateSupplierSchema>

export const getSuppliers = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        parts: true
      }
    })
    return suppliers
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}

export const getSupplierById = async (
  request: FastifyRequest<{ Params: { id: string} }>,
  reply: FastifyReply
) => {
  const { id } = request.params
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        parts: true
      }
    })
    if (!supplier) {
      return reply.status(404).send({ error: 'Supplier not found' })
    }
    return supplier
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}

export const createSupplier = async (
  request: FastifyRequest<{ Body: CreateSupplierRequest }>,
  reply: FastifyReply
) => {
  const { name, email, phone, address } = request.body
  try {
    // Check if email already exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { email }
    })
    if (existingSupplier) {
      return reply.status(400).send({ error: 'Supplier with this email already exists' })
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        email,
        phone,
        address
      }
    })
    return supplier
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}

export const updateSupplier = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateSupplierRequest }>,
  reply: FastifyReply
) => {
  const { id } = request.params
  const updateData = request.body
  try {
    // Check if supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { id }
    })
    if (!supplier) {
      return reply.status(404).send({ error: 'Supplier not found' })
    }

    // Check if email is being updated and is unique
    if (updateData.email) {
      const existingSupplier = await prisma.supplier.findUnique({
        where: { email: updateData.email }
      })
      if (existingSupplier && existingSupplier.id !== id) {
        return reply.status(400).send({ error: 'Email is already in use by another supplier' })
      }
    }

    const updateSupplier = await prisma.supplier.update({
      where: { id },
      data: updateData
    })
    return updateSupplier
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}

export const deleteSupplier = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params
  try {
    // Check if supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { id }
    })
    if (!supplier) {
      return reply.status(404).send({ error: 'Supplier not found' })
    }

    // Check if supplier has any parts
    const supplierParts = await prisma.part.findMany({
      where: { supplierId: id }
    })
    if (supplierParts.length > 0) {
      return reply.status(400).send({
        error: 'Cannot delete supplier with associcated parts',
        partCount: supplierParts.length
      })
    }

    await prisma.supplier.delete({
      where: { id }
    })
    return { message: 'Supplier deleted successfully' }
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}