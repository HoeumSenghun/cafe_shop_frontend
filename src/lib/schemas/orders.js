import { z } from 'zod'

export const ORDER_STATUS_VALUES = [
  'PENDING',
  'PAID',
  'PREPARING',
  'DONE',
  'CANCELLED'
]

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUS_VALUES)
})

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.coerce.number().int().positive(),
      quantity: z.coerce.number().int().min(1).default(1)
    })
  ).min(1)
})

export const createOrderFromProductSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(1).default(1)
})

export const ordersListQuerySchema = z.object({
  status: z.string().optional(),
  page: z.coerce.number().int().min(0).default(0),
  size: z.coerce.number().int().min(1).max(100).default(20)
})
