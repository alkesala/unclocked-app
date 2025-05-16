import { Request, Response, NextFunction } from "express"
import { TimeEntryService } from "./timeEntry.service"
import { StatusCodes } from "http-status-codes"
import { CreateTimeEntryInput } from "./timeEntry.types"
import { getTimeEntryParams } from "./timeEntry.types"
import { baseFilterSchema } from "../../types/request-filters"

const createTimeEntry = async (
    req: Request<CreateTimeEntryInput["body"]>,
    res: Response,
    next: NextFunction
) => {
    try {
        const body = req.body
        const created = await TimeEntryService.create(body)
        res.status(StatusCodes.CREATED).json(created)
    } catch (err) {
        next(err)
    }
}

const getAccountEntries = async (
    req: Request<getTimeEntryParams["params"]>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { accountId } = req.params
        const entries = await TimeEntryService.getByAccount(accountId)
        res.status(StatusCodes.OK).json(entries)
    } catch (err) {
        next(err)
    }
}

const getAllEntries = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const filter = baseFilterSchema.parse(req.query)
        const entries = await TimeEntryService.getAllEntries(filter)
        res.status(StatusCodes.OK).json(entries)
    } catch (err) {
        next(err)
    }
}

export const TimeEntryController = {
    createTimeEntry,
    getAccountEntries,
    getAllEntries,
}
