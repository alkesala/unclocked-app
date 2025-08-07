import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { z, ZodError } from "zod"

// Documentation purpose | not needed
type validator = {
    body?: unknown
    query?: unknown
    params?: unknown
}

const validator = <T extends z.ZodType<validator>>(schema: T) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body as unknown,
                query: req.query as unknown,
                params: req.params as unknown,
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = parsed as any
            if (result.body !== undefined) req.body = result.body
            if (result.params !== undefined) req.params = result.params

            next()
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    status: StatusCodes.BAD_REQUEST,
                    message: "request validation failed",
                    error,
                })
                return
            }
            return next(error)
        }
    }
}

export default validator
