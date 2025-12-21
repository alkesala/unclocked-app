import { z } from "zod"

// Login schema
export const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    }),
})

// Register schema
export const registerSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        name: z.string().min(2, "Name must be at least 2 characters"),
    }),
})

// Infer types for use in frontend and backend
export type LoginInput = z.infer<typeof loginSchema>["body"]
export type RegisterInput = z.infer<typeof registerSchema>["body"]

// Export schemas for validator middleware
export const AuthValidator = {
    loginSchema,
    registerSchema,
}
