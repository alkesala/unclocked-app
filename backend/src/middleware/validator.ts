import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { AnyZodObject, ZodEffects, ZodError } from "zod"

const validator = (
    schema: AnyZodObject | ZodEffects<ZodEffects<AnyZodObject>>
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log("body recv", req.body)
        try {
            const parsed = await schema.parseAsync({
                body: req.body as unknown,
                query: req.query as unknown,
                params: req.params as unknown,
            })
            req.body = parsed.body
            req.params = parsed.params

            return next()
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
