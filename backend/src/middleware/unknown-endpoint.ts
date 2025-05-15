import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export const unknownEndpoint = (res: Response) => {
    res.status(StatusCodes.NOT_FOUND);
};
