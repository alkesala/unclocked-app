import { Request, Response, NextFunction } from "express"
import { TimeEntryService } from "./timeEntry.service"
import { StatusCodes } from "http-status-codes"
import { CreateTimeEntryInput } from "./timeEntry.types"

const createTimeEntry = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const body = req.body as CreateTimeEntryInput
        const created = await TimeEntryService.create(body)
        res.status(StatusCodes.CREATED).json(created)
    } catch (err) {
        next(err)
    }
}

const getAccountEntries = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const accountId = req.params.accountId
        if (!accountId) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: "missing accountId" })
        }

        const entries = await TimeEntryService.getByAccount(accountId)
        res.status(StatusCodes.OK).json(entries)
    } catch (err) {
        next(err)
    }
}

export const TimeEntryController = {
    createTimeEntry,
    getAccountEntries,
}
