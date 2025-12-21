import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { AuthService } from "./auth.service"

const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await AuthService.register(req.body)
        res.status(StatusCodes.CREATED).json(result)
    } catch (err) {
        if (err instanceof Error && err.message === "User already exists") {
            res.status(StatusCodes.CONFLICT).json({ error: err.message })
            return
        }
        next(err)
    }
}

const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await AuthService.login(req.body)
        res.status(StatusCodes.OK).json(result)
    } catch (err) {
        if (err instanceof Error && err.message === "Invalid credentials") {
            res.status(StatusCodes.UNAUTHORIZED).json({ error: err.message })
            return
        }
        next(err)
    }
}

const me = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.userId) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                error: "Unauthorized",
            })
            return
        }

        const user = await AuthService.getCurrentUser(req.userId)

        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({
                error: "User not found",
            })
            return
        }

        res.status(StatusCodes.OK).json(user)
    } catch (err) {
        next(err)
    }
}

export const AuthController = {
    register,
    login,
    me,
}
