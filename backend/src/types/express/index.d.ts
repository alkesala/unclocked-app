// src/types/express/index.d.ts
import "express-serve-static-core"

declare module "express-serve-static-core" {
    interface Request {
        /** fake “user” identifier */
        accountId?: string
        /** fake user profile */
        user?: {
            name: string
            email: string
            role: "user" | "admin"
        }
    }
}
