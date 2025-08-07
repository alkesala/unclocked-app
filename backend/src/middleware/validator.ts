import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { z, ZodError } from "zod"

const validator = <T extends z.ZodType>(schema: T) => {
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
            if (result.query !== undefined) req.query = result.query

            next()
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    status: StatusCodes.BAD_REQUEST,
                    message: "request validation failed",
                    error,
                })
            }
            return next(error)
        }
    }
}

export default validator
