import { z } from "zod";

// Auth Schemas
export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'STAFF']).optional()
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

// Client Schemas
export const createClientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().optional()
})

export const updateClientSchema = createClientSchema.partial()

// Part Schemas
export const createPartSchema = z.object({
  name: z.string().min(2),
  serialNumber: z.string().optional(),
  price: z.number().positive(),
  stockQuantity: z.number().int().nonnegative(),
  supplierId: z.string()
})

export const updatePartSchema = createPartSchema.partial()

// Supplier Schemas
export const createSupplierSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().optional()
})

export const updateSupplierSchema = createSupplierSchema.partial()

// Repair Schemas
export const createRepairSchema = z.object({
  description: z.string().min(5),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  cost: z.number().positive(),
  workOrderId: z.string()
})

export const updateRepairSchema = createRepairSchema.partial()

// WorkOrder Schemas
export const createWorkOrderSchema = z.object({
  clientId: z.string(),
  description: z.string().min(5),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional()
})

export const updateWorkOrderSchema = createWorkOrderSchema.partial()

export const addPartToWorkOrderSchema = z.object({
  partId: z.string(),
  quantity: z.number().int().positive()
})

// User Schemas
export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.string().optional(),
});