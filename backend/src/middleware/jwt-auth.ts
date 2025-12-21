import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { verifyToken } from "@/utils/jwt"

/**
 * JWT authentication middleware
 * Extracts and verifies JWT token from Authorization header
 * Sets req.userId, req.accountId (backward compatibility), and req.user
 */
export const jwtAuth = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            error: "Unauthorized - No token provided",
        })
        return
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    const payload = verifyToken(token)

    if (!payload) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            error: "Unauthorized - Invalid token",
        })
        return
    }

    // Set userId (new standard)
    req.userId = payload.id

    // Set accountId for backward compatibility
    req.accountId = payload.id

    // Set user object
    req.user = {
        name: "", // Will be populated from database if needed
        email: payload.email,
        role: payload.role as "user" | "admin" | "superadmin",
    }

    next()
}
