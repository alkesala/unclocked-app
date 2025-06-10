import "express"

declare module "express" {
    interface Request {
        accountId?: string
        user?: {
            name: string
            email: string
            role: "user" | "admin"
        }
    }
}
