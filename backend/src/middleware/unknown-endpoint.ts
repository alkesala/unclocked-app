import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

export const unknownEndpoint = (_req: Request, res: Response) => {
    res.status(StatusCodes.NOT_FOUND).json({
        message: "Unknown endpoint",
    })
}
