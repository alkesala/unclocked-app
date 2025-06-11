import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { Types } from "mongoose"
import { TimeEntryService } from "./timeEntry.service"
import { TimeEntryFilterSchema } from "./timeEntry.validator"

const createTimeEntry = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.accountId) throw new Error("Unauthorized")

        const created = await TimeEntryService.create({
            ...req.body,
            account: req.accountId,
        })

        res.status(StatusCodes.CREATED).json(created)
    } catch (err) {
        next(err)
    }
}

const deleteTimeEntry = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { id } = req.params
    try {
        if (!req.accountId) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                error: "Unauthorized",
            })
            return
        }
        const deleted = await TimeEntryService.deleteById({
            id,
            accountId: req.accountId,
        })
        if (!deleted) {
            res.status(StatusCodes.NOT_FOUND).json({
                error: "Time entry not found or unauthorized",
            })
            return
        }

        res.status(StatusCodes.OK).json({ success: true, id })
    } catch (err) {
        next(err)
    }
}

const getEntries = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.accountId) throw new Error("Unauthorized")

        const filter = TimeEntryFilterSchema.parse(req.query)

        const result = await TimeEntryService.getAllEntries({
            ...filter,
            accountId: new Types.ObjectId(req.accountId),
        })

        res.status(StatusCodes.OK).json(result)
    } catch (err) {
        next(err)
    }
}

export const TimeEntryController = {
    createTimeEntry,
    deleteTimeEntry,
    getEntries,
}
