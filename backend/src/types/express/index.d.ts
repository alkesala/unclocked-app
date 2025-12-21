// src/types/express/index.d.ts
import "express-serve-static-core"

declare module "express-serve-static-core" {
    interface Request {
        /** User identifier (from JWT) */
        userId?: string
        /**
         * @deprecated Use userId instead - kept for backward compatibility
         * User identifier (same as userId)
         */
        accountId?: string
        /** User profile from JWT */
        user?: {
            name: string
            email: string
            role: "user" | "admin" | "superadmin"
        }
    }
}
