import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email'),
  password: z.string().min(1, 'Password is required')
})

export const registerSchema = z.object({
  email: z.string().trim().email('Invalid email'),
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(120),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72)
})
