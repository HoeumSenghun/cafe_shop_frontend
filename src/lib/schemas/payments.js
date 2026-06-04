import { z } from 'zod'

export const PAYMENT_METHOD_VALUES = ['CASH', 'CARD', 'KHQR']

export const createPaymentSchema = z.object({
  orderId: z.coerce.number().int().positive(),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  method: z.enum(PAYMENT_METHOD_VALUES)
})
