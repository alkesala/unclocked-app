import { TimeEntryFilterSchema } from "@shared/types/timeEntry"
import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { TimeEntryService } from "./timeEntry.service"

const createTimeEntry = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.accountId) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                error: "Unauthorized",
            })
            return
        }

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
                error: "Time entry not found",
            })
            return
        }
        res.status(StatusCodes.OK).json({ success: true, id })
    } catch (err) {
        next(err)
    }
}

const startTimeEntry = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.accountId) {
            res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" })
            return
        }
        const started = await TimeEntryService.startTimeEntry(
            req.body,
            req.accountId
        )
        res.status(StatusCodes.CREATED).json({ data: started })
    } catch (err) {
        next(err)
    }
}

const endTimeEntry = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.accountId) {
            res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" })
            return
        }
        const ended = await TimeEntryService.endTimeEntry(
            {
                params: req.params,
                body: req.body,
            },
            req.accountId
        )
        if (!ended) {
            res.status(StatusCodes.NOT_FOUND).json({
                error: "Time entry not found",
            })
            return
        }
        res.status(StatusCodes.OK).json(ended)
    } catch (err) {
        next(err)
    }
}

const getEntries = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.accountId) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                error: "Unauthorized",
            })
            return
        }
        const filter = TimeEntryFilterSchema.parse(req.query)
        const result = await TimeEntryService.getAllEntries({
            ...filter,
            accountId: req.accountId,
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
    endTimeEntry,
    startTimeEntry,
}
