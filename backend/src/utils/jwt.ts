import jwt, { type SignOptions } from "jsonwebtoken"

export interface TokenPayload {
    id: string
    email: string
    role: string
}

export const generateToken = (payload: TokenPayload): string => {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error("JWT_SECRET environment variable is not set")
    }

    return jwt.sign(payload, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as SignOptions)
}

export const verifyToken = (token: string): TokenPayload | null => {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error("JWT_SECRET environment variable is not set")
    }

    try {
        const decoded = jwt.verify(token, secret) as TokenPayload
        return decoded
    } catch {
        return null
    }
}
