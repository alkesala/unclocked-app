import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

const getStatus = (req: Request, res: Response) => {
    res.status(StatusCodes.OK).send("Backend is healthy")
}

export const statusController = {
    getStatus,
}
