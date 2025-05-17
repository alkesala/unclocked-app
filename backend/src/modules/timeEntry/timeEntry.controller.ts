import { Request, Response, NextFunction } from "express"
import { TimeEntryService } from "./timeEntry.service"
import { StatusCodes } from "http-status-codes"
import { GetTimeEntryParams } from "./timeEntry.types"
import { PaginationQuerySchema } from "../../types/request-filters"
import { TimeEntryFilterSchema } from "./timeEntry.validator"

const createTimeEntry = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const created = await TimeEntryService.create(req.body)
        res.status(StatusCodes.CREATED).json(created)
    } catch (err) {
        next(err)
    }
}

const deleteTimeEntry = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params
    try {
        const deleted = await TimeEntryService.deleteById(id)
        if (!deleted) {
            res.status(StatusCodes.NOT_FOUND).json({
                error: "Time entry not found",
            })
        }

        res.status(StatusCodes.OK).json({ success: true, id })
    } catch (err) {
        next(err)
    }
}

const getAccountEntries = async (
    req: Request<GetTimeEntryParams["params"]>,
    res: Response,
    next: NextFunction
) => {
    try {
        const filter = TimeEntryFilterSchema.parse({
            ...req.query,
            account: req.params.account,
        })
        const result = await TimeEntryService.getAllEntries(filter)
        res.status(StatusCodes.OK).json(result)
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
        const filter = PaginationQuerySchema.parse(req.query)
        const result = await TimeEntryService.getAllEntries(filter)
        res.status(StatusCodes.OK).json(result)
    } catch (err) {
        next(err)
    }
}

export const TimeEntryController = {
    createTimeEntry,
    deleteTimeEntry,
    getAccountEntries,
    getAllEntries,
}
